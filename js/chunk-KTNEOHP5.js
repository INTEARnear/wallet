import{a as l,b as $,g as R}from"./chunk-G6MGL5IE.js";import{C as p,G as x,I as E,U as Y,Y as I,Z as b,a as S,l as A,m as j,q as L,s as T,z as B}from"./chunk-AXPE5NAX.js";import{b as y,e as a,j as v}from"./chunk-WGWCH7J2.js";var D;(function(r){r.approve="approved",r.bought="bought",r.borrow="borrowed",r.burn="burnt",r.cancel="canceled",r.claim="claimed",r.deploy="deployed",r.deposit="deposited",r.execute="executed",r.mint="minted",r.receive="received",r.repay="repaid",r.send="sent",r.sell="sold",r.stake="staked",r.trade="swapped",r.unstake="unstaked",r.withdraw="withdrawn"})(D||(D={}));var V=y`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-005);
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }
`;var g=function(r,t,e,o){var s=arguments.length,i=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(r,t,e,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(i=(s<3?n(i):s>3?n(t,e,i):n(t,e))||i);return s>3&&i&&Object.defineProperty(t,e,i),i},h=class extends v{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){let[t,e]=this.images,o=t?.type==="NFT",s=e?.url?e.type==="NFT":o,i=o?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)",n=s?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)";return this.style.cssText=`
    --local-left-border-radius: ${i};
    --local-right-border-radius: ${n};
    `,a`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){let[t,e]=this.images,o=t?.type;return this.images.length===2&&(t?.url||e?.url)?a`<div class="swap-images-container">
        ${t?.url?a`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
        ${e?.url?a`<wui-image src=${e.url} alt="Transaction image"></wui-image>`:null}
      </div>`:t?.url?a`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:o==="NFT"?a`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`:a`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`}templateIcon(){let t="accent-100",e;return e=this.getIcon(),this.status&&(t=this.getStatusColor()),e?a`
      <wui-icon-box
        size="xxs"
        iconColor=${t}
        backgroundColor=${t}
        background="opaque"
        icon=${e}
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():this.type==="trade"?"swapHorizontalBold":this.type==="approve"?"checkmark":this.type==="cancel"?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success-100";case"failed":return"error-100";case"pending":return"inverse-100";default:return"accent-100"}}};h.styles=[V];g([l()],h.prototype,"type",void 0);g([l()],h.prototype,"status",void 0);g([l()],h.prototype,"direction",void 0);g([l({type:Boolean})],h.prototype,"onlyDirectionIcon",void 0);g([l({type:Array})],h.prototype,"images",void 0);g([l({type:Object})],h.prototype,"secondImage",void 0);h=g([b("wui-transaction-visual")],h);var z=y`
  :host > wui-flex:first-child {
    align-items: center;
    column-gap: var(--wui-spacing-s);
    padding: 6.5px var(--wui-spacing-xs) 6.5px var(--wui-spacing-xs);
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;var d=function(r,t,e,o){var s=arguments.length,i=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(r,t,e,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(i=(s<3?n(i):s>3?n(t,e,i):n(t,e))||i);return s>3&&i&&Object.defineProperty(t,e,i),i},u=class extends v{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[],this.price=[],this.amount=[],this.symbol=[]}render(){return a`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${R(this.direction)}
          type=${this.type}
          onlyDirectionIcon=${R(this.onlyDirectionIcon)}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${D[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){let t=this.descriptions?.[0];return t?a`
          <wui-text variant="small-500" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}templateSecondDescription(){let t=this.descriptions?.[1];return t?a`
          <wui-icon class="description-separator-icon" size="xxs" name="arrowRight"></wui-icon>
          <wui-text variant="small-400" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}};u.styles=[Y,z];d([l()],u.prototype,"type",void 0);d([l({type:Array})],u.prototype,"descriptions",void 0);d([l()],u.prototype,"date",void 0);d([l({type:Boolean})],u.prototype,"onlyDirectionIcon",void 0);d([l()],u.prototype,"status",void 0);d([l()],u.prototype,"direction",void 0);d([l({type:Array})],u.prototype,"images",void 0);d([l({type:Array})],u.prototype,"price",void 0);d([l({type:Array})],u.prototype,"amount",void 0);d([l({type:Array})],u.prototype,"symbol",void 0);u=d([b("wui-transaction-list-item")],u);var F=y`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: var(--wui-spacing-m);
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

  .emptyContainer {
    height: 100%;
  }
`;var w=function(r,t,e,o){var s=arguments.length,i=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(r,t,e,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(i=(s<3?n(i):s>3?n(t,e,i):n(t,e))||i);return s>3&&i&&Object.defineProperty(t,e,i),i},O="last-transaction",M=7,f=class extends v{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=x.state.activeCaipAddress,this.transactionsByYear=p.state.transactionsByYear,this.loading=p.state.loading,this.empty=p.state.empty,this.next=p.state.next,p.clearCursor(),this.unsubscribe.push(x.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(p.resetTransactions(),p.fetchTransactions(t)),this.caipAddress=t}),x.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),p.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return a` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){let t=x.state.activeCaipNetwork?.caipNetworkId;p.state.lastNetworkInView!==t&&(p.resetTransactions(),this.caipAddress&&p.fetchTransactions(A.getPlainAddress(this.caipAddress))),p.setLastNetworkInView(t)}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(e=>{let o=parseInt(e,10),s=new Array(12).fill(null).map((i,n)=>{let c=I.getTransactionGroupTitle(o,n),m=this.transactionsByYear[o]?.[n];return{groupTitle:c,transactions:m}}).filter(({transactions:i})=>i).reverse();return s.map(({groupTitle:i,transactions:n},c)=>{let m=c===s.length-1;return n?a`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${m?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200" data-testid="group-title"
                >${i}</wui-text
              >
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(n,m)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,e){let{date:o,descriptions:s,direction:i,isAllNFT:n,images:c,status:m,transfers:C,type:N}=this.getTransactionListItemProps(t),W=C?.length>1;return C?.length===2&&!n?a`
        <wui-transaction-list-item
          date=${o}
          .direction=${i}
          id=${e&&this.next?O:""}
          status=${m}
          type=${N}
          .images=${c}
          .descriptions=${s}
        ></wui-transaction-list-item>
      `:W?C.map((k,_)=>{let U=I.getTransferDescription(k),G=e&&_===C.length-1;return a` <wui-transaction-list-item
          date=${o}
          direction=${k.direction}
          id=${G&&this.next?O:""}
          status=${m}
          type=${N}
          .onlyDirectionIcon=${!0}
          .images=${[c[_]]}
          .descriptions=${[U]}
        ></wui-transaction-list-item>`}):a`
      <wui-transaction-list-item
        date=${o}
        .direction=${i}
        id=${e&&this.next?O:""}
        status=${m}
        type=${N}
        .images=${c}
        .descriptions=${s}
      ></wui-transaction-list-item>
    `}templateTransactions(t,e){return t.map((o,s)=>{let i=e&&s===t.length-1;return a`${this.templateRenderTransaction(o,i)}`})}emptyStateActivity(){return a`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["3xl","xl","3xl","xl"]}
      gap="xl"
      data-testid="empty-activity-state"
    >
      <wui-icon-box
        backgroundColor="gray-glass-005"
        background="gray"
        iconColor="fg-200"
        icon="wallet"
        size="lg"
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="xs">
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >No Transactions yet</wui-text
        >
        <wui-text align="center" variant="small-500" color="fg-200"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return a`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
      data-testid="empty-account-state"
    >
      <wui-icon-box
        icon="swapHorizontal"
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
        <wui-text variant="paragraph-500" align="center" color="fg-100">No activity yet</wui-text>
        <wui-text variant="small-400" align="center" color="fg-200"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return this.page==="account"?a`${this.emptyStateAccount()}`:a`${this.emptyStateActivity()}`}templateLoading(){return this.page==="activity"?Array(M).fill(a` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t):null}onReceiveClick(){T.push("WalletReceive")}createPaginationObserver(){let t=x.state.activeChain,{projectId:e}=j.state;this.paginationObserver=new IntersectionObserver(([o])=>{o?.isIntersecting&&!this.loading&&(p.fetchTransactions(A.getPlainAddress(this.caipAddress)),L.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:A.getPlainAddress(this.caipAddress),projectId:e,cursor:this.next,isSmartAccount:E.state.preferredAccountTypes?.[t]===B.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();let t=this.shadowRoot?.querySelector(`#${O}`);t&&this.paginationObserver?.observe(t)}getTransactionListItemProps(t){let e=S.formatDate(t?.metadata?.minedAt),o=I.getTransactionDescriptions(t),s=t?.transfers,i=t?.transfers?.[0],n=!!i&&t?.transfers?.every(m=>!!m.nft_info),c=I.getTransactionImages(s);return{date:e,direction:i?.direction,descriptions:o,isAllNFT:n,images:c,status:t.metadata?.status,transfers:s,type:t.metadata?.operationType}}};f.styles=F;w([l()],f.prototype,"page",void 0);w([$()],f.prototype,"caipAddress",void 0);w([$()],f.prototype,"transactionsByYear",void 0);w([$()],f.prototype,"loading",void 0);w([$()],f.prototype,"empty",void 0);w([$()],f.prototype,"next",void 0);f=w([b("w3m-activity-list")],f);
