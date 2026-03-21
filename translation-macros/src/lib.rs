extern crate proc_macro;

use proc_macro::TokenStream;
use proc_macro2::Span;
use quote::{format_ident, quote};
use std::collections::{BTreeSet, HashMap, HashSet};
use syn::{
    Ident, LitStr, Token, braced, parenthesized,
    parse::{Parse, ParseStream},
};

struct TranslationKeysInput {
    languages: Vec<LanguageDef>,
    keys: Vec<KeyNode>,
}

struct LanguageDef {
    variant_name: Ident,
    id: String,
    display_name: String,
    browser_codes: Vec<String>,
}

enum KeyNode {
    Group { name: Ident, children: Vec<KeyNode> },
    Leaf { name: Ident },
}

struct FlatKey {
    variant_name: Ident,
    key_string: String,
}

impl Parse for TranslationKeysInput {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let lang_kw: Ident = input.parse()?;
        if lang_kw != "languages" {
            return Err(syn::Error::new(lang_kw.span(), "expected 'languages'"));
        }

        let lang_content;
        braced!(lang_content in input);
        let mut languages = Vec::new();
        while !lang_content.is_empty() {
            let variant_name: Ident = lang_content.parse()?;
            let paren_content;
            parenthesized!(paren_content in lang_content);
            let id: LitStr = paren_content.parse()?;
            paren_content.parse::<Token![,]>()?;
            let display_name: LitStr = paren_content.parse()?;
            let mut browser_codes = Vec::new();
            if paren_content.parse::<Token![,]>().is_ok() && paren_content.peek(syn::token::Bracket)
            {
                let bracket_content;
                syn::bracketed!(bracket_content in paren_content);
                while !bracket_content.is_empty() {
                    let code: LitStr = bracket_content.parse()?;
                    browser_codes.push(code.value());
                    if bracket_content.is_empty() {
                        break;
                    }
                    bracket_content.parse::<Token![,]>()?;
                }
            }
            if browser_codes.is_empty() {
                browser_codes.push(id.value());
            }
            if !lang_content.is_empty() {
                lang_content.parse::<Token![,]>()?;
            }
            languages.push(LanguageDef {
                variant_name,
                id: id.value(),
                display_name: display_name.value(),
                browser_codes,
            });
        }

        if languages.is_empty() {
            return Err(syn::Error::new(
                Span::call_site(),
                "at least one language required",
            ));
        }

        let keys_kw: Ident = input.parse()?;
        if keys_kw != "keys" {
            return Err(syn::Error::new(keys_kw.span(), "expected 'keys'"));
        }

        let keys_content;
        braced!(keys_content in input);
        let keys = parse_key_nodes(&keys_content)?;

        Ok(TranslationKeysInput { languages, keys })
    }
}

fn parse_key_nodes(input: ParseStream) -> syn::Result<Vec<KeyNode>> {
    let mut nodes = Vec::new();
    while !input.is_empty() {
        let name: Ident = input.parse()?;
        if input.peek(syn::token::Brace) {
            let content;
            braced!(content in input);
            let children = parse_key_nodes(&content)?;
            nodes.push(KeyNode::Group { name, children });
        } else {
            nodes.push(KeyNode::Leaf { name });
        }
        if !input.is_empty() {
            input.parse::<Token![,]>()?;
        }
    }
    Ok(nodes)
}

fn pascal_to_snake(s: &str) -> String {
    let mut result = String::new();
    for (i, c) in s.chars().enumerate() {
        if c.is_uppercase() {
            if i > 0 {
                result.push('_');
            }
            result.extend(c.to_lowercase());
        } else {
            result.push(c);
        }
    }
    result
}

fn flatten_keys(nodes: &[KeyNode], prefix_variant: &str, prefix_key: &str) -> Vec<FlatKey> {
    let mut result = Vec::new();
    for node in nodes {
        match node {
            KeyNode::Group { name, children } => {
                let name_str = name.to_string();
                let new_prefix_variant = format!("{prefix_variant}{name_str}");
                let name_snake = pascal_to_snake(&name_str);
                let new_prefix_key = if prefix_key.is_empty() {
                    name_snake
                } else {
                    format!("{prefix_key}.{name_snake}")
                };
                result.extend(flatten_keys(children, &new_prefix_variant, &new_prefix_key));
            }
            KeyNode::Leaf { name } => {
                let name_str = name.to_string();
                let variant_str = format!("{prefix_variant}{name_str}");
                let variant_name = format_ident!("{variant_str}");
                let name_snake = pascal_to_snake(&name_str);
                let key_string = if prefix_key.is_empty() {
                    name_snake
                } else {
                    format!("{prefix_key}.{name_snake}")
                };
                result.push(FlatKey {
                    variant_name,
                    key_string,
                });
            }
        }
    }
    result
}

