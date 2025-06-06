pub mod dec_format {
    use std::{fmt::Display, str::FromStr};

    use serde::{Deserialize, Deserializer, Serializer, de};

    pub fn serialize<S, T>(value: &T, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
        T: ?Sized + ToString,
    {
        serializer.serialize_str(&value.to_string())
    }

    pub fn deserialize<'de, D, T, E>(deserializer: D) -> Result<T, D::Error>
    where
        D: Deserializer<'de>,
        T: Deserialize<'de> + FromStr<Err = E>,
        E: Display,
    {
        match serde_json::Value::deserialize(deserializer) {
            Ok(serde_json::Value::String(s)) => T::from_str(&s).map_err(de::Error::custom),
            Ok(serde_json::Value::Number(n)) => {
                let s = n.to_string();
                T::from_str(&s).map_err(de::Error::custom)
            }
            Ok(other) => Err(de::Error::custom(format!(
                "expected a string, got {other:?}"
            ))),
            Err(e) => Err(e),
        }
    }
}
