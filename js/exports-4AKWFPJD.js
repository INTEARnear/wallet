import"./chunk-FZJ6SZKP.js";import"./chunk-SB4FWY32.js";import{f as U}from"./chunk-W4MYE3I6.js";import"./chunk-KR2VX4XO.js";import"./chunk-JRYBGSY3.js";import"./chunk-3CHQQAWX.js";import"./chunk-HANOCJWG.js";import"./chunk-25YBDBEP.js";import"./chunk-7FUATHPM.js";import"./chunk-YYMQ6HDD.js";import"./chunk-FB5BNV7C.js";import"./chunk-LW4FQU5S.js";import"./chunk-5BCUXIZJ.js";import"./chunk-BR7S6AGZ.js";import{h as D}from"./chunk-LTN6YROF.js";import{B as R,D as $,E as Z,F as W,I as C,K as N,M as h,N as I,P as T,a as j,b as z,d as q,f as x,i as X,k as b,r as v,s as J,z as Q}from"./chunk-N2WXLAZF.js";import"./chunk-X4QP7L3N.js";import"./chunk-N3PRX6SH.js";import{a as M}from"./chunk-B2LU4KHT.js";import{b as f}from"./chunk-IDZGCU4F.js";import{b as O,e as y,k as L}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as u,k as p,o as m}from"./chunk-JY5TIRRF.js";u();m();p();u();m();p();u();m();p();u();m();p();var s={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS"},S={[s.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[s.INVALID_RECIPIENT]:"Invalid recipient address",[s.INVALID_ASSET]:"Invalid asset specified",[s.INVALID_AMOUNT]:"Invalid payment amount",[s.UNKNOWN_ERROR]:"Unknown payment error occurred",[s.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[s.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[s.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[s.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[s.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[s.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[s.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status"},o=class n extends Error{get message(){return S[this.code]}constructor(e,r){super(S[e]),this.name="AppKitPayError",this.code=e,this.details=r,Error.captureStackTrace&&Error.captureStackTrace(this,n)}};u();m();p();u();m();p();var ee="https://rpc.walletconnect.org/v1/json-rpc";var B=class extends Error{};function pe(){let n=J.getSnapshot().projectId;return`${ee}?projectId=${n}`}async function H(n,e){let r=pe(),i=await(await fetch(r,{method:"POST",body:JSON.stringify({jsonrpc:"2.0",id:1,method:n,params:e}),headers:{"Content-Type":"application/json"}})).json();if(i.error)throw new B(i.error.message);return i}async function F(n){return(await H("reown_getExchanges",n)).result}async function te(n){return(await H("reown_getExchangePayUrl",n)).result}async function ne(n){return(await H("reown_getExchangeBuyStatus",n)).result}u();m();p();var me=["eip155","solana"],de={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function G(n,e){let{chainNamespace:r,chainId:a}=b.parseCaipNetworkId(n),c=de[r];if(!c)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${r}`);let i=c.native.assetNamespace,d=c.native.assetReference;return e!=="native"&&(i=c.defaultTokenNamespace,d=e),`${`${r}:${a}`}/${i}:${d}`}function re(n){let{chainNamespace:e}=b.parseCaipNetworkId(n);return me.includes(e)}u();m();p();async function ae(n){let{paymentAssetNetwork:e,activeCaipNetwork:r,approvedCaipNetworkIds:a,requestedCaipNetworks:c}=n,d=v.sortRequestedNetworks(a,c).find(Y=>Y.caipNetworkId===e);if(!d)throw new o(s.INVALID_PAYMENT_CONFIG);if(d.caipNetworkId===r.caipNetworkId)return;let w=h.getNetworkProp("supportsAllNetworks",d.chainNamespace);if(!(a?.includes(d.caipNetworkId)||w))throw new o(s.INVALID_PAYMENT_CONFIG);try{await h.switchActiveNetwork(d)}catch(Y){throw new o(s.GENERIC_PAYMENT_ERROR,Y)}}async function se(n,e,r){if(e!==x.CHAIN.EVM)throw new o(s.INVALID_CHAIN_NAMESPACE);if(!r.fromAddress)throw new o(s.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");let a=typeof r.amount=="string"?parseFloat(r.amount):r.amount;if(isNaN(a))throw new o(s.INVALID_PAYMENT_CONFIG);let c=n.metadata?.decimals??18,i=N.parseUnits(a.toString(),c);if(typeof i!="bigint")throw new o(s.GENERIC_PAYMENT_ERROR);return await N.sendTransaction({chainNamespace:e,to:r.recipient,address:r.fromAddress,value:i,data:"0x"})??void 0}async function ie(n,e){if(!e.fromAddress)throw new o(s.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");let r=n.asset,a=e.recipient,c=Number(n.metadata.decimals),i=N.parseUnits(e.amount.toString(),c);if(i===void 0)throw new o(s.GENERIC_PAYMENT_ERROR);return await N.writeContract({fromAddress:e.fromAddress,tokenAddress:r,args:[a,i],method:"transfer",abi:X.getERC20Abi(r),chainNamespace:x.CHAIN.EVM})??void 0}async function oe(n,e){if(n!==x.CHAIN.SOLANA)throw new o(s.INVALID_CHAIN_NAMESPACE);if(!e.fromAddress)throw new o(s.INVALID_PAYMENT_CONFIG,"fromAddress is required for Solana payments.");let r=typeof e.amount=="string"?parseFloat(e.amount):e.amount;if(isNaN(r)||r<=0)throw new o(s.INVALID_PAYMENT_CONFIG,"Invalid payment amount.");try{if(!U.getProvider(n))throw new o(s.GENERIC_PAYMENT_ERROR,"No Solana provider available.");let c=await N.sendTransaction({chainNamespace:x.CHAIN.SOLANA,to:e.recipient,value:r,tokenMint:e.tokenMint});if(!c)throw new o(s.GENERIC_PAYMENT_ERROR,"Transaction failed.");return c}catch(a){throw a instanceof o?a:new o(s.GENERIC_PAYMENT_ERROR,`Solana payment failed: ${a}`)}}var ce=0,K="unknown",t=j({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0}),l={state:t,subscribe(n){return z(t,()=>n(t))},subscribeKey(n,e){return q(t,n,e)},async handleOpenPay(n){this.resetState(),this.setPaymentConfig(n),this.subscribeEvents(),this.initializeAnalytics(),t.isConfigured=!0,R.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:t.exchanges,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount}}}),await T.open({view:"Pay"})},resetState(){t.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},t.recipient="0x0",t.amount=0,t.isConfigured=!1,t.error=null,t.isPaymentInProgress=!1,t.isLoading=!1,t.currentPayment=void 0},setPaymentConfig(n){if(!n.paymentAsset)throw new o(s.INVALID_PAYMENT_CONFIG);try{t.paymentAsset=n.paymentAsset,t.recipient=n.recipient,t.amount=n.amount,t.openInNewTab=n.openInNewTab??!0,t.redirectUrl=n.redirectUrl,t.payWithExchange=n.payWithExchange,t.error=null}catch(e){throw new o(s.INVALID_PAYMENT_CONFIG,e.message)}},getPaymentAsset(){return t.paymentAsset},getExchanges(){return t.exchanges},async fetchExchanges(){try{t.isLoading=!0;let n=await F({page:ce,asset:G(t.paymentAsset.network,t.paymentAsset.asset),amount:t.amount.toString()});t.exchanges=n.exchanges.slice(0,2)}catch{throw C.showError(S.UNABLE_TO_GET_EXCHANGES),new o(s.UNABLE_TO_GET_EXCHANGES)}finally{t.isLoading=!1}},async getAvailableExchanges(n){try{let e=n?.asset&&n?.network?G(n.network,n.asset):void 0;return await F({page:n?.page??ce,asset:e,amount:n?.amount?.toString()})}catch{throw new o(s.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(n,e,r=!1){try{let a=Number(e.amount),c=await te({exchangeId:n,asset:G(e.network,e.asset),amount:a.toString(),recipient:`${e.network}:${e.recipient}`});return R.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{exchange:{id:n},configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:a},currentPayment:{type:"exchange",exchangeId:n},headless:r}}),r&&(this.initiatePayment(),R.sendEvent({type:"track",event:"PAY_INITIATED",properties:{paymentId:t.paymentId||K,configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:a},currentPayment:{type:"exchange",exchangeId:n}}})),c}catch(a){throw a instanceof Error&&a.message.includes("is not supported")?new o(s.ASSET_NOT_SUPPORTED):new Error(a.message)}},async openPayUrl(n,e,r=!1){try{let a=await this.getPayUrl(n.exchangeId,e,r);if(!a)throw new o(s.UNABLE_TO_GET_PAY_URL);let i=n.openInNewTab??!0?"_blank":"_self";return v.openHref(a.url,i),a}catch(a){throw a instanceof o?t.error=a.message:t.error=S.GENERIC_PAYMENT_ERROR,new o(s.UNABLE_TO_GET_PAY_URL)}},subscribeEvents(){t.isConfigured||(U.subscribeProviders(async n=>{U.getProvider(h.state.activeChain)&&await this.handlePayment()}),I.subscribeKey("caipAddress",async n=>{n&&await this.handlePayment()}))},async handlePayment(){t.currentPayment={type:"wallet",status:"IN_PROGRESS"};let n=I.state.caipAddress;if(!n)return;let{chainId:e,address:r}=b.parseCaipAddress(n),a=h.state.activeChain;if(!r||!e||!a||!U.getProvider(a))return;let i=h.state.activeCaipNetwork;if(i&&!t.isPaymentInProgress)try{this.initiatePayment();let d=h.getAllRequestedCaipNetworks(),w=h.getAllApprovedCaipNetworkIds();switch(await ae({paymentAssetNetwork:t.paymentAsset.network,activeCaipNetwork:i,approvedCaipNetworkIds:w,requestedCaipNetworks:d}),await T.open({view:"PayLoading"}),a){case x.CHAIN.EVM:t.paymentAsset.asset==="native"&&(t.currentPayment.result=await se(t.paymentAsset,a,{recipient:t.recipient,amount:t.amount,fromAddress:r})),t.paymentAsset.asset.startsWith("0x")&&(t.currentPayment.result=await ie(t.paymentAsset,{recipient:t.recipient,amount:t.amount,fromAddress:r})),t.currentPayment.status="SUCCESS";break;case x.CHAIN.SOLANA:t.currentPayment.result=await oe(a,{recipient:t.recipient,amount:t.amount,fromAddress:r,tokenMint:t.paymentAsset.asset==="native"?void 0:t.paymentAsset.asset}),t.currentPayment.status="SUCCESS";break;default:throw new o(s.INVALID_CHAIN_NAMESPACE)}}catch(d){d instanceof o?t.error=d.message:t.error=S.GENERIC_PAYMENT_ERROR,t.currentPayment.status="FAILED",C.showError(t.error)}finally{t.isPaymentInProgress=!1}},getExchangeById(n){return t.exchanges.find(e=>e.id===n)},validatePayConfig(n){let{paymentAsset:e,recipient:r,amount:a}=n;if(!e)throw new o(s.INVALID_PAYMENT_CONFIG);if(!r)throw new o(s.INVALID_RECIPIENT);if(!e.asset)throw new o(s.INVALID_ASSET);if(a==null||a<=0)throw new o(s.INVALID_AMOUNT)},handlePayWithWallet(){let n=I.state.caipAddress;if(!n){$.push("Connect");return}let{chainId:e,address:r}=b.parseCaipAddress(n),a=h.state.activeChain;if(!r||!e||!a){$.push("Connect");return}this.handlePayment()},async handlePayWithExchange(n){try{t.currentPayment={type:"exchange",exchangeId:n};let{network:e,asset:r}=t.paymentAsset,a={network:e,asset:r,amount:t.amount,recipient:t.recipient},c=await this.getPayUrl(n,a);if(!c)throw new o(s.UNABLE_TO_INITIATE_PAYMENT);return t.currentPayment.sessionId=c.sessionId,t.currentPayment.status="IN_PROGRESS",t.currentPayment.exchangeId=n,this.initiatePayment(),{url:c.url,openInNewTab:t.openInNewTab}}catch(e){return e instanceof o?t.error=e.message:t.error=S.GENERIC_PAYMENT_ERROR,t.isPaymentInProgress=!1,C.showError(t.error),null}},async getBuyStatus(n,e){try{let r=await ne({sessionId:e,exchangeId:n});return(r.status==="SUCCESS"||r.status==="FAILED")&&R.sendEvent({type:"track",event:r.status==="SUCCESS"?"PAY_SUCCESS":"PAY_ERROR",properties:{paymentId:t.paymentId||K,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:"exchange",exchangeId:t.currentPayment?.exchangeId,sessionId:t.currentPayment?.sessionId,result:r.txHash}}}),r}catch{throw new o(s.UNABLE_TO_GET_BUY_STATUS)}},async updateBuyStatus(n,e){try{let r=await this.getBuyStatus(n,e);t.currentPayment&&(t.currentPayment.status=r.status,t.currentPayment.result=r.txHash),(r.status==="SUCCESS"||r.status==="FAILED")&&(t.isPaymentInProgress=!1)}catch{throw new o(s.UNABLE_TO_GET_BUY_STATUS)}},initiatePayment(){t.isPaymentInProgress=!0,t.paymentId=crypto.randomUUID()},initializeAnalytics(){t.analyticsSet||(t.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",n=>{if(t.currentPayment?.status&&t.currentPayment.status!=="UNKNOWN"){let e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[t.currentPayment.status];R.sendEvent({type:"track",event:e,properties:{paymentId:t.paymentId||K,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:t.currentPayment.type,exchangeId:t.currentPayment.exchangeId,sessionId:t.currentPayment.sessionId,result:t.currentPayment.result}}})}}))}};u();m();p();var le=O`
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }

  .token-display {
    padding: var(--wui-spacing-s) var(--wui-spacing-m);
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-bg-125);
    margin-top: var(--wui-spacing-s);
    margin-bottom: var(--wui-spacing-s);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--wui-spacing-xs);
  }
