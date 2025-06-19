#![allow(clippy::all)]

use base64::Engine;
use base64::display::Base64Display;
use base64::engine::GeneralPurpose;
use base64::prelude::BASE64_STANDARD;
use borsh::{BorshDeserialize, BorshSerialize};
use chrono::{DateTime, Utc};
pub use near_crypto;
use near_crypto::{PublicKey, Signature, Signer};
use serde::de::Error as DeError;
use serde::ser::Error as SerError;
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use serde_with::base64::Base64;
use sha2::Digest;
use std::borrow::{Borrow, Cow};
use std::collections::{BTreeMap, HashMap};
use std::fmt::{self, Debug, Display};
use std::hash::{Hash, Hasher};
use std::io::{self, Read, Write};
use std::ops::{Add, Range, RangeInclusive};
use std::str::FromStr;
use std::sync::Arc;
use std::time::Duration;
use std::{num::ParseIntError, sync::LazyLock};
use validator_stake_view::ValidatorStakeView;

use crate::utils::dec_format;

pub use near_account_id::{self, AccountId, AccountIdRef};
pub use near_gas::{self, NearGas};
pub use near_token::{self, NearToken};
use serde_with::serde_as;
/// Hash used by a struct implementing the Merkle tree.
pub type MerkleHash = CryptoHash;
/// Validator identifier in current group.
pub type ValidatorId = u64;
/// Mask which validators participated in multi sign.
pub type ValidatorMask = Vec<bool>;
/// StorageUsage is used to count the amount of storage used by a contract.
pub type StorageUsage = u64;
/// StorageUsageChange is used to count the storage usage within a single contract call.
pub type StorageUsageChange = i64;
/// Nonce for transactions.
pub type Nonce = u64;
/// Height of the block.
pub type BlockHeight = u64;
/// Height of the epoch.
pub type EpochHeight = u64;
/// Balance is type for storing amounts of tokens.
pub type Balance = u128;
/// Gas is a type for storing amount of gas.
pub type Gas = u64;
/// Compute is a type for storing compute time. Measured in femtoseconds (10^-15 seconds).
pub type Compute = u64;

/// Weight of unused gas to distribute to scheduled function call actions.
/// Used in `promise_batch_action_function_call_weight` host function.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct GasWeight(pub u64);

/// Number of blocks in current group.
pub type NumBlocks = u64;
/// Number of shards in current group.
pub type NumShards = u64;
/// Number of seats of validators (block producer or hidden ones) in current group (settlement).
pub type NumSeats = u64;
/// Block height delta that measures the difference between `BlockHeight`s.
pub type BlockHeightDelta = u64;

pub type ReceiptIndex = usize;
pub type PromiseId = Vec<ReceiptIndex>;

pub type ProtocolVersion = u32;

/// The ShardIndex is the index of the shard in an array of shard data.
/// Historically the ShardId was always in the range 0..NUM_SHARDS and was used
/// as the shard index. This is no longer the case, and the ShardIndex should be
/// used instead.
pub type ShardIndex = usize;

/// The shard identifier. It may be an arbitrary number - it does not need to be
/// a number in the range 0..NUM_SHARDS. The shard ids do not need to be
/// sequential or contiguous.
///
/// The shard id is wrapped in a new type to prevent the old pattern of using
/// indices in range 0..NUM_SHARDS and casting to ShardId. Once the transition
/// if fully complete it potentially may be simplified to a regular type alias.
#[derive(
    borsh::BorshSerialize,
    borsh::BorshDeserialize,
    Serialize,
    Deserialize,
    Hash,
    Clone,
    Copy,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
)]
pub struct ShardId(u64);

impl ShardId {
    /// Create a new shard id. Please note that this function should not be used
    /// to convert a shard index (a number in 0..num_shards range) to ShardId.
    /// Instead the ShardId should be obtained from the shard_layout.
    ///
    /// ```rust, ignore
    /// // BAD USAGE:
    /// for shard_index in 0..num_shards {
    ///     let shard_id = ShardId::new(shard_index); // Incorrect!!!
    /// }
    /// ```
    /// ```rust, ignore
    /// // GOOD USAGE 1:
    /// for shard_index in 0..num_shards {
    ///     let shard_id = shard_layout.get_shard_id(shard_index);
    /// }
    /// // GOOD USAGE 2:
    /// for shard_id in shard_layout.shard_ids() {
    ///     let shard_id = shard_layout.get_shard_id(shard_index);
    /// }
    /// ```
    pub const fn new(id: u64) -> Self {
        Self(id)
    }

    pub fn to_le_bytes(self) -> [u8; 8] {
        self.0.to_le_bytes()
    }

    pub fn to_be_bytes(self) -> [u8; 8] {
        self.0.to_be_bytes()
    }

    pub fn from_le_bytes(bytes: [u8; 8]) -> Self {
        Self(u64::from_le_bytes(bytes))
    }

    // TODO This is not great, in ShardUId shard_id is u32.
    // Currently used for some metrics so kinda ok.
    pub fn max() -> Self {
        Self(u64::MAX)
    }
}

impl std::fmt::Debug for ShardId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl std::fmt::Display for ShardId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl From<u64> for ShardId {
    fn from(id: u64) -> Self {
        Self(id)
    }
}

impl Into<u64> for ShardId {
    fn into(self) -> u64 {
        self.0
    }
}

impl From<u32> for ShardId {
    fn from(id: u32) -> Self {
        Self(id as u64)
    }
}

impl Into<u32> for ShardId {
    fn into(self) -> u32 {
        self.0 as u32
    }
}

impl From<i32> for ShardId {
    fn from(id: i32) -> Self {
        Self(id as u64)
    }
}

impl From<usize> for ShardId {
    fn from(id: usize) -> Self {
        Self(id as u64)
    }
}

impl From<u16> for ShardId {
    fn from(id: u16) -> Self {
        Self(id as u64)
    }
}

impl Into<u16> for ShardId {
    fn into(self) -> u16 {
        self.0 as u16
    }
}

impl Into<usize> for ShardId {
    fn into(self) -> usize {
        self.0 as usize
    }
}

impl<T> Add<T> for ShardId
where
    T: Add<u64, Output = u64>,
{
    type Output = Self;

    fn add(self, rhs: T) -> Self::Output {
        Self(T::add(rhs, self.0))
    }
}

impl PartialEq<u64> for ShardId {
    fn eq(&self, other: &u64) -> bool {
        self.0 == *other
    }
}

impl FromStr for ShardId {
    type Err = ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let shard_id = s.parse::<u64>()?;
        Ok(ShardId(shard_id))
    }
}

/// Hash used by to store state root.
pub type StateRoot = CryptoHash;

/// Different types of finality.
#[derive(Serialize, Deserialize, Default, Clone, Debug, PartialEq, Eq)]
pub enum Finality {
    #[serde(rename = "optimistic")]
    None,
    #[serde(rename = "near-final")]
    DoomSlug,
    #[serde(rename = "final")]
    #[default]
    Final,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AccountWithPublicKey {
    pub account_id: AccountId,
    pub public_key: PublicKey,
}

/// Account info for validators
#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq)]
pub struct AccountInfo {
    pub account_id: AccountId,
    pub public_key: PublicKey,
    #[serde(with = "dec_format")]
    pub amount: Balance,
}

/// This type is used to mark keys (arrays of bytes) that are queried from store.
///
/// NOTE: Currently, this type is only used in the view_client and RPC to be able to transparently
/// pretty-serialize the bytes arrays as base64-encoded strings (see `serialize.rs`).
#[serde_as]
#[derive(
    Serialize,
    Deserialize,
    Clone,
    Debug,
    PartialEq,
    Eq,
    derive_more::Deref,
    derive_more::From,
    derive_more::Into,
    BorshSerialize,
    BorshDeserialize,
)]
#[serde(transparent)]
pub struct StoreKey(#[serde_as(as = "Base64")] Vec<u8>);

/// This type is used to mark values returned from store (arrays of bytes).
///
/// NOTE: Currently, this type is only used in the view_client and RPC to be able to transparently
/// pretty-serialize the bytes arrays as base64-encoded strings (see `serialize.rs`).
#[serde_as]
#[derive(
    Serialize,
    Deserialize,
    Clone,
    Debug,
    PartialEq,
    Eq,
    derive_more::Deref,
    derive_more::From,
    derive_more::Into,
    BorshSerialize,
    BorshDeserialize,
)]
#[serde(transparent)]
pub struct StoreValue(#[serde_as(as = "Base64")] Vec<u8>);

/// This type is used to mark function arguments.
///
/// NOTE: The main reason for this to exist (except the type-safety) is that the value is
/// transparently serialized and deserialized as a base64-encoded string when serde is used
/// (serde_json).
#[serde_as]
#[derive(
    Serialize,
    Deserialize,
    Clone,
    Debug,
    PartialEq,
    Eq,
    derive_more::Deref,
    derive_more::From,
    derive_more::Into,
    BorshSerialize,
    BorshDeserialize,
)]
#[serde(transparent)]
pub struct FunctionArgs(#[serde_as(as = "Base64")] Vec<u8>);

/// A structure used to indicate the kind of state changes due to transaction/receipt processing, etc.
#[derive(Debug, Clone)]
pub enum StateChangeKind {
    AccountTouched { account_id: AccountId },
    AccessKeyTouched { account_id: AccountId },
    DataTouched { account_id: AccountId },
    ContractCodeTouched { account_id: AccountId },
}

pub type StateChangesKinds = Vec<StateChangeKind>;

// #[easy_ext::ext(StateChangesKindsExt)]
// impl StateChangesKinds {
//     pub fn from_changes(
//         raw_changes: &mut dyn Iterator<Item = Result<RawStateChangesWithTrieKey, std::io::Error>>,
//     ) -> Result<StateChangesKinds, std::io::Error> {
//         raw_changes
//             .filter_map(|raw_change| {
//                 let RawStateChangesWithTrieKey { trie_key, .. } = match raw_change {
//                     Ok(p) => p,
//                     Err(e) => return Some(Err(e)),
//                 };
//                 match trie_key {
//                     TrieKey::Account { account_id } => {
//                         Some(Ok(StateChangeKind::AccountTouched { account_id }))
//                     }
//                     TrieKey::ContractCode { account_id } => {
//                         Some(Ok(StateChangeKind::ContractCodeTouched { account_id }))
//                     }
//                     TrieKey::AccessKey { account_id, .. } => {
//                         Some(Ok(StateChangeKind::AccessKeyTouched { account_id }))
//                     }
//                     TrieKey::ContractData { account_id, .. } => {
//                         Some(Ok(StateChangeKind::DataTouched { account_id }))
//                     }
//                     _ => None,
//                 }
//             })
//             .collect()
//     }
// }

/// A structure used to index state changes due to transaction/receipt processing and other things.
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize, PartialEq)]
pub enum StateChangeCause {
    /// A type of update that does not get finalized. Used for verification and execution of
    /// immutable smart contract methods. Attempt fo finalize a `TrieUpdate` containing such
    /// change will lead to panic.
    NotWritableToDisk,
    /// A type of update that is used to mark the initial storage update, e.g. during genesis
    /// or in tests setup.
    InitialState,
    /// Processing of a transaction.
    TransactionProcessing { tx_hash: CryptoHash },
    /// Before the receipt is going to be processed, inputs get drained from the state, which
    /// causes state modification.
    ActionReceiptProcessingStarted { receipt_hash: CryptoHash },
    /// Computation of gas reward.
    ActionReceiptGasReward { receipt_hash: CryptoHash },
    /// Processing of a receipt.
    ReceiptProcessing { receipt_hash: CryptoHash },
    /// The given receipt was postponed. This is either a data receipt or an action receipt.
    /// A `DataReceipt` can be postponed if the corresponding `ActionReceipt` is not received yet,
    /// or other data dependencies are not satisfied.
    /// An `ActionReceipt` can be postponed if not all data dependencies are received.
    PostponedReceipt { receipt_hash: CryptoHash },
    /// Updated delayed receipts queue in the state.
    /// We either processed previously delayed receipts or added more receipts to the delayed queue.
    UpdatedDelayedReceipts,
    /// State change that happens when we update validator accounts. Not associated with any
    /// specific transaction or receipt.
    ValidatorAccountsUpdate,
    /// State change that is happens due to migration that happens in first block of an epoch
    /// after protocol upgrade
    Migration,
    /// Update persistent state kept by Bandwidth Scheduler after running the scheduling algorithm.
    BandwidthSchedulerStateUpdate,
}

/// This represents the committed changes in the Trie with a change cause.
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct RawStateChange {
    pub cause: StateChangeCause,
    pub data: Option<Vec<u8>>,
}

/// List of committed changes with a cause for a given TrieKey
#[derive(Debug, Clone, BorshSerialize, BorshDeserialize)]
pub struct RawStateChangesWithTrieKey {
    pub trie_key: TrieKey,
    pub changes: Vec<RawStateChange>,
}

/// Consolidate state change of trie_key and the final value the trie key will be changed to
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct ConsolidatedStateChange {
    pub trie_key: TrieKey,
    pub value: Option<Vec<u8>>,
}

/// key that was updated -> list of updates with the corresponding indexing event.
pub type RawStateChanges = std::collections::BTreeMap<Vec<u8>, RawStateChangesWithTrieKey>;

#[derive(Debug)]
pub enum StateChangesRequest {
    AccountChanges {
        account_ids: Vec<AccountId>,
    },
    SingleAccessKeyChanges {
        keys: Vec<AccountWithPublicKey>,
    },
    AllAccessKeyChanges {
        account_ids: Vec<AccountId>,
    },
    ContractCodeChanges {
        account_ids: Vec<AccountId>,
    },
    DataChanges {
        account_ids: Vec<AccountId>,
        key_prefix: StoreKey,
    },
}

#[derive(Debug)]
pub enum StateChangeValue {
    AccountUpdate {
        account_id: AccountId,
        account: Account,
    },
    AccountDeletion {
        account_id: AccountId,
    },
    AccessKeyUpdate {
        account_id: AccountId,
        public_key: PublicKey,
        access_key: AccessKey,
    },
    AccessKeyDeletion {
        account_id: AccountId,
        public_key: PublicKey,
    },
    DataUpdate {
        account_id: AccountId,
        key: StoreKey,
        value: StoreValue,
    },
    DataDeletion {
        account_id: AccountId,
        key: StoreKey,
    },
    ContractCodeUpdate {
        account_id: AccountId,
        code: Vec<u8>,
    },
    ContractCodeDeletion {
        account_id: AccountId,
    },
}

impl StateChangeValue {
    pub fn affected_account_id(&self) -> &AccountId {
        match &self {
            StateChangeValue::AccountUpdate { account_id, .. }
            | StateChangeValue::AccountDeletion { account_id }
            | StateChangeValue::AccessKeyUpdate { account_id, .. }
            | StateChangeValue::AccessKeyDeletion { account_id, .. }
            | StateChangeValue::DataUpdate { account_id, .. }
            | StateChangeValue::DataDeletion { account_id, .. }
            | StateChangeValue::ContractCodeUpdate { account_id, .. }
            | StateChangeValue::ContractCodeDeletion { account_id } => account_id,
        }
    }
}

#[derive(Debug)]
pub struct StateChangeWithCause {
    pub cause: StateChangeCause,
    pub value: StateChangeValue,
}

pub type StateChanges = Vec<StateChangeWithCause>;

#[easy_ext::ext(StateChangesExt)]
impl StateChanges {
    pub fn from_changes(
        raw_changes: impl Iterator<Item = Result<RawStateChangesWithTrieKey, std::io::Error>>,
    ) -> Result<StateChanges, std::io::Error> {
        let mut state_changes = Self::new();

        for raw_change in raw_changes {
            let RawStateChangesWithTrieKey { trie_key, changes } = raw_change?;

            match trie_key {
                TrieKey::Account { account_id } => state_changes.extend(changes.into_iter().map(
                    |RawStateChange { cause, data }| StateChangeWithCause {
                        cause,
                        value: if let Some(change_data) = data {
                            StateChangeValue::AccountUpdate {
                                account_id: account_id.clone(),
                                account: <_>::try_from_slice(&change_data).expect(
                                    "Failed to parse internally stored account information",
                                ),
                            }
                        } else {
                            StateChangeValue::AccountDeletion {
                                account_id: account_id.clone(),
                            }
                        },
                    },
                )),
                TrieKey::AccessKey {
                    account_id,
                    public_key,
                } => state_changes.extend(changes.into_iter().map(
                    |RawStateChange { cause, data }| StateChangeWithCause {
                        cause,
                        value: if let Some(change_data) = data {
                            StateChangeValue::AccessKeyUpdate {
                                account_id: account_id.clone(),
                                public_key: public_key.clone(),
                                access_key: <_>::try_from_slice(&change_data)
                                    .expect("Failed to parse internally stored access key"),
                            }
                        } else {
                            StateChangeValue::AccessKeyDeletion {
                                account_id: account_id.clone(),
                                public_key: public_key.clone(),
                            }
                        },
                    },
                )),
                TrieKey::ContractCode { account_id } => {
                    state_changes.extend(changes.into_iter().map(
                        |RawStateChange { cause, data }| StateChangeWithCause {
                            cause,
                            value: match data {
                                Some(change_data) => StateChangeValue::ContractCodeUpdate {
                                    account_id: account_id.clone(),
                                    code: change_data,
                                },
                                None => StateChangeValue::ContractCodeDeletion {
                                    account_id: account_id.clone(),
                                },
                            },
                        },
                    ));
                }
                TrieKey::ContractData { account_id, key } => {
                    state_changes.extend(changes.into_iter().map(
                        |RawStateChange { cause, data }| StateChangeWithCause {
                            cause,
                            value: if let Some(change_data) = data {
                                StateChangeValue::DataUpdate {
                                    account_id: account_id.clone(),
                                    key: key.to_vec().into(),
                                    value: change_data.into(),
                                }
                            } else {
                                StateChangeValue::DataDeletion {
                                    account_id: account_id.clone(),
                                    key: key.to_vec().into(),
                                }
                            },
                        },
                    ));
                }
                // The next variants considered as unnecessary as too low level
                TrieKey::ReceivedData { .. } => {}
                TrieKey::PostponedReceiptId { .. } => {}
                TrieKey::PendingDataCount { .. } => {}
                TrieKey::PostponedReceipt { .. } => {}
                TrieKey::DelayedReceiptIndices => {}
                TrieKey::DelayedReceipt { .. } => {}
                TrieKey::PromiseYieldIndices => {}
                TrieKey::PromiseYieldTimeout { .. } => {}
                TrieKey::PromiseYieldReceipt { .. } => {}
                TrieKey::BufferedReceiptIndices => {}
                TrieKey::BufferedReceipt { .. } => {}
                TrieKey::BandwidthSchedulerState => {}
                TrieKey::BufferedReceiptGroupsQueueData { .. } => {}
                TrieKey::BufferedReceiptGroupsQueueItem { .. } => {}
                // Global contract code is not a part of account, so ignoring it as well.
                TrieKey::GlobalContractCode { .. } => {}
            }
        }

        Ok(state_changes)
    }
    pub fn from_account_changes(
        raw_changes: impl Iterator<Item = Result<RawStateChangesWithTrieKey, std::io::Error>>,
    ) -> Result<StateChanges, std::io::Error> {
        let state_changes = Self::from_changes(raw_changes)?;

        Ok(state_changes
            .into_iter()
            .filter(|state_change| {
                matches!(
                    state_change.value,
                    StateChangeValue::AccountUpdate { .. }
                        | StateChangeValue::AccountDeletion { .. }
                )
            })
            .collect())
    }

    pub fn from_access_key_changes(
        raw_changes: impl Iterator<Item = Result<RawStateChangesWithTrieKey, std::io::Error>>,
    ) -> Result<StateChanges, std::io::Error> {
        let state_changes = Self::from_changes(raw_changes)?;

        Ok(state_changes
            .into_iter()
            .filter(|state_change| {
                matches!(
                    state_change.value,
                    StateChangeValue::AccessKeyUpdate { .. }
                        | StateChangeValue::AccessKeyDeletion { .. }
                )
            })
            .collect())
    }

    pub fn from_contract_code_changes(
        raw_changes: impl Iterator<Item = Result<RawStateChangesWithTrieKey, std::io::Error>>,
    ) -> Result<StateChanges, std::io::Error> {
        let state_changes = Self::from_changes(raw_changes)?;

        Ok(state_changes
            .into_iter()
            .filter(|state_change| {
                matches!(
                    state_change.value,
                    StateChangeValue::ContractCodeUpdate { .. }
                        | StateChangeValue::ContractCodeDeletion { .. }
                )
            })
            .collect())
    }

    pub fn from_data_changes(
        raw_changes: impl Iterator<Item = Result<RawStateChangesWithTrieKey, std::io::Error>>,
    ) -> Result<StateChanges, std::io::Error> {
        let state_changes = Self::from_changes(raw_changes)?;

        Ok(state_changes
            .into_iter()
            .filter(|state_change| {
                matches!(
                    state_change.value,
                    StateChangeValue::DataUpdate { .. } | StateChangeValue::DataDeletion { .. }
                )
            })
            .collect())
    }
}

#[derive(PartialEq, Eq, Clone, Debug, BorshSerialize, BorshDeserialize, Serialize)]
pub struct StateRootNode {
    /// In Nightshade, data is the serialized TrieNodeWithSize.
    ///
    /// Beware that hash of an empty state root (i.e. once who’s data is an
    /// empty byte string) **does not** equal hash of an empty byte string.
    /// Instead, an all-zero hash indicates an empty node.
    pub data: Arc<[u8]>,

    /// In Nightshade, memory_usage is a field of TrieNodeWithSize.
    pub memory_usage: u64,
}

impl StateRootNode {
    pub fn empty() -> Self {
        static EMPTY: LazyLock<Arc<[u8]>> = LazyLock::new(|| Arc::new([]));
        StateRootNode {
            data: EMPTY.clone(),
            memory_usage: 0,
        }
    }
}

/// Epoch identifier -- wrapped hash, to make it easier to distinguish.
/// EpochId of epoch T is the hash of last block in T-2
/// EpochId of first two epochs is 0
#[derive(
    Debug,
    Clone,
    Copy,
    Default,
    Hash,
    Eq,
    PartialEq,
    PartialOrd,
    Ord,
    derive_more::AsRef,
    BorshSerialize,
    BorshDeserialize,
    Serialize,
    Deserialize,
)]
#[as_ref(forward)]
pub struct EpochId(pub CryptoHash);

impl std::str::FromStr for EpochId {
    type Err = Box<dyn std::error::Error + Send + Sync>;

    /// Decodes base58-encoded string into a 32-byte crypto hash.
    fn from_str(epoch_id_str: &str) -> Result<Self, Self::Err> {
        Ok(EpochId(CryptoHash::from_str(epoch_id_str)?))
    }
}

/// Stores validator and its stake for two consecutive epochs.
/// It is necessary because the blocks on the epoch boundary need to contain approvals from both
/// epochs.
#[derive(Serialize, Debug, Clone, PartialEq, Eq)]
pub struct ApprovalStake {
    /// Account that stakes money.
    pub account_id: AccountId,
    /// Public key of the proposed validator.
    pub public_key: PublicKey,
    /// Stake / weight of the validator.
    pub stake_this_epoch: Balance,
    pub stake_next_epoch: Balance,
}

pub mod validator_stake {
    use crate::types::ApprovalStake;
    use borsh::{BorshDeserialize, BorshSerialize};
    use near_account_id::AccountId;
    use near_crypto::{KeyType, PublicKey};
    use serde::Serialize;

    use super::Balance;
    pub use super::ValidatorStakeV1;

    /// Stores validator and its stake.
    #[derive(BorshSerialize, BorshDeserialize, Serialize, Debug, Clone, PartialEq, Eq)]
    #[serde(tag = "validator_stake_struct_version")]
    pub enum ValidatorStake {
        V1(ValidatorStakeV1),
        // Warning: if you're adding a new version, make sure that the borsh encoding of
        // any `ValidatorStake` cannot be equal to the borsh encoding of any `ValidatorStakeV1`.
        // See `EpochSyncProofEpochData::use_versioned_bp_hash_format` for an explanation.
        // The simplest way to ensure that is to make sure that any new `ValidatorStakeVx`
        // begins with a field of type `AccountId`.
    }

    pub struct ValidatorStakeIter<'a> {
        collection: ValidatorStakeIterSource<'a>,
        curr_index: usize,
        len: usize,
    }

    impl<'a> ValidatorStakeIter<'a> {
        pub fn empty() -> Self {
            Self {
                collection: ValidatorStakeIterSource::V2(&[]),
                curr_index: 0,
                len: 0,
            }
        }

        pub fn v1(collection: &'a [ValidatorStakeV1]) -> Self {
            Self {
                collection: ValidatorStakeIterSource::V1(collection),
                curr_index: 0,
                len: collection.len(),
            }
        }

        pub fn new(collection: &'a [ValidatorStake]) -> Self {
            Self {
                collection: ValidatorStakeIterSource::V2(collection),
                curr_index: 0,
                len: collection.len(),
            }
        }

        pub fn len(&self) -> usize {
            self.len
        }
    }

    impl<'a> Iterator for ValidatorStakeIter<'a> {
        type Item = ValidatorStake;

        fn next(&mut self) -> Option<Self::Item> {
            if self.curr_index < self.len {
                let item = match self.collection {
                    ValidatorStakeIterSource::V1(collection) => {
                        ValidatorStake::V1(collection[self.curr_index].clone())
                    }
                    ValidatorStakeIterSource::V2(collection) => collection[self.curr_index].clone(),
                };
                self.curr_index += 1;
                Some(item)
            } else {
                None
            }
        }
    }

    enum ValidatorStakeIterSource<'a> {
        V1(&'a [ValidatorStakeV1]),
        V2(&'a [ValidatorStake]),
    }

    impl ValidatorStake {
        pub fn new_v1(account_id: AccountId, public_key: PublicKey, stake: Balance) -> Self {
            Self::V1(ValidatorStakeV1 {
                account_id,
                public_key,
                stake,
            })
        }

        pub fn new(account_id: AccountId, public_key: PublicKey, stake: Balance) -> Self {
            Self::new_v1(account_id, public_key, stake)
        }

        pub fn test(account_id: AccountId) -> Self {
            Self::new_v1(account_id, PublicKey::empty(KeyType::ED25519), 0)
        }

        pub fn into_v1(self) -> ValidatorStakeV1 {
            match self {
                Self::V1(v1) => v1,
            }
        }

        #[inline]
        pub fn account_and_stake(self) -> (AccountId, Balance) {
            match self {
                Self::V1(v1) => (v1.account_id, v1.stake),
            }
        }

        #[inline]
        pub fn destructure(self) -> (AccountId, PublicKey, Balance) {
            match self {
                Self::V1(v1) => (v1.account_id, v1.public_key, v1.stake),
            }
        }

        #[inline]
        pub fn take_account_id(self) -> AccountId {
            match self {
                Self::V1(v1) => v1.account_id,
            }
        }

        #[inline]
        pub fn account_id(&self) -> &AccountId {
            match self {
                Self::V1(v1) => &v1.account_id,
            }
        }

        #[inline]
        pub fn take_public_key(self) -> PublicKey {
            match self {
                Self::V1(v1) => v1.public_key,
            }
        }

        #[inline]
        pub fn public_key(&self) -> &PublicKey {
            match self {
                Self::V1(v1) => &v1.public_key,
            }
        }

        #[inline]
        pub fn stake(&self) -> Balance {
            match self {
                Self::V1(v1) => v1.stake,
            }
        }

        #[inline]
        pub fn stake_mut(&mut self) -> &mut Balance {
            match self {
                Self::V1(v1) => &mut v1.stake,
            }
        }

        pub fn get_approval_stake(&self, is_next_epoch: bool) -> ApprovalStake {
            ApprovalStake {
                account_id: self.account_id().clone(),
                public_key: self.public_key().clone(),
                stake_this_epoch: if is_next_epoch { 0 } else { self.stake() },
                stake_next_epoch: if is_next_epoch { self.stake() } else { 0 },
            }
        }

        /// Returns the validator's number of mandates (rounded down) at `stake_per_seat`.
        ///
        /// It returns `u16` since it allows infallible conversion to `usize` and with [`u16::MAX`]
        /// equalling 65_535 it should be sufficient to hold the number of mandates per validator.
        ///
        /// # Why `u16` should be sufficient
        ///
        /// As of October 2023, a [recommended lower bound] for the stake required per mandate is
        /// 25k $NEAR. At this price, the validator with highest stake would have 1_888 mandates,
        /// which is well below `u16::MAX`.
        ///
        /// From another point of view, with more than `u16::MAX` mandates for validators, sampling
        /// mandates might become computationally too expensive. This might trigger an increase in
        /// the required stake per mandate, bringing down the number of mandates per validator.
        ///
        /// [recommended lower bound]: https://near.zulipchat.com/#narrow/stream/407237-pagoda.2Fcore.2Fstateless-validation/topic/validator.20seat.20assignment/near/393792901
        ///
        /// # Panics
        ///
        /// Panics if the number of mandates overflows `u16`.
        pub fn num_mandates(&self, stake_per_mandate: Balance) -> u16 {
            // Integer division in Rust returns the floor as described here
            // https://doc.rust-lang.org/std/primitive.u64.html#method.div_euclid
            u16::try_from(self.stake() / stake_per_mandate)
                .expect("number of mandates should fit u16")
        }

        /// Returns the weight attributed to the validator's partial mandate.
        ///
        /// A validator has a partial mandate if its stake cannot be divided evenly by
        /// `stake_per_mandate`. The remainder of that division is the weight of the partial
        /// mandate.
        ///
        /// Due to this definition a validator has exactly one partial mandate with `0 <= weight <
        /// stake_per_mandate`.
        ///
        /// # Example
        ///
        /// Let `V` be a validator with stake of 12. If `stake_per_mandate` equals 5 then the weight
        /// of `V`'s partial mandate is `12 % 5 = 2`.
        pub fn partial_mandate_weight(&self, stake_per_mandate: Balance) -> Balance {
            self.stake() % stake_per_mandate
        }
    }
}

