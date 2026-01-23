use soroban_sdk::{contracttype, Address, Env, Map};
use crate::types::{LiquidityPositionKey, Pool, PoolKey};

#[contracttype]
pub enum DataKey {
    Pools,
    LpBalances,
}

pub fn pools_map(e: &Env) -> Map<PoolKey, Pool> {
    e.storage()
        .persistent()
        .get(&DataKey::Pools)
        .unwrap_or(Map::new(e))
}

pub fn set_pools_map(e: &Env, pools: &Map<PoolKey, Pool>) {
    e.storage().persistent().set(&DataKey::Pools, pools);
}

pub fn lp_balances_map(e: &Env) -> Map<LiquidityPositionKey, i128> {
    e.storage()
        .persistent()
        .get(&DataKey::LpBalances)
        .unwrap_or(Map::new(e))
}

pub fn set_lp_balances_map(e: &Env, balances: &Map<LiquidityPositionKey, i128>) {
    e.storage().persistent().set(&DataKey::LpBalances, balances);
}

pub fn normalize_key(a: &Address, b: &Address) -> PoolKey {
    // ensures consistent ordering for pool keys
    if a.to_string() < b.to_string() {
        PoolKey { token_a: a.clone(), token_b: b.clone() }
    } else {
        PoolKey { token_a: b.clone(), token_b: a.clone() }
    }
}
