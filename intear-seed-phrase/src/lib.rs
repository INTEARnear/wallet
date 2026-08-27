mod slip10;

use bip39::Mnemonic;
use near_crypto::{ED25519SecretKey, KeyType, SecretKey};

use crate::slip10::{HARDENED, derive_ed25519, derive_secp256k1, hmac_sha512};

pub const WORD_COUNT: usize = 12;

#[allow(clippy::identity_op)]
const HD_PATH: [u32; 3] = [44 | HARDENED, 397 | HARDENED, 0 | HARDENED];

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum SeedToKeyError {
    #[error("invalid mnemonic")]
    InvalidMnemonic,
    #[error("key derivation failed")]
    DerivationFailed,
    #[error("MLDSA65 is not supported")]
    MLDSA65IsNotSupported,
}

#[derive(Debug, Clone, PartialEq, Eq, thiserror::Error)]
pub enum GenerateError {
    #[error("MLDSA65 is not supported")]
    MLDSA65IsNotSupported,
}

pub fn english_wordlist() -> &'static [&'static str] {
    bip39::Language::English.word_list()
}

pub fn generate(key_type: KeyType) -> Result<(String, SecretKey), GenerateError> {
    let mnemonic = Mnemonic::generate(WORD_COUNT).unwrap();
    let phrase = mnemonic.to_string();
    let seed = mnemonic.to_seed("");
    let secret_key = secret_key_from_seed(&seed, key_type).map_err(|e| match e {
        SeedToKeyError::MLDSA65IsNotSupported => GenerateError::MLDSA65IsNotSupported,
        other => panic!("unexpected error: {other:?}"),
    })?;
    Ok((phrase, secret_key))
}

pub fn secret_keys_from_phrase(phrase: &str) -> Result<Vec<SecretKey>, SeedToKeyError> {
    let mnemonic =
        Mnemonic::parse(phrase.to_lowercase()).map_err(|_| SeedToKeyError::InvalidMnemonic)?;
    let seed = mnemonic.to_seed("");
    Ok(vec![
        secret_key_from_seed(&seed, KeyType::ED25519)?,
        secret_key_from_seed(&seed, KeyType::SECP256K1)?,
        secret_key_from_seed_intear_mldsa65(&seed)?,
    ])
}
fn secret_key_from_seed(seed: &[u8], key_type: KeyType) -> Result<SecretKey, SeedToKeyError> {
    match key_type {
        KeyType::ED25519 => {
            let key = derive_ed25519(seed, &HD_PATH).ok_or(SeedToKeyError::DerivationFailed)?;
            let signing_key = ed25519_dalek::SigningKey::from_bytes(&key);
            Ok(SecretKey::ED25519(ED25519SecretKey(
                signing_key.to_keypair_bytes(),
            )))
        }
        KeyType::SECP256K1 => {
            let key = derive_secp256k1(seed, &HD_PATH).ok_or(SeedToKeyError::DerivationFailed)?;
            format!("secp256k1:{}", bs58::encode(key).into_string())
                .parse()
                .map_err(|_| SeedToKeyError::DerivationFailed)
        }
        KeyType::MLDSA65 => Err(SeedToKeyError::MLDSA65IsNotSupported),
    }
}

fn secret_key_from_seed_intear_mldsa65(seed: &[u8]) -> Result<SecretKey, SeedToKeyError> {
    let hmac = hmac_sha512(b"Intear seed", seed);
    let mut mldsa_seed = [0u8; 32];
    mldsa_seed.copy_from_slice(&hmac[..32]);
    near_crypto::ml_dsa_65_from_seed(&mldsa_seed).map_err(|_| SeedToKeyError::DerivationFailed)
}

#[cfg(test)]
mod tests {
    use super::*;

    const TEST_PHRASE: &str = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

    #[test]
    fn generate_ed25519_round_trips_through_phrase() {
        let (phrase, generated) = generate(KeyType::ED25519).unwrap();
        let keys = secret_keys_from_phrase(&phrase).unwrap();
        assert_eq!(keys[0], generated);
        assert!(matches!(keys[0].key_type(), KeyType::ED25519));
        assert!(matches!(keys[1].key_type(), KeyType::SECP256K1));
        assert!(matches!(keys[2].key_type(), KeyType::MLDSA65));
    }

    #[test]
    fn secret_keys_from_phrase_rejects_invalid_mnemonic() {
        assert_eq!(
            secret_keys_from_phrase("not a mnemonic"),
            Err(SeedToKeyError::InvalidMnemonic)
        );
    }

    #[test]
    fn mldsa65_is_deterministic() {
        let first = secret_keys_from_phrase(TEST_PHRASE).unwrap();
        let second = secret_keys_from_phrase(TEST_PHRASE).unwrap();
        assert_eq!(first[2], second[2]);

        let (other_phrase, _) = generate(KeyType::ED25519).unwrap();
        let other = secret_keys_from_phrase(&other_phrase).unwrap();
        assert_ne!(first[2], other[2]);
    }
}