/// Stores validator and its stake.
#[derive(BorshSerialize, BorshDeserialize, Serialize, Debug, Clone, PartialEq, Eq)]
pub struct ValidatorStakeV1 {
    /// Account that stakes money.
    pub account_id: AccountId,
    /// Public key of the proposed validator.
    pub public_key: PublicKey,
    /// Stake / weight of the validator.
    pub stake: Balance,
}

/// Information after chunk was processed, used to produce or check next chunk.
#[derive(Debug, PartialEq, BorshSerialize, BorshDeserialize, Clone, Eq, Serialize)]
pub struct ChunkExtraV1 {
    /// Post state root after applying give chunk.
    pub state_root: StateRoot,
    /// Root of merklizing results of receipts (transactions) execution.
    pub outcome_root: CryptoHash,
    /// Validator proposals produced by given chunk.
    pub validator_proposals: Vec<ValidatorStakeV1>,
    /// Actually how much gas were used.
    pub gas_used: Gas,
    /// Gas limit, allows to increase or decrease limit based on expected time vs real time for computing the chunk.
    pub gas_limit: Gas,
    /// Total balance burnt after processing the current chunk.
    pub balance_burnt: Balance,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum BlockId {
    Height(BlockHeight),
    Hash(CryptoHash),
}

pub type MaybeBlockId = Option<BlockId>;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SyncCheckpoint {
    Genesis,
    EarliestAvailable,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BlockReference {
    BlockId(BlockId),
    Finality(Finality),
    SyncCheckpoint(SyncCheckpoint),
}

impl BlockReference {
    pub fn latest() -> Self {
        Self::Finality(Finality::None)
    }
}

impl From<BlockId> for BlockReference {
    fn from(block_id: BlockId) -> Self {
        Self::BlockId(block_id)
    }
}

impl From<Finality> for BlockReference {
    fn from(finality: Finality) -> Self {
        Self::Finality(finality)
    }
}

#[derive(Default, BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, Eq, Serialize)]
pub struct ValidatorStats {
    pub produced: NumBlocks,
    pub expected: NumBlocks,
}

impl ValidatorStats {
    /// Compare stats with threshold which is an expected percentage from 0 to
    /// 100.
    pub fn less_than(&self, threshold: u8) -> bool {
        self.produced * 100 < u64::from(threshold) * self.expected
    }
}

#[derive(Debug, BorshSerialize, BorshDeserialize, PartialEq, Eq)]
pub struct BlockChunkValidatorStats {
    pub block_stats: ValidatorStats,
    // TODO pub chunk_stats: ChunkStats,
}

#[derive(Deserialize, Debug, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum EpochReference {
    EpochId(EpochId),
    BlockId(BlockId),
    Latest,
}

impl Serialize for EpochReference {
    fn serialize<S>(&self, s: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        // cspell:words newtype
        match self {
            EpochReference::EpochId(epoch_id) => {
                s.serialize_newtype_variant("EpochReference", 0, "epoch_id", epoch_id)
            }
            EpochReference::BlockId(block_id) => {
                s.serialize_newtype_variant("EpochReference", 1, "block_id", block_id)
            }
            EpochReference::Latest => {
                s.serialize_newtype_variant("EpochReference", 2, "latest", &())
            }
        }
    }
}

/// Either an epoch id or latest block hash.  When `EpochId` variant is used it
/// must be an identifier of a past epoch.  When `BlockHeight` is used it must
/// be hash of the latest block in the current epoch.  Using current epoch id
/// with `EpochId` or arbitrary block hash in past or present epochs will result
/// in errors.
#[derive(Clone, Debug)]
pub enum ValidatorInfoIdentifier {
    EpochId(EpochId),
    BlockHash(CryptoHash),
}

/// Reasons for removing a validator from the validator set.
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub enum ValidatorKickoutReason {
    /// Slashed validators are kicked out.
    Slashed,
    /// Validator didn't produce enough blocks.
    NotEnoughBlocks {
        produced: NumBlocks,
        expected: NumBlocks,
    },
    /// Validator didn't produce enough chunks.
    NotEnoughChunks {
        produced: NumBlocks,
        expected: NumBlocks,
    },
    /// Validator unstaked themselves.
    Unstaked,
    /// Validator stake is now below threshold
    NotEnoughStake {
        #[serde(with = "dec_format", rename = "stake_u128")]
        stake: Balance,
        #[serde(with = "dec_format", rename = "threshold_u128")]
        threshold: Balance,
    },
    /// Enough stake but is not chosen because of seat limits.
    DidNotGetASeat,
    /// Validator didn't produce enough chunk endorsements.
    NotEnoughChunkEndorsements {
        produced: NumBlocks,
        expected: NumBlocks,
    },
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum TransactionOrReceiptId {
    Transaction {
        transaction_hash: CryptoHash,
        sender_id: AccountId,
    },
    Receipt {
        receipt_id: CryptoHash,
        receiver_id: AccountId,
    },
}

/// State changes for a range of blocks.
/// Expects that a block is present at most once in the list.
#[derive(borsh::BorshDeserialize, borsh::BorshSerialize)]
pub struct StateChangesForBlockRange {
    pub blocks: Vec<StateChangesForBlock>,
}

/// State changes for a single block.
/// Expects that a shard is present at most once in the list of state changes.
#[derive(borsh::BorshDeserialize, borsh::BorshSerialize)]
pub struct StateChangesForBlock {
    pub block_hash: CryptoHash,
    pub state_changes: Vec<StateChangesForShard>,
}

/// Key and value of a StateChanges column.
#[derive(borsh::BorshDeserialize, borsh::BorshSerialize)]
pub struct StateChangesForShard {
    pub shard_id: ShardId,
    pub state_changes: Vec<RawStateChangesWithTrieKey>,
}

#[derive(
    BorshSerialize,
    BorshDeserialize,
    PartialEq,
    PartialOrd,
    Eq,
    Clone,
    Copy,
    Debug,
    Default,
    Serialize,
    Deserialize,
)]
pub enum AccountVersion {
    #[default]
    V1,
    V2,
}

/// Per account information stored in the state.
/// When introducing new version:
/// - introduce new AccountV[NewVersion] struct
/// - add new Account enum option V[NewVersion](AccountV[NewVersion])
/// - add new BorshVersionedAccount enum option V[NewVersion](AccountV[NewVersion])
/// - update SerdeAccount with newly added fields
/// - update serde ser/deser to properly handle conversions
#[derive(PartialEq, Eq, Debug, Clone)]
pub enum Account {
    V1(AccountV1),
    V2(AccountV2),
}

// Original representation of the account.
#[derive(BorshSerialize, Serialize, Deserialize, PartialEq, Eq, Debug, Clone)]
pub struct AccountV1 {
    /// The total not locked tokens.
    amount: NearToken,
    /// The amount locked due to staking.
    locked: NearToken,
    /// Hash of the code stored in the storage for this account.
    code_hash: CryptoHash,
    /// Storage used by the given account, includes account id, this struct, access keys and other data.
    storage_usage: StorageUsage,
}

#[allow(dead_code)]
impl AccountV1 {
    fn to_v2(&self) -> AccountV2 {
        AccountV2 {
            amount: self.amount,
            locked: self.locked,
            storage_usage: self.storage_usage,
            contract: AccountContract::from_local_code_hash(self.code_hash),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Debug, Clone)]
pub enum AccountContract {
    None,
    Local(CryptoHash),
    Global(CryptoHash),
    GlobalByAccount(AccountId),
}

impl AccountContract {
    pub fn local_code(&self) -> Option<CryptoHash> {
        match self {
            AccountContract::None
            | AccountContract::GlobalByAccount(_)
            | AccountContract::Global(_) => None,
            AccountContract::Local(hash) => Some(*hash),
        }
    }

    pub fn from_local_code_hash(code_hash: CryptoHash) -> AccountContract {
        if code_hash == CryptoHash::default() {
            AccountContract::None
        } else {
            AccountContract::Local(code_hash)
        }
    }

    pub fn is_none(&self) -> bool {
        matches!(self, Self::None)
    }

    pub fn is_local(&self) -> bool {
        matches!(self, Self::Local(_))
    }

    pub fn identifier_storage_usage(&self) -> u64 {
        match self {
            AccountContract::None | AccountContract::Local(_) => 0u64,
            AccountContract::Global(_) => 32u64,
            AccountContract::GlobalByAccount(id) => id.len() as u64,
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Debug, Clone)]
pub struct AccountV2 {
    /// The total not locked tokens.
    amount: NearToken,
    /// The amount locked due to staking.
    locked: NearToken,
    /// Storage used by the given account, includes account id, this struct, access keys and other data.
    storage_usage: StorageUsage,
    /// Type of contract deployed to this account, if any.
    contract: AccountContract,
}

impl Account {
    /// Max number of bytes an account can have in its state (excluding contract code)
    /// before it is infeasible to delete.
    pub const MAX_ACCOUNT_DELETION_STORAGE_USAGE: u64 = 10_000;
    /// HACK: Using u128::MAX as a sentinel value, there are not enough tokens
    /// in total supply which makes it an invalid value. We use it to
    /// differentiate AccountVersion V1 from newer versions.
    const SERIALIZATION_SENTINEL: u128 = u128::MAX;

    pub fn new(
        amount: NearToken,
        locked: NearToken,
        contract: AccountContract,
        storage_usage: StorageUsage,
    ) -> Self {
        match contract {
            AccountContract::None => Self::V1(AccountV1 {
                amount,
                locked,
                code_hash: CryptoHash::default(),
                storage_usage,
            }),
            AccountContract::Local(code_hash) => Self::V1(AccountV1 {
                amount,
                locked,
                code_hash,
                storage_usage,
            }),
            _ => Self::V2(AccountV2 {
                amount,
                locked,
                storage_usage,
                contract,
            }),
        }
    }

    #[inline]
    pub fn amount(&self) -> NearToken {
        match self {
            Self::V1(account) => account.amount,
            Self::V2(account) => account.amount,
        }
    }

    #[inline]
    pub fn locked(&self) -> NearToken {
        match self {
            Self::V1(account) => account.locked,
            Self::V2(account) => account.locked,
        }
    }

    #[inline]
    pub fn contract(&self) -> Cow<AccountContract> {
        match self {
            Self::V1(account) => {
                Cow::Owned(AccountContract::from_local_code_hash(account.code_hash))
            }
            Self::V2(account) => Cow::Borrowed(&account.contract),
        }
    }

    #[inline]
    pub fn storage_usage(&self) -> StorageUsage {
        match self {
            Self::V1(account) => account.storage_usage,
            Self::V2(account) => account.storage_usage,
        }
    }

    #[inline]
    pub fn version(&self) -> AccountVersion {
        match self {
            Self::V1(_) => AccountVersion::V1,
            Self::V2(_) => AccountVersion::V2,
        }
    }

    #[inline]
    pub fn global_contract_hash(&self) -> Option<CryptoHash> {
        match self {
            Self::V2(AccountV2 {
                contract: AccountContract::Global(hash),
                ..
            }) => Some(*hash),
            Self::V1(_) | Self::V2(_) => None,
        }
    }

    #[inline]
    pub fn global_contract_account_id(&self) -> Option<&AccountId> {
        match self {
            Self::V2(AccountV2 {
                contract: AccountContract::GlobalByAccount(account),
                ..
            }) => Some(account),
            Self::V1(_) | Self::V2(_) => None,
        }
    }

    #[inline]
    pub fn local_contract_hash(&self) -> Option<CryptoHash> {
        match self {
            Self::V1(account) => {
                AccountContract::from_local_code_hash(account.code_hash).local_code()
            }
            Self::V2(AccountV2 {
                contract: AccountContract::Local(hash),
                ..
            }) => Some(*hash),
            Self::V2(AccountV2 {
                contract: AccountContract::None,
                ..
            })
            | Self::V2(AccountV2 {
                contract: AccountContract::Global(_),
                ..
            })
            | Self::V2(AccountV2 {
                contract: AccountContract::GlobalByAccount(_),
                ..
            }) => None,
        }
    }

    #[inline]
    pub fn set_amount(&mut self, amount: NearToken) {
        match self {
            Self::V1(account) => account.amount = amount,
            Self::V2(account) => account.amount = amount,
        }
    }

    #[inline]
    pub fn set_locked(&mut self, locked: NearToken) {
        match self {
            Self::V1(account) => account.locked = locked,
            Self::V2(account) => account.locked = locked,
        }
    }

    #[inline]
    pub fn set_contract(&mut self, contract: AccountContract) {
        match self {
            Self::V1(account) => match contract {
                AccountContract::None | AccountContract::Local(_) => {
                    account.code_hash = contract.local_code().unwrap_or_default();
                }
                _ => {
                    let mut account_v2 = account.to_v2();
                    account_v2.contract = contract;
                    *self = Self::V2(account_v2);
                }
            },
            Self::V2(account) => {
                account.contract = contract;
            }
        }
    }

    #[inline]
    pub fn set_storage_usage(&mut self, storage_usage: StorageUsage) {
        match self {
            Self::V1(account) => account.storage_usage = storage_usage,
            Self::V2(account) => account.storage_usage = storage_usage,
        }
    }
}

/// Account representation for serde ser/deser that maintains both backward
/// and forward compatibility.
#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, Clone)]
struct SerdeAccount {
    amount: NearToken,
    locked: NearToken,
    code_hash: CryptoHash,
    storage_usage: StorageUsage,
    /// Version of Account in re migrations and similar.
    #[serde(default)]
    version: AccountVersion,
    /// Global contracts fields
    #[serde(default, skip_serializing_if = "Option::is_none")]
    global_contract_hash: Option<CryptoHash>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    global_contract_account_id: Option<AccountId>,
}

impl<'de> Deserialize<'de> for Account {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let account_data = SerdeAccount::deserialize(deserializer)?;
        if account_data.code_hash != CryptoHash::default()
            && (account_data.global_contract_hash.is_some()
                || account_data.global_contract_account_id.is_some())
        {
            return Err(serde::de::Error::custom(
                "An Account can't contain both a local and global contract",
            ));
        }
        if account_data.global_contract_hash.is_some()
            && account_data.global_contract_account_id.is_some()
        {
            return Err(serde::de::Error::custom(
                "An Account can't contain both types of global contracts",
            ));
        }

        match account_data.version {
            AccountVersion::V1 => Ok(Account::V1(AccountV1 {
                amount: account_data.amount,
                locked: account_data.locked,
                code_hash: account_data.code_hash,
                storage_usage: account_data.storage_usage,
            })),
            AccountVersion::V2 => {
                let contract = match account_data.global_contract_account_id {
                    Some(account_id) => AccountContract::GlobalByAccount(account_id),
                    None => match account_data.global_contract_hash {
                        Some(hash) => AccountContract::Global(hash),
                        None => AccountContract::from_local_code_hash(account_data.code_hash),
                    },
                };

                Ok(Account::V2(AccountV2 {
                    amount: account_data.amount,
                    locked: account_data.locked,
                    storage_usage: account_data.storage_usage,
                    contract,
                }))
            }
        }
    }
}

impl Serialize for Account {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let version = self.version();
        let code_hash = self.local_contract_hash().unwrap_or_default();
        let repr = SerdeAccount {
            amount: self.amount(),
            locked: self.locked(),
            code_hash,
            storage_usage: self.storage_usage(),
            version,
            global_contract_hash: self.global_contract_hash(),
            global_contract_account_id: self.global_contract_account_id().cloned(),
        };
        repr.serialize(serializer)
    }
}

#[derive(BorshSerialize, BorshDeserialize)]
enum BorshVersionedAccount {
    // V1 is not included since it is serialized directly without being wrapped in enum
    V2(AccountV2),
}

impl BorshDeserialize for Account {
    fn deserialize_reader<R: io::Read>(rd: &mut R) -> io::Result<Self> {
        // The first value of all Account serialization formats is a u128,
        // either a sentinel or a balance.
        let sentinel_or_amount = u128::deserialize_reader(rd)?;
        if sentinel_or_amount == Account::SERIALIZATION_SENTINEL {
            let versioned_account = BorshVersionedAccount::deserialize_reader(rd)?;
            let account = match versioned_account {
                BorshVersionedAccount::V2(account_v2) => Account::V2(account_v2),
            };
            Ok(account)
        } else {
            // Legacy unversioned representation of Account
            let locked = NearToken::deserialize_reader(rd)?;
            let code_hash = CryptoHash::deserialize_reader(rd)?;
            let storage_usage = StorageUsage::deserialize_reader(rd)?;

            Ok(Account::V1(AccountV1 {
                amount: NearToken::from_yoctonear(sentinel_or_amount),
                locked: locked,
                code_hash,
                storage_usage,
            }))
        }
    }
}

impl BorshSerialize for Account {
    fn serialize<W: io::Write>(&self, writer: &mut W) -> io::Result<()> {
        let versioned_account = match self {
            Account::V1(account_v1) => return BorshSerialize::serialize(&account_v1, writer),
            Account::V2(account_v2) => BorshVersionedAccount::V2(account_v2.clone()),
        };
        let sentinel = Account::SERIALIZATION_SENTINEL;
        BorshSerialize::serialize(&sentinel, writer)?;
        BorshSerialize::serialize(&versioned_account, writer)
    }
}

/// Access key provides limited access to an account. Each access key belongs to some account and
/// is identified by a unique (within the account) public key. One account may have large number of
/// access keys. Access keys allow to act on behalf of the account by restricting transactions
/// that can be issued.
/// `account_id,public_key` is a key in the state
#[derive(
    BorshSerialize, BorshDeserialize, PartialEq, Eq, Hash, Clone, Debug, Serialize, Deserialize,
)]
pub struct AccessKey {
    /// Nonce for this access key, used for tx nonce generation. When access key is created, nonce
    /// is set to `(block_height - 1) * 1e6` to avoid tx hash collision on access key re-creation.
    /// See <https://github.com/near/nearcore/issues/3779> for more details.
    pub nonce: Nonce,

    /// Defines permissions for this access key.
    pub permission: AccessKeyPermission,
}

impl AccessKey {
    pub const ACCESS_KEY_NONCE_RANGE_MULTIPLIER: u64 = 1_000_000;

    pub fn full_access() -> Self {
        Self {
            nonce: 0,
            permission: AccessKeyPermission::FullAccess,
        }
    }
}

/// Defines permissions for AccessKey
#[derive(
    BorshSerialize, BorshDeserialize, PartialEq, Eq, Hash, Clone, Debug, Serialize, Deserialize,
)]
pub enum AccessKeyPermission {
    FunctionCall(FunctionCallPermission),

    /// Grants full access to the account.
    /// NOTE: It's used to replace account-level public keys.
    FullAccess,
}

/// Grants limited permission to make transactions with FunctionCallActions
/// The permission can limit the allowed balance to be spent on the prepaid gas.
/// It also restrict the account ID of the receiver for this function call.
/// It also can restrict the method name for the allowed function calls.
#[derive(
    BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Hash, Clone, Debug,
)]
pub struct FunctionCallPermission {
    /// Allowance is a balance limit to use by this access key to pay for function call gas and
    /// transaction fees. When this access key is used, both account balance and the allowance is
    /// decreased by the same value.
    /// `None` means unlimited allowance.
    /// NOTE: To change or increase the allowance, the old access key needs to be deleted and a new
    /// access key should be created.
    pub allowance: Option<NearToken>,

    // This isn't an AccountId because already existing records in testnet genesis have invalid
    // values for this field (see: https://github.com/near/nearcore/pull/4621#issuecomment-892099860)
    // we accommodate those by using a string, allowing us to read and parse genesis.
    /// The access key only allows transactions with the given receiver's account id.
    pub receiver_id: String,

    /// A list of method names that can be used. The access key only allows transactions with the
    /// function call of one of the given method names.
    /// Empty list means any method name can be used.
    pub method_names: Vec<String>,
}

/// Describes the key of a specific key-value record in a state trie.
#[derive(Debug, Clone, PartialEq, Eq, BorshDeserialize, BorshSerialize)]
pub enum TrieKey {
    /// Used to store `primitives::account::Account` struct for a given `AccountId`.
    Account {
        account_id: AccountId,
    },
    /// Used to store `Vec<u8>` contract code for a given `AccountId`.
    ContractCode {
        account_id: AccountId,
    },
    /// Used to store `primitives::account::AccessKey` struct for a given `AccountId` and
    /// a given `public_key` of the `AccessKey`.
    AccessKey {
        account_id: AccountId,
        public_key: PublicKey,
    },
    /// Used to store `primitives::receipt::ReceivedData` struct for a given receiver's `AccountId`
    /// of `DataReceipt` and a given `data_id` (the unique identifier for the data).
    /// NOTE: This is one of the input data for some action receipt.
    /// The action receipt might be still not be received or requires more pending input data.
    ReceivedData {
        receiver_id: AccountId,
        data_id: CryptoHash,
    },
    /// Used to store receipt ID `primitives::hash::CryptoHash` for a given receiver's `AccountId`
    /// of the receipt and a given `data_id` (the unique identifier for the required input data).
    /// NOTE: This receipt ID indicates the postponed receipt. We store `receipt_id` for performance
    /// purposes to avoid deserializing the entire receipt.
    PostponedReceiptId {
        receiver_id: AccountId,
        data_id: CryptoHash,
    },
    /// Used to store the number of still missing input data `u32` for a given receiver's
    /// `AccountId` and a given `receipt_id` of the receipt.
    PendingDataCount {
        receiver_id: AccountId,
        receipt_id: CryptoHash,
    },
    /// Used to store the postponed receipt `primitives::receipt::Receipt` for a given receiver's
    /// `AccountId` and a given `receipt_id` of the receipt.
    PostponedReceipt {
        receiver_id: AccountId,
        receipt_id: CryptoHash,
    },
    /// Used to store indices of the delayed receipts queue (`node-runtime::DelayedReceiptIndices`).
    /// NOTE: It is a singleton per shard.
    DelayedReceiptIndices,
    /// Used to store a delayed receipt `primitives::receipt::Receipt` for a given index `u64`
    /// in a delayed receipt queue. The queue is unique per shard.
    DelayedReceipt {
        index: u64,
    },
    /// Used to store a key-value record `Vec<u8>` within a contract deployed on a given `AccountId`
    /// and a given key.
    ContractData {
        account_id: AccountId,
        key: Vec<u8>,
    },
    /// Used to store head and tail indices of the PromiseYield timeout queue.
    /// NOTE: It is a singleton per shard.
    PromiseYieldIndices,
    /// Used to store the element at given index `u64` in the PromiseYield timeout queue.
    /// The queue is unique per shard.
    PromiseYieldTimeout {
        index: u64,
    },
    /// Used to store the postponed promise yield receipt `primitives::receipt::Receipt`
    /// for a given receiver's `AccountId` and a given `data_id`.
    PromiseYieldReceipt {
        receiver_id: AccountId,
        data_id: CryptoHash,
    },
    /// Used to store indices of the buffered receipts queues per shard.
    /// NOTE: It is a singleton per shard, holding indices for all outgoing shards.
    BufferedReceiptIndices,
    /// Used to store a buffered receipt `primitives::receipt::Receipt` for a
    /// given index `u64` and receiving shard. There is one unique queue
    /// per ordered shard pair. The trie for shard X stores all queues for pairs
    /// (X,*) without (X,X).
    BufferedReceipt {
        receiving_shard: ShardId,
        index: u64,
    },
    BandwidthSchedulerState,
    /// Stores `ReceiptGroupsQueueData` for the receipt groups queue
    /// which corresponds to the buffered receipts to `receiver_shard`.
    BufferedReceiptGroupsQueueData {
        receiving_shard: ShardId,
    },
    /// A single item of `ReceiptGroupsQueue`. Values are of type `ReceiptGroup`.
    BufferedReceiptGroupsQueueItem {
        receiving_shard: ShardId,
        index: u64,
    },
    GlobalContractCode {
        identifier: GlobalContractCodeIdentifier,
    },
}

#[derive(Debug, Clone, PartialEq, Eq, BorshDeserialize, BorshSerialize)]
pub enum GlobalContractCodeIdentifier {
    CodeHash(CryptoHash),
    AccountId(AccountId),
}

/// Error returned in the ExecutionOutcome in case of failure
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Deserialize, Serialize)]
pub enum TxExecutionError {
    /// An error happened during Action execution
    ActionError(ActionError),
    /// An error happened during Transaction execution
    InvalidTxError(InvalidTxError),
}

impl std::error::Error for TxExecutionError {}

impl Display for TxExecutionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        match self {
            TxExecutionError::ActionError(e) => write!(f, "{}", e),
            TxExecutionError::InvalidTxError(e) => write!(f, "{}", e),
        }
    }
}

impl From<ActionError> for TxExecutionError {
    fn from(error: ActionError) -> Self {
        TxExecutionError::ActionError(error)
    }
}

impl From<InvalidTxError> for TxExecutionError {
    fn from(error: InvalidTxError) -> Self {
        TxExecutionError::InvalidTxError(error)
    }
}

/// Error returned from `Runtime::apply`
#[derive(Debug, Clone, PartialEq)]
pub enum RuntimeError {
    /// An unexpected integer overflow occurred. The likely issue is an invalid state or the transition.
    UnexpectedIntegerOverflow(String),
    /// An error happened during TX verification and account charging.
    InvalidTxError(InvalidTxError),
    /// Unexpected error which is typically related to the node storage corruption.
    /// It's possible the input state is invalid or malicious.
    StorageError(StorageError),
    /// An error happens if `check_balance` fails, which is likely an indication of an invalid state.
    BalanceMismatchError(Box<BalanceMismatchError>),
    /// The incoming receipt didn't pass the validation, it's likely a malicious behavior.
    ReceiptValidationError(ReceiptValidationError),
    /// Error when accessing validator information. Happens inside epoch manager.
    ValidatorError(EpochError),
}

