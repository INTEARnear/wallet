import"./chunk-JRYBGSY3.js";import"./chunk-PLV3PJVC.js";import"./chunk-3CHQQAWX.js";import"./chunk-HANOCJWG.js";import"./chunk-ONZEZPXK.js";import"./chunk-25YBDBEP.js";import"./chunk-6EMLP2SS.js";import"./chunk-DW5UEWXF.js";import"./chunk-MIJMXO74.js";import"./chunk-3IF2M6VT.js";import"./chunk-7FUATHPM.js";import"./chunk-YYMQ6HDD.js";import"./chunk-FB5BNV7C.js";import"./chunk-LW4FQU5S.js";import"./chunk-5BCUXIZJ.js";import"./chunk-BR7S6AGZ.js";import{h as f}from"./chunk-LTN6YROF.js";import{B as N,D as T,E as H,G as V,I as F,K as Q,M as P,P as k,Q as m,U as D,r as U,s as _,x as M,y as R,z as Y}from"./chunk-N2WXLAZF.js";import"./chunk-X4QP7L3N.js";import"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import{a as g}from"./chunk-B2LU4KHT.js";import{a as w,b as d}from"./chunk-IDZGCU4F.js";import{b as v,e as p,k as h}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as l,k as c,o as u}from"./chunk-JY5TIRRF.js";l();u();c();l();u();c();l();u();c();var X=v`
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
`;var S=function(n,e,r,i){var s=arguments.length,t=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(t=(s<3?o(t):s>3?o(e,r,t):o(e,r))||t);return s>3&&t&&Object.defineProperty(e,r,t),t},j=class extends h{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=m.state.paymentCurrency,this.currencies=m.state.paymentCurrencies,this.currencyImages=R.state.currencyImages,this.checked=D.state.isLegalCheckboxChecked,this.unsubscribe.push(m.subscribe(e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies}),R.subscribeKey("currencyImages",e=>this.currencyImages=e),D.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=_.state,i=_.state.features?.legalCheckbox,o=!!(e||r)&&!!i&&!this.checked;return p`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","s","s","s"]}
        gap="xs"
        class=${g(o?"disabled":void 0)}
      >
        ${this.currenciesTemplate(o)}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}currenciesTemplate(e=!1){return this.currencies.map(r=>p`
        <wui-list-item
          imageSrc=${g(this.currencyImages?.[r.id])}
          @click=${()=>this.selectCurrency(r)}
          variant="image"
          tabIdx=${g(e?-1:void 0)}
        >
          <wui-text variant="paragraph-500" color="fg-100">${r.id}</wui-text>
        </wui-list-item>
      `)}selectCurrency(e){e&&(m.setPaymentCurrency(e),k.close())}};j.styles=X;S([d()],j.prototype,"selectedCurrency",void 0);S([d()],j.prototype,"currencies",void 0);S([d()],j.prototype,"currencyImages",void 0);S([d()],j.prototype,"checked",void 0);j=S([f("w3m-onramp-fiat-select-view")],j);l();u();c();l();u();c();l();u();c();var G=v`
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
`;var E=function(n,e,r,i){var s=arguments.length,t=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(t=(s<3?o(t):s>3?o(e,r,t):o(e,r))||t);return s>3&&t&&Object.defineProperty(e,r,t),t},$=class extends h{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="",this.feeRange="",this.loading=!1,this.onClick=null}render(){return p`
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
        ${this.loading?p`<wui-loading-spinner color="fg-200" size="md"></wui-loading-spinner>`:p`<wui-icon name="chevronRight" color="fg-200" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){let r=P.getAllRequestedCaipNetworks()?.filter(i=>i?.assets?.imageId)?.slice(0,5);return p`
      <wui-flex class="networks">
        ${r?.map(i=>p`
            <wui-flex class="network-icon">
              <wui-image src=${g(Y.getNetworkImage(i))}></wui-image>
            </wui-flex>
          `)}
      </wui-flex>
    `}};$.styles=[G];E([w({type:Boolean})],$.prototype,"disabled",void 0);E([w()],$.prototype,"color",void 0);E([w()],$.prototype,"name",void 0);E([w()],$.prototype,"label",void 0);E([w()],$.prototype,"feeRange",void 0);E([w({type:Boolean})],$.prototype,"loading",void 0);E([w()],$.prototype,"onClick",void 0);$=E([f("w3m-onramp-provider-item")],$);l();u();c();l();u();c();var J=v`
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
`;var se=function(n,e,r,i){var s=arguments.length,t=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(t=(s<3?o(t):s>3?o(e,r,t):o(e,r))||t);return s>3&&t&&Object.defineProperty(e,r,t),t},q=class extends h{render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=_.state;return!e&&!r?null:p`
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
    `}howDoesItWorkTemplate(){return p` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-100" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){N.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:V(P.state.activeChain)===M.ACCOUNT_TYPES.SMART_ACCOUNT}}),T.push("WhatIsABuy")}};q.styles=[J];q=se([f("w3m-onramp-providers-footer")],q);var Z=function(n,e,r,i){var s=arguments.length,t=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(t=(s<3?o(t):s>3?o(e,r,t):o(e,r))||t);return s>3&&t&&Object.defineProperty(e,r,t),t},K=class extends h{constructor(){super(),this.unsubscribe=[],this.providers=m.state.providers,this.unsubscribe.push(m.subscribeKey("providers",e=>{this.providers=e}))}render(){return p`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
      <w3m-onramp-providers-footer></w3m-onramp-providers-footer>
    `}onRampProvidersTemplate(){return this.providers.filter(e=>e.supportedChains.includes(P.state.activeChain??"eip155")).map(e=>p`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
            data-testid=${`onramp-provider-${e.name}`}
          ></w3m-onramp-provider-item>
        `)}onClickProvider(e){m.setSelectedProvider(e),T.push("BuyInProgress"),U.openHref(m.state.selectedProvider?.url||e.url,"popupWindow","width=600,height=800,scrollbars=yes"),N.sendEvent({type:"track",event:"SELECT_BUY_PROVIDER",properties:{provider:e.name,isSmartAccount:V(P.state.activeChain)===M.ACCOUNT_TYPES.SMART_ACCOUNT}})}};Z([d()],K.prototype,"providers",void 0);K=Z([f("w3m-onramp-providers-view")],K);l();u();c();l();u();c();var ee=v`
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
`;var z=function(n,e,r,i){var s=arguments.length,t=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(t=(s<3?o(t):s>3?o(e,r,t):o(e,r))||t);return s>3&&t&&Object.defineProperty(e,r,t),t},L=class extends h{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=m.state.purchaseCurrencies,this.tokens=m.state.purchaseCurrencies,this.tokenImages=R.state.tokenImages,this.checked=D.state.isLegalCheckboxChecked,this.unsubscribe.push(m.subscribe(e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies}),R.subscribeKey("tokenImages",e=>this.tokenImages=e),D.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=_.state,i=_.state.features?.legalCheckbox,o=!!(e||r)&&!!i&&!this.checked;return p`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","s","s","s"]}
        gap="xs"
        class=${g(o?"disabled":void 0)}
      >
        ${this.currenciesTemplate(o)}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}currenciesTemplate(e=!1){return this.tokens.map(r=>p`
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
      `)}selectToken(e){e&&(m.setPurchaseCurrency(e),k.close())}};L.styles=ee;z([d()],L.prototype,"selectedCurrency",void 0);z([d()],L.prototype,"tokens",void 0);z([d()],L.prototype,"tokenImages",void 0);z([d()],L.prototype,"checked",void 0);L=z([f("w3m-onramp-token-select-view")],L);l();u();c();l();u();c();var te=v`
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
`;var O=function(n,e,r,i){var s=arguments.length,t=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(t=(s<3?o(t):s>3?o(e,r,t):o(e,r))||t);return s>3&&t&&Object.defineProperty(e,r,t),t},C=class extends h{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=m.state.selectedProvider,this.uri=Q.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(m.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e}))}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e="Continue in external window";this.error?e="Buy failed":this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);let r=this.error?"Buy can be declined from your side or due to and error on the provider app":"We\u2019ll notify you once your Buy is processed";return p`
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
    `}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,U.openHref(this.selectedOnRampProvider.url,"popupWindow","width=600,height=800,scrollbars=yes"))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?p`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){let e=H.state.themeVariables["--w3m-border-radius-master"],r=e?parseInt(e.replace("px",""),10):4;return p`<wui-loading-thumbnail radius=${r*9}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url){F.showError("No link found"),T.goBack();return}try{U.copyToClopboard(this.selectedOnRampProvider.url),F.showSuccess("Link copied")}catch{F.showError("Failed to copy")}}};C.styles=te;O([d()],C.prototype,"intervalId",void 0);O([d()],C.prototype,"selectedOnRampProvider",void 0);O([d()],C.prototype,"uri",void 0);O([d()],C.prototype,"ready",void 0);O([d()],C.prototype,"showRetry",void 0);O([d()],C.prototype,"buffering",void 0);O([d()],C.prototype,"error",void 0);O([w({type:Boolean})],C.prototype,"isMobile",void 0);O([w()],C.prototype,"onRetry",void 0);C=O([f("w3m-buy-in-progress-view")],C);l();u();c();var ne=function(n,e,r,i){var s=arguments.length,t=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(t=(s<3?o(t):s>3?o(e,r,t):o(e,r))||t);return s>3&&t&&Object.defineProperty(e,r,t),t},re=class extends h{render(){return p`
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
        <wui-button @click=${T.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};re=ne([f("w3m-what-is-a-buy-view")],re);l();u();c();l();u();c();l();u();c();var ie=v`
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
`;var B=function(n,e,r,i){var s=arguments.length,t=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(t=(s<3?o(t):s>3?o(e,r,t):o(e,r))||t);return s>3&&t&&Object.defineProperty(e,r,t),t},A=class extends h{constructor(){super(),this.unsubscribe=[],this.type="Token",this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=R.state.currencyImages,this.tokenImages=R.state.tokenImages,this.unsubscribe.push(m.subscribeKey("purchaseCurrency",e=>{!e||this.type==="Fiat"||(this.selectedCurrency=this.formatPurchaseCurrency(e))}),m.subscribeKey("paymentCurrency",e=>{!e||this.type==="Token"||(this.selectedCurrency=this.formatPaymentCurrency(e))}),m.subscribe(e=>{this.type==="Fiat"?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)}),R.subscribe(e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}}))}firstUpdated(){m.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.selectedCurrency?.symbol||"",r=this.currencyImages[e]||this.tokenImages[e];return p`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?p` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="xxs"
            @click=${()=>k.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${g(r)}></wui-image>
            <wui-text color="fg-100">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:p`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};A.styles=ie;B([w({type:String})],A.prototype,"type",void 0);B([w({type:Number})],A.prototype,"value",void 0);B([d()],A.prototype,"currencies",void 0);B([d()],A.prototype,"selectedCurrency",void 0);B([d()],A.prototype,"currencyImages",void 0);B([d()],A.prototype,"tokenImages",void 0);A=B([f("w3m-onramp-input")],A);l();u();c();var oe=v`
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
`;var W=function(n,e,r,i){var s=arguments.length,t=s<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,i);else for(var a=n.length-1;a>=0;a--)(o=n[a])&&(t=(s<3?o(t):s>3?o(e,r,t):o(e,r))||t);return s>3&&t&&Object.defineProperty(e,r,t),t},ae={USD:"$",EUR:"\u20AC",GBP:"\xA3"},le=[100,250,500,1e3],I=class extends h{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=P.state.activeCaipAddress,this.loading=k.state.loading,this.paymentCurrency=m.state.paymentCurrency,this.paymentAmount=m.state.paymentAmount,this.purchaseAmount=m.state.purchaseAmount,this.quoteLoading=m.state.quotesLoading,this.unsubscribe.push(P.subscribeKey("activeCaipAddress",e=>this.caipAddress=e),k.subscribeKey("loading",e=>{this.loading=e}),m.subscribe(e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return p`
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
            ${le.map(e=>p`<wui-button
                  variant=${this.paymentAmount===e?"accent":"neutral"}
                  size="md"
                  textVariant="paragraph-600"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${ae[this.paymentCurrency?.id||"USD"]} ${e}`}</wui-button
                >`)}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?p`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="main"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:p`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||k.open({view:"OnRampProviders"})}openModal(){k.open({view:"Connect"})}async onPaymentAmountChange(e){m.setPaymentAmount(Number(e.detail)),await m.getQuote()}async selectPresetAmount(e){m.setPaymentAmount(e),await m.getQuote()}};I.styles=oe;W([w({type:Boolean})],I.prototype,"disabled",void 0);W([d()],I.prototype,"caipAddress",void 0);W([d()],I.prototype,"loading",void 0);W([d()],I.prototype,"paymentCurrency",void 0);W([d()],I.prototype,"paymentAmount",void 0);W([d()],I.prototype,"purchaseAmount",void 0);W([d()],I.prototype,"quoteLoading",void 0);I=W([f("w3m-onramp-widget")],I);export{C as W3mBuyInProgressView,K as W3mOnRampProvidersView,j as W3mOnrampFiatSelectView,L as W3mOnrampTokensView,I as W3mOnrampWidget,re as W3mWhatIsABuyView};
