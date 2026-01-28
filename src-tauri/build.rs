fn main() {
    println!("cargo::rerun-if-env-changed=USE_ALTERNATIVE_WASM_PROTOCOL");
    if std::env::var("USE_ALTERNATIVE_WASM_PROTOCOL").is_ok_and(|v| v == "true") {
        let wasm_file = std::fs::read_dir("../dist/pkg")
            .unwrap()
            .find(|f| f.as_ref().unwrap().path().extension().unwrap() == "wasm")
            .expect("Generated WASM file not found")
            .unwrap()
            .file_name()
            .to_str()
            .unwrap()
            .to_string();
        println!("cargo::rustc-cfg=feature=\"alternative_wasm_protocol\"");
        println!("cargo::rustc-env=WASM_FILE={wasm_file}");
        println!("cargo::rerun-if-changed=../dist/pkg/{wasm_file}");
    }
    tauri_build::build()
}
