import"./chunk-ZE7767IA.js";import"./chunk-ASCK67KS.js";import{a as V}from"./chunk-ZYZOIEZB.js";import{c as B}from"./chunk-6T7Q26JY.js";import"./chunk-K5RILM6W.js";import{a as z}from"./chunk-4QOCBQPC.js";import"./chunk-Z6LVO3CP.js";import"./chunk-RL7GPJDA.js";import"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-MNAGPPOX.js";import"./chunk-EJ5H5H5L.js";import"./chunk-IPTO6NMX.js";import"./chunk-BI3DTO7P.js";import"./chunk-EEYGRRF2.js";import"./chunk-GLIZJUBT.js";import"./chunk-RLPEU2I3.js";import{a as L}from"./chunk-B2LU4KHT.js";import{h as q,k as D,r as S,z as P}from"./chunk-RZQOM5QR.js";import"./chunk-HQPTEMSB.js";import{a as G,b as l}from"./chunk-IDZGCU4F.js";import{e as a,k as $}from"./chunk-ZS2R6O6N.js";import"./chunk-SQN7L5MN.js";import"./chunk-7GZ7JYLK.js";import"./chunk-6HADIPAO.js";import"./chunk-2T4BE52W.js";import"./chunk-XQOHLC2A.js";import{A as T,B as g,F as M,H as m,I as E,O as f,P as j,S as w,T as _,U as I,aa as A,ga as h,ia as W,z as N}from"./chunk-OXOEMY67.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as c,k as d,o as u}from"./chunk-JY5TIRRF.js";c();u();d();c();u();d();c();u();d();c();u();d();var H=S`
  :host {
    margin-top: ${({spacing:t})=>t[1]};
  }
  wui-separator {
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1)
      ${({spacing:t})=>t[2]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
  }
