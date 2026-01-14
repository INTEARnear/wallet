import{b as U}from"./chunk-6T7Q26JY.js";import{a as A}from"./chunk-B2LU4KHT.js";import{p as Te,q as He,r as k,v as me,w as Qe,x as Ve,z as v}from"./chunk-RZQOM5QR.js";import{a as C,b as g,f as he}from"./chunk-IDZGCU4F.js";import{b as je,e as m,k as N}from"./chunk-ZS2R6O6N.js";import{B as D,G as Ye,H as de,I as W,N as $,O as re,S as te,U as L,W as Ie,aa as B,ba as Ge,da as Ke,ga as b,ia as X,j as F,l as I,n as ze,q as S}from"./chunk-OXOEMY67.js";import{i as u,k as p,o as d}from"./chunk-JY5TIRRF.js";u();d();p();u();d();p();u();d();p();u();d();p();u();d();p();var Xe=k`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    padding: ${({spacing:e})=>e[1]};
  }

  /* -- Colors --------------------------------------------------- */
  button[data-type='accent'] wui-icon {
    color: ${({tokens:e})=>e.core.iconAccentPrimary};
  }

  button[data-type='neutral'][data-variant='primary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
  }

  button[data-type='neutral'][data-variant='secondary'] wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button[data-type='success'] wui-icon {
    color: ${({tokens:e})=>e.core.iconSuccess};
  }

  button[data-type='error'] wui-icon {
    color: ${({tokens:e})=>e.core.iconError};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='xs'] {
    width: 16px;
    height: 16px;

    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='sm'] {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  button[data-size='md'] {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='lg'] {
    width: 28px;
    height: 28px;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  button[data-size='xs'] wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] wui-icon {
    width: 20px;
    height: 20px;
  }

  /* -- Hover --------------------------------------------------- */
  @media (hover: hover) {
    button[data-type='accent']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.foregroundAccent010};
    }

    button[data-variant='primary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-variant='secondary'][data-type='neutral']:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }

    button[data-type='success']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    }

    button[data-type='error']:hover:enabled {
      background-color: ${({tokens:e})=>e.core.backgroundError};
    }
  }

  /* -- Focus --------------------------------------------------- */
  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  /* -- Properties --------------------------------------------------- */
  button[data-full-width='true'] {
    width: 100%;
  }

  :host([fullWidth]) {
    width: 100%;
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var J=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},G=class extends N{constructor(){super(...arguments),this.icon="card",this.variant="primary",this.type="accent",this.size="md",this.iconSize=void 0,this.fullWidth=!1,this.disabled=!1}render(){return m`<button
      data-variant=${this.variant}
      data-type=${this.type}
      data-size=${this.size}
      data-full-width=${this.fullWidth}
      ?disabled=${this.disabled}
    >
      <wui-icon color="inherit" name=${this.icon} size=${A(this.iconSize)}></wui-icon>
    </button>`}};G.styles=[me,Qe,Xe];J([C()],G.prototype,"icon",void 0);J([C()],G.prototype,"variant",void 0);J([C()],G.prototype,"type",void 0);J([C()],G.prototype,"size",void 0);J([C()],G.prototype,"iconSize",void 0);J([C({type:Boolean})],G.prototype,"fullWidth",void 0);J([C({type:Boolean})],G.prototype,"disabled",void 0);G=J([v("wui-icon-button")],G);u();d();p();u();d();p();u();d();p();var On=Symbol(),Ut=Symbol();var Je=Object.getPrototypeOf,Ze=new WeakMap,$t=e=>e&&(Ze.has(e)?Ze.get(e):Je(e)===Object.prototype||Je(e)===Array.prototype);var et=e=>$t(e)&&e[Ut]||null;var Ne=e=>typeof e=="object"&&e!==null,Dt=e=>Ne(e)&&!ve.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer)&&!(e instanceof Promise);var Lt=(e,t,n,r)=>({deleteProperty(o,s){let a=Reflect.get(o,s);n(s);let l=Reflect.deleteProperty(o,s);return l&&r(["delete",[s],a]),l},set(o,s,a,l){let E=!e()&&Reflect.has(o,s),M=Reflect.get(o,s,l);if(E&&(tt(M,a)||ce.has(a)&&tt(M,ce.get(a))))return!0;n(s),Ne(a)&&(a=et(a)||a);let q=!ae.has(a)&&Ft(a)?ge(a):a;return t(s,q),Reflect.set(o,s,q,l),r(["set",[s],a,M]),!0}}),ae=new WeakMap,ve=new WeakSet,Mt=new WeakMap,fe=[1],ce=new WeakMap,tt=Object.is,qt=(e,t)=>new Proxy(e,t),Ft=Dt;var Bt=Lt;function ge(e={}){if(!Ne(e))throw new Error("object required");let t=ce.get(e);if(t)return t;let n=fe[0],r=new Set,o=(P,O=++fe[0])=>{n!==O&&(s=n=O,r.forEach(T=>T(P,O)))},s=n,a=(P=fe[0])=>(s!==P&&(s=P,E.forEach(([O])=>{let T=O[1](P);T>n&&(n=T)})),n),l=P=>(O,T)=>{let Y=[...O];Y[1]=[P,...Y[1]],o(Y,T)},E=new Map,M=(P,O)=>{let T=!ve.has(O)&&ae.get(O);if(T){if((import.meta.env?import.meta.env.MODE:void 0)!=="production"&&E.has(P))throw new Error("prop listener already exists");if(r.size){let Y=T[2](l(P));E.set(P,[T,Y])}else E.set(P,[T])}},q=P=>{var O;let T=E.get(P);T&&(E.delete(P),(O=T[1])==null||O.call(T))},H=P=>(r.add(P),r.size===1&&E.forEach(([T,Y],pe)=>{if((import.meta.env?import.meta.env.MODE:void 0)!=="production"&&Y)throw new Error("remove already exists");let Ot=T[2](l(pe));E.set(pe,[T,Ot])}),()=>{r.delete(P),r.size===0&&E.forEach(([T,Y],pe)=>{Y&&(Y(),E.set(pe,[T]))})}),V=!0,ie=Bt(()=>V,M,q,o),ue=qt(e,ie);ce.set(e,ue);let Rt=[e,a,H];return ae.set(ue,Rt),Reflect.ownKeys(e).forEach(P=>{let O=Object.getOwnPropertyDescriptor(e,P);"value"in O&&O.writable&&(ue[P]=e[P])}),V=!1,ue}function ye(e,t,n){let r=ae.get(e);(import.meta.env?import.meta.env.MODE:void 0)!=="production"&&!r&&console.warn("Please use proxy object");let o,s=[],a=r[2],l=!1,M=a(q=>{if(s.push(q),n){t(s.splice(0));return}o||(o=Promise.resolve().then(()=>{o=void 0,l&&t(s.splice(0))}))});return l=!0,()=>{l=!1,M()}}function Ce(){return{proxyStateMap:ae,refSet:ve,snapCache:Mt,versionHolder:fe,proxyCache:ce}}u();d();p();function nt(e,t,n,r){let o=e[t];return ye(e,()=>{let s=e[t];Object.is(o,s)||n(o=s)},r)}var Kn=Symbol();var{proxyStateMap:jn,snapCache:Hn}=Ce();var{proxyStateMap:Qn,snapCache:Vn}=Ce();u();d();p();var h={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS",UNABLE_TO_GET_TOKEN_BALANCES:"UNABLE_TO_GET_TOKEN_BALANCES",UNABLE_TO_GET_QUOTE:"UNABLE_TO_GET_QUOTE",UNABLE_TO_GET_QUOTE_STATUS:"UNABLE_TO_GET_QUOTE_STATUS",INVALID_RECIPIENT_ADDRESS_FOR_ASSET:"INVALID_RECIPIENT_ADDRESS_FOR_ASSET"},Q={[h.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[h.INVALID_RECIPIENT]:"Invalid recipient address",[h.INVALID_ASSET]:"Invalid asset specified",[h.INVALID_AMOUNT]:"Invalid payment amount",[h.INVALID_RECIPIENT_ADDRESS_FOR_ASSET]:"Invalid recipient address for the asset selected",[h.UNKNOWN_ERROR]:"Unknown payment error occurred",[h.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[h.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[h.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[h.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[h.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[h.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[h.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status",[h.UNABLE_TO_GET_TOKEN_BALANCES]:"Unable to get token balances",[h.UNABLE_TO_GET_QUOTE]:"Unable to get quote. Please choose a different token",[h.UNABLE_TO_GET_QUOTE_STATUS]:"Unable to get quote status"},f=class e extends Error{get message(){return Q[this.code]}constructor(t,n){super(Q[t]),this.name="AppKitPayError",this.code=t,this.details=n,Error.captureStackTrace&&Error.captureStackTrace(this,e)}};u();d();p();u();d();p();var rt="https://rpc.walletconnect.org/v1/json-rpc",_e="reown_test";u();d();p();function st(){let{chainNamespace:e}=S.parseCaipNetworkId(c.state.paymentAsset.network);if(!D.isAddress(c.state.recipient,e))throw new f(h.INVALID_RECIPIENT_ADDRESS_FOR_ASSET,`Provide valid recipient address for namespace "${e}"`)}async function ot(e,t,n){if(t!==F.CHAIN.EVM)throw new f(h.INVALID_CHAIN_NAMESPACE);if(!n.fromAddress)throw new f(h.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");let r=typeof n.amount=="string"?parseFloat(n.amount):n.amount;if(isNaN(r))throw new f(h.INVALID_PAYMENT_CONFIG);let o=e.metadata?.decimals??18,s=B.parseUnits(r.toString(),o);if(typeof s!="bigint")throw new f(h.GENERIC_PAYMENT_ERROR);return await B.sendTransaction({chainNamespace:t,to:n.recipient,address:n.fromAddress,value:s,data:"0x"})??void 0}async function it(e,t){if(!t.fromAddress)throw new f(h.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");let n=e.asset,r=t.recipient,o=Number(e.metadata.decimals),s=B.parseUnits(t.amount.toString(),o);if(s===void 0)throw new f(h.GENERIC_PAYMENT_ERROR);return await B.writeContract({fromAddress:t.fromAddress,tokenAddress:n,args:[r,s],method:"transfer",abi:ze.getERC20Abi(n),chainNamespace:F.CHAIN.EVM})??void 0}async function at(e,t){if(e!==F.CHAIN.SOLANA)throw new f(h.INVALID_CHAIN_NAMESPACE);if(!t.fromAddress)throw new f(h.INVALID_PAYMENT_CONFIG,"fromAddress is required for Solana payments.");let n=typeof t.amount=="string"?parseFloat(t.amount):t.amount;if(isNaN(n)||n<=0)throw new f(h.INVALID_PAYMENT_CONFIG,"Invalid payment amount.");try{if(!Ke.getProvider(e))throw new f(h.GENERIC_PAYMENT_ERROR,"No Solana provider available.");let o=await B.sendTransaction({chainNamespace:F.CHAIN.SOLANA,to:t.recipient,value:n,tokenMint:t.tokenMint});if(!o)throw new f(h.GENERIC_PAYMENT_ERROR,"Transaction failed.");return o}catch(r){throw r instanceof f?r:new f(h.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${r}`)}}async function ct({sourceToken:e,toToken:t,amount:n,recipient:r}){let o=B.parseUnits(n,e.metadata.decimals),s=B.parseUnits(n,t.metadata.decimals);return Promise.resolve({type:we,origin:{amount:o?.toString()??"0",currency:e},destination:{amount:s?.toString()??"0",currency:t},fees:[{id:"service",label:"Service Fee",amount:"0",currency:t}],steps:[{requestId:we,type:"deposit",deposit:{amount:o?.toString()??"0",currency:e.asset,receiver:r}}],timeInSeconds:6})}function le(e){if(!e)return null;let t=e.steps[0];return!t||t.type!==lt?null:t}function xe(e,t=0){if(!e)return[];let n=e.steps.filter(o=>o.type===ut),r=n.filter((o,s)=>s+1>t);return n.length>0&&n.length<3?r:[]}var Re=new Ye({baseUrl:D.getApiUrl(),clientId:null}),ke=class extends Error{};function Wt(){let e=de.getSnapshot().projectId;return`${rt}?projectId=${e}`}function Oe(){let{projectId:e,sdkType:t,sdkVersion:n}=de.state;return{projectId:e,st:t||"appkit",sv:n||"html-wagmi-4.2.2"}}async function Ue(e,t){let n=Wt(),{sdkType:r,sdkVersion:o,projectId:s}=de.getSnapshot(),a={jsonrpc:"2.0",id:1,method:e,params:{...t||{},st:r,sv:o,projectId:s}},E=await(await fetch(n,{method:"POST",body:JSON.stringify(a),headers:{"Content-Type":"application/json"}})).json();if(E.error)throw new ke(E.error.message);return E}async function $e(e){return(await Ue("reown_getExchanges",e)).result}async function De(e){return(await Ue("reown_getExchangePayUrl",e)).result}async function pt(e){return(await Ue("reown_getExchangeBuyStatus",e)).result}async function zt(e){let t=I.bigNumber(e.amount).times(10**e.toToken.metadata.decimals).toString(),{chainId:n,chainNamespace:r}=S.parseCaipNetworkId(e.sourceToken.network),{chainId:o,chainNamespace:s}=S.parseCaipNetworkId(e.toToken.network),a=e.sourceToken.asset==="native"?Ie(r):e.sourceToken.asset,l=e.toToken.asset==="native"?Ie(s):e.toToken.asset;return await Re.post({path:"/appkit/v1/transfers/quote",body:{user:e.address,originChainId:n.toString(),originCurrency:a,destinationChainId:o.toString(),destinationCurrency:l,recipient:e.recipient,amount:t},params:Oe()})}async function dt(e){let t=U.isLowerCaseMatch(e.sourceToken.network,e.toToken.network),n=U.isLowerCaseMatch(e.sourceToken.asset,e.toToken.asset);return t&&n?ct(e):zt(e)}async function mt(e){return await Re.get({path:"/appkit/v1/transfers/status",params:{requestId:e.requestId,...Oe()}})}async function ht(e){return await Re.get({path:`/appkit/v1/transfers/assets/exchanges/${e}`,params:Oe()})}u();d();p();var Yt=["eip155","solana"],Gt={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function be(e,t){let{chainNamespace:n,chainId:r}=S.parseCaipNetworkId(e),o=Gt[n];if(!o)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${n}`);let s=o.native.assetNamespace,a=o.native.assetReference;return t!=="native"&&(s=o.defaultTokenNamespace,a=t),`${`${n}:${r}`}/${s}:${a}`}function ft(e){let{chainNamespace:t}=S.parseCaipNetworkId(e);return Yt.includes(t)}function gt(e){let n=b.getAllRequestedCaipNetworks().find(o=>o.caipNetworkId===e.chainId),r=e.address;if(!n)throw new Error(`Target network not found for balance chainId "${e.chainId}"`);if(U.isLowerCaseMatch(e.symbol,n.nativeCurrency.symbol))r="native";else if(D.isCaipAddress(r)){let{address:o}=S.parseCaipAddress(r);r=o}else if(!r)throw new Error(`Balance address not found for balance symbol "${e.symbol}"`);return{network:n.caipNetworkId,asset:r,metadata:{name:e.name,symbol:e.symbol,decimals:Number(e.quantity.decimals),logoURI:e.iconUrl},amount:e.quantity.numeric}}function yt(e){return{chainId:e.network,address:`${e.network}:${e.asset}`,symbol:e.metadata.symbol,name:e.metadata.name,iconUrl:e.metadata.logoURI||"",price:0,quantity:{numeric:"0",decimals:e.metadata.decimals.toString()}}}function ne(e){let t=I.bigNumber(e,{safe:!0});return t.lt(.001)?"<0.001":t.round(4).toString()}function wt(e){let n=b.getAllRequestedCaipNetworks().find(r=>r.caipNetworkId===e.network);return n?!!n.testnet:!1}var xt=0,Le="unknown",we="direct-transfer",lt="deposit",ut="transaction",i=ge({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0,choice:"pay",tokenBalances:{[F.CHAIN.EVM]:[],[F.CHAIN.SOLANA]:[]},isFetchingTokenBalances:!1,selectedPaymentAsset:null,quote:void 0,quoteStatus:"waiting",quoteError:null,isFetchingQuote:!1,selectedExchange:void 0,exchangeUrlForQuote:void 0,requestId:void 0}),c={state:i,subscribe(e){return ye(i,()=>e(i))},subscribeKey(e,t){return nt(i,e,t)},async handleOpenPay(e){this.resetState(),this.setPaymentConfig(e),this.initializeAnalytics(),st(),await this.prepareTokenLogo(),i.isConfigured=!0,re.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:i.exchanges,configuration:{network:i.paymentAsset.network,asset:i.paymentAsset.asset,recipient:i.recipient,amount:i.amount}}}),await X.open({view:"Pay"})},resetState(){i.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},i.recipient="0x0",i.amount=0,i.isConfigured=!1,i.error=null,i.isPaymentInProgress=!1,i.isLoading=!1,i.currentPayment=void 0,i.selectedExchange=void 0,i.exchangeUrlForQuote=void 0,i.requestId=void 0},resetQuoteState(){i.quote=void 0,i.quoteStatus="waiting",i.quoteError=null,i.isFetchingQuote=!1,i.requestId=void 0},setPaymentConfig(e){if(!e.paymentAsset)throw new f(h.INVALID_PAYMENT_CONFIG);try{i.choice=e.choice??"pay",i.paymentAsset=e.paymentAsset,i.recipient=e.recipient,i.amount=e.amount,i.openInNewTab=e.openInNewTab??!0,i.redirectUrl=e.redirectUrl,i.payWithExchange=e.payWithExchange,i.error=null}catch(t){throw new f(h.INVALID_PAYMENT_CONFIG,t.message)}},setSelectedPaymentAsset(e){i.selectedPaymentAsset=e},setSelectedExchange(e){i.selectedExchange=e},setRequestId(e){i.requestId=e},setPaymentInProgress(e){i.isPaymentInProgress=e},getPaymentAsset(){return i.paymentAsset},getExchanges(){return i.exchanges},async fetchExchanges(){try{i.isLoading=!0;let e=await $e({page:xt});i.exchanges=e.exchanges.slice(0,2)}catch{throw W.showError(Q.UNABLE_TO_GET_EXCHANGES),new f(h.UNABLE_TO_GET_EXCHANGES)}finally{i.isLoading=!1}},async getAvailableExchanges(e){try{let t=e?.asset&&e?.network?be(e.network,e.asset):void 0;return await $e({page:e?.page??xt,asset:t,amount:e?.amount?.toString()})}catch{throw new f(h.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(e,t,n=!1){try{let r=Number(t.amount),o=await De({exchangeId:e,asset:be(t.network,t.asset),amount:r.toString(),recipient:`${t.network}:${t.recipient}`});return re.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{source:"pay",exchange:{id:e},configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:r},currentPayment:{type:"exchange",exchangeId:e},headless:n}}),n&&(this.initiatePayment(),re.sendEvent({type:"track",event:"PAY_INITIATED",properties:{source:"pay",paymentId:i.paymentId||Le,configuration:{network:t.network,asset:t.asset,recipient:t.recipient,amount:r},currentPayment:{type:"exchange",exchangeId:e}}})),o}catch(r){throw r instanceof Error&&r.message.includes("is not supported")?new f(h.ASSET_NOT_SUPPORTED):new Error(r.message)}},async generateExchangeUrlForQuote({exchangeId:e,paymentAsset:t,amount:n,recipient:r}){let o=await De({exchangeId:e,asset:be(t.network,t.asset),amount:n.toString(),recipient:r});i.exchangeSessionId=o.sessionId,i.exchangeUrlForQuote=o.url},async openPayUrl(e,t,n=!1){try{let r=await this.getPayUrl(e.exchangeId,t,n);if(!r)throw new f(h.UNABLE_TO_GET_PAY_URL);let s=e.openInNewTab??!0?"_blank":"_self";return D.openHref(r.url,s),r}catch(r){throw r instanceof f?i.error=r.message:i.error=Q.GENERIC_PAYMENT_ERROR,new f(h.UNABLE_TO_GET_PAY_URL)}},async onTransfer({chainNamespace:e,fromAddress:t,toAddress:n,amount:r,paymentAsset:o}){if(i.currentPayment={type:"wallet",status:"IN_PROGRESS"},!i.isPaymentInProgress)try{this.initiatePayment();let a=b.getAllRequestedCaipNetworks().find(E=>E.caipNetworkId===o.network);if(!a)throw new Error("Target network not found");let l=b.state.activeCaipNetwork;switch(U.isLowerCaseMatch(l?.caipNetworkId,a.caipNetworkId)||await b.switchActiveNetwork(a),e){case F.CHAIN.EVM:o.asset==="native"&&(i.currentPayment.result=await ot(o,e,{recipient:n,amount:r,fromAddress:t})),o.asset.startsWith("0x")&&(i.currentPayment.result=await it(o,{recipient:n,amount:r,fromAddress:t})),i.currentPayment.status="SUCCESS";break;case F.CHAIN.SOLANA:i.currentPayment.result=await at(e,{recipient:n,amount:r,fromAddress:t,tokenMint:o.asset==="native"?void 0:o.asset}),i.currentPayment.status="SUCCESS";break;default:throw new f(h.INVALID_CHAIN_NAMESPACE)}}catch(s){throw s instanceof f?i.error=s.message:i.error=Q.GENERIC_PAYMENT_ERROR,i.currentPayment.status="FAILED",W.showError(i.error),s}finally{i.isPaymentInProgress=!1}},async onSendTransaction(e){try{let{namespace:t,transactionStep:n}=e;c.initiatePayment();let o=b.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===i.paymentAsset?.network);if(!o)throw new Error("Target network not found");let s=b.state.activeCaipNetwork;if(U.isLowerCaseMatch(s?.caipNetworkId,o.caipNetworkId)||await b.switchActiveNetwork(o),t===F.CHAIN.EVM){let{from:a,to:l,data:E,value:M}=n.transaction;await B.sendTransaction({address:a,to:l,data:E,value:BigInt(M),chainNamespace:t})}else if(t===F.CHAIN.SOLANA){let{instructions:a}=n.transaction;await B.writeSolanaTransaction({instructions:a})}}catch(t){throw t instanceof f?i.error=t.message:i.error=Q.GENERIC_PAYMENT_ERROR,W.showError(i.error),t}finally{i.isPaymentInProgress=!1}},getExchangeById(e){return i.exchanges.find(t=>t.id===e)},validatePayConfig(e){let{paymentAsset:t,recipient:n,amount:r}=e;if(!t)throw new f(h.INVALID_PAYMENT_CONFIG);if(!n)throw new f(h.INVALID_RECIPIENT);if(!t.asset)throw new f(h.INVALID_ASSET);if(r==null||r<=0)throw new f(h.INVALID_AMOUNT)},async handlePayWithExchange(e){try{i.currentPayment={type:"exchange",exchangeId:e};let{network:t,asset:n}=i.paymentAsset,r={network:t,asset:n,amount:i.amount,recipient:i.recipient},o=await this.getPayUrl(e,r);if(!o)throw new f(h.UNABLE_TO_INITIATE_PAYMENT);return i.currentPayment.sessionId=o.sessionId,i.currentPayment.status="IN_PROGRESS",i.currentPayment.exchangeId=e,this.initiatePayment(),{url:o.url,openInNewTab:i.openInNewTab}}catch(t){return t instanceof f?i.error=t.message:i.error=Q.GENERIC_PAYMENT_ERROR,i.isPaymentInProgress=!1,W.showError(i.error),null}},async getBuyStatus(e,t){try{let n=await pt({sessionId:t,exchangeId:e});return(n.status==="SUCCESS"||n.status==="FAILED")&&re.sendEvent({type:"track",event:n.status==="SUCCESS"?"PAY_SUCCESS":"PAY_ERROR",properties:{message:n.status==="FAILED"?D.parseError(i.error):void 0,source:"pay",paymentId:i.paymentId||Le,configuration:{network:i.paymentAsset.network,asset:i.paymentAsset.asset,recipient:i.recipient,amount:i.amount},currentPayment:{type:"exchange",exchangeId:i.currentPayment?.exchangeId,sessionId:i.currentPayment?.sessionId,result:n.txHash}}}),n}catch{throw new f(h.UNABLE_TO_GET_BUY_STATUS)}},async fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:n}){if(!e)return[];let{address:r}=S.parseCaipAddress(e),o=t;return n===F.CHAIN.EVM&&(o=void 0),await Ge.getMyTokensWithBalance({address:r,caipNetwork:o})},async fetchTokensFromExchange(){if(!i.selectedExchange)return[];let e=await ht(i.selectedExchange.id),t=Object.values(e.assets).flat();return await Promise.all(t.map(async r=>{let o=yt(r),{chainNamespace:s}=S.parseCaipNetworkId(o.chainId),a=o.address;if(D.isCaipAddress(a)){let{address:E}=S.parseCaipAddress(a);a=E}let l=await $.getImageByToken(a??"",s).catch(()=>{});return o.iconUrl=l??"",o}))},async fetchTokens({caipAddress:e,caipNetwork:t,namespace:n}){try{i.isFetchingTokenBalances=!0;let s=await(!!i.selectedExchange?this.fetchTokensFromExchange():this.fetchTokensFromEOA({caipAddress:e,caipNetwork:t,namespace:n}));i.tokenBalances={...i.tokenBalances,[n]:s}}catch(r){let o=r instanceof Error?r.message:"Unable to get token balances";W.showError(o)}finally{i.isFetchingTokenBalances=!1}},async fetchQuote({amount:e,address:t,sourceToken:n,toToken:r,recipient:o}){try{c.resetQuoteState(),i.isFetchingQuote=!0;let s=await dt({amount:e,address:i.selectedExchange?void 0:t,sourceToken:n,toToken:r,recipient:o});if(i.selectedExchange){let a=le(s);if(a){let l=`${n.network}:${a.deposit.receiver}`,E=I.formatNumber(a.deposit.amount,{decimals:n.metadata.decimals??0,round:8});await c.generateExchangeUrlForQuote({exchangeId:i.selectedExchange.id,paymentAsset:n,amount:E.toString(),recipient:l})}}i.quote=s}catch(s){let a=Q.UNABLE_TO_GET_QUOTE;if(s instanceof Error&&s.cause&&s.cause instanceof Response)try{let l=await s.cause.json();l.error&&typeof l.error=="string"&&(a=l.error)}catch{}throw i.quoteError=a,W.showError(a),new f(h.UNABLE_TO_GET_QUOTE)}finally{i.isFetchingQuote=!1}},async fetchQuoteStatus({requestId:e}){try{if(e===we){let n=i.selectedExchange,r=i.exchangeSessionId;if(n&&r){switch((await this.getBuyStatus(n.id,r)).status){case"IN_PROGRESS":i.quoteStatus="waiting";break;case"SUCCESS":i.quoteStatus="success",i.isPaymentInProgress=!1;break;case"FAILED":i.quoteStatus="failure",i.isPaymentInProgress=!1;break;case"UNKNOWN":i.quoteStatus="waiting";break;default:i.quoteStatus="waiting";break}return}i.quoteStatus="success";return}let{status:t}=await mt({requestId:e});i.quoteStatus=t}catch{throw i.quoteStatus="failure",new f(h.UNABLE_TO_GET_QUOTE_STATUS)}},initiatePayment(){i.isPaymentInProgress=!0,i.paymentId=crypto.randomUUID()},initializeAnalytics(){i.analyticsSet||(i.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",e=>{if(i.currentPayment?.status&&i.currentPayment.status!=="UNKNOWN"){let t={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[i.currentPayment.status];re.sendEvent({type:"track",event:t,properties:{message:i.currentPayment.status==="FAILED"?D.parseError(i.error):void 0,source:"pay",paymentId:i.paymentId||Le,configuration:{network:i.paymentAsset.network,asset:i.paymentAsset.asset,recipient:i.recipient,amount:i.amount},currentPayment:{type:i.currentPayment.type,exchangeId:i.currentPayment.exchangeId,sessionId:i.currentPayment.sessionId,result:i.currentPayment.result}}})}}))},async prepareTokenLogo(){if(!i.paymentAsset.metadata.logoURI)try{let{chainNamespace:e}=S.parseCaipNetworkId(i.paymentAsset.network),t=await $.getImageByToken(i.paymentAsset.asset,e);i.paymentAsset.metadata.logoURI=t}catch{}}};u();d();p();var bt=k`
  wui-separator {
    margin: var(--apkt-spacing-3) calc(var(--apkt-spacing-3) * -1) var(--apkt-spacing-2)
      calc(var(--apkt-spacing-3) * -1);
    width: calc(100% + var(--apkt-spacing-3) * 2);
  }

  .token-display {
    padding: var(--apkt-spacing-3) var(--apkt-spacing-3);
    border-radius: var(--apkt-borderRadius-5);
    background-color: var(--apkt-tokens-theme-backgroundPrimary);
    margin-top: var(--apkt-spacing-3);
    margin-bottom: var(--apkt-spacing-3);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--apkt-spacing-2);
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 40px;
    height: 40px;
  }

  .chain-image {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[8]};
    border-top-left-radius: ${({borderRadius:e})=>e[8]};
  }
