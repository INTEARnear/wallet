import"./chunk-QBEY52PF.js";import"./chunk-27YRW757.js";import"./chunk-SEJLZ3OT.js";import"./chunk-TI7CUUHJ.js";import"./chunk-NHUA5J6J.js";import"./chunk-4QOCBQPC.js";import"./chunk-L3N6HIOI.js";import"./chunk-PTZTZUDB.js";import"./chunk-RBOFKV5S.js";import"./chunk-Z6LVO3CP.js";import"./chunk-RL7GPJDA.js";import{a as Q,b as X}from"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-MNAGPPOX.js";import"./chunk-EJ5H5H5L.js";import"./chunk-IPTO6NMX.js";import"./chunk-BI3DTO7P.js";import"./chunk-RLPEU2I3.js";import{a as ae}from"./chunk-B2LU4KHT.js";import{i as z,r as b,v as H,w as M,x as N,z as v}from"./chunk-RZQOM5QR.js";import"./chunk-HQPTEMSB.js";import{a as g,b as m}from"./chunk-IDZGCU4F.js";import{e as d,k as x}from"./chunk-ZS2R6O6N.js";import"./chunk-SQN7L5MN.js";import"./chunk-7GZ7JYLK.js";import"./chunk-6HADIPAO.js";import"./chunk-2T4BE52W.js";import"./chunk-XQOHLC2A.js";import{B as R,I as S,K as oe,N as L,O as ne,S as k,aa as U,ba as se,fa as a,ga as y,ia as F,j as te,l as G,r as ie,z as re}from"./chunk-OXOEMY67.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as l,k as c,o as u}from"./chunk-JY5TIRRF.js";l();u();c();l();u();c();l();u();c();l();u();c();var le=b`
  :host {
    width: 100%;
    height: 100px;
    border-radius: ${({borderRadius:e})=>e[5]};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
    position: relative;
  }

  :host(:hover) {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    display: ruby;
    color: ${({tokens:e})=>e.theme.textPrimary};
    margin: 0 ${({spacing:e})=>e[2]};
  }

  .instruction {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  .paste {
    display: inline-flex;
  }

  textarea {
    background: transparent;
    width: 100%;
    font-family: ${({fontFamily:e})=>e.regular};
    font-style: normal;
    font-size: ${({textSize:e})=>e.large};
    font-weight: ${({fontWeight:e})=>e.regular};
    line-height: ${({typography:e})=>e["lg-regular"].lineHeight};
    letter-spacing: ${({typography:e})=>e["lg-regular"].letterSpacing};
    color: ${({tokens:e})=>e.theme.textSecondary};
    caret-color: ${({tokens:e})=>e.core.backgroundAccentPrimary};
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    border: none;
    outline: none;
    appearance: none;
    resize: none;
    overflow: hidden;
  }
`;var W=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},P=class extends x{constructor(){super(...arguments),this.inputElementRef=Q(),this.instructionElementRef=Q(),this.readOnly=!1,this.instructionHidden=!!this.value,this.pasting=!1,this.onDebouncedSearch=R.debounce(async t=>{if(!t.length){this.setReceiverAddress("");return}let r=y.state.activeChain;if(R.isAddress(t,r)){this.setReceiverAddress(t);return}try{let n=await U.getEnsAddress(t);if(n){a.setReceiverProfileName(t),a.setReceiverAddress(n);let i=await U.getEnsAvatar(t);a.setReceiverProfileImageUrl(i||void 0)}}catch{this.setReceiverAddress(t)}finally{a.setLoading(!1)}})}firstUpdated(){this.value&&(this.instructionHidden=!0),this.checkHidden()}render(){return this.readOnly?d` <wui-flex
        flexDirection="column"
        justifyContent="center"
        gap="01"
        .padding=${["8","4","5","4"]}
      >
        <textarea
          spellcheck="false"
          ?disabled=${!0}
          autocomplete="off"
          .value=${this.value??""}
        >
           ${this.value??""}</textarea
        >
      </wui-flex>`:d` <wui-flex
      @click=${this.onBoxClick.bind(this)}
      flexDirection="column"
      justifyContent="center"
      gap="01"
      .padding=${["8","4","5","4"]}
    >
      <wui-text
        ${X(this.instructionElementRef)}
        class="instruction"
        color="secondary"
        variant="md-medium"
      >
        Type or
        <wui-button
          class="paste"
          size="md"
          variant="neutral-secondary"
          iconLeft="copy"
          @click=${this.onPasteClick.bind(this)}
        >
          <wui-icon size="sm" color="inherit" slot="iconLeft" name="copy"></wui-icon>
          Paste
        </wui-button>
        address
      </wui-text>
      <textarea
        spellcheck="false"
        ?disabled=${!this.instructionHidden}
        ${X(this.inputElementRef)}
        @input=${this.onInputChange.bind(this)}
        @blur=${this.onBlur.bind(this)}
        .value=${this.value??""}
        autocomplete="off"
      >
${this.value??""}</textarea
      >
    </wui-flex>`}async focusInput(){this.instructionElementRef.value&&(this.instructionHidden=!0,await this.toggleInstructionFocus(!1),this.instructionElementRef.value.style.pointerEvents="none",this.inputElementRef.value?.focus(),this.inputElementRef.value&&(this.inputElementRef.value.selectionStart=this.inputElementRef.value.selectionEnd=this.inputElementRef.value.value.length))}async focusInstruction(){this.instructionElementRef.value&&(this.instructionHidden=!1,await this.toggleInstructionFocus(!0),this.instructionElementRef.value.style.pointerEvents="auto",this.inputElementRef.value?.blur())}async toggleInstructionFocus(t){this.instructionElementRef.value&&await this.instructionElementRef.value.animate([{opacity:t?0:1},{opacity:t?1:0}],{duration:100,easing:"ease",fill:"forwards"}).finished}onBoxClick(){!this.value&&!this.instructionHidden&&this.focusInput()}onBlur(){!this.value&&this.instructionHidden&&!this.pasting&&this.focusInstruction()}checkHidden(){this.instructionHidden&&this.focusInput()}async onPasteClick(){this.pasting=!0;let t=await navigator.clipboard.readText();a.setReceiverAddress(t),this.focusInput()}onInputChange(t){let r=t.target;this.pasting=!1,this.value=t.target?.value,r.value&&!this.instructionHidden&&this.focusInput(),a.setLoading(!0),this.onDebouncedSearch(r.value)}setReceiverAddress(t){a.setReceiverAddress(t),a.setReceiverProfileName(void 0),a.setReceiverProfileImageUrl(void 0),a.setLoading(!1)}};P.styles=le;W([g()],P.prototype,"value",void 0);W([g({type:Boolean})],P.prototype,"readOnly",void 0);W([m()],P.prototype,"instructionHidden",void 0);W([m()],P.prototype,"pasting",void 0);P=W([v("w3m-input-address")],P);l();u();c();l();u();c();var ce=b`
  :host {
    width: 100%;
    height: 100px;
    border-radius: ${({borderRadius:e})=>e[5]};
    border: 1px solid ${({tokens:e})=>e.theme.foregroundPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
    transition: all ${({easings:e})=>e["ease-out-power-1"]}
      ${({durations:e})=>e.lg};
  }

  :host(:hover) {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-flex {
    width: 100%;
    height: fit-content;
  }

  wui-button {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  wui-input-amount {
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

  .totalValue {
    width: 100%;
  }
`;var j=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},I=class extends x{constructor(){super(...arguments),this.readOnly=!1,this.isInsufficientBalance=!1}render(){let t=this.readOnly||!this.token;return d` <wui-flex
      flexDirection="column"
      gap="01"
      .padding=${["5","3","4","3"]}
    >
      <wui-flex alignItems="center">
        <wui-input-amount
          @inputChange=${this.onInputChange.bind(this)}
          ?disabled=${t}
          .value=${this.sendTokenAmount?String(this.sendTokenAmount):""}
          ?error=${!!this.isInsufficientBalance}
        ></wui-input-amount>
        ${this.buttonTemplate()}
      </wui-flex>
      ${this.bottomTemplate()}
    </wui-flex>`}buttonTemplate(){return this.token?d`<wui-token-button
        text=${this.token.symbol}
        imageSrc=${this.token.iconUrl}
        @click=${this.handleSelectButtonClick.bind(this)}
      >
      </wui-token-button>`:d`<wui-button
      size="md"
      variant="neutral-secondary"
      @click=${this.handleSelectButtonClick.bind(this)}
      >Select token</wui-button
    >`}handleSelectButtonClick(){this.readOnly||k.push("WalletSendSelectToken")}sendValueTemplate(){if(!this.readOnly&&this.token&&this.sendTokenAmount){let r=this.token.price*this.sendTokenAmount;return d`<wui-text class="totalValue" variant="sm-regular" color="secondary"
        >${r?`$${G.formatNumberToLocalString(r,2)}`:"Incorrect value"}</wui-text
      >`}return null}maxAmountTemplate(){return this.token?d` <wui-text variant="sm-regular" color="secondary">
        ${N.roundNumber(Number(this.token.quantity.numeric),6,5)}
      </wui-text>`:null}actionTemplate(){return this.token?d`<wui-link @click=${this.onMaxClick.bind(this)}>Max</wui-link>`:null}bottomTemplate(){return this.readOnly?null:d`<wui-flex alignItems="center" justifyContent="space-between">
      ${this.sendValueTemplate()}
      <wui-flex alignItems="center" gap="01" justifyContent="flex-end">
        ${this.maxAmountTemplate()} ${this.actionTemplate()}
      </wui-flex>
    </wui-flex>`}onInputChange(t){a.setTokenAmount(t.detail)}onMaxClick(){if(this.token){let t=G.bigNumber(this.token.quantity.numeric);a.setTokenAmount(Number(t.toFixed(20)))}}};I.styles=ce;j([g({type:Object})],I.prototype,"token",void 0);j([g({type:Boolean})],I.prototype,"readOnly",void 0);j([g({type:Number})],I.prototype,"sendTokenAmount",void 0);j([g({type:Boolean})],I.prototype,"isInsufficientBalance",void 0);I=j([v("w3m-input-token")],I);l();u();c();var ue=b`
  :host {
    display: block;
  }

  wui-flex {
    position: relative;
  }

  wui-icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[10]} !important;
    border: 4px solid ${({tokens:e})=>e.theme.backgroundPrimary};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
  }

  wui-button {
    --local-border-radius: ${({borderRadius:e})=>e[4]} !important;
  }

  .inputContainer {
    height: fit-content;
  }
`;var T=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},C={INSUFFICIENT_FUNDS:"Insufficient Funds",INCORRECT_VALUE:"Incorrect Value",INVALID_ADDRESS:"Invalid Address",ADD_ADDRESS:"Add Address",ADD_AMOUNT:"Add Amount",SELECT_TOKEN:"Select Token",PREVIEW_SEND:"Preview Send"},$=class extends x{constructor(){super(),this.unsubscribe=[],this.isTryingToChooseDifferentWallet=!1,this.token=a.state.token,this.sendTokenAmount=a.state.sendTokenAmount,this.receiverAddress=a.state.receiverAddress,this.receiverProfileName=a.state.receiverProfileName,this.loading=a.state.loading,this.params=k.state.data?.send,this.caipAddress=y.getAccountData()?.caipAddress,this.message=C.PREVIEW_SEND,this.disconnecting=!1,this.token&&!this.params&&(this.fetchBalances(),this.fetchNetworkPrice());let t=y.subscribeKey("activeCaipAddress",r=>{!r&&this.isTryingToChooseDifferentWallet&&(this.isTryingToChooseDifferentWallet=!1,F.open({view:"Connect",data:{redirectView:"WalletSend"}}).catch(()=>null),t())});this.unsubscribe.push(y.subscribeAccountStateProp("caipAddress",r=>{this.caipAddress=r}),a.subscribe(r=>{this.token=r.token,this.sendTokenAmount=r.sendTokenAmount,this.receiverAddress=r.receiverAddress,this.receiverProfileName=r.receiverProfileName,this.loading=r.loading}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}async firstUpdated(){await this.handleSendParameters()}render(){this.getMessage();let t=!!this.params;return d` <wui-flex flexDirection="column" .padding=${["0","4","4","4"]}>
      <wui-flex class="inputContainer" gap="2" flexDirection="column">
        <w3m-input-token
          .token=${this.token}
          .sendTokenAmount=${this.sendTokenAmount}
          ?readOnly=${t}
          ?isInsufficientBalance=${this.message===C.INSUFFICIENT_FUNDS}
        ></w3m-input-token>
        <wui-icon-box size="md" variant="secondary" icon="arrowBottom"></wui-icon-box>
        <w3m-input-address
          ?readOnly=${t}
          .value=${this.receiverProfileName?this.receiverProfileName:this.receiverAddress}
        ></w3m-input-address>
      </wui-flex>
      ${this.buttonTemplate()}
    </wui-flex>`}async fetchBalances(){await a.fetchTokenBalance(),a.fetchNetworkBalance()}async fetchNetworkPrice(){await z.getNetworkTokenPrice()}onButtonClick(){k.push("WalletSendPreview",{send:this.params})}onFundWalletClick(){k.push("FundWallet",{redirectView:"WalletSend"})}async onConnectDifferentWalletClick(){try{this.isTryingToChooseDifferentWallet=!0,this.disconnecting=!0,await U.disconnect()}finally{this.disconnecting=!1}}getMessage(){this.message=C.PREVIEW_SEND,this.receiverAddress&&!R.isAddress(this.receiverAddress,y.state.activeChain)&&(this.message=C.INVALID_ADDRESS),this.receiverAddress||(this.message=C.ADD_ADDRESS),this.sendTokenAmount&&this.token&&this.sendTokenAmount>Number(this.token.quantity.numeric)&&(this.message=C.INSUFFICIENT_FUNDS),this.sendTokenAmount||(this.message=C.ADD_AMOUNT),this.sendTokenAmount&&this.token?.price&&(this.sendTokenAmount*this.token.price||(this.message=C.INCORRECT_VALUE)),this.token||(this.message=C.SELECT_TOKEN)}buttonTemplate(){let t=!this.message.startsWith(C.PREVIEW_SEND),r=this.message===C.INSUFFICIENT_FUNDS,o=!!this.params;return r&&!o?d`
        <wui-flex .margin=${["4","0","0","0"]} flexDirection="column" gap="4">
          <wui-button
            @click=${this.onFundWalletClick.bind(this)}
            size="lg"
            variant="accent-secondary"
            fullWidth
          >
            Fund Wallet
          </wui-button>

          <wui-separator data-testid="wui-separator" text="or"></wui-separator>

          <wui-button
            @click=${this.onConnectDifferentWalletClick.bind(this)}
            size="lg"
            variant="neutral-secondary"
            fullWidth
            ?loading=${this.disconnecting}
          >
            Connect a different wallet
          </wui-button>
        </wui-flex>
      `:d`<wui-flex .margin=${["4","0","0","0"]}>
      <wui-button
        @click=${this.onButtonClick.bind(this)}
        ?disabled=${t}
        size="lg"
        variant="accent-primary"
        ?loading=${this.loading}
        fullWidth
      >
        ${this.message}
      </wui-button>
    </wui-flex>`}async handleSendParameters(){if(this.loading=!0,!this.params){this.loading=!1;return}let t=Number(this.params.amount);if(isNaN(t)){S.showError("Invalid amount"),this.loading=!1;return}let{namespace:r,chainId:o,assetAddress:n}=this.params;if(!re.SEND_PARAMS_SUPPORTED_CHAINS.includes(r)){S.showError(`Chain "${r}" is not supported for send parameters`),this.loading=!1;return}let i=y.getCaipNetworkById(o,r);if(!i){S.showError(`Network with id "${o}" not found`),this.loading=!1;return}try{let{balance:s,name:p,symbol:J,decimals:ee}=await se.fetchERC20Balance({caipAddress:this.caipAddress,assetAddress:n,caipNetwork:i});if(!p||!J||!ee||!s){S.showError("Token not found");return}a.setToken({name:p,symbol:J,chainId:i.id.toString(),address:`${i.chainNamespace}:${i.id}:${n}`,value:0,price:0,quantity:{decimals:ee.toString(),numeric:s.toString()},iconUrl:L.getTokenImage(J)??""}),a.setTokenAmount(t),a.setReceiverAddress(this.params.to)}catch(s){console.error("Failed to load token information:",s),S.showError("Failed to load token information")}finally{this.loading=!1}}};$.styles=ue;T([m()],$.prototype,"token",void 0);T([m()],$.prototype,"sendTokenAmount",void 0);T([m()],$.prototype,"receiverAddress",void 0);T([m()],$.prototype,"receiverProfileName",void 0);T([m()],$.prototype,"loading",void 0);T([m()],$.prototype,"params",void 0);T([m()],$.prototype,"caipAddress",void 0);T([m()],$.prototype,"message",void 0);T([m()],$.prototype,"disconnecting",void 0);$=T([v("w3m-wallet-send-view")],$);l();u();c();l();u();c();var de=b`
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
`;var V=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},D=class extends x{constructor(){super(),this.unsubscribe=[],this.tokenBalances=a.state.tokenBalances,this.search="",this.onDebouncedSearch=R.debounce(t=>{this.search=t}),this.fetchBalancesAndNetworkPrice(),this.unsubscribe.push(a.subscribe(t=>{this.tokenBalances=t.tokenBalances}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return d`
      <wui-flex flexDirection="column">
        ${this.templateSearchInput()} <wui-separator></wui-separator> ${this.templateTokens()}
      </wui-flex>
    `}async fetchBalancesAndNetworkPrice(){(!this.tokenBalances||this.tokenBalances?.length===0)&&(await this.fetchBalances(),await this.fetchNetworkPrice())}async fetchBalances(){await a.fetchTokenBalance(),a.fetchNetworkBalance()}async fetchNetworkPrice(){await z.getNetworkTokenPrice()}templateSearchInput(){return d`
      <wui-flex gap="2" padding="3">
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="sm"
          placeholder="Search token"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}templateTokens(){return this.tokens=this.tokenBalances?.filter(t=>t.chainId===y.state.activeCaipNetwork?.caipNetworkId),this.search?this.filteredTokens=this.tokenBalances?.filter(t=>t.name.toLowerCase().includes(this.search.toLowerCase())):this.filteredTokens=this.tokens,d`
      <wui-flex
        class="contentContainer"
        flexDirection="column"
        .padding=${["0","3","0","3"]}
      >
        <wui-flex justifyContent="flex-start" .padding=${["4","3","3","3"]}>
          <wui-text variant="md-medium" color="secondary">Your tokens</wui-text>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2">
          ${this.filteredTokens&&this.filteredTokens.length>0?this.filteredTokens.map(t=>d`<wui-list-token
                    @click=${this.handleTokenClick.bind(this,t)}
                    ?clickable=${!0}
                    tokenName=${t.name}
                    tokenImageUrl=${t.iconUrl}
                    tokenAmount=${t.quantity.numeric}
                    tokenValue=${t.value}
                    tokenCurrency=${t.symbol}
                  ></wui-list-token>`):d`<wui-flex
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
                  flexDirection="column"
                >
                  <wui-text variant="lg-medium" align="center" color="primary">
                    No tokens found
                  </wui-text>
                  <wui-text variant="lg-regular" align="center" color="secondary">
                    Your tokens will appear here
                  </wui-text>
                </wui-flex>
                <wui-link @click=${this.onBuyClick.bind(this)}>Buy</wui-link>
              </wui-flex>`}
        </wui-flex>
      </wui-flex>
    `}onBuyClick(){k.push("OnRampProviders")}onInputChange(t){this.onDebouncedSearch(t.detail)}handleTokenClick(t){a.setToken(t),a.setTokenAmount(void 0),k.goBack()}};D.styles=de;V([m()],D.prototype,"tokenBalances",void 0);V([m()],D.prototype,"tokens",void 0);V([m()],D.prototype,"filteredTokens",void 0);V([m()],D.prototype,"search",void 0);D=V([v("w3m-wallet-send-select-token-view")],D);l();u();c();l();u();c();l();u();c();l();u();c();var pe=b`
  :host {
    height: 32px;
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e[1]};
    border-radius: ${({borderRadius:e})=>e[32]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e[1]};
    padding-left: ${({spacing:e})=>e[2]};
  }

  wui-avatar,
  wui-image {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  wui-icon {
    border-radius: ${({borderRadius:e})=>e[16]};
  }
`;var q=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},_=class extends x{constructor(){super(...arguments),this.text=""}render(){return d`<wui-text variant="lg-regular" color="primary">${this.text}</wui-text>
      ${this.imageTemplate()}`}imageTemplate(){return this.address?d`<wui-avatar address=${this.address} .imageSrc=${this.imageSrc}></wui-avatar>`:this.imageSrc?d`<wui-image src=${this.imageSrc}></wui-image>`:d`<wui-icon size="lg" color="inverse" name="networkPlaceholder"></wui-icon>`}};_.styles=[H,M,pe];q([g({type:String})],_.prototype,"text",void 0);q([g({type:String})],_.prototype,"address",void 0);q([g({type:String})],_.prototype,"imageSrc",void 0);_=q([v("wui-preview-item")],_);l();u();c();l();u();c();l();u();c();l();u();c();var me=b`
  :host {
    display: flex;
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-image {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }
`;var K=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},B=class extends x{constructor(){super(...arguments),this.imageSrc=void 0,this.textTitle="",this.textValue=void 0}render(){return d`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="primary"> ${this.textTitle} </wui-text>
        ${this.templateContent()}
      </wui-flex>
    `}templateContent(){return this.imageSrc?d`<wui-image src=${this.imageSrc} alt=${this.textTitle}></wui-image>`:this.textValue?d` <wui-text variant="md-regular" color="secondary"> ${this.textValue} </wui-text>`:d`<wui-icon size="inherit" color="default" name="networkPlaceholder"></wui-icon>`}};B.styles=[H,M,me];K([g()],B.prototype,"imageSrc",void 0);K([g()],B.prototype,"textTitle",void 0);K([g()],B.prototype,"textValue",void 0);B=K([v("wui-list-content")],B);l();u();c();var he=b`
  :host {
    display: flex;
    width: auto;
    flex-direction: column;
    gap: ${({spacing:e})=>e[1]};
    border-radius: ${({borderRadius:e})=>e[5]};
    background: ${({tokens:e})=>e.theme.foregroundPrimary};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[2]}
      ${({spacing:e})=>e[2]} ${({spacing:e})=>e[2]};
  }

  wui-list-content {
    width: -webkit-fill-available !important;
  }

  wui-text {
    padding: 0 ${({spacing:e})=>e[2]};
  }

  wui-flex {
    margin-top: ${({spacing:e})=>e[2]};
  }

  .network {
    cursor: pointer;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color;
  }

  .network:focus-visible {
    border: 1px solid ${({tokens:e})=>e.core.textAccentPrimary};
    background-color: ${({tokens:e})=>e.core.glass010};
    -webkit-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent010};
    -moz-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent010};
    box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent010};
  }

  .network:hover {
    background-color: ${({tokens:e})=>e.core.glass010};
  }

  .network:active {
    background-color: ${({tokens:e})=>e.core.glass010};
  }
`;var Y=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},O=class extends x{constructor(){super(...arguments),this.params=k.state.data?.send}render(){return d` <wui-text variant="sm-regular" color="secondary">Details</wui-text>
      <wui-flex flexDirection="column" gap="1">
        <wui-list-content
          textTitle="Address"
          textValue=${N.getTruncateString({string:this.receiverAddress??"",charsStart:4,charsEnd:4,truncate:"middle"})}
        >
        </wui-list-content>
        ${this.networkTemplate()}
      </wui-flex>`}networkTemplate(){return this.caipNetwork?.name?d` <wui-list-content
        @click=${()=>this.onNetworkClick(this.caipNetwork)}
        class="network"
        textTitle="Network"
        imageSrc=${ae(L.getNetworkImage(this.caipNetwork))}
      ></wui-list-content>`:null}onNetworkClick(t){t&&!this.params&&k.push("Networks",{network:t})}};O.styles=he;Y([g()],O.prototype,"receiverAddress",void 0);Y([g({type:Object})],O.prototype,"caipNetwork",void 0);Y([m()],O.prototype,"params",void 0);O=Y([v("w3m-wallet-send-details")],O);l();u();c();var fe=b`
  wui-avatar,
  wui-image {
    display: ruby;
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:e})=>e[20]};
  }

  .sendButton {
    width: 70%;
    --local-width: 100% !important;
    --local-border-radius: ${({borderRadius:e})=>e[4]} !important;
  }

  .cancelButton {
    width: 30%;
    --local-width: 100% !important;
    --local-border-radius: ${({borderRadius:e})=>e[4]} !important;
  }
`;var E=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},A=class extends x{constructor(){super(),this.unsubscribe=[],this.token=a.state.token,this.sendTokenAmount=a.state.sendTokenAmount,this.receiverAddress=a.state.receiverAddress,this.receiverProfileName=a.state.receiverProfileName,this.receiverProfileImageUrl=a.state.receiverProfileImageUrl,this.caipNetwork=y.state.activeCaipNetwork,this.loading=a.state.loading,this.params=k.state.data?.send,this.unsubscribe.push(a.subscribe(t=>{this.token=t.token,this.sendTokenAmount=t.sendTokenAmount,this.receiverAddress=t.receiverAddress,this.receiverProfileName=t.receiverProfileName,this.receiverProfileImageUrl=t.receiverProfileImageUrl,this.loading=t.loading}),y.subscribeKey("activeCaipNetwork",t=>this.caipNetwork=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return d` <wui-flex flexDirection="column" .padding=${["0","4","4","4"]}>
      <wui-flex gap="2" flexDirection="column" .padding=${["0","2","0","2"]}>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-flex flexDirection="column" gap="01">
            <wui-text variant="sm-regular" color="secondary">Send</wui-text>
            ${this.sendValueTemplate()}
          </wui-flex>
          <wui-preview-item
            text="${this.sendTokenAmount?N.roundNumber(this.sendTokenAmount,6,5):"unknown"} ${this.token?.symbol}"
            .imageSrc=${this.token?.iconUrl}
          ></wui-preview-item>
        </wui-flex>
        <wui-flex>
          <wui-icon color="default" size="md" name="arrowBottom"></wui-icon>
        </wui-flex>
        <wui-flex alignItems="center" justifyContent="space-between">
          <wui-text variant="sm-regular" color="secondary">To</wui-text>
          <wui-preview-item
            text="${this.receiverProfileName?N.getTruncateString({string:this.receiverProfileName,charsStart:20,charsEnd:0,truncate:"end"}):N.getTruncateString({string:this.receiverAddress?this.receiverAddress:"",charsStart:4,charsEnd:4,truncate:"middle"})}"
            address=${this.receiverAddress??""}
            .imageSrc=${this.receiverProfileImageUrl??void 0}
            .isAddress=${!0}
          ></wui-preview-item>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" .padding=${["6","0","0","0"]}>
        <w3m-wallet-send-details
          .caipNetwork=${this.caipNetwork}
          .receiverAddress=${this.receiverAddress}
        ></w3m-wallet-send-details>
        <wui-flex justifyContent="center" gap="1" .padding=${["3","0","0","0"]}>
          <wui-icon size="sm" color="default" name="warningCircle"></wui-icon>
          <wui-text variant="sm-regular" color="secondary">Review transaction carefully</wui-text>
        </wui-flex>
        <wui-flex justifyContent="center" gap="3" .padding=${["4","0","0","0"]}>
          <wui-button
            class="cancelButton"
            @click=${this.onCancelClick.bind(this)}
            size="lg"
            variant="neutral-secondary"
          >
            Cancel
          </wui-button>
          <wui-button
            class="sendButton"
            @click=${this.onSendClick.bind(this)}
            size="lg"
            variant="accent-primary"
            .loading=${this.loading}
          >
            Send
          </wui-button>
        </wui-flex>
      </wui-flex></wui-flex
    >`}sendValueTemplate(){if(!this.params&&this.token&&this.sendTokenAmount){let r=this.token.price*this.sendTokenAmount;return d`<wui-text variant="md-regular" color="primary"
        >$${r.toFixed(2)}</wui-text
      >`}return null}async onSendClick(){if(!this.sendTokenAmount||!this.receiverAddress){S.showError("Please enter a valid amount and receiver address");return}try{await a.sendToken(),this.params?k.reset("WalletSendConfirmed"):(S.showSuccess("Transaction started"),k.replace("Account"))}catch(t){let r="Failed to send transaction. Please try again.",o=t instanceof oe&&t.originalName===ie.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST;(y.state.activeChain===te.CHAIN.SOLANA||o)&&t instanceof Error&&(r=t.message),ne.sendEvent({type:"track",event:o?"SEND_REJECTED":"SEND_ERROR",properties:a.getSdkEventProperties(t)}),S.showError(r)}}onCancelClick(){k.goBack()}};A.styles=fe;E([m()],A.prototype,"token",void 0);E([m()],A.prototype,"sendTokenAmount",void 0);E([m()],A.prototype,"receiverAddress",void 0);E([m()],A.prototype,"receiverProfileName",void 0);E([m()],A.prototype,"receiverProfileImageUrl",void 0);E([m()],A.prototype,"caipNetwork",void 0);E([m()],A.prototype,"loading",void 0);E([m()],A.prototype,"params",void 0);A=E([v("w3m-wallet-send-preview-view")],A);l();u();c();l();u();c();var we=b`
  .icon-box {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    background-color: ${({spacing:e})=>e[16]};
    border: 8px solid ${({tokens:e})=>e.theme.borderPrimary};
    border-radius: ${({borderRadius:e})=>e.round};
  }
`;var ge=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Z=class extends x{constructor(){super(),this.unsubscribe=[],this.unsubscribe.push()}render(){return d`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding="${["1","3","4","3"]}"
      >
        <wui-flex justifyContent="center" alignItems="center" class="icon-box">
          <wui-icon size="xxl" color="success" name="checkmark"></wui-icon>
        </wui-flex>

        <wui-text variant="h6-medium" color="primary">You successfully sent asset</wui-text>

        <wui-button
          fullWidth
          @click=${this.onCloseClick.bind(this)}
          size="lg"
          variant="neutral-secondary"
        >
          Close
        </wui-button>
      </wui-flex>
    `}onCloseClick(){F.close()}};Z.styles=we;Z=ge([v("w3m-send-confirmed-view")],Z);export{Z as W3mSendConfirmedView,D as W3mSendSelectTokenView,A as W3mWalletSendPreviewView,$ as W3mWalletSendView};
