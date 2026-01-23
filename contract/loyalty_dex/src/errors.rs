use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum DexError {
    PoolAlreadyExists = 1,
    PoolNotFound = 2,
    InvalidAmount = 3,
    InsufficientLiquidity = 4,
    SlippageExceeded = 5,
    InvalidTokenPair = 6,
    Unauthorized = 7,
}
