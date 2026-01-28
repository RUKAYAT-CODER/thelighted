use soroban_sdk::{Env, Address, Vec, contracttype};

pub const MAX_HISTORY: u32 = 100;
pub const STALE_THRESHOLD: u64 = 60 * 60;

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    Oracle,
    MinPrice,
    MaxPrice,
    CurrentPrice,
    DefaultPrice,
    PriceTimestamp,
    PriceHistory,
}

#[derive(Clone)]
#[contracttype]
pub struct PriceEntry {
    pub price: i128,
    pub timestamp: u64,
}

/* ---------- ADMIN ---------- */

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&DataKey::Admin, admin);
}

pub fn require_admin(env: &Env) {
    let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
    admin.require_auth();
}

/* ---------- PRICES ---------- */

pub fn set_oracle(env: &Env, oracle: Address) {
    env.storage().instance().set(&DataKey::Oracle, &oracle);
}

pub fn set_default_price(env: &Env, price: i128) {
    env.storage().instance().set(&DataKey::DefaultPrice, &price);
}

pub fn set_bounds(env: &Env, min: i128, max: i128) {
    assert!(min > 0 && max > min, "Invalid bounds");
    env.storage().instance().set(&DataKey::MinPrice, &min);
    env.storage().instance().set(&DataKey::MaxPrice, &max);
}

pub fn get_current_price(env: &Env) -> i128 {
    env.storage()
        .instance()
        .get(&DataKey::CurrentPrice)
        .unwrap_or(
            env.storage().instance().get(&DataKey::DefaultPrice).unwrap()
        )
}

/* ---------- HISTORY ---------- */

pub fn push_history(env: &Env, price: i128, timestamp: u64) {
    let mut history: Vec<PriceEntry> =
        env.storage().instance().get(&DataKey::PriceHistory).unwrap_or(Vec::new(env));

    if history.len() >= MAX_HISTORY {
        history.remove(0);
    }

    history.push_back(PriceEntry { price, timestamp });
    env.storage().instance().set(&DataKey::PriceHistory, &history);
}

pub fn get_history(env: &Env) -> Vec<PriceEntry> {
    env.storage()
        .instance()
        .get(&DataKey::PriceHistory)
        .unwrap_or(Vec::new(env))
}
