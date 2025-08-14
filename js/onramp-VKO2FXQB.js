import"./chunk-I5TMZITV.js";import"./chunk-BKLZLZEK.js";import"./chunk-FEQETKPE.js";import"./chunk-DL3BFCQG.js";import"./chunk-YIUCGNHJ.js";import"./chunk-GQFDGAND.js";import"./chunk-SDXK353R.js";import"./chunk-P6THSYIV.js";import"./chunk-QHLNMUDK.js";import"./chunk-F3XJVLCK.js";import"./chunk-CEX7F6SD.js";import"./chunk-LFU5HR3D.js";import"./chunk-SUQYUI7P.js";import"./chunk-J6OVQL6H.js";import"./chunk-XZSMYPDE.js";import"./chunk-LO3FIKSF.js";import"./chunk-KBSPKF4N.js";import"./chunk-KVGBKSBS.js";import"./chunk-2RFD6UAP.js";import{a as h,b as d,g}from"./chunk-HILJYRBB.js";import{A as K,C as z,D as oe,G as O,H as X,I as _,J as A,K as m,O as M,Y as se,Z as w,a as ee,j as H,l as V,m as P,n as T,o as te,q as G,r as re,s as S,t as ie,z as Q}from"./chunk-UDTBWQKV.js";import"./chunk-ETAVA44A.js";import"./chunk-KIG3ADHQ.js";import"./chunk-JK5MJGFP.js";import"./chunk-COAJKL54.js";import"./chunk-65GJ65H6.js";import"./chunk-H6T4G3YK.js";import"./chunk-JBYAY2RL.js";import"./chunk-PIVQIF3J.js";import"./chunk-FILZKAK2.js";import"./chunk-OZZRRPYE.js";import"./chunk-FXML5DPA.js";import"./chunk-6OI5GZ4U.js";import"./chunk-YRGGSJIG.js";import{b as v,e as l,j as f}from"./chunk-5RP2GFJC.js";import{h as c,j as u,n as p}from"./chunk-KGCAX4NX.js";c();p();u();c();p();u();c();p();u();c();p();u();var ne=v`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    width: 100%;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xs);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--wui-spacing-s);
  }

  :host > wui-flex:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  .purchase-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: var(--wui-icon-box-size-lg);
    height: var(--wui-icon-box-size-lg);
  }

  .purchase-image-container wui-image {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: calc(var(--wui-icon-box-size-lg) / 2);
  }

  .purchase-image-container wui-image::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-icon-box-size-lg) / 2);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  .purchase-image-container wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }
`;var R=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},C=class extends f{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="Bought",this.purchaseValue="",this.purchaseCurrency="",this.date="",this.completed=!1,this.inProgress=!1,this.failed=!1,this.onClick=null,this.symbol=""}firstUpdated(){this.icon||this.fetchTokenImage()}render(){return l`
      <wui-flex>
        ${this.imageTemplate()}
        <wui-flex flexDirection="column" gap="4xs" flexGrow="1">
          <wui-flex gap="xxs" alignItems="center" justifyContent="flex-start">
            ${this.statusIconTemplate()}
            <wui-text variant="paragraph-500" color="fg-100"> ${this.label}</wui-text>
          </wui-flex>
          <wui-text variant="small-400" color="fg-200">
            + ${this.purchaseValue} ${this.purchaseCurrency}
          </wui-text>
        </wui-flex>
        ${this.inProgress?l`<wui-loading-spinner color="fg-200" size="md"></wui-loading-spinner>`:l`<wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>`}
      </wui-flex>
    `}async fetchTokenImage(){await re._fetchTokenImage(this.purchaseCurrency)}statusIconTemplate(){return this.inProgress?null:this.completed?this.boughtIconTemplate():this.errorIconTemplate()}errorIconTemplate(){return l`<wui-icon-box
      size="xxs"
      iconColor="error-100"
      backgroundColor="error-100"
      background="opaque"
      icon="close"
      borderColor="wui-color-bg-125"
    ></wui-icon-box>`}imageTemplate(){let e=this.icon||`https://avatar.vercel.sh/andrew.svg?size=50&text=${this.symbol}`;return l`<wui-flex class="purchase-image-container">
      <wui-image src=${e}></wui-image>
    </wui-flex>`}boughtIconTemplate(){return l`<wui-icon-box
      size="xxs"
      iconColor="success-100"
      backgroundColor="success-100"
      background="opaque"
      icon="arrowBottom"
      borderColor="wui-color-bg-125"
    ></wui-icon-box>`}};C.styles=[ne];R([h({type:Boolean})],C.prototype,"disabled",void 0);R([h()],C.prototype,"color",void 0);R([h()],C.prototype,"label",void 0);R([h()],C.prototype,"purchaseValue",void 0);R([h()],C.prototype,"purchaseCurrency",void 0);R([h()],C.prototype,"date",void 0);R([h({type:Boolean})],C.prototype,"completed",void 0);R([h({type:Boolean})],C.prototype,"inProgress",void 0);R([h({type:Boolean})],C.prototype,"failed",void 0);R([h()],C.prototype,"onClick",void 0);R([h()],C.prototype,"symbol",void 0);R([h()],C.prototype,"icon",void 0);C=R([w("w3m-onramp-activity-item")],C);c();p();u();var ae=v`
  :host > wui-flex {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    padding: var(--wui-spacing-m);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }

  :host > wui-flex > wui-flex {
    width: 100%;
  }

  wui-transaction-list-item-loader {
    width: 100%;
  }
`;var Y=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},ge=7,L=class extends f{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=m.state.selectedProvider,this.loading=!1,this.coinbaseTransactions=z.state.coinbaseTransactions,this.tokenImages=T.state.tokenImages,this.unsubscribe.push(m.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e}),T.subscribeKey("tokenImages",e=>this.tokenImages=e),()=>{clearTimeout(this.refetchTimeout)},z.subscribe(e=>{this.coinbaseTransactions={...e.coinbaseTransactions}})),z.clearCursor(),this.fetchTransactions()}render(){return l`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.loading?this.templateLoading():this.templateTransactionsByYear()}
      </wui-flex>
    `}templateTransactions(e){return e?.map(r=>{let i=ee.formatDate(r?.metadata?.minedAt),o=r.transfers[0],t=o?.fungible_info;if(!t)return null;let s=t?.icon?.url||this.tokenImages?.[t.symbol||""];return l`
        <w3m-onramp-activity-item
          label="Bought"
          .completed=${r.metadata.status==="ONRAMP_TRANSACTION_STATUS_SUCCESS"}
          .inProgress=${r.metadata.status==="ONRAMP_TRANSACTION_STATUS_IN_PROGRESS"}
          .failed=${r.metadata.status==="ONRAMP_TRANSACTION_STATUS_FAILED"}
          purchaseCurrency=${g(t.symbol)}
          purchaseValue=${o.quantity.numeric}
          date=${i}
          icon=${g(s)}
          symbol=${g(t.symbol)}
        ></w3m-onramp-activity-item>
      `})}templateTransactionsByYear(){return Object.keys(this.coinbaseTransactions).sort().reverse().map(r=>{let i=parseInt(r,10);return new Array(12).fill(null).map((t,s)=>s).reverse().map(t=>{let s=se.getTransactionGroupTitle(i,t),a=this.coinbaseTransactions[i]?.[t];return a?l`
          <wui-flex flexDirection="column">
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200">${s}</wui-text>
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(a)}
            </wui-flex>
          </wui-flex>
        `:null})})}async fetchTransactions(){"coinbase"==="coinbase"&&await this.fetchCoinbaseTransactions()}async fetchCoinbaseTransactions(){let e=_.state.address,r=P.state.projectId;if(!e)throw new Error("No address found");if(!r)throw new Error("No projectId found");this.loading=!0,await z.fetchTransactions(e,"coinbase"),this.loading=!1,this.refetchLoadingTransactions()}refetchLoadingTransactions(){let e=new Date;if((this.coinbaseTransactions[e.getFullYear()]?.[e.getMonth()]||[]).filter(o=>o.metadata.status==="ONRAMP_TRANSACTION_STATUS_IN_PROGRESS").length===0){clearTimeout(this.refetchTimeout);return}this.refetchTimeout=setTimeout(async()=>{let o=_.state.address;await z.fetchTransactions(o,"coinbase"),this.refetchLoadingTransactions()},3e3)}templateLoading(){return Array(ge).fill(l` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(e=>e)}};L.styles=ae;Y([d()],L.prototype,"selectedOnRampProvider",void 0);Y([d()],L.prototype,"loading",void 0);Y([d()],L.prototype,"coinbaseTransactions",void 0);Y([d()],L.prototype,"tokenImages",void 0);L=Y([w("w3m-onramp-activity-view")],L);c();p();u();c();p();u();var le=v`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var F=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},U=class extends f{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=m.state.paymentCurrency,this.currencies=m.state.paymentCurrencies,this.currencyImages=T.state.currencyImages,this.checked=M.state.isLegalCheckboxChecked,this.unsubscribe.push(m.subscribe(e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies}),T.subscribeKey("currencyImages",e=>this.currencyImages=e),M.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=P.state,i=P.state.features?.legalCheckbox,s=!!(e||r)&&!!i&&!this.checked;return l`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","s","s","s"]}
        gap="xs"
        class=${g(s?"disabled":void 0)}
      >
        ${this.currenciesTemplate(s)}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}currenciesTemplate(e=!1){return this.currencies.map(r=>l`
        <wui-list-item
          imageSrc=${g(this.currencyImages?.[r.id])}
          @click=${()=>this.selectCurrency(r)}
          variant="image"
          tabIdx=${g(e?-1:void 0)}
        >
          <wui-text variant="paragraph-500" color="fg-100">${r.id}</wui-text>
        </wui-list-item>
      `)}selectCurrency(e){e&&(m.setPaymentCurrency(e),A.close())}};U.styles=le;F([d()],U.prototype,"selectedCurrency",void 0);F([d()],U.prototype,"currencies",void 0);F([d()],U.prototype,"currencyImages",void 0);F([d()],U.prototype,"checked",void 0);U=F([w("w3m-onramp-fiat-select-view")],U);c();p();u();c();p();u();c();p();u();var ce=v`
  button {
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xs);
    border: none;
    outline: none;
    background-color: var(--wui-color-gray-glass-002);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--wui-spacing-s);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }

  .provider-image {
    width: var(--wui-spacing-3xl);
    min-width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
    border-radius: calc(var(--wui-border-radius-xs) - calc(var(--wui-spacing-s) / 2));
    position: relative;
    overflow: hidden;
  }

  .provider-image::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-border-radius-xs) - calc(var(--wui-spacing-s) / 2));
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  .network-icon {
    width: var(--wui-spacing-m);
    height: var(--wui-spacing-m);
    border-radius: calc(var(--wui-spacing-m) / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-002),
      0 0 0 3px var(--wui-color-modal-bg);
    transition: box-shadow var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: box-shadow;
  }

  button:hover .network-icon {
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-005),
      0 0 0 3px var(--wui-color-modal-bg);
  }
