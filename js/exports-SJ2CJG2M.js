import"./chunk-YD3MW4ED.js";import"./chunk-SYFDFVC7.js";import{e as M}from"./chunk-LSFPNUYI.js";import"./chunk-M4V3NYSY.js";import"./chunk-J2AXCH7B.js";import"./chunk-VD3CL2LB.js";import"./chunk-BVPCGFJI.js";import"./chunk-YKZ2H6IE.js";import"./chunk-ZIGIB2I5.js";import"./chunk-TH5JHSOM.js";import"./chunk-6OHO6DGB.js";import"./chunk-IXRLO5GV.js";import"./chunk-MLDJAIZD.js";import"./chunk-NSWQOQ7B.js";import{B as I,D as f,F as P,H as x,W as D,b as R,e as q,g as S,k as b,l as X,p as v,r as W,s as J,z as C}from"./chunk-WYPOXQ7L.js";import{b as w,g as L}from"./chunk-HILJYRBB.js";import{d as F,e as j,h as z}from"./chunk-ETAVA44A.js";import"./chunk-JK5MJGFP.js";import"./chunk-COAJKL54.js";import"./chunk-65GJ65H6.js";import"./chunk-H6T4G3YK.js";import"./chunk-FILZKAK2.js";import"./chunk-OZZRRPYE.js";import"./chunk-FXML5DPA.js";import"./chunk-6OI5GZ4U.js";import"./chunk-YRGGSJIG.js";import{b as k,e as y,j as O}from"./chunk-5RP2GFJC.js";import{h as u,j as p,n as m}from"./chunk-KGCAX4NX.js";u();m();p();u();m();p();u();m();p();u();m();p();var a={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS"},T={[a.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[a.INVALID_RECIPIENT]:"Invalid recipient address",[a.INVALID_ASSET]:"Invalid asset specified",[a.INVALID_AMOUNT]:"Invalid payment amount",[a.UNKNOWN_ERROR]:"Unknown payment error occurred",[a.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[a.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[a.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[a.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[a.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[a.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[a.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status"},c=class n extends Error{get message(){return T[this.code]}constructor(e,r){super(T[e]),this.name="AppKitPayError",this.code=e,this.details=r,Error.captureStackTrace&&Error.captureStackTrace(this,n)}};u();m();p();u();m();p();var Q="https://rpc.walletconnect.org/v1/json-rpc";var $=class extends Error{};function ce(){let n=X.getSnapshot().projectId;return`${Q}?projectId=${n}`}async function B(n,e){let r=ce(),i=await(await fetch(r,{method:"POST",body:JSON.stringify({jsonrpc:"2.0",id:1,method:n,params:e}),headers:{"Content-Type":"application/json"}})).json();if(i.error)throw new $(i.error.message);return i}async function H(n){return(await B("reown_getExchanges",n)).result}async function Z(n){return(await B("reown_getExchangePayUrl",n)).result}async function ee(n){return(await B("reown_getExchangeBuyStatus",n)).result}u();m();p();var le=["eip155"],ue={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function G(n,e){let{chainNamespace:r,chainId:s}=S.parseCaipNetworkId(n),o=ue[r];if(!o)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${r}`);let i=o.native.assetNamespace,d=o.native.assetReference;return e!=="native"&&(i=o.defaultTokenNamespace,d=e),`${`${r}:${s}`}/${i}:${d}`}function te(n){let{chainNamespace:e}=S.parseCaipNetworkId(n);return le.includes(e)}u();m();p();async function ne(n){let{paymentAssetNetwork:e,activeCaipNetwork:r,approvedCaipNetworkIds:s,requestedCaipNetworks:o}=n,d=b.sortRequestedNetworks(s,o).find(Y=>Y.caipNetworkId===e);if(!d)throw new c(a.INVALID_PAYMENT_CONFIG);if(d.caipNetworkId===r.caipNetworkId)return;let h=f.getNetworkProp("supportsAllNetworks",d.chainNamespace);if(!(s?.includes(d.caipNetworkId)||h))throw new c(a.INVALID_PAYMENT_CONFIG);try{await f.switchActiveNetwork(d)}catch(Y){throw new c(a.GENERIC_PAYMENT_ERROR,Y)}}async function re(n,e,r){if(e!==R.CHAIN.EVM)throw new c(a.INVALID_CHAIN_NAMESPACE);if(!r.fromAddress)throw new c(a.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");let s=typeof r.amount=="string"?parseFloat(r.amount):r.amount;if(isNaN(s))throw new c(a.INVALID_PAYMENT_CONFIG);let o=n.metadata?.decimals??18,i=I.parseUnits(s.toString(),o);if(typeof i!="bigint")throw new c(a.GENERIC_PAYMENT_ERROR);return await I.sendTransaction({chainNamespace:e,to:r.recipient,address:r.fromAddress,value:i,data:"0x"})??void 0}async function se(n,e){if(!e.fromAddress)throw new c(a.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");let r=n.asset,s=e.recipient,o=Number(n.metadata.decimals),i=I.parseUnits(e.amount.toString(),o);if(i===void 0)throw new c(a.GENERIC_PAYMENT_ERROR);return await I.writeContract({fromAddress:e.fromAddress,tokenAddress:r,args:[s,i],method:"transfer",abi:q.getERC20Abi(r),chainNamespace:R.CHAIN.EVM})??void 0}var ae=0,K="unknown",t=F({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0}),l={state:t,subscribe(n){return j(t,()=>n(t))},subscribeKey(n,e){return z(t,n,e)},async handleOpenPay(n){this.resetState(),this.setPaymentConfig(n),this.subscribeEvents(),this.initializeAnalytics(),t.isConfigured=!0,v.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:t.exchanges,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount}}}),await x.open({view:"Pay"})},resetState(){t.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},t.recipient="0x0",t.amount=0,t.isConfigured=!1,t.error=null,t.isPaymentInProgress=!1,t.isLoading=!1,t.currentPayment=void 0},setPaymentConfig(n){if(!n.paymentAsset)throw new c(a.INVALID_PAYMENT_CONFIG);try{t.paymentAsset=n.paymentAsset,t.recipient=n.recipient,t.amount=n.amount,t.openInNewTab=n.openInNewTab??!0,t.redirectUrl=n.redirectUrl,t.payWithExchange=n.payWithExchange,t.error=null}catch(e){throw new c(a.INVALID_PAYMENT_CONFIG,e.message)}},getPaymentAsset(){return t.paymentAsset},getExchanges(){return t.exchanges},async fetchExchanges(){try{t.isLoading=!0;let n=await H({page:ae,asset:G(t.paymentAsset.network,t.paymentAsset.asset),amount:t.amount.toString()});t.exchanges=n.exchanges.slice(0,2)}catch{throw C.showError(T.UNABLE_TO_GET_EXCHANGES),new c(a.UNABLE_TO_GET_EXCHANGES)}finally{t.isLoading=!1}},async getAvailableExchanges(n){try{let e=n?.asset&&n?.network?G(n.network,n.asset):void 0;return await H({page:n?.page??ae,asset:e,amount:n?.amount?.toString()})}catch{throw new c(a.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(n,e,r=!1){try{let s=Number(e.amount),o=await Z({exchangeId:n,asset:G(e.network,e.asset),amount:s.toString(),recipient:`${e.network}:${e.recipient}`});return v.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{exchange:{id:n},configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:n},headless:r}}),r&&(this.initiatePayment(),v.sendEvent({type:"track",event:"PAY_INITIATED",properties:{paymentId:t.paymentId||K,configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:s},currentPayment:{type:"exchange",exchangeId:n}}})),o}catch(s){throw s instanceof Error&&s.message.includes("is not supported")?new c(a.ASSET_NOT_SUPPORTED):new Error(s.message)}},async openPayUrl(n,e,r=!1){try{let s=await this.getPayUrl(n.exchangeId,e,r);if(!s)throw new c(a.UNABLE_TO_GET_PAY_URL);let i=n.openInNewTab??!0?"_blank":"_self";return b.openHref(s.url,i),s}catch(s){throw s instanceof c?t.error=s.message:t.error=T.GENERIC_PAYMENT_ERROR,new c(a.UNABLE_TO_GET_PAY_URL)}},subscribeEvents(){t.isConfigured||(M.subscribeProviders(async n=>{let e=f.state.activeChain;M.getProvider(e)&&await this.handlePayment()}),P.subscribeKey("caipAddress",async n=>{n&&await this.handlePayment()}))},async handlePayment(){t.currentPayment={type:"wallet",status:"IN_PROGRESS"};let n=P.state.caipAddress;if(!n)return;let{chainId:e,address:r}=S.parseCaipAddress(n),s=f.state.activeChain;if(!r||!e||!s||!M.getProvider(s))return;let i=f.state.activeCaipNetwork;if(i&&!t.isPaymentInProgress)try{this.initiatePayment();let d=f.getAllRequestedCaipNetworks(),h=f.getAllApprovedCaipNetworkIds();switch(await ne({paymentAssetNetwork:t.paymentAsset.network,activeCaipNetwork:i,approvedCaipNetworkIds:h,requestedCaipNetworks:d}),await x.open({view:"PayLoading"}),s){case R.CHAIN.EVM:t.paymentAsset.asset==="native"&&(t.currentPayment.result=await re(t.paymentAsset,s,{recipient:t.recipient,amount:t.amount,fromAddress:r})),t.paymentAsset.asset.startsWith("0x")&&(t.currentPayment.result=await se(t.paymentAsset,{recipient:t.recipient,amount:t.amount,fromAddress:r})),t.currentPayment.status="SUCCESS";break;default:throw new c(a.INVALID_CHAIN_NAMESPACE)}}catch(d){d instanceof c?t.error=d.message:t.error=T.GENERIC_PAYMENT_ERROR,t.currentPayment.status="FAILED",C.showError(t.error)}finally{t.isPaymentInProgress=!1}},getExchangeById(n){return t.exchanges.find(e=>e.id===n)},validatePayConfig(n){let{paymentAsset:e,recipient:r,amount:s}=n;if(!e)throw new c(a.INVALID_PAYMENT_CONFIG);if(!r)throw new c(a.INVALID_RECIPIENT);if(!e.asset)throw new c(a.INVALID_ASSET);if(s==null||s<=0)throw new c(a.INVALID_AMOUNT)},handlePayWithWallet(){let n=P.state.caipAddress;if(!n){W.push("Connect");return}let{chainId:e,address:r}=S.parseCaipAddress(n),s=f.state.activeChain;if(!r||!e||!s){W.push("Connect");return}this.handlePayment()},async handlePayWithExchange(n){try{t.currentPayment={type:"exchange",exchangeId:n};let{network:e,asset:r}=t.paymentAsset,s={network:e,asset:r,amount:t.amount,recipient:t.recipient},o=await this.getPayUrl(n,s);if(!o)throw new c(a.UNABLE_TO_INITIATE_PAYMENT);return t.currentPayment.sessionId=o.sessionId,t.currentPayment.status="IN_PROGRESS",t.currentPayment.exchangeId=n,this.initiatePayment(),{url:o.url,openInNewTab:t.openInNewTab}}catch(e){return e instanceof c?t.error=e.message:t.error=T.GENERIC_PAYMENT_ERROR,t.isPaymentInProgress=!1,C.showError(t.error),null}},async getBuyStatus(n,e){try{let r=await ee({sessionId:e,exchangeId:n});return(r.status==="SUCCESS"||r.status==="FAILED")&&v.sendEvent({type:"track",event:r.status==="SUCCESS"?"PAY_SUCCESS":"PAY_ERROR",properties:{paymentId:t.paymentId||K,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:"exchange",exchangeId:t.currentPayment?.exchangeId,sessionId:t.currentPayment?.sessionId,result:r.txHash}}}),r}catch{throw new c(a.UNABLE_TO_GET_BUY_STATUS)}},async updateBuyStatus(n,e){try{let r=await this.getBuyStatus(n,e);t.currentPayment&&(t.currentPayment.status=r.status,t.currentPayment.result=r.txHash),(r.status==="SUCCESS"||r.status==="FAILED")&&(t.isPaymentInProgress=!1)}catch{throw new c(a.UNABLE_TO_GET_BUY_STATUS)}},initiatePayment(){t.isPaymentInProgress=!0,t.paymentId=crypto.randomUUID()},initializeAnalytics(){t.analyticsSet||(t.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",n=>{if(t.currentPayment?.status&&t.currentPayment.status!=="UNKNOWN"){let e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[t.currentPayment.status];v.sendEvent({type:"track",event:e,properties:{paymentId:t.paymentId||K,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:t.currentPayment.type,exchangeId:t.currentPayment.exchangeId,sessionId:t.currentPayment.sessionId,result:t.currentPayment.result}}})}}))}};u();m();p();var ie=k`
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
`;var _=function(n,e,r,s){var o=arguments.length,i=o<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,r):s,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,r,s);else for(var h=n.length-1;h>=0;h--)(d=n[h])&&(i=(o<3?d(i):o>3?d(e,r,i):d(e,r))||i);return o>3&&i&&Object.defineProperty(e,r,i),i},N=class extends O{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=l.state.exchanges,this.isLoading=l.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=P.state.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(l.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(l.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(P.subscribe(e=>this.connectedWalletInfo=e.connectedWalletInfo)),l.fetchExchanges()}get isWalletConnected(){return P.state.status==="connected"}render(){return y`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="s">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){let e=l.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=l.state.amount.toString()}renderPayWithWallet(){return te(this.networkName)?y`<wui-flex flexDirection="column" gap="s">
        ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`:y``}renderPaymentHeader(){let e=this.networkName;if(this.networkName){let s=f.getAllRequestedCaipNetworks().find(o=>o.caipNetworkId===this.networkName);s&&(e=s.name)}return y`
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
            imageSrc=${L(this.connectedWalletInfo?.icon)}
            name=${L(this.connectedWalletInfo?.name)}
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
                  imageSrc=${L(e.imageUrl)}
                  name=${e.name}
                ></wui-wallet-image>`}
            <wui-text flexGrow="1" variant="paragraph-500" color="inherit"
              >Pay with ${e.name} <wui-spinner size="sm" color="fg-200"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){l.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;let r=await l.handlePayWithExchange(e);r&&(await x.open({view:"PayLoading"}),b.openHref(r.url,r.openInNewTab?"_blank":"_self"))}catch(r){console.error("Failed to pay with exchange",r),C.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await I.disconnect(),x.close()}catch{console.error("Failed to disconnect"),C.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};N.styles=ie;_([w()],N.prototype,"amount",void 0);_([w()],N.prototype,"tokenSymbol",void 0);_([w()],N.prototype,"networkName",void 0);_([w()],N.prototype,"exchanges",void 0);_([w()],N.prototype,"isLoading",void 0);_([w()],N.prototype,"loadingExchangeId",void 0);_([w()],N.prototype,"connectedWalletInfo",void 0);N=_([D("w3m-pay-view")],N);u();m();p();u();m();p();var oe=k`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }
`;var V=function(n,e,r,s){var o=arguments.length,i=o<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,r):s,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,r,s);else for(var h=n.length-1;h>=0;h--)(d=n[h])&&(i=(o<3?d(i):o>3?d(e,r,i):d(e,r))||i);return o>3&&i&&Object.defineProperty(e,r,i),i},pe=4e3,U=class extends O{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=l.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return y`
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
    `}updateMessages(){switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;case"in-progress":default:l.state.currentPayment?.type==="exchange"?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet");break}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();case"in-progress":default:return this.loaderTemplate()}}setupExchangeSubscription(){l.state.currentPayment?.type==="exchange"&&(this.exchangeSubscription=setInterval(async()=>{let e=l.state.currentPayment?.exchangeId,r=l.state.currentPayment?.sessionId;e&&r&&(await l.updateBuyStatus(e,r),l.state.currentPayment?.status==="SUCCESS"&&clearInterval(this.exchangeSubscription))},pe))}setupSubscription(){l.subscribeKey("isPaymentInProgress",e=>{!e&&this.paymentState==="in-progress"&&(l.state.error||!l.state.currentPayment?.result?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{I.state.status!=="disconnected"&&x.close()},3e3))}),l.subscribeKey("error",e=>{e&&this.paymentState==="in-progress"&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){let e=J.state.themeVariables["--w3m-border-radius-master"],r=e?parseInt(e.replace("px",""),10):4;return y`<wui-loading-thumbnail radius=${r*9}></wui-loading-thumbnail>`}successTemplate(){return y`<wui-icon size="xl" color="success-100" name="checkmark"></wui-icon>`}errorTemplate(){return y`<wui-icon size="xl" color="error-100" name="close"></wui-icon>`}};U.styles=oe;V([w()],U.prototype,"loadingMessage",void 0);V([w()],U.prototype,"subMessage",void 0);V([w()],U.prototype,"paymentState",void 0);U=V([D("w3m-pay-loading-view")],U);u();m();p();async function me(n){return l.handleOpenPay(n)}function de(){return l.getExchanges()}function ye(){return l.state.currentPayment?.result}function he(){return l.state.error}function we(){return l.state.isPaymentInProgress}u();m();p();var on={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},cn={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},ln={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}};export{U as W3mPayLoadingView,N as W3mPayView,on as baseETH,ln as baseSepoliaETH,cn as baseUSDC,de as getExchanges,we as getIsPaymentInProgress,he as getPayError,ye as getPayResult,me as openPay};
