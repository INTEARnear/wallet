import{d as y,e as B,f as he,g as me,h as x,i as ut,j as kt,k as Pt,l as Rt,m as Ot,n as _e}from"./chunk-ETAVA44A.js";import{t as xt}from"./chunk-JK5MJGFP.js";import{d as Ut}from"./chunk-H6T4G3YK.js";import{Q as pt}from"./chunk-OZZRRPYE.js";import{a as ae,b as ve}from"./chunk-5RP2GFJC.js";import{f as $e,h as c,i as d,j as l,n as u}from"./chunk-KGCAX4NX.js";c();u();l();var Se=$e(kt(),1),dt=$e(Pt(),1),mt=$e(Rt(),1),ht=$e(Ot(),1);Se.default.extend(mt.default);Se.default.extend(ht.default);var Dt={...dt.default,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}},Mt=["January","February","March","April","May","June","July","August","September","October","November","December"];Se.default.locale("en-web3-modal",Dt);var je={getMonthNameByIndex(e){return Mt[e]},getYear(e=new Date().toISOString()){return(0,Se.default)(e).year()},getRelativeDateFromNow(e){return(0,Se.default)(e).locale("en-web3-modal").fromNow(!0)},formatDate(e,t="DD MMM"){return(0,Se.default)(e).format(t)}};c();u();l();var j={WC_NAME_SUFFIX:".reown.id",WC_NAME_SUFFIX_LEGACY:".wcn.id",BLOCKCHAIN_API_RPC_URL:"https://rpc.walletconnect.org",PULSE_API_URL:"https://pulse.walletconnect.org",W3M_API_URL:"https://api.web3modal.org",CONNECTOR_ID:{WALLET_CONNECT:"walletConnect",INJECTED:"injected",WALLET_STANDARD:"announced",COINBASE:"coinbaseWallet",COINBASE_SDK:"coinbaseWalletSDK",SAFE:"safe",LEDGER:"ledger",OKX:"okx",EIP6963:"eip6963",AUTH:"ID_AUTH"},CONNECTOR_NAMES:{AUTH:"Auth"},AUTH_CONNECTOR_SUPPORTED_CHAINS:["eip155","solana"],LIMITS:{PENDING_TRANSACTIONS:99},CHAIN:{EVM:"eip155",SOLANA:"solana",POLKADOT:"polkadot",BITCOIN:"bip122"},CHAIN_NAME_MAP:{eip155:"EVM Networks",solana:"Solana",polkadot:"Polkadot",bip122:"Bitcoin",cosmos:"Cosmos"},ADAPTER_TYPES:{BITCOIN:"bitcoin",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5"},USDT_CONTRACT_ADDRESSES:["0xdac17f958d2ee523a2206206994597c13d831ec7","0xc2132d05d31c914a87c6611c10748aeb04b58e8f","0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7","0x919C1c267BC06a7039e03fcc2eF738525769109c","0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e","0x55d398326f99059fF775485246999027B3197955","0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"],HTTP_STATUS_CODES:{SERVICE_UNAVAILABLE:503,FORBIDDEN:403},UNSUPPORTED_NETWORK_NAME:"Unknown Network",SECURE_SITE_SDK_ORIGIN:(typeof d<"u"&&typeof d.env<"u"?d.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org"};c();u();l();var F={bigNumber(e){return e?new _e(e):new _e(0)},multiply(e,t){if(e===void 0||t===void 0)return new _e(0);let r=new _e(e),o=new _e(t);return r.times(o)},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})},parseLocalStringToNumber(e){return e===void 0?0:parseFloat(e.replace(/,/gu,""))}};c();u();l();var Lt={URLS:{FAQ:"https://walletconnect.com/faq"}};c();u();l();function ie(e,t){return t==="light"?{"--w3m-accent":e?.["--w3m-accent"]||"hsla(231, 100%, 70%, 1)","--w3m-background":"#fff"}:{"--w3m-accent":e?.["--w3m-accent"]||"hsla(230, 100%, 67%, 1)","--w3m-background":"#121313"}}c();u();l();c();u();l();var Xe={caipNetworkIdToNumber(e){return e?Number(e.split(":")[1]):void 0},parseEvmChainId(e){return typeof e=="string"?this.caipNetworkIdToNumber(e):e},getNetworksByNamespace(e,t){return e?.filter(r=>r.chainNamespace===t)||[]},getFirstNetworkByNamespace(e,t){return this.getNetworksByNamespace(e,t)[0]},getNetworkNameByCaipNetworkId(e,t){if(!t)return;let r=e.find(n=>n.caipNetworkId===t);if(r)return r.name;let[o]=t.split(":");return j.CHAIN_NAME_MAP?.[o]||void 0}};c();u();l();var Bt={numericInputKeyDown(e,t,r){let o=["Backspace","Meta","Ctrl","a","A","c","C","x","X","v","V","ArrowLeft","ArrowRight","Tab"],n=e.metaKey||e.ctrlKey,s=e.key,p=s.toLocaleLowerCase(),h=p==="a",C=p==="c",$=p==="v",R=p==="x",z=s===",",Ee=s===".",We=s>="0"&&s<="9";!n&&(h||C||$||R)&&e.preventDefault(),t==="0"&&!z&&!Ee&&s==="0"&&e.preventDefault(),t==="0"&&We&&(r(s),e.preventDefault()),(z||Ee)&&(t||(r("0."),e.preventDefault()),(t?.includes(".")||t?.includes(","))&&e.preventDefault()),!We&&!o.includes(s)&&!Ee&&!z&&e.preventDefault()}};c();u();l();c();u();l();var ft=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];c();u();l();var gt=[{type:"function",name:"approve",stateMutability:"nonpayable",inputs:[{name:"spender",type:"address"},{name:"amount",type:"uint256"}],outputs:[{type:"bool"}]}];c();u();l();var wt=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"sender",type:"address"},{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];var Je={getERC20Abi:e=>j.USDT_CONTRACT_ADDRESSES.includes(e)?wt:ft,getSwapAbi:()=>gt};c();u();l();var Ft={validateCaipAddress(e){if(e.split(":")?.length!==3)throw new Error("Invalid CAIP Address");return e},parseCaipAddress(e){let t=e.split(":");if(t.length!==3)throw new Error(`Invalid CAIP-10 address: ${e}`);let[r,o,n]=t;if(!r||!o||!n)throw new Error(`Invalid CAIP-10 address: ${e}`);return{chainNamespace:r,chainId:o,address:n}},parseCaipNetworkId(e){let t=e.split(":");if(t.length!==2)throw new Error(`Invalid CAIP-2 network id: ${e}`);let[r,o]=t;if(!r||!o)throw new Error(`Invalid CAIP-2 network id: ${e}`);return{chainNamespace:r,chainId:o}}};c();u();l();var O={WALLET_ID:"@appkit/wallet_id",WALLET_NAME:"@appkit/wallet_name",SOLANA_WALLET:"@appkit/solana_wallet",SOLANA_CAIP_CHAIN:"@appkit/solana_caip_chain",ACTIVE_CAIP_NETWORK_ID:"@appkit/active_caip_network_id",CONNECTED_SOCIAL:"@appkit/connected_social",CONNECTED_SOCIAL_USERNAME:"@appkit-wallet/SOCIAL_USERNAME",RECENT_WALLETS:"@appkit/recent_wallets",DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",ACTIVE_NAMESPACE:"@appkit/active_namespace",CONNECTED_NAMESPACES:"@appkit/connected_namespaces",CONNECTION_STATUS:"@appkit/connection_status",SIWX_AUTH_TOKEN:"@appkit/siwx-auth-token",SIWX_NONCE_TOKEN:"@appkit/siwx-nonce-token",TELEGRAM_SOCIAL_PROVIDER:"@appkit/social_provider",NATIVE_BALANCE_CACHE:"@appkit/native_balance_cache",PORTFOLIO_CACHE:"@appkit/portfolio_cache",ENS_CACHE:"@appkit/ens_cache",IDENTITY_CACHE:"@appkit/identity_cache",PREFERRED_ACCOUNT_TYPES:"@appkit/preferred_account_types",CONNECTIONS:"@appkit/connections"};function Me(e){if(!e)throw new Error("Namespace is required for CONNECTED_CONNECTOR_ID");return`@appkit/${e}:connected_connector_id`}var _={setItem(e,t){Ne()&&t!==void 0&&localStorage.setItem(e,t)},getItem(e){if(Ne())return localStorage.getItem(e)||void 0},removeItem(e){Ne()&&localStorage.removeItem(e)},clear(){Ne()&&localStorage.clear()}};function Ne(){return typeof window<"u"&&typeof localStorage<"u"}c();u();l();Ut();var Wt="wc",$t="universal_provider",un=`${Wt}@2:${$t}:`,jt="https://rpc.walletconnect.org/v1/";var pn=`${jt}bundler`;c();u();l();var Qe=(typeof d<"u"&&typeof d.env<"u"?d.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org",Ze=[{label:"Coinbase",name:"coinbase",feeRange:"1-2%",url:"",supportedChains:["eip155"]},{label:"Meld.io",name:"meld",feeRange:"1-2%",url:"https://meldcrypto.com",supportedChains:["eip155","solana"]}],Ct="WXETMuFUQmqqybHuRkSgxv:25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU",X={FOUR_MINUTES_MS:24e4,TEN_SEC_MS:1e4,FIVE_SEC_MS:5e3,THREE_SEC_MS:3e3,ONE_SEC_MS:1e3,SECURE_SITE:Qe,SECURE_SITE_DASHBOARD:`${Qe}/dashboard`,SECURE_SITE_FAVICON:`${Qe}/images/favicon.png`,RESTRICTED_TIMEZONES:["ASIA/SHANGHAI","ASIA/URUMQI","ASIA/CHONGQING","ASIA/HARBIN","ASIA/KASHGAR","ASIA/MACAU","ASIA/HONG_KONG","ASIA/MACAO","ASIA/BEIJING","ASIA/HARBIN"],WC_COINBASE_PAY_SDK_CHAINS:["ethereum","arbitrum","polygon","berachain","avalanche-c-chain","optimism","celo","base"],WC_COINBASE_PAY_SDK_FALLBACK_CHAIN:"ethereum",WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP:{Ethereum:"ethereum","Arbitrum One":"arbitrum",Polygon:"polygon",Berachain:"berachain",Avalanche:"avalanche-c-chain","OP Mainnet":"optimism",Celo:"celo",Base:"base"},WC_COINBASE_ONRAMP_APP_ID:"bf18c88d-495a-463b-b249-0b9d3656cf5e",SWAP_SUGGESTED_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP"],SWAP_POPULAR_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP","METAL","DAI","CHAMP","WOLF","SALE","BAL","BUSD","MUST","BTCpx","ROUTE","HEX","WELT","amDAI","VSQ","VISION","AURUM","pSP","SNX","VC","LINK","CHP","amUSDT","SPHERE","FOX","GIDDY","GFC","OMEN","OX_OLD","DE","WNT"],BALANCE_SUPPORTED_CHAINS:["eip155","solana"],SWAP_SUPPORTED_NETWORKS:["eip155:1","eip155:42161","eip155:10","eip155:324","eip155:8453","eip155:56","eip155:137","eip155:100","eip155:43114","eip155:250","eip155:8217","eip155:1313161554"],NAMES_SUPPORTED_CHAIN_NAMESPACES:["eip155"],ONRAMP_SUPPORTED_CHAIN_NAMESPACES:["eip155","solana"],ACTIVITY_ENABLED_CHAIN_NAMESPACES:["eip155"],NATIVE_TOKEN_ADDRESS:{eip155:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",solana:"So11111111111111111111111111111111111111111",polkadot:"0x",bip122:"0x",cosmos:"0x"},CONVERT_SLIPPAGE_TOLERANCE:1,CONNECT_LABELS:{MOBILE:"Open and continue in the wallet app",WEB:"Open and continue in the wallet app"},SEND_SUPPORTED_NAMESPACES:["eip155","solana"],DEFAULT_REMOTE_FEATURES:{swaps:["1inch"],onramp:["coinbase","meld"],email:!0,socials:["google","x","discord","farcaster","github","apple","facebook"],activity:!0,reownBranding:!0},DEFAULT_REMOTE_FEATURES_DISABLED:{email:!1,socials:!1,swaps:!1,onramp:!1,activity:!1,reownBranding:!1},DEFAULT_FEATURES:{receive:!0,send:!0,emailShowWallets:!0,connectorTypeOrder:["walletConnect","recent","injected","featured","custom","external","recommended"],analytics:!0,allWallets:!0,legalCheckbox:!1,smartSessions:!1,collapseWallets:!1,walletFeaturesOrder:["onramp","swaps","receive","send"],connectMethodsOrder:void 0,pay:!1},DEFAULT_SOCIALS:["google","x","farcaster","discord","apple","github","facebook"],DEFAULT_ACCOUNT_TYPES:{bip122:"payment",eip155:"smartAccount",polkadot:"eoa",solana:"eoa"},ADAPTER_TYPES:{UNIVERSAL:"universal",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5",BITCOIN:"bitcoin"}};c();u();l();var S={cacheExpiry:{portfolio:3e4,nativeBalance:3e4,ens:3e5,identity:3e5},isCacheExpired(e,t){return Date.now()-e>t},getActiveNetworkProps(){let e=S.getActiveNamespace(),t=S.getActiveCaipNetworkId(),r=t?t.split(":")[1]:void 0,o=r?isNaN(Number(r))?r:Number(r):void 0;return{namespace:e,caipNetworkId:t,chainId:o}},setWalletConnectDeepLink({name:e,href:t}){try{_.setItem(O.DEEPLINK_CHOICE,JSON.stringify({href:t,name:e}))}catch{console.info("Unable to set WalletConnect deep link")}},getWalletConnectDeepLink(){try{let e=_.getItem(O.DEEPLINK_CHOICE);if(e)return JSON.parse(e)}catch{console.info("Unable to get WalletConnect deep link")}},deleteWalletConnectDeepLink(){try{_.removeItem(O.DEEPLINK_CHOICE)}catch{console.info("Unable to delete WalletConnect deep link")}},setActiveNamespace(e){try{_.setItem(O.ACTIVE_NAMESPACE,e)}catch{console.info("Unable to set active namespace")}},setActiveCaipNetworkId(e){try{_.setItem(O.ACTIVE_CAIP_NETWORK_ID,e),S.setActiveNamespace(e.split(":")[0])}catch{console.info("Unable to set active caip network id")}},getActiveCaipNetworkId(){try{return _.getItem(O.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to get active caip network id");return}},deleteActiveCaipNetworkId(){try{_.removeItem(O.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to delete active caip network id")}},deleteConnectedConnectorId(e){try{let t=Me(e);_.removeItem(t)}catch{console.info("Unable to delete connected connector id")}},setAppKitRecent(e){try{let t=S.getRecentWallets();t.find(o=>o.id===e.id)||(t.unshift(e),t.length>2&&t.pop(),_.setItem(O.RECENT_WALLETS,JSON.stringify(t)))}catch{console.info("Unable to set AppKit recent")}},getRecentWallets(){try{let e=_.getItem(O.RECENT_WALLETS);return e?JSON.parse(e):[]}catch{console.info("Unable to get AppKit recent")}return[]},setConnectedConnectorId(e,t){try{let r=Me(e);_.setItem(r,t)}catch{console.info("Unable to set Connected Connector Id")}},getActiveNamespace(){try{return _.getItem(O.ACTIVE_NAMESPACE)}catch{console.info("Unable to get active namespace")}},getConnectedConnectorId(e){if(e)try{let t=Me(e);return _.getItem(t)}catch{console.info("Unable to get connected connector id in namespace ",e)}},setConnectedSocialProvider(e){try{_.setItem(O.CONNECTED_SOCIAL,e)}catch{console.info("Unable to set connected social provider")}},getConnectedSocialProvider(){try{return _.getItem(O.CONNECTED_SOCIAL)}catch{console.info("Unable to get connected social provider")}},deleteConnectedSocialProvider(){try{_.removeItem(O.CONNECTED_SOCIAL)}catch{console.info("Unable to delete connected social provider")}},getConnectedSocialUsername(){try{return _.getItem(O.CONNECTED_SOCIAL_USERNAME)}catch{console.info("Unable to get connected social username")}},getStoredActiveCaipNetworkId(){return _.getItem(O.ACTIVE_CAIP_NETWORK_ID)?.split(":")?.[1]},setConnectionStatus(e){try{_.setItem(O.CONNECTION_STATUS,e)}catch{console.info("Unable to set connection status")}},getConnectionStatus(){try{return _.getItem(O.CONNECTION_STATUS)}catch{return}},getConnectedNamespaces(){try{let e=_.getItem(O.CONNECTED_NAMESPACES);return e?.length?e.split(","):[]}catch{return[]}},setConnectedNamespaces(e){try{let t=Array.from(new Set(e));_.setItem(O.CONNECTED_NAMESPACES,t.join(","))}catch{console.info("Unable to set namespaces in storage")}},addConnectedNamespace(e){try{let t=S.getConnectedNamespaces();t.includes(e)||(t.push(e),S.setConnectedNamespaces(t))}catch{console.info("Unable to add connected namespace")}},removeConnectedNamespace(e){try{let t=S.getConnectedNamespaces(),r=t.indexOf(e);r>-1&&(t.splice(r,1),S.setConnectedNamespaces(t))}catch{console.info("Unable to remove connected namespace")}},getTelegramSocialProvider(){try{return _.getItem(O.TELEGRAM_SOCIAL_PROVIDER)}catch{return console.info("Unable to get telegram social provider"),null}},setTelegramSocialProvider(e){try{_.setItem(O.TELEGRAM_SOCIAL_PROVIDER,e)}catch{console.info("Unable to set telegram social provider")}},removeTelegramSocialProvider(){try{_.removeItem(O.TELEGRAM_SOCIAL_PROVIDER)}catch{console.info("Unable to remove telegram social provider")}},getBalanceCache(){let e={};try{let t=_.getItem(O.PORTFOLIO_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromBalanceCache(e){try{let t=S.getBalanceCache();_.setItem(O.PORTFOLIO_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getBalanceCacheForCaipAddress(e){try{let r=S.getBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.portfolio))return r.balance;S.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateBalanceCache(e){try{let t=S.getBalanceCache();t[e.caipAddress]=e,_.setItem(O.PORTFOLIO_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getNativeBalanceCache(){let e={};try{let t=_.getItem(O.NATIVE_BALANCE_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromNativeBalanceCache(e){try{let t=S.getBalanceCache();_.setItem(O.NATIVE_BALANCE_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getNativeBalanceCacheForCaipAddress(e){try{let r=S.getNativeBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.nativeBalance))return r;console.info("Discarding cache for address",e),S.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateNativeBalanceCache(e){try{let t=S.getNativeBalanceCache();t[e.caipAddress]=e,_.setItem(O.NATIVE_BALANCE_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getEnsCache(){let e={};try{let t=_.getItem(O.ENS_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get ens name cache")}return e},getEnsFromCacheForAddress(e){try{let r=S.getEnsCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.ens))return r.ens;S.removeEnsFromCache(e)}catch{console.info("Unable to get ens name from cache",e)}},updateEnsCache(e){try{let t=S.getEnsCache();t[e.address]=e,_.setItem(O.ENS_CACHE,JSON.stringify(t))}catch{console.info("Unable to update ens name cache",e)}},removeEnsFromCache(e){try{let t=S.getEnsCache();_.setItem(O.ENS_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove ens name from cache",e)}},getIdentityCache(){let e={};try{let t=_.getItem(O.IDENTITY_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get identity cache")}return e},getIdentityFromCacheForAddress(e){try{let r=S.getIdentityCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.identity))return r.identity;S.removeIdentityFromCache(e)}catch{console.info("Unable to get identity from cache",e)}},updateIdentityCache(e){try{let t=S.getIdentityCache();t[e.address]={identity:e.identity,timestamp:e.timestamp},_.setItem(O.IDENTITY_CACHE,JSON.stringify(t))}catch{console.info("Unable to update identity cache",e)}},removeIdentityFromCache(e){try{let t=S.getIdentityCache();_.setItem(O.IDENTITY_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove identity from cache",e)}},clearAddressCache(){try{_.removeItem(O.PORTFOLIO_CACHE),_.removeItem(O.NATIVE_BALANCE_CACHE),_.removeItem(O.ENS_CACHE),_.removeItem(O.IDENTITY_CACHE)}catch{console.info("Unable to clear address cache")}},setPreferredAccountTypes(e){try{_.setItem(O.PREFERRED_ACCOUNT_TYPES,JSON.stringify(e))}catch{console.info("Unable to set preferred account types",e)}},getPreferredAccountTypes(){try{let e=_.getItem(O.PREFERRED_ACCOUNT_TYPES);return e?JSON.parse(e):{}}catch{console.info("Unable to get preferred account types")}return{}},setConnections(e,t){try{let r={...S.getConnections(),[t]:e};_.setItem(O.CONNECTIONS,JSON.stringify(r))}catch(r){console.error("Unable to sync connections to storage",r)}},getConnections(){try{let e=_.getItem(O.CONNECTIONS);return e?JSON.parse(e):{}}catch(e){return console.error("Unable to get connections from storage",e),{}}}};c();u();l();var A={isMobile(){return this.isClient()?!!(typeof window?.matchMedia=="function"&&window?.matchMedia("(pointer:coarse)")?.matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)):!1},checkCaipNetwork(e,t=""){return e?.caipNetworkId.toLocaleLowerCase().includes(t.toLowerCase())},isAndroid(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return A.isMobile()&&e.includes("android")},isIos(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return e.includes("iphone")||e.includes("ipad")},isSafari(){return this.isClient()?(window?.navigator.userAgent.toLowerCase()).includes("safari"):!1},isClient(){return typeof window<"u"},isPairingExpired(e){return e?e-Date.now()<=X.TEN_SEC_MS:!0},isAllowedRetry(e,t=X.ONE_SEC_MS){return Date.now()-e>=t},copyToClopboard(e){navigator.clipboard.writeText(e)},isIframe(){try{return window?.self!==window?.top}catch{return!1}},isSafeApp(){if(A.isClient()&&window.self!==window.top)try{let e=window?.location?.ancestorOrigins?.[0],t="https://app.safe.global";if(e){let r=new URL(e),o=new URL(t);return r.hostname===o.hostname}}catch{return!1}return!1},getPairingExpiry(){return Date.now()+X.FOUR_MINUTES_MS},getNetworkId(e){return e?.split(":")[1]},getPlainAddress(e){return e?.split(":")[2]},async wait(e){return new Promise(t=>{setTimeout(t,e)})},debounce(e,t=500){let r;return(...o)=>{function n(){e(...o)}r&&clearTimeout(r),r=setTimeout(n,t)}},isHttpUrl(e){return e.startsWith("http://")||e.startsWith("https://")},formatNativeUrl(e,t,r=null){if(A.isHttpUrl(e))return this.formatUniversalUrl(e,t);let o=e,n=r;o.includes("://")||(o=e.replaceAll("/","").replaceAll(":",""),o=`${o}://`),o.endsWith("/")||(o=`${o}/`),n&&!n?.endsWith("/")&&(n=`${n}/`),this.isTelegram()&&this.isAndroid()&&(t=encodeURIComponent(t));let s=encodeURIComponent(t);return{redirect:`${o}wc?uri=${s}`,redirectUniversalLink:n?`${n}wc?uri=${s}`:void 0,href:o}},formatUniversalUrl(e,t){if(!A.isHttpUrl(e))return this.formatNativeUrl(e,t);let r=e;r.endsWith("/")||(r=`${r}/`);let o=encodeURIComponent(t);return{redirect:`${r}wc?uri=${o}`,href:r}},getOpenTargetForPlatform(e){return e==="popupWindow"?e:this.isTelegram()?S.getTelegramSocialProvider()?"_top":"_blank":e},openHref(e,t,r){window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},returnOpenHref(e,t,r){return window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},isTelegram(){return typeof window<"u"&&(!!window.TelegramWebviewProxy||!!window.Telegram||!!window.TelegramWebviewProxyProto)},isPWA(){if(typeof window>"u")return!1;let e=window.matchMedia?.("(display-mode: standalone)")?.matches,t=window?.navigator?.standalone;return!!(e||t)},async preloadImage(e){let t=new Promise((r,o)=>{let n=new Image;n.onload=r,n.onerror=o,n.crossOrigin="anonymous",n.src=e});return Promise.race([t,A.wait(2e3)])},formatBalance(e,t){let r="0.000";if(typeof e=="string"){let o=Number(e);if(o){let n=Math.floor(o*1e3)/1e3;n&&(r=n.toString())}}return`${r}${t?` ${t}`:""}`},formatBalance2(e,t){let r;if(e==="0")r="0";else if(typeof e=="string"){let o=Number(e);o&&(r=o.toString().match(/^-?\d+(?:\.\d{0,3})?/u)?.[0])}return{value:r??"0",rest:r==="0"?"000":"",symbol:t}},getApiUrl(){return j.W3M_API_URL},getBlockchainApiUrl(){return j.BLOCKCHAIN_API_RPC_URL},getAnalyticsUrl(){return j.PULSE_API_URL},getUUID(){return crypto?.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu,e=>{let t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})},parseError(e){return typeof e=="string"?e:typeof e?.issues?.[0]?.message=="string"?e.issues[0].message:e instanceof Error?e.message:"Unknown error"},sortRequestedNetworks(e,t=[]){let r={};return t&&e&&(e.forEach((o,n)=>{r[o]=n}),t.sort((o,n)=>{let s=r[o.id],p=r[n.id];return s!==void 0&&p!==void 0?s-p:s!==void 0?-1:p!==void 0?1:0})),t},calculateBalance(e){let t=0;for(let r of e)t+=r.value??0;return t},formatTokenBalance(e){let t=e.toFixed(2),[r,o]=t.split(".");return{dollars:r,pennies:o}},isAddress(e,t="eip155"){switch(t){case"eip155":if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)){if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)||/^(?:0x)?[0-9A-F]{40}$/iu.test(e))return!0}else return!1;return!1;case"solana":return/[1-9A-HJ-NP-Za-km-z]{32,44}$/iu.test(e);default:return!1}},uniqueBy(e,t){let r=new Set;return e.filter(o=>{let n=o[t];return r.has(n)?!1:(r.add(n),!0)})},generateSdkVersion(e,t,r){let n=e.length===0?X.ADAPTER_TYPES.UNIVERSAL:e.map(s=>s.adapterType).join(",");return`${t}-${n}-${r}`},createAccount(e,t,r,o,n){return{namespace:e,address:t,type:r,publicKey:o,path:n}},isCaipAddress(e){if(typeof e!="string")return!1;let t=e.split(":"),r=t[0];return t.filter(Boolean).length===3&&r in j.CHAIN_NAME_MAP},isMac(){let e=window?.navigator.userAgent.toLowerCase();return e.includes("macintosh")&&!e.includes("safari")},formatTelegramSocialLoginUrl(e){let t=`--${encodeURIComponent(window?.location.href)}`,r="state=";if(new URL(e).host==="auth.magic.link"){let n="provider_authorization_url=",s=e.substring(e.indexOf(n)+n.length),p=this.injectIntoUrl(decodeURIComponent(s),r,t);return e.replace(s,encodeURIComponent(p))}return this.injectIntoUrl(e,r,t)},injectIntoUrl(e,t,r){let o=e.indexOf(t);if(o===-1)throw new Error(`${t} parameter not found in the URL: ${e}`);let n=e.indexOf("&",o),s=t.length,p=n!==-1?n:e.length,h=e.substring(0,o+s),C=e.substring(o+s,p),$=e.substring(n),R=C+r;return h+R+$}};c();u();l();c();u();l();var bt={getFeatureValue(e,t){let r=t?.[e];return r===void 0?X.DEFAULT_FEATURES[e]:r},filterSocialsByPlatform(e){if(!e||!e.length)return e;if(A.isTelegram()){if(A.isIos())return e.filter(t=>t!=="google");if(A.isMac())return e.filter(t=>t!=="x");if(A.isAndroid())return e.filter(t=>!["facebook","x"].includes(t))}return e}};var E=y({features:X.DEFAULT_FEATURES,projectId:"",sdkType:"appkit",sdkVersion:"html-wagmi-undefined",defaultAccountTypes:X.DEFAULT_ACCOUNT_TYPES,enableNetworkSwitch:!0,experimental_preferUniversalLinks:!1,remoteFeatures:{}}),k={state:E,subscribeKey(e,t){return x(E,e,t)},setOptions(e){Object.assign(E,e)},setRemoteFeatures(e){if(!e)return;let t={...E.remoteFeatures,...e};E.remoteFeatures=t,E.remoteFeatures?.socials&&(E.remoteFeatures.socials=bt.filterSocialsByPlatform(E.remoteFeatures.socials))},setFeatures(e){if(!e)return;E.features||(E.features=X.DEFAULT_FEATURES);let t={...E.features,...e};E.features=t},setProjectId(e){E.projectId=e},setCustomRpcUrls(e){E.customRpcUrls=e},setAllWallets(e){E.allWallets=e},setIncludeWalletIds(e){E.includeWalletIds=e},setExcludeWalletIds(e){E.excludeWalletIds=e},setFeaturedWalletIds(e){E.featuredWalletIds=e},setTokens(e){E.tokens=e},setTermsConditionsUrl(e){E.termsConditionsUrl=e},setPrivacyPolicyUrl(e){E.privacyPolicyUrl=e},setCustomWallets(e){E.customWallets=e},setIsSiweEnabled(e){E.isSiweEnabled=e},setIsUniversalProvider(e){E.isUniversalProvider=e},setSdkVersion(e){E.sdkVersion=e},setMetadata(e){E.metadata=e},setDisableAppend(e){E.disableAppend=e},setEIP6963Enabled(e){E.enableEIP6963=e},setDebug(e){E.debug=e},setEnableWalletConnect(e){E.enableWalletConnect=e},setEnableWalletGuide(e){E.enableWalletGuide=e},setEnableAuthLogger(e){E.enableAuthLogger=e},setEnableWallets(e){E.enableWallets=e},setPreferUniversalLinks(e){E.experimental_preferUniversalLinks=e},setHasMultipleAddresses(e){E.hasMultipleAddresses=e},setSIWX(e){E.siwx=e},setConnectMethodsOrder(e){E.features={...E.features,connectMethodsOrder:e}},setWalletFeaturesOrder(e){E.features={...E.features,walletFeaturesOrder:e}},setSocialsOrder(e){E.remoteFeatures={...E.remoteFeatures,socials:e}},setCollapseWallets(e){E.features={...E.features,collapseWallets:e}},setEnableEmbedded(e){E.enableEmbedded=e},setAllowUnsupportedChain(e){E.allowUnsupportedChain=e},setManualWCControl(e){E.manualWCControl=e},setEnableNetworkSwitch(e){E.enableNetworkSwitch=e},setDefaultAccountTypes(e={}){Object.entries(e).forEach(([t,r])=>{r&&(E.defaultAccountTypes[t]=r)})},setUniversalProviderConfigOverride(e){E.universalProviderConfigOverride=e},getUniversalProviderConfigOverride(){return E.universalProviderConfigOverride},getSnapshot(){return he(E)}};c();u();l();c();u();l();c();u();l();c();u();l();async function Le(...e){let t=await fetch(...e);if(!t.ok)throw new Error(`HTTP status code: ${t.status}`,{cause:t});return t}var ue=class{constructor({baseUrl:t,clientId:r}){this.baseUrl=t,this.clientId=r}async get({headers:t,signal:r,cache:o,...n}){let s=this.createUrl(n);return(await Le(s,{method:"GET",headers:t,signal:r,cache:o})).json()}async getBlob({headers:t,signal:r,...o}){let n=this.createUrl(o);return(await Le(n,{method:"GET",headers:t,signal:r})).blob()}async post({body:t,headers:r,signal:o,...n}){let s=this.createUrl(n);return(await Le(s,{method:"POST",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async put({body:t,headers:r,signal:o,...n}){let s=this.createUrl(n);return(await Le(s,{method:"PUT",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async delete({body:t,headers:r,signal:o,...n}){let s=this.createUrl(n);return(await Le(s,{method:"DELETE",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}createUrl({path:t,params:r}){let o=new URL(t,this.baseUrl);return r&&Object.entries(r).forEach(([n,s])=>{s&&o.searchParams.append(n,s)}),this.clientId&&o.searchParams.append("clientId",this.clientId),o}};var qt=Object.freeze({enabled:!0,events:[]}),Kt=new ue({baseUrl:A.getAnalyticsUrl(),clientId:null}),Gt=5,Vt=60*1e3,Ce=y({...qt}),At={state:Ce,subscribeKey(e,t){return x(Ce,e,t)},async sendError(e,t){if(!Ce.enabled)return;let r=Date.now();if(Ce.events.filter(s=>{let p=new Date(s.properties.timestamp||"").getTime();return r-p<Vt}).length>=Gt)return;let n={type:"error",event:t,properties:{errorType:e.name,errorMessage:e.message,stackTrace:e.stack,timestamp:new Date().toISOString()}};Ce.events.push(n);try{if(typeof window>"u")return;let{projectId:s,sdkType:p,sdkVersion:h}=k.state;await Kt.post({path:"/e",params:{projectId:s,st:p,sv:h||"html-wagmi-4.2.2"},body:{eventId:A.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:new Date().toISOString(),props:{type:"error",event:t,errorType:e.name,errorMessage:e.message,stackTrace:e.stack}}})}catch{}},enable(){Ce.enabled=!0},disable(){Ce.enabled=!1},clearEvents(){Ce.events=[]}};var ke=class e extends Error{constructor(t,r,o){super(t),this.name="AppKitError",this.category=r,this.originalError=o,Object.setPrototypeOf(this,e.prototype);let n=!1;if(o instanceof Error&&typeof o.stack=="string"&&o.stack){let s=o.stack,p=s.indexOf(`
`);if(p>-1){let h=s.substring(p+1);this.stack=`${this.name}: ${this.message}
${h}`,n=!0}}n||(Error.captureStackTrace?Error.captureStackTrace(this,e):this.stack||(this.stack=`${this.name}: ${this.message}`))}};function Et(e,t){let r=e instanceof ke?e:new ke(e instanceof Error?e.message:String(e),t,e);throw At.sendError(r,r.category),r}function H(e,t="INTERNAL_SDK_ERROR"){let r={};return Object.keys(e).forEach(o=>{let n=e[o];if(typeof n=="function"){let s=n;n.constructor.name==="AsyncFunction"?s=async(...p)=>{try{return await n(...p)}catch(h){return Et(h,t)}}:s=(...p)=>{try{return n(...p)}catch(h){return Et(h,t)}},r[o]=s}else r[o]=n}),r}var ne=y({walletImages:{},networkImages:{},chainImages:{},connectorImages:{},tokenImages:{},currencyImages:{}}),zt={state:ne,subscribeNetworkImages(e){return B(ne.networkImages,()=>e(ne.networkImages))},subscribeKey(e,t){return x(ne,e,t)},subscribe(e){return B(ne,()=>e(ne))},setWalletImage(e,t){ne.walletImages[e]=t},setNetworkImage(e,t){ne.networkImages[e]=t},setChainImage(e,t){ne.chainImages[e]=t},setConnectorImage(e,t){ne.connectorImages={...ne.connectorImages,[e]:t}},setTokenImage(e,t){ne.tokenImages[e]=t},setCurrencyImage(e,t){ne.currencyImages[e]=t}},ee=H(zt);c();u();l();c();u();l();c();u();l();var pe={PHANTOM:{id:"a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",url:"https://phantom.app"},SOLFLARE:{id:"1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79",url:"https://solflare.com"},COINBASE:{id:"fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",url:"https://go.cb-w.com"}},vt={handleMobileDeeplinkRedirect(e,t){let r=window.location.href,o=encodeURIComponent(r);if(e===pe.PHANTOM.id&&!("phantom"in window)){let n=r.startsWith("https")?"https":"http",s=r.split("/")[2],p=encodeURIComponent(`${n}://${s}`);window.location.href=`${pe.PHANTOM.url}/ul/browse/${o}?ref=${p}`}e===pe.SOLFLARE.id&&!("solflare"in window)&&(window.location.href=`${pe.SOLFLARE.url}/ul/v1/browse/${o}?ref=${o}`),t===j.CHAIN.SOLANA&&e===pe.COINBASE.id&&!("coinbaseSolana"in window)&&(window.location.href=`${pe.COINBASE.url}/dapp?cb_url=${o}`)}};c();u();l();c();u();l();c();u();l();c();u();l();var Te=Object.freeze({message:"",variant:"success",svg:void 0,open:!1,autoClose:!0}),Q=y({...Te}),Yt={state:Q,subscribeKey(e,t){return x(Q,e,t)},showLoading(e,t={}){this._showMessage({message:e,variant:"loading",...t})},showSuccess(e){this._showMessage({message:e,variant:"success"})},showSvg(e,t){this._showMessage({message:e,svg:t})},showError(e){let t=A.parseError(e);this._showMessage({message:t,variant:"error"})},hide(){Q.message=Te.message,Q.variant=Te.variant,Q.svg=Te.svg,Q.open=Te.open,Q.autoClose=Te.autoClose},_showMessage({message:e,svg:t,variant:r="success",autoClose:o=Te.autoClose}){Q.open?(Q.open=!1,setTimeout(()=>{Q.message=e,Q.variant=r,Q.svg=t,Q.open=!0,Q.autoClose=o},150)):(Q.message=e,Q.variant=r,Q.svg=t,Q.open=!0,Q.autoClose=o)}},K=Yt;var Xt={purchaseCurrencies:[{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"Ether",symbol:"ETH",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]}],paymentCurrencies:[{id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},{id:"EUR",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]}]},St=A.getBlockchainApiUrl(),te=y({clientId:null,api:new ue({baseUrl:St,clientId:null}),supportedChains:{http:[],ws:[]}}),f={state:te,async get(e){let{st:t,sv:r}=f.getSdkProperties(),o=k.state.projectId,n={...e.params||{},st:t,sv:r,projectId:o};return te.api.get({...e,params:n})},getSdkProperties(){let{sdkType:e,sdkVersion:t}=k.state;return{st:e||"unknown",sv:t||"unknown"}},async isNetworkSupported(e){if(!e)return!1;try{te.supportedChains.http.length||await f.getSupportedNetworks()}catch{return!1}return te.supportedChains.http.includes(e)},async getSupportedNetworks(){try{let e=await f.get({path:"v1/supported-chains"});return te.supportedChains=e,e}catch{return te.supportedChains}},async fetchIdentity({address:e,caipNetworkId:t}){if(!await f.isNetworkSupported(t))return{avatar:"",name:""};let o=S.getIdentityFromCacheForAddress(e);if(o)return o;let n=await f.get({path:`/v1/identity/${e}`,params:{sender:a.state.activeCaipAddress?A.getPlainAddress(a.state.activeCaipAddress):void 0}});return S.updateIdentityCache({address:e,identity:n,timestamp:Date.now()}),n},async fetchTransactions({account:e,cursor:t,onramp:r,signal:o,cache:n,chainId:s}){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?f.get({path:`/v1/account/${e}/history`,params:{cursor:t,onramp:r,chainId:s},signal:o,cache:n}):{data:[],next:void 0}},async fetchSwapQuote({amount:e,userAddress:t,from:r,to:o,gasPrice:n}){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?f.get({path:"/v1/convert/quotes",headers:{"Content-Type":"application/json"},params:{amount:e,userAddress:t,from:r,to:o,gasPrice:n}}):{quotes:[]}},async fetchSwapTokens({chainId:e}){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?f.get({path:"/v1/convert/tokens",params:{chainId:e}}):{tokens:[]}},async fetchTokenPrice({addresses:e}){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?te.api.post({path:"/v1/fungible/price",body:{currency:"usd",addresses:e,projectId:k.state.projectId},headers:{"Content-Type":"application/json"}}):{fungibles:[]}},async fetchSwapAllowance({tokenAddress:e,userAddress:t}){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?f.get({path:"/v1/convert/allowance",params:{tokenAddress:e,userAddress:t},headers:{"Content-Type":"application/json"}}):{allowance:"0"}},async fetchGasPrice({chainId:e}){let{st:t,sv:r}=f.getSdkProperties();if(!await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Gas Price");return f.get({path:"/v1/convert/gas-price",headers:{"Content-Type":"application/json"},params:{chainId:e,st:t,sv:r}})},async generateSwapCalldata({amount:e,from:t,to:r,userAddress:o,disableEstimate:n}){if(!await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return te.api.post({path:"/v1/convert/build-transaction",headers:{"Content-Type":"application/json"},body:{amount:e,eip155:{slippage:X.CONVERT_SLIPPAGE_TOLERANCE},projectId:k.state.projectId,from:t,to:r,userAddress:o,disableEstimate:n}})},async generateApproveCalldata({from:e,to:t,userAddress:r}){let{st:o,sv:n}=f.getSdkProperties();if(!await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return f.get({path:"/v1/convert/build-approve",headers:{"Content-Type":"application/json"},params:{userAddress:r,from:e,to:t,st:o,sv:n}})},async getBalance(e,t,r){let{st:o,sv:n}=f.getSdkProperties();if(!await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))return K.showError("Token Balance Unavailable"),{balances:[]};let p=`${t}:${e}`,h=S.getBalanceCacheForCaipAddress(p);if(h)return h;let C=await f.get({path:`/v1/account/${e}/balance`,params:{currency:"usd",chainId:t,forceUpdate:r,st:o,sv:n}});return S.updateBalanceCache({caipAddress:p,balance:C,timestamp:Date.now()}),C},async lookupEnsName(e){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?f.get({path:`/v1/profile/account/${e}`,params:{apiVersion:"2"}}):{addresses:{},attributes:[]}},async reverseLookupEnsName({address:e}){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?f.get({path:`/v1/profile/reverse/${e}`,params:{sender:P.state.address,apiVersion:"2"}}):[]},async getEnsNameSuggestions(e){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?f.get({path:`/v1/profile/suggestions/${e}`,params:{zone:"reown.id"}}):{suggestions:[]}},async registerEnsName({coinType:e,address:t,message:r,signature:o}){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?te.api.post({path:"/v1/profile/account",body:{coin_type:e,address:t,message:r,signature:o},headers:{"Content-Type":"application/json"}}):{success:!1}},async generateOnRampURL({destinationWallets:e,partnerUserId:t,defaultNetwork:r,purchaseAmount:o,paymentAmount:n}){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?(await te.api.post({path:"/v1/generators/onrampurl",params:{projectId:k.state.projectId},body:{destinationWallets:e,defaultNetwork:r,partnerUserId:t,defaultExperience:"buy",presetCryptoAmount:o,presetFiatAmount:n}})).url:""},async getOnrampOptions(){if(!await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId))return{paymentCurrencies:[],purchaseCurrencies:[]};try{return await f.get({path:"/v1/onramp/options"})}catch{return Xt}},async getOnrampQuote({purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}){try{return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?await te.api.post({path:"/v1/onramp/quote",params:{projectId:k.state.projectId},body:{purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}}):null}catch{return{coinbaseFee:{amount:r,currency:t.id},networkFee:{amount:r,currency:t.id},paymentSubtotal:{amount:r,currency:t.id},paymentTotal:{amount:r,currency:t.id},purchaseAmount:{amount:r,currency:t.id},quoteId:"mocked-quote-id"}}},async getSmartSessions(e){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?f.get({path:`/v1/sessions/${e}`}):[]},async revokeSmartSession(e,t,r){return await f.isNetworkSupported(a.state.activeCaipNetwork?.caipNetworkId)?te.api.post({path:`/v1/sessions/${e}/revoke`,params:{projectId:k.state.projectId},body:{pci:t,signature:r}}):{success:!1}},setClientId(e){te.clientId=e,te.api=new ue({baseUrl:St,clientId:e})}};var ce=y({currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[]}),Jt={state:ce,replaceState(e){e&&Object.assign(ce,me(e))},subscribe(e){return a.subscribeChainProp("accountState",t=>{if(t)return e(t)})},subscribeKey(e,t,r){let o;return a.subscribeChainProp("accountState",n=>{if(n){let s=n[e];o!==s&&(o=s,t(s))}},r)},setStatus(e,t){a.setAccountProp("status",e,t)},getCaipAddress(e){return a.getAccountProp("caipAddress",e)},setCaipAddress(e,t){let r=e?A.getPlainAddress(e):void 0;t===a.state.activeChain&&(a.state.activeCaipAddress=e),a.setAccountProp("caipAddress",e,t),a.setAccountProp("address",r,t)},setBalance(e,t,r){a.setAccountProp("balance",e,r),a.setAccountProp("balanceSymbol",t,r)},setProfileName(e,t){a.setAccountProp("profileName",e,t)},setProfileImage(e,t){a.setAccountProp("profileImage",e,t)},setUser(e,t){a.setAccountProp("user",e,t)},setAddressExplorerUrl(e,t){a.setAccountProp("addressExplorerUrl",e,t)},setSmartAccountDeployed(e,t){a.setAccountProp("smartAccountDeployed",e,t)},setCurrentTab(e){a.setAccountProp("currentTab",e,a.state.activeChain)},setTokenBalance(e,t){e&&a.setAccountProp("tokenBalance",e,t)},setShouldUpdateToAddress(e,t){a.setAccountProp("shouldUpdateToAddress",e,t)},setAllAccounts(e,t){a.setAccountProp("allAccounts",e,t)},addAddressLabel(e,t,r){let o=a.getAccountProp("addressLabels",r)||new Map;o.set(e,t),a.setAccountProp("addressLabels",o,r)},removeAddressLabel(e,t){let r=a.getAccountProp("addressLabels",t)||new Map;r.delete(e),a.setAccountProp("addressLabels",r,t)},setConnectedWalletInfo(e,t){a.setAccountProp("connectedWalletInfo",e,t,!1)},setPreferredAccountType(e,t){a.setAccountProp("preferredAccountTypes",{...ce.preferredAccountTypes,[t]:e},t)},setPreferredAccountTypes(e){ce.preferredAccountTypes=e},setSocialProvider(e,t){e&&a.setAccountProp("socialProvider",e,t)},setSocialWindow(e,t){a.setAccountProp("socialWindow",e?me(e):void 0,t)},setFarcasterUrl(e,t){a.setAccountProp("farcasterUrl",e,t)},async fetchTokenBalance(e){ce.balanceLoading=!0;let t=a.state.activeCaipNetwork?.caipNetworkId,r=a.state.activeCaipNetwork?.chainNamespace,o=a.state.activeCaipAddress,n=o?A.getPlainAddress(o):void 0;if(ce.lastRetry&&!A.isAllowedRetry(ce.lastRetry,30*X.ONE_SEC_MS))return ce.balanceLoading=!1,[];try{if(n&&t&&r){let p=(await f.getBalance(n,t)).balances.filter(h=>h.quantity.decimals!=="0");return P.setTokenBalance(p,r),ce.lastRetry=void 0,ce.balanceLoading=!1,p}}catch(s){ce.lastRetry=Date.now(),e?.(s),K.showError("Token Balance Unavailable")}finally{ce.balanceLoading=!1}return[]},resetAccount(e){a.resetAccount(e)}},P=H(Jt);c();u();l();c();u();l();c();u();l();c();u();l();c();u();l();var et={onSwitchNetwork({network:e,ignoreSwitchConfirmation:t=!1}){let r=a.state.activeCaipNetwork,o=b.state.data;if(e.id===r?.id)return;let s=P.getCaipAddress(a.state.activeChain),p=e.chainNamespace!==a.state.activeChain,h=P.getCaipAddress(e.chainNamespace),$=N.getConnectorId(a.state.activeChain)===j.CONNECTOR_ID.AUTH,R=j.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(z=>z===e.chainNamespace);t||$&&R?b.push("SwitchNetwork",{...o,network:e}):s&&p&&!h?b.push("SwitchActiveChain",{switchToChain:e.chainNamespace,navigateTo:"Connect",navigateWithReplace:!0,network:e}):b.push("SwitchNetwork",{...o,network:e})}};c();u();l();c();u();l();var be=y({message:"",variant:"info",open:!1}),Qt={state:be,subscribeKey(e,t){return x(be,e,t)},open(e,t){let{debug:r}=k.state,{shortMessage:o,longMessage:n}=e;r&&(be.message=o,be.variant=t,be.open=!0),n&&console.error(typeof n=="function"?n():n)},close(){be.open=!1,be.message="",be.variant="info"}},Be=H(Qt);var Zt=A.getAnalyticsUrl(),er=new ue({baseUrl:Zt,clientId:null}),tr=["MODAL_CREATED"],fe=y({timestamp:Date.now(),reportedErrors:{},data:{type:"track",event:"MODAL_CREATED"}}),W={state:fe,subscribe(e){return B(fe,()=>e(fe))},getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=k.state;return{projectId:e,st:t,sv:r||"html-wagmi-4.2.2"}},async _sendAnalyticsEvent(e){try{let t=P.state.address;if(tr.includes(e.data.event)||typeof window>"u")return;await er.post({path:"/e",params:W.getSdkProperties(),body:{eventId:A.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:e.timestamp,props:{...e.data,address:t}}}),fe.reportedErrors.FORBIDDEN=!1}catch(t){t instanceof Error&&t.cause instanceof Response&&t.cause.status===j.HTTP_STATUS_CODES.FORBIDDEN&&!fe.reportedErrors.FORBIDDEN&&(Be.open({shortMessage:"Invalid App Configuration",longMessage:`Origin ${Ne()?window.origin:"uknown"} not found on Allowlist - update configuration on cloud.reown.com`},"error"),fe.reportedErrors.FORBIDDEN=!0)}},sendEvent(e){fe.timestamp=Date.now(),fe.data=e,k.state.features?.analytics&&W._sendAnalyticsEvent(fe)}};c();u();l();var Pe=y({loading:!1,open:!1,selectedNetworkId:void 0,activeChain:void 0,initialized:!1}),Ae={state:Pe,subscribe(e){return B(Pe,()=>e(Pe))},subscribeOpen(e){return x(Pe,"open",e)},set(e){Object.assign(Pe,{...Pe,...e})}};var re=y({loading:!1,loadingNamespaceMap:new Map,open:!1,shake:!1,namespace:void 0}),rr={state:re,subscribe(e){return B(re,()=>e(re))},subscribeKey(e,t){return x(re,e,t)},async open(e){let t=P.state.status==="connected",r=e?.namespace,o=a.state.activeChain,n=r&&r!==o,s=a.getAccountData(e?.namespace)?.caipAddress;if(v.state.wcBasic?I.prefetch({fetchNetworkImages:!1,fetchConnectorImages:!1}):await I.prefetch({fetchConnectorImages:!t,fetchFeaturedWallets:!t,fetchRecommendedWallets:!t}),N.setFilterByNamespace(e?.namespace),J.setLoading(!0,r),r&&n){let p=a.getNetworkData(r)?.caipNetwork||a.getRequestedCaipNetworks(r)[0];p&&et.onSwitchNetwork({network:p,ignoreSwitchConfirmation:!0})}else{let p=a.state.noAdapters;k.state.manualWCControl||p&&!s?A.isMobile()?b.reset("AllWallets"):b.reset("ConnectingWalletConnectBasic"):e?.view?b.reset(e.view,e.data):s?b.reset("Account"):b.reset("Connect")}re.open=!0,Ae.set({open:!0}),W.sendEvent({type:"track",event:"MODAL_OPEN",properties:{connected:!!s}})},close(){let e=k.state.enableEmbedded,t=!!a.state.activeCaipAddress;re.open&&W.sendEvent({type:"track",event:"MODAL_CLOSE",properties:{connected:t}}),re.open=!1,b.reset("Connect"),J.clearLoading(),e?t?b.replace("Account"):b.push("Connect"):Ae.set({open:!1}),v.resetUri()},setLoading(e,t){t&&re.loadingNamespaceMap.set(t,e),re.loading=e,Ae.set({loading:e})},clearLoading(){re.loadingNamespaceMap.clear(),re.loading=!1},shake(){re.shake||(re.shake=!0,setTimeout(()=>{re.shake=!1},500))}},J=H(rr);var G=y({view:"Connect",history:["Connect"],transactionStack:[]}),or={state:G,subscribeKey(e,t){return x(G,e,t)},pushTransactionStack(e){G.transactionStack.push(e)},popTransactionStack(e){let t=G.transactionStack.pop();if(!t)return;let{onSuccess:r,onError:o,onCancel:n}=t;switch(e){case"success":r?.();break;case"error":o?.(),b.goBack();break;case"cancel":n?.(),b.goBack();break;default:}},push(e,t){e!==G.view&&(G.view=e,G.history.push(e),G.data=t)},reset(e,t){G.view=e,G.history=[e],G.data=t},replace(e,t){G.history.at(-1)===e||(G.view=e,G.history[G.history.length-1]=e,G.data=t)},goBack(){let e=a.state.activeCaipAddress,t=b.state.view==="ConnectingFarcaster",r=!e&&t;if(G.history.length>1){G.history.pop();let[o]=G.history.slice(-1);o&&(e&&o==="Connect"?G.view="Account":G.view=o)}else J.close();G.data?.wallet&&(G.data.wallet=void 0),setTimeout(()=>{if(r){P.setFarcasterUrl(void 0,a.state.activeChain);let o=N.getAuthConnector();o?.provider?.reload();let n=he(k.state);o?.provider?.syncDappData?.({metadata:n.metadata,sdkVersion:n.sdkVersion,projectId:n.projectId,sdkType:n.sdkType})}},100)},goBackToIndex(e){if(G.history.length>1){G.history=G.history.slice(0,e+1);let[t]=G.history.slice(-1);t&&(G.view=t)}},goBackOrCloseModal(){b.state.history.length>1?b.goBack():J.close()}},b=H(or);c();u();l();var ge=y({themeMode:"dark",themeVariables:{},w3mThemeVariables:void 0}),tt={state:ge,subscribe(e){return B(ge,()=>e(ge))},setThemeMode(e){ge.themeMode=e;try{let t=N.getAuthConnector();if(t){let r=tt.getSnapshot().themeVariables;t.provider.syncTheme({themeMode:e,themeVariables:r,w3mThemeVariables:ie(r,e)})}}catch{console.info("Unable to sync theme to auth connector")}},setThemeVariables(e){ge.themeVariables={...ge.themeVariables,...e};try{let t=N.getAuthConnector();if(t){let r=tt.getSnapshot().themeVariables;t.provider.syncTheme({themeVariables:r,w3mThemeVariables:ie(ge.themeVariables,ge.themeMode)})}}catch{console.info("Unable to sync theme to auth connector")}},getSnapshot(){return he(ge)}},Re=H(tt);var Nt={eip155:void 0,solana:void 0,polkadot:void 0,bip122:void 0,cosmos:void 0},M=y({allConnectors:[],connectors:[],activeConnector:void 0,filterByNamespace:void 0,activeConnectorIds:{...Nt},filterByNamespaceMap:{eip155:!0,solana:!0,polkadot:!0,bip122:!0,cosmos:!0}}),nr={state:M,subscribe(e){return B(M,()=>{e(M)})},subscribeKey(e,t){return x(M,e,t)},initialize(e){e.forEach(t=>{let r=S.getConnectedConnectorId(t);r&&N.setConnectorId(r,t)})},setActiveConnector(e){e&&(M.activeConnector=me(e))},setConnectors(e){e.filter(n=>!M.allConnectors.some(s=>s.id===n.id&&N.getConnectorName(s.name)===N.getConnectorName(n.name)&&s.chain===n.chain)).forEach(n=>{n.type!=="MULTI_CHAIN"&&M.allConnectors.push(me(n))});let r=N.getEnabledNamespaces(),o=N.getEnabledConnectors(r);M.connectors=N.mergeMultiChainConnectors(o)},filterByNamespaces(e){Object.keys(M.filterByNamespaceMap).forEach(t=>{M.filterByNamespaceMap[t]=!1}),e.forEach(t=>{M.filterByNamespaceMap[t]=!0}),N.updateConnectorsForEnabledNamespaces()},filterByNamespace(e,t){M.filterByNamespaceMap[e]=t,N.updateConnectorsForEnabledNamespaces()},updateConnectorsForEnabledNamespaces(){let e=N.getEnabledNamespaces(),t=N.getEnabledConnectors(e),r=N.areAllNamespacesEnabled();M.connectors=N.mergeMultiChainConnectors(t),r?I.clearFilterByNamespaces():I.filterByNamespaces(e)},getEnabledNamespaces(){return Object.entries(M.filterByNamespaceMap).filter(([e,t])=>t).map(([e])=>e)},getEnabledConnectors(e){return M.allConnectors.filter(t=>e.includes(t.chain))},areAllNamespacesEnabled(){return Object.values(M.filterByNamespaceMap).every(e=>e)},mergeMultiChainConnectors(e){let t=N.generateConnectorMapByName(e),r=[];return t.forEach(o=>{let n=o[0],s=n?.id===j.CONNECTOR_ID.AUTH;o.length>1&&n?r.push({name:n.name,imageUrl:n.imageUrl,imageId:n.imageId,connectors:[...o],type:s?"AUTH":"MULTI_CHAIN",chain:"eip155",id:n?.id||""}):n&&r.push(n)}),r},generateConnectorMapByName(e){let t=new Map;return e.forEach(r=>{let{name:o}=r,n=N.getConnectorName(o);if(!n)return;let s=t.get(n)||[];s.find(h=>h.chain===r.chain)||s.push(r),t.set(n,s)}),t},getConnectorName(e){return e&&({"Trust Wallet":"Trust"}[e]||e)},getUniqueConnectorsByName(e){let t=[];return e.forEach(r=>{t.find(o=>o.chain===r.chain)||t.push(r)}),t},addConnector(e){if(e.id===j.CONNECTOR_ID.AUTH){let t=e,r=he(k.state),o=Re.getSnapshot().themeMode,n=Re.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType}),t?.provider?.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:ie(n,o)}),N.setConnectors([e])}else N.setConnectors([e])},getAuthConnector(e){let t=e||a.state.activeChain,r=M.connectors.find(o=>o.id===j.CONNECTOR_ID.AUTH);if(r)return r?.connectors?.length?r.connectors.find(n=>n.chain===t):r},getAnnouncedConnectorRdns(){return M.connectors.filter(e=>e.type==="ANNOUNCED").map(e=>e.info?.rdns)},getConnectorById(e){return M.allConnectors.find(t=>t.id===e)},getConnector(e,t){return M.allConnectors.filter(o=>o.chain===a.state.activeChain).find(o=>o.explorerId===e||o.info?.rdns===t)},syncIfAuthConnector(e){if(e.id!=="ID_AUTH")return;let t=e,r=he(k.state),o=Re.getSnapshot().themeMode,n=Re.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,sdkType:r.sdkType,projectId:r.projectId}),t.provider.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:ie(n,o)})},getConnectorsByNamespace(e){let t=M.allConnectors.filter(r=>r.chain===e);return N.mergeMultiChainConnectors(t)},selectWalletConnector(e){let t=N.getConnector(e.id,e.rdns),r=a.state.activeChain;vt.handleMobileDeeplinkRedirect(t?.explorerId||e.id,r),t?b.push("ConnectingExternal",{connector:t}):b.push("ConnectingWalletConnect",{wallet:e})},getConnectors(e){return e?N.getConnectorsByNamespace(e):N.mergeMultiChainConnectors(M.allConnectors)},setFilterByNamespace(e){M.filterByNamespace=e,M.connectors=N.getConnectors(e),I.setFilterByNamespace(e)},setConnectorId(e,t){e&&(M.activeConnectorIds={...M.activeConnectorIds,[t]:e},S.setConnectedConnectorId(t,e))},removeConnectorId(e){M.activeConnectorIds={...M.activeConnectorIds,[e]:void 0},S.deleteConnectedConnectorId(e)},getConnectorId(e){if(e)return M.activeConnectorIds[e]},isConnected(e){return e?!!M.activeConnectorIds[e]:Object.values(M.activeConnectorIds).some(t=>!!t)},resetConnectorIds(){M.activeConnectorIds={...Nt}}},N=H(nr);c();u();l();c();u();l();c();u();l();var sr="https://secure.walletconnect.org/sdk",Oi=(typeof d<"u"&&typeof d.env<"u"?d.env.NEXT_PUBLIC_SECURE_SITE_SDK_URL:void 0)||sr,Ui=(typeof d<"u"&&typeof d.env<"u"?d.env.NEXT_PUBLIC_DEFAULT_LOG_LEVEL:void 0)||"error",xi=(typeof d<"u"&&typeof d.env<"u"?d.env.NEXT_PUBLIC_SECURE_SITE_SDK_VERSION:void 0)||"4",Di={APP_EVENT_KEY:"@w3m-app/",FRAME_EVENT_KEY:"@w3m-frame/",RPC_METHOD_KEY:"RPC_",STORAGE_KEY:"@appkit-wallet/",SESSION_TOKEN_KEY:"SESSION_TOKEN_KEY",EMAIL_LOGIN_USED_KEY:"EMAIL_LOGIN_USED_KEY",LAST_USED_CHAIN_KEY:"LAST_USED_CHAIN_KEY",LAST_EMAIL_LOGIN_TIME:"LAST_EMAIL_LOGIN_TIME",EMAIL:"EMAIL",PREFERRED_ACCOUNT_TYPE:"PREFERRED_ACCOUNT_TYPE",SMART_ACCOUNT_ENABLED:"SMART_ACCOUNT_ENABLED",SMART_ACCOUNT_ENABLED_NETWORKS:"SMART_ACCOUNT_ENABLED_NETWORKS",SOCIAL_USERNAME:"SOCIAL_USERNAME",APP_SWITCH_NETWORK:"@w3m-app/SWITCH_NETWORK",APP_CONNECT_EMAIL:"@w3m-app/CONNECT_EMAIL",APP_CONNECT_DEVICE:"@w3m-app/CONNECT_DEVICE",APP_CONNECT_OTP:"@w3m-app/CONNECT_OTP",APP_CONNECT_SOCIAL:"@w3m-app/CONNECT_SOCIAL",APP_GET_SOCIAL_REDIRECT_URI:"@w3m-app/GET_SOCIAL_REDIRECT_URI",APP_GET_USER:"@w3m-app/GET_USER",APP_SIGN_OUT:"@w3m-app/SIGN_OUT",APP_IS_CONNECTED:"@w3m-app/IS_CONNECTED",APP_GET_CHAIN_ID:"@w3m-app/GET_CHAIN_ID",APP_RPC_REQUEST:"@w3m-app/RPC_REQUEST",APP_UPDATE_EMAIL:"@w3m-app/UPDATE_EMAIL",APP_UPDATE_EMAIL_PRIMARY_OTP:"@w3m-app/UPDATE_EMAIL_PRIMARY_OTP",APP_UPDATE_EMAIL_SECONDARY_OTP:"@w3m-app/UPDATE_EMAIL_SECONDARY_OTP",APP_AWAIT_UPDATE_EMAIL:"@w3m-app/AWAIT_UPDATE_EMAIL",APP_SYNC_THEME:"@w3m-app/SYNC_THEME",APP_SYNC_DAPP_DATA:"@w3m-app/SYNC_DAPP_DATA",APP_GET_SMART_ACCOUNT_ENABLED_NETWORKS:"@w3m-app/GET_SMART_ACCOUNT_ENABLED_NETWORKS",APP_INIT_SMART_ACCOUNT:"@w3m-app/INIT_SMART_ACCOUNT",APP_SET_PREFERRED_ACCOUNT:"@w3m-app/SET_PREFERRED_ACCOUNT",APP_CONNECT_FARCASTER:"@w3m-app/CONNECT_FARCASTER",APP_GET_FARCASTER_URI:"@w3m-app/GET_FARCASTER_URI",APP_RELOAD:"@w3m-app/RELOAD",FRAME_SWITCH_NETWORK_ERROR:"@w3m-frame/SWITCH_NETWORK_ERROR",FRAME_SWITCH_NETWORK_SUCCESS:"@w3m-frame/SWITCH_NETWORK_SUCCESS",FRAME_CONNECT_EMAIL_ERROR:"@w3m-frame/CONNECT_EMAIL_ERROR",FRAME_CONNECT_EMAIL_SUCCESS:"@w3m-frame/CONNECT_EMAIL_SUCCESS",FRAME_CONNECT_DEVICE_ERROR:"@w3m-frame/CONNECT_DEVICE_ERROR",FRAME_CONNECT_DEVICE_SUCCESS:"@w3m-frame/CONNECT_DEVICE_SUCCESS",FRAME_CONNECT_OTP_SUCCESS:"@w3m-frame/CONNECT_OTP_SUCCESS",FRAME_CONNECT_OTP_ERROR:"@w3m-frame/CONNECT_OTP_ERROR",FRAME_CONNECT_SOCIAL_SUCCESS:"@w3m-frame/CONNECT_SOCIAL_SUCCESS",FRAME_CONNECT_SOCIAL_ERROR:"@w3m-frame/CONNECT_SOCIAL_ERROR",FRAME_CONNECT_FARCASTER_SUCCESS:"@w3m-frame/CONNECT_FARCASTER_SUCCESS",FRAME_CONNECT_FARCASTER_ERROR:"@w3m-frame/CONNECT_FARCASTER_ERROR",FRAME_GET_FARCASTER_URI_SUCCESS:"@w3m-frame/GET_FARCASTER_URI_SUCCESS",FRAME_GET_FARCASTER_URI_ERROR:"@w3m-frame/GET_FARCASTER_URI_ERROR",FRAME_GET_SOCIAL_REDIRECT_URI_SUCCESS:"@w3m-frame/GET_SOCIAL_REDIRECT_URI_SUCCESS",FRAME_GET_SOCIAL_REDIRECT_URI_ERROR:"@w3m-frame/GET_SOCIAL_REDIRECT_URI_ERROR",FRAME_GET_USER_SUCCESS:"@w3m-frame/GET_USER_SUCCESS",FRAME_GET_USER_ERROR:"@w3m-frame/GET_USER_ERROR",FRAME_SIGN_OUT_SUCCESS:"@w3m-frame/SIGN_OUT_SUCCESS",FRAME_SIGN_OUT_ERROR:"@w3m-frame/SIGN_OUT_ERROR",FRAME_IS_CONNECTED_SUCCESS:"@w3m-frame/IS_CONNECTED_SUCCESS",FRAME_IS_CONNECTED_ERROR:"@w3m-frame/IS_CONNECTED_ERROR",FRAME_GET_CHAIN_ID_SUCCESS:"@w3m-frame/GET_CHAIN_ID_SUCCESS",FRAME_GET_CHAIN_ID_ERROR:"@w3m-frame/GET_CHAIN_ID_ERROR",FRAME_RPC_REQUEST_SUCCESS:"@w3m-frame/RPC_REQUEST_SUCCESS",FRAME_RPC_REQUEST_ERROR:"@w3m-frame/RPC_REQUEST_ERROR",FRAME_SESSION_UPDATE:"@w3m-frame/SESSION_UPDATE",FRAME_UPDATE_EMAIL_SUCCESS:"@w3m-frame/UPDATE_EMAIL_SUCCESS",FRAME_UPDATE_EMAIL_ERROR:"@w3m-frame/UPDATE_EMAIL_ERROR",FRAME_UPDATE_EMAIL_PRIMARY_OTP_SUCCESS:"@w3m-frame/UPDATE_EMAIL_PRIMARY_OTP_SUCCESS",FRAME_UPDATE_EMAIL_PRIMARY_OTP_ERROR:"@w3m-frame/UPDATE_EMAIL_PRIMARY_OTP_ERROR",FRAME_UPDATE_EMAIL_SECONDARY_OTP_SUCCESS:"@w3m-frame/UPDATE_EMAIL_SECONDARY_OTP_SUCCESS",FRAME_UPDATE_EMAIL_SECONDARY_OTP_ERROR:"@w3m-frame/UPDATE_EMAIL_SECONDARY_OTP_ERROR",FRAME_SYNC_THEME_SUCCESS:"@w3m-frame/SYNC_THEME_SUCCESS",FRAME_SYNC_THEME_ERROR:"@w3m-frame/SYNC_THEME_ERROR",FRAME_SYNC_DAPP_DATA_SUCCESS:"@w3m-frame/SYNC_DAPP_DATA_SUCCESS",FRAME_SYNC_DAPP_DATA_ERROR:"@w3m-frame/SYNC_DAPP_DATA_ERROR",FRAME_GET_SMART_ACCOUNT_ENABLED_NETWORKS_SUCCESS:"@w3m-frame/GET_SMART_ACCOUNT_ENABLED_NETWORKS_SUCCESS",FRAME_GET_SMART_ACCOUNT_ENABLED_NETWORKS_ERROR:"@w3m-frame/GET_SMART_ACCOUNT_ENABLED_NETWORKS_ERROR",FRAME_INIT_SMART_ACCOUNT_SUCCESS:"@w3m-frame/INIT_SMART_ACCOUNT_SUCCESS",FRAME_INIT_SMART_ACCOUNT_ERROR:"@w3m-frame/INIT_SMART_ACCOUNT_ERROR",FRAME_SET_PREFERRED_ACCOUNT_SUCCESS:"@w3m-frame/SET_PREFERRED_ACCOUNT_SUCCESS",FRAME_SET_PREFERRED_ACCOUNT_ERROR:"@w3m-frame/SET_PREFERRED_ACCOUNT_ERROR",FRAME_READY:"@w3m-frame/READY",FRAME_RELOAD_SUCCESS:"@w3m-frame/RELOAD_SUCCESS",FRAME_RELOAD_ERROR:"@w3m-frame/RELOAD_ERROR",RPC_RESPONSE_TYPE_ERROR:"RPC_RESPONSE_ERROR",RPC_RESPONSE_TYPE_TX:"RPC_RESPONSE_TRANSACTION_HASH",RPC_RESPONSE_TYPE_OBJECT:"RPC_RESPONSE_OBJECT"},se={SAFE_RPC_METHODS:["eth_accounts","eth_blockNumber","eth_call","eth_chainId","eth_estimateGas","eth_feeHistory","eth_gasPrice","eth_getAccount","eth_getBalance","eth_getBlockByHash","eth_getBlockByNumber","eth_getBlockReceipts","eth_getBlockTransactionCountByHash","eth_getBlockTransactionCountByNumber","eth_getCode","eth_getFilterChanges","eth_getFilterLogs","eth_getLogs","eth_getProof","eth_getStorageAt","eth_getTransactionByBlockHashAndIndex","eth_getTransactionByBlockNumberAndIndex","eth_getTransactionByHash","eth_getTransactionCount","eth_getTransactionReceipt","eth_getUncleCountByBlockHash","eth_getUncleCountByBlockNumber","eth_maxPriorityFeePerGas","eth_newBlockFilter","eth_newFilter","eth_newPendingTransactionFilter","eth_sendRawTransaction","eth_syncing","eth_uninstallFilter","wallet_getCapabilities","wallet_getCallsStatus","eth_getUserOperationReceipt","eth_estimateUserOperationGas","eth_getUserOperationByHash","eth_supportedEntryPoints","wallet_getAssets"],NOT_SAFE_RPC_METHODS:["personal_sign","eth_signTypedData_v4","eth_sendTransaction","solana_signMessage","solana_signTransaction","solana_signAllTransactions","solana_signAndSendTransaction","wallet_sendCalls","wallet_grantPermissions","wallet_revokePermissions","eth_sendUserOperation"],GET_CHAIN_ID:"eth_chainId",RPC_METHOD_NOT_ALLOWED_MESSAGE:"Requested RPC call is not allowed",RPC_METHOD_NOT_ALLOWED_UI_MESSAGE:"Action not allowed",ACCOUNT_TYPES:{EOA:"eoa",SMART_ACCOUNT:"smartAccount"}};var V=y({transactions:[],coinbaseTransactions:{},transactionsByYear:{},lastNetworkInView:void 0,loading:!1,empty:!1,next:void 0}),ar={state:V,subscribe(e){return B(V,()=>e(V))},setLastNetworkInView(e){V.lastNetworkInView=e},async fetchTransactions(e,t){if(!e)throw new Error("Transactions can't be fetched without an accountAddress");V.loading=!0;try{let r=await f.fetchTransactions({account:e,cursor:V.next,onramp:t,cache:t==="coinbase"?"no-cache":void 0,chainId:a.state.activeCaipNetwork?.caipNetworkId}),o=ye.filterSpamTransactions(r.data),n=ye.filterByConnectedChain(o),s=[...V.transactions,...n];V.loading=!1,t==="coinbase"?V.coinbaseTransactions=ye.groupTransactionsByYearAndMonth(V.coinbaseTransactions,r.data):(V.transactions=s,V.transactionsByYear=ye.groupTransactionsByYearAndMonth(V.transactionsByYear,n)),V.empty=s.length===0,V.next=r.next?r.next:void 0}catch{let o=a.state.activeChain;W.sendEvent({type:"track",event:"ERROR_FETCH_TRANSACTIONS",properties:{address:e,projectId:k.state.projectId,cursor:V.next,isSmartAccount:P.state.preferredAccountTypes?.[o]===se.ACCOUNT_TYPES.SMART_ACCOUNT}}),K.showError("Failed to fetch transactions"),V.loading=!1,V.empty=!0,V.next=void 0}},groupTransactionsByYearAndMonth(e={},t=[]){let r=e;return t.forEach(o=>{let n=new Date(o.metadata.minedAt).getFullYear(),s=new Date(o.metadata.minedAt).getMonth(),p=r[n]??{},C=(p[s]??[]).filter($=>$.id!==o.id);r[n]={...p,[s]:[...C,o].sort(($,R)=>new Date(R.metadata.minedAt).getTime()-new Date($.metadata.minedAt).getTime())}}),r},filterSpamTransactions(e){return e.filter(t=>!t.transfers.every(o=>o.nft_info?.flags.is_spam===!0))},filterByConnectedChain(e){let t=a.state.activeCaipNetwork?.caipNetworkId;return e.filter(o=>o.metadata.chain===t)},clearCursor(){V.next=void 0},resetTransactions(){V.transactions=[],V.transactionsByYear={},V.lastNetworkInView=void 0,V.loading=!1,V.empty=!1,V.next=void 0}},ye=H(ar,"API_ERROR");var Y=y({connections:new Map,wcError:!1,buffering:!1,status:"disconnected"}),Ie,ir={state:Y,subscribeKey(e,t){return x(Y,e,t)},_getClient(){return Y._client},setClient(e){Y._client=me(e)},async connectWalletConnect(){if(A.isTelegram()||A.isSafari()&&A.isIos()){if(Ie){await Ie,Ie=void 0;return}if(!A.isPairingExpired(Y?.wcPairingExpiry)){let e=Y.wcUri;Y.wcUri=e;return}Ie=v._getClient()?.connectWalletConnect?.().catch(()=>{}),v.state.status="connecting",await Ie,Ie=void 0,Y.wcPairingExpiry=void 0,v.state.status="connected"}else await v._getClient()?.connectWalletConnect?.()},async connectExternal(e,t,r=!0){await v._getClient()?.connectExternal?.(e),r&&a.setActiveNamespace(t)},async reconnectExternal(e){await v._getClient()?.reconnectExternal?.(e);let t=e.chain||a.state.activeChain;t&&N.setConnectorId(e.id,t)},async setPreferredAccountType(e,t){J.setLoading(!0,a.state.activeChain);let r=N.getAuthConnector();r&&(P.setPreferredAccountType(e,t),await r.provider.setPreferredAccount(e),S.setPreferredAccountTypes(P.state.preferredAccountTypes??{[t]:e}),await v.reconnectExternal(r),J.setLoading(!1,a.state.activeChain),W.sendEvent({type:"track",event:"SET_PREFERRED_ACCOUNT_TYPE",properties:{accountType:e,network:a.state.activeCaipNetwork?.caipNetworkId||""}}))},async signMessage(e){return v._getClient()?.signMessage(e)},parseUnits(e,t){return v._getClient()?.parseUnits(e,t)},formatUnits(e,t){return v._getClient()?.formatUnits(e,t)},async sendTransaction(e){return v._getClient()?.sendTransaction(e)},async getCapabilities(e){return v._getClient()?.getCapabilities(e)},async grantPermissions(e){return v._getClient()?.grantPermissions(e)},async walletGetAssets(e){return v._getClient()?.walletGetAssets(e)??{}},async estimateGas(e){return v._getClient()?.estimateGas(e)},async writeContract(e){return v._getClient()?.writeContract(e)},async getEnsAddress(e){return v._getClient()?.getEnsAddress(e)},async getEnsAvatar(e){return v._getClient()?.getEnsAvatar(e)},checkInstalled(e){return v._getClient()?.checkInstalled?.(e)||!1},resetWcConnection(){Y.wcUri=void 0,Y.wcPairingExpiry=void 0,Y.wcLinking=void 0,Y.recentWallet=void 0,Y.status="disconnected",ye.resetTransactions(),S.deleteWalletConnectDeepLink()},resetUri(){Y.wcUri=void 0,Y.wcPairingExpiry=void 0,Ie=void 0},finalizeWcConnection(){let{wcLinking:e,recentWallet:t}=v.state;e&&S.setWalletConnectDeepLink(e),t&&S.setAppKitRecent(t),W.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:e?"mobile":"qrcode",name:b.state.data?.wallet?.name||"Unknown"}})},setWcBasic(e){Y.wcBasic=e},setUri(e){Y.wcUri=e,Y.wcPairingExpiry=A.getPairingExpiry()},setWcLinking(e){Y.wcLinking=e},setWcError(e){Y.wcError=e,Y.buffering=!1},setRecentWallet(e){Y.recentWallet=e},setBuffering(e){Y.buffering=e},setStatus(e){Y.status=e},async disconnect(e){try{await v._getClient()?.disconnect(e)}catch(t){throw new ke("Failed to disconnect","INTERNAL_SDK_ERROR",t)}},setConnections(e,t){Y.connections.set(t,e)},switchAccount({connection:e,address:t,namespace:r}){if(N.state.activeConnectorIds[r]===e.connectorId){let s=a.state.activeCaipNetwork;if(s){let p=`${r}:${s.id}:${t}`;P.setCaipAddress(p,r)}else console.warn(`No current network found for namespace "${r}"`)}else{let s=N.getConnector(e.connectorId);s?v.connectExternal(s,r):console.warn(`No connector found for namespace "${r}"`)}}},v=H(ir);c();u();l();c();u();l();c();u();l();var qe={createBalance(e,t){let r={name:e.metadata.name||"",symbol:e.metadata.symbol||"",decimals:e.metadata.decimals||0,value:e.metadata.value||0,price:e.metadata.price||0,iconUrl:e.metadata.iconUrl||""};return{name:r.name,symbol:r.symbol,chainId:t,address:e.address==="native"?void 0:this.convertAddressToCAIP10Address(e.address,t),value:r.value,price:r.price,quantity:{decimals:r.decimals.toString(),numeric:this.convertHexToBalance({hex:e.balance,decimals:r.decimals})},iconUrl:r.iconUrl}},convertHexToBalance({hex:e,decimals:t}){return pt(BigInt(e),t)},convertAddressToCAIP10Address(e,t){return`${t}:${e}`},createCAIP2ChainId(e,t){return`${t}:${parseInt(e,16)}`},getChainIdHexFromCAIP2ChainId(e){let t=e.split(":");if(t.length<2||!t[1])return"0x0";let r=t[1],o=parseInt(r,10);return isNaN(o)?"0x0":`0x${o.toString(16)}`},isWalletGetAssetsResponse(e){return typeof e!="object"||e===null?!1:Object.values(e).every(t=>Array.isArray(t)&&t.every(r=>this.isValidAsset(r)))},isValidAsset(e){return typeof e=="object"&&e!==null&&typeof e.address=="string"&&typeof e.balance=="string"&&(e.type==="ERC20"||e.type==="NATIVE")&&typeof e.metadata=="object"&&e.metadata!==null&&typeof e.metadata.name=="string"&&typeof e.metadata.symbol=="string"&&typeof e.metadata.decimals=="number"&&typeof e.metadata.price=="number"&&typeof e.metadata.iconUrl=="string"}};var Oe={async getMyTokensWithBalance(e){let t=P.state.address,r=a.state.activeCaipNetwork;if(!t||!r)return[];if(r.chainNamespace==="eip155"){let n=await this.getEIP155Balances(t,r);if(n)return this.filterLowQualityTokens(n)}let o=await f.getBalance(t,r.caipNetworkId,e);return this.filterLowQualityTokens(o.balances)},async getEIP155Balances(e,t){try{let r=qe.getChainIdHexFromCAIP2ChainId(t.caipNetworkId);if(!(await v.getCapabilities(e))?.[r]?.assetDiscovery?.supported)return null;let n=await v.walletGetAssets({account:e,chainFilter:[r]});return qe.isWalletGetAssetsResponse(n)?(n[r]||[]).map(p=>qe.createBalance(p,t.caipNetworkId)):null}catch{return null}},filterLowQualityTokens(e){return e.filter(t=>t.quantity.decimals!=="0")},mapBalancesToSwapTokens(e){return e?.map(t=>({...t,address:t?.address?t.address:a.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}};var q=y({tokenBalances:[],loading:!1}),cr={state:q,subscribe(e){return B(q,()=>e(q))},subscribeKey(e,t){return x(q,e,t)},setToken(e){e&&(q.token=me(e))},setTokenAmount(e){q.sendTokenAmount=e},setReceiverAddress(e){q.receiverAddress=e},setReceiverProfileImageUrl(e){q.receiverProfileImageUrl=e},setReceiverProfileName(e){q.receiverProfileName=e},setNetworkBalanceInUsd(e){q.networkBalanceInUSD=e},setLoading(e){q.loading=e},async sendToken(){try{switch(L.setLoading(!0),a.state.activeCaipNetwork?.chainNamespace){case"eip155":await L.sendEvmToken();return;case"solana":await L.sendSolanaToken();return;default:throw new Error("Unsupported chain")}}finally{L.setLoading(!1)}},async sendEvmToken(){let e=a.state.activeChain,t=P.state.preferredAccountTypes?.[e];if(!L.state.sendTokenAmount||!L.state.receiverAddress)throw new Error("An amount and receiver address are required");if(!L.state.token)throw new Error("A token is required");L.state.token?.address?(W.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===se.ACCOUNT_TYPES.SMART_ACCOUNT,token:L.state.token.address,amount:L.state.sendTokenAmount,network:a.state.activeCaipNetwork?.caipNetworkId||""}}),await L.sendERC20Token({receiverAddress:L.state.receiverAddress,tokenAddress:L.state.token.address,sendTokenAmount:L.state.sendTokenAmount,decimals:L.state.token.quantity.decimals})):(W.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===se.ACCOUNT_TYPES.SMART_ACCOUNT,token:L.state.token.symbol||"",amount:L.state.sendTokenAmount,network:a.state.activeCaipNetwork?.caipNetworkId||""}}),await L.sendNativeToken({receiverAddress:L.state.receiverAddress,sendTokenAmount:L.state.sendTokenAmount,decimals:L.state.token.quantity.decimals}))},async fetchTokenBalance(e){q.loading=!0;let t=a.state.activeCaipNetwork?.caipNetworkId,r=a.state.activeCaipNetwork?.chainNamespace,o=a.state.activeCaipAddress,n=o?A.getPlainAddress(o):void 0;if(q.lastRetry&&!A.isAllowedRetry(q.lastRetry,30*X.ONE_SEC_MS))return q.loading=!1,[];try{if(n&&t&&r){let s=await Oe.getMyTokensWithBalance();return q.tokenBalances=s,q.lastRetry=void 0,s}}catch(s){q.lastRetry=Date.now(),e?.(s),K.showError("Token Balance Unavailable")}finally{q.loading=!1}return[]},fetchNetworkBalance(){if(q.tokenBalances.length===0)return;let e=Oe.mapBalancesToSwapTokens(q.tokenBalances);if(!e)return;let t=e.find(r=>r.address===a.getActiveNetworkTokenAddress());t&&(q.networkBalanceInUSD=t?F.multiply(t.quantity.numeric,t.price).toString():"0")},async sendNativeToken(e){b.pushTransactionStack({});let t=e.receiverAddress,r=P.state.address,o=v.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));await v.sendTransaction({chainNamespace:"eip155",to:t,address:r,data:"0x",value:o??BigInt(0)}),W.sendEvent({type:"track",event:"SEND_SUCCESS",properties:{isSmartAccount:P.state.preferredAccountTypes?.eip155===se.ACCOUNT_TYPES.SMART_ACCOUNT,token:L.state.token?.symbol||"",amount:e.sendTokenAmount,network:a.state.activeCaipNetwork?.caipNetworkId||""}}),v._getClient()?.updateBalance("eip155"),L.resetSend()},async sendERC20Token(e){b.pushTransactionStack({onSuccess(){b.replace("Account")}});let t=v.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));if(P.state.address&&e.sendTokenAmount&&e.receiverAddress&&e.tokenAddress){let r=A.getPlainAddress(e.tokenAddress);await v.writeContract({fromAddress:P.state.address,tokenAddress:r,args:[e.receiverAddress,t??BigInt(0)],method:"transfer",abi:Je.getERC20Abi(r),chainNamespace:"eip155"}),L.resetSend()}},async sendSolanaToken(){if(!L.state.sendTokenAmount||!L.state.receiverAddress)throw new Error("An amount and receiver address are required");b.pushTransactionStack({onSuccess(){b.replace("Account")}}),await v.sendTransaction({chainNamespace:"solana",to:L.state.receiverAddress,value:L.state.sendTokenAmount}),v._getClient()?.updateBalance("solana"),L.resetSend()},resetSend(){q.token=void 0,q.sendTokenAmount=void 0,q.receiverAddress=void 0,q.receiverProfileImageUrl=void 0,q.receiverProfileName=void 0,q.loading=!1,q.tokenBalances=[]}},L=H(cr);var rt={currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[],user:void 0},Ke={caipNetwork:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]},m=y({chains:ut(),activeCaipAddress:void 0,activeChain:void 0,activeCaipNetwork:void 0,noAdapters:!1,universalAdapter:{networkControllerClient:void 0,connectionControllerClient:void 0},isSwitchingNamespace:!1}),lr={state:m,subscribe(e){return B(m,()=>{e(m)})},subscribeKey(e,t){return x(m,e,t)},subscribeChainProp(e,t,r){let o;return B(m.chains,()=>{let n=r||m.activeChain;if(n){let s=m.chains.get(n)?.[e];o!==s&&(o=s,t(s))}})},initialize(e,t,r){let{chainId:o,namespace:n}=S.getActiveNetworkProps(),s=t?.find(R=>R.id.toString()===o?.toString()),h=e.find(R=>R?.namespace===n)||e?.[0],C=e.map(R=>R.namespace).filter(R=>R!==void 0),$=k.state.enableEmbedded?new Set([...C]):new Set([...t?.map(R=>R.chainNamespace)??[]]);(e?.length===0||!h)&&(m.noAdapters=!0),m.noAdapters||(m.activeChain=h?.namespace,m.activeCaipNetwork=s,a.setChainNetworkData(h?.namespace,{caipNetwork:s}),m.activeChain&&Ae.set({activeChain:h?.namespace})),$.forEach(R=>{let z=t?.filter(Ee=>Ee.chainNamespace===R);a.state.chains.set(R,{namespace:R,networkState:y({...Ke,caipNetwork:z?.[0]}),accountState:y(rt),caipNetworks:z??[],...r}),a.setRequestedCaipNetworks(z??[],R)})},removeAdapter(e){if(m.activeChain===e){let t=Array.from(m.chains.entries()).find(([r])=>r!==e);if(t){let r=t[1]?.caipNetworks?.[0];r&&a.setActiveCaipNetwork(r)}}m.chains.delete(e)},addAdapter(e,{networkControllerClient:t,connectionControllerClient:r},o){m.chains.set(e.namespace,{namespace:e.namespace,networkState:{...Ke,caipNetwork:o[0]},accountState:rt,caipNetworks:o,connectionControllerClient:r,networkControllerClient:t}),a.setRequestedCaipNetworks(o?.filter(n=>n.chainNamespace===e.namespace)??[],e.namespace)},addNetwork(e){let t=m.chains.get(e.chainNamespace);if(t){let r=[...t.caipNetworks||[]];t.caipNetworks?.find(o=>o.id===e.id)||r.push(e),m.chains.set(e.chainNamespace,{...t,caipNetworks:r}),a.setRequestedCaipNetworks(r,e.chainNamespace),N.filterByNamespace(e.chainNamespace,!0)}},removeNetwork(e,t){let r=m.chains.get(e);if(r){let o=m.activeCaipNetwork?.id===t,n=[...r.caipNetworks?.filter(s=>s.id!==t)||[]];o&&r?.caipNetworks?.[0]&&a.setActiveCaipNetwork(r.caipNetworks[0]),m.chains.set(e,{...r,caipNetworks:n}),a.setRequestedCaipNetworks(n||[],e),n.length===0&&N.filterByNamespace(e,!1)}},setAdapterNetworkState(e,t){let r=m.chains.get(e);r&&(r.networkState={...r.networkState||Ke,...t},m.chains.set(e,r))},setChainAccountData(e,t,r=!0){if(!e)throw new Error("Chain is required to update chain account data");let o=m.chains.get(e);if(o){let n={...o.accountState||rt,...t};m.chains.set(e,{...o,accountState:n}),(m.chains.size===1||m.activeChain===e)&&(t.caipAddress&&(m.activeCaipAddress=t.caipAddress),P.replaceState(n))}},setChainNetworkData(e,t){if(!e)return;let r=m.chains.get(e);if(r){let o={...r.networkState||Ke,...t};m.chains.set(e,{...r,networkState:o})}},setAccountProp(e,t,r,o=!0){a.setChainAccountData(r,{[e]:t},o),e==="status"&&t==="disconnected"&&r&&N.removeConnectorId(r)},setActiveNamespace(e){m.activeChain=e;let t=e?m.chains.get(e):void 0,r=t?.networkState?.caipNetwork;r?.id&&e&&(m.activeCaipAddress=t?.accountState?.caipAddress,m.activeCaipNetwork=r,a.setChainNetworkData(e,{caipNetwork:r}),S.setActiveCaipNetworkId(r?.caipNetworkId),Ae.set({activeChain:e,selectedNetworkId:r?.caipNetworkId}))},setActiveCaipNetwork(e){if(!e)return;m.activeChain!==e.chainNamespace&&a.setIsSwitchingNamespace(!0);let t=m.chains.get(e.chainNamespace);m.activeChain=e.chainNamespace,m.activeCaipNetwork=e,a.setChainNetworkData(e.chainNamespace,{caipNetwork:e}),t?.accountState?.address?m.activeCaipAddress=`${e.chainNamespace}:${e.id}:${t?.accountState?.address}`:m.activeCaipAddress=void 0,a.setAccountProp("caipAddress",m.activeCaipAddress,e.chainNamespace),t&&P.replaceState(t.accountState),L.resetSend(),Ae.set({activeChain:m.activeChain,selectedNetworkId:m.activeCaipNetwork?.caipNetworkId}),S.setActiveCaipNetworkId(e.caipNetworkId),!a.checkIfSupportedNetwork(e.chainNamespace)&&k.state.enableNetworkSwitch&&!k.state.allowUnsupportedChain&&!v.state.wcBasic&&a.showUnsupportedChainUI()},addCaipNetwork(e){if(!e)return;let t=m.chains.get(e.chainNamespace);t&&t?.caipNetworks?.push(e)},async switchActiveNamespace(e){if(!e)return;let t=e!==a.state.activeChain,r=a.getNetworkData(e)?.caipNetwork,o=a.getCaipNetworkByNamespace(e,r?.id);t&&o&&await a.switchActiveNetwork(o)},async switchActiveNetwork(e){let r=!a.state.chains.get(a.state.activeChain)?.caipNetworks?.some(n=>n.id===m.activeCaipNetwork?.id),o=a.getNetworkControllerClient(e.chainNamespace);if(o){try{await o.switchCaipNetwork(e),r&&J.close()}catch{b.goBack()}W.sendEvent({type:"track",event:"SWITCH_NETWORK",properties:{network:e.caipNetworkId}})}},getNetworkControllerClient(e){let t=e||m.activeChain,r=m.chains.get(t);if(!r)throw new Error("Chain adapter not found");if(!r.networkControllerClient)throw new Error("NetworkController client not set");return r.networkControllerClient},getConnectionControllerClient(e){let t=e||m.activeChain;if(!t)throw new Error("Chain is required to get connection controller client");let r=m.chains.get(t);if(!r?.connectionControllerClient)throw new Error("ConnectionController client not set");return r.connectionControllerClient},getAccountProp(e,t){let r=m.activeChain;if(t&&(r=t),!r)return;let o=m.chains.get(r)?.accountState;if(o)return o[e]},getNetworkProp(e,t){let r=m.chains.get(t)?.networkState;if(r)return r[e]},getRequestedCaipNetworks(e){let t=m.chains.get(e),{approvedCaipNetworkIds:r=[],requestedCaipNetworks:o=[]}=t?.networkState||{};return A.sortRequestedNetworks(r,o)},getAllRequestedCaipNetworks(){let e=[];return m.chains.forEach(t=>{let r=a.getRequestedCaipNetworks(t.namespace);e.push(...r)}),e},setRequestedCaipNetworks(e,t){a.setAdapterNetworkState(t,{requestedCaipNetworks:e});let o=a.getAllRequestedCaipNetworks().map(s=>s.chainNamespace),n=Array.from(new Set(o));N.filterByNamespaces(n)},getAllApprovedCaipNetworkIds(){let e=[];return m.chains.forEach(t=>{let r=a.getApprovedCaipNetworkIds(t.namespace);e.push(...r)}),e},getActiveCaipNetwork(){return m.activeCaipNetwork},getActiveCaipAddress(){return m.activeCaipAddress},getApprovedCaipNetworkIds(e){return m.chains.get(e)?.networkState?.approvedCaipNetworkIds||[]},async setApprovedCaipNetworksData(e){let r=await a.getNetworkControllerClient()?.getApprovedCaipNetworksData();a.setAdapterNetworkState(e,{approvedCaipNetworkIds:r?.approvedCaipNetworkIds,supportsAllNetworks:r?.supportsAllNetworks})},checkIfSupportedNetwork(e,t){let r=t||m.activeCaipNetwork,o=a.getRequestedCaipNetworks(e);return o.length?o?.some(n=>n.id===r?.id):!0},checkIfSupportedChainId(e){return m.activeChain?a.getRequestedCaipNetworks(m.activeChain)?.some(r=>r.id===e):!0},setSmartAccountEnabledNetworks(e,t){a.setAdapterNetworkState(t,{smartAccountEnabledNetworks:e})},checkIfSmartAccountEnabled(){let e=Xe.caipNetworkIdToNumber(m.activeCaipNetwork?.caipNetworkId),t=m.activeChain;return!t||!e?!1:!!a.getNetworkProp("smartAccountEnabledNetworks",t)?.includes(Number(e))},getActiveNetworkTokenAddress(){let e=m.activeCaipNetwork?.chainNamespace||"eip155",t=m.activeCaipNetwork?.id||1,r=X.NATIVE_TOKEN_ADDRESS[e];return`${e}:${t}:${r}`},showUnsupportedChainUI(){J.open({view:"UnsupportedChain"})},checkIfNamesSupported(){let e=m.activeCaipNetwork;return!!(e?.chainNamespace&&X.NAMES_SUPPORTED_CHAIN_NAMESPACES.includes(e.chainNamespace))},resetNetwork(e){a.setAdapterNetworkState(e,{approvedCaipNetworkIds:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]})},resetAccount(e){let t=e;if(!t)throw new Error("Chain is required to set account prop");m.activeCaipAddress=void 0,a.setChainAccountData(t,{smartAccountDeployed:!1,currentTab:0,caipAddress:void 0,address:void 0,balance:void 0,balanceSymbol:void 0,profileName:void 0,profileImage:void 0,addressExplorerUrl:void 0,tokenBalance:[],connectedWalletInfo:void 0,preferredAccountTypes:void 0,socialProvider:void 0,socialWindow:void 0,farcasterUrl:void 0,allAccounts:[],user:void 0,status:"disconnected"}),N.removeConnectorId(t)},setIsSwitchingNamespace(e){m.isSwitchingNamespace=e},getFirstCaipNetworkSupportsAuthConnector(){let e=[],t;if(m.chains.forEach(r=>{j.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(o=>o===r.namespace)&&r.namespace&&e.push(r.namespace)}),e.length>0){let r=e[0];return t=r?m.chains.get(r)?.caipNetworks?.[0]:void 0,t}},getAccountData(e){return e?a.state.chains.get(e)?.accountState:P.state},getNetworkData(e){let t=e||m.activeChain;if(t)return a.state.chains.get(t)?.networkState},getCaipNetworkByNamespace(e,t){if(!e)return;let r=a.state.chains.get(e),o=r?.caipNetworks?.find(n=>n.id===t);return o||r?.networkState?.caipNetwork||r?.caipNetworks?.[0]},getRequestedCaipNetworkIds(){let e=N.state.filterByNamespace;return(e?[m.chains.get(e)]:Array.from(m.chains.values())).flatMap(r=>r?.caipNetworks||[]).map(r=>r.caipNetworkId)},getCaipNetworks(e){return e?a.getRequestedCaipNetworks(e):a.getAllRequestedCaipNetworks()}},a=H(lr);var ur=A.getApiUrl(),oe=new ue({baseUrl:ur,clientId:null}),pr=40,Tt=4,dr=20,U=y({promises:{},page:1,count:0,featured:[],allFeatured:[],recommended:[],allRecommended:[],wallets:[],filteredWallets:[],search:[],isAnalyticsEnabled:!1,excludedWallets:[],isFetchingRecommendedWallets:!1}),I={state:U,subscribeKey(e,t){return x(U,e,t)},_getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=k.state;return{projectId:e,st:t||"appkit",sv:r||"html-wagmi-4.2.2"}},_filterOutExtensions(e){return k.state.isUniversalProvider?e.filter(t=>!!(t.mobile_link||t.desktop_link||t.webapp_link)):e},async _fetchWalletImage(e){let t=`${oe.baseUrl}/getWalletImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setWalletImage(e,URL.createObjectURL(r))},async _fetchNetworkImage(e){let t=`${oe.baseUrl}/public/getAssetImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setNetworkImage(e,URL.createObjectURL(r))},async _fetchConnectorImage(e){let t=`${oe.baseUrl}/public/getAssetImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setConnectorImage(e,URL.createObjectURL(r))},async _fetchCurrencyImage(e){let t=`${oe.baseUrl}/public/getCurrencyImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setCurrencyImage(e,URL.createObjectURL(r))},async _fetchTokenImage(e){let t=`${oe.baseUrl}/public/getTokenImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setTokenImage(e,URL.createObjectURL(r))},_filterWalletsByPlatform(e){return A.isMobile()?e?.filter(r=>r.mobile_link||r.id===pe.COINBASE.id?!0:a.state.activeChain==="solana"&&(r.id===pe.SOLFLARE.id||r.id===pe.PHANTOM.id)):e},async fetchProjectConfig(){return(await oe.get({path:"/appkit/v1/config",params:I._getSdkProperties()})).features},async fetchAllowedOrigins(){try{let{allowedOrigins:e}=await oe.get({path:"/projects/v1/origins",params:I._getSdkProperties()});return e}catch{return[]}},async fetchNetworkImages(){let t=a.getAllRequestedCaipNetworks()?.map(({assets:r})=>r?.imageId).filter(Boolean).filter(r=>!ot.getNetworkImageById(r));t&&await Promise.allSettled(t.map(r=>I._fetchNetworkImage(r)))},async fetchConnectorImages(){let{connectors:e}=N.state,t=e.map(({imageId:r})=>r).filter(Boolean);await Promise.allSettled(t.map(r=>I._fetchConnectorImage(r)))},async fetchCurrencyImages(e=[]){await Promise.allSettled(e.map(t=>I._fetchCurrencyImage(t)))},async fetchTokenImages(e=[]){await Promise.allSettled(e.map(t=>I._fetchTokenImage(t)))},async fetchWallets(e){let t=e.exclude??[];I._getSdkProperties().sv.startsWith("html-core-")&&t.push(...Object.values(pe).map(s=>s.id));let o=await oe.get({path:"/getWallets",params:{...I._getSdkProperties(),...e,page:String(e.page),entries:String(e.entries),include:e.include?.join(","),exclude:t.join(",")}});return{data:I._filterWalletsByPlatform(o?.data)||[],count:o?.count}},async fetchFeaturedWallets(){let{featuredWalletIds:e}=k.state;if(e?.length){let t={...I._getSdkProperties(),page:1,entries:e?.length??Tt,include:e},{data:r}=await I.fetchWallets(t),o=[...r].sort((s,p)=>e.indexOf(s.id)-e.indexOf(p.id)),n=o.map(s=>s.image_id).filter(Boolean);await Promise.allSettled(n.map(s=>I._fetchWalletImage(s))),U.featured=o,U.allFeatured=o}},async fetchRecommendedWallets(){try{U.isFetchingRecommendedWallets=!0;let{includeWalletIds:e,excludeWalletIds:t,featuredWalletIds:r}=k.state,o=[...t??[],...r??[]].filter(Boolean),n=a.getRequestedCaipNetworkIds().join(","),s={page:1,entries:Tt,include:e,exclude:o,chains:n},{data:p,count:h}=await I.fetchWallets(s),C=S.getRecentWallets(),$=p.map(z=>z.image_id).filter(Boolean),R=C.map(z=>z.image_id).filter(Boolean);await Promise.allSettled([...$,...R].map(z=>I._fetchWalletImage(z))),U.recommended=p,U.allRecommended=p,U.count=h??0}catch{}finally{U.isFetchingRecommendedWallets=!1}},async fetchWalletsByPage({page:e}){let{includeWalletIds:t,excludeWalletIds:r,featuredWalletIds:o}=k.state,n=a.getRequestedCaipNetworkIds().join(","),s=[...U.recommended.map(({id:R})=>R),...r??[],...o??[]].filter(Boolean),p={page:e,entries:pr,include:t,exclude:s,chains:n},{data:h,count:C}=await I.fetchWallets(p),$=h.slice(0,dr).map(R=>R.image_id).filter(Boolean);await Promise.allSettled($.map(R=>I._fetchWalletImage(R))),U.wallets=A.uniqueBy([...U.wallets,...I._filterOutExtensions(h)],"id").filter(R=>R.chains?.some(z=>n.includes(z))),U.count=C>U.count?C:U.count,U.page=e},async initializeExcludedWallets({ids:e}){let t={page:1,entries:e.length,include:e},{data:r}=await I.fetchWallets(t);r&&r.forEach(o=>{U.excludedWallets.push({rdns:o.rdns,name:o.name})})},async searchWallet({search:e,badge:t}){let{includeWalletIds:r,excludeWalletIds:o}=k.state,n=a.getRequestedCaipNetworkIds().join(",");U.search=[];let s={page:1,entries:100,search:e?.trim(),badge_type:t,include:r,exclude:o,chains:n},{data:p}=await I.fetchWallets(s);W.sendEvent({type:"track",event:"SEARCH_WALLET",properties:{badge:t??"",search:e??""}});let h=p.map(C=>C.image_id).filter(Boolean);await Promise.allSettled([...h.map(C=>I._fetchWalletImage(C)),A.wait(300)]),U.search=I._filterOutExtensions(p)},initPromise(e,t){let r=U.promises[e];return r||(U.promises[e]=t())},prefetch({fetchConnectorImages:e=!0,fetchFeaturedWallets:t=!0,fetchRecommendedWallets:r=!0,fetchNetworkImages:o=!0}={}){let n=[e&&I.initPromise("connectorImages",I.fetchConnectorImages),t&&I.initPromise("featuredWallets",I.fetchFeaturedWallets),r&&I.initPromise("recommendedWallets",I.fetchRecommendedWallets),o&&I.initPromise("networkImages",I.fetchNetworkImages)].filter(Boolean);return Promise.allSettled(n)},prefetchAnalyticsConfig(){k.state.features?.analytics&&I.fetchAnalyticsConfig()},async fetchAnalyticsConfig(){try{let{isAnalyticsEnabled:e}=await oe.get({path:"/getAnalyticsConfig",params:I._getSdkProperties()});k.setFeatures({analytics:e})}catch{k.setFeatures({analytics:!1})}},filterByNamespaces(e){if(!e?.length){U.featured=U.allFeatured,U.recommended=U.allRecommended;return}let t=a.getRequestedCaipNetworkIds().join(",");U.featured=U.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),U.recommended=U.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o))),U.filteredWallets=U.wallets.filter(r=>r.chains?.some(o=>t.includes(o)))},clearFilterByNamespaces(){U.filteredWallets=[]},setFilterByNamespace(e){if(!e){U.featured=U.allFeatured,U.recommended=U.allRecommended;return}let t=a.getRequestedCaipNetworkIds().join(",");U.featured=U.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),U.recommended=U.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o))),U.filteredWallets=U.wallets.filter(r=>r.chains?.some(o=>t.includes(o)))}};var mr={eip155:"ba0ba0cd-17c6-4806-ad93-f9d174f17900",solana:"a1b58899-f671-4276-6a5e-56ca5bd59700",polkadot:"",bip122:"0b4838db-0161-4ffe-022d-532bf03dba00",cosmos:""},nt=y({networkImagePromises:{}}),ot={async fetchWalletImage(e){if(e)return await I._fetchWalletImage(e),this.getWalletImageById(e)},async fetchNetworkImage(e){if(!e)return;let t=this.getNetworkImageById(e);return t||(nt.networkImagePromises[e]||(nt.networkImagePromises[e]=I._fetchNetworkImage(e)),await nt.networkImagePromises[e],this.getNetworkImageById(e))},getWalletImageById(e){if(e)return ee.state.walletImages[e]},getWalletImage(e){if(e?.image_url)return e?.image_url;if(e?.image_id)return ee.state.walletImages[e.image_id]},getNetworkImage(e){if(e?.assets?.imageUrl)return e?.assets?.imageUrl;if(e?.assets?.imageId)return ee.state.networkImages[e.assets.imageId]},getNetworkImageById(e){if(e)return ee.state.networkImages[e]},getConnectorImage(e){if(e?.imageUrl)return e.imageUrl;if(e?.imageId)return ee.state.connectorImages[e.imageId]},getChainImage(e){return ee.state.networkImages[mr[e]]}};c();u();l();var Fe={id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},st={id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},hr={providers:Ze,selectedProvider:null,error:null,purchaseCurrency:Fe,paymentCurrency:st,purchaseCurrencies:[Fe],paymentCurrencies:[],quotesLoading:!1},D=y(hr),fr={state:D,subscribe(e){return B(D,()=>e(D))},subscribeKey(e,t){return x(D,e,t)},setSelectedProvider(e){if(e&&e.name==="meld"){let t=a.state.activeChain===j.CHAIN.SOLANA?"SOL":"USDC",r=P.state.address??"",o=new URL(e.url);o.searchParams.append("publicKey",Ct),o.searchParams.append("destinationCurrencyCode",t),o.searchParams.append("walletAddress",r),o.searchParams.append("externalCustomerId",k.state.projectId),D.selectedProvider={...e,url:o.toString()}}else D.selectedProvider=e},setOnrampProviders(e){if(Array.isArray(e)&&e.every(t=>typeof t=="string")){let t=e,r=Ze.filter(o=>t.includes(o.name));D.providers=r}else D.providers=[]},setPurchaseCurrency(e){D.purchaseCurrency=e},setPaymentCurrency(e){D.paymentCurrency=e},setPurchaseAmount(e){at.state.purchaseAmount=e},setPaymentAmount(e){at.state.paymentAmount=e},async getAvailableCurrencies(){let e=await f.getOnrampOptions();D.purchaseCurrencies=e.purchaseCurrencies,D.paymentCurrencies=e.paymentCurrencies,D.paymentCurrency=e.paymentCurrencies[0]||st,D.purchaseCurrency=e.purchaseCurrencies[0]||Fe,await I.fetchCurrencyImages(e.paymentCurrencies.map(t=>t.id)),await I.fetchTokenImages(e.purchaseCurrencies.map(t=>t.symbol))},async getQuote(){D.quotesLoading=!0;try{let e=await f.getOnrampQuote({purchaseCurrency:D.purchaseCurrency,paymentCurrency:D.paymentCurrency,amount:D.paymentAmount?.toString()||"0",network:D.purchaseCurrency?.symbol});return D.quotesLoading=!1,D.purchaseAmount=Number(e?.purchaseAmount.amount),e}catch(e){return D.error=e.message,D.quotesLoading=!1,null}finally{D.quotesLoading=!1}},resetState(){D.selectedProvider=null,D.error=null,D.purchaseCurrency=Fe,D.paymentCurrency=st,D.purchaseCurrencies=[Fe],D.paymentCurrencies=[],D.paymentAmount=void 0,D.purchaseAmount=void 0,D.quotesLoading=!1}},at=H(fr);c();u();l();c();u();l();var Ge={async getTokenList(){let e=a.state.activeCaipNetwork;return(await f.fetchSwapTokens({chainId:e?.caipNetworkId}))?.tokens?.map(o=>({...o,eip2612:!1,quantity:{decimals:"0",numeric:"0"},price:0,value:0}))||[]},async fetchGasPrice(){let e=a.state.activeCaipNetwork;if(!e)return null;try{switch(e.chainNamespace){case"solana":let t=(await v?.estimateGas({chainNamespace:"solana"}))?.toString();return{standard:t,fast:t,instant:t};case"eip155":default:return await f.fetchGasPrice({chainId:e.caipNetworkId})}}catch{return null}},async fetchSwapAllowance({tokenAddress:e,userAddress:t,sourceTokenAmount:r,sourceTokenDecimals:o}){let n=await f.fetchSwapAllowance({tokenAddress:e,userAddress:t});if(n?.allowance&&r&&o){let s=v.parseUnits(r,o)||0;return BigInt(n.allowance)>=s}return!1},async getMyTokensWithBalance(e){let t=P.state.address,r=a.state.activeCaipNetwork;if(!t||!r)return[];let n=(await f.getBalance(t,r.caipNetworkId,e)).balances.filter(s=>s.quantity.decimals!=="0");return P.setTokenBalance(n,a.state.activeChain),this.mapBalancesToSwapTokens(n)},mapBalancesToSwapTokens(e){return e?.map(t=>({...t,address:t?.address?t.address:a.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}};c();u();l();var we={getGasPriceInEther(e,t){let r=t*e;return Number(r)/1e18},getGasPriceInUSD(e,t,r){let o=we.getGasPriceInEther(t,r);return F.bigNumber(e).times(o).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:r,toTokenAmount:o}){let n=F.bigNumber(e).times(t),s=F.bigNumber(o).times(r);return n.minus(s).div(n).times(100).toNumber()},getMaxSlippage(e,t){let r=F.bigNumber(e).div(100);return F.multiply(t,r).toNumber()},getProviderFee(e,t=.0085){return F.bigNumber(e).times(t).toString()},isInsufficientNetworkTokenForGas(e,t){let r=t||"0";return F.bigNumber(e).eq(0)?!0:F.bigNumber(F.bigNumber(r)).gt(e)},isInsufficientSourceTokenForSwap(e,t,r){let o=r?.find(s=>s.address===t)?.quantity?.numeric;return F.bigNumber(o||"0").lt(e)},getToTokenAmount({sourceToken:e,toToken:t,sourceTokenPrice:r,toTokenPrice:o,sourceTokenAmount:n}){if(n==="0"||!e||!t)return"0";let s=e.decimals,p=r,h=t.decimals,C=o;if(C<=0)return"0";let $=F.bigNumber(n).times(.0085),z=F.bigNumber(n).minus($).times(F.bigNumber(10).pow(s)),Ee=F.bigNumber(p).div(C),We=s-h;return z.times(Ee).div(F.bigNumber(10).pow(We)).div(F.bigNumber(10).pow(h)).toFixed(h).toString()}};var yt=15e4,gr=6;var Z={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:X.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},i=y(Z),Ve={state:i,subscribe(e){return B(i,()=>e(i))},subscribeKey(e,t){return x(i,e,t)},getParams(){let e=a.state.activeCaipAddress,t=a.state.activeChain,r=A.getPlainAddress(e),o=a.getActiveNetworkTokenAddress(),n=N.getConnectorId(t);if(!r)throw new Error("No address found to swap the tokens from.");let s=!i.toToken?.address||!i.toToken?.decimals,p=!i.sourceToken?.address||!i.sourceToken?.decimals||!F.bigNumber(i.sourceTokenAmount).gt(0),h=!i.sourceTokenAmount;return{networkAddress:o,fromAddress:r,fromCaipAddress:e,sourceTokenAddress:i.sourceToken?.address,toTokenAddress:i.toToken?.address,toTokenAmount:i.toTokenAmount,toTokenDecimals:i.toToken?.decimals,sourceTokenAmount:i.sourceTokenAmount,sourceTokenDecimals:i.sourceToken?.decimals,invalidToToken:s,invalidSourceToken:p,invalidSourceTokenAmount:h,availableToSwap:e&&!s&&!p&&!h,isAuthConnector:n===j.CONNECTOR_ID.AUTH}},setSourceToken(e){if(!e){i.sourceToken=e,i.sourceTokenAmount="",i.sourceTokenPriceInUSD=0;return}i.sourceToken=e,T.setTokenPrice(e.address,"sourceToken")},setSourceTokenAmount(e){i.sourceTokenAmount=e},setToToken(e){if(!e){i.toToken=e,i.toTokenAmount="",i.toTokenPriceInUSD=0;return}i.toToken=e,T.setTokenPrice(e.address,"toToken")},setToTokenAmount(e){i.toTokenAmount=e?F.formatNumberToLocalString(e,gr):""},async setTokenPrice(e,t){let r=i.tokensPriceMap[e]||0;r||(i.loadingPrices=!0,r=await T.getAddressPrice(e)),t==="sourceToken"?i.sourceTokenPriceInUSD=r:t==="toToken"&&(i.toTokenPriceInUSD=r),i.loadingPrices&&(i.loadingPrices=!1),T.getParams().availableToSwap&&T.swapTokens()},switchTokens(){if(i.initializing||!i.initialized)return;let e=i.toToken?{...i.toToken}:void 0,t=i.sourceToken?{...i.sourceToken}:void 0,r=e&&i.toTokenAmount===""?"1":i.toTokenAmount;T.setSourceToken(e),T.setToToken(t),T.setSourceTokenAmount(r),T.setToTokenAmount(""),T.swapTokens()},resetState(){i.myTokensWithBalance=Z.myTokensWithBalance,i.tokensPriceMap=Z.tokensPriceMap,i.initialized=Z.initialized,i.sourceToken=Z.sourceToken,i.sourceTokenAmount=Z.sourceTokenAmount,i.sourceTokenPriceInUSD=Z.sourceTokenPriceInUSD,i.toToken=Z.toToken,i.toTokenAmount=Z.toTokenAmount,i.toTokenPriceInUSD=Z.toTokenPriceInUSD,i.networkPrice=Z.networkPrice,i.networkTokenSymbol=Z.networkTokenSymbol,i.networkBalanceInUSD=Z.networkBalanceInUSD,i.inputError=Z.inputError,i.myTokensWithBalance=Z.myTokensWithBalance},resetValues(){let{networkAddress:e}=T.getParams(),t=i.tokens?.find(r=>r.address===e);T.setSourceToken(t),T.setToToken(void 0)},getApprovalLoadingState(){return i.loadingApprovalTransaction},clearError(){i.transactionError=void 0},async initializeState(){if(!i.initializing){if(i.initializing=!0,!i.initialized)try{await T.fetchTokens(),i.initialized=!0}catch{i.initialized=!1,K.showError("Failed to initialize swap"),b.goBack()}i.initializing=!1}},async fetchTokens(){let{networkAddress:e}=T.getParams();await T.getTokenList(),await T.getNetworkTokenPrice(),await T.getMyTokensWithBalance();let t=i.tokens?.find(r=>r.address===e);t&&(i.networkTokenSymbol=t.symbol,T.setSourceToken(t),T.setSourceTokenAmount("1"))},async getTokenList(){let e=await Ge.getTokenList();i.tokens=e,i.popularTokens=e.sort((t,r)=>t.symbol<r.symbol?-1:t.symbol>r.symbol?1:0),i.suggestedTokens=e.filter(t=>!!X.SWAP_SUGGESTED_TOKENS.includes(t.symbol),{})},async getAddressPrice(e){let t=i.tokensPriceMap[e];if(t)return t;let o=(await f.fetchTokenPrice({addresses:[e]}))?.fungibles||[],s=[...i.tokens||[],...i.myTokensWithBalance||[]]?.find(C=>C.address===e)?.symbol,p=o.find(C=>C.symbol.toLowerCase()===s?.toLowerCase())?.price||0,h=parseFloat(p.toString());return i.tokensPriceMap[e]=h,h},async getNetworkTokenPrice(){let{networkAddress:e}=T.getParams(),r=(await f.fetchTokenPrice({addresses:[e]}).catch(()=>(K.showError("Failed to fetch network token price"),{fungibles:[]}))).fungibles?.[0],o=r?.price.toString()||"0";i.tokensPriceMap[e]=parseFloat(o),i.networkTokenSymbol=r?.symbol||"",i.networkPrice=o},async getMyTokensWithBalance(e){let t=await Oe.getMyTokensWithBalance(e),r=Oe.mapBalancesToSwapTokens(t);r&&(await T.getInitialGasPrice(),T.setBalances(r))},setBalances(e){let{networkAddress:t}=T.getParams(),r=a.state.activeCaipNetwork;if(!r)return;let o=e.find(n=>n.address===t);e.forEach(n=>{i.tokensPriceMap[n.address]=n.price||0}),i.myTokensWithBalance=e.filter(n=>n.address.startsWith(r.caipNetworkId)),i.networkBalanceInUSD=o?F.multiply(o.quantity.numeric,o.price).toString():"0"},async getInitialGasPrice(){let e=await Ge.fetchGasPrice();if(!e)return{gasPrice:null,gasPriceInUSD:null};switch(a.state?.activeCaipNetwork?.chainNamespace){case"solana":return i.gasFee=e.standard??"0",i.gasPriceInUSD=F.multiply(e.standard,i.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(i.gasFee),gasPriceInUSD:Number(i.gasPriceInUSD)};case"eip155":default:let t=e.standard??"0",r=BigInt(t),o=BigInt(yt),n=we.getGasPriceInUSD(i.networkPrice,o,r);return i.gasFee=t,i.gasPriceInUSD=n,{gasPrice:r,gasPriceInUSD:n}}},async swapTokens(){let e=P.state.address,t=i.sourceToken,r=i.toToken,o=F.bigNumber(i.sourceTokenAmount).gt(0);if(o||T.setToTokenAmount(""),!r||!t||i.loadingPrices||!o)return;i.loadingQuote=!0;let n=F.bigNumber(i.sourceTokenAmount).times(10**t.decimals).round(0);try{let s=await f.fetchSwapQuote({userAddress:e,from:t.address,to:r.address,gasPrice:i.gasFee,amount:n.toString()});i.loadingQuote=!1;let p=s?.quotes?.[0]?.toAmount;if(!p){Be.open({shortMessage:"Incorrect amount",longMessage:"Please enter a valid amount"},"error");return}let h=F.bigNumber(p).div(10**r.decimals).toString();T.setToTokenAmount(h),T.hasInsufficientToken(i.sourceTokenAmount,t.address)?i.inputError="Insufficient balance":(i.inputError=void 0,T.setTransactionDetails())}catch{i.loadingQuote=!1,i.inputError="Insufficient balance"}},async getTransaction(){let{fromCaipAddress:e,availableToSwap:t}=T.getParams(),r=i.sourceToken,o=i.toToken;if(!(!e||!t||!r||!o||i.loadingQuote))try{i.loadingBuildTransaction=!0;let n=await Ge.fetchSwapAllowance({userAddress:e,tokenAddress:r.address,sourceTokenAmount:i.sourceTokenAmount,sourceTokenDecimals:r.decimals}),s;return n?s=await T.createSwapTransaction():s=await T.createAllowanceTransaction(),i.loadingBuildTransaction=!1,i.fetchError=!1,s}catch{b.goBack(),K.showError("Failed to check allowance"),i.loadingBuildTransaction=!1,i.approvalTransaction=void 0,i.swapTransaction=void 0,i.fetchError=!0;return}},async createAllowanceTransaction(){let{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:r}=T.getParams();if(!(!e||!r)){if(!t)throw new Error("createAllowanceTransaction - No source token address found.");try{let o=await f.generateApproveCalldata({from:t,to:r,userAddress:e}),n={data:o.tx.data,to:A.getPlainAddress(o.tx.from),gasPrice:BigInt(o.tx.eip155.gasPrice),value:BigInt(o.tx.value),toAmount:i.toTokenAmount};return i.swapTransaction=void 0,i.approvalTransaction={data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount},{data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount}}catch{b.goBack(),K.showError("Failed to create approval transaction"),i.approvalTransaction=void 0,i.swapTransaction=void 0,i.fetchError=!0;return}}},async createSwapTransaction(){let{networkAddress:e,fromCaipAddress:t,sourceTokenAmount:r}=T.getParams(),o=i.sourceToken,n=i.toToken;if(!t||!r||!o||!n)return;let s=v.parseUnits(r,o.decimals)?.toString();try{let p=await f.generateSwapCalldata({userAddress:t,from:o.address,to:n.address,amount:s,disableEstimate:!0}),h=o.address===e,C=BigInt(p.tx.eip155.gas),$=BigInt(p.tx.eip155.gasPrice),R={data:p.tx.data,to:A.getPlainAddress(p.tx.to),gas:C,gasPrice:$,value:BigInt(h?s??"0":"0"),toAmount:i.toTokenAmount};return i.gasPriceInUSD=we.getGasPriceInUSD(i.networkPrice,C,$),i.approvalTransaction=void 0,i.swapTransaction=R,R}catch{b.goBack(),K.showError("Failed to create transaction"),i.approvalTransaction=void 0,i.swapTransaction=void 0,i.fetchError=!0;return}},async sendTransactionForApproval(e){let{fromAddress:t,isAuthConnector:r}=T.getParams();i.loadingApprovalTransaction=!0;let o="Approve limit increase in your wallet";r?b.pushTransactionStack({onSuccess(){K.showLoading(o)}}):K.showLoading(o);try{await v.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:"eip155"}),await T.swapTokens(),await T.getTransaction(),i.approvalTransaction=void 0,i.loadingApprovalTransaction=!1}catch(n){let s=n;i.transactionError=s?.shortMessage,i.loadingApprovalTransaction=!1,K.showError(s?.shortMessage||"Transaction error"),W.sendEvent({type:"track",event:"SWAP_APPROVAL_ERROR",properties:{message:s?.shortMessage||s?.message||"Unknown",network:a.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:T.state.sourceToken?.symbol||"",swapToToken:T.state.toToken?.symbol||"",swapFromAmount:T.state.sourceTokenAmount||"",swapToAmount:T.state.toTokenAmount||"",isSmartAccount:P.state.preferredAccountTypes?.eip155===se.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){if(!e)return;let{fromAddress:t,toTokenAmount:r,isAuthConnector:o}=T.getParams();i.loadingTransaction=!0;let n=`Swapping ${i.sourceToken?.symbol} to ${F.formatNumberToLocalString(r,3)} ${i.toToken?.symbol}`,s=`Swapped ${i.sourceToken?.symbol} to ${F.formatNumberToLocalString(r,3)} ${i.toToken?.symbol}`;o?b.pushTransactionStack({onSuccess(){b.replace("Account"),K.showLoading(n),Ve.resetState()}}):K.showLoading("Confirm transaction in your wallet");try{let p=[i.sourceToken?.address,i.toToken?.address].join(","),h=await v.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:"eip155"});return i.loadingTransaction=!1,K.showSuccess(s),W.sendEvent({type:"track",event:"SWAP_SUCCESS",properties:{network:a.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:T.state.sourceToken?.symbol||"",swapToToken:T.state.toToken?.symbol||"",swapFromAmount:T.state.sourceTokenAmount||"",swapToAmount:T.state.toTokenAmount||"",isSmartAccount:P.state.preferredAccountTypes?.eip155===se.ACCOUNT_TYPES.SMART_ACCOUNT}}),Ve.resetState(),o||b.replace("Account"),Ve.getMyTokensWithBalance(p),h}catch(p){let h=p;i.transactionError=h?.shortMessage,i.loadingTransaction=!1,K.showError(h?.shortMessage||"Transaction error"),W.sendEvent({type:"track",event:"SWAP_ERROR",properties:{message:h?.shortMessage||h?.message||"Unknown",network:a.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:T.state.sourceToken?.symbol||"",swapToToken:T.state.toToken?.symbol||"",swapFromAmount:T.state.sourceTokenAmount||"",swapToAmount:T.state.toTokenAmount||"",isSmartAccount:P.state.preferredAccountTypes?.eip155===se.ACCOUNT_TYPES.SMART_ACCOUNT}});return}},hasInsufficientToken(e,t){return we.isInsufficientSourceTokenForSwap(e,t,i.myTokensWithBalance)},setTransactionDetails(){let{toTokenAddress:e,toTokenDecimals:t}=T.getParams();!e||!t||(i.gasPriceInUSD=we.getGasPriceInUSD(i.networkPrice,BigInt(i.gasFee),BigInt(yt)),i.priceImpact=we.getPriceImpact({sourceTokenAmount:i.sourceTokenAmount,sourceTokenPriceInUSD:i.sourceTokenPriceInUSD,toTokenPriceInUSD:i.toTokenPriceInUSD,toTokenAmount:i.toTokenAmount}),i.maxSlippage=we.getMaxSlippage(i.slippage,i.toTokenAmount),i.providerFee=we.getProviderFee(i.sourceTokenAmount))}},T=H(Ve);c();u();l();var de=y({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),wr={state:de,subscribe(e){return B(de,()=>e(de))},subscribeKey(e,t){return x(de,e,t)},showTooltip({message:e,triggerRect:t,variant:r}){de.open=!0,de.message=e,de.triggerRect=t,de.variant=r},hide(){de.open=!1,de.message="",de.triggerRect={width:0,height:0,top:0,left:0}}},Cr=H(wr);c();u();l();c();u();l();var It={convertEVMChainIdToCoinType(e){if(e>=2147483648)throw new Error("Invalid chainId");return(2147483648|e)>>>0}};var le=y({suggestions:[],loading:!1}),br={state:le,subscribe(e){return B(le,()=>e(le))},subscribeKey(e,t){return x(le,e,t)},async resolveName(e){try{return await f.lookupEnsName(e)}catch(t){let r=t;throw new Error(r?.reasons?.[0]?.description||"Error resolving name")}},async isNameRegistered(e){try{return await f.lookupEnsName(e),!0}catch{return!1}},async getSuggestions(e){try{le.loading=!0,le.suggestions=[];let t=await f.getEnsNameSuggestions(e);return le.suggestions=t.suggestions.map(r=>({...r,name:r.name}))||[],le.suggestions}catch(t){let r=ze.parseEnsApiError(t,"Error fetching name suggestions");throw new Error(r)}finally{le.loading=!1}},async getNamesForAddress(e){try{if(!a.state.activeCaipNetwork)return[];let r=S.getEnsFromCacheForAddress(e);if(r)return r;let o=await f.reverseLookupEnsName({address:e});return S.updateEnsCache({address:e,ens:o,timestamp:Date.now()}),o}catch(t){let r=ze.parseEnsApiError(t,"Error fetching names for address");throw new Error(r)}},async registerName(e){let t=a.state.activeCaipNetwork;if(!t)throw new Error("Network not found");let r=P.state.address,o=N.getAuthConnector();if(!r||!o)throw new Error("Address or auth connector not found");le.loading=!0;try{let n=JSON.stringify({name:e,attributes:{},timestamp:Math.floor(Date.now()/1e3)});b.pushTransactionStack({onCancel(){b.replace("RegisterAccountName")}});let s=await v.signMessage(n);le.loading=!1;let p=t.id;if(!p)throw new Error("Network not found");let h=It.convertEVMChainIdToCoinType(Number(p));await f.registerEnsName({coinType:h,address:r,signature:s,message:n}),P.setProfileName(e,t.chainNamespace),b.replace("RegisterAccountNameSuccess")}catch(n){let s=ze.parseEnsApiError(n,`Error registering name ${e}`);throw b.replace("RegisterAccountName"),new Error(s)}finally{le.loading=!1}},validateName(e){return/^[a-zA-Z0-9-]{4,}$/u.test(e)},parseEnsApiError(e,t){return e?.reasons?.[0]?.description||t}},ze=H(br);c();u();l();var He=y({isLegalCheckboxChecked:!1}),Ar={state:He,subscribe(e){return B(He,()=>e(He))},subscribeKey(e,t){return x(He,e,t)},setIsLegalCheckboxChecked(e){He.isLegalCheckboxChecked=e}};c();u();l();var Ue={getSIWX(){return k.state.siwx},async initializeIfEnabled(){let e=k.state.siwx,t=a.getActiveCaipAddress();if(!(e&&t))return;let[r,o,n]=t.split(":");if(a.checkIfSupportedNetwork(r))try{if((await e.getSessions(`${r}:${o}`,n)).length)return;await J.open({view:"SIWXSignMessage"})}catch(s){console.error("SIWXUtil:initializeIfEnabled",s),W.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:this.getSIWXEventProperties()}),await v._getClient()?.disconnect().catch(console.error),b.reset("Connect"),K.showError("A problem occurred while trying initialize authentication")}},async requestSignMessage(){let e=k.state.siwx,t=A.getPlainAddress(a.getActiveCaipAddress()),r=a.getActiveCaipNetwork(),o=v._getClient();if(!e)throw new Error("SIWX is not enabled");if(!t)throw new Error("No ActiveCaipAddress found");if(!r)throw new Error("No ActiveCaipNetwork or client found");if(!o)throw new Error("No ConnectionController client found");try{let n=await e.createMessage({chainId:r.caipNetworkId,accountAddress:t}),s=n.toString();N.getConnectorId(r.chainNamespace)===j.CONNECTOR_ID.AUTH&&b.pushTransactionStack({});let h=await o.signMessage(s);await e.addSession({data:n,message:s,signature:h}),J.close(),W.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:this.getSIWXEventProperties()})}catch(n){let s=this.getSIWXEventProperties();(!J.state.open||b.state.view==="ApproveTransaction")&&await J.open({view:"SIWXSignMessage"}),s.isSmartAccount?K.showError("This application might not support Smart Accounts"):K.showError("Signature declined"),W.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:s}),console.error("SWIXUtil:requestSignMessage",n)}},async cancelSignMessage(){try{this.getSIWX()?.getRequired?.()?await v.disconnect():J.close(),b.reset("Connect"),W.sendEvent({event:"CLICK_CANCEL_SIWX",type:"track",properties:this.getSIWXEventProperties()})}catch(e){console.error("SIWXUtil:cancelSignMessage",e)}},async getSessions(){let e=k.state.siwx,t=A.getPlainAddress(a.getActiveCaipAddress()),r=a.getActiveCaipNetwork();return e&&t&&r?e.getSessions(r.caipNetworkId,t):[]},async isSIWXCloseDisabled(){let e=this.getSIWX();if(e){let t=b.state.view==="ApproveTransaction",r=b.state.view==="SIWXSignMessage";if(t||r)return e.getRequired?.()&&(await this.getSessions()).length===0}return!1},async universalProviderAuthenticate({universalProvider:e,chains:t,methods:r}){let o=Ue.getSIWX(),n=new Set(t.map(h=>h.split(":")[0]));if(!o||n.size!==1||!n.has("eip155"))return!1;let s=await o.createMessage({chainId:a.getActiveCaipNetwork()?.caipNetworkId||"",accountAddress:""}),p=await e.authenticate({nonce:s.nonce,domain:s.domain,uri:s.uri,exp:s.expirationTime,iat:s.issuedAt,nbf:s.notBefore,requestId:s.requestId,version:s.version,resources:s.resources,statement:s.statement,chainId:s.chainId,methods:r,chains:[s.chainId,...t.filter(h=>h!==s.chainId)]});if(K.showLoading("Authenticating...",{autoClose:!1}),P.setConnectedWalletInfo({...p.session.peer.metadata,name:p.session.peer.metadata.name,icon:p.session.peer.metadata.icons?.[0],type:"WALLET_CONNECT"},Array.from(n)[0]),p?.auths?.length){let h=p.auths.map(C=>{let $=e.client.formatAuthMessage({request:C.p,iss:C.p.iss});return{data:{...C.p,accountAddress:C.p.iss.split(":").slice(-1).join(""),chainId:C.p.iss.split(":").slice(2,4).join(":"),uri:C.p.aud,version:C.p.version||s.version,expirationTime:C.p.exp,issuedAt:C.p.iat,notBefore:C.p.nbf},message:$,signature:C.s.s,cacao:C}});try{await o.setSessions(h),W.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:Ue.getSIWXEventProperties()})}catch(C){throw console.error("SIWX:universalProviderAuth - failed to set sessions",C),W.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:Ue.getSIWXEventProperties()}),await e.disconnect().catch(console.error),C}finally{K.hide()}}return!0},getSIWXEventProperties(){let e=a.state.activeChain;return{network:a.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:P.state.preferredAccountTypes?.[e]===se.ACCOUNT_TYPES.SMART_ACCOUNT}},async clearSessions(){let e=this.getSIWX();e&&await e.setSessions([])}};c();u();l();var Er={isUnsupportedChainView(){return b.state.view==="UnsupportedChain"||b.state.view==="SwitchNetwork"&&b.state.history.includes("UnsupportedChain")},async safeClose(){if(this.isUnsupportedChainView()){J.shake();return}if(await Ue.isSIWXCloseDisabled()){J.shake();return}J.close()}};c();u();l();c();u();l();var vr={interpolate(e,t,r){if(e.length!==2||t.length!==2)throw new Error("inputRange and outputRange must be an array of length 2");let o=e[0]||0,n=e[1]||0,s=t[0]||0,p=t[1]||0;return r<o?s:r>n?p:(p-s)/(n-o)*(r-o)+s}};c();u();l();var it,xe,De;function Sr(e,t){it=document.createElement("style"),xe=document.createElement("style"),De=document.createElement("style"),it.textContent=ct(e).core.cssText,xe.textContent=ct(e).dark.cssText,De.textContent=ct(e).light.cssText,document.head.appendChild(it),document.head.appendChild(xe),document.head.appendChild(De),_t(t)}function _t(e){xe&&De&&(e==="light"?(xe.removeAttribute("media"),De.media="enabled"):(De.removeAttribute("media"),xe.media="enabled"))}function ct(e){return{core:ve`
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
        --w3m-color-mix-strength: ${ae(e?.["--w3m-color-mix-strength"]?`${e["--w3m-color-mix-strength"]}%`:"0%")};
        --w3m-font-family: ${ae(e?.["--w3m-font-family"]||"Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;")};
        --w3m-font-size-master: ${ae(e?.["--w3m-font-size-master"]||"10px")};
        --w3m-border-radius-master: ${ae(e?.["--w3m-border-radius-master"]||"4px")};
        --w3m-z-index: ${ae(e?.["--w3m-z-index"]||999)};

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
    `,light:ve`
      :root {
        --w3m-color-mix: ${ae(e?.["--w3m-color-mix"]||"#fff")};
        --w3m-accent: ${ae(ie(e,"dark")["--w3m-accent"])};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: ${ae(ie(e,"dark")["--w3m-background"])};
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
    `,dark:ve`
      :root {
        --w3m-color-mix: ${ae(e?.["--w3m-color-mix"]||"#000")};
        --w3m-accent: ${ae(ie(e,"light")["--w3m-accent"])};
        --w3m-default: #000;

        --wui-color-modal-bg-base: ${ae(ie(e,"light")["--w3m-background"])};
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
    `}}var yd=ve`
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
`,Id=ve`
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
`,_d=ve`
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
`;c();u();l();var Ye={getSpacingStyles(e,t){if(Array.isArray(e))return e[t]?`var(--wui-spacing-${e[t]})`:void 0;if(typeof e=="string")return`var(--wui-spacing-${e})`},getFormattedDate(e){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(e)},getHostName(e){try{return new URL(e).hostname}catch{return""}},getTruncateString({string:e,charsStart:t,charsEnd:r,truncate:o}){return e.length<=t+r?e:o==="end"?`${e.substring(0,t)}...`:o==="start"?`...${e.substring(e.length-r)}`:`${e.substring(0,Math.floor(t))}...${e.substring(e.length-Math.floor(r))}`},generateAvatarColors(e){let r=e.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),o=this.hexToRgb(r),n=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),p=100-3*Number(n?.replace("px","")),h=`${p}% ${p}% at 65% 40%`,C=[];for(let $=0;$<5;$+=1){let R=this.tintColor(o,.15*$);C.push(`rgb(${R[0]}, ${R[1]}, ${R[2]})`)}return`
    --local-color-1: ${C[0]};
    --local-color-2: ${C[1]};
    --local-color-3: ${C[2]};
    --local-color-4: ${C[3]};
    --local-color-5: ${C[4]};
    --local-radial-circle: ${h}
   `},hexToRgb(e){let t=parseInt(e,16),r=t>>16&255,o=t>>8&255,n=t&255;return[r,o,n]},tintColor(e,t){let[r,o,n]=e,s=Math.round(r+(255-r)*t),p=Math.round(o+(255-o)*t),h=Math.round(n+(255-n)*t);return[s,p,h]},isNumber(e){return{number:/^[0-9]+$/u}.number.test(e)},getColorTheme(e){return e||(typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark")},splitBalance(e){let t=e.split(".");return t.length===2?[t[0],t[1]]:["0","00"]},roundNumber(e,t,r){return e.toString().length>=t?Number(e).toFixed(r):e},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})}};c();u();l();var Nr=3,Tr=["receive","deposit","borrow","claim"],yr=["withdraw","repay","burn"],lt={getTransactionGroupTitle(e,t){let r=je.getYear(),o=je.getMonthNameByIndex(t);return e===r?o:`${o} ${e}`},getTransactionImages(e){let[t,r]=e,o=!!t&&e?.every(p=>!!p.nft_info),n=e?.length>1;return e?.length===2&&!o?[this.getTransactionImage(t),this.getTransactionImage(r)]:n?e.map(p=>this.getTransactionImage(p)):[this.getTransactionImage(t)]},getTransactionImage(e){return{type:lt.getTransactionTransferTokenType(e),url:lt.getTransactionImageURL(e)}},getTransactionImageURL(e){let t,r=!!e?.nft_info,o=!!e?.fungible_info;return e&&r?t=e?.nft_info?.content?.preview?.url:e&&o&&(t=e?.fungible_info?.icon?.url),t},getTransactionTransferTokenType(e){if(e?.fungible_info)return"FUNGIBLE";if(e?.nft_info)return"NFT"},getTransactionDescriptions(e){let t=e?.metadata?.operationType,r=e?.transfers,o=e?.transfers?.length>0,n=e?.transfers?.length>1,s=o&&r?.every(z=>!!z?.fungible_info),[p,h]=r,C=this.getTransferDescription(p),$=this.getTransferDescription(h);if(!o)return(t==="send"||t==="receive")&&s?(C=Ye.getTruncateString({string:e?.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),$=Ye.getTruncateString({string:e?.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[C,$]):[e.metadata.status];if(n)return r.map(z=>this.getTransferDescription(z));let R="";return Tr.includes(t)?R="+":yr.includes(t)&&(R="-"),C=R.concat(C),[C]},getTransferDescription(e){let t="";return e&&(e?.nft_info?t=e?.nft_info?.name||"-":e?.fungible_info&&(t=this.getFungibleTransferDescription(e)||"-")),t},getFungibleTransferDescription(e){return e?[this.getQuantityFixedValue(e?.quantity.numeric),e?.fungible_info?.symbol].join(" ").trim():null},getQuantityFixedValue(e){return e?parseFloat(e).toFixed(Nr):null}};c();u();l();function Ir(e,t){let{kind:r,elements:o}=t;return{kind:r,elements:o,finisher(n){customElements.get(e)||customElements.define(e,n)}}}function _r(e,t){return customElements.get(e)||customElements.define(e,t),t}function kr(e){return function(r){return typeof r=="function"?_r(e,r):Ir(e,r)}}c();u();l();export{je as a,j as b,F as c,Bt as d,Je as e,Lt as f,Ft as g,ie as h,X as i,S as j,A as k,k as l,ee as m,ot as n,Be as o,W as p,I as q,b as r,Re as s,N as t,Oi as u,Ui as v,xi as w,Di as x,se as y,K as z,ye as A,v as B,L as C,a as D,f as E,P as F,et as G,J as H,at as I,T as J,Cr as K,ze as L,Ar as M,Ue as N,Er as O,vr as P,Sr as Q,yd as R,Id as S,_d as T,Ye as U,lt as V,kr as W};
