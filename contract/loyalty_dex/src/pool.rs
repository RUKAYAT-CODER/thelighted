use soroban_sdk::{Address, Env};
use crate::{
    errors::DexError,
    events,
    math::{checked_positive, get_amount_out, lp_mint_amount},
    storage::{lp_balances_map, normalize_key, pools_map, set_lp_balances_map, set_pools_map},
    types::{LiquidityPositionKey, Pool, PoolKey},
};

pub fn create_pool(e: &Env, token_a: Address, token_b: Address) -> Result<(), DexError> {
    if token_a == token_b {
        return Err(DexError::InvalidTokenPair);
    }

    let key = normalize_key(&token_a, &token_b);
    let mut pools = pools_map(e);

    if pools.contains_key(key.clone()) {
        return Err(DexError::PoolAlreadyExists);
    }

    pools.set(
        key.clone(),
        Pool {
            token_a: key.token_a.clone(),
            token_b: key.token_b.clone(),
            reserve_a: 0,
            reserve_b: 0,
            lp_supply: 0,
        },
    );

    set_pools_map(e, &pools);
    events::emit_pool_created(e, &key);

    Ok(())
}

pub fn add_liquidity(
    e: &Env,
    provider: Address,
    token_a: Address,
    token_b: Address,
    amount_a: i128,
    amount_b: i128,
) -> Result<i128, DexError> {
    checked_positive(amount_a)?;
    checked_positive(amount_b)?;

    let key = normalize_key(&token_a, &token_b);
    let mut pools = pools_map(e);

    let mut pool = pools.get(key.clone()).ok_or(DexError::PoolNotFound)?;

    // NOTE: token transfers should happen via token contract `transfer(...)`
    // This example focuses on pool accounting logic.

    let mint_lp = lp_mint_amount(amount_a, amount_b, pool.reserve_a, pool.reserve_b, pool.lp_supply);
    if mint_lp <= 0 {
        return Err(DexError::InvalidAmount);
    }

    pool.reserve_a += amount_a;
    pool.reserve_b += amount_b;
    pool.lp_supply += mint_lp;

    pools.set(key.clone(), pool.clone());
    set_pools_map(e, &pools);

    let mut balances = lp_balances_map(e);
    let lp_key = LiquidityPositionKey { pool: key.clone(), provider: provider.clone() };
    let existing = balances.get(lp_key.clone()).unwrap_or(0);
    balances.set(lp_key, existing + mint_lp);
    set_lp_balances_map(e, &balances);

    events::emit_liquidity_added(e, &provider, &key, mint_lp);
    Ok(mint_lp)
}

pub fn get_exchange_rate(
    e: &Env,
    token_a: Address,
    token_b: Address,
) -> Result<(i128, i128), DexError> {
    let key = normalize_key(&token_a, &token_b);
    let pools = pools_map(e);
    let pool = pools.get(key).ok_or(DexError::PoolNotFound)?;

    if pool.reserve_a <= 0 || pool.reserve_b <= 0 {
        return Err(DexError::InsufficientLiquidity);
    }

    // rate represented as (numerator, denominator)
    // price token_a in terms of token_b = reserve_b/reserve_a
    Ok((pool.reserve_b, pool.reserve_a))
}

pub fn swap(
    e: &Env,
    trader: Address,
    from_token: Address,
    to_token: Address,
    amount_in: i128,
    min_amount_out: i128, // ✅ slippage protection
) -> Result<i128, DexError> {
    checked_positive(amount_in)?;
    checked_positive(min_amount_out)?;

    let key = normalize_key(&from_token, &to_token);
    let mut pools = pools_map(e);
    let mut pool = pools.get(key.clone()).ok_or(DexError::PoolNotFound)?;

    let (reserve_in, reserve_out, is_a_to_b) = if from_token == pool.token_a && to_token == pool.token_b {
        (pool.reserve_a, pool.reserve_b, true)
    } else if from_token == pool.token_b && to_token == pool.token_a {
        (pool.reserve_b, pool.reserve_a, false)
    } else {
        return Err(DexError::InvalidTokenPair);
    };

    if reserve_in <= 0 || reserve_out <= 0 {
        return Err(DexError::InsufficientLiquidity);
    }

    let amount_out = get_amount_out(amount_in, reserve_in, reserve_out);
    if amount_out <= 0 {
        return Err(DexError::InvalidAmount);
    }

    // ✅ slippage protection
    if amount_out < min_amount_out {
        return Err(DexError::SlippageExceeded);
    }

    // update reserves
    if is_a_to_b {
        pool.reserve_a += amount_in;
        pool.reserve_b -= amount_out;
    } else {
        pool.reserve_b += amount_in;
        pool.reserve_a -= amount_out;
    }

    if pool.reserve_a <= 0 || pool.reserve_b <= 0 {
        return Err(DexError::InsufficientLiquidity);
    }

    pools.set(key.clone(), pool.clone());
    set_pools_map(e, &pools);

    events::emit_swap(e, &trader, &from_token, &to_token, amount_in, amount_out);
    Ok(amount_out)
}

pub fn remove_liquidity(
    e: &Env,
    provider: Address,
    token_a: Address,
    token_b: Address,
    lp_amount: i128,
) -> Result<(i128, i128), DexError> {
    checked_positive(lp_amount)?;

    let key = normalize_key(&token_a, &token_b);
    let mut pools = pools_map(e);
    let mut pool = pools.get(key.clone()).ok_or(DexError::PoolNotFound)?;

    if pool.lp_supply <= 0 {
        return Err(DexError::InsufficientLiquidity);
    }

    let mut balances = lp_balances_map(e);
    let lp_key = LiquidityPositionKey { pool: key.clone(), provider: provider.clone() };
    let owned = balances.get(lp_key.clone()).unwrap_or(0);

    if owned < lp_amount {
        return Err(DexError::Unauthorized);
    }

    // Withdraw proportional share
    let amount_a = lp_amount * pool.reserve_a / pool.lp_supply;
    let amount_b = lp_amount * pool.reserve_b / pool.lp_supply;

    pool.reserve_a -= amount_a;
    pool.reserve_b -= amount_b;
    pool.lp_supply -= lp_amount;

    pools.set(key.clone(), pool.clone());
    set_pools_map(e, &pools);

    balances.set(lp_key, owned - lp_amount);
    set_lp_balances_map(e, &balances);

    events::emit_liquidity_removed(e, &provider, &key, lp_amount);

    Ok((amount_a, amount_b))
}
