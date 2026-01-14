import{a as Y}from"./chunk-B2LU4KHT.js";import{r as x,v as T,y as z,z as y}from"./chunk-RZQOM5QR.js";import{a as d,b as k}from"./chunk-IDZGCU4F.js";import{e as n,k as w}from"./chunk-ZS2R6O6N.js";import{$ as m,B as _,C as U,H as N,O as F,S as B,X as W,ga as R,i as E}from"./chunk-OXOEMY67.js";import{i as c,k as p,o as u}from"./chunk-JY5TIRRF.js";c();u();p();c();u();p();c();u();p();c();u();p();var j;(function(e){e.approve="approved",e.bought="bought",e.borrow="borrowed",e.burn="burnt",e.cancel="canceled",e.claim="claimed",e.deploy="deployed",e.deposit="deposited",e.execute="executed",e.mint="minted",e.receive="received",e.repay="repaid",e.send="sent",e.sell="sold",e.stake="staked",e.trade="swapped",e.unstake="unstaked",e.withdraw="withdrawn"})(j||(j={}));c();u();p();c();u();p();var V=x`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px ${({tokens:e})=>e.core.glass010};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  :host([data-no-images='true']) > wui-flex {
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[3]} !important;
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

  .swap-fallback-container {
    position: absolute;
    inset: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swap-fallback-container.first {
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-fallback-container.last {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }

  wui-flex.status-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
    border-radius: ${({borderRadius:e})=>e[4]};
    background-color: ${({tokens:e})=>e.theme.backgroundPrimary};
    box-shadow: 0 0 0 2px ${({tokens:e})=>e.theme.backgroundPrimary};
    overflow: hidden;
    width: 16px;
    height: 16px;
  }
`;var C=function(e,t,i,o){var s=arguments.length,r=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(r=(s<3?a(r):s>3?a(t,i,r):a(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r},b=class extends w{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""},this.failedImageUrls=new Set}handleImageError(t){return i=>{i.stopPropagation(),this.failedImageUrls.add(t),this.requestUpdate()}}render(){let[t,i]=this.images;this.images.length||(this.dataset.noImages="true");let o=t?.type==="NFT",s=i?.url?i.type==="NFT":o,r=o?"var(--apkt-borderRadius-3)":"var(--apkt-borderRadius-5)",a=s?"var(--apkt-borderRadius-3)":"var(--apkt-borderRadius-5)";return this.style.cssText=`
    --local-left-border-radius: ${r};
    --local-right-border-radius: ${a};
    `,n`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){let[t,i]=this.images;return this.images.length===2&&(t?.url||i?.url)?this.renderSwapImages(t,i):t?.url&&!this.failedImageUrls.has(t.url)?this.renderSingleImage(t):t?.type==="NFT"?this.renderPlaceholderIcon("nftPlaceholder"):this.renderPlaceholderIcon("coinPlaceholder")}renderSwapImages(t,i){return n`<div class="swap-images-container">
      ${t?.url?this.renderImageOrFallback(t,"first",!0):null}
      ${i?.url?this.renderImageOrFallback(i,"last",!0):null}
    </div>`}renderSingleImage(t){return this.renderImageOrFallback(t,void 0,!1)}renderImageOrFallback(t,i,o=!1){return t.url?this.failedImageUrls.has(t.url)?o&&i?this.renderFallbackIconInContainer(i):this.renderFallbackIcon():n`<wui-image
      src=${t.url}
      alt="Transaction image"
      @onLoadError=${this.handleImageError(t.url)}
    ></wui-image>`:null}renderFallbackIconInContainer(t){return n`<div class="swap-fallback-container ${t}">${this.renderFallbackIcon()}</div>`}renderFallbackIcon(){return n`<wui-icon
      size="xl"
      weight="regular"
      color="default"
      name="networkPlaceholder"
    ></wui-icon>`}renderPlaceholderIcon(t){return n`<wui-icon size="xl" weight="regular" color="default" name=${t}></wui-icon>`}templateIcon(){let t="accent-primary",i;return i=this.getIcon(),this.status&&(t=this.getStatusColor()),i?n`
      <wui-flex alignItems="center" justifyContent="center" class="status-box">
        <wui-icon-box size="sm" color=${t} icon=${i}></wui-icon-box>
      </wui-flex>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():this.type==="trade"?"swapHorizontal":this.type==="approve"?"checkmark":this.type==="cancel"?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success";case"failed":return"error";case"pending":return"inverse";default:return"accent-primary"}}};b.styles=[V];C([d()],b.prototype,"type",void 0);C([d()],b.prototype,"status",void 0);C([d()],b.prototype,"direction",void 0);C([d({type:Boolean})],b.prototype,"onlyDirectionIcon",void 0);C([d({type:Array})],b.prototype,"images",void 0);C([d({type:Object})],b.prototype,"secondImage",void 0);C([k()],b.prototype,"failedImageUrls",void 0);b=C([y("wui-transaction-visual")],b);c();u();p();var G=x`
  :host {
    width: 100%;
  }

  :host > wui-flex:first-child {
    align-items: center;
    column-gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[1]} ${({spacing:e})=>e[2]};
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
`;var O=function(e,t,i,o){var s=arguments.length,r=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(r=(s<3?a(r):s>3?a(t,i,r):a(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r},v=class extends w{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[]}render(){return n`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${Y(this.direction)}
          type=${this.type}
          .onlyDirectionIcon=${this.onlyDirectionIcon}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="1">
          <wui-text variant="lg-medium" color="primary">
            ${j[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="sm-medium" color="secondary"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){let t=this.descriptions?.[0];return t?n`
          <wui-text variant="md-regular" color="secondary">
            <span>${t}</span>
          </wui-text>
        `:null}templateSecondDescription(){let t=this.descriptions?.[1];return t?n`
          <wui-icon class="description-separator-icon" size="sm" name="arrowRight"></wui-icon>
          <wui-text variant="md-regular" color="secondary">
            <span>${t}</span>
          </wui-text>
        `:null}};v.styles=[T,G];O([d()],v.prototype,"type",void 0);O([d({type:Array})],v.prototype,"descriptions",void 0);O([d()],v.prototype,"date",void 0);O([d({type:Boolean})],v.prototype,"onlyDirectionIcon",void 0);O([d()],v.prototype,"status",void 0);O([d()],v.prototype,"direction",void 0);O([d({type:Array})],v.prototype,"images",void 0);v=O([y("wui-transaction-list-item")],v);c();u();p();c();u();p();c();u();p();c();u();p();var M=x`
  wui-flex {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[128]};
  }

  .fallback-icon {
    color: ${({tokens:e})=>e.theme.iconInverse};
    border-radius: ${({borderRadius:e})=>e[3]};
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
  }

  .direction-icon,
  .status-image {
    position: absolute;
    right: 0;
    bottom: 0;
    border-radius: ${({borderRadius:e})=>e[128]};
    border: 2px solid ${({tokens:e})=>e.theme.backgroundPrimary};
  }

  .direction-icon {
    padding: ${({spacing:e})=>e["01"]};
    color: ${({tokens:e})=>e.core.iconSuccess};

    background-color: color-mix(
      in srgb,
      ${({tokens:e})=>e.core.textSuccess} 30%,
      ${({tokens:e})=>e.theme.backgroundPrimary} 70%
    );
  }

  /* -- Sizes --------------------------------------------------- */
  :host([data-size='sm']) > wui-image:not(.status-image),
  :host([data-size='sm']) > wui-flex {
    width: 24px;
    height: 24px;
  }

  :host([data-size='lg']) > wui-image:not(.status-image),
  :host([data-size='lg']) > wui-flex {
    width: 40px;
    height: 40px;
  }

  :host([data-size='sm']) .fallback-icon {
    height: 16px;
    width: 16px;
    padding: ${({spacing:e})=>e[1]};
  }

  :host([data-size='lg']) .fallback-icon {
    height: 32px;
    width: 32px;
    padding: ${({spacing:e})=>e[1]};
  }

  :host([data-size='sm']) .direction-icon,
  :host([data-size='sm']) .status-image {
    transform: translate(40%, 30%);
  }

  :host([data-size='lg']) .direction-icon,
  :host([data-size='lg']) .status-image {
    transform: translate(40%, 10%);
  }

  :host([data-size='sm']) .status-image {
    height: 14px;
    width: 14px;
  }

  :host([data-size='lg']) .status-image {
    height: 20px;
    width: 20px;
  }

  /* -- Crop effects --------------------------------------------------- */
  .swap-crop-left-image,
  .swap-crop-right-image {
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .swap-crop-left-image {
    left: 0;
    clip-path: inset(0px calc(50% + 1.5px) 0px 0%);
  }

  .swap-crop-right-image {
    right: 0;
    clip-path: inset(0px 0px 0px calc(50% + 1.5px));
  }
`;var S=function(e,t,i,o){var s=arguments.length,r=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(r=(s<3?a(r):s>3?a(t,i,r):a(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r},L={sm:"xxs",lg:"md"},A=class extends w{constructor(){super(...arguments),this.type="approve",this.size="lg",this.statusImageUrl="",this.images=[]}render(){return n`<wui-flex>${this.templateVisual()} ${this.templateIcon()}</wui-flex>`}templateVisual(){switch(this.dataset.size=this.size,this.type){case"trade":return this.swapTemplate();case"fiat":return this.fiatTemplate();case"unknown":return this.unknownTemplate();default:return this.tokenTemplate()}}swapTemplate(){let[t,i]=this.images;return this.images.length===2&&(t||i)?n`
        <wui-image class="swap-crop-left-image" src=${t} alt="Swap image"></wui-image>
        <wui-image class="swap-crop-right-image" src=${i} alt="Swap image"></wui-image>
      `:t?n`<wui-image src=${t} alt="Swap image"></wui-image>`:null}fiatTemplate(){return n`<wui-icon
      class="fallback-icon"
      size=${L[this.size]}
      name="dollar"
    ></wui-icon>`}unknownTemplate(){return n`<wui-icon
      class="fallback-icon"
      size=${L[this.size]}
      name="questionMark"
    ></wui-icon>`}tokenTemplate(){let[t]=this.images;return t?n`<wui-image src=${t} alt="Token image"></wui-image> `:n`<wui-icon
      class="fallback-icon"
      name=${this.type==="nft"?"image":"coinPlaceholder"}
    ></wui-icon>`}templateIcon(){return this.statusImageUrl?n`<wui-image
        class="status-image"
        src=${this.statusImageUrl}
        alt="Status image"
      ></wui-image>`:n`<wui-icon
      class="direction-icon"
      size=${L[this.size]}
      name=${this.getTemplateIcon()}
    ></wui-icon>`}getTemplateIcon(){return this.type==="trade"?"arrowClockWise":"arrowBottom"}};A.styles=[M];S([d()],A.prototype,"type",void 0);S([d()],A.prototype,"size",void 0);S([d()],A.prototype,"statusImageUrl",void 0);S([d({type:Array})],A.prototype,"images",void 0);A=S([y("wui-transaction-thumbnail")],A);c();u();p();var K=x`
  :host > wui-flex:first-child {
    gap: ${({spacing:e})=>e[2]};
    padding: ${({spacing:e})=>e[3]};
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`;var Q=function(e,t,i,o){var s=arguments.length,r=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(r=(s<3?a(r):s>3?a(t,i,r):a(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r},P=class extends w{render(){return n`
      <wui-flex alignItems="center" .padding=${["1","2","1","2"]}>
        <wui-shimmer width="40px" height="40px" rounded></wui-shimmer>
        <wui-flex flexDirection="column" gap="1">
          <wui-shimmer width="124px" height="16px" rounded></wui-shimmer>
          <wui-shimmer width="60px" height="14px" rounded></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" rounded></wui-shimmer>
      </wui-flex>
    `}};P.styles=[T,K];P=Q([y("wui-transaction-list-item-loader")],P);c();u();p();var q=x`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: ${({spacing:e})=>e[3]};
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:e})=>e[3]};
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`;var D=function(e,t,i,o){var s=arguments.length,r=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(e,t,i,o);else for(var l=e.length-1;l>=0;l--)(a=e[l])&&(r=(s<3?a(r):s>3?a(t,i,r):a(t,i))||r);return s>3&&r&&Object.defineProperty(t,i,r),r},H="last-transaction",X=7,I=class extends w{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=R.state.activeCaipAddress,this.transactionsByYear=m.state.transactionsByYear,this.loading=m.state.loading,this.empty=m.state.empty,this.next=m.state.next,m.clearCursor(),this.unsubscribe.push(R.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(m.resetTransactions(),m.fetchTransactions(t)),this.caipAddress=t}),R.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),m.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return n` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){m.resetTransactions(),this.caipAddress&&m.fetchTransactions(_.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(i=>{let o=parseInt(i,10),s=new Array(12).fill(null).map((r,a)=>{let l=z.getTransactionGroupTitle(o,a),$=this.transactionsByYear[o]?.[a];return{groupTitle:l,transactions:$}}).filter(({transactions:r})=>r).reverse();return s.map(({groupTitle:r,transactions:a},l)=>{let $=l===s.length-1;return a?n`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${$?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["2","3","3","3"]}
            >
              <wui-text variant="md-medium" color="secondary" data-testid="group-title">
                ${r}
              </wui-text>
            </wui-flex>
            <wui-flex flexDirection="column" gap="2">
              ${this.templateTransactions(a,$)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,i){let{date:o,descriptions:s,direction:r,images:a,status:l,type:$,transfers:Z,isAllNFT:J}=this.getTransactionListItemProps(t);return n`
      <wui-transaction-list-item
        date=${o}
        .direction=${r}
        id=${i&&this.next?H:""}
        status=${l}
        type=${$}
        .images=${a}
        .onlyDirectionIcon=${J||Z.length===1}
        .descriptions=${s}
      ></wui-transaction-list-item>
    `}templateTransactions(t,i){return t.map((o,s)=>{let r=i&&s===t.length-1;return n`${this.templateRenderTransaction(o,r)}`})}emptyStateActivity(){return n`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["10","5","10","5"]}
      gap="5"
      data-testid="empty-activity-state"
    >
      <wui-icon-box color="default" icon="wallet" size="xl"></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="2">
        <wui-text align="center" variant="lg-medium" color="primary">No Transactions yet</wui-text>
        <wui-text align="center" variant="lg-regular" color="secondary"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return n`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="4"
      data-testid="empty-account-state"
    >
      <wui-icon-box icon="swapHorizontal" size="lg" color="default"></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="2"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="md-regular" align="center" color="primary">No activity yet</wui-text>
        <wui-text variant="sm-regular" align="center" color="secondary"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return this.page==="account"?n`${this.emptyStateAccount()}`:n`${this.emptyStateActivity()}`}templateLoading(){return this.page==="activity"?n` <wui-flex flexDirection="column" width="100%">
        <wui-flex .padding=${["2","3","3","3"]}>
          <wui-shimmer width="70px" height="16px" rounded></wui-shimmer>
        </wui-flex>
        <wui-flex flexDirection="column" gap="2" width="100%">
          ${Array(X).fill(n` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t)}
        </wui-flex>
      </wui-flex>`:null}onReceiveClick(){B.push("WalletReceive")}createPaginationObserver(){let{projectId:t}=N.state;this.paginationObserver=new IntersectionObserver(([i])=>{i?.isIntersecting&&!this.loading&&(m.fetchTransactions(_.getPlainAddress(this.caipAddress)),F.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:_.getPlainAddress(this.caipAddress),projectId:t,cursor:this.next,isSmartAccount:W(R.state.activeChain)===U.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();let t=this.shadowRoot?.querySelector(`#${H}`);t&&this.paginationObserver?.observe(t)}getTransactionListItemProps(t){let i=E.formatDate(t?.metadata?.minedAt),o=z.mergeTransfers(t?.transfers||[]),s=z.getTransactionDescriptions(t,o),r=o?.[0],a=!!r&&o?.every($=>!!$.nft_info),l=z.getTransactionImages(o);return{date:i,direction:r?.direction,descriptions:s,isAllNFT:a,images:l,status:t.metadata?.status,transfers:o,type:t.metadata?.operationType}}};I.styles=q;D([d()],I.prototype,"page",void 0);D([k()],I.prototype,"caipAddress",void 0);D([k()],I.prototype,"transactionsByYear",void 0);D([k()],I.prototype,"loading",void 0);D([k()],I.prototype,"empty",void 0);D([k()],I.prototype,"next",void 0);I=D([y("w3m-activity-list")],I);
