import"./chunk-NB5VTDOC.js";import{a as Ki}from"./chunk-FZJ6SZKP.js";import{a as sn}from"./chunk-MCMQDPOW.js";import{a as bt,b as ct}from"./chunk-A7U5I7FQ.js";import"./chunk-FLWML4UJ.js";import"./chunk-HNYQOGKW.js";import"./chunk-SB4FWY32.js";import"./chunk-QKQFBXVX.js";import{a as Vi}from"./chunk-6VWVZVQM.js";import{a as li}from"./chunk-4PLPFPWC.js";import{b as Fi}from"./chunk-ECJO7S2V.js";import{a as zi,c as K,e as Mi}from"./chunk-W4MYE3I6.js";import"./chunk-XXHZ5HCE.js";import"./chunk-Z3DFHWDZ.js";import"./chunk-SR42VORX.js";import"./chunk-WZ3HYXL6.js";import"./chunk-LHEW5XIO.js";import"./chunk-KR2VX4XO.js";import"./chunk-S5GLPWFJ.js";import"./chunk-MMHKZM43.js";import"./chunk-PLV3PJVC.js";import"./chunk-3CHQQAWX.js";import"./chunk-HANOCJWG.js";import"./chunk-ONZEZPXK.js";import"./chunk-25YBDBEP.js";import"./chunk-6EMLP2SS.js";import"./chunk-DW5UEWXF.js";import"./chunk-MIJMXO74.js";import"./chunk-3IF2M6VT.js";import"./chunk-7FUATHPM.js";import"./chunk-YYMQ6HDD.js";import"./chunk-FB5BNV7C.js";import"./chunk-LW4FQU5S.js";import"./chunk-5BCUXIZJ.js";import"./chunk-BR7S6AGZ.js";import{a as Yt,c as W,d as N,e as Hi,f as B,h}from"./chunk-LTN6YROF.js";import{A as Ui,B as T,C as L,D as y,E as pe,F as $,G as tt,H as Wt,I as O,K as S,L as ji,M as x,N as _,O as Bi,P as j,U as qt,V as ai,f as k,j as Di,k as Pi,p as M,q as F,r as E,s as A,x as V,y as lt,z as I}from"./chunk-N2WXLAZF.js";import"./chunk-X4QP7L3N.js";import"./chunk-MWGMXHZG.js";import{a as Kt,b as Gt}from"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-GLIZJUBT.js";import{a as v}from"./chunk-B2LU4KHT.js";import{a as d,b as m,f as ue}from"./chunk-IDZGCU4F.js";import{b as C,e as l,k as b}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as c,k as u,o as p}from"./chunk-JY5TIRRF.js";c();p();u();c();p();u();c();p();u();c();p();u();c();p();u();var Gi=C`
  :host {
    display: block;
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
    background: var(--wui-color-gray-glass-002);
    display: flex;
    gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-3xs) var(--wui-spacing-xs) var(--wui-spacing-3xs)
      var(--wui-spacing-xs);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  button:disabled {
    background: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-image,
  button:disabled > wui-flex > wui-avatar {
    filter: grayscale(1);
  }

  button:has(wui-image) {
    padding: var(--wui-spacing-3xs) var(--wui-spacing-3xs) var(--wui-spacing-3xs)
      var(--wui-spacing-xs);
  }

  wui-text {
    color: var(--wui-color-fg-100);
  }

  wui-flex > wui-text {
    color: var(--wui-color-fg-200);
  }

  wui-image,
  wui-icon-box {
    border-radius: var(--wui-border-radius-3xl);
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  wui-flex {
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-005);
    background: var(--wui-color-gray-glass-005);
    padding: 4px var(--wui-spacing-m) 4px var(--wui-spacing-xxs);
  }

  button.local-no-balance {
    border-radius: 0px;
    border: none;
    background: transparent;
  }

  wui-avatar {
    width: 20px;
    height: 20px;
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-010);
  }

  @media (max-width: 500px) {
    button {
      gap: 0px;
      padding: var(--wui-spacing-3xs) var(--wui-spacing-xs) !important;
      height: 32px;
    }
    wui-image,
    wui-icon-box,
    button > wui-text {
      visibility: hidden;
      width: 0px;
      height: 0px;
    }
    button {
      border-radius: 0px;
      border: none;
      background: transparent;
      padding: 0px;
    }
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled > wui-flex > wui-text {
      color: var(--wui-color-fg-175);
    }

    button:active:enabled > wui-flex > wui-text {
      color: var(--wui-color-fg-175);
    }
  }
`;var xt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ut=class extends b{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.balance=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.loading=!1,this.address="",this.profileName="",this.charsStart=4,this.charsEnd=6}render(){return l`
      <button
        ?disabled=${this.disabled}
        class=${v(this.balance?void 0:"local-no-balance")}
      >
        ${this.balanceTemplate()}
        <wui-flex gap="xxs" alignItems="center">
          <wui-avatar
            .imageSrc=${this.avatarSrc}
            alt=${this.address}
            address=${this.address}
          ></wui-avatar>
          <wui-text variant="paragraph-600" color="inherit">
            ${this.address?B.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"}):null}
          </wui-text>
        </wui-flex>
      </button>
    `}balanceTemplate(){if(this.isUnsupportedChain)return l` <wui-icon-box
          size="sm"
          iconColor="error-100"
          backgroundColor="error-100"
          icon="warningCircle"
          data-testid="wui-account-button-unsupported-chain"
        ></wui-icon-box>
        <wui-text variant="paragraph-600" color="inherit"> Switch Network</wui-text>`;if(this.balance){let t=this.networkSrc?l`<wui-image src=${this.networkSrc}></wui-image>`:l`
            <wui-icon-box
              size="sm"
              iconColor="fg-200"
              backgroundColor="fg-300"
              icon="networkPlaceholder"
            ></wui-icon-box>
          `,i=this.loading?l`<wui-loading-spinner size="md" color="fg-200"></wui-loading-spinner>`:l`<wui-text variant="paragraph-600" color="inherit"> ${this.balance}</wui-text>`;return l`${t} ${i}`}return null}};ut.styles=[W,N,Gi];xt([d()],ut.prototype,"networkSrc",void 0);xt([d()],ut.prototype,"avatarSrc",void 0);xt([d()],ut.prototype,"balance",void 0);xt([d({type:Boolean})],ut.prototype,"isUnsupportedChain",void 0);xt([d({type:Boolean})],ut.prototype,"disabled",void 0);xt([d({type:Boolean})],ut.prototype,"loading",void 0);xt([d()],ut.prototype,"address",void 0);xt([d()],ut.prototype,"profileName",void 0);xt([d()],ut.prototype,"charsStart",void 0);xt([d()],ut.prototype,"charsEnd",void 0);ut=xt([h("wui-account-button")],ut);var Z=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},G=class extends b{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance="show",this.charsStart=4,this.charsEnd=6,this.namespace=void 0,this.isSupported=A.state.allowUnsupportedChain?!0:x.state.activeChain?x.checkIfSupportedNetwork(x.state.activeChain):!0}connectedCallback(){super.connectedCallback(),this.setAccountData(x.getAccountData(this.namespace)),this.setNetworkData(x.getNetworkData(this.namespace))}firstUpdated(){let t=this.namespace;t?this.unsubscribe.push(x.subscribeChainProp("accountState",i=>{this.setAccountData(i)},t),x.subscribeChainProp("networkState",i=>{this.setNetworkData(i),this.isSupported=x.checkIfSupportedNetwork(t,i?.caipNetwork)},t)):this.unsubscribe.push(lt.subscribeNetworkImages(()=>{this.networkImage=I.getNetworkImage(this.network)}),x.subscribeKey("activeCaipAddress",i=>{this.caipAddress=i}),_.subscribeKey("balance",i=>this.balanceVal=i),_.subscribeKey("balanceSymbol",i=>this.balanceSymbol=i),_.subscribeKey("profileName",i=>this.profileName=i),_.subscribeKey("profileImage",i=>this.profileImage=i),x.subscribeKey("activeCaipNetwork",i=>{this.network=i,this.networkImage=I.getNetworkImage(i),this.isSupported=i?.chainNamespace?x.checkIfSupportedNetwork(i?.chainNamespace):!0,this.fetchNetworkImage(i)}))}updated(){this.fetchNetworkImage(this.network)}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(!x.state.activeChain)return null;let t=this.balance==="show",i=typeof this.balanceVal!="string";return l`
      <wui-account-button
        .disabled=${!!this.disabled}
        .isUnsupportedChain=${A.state.allowUnsupportedChain?!1:!this.isSupported}
        address=${v(E.getPlainAddress(this.caipAddress))}
        profileName=${v(this.profileName)}
        networkSrc=${v(this.networkImage)}
        avatarSrc=${v(this.profileImage)}
        balance=${t?E.formatBalance(this.balanceVal,this.balanceSymbol):""}
        @click=${this.onClick.bind(this)}
        data-testid=${`account-button${this.namespace?`-${this.namespace}`:""}`}
        .charsStart=${this.charsStart}
        .charsEnd=${this.charsEnd}
        ?loading=${i}
      >
      </wui-account-button>
    `}onClick(){this.isSupported||A.state.allowUnsupportedChain?j.open({namespace:this.namespace}):j.open({view:"UnsupportedChain"})}async fetchNetworkImage(t){t?.assets?.imageId&&(this.networkImage=await I.fetchNetworkImage(t?.assets?.imageId))}setAccountData(t){t&&(this.caipAddress=t.caipAddress,this.balanceVal=t.balance,this.balanceSymbol=t.balanceSymbol,this.profileName=t.profileName,this.profileImage=t.profileImage)}setNetworkData(t){t&&(this.network=t.caipNetwork,this.networkImage=I.getNetworkImage(t.caipNetwork))}};Z([d({type:Boolean})],G.prototype,"disabled",void 0);Z([d()],G.prototype,"balance",void 0);Z([d()],G.prototype,"charsStart",void 0);Z([d()],G.prototype,"charsEnd",void 0);Z([d()],G.prototype,"namespace",void 0);Z([m()],G.prototype,"caipAddress",void 0);Z([m()],G.prototype,"balanceVal",void 0);Z([m()],G.prototype,"balanceSymbol",void 0);Z([m()],G.prototype,"profileName",void 0);Z([m()],G.prototype,"profileImage",void 0);Z([m()],G.prototype,"network",void 0);Z([m()],G.prototype,"networkImage",void 0);Z([m()],G.prototype,"isSupported",void 0);var qi=class extends G{};qi=Z([h("w3m-account-button")],qi);var Yi=class extends G{};Yi=Z([h("appkit-account-button")],Yi);c();p();u();c();p();u();var Xi=C`
  :host {
    display: block;
    width: max-content;
  }
`;var vt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},et=class extends b{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance=void 0,this.size=void 0,this.label=void 0,this.loadingLabel=void 0,this.charsStart=4,this.charsEnd=6,this.namespace=void 0}connectedCallback(){super.connectedCallback(),this.caipAddress=this.namespace?x.state.chains.get(this.namespace)?.accountState?.caipAddress:x.state.activeCaipAddress}firstUpdated(){this.namespace?this.unsubscribe.push(x.subscribeChainProp("accountState",t=>{this.caipAddress=t?.caipAddress},this.namespace)):this.unsubscribe.push(x.subscribeKey("activeCaipAddress",t=>this.caipAddress=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return this.caipAddress?l`
          <appkit-account-button
            .disabled=${!!this.disabled}
            balance=${v(this.balance)}
            .charsStart=${v(this.charsStart)}
            .charsEnd=${v(this.charsEnd)}
            namespace=${v(this.namespace)}
          >
          </appkit-account-button>
        `:l`
          <appkit-connect-button
            size=${v(this.size)}
            label=${v(this.label)}
            loadingLabel=${v(this.loadingLabel)}
            namespace=${v(this.namespace)}
          ></appkit-connect-button>
        `}};et.styles=Xi;vt([d({type:Boolean})],et.prototype,"disabled",void 0);vt([d()],et.prototype,"balance",void 0);vt([d()],et.prototype,"size",void 0);vt([d()],et.prototype,"label",void 0);vt([d()],et.prototype,"loadingLabel",void 0);vt([d()],et.prototype,"charsStart",void 0);vt([d()],et.prototype,"charsEnd",void 0);vt([d()],et.prototype,"namespace",void 0);vt([m()],et.prototype,"caipAddress",void 0);var Qi=class extends et{};Qi=vt([h("w3m-button")],Qi);var Zi=class extends et{};Zi=vt([h("appkit-button")],Zi);c();p();u();c();p();u();c();p();u();c();p();u();var Ji=C`
  :host {
    position: relative;
    display: block;
  }

  button {
    background: var(--wui-color-accent-100);
    border: 1px solid var(--wui-color-gray-glass-010);
    border-radius: var(--wui-border-radius-m);
    gap: var(--wui-spacing-xs);
  }

  button.loading {
    background: var(--wui-color-gray-glass-010);
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  button:disabled > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button:active:enabled {
      background-color: var(--wui-color-accent-080);
    }
  }

  button:focus-visible {
    border: 1px solid var(--wui-color-gray-glass-010);
    background-color: var(--wui-color-accent-090);
    -webkit-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  button[data-size='sm'] {
    padding: 6.75px 10px 7.25px;
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
    color: var(--wui-color-inverse-100);
  }

  button[data-size='md'] {
    padding: 9px var(--wui-spacing-l) 9px var(--wui-spacing-l);
  }

  button[data-size='md'] + wui-text {
    padding-left: var(--wui-spacing-3xs);
  }

  @media (max-width: 500px) {
    button[data-size='md'] {
      height: 32px;
      padding: 5px 12px;
    }

    button[data-size='md'] > wui-text > slot {
      font-size: 14px !important;
    }
  }

  wui-loading-spinner {
    width: 14px;
    height: 14px;
  }

  wui-loading-spinner::slotted(svg) {
    width: 10px !important;
    height: 10px !important;
  }

  button[data-size='sm'] > wui-loading-spinner {
    width: 12px;
    height: 12px;
  }
`;var ci=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},de=class extends b{constructor(){super(...arguments),this.size="md",this.loading=!1}render(){let t=this.size==="md"?"paragraph-600":"small-600";return l`
      <button data-size=${this.size} ?disabled=${this.loading}>
        ${this.loadingTemplate()}
        <wui-text variant=${t} color=${this.loading?"accent-100":"inherit"}>
          <slot></slot>
        </wui-text>
      </button>
    `}loadingTemplate(){return this.loading?l`<wui-loading-spinner size=${this.size} color="accent-100"></wui-loading-spinner>`:null}};de.styles=[W,N,Ji];ci([d()],de.prototype,"size",void 0);ci([d({type:Boolean})],de.prototype,"loading",void 0);de=ci([h("wui-connect-button")],de);var Nt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Et=class extends b{constructor(){super(),this.unsubscribe=[],this.size="md",this.label="Connect Wallet",this.loadingLabel="Connecting...",this.open=j.state.open,this.loading=this.namespace?j.state.loadingNamespaceMap.get(this.namespace):j.state.loading,this.unsubscribe.push(j.subscribe(t=>{this.open=t.open,this.loading=this.namespace?t.loadingNamespaceMap.get(this.namespace):t.loading}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      <wui-connect-button
        size=${v(this.size)}
        .loading=${this.loading}
        @click=${this.onClick.bind(this)}
        data-testid=${`connect-button${this.namespace?`-${this.namespace}`:""}`}
      >
        ${this.loading?this.loadingLabel:this.label}
      </wui-connect-button>
    `}onClick(){this.open?j.close():this.loading||j.open({view:"Connect",namespace:this.namespace})}};Nt([d()],Et.prototype,"size",void 0);Nt([d()],Et.prototype,"label",void 0);Nt([d()],Et.prototype,"loadingLabel",void 0);Nt([d()],Et.prototype,"namespace",void 0);Nt([m()],Et.prototype,"open",void 0);Nt([m()],Et.prototype,"loading",void 0);var to=class extends Et{};to=Nt([h("w3m-connect-button")],to);var eo=class extends Et{};eo=Nt([h("appkit-connect-button")],eo);c();p();u();c();p();u();c();p();u();c();p();u();var io=C`
  :host {
    display: block;
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
    display: flex;
    gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-2xs) var(--wui-spacing-s) var(--wui-spacing-2xs)
      var(--wui-spacing-xs);
    border: 1px solid var(--wui-color-gray-glass-010);
    background-color: var(--wui-color-gray-glass-005);
    color: var(--wui-color-fg-100);
  }

  button:disabled {
    border: 1px solid var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-gray-glass-010);
    }

    button:active:enabled {
      background-color: var(--wui-color-gray-glass-015);
    }
  }

  wui-image,
  wui-icon-box {
    border-radius: var(--wui-border-radius-3xl);
    width: 24px;
    height: 24px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }
`;var Te=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Xt=class extends b{constructor(){super(...arguments),this.imageSrc=void 0,this.isUnsupportedChain=void 0,this.disabled=!1}render(){return l`
      <button data-testid="wui-network-button" ?disabled=${this.disabled}>
        ${this.visualTemplate()}
        <wui-text variant="paragraph-600" color="inherit">
          <slot></slot>
        </wui-text>
      </button>
    `}visualTemplate(){return this.isUnsupportedChain?l`
        <wui-icon-box
          size="sm"
          iconColor="error-100"
          backgroundColor="error-100"
          icon="warningCircle"
        ></wui-icon-box>
      `:this.imageSrc?l`<wui-image src=${this.imageSrc}></wui-image>`:l`
      <wui-icon-box
        size="sm"
        iconColor="inverse-100"
        backgroundColor="fg-100"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};Xt.styles=[W,N,io];Te([d()],Xt.prototype,"imageSrc",void 0);Te([d({type:Boolean})],Xt.prototype,"isUnsupportedChain",void 0);Te([d({type:Boolean})],Xt.prototype,"disabled",void 0);Xt=Te([h("wui-network-button")],Xt);c();p();u();var oo=C`
  :host {
    display: block;
    width: max-content;
  }
`;var Tt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},dt=class extends b{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.network=x.state.activeCaipNetwork,this.networkImage=I.getNetworkImage(this.network),this.caipAddress=x.state.activeCaipAddress,this.loading=j.state.loading,this.isSupported=A.state.allowUnsupportedChain?!0:x.state.activeChain?x.checkIfSupportedNetwork(x.state.activeChain):!0,this.unsubscribe.push(lt.subscribeNetworkImages(()=>{this.networkImage=I.getNetworkImage(this.network)}),x.subscribeKey("activeCaipAddress",t=>{this.caipAddress=t}),x.subscribeKey("activeCaipNetwork",t=>{this.network=t,this.networkImage=I.getNetworkImage(t),this.isSupported=t?.chainNamespace?x.checkIfSupportedNetwork(t.chainNamespace):!0,I.fetchNetworkImage(t?.assets?.imageId)}),j.subscribeKey("loading",t=>this.loading=t))}firstUpdated(){I.fetchNetworkImage(this.network?.assets?.imageId)}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.network?x.checkIfSupportedNetwork(this.network.chainNamespace):!0;return l`
      <wui-network-button
        .disabled=${!!(this.disabled||this.loading)}
        .isUnsupportedChain=${A.state.allowUnsupportedChain?!1:!t}
        imageSrc=${v(this.networkImage)}
        @click=${this.onClick.bind(this)}
        data-testid="w3m-network-button"
      >
        ${this.getLabel()}
        <slot></slot>
      </wui-network-button>
    `}getLabel(){return this.network?!this.isSupported&&!A.state.allowUnsupportedChain?"Switch Network":this.network.name:this.label?this.label:this.caipAddress?"Unknown Network":"Select Network"}onClick(){this.loading||(T.sendEvent({type:"track",event:"CLICK_NETWORKS"}),j.open({view:"Networks"}))}};dt.styles=oo;Tt([d({type:Boolean})],dt.prototype,"disabled",void 0);Tt([d({type:String})],dt.prototype,"label",void 0);Tt([m()],dt.prototype,"network",void 0);Tt([m()],dt.prototype,"networkImage",void 0);Tt([m()],dt.prototype,"caipAddress",void 0);Tt([m()],dt.prototype,"loading",void 0);Tt([m()],dt.prototype,"isSupported",void 0);var ro=class extends dt{};ro=Tt([h("w3m-network-button")],ro);var no=class extends dt{};no=Tt([h("appkit-network-button")],no);c();p();u();c();p();u();c();p();u();c();p();u();c();p();u();var so=C`
  :host {
    display: block;
  }

  button {
    width: 100%;
    display: block;
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    padding-left: var(--wui-spacing-s);
    padding-right: var(--wui-spacing-2l);
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-accent-glass-010);
  }

  button:hover {
    background-color: var(--wui-color-accent-glass-015) !important;
  }

  button:active {
    background-color: var(--wui-color-accent-glass-020) !important;
  }
`;var _e=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Qt=class extends b{constructor(){super(...arguments),this.label="",this.description="",this.icon="wallet"}render(){return l`
      <button>
        <wui-flex gap="m" alignItems="center" justifyContent="space-between">
          <wui-icon-box
            size="lg"
            iconcolor="accent-100"
            backgroundcolor="accent-100"
            icon=${this.icon}
            background="transparent"
          ></wui-icon-box>

          <wui-flex flexDirection="column" gap="3xs">
            <wui-text variant="paragraph-500" color="fg-100">${this.label}</wui-text>
            <wui-text variant="small-400" color="fg-200">${this.description}</wui-text>
          </wui-flex>

          <wui-icon size="md" color="fg-200" name="chevronRight"></wui-icon>
        </wui-flex>
      </button>
    `}};Qt.styles=[W,N,so];_e([d()],Qt.prototype,"label",void 0);_e([d()],Qt.prototype,"description",void 0);_e([d()],Qt.prototype,"icon",void 0);Qt=_e([h("wui-notice-card")],Qt);c();p();u();var ao=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ui=class extends b{constructor(){super(),this.unsubscribe=[],this.socialProvider=F.getConnectedSocialProvider(),this.socialUsername=F.getConnectedSocialUsername(),this.namespace=x.state.activeChain,this.unsubscribe.push(x.subscribeKey("activeChain",t=>{this.namespace=t}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=$.getConnectorId(this.namespace),i=$.getAuthConnector();if(!i||t!==k.CONNECTOR_ID.AUTH)return this.style.cssText="display: none",null;let o=i.provider.getEmail()??"";return!o&&!this.socialUsername?(this.style.cssText="display: none",null):l`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon=${this.socialProvider??"mail"}
        iconSize=${this.socialProvider?"xxl":"sm"}
        data-testid="w3m-account-email-update"
        ?chevron=${!this.socialProvider}
        @click=${()=>{this.onGoToUpdateEmail(o,this.socialProvider)}}
      >
        <wui-text variant="paragraph-500" color="fg-100">${this.getAuthName(o)}</wui-text>
      </wui-list-item>
    `}onGoToUpdateEmail(t,i){i||y.push("UpdateEmailWallet",{email:t,redirectView:"Account"})}getAuthName(t){return this.socialUsername?this.socialProvider==="discord"&&this.socialUsername.endsWith("0")?this.socialUsername.slice(0,-1):this.socialUsername:t.length>30?`${t.slice(0,-3)}...`:t}};ao([m()],ui.prototype,"namespace",void 0);ui=ao([h("w3m-account-auth-button")],ui);var St=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ct=class extends b{constructor(){super(),this.usubscribe=[],this.networkImages=lt.state.networkImages,this.address=_.state.address,this.profileImage=_.state.profileImage,this.profileName=_.state.profileName,this.network=x.state.activeCaipNetwork,this.disconnecting=!1,this.loading=!1,this.switched=!1,this.text="",this.remoteFeatures=A.state.remoteFeatures,this.usubscribe.push(_.subscribe(t=>{t.address&&(this.address=t.address,this.profileImage=t.profileImage,this.profileName=t.profileName)}),x.subscribeKey("activeCaipNetwork",t=>{t?.id&&(this.network=t)}),A.subscribeKey("remoteFeatures",t=>{this.remoteFeatures=t}))}disconnectedCallback(){this.usubscribe.forEach(t=>t())}render(){if(!this.address)throw new Error("w3m-account-settings-view: No account provided");let t=this.networkImages[this.network?.assets?.imageId??""];return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="l"
        .padding=${["0","xl","m","xl"]}
      >
        <wui-avatar
          alt=${this.address}
          address=${this.address}
          imageSrc=${v(this.profileImage)}
          size="2lg"
        ></wui-avatar>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="3xs" alignItems="center" justifyContent="center">
            <wui-text variant="title-6-600" color="fg-100" data-testid="account-settings-address">
              ${B.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:"middle"})}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="fg-200"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" gap="m">
        <wui-flex flexDirection="column" gap="xs" .padding=${["0","l","m","l"]}>
          ${this.authCardTemplate()}
          <w3m-account-auth-button></w3m-account-auth-button>
          <wui-list-item
            .variant=${t?"image":"icon"}
            iconVariant="overlay"
            icon="networkPlaceholder"
            imageSrc=${v(t)}
            ?chevron=${this.isAllowedNetworkSwitch()}
            @click=${this.onNetworks.bind(this)}
            data-testid="account-switch-network-button"
          >
            <wui-text variant="paragraph-500" color="fg-100">
              ${this.network?.name??"Unknown"}
            </wui-text>
          </wui-list-item>
          ${this.togglePreferredAccountBtnTemplate()} ${this.chooseNameButtonTemplate()}
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="disconnect"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}chooseNameButtonTemplate(){let t=this.network?.chainNamespace,i=$.getConnectorId(t),o=$.getAuthConnector();return!x.checkIfNamesSupported()||!o||i!==k.CONNECTOR_ID.AUTH||this.profileName?null:l`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="id"
        iconSize="sm"
        ?chevron=${!0}
        @click=${this.onChooseName.bind(this)}
        data-testid="account-choose-name-button"
      >
        <wui-text variant="paragraph-500" color="fg-100">Choose account name </wui-text>
      </wui-list-item>
    `}authCardTemplate(){let t=$.getConnectorId(this.network?.chainNamespace),i=$.getAuthConnector(),{origin:o}=location;return!i||t!==k.CONNECTOR_ID.AUTH||o.includes(M.SECURE_SITE)?null:l`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}isAllowedNetworkSwitch(){let t=x.getAllRequestedCaipNetworks(),i=t?t.length>1:!1,o=t?.find(({id:r})=>r===this.network?.id);return i||!o}onCopyAddress(){try{this.address&&(E.copyToClopboard(this.address),O.showSuccess("Address copied"))}catch{O.showError("Failed to copy")}}togglePreferredAccountBtnTemplate(){let t=this.network?.chainNamespace,i=x.checkIfSmartAccountEnabled(),o=$.getConnectorId(t);return!$.getAuthConnector()||o!==k.CONNECTOR_ID.AUTH||!i?null:(this.switched||(this.text=tt(t)===V.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account"),l`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="swapHorizontalBold"
        iconSize="sm"
        ?chevron=${!0}
        ?loading=${this.loading}
        @click=${this.changePreferredAccountType.bind(this)}
        data-testid="account-toggle-preferred-account-type"
      >
        <wui-text variant="paragraph-500" color="fg-100">${this.text}</wui-text>
      </wui-list-item>
    `)}onChooseName(){y.push("ChooseAccountName")}async changePreferredAccountType(){let t=this.network?.chainNamespace,i=x.checkIfSmartAccountEnabled(),o=tt(t)===V.ACCOUNT_TYPES.SMART_ACCOUNT||!i?V.ACCOUNT_TYPES.EOA:V.ACCOUNT_TYPES.SMART_ACCOUNT;$.getAuthConnector()&&(this.loading=!0,await S.setPreferredAccountType(o,t),this.text=o===V.ACCOUNT_TYPES.SMART_ACCOUNT?"Switch to your EOA":"Switch to your Smart Account",this.switched=!0,ji.resetSend(),this.loading=!1,this.requestUpdate())}onNetworks(){this.isAllowedNetworkSwitch()&&y.push("Networks")}async onDisconnect(){try{this.disconnecting=!0;let t=this.network?.chainNamespace,o=S.getConnections(t).length>0,r=t&&$.state.activeConnectorIds[t],e=this.remoteFeatures?.multiWallet;await S.disconnect(e?{id:r,namespace:t}:{}),o&&e&&(y.push("ProfileWallets"),O.showSuccess("Wallet deleted"))}catch{T.sendEvent({type:"track",event:"DISCONNECT_ERROR"}),O.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onGoToUpgradeView(){T.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),y.push("UpgradeEmailWallet")}};St([m()],Ct.prototype,"address",void 0);St([m()],Ct.prototype,"profileImage",void 0);St([m()],Ct.prototype,"profileName",void 0);St([m()],Ct.prototype,"network",void 0);St([m()],Ct.prototype,"disconnecting",void 0);St([m()],Ct.prototype,"loading",void 0);St([m()],Ct.prototype,"switched",void 0);St([m()],Ct.prototype,"text",void 0);St([m()],Ct.prototype,"remoteFeatures",void 0);Ct=St([h("w3m-account-settings-view")],Ct);c();p();u();c();p();u();c();p();u();c();p();u();c();p();u();var lo=C`
  button {
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-002);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s) var(--wui-spacing-xs) var(--wui-spacing-xs);
    position: relative;
  }

  wui-avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 0;
    outline: 3px solid var(--wui-color-gray-glass-005);
  }

  wui-icon-box,
  wui-image {
    width: 16px;
    height: 16px;
    border-radius: var(--wui-border-radius-3xl);
    position: absolute;
    left: 26px;
    top: 24px;
  }

  wui-image {
    outline: 2px solid var(--wui-color-bg-125);
  }

  wui-icon-box {
    outline: 2px solid var(--wui-color-bg-200);
    background-color: var(--wui-color-bg-250);
  }