impl std::fmt::Display for RuntimeError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.write_str(&format!("{:?}", self))
    }
}

impl std::error::Error for RuntimeError {}

/// Contexts in which `StorageError::MissingTrieValue` error might occur.
#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize, BorshSerialize, BorshDeserialize)]
pub enum MissingTrieValueContext {
    /// Missing trie value when reading from TrieIterator.
    TrieIterator,
    /// Missing trie value when reading from TriePrefetchingStorage.
    TriePrefetchingStorage,
    /// Missing trie value when reading from TrieMemoryPartialStorage.
    TrieMemoryPartialStorage,
    /// Missing trie value when reading from TrieStorage.
    TrieStorage,
}

impl MissingTrieValueContext {
    pub fn metrics_label(&self) -> &str {
        match self {
            Self::TrieIterator => "trie_iterator",
            Self::TriePrefetchingStorage => "trie_prefetching_storage",
            Self::TrieMemoryPartialStorage => "trie_memory_partial_storage",
            Self::TrieStorage => "trie_storage",
        }
    }
}

/// Errors which may occur during working with trie storages, storing
/// trie values (trie nodes and state values) by their hashes.
#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize, BorshSerialize, BorshDeserialize)]
pub enum StorageError {
    /// Key-value db internal failure
    StorageInternalError,
    /// Requested trie value by its hash which is missing in storage.
    MissingTrieValue(MissingTrieValueContext, CryptoHash),
    /// Found trie node which shouldn't be part of state. Raised during
    /// validation of state sync parts where incorrect node was passed.
    /// TODO (#8997): consider including hash of trie node.
    UnexpectedTrieValue,
    /// Either invalid state or key-value db is corrupted.
    /// For PartialStorage it cannot be corrupted.
    /// Error message is unreliable and for debugging purposes only. It's also probably ok to
    /// panic in every place that produces this error.
    /// We can check if db is corrupted by verifying everything in the state trie.
    StorageInconsistentState(String),
    /// Flat storage error, meaning that it doesn't support some block anymore.
    /// We guarantee that such block cannot become final, thus block processing
    /// must resume normally.
    FlatStorageBlockNotSupported(String),
    /// In-memory trie could not be loaded for some reason.
    MemTrieLoadingError(String),
    /// Indicates that a resharding operation on flat storage is already in progress,
    /// when it wasn't expected to be so.
    FlatStorageReshardingAlreadyInProgress,
}

impl std::fmt::Display for StorageError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.write_str(&format!("{:?}", self))
    }
}

impl std::error::Error for StorageError {}

/// An error happened during TX execution
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Deserialize, Serialize)]
pub enum InvalidTxError {
    /// Happens if a wrong AccessKey used or AccessKey has not enough permissions
    InvalidAccessKeyError(InvalidAccessKeyError),
    /// TX signer_id is not a valid [`AccountId`]
    InvalidSignerId {
        signer_id: String,
    },
    /// TX signer_id is not found in a storage
    SignerDoesNotExist {
        signer_id: AccountId,
    },
    /// Transaction nonce must be `account[access_key].nonce + 1`.
    InvalidNonce {
        tx_nonce: Nonce,
        ak_nonce: Nonce,
    },
    /// Transaction nonce is larger than the upper bound given by the block height
    NonceTooLarge {
        tx_nonce: Nonce,
        upper_bound: Nonce,
    },
    /// TX receiver_id is not a valid AccountId
    InvalidReceiverId {
        receiver_id: String,
    },
    /// TX signature is not valid
    InvalidSignature,
    /// Account does not have enough balance to cover TX cost
    NotEnoughBalance {
        signer_id: AccountId,
        balance: NearToken,
        cost: NearToken,
    },
    /// Signer account doesn't have enough balance after transaction.
    LackBalanceForState {
        /// An account which doesn't have enough balance to cover storage.
        signer_id: AccountId,
        /// Required balance to cover the state.
        amount: NearToken,
    },
    /// An integer overflow occurred during transaction cost estimation.
    CostOverflow,
    /// Transaction parent block hash doesn't belong to the current chain
    InvalidChain,
    /// Transaction has expired
    Expired,
    /// An error occurred while validating actions of a Transaction.
    ActionsValidation(ActionsValidationError),
    /// The size of serialized transaction exceeded the limit.
    TransactionSizeExceeded {
        size: u64,
        limit: u64,
    },
    /// Transaction version is invalid.
    InvalidTransactionVersion,
    // Error occurred during storage access
    StorageError(StorageError),
    /// The receiver shard of the transaction is too congested to accept new
    /// transactions at the moment.
    ShardCongested {
        /// The congested shard.
        shard_id: u32,
        /// A value between 0 (no congestion) and 1 (max congestion).
        congestion_level: f64,
    },
    /// The receiver shard of the transaction missed several chunks and rejects
    /// new transaction until it can make progress again.
    ShardStuck {
        /// The shard that fails making progress.
        shard_id: u32,
        /// The number of blocks since the last included chunk of the shard.
        missed_chunks: u64,
    },
}

impl From<StorageError> for InvalidTxError {
    fn from(error: StorageError) -> Self {
        InvalidTxError::StorageError(error)
    }
}

impl std::error::Error for InvalidTxError {}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
pub enum InvalidAccessKeyError {
    /// The access key identified by the `public_key` doesn't exist for the account
    AccessKeyNotFound {
        account_id: AccountId,
        public_key: Box<PublicKey>,
    },
    /// Transaction `receiver_id` doesn't match the access key receiver_id
    ReceiverMismatch {
        tx_receiver: AccountId,
        ak_receiver: String,
    },
    /// Transaction method name isn't allowed by the access key
    MethodNameMismatch { method_name: String },
    /// Transaction requires a full permission access key.
    RequiresFullAccess,
    /// Access Key does not have enough allowance to cover transaction cost
    NotEnoughAllowance {
        account_id: AccountId,
        public_key: Box<PublicKey>,
        #[serde(with = "dec_format")]
        allowance: Balance,
        #[serde(with = "dec_format")]
        cost: Balance,
    },
    /// Having a deposit with a function call action is not allowed with a function call access key.
    DepositWithFunctionCall,
}

/// Describes the error for validating a list of actions.
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ActionsValidationError {
    /// The delete action must be a final action in transaction
    DeleteActionMustBeFinal,
    /// The total prepaid gas (for all given actions) exceeded the limit.
    TotalPrepaidGasExceeded { total_prepaid_gas: Gas, limit: Gas },
    /// The number of actions exceeded the given limit.
    TotalNumberOfActionsExceeded {
        total_number_of_actions: u64,
        limit: u64,
    },
    /// The total number of bytes of the method names exceeded the limit in a Add Key action.
    AddKeyMethodNamesNumberOfBytesExceeded {
        total_number_of_bytes: u64,
        limit: u64,
    },
    /// The length of some method name exceeded the limit in a Add Key action.
    AddKeyMethodNameLengthExceeded { length: u64, limit: u64 },
    /// Integer overflow during a compute.
    IntegerOverflow,
    /// Invalid account ID.
    InvalidAccountId { account_id: String },
    /// The size of the contract code exceeded the limit in a DeployContract action.
    ContractSizeExceeded { size: u64, limit: u64 },
    /// The length of the method name exceeded the limit in a Function Call action.
    FunctionCallMethodNameLengthExceeded { length: u64, limit: u64 },
    /// The length of the arguments exceeded the limit in a Function Call action.
    FunctionCallArgumentsLengthExceeded { length: u64, limit: u64 },
    /// An attempt to stake with a public key that is not convertible to ristretto.
    UnsuitableStakingKey { public_key: Box<PublicKey> },
    /// The attached amount of gas in a FunctionCall action has to be a positive number.
    FunctionCallZeroAttachedGas,
    /// There should be the only one DelegateAction
    DelegateActionMustBeOnlyOne,
    /// The transaction includes a feature that the current protocol version
    /// does not support.
    ///
    /// Note: we stringify the protocol feature name instead of using
    /// `ProtocolFeature` here because we don't want to leak the internals of
    /// that type into observable borsh serialization.
    UnsupportedProtocolFeature {
        protocol_feature: String,
        version: ProtocolVersion,
    },
}

/// Describes the error for validating a receipt.
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ReceiptValidationError {
    /// The `predecessor_id` of a Receipt is not valid.
    InvalidPredecessorId { account_id: String },
    /// The `receiver_id` of a Receipt is not valid.
    InvalidReceiverId { account_id: String },
    /// The `signer_id` of an ActionReceipt is not valid.
    InvalidSignerId { account_id: String },
    /// The `receiver_id` of a DataReceiver within an ActionReceipt is not valid.
    InvalidDataReceiverId { account_id: String },
    /// The length of the returned data exceeded the limit in a DataReceipt.
    ReturnedValueLengthExceeded { length: u64, limit: u64 },
    /// The number of input data dependencies exceeds the limit in an ActionReceipt.
    NumberInputDataDependenciesExceeded {
        number_of_input_data_dependencies: u64,
        limit: u64,
    },
    /// An error occurred while validating actions of an ActionReceipt.
    ActionsValidation(ActionsValidationError),
    /// Receipt is bigger than the limit.
    ReceiptSizeExceeded { size: u64, limit: u64 },
}

impl Display for ReceiptValidationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        match self {
            ReceiptValidationError::InvalidPredecessorId { account_id } => {
                write!(
                    f,
                    "The predecessor_id `{}` of a Receipt is not valid.",
                    account_id
                )
            }
            ReceiptValidationError::InvalidReceiverId { account_id } => {
                write!(
                    f,
                    "The receiver_id `{}` of a Receipt is not valid.",
                    account_id
                )
            }
            ReceiptValidationError::InvalidSignerId { account_id } => {
                write!(
                    f,
                    "The signer_id `{}` of an ActionReceipt is not valid.",
                    account_id
                )
            }
            ReceiptValidationError::InvalidDataReceiverId { account_id } => write!(
                f,
                "The receiver_id `{}` of a DataReceiver within an ActionReceipt is not valid.",
                account_id
            ),
            ReceiptValidationError::ReturnedValueLengthExceeded { length, limit } => write!(
                f,
                "The length of the returned data {} exceeded the limit {} in a DataReceipt",
                length, limit
            ),
            ReceiptValidationError::NumberInputDataDependenciesExceeded {
                number_of_input_data_dependencies,
                limit,
            } => write!(
                f,
                "The number of input data dependencies {} exceeded the limit {} in an ActionReceipt",
                number_of_input_data_dependencies, limit
            ),
            ReceiptValidationError::ActionsValidation(e) => write!(f, "{}", e),
            ReceiptValidationError::ReceiptSizeExceeded { size, limit } => {
                write!(
                    f,
                    "The size of the receipt exceeded the limit: {} > {}",
                    size, limit
                )
            }
        }
    }
}

impl std::error::Error for ReceiptValidationError {}

impl Display for ActionsValidationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        match self {
            ActionsValidationError::DeleteActionMustBeFinal => {
                write!(
                    f,
                    "The delete action must be the last action in transaction"
                )
            }
            ActionsValidationError::TotalPrepaidGasExceeded {
                total_prepaid_gas,
                limit,
            } => {
                write!(
                    f,
                    "The total prepaid gas {} exceeds the limit {}",
                    total_prepaid_gas, limit
                )
            }
            ActionsValidationError::TotalNumberOfActionsExceeded {
                total_number_of_actions,
                limit,
            } => {
                write!(
                    f,
                    "The total number of actions {} exceeds the limit {}",
                    total_number_of_actions, limit
                )
            }
            ActionsValidationError::AddKeyMethodNamesNumberOfBytesExceeded {
                total_number_of_bytes,
                limit,
            } => write!(
                f,
                "The total number of bytes in allowed method names {} exceeds the maximum allowed number {} in a AddKey action",
                total_number_of_bytes, limit
            ),
            ActionsValidationError::AddKeyMethodNameLengthExceeded { length, limit } => write!(
                f,
                "The length of some method name {} exceeds the maximum allowed length {} in a AddKey action",
                length, limit
            ),
            ActionsValidationError::IntegerOverflow => {
                write!(f, "Integer overflow during a compute",)
            }
            ActionsValidationError::InvalidAccountId { account_id } => {
                write!(f, "Invalid account ID `{}`", account_id)
            }
            ActionsValidationError::ContractSizeExceeded { size, limit } => write!(
                f,
                "The length of the contract size {} exceeds the maximum allowed size {} in a DeployContract action",
                size, limit
            ),
            ActionsValidationError::FunctionCallMethodNameLengthExceeded { length, limit } => {
                write!(
                    f,
                    "The length of the method name {} exceeds the maximum allowed length {} in a FunctionCall action",
                    length, limit
                )
            }
            ActionsValidationError::FunctionCallArgumentsLengthExceeded { length, limit } => {
                write!(
                    f,
                    "The length of the arguments {} exceeds the maximum allowed length {} in a FunctionCall action",
                    length, limit
                )
            }
            ActionsValidationError::UnsuitableStakingKey { public_key } => write!(
                f,
                "The staking key must be ristretto compatible ED25519 key. {} is provided instead.",
                public_key,
            ),
            ActionsValidationError::FunctionCallZeroAttachedGas => write!(
                f,
                "The attached amount of gas in a FunctionCall action has to be a positive number",
            ),
            ActionsValidationError::DelegateActionMustBeOnlyOne => {
                write!(f, "The actions can contain the ony one DelegateAction")
            }
            ActionsValidationError::UnsupportedProtocolFeature {
                protocol_feature,
                version,
            } => {
                write!(
                    f,
                    "Transaction requires protocol feature {} / version {} which is not supported by the current protocol version",
                    protocol_feature, version,
                )
            }
        }
    }
}

impl std::error::Error for ActionsValidationError {}

/// An error happened during Action execution
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
pub struct ActionError {
    /// Index of the failed action in the transaction.
    /// Action index is not defined if ActionError.kind is `ActionErrorKind::LackBalanceForState`
    pub index: Option<u64>,
    /// The kind of ActionError happened
    pub kind: ActionErrorKind,
}

impl std::error::Error for ActionError {}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
pub enum ActionErrorKind {
    /// Happens when CreateAccount action tries to create an account with account_id which is already exists in the storage
    AccountAlreadyExists { account_id: AccountId },
    /// Happens when TX receiver_id doesn't exist (but action is not Action::CreateAccount)
    AccountDoesNotExist { account_id: AccountId },
    /// A top-level account ID can only be created by registrar.
    CreateAccountOnlyByRegistrar {
        account_id: AccountId,
        registrar_account_id: AccountId,
        predecessor_id: AccountId,
    },

    /// A newly created account must be under a namespace of the creator account
    CreateAccountNotAllowed {
        account_id: AccountId,
        predecessor_id: AccountId,
    },
    /// Administrative actions like `DeployContract`, `Stake`, `AddKey`, `DeleteKey`. can be proceed only if sender=receiver
    /// or the first TX action is a `CreateAccount` action
    ActorNoPermission {
        account_id: AccountId,
        actor_id: AccountId,
    },
    /// Account tries to remove an access key that doesn't exist
    DeleteKeyDoesNotExist {
        account_id: AccountId,
        public_key: Box<PublicKey>,
    },
    /// The public key is already used for an existing access key
    AddKeyAlreadyExists {
        account_id: AccountId,
        public_key: Box<PublicKey>,
    },
    /// Account is staking and can not be deleted
    DeleteAccountStaking { account_id: AccountId },
    /// ActionReceipt can't be completed, because the remaining balance will not be enough to cover storage.
    LackBalanceForState {
        /// An account which needs balance
        account_id: AccountId,
        /// Balance required to complete an action.
        #[serde(with = "dec_format")]
        amount: Balance,
    },
    /// Account is not yet staked, but tries to unstake
    TriesToUnstake { account_id: AccountId },
    /// The account doesn't have enough balance to increase the stake.
    TriesToStake {
        account_id: AccountId,
        #[serde(with = "dec_format")]
        stake: Balance,
        #[serde(with = "dec_format")]
        locked: Balance,
        #[serde(with = "dec_format")]
        balance: Balance,
    },
    InsufficientStake {
        account_id: AccountId,
        #[serde(with = "dec_format")]
        stake: Balance,
        #[serde(with = "dec_format")]
        minimum_stake: Balance,
    },
    /// An error occurred during a `FunctionCall` Action, parameter is debug message.
    FunctionCallError(FunctionCallError),
    /// Error occurs when a new `ActionReceipt` created by the `FunctionCall` action fails
    /// receipt validation.
    NewReceiptValidationError(ReceiptValidationError),
    /// Error occurs when a `CreateAccount` action is called on a NEAR-implicit or ETH-implicit account.
    /// See NEAR-implicit account creation NEP: <https://github.com/nearprotocol/NEPs/pull/71>.
    /// Also, see ETH-implicit account creation NEP: <https://github.com/near/NEPs/issues/518>.
    ///
    /// TODO(#8598): This error is named very poorly. A better name would be
    /// `OnlyNamedAccountCreationAllowed`.
    OnlyImplicitAccountCreationAllowed { account_id: AccountId },
    /// Delete account whose state is large is temporarily banned.
    DeleteAccountWithLargeState { account_id: AccountId },
    /// Signature does not match the provided actions and given signer public key.
    DelegateActionInvalidSignature,
    /// Receiver of the transaction doesn't match Sender of the delegate action
    DelegateActionSenderDoesNotMatchTxReceiver {
        sender_id: AccountId,
        receiver_id: AccountId,
    },
    /// Delegate action has expired. `max_block_height` is less than actual block height.
    DelegateActionExpired,
    /// The given public key doesn't exist for Sender account
    DelegateActionAccessKeyError(InvalidAccessKeyError),
    /// DelegateAction nonce must be greater sender[public_key].nonce
    DelegateActionInvalidNonce {
        delegate_nonce: Nonce,
        ak_nonce: Nonce,
    },
    /// DelegateAction nonce is larger than the upper bound given by the block height
    DelegateActionNonceTooLarge {
        delegate_nonce: Nonce,
        upper_bound: Nonce,
    },
    GlobalContractDoesNotExist {
        identifier: GlobalContractIdentifier,
    },
}

impl From<ActionErrorKind> for ActionError {
    fn from(e: ActionErrorKind) -> ActionError {
        ActionError {
            index: None,
            kind: e,
        }
    }
}

impl Display for InvalidTxError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        match self {
            InvalidTxError::InvalidSignerId { signer_id } => {
                write!(
                    f,
                    "Invalid signer account ID {:?} according to requirements",
                    signer_id
                )
            }
            InvalidTxError::SignerDoesNotExist { signer_id } => {
                write!(f, "Signer {:?} does not exist", signer_id)
            }
            InvalidTxError::InvalidAccessKeyError(access_key_error) => {
                Display::fmt(&access_key_error, f)
            }
            InvalidTxError::InvalidNonce { tx_nonce, ak_nonce } => write!(
                f,
                "Transaction nonce {} must be larger than nonce of the used access key {}",
                tx_nonce, ak_nonce
            ),
            InvalidTxError::InvalidReceiverId { receiver_id } => {
                write!(
                    f,
                    "Invalid receiver account ID {:?} according to requirements",
                    receiver_id
                )
            }
            InvalidTxError::InvalidSignature => {
                write!(f, "Transaction is not signed with the given public key")
            }
            InvalidTxError::NotEnoughBalance {
                signer_id,
                balance,
                cost,
            } => write!(
                f,
                "Sender {:?} does not have enough balance {} for operation costing {}",
                signer_id, balance, cost
            ),
            InvalidTxError::LackBalanceForState { signer_id, amount } => {
                write!(
                    f,
                    "Failed to execute, because the account {:?} wouldn't have enough balance to cover storage, required to have {} yoctoNEAR more",
                    signer_id, amount
                )
            }
            InvalidTxError::CostOverflow => {
                write!(f, "Transaction gas or balance cost is too high")
            }
            InvalidTxError::InvalidChain => {
                write!(
                    f,
                    "Transaction parent block hash doesn't belong to the current chain"
                )
            }
            InvalidTxError::Expired => {
                write!(f, "Transaction has expired")
            }
            InvalidTxError::ActionsValidation(error) => {
                write!(f, "Transaction actions validation error: {}", error)
            }
            InvalidTxError::NonceTooLarge {
                tx_nonce,
                upper_bound,
            } => {
                write!(
                    f,
                    "Transaction nonce {} must be smaller than the access key nonce upper bound {}",
                    tx_nonce, upper_bound
                )
            }
            InvalidTxError::TransactionSizeExceeded { size, limit } => {
                write!(
                    f,
                    "Size of serialized transaction {} exceeded the limit {}",
                    size, limit
                )
            }
            InvalidTxError::InvalidTransactionVersion => {
                write!(f, "Transaction version is invalid")
            }
            InvalidTxError::StorageError(error) => {
                write!(f, "Storage error: {}", error)
            }
            InvalidTxError::ShardCongested {
                shard_id,
                congestion_level,
            } => {
                write!(
                    f,
                    "Shard {shard_id} is currently at congestion level {congestion_level:.3} and rejects new transactions."
                )
            }
            InvalidTxError::ShardStuck {
                shard_id,
                missed_chunks,
            } => {
                write!(
                    f,
                    "Shard {shard_id} missed {missed_chunks} chunks and rejects new transactions."
                )
            }
        }
    }
}

impl From<InvalidAccessKeyError> for InvalidTxError {
    fn from(error: InvalidAccessKeyError) -> Self {
        InvalidTxError::InvalidAccessKeyError(error)
    }
}

impl Display for InvalidAccessKeyError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        match self {
            InvalidAccessKeyError::AccessKeyNotFound {
                account_id,
                public_key,
            } => write!(
                f,
                "Signer {:?} doesn't have access key with the given public_key {}",
                account_id, public_key
            ),
            InvalidAccessKeyError::ReceiverMismatch {
                tx_receiver,
                ak_receiver,
            } => write!(
                f,
                "Transaction receiver_id {:?} doesn't match the access key receiver_id {:?}",
                tx_receiver, ak_receiver
            ),
            InvalidAccessKeyError::MethodNameMismatch { method_name } => write!(
                f,
                "Transaction method name {:?} isn't allowed by the access key",
                method_name
            ),
            InvalidAccessKeyError::RequiresFullAccess => {
                write!(
                    f,
                    "Invalid access key type. Full-access keys are required for transactions that have multiple or non-function-call actions"
                )
            }
            InvalidAccessKeyError::NotEnoughAllowance {
                account_id,
                public_key,
                allowance,
                cost,
            } => write!(
                f,
                "Access Key {:?}:{} does not have enough balance {} for transaction costing {}",
                account_id, public_key, allowance, cost
            ),
            InvalidAccessKeyError::DepositWithFunctionCall => {
                write!(
                    f,
                    "Having a deposit with a function call action is not allowed with a function call access key."
                )
            }
        }
    }
}

impl std::error::Error for InvalidAccessKeyError {}

/// Happens when the input balance doesn't match the output balance in Runtime apply.
#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
pub struct BalanceMismatchError {
    // Input balances
    #[serde(with = "dec_format")]
    pub incoming_validator_rewards: Balance,
    #[serde(with = "dec_format")]
    pub initial_accounts_balance: Balance,
    #[serde(with = "dec_format")]
    pub incoming_receipts_balance: Balance,
    #[serde(with = "dec_format")]
    pub processed_delayed_receipts_balance: Balance,
    #[serde(with = "dec_format")]
    pub initial_postponed_receipts_balance: Balance,
    #[serde(with = "dec_format")]
    pub forwarded_buffered_receipts_balance: Balance,
    // Output balances
    #[serde(with = "dec_format")]
    pub final_accounts_balance: Balance,
    #[serde(with = "dec_format")]
    pub outgoing_receipts_balance: Balance,
    #[serde(with = "dec_format")]
    pub new_delayed_receipts_balance: Balance,
    #[serde(with = "dec_format")]
    pub final_postponed_receipts_balance: Balance,
    #[serde(with = "dec_format")]
    pub tx_burnt_amount: Balance,
    #[serde(with = "dec_format")]
    pub slashed_burnt_amount: Balance,
    #[serde(with = "dec_format")]
    pub new_buffered_receipts_balance: Balance,
    #[serde(with = "dec_format")]
    pub other_burnt_amount: Balance,
}

impl Display for BalanceMismatchError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        // Using saturating add to avoid overflow in display
        let initial_balance = self
            .incoming_validator_rewards
            .saturating_add(self.initial_accounts_balance)
            .saturating_add(self.incoming_receipts_balance)
            .saturating_add(self.processed_delayed_receipts_balance)
            .saturating_add(self.initial_postponed_receipts_balance)
            .saturating_add(self.forwarded_buffered_receipts_balance);
        let final_balance = self
            .final_accounts_balance
            .saturating_add(self.outgoing_receipts_balance)
            .saturating_add(self.new_delayed_receipts_balance)
            .saturating_add(self.final_postponed_receipts_balance)
            .saturating_add(self.tx_burnt_amount)
            .saturating_add(self.slashed_burnt_amount)
            .saturating_add(self.other_burnt_amount)
            .saturating_add(self.new_buffered_receipts_balance);

        write!(
            f,
            "Balance Mismatch Error. The input balance {} doesn't match output balance {}\n\
             Inputs:\n\
             \tIncoming validator rewards sum: {}\n\
             \tInitial accounts balance sum: {}\n\
             \tIncoming receipts balance sum: {}\n\
             \tProcessed delayed receipts balance sum: {}\n\
             \tInitial postponed receipts balance sum: {}\n\
             \tForwarded buffered receipts sum: {}\n\
             Outputs:\n\
             \tFinal accounts balance sum: {}\n\
             \tOutgoing receipts balance sum: {}\n\
             \tNew delayed receipts balance sum: {}\n\
             \tFinal postponed receipts balance sum: {}\n\
             \tTx fees burnt amount: {}\n\
             \tSlashed amount: {}\n\
             \tNew buffered receipts balance sum: {}\n\
             \tOther burnt amount: {}",
            initial_balance,
            final_balance,
            self.incoming_validator_rewards,
            self.initial_accounts_balance,
            self.incoming_receipts_balance,
            self.processed_delayed_receipts_balance,
            self.initial_postponed_receipts_balance,
            self.forwarded_buffered_receipts_balance,
            self.final_accounts_balance,
            self.outgoing_receipts_balance,
            self.new_delayed_receipts_balance,
            self.final_postponed_receipts_balance,
            self.tx_burnt_amount,
            self.slashed_burnt_amount,
            self.new_buffered_receipts_balance,
            self.other_burnt_amount,
        )
    }
}

impl std::error::Error for BalanceMismatchError {}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Eq)]
pub struct IntegerOverflowError;

impl std::fmt::Display for IntegerOverflowError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.write_str(&format!("{:?}", self))
    }
}

impl std::error::Error for IntegerOverflowError {}

impl From<IntegerOverflowError> for InvalidTxError {
    fn from(_: IntegerOverflowError) -> Self {
        InvalidTxError::CostOverflow
    }
}

impl From<IntegerOverflowError> for RuntimeError {
    fn from(err: IntegerOverflowError) -> Self {
        RuntimeError::UnexpectedIntegerOverflow(err.to_string())
    }
}

impl From<StorageError> for RuntimeError {
    fn from(e: StorageError) -> Self {
        RuntimeError::StorageError(e)
    }
}

impl From<BalanceMismatchError> for RuntimeError {
    fn from(e: BalanceMismatchError) -> Self {
        RuntimeError::BalanceMismatchError(Box::new(e))
    }
}

impl From<InvalidTxError> for RuntimeError {
    fn from(e: InvalidTxError) -> Self {
        RuntimeError::InvalidTxError(e)
    }
}

impl From<EpochError> for RuntimeError {
    fn from(e: EpochError) -> Self {
        RuntimeError::ValidatorError(e)
    }
}

