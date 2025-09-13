use axum::{routing::post, Json, Router};
use rustyscript::{json_args, Module, Runtime, RuntimeOptions};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, net::SocketAddr, time::Duration};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

#[derive(Debug, Deserialize)]
struct ExtractRequest {
    text: String,
}

#[derive(Debug, Serialize)]
struct ExtractResponse {
    accounts: HashMap<String, f64>,
    error: Option<String>,
}

#[axum::debug_handler]
async fn extract_handler(Json(payload): Json<ExtractRequest>) -> Json<ExtractResponse> {
    const MAX_SIZE: usize = 1024 * 1024; // 1MB
    if payload.text.len() > MAX_SIZE {
        return Json(ExtractResponse {
            accounts: HashMap::new(),
            error: Some(format!(
                "File too large. Maximum size is 1MB ({} bytes), got {} bytes",
                MAX_SIZE,
                payload.text.len()
            )),
        });
    }

    match call_openai(&payload.text).await {
        Ok(map) => Json(ExtractResponse {
            accounts: map,
            error: None,
        }),
        Err(e) => Json(ExtractResponse {
            accounts: HashMap::new(),
            error: Some(e),
        }),
    }
}

async fn call_openai(content: &str) -> Result<HashMap<String, f64>, String> {
    if content.len() < 500 {
        call_openai_direct(content).await
    } else {
        call_openai_with_js_sandbox(content).await
    }
}

async fn call_openai_direct(content: &str) -> Result<HashMap<String, f64>, String> {
    let api_key = std::env::var("OPENAI_API_KEY").map_err(|_| "OPENAI_API_KEY not set")?;
    let client = reqwest::Client::new();

    let body = serde_json::json!({
        "model": "gpt-4.1",
        "service_tier": "priority",
        "temperature": 0.0,
        "instructions": "Your job is to extract all Near Account IDs and balances from a user-provided file. The file may be in any format: CSV, JSON, or any other. The account ID might be user.near, user.tg, sub.account.near, top-level-name, hex names, EVM-like names, or just any string.",
        "text": {
            "format": {
                "type": "json_schema",
                "name": "account_extraction",
                "strict": true,
                "schema": {
                    "type": "object",
                    "properties": {
                        "accounts": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "account_id": {
                                        "type": "string"
                                    },
                                    "amount": {
                                        "type": "number"
                                    }
                                },
                                "required": ["account_id", "amount"],
                                "additionalProperties": false
                            }
                        }
                    },
                    "required": ["accounts"],
                    "additionalProperties": false
                }
            }
        },
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": format!("Extract data from this file:\n\n{}", content)
                    }
                ]
            }
        ]
    });

    let res = client
        .post("https://api.openai.com/v1/responses")
        .bearer_auth(api_key)
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!(
            "OpenAI error: {}",
            res.text().await.unwrap_or_default()
        ));
    }
    let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;

    parse_openai_response(json)
}

async fn call_openai_with_js_sandbox(content: &str) -> Result<HashMap<String, f64>, String> {
    let api_key = std::env::var("OPENAI_API_KEY").map_err(|_| "OPENAI_API_KEY not set")?;
    let client = reqwest::Client::new();

    let body = serde_json::json!({
        "model": "gpt-4.1",
        "service_tier": "priority",
        "temperature": 0.0,
        "instructions": "Your job is to analyze a user-provided file and write JavaScript code to extract the data from a file that can be in CSV, JSON, or any other format. The code should extract all Near Account IDs and balances from the file. The account ID might be user.near, user.tg, sub.account.near, top-level-name, hex names, EVM-like names, or just any string. Return ONLY the JavaScript module code (without formatting or comments) that will parse the data and export a function with the signature: (s: string) => { return {accounts: [{account_id: string, amount: number}]}; }. Example: `export default (s) => { return {accounts: [/*placeholder*/]}; }`",
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": format!("Generate JavaScript code to parse this data format. The code should work with the full file content:\n\n{}", if content.len() > 1000 {
                            format!("{} ... and more data", &content[..1000])
                        } else {
                            content.to_string()
                        })
                    }
                ]
            }
        ]
    });

    let res = client
        .post("https://api.openai.com/v1/responses")
        .bearer_auth(api_key)
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !res.status().is_success() {
        return Err(format!(
            "OpenAI error: {}",
            res.text().await.unwrap_or_default()
        ));
    }
    let json: serde_json::Value = res.json().await.map_err(|e| e.to_string())?;

    let js_code = extract_js_code_from_response(json)?;

    execute_js_in_sandbox(&js_code, content).await
}