fn extract_placeholders(template: &str) -> Vec<String> {
    let mut placeholders = Vec::new();
    let mut chars = template.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '{' {
            if chars.peek() == Some(&'{') {
                chars.next();
                continue;
            }
            let mut name = String::new();
            for c in chars.by_ref() {
                if c == '}' {
                    break;
                }
                name.push(c);
            }
            if !name.is_empty() {
                placeholders.push(name);
            }
        } else if c == '}' && chars.peek() == Some(&'}') {
            chars.next();
        }
    }
    placeholders
}

fn generate_resolve_body(template: &str, placeholders: &[String]) -> proc_macro2::TokenStream {
    if placeholders.is_empty() {
        let template_lit = LitStr::new(template, Span::call_site());
        quote! {
            if !args.is_empty() { return "???".to_string(); }
            (#template_lit).to_string()
        }
    } else {
        let bindings: Vec<proc_macro2::TokenStream> = placeholders
            .iter()
            .map(|p| {
                let name = format_ident!("{}", p);
                let name_lit = LitStr::new(p, Span::call_site());
                quote! {
                    let ::core::option::Option::Some(#name) = arg_map.get(#name_lit) else {
                        return "???".to_string();
                    };
                }
            })
            .collect();

        let template_lit = LitStr::new(template, Span::call_site());

        quote! {
            let arg_map: ::std::collections::HashMap<&str, &str> = args.iter().copied().collect();
            #(#bindings)*
            format!(#template_lit)
        }
    }
}

fn generate_tree_tokens(nodes: &[KeyNode], variant_prefix: &str) -> proc_macro2::TokenStream {
    let items: Vec<proc_macro2::TokenStream> = nodes
        .iter()
        .map(|node| match node {
            KeyNode::Group { name, children } => {
                let name_snake = pascal_to_snake(&name.to_string());
                let name_lit = LitStr::new(&name_snake, Span::call_site());
                let new_prefix = format!("{}{}", variant_prefix, name);
                let children_tokens = generate_tree_tokens(children, &new_prefix);
                quote! {
                    TranslationNode::Group(TranslationGroup {
                        name: #name_lit,
                        children: &[#children_tokens],
                    })
                }
            }
            KeyNode::Leaf { name } => {
                let variant_ident = format_ident!("{}{}", variant_prefix, name);
                quote! {
                    TranslationNode::Key(TranslationKey::#variant_ident)
                }
            }
        })
        .collect();

    quote! { #(#items),* }
}

#[proc_macro]
pub fn translation_keys(input: TokenStream) -> TokenStream {
    let input = syn::parse_macro_input!(input as TranslationKeysInput);
    let flat_keys = flatten_keys(&input.keys, "", "");

    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR not set");
    let translations_dir = format!("{manifest_dir}/src/data/translations");

    let mut all_translations: HashMap<String, HashMap<String, String>> = HashMap::new();

    for lang in &input.languages {
        let file_path = format!("{}/{}.json", translations_dir, lang.id);
        let content = std::fs::read_to_string(&file_path)
            .unwrap_or_else(|e| panic!("Failed to read {file_path}: {e}"));
        let translations: HashMap<String, String> = serde_json::from_str(&content)
            .unwrap_or_else(|e| panic!("Failed to parse {file_path}: {e}"));
        all_translations.insert(lang.id.clone(), translations);
    }

    let key_strings: HashSet<String> = flat_keys.iter().map(|k| k.key_string.clone()).collect();

    let first_lang_id = &input.languages[0].id;
    let first_lang_translations = all_translations
        .get(first_lang_id)
        .unwrap_or_else(|| panic!("Translations for {first_lang_id} not found"));
    let mut reference_placeholders: HashMap<String, Vec<String>> = HashMap::new();

    for key in &flat_keys {
        for lang in &input.languages {
            let lang_translations = all_translations
                .get(&lang.id)
                .unwrap_or_else(|| panic!("Translations for {} not found", lang.id));
            if !lang_translations.contains_key(&key.key_string) {
                panic!(
                    "{}.json: missing key '{}'. All keys must be present in all built-in languages.",
                    lang.id, key.key_string
                );
            }
        }
        let template = first_lang_translations.get(&key.key_string).unwrap();
        reference_placeholders.insert(key.key_string.clone(), extract_placeholders(template));
    }

    for lang in &input.languages {
        let lang_translations = all_translations.get(&lang.id).unwrap();
        for json_key in lang_translations.keys() {
            if !key_strings.contains(json_key) {
                panic!(
                    "{}.json: stale key '{json_key}' not found in macro key definitions.",
                    lang.id
                );
            }
        }
    }

    for key in &flat_keys {
        let ref_phs: BTreeSet<&str> = reference_placeholders
            .get(&key.key_string)
            .unwrap()
            .iter()
            .map(|s| s.as_str())
            .collect();

        for lang in &input.languages[1..] {
            let lang_translations = all_translations.get(&lang.id).unwrap();
            let template = lang_translations.get(&key.key_string).unwrap();
            let lang_phs_vec = extract_placeholders(template);
            let lang_phs: BTreeSet<&str> = lang_phs_vec.iter().map(|s| s.as_str()).collect();

            if ref_phs != lang_phs {
                panic!(
                    "{}.json: key '{}' placeholder mismatch. Expected {{{}}} but got {{{}}}.",
                    lang.id,
                    key.key_string,
                    ref_phs.iter().copied().collect::<Vec<_>>().join(", "),
                    lang_phs.iter().copied().collect::<Vec<_>>().join(", "),
                );
            }
        }
    }

    // BuiltInLanguage
    let lang_variants: Vec<proc_macro2::TokenStream> = input
        .languages
        .iter()
        .enumerate()
        .map(|(i, lang)| {
            let variant = &lang.variant_name;
            let id_str = LitStr::new(&lang.id, Span::call_site());
            if i == 0 {
                quote! {
                    #[default]
                    #[serde(rename = #id_str)]
                    #variant
                }
            } else {
                quote! {
                    #[serde(rename = #id_str)]
                    #variant
                }
            }
        })
        .collect();

    let builtin_lang_enum = quote! {
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default, ::serde::Serialize, ::serde::Deserialize)]
        pub enum BuiltInLanguage {
            #(#lang_variants),*
        }
    };

    let lang_id_arms: Vec<proc_macro2::TokenStream> = input
        .languages
        .iter()
        .map(|lang| {
            let variant = &lang.variant_name;
            let id_lit = LitStr::new(&lang.id, Span::call_site());
            quote! { Self::#variant => #id_lit }
        })
        .collect();

    let lang_display_arms: Vec<proc_macro2::TokenStream> = input
        .languages
        .iter()
        .map(|lang| {
            let variant = &lang.variant_name;
            let display_lit = LitStr::new(&lang.display_name, Span::call_site());
            quote! { Self::#variant => #display_lit }
        })
        .collect();

    let lang_all_items: Vec<proc_macro2::TokenStream> = input
        .languages
        .iter()
        .map(|lang| {
            let variant = &lang.variant_name;
            quote! { Self::#variant }
        })
        .collect();

    let lang_from_id_arms: Vec<proc_macro2::TokenStream> = input
        .languages
        .iter()
        .map(|lang| {
            let variant = &lang.variant_name;
            let id_lit = LitStr::new(&lang.id, Span::call_site());
            quote! { #id_lit => ::core::option::Option::Some(Self::#variant) }
        })
        .collect();

    let lang_from_browser_arms: Vec<proc_macro2::TokenStream> = input
        .languages
        .iter()
        .flat_map(|lang| {
            let variant = &lang.variant_name;
            lang.browser_codes.iter().map(move |code| {
                let code_lit = LitStr::new(code, Span::call_site());
                quote! { #code_lit => ::core::option::Option::Some(Self::#variant) }
            })
        })
        .collect();

    let resolve_arms: Vec<proc_macro2::TokenStream> = input
        .languages
        .iter()
        .flat_map(|lang| {
            let lang_variant = &lang.variant_name;
            let lang_translations = all_translations.get(&lang.id).unwrap();

            flat_keys.iter().map(move |key| {
                let key_variant = &key.variant_name;
                let template = lang_translations.get(&key.key_string).unwrap();
                let placeholders = extract_placeholders(template);
                let body = generate_resolve_body(template, &placeholders);

                quote! {
                    (Self::#lang_variant, TranslationKey::#key_variant) => { #body }
                }
            })
        })
        .collect();

    let template_arms: Vec<proc_macro2::TokenStream> = input
        .languages
        .iter()
        .flat_map(|lang| {
            let lang_variant = &lang.variant_name;
            let lang_translations = all_translations.get(&lang.id).unwrap();

            flat_keys.iter().map(move |key| {
                let key_variant = &key.variant_name;
                let template = lang_translations.get(&key.key_string).unwrap();
                let template_lit = LitStr::new(template, Span::call_site());

                quote! {
                    (Self::#lang_variant, TranslationKey::#key_variant) => #template_lit
                }
            })
        })
        .collect();

    let builtin_lang_impl = quote! {
        impl BuiltInLanguage {
            pub fn id(&self) -> &'static str {
                match self { #(#lang_id_arms),* }
            }

            pub fn display_name(&self) -> &'static str {
                match self { #(#lang_display_arms),* }
            }

            pub fn all() -> &'static [BuiltInLanguage] {
                &[#(#lang_all_items),*]
            }

            pub fn from_id(id: &str) -> ::core::option::Option<Self> {
                match id {
                    #(#lang_from_id_arms,)*
                    _ => ::core::option::Option::None,
                }
            }

            pub fn from_browser_language(tag: &str) -> ::core::option::Option<Self> {
                let primary = tag.split('-').next().unwrap_or(tag);
                match primary {
                    #(#lang_from_browser_arms,)*
                    _ => ::core::option::Option::None,
                }
            }

            pub fn resolve(&self, key: TranslationKey, args: &[(&str, &str)]) -> ::std::string::String {
                match (*self, key) {
                    #(#resolve_arms)*
                }
            }

            pub fn template(&self, key: TranslationKey) -> &'static str {
                match (*self, key) {
                    #(#template_arms),*
                }
            }
        }
    };

    // TranslationKey
    let key_variants: Vec<proc_macro2::TokenStream> = flat_keys
        .iter()
        .map(|k| {
            let variant = &k.variant_name;
            quote! { #variant }
        })
        .collect();

    let translation_key_enum = quote! {
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
        pub enum TranslationKey {
            #(#key_variants),*
        }
    };

    let key_all_items: Vec<proc_macro2::TokenStream> = flat_keys
        .iter()
        .map(|k| {
            let variant = &k.variant_name;
            quote! { Self::#variant }
        })
        .collect();

    let key_str_arms: Vec<proc_macro2::TokenStream> = flat_keys
        .iter()
        .map(|k| {
            let variant = &k.variant_name;
            let key_lit = LitStr::new(&k.key_string, Span::call_site());
            quote! { Self::#variant => #key_lit }
        })
        .collect();

    let from_key_arms: Vec<proc_macro2::TokenStream> = flat_keys
        .iter()
        .map(|k| {
            let variant = &k.variant_name;
            let key_lit = LitStr::new(&k.key_string, Span::call_site());
            quote! { #key_lit => ::core::option::Option::Some(Self::#variant) }
        })
        .collect();

    let translation_key_impl = quote! {
        impl TranslationKey {
            pub const ALL: &[TranslationKey] = &[#(#key_all_items),*];

            pub fn key(&self) -> &'static str {
                match self { #(#key_str_arms),* }
            }

            pub fn from_key(key: &str) -> ::core::option::Option<Self> {
                match key {
                    #(#from_key_arms,)*
                    _ => ::core::option::Option::None,
                }
            }
        }
    };

    let tree_tokens = generate_tree_tokens(&input.keys, "");
    let translation_tree = quote! {
        pub static TRANSLATION_TREE: &[TranslationNode] = &[#tree_tokens];
    };

    let output = quote! {
        #builtin_lang_enum
        #builtin_lang_impl
        #translation_key_enum
        #translation_key_impl
        #translation_tree
    };

    output.into()
}
