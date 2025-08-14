import"./chunk-JOYGEXH7.js";import"./chunk-JCYU6AIT.js";import"./chunk-SYFDFVC7.js";import"./chunk-BVPCGFJI.js";import"./chunk-HNNCEA3D.js";import"./chunk-DEIPQ325.js";import"./chunk-ZIGIB2I5.js";import"./chunk-TH5JHSOM.js";import"./chunk-6OHO6DGB.js";import"./chunk-IXRLO5GV.js";import"./chunk-MLDJAIZD.js";import"./chunk-NSWQOQ7B.js";import{D as F,F as T,H as U,L as x,R as B,W as f,b as C,f as z,h as k,i as I,k as A,p as N,r as H,s as O,t as L,y as _,z as V}from"./chunk-WYPOXQ7L.js";import{a as j,b as M}from"./chunk-J6OVQL6H.js";import{a as S,b,g as P}from"./chunk-HILJYRBB.js";import"./chunk-ETAVA44A.js";import"./chunk-JK5MJGFP.js";import"./chunk-COAJKL54.js";import"./chunk-65GJ65H6.js";import"./chunk-H6T4G3YK.js";import"./chunk-FILZKAK2.js";import"./chunk-OZZRRPYE.js";import"./chunk-FXML5DPA.js";import"./chunk-6OI5GZ4U.js";import"./chunk-YRGGSJIG.js";import{b as v,e as u,j as p}from"./chunk-5RP2GFJC.js";import{h as a,j as l,n as m}from"./chunk-KGCAX4NX.js";a();m();l();a();m();l();a();m();l();var G=v`
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
`;var K=function(n,e,t,r){var o=arguments.length,i=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(i=(o<3?s(i):o>3?s(e,t,i):s(e,t))||i);return o>3&&i&&Object.defineProperty(e,t,i),i},W=600,Y=360,Z=64,$=class extends p{constructor(){super(),this.bodyObserver=void 0,this.unsubscribe=[],this.iframe=document.getElementById("w3m-iframe"),this.ready=!1,this.unsubscribe.push(U.subscribeKey("open",e=>{e||this.onHideIframe()}),U.subscribeKey("shake",e=>{e?this.iframe.style.animation="w3m-shake 500ms var(--wui-ease-out-power-2)":this.iframe.style.animation="none"}))}disconnectedCallback(){this.onHideIframe(),this.unsubscribe.forEach(e=>e()),this.bodyObserver?.unobserve(window.document.body)}async firstUpdated(){await this.syncTheme(),this.iframe.style.display="block";let e=this?.renderRoot?.querySelector("div");this.bodyObserver=new ResizeObserver(t=>{let o=t?.[0]?.contentBoxSize?.[0]?.inlineSize;this.iframe.style.height=`${W}px`,e.style.height=`${W}px`,o&&o<=430?(this.iframe.style.width="100%",this.iframe.style.left="0px",this.iframe.style.bottom="0px",this.iframe.style.top="unset"):(this.iframe.style.width=`${Y}px`,this.iframe.style.left=`calc(50% - ${Y/2}px)`,this.iframe.style.top=`calc(50% - ${W/2}px + ${Z/2}px)`,this.iframe.style.bottom="unset"),this.ready=!0,this.onShowIframe()}),this.bodyObserver.observe(window.document.body)}render(){return u`<div data-ready=${this.ready} id="w3m-frame-container"></div>`}onShowIframe(){let e=window.innerWidth<=430;this.iframe.style.animation=e?"w3m-iframe-zoom-in-mobile 200ms var(--wui-ease-out-power-2)":"w3m-iframe-zoom-in 200ms var(--wui-ease-out-power-2)"}onHideIframe(){this.iframe.style.display="none",this.iframe.style.animation="w3m-iframe-fade-out 200ms var(--wui-ease-out-power-2)"}async syncTheme(){let e=L.getAuthConnector();if(e){let t=O.getSnapshot().themeMode,r=O.getSnapshot().themeVariables;await e.provider.syncTheme({themeVariables:r,w3mThemeVariables:k(r,t)})}}};$.styles=G;K([b()],$.prototype,"ready",void 0);$=K([f("w3m-approve-transaction-view")],$);a();m();l();var ee=function(n,e,t,r){var o=arguments.length,i=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(i=(o<3?s(i):o>3?s(e,t,i):s(e,t))||i);return o>3&&i&&Object.defineProperty(e,t,i),i},q=class extends p{render(){return u`
      <wui-flex flexDirection="column" alignItems="center" gap="xl" padding="xl">
        <wui-text variant="paragraph-400" color="fg-100">Follow the instructions on</wui-text>
        <wui-chip
          icon="externalLink"
          variant="fill"
          href=${I.SECURE_SITE_DASHBOARD}
          imageSrc=${I.SECURE_SITE_FAVICON}
          data-testid="w3m-secure-website-button"
        >
        </wui-chip>
        <wui-text variant="small-400" color="fg-200">
          You will have to reconnect for security reasons
        </wui-text>
      </wui-flex>
    `}};q=ee([f("w3m-upgrade-wallet-view")],q);a();m();l();a();m();l();a();m();l();a();m();l();var X=v`
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
`;var R=function(n,e,t,r){var o=arguments.length,i=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(i=(o<3?s(i):o>3?s(e,t,i):s(e,t))||i);return o>3&&i&&Object.defineProperty(e,t,i),i},E=class extends p{constructor(){super(...arguments),this.disabled=!1,this.loading=!1}render(){return u`
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
      ${C.WC_NAME_SUFFIX}
    </wui-text>`}loadingTemplate(){return this.loading?u`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:null}errorTemplate(){return this.errorMessage?u`<wui-text variant="tiny-500" color="error-100" class="error"
        >${this.errorMessage}</wui-text
      >`:null}};E.styles=[B,X];R([S()],E.prototype,"errorMessage",void 0);R([S({type:Boolean})],E.prototype,"disabled",void 0);R([S()],E.prototype,"value",void 0);R([S({type:Boolean})],E.prototype,"loading",void 0);E=R([f("wui-ens-input")],E);a();m();l();var Q=v`
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
`;var y=function(n,e,t,r){var o=arguments.length,i=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(i=(o<3?s(i):o>3?s(e,t,i):s(e,t))||i);return o>3&&i&&Object.defineProperty(e,t,i),i},w=class extends p{constructor(){super(),this.formRef=j(),this.usubscribe=[],this.name="",this.error="",this.loading=x.state.loading,this.suggestions=x.state.suggestions,this.registered=!1,this.profileName=T.state.profileName,this.onDebouncedNameInputChange=A.debounce(e=>{x.validateName(e)?(this.error="",this.name=e,x.getSuggestions(e),x.isNameRegistered(e).then(t=>{this.registered=t})):e.length<4?this.error="Name must be at least 4 characters long":this.error="Can only contain letters, numbers and - characters"}),this.usubscribe.push(x.subscribe(e=>{this.suggestions=e.suggestions,this.loading=e.loading}),T.subscribeKey("profileName",e=>{this.profileName=e,e&&(this.error="You already own a name")}))}firstUpdated(){this.formRef.value?.addEventListener("keydown",this.onEnterKey.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this.usubscribe.forEach(e=>e()),this.formRef.value?.removeEventListener("keydown",this.onEnterKey.bind(this))}render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="m"
        .padding=${["0","s","m","s"]}
      >
        <form ${M(this.formRef)} @submit=${this.onSubmitName.bind(this)}>
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
        `:null}onSelectSuggestion(e){return()=>{this.name=e,this.registered=!1,this.requestUpdate()}}onNameInputChange(e){this.onDebouncedNameInputChange(e.detail)}nameSuggestionTagTemplate(){return this.loading?u`<wui-loading-spinner size="lg" color="fg-100"></wui-loading-spinner>`:this.registered?u`<wui-tag variant="shade" size="lg">Registered</wui-tag>`:u`<wui-tag variant="success" size="lg">Available</wui-tag>`}templateSuggestions(){if(!this.name||this.name.length<4||this.error)return null;let e=this.registered?this.suggestions.filter(t=>t.name!==this.name):[];return u`<wui-flex flexDirection="column" gap="xxs" alignItems="center">
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
      ${e.map(t=>this.availableNameTemplate(t.name))}
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
    </wui-flex>`}isAllowedToSubmit(){return!this.loading&&!this.registered&&!this.error&&!this.profileName&&x.validateName(this.name)}async onSubmitName(){let e=F.state.activeChain;try{if(!this.isAllowedToSubmit())return;let t=`${this.name}${C.WC_NAME_SUFFIX}`;N.sendEvent({type:"track",event:"REGISTER_NAME_INITIATED",properties:{isSmartAccount:T.state.preferredAccountTypes?.[e]===_.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:t}}),await x.registerName(t),N.sendEvent({type:"track",event:"REGISTER_NAME_SUCCESS",properties:{isSmartAccount:T.state.preferredAccountTypes?.[e]===_.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:t}})}catch(t){V.showError(t.message),N.sendEvent({type:"track",event:"REGISTER_NAME_ERROR",properties:{isSmartAccount:T.state.preferredAccountTypes?.[e]===_.ACCOUNT_TYPES.SMART_ACCOUNT,ensName:`${this.name}${C.WC_NAME_SUFFIX}`,error:t?.message||"Unknown error"}})}}onEnterKey(e){e.key==="Enter"&&this.isAllowedToSubmit()&&this.onSubmitName()}};w.styles=Q;y([S()],w.prototype,"errorMessage",void 0);y([b()],w.prototype,"name",void 0);y([b()],w.prototype,"error",void 0);y([b()],w.prototype,"loading",void 0);y([b()],w.prototype,"suggestions",void 0);y([b()],w.prototype,"registered",void 0);y([b()],w.prototype,"profileName",void 0);w=y([f("w3m-register-account-name-view")],w);a();m();l();a();m();l();var J=v`
  .continue-button-container {
    width: 100%;
  }
`;var te=function(n,e,t,r){var o=arguments.length,i=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,t):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,r);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(i=(o<3?s(i):o>3?s(e,t,i):s(e,t))||i);return o>3&&i&&Object.defineProperty(e,t,i),i},D=class extends p{render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="xxl"
        .padding=${["0","0","l","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{A.openHref(z.URLS.FAQ,"_blank")}}
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
    </wui-flex>`}redirectToAccount(){H.replace("Account")}};D.styles=J;D=te([f("w3m-register-account-name-success-view")],D);export{$ as W3mApproveTransactionView,D as W3mRegisterAccountNameSuccess,w as W3mRegisterAccountNameView,q as W3mUpgradeWalletView};