fn extract_js_code_from_response(json: serde_json::Value) -> Result<String, String> {
    if let Some(output) = json.get("output") {
        if let Some(last) = output.as_array().and_then(|a| a.last()) {
            if let Some(content) = last.get("content") {
                if let Some(first_content) = content.as_array().and_then(|a| a.first()) {
                    if let Some(text) = first_content.get("text").and_then(|t| t.as_str()) {
                        return Ok(text.to_string());
                    }
                }
            }
        }
    }
    Err("Could not extract JavaScript code from OpenAI response".to_string())
}

async fn execute_js_in_sandbox(
    js_code: &str,
    content: &str,
) -> Result<HashMap<String, f64>, String> {
    let module = Module::new("extract.js", js_code);

    tracing::info!("Executing JavaScript in sandbox: {}", js_code);

    let content = content.to_owned();
    let value = tokio::task::spawn_blocking(move || {
        let mut runtime = Runtime::new(RuntimeOptions {
            timeout: Duration::from_secs(15),
            ..Default::default()
        })
        .map_err(|e| format!("Failed to create runtime: {}", e))?;
        let module = runtime
            .load_module(&module)
            .map_err(|e| format!("Failed to load module: {}", e))?;
        let value: serde_json::Value = runtime
            .call_entrypoint(&module, json_args!(content))
            .map_err(|e| format!("Failed to call entrypoint: {}", e))?;
        Result::<serde_json::Value, String>::Ok(value)
    })
    .await
    .unwrap()?;

    tracing::info!("Parsed accounts from JavaScript in sandbox: {}", value);
    parse_accounts_from_json(value)
}

fn parse_openai_response(json: serde_json::Value) -> Result<HashMap<String, f64>, String> {
    let content = if let Some(output) = json.get("output") {
        if let Some(last) = output.as_array().and_then(|a| a.last()) {
            if let Some(content) = last.get("content") {
                if let Some(first_content) = content.as_array().and_then(|a| a.first()) {
                    if let Some(text) = first_content.get("text").and_then(|t| t.as_str()) {
                        if let Ok(json) = serde_json::from_str::<serde_json::Value>(text) {
                            json
                        } else {
                            return Err("Content is not a valid JSON".to_string());
                        }
                    } else {
                        return Err("Text is not a string".to_string());
                    }
                } else {
                    return Err("Content is an empty array".to_string());
                }
            } else {
                return Err("No content in last element".to_string());
            }
        } else {
            return Err("No last element in output".to_string());
        }
    } else {
        return Err("No output in response".to_string());
    };

    parse_accounts_from_json(content)
}

fn parse_accounts_from_json(
    response_data: serde_json::Value,
) -> Result<HashMap<String, f64>, String> {
    let accounts = response_data
        .get("accounts")
        .and_then(|a| a.as_array())
        .ok_or("No accounts array in response")?;

    let mut map = HashMap::new();
    for account in accounts {
        if let (Some(account_id), Some(amount)) = (
            account.get("account_id").and_then(|id| id.as_str()),
            account.get("amount").and_then(|amt| amt.as_f64()),
        ) {
            map.entry(account_id.to_string())
                .and_modify(|e| *e += amount)
                .or_insert(amount);
        }
    }
    Ok(map)
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive("info".parse().unwrap())
                .from_env_lossy(),
        )
        .init();

    let app = Router::new()
        .route("/api/extract", post(extract_handler))
        .layer(CorsLayer::permissive());
    let addr = std::env::var("AI_TOOLS_SERVICE_BIND")
        .map(|s| s.parse().expect("Invalid AI_TOOLS_SERVICE_BIND format"))
        .unwrap_or_else(|_| SocketAddr::from(([127, 0, 0, 1], 3006)));
    tracing::info!("Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("Server started successfully");

    axum::serve(listener, app).await.unwrap();
}
