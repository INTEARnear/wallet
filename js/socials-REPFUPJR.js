import"./chunk-ZHMEKGKX.js";import{a as W}from"./chunk-MNNC6HL4.js";import{a as j}from"./chunk-KG5GTMNR.js";import{b as F}from"./chunk-T4OAGIV2.js";import{d as D}from"./chunk-NAWDSJ2N.js";import"./chunk-GECKKE5G.js";import"./chunk-ARRV6HDU.js";import"./chunk-IUU3CNDQ.js";import"./chunk-EXQ2HDEE.js";import"./chunk-GKRWJYQJ.js";import"./chunk-NJ72WSLJ.js";import"./chunk-OYKZTSC3.js";import"./chunk-JEWQBEMQ.js";import"./chunk-VDKDUVDQ.js";import"./chunk-MQVU5GUU.js";import"./chunk-UXFOC5SQ.js";import"./chunk-IJVFTMCP.js";import"./chunk-Z7AFWF2C.js";import{a as q,b as l,f as g}from"./chunk-KGK2MHEY.js";import{A as h,B as E,C as v,I as S,L as O,O as I,Q as d,R as k,W as T,fa as w,r as U,s as _,t as y,u as p,x as A,y as u}from"./chunk-SGMZUJCA.js";import"./chunk-QQ2U7YUK.js";import"./chunk-OIFNSKKM.js";import"./chunk-KBZLPVCS.js";import"./chunk-4XVQLAVT.js";import"./chunk-V7H3HPRQ.js";import"./chunk-EAWY7VYO.js";import"./chunk-2LXNZIUV.js";import"./chunk-NIKCAVDA.js";import"./chunk-URLXKBQX.js";import"./chunk-FFQJ55XB.js";import"./chunk-6IYG3UUA.js";import{b as m,e as s,j as f}from"./chunk-WGWCH7J2.js";import"./chunk-57YRCRKT.js";var z=m`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var P=function(a,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,e,t,o);else for(var c=a.length-1;c>=0;c--)(n=a[c])&&(i=(r<3?n(i):r>3?n(e,t,i):n(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},b=class extends f{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=v.state.connectors,this.authConnector=this.connectors.find(e=>e.type==="AUTH"),this.remoteFeatures=p.state.remoteFeatures,this.isPwaLoading=!1,this.unsubscribe.push(v.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(t=>t.type==="AUTH")}),p.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.remoteFeatures?.socials||[],t=!!this.authConnector,o=e?.length,r=h.state.view==="ConnectSocials";return(!t||!o)&&!r?null:(r&&!o&&(e=U.DEFAULT_SOCIALS),s` <wui-flex flexDirection="column" gap="xs">
      ${e.map(i=>s`<wui-list-social
            @click=${()=>{this.onSocialClick(i)}}
            data-testid=${`social-selector-${i}`}
            name=${i}
            logo=${i}
            ?disabled=${this.isPwaLoading}
          ></wui-list-social>`)}
    </wui-flex>`)}async onSocialClick(e){e&&await W(e)}async handlePwaFrameLoad(){if(y.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof F&&await this.authConnector.provider.init()}catch(e){A.open({shortMessage:"Error loading embedded wallet in PWA",longMessage:e.message},"error")}finally{this.isPwaLoading=!1}}}};b.styles=z;P([q()],b.prototype,"tabIdx",void 0);P([l()],b.prototype,"connectors",void 0);P([l()],b.prototype,"authConnector",void 0);P([l()],b.prototype,"remoteFeatures",void 0);P([l()],b.prototype,"isPwaLoading",void 0);b=P([w("w3m-social-login-list")],b);var M=m`
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
`;var N=function(a,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,e,t,o);else for(var c=a.length-1;c>=0;c--)(n=a[c])&&(i=(r<3?n(i):r>3?n(e,t,i):n(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},R=class extends f{constructor(){super(),this.unsubscribe=[],this.checked=T.state.isLegalCheckboxChecked,this.unsubscribe.push(T.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=p.state,o=p.state.features?.legalCheckbox,i=!!(e||t)&&!!o,n=i&&!this.checked,c=n?-1:void 0;return s`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${i?["0","s","s","s"]:"s"}
        gap="xs"
        class=${g(n?"disabled":void 0)}
      >
        <w3m-social-login-list tabIdx=${g(c)}></w3m-social-login-list>
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}};R.styles=M;N([l()],R.prototype,"checked",void 0);R=N([w("w3m-connect-socials-view")],R);var V=m`
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
`;var L=function(a,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,e,t,o);else for(var c=a.length-1;c>=0;c--)(n=a[c])&&(i=(r<3?n(i):r>3?n(e,t,i):n(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},x=class extends f{constructor(){super(),this.unsubscribe=[],this.socialProvider=d.state.socialProvider,this.socialWindow=d.state.socialWindow,this.error=!1,this.connecting=!1,this.message="Connect in the provider window",this.authConnector=v.getAuthConnector(),this.handleSocialConnection=async t=>{if(t.data?.resultUri)if(t.origin===j.SECURE_SITE_ORIGIN){window.removeEventListener("message",this.handleSocialConnection,!1);try{if(this.authConnector&&!this.connecting){this.socialWindow&&(this.socialWindow.close(),d.setSocialWindow(void 0,I.state.activeChain)),this.connecting=!0,this.updateMessage();let o=t.data.resultUri;this.socialProvider&&u.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}}),await O.connectExternal({id:this.authConnector.id,type:this.authConnector.type,socialUri:o},this.authConnector.chain),this.socialProvider&&(_.setConnectedSocialProvider(this.socialProvider),u.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}))}}catch{this.error=!0,this.updateMessage(),this.socialProvider&&u.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider}})}}else h.goBack(),S.showError("Untrusted Origin"),this.socialProvider&&u.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider}})},D.EmbeddedWalletAbortController.signal.addEventListener("abort",()=>{this.socialWindow&&(this.socialWindow.close(),d.setSocialWindow(void 0,I.state.activeChain))}),this.unsubscribe.push(d.subscribe(t=>{t.socialProvider&&(this.socialProvider=t.socialProvider),t.socialWindow&&(this.socialWindow=t.socialWindow),t.address&&(k.state.open||p.state.enableEmbedded)&&k.close()})),this.authConnector&&this.connectSocial()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),window.removeEventListener("message",this.handleSocialConnection,!1),this.socialWindow?.close(),d.setSocialWindow(void 0,I.state.activeChain)}render(){return s`
      <wui-flex
        data-error=${g(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${g(this.socialProvider)}></wui-logo>
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
    `}loaderTemplate(){let e=E.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return s`<wui-loading-thumbnail radius=${t*9}></wui-loading-thumbnail>`}connectSocial(){let e=setInterval(()=>{this.socialWindow?.closed&&(!this.connecting&&h.state.view==="ConnectingSocial"&&(this.socialProvider&&u.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}}),h.goBack()),clearInterval(e))},1e3);window.addEventListener("message",this.handleSocialConnection,!1)}updateMessage(){this.error?this.message="Something went wrong":this.connecting?this.message="Retrieving user data":this.message="Connect in the provider window"}};x.styles=V;L([l()],x.prototype,"socialProvider",void 0);L([l()],x.prototype,"socialWindow",void 0);L([l()],x.prototype,"error",void 0);L([l()],x.prototype,"connecting",void 0);L([l()],x.prototype,"message",void 0);x=L([w("w3m-connecting-social-view")],x);var G=m`
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
`;var $=function(a,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,e,t,o);else for(var c=a.length-1;c>=0;c--)(n=a[c])&&(i=(r<3?n(i):r>3?n(e,t,i):n(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},C=class extends f{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.socialProvider=d.state.socialProvider,this.uri=d.state.farcasterUrl,this.ready=!1,this.loading=!1,this.authConnector=v.getAuthConnector(),this.forceUpdate=()=>{this.requestUpdate()},this.unsubscribe.push(d.subscribeKey("farcasterUrl",e=>{e&&(this.uri=e,this.connectFarcaster())}),d.subscribeKey("socialProvider",e=>{e&&(this.socialProvider=e)})),window.addEventListener("resize",this.forceUpdate)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timeout),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),s`${this.platformTemplate()}`}platformTemplate(){return y.isMobile()?s`${this.mobileTemplate()}`:s`${this.desktopTemplate()}`}desktopTemplate(){return this.loading?s`${this.loadingTemplate()}`:s`${this.qrTemplate()}`}qrTemplate(){return s` <wui-flex
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
    </wui-flex>`}loaderTemplate(){let e=E.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return s`<wui-loading-thumbnail radius=${t*9}></wui-loading-thumbnail>`}async connectFarcaster(){if(this.authConnector)try{await this.authConnector?.provider.connectFarcaster(),this.socialProvider&&(_.setConnectedSocialProvider(this.socialProvider),u.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}})),this.loading=!0,await O.connectExternal(this.authConnector,this.authConnector.chain),this.socialProvider&&u.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}),this.loading=!1,k.close()}catch(e){this.socialProvider&&u.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider}}),h.goBack(),S.showError(e)}}mobileLinkTemplate(){return s`<wui-button
      size="md"
      ?loading=${this.loading}
      ?disabled=${!this.uri||this.loading}
      @click=${()=>{this.uri&&y.openHref(this.uri,"_blank")}}
    >
      Open farcaster</wui-button
    >`}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.getBoundingClientRect().width-40;return s` <wui-qr-code
      size=${e}
      theme=${E.state.themeMode}
      uri=${this.uri}
      ?farcaster=${!0}
      data-testid="wui-qr-code"
      color=${g(E.state.themeVariables["--w3m-qr-color"])}
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return s`<wui-link
      .disabled=${e}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}onCopyUri(){try{this.uri&&(y.copyToClopboard(this.uri),S.showSuccess("Link copied"))}catch{S.showError("Failed to copy")}}};C.styles=G;$([l()],C.prototype,"socialProvider",void 0);$([l()],C.prototype,"uri",void 0);$([l()],C.prototype,"ready",void 0);$([l()],C.prototype,"loading",void 0);C=$([w("w3m-connecting-farcaster-view")],C);export{R as W3mConnectSocialsView,C as W3mConnectingFarcasterView,x as W3mConnectingSocialView};