`;var Z=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},K=class extends N{constructor(){super(),this.unsubscribe=[],this.amount=c.state.amount,this.namespace=void 0,this.paymentAsset=c.state.paymentAsset,this.activeConnectorIds=L.state.activeConnectorIds,this.caipAddress=void 0,this.exchanges=c.state.exchanges,this.isLoading=c.state.isLoading,this.initializeNamespace(),this.unsubscribe.push(c.subscribeKey("amount",t=>this.amount=t)),this.unsubscribe.push(L.subscribeKey("activeConnectorIds",t=>this.activeConnectorIds=t)),this.unsubscribe.push(c.subscribeKey("exchanges",t=>this.exchanges=t)),this.unsubscribe.push(c.subscribeKey("isLoading",t=>this.isLoading=t)),c.fetchExchanges(),c.setSelectedExchange(void 0)}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return m`
      <wui-flex flexDirection="column">
        ${this.paymentDetailsTemplate()} ${this.paymentMethodsTemplate()}
      </wui-flex>
    `}paymentMethodsTemplate(){return m`
      <wui-flex flexDirection="column" padding="3" gap="2" class="payment-methods-container">
        ${this.payWithWalletTemplate()} ${this.templateSeparator()}
        ${this.templateExchangeOptions()}
      </wui-flex>
    `}initializeNamespace(){let t=b.state.activeChain;this.namespace=t,this.caipAddress=b.getAccountData(t)?.caipAddress,this.unsubscribe.push(b.subscribeChainProp("accountState",n=>{this.caipAddress=n?.caipAddress},t))}paymentDetailsTemplate(){let n=b.getAllRequestedCaipNetworks().find(r=>r.caipNetworkId===this.paymentAsset.network);return m`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        .padding=${["6","8","6","8"]}
        gap="2"
      >
        <wui-flex alignItems="center" gap="1">
          <wui-text variant="h1-regular" color="primary">
            ${ne(this.amount||"0")}
          </wui-text>

          <wui-flex flexDirection="column">
            <wui-text variant="h6-regular" color="secondary">
              ${this.paymentAsset.metadata.symbol||"Unknown"}
            </wui-text>
            <wui-text variant="md-medium" color="secondary"
              >on ${n?.name||"Unknown"}</wui-text
            >
          </wui-flex>
        </wui-flex>

        <wui-flex class="left-image-container">
          <wui-image
            src=${A(this.paymentAsset.metadata.logoURI)}
            class="token-image"
          ></wui-image>
          <wui-image
            src=${A($.getNetworkImage(n))}
            class="chain-image"
          ></wui-image>
        </wui-flex>
      </wui-flex>
    `}payWithWalletTemplate(){return ft(this.paymentAsset.network)?this.caipAddress?this.connectedWalletTemplate():this.disconnectedWalletTemplate():m``}connectedWalletTemplate(){let{name:t,image:n}=this.getWalletProperties({namespace:this.namespace});return m`
      <wui-flex flexDirection="column" gap="3">
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${this.onWalletPayment}
          .boxed=${!1}
          ?chevron=${!0}
          ?fullSize=${!1}
          ?rounded=${!0}
          data-testid="wallet-payment-option"
          imageSrc=${A(n)}
          imageSize="3xl"
        >
          <wui-text variant="lg-regular" color="primary">Pay with ${t}</wui-text>
        </wui-list-item>

        <wui-list-item
          type="secondary"
          icon="power"
          iconColor="error"
          @click=${this.onDisconnect}
          data-testid="disconnect-button"
          ?chevron=${!1}
          boxColor="foregroundSecondary"
        >
          <wui-text variant="lg-regular" color="secondary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>
    `}disconnectedWalletTemplate(){return m`<wui-list-item
      type="secondary"
      boxColor="foregroundSecondary"
      variant="icon"
      iconColor="default"
      iconVariant="overlay"
      icon="wallet"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="lg-regular" color="primary">Pay with wallet</wui-text>
    </wui-list-item>`}templateExchangeOptions(){if(this.isLoading)return m`<wui-flex justifyContent="center" alignItems="center">
        <wui-loading-spinner size="md"></wui-loading-spinner>
      </wui-flex>`;let t=this.exchanges.filter(n=>wt(this.paymentAsset)?n.id===_e:n.id!==_e);return t.length===0?m`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="md-medium" color="primary">No exchanges available</wui-text>
      </wui-flex>`:t.map(n=>m`
        <wui-list-item
          type="secondary"
          boxColor="foregroundSecondary"
          @click=${()=>this.onExchangePayment(n)}
          data-testid="exchange-option-${n.id}"
          ?chevron=${!0}
          imageSrc=${A(n.imageUrl)}
        >
          <wui-text flexGrow="1" variant="lg-regular" color="primary">
            Pay with ${n.name}
          </wui-text>
        </wui-list-item>
      `)}templateSeparator(){return m`<wui-separator text="or" bgColor="secondary"></wui-separator>`}async onWalletPayment(){if(!this.namespace)throw new Error("Namespace not found");this.caipAddress?te.push("PayQuote"):(await L.connect(),await X.open({view:"PayQuote"}))}onExchangePayment(t){c.setSelectedExchange(t),te.push("PayQuote")}async onDisconnect(){try{await B.disconnect(),await X.open({view:"Pay"})}catch{console.error("Failed to disconnect"),W.showError("Failed to disconnect")}}getWalletProperties({namespace:t}){if(!t)return{name:void 0,image:void 0};let n=this.activeConnectorIds[t];if(!n)return{name:void 0,image:void 0};let r=L.getConnector({id:n,namespace:t});if(!r)return{name:void 0,image:void 0};let o=$.getConnectorImage(r);return{name:r.name,image:o}}};K.styles=bt;Z([g()],K.prototype,"amount",void 0);Z([g()],K.prototype,"namespace",void 0);Z([g()],K.prototype,"paymentAsset",void 0);Z([g()],K.prototype,"activeConnectorIds",void 0);Z([g()],K.prototype,"caipAddress",void 0);Z([g()],K.prototype,"exchanges",void 0);Z([g()],K.prototype,"isLoading",void 0);K=Z([v("w3m-pay-view")],K);u();d();p();u();d();p();u();d();p();u();d();p();var Et=k`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-container {
    position: relative;
    width: var(--pulse-size);
    height: var(--pulse-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pulse-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .pulse-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid var(--pulse-color);
    opacity: 0;
    animation: pulse var(--pulse-duration, 2s) ease-out infinite;
  }

  .pulse-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.5);
      opacity: var(--pulse-opacity, 0.3);
    }
    50% {
      opacity: calc(var(--pulse-opacity, 0.3) * 0.5);
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }
`;var se=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},Kt=3,jt=2,Ht=.3,Qt="200px",Vt={"accent-primary":He.tokens.core.backgroundAccentPrimary},ee=class extends N{constructor(){super(...arguments),this.rings=Kt,this.duration=jt,this.opacity=Ht,this.size=Qt,this.variant="accent-primary"}render(){let t=Vt[this.variant];this.style.cssText=`
      --pulse-size: ${this.size};
      --pulse-duration: ${this.duration}s;
      --pulse-color: ${t};
      --pulse-opacity: ${this.opacity};
    `;let n=Array.from({length:this.rings},(r,o)=>this.renderRing(o,this.rings));return m`
      <div class="pulse-container">
        <div class="pulse-rings">${n}</div>
        <div class="pulse-content">
          <slot></slot>
        </div>
      </div>
    `}renderRing(t,n){let o=`animation-delay: ${t/n*this.duration}s;`;return m`<div class="pulse-ring" style=${o}></div>`}};ee.styles=[me,Et];se([C({type:Number})],ee.prototype,"rings",void 0);se([C({type:Number})],ee.prototype,"duration",void 0);se([C({type:Number})],ee.prototype,"opacity",void 0);se([C()],ee.prototype,"size",void 0);se([C()],ee.prototype,"variant",void 0);ee=se([v("wui-pulse")],ee);u();d();p();var Me=[{id:"received",title:"Receiving funds",icon:"dollar"},{id:"processing",title:"Swapping asset",icon:"recycleHorizontal"},{id:"sending",title:"Sending asset to the recipient address",icon:"send"}],qe=["success","submitted","failure","timeout","refund"];u();d();p();var At=k`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  .token-badge-container {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: ${({borderRadius:e})=>e[4]};
    z-index: 3;
    min-width: 105px;
  }

  .token-badge-container.loading {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-badge-container.success {
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border: 3px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .token-image-container {
    position: relative;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 64px;
    height: 64px;
  }

  .token-image.success {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.error {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .token-image.loading {
    background: ${({colors:e})=>e.accent010};
  }

  .token-image wui-icon {
    width: 32px;
    height: 32px;
  }

  .token-badge {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .token-badge wui-text {
    white-space: nowrap;
  }

  .payment-lifecycle-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[6]};
    border-top-left-radius: ${({borderRadius:e})=>e[6]};
  }

  .payment-step-badge {
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  .payment-step-badge.loading {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .payment-step-badge.error {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  .payment-step-badge.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }

  .step-icon-container {
    position: relative;
    height: 40px;
    width: 40px;
    border-radius: ${({borderRadius:e})=>e.round};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .step-icon-box {
    position: absolute;
    right: -4px;
    bottom: -1px;
    padding: 2px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .step-icon-box.success {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
  }
`;var j=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},Xt={received:["pending","success","submitted"],processing:["success","submitted"],sending:["success","submitted"]},Jt=3e3,z=class extends N{constructor(){super(),this.unsubscribe=[],this.pollingInterval=null,this.paymentAsset=c.state.paymentAsset,this.quoteStatus=c.state.quoteStatus,this.quote=c.state.quote,this.amount=c.state.amount,this.namespace=void 0,this.caipAddress=void 0,this.profileName=null,this.activeConnectorIds=L.state.activeConnectorIds,this.selectedExchange=c.state.selectedExchange,this.initializeNamespace(),this.unsubscribe.push(c.subscribeKey("quoteStatus",t=>this.quoteStatus=t),c.subscribeKey("quote",t=>this.quote=t),L.subscribeKey("activeConnectorIds",t=>this.activeConnectorIds=t),c.subscribeKey("selectedExchange",t=>this.selectedExchange=t))}connectedCallback(){super.connectedCallback(),this.startPolling()}disconnectedCallback(){super.disconnectedCallback(),this.stopPolling(),this.unsubscribe.forEach(t=>t())}render(){return m`
      <wui-flex flexDirection="column" .padding=${["3","0","0","0"]} gap="2">
        ${this.tokenTemplate()} ${this.paymentTemplate()} ${this.paymentLifecycleTemplate()}
      </wui-flex>
    `}tokenTemplate(){let t=ne(this.amount||"0"),n=this.paymentAsset.metadata.symbol??"Unknown",o=b.getAllRequestedCaipNetworks().find(l=>l.caipNetworkId===this.paymentAsset.network),s=this.quoteStatus==="failure"||this.quoteStatus==="timeout"||this.quoteStatus==="refund";return this.quoteStatus==="success"||this.quoteStatus==="submitted"?m`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image success">
          <wui-icon name="checkmark" color="success" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:s?m`<wui-flex alignItems="center" justifyContent="center">
        <wui-flex justifyContent="center" alignItems="center" class="token-image error">
          <wui-icon name="close" color="error" size="inherit"></wui-icon>
        </wui-flex>
      </wui-flex>`:m`
      <wui-flex alignItems="center" justifyContent="center">
        <wui-flex class="token-image-container">
          <wui-pulse size="125px" rings="3" duration="4" opacity="0.5" variant="accent-primary">
            <wui-flex justifyContent="center" alignItems="center" class="token-image loading">
              <wui-icon name="paperPlaneTitle" color="accent-primary" size="inherit"></wui-icon>
            </wui-flex>
          </wui-pulse>

          <wui-flex
            justifyContent="center"
            alignItems="center"
            class="token-badge-container loading"
          >
            <wui-flex
              alignItems="center"
              justifyContent="center"
              gap="01"
              padding="1"
              class="token-badge"
            >
              <wui-image
                src=${A($.getNetworkImage(o))}
                class="chain-image"
                size="mdl"
              ></wui-image>

              <wui-text variant="lg-regular" color="primary">${t} ${n}</wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}paymentTemplate(){return m`
      <wui-flex flexDirection="column" gap="2" .padding=${["0","6","0","6"]}>
        ${this.renderPayment()}
        <wui-separator></wui-separator>
        ${this.renderWallet()}
      </wui-flex>
    `}paymentLifecycleTemplate(){let t=this.getStepsWithStatus();return m`
      <wui-flex flexDirection="column" padding="4" gap="2" class="payment-lifecycle-container">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">PAYMENT CYCLE</wui-text>

          ${this.renderPaymentCycleBadge()}
        </wui-flex>

        <wui-flex flexDirection="column" gap="5" .padding=${["2","0","2","0"]}>
          ${t.map(n=>this.renderStep(n))}
        </wui-flex>
      </wui-flex>
    `}renderPaymentCycleBadge(){let t=this.quoteStatus==="failure"||this.quoteStatus==="timeout"||this.quoteStatus==="refund",n=this.quoteStatus==="success"||this.quoteStatus==="submitted";if(t)return m`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge error"
          gap="1"
        >
          <wui-icon name="close" color="error" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="error">Failed</wui-text>
        </wui-flex>
      `;if(n)return m`
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge success"
          gap="1"
        >
          <wui-icon name="checkmark" color="success" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="success">Completed</wui-text>
        </wui-flex>
      `;let r=this.quote?.timeInSeconds??0;return m`
      <wui-flex alignItems="center" justifyContent="space-between" gap="3">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          class="payment-step-badge loading"
          gap="1"
        >
          <wui-icon name="clock" color="default" size="xs"></wui-icon>
          <wui-text variant="sm-regular" color="primary">Est. ${r} sec</wui-text>
        </wui-flex>

        <wui-icon name="chevronBottom" color="default" size="xxs"></wui-icon>
      </wui-flex>
    `}renderPayment(){let n=b.getAllRequestedCaipNetworks().find(a=>{let l=this.quote?.origin.currency.network;if(!l)return!1;let{chainId:E}=S.parseCaipNetworkId(l);return U.isLowerCaseMatch(a.id.toString(),E.toString())}),r=I.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString(),o=ne(r),s=this.quote?.origin.currency.metadata.symbol??"Unknown";return m`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Payment Method</wui-text>

        <wui-flex flexDirection="column" alignItems="flex-end" gap="1">
          <wui-flex alignItems="center" gap="01">
            <wui-text variant="lg-regular" color="primary">${o}</wui-text>
            <wui-text variant="lg-regular" color="secondary">${s}</wui-text>
          </wui-flex>

          <wui-flex alignItems="center" gap="1">
            <wui-text variant="md-regular" color="secondary">on</wui-text>
            <wui-image
              src=${A($.getNetworkImage(n))}
              size="xs"
            ></wui-image>
            <wui-text variant="md-regular" color="secondary">${n?.name}</wui-text>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderWallet(){return m`
      <wui-flex
        alignItems="flex-start"
        justifyContent="space-between"
        .padding=${["3","0","3","0"]}
      >
        <wui-text variant="lg-regular" color="secondary">Wallet</wui-text>

        ${this.renderWalletText()}
      </wui-flex>
    `}renderWalletText(){let{image:t}=this.getWalletProperties({namespace:this.namespace}),{address:n}=this.caipAddress?S.parseCaipAddress(this.caipAddress):{},r=this.selectedExchange?.name;return this.selectedExchange?m`
        <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
          <wui-text variant="lg-regular" color="primary">${r}</wui-text>
          <wui-image src=${A(this.selectedExchange.imageUrl)} size="mdl"></wui-image>
        </wui-flex>
      `:m`
      <wui-flex alignItems="center" justifyContent="flex-end" gap="1">
        <wui-text variant="lg-regular" color="primary">
          ${Ve.getTruncateString({string:this.profileName||n||r||"",charsStart:this.profileName?16:4,charsEnd:this.profileName?0:6,truncate:this.profileName?"end":"middle"})}
        </wui-text>

        <wui-image src=${A(t)} size="mdl"></wui-image>
      </wui-flex>
    `}getStepsWithStatus(){return this.quoteStatus==="failure"||this.quoteStatus==="timeout"||this.quoteStatus==="refund"?Me.map(n=>({...n,status:"failed"})):Me.map(n=>{let o=(Xt[n.id]??[]).includes(this.quoteStatus)?"completed":"pending";return{...n,status:o}})}renderStep({title:t,icon:n,status:r}){return m`
      <wui-flex alignItems="center" gap="3">
        <wui-flex justifyContent="center" alignItems="center" class="step-icon-container">
          <wui-icon name=${n} color="default" size="mdl"></wui-icon>

          <wui-flex alignItems="center" justifyContent="center" class=${he({"step-icon-box":!0,success:r==="completed"})}>
            ${this.renderStatusIndicator(r)}
          </wui-flex>
        </wui-flex>

        <wui-text variant="md-regular" color="primary">${t}</wui-text>
      </wui-flex>
    `}renderStatusIndicator(t){return t==="completed"?m`<wui-icon size="sm" color="success" name="checkmark"></wui-icon>`:t==="failed"?m`<wui-icon size="sm" color="error" name="close"></wui-icon>`:t==="pending"?m`<wui-loading-spinner color="accent-primary" size="sm"></wui-loading-spinner>`:null}startPolling(){this.pollingInterval||(this.fetchQuoteStatus(),this.pollingInterval=setInterval(()=>{this.fetchQuoteStatus()},Jt))}stopPolling(){this.pollingInterval&&(clearInterval(this.pollingInterval),this.pollingInterval=null)}async fetchQuoteStatus(){let t=c.state.requestId;if(!t||qe.includes(this.quoteStatus))this.stopPolling();else try{await c.fetchQuoteStatus({requestId:t}),qe.includes(this.quoteStatus)&&this.stopPolling()}catch{this.stopPolling()}}initializeNamespace(){let t=b.state.activeChain;this.namespace=t,this.caipAddress=b.getAccountData(t)?.caipAddress,this.profileName=b.getAccountData(t)?.profileName??null,this.unsubscribe.push(b.subscribeChainProp("accountState",n=>{this.caipAddress=n?.caipAddress,this.profileName=n?.profileName??null},t))}getWalletProperties({namespace:t}){if(!t)return{name:void 0,image:void 0};let n=this.activeConnectorIds[t];if(!n)return{name:void 0,image:void 0};let r=L.getConnector({id:n,namespace:t});if(!r)return{name:void 0,image:void 0};let o=$.getConnectorImage(r);return{name:r.name,image:o}}};z.styles=At;j([g()],z.prototype,"paymentAsset",void 0);j([g()],z.prototype,"quoteStatus",void 0);j([g()],z.prototype,"quote",void 0);j([g()],z.prototype,"amount",void 0);j([g()],z.prototype,"namespace",void 0);j([g()],z.prototype,"caipAddress",void 0);j([g()],z.prototype,"profileName",void 0);j([g()],z.prototype,"activeConnectorIds",void 0);j([g()],z.prototype,"selectedExchange",void 0);z=j([v("w3m-pay-loading-view")],z);u();d();p();u();d();p();u();d();p();var St=je`
  :host {
    display: block;
  }
`;var Zt=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},Fe=class extends N{render(){return m`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-shimmer width="60px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Network Fee</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-shimmer
              width="75px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>

            <wui-flex alignItems="center" gap="01">
              <wui-shimmer width="14px" height="14px" rounded variant="light"></wui-shimmer>
              <wui-shimmer
                width="49px"
                height="14px"
                borderRadius="4xs"
                variant="light"
              ></wui-shimmer>
            </wui-flex>
          </wui-flex>
        </wui-flex>

        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Service Fee</wui-text>
          <wui-shimmer width="75px" height="16px" borderRadius="4xs" variant="light"></wui-shimmer>
        </wui-flex>
      </wui-flex>
    `}};Fe.styles=[St];Fe=Zt([v("w3m-pay-fees-skeleton")],Fe);u();d();p();u();d();p();var Pt=k`
  :host {
    display: block;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }
`;var It=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},Ee=class extends N{constructor(){super(),this.unsubscribe=[],this.quote=c.state.quote,this.unsubscribe.push(c.subscribeKey("quote",t=>this.quote=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=I.formatNumber(this.quote?.origin.amount||"0",{decimals:this.quote?.origin.currency.metadata.decimals??0,round:6}).toString();return m`
      <wui-flex flexDirection="column" gap="4">
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">Pay</wui-text>
          <wui-text variant="md-regular" color="primary">
            ${t} ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
          </wui-text>
        </wui-flex>

        ${this.quote&&this.quote.fees.length>0?this.quote.fees.map(n=>this.renderFee(n)):null}
      </wui-flex>
    `}renderFee(t){let n=t.id==="network",r=I.formatNumber(t.amount||"0",{decimals:t.currency.metadata.decimals??0,round:6}).toString();if(n){let s=b.getAllRequestedCaipNetworks().find(a=>U.isLowerCaseMatch(a.caipNetworkId,t.currency.network));return m`
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="md-regular" color="secondary">${t.label}</wui-text>

          <wui-flex flexDirection="column" alignItems="flex-end" gap="2">
            <wui-text variant="md-regular" color="primary">
              ${r} ${t.currency.metadata.symbol||"Unknown"}
            </wui-text>

            <wui-flex alignItems="center" gap="01">
              <wui-image
                src=${A($.getNetworkImage(s))}
                size="xs"
              ></wui-image>
              <wui-text variant="sm-regular" color="secondary">
                ${s?.name||"Unknown"}
              </wui-text>
            </wui-flex>
          </wui-flex>
        </wui-flex>
      `}return m`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-text variant="md-regular" color="secondary">${t.label}</wui-text>
        <wui-text variant="md-regular" color="primary">
          ${r} ${t.currency.metadata.symbol||"Unknown"}
        </wui-text>
      </wui-flex>
    `}};Ee.styles=[Pt];It([g()],Ee.prototype,"quote",void 0);Ee=It([v("w3m-pay-fees")],Ee);u();d();p();u();d();p();var Tt=k`
  :host {
    display: block;
    width: 100%;
  }

  .disabled-container {
    padding: ${({spacing:e})=>e[2]};
    min-height: 168px;
  }

  wui-icon {
    width: ${({spacing:e})=>e[8]};
    height: ${({spacing:e})=>e[8]};
  }

  wui-flex > wui-text {
    max-width: 273px;
  }
`;var Nt=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},Ae=class extends N{constructor(){super(),this.unsubscribe=[],this.selectedExchange=c.state.selectedExchange,this.unsubscribe.push(c.subscribeKey("selectedExchange",t=>this.selectedExchange=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=!!this.selectedExchange;return m`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
        class="disabled-container"
      >
        <wui-icon name="coins" color="default" size="inherit"></wui-icon>

        <wui-text variant="md-regular" color="primary" align="center">
          You don't have enough funds to complete this transaction
        </wui-text>

        ${t?null:m`<wui-button
              size="md"
              variant="neutral-secondary"
              @click=${this.dispatchConnectOtherWalletEvent.bind(this)}
              >Connect other wallet</wui-button
            >`}
      </wui-flex>
    `}dispatchConnectOtherWalletEvent(){this.dispatchEvent(new CustomEvent("connectOtherWallet",{detail:!0,bubbles:!0,composed:!0}))}};Ae.styles=[Tt];Nt([C({type:Array})],Ae.prototype,"selectedExchange",void 0);Ae=Nt([v("w3m-pay-options-empty")],Ae);u();d();p();u();d();p();var vt=k`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    min-height: 60px;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    bottom: -3px;
    right: -5px;
    border: 2px solid ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`;var en=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},Be=class extends N{render(){return m`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.renderOptionEntry()} ${this.renderOptionEntry()} ${this.renderOptionEntry()}
      </wui-flex>
    `}renderOptionEntry(){return m`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-shimmer
              width="32px"
              height="32px"
              rounded
              variant="light"
              class="token-image"
            ></wui-shimmer>
            <wui-shimmer
              width="16px"
              height="16px"
              rounded
              variant="light"
              class="chain-image"
            ></wui-shimmer>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-shimmer
              width="74px"
              height="16px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
            <wui-shimmer
              width="46px"
              height="14px"
              borderRadius="4xs"
              variant="light"
            ></wui-shimmer>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}};Be.styles=[vt];Be=en([v("w3m-pay-options-skeleton")],Be);u();d();p();u();d();p();var Ct=k`
  :host {
    display: block;
    width: 100%;
  }

  .pay-options-container {
    max-height: 196px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    mask-image: var(--options-mask-image);
    -webkit-mask-image: var(--options-mask-image);
  }

  .pay-options-container::-webkit-scrollbar {
    display: none;
  }

  .pay-option-container {
    cursor: pointer;
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
  }

  .token-images-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .token-image {
    border-radius: ${({borderRadius:e})=>e.round};
    width: 32px;
    height: 32px;
  }

  .chain-image {
    position: absolute;
    width: 16px;
    height: 16px;
    bottom: -3px;
    right: -5px;
    border-radius: ${({borderRadius:e})=>e.round};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  @media (hover: hover) and (pointer: fine) {
    .pay-option-container:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }
`;var Se=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},tn=300,oe=class extends N{constructor(){super(),this.unsubscribe=[],this.options=[],this.selectedPaymentAsset=null}disconnectedCallback(){this.unsubscribe.forEach(n=>n()),this.resizeObserver?.disconnect(),this.shadowRoot?.querySelector(".pay-options-container")?.removeEventListener("scroll",this.handleOptionsListScroll.bind(this))}firstUpdated(){let t=this.shadowRoot?.querySelector(".pay-options-container");t&&(requestAnimationFrame(this.handleOptionsListScroll.bind(this)),t?.addEventListener("scroll",this.handleOptionsListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleOptionsListScroll()}),this.resizeObserver?.observe(t),this.handleOptionsListScroll())}render(){return m`
      <wui-flex flexDirection="column" gap="2" class="pay-options-container">
        ${this.options.map(t=>this.payOptionTemplate(t))}
      </wui-flex>
    `}payOptionTemplate(t){let{network:n,metadata:r,asset:o,amount:s="0"}=t,l=b.getAllRequestedCaipNetworks().find(ie=>ie.caipNetworkId===n),E=`${n}:${o}`,M=`${this.selectedPaymentAsset?.network}:${this.selectedPaymentAsset?.asset}`,q=E===M,H=I.bigNumber(s,{safe:!0}),V=H.gt(0);return m`
      <wui-flex
        alignItems="center"
        justifyContent="space-between"
        gap="2"
        @click=${()=>this.onSelect?.(t)}
        class="pay-option-container"
      >
        <wui-flex alignItems="center" gap="2">
          <wui-flex class="token-images-container">
            <wui-image
              src=${A(r.logoURI)}
              class="token-image"
              size="3xl"
            ></wui-image>
            <wui-image
              src=${A($.getNetworkImage(l))}
              class="chain-image"
              size="md"
            ></wui-image>
          </wui-flex>

          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="lg-regular" color="primary">${r.symbol}</wui-text>
            ${V?m`<wui-text variant="sm-regular" color="secondary">
                  ${H.round(6).toString()} ${r.symbol}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>

        ${q?m`<wui-icon name="checkmark" size="md" color="success"></wui-icon>`:null}
      </wui-flex>
    `}handleOptionsListScroll(){let t=this.shadowRoot?.querySelector(".pay-options-container");if(!t)return;t.scrollHeight>tn?(t.style.setProperty("--options-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--options-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--options-scroll--top-opacity))) 1px,
          black 50px,
          black calc(100% - 50px),
          rgba(155, 155, 155, calc(1 - var(--options-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--options-scroll--bottom-opacity))) 100%
        )`),t.style.setProperty("--options-scroll--top-opacity",Te.interpolate([0,50],[0,1],t.scrollTop).toString()),t.style.setProperty("--options-scroll--bottom-opacity",Te.interpolate([0,50],[0,1],t.scrollHeight-t.scrollTop-t.offsetHeight).toString())):(t.style.setProperty("--options-mask-image","none"),t.style.setProperty("--options-scroll--top-opacity","0"),t.style.setProperty("--options-scroll--bottom-opacity","0"))}};oe.styles=[Ct];Se([C({type:Array})],oe.prototype,"options",void 0);Se([C()],oe.prototype,"selectedPaymentAsset",void 0);Se([C()],oe.prototype,"onSelect",void 0);oe=Se([v("w3m-pay-options")],oe);u();d();p();var _t=k`
  .payment-methods-container {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-top-right-radius: ${({borderRadius:e})=>e[5]};
    border-top-left-radius: ${({borderRadius:e})=>e[5]};
  }

  .pay-options-container {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding: ${({spacing:e})=>e[1]};
  }

  w3m-tooltip-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e.round};
  }

  w3m-pay-options.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;var R=function(e,t,n,r){var o=arguments.length,s=o<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,n,r);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(s=(o<3?a(s):o>3?a(t,n,s):a(t,n))||s);return o>3&&s&&Object.defineProperty(t,n,s),s},Pe={eip155:"ethereum",solana:"solana",bip122:"bitcoin",ton:"ton"},nn={eip155:{icon:Pe.eip155,label:"EVM"},solana:{icon:Pe.solana,label:"Solana"},bip122:{icon:Pe.bip122,label:"Bitcoin"},ton:{icon:Pe.ton,label:"Ton"}},_=class extends N{constructor(){super(),this.unsubscribe=[],this.profileName=null,this.paymentAsset=c.state.paymentAsset,this.namespace=void 0,this.caipAddress=void 0,this.amount=c.state.amount,this.recipient=c.state.recipient,this.activeConnectorIds=L.state.activeConnectorIds,this.selectedPaymentAsset=c.state.selectedPaymentAsset,this.selectedExchange=c.state.selectedExchange,this.isFetchingQuote=c.state.isFetchingQuote,this.quoteError=c.state.quoteError,this.quote=c.state.quote,this.isFetchingTokenBalances=c.state.isFetchingTokenBalances,this.tokenBalances=c.state.tokenBalances,this.isPaymentInProgress=c.state.isPaymentInProgress,this.exchangeUrlForQuote=c.state.exchangeUrlForQuote,this.completedTransactionsCount=0,this.unsubscribe.push(c.subscribeKey("paymentAsset",t=>this.paymentAsset=t)),this.unsubscribe.push(c.subscribeKey("tokenBalances",t=>this.onTokenBalancesChanged(t))),this.unsubscribe.push(c.subscribeKey("isFetchingTokenBalances",t=>this.isFetchingTokenBalances=t)),this.unsubscribe.push(L.subscribeKey("activeConnectorIds",t=>this.activeConnectorIds=t)),this.unsubscribe.push(c.subscribeKey("selectedPaymentAsset",t=>this.selectedPaymentAsset=t)),this.unsubscribe.push(c.subscribeKey("isFetchingQuote",t=>this.isFetchingQuote=t)),this.unsubscribe.push(c.subscribeKey("quoteError",t=>this.quoteError=t)),this.unsubscribe.push(c.subscribeKey("quote",t=>this.quote=t)),this.unsubscribe.push(c.subscribeKey("amount",t=>this.amount=t)),this.unsubscribe.push(c.subscribeKey("recipient",t=>this.recipient=t)),this.unsubscribe.push(c.subscribeKey("isPaymentInProgress",t=>this.isPaymentInProgress=t)),this.unsubscribe.push(c.subscribeKey("selectedExchange",t=>this.selectedExchange=t)),this.unsubscribe.push(c.subscribeKey("exchangeUrlForQuote",t=>this.exchangeUrlForQuote=t)),this.resetQuoteState(),this.initializeNamespace(),this.fetchTokens()}disconnectedCallback(){super.disconnectedCallback(),this.resetAssetsState(),this.unsubscribe.forEach(t=>t())}updated(t){super.updated(t),t.has("selectedPaymentAsset")&&this.fetchQuote()}render(){return m`
      <wui-flex flexDirection="column">
        ${this.profileTemplate()}

        <wui-flex
          flexDirection="column"
          gap="4"
          class="payment-methods-container"
          .padding=${["4","4","5","4"]}
        >
          ${this.paymentOptionsViewTemplate()} ${this.amountWithFeeTemplate()}

          <wui-flex
            alignItems="center"
            justifyContent="space-between"
            .padding=${["1","0","1","0"]}
          >
            <wui-separator></wui-separator>
          </wui-flex>

          ${this.paymentActionsTemplate()}
        </wui-flex>
      </wui-flex>
    `}profileTemplate(){if(this.selectedExchange){let a=I.formatNumber(this.quote?.origin.amount,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return m`
        <wui-flex
          .padding=${["4","3","4","3"]}
          alignItems="center"
          justifyContent="space-between"
          gap="2"
        >
          <wui-text variant="lg-regular" color="secondary">Paying with</wui-text>

          ${this.quote?m`<wui-text variant="lg-regular" color="primary">
                ${I.bigNumber(a,{safe:!0}).round(6).toString()}
                ${this.quote.origin.currency.metadata.symbol}
              </wui-text>`:m`<wui-shimmer width="80px" height="18px" variant="light"></wui-shimmer>`}
        </wui-flex>
      `}let t=D.getPlainAddress(this.caipAddress)??"",{name:n,image:r}=this.getWalletProperties({namespace:this.namespace}),{icon:o,label:s}=nn[this.namespace]??{};return m`
      <wui-flex
        .padding=${["4","3","4","3"]}
        alignItems="center"
        justifyContent="space-between"
        gap="2"
      >
        <wui-wallet-switch
          profileName=${A(this.profileName)}
          address=${A(t)}
          imageSrc=${A(r)}
          alt=${A(n)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        <wui-wallet-switch
          profileName=${A(s)}
          address=${A(t)}
          icon=${A(o)}
          iconSize="xs"
          .enableGreenCircle=${!1}
          alt=${A(s)}
          @click=${this.onConnectOtherWallet.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
      </wui-flex>
    `}initializeNamespace(){let t=b.state.activeChain;this.namespace=t,this.caipAddress=b.getAccountData(t)?.caipAddress,this.profileName=b.getAccountData(t)?.profileName??null,this.unsubscribe.push(b.subscribeChainProp("accountState",n=>this.onAccountStateChanged(n),t))}async fetchTokens(){if(this.namespace){let t;if(this.caipAddress){let{chainId:n,chainNamespace:r}=S.parseCaipAddress(this.caipAddress),o=`${r}:${n}`;t=b.getAllRequestedCaipNetworks().find(a=>a.caipNetworkId===o)}await c.fetchTokens({caipAddress:this.caipAddress,caipNetwork:t,namespace:this.namespace})}}fetchQuote(){if(this.amount&&this.recipient&&this.selectedPaymentAsset&&this.paymentAsset){let{address:t}=this.caipAddress?S.parseCaipAddress(this.caipAddress):{};c.fetchQuote({amount:this.amount.toString(),address:t,sourceToken:this.selectedPaymentAsset,toToken:this.paymentAsset,recipient:this.recipient})}}getWalletProperties({namespace:t}){if(!t)return{name:void 0,image:void 0};let n=this.activeConnectorIds[t];if(!n)return{name:void 0,image:void 0};let r=L.getConnector({id:n,namespace:t});if(!r)return{name:void 0,image:void 0};let o=$.getConnectorImage(r);return{name:r.name,image:o}}paymentOptionsViewTemplate(){return m`
      <wui-flex flexDirection="column" gap="2">
        <wui-text variant="sm-regular" color="secondary">CHOOSE PAYMENT OPTION</wui-text>
        <wui-flex class="pay-options-container">${this.paymentOptionsTemplate()}</wui-flex>
      </wui-flex>
    `}paymentOptionsTemplate(){let t=this.getPaymentAssetFromTokenBalances();if(this.isFetchingTokenBalances)return m`<w3m-pay-options-skeleton></w3m-pay-options-skeleton>`;if(t.length===0)return m`<w3m-pay-options-empty
        @connectOtherWallet=${this.onConnectOtherWallet.bind(this)}
      ></w3m-pay-options-empty>`;let n={disabled:this.isFetchingQuote};return m`<w3m-pay-options
      class=${he(n)}
      .options=${t}
      .selectedPaymentAsset=${A(this.selectedPaymentAsset)}
      .onSelect=${this.onSelectedPaymentAssetChanged.bind(this)}
    ></w3m-pay-options>`}amountWithFeeTemplate(){return this.isFetchingQuote||!this.selectedPaymentAsset||this.quoteError?m`<w3m-pay-fees-skeleton></w3m-pay-fees-skeleton>`:m`<w3m-pay-fees></w3m-pay-fees>`}paymentActionsTemplate(){let t=this.isFetchingQuote||this.isFetchingTokenBalances,n=this.isFetchingQuote||this.isFetchingTokenBalances||!this.selectedPaymentAsset||!!this.quoteError,r=I.formatNumber(this.quote?.origin.amount??0,{decimals:this.quote?.origin.currency.metadata.decimals??0}).toString();return this.selectedExchange?t||n?m`
          <wui-shimmer width="100%" height="48px" variant="light" ?rounded=${!0}></wui-shimmer>
        `:m`<wui-button
        size="lg"
        fullWidth
        variant="accent-secondary"
        @click=${this.onPayWithExchange.bind(this)}
      >
        ${`Continue in ${this.selectedExchange.name}`}

        <wui-icon name="arrowRight" color="inherit" size="sm" slot="iconRight"></wui-icon>
      </wui-button>`:m`
      <wui-flex alignItems="center" justifyContent="space-between">
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="md-regular" color="secondary">Order Total</wui-text>

          ${t||n?m`<wui-shimmer width="58px" height="32px" variant="light"></wui-shimmer>`:m`<wui-flex alignItems="center" gap="01">
                <wui-text variant="h4-regular" color="primary">${ne(r)}</wui-text>

                <wui-text variant="lg-regular" color="secondary">
                  ${this.quote?.origin.currency.metadata.symbol||"Unknown"}
                </wui-text>
              </wui-flex>`}
        </wui-flex>

        ${this.actionButtonTemplate({isLoading:t,isDisabled:n})}
      </wui-flex>
    `}actionButtonTemplate(t){let n=xe(this.quote),{isLoading:r,isDisabled:o}=t,s="Pay";return n.length>1&&this.completedTransactionsCount===0&&(s="Approve"),m`
      <wui-button
        size="lg"
        variant="accent-primary"
        ?loading=${r||this.isPaymentInProgress}
        ?disabled=${o||this.isPaymentInProgress}
        @click=${()=>{n.length>0?this.onSendTransactions():this.onTransfer()}}
      >
        ${s}
        ${r?null:m`<wui-icon
              name="arrowRight"
              color="inherit"
              size="sm"
              slot="iconRight"
            ></wui-icon>`}
      </wui-button>
    `}getPaymentAssetFromTokenBalances(){return this.namespace?(this.tokenBalances[this.namespace]??[]).map(o=>{try{return gt(o)}catch{return null}}).filter(o=>!!o).filter(o=>{let{chainId:s}=S.parseCaipNetworkId(o.network),{chainId:a}=S.parseCaipNetworkId(this.paymentAsset.network);return U.isLowerCaseMatch(o.asset,this.paymentAsset.asset)?!0:this.selectedExchange?!U.isLowerCaseMatch(s.toString(),a.toString()):!0}):[]}onTokenBalancesChanged(t){this.tokenBalances=t;let[n]=this.getPaymentAssetFromTokenBalances();n&&c.setSelectedPaymentAsset(n)}async onConnectOtherWallet(){await L.connect(),await X.open({view:"PayQuote"})}onAccountStateChanged(t){let{address:n}=this.caipAddress?S.parseCaipAddress(this.caipAddress):{};if(this.caipAddress=t?.caipAddress,this.profileName=t?.profileName??null,n){let{address:r}=this.caipAddress?S.parseCaipAddress(this.caipAddress):{};r?U.isLowerCaseMatch(r,n)||(this.resetAssetsState(),this.resetQuoteState(),this.fetchTokens()):X.close()}}onSelectedPaymentAssetChanged(t){this.isFetchingQuote||c.setSelectedPaymentAsset(t)}async onTransfer(){let t=le(this.quote);if(t){if(!U.isLowerCaseMatch(this.selectedPaymentAsset?.asset,t.deposit.currency))throw new Error("Quote asset is not the same as the selected payment asset");let r=this.selectedPaymentAsset?.amount??"0",o=I.formatNumber(t.deposit.amount,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!I.bigNumber(r).gte(o)){W.showError("Insufficient funds");return}if(this.quote&&this.selectedPaymentAsset&&this.caipAddress&&this.namespace){let{address:a}=S.parseCaipAddress(this.caipAddress);await c.onTransfer({chainNamespace:this.namespace,fromAddress:a,toAddress:t.deposit.receiver,amount:o,paymentAsset:this.selectedPaymentAsset}),c.setRequestId(t.requestId),te.push("PayLoading")}}}async onSendTransactions(){let t=this.selectedPaymentAsset?.amount??"0",n=I.formatNumber(this.quote?.origin.amount??0,{decimals:this.selectedPaymentAsset?.metadata.decimals??0}).toString();if(!I.bigNumber(t).gte(n)){W.showError("Insufficient funds");return}let o=xe(this.quote),[s]=xe(this.quote,this.completedTransactionsCount);s&&this.namespace&&(await c.onSendTransaction({namespace:this.namespace,transactionStep:s}),this.completedTransactionsCount+=1,this.completedTransactionsCount===o.length&&(c.setRequestId(s.requestId),te.push("PayLoading")))}onPayWithExchange(){if(this.exchangeUrlForQuote){let t=D.returnOpenHref("","popupWindow","scrollbar=yes,width=480,height=720");if(!t)throw new Error("Could not create popup window");t.location.href=this.exchangeUrlForQuote;let n=le(this.quote);n&&c.setRequestId(n.requestId),c.initiatePayment(),te.push("PayLoading")}}resetAssetsState(){c.setSelectedPaymentAsset(null)}resetQuoteState(){c.resetQuoteState()}};_.styles=_t;R([g()],_.prototype,"profileName",void 0);R([g()],_.prototype,"paymentAsset",void 0);R([g()],_.prototype,"namespace",void 0);R([g()],_.prototype,"caipAddress",void 0);R([g()],_.prototype,"amount",void 0);R([g()],_.prototype,"recipient",void 0);R([g()],_.prototype,"activeConnectorIds",void 0);R([g()],_.prototype,"selectedPaymentAsset",void 0);R([g()],_.prototype,"selectedExchange",void 0);R([g()],_.prototype,"isFetchingQuote",void 0);R([g()],_.prototype,"quoteError",void 0);R([g()],_.prototype,"quote",void 0);R([g()],_.prototype,"isFetchingTokenBalances",void 0);R([g()],_.prototype,"tokenBalances",void 0);R([g()],_.prototype,"isPaymentInProgress",void 0);R([g()],_.prototype,"exchangeUrlForQuote",void 0);R([g()],_.prototype,"completedTransactionsCount",void 0);_=R([v("w3m-pay-quote-view")],_);u();d();p();var rn=3e5;async function kt(e){return c.handleOpenPay(e)}async function sn(e,t=rn){if(t<=0)throw new f(h.INVALID_PAYMENT_CONFIG,"Timeout must be greater than 0");try{await kt(e)}catch(n){throw n instanceof f?n:new f(h.UNABLE_TO_INITIATE_PAYMENT,n.message)}return new Promise((n,r)=>{let o=!1,s=setTimeout(()=>{o||(o=!0,q(),r(new f(h.GENERIC_PAYMENT_ERROR,"Payment timeout")))},t);function a(){if(o)return;let H=c.state.currentPayment,V=c.state.error,ie=c.state.isPaymentInProgress;if(H?.status==="SUCCESS"){o=!0,q(),clearTimeout(s),n({success:!0,result:H.result});return}if(H?.status==="FAILED"){o=!0,q(),clearTimeout(s),n({success:!1,error:V||"Payment failed"});return}V&&!ie&&!H&&(o=!0,q(),clearTimeout(s),n({success:!1,error:V}))}let l=We("currentPayment",a),E=We("error",a),M=We("isPaymentInProgress",a),q=un([l,E,M]);a()})}function on(){return c.getExchanges()}function an(){return c.state.currentPayment?.result}function cn(){return c.state.error}function ln(){return c.state.isPaymentInProgress}function We(e,t){return c.subscribeKey(e,t)}function un(e){return()=>{e.forEach(t=>{try{t()}catch{}})}}u();d();p();var Ka={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},ja={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},Ha={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},Qa={network:"eip155:1",asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},Va={network:"eip155:10",asset:"0x0b2c639c533813f4aa9d7837caf62653d097ff85",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},Xa={network:"eip155:42161",asset:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},Ja={network:"eip155:137",asset:"0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},Za={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},ec={network:"eip155:1",asset:"0xdAC17F958D2ee523a2206206994597C13D831ec7",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},tc={network:"eip155:10",asset:"0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},nc={network:"eip155:42161",asset:"0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},rc={network:"eip155:137",asset:"0xc2132d05d31c914a87c6611c10748aeb04b58e8f",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},sc={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",metadata:{name:"Tether USD",symbol:"USDT",decimals:6}},oc={network:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",asset:"native",metadata:{name:"Solana",symbol:"SOL",decimals:9}};export{c as a,K as b,z as c,_ as d,kt as e,sn as f,on as g,an as h,cn as i,ln as j,Ka as k,ja as l,Ha as m,Qa as n,Va as o,Xa as p,Ja as q,Za as r,ec as s,tc as t,nc as u,rc as v,sc as w,oc as x};
