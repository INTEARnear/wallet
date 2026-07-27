#[cfg(test)]
mod tests {
    use axum::{
        Router,
        http::StatusCode,
        routing::{get, post},
    };
    use axum_test::TestServer;
    use std::{collections::HashMap, sync::Arc, sync::LazyLock};
    use tokio::sync::{Mutex, RwLock};

    use crate::{
        AppState, RelayerConfig, configuration_change_id, configuration_create, configuration_edit,
        configuration_read, configuration_set_enabled,
    };

    const AUTH_HEADER: (&str, &str) = ("Authorization", "test-token");
    static ENV_MUTEX: LazyLock<Mutex<()>> = LazyLock::new(|| Mutex::new(()));

    fn test_app() -> Router {
        let config = RelayerConfig {
            relayer_id: "test_intear.testnet".parse().unwrap(),
            relayer_private_keys: vec![
                "ed25519:2fBceo29VUNSQJdbjh8Dedwh4UWWtYekUZZKQwAQCKHBLPgKjC2F1BcpLhDoEBYf62dAogZihHvCwCPsFUKLF7Z".parse().unwrap()
            ],
            rpc_urls: vec!["https://rpc.testnet.near.org".to_string()],
            finality: Default::default(),
            factory: Some("testnet".parse().unwrap()),
            create_account_deposit: Default::default(),
            intear_dex: None,
            slimedrop: None,
            near_intents: None,
            enabled: true,
            max_accounts_created_per_day: None,
        };

        let state = AppState {
            relayers: Arc::new(RwLock::new(HashMap::new())),
            configs: Arc::new(RwLock::new(HashMap::from([(
                "testnet".to_string(),
                config,
            )]))),
            account_creation_timestamps: Arc::new(RwLock::new(HashMap::new())),
        };

        Router::new()
            .route("/configuration/read/{id}", get(configuration_read))
            .route("/configuration/create/{id}", post(configuration_create))
            .route("/configuration/edit/{id}", post(configuration_edit))
            .route(
                "/configuration/set-enabled/{id}",
                post(configuration_set_enabled),
            )
            .route(
                "/configuration/change-id/{id}",
                post(configuration_change_id),
            )
            .with_state(state)
    }

    async fn post_json(server: &TestServer, path: &str, body: &str) -> axum_test::TestResponse {
        server
            .post(path)
            .add_header(AUTH_HEADER.0, AUTH_HEADER.1)
            .text(body)
            .content_type("application/json")
            .await
    }

    #[tokio::test]
    async fn create_rename_read_cycle() {
        let _guard = ENV_MUTEX.lock().await;
        unsafe { std::env::set_var("REMOTE_CONFIGURATION_AUTH_TOKEN", "test-token") };

        let app = test_app();
        let server = TestServer::new(app).expect("test server");

        let body = r#"{
            "relayer_id": "my-relayer.testnet",
            "relayer_private_keys": ["ed25519:2fBceo29VUNSQJdbjh8Dedwh4UWWtYekUZZKQwAQCKHBLPgKjC2F1BcpLhDoEBYf62dAogZihHvCwCPsFUKLF7Z"],
            "rpc_urls": ["https://rpc.testnet.near.org"]
        }"#;
        let r = post_json(&server, "/configuration/create/my-relayer", body).await;
        assert_eq!(r.status_code(), StatusCode::OK);

        let r = server
            .get("/configuration/read/my-relayer")
            .add_header(AUTH_HEADER.0, AUTH_HEADER.1)
            .await;
        assert_eq!(r.status_code(), StatusCode::OK);
        let v: serde_json::Value = r.json();
        assert_eq!(v["relayer_id"], "my-relayer.testnet");

        let r = post_json(
            &server,
            "/configuration/change-id/my-relayer",
            r#"{"new_id": "relayer-v2"}"#,
        )
        .await;
        assert_eq!(r.status_code(), StatusCode::OK);

        let r = server
            .get("/configuration/read/my-relayer")
            .add_header(AUTH_HEADER.0, AUTH_HEADER.1)
            .await;
        assert_eq!(r.status_code(), StatusCode::NOT_FOUND);

        let r = server
            .get("/configuration/read/relayer-v2")
            .add_header(AUTH_HEADER.0, AUTH_HEADER.1)
            .await;
        assert_eq!(r.status_code(), StatusCode::OK);

        let r = post_json(
            &server,
            "/configuration/change-id/relayer-v2",
            r#"{"new_id": "relayer-v2"}"#,
        )
        .await;
        assert_eq!(r.status_code(), StatusCode::BAD_REQUEST);

        let r = post_json(
            &server,
            "/configuration/change-id/relayer-v2",
            r#"{"new_id": "testnet"}"#,
        )
        .await;
        assert_eq!(r.status_code(), StatusCode::CONFLICT);