`;var j=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},$=class extends f{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="",this.feeRange="",this.loading=!1,this.onClick=null}render(){return l`
      <button ?disabled=${this.disabled} @click=${this.onClick} ontouchstart>
        <wui-visual name=${g(this.name)} class="provider-image"></wui-visual>
        <wui-flex flexDirection="column" gap="4xs">
          <wui-text variant="paragraph-500" color="fg-100">${this.label}</wui-text>
          <wui-flex alignItems="center" justifyContent="flex-start" gap="l">
            <wui-text variant="tiny-500" color="fg-100">
              <wui-text variant="tiny-400" color="fg-200">Fees</wui-text>
              ${this.feeRange}
            </wui-text>
            <wui-flex gap="xxs">
              <wui-icon name="bank" size="xs" color="fg-150"></wui-icon>
              <wui-icon name="card" size="xs" color="fg-150"></wui-icon>
            </wui-flex>
            ${this.networksTemplate()}
          </wui-flex>
        </wui-flex>
        ${this.loading?l`<wui-loading-spinner color="fg-200" size="md"></wui-loading-spinner>`:l`<wui-icon name="chevronRight" color="fg-200" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){let r=O.getAllRequestedCaipNetworks()?.filter(i=>i?.assets?.imageId)?.slice(0,5);return l`
      <wui-flex class="networks">
        ${r?.map(i=>l`
            <wui-flex class="network-icon">
              <wui-image src=${g(te.getNetworkImage(i))}></wui-image>
            </wui-flex>
          `)}
      </wui-flex>
    `}};$.styles=[ce];j([h({type:Boolean})],$.prototype,"disabled",void 0);j([h()],$.prototype,"color",void 0);j([h()],$.prototype,"name",void 0);j([h()],$.prototype,"label",void 0);j([h()],$.prototype,"feeRange",void 0);j([h({type:Boolean})],$.prototype,"loading",void 0);j([h()],$.prototype,"onClick",void 0);$=j([w("w3m-onramp-provider-item")],$);c();p();u();c();p();u();var ue=v`
  wui-flex {
    border-top: 1px solid var(--wui-color-gray-glass-005);
  }

  a {
    text-decoration: none;
    color: var(--wui-color-fg-175);
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-3xs);
  }
