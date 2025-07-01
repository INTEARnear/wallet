import{a,e as j,f as T}from"./chunk-HILJYRBB.js";import{U as z,W as P,X as f,Z as $}from"./chunk-UDTBWQKV.js";import{b as x,e as y,j as b}from"./chunk-5RP2GFJC.js";import{h as r,j as n,n as l}from"./chunk-KGCAX4NX.js";r();l();n();r();l();n();r();l();n();var _=x`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var w=function(e,t,o,c){var p=arguments.length,i=p<3?t:c===null?c=Object.getOwnPropertyDescriptor(t,o):c,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,c);else for(var g=e.length-1;g>=0;g--)(m=e[g])&&(i=(p<3?m(i):p>3?m(t,o,i):m(t,o))||i);return p>3&&i&&Object.defineProperty(t,o,i),i},s=class extends b{render(){return this.style.cssText=`
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&f.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&f.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&f.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&f.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&f.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&f.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&f.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&f.getSpacingStyles(this.margin,3)};
    `,y`<slot></slot>`}};s.styles=[z,_];w([a()],s.prototype,"flexDirection",void 0);w([a()],s.prototype,"flexWrap",void 0);w([a()],s.prototype,"flexBasis",void 0);w([a()],s.prototype,"flexGrow",void 0);w([a()],s.prototype,"flexShrink",void 0);w([a()],s.prototype,"alignItems",void 0);w([a()],s.prototype,"justifyContent",void 0);w([a()],s.prototype,"columnGap",void 0);w([a()],s.prototype,"rowGap",void 0);w([a()],s.prototype,"gap",void 0);w([a()],s.prototype,"padding",void 0);w([a()],s.prototype,"margin",void 0);s=w([$("wui-flex")],s);r();l();n();r();l();n();r();l();n();var H=x`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`;var C=function(e,t,o,c){var p=arguments.length,i=p<3?t:c===null?c=Object.getOwnPropertyDescriptor(t,o):c,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,c);else for(var g=e.length-1;g>=0;g--)(m=e[g])&&(i=(p<3?m(i):p>3?m(t,o,i):m(t,o))||i);return p>3&&i&&Object.defineProperty(t,o,i),i},d=class extends b{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){let t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `,y`<slot class=${T(t)}></slot>`}};d.styles=[z,H];C([a()],d.prototype,"variant",void 0);C([a()],d.prototype,"color",void 0);C([a()],d.prototype,"align",void 0);C([a()],d.prototype,"lineClamp",void 0);d=C([$("wui-text")],d);r();l();n();r();l();n();var R=class{constructor(){this.cache=new Map}set(t,o){this.cache.set(t,o)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},B=new R;r();l();n();var L=x`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`;var k=function(e,t,o,c){var p=arguments.length,i=p<3?t:c===null?c=Object.getOwnPropertyDescriptor(t,o):c,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,c);else for(var g=e.length-1;g>=0;g--)(m=e[g])&&(i=(p<3?m(i):p>3?m(t,o,i):m(t,o))||i);return p>3&&i&&Object.defineProperty(t,o,i),i},O={add:async()=>(await import("./add-4Z33MTJU.js")).addSvg,allWallets:async()=>(await import("./all-wallets-A33UW4EC.js")).allWalletsSvg,arrowBottomCircle:async()=>(await import("./arrow-bottom-circle-7JFKVGMI.js")).arrowBottomCircleSvg,appStore:async()=>(await import("./app-store-GW4S7UOC.js")).appStoreSvg,apple:async()=>(await import("./apple-ED5QEQ25.js")).appleSvg,arrowBottom:async()=>(await import("./arrow-bottom-GUL22ENC.js")).arrowBottomSvg,arrowLeft:async()=>(await import("./arrow-left-HUUSI6XS.js")).arrowLeftSvg,arrowRight:async()=>(await import("./arrow-right-DBI4D2BR.js")).arrowRightSvg,arrowTop:async()=>(await import("./arrow-top-LNXYEARI.js")).arrowTopSvg,bank:async()=>(await import("./bank-THLWACFX.js")).bankSvg,browser:async()=>(await import("./browser-J735P2B6.js")).browserSvg,card:async()=>(await import("./card-O3G63CVT.js")).cardSvg,checkmark:async()=>(await import("./checkmark-DTNWSDTT.js")).checkmarkSvg,checkmarkBold:async()=>(await import("./checkmark-bold-BXLHIUWJ.js")).checkmarkBoldSvg,chevronBottom:async()=>(await import("./chevron-bottom-LMJLXGWB.js")).chevronBottomSvg,chevronLeft:async()=>(await import("./chevron-left-PGMRHJBN.js")).chevronLeftSvg,chevronRight:async()=>(await import("./chevron-right-CCTHKKJ6.js")).chevronRightSvg,chevronTop:async()=>(await import("./chevron-top-J7VRNDU2.js")).chevronTopSvg,chromeStore:async()=>(await import("./chrome-store-VIUD2Y4L.js")).chromeStoreSvg,clock:async()=>(await import("./clock-QAUZL7TQ.js")).clockSvg,close:async()=>(await import("./close-UP67FN76.js")).closeSvg,compass:async()=>(await import("./compass-CHTCYWSO.js")).compassSvg,coinPlaceholder:async()=>(await import("./coinPlaceholder-4DIV4OCT.js")).coinPlaceholderSvg,copy:async()=>(await import("./copy-AUIRWG4Z.js")).copySvg,cursor:async()=>(await import("./cursor-IZVPBQZ4.js")).cursorSvg,cursorTransparent:async()=>(await import("./cursor-transparent-DCXKE2SJ.js")).cursorTransparentSvg,desktop:async()=>(await import("./desktop-G7REKGAJ.js")).desktopSvg,disconnect:async()=>(await import("./disconnect-HO5MFRPU.js")).disconnectSvg,discord:async()=>(await import("./discord-DMXJVKDO.js")).discordSvg,etherscan:async()=>(await import("./etherscan-WM6WI2LD.js")).etherscanSvg,extension:async()=>(await import("./extension-MWQT7VNY.js")).extensionSvg,externalLink:async()=>(await import("./external-link-XHQQVGBX.js")).externalLinkSvg,facebook:async()=>(await import("./facebook-5EBO5EMR.js")).facebookSvg,farcaster:async()=>(await import("./farcaster-QA5UOLE4.js")).farcasterSvg,filters:async()=>(await import("./filters-NY4IB2I2.js")).filtersSvg,github:async()=>(await import("./github-62Z7DMCZ.js")).githubSvg,google:async()=>(await import("./google-PVDQYHBM.js")).googleSvg,helpCircle:async()=>(await import("./help-circle-VO2AUAO6.js")).helpCircleSvg,image:async()=>(await import("./image-SKOSBD7F.js")).imageSvg,id:async()=>(await import("./id-MGOWQQ46.js")).idSvg,infoCircle:async()=>(await import("./info-circle-62T7IZ6N.js")).infoCircleSvg,lightbulb:async()=>(await import("./lightbulb-YNRSWEJV.js")).lightbulbSvg,mail:async()=>(await import("./mail-WIRCNXXR.js")).mailSvg,mobile:async()=>(await import("./mobile-AVJD6KCU.js")).mobileSvg,more:async()=>(await import("./more-SUPS4Q3Q.js")).moreSvg,networkPlaceholder:async()=>(await import("./network-placeholder-STEEOIQY.js")).networkPlaceholderSvg,nftPlaceholder:async()=>(await import("./nftPlaceholder-XTR5N4BY.js")).nftPlaceholderSvg,off:async()=>(await import("./off-FT654OND.js")).offSvg,playStore:async()=>(await import("./play-store-ADR3ICRZ.js")).playStoreSvg,plus:async()=>(await import("./plus-BCZM5RVD.js")).plusSvg,qrCode:async()=>(await import("./qr-code-XMGLQBLD.js")).qrCodeIcon,recycleHorizontal:async()=>(await import("./recycle-horizontal-NEZT2Y47.js")).recycleHorizontalSvg,refresh:async()=>(await import("./refresh-G3W6GQ4K.js")).refreshSvg,search:async()=>(await import("./search-CKILOS3W.js")).searchSvg,send:async()=>(await import("./send-VHQTUPES.js")).sendSvg,swapHorizontal:async()=>(await import("./swapHorizontal-2GNTN2CL.js")).swapHorizontalSvg,swapHorizontalMedium:async()=>(await import("./swapHorizontalMedium-BIMLHDEI.js")).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await import("./swapHorizontalBold-ISJV6WPU.js")).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await import("./swapHorizontalRoundedBold-OJ2N52GF.js")).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await import("./swapVertical-ELTWAPEA.js")).swapVerticalSvg,telegram:async()=>(await import("./telegram-TCFLOJVE.js")).telegramSvg,threeDots:async()=>(await import("./three-dots-MTVEMZVK.js")).threeDotsSvg,twitch:async()=>(await import("./twitch-D3M2XAB4.js")).twitchSvg,twitter:async()=>(await import("./x-B6ANQDOF.js")).xSvg,twitterIcon:async()=>(await import("./twitterIcon-4TRJKAH5.js")).twitterIconSvg,verify:async()=>(await import("./verify-HDNZKHET.js")).verifySvg,verifyFilled:async()=>(await import("./verify-filled-6JZFIEV4.js")).verifyFilledSvg,wallet:async()=>(await import("./wallet-JPZ5JRSI.js")).walletSvg,walletConnect:async()=>(await import("./walletconnect-5VSD4G47.js")).walletConnectSvg,walletConnectLightBrown:async()=>(await import("./walletconnect-5VSD4G47.js")).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await import("./walletconnect-5VSD4G47.js")).walletConnectBrownSvg,walletPlaceholder:async()=>(await import("./wallet-placeholder-OFD3ECKR.js")).walletPlaceholderSvg,warningCircle:async()=>(await import("./warning-circle-NTSZPN7E.js")).warningCircleSvg,x:async()=>(await import("./x-B6ANQDOF.js")).xSvg,info:async()=>(await import("./info-4LIPHRZM.js")).infoSvg,exclamationTriangle:async()=>(await import("./exclamation-triangle-GZOQFA6X.js")).exclamationTriangleSvg,reown:async()=>(await import("./reown-logo-SI6ZKGWN.js")).reownSvg};async function W(e){if(B.has(e))return B.get(e);let o=(O[e]??O.copy)();return B.set(e,o),o}var S=class extends b{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,y`${j(W(this.name),y`<div class="fallback"></div>`)}`}};S.styles=[z,P,L];k([a()],S.prototype,"size",void 0);k([a()],S.prototype,"name",void 0);k([a()],S.prototype,"color",void 0);k([a()],S.prototype,"aspectRatio",void 0);S=k([$("wui-icon")],S);