impl Display for ActionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        write!(
            f,
            "Action #{}: {}",
            self.index.unwrap_or_default(),
            self.kind
        )
    }
}

impl Display for ActionErrorKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        match self {
            ActionErrorKind::AccountAlreadyExists { account_id } => {
                write!(
                    f,
                    "Can't create a new account {:?}, because it already exists",
                    account_id
                )
            }
            ActionErrorKind::AccountDoesNotExist { account_id } => write!(
                f,
                "Can't complete the action because account {:?} doesn't exist",
                account_id
            ),
            ActionErrorKind::ActorNoPermission {
                actor_id,
                account_id,
            } => write!(
                f,
                "Actor {:?} doesn't have permission to account {:?} to complete the action",
                actor_id, account_id
            ),
            ActionErrorKind::LackBalanceForState { account_id, amount } => write!(
                f,
                "The account {} wouldn't have enough balance to cover storage, required to have {} yoctoNEAR more",
                account_id, amount
            ),
            ActionErrorKind::TriesToUnstake { account_id } => {
                write!(
                    f,
                    "Account {:?} is not yet staked, but tries to unstake",
                    account_id
                )
            }
            ActionErrorKind::TriesToStake {
                account_id,
                stake,
                locked,
                balance,
            } => write!(
                f,
                "Account {:?} tries to stake {}, but has staked {} and only has {}",
                account_id, stake, locked, balance
            ),
            ActionErrorKind::CreateAccountOnlyByRegistrar {
                account_id,
                registrar_account_id,
                predecessor_id,
            } => write!(
                f,
                "A top-level account ID {:?} can't be created by {:?}, short top-level account IDs can only be created by {:?}",
                account_id, predecessor_id, registrar_account_id,
            ),
            ActionErrorKind::CreateAccountNotAllowed {
                account_id,
                predecessor_id,
            } => write!(
                f,
                "A sub-account ID {:?} can't be created by account {:?}",
                account_id, predecessor_id,
            ),
            ActionErrorKind::DeleteKeyDoesNotExist { account_id, .. } => write!(
                f,
                "Account {:?} tries to remove an access key that doesn't exist",
                account_id
            ),
            ActionErrorKind::AddKeyAlreadyExists { public_key, .. } => write!(
                f,
                "The public key {:?} is already used for an existing access key",
                public_key
            ),
            ActionErrorKind::DeleteAccountStaking { account_id } => {
                write!(
                    f,
                    "Account {:?} is staking and can not be deleted",
                    account_id
                )
            }
            ActionErrorKind::FunctionCallError(s) => write!(f, "{:?}", s),
            ActionErrorKind::NewReceiptValidationError(e) => {
                write!(
                    f,
                    "An new action receipt created during a FunctionCall is not valid: {}",
                    e
                )
            }
            ActionErrorKind::InsufficientStake {
                account_id,
                stake,
                minimum_stake,
            } => write!(
                f,
                "Account {} tries to stake {} but minimum required stake is {}",
                account_id, stake, minimum_stake
            ),
            ActionErrorKind::OnlyImplicitAccountCreationAllowed { account_id } => write!(
                f,
                "CreateAccount action is called on hex-characters account of length 64 {}",
                account_id
            ),
            ActionErrorKind::DeleteAccountWithLargeState { account_id } => write!(
                f,
                "The state of account {} is too large and therefore cannot be deleted",
                account_id
            ),
            ActionErrorKind::DelegateActionInvalidSignature => {
                write!(f, "DelegateAction is not signed with the given public key")
            }
            ActionErrorKind::DelegateActionSenderDoesNotMatchTxReceiver {
                sender_id,
                receiver_id,
            } => write!(
                f,
                "Transaction receiver {} doesn't match DelegateAction sender {}",
                receiver_id, sender_id
            ),
            ActionErrorKind::DelegateActionExpired => write!(f, "DelegateAction has expired"),
            ActionErrorKind::DelegateActionAccessKeyError(access_key_error) => {
                Display::fmt(&access_key_error, f)
            }
            ActionErrorKind::DelegateActionInvalidNonce {
                delegate_nonce,
                ak_nonce,
            } => write!(
                f,
                "DelegateAction nonce {} must be larger than nonce of the used access key {}",
                delegate_nonce, ak_nonce
            ),
            ActionErrorKind::DelegateActionNonceTooLarge {
                delegate_nonce,
                upper_bound,
            } => write!(
                f,
                "DelegateAction nonce {} must be smaller than the access key nonce upper bound {}",
                delegate_nonce, upper_bound
            ),
            ActionErrorKind::GlobalContractDoesNotExist { identifier } => {
                write!(f, "Global contract identifier {:?} not found", identifier)
            }
        }
    }
}

#[derive(Eq, PartialEq, Clone)]
pub enum EpochError {
    /// Error calculating threshold from given stakes for given number of seats.
    /// Only should happened if calling code doesn't check for integer value of stake > number of seats.
    ThresholdError { stake_sum: Balance, num_seats: u64 },
    /// Requesting validators for an epoch that wasn't computed yet.
    EpochOutOfBounds(EpochId),
    /// Missing block hash in the storage (means there is some structural issue).
    MissingBlock(CryptoHash),
    /// Error due to IO (DB read/write, serialization, etc.).
    IOErr(String),
    /// Given account ID is not a validator in the given epoch ID.
    NotAValidator(AccountId, EpochId),
    /// Error getting information for a shard
    ShardingError(String),
    NotEnoughValidators {
        num_validators: u64,
        num_shards: u64,
    },
    /// Error selecting validators for a chunk.
    ChunkValidatorSelectionError(String),
    /// Error selecting chunk producer for a shard.
    ChunkProducerSelectionError(String),
}

impl std::error::Error for EpochError {}

impl Display for EpochError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            EpochError::ThresholdError {
                stake_sum,
                num_seats,
            } => write!(
                f,
                "Total stake {} must be higher than the number of seats {}",
                stake_sum, num_seats
            ),
            EpochError::EpochOutOfBounds(epoch_id) => {
                write!(f, "Epoch {:?} is out of bounds", epoch_id)
            }
            EpochError::MissingBlock(hash) => write!(f, "Missing block {}", hash),
            EpochError::IOErr(err) => write!(f, "IO: {}", err),
            EpochError::NotAValidator(account_id, epoch_id) => {
                write!(
                    f,
                    "{} is not a validator in epoch {:?}",
                    account_id, epoch_id
                )
            }
            EpochError::ShardingError(err) => write!(f, "Sharding Error: {}", err),
            EpochError::NotEnoughValidators {
                num_shards,
                num_validators,
            } => {
                write!(
                    f,
                    "There were not enough validator proposals to fill all shards. num_proposals: {}, num_shards: {}",
                    num_validators, num_shards
                )
            }
            EpochError::ChunkValidatorSelectionError(err) => {
                write!(f, "Error selecting validators for a chunk: {}", err)
            }
            EpochError::ChunkProducerSelectionError(err) => {
                write!(f, "Error selecting chunk producer: {}", err)
            }
        }
    }
}

impl Debug for EpochError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            EpochError::ThresholdError {
                stake_sum,
                num_seats,
            } => {
                write!(f, "ThresholdError({}, {})", stake_sum, num_seats)
            }
            EpochError::EpochOutOfBounds(epoch_id) => write!(f, "EpochOutOfBounds({:?})", epoch_id),
            EpochError::MissingBlock(hash) => write!(f, "MissingBlock({})", hash),
            EpochError::IOErr(err) => write!(f, "IOErr({})", err),
            EpochError::NotAValidator(account_id, epoch_id) => {
                write!(f, "NotAValidator({}, {:?})", account_id, epoch_id)
            }
            EpochError::ShardingError(err) => write!(f, "ShardingError({})", err),
            EpochError::NotEnoughValidators {
                num_shards,
                num_validators,
            } => {
                write!(f, "NotEnoughValidators({}, {})", num_validators, num_shards)
            }
            EpochError::ChunkValidatorSelectionError(err) => {
                write!(f, "ChunkValidatorSelectionError({})", err)
            }
            EpochError::ChunkProducerSelectionError(err) => {
                write!(f, "ChunkProducerSelectionError({})", err)
            }
        }
    }
}

impl From<std::io::Error> for EpochError {
    fn from(error: std::io::Error) -> Self {
        EpochError::IOErr(error.to_string())
    }
}

#[derive(Debug, Clone, PartialEq, Eq, BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
/// Error that can occur while preparing or executing Wasm smart-contract.
pub enum PrepareError {
    /// Error happened while serializing the module.
    Serialization,
    /// Error happened while deserializing the module.
    Deserialization,
    /// Internal memory declaration has been found in the module.
    InternalMemoryDeclared,
    /// Gas instrumentation failed.
    ///
    /// This most likely indicates the module isn't valid.
    GasInstrumentation,
    /// Stack instrumentation failed.
    ///
    /// This  most likely indicates the module isn't valid.
    StackHeightInstrumentation,
    /// Error happened during instantiation.
    ///
    /// This might indicate that `start` function trapped, or module isn't
    /// instantiable and/or un-linkable.
    Instantiate,
    /// Error creating memory.
    Memory,
    /// Contract contains too many functions.
    TooManyFunctions,
    /// Contract contains too many locals.
    TooManyLocals,
}

/// A kind of a trap happened during execution of a binary
#[derive(Debug, Clone, PartialEq, Eq, BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
pub enum WasmTrap {
    /// An `unreachable` opcode was executed.
    Unreachable,
    /// Call indirect incorrect signature trap.
    IncorrectCallIndirectSignature,
    /// Memory out of bounds trap.
    MemoryOutOfBounds,
    /// Call indirect out of bounds trap.
    CallIndirectOOB,
    /// An arithmetic exception, e.g. divided by zero.
    IllegalArithmetic,
    /// Misaligned atomic access trap.
    MisalignedAtomicAccess,
    /// Indirect call to null.
    IndirectCallToNull,
    /// Stack overflow.
    StackOverflow,
    /// Generic trap.
    GenericTrap,
}

#[derive(Debug, Clone, PartialEq, Eq, BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
pub enum HostError {
    /// String encoding is bad UTF-16 sequence
    BadUTF16,
    /// String encoding is bad UTF-8 sequence
    BadUTF8,
    /// Exceeded the prepaid gas
    GasExceeded,
    /// Exceeded the maximum amount of gas allowed to burn per contract
    GasLimitExceeded,
    /// Exceeded the account balance
    BalanceExceeded,
    /// Tried to call an empty method name
    EmptyMethodName,
    /// Smart contract panicked
    GuestPanic { panic_msg: String },
    /// IntegerOverflow happened during a contract execution
    IntegerOverflow,
    /// `promise_idx` does not correspond to existing promises
    InvalidPromiseIndex { promise_idx: u64 },
    /// Actions can only be appended to non-joint promise.
    CannotAppendActionToJointPromise,
    /// Returning joint promise is currently prohibited
    CannotReturnJointPromise,
    /// Accessed invalid promise result index
    InvalidPromiseResultIndex { result_idx: u64 },
    /// Accessed invalid register id
    InvalidRegisterId { register_id: u64 },
    /// Iterator `iterator_index` was invalidated after its creation by performing a mutable operation on trie
    IteratorWasInvalidated { iterator_index: u64 },
    /// Accessed memory outside the bounds
    MemoryAccessViolation,
    /// VM Logic returned an invalid receipt index
    InvalidReceiptIndex { receipt_index: u64 },
    /// Iterator index `iterator_index` does not exist
    InvalidIteratorIndex { iterator_index: u64 },
    /// VM Logic returned an invalid account id
    InvalidAccountId,
    /// VM Logic returned an invalid method name
    InvalidMethodName,
    /// VM Logic provided an invalid public key
    InvalidPublicKey,
    /// `method_name` is not allowed in view calls
    ProhibitedInView { method_name: String },
    /// The total number of logs will exceed the limit.
    NumberOfLogsExceeded { limit: u64 },
    /// The storage key length exceeded the limit.
    KeyLengthExceeded { length: u64, limit: u64 },
    /// The storage value length exceeded the limit.
    ValueLengthExceeded { length: u64, limit: u64 },
    /// The total log length exceeded the limit.
    TotalLogLengthExceeded { length: u64, limit: u64 },
    /// The maximum number of promises within a FunctionCall exceeded the limit.
    NumberPromisesExceeded { number_of_promises: u64, limit: u64 },
    /// The maximum number of input data dependencies exceeded the limit.
    NumberInputDataDependenciesExceeded {
        number_of_input_data_dependencies: u64,
        limit: u64,
    },
    /// The returned value length exceeded the limit.
    ReturnedValueLengthExceeded { length: u64, limit: u64 },
    /// The contract size for DeployContract action exceeded the limit.
    ContractSizeExceeded { size: u64, limit: u64 },
    /// The host function was deprecated.
    Deprecated { method_name: String },
    /// General errors for ECDSA recover.
    ECRecoverError { msg: String },
    /// Invalid input to alt_bn128 family of functions (e.g., point which isn't
    /// on the curve).
    AltBn128InvalidInput { msg: String },
    /// Invalid input to ed25519 signature verification function (e.g. signature cannot be
    /// derived from bytes).
    Ed25519VerifyInvalidInput { msg: String },
}

#[derive(Debug, Clone, PartialEq, Eq, BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
pub enum MethodResolveError {
    MethodEmptyName,
    MethodNotFound,
    MethodInvalidSignature,
}

#[derive(Debug, Clone, PartialEq, Eq, BorshDeserialize, BorshSerialize, Deserialize, Serialize)]
pub enum CompilationError {
    CodeDoesNotExist {
        account_id: AccountId,
    },
    PrepareError(PrepareError),
    /// This is for defense in depth.
    /// We expect our runtime-independent preparation code to fully catch all invalid wasms,
    /// but, if it ever misses something we’ll emit this error
    WasmerCompileError {
        msg: String,
    },
}

/// Serializable version of `near-vm-runner::FunctionCallError`.
///
/// Must never reorder/remove elements, can only add new variants at the end (but do that very
/// carefully). It describes stable serialization format, and only used by serialization logic.
#[derive(Debug, Clone, PartialEq, Eq, BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub enum FunctionCallError {
    /// Wasm compilation error
    CompilationError(CompilationError),
    /// Wasm binary env link error
    ///
    /// Note: this is only to deserialize old data, use execution error for new data
    LinkError {
        msg: String,
    },
    /// Import/export resolve error
    MethodResolveError(MethodResolveError),
    /// A trap happened during execution of a binary
    ///
    /// Note: this is only to deserialize old data, use execution error for new data
    WasmTrap(WasmTrap),
    WasmUnknownError,
    /// Note: this is only to deserialize old data, use execution error for new data
    HostError(HostError),
    // Unused, can be reused by a future error but must be exactly one error to keep ExecutionError
    // error borsh serialized at correct index
    _EVMError,
    ExecutionError(String),
}

#[derive(Debug)]
pub enum ChunkAccessError {
    ChunkMissing(ChunkHash),
}

impl std::fmt::Display for ChunkAccessError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        f.write_str(&format!("{:?}", self))
    }
}

impl std::error::Error for ChunkAccessError {}

#[derive(
    BorshSerialize,
    BorshDeserialize,
    Hash,
    Eq,
    PartialEq,
    Ord,
    PartialOrd,
    Clone,
    Debug,
    Default,
    Serialize,
    Deserialize,
)]
pub struct ChunkHash(pub CryptoHash);

impl ChunkHash {
    pub fn as_bytes(&self) -> &[u8; 32] {
        self.0.as_bytes()
    }
}

impl AsRef<[u8]> for ChunkHash {
    fn as_ref(&self) -> &[u8] {
        self.0.as_ref()
    }
}

impl From<ChunkHash> for Vec<u8> {
    fn from(chunk_hash: ChunkHash) -> Self {
        chunk_hash.0.into()
    }
}

impl From<CryptoHash> for ChunkHash {
    fn from(crypto_hash: CryptoHash) -> Self {
        Self(crypto_hash)
    }
}

pub fn base64(s: &[u8]) -> String {
    use base64::Engine;
    base64::engine::general_purpose::STANDARD.encode(s)
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Clone, Debug, Serialize, Deserialize)]
pub struct AddKeyAction {
    /// A public key which will be associated with an access_key
    pub public_key: PublicKey,
    /// An access key with the permission
    pub access_key: AccessKey,
}

/// Create account action
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Clone, Debug, Serialize, Deserialize)]
pub struct CreateAccountAction {}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Clone, Debug, Serialize, Deserialize)]
pub struct DeleteAccountAction {
    pub beneficiary_id: AccountId,
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Clone, Debug, Serialize, Deserialize)]
pub struct DeleteKeyAction {
    /// A public key associated with the access_key to be deleted.
    pub public_key: PublicKey,
}

/// Deploy contract action
#[serde_as]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct DeployContractAction {
    /// WebAssembly binary
    #[serde_as(as = "Base64")]
    pub code: Vec<u8>,
}

impl fmt::Debug for DeployContractAction {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("DeployContractAction")
            .field("code", &format_args!("{}", base64(&self.code)))
            .finish()
    }
}

#[serde_as]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Clone, Debug)]
#[repr(u8)]
pub enum GlobalContractDeployMode {
    /// Contract is deployed under its code hash.
    /// Users will be able reference it by that hash.
    /// This effectively makes the contract immutable.
    CodeHash,
    /// Contract is deployed under the owner account id.
    /// Users will be able reference it by that account id.
    /// This allows the owner to update the contract for all its users.
    AccountId,
}

/// Deploy global contract action
#[serde_as]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct DeployGlobalContractAction {
    /// WebAssembly binary
    #[serde_as(as = "Base64")]
    pub code: Arc<[u8]>,

    pub deploy_mode: GlobalContractDeployMode,
}

impl fmt::Debug for DeployGlobalContractAction {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("DeployGlobalContractAction")
            .field("code", &format_args!("{}", base64(&self.code)))
            .field("deploy_mode", &format_args!("{:?}", &self.deploy_mode))
            .finish()
    }
}

#[serde_as]
#[derive(
    BorshSerialize, BorshDeserialize, Serialize, Deserialize, Hash, PartialEq, Eq, Clone, Debug,
)]
pub enum GlobalContractIdentifier {
    CodeHash(CryptoHash),
    AccountId(AccountId),
}

impl From<GlobalContractCodeIdentifier> for GlobalContractIdentifier {
    fn from(identifier: GlobalContractCodeIdentifier) -> Self {
        match identifier {
            GlobalContractCodeIdentifier::CodeHash(hash) => {
                GlobalContractIdentifier::CodeHash(hash)
            }
            GlobalContractCodeIdentifier::AccountId(account_id) => {
                GlobalContractIdentifier::AccountId(account_id)
            }
        }
    }
}

impl GlobalContractIdentifier {
    pub fn len(&self) -> usize {
        match self {
            GlobalContractIdentifier::CodeHash(_) => 32,
            GlobalContractIdentifier::AccountId(account_id) => account_id.len(),
        }
    }
}

/// Use global contract action
#[serde_as]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Clone, Debug)]
pub struct UseGlobalContractAction {
    pub contract_identifier: GlobalContractIdentifier,
}

#[serde_as]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Clone)]
pub struct FunctionCallAction {
    pub method_name: String,
    #[serde_as(as = "Base64")]
    pub args: Vec<u8>,
    pub gas: Gas,
    pub deposit: NearToken,
}

impl fmt::Debug for FunctionCallAction {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("FunctionCallAction")
            .field("method_name", &format_args!("{}", &self.method_name))
            .field("args", &format_args!("{}", base64(&self.args)))
            .field("gas", &format_args!("{}", &self.gas))
            .field("deposit", &format_args!("{}", &self.deposit))
            .finish()
    }
}

/// An action which stakes signer_id tokens and setup's validator public key
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Clone, Debug, Serialize, Deserialize)]
pub struct StakeAction {
    /// Amount of tokens to stake.
    pub stake: NearToken,
    /// Validator key which will be used to sign transactions on behalf of signer_id
    pub public_key: PublicKey,
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Clone, Debug, Serialize, Deserialize)]
pub struct TransferAction {
    pub deposit: NearToken,
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Debug, Clone, Serialize, Deserialize)]
pub enum Action {
    /// Create an (sub)account using a transaction `receiver_id` as an ID for
    /// a new account ID must pass validation rules described here
    /// <http://nomicon.io/Primitives/Account.html>.
    CreateAccount(CreateAccountAction),
    /// Sets a Wasm code to a receiver_id
    DeployContract(DeployContractAction),
    FunctionCall(Box<FunctionCallAction>),
    Transfer(TransferAction),
    Stake(Box<StakeAction>),
    AddKey(Box<AddKeyAction>),
    DeleteKey(Box<DeleteKeyAction>),
    DeleteAccount(DeleteAccountAction),
    Delegate(Box<SignedDelegateAction>),
    DeployGlobalContract(DeployGlobalContractAction),
    UseGlobalContract(Box<UseGlobalContractAction>),
}

const _: () = assert!(
    // 1 word for tag plus the largest variant `DeployContractAction` which is a 3-word `Vec`.
    // The `<=` check covers platforms that have pointers smaller than 8 bytes as well as random
    // freak night lies that somehow find a way to pack everything into one less word.
    std::mem::size_of::<Action>() <= 32,
    "Action <= 32 bytes for performance reasons, see #9451"
);

impl Action {
    pub fn get_prepaid_gas(&self) -> Gas {
        match self {
            Action::FunctionCall(a) => a.gas,
            _ => 0,
        }
    }
    pub fn get_deposit_balance(&self) -> NearToken {
        match self {
            Action::FunctionCall(a) => a.deposit,
            Action::Transfer(a) => a.deposit,
            _ => NearToken::from_yoctonear(0),
        }
    }
}

impl From<CreateAccountAction> for Action {
    fn from(create_account_action: CreateAccountAction) -> Self {
        Self::CreateAccount(create_account_action)
    }
}

impl From<DeployContractAction> for Action {
    fn from(deploy_contract_action: DeployContractAction) -> Self {
        Self::DeployContract(deploy_contract_action)
    }
}

impl From<DeployGlobalContractAction> for Action {
    fn from(deploy_global_contract_action: DeployGlobalContractAction) -> Self {
        Self::DeployGlobalContract(deploy_global_contract_action)
    }
}

impl From<FunctionCallAction> for Action {
    fn from(function_call_action: FunctionCallAction) -> Self {
        Self::FunctionCall(Box::new(function_call_action))
    }
}

impl From<TransferAction> for Action {
    fn from(transfer_action: TransferAction) -> Self {
        Self::Transfer(transfer_action)
    }
}

impl From<StakeAction> for Action {
    fn from(stake_action: StakeAction) -> Self {
        Self::Stake(Box::new(stake_action))
    }
}

impl From<AddKeyAction> for Action {
    fn from(add_key_action: AddKeyAction) -> Self {
        Self::AddKey(Box::new(add_key_action))
    }
}

impl From<DeleteKeyAction> for Action {
    fn from(delete_key_action: DeleteKeyAction) -> Self {
        Self::DeleteKey(Box::new(delete_key_action))
    }
}

impl From<DeleteAccountAction> for Action {
    fn from(delete_account_action: DeleteAccountAction) -> Self {
        Self::DeleteAccount(delete_account_action)
    }
}

/// This is an index number of Action::Delegate in Action enumeration
const ACTION_DELEGATE_NUMBER: u8 = 8;
/// This action allows to execute the inner actions behalf of the defined sender.
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Clone, Debug)]
pub struct DelegateAction {
    /// Signer of the delegated actions
    pub sender_id: AccountId,
    /// Receiver of the delegated actions.
    pub receiver_id: AccountId,
    /// List of actions to be executed.
    ///
    /// With the meta transactions MVP defined in NEP-366, nested
    /// DelegateActions are not allowed. A separate type is used to enforce it.
    pub actions: Vec<NonDelegateAction>,
    /// Nonce to ensure that the same delegate action is not sent twice by a
    /// relayer and should match for given account's `public_key`.
    /// After this action is processed it will increment.
    pub nonce: Nonce,
    /// The maximal height of the block in the blockchain below which the given DelegateAction is valid.
    pub max_block_height: BlockHeight,
    /// Public key used to sign this delegated action.
    pub public_key: PublicKey,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Eq, Clone, Debug)]
pub struct SignedDelegateAction {
    pub delegate_action: DelegateAction,
    pub signature: Signature,
}

impl SignedDelegateAction {
    pub fn verify(&self) -> bool {
        let delegate_action = &self.delegate_action;
        let hash = delegate_action.get_nep461_hash();
        let public_key = &delegate_action.public_key;

        self.signature.verify(hash.as_ref(), public_key)
    }
}

impl From<SignedDelegateAction> for Action {
    fn from(delegate_action: SignedDelegateAction) -> Self {
        Self::Delegate(Box::new(delegate_action))
    }
}

impl DelegateAction {
    pub fn get_actions(&self) -> Vec<Action> {
        self.actions.iter().map(|a| a.clone().into()).collect()
    }

    /// Delegate action hash used for NEP-461 signature scheme which tags
    /// different messages before hashing
    ///
    /// For more details, see: [NEP-461](https://github.com/near/NEPs/pull/461)
    pub fn get_nep461_hash(&self) -> CryptoHash {
        let signable = SignableMessage::new(&self, SignableMessageType::DelegateAction);
        let bytes = borsh::to_vec(&signable).expect("Failed to deserialize");
        hash(&bytes)
    }
}

/// This is Action which mustn't contain DelegateAction.
///
/// This struct is needed to avoid the recursion when Action/DelegateAction is deserialized.
///
/// Important: Don't make the inner Action public, this must only be constructed
/// through the correct interface that ensures the inner Action is actually not
/// a delegate action. That would break an assumption of this type, which we use
/// in several places. For example, borsh de-/serialization relies on it. If the
/// invariant is broken, we may end up with a `Transaction` or `Receipt` that we
/// can serialize but deserializing it back causes a parsing error.
#[derive(Serialize, BorshSerialize, Deserialize, PartialEq, Eq, Clone, Debug)]
pub struct NonDelegateAction(Action);

/// A small private module to protect the private fields inside `NonDelegateAction`.
mod private_non_delegate_action {
    use std::io::{ErrorKind, Read};

    use super::*;

    impl From<NonDelegateAction> for Action {
        fn from(action: NonDelegateAction) -> Self {
            action.0
        }
    }

    #[derive(Debug, thiserror::Error)]
    #[error("attempted to construct NonDelegateAction from Action::Delegate")]
    pub struct IsDelegateAction;

    impl TryFrom<Action> for NonDelegateAction {
        type Error = IsDelegateAction;

        fn try_from(action: Action) -> Result<Self, IsDelegateAction> {
            if matches!(action, Action::Delegate(_)) {
                Err(IsDelegateAction)
            } else {
                Ok(Self(action))
            }
        }
    }

    impl borsh::de::BorshDeserialize for NonDelegateAction {
        fn deserialize_reader<R: Read>(rd: &mut R) -> Result<Self, std::io::Error> {
            match u8::deserialize_reader(rd)? {
                ACTION_DELEGATE_NUMBER => Err(std::io::Error::new(
                    ErrorKind::InvalidInput,
                    "DelegateAction mustn't contain a nested one",
                )),
                n => borsh::de::EnumExt::deserialize_variant(rd, n).map(Self),
            }
        }
    }
}

const MIN_ON_CHAIN_DISCRIMINANT: u32 = 1 << 30;
const MAX_ON_CHAIN_DISCRIMINANT: u32 = (1 << 31) - 1;
const MIN_OFF_CHAIN_DISCRIMINANT: u32 = 1 << 31;
const MAX_OFF_CHAIN_DISCRIMINANT: u32 = u32::MAX;

pub const NEP_413_SIGN_MESSAGE: u32 = 413;
pub const NEP_366_META_TRANSACTIONS: u32 = 366;

