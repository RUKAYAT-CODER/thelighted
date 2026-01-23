use soroban_sdk::{contracttype, Address};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PoolKey {
    pub token_a: Address,
    pub token_b: Address,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Pool {
    pub token_a: Address,
    pub token_b: Address,
    pub reserve_a: i128,
    pub reserve_b: i128,
    pub lp_supply: i128,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct LiquidityPositionKey {
    pub pool: PoolKey,
    pub provider: Address,
}
