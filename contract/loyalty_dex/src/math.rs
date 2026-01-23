use crate::errors::DexError;

pub const FEE_NUM: i128 = 997; // 0.3% fee -> user gets 99.7% effective in
pub const FEE_DEN: i128 = 1000;

pub fn checked_positive(amount: i128) -> Result<(), DexError> {
    if amount <= 0 {
        return Err(DexError::InvalidAmount);
    }
    Ok(())
}

// integer sqrt (Babylonian)
pub fn isqrt(x: i128) -> i128 {
    if x <= 0 { return 0; }
    let mut z = x;
    let mut y = (z + 1) / 2;
    while y < z {
        z = y;
        y = (x / y + y) / 2;
    }
    z
}

// LP mint formula:
// - initial: sqrt(a*b)
// - later: min(a * supply / reserveA, b * supply / reserveB)
pub fn lp_mint_amount(
    deposit_a: i128,
    deposit_b: i128,
    reserve_a: i128,
    reserve_b: i128,
    total_lp_supply: i128,
) -> i128 {
    if total_lp_supply == 0 {
        isqrt(deposit_a * deposit_b)
    } else {
        let mint_a = deposit_a * total_lp_supply / reserve_a;
        let mint_b = deposit_b * total_lp_supply / reserve_b;
        if mint_a < mint_b { mint_a } else { mint_b }
    }
}

// swap output using constant product with fee
pub fn get_amount_out(amount_in: i128, reserve_in: i128, reserve_out: i128) -> i128 {
    let amount_in_with_fee = amount_in * FEE_NUM;
    let numerator = amount_in_with_fee * reserve_out;
    let denominator = reserve_in * FEE_DEN + amount_in_with_fee;
    numerator / denominator
}
