import{d as k,e as W,f as me,g as pe,h as O,i as ut,j as Rt,k as xt,l as Ut,m as Pt,n as Re}from"./chunk-ETAVA44A.js";import{Q as dt}from"./chunk-OZZRRPYE.js";import{a as se,b as Ne}from"./chunk-5RP2GFJC.js";import{f as Ge,h as c,i as p,j as l,n as u}from"./chunk-KGCAX4NX.js";c();u();l();var _e=Ge(Rt(),1),pt=Ge(xt(),1),mt=Ge(Ut(),1),ft=Ge(Pt(),1);_e.default.extend(mt.default);_e.default.extend(ft.default);var Ot={...pt.default,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}},Dt=["January","February","March","April","May","June","July","August","September","October","November","December"];_e.default.locale("en-web3-modal",Ot);var $e={getMonthNameByIndex(e){return Dt[e]},getYear(e=new Date().toISOString()){return(0,_e.default)(e).year()},getRelativeDateFromNow(e){return(0,_e.default)(e).locale("en-web3-modal").fromNow(!0)},formatDate(e,t="DD MMM"){return(0,_e.default)(e).format(t)}};c();u();l();var F={WC_NAME_SUFFIX:".reown.id",WC_NAME_SUFFIX_LEGACY:".wcn.id",BLOCKCHAIN_API_RPC_URL:"https://rpc.walletconnect.org",PULSE_API_URL:"https://pulse.walletconnect.org",W3M_API_URL:"https://api.web3modal.org",CONNECTOR_ID:{WALLET_CONNECT:"walletConnect",INJECTED:"injected",WALLET_STANDARD:"announced",COINBASE:"coinbaseWallet",COINBASE_SDK:"coinbaseWalletSDK",SAFE:"safe",LEDGER:"ledger",OKX:"okx",EIP6963:"eip6963",AUTH:"ID_AUTH"},CONNECTOR_NAMES:{AUTH:"Auth"},AUTH_CONNECTOR_SUPPORTED_CHAINS:["eip155","solana"],LIMITS:{PENDING_TRANSACTIONS:99},CHAIN:{EVM:"eip155",SOLANA:"solana",POLKADOT:"polkadot",BITCOIN:"bip122"},CHAIN_NAME_MAP:{eip155:"EVM Networks",solana:"Solana",polkadot:"Polkadot",bip122:"Bitcoin",cosmos:"Cosmos"},ADAPTER_TYPES:{BITCOIN:"bitcoin",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5"},USDT_CONTRACT_ADDRESSES:["0xdac17f958d2ee523a2206206994597c13d831ec7","0xc2132d05d31c914a87c6611c10748aeb04b58e8f","0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7","0x919C1c267BC06a7039e03fcc2eF738525769109c","0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e","0x55d398326f99059fF775485246999027B3197955","0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"],HTTP_STATUS_CODES:{SERVICE_UNAVAILABLE:503,FORBIDDEN:403},UNSUPPORTED_NETWORK_NAME:"Unknown Network",SECURE_SITE_SDK_ORIGIN:(typeof p<"u"&&typeof p.env<"u"?p.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org"};c();u();l();var Qe={caipNetworkIdToNumber(e){return e?Number(e.split(":")[1]):void 0},parseEvmChainId(e){return typeof e=="string"?this.caipNetworkIdToNumber(e):e},getNetworksByNamespace(e,t){return e?.filter(r=>r.chainNamespace===t)||[]},getFirstNetworkByNamespace(e,t){return this.getNetworksByNamespace(e,t)[0]},getNetworkNameByCaipNetworkId(e,t){if(!t)return;let r=e.find(n=>n.caipNetworkId===t);if(r)return r.name;let[o]=t.split(":");return F.CHAIN_NAME_MAP?.[o]||void 0}};c();u();l();var H={bigNumber(e){return e?new Re(e):new Re(0)},multiply(e,t){if(e===void 0||t===void 0)return new Re(0);let r=new Re(e),o=new Re(t);return r.times(o)},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})},parseLocalStringToNumber(e){return e===void 0?0:parseFloat(e.replace(/,/gu,""))}};c();u();l();var Mt={URLS:{FAQ:"https://walletconnect.com/faq"}};c();u();l();function ie(e,t){return t==="light"?{"--w3m-accent":e?.["--w3m-accent"]||"hsla(231, 100%, 70%, 1)","--w3m-background":"#fff"}:{"--w3m-accent":e?.["--w3m-accent"]||"hsla(230, 100%, 67%, 1)","--w3m-background":"#121313"}}c();u();l();c();u();l();var Bt={numericInputKeyDown(e,t,r){let o=["Backspace","Meta","Ctrl","a","A","c","C","x","X","v","V","ArrowLeft","ArrowRight","Tab"],n=e.metaKey||e.ctrlKey,a=e.key,d=a.toLocaleLowerCase(),f=d==="a",h=d==="c",$=d==="v",U=d==="x",J=a===",",Se=a===".",Ve=a>="0"&&a<="9";!n&&(f||h||$||U)&&e.preventDefault(),t==="0"&&!J&&!Se&&a==="0"&&e.preventDefault(),t==="0"&&Ve&&(r(a),e.preventDefault()),(J||Se)&&(t||(r("0."),e.preventDefault()),(t?.includes(".")||t?.includes(","))&&e.preventDefault()),!Ve&&!o.includes(a)&&!Se&&!J&&e.preventDefault()}};c();u();l();c();u();l();var gt=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];c();u();l();var wt=[{type:"function",name:"approve",stateMutability:"nonpayable",inputs:[{name:"spender",type:"address"},{name:"amount",type:"uint256"}],outputs:[{type:"bool"}]}];c();u();l();var Ct=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"sender",type:"address"},{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];var Ze={getERC20Abi:e=>F.USDT_CONTRACT_ADDRESSES.includes(e)?Ct:gt,getSwapAbi:()=>wt};c();u();l();var Lt={validateCaipAddress(e){if(e.split(":")?.length!==3)throw new Error("Invalid CAIP Address");return e},parseCaipAddress(e){let t=e.split(":");if(t.length!==3)throw new Error(`Invalid CAIP-10 address: ${e}`);let[r,o,n]=t;if(!r||!o||!n)throw new Error(`Invalid CAIP-10 address: ${e}`);return{chainNamespace:r,chainId:o,address:n}},parseCaipNetworkId(e){let t=e.split(":");if(t.length!==2)throw new Error(`Invalid CAIP-2 network id: ${e}`);let[r,o]=t;if(!r||!o)throw new Error(`Invalid CAIP-2 network id: ${e}`);return{chainNamespace:r,chainId:o}}};c();u();l();var R={WALLET_ID:"@appkit/wallet_id",WALLET_NAME:"@appkit/wallet_name",SOLANA_WALLET:"@appkit/solana_wallet",SOLANA_CAIP_CHAIN:"@appkit/solana_caip_chain",ACTIVE_CAIP_NETWORK_ID:"@appkit/active_caip_network_id",CONNECTED_SOCIAL:"@appkit/connected_social",CONNECTED_SOCIAL_USERNAME:"@appkit-wallet/SOCIAL_USERNAME",RECENT_WALLETS:"@appkit/recent_wallets",DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",ACTIVE_NAMESPACE:"@appkit/active_namespace",CONNECTED_NAMESPACES:"@appkit/connected_namespaces",CONNECTION_STATUS:"@appkit/connection_status",SIWX_AUTH_TOKEN:"@appkit/siwx-auth-token",SIWX_NONCE_TOKEN:"@appkit/siwx-nonce-token",TELEGRAM_SOCIAL_PROVIDER:"@appkit/social_provider",NATIVE_BALANCE_CACHE:"@appkit/native_balance_cache",PORTFOLIO_CACHE:"@appkit/portfolio_cache",ENS_CACHE:"@appkit/ens_cache",IDENTITY_CACHE:"@appkit/identity_cache",PREFERRED_ACCOUNT_TYPES:"@appkit/preferred_account_types",CONNECTIONS:"@appkit/connections"};function Me(e){if(!e)throw new Error("Namespace is required for CONNECTED_CONNECTOR_ID");return`@appkit/${e}:connected_connector_id`}var y={setItem(e,t){ke()&&t!==void 0&&localStorage.setItem(e,t)},getItem(e){if(ke())return localStorage.getItem(e)||void 0},removeItem(e){ke()&&localStorage.removeItem(e)},clear(){ke()&&localStorage.clear()}};function ke(){return typeof window<"u"&&typeof localStorage<"u"}c();u();l();var et=(typeof p<"u"&&typeof p.env<"u"?p.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org",tt=[{label:"Coinbase",name:"coinbase",feeRange:"1-2%",url:"",supportedChains:["eip155"]},{label:"Meld.io",name:"meld",feeRange:"1-2%",url:"https://meldcrypto.com",supportedChains:["eip155","solana"]}],ht="WXETMuFUQmqqybHuRkSgxv:25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU",X={FOUR_MINUTES_MS:24e4,TEN_SEC_MS:1e4,FIVE_SEC_MS:5e3,THREE_SEC_MS:3e3,ONE_SEC_MS:1e3,SECURE_SITE:et,SECURE_SITE_DASHBOARD:`${et}/dashboard`,SECURE_SITE_FAVICON:`${et}/images/favicon.png`,RESTRICTED_TIMEZONES:["ASIA/SHANGHAI","ASIA/URUMQI","ASIA/CHONGQING","ASIA/HARBIN","ASIA/KASHGAR","ASIA/MACAU","ASIA/HONG_KONG","ASIA/MACAO","ASIA/BEIJING","ASIA/HARBIN"],WC_COINBASE_PAY_SDK_CHAINS:["ethereum","arbitrum","polygon","berachain","avalanche-c-chain","optimism","celo","base"],WC_COINBASE_PAY_SDK_FALLBACK_CHAIN:"ethereum",WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP:{Ethereum:"ethereum","Arbitrum One":"arbitrum",Polygon:"polygon",Berachain:"berachain",Avalanche:"avalanche-c-chain","OP Mainnet":"optimism",Celo:"celo",Base:"base"},WC_COINBASE_ONRAMP_APP_ID:"bf18c88d-495a-463b-b249-0b9d3656cf5e",SWAP_SUGGESTED_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP"],SWAP_POPULAR_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP","METAL","DAI","CHAMP","WOLF","SALE","BAL","BUSD","MUST","BTCpx","ROUTE","HEX","WELT","amDAI","VSQ","VISION","AURUM","pSP","SNX","VC","LINK","CHP","amUSDT","SPHERE","FOX","GIDDY","GFC","OMEN","OX_OLD","DE","WNT"],BALANCE_SUPPORTED_CHAINS:["eip155","solana"],SWAP_SUPPORTED_NETWORKS:["eip155:1","eip155:42161","eip155:10","eip155:324","eip155:8453","eip155:56","eip155:137","eip155:100","eip155:43114","eip155:250","eip155:8217","eip155:1313161554"],NAMES_SUPPORTED_CHAIN_NAMESPACES:["eip155"],ONRAMP_SUPPORTED_CHAIN_NAMESPACES:["eip155","solana"],ACTIVITY_ENABLED_CHAIN_NAMESPACES:["eip155"],NATIVE_TOKEN_ADDRESS:{eip155:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",solana:"So11111111111111111111111111111111111111111",polkadot:"0x",bip122:"0x",cosmos:"0x"},CONVERT_SLIPPAGE_TOLERANCE:1,CONNECT_LABELS:{MOBILE:"Open and continue in the wallet app",WEB:"Open and continue in the wallet app"},SEND_SUPPORTED_NAMESPACES:["eip155","solana"],DEFAULT_REMOTE_FEATURES:{swaps:["1inch"],onramp:["coinbase","meld"],email:!0,socials:["google","x","discord","farcaster","github","apple","facebook"],activity:!0,reownBranding:!0},DEFAULT_REMOTE_FEATURES_DISABLED:{email:!1,socials:!1,swaps:!1,onramp:!1,activity:!1,reownBranding:!1},DEFAULT_FEATURES:{receive:!0,send:!0,emailShowWallets:!0,connectorTypeOrder:["walletConnect","recent","injected","featured","custom","external","recommended"],analytics:!0,allWallets:!0,legalCheckbox:!1,smartSessions:!1,collapseWallets:!1,walletFeaturesOrder:["onramp","swaps","receive","send"],connectMethodsOrder:void 0,pay:!1},DEFAULT_SOCIALS:["google","x","farcaster","discord","apple","github","facebook"],DEFAULT_ACCOUNT_TYPES:{bip122:"payment",eip155:"smartAccount",polkadot:"eoa",solana:"eoa"},ADAPTER_TYPES:{UNIVERSAL:"universal",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5",BITCOIN:"bitcoin"}};c();u();l();var E={cacheExpiry:{portfolio:3e4,nativeBalance:3e4,ens:3e5,identity:3e5},isCacheExpired(e,t){return Date.now()-e>t},getActiveNetworkProps(){let e=E.getActiveNamespace(),t=E.getActiveCaipNetworkId(),r=t?t.split(":")[1]:void 0,o=r?isNaN(Number(r))?r:Number(r):void 0;return{namespace:e,caipNetworkId:t,chainId:o}},setWalletConnectDeepLink({name:e,href:t}){try{y.setItem(R.DEEPLINK_CHOICE,JSON.stringify({href:t,name:e}))}catch{console.info("Unable to set WalletConnect deep link")}},getWalletConnectDeepLink(){try{let e=y.getItem(R.DEEPLINK_CHOICE);if(e)return JSON.parse(e)}catch{console.info("Unable to get WalletConnect deep link")}},deleteWalletConnectDeepLink(){try{y.removeItem(R.DEEPLINK_CHOICE)}catch{console.info("Unable to delete WalletConnect deep link")}},setActiveNamespace(e){try{y.setItem(R.ACTIVE_NAMESPACE,e)}catch{console.info("Unable to set active namespace")}},setActiveCaipNetworkId(e){try{y.setItem(R.ACTIVE_CAIP_NETWORK_ID,e),E.setActiveNamespace(e.split(":")[0])}catch{console.info("Unable to set active caip network id")}},getActiveCaipNetworkId(){try{return y.getItem(R.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to get active caip network id");return}},deleteActiveCaipNetworkId(){try{y.removeItem(R.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to delete active caip network id")}},deleteConnectedConnectorId(e){try{let t=Me(e);y.removeItem(t)}catch{console.info("Unable to delete connected connector id")}},setAppKitRecent(e){try{let t=E.getRecentWallets();t.find(o=>o.id===e.id)||(t.unshift(e),t.length>2&&t.pop(),y.setItem(R.RECENT_WALLETS,JSON.stringify(t)))}catch{console.info("Unable to set AppKit recent")}},getRecentWallets(){try{let e=y.getItem(R.RECENT_WALLETS);return e?JSON.parse(e):[]}catch{console.info("Unable to get AppKit recent")}return[]},setConnectedConnectorId(e,t){try{let r=Me(e);y.setItem(r,t)}catch{console.info("Unable to set Connected Connector Id")}},getActiveNamespace(){try{return y.getItem(R.ACTIVE_NAMESPACE)}catch{console.info("Unable to get active namespace")}},getConnectedConnectorId(e){if(e)try{let t=Me(e);return y.getItem(t)}catch{console.info("Unable to get connected connector id in namespace ",e)}},setConnectedSocialProvider(e){try{y.setItem(R.CONNECTED_SOCIAL,e)}catch{console.info("Unable to set connected social provider")}},getConnectedSocialProvider(){try{return y.getItem(R.CONNECTED_SOCIAL)}catch{console.info("Unable to get connected social provider")}},deleteConnectedSocialProvider(){try{y.removeItem(R.CONNECTED_SOCIAL)}catch{console.info("Unable to delete connected social provider")}},getConnectedSocialUsername(){try{return y.getItem(R.CONNECTED_SOCIAL_USERNAME)}catch{console.info("Unable to get connected social username")}},getStoredActiveCaipNetworkId(){return y.getItem(R.ACTIVE_CAIP_NETWORK_ID)?.split(":")?.[1]},setConnectionStatus(e){try{y.setItem(R.CONNECTION_STATUS,e)}catch{console.info("Unable to set connection status")}},getConnectionStatus(){try{return y.getItem(R.CONNECTION_STATUS)}catch{return}},getConnectedNamespaces(){try{let e=y.getItem(R.CONNECTED_NAMESPACES);return e?.length?e.split(","):[]}catch{return[]}},setConnectedNamespaces(e){try{let t=Array.from(new Set(e));y.setItem(R.CONNECTED_NAMESPACES,t.join(","))}catch{console.info("Unable to set namespaces in storage")}},addConnectedNamespace(e){try{let t=E.getConnectedNamespaces();t.includes(e)||(t.push(e),E.setConnectedNamespaces(t))}catch{console.info("Unable to add connected namespace")}},removeConnectedNamespace(e){try{let t=E.getConnectedNamespaces(),r=t.indexOf(e);r>-1&&(t.splice(r,1),E.setConnectedNamespaces(t))}catch{console.info("Unable to remove connected namespace")}},getTelegramSocialProvider(){try{return y.getItem(R.TELEGRAM_SOCIAL_PROVIDER)}catch{return console.info("Unable to get telegram social provider"),null}},setTelegramSocialProvider(e){try{y.setItem(R.TELEGRAM_SOCIAL_PROVIDER,e)}catch{console.info("Unable to set telegram social provider")}},removeTelegramSocialProvider(){try{y.removeItem(R.TELEGRAM_SOCIAL_PROVIDER)}catch{console.info("Unable to remove telegram social provider")}},getBalanceCache(){let e={};try{let t=y.getItem(R.PORTFOLIO_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromBalanceCache(e){try{let t=E.getBalanceCache();y.setItem(R.PORTFOLIO_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getBalanceCacheForCaipAddress(e){try{let r=E.getBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.portfolio))return r.balance;E.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateBalanceCache(e){try{let t=E.getBalanceCache();t[e.caipAddress]=e,y.setItem(R.PORTFOLIO_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getNativeBalanceCache(){let e={};try{let t=y.getItem(R.NATIVE_BALANCE_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromNativeBalanceCache(e){try{let t=E.getBalanceCache();y.setItem(R.NATIVE_BALANCE_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getNativeBalanceCacheForCaipAddress(e){try{let r=E.getNativeBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.nativeBalance))return r;console.info("Discarding cache for address",e),E.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateNativeBalanceCache(e){try{let t=E.getNativeBalanceCache();t[e.caipAddress]=e,y.setItem(R.NATIVE_BALANCE_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getEnsCache(){let e={};try{let t=y.getItem(R.ENS_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get ens name cache")}return e},getEnsFromCacheForAddress(e){try{let r=E.getEnsCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.ens))return r.ens;E.removeEnsFromCache(e)}catch{console.info("Unable to get ens name from cache",e)}},updateEnsCache(e){try{let t=E.getEnsCache();t[e.address]=e,y.setItem(R.ENS_CACHE,JSON.stringify(t))}catch{console.info("Unable to update ens name cache",e)}},removeEnsFromCache(e){try{let t=E.getEnsCache();y.setItem(R.ENS_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove ens name from cache",e)}},getIdentityCache(){let e={};try{let t=y.getItem(R.IDENTITY_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get identity cache")}return e},getIdentityFromCacheForAddress(e){try{let r=E.getIdentityCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.identity))return r.identity;E.removeIdentityFromCache(e)}catch{console.info("Unable to get identity from cache",e)}},updateIdentityCache(e){try{let t=E.getIdentityCache();t[e.address]={identity:e.identity,timestamp:e.timestamp},y.setItem(R.IDENTITY_CACHE,JSON.stringify(t))}catch{console.info("Unable to update identity cache",e)}},removeIdentityFromCache(e){try{let t=E.getIdentityCache();y.setItem(R.IDENTITY_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove identity from cache",e)}},clearAddressCache(){try{y.removeItem(R.PORTFOLIO_CACHE),y.removeItem(R.NATIVE_BALANCE_CACHE),y.removeItem(R.ENS_CACHE),y.removeItem(R.IDENTITY_CACHE)}catch{console.info("Unable to clear address cache")}},setPreferredAccountTypes(e){try{y.setItem(R.PREFERRED_ACCOUNT_TYPES,JSON.stringify(e))}catch{console.info("Unable to set preferred account types",e)}},getPreferredAccountTypes(){try{let e=y.getItem(R.PREFERRED_ACCOUNT_TYPES);return e?JSON.parse(e):{}}catch{console.info("Unable to get preferred account types")}return{}},setConnections(e,t){try{let r={...E.getConnections(),[t]:e};y.setItem(R.CONNECTIONS,JSON.stringify(r))}catch(r){console.error("Unable to sync connections to storage",r)}},getConnections(){try{let e=y.getItem(R.CONNECTIONS);return e?JSON.parse(e):{}}catch(e){return console.error("Unable to get connections from storage",e),{}}}};c();u();l();var N={isMobile(){return this.isClient()?!!(window?.matchMedia("(pointer:coarse)")?.matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)):!1},checkCaipNetwork(e,t=""){return e?.caipNetworkId.toLocaleLowerCase().includes(t.toLowerCase())},isAndroid(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return N.isMobile()&&e.includes("android")},isIos(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return e.includes("iphone")||e.includes("ipad")},isSafari(){return this.isClient()?(window?.navigator.userAgent.toLowerCase()).includes("safari"):!1},isClient(){return typeof window<"u"},isPairingExpired(e){return e?e-Date.now()<=X.TEN_SEC_MS:!0},isAllowedRetry(e,t=X.ONE_SEC_MS){return Date.now()-e>=t},copyToClopboard(e){navigator.clipboard.writeText(e)},isIframe(){try{return window?.self!==window?.top}catch{return!1}},getPairingExpiry(){return Date.now()+X.FOUR_MINUTES_MS},getNetworkId(e){return e?.split(":")[1]},getPlainAddress(e){return e?.split(":")[2]},async wait(e){return new Promise(t=>{setTimeout(t,e)})},debounce(e,t=500){let r;return(...o)=>{function n(){e(...o)}r&&clearTimeout(r),r=setTimeout(n,t)}},isHttpUrl(e){return e.startsWith("http://")||e.startsWith("https://")},formatNativeUrl(e,t,r=null){if(N.isHttpUrl(e))return this.formatUniversalUrl(e,t);let o=e,n=r;o.includes("://")||(o=e.replaceAll("/","").replaceAll(":",""),o=`${o}://`),o.endsWith("/")||(o=`${o}/`),n&&!n?.endsWith("/")&&(n=`${n}/`),this.isTelegram()&&this.isAndroid()&&(t=encodeURIComponent(t));let a=encodeURIComponent(t);return{redirect:`${o}wc?uri=${a}`,redirectUniversalLink:n?`${n}wc?uri=${a}`:void 0,href:o}},formatUniversalUrl(e,t){if(!N.isHttpUrl(e))return this.formatNativeUrl(e,t);let r=e;r.endsWith("/")||(r=`${r}/`);let o=encodeURIComponent(t);return{redirect:`${r}wc?uri=${o}`,href:r}},getOpenTargetForPlatform(e){return e==="popupWindow"?e:this.isTelegram()?E.getTelegramSocialProvider()?"_top":"_blank":e},openHref(e,t,r){window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},returnOpenHref(e,t,r){return window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},isTelegram(){return typeof window<"u"&&(!!window.TelegramWebviewProxy||!!window.Telegram||!!window.TelegramWebviewProxyProto)},isPWA(){if(typeof window>"u")return!1;let e=window.matchMedia?.("(display-mode: standalone)")?.matches,t=window?.navigator?.standalone;return!!(e||t)},async preloadImage(e){let t=new Promise((r,o)=>{let n=new Image;n.onload=r,n.onerror=o,n.crossOrigin="anonymous",n.src=e});return Promise.race([t,N.wait(2e3)])},formatBalance(e,t){let r="0.000";if(typeof e=="string"){let o=Number(e);if(o){let n=Math.floor(o*1e3)/1e3;n&&(r=n.toString())}}return`${r}${t?` ${t}`:""}`},formatBalance2(e,t){let r;if(e==="0")r="0";else if(typeof e=="string"){let o=Number(e);o&&(r=o.toString().match(/^-?\d+(?:\.\d{0,3})?/u)?.[0])}return{value:r??"0",rest:r==="0"?"000":"",symbol:t}},getApiUrl(){return F.W3M_API_URL},getBlockchainApiUrl(){return F.BLOCKCHAIN_API_RPC_URL},getAnalyticsUrl(){return F.PULSE_API_URL},getUUID(){return crypto?.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu,e=>{let t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})},parseError(e){return typeof e=="string"?e:typeof e?.issues?.[0]?.message=="string"?e.issues[0].message:e instanceof Error?e.message:"Unknown error"},sortRequestedNetworks(e,t=[]){let r={};return t&&e&&(e.forEach((o,n)=>{r[o]=n}),t.sort((o,n)=>{let a=r[o.id],d=r[n.id];return a!==void 0&&d!==void 0?a-d:a!==void 0?-1:d!==void 0?1:0})),t},calculateBalance(e){let t=0;for(let r of e)t+=r.value??0;return t},formatTokenBalance(e){let t=e.toFixed(2),[r,o]=t.split(".");return{dollars:r,pennies:o}},isAddress(e,t="eip155"){switch(t){case"eip155":if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)){if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)||/^(?:0x)?[0-9A-F]{40}$/iu.test(e))return!0}else return!1;return!1;case"solana":return/[1-9A-HJ-NP-Za-km-z]{32,44}$/iu.test(e);default:return!1}},uniqueBy(e,t){let r=new Set;return e.filter(o=>{let n=o[t];return r.has(n)?!1:(r.add(n),!0)})},generateSdkVersion(e,t,r){let n=e.length===0?X.ADAPTER_TYPES.UNIVERSAL:e.map(a=>a.adapterType).join(",");return`${t}-${n}-${r}`},createAccount(e,t,r,o,n){return{namespace:e,address:t,type:r,publicKey:o,path:n}},isCaipAddress(e){if(typeof e!="string")return!1;let t=e.split(":"),r=t[0];return t.filter(Boolean).length===3&&r in F.CHAIN_NAME_MAP},isMac(){let e=window?.navigator.userAgent.toLowerCase();return e.includes("macintosh")&&!e.includes("safari")},formatTelegramSocialLoginUrl(e){let t=`--${encodeURIComponent(window?.location.href)}`,r="state=";if(new URL(e).host==="auth.magic.link"){let n="provider_authorization_url=",a=e.substring(e.indexOf(n)+n.length),d=this.injectIntoUrl(decodeURIComponent(a),r,t);return e.replace(a,encodeURIComponent(d))}return this.injectIntoUrl(e,r,t)},injectIntoUrl(e,t,r){let o=e.indexOf(t);if(o===-1)throw new Error(`${t} parameter not found in the URL: ${e}`);let n=e.indexOf("&",o),a=t.length,d=n!==-1?n:e.length,f=e.substring(0,o+a),h=e.substring(o+a,d),$=e.substring(n),U=h+r;return f+U+$}};c();u();l();c();u();l();var At={getFeatureValue(e,t){let r=t?.[e];return r===void 0?X.DEFAULT_FEATURES[e]:r},filterSocialsByPlatform(e){if(!e||!e.length)return e;if(N.isTelegram()){if(N.isIos())return e.filter(t=>t!=="google");if(N.isMac())return e.filter(t=>t!=="x");if(N.isAndroid())return e.filter(t=>!["facebook","x"].includes(t))}return e}};var b=k({features:X.DEFAULT_FEATURES,projectId:"",sdkType:"appkit",sdkVersion:"html-wagmi-undefined",defaultAccountTypes:X.DEFAULT_ACCOUNT_TYPES,enableNetworkSwitch:!0,experimental_preferUniversalLinks:!1,remoteFeatures:{}}),v={state:b,subscribeKey(e,t){return O(b,e,t)},setOptions(e){Object.assign(b,e)},setRemoteFeatures(e){if(!e)return;let t={...b.remoteFeatures,...e};b.remoteFeatures=t,b.remoteFeatures?.socials&&(b.remoteFeatures.socials=At.filterSocialsByPlatform(b.remoteFeatures.socials))},setFeatures(e){if(!e)return;b.features||(b.features=X.DEFAULT_FEATURES);let t={...b.features,...e};b.features=t},setProjectId(e){b.projectId=e},setCustomRpcUrls(e){b.customRpcUrls=e},setAllWallets(e){b.allWallets=e},setIncludeWalletIds(e){b.includeWalletIds=e},setExcludeWalletIds(e){b.excludeWalletIds=e},setFeaturedWalletIds(e){b.featuredWalletIds=e},setTokens(e){b.tokens=e},setTermsConditionsUrl(e){b.termsConditionsUrl=e},setPrivacyPolicyUrl(e){b.privacyPolicyUrl=e},setCustomWallets(e){b.customWallets=e},setIsSiweEnabled(e){b.isSiweEnabled=e},setIsUniversalProvider(e){b.isUniversalProvider=e},setSdkVersion(e){b.sdkVersion=e},setMetadata(e){b.metadata=e},setDisableAppend(e){b.disableAppend=e},setEIP6963Enabled(e){b.enableEIP6963=e},setDebug(e){b.debug=e},setEnableWalletConnect(e){b.enableWalletConnect=e},setEnableWalletGuide(e){b.enableWalletGuide=e},setEnableAuthLogger(e){b.enableAuthLogger=e},setEnableWallets(e){b.enableWallets=e},setPreferUniversalLinks(e){b.experimental_preferUniversalLinks=e},setHasMultipleAddresses(e){b.hasMultipleAddresses=e},setSIWX(e){b.siwx=e},setConnectMethodsOrder(e){b.features={...b.features,connectMethodsOrder:e}},setWalletFeaturesOrder(e){b.features={...b.features,walletFeaturesOrder:e}},setSocialsOrder(e){b.remoteFeatures={...b.remoteFeatures,socials:e}},setCollapseWallets(e){b.features={...b.features,collapseWallets:e}},setEnableEmbedded(e){b.enableEmbedded=e},setAllowUnsupportedChain(e){b.allowUnsupportedChain=e},setManualWCControl(e){b.manualWCControl=e},setEnableNetworkSwitch(e){b.enableNetworkSwitch=e},setDefaultAccountTypes(e={}){Object.entries(e).forEach(([t,r])=>{r&&(b.defaultAccountTypes[t]=r)})},setUniversalProviderConfigOverride(e){b.universalProviderConfigOverride=e},getUniversalProviderConfigOverride(){return b.universalProviderConfigOverride},getSnapshot(){return me(b)}};c();u();l();c();u();l();c();u();l();c();u();l();async function Be(...e){let t=await fetch(...e);if(!t.ok)throw new Error(`HTTP status code: ${t.status}`,{cause:t});return t}var ue=class{constructor({baseUrl:t,clientId:r}){this.baseUrl=t,this.clientId=r}async get({headers:t,signal:r,cache:o,...n}){let a=this.createUrl(n);return(await Be(a,{method:"GET",headers:t,signal:r,cache:o})).json()}async getBlob({headers:t,signal:r,...o}){let n=this.createUrl(o);return(await Be(n,{method:"GET",headers:t,signal:r})).blob()}async post({body:t,headers:r,signal:o,...n}){let a=this.createUrl(n);return(await Be(a,{method:"POST",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async put({body:t,headers:r,signal:o,...n}){let a=this.createUrl(n);return(await Be(a,{method:"PUT",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async delete({body:t,headers:r,signal:o,...n}){let a=this.createUrl(n);return(await Be(a,{method:"DELETE",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}createUrl({path:t,params:r}){let o=new URL(t,this.baseUrl);return r&&Object.entries(r).forEach(([n,a])=>{a&&o.searchParams.append(n,a)}),this.clientId&&o.searchParams.append("clientId",this.clientId),o}};var Ft=Object.freeze({enabled:!0,events:[]}),Wt=new ue({baseUrl:N.getAnalyticsUrl(),clientId:null}),Ht=5,Kt=60*1e3,he=k({...Ft}),Et={state:he,subscribeKey(e,t){return O(he,e,t)},async sendError(e,t){if(!he.enabled)return;let r=Date.now();if(he.events.filter(a=>{let d=new Date(a.properties.timestamp||"").getTime();return r-d<Kt}).length>=Ht)return;let n={type:"error",event:t,properties:{errorType:e.name,errorMessage:e.message,stackTrace:e.stack,timestamp:new Date().toISOString()}};he.events.push(n);try{if(typeof window>"u")return;let{projectId:a,sdkType:d,sdkVersion:f}=v.state;await Wt.post({path:"/e",params:{projectId:a,st:d,sv:f||"html-wagmi-4.2.2"},body:{eventId:N.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:new Date().toISOString(),props:{type:"error",event:t,errorType:e.name,errorMessage:e.message,stackTrace:e.stack}}})}catch(a){console.error("Error sending telemetry event:",a)}},enable(){he.enabled=!0},disable(){he.enabled=!1},clearEvents(){he.events=[]}};var xe=class e extends Error{constructor(t,r,o){super(t),this.name="AppKitError",this.category=r,this.originalError=o,Error.captureStackTrace&&Error.captureStackTrace(this,e)}};function bt(e,t){let r=e instanceof xe?e:new xe(e instanceof Error?e.message:String(e),t,e);throw Et.sendError(r,r.category),r}function K(e,t="INTERNAL_SDK_ERROR"){let r={};return Object.keys(e).forEach(o=>{let n=e[o];if(typeof n=="function"){let a=n;n.constructor.name==="AsyncFunction"?a=async(...d)=>{try{return await n(...d)}catch(f){return bt(f,t)}}:a=(...d)=>{try{return n(...d)}catch(f){return bt(f,t)}},r[o]=a}else r[o]=n}),r}var ne=k({walletImages:{},networkImages:{},chainImages:{},connectorImages:{},tokenImages:{},currencyImages:{}}),Vt={state:ne,subscribeNetworkImages(e){return W(ne.networkImages,()=>e(ne.networkImages))},subscribeKey(e,t){return O(ne,e,t)},subscribe(e){return W(ne,()=>e(ne))},setWalletImage(e,t){ne.walletImages[e]=t},setNetworkImage(e,t){ne.networkImages[e]=t},setChainImage(e,t){ne.chainImages[e]=t},setConnectorImage(e,t){ne.connectorImages={...ne.connectorImages,[e]:t}},setTokenImage(e,t){ne.tokenImages[e]=t},setCurrencyImage(e,t){ne.currencyImages[e]=t}},ee=K(Vt);c();u();l();c();u();l();c();u();l();c();u();l();c();u();l();c();u();l();c();u();l();var Tt={handleMobileDeeplinkRedirect(e){let t=window.location.href,r=encodeURIComponent(t);if(e==="Phantom"&&!("phantom"in window)){let o=t.startsWith("https")?"https":"http",n=t.split("/")[2],a=encodeURIComponent(`${o}://${n}`);window.location.href=`https://phantom.app/ul/browse/${r}?ref=${a}`}s.state.activeChain===F.CHAIN.SOLANA&&e==="Coinbase Wallet"&&!("coinbaseSolana"in window)&&(window.location.href=`https://go.cb-w.com/dapp?cb_url=${r}`)}};c();u();l();c();u();l();c();u();l();c();u();l();var Ie=Object.freeze({message:"",variant:"success",svg:void 0,open:!1,autoClose:!0}),Q=k({...Ie}),Gt={state:Q,subscribeKey(e,t){return O(Q,e,t)},showLoading(e,t={}){this._showMessage({message:e,variant:"loading",...t})},showSuccess(e){this._showMessage({message:e,variant:"success"})},showSvg(e,t){this._showMessage({message:e,svg:t})},showError(e){let t=N.parseError(e);this._showMessage({message:t,variant:"error"})},hide(){Q.message=Ie.message,Q.variant=Ie.variant,Q.svg=Ie.svg,Q.open=Ie.open,Q.autoClose=Ie.autoClose},_showMessage({message:e,svg:t,variant:r="success",autoClose:o=Ie.autoClose}){Q.open?(Q.open=!1,setTimeout(()=>{Q.message=e,Q.variant=r,Q.svg=t,Q.open=!0,Q.autoClose=o},150)):(Q.message=e,Q.variant=r,Q.svg=t,Q.open=!0,Q.autoClose=o)}},G=Gt;var $t={purchaseCurrencies:[{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"Ether",symbol:"ETH",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]}],paymentCurrencies:[{id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},{id:"EUR",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]}]},St=N.getBlockchainApiUrl(),te=k({clientId:null,api:new ue({baseUrl:St,clientId:null}),supportedChains:{http:[],ws:[]}}),g={state:te,async get(e){let{st:t,sv:r}=g.getSdkProperties(),o=v.state.projectId,n={...e.params||{},st:t,sv:r,projectId:o};return te.api.get({...e,params:n})},getSdkProperties(){let{sdkType:e,sdkVersion:t}=v.state;return{st:e||"unknown",sv:t||"unknown"}},async isNetworkSupported(e){if(!e)return!1;try{te.supportedChains.http.length||await g.getSupportedNetworks()}catch{return!1}return te.supportedChains.http.includes(e)},async getSupportedNetworks(){try{let e=await g.get({path:"v1/supported-chains"});return te.supportedChains=e,e}catch{return te.supportedChains}},async fetchIdentity({address:e,caipNetworkId:t}){if(!await g.isNetworkSupported(t))return{avatar:"",name:""};let o=E.getIdentityFromCacheForAddress(e);if(o)return o;let n=await g.get({path:`/v1/identity/${e}`,params:{sender:s.state.activeCaipAddress?N.getPlainAddress(s.state.activeCaipAddress):void 0}});return E.updateIdentityCache({address:e,identity:n,timestamp:Date.now()}),n},async fetchTransactions({account:e,cursor:t,onramp:r,signal:o,cache:n,chainId:a}){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?g.get({path:`/v1/account/${e}/history`,params:{cursor:t,onramp:r,chainId:a},signal:o,cache:n}):{data:[],next:void 0}},async fetchSwapQuote({amount:e,userAddress:t,from:r,to:o,gasPrice:n}){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?g.get({path:"/v1/convert/quotes",headers:{"Content-Type":"application/json"},params:{amount:e,userAddress:t,from:r,to:o,gasPrice:n}}):{quotes:[]}},async fetchSwapTokens({chainId:e}){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?g.get({path:"/v1/convert/tokens",params:{chainId:e}}):{tokens:[]}},async fetchTokenPrice({addresses:e}){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?te.api.post({path:"/v1/fungible/price",body:{currency:"usd",addresses:e,projectId:v.state.projectId},headers:{"Content-Type":"application/json"}}):{fungibles:[]}},async fetchSwapAllowance({tokenAddress:e,userAddress:t}){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?g.get({path:"/v1/convert/allowance",params:{tokenAddress:e,userAddress:t},headers:{"Content-Type":"application/json"}}):{allowance:"0"}},async fetchGasPrice({chainId:e}){let{st:t,sv:r}=g.getSdkProperties();if(!await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Gas Price");return g.get({path:"/v1/convert/gas-price",headers:{"Content-Type":"application/json"},params:{chainId:e,st:t,sv:r}})},async generateSwapCalldata({amount:e,from:t,to:r,userAddress:o,disableEstimate:n}){if(!await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return te.api.post({path:"/v1/convert/build-transaction",headers:{"Content-Type":"application/json"},body:{amount:e,eip155:{slippage:X.CONVERT_SLIPPAGE_TOLERANCE},projectId:v.state.projectId,from:t,to:r,userAddress:o,disableEstimate:n}})},async generateApproveCalldata({from:e,to:t,userAddress:r}){let{st:o,sv:n}=g.getSdkProperties();if(!await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return g.get({path:"/v1/convert/build-approve",headers:{"Content-Type":"application/json"},params:{userAddress:r,from:e,to:t,st:o,sv:n}})},async getBalance(e,t,r){let{st:o,sv:n}=g.getSdkProperties();if(!await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId))return G.showError("Token Balance Unavailable"),{balances:[]};let d=`${t}:${e}`,f=E.getBalanceCacheForCaipAddress(d);if(f)return f;let h=await g.get({path:`/v1/account/${e}/balance`,params:{currency:"usd",chainId:t,forceUpdate:r,st:o,sv:n}});return E.updateBalanceCache({caipAddress:d,balance:h,timestamp:Date.now()}),h},async lookupEnsName(e){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?g.get({path:`/v1/profile/account/${e}`,params:{apiVersion:"2"}}):{addresses:{},attributes:[]}},async reverseLookupEnsName({address:e}){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?g.get({path:`/v1/profile/reverse/${e}`,params:{sender:x.state.address,apiVersion:"2"}}):[]},async getEnsNameSuggestions(e){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?g.get({path:`/v1/profile/suggestions/${e}`,params:{zone:"reown.id"}}):{suggestions:[]}},async registerEnsName({coinType:e,address:t,message:r,signature:o}){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?te.api.post({path:"/v1/profile/account",body:{coin_type:e,address:t,message:r,signature:o},headers:{"Content-Type":"application/json"}}):{success:!1}},async generateOnRampURL({destinationWallets:e,partnerUserId:t,defaultNetwork:r,purchaseAmount:o,paymentAmount:n}){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?(await te.api.post({path:"/v1/generators/onrampurl",params:{projectId:v.state.projectId},body:{destinationWallets:e,defaultNetwork:r,partnerUserId:t,defaultExperience:"buy",presetCryptoAmount:o,presetFiatAmount:n}})).url:""},async getOnrampOptions(){if(!await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId))return{paymentCurrencies:[],purchaseCurrencies:[]};try{return await g.get({path:"/v1/onramp/options"})}catch{return $t}},async getOnrampQuote({purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}){try{return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?await te.api.post({path:"/v1/onramp/quote",params:{projectId:v.state.projectId},body:{purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}}):null}catch{return{coinbaseFee:{amount:r,currency:t.id},networkFee:{amount:r,currency:t.id},paymentSubtotal:{amount:r,currency:t.id},paymentTotal:{amount:r,currency:t.id},purchaseAmount:{amount:r,currency:t.id},quoteId:"mocked-quote-id"}}},async getSmartSessions(e){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?g.get({path:`/v1/sessions/${e}`}):[]},async revokeSmartSession(e,t,r){return await g.isNetworkSupported(s.state.activeCaipNetwork?.caipNetworkId)?te.api.post({path:`/v1/sessions/${e}/revoke`,params:{projectId:v.state.projectId},body:{pci:t,signature:r}}):{success:!1}},setClientId(e){te.clientId=e,te.api=new ue({baseUrl:St,clientId:e})}};var ce=k({currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[]}),zt={state:ce,replaceState(e){e&&Object.assign(ce,pe(e))},subscribe(e){return s.subscribeChainProp("accountState",t=>{if(t)return e(t)})},subscribeKey(e,t,r){let o;return s.subscribeChainProp("accountState",n=>{if(n){let a=n[e];o!==a&&(o=a,t(a))}},r)},setStatus(e,t){s.setAccountProp("status",e,t)},getCaipAddress(e){return s.getAccountProp("caipAddress",e)},setCaipAddress(e,t){let r=e?N.getPlainAddress(e):void 0;t===s.state.activeChain&&(s.state.activeCaipAddress=e),s.setAccountProp("caipAddress",e,t),s.setAccountProp("address",r,t)},setBalance(e,t,r){s.setAccountProp("balance",e,r),s.setAccountProp("balanceSymbol",t,r)},setProfileName(e,t){s.setAccountProp("profileName",e,t)},setProfileImage(e,t){s.setAccountProp("profileImage",e,t)},setUser(e,t){s.setAccountProp("user",e,t)},setAddressExplorerUrl(e,t){s.setAccountProp("addressExplorerUrl",e,t)},setSmartAccountDeployed(e,t){s.setAccountProp("smartAccountDeployed",e,t)},setCurrentTab(e){s.setAccountProp("currentTab",e,s.state.activeChain)},setTokenBalance(e,t){e&&s.setAccountProp("tokenBalance",e,t)},setShouldUpdateToAddress(e,t){s.setAccountProp("shouldUpdateToAddress",e,t)},setAllAccounts(e,t){s.setAccountProp("allAccounts",e,t)},addAddressLabel(e,t,r){let o=s.getAccountProp("addressLabels",r)||new Map;o.set(e,t),s.setAccountProp("addressLabels",o,r)},removeAddressLabel(e,t){let r=s.getAccountProp("addressLabels",t)||new Map;r.delete(e),s.setAccountProp("addressLabels",r,t)},setConnectedWalletInfo(e,t){s.setAccountProp("connectedWalletInfo",e,t,!1)},setPreferredAccountType(e,t){s.setAccountProp("preferredAccountTypes",{...ce.preferredAccountTypes,[t]:e},t)},setPreferredAccountTypes(e){ce.preferredAccountTypes=e},setSocialProvider(e,t){e&&s.setAccountProp("socialProvider",e,t)},setSocialWindow(e,t){s.setAccountProp("socialWindow",e?pe(e):void 0,t)},setFarcasterUrl(e,t){s.setAccountProp("farcasterUrl",e,t)},async fetchTokenBalance(e){ce.balanceLoading=!0;let t=s.state.activeCaipNetwork?.caipNetworkId,r=s.state.activeCaipNetwork?.chainNamespace,o=s.state.activeCaipAddress,n=o?N.getPlainAddress(o):void 0;if(ce.lastRetry&&!N.isAllowedRetry(ce.lastRetry,30*X.ONE_SEC_MS))return ce.balanceLoading=!1,[];try{if(n&&t&&r){let d=(await g.getBalance(n,t)).balances.filter(f=>f.quantity.decimals!=="0");return x.setTokenBalance(d,r),ce.lastRetry=void 0,ce.balanceLoading=!1,d}}catch(a){ce.lastRetry=Date.now(),e?.(a),G.showError("Token Balance Unavailable")}finally{ce.balanceLoading=!1}return[]},resetAccount(e){s.resetAccount(e)}},x=K(zt);c();u();l();c();u();l();c();u();l();c();u();l();c();u();l();var jt="https://secure.walletconnect.org/sdk",Pa=(typeof p<"u"&&typeof p.env<"u"?p.env.NEXT_PUBLIC_SECURE_SITE_SDK_URL:void 0)||jt,Oa=(typeof p<"u"&&typeof p.env<"u"?p.env.NEXT_PUBLIC_DEFAULT_LOG_LEVEL:void 0)||"error",Da=(typeof p<"u"&&typeof p.env<"u"?p.env.NEXT_PUBLIC_SECURE_SITE_SDK_VERSION:void 0)||"4",Ma={APP_EVENT_KEY:"@w3m-app/",FRAME_EVENT_KEY:"@w3m-frame/",RPC_METHOD_KEY:"RPC_",STORAGE_KEY:"@appkit-wallet/",SESSION_TOKEN_KEY:"SESSION_TOKEN_KEY",EMAIL_LOGIN_USED_KEY:"EMAIL_LOGIN_USED_KEY",LAST_USED_CHAIN_KEY:"LAST_USED_CHAIN_KEY",LAST_EMAIL_LOGIN_TIME:"LAST_EMAIL_LOGIN_TIME",EMAIL:"EMAIL",PREFERRED_ACCOUNT_TYPE:"PREFERRED_ACCOUNT_TYPE",SMART_ACCOUNT_ENABLED:"SMART_ACCOUNT_ENABLED",SMART_ACCOUNT_ENABLED_NETWORKS:"SMART_ACCOUNT_ENABLED_NETWORKS",SOCIAL_USERNAME:"SOCIAL_USERNAME",APP_SWITCH_NETWORK:"@w3m-app/SWITCH_NETWORK",APP_CONNECT_EMAIL:"@w3m-app/CONNECT_EMAIL",APP_CONNECT_DEVICE:"@w3m-app/CONNECT_DEVICE",APP_CONNECT_OTP:"@w3m-app/CONNECT_OTP",APP_CONNECT_SOCIAL:"@w3m-app/CONNECT_SOCIAL",APP_GET_SOCIAL_REDIRECT_URI:"@w3m-app/GET_SOCIAL_REDIRECT_URI",APP_GET_USER:"@w3m-app/GET_USER",APP_SIGN_OUT:"@w3m-app/SIGN_OUT",APP_IS_CONNECTED:"@w3m-app/IS_CONNECTED",APP_GET_CHAIN_ID:"@w3m-app/GET_CHAIN_ID",APP_RPC_REQUEST:"@w3m-app/RPC_REQUEST",APP_UPDATE_EMAIL:"@w3m-app/UPDATE_EMAIL",APP_UPDATE_EMAIL_PRIMARY_OTP:"@w3m-app/UPDATE_EMAIL_PRIMARY_OTP",APP_UPDATE_EMAIL_SECONDARY_OTP:"@w3m-app/UPDATE_EMAIL_SECONDARY_OTP",APP_AWAIT_UPDATE_EMAIL:"@w3m-app/AWAIT_UPDATE_EMAIL",APP_SYNC_THEME:"@w3m-app/SYNC_THEME",APP_SYNC_DAPP_DATA:"@w3m-app/SYNC_DAPP_DATA",APP_GET_SMART_ACCOUNT_ENABLED_NETWORKS:"@w3m-app/GET_SMART_ACCOUNT_ENABLED_NETWORKS",APP_INIT_SMART_ACCOUNT:"@w3m-app/INIT_SMART_ACCOUNT",APP_SET_PREFERRED_ACCOUNT:"@w3m-app/SET_PREFERRED_ACCOUNT",APP_CONNECT_FARCASTER:"@w3m-app/CONNECT_FARCASTER",APP_GET_FARCASTER_URI:"@w3m-app/GET_FARCASTER_URI",APP_RELOAD:"@w3m-app/RELOAD",FRAME_SWITCH_NETWORK_ERROR:"@w3m-frame/SWITCH_NETWORK_ERROR",FRAME_SWITCH_NETWORK_SUCCESS:"@w3m-frame/SWITCH_NETWORK_SUCCESS",FRAME_CONNECT_EMAIL_ERROR:"@w3m-frame/CONNECT_EMAIL_ERROR",FRAME_CONNECT_EMAIL_SUCCESS:"@w3m-frame/CONNECT_EMAIL_SUCCESS",FRAME_CONNECT_DEVICE_ERROR:"@w3m-frame/CONNECT_DEVICE_ERROR",FRAME_CONNECT_DEVICE_SUCCESS:"@w3m-frame/CONNECT_DEVICE_SUCCESS",FRAME_CONNECT_OTP_SUCCESS:"@w3m-frame/CONNECT_OTP_SUCCESS",FRAME_CONNECT_OTP_ERROR:"@w3m-frame/CONNECT_OTP_ERROR",FRAME_CONNECT_SOCIAL_SUCCESS:"@w3m-frame/CONNECT_SOCIAL_SUCCESS",FRAME_CONNECT_SOCIAL_ERROR:"@w3m-frame/CONNECT_SOCIAL_ERROR",FRAME_CONNECT_FARCASTER_SUCCESS:"@w3m-frame/CONNECT_FARCASTER_SUCCESS",FRAME_CONNECT_FARCASTER_ERROR:"@w3m-frame/CONNECT_FARCASTER_ERROR",FRAME_GET_FARCASTER_URI_SUCCESS:"@w3m-frame/GET_FARCASTER_URI_SUCCESS",FRAME_GET_FARCASTER_URI_ERROR:"@w3m-frame/GET_FARCASTER_URI_ERROR",FRAME_GET_SOCIAL_REDIRECT_URI_SUCCESS:"@w3m-frame/GET_SOCIAL_REDIRECT_URI_SUCCESS",FRAME_GET_SOCIAL_REDIRECT_URI_ERROR:"@w3m-frame/GET_SOCIAL_REDIRECT_URI_ERROR",FRAME_GET_USER_SUCCESS:"@w3m-frame/GET_USER_SUCCESS",FRAME_GET_USER_ERROR:"@w3m-frame/GET_USER_ERROR",FRAME_SIGN_OUT_SUCCESS:"@w3m-frame/SIGN_OUT_SUCCESS",FRAME_SIGN_OUT_ERROR:"@w3m-frame/SIGN_OUT_ERROR",FRAME_IS_CONNECTED_SUCCESS:"@w3m-frame/IS_CONNECTED_SUCCESS",FRAME_IS_CONNECTED_ERROR:"@w3m-frame/IS_CONNECTED_ERROR",FRAME_GET_CHAIN_ID_SUCCESS:"@w3m-frame/GET_CHAIN_ID_SUCCESS",FRAME_GET_CHAIN_ID_ERROR:"@w3m-frame/GET_CHAIN_ID_ERROR",FRAME_RPC_REQUEST_SUCCESS:"@w3m-frame/RPC_REQUEST_SUCCESS",FRAME_RPC_REQUEST_ERROR:"@w3m-frame/RPC_REQUEST_ERROR",FRAME_SESSION_UPDATE:"@w3m-frame/SESSION_UPDATE",FRAME_UPDATE_EMAIL_SUCCESS:"@w3m-frame/UPDATE_EMAIL_SUCCESS",FRAME_UPDATE_EMAIL_ERROR:"@w3m-frame/UPDATE_EMAIL_ERROR",FRAME_UPDATE_EMAIL_PRIMARY_OTP_SUCCESS:"@w3m-frame/UPDATE_EMAIL_PRIMARY_OTP_SUCCESS",FRAME_UPDATE_EMAIL_PRIMARY_OTP_ERROR:"@w3m-frame/UPDATE_EMAIL_PRIMARY_OTP_ERROR",FRAME_UPDATE_EMAIL_SECONDARY_OTP_SUCCESS:"@w3m-frame/UPDATE_EMAIL_SECONDARY_OTP_SUCCESS",FRAME_UPDATE_EMAIL_SECONDARY_OTP_ERROR:"@w3m-frame/UPDATE_EMAIL_SECONDARY_OTP_ERROR",FRAME_SYNC_THEME_SUCCESS:"@w3m-frame/SYNC_THEME_SUCCESS",FRAME_SYNC_THEME_ERROR:"@w3m-frame/SYNC_THEME_ERROR",FRAME_SYNC_DAPP_DATA_SUCCESS:"@w3m-frame/SYNC_DAPP_DATA_SUCCESS",FRAME_SYNC_DAPP_DATA_ERROR:"@w3m-frame/SYNC_DAPP_DATA_ERROR",FRAME_GET_SMART_ACCOUNT_ENABLED_NETWORKS_SUCCESS:"@w3m-frame/GET_SMART_ACCOUNT_ENABLED_NETWORKS_SUCCESS",FRAME_GET_SMART_ACCOUNT_ENABLED_NETWORKS_ERROR:"@w3m-frame/GET_SMART_ACCOUNT_ENABLED_NETWORKS_ERROR",FRAME_INIT_SMART_ACCOUNT_SUCCESS:"@w3m-frame/INIT_SMART_ACCOUNT_SUCCESS",FRAME_INIT_SMART_ACCOUNT_ERROR:"@w3m-frame/INIT_SMART_ACCOUNT_ERROR",FRAME_SET_PREFERRED_ACCOUNT_SUCCESS:"@w3m-frame/SET_PREFERRED_ACCOUNT_SUCCESS",FRAME_SET_PREFERRED_ACCOUNT_ERROR:"@w3m-frame/SET_PREFERRED_ACCOUNT_ERROR",FRAME_READY:"@w3m-frame/READY",FRAME_RELOAD_SUCCESS:"@w3m-frame/RELOAD_SUCCESS",FRAME_RELOAD_ERROR:"@w3m-frame/RELOAD_ERROR",RPC_RESPONSE_TYPE_ERROR:"RPC_RESPONSE_ERROR",RPC_RESPONSE_TYPE_TX:"RPC_RESPONSE_TRANSACTION_HASH",RPC_RESPONSE_TYPE_OBJECT:"RPC_RESPONSE_OBJECT"},ae={SAFE_RPC_METHODS:["eth_accounts","eth_blockNumber","eth_call","eth_chainId","eth_estimateGas","eth_feeHistory","eth_gasPrice","eth_getAccount","eth_getBalance","eth_getBlockByHash","eth_getBlockByNumber","eth_getBlockReceipts","eth_getBlockTransactionCountByHash","eth_getBlockTransactionCountByNumber","eth_getCode","eth_getFilterChanges","eth_getFilterLogs","eth_getLogs","eth_getProof","eth_getStorageAt","eth_getTransactionByBlockHashAndIndex","eth_getTransactionByBlockNumberAndIndex","eth_getTransactionByHash","eth_getTransactionCount","eth_getTransactionReceipt","eth_getUncleCountByBlockHash","eth_getUncleCountByBlockNumber","eth_maxPriorityFeePerGas","eth_newBlockFilter","eth_newFilter","eth_newPendingTransactionFilter","eth_sendRawTransaction","eth_syncing","eth_uninstallFilter","wallet_getCapabilities","wallet_getCallsStatus","eth_getUserOperationReceipt","eth_estimateUserOperationGas","eth_getUserOperationByHash","eth_supportedEntryPoints","wallet_getAssets"],NOT_SAFE_RPC_METHODS:["personal_sign","eth_signTypedData_v4","eth_sendTransaction","solana_signMessage","solana_signTransaction","solana_signAllTransactions","solana_signAndSendTransaction","wallet_sendCalls","wallet_grantPermissions","wallet_revokePermissions","eth_sendUserOperation"],GET_CHAIN_ID:"eth_chainId",RPC_METHOD_NOT_ALLOWED_MESSAGE:"Requested RPC call is not allowed",RPC_METHOD_NOT_ALLOWED_UI_MESSAGE:"Action not allowed",ACCOUNT_TYPES:{EOA:"eoa",SMART_ACCOUNT:"smartAccount"}};c();u();l();c();u();l();var Ae=k({message:"",variant:"info",open:!1}),Yt={state:Ae,subscribeKey(e,t){return O(Ae,e,t)},open(e,t){let{debug:r}=v.state,{shortMessage:o,longMessage:n}=e;r&&(Ae.message=o,Ae.variant=t,Ae.open=!0),n&&console.error(typeof n=="function"?n():n)},close(){Ae.open=!1,Ae.message="",Ae.variant="info"}},Le=K(Yt);var qt=N.getAnalyticsUrl(),Xt=new ue({baseUrl:qt,clientId:null}),Jt=["MODAL_CREATED"],fe=k({timestamp:Date.now(),reportedErrors:{},data:{type:"track",event:"MODAL_CREATED"}}),B={state:fe,subscribe(e){return W(fe,()=>e(fe))},getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=v.state;return{projectId:e,st:t,sv:r||"html-wagmi-4.2.2"}},async _sendAnalyticsEvent(e){try{let t=x.state.address;if(Jt.includes(e.data.event)||typeof window>"u")return;await Xt.post({path:"/e",params:B.getSdkProperties(),body:{eventId:N.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:e.timestamp,props:{...e.data,address:t}}}),fe.reportedErrors.FORBIDDEN=!1}catch(t){t instanceof Error&&t.cause instanceof Response&&t.cause.status===F.HTTP_STATUS_CODES.FORBIDDEN&&!fe.reportedErrors.FORBIDDEN&&(Le.open({shortMessage:"Invalid App Configuration",longMessage:`Origin ${ke()?window.origin:"uknown"} not found on Allowlist - update configuration on cloud.reown.com`},"error"),fe.reportedErrors.FORBIDDEN=!0)}},sendEvent(e){fe.timestamp=Date.now(),fe.data=e,v.state.features?.analytics&&B._sendAnalyticsEvent(fe)}};var Ee={getSIWX(){return v.state.siwx},async initializeIfEnabled(){let e=v.state.siwx,t=s.getActiveCaipAddress();if(!(e&&t))return;let[r,o,n]=t.split(":");if(s.checkIfSupportedNetwork(r))try{if((await e.getSessions(`${r}:${o}`,n)).length)return;await Y.open({view:"SIWXSignMessage"})}catch(a){console.error("SIWXUtil:initializeIfEnabled",a),B.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:this.getSIWXEventProperties()}),await S._getClient()?.disconnect().catch(console.error),T.reset("Connect"),G.showError("A problem occurred while trying initialize authentication")}},async requestSignMessage(){let e=v.state.siwx,t=N.getPlainAddress(s.getActiveCaipAddress()),r=s.getActiveCaipNetwork(),o=S._getClient();if(!e)throw new Error("SIWX is not enabled");if(!t)throw new Error("No ActiveCaipAddress found");if(!r)throw new Error("No ActiveCaipNetwork or client found");if(!o)throw new Error("No ConnectionController client found");try{let n=await e.createMessage({chainId:r.caipNetworkId,accountAddress:t}),a=n.toString();A.getConnectorId(r.chainNamespace)===F.CONNECTOR_ID.AUTH&&T.pushTransactionStack({});let f=await o.signMessage(a);await e.addSession({data:n,message:a,signature:f}),Y.close(),B.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:this.getSIWXEventProperties()})}catch(n){let a=this.getSIWXEventProperties();(!Y.state.open||T.state.view==="ApproveTransaction")&&await Y.open({view:"SIWXSignMessage"}),a.isSmartAccount?G.showError("This application might not support Smart Accounts"):G.showError("Signature declined"),B.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:a}),console.error("SWIXUtil:requestSignMessage",n)}},async cancelSignMessage(){try{this.getSIWX()?.getRequired?.()?await S.disconnect():Y.close(),T.reset("Connect"),B.sendEvent({event:"CLICK_CANCEL_SIWX",type:"track",properties:this.getSIWXEventProperties()})}catch(e){console.error("SIWXUtil:cancelSignMessage",e)}},async getSessions(){let e=v.state.siwx,t=N.getPlainAddress(s.getActiveCaipAddress()),r=s.getActiveCaipNetwork();return e&&t&&r?e.getSessions(r.caipNetworkId,t):[]},async isSIWXCloseDisabled(){let e=this.getSIWX();if(e){let t=T.state.view==="ApproveTransaction",r=T.state.view==="SIWXSignMessage";if(t||r)return e.getRequired?.()&&(await this.getSessions()).length===0}return!1},async universalProviderAuthenticate({universalProvider:e,chains:t,methods:r}){let o=Ee.getSIWX(),n=new Set(t.map(f=>f.split(":")[0]));if(!o||n.size!==1||!n.has("eip155"))return!1;let a=await o.createMessage({chainId:s.getActiveCaipNetwork()?.caipNetworkId||"",accountAddress:""}),d=await e.authenticate({nonce:a.nonce,domain:a.domain,uri:a.uri,exp:a.expirationTime,iat:a.issuedAt,nbf:a.notBefore,requestId:a.requestId,version:a.version,resources:a.resources,statement:a.statement,chainId:a.chainId,methods:r,chains:[a.chainId,...t.filter(f=>f!==a.chainId)]});if(G.showLoading("Authenticating...",{autoClose:!1}),x.setConnectedWalletInfo({...d.session.peer.metadata,name:d.session.peer.metadata.name,icon:d.session.peer.metadata.icons?.[0],type:"WALLET_CONNECT"},Array.from(n)[0]),d?.auths?.length){let f=d.auths.map(h=>{let $=e.client.formatAuthMessage({request:h.p,iss:h.p.iss});return{data:{...h.p,accountAddress:h.p.iss.split(":").slice(-1).join(""),chainId:h.p.iss.split(":").slice(2,4).join(":"),uri:h.p.aud,version:h.p.version||a.version,expirationTime:h.p.exp,issuedAt:h.p.iat,notBefore:h.p.nbf},message:$,signature:h.s.s,cacao:h}});try{await o.setSessions(f),B.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:Ee.getSIWXEventProperties()})}catch(h){throw console.error("SIWX:universalProviderAuth - failed to set sessions",h),B.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:Ee.getSIWXEventProperties()}),await e.disconnect().catch(console.error),h}finally{G.hide()}}return!0},getSIWXEventProperties(){let e=s.state.activeChain;return{network:s.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:x.state.preferredAccountTypes?.[e]===ae.ACCOUNT_TYPES.SMART_ACCOUNT}},async clearSessions(){let e=this.getSIWX();e&&await e.setSessions([])}};c();u();l();var j=k({transactions:[],coinbaseTransactions:{},transactionsByYear:{},lastNetworkInView:void 0,loading:!1,empty:!1,next:void 0}),Qt={state:j,subscribe(e){return W(j,()=>e(j))},setLastNetworkInView(e){j.lastNetworkInView=e},async fetchTransactions(e,t){if(!e)throw new Error("Transactions can't be fetched without an accountAddress");j.loading=!0;try{let r=await g.fetchTransactions({account:e,cursor:j.next,onramp:t,cache:t==="coinbase"?"no-cache":void 0,chainId:s.state.activeCaipNetwork?.caipNetworkId}),o=ye.filterSpamTransactions(r.data),n=ye.filterByConnectedChain(o),a=[...j.transactions,...n];j.loading=!1,t==="coinbase"?j.coinbaseTransactions=ye.groupTransactionsByYearAndMonth(j.coinbaseTransactions,r.data):(j.transactions=a,j.transactionsByYear=ye.groupTransactionsByYearAndMonth(j.transactionsByYear,n)),j.empty=a.length===0,j.next=r.next?r.next:void 0}catch{let o=s.state.activeChain;B.sendEvent({type:"track",event:"ERROR_FETCH_TRANSACTIONS",properties:{address:e,projectId:v.state.projectId,cursor:j.next,isSmartAccount:x.state.preferredAccountTypes?.[o]===ae.ACCOUNT_TYPES.SMART_ACCOUNT}}),G.showError("Failed to fetch transactions"),j.loading=!1,j.empty=!0,j.next=void 0}},groupTransactionsByYearAndMonth(e={},t=[]){let r=e;return t.forEach(o=>{let n=new Date(o.metadata.minedAt).getFullYear(),a=new Date(o.metadata.minedAt).getMonth(),d=r[n]??{},h=(d[a]??[]).filter($=>$.id!==o.id);r[n]={...d,[a]:[...h,o].sort(($,U)=>new Date(U.metadata.minedAt).getTime()-new Date($.metadata.minedAt).getTime())}}),r},filterSpamTransactions(e){return e.filter(t=>!t.transfers.every(o=>o.nft_info?.flags.is_spam===!0))},filterByConnectedChain(e){let t=s.state.activeCaipNetwork?.caipNetworkId;return e.filter(o=>o.metadata.chain===t)},clearCursor(){j.next=void 0},resetTransactions(){j.transactions=[],j.transactionsByYear={},j.lastNetworkInView=void 0,j.loading=!1,j.empty=!1,j.next=void 0}},ye=K(Qt,"API_ERROR");var q=k({connections:new Map,wcError:!1,buffering:!1,status:"disconnected"}),ve,Zt={state:q,subscribeKey(e,t){return O(q,e,t)},_getClient(){return q._client},setClient(e){q._client=pe(e)},async connectWalletConnect(){if(N.isTelegram()||N.isSafari()&&N.isIos()){if(ve){await ve,ve=void 0;return}if(!N.isPairingExpired(q?.wcPairingExpiry)){let e=q.wcUri;q.wcUri=e;return}ve=S._getClient()?.connectWalletConnect?.().catch(()=>{}),S.state.status="connecting",await ve,ve=void 0,q.wcPairingExpiry=void 0,S.state.status="connected"}else await S._getClient()?.connectWalletConnect?.()},async connectExternal(e,t,r=!0){await S._getClient()?.connectExternal?.(e),r&&s.setActiveNamespace(t)},async reconnectExternal(e){await S._getClient()?.reconnectExternal?.(e);let t=e.chain||s.state.activeChain;t&&A.setConnectorId(e.id,t)},async setPreferredAccountType(e,t){Y.setLoading(!0,s.state.activeChain);let r=A.getAuthConnector();r&&(x.setPreferredAccountType(e,t),await r.provider.setPreferredAccount(e),E.setPreferredAccountTypes(x.state.preferredAccountTypes??{[t]:e}),await S.reconnectExternal(r),Y.setLoading(!1,s.state.activeChain),B.sendEvent({type:"track",event:"SET_PREFERRED_ACCOUNT_TYPE",properties:{accountType:e,network:s.state.activeCaipNetwork?.caipNetworkId||""}}))},async signMessage(e){return S._getClient()?.signMessage(e)},parseUnits(e,t){return S._getClient()?.parseUnits(e,t)},formatUnits(e,t){return S._getClient()?.formatUnits(e,t)},async sendTransaction(e){return S._getClient()?.sendTransaction(e)},async getCapabilities(e){return S._getClient()?.getCapabilities(e)},async grantPermissions(e){return S._getClient()?.grantPermissions(e)},async walletGetAssets(e){return S._getClient()?.walletGetAssets(e)??{}},async estimateGas(e){return S._getClient()?.estimateGas(e)},async writeContract(e){return S._getClient()?.writeContract(e)},async getEnsAddress(e){return S._getClient()?.getEnsAddress(e)},async getEnsAvatar(e){return S._getClient()?.getEnsAvatar(e)},checkInstalled(e){return S._getClient()?.checkInstalled?.(e)||!1},resetWcConnection(){q.wcUri=void 0,q.wcPairingExpiry=void 0,q.wcLinking=void 0,q.recentWallet=void 0,q.status="disconnected",ye.resetTransactions(),E.deleteWalletConnectDeepLink()},resetUri(){q.wcUri=void 0,q.wcPairingExpiry=void 0,ve=void 0},finalizeWcConnection(){let{wcLinking:e,recentWallet:t}=S.state;e&&E.setWalletConnectDeepLink(e),t&&E.setAppKitRecent(t),B.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:e?"mobile":"qrcode",name:T.state.data?.wallet?.name||"Unknown"}})},setWcBasic(e){q.wcBasic=e},setUri(e){q.wcUri=e,q.wcPairingExpiry=N.getPairingExpiry()},setWcLinking(e){q.wcLinking=e},setWcError(e){q.wcError=e,q.buffering=!1},setRecentWallet(e){q.recentWallet=e},setBuffering(e){q.buffering=e},setStatus(e){q.status=e},async disconnect(e){try{Y.setLoading(!0,e),await Ee.clearSessions(),await s.disconnect(e),Y.setLoading(!1,e),A.setFilterByNamespace(void 0)}catch(t){throw new xe("Failed to disconnect","INTERNAL_SDK_ERROR",t)}},setConnections(e,t){q.connections.set(t,e)},switchAccount({connection:e,address:t,namespace:r}){if(A.state.activeConnectorIds[r]===e.connectorId){let a=s.state.activeCaipNetwork;if(a){let d=`${r}:${a.id}:${t}`;x.setCaipAddress(d,r)}else console.warn(`No current network found for namespace "${r}"`)}else{let a=A.getConnector(e.connectorId);a?S.connectExternal(a,r):console.warn(`No connector found for namespace "${r}"`)}}},S=K(Zt);c();u();l();var Ue=k({loading:!1,open:!1,selectedNetworkId:void 0,activeChain:void 0,initialized:!1}),ge={state:Ue,subscribe(e){return W(Ue,()=>e(Ue))},subscribeOpen(e){return O(Ue,"open",e)},set(e){Object.assign(Ue,{...Ue,...e})}};var re=k({loading:!1,loadingNamespaceMap:new Map,open:!1,shake:!1,namespace:void 0}),er={state:re,subscribe(e){return W(re,()=>e(re))},subscribeKey(e,t){return O(re,e,t)},async open(e){let t=x.state.status==="connected";S.state.wcBasic?I.prefetch({fetchNetworkImages:!1,fetchConnectorImages:!1}):await I.prefetch({fetchConnectorImages:!t,fetchFeaturedWallets:!t,fetchRecommendedWallets:!t}),e?.namespace?(await s.switchActiveNamespace(e.namespace),Y.setLoading(!0,e.namespace)):Y.setLoading(!0),A.setFilterByNamespace(e?.namespace);let r=s.getAccountData(e?.namespace)?.caipAddress,o=s.state.noAdapters;v.state.manualWCControl||o&&!r?N.isMobile()?T.reset("AllWallets"):T.reset("ConnectingWalletConnectBasic"):e?.view?T.reset(e.view,e.data):r?T.reset("Account"):T.reset("Connect"),re.open=!0,ge.set({open:!0}),B.sendEvent({type:"track",event:"MODAL_OPEN",properties:{connected:!!r}})},close(){let e=v.state.enableEmbedded,t=!!s.state.activeCaipAddress;re.open&&B.sendEvent({type:"track",event:"MODAL_CLOSE",properties:{connected:t}}),re.open=!1,Y.clearLoading(),e?t?T.replace("Account"):T.push("Connect"):ge.set({open:!1}),S.resetUri()},setLoading(e,t){t&&re.loadingNamespaceMap.set(t,e),re.loading=e,ge.set({loading:e})},clearLoading(){re.loadingNamespaceMap.clear(),re.loading=!1},shake(){re.shake||(re.shake=!0,setTimeout(()=>{re.shake=!1},500))}},Y=K(er);var z=k({view:"Connect",history:["Connect"],transactionStack:[]}),tr={state:z,subscribeKey(e,t){return O(z,e,t)},pushTransactionStack(e){z.transactionStack.push(e)},popTransactionStack(e){let t=z.transactionStack.pop();if(!t)return;let{onSuccess:r,onError:o,onCancel:n}=t;switch(e){case"success":r?.();break;case"error":o?.(),T.goBack();break;case"cancel":n?.(),T.goBack();break;default:}},push(e,t){e!==z.view&&(z.view=e,z.history.push(e),z.data=t)},reset(e,t){z.view=e,z.history=[e],z.data=t},replace(e,t){z.history.at(-1)===e||(z.view=e,z.history[z.history.length-1]=e,z.data=t)},goBack(){let e=!s.state.activeCaipAddress&&T.state.view==="ConnectingFarcaster";if(z.history.length>1){z.history.pop();let[t]=z.history.slice(-1);t&&(z.view=t)}else Y.close();z.data?.wallet&&(z.data.wallet=void 0),setTimeout(()=>{if(e){x.setFarcasterUrl(void 0,s.state.activeChain);let t=A.getAuthConnector();t?.provider?.reload();let r=me(v.state);t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType})}},100)},goBackToIndex(e){if(z.history.length>1){z.history=z.history.slice(0,e+1);let[t]=z.history.slice(-1);t&&(z.view=t)}},goBackOrCloseModal(){T.state.history.length>1?T.goBack():Y.close()}},T=K(tr);c();u();l();var we=k({themeMode:"dark",themeVariables:{},w3mThemeVariables:void 0}),rt={state:we,subscribe(e){return W(we,()=>e(we))},setThemeMode(e){we.themeMode=e;try{let t=A.getAuthConnector();if(t){let r=rt.getSnapshot().themeVariables;t.provider.syncTheme({themeMode:e,themeVariables:r,w3mThemeVariables:ie(r,e)})}}catch{console.info("Unable to sync theme to auth connector")}},setThemeVariables(e){we.themeVariables={...we.themeVariables,...e};try{let t=A.getAuthConnector();if(t){let r=rt.getSnapshot().themeVariables;t.provider.syncTheme({themeVariables:r,w3mThemeVariables:ie(we.themeVariables,we.themeMode)})}}catch{console.info("Unable to sync theme to auth connector")}},getSnapshot(){return me(we)}},Pe=K(rt);var Nt={eip155:void 0,solana:void 0,polkadot:void 0,bip122:void 0,cosmos:void 0},L=k({allConnectors:[],connectors:[],activeConnector:void 0,filterByNamespace:void 0,activeConnectorIds:{...Nt},filterByNamespaceMap:{eip155:!0,solana:!0,polkadot:!0,bip122:!0,cosmos:!0}}),rr={state:L,subscribe(e){return W(L,()=>{e(L)})},subscribeKey(e,t){return O(L,e,t)},initialize(e){e.forEach(t=>{let r=E.getConnectedConnectorId(t);r&&A.setConnectorId(r,t)})},setActiveConnector(e){e&&(L.activeConnector=pe(e))},setConnectors(e){e.filter(n=>!L.allConnectors.some(a=>a.id===n.id&&A.getConnectorName(a.name)===A.getConnectorName(n.name)&&a.chain===n.chain)).forEach(n=>{n.type!=="MULTI_CHAIN"&&L.allConnectors.push(pe(n))});let r=A.getEnabledNamespaces(),o=A.getEnabledConnectors(r);L.connectors=A.mergeMultiChainConnectors(o)},filterByNamespaces(e){Object.keys(L.filterByNamespaceMap).forEach(t=>{L.filterByNamespaceMap[t]=!1}),e.forEach(t=>{L.filterByNamespaceMap[t]=!0}),A.updateConnectorsForEnabledNamespaces()},filterByNamespace(e,t){L.filterByNamespaceMap[e]=t,A.updateConnectorsForEnabledNamespaces()},updateConnectorsForEnabledNamespaces(){let e=A.getEnabledNamespaces(),t=A.getEnabledConnectors(e),r=A.areAllNamespacesEnabled();L.connectors=A.mergeMultiChainConnectors(t),r?I.clearFilterByNamespaces():I.filterByNamespaces(e)},getEnabledNamespaces(){return Object.entries(L.filterByNamespaceMap).filter(([e,t])=>t).map(([e])=>e)},getEnabledConnectors(e){return L.allConnectors.filter(t=>e.includes(t.chain))},areAllNamespacesEnabled(){return Object.values(L.filterByNamespaceMap).every(e=>e)},mergeMultiChainConnectors(e){let t=A.generateConnectorMapByName(e),r=[];return t.forEach(o=>{let n=o[0],a=n?.id===F.CONNECTOR_ID.AUTH;o.length>1&&n?r.push({name:n.name,imageUrl:n.imageUrl,imageId:n.imageId,connectors:[...o],type:a?"AUTH":"MULTI_CHAIN",chain:"eip155",id:n?.id||""}):n&&r.push(n)}),r},generateConnectorMapByName(e){let t=new Map;return e.forEach(r=>{let{name:o}=r,n=A.getConnectorName(o);if(!n)return;let a=t.get(n)||[];a.find(f=>f.chain===r.chain)||a.push(r),t.set(n,a)}),t},getConnectorName(e){return e&&({"Trust Wallet":"Trust"}[e]||e)},getUniqueConnectorsByName(e){let t=[];return e.forEach(r=>{t.find(o=>o.chain===r.chain)||t.push(r)}),t},addConnector(e){if(e.id===F.CONNECTOR_ID.AUTH){let t=e,r=me(v.state),o=Pe.getSnapshot().themeMode,n=Pe.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType}),t?.provider?.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:ie(n,o)}),A.setConnectors([e])}else A.setConnectors([e])},getAuthConnector(e){let t=e||s.state.activeChain,r=L.connectors.find(o=>o.id===F.CONNECTOR_ID.AUTH);if(r)return r?.connectors?.length?r.connectors.find(n=>n.chain===t):r},getAnnouncedConnectorRdns(){return L.connectors.filter(e=>e.type==="ANNOUNCED").map(e=>e.info?.rdns)},getConnectorById(e){return L.allConnectors.find(t=>t.id===e)},getConnector(e,t){return L.allConnectors.filter(o=>o.chain===s.state.activeChain).find(o=>o.explorerId===e||o.info?.rdns===t)},syncIfAuthConnector(e){if(e.id!=="ID_AUTH")return;let t=e,r=me(v.state),o=Pe.getSnapshot().themeMode,n=Pe.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,sdkType:r.sdkType,projectId:r.projectId}),t.provider.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:ie(n,o)})},getConnectorsByNamespace(e){let t=L.allConnectors.filter(r=>r.chain===e);return A.mergeMultiChainConnectors(t)},selectWalletConnector(e){let t=A.getConnector(e.id,e.rdns);Tt.handleMobileDeeplinkRedirect(t?.name||e.name||""),t?T.push("ConnectingExternal",{connector:t}):T.push("ConnectingWalletConnect",{wallet:e})},getConnectors(e){return e?A.getConnectorsByNamespace(e):A.mergeMultiChainConnectors(L.allConnectors)},setFilterByNamespace(e){L.filterByNamespace=e,L.connectors=A.getConnectors(e),I.setFilterByNamespace(e)},setConnectorId(e,t){e&&(L.activeConnectorIds={...L.activeConnectorIds,[t]:e},E.setConnectedConnectorId(t,e))},removeConnectorId(e){L.activeConnectorIds={...L.activeConnectorIds,[e]:void 0},E.deleteConnectedConnectorId(e)},getConnectorId(e){if(e)return L.activeConnectorIds[e]},isConnected(e){return e?!!L.activeConnectorIds[e]:Object.values(L.activeConnectorIds).some(t=>!!t)},resetConnectorIds(){L.activeConnectorIds={...Nt}}},A=K(rr);function Fe(e,t){return A.getConnectorId(e)===t}function _t(e){let t=Array.from(s.state.chains.keys()),r=[];return e?(r.push([e,s.state.chains.get(e)]),Fe(e,F.CONNECTOR_ID.WALLET_CONNECT)?t.forEach(o=>{o!==e&&Fe(o,F.CONNECTOR_ID.WALLET_CONNECT)&&r.push([o,s.state.chains.get(o)])}):Fe(e,F.CONNECTOR_ID.AUTH)&&t.forEach(o=>{o!==e&&Fe(o,F.CONNECTOR_ID.AUTH)&&r.push([o,s.state.chains.get(o)])})):r=Array.from(s.state.chains.entries()),r}c();u();l();c();u();l();c();u();l();var ze={createBalance(e,t){let r={name:e.metadata.name||"",symbol:e.metadata.symbol||"",decimals:e.metadata.decimals||0,value:e.metadata.value||0,price:e.metadata.price||0,iconUrl:e.metadata.iconUrl||""};return{name:r.name,symbol:r.symbol,chainId:t,address:e.address==="native"?void 0:this.convertAddressToCAIP10Address(e.address,t),value:r.value,price:r.price,quantity:{decimals:r.decimals.toString(),numeric:this.convertHexToBalance({hex:e.balance,decimals:r.decimals})},iconUrl:r.iconUrl}},convertHexToBalance({hex:e,decimals:t}){return dt(BigInt(e),t)},convertAddressToCAIP10Address(e,t){return`${t}:${e}`},createCAIP2ChainId(e,t){return`${t}:${parseInt(e,16)}`},getChainIdHexFromCAIP2ChainId(e){let t=e.split(":");if(t.length<2||!t[1])return"0x0";let r=t[1],o=parseInt(r,10);return isNaN(o)?"0x0":`0x${o.toString(16)}`},isWalletGetAssetsResponse(e){return typeof e!="object"||e===null?!1:Object.values(e).every(t=>Array.isArray(t)&&t.every(r=>this.isValidAsset(r)))},isValidAsset(e){return typeof e=="object"&&e!==null&&typeof e.address=="string"&&typeof e.balance=="string"&&(e.type==="ERC20"||e.type==="NATIVE")&&typeof e.metadata=="object"&&e.metadata!==null&&typeof e.metadata.name=="string"&&typeof e.metadata.symbol=="string"&&typeof e.metadata.decimals=="number"&&typeof e.metadata.price=="number"&&typeof e.metadata.iconUrl=="string"}};var Oe={async getMyTokensWithBalance(e){let t=x.state.address,r=s.state.activeCaipNetwork;if(!t||!r)return[];if(r.chainNamespace==="eip155"){let n=await this.getEIP155Balances(t,r);if(n)return this.filterLowQualityTokens(n)}let o=await g.getBalance(t,r.caipNetworkId,e);return this.filterLowQualityTokens(o.balances)},async getEIP155Balances(e,t){try{let r=ze.getChainIdHexFromCAIP2ChainId(t.caipNetworkId);if(!(await S.getCapabilities(e))?.[r]?.assetDiscovery?.supported)return null;let n=await S.walletGetAssets({account:e,chainFilter:[r]});return ze.isWalletGetAssetsResponse(n)?(n[r]||[]).map(d=>ze.createBalance(d,t.caipNetworkId)):null}catch{return null}},filterLowQualityTokens(e){return e.filter(t=>t.quantity.decimals!=="0")},mapBalancesToSwapTokens(e){return e?.map(t=>({...t,address:t?.address?t.address:s.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}};var V=k({tokenBalances:[],loading:!1}),or={state:V,subscribe(e){return W(V,()=>e(V))},subscribeKey(e,t){return O(V,e,t)},setToken(e){e&&(V.token=pe(e))},setTokenAmount(e){V.sendTokenAmount=e},setReceiverAddress(e){V.receiverAddress=e},setReceiverProfileImageUrl(e){V.receiverProfileImageUrl=e},setReceiverProfileName(e){V.receiverProfileName=e},setNetworkBalanceInUsd(e){V.networkBalanceInUSD=e},setLoading(e){V.loading=e},async sendToken(){try{switch(D.setLoading(!0),s.state.activeCaipNetwork?.chainNamespace){case"eip155":await D.sendEvmToken();return;case"solana":await D.sendSolanaToken();return;default:throw new Error("Unsupported chain")}}finally{D.setLoading(!1)}},async sendEvmToken(){let e=s.state.activeChain,t=x.state.preferredAccountTypes?.[e];if(!D.state.sendTokenAmount||!D.state.receiverAddress)throw new Error("An amount and receiver address are required");if(!D.state.token)throw new Error("A token is required");D.state.token?.address?(B.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===ae.ACCOUNT_TYPES.SMART_ACCOUNT,token:D.state.token.address,amount:D.state.sendTokenAmount,network:s.state.activeCaipNetwork?.caipNetworkId||""}}),await D.sendERC20Token({receiverAddress:D.state.receiverAddress,tokenAddress:D.state.token.address,sendTokenAmount:D.state.sendTokenAmount,decimals:D.state.token.quantity.decimals})):(B.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===ae.ACCOUNT_TYPES.SMART_ACCOUNT,token:D.state.token.symbol||"",amount:D.state.sendTokenAmount,network:s.state.activeCaipNetwork?.caipNetworkId||""}}),await D.sendNativeToken({receiverAddress:D.state.receiverAddress,sendTokenAmount:D.state.sendTokenAmount,decimals:D.state.token.quantity.decimals}))},async fetchTokenBalance(e){V.loading=!0;let t=s.state.activeCaipNetwork?.caipNetworkId,r=s.state.activeCaipNetwork?.chainNamespace,o=s.state.activeCaipAddress,n=o?N.getPlainAddress(o):void 0;if(V.lastRetry&&!N.isAllowedRetry(V.lastRetry,30*X.ONE_SEC_MS))return V.loading=!1,[];try{if(n&&t&&r){let a=await Oe.getMyTokensWithBalance();return V.tokenBalances=a,V.lastRetry=void 0,a}}catch(a){V.lastRetry=Date.now(),e?.(a),G.showError("Token Balance Unavailable")}finally{V.loading=!1}return[]},fetchNetworkBalance(){if(V.tokenBalances.length===0)return;let e=Oe.mapBalancesToSwapTokens(V.tokenBalances);if(!e)return;let t=e.find(r=>r.address===s.getActiveNetworkTokenAddress());t&&(V.networkBalanceInUSD=t?H.multiply(t.quantity.numeric,t.price).toString():"0")},async sendNativeToken(e){T.pushTransactionStack({});let t=e.receiverAddress,r=x.state.address,o=S.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));await S.sendTransaction({chainNamespace:"eip155",to:t,address:r,data:"0x",value:o??BigInt(0)}),B.sendEvent({type:"track",event:"SEND_SUCCESS",properties:{isSmartAccount:x.state.preferredAccountTypes?.eip155===ae.ACCOUNT_TYPES.SMART_ACCOUNT,token:D.state.token?.symbol||"",amount:e.sendTokenAmount,network:s.state.activeCaipNetwork?.caipNetworkId||""}}),S._getClient()?.updateBalance("eip155"),D.resetSend()},async sendERC20Token(e){T.pushTransactionStack({onSuccess(){T.replace("Account")}});let t=S.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));if(x.state.address&&e.sendTokenAmount&&e.receiverAddress&&e.tokenAddress){let r=N.getPlainAddress(e.tokenAddress);await S.writeContract({fromAddress:x.state.address,tokenAddress:r,args:[e.receiverAddress,t??BigInt(0)],method:"transfer",abi:Ze.getERC20Abi(r),chainNamespace:"eip155"}),D.resetSend()}},async sendSolanaToken(){if(!D.state.sendTokenAmount||!D.state.receiverAddress)throw new Error("An amount and receiver address are required");T.pushTransactionStack({onSuccess(){T.replace("Account")}}),await S.sendTransaction({chainNamespace:"solana",to:D.state.receiverAddress,value:D.state.sendTokenAmount}),S._getClient()?.updateBalance("solana"),D.resetSend()},resetSend(){V.token=void 0,V.sendTokenAmount=void 0,V.receiverAddress=void 0,V.receiverProfileImageUrl=void 0,V.receiverProfileName=void 0,V.loading=!1,V.tokenBalances=[]}},D=K(or);var ot={currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[],user:void 0},je={caipNetwork:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]},m=k({chains:ut(),activeCaipAddress:void 0,activeChain:void 0,activeCaipNetwork:void 0,noAdapters:!1,universalAdapter:{networkControllerClient:void 0,connectionControllerClient:void 0},isSwitchingNamespace:!1}),nr={state:m,subscribe(e){return W(m,()=>{e(m)})},subscribeKey(e,t){return O(m,e,t)},subscribeChainProp(e,t,r){let o;return W(m.chains,()=>{let n=r||m.activeChain;if(n){let a=m.chains.get(n)?.[e];o!==a&&(o=a,t(a))}})},initialize(e,t,r){let{chainId:o,namespace:n}=E.getActiveNetworkProps(),a=t?.find(U=>U.id.toString()===o?.toString()),f=e.find(U=>U?.namespace===n)||e?.[0],h=e.map(U=>U.namespace).filter(U=>U!==void 0),$=v.state.enableEmbedded?new Set([...h]):new Set([...t?.map(U=>U.chainNamespace)??[]]);(e?.length===0||!f)&&(m.noAdapters=!0),m.noAdapters||(m.activeChain=f?.namespace,m.activeCaipNetwork=a,s.setChainNetworkData(f?.namespace,{caipNetwork:a}),m.activeChain&&ge.set({activeChain:f?.namespace})),$.forEach(U=>{let J=t?.filter(Se=>Se.chainNamespace===U);s.state.chains.set(U,{namespace:U,networkState:k({...je,caipNetwork:J?.[0]}),accountState:k(ot),caipNetworks:J??[],...r}),s.setRequestedCaipNetworks(J??[],U)})},removeAdapter(e){if(m.activeChain===e){let t=Array.from(m.chains.entries()).find(([r])=>r!==e);if(t){let r=t[1]?.caipNetworks?.[0];r&&s.setActiveCaipNetwork(r)}}m.chains.delete(e)},addAdapter(e,{networkControllerClient:t,connectionControllerClient:r},o){m.chains.set(e.namespace,{namespace:e.namespace,networkState:{...je,caipNetwork:o[0]},accountState:ot,caipNetworks:o,connectionControllerClient:r,networkControllerClient:t}),s.setRequestedCaipNetworks(o?.filter(n=>n.chainNamespace===e.namespace)??[],e.namespace)},addNetwork(e){let t=m.chains.get(e.chainNamespace);if(t){let r=[...t.caipNetworks||[]];t.caipNetworks?.find(o=>o.id===e.id)||r.push(e),m.chains.set(e.chainNamespace,{...t,caipNetworks:r}),s.setRequestedCaipNetworks(r,e.chainNamespace),A.filterByNamespace(e.chainNamespace,!0)}},removeNetwork(e,t){let r=m.chains.get(e);if(r){let o=m.activeCaipNetwork?.id===t,n=[...r.caipNetworks?.filter(a=>a.id!==t)||[]];o&&r?.caipNetworks?.[0]&&s.setActiveCaipNetwork(r.caipNetworks[0]),m.chains.set(e,{...r,caipNetworks:n}),s.setRequestedCaipNetworks(n||[],e),n.length===0&&A.filterByNamespace(e,!1)}},setAdapterNetworkState(e,t){let r=m.chains.get(e);r&&(r.networkState={...r.networkState||je,...t},m.chains.set(e,r))},setChainAccountData(e,t,r=!0){if(!e)throw new Error("Chain is required to update chain account data");let o=m.chains.get(e);if(o){let n={...o.accountState||ot,...t};m.chains.set(e,{...o,accountState:n}),(m.chains.size===1||m.activeChain===e)&&(t.caipAddress&&(m.activeCaipAddress=t.caipAddress),x.replaceState(n))}},setChainNetworkData(e,t){if(!e)return;let r=m.chains.get(e);if(r){let o={...r.networkState||je,...t};m.chains.set(e,{...r,networkState:o})}},setAccountProp(e,t,r,o=!0){s.setChainAccountData(r,{[e]:t},o),e==="status"&&t==="disconnected"&&r&&A.removeConnectorId(r)},setActiveNamespace(e){m.activeChain=e;let t=e?m.chains.get(e):void 0,r=t?.networkState?.caipNetwork;r?.id&&e&&(m.activeCaipAddress=t?.accountState?.caipAddress,m.activeCaipNetwork=r,s.setChainNetworkData(e,{caipNetwork:r}),E.setActiveCaipNetworkId(r?.caipNetworkId),ge.set({activeChain:e,selectedNetworkId:r?.caipNetworkId}))},setActiveCaipNetwork(e){if(!e)return;m.activeChain!==e.chainNamespace&&s.setIsSwitchingNamespace(!0);let t=m.chains.get(e.chainNamespace);m.activeChain=e.chainNamespace,m.activeCaipNetwork=e,s.setChainNetworkData(e.chainNamespace,{caipNetwork:e}),t?.accountState?.address?m.activeCaipAddress=`${e.chainNamespace}:${e.id}:${t?.accountState?.address}`:m.activeCaipAddress=void 0,s.setAccountProp("caipAddress",m.activeCaipAddress,e.chainNamespace),t&&x.replaceState(t.accountState),D.resetSend(),ge.set({activeChain:m.activeChain,selectedNetworkId:m.activeCaipNetwork?.caipNetworkId}),E.setActiveCaipNetworkId(e.caipNetworkId),!s.checkIfSupportedNetwork(e.chainNamespace)&&v.state.enableNetworkSwitch&&!v.state.allowUnsupportedChain&&!S.state.wcBasic&&s.showUnsupportedChainUI()},addCaipNetwork(e){if(!e)return;let t=m.chains.get(e.chainNamespace);t&&t?.caipNetworks?.push(e)},async switchActiveNamespace(e){if(!e)return;let t=e!==s.state.activeChain,r=s.getNetworkData(e)?.caipNetwork,o=s.getCaipNetworkByNamespace(e,r?.id);t&&o&&await s.switchActiveNetwork(o)},async switchActiveNetwork(e){let r=!s.state.chains.get(s.state.activeChain)?.caipNetworks?.some(n=>n.id===m.activeCaipNetwork?.id),o=s.getNetworkControllerClient(e.chainNamespace);if(o){try{await o.switchCaipNetwork(e),r&&Y.close()}catch{T.goBack()}B.sendEvent({type:"track",event:"SWITCH_NETWORK",properties:{network:e.caipNetworkId}})}},getNetworkControllerClient(e){let t=e||m.activeChain,r=m.chains.get(t);if(!r)throw new Error("Chain adapter not found");if(!r.networkControllerClient)throw new Error("NetworkController client not set");return r.networkControllerClient},getConnectionControllerClient(e){let t=e||m.activeChain;if(!t)throw new Error("Chain is required to get connection controller client");let r=m.chains.get(t);if(!r?.connectionControllerClient)throw new Error("ConnectionController client not set");return r.connectionControllerClient},getAccountProp(e,t){let r=m.activeChain;if(t&&(r=t),!r)return;let o=m.chains.get(r)?.accountState;if(o)return o[e]},getNetworkProp(e,t){let r=m.chains.get(t)?.networkState;if(r)return r[e]},getRequestedCaipNetworks(e){let t=m.chains.get(e),{approvedCaipNetworkIds:r=[],requestedCaipNetworks:o=[]}=t?.networkState||{};return N.sortRequestedNetworks(r,o)},getAllRequestedCaipNetworks(){let e=[];return m.chains.forEach(t=>{let r=s.getRequestedCaipNetworks(t.namespace);e.push(...r)}),e},setRequestedCaipNetworks(e,t){s.setAdapterNetworkState(t,{requestedCaipNetworks:e});let o=s.getAllRequestedCaipNetworks().map(a=>a.chainNamespace),n=Array.from(new Set(o));A.filterByNamespaces(n)},getAllApprovedCaipNetworkIds(){let e=[];return m.chains.forEach(t=>{let r=s.getApprovedCaipNetworkIds(t.namespace);e.push(...r)}),e},getActiveCaipNetwork(){return m.activeCaipNetwork},getActiveCaipAddress(){return m.activeCaipAddress},getApprovedCaipNetworkIds(e){return m.chains.get(e)?.networkState?.approvedCaipNetworkIds||[]},async setApprovedCaipNetworksData(e){let r=await s.getNetworkControllerClient()?.getApprovedCaipNetworksData();s.setAdapterNetworkState(e,{approvedCaipNetworkIds:r?.approvedCaipNetworkIds,supportsAllNetworks:r?.supportsAllNetworks})},checkIfSupportedNetwork(e,t){let r=t||m.activeCaipNetwork,o=s.getRequestedCaipNetworks(e);return o.length?o?.some(n=>n.id===r?.id):!0},checkIfSupportedChainId(e){return m.activeChain?s.getRequestedCaipNetworks(m.activeChain)?.some(r=>r.id===e):!0},setSmartAccountEnabledNetworks(e,t){s.setAdapterNetworkState(t,{smartAccountEnabledNetworks:e})},checkIfSmartAccountEnabled(){let e=Qe.caipNetworkIdToNumber(m.activeCaipNetwork?.caipNetworkId),t=m.activeChain;return!t||!e?!1:!!s.getNetworkProp("smartAccountEnabledNetworks",t)?.includes(Number(e))},getActiveNetworkTokenAddress(){let e=m.activeCaipNetwork?.chainNamespace||"eip155",t=m.activeCaipNetwork?.id||1,r=X.NATIVE_TOKEN_ADDRESS[e];return`${e}:${t}:${r}`},showUnsupportedChainUI(){Y.open({view:"UnsupportedChain"})},checkIfNamesSupported(){let e=m.activeCaipNetwork;return!!(e?.chainNamespace&&X.NAMES_SUPPORTED_CHAIN_NAMESPACES.includes(e.chainNamespace))},resetNetwork(e){s.setAdapterNetworkState(e,{approvedCaipNetworkIds:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]})},resetAccount(e){let t=e;if(!t)throw new Error("Chain is required to set account prop");m.activeCaipAddress=void 0,s.setChainAccountData(t,{smartAccountDeployed:!1,currentTab:0,caipAddress:void 0,address:void 0,balance:void 0,balanceSymbol:void 0,profileName:void 0,profileImage:void 0,addressExplorerUrl:void 0,tokenBalance:[],connectedWalletInfo:void 0,preferredAccountTypes:void 0,socialProvider:void 0,socialWindow:void 0,farcasterUrl:void 0,allAccounts:[],user:void 0,status:"disconnected"}),A.removeConnectorId(t)},async disconnect(e){let t=_t(e);try{D.resetSend();let r=await Promise.allSettled(t.map(async([n,a])=>{try{let{caipAddress:d}=s.getAccountData(n)||{};d&&a.connectionControllerClient?.disconnect&&await a.connectionControllerClient.disconnect(n),s.resetAccount(n),s.resetNetwork(n)}catch(d){throw new Error(`Failed to disconnect chain ${n}: ${d.message}`)}}));S.resetWcConnection();let o=r.filter(n=>n.status==="rejected");if(o.length>0)throw new Error(o.map(n=>n.reason.message).join(", "));E.deleteConnectedSocialProvider(),e?A.removeConnectorId(e):A.resetConnectorIds(),B.sendEvent({type:"track",event:"DISCONNECT_SUCCESS",properties:{namespace:e||"all"}})}catch(r){console.error(r.message||"Failed to disconnect chains"),B.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:r.message||"Failed to disconnect chains"}})}},setIsSwitchingNamespace(e){m.isSwitchingNamespace=e},getFirstCaipNetworkSupportsAuthConnector(){let e=[],t;if(m.chains.forEach(r=>{F.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(o=>o===r.namespace)&&r.namespace&&e.push(r.namespace)}),e.length>0){let r=e[0];return t=r?m.chains.get(r)?.caipNetworks?.[0]:void 0,t}},getAccountData(e){return e?s.state.chains.get(e)?.accountState:x.state},getNetworkData(e){let t=e||m.activeChain;if(t)return s.state.chains.get(t)?.networkState},getCaipNetworkByNamespace(e,t){if(!e)return;let r=s.state.chains.get(e),o=r?.caipNetworks?.find(n=>n.id===t);return o||r?.networkState?.caipNetwork||r?.caipNetworks?.[0]},getRequestedCaipNetworkIds(){let e=A.state.filterByNamespace;return(e?[m.chains.get(e)]:Array.from(m.chains.values())).flatMap(r=>r?.caipNetworks||[]).map(r=>r.caipNetworkId)},getCaipNetworks(e){return e?s.getRequestedCaipNetworks(e):s.getAllRequestedCaipNetworks()}},s=K(nr);var nt={PHANTOM:"a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",COINBASE:"fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa"},ar=N.getApiUrl(),oe=new ue({baseUrl:ar,clientId:null}),sr=40,kt=4,ir=20,P=k({promises:{},page:1,count:0,featured:[],allFeatured:[],recommended:[],allRecommended:[],wallets:[],filteredWallets:[],search:[],isAnalyticsEnabled:!1,excludedWallets:[],isFetchingRecommendedWallets:!1}),I={state:P,subscribeKey(e,t){return O(P,e,t)},_getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=v.state;return{projectId:e,st:t||"appkit",sv:r||"html-wagmi-4.2.2"}},_filterOutExtensions(e){return v.state.isUniversalProvider?e.filter(t=>!!(t.mobile_link||t.desktop_link||t.webapp_link)):e},async _fetchWalletImage(e){let t=`${oe.baseUrl}/getWalletImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setWalletImage(e,URL.createObjectURL(r))},async _fetchNetworkImage(e){let t=`${oe.baseUrl}/public/getAssetImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setNetworkImage(e,URL.createObjectURL(r))},async _fetchConnectorImage(e){let t=`${oe.baseUrl}/public/getAssetImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setConnectorImage(e,URL.createObjectURL(r))},async _fetchCurrencyImage(e){let t=`${oe.baseUrl}/public/getCurrencyImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setCurrencyImage(e,URL.createObjectURL(r))},async _fetchTokenImage(e){let t=`${oe.baseUrl}/public/getTokenImage/${e}`,r=await oe.getBlob({path:t,params:I._getSdkProperties()});ee.setTokenImage(e,URL.createObjectURL(r))},_filterWalletsByPlatform(e){return N.isMobile()?e?.filter(r=>r.mobile_link||r.id===nt.COINBASE||r.id===nt.PHANTOM&&s.state.activeChain==="solana"):e},async fetchProjectConfig(){return(await oe.get({path:"/appkit/v1/config",params:I._getSdkProperties()})).features},async fetchAllowedOrigins(){try{let{allowedOrigins:e}=await oe.get({path:"/projects/v1/origins",params:I._getSdkProperties()});return e}catch{return[]}},async fetchNetworkImages(){let t=s.getAllRequestedCaipNetworks()?.map(({assets:r})=>r?.imageId).filter(Boolean).filter(r=>!at.getNetworkImageById(r));t&&await Promise.allSettled(t.map(r=>I._fetchNetworkImage(r)))},async fetchConnectorImages(){let{connectors:e}=A.state,t=e.map(({imageId:r})=>r).filter(Boolean);await Promise.allSettled(t.map(r=>I._fetchConnectorImage(r)))},async fetchCurrencyImages(e=[]){await Promise.allSettled(e.map(t=>I._fetchCurrencyImage(t)))},async fetchTokenImages(e=[]){await Promise.allSettled(e.map(t=>I._fetchTokenImage(t)))},async fetchWallets(e){let t=e.exclude??[];I._getSdkProperties().sv.startsWith("html-core-")&&t.push(...Object.values(nt));let o=await oe.get({path:"/getWallets",params:{...I._getSdkProperties(),...e,page:String(e.page),entries:String(e.entries),include:e.include?.join(","),exclude:t.join(",")}});return{data:I._filterWalletsByPlatform(o?.data)||[],count:o?.count}},async fetchFeaturedWallets(){let{featuredWalletIds:e}=v.state;if(e?.length){let t={...I._getSdkProperties(),page:1,entries:e?.length??kt,include:e},{data:r}=await I.fetchWallets(t),o=[...r].sort((a,d)=>e.indexOf(a.id)-e.indexOf(d.id)),n=o.map(a=>a.image_id).filter(Boolean);await Promise.allSettled(n.map(a=>I._fetchWalletImage(a))),P.featured=o,P.allFeatured=o}},async fetchRecommendedWallets(){try{P.isFetchingRecommendedWallets=!0;let{includeWalletIds:e,excludeWalletIds:t,featuredWalletIds:r}=v.state,o=[...t??[],...r??[]].filter(Boolean),n=s.getRequestedCaipNetworkIds().join(","),a={page:1,entries:kt,include:e,exclude:o,chains:n},{data:d,count:f}=await I.fetchWallets(a),h=E.getRecentWallets(),$=d.map(J=>J.image_id).filter(Boolean),U=h.map(J=>J.image_id).filter(Boolean);await Promise.allSettled([...$,...U].map(J=>I._fetchWalletImage(J))),P.recommended=d,P.allRecommended=d,P.count=f??0}catch{}finally{P.isFetchingRecommendedWallets=!1}},async fetchWalletsByPage({page:e}){let{includeWalletIds:t,excludeWalletIds:r,featuredWalletIds:o}=v.state,n=s.getRequestedCaipNetworkIds().join(","),a=[...P.recommended.map(({id:U})=>U),...r??[],...o??[]].filter(Boolean),d={page:e,entries:sr,include:t,exclude:a,chains:n},{data:f,count:h}=await I.fetchWallets(d),$=f.slice(0,ir).map(U=>U.image_id).filter(Boolean);await Promise.allSettled($.map(U=>I._fetchWalletImage(U))),P.wallets=N.uniqueBy([...P.wallets,...I._filterOutExtensions(f)],"id").filter(U=>U.chains?.some(J=>n.includes(J))),P.count=h>P.count?h:P.count,P.page=e},async initializeExcludedWallets({ids:e}){let t={page:1,entries:e.length,include:e},{data:r}=await I.fetchWallets(t);r&&r.forEach(o=>{P.excludedWallets.push({rdns:o.rdns,name:o.name})})},async searchWallet({search:e,badge:t}){let{includeWalletIds:r,excludeWalletIds:o}=v.state,n=s.getRequestedCaipNetworkIds().join(",");P.search=[];let a={page:1,entries:100,search:e?.trim(),badge_type:t,include:r,exclude:o,chains:n},{data:d}=await I.fetchWallets(a);B.sendEvent({type:"track",event:"SEARCH_WALLET",properties:{badge:t??"",search:e??""}});let f=d.map(h=>h.image_id).filter(Boolean);await Promise.allSettled([...f.map(h=>I._fetchWalletImage(h)),N.wait(300)]),P.search=I._filterOutExtensions(d)},initPromise(e,t){let r=P.promises[e];return r||(P.promises[e]=t())},prefetch({fetchConnectorImages:e=!0,fetchFeaturedWallets:t=!0,fetchRecommendedWallets:r=!0,fetchNetworkImages:o=!0}={}){let n=[e&&I.initPromise("connectorImages",I.fetchConnectorImages),t&&I.initPromise("featuredWallets",I.fetchFeaturedWallets),r&&I.initPromise("recommendedWallets",I.fetchRecommendedWallets),o&&I.initPromise("networkImages",I.fetchNetworkImages)].filter(Boolean);return Promise.allSettled(n)},prefetchAnalyticsConfig(){v.state.features?.analytics&&I.fetchAnalyticsConfig()},async fetchAnalyticsConfig(){try{let{isAnalyticsEnabled:e}=await oe.get({path:"/getAnalyticsConfig",params:I._getSdkProperties()});v.setFeatures({analytics:e})}catch{v.setFeatures({analytics:!1})}},filterByNamespaces(e){if(!e?.length){P.featured=P.allFeatured,P.recommended=P.allRecommended;return}let t=s.getRequestedCaipNetworkIds().join(",");P.featured=P.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),P.recommended=P.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o))),P.filteredWallets=P.wallets.filter(r=>r.chains?.some(o=>t.includes(o)))},clearFilterByNamespaces(){P.filteredWallets=[]},setFilterByNamespace(e){if(!e){P.featured=P.allFeatured,P.recommended=P.allRecommended;return}let t=s.getRequestedCaipNetworkIds().join(",");P.featured=P.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),P.recommended=P.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o))),P.filteredWallets=P.wallets.filter(r=>r.chains?.some(o=>t.includes(o)))}};var cr={eip155:"ba0ba0cd-17c6-4806-ad93-f9d174f17900",solana:"a1b58899-f671-4276-6a5e-56ca5bd59700",polkadot:"",bip122:"0b4838db-0161-4ffe-022d-532bf03dba00",cosmos:""},st=k({networkImagePromises:{}}),at={async fetchWalletImage(e){if(e)return await I._fetchWalletImage(e),this.getWalletImageById(e)},async fetchNetworkImage(e){if(!e)return;let t=this.getNetworkImageById(e);return t||(st.networkImagePromises[e]||(st.networkImagePromises[e]=I._fetchNetworkImage(e)),await st.networkImagePromises[e],this.getNetworkImageById(e))},getWalletImageById(e){if(e)return ee.state.walletImages[e]},getWalletImage(e){if(e?.image_url)return e?.image_url;if(e?.image_id)return ee.state.walletImages[e.image_id]},getNetworkImage(e){if(e?.assets?.imageUrl)return e?.assets?.imageUrl;if(e?.assets?.imageId)return ee.state.networkImages[e.assets.imageId]},getNetworkImageById(e){if(e)return ee.state.networkImages[e]},getConnectorImage(e){if(e?.imageUrl)return e.imageUrl;if(e?.imageId)return ee.state.connectorImages[e.imageId]},getChainImage(e){return ee.state.networkImages[cr[e]]}};c();u();l();var We={id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},it={id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},lr={providers:tt,selectedProvider:null,error:null,purchaseCurrency:We,paymentCurrency:it,purchaseCurrencies:[We],paymentCurrencies:[],quotesLoading:!1},M=k(lr),ur={state:M,subscribe(e){return W(M,()=>e(M))},subscribeKey(e,t){return O(M,e,t)},setSelectedProvider(e){if(e&&e.name==="meld"){let t=s.state.activeChain===F.CHAIN.SOLANA?"SOL":"USDC",r=x.state.address??"",o=new URL(e.url);o.searchParams.append("publicKey",ht),o.searchParams.append("destinationCurrencyCode",t),o.searchParams.append("walletAddress",r),o.searchParams.append("externalCustomerId",v.state.projectId),M.selectedProvider={...e,url:o.toString()}}else M.selectedProvider=e},setOnrampProviders(e){if(Array.isArray(e)&&e.every(t=>typeof t=="string")){let t=e,r=tt.filter(o=>t.includes(o.name));M.providers=r}else M.providers=[]},setPurchaseCurrency(e){M.purchaseCurrency=e},setPaymentCurrency(e){M.paymentCurrency=e},setPurchaseAmount(e){ct.state.purchaseAmount=e},setPaymentAmount(e){ct.state.paymentAmount=e},async getAvailableCurrencies(){let e=await g.getOnrampOptions();M.purchaseCurrencies=e.purchaseCurrencies,M.paymentCurrencies=e.paymentCurrencies,M.paymentCurrency=e.paymentCurrencies[0]||it,M.purchaseCurrency=e.purchaseCurrencies[0]||We,await I.fetchCurrencyImages(e.paymentCurrencies.map(t=>t.id)),await I.fetchTokenImages(e.purchaseCurrencies.map(t=>t.symbol))},async getQuote(){M.quotesLoading=!0;try{let e=await g.getOnrampQuote({purchaseCurrency:M.purchaseCurrency,paymentCurrency:M.paymentCurrency,amount:M.paymentAmount?.toString()||"0",network:M.purchaseCurrency?.symbol});return M.quotesLoading=!1,M.purchaseAmount=Number(e?.purchaseAmount.amount),e}catch(e){return M.error=e.message,M.quotesLoading=!1,null}finally{M.quotesLoading=!1}},resetState(){M.selectedProvider=null,M.error=null,M.purchaseCurrency=We,M.paymentCurrency=it,M.purchaseCurrencies=[We],M.paymentCurrencies=[],M.paymentAmount=void 0,M.purchaseAmount=void 0,M.quotesLoading=!1}},ct=K(ur);c();u();l();c();u();l();var Ye={async getTokenList(){let e=s.state.activeCaipNetwork;return(await g.fetchSwapTokens({chainId:e?.caipNetworkId}))?.tokens?.map(o=>({...o,eip2612:!1,quantity:{decimals:"0",numeric:"0"},price:0,value:0}))||[]},async fetchGasPrice(){let e=s.state.activeCaipNetwork;if(!e)return null;try{switch(e.chainNamespace){case"solana":let t=(await S?.estimateGas({chainNamespace:"solana"}))?.toString();return{standard:t,fast:t,instant:t};case"eip155":default:return await g.fetchGasPrice({chainId:e.caipNetworkId})}}catch{return null}},async fetchSwapAllowance({tokenAddress:e,userAddress:t,sourceTokenAmount:r,sourceTokenDecimals:o}){let n=await g.fetchSwapAllowance({tokenAddress:e,userAddress:t});if(n?.allowance&&r&&o){let a=S.parseUnits(r,o)||0;return BigInt(n.allowance)>=a}return!1},async getMyTokensWithBalance(e){let t=x.state.address,r=s.state.activeCaipNetwork;if(!t||!r)return[];let n=(await g.getBalance(t,r.caipNetworkId,e)).balances.filter(a=>a.quantity.decimals!=="0");return x.setTokenBalance(n,s.state.activeChain),this.mapBalancesToSwapTokens(n)},mapBalancesToSwapTokens(e){return e?.map(t=>({...t,address:t?.address?t.address:s.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}};c();u();l();var Ce={getGasPriceInEther(e,t){let r=t*e;return Number(r)/1e18},getGasPriceInUSD(e,t,r){let o=Ce.getGasPriceInEther(t,r);return H.bigNumber(e).times(o).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:r,toTokenAmount:o}){let n=H.bigNumber(e).times(t),a=H.bigNumber(o).times(r);return n.minus(a).div(n).times(100).toNumber()},getMaxSlippage(e,t){let r=H.bigNumber(e).div(100);return H.multiply(t,r).toNumber()},getProviderFee(e,t=.0085){return H.bigNumber(e).times(t).toString()},isInsufficientNetworkTokenForGas(e,t){let r=t||"0";return H.bigNumber(e).eq(0)?!0:H.bigNumber(H.bigNumber(r)).gt(e)},isInsufficientSourceTokenForSwap(e,t,r){let o=r?.find(a=>a.address===t)?.quantity?.numeric;return H.bigNumber(o||"0").lt(e)},getToTokenAmount({sourceToken:e,toToken:t,sourceTokenPrice:r,toTokenPrice:o,sourceTokenAmount:n}){if(n==="0"||!e||!t)return"0";let a=e.decimals,d=r,f=t.decimals,h=o;if(h<=0)return"0";let $=H.bigNumber(n).times(.0085),J=H.bigNumber(n).minus($).times(H.bigNumber(10).pow(a)),Se=H.bigNumber(d).div(h),Ve=a-f;return J.times(Se).div(H.bigNumber(10).pow(Ve)).div(H.bigNumber(10).pow(f)).toFixed(f).toString()}};var It=15e4,dr=6;var Z={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:X.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},i=k(Z),qe={state:i,subscribe(e){return W(i,()=>e(i))},subscribeKey(e,t){return O(i,e,t)},getParams(){let e=s.state.activeCaipAddress,t=s.state.activeChain,r=N.getPlainAddress(e),o=s.getActiveNetworkTokenAddress(),n=A.getConnectorId(t);if(!r)throw new Error("No address found to swap the tokens from.");let a=!i.toToken?.address||!i.toToken?.decimals,d=!i.sourceToken?.address||!i.sourceToken?.decimals||!H.bigNumber(i.sourceTokenAmount).gt(0),f=!i.sourceTokenAmount;return{networkAddress:o,fromAddress:r,fromCaipAddress:e,sourceTokenAddress:i.sourceToken?.address,toTokenAddress:i.toToken?.address,toTokenAmount:i.toTokenAmount,toTokenDecimals:i.toToken?.decimals,sourceTokenAmount:i.sourceTokenAmount,sourceTokenDecimals:i.sourceToken?.decimals,invalidToToken:a,invalidSourceToken:d,invalidSourceTokenAmount:f,availableToSwap:e&&!a&&!d&&!f,isAuthConnector:n===F.CONNECTOR_ID.AUTH}},setSourceToken(e){if(!e){i.sourceToken=e,i.sourceTokenAmount="",i.sourceTokenPriceInUSD=0;return}i.sourceToken=e,_.setTokenPrice(e.address,"sourceToken")},setSourceTokenAmount(e){i.sourceTokenAmount=e},setToToken(e){if(!e){i.toToken=e,i.toTokenAmount="",i.toTokenPriceInUSD=0;return}i.toToken=e,_.setTokenPrice(e.address,"toToken")},setToTokenAmount(e){i.toTokenAmount=e?H.formatNumberToLocalString(e,dr):""},async setTokenPrice(e,t){let r=i.tokensPriceMap[e]||0;r||(i.loadingPrices=!0,r=await _.getAddressPrice(e)),t==="sourceToken"?i.sourceTokenPriceInUSD=r:t==="toToken"&&(i.toTokenPriceInUSD=r),i.loadingPrices&&(i.loadingPrices=!1),_.getParams().availableToSwap&&_.swapTokens()},switchTokens(){if(i.initializing||!i.initialized)return;let e=i.toToken?{...i.toToken}:void 0,t=i.sourceToken?{...i.sourceToken}:void 0,r=e&&i.toTokenAmount===""?"1":i.toTokenAmount;_.setSourceToken(e),_.setToToken(t),_.setSourceTokenAmount(r),_.setToTokenAmount(""),_.swapTokens()},resetState(){i.myTokensWithBalance=Z.myTokensWithBalance,i.tokensPriceMap=Z.tokensPriceMap,i.initialized=Z.initialized,i.sourceToken=Z.sourceToken,i.sourceTokenAmount=Z.sourceTokenAmount,i.sourceTokenPriceInUSD=Z.sourceTokenPriceInUSD,i.toToken=Z.toToken,i.toTokenAmount=Z.toTokenAmount,i.toTokenPriceInUSD=Z.toTokenPriceInUSD,i.networkPrice=Z.networkPrice,i.networkTokenSymbol=Z.networkTokenSymbol,i.networkBalanceInUSD=Z.networkBalanceInUSD,i.inputError=Z.inputError,i.myTokensWithBalance=Z.myTokensWithBalance},resetValues(){let{networkAddress:e}=_.getParams(),t=i.tokens?.find(r=>r.address===e);_.setSourceToken(t),_.setToToken(void 0)},getApprovalLoadingState(){return i.loadingApprovalTransaction},clearError(){i.transactionError=void 0},async initializeState(){if(!i.initializing){if(i.initializing=!0,!i.initialized)try{await _.fetchTokens(),i.initialized=!0}catch{i.initialized=!1,G.showError("Failed to initialize swap"),T.goBack()}i.initializing=!1}},async fetchTokens(){let{networkAddress:e}=_.getParams();await _.getTokenList(),await _.getNetworkTokenPrice(),await _.getMyTokensWithBalance();let t=i.tokens?.find(r=>r.address===e);t&&(i.networkTokenSymbol=t.symbol,_.setSourceToken(t),_.setSourceTokenAmount("1"))},async getTokenList(){let e=await Ye.getTokenList();i.tokens=e,i.popularTokens=e.sort((t,r)=>t.symbol<r.symbol?-1:t.symbol>r.symbol?1:0),i.suggestedTokens=e.filter(t=>!!X.SWAP_SUGGESTED_TOKENS.includes(t.symbol),{})},async getAddressPrice(e){let t=i.tokensPriceMap[e];if(t)return t;let o=(await g.fetchTokenPrice({addresses:[e]}))?.fungibles||[],a=[...i.tokens||[],...i.myTokensWithBalance||[]]?.find(h=>h.address===e)?.symbol,d=o.find(h=>h.symbol.toLowerCase()===a?.toLowerCase())?.price||0,f=parseFloat(d.toString());return i.tokensPriceMap[e]=f,f},async getNetworkTokenPrice(){let{networkAddress:e}=_.getParams(),r=(await g.fetchTokenPrice({addresses:[e]}).catch(()=>(G.showError("Failed to fetch network token price"),{fungibles:[]}))).fungibles?.[0],o=r?.price.toString()||"0";i.tokensPriceMap[e]=parseFloat(o),i.networkTokenSymbol=r?.symbol||"",i.networkPrice=o},async getMyTokensWithBalance(e){let t=await Oe.getMyTokensWithBalance(e),r=Oe.mapBalancesToSwapTokens(t);r&&(await _.getInitialGasPrice(),_.setBalances(r))},setBalances(e){let{networkAddress:t}=_.getParams(),r=s.state.activeCaipNetwork;if(!r)return;let o=e.find(n=>n.address===t);e.forEach(n=>{i.tokensPriceMap[n.address]=n.price||0}),i.myTokensWithBalance=e.filter(n=>n.address.startsWith(r.caipNetworkId)),i.networkBalanceInUSD=o?H.multiply(o.quantity.numeric,o.price).toString():"0"},async getInitialGasPrice(){let e=await Ye.fetchGasPrice();if(!e)return{gasPrice:null,gasPriceInUSD:null};switch(s.state?.activeCaipNetwork?.chainNamespace){case"solana":return i.gasFee=e.standard??"0",i.gasPriceInUSD=H.multiply(e.standard,i.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(i.gasFee),gasPriceInUSD:Number(i.gasPriceInUSD)};case"eip155":default:let t=e.standard??"0",r=BigInt(t),o=BigInt(It),n=Ce.getGasPriceInUSD(i.networkPrice,o,r);return i.gasFee=t,i.gasPriceInUSD=n,{gasPrice:r,gasPriceInUSD:n}}},async swapTokens(){let e=x.state.address,t=i.sourceToken,r=i.toToken,o=H.bigNumber(i.sourceTokenAmount).gt(0);if(o||_.setToTokenAmount(""),!r||!t||i.loadingPrices||!o)return;i.loadingQuote=!0;let n=H.bigNumber(i.sourceTokenAmount).times(10**t.decimals).round(0);try{let a=await g.fetchSwapQuote({userAddress:e,from:t.address,to:r.address,gasPrice:i.gasFee,amount:n.toString()});i.loadingQuote=!1;let d=a?.quotes?.[0]?.toAmount;if(!d){Le.open({shortMessage:"Incorrect amount",longMessage:"Please enter a valid amount"},"error");return}let f=H.bigNumber(d).div(10**r.decimals).toString();_.setToTokenAmount(f),_.hasInsufficientToken(i.sourceTokenAmount,t.address)?i.inputError="Insufficient balance":(i.inputError=void 0,_.setTransactionDetails())}catch{i.loadingQuote=!1,i.inputError="Insufficient balance"}},async getTransaction(){let{fromCaipAddress:e,availableToSwap:t}=_.getParams(),r=i.sourceToken,o=i.toToken;if(!(!e||!t||!r||!o||i.loadingQuote))try{i.loadingBuildTransaction=!0;let n=await Ye.fetchSwapAllowance({userAddress:e,tokenAddress:r.address,sourceTokenAmount:i.sourceTokenAmount,sourceTokenDecimals:r.decimals}),a;return n?a=await _.createSwapTransaction():a=await _.createAllowanceTransaction(),i.loadingBuildTransaction=!1,i.fetchError=!1,a}catch{T.goBack(),G.showError("Failed to check allowance"),i.loadingBuildTransaction=!1,i.approvalTransaction=void 0,i.swapTransaction=void 0,i.fetchError=!0;return}},async createAllowanceTransaction(){let{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:r}=_.getParams();if(!(!e||!r)){if(!t)throw new Error("createAllowanceTransaction - No source token address found.");try{let o=await g.generateApproveCalldata({from:t,to:r,userAddress:e}),n={data:o.tx.data,to:N.getPlainAddress(o.tx.from),gasPrice:BigInt(o.tx.eip155.gasPrice),value:BigInt(o.tx.value),toAmount:i.toTokenAmount};return i.swapTransaction=void 0,i.approvalTransaction={data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount},{data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount}}catch{T.goBack(),G.showError("Failed to create approval transaction"),i.approvalTransaction=void 0,i.swapTransaction=void 0,i.fetchError=!0;return}}},async createSwapTransaction(){let{networkAddress:e,fromCaipAddress:t,sourceTokenAmount:r}=_.getParams(),o=i.sourceToken,n=i.toToken;if(!t||!r||!o||!n)return;let a=S.parseUnits(r,o.decimals)?.toString();try{let d=await g.generateSwapCalldata({userAddress:t,from:o.address,to:n.address,amount:a,disableEstimate:!0}),f=o.address===e,h=BigInt(d.tx.eip155.gas),$=BigInt(d.tx.eip155.gasPrice),U={data:d.tx.data,to:N.getPlainAddress(d.tx.to),gas:h,gasPrice:$,value:BigInt(f?a??"0":"0"),toAmount:i.toTokenAmount};return i.gasPriceInUSD=Ce.getGasPriceInUSD(i.networkPrice,h,$),i.approvalTransaction=void 0,i.swapTransaction=U,U}catch{T.goBack(),G.showError("Failed to create transaction"),i.approvalTransaction=void 0,i.swapTransaction=void 0,i.fetchError=!0;return}},async sendTransactionForApproval(e){let{fromAddress:t,isAuthConnector:r}=_.getParams();i.loadingApprovalTransaction=!0;let o="Approve limit increase in your wallet";r?T.pushTransactionStack({onSuccess(){G.showLoading(o)}}):G.showLoading(o);try{await S.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:"eip155"}),await _.swapTokens(),await _.getTransaction(),i.approvalTransaction=void 0,i.loadingApprovalTransaction=!1}catch(n){let a=n;i.transactionError=a?.shortMessage,i.loadingApprovalTransaction=!1,G.showError(a?.shortMessage||"Transaction error"),B.sendEvent({type:"track",event:"SWAP_APPROVAL_ERROR",properties:{message:a?.shortMessage||a?.message||"Unknown",network:s.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:_.state.sourceToken?.symbol||"",swapToToken:_.state.toToken?.symbol||"",swapFromAmount:_.state.sourceTokenAmount||"",swapToAmount:_.state.toTokenAmount||"",isSmartAccount:x.state.preferredAccountTypes?.eip155===ae.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){if(!e)return;let{fromAddress:t,toTokenAmount:r,isAuthConnector:o}=_.getParams();i.loadingTransaction=!0;let n=`Swapping ${i.sourceToken?.symbol} to ${H.formatNumberToLocalString(r,3)} ${i.toToken?.symbol}`,a=`Swapped ${i.sourceToken?.symbol} to ${H.formatNumberToLocalString(r,3)} ${i.toToken?.symbol}`;o?T.pushTransactionStack({onSuccess(){T.replace("Account"),G.showLoading(n),qe.resetState()}}):G.showLoading("Confirm transaction in your wallet");try{let d=[i.sourceToken?.address,i.toToken?.address].join(","),f=await S.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:"eip155"});return i.loadingTransaction=!1,G.showSuccess(a),B.sendEvent({type:"track",event:"SWAP_SUCCESS",properties:{network:s.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:_.state.sourceToken?.symbol||"",swapToToken:_.state.toToken?.symbol||"",swapFromAmount:_.state.sourceTokenAmount||"",swapToAmount:_.state.toTokenAmount||"",isSmartAccount:x.state.preferredAccountTypes?.eip155===ae.ACCOUNT_TYPES.SMART_ACCOUNT}}),qe.resetState(),o||T.replace("Account"),qe.getMyTokensWithBalance(d),f}catch(d){let f=d;i.transactionError=f?.shortMessage,i.loadingTransaction=!1,G.showError(f?.shortMessage||"Transaction error"),B.sendEvent({type:"track",event:"SWAP_ERROR",properties:{message:f?.shortMessage||f?.message||"Unknown",network:s.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:_.state.sourceToken?.symbol||"",swapToToken:_.state.toToken?.symbol||"",swapFromAmount:_.state.sourceTokenAmount||"",swapToAmount:_.state.toTokenAmount||"",isSmartAccount:x.state.preferredAccountTypes?.eip155===ae.ACCOUNT_TYPES.SMART_ACCOUNT}});return}},hasInsufficientToken(e,t){return Ce.isInsufficientSourceTokenForSwap(e,t,i.myTokensWithBalance)},setTransactionDetails(){let{toTokenAddress:e,toTokenDecimals:t}=_.getParams();!e||!t||(i.gasPriceInUSD=Ce.getGasPriceInUSD(i.networkPrice,BigInt(i.gasFee),BigInt(It)),i.priceImpact=Ce.getPriceImpact({sourceTokenAmount:i.sourceTokenAmount,sourceTokenPriceInUSD:i.sourceTokenPriceInUSD,toTokenPriceInUSD:i.toTokenPriceInUSD,toTokenAmount:i.toTokenAmount}),i.maxSlippage=Ce.getMaxSlippage(i.slippage,i.toTokenAmount),i.providerFee=Ce.getProviderFee(i.sourceTokenAmount))}},_=K(qe);c();u();l();var de=k({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),pr={state:de,subscribe(e){return W(de,()=>e(de))},subscribeKey(e,t){return O(de,e,t)},showTooltip({message:e,triggerRect:t,variant:r}){de.open=!0,de.message=e,de.triggerRect=t,de.variant=r},hide(){de.open=!1,de.message="",de.triggerRect={width:0,height:0,top:0,left:0}}},mr=K(pr);c();u();l();c();u();l();var yt={convertEVMChainIdToCoinType(e){if(e>=2147483648)throw new Error("Invalid chainId");return(2147483648|e)>>>0}};var le=k({suggestions:[],loading:!1}),fr={state:le,subscribe(e){return W(le,()=>e(le))},subscribeKey(e,t){return O(le,e,t)},async resolveName(e){try{return await g.lookupEnsName(e)}catch(t){let r=t;throw new Error(r?.reasons?.[0]?.description||"Error resolving name")}},async isNameRegistered(e){try{return await g.lookupEnsName(e),!0}catch{return!1}},async getSuggestions(e){try{le.loading=!0,le.suggestions=[];let t=await g.getEnsNameSuggestions(e);return le.suggestions=t.suggestions.map(r=>({...r,name:r.name}))||[],le.suggestions}catch(t){let r=Xe.parseEnsApiError(t,"Error fetching name suggestions");throw new Error(r)}finally{le.loading=!1}},async getNamesForAddress(e){try{if(!s.state.activeCaipNetwork)return[];let r=E.getEnsFromCacheForAddress(e);if(r)return r;let o=await g.reverseLookupEnsName({address:e});return E.updateEnsCache({address:e,ens:o,timestamp:Date.now()}),o}catch(t){let r=Xe.parseEnsApiError(t,"Error fetching names for address");throw new Error(r)}},async registerName(e){let t=s.state.activeCaipNetwork;if(!t)throw new Error("Network not found");let r=x.state.address,o=A.getAuthConnector();if(!r||!o)throw new Error("Address or auth connector not found");le.loading=!0;try{let n=JSON.stringify({name:e,attributes:{},timestamp:Math.floor(Date.now()/1e3)});T.pushTransactionStack({onCancel(){T.replace("RegisterAccountName")}});let a=await S.signMessage(n);le.loading=!1;let d=t.id;if(!d)throw new Error("Network not found");let f=yt.convertEVMChainIdToCoinType(Number(d));await g.registerEnsName({coinType:f,address:r,signature:a,message:n}),x.setProfileName(e,t.chainNamespace),T.replace("RegisterAccountNameSuccess")}catch(n){let a=Xe.parseEnsApiError(n,`Error registering name ${e}`);throw T.replace("RegisterAccountName"),new Error(a)}finally{le.loading=!1}},validateName(e){return/^[a-zA-Z0-9-]{4,}$/u.test(e)},parseEnsApiError(e,t){return e?.reasons?.[0]?.description||t}},Xe=K(fr);c();u();l();var He=k({isLegalCheckboxChecked:!1}),gr={state:He,subscribe(e){return W(He,()=>e(He))},subscribeKey(e,t){return O(He,e,t)},setIsLegalCheckboxChecked(e){He.isLegalCheckboxChecked=e}};c();u();l();var wr={isUnsupportedChainView(){return T.state.view==="UnsupportedChain"||T.state.view==="SwitchNetwork"&&T.state.history.includes("UnsupportedChain")},async safeClose(){if(this.isUnsupportedChainView()){Y.shake();return}if(await Ee.isSIWXCloseDisabled()){Y.shake();return}Y.close()}};c();u();l();c();u();l();var Cr={interpolate(e,t,r){if(e.length!==2||t.length!==2)throw new Error("inputRange and outputRange must be an array of length 2");let o=e[0]||0,n=e[1]||0,a=t[0]||0,d=t[1]||0;return r<o?a:r>n?d:(d-a)/(n-o)*(r-o)+a}};c();u();l();var Ke,be,Te;function hr(e,t){Ke=document.createElement("style"),be=document.createElement("style"),Te=document.createElement("style"),Ke.textContent=De(e).core.cssText,be.textContent=De(e).dark.cssText,Te.textContent=De(e).light.cssText,document.head.appendChild(Ke),document.head.appendChild(be),document.head.appendChild(Te),vt(t)}function vt(e){be&&Te&&(e==="light"?(be.removeAttribute("media"),Te.media="enabled"):(Te.removeAttribute("media"),be.media="enabled"))}function Ar(e){Ke&&be&&Te&&(Ke.textContent=De(e).core.cssText,be.textContent=De(e).dark.cssText,Te.textContent=De(e).light.cssText)}function De(e){return{core:Ne`
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
        --w3m-color-mix-strength: ${se(e?.["--w3m-color-mix-strength"]?`${e["--w3m-color-mix-strength"]}%`:"0%")};
        --w3m-font-family: ${se(e?.["--w3m-font-family"]||"Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;")};
        --w3m-font-size-master: ${se(e?.["--w3m-font-size-master"]||"10px")};
        --w3m-border-radius-master: ${se(e?.["--w3m-border-radius-master"]||"4px")};
        --w3m-z-index: ${se(e?.["--w3m-z-index"]||999)};

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
    `,light:Ne`
      :root {
        --w3m-color-mix: ${se(e?.["--w3m-color-mix"]||"#fff")};
        --w3m-accent: ${se(ie(e,"dark")["--w3m-accent"])};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: ${se(ie(e,"dark")["--w3m-background"])};
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
    `,dark:Ne`
      :root {
        --w3m-color-mix: ${se(e?.["--w3m-color-mix"]||"#000")};
        --w3m-accent: ${se(ie(e,"light")["--w3m-accent"])};
        --w3m-default: #000;

        --wui-color-modal-bg-base: ${se(ie(e,"light")["--w3m-background"])};
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
    `}}var lp=Ne`
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
`,up=Ne`
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
`,dp=Ne`
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
`;c();u();l();var Je={getSpacingStyles(e,t){if(Array.isArray(e))return e[t]?`var(--wui-spacing-${e[t]})`:void 0;if(typeof e=="string")return`var(--wui-spacing-${e})`},getFormattedDate(e){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(e)},getHostName(e){try{return new URL(e).hostname}catch{return""}},getTruncateString({string:e,charsStart:t,charsEnd:r,truncate:o}){return e.length<=t+r?e:o==="end"?`${e.substring(0,t)}...`:o==="start"?`...${e.substring(e.length-r)}`:`${e.substring(0,Math.floor(t))}...${e.substring(e.length-Math.floor(r))}`},generateAvatarColors(e){let r=e.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),o=this.hexToRgb(r),n=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),d=100-3*Number(n?.replace("px","")),f=`${d}% ${d}% at 65% 40%`,h=[];for(let $=0;$<5;$+=1){let U=this.tintColor(o,.15*$);h.push(`rgb(${U[0]}, ${U[1]}, ${U[2]})`)}return`
    --local-color-1: ${h[0]};
    --local-color-2: ${h[1]};
    --local-color-3: ${h[2]};
    --local-color-4: ${h[3]};
    --local-color-5: ${h[4]};
    --local-radial-circle: ${f}
   `},hexToRgb(e){let t=parseInt(e,16),r=t>>16&255,o=t>>8&255,n=t&255;return[r,o,n]},tintColor(e,t){let[r,o,n]=e,a=Math.round(r+(255-r)*t),d=Math.round(o+(255-o)*t),f=Math.round(n+(255-n)*t);return[a,d,f]},isNumber(e){return{number:/^[0-9]+$/u}.number.test(e)},getColorTheme(e){return e||(typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark")},splitBalance(e){let t=e.split(".");return t.length===2?[t[0],t[1]]:["0","00"]},roundNumber(e,t,r){return e.toString().length>=t?Number(e).toFixed(r):e},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})}};c();u();l();var Er=3,br=["receive","deposit","borrow","claim"],Tr=["withdraw","repay","burn"],lt={getTransactionGroupTitle(e,t){let r=$e.getYear(),o=$e.getMonthNameByIndex(t);return e===r?o:`${o} ${e}`},getTransactionImages(e){let[t,r]=e,o=!!t&&e?.every(d=>!!d.nft_info),n=e?.length>1;return e?.length===2&&!o?[this.getTransactionImage(t),this.getTransactionImage(r)]:n?e.map(d=>this.getTransactionImage(d)):[this.getTransactionImage(t)]},getTransactionImage(e){return{type:lt.getTransactionTransferTokenType(e),url:lt.getTransactionImageURL(e)}},getTransactionImageURL(e){let t,r=!!e?.nft_info,o=!!e?.fungible_info;return e&&r?t=e?.nft_info?.content?.preview?.url:e&&o&&(t=e?.fungible_info?.icon?.url),t},getTransactionTransferTokenType(e){if(e?.fungible_info)return"FUNGIBLE";if(e?.nft_info)return"NFT"},getTransactionDescriptions(e){let t=e?.metadata?.operationType,r=e?.transfers,o=e?.transfers?.length>0,n=e?.transfers?.length>1,a=o&&r?.every(J=>!!J?.fungible_info),[d,f]=r,h=this.getTransferDescription(d),$=this.getTransferDescription(f);if(!o)return(t==="send"||t==="receive")&&a?(h=Je.getTruncateString({string:e?.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),$=Je.getTruncateString({string:e?.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[h,$]):[e.metadata.status];if(n)return r.map(J=>this.getTransferDescription(J));let U="";return br.includes(t)?U="+":Tr.includes(t)&&(U="-"),h=U.concat(h),[h]},getTransferDescription(e){let t="";return e&&(e?.nft_info?t=e?.nft_info?.name||"-":e?.fungible_info&&(t=this.getFungibleTransferDescription(e)||"-")),t},getFungibleTransferDescription(e){return e?[this.getQuantityFixedValue(e?.quantity.numeric),e?.fungible_info?.symbol].join(" ").trim():null},getQuantityFixedValue(e){return e?parseFloat(e).toFixed(Er):null}};c();u();l();function Sr(e,t){let{kind:r,elements:o}=t;return{kind:r,elements:o,finisher(n){customElements.get(e)||customElements.define(e,n)}}}function Nr(e,t){return customElements.get(e)||customElements.define(e,t),t}function _r(e){return function(r){return typeof r=="function"?Nr(e,r):Sr(e,r)}}c();u();l();export{$e as a,F as b,Qe as c,H as d,Bt as e,Ze as f,Mt as g,Lt as h,ie as i,X as j,E as k,N as l,v as m,ee as n,at as o,Le as p,B as q,I as r,T as s,Pe as t,A as u,Pa as v,Oa as w,Da as x,Ma as y,ae as z,G as A,Ee as B,ye as C,S as D,ge as E,D as F,s as G,g as H,x as I,Y as J,ct as K,_ as L,mr as M,Xe as N,gr as O,wr as P,Cr as Q,hr as R,vt as S,Ar as T,lp as U,up as V,dp as W,Je as X,lt as Y,_r as Z};
