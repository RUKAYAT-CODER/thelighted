#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn create_pool_works() {
        let e = Env::default();
        let token_a = Address::generate(&e);
        let token_b = Address::generate(&e);

        let result = LoyaltyDexContract::create_pool(e, token_a, token_b);
        assert!(result.is_ok());
    }
}
