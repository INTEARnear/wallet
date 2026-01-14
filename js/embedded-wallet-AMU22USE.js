import"./chunk-FLWML4UJ.js";import"./chunk-HNYQOGKW.js";import"./chunk-SB4FWY32.js";import"./chunk-HANOCJWG.js";import"./chunk-DW5UEWXF.js";import"./chunk-3IF2M6VT.js";import"./chunk-7FUATHPM.js";import"./chunk-YYMQ6HDD.js";import"./chunk-FB5BNV7C.js";import"./chunk-LW4FQU5S.js";import"./chunk-5BCUXIZJ.js";import"./chunk-BR7S6AGZ.js";import{c as G,h as f}from"./chunk-LTN6YROF.js";import{B as A,D as V,E as U,F,G as N,I as B,M as $,N as W,P as D,T as x,f as T,j as H,l as L,p as O,r as R,x as _}from"./chunk-N2WXLAZF.js";import"./chunk-X4QP7L3N.js";import{a as z,b as k}from"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import{a as P}from"./chunk-B2LU4KHT.js";import{a as S,b}from"./chunk-IDZGCU4F.js";import{b as v,e as u,k as p}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as a,k as l,o as m}from"./chunk-JY5TIRRF.js";a();m();l();a();m();l();a();m();l();var Y=v`
  div {
    width: 100%;
  }

  [data-ready='false'] {
    transform: scale(1.05);
  }

  @media (max-width: 430px) {
    [data-ready='false'] {
      transform: translateY(-50px);
    }
  }
`;var q=function(n,e,i,r){var o=arguments.length,t=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,i,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(t=(o<3?s(t):o>3?s(e,i,t):s(e,i))||t);return o>3&&t&&Object.defineProperty(e,i,t),t},j=600,K=360,ee=64,I=class extends p{constructor(){super(),this.bodyObserver=void 0,this.unsubscribe=[],this.iframe=document.getElementById("w3m-iframe"),this.ready=!1,this.unsubscribe.push(D.subscribeKey("open",e=>{e||this.onHideIframe()}),D.subscribeKey("shake",e=>{e?this.iframe.style.animation="w3m-shake 500ms var(--wui-ease-out-power-2)":this.iframe.style.animation="none"}))}disconnectedCallback(){this.onHideIframe(),this.unsubscribe.forEach(e=>e()),this.bodyObserver?.unobserve(window.document.body)}async firstUpdated(){await this.syncTheme(),this.iframe.style.display="block";let e=this?.renderRoot?.querySelector("div");this.bodyObserver=new ResizeObserver(i=>{let o=i?.[0]?.contentBoxSize?.[0]?.inlineSize;this.iframe.style.height=`${j}px`,e.style.height=`${j}px`,o&&o<=430?(this.iframe.style.width="100%",this.iframe.style.left="0px",this.iframe.style.bottom="0px",this.iframe.style.top="unset"):(this.iframe.style.width=`${K}px`,this.iframe.style.left=`calc(50% - ${K/2}px)`,this.iframe.style.top=`calc(50% - ${j/2}px + ${ee/2}px)`,this.iframe.style.bottom="unset"),this.ready=!0,this.onShowIframe()}),this.bodyObserver.observe(window.document.body)}render(){return u`<div data-ready=${this.ready} id="w3m-frame-container"></div>`}onShowIframe(){let e=window.innerWidth<=430;this.iframe.style.animation=e?"w3m-iframe-zoom-in-mobile 200ms var(--wui-ease-out-power-2)":"w3m-iframe-zoom-in 200ms var(--wui-ease-out-power-2)"}onHideIframe(){this.iframe.style.display="none",this.iframe.style.animation="w3m-iframe-fade-out 200ms var(--wui-ease-out-power-2)"}async syncTheme(){let e=F.getAuthConnector();if(e){let i=U.getSnapshot().themeMode,r=U.getSnapshot().themeVariables;await e.provider.syncTheme({themeVariables:r,w3mThemeVariables:L(r,i)})}}};I.styles=Y;q([b()],I.prototype,"ready",void 0);I=q([f("w3m-approve-transaction-view")],I);a();m();l();var te=function(n,e,i,r){var o=arguments.length,t=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,i,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(t=(o<3?s(t):o>3?s(e,i,t):s(e,i))||t);return o>3&&t&&Object.defineProperty(e,i,t),t},X=class extends p{render(){return u`
      <wui-flex flexDirection="column" alignItems="center" gap="xl" padding="xl">
        <wui-text variant="paragraph-400" color="fg-100">Follow the instructions on</wui-text>
        <wui-chip
          icon="externalLink"
          variant="fill"
          href=${O.SECURE_SITE_DASHBOARD}
          imageSrc=${O.SECURE_SITE_FAVICON}
          data-testid="w3m-secure-website-button"
        >
        </wui-chip>
        <wui-text variant="small-400" color="fg-200">
          You will have to reconnect for security reasons
        </wui-text>
      </wui-flex>
    `}};X=te([f("w3m-upgrade-wallet-view")],X);a();m();l();a();m();l();a();m();l();a();m();l();var Q=v`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  .error {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }

  .base-name {
    position: absolute;
    right: 45px;
    top: 15px;
    text-align: right;
  }
