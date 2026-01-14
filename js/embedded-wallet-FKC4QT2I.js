import{a as B}from"./chunk-PPLSOLUM.js";import"./chunk-MKQASGGU.js";import"./chunk-YCKXBVJA.js";import"./chunk-ZYZOIEZB.js";import"./chunk-NHUA5J6J.js";import"./chunk-RBOFKV5S.js";import"./chunk-RL7GPJDA.js";import{a as re,b as ie}from"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-MNAGPPOX.js";import"./chunk-EJ5H5H5L.js";import"./chunk-IPTO6NMX.js";import"./chunk-BI3DTO7P.js";import"./chunk-RLPEU2I3.js";import{a as oe}from"./chunk-B2LU4KHT.js";import{c as E,r as S,v as O,w as M,z as w}from"./chunk-RZQOM5QR.js";import"./chunk-HQPTEMSB.js";import{a as p,b}from"./chunk-IDZGCU4F.js";import{b as V,e as u,k as g}from"./chunk-ZS2R6O6N.js";import"./chunk-SQN7L5MN.js";import"./chunk-7GZ7JYLK.js";import"./chunk-6HADIPAO.js";import"./chunk-2T4BE52W.js";import"./chunk-XQOHLC2A.js";import{B as U,C as y,D as Y,H as Q,I as Z,O as j,S as J,T as F,U as N,X as A,aa as ee,fa as te,ga as x,ia as L,j as k,o as q,w as X,z as W}from"./chunk-OXOEMY67.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as a,k as c,o as l}from"./chunk-JY5TIRRF.js";a();l();c();a();l();c();a();l();c();var ne=V`
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
`;var ae=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var m=e.length-1;m>=0;m--)(s=e[m])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},K=600,se=360,he=64,H=class extends g{constructor(){super(),this.bodyObserver=void 0,this.unsubscribe=[],this.iframe=document.getElementById("w3m-iframe"),this.ready=!1,this.unsubscribe.push(L.subscribeKey("open",t=>{t||this.onHideIframe()}),L.subscribeKey("shake",t=>{t?this.iframe.style.animation="w3m-shake 500ms var(--apkt-easings-ease-out-power-2)":this.iframe.style.animation="none"}))}disconnectedCallback(){this.onHideIframe(),this.unsubscribe.forEach(t=>t()),this.bodyObserver?.unobserve(window.document.body)}async firstUpdated(){await this.syncTheme(),this.iframe.style.display="block";let t=this?.renderRoot?.querySelector("div");this.bodyObserver=new ResizeObserver(o=>{let n=o?.[0]?.contentBoxSize?.[0]?.inlineSize;this.iframe.style.height=`${K}px`,t.style.height=`${K}px`,Q.state.enableEmbedded?this.updateFrameSizeForEmbeddedMode():n&&n<=430?(this.iframe.style.width="100%",this.iframe.style.left="0px",this.iframe.style.bottom="0px",this.iframe.style.top="unset",this.onShowIframe()):(this.iframe.style.width=`${se}px`,this.iframe.style.left=`calc(50% - ${se/2}px)`,this.iframe.style.top=`calc(50% - ${K/2}px + ${he/2}px)`,this.iframe.style.bottom="unset",this.onShowIframe())}),this.bodyObserver.observe(window.document.body)}render(){return u`<div data-ready=${this.ready} id="w3m-frame-container"></div>`}onShowIframe(){let t=window.innerWidth<=430;this.ready=!0,this.iframe.style.animation=t?"w3m-iframe-zoom-in-mobile 200ms var(--apkt-easings-ease-out-power-2)":"w3m-iframe-zoom-in 200ms var(--apkt-easings-ease-out-power-2)"}onHideIframe(){this.iframe.style.display="none",this.iframe.style.animation="w3m-iframe-fade-out 200ms var(--apkt-easings-ease-out-power-2)"}async syncTheme(){let t=N.getAuthConnector();if(t){let o=F.getSnapshot().themeMode,i=F.getSnapshot().themeVariables;await t.provider.syncTheme({themeVariables:i,w3mThemeVariables:X(i,o)})}}async updateFrameSizeForEmbeddedMode(){let t=this?.renderRoot?.querySelector("div");await new Promise(i=>{setTimeout(i,300)});let o=this.getBoundingClientRect();t.style.width="100%",this.iframe.style.left=`${o.left}px`,this.iframe.style.top=`${o.top}px`,this.iframe.style.width=`${o.width}px`,this.iframe.style.height=`${o.height}px`,this.onShowIframe()}};H.styles=ne;ae([b()],H.prototype,"ready",void 0);H=ae([w("w3m-approve-transaction-view")],H);a();l();c();a();l();c();a();l();c();a();l();c();var ce=S`
  a {
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
        ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, box-shadow, border;
  }

  /* -- Variants --------------------------------------------------------------- */
  a[data-type='success'] {
    background-color: ${({tokens:e})=>e.core.backgroundSuccess};
    color: ${({tokens:e})=>e.core.textSuccess};
  }

  a[data-type='error'] {
    background-color: ${({tokens:e})=>e.core.backgroundError};
    color: ${({tokens:e})=>e.core.textError};
  }

  a[data-type='warning'] {
    background-color: ${({tokens:e})=>e.core.backgroundWarning};
    color: ${({tokens:e})=>e.core.textWarning};
  }

  /* -- Sizes --------------------------------------------------------------- */
  a[data-size='sm'] {
    height: 24px;
  }

  a[data-size='md'] {
    height: 28px;
  }

  a[data-size='lg'] {
    height: 32px;
  }

  a[data-size='sm'] > wui-image,
  a[data-size='sm'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  a[data-size='md'] > wui-image,
  a[data-size='md'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  a[data-size='lg'] > wui-image,
  a[data-size='lg'] > wui-icon {
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
    a[data-type='success']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
      box-shadow: 0px 0px 0px 1px ${({tokens:e})=>e.core.borderSuccess};
    }

    a[data-type='error']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
      box-shadow: 0px 0px 0px 1px ${({tokens:e})=>e.core.borderError};
    }

    a[data-type='warning']:not(:disabled):hover {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
      box-shadow: 0px 0px 0px 1px ${({tokens:e})=>e.core.borderWarning};
    }
  }

  a[data-type='success']:not(:disabled):focus-visible {
    box-shadow:
      0px 0px 0px 1px ${({tokens:e})=>e.core.backgroundAccentPrimary},
      0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  a[data-type='error']:not(:disabled):focus-visible {
    box-shadow:
      0px 0px 0px 1px ${({tokens:e})=>e.core.backgroundAccentPrimary},
      0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  a[data-type='warning']:not(:disabled):focus-visible {
    box-shadow:
      0px 0px 0px 1px ${({tokens:e})=>e.core.backgroundAccentPrimary},
      0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent020};
  }

  a:disabled {
    opacity: 0.5;
  }
`;var T=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var m=e.length-1;m>=0;m--)(s=e[m])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},fe={sm:"md-regular",md:"lg-regular",lg:"lg-regular"},ge={success:"sealCheck",error:"warning",warning:"exclamationCircle"},v=class extends g{constructor(){super(...arguments),this.type="success",this.size="md",this.imageSrc=void 0,this.disabled=!1,this.href="",this.text=void 0}render(){return u`
      <a
        rel="noreferrer"
        target="_blank"
        href=${this.href}
        class=${this.disabled?"disabled":""}
        data-type=${this.type}
        data-size=${this.size}
      >
        ${this.imageTemplate()}
        <wui-text variant=${fe[this.size]} color="inherit">${this.text}</wui-text>
      </a>
    `}imageTemplate(){return this.imageSrc?u`<wui-image src=${this.imageSrc} size="inherit"></wui-image>`:u`<wui-icon
      name=${ge[this.type]}
      weight="fill"
      color="inherit"
      size="inherit"
      class="image-icon"
    ></wui-icon>`}};v.styles=[O,M,ce];T([p()],v.prototype,"type",void 0);T([p()],v.prototype,"size",void 0);T([p()],v.prototype,"imageSrc",void 0);T([p({type:Boolean})],v.prototype,"disabled",void 0);T([p()],v.prototype,"href",void 0);T([p()],v.prototype,"text",void 0);v=T([w("wui-semantic-chip")],v);var we=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var m=e.length-1;m>=0;m--)(s=e[m])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},le=class extends g{render(){return u`
      <wui-flex flexDirection="column" alignItems="center" gap="5" padding="5">
        <wui-text variant="md-regular" color="primary">Follow the instructions on</wui-text>
        <wui-semantic-chip
          icon="externalLink"
          variant="fill"
          text=${W.SECURE_SITE_DASHBOARD}
          href=${W.SECURE_SITE_DASHBOARD}
          imageSrc=${W.SECURE_SITE_FAVICON}
          data-testid="w3m-secure-website-button"
        >
        </wui-semantic-chip>
        <wui-text variant="sm-regular" color="secondary">
          You will have to reconnect for security reasons
        </wui-text>
      </wui-flex>
    `}};le=we([w("w3m-upgrade-wallet-view")],le);a();l();c();var z=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var m=e.length-1;m>=0;m--)(s=e[m])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},I=class extends g{constructor(){super(...arguments),this.loading=!1,this.switched=!1,this.text="",this.network=x.state.activeCaipNetwork}render(){return u`
      <wui-flex flexDirection="column" gap="2" .padding=${["6","4","3","4"]}>
        ${this.togglePreferredAccountTypeTemplate()} ${this.toggleSmartAccountVersionTemplate()}
      </wui-flex>
    `}toggleSmartAccountVersionTemplate(){return u`
      <w3m-tooltip-trigger text="Changing the smart account version will reload the page">
        <wui-list-item
          icon=${this.isV6()?"arrowTop":"arrowBottom"}
          ?rounded=${!0}
          ?chevron=${!0}
          data-testid="account-toggle-smart-account-version"
          @click=${this.toggleSmartAccountVersion.bind(this)}
        >
          <wui-text variant="lg-regular" color="primary"
            >Force Smart Account Version ${this.isV6()?"7":"6"}</wui-text
          >
        </wui-list-item>
      </w3m-tooltip-trigger>
    `}isV6(){return(Y.get("dapp_smart_account_version")||"v6")==="v6"}toggleSmartAccountVersion(){Y.set("dapp_smart_account_version",this.isV6()?"v7":"v6"),typeof window<"u"&&window?.location?.reload()}togglePreferredAccountTypeTemplate(){let t=this.network?.chainNamespace,o=x.checkIfSmartAccountEnabled(),i=N.getConnectorId(t);return!N.getAuthConnector()||i!==k.CONNECTOR_ID.AUTH||!o?null:(this.switched||(this.text=A(t)===y.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account"),u`
      <wui-list-item
        icon="swapHorizontal"
        ?rounded=${!0}
        ?chevron=${!0}
        ?loading=${this.loading}
        @click=${this.changePreferredAccountType.bind(this)}
        data-testid="account-toggle-preferred-account-type"
      >
        <wui-text variant="lg-regular" color="primary">${this.text}</wui-text>
      </wui-list-item>
    `)}async changePreferredAccountType(){let t=this.network?.chainNamespace,o=x.checkIfSmartAccountEnabled(),i=A(t)===y.ACCOUNT_TYPES.SMART_ACCOUNT||!o?y.ACCOUNT_TYPES.EOA:y.ACCOUNT_TYPES.SMART_ACCOUNT;N.getAuthConnector()&&(this.loading=!0,await ee.setPreferredAccountType(i,t),this.text=i===y.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account",this.switched=!0,te.resetSend(),this.loading=!1,this.requestUpdate())}};z([b()],I.prototype,"loading",void 0);z([b()],I.prototype,"switched",void 0);z([b()],I.prototype,"text",void 0);z([b()],I.prototype,"network",void 0);I=z([w("w3m-smart-account-settings-view")],I);a();l();c();a();l();c();a();l();c();a();l();c();var me=S`
  :host {
    width: 100%;
  }

  button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    padding: ${({spacing:e})=>e[4]};
  }

  .name {
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      cursor: pointer;
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
      border-radius: ${({borderRadius:e})=>e[6]};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: default;
  }

  button:focus-visible:enabled {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }
`;var D=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var m=e.length-1;m>=0;m--)(s=e[m])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},_=class extends g{constructor(){super(...arguments),this.name="",this.registered=!1,this.loading=!1,this.disabled=!1}render(){return u`
      <button ?disabled=${this.disabled}>
        <wui-text class="name" color="primary" variant="md-regular">${this.name}</wui-text>
        ${this.templateRightContent()}
      </button>
    `}templateRightContent(){return this.loading?u`<wui-loading-spinner size="lg" color="primary"></wui-loading-spinner>`:this.registered?u`<wui-tag variant="info" size="sm">Registered</wui-tag>`:u`<wui-tag variant="success" size="sm">Available</wui-tag>`}};_.styles=[O,M,me];D([p()],_.prototype,"name",void 0);D([p({type:Boolean})],_.prototype,"registered",void 0);D([p({type:Boolean})],_.prototype,"loading",void 0);D([p({type:Boolean})],_.prototype,"disabled",void 0);_=D([w("wui-account-name-suggestion-item")],_);a();l();c();a();l();c();a();l();c();var ue=S`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
  }

  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .base-name {
    position: absolute;
    right: ${({spacing:e})=>e[4]};
    top: 50%;
    transform: translateY(-50%);
    text-align: right;
    padding: ${({spacing:e})=>e[1]};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[1]};
  }
