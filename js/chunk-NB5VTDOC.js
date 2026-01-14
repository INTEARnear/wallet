import{c as S,g as _,h as C}from"./chunk-LTN6YROF.js";import{B as U,D as V,G,J as h,M as R,e as W,r as j,s as F,x as P}from"./chunk-N2WXLAZF.js";import{a as B}from"./chunk-B2LU4KHT.js";import{a as d,b as O}from"./chunk-IDZGCU4F.js";import{b as $,e as a,k as I}from"./chunk-ZS2R6O6N.js";import{i as l,k as p,o as u}from"./chunk-JY5TIRRF.js";l();u();p();l();u();p();l();u();p();l();u();p();var T;(function(r){r.approve="approved",r.bought="bought",r.borrow="borrowed",r.burn="burnt",r.cancel="canceled",r.claim="claimed",r.deploy="deployed",r.deposit="deposited",r.execute="executed",r.mint="minted",r.receive="received",r.repay="repaid",r.send="sent",r.sell="sold",r.stake="staked",r.trade="swapped",r.unstake="unstaked",r.withdraw="withdrawn"})(T||(T={}));l();u();p();l();u();p();var M=$`
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
`;var A=function(r,t,i,o){var s=arguments.length,e=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(r,t,i,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(e=(s<3?n(e):s>3?n(t,i,e):n(t,i))||e);return s>3&&e&&Object.defineProperty(t,i,e),e},v=class extends I{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){let[t,i]=this.images,o=t?.type==="NFT",s=i?.url?i.type==="NFT":o,e=o?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)",n=s?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)";return this.style.cssText=`
    --local-left-border-radius: ${e};
    --local-right-border-radius: ${n};
    `,a`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){let[t,i]=this.images,o=t?.type;return this.images.length===2&&(t?.url||i?.url)?a`<div class="swap-images-container">
        ${t?.url?a`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
        ${i?.url?a`<wui-image src=${i.url} alt="Transaction image"></wui-image>`:null}
      </div>`:t?.url?a`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:o==="NFT"?a`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`:a`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`}templateIcon(){let t="accent-100",i;return i=this.getIcon(),this.status&&(t=this.getStatusColor()),i?a`
      <wui-icon-box
        size="xxs"
        iconColor=${t}
        backgroundColor=${t}
        background="opaque"
        icon=${i}
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():this.type==="trade"?"swapHorizontalBold":this.type==="approve"?"checkmark":this.type==="cancel"?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success-100";case"failed":return"error-100";case"pending":return"inverse-100";default:return"accent-100"}}};v.styles=[M];A([d()],v.prototype,"type",void 0);A([d()],v.prototype,"status",void 0);A([d()],v.prototype,"direction",void 0);A([d({type:Boolean})],v.prototype,"onlyDirectionIcon",void 0);A([d({type:Array})],v.prototype,"images",void 0);A([d({type:Object})],v.prototype,"secondImage",void 0);v=A([C("wui-transaction-visual")],v);l();u();p();var K=$`
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
`;var f=function(r,t,i,o){var s=arguments.length,e=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(r,t,i,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(e=(s<3?n(e):s>3?n(t,i,e):n(t,i))||e);return s>3&&e&&Object.defineProperty(t,i,e),e},m=class extends I{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[],this.price=[],this.amount=[],this.symbol=[]}render(){return a`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${B(this.direction)}
          type=${this.type}
          onlyDirectionIcon=${B(this.onlyDirectionIcon)}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${T[this.type]||this.type}
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
        `:null}};m.styles=[S,K];f([d()],m.prototype,"type",void 0);f([d({type:Array})],m.prototype,"descriptions",void 0);f([d()],m.prototype,"date",void 0);f([d({type:Boolean})],m.prototype,"onlyDirectionIcon",void 0);f([d()],m.prototype,"status",void 0);f([d()],m.prototype,"direction",void 0);f([d({type:Array})],m.prototype,"images",void 0);f([d({type:Array})],m.prototype,"price",void 0);f([d({type:Array})],m.prototype,"amount",void 0);f([d({type:Array})],m.prototype,"symbol",void 0);m=f([C("wui-transaction-list-item")],m);l();u();p();l();u();p();l();u();p();var H=$`
  :host > wui-flex:first-child {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`;var Z=function(r,t,i,o){var s=arguments.length,e=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(r,t,i,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(e=(s<3?n(e):s>3?n(t,i,e):n(t,i))||e);return s>3&&e&&Object.defineProperty(t,i,e),e},Y=class extends I{render(){return a`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px"></wui-shimmer>
        <wui-flex flexDirection="column" gap="2xs">
          <wui-shimmer width="72px" height="16px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="148px" height="14px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" borderRadius="5xs"></wui-shimmer>
      </wui-flex>
    `}};Y.styles=[S,H];Y=Z([C("wui-transaction-list-item-loader")],Y);l();u();p();var q=$`
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
`;var D=function(r,t,i,o){var s=arguments.length,e=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(r,t,i,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(e=(s<3?n(e):s>3?n(t,i,e):n(t,i))||e);return s>3&&e&&Object.defineProperty(t,i,e),e},N="last-transaction",tt=7,b=class extends I{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=R.state.activeCaipAddress,this.transactionsByYear=h.state.transactionsByYear,this.loading=h.state.loading,this.empty=h.state.empty,this.next=h.state.next,h.clearCursor(),this.unsubscribe.push(R.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(h.resetTransactions(),h.fetchTransactions(t)),this.caipAddress=t}),R.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),h.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return a` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){h.resetTransactions(),this.caipAddress&&h.fetchTransactions(j.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(i=>{let o=parseInt(i,10),s=new Array(12).fill(null).map((e,n)=>{let c=_.getTransactionGroupTitle(o,n),g=this.transactionsByYear[o]?.[n];return{groupTitle:c,transactions:g}}).filter(({transactions:e})=>e).reverse();return s.map(({groupTitle:e,transactions:n},c)=>{let g=c===s.length-1;return n?a`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${g?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200" data-testid="group-title"
                >${e}</wui-text
              >
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(n,g)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,i){let{date:o,descriptions:s,direction:e,isAllNFT:n,images:c,status:g,transfers:L,type:E}=this.getTransactionListItemProps(t),J=L?.length>1;return L?.length===2&&!n?a`
        <wui-transaction-list-item
          date=${o}
          .direction=${e}
          id=${i&&this.next?N:""}
          status=${g}
          type=${E}
          .images=${c}
          .descriptions=${s}
        ></wui-transaction-list-item>
      `:J?L.map((k,z)=>{let Q=_.getTransferDescription(k),X=i&&z===L.length-1;return a` <wui-transaction-list-item
          date=${o}
          direction=${k.direction}
          id=${X&&this.next?N:""}
          status=${g}
          type=${E}
          .onlyDirectionIcon=${!0}
          .images=${[c[z]]}
          .descriptions=${[Q]}
        ></wui-transaction-list-item>`}):a`
      <wui-transaction-list-item
        date=${o}
        .direction=${e}
        id=${i&&this.next?N:""}
        status=${g}
        type=${E}
        .images=${c}
        .descriptions=${s}
      ></wui-transaction-list-item>
    `}templateTransactions(t,i){return t.map((o,s)=>{let e=i&&s===t.length-1;return a`${this.templateRenderTransaction(o,e)}`})}emptyStateActivity(){return a`<wui-flex
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
    </wui-flex>`}templateEmpty(){return this.page==="account"?a`${this.emptyStateAccount()}`:a`${this.emptyStateActivity()}`}templateLoading(){return this.page==="activity"?Array(tt).fill(a` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t):null}onReceiveClick(){V.push("WalletReceive")}createPaginationObserver(){let{projectId:t}=F.state;this.paginationObserver=new IntersectionObserver(([i])=>{i?.isIntersecting&&!this.loading&&(h.fetchTransactions(j.getPlainAddress(this.caipAddress)),U.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:j.getPlainAddress(this.caipAddress),projectId:t,cursor:this.next,isSmartAccount:G(R.state.activeChain)===P.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();let t=this.shadowRoot?.querySelector(`#${N}`);t&&this.paginationObserver?.observe(t)}getTransactionListItemProps(t){let i=W.formatDate(t?.metadata?.minedAt),o=_.getTransactionDescriptions(t),s=t?.transfers,e=t?.transfers?.[0],n=!!e&&t?.transfers?.every(g=>!!g.nft_info),c=_.getTransactionImages(s);return{date:i,direction:e?.direction,descriptions:o,isAllNFT:n,images:c,status:t.metadata?.status,transfers:s,type:t.metadata?.operationType}}};b.styles=q;D([d()],b.prototype,"page",void 0);D([O()],b.prototype,"caipAddress",void 0);D([O()],b.prototype,"transactionsByYear",void 0);D([O()],b.prototype,"loading",void 0);D([O()],b.prototype,"empty",void 0);D([O()],b.prototype,"next",void 0);b=D([C("w3m-activity-list")],b);
