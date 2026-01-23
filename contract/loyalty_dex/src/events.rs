use soroban_sdk::{Env, Address};
use crate::types::PoolKey;

pub fn emit_pool_created(e: &Env, pool: &PoolKey) {
    e.events().publish(("pool_created",), (pool.token_a.clone(), pool.token_b.clone()));
}

pub fn emit_liquidity_added(e: &Env, provider: &Address, pool: &PoolKey, lp_minted: i128) {
    e.events().publish(("liquidity_added",), (provider.clone(), pool.token_a.clone(), pool.token_b.clone(), lp_minted));
}

pub fn emit_liquidity_removed(e: &Env, provider: &Address, pool: &PoolKey, lp_burned: i128) {
    e.events().publish(("liquidity_removed",), (provider.clone(), pool.token_a.clone(), pool.token_b.clone(), lp_burned));
}

pub fn emit_swap(e: &Env, trader: &Address, from_token: &Address, to_token: &Address, amount_in: i128, amount_out: i128) {
    e.events().publish(("swap",), (trader.clone(), from_token.clone(), to_token.clone(), amount_in, amount_out));
}