`;var jt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},_t=class extends b{constructor(){super(...arguments),this.avatarSrc=void 0,this.profileName="",this.address="",this.icon="mail"}render(){let i=$.getConnectorId(x.state.activeChain)===k.CONNECTOR_ID.AUTH;return l`<button data-testid="wui-profile-button" @click=${this.handleClick}>
      <wui-flex gap="xs" alignItems="center">
        <wui-avatar
          .imageSrc=${this.avatarSrc}
          alt=${this.address}
          address=${this.address}
        ></wui-avatar>
        ${i?this.getIconTemplate(this.icon):""}
        <wui-flex gap="xs" alignItems="center">
          <wui-text variant="large-600" color="fg-100">
            ${B.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
          </wui-text>
          <wui-icon size="sm" color="fg-200" name="copy" id="copy-address"></wui-icon>
        </wui-flex>
      </wui-flex>
    </button>`}handleClick(t){if(t.target instanceof HTMLElement&&t.target.id==="copy-address"){this.onCopyClick?.(t);return}this.onProfileClick?.(t)}getIconTemplate(t){return l`
      <wui-icon-box
        size="xxs"
        iconColor="fg-200"
        backgroundColor="bg-100"
        icon="${t||"networkPlaceholder"}"
      ></wui-icon-box>
    `}};_t.styles=[W,N,lo];jt([d()],_t.prototype,"avatarSrc",void 0);jt([d()],_t.prototype,"profileName",void 0);jt([d()],_t.prototype,"address",void 0);jt([d()],_t.prototype,"icon",void 0);jt([d()],_t.prototype,"onProfileClick",void 0);jt([d()],_t.prototype,"onCopyClick",void 0);_t=jt([h("wui-profile-button-v2")],_t);c();p();u();c();p();u();c();p();u();var co=C`
  :host {
    display: inline-flex;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    padding: var(--wui-spacing-3xs);
    position: relative;
    height: 36px;
    min-height: 36px;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: 28px;
    border-radius: var(--wui-border-radius-3xl);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > wui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button[data-active='true'] > wui-icon,
  button[data-active='true'] > wui-text {
    color: var(--wui-color-fg-100);
  }

  button[data-active='false'] > wui-icon,
  button[data-active='false'] > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[data-active='true']:disabled > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='false']:disabled > wui-text {
    color: var(--wui-color-fg-300);
  }

  button > wui-icon,
  button > wui-text {
    pointer-events: none;
    transition: color var(--wui-e ase-out-power-1) var(--wui-duration-md);
    will-change: color;
  }

  button {
    width: var(--local-tab-width);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  :host([data-type='flex']) > button {
    width: 34px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: transparent !important;
  }

  button:hover:enabled > wui-icon,
  button:active:enabled > wui-icon {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button:hover:enabled > wui-text,
  button:active:enabled > wui-text {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
  }
`;var Ot=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},At=class extends b{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.localTabWidth="100px",this.activeTab=0,this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`
      --local-tab: ${this.activeTab};
      --local-tab-width: ${this.localTabWidth};
    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map((t,i)=>{let o=i===this.activeTab;return l`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(i)}
          data-active=${o}
          data-testid="tab-${t.label?.toLowerCase()}"
        >
          ${this.iconTemplate(t)}
          <wui-text variant="small-600" color="inherit"> ${t.label} </wui-text>
        </button>
      `})}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout(()=>{this.animateTabs(0,!0)},0))}iconTemplate(t){return t.icon?l`<wui-icon size="xs" color="inherit" name=${t.icon}></wui-icon>`:null}onTabClick(t){this.buttons&&this.animateTabs(t,!1),this.activeTab=t,this.onTabChange(t)}animateTabs(t,i){let o=this.buttons[this.activeTab],r=this.buttons[t],e=o?.querySelector("wui-text"),n=r?.querySelector("wui-text"),a=r?.getBoundingClientRect(),R=n?.getBoundingClientRect();o&&e&&!i&&t!==this.activeTab&&(e.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),o.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),r&&a&&R&&n&&(t!==this.activeTab||i)&&(this.localTabWidth=`${Math.round(a.width+R.width)+6}px`,r.animate([{width:`${a.width+R.width}px`}],{duration:i?0:500,fill:"forwards",easing:"ease"}),n.animate([{opacity:1}],{duration:i?0:125,delay:i?0:200,fill:"forwards",easing:"ease"}))}};At.styles=[W,N,co];Ot([d({type:Array})],At.prototype,"tabs",void 0);Ot([d()],At.prototype,"onTabChange",void 0);Ot([d({type:Array})],At.prototype,"buttons",void 0);Ot([d({type:Boolean})],At.prototype,"disabled",void 0);Ot([d()],At.prototype,"localTabWidth",void 0);Ot([m()],At.prototype,"activeTab",void 0);Ot([m()],At.prototype,"isDense",void 0);At=Ot([h("wui-tabs")],At);c();p();u();c();p();u();c();p();u();var uo=C`
  button {
    display: flex;
    align-items: center;
    padding: var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-xxs);
    column-gap: var(--wui-spacing-xs);
  }

  wui-image,
  .icon-box {
    width: var(--wui-spacing-xxl);
    height: var(--wui-spacing-xxl);
    border-radius: var(--wui-border-radius-3xs);
  }

  wui-text {
    flex: 1;
  }

  .icon-box {
    position: relative;
  }

  .icon-box[data-active='true'] {
    background-color: var(--wui-color-gray-glass-005);
  }

  .circle {
    position: absolute;
    left: 16px;
    top: 15px;
    width: var(--wui-spacing-1xs);
    height: var(--wui-spacing-1xs);
    background-color: var(--wui-color-success-100);
    border: 2px solid var(--wui-color-modal-bg);
    border-radius: 50%;
  }
`;var kt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},mt=class extends b{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return l`
      <button>
        ${this.leftImageTemplate()} ${this.textTemplate()} ${this.rightImageTemplate()}
      </button>
    `}leftImageTemplate(){let t=this.icon?l`<wui-icon
          size=${this.iconSize}
          color="fg-200"
          name=${this.icon}
          class="icon"
        ></wui-icon>`:l`<wui-image src=${this.imageSrc} alt=${this.alt}></wui-image>`;return l`
      <wui-flex
        alignItems="center"
        justifyContent="center"
        class="icon-box"
        data-active=${!!this.icon}
      >
        ${t}
        <wui-flex class="circle"></wui-flex>
      </wui-flex>
    `}textTemplate(){return l`
      <wui-text variant="paragraph-500" color="fg-100">
        ${B.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
      </wui-text>
    `}rightImageTemplate(){return l`<wui-icon name="chevronBottom" size="xs" color="fg-200"></wui-icon>`}};mt.styles=[W,N,uo];kt([d()],mt.prototype,"address",void 0);kt([d()],mt.prototype,"profileName",void 0);kt([d()],mt.prototype,"alt",void 0);kt([d()],mt.prototype,"imageSrc",void 0);kt([d()],mt.prototype,"icon",void 0);kt([d()],mt.prototype,"iconSize",void 0);kt([d({type:Boolean})],mt.prototype,"loading",void 0);kt([d({type:Number})],mt.prototype,"charsStart",void 0);kt([d({type:Number})],mt.prototype,"charsEnd",void 0);mt=kt([h("wui-wallet-switch")],mt);c();p();u();var po=C`
  wui-flex {
    width: 100%;
  }

  :host > wui-flex:first-child {
    transform: translateY(calc(var(--wui-spacing-xxs) * -1));
  }

  wui-icon-link {
    margin-right: calc(var(--wui-icon-box-size-md) * -1);
  }

  wui-notice-card {
    margin-bottom: var(--wui-spacing-3xs);
  }

  wui-list-item > wui-text {
    flex: 1;
  }

  w3m-transactions-view {
    max-height: 200px;
  }

  .tab-content-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .tab-content-container::-webkit-scrollbar {
    display: none;
  }

  .account-button {
    width: auto;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-s);
    height: 48px;
    padding: var(--wui-spacing-xs);
    padding-right: var(--wui-spacing-s);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: 24px;
    transition: background-color 0.2s linear;
  }

  .account-button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }

  .avatar-container {
    position: relative;
  }

  wui-avatar.avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  wui-wallet-switch {
    margin-top: var(--wui-spacing-xs);
  }

  wui-avatar.network-avatar {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-75%, -75%);
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  .account-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-links wui-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    background: red;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 10px;
    flex: 1 0 0;
    border-radius: var(--XS, 16px);
    border: 1px solid var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    background: var(--dark-accent-glass-010, rgba(71, 161, 255, 0.1));
    transition:
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md),
      opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  .account-links wui-flex:hover {
    background: var(--dark-accent-glass-015, rgba(71, 161, 255, 0.15));
  }

  .account-links wui-flex wui-icon {
    width: var(--S, 20px);
    height: var(--S, 20px);
  }

  .account-links wui-flex wui-icon svg path {
    stroke: #667dff;
  }
`;var ht=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},it=class extends b{constructor(){super(),this.unsubscribe=[],this.caipAddress=_.state.caipAddress,this.address=E.getPlainAddress(_.state.caipAddress),this.profileImage=_.state.profileImage,this.profileName=_.state.profileName,this.disconnecting=!1,this.balance=_.state.balance,this.balanceSymbol=_.state.balanceSymbol,this.features=A.state.features,this.remoteFeatures=A.state.remoteFeatures,this.namespace=x.state.activeChain,this.activeConnectorIds=$.state.activeConnectorIds,this.unsubscribe.push(_.subscribeKey("caipAddress",t=>{this.address=E.getPlainAddress(t),this.caipAddress=t}),_.subscribeKey("balance",t=>this.balance=t),_.subscribeKey("balanceSymbol",t=>this.balanceSymbol=t),_.subscribeKey("profileName",t=>this.profileName=t),_.subscribeKey("profileImage",t=>this.profileImage=t),A.subscribeKey("features",t=>this.features=t),A.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t),$.subscribeKey("activeConnectorIds",t=>{this.activeConnectorIds=t}),x.subscribeKey("activeChain",t=>this.namespace=t),x.subscribeKey("activeCaipNetwork",t=>{t?.chainNamespace&&(this.namespace=t?.chainNamespace)}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(!this.caipAddress||!this.namespace)return null;let t=this.activeConnectorIds[this.namespace],i=t?$.getConnectorById(t):void 0,o=I.getConnectorImage(i);return l`<wui-flex
        flexDirection="column"
        .padding=${["0","xl","m","xl"]}
        alignItems="center"
        gap="s"
      >
        <wui-avatar
          alt=${v(this.caipAddress)}
          address=${v(E.getPlainAddress(this.caipAddress))}
          imageSrc=${v(this.profileImage===null?void 0:this.profileImage)}
          data-testid="single-account-avatar"
        ></wui-avatar>
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          imageSrc=${o}
          alt=${i?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-text variant="paragraph-500" color="fg-200">
            ${E.formatBalance(this.balance,this.balanceSymbol)}
          </wui-text>
        </wui-flex>
        ${this.explorerBtnTemplate()}
      </wui-flex>

      <wui-flex flexDirection="column" gap="xs" .padding=${["0","s","s","s"]}>
        ${this.authCardTemplate()} <w3m-account-auth-button></w3m-account-auth-button>
        ${this.orderedFeaturesTemplate()} ${this.activityTemplate()}
        <wui-list-item
          variant="icon"
          iconVariant="overlay"
          icon="disconnect"
          ?chevron=${!1}
          .loading=${this.disconnecting}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`}onrampTemplate(){if(!this.namespace)return null;let t=this.remoteFeatures?.onramp,i=M.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace);return!t||!i?null:l`
      <wui-list-item
        data-testid="w3m-account-default-onramp-button"
        iconVariant="blue"
        icon="card"
        ?chevron=${!0}
        @click=${this.handleClickPay.bind(this)}
      >
        <wui-text variant="paragraph-500" color="fg-100">Buy crypto</wui-text>
      </wui-list-item>
    `}orderedFeaturesTemplate(){return(this.features?.walletFeaturesOrder||M.DEFAULT_FEATURES.walletFeaturesOrder).map(i=>{switch(i){case"onramp":return this.onrampTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}activityTemplate(){return this.namespace&&this.remoteFeatures?.activity&&M.ACTIVITY_ENABLED_CHAIN_NAMESPACES.includes(this.namespace)?l` <wui-list-item
          iconVariant="blue"
          icon="clock"
          iconSize="sm"
          ?chevron=${!0}
          @click=${this.onTransactions.bind(this)}
          data-testid="w3m-account-default-activity-button"
        >
          <wui-text variant="paragraph-500" color="fg-100">Activity</wui-text>
        </wui-list-item>`:null}swapsTemplate(){let t=this.remoteFeatures?.swaps,i=x.state.activeChain===k.CHAIN.EVM;return!t||!i?null:l`
      <wui-list-item
        iconVariant="blue"
        icon="recycleHorizontal"
        ?chevron=${!0}
        @click=${this.handleClickSwap.bind(this)}
        data-testid="w3m-account-default-swaps-button"
      >
        <wui-text variant="paragraph-500" color="fg-100">Swap</wui-text>
      </wui-list-item>
    `}sendTemplate(){let t=this.features?.send,i=x.state.activeChain;if(!i)throw new Error("SendController:sendTemplate - namespace is required");let o=M.SEND_SUPPORTED_NAMESPACES.includes(i);return!t||!o?null:l`
      <wui-list-item
        iconVariant="blue"
        icon="send"
        ?chevron=${!0}
        @click=${this.handleClickSend.bind(this)}
        data-testid="w3m-account-default-send-button"
      >
        <wui-text variant="paragraph-500" color="fg-100">Send</wui-text>
      </wui-list-item>
    `}authCardTemplate(){let t=x.state.activeChain;if(!t)throw new Error("AuthCardTemplate:authCardTemplate - namespace is required");let i=$.getConnectorId(t),o=$.getAuthConnector(),{origin:r}=location;return!o||i!==k.CONNECTOR_ID.AUTH||r.includes(M.SECURE_SITE)?null:l`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}handleClickPay(){y.push("OnRampProviders")}handleClickSwap(){y.push("Swap")}handleClickSend(){y.push("WalletSend")}explorerBtnTemplate(){return _.state.addressExplorerUrl?l`
      <wui-button size="md" variant="neutral" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `:null}onTransactions(){T.sendEvent({type:"track",event:"CLICK_TRANSACTIONS",properties:{isSmartAccount:tt(x.state.activeChain)===V.ACCOUNT_TYPES.SMART_ACCOUNT}}),y.push("Transactions")}async onDisconnect(){try{this.disconnecting=!0;let i=S.getConnections(this.namespace).length>0,o=this.namespace&&$.state.activeConnectorIds[this.namespace],r=this.remoteFeatures?.multiWallet;await S.disconnect(r?{id:o,namespace:this.namespace}:{}),i&&r&&(y.push("ProfileWallets"),O.showSuccess("Wallet deleted"))}catch{T.sendEvent({type:"track",event:"DISCONNECT_ERROR"}),O.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onExplorer(){let t=_.state.addressExplorerUrl;t&&E.openHref(t,"_blank")}onGoToUpgradeView(){T.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),y.push("UpgradeEmailWallet")}onGoToProfileWalletsView(){y.push("ProfileWallets")}};it.styles=po;ht([m()],it.prototype,"caipAddress",void 0);ht([m()],it.prototype,"address",void 0);ht([m()],it.prototype,"profileImage",void 0);ht([m()],it.prototype,"profileName",void 0);ht([m()],it.prototype,"disconnecting",void 0);ht([m()],it.prototype,"balance",void 0);ht([m()],it.prototype,"balanceSymbol",void 0);ht([m()],it.prototype,"features",void 0);ht([m()],it.prototype,"remoteFeatures",void 0);ht([m()],it.prototype,"namespace",void 0);ht([m()],it.prototype,"activeConnectorIds",void 0);it=ht([h("w3m-account-default-widget")],it);c();p();u();c();p();u();c();p();u();c();p();u();var mo=C`
  span {
    font-weight: 500;
    font-size: 40px;
    color: var(--wui-color-fg-100);
    line-height: 130%; /* 52px */
    letter-spacing: -1.6px;
    text-align: center;
  }

  .pennies {
    color: var(--wui-color-fg-200);
  }
`;var pi=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},me=class extends b{constructor(){super(...arguments),this.dollars="0",this.pennies="00"}render(){return l`<span>$${this.dollars}<span class="pennies">.${this.pennies}</span></span>`}};me.styles=[W,mo];pi([d()],me.prototype,"dollars",void 0);pi([d()],me.prototype,"pennies",void 0);me=pi([h("wui-balance")],me);c();p();u();c();p();u();c();p();u();var ho=C`
  :host {
    display: block;
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);

    color: var(--wui-color-bg-100);
    position: relative;
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`;var Re=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Zt=class extends b{constructor(){super(...arguments),this.placement="top",this.variant="fill",this.message=""}render(){return this.dataset.variant=this.variant,l`<wui-icon
        data-placement=${this.placement}
        color="fg-100"
        size="inherit"
        name=${this.variant==="fill"?"cursor":"cursorTransparent"}
      ></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>`}};Zt.styles=[W,N,ho];Re([d()],Zt.prototype,"placement",void 0);Re([d()],Zt.prototype,"variant",void 0);Re([d()],Zt.prototype,"message",void 0);Zt=Re([h("wui-tooltip")],Zt);c();p();u();var fo={getTabsByNamespace(s){return!!s&&s===k.CHAIN.EVM?A.state.remoteFeatures?.activity===!1?li.ACCOUNT_TABS.filter(i=>i.label!=="Activity"):li.ACCOUNT_TABS:[]}};c();p();u();c();p();u();var wo=C`
  :host {
    width: 100%;
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  :host::-webkit-scrollbar {
    display: none;
  }
`;var Or=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},di=class extends b{render(){return l`<w3m-activity-list page="account"></w3m-activity-list>`}};di.styles=wo;di=Or([h("w3m-account-activity-widget")],di);c();p();u();c();p();u();var go=C`
  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`;var Lr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},mi=class extends b{render(){return l`${this.nftTemplate()}`}nftTemplate(){return l` <wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
    >
      <wui-icon-box
        icon="wallet"
        size="inherit"
        iconColor="fg-200"
        backgroundColor="fg-200"
        iconSize="lg"
      ></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="xs"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text
          variant="paragraph-500"
          align="center"
          color="fg-100"
          data-testid="nft-template-title"
          >Coming soon</wui-text
        >
        <wui-text
          variant="small-400"
          align="center"
          color="fg-200"
          data-testid="nft-template-description"
          >Stay tuned for our upcoming NFT feature</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)} data-testid="link-receive-funds"
        >Receive funds</wui-link
      >
    </wui-flex>`}onReceiveClick(){y.push("WalletReceive")}};mi.styles=go;mi=Lr([h("w3m-account-nfts-widget")],mi);c();p();u();c();p();u();c();p();u();c();p();u();var bo=C`
  button {
    width: 100%;
    display: flex;
    gap: var(--wui-spacing-s);
    align-items: center;
    justify-content: flex-start;
    padding: var(--wui-spacing-s) var(--wui-spacing-m) var(--wui-spacing-s) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon-box {
    width: var(--wui-spacing-2xl);
    height: var(--wui-spacing-2xl);
  }

  wui-flex {
    width: auto;
  }
`;var Lt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},It=class extends b{constructor(){super(...arguments),this.icon="card",this.text="",this.description="",this.tag=void 0,this.iconBackgroundColor="accent-100",this.iconColor="accent-100",this.disabled=!1}render(){return l`
      <button ?disabled=${this.disabled}>
        <wui-icon-box
          iconColor=${this.iconColor}
          backgroundColor=${this.iconBackgroundColor}
          size="inherit"
          icon=${this.icon}
          iconSize="md"
        ></wui-icon-box>
        <wui-flex flexDirection="column" justifyContent="spaceBetween">
          ${this.titleTemplate()}
          <wui-text variant="small-400" color="fg-200"> ${this.description}</wui-text></wui-flex
        >
      </button>
    `}titleTemplate(){return this.tag?l` <wui-flex alignItems="center" gap="xxs"
        ><wui-text variant="paragraph-500" color="fg-100">${this.text}</wui-text
        ><wui-tag tagType="main" size="md">${this.tag}</wui-tag>
      </wui-flex>`:l`<wui-text variant="paragraph-500" color="fg-100">${this.text}</wui-text>`}};It.styles=[W,N,bo];Lt([d()],It.prototype,"icon",void 0);Lt([d()],It.prototype,"text",void 0);Lt([d()],It.prototype,"description",void 0);Lt([d()],It.prototype,"tag",void 0);Lt([d()],It.prototype,"iconBackgroundColor",void 0);Lt([d()],It.prototype,"iconColor",void 0);Lt([d({type:Boolean})],It.prototype,"disabled",void 0);It=Lt([h("wui-list-description")],It);c();p();u();var xo=C`
  :host {
    width: 100%;
  }

  wui-flex {
    width: 100%;
  }

  .contentContainer {
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  .contentContainer::-webkit-scrollbar {
    display: none;
  }
`;var hi=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},he=class extends b{constructor(){super(),this.unsubscribe=[],this.tokenBalance=_.state.tokenBalance,this.remoteFeatures=A.state.remoteFeatures,this.unsubscribe.push(_.subscribe(t=>{this.tokenBalance=t.tokenBalance}),A.subscribeKey("remoteFeatures",t=>{this.remoteFeatures=t}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`${this.tokenTemplate()}`}tokenTemplate(){return this.tokenBalance&&this.tokenBalance?.length>0?l`<wui-flex class="contentContainer" flexDirection="column" gap="xs">
        ${this.tokenItemTemplate()}
      </wui-flex>`:l` <wui-flex flexDirection="column" gap="xs"
      >${this.onRampTemplate()}
      <wui-list-description
        @click=${this.onReceiveClick.bind(this)}
        text="Receive funds"
        description="Transfer tokens on your wallet"
        icon="arrowBottomCircle"
        iconColor="fg-200"
        iconBackgroundColor="fg-200"
        data-testid="receive-funds"
      ></wui-list-description
    ></wui-flex>`}onRampTemplate(){return this.remoteFeatures?.onramp?l`<wui-list-description
        @click=${this.onBuyClick.bind(this)}
        text="Buy Crypto"
        description="Easy with card or bank account"
        icon="card"
        iconColor="success-100"
        iconBackgroundColor="success-100"
        tag="popular"
        data-testid="buy-crypto"
      ></wui-list-description>`:l``}tokenItemTemplate(){return this.tokenBalance?.map(t=>l`<wui-list-token
          tokenName=${t.name}
          tokenImageUrl=${t.iconUrl}
          tokenAmount=${t.quantity.numeric}
          tokenValue=${t.value}
          tokenCurrency=${t.symbol}
        ></wui-list-token>`)}onReceiveClick(){y.push("WalletReceive")}onBuyClick(){T.sendEvent({type:"track",event:"SELECT_BUY_CRYPTO",properties:{isSmartAccount:tt(x.state.activeChain)===V.ACCOUNT_TYPES.SMART_ACCOUNT}}),y.push("OnRampProviders")}};he.styles=xo;hi([m()],he.prototype,"tokenBalance",void 0);hi([m()],he.prototype,"remoteFeatures",void 0);he=hi([h("w3m-account-tokens-widget")],he);c();p();u();var vo=C`
  wui-flex {
    width: 100%;
  }

  wui-promo {
    position: absolute;
    top: -32px;
  }

  wui-profile-button {
    margin-top: calc(-1 * var(--wui-spacing-2l));
  }

  wui-promo + wui-profile-button {
    margin-top: var(--wui-spacing-2l);
  }

  wui-tabs {
    width: 100%;
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`;var yt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Dr=48,Pr=430,pt=class extends b{constructor(){super(),this.unsubscribe=[],this.address=_.state.address,this.profileName=_.state.profileName,this.network=x.state.activeCaipNetwork,this.currentTab=_.state.currentTab,this.tokenBalance=_.state.tokenBalance,this.features=A.state.features,this.namespace=x.state.activeChain,this.activeConnectorIds=$.state.activeConnectorIds,this.remoteFeatures=A.state.remoteFeatures,this.unsubscribe.push(_.subscribe(t=>{t.address?(this.address=t.address,this.profileName=t.profileName,this.currentTab=t.currentTab,this.tokenBalance=t.tokenBalance):j.close()}),$.subscribeKey("activeConnectorIds",t=>{this.activeConnectorIds=t}),x.subscribeKey("activeChain",t=>this.namespace=t),x.subscribeKey("activeCaipNetwork",t=>this.network=t),A.subscribeKey("features",t=>this.features=t),A.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t)),this.watchSwapValues()}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),clearInterval(this.watchTokenBalance)}firstUpdated(){_.fetchTokenBalance()}render(){if(!this.address)throw new Error("w3m-account-view: No account provided");if(!this.namespace)return null;let t=this.activeConnectorIds[this.namespace],i=t?$.getConnectorById(t):void 0,{icon:o,iconSize:r}=this.getAuthData();return l`<wui-flex
      flexDirection="column"
      .padding=${["0","xl","m","xl"]}
      alignItems="center"
      gap="m"
      data-testid="w3m-account-wallet-features-widget"
    >
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center" gap="xs">
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          icon=${o}
          iconSize=${r}
          alt=${i?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        ${this.tokenBalanceTemplate()}
      </wui-flex>
      ${this.orderedWalletFeatures()} ${this.tabsTemplate()} ${this.listContentTemplate()}
    </wui-flex>`}orderedWalletFeatures(){let t=this.features?.walletFeaturesOrder||M.DEFAULT_FEATURES.walletFeaturesOrder;return t.every(o=>o==="send"||o==="receive"?!this.features?.[o]:o==="swaps"||o==="onramp"?!this.remoteFeatures?.[o]:!0)?null:l`<wui-flex gap="s">
      ${t.map(o=>{switch(o){case"onramp":return this.onrampTemplate();case"swaps":return this.swapsTemplate();case"receive":return this.receiveTemplate();case"send":return this.sendTemplate();default:return null}})}
    </wui-flex>`}onrampTemplate(){return this.remoteFeatures?.onramp?l`
      <w3m-tooltip-trigger text="Buy">
        <wui-icon-button
          data-testid="wallet-features-onramp-button"
          @click=${this.onBuyClick.bind(this)}
          icon="card"
        ></wui-icon-button>
      </w3m-tooltip-trigger>
    `:null}swapsTemplate(){let t=this.remoteFeatures?.swaps,i=x.state.activeChain===k.CHAIN.EVM;return!t||!i?null:l`
      <w3m-tooltip-trigger text="Swap">
        <wui-icon-button
          data-testid="wallet-features-swaps-button"
          @click=${this.onSwapClick.bind(this)}
          icon="recycleHorizontal"
        >
        </wui-icon-button>
      </w3m-tooltip-trigger>
    `}receiveTemplate(){return this.features?.receive?l`
      <w3m-tooltip-trigger text="Receive">
        <wui-icon-button
          data-testid="wallet-features-receive-button"
          @click=${this.onReceiveClick.bind(this)}
          icon="arrowBottomCircle"
        >
        </wui-icon-button>
      </w3m-tooltip-trigger>
    `:null}sendTemplate(){let t=this.features?.send,i=x.state.activeChain,o=M.SEND_SUPPORTED_NAMESPACES.includes(i);return!t||!o?null:l`
      <w3m-tooltip-trigger text="Send">
        <wui-icon-button
          data-testid="wallet-features-send-button"
          @click=${this.onSendClick.bind(this)}
          icon="send"
        ></wui-icon-button>
      </w3m-tooltip-trigger>
    `}watchSwapValues(){this.watchTokenBalance=setInterval(()=>_.fetchTokenBalance(t=>this.onTokenBalanceError(t)),1e4)}onTokenBalanceError(t){t instanceof Error&&t.cause instanceof Response&&t.cause.status===k.HTTP_STATUS_CODES.SERVICE_UNAVAILABLE&&clearInterval(this.watchTokenBalance)}listContentTemplate(){return this.currentTab===0?l`<w3m-account-tokens-widget></w3m-account-tokens-widget>`:this.currentTab===1?l`<w3m-account-nfts-widget></w3m-account-nfts-widget>`:this.currentTab===2?l`<w3m-account-activity-widget></w3m-account-activity-widget>`:l`<w3m-account-tokens-widget></w3m-account-tokens-widget>`}tokenBalanceTemplate(){if(this.tokenBalance&&this.tokenBalance?.length>=0){let t=E.calculateBalance(this.tokenBalance),{dollars:i="0",pennies:o="00"}=E.formatTokenBalance(t);return l`<wui-balance dollars=${i} pennies=${o}></wui-balance>`}return l`<wui-balance dollars="0" pennies="00"></wui-balance>`}tabsTemplate(){let t=fo.getTabsByNamespace(x.state.activeChain);if(t.length===0)return null;let i=E.isMobile()&&window.innerWidth<Pr,o="104px";return i?o=`${(window.innerWidth-Dr)/t.length}px`:t.length===2?o="156px":o="104px",l`<wui-tabs
      .onTabChange=${this.onTabChange.bind(this)}
      .activeTab=${this.currentTab}
      localTabWidth=${o}
      .tabs=${t}
    ></wui-tabs>`}onTabChange(t){_.setCurrentTab(t)}onBuyClick(){y.push("OnRampProviders")}onSwapClick(){this.network?.caipNetworkId&&!M.SWAP_SUPPORTED_NETWORKS.includes(this.network?.caipNetworkId)?y.push("UnsupportedChain",{swapUnsupportedChain:!0}):(T.sendEvent({type:"track",event:"OPEN_SWAP",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:tt(x.state.activeChain)===V.ACCOUNT_TYPES.SMART_ACCOUNT}}),y.push("Swap"))}getAuthData(){let t=F.getConnectedSocialProvider(),i=F.getConnectedSocialUsername(),r=$.getAuthConnector()?.provider.getEmail()??"";return{name:ct.getAuthName({email:r,socialUsername:i,socialProvider:t}),icon:t??"mail",iconSize:t?"xl":"md"}}onReceiveClick(){y.push("WalletReceive")}onGoToProfileWalletsView(){y.push("ProfileWallets")}onSendClick(){T.sendEvent({type:"track",event:"OPEN_SEND",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:tt(x.state.activeChain)===V.ACCOUNT_TYPES.SMART_ACCOUNT}}),y.push("WalletSend")}};pt.styles=vo;yt([m()],pt.prototype,"watchTokenBalance",void 0);yt([m()],pt.prototype,"address",void 0);yt([m()],pt.prototype,"profileName",void 0);yt([m()],pt.prototype,"network",void 0);yt([m()],pt.prototype,"currentTab",void 0);yt([m()],pt.prototype,"tokenBalance",void 0);yt([m()],pt.prototype,"features",void 0);yt([m()],pt.prototype,"namespace",void 0);yt([m()],pt.prototype,"activeConnectorIds",void 0);yt([m()],pt.prototype,"remoteFeatures",void 0);pt=yt([h("w3m-account-wallet-features-widget")],pt);var Co=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},fi=class extends b{constructor(){super(),this.unsubscribe=[],this.namespace=x.state.activeChain,this.unsubscribe.push(x.subscribeKey("activeChain",t=>{this.namespace=t}))}render(){if(!this.namespace)return null;let t=$.getConnectorId(this.namespace),i=$.getAuthConnector();return l`
      ${i&&t===k.CONNECTOR_ID.AUTH?this.walletFeaturesTemplate():this.defaultTemplate()}
    `}walletFeaturesTemplate(){return l`<w3m-account-wallet-features-widget></w3m-account-wallet-features-widget>`}defaultTemplate(){return l`<w3m-account-default-widget></w3m-account-default-widget>`}};Co([m()],fi.prototype,"namespace",void 0);fi=Co([h("w3m-account-view")],fi);c();p();u();c();p();u();c();p();u();c();p();u();var yo=C`
  wui-image {
    width: var(--wui-spacing-2xl);
    height: var(--wui-spacing-2xl);
    border-radius: var(--wui-border-radius-3xs);
  }

  wui-image,
  .icon-box {
    width: var(--wui-spacing-2xl);
    height: var(--wui-spacing-2xl);
    border-radius: var(--wui-border-radius-3xs);
  }

  wui-icon:not(.custom-icon, .icon-badge) {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: var(--wui-color-gray-glass-005);
    border: 2px solid var(--wui-color-modal-bg);
    border-radius: 50%;
    padding: var(--wui-spacing-4xs);
  }
`;var ot=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},q=class extends b{constructor(){super(...arguments),this.address="",this.profileName="",this.content=[],this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadge=void 0,this.iconBadgeSize="md",this.buttonVariant="neutral",this.enableMoreButton=!1,this.charsStart=4,this.charsEnd=6}render(){return l`
      <wui-flex flexDirection="column" rowGap="xs">
        ${this.topTemplate()} ${this.bottomTemplate()}
      </wui-flex>
    `}topTemplate(){return l`
      <wui-flex alignItems="flex-start" justifyContent="space-between">
        ${this.imageOrIconTemplate()}
        <wui-icon-link
          iconColor="fg-200"
          size="sm"
          icon="copy"
          @click=${this.dispatchCopyEvent}
        ></wui-icon-link>
        <wui-icon-link
          iconColor="fg-200"
          size="sm"
          icon="externalLink"
          @click=${this.dispatchExternalLinkEvent}
        ></wui-icon-link>
        ${this.enableMoreButton?l`<wui-icon-link
              iconColor="fg-200"
              size="sm"
              icon="threeDots"
              @click=${this.dispatchMoreButtonEvent}
              data-testid="wui-active-profile-wallet-item-more-button"
            ></wui-icon-link>`:null}
      </wui-flex>
    `}bottomTemplate(){return l` <wui-flex flexDirection="column">${this.contentTemplate()}</wui-flex> `}imageOrIconTemplate(){return this.icon?l`
        <wui-flex flexGrow="1" alignItems="center">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon
              size=${this.iconSize}
              color="fg-200"
              name=${this.icon}
              class="custom-icon"
            ></wui-icon>

            ${this.iconBadge?l`<wui-icon
                  color="fg-175"
                  size=${this.iconBadgeSize}
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:l`
      <wui-flex flexGrow="1" alignItems="center">
        <wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>
      </wui-flex>
    `}contentTemplate(){return this.content.length===0?null:l`
      <wui-flex flexDirection="column" rowGap="s">
        ${this.content.map(t=>this.labelAndTagTemplate(t))}
      </wui-flex>
    `}labelAndTagTemplate({address:t,profileName:i,label:o,description:r,enableButton:e,buttonType:n,buttonLabel:a,buttonVariant:R,tagVariant:P,tagLabel:U,alignItems:J="flex-end"}){return l`
      <wui-flex justifyContent="space-between" alignItems=${J} columnGap="3xs">
        <wui-flex flexDirection="column" rowGap="4xs">
          ${o?l`<wui-text variant="micro-600" color="fg-200">${o}</wui-text>`:null}

          <wui-flex alignItems="center" columnGap="3xs">
            <wui-text variant="small-500" color="fg-100">
              ${B.getTruncateString({string:i||t,charsStart:i?16:this.charsStart,charsEnd:i?0:this.charsEnd,truncate:i?"end":"middle"})}
            </wui-text>

            ${P&&U?l`<wui-tag variant=${P} size="xs">${U}</wui-tag>`:null}
          </wui-flex>

          ${r?l`<wui-text variant="tiny-500" color="fg-200">${r}</wui-text>`:null}
        </wui-flex>

        ${e?this.buttonTemplate({buttonType:n,buttonLabel:a,buttonVariant:R}):null}
      </wui-flex>
    `}buttonTemplate({buttonType:t,buttonLabel:i,buttonVariant:o}){return l`
      <wui-button
        size="xs"
        variant=${o}
        @click=${t==="disconnect"?this.dispatchDisconnectEvent.bind(this):this.dispatchSwitchEvent.bind(this)}
        data-testid=${t==="disconnect"?"wui-active-profile-wallet-item-disconnect-button":"wui-active-profile-wallet-item-switch-button"}
      >
        ${i}
      </wui-button>
    `}dispatchDisconnectEvent(){this.dispatchEvent(new CustomEvent("disconnect",{bubbles:!0,composed:!0}))}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("switch",{bubbles:!0,composed:!0}))}dispatchExternalLinkEvent(){this.dispatchEvent(new CustomEvent("externalLink",{bubbles:!0,composed:!0}))}dispatchMoreButtonEvent(){this.dispatchEvent(new CustomEvent("more",{bubbles:!0,composed:!0}))}dispatchCopyEvent(){this.dispatchEvent(new CustomEvent("copy",{bubbles:!0,composed:!0}))}};q.styles=[W,N,yo];ot([d()],q.prototype,"address",void 0);ot([d()],q.prototype,"profileName",void 0);ot([d({type:Array})],q.prototype,"content",void 0);ot([d()],q.prototype,"alt",void 0);ot([d()],q.prototype,"imageSrc",void 0);ot([d()],q.prototype,"icon",void 0);ot([d()],q.prototype,"iconSize",void 0);ot([d()],q.prototype,"iconBadge",void 0);ot([d()],q.prototype,"iconBadgeSize",void 0);ot([d()],q.prototype,"buttonVariant",void 0);ot([d({type:Boolean})],q.prototype,"enableMoreButton",void 0);ot([d({type:Number})],q.prototype,"charsStart",void 0);ot([d({type:Number})],q.prototype,"charsEnd",void 0);q=ot([h("wui-active-profile-wallet-item")],q);c();p();u();c();p();u();c();p();u();var $o=C`
  wui-image,
  .icon-box {
    width: var(--wui-spacing-2xl);
    height: var(--wui-spacing-2xl);
    border-radius: var(--wui-border-radius-3xs);
  }

  .right-icon {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: var(--wui-color-gray-glass-005);
    border: 2px solid var(--wui-color-modal-bg);
    border-radius: 50%;
    padding: var(--wui-spacing-4xs);
  }
`;var Y=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},H=class extends b{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.buttonLabel="",this.buttonVariant="accent",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadgeSize="md",this.rightIcon="off",this.rightIconSize="md",this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return l`
      <wui-flex alignItems="center" columnGap="xs">
        ${this.imageOrIconTemplate()} ${this.labelAndDescriptionTemplate()}
        ${this.buttonActionTemplate()}
      </wui-flex>
    `}imageOrIconTemplate(){return this.icon?l`
        <wui-flex alignItems="center" justifyContent="center" class="icon-box">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon
              size=${this.iconSize}
              color="fg-200"
              name=${this.icon}
              class="custom-icon"
            ></wui-icon>
            ${this.iconBadge?l`<wui-icon
                  color="fg-175"
                  size=${this.iconBadgeSize}
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:l`<wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>`}labelAndDescriptionTemplate(){return l`
      <wui-flex
        flexDirection="column"
        flexGrow="1"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <wui-text variant="small-500" color="fg-100">
          ${B.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
        </wui-text>
      </wui-flex>
    `}buttonActionTemplate(){return l`
      <wui-flex columnGap="3xs" alignItems="center" justifyContent="center">
        <wui-button
          size="xs"
          variant=${this.buttonVariant}
          .loading=${this.loading}
          @click=${this.handleButtonClick}
          data-testid="wui-inactive-profile-wallet-item-button"
        >
          ${this.buttonLabel}
        </wui-button>

        <wui-icon-link
          iconColor="fg-200"
          size=${this.rightIconSize}
          icon=${this.rightIcon}
          class="right-icon"
          @click=${this.handleIconClick}
        ></wui-icon-link>
      </wui-flex>
    `}handleButtonClick(){this.dispatchEvent(new CustomEvent("buttonClick",{bubbles:!0,composed:!0}))}handleIconClick(){this.dispatchEvent(new CustomEvent("iconClick",{bubbles:!0,composed:!0}))}};H.styles=[W,N,$o];Y([d()],H.prototype,"address",void 0);Y([d()],H.prototype,"profileName",void 0);Y([d()],H.prototype,"alt",void 0);Y([d()],H.prototype,"buttonLabel",void 0);Y([d()],H.prototype,"buttonVariant",void 0);Y([d()],H.prototype,"imageSrc",void 0);Y([d()],H.prototype,"icon",void 0);Y([d()],H.prototype,"iconSize",void 0);Y([d()],H.prototype,"iconBadge",void 0);Y([d()],H.prototype,"iconBadgeSize",void 0);Y([d()],H.prototype,"rightIcon",void 0);Y([d()],H.prototype,"rightIconSize",void 0);Y([d({type:Boolean})],H.prototype,"loading",void 0);Y([d({type:Number})],H.prototype,"charsStart",void 0);Y([d({type:Number})],H.prototype,"charsEnd",void 0);H=Y([h("wui-inactive-profile-wallet-item")],H);c();p();u();var Ne={getAuthData(s){let t=s.connectorId===k.CONNECTOR_ID.AUTH;if(!t)return{isAuth:!1,icon:void 0,iconSize:void 0,name:void 0};let i=s?.auth?.name??F.getConnectedSocialProvider(),o=s?.auth?.username??F.getConnectedSocialUsername(),e=$.getAuthConnector()?.provider.getEmail()??"";return{isAuth:!0,icon:i??"mail",iconSize:i?"xl":"md",name:t?ct.getAuthName({email:e,socialUsername:o,socialProvider:i}):void 0}}};c();p();u();var Eo=C`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
  }

  .balance-amount {
    flex: 1;
  }

  .wallet-list {
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
      rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
      black 40px,
      black calc(100% - 40px),
      rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
      rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
    );
  }

  .active-wallets {
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }

  .active-wallets-box {
    height: 330px;
  }

  .empty-wallet-list-box {
    height: 400px;
  }

  .empty-box {
    width: 100%;
    padding: var(--wui-spacing-l);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }

  wui-separator {
    margin: var(--wui-spacing-xs) 0 var(--wui-spacing-xs) 0;
  }

  .active-connection {
    padding: var(--wui-spacing-xs);
  }

  .recent-connection {
    padding: var(--wui-spacing-xs) 0 var(--wui-spacing-xs) 0;
  }

  @media (max-width: 430px) {
    .active-wallets-box,
    .empty-wallet-list-box {
      height: auto;
      max-height: clamp(360px, 470px, 80vh);
    }
  }
`;var rt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ur=16,jr=4,ft={ADDRESS_DISPLAY:{START:4,END:6},BADGE:{SIZE:"md",ICON:"lightbulb"},SCROLL_THRESHOLD:50,OPACITY_RANGE:[0,1]},fe={eip155:"ethereum",solana:"solana",bip122:"bitcoin"},So=[{namespace:"eip155",icon:fe.eip155,label:"EVM"},{namespace:"solana",icon:fe.solana,label:"Solana"},{namespace:"bip122",icon:fe.bip122,label:"Bitcoin"}],Br={eip155:{title:"Add EVM Wallet",description:"Add your first EVM wallet"},solana:{title:"Add Solana Wallet",description:"Add your first Solana wallet"},bip122:{title:"Add Bitcoin Wallet",description:"Add your first Bitcoin wallet"}},X=class extends b{constructor(){super(),this.unsubscribers=[],this.currentTab=0,this.namespace=x.state.activeChain,this.namespaces=Array.from(x.state.chains.keys()),this.caipAddress=void 0,this.profileName=void 0,this.activeConnectorIds=$.state.activeConnectorIds,this.lastSelectedAddress="",this.lastSelectedConnectorId="",this.isSwitching=!1,this.caipNetwork=x.state.activeCaipNetwork,this.user=_.state.user,this.remoteFeatures=A.state.remoteFeatures,this.tabWidth="",this.currentTab=this.namespace?this.namespaces.indexOf(this.namespace):0,this.caipAddress=x.getAccountData(this.namespace)?.caipAddress,this.profileName=x.getAccountData(this.namespace)?.profileName,this.unsubscribers.push(S.subscribeKey("connections",()=>this.requestUpdate()),S.subscribeKey("recentConnections",()=>this.requestUpdate()),$.subscribeKey("activeConnectorIds",t=>{this.activeConnectorIds=t}),x.subscribeKey("activeCaipNetwork",t=>this.caipNetwork=t),_.subscribeKey("user",t=>this.user=t),A.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t)),this.chainListener=x.subscribeChainProp("accountState",t=>{this.caipAddress=t?.caipAddress,this.profileName=t?.profileName},this.namespace)}disconnectedCallback(){this.unsubscribers.forEach(t=>t()),this.resizeObserver?.disconnect(),this.tabsResizeObserver?.disconnect(),this.removeScrollListener(),this.chainListener?.()}firstUpdated(){let t=this.shadowRoot?.querySelector(".wallet-list"),i=this.shadowRoot?.querySelector("wui-tabs");if(!t)return;let o=()=>this.updateScrollOpacity(t);if(requestAnimationFrame(o),t.addEventListener("scroll",o),this.resizeObserver=new ResizeObserver(o),this.resizeObserver.observe(t),o(),i){let r=()=>{let n=So.filter(a=>this.namespaces.includes(a.namespace)).length;if(n>1){let a=this.getBoundingClientRect()?.width,R=jr*2,P=Ur*2,J=(a-P-R)/n;this.tabWidth=`${J}px`,this.requestUpdate()}};this.tabsResizeObserver=new ResizeObserver(r),this.tabsResizeObserver.observe(this),r()}}render(){let t=this.namespace;if(!t)throw new Error("Namespace is not set");return l`
      <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="l">
        ${this.renderTabs()} ${this.renderHeader(t)} ${this.renderConnections(t)}
        ${this.renderAddConnectionButton(t)}
      </wui-flex>
    `}renderTabs(){let t=So.filter(o=>this.namespaces.includes(o.namespace));return t.length>1?l`
        <wui-tabs
          .onTabChange=${o=>this.handleTabChange(o)}
          .activeTab=${this.currentTab}
          localTabWidth=${this.tabWidth}
          .tabs=${t}
        ></wui-tabs>
      `:null}renderHeader(t){let o=this.getActiveConnections(t).flatMap(({accounts:r})=>r).length+(this.caipAddress?1:0);return l`
      <wui-flex alignItems="center" columnGap="3xs">
        <wui-icon
          name=${fe[t]??fe.eip155}
          size="lg"
        ></wui-icon>
        <wui-text color="fg-200" variant="small-400"
          >${o>1?"Wallets":"Wallet"}</wui-text
        >
        <wui-text
          color="fg-100"
          variant="small-400"
          class="balance-amount"
          data-testid="balance-amount"
        >
          ${o}
        </wui-text>
        <wui-link
          color="fg-200"
          @click=${()=>S.disconnect({namespace:t})}
          ?disabled=${!this.hasAnyConnections(t)}
          data-testid="disconnect-all-button"
        >
          Disconnect All
        </wui-link>
      </wui-flex>
    `}renderConnections(t){let i=this.hasAnyConnections(t);return l`
      <wui-flex flexDirection="column" class=${ue({"wallet-list":!0,"active-wallets-box":i,"empty-wallet-list-box":!i})} rowGap="s">
        ${i?this.renderActiveConnections(t):this.renderEmptyState(t)}
      </wui-flex>
    `}renderActiveConnections(t){let i=this.getActiveConnections(t),o=this.activeConnectorIds[t],r=this.getPlainAddress();return l`
      ${r||o||i.length>0?l`<wui-flex
            flexDirection="column"
            .padding=${["l","0","xs","0"]}
            class="active-wallets"
          >
            ${this.renderActiveProfile(t)} ${this.renderActiveConnectionsList(t)}
          </wui-flex>`:null}
      ${this.renderRecentConnections(t)}
    `}renderActiveProfile(t){let i=this.activeConnectorIds[t];if(!i)return null;let{connections:o}=Wt.getConnectionsData(t),r=$.getConnectorById(i),e=I.getConnectorImage(r),n=this.getPlainAddress();if(!n)return null;let a=t===k.CHAIN.BITCOIN,R=Ne.getAuthData({connectorId:i,accounts:[]}),P=this.getActiveConnections(t).flatMap(z=>z.accounts).length>0,U=o.find(z=>z.connectorId===i),J=U?.accounts.filter(z=>!K.isLowerCaseMatch(z.address,n));return l`
      <wui-flex flexDirection="column" .padding=${["0","l","0","l"]}>
        <wui-active-profile-wallet-item
          address=${n}
          alt=${r?.name}
          .content=${this.getProfileContent({address:n,connections:o,connectorId:i,namespace:t})}
          .charsStart=${ft.ADDRESS_DISPLAY.START}
          .charsEnd=${ft.ADDRESS_DISPLAY.END}
          .icon=${R.icon}
          .iconSize=${R.iconSize}
          .iconBadge=${this.isSmartAccount(n)?ft.BADGE.ICON:void 0}
          .iconBadgeSize=${this.isSmartAccount(n)?ft.BADGE.SIZE:void 0}
          imageSrc=${e}
          ?enableMoreButton=${R.isAuth}
          @copy=${()=>this.handleCopyAddress(n)}
          @disconnect=${()=>this.handleDisconnect(t,{id:i})}
          @switch=${()=>{a&&U&&J?.[0]&&this.handleSwitchWallet(U,J[0].address,t)}}
          @externalLink=${()=>this.handleExternalLink(n)}
          @more=${()=>this.handleMore()}
          data-testid="wui-active-profile-wallet-item"
        ></wui-active-profile-wallet-item>
        ${P?l`<wui-separator></wui-separator>`:null}
      </wui-flex>
    `}renderActiveConnectionsList(t){let i=this.getActiveConnections(t);return i.length===0?null:l`
      <wui-flex flexDirection="column" .padding=${["0","xs","0","xs"]}>
        ${this.renderConnectionList(i,!1,t)}
      </wui-flex>
    `}renderRecentConnections(t){let{recentConnections:i}=Wt.getConnectionsData(t);return i.flatMap(r=>r.accounts).length===0?null:l`
      <wui-flex flexDirection="column" .padding=${["0","xs","0","xs"]} rowGap="xs">
        <wui-text color="fg-200" variant="micro-500" data-testid="recently-connected-text"
          >RECENTLY CONNECTED</wui-text
        >
        <wui-flex flexDirection="column" .padding=${["0","xs","0","xs"]}>
          ${this.renderConnectionList(i,!0,t)}
        </wui-flex>
      </wui-flex>
    `}renderConnectionList(t,i,o){return t.filter(r=>r.accounts.length>0).map((r,e)=>{let n=$.getConnectorById(r.connectorId),a=I.getConnectorImage(n)??"",R=Ne.getAuthData(r);return r.accounts.map((P,U)=>{let J=e!==0||U!==0,z=this.isAccountLoading(r.connectorId,P.address);return l`
            <wui-flex flexDirection="column">
              ${J?l`<wui-separator></wui-separator>`:null}
              <wui-inactive-profile-wallet-item
                address=${P.address}
                alt=${r.connectorId}
                buttonLabel=${i?"Connect":"Switch"}
                buttonVariant=${i?"neutral":"accent"}
                rightIcon=${i?"bin":"off"}
                rightIconSize="sm"
                class=${i?"recent-connection":"active-connection"}
                data-testid=${i?"recent-connection":"active-connection"}
                imageSrc=${a}
                .iconBadge=${this.isSmartAccount(P.address)?ft.BADGE.ICON:void 0}
                .iconBadgeSize=${this.isSmartAccount(P.address)?ft.BADGE.SIZE:void 0}
                .icon=${R.icon}
                .iconSize=${R.iconSize}
                .loading=${z}
                .showBalance=${!1}
                .charsStart=${ft.ADDRESS_DISPLAY.START}
                .charsEnd=${ft.ADDRESS_DISPLAY.END}
                @buttonClick=${()=>this.handleSwitchWallet(r,P.address,o)}
                @iconClick=${()=>this.handleWalletAction({connection:r,address:P.address,isRecentConnection:i,namespace:o})}
              ></wui-inactive-profile-wallet-item>
            </wui-flex>
          `})})}renderAddConnectionButton(t){if(!this.isMultiWalletEnabled()&&this.caipAddress||!this.hasAnyConnections(t))return null;let{title:i}=this.getChainLabelInfo(t);return l`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="plus"
        iconSize="sm"
        ?chevron=${!0}
        @click=${()=>this.handleAddConnection(t)}
        data-testid="add-connection-button"
      >
        <wui-text variant="paragraph-500" color="fg-200">${i}</wui-text>
      </wui-list-item>
    `}renderEmptyState(t){let{title:i,description:o}=this.getChainLabelInfo(t);return l`
      <wui-flex alignItems="flex-start" class="empty-template" data-testid="empty-template">
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowGap="s"
          class="empty-box"
        >
          <wui-icon-box
            size="lg"
            icon="wallet"
            background="gray"
            iconColor="fg-200"
            backgroundColor="glass-002"
          ></wui-icon-box>

          <wui-flex flexDirection="column" alignItems="center" justifyContent="center" gap="3xs">
            <wui-text color="fg-100" variant="paragraph-500" data-testid="empty-state-text"
              >No wallet connected</wui-text
            >
            <wui-text color="fg-200" variant="tiny-500" data-testid="empty-state-description"
              >${o}</wui-text
            >
          </wui-flex>

          <wui-button
            variant="neutral"
            size="md"
            @click=${()=>this.handleAddConnection(t)}
            data-testid="empty-state-button"
          >
            <wui-icon color="inherit" slot="iconLeft" name="plus"></wui-icon>
            ${i}
          </wui-button>
        </wui-flex>
      </wui-flex>
    `}handleTabChange(t){let i=this.namespaces[t];i&&(this.chainListener?.(),this.currentTab=this.namespaces.indexOf(i),this.namespace=i,this.caipAddress=x.getAccountData(i)?.caipAddress,this.profileName=x.getAccountData(i)?.profileName,this.chainListener=x.subscribeChainProp("accountState",o=>{this.caipAddress=o?.caipAddress},i))}async handleSwitchWallet(t,i,o){try{this.isSwitching=!0,this.lastSelectedConnectorId=t.connectorId,this.lastSelectedAddress=i,await S.switchConnection({connection:t,address:i,namespace:o,closeModalOnConnect:!1,onChange({hasSwitchedAccount:r,hasSwitchedWallet:e}){e?O.showSuccess("Wallet switched"):r&&O.showSuccess("Account switched")}})}catch{O.showError("Failed to switch wallet")}finally{this.isSwitching=!1}}handleWalletAction(t){let{connection:i,address:o,isRecentConnection:r,namespace:e}=t;r?(F.deleteAddressFromConnection({connectorId:i.connectorId,address:o,namespace:e}),S.syncStorageConnections(),O.showSuccess("Wallet deleted")):this.handleDisconnect(e,{id:i.connectorId})}async handleDisconnect(t,{id:i}){try{await S.disconnect({id:i,namespace:t}),O.showSuccess("Wallet disconnected")}catch{O.showError("Failed to disconnect wallet")}}handleCopyAddress(t){E.copyToClopboard(t),O.showSuccess("Address copied")}handleMore(){y.push("AccountSettings")}handleExternalLink(t){let i=this.caipNetwork?.blockExplorers?.default.url;i&&E.openHref(`${i}/address/${t}`,"_blank")}handleAddConnection(t){$.setFilterByNamespace(t),y.push("Connect")}getChainLabelInfo(t){return Br[t]??{title:"Add Wallet",description:"Add your first wallet"}}isSmartAccount(t){if(!this.namespace)return!1;let i=this.user?.accounts?.find(o=>o.type==="smartAccount");return i&&t?K.isLowerCaseMatch(i.address,t):!1}getPlainAddress(){return this.caipAddress?E.getPlainAddress(this.caipAddress):void 0}getActiveConnections(t){let i=this.activeConnectorIds[t],{connections:o}=Wt.getConnectionsData(t),[r]=o.filter(R=>K.isLowerCaseMatch(R.connectorId,i));if(!i)return o;let e=t===k.CHAIN.BITCOIN,{address:n}=this.caipAddress?Pi.parseCaipAddress(this.caipAddress):{},a=[...n?[n]:[]];return e&&r&&(a=r.accounts.map(R=>R.address)||[]),Wt.excludeConnectorAddressFromConnections({connectorId:i,addresses:a,connections:o})}hasAnyConnections(t){let i=this.getActiveConnections(t),{recentConnections:o}=Wt.getConnectionsData(t);return!!this.caipAddress||i.length>0||o.length>0}isAccountLoading(t,i){return K.isLowerCaseMatch(this.lastSelectedConnectorId,t)&&K.isLowerCaseMatch(this.lastSelectedAddress,i)&&this.isSwitching}getProfileContent(t){let{address:i,connections:o,connectorId:r,namespace:e}=t,[n]=o.filter(R=>K.isLowerCaseMatch(R.connectorId,r));if(e===k.CHAIN.BITCOIN&&n?.accounts.every(R=>typeof R.type=="string"))return this.getBitcoinProfileContent(n.accounts,i);let a=Ne.getAuthData({connectorId:r,accounts:[]});return[{address:i,tagLabel:"Active",tagVariant:"success",enableButton:!0,profileName:this.profileName,buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral",...a.isAuth?{description:this.isSmartAccount(i)?"Smart Account":"EOA Account"}:{}}]}getBitcoinProfileContent(t,i){let o=t.length>1,r=this.getPlainAddress();return t.map(e=>{let n=K.isLowerCaseMatch(e.address,r),a="PAYMENT";return e.type==="ordinal"&&(a="ORDINALS"),{address:e.address,tagLabel:K.isLowerCaseMatch(e.address,i)?"Active":void 0,tagVariant:K.isLowerCaseMatch(e.address,i)?"success":void 0,enableButton:!0,...o?{label:a,alignItems:"flex-end",buttonType:n?"disconnect":"switch",buttonLabel:n?"Disconnect":"Switch",buttonVariant:n?"neutral":"accent"}:{alignItems:"center",buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral"}}})}removeScrollListener(){let t=this.shadowRoot?.querySelector(".wallet-list");t&&t.removeEventListener("scroll",()=>this.handleConnectListScroll())}handleConnectListScroll(){let t=this.shadowRoot?.querySelector(".wallet-list");t&&this.updateScrollOpacity(t)}isMultiWalletEnabled(){return!!this.remoteFeatures?.multiWallet}updateScrollOpacity(t){t.style.setProperty("--connect-scroll--top-opacity",Yt.interpolate([0,ft.SCROLL_THRESHOLD],ft.OPACITY_RANGE,t.scrollTop).toString()),t.style.setProperty("--connect-scroll--bottom-opacity",Yt.interpolate([0,ft.SCROLL_THRESHOLD],ft.OPACITY_RANGE,t.scrollHeight-t.scrollTop-t.offsetHeight).toString())}};X.styles=Eo;rt([m()],X.prototype,"currentTab",void 0);rt([m()],X.prototype,"namespace",void 0);rt([m()],X.prototype,"namespaces",void 0);rt([m()],X.prototype,"caipAddress",void 0);rt([m()],X.prototype,"profileName",void 0);rt([m()],X.prototype,"activeConnectorIds",void 0);rt([m()],X.prototype,"lastSelectedAddress",void 0);rt([m()],X.prototype,"lastSelectedConnectorId",void 0);rt([m()],X.prototype,"isSwitching",void 0);rt([m()],X.prototype,"caipNetwork",void 0);rt([m()],X.prototype,"user",void 0);rt([m()],X.prototype,"remoteFeatures",void 0);rt([m()],X.prototype,"tabWidth",void 0);X=rt([h("w3m-profile-wallets-view")],X);c();p();u();c();p();u();c();p();u();c();p();u();c();p();u();var Ao=C`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 22px;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--wui-color-blue-100);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-002);
    border-radius: 999px;
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color;
  }

  span:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
    background-color: var(--wui-color-inverse-100);
    transition: transform var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    will-change: transform;
    border-radius: 50%;
  }

  input:checked + span {
    border-color: var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-blue-100);
  }

  input:not(:checked) + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }
`;var ko=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Oe=class extends b{constructor(){super(...arguments),this.inputElementRef=Kt(),this.checked=void 0}render(){return l`
      <label>
        <input
          ${Gt(this.inputElementRef)}
          type="checkbox"
          ?checked=${v(this.checked)}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};Oe.styles=[W,N,Hi,Ao];ko([d({type:Boolean})],Oe.prototype,"checked",void 0);Oe=ko([h("wui-switch")],Oe);c();p();u();var Io=C`
  :host {
    height: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--wui-spacing-1xs);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var Wo=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Le=class extends b{constructor(){super(...arguments),this.checked=void 0}render(){return l`
      <button>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-switch ?checked=${v(this.checked)}></wui-switch>
      </button>
    `}};Le.styles=[W,N,Io];Wo([d({type:Boolean})],Le.prototype,"checked",void 0);Le=Wo([h("wui-certified-switch")],Le);c();p();u();c();p();u();c();p();u();c();p();u();var To=C`
  button {
    background-color: var(--wui-color-fg-300);
    border-radius: var(--wui-border-radius-4xs);
    width: 16px;
    height: 16px;
  }

  button:disabled {
    background-color: var(--wui-color-bg-300);
  }

  wui-icon {
    color: var(--wui-color-bg-200) !important;
  }

  button:focus-visible {
    background-color: var(--wui-color-fg-250);
    border: 1px solid var(--wui-color-accent-100);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-fg-250);
    }

    button:active:enabled {
      background-color: var(--wui-color-fg-225);
    }
  }
