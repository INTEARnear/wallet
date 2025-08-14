import"./chunk-KPDLLGDD.js";import"./chunk-SEF2SO4Q.js";import"./chunk-ZXNIRCPT.js";import"./chunk-KVGBKSBS.js";import"./chunk-2RFD6UAP.js";import{a as R,b as k,g as j}from"./chunk-HILJYRBB.js";import{A as y,G as w,I as g,U as O,V as _,X as W,Z as $,l as I,o as v,s as E,t as A,z as S}from"./chunk-UDTBWQKV.js";import"./chunk-ETAVA44A.js";import"./chunk-KIG3ADHQ.js";import"./chunk-JK5MJGFP.js";import"./chunk-COAJKL54.js";import"./chunk-65GJ65H6.js";import"./chunk-H6T4G3YK.js";import"./chunk-JBYAY2RL.js";import"./chunk-PIVQIF3J.js";import"./chunk-FILZKAK2.js";import"./chunk-OZZRRPYE.js";import"./chunk-FXML5DPA.js";import"./chunk-6OI5GZ4U.js";import"./chunk-YRGGSJIG.js";import{b as N,e as m,j as C}from"./chunk-5RP2GFJC.js";import{h as i,j as s,n as a}from"./chunk-KGCAX4NX.js";i();a();s();i();a();s();i();a();s();i();a();s();i();a();s();i();a();s();var q=N`
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
`;var T=function(p,e,r,o){var c=arguments.length,t=c<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(p,e,r,o);else for(var l=p.length-1;l>=0;l--)(n=p[l])&&(t=(c<3?n(t):c>3?n(e,r,t):n(e,r))||t);return c>3&&t&&Object.defineProperty(e,r,t),t},b=class extends C{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return m`
      <button>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
        <wui-flex gap="3xs" alignItems="center">
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="fg-200"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let e=this.networkImages.slice(0,5);return m` <wui-flex class="networks">
      ${e?.map(r=>m` <wui-flex class="network-icon"> <wui-image src=${r}></wui-image> </wui-flex>`)}
    </wui-flex>`}};b.styles=[O,_,q];T([R({type:Array})],b.prototype,"networkImages",void 0);T([R()],b.prototype,"text",void 0);b=T([$("wui-compatible-network")],b);i();a();s();var U=N`
  wui-compatible-network {
    margin-top: var(--wui-spacing-l);
  }
`;var x=function(p,e,r,o){var c=arguments.length,t=c<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(p,e,r,o);else for(var l=p.length-1;l>=0;l--)(n=p[l])&&(t=(c<3?n(t):c>3?n(e,r,t):n(e,r))||t);return c>3&&t&&Object.defineProperty(e,r,t),t},u=class extends C{constructor(){super(),this.unsubscribe=[],this.address=g.state.address,this.profileName=g.state.profileName,this.network=w.state.activeCaipNetwork,this.preferredAccountTypes=g.state.preferredAccountTypes,this.unsubscribe.push(g.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName,this.preferredAccountTypes=e.preferredAccountTypes):y.showError("Account not found")}),w.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw new Error("w3m-wallet-receive-view: No account provided");let e=v.getNetworkImage(this.network);return m` <wui-flex
      flexDirection="column"
      .padding=${["0","l","l","l"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${W.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
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
          theme=${A.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${j(A.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="paragraph-500" color="fg-100" align="center">
          Copy your address or scan this QR code
        </wui-text>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=w.getAllRequestedCaipNetworks(),r=w.checkIfSmartAccountEnabled(),o=w.state.activeCaipNetwork,c=e.filter(l=>l?.chainNamespace===o?.chainNamespace);if(this.preferredAccountTypes?.[o?.chainNamespace]===S.ACCOUNT_TYPES.SMART_ACCOUNT&&r)return o?m`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[v.getNetworkImage(o)??""]}
      ></wui-compatible-network>`:null;let n=(c?.filter(l=>l?.assets?.imageId)?.slice(0,5)).map(v.getNetworkImage).filter(Boolean);return m`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${n}
    ></wui-compatible-network>`}onReceiveClick(){E.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(I.copyToClopboard(this.address),y.showSuccess("Address copied"))}catch{y.showError("Failed to copy")}}};u.styles=U;x([k()],u.prototype,"address",void 0);x([k()],u.prototype,"profileName",void 0);x([k()],u.prototype,"network",void 0);x([k()],u.prototype,"preferredAccountTypes",void 0);u=x([$("w3m-wallet-receive-view")],u);export{u as W3mWalletReceiveView};