`;var _=function(n,e,r,a){var c=arguments.length,i=c<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,r):a,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,r,a);else for(var w=n.length-1;w>=0;w--)(d=n[w])&&(i=(c<3?d(i):c>3?d(e,r,i):d(e,r))||i);return c>3&&i&&Object.defineProperty(e,r,i),i},P=class extends L{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=l.state.exchanges,this.isLoading=l.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=I.state.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(l.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(l.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(I.subscribe(e=>this.connectedWalletInfo=e.connectedWalletInfo)),l.fetchExchanges()}get isWalletConnected(){return I.state.status==="connected"}render(){return y`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="s">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){let e=l.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=l.state.amount.toString()}renderPayWithWallet(){return re(this.networkName)?y`<wui-flex flexDirection="column" gap="s">
        ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`:y``}renderPaymentHeader(){let e=this.networkName;if(this.networkName){let a=h.getAllRequestedCaipNetworks().find(c=>c.caipNetworkId===this.networkName);a&&(e=a.name)}return y`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="xs">
          <wui-text variant="large-700" color="fg-100">${this.amount||"0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="xxs">
            <wui-text variant="paragraph-600" color="fg-100">
              ${this.tokenSymbol||"Unknown Asset"}
            </wui-text>
            ${e?y`
                  <wui-text variant="small-500" color="fg-200"> on ${e} </wui-text>
                `:""}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderConnectedView(){let e=this.connectedWalletInfo?.name||"connected wallet";return y`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        data-testid="wallet-payment-option"
      >
        <wui-flex alignItems="center" gap="s">
          <wui-wallet-image
            size="sm"
            imageSrc=${M(this.connectedWalletInfo?.icon)}
            name=${M(this.connectedWalletInfo?.name)}
          ></wui-wallet-image>
          <wui-text variant="paragraph-500" color="inherit">Pay with ${e}</wui-text>
        </wui-flex>
      </wui-list-item>

      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="disconnect"
        @click=${this.onDisconnect}
        data-testid="disconnect-button"
        ?chevron=${!1}
      >
        <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
      </wui-list-item>
    `}renderDisconnectedView(){return y`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="walletPlaceholder"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="paragraph-500" color="inherit">Pay from wallet</wui-text>
    </wui-list-item>`}renderExchangeOptions(){return this.isLoading?y`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`:this.exchanges.length===0?y`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="paragraph-500" color="fg-100">No exchanges available</wui-text>
      </wui-flex>`:this.exchanges.map(e=>y`
        <wui-list-item
          @click=${()=>this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${this.loadingExchangeId!==null}
        >
          <wui-flex alignItems="center" gap="s">
            ${this.loadingExchangeId===e.id?y`<wui-loading-spinner color="accent-100" size="md"></wui-loading-spinner>`:y`<wui-wallet-image
                  size="sm"
                  imageSrc=${M(e.imageUrl)}
                  name=${e.name}
                ></wui-wallet-image>`}
            <wui-text flexGrow="1" variant="paragraph-500" color="inherit"
              >Pay with ${e.name} <wui-spinner size="sm" color="fg-200"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){l.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;let r=await l.handlePayWithExchange(e);r&&(await T.open({view:"PayLoading"}),v.openHref(r.url,r.openInNewTab?"_blank":"_self"))}catch(r){console.error("Failed to pay with exchange",r),C.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await N.disconnect()}catch{console.error("Failed to disconnect"),C.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};P.styles=le;_([f()],P.prototype,"amount",void 0);_([f()],P.prototype,"tokenSymbol",void 0);_([f()],P.prototype,"networkName",void 0);_([f()],P.prototype,"exchanges",void 0);_([f()],P.prototype,"isLoading",void 0);_([f()],P.prototype,"loadingExchangeId",void 0);_([f()],P.prototype,"connectedWalletInfo",void 0);P=_([D("w3m-pay-view")],P);u();m();p();u();m();p();var ue=O`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }
`;var V=function(n,e,r,a){var c=arguments.length,i=c<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,r):a,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,r,a);else for(var w=n.length-1;w>=0;w--)(d=n[w])&&(i=(c<3?d(i):c>3?d(e,r,i):d(e,r))||i);return c>3&&i&&Object.defineProperty(e,r,i),i},ye=4e3,k=class extends L{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=l.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return y`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center"> ${this.getStateIcon()} </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            ${this.loadingMessage}
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            ${this.subMessage}
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}updateMessages(){switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;case"in-progress":default:l.state.currentPayment?.type==="exchange"?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet");break}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();case"in-progress":default:return this.loaderTemplate()}}setupExchangeSubscription(){l.state.currentPayment?.type==="exchange"&&(this.exchangeSubscription=setInterval(async()=>{let e=l.state.currentPayment?.exchangeId,r=l.state.currentPayment?.sessionId;e&&r&&(await l.updateBuyStatus(e,r),l.state.currentPayment?.status==="SUCCESS"&&clearInterval(this.exchangeSubscription))},ye))}setupSubscription(){l.subscribeKey("isPaymentInProgress",e=>{!e&&this.paymentState==="in-progress"&&(l.state.error||!l.state.currentPayment?.result?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{N.state.status!=="disconnected"&&T.close()},3e3))}),l.subscribeKey("error",e=>{e&&this.paymentState==="in-progress"&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){let e=Z.state.themeVariables["--w3m-border-radius-master"],r=e?parseInt(e.replace("px",""),10):4,a=this.getPaymentIcon();return y`
      <wui-flex justifyContent="center" alignItems="center" style="position: relative;">
        ${a?y`<wui-wallet-image size="lg" imageSrc=${a}></wui-wallet-image>`:null}
        <wui-loading-thumbnail radius=${r*9}></wui-loading-thumbnail>
      </wui-flex>
    `}getPaymentIcon(){let e=l.state.currentPayment;if(e){if(e.type==="exchange"){let r=e.exchangeId;if(r)return l.getExchangeById(r)?.imageUrl}if(e.type==="wallet"){let r=I.state.connectedWalletInfo?.icon;if(r)return r;let a=h.state.activeChain;if(!a)return;let c=W.getConnectorId(a);if(!c)return;let i=W.getConnectorById(c);return i?Q.getConnectorImage(i):void 0}}}successTemplate(){return y`<wui-icon size="xl" color="success-100" name="checkmark"></wui-icon>`}errorTemplate(){return y`<wui-icon size="xl" color="error-100" name="close"></wui-icon>`}};k.styles=ue;V([f()],k.prototype,"loadingMessage",void 0);V([f()],k.prototype,"subMessage",void 0);V([f()],k.prototype,"paymentState",void 0);k=V([D("w3m-pay-loading-view")],k);u();m();p();async function he(n){return l.handleOpenPay(n)}function we(){return l.getExchanges()}function fe(){return l.state.currentPayment?.result}function ge(){return l.state.error}function Ee(){return l.state.isPaymentInProgress}u();m();p();var mn={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},dn={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},yn={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}};export{k as W3mPayLoadingView,P as W3mPayView,mn as baseETH,yn as baseSepoliaETH,dn as baseUSDC,we as getExchanges,Ee as getIsPaymentInProgress,ge as getPayError,fe as getPayResult,he as openPay};
