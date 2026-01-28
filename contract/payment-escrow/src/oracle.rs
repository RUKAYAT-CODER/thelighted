use soroban_sdk::{Env, Symbol, log};
use crate::storage::*;

pub fn refresh_from_oracle(env: &Env) {
    let oracle = env.storage().instance().get(&DataKey::Oracle).unwrap();
    let min: i128 = env.storage().instance().get(&DataKey::MinPrice).unwrap();
    let max: i128 = env.storage().instance().get(&DataKey::MaxPrice).unwrap();
    let default_price: i128 = env.storage().instance().get(&DataKey::DefaultPrice).unwrap();

    let now = env.ledger().timestamp();

    let result = oracle.call::<(i128, u64)>(
        &Symbol::new(env, "get_price"),
        ()
    );

    let (price, timestamp) = match result {
        Ok(v) => v,
        Err(_) => {
            log!(env, "Oracle failed – fallback activated");
            env.storage().instance().set(&DataKey::CurrentPrice, &default_price);
            return;
        }
    };

    if now - timestamp > STALE_THRESHOLD {
        panic!("Stale oracle data");
    }

    let bounded = price.clamp(min, max);

    env.storage().instance().set(&DataKey::CurrentPrice, &bounded);
    env.storage().instance().set(&DataKey::PriceTimestamp, &timestamp);

    push_history(env, bounded, timestamp);

    env.events().publish(
        (Symbol::new(env, "price_updated"),),
        (bounded, timestamp)
    );
}
