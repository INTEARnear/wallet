import"./chunk-S5GLPWFJ.js";import"./chunk-MMHKZM43.js";import"./chunk-5BCUXIZJ.js";import"./chunk-BR7S6AGZ.js";import{c as W,d as j,f as q,h as C}from"./chunk-LTN6YROF.js";import{D as O,E as I,G as _,I as y,M as u,N,r as T,x as S,z as v}from"./chunk-N2WXLAZF.js";import"./chunk-X4QP7L3N.js";import"./chunk-N3PRX6SH.js";import"./chunk-GLIZJUBT.js";import{a as E}from"./chunk-B2LU4KHT.js";import{a as R,b as x}from"./chunk-IDZGCU4F.js";import{b as k,e as m,k as b}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as o,k as s,o as a}from"./chunk-JY5TIRRF.js";o();a();s();o();a();s();o();a();s();o();a();s();o();a();s();o();a();s();var P=k`
  button {
    display: flex;
    gap: var(--wui-spacing-xl);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    padding: var(--wui-spacing-m) var(--wui-spacing-s);
  }

  wui-text {
    width: 100%;
  }

  wui-flex {
    width: auto;
  }

  .network-icon {
    width: var(--wui-spacing-2l);
    height: var(--wui-spacing-2l);
    border-radius: calc(var(--wui-spacing-2l) / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-002),
      0 0 0 3px var(--wui-color-modal-bg);
  }
`;var A=function(p,e,r,i){var n=arguments.length,t=n<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(p,e,r,i);else for(var l=p.length-1;l>=0;l--)(c=p[l])&&(t=(n<3?c(t):n>3?c(e,r,t):c(e,r))||t);return n>3&&t&&Object.defineProperty(e,r,t),t},g=class extends b{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return m`
      <button>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
        <wui-flex gap="3xs" alignItems="center">
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="fg-200"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let e=this.networkImages.slice(0,5);return m` <wui-flex class="networks">
      ${e?.map(r=>m` <wui-flex class="network-icon"> <wui-image src=${r}></wui-image> </wui-flex>`)}
    </wui-flex>`}};g.styles=[W,j,P];A([R({type:Array})],g.prototype,"networkImages",void 0);A([R()],g.prototype,"text",void 0);g=A([C("wui-compatible-network")],g);o();a();s();var U=k`
  wui-compatible-network {
    margin-top: var(--wui-spacing-l);
  }
`;var $=function(p,e,r,i){var n=arguments.length,t=n<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(p,e,r,i);else for(var l=p.length-1;l>=0;l--)(c=p[l])&&(t=(n<3?c(t):n>3?c(e,r,t):c(e,r))||t);return n>3&&t&&Object.defineProperty(e,r,t),t},h=class extends b{constructor(){super(),this.unsubscribe=[],this.address=N.state.address,this.profileName=N.state.profileName,this.network=u.state.activeCaipNetwork,this.unsubscribe.push(N.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName):y.showError("Account not found")}),u.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw new Error("w3m-wallet-receive-view: No account provided");let e=v.getNetworkImage(this.network);return m` <wui-flex
      flexDirection="column"
      .padding=${["0","l","l","l"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${q.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${e||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["l","0","0","0"]}
        alignItems="center"
        gap="s"
      >
        <wui-qr-code
          size=${232}
          theme=${I.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${E(I.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="paragraph-500" color="fg-100" align="center">
          Copy your address or scan this QR code
        </wui-text>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=u.getAllRequestedCaipNetworks(),r=u.checkIfSmartAccountEnabled(),i=u.state.activeCaipNetwork,n=e.filter(l=>l?.chainNamespace===i?.chainNamespace);if(_(i?.chainNamespace)===S.ACCOUNT_TYPES.SMART_ACCOUNT&&r)return i?m`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[v.getNetworkImage(i)??""]}
      ></wui-compatible-network>`:null;let c=(n?.filter(l=>l?.assets?.imageId)?.slice(0,5)).map(v.getNetworkImage).filter(Boolean);return m`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${c}
    ></wui-compatible-network>`}onReceiveClick(){O.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(T.copyToClopboard(this.address),y.showSuccess("Address copied"))}catch{y.showError("Failed to copy")}}};h.styles=U;$([x()],h.prototype,"address",void 0);$([x()],h.prototype,"profileName",void 0);$([x()],h.prototype,"network",void 0);h=$([C("w3m-wallet-receive-view")],h);export{h as W3mWalletReceiveView};