`;var ye=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},J=class extends f{render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=P.state;return!e&&!r?null:l`
      <wui-flex
        .padding=${["m","s","s","s"]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="s"
      >
        <wui-text color="fg-250" variant="small-400" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `}howDoesItWorkTemplate(){return l` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-100" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){let e=O.state.activeChain;G.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:_.state.preferredAccountTypes?.[e]===Q.ACCOUNT_TYPES.SMART_ACCOUNT}}),S.push("WhatIsABuy")}};J.styles=[ue];J=ye([w("w3m-onramp-providers-footer")],J);var pe=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},Z=class extends f{constructor(){super(),this.unsubscribe=[],this.providers=m.state.providers,this.unsubscribe.push(m.subscribeKey("providers",e=>{this.providers=e}))}firstUpdated(){let e=this.providers.map(async r=>r.name==="coinbase"?await this.getCoinbaseOnRampURL():Promise.resolve(r?.url));Promise.all(e).then(r=>{this.providers=this.providers.map((i,o)=>({...i,url:r[o]||""}))})}render(){return l`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
      <w3m-onramp-providers-footer></w3m-onramp-providers-footer>
    `}onRampProvidersTemplate(){return this.providers.filter(e=>e.supportedChains.includes(O.state.activeChain??"eip155")).map(e=>l`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
            data-testid=${`onramp-provider-${e.name}`}
          ></w3m-onramp-provider-item>
        `)}onClickProvider(e){let r=O.state.activeChain;m.setSelectedProvider(e),S.push("BuyInProgress"),V.openHref(e.url,"popupWindow","width=600,height=800,scrollbars=yes"),G.sendEvent({type:"track",event:"SELECT_BUY_PROVIDER",properties:{provider:e.name,isSmartAccount:_.state.preferredAccountTypes?.[r]===Q.ACCOUNT_TYPES.SMART_ACCOUNT}})}async getCoinbaseOnRampURL(){let e=_.state.address,r=O.state.activeCaipNetwork;if(!e)throw new Error("No address found");if(!r?.name)throw new Error("No network found");let i=H.WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP[r.name]??H.WC_COINBASE_PAY_SDK_FALLBACK_CHAIN,o=m.state.purchaseCurrency,t=o?[o.symbol]:m.state.purchaseCurrencies.map(s=>s.symbol);return await X.generateOnRampURL({defaultNetwork:i,destinationWallets:[{address:e,blockchains:H.WC_COINBASE_PAY_SDK_CHAINS,assets:t}],partnerUserId:e,purchaseAmount:m.state.purchaseAmount})}};pe([d()],Z.prototype,"providers",void 0);Z=pe([w("w3m-onramp-providers-view")],Z);c();p();u();c();p();u();var me=v`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var q=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},B=class extends f{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=m.state.purchaseCurrencies,this.tokens=m.state.purchaseCurrencies,this.tokenImages=T.state.tokenImages,this.checked=M.state.isLegalCheckboxChecked,this.unsubscribe.push(m.subscribe(e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies}),T.subscribeKey("tokenImages",e=>this.tokenImages=e),M.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=P.state,i=P.state.features?.legalCheckbox,s=!!(e||r)&&!!i&&!this.checked;return l`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","s","s","s"]}
        gap="xs"
        class=${g(s?"disabled":void 0)}
      >
        ${this.currenciesTemplate(s)}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}currenciesTemplate(e=!1){return this.tokens.map(r=>l`
        <wui-list-item
          imageSrc=${g(this.tokenImages?.[r.symbol])}
          @click=${()=>this.selectToken(r)}
          variant="image"
          tabIdx=${g(e?-1:void 0)}
        >
          <wui-flex gap="3xs" alignItems="center">
            <wui-text variant="paragraph-500" color="fg-100">${r.name}</wui-text>
            <wui-text variant="small-400" color="fg-200">${r.symbol}</wui-text>
          </wui-flex>
        </wui-list-item>
      `)}selectToken(e){e&&(m.setPurchaseCurrency(e),A.close())}};B.styles=me;q([d()],B.prototype,"selectedCurrency",void 0);q([d()],B.prototype,"tokens",void 0);q([d()],B.prototype,"tokenImages",void 0);q([d()],B.prototype,"checked",void 0);B=q([w("w3m-onramp-token-select-view")],B);c();p();u();c();p();u();var de=v`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-visual {
    width: var(--wui-wallet-image-size-lg);
    height: var(--wui-wallet-image-size-lg);
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    position: relative;
    overflow: hidden;
  }

  wui-visual::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity var(--wui-ease-out-power-2) var(--wui-duration-lg),
      transform var(--wui-ease-out-power-2) var(--wui-duration-lg);
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
  }