/// Used to distinguish message types that are sign by account keys, to avoid an
/// abuse of signed messages as something else.
///
/// This prefix must be at the first four bytes of a message body that is
/// signed under this signature scheme.
///
/// The scheme is a draft introduced to avoid security issues with the
/// implementation of meta transactions (NEP-366) but will eventually be
/// standardized with NEP-461 that solves the problem more generally.
#[derive(
    Debug,
    Clone,
    Copy,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
    Hash,
    BorshSerialize,
    BorshDeserialize,
    Serialize,
    Deserialize,
)]
pub struct MessageDiscriminant {
    /// The unique prefix, serialized in little-endian by borsh.
    discriminant: u32,
}

/// A wrapper around a message that should be signed using this scheme.
///
/// Only used for constructing a signature, not used to transmit messages. The
/// discriminant prefix is implicit and should be known by the receiver based on
/// the context in which the message is received.
#[derive(BorshSerialize)]
pub struct SignableMessage<'a, T> {
    pub discriminant: MessageDiscriminant,
    pub msg: &'a T,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[non_exhaustive]
pub enum SignableMessageType {
    /// A delegate action, intended for a relayer to included it in an action list of a transaction.
    DelegateAction,
}

#[derive(thiserror::Error, Debug)]
#[non_exhaustive]
pub enum ReadDiscriminantError {
    #[error("does not fit any known categories")]
    UnknownMessageType,
    #[error("NEP {0} does not have a known on-chain use")]
    UnknownOnChainNep(u32),
    #[error("NEP {0} does not have a known off-chain use")]
    UnknownOffChainNep(u32),
    #[error("discriminant is in the range for transactions")]
    TransactionFound,
}

#[derive(thiserror::Error, Debug)]
#[non_exhaustive]
pub enum CreateDiscriminantError {
    #[error("nep number {0} is too big")]
    NepTooLarge(u32),
}

impl<'a, T: BorshSerialize> SignableMessage<'a, T> {
    pub fn new(msg: &'a T, ty: SignableMessageType) -> Self {
        let discriminant = ty.into();
        Self { discriminant, msg }
    }

    pub fn sign(&self, signer: &Signer) -> Signature {
        let bytes = borsh::to_vec(&self).expect("Failed to deserialize");
        let hash = hash(&bytes);
        signer.sign(hash.as_bytes())
    }
}

impl MessageDiscriminant {
    /// Create a discriminant for an on-chain actionable message that was introduced in the specified NEP.
    ///
    /// Allows creating discriminants currently unknown in this crate, which can
    /// be useful to prototype new standards. For example, when the client
    /// project still relies on an older version of this crate while nightly
    /// nearcore already supports a new NEP.
    pub fn new_on_chain(nep: u32) -> Result<Self, CreateDiscriminantError> {
        // unchecked arithmetic: these are constants
        if nep > MAX_ON_CHAIN_DISCRIMINANT - MIN_ON_CHAIN_DISCRIMINANT {
            Err(CreateDiscriminantError::NepTooLarge(nep))
        } else {
            Ok(Self {
                // unchecked arithmetic: just checked range
                discriminant: MIN_ON_CHAIN_DISCRIMINANT + nep,
            })
        }
    }

    /// Create a discriminant for an off-chain message that was introduced in the specified NEP.
    ///
    /// Allows creating discriminants currently unknown in this crate, which can
    /// be useful to prototype new standards. For example, when the client
    /// project still relies on an older version of this crate while nightly
    /// nearcore already supports a new NEP.
    pub fn new_off_chain(nep: u32) -> Result<Self, CreateDiscriminantError> {
        // unchecked arithmetic: these are constants
        if nep > MAX_OFF_CHAIN_DISCRIMINANT - MIN_OFF_CHAIN_DISCRIMINANT {
            Err(CreateDiscriminantError::NepTooLarge(nep))
        } else {
            Ok(Self {
                // unchecked arithmetic: just checked range
                discriminant: MIN_OFF_CHAIN_DISCRIMINANT + nep,
            })
        }
    }

    /// Returns the raw integer value of the discriminant as an integer value.
    pub fn raw_discriminant(&self) -> u32 {
        self.discriminant
    }

    /// Whether this discriminant marks a traditional `SignedTransaction`.
    pub fn is_transaction(&self) -> bool {
        // Backwards compatibility with transaction that were defined before this standard:
        // Transaction begins with `AccountId`, which is just a `String` in
        // borsh serialization, which starts with the length of the underlying
        // byte vector in little endian u32.
        // Currently allowed AccountIds are between 2 and 64 bytes.
        self.discriminant >= AccountId::MIN_LEN as u32
            && self.discriminant <= AccountId::MAX_LEN as u32
    }

    /// If this discriminant marks a message intended for on-chain use, return
    /// the NEP in which the message type was introduced.
    pub fn on_chain_nep(&self) -> Option<u32> {
        if self.discriminant < MIN_ON_CHAIN_DISCRIMINANT
            || self.discriminant > MAX_ON_CHAIN_DISCRIMINANT
        {
            None
        } else {
            // unchecked arithmetic: just checked it is in range
            let nep = self.discriminant - MIN_ON_CHAIN_DISCRIMINANT;
            Some(nep)
        }
    }

    /// If this discriminant marks a message intended for off-chain use, return
    /// the NEP in which the message type was introduced.
    ///
    /// clippy: MAX_OFF_CHAIN_DISCRIMINANT currently is u32::MAX which makes the
    /// comparison pointless, however I think it helps code readability to have
    /// it spelled out anyway
    #[allow(clippy::absurd_extreme_comparisons)]
    pub fn off_chain_nep(&self) -> Option<u32> {
        if self.discriminant < MIN_OFF_CHAIN_DISCRIMINANT
            || self.discriminant > MAX_OFF_CHAIN_DISCRIMINANT
        {
            None
        } else {
            // unchecked arithmetic: just checked it is in range
            let nep = self.discriminant - MIN_OFF_CHAIN_DISCRIMINANT;
            Some(nep)
        }
    }
}

impl TryFrom<MessageDiscriminant> for SignableMessageType {
    type Error = ReadDiscriminantError;

    fn try_from(discriminant: MessageDiscriminant) -> Result<Self, Self::Error> {
        if discriminant.is_transaction() {
            Err(Self::Error::TransactionFound)
        } else if let Some(nep) = discriminant.on_chain_nep() {
            match nep {
                NEP_366_META_TRANSACTIONS => Ok(Self::DelegateAction),
                _ => Err(Self::Error::UnknownOnChainNep(nep)),
            }
        } else if let Some(nep) = discriminant.off_chain_nep() {
            Err(Self::Error::UnknownOffChainNep(nep))
        } else {
            Err(Self::Error::UnknownMessageType)
        }
    }
}

