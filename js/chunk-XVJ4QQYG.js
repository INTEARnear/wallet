import{a as Ei}from"./chunk-S3KPEUSS.js";import{a as ot}from"./chunk-PPLSOLUM.js";import{a as Ci,b as q,c as vi,f as $i}from"./chunk-6T7Q26JY.js";import{a as xi}from"./chunk-4QOCBQPC.js";import{a as tt,b as it}from"./chunk-BDSQF46L.js";import{a as C}from"./chunk-B2LU4KHT.js";import{f as bt,h as Tt,k as Ze,n as K,p as et,r as E,v as R,w as W,x as B,z as f}from"./chunk-RZQOM5QR.js";import{a as d,b as m,f as Wt}from"./chunk-IDZGCU4F.js";import{b as U,e as u,k as y}from"./chunk-ZS2R6O6N.js";import{A as te,B as $,C as he,F as gi,H as v,I as T,K as Ye,M as ie,N as _,O as A,P as O,Q as Ae,R as Qe,S as x,T as Je,U as S,X as fe,Z as ae,aa as k,ga as h,ha as yi,ia as j,j as I,o as wi,q as bi,r as Xe,z as D}from"./chunk-OXOEMY67.js";import{i as l,k as c,o as p}from"./chunk-JY5TIRRF.js";l();p();c();l();p();c();l();p();c();l();p();c();l();p();c();var Si=E`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:t})=>t[20]};
    background: ${({tokens:t})=>t.theme.foregroundPrimary};
    display: flex;
    gap: ${({spacing:t})=>t[1]};
    padding: ${({spacing:t})=>t[1]};
    color: ${({tokens:t})=>t.theme.textSecondary};
    border-radius: ${({borderRadius:t})=>t[16]};
    height: 32px;
    transition: box-shadow ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: box-shadow;
  }

  button wui-flex.avatar-container {
    width: 28px;
    height: 24px;
    position: relative;

    wui-flex.network-image-container {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 12px;
      height: 12px;
    }

    wui-flex.network-image-container wui-icon {
      background: ${({tokens:t})=>t.theme.foregroundPrimary};
    }

    wui-avatar {
      width: 24px;
      min-width: 24px;
      height: 24px;
    }

    wui-icon {
      width: 12px;
      height: 12px;
    }
  }

  wui-image,
  wui-icon {
    border-radius: ${({borderRadius:t})=>t[16]};
  }

  wui-text {
    white-space: nowrap;
  }

  button wui-flex.balance-container {
    height: 100%;
    border-radius: ${({borderRadius:t})=>t[16]};
    padding-left: ${({spacing:t})=>t[1]};
    padding-right: ${({spacing:t})=>t[1]};
    background: ${({tokens:t})=>t.theme.foregroundSecondary};
    color: ${({tokens:t})=>t.theme.textPrimary};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:focus-visible:enabled,
  button:active:enabled {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);

    wui-flex.balance-container {
      background: ${({tokens:t})=>t.theme.foregroundTertiary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled wui-text,
  button:disabled wui-flex.avatar-container {
    opacity: 0.3;
  }
`;var we=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},oe=class extends y{constructor(){super(...arguments),this.networkSrc=void 0,this.avatarSrc=void 0,this.balance=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.loading=!1,this.address="",this.profileName="",this.charsStart=4,this.charsEnd=6}render(){return u`
      <button
        ?disabled=${this.disabled}
        class=${C(this.balance?void 0:"local-no-balance")}
        data-error=${C(this.isUnsupportedChain)}
      >
        ${this.imageTemplate()} ${this.addressTemplate()} ${this.balanceTemplate()}
      </button>
    `}imageTemplate(){let e=this.networkSrc?u`<wui-image src=${this.networkSrc}></wui-image>`:u` <wui-icon size="inherit" color="inherit" name="networkPlaceholder"></wui-icon> `;return u`<wui-flex class="avatar-container">
      <wui-avatar
        .imageSrc=${this.avatarSrc}
        alt=${this.address}
        address=${this.address}
      ></wui-avatar>

      <wui-flex class="network-image-container">${e}</wui-flex>
    </wui-flex>`}addressTemplate(){return u`<wui-text variant="md-regular" color="inherit">
      ${this.address?B.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?18:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"}):null}
    </wui-text>`}balanceTemplate(){if(this.balance){let e=this.loading?u`<wui-loading-spinner size="md" color="inherit"></wui-loading-spinner>`:u`<wui-text variant="md-regular" color="inherit"> ${this.balance}</wui-text>`;return u`<wui-flex alignItems="center" justifyContent="center" class="balance-container"
        >${e}</wui-flex
      >`}return null}};oe.styles=[R,W,Si];we([d()],oe.prototype,"networkSrc",void 0);we([d()],oe.prototype,"avatarSrc",void 0);we([d()],oe.prototype,"balance",void 0);we([d({type:Boolean})],oe.prototype,"isUnsupportedChain",void 0);we([d({type:Boolean})],oe.prototype,"disabled",void 0);we([d({type:Boolean})],oe.prototype,"loading",void 0);we([d()],oe.prototype,"address",void 0);we([d()],oe.prototype,"profileName",void 0);we([d()],oe.prototype,"charsStart",void 0);we([d()],oe.prototype,"charsEnd",void 0);oe=we([f("wui-account-button")],oe);var G=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},M=class extends y{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance="show",this.charsStart=4,this.charsEnd=6,this.namespace=void 0,this.isSupported=v.state.allowUnsupportedChain?!0:h.state.activeChain?h.checkIfSupportedNetwork(h.state.activeChain):!0}connectedCallback(){super.connectedCallback(),this.setAccountData(h.getAccountData(this.namespace)),this.setNetworkData(h.getNetworkData(this.namespace))}firstUpdated(){let e=this.namespace;e?this.unsubscribe.push(h.subscribeChainProp("accountState",i=>{this.setAccountData(i)},e),h.subscribeChainProp("networkState",i=>{this.setNetworkData(i),this.isSupported=h.checkIfSupportedNetwork(e,i?.caipNetwork?.caipNetworkId)},e)):this.unsubscribe.push(ie.subscribeNetworkImages(()=>{this.networkImage=_.getNetworkImage(this.network)}),h.subscribeKey("activeCaipAddress",i=>{this.caipAddress=i}),h.subscribeChainProp("accountState",i=>{this.setAccountData(i)}),h.subscribeKey("activeCaipNetwork",i=>{this.network=i,this.networkImage=_.getNetworkImage(i),this.isSupported=i?.chainNamespace?h.checkIfSupportedNetwork(i?.chainNamespace):!0,this.fetchNetworkImage(i)}))}updated(){this.fetchNetworkImage(this.network)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!h.state.activeChain)return null;let e=this.balance==="show",i=typeof this.balanceVal!="string",{formattedText:r}=$.parseBalance(this.balanceVal,this.balanceSymbol);return u`
      <wui-account-button
        .disabled=${!!this.disabled}
        .isUnsupportedChain=${v.state.allowUnsupportedChain?!1:!this.isSupported}
        address=${C($.getPlainAddress(this.caipAddress))}
        profileName=${C(this.profileName)}
        networkSrc=${C(this.networkImage)}
        avatarSrc=${C(this.profileImage)}
        balance=${e?r:""}
        @click=${this.onClick.bind(this)}
        data-testid=${`account-button${this.namespace?`-${this.namespace}`:""}`}
        .charsStart=${this.charsStart}
        .charsEnd=${this.charsEnd}
        ?loading=${i}
      >
      </wui-account-button>
    `}onClick(){this.isSupported||v.state.allowUnsupportedChain?j.open({namespace:this.namespace}):j.open({view:"UnsupportedChain"})}async fetchNetworkImage(e){e?.assets?.imageId&&(this.networkImage=await _.fetchNetworkImage(e?.assets?.imageId))}setAccountData(e){e&&(this.caipAddress=e.caipAddress,this.balanceVal=e.balance,this.balanceSymbol=e.balanceSymbol,this.profileName=e.profileName,this.profileImage=e.profileImage)}setNetworkData(e){e&&(this.network=e.caipNetwork,this.networkImage=_.getNetworkImage(e.caipNetwork))}};G([d({type:Boolean})],M.prototype,"disabled",void 0);G([d()],M.prototype,"balance",void 0);G([d()],M.prototype,"charsStart",void 0);G([d()],M.prototype,"charsEnd",void 0);G([d()],M.prototype,"namespace",void 0);G([m()],M.prototype,"caipAddress",void 0);G([m()],M.prototype,"balanceVal",void 0);G([m()],M.prototype,"balanceSymbol",void 0);G([m()],M.prototype,"profileName",void 0);G([m()],M.prototype,"profileImage",void 0);G([m()],M.prototype,"network",void 0);G([m()],M.prototype,"networkImage",void 0);G([m()],M.prototype,"isSupported",void 0);var ki=class extends M{};ki=G([f("w3m-account-button")],ki);var Ai=class extends M{};Ai=G([f("appkit-account-button")],Ai);l();p();c();l();p();c();var Ri=U`
  :host {
    display: block;
    width: max-content;
  }
`;var be=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Y=class extends y{constructor(){super(...arguments),this.unsubscribe=[],this.disabled=!1,this.balance=void 0,this.size=void 0,this.label=void 0,this.loadingLabel=void 0,this.charsStart=4,this.charsEnd=6,this.namespace=void 0}firstUpdated(){this.caipAddress=this.namespace?h.getAccountData(this.namespace)?.caipAddress:h.state.activeCaipAddress,this.namespace?this.unsubscribe.push(h.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress},this.namespace)):this.unsubscribe.push(h.subscribeKey("activeCaipAddress",e=>this.caipAddress=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return this.caipAddress?u`
          <appkit-account-button
            .disabled=${!!this.disabled}
            balance=${C(this.balance)}
            .charsStart=${C(this.charsStart)}
            .charsEnd=${C(this.charsEnd)}
            namespace=${C(this.namespace)}
          >
          </appkit-account-button>
        `:u`
          <appkit-connect-button
            size=${C(this.size)}
            label=${C(this.label)}
            loadingLabel=${C(this.loadingLabel)}
            namespace=${C(this.namespace)}
          ></appkit-connect-button>
        `}};Y.styles=Ri;be([d({type:Boolean})],Y.prototype,"disabled",void 0);be([d()],Y.prototype,"balance",void 0);be([d()],Y.prototype,"size",void 0);be([d()],Y.prototype,"label",void 0);be([d()],Y.prototype,"loadingLabel",void 0);be([d()],Y.prototype,"charsStart",void 0);be([d()],Y.prototype,"charsEnd",void 0);be([d()],Y.prototype,"namespace",void 0);be([m()],Y.prototype,"caipAddress",void 0);var Ii=class extends Y{};Ii=be([f("w3m-button")],Ii);var _i=class extends Y{};_i=be([f("appkit-button")],_i);l();p();c();l();p();c();l();p();c();l();p();c();var Ti=E`
  :host {
    position: relative;
    display: block;
  }

  button {
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  button[data-size='sm'] {
    padding: ${({spacing:t})=>t[2]};
  }

  button[data-size='md'] {
    padding: ${({spacing:t})=>t[3]};
  }

  button[data-size='lg'] {
    padding: ${({spacing:t})=>t[4]};
  }

  button[data-variant='primary'] {
    background: ${({tokens:t})=>t.core.backgroundAccentPrimary};
  }

  button[data-variant='secondary'] {
    background: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button:hover:enabled {
    border-radius: ${({borderRadius:t})=>t[3]};
  }

  button:disabled {
    cursor: not-allowed;
  }

  button[data-loading='true'] {
    cursor: not-allowed;
  }

  button[data-loading='true'][data-size='sm'] {
    border-radius: ${({borderRadius:t})=>t[32]};
    padding: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[3]};
  }

  button[data-loading='true'][data-size='md'] {
    border-radius: ${({borderRadius:t})=>t[20]};
    padding: ${({spacing:t})=>t[3]} ${({spacing:t})=>t[4]};
  }

  button[data-loading='true'][data-size='lg'] {
    border-radius: ${({borderRadius:t})=>t[16]};
    padding: ${({spacing:t})=>t[4]} ${({spacing:t})=>t[5]};
  }
`;var gt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Oe=class extends y{constructor(){super(...arguments),this.size="md",this.variant="primary",this.loading=!1,this.text="Connect Wallet"}render(){return u`
      <button
        data-loading=${this.loading}
        data-variant=${this.variant}
        data-size=${this.size}
        ?disabled=${this.loading}
      >
        ${this.contentTemplate()}
      </button>
    `}contentTemplate(){let e={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},i={primary:"invert",secondary:"accent-primary"};return this.loading?u`<wui-loading-spinner
      color=${i[this.variant]}
      size=${this.size}
    ></wui-loading-spinner>`:u` <wui-text variant=${e[this.size]} color=${i[this.variant]}>
        ${this.text}
      </wui-text>`}};Oe.styles=[R,W,Ti];gt([d()],Oe.prototype,"size",void 0);gt([d()],Oe.prototype,"variant",void 0);gt([d({type:Boolean})],Oe.prototype,"loading",void 0);gt([d()],Oe.prototype,"text",void 0);Oe=gt([f("wui-connect-button")],Oe);var Re=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ce=class extends y{constructor(){super(),this.unsubscribe=[],this.size="md",this.label="Connect Wallet",this.loadingLabel="Connecting...",this.open=j.state.open,this.loading=this.namespace?j.state.loadingNamespaceMap.get(this.namespace):j.state.loading,this.unsubscribe.push(j.subscribe(e=>{this.open=e.open,this.loading=this.namespace?e.loadingNamespaceMap.get(this.namespace):e.loading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u`
      <wui-connect-button
        size=${C(this.size)}
        .loading=${this.loading}
        @click=${this.onClick.bind(this)}
        data-testid=${`connect-button${this.namespace?`-${this.namespace}`:""}`}
      >
        ${this.loading?this.loadingLabel:this.label}
      </wui-connect-button>
    `}onClick(){this.open?j.close():this.loading||j.open({view:"Connect",namespace:this.namespace})}};Re([d()],Ce.prototype,"size",void 0);Re([d()],Ce.prototype,"label",void 0);Re([d()],Ce.prototype,"loadingLabel",void 0);Re([d()],Ce.prototype,"namespace",void 0);Re([m()],Ce.prototype,"open",void 0);Re([m()],Ce.prototype,"loading",void 0);var Wi=class extends Ce{};Wi=Re([f("w3m-connect-button")],Wi);var Ni=class extends Ce{};Ni=Re([f("appkit-connect-button")],Ni);l();p();c();l();p();c();l();p();c();l();p();c();var Oi=E`
  :host {
    display: block;
  }

  button {
    border-radius: ${({borderRadius:t})=>t[32]};
    display: flex;
    gap: ${({spacing:t})=>t[1]};
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]}
      ${({spacing:t})=>t[1]} ${({spacing:t})=>t[1]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    }
  }

  button[data-size='sm'] > wui-icon-box,
  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-icon-box,
  button[data-size='md'] > wui-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='lg'] > wui-icon-box,
  button[data-size='lg'] > wui-image {
    width: 24px;
    height: 24px;
  }

  wui-image,
  wui-icon-box {
    border-radius: ${({borderRadius:t})=>t[32]};
  }
`;var yt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Pe=class extends y{constructor(){super(...arguments),this.imageSrc=void 0,this.isUnsupportedChain=void 0,this.disabled=!1,this.size="lg"}render(){let e={sm:"sm-regular",md:"md-regular",lg:"lg-regular"};return u`
      <button data-size=${this.size} data-testid="wui-network-button" ?disabled=${this.disabled}>
        ${this.visualTemplate()}
        <wui-text variant=${e[this.size]} color="primary">
          <slot></slot>
        </wui-text>
      </button>
    `}visualTemplate(){return this.isUnsupportedChain?u` <wui-icon-box color="error" icon="warningCircle"></wui-icon-box> `:this.imageSrc?u`<wui-image src=${this.imageSrc}></wui-image>`:u` <wui-icon size="xl" color="default" name="networkPlaceholder"></wui-icon> `}};Pe.styles=[R,W,Oi];yt([d()],Pe.prototype,"imageSrc",void 0);yt([d({type:Boolean})],Pe.prototype,"isUnsupportedChain",void 0);yt([d({type:Boolean})],Pe.prototype,"disabled",void 0);yt([d()],Pe.prototype,"size",void 0);Pe=yt([f("wui-network-button")],Pe);l();p();c();var Pi=U`
  :host {
    display: block;
    width: max-content;
  }
`;var Ee=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},le=class extends y{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.network=h.state.activeCaipNetwork,this.networkImage=_.getNetworkImage(this.network),this.caipAddress=h.state.activeCaipAddress,this.loading=j.state.loading,this.isSupported=v.state.allowUnsupportedChain?!0:h.state.activeChain?h.checkIfSupportedNetwork(h.state.activeChain):!0,this.unsubscribe.push(ie.subscribeNetworkImages(()=>{this.networkImage=_.getNetworkImage(this.network)}),h.subscribeKey("activeCaipAddress",e=>{this.caipAddress=e}),h.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=_.getNetworkImage(e),this.isSupported=e?.chainNamespace?h.checkIfSupportedNetwork(e.chainNamespace):!0,_.fetchNetworkImage(e?.assets?.imageId)}),j.subscribeKey("loading",e=>this.loading=e))}firstUpdated(){_.fetchNetworkImage(this.network?.assets?.imageId)}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.network?h.checkIfSupportedNetwork(this.network.chainNamespace):!0;return u`
      <wui-network-button
        .disabled=${!!(this.disabled||this.loading)}
        .isUnsupportedChain=${v.state.allowUnsupportedChain?!1:!e}
        imageSrc=${C(this.networkImage)}
        @click=${this.onClick.bind(this)}
        data-testid="w3m-network-button"
      >
        ${this.getLabel()}
        <slot></slot>
      </wui-network-button>
    `}getLabel(){return this.network?!this.isSupported&&!v.state.allowUnsupportedChain?"Switch Network":this.network.name:this.label?this.label:this.caipAddress?"Unknown Network":"Select Network"}onClick(){this.loading||(A.sendEvent({type:"track",event:"CLICK_NETWORKS"}),j.open({view:"Networks"}))}};le.styles=Pi;Ee([d({type:Boolean})],le.prototype,"disabled",void 0);Ee([d({type:String})],le.prototype,"label",void 0);Ee([m()],le.prototype,"network",void 0);Ee([m()],le.prototype,"networkImage",void 0);Ee([m()],le.prototype,"caipAddress",void 0);Ee([m()],le.prototype,"loading",void 0);Ee([m()],le.prototype,"isSupported",void 0);var Li=class extends le{};Li=Ee([f("w3m-network-button")],Li);var Di=class extends le{};Di=Ee([f("appkit-network-button")],Di);l();p();c();l();p();c();l();p();c();l();p();c();l();p();c();var Ui=E`
  :host {
    display: block;
  }

  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:t})=>t[4]};
    padding: ${({spacing:t})=>t[3]};
    border-radius: ${({borderRadius:t})=>t[4]};
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  wui-flex > wui-icon {
    padding: ${({spacing:t})=>t[2]};
    color: ${({tokens:t})=>t.theme.textInvert};
    background-color: ${({tokens:t})=>t.core.backgroundAccentPrimary};
    border-radius: ${({borderRadius:t})=>t[2]};
    align-items: center;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.core.foregroundAccent020};
    }
  }
`;var Nt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},rt=class extends y{constructor(){super(...arguments),this.label="",this.description="",this.icon="wallet"}render(){return u`
      <button>
        <wui-flex gap="2" alignItems="center">
          <wui-icon weight="fill" size="lg" name=${this.icon} color="inherit"></wui-icon>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.label}</wui-text>
            <wui-text variant="md-regular" color="tertiary">${this.description}</wui-text>
          </wui-flex>
        </wui-flex>
        <wui-icon size="lg" color="accent-primary" name="chevronRight"></wui-icon>
      </button>
    `}};rt.styles=[R,W,Ui];Nt([d()],rt.prototype,"label",void 0);Nt([d()],rt.prototype,"description",void 0);Nt([d()],rt.prototype,"icon",void 0);rt=Nt([f("wui-notice-card")],rt);l();p();c();var ji=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Zt=class extends y{constructor(){super(),this.unsubscribe=[],this.socialProvider=te.getConnectedSocialProvider(),this.socialUsername=te.getConnectedSocialUsername(),this.namespace=h.state.activeChain,this.unsubscribe.push(h.subscribeKey("activeChain",e=>{this.namespace=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=S.getConnectorId(this.namespace),i=S.getAuthConnector();if(!i||e!==I.CONNECTOR_ID.AUTH)return this.style.cssText="display: none",null;let r=i.provider.getEmail()??"";return!r&&!this.socialUsername?(this.style.cssText="display: none",null):u`
      <wui-list-item
        ?rounded=${!0}
        icon=${this.socialProvider??"mail"}
        data-testid="w3m-account-email-update"
        ?chevron=${!this.socialProvider}
        @click=${()=>{this.onGoToUpdateEmail(r,this.socialProvider)}}
      >
        <wui-text variant="lg-regular" color="primary">${this.getAuthName(r)}</wui-text>
      </wui-list-item>
    `}onGoToUpdateEmail(e,i){i||x.push("UpdateEmailWallet",{email:e,redirectView:"Account"})}getAuthName(e){return this.socialUsername?this.socialProvider==="discord"&&this.socialUsername.endsWith("0")?this.socialUsername.slice(0,-1):this.socialUsername:e.length>30?`${e.slice(0,-3)}...`:e}};ji([m()],Zt.prototype,"namespace",void 0);Zt=ji([f("w3m-account-auth-button")],Zt);var Le=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ie=class extends y{constructor(){super(),this.usubscribe=[],this.networkImages=ie.state.networkImages,this.address=h.getAccountData()?.address,this.profileImage=h.getAccountData()?.profileImage,this.profileName=h.getAccountData()?.profileName,this.network=h.state.activeCaipNetwork,this.disconnecting=!1,this.remoteFeatures=v.state.remoteFeatures,this.usubscribe.push(h.subscribeChainProp("accountState",e=>{e&&(this.address=e.address,this.profileImage=e.profileImage,this.profileName=e.profileName)}),h.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}),v.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.usubscribe.forEach(e=>e())}render(){if(!this.address)throw new Error("w3m-account-settings-view: No account provided");let e=this.networkImages[this.network?.assets?.imageId??""];return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="4"
        .padding=${["0","5","3","5"]}
      >
        <wui-avatar
          alt=${this.address}
          address=${this.address}
          imageSrc=${C(this.profileImage)}
          size="lg"
        ></wui-avatar>
        <wui-flex flexDirection="column" alignItems="center">
          <wui-flex gap="1" alignItems="center" justifyContent="center">
            <wui-text variant="h5-medium" color="primary" data-testid="account-settings-address">
              ${B.getTruncateString({string:this.address,charsStart:4,charsEnd:6,truncate:"middle"})}
            </wui-text>
            <wui-icon-link
              size="md"
              icon="copy"
              iconColor="default"
              @click=${this.onCopyAddress}
            ></wui-icon-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
      <wui-flex flexDirection="column" gap="4">
        <wui-flex flexDirection="column" gap="2" .padding=${["6","4","3","4"]}>
          ${this.authCardTemplate()}
          <w3m-account-auth-button></w3m-account-auth-button>
          <wui-list-item
            imageSrc=${C(e)}
            ?chevron=${this.isAllowedNetworkSwitch()}
            ?fullSize=${!0}
            ?rounded=${!0}
            @click=${this.onNetworks.bind(this)}
            data-testid="account-switch-network-button"
          >
            <wui-text variant="lg-regular" color="primary">
              ${this.network?.name??"Unknown"}
            </wui-text>
          </wui-list-item>
          ${this.smartAccountSettingsTemplate()} ${this.chooseNameButtonTemplate()}
          <wui-list-item
            ?rounded=${!0}
            icon="power"
            iconColor="error"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}chooseNameButtonTemplate(){let e=this.network?.chainNamespace,i=S.getConnectorId(e),r=S.getAuthConnector();return!h.checkIfNamesSupported()||!r||i!==I.CONNECTOR_ID.AUTH||this.profileName?null:u`
      <wui-list-item
        icon="id"
        ?rounded=${!0}
        ?chevron=${!0}
        @click=${this.onChooseName.bind(this)}
        data-testid="account-choose-name-button"
      >
        <wui-text variant="lg-regular" color="primary">Choose account name </wui-text>
      </wui-list-item>
    `}authCardTemplate(){let e=S.getConnectorId(this.network?.chainNamespace),i=S.getAuthConnector(),{origin:r}=location;return!i||e!==I.CONNECTOR_ID.AUTH||r.includes(D.SECURE_SITE)?null:u`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}isAllowedNetworkSwitch(){let e=h.getAllRequestedCaipNetworks(),i=e?e.length>1:!1,r=e?.find(({id:n})=>n===this.network?.id);return i||!r}onCopyAddress(){try{this.address&&($.copyToClopboard(this.address),T.showSuccess("Address copied"))}catch{T.showError("Failed to copy")}}smartAccountSettingsTemplate(){let e=this.network?.chainNamespace,i=h.checkIfSmartAccountEnabled(),r=S.getConnectorId(e);return!S.getAuthConnector()||r!==I.CONNECTOR_ID.AUTH||!i?null:u`
      <wui-list-item
        icon="user"
        ?rounded=${!0}
        ?chevron=${!0}
        @click=${this.onSmartAccountSettings.bind(this)}
        data-testid="account-smart-account-settings-button"
      >
        <wui-text variant="lg-regular" color="primary">Smart Account Settings</wui-text>
      </wui-list-item>
    `}onChooseName(){x.push("ChooseAccountName")}onNetworks(){this.isAllowedNetworkSwitch()&&x.push("Networks")}async onDisconnect(){try{this.disconnecting=!0;let e=this.network?.chainNamespace,r=k.getConnections(e).length>0,n=e&&S.state.activeConnectorIds[e],o=this.remoteFeatures?.multiWallet;await k.disconnect(o?{id:n,namespace:e}:{}),r&&o&&(x.push("ProfileWallets"),T.showSuccess("Wallet deleted"))}catch{A.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),T.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onGoToUpgradeView(){A.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),x.push("UpgradeEmailWallet")}onSmartAccountSettings(){x.push("SmartAccountSettings")}};Le([m()],Ie.prototype,"address",void 0);Le([m()],Ie.prototype,"profileImage",void 0);Le([m()],Ie.prototype,"profileName",void 0);Le([m()],Ie.prototype,"network",void 0);Le([m()],Ie.prototype,"disconnecting",void 0);Le([m()],Ie.prototype,"remoteFeatures",void 0);Ie=Le([f("w3m-account-settings-view")],Ie);l();p();c();l();p();c();l();p();c();l();p();c();l();p();c();l();p();c();var Bi=E`
  :host {
    flex: 1;
    height: 100%;
  }

  button {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]};
    column-gap: ${({spacing:t})=>t[1]};
    color: ${({tokens:t})=>t.theme.textSecondary};
    border-radius: ${({borderRadius:t})=>t[20]};
    background-color: transparent;
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-active='true'] {
    color: ${({tokens:t})=>t.theme.textPrimary};
    background-color: ${({tokens:t})=>t.theme.foregroundTertiary};
  }

  button:hover:enabled:not([data-active='true']),
  button:active:enabled:not([data-active='true']) {
    wui-text,
    wui-icon {
      color: ${({tokens:t})=>t.theme.textPrimary};
    }
  }
`;var xt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},or={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},rr={lg:"md",md:"sm",sm:"sm"},De=class extends y{constructor(){super(...arguments),this.icon="mobile",this.size="md",this.label="",this.active=!1}render(){return u`
      <button data-active=${this.active}>
        ${this.icon?u`<wui-icon size=${rr[this.size]} name=${this.icon}></wui-icon>`:""}
        <wui-text variant=${or[this.size]}> ${this.label} </wui-text>
      </button>
    `}};De.styles=[R,W,Bi];xt([d()],De.prototype,"icon",void 0);xt([d()],De.prototype,"size",void 0);xt([d()],De.prototype,"label",void 0);xt([d({type:Boolean})],De.prototype,"active",void 0);De=xt([f("wui-tab-item")],De);l();p();c();var zi=E`
  :host {
    display: inline-flex;
    align-items: center;
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    border-radius: ${({borderRadius:t})=>t[32]};
    padding: ${({spacing:t})=>t["01"]};
    box-sizing: border-box;
  }

  :host([data-size='sm']) {
    height: 26px;
  }

  :host([data-size='md']) {
    height: 36px;
  }
`;var Ct=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ue=class extends y{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size="md",this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((e,i)=>{let r=i===this.activeTab;return u`
        <wui-tab-item
          @click=${()=>this.onTabClick(i)}
          icon=${e.icon}
          size=${this.size}
          label=${e.label}
          ?active=${r}
          data-active=${r}
          data-testid="tab-${e.label?.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(e){this.activeTab=e,this.onTabChange(e)}};Ue.styles=[R,W,zi];Ct([d({type:Array})],Ue.prototype,"tabs",void 0);Ct([d()],Ue.prototype,"onTabChange",void 0);Ct([d()],Ue.prototype,"size",void 0);Ct([m()],Ue.prototype,"activeTab",void 0);Ue=Ct([f("wui-tabs")],Ue);l();p();c();var Fi=E`
  wui-icon-link {
    margin-right: calc(${({spacing:t})=>t[8]} * -1);
  }

  wui-notice-card {
    margin-bottom: ${({spacing:t})=>t[1]};
  }

  wui-list-item > wui-text {
    flex: 1;
  }

  w3m-transactions-view {
    max-height: 200px;
  }

  .balance-container {
    display: inline;
  }

  .tab-content-container {
    height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .symbol {
    transform: translateY(-2px);
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
    gap: ${({spacing:t})=>t[3]};
    height: 48px;
    padding: ${({spacing:t})=>t[2]};
    padding-right: ${({spacing:t})=>t[3]};
    box-shadow: inset 0 0 0 1px ${({tokens:t})=>t.theme.foregroundPrimary};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[6]};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
  }

  .account-button:hover {
    background-color: ${({tokens:t})=>t.core.glass010};
  }

  .avatar-container {
    position: relative;
  }

  wui-avatar.avatar {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px ${({tokens:t})=>t.core.glass010};
  }

  wui-wallet-switch {
    margin-top: ${({spacing:t})=>t[2]};
  }

  wui-avatar.network-avatar {
    width: 16px;
    height: 16px;
    position: absolute;
    left: 100%;
    top: 100%;
    transform: translate(-75%, -75%);
    box-shadow: 0 0 0 2px ${({tokens:t})=>t.core.glass010};
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
      background-color ${({durations:t})=>t.md}
        ${({easings:t})=>t["ease-out-power-1"]},
      opacity ${({durations:t})=>t.md} ${({easings:t})=>t["ease-out-power-1"]};
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
`;var ce=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Q=class extends y{constructor(){super(),this.unsubscribe=[],this.caipAddress=h.getAccountData()?.caipAddress,this.address=$.getPlainAddress(h.getAccountData()?.caipAddress),this.profileImage=h.getAccountData()?.profileImage,this.profileName=h.getAccountData()?.profileName,this.disconnecting=!1,this.balance=h.getAccountData()?.balance,this.balanceSymbol=h.getAccountData()?.balanceSymbol,this.features=v.state.features,this.remoteFeatures=v.state.remoteFeatures,this.namespace=h.state.activeChain,this.activeConnectorIds=S.state.activeConnectorIds,this.unsubscribe.push(h.subscribeChainProp("accountState",e=>{this.address=$.getPlainAddress(e?.caipAddress),this.caipAddress=e?.caipAddress,this.balance=e?.balance,this.balanceSymbol=e?.balanceSymbol,this.profileName=e?.profileName,this.profileImage=e?.profileImage}),v.subscribeKey("features",e=>this.features=e),v.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),S.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),h.subscribeKey("activeChain",e=>this.namespace=e),h.subscribeKey("activeCaipNetwork",e=>{e?.chainNamespace&&(this.namespace=e?.chainNamespace)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.caipAddress||!this.namespace)return null;let e=this.activeConnectorIds[this.namespace],i=e?S.getConnectorById(e):void 0,r=_.getConnectorImage(i),{value:n,decimals:o,symbol:s}=$.parseBalance(this.balance,this.balanceSymbol);return u`<wui-flex
        flexDirection="column"
        .padding=${["0","5","4","5"]}
        alignItems="center"
        gap="3"
      >
        <wui-avatar
          alt=${C(this.caipAddress)}
          address=${C($.getPlainAddress(this.caipAddress))}
          imageSrc=${C(this.profileImage===null?void 0:this.profileImage)}
          data-testid="single-account-avatar"
        ></wui-avatar>
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          imageSrc=${r}
          alt=${i?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>
        <div class="balance-container">
          <wui-text variant="h3-regular" color="primary">${n}</wui-text>
          <wui-text variant="h3-regular" color="secondary">.${o}</wui-text>
          <wui-text variant="h6-medium" color="primary" class="symbol">${s}</wui-text>
        </div>
        ${this.explorerBtnTemplate()}
      </wui-flex>

      <wui-flex flexDirection="column" gap="2" .padding=${["0","3","3","3"]}>
        ${this.authCardTemplate()} <w3m-account-auth-button></w3m-account-auth-button>
        ${this.orderedFeaturesTemplate()} ${this.activityTemplate()}
        <wui-list-item
          .rounded=${!0}
          icon="power"
          iconColor="error"
          ?chevron=${!1}
          .loading=${this.disconnecting}
          .rightIcon=${!1}
          @click=${this.onDisconnect.bind(this)}
          data-testid="disconnect-button"
        >
          <wui-text variant="lg-regular" color="primary">Disconnect</wui-text>
        </wui-list-item>
      </wui-flex>`}fundWalletTemplate(){if(!this.namespace)return null;let e=D.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),i=!!this.features?.receive,r=this.remoteFeatures?.onramp&&e,n=K.isPayWithExchangeEnabled();return!r&&!i&&!n?null:u`
      <wui-list-item
        .rounded=${!0}
        data-testid="w3m-account-default-fund-wallet-button"
        iconVariant="blue"
        icon="dollar"
        ?chevron=${!0}
        @click=${this.handleClickFundWallet.bind(this)}
      >
        <wui-text variant="lg-regular" color="primary">Fund wallet</wui-text>
      </wui-list-item>
    `}orderedFeaturesTemplate(){return(this.features?.walletFeaturesOrder||D.DEFAULT_FEATURES.walletFeaturesOrder).map(i=>{switch(i){case"onramp":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}activityTemplate(){return this.namespace&&this.remoteFeatures?.activity&&D.ACTIVITY_ENABLED_CHAIN_NAMESPACES.includes(this.namespace)?u` <wui-list-item
          .rounded=${!0}
          icon="clock"
          ?chevron=${!0}
          @click=${this.onTransactions.bind(this)}
          data-testid="w3m-account-default-activity-button"
        >
          <wui-text variant="lg-regular" color="primary">Activity</wui-text>
        </wui-list-item>`:null}swapsTemplate(){let e=this.remoteFeatures?.swaps,i=h.state.activeChain===I.CHAIN.EVM;return!e||!i?null:u`
      <wui-list-item
        .rounded=${!0}
        icon="recycleHorizontal"
        ?chevron=${!0}
        @click=${this.handleClickSwap.bind(this)}
        data-testid="w3m-account-default-swaps-button"
      >
        <wui-text variant="lg-regular" color="primary">Swap</wui-text>
      </wui-list-item>
    `}sendTemplate(){let e=this.features?.send,i=h.state.activeChain;if(!i)throw new Error("SendController:sendTemplate - namespace is required");let r=D.SEND_SUPPORTED_NAMESPACES.includes(i);return!e||!r?null:u`
      <wui-list-item
        .rounded=${!0}
        icon="send"
        ?chevron=${!0}
        @click=${this.handleClickSend.bind(this)}
        data-testid="w3m-account-default-send-button"
      >
        <wui-text variant="lg-regular" color="primary">Send</wui-text>
      </wui-list-item>
    `}authCardTemplate(){let e=h.state.activeChain;if(!e)throw new Error("AuthCardTemplate:authCardTemplate - namespace is required");let i=S.getConnectorId(e),r=S.getAuthConnector(),{origin:n}=location;return!r||i!==I.CONNECTOR_ID.AUTH||n.includes(D.SECURE_SITE)?null:u`
      <wui-notice-card
        @click=${this.onGoToUpgradeView.bind(this)}
        label="Upgrade your wallet"
        description="Transition to a self-custodial wallet"
        icon="wallet"
        data-testid="w3m-wallet-upgrade-card"
      ></wui-notice-card>
    `}handleClickFundWallet(){x.push("FundWallet")}handleClickSwap(){x.push("Swap")}handleClickSend(){x.push("WalletSend")}explorerBtnTemplate(){return h.getAccountData()?.addressExplorerUrl?u`
      <wui-button size="md" variant="accent-primary" @click=${this.onExplorer.bind(this)}>
        <wui-icon size="sm" color="inherit" slot="iconLeft" name="compass"></wui-icon>
        Block Explorer
        <wui-icon size="sm" color="inherit" slot="iconRight" name="externalLink"></wui-icon>
      </wui-button>
    `:null}onTransactions(){A.sendEvent({type:"track",event:"CLICK_TRANSACTIONS",properties:{isSmartAccount:fe(h.state.activeChain)===he.ACCOUNT_TYPES.SMART_ACCOUNT}}),x.push("Transactions")}async onDisconnect(){try{this.disconnecting=!0;let i=k.getConnections(this.namespace).length>0,r=this.namespace&&S.state.activeConnectorIds[this.namespace],n=this.remoteFeatures?.multiWallet;await k.disconnect(n?{id:r,namespace:this.namespace}:{}),i&&n&&(x.push("ProfileWallets"),T.showSuccess("Wallet deleted"))}catch{A.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),T.showError("Failed to disconnect")}finally{this.disconnecting=!1}}onExplorer(){let e=h.getAccountData()?.addressExplorerUrl;e&&$.openHref(e,"_blank")}onGoToUpgradeView(){A.sendEvent({type:"track",event:"EMAIL_UPGRADE_FROM_MODAL"}),x.push("UpgradeEmailWallet")}onGoToProfileWalletsView(){x.push("ProfileWallets")}};Q.styles=Fi;ce([m()],Q.prototype,"caipAddress",void 0);ce([m()],Q.prototype,"address",void 0);ce([m()],Q.prototype,"profileImage",void 0);ce([m()],Q.prototype,"profileName",void 0);ce([m()],Q.prototype,"disconnecting",void 0);ce([m()],Q.prototype,"balance",void 0);ce([m()],Q.prototype,"balanceSymbol",void 0);ce([m()],Q.prototype,"features",void 0);ce([m()],Q.prototype,"remoteFeatures",void 0);ce([m()],Q.prototype,"namespace",void 0);ce([m()],Q.prototype,"activeConnectorIds",void 0);Q=ce([f("w3m-account-default-widget")],Q);l();p();c();l();p();c();l();p();c();l();p();c();var Mi=E`
  span {
    font-weight: 500;
    font-size: 38px;
    color: ${({tokens:t})=>t.theme.textPrimary};
    line-height: 38px;
    letter-spacing: -2%;
    text-align: center;
    font-family: var(--apkt-fontFamily-regular);
  }

  .pennies {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }
`;var ei=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},vt=class extends y{constructor(){super(...arguments),this.dollars="0",this.pennies="00"}render(){return u`<span>$${this.dollars}<span class="pennies">.${this.pennies}</span></span>`}};vt.styles=[R,Mi];ei([d()],vt.prototype,"dollars",void 0);ei([d()],vt.prototype,"pennies",void 0);vt=ei([f("wui-balance")],vt);l();p();c();l();p();c();l();p();c();var Vi=E`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
  }

  /* -- Variants --------------------------------------------------------- */
  :host([data-variant='fill']) {
    background-color: ${({colors:t})=>t.neutrals100};
  }

  :host([data-variant='shade']) {
    background-color: ${({colors:t})=>t.neutrals900};
  }

  :host([data-variant='fill']) > wui-text {
    color: ${({colors:t})=>t.black};
  }

  :host([data-variant='shade']) > wui-text {
    color: ${({colors:t})=>t.white};
  }

  :host([data-variant='fill']) > wui-icon {
    color: ${({colors:t})=>t.neutrals100};
  }

  :host([data-variant='shade']) > wui-icon {
    color: ${({colors:t})=>t.neutrals900};
  }

  /* -- Sizes --------------------------------------------------------- */
  :host([data-size='sm']) {
    padding: ${({spacing:t})=>t[1]} ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host([data-size='md']) {
    padding: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[3]};
    border-radius: ${({borderRadius:t})=>t[3]};
  }

  /* -- Placements --------------------------------------------------------- */
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
`;var $t=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},nr={sm:"sm-regular",md:"md-regular"},je=class extends y{constructor(){super(...arguments),this.placement="top",this.variant="fill",this.size="md",this.message=""}render(){return this.dataset.variant=this.variant,this.dataset.size=this.size,u`<wui-icon data-placement=${this.placement} size="inherit" name="cursor"></wui-icon>
      <wui-text variant=${nr[this.size]}>${this.message}</wui-text>`}};je.styles=[R,W,Vi];$t([d()],je.prototype,"placement",void 0);$t([d()],je.prototype,"variant",void 0);$t([d()],je.prototype,"size",void 0);$t([d()],je.prototype,"message",void 0);je=$t([f("wui-tooltip")],je);l();p();c();l();p();c();var Hi=U`
  :host {
    width: 100%;
    max-height: 280px;
    overflow: scroll;
    scrollbar-width: none;
  }

  :host::-webkit-scrollbar {
    display: none;
  }
`;var sr=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},ti=class extends y{render(){return u`<w3m-activity-list page="account"></w3m-activity-list>`}};ti.styles=Hi;ti=sr([f("w3m-account-activity-widget")],ti);l();p();c();l();p();c();l();p();c();l();p();c();var Ki=E`
  :host {
    width: 100%;
  }

  button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: ${({spacing:t})=>t[4]};
    padding: ${({spacing:t})=>t[4]};
    background-color: transparent;
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-text {
    max-width: 174px;
  }

  .tag-container {
    width: fit-content;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    }
  }
`;var nt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},_e=class extends y{constructor(){super(...arguments),this.icon="card",this.text="",this.description="",this.tag=void 0,this.disabled=!1}render(){return u`
      <button ?disabled=${this.disabled}>
        <wui-flex alignItems="center" gap="3">
          <wui-icon-box padding="2" color="secondary" icon=${this.icon} size="lg"></wui-icon-box>
          <wui-flex flexDirection="column" gap="1">
            <wui-text variant="md-medium" color="primary">${this.text}</wui-text>
            ${this.description?u`<wui-text variant="md-regular" color="secondary">
                  ${this.description}</wui-text
                >`:null}
          </wui-flex>
        </wui-flex>

        <wui-flex class="tag-container" alignItems="center" gap="1" justifyContent="flex-end">
          ${this.tag?u`<wui-tag tagType="main" size="sm">${this.tag}</wui-tag>`:null}
          <wui-icon size="md" name="chevronRight" color="default"></wui-icon>
        </wui-flex>
      </button>
    `}};_e.styles=[R,W,Ki];nt([d()],_e.prototype,"icon",void 0);nt([d()],_e.prototype,"text",void 0);nt([d()],_e.prototype,"description",void 0);nt([d()],_e.prototype,"tag",void 0);nt([d({type:Boolean})],_e.prototype,"disabled",void 0);_e=nt([f("wui-list-description")],_e);l();p();c();var qi=U`
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
`;var ii=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Et=class extends y{constructor(){super(),this.unsubscribe=[],this.tokenBalance=h.getAccountData()?.tokenBalance,this.remoteFeatures=v.state.remoteFeatures,this.unsubscribe.push(h.subscribeChainProp("accountState",e=>{this.tokenBalance=e?.tokenBalance}),v.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u`${this.tokenTemplate()}`}tokenTemplate(){return this.tokenBalance&&this.tokenBalance?.length>0?u`<wui-flex class="contentContainer" flexDirection="column" gap="2">
        ${this.tokenItemTemplate()}
      </wui-flex>`:u` <wui-flex flexDirection="column">
      ${this.onRampTemplate()}
      <wui-list-description
        @click=${this.onReceiveClick.bind(this)}
        text="Receive funds"
        description="Scan the QR code and receive funds"
        icon="qrCode"
        iconColor="fg-200"
        iconBackgroundColor="fg-200"
        data-testid="w3m-account-receive-button"
      ></wui-list-description
    ></wui-flex>`}onRampTemplate(){return this.remoteFeatures?.onramp?u`<wui-list-description
        @click=${this.onBuyClick.bind(this)}
        text="Buy Crypto"
        description="Easy with card or bank account"
        icon="card"
        iconColor="success-100"
        iconBackgroundColor="success-100"
        tag="popular"
        data-testid="w3m-account-onramp-button"
      ></wui-list-description>`:u``}tokenItemTemplate(){return this.tokenBalance?.map(e=>u`<wui-list-token
          tokenName=${e.name}
          tokenImageUrl=${e.iconUrl}
          tokenAmount=${e.quantity.numeric}
          tokenValue=${e.value}
          tokenCurrency=${e.symbol}
        ></wui-list-token>`)}onReceiveClick(){x.push("WalletReceive")}onBuyClick(){A.sendEvent({type:"track",event:"SELECT_BUY_CRYPTO",properties:{isSmartAccount:fe(h.state.activeChain)===he.ACCOUNT_TYPES.SMART_ACCOUNT}}),x.push("OnRampProviders")}};Et.styles=qi;ii([m()],Et.prototype,"tokenBalance",void 0);ii([m()],Et.prototype,"remoteFeatures",void 0);Et=ii([f("w3m-account-tokens-widget")],Et);l();p();c();var Gi=E`
  wui-flex {
    width: 100%;
  }

  wui-promo {
    position: absolute;
    top: -32px;
  }

  wui-profile-button {
    margin-top: calc(-1 * ${({spacing:t})=>t[4]});
  }

  wui-promo + wui-profile-button {
    margin-top: ${({spacing:t})=>t[4]};
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
    border-radius: ${({borderRadius:t})=>t[3]};
  }

  .contentContainer > .textContent {
    width: 65%;
  }
`;var ge=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},re=class extends y{constructor(){super(...arguments),this.unsubscribe=[],this.network=h.state.activeCaipNetwork,this.profileName=h.getAccountData()?.profileName,this.address=h.getAccountData()?.address,this.currentTab=h.getAccountData()?.currentTab,this.tokenBalance=h.getAccountData()?.tokenBalance,this.features=v.state.features,this.namespace=h.state.activeChain,this.activeConnectorIds=S.state.activeConnectorIds,this.remoteFeatures=v.state.remoteFeatures}firstUpdated(){h.fetchTokenBalance(),this.unsubscribe.push(h.subscribeChainProp("accountState",e=>{e?.address?(this.address=e.address,this.profileName=e.profileName,this.currentTab=e.currentTab,this.tokenBalance=e.tokenBalance):j.close()}),S.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),h.subscribeKey("activeChain",e=>this.namespace=e),h.subscribeKey("activeCaipNetwork",e=>this.network=e),v.subscribeKey("features",e=>this.features=e),v.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e)),this.watchSwapValues()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),clearInterval(this.watchTokenBalance)}render(){if(!this.address)throw new Error("w3m-account-features-widget: No account provided");if(!this.namespace)return null;let e=this.activeConnectorIds[this.namespace],i=e?S.getConnectorById(e):void 0,{icon:r,iconSize:n}=this.getAuthData();return u`<wui-flex
      flexDirection="column"
      .padding=${["0","3","4","3"]}
      alignItems="center"
      gap="4"
      data-testid="w3m-account-wallet-features-widget"
    >
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center" gap="2">
        <wui-wallet-switch
          profileName=${this.profileName}
          address=${this.address}
          icon=${r}
          iconSize=${n}
          alt=${i?.name}
          @click=${this.onGoToProfileWalletsView.bind(this)}
          data-testid="wui-wallet-switch"
        ></wui-wallet-switch>

        ${this.tokenBalanceTemplate()}
      </wui-flex>
      ${this.orderedWalletFeatures()} ${this.tabsTemplate()} ${this.listContentTemplate()}
    </wui-flex>`}orderedWalletFeatures(){let e=this.features?.walletFeaturesOrder||D.DEFAULT_FEATURES.walletFeaturesOrder;if(e.every(o=>o==="send"||o==="receive"?!this.features?.[o]:o==="swaps"||o==="onramp"?!this.remoteFeatures?.[o]:!0))return null;let r=e.map(o=>o==="receive"||o==="onramp"?"fund":o),n=[...new Set(r)];return u`<wui-flex gap="2">
      ${n.map(o=>{switch(o){case"fund":return this.fundWalletTemplate();case"swaps":return this.swapsTemplate();case"send":return this.sendTemplate();default:return null}})}
    </wui-flex>`}fundWalletTemplate(){if(!this.namespace)return null;let e=D.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.namespace),i=this.features?.receive,r=this.remoteFeatures?.onramp&&e,n=K.isPayWithExchangeEnabled();return!r&&!i&&!n?null:u`
      <w3m-tooltip-trigger text="Fund wallet">
        <wui-button
          data-testid="wallet-features-fund-wallet-button"
          @click=${this.onFundWalletClick.bind(this)}
          variant="accent-secondary"
          size="lg"
          fullWidth
        >
          <wui-icon name="dollar"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `}swapsTemplate(){let e=this.remoteFeatures?.swaps,i=h.state.activeChain===I.CHAIN.EVM;return!e||!i?null:u`
      <w3m-tooltip-trigger text="Swap">
        <wui-button
          fullWidth
          data-testid="wallet-features-swaps-button"
          @click=${this.onSwapClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="recycleHorizontal"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `}sendTemplate(){let e=this.features?.send,i=h.state.activeChain,r=D.SEND_SUPPORTED_NAMESPACES.includes(i);return!e||!r?null:u`
      <w3m-tooltip-trigger text="Send">
        <wui-button
          fullWidth
          data-testid="wallet-features-send-button"
          @click=${this.onSendClick.bind(this)}
          variant="accent-secondary"
          size="lg"
        >
          <wui-icon name="send"></wui-icon>
        </wui-button>
      </w3m-tooltip-trigger>
    `}watchSwapValues(){this.watchTokenBalance=setInterval(()=>h.fetchTokenBalance(e=>this.onTokenBalanceError(e)),1e4)}onTokenBalanceError(e){e instanceof Error&&e.cause instanceof Response&&e.cause.status===I.HTTP_STATUS_CODES.SERVICE_UNAVAILABLE&&clearInterval(this.watchTokenBalance)}listContentTemplate(){return this.currentTab===0?u`<w3m-account-tokens-widget></w3m-account-tokens-widget>`:this.currentTab===1?u`<w3m-account-activity-widget></w3m-account-activity-widget>`:u`<w3m-account-tokens-widget></w3m-account-tokens-widget>`}tokenBalanceTemplate(){if(this.tokenBalance&&this.tokenBalance?.length>=0){let e=$.calculateBalance(this.tokenBalance),{dollars:i="0",pennies:r="00"}=$.formatTokenBalance(e);return u`<wui-balance dollars=${i} pennies=${r}></wui-balance>`}return u`<wui-balance dollars="0" pennies="00"></wui-balance>`}tabsTemplate(){let e=ot.getTabsByNamespace(h.state.activeChain);return e.length===0?null:u`<wui-tabs
      .onTabChange=${this.onTabChange.bind(this)}
      .activeTab=${this.currentTab}
      .tabs=${e}
    ></wui-tabs>`}onTabChange(e){h.setAccountProp("currentTab",e,this.namespace)}onFundWalletClick(){x.push("FundWallet")}onSwapClick(){this.network?.caipNetworkId&&!D.SWAP_SUPPORTED_NETWORKS.includes(this.network?.caipNetworkId)?x.push("UnsupportedChain",{swapUnsupportedChain:!0}):(A.sendEvent({type:"track",event:"OPEN_SWAP",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:fe(h.state.activeChain)===he.ACCOUNT_TYPES.SMART_ACCOUNT}}),x.push("Swap"))}getAuthData(){let e=te.getConnectedSocialProvider(),i=te.getConnectedSocialUsername(),n=S.getAuthConnector()?.provider.getEmail()??"";return{name:Qe.getAuthName({email:n,socialUsername:i,socialProvider:e}),icon:e??"mail",iconSize:e?"xl":"md"}}onGoToProfileWalletsView(){x.push("ProfileWallets")}onSendClick(){A.sendEvent({type:"track",event:"OPEN_SEND",properties:{network:this.network?.caipNetworkId||"",isSmartAccount:fe(h.state.activeChain)===he.ACCOUNT_TYPES.SMART_ACCOUNT}}),x.push("WalletSend")}};re.styles=Gi;ge([m()],re.prototype,"watchTokenBalance",void 0);ge([m()],re.prototype,"network",void 0);ge([m()],re.prototype,"profileName",void 0);ge([m()],re.prototype,"address",void 0);ge([m()],re.prototype,"currentTab",void 0);ge([m()],re.prototype,"tokenBalance",void 0);ge([m()],re.prototype,"features",void 0);ge([m()],re.prototype,"namespace",void 0);ge([m()],re.prototype,"activeConnectorIds",void 0);ge([m()],re.prototype,"remoteFeatures",void 0);re=ge([f("w3m-account-wallet-features-widget")],re);var Xi=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},oi=class extends y{constructor(){super(),this.unsubscribe=[],this.namespace=h.state.activeChain,this.unsubscribe.push(h.subscribeKey("activeChain",e=>{this.namespace=e}))}render(){if(!this.namespace)return null;let e=S.getConnectorId(this.namespace),i=S.getAuthConnector();return u`
      ${i&&e===I.CONNECTOR_ID.AUTH?this.walletFeaturesTemplate():this.defaultTemplate()}
    `}walletFeaturesTemplate(){return u`<w3m-account-wallet-features-widget></w3m-account-wallet-features-widget>`}defaultTemplate(){return u`<w3m-account-default-widget></w3m-account-default-widget>`}};Xi([m()],oi.prototype,"namespace",void 0);oi=Xi([f("w3m-account-view")],oi);l();p();c();l();p();c();l();p();c();l();p();c();var Yi=E`
  wui-image {
    width: 24px;
    height: 24px;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  wui-icon:not(.custom-icon, .icon-badge) {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    border-radius: ${({borderRadius:t})=>t[2]};
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:t})=>t["01"]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`;var J=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},V=class extends y{constructor(){super(...arguments),this.address="",this.profileName="",this.content=[],this.alt="",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadge=void 0,this.iconBadgeSize="md",this.buttonVariant="neutral-primary",this.enableMoreButton=!1,this.charsStart=4,this.charsEnd=6}render(){return u`
      <wui-flex flexDirection="column" rowgap="2">
        ${this.topTemplate()} ${this.bottomTemplate()}
      </wui-flex>
    `}topTemplate(){return u`
      <wui-flex alignItems="flex-start" justifyContent="space-between">
        ${this.imageOrIconTemplate()}
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="copy"
          @click=${this.dispatchCopyEvent}
        ></wui-icon-link>
        <wui-icon-link
          variant="secondary"
          size="md"
          icon="externalLink"
          @click=${this.dispatchExternalLinkEvent}
        ></wui-icon-link>
        ${this.enableMoreButton?u`<wui-icon-link
              variant="secondary"
              size="md"
              icon="threeDots"
              @click=${this.dispatchMoreButtonEvent}
              data-testid="wui-active-profile-wallet-item-more-button"
            ></wui-icon-link>`:null}
      </wui-flex>
    `}bottomTemplate(){return u` <wui-flex flexDirection="column">${this.contentTemplate()}</wui-flex> `}imageOrIconTemplate(){return this.icon?u`
        <wui-flex flexGrow="1" alignItems="center">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?u`<wui-icon
                  color="accent-primary"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:u`
      <wui-flex flexGrow="1" alignItems="center">
        <wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>
      </wui-flex>
    `}contentTemplate(){return this.content.length===0?null:u`
      <wui-flex flexDirection="column" rowgap="3">
        ${this.content.map(e=>this.labelAndTagTemplate(e))}
      </wui-flex>
    `}labelAndTagTemplate({address:e,profileName:i,label:r,description:n,enableButton:o,buttonType:s,buttonLabel:a,buttonVariant:N,tagVariant:P,tagLabel:z,alignItems:se="flex-end"}){return u`
      <wui-flex justifyContent="space-between" alignItems=${se} columngap="1">
        <wui-flex flexDirection="column" rowgap="01">
          ${r?u`<wui-text variant="sm-medium" color="secondary">${r}</wui-text>`:null}

          <wui-flex alignItems="center" columngap="1">
            <wui-text variant="md-regular" color="primary">
              ${B.getTruncateString({string:i||e,charsStart:i?16:this.charsStart,charsEnd:i?0:this.charsEnd,truncate:i?"end":"middle"})}
            </wui-text>

            ${P&&z?u`<wui-tag variant=${P} size="sm">${z}</wui-tag>`:null}
          </wui-flex>

          ${n?u`<wui-text variant="sm-regular" color="secondary">${n}</wui-text>`:null}
        </wui-flex>

        ${o?this.buttonTemplate({buttonType:s,buttonLabel:a,buttonVariant:N}):null}
      </wui-flex>
    `}buttonTemplate({buttonType:e,buttonLabel:i,buttonVariant:r}){return u`
      <wui-button
        size="sm"
        variant=${r}
        @click=${e==="disconnect"?this.dispatchDisconnectEvent.bind(this):this.dispatchSwitchEvent.bind(this)}
        data-testid=${e==="disconnect"?"wui-active-profile-wallet-item-disconnect-button":"wui-active-profile-wallet-item-switch-button"}
      >
        ${i}
      </wui-button>
    `}dispatchDisconnectEvent(){this.dispatchEvent(new CustomEvent("disconnect",{bubbles:!0,composed:!0}))}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("switch",{bubbles:!0,composed:!0}))}dispatchExternalLinkEvent(){this.dispatchEvent(new CustomEvent("externalLink",{bubbles:!0,composed:!0}))}dispatchMoreButtonEvent(){this.dispatchEvent(new CustomEvent("more",{bubbles:!0,composed:!0}))}dispatchCopyEvent(){this.dispatchEvent(new CustomEvent("copy",{bubbles:!0,composed:!0}))}};V.styles=[R,W,Yi];J([d()],V.prototype,"address",void 0);J([d()],V.prototype,"profileName",void 0);J([d({type:Array})],V.prototype,"content",void 0);J([d()],V.prototype,"alt",void 0);J([d()],V.prototype,"imageSrc",void 0);J([d()],V.prototype,"icon",void 0);J([d()],V.prototype,"iconSize",void 0);J([d()],V.prototype,"iconBadge",void 0);J([d()],V.prototype,"iconBadgeSize",void 0);J([d()],V.prototype,"buttonVariant",void 0);J([d({type:Boolean})],V.prototype,"enableMoreButton",void 0);J([d({type:Number})],V.prototype,"charsStart",void 0);J([d({type:Number})],V.prototype,"charsEnd",void 0);V=J([f("wui-active-profile-wallet-item")],V);l();p();c();l();p();c();l();p();c();var Qi=E`
  wui-image,
  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  .right-icon {
    cursor: pointer;
  }

  .icon-box {
    position: relative;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  .icon-badge {
    position: absolute;
    top: 18px;
    left: 23px;
    z-index: 3;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border: 2px solid ${({tokens:t})=>t.theme.backgroundPrimary};
    border-radius: 50%;
    padding: ${({spacing:t})=>t["01"]};
  }

  .icon-badge {
    width: 8px;
    height: 8px;
  }
`;var H=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},F=class extends y{constructor(){super(...arguments),this.address="",this.profileName="",this.alt="",this.buttonLabel="",this.buttonVariant="accent-primary",this.imageSrc="",this.icon=void 0,this.iconSize="md",this.iconBadgeSize="md",this.rightIcon="signOut",this.rightIconSize="md",this.loading=!1,this.charsStart=4,this.charsEnd=6}render(){return u`
      <wui-flex alignItems="center" columngap="2">
        ${this.imageOrIconTemplate()} ${this.labelAndDescriptionTemplate()}
        ${this.buttonActionTemplate()}
      </wui-flex>
    `}imageOrIconTemplate(){return this.icon?u`
        <wui-flex alignItems="center" justifyContent="center" class="icon-box">
          <wui-flex alignItems="center" justifyContent="center" class="icon-box">
            <wui-icon size="lg" color="default" name=${this.icon} class="custom-icon"></wui-icon>

            ${this.iconBadge?u`<wui-icon
                  color="default"
                  size="inherit"
                  name=${this.iconBadge}
                  class="icon-badge"
                ></wui-icon>`:null}
          </wui-flex>
        </wui-flex>
      `:u`<wui-image objectFit="contain" src=${this.imageSrc} alt=${this.alt}></wui-image>`}labelAndDescriptionTemplate(){return u`
      <wui-flex
        flexDirection="column"
        flexGrow="1"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <wui-text variant="lg-regular" color="primary">
          ${B.getTruncateString({string:this.profileName||this.address,charsStart:this.profileName?16:this.charsStart,charsEnd:this.profileName?0:this.charsEnd,truncate:this.profileName?"end":"middle"})}
        </wui-text>
      </wui-flex>
    `}buttonActionTemplate(){return u`
      <wui-flex columngap="1" alignItems="center" justifyContent="center">
        <wui-button
          size="sm"
          variant=${this.buttonVariant}
          .loading=${this.loading}
          @click=${this.handleButtonClick}
          data-testid="wui-inactive-profile-wallet-item-button"
        >
          ${this.buttonLabel}
        </wui-button>

        <wui-icon-link
          variant="secondary"
          size="md"
          icon=${C(this.rightIcon)}
          class="right-icon"
          @click=${this.handleIconClick}
        ></wui-icon-link>
      </wui-flex>
    `}handleButtonClick(){this.dispatchEvent(new CustomEvent("buttonClick",{bubbles:!0,composed:!0}))}handleIconClick(){this.dispatchEvent(new CustomEvent("iconClick",{bubbles:!0,composed:!0}))}};F.styles=[R,W,Qi];H([d()],F.prototype,"address",void 0);H([d()],F.prototype,"profileName",void 0);H([d()],F.prototype,"alt",void 0);H([d()],F.prototype,"buttonLabel",void 0);H([d()],F.prototype,"buttonVariant",void 0);H([d()],F.prototype,"imageSrc",void 0);H([d()],F.prototype,"icon",void 0);H([d()],F.prototype,"iconSize",void 0);H([d()],F.prototype,"iconBadge",void 0);H([d()],F.prototype,"iconBadgeSize",void 0);H([d()],F.prototype,"rightIcon",void 0);H([d()],F.prototype,"rightIconSize",void 0);H([d({type:Boolean})],F.prototype,"loading",void 0);H([d({type:Number})],F.prototype,"charsStart",void 0);H([d({type:Number})],F.prototype,"charsEnd",void 0);F=H([f("wui-inactive-profile-wallet-item")],F);l();p();c();var Ot={getAuthData(t){let e=t.connectorId===I.CONNECTOR_ID.AUTH;if(!e)return{isAuth:!1,icon:void 0,iconSize:void 0,name:void 0};let i=t?.auth?.name??te.getConnectedSocialProvider(),r=t?.auth?.username??te.getConnectedSocialUsername(),o=S.getAuthConnector()?.provider.getEmail()??"";return{isAuth:!0,icon:i??"mail",iconSize:i?"xl":"md",name:e?Qe.getAuthName({email:o,socialUsername:r,socialProvider:i}):void 0}}};l();p();c();var Ji=E`
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
    transition: opacity ${({easings:t})=>t["ease-out-power-1"]}
      ${({durations:t})=>t.md};
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
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  .active-wallets-box {
    height: 330px;
  }

  .empty-wallet-list-box {
    height: 400px;
  }

  .empty-box {
    width: 100%;
    padding: ${({spacing:t})=>t[4]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-separator {
    margin: ${({spacing:t})=>t[2]} 0 ${({spacing:t})=>t[2]} 0;
  }

  .active-connection {
    padding: ${({spacing:t})=>t[2]};
  }

  .recent-connection {
    padding: ${({spacing:t})=>t[2]} 0 ${({spacing:t})=>t[2]} 0;
  }

  @media (max-width: 430px) {
    .active-wallets-box,
    .empty-wallet-list-box {
      height: auto;
      max-height: clamp(360px, 470px, 80vh);
    }
  }
`;var ne=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},pe={ADDRESS_DISPLAY:{START:4,END:6},BADGE:{SIZE:"md",ICON:"lightbulb"},SCROLL_THRESHOLD:50,OPACITY_RANGE:[0,1]},st={eip155:"ethereum",solana:"solana",bip122:"bitcoin",ton:"ton"},ar=[{namespace:"eip155",icon:st.eip155,label:"EVM"},{namespace:"solana",icon:st.solana,label:"Solana"},{namespace:"bip122",icon:st.bip122,label:"Bitcoin"},{namespace:"ton",icon:st.ton,label:"Ton"}],lr={eip155:{title:"Add EVM Wallet",description:"Add your first EVM wallet"},solana:{title:"Add Solana Wallet",description:"Add your first Solana wallet"},bip122:{title:"Add Bitcoin Wallet",description:"Add your first Bitcoin wallet"},ton:{title:"Add TON Wallet",description:"Add your first TON wallet"}},X=class extends y{constructor(){super(),this.unsubscribers=[],this.currentTab=0,this.namespace=h.state.activeChain,this.namespaces=Array.from(h.state.chains.keys()),this.caipAddress=void 0,this.profileName=void 0,this.activeConnectorIds=S.state.activeConnectorIds,this.lastSelectedAddress="",this.lastSelectedConnectorId="",this.isSwitching=!1,this.caipNetwork=h.state.activeCaipNetwork,this.user=h.getAccountData()?.user,this.remoteFeatures=v.state.remoteFeatures,this.currentTab=this.namespace?this.namespaces.indexOf(this.namespace):0,this.caipAddress=h.getAccountData(this.namespace)?.caipAddress,this.profileName=h.getAccountData(this.namespace)?.profileName,this.unsubscribers.push(k.subscribeKey("connections",()=>this.onConnectionsChange()),k.subscribeKey("recentConnections",()=>this.requestUpdate()),S.subscribeKey("activeConnectorIds",e=>{this.activeConnectorIds=e}),h.subscribeKey("activeCaipNetwork",e=>this.caipNetwork=e),h.subscribeChainProp("accountState",e=>{this.user=e?.user}),v.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e)),this.chainListener=h.subscribeChainProp("accountState",e=>{this.caipAddress=e?.caipAddress,this.profileName=e?.profileName},this.namespace)}disconnectedCallback(){this.unsubscribers.forEach(e=>e()),this.resizeObserver?.disconnect(),this.removeScrollListener(),this.chainListener?.()}firstUpdated(){let e=this.shadowRoot?.querySelector(".wallet-list");if(!e)return;let i=()=>this.updateScrollOpacity(e);requestAnimationFrame(i),e.addEventListener("scroll",i),this.resizeObserver=new ResizeObserver(i),this.resizeObserver.observe(e),i()}render(){let e=this.namespace;if(!e)throw new Error("Namespace is not set");return u`
      <wui-flex flexDirection="column" .padding=${["0","4","4","4"]} gap="4">
        ${this.renderTabs()} ${this.renderHeader(e)} ${this.renderConnections(e)}
        ${this.renderAddConnectionButton(e)}
      </wui-flex>
    `}renderTabs(){let e=this.namespaces.map(r=>ar.find(n=>n.namespace===r)).filter(Boolean);return e.length>1?u`
        <wui-tabs
          .onTabChange=${r=>this.handleTabChange(r)}
          .activeTab=${this.currentTab}
          .tabs=${e}
        ></wui-tabs>
      `:null}renderHeader(e){let r=this.getActiveConnections(e).flatMap(({accounts:n})=>n).length+(this.caipAddress?1:0);return u`
      <wui-flex alignItems="center" columngap="1">
        <wui-icon
          size="sm"
          name=${st[e]??st.eip155}
        ></wui-icon>
        <wui-text color="secondary" variant="lg-regular"
          >${r>1?"Wallets":"Wallet"}</wui-text
        >
        <wui-text
          color="primary"
          variant="lg-regular"
          class="balance-amount"
          data-testid="balance-amount"
        >
          ${r}
        </wui-text>
        <wui-link
          color="secondary"
          variant="secondary"
          @click=${()=>k.disconnect({namespace:e})}
          ?disabled=${!this.hasAnyConnections(e)}
          data-testid="disconnect-all-button"
        >
          Disconnect All
        </wui-link>
      </wui-flex>
    `}renderConnections(e){let i=this.hasAnyConnections(e);return u`
      <wui-flex flexDirection="column" class=${Wt({"wallet-list":!0,"active-wallets-box":i,"empty-wallet-list-box":!i})} rowgap="3">
        ${i?this.renderActiveConnections(e):this.renderEmptyState(e)}
      </wui-flex>
    `}renderActiveConnections(e){let i=this.getActiveConnections(e),r=this.activeConnectorIds[e],n=this.getPlainAddress();return u`
      ${n||r||i.length>0?u`<wui-flex
            flexDirection="column"
            .padding=${["4","0","4","0"]}
            class="active-wallets"
          >
            ${this.renderActiveProfile(e)} ${this.renderActiveConnectionsList(e)}
          </wui-flex>`:null}
      ${this.renderRecentConnections(e)}
    `}renderActiveProfile(e){let i=this.activeConnectorIds[e];if(!i)return null;let{connections:r}=ae.getConnectionsData(e),n=S.getConnectorById(i),o=_.getConnectorImage(n),s=this.getPlainAddress();if(!s)return null;let a=e===I.CHAIN.BITCOIN,N=Ot.getAuthData({connectorId:i,accounts:[]}),P=this.getActiveConnections(e).flatMap(xe=>xe.accounts).length>0,z=r.find(xe=>xe.connectorId===i),se=z?.accounts.filter(xe=>!q.isLowerCaseMatch(xe.address,s));return u`
      <wui-flex flexDirection="column" .padding=${["0","4","0","4"]}>
        <wui-active-profile-wallet-item
          address=${s}
          alt=${n?.name}
          .content=${this.getProfileContent({address:s,connections:r,connectorId:i,namespace:e})}
          .charsStart=${pe.ADDRESS_DISPLAY.START}
          .charsEnd=${pe.ADDRESS_DISPLAY.END}
          .icon=${N.icon}
          .iconSize=${N.iconSize}
          .iconBadge=${this.isSmartAccount(s)?pe.BADGE.ICON:void 0}
          .iconBadgeSize=${this.isSmartAccount(s)?pe.BADGE.SIZE:void 0}
          imageSrc=${o}
          ?enableMoreButton=${N.isAuth}
          @copy=${()=>this.handleCopyAddress(s)}
          @disconnect=${()=>this.handleDisconnect(e,i)}
          @switch=${()=>{a&&z&&se?.[0]&&this.handleSwitchWallet(z,se[0].address,e)}}
          @externalLink=${()=>this.handleExternalLink(s)}
          @more=${()=>this.handleMore()}
          data-testid="wui-active-profile-wallet-item"
        ></wui-active-profile-wallet-item>
        ${P?u`<wui-separator></wui-separator>`:null}
      </wui-flex>
    `}renderActiveConnectionsList(e){let i=this.getActiveConnections(e);return i.length===0?null:u`
      <wui-flex flexDirection="column" .padding=${["0","2","0","2"]}>
        ${this.renderConnectionList(i,!1,e)}
      </wui-flex>
    `}renderRecentConnections(e){let{recentConnections:i}=ae.getConnectionsData(e);return i.flatMap(n=>n.accounts).length===0?null:u`
      <wui-flex flexDirection="column" .padding=${["0","2","0","2"]} rowGap="2">
        <wui-text color="secondary" variant="sm-medium" data-testid="recently-connected-text"
          >RECENTLY CONNECTED</wui-text
        >
        <wui-flex flexDirection="column" .padding=${["0","2","0","2"]}>
          ${this.renderConnectionList(i,!0,e)}
        </wui-flex>
      </wui-flex>
    `}renderConnectionList(e,i,r){return e.filter(n=>n.accounts.length>0).map((n,o)=>{let s=S.getConnectorById(n.connectorId),a=_.getConnectorImage(s)??"",N=Ot.getAuthData(n);return n.accounts.map((P,z)=>{let se=o!==0||z!==0,xe=this.isAccountLoading(n.connectorId,P.address);return u`
            <wui-flex flexDirection="column">
              ${se?u`<wui-separator></wui-separator>`:null}
              <wui-inactive-profile-wallet-item
                address=${P.address}
                alt=${n.connectorId}
                buttonLabel=${i?"Connect":"Switch"}
                buttonVariant=${i?"neutral-secondary":"accent-secondary"}
                rightIcon=${i?"bin":"power"}
                rightIconSize="sm"
                class=${i?"recent-connection":"active-connection"}
                data-testid=${i?"recent-connection":"active-connection"}
                imageSrc=${a}
                .iconBadge=${this.isSmartAccount(P.address)?pe.BADGE.ICON:void 0}
                .iconBadgeSize=${this.isSmartAccount(P.address)?pe.BADGE.SIZE:void 0}
                .icon=${N.icon}
                .iconSize=${N.iconSize}
                .loading=${xe}
                .showBalance=${!1}
                .charsStart=${pe.ADDRESS_DISPLAY.START}
                .charsEnd=${pe.ADDRESS_DISPLAY.END}
                @buttonClick=${()=>this.handleSwitchWallet(n,P.address,r)}
                @iconClick=${()=>this.handleWalletAction({connection:n,address:P.address,isRecentConnection:i,namespace:r})}
              ></wui-inactive-profile-wallet-item>
            </wui-flex>
          `})})}renderAddConnectionButton(e){if(!this.isMultiWalletEnabled()&&this.caipAddress||!this.hasAnyConnections(e))return null;let{title:i}=this.getChainLabelInfo(e);return u`
      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="plus"
        iconSize="sm"
        ?chevron=${!0}
        @click=${()=>this.handleAddConnection(e)}
        data-testid="add-connection-button"
      >
        <wui-text variant="md-medium" color="secondary">${i}</wui-text>
      </wui-list-item>
    `}renderEmptyState(e){let{title:i,description:r}=this.getChainLabelInfo(e);return u`
      <wui-flex alignItems="flex-start" class="empty-template" data-testid="empty-template">
        <wui-flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          rowgap="3"
          class="empty-box"
        >
          <wui-icon-box size="xl" icon="wallet" color="secondary"></wui-icon-box>

          <wui-flex flexDirection="column" alignItems="center" justifyContent="center" gap="1">
            <wui-text color="primary" variant="lg-regular" data-testid="empty-state-text"
              >No wallet connected</wui-text
            >
            <wui-text color="secondary" variant="md-regular" data-testid="empty-state-description"
              >${r}</wui-text
            >
          </wui-flex>

          <wui-link
            @click=${()=>this.handleAddConnection(e)}
            data-testid="empty-state-button"
            icon="plus"
          >
            ${i}
          </wui-link>
        </wui-flex>
      </wui-flex>
    `}handleTabChange(e){let i=this.namespaces[e];i&&(this.chainListener?.(),this.currentTab=this.namespaces.indexOf(i),this.namespace=i,this.caipAddress=h.getAccountData(i)?.caipAddress,this.profileName=h.getAccountData(i)?.profileName,this.chainListener=h.subscribeChainProp("accountState",r=>{this.caipAddress=r?.caipAddress},i))}async handleSwitchWallet(e,i,r){try{this.isSwitching=!0,this.lastSelectedConnectorId=e.connectorId,this.lastSelectedAddress=i,this.caipNetwork?.chainNamespace!==r&&e?.caipNetwork&&(S.setFilterByNamespace(r),await h.switchActiveNetwork(e?.caipNetwork)),await k.switchConnection({connection:e,address:i,namespace:r,closeModalOnConnect:!1,onChange({hasSwitchedAccount:o,hasSwitchedWallet:s}){s?T.showSuccess("Wallet switched"):o&&T.showSuccess("Account switched")}})}catch{T.showError("Failed to switch wallet")}finally{this.isSwitching=!1}}handleWalletAction(e){let{connection:i,address:r,isRecentConnection:n,namespace:o}=e;n?(te.deleteAddressFromConnection({connectorId:i.connectorId,address:r,namespace:o}),k.syncStorageConnections(),T.showSuccess("Wallet deleted")):this.handleDisconnect(o,i.connectorId)}async handleDisconnect(e,i){try{await k.disconnect({id:i,namespace:e}),T.showSuccess("Wallet disconnected")}catch{T.showError("Failed to disconnect wallet")}}handleCopyAddress(e){$.copyToClopboard(e),T.showSuccess("Address copied")}handleMore(){x.push("AccountSettings")}handleExternalLink(e){let i=this.caipNetwork?.blockExplorers?.default.url;i&&$.openHref(`${i}/address/${e}`,"_blank")}handleAddConnection(e){S.setFilterByNamespace(e),x.push("Connect",{addWalletForNamespace:e})}getChainLabelInfo(e){return lr[e]??{title:"Add Wallet",description:"Add your first wallet"}}isSmartAccount(e){if(!this.namespace)return!1;let i=this.user?.accounts?.find(r=>r.type==="smartAccount");return i&&e?q.isLowerCaseMatch(i.address,e):!1}getPlainAddress(){return this.caipAddress?$.getPlainAddress(this.caipAddress):void 0}getActiveConnections(e){let i=this.activeConnectorIds[e],{connections:r}=ae.getConnectionsData(e),[n]=r.filter(N=>q.isLowerCaseMatch(N.connectorId,i));if(!i)return r;let o=e===I.CHAIN.BITCOIN,{address:s}=this.caipAddress?bi.parseCaipAddress(this.caipAddress):{},a=[...s?[s]:[]];return o&&n&&(a=n.accounts.map(N=>N.address)||[]),ae.excludeConnectorAddressFromConnections({connectorId:i,addresses:a,connections:r})}hasAnyConnections(e){let i=this.getActiveConnections(e),{recentConnections:r}=ae.getConnectionsData(e);return!!this.caipAddress||i.length>0||r.length>0}isAccountLoading(e,i){return q.isLowerCaseMatch(this.lastSelectedConnectorId,e)&&q.isLowerCaseMatch(this.lastSelectedAddress,i)&&this.isSwitching}getProfileContent(e){let{address:i,connections:r,connectorId:n,namespace:o}=e,[s]=r.filter(N=>q.isLowerCaseMatch(N.connectorId,n));if(o===I.CHAIN.BITCOIN&&s?.accounts.every(N=>typeof N.type=="string"))return this.getBitcoinProfileContent(s.accounts,i);let a=Ot.getAuthData({connectorId:n,accounts:[]});return[{address:i,tagLabel:"Active",tagVariant:"success",enableButton:!0,profileName:this.profileName,buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral-secondary",...a.isAuth?{description:this.isSmartAccount(i)?"Smart Account":"EOA Account"}:{}}]}getBitcoinProfileContent(e,i){let r=e.length>1,n=this.getPlainAddress();return e.map(o=>{let s=q.isLowerCaseMatch(o.address,n),a="PAYMENT";return o.type==="ordinal"&&(a="ORDINALS"),{address:o.address,tagLabel:q.isLowerCaseMatch(o.address,i)?"Active":void 0,tagVariant:q.isLowerCaseMatch(o.address,i)?"success":void 0,enableButton:!0,...r?{label:a,alignItems:"flex-end",buttonType:s?"disconnect":"switch",buttonLabel:s?"Disconnect":"Switch",buttonVariant:s?"neutral-secondary":"accent-secondary"}:{alignItems:"center",buttonType:"disconnect",buttonLabel:"Disconnect",buttonVariant:"neutral-secondary"}}})}removeScrollListener(){let e=this.shadowRoot?.querySelector(".wallet-list");e&&e.removeEventListener("scroll",()=>this.handleConnectListScroll())}handleConnectListScroll(){let e=this.shadowRoot?.querySelector(".wallet-list");e&&this.updateScrollOpacity(e)}isMultiWalletEnabled(){return!!this.remoteFeatures?.multiWallet}updateScrollOpacity(e){e.style.setProperty("--connect-scroll--top-opacity",et.interpolate([0,pe.SCROLL_THRESHOLD],pe.OPACITY_RANGE,e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",et.interpolate([0,pe.SCROLL_THRESHOLD],pe.OPACITY_RANGE,e.scrollHeight-e.scrollTop-e.offsetHeight).toString())}onConnectionsChange(){if(this.isMultiWalletEnabled()&&this.namespace){let{connections:e}=ae.getConnectionsData(this.namespace);e.length===0&&x.reset("ProfileWallets")}this.requestUpdate()}};X.styles=Ji;ne([m()],X.prototype,"currentTab",void 0);ne([m()],X.prototype,"namespace",void 0);ne([m()],X.prototype,"namespaces",void 0);ne([m()],X.prototype,"caipAddress",void 0);ne([m()],X.prototype,"profileName",void 0);ne([m()],X.prototype,"activeConnectorIds",void 0);ne([m()],X.prototype,"lastSelectedAddress",void 0);ne([m()],X.prototype,"lastSelectedConnectorId",void 0);ne([m()],X.prototype,"isSwitching",void 0);ne([m()],X.prototype,"caipNetwork",void 0);ne([m()],X.prototype,"user",void 0);ne([m()],X.prototype,"remoteFeatures",void 0);X=ne([f("w3m-profile-wallets-view")],X);l();p();c();var at=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Be=class extends y{constructor(){super(),this.unsubscribe=[],this.activeCaipNetwork=h.state.activeCaipNetwork,this.features=v.state.features,this.remoteFeatures=v.state.remoteFeatures,this.exchangesLoading=K.state.isLoading,this.exchanges=K.state.exchanges,this.unsubscribe.push(v.subscribeKey("features",e=>this.features=e),v.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),h.subscribeKey("activeCaipNetwork",e=>{this.activeCaipNetwork=e,this.setDefaultPaymentAsset()}),K.subscribeKey("isLoading",e=>this.exchangesLoading=e),K.subscribeKey("exchanges",e=>this.exchanges=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}async firstUpdated(){K.isPayWithExchangeSupported()&&(await this.setDefaultPaymentAsset(),await K.fetchExchanges())}render(){return u`
      <wui-flex flexDirection="column" .padding=${["1","3","3","3"]} gap="2">
        ${this.onrampTemplate()} ${this.receiveTemplate()} ${this.depositFromExchangeTemplate()}
      </wui-flex>
    `}async setDefaultPaymentAsset(){if(!this.activeCaipNetwork)return;let e=await K.getAssetsForNetwork(this.activeCaipNetwork.caipNetworkId),i=e.find(r=>r.metadata.symbol==="USDC")||e[0];i&&K.setPaymentAsset(i)}onrampTemplate(){if(!this.activeCaipNetwork)return null;let e=this.remoteFeatures?.onramp,i=D.ONRAMP_SUPPORTED_CHAIN_NAMESPACES.includes(this.activeCaipNetwork.chainNamespace);return!e||!i?null:u`
      <wui-list-item
        @click=${this.onBuyCrypto.bind(this)}
        icon="card"
        data-testid="wallet-features-onramp-button"
      >
        <wui-text variant="lg-regular" color="primary">Buy crypto</wui-text>
      </wui-list-item>
    `}depositFromExchangeTemplate(){return!this.activeCaipNetwork||!K.isPayWithExchangeSupported()?null:u`
      <wui-list-item
        @click=${this.onDepositFromExchange.bind(this)}
        icon="arrowBottomCircle"
        data-testid="wallet-features-deposit-from-exchange-button"
        ?loading=${this.exchangesLoading}
        ?disabled=${this.exchangesLoading||!this.exchanges.length}
      >
        <wui-text variant="lg-regular" color="primary">Deposit from exchange</wui-text>
      </wui-list-item>
    `}receiveTemplate(){return!this.features?.receive?null:u`
      <wui-list-item
        @click=${this.onReceive.bind(this)}
        icon="qrCode"
        data-testid="wallet-features-receive-button"
      >
        <wui-text variant="lg-regular" color="primary">Receive funds</wui-text>
      </wui-list-item>
    `}onBuyCrypto(){x.push("OnRampProviders")}onReceive(){x.push("WalletReceive")}onDepositFromExchange(){K.reset(),x.push("PayWithExchange",{redirectView:x.state.data?.redirectView})}};at([m()],Be.prototype,"activeCaipNetwork",void 0);at([m()],Be.prototype,"features",void 0);at([m()],Be.prototype,"remoteFeatures",void 0);at([m()],Be.prototype,"exchangesLoading",void 0);at([m()],Be.prototype,"exchanges",void 0);Be=at([f("w3m-fund-wallet-view")],Be);l();p();c();l();p();c();l();p();c();l();p();c();l();p();c();var Zi=E`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    user-select: none;
    transition:
      background-color ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      color ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      border ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      box-shadow ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      width ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      height ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      transform ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      opacity ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
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
    background-color: ${({colors:t})=>t.neutrals300};
    border-radius: ${({borderRadius:t})=>t.round};
    border: 1px solid transparent;
    will-change: border;
    transition:
      background-color ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      color ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      border ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      box-shadow ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      width ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      height ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]},
      transform ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-2"]},
      opacity ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  span:before {
    content: '';
    position: absolute;
    background-color: ${({colors:t})=>t.white};
    border-radius: 50%;
  }

  /* -- Sizes --------------------------------------------------------- */
  label[data-size='lg'] {
    width: 48px;
    height: 32px;
  }

  label[data-size='md'] {
    width: 40px;
    height: 28px;
  }

  label[data-size='sm'] {
    width: 32px;
    height: 22px;
  }

  label[data-size='lg'] > span:before {
    height: 24px;
    width: 24px;
    left: 4px;
    top: 3px;
  }

  label[data-size='md'] > span:before {
    height: 20px;
    width: 20px;
    left: 4px;
    top: 3px;
  }

  label[data-size='sm'] > span:before {
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
  }

  /* -- Focus states --------------------------------------------------- */
  input:focus-visible:not(:checked) + span,
  input:focus:not(:checked) + span {
    border: 1px solid ${({tokens:t})=>t.core.iconAccentPrimary};
    background-color: ${({tokens:t})=>t.theme.textTertiary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  input:focus-visible:checked + span,
  input:focus:checked + span {
    border: 1px solid ${({tokens:t})=>t.core.iconAccentPrimary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  /* -- Checked states --------------------------------------------------- */
  input:checked + span {
    background-color: ${({tokens:t})=>t.core.iconAccentPrimary};
  }

  label[data-size='lg'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='md'] > input:checked + span:before {
    transform: translateX(calc(100% - 9px));
  }

  label[data-size='sm'] > input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }

  /* -- Hover states ------------------------------------------------------- */
  label:hover > input:not(:checked):not(:disabled) + span {
    background-color: ${({colors:t})=>t.neutrals400};
  }

  label:hover > input:checked:not(:disabled) + span {
    background-color: ${({colors:t})=>t.accent080};
  }

  /* -- Disabled state --------------------------------------------------- */
  label:has(input:disabled) {
    pointer-events: none;
    user-select: none;
  }

  input:not(:checked):disabled + span {
    background-color: ${({colors:t})=>t.neutrals700};
  }

  input:checked:disabled + span {
    background-color: ${({colors:t})=>t.neutrals700};
  }

  input:not(:checked):disabled + span::before {
    background-color: ${({colors:t})=>t.neutrals400};
  }

  input:checked:disabled + span::before {
    background-color: ${({tokens:t})=>t.theme.textTertiary};
  }
`;var Pt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},lt=class extends y{constructor(){super(...arguments),this.inputElementRef=tt(),this.checked=!1,this.disabled=!1,this.size="md"}render(){return u`
      <label data-size=${this.size}>
        <input
          ${it(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};lt.styles=[R,W,Zi];Pt([d({type:Boolean})],lt.prototype,"checked",void 0);Pt([d({type:Boolean})],lt.prototype,"disabled",void 0);Pt([d()],lt.prototype,"size",void 0);lt=Pt([f("wui-toggle")],lt);l();p();c();var eo=E`
  :host {
    height: auto;
  }

  :host > wui-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[3]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:t})=>t.theme.foregroundPrimary};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var to=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Lt=class extends y{constructor(){super(...arguments),this.checked=!1}render(){return u`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(e){e.stopPropagation(),this.checked=e.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("certifiedSwitchChange",{detail:this.checked,bubbles:!0,composed:!0}))}};Lt.styles=[R,W,eo];to([d({type:Boolean})],Lt.prototype,"checked",void 0);Lt=to([f("wui-certified-switch")],Lt);l();p();c();l();p();c();l();p();c();var io=E`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:t})=>t[3]};
    color: ${({tokens:t})=>t.theme.iconDefault};
    cursor: pointer;
    padding: ${({spacing:t})=>t[2]};
    background-color: transparent;
    border-radius: ${({borderRadius:t})=>t[4]};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
  }

  @media (hover: hover) {
    wui-icon:hover {
      background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    }
  }
`;var oo=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Dt=class extends y{constructor(){super(...arguments),this.inputComponentRef=tt(),this.inputValue=""}render(){return u`
      <wui-input-text
        ${it(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
        @inputChange=${this.onInputChange}
      >
        ${this.inputValue?u`<wui-icon
              @click=${this.clearValue}
              color="inherit"
              size="sm"
              name="close"
            ></wui-icon>`:null}
      </wui-input-text>
    `}onInputChange(e){this.inputValue=e.detail||""}clearValue(){let i=this.inputComponentRef.value?.inputElementRef.value;i&&(i.value="",this.inputValue="",i.focus(),i.dispatchEvent(new Event("input")))}};Dt.styles=[R,io];oo([d()],Dt.prototype,"inputValue",void 0);Dt=oo([f("wui-search-bar")],Dt);l();p();c();l();p();c();l();p();c();l();p();c();var ro=E`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 104px;
    width: 104px;
    row-gap: ${({spacing:t})=>t[2]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[5]};
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--apkt-path-network);
    clip-path: var(--apkt-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: ${({tokens:t})=>t.theme.foregroundSecondary};
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var no=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ut=class extends y{constructor(){super(...arguments),this.type="wallet"}render(){return u`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return this.type==="network"?u` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${Ei}`:u`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};Ut.styles=[R,W,ro];no([d()],Ut.prototype,"type",void 0);Ut=no([f("wui-card-select-loader")],Ut);l();p();c();l();p();c();l();p();c();var so=U`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var ue=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Z=class extends y{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};
      padding-top: ${this.padding&&B.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&B.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&B.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&B.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&B.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&B.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&B.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&B.getSpacingStyles(this.margin,3)};
    `,u`<slot></slot>`}};Z.styles=[R,so];ue([d()],Z.prototype,"gridTemplateRows",void 0);ue([d()],Z.prototype,"gridTemplateColumns",void 0);ue([d()],Z.prototype,"justifyItems",void 0);ue([d()],Z.prototype,"alignItems",void 0);ue([d()],Z.prototype,"justifyContent",void 0);ue([d()],Z.prototype,"alignContent",void 0);ue([d()],Z.prototype,"columnGap",void 0);ue([d()],Z.prototype,"rowGap",void 0);ue([d()],Z.prototype,"gap",void 0);ue([d()],Z.prototype,"padding",void 0);ue([d()],Z.prototype,"margin",void 0);Z=ue([f("wui-grid")],Z);l();p();c();l();p();c();var ao=E`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: ${({spacing:t})=>t[2]};
    padding: ${({spacing:t})=>t[3]} ${({spacing:t})=>t[0]};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: clamp(0px, ${({borderRadius:t})=>t[4]}, 20px);
    transition:
      color ${({durations:t})=>t.lg} ${({easings:t})=>t["ease-out-power-1"]},
      background-color ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-1"]},
      border-radius ${({durations:t})=>t.lg}
        ${({easings:t})=>t["ease-out-power-1"]};
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: ${({tokens:t})=>t.theme.textPrimary};
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    }
  }

  button:disabled > wui-flex > wui-text {
    color: ${({tokens:t})=>t.core.glass010};
  }

  [data-selected='true'] {
    background-color: ${({colors:t})=>t.accent020};
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: ${({colors:t})=>t.accent010};
    }
  }

  [data-selected='true']:active:enabled {
    background-color: ${({colors:t})=>t.accent010};
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var ve=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},de=class extends y{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId="",this.walletQuery="",this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(i=>{i.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let e=this.wallet?.badge_type==="certified";return u`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${C(e?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${e?u`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():u`
      <wui-wallet-image
        size="lg"
        imageSrc=${C(this.imageSrc)}
        name=${C(this.wallet?.name)}
        .installed=${this.wallet?.installed??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return u`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=_.getWalletImage(this.wallet),!this.imageSrc&&(this.imageLoading=!0,this.imageSrc=await _.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){!this.wallet||this.isImpressed||(this.isImpressed=!0,A.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:x.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};de.styles=ao;ve([m()],de.prototype,"visible",void 0);ve([m()],de.prototype,"imageSrc",void 0);ve([m()],de.prototype,"imageLoading",void 0);ve([m()],de.prototype,"isImpressed",void 0);ve([d()],de.prototype,"explorerId",void 0);ve([d()],de.prototype,"walletQuery",void 0);ve([d()],de.prototype,"certified",void 0);ve([d()],de.prototype,"displayIndex",void 0);ve([d({type:Object})],de.prototype,"wallet",void 0);de=ve([f("w3m-all-wallets-list-item")],de);l();p();c();var lo=E`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
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

  w3m-all-wallets-list-item {
    opacity: 0;
    animation-duration: ${({durations:t})=>t.xl};
    animation-timing-function: ${({easings:t})=>t["ease-inout-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-loading-spinner {
    padding-top: ${({spacing:t})=>t[4]};
    padding-bottom: ${({spacing:t})=>t[4]};
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var St=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},co="local-paginator",ze=class extends y{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!O.state.wallets.length,this.wallets=O.state.wallets,this.mobileFullScreen=v.state.enableMobileFullScreen,this.unsubscribe.push(O.subscribeKey("wallets",e=>this.wallets=e))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.paginationObserver?.disconnect()}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),u`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","3","3","3"]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let e=this.shadowRoot?.querySelector("wui-grid");e&&(await O.fetchWalletsByPage({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,i){return[...Array(e)].map(()=>u`
        <wui-card-select-loader type="wallet" id=${C(i)}></wui-card-select-loader>
      `)}walletsTemplate(){return Ae.getWalletConnectWallets(this.wallets).map((e,i)=>u`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${e.id}"
          @click=${()=>this.onConnectWallet(e)}
          .wallet=${e}
          explorerId=${e.id}
          certified=${this.badge==="certified"}
          displayIndex=${i}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:e,recommended:i,featured:r,count:n,mobileFilteredOutWalletsLength:o}=O.state,s=window.innerWidth<352?3:4,a=e.length+i.length,P=Math.ceil(a/s)*s-a+s;return P-=e.length?r.length%s:0,n===0&&r.length>0?null:n===0||[...r,...e,...i].length<n-(o??0)?this.shimmerTemplate(P,co):null}createPaginationObserver(){let e=this.shadowRoot?.querySelector(`#${co}`);e&&(this.paginationObserver=new IntersectionObserver(([i])=>{if(i?.isIntersecting&&!this.loading){let{page:r,count:n,wallets:o}=O.state;o.length<n&&O.fetchWalletsByPage({page:r+1})}}),this.paginationObserver.observe(e))}onConnectWallet(e){S.selectWalletConnector(e)}};ze.styles=lo;St([m()],ze.prototype,"loading",void 0);St([m()],ze.prototype,"wallets",void 0);St([m()],ze.prototype,"badge",void 0);St([m()],ze.prototype,"mobileFullScreen",void 0);ze=St([f("w3m-all-wallets-list")],ze);l();p();c();l();p();c();var po=U`
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

  :host([data-mobile-fullscreen='true']) wui-grid {
    max-height: none;
    height: auto;
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
`;var kt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Fe=class extends y{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=v.state.enableMobileFullScreen,this.query=""}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.onSearch(),this.loading?u`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await O.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:e}=O.state,i=Ae.markWalletsAsInstalled(e),r=Ae.filterWalletsByWcSupport(i);return r.length?u`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","3","3","3"]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${r.map((n,o)=>u`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(n)}
              .wallet=${n}
              data-testid="wallet-search-item-${n.id}"
              explorerId=${n.id}
              certified=${this.badge==="certified"}
              walletQuery=${this.query}
              displayIndex=${o}
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:u`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="3"
          flexDirection="column"
        >
          <wui-icon-box size="lg" color="default" icon="wallet"></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="secondary" variant="md-medium">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){S.selectWalletConnector(e)}};Fe.styles=po;kt([m()],Fe.prototype,"loading",void 0);kt([m()],Fe.prototype,"mobileFullScreen",void 0);kt([d()],Fe.prototype,"query",void 0);kt([d()],Fe.prototype,"badge",void 0);Fe=kt([f("w3m-all-wallets-search")],Fe);var ri=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},jt=class extends y{constructor(){super(...arguments),this.search="",this.badge=void 0,this.onDebouncedSearch=$.debounce(e=>{this.search=e})}render(){let e=this.search.length>=2;return u`
      <wui-flex .padding=${["1","3","3","3"]} gap="2" alignItems="center">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge==="certified"}
          @certifiedSwitchChange=${this.onCertifiedSwitchChange.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?u`<w3m-all-wallets-search
            query=${this.search}
            .badge=${this.badge}
          ></w3m-all-wallets-search>`:u`<w3m-all-wallets-list .badge=${this.badge}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onCertifiedSwitchChange(e){e.detail?(this.badge="certified",T.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return $.isMobile()?u`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){x.push("ConnectingWalletConnect")}};ri([m()],jt.prototype,"search",void 0);ri([m()],jt.prototype,"badge",void 0);jt=ri([f("w3m-all-wallets-view")],jt);l();p();c();l();p();c();l();p();c();l();p();c();var uo=E`
  button {
    display: flex;
    gap: ${({spacing:t})=>t[1]};
    padding: ${({spacing:t})=>t[4]};
    width: 100%;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
    justify-content: center;
    align-items: center;
  }

  :host([data-size='sm']) button {
    padding: ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host([data-size='md']) button {
    padding: ${({spacing:t})=>t[3]};
    border-radius: ${({borderRadius:t})=>t[3]};
  }

  button:hover {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  button:disabled {
    opacity: 0.5;
  }
`;var ct=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Te=class extends y{constructor(){super(...arguments),this.text="",this.disabled=!1,this.size="lg",this.icon="copy",this.tabIdx=void 0}render(){this.dataset.size=this.size;let e=`${this.size}-regular`;return u`
      <button ?disabled=${this.disabled} tabindex=${C(this.tabIdx)}>
        <wui-icon name=${this.icon} size=${this.size} color="default"></wui-icon>
        <wui-text align="center" variant=${e} color="primary">${this.text}</wui-text>
      </button>
    `}};Te.styles=[R,W,uo];ct([d()],Te.prototype,"text",void 0);ct([d({type:Boolean})],Te.prototype,"disabled",void 0);ct([d()],Te.prototype,"size",void 0);ct([d()],Te.prototype,"icon",void 0);ct([d()],Te.prototype,"tabIdx",void 0);Te=ct([f("wui-list-button")],Te);l();p();c();l();p();c();var mo=E`
  wui-separator {
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
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
    right: ${({spacing:t})=>t[2]};
  }

  wui-loading-spinner {
    right: ${({spacing:t})=>t[3]};
  }

  wui-text {
    margin: ${({spacing:t})=>t[2]} ${({spacing:t})=>t[3]}
      ${({spacing:t})=>t[0]} ${({spacing:t})=>t[3]};
  }
`;var Me=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Se=class extends y{constructor(){super(),this.unsubscribe=[],this.formRef=tt(),this.email="",this.loading=!1,this.error="",this.remoteFeatures=v.state.remoteFeatures,this.hasExceededUsageLimit=O.state.plan.hasExceededUsageLimit,this.unsubscribe.push(v.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}),O.subscribeKey("plan",e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.formRef.value?.addEventListener("keydown",e=>{e.key==="Enter"&&this.onSubmitEmail(e)})}render(){let e=k.hasAnyConnection(I.CONNECTOR_ID.AUTH);return u`
      <form ${it(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
        <wui-email-input
          @focus=${this.onFocusEvent.bind(this)}
          .disabled=${this.loading}
          @inputChange=${this.onEmailInputChange.bind(this)}
          tabIdx=${C(this.tabIdx)}
          ?disabled=${e||this.hasExceededUsageLimit}
        >
        </wui-email-input>

        ${this.submitButtonTemplate()}${this.loadingTemplate()}
        <input type="submit" hidden />
      </form>
      ${this.templateError()}
    `}submitButtonTemplate(){return!this.loading&&this.email.length>3?u`
          <wui-icon-link
            size="sm"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitEmail.bind(this)}
          >
          </wui-icon-link>
        `:null}loadingTemplate(){return this.loading?u`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:null}templateError(){return this.error?u`<wui-text variant="sm-medium" color="error">${this.error}</wui-text>`:null}onEmailInputChange(e){this.email=e.detail.trim(),this.error=""}async onSubmitEmail(e){if(!ot.isValidEmail(this.email)){Tt.open({displayMessage:vi.ALERT_WARNINGS.INVALID_EMAIL.displayMessage},"warning");return}if(!I.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(r=>r===h.state.activeChain)){let r=h.getFirstCaipNetworkSupportsAuthConnector();if(r){x.push("SwitchNetwork",{network:r});return}}try{if(this.loading)return;this.loading=!0,e.preventDefault();let r=S.getAuthConnector();if(!r)throw new Error("w3m-email-login-widget: Auth connector not found");let{action:n}=await r.provider.connectEmail({email:this.email});if(A.sendEvent({type:"track",event:"EMAIL_SUBMITTED"}),n==="VERIFY_OTP")A.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),x.push("EmailVerifyOtp",{email:this.email});else if(n==="VERIFY_DEVICE")x.push("EmailVerifyDevice",{email:this.email});else if(n==="CONNECT"){let o=this.remoteFeatures?.multiWallet;await k.connectExternal(r,h.state.activeChain),o?(x.replace("ProfileWallets"),T.showSuccess("New Wallet Added")):x.replace("Account")}}catch(r){$.parseError(r)?.includes("Invalid email")?this.error="Invalid email. Try again.":T.showError(r)}finally{this.loading=!1}}onFocusEvent(){A.sendEvent({type:"track",event:"EMAIL_LOGIN_SELECTED"})}};Se.styles=mo;Me([d()],Se.prototype,"tabIdx",void 0);Me([m()],Se.prototype,"email",void 0);Me([m()],Se.prototype,"loading",void 0);Me([m()],Se.prototype,"error",void 0);Me([m()],Se.prototype,"remoteFeatures",void 0);Me([m()],Se.prototype,"hasExceededUsageLimit",void 0);Se=Me([f("w3m-email-login-widget")],Se);l();p();c();l();p();c();l();p();c();l();p();c();var ho=E`
  :host {
    display: block;
    width: 100%;
  }

  button {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  @media (hover: hover) {
    button:hover:enabled {
      background: ${({tokens:t})=>t.theme.foregroundSecondary};
    }
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;var Bt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},pt=class extends y{constructor(){super(...arguments),this.logo="google",this.disabled=!1,this.tabIdx=void 0}render(){return u`
      <button ?disabled=${this.disabled} tabindex=${C(this.tabIdx)}>
        <wui-icon size="xxl" name=${this.logo}></wui-icon>
      </button>
    `}};pt.styles=[R,W,ho];Bt([d()],pt.prototype,"logo",void 0);Bt([d({type:Boolean})],pt.prototype,"disabled",void 0);Bt([d()],pt.prototype,"tabIdx",void 0);pt=Bt([f("wui-logo-select")],pt);l();p();c();var fo=E`
  wui-separator {
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1)
      ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
  }
`;var We=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},wo=2,bo=6,$e=class extends y{constructor(){super(),this.unsubscribe=[],this.walletGuide="get-started",this.tabIdx=void 0,this.connectors=S.state.connectors,this.remoteFeatures=v.state.remoteFeatures,this.authConnector=this.connectors.find(e=>e.type==="AUTH"),this.isPwaLoading=!1,this.hasExceededUsageLimit=O.state.plan.hasExceededUsageLimit,this.unsubscribe.push(S.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(i=>i.type==="AUTH")}),v.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e),O.subscribeKey("plan",e=>this.hasExceededUsageLimit=e.hasExceededUsageLimit))}connectedCallback(){super.connectedCallback(),this.handlePwaFrameLoad()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u`
      <wui-flex
        class="container"
        flexDirection="column"
        gap="2"
        data-testid="w3m-social-login-widget"
      >
        ${this.topViewTemplate()}${this.bottomViewTemplate()}
      </wui-flex>
    `}topViewTemplate(){let e=this.walletGuide==="explore",i=this.remoteFeatures?.socials;return!i&&e?(i=D.DEFAULT_SOCIALS,this.renderTopViewContent(i)):i?this.renderTopViewContent(i):null}renderTopViewContent(e){return e.length===2?u` <wui-flex gap="2">
        ${e.slice(0,wo).map(i=>u`<wui-logo-select
              data-testid=${`social-selector-${i}`}
              @click=${()=>{this.onSocialClick(i)}}
              logo=${i}
              tabIdx=${C(this.tabIdx)}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
      </wui-flex>`:u` <wui-list-button
      data-testid=${`social-selector-${e[0]}`}
      @click=${()=>{this.onSocialClick(e[0])}}
      size="lg"
      icon=${C(e[0])}
      text=${`Continue with ${B.capitalize(e[0])}`}
      tabIdx=${C(this.tabIdx)}
      ?disabled=${this.isPwaLoading||this.hasConnection()}
    ></wui-list-button>`}bottomViewTemplate(){let e=this.remoteFeatures?.socials,i=this.walletGuide==="explore";return(!this.authConnector||!e||e.length===0)&&i&&(e=D.DEFAULT_SOCIALS),!e||e.length<=wo?null:e&&e.length>bo?u`<wui-flex gap="2">
        ${e.slice(1,bo-1).map(n=>u`<wui-logo-select
              data-testid=${`social-selector-${n}`}
              @click=${()=>{this.onSocialClick(n)}}
              logo=${n}
              tabIdx=${C(this.tabIdx)}
              ?focusable=${this.tabIdx!==void 0&&this.tabIdx>=0}
              ?disabled=${this.isPwaLoading||this.hasConnection()}
            ></wui-logo-select>`)}
        <wui-logo-select
          logo="more"
          tabIdx=${C(this.tabIdx)}
          @click=${this.onMoreSocialsClick.bind(this)}
          ?disabled=${this.isPwaLoading||this.hasConnection()}
          data-testid="social-selector-more"
        ></wui-logo-select>
      </wui-flex>`:e?u`<wui-flex gap="2">
      ${e.slice(1,e.length).map(n=>u`<wui-logo-select
            data-testid=${`social-selector-${n}`}
            @click=${()=>{this.onSocialClick(n)}}
            logo=${n}
            tabIdx=${C(this.tabIdx)}
            ?focusable=${this.tabIdx!==void 0&&this.tabIdx>=0}
            ?disabled=${this.isPwaLoading||this.hasConnection()}
          ></wui-logo-select>`)}
    </wui-flex>`:null}onMoreSocialsClick(){x.push("ConnectSocials")}async onSocialClick(e){if(this.hasExceededUsageLimit){x.push("UsageExceeded");return}if(!I.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(r=>r===h.state.activeChain)){let r=h.getFirstCaipNetworkSupportsAuthConnector();if(r){x.push("SwitchNetwork",{network:r});return}}e&&await xi(e)}async handlePwaFrameLoad(){if($.isPWA()){this.isPwaLoading=!0;try{this.authConnector?.provider instanceof gi&&await this.authConnector.provider.init()}catch(e){Tt.open({displayMessage:"Error loading embedded wallet in PWA",debugMessage:e.message},"error")}finally{this.isPwaLoading=!1}}}hasConnection(){return k.hasAnyConnection(I.CONNECTOR_ID.AUTH)}};$e.styles=fo;We([d()],$e.prototype,"walletGuide",void 0);We([d()],$e.prototype,"tabIdx",void 0);We([m()],$e.prototype,"connectors",void 0);We([m()],$e.prototype,"remoteFeatures",void 0);We([m()],$e.prototype,"authConnector",void 0);We([m()],$e.prototype,"isPwaLoading",void 0);We([m()],$e.prototype,"hasExceededUsageLimit",void 0);$e=We([f("w3m-social-login-widget")],$e);l();p();c();l();p();c();var ut=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ve=class extends y{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=S.state.connectors,this.count=O.state.count,this.filteredCount=O.state.filteredWallets.length,this.isFetchingRecommendedWallets=O.state.isFetchingRecommendedWallets,this.unsubscribe.push(S.subscribeKey("connectors",e=>this.connectors=e),O.subscribeKey("count",e=>this.count=e),O.subscribeKey("filteredWallets",e=>this.filteredCount=e.length),O.subscribeKey("isFetchingRecommendedWallets",e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.connectors.find(P=>P.id==="walletConnect"),{allWallets:i}=v.state;if(!e||i==="HIDE"||i==="ONLY_MOBILE"&&!$.isMobile())return null;let r=O.state.featured.length,n=this.count+r,o=n<10?n:Math.floor(n/10)*10,s=this.filteredCount>0?this.filteredCount:o,a=`${s}`;this.filteredCount>0?a=`${this.filteredCount}`:s<n&&(a=`${s}+`);let N=k.hasAnyConnection(I.CONNECTOR_ID.WALLET_CONNECT);return u`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${a}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${C(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${N}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){A.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),x.push("AllWallets",{redirectView:x.state.data?.redirectView})}};ut([d()],Ve.prototype,"tabIdx",void 0);ut([m()],Ve.prototype,"connectors",void 0);ut([m()],Ve.prototype,"count",void 0);ut([m()],Ve.prototype,"filteredCount",void 0);ut([m()],Ve.prototype,"isFetchingRecommendedWallets",void 0);Ve=ut([f("w3m-all-wallets-widget")],Ve);l();p();c();l();p();c();var go=E`
  :host {
    margin-top: ${({spacing:t})=>t[1]};
  }
  wui-separator {
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1)
      ${({spacing:t})=>t[2]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
  }
`;var dt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ne=class extends y{constructor(){super(),this.unsubscribe=[],this.explorerWallets=O.state.explorerWallets,this.connections=k.state.connections,this.connectorImages=ie.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(k.subscribeKey("connections",e=>this.connections=e),ie.subscribeKey("connectorImages",e=>this.connectorImages=e),O.subscribeKey("explorerFilteredWallets",e=>{this.explorerWallets=e?.length?e:O.state.explorerWallets}),O.subscribeKey("explorerWallets",e=>{this.explorerWallets?.length||(this.explorerWallets=e)})),$.isTelegram()&&$.isIos()&&(this.loadingTelegram=!k.state.wcUri,this.unsubscribe.push(k.subscribeKey("wcUri",e=>this.loadingTelegram=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){return Qe.connectorList().map((e,i)=>e.kind==="connector"?this.renderConnector(e,i):this.renderWallet(e,i))}getConnectorNamespaces(e){return e.subtype==="walletConnect"?[]:e.subtype==="multiChain"?e.connector.connectors?.map(i=>i.chain)||[]:[e.connector.chain]}renderConnector(e,i){let r=e.connector,n=_.getConnectorImage(r)||this.connectorImages[r?.imageId??""],s=(this.connections.get(r.chain)??[]).some(se=>q.isLowerCaseMatch(se.connectorId,r.id)),a,N;e.subtype==="walletConnect"?(a="qr code",N="accent"):e.subtype==="injected"||e.subtype==="announced"?(a=s?"connected":"installed",N=s?"info":"success"):(a=void 0,N=void 0);let P=k.hasAnyConnection(I.CONNECTOR_ID.WALLET_CONNECT),z=e.subtype==="walletConnect"||e.subtype==="external"?P:!1;return u`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${C(n)}
        .installed=${!0}
        name=${r.name??"Unknown"}
        .tagVariant=${N}
        tagLabel=${C(a)}
        data-testid=${`wallet-selector-${r.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(e)}
        tabIdx=${C(this.tabIdx)}
        ?disabled=${z}
        rdnsId=${C(r.explorerWallet?.rdns||void 0)}
        walletRank=${C(r.explorerWallet?.order)}
        .namespaces=${this.getConnectorNamespaces(e)}
      >
      </w3m-list-wallet>
    `}onClickConnector(e){let i=x.state.data?.redirectView;if(e.subtype==="walletConnect"){S.setActiveConnector(e.connector),$.isMobile()?x.push("AllWallets"):x.push("ConnectingWalletConnect",{redirectView:i});return}if(e.subtype==="multiChain"){S.setActiveConnector(e.connector),x.push("ConnectingMultiChain",{redirectView:i});return}if(e.subtype==="injected"){S.setActiveConnector(e.connector),x.push("ConnectingExternal",{connector:e.connector,redirectView:i,wallet:e.connector.explorerWallet});return}if(e.subtype==="announced"){if(e.connector.id==="walletConnect"){$.isMobile()?x.push("AllWallets"):x.push("ConnectingWalletConnect",{redirectView:i});return}x.push("ConnectingExternal",{connector:e.connector,redirectView:i,wallet:e.connector.explorerWallet});return}x.push("ConnectingExternal",{connector:e.connector,redirectView:i})}renderWallet(e,i){let r=e.wallet,n=_.getWalletImage(r),s=k.hasAnyConnection(I.CONNECTOR_ID.WALLET_CONNECT),a=this.loadingTelegram,N=e.subtype==="recent"?"recent":void 0,P=e.subtype==="recent"?"info":void 0;return u`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${C(n)}
        name=${r.name??"Unknown"}
        @click=${()=>this.onClickWallet(e)}
        size="sm"
        data-testid=${`wallet-selector-${r.id}`}
        tabIdx=${C(this.tabIdx)}
        ?loading=${a}
        ?disabled=${s}
        rdnsId=${C(r.rdns||void 0)}
        walletRank=${C(r.order)}
        tagLabel=${C(N)}
        .tagVariant=${P}
      >
      </w3m-list-wallet>
    `}onClickWallet(e){let i=x.state.data?.redirectView,r=h.state.activeChain;if(e.subtype==="featured"){S.selectWalletConnector(e.wallet);return}if(e.subtype==="recent"){if(this.loadingTelegram)return;S.selectWalletConnector(e.wallet);return}if(e.subtype==="custom"){if(this.loadingTelegram)return;x.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:i});return}if(this.loadingTelegram)return;let n=r?S.getConnector({id:e.wallet.id,namespace:r}):void 0;n?x.push("ConnectingExternal",{connector:n,redirectView:i}):x.push("ConnectingWalletConnect",{wallet:e.wallet,redirectView:i})}};Ne.styles=go;dt([d({type:Number})],Ne.prototype,"tabIdx",void 0);dt([m()],Ne.prototype,"explorerWallets",void 0);dt([m()],Ne.prototype,"connections",void 0);dt([m()],Ne.prototype,"connectorImages",void 0);dt([m()],Ne.prototype,"loadingTelegram",void 0);Ne=dt([f("w3m-connector-list")],Ne);var yo=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},ni=class extends y{constructor(){super(...arguments),this.tabIdx=void 0}render(){return u`
      <wui-flex flexDirection="column" gap="2">
        <w3m-connector-list tabIdx=${C(this.tabIdx)}></w3m-connector-list>
        <w3m-all-wallets-widget tabIdx=${C(this.tabIdx)}></w3m-all-wallets-widget>
      </wui-flex>
    `}};yo([d()],ni.prototype,"tabIdx",void 0);ni=yo([f("w3m-wallet-login-list")],ni);l();p();c();var xo=E`
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
    transition: opacity ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity;
    mask-image: var(--connect-mask-image);
  }

  .guide {
    transition: opacity ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
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
    margin: ${({spacing:t})=>t[3]} calc(${({spacing:t})=>t[3]} * -1);
    width: calc(100% + ${({spacing:t})=>t[3]} * 2);
  }
`;var me=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},cr=470,ee=class extends y{constructor(){super(),this.unsubscribe=[],this.connectors=S.state.connectors,this.authConnector=this.connectors.find(e=>e.type==="AUTH"),this.features=v.state.features,this.remoteFeatures=v.state.remoteFeatures,this.enableWallets=v.state.enableWallets,this.noAdapters=h.state.noAdapters,this.walletGuide="get-started",this.checked=Ze.state.isLegalCheckboxChecked,this.isEmailEnabled=this.remoteFeatures?.email&&!h.state.noAdapters,this.isSocialEnabled=this.remoteFeatures?.socials&&this.remoteFeatures.socials.length>0&&!h.state.noAdapters,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors),this.unsubscribe.push(S.subscribeKey("connectors",e=>{this.connectors=e,this.authConnector=this.connectors.find(i=>i.type==="AUTH"),this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)}),v.subscribeKey("features",e=>{this.features=e}),v.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e,this.setEmailAndSocialEnableCheck(this.noAdapters,this.remoteFeatures)}),v.subscribeKey("enableWallets",e=>this.enableWallets=e),h.subscribeKey("noAdapters",e=>this.setEmailAndSocialEnableCheck(e,this.remoteFeatures)),Ze.subscribeKey("isLegalCheckboxChecked",e=>this.checked=e))}disconnectedCallback(){this.unsubscribe.forEach(i=>i()),this.resizeObserver?.disconnect(),this.shadowRoot?.querySelector(".connect")?.removeEventListener("scroll",this.handleConnectListScroll.bind(this))}firstUpdated(){let e=this.shadowRoot?.querySelector(".connect");e&&(requestAnimationFrame(this.handleConnectListScroll.bind(this)),e?.addEventListener("scroll",this.handleConnectListScroll.bind(this)),this.resizeObserver=new ResizeObserver(()=>{this.handleConnectListScroll()}),this.resizeObserver?.observe(e),this.handleConnectListScroll())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:i}=v.state,r=v.state.features?.legalCheckbox,s=!!(e||i)&&!!r&&this.walletGuide==="get-started"&&!this.checked,a={connect:!0,disabled:s},N=v.state.enableWalletGuide,P=this.enableWallets,z=this.isSocialEnabled||this.authConnector,se=s?-1:void 0;return u`
      <wui-flex flexDirection="column">
        ${this.legalCheckboxTemplate()}
        <wui-flex
          data-testid="w3m-connect-scroll-view"
          flexDirection="column"
          .padding=${["0","0","4","0"]}
          class=${Wt(a)}
        >
          <wui-flex
            class="connect-methods"
            flexDirection="column"
            gap="2"
            .padding=${z&&P&&N&&this.walletGuide==="get-started"?["0","3","0","3"]:["0","3","3","3"]}
          >
            ${this.renderConnectMethod(se)}
          </wui-flex>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}reownBrandingTemplate(){return ot.hasFooter()||!this.remoteFeatures?.reownBranding?null:u`<wui-ux-by-reown></wui-ux-by-reown>`}setEmailAndSocialEnableCheck(e,i){this.isEmailEnabled=i?.email&&!e,this.isSocialEnabled=i?.socials&&i.socials.length>0&&!e,this.remoteFeatures=i,this.noAdapters=e}checkIfAuthEnabled(e){let i=e.filter(n=>n.type===Ci.CONNECTOR_TYPE_AUTH).map(n=>n.chain);return I.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(n=>i.includes(n))}renderConnectMethod(e){let i=Ae.getConnectOrderMethod(this.features,this.connectors);return u`${i.map((r,n)=>{switch(r){case"email":return u`${this.emailTemplate(e)} ${this.separatorTemplate(n,"email")}`;case"social":return u`${this.socialListTemplate(e)}
          ${this.separatorTemplate(n,"social")}`;case"wallet":return u`${this.walletListTemplate(e)}
          ${this.separatorTemplate(n,"wallet")}`;default:return null}})}`}checkMethodEnabled(e){switch(e){case"wallet":return this.enableWallets;case"social":return this.isSocialEnabled&&this.isAuthEnabled;case"email":return this.isEmailEnabled&&this.isAuthEnabled;default:return null}}checkIsThereNextMethod(e){let r=Ae.getConnectOrderMethod(this.features,this.connectors)[e+1];return r?this.checkMethodEnabled(r)?r:this.checkIsThereNextMethod(e+1):void 0}separatorTemplate(e,i){let r=this.checkIsThereNextMethod(e),n=this.walletGuide==="explore";switch(i){case"wallet":return this.enableWallets&&r&&!n?u`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null;case"email":{let o=r==="social";return this.isAuthEnabled&&this.isEmailEnabled&&!o&&r?u`<wui-separator
              data-testid="w3m-email-login-or-separator"
              text="or"
            ></wui-separator>`:null}case"social":{let o=r==="email";return this.isAuthEnabled&&this.isSocialEnabled&&!o&&r?u`<wui-separator data-testid="wui-separator" text="or"></wui-separator>`:null}default:return null}}emailTemplate(e){return!this.isEmailEnabled||!this.isAuthEnabled?null:u`<w3m-email-login-widget tabIdx=${C(e)}></w3m-email-login-widget>`}socialListTemplate(e){return!this.isSocialEnabled||!this.isAuthEnabled?null:u`<w3m-social-login-widget
      walletGuide=${this.walletGuide}
      tabIdx=${C(e)}
    ></w3m-social-login-widget>`}walletListTemplate(e){let i=this.enableWallets,r=this.features?.emailShowWallets===!1,n=this.features?.collapseWallets,o=r||n;return!i||($.isTelegram()&&($.isSafari()||$.isIos())&&k.connectWalletConnect().catch(a=>({})),this.walletGuide==="explore")?null:this.isAuthEnabled&&(this.isEmailEnabled||this.isSocialEnabled)&&o?u`<wui-list-button
        data-testid="w3m-collapse-wallets-button"
        tabIdx=${C(e)}
        @click=${this.onContinueWalletClick.bind(this)}
        text="Continue with a wallet"
      ></wui-list-button>`:u`<w3m-wallet-login-list tabIdx=${C(e)}></w3m-wallet-login-list>`}legalCheckboxTemplate(){return this.walletGuide==="explore"?null:u`<w3m-legal-checkbox data-testid="w3m-legal-checkbox"></w3m-legal-checkbox>`}handleConnectListScroll(){let e=this.shadowRoot?.querySelector(".connect");if(!e)return;e.scrollHeight>cr?(e.style.setProperty("--connect-mask-image",`linear-gradient(
          to bottom,
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--top-opacity))) 0px,
          rgba(200, 200, 200, calc(1 - var(--connect-scroll--top-opacity))) 1px,
          black 100px,
          black calc(100% - 100px),
          rgba(155, 155, 155, calc(1 - var(--connect-scroll--bottom-opacity))) calc(100% - 1px),
          rgba(0, 0, 0, calc(1 - var(--connect-scroll--bottom-opacity))) 100%
        )`),e.style.setProperty("--connect-scroll--top-opacity",et.interpolate([0,50],[0,1],e.scrollTop).toString()),e.style.setProperty("--connect-scroll--bottom-opacity",et.interpolate([0,50],[0,1],e.scrollHeight-e.scrollTop-e.offsetHeight).toString())):(e.style.setProperty("--connect-mask-image","none"),e.style.setProperty("--connect-scroll--top-opacity","0"),e.style.setProperty("--connect-scroll--bottom-opacity","0"))}onContinueWalletClick(){x.push("ConnectWallets")}};ee.styles=xo;me([m()],ee.prototype,"connectors",void 0);me([m()],ee.prototype,"authConnector",void 0);me([m()],ee.prototype,"features",void 0);me([m()],ee.prototype,"remoteFeatures",void 0);me([m()],ee.prototype,"enableWallets",void 0);me([m()],ee.prototype,"noAdapters",void 0);me([d()],ee.prototype,"walletGuide",void 0);me([m()],ee.prototype,"checked",void 0);me([m()],ee.prototype,"isEmailEnabled",void 0);me([m()],ee.prototype,"isSocialEnabled",void 0);me([m()],ee.prototype,"isAuthEnabled",void 0);ee=me([f("w3m-connect-view")],ee);l();p();c();l();p();c();l();p();c();l();p();c();l();p();c();l();p();c();var Co=E`
  wui-flex {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[5]};
    padding-left: ${({spacing:t})=>t[3]};
    padding-right: ${({spacing:t})=>t[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:t})=>t[6]};
  }

  wui-text {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  wui-icon {
    width: 12px;
    height: 12px;
  }
`;var zt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},mt=class extends y{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return u`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};mt.styles=[R,W,Co];zt([d({type:Boolean})],mt.prototype,"disabled",void 0);zt([d()],mt.prototype,"label",void 0);zt([d()],mt.prototype,"buttonLabel",void 0);mt=zt([f("wui-cta-button")],mt);l();p();c();var vo=E`
  :host {
    display: block;
    padding: 0 ${({spacing:t})=>t[5]} ${({spacing:t})=>t[5]};
  }
`;var $o=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ft=class extends y{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:e,app_store:i,play_store:r,chrome_store:n,homepage:o}=this.wallet,s=$.isMobile(),a=$.isIos(),N=$.isAndroid(),P=[i,r,o,n].filter(Boolean).length>1,z=B.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return P&&!s?u`
        <wui-cta-button
          label=${`Don't have ${z}?`}
          buttonLabel="Get"
          @click=${()=>x.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!P&&o?u`
        <wui-cta-button
          label=${`Don't have ${z}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:i&&a?u`
        <wui-cta-button
          label=${`Don't have ${z}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:r&&N?u`
        <wui-cta-button
          label=${`Don't have ${z}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&$.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&$.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&$.openHref(this.wallet.homepage,"_blank")}};Ft.styles=[vo];$o([d({type:Object})],Ft.prototype,"wallet",void 0);Ft=$o([f("w3m-mobile-download-links")],Ft);l();p();c();var Eo=E`
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

  wui-wallet-image {
    width: 56px;
    height: 56px;
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
    transition-property: opacity, transform;
    transition-duration: ${({durations:t})=>t.lg};
    transition-timing-function: ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity, transform;
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

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  w3m-mobile-download-links {
    padding: 0px;
    width: 100%;
  }
`;var ye=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},L=class extends y{constructor(){super(),this.wallet=x.state.data?.wallet,this.connector=x.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=_.getConnectorImage(this.connector)??_.getWalletImage(this.wallet),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=k.state.wcUri,this.error=k.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(k.subscribeKey("wcUri",e=>{this.uri=e,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),k.subscribeKey("wcError",e=>this.error=e)),($.isTelegram()||$.isSafari())&&$.isIos()&&k.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),k.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let e=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,i="";return this.label?i=this.label:(i=`Continue in ${this.name}`,this.error&&(i="Connection declined")),u`
      <wui-flex
        data-error=${C(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${C(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            color="error"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="6"> <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","0","0"]}
        >
          <wui-text align="center" variant="lg-medium" color=${this.error?"error":"primary"}>
            ${i}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary">${e}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?u`
                <wui-button
                  variant="neutral-secondary"
                  size="md"
                  ?disabled=${this.isRetrying||this.isLoading}
                  @click=${this.onTryAgain.bind(this)}
                  data-testid="w3m-connecting-widget-secondary-button"
                >
                  <wui-icon
                    color="inherit"
                    slot="iconLeft"
                    name=${this.secondaryBtnIcon}
                  ></wui-icon>
                  ${this.secondaryBtnLabel}
                </wui-button>
              `:null}
      </wui-flex>

      ${this.isWalletConnect?u`
              <wui-flex .padding=${["0","5","5","5"]} justifyContent="center">
                <wui-link
                  @click=${this.onCopyUri}
                  variant="secondary"
                  icon="copy"
                  data-testid="wui-link-copy"
                >
                  Copy link
                </wui-link>
              </wui-flex>
            `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links></wui-flex>
      </wui-flex>
    `}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,this.shadowRoot?.querySelector("wui-button")?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"}))}onTryAgain(){k.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){let e=Je.state.themeVariables["--w3m-border-radius-master"],i=e?parseInt(e.replace("px",""),10):4;return u`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&($.copyToClopboard(this.uri),T.showSuccess("Link copied"))}catch{T.showError("Failed to copy")}}};L.styles=Eo;ye([m()],L.prototype,"isRetrying",void 0);ye([m()],L.prototype,"uri",void 0);ye([m()],L.prototype,"error",void 0);ye([m()],L.prototype,"ready",void 0);ye([m()],L.prototype,"showRetry",void 0);ye([m()],L.prototype,"label",void 0);ye([m()],L.prototype,"secondaryBtnLabel",void 0);ye([m()],L.prototype,"secondaryLabel",void 0);ye([m()],L.prototype,"isLoading",void 0);ye([d({type:Boolean})],L.prototype,"isMobile",void 0);ye([d()],L.prototype,"onRetry",void 0);var pr=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},So=class extends L{constructor(){if(super(),this.externalViewUnsubscribe=[],this.connectionsByNamespace=k.getConnections(this.connector?.chain),this.hasMultipleConnections=this.connectionsByNamespace.length>0,this.remoteFeatures=v.state.remoteFeatures,this.currentActiveConnectorId=S.state.activeConnectorIds[this.connector?.chain],!this.connector)throw new Error("w3m-connecting-view: No connector provided");let e=this.connector?.chain;this.isAlreadyConnected(this.connector)&&(this.secondaryBtnLabel=void 0,this.label=`This account is already linked, change your account in ${this.connector.name}`,this.secondaryLabel=`To link a new account, open ${this.connector.name} and switch to the account you want to link`),A.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.connector.name??"Unknown",platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:x.state.view}}),this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),this.isWalletConnect=!1,this.externalViewUnsubscribe.push(S.subscribeKey("activeConnectorIds",i=>{let r=i[e],n=this.remoteFeatures?.multiWallet,{redirectView:o}=x.state.data??{};r!==this.currentActiveConnectorId&&(this.hasMultipleConnections&&n?(x.replace("ProfileWallets"),T.showSuccess("New Wallet Added")):o?x.replace(o):j.close())}),k.subscribeKey("connections",this.onConnectionsChange.bind(this)))}disconnectedCallback(){this.externalViewUnsubscribe.forEach(e=>e())}async onConnectProxy(){try{if(this.error=!1,this.connector){if(this.isAlreadyConnected(this.connector))return;(this.connector.id!==I.CONNECTOR_ID.COINBASE_SDK||!this.error)&&await k.connectExternal(this.connector,this.connector.chain)}}catch(e){e instanceof Ye&&e.originalName===Xe.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?A.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):A.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}onConnectionsChange(e){if(this.connector?.chain&&e.get(this.connector.chain)&&this.isAlreadyConnected(this.connector)){let i=e.get(this.connector.chain)??[],r=this.remoteFeatures?.multiWallet;if(i.length===0)x.replace("Connect");else{let n=ae.getConnectionsByConnectorId(this.connectionsByNamespace,this.connector.id).flatMap(s=>s.accounts),o=ae.getConnectionsByConnectorId(i,this.connector.id).flatMap(s=>s.accounts);o.length===0?this.hasMultipleConnections&&r?(x.replace("ProfileWallets"),T.showSuccess("Wallet deleted")):j.close():!n.every(a=>o.some(N=>q.isLowerCaseMatch(a.address,N.address)))&&r&&x.replace("ProfileWallets")}}}isAlreadyConnected(e){return!!e&&this.connectionsByNamespace.some(i=>q.isLowerCaseMatch(i.connectorId,e.id))}};So=pr([f("w3m-connecting-external-view")],So);l();p();c();l();p();c();var ko=U`
  wui-flex,
  wui-list-wallet {
    width: 100%;
  }
`;var Ao=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Mt=class extends y{constructor(){super(),this.unsubscribe=[],this.activeConnector=S.state.activeConnector,this.unsubscribe.push(S.subscribeKey("activeConnector",e=>this.activeConnector=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3","5","5","5"]}
        gap="5"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image
            size="lg"
            imageSrc=${C(_.getConnectorImage(this.activeConnector))}
          ></wui-wallet-image>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["0","3","0","3"]}
        >
          <wui-text variant="lg-medium" color="primary">
            Select Chain for ${this.activeConnector?.name}
          </wui-text>
          <wui-text align="center" variant="lg-regular" color="secondary"
            >Select which chain to connect to your multi chain wallet</wui-text
          >
        </wui-flex>
        <wui-flex
          flexGrow="1"
          flexDirection="column"
          alignItems="center"
          gap="2"
          .padding=${["2","0","2","0"]}
        >
          ${this.networksTemplate()}
        </wui-flex>
      </wui-flex>
    `}networksTemplate(){return this.activeConnector?.connectors?.map((e,i)=>e.name?u`
            <w3m-list-wallet
              displayIndex=${i}
              imageSrc=${C(_.getChainImage(e.chain))}
              name=${I.CHAIN_NAME_MAP[e.chain]}
              @click=${()=>this.onConnector(e)}
              size="sm"
              data-testid="wui-list-chain-${e.chain}"
              rdnsId=${e.explorerWallet?.rdns}
            ></w3m-list-wallet>
          `:null)}onConnector(e){let i=this.activeConnector?.connectors?.find(n=>n.chain===e.chain),r=x.state.data?.redirectView;if(!i){T.showError("Failed to find connector");return}i.id==="walletConnect"?$.isMobile()?x.push("AllWallets"):x.push("ConnectingWalletConnect",{redirectView:r}):x.push("ConnectingExternal",{connector:i,redirectView:r,wallet:this.activeConnector?.explorerWallet})}};Mt.styles=ko;Ao([m()],Mt.prototype,"activeConnector",void 0);Mt=Ao([f("w3m-connecting-multi-chain-view")],Mt);l();p();c();l();p();c();var si=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Vt=class extends y{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.generateTabs();return u`
      <wui-flex justifyContent="center" .padding=${["0","0","4","0"]}>
        <wui-tabs .tabs=${e} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){let e=this.platforms.map(i=>i==="browser"?{label:"Browser",icon:"extension",platform:"browser"}:i==="mobile"?{label:"Mobile",icon:"mobile",platform:"mobile"}:i==="qrcode"?{label:"Mobile",icon:"mobile",platform:"qrcode"}:i==="web"?{label:"Webapp",icon:"browser",platform:"web"}:i==="desktop"?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=e.map(({platform:i})=>i),e}onTabChange(e){let i=this.platformTabs[e];i&&this.onSelectPlatfrom?.(i)}};si([d({type:Array})],Vt.prototype,"platforms",void 0);si([d()],Vt.prototype,"onSelectPlatfrom",void 0);Vt=si([f("w3m-connecting-header")],Vt);l();p();c();var ur=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ro=class extends L{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),A.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:x.state.view}})}async onConnectProxy(){try{this.error=!1;let{connectors:e}=S.state,i=e.find(r=>r.type==="ANNOUNCED"&&r.info?.rdns===this.wallet?.rdns||r.type==="INJECTED"||r.name===this.wallet?.name);if(i)await k.connectExternal(i,i.chain);else throw new Error("w3m-connecting-wc-browser: No connector found");j.close()}catch(e){e instanceof Ye&&e.originalName===Xe.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?A.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:e.message}}):A.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};Ro=ur([f("w3m-connecting-wc-browser")],Ro);l();p();c();var dr=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Io=class extends L{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),A.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:x.state.view}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:e,name:i}=this.wallet,{redirect:r,href:n}=$.formatNativeUrl(e,this.uri);k.setWcLinking({name:i,href:n}),k.setRecentWallet(this.wallet),$.openHref(r,"_blank")}catch{this.error=!0}}};Io=dr([f("w3m-connecting-wc-desktop")],Io);l();p();c();var ht=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},He=class extends L{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=v.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{ae.onConnectMobile(this.wallet)},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=D.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push(k.subscribeKey("wcUri",()=>{this.onHandleURI()})),A.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:x.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){k.setWcError(!1),this.onConnect?.()}};ht([m()],He.prototype,"redirectDeeplink",void 0);ht([m()],He.prototype,"redirectUniversalLink",void 0);ht([m()],He.prototype,"target",void 0);ht([m()],He.prototype,"preferUniversalLinks",void 0);ht([m()],He.prototype,"isLoading",void 0);He=ht([f("w3m-connecting-wc-mobile")],He);l();p();c();l();p();c();var _o=E`
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

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var To=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ht=class extends L{constructor(){super(),this.basic=!1}firstUpdated(){this.basic||A.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:x.state.view}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(e=>e())}render(){return this.onRenderProxy(),u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","5","5","5"]}
        gap="5"
      >
        <wui-shimmer width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>
        <wui-text variant="lg-medium" color="primary"> Scan this QR Code with your phone </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.wallet?this.wallet.name:void 0;k.setWcLinking(void 0),k.setRecentWallet(this.wallet);let i=Je.state.themeVariables["--apkt-qr-color"]??Je.state.themeVariables["--w3m-qr-color"];return u` <wui-qr-code
      theme=${Je.state.themeMode}
      uri=${this.uri}
      imageSrc=${C(_.getWalletImage(this.wallet))}
      color=${C(i)}
      alt=${C(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return u`<wui-button
      .disabled=${e}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      Copy link
      <wui-icon size="sm" color="inherit" name="copy" slot="iconRight"></wui-icon>
    </wui-button>`}};Ht.styles=_o;To([d({type:Boolean})],Ht.prototype,"basic",void 0);Ht=To([f("w3m-connecting-wc-qrcode")],Ht);l();p();c();var mr=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Wo=class extends y{constructor(){if(super(),this.wallet=x.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");A.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:x.state.view}})}render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${C(_.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};Wo=mr([f("w3m-connecting-wc-unsupported")],Wo);l();p();c();var No=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},ai=class extends L{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=D.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(k.subscribeKey("wcUri",()=>{this.updateLoadingState()})),A.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:x.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:e,name:i}=this.wallet,{redirect:r,href:n}=$.formatUniversalUrl(e,this.uri);k.setWcLinking({name:i,href:n}),k.setRecentWallet(this.wallet),$.openHref(r,"_blank")}catch{this.error=!0}}};No([m()],ai.prototype,"isLoading",void 0);ai=No([f("w3m-connecting-wc-web")],ai);l();p();c();var Oo=E`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`;var Ke=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},ke=class extends y{constructor(){super(),this.wallet=x.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!v.state.siwx,this.remoteFeatures=v.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(v.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return v.state.enableMobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),u`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return!this.remoteFeatures?.reownBranding||!this.displayBranding?null:u`<wui-ux-by-reown></wui-ux-by-reown>`}async initializeConnection(e=!1){if(!(this.platform==="browser"||v.state.manualWCControl&&!e))try{let{wcPairingExpiry:i,status:r}=k.state,{redirectView:n}=x.state.data??{};if(e||v.state.enableEmbedded||$.isPairingExpired(i)||r==="connecting"){let o=k.getConnections(h.state.activeChain),s=this.remoteFeatures?.multiWallet,a=o.length>0;await k.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(a&&s?(x.replace("ProfileWallets"),T.showSuccess("New Wallet Added")):n?x.replace(n):j.close())}}catch(i){if(i instanceof Error&&i.message.includes("An error occurred when attempting to switch chain")&&!v.state.enableNetworkSwitch&&h.state.activeChain){h.setActiveCaipNetwork($i.getUnsupportedNetwork(`${h.state.activeChain}:${h.state.activeCaipNetwork?.id}`)),h.showUnsupportedChainUI();return}i instanceof Ye&&i.originalName===Xe.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?A.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:i.message}}):A.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:i?.message??"Unknown"}}),k.setWcError(!0),T.showError(i.message??"Connection error"),k.resetWcConnection(),x.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:e,desktop_link:i,webapp_link:r,injected:n,rdns:o}=this.wallet,s=n?.map(({injected_id:ir})=>ir).filter(Boolean),a=[...o?[o]:s??[]],N=v.state.isUniversalProvider?!1:a.length,P=e,z=r,se=k.checkInstalled(a),xe=N&&se,tr=i&&!$.isMobile();xe&&!h.state.noAdapters&&this.platforms.push("browser"),P&&this.platforms.push($.isMobile()?"mobile":"qrcode"),z&&this.platforms.push("web"),tr&&this.platforms.push("desktop"),!xe&&N&&!h.state.noAdapters&&this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return u`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return u`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return u`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return u`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return u`<w3m-connecting-wc-qrcode ?basic=${this.basic}></w3m-connecting-wc-qrcode>`;default:return u`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?u`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){let i=this.shadowRoot?.querySelector("div");i&&(await i.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,i.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};ke.styles=Oo;Ke([m()],ke.prototype,"platform",void 0);Ke([m()],ke.prototype,"platforms",void 0);Ke([m()],ke.prototype,"isSiwxEnabled",void 0);Ke([m()],ke.prototype,"remoteFeatures",void 0);Ke([d({type:Boolean})],ke.prototype,"displayBranding",void 0);Ke([d({type:Boolean})],ke.prototype,"basic",void 0);ke=Ke([f("w3m-connecting-wc-view")],ke);l();p();c();var li=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Kt=class extends y{constructor(){super(),this.unsubscribe=[],this.isMobile=$.isMobile(),this.remoteFeatures=v.state.remoteFeatures,this.unsubscribe.push(v.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(this.isMobile){let{featured:e,recommended:i}=O.state,{customWallets:r}=v.state,n=te.getRecentWallets(),o=e.length||i.length||r?.length||n.length;return u`<wui-flex flexDirection="column" gap="2" .margin=${["1","3","3","3"]}>
        ${o?u`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return u`<wui-flex flexDirection="column" .padding=${["0","0","4","0"]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","3","0","3"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?u` <wui-flex flexDirection="column" .padding=${["1","0","1","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};li([m()],Kt.prototype,"isMobile",void 0);li([m()],Kt.prototype,"remoteFeatures",void 0);Kt=li([f("w3m-connecting-wc-basic-view")],Kt);l();p();c();l();p();c();var Po=U`
  .continue-button-container {
    width: 100%;
  }
`;var Lo=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},qt=class extends y{constructor(){super(...arguments),this.loading=!1}render(){return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="6"
        .padding=${["0","0","4","0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${()=>{$.openHref(wi.URLS.FAQ,"_blank")}}
        >
          Learn more about names
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
        <wui-icon-box icon="id" size="xl" iconSize="xxl" color="default"></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="3">
        <wui-text align="center" variant="lg-medium" color="primary">
          Choose your account name
        </wui-text>
        <wui-text align="center" variant="md-regular" color="primary">
          Finally say goodbye to 0x addresses, name your account to make it easier to exchange
          assets
        </wui-text>
      </wui-flex>
    </wui-flex>`}buttonsTemplate(){return u`<wui-flex
      .padding=${["0","8","0","8"]}
      gap="3"
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
    </wui-flex>`}handleContinue(){x.push("RegisterAccountName"),A.sendEvent({type:"track",event:"OPEN_ENS_FLOW",properties:{isSmartAccount:fe(h.state.activeChain)===he.ACCOUNT_TYPES.SMART_ACCOUNT}})}};qt.styles=Po;Lo([m()],qt.prototype,"loading",void 0);qt=Lo([f("w3m-choose-account-name-view")],qt);l();p();c();var hr=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Do=class extends y{constructor(){super(...arguments),this.wallet=x.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return u`
      <wui-flex gap="2" flexDirection="column" .padding=${["3","3","4","3"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?u`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?u`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?u`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?u`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(e){e.href&&this.wallet&&(A.sendEvent({type:"track",event:"GET_WALLET",properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:e.type}}),$.openHref(e.href,"_blank"))}onChromeStore(){this.wallet?.chrome_store&&this.openStore({href:this.wallet.chrome_store,type:"chrome_store"})}onAppStore(){this.wallet?.app_store&&this.openStore({href:this.wallet.app_store,type:"app_store"})}onPlayStore(){this.wallet?.play_store&&this.openStore({href:this.wallet.play_store,type:"play_store"})}onHomePage(){this.wallet?.homepage&&this.openStore({href:this.wallet.homepage,type:"homepage"})}};Do=hr([f("w3m-downloads-view")],Do);l();p();c();var fr=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},wr="https://walletconnect.com/explorer",Uo=class extends y{render(){return u`
      <wui-flex flexDirection="column" .padding=${["0","3","3","3"]} gap="2">
        ${this.recommendedWalletsTemplate()}
        <w3m-list-wallet
          name="Explore all"
          showAllWallets
          walletIcon="allWallets"
          icon="externalLink"
          size="sm"
          @click=${()=>{$.openHref("https://walletconnect.com/explorer?type=wallet","_blank")}}
        ></w3m-list-wallet>
      </wui-flex>
    `}recommendedWalletsTemplate(){let{recommended:e,featured:i}=O.state,{customWallets:r}=v.state;return[...i,...r??[],...e].slice(0,4).map((o,s)=>u`
        <w3m-list-wallet
          displayIndex=${s}
          name=${o.name??"Unknown"}
          tagVariant="accent"
          size="sm"
          imageSrc=${C(_.getWalletImage(o))}
          @click=${()=>{this.onWalletClick(o)}}
        ></w3m-list-wallet>
      `)}onWalletClick(e){A.sendEvent({type:"track",event:"GET_WALLET",properties:{name:e.name,walletRank:void 0,explorerId:e.id,type:"homepage"}}),$.openHref(e.homepage??wr,"_blank")}};Uo=fr([f("w3m-get-wallet-view")],Uo);l();p();c();l();p();c();var jo=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},ci=class extends y{constructor(){super(...arguments),this.data=[]}render(){return u`
      <wui-flex flexDirection="column" alignItems="center" gap="4">
        ${this.data.map(e=>u`
            <wui-flex flexDirection="column" alignItems="center" gap="5">
              <wui-flex flexDirection="row" justifyContent="center" gap="1">
                ${e.images.map(i=>u`<wui-visual size="sm" name=${i}></wui-visual>`)}
              </wui-flex>
            </wui-flex>
            <wui-flex flexDirection="column" alignItems="center" gap="1">
              <wui-text variant="md-regular" color="primary" align="center">${e.title}</wui-text>
              <wui-text variant="sm-regular" color="secondary" align="center"
                >${e.text}</wui-text
              >
            </wui-flex>
          `)}
      </wui-flex>
    `}};jo([d({type:Array})],ci.prototype,"data",void 0);ci=jo([f("w3m-help-widget")],ci);var br=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},gr=[{images:["login","profile","lock"],title:"One login for all of web3",text:"Log in to any app by connecting your wallet. Say goodbye to countless passwords!"},{images:["defi","nft","eth"],title:"A home for your digital assets",text:"A wallet lets you store, send and receive digital assets like cryptocurrencies and NFTs."},{images:["browser","noun","dao"],title:"Your gateway to a new web",text:"With your wallet, you can explore and interact with DeFi, NFTs, DAOs, and much more."}],Bo=class extends y{render(){return u`
      <wui-flex
        flexDirection="column"
        .padding=${["6","5","5","5"]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${gr}></w3m-help-widget>
        <wui-button variant="accent-primary" size="md" @click=${this.onGetWallet.bind(this)}>
          <wui-icon color="inherit" slot="iconLeft" name="wallet"></wui-icon>
          Get a wallet
        </wui-button>
      </wui-flex>
    `}onGetWallet(){A.sendEvent({type:"track",event:"CLICK_GET_WALLET_HELP"}),x.push("GetWallet")}};Bo=br([f("w3m-what-is-a-wallet-view")],Bo);l();p();c();l();p();c();var zo=E`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
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
`;var Fo=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Gt=class extends y{constructor(){super(),this.unsubscribe=[],this.checked=Ze.state.isLegalCheckboxChecked,this.unsubscribe.push(Ze.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:i}=v.state,r=v.state.features?.legalCheckbox,o=!!(e||i)&&!!r,s=o&&!this.checked,a=s?-1:void 0;return u`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${o?["0","3","3","3"]:"3"}
        gap="2"
        class=${C(s?"disabled":void 0)}
      >
        <w3m-wallet-login-list tabIdx=${C(a)}></w3m-wallet-login-list>
      </wui-flex>
    `}};Gt.styles=zo;Fo([m()],Gt.prototype,"checked",void 0);Gt=Fo([f("w3m-connect-wallets-view")],Gt);l();p();c();l();p();c();l();p();c();l();p();c();var Mo=E`
  :host {
    display: block;
    width: 120px;
    height: 120px;
  }

  svg {
    width: 120px;
    height: 120px;
    fill: none;
    stroke: transparent;
    stroke-linecap: round;
  }

  use {
    stroke: ${t=>t.colors.accent100};
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
`;var yr=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},pi=class extends y{render(){return u`
      <svg viewBox="0 0 54 59">
        <path
          id="wui-loader-path"
          d="M17.22 5.295c3.877-2.277 5.737-3.363 7.72-3.726a11.44 11.44 0 0 1 4.12 0c1.983.363 3.844 1.45 7.72 3.726l6.065 3.562c3.876 2.276 5.731 3.372 7.032 4.938a11.896 11.896 0 0 1 2.06 3.63c.683 1.928.688 4.11.688 8.663v7.124c0 4.553-.005 6.735-.688 8.664a11.896 11.896 0 0 1-2.06 3.63c-1.3 1.565-3.156 2.66-7.032 4.937l-6.065 3.563c-3.877 2.276-5.737 3.362-7.72 3.725a11.46 11.46 0 0 1-4.12 0c-1.983-.363-3.844-1.449-7.72-3.726l-6.065-3.562c-3.876-2.276-5.731-3.372-7.032-4.938a11.885 11.885 0 0 1-2.06-3.63c-.682-1.928-.688-4.11-.688-8.663v-7.124c0-4.553.006-6.735.688-8.664a11.885 11.885 0 0 1 2.06-3.63c1.3-1.565 3.156-2.66 7.032-4.937l6.065-3.562Z"
        />
        <use xlink:href="#wui-loader-path"></use>
      </svg>
    `}};pi.styles=[R,Mo];pi=yr([f("wui-loading-hexagon")],pi);l();p();c();var Vo=U`
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
`;var ui=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},At=class extends y{constructor(){super(),this.network=x.state.data?.network,this.unsubscribe=[],this.showRetry=!1,this.error=!1}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}firstUpdated(){this.onSwitchNetwork()}render(){if(!this.network)throw new Error("w3m-network-switch-view: No network provided");this.onShowRetry();let e=this.getLabel(),i=this.getSubLabel();return u`
      <wui-flex
        data-error=${this.error}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","10","5"]}
        gap="7"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-network-image
            size="lg"
            imageSrc=${C(_.getNetworkImage(this.network))}
          ></wui-network-image>

          ${this.error?null:u`<wui-loading-hexagon></wui-loading-hexagon>`}

          <wui-icon-box color="error" icon="close" size="sm"></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="2">
          <wui-text align="center" variant="h6-regular" color="primary">${e}</wui-text>
          <wui-text align="center" variant="md-regular" color="secondary">${i}</wui-text>
        </wui-flex>

        <wui-button
          data-retry=${this.showRetry}
          variant="accent-primary"
          size="md"
          .disabled=${!this.error}
          @click=${this.onSwitchNetwork.bind(this)}
        >
          <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
          Try again
        </wui-button>
      </wui-flex>
    `}getSubLabel(){let e=S.getConnectorId(h.state.activeChain);return S.getAuthConnector()&&e===I.CONNECTOR_ID.AUTH?"":this.error?"Switch can be declined if chain is not supported by a wallet or previous request is still active":"Accept connection request in your wallet"}getLabel(){let e=S.getConnectorId(h.state.activeChain);return S.getAuthConnector()&&e===I.CONNECTOR_ID.AUTH?`Switching to ${this.network?.name??"Unknown"} network...`:this.error?"Switch declined":"Approve in wallet"}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,this.shadowRoot?.querySelector("wui-button")?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"}))}async onSwitchNetwork(){try{this.error=!1,h.state.activeChain!==this.network?.chainNamespace&&h.setIsSwitchingNamespace(!0),this.network&&(await h.switchActiveNetwork(this.network),await bt.isAuthenticated()&&x.goBack())}catch{this.error=!0}}};At.styles=Vo;ui([m()],At.prototype,"showRetry",void 0);ui([m()],At.prototype,"error",void 0);At=ui([f("w3m-network-switch-view")],At);l();p();c();l();p();c();l();p();c();l();p();c();var Ho=E`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:t})=>t[3]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-text {
    text-transform: capitalize;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var Rt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},qe=class extends y{constructor(){super(...arguments),this.imageSrc=void 0,this.name="Ethereum",this.disabled=!1}render(){return u`
      <button ?disabled=${this.disabled} tabindex=${C(this.tabIdx)}>
        <wui-flex gap="2" alignItems="center">
          ${this.imageTemplate()}
          <wui-text variant="lg-regular" color="primary">${this.name}</wui-text>
        </wui-flex>
        <wui-icon name="chevronRight" size="lg" color="default"></wui-icon>
      </button>
    `}imageTemplate(){return this.imageSrc?u`<wui-image ?boxed=${!0} src=${this.imageSrc}></wui-image>`:u`<wui-image
      ?boxed=${!0}
      icon="networkPlaceholder"
      size="lg"
      iconColor="default"
    ></wui-image>`}};qe.styles=[R,W,Ho];Rt([d()],qe.prototype,"imageSrc",void 0);Rt([d()],qe.prototype,"name",void 0);Rt([d()],qe.prototype,"tabIdx",void 0);Rt([d({type:Boolean})],qe.prototype,"disabled",void 0);qe=Rt([f("wui-list-network")],qe);l();p();c();var Ko=U`
  .container {
    max-height: 360px;
    overflow: auto;
  }

  .container::-webkit-scrollbar {
    display: none;
  }
`;var It=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Ge=class extends y{constructor(){super(),this.unsubscribe=[],this.network=h.state.activeCaipNetwork,this.requestedCaipNetworks=h.getCaipNetworks(),this.search="",this.onDebouncedSearch=$.debounce(e=>{this.search=e},100),this.unsubscribe.push(ie.subscribeNetworkImages(()=>this.requestUpdate()),h.subscribeKey("activeCaipNetwork",e=>this.network=e),h.subscribe(()=>{this.requestedCaipNetworks=h.getAllRequestedCaipNetworks()}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u`
      ${this.templateSearchInput()}
      <wui-flex
        class="container"
        .padding=${["0","3","3","3"]}
        flexDirection="column"
        gap="2"
      >
        ${this.networksTemplate()}
      </wui-flex>
    `}templateSearchInput(){return u`
      <wui-flex gap="2" .padding=${["0","3","3","3"]}>
        <wui-input-text
          @inputChange=${this.onInputChange.bind(this)}
          class="network-search-input"
          size="md"
          placeholder="Search network"
          icon="search"
        ></wui-input-text>
      </wui-flex>
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}networksTemplate(){let e=h.getAllApprovedCaipNetworkIds(),i=$.sortRequestedNetworks(e,this.requestedCaipNetworks);return this.search?this.filteredNetworks=i?.filter(r=>r?.name?.toLowerCase().includes(this.search.toLowerCase())):this.filteredNetworks=i,this.filteredNetworks?.map(r=>u`
        <wui-list-network
          .selected=${this.network?.id===r.id}
          imageSrc=${C(_.getNetworkImage(r))}
          type="network"
          name=${r.name??r.id}
          @click=${()=>this.onSwitchNetwork(r)}
          .disabled=${h.isCaipNetworkDisabled(r)}
          data-testid=${`w3m-network-switch-${r.name??r.id}`}
        ></wui-list-network>
      `)}onSwitchNetwork(e){yi.onSwitchNetwork({network:e})}};Ge.styles=Ko;It([m()],Ge.prototype,"network",void 0);It([m()],Ge.prototype,"requestedCaipNetworks",void 0);It([m()],Ge.prototype,"filteredNetworks",void 0);It([m()],Ge.prototype,"search",void 0);Ge=It([f("w3m-networks-view")],Ge);l();p();c();l();p();c();var qo=E`
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
    border-radius: calc(
      ${({borderRadius:t})=>t[1]} * 9 - ${({borderRadius:t})=>t[3]}
    );
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
    border-radius: calc(
      ${({borderRadius:t})=>t[1]} * 9 - ${({borderRadius:t})=>t[3]}
    );
    box-shadow: inset 0 0 0 1px ${({tokens:t})=>t.core.glass010};
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

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: ${({spacing:t})=>t["01"]} ${({spacing:t})=>t[2]};
  }

  .capitalize {
    text-transform: capitalize;
  }
`;var Go=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},xr={eip155:"eth",solana:"solana",bip122:"bitcoin",polkadot:void 0},Xt=class extends y{constructor(){super(...arguments),this.unsubscribe=[],this.switchToChain=x.state.data?.switchToChain,this.caipNetwork=x.state.data?.network,this.activeChain=h.state.activeChain}firstUpdated(){this.unsubscribe.push(h.subscribeKey("activeChain",e=>this.activeChain=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.switchToChain?I.CHAIN_NAME_MAP[this.switchToChain]:"supported";if(!this.switchToChain)return null;let i=I.CHAIN_NAME_MAP[this.switchToChain];return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["4","2","2","2"]}
        gap="4"
      >
        <wui-flex justifyContent="center" flexDirection="column" alignItems="center" gap="2">
          <wui-visual
            size="md"
            name=${C(xr[this.switchToChain])}
          ></wui-visual>
          <wui-flex gap="2" flexDirection="column" alignItems="center">
            <wui-text
              data-testid=${`w3m-switch-active-chain-to-${i}`}
              variant="lg-regular"
              color="primary"
              align="center"
              >Switch to <span class="capitalize">${i}</span></wui-text
            >
            <wui-text variant="md-regular" color="secondary" align="center">
              Connected wallet doesn't support connecting to ${e} chain. You
              need to connect with a different wallet.
            </wui-text>
          </wui-flex>
          <wui-button
            data-testid="w3m-switch-active-chain-button"
            size="md"
            @click=${this.switchActiveChain.bind(this)}
            >Switch</wui-button
          >
        </wui-flex>
      </wui-flex>
    `}async switchActiveChain(){this.switchToChain&&(h.setIsSwitchingNamespace(!0),S.setFilterByNamespace(this.switchToChain),this.caipNetwork?await h.switchActiveNetwork(this.caipNetwork):h.setActiveNamespace(this.switchToChain),x.reset("Connect"))}};Xt.styles=qo;Go([d()],Xt.prototype,"activeChain",void 0);Xt=Go([f("w3m-switch-active-chain-view")],Xt);l();p();c();var Cr=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},vr=[{images:["network","layers","system"],title:"The system\u2019s nuts and bolts",text:"A network is what brings the blockchain to life, as this technical infrastructure allows apps to access the ledger and smart contract services."},{images:["noun","defiAlt","dao"],title:"Designed for different uses",text:"Each network is designed differently, and may therefore suit certain apps and experiences."}],Xo=class extends y{render(){return u`
      <wui-flex
        flexDirection="column"
        .padding=${["6","5","5","5"]}
        alignItems="center"
        gap="5"
      >
        <w3m-help-widget .data=${vr}></w3m-help-widget>
        <wui-button
          variant="accent-primary"
          size="md"
          @click=${()=>{$.openHref("https://ethereum.org/en/developers/docs/networks/","_blank")}}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Xo=Cr([f("w3m-what-is-a-network-view")],Xo);l();p();c();l();p();c();var Yo=U`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var di=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},_t=class extends y{constructor(){super(),this.swapUnsupportedChain=x.state.data?.swapUnsupportedChain,this.unsubscribe=[],this.disconnecting=!1,this.remoteFeatures=v.state.remoteFeatures,this.unsubscribe.push(ie.subscribeNetworkImages(()=>this.requestUpdate()),v.subscribeKey("remoteFeatures",e=>{this.remoteFeatures=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u`
      <wui-flex class="container" flexDirection="column" gap="0">
        <wui-flex
          class="container"
          flexDirection="column"
          .padding=${["3","5","2","5"]}
          alignItems="center"
          gap="5"
        >
          ${this.descriptionTemplate()}
        </wui-flex>

        <wui-flex flexDirection="column" padding="3" gap="2"> ${this.networksTemplate()} </wui-flex>

        <wui-separator text="or"></wui-separator>
        <wui-flex flexDirection="column" padding="3" gap="2">
          <wui-list-item
            variant="icon"
            iconVariant="overlay"
            icon="signOut"
            ?chevron=${!1}
            .loading=${this.disconnecting}
            @click=${this.onDisconnect.bind(this)}
            data-testid="disconnect-button"
          >
            <wui-text variant="md-medium" color="secondary">Disconnect</wui-text>
          </wui-list-item>
        </wui-flex>
      </wui-flex>
    `}descriptionTemplate(){return this.swapUnsupportedChain?u`
        <wui-text variant="sm-regular" color="secondary" align="center">
          The swap feature doesn’t support your current network. Switch to an available option to
          continue.
        </wui-text>
      `:u`
      <wui-text variant="sm-regular" color="secondary" align="center">
        This app doesn’t support your current network. Switch to an available option to continue.
      </wui-text>
    `}networksTemplate(){let e=h.getAllRequestedCaipNetworks(),i=h.getAllApprovedCaipNetworkIds(),r=$.sortRequestedNetworks(i,e);return(this.swapUnsupportedChain?r.filter(o=>D.SWAP_SUPPORTED_NETWORKS.includes(o.caipNetworkId)):r).map(o=>u`
        <wui-list-network
          imageSrc=${C(_.getNetworkImage(o))}
          name=${o.name??"Unknown"}
          @click=${()=>this.onSwitchNetwork(o)}
        >
        </wui-list-network>
      `)}async onDisconnect(){try{this.disconnecting=!0;let e=h.state.activeChain,r=k.getConnections(e).length>0,n=e&&S.state.activeConnectorIds[e],o=this.remoteFeatures?.multiWallet;await k.disconnect(o?{id:n,namespace:e}:{}),r&&o&&(x.push("ProfileWallets"),T.showSuccess("Wallet deleted"))}catch{A.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:"Failed to disconnect"}}),T.showError("Failed to disconnect")}finally{this.disconnecting=!1}}async onSwitchNetwork(e){let i=h.getActiveCaipAddress(),r=h.getAllApprovedCaipNetworkIds(),n=h.getNetworkProp("supportsAllNetworks",e.chainNamespace),o=x.state.data;i?r?.includes(e.caipNetworkId)?await h.switchActiveNetwork(e):n?x.push("SwitchNetwork",{...o,network:e}):x.push("SwitchNetwork",{...o,network:e}):i||(h.setActiveCaipNetwork(e),x.push("Connect"))}};_t.styles=Yo;di([m()],_t.prototype,"disconnecting",void 0);di([m()],_t.prototype,"remoteFeatures",void 0);_t=di([f("w3m-unsupported-chain-view")],_t);l();p();c();l();p();c();l();p();c();l();p();c();var Qo=E`
  wui-flex {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[4]};
    padding: ${({spacing:t})=>t[3]};
  }

  /* -- Types --------------------------------------------------------- */
  wui-flex[data-type='info'] {
    color: ${({tokens:t})=>t.theme.textSecondary};
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  wui-flex[data-type='success'] {
    color: ${({tokens:t})=>t.core.textSuccess};
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] {
    color: ${({tokens:t})=>t.core.textError};
    background-color: ${({tokens:t})=>t.core.backgroundError};
  }

  wui-flex[data-type='warning'] {
    color: ${({tokens:t})=>t.core.textWarning};
    background-color: ${({tokens:t})=>t.core.backgroundWarning};
  }

  wui-flex[data-type='info'] wui-icon-box {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  wui-flex[data-type='success'] wui-icon-box {
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
  }

  wui-flex[data-type='error'] wui-icon-box {
    background-color: ${({tokens:t})=>t.core.backgroundError};
  }

  wui-flex[data-type='warning'] wui-icon-box {
    background-color: ${({tokens:t})=>t.core.backgroundWarning};
  }

  wui-text {
    flex: 1;
  }
`;var Yt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},ft=class extends y{constructor(){super(...arguments),this.icon="externalLink",this.text="",this.type="info"}render(){return u`
      <wui-flex alignItems="center" data-type=${this.type}>
        <wui-icon-box size="sm" color="inherit" icon=${this.icon}></wui-icon-box>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
      </wui-flex>
    `}};ft.styles=[R,W,Qo];Yt([d()],ft.prototype,"icon",void 0);Yt([d()],ft.prototype,"text",void 0);Yt([d()],ft.prototype,"type",void 0);ft=Yt([f("wui-banner")],ft);l();p();c();var Jo=U`
  :host > wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }
`;var $r=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},mi=class extends y{constructor(){super(),this.unsubscribe=[]}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return u` <wui-flex flexDirection="column" .padding=${["2","3","3","3"]} gap="2">
      <wui-banner
        icon="warningCircle"
        text="You can only receive assets on these networks"
      ></wui-banner>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=h.getAllRequestedCaipNetworks(),i=h.getAllApprovedCaipNetworkIds(),r=h.state.activeCaipNetwork,n=h.checkIfSmartAccountEnabled(),o=$.sortRequestedNetworks(i,e);if(n&&fe(r?.chainNamespace)===he.ACCOUNT_TYPES.SMART_ACCOUNT){if(!r)return null;o=[r]}return o.filter(a=>a.chainNamespace===r?.chainNamespace).map(a=>u`
        <wui-list-network
          imageSrc=${C(_.getNetworkImage(a))}
          name=${a.name??"Unknown"}
          ?transparent=${!0}
        >
        </wui-list-network>
      `)}};mi.styles=Jo;mi=$r([f("w3m-wallet-compatible-networks-view")],mi);l();p();c();l();p();c();l();p();c();l();p();c();l();p();c();var Zo=E`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    box-shadow: 0 0 0 8px ${({tokens:t})=>t.theme.borderPrimary};
    border-radius: ${({borderRadius:t})=>t[4]};
    overflow: hidden;
  }

  :host([data-border-radius-full='true']) {
    border-radius: 50px;
  }

  wui-icon {
    width: 32px;
    height: 32px;
  }
`;var Qt=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},wt=class extends y{render(){return this.dataset.borderRadiusFull=this.borderRadiusFull?"true":"false",u`${this.templateVisual()}`}templateVisual(){return this.imageSrc?u`<wui-image src=${this.imageSrc} alt=${this.alt??""}></wui-image>`:u`<wui-icon
      data-parent-size="md"
      size="inherit"
      color="inherit"
      name="wallet"
    ></wui-icon>`}};wt.styles=[R,Zo];Qt([d()],wt.prototype,"imageSrc",void 0);Qt([d()],wt.prototype,"alt",void 0);Qt([d({type:Boolean})],wt.prototype,"borderRadiusFull",void 0);wt=Qt([f("wui-visual-thumbnail")],wt);l();p();c();var er=E`
  :host {
    display: flex;
    justify-content: center;
    gap: ${({spacing:t})=>t[4]};
  }

  wui-visual-thumbnail:nth-child(1) {
    z-index: 1;
  }
`;var Er=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},hi=class extends y{constructor(){super(...arguments),this.dappImageUrl=v.state.metadata?.icons,this.walletImageUrl=h.getAccountData()?.connectedWalletInfo?.icon}firstUpdated(){let e=this.shadowRoot?.querySelectorAll("wui-visual-thumbnail");e?.[0]&&this.createAnimation(e[0],"translate(18px)"),e?.[1]&&this.createAnimation(e[1],"translate(-18px)")}render(){return u`
      <wui-visual-thumbnail
        ?borderRadiusFull=${!0}
        .imageSrc=${this.dappImageUrl?.[0]}
      ></wui-visual-thumbnail>
      <wui-visual-thumbnail .imageSrc=${this.walletImageUrl}></wui-visual-thumbnail>
    `}createAnimation(e,i){e.animate([{transform:"translateX(0px)"},{transform:i}],{duration:1600,easing:"cubic-bezier(0.56, 0, 0.48, 1)",direction:"alternate",iterations:1/0})}};hi.styles=er;hi=Er([f("w3m-siwx-sign-message-thumbnails")],hi);var fi=function(t,e,i,r){var n=arguments.length,o=n<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(n<3?s(o):n>3?s(e,i,o):s(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o},Jt=class extends y{constructor(){super(...arguments),this.dappName=v.state.metadata?.name,this.isCancelling=!1,this.isSigning=!1}render(){return u`
      <wui-flex justifyContent="center" .padding=${["8","0","6","0"]}>
        <w3m-siwx-sign-message-thumbnails></w3m-siwx-sign-message-thumbnails>
      </wui-flex>
      <wui-flex .padding=${["0","20","5","20"]} gap="3" justifyContent="space-between">
        <wui-text variant="lg-medium" align="center" color="primary"
          >${this.dappName??"Dapp"} needs to connect to your wallet</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["0","10","4","10"]} gap="3" justifyContent="space-between">
        <wui-text variant="md-regular" align="center" color="secondary"
          >Sign this message to prove you own this wallet and proceed. Canceling will disconnect
          you.</wui-text
        >
      </wui-flex>
      <wui-flex .padding=${["4","5","5","5"]} gap="3" justifyContent="space-between">
        <wui-button
          size="lg"
          borderRadius="xs"
          fullWidth
          variant="neutral-secondary"
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
          variant="neutral-primary"
          @click=${this.onSign.bind(this)}
          ?loading=${this.isSigning}
          data-testid="w3m-connecting-siwe-sign"
        >
          ${this.isSigning?"Signing...":"Sign"}
        </wui-button>
      </wui-flex>
    `}async onSign(){this.isSigning=!0;try{await bt.requestSignMessage()}catch(e){if(e instanceof Error&&e.message.includes("OTP is required")){T.showError({message:"Something went wrong. We need to verify your account again."}),x.replace("DataCapture");return}throw e}finally{this.isSigning=!1}}async onCancel(){this.isCancelling=!0,await bt.cancelSignMessage().finally(()=>this.isCancelling=!1)}};fi([m()],Jt.prototype,"isCancelling",void 0);fi([m()],Jt.prototype,"isSigning",void 0);Jt=fi([f("w3m-siwx-sign-message-view")],Jt);export{ki as a,Ai as b,Ii as c,_i as d,Wi as e,Ni as f,Li as g,Di as h,Ie as i,oi as j,X as k,Be as l,jt as m,ee as n,So as o,Mt as p,ke as q,Kt as r,qt as s,Do as t,Uo as u,Bo as v,Gt as w,At as x,Ge as y,Xt as z,Xo as A,_t as B,mi as C,Jt as D};