`;var k=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},I=class extends f{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=m.state.selectedProvider,this.uri=oe.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.startTime=null,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(m.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e})),this.watchTransactions()}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e="Continue in external window";this.error?e="Buy failed":this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);let r=this.error?"Buy can be declined from your side or due to and error on the provider app":"We\u2019ll notify you once your Buy is processed";return l`
      <wui-flex
        data-error=${g(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-visual
            name=${g(this.selectedOnRampProvider?.name)}
            size="lg"
            class="provider-image"
          >
          </wui-visual>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${e}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${r}</wui-text>
        </wui-flex>

        ${this.error?this.tryAgainTemplate():null}
      </wui-flex>

      <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
        <wui-link @click=${this.onCopyUri} color="fg-200">
          <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
          Copy link
        </wui-link>
      </wui-flex>
    `}watchTransactions(){if(this.selectedOnRampProvider)switch(this.selectedOnRampProvider.name){case"coinbase":this.startTime=Date.now(),this.initializeCoinbaseTransactions();break;default:break}}async initializeCoinbaseTransactions(){await this.watchCoinbaseTransactions(),this.intervalId=setInterval(()=>this.watchCoinbaseTransactions(),4e3)}async watchCoinbaseTransactions(){try{let e=_.state.address;if(!e)throw new Error("No address found");(await X.fetchTransactions({account:e,onramp:"coinbase"})).data.filter(o=>new Date(o.metadata.minedAt)>new Date(this.startTime)||o.metadata.status==="ONRAMP_TRANSACTION_STATUS_IN_PROGRESS").length?(clearInterval(this.intervalId),S.replace("OnRampActivity")):this.startTime&&Date.now()-this.startTime>=18e4&&(clearInterval(this.intervalId),this.error=!0)}catch(e){K.showError(e)}}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,V.openHref(this.selectedOnRampProvider.url,"popupWindow","width=600,height=800,scrollbars=yes"))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?l`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){let e=ie.state.themeVariables["--w3m-border-radius-master"],r=e?parseInt(e.replace("px",""),10):4;return l`<wui-loading-thumbnail radius=${r*9}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url){K.showError("No link found"),S.goBack();return}try{V.copyToClopboard(this.selectedOnRampProvider.url),K.showSuccess("Link copied")}catch{K.showError("Failed to copy")}}};I.styles=de;k([d()],I.prototype,"intervalId",void 0);k([d()],I.prototype,"selectedOnRampProvider",void 0);k([d()],I.prototype,"uri",void 0);k([d()],I.prototype,"ready",void 0);k([d()],I.prototype,"showRetry",void 0);k([d()],I.prototype,"buffering",void 0);k([d()],I.prototype,"error",void 0);k([d()],I.prototype,"startTime",void 0);k([h({type:Boolean})],I.prototype,"isMobile",void 0);k([h()],I.prototype,"onRetry",void 0);I=k([w("w3m-buy-in-progress-view")],I);c();p();u();var be=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},he=class extends f{render(){return l`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","3xl","xl","3xl"]}
        alignItems="center"
        gap="xl"
      >
        <wui-visual name="onrampCard"></wui-visual>
        <wui-flex flexDirection="column" gap="xs" alignItems="center">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            Quickly and easily buy digital assets!
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            Simply select your preferred onramp provider and add digital assets to your account
            using your credit card or bank transfer
          </wui-text>
        </wui-flex>
        <wui-button @click=${S.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};he=be([w("w3m-what-is-a-buy-view")],he);c();p();u();c();p();u();c();p();u();var fe=v`
  :host {
    width: 100%;
  }

  wui-loading-spinner {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .currency-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: var(--wui-spacing-1xs);
    height: 40px;
    padding: var(--wui-spacing-xs) var(--wui-spacing-1xs) var(--wui-spacing-xs)
      var(--wui-spacing-xs);
    min-width: 95px;
    border-radius: var(--FULL, 1000px);
    border: 1px solid var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    cursor: pointer;
  }

  .currency-container > wui-image {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
`;var W=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},N=class extends f{constructor(){super(),this.unsubscribe=[],this.type="Token",this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=T.state.currencyImages,this.tokenImages=T.state.tokenImages,this.unsubscribe.push(m.subscribeKey("purchaseCurrency",e=>{!e||this.type==="Fiat"||(this.selectedCurrency=this.formatPurchaseCurrency(e))}),m.subscribeKey("paymentCurrency",e=>{!e||this.type==="Token"||(this.selectedCurrency=this.formatPaymentCurrency(e))}),m.subscribe(e=>{this.type==="Fiat"?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)}),T.subscribe(e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}}))}firstUpdated(){m.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.selectedCurrency?.symbol||"",r=this.currencyImages[e]||this.tokenImages[e];return l`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?l` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="xxs"
            @click=${()=>A.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${g(r)}></wui-image>
            <wui-text color="fg-100">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:l`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};N.styles=fe;W([h({type:String})],N.prototype,"type",void 0);W([h({type:Number})],N.prototype,"value",void 0);W([d()],N.prototype,"currencies",void 0);W([d()],N.prototype,"selectedCurrency",void 0);W([d()],N.prototype,"currencyImages",void 0);W([d()],N.prototype,"tokenImages",void 0);N=W([w("w3m-onramp-input")],N);c();p();u();var we=v`
  :host > wui-flex {
    width: 100%;
    max-width: 360px;
  }

  :host > wui-flex > wui-flex {
    border-radius: var(--wui-border-radius-l);
    width: 100%;
  }

  .amounts-container {
    width: 100%;
  }
`;var D=function(n,e,r,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,r,t):s(e,r))||t);return o>3&&t&&Object.defineProperty(e,r,t),t},xe={USD:"$",EUR:"\u20AC",GBP:"\xA3"},ve=[100,250,500,1e3],E=class extends f{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=O.state.activeCaipAddress,this.loading=A.state.loading,this.paymentCurrency=m.state.paymentCurrency,this.paymentAmount=m.state.paymentAmount,this.purchaseAmount=m.state.purchaseAmount,this.quoteLoading=m.state.quotesLoading,this.unsubscribe.push(O.subscribeKey("activeCaipAddress",e=>this.caipAddress=e),A.subscribeKey("loading",e=>{this.loading=e}),m.subscribe(e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return l`
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center">
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <w3m-onramp-input
            type="Fiat"
            @inputChange=${this.onPaymentAmountChange.bind(this)}
            .value=${this.paymentAmount||0}
          ></w3m-onramp-input>
          <w3m-onramp-input
            type="Token"
            .value=${this.purchaseAmount||0}
            .loading=${this.quoteLoading}
          ></w3m-onramp-input>
          <wui-flex justifyContent="space-evenly" class="amounts-container" gap="xs">
            ${ve.map(e=>l`<wui-button
                  variant=${this.paymentAmount===e?"accent":"neutral"}
                  size="md"
                  textVariant="paragraph-600"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${xe[this.paymentCurrency?.id||"USD"]} ${e}`}</wui-button
                >`)}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?l`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="main"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:l`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||A.open({view:"OnRampProviders"})}openModal(){A.open({view:"Connect"})}async onPaymentAmountChange(e){m.setPaymentAmount(Number(e.detail)),await m.getQuote()}async selectPresetAmount(e){m.setPaymentAmount(e),await m.getQuote()}};E.styles=we;D([h({type:Boolean})],E.prototype,"disabled",void 0);D([d()],E.prototype,"caipAddress",void 0);D([d()],E.prototype,"loading",void 0);D([d()],E.prototype,"paymentCurrency",void 0);D([d()],E.prototype,"paymentAmount",void 0);D([d()],E.prototype,"purchaseAmount",void 0);D([d()],E.prototype,"quoteLoading",void 0);E=D([w("w3m-onramp-widget")],E);export{I as W3mBuyInProgressView,L as W3mOnRampActivityView,Z as W3mOnRampProvidersView,U as W3mOnrampFiatSelectView,B as W3mOnrampTokensView,E as W3mOnrampWidget,he as W3mWhatIsABuyView};