`;var _o=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},De=class extends b{constructor(){super(...arguments),this.icon="copy"}render(){return l`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};De.styles=[W,N,To];_o([d()],De.prototype,"icon",void 0);De=_o([h("wui-input-element")],De);c();p();u();var Ro=C`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;var zr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},wi=class extends b{constructor(){super(...arguments),this.inputComponentRef=Kt()}render(){return l`
      <wui-input-text
        ${Gt(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){let i=this.inputComponentRef.value?.inputElementRef.value;i&&(i.value="",i.focus(),i.dispatchEvent(new Event("input")))}};wi.styles=[W,Ro];wi=zr([h("wui-search-bar")],wi);c();p();u();c();p();u();c();p();u();c();p();u();var No=C`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) 10px;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--wui-path-network);
    clip-path: var(--wui-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: var(--wui-color-gray-glass-010);
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var Oo=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Pe=class extends b{constructor(){super(...arguments),this.type="wallet"}render(){return l`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return this.type==="network"?l` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${Ki}`:l`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};Pe.styles=[W,N,No];Oo([d()],Pe.prototype,"type",void 0);Pe=Oo([h("wui-card-select-loader")],Pe);c();p();u();c();p();u();c();p();u();var Lo=C`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var wt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},nt=class extends b{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&B.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&B.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&B.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&B.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&B.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&B.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&B.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&B.getSpacingStyles(this.margin,3)};
    `,l`<slot></slot>`}};nt.styles=[W,Lo];wt([d()],nt.prototype,"gridTemplateRows",void 0);wt([d()],nt.prototype,"gridTemplateColumns",void 0);wt([d()],nt.prototype,"justifyItems",void 0);wt([d()],nt.prototype,"alignItems",void 0);wt([d()],nt.prototype,"justifyContent",void 0);wt([d()],nt.prototype,"alignContent",void 0);wt([d()],nt.prototype,"columnGap",void 0);wt([d()],nt.prototype,"rowGap",void 0);wt([d()],nt.prototype,"gap",void 0);wt([d()],nt.prototype,"padding",void 0);wt([d()],nt.prototype,"margin",void 0);nt=wt([h("wui-grid")],nt);c();p();u();c();p();u();var Do=C`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-s) var(--wui-spacing-0);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: var(--wui-color-fg-100);
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  button:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  [data-selected='true'] {
    background-color: var(--wui-color-accent-glass-020);
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }
  }

  [data-selected='true']:active:enabled {
    background-color: var(--wui-color-accent-glass-010);
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var we=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Bt=class extends b{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.wallet=void 0,this.observer=new IntersectionObserver(t=>{t.forEach(i=>{i.isIntersecting?(this.visible=!0,this.fetchImageSrc()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let t=this.wallet?.badge_type==="certified";return l`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="3xs">
          <wui-text
            variant="tiny-500"
            color="inherit"
            class=${v(t?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${t?l`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():l`
      <wui-wallet-image
        size="md"
        imageSrc=${v(this.imageSrc)}
        name=${this.wallet?.name}
        .installed=${this.wallet?.installed}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return l`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=I.getWalletImage(this.wallet),!this.imageSrc&&(this.imageLoading=!0,this.imageSrc=await I.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}};Bt.styles=Do;we([m()],Bt.prototype,"visible",void 0);we([m()],Bt.prototype,"imageSrc",void 0);we([m()],Bt.prototype,"imageLoading",void 0);we([d()],Bt.prototype,"wallet",void 0);Bt=we([h("w3m-all-wallets-list-item")],Bt);c();p();u();var Po=C`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var Jt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Uo="local-paginator",Dt=class extends b{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!L.state.wallets.length,this.wallets=L.state.wallets,this.recommended=L.state.recommended,this.featured=L.state.featured,this.filteredWallets=L.state.filteredWallets,this.unsubscribe.push(L.subscribeKey("wallets",t=>this.wallets=t),L.subscribeKey("recommended",t=>this.recommended=t),L.subscribeKey("featured",t=>this.featured=t),L.subscribeKey("filteredWallets",t=>this.filteredWallets=t))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),this.paginationObserver?.disconnect()}render(){return l`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","s","s","s"]}
        columnGap="xxs"
        rowGap="l"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let t=this.shadowRoot?.querySelector("wui-grid");t&&(await L.fetchWalletsByPage({page:1}),await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(t,i){return[...Array(t)].map(()=>l`
        <wui-card-select-loader type="wallet" id=${v(i)}></wui-card-select-loader>
      `)}walletsTemplate(){let t=this.filteredWallets?.length>0?E.uniqueBy([...this.featured,...this.recommended,...this.filteredWallets],"id"):E.uniqueBy([...this.featured,...this.recommended,...this.wallets],"id");return bt.markWalletsAsInstalled(t).map(o=>l`
        <w3m-all-wallets-list-item
          @click=${()=>this.onConnectWallet(o)}
          .wallet=${o}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:t,recommended:i,featured:o,count:r}=L.state,e=window.innerWidth<352?3:4,n=t.length+i.length,R=Math.ceil(n/e)*e-n+e;return R-=t.length?o.length%e:0,r===0&&o.length>0?null:r===0||[...o,...t,...i].length<r?this.shimmerTemplate(R,Uo):null}createPaginationObserver(){let t=this.shadowRoot?.querySelector(`#${Uo}`);t&&(this.paginationObserver=new IntersectionObserver(([i])=>{if(i?.isIntersecting&&!this.loading){let{page:o,count:r,wallets:e}=L.state;e.length<r&&L.fetchWalletsByPage({page:o+1})}}),this.paginationObserver.observe(t))}onConnectWallet(t){$.selectWalletConnector(t)}};Dt.styles=Po;Jt([m()],Dt.prototype,"loading",void 0);Jt([m()],Dt.prototype,"wallets",void 0);Jt([m()],Dt.prototype,"recommended",void 0);Jt([m()],Dt.prototype,"featured",void 0);Jt([m()],Dt.prototype,"filteredWallets",void 0);Dt=Jt([h("w3m-all-wallets-list")],Dt);c();p();u();c();p();u();var jo=C`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var Ue=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},te=class extends b{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?l`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await L.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:t}=L.state,i=bt.markWalletsAsInstalled(t);return t.length?l`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","s","s","s"]}
        rowGap="l"
        columnGap="xs"
        justifyContent="space-between"
      >
        ${i.map(o=>l`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(o)}
              .wallet=${o}
              data-testid="wallet-search-item-${o.id}"
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:l`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="s"
          flexDirection="column"
        >
          <wui-icon-box
            size="lg"
            iconColor="fg-200"
            backgroundColor="fg-300"
            icon="wallet"
            background="transparent"
          ></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="fg-200" variant="paragraph-500">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(t){$.selectWalletConnector(t)}};te.styles=jo;Ue([m()],te.prototype,"loading",void 0);Ue([d()],te.prototype,"query",void 0);Ue([d()],te.prototype,"badge",void 0);te=Ue([h("w3m-all-wallets-search")],te);var gi=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},je=class extends b{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=E.debounce(t=>{this.search=t})}render(){let t=this.search.length>=2;return l`
      <wui-flex .padding=${["0","s","s","s"]} gap="xs">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge}
          @click=${this.onClick.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${t||this.badge?l`<w3m-all-wallets-search
            query=${this.search}
            badge=${v(this.badge)}
          ></w3m-all-wallets-search>`:l`<w3m-all-wallets-list badge=${v(this.badge)}></w3m-all-wallets-list>`}
    `}onInputChange(t){this.onDebouncedSearch(t.detail)}onClick(){if(this.badge==="certified"){this.badge=void 0;return}this.badge="certified",O.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})}qrButtonTemplate(){return E.isMobile()?l`
        <wui-icon-box
          size="lg"
          iconSize="xl"
          iconColor="accent-100"
          backgroundColor="accent-100"
          icon="qrCode"
          background="transparent"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){y.push("ConnectingWalletConnect")}};gi([m()],je.prototype,"search",void 0);gi([m()],je.prototype,"badge",void 0);je=gi([h("w3m-all-wallets-view")],je);c();p();u();c();p();u();c();p();u();c();p();u();var Bo=C`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 16.5px var(--wui-spacing-l) 16.5px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
    justify-content: center;
    align-items: center;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }
`;var Be=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ee=class extends b{constructor(){super(...arguments),this.text="",this.disabled=!1,this.tabIdx=void 0}render(){return l`
      <button ?disabled=${this.disabled} tabindex=${v(this.tabIdx)}>
        <wui-text align="center" variant="paragraph-500" color="inherit">${this.text}</wui-text>
      </button>
    `}};ee.styles=[W,N,Bo];Be([d()],ee.prototype,"text",void 0);Be([d({type:Boolean})],ee.prototype,"disabled",void 0);Be([d()],ee.prototype,"tabIdx",void 0);ee=Be([h("wui-list-button")],ee);c();p();u();c();p();u();var zo=C`
  wui-separator {
    margin: var(--wui-spacing-s) calc(var(--wui-spacing-s) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }

  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }

  wui-icon-link,
  wui-loading-spinner {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  wui-icon-link {
    right: var(--wui-spacing-xs);
  }

  wui-loading-spinner {
    right: var(--wui-spacing-m);
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var ie=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Pt=class extends b{constructor(){super(),this.unsubscribe=[],this.formRef=Kt(),this.email="",this.loading=!1,this.error="",this.remoteFeatures=A.state.remoteFeatures,this.unsubscribe.push(A.subscribeKey("remoteFeatures",t=>{this.remoteFeatures=t}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}firstUpdated(){this.formRef.value?.addEventListener("keydown",t=>{t.key==="Enter"&&this.onSubmitEmail(t)})}render(){let t=S.hasAnyConnection(k.CONNECTOR_ID.AUTH);return l`
      <form ${Gt(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
        <wui-email-input
          @focus=${this.onFocusEvent.bind(this)}
          .disabled=${this.loading}
          @inputChange=${this.onEmailInputChange.bind(this)}
          tabIdx=${v(this.tabIdx)}
          ?disabled=${t}
        >
        </wui-email-input>

        ${this.submitButtonTemplate()}${this.loadingTemplate()}
        <input type="submit" hidden />
      </form>
      ${this.templateError()}
    `}submitButtonTemplate(){return!this.loading&&this.email.length>3?l`
          <wui-icon-link
            size="sm"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitEmail.bind(this)}
          >
          </wui-icon-link>
        `:null}loadingTemplate(){return this.loading?l`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:null}templateError(){return this.error?l`<wui-text variant="tiny-500" color="error-100">${this.error}</wui-text>`:null}onEmailInputChange(t){this.email=t.detail.trim(),this.error=""}async onSubmitEmail(t){if(!k.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(o=>o===x.state.activeChain)){let o=x.getFirstCaipNetworkSupportsAuthConnector();if(o){y.push("SwitchNetwork",{network:o});return}}try{if(this.loading)return;this.loading=!0,t.preventDefault();let o=$.getAuthConnector();if(!o)throw new Error("w3m-email-login-widget: Auth connector not found");let{action:r}=await o.provider.connectEmail({email:this.email});if(T.sendEvent({type:"track",event:"EMAIL_SUBMITTED"}),r==="VERIFY_OTP")T.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),y.push("EmailVerifyOtp",{email:this.email});else if(r==="VERIFY_DEVICE")y.push("EmailVerifyDevice",{email:this.email});else if(r==="CONNECT"){let e=this.remoteFeatures?.multiWallet;await S.connectExternal(o,x.state.activeChain),e?(y.replace("ProfileWallets"),O.showSuccess("New Wallet Added")):y.replace("Account")}}catch(o){E.parseError(o)?.includes("Invalid email")?this.error="Invalid email. Try again.":O.showError(o)}finally{this.loading=!1}}onFocusEvent(){T.sendEvent({type:"track",event:"EMAIL_LOGIN_SELECTED"})}};Pt.styles=zo;ie([d()],Pt.prototype,"tabIdx",void 0);ie([m()],Pt.prototype,"email",void 0);ie([m()],Pt.prototype,"loading",void 0);ie([m()],Pt.prototype,"error",void 0);ie([m()],Pt.prototype,"remoteFeatures",void 0);Pt=ie([h("w3m-email-login-widget")],Pt);c();p();u();c();p();u();c();p();u();c();p();u();var Mo=C`
  :host {
    display: block;
    width: 100%;
  }

  button {
    width: 100%;
    height: 56px;
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var ze=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},oe=class extends b{constructor(){super(...arguments),this.logo="google",this.disabled=!1,this.tabIdx=void 0}render(){return l`
      <button ?disabled=${this.disabled} tabindex=${v(this.tabIdx)}>
        <wui-logo logo=${this.logo}></wui-logo>
      </button>
    `}};oe.styles=[W,N,Mo];ze([d()],oe.prototype,"logo",void 0);ze([d({type:Boolean})],oe.prototype,"disabled",void 0);ze([d()],oe.prototype,"tabIdx",void 0);oe=ze([h("wui-logo-select")],oe);c();p();u();var Fo=C`
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-m)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var zt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ho=2,Vo=6,Rt=class extends b{constructor(){super(),this.unsubscribe=[],this.walletGuide="get-started",this.tabIdx=void 0,this.connectors=$.state.connectors,this.remoteFeatures=A.state.remoteFeatures,this.authConnector=this.connectors.find(t=>t.type==="AUTH"),this.isPwaLoading=!1,this.unsubscribe.push($.subscribeKey("connectors",t=>{this.connectors=t,this.authConnector=this.connectors.find(i=>i.type==="AUTH")}),A.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      <wui-flex
        class="container"
        flexDirection="column"
        gap="xs"
        data-testid="w3m-social-login-widget"
      >
        ${this.topViewTemplate()}${this.bottomViewTemplate()}
      </wui-flex>
    `}topViewTemplate(){let t=this.walletGuide==="explore",i=this.remoteFeatures?.socials;return!i&&t?(i=M.DEFAULT_SOCIALS,this.renderTopViewContent(i)):i?this.renderTopViewContent(i):null}renderTopViewContent(t){return t.length===2?l` <wui-flex gap="xs">
        ${t.slice(0,Ho).map(i=>l`<wui-logo-select
              data-testid=${`social-selector-${i}`}
              @click=${()=>{this.onSocialClick(i)}}
              logo=${i}
              tabIdx=${v(this.tabIdx)}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
      </wui-flex>`:l` <wui-list-social
      data-testid=${`social-selector-${t[0]}`}
      @click=${()=>{this.onSocialClick(t[0])}}
      logo=${v(t[0])}
      align="center"
      name=${`Continue with ${t[0]}`}
      tabIdx=${v(this.tabIdx)}
      ?disabled=${this.isPwaLoading||this.hasConnection()}
    ></wui-list-social>`}bottomViewTemplate(){let t=this.remoteFeatures?.socials,i=this.walletGuide==="explore";return(!this.authConnector||!t||t.length===0)&&i&&(t=M.DEFAULT_SOCIALS),!t||t.length<=Ho?null:t&&t.length>Vo?l`<wui-flex gap="xs">
        ${t.slice(1,Vo-1).map(r=>l`<wui-logo-select
              data-testid=${`social-selector-${r}`}
              @click=${()=>{this.onSocialClick(r)}}
              logo=${r}
              tabIdx=${v(this.tabIdx)}
              ?focusable=${this.tabIdx!==void 0&&this.tabIdx>=0}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
        <wui-logo-select
          logo="more"
          tabIdx=${v(this.tabIdx)}
          @click=${this.onMoreSocialsClick.bind(this)}
          ?disabled=${this.isPwaLoading||this.hasConnection()}
          data-testid="social-selector-more"
        ></wui-logo-select>
      </wui-flex>`:t?l`<wui-flex gap="xs">
      ${t.slice(1,t.length).map(r=>l`<wui-logo-select
            data-testid=${`social-selector-${r}`}
            @click=${()=>{this.onSocialClick(r)}}
            logo=${r}
            tabIdx=${v(this.tabIdx)}
            ?focusable=${this.tabIdx!==void 0&&this.tabIdx>=0}
            ?disabled=${this.isPwaLoading||this.hasConnection()}
          ></wui-logo-select>`)}
    </wui-flex>`:null}onMoreSocialsClick(){y.push("ConnectSocials")}async onSocialClick(t){if(!k.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(o=>o===x.state.activeChain)){let o=x.getFirstCaipNetworkSupportsAuthConnector();if(o){y.push("SwitchNetwork",{network:o});return}}t&&await Vi(t)}async handlePwaFrameLoad(){if(E.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof Fi&&await this.authConnector.provider.init()}catch(t){Ui.open({shortMessage:"Error loading embedded wallet in PWA",longMessage:t.message},"error")}finally{this.isPwaLoading=!1}}}hasConnection(){return S.hasAnyConnection(k.CONNECTOR_ID.AUTH)}};Rt.styles=Fo;zt([d()],Rt.prototype,"walletGuide",void 0);zt([d()],Rt.prototype,"tabIdx",void 0);zt([m()],Rt.prototype,"connectors",void 0);zt([m()],Rt.prototype,"remoteFeatures",void 0);zt([m()],Rt.prototype,"authConnector",void 0);zt([m()],Rt.prototype,"isPwaLoading",void 0);Rt=zt([h("w3m-social-login-widget")],Rt);c();p();u();c();p();u();var Ko=C`
  wui-flex {
    width: 100%;
  }

  .wallet-guide {
    width: 100%;
  }

  .chip-box {
    width: fit-content;
    background-color: var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }
`;var bi=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ge=class extends b{constructor(){super(...arguments),this.walletGuide="get-started"}render(){return this.walletGuide==="explore"?l`<wui-flex
          class="wallet-guide"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowGap="xs"
          data-testid="w3m-wallet-guide-explore"
        >
          <wui-text variant="small-400" color="fg-200" align="center">
            Looking for a self-custody wallet?
          </wui-text>

          <wui-flex class="chip-box">
            <wui-chip
              imageIcon="walletConnectLightBrown"
              icon="externalLink"
              variant="transparent"
              href="https://walletguide.walletconnect.network"
              title="Find one on WalletGuide"
            ></wui-chip>
          </wui-flex>
        </wui-flex>`:l`<wui-flex
          columnGap="4xs"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          .padding=${["s","0","s","0"]}
        >
          <wui-text variant="small-400" class="title" color="fg-200"
            >Haven't got a wallet?</wui-text
          >
          <wui-link
            data-testid="w3m-wallet-guide-get-started"
            color="blue-100"
            class="get-started-link"
            @click=${this.onGetStarted}
            tabIdx=${v(this.tabIdx)}
          >
            Get started
          </wui-link>
        </wui-flex>`}onGetStarted(){y.push("Create")}};ge.styles=Ko;bi([d()],ge.prototype,"tabIdx",void 0);bi([d()],ge.prototype,"walletGuide",void 0);ge=bi([h("w3m-wallet-guide")],ge);c();p();u();c();p();u();c();p();u();c();p();u();c();p();u();c();p();u();var Go=C`
  :host {
    position: relative;
    border-radius: var(--wui-border-radius-xxs);
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--wui-spacing-4xs);
    padding: 3.75px !important;
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: var(--wui-border-radius-5xs);
  }

  :host > wui-flex {
    padding: 2px;
    position: fixed;
    overflow: hidden;
    left: 34px;
    bottom: 8px;
    background: var(--dark-background-150, #1e1f1f);
    border-radius: 50%;
    z-index: 2;
    display: flex;
  }
`;var qo=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},xi=4,Me=class extends b{constructor(){super(...arguments),this.walletImages=[]}render(){let t=this.walletImages.length<xi;return l`${this.walletImages.slice(0,xi).map(({src:i,walletName:o})=>l`
            <wui-wallet-image
              size="inherit"
              imageSrc=${i}
              name=${v(o)}
            ></wui-wallet-image>
          `)}
      ${t?[...Array(xi-this.walletImages.length)].map(()=>l` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`):null}
      <wui-flex>
        <wui-icon-box
          size="xxs"
          iconSize="xxs"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>`}};Me.styles=[W,Go];qo([d({type:Array})],Me.prototype,"walletImages",void 0);Me=qo([h("wui-all-wallets-image")],Me);c();p();u();var Yo=C`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }

  wui-icon {
    color: var(--wui-color-fg-200) !important;
  }
`;var st=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Q=class extends b{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.tabIdx=void 0,this.installed=!1,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return l`
      <button ?disabled=${this.disabled} tabindex=${v(this.tabIdx)}>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?l` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?l` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?l`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
        .installed=${this.installed}
      ></wui-wallet-image>`:!this.showAllWallets&&!this.imageSrc?l`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`:null}templateStatus(){return this.loading?l`<wui-loading-spinner
        size="lg"
        color=${this.loadingSpinnerColor}
      ></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?l`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:this.icon?l`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};Q.styles=[W,N,Yo];st([d({type:Array})],Q.prototype,"walletImages",void 0);st([d()],Q.prototype,"imageSrc",void 0);st([d()],Q.prototype,"name",void 0);st([d()],Q.prototype,"tagLabel",void 0);st([d()],Q.prototype,"tagVariant",void 0);st([d()],Q.prototype,"icon",void 0);st([d()],Q.prototype,"walletIcon",void 0);st([d()],Q.prototype,"tabIdx",void 0);st([d({type:Boolean})],Q.prototype,"installed",void 0);st([d({type:Boolean})],Q.prototype,"disabled",void 0);st([d({type:Boolean})],Q.prototype,"showAllWallets",void 0);st([d({type:Boolean})],Q.prototype,"loading",void 0);st([d({type:String})],Q.prototype,"loadingSpinnerColor",void 0);Q=st([h("wui-list-wallet")],Q);var re=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Mt=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.count=L.state.count,this.filteredCount=L.state.filteredWallets.length,this.isFetchingRecommendedWallets=L.state.isFetchingRecommendedWallets,this.unsubscribe.push($.subscribeKey("connectors",t=>this.connectors=t),L.subscribeKey("count",t=>this.count=t),L.subscribeKey("filteredWallets",t=>this.filteredCount=t.length),L.subscribeKey("isFetchingRecommendedWallets",t=>this.isFetchingRecommendedWallets=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.find(P=>P.id==="walletConnect"),{allWallets:i}=A.state;if(!t||i==="HIDE"||i==="ONLY_MOBILE"&&!E.isMobile())return null;let o=L.state.featured.length,r=this.count+o,e=r<10?r:Math.floor(r/10)*10,n=this.filteredCount>0?this.filteredCount:e,a=`${n}`;this.filteredCount>0?a=`${this.filteredCount}`:n<r&&(a=`${n}+`);let R=S.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT);return l`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${a}
        tagVariant="shade"
        data-testid="all-wallets"
        tabIdx=${v(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        loadingSpinnerColor=${this.isFetchingRecommendedWallets?"fg-300":"accent-100"}
        ?disabled=${R}
      ></wui-list-wallet>
    `}onAllWallets(){T.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),y.push("AllWallets")}};re([d()],Mt.prototype,"tabIdx",void 0);re([m()],Mt.prototype,"connectors",void 0);re([m()],Mt.prototype,"count",void 0);re([m()],Mt.prototype,"filteredCount",void 0);re([m()],Mt.prototype,"isFetchingRecommendedWallets",void 0);Mt=re([h("w3m-all-wallets-widget")],Mt);c();p();u();c();p();u();var Fe=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},be=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.connections=S.state.connections,this.unsubscribe.push($.subscribeKey("connectors",t=>this.connectors=t),S.subscribeKey("connections",t=>this.connections=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(i=>i.type==="ANNOUNCED");return t?.length?l`
      <wui-flex flexDirection="column" gap="xs">
        ${t.filter(ct.showConnector).map(i=>{let r=(this.connections.get(i.chain)??[]).some(e=>K.isLowerCaseMatch(e.connectorId,i.id));return l`
            <wui-list-wallet
              imageSrc=${v(I.getConnectorImage(i))}
              name=${i.name??"Unknown"}
              @click=${()=>this.onConnector(i)}
              tagVariant=${r?"shade":"success"}
              tagLabel=${r?"connected":"installed"}
              data-testid=${`wallet-selector-${i.id}`}
              .installed=${!0}
              tabIdx=${v(this.tabIdx)}
            >
            </wui-list-wallet>
          `})}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){t.id==="walletConnect"?E.isMobile()?y.push("AllWallets"):y.push("ConnectingWalletConnect"):y.push("ConnectingExternal",{connector:t})}};Fe([d()],be.prototype,"tabIdx",void 0);Fe([m()],be.prototype,"connectors",void 0);Fe([m()],be.prototype,"connections",void 0);be=Fe([h("w3m-connect-announced-widget")],be);c();p();u();var He=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},xe=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.loading=!1,this.unsubscribe.push($.subscribeKey("connectors",t=>this.connectors=t)),E.isTelegram()&&E.isIos()&&(this.loading=!S.state.wcUri,this.unsubscribe.push(S.subscribeKey("wcUri",t=>this.loading=!t)))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let{customWallets:t}=A.state;if(!t?.length)return this.style.cssText="display: none",null;let i=this.filterOutDuplicateWallets(t),o=S.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT);return l`<wui-flex flexDirection="column" gap="xs">
      ${i.map(r=>l`
          <wui-list-wallet
            imageSrc=${v(I.getWalletImage(r))}
            name=${r.name??"Unknown"}
            @click=${()=>this.onConnectWallet(r)}
            data-testid=${`wallet-selector-${r.id}`}
            tabIdx=${v(this.tabIdx)}
            ?loading=${this.loading}
            ?disabled=${o}
          >
          </wui-list-wallet>
        `)}
    </wui-flex>`}filterOutDuplicateWallets(t){let i=F.getRecentWallets(),o=this.connectors.map(a=>a.info?.rdns).filter(Boolean),r=i.map(a=>a.rdns).filter(Boolean),e=o.concat(r);if(e.includes("io.metamask.mobile")&&E.isMobile()){let a=e.indexOf("io.metamask.mobile");e[a]="io.metamask"}return t.filter(a=>!e.includes(String(a?.rdns)))}onConnectWallet(t){this.loading||y.push("ConnectingWalletConnect",{wallet:t})}};He([d()],xe.prototype,"tabIdx",void 0);He([m()],xe.prototype,"connectors",void 0);He([m()],xe.prototype,"loading",void 0);xe=He([h("w3m-connect-custom-widget")],xe);c();p();u();var vi=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ve=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.unsubscribe.push($.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let o=this.connectors.filter(e=>e.type==="EXTERNAL").filter(ct.showConnector).filter(e=>e.id!==k.CONNECTOR_ID.COINBASE_SDK);if(!o?.length)return this.style.cssText="display: none",null;let r=S.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT);return l`
      <wui-flex flexDirection="column" gap="xs">
        ${o.map(e=>l`
            <wui-list-wallet
              imageSrc=${v(I.getConnectorImage(e))}
              .installed=${!0}
              name=${e.name??"Unknown"}
              data-testid=${`wallet-selector-external-${e.id}`}
              @click=${()=>this.onConnector(e)}
              tabIdx=${v(this.tabIdx)}
              ?disabled=${r}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnector(t){y.push("ConnectingExternal",{connector:t})}};vi([d()],Ve.prototype,"tabIdx",void 0);vi([m()],Ve.prototype,"connectors",void 0);Ve=vi([h("w3m-connect-external-widget")],Ve);c();p();u();var Ci=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ke=class extends b{constructor(){super(...arguments),this.tabIdx=void 0,this.wallets=[]}render(){if(!this.wallets.length)return this.style.cssText="display: none",null;let t=S.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT);return l`
      <wui-flex flexDirection="column" gap="xs">
        ${this.wallets.map(i=>l`
            <wui-list-wallet
              data-testid=${`wallet-selector-featured-${i.id}`}
              imageSrc=${v(I.getWalletImage(i))}
              name=${i.name??"Unknown"}
              @click=${()=>this.onConnectWallet(i)}
              tabIdx=${v(this.tabIdx)}
              ?disabled=${t}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnectWallet(t){$.selectWalletConnector(t)}};Ci([d()],Ke.prototype,"tabIdx",void 0);Ci([d()],Ke.prototype,"wallets",void 0);Ke=Ci([h("w3m-connect-featured-widget")],Ke);c();p();u();var Ge=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ve=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=[],this.connections=S.state.connections,this.unsubscribe.push(S.subscribeKey("connections",t=>this.connections=t))}render(){let t=this.connectors.filter(ct.showConnector);return t.length===0?(this.style.cssText="display: none",null):l`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(i=>{let r=(this.connections.get(i.chain)??[]).some(e=>K.isLowerCaseMatch(e.connectorId,i.id));return l`
            <wui-list-wallet
              imageSrc=${v(I.getConnectorImage(i))}
              .installed=${!0}
              name=${i.name??"Unknown"}
              tagVariant=${r?"shade":"success"}
              tagLabel=${r?"connected":"installed"}
              data-testid=${`wallet-selector-${i.id}`}
              @click=${()=>this.onConnector(i)}
              tabIdx=${v(this.tabIdx)}
            >
            </wui-list-wallet>
          `})}
      </wui-flex>
    `}onConnector(t){$.setActiveConnector(t),y.push("ConnectingExternal",{connector:t})}};Ge([d()],ve.prototype,"tabIdx",void 0);Ge([d()],ve.prototype,"connectors",void 0);Ge([m()],ve.prototype,"connections",void 0);ve=Ge([h("w3m-connect-injected-widget")],ve);c();p();u();var yi=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},qe=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.unsubscribe.push($.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(i=>i.type==="MULTI_CHAIN"&&i.name!=="WalletConnect");return t?.length?l`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(i=>l`
            <wui-list-wallet
              imageSrc=${v(I.getConnectorImage(i))}
              .installed=${!0}
              name=${i.name??"Unknown"}
              tagVariant="shade"
              tagLabel="multichain"
              data-testid=${`wallet-selector-${i.id}`}
              @click=${()=>this.onConnector(i)}
              tabIdx=${v(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){$.setActiveConnector(t),y.push("ConnectingMultiChain")}};yi([d()],qe.prototype,"tabIdx",void 0);yi([m()],qe.prototype,"connectors",void 0);qe=yi([h("w3m-connect-multi-chain-widget")],qe);c();p();u();var Ye=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ce=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.loading=!1,this.unsubscribe.push($.subscribeKey("connectors",t=>this.connectors=t)),E.isTelegram()&&E.isIos()&&(this.loading=!S.state.wcUri,this.unsubscribe.push(S.subscribeKey("wcUri",t=>this.loading=!t)))}render(){let i=F.getRecentWallets().filter(r=>!bt.isExcluded(r)).filter(r=>!this.hasWalletConnector(r)).filter(r=>this.isWalletCompatibleWithCurrentChain(r));if(!i.length)return this.style.cssText="display: none",null;let o=S.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT);return l`
      <wui-flex flexDirection="column" gap="xs">
        ${i.map(r=>l`
            <wui-list-wallet
              imageSrc=${v(I.getWalletImage(r))}
              name=${r.name??"Unknown"}
              @click=${()=>this.onConnectWallet(r)}
              tagLabel="recent"
              tagVariant="shade"
              tabIdx=${v(this.tabIdx)}
              ?loading=${this.loading}
              ?disabled=${o}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnectWallet(t){this.loading||$.selectWalletConnector(t)}hasWalletConnector(t){return this.connectors.some(i=>i.id===t.id||i.name===t.name)}isWalletCompatibleWithCurrentChain(t){let i=x.state.activeChain;return i&&t.chains?t.chains.some(o=>{let r=o.split(":")[0];return i===r}):!0}};Ye([d()],Ce.prototype,"tabIdx",void 0);Ye([m()],Ce.prototype,"connectors",void 0);Ye([m()],Ce.prototype,"loading",void 0);Ce=Ye([h("w3m-connect-recent-widget")],Ce);c();p();u();var Xe=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ye=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.wallets=[],this.loading=!1,E.isTelegram()&&E.isIos()&&(this.loading=!S.state.wcUri,this.unsubscribe.push(S.subscribeKey("wcUri",t=>this.loading=!t)))}render(){let{connectors:t}=$.state,{customWallets:i,featuredWalletIds:o}=A.state,r=F.getRecentWallets(),e=t.find(z=>z.id==="walletConnect"),a=t.filter(z=>z.type==="INJECTED"||z.type==="ANNOUNCED"||z.type==="MULTI_CHAIN").filter(z=>z.name!=="Browser Wallet");if(!e)return null;if(o||i||!this.wallets.length)return this.style.cssText="display: none",null;let R=a.length+r.length,P=Math.max(0,2-R),U=bt.filterOutDuplicateWallets(this.wallets).slice(0,P);if(!U.length)return this.style.cssText="display: none",null;let J=S.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT);return l`
      <wui-flex flexDirection="column" gap="xs">
        ${U.map(z=>l`
            <wui-list-wallet
              imageSrc=${v(I.getWalletImage(z))}
              name=${z?.name??"Unknown"}
              @click=${()=>this.onConnectWallet(z)}
              tabIdx=${v(this.tabIdx)}
              ?loading=${this.loading}
              ?disabled=${J}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `}onConnectWallet(t){if(this.loading)return;let i=$.getConnector(t.id,t.rdns);i?y.push("ConnectingExternal",{connector:i}):y.push("ConnectingWalletConnect",{wallet:t})}};Xe([d()],ye.prototype,"tabIdx",void 0);Xe([d()],ye.prototype,"wallets",void 0);Xe([m()],ye.prototype,"loading",void 0);ye=Xe([h("w3m-connect-recommended-widget")],ye);c();p();u();var Qe=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},$e=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.connectorImages=lt.state.connectorImages,this.unsubscribe.push($.subscribeKey("connectors",t=>this.connectors=t),lt.subscribeKey("connectorImages",t=>this.connectorImages=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(E.isMobile())return this.style.cssText="display: none",null;let t=this.connectors.find(r=>r.id==="walletConnect");if(!t)return this.style.cssText="display: none",null;let i=t.imageUrl||this.connectorImages[t?.imageId??""],o=S.hasAnyConnection(k.CONNECTOR_ID.WALLET_CONNECT);return l`
      <wui-list-wallet
        imageSrc=${v(i)}
        name=${t.name??"Unknown"}
        @click=${()=>this.onConnector(t)}
        tagLabel="qr code"
        tagVariant="main"
        tabIdx=${v(this.tabIdx)}
        data-testid="wallet-selector-walletconnect"
        ?disabled=${o}
      >
      </wui-list-wallet>
    `}onConnector(t){$.setActiveConnector(t),y.push("ConnectingWalletConnect")}};Qe([d()],$e.prototype,"tabIdx",void 0);Qe([m()],$e.prototype,"connectors",void 0);Qe([m()],$e.prototype,"connectorImages",void 0);$e=Qe([h("w3m-connect-walletconnect-widget")],$e);c();p();u();var Xo=C`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var Ee=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ft=class extends b{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=$.state.connectors,this.recommended=L.state.recommended,this.featured=L.state.featured,this.unsubscribe.push($.subscribeKey("connectors",t=>this.connectors=t),L.subscribeKey("recommended",t=>this.recommended=t),L.subscribeKey("featured",t=>this.featured=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      <wui-flex flexDirection="column" gap="xs"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){let{custom:t,recent:i,announced:o,injected:r,multiChain:e,recommended:n,featured:a,external:R}=ct.getConnectorsByType(this.connectors,this.recommended,this.featured);return ct.getConnectorTypeOrder({custom:t,recent:i,announced:o,injected:r,multiChain:e,recommended:n,featured:a,external:R}).map(U=>{switch(U){case"injected":return l`
            ${e.length?l`<w3m-connect-multi-chain-widget
                  tabIdx=${v(this.tabIdx)}
                ></w3m-connect-multi-chain-widget>`:null}
            ${o.length?l`<w3m-connect-announced-widget
                  tabIdx=${v(this.tabIdx)}
                ></w3m-connect-announced-widget>`:null}
            ${r.length?l`<w3m-connect-injected-widget
                  .connectors=${r}
                  tabIdx=${v(this.tabIdx)}
                ></w3m-connect-injected-widget>`:null}
          `;case"walletConnect":return l`<w3m-connect-walletconnect-widget
            tabIdx=${v(this.tabIdx)}
          ></w3m-connect-walletconnect-widget>`;case"recent":return l`<w3m-connect-recent-widget
            tabIdx=${v(this.tabIdx)}
          ></w3m-connect-recent-widget>`;case"featured":return l`<w3m-connect-featured-widget
            .wallets=${a}
            tabIdx=${v(this.tabIdx)}
          ></w3m-connect-featured-widget>`;case"custom":return l`<w3m-connect-custom-widget
            tabIdx=${v(this.tabIdx)}
          ></w3m-connect-custom-widget>`;case"external":return l`<w3m-connect-external-widget
            tabIdx=${v(this.tabIdx)}
          ></w3m-connect-external-widget>`;case"recommended":return l`<w3m-connect-recommended-widget
            .wallets=${n}
            tabIdx=${v(this.tabIdx)}
          ></w3m-connect-recommended-widget>`;default:return console.warn(`Unknown connector type: ${U}`),null}})}};Ft.styles=Xo;Ee([d()],Ft.prototype,"tabIdx",void 0);Ee([m()],Ft.prototype,"connectors",void 0);Ee([m()],Ft.prototype,"recommended",void 0);Ee([m()],Ft.prototype,"featured",void 0);Ft=Ee([h("w3m-connector-list")],Ft);var Qo=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},$i=class extends b{constructor(){super(...arguments),this.tabIdx=void 0}render(){return l`
      <wui-flex flexDirection="column" gap="xs">
        <w3m-connector-list tabIdx=${v(this.tabIdx)}></w3m-connector-list>
        <w3m-all-wallets-widget tabIdx=${v(this.tabIdx)}></w3m-all-wallets-widget>
      </wui-flex>
    `}};Qo([d()],$i.prototype,"tabIdx",void 0);$i=Qo([h("w3m-wallet-login-list")],$i);c();p();u();var Zo=C`
  :host {
    --connect-scroll--top-opacity: 0;
    --connect-scroll--bottom-opacity: 0;
    --connect-mask-image: none;
  }

  .connect {
    max-height: clamp(360px, 470px, 80vh);
    scrollbar-width: none;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    mask-image: var(--connect-mask-image);
  }

  .guide {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  .connect::-webkit-scrollbar {
    display: none;
  }

  .all-wallets {
    flex-flow: column;
  }

  .connect.disabled,
  .guide.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }

  wui-separator {
    margin: var(--wui-spacing-s) calc(var(--wui-spacing-s) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var gt=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Mr=470,at=class extends b{constructor(){super(),this.unsubscribe=[],this.connectors=$.state.connectors,this.authConnector=this.connectors.find(t=>t.type==="AUTH"),this.features=A.state.features,this.remoteFeatures=A.state.remoteFeatures,this.enableWallets=A.state.enableWallets,this.noAdapters=x.state.noAdapters,this.walletGuide="get-started",this.checked=qt.state.isLegalCheckboxChecked,this.isEmailEnabled=this.remoteFeatures?.email&&!x.state.noAdapters,this.isSocialEnabled=this.remoteFeatures?.socials&&this.remoteFeatures.socials.length>0&&!x.state.noAdapters,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors),this.unsubscribe.push($.subscribeKey("connectors",t=>{this.connectors=t,this.authConnector=this.connectors.find(i=>i.type==="AUTH"),this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)}),A.subscribeKey("features",t=>{this.features=t}),A.subscribeKey("remoteFeatures",t=>{this.remoteFeatures=t,this.setEmailAndSocialEnableCheck(this.noAdapters,this.remoteFeatures)}),A.subscribeKey("enableWallets",t=>this.enableWallets=t),x.subscribeKey("noAdapters",t=>this.setEmailAndSocialEnableCheck(t,this.remoteFeatures)),qt.subscribeKey("isLegalCheckboxChecked",t=>this.checked=t))}disconnectedCallback(){this.unsubscribe.forEach(i=>i()),this.resizeObserver?.disconnect(),this.shadowRoot?.querySelector(".connect")?.removeEventListener("scroll",this.handleConnectListScroll.bind(this))}firstUpdated(){let t=this.shadowRoot?.querySelector(".connect");t&&(requestAnimationFrame(this.handleConnectListScroll.bind(this)),t?.addEventListener("scroll",this.handleConnectListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleConnectListScroll()}),this.resizeObserver?.observe(t),this.handleConnectListScroll())}render(){let{termsConditionsUrl:t,privacyPolicyUrl:i}=A.state,o=A.state.features?.legalCheckbox,n=!!(t||i)&&!!o&&this.walletGuide==="get-started"&&!this.checked,a={connect:!0,disabled:n},R=A.state.enableWalletGuide,P=this.enableWallets,U=this.isSocialEnabled||this.authConnector,J=n?-1:void 0;return l`
      <wui-flex flexDirection="column">
        ${this.legalCheckboxTemplate()}
        <wui-flex
          data-testid="w3m-connect-scroll-view"
          flexDirection="column"
          class=${ue(a)}
        >
          <wui-flex
            class="connect-methods"
            flexDirection="column"
            gap="s"
            .padding=${U&&P&&R&&this.walletGuide==="get-started"?["3xs","s","0","s"]:["3xs","s","s","s"]}
          >
            ${this.renderConnectMethod(J)}
          </wui-flex>
        </wui-flex>
        ${this.guideTemplate(n)}
        <w3m-legal-footer></w3m-legal-footer>
      </wui-flex>
    `}setEmailAndSocialEnableCheck(t,i){this.isEmailEnabled=i?.email&&!t,this.isSocialEnabled=i?.socials&&i.socials.length>0&&!t,this.remoteFeatures=i,this.noAdapters=t}checkIfAuthEnabled(t){let i=t.filter(r=>r.type===zi.CONNECTOR_TYPE_AUTH).map(r=>r.chain);return k.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(r=>i.includes(r))}renderConnectMethod(t){let i=bt.getConnectOrderMethod(this.features,this.connectors);return l`${i.map((o,r)=>{switch(o){case"email":return l`${this.emailTemplate(t)} ${this.separatorTemplate(r,"email")}`;case"social":return l`${this.socialListTemplate(t)}
          ${this.separatorTemplate(r,"social")}`;case"wallet":return l`${this.walletListTemplate(t)}
          ${this.separatorTemplate(r,"wallet")}`;default:return null}})}`}checkMethodEnabled(t){switch(t){case"wallet":return this.enableWallets;case"social":return this.isSocialEnabled&&this.isAuthEnabled;case"email":return this.isEmailEnabled&&this.isAuthEnabled;default:return null}}checkIsThereNextMethod(t){let o=bt.getConnectOrderMethod(this.features,this.connectors)[t+1];return o?this.checkMethodEnabled(o)?o:this.checkIsThereNextMethod(t+1):void 0}separatorTemplate(t,i){let o=this.checkIsThereNextMethod(t),r=this.walletGuide==="explore";switch(i){case"wallet":return this.enableWallets&&o&&!r?l`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;case"email":{let e=o==="social";return this.isAuthEnabled&&this.isEmailEnabled&&!e&&o?l`<wui-separator
              data-testid="w3m-email-login-or-separator"
              text="or"
            ></wui-separator>`:null}case"social":{let e=o==="email";return this.isAuthEnabled&&this.isSocialEnabled&&!e&&o?l`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null}default:return null}}emailTemplate(t){return!this.isEmailEnabled||!this.isAuthEnabled?null:l`<w3m-email-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${v(t)}
    ></w3m-email-login-widget>`}socialListTemplate(t){return!this.isSocialEnabled||!this.isAuthEnabled?null:l`<w3m-social-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${v(t)}
    ></w3m-social-login-widget>`}walletListTemplate(t){let i=this.enableWallets,o=this.features?.emailShowWallets===!1,r=this.features?.collapseWallets,e=o||r;return!i||(E.isTelegram()&&(E.isSafari()||E.isIos())&&S.connectWalletConnect().catch(a=>({})),this.walletGuide==="explore")?null:this.isAuthEnabled&&(this.isEmailEnabled||this.isSocialEnabled)&&e?l`<wui-list-button
        data-testid="w3m-collapse-wallets-button"
        tabIdx=${v(t)}
        @click=${this.onContinueWalletClick.bind(this)}
        text="Continue with a wallet"
      ></wui-list-button>`:l`<w3m-wallet-login-list tabIdx=${v(t)}></w3m-wallet-login-list>`}guideTemplate(t=!1){if(!A.state.enableWalletGuide)return null;let o={guide:!0,disabled:t},r=t?-1:void 0;return!this.authConnector&&!this.isSocialEnabled?null:l`
      ${this.walletGuide==="explore"&&!x.state.noAdapters?l`<wui-separator data-testid="wui-separator" id="explore" text="or"></wui-separator>`:null}
      <w3m-wallet-guide
        class=${ue(o)}
        tabIdx=${v(r)}
        walletGuide=${this.walletGuide}
      ></w3m-wallet-guide>
    `}legalCheckboxTemplate(){return this.walletGuide==="explore"?null:l`<w3m-legal-checkbox data-testid="w3m-legal-checkbox"></w3m-legal-checkbox>`}handleConnectListScroll(){let t=this.shadowRoot?.querySelector(".connect");if(!t)return;t.scrollHeight>Mr?(t.style.setProperty("--connect-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
          black 40px,
          black calc(100% - 40px),
          rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
        )`),t.style.setProperty("--connect-scroll--top-opacity",Yt.interpolate([0,50],[0,1],t.scrollTop).toString()),t.style.setProperty("--connect-scroll--bottom-opacity",Yt.interpolate([0,50],[0,1],t.scrollHeight-t.scrollTop-t.offsetHeight).toString())):(t.style.setProperty("--connect-mask-image","none"),t.style.setProperty("--connect-scroll--top-opacity","0"),t.style.setProperty("--connect-scroll--bottom-opacity","0"))}onContinueWalletClick(){y.push("ConnectWallets")}};at.styles=Zo;gt([m()],at.prototype,"connectors",void 0);gt([m()],at.prototype,"authConnector",void 0);gt([m()],at.prototype,"features",void 0);gt([m()],at.prototype,"remoteFeatures",void 0);gt([m()],at.prototype,"enableWallets",void 0);gt([m()],at.prototype,"noAdapters",void 0);gt([d()],at.prototype,"walletGuide",void 0);gt([m()],at.prototype,"checked",void 0);gt([m()],at.prototype,"isEmailEnabled",void 0);gt([m()],at.prototype,"isSocialEnabled",void 0);gt([m()],at.prototype,"isAuthEnabled",void 0);at=gt([h("w3m-connect-view")],at);c();p();u();c();p();u();c();p();u();c();p();u();c();p();u();c();p();u();var Jo=C`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var Ze=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ne=class extends b{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return l`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" color="fg-200">${this.label}</wui-text>
        <wui-chip-button size="sm" variant="shade" text=${this.buttonLabel} icon="chevronRight">
        </wui-chip-button>
      </wui-flex>
    `}};ne.styles=[W,N,Jo];Ze([d({type:Boolean})],ne.prototype,"disabled",void 0);Ze([d()],ne.prototype,"label",void 0);Ze([d()],ne.prototype,"buttonLabel",void 0);ne=Ze([h("wui-cta-button")],ne);c();p();u();var tr=C`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`;var er=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Je=class extends b{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:t,app_store:i,play_store:o,chrome_store:r,homepage:e}=this.wallet,n=E.isMobile(),a=E.isIos(),R=E.isAndroid(),P=[i,o,e,r].filter(Boolean).length>1,U=B.getTruncateString({string:t,charsStart:12,charsEnd:0,truncate:"end"});return P&&!n?l`
        <wui-cta-button
          label=${`Don't have ${U}?`}
          buttonLabel="Get"
          @click=${()=>y.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!P&&e?l`
        <wui-cta-button
          label=${`Don't have ${U}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:i&&a?l`
        <wui-cta-button
          label=${`Don't have ${U}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:o&&R?l`
        <wui-cta-button
          label=${`Don't have ${U}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&E.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&E.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&E.openHref(this.wallet.homepage,"_blank")}};Je.styles=[tr];er([d({type:Object})],Je.prototype,"wallet",void 0);Je=er([h("w3m-mobile-download-links")],Je);c();p();u();var ir=C`
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
    transition-property: opacity, transform;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-2);
    will-change: opacity, transform;
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

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }
`;var $t=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},D=class extends b{constructor(){super(),this.wallet=y.state.data?.wallet,this.connector=y.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=I.getWalletImage(this.wallet)??I.getConnectorImage(this.connector),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=S.state.wcUri,this.error=S.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(S.subscribeKey("wcUri",t=>{this.uri=t,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),S.subscribeKey("wcError",t=>this.error=t)),(E.isTelegram()||E.isSafari())&&E.isIos()&&S.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),S.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let t=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,i="";return this.label?i=this.label:(i=`Continue in ${this.name}`,this.error&&(i="Connection declined")),l`
      <wui-flex
        data-error=${v(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${v(this.imageSrc)}></wui-wallet-image>

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
          <wui-text
            align="center"
            variant="paragraph-500"
            color=${this.error?"error-100":"fg-100"}
          >
            ${i}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?l`
              <wui-button
                variant="accent"
                size="md"
                ?disabled=${this.isRetrying||this.isLoading}
                @click=${this.onTryAgain.bind(this)}
                data-testid="w3m-connecting-widget-secondary-button"
              >
                <wui-icon color="inherit" slot="iconLeft" name=${this.secondaryBtnIcon}></wui-icon>
                ${this.secondaryBtnLabel}
              </wui-button>
            `:null}
      </wui-flex>

      ${this.isWalletConnect?l`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200" data-testid="wui-link-copy">
                <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,this.shadowRoot?.querySelector("wui-button")?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"}))}onTryAgain(){S.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){let t=pe.state.themeVariables["--w3m-border-radius-master"],i=t?parseInt(t.replace("px",""),10):4;return l`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(E.copyToClopboard(this.uri),O.showSuccess("Link copied"))}catch{O.showError("Failed to copy")}}};D.styles=ir;$t([m()],D.prototype,"isRetrying",void 0);$t([m()],D.prototype,"uri",void 0);$t([m()],D.prototype,"error",void 0);$t([m()],D.prototype,"ready",void 0);$t([m()],D.prototype,"showRetry",void 0);$t([m()],D.prototype,"label",void 0);$t([m()],D.prototype,"secondaryBtnLabel",void 0);$t([m()],D.prototype,"secondaryLabel",void 0);$t([m()],D.prototype,"isLoading",void 0);$t([d({type:Boolean})],D.prototype,"isMobile",void 0);$t([d()],D.prototype,"onRetry",void 0);var Fr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},or=class extends D{constructor(){if(super(),this.externalViewUnsubscribe=[],this.connectionsByNamespace=S.getConnections(this.connector?.chain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.remoteFeatures=A.state.remoteFeatures,this.currentActiveConnectorId=$.state.activeConnectorIds[this.connector?.chain],!this.connector)throw new Error("w3m-connecting-view: No connector provided");let t=this.connector?.chain;this.isAlreadyConnected(this.connector)&&(this.secondaryBtnLabel=void 0,this.label=`This account is already linked, change your account in ${this.connector.name}`,this.secondaryLabel=`To link a new account, open ${this.connector.name} and switch to the account you want to link`),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.connector.name??"Unknown",platform:"browser"}}),this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),this.isWalletConnect=!1,this.externalViewUnsubscribe.push($.subscribeKey("activeConnectorIds",i=>{let o=i[t],r=this.remoteFeatures?.multiWallet;o!==this.currentActiveConnectorId&&(this.hasMultipleConnections&&r?(y.replace("ProfileWallets"),O.showSuccess("New Wallet Added")):j.close())}),S.subscribeKey("connections",this.onConnectionsChange.bind(this)))}disconnectedCallback(){this.externalViewUnsubscribe.forEach(t=>t())}async onConnectProxy(){try{if(this.error=!1,this.connector){if(this.isAlreadyConnected(this.connector))return;(this.connector.id!==k.CONNECTOR_ID.COINBASE_SDK||!this.error)&&(await S.connectExternal(this.connector,this.connector.chain),T.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.connector.name||"Unknown",caipNetworkId:x.getActiveCaipNetwork()?.caipNetworkId}}))}}catch(t){T.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),this.error=!0}}onConnectionsChange(t){if(this.connector?.chain&&t.get(this.connector.chain)&&this.isAlreadyConnected(this.connector)){let i=t.get(this.connector.chain)??[],o=this.remoteFeatures?.multiWallet;if(i.length===0)y.replace("Connect");else{let r=Wt.getConnectionsByConnectorId(this.connectionsByNamespace,this.connector.id).flatMap(n=>n.accounts),e=Wt.getConnectionsByConnectorId(i,this.connector.id).flatMap(n=>n.accounts);e.length===0?this.hasMultipleConnections&&o?(y.replace("ProfileWallets"),O.showSuccess("Wallet deleted")):j.close():!r.every(a=>e.some(R=>K.isLowerCaseMatch(a.address,R.address)))&&o&&y.replace("ProfileWallets")}}}isAlreadyConnected(t){return!!t&&this.connectionsByNamespace.some(i=>K.isLowerCaseMatch(i.connectorId,t.id))}};or=Fr([h("w3m-connecting-external-view")],or);c();p();u();c();p();u();var rr=C`
  wui-flex,
  wui-list-wallet {
    width: 100%;
  }
`;var nr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ti=class extends b{constructor(){super(),this.unsubscribe=[],this.activeConnector=$.state.activeConnector,this.unsubscribe.push($.subscribeKey("activeConnector",t=>this.activeConnector=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["m","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image
            size="lg"
            imageSrc=${v(I.getConnectorImage(this.activeConnector))}
          ></wui-wallet-image>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="xs"
          .padding=${["0","s","0","s"]}
        >
          <wui-text variant="paragraph-500" color="fg-100">
            Select Chain for ${this.activeConnector?.name}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200"
            >Select which chain to connect to your multi chain wallet</wui-text
          >
        </wui-flex>
        <wui-flex
          flexGrow="1"
          flexDirection="column"
          alignItems="center"
          gap="xs"
          .padding=${["xs","0","xs","0"]}
        >
          ${this.networksTemplate()}
        </wui-flex>
      </wui-flex>
    `}networksTemplate(){return this.activeConnector?.connectors?.map(t=>t.name?l`
            <wui-list-wallet
              imageSrc=${v(I.getChainImage(t.chain))}
              name=${k.CHAIN_NAME_MAP[t.chain]}
              @click=${()=>this.onConnector(t)}
              data-testid="wui-list-chain-${t.chain}"
            ></wui-list-wallet>
          `:null)}onConnector(t){let i=this.activeConnector?.connectors?.find(o=>o.chain===t.chain);if(!i){O.showError("Failed to find connector");return}i.id==="walletConnect"?E.isMobile()?y.push("AllWallets"):y.push("ConnectingWalletConnect"):y.push("ConnectingExternal",{connector:i})}};ti.styles=rr;nr([m()],ti.prototype,"activeConnector",void 0);ti=nr([h("w3m-connecting-multi-chain-view")],ti);c();p();u();c();p();u();var Ei=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ei=class extends b{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.generateTabs();return l`
      <wui-flex justifyContent="center" .padding=${["0","0","l","0"]}>
        <wui-tabs .tabs=${t} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){let t=this.platforms.map(i=>i==="browser"?{label:"Browser",icon:"extension",platform:"browser"}:i==="mobile"?{label:"Mobile",icon:"mobile",platform:"mobile"}:i==="qrcode"?{label:"Mobile",icon:"mobile",platform:"qrcode"}:i==="web"?{label:"Webapp",icon:"browser",platform:"web"}:i==="desktop"?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=t.map(({platform:i})=>i),t}onTabChange(t){let i=this.platformTabs[t];i&&this.onSelectPlatfrom?.(i)}};Ei([d({type:Array})],ei.prototype,"platforms",void 0);Ei([d()],ei.prototype,"onSelectPlatfrom",void 0);ei=Ei([h("w3m-connecting-header")],ei);c();p();u();var Hr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},sr=class extends D{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}async onConnectProxy(){try{this.error=!1;let{connectors:t}=$.state,i=t.find(o=>o.type==="ANNOUNCED"&&o.info?.rdns===this.wallet?.rdns||o.type==="INJECTED"||o.name===this.wallet?.name);if(i)await S.connectExternal(i,i.chain);else throw new Error("w3m-connecting-wc-browser: No connector found");j.close(),T.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.wallet?.name||"Unknown",caipNetworkId:x.getActiveCaipNetwork()?.caipNetworkId}})}catch(t){T.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),this.error=!0}}};sr=Hr([h("w3m-connecting-wc-browser")],sr);c();p();u();var Vr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ar=class extends D{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop"}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:t,name:i}=this.wallet,{redirect:o,href:r}=E.formatNativeUrl(t,this.uri);S.setWcLinking({name:i,href:r}),S.setRecentWallet(this.wallet),E.openHref(o,"_blank")}catch{this.error=!0}}};ar=Vr([h("w3m-connecting-wc-desktop")],ar);c();p();u();var se=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ht=class extends D{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=A.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;let{mobile_link:t,link_mode:i,name:o}=this.wallet,{redirect:r,redirectUniversalLink:e,href:n}=E.formatNativeUrl(t,this.uri,i);this.redirectDeeplink=r,this.redirectUniversalLink=e,this.target=E.isIframe()?"_top":"_self",S.setWcLinking({name:o,href:n}),S.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?E.openHref(this.redirectUniversalLink,this.target):E.openHref(this.redirectDeeplink,this.target)}catch(t){T.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:t instanceof Error?t.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=M.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(S.subscribeKey("wcUri",()=>{this.onHandleURI()})),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile"}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){S.setWcError(!1),this.onConnect?.()}};se([m()],Ht.prototype,"redirectDeeplink",void 0);se([m()],Ht.prototype,"redirectUniversalLink",void 0);se([m()],Ht.prototype,"target",void 0);se([m()],Ht.prototype,"preferUniversalLinks",void 0);se([m()],Ht.prototype,"isLoading",void 0);Ht=se([h("w3m-connecting-wc-mobile")],Ht);c();p();u();c();p();u();var lr=C`
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
`;var Kr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Si=class extends D{constructor(){super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode"}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(t=>t()),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),l`
      <wui-flex
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
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let t=this.getBoundingClientRect().width-40,i=this.wallet?this.wallet.name:void 0;return S.setWcLinking(void 0),S.setRecentWallet(this.wallet),l` <wui-qr-code
      size=${t}
      theme=${pe.state.themeMode}
      uri=${this.uri}
      imageSrc=${v(I.getWalletImage(this.wallet))}
      color=${v(pe.state.themeVariables["--w3m-qr-color"])}
      alt=${v(i)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let t=!this.uri||!this.ready;return l`<wui-link
      .disabled=${t}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}};Si.styles=lr;Si=Kr([h("w3m-connecting-wc-qrcode")],Si);c();p();u();var Gr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},cr=class extends b{constructor(){if(super(),this.wallet=y.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}render(){return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${v(I.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};cr=Gr([h("w3m-connecting-wc-unsupported")],cr);c();p();u();var ur=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ai=class extends D{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=M.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(S.subscribeKey("wcUri",()=>{this.updateLoadingState()})),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web"}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:t,name:i}=this.wallet,{redirect:o,href:r}=E.formatUniversalUrl(t,this.uri);S.setWcLinking({name:i,href:r}),S.setRecentWallet(this.wallet),E.openHref(o,"_blank")}catch{this.error=!0}}};ur([m()],Ai.prototype,"isLoading",void 0);Ai=ur([h("w3m-connecting-wc-web")],Ai);var Se=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ae=class extends b{constructor(){super(),this.wallet=y.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!A.state.siwx,this.remoteFeatures=A.state.remoteFeatures,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(A.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?l`<wui-ux-by-reown></wui-ux-by-reown>`:null}async initializeConnection(t=!1){if(!(this.platform==="browser"||A.state.manualWCControl&&!t))try{let{wcPairingExpiry:i,status:o}=S.state;if(t||A.state.enableEmbedded||E.isPairingExpired(i)||o==="connecting"){let r=S.getConnections(x.state.activeChain),e=this.remoteFeatures?.multiWallet,n=r.length>0;await S.connectWalletConnect(),this.isSiwxEnabled||(n&&e?(y.replace("ProfileWallets"),O.showSuccess("New Wallet Added")):j.close())}}catch(i){if(i instanceof Error&&i.message.includes("An error occurred when attempting to switch chain")&&!A.state.enableNetworkSwitch&&x.state.activeChain){x.setActiveCaipNetwork(Mi.getUnsupportedNetwork(`${x.state.activeChain}:${x.state.activeCaipNetwork?.id}`)),x.showUnsupportedChainUI();return}T.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:i?.message??"Unknown"}}),S.setWcError(!0),O.showError(i.message??"Connection error"),S.resetWcConnection(),y.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:t,desktop_link:i,webapp_link:o,injected:r,rdns:e}=this.wallet,n=r?.map(({injected_id:Nr})=>Nr).filter(Boolean),a=[...e?[e]:n??[]],R=A.state.isUniversalProvider?!1:a.length,P=t,U=o,J=S.checkInstalled(a),z=R&&J,Rr=i&&!E.isMobile();z&&!x.state.noAdapters&&this.platforms.push("browser"),P&&this.platforms.push(E.isMobile()?"mobile":"qrcode"),U&&this.platforms.push("web"),Rr&&this.platforms.push("desktop"),!z&&R&&!x.state.noAdapters&&this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return l`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return l`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return l`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return l`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return l`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return l`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?l`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(t){let i=this.shadowRoot?.querySelector("div");i&&(await i.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=t,i.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};Se([m()],ae.prototype,"platform",void 0);Se([m()],ae.prototype,"platforms",void 0);Se([m()],ae.prototype,"isSiwxEnabled",void 0);Se([m()],ae.prototype,"remoteFeatures",void 0);ae=Se([h("w3m-connecting-wc-view")],ae);c();p();u();var pr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ki=class extends b{constructor(){super(...arguments),this.isMobile=E.isMobile()}render(){if(this.isMobile){let{featured:t,recommended:i}=L.state,{customWallets:o}=A.state,r=F.getRecentWallets(),e=t.length||i.length||o?.length||r.length;return l`<wui-flex
        flexDirection="column"
        gap="xs"
        .margin=${["3xs","s","s","s"]}
      >
        ${e?l`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return l`<wui-flex flexDirection="column" .padding=${["0","0","l","0"]}>
      <w3m-connecting-wc-view></w3m-connecting-wc-view>
      <wui-flex flexDirection="column" .padding=${["0","m","0","m"]}>
        <w3m-all-wallets-widget></w3m-all-wallets-widget> </wui-flex
    ></wui-flex>`}};pr([m()],ki.prototype,"isMobile",void 0);ki=pr([h("w3m-connecting-wc-basic-view")],ki);c();p();u();c();p();u();var dr=C`
  .continue-button-container {
    width: 100%;
  }
`;var mr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ii=class extends b{constructor(){super(...arguments),this.loading=!1}render(){return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="xxl"
        .padding=${["0","0","l","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{E.openHref(Di.URLS.FAQ,"_blank")}}
        >
          Learn more about names
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `}onboardingTemplate(){return l` <wui-flex
      flexDirection="column"
      gap="xxl"
      alignItems="center"
      .padding=${["0","xxl","0","xxl"]}
    >
      <wui-flex gap="s" alignItems="center" justifyContent="center">
        <wui-icon-box
          icon="id"
          size="xl"
          iconSize="xxl"
          iconColor="fg-200"
          backgroundColor="fg-200"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="s">
        <wui-text align="center" variant="medium-600" color="fg-100">
          Choose your account name
        </wui-text>
        <wui-text align="center" variant="paragraph-400" color="fg-100">
          Finally say goodbye to 0x addresses, name your account to make it easier to exchange
          assets
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return l`<wui-flex
      .padding=${["0","2l","0","2l"]}
      gap="s"
      class="continue-button-container"
    >
      <wui-button
        fullWidth
        .loading=${this.loading}
        size="lg"
        borderRadius="xs"
        @click=${this.handleContinue.bind(this)}
        >Choose name
      </wui-button>
    </wui-flex>`}handleContinue(){y.push("RegisterAccountName"),T.sendEvent({type:"track",event:"OPEN_ENS_FLOW",properties:{isSmartAccount:tt(x.state.activeChain)===V.ACCOUNT_TYPES.SMART_ACCOUNT}})}};ii.styles=dr;mr([m()],ii.prototype,"loading",void 0);ii=mr([h("w3m-choose-account-name-view")],ii);c();p();u();var qr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},hr=class extends b{constructor(){super(...arguments),this.wallet=y.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return l`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?l`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?l`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?l`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?l`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){this.wallet?.chrome_store&&E.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){this.wallet?.app_store&&E.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&E.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&E.openHref(this.wallet.homepage,"_blank")}};hr=qr([h("w3m-downloads-view")],hr);c();p();u();var Yr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Xr="https://walletconnect.com/explorer",fr=class extends b{render(){return l`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.recommendedWalletsTemplate()}
        <wui-list-wallet
          name="Explore all"
          showAllWallets
          walletIcon="allWallets"
          icon="externalLink"
          @click=${()=>{E.openHref("https://walletconnect.com/explorer?type=wallet","_blank")}}
        ></wui-list-wallet>
      </wui-flex>
    `}recommendedWalletsTemplate(){let{recommended:t,featured:i}=L.state,{customWallets:o}=A.state;return[...i,...o??[],...t].slice(0,4).map(e=>l`
        <wui-list-wallet
          name=${e.name??"Unknown"}
          tagVariant="main"
          imageSrc=${v(I.getWalletImage(e))}
          @click=${()=>{E.openHref(e.homepage??Xr,"_blank")}}
        ></wui-list-wallet>
      `)}};fr=Yr([h("w3m-get-wallet-view")],fr);c();p();u();c();p();u();var wr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ii=class extends b{constructor(){super(...arguments),this.data=[]}render(){return l`
      <wui-flex flexDirection="column" alignItems="center" gap="l">
        ${this.data.map(t=>l`
            <wui-flex flexDirection="column" alignItems="center" gap="xl">
              <wui-flex flexDirection="row" justifyContent="center" gap="1xs">
                ${t.images.map(i=>l`<wui-visual name=${i}></wui-visual>`)}
              </wui-flex>
            </wui-flex>
            <wui-flex flexDirection="column" alignItems="center" gap="xxs">
              <wui-text variant="paragraph-500" color="fg-100" align="center">
                ${t.title}
              </wui-text>
              <wui-text variant="small-500" color="fg-200" align="center">${t.text}</wui-text>
            </wui-flex>
          `)}
      </wui-flex>
    `}};wr([d({type:Array})],Ii.prototype,"data",void 0);Ii=wr([h("w3m-help-widget")],Ii);var Qr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Zr=[{images:["login","profile","lock"],title:"One login for all of web3",text:"Log in to any app by connecting your wallet. Say goodbye to countless passwords!"},{images:["defi","nft","eth"],title:"A home for your digital assets",text:"A wallet lets you store, send and receive digital assets like cryptocurrencies and NFTs."},{images:["browser","noun","dao"],title:"Your gateway to a new web",text:"With your wallet, you can explore and interact with DeFi, NFTs, DAOs, and much more."}],gr=class extends b{render(){return l`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","xl","xl","xl"]}
        alignItems="center"
        gap="xl"
      >
        <w3m-help-widget .data=${Zr}></w3m-help-widget>
        <wui-button variant="main" size="md" @click=${this.onGetWallet.bind(this)}>
          <wui-icon color="inherit" slot="iconLeft" name="wallet"></wui-icon>
          Get a wallet
        </wui-button>
      </wui-flex>
    `}onGetWallet(){T.sendEvent({type:"track",event:"CLICK_GET_WALLET"}),y.push("GetWallet")}};gr=Qr([h("w3m-what-is-a-wallet-view")],gr);c();p();u();c();p();u();var br=C`
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
`;var xr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},oi=class extends b{constructor(){super(),this.unsubscribe=[],this.checked=qt.state.isLegalCheckboxChecked,this.unsubscribe.push(qt.subscribeKey("isLegalCheckboxChecked",t=>{this.checked=t}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let{termsConditionsUrl:t,privacyPolicyUrl:i}=A.state,o=A.state.features?.legalCheckbox,e=!!(t||i)&&!!o,n=e&&!this.checked,a=n?-1:void 0;return l`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${e?["0","s","s","s"]:"s"}
        gap="xs"
        class=${v(n?"disabled":void 0)}
      >
        <w3m-wallet-login-list tabIdx=${v(a)}></w3m-wallet-login-list>
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}};oi.styles=br;xr([m()],oi.prototype,"checked",void 0);oi=xr([h("w3m-connect-wallets-view")],oi);c();p();u();c();p();u();c();p();u();c();p();u();var vr=C`
  :host {
    display: block;
    width: var(--wui-box-size-lg);
    height: var(--wui-box-size-lg);
  }

  svg {
    width: var(--wui-box-size-lg);
    height: var(--wui-box-size-lg);
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
  }

  use {
    stroke: var(--wui-color-accent-100);
    stroke-width: 2px;
    stroke-dasharray: 54, 118;
    stroke-dashoffset: 172;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var Jr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Wi=class extends b{render(){return l`
      <svg viewBox="0 0 54 59">
        <path
          id="wui-loader-path"
          d="M17.22 5.295c3.877-2.277 5.737-3.363 7.72-3.726a11.44 11.44 0 0 1 4.12 0c1.983.363 3.844 1.45 7.72 3.726l6.065 3.562c3.876 2.276 5.731 3.372 7.032 4.938a11.896 11.896 0 0 1 2.06 3.63c.683 1.928.688 4.11.688 8.663v7.124c0 4.553-.005 6.735-.688 8.664a11.896 11.896 0 0 1-2.06 3.63c-1.3 1.565-3.156 2.66-7.032 4.937l-6.065 3.563c-3.877 2.276-5.737 3.362-7.72 3.725a11.46 11.46 0 0 1-4.12 0c-1.983-.363-3.844-1.449-7.72-3.726l-6.065-3.562c-3.876-2.276-5.731-3.372-7.032-4.938a11.885 11.885 0 0 1-2.06-3.63c-.682-1.928-.688-4.11-.688-8.663v-7.124c0-4.553.006-6.735.688-8.664a11.885 11.885 0 0 1 2.06-3.63c1.3-1.565 3.156-2.66 7.032-4.937l6.065-3.562Z"
        />
        <use xlink:href="#wui-loader-path"></use>
      </svg>
    `}};Wi.styles=[W,vr];Wi=Jr([h("wui-loading-hexagon")],Wi);c();p();u();var Cr=C`
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

  wui-loading-hexagon {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: 4px;
    bottom: 0;
    opacity: 0;
    transform: scale(0.5);
    z-index: 1;
  }

  wui-button {
    display: none;
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  wui-button[data-retry='true'] {
    display: block;
    opacity: 1;
  }
`;var Ti=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ae=class extends b{constructor(){super(),this.network=y.state.data?.network,this.unsubscribe=[],this.showRetry=!1,this.error=!1}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}firstUpdated(){this.onSwitchNetwork()}render(){if(!this.network)throw new Error("w3m-network-switch-view: No network provided");this.onShowRetry();let t=this.getLabel(),i=this.getSubLabel();return l`
      <wui-flex
        data-error=${this.error}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","3xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-network-image
            size="lg"
            imageSrc=${v(I.getNetworkImage(this.network))}
          ></wui-network-image>

          ${this.error?null:l`<wui-loading-hexagon></wui-loading-hexagon>`}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            ?border=${!0}
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">${t}</wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${i}</wui-text>
        </wui-flex>

        <wui-button
          data-retry=${this.showRetry}
          variant="accent"
          size="md"
          .disabled=${!this.error}
          @click=${this.onSwitchNetwork.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try again
        </wui-button>
      </wui-flex>
    `}getSubLabel(){let t=$.getConnectorId(x.state.activeChain);return $.getAuthConnector()&&t===k.CONNECTOR_ID.AUTH?"":this.error?"Switch can be declined if chain is not supported by a wallet or previous request is still active":"Accept connection request in your wallet"}getLabel(){let t=$.getConnectorId(x.state.activeChain);return $.getAuthConnector()&&t===k.CONNECTOR_ID.AUTH?`Switching to ${this.network?.name??"Unknown"} network...`:this.error?"Switch declined":"Approve in wallet"}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,this.shadowRoot?.querySelector("wui-button")?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"}))}onSwitchNetwork(){try{this.error=!1,x.state.activeChain!==this.network?.chainNamespace&&x.setIsSwitchingNamespace(!0),this.network&&x.switchActiveNetwork(this.network)}catch{this.error=!0}}};Ae.styles=Cr;Ti([m()],Ae.prototype,"showRetry",void 0);Ti([m()],Ae.prototype,"error",void 0);Ae=Ti([h("w3m-network-switch-view")],Ae);c();p();u();c();p();u();c();p();u();c();p();u();var yr=C`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-md);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button[data-transparent='true'] {
    pointer-events: none;
    background-color: transparent;
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  button:active {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-image {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
    border-radius: 100%;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }
`;var le=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ut=class extends b{constructor(){super(...arguments),this.imageSrc="",this.name="",this.disabled=!1,this.selected=!1,this.transparent=!1}render(){return l`
      <button data-transparent=${this.transparent} ?disabled=${this.disabled}>
        <wui-flex gap="s" alignItems="center">
          ${this.templateNetworkImage()}
          <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text></wui-flex
        >
        ${this.checkmarkTemplate()}
      </button>
    `}checkmarkTemplate(){return this.selected?l`<wui-icon size="sm" color="accent-100" name="checkmarkBold"></wui-icon>`:null}templateNetworkImage(){return this.imageSrc?l`<wui-image size="sm" src=${this.imageSrc} name=${this.name}></wui-image>`:this.imageSrc?null:l`<wui-network-image
        ?round=${!0}
        size="md"
        name=${this.name}
      ></wui-network-image>`}};Ut.styles=[W,N,yr];le([d()],Ut.prototype,"imageSrc",void 0);le([d()],Ut.prototype,"name",void 0);le([d({type:Boolean})],Ut.prototype,"disabled",void 0);le([d({type:Boolean})],Ut.prototype,"selected",void 0);le([d({type:Boolean})],Ut.prototype,"transparent",void 0);Ut=le([h("wui-list-network")],Ut);c();p();u();var $r=C`
  .container {
    max-height: 360px;
    overflow: auto;
  }

  .container::-webkit-scrollbar {
    display: none;
  }
`;var ke=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Vt=class extends b{constructor(){super(),this.unsubscribe=[],this.network=x.state.activeCaipNetwork,this.requestedCaipNetworks=x.getCaipNetworks(),this.search="",this.onDebouncedSearch=E.debounce(t=>{this.search=t},100),this.unsubscribe.push(lt.subscribeNetworkImages(()=>this.requestUpdate()),x.subscribeKey("activeCaipNetwork",t=>this.network=t),x.subscribe(()=>{this.requestedCaipNetworks=x.getAllRequestedCaipNetworks()}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      ${this.templateSearchInput()}
      <wui-flex
        class="container"
        .padding=${["0","s","s","s"]}
        flexDirection="column"
        gap="xs"
      >
        ${this.networksTemplate()}
      </wui-flex>

      <wui-separator></wui-separator>

      <wui-flex padding="s" flexDirection="column" gap="m" alignItems="center">
        <wui-text variant="small-400" color="fg-300" align="center">
          Your connected wallet may not support some of the networks available for this dApp
        </wui-text>
        <wui-link @click=${this.onNetworkHelp.bind(this)}>
          <wui-icon size="xs" color="accent-100" slot="iconLeft" name="helpCircle"></wui-icon>
          What is a network
        </wui-link>
      </wui-flex>
    `}templateSearchInput(){return l`
      <wui-flex gap="xs" .padding=${["0","s","s","s"]}>
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="md"
          placeholder="Search network"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}onInputChange(t){this.onDebouncedSearch(t.detail)}onNetworkHelp(){T.sendEvent({type:"track",event:"CLICK_NETWORK_HELP"}),y.push("WhatIsANetwork")}networksTemplate(){let t=x.getAllApprovedCaipNetworkIds(),i=E.sortRequestedNetworks(t,this.requestedCaipNetworks);return this.search?this.filteredNetworks=i?.filter(o=>o?.name?.toLowerCase().includes(this.search.toLowerCase())):this.filteredNetworks=i,this.filteredNetworks?.map(o=>l`
        <wui-list-network
          .selected=${this.network?.id===o.id}
          imageSrc=${v(I.getNetworkImage(o))}
          type="network"
          name=${o.name??o.id}
          @click=${()=>this.onSwitchNetwork(o)}
          .disabled=${this.getNetworkDisabled(o)}
          data-testid=${`w3m-network-switch-${o.name??o.id}`}
        ></wui-list-network>
      `)}getNetworkDisabled(t){let i=t.chainNamespace,o=_.getCaipAddress(i),r=x.getAllApprovedCaipNetworkIds(),e=x.getNetworkProp("supportsAllNetworks",i)!==!1,n=$.getConnectorId(i),a=$.getAuthConnector(),R=n===k.CONNECTOR_ID.AUTH&&a;return!o||e||R?!1:!r?.includes(t.caipNetworkId)}onSwitchNetwork(t){Bi.onSwitchNetwork({network:t})}};Vt.styles=$r;ke([m()],Vt.prototype,"network",void 0);ke([m()],Vt.prototype,"requestedCaipNetworks",void 0);ke([m()],Vt.prototype,"filteredNetworks",void 0);ke([m()],Vt.prototype,"search",void 0);Vt=ke([h("w3m-networks-view")],Vt);c();p();u();c();p();u();var Er=C`
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

  wui-visual {
    width: var(--wui-wallet-image-size-lg);
    height: var(--wui-wallet-image-size-lg);
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    position: relative;
    overflow: hidden;
  }

  wui-visual::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity var(--wui-ease-out-power-2) var(--wui-duration-lg),
      transform var(--wui-ease-out-power-2) var(--wui-duration-lg);
    will-change: opacity, transform;
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

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
  }

  .capitalize {
    text-transform: capitalize;
  }
`;var Sr=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},tn={eip155:"eth",solana:"solana",bip122:"bitcoin",polkadot:void 0},ri=class extends b{constructor(){super(...arguments),this.unsubscribe=[],this.switchToChain=y.state.data?.switchToChain,this.caipNetwork=y.state.data?.network,this.activeChain=x.state.activeChain}firstUpdated(){this.unsubscribe.push(x.subscribeKey("activeChain",t=>this.activeChain=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.switchToChain?k.CHAIN_NAME_MAP[this.switchToChain]:"supported";if(!this.switchToChain)return null;let i=k.CHAIN_NAME_MAP[this.switchToChain];return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" flexDirection="column" alignItems="center" gap="xl">
          <wui-visual name=${v(tn[this.switchToChain])}></wui-visual>
          <wui-text
            data-testid=${`w3m-switch-active-chain-to-${i}`}
            variant="paragraph-500"
            color="fg-100"
            align="center"
            >Switch to <span class="capitalize">${i}</span></wui-text
          >
          <wui-text variant="small-400" color="fg-200" align="center">
            Connected wallet doesn't support connecting to ${t} chain. You
            need to connect with a different wallet.
          </wui-text>
          <wui-button
            data-testid="w3m-switch-active-chain-button"
            size="md"
            @click=${this.switchActiveChain.bind(this)}
            >Switch</wui-button
          >
        </wui-flex>
      </wui-flex>
    `}async switchActiveChain(){this.switchToChain&&(x.setIsSwitchingNamespace(!0),$.setFilterByNamespace(this.switchToChain),this.caipNetwork?await x.switchActiveNetwork(this.caipNetwork):x.setActiveNamespace(this.switchToChain),y.reset("Connect"))}};ri.styles=Er;Sr([d()],ri.prototype,"activeChain",void 0);ri=Sr([h("w3m-switch-active-chain-view")],ri);c();p();u();var en=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},on=[{images:["network","layers","system"],title:"The system\u2019s nuts and bolts",text:"A network is what brings the blockchain to life, as this technical infrastructure allows apps to access the ledger and smart contract services."},{images:["noun","defiAlt","dao"],title:"Designed for different uses",text:"Each network is designed differently, and may therefore suit certain apps and experiences."}],Ar=class extends b{render(){return l`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","xl","xl","xl"]}
        alignItems="center"
        gap="xl"
      >
        <w3m-help-widget .data=${on}></w3m-help-widget>
        <wui-button
          variant="main"
          size="md"
          @click=${()=>{E.openHref("https://ethereum.org/en/developers/docs/networks/","_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Ar=en([h("w3m-what-is-a-network-view")],Ar);c();p();u();c();p();u();var kr=C`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var _i=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ie=class extends b{constructor(){super(),this.swapUnsupportedChain=y.state.data?.swapUnsupportedChain,this.unsubscribe=[],this.disconnecting=!1,this.remoteFeatures=A.state.remoteFeatures,this.unsubscribe.push(lt.subscribeNetworkImages(()=>this.requestUpdate()),A.subscribeKey("remoteFeatures",t=>{this.remoteFeatures=t}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      <wui-flex class="container" flexDirection="column" gap="0">
        <wui-flex
          class="container"
          flexDirection="column"
          .padding=${["m","xl","xs","xl"]}
          alignItems="center"
          gap="xl"
        >
          ${this.descriptionTemplate()}
        </wui-flex>

        <wui-flex flexDirection="column" padding="s" gap="xs">
          ${this.networksTemplate()}
        </wui-flex>

        <wui-separator text="or"></wui-separator>
        <wui-flex flexDirection="column" padding="s" gap="xs">
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="disconnect"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}descriptionTemplate(){return this.swapUnsupportedChain?l`
        <wui-text variant="small-400" color="fg-200" align="center">
          The swap feature doesn’t support your current network. Switch to an available option to
          continue.
        </wui-text>
      `:l`
      <wui-text variant="small-400" color="fg-200" align="center">
        This app doesn’t support your current network. Switch to an available option to continue.
      </wui-text>
    `}networksTemplate(){let t=x.getAllRequestedCaipNetworks(),i=x.getAllApprovedCaipNetworkIds(),o=E.sortRequestedNetworks(i,t);return(this.swapUnsupportedChain?o.filter(e=>M.SWAP_SUPPORTED_NETWORKS.includes(e.caipNetworkId)):o).map(e=>l`
        <wui-list-network
          imageSrc=${v(I.getNetworkImage(e))}
          name=${e.name??"Unknown"}
          @click=${()=>this.onSwitchNetwork(e)}
        >
        </wui-list-network>
      `)}async onDisconnect(){try{this.disconnecting=!0;let t=x.state.activeChain,o=S.getConnections(t).length>0,r=t&&$.state.activeConnectorIds[t],e=this.remoteFeatures?.multiWallet;await S.disconnect(e?{id:r,namespace:t}:{}),o&&e&&(y.push("ProfileWallets"),O.showSuccess("Wallet deleted"))}catch{T.sendEvent({type:"track",event:"DISCONNECT_ERROR"}),O.showError("Failed to disconnect")}finally{this.disconnecting=!1}}async onSwitchNetwork(t){let i=_.state.caipAddress,o=x.getAllApprovedCaipNetworkIds(),r=x.getNetworkProp("supportsAllNetworks",t.chainNamespace),e=y.state.data;i?o?.includes(t.caipNetworkId)?await x.switchActiveNetwork(t):r?y.push("SwitchNetwork",{...e,network:t}):y.push("SwitchNetwork",{...e,network:t}):i||(x.setActiveCaipNetwork(t),y.push("Connect"))}};Ie.styles=kr;_i([m()],Ie.prototype,"disconnecting",void 0);_i([m()],Ie.prototype,"remoteFeatures",void 0);Ie=_i([h("w3m-unsupported-chain-view")],Ie);c();p();u();c();p();u();c();p();u();c();p();u();var Ir=C`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-s);
    padding: var(--wui-spacing-1xs) var(--wui-spacing-s) var(--wui-spacing-1xs)
      var(--wui-spacing-1xs);
  }
`;var Ri=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},We=class extends b{constructor(){super(...arguments),this.icon="externalLink",this.text=""}render(){return l`
      <wui-flex gap="1xs" alignItems="center">
        <wui-icon-box
          size="sm"
          iconcolor="fg-200"
          backgroundcolor="fg-200"
          icon=${this.icon}
          background="transparent"
        ></wui-icon-box>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
      </wui-flex>
    `}};We.styles=[W,N,Ir];Ri([d()],We.prototype,"icon",void 0);Ri([d()],We.prototype,"text",void 0);We=Ri([h("wui-banner")],We);c();p();u();var Wr=C`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var rn=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Ni=class extends b{constructor(){super(),this.unsubscribe=[]}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l` <wui-flex
      flexDirection="column"
      .padding=${["xs","s","m","s"]}
      gap="xs"
    >
      <wui-banner
        icon="warningCircle"
        text="You can only receive assets on these networks"
      ></wui-banner>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let t=x.getAllRequestedCaipNetworks(),i=x.getAllApprovedCaipNetworkIds(),o=x.state.activeCaipNetwork,r=x.checkIfSmartAccountEnabled(),e=E.sortRequestedNetworks(i,t);if(r&&tt(o?.chainNamespace)===V.ACCOUNT_TYPES.SMART_ACCOUNT){if(!o)return null;e=[o]}return e.filter(a=>a.chainNamespace===o?.chainNamespace).map(a=>l`
        <wui-list-network
          imageSrc=${v(I.getNetworkImage(a))}
          name=${a.name??"Unknown"}
          ?transparent=${!0}
        >
        </wui-list-network>
      `)}};Ni.styles=Wr;Ni=rn([h("w3m-wallet-compatible-networks-view")],Ni);c();p();u();c();p();u();c();p();u();c();p();u();c();p();u();var Tr=C`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--wui-icon-box-size-xl);
    height: var(--wui-icon-box-size-xl);
    box-shadow: 0 0 0 8px var(--wui-thumbnail-border);
    border-radius: var(--local-border-radius);
    overflow: hidden;
  }

  wui-icon {
    width: 32px;
    height: 32px;
  }
`;var ni=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},ce=class extends b{render(){return this.style.cssText=`--local-border-radius: ${this.borderRadiusFull?"1000px":"20px"}; background-color: var(--wui-color-modal-bg);`,l`${this.templateVisual()}`}templateVisual(){return this.imageSrc?l`<wui-image src=${this.imageSrc} alt=${this.alt??""}></wui-image>`:l`<wui-icon
      data-parent-size="md"
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};ce.styles=[W,Tr];ni([d()],ce.prototype,"imageSrc",void 0);ni([d()],ce.prototype,"alt",void 0);ni([d({type:Boolean})],ce.prototype,"borderRadiusFull",void 0);ce=ni([h("wui-visual-thumbnail")],ce);c();p();u();var _r=C`
  :host {
    display: flex;
    justify-content: center;
    gap: var(--wui-spacing-2xl);
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`;var nn=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},Oi=class extends b{constructor(){super(...arguments),this.dappImageUrl=A.state.metadata?.icons,this.walletImageUrl=_.state.connectedWalletInfo?.icon}firstUpdated(){let t=this.shadowRoot?.querySelectorAll("wui-visual-thumbnail");t?.[0]&&this.createAnimation(t[0],"translate(18px)"),t?.[1]&&this.createAnimation(t[1],"translate(-18px)")}render(){return l`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${this.dappImageUrl?.[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(t,i){t.animate([{transform:"translateX(0px)"},{transform:i}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};Oi.styles=_r;Oi=nn([h("w3m-siwx-sign-message-thumbnails")],Oi);var Li=function(s,t,i,o){var r=arguments.length,e=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(s,t,i,o);else for(var a=s.length-1;a>=0;a--)(n=s[a])&&(e=(r<3?n(e):r>3?n(t,i,e):n(t,i))||e);return r>3&&e&&Object.defineProperty(t,i,e),e},si=class extends b{constructor(){super(...arguments),this.dappName=A.state.metadata?.name,this.isCancelling=!1,this.isSigning=!1}render(){return l`
      <wui-flex justifyContent="center" .padding=${["2xl","0","xxl","0"]}>
        <w3m-siwx-sign-message-thumbnails></w3m-siwx-sign-message-thumbnails>
      </wui-flex>
      <wui-flex
        .padding=${["0","4xl","l","4xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex
        .padding=${["0","3xl","l","3xl"]}
        gap="s"
        justifyContent="space-between"
      >
        <wui-text variant="small-400" align="center" color="fg-200"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["l","xl","xl","xl"]} gap="s" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral"
          ?loading=${this.isCancelling}
          @click=${this.onCancel.bind(this)}
          data-testid="w3m-connecting-siwe-cancel"
        >
          ${this.isCancelling?"Cancelling...":"Cancel"}
        </wui-button>
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="main"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0,await ai.requestSignMessage().finally(()=>this.isSigning=!1)}async onCancel(){this.isCancelling=!0,await ai.cancelSignMessage().finally(()=>this.isCancelling=!1)}};Li([m()],si.prototype,"isCancelling",void 0);Li([m()],si.prototype,"isSigning",void 0);si=Li([h("w3m-siwx-sign-message-view")],si);export{Yi as AppKitAccountButton,Zi as AppKitButton,eo as AppKitConnectButton,no as AppKitNetworkButton,qi as W3mAccountButton,Ct as W3mAccountSettingsView,fi as W3mAccountView,je as W3mAllWalletsView,Qi as W3mButton,ii as W3mChooseAccountNameView,to as W3mConnectButton,at as W3mConnectView,oi as W3mConnectWalletsView,or as W3mConnectingExternalView,ti as W3mConnectingMultiChainView,ki as W3mConnectingWcBasicView,ae as W3mConnectingWcView,hr as W3mDownloadsView,fr as W3mGetWalletView,ro as W3mNetworkButton,Ae as W3mNetworkSwitchView,Vt as W3mNetworksView,X as W3mProfileWalletsView,sn as W3mRouter,si as W3mSIWXSignMessageView,ri as W3mSwitchActiveChainView,Ie as W3mUnsupportedChainView,Ni as W3mWalletCompatibleNetworksView,Ar as W3mWhatIsANetworkView,gr as W3mWhatIsAWalletView};