impl From<SignableMessageType> for MessageDiscriminant {
    fn from(ty: SignableMessageType) -> Self {
        // unwrapping here is ok, we know the constant NEP numbers used are in range
        match ty {
            SignableMessageType::DelegateAction => {
                MessageDiscriminant::new_on_chain(NEP_366_META_TRANSACTIONS).unwrap()
            }
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
pub struct MerklePathItem {
    pub hash: MerkleHash,
    pub direction: Direction,
}

pub type MerklePath = Vec<MerklePathItem>;

#[derive(Debug, Clone, PartialEq, Eq, BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
pub enum Direction {
    Left,
    Right,
}

pub fn combine_hash(hash1: &MerkleHash, hash2: &MerkleHash) -> MerkleHash {
    CryptoHash::hash_borsh((hash1, hash2))
}

/// Merklize an array of items. If the array is empty, returns hash of 0
pub fn merklize<T: BorshSerialize>(arr: &[T]) -> (MerkleHash, Vec<MerklePath>) {
    if arr.is_empty() {
        return (MerkleHash::default(), vec![]);
    }
    let mut len = arr.len().next_power_of_two();
    let mut hashes = arr.iter().map(CryptoHash::hash_borsh).collect::<Vec<_>>();

    // degenerate case
    if len == 1 {
        return (hashes[0], vec![vec![]]);
    }
    let mut arr_len = arr.len();
    let mut paths: Vec<MerklePath> = (0..arr_len)
        .map(|i| {
            if i % 2 == 0 {
                if i + 1 < arr_len {
                    vec![MerklePathItem {
                        hash: hashes[(i + 1) as usize],
                        direction: Direction::Right,
                    }]
                } else {
                    vec![]
                }
            } else {
                vec![MerklePathItem {
                    hash: hashes[(i - 1) as usize],
                    direction: Direction::Left,
                }]
            }
        })
        .collect();

    let mut counter = 1;
    while len > 1 {
        len /= 2;
        counter *= 2;
        for i in 0..len {
            let hash = if 2 * i >= arr_len {
                continue;
            } else if 2 * i + 1 >= arr_len {
                hashes[2 * i]
            } else {
                combine_hash(&hashes[2 * i], &hashes[2 * i + 1])
            };
            hashes[i] = hash;
            if len > 1 {
                if i % 2 == 0 {
                    for j in 0..counter {
                        let index = ((i + 1) * counter + j) as usize;
                        if index < arr.len() {
                            paths[index].push(MerklePathItem {
                                hash,
                                direction: Direction::Left,
                            });
                        }
                    }
                } else {
                    for j in 0..counter {
                        let index = ((i - 1) * counter + j) as usize;
                        if index < arr.len() {
                            paths[index].push(MerklePathItem {
                                hash,
                                direction: Direction::Right,
                            });
                        }
                    }
                }
            }
        }
        arr_len = (arr_len + 1) / 2;
    }
    (hashes[0], paths)
}

/// Verify merkle path for given item and corresponding path.
pub fn verify_path<T: BorshSerialize>(root: MerkleHash, path: &MerklePath, item: T) -> bool {
    verify_hash(root, path, CryptoHash::hash_borsh(item))
}

pub fn verify_hash(root: MerkleHash, path: &MerklePath, item_hash: MerkleHash) -> bool {
    compute_root_from_path(path, item_hash) == root
}

pub fn compute_root_from_path(path: &MerklePath, item_hash: MerkleHash) -> MerkleHash {
    let mut res = item_hash;
    for item in path {
        match item.direction {
            Direction::Left => {
                res = combine_hash(&item.hash, &res);
            }
            Direction::Right => {
                res = combine_hash(&res, &item.hash);
            }
        }
    }
    res
}

pub fn compute_root_from_path_and_item<T: BorshSerialize>(
    path: &MerklePath,
    item: T,
) -> MerkleHash {
    compute_root_from_path(path, CryptoHash::hash_borsh(item))
}

/// Merkle tree that only maintains the path for the next leaf, i.e,
/// when a new leaf is inserted, the existing `path` is its proof.
/// The root can be computed by folding `path` from right but is not explicitly
/// maintained to save space.
/// The size of the object is O(log(n)) where n is the number of leaves in the tree, i.e, `size`.
#[derive(Default, Clone, BorshSerialize, BorshDeserialize, Eq, PartialEq, Debug, Serialize)]
pub struct PartialMerkleTree {
    /// Path for the next leaf.
    path: Vec<MerkleHash>,
    /// Number of leaves in the tree.
    size: u64,
}

impl PartialMerkleTree {
    /// A PartialMerkleTree is well formed iff the path would be a valid proof for the next block
    /// of ordinal `size`. This means that the path contains exactly `size.count_ones()` elements.
    ///
    /// The <= direction of this statement is easy to prove, as the subtrees whose roots are being
    /// combined to form the overall root correspond to the binary 1s in the size.
    ///
    /// The => direction is proven by observing that the root is computed as
    /// hash(path[0], hash(path[1], hash(path[2], ... hash(path[n-1], path[n]) ...))
    /// and there is only one way to provide an array of paths of the exact same size that would
    /// produce the same result when combined in this way. (This would not have been true if we
    /// could provide a path of a different size, e.g. if we could provide just one hash, we could
    /// provide only the root).
    pub fn is_well_formed(&self) -> bool {
        self.path.len() == self.size.count_ones() as usize
    }

    pub fn root(&self) -> MerkleHash {
        if self.path.is_empty() {
            CryptoHash::default()
        } else {
            let mut res = *self.path.last().unwrap();
            let len = self.path.len();
            for i in (0..len - 1).rev() {
                res = combine_hash(&self.path[i], &res);
            }
            res
        }
    }

    pub fn insert(&mut self, elem: MerkleHash) {
        let mut s = self.size;
        let mut node = elem;
        while s % 2 == 1 {
            let last_path_elem = self.path.pop().unwrap();
            node = combine_hash(&last_path_elem, &node);
            s /= 2;
        }
        self.path.push(node);
        self.size += 1;
    }

    pub fn size(&self) -> u64 {
        self.size
    }

    pub fn get_path(&self) -> &[MerkleHash] {
        &self.path
    }

    /// Iterate over the path from the bottom to the top, calling `f` with the hash and the level.
    /// The level is 0 for the leaf and increases by 1 for each level in the actual tree.
    pub fn iter_path_from_bottom(&self, mut f: impl FnMut(MerkleHash, u64)) {
        let mut level = 0;
        let mut index = self.size;
        for node in self.path.iter().rev() {
            if index == 0 {
                // shouldn't happen
                return;
            }
            let trailing_zeros = index.trailing_zeros();
            level += trailing_zeros;
            index >>= trailing_zeros;
            index -= 1;
            f(*node, level as u64);
        }
    }
}

/// A view of the account
#[derive(Serialize, Deserialize, Debug, Eq, PartialEq, Clone)]
pub struct AccountView {
    pub amount: NearToken,
    pub locked: NearToken,
    pub code_hash: CryptoHash,
    pub storage_usage: StorageUsage,
    #[serde(default)]
    pub storage_paid_at: BlockHeight,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub global_contract_hash: Option<CryptoHash>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub global_contract_account_id: Option<AccountId>,
}

/// A view of the contract code.
#[serde_as]
#[derive(Serialize, Deserialize, PartialEq, Eq, Debug, Clone)]
pub struct ContractCodeView {
    #[serde(rename = "code_base64")]
    #[serde_as(as = "Base64")]
    pub code: Vec<u8>,
    pub hash: CryptoHash,
}

impl From<&Account> for AccountView {
    fn from(account: &Account) -> Self {
        let (global_contract_hash, global_contract_account_id) =
            match account.contract().into_owned() {
                AccountContract::Global(contract) => (Some(contract), None),
                AccountContract::GlobalByAccount(account_id) => (None, Some(account_id)),
                AccountContract::Local(_) | AccountContract::None => (None, None),
            };
        AccountView {
            amount: account.amount(),
            locked: account.locked(),
            code_hash: account.local_contract_hash().unwrap_or_default(),
            storage_usage: account.storage_usage(),
            storage_paid_at: 0,
            global_contract_hash,
            global_contract_account_id,
        }
    }
}

impl From<Account> for AccountView {
    fn from(account: Account) -> Self {
        (&account).into()
    }
}

impl From<&AccountView> for Account {
    fn from(view: &AccountView) -> Self {
        let contract = match &view.global_contract_account_id {
            Some(account_id) => AccountContract::GlobalByAccount(account_id.clone()),
            None => match view.global_contract_hash {
                Some(hash) => AccountContract::Global(hash),
                None => AccountContract::from_local_code_hash(view.code_hash),
            },
        };
        Account::new(view.amount, view.locked, contract, view.storage_usage)
    }
}

impl From<AccountView> for Account {
    fn from(view: AccountView) -> Self {
        (&view).into()
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Eq, PartialEq, Clone, Serialize, Deserialize)]
pub enum AccessKeyPermissionView {
    FunctionCall {
        allowance: Option<NearToken>,
        receiver_id: String,
        method_names: Vec<String>,
    },
    FullAccess,
}

impl From<AccessKeyPermission> for AccessKeyPermissionView {
    fn from(permission: AccessKeyPermission) -> Self {
        match permission {
            AccessKeyPermission::FunctionCall(func_call) => AccessKeyPermissionView::FunctionCall {
                allowance: func_call.allowance,
                receiver_id: func_call.receiver_id,
                method_names: func_call.method_names,
            },
            AccessKeyPermission::FullAccess => AccessKeyPermissionView::FullAccess,
        }
    }
}

impl From<AccessKeyPermissionView> for AccessKeyPermission {
    fn from(view: AccessKeyPermissionView) -> Self {
        match view {
            AccessKeyPermissionView::FunctionCall {
                allowance,
                receiver_id,
                method_names,
            } => AccessKeyPermission::FunctionCall(FunctionCallPermission {
                allowance,
                receiver_id,
                method_names,
            }),
            AccessKeyPermissionView::FullAccess => AccessKeyPermission::FullAccess,
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Eq, PartialEq, Clone, Serialize, Deserialize)]
pub struct AccessKeyView {
    pub nonce: Nonce,
    pub permission: AccessKeyPermissionView,
}

impl From<AccessKey> for AccessKeyView {
    fn from(access_key: AccessKey) -> Self {
        Self {
            nonce: access_key.nonce,
            permission: access_key.permission.into(),
        }
    }
}

impl From<AccessKeyView> for AccessKey {
    fn from(view: AccessKeyView) -> Self {
        Self {
            nonce: view.nonce,
            permission: view.permission.into(),
        }
    }
}

/// Item of the state, key and value are serialized in base64 and proof for inclusion of given state item.
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
pub struct StateItem {
    pub key: StoreKey,
    pub value: StoreValue,
}

#[serde_as]
#[derive(Debug, Deserialize, Clone, PartialEq)]
pub struct ViewStateResult {
    pub values: Vec<StateItem>,
    #[serde_as(as = "Vec<Base64>")]
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub proof: Vec<Arc<[u8]>>,
}

#[derive(Debug, Deserialize, Clone, PartialEq)]
pub struct CallResult {
    #[serde(flatten)]
    pub result_or_error: ResultOrError<Vec<u8>, String>,
    pub logs: Vec<String>,
}

#[derive(Debug, Deserialize, Clone, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ResultOrError<A, B> {
    Result(A),
    Error(B),
}

impl<A, B> From<ResultOrError<A, B>> for Result<A, B> {
    fn from(result_or_error: ResultOrError<A, B>) -> Self {
        match result_or_error {
            ResultOrError::Result(result) => Ok(result),
            ResultOrError::Error(error) => Err(error),
        }
    }
}

impl<A, B> From<Result<A, B>> for ResultOrError<A, B> {
    fn from(result: Result<A, B>) -> Self {
        match result {
            Ok(result) => ResultOrError::Result(result),
            Err(error) => ResultOrError::Error(error),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
pub struct QueryError {
    pub error: String,
    pub logs: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
pub struct AccessKeyInfoView {
    pub public_key: PublicKey,
    pub access_key: AccessKeyView,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
pub struct AccessKeyList {
    pub keys: Vec<AccessKeyInfoView>,
}

impl FromIterator<AccessKeyInfoView> for AccessKeyList {
    fn from_iter<I: IntoIterator<Item = AccessKeyInfoView>>(iter: I) -> Self {
        Self {
            keys: iter.into_iter().collect(),
        }
    }
}

#[derive(Debug, Deserialize, Clone, PartialEq)]
#[serde(untagged)]
pub enum QueryResponseKind {
    ViewAccount(AccountView),
    ViewCode(ContractCodeView),
    ViewState(ViewStateResult),
    CallResult(CallResult),
    AccessKey(AccessKeyView),
    AccessKeyList(AccessKeyList),
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
#[serde(tag = "request_type", rename_all = "snake_case")]
pub enum QueryRequest {
    ViewAccount {
        account_id: AccountId,
    },
    ViewCode {
        account_id: AccountId,
    },
    ViewState {
        account_id: AccountId,
        #[serde(rename = "prefix_base64")]
        prefix: StoreKey,
        #[serde(default, skip_serializing_if = "is_false")]
        include_proof: bool,
    },
    ViewAccessKey {
        account_id: AccountId,
        public_key: PublicKey,
    },
    ViewAccessKeyList {
        account_id: AccountId,
    },
    CallFunction {
        account_id: AccountId,
        method_name: String,
        #[serde(rename = "args_base64")]
        args: FunctionArgs,
    },
}

fn is_false(v: &bool) -> bool {
    !*v
}

#[derive(Debug, PartialEq, Clone, Deserialize)]
pub struct QueryResponse {
    #[serde(flatten)]
    pub kind: QueryResponseKind,
    pub block_height: BlockHeight,
    pub block_hash: CryptoHash,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct StatusSyncInfo {
    pub latest_block_hash: CryptoHash,
    pub latest_block_height: BlockHeight,
    pub latest_state_root: CryptoHash,
    pub latest_block_time: DateTime<Utc>,
    pub syncing: bool,
    pub earliest_block_hash: Option<CryptoHash>,
    pub earliest_block_height: Option<BlockHeight>,
    pub earliest_block_time: Option<DateTime<Utc>>,
    pub epoch_id: Option<EpochId>,
    pub epoch_start_height: Option<BlockHeight>,
}

// TODO: add more information to ValidatorInfo
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
pub struct ValidatorInfo {
    pub account_id: AccountId,
    pub is_slashed: bool,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct PeerInfoView {
    pub addr: String,
    pub account_id: Option<AccountId>,
    pub height: Option<BlockHeight>,
    pub block_hash: Option<CryptoHash>,
    pub is_highest_block_invalid: bool,
    pub tracked_shards: Vec<ShardId>,
    pub archival: bool,
    pub peer_id: PublicKey,
    pub received_bytes_per_sec: u64,
    pub sent_bytes_per_sec: u64,
    pub last_time_peer_requested_millis: u64,
    pub last_time_received_message_millis: u64,
    pub connection_established_time_millis: u64,
    pub is_outbound_peer: bool,
    /// Connection nonce.
    pub nonce: u64,
}

/// Information about a Producer: its account name, peer_id and a list of connected peers that
/// the node can use to send message for this producer.
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct KnownProducerView {
    pub account_id: AccountId,
    pub peer_id: PublicKey,
    pub next_hops: Option<Vec<PublicKey>>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct Tier1ProxyView {
    pub addr: std::net::SocketAddr,
    pub peer_id: PublicKey,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct AccountDataView {
    pub peer_id: PublicKey,
    pub proxies: Vec<Tier1ProxyView>,
    pub account_key: PublicKey,
    pub timestamp: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct NetworkInfoView {
    pub peer_max_count: u32,
    pub num_connected_peers: usize,
    pub connected_peers: Vec<PeerInfoView>,
    pub known_producers: Vec<KnownProducerView>,
    pub tier1_accounts_keys: Vec<PublicKey>,
    pub tier1_accounts_data: Vec<AccountDataView>,
    pub tier1_connections: Vec<PeerInfoView>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub enum SyncStatusView {
    /// Initial state. Not enough peers to do anything yet.
    AwaitingPeers,
    /// Not syncing / Done syncing.
    NoSync,
    /// Syncing using light-client headers to a recent epoch
    EpochSync {
        source_peer_height: BlockHeight,
        source_peer_id: String,
        attempt_time: String,
    },
    EpochSyncDone,
    /// Downloading block headers for fast sync.
    HeaderSync {
        start_height: BlockHeight,
        current_height: BlockHeight,
        highest_height: BlockHeight,
    },
    /// State sync, with different states of state sync for different shards.
    StateSync(StateSyncStatusView),
    /// Sync state across all shards is done.
    StateSyncDone,
    /// Download and process blocks until the head reaches the head of the network.
    BlockSync {
        start_height: BlockHeight,
        current_height: BlockHeight,
        highest_height: BlockHeight,
    },
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct StateSyncStatusView {
    pub sync_hash: CryptoHash,
    pub shard_sync_status: HashMap<ShardId, String>,
    pub download_tasks: Vec<String>,
    pub computation_tasks: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct ShardSyncDownloadView {
    pub downloads: Vec<DownloadStatusView>,
    pub status: String,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct DownloadStatusView {
    pub error: bool,
    pub done: bool,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct CatchupStatusView {
    // This is the first block of the epoch that we are catching up
    pub sync_block_hash: CryptoHash,
    pub sync_block_height: BlockHeight,
    // Status of all shards that need to sync
    pub shard_sync_status: HashMap<ShardId, String>,
    // Blocks that we need to catchup, if it is empty, it means catching up is done
    pub blocks_to_catchup: Vec<BlockStatusView>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct RequestedStatePartsView {
    // This is the first block of the epoch that was requested
    pub block_hash: CryptoHash,
    // All the part ids of the shards that were requested
    pub shard_requested_parts: HashMap<ShardId, Vec<PartElapsedTimeView>>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct BlockStatusView {
    pub height: BlockHeight,
    pub hash: CryptoHash,
}

impl BlockStatusView {
    pub fn new(height: &BlockHeight, hash: &CryptoHash) -> BlockStatusView {
        Self {
            height: *height,
            hash: *hash,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
pub struct PartElapsedTimeView {
    pub part_id: u64,
    pub elapsed_ms: u128,
}

impl PartElapsedTimeView {
    pub fn new(part_id: &u64, elapsed_ms: u128) -> PartElapsedTimeView {
        Self {
            part_id: *part_id,
            elapsed_ms,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BlockByChunksView {
    pub height: BlockHeight,
    pub hash: CryptoHash,
    pub block_status: String,
    pub chunk_status: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChainProcessingInfo {
    pub num_blocks_in_processing: usize,
    pub num_orphans: usize,
    pub num_blocks_missing_chunks: usize,
    /// contains processing info of recent blocks, ordered by height high to low
    pub blocks_info: Vec<BlockProcessingInfo>,
    /// contains processing info of chunks that we don't know which block it belongs to yet
    pub floating_chunks_info: Vec<ChunkProcessingInfo>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BlockProcessingInfo {
    pub height: BlockHeight,
    pub hash: CryptoHash,
    pub received_timestamp: DateTime<Utc>,
    /// Time (in ms) between when the block was first received and when it was processed
    pub in_progress_ms: u128,
    /// Time (in ms) that the block spent in the orphan pool. If the block was never put in the
    /// orphan pool, it is None. If the block is still in the orphan pool, it is since the time
    /// it was put into the pool until the current time.
    pub orphaned_ms: Option<u128>,
    /// Time (in ms) that the block spent in the missing chunks pool. If the block was never put in the
    /// missing chunks pool, it is None. If the block is still in the missing chunks pool, it is
    /// since the time it was put into the pool until the current time.
    pub missing_chunks_ms: Option<u128>,
    pub block_status: BlockProcessingStatus,
    /// Only contains new chunks that belong to this block, if the block doesn't produce a new chunk
    /// for a shard, the corresponding item will be None.
    pub chunks_info: Vec<Option<ChunkProcessingInfo>>,
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum BlockProcessingStatus {
    Orphan,
    WaitingForChunks,
    InProcessing,
    Accepted,
    Error(String),
    Dropped(DroppedReason),
    Unknown,
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum DroppedReason {
    // If the node has already processed a block at this height
    HeightProcessed,
    // If the block processing pool is full
    TooManyProcessingBlocks,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChunkProcessingInfo {
    pub height_created: BlockHeight,
    pub shard_id: ShardId,
    pub chunk_hash: ChunkHash,
    pub prev_block_hash: CryptoHash,
    /// Account id of the validator who created this chunk
    /// Theoretically this field should never be None unless there is some database corruption.
    pub created_by: Option<AccountId>,
    pub status: ChunkProcessingStatus,
    /// Timestamp of first time when we request for this chunk.
    pub requested_timestamp: Option<DateTime<Utc>>,
    /// Timestamp of when the chunk is complete
    pub completed_timestamp: Option<DateTime<Utc>>,
    /// Time (in millis) that it takes between when the chunk is requested and when it is completed.
    pub request_duration: Option<u64>,
    pub chunk_parts_collection: Vec<PartCollectionInfo>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PartCollectionInfo {
    pub part_owner: AccountId,
    // Time when the part is received through any message
    pub received_time: Option<DateTime<Utc>>,
    // Time when we receive a PartialEncodedChunkForward containing this part
    pub forwarded_received_time: Option<DateTime<Utc>>,
    // Time when we receive the PartialEncodedChunk message containing this part
    pub chunk_received_time: Option<DateTime<Utc>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum ChunkProcessingStatus {
    NeedToRequest,
    Requested,
    Completed,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct DetailedDebugStatus {
    pub network_info: NetworkInfoView,
    pub sync_status: String,
    pub catchup_status: Vec<CatchupStatusView>,
    pub current_head_status: BlockStatusView,
    pub current_header_head_status: BlockStatusView,
    pub block_production_delay_millis: u64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct StatusResponse {
    /// Binary version.
    pub version: Version,
    /// Unique chain id.
    pub chain_id: String,
    /// Currently active protocol version.
    pub protocol_version: u32,
    /// Latest protocol version that this client supports.
    pub latest_protocol_version: u32,
    /// Address for RPC server.  None if node doesn’t have RPC endpoint enabled.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rpc_addr: Option<String>,
    /// Current epoch validators.
    pub validators: Vec<ValidatorInfo>,
    /// Sync status of the node.
    pub sync_info: StatusSyncInfo,
    /// Validator id of the node
    pub validator_account_id: Option<AccountId>,
    /// Public key of the validator.
    pub validator_public_key: Option<PublicKey>,
    /// Public key of the node.
    pub node_public_key: PublicKey,
    /// Deprecated; same as `validator_public_key` which you should use instead.
    pub node_key: Option<PublicKey>,
    /// Uptime of the node.
    pub uptime_sec: i64,
    /// Genesis hash of the chain.
    pub genesis_hash: CryptoHash,
    /// Information about last blocks, network, epoch and chain & chunk info.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub detailed_debug_status: Option<DetailedDebugStatus>,
}

/// Data structure for semver version and github tag or commit.
#[derive(Serialize, Deserialize, Clone, Debug, Default)]
pub struct Version {
    pub version: String,
    pub build: String,
    pub commit: String,
    #[serde(default)]
    pub rustc_version: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BlockHeaderView {
    pub height: BlockHeight,
    pub prev_height: Option<BlockHeight>,
    pub epoch_id: CryptoHash,
    pub next_epoch_id: CryptoHash,
    pub hash: CryptoHash,
    pub prev_hash: CryptoHash,
    pub prev_state_root: CryptoHash,
    pub block_body_hash: Option<CryptoHash>,
    pub chunk_receipts_root: CryptoHash,
    pub chunk_headers_root: CryptoHash,
    pub chunk_tx_root: CryptoHash,
    pub outcome_root: CryptoHash,
    pub chunks_included: u64,
    pub challenges_root: CryptoHash,
    /// Legacy json number. Should not be used.
    pub timestamp: u64,
    #[serde(with = "dec_format")]
    pub timestamp_nanosec: u64,
    pub random_value: CryptoHash,
    pub validator_proposals: Vec<ValidatorStakeView>,
    pub chunk_mask: Vec<bool>,
    #[serde(with = "dec_format")]
    pub gas_price: Balance,
    pub block_ordinal: Option<NumBlocks>,
    /// TODO(2271): deprecated.
    #[serde(with = "dec_format")]
    pub rent_paid: Balance,
    /// TODO(2271): deprecated.
    #[serde(with = "dec_format")]
    pub validator_reward: Balance,
    #[serde(with = "dec_format")]
    pub total_supply: Balance,
    // pub challenges_result: ChallengesResult,
    pub last_final_block: CryptoHash,
    pub last_ds_final_block: CryptoHash,
    pub next_bp_hash: CryptoHash,
    pub block_merkle_root: CryptoHash,
    pub epoch_sync_data_hash: Option<CryptoHash>,
    pub approvals: Vec<Option<Box<Signature>>>,
    pub signature: Signature,
    pub latest_protocol_version: ProtocolVersion,
    pub chunk_endorsements: Option<Vec<Vec<u8>>>,
}

#[derive(PartialEq, Eq, Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct BlockHeaderInnerLiteView {
    pub height: BlockHeight,
    pub epoch_id: CryptoHash,
    pub next_epoch_id: CryptoHash,
    pub prev_state_root: CryptoHash,
    pub outcome_root: CryptoHash,
    /// Legacy json number. Should not be used.
    pub timestamp: u64,
    #[serde(with = "dec_format")]
    pub timestamp_nanosec: u64,
    pub next_bp_hash: CryptoHash,
    pub block_merkle_root: CryptoHash,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ChunkHeaderView {
    pub chunk_hash: CryptoHash,
    pub prev_block_hash: CryptoHash,
    pub outcome_root: CryptoHash,
    pub prev_state_root: StateRoot,
    pub encoded_merkle_root: CryptoHash,
    pub encoded_length: u64,
    pub height_created: BlockHeight,
    pub height_included: BlockHeight,
    pub shard_id: ShardId,
    pub gas_used: Gas,
    pub gas_limit: Gas,
    /// TODO(2271): deprecated.
    #[serde(with = "dec_format")]
    pub rent_paid: Balance,
    /// TODO(2271): deprecated.
    #[serde(with = "dec_format")]
    pub validator_reward: Balance,
    #[serde(with = "dec_format")]
    pub balance_burnt: Balance,
    pub outgoing_receipts_root: CryptoHash,
    pub tx_root: CryptoHash,
    pub validator_proposals: Vec<ValidatorStakeView>,
    pub congestion_info: Option<CongestionInfoView>,
    // pub bandwidth_requests: Option<BandwidthRequests>,
    pub signature: Signature,
}

impl ChunkHeaderView {
    pub fn is_new_chunk(&self, block_height: BlockHeight) -> bool {
        self.height_included == block_height
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BlockView {
    pub author: AccountId,
    pub header: BlockHeaderView,
    pub chunks: Vec<ChunkHeaderView>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChunkView {
    pub author: AccountId,
    pub header: ChunkHeaderView,
    pub transactions: Vec<SignedTransactionView>,
    pub receipts: Vec<ReceiptView>,
}

#[serde_as]
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum ActionView {
    CreateAccount,
    DeployContract {
        #[serde_as(as = "Base64")]
        code: Vec<u8>,
    },
    FunctionCall {
        method_name: String,
        args: FunctionArgs,
        gas: Gas,
        deposit: NearToken,
    },
    Transfer {
        deposit: NearToken,
    },
    Stake {
        stake: NearToken,
        public_key: PublicKey,
    },
    AddKey {
        public_key: PublicKey,
        access_key: AccessKeyView,
    },
    DeleteKey {
        public_key: PublicKey,
    },
    DeleteAccount {
        beneficiary_id: AccountId,
    },
    Delegate {
        delegate_action: DelegateAction,
        signature: Signature,
    },
    DeployGlobalContract {
        #[serde_as(as = "Base64")]
        code: Vec<u8>,
    },
    DeployGlobalContractByAccountId {
        #[serde_as(as = "Base64")]
        code: Vec<u8>,
    },
    UseGlobalContract {
        code_hash: CryptoHash,
    },
    UseGlobalContractByAccountId {
        account_id: AccountId,
    },
}

impl From<Action> for ActionView {
    fn from(action: Action) -> Self {
        match action {
            Action::CreateAccount(_) => ActionView::CreateAccount,
            Action::DeployContract(action) => {
                let code = hash(&action.code).as_ref().to_vec();
                ActionView::DeployContract { code }
            }
            Action::FunctionCall(action) => ActionView::FunctionCall {
                method_name: action.method_name,
                args: action.args.into(),
                gas: action.gas,
                deposit: action.deposit,
            },
            Action::Transfer(action) => ActionView::Transfer {
                deposit: action.deposit,
            },
            Action::Stake(action) => ActionView::Stake {
                stake: action.stake,
                public_key: action.public_key,
            },
            Action::AddKey(action) => ActionView::AddKey {
                public_key: action.public_key,
                access_key: action.access_key.into(),
            },
            Action::DeleteKey(action) => ActionView::DeleteKey {
                public_key: action.public_key,
            },
            Action::DeleteAccount(action) => ActionView::DeleteAccount {
                beneficiary_id: action.beneficiary_id,
            },
            Action::Delegate(action) => ActionView::Delegate {
                delegate_action: action.delegate_action,
                signature: action.signature,
            },
            Action::DeployGlobalContract(action) => {
                let code = hash(&action.code).as_ref().to_vec();
                match action.deploy_mode {
                    GlobalContractDeployMode::CodeHash => ActionView::DeployGlobalContract { code },
                    GlobalContractDeployMode::AccountId => {
                        ActionView::DeployGlobalContractByAccountId { code }
                    }
                }
            }
            Action::UseGlobalContract(action) => match action.contract_identifier {
                GlobalContractIdentifier::CodeHash(code_hash) => {
                    ActionView::UseGlobalContract { code_hash }
                }
                GlobalContractIdentifier::AccountId(account_id) => {
                    ActionView::UseGlobalContractByAccountId { account_id }
                }
            },
        }
    }
}

impl TryFrom<ActionView> for Action {
    type Error = Box<dyn std::error::Error + Send + Sync>;

    fn try_from(action_view: ActionView) -> Result<Self, Self::Error> {
        Ok(match action_view {
            ActionView::CreateAccount => Action::CreateAccount(CreateAccountAction {}),
            ActionView::DeployContract { code } => {
                Action::DeployContract(DeployContractAction { code })
            }
            ActionView::FunctionCall {
                method_name,
                args,
                gas,
                deposit,
            } => Action::FunctionCall(Box::new(FunctionCallAction {
                method_name,
                args: args.into(),
                gas,
                deposit,
            })),
            ActionView::Transfer { deposit } => Action::Transfer(TransferAction { deposit }),
            ActionView::Stake { stake, public_key } => {
                Action::Stake(Box::new(StakeAction { stake, public_key }))
            }
            ActionView::AddKey {
                public_key,
                access_key,
            } => Action::AddKey(Box::new(AddKeyAction {
                public_key,
                access_key: access_key.into(),
            })),
            ActionView::DeleteKey { public_key } => {
                Action::DeleteKey(Box::new(DeleteKeyAction { public_key }))
            }
            ActionView::DeleteAccount { beneficiary_id } => {
                Action::DeleteAccount(DeleteAccountAction { beneficiary_id })
            }
            ActionView::Delegate {
                delegate_action,
                signature,
            } => Action::Delegate(Box::new(SignedDelegateAction {
                delegate_action,
                signature,
            })),
            ActionView::DeployGlobalContract { code } => {
                Action::DeployGlobalContract(DeployGlobalContractAction {
                    code: code.into(),
                    deploy_mode: GlobalContractDeployMode::CodeHash,
                })
            }
            ActionView::DeployGlobalContractByAccountId { code } => {
                Action::DeployGlobalContract(DeployGlobalContractAction {
                    code: code.into(),
                    deploy_mode: GlobalContractDeployMode::AccountId,
                })
            }
            ActionView::UseGlobalContract { code_hash } => {
                Action::UseGlobalContract(Box::new(UseGlobalContractAction {
                    contract_identifier: GlobalContractIdentifier::CodeHash(code_hash),
                }))
            }
            ActionView::UseGlobalContractByAccountId { account_id } => {
                Action::UseGlobalContract(Box::new(UseGlobalContractAction {
                    contract_identifier: GlobalContractIdentifier::AccountId(account_id),
                }))
            }
        })
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq, Eq, Clone, Serialize, Deserialize)]
pub struct SignedTransactionView {
    pub signer_id: AccountId,
    pub public_key: PublicKey,
    pub nonce: Nonce,
    pub receiver_id: AccountId,
    pub actions: Vec<ActionView>,
    // Default value used when deserializing SignedTransactionView which are missing the `priority_fee` field.
    // Data which is missing this field was serialized before the introduction of priority_fee.
    // priority_fee for Transaction::V0 => None, SignedTransactionView => 0
    #[serde(default)]
    pub priority_fee: u64,
    pub signature: Signature,
    pub hash: CryptoHash,
}

impl From<SignedTransaction> for SignedTransactionView {
    fn from(signed_tx: SignedTransaction) -> Self {
        let hash = signed_tx.get_hash();
        let transaction = signed_tx.transaction;
        let priority_fee = transaction.priority_fee().unwrap_or_default();
        SignedTransactionView {
            signer_id: transaction.signer_id().clone(),
            public_key: transaction.public_key().clone(),
            nonce: transaction.nonce(),
            receiver_id: transaction.receiver_id().clone(),
            actions: transaction
                .take_actions()
                .into_iter()
                .map(|action| action.into())
                .collect(),
            signature: signed_tx.signature,
            hash,
            priority_fee,
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Eq, Debug, Clone)]
#[borsh(init=init)]
pub struct SignedTransaction {
    pub transaction: Transaction,
    pub signature: Signature,
    #[borsh(skip)]
    hash: CryptoHash,
    #[borsh(skip)]
    size: u64,
}

impl SignedTransaction {
    pub fn new(signature: Signature, transaction: Transaction) -> Self {
        let mut signed_tx = Self {
            signature,
            transaction,
            hash: CryptoHash::default(),
            size: u64::default(),
        };
        signed_tx.init();
        signed_tx
    }

    pub fn init(&mut self) {
        let (hash, size) = self.transaction.get_hash_and_size();
        self.hash = hash;
        self.size = size;
    }

    pub fn get_hash(&self) -> CryptoHash {
        self.hash
    }

    pub fn get_size(&self) -> u64 {
        self.size
    }
}

impl Hash for SignedTransaction {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.hash.hash(state)
    }
}

impl PartialEq for SignedTransaction {
    fn eq(&self, other: &SignedTransaction) -> bool {
        self.hash == other.hash && self.signature == other.signature
    }
}

impl Borrow<CryptoHash> for SignedTransaction {
    fn borrow(&self) -> &CryptoHash {
        &self.hash
    }
}

impl Serialize for SignedTransaction {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let signed_tx_borsh = borsh::to_vec(self).map_err(|err| {
            S::Error::custom(&format!(
                "the value could not be borsh encoded due to: {}",
                err
            ))
        })?;
        let signed_tx_base64 = BASE64_STANDARD.encode(&signed_tx_borsh);
        serializer.serialize_str(&signed_tx_base64)
    }
}

impl<'de> Deserialize<'de> for SignedTransaction {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let signed_tx_base64 = <String as Deserialize>::deserialize(deserializer)?;
        let signed_tx_borsh = from_base64(&signed_tx_base64).map_err(|err| {
            D::Error::custom(&format!(
                "the value could not decoded from base64 due to: {}",
                err
            ))
        })?;
        borsh::from_slice::<Self>(&signed_tx_borsh).map_err(|err| {
            D::Error::custom(&format!(
                "the value could not decoded from borsh due to: {}",
                err
            ))
        })
    }
}

pub type LogEntry = String;

#[derive(BorshSerialize, BorshDeserialize, Serialize, PartialEq, Eq, Debug, Clone)]
pub struct TransactionV0 {
    /// An account on which behalf transaction is signed
    pub signer_id: AccountId,
    /// A public key of the access key which was used to sign an account.
    /// Access key holds permissions for calling certain kinds of actions.
    pub public_key: PublicKey,
    /// Nonce is used to determine order of transaction in the pool.
    /// It increments for a combination of `signer_id` and `public_key`
    pub nonce: Nonce,
    /// Receiver account for this transaction
    pub receiver_id: AccountId,
    /// The hash of the block in the blockchain on top of which the given transaction is valid
    pub block_hash: CryptoHash,
    /// A list of actions to be applied
    pub actions: Vec<Action>,
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Eq, Debug, Clone)]
pub struct TransactionV1 {
    /// An account on which behalf transaction is signed
    pub signer_id: AccountId,
    /// A public key of the access key which was used to sign an account.
    /// Access key holds permissions for calling certain kinds of actions.
    pub public_key: PublicKey,
    /// Nonce is used to determine order of transaction in the pool.
    /// It increments for a combination of `signer_id` and `public_key`
    pub nonce: Nonce,
    /// Receiver account for this transaction
    pub receiver_id: AccountId,
    /// The hash of the block in the blockchain on top of which the given transaction is valid
    pub block_hash: CryptoHash,
    /// A list of actions to be applied
    pub actions: Vec<Action>,
    /// Priority fee. Unit is 10^12 yoctoNEAR
    pub priority_fee: u64,
}

impl Transaction {
    /// Computes a hash of the transaction for signing and size of serialized transaction
    pub fn get_hash_and_size(&self) -> (CryptoHash, u64) {
        let bytes = borsh::to_vec(&self).expect("Failed to deserialize");
        (hash(&bytes), bytes.len() as u64)
    }
}

#[derive(Eq, PartialEq, Debug, Clone)]
pub enum Transaction {
    V0(TransactionV0),
    V1(TransactionV1),
}

impl Transaction {
    pub fn signer_id(&self) -> &AccountId {
        match self {
            Transaction::V0(tx) => &tx.signer_id,
            Transaction::V1(tx) => &tx.signer_id,
        }
    }

    pub fn receiver_id(&self) -> &AccountId {
        match self {
            Transaction::V0(tx) => &tx.receiver_id,
            Transaction::V1(tx) => &tx.receiver_id,
        }
    }

    pub fn public_key(&self) -> &PublicKey {
        match self {
            Transaction::V0(tx) => &tx.public_key,
            Transaction::V1(tx) => &tx.public_key,
        }
    }

    pub fn nonce(&self) -> Nonce {
        match self {
            Transaction::V0(tx) => tx.nonce,
            Transaction::V1(tx) => tx.nonce,
        }
    }

    pub fn actions(&self) -> &[Action] {
        match self {
            Transaction::V0(tx) => &tx.actions,
            Transaction::V1(tx) => &tx.actions,
        }
    }

    pub fn take_actions(self) -> Vec<Action> {
        match self {
            Transaction::V0(tx) => tx.actions,
            Transaction::V1(tx) => tx.actions,
        }
    }

    pub fn block_hash(&self) -> &CryptoHash {
        match self {
            Transaction::V0(tx) => &tx.block_hash,
            Transaction::V1(tx) => &tx.block_hash,
        }
    }

    pub fn priority_fee(&self) -> Option<u64> {
        match self {
            Transaction::V0(_) => None,
            Transaction::V1(tx) => Some(tx.priority_fee),
        }
    }
}

impl BorshSerialize for Transaction {
    fn serialize<W: Write>(&self, writer: &mut W) -> Result<(), std::io::Error> {
        match self {
            Transaction::V0(tx) => BorshSerialize::serialize(&tx, writer)?,
            Transaction::V1(tx) => {
                BorshSerialize::serialize(&1_u8, writer)?;
                BorshSerialize::serialize(&tx, writer)?;
            }
        }
        Ok(())
    }
}

impl BorshDeserialize for Transaction {
    /// Deserialize based on the first and second bytes of the stream. For V0, we do backward compatible deserialization by deserializing
    /// the entire stream into V0. For V1, we consume the first byte and then deserialize the rest.
    fn deserialize_reader<R: Read>(reader: &mut R) -> std::io::Result<Self> {
        let u1 = u8::deserialize_reader(reader)?;
        let u2 = u8::deserialize_reader(reader)?;
        let u3 = u8::deserialize_reader(reader)?;
        let u4 = u8::deserialize_reader(reader)?;
        // This is a ridiculous hackery: because the first field in `TransactionV0` is an `AccountId`
        // and an account id is at most 64 bytes, for all valid `TransactionV0` the second byte must be 0
        // because of the little endian encoding of the length of the account id.
        // On the other hand, for `TransactionV1`, since the first byte is 1 and an account id must have nonzero
        // length, so the second byte must not be zero. Therefore, we can distinguish between the two versions
        // by looking at the second byte.

        let read_signer_id = |buf: [u8; 4], reader: &mut R| -> std::io::Result<AccountId> {
            let str_len = u32::from_le_bytes(buf);
            let mut str_vec = Vec::with_capacity(str_len as usize);
            for _ in 0..str_len {
                str_vec.push(u8::deserialize_reader(reader)?);
            }
            AccountId::try_from(String::from_utf8(str_vec).map_err(|_| {
                std::io::Error::new(
                    std::io::ErrorKind::InvalidData,
                    "Failed to parse AccountId from bytes",
                )
            })?)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e.to_string()))
        };

        if u2 == 0 {
            let signer_id = read_signer_id([u1, u2, u3, u4], reader)?;
            let public_key = PublicKey::deserialize_reader(reader)?;
            let nonce = Nonce::deserialize_reader(reader)?;
            let receiver_id = AccountId::deserialize_reader(reader)?;
            let block_hash = CryptoHash::deserialize_reader(reader)?;
            let actions = Vec::<Action>::deserialize_reader(reader)?;
            Ok(Transaction::V0(TransactionV0 {
                signer_id,
                public_key,
                nonce,
                receiver_id,
                block_hash,
                actions,
            }))
        } else {
            let u5 = u8::deserialize_reader(reader)?;
            let signer_id = read_signer_id([u2, u3, u4, u5], reader)?;
            let public_key = PublicKey::deserialize_reader(reader)?;
            let nonce = Nonce::deserialize_reader(reader)?;
            let receiver_id = AccountId::deserialize_reader(reader)?;
            let block_hash = CryptoHash::deserialize_reader(reader)?;
            let actions = Vec::<Action>::deserialize_reader(reader)?;
            let priority_fee = u64::deserialize_reader(reader)?;
            Ok(Transaction::V1(TransactionV1 {
                signer_id,
                public_key,
                nonce,
                receiver_id,
                block_hash,
                actions,
                priority_fee,
            }))
        }
    }
}

#[serde_as]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Clone, Default)]
pub enum FinalExecutionStatus {
    /// The execution has not yet started.
    #[default]
    NotStarted,
    /// The execution has started and still going.
    Started,
    /// The execution has failed with the given error.
    Failure(TxExecutionError),
    /// The execution has succeeded and returned some value or an empty vec encoded in base64.
    SuccessValue(#[serde_as(as = "Base64")] Vec<u8>),
}

impl fmt::Debug for FinalExecutionStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FinalExecutionStatus::NotStarted => f.write_str("NotStarted"),
            FinalExecutionStatus::Started => f.write_str("Started"),
            FinalExecutionStatus::Failure(e) => f.write_fmt(format_args!("Failure({:?})", e)),
            FinalExecutionStatus::SuccessValue(v) => {
                f.write_fmt(format_args!("SuccessValue({})", AbbrBytes(v)))
            }
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq, Clone, Serialize, Deserialize)]
pub enum ServerError {
    TxExecutionError(TxExecutionError),
    Timeout,
    Closed,
}

#[serde_as]
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Clone)]
pub enum ExecutionStatusView {
    /// The execution is pending or unknown.
    Unknown,
    /// The execution has failed.
    Failure(TxExecutionError),
    /// The final action succeeded and returned some value or an empty vec encoded in base64.
    SuccessValue(#[serde_as(as = "Base64")] Vec<u8>),
    /// The final action of the receipt returned a promise or the signed transaction was converted
    /// to a receipt. Contains the receipt_id of the generated receipt.
    SuccessReceiptId(CryptoHash),
}

impl fmt::Debug for ExecutionStatusView {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ExecutionStatusView::Unknown => f.write_str("Unknown"),
            ExecutionStatusView::Failure(e) => f.write_fmt(format_args!("Failure({:?})", e)),
            ExecutionStatusView::SuccessValue(v) => {
                f.write_fmt(format_args!("SuccessValue({})", AbbrBytes(v)))
            }
            ExecutionStatusView::SuccessReceiptId(receipt_id) => {
                f.write_fmt(format_args!("SuccessReceiptId({})", receipt_id))
            }
        }
    }
}

// impl From<ExecutionStatus> for ExecutionStatusView {
//     fn from(outcome: ExecutionStatus) -> Self {
//         match outcome {
//             ExecutionStatus::Unknown => ExecutionStatusView::Unknown,
//             ExecutionStatus::Failure(e) => ExecutionStatusView::Failure(e),
//             ExecutionStatus::SuccessValue(v) => ExecutionStatusView::SuccessValue(v),
//             ExecutionStatus::SuccessReceiptId(receipt_id) => {
//                 ExecutionStatusView::SuccessReceiptId(receipt_id)
//             }
//         }
//     }
// }

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Clone, Eq, Debug, Serialize, Deserialize)]
pub struct CostGasUsed {
    pub cost_category: String,
    pub cost: String,
    #[serde(with = "dec_format")]
    pub gas_used: Gas,
}

#[derive(BorshSerialize, BorshDeserialize, PartialEq, Clone, Eq, Debug, Serialize, Deserialize)]
pub struct ExecutionMetadataView {
    pub version: u32,
    pub gas_profile: Option<Vec<CostGasUsed>>,
}

impl CostGasUsed {
    pub fn action(cost: String, gas_used: Gas) -> Self {
        Self {
            cost_category: "ACTION_COST".to_string(),
            cost,
            gas_used,
        }
    }

    pub fn wasm_host(cost: String, gas_used: Gas) -> Self {
        Self {
            cost_category: "WASM_HOST_COST".to_string(),
            cost,
            gas_used,
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ExecutionOutcomeView {
    /// Logs from this transaction or receipt.
    pub logs: Vec<String>,
    /// Receipt IDs generated by this transaction or receipt.
    pub receipt_ids: Vec<CryptoHash>,
    /// The amount of the gas burnt by the given transaction or receipt.
    pub gas_burnt: Gas,
    /// The amount of tokens burnt corresponding to the burnt gas amount.
    /// This value doesn't always equal to the `gas_burnt` multiplied by the gas price, because
    /// the prepaid gas price might be lower than the actual gas price and it creates a deficit.
    #[serde(with = "dec_format")]
    pub tokens_burnt: Balance,
    /// The id of the account on which the execution happens. For transaction this is signer_id,
    /// for receipt this is receiver_id.
    pub executor_id: AccountId,
    /// Execution status. Contains the result in case of successful execution.
    pub status: ExecutionStatusView,
    /// Execution metadata, versioned
    #[serde(default)]
    pub metadata: Option<ExecutionMetadataView>,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq, Clone, Serialize, Deserialize)]
pub struct ExecutionOutcomeWithIdView {
    pub proof: MerklePath,
    pub block_hash: CryptoHash,
    pub id: CryptoHash,
    pub outcome: ExecutionOutcomeView,
}

#[derive(Clone, Debug)]
pub struct TxStatusView {
    pub execution_outcome: Option<FinalExecutionOutcomeViewEnum>,
    pub status: TxExecutionStatus,
}

#[derive(
    BorshSerialize,
    BorshDeserialize,
    Serialize,
    Deserialize,
    Clone,
    Debug,
    Default,
    Eq,
    PartialEq,
    PartialOrd,
    Ord,
)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum TxExecutionStatus {
    /// Transaction is waiting to be included into the block
    None,
    /// Transaction is included into the block. The block may be not finalized yet
    Included,
    /// Transaction is included into the block +
    /// All non-refund transaction receipts finished their execution.
    /// The corresponding blocks for tx and each receipt may be not finalized yet
    #[default]
    ExecutedOptimistic,
    /// Transaction is included into finalized block
    IncludedFinal,
    /// Transaction is included into finalized block +
    /// All non-refund transaction receipts finished their execution.
    /// The corresponding blocks for each receipt may be not finalized yet
    Executed,
    /// Transaction is included into finalized block +
    /// Execution of all transaction receipts is finalized, including refund receipts
    Final,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(untagged)]
// FinalExecutionOutcomeWithReceipt is a superset of FinalExecutionOutcome that includes additional information about receipts.
// For proper deserialization we need to have more specific variant first.
pub enum FinalExecutionOutcomeViewEnum {
    FinalExecutionOutcomeWithReceipt(FinalExecutionOutcomeWithReceiptView),
    FinalExecutionOutcome(FinalExecutionOutcomeView),
}

impl FinalExecutionOutcomeViewEnum {
    pub fn into_outcome(self) -> FinalExecutionOutcomeView {
        match self {
            Self::FinalExecutionOutcome(outcome) => outcome,
            Self::FinalExecutionOutcomeWithReceipt(outcome) => outcome.final_outcome,
        }
    }
}

impl TxStatusView {
    pub fn into_outcome(self) -> Option<FinalExecutionOutcomeView> {
        self.execution_outcome.map(|outcome| match outcome {
            FinalExecutionOutcomeViewEnum::FinalExecutionOutcome(outcome) => outcome,
            FinalExecutionOutcomeViewEnum::FinalExecutionOutcomeWithReceipt(outcome) => {
                outcome.final_outcome
            }
        })
    }
}

/// Execution outcome of the transaction and all the subsequent receipts.
/// Could be not finalized yet
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Clone)]
pub struct FinalExecutionOutcomeView {
    /// Execution status defined by chain.rs:get_final_transaction_result
    /// FinalExecutionStatus::NotStarted - the tx is not converted to the receipt yet
    /// FinalExecutionStatus::Started - we have at least 1 receipt, but the first leaf receipt_id (using dfs) hasn't finished the execution
    /// FinalExecutionStatus::Failure - the result of the first leaf receipt_id
    /// FinalExecutionStatus::SuccessValue - the result of the first leaf receipt_id
    pub status: FinalExecutionStatus,
    /// Signed Transaction
    pub transaction: SignedTransactionView,
    /// The execution outcome of the signed transaction.
    pub transaction_outcome: ExecutionOutcomeWithIdView,
    /// The execution outcome of receipts.
    pub receipts_outcome: Vec<ExecutionOutcomeWithIdView>,
}

impl fmt::Debug for FinalExecutionOutcomeView {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("FinalExecutionOutcome")
            .field("status", &self.status)
            .field("transaction", &self.transaction)
            .field("transaction_outcome", &self.transaction_outcome)
            .field("receipts_outcome", &Slice(&self.receipts_outcome))
            .finish()
    }
}

/// Final execution outcome of the transaction and all of subsequent the receipts. Also includes
/// the generated receipt.
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Clone, Debug, Serialize, Deserialize)]
pub struct FinalExecutionOutcomeWithReceiptView {
    /// Final outcome view without receipts
    #[serde(flatten)]
    pub final_outcome: FinalExecutionOutcomeView,
    /// Receipts generated from the transaction
    pub receipts: Vec<ReceiptView>,
}

pub mod validator_stake_view {
    pub use super::ValidatorStakeViewV1;
    use crate::types::validator_stake::ValidatorStake;
    use borsh::{BorshDeserialize, BorshSerialize};
    use near_account_id::AccountId;
    use serde::Deserialize;
    use serde::Serialize;

    #[derive(
        BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug, Clone, Eq, PartialEq,
    )]
    #[serde(tag = "validator_stake_struct_version")]
    pub enum ValidatorStakeView {
        V1(ValidatorStakeViewV1),
    }

    impl ValidatorStakeView {
        pub fn into_validator_stake(self) -> ValidatorStake {
            self.into()
        }

        #[inline]
        pub fn take_account_id(self) -> AccountId {
            match self {
                Self::V1(v1) => v1.account_id,
            }
        }

        #[inline]
        pub fn account_id(&self) -> &AccountId {
            match self {
                Self::V1(v1) => &v1.account_id,
            }
        }
    }

    impl From<ValidatorStake> for ValidatorStakeView {
        fn from(stake: ValidatorStake) -> Self {
            match stake {
                ValidatorStake::V1(v1) => Self::V1(ValidatorStakeViewV1 {
                    account_id: v1.account_id,
                    public_key: v1.public_key,
                    stake: v1.stake,
                }),
            }
        }
    }

    impl From<ValidatorStakeView> for ValidatorStake {
        fn from(view: ValidatorStakeView) -> Self {
            match view {
                ValidatorStakeView::V1(v1) => Self::new_v1(v1.account_id, v1.public_key, v1.stake),
            }
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, Eq, PartialEq, Serialize, Deserialize)]
pub struct ValidatorStakeViewV1 {
    pub account_id: AccountId,
    pub public_key: PublicKey,
    #[serde(with = "dec_format")]
    pub stake: Balance,
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ReceiptView {
    pub predecessor_id: AccountId,
    pub receiver_id: AccountId,
    pub receipt_id: CryptoHash,

    pub receipt: ReceiptEnumView,
    // Default value used when deserializing ReceiptView which are missing the `priority` field.
    // Data which is missing this field was serialized before the introduction of priority.
    // For ReceiptV0 ReceiptPriority::NoPriority => 0
    #[serde(default)]
    pub priority: u64,
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct DataReceiverView {
    pub data_id: CryptoHash,
    pub receiver_id: AccountId,
}

#[serde_as]
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum ReceiptEnumView {
    Action {
        signer_id: AccountId,
        signer_public_key: PublicKey,
        #[serde(with = "dec_format")]
        gas_price: Balance,
        output_data_receivers: Vec<DataReceiverView>,
        input_data_ids: Vec<CryptoHash>,
        actions: Vec<ActionView>,
        #[serde(default = "default_is_promise")]
        is_promise_yield: bool,
    },
    Data {
        data_id: CryptoHash,
        #[serde_as(as = "Option<Base64>")]
        data: Option<Vec<u8>>,
        #[serde(default = "default_is_promise")]
        is_promise_resume: bool,
    },
    GlobalContractDistribution {
        id: GlobalContractIdentifier,
        target_shard: ShardId,
        already_delivered_shards: Vec<ShardId>,
        #[serde_as(as = "Base64")]
        code: Vec<u8>,
    },
}

// Default value used when deserializing ReceiptEnumViews which are missing either the
// `is_promise_yield` or `is_promise_resume` fields. Data which is missing this field was
// serialized before the introduction of yield execution.
fn default_is_promise() -> bool {
    false
}

// impl From<Receipt> for ReceiptView {
//     fn from(receipt: Receipt) -> Self {
//         let is_promise_yield = matches!(receipt.receipt(), ReceiptEnum::PromiseYield(_));
//         let is_promise_resume = matches!(receipt.receipt(), ReceiptEnum::PromiseResume(_));
//         let priority = receipt.priority().value();

//         ReceiptView {
//             predecessor_id: receipt.predecessor_id().clone(),
//             receiver_id: receipt.receiver_id().clone(),
//             receipt_id: *receipt.receipt_id(),
//             receipt: match receipt.take_receipt() {
//                 ReceiptEnum::Action(action_receipt) | ReceiptEnum::PromiseYield(action_receipt) => {
//                     ReceiptEnumView::Action {
//                         signer_id: action_receipt.signer_id,
//                         signer_public_key: action_receipt.signer_public_key,
//                         gas_price: action_receipt.gas_price,
//                         output_data_receivers: action_receipt
//                             .output_data_receivers
//                             .into_iter()
//                             .map(|data_receiver| DataReceiverView {
//                                 data_id: data_receiver.data_id,
//                                 receiver_id: data_receiver.receiver_id,
//                             })
//                             .collect(),
//                         input_data_ids: action_receipt
//                             .input_data_ids
//                             .into_iter()
//                             .map(Into::into)
//                             .collect(),
//                         actions: action_receipt.actions.into_iter().map(Into::into).collect(),
//                         is_promise_yield,
//                     }
//                 }
//                 ReceiptEnum::Data(data_receipt) | ReceiptEnum::PromiseResume(data_receipt) => {
//                     ReceiptEnumView::Data {
//                         data_id: data_receipt.data_id,
//                         data: data_receipt.data,
//                         is_promise_resume,
//                     }
//                 }
//                 ReceiptEnum::GlobalContractDistribution(receipt) => {
//                     ReceiptEnumView::GlobalContractDistribution {
//                         id: receipt.id().clone(),
//                         target_shard: receipt.target_shard(),
//                         already_delivered_shards: receipt.already_delivered_shards().to_vec(),
//                         code: hash(receipt.code()).as_bytes().to_vec(),
//                     }
//                 }
//             },
//             priority,
//         }
//     }
// }

// impl TryFrom<ReceiptView> for Receipt {
//     type Error = Box<dyn std::error::Error + Send + Sync>;

//     fn try_from(receipt_view: ReceiptView) -> Result<Self, Self::Error> {
//         Ok(Receipt::V1(ReceiptV1 {
//             predecessor_id: receipt_view.predecessor_id,
//             receiver_id: receipt_view.receiver_id,
//             receipt_id: receipt_view.receipt_id,
//             receipt: match receipt_view.receipt {
//                 ReceiptEnumView::Action {
//                     signer_id,
//                     signer_public_key,
//                     gas_price,
//                     output_data_receivers,
//                     input_data_ids,
//                     actions,
//                     is_promise_yield,
//                 } => {
//                     let action_receipt = ActionReceipt {
//                         signer_id,
//                         signer_public_key,
//                         gas_price,
//                         output_data_receivers: output_data_receivers
//                             .into_iter()
//                             .map(|data_receiver_view| DataReceiver {
//                                 data_id: data_receiver_view.data_id,
//                                 receiver_id: data_receiver_view.receiver_id,
//                             })
//                             .collect(),
//                         input_data_ids: input_data_ids.into_iter().map(Into::into).collect(),
//                         actions: actions
//                             .into_iter()
//                             .map(TryInto::try_into)
//                             .collect::<Result<Vec<_>, _>>()?,
//                     };

//                     if is_promise_yield {
//                         ReceiptEnum::PromiseYield(action_receipt)
//                     } else {
//                         ReceiptEnum::Action(action_receipt)
//                     }
//                 }
//                 ReceiptEnumView::Data { data_id, data, is_promise_resume } => {
//                     let data_receipt = DataReceipt { data_id, data };

//                     if is_promise_resume {
//                         ReceiptEnum::PromiseResume(data_receipt)
//                     } else {
//                         ReceiptEnum::Data(data_receipt)
//                     }
//                 }
//                 ReceiptEnumView::GlobalContractDistribution {
//                     id,
//                     target_shard,
//                     already_delivered_shards,
//                     code,
//                 } => {
//                     ReceiptEnum::GlobalContractDistribution(GlobalContractDistributionReceipt::new(
//                         id,
//                         target_shard,
//                         already_delivered_shards,
//                         code.into(),
//                     ))
//                 }
//             },
//             priority: receipt_view.priority,
//         }))
//     }
// }

/// Information about this epoch validators and next epoch validators
#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
pub struct EpochValidatorInfo {
    /// Validators for the current epoch
    pub current_validators: Vec<CurrentEpochValidatorInfo>,
    /// Validators for the next epoch
    pub next_validators: Vec<NextEpochValidatorInfo>,
    /// Fishermen for the current epoch
    pub current_fishermen: Vec<ValidatorStakeView>,
    /// Fishermen for the next epoch
    pub next_fishermen: Vec<ValidatorStakeView>,
    /// Proposals in the current epoch
    pub current_proposals: Vec<ValidatorStakeView>,
    /// Kickout in the previous epoch
    pub prev_epoch_kickout: Vec<ValidatorKickoutView>,
    /// Epoch start block height
    pub epoch_start_height: BlockHeight,
    /// Epoch height
    pub epoch_height: EpochHeight,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq, Eq, Clone, Serialize, Deserialize)]
pub struct ValidatorKickoutView {
    pub account_id: AccountId,
    pub reason: ValidatorKickoutReason,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Clone)]
pub struct CurrentEpochValidatorInfo {
    pub account_id: AccountId,
    pub public_key: PublicKey,
    pub is_slashed: bool,
    #[serde(with = "dec_format")]
    pub stake: Balance,
    /// Shards this validator is assigned to as chunk producer in the current epoch.
    #[serde(rename = "shards")]
    pub shards_produced: Vec<ShardId>,
    pub num_produced_blocks: NumBlocks,
    pub num_expected_blocks: NumBlocks,
    #[serde(default)]
    pub num_produced_chunks: NumBlocks,
    #[serde(default)]
    pub num_expected_chunks: NumBlocks,
    // The following two fields correspond to the shards in the shard array.
    #[serde(default)]
    pub num_produced_chunks_per_shard: Vec<NumBlocks>,
    /// Number of chunks this validator was expected to produce in each shard.
    /// Each entry in the array corresponds to the shard in the `shards_produced` array.
    #[serde(default)]
    pub num_expected_chunks_per_shard: Vec<NumBlocks>,
    #[serde(default)]
    pub num_produced_endorsements: NumBlocks,
    #[serde(default)]
    pub num_expected_endorsements: NumBlocks,
    #[serde(default)]
    pub num_produced_endorsements_per_shard: Vec<NumBlocks>,
    /// Number of chunks this validator was expected to validate and endorse in each shard.
    /// Each entry in the array corresponds to the shard in the `shards_endorsed` array.
    #[serde(default)]
    pub num_expected_endorsements_per_shard: Vec<NumBlocks>,
    /// Shards this validator is assigned to as chunk validator in the current epoch.
    pub shards_endorsed: Vec<ShardId>,
}

#[derive(BorshSerialize, BorshDeserialize, Debug, PartialEq, Eq, Clone, Serialize, Deserialize)]
pub struct NextEpochValidatorInfo {
    pub account_id: AccountId,
    pub public_key: PublicKey,
    #[serde(with = "dec_format")]
    pub stake: Balance,
    pub shards: Vec<ShardId>,
}

#[derive(PartialEq, Eq, Debug, Clone, BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
pub struct LightClientBlockView {
    pub prev_block_hash: CryptoHash,
    pub next_block_inner_hash: CryptoHash,
    pub inner_lite: BlockHeaderInnerLiteView,
    pub inner_rest_hash: CryptoHash,
    pub next_bps: Option<Vec<ValidatorStakeView>>,
    pub approvals_after_next: Vec<Option<Box<Signature>>>,
}

#[derive(Serialize, Deserialize, Debug, Clone, BorshDeserialize, BorshSerialize)]
pub struct LightClientBlockLiteView {
    pub prev_block_hash: CryptoHash,
    pub inner_rest_hash: CryptoHash,
    pub inner_lite: BlockHeaderInnerLiteView,
}

// impl From<BlockHeader> for LightClientBlockLiteView {
//     fn from(header: BlockHeader) -> Self {
//         Self {
//             prev_block_hash: *header.prev_hash(),
//             inner_rest_hash: hash(&header.inner_rest_bytes()),
//             inner_lite: header.into(),
//         }
//     }
// }

// impl LightClientBlockLiteView {
//     pub fn hash(&self) -> CryptoHash {
//         let block_header_inner_lite: BlockHeaderInnerLite = self.inner_lite.clone().into();
//         combine_hash(
//             &combine_hash(
//                 &hash(&borsh::to_vec(&block_header_inner_lite).unwrap()),
//                 &self.inner_rest_hash,
//             ),
//             &self.prev_block_hash,
//         )
//     }
// }

#[derive(Serialize, Deserialize, Debug)]
pub struct GasPriceView {
    #[serde(with = "dec_format")]
    pub gas_price: Balance,
}

/// It is a [serializable view] of [`StateChangesRequest`].
///
/// [serializable view]: ./index.html
/// [`StateChangesRequest`]: ../types/struct.StateChangesRequest.html
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "changes_type", rename_all = "snake_case")]
pub enum StateChangesRequestView {
    AccountChanges {
        account_ids: Vec<AccountId>,
    },
    SingleAccessKeyChanges {
        keys: Vec<AccountWithPublicKey>,
    },
    AllAccessKeyChanges {
        account_ids: Vec<AccountId>,
    },
    ContractCodeChanges {
        account_ids: Vec<AccountId>,
    },
    DataChanges {
        account_ids: Vec<AccountId>,
        #[serde(rename = "key_prefix_base64")]
        key_prefix: StoreKey,
    },
}

impl From<StateChangesRequestView> for StateChangesRequest {
    fn from(request: StateChangesRequestView) -> Self {
        match request {
            StateChangesRequestView::AccountChanges { account_ids } => {
                Self::AccountChanges { account_ids }
            }
            StateChangesRequestView::SingleAccessKeyChanges { keys } => {
                Self::SingleAccessKeyChanges { keys }
            }
            StateChangesRequestView::AllAccessKeyChanges { account_ids } => {
                Self::AllAccessKeyChanges { account_ids }
            }
            StateChangesRequestView::ContractCodeChanges { account_ids } => {
                Self::ContractCodeChanges { account_ids }
            }
            StateChangesRequestView::DataChanges {
                account_ids,
                key_prefix,
            } => Self::DataChanges {
                account_ids,
                key_prefix,
            },
        }
    }
}

/// It is a [serializable view] of [`StateChangeKind`].
///
/// [serializable view]: ./index.html
/// [`StateChangeKind`]: ../types/struct.StateChangeKind.html
#[derive(Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case", tag = "type")]
pub enum StateChangeKindView {
    AccountTouched { account_id: AccountId },
    AccessKeyTouched { account_id: AccountId },
    DataTouched { account_id: AccountId },
    ContractCodeTouched { account_id: AccountId },
}

impl From<StateChangeKind> for StateChangeKindView {
    fn from(state_change_kind: StateChangeKind) -> Self {
        match state_change_kind {
            StateChangeKind::AccountTouched { account_id } => Self::AccountTouched { account_id },
            StateChangeKind::AccessKeyTouched { account_id } => {
                Self::AccessKeyTouched { account_id }
            }
            StateChangeKind::DataTouched { account_id } => Self::DataTouched { account_id },
            StateChangeKind::ContractCodeTouched { account_id } => {
                Self::ContractCodeTouched { account_id }
            }
        }
    }
}

pub type StateChangesKindsView = Vec<StateChangeKindView>;

/// See crate::types::StateChangeCause for details.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case", tag = "type")]
pub enum StateChangeCauseView {
    NotWritableToDisk,
    InitialState,
    TransactionProcessing { tx_hash: CryptoHash },
    ActionReceiptProcessingStarted { receipt_hash: CryptoHash },
    ActionReceiptGasReward { receipt_hash: CryptoHash },
    ReceiptProcessing { receipt_hash: CryptoHash },
    PostponedReceipt { receipt_hash: CryptoHash },
    UpdatedDelayedReceipts,
    ValidatorAccountsUpdate,
    Migration,
    BandwidthSchedulerStateUpdate,
}

impl From<StateChangeCause> for StateChangeCauseView {
    fn from(state_change_cause: StateChangeCause) -> Self {
        match state_change_cause {
            StateChangeCause::NotWritableToDisk => Self::NotWritableToDisk,
            StateChangeCause::InitialState => Self::InitialState,
            StateChangeCause::TransactionProcessing { tx_hash } => {
                Self::TransactionProcessing { tx_hash }
            }
            StateChangeCause::ActionReceiptProcessingStarted { receipt_hash } => {
                Self::ActionReceiptProcessingStarted { receipt_hash }
            }
            StateChangeCause::ActionReceiptGasReward { receipt_hash } => {
                Self::ActionReceiptGasReward { receipt_hash }
            }
            StateChangeCause::ReceiptProcessing { receipt_hash } => {
                Self::ReceiptProcessing { receipt_hash }
            }
            StateChangeCause::PostponedReceipt { receipt_hash } => {
                Self::PostponedReceipt { receipt_hash }
            }
            StateChangeCause::UpdatedDelayedReceipts => Self::UpdatedDelayedReceipts,
            StateChangeCause::ValidatorAccountsUpdate => Self::ValidatorAccountsUpdate,
            StateChangeCause::Migration => Self::Migration,
            StateChangeCause::BandwidthSchedulerStateUpdate => Self::BandwidthSchedulerStateUpdate,
        }
    }
}

#[serde_as]
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case", tag = "type", content = "change")]
pub enum StateChangeValueView {
    AccountUpdate {
        account_id: AccountId,
        #[serde(flatten)]
        account: AccountView,
    },
    AccountDeletion {
        account_id: AccountId,
    },
    AccessKeyUpdate {
        account_id: AccountId,
        public_key: PublicKey,
        access_key: AccessKeyView,
    },
    AccessKeyDeletion {
        account_id: AccountId,
        public_key: PublicKey,
    },
    DataUpdate {
        account_id: AccountId,
        #[serde(rename = "key_base64")]
        key: StoreKey,
        #[serde(rename = "value_base64")]
        value: StoreValue,
    },
    DataDeletion {
        account_id: AccountId,
        #[serde(rename = "key_base64")]
        key: StoreKey,
    },
    ContractCodeUpdate {
        account_id: AccountId,
        #[serde(rename = "code_base64")]
        #[serde_as(as = "Base64")]
        code: Vec<u8>,
    },
    ContractCodeDeletion {
        account_id: AccountId,
    },
}

impl From<StateChangeValue> for StateChangeValueView {
    fn from(state_change: StateChangeValue) -> Self {
        match state_change {
            StateChangeValue::AccountUpdate {
                account_id,
                account,
            } => Self::AccountUpdate {
                account_id,
                account: account.into(),
            },
            StateChangeValue::AccountDeletion { account_id } => {
                Self::AccountDeletion { account_id }
            }
            StateChangeValue::AccessKeyUpdate {
                account_id,
                public_key,
                access_key,
            } => Self::AccessKeyUpdate {
                account_id,
                public_key,
                access_key: access_key.into(),
            },
            StateChangeValue::AccessKeyDeletion {
                account_id,
                public_key,
            } => Self::AccessKeyDeletion {
                account_id,
                public_key,
            },
            StateChangeValue::DataUpdate {
                account_id,
                key,
                value,
            } => Self::DataUpdate {
                account_id,
                key,
                value,
            },
            StateChangeValue::DataDeletion { account_id, key } => {
                Self::DataDeletion { account_id, key }
            }
            StateChangeValue::ContractCodeUpdate { account_id, code } => {
                Self::ContractCodeUpdate { account_id, code }
            }
            StateChangeValue::ContractCodeDeletion { account_id } => {
                Self::ContractCodeDeletion { account_id }
            }
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StateChangeWithCauseView {
    pub cause: StateChangeCauseView,
    #[serde(flatten)]
    pub value: StateChangeValueView,
}

impl From<StateChangeWithCause> for StateChangeWithCauseView {
    fn from(state_change_with_cause: StateChangeWithCause) -> Self {
        let StateChangeWithCause { cause, value } = state_change_with_cause;
        Self {
            cause: cause.into(),
            value: value.into(),
        }
    }
}

pub type StateChangesView = Vec<StateChangeWithCauseView>;

/// Maintenance windows view are a vector of maintenance window.
pub type MaintenanceWindowsView = Vec<Range<BlockHeight>>;

/// Contains the split storage information.
#[derive(Serialize, Deserialize, Debug)]
pub struct SplitStorageInfoView {
    pub head_height: Option<BlockHeight>,
    pub final_head_height: Option<BlockHeight>,
    pub cold_head_height: Option<BlockHeight>,

    pub hot_db_kind: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CongestionInfoView {
    #[serde(with = "dec_format")]
    pub delayed_receipts_gas: u128,

    #[serde(with = "dec_format")]
    pub buffered_receipts_gas: u128,

    pub receipt_bytes: u64,

    pub allowed_shard: u16,
}

impl From<CongestionInfo> for CongestionInfoView {
    fn from(congestion_info: CongestionInfo) -> Self {
        match congestion_info {
            CongestionInfo::V1(congestion_info) => congestion_info.into(),
        }
    }
}

impl From<CongestionInfoV1> for CongestionInfoView {
    fn from(congestion_info: CongestionInfoV1) -> Self {
        Self {
            delayed_receipts_gas: congestion_info.delayed_receipts_gas,
            buffered_receipts_gas: congestion_info.buffered_receipts_gas,
            receipt_bytes: congestion_info.receipt_bytes,
            allowed_shard: congestion_info.allowed_shard,
        }
    }
}

impl From<CongestionInfoView> for CongestionInfo {
    fn from(congestion_info: CongestionInfoView) -> Self {
        CongestionInfo::V1(CongestionInfoV1 {
            delayed_receipts_gas: congestion_info.delayed_receipts_gas,
            buffered_receipts_gas: congestion_info.buffered_receipts_gas,
            receipt_bytes: congestion_info.receipt_bytes,
            allowed_shard: congestion_info.allowed_shard,
        })
    }
}

/// A wrapper for bytes slice which tries to guess best way to format it.
///
/// If the slice contains printable ASCII characters only, it’s represented as
/// a string surrounded by single quotes (as a consequence, empty value is
/// converted to pair of single quotes).  Otherwise, it converts the value into
/// base64.
///
/// The intended usage for this type is when trying to format binary data whose
/// structure isn’t known to the caller.  For example, when generating debugging
/// or tracing data at database layer where everything is just slices of bytes.
/// At higher levels of abstractions, if the structure of the data is known,
/// it’s usually better to format data in a way that makes sense for the given
/// type.
///
/// The type can be used as with `tracing::info!` and similar calls.  For
/// example:
///
/// ```ignore
/// tracing::trace!(target: "state",
///                 db_op = "insert",
///                 key = %near_fmt::Bytes(key),
///                 size = value.len())
/// ```
///
/// See also [`StorageKey`] which tries to guess if the data is not a crypto
/// hash.
pub struct Bytes<'a>(pub &'a [u8]);

impl<'a> std::fmt::Display for Bytes<'a> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        bytes_format(self.0, fmt, false)
    }
}

impl<'a> std::fmt::Debug for Bytes<'a> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        bytes_format(self.0, fmt, false)
    }
}

impl<'a> Bytes<'a> {
    /// Reverses `bytes_format` to allow decoding `Bytes` written with `Display`.
    ///
    /// This looks  similar to `FromStr` but due to lifetime constraints on
    /// input and output, the trait cannot be implemented.
    ///
    /// Error: Returns an error when the input does not look like an output from
    /// `bytes_format`.
    pub fn from_str(s: &str) -> Result<Vec<u8>, Box<dyn std::error::Error + Send + Sync>> {
        if s.len() >= 2 && s.starts_with('`') && s.ends_with('`') {
            // hash encoded as base58
            let hash = CryptoHash::from_str(&s[1..s.len().checked_sub(1).expect("s.len() >= 2 ")])?;
            Ok(hash.as_bytes().to_vec())
        } else if s.len() >= 2 && s.starts_with('\'') && s.ends_with('\'') {
            // plain string
            #[allow(clippy::sliced_string_as_bytes)]
            Ok(s[1..s.len().checked_sub(1).expect("s.len() >= 2 ")]
                .as_bytes()
                .to_vec())
        } else {
            // encoded with base64
            from_base64(s).map_err(|err| err.into())
        }
    }
}

/// A wrapper for bytes slice which tries to guess best way to format it
/// truncating the value if it’s too long.
///
/// Behaves like [`Bytes`] but truncates the formatted string to around 128
/// characters.  If the value is longer then that, the length of the value in
/// bytes is included at the beginning and ellipsis is included at the end of
/// the value.
pub struct AbbrBytes<T>(pub T);

impl<'a> std::fmt::Debug for AbbrBytes<&'a [u8]> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        truncated_bytes_format(self.0, fmt)
    }
}

impl<'a> std::fmt::Debug for AbbrBytes<&'a Vec<u8>> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Debug::fmt(&AbbrBytes(self.0.as_slice()), fmt)
    }
}

impl<'a> std::fmt::Debug for AbbrBytes<Option<&'a [u8]>> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self.0 {
            None => fmt.write_str("None"),
            Some(bytes) => truncated_bytes_format(bytes, fmt),
        }
    }
}

impl<'a> std::fmt::Display for AbbrBytes<&'a [u8]> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        truncated_bytes_format(self.0, fmt)
    }
}

impl<'a> std::fmt::Display for AbbrBytes<&'a Vec<u8>> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Display::fmt(&AbbrBytes(self.0.as_slice()), fmt)
    }
}

impl<'a> std::fmt::Display for AbbrBytes<Option<&'a [u8]>> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self.0 {
            None => fmt.write_str("None"),
            Some(bytes) => truncated_bytes_format(bytes, fmt),
        }
    }
}

/// A wrapper for bytes slice which tries to guess best way to format it.
///
/// If the slice is exactly 32-byte long, it’s assumed to be a hash and is
/// converted into base58 and printed surrounded by backticks.  Otherwise,
/// behaves like [`Bytes`] representing the data as string if it contains ASCII
/// printable bytes only or base64 otherwise.
///
/// The motivation for such choices is that we only ever use base58 to format
/// hashes which are 32-byte long.  It’s therefore not useful to use it for any
/// other types of keys.
///
/// The intended usage for this type is when trying to format binary data whose
/// structure isn’t known to the caller.  For example, when generating debugging
/// or tracing data at database layer where everything is just slices of bytes.
/// At higher levels of abstractions, if the structure of the data is known,
/// it’s usually better to format data in a way that makes sense for the given
/// type.
///
/// The type can be used as with `tracing::info!` and similar calls.  For
/// example:
///
/// ```ignore
/// tracing::info!(target: "store",
///                op = "set",
///                col = %col,
///                key = %near_fmt::StorageKey(key),
///                size = value.len())
/// ```
pub struct StorageKey<'a>(pub &'a [u8]);

impl<'a> std::fmt::Display for StorageKey<'a> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        bytes_format(self.0, fmt, true)
    }
}

impl<'a> std::fmt::Debug for StorageKey<'a> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        bytes_format(self.0, fmt, true)
    }
}

/// A wrapper for slices which formats the slice limiting the length.
///
/// If the slice has no more than five elements, it’s printed in full.
/// Otherwise, only the first two and last two elements are printed to limit the
/// length of the formatted value.
pub struct Slice<'a, T>(pub &'a [T]);

impl<'a, T: std::fmt::Debug> std::fmt::Debug for Slice<'a, T> {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let slice = self.0;

        struct Ellipsis;

        impl std::fmt::Debug for Ellipsis {
            fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                fmt.write_str("…")
            }
        }

        if let [a, b, _c, .., _x, y, z] = slice {
            write!(fmt, "({})", slice.len())?;
            fmt.debug_list()
                .entry(a)
                .entry(b)
                .entry(&Ellipsis)
                .entry(y)
                .entry(z)
                .finish()
        } else {
            std::fmt::Debug::fmt(&slice, fmt)
        }
    }
}

/// Implementation of [`Bytes`] and [`StorageKey`] formatting.
///
/// If the `consider_hash` argument is false, formats bytes as described in
/// [`Bytes`].  If it’s true, formats the bytes as described in [`StorageKey`].
fn bytes_format(
    bytes: &[u8],
    fmt: &mut std::fmt::Formatter<'_>,
    consider_hash: bool,
) -> std::fmt::Result {
    if consider_hash && bytes.len() == 32 {
        write!(fmt, "`{}`", CryptoHash(bytes.try_into().unwrap()))
    } else if bytes.iter().all(|ch| 0x20 <= *ch && *ch <= 0x7E) {
        // SAFETY: We’ve just checked that the value contains ASCII
        // characters only.
        let value = unsafe { std::str::from_utf8_unchecked(bytes) };
        write!(fmt, "'{value}'")
    } else {
        std::fmt::Display::fmt(&base64_display(bytes), fmt)
    }
}

/// Implementation of [`AbbrBytes`].
fn truncated_bytes_format(bytes: &[u8], fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    const PRINTABLE_ASCII: RangeInclusive<u8> = 0x20..=0x7E;
    const OVERALL_LIMIT: usize = 128;
    const DISPLAY_ASCII_FULL_LIMIT: usize = OVERALL_LIMIT - 2;
    const DISPLAY_ASCII_PREFIX_LIMIT: usize = OVERALL_LIMIT - 9;
    const DISPLAY_BASE64_FULL_LIMIT: usize = OVERALL_LIMIT / 4 * 3;
    const DISPLAY_BASE64_PREFIX_LIMIT: usize = (OVERALL_LIMIT - 8) / 4 * 3;
    let len = bytes.len();
    if bytes
        .iter()
        .take(DISPLAY_ASCII_FULL_LIMIT)
        .all(|ch| PRINTABLE_ASCII.contains(ch))
    {
        if len <= DISPLAY_ASCII_FULL_LIMIT {
            // SAFETY: We’ve just checked that the value contains ASCII
            // characters only.
            let value = unsafe { std::str::from_utf8_unchecked(bytes) };
            write!(fmt, "'{value}'")
        } else {
            let bytes = &bytes[..DISPLAY_ASCII_PREFIX_LIMIT];
            let value = unsafe { std::str::from_utf8_unchecked(bytes) };
            write!(fmt, "({len})'{value}'…")
        }
    } else if bytes.len() <= DISPLAY_BASE64_FULL_LIMIT {
        std::fmt::Display::fmt(&base64_display(bytes), fmt)
    } else {
        let bytes = &bytes[..DISPLAY_BASE64_PREFIX_LIMIT];
        let value = base64_display(bytes);
        write!(fmt, "({len}){value}…")
    }
}

pub fn from_base64(encoded: &str) -> Result<Vec<u8>, base64::DecodeError> {
    BASE64_STANDARD.decode(encoded)
}

pub fn base64_display(input: &[u8]) -> Base64Display<'_, 'static, GeneralPurpose> {
    Base64Display::new(input, &BASE64_STANDARD)
}

#[derive(
    Copy,
    Clone,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
    derive_more::AsRef,
    derive_more::AsMut,
    borsh::BorshDeserialize,
    borsh::BorshSerialize,
)]
#[as_ref(forward)]
#[as_mut(forward)]
pub struct CryptoHash(pub [u8; 32]);