`;var R=function(t,e,i,r){var s=arguments.length,o=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var p=t.length-1;p>=0;p--)(n=t[p])&&(o=(s<3?n(o):s>3?n(e,i,o):n(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},x=class extends ${constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=I.state.connectors,this.authConnector=this.connectors.find(e=>e.type==="AUTH"),this.remoteFeatures=m.state.remoteFeatures,this.isPwaLoading=!1,this.hasExceededUsageLimit=j.state.plan.hasExceededUsageLimit,this.unsubscribe.push(I.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(i=>i.type==="AUTH")}),m.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.remoteFeatures?.socials||[],i=!!this.authConnector,r=e?.length,s=w.state.view==="ConnectSocials";return(!i||!r)&&!s?null:(s&&!r&&(e=N.DEFAULT_SOCIALS),a` <wui-flex flexDirection="column" gap="2">
      ${e.map(o=>a`<wui-list-social
            @click=${()=>{this.onSocialClick(o)}}
            data-testid=${`social-selector-${o}`}
            name=${o}
            logo=${o}
            ?disabled=${this.isPwaLoading}
          ></wui-list-social>`)}
    </wui-flex>`)}async onSocialClick(e){if(this.hasExceededUsageLimit){w.push("UsageExceeded");return}e&&await z(e)}async handlePwaFrameLoad(){if(g.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof M&&await this.authConnector.provider.init()}catch(e){q.open({displayMessage:"Error loading embedded wallet in PWA",debugMessage:e.message},"error")}finally{this.isPwaLoading=!1}}}};x.styles=H;R([G()],x.prototype,"tabIdx",void 0);R([l()],x.prototype,"connectors",void 0);R([l()],x.prototype,"authConnector",void 0);R([l()],x.prototype,"remoteFeatures",void 0);R([l()],x.prototype,"isPwaLoading",void 0);R([l()],x.prototype,"hasExceededUsageLimit",void 0);x=R([P("w3m-social-login-list")],x);c();u();d();var K=S`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity ${({durations:t})=>t.md}
      ${({easings:t})=>t["ease-out-power-1"]};
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
`;var X=function(t,e,i,r){var s=arguments.length,o=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var p=t.length-1;p>=0;p--)(n=t[p])&&(o=(s<3?n(o):s>3?n(e,i,o):n(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},F=class extends ${constructor(){super(),this.unsubscribe=[],this.checked=D.state.isLegalCheckboxChecked,this.unsubscribe.push(D.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:i}=m.state,r=m.state.features?.legalCheckbox,n=!!(e||i)&&!!r&&!this.checked,p=n?-1:void 0;return a`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","3","3","3"]}
        gap="01"
        class=${L(n?"disabled":void 0)}
      >
        <w3m-social-login-list tabIdx=${L(p)}></w3m-social-login-list>
      </wui-flex>
    `}};F.styles=K;X([l()],F.prototype,"checked",void 0);F=X([P("w3m-connect-socials-view")],F);c();u();d();c();u();d();c();u();d();var Q=S`
  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: ${({borderRadius:t})=>t[8]};
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
    right: calc(${({spacing:t})=>t[1]} * -1);
    bottom: calc(${({spacing:t})=>t[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all ${({easings:t})=>t["ease-out-power-2"]}
      ${({durations:t})=>t.lg};
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
  .capitalize {
    text-transform: capitalize;
  }
`;var U=function(t,e,i,r){var s=arguments.length,o=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var p=t.length-1;p>=0;p--)(n=t[p])&&(o=(s<3?n(o):s>3?n(e,i,o):n(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},y=class extends ${constructor(){super(),this.unsubscribe=[],this.socialProvider=h.getAccountData()?.socialProvider,this.socialWindow=h.getAccountData()?.socialWindow,this.error=!1,this.connecting=!1,this.message="Connect in the provider window",this.remoteFeatures=m.state.remoteFeatures,this.address=h.getAccountData()?.address,this.connectionsByNamespace=A.getConnections(h.state.activeChain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.authConnector=I.getAuthConnector(),this.handleSocialConnection=async i=>{if(i.data?.resultUri)if(i.origin===V.SECURE_SITE_ORIGIN){window.removeEventListener("message",this.handleSocialConnection,!1);try{if(this.authConnector&&!this.connecting){this.connecting=!0;let r=this.parseURLError(i.data.resultUri);if(r){this.handleSocialError(r);return}this.closeSocialWindow(),this.updateMessage();let s=i.data.resultUri;this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}}),await A.connectExternal({id:this.authConnector.id,type:this.authConnector.type,socialUri:s},this.authConnector.chain),this.socialProvider&&(T.setConnectedSocialProvider(this.socialProvider),f.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}))}}catch(r){this.error=!0,this.updateMessage(),this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:g.parseError(r)}})}}else w.goBack(),E.showError("Untrusted Origin"),this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:"Untrusted Origin"}})},B.EmbeddedWalletAbortController.signal.addEventListener("abort",()=>{this.closeSocialWindow()}),this.unsubscribe.push(h.subscribeChainProp("accountState",i=>{if(i&&(this.socialProvider=i.socialProvider,i.socialWindow&&(this.socialWindow=i.socialWindow),i.address)){let r=this.remoteFeatures?.multiWallet;i.address!==this.address&&(this.hasMultipleConnections&&r?(w.replace("ProfileWallets"),E.showSuccess("New Wallet Added"),this.address=i.address):(W.state.open||m.state.enableEmbedded)&&W.close())}}),m.subscribeKey("remoteFeatures",i=>{this.remoteFeatures=i})),this.authConnector&&this.connectSocial()}disconnectedCallback(){this.unsubscribe.forEach(i=>i()),window.removeEventListener("message",this.handleSocialConnection,!1),!h.state.activeCaipAddress&&this.socialProvider&&!this.connecting&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}}),this.closeSocialWindow()}render(){return a`
      <wui-flex
        data-error=${L(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${L(this.socialProvider)}></wui-logo>
          ${this.error?null:this.loaderTemplate()}
          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="lg-medium" color="primary"
            >Log in with
            <span class="capitalize">${this.socialProvider??"Social"}</span></wui-text
          >
          <wui-text align="center" variant="lg-regular" color=${this.error?"error":"secondary"}
            >${this.message}</wui-text
          ></wui-flex
        >
      </wui-flex>
    `}loaderTemplate(){let e=_.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return a`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}parseURLError(e){try{let i="error=",r=e.indexOf(i);return r===-1?null:e.substring(r+i.length)}catch{return null}}connectSocial(){let e=setInterval(()=>{this.socialWindow?.closed&&(!this.connecting&&w.state.view==="ConnectingSocial"&&w.goBack(),clearInterval(e))},1e3);window.addEventListener("message",this.handleSocialConnection,!1)}updateMessage(){this.error?this.message="Something went wrong":this.connecting?this.message="Retrieving user data":this.message="Connect in the provider window"}handleSocialError(e){this.error=!0,this.updateMessage(),this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:e}}),this.closeSocialWindow()}closeSocialWindow(){this.socialWindow&&(this.socialWindow.close(),h.setAccountProp("socialWindow",void 0,h.state.activeChain))}};y.styles=Q;U([l()],y.prototype,"socialProvider",void 0);U([l()],y.prototype,"socialWindow",void 0);U([l()],y.prototype,"error",void 0);U([l()],y.prototype,"connecting",void 0);U([l()],y.prototype,"message",void 0);U([l()],y.prototype,"remoteFeatures",void 0);y=U([P("w3m-connecting-social-view")],y);c();u();d();c();u();d();var J=S`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:t})=>t.xl};
    animation-timing-function: ${({easings:t})=>t["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: ${({borderRadius:t})=>t[8]};
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
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

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var k=function(t,e,i,r){var s=arguments.length,o=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var p=t.length-1;p>=0;p--)(n=t[p])&&(o=(s<3?n(o):s>3?n(e,i,o):n(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o},O=class extends ${constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.socialProvider=h.getAccountData()?.socialProvider,this.uri=h.getAccountData()?.farcasterUrl,this.ready=!1,this.loading=!1,this.remoteFeatures=m.state.remoteFeatures,this.authConnector=I.getAuthConnector(),this.forceUpdate=()=>{this.requestUpdate()},this.unsubscribe.push(h.subscribeChainProp("accountState",e=>{this.socialProvider=e?.socialProvider,this.uri=e?.farcasterUrl,this.connectFarcaster()}),m.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e})),window.addEventListener("resize",this.forceUpdate)}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.timeout),window.removeEventListener("resize",this.forceUpdate),!h.state.activeCaipAddress&&this.socialProvider&&(this.uri||this.loading)&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_CANCELED",properties:{provider:this.socialProvider}})}render(){return this.onRenderProxy(),a`${this.platformTemplate()}`}platformTemplate(){return g.isMobile()?a`${this.mobileTemplate()}`:a`${this.desktopTemplate()}`}desktopTemplate(){return this.loading?a`${this.loadingTemplate()}`:a`${this.qrTemplate()}`}qrTemplate(){return a` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["0","5","5","5"]}
      gap="5"
    >
      <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

      <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
      ${this.copyTemplate()}
    </wui-flex>`}loadingTemplate(){return a`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["5","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo="farcaster"></wui-logo>
          ${this.loaderTemplate()}
          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="md-medium" color="primary">
            Loading user data
          </wui-text>
          <wui-text align="center" variant="sm-regular" color="secondary">
            Please wait a moment while we load your data.
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}mobileTemplate(){return a` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["10","5","5","5"]}
      gap="5"
    >
      <wui-flex justifyContent="center" alignItems="center">
        <wui-logo logo="farcaster"></wui-logo>
        ${this.loaderTemplate()}
        <wui-icon-box
          color="error"
          icon="close"
          size="sm"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="2">
        <wui-text align="center" variant="md-medium" color="primary"
          >Continue in Farcaster</span></wui-text
        >
        <wui-text align="center" variant="sm-regular" color="secondary"
          >Accept connection request in the app</wui-text
        ></wui-flex
      >
      ${this.mobileLinkTemplate()}
    </wui-flex>`}loaderTemplate(){let e=_.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return a`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}async connectFarcaster(){if(this.authConnector)try{await this.authConnector?.provider.connectFarcaster(),this.socialProvider&&(T.setConnectedSocialProvider(this.socialProvider),f.sendEvent({type:"track",event:"SOCIAL_LOGIN_REQUEST_USER_DATA",properties:{provider:this.socialProvider}})),this.loading=!0;let i=A.getConnections(this.authConnector.chain).length>0;await A.connectExternal(this.authConnector,this.authConnector.chain);let r=this.remoteFeatures?.multiWallet;this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_SUCCESS",properties:{provider:this.socialProvider}}),this.loading=!1,i&&r?(w.replace("ProfileWallets"),E.showSuccess("New Wallet Added")):W.close()}catch(e){this.socialProvider&&f.sendEvent({type:"track",event:"SOCIAL_LOGIN_ERROR",properties:{provider:this.socialProvider,message:g.parseError(e)}}),w.goBack(),E.showError(e)}}mobileLinkTemplate(){return a`<wui-button
      size="md"
      ?loading=${this.loading}
      ?disabled=${!this.uri||this.loading}
      @click=${()=>{this.uri&&g.openHref(this.uri,"_blank")}}
    >
      Open farcaster</wui-button
    >`}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.getBoundingClientRect().width-40,i=_.state.themeVariables["--apkt-qr-color"]??_.state.themeVariables["--w3m-qr-color"];return a` <wui-qr-code
      size=${e}
      theme=${_.state.themeMode}
      uri=${this.uri}
      ?farcaster=${!0}
      data-testid="wui-qr-code"
      color=${L(i)}
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return a`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="sm" color="default" slot="iconRight" name="copy"></wui-icon>
      Copy link
    </wui-button>`}onCopyUri(){try{this.uri&&(g.copyToClopboard(this.uri),E.showSuccess("Link copied"))}catch{E.showError("Failed to copy")}}};O.styles=J;k([l()],O.prototype,"socialProvider",void 0);k([l()],O.prototype,"uri",void 0);k([l()],O.prototype,"ready",void 0);k([l()],O.prototype,"loading",void 0);k([l()],O.prototype,"remoteFeatures",void 0);O=k([P("w3m-connecting-farcaster-view")],O);export{F as W3mConnectSocialsView,O as W3mConnectingFarcasterView,y as W3mConnectingSocialView};
