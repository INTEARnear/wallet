import"./chunk-KCT5DXG4.js";import"./chunk-ARRV6HDU.js";import"./chunk-Z7AFWF2C.js";import{a as v,b as u,f as I}from"./chunk-KGK2MHEY.js";import{A as C,B as x,H as $,I as h,O as p,Q as m,aa as A,ba as R,da as T,fa as b,t as N,w as f}from"./chunk-SGMZUJCA.js";import"./chunk-QQ2U7YUK.js";import"./chunk-OIFNSKKM.js";import"./chunk-KBZLPVCS.js";import"./chunk-4XVQLAVT.js";import"./chunk-V7H3HPRQ.js";import"./chunk-EAWY7VYO.js";import"./chunk-2LXNZIUV.js";import"./chunk-NIKCAVDA.js";import"./chunk-URLXKBQX.js";import"./chunk-FFQJ55XB.js";import"./chunk-6IYG3UUA.js";import{b as g,e as n,j as k}from"./chunk-WGWCH7J2.js";import"./chunk-57YRCRKT.js";var E=g`
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
`;var y=function(c,e,r,o){var i=arguments.length,t=i<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(c,e,r,o);else for(var a=c.length-1;a>=0;a--)(s=c[a])&&(t=(i<3?s(t):i>3?s(e,r,t):s(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t},w=class extends k{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return n`
      <button>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
        <wui-flex gap="3xs" alignItems="center">
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="fg-200"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let e=this.networkImages.slice(0,5);return n` <wui-flex class="networks">
      ${e?.map(r=>n` <wui-flex class="network-icon"> <wui-image src=${r}></wui-image> </wui-flex>`)}
    </wui-flex>`}};w.styles=[A,R,E];y([v({type:Array})],w.prototype,"networkImages",void 0);y([v()],w.prototype,"text",void 0);w=y([b("wui-compatible-network")],w);var S=g`
  wui-compatible-network {
    margin-top: var(--wui-spacing-l);
  }
`;var d=function(c,e,r,o){var i=arguments.length,t=i<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(c,e,r,o);else for(var a=c.length-1;a>=0;a--)(s=c[a])&&(t=(i<3?s(t):i>3?s(e,r,t):s(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t},l=class extends k{constructor(){super(),this.unsubscribe=[],this.address=m.state.address,this.profileName=m.state.profileName,this.network=p.state.activeCaipNetwork,this.preferredAccountTypes=m.state.preferredAccountTypes,this.unsubscribe.push(m.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName,this.preferredAccountTypes=e.preferredAccountTypes):h.showError("Account not found")}),p.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw new Error("w3m-wallet-receive-view: No account provided");let e=f.getNetworkImage(this.network);return n` <wui-flex
      flexDirection="column"
      .padding=${["0","l","l","l"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${T.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
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
          theme=${x.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${I(x.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="paragraph-500" color="fg-100" align="center">
          Copy your address or scan this QR code
        </wui-text>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=p.getAllRequestedCaipNetworks(),r=p.checkIfSmartAccountEnabled(),o=p.state.activeCaipNetwork,i=e.filter(a=>a?.chainNamespace===o?.chainNamespace);if(this.preferredAccountTypes?.[o?.chainNamespace]===$.ACCOUNT_TYPES.SMART_ACCOUNT&&r)return o?n`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[f.getNetworkImage(o)??""]}
      ></wui-compatible-network>`:null;let s=(i?.filter(a=>a?.assets?.imageId)?.slice(0,5)).map(f.getNetworkImage).filter(Boolean);return n`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${s}
    ></wui-compatible-network>`}onReceiveClick(){C.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(N.copyToClopboard(this.address),h.showSuccess("Address copied"))}catch{h.showError("Failed to copy")}}};l.styles=S;d([u()],l.prototype,"address",void 0);d([u()],l.prototype,"profileName",void 0);d([u()],l.prototype,"network",void 0);d([u()],l.prototype,"preferredAccountTypes",void 0);l=d([b("w3m-wallet-receive-view")],l);export{l as W3mWalletReceiveView};
