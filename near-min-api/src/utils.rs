/// Serializes number as a string; deserializes either as a string or number.
///
/// This format works for `u64`, `u128`, `Option<u64>` and `Option<u128>` types.
/// When serializing, numbers are serialized as decimal strings.  When
/// deserializing, strings are parsed as decimal numbers while numbers are
/// interpreted as is.
pub mod dec_format {
    use serde::de;
    use serde::{Deserializer, Serializer};

    #[derive(thiserror::Error, Debug)]
    #[error("cannot parse from unit")]
    pub struct ParseUnitError;

    /// Abstraction between integers that we serialize.
    pub trait DecType: Sized {
        /// Formats number as a decimal string; passes `None` as is.
        fn serialize(&self) -> Option<String>;

        /// Constructs Self from a `null` value.  Returns error if this type
        /// does not accept `null` values.
        fn try_from_unit() -> Result<Self, ParseUnitError> {
            Err(ParseUnitError)
        }

        /// Tries to parse decimal string as an integer.
        fn try_from_str(value: &str) -> Result<Self, std::num::ParseIntError>;

        /// Constructs Self from a 64-bit unsigned integer.
        fn from_u64(value: u64) -> Self;
    }

    macro_rules! impl_dec_type {
        ($type:ty) => {
            impl DecType for $type {
                fn serialize(&self) -> Option<String> {
                    Some(self.to_string())
                }
                fn try_from_str(value: &str) -> Result<Self, std::num::ParseIntError> {
                    Self::from_str_radix(value, 10)
                }
                fn from_u64(value: u64) -> Self {
                    <$type>::try_from(value).unwrap_or_else(|_| {
                        panic!("Number out of bounds for {}", stringify!($type))
                    })
                }
            }
        };
    }

    impl_dec_type!(i8);
    impl_dec_type!(i16);
    impl_dec_type!(i32);
    impl_dec_type!(i64);
    impl_dec_type!(i128);
    impl_dec_type!(u8);
    impl_dec_type!(u16);
    impl_dec_type!(u32);
    impl_dec_type!(u64);
    impl_dec_type!(u128);

    impl<T: DecType> DecType for Option<T> {
        fn serialize(&self) -> Option<String> {
            self.as_ref().and_then(DecType::serialize)
        }
        fn try_from_unit() -> Result<Self, ParseUnitError> {
            Ok(None)
        }
        fn try_from_str(value: &str) -> Result<Self, std::num::ParseIntError> {
            Some(T::try_from_str(value)).transpose()
        }
        fn from_u64(value: u64) -> Self {
            Some(T::from_u64(value))
        }
    }

    struct Visitor<T>(core::marker::PhantomData<T>);

    impl<'de, T: DecType> de::Visitor<'de> for Visitor<T> {
        type Value = T;

        fn expecting(&self, fmt: &mut std::fmt::Formatter) -> std::fmt::Result {
            fmt.write_str("a non-negative integer as a string")
        }

        fn visit_unit<E: de::Error>(self) -> Result<T, E> {
            T::try_from_unit().map_err(|_| de::Error::invalid_type(de::Unexpected::Option, &self))
        }

        fn visit_u64<E: de::Error>(self, value: u64) -> Result<T, E> {
            Ok(T::from_u64(value))
        }

        fn visit_str<E: de::Error>(self, value: &str) -> Result<T, E> {
            T::try_from_str(value).map_err(de::Error::custom)
        }
    }

    pub fn deserialize<'de, D, T>(deserializer: D) -> Result<T, D::Error>
    where
        D: Deserializer<'de>,
        T: DecType,
    {
        deserializer.deserialize_any(Visitor(Default::default()))
    }

    pub fn serialize<S, T>(num: &T, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
        T: DecType,
    {
        match num.serialize() {
            Some(value) => serializer.serialize_str(&value),
            None => serializer.serialize_none(),
        }
    }
}

pub mod dec_format_vec {
    use std::{fmt::Display, str::FromStr};

    use serde::{de, Deserialize, Deserializer, Serialize, Serializer};

    pub fn serialize<S, T>(value: &[T], serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
        T: ToString,
    {
        let vec_of_strings = value
            .iter()
            .map(|item| item.to_string())
            .collect::<Vec<String>>();
        vec_of_strings.serialize(serializer)
    }

    pub fn deserialize<'de, D, T, E>(deserializer: D) -> Result<Vec<T>, D::Error>
    where
        D: Deserializer<'de>,
        T: FromStr<Err = E>,
        E: Display,
    {
        let vec_of_strings = Vec::<String>::deserialize(deserializer)?;
        let vec = vec_of_strings
            .iter()
            .map(|item| T::from_str(item).map_err(de::Error::custom))
            .collect::<Result<Vec<T>, D::Error>>()?;
        Ok(vec)
    }
}