impl CryptoHash {
    pub const LENGTH: usize = 32;

    pub const fn new() -> Self {
        Self([0; Self::LENGTH])
    }

    /// Calculates hash of given bytes.
    pub fn hash_bytes(bytes: &[u8]) -> CryptoHash {
        CryptoHash(sha2::Sha256::digest(bytes).into())
    }

    /// Calculates hash of borsh-serialized representation of an object.
    ///
    /// Note that using this function with an array may lead to unexpected
    /// results.  For example, `CryptoHash::hash_borsh(&[1u32, 2, 3])` hashes
    /// a representation of a `[u32; 3]` array rather than a slice.  It may be
    /// cleaner to use [`Self::hash_borsh_iter`] instead.
    pub fn hash_borsh<T: BorshSerialize>(value: T) -> CryptoHash {
        let mut hasher = sha2::Sha256::default();
        value.serialize(&mut hasher).unwrap();
        CryptoHash(hasher.finalize().into())
    }

    /// Calculates hash of a borsh-serialized representation of list of objects.
    ///
    /// This behaves as if it first collected all the items in the iterator into
    /// a vector and then calculating hash of borsh-serialized representation of
    /// that vector.
    ///
    /// Panics if the iterator lies about its length.
    pub fn hash_borsh_iter<I>(values: I) -> CryptoHash
    where
        I: IntoIterator,
        I::IntoIter: ExactSizeIterator,
        I::Item: BorshSerialize,
    {
        let iter = values.into_iter();
        let n = u32::try_from(iter.len()).unwrap();
        let mut hasher = sha2::Sha256::default();
        hasher.write_all(&n.to_le_bytes()).unwrap();
        let count = iter
            .inspect(|value| BorshSerialize::serialize(&value, &mut hasher).unwrap())
            .count();
        assert_eq!(n as usize, count);
        CryptoHash(hasher.finalize().into())
    }

