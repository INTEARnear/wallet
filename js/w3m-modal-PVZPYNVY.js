import"./chunk-FHO645T3.js";import"./chunk-KW43YUNH.js";import"./chunk-N5247CTU.js";import{a as _}from"./chunk-ZFRNME6I.js";import"./chunk-IW7VF4EG.js";import"./chunk-NN4K4YIW.js";import"./chunk-JEGJJ3CB.js";import"./chunk-WQMDXFUC.js";import"./chunk-J4VZ2IKP.js";import"./chunk-37JX4LZT.js";import{D as w,F as U,H as x,N as G,O as P,Q as X,R as C,S as F,T as J,U as Q,W as p,b as M,k as Y,l as S,m as V,n as $,o as A,p as D,q as W,r as c,s as q,t as O,z as y}from"./chunk-ORERQN7J.js";import{a as h,b as d,g as T}from"./chunk-G6MGL5IE.js";import"./chunk-YDPF4UGR.js";import"./chunk-F3BT2OCD.js";import"./chunk-OIFNSKKM.js";import"./chunk-YY5EM6U5.js";import"./chunk-LHWHJQRC.js";import"./chunk-JJVWQEYF.js";import"./chunk-JGRP444H.js";import"./chunk-URLXKBQX.js";import"./chunk-FFQJ55XB.js";import"./chunk-6K56CBXQ.js";import{b as m,e as l,j as u}from"./chunk-WGWCH7J2.js";import"./chunk-57YRCRKT.js";var Z=m`
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
`;var ve=function(n,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(n,e,t,i);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},K=class extends u{render(){return l`<slot></slot>`}};K.styles=[C,Z];K=ve([p("wui-card")],K);var ee=m`
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
`;var R=function(n,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(n,e,t,i);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},N=class extends u{constructor(){super(...arguments),this.message="",this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="info"}render(){return this.style.cssText=`
      --local-icon-bg-value: var(--wui-color-${this.backgroundColor});
   `,l`
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
    `}onClose(){A.close()}};N.styles=[C,ee];R([h()],N.prototype,"message",void 0);R([h()],N.prototype,"backgroundColor",void 0);R([h()],N.prototype,"iconColor",void 0);R([h()],N.prototype,"icon",void 0);N=R([p("wui-alertbar")],N);var te=m`
  :host {
    display: block;
    position: absolute;
    top: var(--wui-spacing-s);
    left: var(--wui-spacing-l);
    right: var(--wui-spacing-l);
    opacity: 0;
    pointer-events: none;
  }
`;var oe=function(n,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(n,e,t,i);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},ye={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"exclamationTriangle"}},B=class extends u{constructor(){super(),this.unsubscribe=[],this.open=A.state.open,this.onOpen(!0),this.unsubscribe.push(A.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t}=A.state,i=ye[t];return l`
      <wui-alertbar
        message=${e}
        backgroundColor=${i?.backgroundColor}
        iconColor=${i?.iconColor}
        icon=${i?.icon}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};B.styles=te;oe([d()],B.prototype,"open",void 0);B=oe([p("w3m-alertbar")],B);var ie=m`
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
`;var re=function(n,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(n,e,t,i);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},L=class extends u{constructor(){super(...arguments),this.imageSrc=""}render(){return l`<button>
      ${this.imageTemplate()}
      <wui-icon size="xs" color="fg-200" name="chevronBottom"></wui-icon>
    </button>`}imageTemplate(){return this.imageSrc?l`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`:l`<wui-icon-box
      size="xxs"
      iconColor="fg-200"
      backgroundColor="fg-100"
      background="opaque"
      icon="networkPlaceholder"
    ></wui-icon-box>`}};L.styles=[C,F,J,ie];re([h()],L.prototype,"imageSrc",void 0);L=re([p("wui-select")],L);var ae=m`
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
`;var b=function(n,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(n,e,t,i);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},xe=["SmartSessionList"];function H(){let n=c.state.data?.connector?.name,e=c.state.data?.wallet?.name,t=c.state.data?.network?.name,i=e??n,r=O.getConnectors();return{Connect:`Connect ${r.length===1&&r[0]?.id==="w3m-email"?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",ConnectingExternal:i??"Connect Wallet",ConnectingWalletConnect:i??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview convert",Downloads:i?`Get ${i}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Pay:"How you pay",Profile:void 0,SwitchNetwork:t??"Switch Network",SwitchAddress:"Switch Address",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select token",SwapPreview:"Preview swap",WalletSend:"Send",WalletSendPreview:"Review send",WalletSendSelectToken:"Select Token",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a wallet?",ConnectWallets:"Connect wallet",ConnectSocials:"All socials",ConnectingSocial:U.state.socialProvider?U.state.socialProvider:"Connect Social",ConnectingMultiChain:"Select chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In",PayLoading:"Payment in progress"}}var f=class extends u{constructor(){super(),this.unsubscribe=[],this.heading=H()[c.state.view],this.network=w.state.activeCaipNetwork,this.networkImage=$.getNetworkImage(this.network),this.showBack=!1,this.prevHistoryLength=1,this.view=c.state.view,this.viewDirection="",this.headerText=H()[c.state.view],this.unsubscribe.push(V.subscribeNetworkImages(()=>{this.networkImage=$.getNetworkImage(this.network)}),c.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.headerText=H()[e]},_.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),w.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=$.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){return l`
      <wui-flex .padding=${this.getPadding()} justifyContent="space-between" alignItems="center">
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){D.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),c.push("WhatIsAWallet")}async onClose(){await P.safeClose()}rightHeaderTemplate(){let e=S?.state?.features?.smartSessions;return c.state.view!=="Account"||!e?this.closeButtonTemplate():l`<wui-flex>
      <wui-icon-link
        icon="clock"
        @click=${()=>c.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-link>
      ${this.closeButtonTemplate()}
    </wui-flex> `}closeButtonTemplate(){return l`
      <wui-icon-link
        icon="close"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-link>
    `}titleTemplate(){let e=xe.includes(this.view);return l`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="xs"
      >
        <wui-text variant="paragraph-700" color="fg-100" data-testid="w3m-header-text"
          >${this.headerText}</wui-text
        >
        ${e?l`<wui-tag variant="main">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){let{view:e}=c.state,t=e==="Connect",i=S.state.enableEmbedded,r=e==="ApproveTransaction",o=e==="ConnectingSiwe",a=e==="Account",s=S.state.enableNetworkSwitch,z=r||o||t&&i;return a&&s?l`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${T(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${T(this.networkImage)}
      ></wui-select>`:this.showBack&&!z?l`<wui-icon-link
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-link>`:l`<wui-icon-link
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-link>`}onNetworks(){this.isAllowedNetworkSwitch()&&(D.sendEvent({type:"track",event:"CLICK_NETWORKS"}),c.push("Networks"))}isAllowedNetworkSwitch(){let e=w.getAllRequestedCaipNetworks(),t=e?e.length>1:!1,i=e?.find(({id:r})=>r===this.network?.id);return t||!i}getPadding(){return this.heading?["l","2l","l","2l"]:["0","2l","0","2l"]}onViewChange(){let{history:e}=c.state,t=_.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=_.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){let{history:e}=c.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){c.goBack()}};f.styles=ae;b([d()],f.prototype,"heading",void 0);b([d()],f.prototype,"network",void 0);b([d()],f.prototype,"networkImage",void 0);b([d()],f.prototype,"showBack",void 0);b([d()],f.prototype,"prevHistoryLength",void 0);b([d()],f.prototype,"view",void 0);b([d()],f.prototype,"viewDirection",void 0);b([d()],f.prototype,"headerText",void 0);f=b([p("w3m-header")],f);var ne=m`
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
`;var E=function(n,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(n,e,t,i);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},v=class extends u{constructor(){super(...arguments),this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="checkmark",this.message="",this.loading=!1,this.iconType="default"}render(){return l`
      ${this.templateIcon()}
      <wui-text variant="paragraph-500" color="fg-100" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return this.loading?l`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:this.iconType==="default"?l`<wui-icon size="xl" color=${this.iconColor} name=${this.icon}></wui-icon>`:l`<wui-icon-box
      size="sm"
      iconSize="xs"
      iconColor=${this.iconColor}
      backgroundColor=${this.backgroundColor}
      icon=${this.icon}
      background="opaque"
    ></wui-icon-box>`}};v.styles=[C,ne];E([h()],v.prototype,"backgroundColor",void 0);E([h()],v.prototype,"iconColor",void 0);E([h()],v.prototype,"icon",void 0);E([h()],v.prototype,"message",void 0);E([h()],v.prototype,"loading",void 0);E([h()],v.prototype,"iconType",void 0);v=E([p("wui-snackbar")],v);var se=m`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;var le=function(n,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(n,e,t,i);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},Ce={loading:void 0,success:{backgroundColor:"success-100",iconColor:"success-100",icon:"checkmark"},error:{backgroundColor:"error-100",iconColor:"error-100",icon:"close"}},j=class extends u{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=y.state.open,this.unsubscribe.push(y.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t,svg:i}=y.state,r=Ce[t],{icon:o,iconColor:a}=i??r??{};return l`
      <wui-snackbar
        message=${e}
        backgroundColor=${r?.backgroundColor}
        iconColor=${a}
        icon=${o}
        .loading=${t==="loading"}
      ></wui-snackbar>
    `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),y.state.autoClose&&(this.timeout=setTimeout(()=>y.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};j.styles=se;le([d()],j.prototype,"open",void 0);j=le([p("w3m-snackbar")],j);var ce=m`
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
`;var k=function(n,e,t,i){var r=arguments.length,o=r<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,t):i,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(n,e,t,i);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(o=(r<3?a(o):r>3?a(e,t,o):a(e,t))||o);return r>3&&o&&Object.defineProperty(e,t,o),o},de="scroll-lock",g=class extends u{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=S.state.enableEmbedded,this.open=x.state.open,this.caipAddress=w.state.activeCaipAddress,this.caipNetwork=w.state.activeCaipNetwork,this.shake=x.state.shake,this.filterByNamespace=O.state.filterByNamespace,this.initializeTheming(),W.prefetchAnalyticsConfig(),this.unsubscribe.push(x.subscribeKey("open",e=>e?this.onOpen():this.onClose()),x.subscribeKey("shake",e=>this.shake=e),w.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),w.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),S.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),O.subscribeKey("filterByNamespace",e=>{this.filterByNamespace!==e&&!w.getAccountData(e)?.caipAddress&&(W.fetchRecommendedWallets(),this.filterByNamespace=e)}))}firstUpdated(){if(this.caipAddress){if(this.enableEmbedded){x.close(),this.prefetch();return}this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.style.cssText=`
      --local-border-bottom-mobile-radius: ${this.enableEmbedded?"clamp(0px, var(--wui-border-radius-l), 44px)":"0px"};
    `,this.enableEmbedded?l`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?l`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return l` <wui-card
      shake="${this.shake}"
      data-embedded="${T(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){await P.safeClose()}initializeTheming(){let{themeVariables:e,themeMode:t}=q.state,i=Q.getColorTheme(t);X(e,i)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),y.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){let e=document.createElement("style");e.dataset.w3m=de,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){let e=document.head.querySelector(`style[data-w3m="${de}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;let e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if(t.key==="Escape")this.handleClose();else if(t.key==="Tab"){let{tagName:i}=t.target;i&&!i.includes("W3M-")&&!i.includes("WUI-")&&e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){let t=w.state.isSwitchingNamespace,i=Y.getPlainAddress(e);!i&&!t?x.close():t&&i&&c.goBack(),await G.initializeIfEnabled(),this.caipAddress=e,w.setIsSwitchingNamespace(!1)}onNewNetwork(e){let t=this.caipNetwork,i=t?.caipNetworkId?.toString(),r=t?.chainNamespace,o=e?.caipNetworkId?.toString(),a=e?.chainNamespace,s=i!==o,ue=s&&!(r!==a),he=t?.name===M.UNSUPPORTED_NETWORK_NAME,we=c.state.view==="ConnectingExternal",fe=!w.getAccountData(e?.chainNamespace)?.caipAddress,ge=c.state.view==="UnsupportedChain",be=x.state.open,I=!1;be&&!we&&(fe?s&&(I=!0):(ge||ue&&!he)&&(I=!0)),I&&c.state.view!=="SIWXSignMessage"&&c.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(W.prefetch(),W.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}};g.styles=ce;k([h({type:Boolean})],g.prototype,"enableEmbedded",void 0);k([d()],g.prototype,"open",void 0);k([d()],g.prototype,"caipAddress",void 0);k([d()],g.prototype,"caipNetwork",void 0);k([d()],g.prototype,"shake",void 0);k([d()],g.prototype,"filterByNamespace",void 0);var pe=class extends g{};pe=k([p("w3m-modal")],pe);var me=class extends g{};me=k([p("appkit-modal")],me);export{me as AppKitModal,pe as W3mModal,g as W3mModalBase};
