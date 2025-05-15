use chrono::{DateTime, Utc};
use deli::{CursorDirection, Database, Model};
use futures_channel::oneshot;
use leptos::{prelude::*, task::spawn_local};
use near_min_api::types::AccountId;
use serde::{Deserialize, Serialize};

const DB_NAME: &str = "smile_wallet_security";

#[derive(Clone, Serialize, Deserialize, Debug, Model)]
pub struct SecurityLog {
    #[deli(auto_increment)]
    pub id: u32,
    pub message: String,
    pub account: AccountId,
    pub timestamp: DateTime<Utc>,
}

async fn setup_db() -> Result<Database, deli::Error> {
    let db = Database::builder(DB_NAME)
        .version(1)
        .add_model::<SecurityLog>()
        .build()
        .await;

    match db {
        Ok(db) => Ok(db),
        Err(e) => {
            log::error!("Failed to open database: {e:?}");
            Err(e)
        }
    }
}

async fn add_log_entry(message: String, account: AccountId) -> Result<u32, deli::Error> {
    let log = AddSecurityLog {
        message,
        account,
        timestamp: Utc::now(),
    };

    match setup_db().await {
        Ok(db) => {
            let tx = db
                .transaction()
                .writable()
                .with_model::<SecurityLog>()
                .build()
                .unwrap();

            match SecurityLog::with_transaction(&tx).unwrap().add(&log).await {
                Ok(id) => match tx.commit().await {
                    Ok(_) => Ok(id),
                    Err(e) => {
                        log::error!("Failed to commit transaction: {e:?}");
                        Err(e)
                    }
                },
                Err(e) => {
                    log::error!("Failed to add log: {:?}", e);
                    Err(e)
                }
            }
        }
        Err(e) => Err(e),
    }
}

pub async fn load_security_logs(start_index: u32, limit: u32) -> Result<Vec<SecurityLog>, String> {
    // Need to make this Send to use it in Action
    let (tx, rx) = oneshot::channel();
    spawn_local(async move {
        let result = match setup_db().await {
            Ok(db) => {
                let tx = db
                    .transaction()
                    .with_model::<SecurityLog>()
                    .build()
                    .expect("Failed to create transaction");

                let store =
                    SecurityLog::with_transaction(&tx).expect("Failed to instantiate store");
                let Ok(Some(mut cursor)) = store.cursor(.., Some(CursorDirection::Prev)).await
                else {
                    panic!("Failed to create cursor");
                };
                let mut values = Vec::new();
                cursor.advance(start_index).await.ok();
                while let Ok(Some(value)) = cursor.value() {
                    values.push(value);
                    if values.len() >= limit as usize {
                        break;
                    }
                    if let Err(e) = cursor.advance(1).await {
                        log::error!("Failed to advance cursor: {e:?}");
                        break;
                    }
                }
                Ok(values)
            }
            Err(e) => Err(e.to_string()),
        };

        let _ = tx.send(result);
    });

    rx.await.unwrap_or(Err("Failed to receive result".into()))
}

pub fn add_security_log(message: String, account: AccountId) {
    spawn_local(async move {
        match add_log_entry(message.clone(), account.clone()).await {
            Ok(_) => {
                // Log added successfully
            }
            Err(e) => log::error!("Failed to add security log: {e}"),
        }
    });
}
