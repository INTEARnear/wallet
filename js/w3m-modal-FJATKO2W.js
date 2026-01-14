import"./chunk-MCMQDPOW.js";import"./chunk-HNYQOGKW.js";import"./chunk-SB4FWY32.js";import{a as z}from"./chunk-4PLPFPWC.js";import"./chunk-Z3DFHWDZ.js";import"./chunk-7FUATHPM.js";import"./chunk-FB5BNV7C.js";import"./chunk-LW4FQU5S.js";import"./chunk-5BCUXIZJ.js";import"./chunk-BR7S6AGZ.js";import{b as re,c as W,d as ae,e as se,f as ne,h as g}from"./chunk-LTN6YROF.js";import{A as R,B as G,C as B,D as m,E as ie,F as L,I as A,M as x,N as F,P as S,V as K,W as H,f as ee,k as te,r as q,s as O,y as oe,z as U}from"./chunk-N2WXLAZF.js";import"./chunk-X4QP7L3N.js";import"./chunk-N3PRX6SH.js";import{a as _}from"./chunk-B2LU4KHT.js";import{a as y,b as f}from"./chunk-IDZGCU4F.js";import{b,e as p,k as v}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as n,k as l,o as c}from"./chunk-JY5TIRRF.js";n();c();l();n();c();l();n();c();l();n();c();l();n();c();l();var le=b`
  :host {
    display: block;
    border-radius: clamp(0px, var(--wui-border-radius-l), 44px);
    box-shadow: 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-modal-bg);
    overflow: hidden;
  }

  :host([data-embedded='true']) {
    box-shadow:
      0 0 0 1px var(--wui-color-gray-glass-005),
      0px 4px 12px 4px var(--w3m-card-embedded-shadow-color);
  }
`;var Ae=function(s,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(s,e,t,i);else for(var d=s.length-1;d>=0;d--)(a=s[d])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},J=class extends v{render(){return p`<slot></slot>`}};J.styles=[W,le];J=Ae([g("wui-card")],J);n();c();l();n();c();l();n();c();l();n();c();l();var ce=b`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-dark-glass-100);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-325);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
  }

  wui-flex {
    width: 100%;
  }

  wui-text {
    word-break: break-word;
    flex: 1;
  }

  .close {
    cursor: pointer;
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: var(--wui-border-radius-3xs);
    background-color: var(--local-icon-bg-value);
  }
`;var j=function(s,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(s,e,t,i);else for(var d=s.length-1;d>=0;d--)(a=s[d])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},I=class extends v{constructor(){super(...arguments),this.message="",this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="info"}render(){return this.style.cssText=`
      --local-icon-bg-value: var(--wui-color-${this.backgroundColor});
   `,p`
      <wui-flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <wui-flex columnGap="xs" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color=${this.iconColor} size="md" name=${this.icon}></wui-icon>
          </wui-flex>
          <wui-text variant="small-500" color="bg-350" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="bg-350"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){R.close()}};I.styles=[W,ce];j([y()],I.prototype,"message",void 0);j([y()],I.prototype,"backgroundColor",void 0);j([y()],I.prototype,"iconColor",void 0);j([y()],I.prototype,"icon",void 0);I=j([g("wui-alertbar")],I);n();c();l();var de=b`
  :host {
    display: block;
    position: absolute;
    top: var(--wui-spacing-s);
    left: var(--wui-spacing-l);
    right: var(--wui-spacing-l);
    opacity: 0;
    pointer-events: none;
  }
`;var pe=function(s,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(s,e,t,i);else for(var d=s.length-1;d>=0;d--)(a=s[d])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},We={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"exclamationTriangle"}},M=class extends v{constructor(){super(),this.unsubscribe=[],this.open=R.state.open,this.onOpen(!0),this.unsubscribe.push(R.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t}=R.state,i=We[t];return p`
      <wui-alertbar
        message=${e}
        backgroundColor=${i?.backgroundColor}
        iconColor=${i?.iconColor}
        icon=${i?.icon}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};M.styles=de;pe([f()],M.prototype,"open",void 0);M=pe([g("w3m-alertbar")],M);n();c();l();n();c();l();n();c();l();n();c();l();var me=b`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: var(--wui-spacing-xxs);
    gap: var(--wui-spacing-xxs);
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-md);
    border-radius: var(--wui-border-radius-xxs);
  }

  wui-image {
    border-radius: 100%;
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  wui-icon-box {
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  button:active {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var ue=function(s,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(s,e,t,i);else for(var d=s.length-1;d>=0;d--)(a=s[d])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},V=class extends v{constructor(){super(...arguments),this.imageSrc=""}render(){return p`<button>
      ${this.imageTemplate()}
      <wui-icon size="xs" color="fg-200" name="chevronBottom"></wui-icon>
    </button>`}imageTemplate(){return this.imageSrc?p`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`:p`<wui-icon-box
      size="xxs"
      iconColor="fg-200"
      backgroundColor="fg-100"
      background="opaque"
      icon="networkPlaceholder"
    ></wui-icon-box>`}};V.styles=[W,ae,se,me];ue([y()],V.prototype,"imageSrc",void 0);V=ue([g("wui-select")],V);n();c();l();var he=b`
  :host {
    height: 64px;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards var(--wui-ease-out-power-2),
      slide-down-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards var(--wui-ease-out-power-2),
      slide-up-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-icon-link[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;var N=function(s,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(s,e,t,i);else for(var d=s.length-1;d>=0;d--)(a=s[d])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},Te=["SmartSessionList"];function Q(){let s=m.state.data?.connector?.name,e=m.state.data?.wallet?.name,t=m.state.data?.network?.name,i=e??s,r=L.getConnectors();return{Connect:`Connect ${r.length===1&&r[0]?.id==="w3m-email"?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",ConnectingExternal:i??"Connect Wallet",ConnectingWalletConnect:i??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview convert",Downloads:i?`Get ${i}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",ProfileWallets:"Wallets",SwitchNetwork:t??"Switch Network",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select token",SwapPreview:"Preview swap",WalletSend:"Send",WalletSendPreview:"Review send",WalletSendSelectToken:"Select Token",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a wallet?",ConnectWallets:"Connect wallet",ConnectSocials:"All socials",ConnectingSocial:F.state.socialProvider?F.state.socialProvider:"Connect Social",ConnectingMultiChain:"Select chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Payment in progress"}}var C=class extends v{constructor(){super(),this.unsubscribe=[],this.heading=Q()[m.state.view],this.network=x.state.activeCaipNetwork,this.networkImage=U.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=m.state.view,this.viewDirection="",this.headerText=Q()[m.state.view],this.unsubscribe.push(oe.subscribeNetworkImages(()=>{this.networkImage=U.getNetworkImage(this.network)}),m.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.headerText=Q()[e]},z.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),x.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=U.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){return p`
      <wui-flex .padding=${this.getPadding()} justifyContent="space-between" alignItems="center">
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){G.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),m.push("WhatIsAWallet")}async onClose(){await H.safeClose()}rightHeaderTemplate(){let e=O?.state?.features?.smartSessions;return m.state.view!=="Account"||!e?this.closeButtonTemplate():p`<wui-flex>
      <wui-icon-link
        icon="clock"
        @click=${()=>m.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-link>
      ${this.closeButtonTemplate()}
    </wui-flex> `}closeButtonTemplate(){return p`
      <wui-icon-link
        icon="close"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-link>
    `}titleTemplate(){let e=Te.includes(this.view);return p`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="xs"
      >
        <wui-text variant="paragraph-700" color="fg-100" data-testid="w3m-header-text"
          >${this.headerText}</wui-text
        >
        ${e?p`<wui-tag variant="main">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){let{view:e}=m.state,t=e==="Connect",i=O.state.enableEmbedded,r=e==="ApproveTransaction",o=e==="ConnectingSiwe",a=e==="Account",d=O.state.enableNetworkSwitch,D=r||o||t&&i;return a&&d?p`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${_(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${_(this.networkImage)}
      ></wui-select>`:this.showBack&&!D?p`<wui-icon-link
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-link>`:p`<wui-icon-link
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-link>`}onNetworks(){this.isAllowedNetworkSwitch()&&(G.sendEvent({type:"track",event:"CLICK_NETWORKS"}),m.push("Networks"))}isAllowedNetworkSwitch(){let e=x.getAllRequestedCaipNetworks(),t=e?e.length>1:!1,i=e?.find(({id:r})=>r===this.network?.id);return t||!i}getPadding(){return this.heading?["l","2l","l","2l"]:["0","2l","0","2l"]}onViewChange(){let{history:e}=m.state,t=z.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=z.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){let{history:e}=m.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){m.goBack()}};C.styles=he;N([f()],C.prototype,"heading",void 0);N([f()],C.prototype,"network",void 0);N([f()],C.prototype,"networkImage",void 0);N([f()],C.prototype,"showBack",void 0);N([f()],C.prototype,"prevHistoryLength",void 0);N([f()],C.prototype,"view",void 0);N([f()],C.prototype,"viewDirection",void 0);N([f()],C.prototype,"headerText",void 0);C=N([g("w3m-header")],C);n();c();l();n();c();l();n();c();l();n();c();l();var we=b`
  :host {
    display: flex;
    column-gap: var(--wui-spacing-s);
    align-items: center;
    padding: var(--wui-spacing-xs) var(--wui-spacing-m) var(--wui-spacing-xs) var(--wui-spacing-xs);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-gray-glass-005);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-175);
    box-shadow:
      0px 14px 64px -4px rgba(0, 0, 0, 0.15),
      0px 8px 22px -6px rgba(0, 0, 0, 0.15);

    max-width: 300px;
  }

  :host wui-loading-spinner {
    margin-left: var(--wui-spacing-3xs);
  }
`;var P=function(s,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(s,e,t,i);else for(var d=s.length-1;d>=0;d--)(a=s[d])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},E=class extends v{constructor(){super(...arguments),this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="checkmark",this.message="",this.loading=!1,this.iconType="default"}render(){return p`
      ${this.templateIcon()}
      <wui-text variant="paragraph-500" color="fg-100" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return this.loading?p`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:this.iconType==="default"?p`<wui-icon size="xl" color=${this.iconColor} name=${this.icon}></wui-icon>`:p`<wui-icon-box
      size="sm"
      iconSize="xs"
      iconColor=${this.iconColor}
      backgroundColor=${this.backgroundColor}
      icon=${this.icon}
      background="opaque"
    ></wui-icon-box>`}};E.styles=[W,we];P([y()],E.prototype,"backgroundColor",void 0);P([y()],E.prototype,"iconColor",void 0);P([y()],E.prototype,"icon",void 0);P([y()],E.prototype,"message",void 0);P([y()],E.prototype,"loading",void 0);P([y()],E.prototype,"iconType",void 0);E=P([g("wui-snackbar")],E);n();c();l();var fe=b`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var ge=function(s,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(s,e,t,i);else for(var d=s.length-1;d>=0;d--)(a=s[d])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},Oe={loading:void 0,success:{backgroundColor:"success-100",iconColor:"success-100",icon:"checkmark"},error:{backgroundColor:"error-100",iconColor:"error-100",icon:"close"}},Y=class extends v{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=A.state.open,this.unsubscribe.push(A.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t,svg:i}=A.state,r=Oe[t],{icon:o,iconColor:a}=i??r??{};return p`
      <wui-snackbar
        message=${e}
        backgroundColor=${r?.backgroundColor}
        iconColor=${a}
        icon=${o}
        .loading=${t==="loading"}
      ></wui-snackbar>
    `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),A.state.autoClose&&(this.timeout=setTimeout(()=>A.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};Y.styles=fe;ge([f()],Y.prototype,"open",void 0);Y=ge([g("w3m-snackbar")],Y);n();c();l();var be=b`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation: zoom-in 0.2s var(--wui-ease-out-power-2);
    animation-fill-mode: backwards;
    outline: none;
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host(.appkit-modal) wui-card {
    max-width: 400px;
  }

  wui-card[shake='true'] {
    animation:
      zoom-in 0.2s var(--wui-ease-out-power-2),
      w3m-shake 0.5s var(--wui-ease-out-power-2);
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: var(--local-border-bottom-mobile-radius);
      border-bottom-right-radius: var(--local-border-bottom-mobile-radius);
      border-bottom: none;
      animation: slide-in 0.2s var(--wui-ease-out-power-2);
    }

    wui-card[shake='true'] {
      animation:
        slide-in 0.2s var(--wui-ease-out-power-2),
        w3m-shake 0.5s var(--wui-ease-out-power-2);
    }
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes w3m-view-height {
    from {
      height: var(--prev-height);
    }
    to {
      height: var(--new-height);
    }
  }
`;var T=function(s,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(s,e,t,i);else for(var d=s.length-1;d>=0;d--)(a=s[d])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},ve="scroll-lock",k=class extends v{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=O.state.enableEmbedded,this.open=S.state.open,this.caipAddress=x.state.activeCaipAddress,this.caipNetwork=x.state.activeCaipNetwork,this.shake=S.state.shake,this.filterByNamespace=L.state.filterByNamespace,this.initializeTheming(),B.prefetchAnalyticsConfig(),this.unsubscribe.push(S.subscribeKey("open",e=>e?this.onOpen():this.onClose()),S.subscribeKey("shake",e=>this.shake=e),x.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),x.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),O.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),L.subscribeKey("filterByNamespace",e=>{this.filterByNamespace!==e&&!x.getAccountData(e)?.caipAddress&&(B.fetchRecommendedWallets(),this.filterByNamespace=e)}))}firstUpdated(){if(this.caipAddress){if(this.enableEmbedded){S.close(),this.prefetch();return}this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.style.cssText=`
      --local-border-bottom-mobile-radius: ${this.enableEmbedded?"clamp(0px, var(--wui-border-radius-l), 44px)":"0px"};
    `,this.enableEmbedded?p`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?p`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return p` <wui-card
      shake="${this.shake}"
      data-embedded="${_(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){await H.safeClose()}initializeTheming(){let{themeVariables:e,themeMode:t}=ie.state,i=ne.getColorTheme(t);re(e,i)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),A.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){let e=document.createElement("style");e.dataset.w3m=ve,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){let e=document.head.querySelector(`style[data-w3m="${ve}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;let e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if(t.key==="Escape")this.handleClose();else if(t.key==="Tab"){let{tagName:i}=t.target;i&&!i.includes("W3M-")&&!i.includes("WUI-")&&e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){let t=x.state.isSwitchingNamespace,i=!q.getPlainAddress(this.caipAddress),r=q.getPlainAddress(e),o=await K.getAllSessions(),a=e&&K.getSIWX()?o.some(X=>X.data.accountAddress===te.parseCaipAddress(e)?.address):!0,d=!r&&!t,D=t&&r&&a;m.state.view==="ProfileWallets"||(d&&!this.enableEmbedded?S.close():D&&!this.enableEmbedded?m.goBack():this.enableEmbedded&&i&&r&&S.close()),await K.initializeIfEnabled(),this.caipAddress=e,x.setIsSwitchingNamespace(!1)}onNewNetwork(e){let t=this.caipNetwork,i=t?.caipNetworkId?.toString(),r=t?.chainNamespace,o=e?.caipNetworkId?.toString(),a=e?.chainNamespace,d=i!==o,Z=d&&!(r!==a),X=t?.name===ee.UNSUPPORTED_NETWORK_NAME,Ce=m.state.view==="ConnectingExternal",ke=m.state.view==="ProfileWallets",Se=!x.getAccountData(e?.chainNamespace)?.caipAddress,Ne=m.state.view==="UnsupportedChain",Ee=S.state.open,$=!1;this.enableEmbedded&&m.state.view==="SwitchNetwork"&&($=!0),Ee&&!Ce&&!ke&&(Se?d&&($=!0):(Ne||Z&&!X)&&($=!0)),$&&m.state.view!=="SIWXSignMessage"&&m.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(B.prefetch(),B.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}};k.styles=be;T([y({type:Boolean})],k.prototype,"enableEmbedded",void 0);T([f()],k.prototype,"open",void 0);T([f()],k.prototype,"caipAddress",void 0);T([f()],k.prototype,"caipNetwork",void 0);T([f()],k.prototype,"shake",void 0);T([f()],k.prototype,"filterByNamespace",void 0);var ye=class extends k{};ye=T([g("w3m-modal")],ye);var xe=class extends k{};xe=T([g("appkit-modal")],xe);export{xe as AppKitModal,ye as W3mModal,k as W3mModalBase};