`;var C=function(n,e,i,r){var o=arguments.length,t=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,i,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(t=(o<3?s(t):o>3?s(e,i,t):s(e,i))||t);return o>3&&t&&Object.defineProperty(e,i,t),t},E=class extends p{constructor(){super(...arguments),this.disabled=!1,this.loading=!1}render(){return u`
      <wui-input-text
        value=${P(this.value)}
        ?disabled=${this.disabled}
        .value=${this.value||""}
        data-testid="wui-ens-input"
        inputRightPadding="5xl"
      >
        ${this.baseNameTemplate()} ${this.errorTemplate()}${this.loadingTemplate()}
      </wui-input-text>
    `}baseNameTemplate(){return u`<wui-text variant="paragraph-400" color="fg-200" class="base-name">
      ${T.WC_NAME_SUFFIX}
    </wui-text>`}loadingTemplate(){return this.loading?u`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:null}errorTemplate(){return this.errorMessage?u`<wui-text variant="tiny-500" color="error-100" class="error"
        >${this.errorMessage}</wui-text
      >`:null}};E.styles=[G,Q];C([S()],E.prototype,"errorMessage",void 0);C([S({type:Boolean})],E.prototype,"disabled",void 0);C([S()],E.prototype,"value",void 0);C([S({type:Boolean})],E.prototype,"loading",void 0);E=C([f("wui-ens-input")],E);a();m();l();var J=v`
  wui-flex {
    width: 100%;
  }

  .suggestion {
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }

  .suggestion:hover {
    background-color: var(--wui-color-gray-glass-005);
    cursor: pointer;
  }

  .suggested-name {
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  form {
    width: 100%;
  }

  wui-icon-link {
    position: absolute;
    right: 20px;
    transform: translateY(11px);
  }
`;var y=function(n,e,i,r){var o=arguments.length,t=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,i,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(t=(o<3?s(t):o>3?s(e,i,t):s(e,i))||t);return o>3&&t&&Object.defineProperty(e,i,t),t},w=class extends p{constructor(){super(),this.formRef=z(),this.usubscribe=[],this.name="",this.error="",this.loading=x.state.loading,this.suggestions=x.state.suggestions,this.registered=!1,this.profileName=W.state.profileName,this.onDebouncedNameInputChange=R.debounce(e=>{x.validateName(e)?(this.error="",this.name=e,x.getSuggestions(e),x.isNameRegistered(e).then(i=>{this.registered=i})):e.length<4?this.error="Name must be at least 4 characters long":this.error="Can only contain letters, numbers and - characters"}),this.usubscribe.push(x.subscribe(e=>{this.suggestions=e.suggestions,this.loading=e.loading}),W.subscribeKey("profileName",e=>{this.profileName=e,e&&(this.error="You already own a name")}))}firstUpdated(){this.formRef.value?.addEventListener("keydown",this.onEnterKey.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.usubscribe.forEach(e=>e()),this.formRef.value?.removeEventListener("keydown",this.onEnterKey.bind(this))}render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="m"
        .padding=${["0","s","m","s"]}
      >
        <form ${k(this.formRef)} @submit=${this.onSubmitName.bind(this)}>
          <wui-ens-input
            @inputChange=${this.onNameInputChange.bind(this)}
            .errorMessage=${this.error}
            .value=${this.name}
          >
          </wui-ens-input>
          ${this.submitButtonTemplate()}
          <input type="submit" hidden />
        </form>
        ${this.templateSuggestions()}
      </wui-flex>
    `}submitButtonTemplate(){return this.isAllowedToSubmit()?u`
          <wui-icon-link
            size="sm"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitName.bind(this)}
          >
          </wui-icon-link>
        `:null}onSelectSuggestion(e){return()=>{this.name=e,this.registered=!1,this.requestUpdate()}}onNameInputChange(e){this.onDebouncedNameInputChange(e.detail)}nameSuggestionTagTemplate(){return this.loading?u`<wui-loading-spinner size="lg" color="fg-100"></wui-loading-spinner>`:this.registered?u`<wui-tag variant="shade" size="lg">Registered</wui-tag>`:u`<wui-tag variant="success" size="lg">Available</wui-tag>`}templateSuggestions(){if(!this.name||this.name.length<4||this.error)return null;let e=this.registered?this.suggestions.filter(i=>i.name!==this.name):[];return u`<wui-flex flexDirection="column" gap="xxs" alignItems="center">
      <wui-flex
        data-testid="account-name-suggestion"
        .padding=${["m","m","m","m"]}
        justifyContent="space-between"
        class="suggestion"
        @click=${this.onSubmitName.bind(this)}
      >
        <wui-text color="fg-100" variant="paragraph-400" class="suggested-name">
          ${this.name}</wui-text
        >${this.nameSuggestionTagTemplate()}
      </wui-flex>
      ${e.map(i=>this.availableNameTemplate(i.name))}
    </wui-flex>`}availableNameTemplate(e){return u` <wui-flex
      data-testid="account-name-suggestion"
      .padding=${["m","m","m","m"]}
      justifyContent="space-between"
      class="suggestion"
      @click=${this.onSelectSuggestion(e)}
    >
      <wui-text color="fg-100" variant="paragraph-400" class="suggested-name">
        ${e}
      </wui-text>
      <wui-tag variant="success" size="lg">Available</wui-tag>
    </wui-flex>`}isAllowedToSubmit(){return!this.loading&&!this.registered&&!this.error&&!this.profileName&&x.validateName(this.name)}async onSubmitName(){try{if(!this.isAllowedToSubmit())return;let e=`${this.name}${T.WC_NAME_SUFFIX}`;A.sendEvent({type:"track",event:"REGISTER_NAME_INITIATED",properties:{isSmartAccount:N($.state.activeChain)===_.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}}),await x.registerName(e),A.sendEvent({type:"track",event:"REGISTER_NAME_SUCCESS",properties:{isSmartAccount:N($.state.activeChain)===_.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:e}})}catch(e){B.showError(e.message),A.sendEvent({type:"track",event:"REGISTER_NAME_ERROR",properties:{isSmartAccount:N($.state.activeChain)===_.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:`${this.name}${T.WC_NAME_SUFFIX}`,error:e?.message||"Unknown error"}})}}onEnterKey(e){e.key==="Enter"&&this.isAllowedToSubmit()&&this.onSubmitName()}};w.styles=J;y([S()],w.prototype,"errorMessage",void 0);y([b()],w.prototype,"name",void 0);y([b()],w.prototype,"error",void 0);y([b()],w.prototype,"loading",void 0);y([b()],w.prototype,"suggestions",void 0);y([b()],w.prototype,"registered",void 0);y([b()],w.prototype,"profileName",void 0);w=y([f("w3m-register-account-name-view")],w);a();m();l();a();m();l();var Z=v`
  .continue-button-container {
    width: 100%;
  }
`;var ie=function(n,e,i,r){var o=arguments.length,t=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,i,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(t=(o<3?s(t):o>3?s(e,i,t):s(e,i))||t);return o>3&&t&&Object.defineProperty(e,i,t),t},M=class extends p{render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="xxl"
        .padding=${["0","0","l","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{R.openHref(H.URLS.FAQ,"_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return u` <wui-flex
      flexDirection="column"
      gap="xxl"
      alignItems="center"
      .padding=${["0","xxl","0","xxl"]}
    >
      <wui-flex gap="s" alignItems="center" justifyContent="center">
        <wui-icon-box
          size="xl"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="s">
        <wui-text align="center" variant="medium-600" color="fg-100">
          Account name chosen successfully
        </wui-text>
        <wui-text align="center" variant="paragraph-400" color="fg-100">
          You can now fund your account and trade crypto
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return u`<wui-flex
      .padding=${["0","2l","0","2l"]}
      gap="s"
      class="continue-button-container"
    >
      <wui-button fullWidth size="lg" borderRadius="xs" @click=${this.redirectToAccount.bind(this)}
        >Let's Go!
      </wui-button>
    </wui-flex>`}redirectToAccount(){V.replace("Account")}};M.styles=Z;M=ie([f("w3m-register-account-name-success-view")],M);export{I as W3mApproveTransactionView,M as W3mRegisterAccountNameSuccess,w as W3mRegisterAccountNameView,X as W3mUpgradeWalletView};
