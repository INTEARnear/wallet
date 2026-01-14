import"./chunk-PS7O6YYW.js";import"./chunk-V74C2HKT.js";import"./chunk-MKQASGGU.js";import"./chunk-K5RILM6W.js";import"./chunk-QBEY52PF.js";import"./chunk-SEJLZ3OT.js";import"./chunk-TI7CUUHJ.js";import"./chunk-NHUA5J6J.js";import"./chunk-PTZTZUDB.js";import"./chunk-RBOFKV5S.js";import"./chunk-Z6LVO3CP.js";import"./chunk-RL7GPJDA.js";import"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-MNAGPPOX.js";import"./chunk-EJ5H5H5L.js";import"./chunk-IPTO6NMX.js";import"./chunk-BI3DTO7P.js";import"./chunk-RLPEU2I3.js";import{a as D}from"./chunk-B2LU4KHT.js";import{n as r,r as A,v as j,w as N,z as b}from"./chunk-RZQOM5QR.js";import"./chunk-HQPTEMSB.js";import{a as f,b as d}from"./chunk-IDZGCU4F.js";import{e as s,k as y}from"./chunk-ZS2R6O6N.js";import"./chunk-SQN7L5MN.js";import"./chunk-7GZ7JYLK.js";import"./chunk-6HADIPAO.js";import"./chunk-2T4BE52W.js";import"./chunk-XQOHLC2A.js";import{B as S,I as k,N as T,S as x,aa as R,ga as C}from"./chunk-OXOEMY67.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as c,k as m,o as l}from"./chunk-JY5TIRRF.js";c();l();m();c();l();m();c();l();m();c();l();m();c();l();m();var O=A`
  button {
    border: none;
    border-radius: ${({borderRadius:e})=>e[20]};
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${({spacing:e})=>e[1]};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, box-shadow;
  }

  /* -- Variants --------------------------------------------------------------- */
  button[data-type='accent'] {
    background-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  button[data-type='neutral'] {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  /* -- Sizes --------------------------------------------------------------- */
  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='sm'] > wui-image,
  button[data-size='sm'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image,
  button[data-size='md'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button[data-size='lg'] > wui-image,
  button[data-size='lg'] > wui-icon {
    width: 24px;
    height: 24px;
  }

  wui-text {
    padding-left: ${({spacing:e})=>e[1]};
    padding-right: ${({spacing:e})=>e[1]};
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[3]};
    overflow: hidden;
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  /* -- States --------------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button[data-type='accent']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.core.foregroundAccent060};
    }

    button[data-type='neutral']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
    }
  }

  button[data-type='accent']:not(:disabled):focus-visible,
  button[data-type='accent']:not(:disabled):active {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button[data-type='neutral']:not(:disabled):focus-visible,
  button[data-type='neutral']:not(:disabled):active {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  button:disabled {
    opacity: 0.5;
  }
`;var P=function(e,t,o,n){var a=arguments.length,i=a<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var p=e.length-1;p>=0;p--)(u=e[p])&&(i=(a<3?u(i):a>3?u(t,o,i):u(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i},W={sm:"sm-regular",md:"md-regular",lg:"lg-regular"},w=class extends y{constructor(){super(...arguments),this.type="accent",this.size="md",this.imageSrc="",this.disabled=!1,this.leftIcon=void 0,this.rightIcon=void 0,this.text=""}render(){return s`
      <button ?disabled=${this.disabled} data-type=${this.type} data-size=${this.size}>
        ${this.imageSrc?s`<wui-image src=${this.imageSrc}></wui-image>`:null}
        ${this.leftIcon?s`<wui-icon name=${this.leftIcon} color="inherit" size="inherit"></wui-icon>`:null}
        <wui-text variant=${W[this.size]} color="inherit">${this.text}</wui-text>
        ${this.rightIcon?s`<wui-icon name=${this.rightIcon} color="inherit" size="inherit"></wui-icon>`:null}
      </button>
    `}};w.styles=[j,N,O];P([f()],w.prototype,"type",void 0);P([f()],w.prototype,"size",void 0);P([f()],w.prototype,"imageSrc",void 0);P([f({type:Boolean})],w.prototype,"disabled",void 0);P([f()],w.prototype,"leftIcon",void 0);P([f()],w.prototype,"rightIcon",void 0);P([f()],w.prototype,"text",void 0);w=P([b("wui-chip-button")],w);c();l();m();var z=function(e,t,o,n){var a=arguments.length,i=a<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var p=e.length-1;p>=0;p--)(u=e[p])&&(i=(a<3?u(i):a>3?u(t,o,i):u(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i},E=class extends y{constructor(){super(...arguments),this.maxDecimals=void 0,this.maxIntegers=void 0}render(){return s`
      <wui-flex alignItems="center" gap="1">
        <wui-input-amount
          widthVariant="fit"
          fontSize="h2"
          .maxDecimals=${D(this.maxDecimals)}
          .maxIntegers=${D(this.maxIntegers)}
          .value=${this.amount?String(this.amount):""}
        ></wui-input-amount>
        <wui-text variant="md-regular" color="secondary">USD</wui-text>
      </wui-flex>
    `}};z([f({type:Number})],E.prototype,"amount",void 0);z([f({type:Number})],E.prototype,"maxDecimals",void 0);z([f({type:Number})],E.prototype,"maxIntegers",void 0);E=z([b("w3m-fund-input")],E);c();l();m();var F=A`
  .amount-input-container {
    border-radius: ${({borderRadius:e})=>e[6]};
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e[1]};
  }

  .container {
    border-radius: 30px;
  }
`;var g=function(e,t,o,n){var a=arguments.length,i=a<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var p=e.length-1;p>=0;p--)(u=e[p])&&(i=(a<3?u(i):a>3?u(t,o,i):u(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i},B=[10,50,100],V=6,M=10,h=class extends y{constructor(){super(),this.unsubscribe=[],this.network=C.state.activeCaipNetwork,this.exchanges=r.state.exchanges,this.isLoading=r.state.isLoading,this.amount=r.state.amount,this.tokenAmount=r.state.tokenAmount,this.priceLoading=r.state.priceLoading,this.isPaymentInProgress=r.state.isPaymentInProgress,this.currentPayment=r.state.currentPayment,this.paymentId=r.state.paymentId,this.paymentAsset=r.state.paymentAsset,this.unsubscribe.push(C.subscribeKey("activeCaipNetwork",t=>{this.network=t,this.setDefaultPaymentAsset()}),r.subscribe(t=>{this.exchanges=t.exchanges,this.isLoading=t.isLoading,this.amount=t.amount,this.tokenAmount=t.tokenAmount,this.priceLoading=t.priceLoading,this.paymentId=t.paymentId,this.isPaymentInProgress=t.isPaymentInProgress,this.currentPayment=t.currentPayment,this.paymentAsset=t.paymentAsset,t.isPaymentInProgress&&t.currentPayment?.exchangeId&&t.currentPayment?.sessionId&&t.paymentId&&this.handlePaymentInProgress()}))}disconnectedCallback(){this.unsubscribe.forEach(o=>o()),r.state.isPaymentInProgress||r.reset()}async firstUpdated(){await this.getPaymentAssets(),this.paymentAsset||await this.setDefaultPaymentAsset(),r.setAmount(B[0]),await r.fetchExchanges()}render(){return s`
      <wui-flex flexDirection="column" class="container">
        ${this.amountInputTemplate()} ${this.exchangesTemplate()}
      </wui-flex>
    `}exchangesLoadingTemplate(){return Array.from({length:2}).map(()=>s`<wui-shimmer width="100%" height="65px" borderRadius="xxs"></wui-shimmer>`)}_exchangesTemplate(){return this.exchanges.length>0?this.exchanges.map(t=>s`<wui-list-item
              @click=${()=>this.onExchangeClick(t)}
              chevron
              variant="image"
              imageSrc=${t.imageUrl}
              ?loading=${this.isLoading}
            >
              <wui-text variant="md-regular" color="primary">
                Deposit from ${t.name}
              </wui-text>
            </wui-list-item>`):s`<wui-flex flexDirection="column" alignItems="center" gap="4" padding="4">
          <wui-text variant="lg-medium" align="center" color="primary">
            No exchanges support this asset on this network
          </wui-text>
        </wui-flex>`}exchangesTemplate(){return s`<wui-flex
      flexDirection="column"
      gap="2"
      .padding=${["3","3","3","3"]}
      class="exchanges-container"
    >
      ${this.isLoading?this.exchangesLoadingTemplate():this._exchangesTemplate()}
    </wui-flex>`}amountInputTemplate(){return s`
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        class="amount-input-container"
      >
        <wui-flex
          justifyContent="space-between"
          alignItems="center"
          .margin=${["0","0","6","0"]}
        >
          <wui-text variant="md-medium" color="secondary">Asset</wui-text>
          <wui-token-button
            data-testid="deposit-from-exchange-asset-button"
            flexDirection="row-reverse"
            text=${this.paymentAsset?.metadata.symbol||""}
            imageSrc=${this.paymentAsset?.metadata.iconUrl||""}
            @click=${()=>x.push("PayWithExchangeSelectAsset")}
            size="lg"
            .chainImageSrc=${D(T.getNetworkImage(this.network))}
          >
          </wui-token-button>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          .margin=${["0","0","4","0"]}
        >
          <w3m-fund-input
            @inputChange=${this.onAmountChange.bind(this)}
            .amount=${this.amount}
            .maxDecimals=${V}
            .maxIntegers=${M}
          >
          </w3m-fund-input>
          ${this.tokenAmountTemplate()}
        </wui-flex>
        <wui-flex justifyContent="center" gap="2">
          ${B.map(t=>s`<wui-chip-button
                @click=${()=>r.setAmount(t)}
                type="neutral"
                size="lg"
                text=${`$${t}`}
              ></wui-chip-button>`)}
        </wui-flex>
      </wui-flex>
    `}tokenAmountTemplate(){return this.priceLoading?s`<wui-shimmer
        width="65px"
        height="20px"
        borderRadius="xxs"
        variant="light"
      ></wui-shimmer>`:s`
      <wui-text variant="md-regular" color="secondary">
        ${this.tokenAmount.toFixed(4)} ${this.paymentAsset?.metadata.symbol}
      </wui-text>
    `}async onExchangeClick(t){if(!this.amount){k.showError("Please enter an amount");return}await r.handlePayWithExchange(t.id)}handlePaymentInProgress(){let t=C.state.activeChain,{redirectView:o="Account"}=x.state.data??{};this.isPaymentInProgress&&this.currentPayment?.exchangeId&&this.currentPayment?.sessionId&&this.paymentId&&(r.waitUntilComplete({exchangeId:this.currentPayment.exchangeId,sessionId:this.currentPayment.sessionId,paymentId:this.paymentId}).then(n=>{n.status==="SUCCESS"?(k.showSuccess("Deposit completed"),r.reset(),t&&(C.fetchTokenBalance(),R.updateBalance(t)),x.replace("Transactions")):n.status==="FAILED"&&k.showError("Deposit failed")}),k.showLoading("Deposit in progress..."),x.replace(o))}onAmountChange({detail:t}){r.setAmount(t?Number(t):null)}async getPaymentAssets(){this.network&&await r.getAssetsForNetwork(this.network.caipNetworkId)}async setDefaultPaymentAsset(){if(this.network){let t=await r.getAssetsForNetwork(this.network.caipNetworkId);t[0]&&r.setPaymentAsset(t[0])}}};h.styles=F;g([d()],h.prototype,"network",void 0);g([d()],h.prototype,"exchanges",void 0);g([d()],h.prototype,"isLoading",void 0);g([d()],h.prototype,"amount",void 0);g([d()],h.prototype,"tokenAmount",void 0);g([d()],h.prototype,"priceLoading",void 0);g([d()],h.prototype,"isPaymentInProgress",void 0);g([d()],h.prototype,"currentPayment",void 0);g([d()],h.prototype,"paymentId",void 0);g([d()],h.prototype,"paymentAsset",void 0);h=g([b("w3m-deposit-from-exchange-view")],h);c();l();m();c();l();m();var U=A`
  .contentContainer {
    height: 440px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }

  wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e[3]};
  }
`;var _=function(e,t,o,n){var a=arguments.length,i=a<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var p=e.length-1;p>=0;p--)(u=e[p])&&(i=(a<3?u(i):a>3?u(t,o,i):u(t,o))||i);return a>3&&i&&Object.defineProperty(t,o,i),i},L=class extends y{constructor(){super(),this.unsubscribe=[],this.assets=r.state.assets,this.search="",this.onDebouncedSearch=S.debounce(t=>{this.search=t}),this.unsubscribe.push(r.subscribe(t=>{this.assets=t.assets}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return s`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}templateSearchInput(){return s`
      <wui-flex gap="2" padding="3">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){let t=this.assets.filter(n=>n.metadata.name.toLowerCase().includes(this.search.toLowerCase())),o=t.length>0;return s`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","3","0","3"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["4","3","3","3"]}>
          <wui-text variant="md-medium" color="secondary">Available tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2">
          ${o?t.map(n=>s`<wui-list-item
                    .imageSrc=${n.metadata.iconUrl}
                    ?clickable=${!0}
                    @click=${this.handleTokenClick.bind(this,n)}
                  >
                    <wui-text variant="md-medium" color="primary">${n.metadata.name}</wui-text>
                    <wui-text variant="md-regular" color="secondary"
                      >${n.metadata.symbol}</wui-text
                    >
                  </wui-list-item>`):s`<wui-flex
                .padding=${["20","0","0","0"]}
                alignItems="center"
                flexDirection="column"
                gap="4"
              >
                <wui-icon-box icon="coinPlaceholder" color="default" size="lg"></wui-icon-box>
                <wui-flex
                  class="textContent"
                  gap="2"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <wui-text variant="lg-medium" align="center" color="primary">
                    No tokens found
                  </wui-text>
                </wui-flex>
                <wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>
              </wui-flex>`}
        </wui-flex>
      </wui-flex>
    `}onBuyClick(){x.push("OnRampProviders")}onInputChange(t){this.onDebouncedSearch(t.detail)}handleTokenClick(t){r.setPaymentAsset(t),x.goBack()}};L.styles=U;_([d()],L.prototype,"assets",void 0);_([d()],L.prototype,"search",void 0);L=_([b("w3m-deposit-from-exchange-select-asset-view")],L);export{L as W3mDepositFromExchangeSelectAssetView,h as W3mDepositFromExchangeView};
