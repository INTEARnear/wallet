import"./chunk-E6B4QYQ5.js";import{c as it,g as rt,h as ke,i as pe}from"./chunk-6NRFW7F3.js";import"./chunk-X4QP7L3N.js";import{o as E,s as L,t as U,u as Q,v as b}from"./chunk-VOEBYPFM.js";import{A as T,B as R,C as y,D as Se,E as D,J as $,Q as oe,R as Ue,a as Ce,e as je,o as Ae,p as ot,q as x,t as P,u as ce,w as De,y as Xe,z as q}from"./chunk-ZTBYICLP.js";import{a as ve,b as $e}from"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import{a as qt}from"./chunk-GLIZJUBT.js";import{a as _}from"./chunk-B2LU4KHT.js";import"./chunk-HQPTEMSB.js";import{a as u,b as w}from"./chunk-IDZGCU4F.js";import{b as Pe,e as d,f as ae,k as g}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{g as Mt,i as a,k as c,o as p}from"./chunk-JY5TIRRF.js";a();p();c();a();p();c();a();p();c();var Ee=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},he=class extends g{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=D.state.connectors,this.count=R.state.count,this.filteredCount=R.state.filteredWallets.length,this.isFetchingRecommendedWallets=R.state.isFetchingRecommendedWallets,this.unsubscribe.push(D.subscribeKey("connectors",t=>this.connectors=t),R.subscribeKey("count",t=>this.count=t),R.subscribeKey("filteredWallets",t=>this.filteredCount=t.length),R.subscribeKey("isFetchingRecommendedWallets",t=>this.isFetchingRecommendedWallets=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.find(S=>S.id==="walletConnect"),{allWallets:i}=P.state;if(!t||i==="HIDE"||i==="ONLY_MOBILE"&&!x.isMobile())return null;let r=R.state.featured.length,n=this.count+r,o=n<10?n:Math.floor(n/10)*10,s=this.filteredCount>0?this.filteredCount:o,l=`${s}`;this.filteredCount>0?l=`${this.filteredCount}`:s<n&&(l=`${s}+`);let C=$.hasAnyConnection(Ce.CONNECTOR_ID.WALLET_CONNECT);return d`
      <wui-list-wallet
        name="Search Wallet"
        walletIcon="search"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${l}
        tagVariant="info"
        data-testid="all-wallets"
        tabIdx=${_(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        ?disabled=${C}
        size="sm"
      ></wui-list-wallet>
    `}onAllWallets(){T.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),y.push("AllWallets",{redirectView:y.state.data?.redirectView})}};Ee([u()],he.prototype,"tabIdx",void 0);Ee([w()],he.prototype,"connectors",void 0);Ee([w()],he.prototype,"count",void 0);Ee([w()],he.prototype,"filteredCount",void 0);Ee([w()],he.prototype,"isFetchingRecommendedWallets",void 0);he=Ee([b("w3m-all-wallets-widget")],he);a();p();c();a();p();c();var nt=E`
  :host {
    margin-top: ${({spacing:e})=>e[1]};
  }
  wui-separator {
    margin: ${({spacing:e})=>e[3]} calc(${({spacing:e})=>e[3]} * -1)
      ${({spacing:e})=>e[2]} calc(${({spacing:e})=>e[3]} * -1);
    width: calc(100% + ${({spacing:e})=>e[3]} * 2);
  }
`;var ie=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},G=class extends g{constructor(){super(),this.unsubscribe=[],this.connectors=D.state.connectors,this.recommended=R.state.recommended,this.featured=R.state.featured,this.explorerWallets=R.state.explorerWallets,this.connections=$.state.connections,this.connectorImages=Xe.state.connectorImages,this.loadingTelegram=!1,this.unsubscribe.push(D.subscribeKey("connectors",t=>this.connectors=t),$.subscribeKey("connections",t=>this.connections=t),Xe.subscribeKey("connectorImages",t=>this.connectorImages=t),R.subscribeKey("recommended",t=>this.recommended=t),R.subscribeKey("featured",t=>this.featured=t),R.subscribeKey("explorerFilteredWallets",t=>{this.explorerWallets=t?.length?t:R.state.explorerWallets}),R.subscribeKey("explorerWallets",t=>{this.explorerWallets?.length||(this.explorerWallets=t)})),x.isTelegram()&&x.isIos()&&(this.loadingTelegram=!$.state.wcUri,this.unsubscribe.push($.subscribeKey("wcUri",t=>this.loadingTelegram=!t)))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return d`
      <wui-flex flexDirection="column" gap="2"> ${this.connectorListTemplate()} </wui-flex>
    `}mapConnectorsToExplorerWallets(t,i){return t.map(r=>{if(r.type==="MULTI_CHAIN"&&r.connectors){let o=r.connectors.map(S=>S.id),s=r.connectors.map(S=>S.name),l=r.connectors.map(S=>S.info?.rdns),C=i?.find(S=>o.includes(S.id)||s.includes(S.name)||S.rdns&&(l.includes(S.rdns)||o.includes(S.rdns)));return r.explorerWallet=C??r.explorerWallet,r}let n=i?.find(o=>o.id===r.id||o.rdns===r.info?.rdns||o.name===r.name);return r.explorerWallet=n??r.explorerWallet,r})}processConnectorsByType(t,i=!0){let r=pe.sortConnectorsByExplorerWallet([...t]);return i?r.filter(pe.showConnector):r}connectorListTemplate(){let t=this.mapConnectorsToExplorerWallets(this.connectors,this.explorerWallets??[]),i=pe.getConnectorsByType(t,this.recommended,this.featured),r=this.processConnectorsByType(i.announced.filter(W=>W.id!=="walletConnect")),n=this.processConnectorsByType(i.injected),o=this.processConnectorsByType(i.multiChain.filter(W=>W.name!=="WalletConnect"),!1),s=i.custom,l=i.recent,C=this.processConnectorsByType(i.external.filter(W=>W.id!==Ce.CONNECTOR_ID.COINBASE_SDK)),S=i.recommended,z=i.featured,se=pe.getConnectorTypeOrder({custom:s,recent:l,announced:r,injected:n,multiChain:o,recommended:S,featured:z,external:C}),le=this.connectors.find(W=>W.id==="walletConnect"),xe=x.isMobile(),A=[];for(let W of se)switch(W){case"walletConnect":{!xe&&le&&A.push({kind:"connector",subtype:"walletConnect",connector:le});break}case"recent":{pe.getFilteredRecentWallets().forEach(I=>A.push({kind:"wallet",subtype:"recent",wallet:I}));break}case"injected":{o.forEach(v=>A.push({kind:"connector",subtype:"multiChain",connector:v})),r.forEach(v=>A.push({kind:"connector",subtype:"announced",connector:v})),n.forEach(v=>A.push({kind:"connector",subtype:"injected",connector:v}));break}case"featured":{z.forEach(v=>A.push({kind:"wallet",subtype:"featured",wallet:v}));break}case"custom":{pe.getFilteredCustomWallets(s??[]).forEach(I=>A.push({kind:"wallet",subtype:"custom",wallet:I}));break}case"external":{C.forEach(v=>A.push({kind:"connector",subtype:"external",connector:v}));break}case"recommended":{pe.getCappedRecommendedWallets(S).forEach(I=>A.push({kind:"wallet",subtype:"recommended",wallet:I}));break}default:console.warn(`Unknown connector type: ${W}`)}return A.map((W,v)=>W.kind==="connector"?this.renderConnector(W,v):this.renderWallet(W,v))}renderConnector(t,i){let r=t.connector,n=q.getConnectorImage(r)||this.connectorImages[r?.imageId??""],s=(this.connections.get(r.chain)??[]).some(se=>it.isLowerCaseMatch(se.connectorId,r.id)),l,C;t.subtype==="multiChain"?(l="multichain",C="info"):t.subtype==="walletConnect"?(l="qr code",C="accent"):t.subtype==="injected"||t.subtype==="announced"?(l=s?"connected":"installed",C=s?"info":"success"):(l=void 0,C=void 0);let S=$.hasAnyConnection(Ce.CONNECTOR_ID.WALLET_CONNECT),z=t.subtype==="walletConnect"||t.subtype==="external"?S:!1;return d`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${_(n)}
        .installed=${!0}
        name=${r.name??"Unknown"}
        .tagVariant=${C}
        tagLabel=${_(l)}
        data-testid=${`wallet-selector-${r.id.toLowerCase()}`}
        size="sm"
        @click=${()=>this.onClickConnector(t)}
        tabIdx=${_(this.tabIdx)}
        ?disabled=${z}
        rdnsId=${_(r.explorerWallet?.rdns||void 0)}
        walletRank=${_(r.explorerWallet?.order)}
      >
      </w3m-list-wallet>
    `}onClickConnector(t){let i=y.state.data?.redirectView;if(t.subtype==="walletConnect"){D.setActiveConnector(t.connector),x.isMobile()?y.push("AllWallets"):y.push("ConnectingWalletConnect",{redirectView:i});return}if(t.subtype==="multiChain"){D.setActiveConnector(t.connector),y.push("ConnectingMultiChain",{redirectView:i});return}if(t.subtype==="injected"){D.setActiveConnector(t.connector),y.push("ConnectingExternal",{connector:t.connector,redirectView:i,wallet:t.connector.explorerWallet});return}if(t.subtype==="announced"){if(t.connector.id==="walletConnect"){x.isMobile()?y.push("AllWallets"):y.push("ConnectingWalletConnect",{redirectView:i});return}y.push("ConnectingExternal",{connector:t.connector,redirectView:i,wallet:t.connector.explorerWallet});return}y.push("ConnectingExternal",{connector:t.connector,redirectView:i})}renderWallet(t,i){let r=t.wallet,n=q.getWalletImage(r),s=$.hasAnyConnection(Ce.CONNECTOR_ID.WALLET_CONNECT),l=this.loadingTelegram,C=t.subtype==="recent"?"recent":void 0,S=t.subtype==="recent"?"info":void 0;return d`
      <w3m-list-wallet
        displayIndex=${i}
        imageSrc=${_(n)}
        name=${r.name??"Unknown"}
        @click=${()=>this.onClickWallet(t)}
        size="sm"
        data-testid=${`wallet-selector-${r.id}`}
        tabIdx=${_(this.tabIdx)}
        ?loading=${l}
        ?disabled=${s}
        rdnsId=${_(r.rdns||void 0)}
        walletRank=${_(r.order)}
        tagLabel=${_(C)}
        .tagVariant=${S}
      >
      </w3m-list-wallet>
    `}onClickWallet(t){let i=y.state.data?.redirectView;if(t.subtype==="featured"){D.selectWalletConnector(t.wallet);return}if(t.subtype==="recent"){if(this.loadingTelegram)return;D.selectWalletConnector(t.wallet);return}if(t.subtype==="custom"){if(this.loadingTelegram)return;y.push("ConnectingWalletConnect",{wallet:t.wallet,redirectView:i});return}if(this.loadingTelegram)return;let r=D.getConnector({id:t.wallet.id,rdns:t.wallet.rdns});r?y.push("ConnectingExternal",{connector:r,redirectView:i}):y.push("ConnectingWalletConnect",{wallet:t.wallet,redirectView:i})}};G.styles=nt;ie([u({type:Number})],G.prototype,"tabIdx",void 0);ie([w()],G.prototype,"connectors",void 0);ie([w()],G.prototype,"recommended",void 0);ie([w()],G.prototype,"featured",void 0);ie([w()],G.prototype,"explorerWallets",void 0);ie([w()],G.prototype,"connections",void 0);ie([w()],G.prototype,"connectorImages",void 0);ie([w()],G.prototype,"loadingTelegram",void 0);G=ie([b("w3m-connector-list")],G);a();p();c();a();p();c();a();p();c();a();p();c();a();p();c();a();p();c();var st=E`
  :host {
    flex: 1;
    height: 100%;
  }

  button {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
    column-gap: ${({spacing:e})=>e[1]};
    color: ${({tokens:e})=>e.theme.textSecondary};
    border-radius: ${({borderRadius:e})=>e[20]};
    background-color: transparent;
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-active='true'] {
    color: ${({tokens:e})=>e.theme.textPrimary};
    background-color: ${({tokens:e})=>e.theme.foregroundTertiary};
  }

  button:hover:enabled:not([data-active='true']),
  button:active:enabled:not([data-active='true']) {
    wui-text,
    wui-icon {
      color: ${({tokens:e})=>e.theme.textPrimary};
    }
  }
`;var Te=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Vt={lg:"lg-regular",md:"md-regular",sm:"sm-regular"},Ht={lg:"md",md:"sm",sm:"sm"},me=class extends g{constructor(){super(...arguments),this.icon="mobile",this.size="md",this.label="",this.active=!1}render(){return d`
      <button data-active=${this.active}>
        ${this.icon?d`<wui-icon size=${Ht[this.size]} name=${this.icon}></wui-icon>`:""}
        <wui-text variant=${Vt[this.size]}> ${this.label} </wui-text>
      </button>
    `}};me.styles=[L,U,st];Te([u()],me.prototype,"icon",void 0);Te([u()],me.prototype,"size",void 0);Te([u()],me.prototype,"label",void 0);Te([u({type:Boolean})],me.prototype,"active",void 0);me=Te([b("wui-tab-item")],me);a();p();c();var lt=E`
  :host {
    display: inline-flex;
    align-items: center;
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    border-radius: ${({borderRadius:e})=>e[32]};
    padding: ${({spacing:e})=>e["01"]};
    box-sizing: border-box;
  }

  :host([data-size='sm']) {
    height: 26px;
  }

  :host([data-size='md']) {
    height: 36px;
  }
`;var Le=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},fe=class extends g{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.size="md",this.activeTab=0}render(){return this.dataset.size=this.size,this.tabs.map((t,i)=>{let r=i===this.activeTab;return d`
        <wui-tab-item
          @click=${()=>this.onTabClick(i)}
          icon=${t.icon}
          size=${this.size}
          label=${t.label}
          ?active=${r}
          data-active=${r}
          data-testid="tab-${t.label?.toLowerCase()}"
        ></wui-tab-item>
      `})}onTabClick(t){this.activeTab=t,this.onTabChange(t)}};fe.styles=[L,U,lt];Le([u({type:Array})],fe.prototype,"tabs",void 0);Le([u()],fe.prototype,"onTabChange",void 0);Le([u()],fe.prototype,"size",void 0);Le([w()],fe.prototype,"activeTab",void 0);fe=Le([b("wui-tabs")],fe);var Ye=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Be=class extends g{constructor(){super(...arguments),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0}disconnectCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.generateTabs();return d`
      <wui-flex justifyContent="center" .padding=${["0","0","4","0"]}>
        <wui-tabs .tabs=${t} .onTabChange=${this.onTabChange.bind(this)}></wui-tabs>
      </wui-flex>
    `}generateTabs(){let t=this.platforms.map(i=>i==="browser"?{label:"Browser",icon:"extension",platform:"browser"}:i==="mobile"?{label:"Mobile",icon:"mobile",platform:"mobile"}:i==="qrcode"?{label:"Mobile",icon:"mobile",platform:"qrcode"}:i==="web"?{label:"Webapp",icon:"browser",platform:"web"}:i==="desktop"?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=t.map(({platform:i})=>i),t}onTabChange(t){let i=this.platformTabs[t];i&&this.onSelectPlatfrom?.(i)}};Ye([u({type:Array})],Be.prototype,"platforms",void 0);Ye([u()],Be.prototype,"onSelectPlatfrom",void 0);Be=Ye([b("w3m-connecting-header")],Be);a();p();c();a();p();c();a();p();c();a();p();c();a();p();c();a();p();c();var at=E`
  :host {
    display: block;
    width: 100px;
    height: 100px;
  }

  svg {
    width: 100px;
    height: 100px;
  }

  rect {
    fill: none;
    stroke: ${e=>e.colors.accent100};
    stroke-width: 3px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var ct=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},ze=class extends g{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){let t=this.radius>50?50:this.radius,r=36-t,n=116+r,o=245+r,s=360+r*1.75;return d`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${t}
          stroke-dasharray="${n} ${o}"
          stroke-dashoffset=${s}
        />
      </svg>
    `}};ze.styles=[L,at];ct([u({type:Number})],ze.prototype,"radius",void 0);ze=ct([b("wui-loading-thumbnail")],ze);a();p();c();a();p();c();a();p();c();a();p();c();a();p();c();var pt=E`
  wui-flex {
    width: 100%;
    height: 52px;
    box-sizing: border-box;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
    padding-left: ${({spacing:e})=>e[3]};
    padding-right: ${({spacing:e})=>e[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({spacing:e})=>e[6]};
  }

  wui-text {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  wui-icon {
    width: 12px;
    height: 12px;
  }
`;var Ne=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Re=class extends g{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return d`
      <wui-flex justifyContent="space-between" alignItems="center">
        <wui-text variant="lg-regular" color="inherit">${this.label}</wui-text>
        <wui-button variant="accent-secondary" size="sm">
          ${this.buttonLabel}
          <wui-icon name="chevronRight" color="inherit" size="inherit" slot="iconRight"></wui-icon>
        </wui-button>
      </wui-flex>
    `}};Re.styles=[L,U,pt];Ne([u({type:Boolean})],Re.prototype,"disabled",void 0);Ne([u()],Re.prototype,"label",void 0);Ne([u()],Re.prototype,"buttonLabel",void 0);Re=Ne([b("wui-cta-button")],Re);a();p();c();var dt=E`
  :host {
    display: block;
    padding: 0 ${({spacing:e})=>e[5]} ${({spacing:e})=>e[5]};
  }
`;var ut=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Me=class extends g{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:t,app_store:i,play_store:r,chrome_store:n,homepage:o}=this.wallet,s=x.isMobile(),l=x.isIos(),C=x.isAndroid(),S=[i,r,o,n].filter(Boolean).length>1,z=Q.getTruncateString({string:t,charsStart:12,charsEnd:0,truncate:"end"});return S&&!s?d`
        <wui-cta-button
          label=${`Don't have ${z}?`}
          buttonLabel="Get"
          @click=${()=>y.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!S&&o?d`
        <wui-cta-button
          label=${`Don't have ${z}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:i&&l?d`
        <wui-cta-button
          label=${`Don't have ${z}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:r&&C?d`
        <wui-cta-button
          label=${`Don't have ${z}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&x.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&x.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&x.openHref(this.wallet.homepage,"_blank")}};Me.styles=[dt];ut([u({type:Object})],Me.prototype,"wallet",void 0);Me=ut([b("w3m-mobile-download-links")],Me);a();p();c();var ht=E`
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
    right: calc(${({spacing:e})=>e[1]} * -1);
    bottom: calc(${({spacing:e})=>e[1]} * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: ${({durations:e})=>e.lg};
    transition-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px ${({spacing:e})=>e[4]};
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms ${({easings:e})=>e["ease-out-power-2"]} both;
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
`;var X=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},O=class extends g{constructor(){super(),this.wallet=y.state.data?.wallet,this.connector=y.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=q.getConnectorImage(this.connector)??q.getWalletImage(this.wallet),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=$.state.wcUri,this.error=$.state.wcError,this.ready=!1,this.showRetry=!1,this.label=void 0,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push($.subscribeKey("wcUri",t=>{this.uri=t,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),$.subscribeKey("wcError",t=>this.error=t)),(x.isTelegram()||x.isSafari())&&x.isIos()&&$.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),$.setWcError(!1),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let t=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,i="";return this.label?i=this.label:(i=`Continue in ${this.name}`,this.error&&(i="Connection declined")),d`
      <wui-flex
        data-error=${_(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="6"
      >
        <wui-flex gap="2" justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${_(this.imageSrc)}></wui-wallet-image>

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
          <wui-text align="center" variant="lg-regular" color="secondary">${t}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?d`
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

      ${this.isWalletConnect?d`
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
    `}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,this.shadowRoot?.querySelector("wui-button")?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"}))}onTryAgain(){$.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.()}loaderTemplate(){let t=Se.state.themeVariables["--w3m-border-radius-master"],i=t?parseInt(t.replace("px",""),10):4;return d`<wui-loading-thumbnail radius=${i*9}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(x.copyToClopboard(this.uri),ce.showSuccess("Link copied"))}catch{ce.showError("Failed to copy")}}};O.styles=ht;X([w()],O.prototype,"isRetrying",void 0);X([w()],O.prototype,"uri",void 0);X([w()],O.prototype,"error",void 0);X([w()],O.prototype,"ready",void 0);X([w()],O.prototype,"showRetry",void 0);X([w()],O.prototype,"label",void 0);X([w()],O.prototype,"secondaryBtnLabel",void 0);X([w()],O.prototype,"secondaryLabel",void 0);X([w()],O.prototype,"isLoading",void 0);X([u({type:Boolean})],O.prototype,"isMobile",void 0);X([u()],O.prototype,"onRetry",void 0);var Ft=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},mt=class extends O{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:y.state.view}})}async onConnectProxy(){try{this.error=!1;let{connectors:t}=D.state,i=t.find(r=>r.type==="ANNOUNCED"&&r.info?.rdns===this.wallet?.rdns||r.type==="INJECTED"||r.name===this.wallet?.name);if(i)await $.connectExternal(i,i.chain);else throw new Error("w3m-connecting-wc-browser: No connector found");Ue.close(),T.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.wallet?.name||"Unknown",view:y.state.view,walletRank:this.wallet?.order}})}catch(t){t instanceof De&&t.originalName===je.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?T.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:t.message}}):T.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),this.error=!0}}};mt=Ft([b("w3m-connecting-wc-browser")],mt);a();p();c();var Kt=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},ft=class extends O{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:y.state.view}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:t,name:i}=this.wallet,{redirect:r,href:n}=x.formatNativeUrl(t,this.uri);$.setWcLinking({name:i,href:n}),$.setRecentWallet(this.wallet),x.openHref(r,"_blank")}catch{this.error=!0}}};ft=Kt([b("w3m-connecting-wc-desktop")],ft);a();p();c();var We=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},we=class extends O{constructor(){if(super(),this.btnLabelTimeout=void 0,this.redirectDeeplink=void 0,this.redirectUniversalLink=void 0,this.target=void 0,this.preferUniversalLinks=P.state.experimental_preferUniversalLinks,this.isLoading=!0,this.onConnect=()=>{if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;let{mobile_link:t,link_mode:i,name:r}=this.wallet,{redirect:n,redirectUniversalLink:o,href:s}=x.formatNativeUrl(t,this.uri,i);this.redirectDeeplink=n,this.redirectUniversalLink=o,this.target=x.isIframe()?"_top":"_self",$.setWcLinking({name:r,href:s}),$.setRecentWallet(this.wallet),this.preferUniversalLinks&&this.redirectUniversalLink?x.openHref(this.redirectUniversalLink,this.target):x.openHref(this.redirectDeeplink,this.target)}catch(t){T.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:t instanceof Error?t.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.secondaryBtnLabel="Open",this.secondaryLabel=Ae.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.onHandleURI(),this.unsubscribe.push($.subscribeKey("wcUri",()=>{this.onHandleURI()})),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile",displayIndex:this.wallet?.display_index,walletRank:this.wallet.order,view:y.state.view}})}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this.btnLabelTimeout)}onHandleURI(){this.isLoading=!this.uri,!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onTryAgain(){$.setWcError(!1),this.onConnect?.()}};We([w()],we.prototype,"redirectDeeplink",void 0);We([w()],we.prototype,"redirectUniversalLink",void 0);We([w()],we.prototype,"target",void 0);We([w()],we.prototype,"preferUniversalLinks",void 0);We([w()],we.prototype,"isLoading",void 0);we=We([b("w3m-connecting-wc-mobile")],we);a();p();c();a();p();c();a();p();c();a();p();c();var bt=Mt(qt(),1);var Qt=.1,wt=2.5,re=7;function Je(e,t,i){return e===t?!1:(e-t<0?t-e:e-t)<=i+Qt}function Gt(e,t){let i=Array.prototype.slice.call(bt.default.create(e,{errorCorrectionLevel:t}).modules.data,0),r=Math.sqrt(i.length);return i.reduce((n,o,s)=>(s%r===0?n.push([o]):n[n.length-1].push(o))&&n,[])}var gt={generate({uri:e,size:t,logoSize:i,padding:r=8,dotColor:n="var(--apkt-colors-black)"}){let s=[],l=Gt(e,"Q"),C=(t-2*r)/l.length,S=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];S.forEach(({x:W,y:v})=>{let I=(l.length-re)*C*W+r,k=(l.length-re)*C*v+r,B=.45;for(let j=0;j<S.length;j+=1){let Y=C*(re-j*2);s.push(ae`
            <rect
              fill=${j===2?"var(--apkt-colors-black)":"var(--apkt-colors-white)"}
              width=${j===0?Y-10:Y}
              rx= ${j===0?(Y-10)*B:Y*B}
              ry= ${j===0?(Y-10)*B:Y*B}
              stroke=${n}
              stroke-width=${j===0?10:0}
              height=${j===0?Y-10:Y}
              x= ${j===0?k+C*j+10/2:k+C*j}
              y= ${j===0?I+C*j+10/2:I+C*j}
            />
          `)}});let z=Math.floor((i+25)/C),se=l.length/2-z/2,le=l.length/2+z/2-1,xe=[];l.forEach((W,v)=>{W.forEach((I,k)=>{if(l[v][k]&&!(v<re&&k<re||v>l.length-(re+1)&&k<re||v<re&&k>l.length-(re+1))&&!(v>se&&v<le&&k>se&&k<le)){let B=v*C+C/2+r,j=k*C+C/2+r;xe.push([B,j])}})});let A={};return xe.forEach(([W,v])=>{A[W]?A[W]?.push(v):A[W]=[v]}),Object.entries(A).map(([W,v])=>{let I=v.filter(k=>v.every(B=>!Je(k,B,C)));return[Number(W),I]}).forEach(([W,v])=>{v.forEach(I=>{s.push(ae`<circle cx=${W} cy=${I} fill=${n} r=${C/wt} />`)})}),Object.entries(A).filter(([W,v])=>v.length>1).map(([W,v])=>{let I=v.filter(k=>v.some(B=>Je(k,B,C)));return[Number(W),I]}).map(([W,v])=>{v.sort((k,B)=>k<B?-1:1);let I=[];for(let k of v){let B=I.find(j=>j.some(Y=>Je(k,Y,C)));B?B.push(k):I.push([k])}return[W,I.map(k=>[k[0],k[k.length-1]])]}).forEach(([W,v])=>{v.forEach(([I,k])=>{s.push(ae`
              <line
                x1=${W}
                x2=${W}
                y1=${I}
                y2=${k}
                stroke=${n}
                stroke-width=${C/(wt/2)}
                stroke-linecap="round"
              />
            `)})}),s}};a();p();c();var yt=E`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
    background-color: ${({colors:e})=>e.white};
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  :host {
    border-radius: ${({borderRadius:e})=>e[4]};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    box-shadow: inset 0 0 0 4px ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: ${({borderRadius:e})=>e[6]};
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: #3396ff !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }

  wui-icon > svg {
    width: inherit;
    height: inherit;
  }
`;var de=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},J=class extends g{constructor(){super(...arguments),this.uri="",this.size=500,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),d`<wui-flex
      alignItems="center"
      justifyContent="center"
      class="wui-qr-code"
      direction="column"
      gap="4"
      width="100%"
      style="height: 100%"
    >
      ${this.templateVisual()} ${this.templateSvg()}
    </wui-flex>`}templateSvg(){return ae`
      <svg viewBox="0 0 ${this.size} ${this.size}" width="100%" height="100%">
        ${gt.generate({uri:this.uri,size:this.size,logoSize:this.arenaClear?0:this.size/4})}
      </svg>
    `}templateVisual(){return this.imageSrc?d`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?d`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:d`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};J.styles=[L,yt];de([u()],J.prototype,"uri",void 0);de([u({type:Number})],J.prototype,"size",void 0);de([u()],J.prototype,"theme",void 0);de([u()],J.prototype,"imageSrc",void 0);de([u()],J.prototype,"alt",void 0);de([u({type:Boolean})],J.prototype,"arenaClear",void 0);de([u({type:Boolean})],J.prototype,"farcaster",void 0);J=de([b("wui-qr-code")],J);a();p();c();a();p();c();a();p();c();var xt=E`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:e})=>e.theme.foregroundSecondary} 0%,
      ${({tokens:e})=>e.theme.foregroundTertiary} 50%,
      ${({tokens:e})=>e.theme.foregroundSecondary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1s ease-in-out infinite;
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;var Oe=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},be=class extends g{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",d`<slot></slot>`}};be.styles=[xt];Oe([u()],be.prototype,"width",void 0);Oe([u()],be.prototype,"height",void 0);Oe([u()],be.prototype,"variant",void 0);Oe([u({type:Boolean})],be.prototype,"rounded",void 0);be=Oe([b("wui-shimmer")],be);a();p();c();var vt=E`
  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: ${({borderRadius:e})=>e[4]};
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-out-power-2"]};
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
`;var $t=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},qe=class extends O{constructor(){super(),this.basic=!1}firstUpdated(){this.basic||T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:y.state.view}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(t=>t())}render(){return this.onRenderProxy(),d`
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
    `}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0)}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let t=this.wallet?this.wallet.name:void 0;return $.setWcLinking(void 0),$.setRecentWallet(this.wallet),d` <wui-qr-code
      theme=${Se.state.themeMode}
      uri=${this.uri}
      imageSrc=${_(q.getWalletImage(this.wallet))}
      color=${_(Se.state.themeVariables["--w3m-qr-color"])}
      alt=${_(t)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let t=!this.uri||!this.ready;return d`<wui-button
      .disabled=${t}
      @click=${this.onCopyUri}
      variant="neutral-secondary"
      size="sm"
      data-testid="copy-wc2-uri"
    >
      Copy link
      <wui-icon size="sm" color="inherit" name="copy" slot="iconRight"></wui-icon>
    </wui-button>`}};qe.styles=vt;$t([u({type:Boolean})],qe.prototype,"basic",void 0);qe=$t([b("w3m-connecting-wc-qrcode")],qe);a();p();c();var Xt=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Ct=class extends g{constructor(){if(super(),this.wallet=y.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:y.state.view}})}render(){return d`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["10","5","5","5"]}
        gap="5"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${_(q.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="md-regular" color="primary">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};Ct=Xt([b("w3m-connecting-wc-unsupported")],Ct);a();p();c();var Et=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Ze=class extends O{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel=Ae.CONNECT_LABELS.MOBILE,this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push($.subscribeKey("wcUri",()=>{this.updateLoadingState()})),T.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web",displayIndex:this.wallet?.display_index,walletRank:this.wallet?.order,view:y.state.view}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:t,name:i}=this.wallet,{redirect:r,href:n}=x.formatUniversalUrl(t,this.uri);$.setWcLinking({name:i,href:n}),$.setRecentWallet(this.wallet),x.openHref(r,"_blank")}catch{this.error=!0}}};Et([w()],Ze.prototype,"isLoading",void 0);Ze=Et([b("w3m-connecting-wc-web")],Ze);a();p();c();var Rt=E`
  :host([data-mobile-fullscreen='true']) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :host([data-mobile-fullscreen='true']) wui-ux-by-reown {
    margin-top: auto;
  }
`;var ge=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},ne=class extends g{constructor(){super(),this.wallet=y.state.data?.wallet,this.unsubscribe=[],this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!P.state.siwx,this.remoteFeatures=P.state.remoteFeatures,this.displayBranding=!0,this.basic=!1,this.determinePlatforms(),this.initializeConnection(),this.unsubscribe.push(P.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return P.state.enableMobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),d`
      ${this.headerTemplate()}
      <div class="platform-container">${this.platformTemplate()}</div>
      ${this.reownBrandingTemplate()}
    `}reownBrandingTemplate(){return!this.remoteFeatures?.reownBranding||!this.displayBranding?null:d`<wui-ux-by-reown></wui-ux-by-reown>`}async initializeConnection(t=!1){if(!(this.platform==="browser"||P.state.manualWCControl&&!t))try{let{wcPairingExpiry:i,status:r}=$.state,{redirectView:n}=y.state.data??{};if(t||P.state.enableEmbedded||x.isPairingExpired(i)||r==="connecting"){let o=$.getConnections(oe.state.activeChain),s=this.remoteFeatures?.multiWallet,l=o.length>0;await $.connectWalletConnect({cache:"never"}),this.isSiwxEnabled||(l&&s?(y.replace("ProfileWallets"),ce.showSuccess("New Wallet Added")):n?y.replace(n):Ue.close())}}catch(i){if(i instanceof Error&&i.message.includes("An error occurred when attempting to switch chain")&&!P.state.enableNetworkSwitch&&oe.state.activeChain){oe.setActiveCaipNetwork(rt.getUnsupportedNetwork(`${oe.state.activeChain}:${oe.state.activeCaipNetwork?.id}`)),oe.showUnsupportedChainUI();return}i instanceof De&&i.originalName===je.PROVIDER_RPC_ERROR_NAME.USER_REJECTED_REQUEST?T.sendEvent({type:"track",event:"USER_REJECTED",properties:{message:i.message}}):T.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:i?.message??"Unknown"}}),$.setWcError(!0),ce.showError(i.message??"Connection error"),$.resetWcConnection(),y.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:t,desktop_link:i,webapp_link:r,injected:n,rdns:o}=this.wallet,s=n?.map(({injected_id:A})=>A).filter(Boolean),l=[...o?[o]:s??[]],C=P.state.isUniversalProvider?!1:l.length,S=t,z=r,se=$.checkInstalled(l),le=C&&se,xe=i&&!x.isMobile();le&&!oe.state.noAdapters&&this.platforms.push("browser"),S&&this.platforms.push(x.isMobile()?"mobile":"qrcode"),z&&this.platforms.push("web"),xe&&this.platforms.push("desktop"),!le&&C&&!oe.state.noAdapters&&this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return d`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return d`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return d`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return d`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return d`<w3m-connecting-wc-qrcode ?basic=${this.basic}></w3m-connecting-wc-qrcode>`;default:return d`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?d`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(t){let i=this.shadowRoot?.querySelector("div");i&&(await i.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=t,i.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};ne.styles=Rt;ge([w()],ne.prototype,"platform",void 0);ge([w()],ne.prototype,"platforms",void 0);ge([w()],ne.prototype,"isSiwxEnabled",void 0);ge([w()],ne.prototype,"remoteFeatures",void 0);ge([u({type:Boolean})],ne.prototype,"displayBranding",void 0);ge([u({type:Boolean})],ne.prototype,"basic",void 0);ne=ge([b("w3m-connecting-wc-view")],ne);var et=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Ve=class extends g{constructor(){super(),this.unsubscribe=[],this.isMobile=x.isMobile(),this.remoteFeatures=P.state.remoteFeatures,this.unsubscribe.push(P.subscribeKey("remoteFeatures",t=>this.remoteFeatures=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(this.isMobile){let{featured:t,recommended:i}=R.state,{customWallets:r}=P.state,n=ot.getRecentWallets(),o=t.length||i.length||r?.length||n.length;return d`<wui-flex flexDirection="column" gap="2" .margin=${["1","3","3","3"]}>
        ${o?d`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return d`<wui-flex flexDirection="column" .padding=${["0","0","4","0"]}>
        <w3m-connecting-wc-view ?basic=${!0} .displayBranding=${!1}></w3m-connecting-wc-view>
        <wui-flex flexDirection="column" .padding=${["0","3","0","3"]}>
          <w3m-all-wallets-widget></w3m-all-wallets-widget>
        </wui-flex>
      </wui-flex>
      ${this.reownBrandingTemplate()} `}reownBrandingTemplate(){return this.remoteFeatures?.reownBranding?d` <wui-flex flexDirection="column" .padding=${["1","0","1","0"]}>
      <wui-ux-by-reown></wui-ux-by-reown>
    </wui-flex>`:null}};et([w()],Ve.prototype,"isMobile",void 0);et([w()],Ve.prototype,"remoteFeatures",void 0);Ve=et([b("w3m-connecting-wc-basic-view")],Ve);a();p();c();a();p();c();a();p();c();a();p();c();a();p();c();var Wt=E`
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
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
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
    background-color: ${({colors:e})=>e.neutrals300};
    border-radius: ${({borderRadius:e})=>e.round};
    border: 1px solid transparent;
    will-change: border;
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      border ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      box-shadow ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      width ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      height ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]},
      transform ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      opacity ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, color, border, box-shadow, width, height, transform, opacity;
  }

  span:before {
    content: '';
    position: absolute;
    background-color: ${({colors:e})=>e.white};
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
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    background-color: ${({tokens:e})=>e.theme.textTertiary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  input:focus-visible:checked + span,
  input:focus:checked + span {
    border: 1px solid ${({tokens:e})=>e.core.iconAccentPrimary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  /* -- Checked states --------------------------------------------------- */
  input:checked + span {
    background-color: ${({tokens:e})=>e.core.iconAccentPrimary};
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
    background-color: ${({colors:e})=>e.neutrals400};
  }

  label:hover > input:checked:not(:disabled) + span {
    background-color: ${({colors:e})=>e.accent080};
  }

  /* -- Disabled state --------------------------------------------------- */
  label:has(input:disabled) {
    pointer-events: none;
    user-select: none;
  }

  input:not(:checked):disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:checked:disabled + span {
    background-color: ${({colors:e})=>e.neutrals700};
  }

  input:not(:checked):disabled + span::before {
    background-color: ${({colors:e})=>e.neutrals400};
  }

  input:checked:disabled + span::before {
    background-color: ${({tokens:e})=>e.theme.textTertiary};
  }
`;var He=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},_e=class extends g{constructor(){super(...arguments),this.inputElementRef=ve(),this.checked=!1,this.disabled=!1,this.size="md"}render(){return d`
      <label data-size=${this.size}>
        <input
          ${$e(this.inputElementRef)}
          type="checkbox"
          ?checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};_e.styles=[L,U,Wt];He([u({type:Boolean})],_e.prototype,"checked",void 0);He([u({type:Boolean})],_e.prototype,"disabled",void 0);He([u()],_e.prototype,"size",void 0);_e=He([b("wui-toggle")],_e);a();p();c();var _t=E`
  :host {
    height: auto;
  }

  :host > wui-flex {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[2]} ${({spacing:e})=>e[3]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.theme.foregroundPrimary};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var St=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Fe=class extends g{constructor(){super(...arguments),this.checked=!1}render(){return d`
      <wui-flex>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-toggle
          ?checked=${this.checked}
          size="sm"
          @switchChange=${this.handleToggleChange.bind(this)}
        ></wui-toggle>
      </wui-flex>
    `}handleToggleChange(t){t.stopPropagation(),this.checked=t.detail,this.dispatchSwitchEvent()}dispatchSwitchEvent(){this.dispatchEvent(new CustomEvent("certifiedSwitchChange",{detail:this.checked,bubbles:!0,composed:!0}))}};Fe.styles=[L,U,_t];St([u({type:Boolean})],Fe.prototype,"checked",void 0);Fe=St([b("wui-certified-switch")],Fe);a();p();c();a();p();c();a();p();c();a();p();c();var kt=E`
  :host {
    position: relative;
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    gap: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.textPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  .wui-input-text-container {
    position: relative;
    display: flex;
  }

  input {
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    color: inherit;
    background: transparent;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
    caret-color: ${({tokens:e})=>e.core.textAccentPrimary};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[3]} ${({spacing:e})=>e[10]};
    font-size: ${({textSize:e})=>e.large};
    line-height: ${({typography:e})=>e["lg-regular"].lineHeight};
    letter-spacing: ${({typography:e})=>e["lg-regular"].letterSpacing};
    font-weight: ${({fontWeight:e})=>e.regular};
    font-family: ${({fontFamily:e})=>e.regular};
  }

  input[data-size='lg'] {
    padding: ${({spacing:e})=>e[4]} ${({spacing:e})=>e[3]}
      ${({spacing:e})=>e[4]} ${({spacing:e})=>e[10]};
  }

  @media (hover: hover) and (pointer: fine) {
    input:hover:enabled {
      border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    }
  }

  input:disabled {
    cursor: unset;
    border: 1px solid ${({tokens:e})=>e.theme.borderPrimary};
  }

  input::placeholder {
    color: ${({tokens:e})=>e.theme.textSecondary};
  }

  input:focus:enabled {
    border: 1px solid ${({tokens:e})=>e.theme.borderSecondary};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    -webkit-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    -moz-box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
    box-shadow: 0px 0px 0px 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  div.wui-input-text-container:has(input:disabled) {
    opacity: 0.5;
  }

  wui-icon.wui-input-text-left-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    left: ${({spacing:e})=>e[4]};
    color: ${({tokens:e})=>e.theme.iconDefault};
  }

  button.wui-input-text-submit-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    border-radius: ${({borderRadius:e})=>e[2]};
    color: ${({tokens:e})=>e.core.textAccentPrimary};
  }

  button.wui-input-text-submit-button:disabled {
    opacity: 1;
  }

  button.wui-input-text-submit-button.loading wui-icon {
    animation: spin 1s linear infinite;
  }

  button.wui-input-text-submit-button:hover {
    background: ${({tokens:e})=>e.core.foregroundAccent010};
  }

  input:has(+ .wui-input-text-submit-button) {
    padding-right: ${({spacing:e})=>e[12]};
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  /* -- Keyframes --------------------------------------------------- */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;var V=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},N=class extends g{constructor(){super(...arguments),this.inputElementRef=ve(),this.disabled=!1,this.loading=!1,this.placeholder="",this.type="text",this.value="",this.size="md"}render(){return d` <div class="wui-input-text-container">
        ${this.templateLeftIcon()}
        <input
          data-size=${this.size}
          ${$e(this.inputElementRef)}
          data-testid="wui-input-text"
          type=${this.type}
          enterkeyhint=${_(this.enterKeyHint)}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this.dispatchInputChangeEvent.bind(this)}
          @keydown=${this.onKeyDown}
          .value=${this.value||""}
        />
        ${this.templateSubmitButton()}
        <slot class="wui-input-text-slot"></slot>
      </div>
      ${this.templateError()} ${this.templateWarning()}`}templateLeftIcon(){return this.icon?d`<wui-icon
        class="wui-input-text-left-icon"
        size="md"
        data-size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}templateSubmitButton(){return this.onSubmit?d`<button
        class="wui-input-text-submit-button ${this.loading?"loading":""}"
        @click=${this.onSubmit?.bind(this)}
        ?disabled=${this.disabled||this.loading}
      >
        ${this.loading?d`<wui-icon name="spinner" size="md"></wui-icon>`:d`<wui-icon name="chevronRight" size="md"></wui-icon>`}
      </button>`:null}templateError(){return this.errorText?d`<wui-text variant="sm-regular" color="error">${this.errorText}</wui-text>`:null}templateWarning(){return this.warningText?d`<wui-text variant="sm-regular" color="warning">${this.warningText}</wui-text>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};N.styles=[L,U,kt];V([u()],N.prototype,"icon",void 0);V([u({type:Boolean})],N.prototype,"disabled",void 0);V([u({type:Boolean})],N.prototype,"loading",void 0);V([u()],N.prototype,"placeholder",void 0);V([u()],N.prototype,"type",void 0);V([u()],N.prototype,"value",void 0);V([u()],N.prototype,"errorText",void 0);V([u()],N.prototype,"warningText",void 0);V([u()],N.prototype,"onSubmit",void 0);V([u()],N.prototype,"size",void 0);V([u({attribute:!1})],N.prototype,"onKeyDown",void 0);N=V([b("wui-input-text")],N);a();p();c();var Tt=E`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: ${({spacing:e})=>e[3]};
    color: ${({tokens:e})=>e.theme.iconDefault};
    cursor: pointer;
    padding: ${({spacing:e})=>e[2]};
    background-color: transparent;
    border-radius: ${({borderRadius:e})=>e[4]};
    transition: background-color ${({durations:e})=>e.lg}
      ${({easings:e})=>e["ease-out-power-2"]};
  }

  @media (hover: hover) {
    wui-icon:hover {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }
`;var Lt=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Ke=class extends g{constructor(){super(...arguments),this.inputComponentRef=ve(),this.inputValue=""}render(){return d`
      <wui-input-text
        ${$e(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
        @inputChange=${this.onInputChange}
      >
        ${this.inputValue?d`<wui-icon
              @click=${this.clearValue}
              color="inherit"
              size="sm"
              name="close"
            ></wui-icon>`:null}
      </wui-input-text>
    `}onInputChange(t){this.inputValue=t.detail||""}clearValue(){let i=this.inputComponentRef.value?.inputElementRef.value;i&&(i.value="",this.inputValue="",i.focus(),i.dispatchEvent(new Event("input")))}};Ke.styles=[L,Tt];Lt([u()],Ke.prototype,"inputValue",void 0);Ke=Lt([b("wui-search-bar")],Ke);a();p();c();a();p();c();a();p();c();a();p();c();var Ot=ae`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`;a();p();c();var It=E`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 104px;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[5]};
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
    stroke: ${({tokens:e})=>e.theme.foregroundSecondary};
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var Pt=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Qe=class extends g{constructor(){super(...arguments),this.type="wallet"}render(){return d`
      ${this.shimmerTemplate()}
      <wui-shimmer width="80px" height="20px"></wui-shimmer>
    `}shimmerTemplate(){return this.type==="network"?d` <wui-shimmer data-type=${this.type} width="48px" height="54px"></wui-shimmer>
        ${Ot}`:d`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}};Qe.styles=[L,U,It];Pt([u()],Qe.prototype,"type",void 0);Qe=Pt([b("wui-card-select-loader")],Qe);a();p();c();a();p();c();a();p();c();var jt=Pe`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var H=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},M=class extends g{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--apkt-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--apkt-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--apkt-spacing-${this.gap})`};
      padding-top: ${this.padding&&Q.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&Q.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&Q.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&Q.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&Q.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&Q.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&Q.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&Q.getSpacingStyles(this.margin,3)};
    `,d`<slot></slot>`}};M.styles=[L,jt];H([u()],M.prototype,"gridTemplateRows",void 0);H([u()],M.prototype,"gridTemplateColumns",void 0);H([u()],M.prototype,"justifyItems",void 0);H([u()],M.prototype,"alignItems",void 0);H([u()],M.prototype,"justifyContent",void 0);H([u()],M.prototype,"alignContent",void 0);H([u()],M.prototype,"columnGap",void 0);H([u()],M.prototype,"rowGap",void 0);H([u()],M.prototype,"gap",void 0);H([u()],M.prototype,"padding",void 0);H([u()],M.prototype,"margin",void 0);M=H([b("wui-grid")],M);a();p();c();a();p();c();var At=E`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]} ${({spacing:e})=>e[0]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: clamp(0px, ${({borderRadius:e})=>e[4]}, 20px);
    transition:
      color ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-1"]},
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]},
      border-radius ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-1"]};
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: ${({tokens:e})=>e.theme.textPrimary};
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
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:disabled > wui-flex > wui-text {
    color: ${({tokens:e})=>e.core.glass010};
  }

  [data-selected='true'] {
    background-color: ${({colors:e})=>e.accent020};
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: ${({colors:e})=>e.accent010};
    }
  }

  [data-selected='true']:active:enabled {
    background-color: ${({colors:e})=>e.accent010};
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var Z=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},F=class extends g{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.isImpressed=!1,this.explorerId="",this.walletQuery="",this.certified=!1,this.displayIndex=0,this.wallet=void 0,this.observer=new IntersectionObserver(t=>{t.forEach(i=>{i.isIntersecting?(this.visible=!0,this.fetchImageSrc(),this.sendImpressionEvent()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let t=this.wallet?.badge_type==="certified";return d`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="1">
          <wui-text
            variant="md-regular"
            color="inherit"
            class=${_(t?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${t?d`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():d`
      <wui-wallet-image
        size="lg"
        imageSrc=${_(this.imageSrc)}
        name=${_(this.wallet?.name)}
        .installed=${this.wallet?.installed??!1}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return d`<wui-shimmer width="56px" height="56px"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=q.getWalletImage(this.wallet),!this.imageSrc&&(this.imageLoading=!0,this.imageSrc=await q.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}sendImpressionEvent(){!this.wallet||this.isImpressed||(this.isImpressed=!0,T.sendWalletImpressionEvent({name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.explorerId,view:y.state.view,query:this.walletQuery,certified:this.certified,displayIndex:this.displayIndex}))}};F.styles=At;Z([w()],F.prototype,"visible",void 0);Z([w()],F.prototype,"imageSrc",void 0);Z([w()],F.prototype,"imageLoading",void 0);Z([w()],F.prototype,"isImpressed",void 0);Z([u()],F.prototype,"explorerId",void 0);Z([u()],F.prototype,"walletQuery",void 0);Z([u()],F.prototype,"certified",void 0);Z([u()],F.prototype,"displayIndex",void 0);Z([u({type:Object})],F.prototype,"wallet",void 0);F=Z([b("w3m-all-wallets-list-item")],F);a();p();c();var Dt=E`
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
    animation-duration: ${({durations:e})=>e.xl};
    animation-timing-function: ${({easings:e})=>e["ease-inout-power-2"]};
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
    padding-top: ${({spacing:e})=>e[4]};
    padding-bottom: ${({spacing:e})=>e[4]};
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var ue=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Ut="local-paginator",ee=class extends g{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!R.state.wallets.length,this.wallets=R.state.wallets,this.recommended=R.state.recommended,this.featured=R.state.featured,this.filteredWallets=R.state.filteredWallets,this.mobileFullScreen=P.state.enableMobileFullScreen,this.unsubscribe.push(R.subscribeKey("wallets",t=>this.wallets=t),R.subscribeKey("recommended",t=>this.recommended=t),R.subscribeKey("featured",t=>this.featured=t),R.subscribeKey("filteredWallets",t=>this.filteredWallets=t))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),this.paginationObserver?.disconnect()}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),d`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","3","3","3"]}
        gap="2"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let t=this.shadowRoot?.querySelector("wui-grid");t&&(await R.fetchWalletsByPage({page:1}),await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(t,i){return[...Array(t)].map(()=>d`
        <wui-card-select-loader type="wallet" id=${_(i)}></wui-card-select-loader>
      `)}getWallets(){let t=[...this.featured,...this.recommended];this.filteredWallets?.length>0?t.push(...this.filteredWallets):t.push(...this.wallets);let i=x.uniqueBy(t,"id"),r=ke.markWalletsAsInstalled(i);return ke.markWalletsWithDisplayIndex(r)}walletsTemplate(){return this.getWallets().map((i,r)=>d`
        <w3m-all-wallets-list-item
          data-testid="wallet-search-item-${i.id}"
          @click=${()=>this.onConnectWallet(i)}
          .wallet=${i}
          explorerId=${i.id}
          certified=${this.badge==="certified"}
          displayIndex=${r}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:t,recommended:i,featured:r,count:n,mobileFilteredOutWalletsLength:o}=R.state,s=window.innerWidth<352?3:4,l=t.length+i.length,S=Math.ceil(l/s)*s-l+s;return S-=t.length?r.length%s:0,n===0&&r.length>0?null:n===0||[...r,...t,...i].length<n-(o??0)?this.shimmerTemplate(S,Ut):null}createPaginationObserver(){let t=this.shadowRoot?.querySelector(`#${Ut}`);t&&(this.paginationObserver=new IntersectionObserver(([i])=>{if(i?.isIntersecting&&!this.loading){let{page:r,count:n,wallets:o}=R.state;o.length<n&&R.fetchWalletsByPage({page:r+1})}}),this.paginationObserver.observe(t))}onConnectWallet(t){D.selectWalletConnector(t)}};ee.styles=Dt;ue([w()],ee.prototype,"loading",void 0);ue([w()],ee.prototype,"wallets",void 0);ue([w()],ee.prototype,"recommended",void 0);ue([w()],ee.prototype,"featured",void 0);ue([w()],ee.prototype,"filteredWallets",void 0);ue([w()],ee.prototype,"badge",void 0);ue([w()],ee.prototype,"mobileFullScreen",void 0);ee=ue([b("w3m-all-wallets-list")],ee);a();p();c();a();p();c();a();p();c();var Bt=Pe`
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
`;var Ie=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},ye=class extends g{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.mobileFullScreen=P.state.enableMobileFullScreen,this.query=""}render(){return this.mobileFullScreen&&this.setAttribute("data-mobile-fullscreen","true"),this.onSearch(),this.loading?d`<wui-loading-spinner color="accent-primary"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await R.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:t}=R.state,i=ke.markWalletsAsInstalled(t);return t.length?d`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","3","3","3"]}
        rowGap="4"
        columngap="2"
        justifyContent="space-between"
      >
        ${i.map((r,n)=>d`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(r)}
              .wallet=${r}
              data-testid="wallet-search-item-${r.id}"
              explorerId=${r.id}
              certified=${this.badge==="certified"}
              walletQuery=${this.query}
              displayIndex=${n}
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:d`
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
      `}onConnectWallet(t){D.selectWalletConnector(t)}};ye.styles=Bt;Ie([w()],ye.prototype,"loading",void 0);Ie([w()],ye.prototype,"mobileFullScreen",void 0);Ie([u()],ye.prototype,"query",void 0);Ie([u()],ye.prototype,"badge",void 0);ye=Ie([b("w3m-all-wallets-search")],ye);var tt=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Ge=class extends g{constructor(){super(...arguments),this.search="",this.badge=void 0,this.onDebouncedSearch=x.debounce(t=>{this.search=t})}render(){let t=this.search.length>=2;return d`
      <wui-flex .padding=${["1","3","3","3"]} gap="2" alignItems="center">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge==="certified"}
          @certifiedSwitchChange=${this.onCertifiedSwitchChange.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${t||this.badge?d`<w3m-all-wallets-search
            query=${this.search}
            .badge=${this.badge}
          ></w3m-all-wallets-search>`:d`<w3m-all-wallets-list .badge=${this.badge}></w3m-all-wallets-list>`}
    `}onInputChange(t){this.onDebouncedSearch(t.detail)}onCertifiedSwitchChange(t){t.detail?(this.badge="certified",ce.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})):this.badge=void 0}qrButtonTemplate(){return x.isMobile()?d`
        <wui-icon-box
          size="xl"
          iconSize="xl"
          color="accent-primary"
          icon="qrCode"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){y.push("ConnectingWalletConnect")}};tt([w()],Ge.prototype,"search",void 0);tt([w()],Ge.prototype,"badge",void 0);Ge=tt([b("w3m-all-wallets-view")],Ge);a();p();c();a();p();c();a();p();c();a();p();c();var zt=E`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    border-radius: ${({borderRadius:e})=>e[4]};
    transition:
      background-color ${({durations:e})=>e.lg}
        ${({easings:e})=>e["ease-out-power-2"]},
      scale ${({durations:e})=>e.lg} ${({easings:e})=>e["ease-out-power-2"]};
    will-change: background-color, scale;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-image {
    color: ${({tokens:e})=>e.theme.textPrimary};
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var te=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},K=class extends g{constructor(){super(...arguments),this.imageSrc="google",this.loading=!1,this.disabled=!1,this.rightIcon=!0,this.rounded=!1,this.fullSize=!1}render(){return this.dataset.rounded=this.rounded?"true":"false",d`
      <button
        ?disabled=${this.loading?!0:!!this.disabled}
        data-loading=${this.loading}
        tabindex=${_(this.tabIdx)}
      >
        <wui-flex gap="2" alignItems="center">
          ${this.templateLeftIcon()}
          <wui-flex gap="1">
            <slot></slot>
          </wui-flex>
        </wui-flex>
        ${this.templateRightIcon()}
      </button>
    `}templateLeftIcon(){return this.icon?d`<wui-image
        icon=${this.icon}
        iconColor=${_(this.iconColor)}
        ?boxed=${!0}
        ?rounded=${this.rounded}
      ></wui-image>`:d`<wui-image
      ?boxed=${!0}
      ?rounded=${this.rounded}
      ?fullSize=${this.fullSize}
      src=${this.imageSrc}
    ></wui-image>`}templateRightIcon(){return this.rightIcon?this.loading?d`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:d`<wui-icon name="chevronRight" size="lg" color="default"></wui-icon>`:null}};K.styles=[L,U,zt];te([u()],K.prototype,"imageSrc",void 0);te([u()],K.prototype,"icon",void 0);te([u()],K.prototype,"iconColor",void 0);te([u({type:Boolean})],K.prototype,"loading",void 0);te([u()],K.prototype,"tabIdx",void 0);te([u({type:Boolean})],K.prototype,"disabled",void 0);te([u({type:Boolean})],K.prototype,"rightIcon",void 0);te([u({type:Boolean})],K.prototype,"rounded",void 0);te([u({type:Boolean})],K.prototype,"fullSize",void 0);K=te([b("wui-list-item")],K);var Yt=function(e,t,i,r){var n=arguments.length,o=n<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var l=e.length-1;l>=0;l--)(s=e[l])&&(o=(n<3?s(o):n>3?s(t,i,o):s(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},Nt=class extends g{constructor(){super(...arguments),this.wallet=y.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return d`
      <wui-flex gap="2" flexDirection="column" .padding=${["3","3","4","3"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?d`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?d`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?d`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="md-medium" color="primary">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?d`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="md-medium" color="primary">Website</wui-text>
      </wui-list-item>
    `:null}openStore(t){t.href&&this.wallet&&(T.sendEvent({type:"track",event:"GET_WALLET",properties:{name:this.wallet.name,walletRank:this.wallet.order,explorerId:this.wallet.id,type:t.type}}),x.openHref(t.href,"_blank"))}onChromeStore(){this.wallet?.chrome_store&&this.openStore({href:this.wallet.chrome_store,type:"chrome_store"})}onAppStore(){this.wallet?.app_store&&this.openStore({href:this.wallet.app_store,type:"app_store"})}onPlayStore(){this.wallet?.play_store&&this.openStore({href:this.wallet.play_store,type:"play_store"})}onHomePage(){this.wallet?.homepage&&this.openStore({href:this.wallet.homepage,type:"homepage"})}};Nt=Yt([b("w3m-downloads-view")],Nt);export{Ge as W3mAllWalletsView,Ve as W3mConnectingWcBasicView,Nt as W3mDownloadsView};
