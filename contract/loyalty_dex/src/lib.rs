#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env};

mod errors;
mod events;
mod math;
mod pool;
mod storage;
mod types;

use errors::DexError;

#[contract]
pub struct LoyaltyDexContract;

#[contractimpl]
impl LoyaltyDexContract {
    pub fn create_pool(e: Env, token_a: Address, token_b: Address) -> Result<(), DexError> {
        pool::create_pool(&e, token_a, token_b)
    }

    pub fn add_liquidity(
        e: Env,
        provider: Address,
        token_a: Address,
        token_b: Address,
        token_a_amount: i128,
        token_b_amount: i128,
    ) -> Result<i128, DexError> {
        pool::add_liquidity(&e, provider, token_a, token_b, token_a_amount, token_b_amount)
    }

    pub fn swap(
        e: Env,
        trader: Address,
        from_token: Address,
        to_token: Address,
        amount: i128,
        min_amount_out: i128,
    ) -> Result<i128, DexError> {
        pool::swap(&e, trader, from_token, to_token, amount, min_amount_out)
    }

    pub fn get_exchange_rate(
        e: Env,
        token_a: Address,
        token_b: Address,
    ) -> Result<(i128, i128), DexError> {
        pool::get_exchange_rate(&e, token_a, token_b)
    }

    pub fn remove_liquidity(
        e: Env,
        provider: Address,
        token_a: Address,
        token_b: Address,
        amount: i128,
    ) -> Result<(i128, i128), DexError> {
        pool::remove_liquidity(&e, provider, token_a, token_b, amount)
    }
}
