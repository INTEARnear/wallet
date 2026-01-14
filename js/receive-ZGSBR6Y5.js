import"./chunk-EEYGRRF2.js";import"./chunk-GLIZJUBT.js";import"./chunk-RLPEU2I3.js";import{a as D}from"./chunk-B2LU4KHT.js";import{r as v,v as O,w as _,x as q,z as C}from"./chunk-RZQOM5QR.js";import"./chunk-HQPTEMSB.js";import{a as R,b as $}from"./chunk-IDZGCU4F.js";import{e as u,k as y}from"./chunk-ZS2R6O6N.js";import"./chunk-SQN7L5MN.js";import"./chunk-7GZ7JYLK.js";import"./chunk-6HADIPAO.js";import"./chunk-2T4BE52W.js";import"./chunk-XQOHLC2A.js";import{B as S,C as I,I as g,N as k,S as E,T as x,X as T,ga as p}from"./chunk-OXOEMY67.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as s,k as n,o as a}from"./chunk-JY5TIRRF.js";s();a();n();s();a();n();s();a();n();s();a();n();s();a();n();var P=v`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[4]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[3]};
    border: none;
    padding: ${({spacing:e})=>e[3]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button:hover:enabled,
  button:active:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
  }

  wui-text {
    flex: 1;
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-flex {
    width: auto;
    display: flex;
    align-items: center;
    gap: ${({spacing:e})=>e["01"]};
  }

  wui-icon {
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  .network-icon {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[4]};
    overflow: hidden;
    margin-left: -8px;
  }

  .network-icon:first-child {
    margin-left: 0px;
  }

  .network-icon:after {
    position: absolute;
    inset: 0;
    content: '';
    display: block;
    height: 100%;
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
  }
`;var A=function(e,t,r,i){var c=arguments.length,o=c<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,r):i,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,r,i);else for(var m=e.length-1;m>=0;m--)(l=e[m])&&(o=(c<3?l(o):c>3?l(t,r,o):l(t,r))||o);return c>3&&o&&Object.defineProperty(t,r,o),o},b=class extends y{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return u`
      <button>
        <wui-text variant="md-regular" color="inherit">${this.text}</wui-text>
        <wui-flex>
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="inherit"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let t=this.networkImages.slice(0,5);return u` <wui-flex class="networks">
      ${t?.map(r=>u` <wui-flex class="network-icon"> <wui-image src=${r}></wui-image> </wui-flex>`)}
    </wui-flex>`}};b.styles=[O,_,P];A([R({type:Array})],b.prototype,"networkImages",void 0);A([R()],b.prototype,"text",void 0);b=A([C("wui-compatible-network")],b);s();a();n();var W=v`
  wui-compatible-network {
    margin-top: ${({spacing:e})=>e[4]};
    width: 100%;
  }

  wui-qr-code {
    width: unset !important;
    height: unset !important;
  }

  wui-icon {
    align-items: normal;
  }
`;var N=function(e,t,r,i){var c=arguments.length,o=c<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,r):i,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,r,i);else for(var m=e.length-1;m>=0;m--)(l=e[m])&&(o=(c<3?l(o):c>3?l(t,r,o):l(t,r))||o);return c>3&&o&&Object.defineProperty(t,r,o),o},d=class extends y{constructor(){super(),this.unsubscribe=[],this.address=p.getAccountData()?.address,this.profileName=p.getAccountData()?.profileName,this.network=p.state.activeCaipNetwork,this.unsubscribe.push(p.subscribeChainProp("accountState",t=>{t?(this.address=t.address,this.profileName=t.profileName):g.showError("Account not found")}),p.subscribeKey("activeCaipNetwork",t=>{t?.id&&(this.network=t)}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(!this.address)throw new Error("w3m-wallet-receive-view: No account provided");let t=k.getNetworkImage(this.network);return u` <wui-flex
      flexDirection="column"
      .padding=${["0","4","4","4"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${q.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${t||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["4","0","0","0"]}
        alignItems="center"
        gap="4"
      >
        <wui-qr-code
          size=${232}
          theme=${x.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${D(x.state.themeVariables["--apkt-qr-color"]??x.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="lg-regular" color="primary" align="center">
          Copy your address or scan this QR code
        </wui-text>
        <wui-button @click=${this.onCopyClick.bind(this)} size="sm" variant="neutral-secondary">
          <wui-icon slot="iconLeft" size="sm" color="inherit" name="copy"></wui-icon>
          <wui-text variant="md-regular" color="inherit">Copy address</wui-text>
        </wui-button>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let t=p.getAllRequestedCaipNetworks(),r=p.checkIfSmartAccountEnabled(),i=p.state.activeCaipNetwork,c=t.filter(m=>m?.chainNamespace===i?.chainNamespace);if(T(i?.chainNamespace)===I.ACCOUNT_TYPES.SMART_ACCOUNT&&r)return i?u`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[k.getNetworkImage(i)??""]}
      ></wui-compatible-network>`:null;let l=(c?.filter(m=>m?.assets?.imageId)?.slice(0,5)).map(k.getNetworkImage).filter(Boolean);return u`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${l}
    ></wui-compatible-network>`}onReceiveClick(){E.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(S.copyToClopboard(this.address),g.showSuccess("Address copied"))}catch{g.showError("Failed to copy")}}};d.styles=W;N([$()],d.prototype,"address",void 0);N([$()],d.prototype,"profileName",void 0);N([$()],d.prototype,"network",void 0);d=N([C("w3m-wallet-receive-view")],d);export{d as W3mWalletReceiveView};