`;var P=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var m=e.length-1;m>=0;m--)(s=e[m])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},C=class extends g{constructor(){super(...arguments),this.disabled=!1,this.loading=!1}render(){return u`
      <wui-input-text
        value=${oe(this.value)}
        ?disabled=${this.disabled}
        .value=${this.value||""}
        data-testid="wui-ens-input"
        icon="search"
        inputRightPadding="5xl"
        .onKeyDown=${this.onKeyDown}
      ></wui-input-text>
    `}};C.styles=[O,ue];P([p()],C.prototype,"errorMessage",void 0);P([p({type:Boolean})],C.prototype,"disabled",void 0);P([p()],C.prototype,"value",void 0);P([p({type:Boolean})],C.prototype,"loading",void 0);P([p({attribute:!1})],C.prototype,"onKeyDown",void 0);C=P([w("wui-ens-input")],C);a();l();c();var pe=S`
  wui-flex {
    width: 100%;
  }

  .suggestion {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  .suggestion:hover:not(:disabled) {
    cursor: pointer;
    border: none;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[6]};
    padding: ${({spacing:e})=>e[4]};
  }

  .suggestion:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .suggestion:focus-visible:not(:disabled) {
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  .suggested-name {
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  form {
    width: 100%;
    position: relative;
  }

  .input-submit-button,
  .input-loading-spinner {
    position: absolute;
    top: 22px;
    transform: translateY(-50%);
    right: 10px;
  }
`;var R=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var m=e.length-1;m>=0;m--)(s=e[m])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},$=class extends g{constructor(){super(),this.formRef=re(),this.usubscribe=[],this.name="",this.error="",this.loading=E.state.loading,this.suggestions=E.state.suggestions,this.profileName=x.getAccountData()?.profileName,this.onDebouncedNameInputChange=U.debounce(t=>{t.length<4?this.error="Name must be at least 4 characters long":B.isValidReownName(t)?(this.error="",E.getSuggestions(t)):this.error="The value is not a valid username"}),this.usubscribe.push(E.subscribe(t=>{this.suggestions=t.suggestions,this.loading=t.loading}),x.subscribeChainProp("accountState",t=>{this.profileName=t?.profileName,t?.profileName&&(this.error="You already own a name")}))}firstUpdated(){this.formRef.value?.addEventListener("keydown",this.onEnterKey.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.usubscribe.forEach(t=>t()),this.formRef.value?.removeEventListener("keydown",this.onEnterKey.bind(this))}render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding=${["1","3","4","3"]}
      >
        <form ${ie(this.formRef)} @submit=${this.onSubmitName.bind(this)}>
          <wui-ens-input
            @inputChange=${this.onNameInputChange.bind(this)}
            .errorMessage=${this.error}
            .value=${this.name}
            .onKeyDown=${this.onKeyDown.bind(this)}
          >
          </wui-ens-input>
          ${this.submitButtonTemplate()}
          <input type="submit" hidden />
        </form>
        ${this.templateSuggestions()}
      </wui-flex>
    `}submitButtonTemplate(){let t=this.suggestions.find(i=>i.name?.split(".")?.[0]===this.name&&i.registered);if(this.loading)return u`<wui-loading-spinner
        class="input-loading-spinner"
        color="secondary"
      ></wui-loading-spinner>`;let o=`${this.name}${k.WC_NAME_SUFFIX}`;return u`
      <wui-icon-link
        ?disabled=${!!t}
        class="input-submit-button"
        size="sm"
        icon="chevronRight"
        iconColor=${t?"default":"accent-primary"}
        @click=${()=>this.onSubmitName(o)}
      >
      </wui-icon-link>
    `}onNameInputChange(t){let o=B.validateReownName(t.detail||"");this.name=o,this.onDebouncedNameInputChange(o)}onKeyDown(t){t.key.length===1&&!B.isValidReownName(t.key)&&t.preventDefault()}templateSuggestions(){return!this.name||this.name.length<4||this.error?null:u`<wui-flex flexDirection="column" gap="1" alignItems="center">
      ${this.suggestions.map(t=>u`<wui-account-name-suggestion-item
            name=${t.name}
            ?registered=${t.registered}
            ?loading=${this.loading}
            ?disabled=${t.registered||this.loading}
            data-testid="account-name-suggestion"
            @click=${()=>this.onSubmitName(t.name)}
          ></wui-account-name-suggestion-item>`)}
    </wui-flex>`}isAllowedToSubmit(t){let o=t.split(".")?.[0],i=this.suggestions.find(n=>n.name?.split(".")?.[0]===o&&n.registered);return!this.loading&&!this.error&&!this.profileName&&o&&E.validateName(o)&&!i}async onSubmitName(t){try{if(!this.isAllowedToSubmit(t))return;j.sendEvent({type:"track",event:"REGISTER_NAME_INITIATED",properties:{isSmartAccount:A(x.state.activeChain)===y.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:t}}),await E.registerName(t),j.sendEvent({type:"track",event:"REGISTER_NAME_SUCCESS",properties:{isSmartAccount:A(x.state.activeChain)===y.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:t}})}catch(o){Z.showError(o.message),j.sendEvent({type:"track",event:"REGISTER_NAME_ERROR",properties:{isSmartAccount:A(x.state.activeChain)===y.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:t,error:U.parseError(o)}})}}onEnterKey(t){if(t.key==="Enter"&&this.name&&this.isAllowedToSubmit(this.name)){let o=`${this.name}${k.WC_NAME_SUFFIX}`;this.onSubmitName(o)}}};$.styles=pe;R([p()],$.prototype,"errorMessage",void 0);R([b()],$.prototype,"name",void 0);R([b()],$.prototype,"error",void 0);R([b()],$.prototype,"loading",void 0);R([b()],$.prototype,"suggestions",void 0);R([b()],$.prototype,"profileName",void 0);$=R([w("w3m-register-account-name-view")],$);a();l();c();a();l();c();var de=V`
  .continue-button-container {
    width: 100%;
  }
`;var be=function(e,t,o,i){var n=arguments.length,r=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,o):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,o,i);else for(var m=e.length-1;m>=0;m--)(s=e[m])&&(r=(n<3?s(r):n>3?s(t,o,r):s(t,o))||r);return n>3&&r&&Object.defineProperty(t,o,r),r},G=class extends g{render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="6"
        .padding=${["0","0","4","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{U.openHref(q.URLS.FAQ,"_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return u` <wui-flex
      flexDirection="column"
      gap="6"
      alignItems="center"
      .padding=${["0","6","0","6"]}
    >
      <wui-flex gap="3" alignItems="center" justifyContent="center">
        <wui-icon-box size="xl" color="success" icon="checkmark"></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="3">
        <wui-text align="center" variant="md-medium" color="primary">
          Account name chosen successfully
        </wui-text>
        <wui-text align="center" variant="md-regular" color="primary">
          You can now fund your account and trade crypto
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return u`<wui-flex
      .padding=${["0","4","0","4"]}
      gap="3"
      class="continue-button-container"
    >
      <wui-button fullWidth size="lg" borderRadius="xs" @click=${this.redirectToAccount.bind(this)}
        >Let's Go!
      </wui-button>
    </wui-flex>`}redirectToAccount(){J.replace("Account")}};G.styles=de;G=be([w("w3m-register-account-name-success-view")],G);export{H as W3mApproveTransactionView,G as W3mRegisterAccountNameSuccess,$ as W3mRegisterAccountNameView,I as W3mSmartAccountSettingsView,le as W3mUpgradeWalletView};