    pub const fn as_bytes(&self) -> &[u8; Self::LENGTH] {
        &self.0
    }

    /// Converts hash into base58-encoded string and passes it to given visitor.
    ///
    /// The conversion is performed without any memory allocation.  The visitor
    /// is given a reference to a string stored on stack.  Returns whatever the
    /// visitor returns.
    fn to_base58_impl<Out>(self, visitor: impl FnOnce(&str) -> Out) -> Out {
        // base58-encoded string is at most 1.4 times longer than the binary
        // sequence.  We’re serializing 32 bytes so ⌈32 * 1.4⌉ = 45 should be
        // enough.
        let mut buffer = [0u8; 45];
        let len = bs58::encode(self).onto(&mut buffer[..]).unwrap();
        let value = std::str::from_utf8(&buffer[..len]).unwrap();
        visitor(value)
    }

    /// Decodes base58-encoded string into a 32-byte hash.
    ///
    /// Returns one of three results: success with the decoded CryptoHash,
    /// invalid length error indicating that the encoded value was too short or
    /// too long or other decoding error (e.g. invalid character).
    fn from_base58_impl(encoded: &str) -> Decode58Result {
        let mut result = Self::new();
        match bs58::decode(encoded).onto(&mut result.0) {
            Ok(len) if len == result.0.len() => Decode58Result::Ok(result),
            Ok(_) | Err(bs58::decode::Error::BufferTooSmall) => Decode58Result::BadLength,
            Err(err) => Decode58Result::Err(err),
        }
    }
}

/// Result of decoding base58-encoded crypto hash.
enum Decode58Result {
    /// Decoding succeeded.
    Ok(CryptoHash),
    /// The decoded data has incorrect length; either too short or too long.
    BadLength,
    /// There have been other decoding errors; e.g. an invalid character in the
    /// input buffer.
    Err(bs58::decode::Error),
}

impl Default for CryptoHash {
    fn default() -> Self {
        Self::new()
    }
}

impl Serialize for CryptoHash {
    fn serialize<S>(&self, serializer: S) -> Result<<S as Serializer>::Ok, <S as Serializer>::Error>
    where
        S: Serializer,
    {
        self.to_base58_impl(|encoded| serializer.serialize_str(encoded))
    }
}

/// Serde visitor for [`CryptoHash`].
///
/// The visitor expects a string which is then base58-decoded into a crypto
/// hash.
struct Visitor;

impl<'de> serde::de::Visitor<'de> for Visitor {
    type Value = CryptoHash;

    fn expecting(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        fmt.write_str("base58-encoded 256-bit hash")
    }

    fn visit_str<E: serde::de::Error>(self, s: &str) -> Result<Self::Value, E> {
        match CryptoHash::from_base58_impl(s) {
            Decode58Result::Ok(result) => Ok(result),
            Decode58Result::BadLength => Err(E::invalid_length(s.len(), &self)),
            Decode58Result::Err(err) => Err(E::custom(err)),
        }
    }
}

impl<'de> Deserialize<'de> for CryptoHash {
    fn deserialize<D>(deserializer: D) -> Result<Self, <D as Deserializer<'de>>::Error>
    where
        D: Deserializer<'de>,
    {
        deserializer.deserialize_str(Visitor)
    }
}

impl std::str::FromStr for CryptoHash {
    type Err = Box<dyn std::error::Error + Send + Sync>;

    /// Decodes base58-encoded string into a 32-byte crypto hash.
    fn from_str(encoded: &str) -> Result<Self, Self::Err> {
        match Self::from_base58_impl(encoded) {
            Decode58Result::Ok(result) => Ok(result),
            Decode58Result::BadLength => Err("incorrect length for hash".into()),
            Decode58Result::Err(err) => Err(err.into()),
        }
    }
}

impl TryFrom<&[u8]> for CryptoHash {
    type Error = Box<dyn std::error::Error + Send + Sync>;

    fn try_from(bytes: &[u8]) -> Result<Self, Self::Error> {
        Ok(CryptoHash(bytes.try_into()?))
    }
}

impl From<CryptoHash> for Vec<u8> {
    fn from(hash: CryptoHash) -> Vec<u8> {
        hash.0.to_vec()
    }
}

impl From<&CryptoHash> for Vec<u8> {
    fn from(hash: &CryptoHash) -> Vec<u8> {
        hash.0.to_vec()
    }
}

impl From<CryptoHash> for [u8; CryptoHash::LENGTH] {
    fn from(hash: CryptoHash) -> [u8; CryptoHash::LENGTH] {
        hash.0
    }
}

impl fmt::Debug for CryptoHash {
    fn fmt(&self, fmtr: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Display::fmt(self, fmtr)
    }
}

impl fmt::Display for CryptoHash {
    fn fmt(&self, fmtr: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.to_base58_impl(|encoded| fmtr.write_str(encoded))
    }
}

// This implementation is compatible with derived PartialEq.
impl Hash for CryptoHash {
    fn hash<H: Hasher>(&self, state: &mut H) {
        state.write(self.as_ref());
    }
}

/// Calculates a hash of a bytes slice.
///
/// # Examples
///
/// The example below calculates the hash of the indicated data.
///
/// ```
/// let data = [1, 2, 3];
/// let hash = near_min_api::types::hash(&data);
/// ```
pub fn hash(data: &[u8]) -> CryptoHash {
    CryptoHash::hash_bytes(data)
}

/// Stores the congestion level of a shard.
///
/// The CongestionInfo is a part of the ChunkHeader. It is versioned and each
/// version should not be changed. Rather a new version with the desired changes
/// should be added and used in place of the old one. When adding new versions
/// please also update the default.
#[derive(
    BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq,
)]
pub enum CongestionInfo {
    V1(CongestionInfoV1),
}

impl Default for CongestionInfo {
    fn default() -> Self {
        Self::V1(CongestionInfoV1::default())
    }
}

impl CongestionInfo {
    // A helper method to compare the congestion info from the chunk extra of
    // the previous chunk and the header of the current chunk. It returns true
    // if the congestion info was correctly set in the chunk header based on the
    // information from the chunk extra.
    //
    // TODO(congestion_control) validate allowed shard
    pub fn validate_extra_and_header(extra: &CongestionInfo, header: &CongestionInfo) -> bool {
        match (extra, header) {
            (CongestionInfo::V1(extra), CongestionInfo::V1(header)) => {
                extra.delayed_receipts_gas == header.delayed_receipts_gas
                    && extra.buffered_receipts_gas == header.buffered_receipts_gas
                    && extra.receipt_bytes == header.receipt_bytes
                    && extra.allowed_shard == header.allowed_shard
            }
        }
    }

    pub fn delayed_receipts_gas(&self) -> u128 {
        match self {
            CongestionInfo::V1(inner) => inner.delayed_receipts_gas,
        }
    }

    pub fn buffered_receipts_gas(&self) -> u128 {
        match self {
            CongestionInfo::V1(inner) => inner.buffered_receipts_gas,
        }
    }

    pub fn receipt_bytes(&self) -> u64 {
        match self {
            CongestionInfo::V1(inner) => inner.receipt_bytes,
        }
    }

    pub fn allowed_shard(&self) -> u16 {
        match self {
            CongestionInfo::V1(inner) => inner.allowed_shard,
        }
    }

    pub fn set_allowed_shard(&mut self, allowed_shard: u16) {
        match self {
            CongestionInfo::V1(inner) => inner.allowed_shard = allowed_shard,
        }
    }

    pub fn add_receipt_bytes(&mut self, bytes: u64) -> Result<(), RuntimeError> {
        match self {
            CongestionInfo::V1(inner) => {
                inner.receipt_bytes = inner.receipt_bytes.checked_add(bytes).ok_or_else(|| {
                    RuntimeError::UnexpectedIntegerOverflow("add_receipt_bytes".into())
                })?;
            }
        }
        Ok(())
    }

    pub fn remove_receipt_bytes(&mut self, bytes: u64) -> Result<(), RuntimeError> {
        match self {
            CongestionInfo::V1(inner) => {
                inner.receipt_bytes = inner.receipt_bytes.checked_sub(bytes).ok_or_else(|| {
                    RuntimeError::UnexpectedIntegerOverflow("remove_receipt_bytes".into())
                })?;
            }
        }
        Ok(())
    }

    pub fn add_delayed_receipt_gas(&mut self, gas: Gas) -> Result<(), RuntimeError> {
        match self {
            CongestionInfo::V1(inner) => {
                inner.delayed_receipts_gas = inner
                    .delayed_receipts_gas
                    .checked_add(gas as u128)
                    .ok_or_else(|| {
                        RuntimeError::UnexpectedIntegerOverflow("add_delayed_receipt_gas".into())
                    })?;
            }
        }
        Ok(())
    }

    pub fn remove_delayed_receipt_gas(&mut self, gas: Gas) -> Result<(), RuntimeError> {
        match self {
            CongestionInfo::V1(inner) => {
                inner.delayed_receipts_gas = inner
                    .delayed_receipts_gas
                    .checked_sub(gas as u128)
                    .ok_or_else(|| {
                        RuntimeError::UnexpectedIntegerOverflow("remove_delayed_receipt_gas".into())
                    })?;
            }
        }
        Ok(())
    }

    pub fn add_buffered_receipt_gas(&mut self, gas: Gas) -> Result<(), RuntimeError> {
        match self {
            CongestionInfo::V1(inner) => {
                inner.buffered_receipts_gas = inner
                    .buffered_receipts_gas
                    .checked_add(gas as u128)
                    .ok_or_else(|| {
                        RuntimeError::UnexpectedIntegerOverflow("add_buffered_receipt_gas".into())
                    })?;
            }
        }
        Ok(())
    }

    pub fn remove_buffered_receipt_gas(&mut self, gas: u128) -> Result<(), RuntimeError> {
        match self {
            CongestionInfo::V1(inner) => {
                inner.buffered_receipts_gas = inner
                    .buffered_receipts_gas
                    .checked_sub(gas)
                    .ok_or_else(|| {
                        RuntimeError::UnexpectedIntegerOverflow(
                            "remove_buffered_receipt_gas".into(),
                        )
                    })?;
            }
        }
        Ok(())
    }

    /// Computes and sets the `allowed_shard` field.
    ///
    /// If in a fully congested state, decide which shard of the shards is
    /// allowed to forward gas to `own_shard` this round. In this case, we stop all
    /// of the shards from sending anything to `own_shard`. But to guarantee
    /// progress, we allow one shard to send `allowed_shard_outgoing_gas`
    /// in the next chunk.
    ///
    /// It is also used to determine the size limit for outgoing receipts from sender shards.
    /// Only the allowed shard can send receipts of size `outgoing_receipts_big_size_limit`.
    /// Other shards can only send receipts of size `outgoing_receipts_usual_size_limit`.
    pub fn finalize_allowed_shard(
        &mut self,
        own_shard: ShardId,
        all_shards: &[ShardId],
        congestion_seed: u64,
    ) {
        let allowed_shard = Self::get_new_allowed_shard(own_shard, all_shards, congestion_seed);
        self.set_allowed_shard(allowed_shard.into());
    }

    fn get_new_allowed_shard(
        own_shard: ShardId,
        all_shards: &[ShardId],
        congestion_seed: u64,
    ) -> ShardId {
        if let Some(index) = congestion_seed.checked_rem(all_shards.len() as u64) {
            // round robin for other shards based on the seed
            return *all_shards
                .get(index as usize)
                .expect("`checked_rem` should have ensured array access is in bound");
        }
        // checked_rem failed, hence all_shards.len() is 0
        // own_shard is the only choice.
        return own_shard;
    }
}

/// The block congestion info contains the congestion info for all shards in the
/// block extended with the missed chunks count.
#[derive(Clone, Debug, Default)]
pub struct BlockCongestionInfo {
    /// The per shard congestion info. It's important that the data structure is
    /// deterministic because the allowed shard id selection depends on the
    /// order of shard ids in this map. Ideally it should also be sorted by shard id.
    shards_congestion_info: BTreeMap<ShardId, ExtendedCongestionInfo>,
}

impl BlockCongestionInfo {
    pub fn new(shards_congestion_info: BTreeMap<ShardId, ExtendedCongestionInfo>) -> Self {
        Self {
            shards_congestion_info,
        }
    }

    pub fn iter(&self) -> impl Iterator<Item = (&ShardId, &ExtendedCongestionInfo)> {
        self.shards_congestion_info.iter()
    }

    pub fn all_shards(&self) -> Vec<ShardId> {
        self.shards_congestion_info.keys().copied().collect()
    }

    pub fn get(&self, shard_id: &ShardId) -> Option<&ExtendedCongestionInfo> {
        self.shards_congestion_info.get(shard_id)
    }

    pub fn get_mut(&mut self, shard_id: &ShardId) -> Option<&mut ExtendedCongestionInfo> {
        self.shards_congestion_info.get_mut(shard_id)
    }

    pub fn insert(
        &mut self,
        shard_id: ShardId,
        value: ExtendedCongestionInfo,
    ) -> Option<ExtendedCongestionInfo> {
        self.shards_congestion_info.insert(shard_id, value)
    }

    pub fn is_empty(&self) -> bool {
        self.shards_congestion_info.is_empty()
    }
}

/// The extended congestion info contains the congestion info and extra
/// information extracted from the block that is needed for congestion control.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct ExtendedCongestionInfo {
    pub congestion_info: CongestionInfo,
    pub missed_chunks_count: u64,
}

impl ExtendedCongestionInfo {
    pub fn new(congestion_info: CongestionInfo, missed_chunks_count: u64) -> Self {
        Self {
            congestion_info,
            missed_chunks_count,
        }
    }
}

/// Stores the congestion level of a shard.
#[derive(
    BorshSerialize,
    BorshDeserialize,
    Serialize,
    Deserialize,
    Default,
    Debug,
    Clone,
    Copy,
    PartialEq,
    Eq,
)]
pub struct CongestionInfoV1 {
    /// Sum of gas in currently delayed receipts.
    pub delayed_receipts_gas: u128,
    /// Sum of gas in currently buffered receipts.
    pub buffered_receipts_gas: u128,
    /// Size of borsh serialized receipts stored in state because they
    /// were delayed, buffered, postponed, or yielded.
    pub receipt_bytes: u64,
    /// If fully congested, only this shard can forward receipts.
    pub allowed_shard: u16,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RpcQueryRequest {
    #[serde(flatten)]
    pub block_reference: BlockReference,
    #[serde(flatten)]
    pub request: QueryRequest,
}

#[derive(thiserror::Error, Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "name", content = "info", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RpcQueryError {
    #[error("There are no fully synchronized blocks on the node yet")]
    NoSyncedBlocks,
    #[error("The node does not track the shard ID {requested_shard_id}")]
    UnavailableShard { requested_shard_id: ShardId },
    #[error(
        "The data for block #{block_height} is garbage collected on this node, use an archival node to fetch historical data"
    )]
    GarbageCollectedBlock {
        block_height: BlockHeight,
        block_hash: CryptoHash,
    },
    #[error(
        "Block either has never been observed on the node or has been garbage collected: {block_reference:?}"
    )]
    UnknownBlock { block_reference: BlockReference },
    #[error("Account ID {requested_account_id} is invalid")]
    InvalidAccount {
        requested_account_id: AccountId,
        block_height: BlockHeight,
        block_hash: CryptoHash,
    },
    #[error("account {requested_account_id} does not exist while viewing")]
    UnknownAccount {
        requested_account_id: AccountId,
        block_height: BlockHeight,
        block_hash: CryptoHash,
    },
    #[error(
        "Contract code for contract ID #{contract_account_id} has never been observed on the node"
    )]
    NoContractCode {
        contract_account_id: AccountId,
        block_height: BlockHeight,
        block_hash: CryptoHash,
    },
    #[error("State of contract {contract_account_id} is too large to be viewed")]
    TooLargeContractState {
        contract_account_id: AccountId,
        block_height: BlockHeight,
        block_hash: CryptoHash,
    },
    #[error("Access key for public key {public_key} has never been observed on the node")]
    UnknownAccessKey {
        public_key: near_crypto::PublicKey,
        block_height: BlockHeight,
        block_hash: CryptoHash,
    },
    #[error("Function call returned an error: {vm_error}")]
    ContractExecutionError {
        vm_error: String,
        block_height: BlockHeight,
        block_hash: CryptoHash,
    },
}

#[derive(Deserialize, Debug)]
pub struct RpcQueryResponse {
    #[serde(flatten)]
    pub kind: QueryResponseKind,
    pub block_height: BlockHeight,
    pub block_hash: CryptoHash,
}

/// This struct may be returned from JSON RPC server in case of error
/// It is expected that this struct has impl From<_> all other RPC errors
/// like [RpcBlockError](crate::types::blocks::RpcBlockError)
#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(deny_unknown_fields)]
pub struct RpcError {
    #[serde(flatten)]
    pub error_struct: Option<RpcErrorKind>,
    /// Deprecated please use the `error_struct` instead
    pub code: i64,
    /// Deprecated please use the `error_struct` instead
    pub message: String,
    /// Deprecated please use the `error_struct` instead
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(untagged)]
pub enum HandlerError {
    RpcQueryError(RpcQueryError),
    RpcReceiptError(RpcReceiptError),
    RpcStatusError(RpcStatusError),
    RpcTransactionError(RpcTransactionError),
    RpcLightClientProofError(RpcLightClientProofError),
    Other(serde_json::Value),
}

#[derive(thiserror::Error, Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "name", content = "info", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RpcLightClientProofError {
    #[error("Block either has never been observed on the node or has been garbage collected")]
    UnknownBlock,
    #[error(
        "Inconsistent state. Total number of shards is {number_or_shards} but the execution outcome is in shard {execution_outcome_shard_id}"
    )]
    InconsistentState {
        number_or_shards: usize,
        execution_outcome_shard_id: ShardId,
    },
    #[error("{transaction_or_receipt_id} has not been confirmed")]
    NotConfirmed {
        transaction_or_receipt_id: CryptoHash,
    },
    #[error("{transaction_or_receipt_id} does not exist")]
    UnknownTransactionOrReceipt {
        transaction_or_receipt_id: CryptoHash,
    },
    #[error("Node doesn't track the shard where {transaction_or_receipt_id} is executed")]
    UnavailableShard {
        transaction_or_receipt_id: CryptoHash,
        shard_id: ShardId,
    },
}

#[derive(thiserror::Error, Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "name", content = "info", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RpcTransactionError {
    #[error("An error happened during transaction execution")]
    InvalidTransaction {},
    #[error("Node doesn't track this shard. Cannot determine whether the transaction is valid")]
    DoesNotTrackShard,
    #[error("Transaction with hash {transaction_hash} was routed")]
    RequestRouted { transaction_hash: CryptoHash },
    #[error("Transaction {requested_transaction_hash} doesn't exist")]
    UnknownTransaction {
        requested_transaction_hash: CryptoHash,
    },
    #[error("Timeout")]
    TimeoutError,
}

#[derive(thiserror::Error, Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "name", content = "info", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RpcStatusError {
    #[error("Node is syncing")]
    NodeIsSyncing,
    #[error("No blocks for {elapsed:?}")]
    NoNewBlocks { elapsed: Duration },
    #[error("Epoch Out Of Bounds {epoch_id:?}")]
    EpochOutOfBounds { epoch_id: EpochId },
}

#[derive(thiserror::Error, Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "name", content = "info", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RpcReceiptError {
    #[error("Receipt with id {receipt_id} has never been observed on this node")]
    UnknownReceipt { receipt_id: CryptoHash },
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "name", content = "cause", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RpcErrorKind {
    RequestValidationError(RpcRequestValidationErrorKind),
    HandlerError(HandlerError),
    InternalError(serde_json::Value),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(tag = "name", content = "info", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RpcRequestValidationErrorKind {
    MethodNotFound { method_name: String },
    ParseError { error_message: String },
}

impl fmt::Display for RpcError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl From<std::convert::Infallible> for RpcError {
    fn from(_: std::convert::Infallible) -> Self {
        unsafe { core::hint::unreachable_unchecked() }
    }
}

impl fmt::Display for ServerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ServerError::TxExecutionError(e) => write!(f, "ServerError: {}", e),
            ServerError::Timeout => write!(f, "ServerError: Timeout"),
            ServerError::Closed => write!(f, "ServerError: Closed"),
        }
    }
}

#[derive(
    Debug,
    Serialize,
    Deserialize,
    Clone,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
    borsh::BorshSerialize,
    borsh::BorshDeserialize,
    derive_more::Deref,
    derive_more::From,
    derive_more::Into,
)]
#[serde(transparent)]
pub struct U128(#[serde(with = "dec_format")] u128);
