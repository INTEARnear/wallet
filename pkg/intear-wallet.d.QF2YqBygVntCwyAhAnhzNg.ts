/* tslint:disable */
/* eslint-disable */
/**
 * The `ReadableStreamType` enum.
 *
 * *This API requires the following crate features to be activated: `ReadableStreamType`*
 */

export type ReadableStreamType = "bytes";

export class IntoUnderlyingByteSource {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    cancel(): void;
    pull(controller: ReadableByteStreamController): Promise<any>;
    start(controller: ReadableByteStreamController): void;
    readonly autoAllocateChunkSize: number;
    readonly type: ReadableStreamType;
}

export class IntoUnderlyingSink {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    abort(reason: any): Promise<any>;
    close(): Promise<any>;
    write(chunk: any): Promise<any>;
}

export class IntoUnderlyingSource {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    cancel(): void;
    pull(controller: ReadableStreamDefaultController): Promise<any>;
}

export function hydrate(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly hydrate: () => void;
    readonly __wbg_intounderlyingbytesource_free: (a: number, b: number) => void;
    readonly __wbg_intounderlyingsink_free: (a: number, b: number) => void;
    readonly __wbg_intounderlyingsource_free: (a: number, b: number) => void;
    readonly intounderlyingbytesource_autoAllocateChunkSize: (a: number) => number;
    readonly intounderlyingbytesource_cancel: (a: number) => void;
    readonly intounderlyingbytesource_pull: (a: number, b: any) => any;
    readonly intounderlyingbytesource_start: (a: number, b: any) => void;
    readonly intounderlyingbytesource_type: (a: number) => number;
    readonly intounderlyingsink_abort: (a: number, b: any) => any;
    readonly intounderlyingsink_close: (a: number) => any;
    readonly intounderlyingsink_write: (a: number, b: any) => any;
    readonly intounderlyingsource_cancel: (a: number) => void;
    readonly intounderlyingsource_pull: (a: number, b: any) => any;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___wasm_bindgen_f089307a9adbbdd1___JsValue__core_de11c6d026cca4da___result__Result_____wasm_bindgen_f089307a9adbbdd1___JsError___true_: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___js_sys_34ec583cdf7e34d9___Array__web_sys_3e65c5dd2e1844f1___features__gen_IntersectionObserver__IntersectionObserver______true_: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___js_sys_34ec583cdf7e34d9___Function_fn_wasm_bindgen_f089307a9adbbdd1___JsValue_____wasm_bindgen_f089307a9adbbdd1___sys__Undefined___js_sys_34ec583cdf7e34d9___Function_fn_wasm_bindgen_f089307a9adbbdd1___JsValue_____wasm_bindgen_f089307a9adbbdd1___sys__Undefined_______true_: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___wasm_bindgen_f089307a9adbbdd1___JsValue______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_UiEvent__UiEvent______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_CloseEvent__CloseEvent______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_Event__Event______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___wasm_bindgen_f089307a9adbbdd1___JsValue______true__6: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_WheelEvent__WheelEvent______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_WheelEvent__WheelEvent______true__8: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_CloseEvent__CloseEvent______true__9: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_MessageEvent__MessageEvent______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_UiEvent__UiEvent______true__11: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_MessageEvent__MessageEvent______true__12: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_UiEvent__UiEvent______true__13: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_UiEvent__UiEvent______true__14: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke___web_sys_3e65c5dd2e1844f1___features__gen_WheelEvent__WheelEvent______true__15: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke_______true_: (a: number, b: number) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke_______true__1_: (a: number, b: number) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke_______true__2_: (a: number, b: number) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke_______true__3_: (a: number, b: number) => void;
    readonly wasm_bindgen_f089307a9adbbdd1___convert__closures_____invoke_______true__4_: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
