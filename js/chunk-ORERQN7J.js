import{d as A,e as O,f as ce,g as ie,h as _,i as nt,j as St,k as Nt,l as Tt,m as yt,n as ve}from"./chunk-YDPF4UGR.js";import{t as _t}from"./chunk-F3BT2OCD.js";import{a as It}from"./chunk-OIFNSKKM.js";import{Q as st}from"./chunk-JGRP444H.js";import{a as ee,b as ge}from"./chunk-WGWCH7J2.js";import{f as Pe}from"./chunk-57YRCRKT.js";var we=Pe(St(),1),at=Pe(Nt(),1),it=Pe(Tt(),1),ct=Pe(yt(),1);we.default.extend(it.default);we.default.extend(ct.default);var kt={...at.default,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}},Pt=["January","February","March","April","May","June","July","August","September","October","November","December"];we.default.locale("en-web3-modal",kt);var Le={getMonthNameByIndex(e){return Pt[e]},getYear(e=new Date().toISOString()){return(0,we.default)(e).year()},getRelativeDateFromNow(e){return(0,we.default)(e).locale("en-web3-modal").fromNow(!0)},formatDate(e,t="DD MMM"){return(0,we.default)(e).format(t)}};var L={WC_NAME_SUFFIX:".reown.id",WC_NAME_SUFFIX_LEGACY:".wcn.id",BLOCKCHAIN_API_RPC_URL:"https://rpc.walletconnect.org",PULSE_API_URL:"https://pulse.walletconnect.org",W3M_API_URL:"https://api.web3modal.org",CONNECTOR_ID:{WALLET_CONNECT:"walletConnect",INJECTED:"injected",WALLET_STANDARD:"announced",COINBASE:"coinbaseWallet",COINBASE_SDK:"coinbaseWalletSDK",SAFE:"safe",LEDGER:"ledger",OKX:"okx",EIP6963:"eip6963",AUTH:"ID_AUTH"},CONNECTOR_NAMES:{AUTH:"Auth"},AUTH_CONNECTOR_SUPPORTED_CHAINS:["eip155","solana"],LIMITS:{PENDING_TRANSACTIONS:99},CHAIN:{EVM:"eip155",SOLANA:"solana",POLKADOT:"polkadot",BITCOIN:"bip122"},CHAIN_NAME_MAP:{eip155:"EVM Networks",solana:"Solana",polkadot:"Polkadot",bip122:"Bitcoin",cosmos:"Cosmos"},ADAPTER_TYPES:{BITCOIN:"bitcoin",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5"},USDT_CONTRACT_ADDRESSES:["0xdac17f958d2ee523a2206206994597c13d831ec7","0xc2132d05d31c914a87c6611c10748aeb04b58e8f","0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7","0x919C1c267BC06a7039e03fcc2eF738525769109c","0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e","0x55d398326f99059fF775485246999027B3197955","0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"],HTTP_STATUS_CODES:{SERVICE_UNAVAILABLE:503,FORBIDDEN:403},UNSUPPORTED_NETWORK_NAME:"Unknown Network",SECURE_SITE_SDK_ORIGIN:(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org"};var U={bigNumber(e){return e?new ve(e):new ve(0)},multiply(e,t){if(e===void 0||t===void 0)return new ve(0);let r=new ve(e),o=new ve(t);return r.times(o)},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})},parseLocalStringToNumber(e){return e===void 0?0:parseFloat(e.replace(/,/gu,""))}};var Rt={URLS:{FAQ:"https://walletconnect.com/faq"}};function te(e,t){return t==="light"?{"--w3m-accent":e?.["--w3m-accent"]||"hsla(231, 100%, 70%, 1)","--w3m-background":"#fff"}:{"--w3m-accent":e?.["--w3m-accent"]||"hsla(230, 100%, 67%, 1)","--w3m-background":"#121313"}}var qe={caipNetworkIdToNumber(e){return e?Number(e.split(":")[1]):void 0},parseEvmChainId(e){return typeof e=="string"?this.caipNetworkIdToNumber(e):e},getNetworksByNamespace(e,t){return e?.filter(r=>r.chainNamespace===t)||[]},getFirstNetworkByNamespace(e,t){return this.getNetworksByNamespace(e,t)[0]},getNetworkNameByCaipNetworkId(e,t){if(!t)return;let r=e.find(n=>n.caipNetworkId===t);if(r)return r.name;let[o]=t.split(":");return L.CHAIN_NAME_MAP?.[o]||void 0}};var Ot={numericInputKeyDown(e,t,r){let o=["Backspace","Meta","Ctrl","a","A","c","C","x","X","v","V","ArrowLeft","ArrowRight","Tab"],n=e.metaKey||e.ctrlKey,s=e.key,c=s.toLocaleLowerCase(),u=c==="a",d=c==="c",M=c==="v",T=c==="x",$=s===",",fe=s===".",Me=s>="0"&&s<="9";!n&&(u||d||M||T)&&e.preventDefault(),t==="0"&&!$&&!fe&&s==="0"&&e.preventDefault(),t==="0"&&Me&&(r(s),e.preventDefault()),($||fe)&&(t||(r("0."),e.preventDefault()),(t?.includes(".")||t?.includes(","))&&e.preventDefault()),!Me&&!o.includes(s)&&!fe&&!$&&e.preventDefault()}};var lt=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];var ut=[{type:"function",name:"approve",stateMutability:"nonpayable",inputs:[{name:"spender",type:"address"},{name:"amount",type:"uint256"}],outputs:[{type:"bool"}]}];var pt=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"sender",type:"address"},{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];var Ke={getERC20Abi:e=>L.USDT_CONTRACT_ADDRESSES.includes(e)?pt:lt,getSwapAbi:()=>ut};var Ut={validateCaipAddress(e){if(e.split(":")?.length!==3)throw new Error("Invalid CAIP Address");return e},parseCaipAddress(e){let t=e.split(":");if(t.length!==3)throw new Error(`Invalid CAIP-10 address: ${e}`);let[r,o,n]=t;if(!r||!o||!n)throw new Error(`Invalid CAIP-10 address: ${e}`);return{chainNamespace:r,chainId:o,address:n}},parseCaipNetworkId(e){let t=e.split(":");if(t.length!==2)throw new Error(`Invalid CAIP-2 network id: ${e}`);let[r,o]=t;if(!r||!o)throw new Error(`Invalid CAIP-2 network id: ${e}`);return{chainNamespace:r,chainId:o}}};var y={WALLET_ID:"@appkit/wallet_id",WALLET_NAME:"@appkit/wallet_name",SOLANA_WALLET:"@appkit/solana_wallet",SOLANA_CAIP_CHAIN:"@appkit/solana_caip_chain",ACTIVE_CAIP_NETWORK_ID:"@appkit/active_caip_network_id",CONNECTED_SOCIAL:"@appkit/connected_social",CONNECTED_SOCIAL_USERNAME:"@appkit-wallet/SOCIAL_USERNAME",RECENT_WALLETS:"@appkit/recent_wallets",DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",ACTIVE_NAMESPACE:"@appkit/active_namespace",CONNECTED_NAMESPACES:"@appkit/connected_namespaces",CONNECTION_STATUS:"@appkit/connection_status",SIWX_AUTH_TOKEN:"@appkit/siwx-auth-token",SIWX_NONCE_TOKEN:"@appkit/siwx-nonce-token",TELEGRAM_SOCIAL_PROVIDER:"@appkit/social_provider",NATIVE_BALANCE_CACHE:"@appkit/native_balance_cache",PORTFOLIO_CACHE:"@appkit/portfolio_cache",ENS_CACHE:"@appkit/ens_cache",IDENTITY_CACHE:"@appkit/identity_cache",PREFERRED_ACCOUNT_TYPES:"@appkit/preferred_account_types",CONNECTIONS:"@appkit/connections"};function Re(e){if(!e)throw new Error("Namespace is required for CONNECTED_CONNECTOR_ID");return`@appkit/${e}:connected_connector_id`}var v={setItem(e,t){Ce()&&t!==void 0&&localStorage.setItem(e,t)},getItem(e){if(Ce())return localStorage.getItem(e)||void 0},removeItem(e){Ce()&&localStorage.removeItem(e)},clear(){Ce()&&localStorage.clear()}};function Ce(){return typeof window<"u"&&typeof localStorage<"u"}var Dt=Pe(It());var Mt="wc",Lt="universal_provider",ho=`${Mt}@2:${Lt}:`,Bt="https://rpc.walletconnect.org/v1/";var fo=`${Bt}bundler`;var Ge=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org",Ve=[{label:"Coinbase",name:"coinbase",feeRange:"1-2%",url:"",supportedChains:["eip155"]},{label:"Meld.io",name:"meld",feeRange:"1-2%",url:"https://meldcrypto.com",supportedChains:["eip155","solana"]}],dt="WXETMuFUQmqqybHuRkSgxv:25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU",q={FOUR_MINUTES_MS:24e4,TEN_SEC_MS:1e4,FIVE_SEC_MS:5e3,THREE_SEC_MS:3e3,ONE_SEC_MS:1e3,SECURE_SITE:Ge,SECURE_SITE_DASHBOARD:`${Ge}/dashboard`,SECURE_SITE_FAVICON:`${Ge}/images/favicon.png`,RESTRICTED_TIMEZONES:["ASIA/SHANGHAI","ASIA/URUMQI","ASIA/CHONGQING","ASIA/HARBIN","ASIA/KASHGAR","ASIA/MACAU","ASIA/HONG_KONG","ASIA/MACAO","ASIA/BEIJING","ASIA/HARBIN"],WC_COINBASE_PAY_SDK_CHAINS:["ethereum","arbitrum","polygon","berachain","avalanche-c-chain","optimism","celo","base"],WC_COINBASE_PAY_SDK_FALLBACK_CHAIN:"ethereum",WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP:{Ethereum:"ethereum","Arbitrum One":"arbitrum",Polygon:"polygon",Berachain:"berachain",Avalanche:"avalanche-c-chain","OP Mainnet":"optimism",Celo:"celo",Base:"base"},WC_COINBASE_ONRAMP_APP_ID:"bf18c88d-495a-463b-b249-0b9d3656cf5e",SWAP_SUGGESTED_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP"],SWAP_POPULAR_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP","METAL","DAI","CHAMP","WOLF","SALE","BAL","BUSD","MUST","BTCpx","ROUTE","HEX","WELT","amDAI","VSQ","VISION","AURUM","pSP","SNX","VC","LINK","CHP","amUSDT","SPHERE","FOX","GIDDY","GFC","OMEN","OX_OLD","DE","WNT"],BALANCE_SUPPORTED_CHAINS:["eip155","solana"],SWAP_SUPPORTED_NETWORKS:["eip155:1","eip155:42161","eip155:10","eip155:324","eip155:8453","eip155:56","eip155:137","eip155:100","eip155:43114","eip155:250","eip155:8217","eip155:1313161554"],NAMES_SUPPORTED_CHAIN_NAMESPACES:["eip155"],ONRAMP_SUPPORTED_CHAIN_NAMESPACES:["eip155","solana"],ACTIVITY_ENABLED_CHAIN_NAMESPACES:["eip155"],NATIVE_TOKEN_ADDRESS:{eip155:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",solana:"So11111111111111111111111111111111111111111",polkadot:"0x",bip122:"0x",cosmos:"0x"},CONVERT_SLIPPAGE_TOLERANCE:1,CONNECT_LABELS:{MOBILE:"Open and continue in the wallet app",WEB:"Open and continue in the wallet app"},SEND_SUPPORTED_NAMESPACES:["eip155","solana"],DEFAULT_REMOTE_FEATURES:{swaps:["1inch"],onramp:["coinbase","meld"],email:!0,socials:["google","x","discord","farcaster","github","apple","facebook"],activity:!0,reownBranding:!0},DEFAULT_REMOTE_FEATURES_DISABLED:{email:!1,socials:!1,swaps:!1,onramp:!1,activity:!1,reownBranding:!1},DEFAULT_FEATURES:{receive:!0,send:!0,emailShowWallets:!0,connectorTypeOrder:["walletConnect","recent","injected","featured","custom","external","recommended"],analytics:!0,allWallets:!0,legalCheckbox:!1,smartSessions:!1,collapseWallets:!1,walletFeaturesOrder:["onramp","swaps","receive","send"],connectMethodsOrder:void 0,pay:!1},DEFAULT_SOCIALS:["google","x","farcaster","discord","apple","github","facebook"],DEFAULT_ACCOUNT_TYPES:{bip122:"payment",eip155:"smartAccount",polkadot:"eoa",solana:"eoa"},ADAPTER_TYPES:{UNIVERSAL:"universal",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5",BITCOIN:"bitcoin"}};var w={cacheExpiry:{portfolio:3e4,nativeBalance:3e4,ens:3e5,identity:3e5},isCacheExpired(e,t){return Date.now()-e>t},getActiveNetworkProps(){let e=w.getActiveNamespace(),t=w.getActiveCaipNetworkId(),r=t?t.split(":")[1]:void 0,o=r?isNaN(Number(r))?r:Number(r):void 0;return{namespace:e,caipNetworkId:t,chainId:o}},setWalletConnectDeepLink({name:e,href:t}){try{v.setItem(y.DEEPLINK_CHOICE,JSON.stringify({href:t,name:e}))}catch{console.info("Unable to set WalletConnect deep link")}},getWalletConnectDeepLink(){try{let e=v.getItem(y.DEEPLINK_CHOICE);if(e)return JSON.parse(e)}catch{console.info("Unable to get WalletConnect deep link")}},deleteWalletConnectDeepLink(){try{v.removeItem(y.DEEPLINK_CHOICE)}catch{console.info("Unable to delete WalletConnect deep link")}},setActiveNamespace(e){try{v.setItem(y.ACTIVE_NAMESPACE,e)}catch{console.info("Unable to set active namespace")}},setActiveCaipNetworkId(e){try{v.setItem(y.ACTIVE_CAIP_NETWORK_ID,e),w.setActiveNamespace(e.split(":")[0])}catch{console.info("Unable to set active caip network id")}},getActiveCaipNetworkId(){try{return v.getItem(y.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to get active caip network id");return}},deleteActiveCaipNetworkId(){try{v.removeItem(y.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to delete active caip network id")}},deleteConnectedConnectorId(e){try{let t=Re(e);v.removeItem(t)}catch{console.info("Unable to delete connected connector id")}},setAppKitRecent(e){try{let t=w.getRecentWallets();t.find(o=>o.id===e.id)||(t.unshift(e),t.length>2&&t.pop(),v.setItem(y.RECENT_WALLETS,JSON.stringify(t)))}catch{console.info("Unable to set AppKit recent")}},getRecentWallets(){try{let e=v.getItem(y.RECENT_WALLETS);return e?JSON.parse(e):[]}catch{console.info("Unable to get AppKit recent")}return[]},setConnectedConnectorId(e,t){try{let r=Re(e);v.setItem(r,t)}catch{console.info("Unable to set Connected Connector Id")}},getActiveNamespace(){try{return v.getItem(y.ACTIVE_NAMESPACE)}catch{console.info("Unable to get active namespace")}},getConnectedConnectorId(e){if(e)try{let t=Re(e);return v.getItem(t)}catch{console.info("Unable to get connected connector id in namespace ",e)}},setConnectedSocialProvider(e){try{v.setItem(y.CONNECTED_SOCIAL,e)}catch{console.info("Unable to set connected social provider")}},getConnectedSocialProvider(){try{return v.getItem(y.CONNECTED_SOCIAL)}catch{console.info("Unable to get connected social provider")}},deleteConnectedSocialProvider(){try{v.removeItem(y.CONNECTED_SOCIAL)}catch{console.info("Unable to delete connected social provider")}},getConnectedSocialUsername(){try{return v.getItem(y.CONNECTED_SOCIAL_USERNAME)}catch{console.info("Unable to get connected social username")}},getStoredActiveCaipNetworkId(){return v.getItem(y.ACTIVE_CAIP_NETWORK_ID)?.split(":")?.[1]},setConnectionStatus(e){try{v.setItem(y.CONNECTION_STATUS,e)}catch{console.info("Unable to set connection status")}},getConnectionStatus(){try{return v.getItem(y.CONNECTION_STATUS)}catch{return}},getConnectedNamespaces(){try{let e=v.getItem(y.CONNECTED_NAMESPACES);return e?.length?e.split(","):[]}catch{return[]}},setConnectedNamespaces(e){try{let t=Array.from(new Set(e));v.setItem(y.CONNECTED_NAMESPACES,t.join(","))}catch{console.info("Unable to set namespaces in storage")}},addConnectedNamespace(e){try{let t=w.getConnectedNamespaces();t.includes(e)||(t.push(e),w.setConnectedNamespaces(t))}catch{console.info("Unable to add connected namespace")}},removeConnectedNamespace(e){try{let t=w.getConnectedNamespaces(),r=t.indexOf(e);r>-1&&(t.splice(r,1),w.setConnectedNamespaces(t))}catch{console.info("Unable to remove connected namespace")}},getTelegramSocialProvider(){try{return v.getItem(y.TELEGRAM_SOCIAL_PROVIDER)}catch{return console.info("Unable to get telegram social provider"),null}},setTelegramSocialProvider(e){try{v.setItem(y.TELEGRAM_SOCIAL_PROVIDER,e)}catch{console.info("Unable to set telegram social provider")}},removeTelegramSocialProvider(){try{v.removeItem(y.TELEGRAM_SOCIAL_PROVIDER)}catch{console.info("Unable to remove telegram social provider")}},getBalanceCache(){let e={};try{let t=v.getItem(y.PORTFOLIO_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromBalanceCache(e){try{let t=w.getBalanceCache();v.setItem(y.PORTFOLIO_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getBalanceCacheForCaipAddress(e){try{let r=w.getBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.portfolio))return r.balance;w.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateBalanceCache(e){try{let t=w.getBalanceCache();t[e.caipAddress]=e,v.setItem(y.PORTFOLIO_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getNativeBalanceCache(){let e={};try{let t=v.getItem(y.NATIVE_BALANCE_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromNativeBalanceCache(e){try{let t=w.getBalanceCache();v.setItem(y.NATIVE_BALANCE_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getNativeBalanceCacheForCaipAddress(e){try{let r=w.getNativeBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.nativeBalance))return r;console.info("Discarding cache for address",e),w.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateNativeBalanceCache(e){try{let t=w.getNativeBalanceCache();t[e.caipAddress]=e,v.setItem(y.NATIVE_BALANCE_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getEnsCache(){let e={};try{let t=v.getItem(y.ENS_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get ens name cache")}return e},getEnsFromCacheForAddress(e){try{let r=w.getEnsCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.ens))return r.ens;w.removeEnsFromCache(e)}catch{console.info("Unable to get ens name from cache",e)}},updateEnsCache(e){try{let t=w.getEnsCache();t[e.address]=e,v.setItem(y.ENS_CACHE,JSON.stringify(t))}catch{console.info("Unable to update ens name cache",e)}},removeEnsFromCache(e){try{let t=w.getEnsCache();v.setItem(y.ENS_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove ens name from cache",e)}},getIdentityCache(){let e={};try{let t=v.getItem(y.IDENTITY_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get identity cache")}return e},getIdentityFromCacheForAddress(e){try{let r=w.getIdentityCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.identity))return r.identity;w.removeIdentityFromCache(e)}catch{console.info("Unable to get identity from cache",e)}},updateIdentityCache(e){try{let t=w.getIdentityCache();t[e.address]={identity:e.identity,timestamp:e.timestamp},v.setItem(y.IDENTITY_CACHE,JSON.stringify(t))}catch{console.info("Unable to update identity cache",e)}},removeIdentityFromCache(e){try{let t=w.getIdentityCache();v.setItem(y.IDENTITY_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove identity from cache",e)}},clearAddressCache(){try{v.removeItem(y.PORTFOLIO_CACHE),v.removeItem(y.NATIVE_BALANCE_CACHE),v.removeItem(y.ENS_CACHE),v.removeItem(y.IDENTITY_CACHE)}catch{console.info("Unable to clear address cache")}},setPreferredAccountTypes(e){try{v.setItem(y.PREFERRED_ACCOUNT_TYPES,JSON.stringify(e))}catch{console.info("Unable to set preferred account types",e)}},getPreferredAccountTypes(){try{let e=v.getItem(y.PREFERRED_ACCOUNT_TYPES);return e?JSON.parse(e):{}}catch{console.info("Unable to get preferred account types")}return{}},setConnections(e,t){try{let r={...w.getConnections(),[t]:e};v.setItem(y.CONNECTIONS,JSON.stringify(r))}catch(r){console.error("Unable to sync connections to storage",r)}},getConnections(){try{let e=v.getItem(y.CONNECTIONS);return e?JSON.parse(e):{}}catch(e){return console.error("Unable to get connections from storage",e),{}}}};var h={isMobile(){return this.isClient()?!!(typeof window?.matchMedia=="function"&&window?.matchMedia("(pointer:coarse)")?.matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)):!1},checkCaipNetwork(e,t=""){return e?.caipNetworkId.toLocaleLowerCase().includes(t.toLowerCase())},isAndroid(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return h.isMobile()&&e.includes("android")},isIos(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return e.includes("iphone")||e.includes("ipad")},isSafari(){return this.isClient()?(window?.navigator.userAgent.toLowerCase()).includes("safari"):!1},isClient(){return typeof window<"u"},isPairingExpired(e){return e?e-Date.now()<=q.TEN_SEC_MS:!0},isAllowedRetry(e,t=q.ONE_SEC_MS){return Date.now()-e>=t},copyToClopboard(e){navigator.clipboard.writeText(e)},isIframe(){try{return window?.self!==window?.top}catch{return!1}},isSafeApp(){if(h.isClient()&&window.self!==window.top)try{let e=window?.location?.ancestorOrigins?.[0],t="https://app.safe.global";if(e){let r=new URL(e),o=new URL(t);return r.hostname===o.hostname}}catch{return!1}return!1},getPairingExpiry(){return Date.now()+q.FOUR_MINUTES_MS},getNetworkId(e){return e?.split(":")[1]},getPlainAddress(e){return e?.split(":")[2]},async wait(e){return new Promise(t=>{setTimeout(t,e)})},debounce(e,t=500){let r;return(...o)=>{function n(){e(...o)}r&&clearTimeout(r),r=setTimeout(n,t)}},isHttpUrl(e){return e.startsWith("http://")||e.startsWith("https://")},formatNativeUrl(e,t,r=null){if(h.isHttpUrl(e))return this.formatUniversalUrl(e,t);let o=e,n=r;o.includes("://")||(o=e.replaceAll("/","").replaceAll(":",""),o=`${o}://`),o.endsWith("/")||(o=`${o}/`),n&&!n?.endsWith("/")&&(n=`${n}/`),this.isTelegram()&&this.isAndroid()&&(t=encodeURIComponent(t));let s=encodeURIComponent(t);return{redirect:`${o}wc?uri=${s}`,redirectUniversalLink:n?`${n}wc?uri=${s}`:void 0,href:o}},formatUniversalUrl(e,t){if(!h.isHttpUrl(e))return this.formatNativeUrl(e,t);let r=e;r.endsWith("/")||(r=`${r}/`);let o=encodeURIComponent(t);return{redirect:`${r}wc?uri=${o}`,href:r}},getOpenTargetForPlatform(e){return e==="popupWindow"?e:this.isTelegram()?w.getTelegramSocialProvider()?"_top":"_blank":e},openHref(e,t,r){window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},returnOpenHref(e,t,r){return window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},isTelegram(){return typeof window<"u"&&(!!window.TelegramWebviewProxy||!!window.Telegram||!!window.TelegramWebviewProxyProto)},isPWA(){if(typeof window>"u")return!1;let e=window.matchMedia?.("(display-mode: standalone)")?.matches,t=window?.navigator?.standalone;return!!(e||t)},async preloadImage(e){let t=new Promise((r,o)=>{let n=new Image;n.onload=r,n.onerror=o,n.crossOrigin="anonymous",n.src=e});return Promise.race([t,h.wait(2e3)])},formatBalance(e,t){let r="0.000";if(typeof e=="string"){let o=Number(e);if(o){let n=Math.floor(o*1e3)/1e3;n&&(r=n.toString())}}return`${r}${t?` ${t}`:""}`},formatBalance2(e,t){let r;if(e==="0")r="0";else if(typeof e=="string"){let o=Number(e);o&&(r=o.toString().match(/^-?\d+(?:\.\d{0,3})?/u)?.[0])}return{value:r??"0",rest:r==="0"?"000":"",symbol:t}},getApiUrl(){return L.W3M_API_URL},getBlockchainApiUrl(){return L.BLOCKCHAIN_API_RPC_URL},getAnalyticsUrl(){return L.PULSE_API_URL},getUUID(){return crypto?.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu,e=>{let t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})},parseError(e){return typeof e=="string"?e:typeof e?.issues?.[0]?.message=="string"?e.issues[0].message:e instanceof Error?e.message:"Unknown error"},sortRequestedNetworks(e,t=[]){let r={};return t&&e&&(e.forEach((o,n)=>{r[o]=n}),t.sort((o,n)=>{let s=r[o.id],c=r[n.id];return s!==void 0&&c!==void 0?s-c:s!==void 0?-1:c!==void 0?1:0})),t},calculateBalance(e){let t=0;for(let r of e)t+=r.value??0;return t},formatTokenBalance(e){let t=e.toFixed(2),[r,o]=t.split(".");return{dollars:r,pennies:o}},isAddress(e,t="eip155"){switch(t){case"eip155":if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)){if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)||/^(?:0x)?[0-9A-F]{40}$/iu.test(e))return!0}else return!1;return!1;case"solana":return/[1-9A-HJ-NP-Za-km-z]{32,44}$/iu.test(e);default:return!1}},uniqueBy(e,t){let r=new Set;return e.filter(o=>{let n=o[t];return r.has(n)?!1:(r.add(n),!0)})},generateSdkVersion(e,t,r){let n=e.length===0?q.ADAPTER_TYPES.UNIVERSAL:e.map(s=>s.adapterType).join(",");return`${t}-${n}-${r}`},createAccount(e,t,r,o,n){return{namespace:e,address:t,type:r,publicKey:o,path:n}},isCaipAddress(e){if(typeof e!="string")return!1;let t=e.split(":"),r=t[0];return t.filter(Boolean).length===3&&r in L.CHAIN_NAME_MAP},isMac(){let e=window?.navigator.userAgent.toLowerCase();return e.includes("macintosh")&&!e.includes("safari")},formatTelegramSocialLoginUrl(e){let t=`--${encodeURIComponent(window?.location.href)}`,r="state=";if(new URL(e).host==="auth.magic.link"){let n="provider_authorization_url=",s=e.substring(e.indexOf(n)+n.length),c=this.injectIntoUrl(decodeURIComponent(s),r,t);return e.replace(s,encodeURIComponent(c))}return this.injectIntoUrl(e,r,t)},injectIntoUrl(e,t,r){let o=e.indexOf(t);if(o===-1)throw new Error(`${t} parameter not found in the URL: ${e}`);let n=e.indexOf("&",o),s=t.length,c=n!==-1?n:e.length,u=e.substring(0,o+s),d=e.substring(o+s,c),M=e.substring(n),T=d+r;return u+T+M}};var mt={getFeatureValue(e,t){let r=t?.[e];return r===void 0?q.DEFAULT_FEATURES[e]:r},filterSocialsByPlatform(e){if(!e||!e.length)return e;if(h.isTelegram()){if(h.isIos())return e.filter(t=>t!=="google");if(h.isMac())return e.filter(t=>t!=="x");if(h.isAndroid())return e.filter(t=>!["facebook","x"].includes(t))}return e}};var f=A({features:q.DEFAULT_FEATURES,projectId:"",sdkType:"appkit",sdkVersion:"html-wagmi-undefined",defaultAccountTypes:q.DEFAULT_ACCOUNT_TYPES,enableNetworkSwitch:!0,experimental_preferUniversalLinks:!1,remoteFeatures:{}}),S={state:f,subscribeKey(e,t){return _(f,e,t)},setOptions(e){Object.assign(f,e)},setRemoteFeatures(e){if(!e)return;let t={...f.remoteFeatures,...e};f.remoteFeatures=t,f.remoteFeatures?.socials&&(f.remoteFeatures.socials=mt.filterSocialsByPlatform(f.remoteFeatures.socials))},setFeatures(e){if(!e)return;f.features||(f.features=q.DEFAULT_FEATURES);let t={...f.features,...e};f.features=t},setProjectId(e){f.projectId=e},setCustomRpcUrls(e){f.customRpcUrls=e},setAllWallets(e){f.allWallets=e},setIncludeWalletIds(e){f.includeWalletIds=e},setExcludeWalletIds(e){f.excludeWalletIds=e},setFeaturedWalletIds(e){f.featuredWalletIds=e},setTokens(e){f.tokens=e},setTermsConditionsUrl(e){f.termsConditionsUrl=e},setPrivacyPolicyUrl(e){f.privacyPolicyUrl=e},setCustomWallets(e){f.customWallets=e},setIsSiweEnabled(e){f.isSiweEnabled=e},setIsUniversalProvider(e){f.isUniversalProvider=e},setSdkVersion(e){f.sdkVersion=e},setMetadata(e){f.metadata=e},setDisableAppend(e){f.disableAppend=e},setEIP6963Enabled(e){f.enableEIP6963=e},setDebug(e){f.debug=e},setEnableWalletConnect(e){f.enableWalletConnect=e},setEnableWalletGuide(e){f.enableWalletGuide=e},setEnableAuthLogger(e){f.enableAuthLogger=e},setEnableWallets(e){f.enableWallets=e},setPreferUniversalLinks(e){f.experimental_preferUniversalLinks=e},setHasMultipleAddresses(e){f.hasMultipleAddresses=e},setSIWX(e){f.siwx=e},setConnectMethodsOrder(e){f.features={...f.features,connectMethodsOrder:e}},setWalletFeaturesOrder(e){f.features={...f.features,walletFeaturesOrder:e}},setSocialsOrder(e){f.remoteFeatures={...f.remoteFeatures,socials:e}},setCollapseWallets(e){f.features={...f.features,collapseWallets:e}},setEnableEmbedded(e){f.enableEmbedded=e},setAllowUnsupportedChain(e){f.allowUnsupportedChain=e},setManualWCControl(e){f.manualWCControl=e},setEnableNetworkSwitch(e){f.enableNetworkSwitch=e},setDefaultAccountTypes(e={}){Object.entries(e).forEach(([t,r])=>{r&&(f.defaultAccountTypes[t]=r)})},setUniversalProviderConfigOverride(e){f.universalProviderConfigOverride=e},getUniversalProviderConfigOverride(){return f.universalProviderConfigOverride},getSnapshot(){return ce(f)}};async function Oe(...e){let t=await fetch(...e);if(!t.ok)throw new Error(`HTTP status code: ${t.status}`,{cause:t});return t}var ne=class{constructor({baseUrl:t,clientId:r}){this.baseUrl=t,this.clientId=r}async get({headers:t,signal:r,cache:o,...n}){let s=this.createUrl(n);return(await Oe(s,{method:"GET",headers:t,signal:r,cache:o})).json()}async getBlob({headers:t,signal:r,...o}){let n=this.createUrl(o);return(await Oe(n,{method:"GET",headers:t,signal:r})).blob()}async post({body:t,headers:r,signal:o,...n}){let s=this.createUrl(n);return(await Oe(s,{method:"POST",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async put({body:t,headers:r,signal:o,...n}){let s=this.createUrl(n);return(await Oe(s,{method:"PUT",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async delete({body:t,headers:r,signal:o,...n}){let s=this.createUrl(n);return(await Oe(s,{method:"DELETE",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}createUrl({path:t,params:r}){let o=new URL(t,this.baseUrl);return r&&Object.entries(r).forEach(([n,s])=>{s&&o.searchParams.append(n,s)}),this.clientId&&o.searchParams.append("clientId",this.clientId),o}};var Ft=Object.freeze({enabled:!0,events:[]}),Ht=new ne({baseUrl:h.getAnalyticsUrl(),clientId:null}),Wt=5,$t=60*1e3,de=A({...Ft}),ht={state:de,subscribeKey(e,t){return _(de,e,t)},async sendError(e,t){if(!de.enabled)return;let r=Date.now();if(de.events.filter(s=>{let c=new Date(s.properties.timestamp||"").getTime();return r-c<$t}).length>=Wt)return;let n={type:"error",event:t,properties:{errorType:e.name,errorMessage:e.message,stackTrace:e.stack,timestamp:new Date().toISOString()}};de.events.push(n);try{if(typeof window>"u")return;let{projectId:s,sdkType:c,sdkVersion:u}=S.state;await Ht.post({path:"/e",params:{projectId:s,st:c,sv:u||"html-wagmi-4.2.2"},body:{eventId:h.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:new Date().toISOString(),props:{type:"error",event:t,errorType:e.name,errorMessage:e.message,stackTrace:e.stack}}})}catch{}},enable(){de.enabled=!0},disable(){de.enabled=!1},clearEvents(){de.events=[]}};var Se=class e extends Error{constructor(t,r,o){super(t),this.name="AppKitError",this.category=r,this.originalError=o,Object.setPrototypeOf(this,e.prototype);let n=!1;if(o instanceof Error&&typeof o.stack=="string"&&o.stack){let s=o.stack,c=s.indexOf(`
`);if(c>-1){let u=s.substring(c+1);this.stack=`${this.name}: ${this.message}
${u}`,n=!0}}n||(Error.captureStackTrace?Error.captureStackTrace(this,e):this.stack||(this.stack=`${this.name}: ${this.message}`))}};function ft(e,t){let r=e instanceof Se?e:new Se(e instanceof Error?e.message:String(e),t,e);throw ht.sendError(r,r.category),r}function x(e,t="INTERNAL_SDK_ERROR"){let r={};return Object.keys(e).forEach(o=>{let n=e[o];if(typeof n=="function"){let s=n;n.constructor.name==="AsyncFunction"?s=async(...c)=>{try{return await n(...c)}catch(u){return ft(u,t)}}:s=(...c)=>{try{return n(...c)}catch(u){return ft(u,t)}},r[o]=s}else r[o]=n}),r}var Q=A({walletImages:{},networkImages:{},chainImages:{},connectorImages:{},tokenImages:{},currencyImages:{}}),jt={state:Q,subscribeNetworkImages(e){return O(Q.networkImages,()=>e(Q.networkImages))},subscribeKey(e,t){return _(Q,e,t)},subscribe(e){return O(Q,()=>e(Q))},setWalletImage(e,t){Q.walletImages[e]=t},setNetworkImage(e,t){Q.networkImages[e]=t},setChainImage(e,t){Q.chainImages[e]=t},setConnectorImage(e,t){Q.connectorImages={...Q.connectorImages,[e]:t}},setTokenImage(e,t){Q.tokenImages[e]=t},setCurrencyImage(e,t){Q.currencyImages[e]=t}},z=x(jt);var se={PHANTOM:{id:"a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",url:"https://phantom.app"},SOLFLARE:{id:"1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79",url:"https://solflare.com"},COINBASE:{id:"fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",url:"https://go.cb-w.com"}},gt={handleMobileDeeplinkRedirect(e,t){let r=window.location.href,o=encodeURIComponent(r);if(e===se.PHANTOM.id&&!("phantom"in window)){let n=r.startsWith("https")?"https":"http",s=r.split("/")[2],c=encodeURIComponent(`${n}://${s}`);window.location.href=`${se.PHANTOM.url}/ul/browse/${o}?ref=${c}`}e===se.SOLFLARE.id&&!("solflare"in window)&&(window.location.href=`${se.SOLFLARE.url}/ul/v1/browse/${o}?ref=${o}`),t===L.CHAIN.SOLANA&&e===se.COINBASE.id&&!("coinbaseSolana"in window)&&(window.location.href=`${se.COINBASE.url}/dapp?cb_url=${o}`)}};var be=Object.freeze({message:"",variant:"success",svg:void 0,open:!1,autoClose:!0}),G=A({...be}),qt={state:G,subscribeKey(e,t){return _(G,e,t)},showLoading(e,t={}){this._showMessage({message:e,variant:"loading",...t})},showSuccess(e){this._showMessage({message:e,variant:"success"})},showSvg(e,t){this._showMessage({message:e,svg:t})},showError(e){let t=h.parseError(e);this._showMessage({message:t,variant:"error"})},hide(){G.message=be.message,G.variant=be.variant,G.svg=be.svg,G.open=be.open,G.autoClose=be.autoClose},_showMessage({message:e,svg:t,variant:r="success",autoClose:o=be.autoClose}){G.open?(G.open=!1,setTimeout(()=>{G.message=e,G.variant=r,G.svg=t,G.open=!0,G.autoClose=o},150)):(G.message=e,G.variant=r,G.svg=t,G.open=!0,G.autoClose=o)}},F=qt;var Kt={purchaseCurrencies:[{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"Ether",symbol:"ETH",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]}],paymentCurrencies:[{id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},{id:"EUR",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]}]},wt=h.getBlockchainApiUrl(),Y=A({clientId:null,api:new ne({baseUrl:wt,clientId:null}),supportedChains:{http:[],ws:[]}}),p={state:Y,async get(e){let{st:t,sv:r}=p.getSdkProperties(),o=S.state.projectId,n={...e.params||{},st:t,sv:r,projectId:o};return Y.api.get({...e,params:n})},getSdkProperties(){let{sdkType:e,sdkVersion:t}=S.state;return{st:e||"unknown",sv:t||"unknown"}},async isNetworkSupported(e){if(!e)return!1;try{Y.supportedChains.http.length||await p.getSupportedNetworks()}catch{return!1}return Y.supportedChains.http.includes(e)},async getSupportedNetworks(){try{let e=await p.get({path:"v1/supported-chains"});return Y.supportedChains=e,e}catch{return Y.supportedChains}},async fetchIdentity({address:e,caipNetworkId:t}){if(!await p.isNetworkSupported(t))return{avatar:"",name:""};let o=w.getIdentityFromCacheForAddress(e);if(o)return o;let n=await p.get({path:`/v1/identity/${e}`,params:{sender:a.state.activeCaipAddress?h.getPlainAddress(a.state.activeCaipAddress):void 0}});return w.updateIdentityCache({address:e,identity:n,timestamp:Date.now()}),n},async fetchTransactions({account:e,cursor:t,onramp:r,signal:o,cache:n,chainId:s}){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?p.get({path:`/v1/account/${e}/history`,params:{cursor:t,onramp:r,chainId:s},signal:o,cache:n}):{data:[],next:void 0}},async fetchSwapQuote({amount:e,userAddress:t,from:r,to:o,gasPrice:n}){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?p.get({path:"/v1/convert/quotes",headers:{"Content-Type":"application/json"},params:{amount:e,userAddress:t,from:r,to:o,gasPrice:n}}):{quotes:[]}},async fetchSwapTokens({chainId:e}){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?p.get({path:"/v1/convert/tokens",params:{chainId:e}}):{tokens:[]}},async fetchTokenPrice({addresses:e}){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?Y.api.post({path:"/v1/fungible/price",body:{currency:"usd",addresses:e,projectId:S.state.projectId},headers:{"Content-Type":"application/json"}}):{fungibles:[]}},async fetchSwapAllowance({tokenAddress:e,userAddress:t}){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?p.get({path:"/v1/convert/allowance",params:{tokenAddress:e,userAddress:t},headers:{"Content-Type":"application/json"}}):{allowance:"0"}},async fetchGasPrice({chainId:e}){let{st:t,sv:r}=p.getSdkProperties();if(!await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Gas Price");return p.get({path:"/v1/convert/gas-price",headers:{"Content-Type":"application/json"},params:{chainId:e,st:t,sv:r}})},async generateSwapCalldata({amount:e,from:t,to:r,userAddress:o,disableEstimate:n}){if(!await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return Y.api.post({path:"/v1/convert/build-transaction",headers:{"Content-Type":"application/json"},body:{amount:e,eip155:{slippage:q.CONVERT_SLIPPAGE_TOLERANCE},projectId:S.state.projectId,from:t,to:r,userAddress:o,disableEstimate:n}})},async generateApproveCalldata({from:e,to:t,userAddress:r}){let{st:o,sv:n}=p.getSdkProperties();if(!await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return p.get({path:"/v1/convert/build-approve",headers:{"Content-Type":"application/json"},params:{userAddress:r,from:e,to:t,st:o,sv:n}})},async getBalance(e,t,r){let{st:o,sv:n}=p.getSdkProperties();if(!await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))return F.showError("Token Balance Unavailable"),{balances:[]};let c=`${t}:${e}`,u=w.getBalanceCacheForCaipAddress(c);if(u)return u;let d=await p.get({path:`/v1/account/${e}/balance`,params:{currency:"usd",chainId:t,forceUpdate:r,st:o,sv:n}});return w.updateBalanceCache({caipAddress:c,balance:d,timestamp:Date.now()}),d},async lookupEnsName(e){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?p.get({path:`/v1/profile/account/${e}`,params:{apiVersion:"2"}}):{addresses:{},attributes:[]}},async reverseLookupEnsName({address:e}){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?p.get({path:`/v1/profile/reverse/${e}`,params:{sender:N.state.address,apiVersion:"2"}}):[]},async getEnsNameSuggestions(e){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?p.get({path:`/v1/profile/suggestions/${e}`,params:{zone:"reown.id"}}):{suggestions:[]}},async registerEnsName({coinType:e,address:t,message:r,signature:o}){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?Y.api.post({path:"/v1/profile/account",body:{coin_type:e,address:t,message:r,signature:o},headers:{"Content-Type":"application/json"}}):{success:!1}},async generateOnRampURL({destinationWallets:e,partnerUserId:t,defaultNetwork:r,purchaseAmount:o,paymentAmount:n}){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?(await Y.api.post({path:"/v1/generators/onrampurl",params:{projectId:S.state.projectId},body:{destinationWallets:e,defaultNetwork:r,partnerUserId:t,defaultExperience:"buy",presetCryptoAmount:o,presetFiatAmount:n}})).url:""},async getOnrampOptions(){if(!await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))return{paymentCurrencies:[],purchaseCurrencies:[]};try{return await p.get({path:"/v1/onramp/options"})}catch{return Kt}},async getOnrampQuote({purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}){try{return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?await Y.api.post({path:"/v1/onramp/quote",params:{projectId:S.state.projectId},body:{purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}}):null}catch{return{coinbaseFee:{amount:r,currency:t.id},networkFee:{amount:r,currency:t.id},paymentSubtotal:{amount:r,currency:t.id},paymentTotal:{amount:r,currency:t.id},purchaseAmount:{amount:r,currency:t.id},quoteId:"mocked-quote-id"}}},async getSmartSessions(e){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?p.get({path:`/v1/sessions/${e}`}):[]},async revokeSmartSession(e,t,r){return await p.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?Y.api.post({path:`/v1/sessions/${e}/revoke`,params:{projectId:S.state.projectId},body:{pci:t,signature:r}}):{success:!1}},setClientId(e){Y.clientId=e,Y.api=new ne({baseUrl:wt,clientId:e})}};var re=A({currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[]}),Gt={state:re,replaceState(e){e&&Object.assign(re,ie(e))},subscribe(e){return a.subscribeChainProp("accountState",t=>{if(t)return e(t)})},subscribeKey(e,t,r){let o;return a.subscribeChainProp("accountState",n=>{if(n){let s=n[e];o!==s&&(o=s,t(s))}},r)},setStatus(e,t){a.setAccountProp("status",e,t)},getCaipAddress(e){return a.getAccountProp("caipAddress",e)},setCaipAddress(e,t){let r=e?h.getPlainAddress(e):void 0;t===a.state.activeChain&&(a.state.activeCaipAddress=e),a.setAccountProp("caipAddress",e,t),a.setAccountProp("address",r,t)},setBalance(e,t,r){a.setAccountProp("balance",e,r),a.setAccountProp("balanceSymbol",t,r)},setProfileName(e,t){a.setAccountProp("profileName",e,t)},setProfileImage(e,t){a.setAccountProp("profileImage",e,t)},setUser(e,t){a.setAccountProp("user",e,t)},setAddressExplorerUrl(e,t){a.setAccountProp("addressExplorerUrl",e,t)},setSmartAccountDeployed(e,t){a.setAccountProp("smartAccountDeployed",e,t)},setCurrentTab(e){a.setAccountProp("currentTab",e,a.state.activeChain)},setTokenBalance(e,t){e&&a.setAccountProp("tokenBalance",e,t)},setShouldUpdateToAddress(e,t){a.setAccountProp("shouldUpdateToAddress",e,t)},setAllAccounts(e,t){a.setAccountProp("allAccounts",e,t)},addAddressLabel(e,t,r){let o=a.getAccountProp("addressLabels",r)||new Map;o.set(e,t),a.setAccountProp("addressLabels",o,r)},removeAddressLabel(e,t){let r=a.getAccountProp("addressLabels",t)||new Map;r.delete(e),a.setAccountProp("addressLabels",r,t)},setConnectedWalletInfo(e,t){a.setAccountProp("connectedWalletInfo",e,t,!1)},setPreferredAccountType(e,t){a.setAccountProp("preferredAccountTypes",{...re.preferredAccountTypes,[t]:e},t)},setPreferredAccountTypes(e){re.preferredAccountTypes=e},setSocialProvider(e,t){e&&a.setAccountProp("socialProvider",e,t)},setSocialWindow(e,t){a.setAccountProp("socialWindow",e?ie(e):void 0,t)},setFarcasterUrl(e,t){a.setAccountProp("farcasterUrl",e,t)},async fetchTokenBalance(e){re.balanceLoading=!0;let t=a.state.activeCaipNetwork?.caipNetworkId,r=a.state.activeCaipNetwork?.chainNamespace,o=a.state.activeCaipAddress,n=o?h.getPlainAddress(o):void 0;if(re.lastRetry&&!h.isAllowedRetry(re.lastRetry,30*q.ONE_SEC_MS))return re.balanceLoading=!1,[];try{if(n&&t&&r){let c=(await p.getBalance(n,t)).balances.filter(u=>u.quantity.decimals!=="0");return N.setTokenBalance(c,r),re.lastRetry=void 0,re.balanceLoading=!1,c}}catch(s){re.lastRetry=Date.now(),e?.(s),F.showError("Token Balance Unavailable")}finally{re.balanceLoading=!1}return[]},resetAccount(e){a.resetAccount(e)}},N=x(Gt);var ze={onSwitchNetwork({network:e,ignoreSwitchConfirmation:t=!1}){let r=a.state.activeCaipNetwork,o=m.state.data;if(e.id===r?.id)return;let s=N.getCaipAddress(a.state.activeChain),c=e.chainNamespace!==a.state.activeChain,u=N.getCaipAddress(e.chainNamespace),M=C.getConnectorId(a.state.activeChain)===L.CONNECTOR_ID.AUTH,T=L.AUTH_CONNECTOR_SUPPORTED_CHAINS.find($=>$===e.chainNamespace);t||M&&T?m.push("SwitchNetwork",{...o,network:e}):s&&c&&!u?m.push("SwitchActiveChain",{switchToChain:e.chainNamespace,navigateTo:"Connect",navigateWithReplace:!0,network:e}):m.push("SwitchNetwork",{...o,network:e})}};var me=A({message:"",variant:"info",open:!1}),Vt={state:me,subscribeKey(e,t){return _(me,e,t)},open(e,t){let{debug:r}=S.state,{shortMessage:o,longMessage:n}=e;r&&(me.message=o,me.variant=t,me.open=!0),n&&console.error(typeof n=="function"?n():n)},close(){me.open=!1,me.message="",me.variant="info"}},Ue=x(Vt);var zt=h.getAnalyticsUrl(),Yt=new ne({baseUrl:zt,clientId:null}),Xt=["MODAL_CREATED"],le=A({timestamp:Date.now(),reportedErrors:{},data:{type:"track",event:"MODAL_CREATED"}}),D={state:le,subscribe(e){return O(le,()=>e(le))},getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=S.state;return{projectId:e,st:t,sv:r||"html-wagmi-4.2.2"}},async _sendAnalyticsEvent(e){try{let t=N.state.address;if(Xt.includes(e.data.event)||typeof window>"u")return;await Yt.post({path:"/e",params:D.getSdkProperties(),body:{eventId:h.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:e.timestamp,props:{...e.data,address:t}}}),le.reportedErrors.FORBIDDEN=!1}catch(t){t instanceof Error&&t.cause instanceof Response&&t.cause.status===L.HTTP_STATUS_CODES.FORBIDDEN&&!le.reportedErrors.FORBIDDEN&&(Ue.open({shortMessage:"Invalid App Configuration",longMessage:`Origin ${Ce()?window.origin:"uknown"} not found on Allowlist - update configuration on cloud.reown.com`},"error"),le.reportedErrors.FORBIDDEN=!0)}},sendEvent(e){le.timestamp=Date.now(),le.data=e,S.state.features?.analytics&&D._sendAnalyticsEvent(le)}};var Ne=A({loading:!1,open:!1,selectedNetworkId:void 0,activeChain:void 0,initialized:!1}),he={state:Ne,subscribe(e){return O(Ne,()=>e(Ne))},subscribeOpen(e){return _(Ne,"open",e)},set(e){Object.assign(Ne,{...Ne,...e})}};var X=A({loading:!1,loadingNamespaceMap:new Map,open:!1,shake:!1,namespace:void 0}),Jt={state:X,subscribe(e){return O(X,()=>e(X))},subscribeKey(e,t){return _(X,e,t)},async open(e){let t=N.state.status==="connected",r=e?.namespace,o=a.state.activeChain,n=r&&r!==o,s=a.getAccountData(e?.namespace)?.caipAddress;if(g.state.wcBasic?E.prefetch({fetchNetworkImages:!1,fetchConnectorImages:!1}):await E.prefetch({fetchConnectorImages:!t,fetchFeaturedWallets:!t,fetchRecommendedWallets:!t}),C.setFilterByNamespace(e?.namespace),K.setLoading(!0,r),r&&n){let c=a.getNetworkData(r)?.caipNetwork||a.getRequestedCaipNetworks(r)[0];c&&ze.onSwitchNetwork({network:c,ignoreSwitchConfirmation:!0})}else{let c=a.state.noAdapters;S.state.manualWCControl||c&&!s?h.isMobile()?m.reset("AllWallets"):m.reset("ConnectingWalletConnectBasic"):e?.view?m.reset(e.view,e.data):s?m.reset("Account"):m.reset("Connect")}X.open=!0,he.set({open:!0}),D.sendEvent({type:"track",event:"MODAL_OPEN",properties:{connected:!!s}})},close(){let e=S.state.enableEmbedded,t=!!a.state.activeCaipAddress;X.open&&D.sendEvent({type:"track",event:"MODAL_CLOSE",properties:{connected:t}}),X.open=!1,m.reset("Connect"),K.clearLoading(),e?t?m.replace("Account"):m.push("Connect"):he.set({open:!1}),g.resetUri()},setLoading(e,t){t&&X.loadingNamespaceMap.set(t,e),X.loading=e,he.set({loading:e})},clearLoading(){X.loadingNamespaceMap.clear(),X.loading=!1},shake(){X.shake||(X.shake=!0,setTimeout(()=>{X.shake=!1},500))}},K=x(Jt);var H=A({view:"Connect",history:["Connect"],transactionStack:[]}),Qt={state:H,subscribeKey(e,t){return _(H,e,t)},pushTransactionStack(e){H.transactionStack.push(e)},popTransactionStack(e){let t=H.transactionStack.pop();if(!t)return;let{onSuccess:r,onError:o,onCancel:n}=t;switch(e){case"success":r?.();break;case"error":o?.(),m.goBack();break;case"cancel":n?.(),m.goBack();break;default:}},push(e,t){e!==H.view&&(H.view=e,H.history.push(e),H.data=t)},reset(e,t){H.view=e,H.history=[e],H.data=t},replace(e,t){H.history.at(-1)===e||(H.view=e,H.history[H.history.length-1]=e,H.data=t)},goBack(){let e=a.state.activeCaipAddress,t=m.state.view==="ConnectingFarcaster",r=!e&&t;if(H.history.length>1){H.history.pop();let[o]=H.history.slice(-1);o&&(e&&o==="Connect"?H.view="Account":H.view=o)}else K.close();H.data?.wallet&&(H.data.wallet=void 0),setTimeout(()=>{if(r){N.setFarcasterUrl(void 0,a.state.activeChain);let o=C.getAuthConnector();o?.provider?.reload();let n=ce(S.state);o?.provider?.syncDappData?.({metadata:n.metadata,sdkVersion:n.sdkVersion,projectId:n.projectId,sdkType:n.sdkType})}},100)},goBackToIndex(e){if(H.history.length>1){H.history=H.history.slice(0,e+1);let[t]=H.history.slice(-1);t&&(H.view=t)}},goBackOrCloseModal(){m.state.history.length>1?m.goBack():K.close()}},m=x(Qt);var ue=A({themeMode:"dark",themeVariables:{},w3mThemeVariables:void 0}),Ye={state:ue,subscribe(e){return O(ue,()=>e(ue))},setThemeMode(e){ue.themeMode=e;try{let t=C.getAuthConnector();if(t){let r=Ye.getSnapshot().themeVariables;t.provider.syncTheme({themeMode:e,themeVariables:r,w3mThemeVariables:te(r,e)})}}catch{console.info("Unable to sync theme to auth connector")}},setThemeVariables(e){ue.themeVariables={...ue.themeVariables,...e};try{let t=C.getAuthConnector();if(t){let r=Ye.getSnapshot().themeVariables;t.provider.syncTheme({themeVariables:r,w3mThemeVariables:te(ue.themeVariables,ue.themeMode)})}}catch{console.info("Unable to sync theme to auth connector")}},getSnapshot(){return ce(ue)}},Te=x(Ye);var Ct={eip155:void 0,solana:void 0,polkadot:void 0,bip122:void 0,cosmos:void 0},P=A({allConnectors:[],connectors:[],activeConnector:void 0,filterByNamespace:void 0,activeConnectorIds:{...Ct},filterByNamespaceMap:{eip155:!0,solana:!0,polkadot:!0,bip122:!0,cosmos:!0}}),Zt={state:P,subscribe(e){return O(P,()=>{e(P)})},subscribeKey(e,t){return _(P,e,t)},initialize(e){e.forEach(t=>{let r=w.getConnectedConnectorId(t);r&&C.setConnectorId(r,t)})},setActiveConnector(e){e&&(P.activeConnector=ie(e))},setConnectors(e){e.filter(n=>!P.allConnectors.some(s=>s.id===n.id&&C.getConnectorName(s.name)===C.getConnectorName(n.name)&&s.chain===n.chain)).forEach(n=>{n.type!=="MULTI_CHAIN"&&P.allConnectors.push(ie(n))});let r=C.getEnabledNamespaces(),o=C.getEnabledConnectors(r);P.connectors=C.mergeMultiChainConnectors(o)},filterByNamespaces(e){Object.keys(P.filterByNamespaceMap).forEach(t=>{P.filterByNamespaceMap[t]=!1}),e.forEach(t=>{P.filterByNamespaceMap[t]=!0}),C.updateConnectorsForEnabledNamespaces()},filterByNamespace(e,t){P.filterByNamespaceMap[e]=t,C.updateConnectorsForEnabledNamespaces()},updateConnectorsForEnabledNamespaces(){let e=C.getEnabledNamespaces(),t=C.getEnabledConnectors(e),r=C.areAllNamespacesEnabled();P.connectors=C.mergeMultiChainConnectors(t),r?E.clearFilterByNamespaces():E.filterByNamespaces(e)},getEnabledNamespaces(){return Object.entries(P.filterByNamespaceMap).filter(([e,t])=>t).map(([e])=>e)},getEnabledConnectors(e){return P.allConnectors.filter(t=>e.includes(t.chain))},areAllNamespacesEnabled(){return Object.values(P.filterByNamespaceMap).every(e=>e)},mergeMultiChainConnectors(e){let t=C.generateConnectorMapByName(e),r=[];return t.forEach(o=>{let n=o[0],s=n?.id===L.CONNECTOR_ID.AUTH;o.length>1&&n?r.push({name:n.name,imageUrl:n.imageUrl,imageId:n.imageId,connectors:[...o],type:s?"AUTH":"MULTI_CHAIN",chain:"eip155",id:n?.id||""}):n&&r.push(n)}),r},generateConnectorMapByName(e){let t=new Map;return e.forEach(r=>{let{name:o}=r,n=C.getConnectorName(o);if(!n)return;let s=t.get(n)||[];s.find(u=>u.chain===r.chain)||s.push(r),t.set(n,s)}),t},getConnectorName(e){return e&&({"Trust Wallet":"Trust"}[e]||e)},getUniqueConnectorsByName(e){let t=[];return e.forEach(r=>{t.find(o=>o.chain===r.chain)||t.push(r)}),t},addConnector(e){if(e.id===L.CONNECTOR_ID.AUTH){let t=e,r=ce(S.state),o=Te.getSnapshot().themeMode,n=Te.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType}),t?.provider?.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:te(n,o)}),C.setConnectors([e])}else C.setConnectors([e])},getAuthConnector(e){let t=e||a.state.activeChain,r=P.connectors.find(o=>o.id===L.CONNECTOR_ID.AUTH);if(r)return r?.connectors?.length?r.connectors.find(n=>n.chain===t):r},getAnnouncedConnectorRdns(){return P.connectors.filter(e=>e.type==="ANNOUNCED").map(e=>e.info?.rdns)},getConnectorById(e){return P.allConnectors.find(t=>t.id===e)},getConnector(e,t){return P.allConnectors.filter(o=>o.chain===a.state.activeChain).find(o=>o.explorerId===e||o.info?.rdns===t)},syncIfAuthConnector(e){if(e.id!=="ID_AUTH")return;let t=e,r=ce(S.state),o=Te.getSnapshot().themeMode,n=Te.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,sdkType:r.sdkType,projectId:r.projectId}),t.provider.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:te(n,o)})},getConnectorsByNamespace(e){let t=P.allConnectors.filter(r=>r.chain===e);return C.mergeMultiChainConnectors(t)},selectWalletConnector(e){let t=C.getConnector(e.id,e.rdns),r=a.state.activeChain;gt.handleMobileDeeplinkRedirect(t?.explorerId||e.id,r),t?m.push("ConnectingExternal",{connector:t}):m.push("ConnectingWalletConnect",{wallet:e})},getConnectors(e){return e?C.getConnectorsByNamespace(e):C.mergeMultiChainConnectors(P.allConnectors)},setFilterByNamespace(e){P.filterByNamespace=e,P.connectors=C.getConnectors(e),E.setFilterByNamespace(e)},setConnectorId(e,t){e&&(P.activeConnectorIds={...P.activeConnectorIds,[t]:e},w.setConnectedConnectorId(t,e))},removeConnectorId(e){P.activeConnectorIds={...P.activeConnectorIds,[e]:void 0},w.deleteConnectedConnectorId(e)},getConnectorId(e){if(e)return P.activeConnectorIds[e]},isConnected(e){return e?!!P.activeConnectorIds[e]:Object.values(P.activeConnectorIds).some(t=>!!t)},resetConnectorIds(){P.activeConnectorIds={...Ct}}},C=x(Zt);var er="https://secure.walletconnect.org/sdk",Ts=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_SDK_URL:void 0)||er,ys=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_DEFAULT_LOG_LEVEL:void 0)||"error",Is=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_SDK_VERSION:void 0)||"4",_s={APP_EVENT_KEY:"@w3m-app/",FRAME_EVENT_KEY:"@w3m-frame/",RPC_METHOD_KEY:"RPC_",STORAGE_KEY:"@appkit-wallet/",SESSION_TOKEN_KEY:"SESSION_TOKEN_KEY",EMAIL_LOGIN_USED_KEY:"EMAIL_LOGIN_USED_KEY",LAST_USED_CHAIN_KEY:"LAST_USED_CHAIN_KEY",LAST_EMAIL_LOGIN_TIME:"LAST_EMAIL_LOGIN_TIME",EMAIL:"EMAIL",PREFERRED_ACCOUNT_TYPE:"PREFERRED_ACCOUNT_TYPE",SMART_ACCOUNT_ENABLED:"SMART_ACCOUNT_ENABLED",SMART_ACCOUNT_ENABLED_NETWORKS:"SMART_ACCOUNT_ENABLED_NETWORKS",SOCIAL_USERNAME:"SOCIAL_USERNAME",APP_SWITCH_NETWORK:"@w3m-app/SWITCH_NETWORK",APP_CONNECT_EMAIL:"@w3m-app/CONNECT_EMAIL",APP_CONNECT_DEVICE:"@w3m-app/CONNECT_DEVICE",APP_CONNECT_OTP:"@w3m-app/CONNECT_OTP",APP_CONNECT_SOCIAL:"@w3m-app/CONNECT_SOCIAL",APP_GET_SOCIAL_REDIRECT_URI:"@w3m-app/GET_SOCIAL_REDIRECT_URI",APP_GET_USER:"@w3m-app/GET_USER",APP_SIGN_OUT:"@w3m-app/SIGN_OUT",APP_IS_CONNECTED:"@w3m-app/IS_CONNECTED",APP_GET_CHAIN_ID:"@w3m-app/GET_CHAIN_ID",APP_RPC_REQUEST:"@w3m-app/RPC_REQUEST",APP_UPDATE_EMAIL:"@w3m-app/UPDATE_EMAIL",APP_UPDATE_EMAIL_PRIMARY_OTP:"@w3m-app/UPDATE_EMAIL_PRIMARY_OTP",APP_UPDATE_EMAIL_SECONDARY_OTP:"@w3m-app/UPDATE_EMAIL_SECONDARY_OTP",APP_AWAIT_UPDATE_EMAIL:"@w3m-app/AWAIT_UPDATE_EMAIL",APP_SYNC_THEME:"@w3m-app/SYNC_THEME",APP_SYNC_DAPP_DATA:"@w3m-app/SYNC_DAPP_DATA",APP_GET_SMART_ACCOUNT_ENABLED_NETWORKS:"@w3m-app/GET_SMART_ACCOUNT_ENABLED_NETWORKS",APP_INIT_SMART_ACCOUNT:"@w3m-app/INIT_SMART_ACCOUNT",APP_SET_PREFERRED_ACCOUNT:"@w3m-app/SET_PREFERRED_ACCOUNT",APP_CONNECT_FARCASTER:"@w3m-app/CONNECT_FARCASTER",APP_GET_FARCASTER_URI:"@w3m-app/GET_FARCASTER_URI",APP_RELOAD:"@w3m-app/RELOAD",FRAME_SWITCH_NETWORK_ERROR:"@w3m-frame/SWITCH_NETWORK_ERROR",FRAME_SWITCH_NETWORK_SUCCESS:"@w3m-frame/SWITCH_NETWORK_SUCCESS",FRAME_CONNECT_EMAIL_ERROR:"@w3m-frame/CONNECT_EMAIL_ERROR",FRAME_CONNECT_EMAIL_SUCCESS:"@w3m-frame/CONNECT_EMAIL_SUCCESS",FRAME_CONNECT_DEVICE_ERROR:"@w3m-frame/CONNECT_DEVICE_ERROR",FRAME_CONNECT_DEVICE_SUCCESS:"@w3m-frame/CONNECT_DEVICE_SUCCESS",FRAME_CONNECT_OTP_SUCCESS:"@w3m-frame/CONNECT_OTP_SUCCESS",FRAME_CONNECT_OTP_ERROR:"@w3m-frame/CONNECT_OTP_ERROR",FRAME_CONNECT_SOCIAL_SUCCESS:"@w3m-frame/CONNECT_SOCIAL_SUCCESS",FRAME_CONNECT_SOCIAL_ERROR:"@w3m-frame/CONNECT_SOCIAL_ERROR",FRAME_CONNECT_FARCASTER_SUCCESS:"@w3m-frame/CONNECT_FARCASTER_SUCCESS",FRAME_CONNECT_FARCASTER_ERROR:"@w3m-frame/CONNECT_FARCASTER_ERROR",FRAME_GET_FARCASTER_URI_SUCCESS:"@w3m-frame/GET_FARCASTER_URI_SUCCESS",FRAME_GET_FARCASTER_URI_ERROR:"@w3m-frame/GET_FARCASTER_URI_ERROR",FRAME_GET_SOCIAL_REDIRECT_URI_SUCCESS:"@w3m-frame/GET_SOCIAL_REDIRECT_URI_SUCCESS",FRAME_GET_SOCIAL_REDIRECT_URI_ERROR:"@w3m-frame/GET_SOCIAL_REDIRECT_URI_ERROR",FRAME_GET_USER_SUCCESS:"@w3m-frame/GET_USER_SUCCESS",FRAME_GET_USER_ERROR:"@w3m-frame/GET_USER_ERROR",FRAME_SIGN_OUT_SUCCESS:"@w3m-frame/SIGN_OUT_SUCCESS",FRAME_SIGN_OUT_ERROR:"@w3m-frame/SIGN_OUT_ERROR",FRAME_IS_CONNECTED_SUCCESS:"@w3m-frame/IS_CONNECTED_SUCCESS",FRAME_IS_CONNECTED_ERROR:"@w3m-frame/IS_CONNECTED_ERROR",FRAME_GET_CHAIN_ID_SUCCESS:"@w3m-frame/GET_CHAIN_ID_SUCCESS",FRAME_GET_CHAIN_ID_ERROR:"@w3m-frame/GET_CHAIN_ID_ERROR",FRAME_RPC_REQUEST_SUCCESS:"@w3m-frame/RPC_REQUEST_SUCCESS",FRAME_RPC_REQUEST_ERROR:"@w3m-frame/RPC_REQUEST_ERROR",FRAME_SESSION_UPDATE:"@w3m-frame/SESSION_UPDATE",FRAME_UPDATE_EMAIL_SUCCESS:"@w3m-frame/UPDATE_EMAIL_SUCCESS",FRAME_UPDATE_EMAIL_ERROR:"@w3m-frame/UPDATE_EMAIL_ERROR",FRAME_UPDATE_EMAIL_PRIMARY_OTP_SUCCESS:"@w3m-frame/UPDATE_EMAIL_PRIMARY_OTP_SUCCESS",FRAME_UPDATE_EMAIL_PRIMARY_OTP_ERROR:"@w3m-frame/UPDATE_EMAIL_PRIMARY_OTP_ERROR",FRAME_UPDATE_EMAIL_SECONDARY_OTP_SUCCESS:"@w3m-frame/UPDATE_EMAIL_SECONDARY_OTP_SUCCESS",FRAME_UPDATE_EMAIL_SECONDARY_OTP_ERROR:"@w3m-frame/UPDATE_EMAIL_SECONDARY_OTP_ERROR",FRAME_SYNC_THEME_SUCCESS:"@w3m-frame/SYNC_THEME_SUCCESS",FRAME_SYNC_THEME_ERROR:"@w3m-frame/SYNC_THEME_ERROR",FRAME_SYNC_DAPP_DATA_SUCCESS:"@w3m-frame/SYNC_DAPP_DATA_SUCCESS",FRAME_SYNC_DAPP_DATA_ERROR:"@w3m-frame/SYNC_DAPP_DATA_ERROR",FRAME_GET_SMART_ACCOUNT_ENABLED_NETWORKS_SUCCESS:"@w3m-frame/GET_SMART_ACCOUNT_ENABLED_NETWORKS_SUCCESS",FRAME_GET_SMART_ACCOUNT_ENABLED_NETWORKS_ERROR:"@w3m-frame/GET_SMART_ACCOUNT_ENABLED_NETWORKS_ERROR",FRAME_INIT_SMART_ACCOUNT_SUCCESS:"@w3m-frame/INIT_SMART_ACCOUNT_SUCCESS",FRAME_INIT_SMART_ACCOUNT_ERROR:"@w3m-frame/INIT_SMART_ACCOUNT_ERROR",FRAME_SET_PREFERRED_ACCOUNT_SUCCESS:"@w3m-frame/SET_PREFERRED_ACCOUNT_SUCCESS",FRAME_SET_PREFERRED_ACCOUNT_ERROR:"@w3m-frame/SET_PREFERRED_ACCOUNT_ERROR",FRAME_READY:"@w3m-frame/READY",FRAME_RELOAD_SUCCESS:"@w3m-frame/RELOAD_SUCCESS",FRAME_RELOAD_ERROR:"@w3m-frame/RELOAD_ERROR",RPC_RESPONSE_TYPE_ERROR:"RPC_RESPONSE_ERROR",RPC_RESPONSE_TYPE_TX:"RPC_RESPONSE_TRANSACTION_HASH",RPC_RESPONSE_TYPE_OBJECT:"RPC_RESPONSE_OBJECT"},Z={SAFE_RPC_METHODS:["eth_accounts","eth_blockNumber","eth_call","eth_chainId","eth_estimateGas","eth_feeHistory","eth_gasPrice","eth_getAccount","eth_getBalance","eth_getBlockByHash","eth_getBlockByNumber","eth_getBlockReceipts","eth_getBlockTransactionCountByHash","eth_getBlockTransactionCountByNumber","eth_getCode","eth_getFilterChanges","eth_getFilterLogs","eth_getLogs","eth_getProof","eth_getStorageAt","eth_getTransactionByBlockHashAndIndex","eth_getTransactionByBlockNumberAndIndex","eth_getTransactionByHash","eth_getTransactionCount","eth_getTransactionReceipt","eth_getUncleCountByBlockHash","eth_getUncleCountByBlockNumber","eth_maxPriorityFeePerGas","eth_newBlockFilter","eth_newFilter","eth_newPendingTransactionFilter","eth_sendRawTransaction","eth_syncing","eth_uninstallFilter","wallet_getCapabilities","wallet_getCallsStatus","eth_getUserOperationReceipt","eth_estimateUserOperationGas","eth_getUserOperationByHash","eth_supportedEntryPoints","wallet_getAssets"],NOT_SAFE_RPC_METHODS:["personal_sign","eth_signTypedData_v4","eth_sendTransaction","solana_signMessage","solana_signTransaction","solana_signAllTransactions","solana_signAndSendTransaction","wallet_sendCalls","wallet_grantPermissions","wallet_revokePermissions","eth_sendUserOperation"],GET_CHAIN_ID:"eth_chainId",RPC_METHOD_NOT_ALLOWED_MESSAGE:"Requested RPC call is not allowed",RPC_METHOD_NOT_ALLOWED_UI_MESSAGE:"Action not allowed",ACCOUNT_TYPES:{EOA:"eoa",SMART_ACCOUNT:"smartAccount"}};var W=A({transactions:[],coinbaseTransactions:{},transactionsByYear:{},lastNetworkInView:void 0,loading:!1,empty:!1,next:void 0}),tr={state:W,subscribe(e){return O(W,()=>e(W))},setLastNetworkInView(e){W.lastNetworkInView=e},async fetchTransactions(e,t){if(!e)throw new Error("Transactions can't be fetched without an accountAddress");W.loading=!0;try{let r=await p.fetchTransactions({account:e,cursor:W.next,onramp:t,cache:t==="coinbase"?"no-cache":void 0,chainId:a.state.activeCaipNetwork?.caipNetworkId}),o=Ae.filterSpamTransactions(r.data),n=Ae.filterByConnectedChain(o),s=[...W.transactions,...n];W.loading=!1,t==="coinbase"?W.coinbaseTransactions=Ae.groupTransactionsByYearAndMonth(W.coinbaseTransactions,r.data):(W.transactions=s,W.transactionsByYear=Ae.groupTransactionsByYearAndMonth(W.transactionsByYear,n)),W.empty=s.length===0,W.next=r.next?r.next:void 0}catch{let o=a.state.activeChain;D.sendEvent({type:"track",event:"ERROR_FETCH_TRANSACTIONS",properties:{address:e,projectId:S.state.projectId,cursor:W.next,isSmartAccount:N.state.preferredAccountTypes?.[o]===Z.ACCOUNT_TYPES.SMART_ACCOUNT}}),F.showError("Failed to fetch transactions"),W.loading=!1,W.empty=!0,W.next=void 0}},groupTransactionsByYearAndMonth(e={},t=[]){let r=e;return t.forEach(o=>{let n=new Date(o.metadata.minedAt).getFullYear(),s=new Date(o.metadata.minedAt).getMonth(),c=r[n]??{},d=(c[s]??[]).filter(M=>M.id!==o.id);r[n]={...c,[s]:[...d,o].sort((M,T)=>new Date(T.metadata.minedAt).getTime()-new Date(M.metadata.minedAt).getTime())}}),r},filterSpamTransactions(e){return e.filter(t=>!t.transfers.every(o=>o.nft_info?.flags.is_spam===!0))},filterByConnectedChain(e){let t=a.state.activeCaipNetwork?.caipNetworkId;return e.filter(o=>o.metadata.chain===t)},clearCursor(){W.next=void 0},resetTransactions(){W.transactions=[],W.transactionsByYear={},W.lastNetworkInView=void 0,W.loading=!1,W.empty=!1,W.next=void 0}},Ae=x(tr,"API_ERROR");var j=A({connections:new Map,wcError:!1,buffering:!1,status:"disconnected"}),Ee,rr={state:j,subscribeKey(e,t){return _(j,e,t)},_getClient(){return j._client},setClient(e){j._client=ie(e)},async connectWalletConnect(){if(h.isTelegram()||h.isSafari()&&h.isIos()){if(Ee){await Ee,Ee=void 0;return}if(!h.isPairingExpired(j?.wcPairingExpiry)){let e=j.wcUri;j.wcUri=e;return}Ee=g._getClient()?.connectWalletConnect?.().catch(()=>{}),g.state.status="connecting",await Ee,Ee=void 0,j.wcPairingExpiry=void 0,g.state.status="connected"}else await g._getClient()?.connectWalletConnect?.()},async connectExternal(e,t,r=!0){await g._getClient()?.connectExternal?.(e),r&&a.setActiveNamespace(t)},async reconnectExternal(e){await g._getClient()?.reconnectExternal?.(e);let t=e.chain||a.state.activeChain;t&&C.setConnectorId(e.id,t)},async setPreferredAccountType(e,t){K.setLoading(!0,a.state.activeChain);let r=C.getAuthConnector();r&&(N.setPreferredAccountType(e,t),await r.provider.setPreferredAccount(e),w.setPreferredAccountTypes(N.state.preferredAccountTypes??{[t]:e}),await g.reconnectExternal(r),K.setLoading(!1,a.state.activeChain),D.sendEvent({type:"track",event:"SET_PREFERRED_ACCOUNT_TYPE",properties:{accountType:e,network:a.state.activeCaipNetwork?.caipNetworkId||""}}))},async signMessage(e){return g._getClient()?.signMessage(e)},parseUnits(e,t){return g._getClient()?.parseUnits(e,t)},formatUnits(e,t){return g._getClient()?.formatUnits(e,t)},async sendTransaction(e){return g._getClient()?.sendTransaction(e)},async getCapabilities(e){return g._getClient()?.getCapabilities(e)},async grantPermissions(e){return g._getClient()?.grantPermissions(e)},async walletGetAssets(e){return g._getClient()?.walletGetAssets(e)??{}},async estimateGas(e){return g._getClient()?.estimateGas(e)},async writeContract(e){return g._getClient()?.writeContract(e)},async getEnsAddress(e){return g._getClient()?.getEnsAddress(e)},async getEnsAvatar(e){return g._getClient()?.getEnsAvatar(e)},checkInstalled(e){return g._getClient()?.checkInstalled?.(e)||!1},resetWcConnection(){j.wcUri=void 0,j.wcPairingExpiry=void 0,j.wcLinking=void 0,j.recentWallet=void 0,j.status="disconnected",Ae.resetTransactions(),w.deleteWalletConnectDeepLink()},resetUri(){j.wcUri=void 0,j.wcPairingExpiry=void 0,Ee=void 0},finalizeWcConnection(){let{wcLinking:e,recentWallet:t}=g.state;e&&w.setWalletConnectDeepLink(e),t&&w.setAppKitRecent(t),D.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:e?"mobile":"qrcode",name:m.state.data?.wallet?.name||"Unknown"}})},setWcBasic(e){j.wcBasic=e},setUri(e){j.wcUri=e,j.wcPairingExpiry=h.getPairingExpiry()},setWcLinking(e){j.wcLinking=e},setWcError(e){j.wcError=e,j.buffering=!1},setRecentWallet(e){j.recentWallet=e},setBuffering(e){j.buffering=e},setStatus(e){j.status=e},async disconnect(e){try{await g._getClient()?.disconnect(e)}catch(t){throw new Se("Failed to disconnect","INTERNAL_SDK_ERROR",t)}},setConnections(e,t){j.connections.set(t,e)},switchAccount({connection:e,address:t,namespace:r}){if(C.state.activeConnectorIds[r]===e.connectorId){let s=a.state.activeCaipNetwork;if(s){let c=`${r}:${s.id}:${t}`;N.setCaipAddress(c,r)}else console.warn(`No current network found for namespace "${r}"`)}else{let s=C.getConnector(e.connectorId);s?g.connectExternal(s,r):console.warn(`No connector found for namespace "${r}"`)}}},g=x(rr);var Be={createBalance(e,t){let r={name:e.metadata.name||"",symbol:e.metadata.symbol||"",decimals:e.metadata.decimals||0,value:e.metadata.value||0,price:e.metadata.price||0,iconUrl:e.metadata.iconUrl||""};return{name:r.name,symbol:r.symbol,chainId:t,address:e.address==="native"?void 0:this.convertAddressToCAIP10Address(e.address,t),value:r.value,price:r.price,quantity:{decimals:r.decimals.toString(),numeric:this.convertHexToBalance({hex:e.balance,decimals:r.decimals})},iconUrl:r.iconUrl}},convertHexToBalance({hex:e,decimals:t}){return st(BigInt(e),t)},convertAddressToCAIP10Address(e,t){return`${t}:${e}`},createCAIP2ChainId(e,t){return`${t}:${parseInt(e,16)}`},getChainIdHexFromCAIP2ChainId(e){let t=e.split(":");if(t.length<2||!t[1])return"0x0";let r=t[1],o=parseInt(r,10);return isNaN(o)?"0x0":`0x${o.toString(16)}`},isWalletGetAssetsResponse(e){return typeof e!="object"||e===null?!1:Object.values(e).every(t=>Array.isArray(t)&&t.every(r=>this.isValidAsset(r)))},isValidAsset(e){return typeof e=="object"&&e!==null&&typeof e.address=="string"&&typeof e.balance=="string"&&(e.type==="ERC20"||e.type==="NATIVE")&&typeof e.metadata=="object"&&e.metadata!==null&&typeof e.metadata.name=="string"&&typeof e.metadata.symbol=="string"&&typeof e.metadata.decimals=="number"&&typeof e.metadata.price=="number"&&typeof e.metadata.iconUrl=="string"}};var ye={async getMyTokensWithBalance(e){let t=N.state.address,r=a.state.activeCaipNetwork;if(!t||!r)return[];if(r.chainNamespace==="eip155"){let n=await this.getEIP155Balances(t,r);if(n)return this.filterLowQualityTokens(n)}let o=await p.getBalance(t,r.caipNetworkId,e);return this.filterLowQualityTokens(o.balances)},async getEIP155Balances(e,t){try{let r=Be.getChainIdHexFromCAIP2ChainId(t.caipNetworkId);if(!(await g.getCapabilities(e))?.[r]?.assetDiscovery?.supported)return null;let n=await g.walletGetAssets({account:e,chainFilter:[r]});return Be.isWalletGetAssetsResponse(n)?(n[r]||[]).map(c=>Be.createBalance(c,t.caipNetworkId)):null}catch{return null}},filterLowQualityTokens(e){return e.filter(t=>t.quantity.decimals!=="0")},mapBalancesToSwapTokens(e){return e?.map(t=>({...t,address:t?.address?t.address:a.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}};var B=A({tokenBalances:[],loading:!1}),or={state:B,subscribe(e){return O(B,()=>e(B))},subscribeKey(e,t){return _(B,e,t)},setToken(e){e&&(B.token=ie(e))},setTokenAmount(e){B.sendTokenAmount=e},setReceiverAddress(e){B.receiverAddress=e},setReceiverProfileImageUrl(e){B.receiverProfileImageUrl=e},setReceiverProfileName(e){B.receiverProfileName=e},setNetworkBalanceInUsd(e){B.networkBalanceInUSD=e},setLoading(e){B.loading=e},async sendToken(){try{switch(R.setLoading(!0),a.state.activeCaipNetwork?.chainNamespace){case"eip155":await R.sendEvmToken();return;case"solana":await R.sendSolanaToken();return;default:throw new Error("Unsupported chain")}}finally{R.setLoading(!1)}},async sendEvmToken(){let e=a.state.activeChain,t=N.state.preferredAccountTypes?.[e];if(!R.state.sendTokenAmount||!R.state.receiverAddress)throw new Error("An amount and receiver address are required");if(!R.state.token)throw new Error("A token is required");R.state.token?.address?(D.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===Z.ACCOUNT_TYPES.SMART_ACCOUNT,token:R.state.token.address,amount:R.state.sendTokenAmount,network:a.state.activeCaipNetwork?.caipNetworkId||""}}),await R.sendERC20Token({receiverAddress:R.state.receiverAddress,tokenAddress:R.state.token.address,sendTokenAmount:R.state.sendTokenAmount,decimals:R.state.token.quantity.decimals})):(D.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===Z.ACCOUNT_TYPES.SMART_ACCOUNT,token:R.state.token.symbol||"",amount:R.state.sendTokenAmount,network:a.state.activeCaipNetwork?.caipNetworkId||""}}),await R.sendNativeToken({receiverAddress:R.state.receiverAddress,sendTokenAmount:R.state.sendTokenAmount,decimals:R.state.token.quantity.decimals}))},async fetchTokenBalance(e){B.loading=!0;let t=a.state.activeCaipNetwork?.caipNetworkId,r=a.state.activeCaipNetwork?.chainNamespace,o=a.state.activeCaipAddress,n=o?h.getPlainAddress(o):void 0;if(B.lastRetry&&!h.isAllowedRetry(B.lastRetry,30*q.ONE_SEC_MS))return B.loading=!1,[];try{if(n&&t&&r){let s=await ye.getMyTokensWithBalance();return B.tokenBalances=s,B.lastRetry=void 0,s}}catch(s){B.lastRetry=Date.now(),e?.(s),F.showError("Token Balance Unavailable")}finally{B.loading=!1}return[]},fetchNetworkBalance(){if(B.tokenBalances.length===0)return;let e=ye.mapBalancesToSwapTokens(B.tokenBalances);if(!e)return;let t=e.find(r=>r.address===a.getActiveNetworkTokenAddress());t&&(B.networkBalanceInUSD=t?U.multiply(t.quantity.numeric,t.price).toString():"0")},async sendNativeToken(e){m.pushTransactionStack({});let t=e.receiverAddress,r=N.state.address,o=g.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));await g.sendTransaction({chainNamespace:"eip155",to:t,address:r,data:"0x",value:o??BigInt(0)}),D.sendEvent({type:"track",event:"SEND_SUCCESS",properties:{isSmartAccount:N.state.preferredAccountTypes?.eip155===Z.ACCOUNT_TYPES.SMART_ACCOUNT,token:R.state.token?.symbol||"",amount:e.sendTokenAmount,network:a.state.activeCaipNetwork?.caipNetworkId||""}}),g._getClient()?.updateBalance("eip155"),R.resetSend()},async sendERC20Token(e){m.pushTransactionStack({onSuccess(){m.replace("Account")}});let t=g.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));if(N.state.address&&e.sendTokenAmount&&e.receiverAddress&&e.tokenAddress){let r=h.getPlainAddress(e.tokenAddress);await g.writeContract({fromAddress:N.state.address,tokenAddress:r,args:[e.receiverAddress,t??BigInt(0)],method:"transfer",abi:Ke.getERC20Abi(r),chainNamespace:"eip155"}),R.resetSend()}},async sendSolanaToken(){if(!R.state.sendTokenAmount||!R.state.receiverAddress)throw new Error("An amount and receiver address are required");m.pushTransactionStack({onSuccess(){m.replace("Account")}}),await g.sendTransaction({chainNamespace:"solana",to:R.state.receiverAddress,value:R.state.sendTokenAmount}),g._getClient()?.updateBalance("solana"),R.resetSend()},resetSend(){B.token=void 0,B.sendTokenAmount=void 0,B.receiverAddress=void 0,B.receiverProfileImageUrl=void 0,B.receiverProfileName=void 0,B.loading=!1,B.tokenBalances=[]}},R=x(or);var Xe={currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[],user:void 0},Fe={caipNetwork:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]},l=A({chains:nt(),activeCaipAddress:void 0,activeChain:void 0,activeCaipNetwork:void 0,noAdapters:!1,universalAdapter:{networkControllerClient:void 0,connectionControllerClient:void 0},isSwitchingNamespace:!1}),nr={state:l,subscribe(e){return O(l,()=>{e(l)})},subscribeKey(e,t){return _(l,e,t)},subscribeChainProp(e,t,r){let o;return O(l.chains,()=>{let n=r||l.activeChain;if(n){let s=l.chains.get(n)?.[e];o!==s&&(o=s,t(s))}})},initialize(e,t,r){let{chainId:o,namespace:n}=w.getActiveNetworkProps(),s=t?.find(T=>T.id.toString()===o?.toString()),u=e.find(T=>T?.namespace===n)||e?.[0],d=e.map(T=>T.namespace).filter(T=>T!==void 0),M=S.state.enableEmbedded?new Set([...d]):new Set([...t?.map(T=>T.chainNamespace)??[]]);(e?.length===0||!u)&&(l.noAdapters=!0),l.noAdapters||(l.activeChain=u?.namespace,l.activeCaipNetwork=s,a.setChainNetworkData(u?.namespace,{caipNetwork:s}),l.activeChain&&he.set({activeChain:u?.namespace})),M.forEach(T=>{let $=t?.filter(fe=>fe.chainNamespace===T);a.state.chains.set(T,{namespace:T,networkState:A({...Fe,caipNetwork:$?.[0]}),accountState:A(Xe),caipNetworks:$??[],...r}),a.setRequestedCaipNetworks($??[],T)})},removeAdapter(e){if(l.activeChain===e){let t=Array.from(l.chains.entries()).find(([r])=>r!==e);if(t){let r=t[1]?.caipNetworks?.[0];r&&a.setActiveCaipNetwork(r)}}l.chains.delete(e)},addAdapter(e,{networkControllerClient:t,connectionControllerClient:r},o){l.chains.set(e.namespace,{namespace:e.namespace,networkState:{...Fe,caipNetwork:o[0]},accountState:Xe,caipNetworks:o,connectionControllerClient:r,networkControllerClient:t}),a.setRequestedCaipNetworks(o?.filter(n=>n.chainNamespace===e.namespace)??[],e.namespace)},addNetwork(e){let t=l.chains.get(e.chainNamespace);if(t){let r=[...t.caipNetworks||[]];t.caipNetworks?.find(o=>o.id===e.id)||r.push(e),l.chains.set(e.chainNamespace,{...t,caipNetworks:r}),a.setRequestedCaipNetworks(r,e.chainNamespace),C.filterByNamespace(e.chainNamespace,!0)}},removeNetwork(e,t){let r=l.chains.get(e);if(r){let o=l.activeCaipNetwork?.id===t,n=[...r.caipNetworks?.filter(s=>s.id!==t)||[]];o&&r?.caipNetworks?.[0]&&a.setActiveCaipNetwork(r.caipNetworks[0]),l.chains.set(e,{...r,caipNetworks:n}),a.setRequestedCaipNetworks(n||[],e),n.length===0&&C.filterByNamespace(e,!1)}},setAdapterNetworkState(e,t){let r=l.chains.get(e);r&&(r.networkState={...r.networkState||Fe,...t},l.chains.set(e,r))},setChainAccountData(e,t,r=!0){if(!e)throw new Error("Chain is required to update chain account data");let o=l.chains.get(e);if(o){let n={...o.accountState||Xe,...t};l.chains.set(e,{...o,accountState:n}),(l.chains.size===1||l.activeChain===e)&&(t.caipAddress&&(l.activeCaipAddress=t.caipAddress),N.replaceState(n))}},setChainNetworkData(e,t){if(!e)return;let r=l.chains.get(e);if(r){let o={...r.networkState||Fe,...t};l.chains.set(e,{...r,networkState:o})}},setAccountProp(e,t,r,o=!0){a.setChainAccountData(r,{[e]:t},o),e==="status"&&t==="disconnected"&&r&&C.removeConnectorId(r)},setActiveNamespace(e){l.activeChain=e;let t=e?l.chains.get(e):void 0,r=t?.networkState?.caipNetwork;r?.id&&e&&(l.activeCaipAddress=t?.accountState?.caipAddress,l.activeCaipNetwork=r,a.setChainNetworkData(e,{caipNetwork:r}),w.setActiveCaipNetworkId(r?.caipNetworkId),he.set({activeChain:e,selectedNetworkId:r?.caipNetworkId}))},setActiveCaipNetwork(e){if(!e)return;l.activeChain!==e.chainNamespace&&a.setIsSwitchingNamespace(!0);let t=l.chains.get(e.chainNamespace);l.activeChain=e.chainNamespace,l.activeCaipNetwork=e,a.setChainNetworkData(e.chainNamespace,{caipNetwork:e}),t?.accountState?.address?l.activeCaipAddress=`${e.chainNamespace}:${e.id}:${t?.accountState?.address}`:l.activeCaipAddress=void 0,a.setAccountProp("caipAddress",l.activeCaipAddress,e.chainNamespace),t&&N.replaceState(t.accountState),R.resetSend(),he.set({activeChain:l.activeChain,selectedNetworkId:l.activeCaipNetwork?.caipNetworkId}),w.setActiveCaipNetworkId(e.caipNetworkId),!a.checkIfSupportedNetwork(e.chainNamespace)&&S.state.enableNetworkSwitch&&!S.state.allowUnsupportedChain&&!g.state.wcBasic&&a.showUnsupportedChainUI()},addCaipNetwork(e){if(!e)return;let t=l.chains.get(e.chainNamespace);t&&t?.caipNetworks?.push(e)},async switchActiveNamespace(e){if(!e)return;let t=e!==a.state.activeChain,r=a.getNetworkData(e)?.caipNetwork,o=a.getCaipNetworkByNamespace(e,r?.id);t&&o&&await a.switchActiveNetwork(o)},async switchActiveNetwork(e){let r=!a.state.chains.get(a.state.activeChain)?.caipNetworks?.some(n=>n.id===l.activeCaipNetwork?.id),o=a.getNetworkControllerClient(e.chainNamespace);if(o){try{await o.switchCaipNetwork(e),r&&K.close()}catch{m.goBack()}D.sendEvent({type:"track",event:"SWITCH_NETWORK",properties:{network:e.caipNetworkId}})}},getNetworkControllerClient(e){let t=e||l.activeChain,r=l.chains.get(t);if(!r)throw new Error("Chain adapter not found");if(!r.networkControllerClient)throw new Error("NetworkController client not set");return r.networkControllerClient},getConnectionControllerClient(e){let t=e||l.activeChain;if(!t)throw new Error("Chain is required to get connection controller client");let r=l.chains.get(t);if(!r?.connectionControllerClient)throw new Error("ConnectionController client not set");return r.connectionControllerClient},getAccountProp(e,t){let r=l.activeChain;if(t&&(r=t),!r)return;let o=l.chains.get(r)?.accountState;if(o)return o[e]},getNetworkProp(e,t){let r=l.chains.get(t)?.networkState;if(r)return r[e]},getRequestedCaipNetworks(e){let t=l.chains.get(e),{approvedCaipNetworkIds:r=[],requestedCaipNetworks:o=[]}=t?.networkState||{};return h.sortRequestedNetworks(r,o)},getAllRequestedCaipNetworks(){let e=[];return l.chains.forEach(t=>{let r=a.getRequestedCaipNetworks(t.namespace);e.push(...r)}),e},setRequestedCaipNetworks(e,t){a.setAdapterNetworkState(t,{requestedCaipNetworks:e});let o=a.getAllRequestedCaipNetworks().map(s=>s.chainNamespace),n=Array.from(new Set(o));C.filterByNamespaces(n)},getAllApprovedCaipNetworkIds(){let e=[];return l.chains.forEach(t=>{let r=a.getApprovedCaipNetworkIds(t.namespace);e.push(...r)}),e},getActiveCaipNetwork(){return l.activeCaipNetwork},getActiveCaipAddress(){return l.activeCaipAddress},getApprovedCaipNetworkIds(e){return l.chains.get(e)?.networkState?.approvedCaipNetworkIds||[]},async setApprovedCaipNetworksData(e){let r=await a.getNetworkControllerClient()?.getApprovedCaipNetworksData();a.setAdapterNetworkState(e,{approvedCaipNetworkIds:r?.approvedCaipNetworkIds,supportsAllNetworks:r?.supportsAllNetworks})},checkIfSupportedNetwork(e,t){let r=t||l.activeCaipNetwork,o=a.getRequestedCaipNetworks(e);return o.length?o?.some(n=>n.id===r?.id):!0},checkIfSupportedChainId(e){return l.activeChain?a.getRequestedCaipNetworks(l.activeChain)?.some(r=>r.id===e):!0},setSmartAccountEnabledNetworks(e,t){a.setAdapterNetworkState(t,{smartAccountEnabledNetworks:e})},checkIfSmartAccountEnabled(){let e=qe.caipNetworkIdToNumber(l.activeCaipNetwork?.caipNetworkId),t=l.activeChain;return!t||!e?!1:!!a.getNetworkProp("smartAccountEnabledNetworks",t)?.includes(Number(e))},getActiveNetworkTokenAddress(){let e=l.activeCaipNetwork?.chainNamespace||"eip155",t=l.activeCaipNetwork?.id||1,r=q.NATIVE_TOKEN_ADDRESS[e];return`${e}:${t}:${r}`},showUnsupportedChainUI(){K.open({view:"UnsupportedChain"})},checkIfNamesSupported(){let e=l.activeCaipNetwork;return!!(e?.chainNamespace&&q.NAMES_SUPPORTED_CHAIN_NAMESPACES.includes(e.chainNamespace))},resetNetwork(e){a.setAdapterNetworkState(e,{approvedCaipNetworkIds:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]})},resetAccount(e){let t=e;if(!t)throw new Error("Chain is required to set account prop");l.activeCaipAddress=void 0,a.setChainAccountData(t,{smartAccountDeployed:!1,currentTab:0,caipAddress:void 0,address:void 0,balance:void 0,balanceSymbol:void 0,profileName:void 0,profileImage:void 0,addressExplorerUrl:void 0,tokenBalance:[],connectedWalletInfo:void 0,preferredAccountTypes:void 0,socialProvider:void 0,socialWindow:void 0,farcasterUrl:void 0,allAccounts:[],user:void 0,status:"disconnected"}),C.removeConnectorId(t)},setIsSwitchingNamespace(e){l.isSwitchingNamespace=e},getFirstCaipNetworkSupportsAuthConnector(){let e=[],t;if(l.chains.forEach(r=>{L.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(o=>o===r.namespace)&&r.namespace&&e.push(r.namespace)}),e.length>0){let r=e[0];return t=r?l.chains.get(r)?.caipNetworks?.[0]:void 0,t}},getAccountData(e){return e?a.state.chains.get(e)?.accountState:N.state},getNetworkData(e){let t=e||l.activeChain;if(t)return a.state.chains.get(t)?.networkState},getCaipNetworkByNamespace(e,t){if(!e)return;let r=a.state.chains.get(e),o=r?.caipNetworks?.find(n=>n.id===t);return o||r?.networkState?.caipNetwork||r?.caipNetworks?.[0]},getRequestedCaipNetworkIds(){let e=C.state.filterByNamespace;return(e?[l.chains.get(e)]:Array.from(l.chains.values())).flatMap(r=>r?.caipNetworks||[]).map(r=>r.caipNetworkId)},getCaipNetworks(e){return e?a.getRequestedCaipNetworks(e):a.getAllRequestedCaipNetworks()}},a=x(nr);var sr=h.getApiUrl(),J=new ne({baseUrl:sr,clientId:null}),ar=40,bt=4,ir=20,I=A({promises:{},page:1,count:0,featured:[],allFeatured:[],recommended:[],allRecommended:[],wallets:[],filteredWallets:[],search:[],isAnalyticsEnabled:!1,excludedWallets:[],isFetchingRecommendedWallets:!1}),E={state:I,subscribeKey(e,t){return _(I,e,t)},_getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=S.state;return{projectId:e,st:t||"appkit",sv:r||"html-wagmi-4.2.2"}},_filterOutExtensions(e){return S.state.isUniversalProvider?e.filter(t=>!!(t.mobile_link||t.desktop_link||t.webapp_link)):e},async _fetchWalletImage(e){let t=`${J.baseUrl}/getWalletImage/${e}`,r=await J.getBlob({path:t,params:E._getSdkProperties()});z.setWalletImage(e,URL.createObjectURL(r))},async _fetchNetworkImage(e){let t=`${J.baseUrl}/public/getAssetImage/${e}`,r=await J.getBlob({path:t,params:E._getSdkProperties()});z.setNetworkImage(e,URL.createObjectURL(r))},async _fetchConnectorImage(e){let t=`${J.baseUrl}/public/getAssetImage/${e}`,r=await J.getBlob({path:t,params:E._getSdkProperties()});z.setConnectorImage(e,URL.createObjectURL(r))},async _fetchCurrencyImage(e){let t=`${J.baseUrl}/public/getCurrencyImage/${e}`,r=await J.getBlob({path:t,params:E._getSdkProperties()});z.setCurrencyImage(e,URL.createObjectURL(r))},async _fetchTokenImage(e){let t=`${J.baseUrl}/public/getTokenImage/${e}`,r=await J.getBlob({path:t,params:E._getSdkProperties()});z.setTokenImage(e,URL.createObjectURL(r))},_filterWalletsByPlatform(e){return h.isMobile()?e?.filter(r=>r.mobile_link||r.id===se.COINBASE.id?!0:a.state.activeChain==="solana"&&(r.id===se.SOLFLARE.id||r.id===se.PHANTOM.id)):e},async fetchProjectConfig(){return(await J.get({path:"/appkit/v1/config",params:E._getSdkProperties()})).features},async fetchAllowedOrigins(){try{let{allowedOrigins:e}=await J.get({path:"/projects/v1/origins",params:E._getSdkProperties()});return e}catch{return[]}},async fetchNetworkImages(){let t=a.getAllRequestedCaipNetworks()?.map(({assets:r})=>r?.imageId).filter(Boolean).filter(r=>!Je.getNetworkImageById(r));t&&await Promise.allSettled(t.map(r=>E._fetchNetworkImage(r)))},async fetchConnectorImages(){let{connectors:e}=C.state,t=e.map(({imageId:r})=>r).filter(Boolean);await Promise.allSettled(t.map(r=>E._fetchConnectorImage(r)))},async fetchCurrencyImages(e=[]){await Promise.allSettled(e.map(t=>E._fetchCurrencyImage(t)))},async fetchTokenImages(e=[]){await Promise.allSettled(e.map(t=>E._fetchTokenImage(t)))},async fetchWallets(e){let t=e.exclude??[];E._getSdkProperties().sv.startsWith("html-core-")&&t.push(...Object.values(se).map(s=>s.id));let o=await J.get({path:"/getWallets",params:{...E._getSdkProperties(),...e,page:String(e.page),entries:String(e.entries),include:e.include?.join(","),exclude:t.join(",")}});return{data:E._filterWalletsByPlatform(o?.data)||[],count:o?.count}},async fetchFeaturedWallets(){let{featuredWalletIds:e}=S.state;if(e?.length){let t={...E._getSdkProperties(),page:1,entries:e?.length??bt,include:e},{data:r}=await E.fetchWallets(t),o=[...r].sort((s,c)=>e.indexOf(s.id)-e.indexOf(c.id)),n=o.map(s=>s.image_id).filter(Boolean);await Promise.allSettled(n.map(s=>E._fetchWalletImage(s))),I.featured=o,I.allFeatured=o}},async fetchRecommendedWallets(){try{I.isFetchingRecommendedWallets=!0;let{includeWalletIds:e,excludeWalletIds:t,featuredWalletIds:r}=S.state,o=[...t??[],...r??[]].filter(Boolean),n=a.getRequestedCaipNetworkIds().join(","),s={page:1,entries:bt,include:e,exclude:o,chains:n},{data:c,count:u}=await E.fetchWallets(s),d=w.getRecentWallets(),M=c.map($=>$.image_id).filter(Boolean),T=d.map($=>$.image_id).filter(Boolean);await Promise.allSettled([...M,...T].map($=>E._fetchWalletImage($))),I.recommended=c,I.allRecommended=c,I.count=u??0}catch{}finally{I.isFetchingRecommendedWallets=!1}},async fetchWalletsByPage({page:e}){let{includeWalletIds:t,excludeWalletIds:r,featuredWalletIds:o}=S.state,n=a.getRequestedCaipNetworkIds().join(","),s=[...I.recommended.map(({id:T})=>T),...r??[],...o??[]].filter(Boolean),c={page:e,entries:ar,include:t,exclude:s,chains:n},{data:u,count:d}=await E.fetchWallets(c),M=u.slice(0,ir).map(T=>T.image_id).filter(Boolean);await Promise.allSettled(M.map(T=>E._fetchWalletImage(T))),I.wallets=h.uniqueBy([...I.wallets,...E._filterOutExtensions(u)],"id").filter(T=>T.chains?.some($=>n.includes($))),I.count=d>I.count?d:I.count,I.page=e},async initializeExcludedWallets({ids:e}){let t={page:1,entries:e.length,include:e},{data:r}=await E.fetchWallets(t);r&&r.forEach(o=>{I.excludedWallets.push({rdns:o.rdns,name:o.name})})},async searchWallet({search:e,badge:t}){let{includeWalletIds:r,excludeWalletIds:o}=S.state,n=a.getRequestedCaipNetworkIds().join(",");I.search=[];let s={page:1,entries:100,search:e?.trim(),badge_type:t,include:r,exclude:o,chains:n},{data:c}=await E.fetchWallets(s);D.sendEvent({type:"track",event:"SEARCH_WALLET",properties:{badge:t??"",search:e??""}});let u=c.map(d=>d.image_id).filter(Boolean);await Promise.allSettled([...u.map(d=>E._fetchWalletImage(d)),h.wait(300)]),I.search=E._filterOutExtensions(c)},initPromise(e,t){let r=I.promises[e];return r||(I.promises[e]=t())},prefetch({fetchConnectorImages:e=!0,fetchFeaturedWallets:t=!0,fetchRecommendedWallets:r=!0,fetchNetworkImages:o=!0}={}){let n=[e&&E.initPromise("connectorImages",E.fetchConnectorImages),t&&E.initPromise("featuredWallets",E.fetchFeaturedWallets),r&&E.initPromise("recommendedWallets",E.fetchRecommendedWallets),o&&E.initPromise("networkImages",E.fetchNetworkImages)].filter(Boolean);return Promise.allSettled(n)},prefetchAnalyticsConfig(){S.state.features?.analytics&&E.fetchAnalyticsConfig()},async fetchAnalyticsConfig(){try{let{isAnalyticsEnabled:e}=await J.get({path:"/getAnalyticsConfig",params:E._getSdkProperties()});S.setFeatures({analytics:e})}catch{S.setFeatures({analytics:!1})}},filterByNamespaces(e){if(!e?.length){I.featured=I.allFeatured,I.recommended=I.allRecommended;return}let t=a.getRequestedCaipNetworkIds().join(",");I.featured=I.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),I.recommended=I.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o))),I.filteredWallets=I.wallets.filter(r=>r.chains?.some(o=>t.includes(o)))},clearFilterByNamespaces(){I.filteredWallets=[]},setFilterByNamespace(e){if(!e){I.featured=I.allFeatured,I.recommended=I.allRecommended;return}let t=a.getRequestedCaipNetworkIds().join(",");I.featured=I.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),I.recommended=I.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o))),I.filteredWallets=I.wallets.filter(r=>r.chains?.some(o=>t.includes(o)))}};var cr={eip155:"ba0ba0cd-17c6-4806-ad93-f9d174f17900",solana:"a1b58899-f671-4276-6a5e-56ca5bd59700",polkadot:"",bip122:"0b4838db-0161-4ffe-022d-532bf03dba00",cosmos:""},Qe=A({networkImagePromises:{}}),Je={async fetchWalletImage(e){if(e)return await E._fetchWalletImage(e),this.getWalletImageById(e)},async fetchNetworkImage(e){if(!e)return;let t=this.getNetworkImageById(e);return t||(Qe.networkImagePromises[e]||(Qe.networkImagePromises[e]=E._fetchNetworkImage(e)),await Qe.networkImagePromises[e],this.getNetworkImageById(e))},getWalletImageById(e){if(e)return z.state.walletImages[e]},getWalletImage(e){if(e?.image_url)return e?.image_url;if(e?.image_id)return z.state.walletImages[e.image_id]},getNetworkImage(e){if(e?.assets?.imageUrl)return e?.assets?.imageUrl;if(e?.assets?.imageId)return z.state.networkImages[e.assets.imageId]},getNetworkImageById(e){if(e)return z.state.networkImages[e]},getConnectorImage(e){if(e?.imageUrl)return e.imageUrl;if(e?.imageId)return z.state.connectorImages[e.imageId]},getChainImage(e){return z.state.networkImages[cr[e]]}};var xe={id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},Ze={id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},lr={providers:Ve,selectedProvider:null,error:null,purchaseCurrency:xe,paymentCurrency:Ze,purchaseCurrencies:[xe],paymentCurrencies:[],quotesLoading:!1},k=A(lr),ur={state:k,subscribe(e){return O(k,()=>e(k))},subscribeKey(e,t){return _(k,e,t)},setSelectedProvider(e){if(e&&e.name==="meld"){let t=a.state.activeChain===L.CHAIN.SOLANA?"SOL":"USDC",r=N.state.address??"",o=new URL(e.url);o.searchParams.append("publicKey",dt),o.searchParams.append("destinationCurrencyCode",t),o.searchParams.append("walletAddress",r),o.searchParams.append("externalCustomerId",S.state.projectId),k.selectedProvider={...e,url:o.toString()}}else k.selectedProvider=e},setOnrampProviders(e){if(Array.isArray(e)&&e.every(t=>typeof t=="string")){let t=e,r=Ve.filter(o=>t.includes(o.name));k.providers=r}else k.providers=[]},setPurchaseCurrency(e){k.purchaseCurrency=e},setPaymentCurrency(e){k.paymentCurrency=e},setPurchaseAmount(e){et.state.purchaseAmount=e},setPaymentAmount(e){et.state.paymentAmount=e},async getAvailableCurrencies(){let e=await p.getOnrampOptions();k.purchaseCurrencies=e.purchaseCurrencies,k.paymentCurrencies=e.paymentCurrencies,k.paymentCurrency=e.paymentCurrencies[0]||Ze,k.purchaseCurrency=e.purchaseCurrencies[0]||xe,await E.fetchCurrencyImages(e.paymentCurrencies.map(t=>t.id)),await E.fetchTokenImages(e.purchaseCurrencies.map(t=>t.symbol))},async getQuote(){k.quotesLoading=!0;try{let e=await p.getOnrampQuote({purchaseCurrency:k.purchaseCurrency,paymentCurrency:k.paymentCurrency,amount:k.paymentAmount?.toString()||"0",network:k.purchaseCurrency?.symbol});return k.quotesLoading=!1,k.purchaseAmount=Number(e?.purchaseAmount.amount),e}catch(e){return k.error=e.message,k.quotesLoading=!1,null}finally{k.quotesLoading=!1}},resetState(){k.selectedProvider=null,k.error=null,k.purchaseCurrency=xe,k.paymentCurrency=Ze,k.purchaseCurrencies=[xe],k.paymentCurrencies=[],k.paymentAmount=void 0,k.purchaseAmount=void 0,k.quotesLoading=!1}},et=x(ur);var He={async getTokenList(){let e=a.state.activeCaipNetwork;return(await p.fetchSwapTokens({chainId:e?.caipNetworkId}))?.tokens?.map(o=>({...o,eip2612:!1,quantity:{decimals:"0",numeric:"0"},price:0,value:0}))||[]},async fetchGasPrice(){let e=a.state.activeCaipNetwork;if(!e)return null;try{switch(e.chainNamespace){case"solana":let t=(await g?.estimateGas({chainNamespace:"solana"}))?.toString();return{standard:t,fast:t,instant:t};case"eip155":default:return await p.fetchGasPrice({chainId:e.caipNetworkId})}}catch{return null}},async fetchSwapAllowance({tokenAddress:e,userAddress:t,sourceTokenAmount:r,sourceTokenDecimals:o}){let n=await p.fetchSwapAllowance({tokenAddress:e,userAddress:t});if(n?.allowance&&r&&o){let s=g.parseUnits(r,o)||0;return BigInt(n.allowance)>=s}return!1},async getMyTokensWithBalance(e){let t=N.state.address,r=a.state.activeCaipNetwork;if(!t||!r)return[];let n=(await p.getBalance(t,r.caipNetworkId,e)).balances.filter(s=>s.quantity.decimals!=="0");return N.setTokenBalance(n,a.state.activeChain),this.mapBalancesToSwapTokens(n)},mapBalancesToSwapTokens(e){return e?.map(t=>({...t,address:t?.address?t.address:a.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}};var pe={getGasPriceInEther(e,t){let r=t*e;return Number(r)/1e18},getGasPriceInUSD(e,t,r){let o=pe.getGasPriceInEther(t,r);return U.bigNumber(e).times(o).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:r,toTokenAmount:o}){let n=U.bigNumber(e).times(t),s=U.bigNumber(o).times(r);return n.minus(s).div(n).times(100).toNumber()},getMaxSlippage(e,t){let r=U.bigNumber(e).div(100);return U.multiply(t,r).toNumber()},getProviderFee(e,t=.0085){return U.bigNumber(e).times(t).toString()},isInsufficientNetworkTokenForGas(e,t){let r=t||"0";return U.bigNumber(e).eq(0)?!0:U.bigNumber(U.bigNumber(r)).gt(e)},isInsufficientSourceTokenForSwap(e,t,r){let o=r?.find(s=>s.address===t)?.quantity?.numeric;return U.bigNumber(o||"0").lt(e)},getToTokenAmount({sourceToken:e,toToken:t,sourceTokenPrice:r,toTokenPrice:o,sourceTokenAmount:n}){if(n==="0"||!e||!t)return"0";let s=e.decimals,c=r,u=t.decimals,d=o;if(d<=0)return"0";let M=U.bigNumber(n).times(.0085),$=U.bigNumber(n).minus(M).times(U.bigNumber(10).pow(s)),fe=U.bigNumber(c).div(d),Me=s-u;return $.times(fe).div(U.bigNumber(10).pow(Me)).div(U.bigNumber(10).pow(u)).toFixed(u).toString()}};var At=15e4,pr=6;var V={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:q.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},i=A(V),We={state:i,subscribe(e){return O(i,()=>e(i))},subscribeKey(e,t){return _(i,e,t)},getParams(){let e=a.state.activeCaipAddress,t=a.state.activeChain,r=h.getPlainAddress(e),o=a.getActiveNetworkTokenAddress(),n=C.getConnectorId(t);if(!r)throw new Error("No address found to swap the tokens from.");let s=!i.toToken?.address||!i.toToken?.decimals,c=!i.sourceToken?.address||!i.sourceToken?.decimals||!U.bigNumber(i.sourceTokenAmount).gt(0),u=!i.sourceTokenAmount;return{networkAddress:o,fromAddress:r,fromCaipAddress:e,sourceTokenAddress:i.sourceToken?.address,toTokenAddress:i.toToken?.address,toTokenAmount:i.toTokenAmount,toTokenDecimals:i.toToken?.decimals,sourceTokenAmount:i.sourceTokenAmount,sourceTokenDecimals:i.sourceToken?.decimals,invalidToToken:s,invalidSourceToken:c,invalidSourceTokenAmount:u,availableToSwap:e&&!s&&!c&&!u,isAuthConnector:n===L.CONNECTOR_ID.AUTH}},setSourceToken(e){if(!e){i.sourceToken=e,i.sourceTokenAmount="",i.sourceTokenPriceInUSD=0;return}i.sourceToken=e,b.setTokenPrice(e.address,"sourceToken")},setSourceTokenAmount(e){i.sourceTokenAmount=e},setToToken(e){if(!e){i.toToken=e,i.toTokenAmount="",i.toTokenPriceInUSD=0;return}i.toToken=e,b.setTokenPrice(e.address,"toToken")},setToTokenAmount(e){i.toTokenAmount=e?U.formatNumberToLocalString(e,pr):""},async setTokenPrice(e,t){let r=i.tokensPriceMap[e]||0;r||(i.loadingPrices=!0,r=await b.getAddressPrice(e)),t==="sourceToken"?i.sourceTokenPriceInUSD=r:t==="toToken"&&(i.toTokenPriceInUSD=r),i.loadingPrices&&(i.loadingPrices=!1),b.getParams().availableToSwap&&b.swapTokens()},switchTokens(){if(i.initializing||!i.initialized)return;let e=i.toToken?{...i.toToken}:void 0,t=i.sourceToken?{...i.sourceToken}:void 0,r=e&&i.toTokenAmount===""?"1":i.toTokenAmount;b.setSourceToken(e),b.setToToken(t),b.setSourceTokenAmount(r),b.setToTokenAmount(""),b.swapTokens()},resetState(){i.myTokensWithBalance=V.myTokensWithBalance,i.tokensPriceMap=V.tokensPriceMap,i.initialized=V.initialized,i.sourceToken=V.sourceToken,i.sourceTokenAmount=V.sourceTokenAmount,i.sourceTokenPriceInUSD=V.sourceTokenPriceInUSD,i.toToken=V.toToken,i.toTokenAmount=V.toTokenAmount,i.toTokenPriceInUSD=V.toTokenPriceInUSD,i.networkPrice=V.networkPrice,i.networkTokenSymbol=V.networkTokenSymbol,i.networkBalanceInUSD=V.networkBalanceInUSD,i.inputError=V.inputError,i.myTokensWithBalance=V.myTokensWithBalance},resetValues(){let{networkAddress:e}=b.getParams(),t=i.tokens?.find(r=>r.address===e);b.setSourceToken(t),b.setToToken(void 0)},getApprovalLoadingState(){return i.loadingApprovalTransaction},clearError(){i.transactionError=void 0},async initializeState(){if(!i.initializing){if(i.initializing=!0,!i.initialized)try{await b.fetchTokens(),i.initialized=!0}catch{i.initialized=!1,F.showError("Failed to initialize swap"),m.goBack()}i.initializing=!1}},async fetchTokens(){let{networkAddress:e}=b.getParams();await b.getTokenList(),await b.getNetworkTokenPrice(),await b.getMyTokensWithBalance();let t=i.tokens?.find(r=>r.address===e);t&&(i.networkTokenSymbol=t.symbol,b.setSourceToken(t),b.setSourceTokenAmount("1"))},async getTokenList(){let e=await He.getTokenList();i.tokens=e,i.popularTokens=e.sort((t,r)=>t.symbol<r.symbol?-1:t.symbol>r.symbol?1:0),i.suggestedTokens=e.filter(t=>!!q.SWAP_SUGGESTED_TOKENS.includes(t.symbol),{})},async getAddressPrice(e){let t=i.tokensPriceMap[e];if(t)return t;let o=(await p.fetchTokenPrice({addresses:[e]}))?.fungibles||[],s=[...i.tokens||[],...i.myTokensWithBalance||[]]?.find(d=>d.address===e)?.symbol,c=o.find(d=>d.symbol.toLowerCase()===s?.toLowerCase())?.price||0,u=parseFloat(c.toString());return i.tokensPriceMap[e]=u,u},async getNetworkTokenPrice(){let{networkAddress:e}=b.getParams(),r=(await p.fetchTokenPrice({addresses:[e]}).catch(()=>(F.showError("Failed to fetch network token price"),{fungibles:[]}))).fungibles?.[0],o=r?.price.toString()||"0";i.tokensPriceMap[e]=parseFloat(o),i.networkTokenSymbol=r?.symbol||"",i.networkPrice=o},async getMyTokensWithBalance(e){let t=await ye.getMyTokensWithBalance(e),r=ye.mapBalancesToSwapTokens(t);r&&(await b.getInitialGasPrice(),b.setBalances(r))},setBalances(e){let{networkAddress:t}=b.getParams(),r=a.state.activeCaipNetwork;if(!r)return;let o=e.find(n=>n.address===t);e.forEach(n=>{i.tokensPriceMap[n.address]=n.price||0}),i.myTokensWithBalance=e.filter(n=>n.address.startsWith(r.caipNetworkId)),i.networkBalanceInUSD=o?U.multiply(o.quantity.numeric,o.price).toString():"0"},async getInitialGasPrice(){let e=await He.fetchGasPrice();if(!e)return{gasPrice:null,gasPriceInUSD:null};switch(a.state?.activeCaipNetwork?.chainNamespace){case"solana":return i.gasFee=e.standard??"0",i.gasPriceInUSD=U.multiply(e.standard,i.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(i.gasFee),gasPriceInUSD:Number(i.gasPriceInUSD)};case"eip155":default:let t=e.standard??"0",r=BigInt(t),o=BigInt(At),n=pe.getGasPriceInUSD(i.networkPrice,o,r);return i.gasFee=t,i.gasPriceInUSD=n,{gasPrice:r,gasPriceInUSD:n}}},async swapTokens(){let e=N.state.address,t=i.sourceToken,r=i.toToken,o=U.bigNumber(i.sourceTokenAmount).gt(0);if(o||b.setToTokenAmount(""),!r||!t||i.loadingPrices||!o)return;i.loadingQuote=!0;let n=U.bigNumber(i.sourceTokenAmount).times(10**t.decimals).round(0);try{let s=await p.fetchSwapQuote({userAddress:e,from:t.address,to:r.address,gasPrice:i.gasFee,amount:n.toString()});i.loadingQuote=!1;let c=s?.quotes?.[0]?.toAmount;if(!c){Ue.open({shortMessage:"Incorrect amount",longMessage:"Please enter a valid amount"},"error");return}let u=U.bigNumber(c).div(10**r.decimals).toString();b.setToTokenAmount(u),b.hasInsufficientToken(i.sourceTokenAmount,t.address)?i.inputError="Insufficient balance":(i.inputError=void 0,b.setTransactionDetails())}catch{i.loadingQuote=!1,i.inputError="Insufficient balance"}},async getTransaction(){let{fromCaipAddress:e,availableToSwap:t}=b.getParams(),r=i.sourceToken,o=i.toToken;if(!(!e||!t||!r||!o||i.loadingQuote))try{i.loadingBuildTransaction=!0;let n=await He.fetchSwapAllowance({userAddress:e,tokenAddress:r.address,sourceTokenAmount:i.sourceTokenAmount,sourceTokenDecimals:r.decimals}),s;return n?s=await b.createSwapTransaction():s=await b.createAllowanceTransaction(),i.loadingBuildTransaction=!1,i.fetchError=!1,s}catch{m.goBack(),F.showError("Failed to check allowance"),i.loadingBuildTransaction=!1,i.approvalTransaction=void 0,i.swapTransaction=void 0,i.fetchError=!0;return}},async createAllowanceTransaction(){let{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:r}=b.getParams();if(!(!e||!r)){if(!t)throw new Error("createAllowanceTransaction - No source token address found.");try{let o=await p.generateApproveCalldata({from:t,to:r,userAddress:e}),n={data:o.tx.data,to:h.getPlainAddress(o.tx.from),gasPrice:BigInt(o.tx.eip155.gasPrice),value:BigInt(o.tx.value),toAmount:i.toTokenAmount};return i.swapTransaction=void 0,i.approvalTransaction={data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount},{data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount}}catch{m.goBack(),F.showError("Failed to create approval transaction"),i.approvalTransaction=void 0,i.swapTransaction=void 0,i.fetchError=!0;return}}},async createSwapTransaction(){let{networkAddress:e,fromCaipAddress:t,sourceTokenAmount:r}=b.getParams(),o=i.sourceToken,n=i.toToken;if(!t||!r||!o||!n)return;let s=g.parseUnits(r,o.decimals)?.toString();try{let c=await p.generateSwapCalldata({userAddress:t,from:o.address,to:n.address,amount:s,disableEstimate:!0}),u=o.address===e,d=BigInt(c.tx.eip155.gas),M=BigInt(c.tx.eip155.gasPrice),T={data:c.tx.data,to:h.getPlainAddress(c.tx.to),gas:d,gasPrice:M,value:BigInt(u?s??"0":"0"),toAmount:i.toTokenAmount};return i.gasPriceInUSD=pe.getGasPriceInUSD(i.networkPrice,d,M),i.approvalTransaction=void 0,i.swapTransaction=T,T}catch{m.goBack(),F.showError("Failed to create transaction"),i.approvalTransaction=void 0,i.swapTransaction=void 0,i.fetchError=!0;return}},async sendTransactionForApproval(e){let{fromAddress:t,isAuthConnector:r}=b.getParams();i.loadingApprovalTransaction=!0;let o="Approve limit increase in your wallet";r?m.pushTransactionStack({onSuccess(){F.showLoading(o)}}):F.showLoading(o);try{await g.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:"eip155"}),await b.swapTokens(),await b.getTransaction(),i.approvalTransaction=void 0,i.loadingApprovalTransaction=!1}catch(n){let s=n;i.transactionError=s?.shortMessage,i.loadingApprovalTransaction=!1,F.showError(s?.shortMessage||"Transaction error"),D.sendEvent({type:"track",event:"SWAP_APPROVAL_ERROR",properties:{message:s?.shortMessage||s?.message||"Unknown",network:a.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:b.state.sourceToken?.symbol||"",swapToToken:b.state.toToken?.symbol||"",swapFromAmount:b.state.sourceTokenAmount||"",swapToAmount:b.state.toTokenAmount||"",isSmartAccount:N.state.preferredAccountTypes?.eip155===Z.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){if(!e)return;let{fromAddress:t,toTokenAmount:r,isAuthConnector:o}=b.getParams();i.loadingTransaction=!0;let n=`Swapping ${i.sourceToken?.symbol} to ${U.formatNumberToLocalString(r,3)} ${i.toToken?.symbol}`,s=`Swapped ${i.sourceToken?.symbol} to ${U.formatNumberToLocalString(r,3)} ${i.toToken?.symbol}`;o?m.pushTransactionStack({onSuccess(){m.replace("Account"),F.showLoading(n),We.resetState()}}):F.showLoading("Confirm transaction in your wallet");try{let c=[i.sourceToken?.address,i.toToken?.address].join(","),u=await g.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:"eip155"});return i.loadingTransaction=!1,F.showSuccess(s),D.sendEvent({type:"track",event:"SWAP_SUCCESS",properties:{network:a.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:b.state.sourceToken?.symbol||"",swapToToken:b.state.toToken?.symbol||"",swapFromAmount:b.state.sourceTokenAmount||"",swapToAmount:b.state.toTokenAmount||"",isSmartAccount:N.state.preferredAccountTypes?.eip155===Z.ACCOUNT_TYPES.SMART_ACCOUNT}}),We.resetState(),o||m.replace("Account"),We.getMyTokensWithBalance(c),u}catch(c){let u=c;i.transactionError=u?.shortMessage,i.loadingTransaction=!1,F.showError(u?.shortMessage||"Transaction error"),D.sendEvent({type:"track",event:"SWAP_ERROR",properties:{message:u?.shortMessage||u?.message||"Unknown",network:a.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:b.state.sourceToken?.symbol||"",swapToToken:b.state.toToken?.symbol||"",swapFromAmount:b.state.sourceTokenAmount||"",swapToAmount:b.state.toTokenAmount||"",isSmartAccount:N.state.preferredAccountTypes?.eip155===Z.ACCOUNT_TYPES.SMART_ACCOUNT}});return}},hasInsufficientToken(e,t){return pe.isInsufficientSourceTokenForSwap(e,t,i.myTokensWithBalance)},setTransactionDetails(){let{toTokenAddress:e,toTokenDecimals:t}=b.getParams();!e||!t||(i.gasPriceInUSD=pe.getGasPriceInUSD(i.networkPrice,BigInt(i.gasFee),BigInt(At)),i.priceImpact=pe.getPriceImpact({sourceTokenAmount:i.sourceTokenAmount,sourceTokenPriceInUSD:i.sourceTokenPriceInUSD,toTokenPriceInUSD:i.toTokenPriceInUSD,toTokenAmount:i.toTokenAmount}),i.maxSlippage=pe.getMaxSlippage(i.slippage,i.toTokenAmount),i.providerFee=pe.getProviderFee(i.sourceTokenAmount))}},b=x(We);var ae=A({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),dr={state:ae,subscribe(e){return O(ae,()=>e(ae))},subscribeKey(e,t){return _(ae,e,t)},showTooltip({message:e,triggerRect:t,variant:r}){ae.open=!0,ae.message=e,ae.triggerRect=t,ae.variant=r},hide(){ae.open=!1,ae.message="",ae.triggerRect={width:0,height:0,top:0,left:0}}},mr=x(dr);var Et={convertEVMChainIdToCoinType(e){if(e>=2147483648)throw new Error("Invalid chainId");return(2147483648|e)>>>0}};var oe=A({suggestions:[],loading:!1}),hr={state:oe,subscribe(e){return O(oe,()=>e(oe))},subscribeKey(e,t){return _(oe,e,t)},async resolveName(e){try{return await p.lookupEnsName(e)}catch(t){let r=t;throw new Error(r?.reasons?.[0]?.description||"Error resolving name")}},async isNameRegistered(e){try{return await p.lookupEnsName(e),!0}catch{return!1}},async getSuggestions(e){try{oe.loading=!0,oe.suggestions=[];let t=await p.getEnsNameSuggestions(e);return oe.suggestions=t.suggestions.map(r=>({...r,name:r.name}))||[],oe.suggestions}catch(t){let r=$e.parseEnsApiError(t,"Error fetching name suggestions");throw new Error(r)}finally{oe.loading=!1}},async getNamesForAddress(e){try{if(!a.state.activeCaipNetwork)return[];let r=w.getEnsFromCacheForAddress(e);if(r)return r;let o=await p.reverseLookupEnsName({address:e});return w.updateEnsCache({address:e,ens:o,timestamp:Date.now()}),o}catch(t){let r=$e.parseEnsApiError(t,"Error fetching names for address");throw new Error(r)}},async registerName(e){let t=a.state.activeCaipNetwork;if(!t)throw new Error("Network not found");let r=N.state.address,o=C.getAuthConnector();if(!r||!o)throw new Error("Address or auth connector not found");oe.loading=!0;try{let n=JSON.stringify({name:e,attributes:{},timestamp:Math.floor(Date.now()/1e3)});m.pushTransactionStack({onCancel(){m.replace("RegisterAccountName")}});let s=await g.signMessage(n);oe.loading=!1;let c=t.id;if(!c)throw new Error("Network not found");let u=Et.convertEVMChainIdToCoinType(Number(c));await p.registerEnsName({coinType:u,address:r,signature:s,message:n}),N.setProfileName(e,t.chainNamespace),m.replace("RegisterAccountNameSuccess")}catch(n){let s=$e.parseEnsApiError(n,`Error registering name ${e}`);throw m.replace("RegisterAccountName"),new Error(s)}finally{oe.loading=!1}},validateName(e){return/^[a-zA-Z0-9-]{4,}$/u.test(e)},parseEnsApiError(e,t){return e?.reasons?.[0]?.description||t}},$e=x(hr);var De=A({isLegalCheckboxChecked:!1}),fr={state:De,subscribe(e){return O(De,()=>e(De))},subscribeKey(e,t){return _(De,e,t)},setIsLegalCheckboxChecked(e){De.isLegalCheckboxChecked=e}};var Ie={getSIWX(){return S.state.siwx},async initializeIfEnabled(){let e=S.state.siwx,t=a.getActiveCaipAddress();if(!(e&&t))return;let[r,o,n]=t.split(":");if(a.checkIfSupportedNetwork(r))try{if((await e.getSessions(`${r}:${o}`,n)).length)return;await K.open({view:"SIWXSignMessage"})}catch(s){console.error("SIWXUtil:initializeIfEnabled",s),D.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:this.getSIWXEventProperties()}),await g._getClient()?.disconnect().catch(console.error),m.reset("Connect"),F.showError("A problem occurred while trying initialize authentication")}},async requestSignMessage(){let e=S.state.siwx,t=h.getPlainAddress(a.getActiveCaipAddress()),r=a.getActiveCaipNetwork(),o=g._getClient();if(!e)throw new Error("SIWX is not enabled");if(!t)throw new Error("No ActiveCaipAddress found");if(!r)throw new Error("No ActiveCaipNetwork or client found");if(!o)throw new Error("No ConnectionController client found");try{let n=await e.createMessage({chainId:r.caipNetworkId,accountAddress:t}),s=n.toString();C.getConnectorId(r.chainNamespace)===L.CONNECTOR_ID.AUTH&&m.pushTransactionStack({});let u=await o.signMessage(s);await e.addSession({data:n,message:s,signature:u}),K.close(),D.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:this.getSIWXEventProperties()})}catch(n){let s=this.getSIWXEventProperties();(!K.state.open||m.state.view==="ApproveTransaction")&&await K.open({view:"SIWXSignMessage"}),s.isSmartAccount?F.showError("This application might not support Smart Accounts"):F.showError("Signature declined"),D.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:s}),console.error("SWIXUtil:requestSignMessage",n)}},async cancelSignMessage(){try{this.getSIWX()?.getRequired?.()?await g.disconnect():K.close(),m.reset("Connect"),D.sendEvent({event:"CLICK_CANCEL_SIWX",type:"track",properties:this.getSIWXEventProperties()})}catch(e){console.error("SIWXUtil:cancelSignMessage",e)}},async getSessions(){let e=S.state.siwx,t=h.getPlainAddress(a.getActiveCaipAddress()),r=a.getActiveCaipNetwork();return e&&t&&r?e.getSessions(r.caipNetworkId,t):[]},async isSIWXCloseDisabled(){let e=this.getSIWX();if(e){let t=m.state.view==="ApproveTransaction",r=m.state.view==="SIWXSignMessage";if(t||r)return e.getRequired?.()&&(await this.getSessions()).length===0}return!1},async universalProviderAuthenticate({universalProvider:e,chains:t,methods:r}){let o=Ie.getSIWX(),n=new Set(t.map(u=>u.split(":")[0]));if(!o||n.size!==1||!n.has("eip155"))return!1;let s=await o.createMessage({chainId:a.getActiveCaipNetwork()?.caipNetworkId||"",accountAddress:""}),c=await e.authenticate({nonce:s.nonce,domain:s.domain,uri:s.uri,exp:s.expirationTime,iat:s.issuedAt,nbf:s.notBefore,requestId:s.requestId,version:s.version,resources:s.resources,statement:s.statement,chainId:s.chainId,methods:r,chains:[s.chainId,...t.filter(u=>u!==s.chainId)]});if(F.showLoading("Authenticating...",{autoClose:!1}),N.setConnectedWalletInfo({...c.session.peer.metadata,name:c.session.peer.metadata.name,icon:c.session.peer.metadata.icons?.[0],type:"WALLET_CONNECT"},Array.from(n)[0]),c?.auths?.length){let u=c.auths.map(d=>{let M=e.client.formatAuthMessage({request:d.p,iss:d.p.iss});return{data:{...d.p,accountAddress:d.p.iss.split(":").slice(-1).join(""),chainId:d.p.iss.split(":").slice(2,4).join(":"),uri:d.p.aud,version:d.p.version||s.version,expirationTime:d.p.exp,issuedAt:d.p.iat,notBefore:d.p.nbf},message:M,signature:d.s.s,cacao:d}});try{await o.setSessions(u),D.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:Ie.getSIWXEventProperties()})}catch(d){throw console.error("SIWX:universalProviderAuth - failed to set sessions",d),D.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:Ie.getSIWXEventProperties()}),await e.disconnect().catch(console.error),d}finally{F.hide()}}return!0},getSIWXEventProperties(){let e=a.state.activeChain;return{network:a.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:N.state.preferredAccountTypes?.[e]===Z.ACCOUNT_TYPES.SMART_ACCOUNT}},async clearSessions(){let e=this.getSIWX();e&&await e.setSessions([])}};var gr={isUnsupportedChainView(){return m.state.view==="UnsupportedChain"||m.state.view==="SwitchNetwork"&&m.state.history.includes("UnsupportedChain")},async safeClose(){if(this.isUnsupportedChainView()){K.shake();return}if(await Ie.isSIWXCloseDisabled()){K.shake();return}K.close()}};var wr={interpolate(e,t,r){if(e.length!==2||t.length!==2)throw new Error("inputRange and outputRange must be an array of length 2");let o=e[0]||0,n=e[1]||0,s=t[0]||0,c=t[1]||0;return r<o?s:r>n?c:(c-s)/(n-o)*(r-o)+s}};var tt,_e,ke;function Cr(e,t){tt=document.createElement("style"),_e=document.createElement("style"),ke=document.createElement("style"),tt.textContent=rt(e).core.cssText,_e.textContent=rt(e).dark.cssText,ke.textContent=rt(e).light.cssText,document.head.appendChild(tt),document.head.appendChild(_e),document.head.appendChild(ke),vt(t)}function vt(e){_e&&ke&&(e==="light"?(_e.removeAttribute("media"),ke.media="enabled"):(ke.removeAttribute("media"),_e.media="enabled"))}function rt(e){return{core:ge`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      @keyframes w3m-shake {
        0% {
          transform: scale(1) rotate(0deg);
        }
        20% {
          transform: scale(1) rotate(-1deg);
        }
        40% {
          transform: scale(1) rotate(1.5deg);
        }
        60% {
          transform: scale(1) rotate(-1.5deg);
        }
        80% {
          transform: scale(1) rotate(1deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes w3m-iframe-fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes w3m-iframe-zoom-in {
        0% {
          transform: translateY(50px);
          opacity: 0;
        }
        100% {
          transform: translateY(0px);
          opacity: 1;
        }
      }
      @keyframes w3m-iframe-zoom-in-mobile {
        0% {
          transform: scale(0.95);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      :root {
        --w3m-modal-width: 360px;
        --w3m-color-mix-strength: ${ee(e?.["--w3m-color-mix-strength"]?`${e["--w3m-color-mix-strength"]}%`:"0%")};
        --w3m-font-family: ${ee(e?.["--w3m-font-family"]||"Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;")};
        --w3m-font-size-master: ${ee(e?.["--w3m-font-size-master"]||"10px")};
        --w3m-border-radius-master: ${ee(e?.["--w3m-border-radius-master"]||"4px")};
        --w3m-z-index: ${ee(e?.["--w3m-z-index"]||999)};

        --wui-font-family: var(--w3m-font-family);

        --wui-font-size-mini: calc(var(--w3m-font-size-master) * 0.8);
        --wui-font-size-micro: var(--w3m-font-size-master);
        --wui-font-size-tiny: calc(var(--w3m-font-size-master) * 1.2);
        --wui-font-size-small: calc(var(--w3m-font-size-master) * 1.4);
        --wui-font-size-paragraph: calc(var(--w3m-font-size-master) * 1.6);
        --wui-font-size-medium: calc(var(--w3m-font-size-master) * 1.8);
        --wui-font-size-large: calc(var(--w3m-font-size-master) * 2);
        --wui-font-size-title-6: calc(var(--w3m-font-size-master) * 2.2);
        --wui-font-size-medium-title: calc(var(--w3m-font-size-master) * 2.4);
        --wui-font-size-2xl: calc(var(--w3m-font-size-master) * 4);

        --wui-border-radius-5xs: var(--w3m-border-radius-master);
        --wui-border-radius-4xs: calc(var(--w3m-border-radius-master) * 1.5);
        --wui-border-radius-3xs: calc(var(--w3m-border-radius-master) * 2);
        --wui-border-radius-xxs: calc(var(--w3m-border-radius-master) * 3);
        --wui-border-radius-xs: calc(var(--w3m-border-radius-master) * 4);
        --wui-border-radius-s: calc(var(--w3m-border-radius-master) * 5);
        --wui-border-radius-m: calc(var(--w3m-border-radius-master) * 7);
        --wui-border-radius-l: calc(var(--w3m-border-radius-master) * 9);
        --wui-border-radius-3xl: calc(var(--w3m-border-radius-master) * 20);

        --wui-font-weight-light: 400;
        --wui-font-weight-regular: 500;
        --wui-font-weight-medium: 600;
        --wui-font-weight-bold: 700;

        --wui-letter-spacing-2xl: -1.6px;
        --wui-letter-spacing-medium-title: -0.96px;
        --wui-letter-spacing-title-6: -0.88px;
        --wui-letter-spacing-large: -0.8px;
        --wui-letter-spacing-medium: -0.72px;
        --wui-letter-spacing-paragraph: -0.64px;
        --wui-letter-spacing-small: -0.56px;
        --wui-letter-spacing-tiny: -0.48px;
        --wui-letter-spacing-micro: -0.2px;
        --wui-letter-spacing-mini: -0.16px;

        --wui-spacing-0: 0px;
        --wui-spacing-4xs: 2px;
        --wui-spacing-3xs: 4px;
        --wui-spacing-xxs: 6px;
        --wui-spacing-2xs: 7px;
        --wui-spacing-xs: 8px;
        --wui-spacing-1xs: 10px;
        --wui-spacing-s: 12px;
        --wui-spacing-m: 14px;
        --wui-spacing-l: 16px;
        --wui-spacing-2l: 18px;
        --wui-spacing-xl: 20px;
        --wui-spacing-xxl: 24px;
        --wui-spacing-2xl: 32px;
        --wui-spacing-3xl: 40px;
        --wui-spacing-4xl: 90px;
        --wui-spacing-5xl: 95px;

        --wui-icon-box-size-xxs: 14px;
        --wui-icon-box-size-xs: 20px;
        --wui-icon-box-size-sm: 24px;
        --wui-icon-box-size-md: 32px;
        --wui-icon-box-size-mdl: 36px;
        --wui-icon-box-size-lg: 40px;
        --wui-icon-box-size-2lg: 48px;
        --wui-icon-box-size-xl: 64px;

        --wui-icon-size-inherit: inherit;
        --wui-icon-size-xxs: 10px;
        --wui-icon-size-xs: 12px;
        --wui-icon-size-sm: 14px;
        --wui-icon-size-md: 16px;
        --wui-icon-size-mdl: 18px;
        --wui-icon-size-lg: 20px;
        --wui-icon-size-xl: 24px;
        --wui-icon-size-xxl: 28px;

        --wui-wallet-image-size-inherit: inherit;
        --wui-wallet-image-size-sm: 40px;
        --wui-wallet-image-size-md: 56px;
        --wui-wallet-image-size-lg: 80px;

        --wui-visual-size-size-inherit: inherit;
        --wui-visual-size-sm: 40px;
        --wui-visual-size-md: 55px;
        --wui-visual-size-lg: 80px;

        --wui-box-size-md: 100px;
        --wui-box-size-lg: 120px;

        --wui-ease-out-power-2: cubic-bezier(0, 0, 0.22, 1);
        --wui-ease-out-power-1: cubic-bezier(0, 0, 0.55, 1);

        --wui-ease-in-power-3: cubic-bezier(0.66, 0, 1, 1);
        --wui-ease-in-power-2: cubic-bezier(0.45, 0, 1, 1);
        --wui-ease-in-power-1: cubic-bezier(0.3, 0, 1, 1);

        --wui-ease-inout-power-1: cubic-bezier(0.45, 0, 0.55, 1);

        --wui-duration-lg: 200ms;
        --wui-duration-md: 125ms;
        --wui-duration-sm: 75ms;

        --wui-path-network-sm: path(
          'M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z'
        );

        --wui-path-network-md: path(
          'M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z'
        );

        --wui-path-network-lg: path(
          'M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z'
        );

        --wui-width-network-sm: 36px;
        --wui-width-network-md: 48px;
        --wui-width-network-lg: 86px;

        --wui-height-network-sm: 40px;
        --wui-height-network-md: 54px;
        --wui-height-network-lg: 96px;

        --wui-icon-size-network-xs: 12px;
        --wui-icon-size-network-sm: 16px;
        --wui-icon-size-network-md: 24px;
        --wui-icon-size-network-lg: 42px;

        --wui-color-inherit: inherit;

        --wui-color-inverse-100: #fff;
        --wui-color-inverse-000: #000;

        --wui-cover: rgba(20, 20, 20, 0.8);

        --wui-color-modal-bg: var(--wui-color-modal-bg-base);

        --wui-color-accent-100: var(--wui-color-accent-base-100);
        --wui-color-accent-090: var(--wui-color-accent-base-090);
        --wui-color-accent-080: var(--wui-color-accent-base-080);

        --wui-color-success-100: var(--wui-color-success-base-100);
        --wui-color-success-125: var(--wui-color-success-base-125);

        --wui-color-warning-100: var(--wui-color-warning-base-100);

        --wui-color-error-100: var(--wui-color-error-base-100);
        --wui-color-error-125: var(--wui-color-error-base-125);

        --wui-color-blue-100: var(--wui-color-blue-base-100);
        --wui-color-blue-90: var(--wui-color-blue-base-90);

        --wui-icon-box-bg-error-100: var(--wui-icon-box-bg-error-base-100);
        --wui-icon-box-bg-blue-100: var(--wui-icon-box-bg-blue-base-100);
        --wui-icon-box-bg-success-100: var(--wui-icon-box-bg-success-base-100);
        --wui-icon-box-bg-inverse-100: var(--wui-icon-box-bg-inverse-base-100);

        --wui-all-wallets-bg-100: var(--wui-all-wallets-bg-100);

        --wui-avatar-border: var(--wui-avatar-border-base);

        --wui-thumbnail-border: var(--wui-thumbnail-border-base);

        --wui-wallet-button-bg: var(--wui-wallet-button-bg-base);

        --wui-box-shadow-blue: var(--wui-color-accent-glass-020);
      }

      @supports (background: color-mix(in srgb, white 50%, black)) {
        :root {
          --wui-color-modal-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-modal-bg-base)
          );

          --wui-box-shadow-blue: color-mix(in srgb, var(--wui-color-accent-100) 20%, transparent);

          --wui-color-accent-100: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 100%,
            transparent
          );
          --wui-color-accent-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-glass-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-020: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 20%,
            transparent
          );
          --wui-color-accent-glass-015: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 15%,
            transparent
          );
          --wui-color-accent-glass-010: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 10%,
            transparent
          );
          --wui-color-accent-glass-005: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 5%,
            transparent
          );
          --wui-color-accent-002: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 2%,
            transparent
          );

          --wui-color-fg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-100)
          );
          --wui-color-fg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-125)
          );
          --wui-color-fg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-150)
          );
          --wui-color-fg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-175)
          );
          --wui-color-fg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-200)
          );
          --wui-color-fg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-225)
          );
          --wui-color-fg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-250)
          );
          --wui-color-fg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-275)
          );
          --wui-color-fg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-300)
          );
          --wui-color-fg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-325)
          );
          --wui-color-fg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-350)
          );

          --wui-color-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-100)
          );
          --wui-color-bg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-125)
          );
          --wui-color-bg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-150)
          );
          --wui-color-bg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-175)
          );
          --wui-color-bg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-200)
          );
          --wui-color-bg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-225)
          );
          --wui-color-bg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-250)
          );
          --wui-color-bg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-275)
          );
          --wui-color-bg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-300)
          );
          --wui-color-bg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-325)
          );
          --wui-color-bg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-350)
          );

          --wui-color-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-100)
          );
          --wui-color-success-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-125)
          );

          --wui-color-warning-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-warning-base-100)
          );

          --wui-color-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-100)
          );
          --wui-color-blue-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-100)
          );
          --wui-color-blue-90: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-90)
          );
          --wui-color-error-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-125)
          );

          --wui-icon-box-bg-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-error-base-100)
          );
          --wui-icon-box-bg-accent-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-blue-base-100)
          );
          --wui-icon-box-bg-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-success-base-100)
          );
          --wui-icon-box-bg-inverse-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-inverse-base-100)
          );

          --wui-all-wallets-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-all-wallets-bg-100)
          );

          --wui-avatar-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-avatar-border-base)
          );

          --wui-thumbnail-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-thumbnail-border-base)
          );

          --wui-wallet-button-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-wallet-button-bg-base)
          );
        }
      }
    `,light:ge`
      :root {
        --w3m-color-mix: ${ee(e?.["--w3m-color-mix"]||"#fff")};
        --w3m-accent: ${ee(te(e,"dark")["--w3m-accent"])};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: ${ee(te(e,"dark")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(230, 100%, 67%, 1);
        --wui-color-blueberry-090: hsla(231, 76%, 61%, 1);
        --wui-color-blueberry-080: hsla(230, 59%, 55%, 1);
        --wui-color-blueberry-050: hsla(231, 100%, 70%, 0.1);

        --wui-color-fg-100: #e4e7e7;
        --wui-color-fg-125: #d0d5d5;
        --wui-color-fg-150: #a8b1b1;
        --wui-color-fg-175: #a8b0b0;
        --wui-color-fg-200: #949e9e;
        --wui-color-fg-225: #868f8f;
        --wui-color-fg-250: #788080;
        --wui-color-fg-275: #788181;
        --wui-color-fg-300: #6e7777;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #363636;

        --wui-color-bg-100: #141414;
        --wui-color-bg-125: #191a1a;
        --wui-color-bg-150: #1e1f1f;
        --wui-color-bg-175: #222525;
        --wui-color-bg-200: #272a2a;
        --wui-color-bg-225: #2c3030;
        --wui-color-bg-250: #313535;
        --wui-color-bg-275: #363b3b;
        --wui-color-bg-300: #3b4040;
        --wui-color-bg-325: #252525;
        --wui-color-bg-350: #ffffff;

        --wui-color-success-base-100: #26d962;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f25a67;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 217, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 217, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 217, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 217, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 217, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 217, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 217, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 217, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 217, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 217, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(242, 90, 103, 0.01);
        --wui-color-error-glass-002: rgba(242, 90, 103, 0.02);
        --wui-color-error-glass-005: rgba(242, 90, 103, 0.05);
        --wui-color-error-glass-010: rgba(242, 90, 103, 0.1);
        --wui-color-error-glass-015: rgba(242, 90, 103, 0.15);
        --wui-color-error-glass-020: rgba(242, 90, 103, 0.2);
        --wui-color-error-glass-025: rgba(242, 90, 103, 0.25);
        --wui-color-error-glass-030: rgba(242, 90, 103, 0.3);
        --wui-color-error-glass-060: rgba(242, 90, 103, 0.6);
        --wui-color-error-glass-080: rgba(242, 90, 103, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-color-gray-glass-001: rgba(255, 255, 255, 0.01);
        --wui-color-gray-glass-002: rgba(255, 255, 255, 0.02);
        --wui-color-gray-glass-005: rgba(255, 255, 255, 0.05);
        --wui-color-gray-glass-010: rgba(255, 255, 255, 0.1);
        --wui-color-gray-glass-015: rgba(255, 255, 255, 0.15);
        --wui-color-gray-glass-020: rgba(255, 255, 255, 0.2);
        --wui-color-gray-glass-025: rgba(255, 255, 255, 0.25);
        --wui-color-gray-glass-030: rgba(255, 255, 255, 0.3);
        --wui-color-gray-glass-060: rgba(255, 255, 255, 0.6);
        --wui-color-gray-glass-080: rgba(255, 255, 255, 0.8);
        --wui-color-gray-glass-090: rgba(255, 255, 255, 0.9);

        --wui-color-dark-glass-100: rgba(42, 42, 42, 1);

        --wui-icon-box-bg-error-base-100: #3c2426;
        --wui-icon-box-bg-blue-base-100: #20303f;
        --wui-icon-box-bg-success-base-100: #1f3a28;
        --wui-icon-box-bg-inverse-base-100: #243240;

        --wui-all-wallets-bg-100: #222b35;

        --wui-avatar-border-base: #252525;

        --wui-thumbnail-border-base: #252525;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --w3m-card-embedded-shadow-color: rgb(17 17 18 / 25%);
      }
    `,dark:ge`
      :root {
        --w3m-color-mix: ${ee(e?.["--w3m-color-mix"]||"#000")};
        --w3m-accent: ${ee(te(e,"light")["--w3m-accent"])};
        --w3m-default: #000;

        --wui-color-modal-bg-base: ${ee(te(e,"light")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(231, 100%, 70%, 1);
        --wui-color-blueberry-090: hsla(231, 97%, 72%, 1);
        --wui-color-blueberry-080: hsla(231, 92%, 74%, 1);

        --wui-color-fg-100: #141414;
        --wui-color-fg-125: #2d3131;
        --wui-color-fg-150: #474d4d;
        --wui-color-fg-175: #636d6d;
        --wui-color-fg-200: #798686;
        --wui-color-fg-225: #828f8f;
        --wui-color-fg-250: #8b9797;
        --wui-color-fg-275: #95a0a0;
        --wui-color-fg-300: #9ea9a9;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #d0d0d0;

        --wui-color-bg-100: #ffffff;
        --wui-color-bg-125: #f5fafa;
        --wui-color-bg-150: #f3f8f8;
        --wui-color-bg-175: #eef4f4;
        --wui-color-bg-200: #eaf1f1;
        --wui-color-bg-225: #e5eded;
        --wui-color-bg-250: #e1e9e9;
        --wui-color-bg-275: #dce7e7;
        --wui-color-bg-300: #d8e3e3;
        --wui-color-bg-325: #f3f3f3;
        --wui-color-bg-350: #202020;

        --wui-color-success-base-100: #26b562;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f05142;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 181, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 181, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 181, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 181, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 181, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 181, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 181, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 181, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 181, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 181, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(240, 81, 66, 0.01);
        --wui-color-error-glass-002: rgba(240, 81, 66, 0.02);
        --wui-color-error-glass-005: rgba(240, 81, 66, 0.05);
        --wui-color-error-glass-010: rgba(240, 81, 66, 0.1);
        --wui-color-error-glass-015: rgba(240, 81, 66, 0.15);
        --wui-color-error-glass-020: rgba(240, 81, 66, 0.2);
        --wui-color-error-glass-025: rgba(240, 81, 66, 0.25);
        --wui-color-error-glass-030: rgba(240, 81, 66, 0.3);
        --wui-color-error-glass-060: rgba(240, 81, 66, 0.6);
        --wui-color-error-glass-080: rgba(240, 81, 66, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-icon-box-bg-error-base-100: #f4dfdd;
        --wui-icon-box-bg-blue-base-100: #d9ecfb;
        --wui-icon-box-bg-success-base-100: #daf0e4;
        --wui-icon-box-bg-inverse-base-100: #dcecfc;

        --wui-all-wallets-bg-100: #e8f1fa;

        --wui-avatar-border-base: #f3f4f4;

        --wui-thumbnail-border-base: #eaefef;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --wui-color-gray-glass-001: rgba(0, 0, 0, 0.01);
        --wui-color-gray-glass-002: rgba(0, 0, 0, 0.02);
        --wui-color-gray-glass-005: rgba(0, 0, 0, 0.05);
        --wui-color-gray-glass-010: rgba(0, 0, 0, 0.1);
        --wui-color-gray-glass-015: rgba(0, 0, 0, 0.15);
        --wui-color-gray-glass-020: rgba(0, 0, 0, 0.2);
        --wui-color-gray-glass-025: rgba(0, 0, 0, 0.25);
        --wui-color-gray-glass-030: rgba(0, 0, 0, 0.3);
        --wui-color-gray-glass-060: rgba(0, 0, 0, 0.6);
        --wui-color-gray-glass-080: rgba(0, 0, 0, 0.8);
        --wui-color-gray-glass-090: rgba(0, 0, 0, 0.9);

        --wui-color-dark-glass-100: rgba(233, 233, 233, 1);

        --w3m-card-embedded-shadow-color: rgb(224 225 233 / 25%);
      }
    `}}var il=ge`
  *,
  *::after,
  *::before,
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-style: normal;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--wui-font-family);
    backface-visibility: hidden;
  }
`,cl=ge`
  button,
  a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      box-shadow var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border, box-shadow, border-radius;
    outline: none;
    border: none;
    column-gap: var(--wui-spacing-3xs);
    background-color: transparent;
    text-decoration: none;
  }

  wui-flex {
    transition: border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius;
  }

  button:disabled > wui-wallet-image,
  button:disabled > wui-all-wallets-image,
  button:disabled > wui-network-image,
  button:disabled > wui-image,
  button:disabled > wui-transaction-visual,
  button:disabled > wui-logo {
    filter: grayscale(1);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-gray-glass-005);
    }

    button:active:enabled {
      background-color: var(--wui-color-gray-glass-010);
    }
  }

  button:disabled > wui-icon-box {
    opacity: 0.5;
  }

  input {
    border: none;
    outline: none;
    appearance: none;
  }
`,ll=ge`
  .wui-color-inherit {
    color: var(--wui-color-inherit);
  }

  .wui-color-accent-100 {
    color: var(--wui-color-accent-100);
  }

  .wui-color-error-100 {
    color: var(--wui-color-error-100);
  }

  .wui-color-blue-100 {
    color: var(--wui-color-blue-100);
  }

  .wui-color-blue-90 {
    color: var(--wui-color-blue-90);
  }

  .wui-color-error-125 {
    color: var(--wui-color-error-125);
  }

  .wui-color-success-100 {
    color: var(--wui-color-success-100);
  }

  .wui-color-success-125 {
    color: var(--wui-color-success-125);
  }

  .wui-color-inverse-100 {
    color: var(--wui-color-inverse-100);
  }

  .wui-color-inverse-000 {
    color: var(--wui-color-inverse-000);
  }

  .wui-color-fg-100 {
    color: var(--wui-color-fg-100);
  }

  .wui-color-fg-200 {
    color: var(--wui-color-fg-200);
  }

  .wui-color-fg-300 {
    color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    color: var(--wui-color-fg-350);
  }

  .wui-bg-color-inherit {
    background-color: var(--wui-color-inherit);
  }

  .wui-bg-color-blue-100 {
    background-color: var(--wui-color-accent-100);
  }

  .wui-bg-color-error-100 {
    background-color: var(--wui-color-error-100);
  }

  .wui-bg-color-error-125 {
    background-color: var(--wui-color-error-125);
  }

  .wui-bg-color-success-100 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-success-125 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-inverse-100 {
    background-color: var(--wui-color-inverse-100);
  }

  .wui-bg-color-inverse-000 {
    background-color: var(--wui-color-inverse-000);
  }

  .wui-bg-color-fg-100 {
    background-color: var(--wui-color-fg-100);
  }

  .wui-bg-color-fg-200 {
    background-color: var(--wui-color-fg-200);
  }

  .wui-bg-color-fg-300 {
    background-color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    background-color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    background-color: var(--wui-color-fg-350);
  }
`;var je={getSpacingStyles(e,t){if(Array.isArray(e))return e[t]?`var(--wui-spacing-${e[t]})`:void 0;if(typeof e=="string")return`var(--wui-spacing-${e})`},getFormattedDate(e){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(e)},getHostName(e){try{return new URL(e).hostname}catch{return""}},getTruncateString({string:e,charsStart:t,charsEnd:r,truncate:o}){return e.length<=t+r?e:o==="end"?`${e.substring(0,t)}...`:o==="start"?`...${e.substring(e.length-r)}`:`${e.substring(0,Math.floor(t))}...${e.substring(e.length-Math.floor(r))}`},generateAvatarColors(e){let r=e.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),o=this.hexToRgb(r),n=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),c=100-3*Number(n?.replace("px","")),u=`${c}% ${c}% at 65% 40%`,d=[];for(let M=0;M<5;M+=1){let T=this.tintColor(o,.15*M);d.push(`rgb(${T[0]}, ${T[1]}, ${T[2]})`)}return`
    --local-color-1: ${d[0]};
    --local-color-2: ${d[1]};
    --local-color-3: ${d[2]};
    --local-color-4: ${d[3]};
    --local-color-5: ${d[4]};
    --local-radial-circle: ${u}
   `},hexToRgb(e){let t=parseInt(e,16),r=t>>16&255,o=t>>8&255,n=t&255;return[r,o,n]},tintColor(e,t){let[r,o,n]=e,s=Math.round(r+(255-r)*t),c=Math.round(o+(255-o)*t),u=Math.round(n+(255-n)*t);return[s,c,u]},isNumber(e){return{number:/^[0-9]+$/u}.number.test(e)},getColorTheme(e){return e||(typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark")},splitBalance(e){let t=e.split(".");return t.length===2?[t[0],t[1]]:["0","00"]},roundNumber(e,t,r){return e.toString().length>=t?Number(e).toFixed(r):e},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})}};var br=3,Ar=["receive","deposit","borrow","claim"],Er=["withdraw","repay","burn"],ot={getTransactionGroupTitle(e,t){let r=Le.getYear(),o=Le.getMonthNameByIndex(t);return e===r?o:`${o} ${e}`},getTransactionImages(e){let[t,r]=e,o=!!t&&e?.every(c=>!!c.nft_info),n=e?.length>1;return e?.length===2&&!o?[this.getTransactionImage(t),this.getTransactionImage(r)]:n?e.map(c=>this.getTransactionImage(c)):[this.getTransactionImage(t)]},getTransactionImage(e){return{type:ot.getTransactionTransferTokenType(e),url:ot.getTransactionImageURL(e)}},getTransactionImageURL(e){let t,r=!!e?.nft_info,o=!!e?.fungible_info;return e&&r?t=e?.nft_info?.content?.preview?.url:e&&o&&(t=e?.fungible_info?.icon?.url),t},getTransactionTransferTokenType(e){if(e?.fungible_info)return"FUNGIBLE";if(e?.nft_info)return"NFT"},getTransactionDescriptions(e){let t=e?.metadata?.operationType,r=e?.transfers,o=e?.transfers?.length>0,n=e?.transfers?.length>1,s=o&&r?.every($=>!!$?.fungible_info),[c,u]=r,d=this.getTransferDescription(c),M=this.getTransferDescription(u);if(!o)return(t==="send"||t==="receive")&&s?(d=je.getTruncateString({string:e?.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),M=je.getTruncateString({string:e?.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[d,M]):[e.metadata.status];if(n)return r.map($=>this.getTransferDescription($));let T="";return Ar.includes(t)?T="+":Er.includes(t)&&(T="-"),d=T.concat(d),[d]},getTransferDescription(e){let t="";return e&&(e?.nft_info?t=e?.nft_info?.name||"-":e?.fungible_info&&(t=this.getFungibleTransferDescription(e)||"-")),t},getFungibleTransferDescription(e){return e?[this.getQuantityFixedValue(e?.quantity.numeric),e?.fungible_info?.symbol].join(" ").trim():null},getQuantityFixedValue(e){return e?parseFloat(e).toFixed(br):null}};function vr(e,t){let{kind:r,elements:o}=t;return{kind:r,elements:o,finisher(n){customElements.get(e)||customElements.define(e,n)}}}function Sr(e,t){return customElements.get(e)||customElements.define(e,t),t}function Nr(e){return function(r){return typeof r=="function"?Sr(e,r):vr(e,r)}}export{Le as a,L as b,U as c,Ot as d,Ke as e,Rt as f,Ut as g,te as h,q as i,w as j,h as k,S as l,z as m,Je as n,Ue as o,D as p,E as q,m as r,Te as s,C as t,Ts as u,ys as v,Is as w,_s as x,Z as y,F as z,Ae as A,g as B,R as C,a as D,p as E,N as F,ze as G,K as H,et as I,b as J,mr as K,$e as L,fr as M,Ie as N,gr as O,wr as P,Cr as Q,il as R,cl as S,ll as T,je as U,ot as V,Nr as W};
