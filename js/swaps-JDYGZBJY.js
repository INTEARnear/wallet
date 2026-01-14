import"./chunk-XXHZ5HCE.js";import"./chunk-Z3DFHWDZ.js";import"./chunk-SR42VORX.js";import"./chunk-WZ3HYXL6.js";import"./chunk-I3LT5XDW.js";import"./chunk-MIJMXO74.js";import"./chunk-3IF2M6VT.js";import"./chunk-7FUATHPM.js";import"./chunk-YYMQ6HDD.js";import"./chunk-FB5BNV7C.js";import"./chunk-LW4FQU5S.js";import"./chunk-5BCUXIZJ.js";import"./chunk-BR7S6AGZ.js";import{a as O,c as H,d as G,f as b,h as I}from"./chunk-LTN6YROF.js";import{B,D as $,G as Q,M as L,N as R,P as q,R as i,g as U,h as z,p as M,r as F,x as K}from"./chunk-N2WXLAZF.js";import"./chunk-X4QP7L3N.js";import"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-B2LU4KHT.js";import{a as m,b as n}from"./chunk-IDZGCU4F.js";import{b as y,e as l,k as S}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as p,k as d,o as h}from"./chunk-JY5TIRRF.js";p();h();d();p();h();d();p();h();d();p();h();d();var Y=y`
  :host {
    width: 100%;
  }

  .details-container > wui-flex {
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    cursor: pointer;
  }

  .details-content-container {
    padding: var(--wui-spacing-1xs);
    padding-top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: var(--wui-spacing-s);
    padding-left: var(--wui-spacing-s);
    padding-right: var(--wui-spacing-1xs);
    border-radius: calc(var(--wui-border-radius-5xs) + var(--wui-border-radius-4xs));
    background: var(--wui-color-gray-glass-002);
  }

  .details-row-title {
    white-space: nowrap;
  }

  .details-row.provider-free-row {
    padding-right: var(--wui-spacing-xs);
  }
`;var P=function(c,t,e,r){var s=arguments.length,o=s<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,e):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,r);else for(var u=c.length-1;u>=0;u--)(a=c[u])&&(o=(s<3?a(o):s>3?a(t,e,o):a(t,e))||o);return s>3&&o&&Object.defineProperty(t,e,o),o},rt=M.CONVERT_SLIPPAGE_TOLERANCE,A=class extends S{constructor(){super(),this.unsubscribe=[],this.networkName=L.state.activeCaipNetwork?.name,this.detailsOpen=!1,this.sourceToken=i.state.sourceToken,this.toToken=i.state.toToken,this.toTokenAmount=i.state.toTokenAmount,this.sourceTokenPriceInUSD=i.state.sourceTokenPriceInUSD,this.toTokenPriceInUSD=i.state.toTokenPriceInUSD,this.priceImpact=i.state.priceImpact,this.maxSlippage=i.state.maxSlippage,this.networkTokenSymbol=i.state.networkTokenSymbol,this.inputError=i.state.inputError,this.unsubscribe.push(i.subscribe(t=>{this.sourceToken=t.sourceToken,this.toToken=t.toToken,this.toTokenAmount=t.toTokenAmount,this.priceImpact=t.priceImpact,this.maxSlippage=t.maxSlippage,this.sourceTokenPriceInUSD=t.sourceTokenPriceInUSD,this.toTokenPriceInUSD=t.toTokenPriceInUSD,this.inputError=t.inputError}))}render(){let t=this.toTokenAmount&&this.maxSlippage?U.bigNumber(this.toTokenAmount).minus(this.maxSlippage).toString():null;if(!this.sourceToken||!this.toToken||this.inputError)return null;let e=this.sourceTokenPriceInUSD&&this.toTokenPriceInUSD?1/this.toTokenPriceInUSD*this.sourceTokenPriceInUSD:0;return l`
      <wui-flex flexDirection="column" alignItems="center" gap="1xs" class="details-container">
        <wui-flex flexDirection="column">
          <button @click=${this.toggleDetails.bind(this)}>
            <wui-flex justifyContent="space-between" .padding=${["0","xs","0","xs"]}>
              <wui-flex justifyContent="flex-start" flexGrow="1" gap="xs">
                <wui-text variant="small-400" color="fg-100">
                  1 ${this.sourceToken.symbol} =
                  ${b.formatNumberToLocalString(e,3)}
                  ${this.toToken.symbol}
                </wui-text>
                <wui-text variant="small-400" color="fg-200">
                  $${b.formatNumberToLocalString(this.sourceTokenPriceInUSD)}
                </wui-text>
              </wui-flex>
              <wui-icon name="chevronBottom"></wui-icon>
            </wui-flex>
          </button>
          ${this.detailsOpen?l`
                <wui-flex flexDirection="column" gap="xs" class="details-content-container">
                  ${this.priceImpact?l` <wui-flex flexDirection="column" gap="xs">
                        <wui-flex
                          justifyContent="space-between"
                          alignItems="center"
                          class="details-row"
                        >
                          <wui-flex alignItems="center" gap="xs">
                            <wui-text class="details-row-title" variant="small-400" color="fg-150">
                              Price impact
                            </wui-text>
                            <w3m-tooltip-trigger
                              text="Price impact reflects the change in market price due to your trade"
                            >
                              <wui-icon size="xs" color="fg-250" name="infoCircle"></wui-icon>
                            </w3m-tooltip-trigger>
                          </wui-flex>
                          <wui-flex>
                            <wui-text variant="small-400" color="fg-200">
                              ${b.formatNumberToLocalString(this.priceImpact,3)}%
                            </wui-text>
                          </wui-flex>
                        </wui-flex>
                      </wui-flex>`:null}
                  ${this.maxSlippage&&this.sourceToken.symbol?l`<wui-flex flexDirection="column" gap="xs">
                        <wui-flex
                          justifyContent="space-between"
                          alignItems="center"
                          class="details-row"
                        >
                          <wui-flex alignItems="center" gap="xs">
                            <wui-text class="details-row-title" variant="small-400" color="fg-150">
                              Max. slippage
                            </wui-text>
                            <w3m-tooltip-trigger
                              text=${`Max slippage sets the minimum amount you must receive for the transaction to proceed. ${t?`Transaction will be reversed if you receive less than ${b.formatNumberToLocalString(t,6)} ${this.toToken.symbol} due to price changes.`:""}`}
                            >
                              <wui-icon size="xs" color="fg-250" name="infoCircle"></wui-icon>
                            </w3m-tooltip-trigger>
                          </wui-flex>
                          <wui-flex>
                            <wui-text variant="small-400" color="fg-200">
                              ${b.formatNumberToLocalString(this.maxSlippage,6)}
                              ${this.toToken.symbol} ${rt}%
                            </wui-text>
                          </wui-flex>
                        </wui-flex>
                      </wui-flex>`:null}
                  <wui-flex flexDirection="column" gap="xs">
                    <wui-flex
                      justifyContent="space-between"
                      alignItems="center"
                      class="details-row provider-free-row"
                    >
                      <wui-flex alignItems="center" gap="xs">
                        <wui-text class="details-row-title" variant="small-400" color="fg-150">
                          Provider fee
                        </wui-text>
                      </wui-flex>
                      <wui-flex>
                        <wui-text variant="small-400" color="fg-200">0.85%</wui-text>
                      </wui-flex>
                    </wui-flex>
                  </wui-flex>
                </wui-flex>
              `:null}
        </wui-flex>
      </wui-flex>
    `}toggleDetails(){this.detailsOpen=!this.detailsOpen}};A.styles=[Y];P([n()],A.prototype,"networkName",void 0);P([m()],A.prototype,"detailsOpen",void 0);P([n()],A.prototype,"sourceToken",void 0);P([n()],A.prototype,"toToken",void 0);P([n()],A.prototype,"toTokenAmount",void 0);P([n()],A.prototype,"sourceTokenPriceInUSD",void 0);P([n()],A.prototype,"toTokenPriceInUSD",void 0);P([n()],A.prototype,"priceImpact",void 0);P([n()],A.prototype,"maxSlippage",void 0);P([n()],A.prototype,"networkTokenSymbol",void 0);P([n()],A.prototype,"inputError",void 0);A=P([I("w3m-swap-details")],A);p();h();d();p();h();d();var Z=y`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--wui-border-radius-s);
    padding: var(--wui-spacing-xl);
    padding-right: var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0px 0px 0px 1px var(--wui-color-gray-glass-002);
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    position: relative;
  }

  wui-shimmer.market-value {
    opacity: 0;
  }

  :host > wui-flex > svg.input_mask {
    position: absolute;
    inset: 0;
    z-index: 5;
  }

  :host wui-flex .input_mask__border,
  :host wui-flex .input_mask__background {
    transition: fill var(--wui-duration-md) var(--wui-ease-out-power-1);
    will-change: fill;
  }

  :host wui-flex .input_mask__border {
    fill: var(--wui-color-gray-glass-020);
  }

  :host wui-flex .input_mask__background {
    fill: var(--wui-color-gray-glass-002);
  }
`;var J=function(c,t,e,r){var s=arguments.length,o=s<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,e):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,r);else for(var u=c.length-1;u>=0;u--)(a=c[u])&&(o=(s<3?a(o):s>3?a(t,e,o):a(t,e))||o);return s>3&&o&&Object.defineProperty(t,e,o),o},W=class extends S{constructor(){super(...arguments),this.target="sourceToken"}render(){return l`
      <wui-flex class justifyContent="space-between">
        <wui-flex
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          class="swap-input"
          gap="xxs"
        >
          <wui-shimmer width="80px" height="40px" borderRadius="xxs" variant="light"></wui-shimmer>
        </wui-flex>
        ${this.templateTokenSelectButton()}
      </wui-flex>
    `}templateTokenSelectButton(){return l`
      <wui-flex
        class="swap-token-button"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
        gap="xxs"
      >
        <wui-shimmer width="80px" height="40px" borderRadius="3xl" variant="light"></wui-shimmer>
      </wui-flex>
    `}};W.styles=[Z];J([m()],W.prototype,"target",void 0);W=J([I("w3m-swap-input-skeleton")],W);p();h();d();p();h();d();var X=y`
  :host > wui-flex {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-gray-glass-002);
    padding: var(--wui-spacing-xl);
    padding-right: var(--wui-spacing-s);
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    box-shadow: inset 0px 0px 0px 1px var(--wui-color-gray-glass-002);
    position: relative;
    transition: box-shadow var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color;
  }

  :host wui-flex.focus {
    box-shadow: inset 0px 0px 0px 1px var(--wui-color-gray-glass-005);
  }

  :host > wui-flex .swap-input,
  :host > wui-flex .swap-token-button {
    z-index: 10;
  }

  :host > wui-flex .swap-input {
    -webkit-mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
    mask-image: linear-gradient(
      270deg,
      transparent 0px,
      transparent 8px,
      black 24px,
      black 25px,
      black 32px,
      black 100%
    );
  }

  :host > wui-flex .swap-input input {
    background: none;
    border: none;
    height: 42px;
    width: 100%;
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    letter-spacing: -1.28px;
    outline: none;
    caret-color: var(--wui-color-accent-100);
    color: var(--wui-color-fg-100);
    padding: 0px;
  }

  :host > wui-flex .swap-input input:focus-visible {
    outline: none;
  }

  :host > wui-flex .swap-input input::-webkit-outer-spin-button,
  :host > wui-flex .swap-input input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .max-value-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: var(--wui-color-gray-glass-020);
    padding-left: 0px;
  }

  .market-value {
    min-height: 18px;
  }
`;var D=function(c,t,e,r){var s=arguments.length,o=s<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,e):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,r);else for(var u=c.length-1;u>=0;u--)(a=c[u])&&(o=(s<3?a(o):s>3?a(t,e,o):a(t,e))||o);return s>3&&o&&Object.defineProperty(t,e,o),o},nt=5e-5,C=class extends S{constructor(){super(...arguments),this.focused=!1,this.price=0,this.target="sourceToken",this.onSetAmount=null,this.onSetMaxValue=null}render(){let t=this.marketValue||"0",e=U.bigNumber(t).gt("0");return l`
      <wui-flex class="${this.focused?"focus":""}" justifyContent="space-between">
        <wui-flex
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          class="swap-input"
        >
          <input
            data-testid="swap-input-${this.target}"
            @focusin=${()=>this.onFocusChange(!0)}
            @focusout=${()=>this.onFocusChange(!1)}
            ?disabled=${this.disabled}
            .value=${this.value}
            @input=${this.dispatchInputChangeEvent}
            @keydown=${this.handleKeydown}
            placeholder="0"
            type="text"
            inputmode="decimal"
          />
          <wui-text class="market-value" variant="small-400" color="fg-200">
            ${e?`$${b.formatNumberToLocalString(this.marketValue,2)}`:null}
          </wui-text>
        </wui-flex>
        ${this.templateTokenSelectButton()}
      </wui-flex>
    `}handleKeydown(t){return z.numericInputKeyDown(t,this.value,e=>this.onSetAmount?.(this.target,e))}dispatchInputChangeEvent(t){if(!this.onSetAmount)return;let e=t.target.value.replace(/[^0-9.]/gu,"");e===","||e==="."?this.onSetAmount(this.target,"0."):e.endsWith(",")?this.onSetAmount(this.target,e.replace(",",".")):this.onSetAmount(this.target,e)}setMaxValueToInput(){this.onSetMaxValue?.(this.target,this.balance)}templateTokenSelectButton(){return this.token?l`
      <wui-flex
        class="swap-token-button"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="center"
        gap="xxs"
      >
        <wui-token-button
          data-testid="swap-input-token-${this.target}"
          text=${this.token.symbol}
          imageSrc=${this.token.logoUri}
          @click=${this.onSelectToken.bind(this)}
        >
        </wui-token-button>
        <wui-flex alignItems="center" gap="xxs"> ${this.tokenBalanceTemplate()} </wui-flex>
      </wui-flex>
    `:l` <wui-button
        data-testid="swap-select-token-button-${this.target}"
        class="swap-token-button"
        size="md"
        variant="accent"
        @click=${this.onSelectToken.bind(this)}
      >
        Select token
      </wui-button>`}tokenBalanceTemplate(){let t=U.multiply(this.balance,this.price),e=t?t?.gt(nt):!1;return l`
      ${e?l`<wui-text variant="small-400" color="fg-200">
            ${b.formatNumberToLocalString(this.balance,2)}
          </wui-text>`:null}
      ${this.target==="sourceToken"?this.tokenActionButtonTemplate(e):null}
    `}tokenActionButtonTemplate(t){return t?l` <button class="max-value-button" @click=${this.setMaxValueToInput.bind(this)}>
        <wui-text color="accent-100" variant="small-600">Max</wui-text>
      </button>`:l` <button class="max-value-button" @click=${this.onBuyToken.bind(this)}>
      <wui-text color="accent-100" variant="small-600">Buy</wui-text>
    </button>`}onFocusChange(t){this.focused=t}onSelectToken(){B.sendEvent({type:"track",event:"CLICK_SELECT_TOKEN_TO_SWAP"}),$.push("SwapSelectToken",{target:this.target})}onBuyToken(){$.push("OnRampProviders")}};C.styles=[X];D([m()],C.prototype,"focused",void 0);D([m()],C.prototype,"balance",void 0);D([m()],C.prototype,"value",void 0);D([m()],C.prototype,"price",void 0);D([m()],C.prototype,"marketValue",void 0);D([m()],C.prototype,"disabled",void 0);D([m()],C.prototype,"target",void 0);D([m()],C.prototype,"token",void 0);D([m()],C.prototype,"onSetAmount",void 0);D([m()],C.prototype,"onSetMaxValue",void 0);C=D([I("w3m-swap-input")],C);p();h();d();var tt=y`
  :host > wui-flex:first-child {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .action-button {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
  }

  .action-button:disabled {
    border-color: 1px solid var(--wui-color-gray-glass-005);
  }

  .swap-inputs-container {
    position: relative;
  }

  .replace-tokens-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    gap: var(--wui-spacing-1xs);
    border-radius: var(--wui-border-radius-xs);
    background-color: var(--wui-color-modal-bg-base);
    padding: var(--wui-spacing-xxs);
  }

  .replace-tokens-button-container > button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    padding: var(--wui-spacing-xs);
    border: none;
    border-radius: var(--wui-border-radius-xxs);
    background: var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-duration-md) var(--wui-ease-out-power-1);
    will-change: background-color;
    z-index: 20;
  }

  .replace-tokens-button-container > button:hover {
    background: var(--wui-color-gray-glass-005);
  }

  .details-container > wui-flex {
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    transition: background 0.2s linear;
  }

  .details-container > wui-flex > button:hover {
    background: var(--wui-color-gray-glass-002);
  }

  .details-content-container {
    padding: var(--wui-spacing-1xs);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: var(--wui-spacing-s) var(--wui-spacing-xl);
    border-radius: var(--wui-border-radius-xxs);
    background: var(--wui-color-gray-glass-002);
  }
`;var f=function(c,t,e,r){var s=arguments.length,o=s<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,e):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,r);else for(var u=c.length-1;u>=0;u--)(a=c[u])&&(o=(s<3?a(o):s>3?a(t,e,o):a(t,e))||o);return s>3&&o&&Object.defineProperty(t,e,o),o},w=class extends S{constructor(){super(),this.unsubscribe=[],this.initialParams=$.state.data?.swap,this.detailsOpen=!1,this.caipAddress=R.state.caipAddress,this.caipNetworkId=L.state.activeCaipNetwork?.caipNetworkId,this.initialized=i.state.initialized,this.loadingQuote=i.state.loadingQuote,this.loadingPrices=i.state.loadingPrices,this.loadingTransaction=i.state.loadingTransaction,this.sourceToken=i.state.sourceToken,this.sourceTokenAmount=i.state.sourceTokenAmount,this.sourceTokenPriceInUSD=i.state.sourceTokenPriceInUSD,this.toToken=i.state.toToken,this.toTokenAmount=i.state.toTokenAmount,this.toTokenPriceInUSD=i.state.toTokenPriceInUSD,this.inputError=i.state.inputError,this.fetchError=i.state.fetchError,this.onDebouncedGetSwapCalldata=F.debounce(async()=>{await i.swapTokens()},200),L.subscribeKey("activeCaipNetwork",t=>this.onCaipNetworkChange({newCaipNetwork:t,resetSwapState:!0,initializeSwapState:!1})),R.subscribeKey("caipAddress",t=>this.onCaipAddressChange({newCaipAddress:t,resetSwapState:!0,initializeSwapState:!1})),this.unsubscribe.push(L.subscribeKey("activeCaipNetwork",t=>this.onCaipNetworkChange({newCaipNetwork:t,resetSwapState:!1,initializeSwapState:!0})),R.subscribeKey("caipAddress",t=>this.onCaipAddressChange({newCaipAddress:t,resetSwapState:!1,initializeSwapState:!0})),q.subscribeKey("open",t=>{t||i.resetState()}),$.subscribeKey("view",t=>{t.includes("Swap")||i.resetValues()}),i.subscribe(t=>{this.initialized=t.initialized,this.loadingQuote=t.loadingQuote,this.loadingPrices=t.loadingPrices,this.loadingTransaction=t.loadingTransaction,this.sourceToken=t.sourceToken,this.sourceTokenAmount=t.sourceTokenAmount,this.sourceTokenPriceInUSD=t.sourceTokenPriceInUSD,this.toToken=t.toToken,this.toTokenAmount=t.toTokenAmount,this.toTokenPriceInUSD=t.toTokenPriceInUSD,this.inputError=t.inputError,this.fetchError=t.fetchError}))}async firstUpdated(){i.initializeState(),this.watchTokensAndValues(),await this.handleSwapParameters()}disconnectedCallback(){this.unsubscribe.forEach(t=>t?.()),clearInterval(this.interval)}render(){return l`
      <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
        ${this.initialized?this.templateSwap():this.templateLoading()}
      </wui-flex>
    `}watchTokensAndValues(){this.interval=setInterval(()=>{i.getNetworkTokenPrice(),i.getMyTokensWithBalance(),i.swapTokens()},1e4)}templateSwap(){return l`
      <wui-flex flexDirection="column" gap="s">
        <wui-flex flexDirection="column" alignItems="center" gap="xs" class="swap-inputs-container">
          ${this.templateTokenInput("sourceToken",this.sourceToken)}
          ${this.templateTokenInput("toToken",this.toToken)} ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateDetails()} ${this.templateActionButton()}
      </wui-flex>
    `}actionButtonLabel(){return this.fetchError?"Swap":!this.sourceToken||!this.toToken?"Select token":this.sourceTokenAmount?this.inputError?this.inputError:"Review swap":"Enter amount"}templateReplaceTokensButton(){return l`
      <wui-flex class="replace-tokens-button-container">
        <button @click=${this.onSwitchTokens.bind(this)}>
          <wui-icon name="recycleHorizontal" color="fg-250" size="lg"></wui-icon>
        </button>
      </wui-flex>
    `}templateLoading(){return l`
      <wui-flex flexDirection="column" gap="l">
        <wui-flex flexDirection="column" alignItems="center" gap="xs" class="swap-inputs-container">
          <w3m-swap-input-skeleton target="sourceToken"></w3m-swap-input-skeleton>
          <w3m-swap-input-skeleton target="toToken"></w3m-swap-input-skeleton>
          ${this.templateReplaceTokensButton()}
        </wui-flex>
        ${this.templateActionButton()}
      </wui-flex>
    `}templateTokenInput(t,e){let r=i.state.myTokensWithBalance?.find(u=>u?.address===e?.address),s=t==="toToken"?this.toTokenAmount:this.sourceTokenAmount,o=t==="toToken"?this.toTokenPriceInUSD:this.sourceTokenPriceInUSD,a=U.parseLocalStringToNumber(s)*o;return l`<w3m-swap-input
      .value=${t==="toToken"?this.toTokenAmount:this.sourceTokenAmount}
      .disabled=${t==="toToken"}
      .onSetAmount=${this.handleChangeAmount.bind(this)}
      target=${t}
      .token=${e}
      .balance=${r?.quantity?.numeric}
      .price=${r?.price}
      .marketValue=${a}
      .onSetMaxValue=${this.onSetMaxValue.bind(this)}
    ></w3m-swap-input>`}onSetMaxValue(t,e){let r=U.bigNumber(e||"0");this.handleChangeAmount(t,r.gt(0)?r.toFixed(20):"0")}templateDetails(){return!this.sourceToken||!this.toToken||this.inputError?null:l`<w3m-swap-details .detailsOpen=${this.detailsOpen}></w3m-swap-details>`}handleChangeAmount(t,e){i.clearError(),t==="sourceToken"?i.setSourceTokenAmount(e):i.setToTokenAmount(e),this.onDebouncedGetSwapCalldata()}templateActionButton(){let t=!this.toToken||!this.sourceToken,e=!this.sourceTokenAmount,r=this.loadingQuote||this.loadingPrices||this.loadingTransaction,s=r||t||e||this.inputError;return l` <wui-flex gap="xs">
      <wui-button
        data-testid="swap-action-button"
        class="action-button"
        fullWidth
        size="lg"
        borderRadius="xs"
        variant=${t?"neutral":"main"}
        .loading=${r}
        .disabled=${s}
        @click=${this.onSwapPreview.bind(this)}
      >
        ${this.actionButtonLabel()}
      </wui-button>
    </wui-flex>`}onSwitchTokens(){i.switchTokens()}async onSwapPreview(){this.fetchError&&await i.swapTokens(),B.sendEvent({type:"track",event:"INITIATE_SWAP",properties:{network:this.caipNetworkId||"",swapFromToken:this.sourceToken?.symbol||"",swapToToken:this.toToken?.symbol||"",swapFromAmount:this.sourceTokenAmount||"",swapToAmount:this.toTokenAmount||"",isSmartAccount:Q(L.state.activeChain)===K.ACCOUNT_TYPES.SMART_ACCOUNT}}),$.push("SwapPreview")}async handleSwapParameters(){this.initialParams&&(i.state.initialized||await new Promise(e=>{let r=i.subscribeKey("initialized",s=>{s&&(r?.(),e())})}),await this.setSwapParameters(this.initialParams))}async setSwapParameters({amount:t,fromToken:e,toToken:r}){(!i.state.tokens||!i.state.myTokensWithBalance)&&await new Promise(a=>{let u=i.subscribeKey("myTokensWithBalance",V=>{V&&V.length>0&&(u?.(),a())});setTimeout(()=>{u?.(),a()},5e3)});let s=[...i.state.tokens||[],...i.state.myTokensWithBalance||[]];if(e){let o=s.find(a=>a.symbol.toLowerCase()===e.toLowerCase());o&&i.setSourceToken(o)}if(r){let o=s.find(a=>a.symbol.toLowerCase()===r.toLowerCase());o&&i.setToToken(o)}t&&!isNaN(Number(t))&&i.setSourceTokenAmount(t)}onCaipAddressChange({newCaipAddress:t,resetSwapState:e,initializeSwapState:r}){this.caipAddress!==t&&(this.caipAddress=t,e&&i.resetState(),r&&i.initializeState())}onCaipNetworkChange({newCaipNetwork:t,resetSwapState:e,initializeSwapState:r}){this.caipNetworkId!==t?.caipNetworkId&&(this.caipNetworkId=t?.caipNetworkId,e&&i.resetState(),r&&i.initializeState())}};w.styles=tt;f([m({type:Object})],w.prototype,"initialParams",void 0);f([n()],w.prototype,"interval",void 0);f([n()],w.prototype,"detailsOpen",void 0);f([n()],w.prototype,"caipAddress",void 0);f([n()],w.prototype,"caipNetworkId",void 0);f([n()],w.prototype,"initialized",void 0);f([n()],w.prototype,"loadingQuote",void 0);f([n()],w.prototype,"loadingPrices",void 0);f([n()],w.prototype,"loadingTransaction",void 0);f([n()],w.prototype,"sourceToken",void 0);f([n()],w.prototype,"sourceTokenAmount",void 0);f([n()],w.prototype,"sourceTokenPriceInUSD",void 0);f([n()],w.prototype,"toToken",void 0);f([n()],w.prototype,"toTokenAmount",void 0);f([n()],w.prototype,"toTokenPriceInUSD",void 0);f([n()],w.prototype,"inputError",void 0);f([n()],w.prototype,"fetchError",void 0);w=f([I("w3m-swap-view")],w);p();h();d();p();h();d();var et=y`
  :host > wui-flex:first-child {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  .preview-container,
  .details-container {
    width: 100%;
  }

  .token-image {
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: 12px;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .token-item {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-xxs);
    padding: var(--wui-spacing-xs);
    height: 40px;
    border: none;
    border-radius: 80px;
    background: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    cursor: pointer;
    transition: background 0.2s linear;
  }

  .token-item:hover {
    background: var(--wui-color-gray-glass-005);
  }

  .preview-token-details-container {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: var(--wui-spacing-s) var(--wui-spacing-xl);
    border-radius: var(--wui-border-radius-xxs);
    background: var(--wui-color-gray-glass-002);
  }

  .action-buttons-container {
    width: 100%;
    gap: var(--wui-spacing-xs);
  }

  .action-buttons-container > button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    height: 48px;
    border-radius: var(--wui-border-radius-xs);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  .action-buttons-container > button:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }

  .action-button > wui-loading-spinner {
    display: inline-block;
  }

  .cancel-button:hover,
  .action-button:hover {
    cursor: pointer;
  }

  .action-buttons-container > wui-button.cancel-button {
    flex: 2;
  }

  .action-buttons-container > wui-button.action-button {
    flex: 4;
  }

  .action-buttons-container > button.action-button > wui-text {
    color: white;
  }

  .details-container > wui-flex {
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    width: 100%;
  }

  .details-container > wui-flex > button {
    border: none;
    background: none;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    transition: background 0.2s linear;
  }

  .details-container > wui-flex > button:hover {
    background: var(--wui-color-gray-glass-002);
  }

  .details-content-container {
    padding: var(--wui-spacing-1xs);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .details-content-container > wui-flex {
    width: 100%;
  }

  .details-row {
    width: 100%;
    padding: var(--wui-spacing-s) var(--wui-spacing-xl);
    border-radius: var(--wui-border-radius-xxs);
    background: var(--wui-color-gray-glass-002);
  }
`;var x=function(c,t,e,r){var s=arguments.length,o=s<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,e):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,r);else for(var u=c.length-1;u>=0;u--)(a=c[u])&&(o=(s<3?a(o):s>3?a(t,e,o):a(t,e))||o);return s>3&&o&&Object.defineProperty(t,e,o),o},g=class extends S{constructor(){super(),this.unsubscribe=[],this.detailsOpen=!0,this.approvalTransaction=i.state.approvalTransaction,this.swapTransaction=i.state.swapTransaction,this.sourceToken=i.state.sourceToken,this.sourceTokenAmount=i.state.sourceTokenAmount??"",this.sourceTokenPriceInUSD=i.state.sourceTokenPriceInUSD,this.toToken=i.state.toToken,this.toTokenAmount=i.state.toTokenAmount??"",this.toTokenPriceInUSD=i.state.toTokenPriceInUSD,this.caipNetwork=L.state.activeCaipNetwork,this.balanceSymbol=R.state.balanceSymbol,this.inputError=i.state.inputError,this.loadingQuote=i.state.loadingQuote,this.loadingApprovalTransaction=i.state.loadingApprovalTransaction,this.loadingBuildTransaction=i.state.loadingBuildTransaction,this.loadingTransaction=i.state.loadingTransaction,this.unsubscribe.push(R.subscribeKey("balanceSymbol",t=>{this.balanceSymbol!==t&&$.goBack()}),L.subscribeKey("activeCaipNetwork",t=>{this.caipNetwork!==t&&(this.caipNetwork=t)}),i.subscribe(t=>{this.approvalTransaction=t.approvalTransaction,this.swapTransaction=t.swapTransaction,this.sourceToken=t.sourceToken,this.toToken=t.toToken,this.toTokenPriceInUSD=t.toTokenPriceInUSD,this.sourceTokenAmount=t.sourceTokenAmount??"",this.toTokenAmount=t.toTokenAmount??"",this.inputError=t.inputError,t.inputError&&$.goBack(),this.loadingQuote=t.loadingQuote,this.loadingApprovalTransaction=t.loadingApprovalTransaction,this.loadingBuildTransaction=t.loadingBuildTransaction,this.loadingTransaction=t.loadingTransaction}))}firstUpdated(){i.getTransaction(),this.refreshTransaction()}disconnectedCallback(){this.unsubscribe.forEach(t=>t?.()),clearInterval(this.interval)}render(){return l`
      <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
        ${this.templateSwap()}
      </wui-flex>
    `}refreshTransaction(){this.interval=setInterval(()=>{i.getApprovalLoadingState()||i.getTransaction()},1e4)}templateSwap(){let t=`${b.formatNumberToLocalString(parseFloat(this.sourceTokenAmount))} ${this.sourceToken?.symbol}`,e=`${b.formatNumberToLocalString(parseFloat(this.toTokenAmount))} ${this.toToken?.symbol}`,r=parseFloat(this.sourceTokenAmount)*this.sourceTokenPriceInUSD,s=parseFloat(this.toTokenAmount)*this.toTokenPriceInUSD,o=b.formatNumberToLocalString(r),a=b.formatNumberToLocalString(s),u=this.loadingQuote||this.loadingBuildTransaction||this.loadingTransaction||this.loadingApprovalTransaction;return l`
      <wui-flex flexDirection="column" alignItems="center" gap="l">
        <wui-flex class="preview-container" flexDirection="column" alignItems="flex-start" gap="l">
          <wui-flex
            class="preview-token-details-container"
            alignItems="center"
            justifyContent="space-between"
            gap="l"
          >
            <wui-flex flexDirection="column" alignItems="flex-start" gap="4xs">
              <wui-text variant="small-400" color="fg-150">Send</wui-text>
              <wui-text variant="paragraph-400" color="fg-100">$${o}</wui-text>
            </wui-flex>
            <wui-token-button
              flexDirection="row-reverse"
              text=${t}
              imageSrc=${this.sourceToken?.logoUri}
            >
            </wui-token-button>
          </wui-flex>
          <wui-icon name="recycleHorizontal" color="fg-200" size="md"></wui-icon>
          <wui-flex
            class="preview-token-details-container"
            alignItems="center"
            justifyContent="space-between"
            gap="l"
          >
            <wui-flex flexDirection="column" alignItems="flex-start" gap="4xs">
              <wui-text variant="small-400" color="fg-150">Receive</wui-text>
              <wui-text variant="paragraph-400" color="fg-100">$${a}</wui-text>
            </wui-flex>
            <wui-token-button
              flexDirection="row-reverse"
              text=${e}
              imageSrc=${this.toToken?.logoUri}
            >
            </wui-token-button>
          </wui-flex>
        </wui-flex>

        ${this.templateDetails()}

        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="xs">
          <wui-icon size="sm" color="fg-200" name="infoCircle"></wui-icon>
          <wui-text variant="small-400" color="fg-200">Review transaction carefully</wui-text>
        </wui-flex>

        <wui-flex
          class="action-buttons-container"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap="xs"
        >
          <wui-button
            class="cancel-button"
            fullWidth
            size="lg"
            borderRadius="xs"
            variant="neutral"
            @click=${this.onCancelTransaction.bind(this)}
          >
            <wui-text variant="paragraph-600" color="fg-200">Cancel</wui-text>
          </wui-button>
          <wui-button
            class="action-button"
            fullWidth
            size="lg"
            borderRadius="xs"
            variant="main"
            ?loading=${u}
            ?disabled=${u}
            @click=${this.onSendTransaction.bind(this)}
          >
            <wui-text variant="paragraph-600" color="inverse-100">
              ${this.actionButtonLabel()}
            </wui-text>
          </wui-button>
        </wui-flex>
      </wui-flex>
    `}templateDetails(){return!this.sourceToken||!this.toToken||this.inputError?null:l`<w3m-swap-details .detailsOpen=${this.detailsOpen}></w3m-swap-details>`}actionButtonLabel(){return this.loadingApprovalTransaction?"Approving...":this.approvalTransaction?"Approve":"Swap"}onCancelTransaction(){$.goBack()}onSendTransaction(){this.approvalTransaction?i.sendTransactionForApproval(this.approvalTransaction):i.sendTransactionForSwap(this.swapTransaction)}};g.styles=et;x([n()],g.prototype,"interval",void 0);x([n()],g.prototype,"detailsOpen",void 0);x([n()],g.prototype,"approvalTransaction",void 0);x([n()],g.prototype,"swapTransaction",void 0);x([n()],g.prototype,"sourceToken",void 0);x([n()],g.prototype,"sourceTokenAmount",void 0);x([n()],g.prototype,"sourceTokenPriceInUSD",void 0);x([n()],g.prototype,"toToken",void 0);x([n()],g.prototype,"toTokenAmount",void 0);x([n()],g.prototype,"toTokenPriceInUSD",void 0);x([n()],g.prototype,"caipNetwork",void 0);x([n()],g.prototype,"balanceSymbol",void 0);x([n()],g.prototype,"inputError",void 0);x([n()],g.prototype,"loadingQuote",void 0);x([n()],g.prototype,"loadingApprovalTransaction",void 0);x([n()],g.prototype,"loadingBuildTransaction",void 0);x([n()],g.prototype,"loadingTransaction",void 0);g=x([I("w3m-swap-preview-view")],g);p();h();d();p();h();d();p();h();d();p();h();d();var ot=y`
  :host {
    height: 60px;
    min-height: 60px;
  }

  :host > wui-flex {
    cursor: pointer;
    height: 100%;
    display: flex;
    column-gap: var(--wui-spacing-s);
    padding: var(--wui-spacing-xs);
    padding-right: var(--wui-spacing-l);
    width: 100%;
    background-color: transparent;
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      background-color var(--wui-ease-out-power-1) var(--wui-duration-lg),
      opacity var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color, opacity;
  }

  @media (hover: hover) and (pointer: fine) {
    :host > wui-flex:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    :host > wui-flex:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  :host([disabled]) > wui-flex {
    opacity: 0.6;
  }

  :host([disabled]) > wui-flex:hover {
    background-color: transparent;
  }

  :host > wui-flex > wui-flex {
    flex: 1;
  }

  :host > wui-flex > wui-image,
  :host > wui-flex > .token-item-image-placeholder {
    width: 40px;
    max-width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-3xl);
    position: relative;
  }

  :host > wui-flex > .token-item-image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host > wui-flex > wui-image::after,
  :host > wui-flex > .token-item-image-placeholder::after {
    position: absolute;
    content: '';
    inset: 0;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
    border-radius: var(--wui-border-radius-l);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }
`;var j=function(c,t,e,r){var s=arguments.length,o=s<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,e):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,r);else for(var u=c.length-1;u>=0;u--)(a=c[u])&&(o=(s<3?a(o):s>3?a(t,e,o):a(t,e))||o);return s>3&&o&&Object.defineProperty(t,e,o),o},N=class extends S{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.imageSrc=void 0,this.name=void 0,this.symbol=void 0,this.price=void 0,this.amount=void 0,this.visible=!1,this.imageError=!1,this.observer=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting?this.visible=!0:this.visible=!1})},{threshold:.1})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){if(!this.visible)return null;let t=this.amount&&this.price?U.multiply(this.price,this.amount)?.toFixed(3):null;return l`
      <wui-flex alignItems="center">
        ${this.visualTemplate()}
        <wui-flex flexDirection="column" gap="3xs">
          <wui-flex justifyContent="space-between">
            <wui-text variant="paragraph-500" color="fg-100" lineClamp="1">${this.name}</wui-text>
            ${t?l`
                  <wui-text variant="paragraph-500" color="fg-100">
                    $${b.formatNumberToLocalString(t,3)}
                  </wui-text>
                `:null}
          </wui-flex>
          <wui-flex justifyContent="space-between">
            <wui-text variant="small-400" color="fg-200" lineClamp="1">${this.symbol}</wui-text>
            ${this.amount?l`<wui-text variant="small-400" color="fg-200">
                  ${b.formatNumberToLocalString(this.amount,4)}
                </wui-text>`:null}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}visualTemplate(){return this.imageError?l`<wui-flex class="token-item-image-placeholder">
        <wui-icon name="image" color="inherit"></wui-icon>
      </wui-flex>`:this.imageSrc?l`<wui-image
        width="40"
        height="40"
        src=${this.imageSrc}
        @onLoadError=${this.imageLoadError}
      ></wui-image>`:null}imageLoadError(){this.imageError=!0}};N.styles=[H,G,ot];j([m()],N.prototype,"imageSrc",void 0);j([m()],N.prototype,"name",void 0);j([m()],N.prototype,"symbol",void 0);j([m()],N.prototype,"price",void 0);j([m()],N.prototype,"amount",void 0);j([n()],N.prototype,"visible",void 0);j([n()],N.prototype,"imageError",void 0);N=j([I("wui-token-list-item")],N);p();h();d();var it=y`
  :host {
    --tokens-scroll--top-opacity: 0;
    --tokens-scroll--bottom-opacity: 1;
    --suggested-tokens-scroll--left-opacity: 0;
    --suggested-tokens-scroll--right-opacity: 1;
  }

  :host > wui-flex:first-child {
    overflow-y: hidden;
    overflow-x: hidden;
    scrollbar-width: none;
    scrollbar-height: none;
  }

  :host > wui-flex:first-child::-webkit-scrollbar {
    display: none;
  }

  wui-loading-hexagon {
    position: absolute;
  }

  .suggested-tokens-container {
    overflow-x: auto;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, calc(1 - var(--suggested-tokens-scroll--left-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--suggested-tokens-scroll--left-opacity))) 1px,
      black 50px,
      black 90px,
      black calc(100% - 90px),
      black calc(100% - 50px),
      rgba(155, 155, 155, calc(1 - var(--suggested-tokens-scroll--right-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--suggested-tokens-scroll--right-opacity))) 100%
    );
  }

  .suggested-tokens-container::-webkit-scrollbar {
    display: none;
  }

  .tokens-container {
    border-top: 1px solid var(--wui-color-gray-glass-005);
    height: 100%;
    max-height: 390px;
  }

  .tokens {
    width: 100%;
    overflow-y: auto;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--tokens-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--tokens-scroll--top-opacity))) 1px,
      black 50px,
      black 90px,
      black calc(100% - 90px),
      black calc(100% - 50px),
      rgba(155, 155, 155, calc(1 - var(--tokens-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--tokens-scroll--bottom-opacity))) 100%
    );
  }

  .network-search-input,
  .select-network-button {
    height: 40px;
  }

  .select-network-button {
    border: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: transparent;
    border-radius: var(--wui-border-radius-xxs);
    padding: var(--wui-spacing-xs);
    align-items: center;
    transition: background-color 0.2s linear;
  }

  .select-network-button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  .select-network-button > wui-image {
    width: 26px;
    height: 26px;
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }
`;var _=function(c,t,e,r){var s=arguments.length,o=s<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,e):r,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,t,e,r);else for(var u=c.length-1;u>=0;u--)(a=c[u])&&(o=(s<3?a(o):s>3?a(t,e,o):a(t,e))||o);return s>3&&o&&Object.defineProperty(t,e,o),o},E=class extends S{constructor(){super(),this.unsubscribe=[],this.targetToken=$.state.data?.target,this.sourceToken=i.state.sourceToken,this.sourceTokenAmount=i.state.sourceTokenAmount,this.toToken=i.state.toToken,this.myTokensWithBalance=i.state.myTokensWithBalance,this.popularTokens=i.state.popularTokens,this.searchValue="",this.unsubscribe.push(i.subscribe(t=>{this.sourceToken=t.sourceToken,this.toToken=t.toToken,this.myTokensWithBalance=t.myTokensWithBalance}))}updated(){this.renderRoot?.querySelector(".suggested-tokens-container")?.addEventListener("scroll",this.handleSuggestedTokensScroll.bind(this)),this.renderRoot?.querySelector(".tokens")?.addEventListener("scroll",this.handleTokenListScroll.bind(this))}disconnectedCallback(){super.disconnectedCallback();let t=this.renderRoot?.querySelector(".suggested-tokens-container"),e=this.renderRoot?.querySelector(".tokens");t?.removeEventListener("scroll",this.handleSuggestedTokensScroll.bind(this)),e?.removeEventListener("scroll",this.handleTokenListScroll.bind(this)),clearInterval(this.interval)}render(){return l`
      <wui-flex flexDirection="column" gap="s">
        ${this.templateSearchInput()} ${this.templateSuggestedTokens()} ${this.templateTokens()}
      </wui-flex>
    `}onSelectToken(t){this.targetToken==="sourceToken"?i.setSourceToken(t):(i.setToToken(t),this.sourceToken&&this.sourceTokenAmount&&i.swapTokens()),$.goBack()}templateSearchInput(){return l`
      <wui-flex .padding=${["3xs","s","0","s"]} gap="xs">
        <wui-input-text
          data-testid="swap-select-token-search-input"
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
          .value=${this.searchValue}
          @inputChange=${this.onSearchInputChange.bind(this)}
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){let t=this.myTokensWithBalance?Object.values(this.myTokensWithBalance):[],e=this.popularTokens?this.popularTokens:[],r=this.filterTokensWithText(t,this.searchValue),s=this.filterTokensWithText(e,this.searchValue);return l`
      <wui-flex class="tokens-container">
        <wui-flex class="tokens" .padding=${["0","s","s","s"]} flexDirection="column">
          ${r?.length>0?l`
                <wui-flex justifyContent="flex-start" padding="s">
                  <wui-text variant="paragraph-500" color="fg-200">Your tokens</wui-text>
                </wui-flex>
                ${r.map(o=>{let a=o.symbol===this.sourceToken?.symbol||o.symbol===this.toToken?.symbol;return l`
                    <wui-token-list-item
                      data-testid="swap-select-token-item-${o.symbol}"
                      name=${o.name}
                      ?disabled=${a}
                      symbol=${o.symbol}
                      price=${o?.price}
                      amount=${o?.quantity?.numeric}
                      imageSrc=${o.logoUri}
                      @click=${()=>{a||this.onSelectToken(o)}}
                    >
                    </wui-token-list-item>
                  `})}
              `:null}

          <wui-flex justifyContent="flex-start" padding="s">
            <wui-text variant="paragraph-500" color="fg-200">Tokens</wui-text>
          </wui-flex>
          ${s?.length>0?s.map(o=>l`
                  <wui-token-list-item
                    data-testid="swap-select-token-item-${o.symbol}"
                    name=${o.name}
                    symbol=${o.symbol}
                    imageSrc=${o.logoUri}
                    @click=${()=>this.onSelectToken(o)}
                  >
                  </wui-token-list-item>
                `):null}
        </wui-flex>
      </wui-flex>
    `}templateSuggestedTokens(){let t=i.state.suggestedTokens?i.state.suggestedTokens.slice(0,8):null;return t?l`
      <wui-flex class="suggested-tokens-container" .padding=${["0","s","0","s"]} gap="xs">
        ${t.map(e=>l`
            <wui-token-button
              text=${e.symbol}
              imageSrc=${e.logoUri}
              @click=${()=>this.onSelectToken(e)}
            >
            </wui-token-button>
          `)}
      </wui-flex>
    `:null}onSearchInputChange(t){this.searchValue=t.detail}handleSuggestedTokensScroll(){let t=this.renderRoot?.querySelector(".suggested-tokens-container");t&&(t.style.setProperty("--suggested-tokens-scroll--left-opacity",O.interpolate([0,100],[0,1],t.scrollLeft).toString()),t.style.setProperty("--suggested-tokens-scroll--right-opacity",O.interpolate([0,100],[0,1],t.scrollWidth-t.scrollLeft-t.offsetWidth).toString()))}handleTokenListScroll(){let t=this.renderRoot?.querySelector(".tokens");t&&(t.style.setProperty("--tokens-scroll--top-opacity",O.interpolate([0,100],[0,1],t.scrollTop).toString()),t.style.setProperty("--tokens-scroll--bottom-opacity",O.interpolate([0,100],[0,1],t.scrollHeight-t.scrollTop-t.offsetHeight).toString()))}filterTokensWithText(t,e){return t.filter(r=>`${r.symbol} ${r.name} ${r.address}`.toLowerCase().includes(e.toLowerCase()))}};E.styles=it;_([n()],E.prototype,"interval",void 0);_([n()],E.prototype,"targetToken",void 0);_([n()],E.prototype,"sourceToken",void 0);_([n()],E.prototype,"sourceTokenAmount",void 0);_([n()],E.prototype,"toToken",void 0);_([n()],E.prototype,"myTokensWithBalance",void 0);_([n()],E.prototype,"popularTokens",void 0);_([n()],E.prototype,"searchValue",void 0);E=_([I("w3m-swap-select-token-view")],E);export{g as W3mSwapPreviewView,E as W3mSwapSelectTokenView,w as W3mSwapView};
