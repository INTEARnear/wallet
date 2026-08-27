use hmac::{Hmac, KeyInit, Mac};
use k256::elliptic_curve::ff::PrimeField;
use sha2::Sha512;

pub(crate) const HARDENED: u32 = 1 << 31;

pub(crate) fn hmac_sha512(key: &[u8], data: &[u8]) -> [u8; 64] {
    let mut mac = Hmac::<Sha512>::new_from_slice(key).expect("HMAC accepts any key size");
    mac.update(data);
    mac.finalize().into_bytes().into()
}

#[cfg(test)]
pub(crate) fn parse_path(path: &str) -> Option<Vec<u32>> {
    if path == "m" {
        return Some(Vec::new());
    }
    let rest = path.strip_prefix("m/")?;
    let mut indices = Vec::new();
    for segment in rest.split('/') {
        let hardened = segment.ends_with('\'') || segment.ends_with('H');
        let number: u32 = segment
            .trim_end_matches('\'')
            .trim_end_matches('H')
            .parse()
            .ok()?;
        indices.push(if hardened { number | HARDENED } else { number });
    }
    Some(indices)
}

pub(crate) fn derive_ed25519(seed: &[u8], path: &[u32]) -> Option<[u8; 32]> {
    let i = hmac_sha512(b"ed25519 seed", seed);
    let mut key: [u8; 32] = i[..32].try_into().unwrap();
    let mut chain_code: [u8; 32] = i[32..].try_into().unwrap();

    for &index in path {
        if index < HARDENED {
            return None;
        }
        let mut data = Vec::with_capacity(37);
        data.push(0);
        data.extend_from_slice(&key);
        data.extend_from_slice(&index.to_be_bytes());
        let i = hmac_sha512(&chain_code, &data);
        key = i[..32].try_into().unwrap();
        chain_code = i[32..].try_into().unwrap();
    }

    Some(key)
}

pub(crate) fn derive_secp256k1(seed: &[u8], path: &[u32]) -> Option<[u8; 32]> {
    let mut data = seed.to_vec();
    let (mut secret_key, mut chain_code) = loop {
        let i = hmac_sha512(b"Bitcoin seed", &data);
        let il: [u8; 32] = i[..32].try_into().unwrap();
        let ir: [u8; 32] = i[32..].try_into().unwrap();
        if let Ok(secret_key) = k256::SecretKey::from_bytes(&il.into()) {
            break (secret_key, ir);
        }
        data = i.to_vec();
    };

    for &index in path {
        let mut hmac_data = Vec::with_capacity(37);
        if index & HARDENED == 0 {
            return None;
        }
        hmac_data.push(0);
        hmac_data.extend_from_slice(secret_key.to_bytes().as_slice());
        hmac_data.extend_from_slice(&index.to_be_bytes());
        let i = hmac_sha512(&chain_code, &hmac_data);
        let il: [u8; 32] = i[..32].try_into().unwrap();
        let ir: [u8; 32] = i[32..].try_into().unwrap();
        let il_scalar = k256::Scalar::from_repr(il.into()).into_option()?;
        let sum = *secret_key.to_nonzero_scalar() + il_scalar;
        let child = k256::NonZeroScalar::new(sum).into_option()?;
        secret_key = k256::SecretKey::from(child);
        chain_code = ir;
    }

    let bytes: [u8; 32] = secret_key.to_bytes().into();
    Some(bytes)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn decode_hex(hex: &str) -> Vec<u8> {
        (0..hex.len())
            .step_by(2)
            .map(|i| u8::from_str_radix(&hex[i..i + 2], 16).unwrap())
            .collect()
    }

    fn encode_hex(bytes: &[u8]) -> String {
        bytes.iter().map(|byte| format!("{byte:02x}")).collect()
    }

    #[test]
    fn ed25519_slip10_vector_1() {
        let seed = decode_hex("000102030405060708090a0b0c0d0e0f");

        let master = derive_ed25519(&seed, &[]).unwrap();
        assert_eq!(
            encode_hex(&master),
            "2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7"
        );

        let child = derive_ed25519(&seed, &parse_path("m/0'").unwrap()).unwrap();
        assert_eq!(
            encode_hex(&child),
            "68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3"
        );
    }

    #[test]
    fn secp256k1_slip10_vector_1() {
        let seed = decode_hex("000102030405060708090a0b0c0d0e0f");

        let master = derive_secp256k1(&seed, &[]).unwrap();
        assert_eq!(
            encode_hex(&master),
            "e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35"
        );

        let child = derive_secp256k1(&seed, &parse_path("m/0'").unwrap()).unwrap();
        assert_eq!(
            encode_hex(&child),
            "edb2e14f9ee77d26dd93b4ecede8d16ed408ce149b6cd80b0715a2d911a0afea"
        );
    }
}
