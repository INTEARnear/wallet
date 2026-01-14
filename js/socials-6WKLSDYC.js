import{a as G}from"./chunk-6VWVZVQM.js";import{a as V}from"./chunk-4PLPFPWC.js";import{b as B}from"./chunk-ECJO7S2V.js";import{d as z}from"./chunk-W4MYE3I6.js";import"./chunk-SR42VORX.js";import"./chunk-WZ3HYXL6.js";import"./chunk-MMHKZM43.js";import"./chunk-ONZEZPXK.js";import"./chunk-25YBDBEP.js";import"./chunk-6EMLP2SS.js";import"./chunk-DW5UEWXF.js";import"./chunk-7FUATHPM.js";import"./chunk-YYMQ6HDD.js";import"./chunk-FB5BNV7C.js";import"./chunk-LW4FQU5S.js";import"./chunk-5BCUXIZJ.js";import"./chunk-BR7S6AGZ.js";import{h as L}from"./chunk-LTN6YROF.js";import{A as q,B as f,D as w,E as R,F as $,I as S,K as W,M as P,N as h,P as A,U as D,p as M,q as F,r as _,s as m}from"./chunk-N2WXLAZF.js";import"./chunk-X4QP7L3N.js";import"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-GLIZJUBT.js";import{a as E}from"./chunk-B2LU4KHT.js";import{a as j,b as u}from"./chunk-IDZGCU4F.js";import{b as C,e as s,k as y}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as a,k as l,o as c}from"./chunk-JY5TIRRF.js";a();c();l();a();c();l();a();c();l();a();c();l();var K=C`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var T=function(d,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(d,e,t,o);else for(var p=d.length-1;p>=0;p--)(n=d[p])&&(i=(r<3?n(i):r>3?n(e,t,i):n(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},k=class extends y{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.authConnector=this.connectors.find(e=>e.type==="AUTH"),this.remoteFeatures=m.state.remoteFeatures,this.isPwaLoading=!1,this.unsubscribe.push($.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(t=>t.type==="AUTH")}),m.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.remoteFeatures?.socials||[],t=!!this.authConnector,o=e?.length,r=w.state.view==="ConnectSocials";return(!t||!o)&&!r?null:(r&&!o&&(e=M.DEFAULT_SOCIALS),s` <wui-flex flexDirection="column" gap="xs">
      ${e.map(i=>s`<wui-list-social
            @click=${()=>{this.onSocialClick(i)}}
            data-testid=${`social-selector-${i}`}
            name=${i}
            logo=${i}
            ?disabled=${this.isPwaLoading}
          ></wui-list-social>`)}
    </wui-flex>`)}async onSocialClick(e){e&&await G(e)}async handlePwaFrameLoad(){if(_.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof B&&await this.authConnector.provider.init()}catch(e){q.open({shortMessage:"Error loading embedded wallet in PWA",longMessage:e.message},"error")}finally{this.isPwaLoading=!1}}}};k.styles=K;T([j()],k.prototype,"tabIdx",void 0);T([u()],k.prototype,"connectors",void 0);T([u()],k.prototype,"authConnector",void 0);T([u()],k.prototype,"remoteFeatures",void 0);T([u()],k.prototype,"isPwaLoading",void 0);k=T([L("w3m-social-login-list")],k);a();c();l();var H=C`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }
  wui-flex::-webkit-scrollbar {
    display: none;
  }
  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var X=function(d,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(d,e,t,o);else for(var p=d.length-1;p>=0;p--)(n=d[p])&&(i=(r<3?n(i):r>3?n(e,t,i):n(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},N=class extends y{constructor(){super(),this.unsubscribe=[],this.checked=D.state.isLegalCheckboxChecked,this.unsubscribe.push(D.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=m.state,o=m.state.features?.legalCheckbox,i=!!(e||t)&&!!o,n=i&&!this.checked,p=n?-1:void 0;return s`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${i?["0","s","s","s"]:"s"}
        gap="xs"
        class=${E(n?"disabled":void 0)}
      >
        <w3m-social-login-list tabIdx=${E(p)}></w3m-social-login-list>
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}};N.styles=H;X([u()],N.prototype,"checked",void 0);N=X([L("w3m-connect-socials-view")],N);a();c();l();a();c();l();a();c();l();var Q=C`
  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: var(--wui-border-radius-m);
  }
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
  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-lg);
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
  .capitalize {
    text-transform: capitalize;
  }
`;var O=function(d,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(d,e,t,o);else for(var p=d.length-1;p>=0;p--)(n=d[p])&&(i=(r<3?n(i):r>3?n(e,t,i):n(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},x=class extends y{constructor(){super(),this.unsubscribe=[],this.socialProvider=h.state.socialProvider,this.socialWindow=h.state.socialWindow,this.error=!1,this.connecting=!1,this.message="Connect in the provider window",this.remoteFeatures=m.state.remoteFeatures,this.address=h.state.address,this.connectionsByNamespace=W.getConnections(P.state.activeChain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.authConnector=$.getAuthConnector(),this.handleSocialConnection=async t=>{if(t.data?.resultUri)if(t.origin===V.SECURE_SITE_ORIGIN){window.removeEventListener("message",this.handleSocialConnection,!1);try{if(this.authConnector&&!this.connecting){this.socialWindow&&(this.socialWindow.close(),h.setSocialWindow(void 0,P.state.activeChain)),this.connecting=!0,this.updateMessage();let o=t.data.resultUri;this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}}),await W.connectExternal({id:this.authConnector.id,type:this.authConnector.type,socialUri:o},this.authConnector.chain),this.socialProvider&&(F.setConnectedSocialProvider(this.socialProvider),f.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider,caipNetworkId:P.getActiveCaipNetwork()?.caipNetworkId}}))}}catch{this.error=!0,this.updateMessage(),this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider}})}}else w.goBack(),S.showError("Untrusted Origin"),this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider}})},z.EmbeddedWalletAbortController.signal.addEventListener("abort",()=>{this.socialWindow&&(this.socialWindow.close(),h.setSocialWindow(void 0,P.state.activeChain))}),this.unsubscribe.push(h.subscribe(t=>{t.socialProvider&&(this.socialProvider=t.socialProvider),t.socialWindow&&(this.socialWindow=t.socialWindow)}),m.subscribeKey("remoteFeatures",t=>{this.remoteFeatures=t}),h.subscribeKey("address",t=>{let o=this.remoteFeatures?.multiWallet;t&&t!==this.address&&(this.hasMultipleConnections&&o?(w.replace("ProfileWallets"),S.showSuccess("New Wallet Added")):(A.state.open||m.state.enableEmbedded)&&A.close())})),this.authConnector&&this.connectSocial()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),window.removeEventListener("message",this.handleSocialConnection,!1),this.socialWindow?.close(),h.setSocialWindow(void 0,P.state.activeChain)}render(){return s`
      <wui-flex
        data-error=${E(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${E(this.socialProvider)}></wui-logo>
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
          <wui-text align="center" variant="paragraph-500" color="fg-100"
            >Log in with
            <span class="capitalize">${this.socialProvider??"Social"}</span></wui-text
          >
          <wui-text align="center" variant="small-400" color=${this.error?"error-100":"fg-200"}
            >${this.message}</wui-text
          ></wui-flex
        >
      </wui-flex>
    `}loaderTemplate(){let e=R.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return s`<wui-loading-thumbnail radius=${t*9}></wui-loading-thumbnail>`}connectSocial(){let e=setInterval(()=>{this.socialWindow?.closed&&(!this.connecting&&w.state.view==="ConnectingSocial"&&(this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}}),w.goBack()),clearInterval(e))},1e3);window.addEventListener("message",this.handleSocialConnection,!1)}updateMessage(){this.error?this.message="Something went wrong":this.connecting?this.message="Retrieving user data":this.message="Connect in the provider window"}};x.styles=Q;O([u()],x.prototype,"socialProvider",void 0);O([u()],x.prototype,"socialWindow",void 0);O([u()],x.prototype,"error",void 0);O([u()],x.prototype,"connecting",void 0);O([u()],x.prototype,"message",void 0);O([u()],x.prototype,"remoteFeatures",void 0);x=O([L("w3m-connecting-social-view")],x);a();c();l();a();c();l();var J=C`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }

  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: var(--wui-border-radius-m);
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }
  wui-loading-thumbnail {
    position: absolute;
  }
  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-lg);
  }
`;var U=function(d,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(d,e,t,o);else for(var p=d.length-1;p>=0;p--)(n=d[p])&&(i=(r<3?n(i):r>3?n(e,t,i):n(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},I=class extends y{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.socialProvider=h.state.socialProvider,this.uri=h.state.farcasterUrl,this.ready=!1,this.loading=!1,this.remoteFeatures=m.state.remoteFeatures,this.authConnector=$.getAuthConnector(),this.forceUpdate=()=>{this.requestUpdate()},this.unsubscribe.push(h.subscribeKey("farcasterUrl",e=>{e&&(this.uri=e,this.connectFarcaster())}),h.subscribeKey("socialProvider",e=>{e&&(this.socialProvider=e)}),m.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e})),window.addEventListener("resize",this.forceUpdate)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timeout),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),s`${this.platformTemplate()}`}platformTemplate(){return _.isMobile()?s`${this.mobileTemplate()}`:s`${this.desktopTemplate()}`}desktopTemplate(){return this.loading?s`${this.loadingTemplate()}`:s`${this.qrTemplate()}`}qrTemplate(){return s` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["0","xl","xl","xl"]}
      gap="xl"
    >
      <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

      <wui-text variant="paragraph-500" color="fg-100">
        Scan this QR Code with your phone
      </wui-text>
      ${this.copyTemplate()}
    </wui-flex>`}loadingTemplate(){return s`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo="farcaster"></wui-logo>
          ${this.loaderTemplate()}
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
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            Loading user data
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            Please wait a moment while we load your data.
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}mobileTemplate(){return s` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["3xl","xl","xl","xl"]}
      gap="xl"
    >
      <wui-flex justifyContent="center" alignItems="center">
        <wui-logo logo="farcaster"></wui-logo>
        ${this.loaderTemplate()}
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
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >Continue in Farcaster</span></wui-text
        >
        <wui-text align="center" variant="small-400" color="fg-200"
          >Accept connection request in the app</wui-text
        ></wui-flex
      >
      ${this.mobileLinkTemplate()}
    </wui-flex>`}loaderTemplate(){let e=R.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return s`<wui-loading-thumbnail radius=${t*9}></wui-loading-thumbnail>`}async connectFarcaster(){if(this.authConnector)try{await this.authConnector?.provider.connectFarcaster(),this.socialProvider&&(F.setConnectedSocialProvider(this.socialProvider),f.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}})),this.loading=!0;let t=W.getConnections(this.authConnector.chain).length>0;await W.connectExternal(this.authConnector,this.authConnector.chain);let o=this.remoteFeatures?.multiWallet;this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider,caipNetworkId:P.getActiveCaipNetwork()?.caipNetworkId}}),this.loading=!1,t&&o?(w.replace("ProfileWallets"),S.showSuccess("New Wallet Added")):A.close()}catch(e){this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider}}),w.goBack(),S.showError(e)}}mobileLinkTemplate(){return s`<wui-button
      size="md"
      ?loading=${this.loading}
      ?disabled=${!this.uri||this.loading}
      @click=${()=>{this.uri&&_.openHref(this.uri,"_blank")}}
    >
      Open farcaster</wui-button
    >`}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.getBoundingClientRect().width-40;return s` <wui-qr-code
      size=${e}
      theme=${R.state.themeMode}
      uri=${this.uri}
      ?farcaster=${!0}
      data-testid="wui-qr-code"
      color=${E(R.state.themeVariables["--w3m-qr-color"])}
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return s`<wui-link
      .disabled=${e}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}onCopyUri(){try{this.uri&&(_.copyToClopboard(this.uri),S.showSuccess("Link copied"))}catch{S.showError("Failed to copy")}}};I.styles=J;U([u()],I.prototype,"socialProvider",void 0);U([u()],I.prototype,"uri",void 0);U([u()],I.prototype,"ready",void 0);U([u()],I.prototype,"loading",void 0);U([u()],I.prototype,"remoteFeatures",void 0);I=U([L("w3m-connecting-farcaster-view")],I);export{N as W3mConnectSocialsView,I as W3mConnectingFarcasterView,x as W3mConnectingSocialView};
