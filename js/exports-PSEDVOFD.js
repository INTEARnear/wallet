import"./chunk-OZ4WBTSF.js";import"./chunk-N5247CTU.js";import{e as v}from"./chunk-UYWH7IPM.js";import"./chunk-RHJ36K5M.js";import"./chunk-JEYC5NGA.js";import"./chunk-SYCSXG2Q.js";import"./chunk-5ECMN2P4.js";import"./chunk-OMGSBEMZ.js";import"./chunk-NN4K4YIW.js";import"./chunk-KU4SZW5M.js";import"./chunk-JEGJJ3CB.js";import"./chunk-WQMDXFUC.js";import"./chunk-J4VZ2IKP.js";import"./chunk-37JX4LZT.js";import{B as w,D as y,F as f,H as g,W as U,b as C,e as B,g as I,k as P,l as H,p as x,r as L,s as K,z as A}from"./chunk-ORERQN7J.js";import{b as d,g as b}from"./chunk-G6MGL5IE.js";import{d as Y,e as W,h as $}from"./chunk-YDPF4UGR.js";import"./chunk-F3BT2OCD.js";import"./chunk-OIFNSKKM.js";import"./chunk-YY5EM6U5.js";import"./chunk-LHWHJQRC.js";import"./chunk-JJVWQEYF.js";import"./chunk-JGRP444H.js";import"./chunk-URLXKBQX.js";import"./chunk-FFQJ55XB.js";import"./chunk-6K56CBXQ.js";import{b as T,e as p,j as S}from"./chunk-WGWCH7J2.js";import"./chunk-57YRCRKT.js";var a={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS"},N={[a.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[a.INVALID_RECIPIENT]:"Invalid recipient address",[a.INVALID_ASSET]:"Invalid asset specified",[a.INVALID_AMOUNT]:"Invalid payment amount",[a.UNKNOWN_ERROR]:"Unknown payment error occurred",[a.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[a.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[a.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[a.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[a.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[a.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[a.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status"},c=class n extends Error{get message(){return N[this.code]}constructor(e,r){super(N[e]),this.name="AppKitPayError",this.code=e,this.details=r,Error.captureStackTrace&&Error.captureStackTrace(this,n)}};var F="https://rpc.walletconnect.org/v1/json-rpc";var M=class extends Error{};function ne(){let n=H.getSnapshot().projectId;return`${F}?projectId=${n}`}async function D(n,e){let r=ne(),i=await(await fetch(r,{method:"POST",body:JSON.stringify({jsonrpc:"2.0",id:1,method:n,params:e}),headers:{"Content-Type":"application/json"}})).json();if(i.error)throw new M(i.error.message);return i}async function G(n){return(await D("reown_getExchanges",n)).result}async function j(n){return(await D("reown_getExchangePayUrl",n)).result}async function z(n){return(await D("reown_getExchangeBuyStatus",n)).result}var re=["eip155"],se={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function R(n,e){let{chainNamespace:r,chainId:s}=I.parseCaipNetworkId(n),o=se[r];if(!o)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${r}`);let i=o.native.assetNamespace,u=o.native.assetReference;return e!=="native"&&(i=o.defaultTokenNamespace,u=e),`${`${r}:${s}`}/${i}:${u}`}function q(n){let{chainNamespace:e}=I.parseCaipNetworkId(n);return re.includes(e)}async function X(n){let{paymentAssetNetwork:e,activeCaipNetwork:r,approvedCaipNetworkIds:s,requestedCaipNetworks:o}=n,u=P.sortRequestedNetworks(s,o).find(O=>O.caipNetworkId===e);if(!u)throw new c(a.INVALID_PAYMENT_CONFIG);if(u.caipNetworkId===r.caipNetworkId)return;let m=y.getNetworkProp("supportsAllNetworks",u.chainNamespace);if(!(s?.includes(u.caipNetworkId)||m))throw new c(a.INVALID_PAYMENT_CONFIG);try{await y.switchActiveNetwork(u)}catch(O){throw new c(a.GENERIC_PAYMENT_ERROR,O)}}async function J(n,e,r){if(e!==C.CHAIN.EVM)throw new c(a.INVALID_CHAIN_NAMESPACE);if(!r.fromAddress)throw new c(a.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");let s=typeof r.amount=="string"?parseFloat(r.amount):r.amount;if(isNaN(s))throw new c(a.INVALID_PAYMENT_CONFIG);let o=n.metadata?.decimals??18,i=w.parseUnits(s.toString(),o);if(typeof i!="bigint")throw new c(a.GENERIC_PAYMENT_ERROR);return await w.sendTransaction({chainNamespace:e,to:r.recipient,address:r.fromAddress,value:i,data:"0x"})??void 0}async function Q(n,e){if(!e.fromAddress)throw new c(a.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");let r=n.asset,s=e.recipient,o=Number(n.metadata.decimals),i=w.parseUnits(e.amount.toString(),o);if(i===void 0)throw new c(a.GENERIC_PAYMENT_ERROR);return await w.writeContract({fromAddress:e.fromAddress,tokenAddress:r,args:[s,i],method:"transfer",abi:B.getERC20Abi(r),chainNamespace:C.CHAIN.EVM})??void 0}var Z=0,V="unknown",t=Y({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0}),l={state:t,subscribe(n){return W(t,()=>n(t))},subscribeKey(n,e){return $(t,n,e)},async handleOpenPay(n){this.resetState(),this.setPaymentConfig(n),this.subscribeEvents(),this.initializeAnalytics(),t.isConfigured=!0,x.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:t.exchanges,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount}}}),await g.open({view:"Pay"})},resetState(){t.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},t.recipient="0x0",t.amount=0,t.isConfigured=!1,t.error=null,t.isPaymentInProgress=!1,t.isLoading=!1,t.currentPayment=void 0},setPaymentConfig(n){if(!n.paymentAsset)throw new c(a.INVALID_PAYMENT_CONFIG);try{t.paymentAsset=n.paymentAsset,t.recipient=n.recipient,t.amount=n.amount,t.openInNewTab=n.openInNewTab??!0,t.redirectUrl=n.redirectUrl,t.payWithExchange=n.payWithExchange,t.error=null}catch(e){throw new c(a.INVALID_PAYMENT_CONFIG,e.message)}},getPaymentAsset(){return t.paymentAsset},getExchanges(){return t.exchanges},async fetchExchanges(){try{t.isLoading=!0;let n=await G({page:Z,asset:R(t.paymentAsset.network,t.paymentAsset.asset),amount:t.amount.toString()});t.exchanges=n.exchanges.slice(0,2)}catch{throw A.showError(N.UNABLE_TO_GET_EXCHANGES),new c(a.UNABLE_TO_GET_EXCHANGES)}finally{t.isLoading=!1}},async getAvailableExchanges(n){try{let e=n?.asset&&n?.network?R(n.network,n.asset):void 0;return await G({page:n?.page??Z,asset:e,amount:n?.amount?.toString()})}catch{throw new c(a.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(n,e,r=!1){try{let s=Number(e.amount),o=await j({exchangeId:n,asset:R(e.network,e.asset),amount:s.toString(),recipient:`${e.network}:${e.recipient}`});return x.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{exchange:{id:n},configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:n},headless:r}}),r&&(this.initiatePayment(),x.sendEvent({type:"track",event:"PAY_INITIATED",properties:{paymentId:t.paymentId||V,configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:n}}})),o}catch(s){throw s instanceof Error&&s.message.includes("is not supported")?new c(a.ASSET_NOT_SUPPORTED):new Error(s.message)}},async openPayUrl(n,e,r=!1){try{let s=await this.getPayUrl(n.exchangeId,e,r);if(!s)throw new c(a.UNABLE_TO_GET_PAY_URL);let i=n.openInNewTab??!0?"_blank":"_self";return P.openHref(s.url,i),s}catch(s){throw s instanceof c?t.error=s.message:t.error=N.GENERIC_PAYMENT_ERROR,new c(a.UNABLE_TO_GET_PAY_URL)}},subscribeEvents(){t.isConfigured||(v.subscribeProviders(async n=>{let e=y.state.activeChain;v.getProvider(e)&&await this.handlePayment()}),f.subscribeKey("caipAddress",async n=>{n&&await this.handlePayment()}))},async handlePayment(){t.currentPayment={type:"wallet",status:"IN_PROGRESS"};let n=f.state.caipAddress;if(!n)return;let{chainId:e,address:r}=I.parseCaipAddress(n),s=y.state.activeChain;if(!r||!e||!s||!v.getProvider(s))return;let i=y.state.activeCaipNetwork;if(i&&!t.isPaymentInProgress)try{this.initiatePayment();let u=y.getAllRequestedCaipNetworks(),m=y.getAllApprovedCaipNetworkIds();switch(await X({paymentAssetNetwork:t.paymentAsset.network,activeCaipNetwork:i,approvedCaipNetworkIds:m,requestedCaipNetworks:u}),await g.open({view:"PayLoading"}),s){case C.CHAIN.EVM:t.paymentAsset.asset==="native"&&(t.currentPayment.result=await J(t.paymentAsset,s,{recipient:t.recipient,amount:t.amount,fromAddress:r})),t.paymentAsset.asset.startsWith("0x")&&(t.currentPayment.result=await Q(t.paymentAsset,{recipient:t.recipient,amount:t.amount,fromAddress:r})),t.currentPayment.status="SUCCESS";break;default:throw new c(a.INVALID_CHAIN_NAMESPACE)}}catch(u){u instanceof c?t.error=u.message:t.error=N.GENERIC_PAYMENT_ERROR,t.currentPayment.status="FAILED",A.showError(t.error)}finally{t.isPaymentInProgress=!1}},getExchangeById(n){return t.exchanges.find(e=>e.id===n)},validatePayConfig(n){let{paymentAsset:e,recipient:r,amount:s}=n;if(!e)throw new c(a.INVALID_PAYMENT_CONFIG);if(!r)throw new c(a.INVALID_RECIPIENT);if(!e.asset)throw new c(a.INVALID_ASSET);if(s==null||s<=0)throw new c(a.INVALID_AMOUNT)},handlePayWithWallet(){let n=f.state.caipAddress;if(!n){L.push("Connect");return}let{chainId:e,address:r}=I.parseCaipAddress(n),s=y.state.activeChain;if(!r||!e||!s){L.push("Connect");return}this.handlePayment()},async handlePayWithExchange(n){try{t.currentPayment={type:"exchange",exchangeId:n};let{network:e,asset:r}=t.paymentAsset,s={network:e,asset:r,amount:t.amount,recipient:t.recipient},o=await this.getPayUrl(n,s);if(!o)throw new c(a.UNABLE_TO_INITIATE_PAYMENT);return t.currentPayment.sessionId=o.sessionId,t.currentPayment.status="IN_PROGRESS",t.currentPayment.exchangeId=n,this.initiatePayment(),{url:o.url,openInNewTab:t.openInNewTab}}catch(e){return e instanceof c?t.error=e.message:t.error=N.GENERIC_PAYMENT_ERROR,t.isPaymentInProgress=!1,A.showError(t.error),null}},async getBuyStatus(n,e){try{let r=await z({sessionId:e,exchangeId:n});return(r.status==="SUCCESS"||r.status==="FAILED")&&x.sendEvent({type:"track",event:r.status==="SUCCESS"?"PAY_SUCCESS":"PAY_ERROR",properties:{paymentId:t.paymentId||V,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:"exchange",exchangeId:t.currentPayment?.exchangeId,sessionId:t.currentPayment?.sessionId,result:r.txHash}}}),r}catch{throw new c(a.UNABLE_TO_GET_BUY_STATUS)}},async updateBuyStatus(n,e){try{let r=await this.getBuyStatus(n,e);t.currentPayment&&(t.currentPayment.status=r.status,t.currentPayment.result=r.txHash),(r.status==="SUCCESS"||r.status==="FAILED")&&(t.isPaymentInProgress=!1)}catch{throw new c(a.UNABLE_TO_GET_BUY_STATUS)}},initiatePayment(){t.isPaymentInProgress=!0,t.paymentId=crypto.randomUUID()},initializeAnalytics(){t.analyticsSet||(t.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",n=>{if(t.currentPayment?.status&&t.currentPayment.status!=="UNKNOWN"){let e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[t.currentPayment.status];x.sendEvent({type:"track",event:e,properties:{paymentId:t.paymentId||V,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:t.currentPayment.type,exchangeId:t.currentPayment.exchangeId,sessionId:t.currentPayment.sessionId,result:t.currentPayment.result}}})}}))}};var ee=T`
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
`;var E=function(n,e,r,s){var o=arguments.length,i=o<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,r):s,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,r,s);else for(var m=n.length-1;m>=0;m--)(u=n[m])&&(i=(o<3?u(i):o>3?u(e,r,i):u(e,r))||i);return o>3&&i&&Object.defineProperty(e,r,i),i},h=class extends S{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=l.state.exchanges,this.isLoading=l.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=f.state.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(l.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(l.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(f.subscribe(e=>this.connectedWalletInfo=e.connectedWalletInfo)),l.fetchExchanges()}get isWalletConnected(){return f.state.status==="connected"}render(){return p`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="s">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){let e=l.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=l.state.amount.toString()}renderPayWithWallet(){return q(this.networkName)?p`<wui-flex flexDirection="column" gap="s">
        ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`:p``}renderPaymentHeader(){let e=this.networkName;if(this.networkName){let s=y.getAllRequestedCaipNetworks().find(o=>o.caipNetworkId===this.networkName);s&&(e=s.name)}return p`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="xs">
          <wui-text variant="large-700" color="fg-100">${this.amount||"0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="xxs">
            <wui-text variant="paragraph-600" color="fg-100">
              ${this.tokenSymbol||"Unknown Asset"}
            </wui-text>
            ${e?p`
                  <wui-text variant="small-500" color="fg-200"> on ${e} </wui-text>
                `:""}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderConnectedView(){let e=this.connectedWalletInfo?.name||"connected wallet";return p`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        data-testid="wallet-payment-option"
      >
        <wui-flex alignItems="center" gap="s">
          <wui-wallet-image
            size="sm"
            imageSrc=${b(this.connectedWalletInfo?.icon)}
            name=${b(this.connectedWalletInfo?.name)}
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
    `}renderDisconnectedView(){return p`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="walletPlaceholder"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="paragraph-500" color="inherit">Pay from wallet</wui-text>
    </wui-list-item>`}renderExchangeOptions(){return this.isLoading?p`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`:this.exchanges.length===0?p`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="paragraph-500" color="fg-100">No exchanges available</wui-text>
      </wui-flex>`:this.exchanges.map(e=>p`
        <wui-list-item
          @click=${()=>this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${this.loadingExchangeId!==null}
        >
          <wui-flex alignItems="center" gap="s">
            ${this.loadingExchangeId===e.id?p`<wui-loading-spinner color="accent-100" size="md"></wui-loading-spinner>`:p`<wui-wallet-image
                  size="sm"
                  imageSrc=${b(e.imageUrl)}
                  name=${e.name}
                ></wui-wallet-image>`}
            <wui-text flexGrow="1" variant="paragraph-500" color="inherit"
              >Pay with ${e.name} <wui-spinner size="sm" color="fg-200"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){l.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;let r=await l.handlePayWithExchange(e);r&&(await g.open({view:"PayLoading"}),P.openHref(r.url,r.openInNewTab?"_blank":"_self"))}catch(r){console.error("Failed to pay with exchange",r),A.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await w.disconnect(),g.close()}catch{console.error("Failed to disconnect"),A.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};h.styles=ee;E([d()],h.prototype,"amount",void 0);E([d()],h.prototype,"tokenSymbol",void 0);E([d()],h.prototype,"networkName",void 0);E([d()],h.prototype,"exchanges",void 0);E([d()],h.prototype,"isLoading",void 0);E([d()],h.prototype,"loadingExchangeId",void 0);E([d()],h.prototype,"connectedWalletInfo",void 0);h=E([U("w3m-pay-view")],h);var te=T`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }
`;var k=function(n,e,r,s){var o=arguments.length,i=o<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,r):s,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,r,s);else for(var m=n.length-1;m>=0;m--)(u=n[m])&&(i=(o<3?u(i):o>3?u(e,r,i):u(e,r))||i);return o>3&&i&&Object.defineProperty(e,r,i),i},ae=4e3,_=class extends S{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=l.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return p`
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
    `}updateMessages(){switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;case"in-progress":default:l.state.currentPayment?.type==="exchange"?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet");break}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();case"in-progress":default:return this.loaderTemplate()}}setupExchangeSubscription(){l.state.currentPayment?.type==="exchange"&&(this.exchangeSubscription=setInterval(async()=>{let e=l.state.currentPayment?.exchangeId,r=l.state.currentPayment?.sessionId;e&&r&&(await l.updateBuyStatus(e,r),l.state.currentPayment?.status==="SUCCESS"&&clearInterval(this.exchangeSubscription))},ae))}setupSubscription(){l.subscribeKey("isPaymentInProgress",e=>{!e&&this.paymentState==="in-progress"&&(l.state.error||!l.state.currentPayment?.result?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{w.state.status!=="disconnected"&&g.close()},3e3))}),l.subscribeKey("error",e=>{e&&this.paymentState==="in-progress"&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){let e=K.state.themeVariables["--w3m-border-radius-master"],r=e?parseInt(e.replace("px",""),10):4;return p`<wui-loading-thumbnail radius=${r*9}></wui-loading-thumbnail>`}successTemplate(){return p`<wui-icon size="xl" color="success-100" name="checkmark"></wui-icon>`}errorTemplate(){return p`<wui-icon size="xl" color="error-100" name="close"></wui-icon>`}};_.styles=te;k([d()],_.prototype,"loadingMessage",void 0);k([d()],_.prototype,"subMessage",void 0);k([d()],_.prototype,"paymentState",void 0);_=k([U("w3m-pay-loading-view")],_);async function ie(n){return l.handleOpenPay(n)}function oe(){return l.getExchanges()}function ce(){return l.state.currentPayment?.result}function le(){return l.state.error}function ue(){return l.state.isPaymentInProgress}var Nt={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},It={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},Pt={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}};export{_ as W3mPayLoadingView,h as W3mPayView,Nt as baseETH,Pt as baseSepoliaETH,It as baseUSDC,oe as getExchanges,ue as getIsPaymentInProgress,le as getPayError,ce as getPayResult,ie as openPay};