        let r = post_json(
            &server,
            "/configuration/change-id/nope",
            r#"{"new_id": "x"}"#,
        )
        .await;
        assert_eq!(r.status_code(), StatusCode::NOT_FOUND);
    }

    #[tokio::test]
    async fn edit_and_disable() {
        let _guard = ENV_MUTEX.lock().await;
        unsafe { std::env::set_var("REMOTE_CONFIGURATION_AUTH_TOKEN", "test-token") };

        let app = test_app();
        let server = TestServer::new(app).expect("test server");

        let body = r#"{
            "relayer_id": "test_intear.testnet",
            "relayer_private_keys": ["ed25519:2fBceo29VUNSQJdbjh8Dedwh4UWWtYekUZZKQwAQCKHBLPgKjC2F1BcpLhDoEBYf62dAogZihHvCwCPsFUKLF7Z"],
            "rpc_urls": ["https://rpc.testnet.near.org"],
            "max_accounts_created_per_day": 200
        }"#;
        let r = post_json(&server, "/configuration/edit/testnet", body).await;
        assert_eq!(r.status_code(), StatusCode::OK);

        let r = post_json(&server, "/configuration/edit/nope", body).await;
        assert_eq!(r.status_code(), StatusCode::NOT_FOUND);

        let r = post_json(
            &server,
            "/configuration/set-enabled/testnet",
            r#"{"enabled": false}"#,
        )
        .await;
        assert_eq!(r.status_code(), StatusCode::OK);

        let r = post_json(
            &server,
            "/configuration/set-enabled/nope",
            r#"{"enabled": false}"#,
        )
        .await;
        assert_eq!(r.status_code(), StatusCode::NOT_FOUND);
    }

    #[tokio::test]
    async fn create_duplicate_rejected() {
        let _guard = ENV_MUTEX.lock().await;
        unsafe { std::env::set_var("REMOTE_CONFIGURATION_AUTH_TOKEN", "test-token") };

        let app = test_app();
        let server = TestServer::new(app).expect("test server");
        let body = r#"{
            "relayer_id": "dup.near",
            "relayer_private_keys": ["ed25519:2fBceo29VUNSQJdbjh8Dedwh4UWWtYekUZZKQwAQCKHBLPgKjC2F1BcpLhDoEBYf62dAogZihHvCwCPsFUKLF7Z"],
            "rpc_urls": ["https://rpc.testnet.near.org"]
        }"#;
        let r = post_json(&server, "/configuration/create/testnet", body).await;
        assert_eq!(r.status_code(), StatusCode::CONFLICT);
    }

    #[tokio::test]
    async fn empty_keys_rejected() {
        let _guard = ENV_MUTEX.lock().await;
        unsafe { std::env::set_var("REMOTE_CONFIGURATION_AUTH_TOKEN", "test-token") };

        let app = test_app();
        let server = TestServer::new(app).expect("test server");
        let body = r#"{
            "relayer_id": "nokeys.near",
            "relayer_private_keys": [],
            "rpc_urls": ["https://rpc.testnet.near.org"]
        }"#;
        let r = post_json(&server, "/configuration/create/nokeys", body).await;
        assert_eq!(r.status_code(), StatusCode::BAD_REQUEST);
    }

    #[tokio::test]
    async fn no_auth_rejected() {
        let _guard = ENV_MUTEX.lock().await;
        unsafe { std::env::set_var("REMOTE_CONFIGURATION_AUTH_TOKEN", "test-token") };

        let app = test_app();
        let server = TestServer::new(app).expect("test server");

        let r = server.get("/configuration/read/testnet").await;
        assert_eq!(r.status_code(), StatusCode::UNAUTHORIZED);

        let valid = r#"{"relayer_id": "x.near", "relayer_private_keys": ["ed25519:2fBceo29VUNSQJdbjh8Dedwh4UWWtYekUZZKQwAQCKHBLPgKjC2F1BcpLhDoEBYf62dAogZihHvCwCPsFUKLF7Z"], "rpc_urls": []}"#;
        for path in &["/configuration/create/x", "/configuration/edit/x"] {
            let r = server
                .post(path)
                .text(valid)
                .content_type("application/json")
                .await;
            assert_eq!(r.status_code(), StatusCode::UNAUTHORIZED, "path: {path}");
        }

        let r = server
            .post("/configuration/set-enabled/x")
            .text(r#"{"enabled": false}"#)
            .content_type("application/json")
            .await;
        assert_eq!(r.status_code(), StatusCode::UNAUTHORIZED);

        let r = server
            .post("/configuration/change-id/x")
            .text(r#"{"new_id": "y"}"#)
            .content_type("application/json")
            .await;
        assert_eq!(r.status_code(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn missing_env_var_rejected() {
        let _guard = ENV_MUTEX.lock().await;
        unsafe { std::env::remove_var("REMOTE_CONFIGURATION_AUTH_TOKEN") };

        let app = test_app();
        let server = TestServer::new(app).expect("test server");
        let r = server.get("/configuration/read/testnet").await;
        assert_eq!(r.status_code(), StatusCode::INTERNAL_SERVER_ERROR);
    }
}
