import"./chunk-QLVJW567.js";import"./chunk-PS7O6YYW.js";import"./chunk-EDAA45PX.js";import"./chunk-V74C2HKT.js";import"./chunk-YCKXBVJA.js";import"./chunk-ASCK67KS.js";import"./chunk-NHUA5J6J.js";import"./chunk-PTZTZUDB.js";import"./chunk-RBOFKV5S.js";import"./chunk-RL7GPJDA.js";import"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-MNAGPPOX.js";import"./chunk-EJ5H5H5L.js";import"./chunk-IPTO6NMX.js";import"./chunk-BI3DTO7P.js";import"./chunk-RLPEU2I3.js";import{a as w}from"./chunk-B2LU4KHT.js";import{a,k as D,r as v,z as f}from"./chunk-RZQOM5QR.js";import"./chunk-HQPTEMSB.js";import{a as y,b as l}from"./chunk-IDZGCU4F.js";import{e as d,k as h}from"./chunk-ZS2R6O6N.js";import"./chunk-SQN7L5MN.js";import"./chunk-7GZ7JYLK.js";import"./chunk-6HADIPAO.js";import"./chunk-2T4BE52W.js";import"./chunk-XQOHLC2A.js";import{B as U,C as V,H as W,I as M,M as k,N as q,O as K,S as B,T as F,X as Y,aa as Q,ga as A,ia as $}from"./chunk-OXOEMY67.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as u,k as m,o as p}from"./chunk-JY5TIRRF.js";u();p();m();u();p();m();u();p();m();var X=v`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
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
`;var S=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},T=class extends h{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=a.state.paymentCurrency,this.currencies=a.state.paymentCurrencies,this.currencyImages=k.state.currencyImages,this.checked=D.state.isLegalCheckboxChecked,this.unsubscribe.push(a.subscribe(e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies}),k.subscribeKey("currencyImages",e=>this.currencyImages=e),D.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:i}=W.state,o=W.state.features?.legalCheckbox,n=!!(e||i)&&!!o&&!this.checked;return d`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${w(n?"disabled":void 0)}
      >
        ${this.currenciesTemplate(n)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.currencies.map(i=>d`
        <wui-list-item
          imageSrc=${w(this.currencyImages?.[i.id])}
          @click=${()=>this.selectCurrency(i)}
          variant="image"
          tabIdx=${w(e?-1:void 0)}
        >
          <wui-text variant="md-medium" color="primary">${i.id}</wui-text>
        </wui-list-item>
      `)}selectCurrency(e){e&&(a.setPaymentCurrency(e),$.close())}};T.styles=X;S([l()],T.prototype,"selectedCurrency",void 0);S([l()],T.prototype,"currencies",void 0);S([l()],T.prototype,"currencyImages",void 0);S([l()],T.prototype,"checked",void 0);T=S([f("w3m-onramp-fiat-select-view")],T);u();p();m();u();p();m();u();p();m();var H=v`
  button {
    padding: ${({spacing:t})=>t[3]};
    border-radius: ${({borderRadius:t})=>t[4]};
    border: none;
    outline: none;
    background-color: ${({tokens:t})=>t.core.glass010};
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${({spacing:t})=>t[3]};
    transition: background-color ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
    will-change: background-color;
    cursor: pointer;
  }

  button:hover {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .provider-image {
    width: ${({spacing:t})=>t[10]};
    min-width: ${({spacing:t})=>t[10]};
    height: ${({spacing:t})=>t[10]};
    border-radius: calc(
      ${({borderRadius:t})=>t[4]} - calc(${({spacing:t})=>t[3]} / 2)
    );
    position: relative;
    overflow: hidden;
  }

  .network-icon {
    width: ${({spacing:t})=>t[3]};
    height: ${({spacing:t})=>t[3]};
    border-radius: calc(${({spacing:t})=>t[3]} / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px ${({tokens:t})=>t.theme.foregroundPrimary},
      0 0 0 3px ${({tokens:t})=>t.theme.backgroundPrimary};
    transition: box-shadow ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
    will-change: box-shadow;
  }

  button:hover .network-icon {
    box-shadow:
      0 0 0 3px ${({tokens:t})=>t.core.glass010},
      0 0 0 3px ${({tokens:t})=>t.theme.backgroundPrimary};
  }
`;var _=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},R=class extends h{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="",this.feeRange="",this.loading=!1,this.onClick=null}render(){return d`
      <button ?disabled=${this.disabled} @click=${this.onClick} ontouchstart>
        <wui-visual name=${w(this.name)} class="provider-image"></wui-visual>
        <wui-flex flexDirection="column" gap="01">
          <wui-text variant="md-regular" color="primary">${this.label}</wui-text>
          <wui-flex alignItems="center" justifyContent="flex-start" gap="4">
            <wui-text variant="sm-medium" color="primary">
              <wui-text variant="sm-regular" color="secondary">Fees</wui-text>
              ${this.feeRange}
            </wui-text>
            <wui-flex gap="2">
              <wui-icon name="bank" size="sm" color="default"></wui-icon>
              <wui-icon name="card" size="sm" color="default"></wui-icon>
            </wui-flex>
            ${this.networksTemplate()}
          </wui-flex>
        </wui-flex>
        ${this.loading?d`<wui-loading-spinner color="secondary" size="md"></wui-loading-spinner>`:d`<wui-icon name="chevronRight" color="default" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){let i=A.getAllRequestedCaipNetworks()?.filter(o=>o?.assets?.imageId)?.slice(0,5);return d`
      <wui-flex class="networks">
        ${i?.map(o=>d`
            <wui-flex class="network-icon">
              <wui-image src=${w(q.getNetworkImage(o))}></wui-image>
            </wui-flex>
          `)}
      </wui-flex>
    `}};R.styles=[H];_([y({type:Boolean})],R.prototype,"disabled",void 0);_([y()],R.prototype,"color",void 0);_([y()],R.prototype,"name",void 0);_([y()],R.prototype,"label",void 0);_([y()],R.prototype,"feeRange",void 0);_([y({type:Boolean})],R.prototype,"loading",void 0);_([y()],R.prototype,"onClick",void 0);R=_([f("w3m-onramp-provider-item")],R);var G=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},N=class extends h{constructor(){super(),this.unsubscribe=[],this.providers=a.state.providers,this.unsubscribe.push(a.subscribeKey("providers",e=>{this.providers=e}))}render(){return d`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="2">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
    `}onRampProvidersTemplate(){return this.providers.filter(e=>e.supportedChains.includes(A.state.activeChain??"eip155")).map(e=>d`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
            data-testid=${`onramp-provider-${e.name}`}
          ></w3m-onramp-provider-item>
        `)}onClickProvider(e){a.setSelectedProvider(e),B.push("BuyInProgress"),U.openHref(a.state.selectedProvider?.url||e.url,"popupWindow","width=600,height=800,scrollbars=yes"),K.sendEvent({type:"track",event:"SELECT_BUY_PROVIDER",properties:{provider:e.name,isSmartAccount:Y(A.state.activeChain)===V.ACCOUNT_TYPES.SMART_ACCOUNT}})}};G([l()],N.prototype,"providers",void 0);N=G([f("w3m-onramp-providers-view")],N);u();p();m();u();p();m();var J=v`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
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
`;var z=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},j=class extends h{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=a.state.purchaseCurrencies,this.tokens=a.state.purchaseCurrencies,this.tokenImages=k.state.tokenImages,this.checked=D.state.isLegalCheckboxChecked,this.unsubscribe.push(a.subscribe(e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies}),k.subscribeKey("tokenImages",e=>this.tokenImages=e),D.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:i}=W.state,o=W.state.features?.legalCheckbox,n=!!(e||i)&&!!o&&!this.checked;return d`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="2"
        class=${w(n?"disabled":void 0)}
      >
        ${this.currenciesTemplate(n)}
      </wui-flex>
    `}currenciesTemplate(e=!1){return this.tokens.map(i=>d`
        <wui-list-item
          imageSrc=${w(this.tokenImages?.[i.symbol])}
          @click=${()=>this.selectToken(i)}
          variant="image"
          tabIdx=${w(e?-1:void 0)}
        >
          <wui-flex gap="1" alignItems="center">
            <wui-text variant="md-medium" color="primary">${i.name}</wui-text>
            <wui-text variant="sm-regular" color="secondary">${i.symbol}</wui-text>
          </wui-flex>
        </wui-list-item>
      `)}selectToken(e){e&&(a.setPurchaseCurrency(e),$.close())}};j.styles=J;z([l()],j.prototype,"selectedCurrency",void 0);z([l()],j.prototype,"tokens",void 0);z([l()],j.prototype,"tokenImages",void 0);z([l()],j.prototype,"checked",void 0);j=z([f("w3m-onramp-token-select-view")],j);u();p();m();u();p();m();var Z=v`
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
    border-radius: calc(
      ${({borderRadius:t})=>t[1]} * 9 - ${({borderRadius:t})=>t[3]}
    );
    position: relative;
    overflow: hidden;
  }

  wui-icon-box {
    position: absolute;
    right: calc(${({spacing:t})=>t[1]} * -1);
    bottom: calc(${({spacing:t})=>t[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      transform ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:t})=>t[4]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:t})=>t["ease-out-power-2"]} both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:t})=>t["01"]} ${({spacing:t})=>t[2]};
  }
`;var P=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},C=class extends h{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=a.state.selectedProvider,this.uri=Q.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(a.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e}))}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e="Continue in external window";this.error?e="Buy failed":this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);let i=this.error?"Buy can be declined from your side or due to and error on the provider app":"We\u2019ll notify you once your Buy is processed";return d`
      <wui-flex
        data-error=${w(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-visual
            name=${w(this.selectedOnRampProvider?.name)}
            size="lg"
            class="provider-image"
          >
          </wui-visual>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["4","0","0","0"]}
        >
          <wui-text variant="md-medium" color=${this.error?"error":"primary"}>
            ${e}
          </wui-text>
          <wui-text align="center" variant="sm-medium" color="secondary">${i}</wui-text>
        </wui-flex>

        ${this.error?this.tryAgainTemplate():null}
      </wui-flex>

      <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
        <wui-link @click=${this.onCopyUri} color="secondary">
          <wui-icon size="sm" color="default" slot="iconLeft" name="copy"></wui-icon>
          Copy link
        </wui-link>
      </wui-flex>
    `}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,U.openHref(this.selectedOnRampProvider.url,"popupWindow","width=600,height=800,scrollbars=yes"))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?d`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){let e=F.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return d`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url){M.showError("No link found"),B.goBack();return}try{U.copyToClopboard(this.selectedOnRampProvider.url),M.showSuccess("Link copied")}catch{M.showError("Failed to copy")}}};C.styles=Z;P([l()],C.prototype,"intervalId",void 0);P([l()],C.prototype,"selectedOnRampProvider",void 0);P([l()],C.prototype,"uri",void 0);P([l()],C.prototype,"ready",void 0);P([l()],C.prototype,"showRetry",void 0);P([l()],C.prototype,"buffering",void 0);P([l()],C.prototype,"error",void 0);P([y({type:Boolean})],C.prototype,"isMobile",void 0);P([y()],C.prototype,"onRetry",void 0);C=P([f("w3m-buy-in-progress-view")],C);u();p();m();var ie=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},ee=class extends h{render(){return d`
      <wui-flex
        flexDirection="column"
        .padding=${["6","10","5","10"]}
        alignItems="center"
        gap="5"
      >
        <wui-visual name="onrampCard"></wui-visual>
        <wui-flex flexDirection="column" gap="2" alignItems="center">
          <wui-text align="center" variant="md-medium" color="primary">
            Quickly and easily buy digital assets!
          </wui-text>
          <wui-text align="center" variant="sm-regular" color="secondary">
            Simply select your preferred onramp provider and add digital assets to your account
            using your credit card or bank transfer
          </wui-text>
        </wui-flex>
        <wui-button @click=${B.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};ee=ie([f("w3m-what-is-a-buy-view")],ee);u();p();m();u();p();m();u();p();m();var te=v`
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
    right: ${({spacing:t})=>t[2]};
    height: 40px;
    padding: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[2]}
      ${({spacing:t})=>t[2]} ${({spacing:t})=>t[2]};
    min-width: 95px;
    border-radius: ${({borderRadius:t})=>t.round};
    border: 1px solid ${({tokens:t})=>t.theme.foregroundPrimary};
    background: ${({tokens:t})=>t.theme.foregroundPrimary};
    cursor: pointer;
  }

  .currency-container > wui-image {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
`;var L=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},I=class extends h{constructor(){super(),this.unsubscribe=[],this.type="Token",this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=k.state.currencyImages,this.tokenImages=k.state.tokenImages,this.unsubscribe.push(a.subscribeKey("purchaseCurrency",e=>{!e||this.type==="Fiat"||(this.selectedCurrency=this.formatPurchaseCurrency(e))}),a.subscribeKey("paymentCurrency",e=>{!e||this.type==="Token"||(this.selectedCurrency=this.formatPaymentCurrency(e))}),a.subscribe(e=>{this.type==="Fiat"?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)}),k.subscribe(e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}}))}firstUpdated(){a.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.selectedCurrency?.symbol||"",i=this.currencyImages[e]||this.tokenImages[e];return d`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?d` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="1"
            @click=${()=>$.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${w(i)}></wui-image>
            <wui-text color="primary">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:d`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};I.styles=te;L([y({type:String})],I.prototype,"type",void 0);L([y({type:Number})],I.prototype,"value",void 0);L([l()],I.prototype,"currencies",void 0);L([l()],I.prototype,"selectedCurrency",void 0);L([l()],I.prototype,"currencyImages",void 0);L([l()],I.prototype,"tokenImages",void 0);I=L([f("w3m-onramp-input")],I);u();p();m();var re=v`
  :host > wui-flex {
    width: 100%;
    max-width: 360px;
  }

  :host > wui-flex > wui-flex {
    border-radius: ${({borderRadius:t})=>t[8]};
    width: 100%;
  }

  .amounts-container {
    width: 100%;
  }
`;var E=function(t,e,i,o){var s=arguments.length,r=s<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,i,o);else for(var c=t.length-1;c>=0;c--)(n=t[c])&&(r=(s<3?n(r):s>3?n(e,i,r):n(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r},oe={USD:"$",EUR:"\u20AC",GBP:"\xA3"},ne=[100,250,500,1e3],O=class extends h{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=A.state.activeCaipAddress,this.loading=$.state.loading,this.paymentCurrency=a.state.paymentCurrency,this.paymentAmount=a.state.paymentAmount,this.purchaseAmount=a.state.purchaseAmount,this.quoteLoading=a.state.quotesLoading,this.unsubscribe.push(A.subscribeKey("activeCaipAddress",e=>this.caipAddress=e),$.subscribeKey("loading",e=>{this.loading=e}),a.subscribe(e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return d`
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center">
        <wui-flex flexDirection="column" alignItems="center" gap="2">
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
          <wui-flex justifyContent="space-evenly" class="amounts-container" gap="2">
            ${ne.map(e=>d`<wui-button
                  variant=${this.paymentAmount===e?"accent-secondary":"neutral-secondary"}
                  size="md"
                  textVariant="md-medium"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${oe[this.paymentCurrency?.id||"USD"]} ${e}`}</wui-button
                >`)}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?d`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="accent-primary"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:d`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||$.open({view:"OnRampProviders"})}openModal(){$.open({view:"Connect"})}async onPaymentAmountChange(e){a.setPaymentAmount(Number(e.detail)),await a.getQuote()}async selectPresetAmount(e){a.setPaymentAmount(e),await a.getQuote()}};O.styles=re;E([y({type:Boolean})],O.prototype,"disabled",void 0);E([l()],O.prototype,"caipAddress",void 0);E([l()],O.prototype,"loading",void 0);E([l()],O.prototype,"paymentCurrency",void 0);E([l()],O.prototype,"paymentAmount",void 0);E([l()],O.prototype,"purchaseAmount",void 0);E([l()],O.prototype,"quoteLoading",void 0);O=E([f("w3m-onramp-widget")],O);export{C as W3mBuyInProgressView,N as W3mOnRampProvidersView,T as W3mOnrampFiatSelectView,j as W3mOnrampTokensView,O as W3mOnrampWidget,ee as W3mWhatIsABuyView};
