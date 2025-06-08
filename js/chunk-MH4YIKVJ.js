import{a,e as $,f as C}from"./chunk-G6MGL5IE.js";import{U as u,W as z,X as m,Z as y}from"./chunk-AXPE5NAX.js";import{b as h,e as w,j as v}from"./chunk-WGWCH7J2.js";var k=h`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var c=function(e,t,o,n){var l=arguments.length,i=l<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(l<3?s(i):l>3?s(t,o,i):s(t,o))||i);return l>3&&i&&Object.defineProperty(t,o,i),i},r=class extends v{render(){return this.style.cssText=`
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
      padding-top: ${this.padding&&m.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&m.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&m.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&m.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&m.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&m.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&m.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&m.getSpacingStyles(this.margin,3)};
    `,w`<slot></slot>`}};r.styles=[u,k];c([a()],r.prototype,"flexDirection",void 0);c([a()],r.prototype,"flexWrap",void 0);c([a()],r.prototype,"flexBasis",void 0);c([a()],r.prototype,"flexGrow",void 0);c([a()],r.prototype,"flexShrink",void 0);c([a()],r.prototype,"alignItems",void 0);c([a()],r.prototype,"justifyContent",void 0);c([a()],r.prototype,"columnGap",void 0);c([a()],r.prototype,"rowGap",void 0);c([a()],r.prototype,"gap",void 0);c([a()],r.prototype,"padding",void 0);c([a()],r.prototype,"margin",void 0);r=c([y("wui-flex")],r);var B=h`
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
`;var d=function(e,t,o,n){var l=arguments.length,i=l<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(l<3?s(i):l>3?s(t,o,i):s(t,o))||i);return l>3&&i&&Object.defineProperty(t,o,i),i},g=class extends v{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){let t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `,w`<slot class=${C(t)}></slot>`}};g.styles=[u,B];d([a()],g.prototype,"variant",void 0);d([a()],g.prototype,"color",void 0);d([a()],g.prototype,"align",void 0);d([a()],g.prototype,"lineClamp",void 0);g=d([y("wui-text")],g);var b=class{constructor(){this.cache=new Map}set(t,o){this.cache.set(t,o)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},x=new b;var R=h`
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
`;var S=function(e,t,o,n){var l=arguments.length,i=l<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(l<3?s(i):l>3?s(t,o,i):s(t,o))||i);return l>3&&i&&Object.defineProperty(t,o,i),i},P={add:async()=>(await import("./add-TAV7EBAJ.js")).addSvg,allWallets:async()=>(await import("./all-wallets-BQ7BPORW.js")).allWalletsSvg,arrowBottomCircle:async()=>(await import("./arrow-bottom-circle-B6KXNJUB.js")).arrowBottomCircleSvg,appStore:async()=>(await import("./app-store-AB3OWBR2.js")).appStoreSvg,apple:async()=>(await import("./apple-MKNZTZXQ.js")).appleSvg,arrowBottom:async()=>(await import("./arrow-bottom-VD3X5I2R.js")).arrowBottomSvg,arrowLeft:async()=>(await import("./arrow-left-NUPHWTKE.js")).arrowLeftSvg,arrowRight:async()=>(await import("./arrow-right-DGO4Y5MJ.js")).arrowRightSvg,arrowTop:async()=>(await import("./arrow-top-LJLNSHMY.js")).arrowTopSvg,bank:async()=>(await import("./bank-RKYBFYX7.js")).bankSvg,browser:async()=>(await import("./browser-4KUW25JQ.js")).browserSvg,card:async()=>(await import("./card-CJ2O6GZC.js")).cardSvg,checkmark:async()=>(await import("./checkmark-K2T4P4V6.js")).checkmarkSvg,checkmarkBold:async()=>(await import("./checkmark-bold-TZUNBFW3.js")).checkmarkBoldSvg,chevronBottom:async()=>(await import("./chevron-bottom-L2ZG6UW7.js")).chevronBottomSvg,chevronLeft:async()=>(await import("./chevron-left-7VOMTZRG.js")).chevronLeftSvg,chevronRight:async()=>(await import("./chevron-right-KK4I5NCC.js")).chevronRightSvg,chevronTop:async()=>(await import("./chevron-top-R6TPWR4Q.js")).chevronTopSvg,chromeStore:async()=>(await import("./chrome-store-QF3Y2LKP.js")).chromeStoreSvg,clock:async()=>(await import("./clock-TH5NCIEX.js")).clockSvg,close:async()=>(await import("./close-KJYDSRV4.js")).closeSvg,compass:async()=>(await import("./compass-AQPWOO4C.js")).compassSvg,coinPlaceholder:async()=>(await import("./coinPlaceholder-ESSWSBB7.js")).coinPlaceholderSvg,copy:async()=>(await import("./copy-46OEV4DB.js")).copySvg,cursor:async()=>(await import("./cursor-N2NAJ6CL.js")).cursorSvg,cursorTransparent:async()=>(await import("./cursor-transparent-NFJHOCGY.js")).cursorTransparentSvg,desktop:async()=>(await import("./desktop-VTYXI7FA.js")).desktopSvg,disconnect:async()=>(await import("./disconnect-H2JTZFQR.js")).disconnectSvg,discord:async()=>(await import("./discord-2ZL3GSHE.js")).discordSvg,etherscan:async()=>(await import("./etherscan-WWJFPPN4.js")).etherscanSvg,extension:async()=>(await import("./extension-T3QXQXR5.js")).extensionSvg,externalLink:async()=>(await import("./external-link-UKGYS2UJ.js")).externalLinkSvg,facebook:async()=>(await import("./facebook-F36RF6P3.js")).facebookSvg,farcaster:async()=>(await import("./farcaster-HVVIZXTW.js")).farcasterSvg,filters:async()=>(await import("./filters-F5UXJS7B.js")).filtersSvg,github:async()=>(await import("./github-UG2YDNFI.js")).githubSvg,google:async()=>(await import("./google-HMCFU7LR.js")).googleSvg,helpCircle:async()=>(await import("./help-circle-ARS4QUFG.js")).helpCircleSvg,image:async()=>(await import("./image-AXUSAEF4.js")).imageSvg,id:async()=>(await import("./id-YXKTZ5RP.js")).idSvg,infoCircle:async()=>(await import("./info-circle-Y2OOVQCT.js")).infoCircleSvg,lightbulb:async()=>(await import("./lightbulb-4HFBQ67D.js")).lightbulbSvg,mail:async()=>(await import("./mail-S72KQIR4.js")).mailSvg,mobile:async()=>(await import("./mobile-TS7AGID2.js")).mobileSvg,more:async()=>(await import("./more-XVYOX76H.js")).moreSvg,networkPlaceholder:async()=>(await import("./network-placeholder-OYTV6ZFO.js")).networkPlaceholderSvg,nftPlaceholder:async()=>(await import("./nftPlaceholder-HEHQBX6D.js")).nftPlaceholderSvg,off:async()=>(await import("./off-67JT4OXQ.js")).offSvg,playStore:async()=>(await import("./play-store-DLBYMPLQ.js")).playStoreSvg,plus:async()=>(await import("./plus-5GXHYJN7.js")).plusSvg,qrCode:async()=>(await import("./qr-code-RLZ3OMH7.js")).qrCodeIcon,recycleHorizontal:async()=>(await import("./recycle-horizontal-A2VLICE3.js")).recycleHorizontalSvg,refresh:async()=>(await import("./refresh-EINGJD2K.js")).refreshSvg,search:async()=>(await import("./search-5URV2GYD.js")).searchSvg,send:async()=>(await import("./send-6OG67CHY.js")).sendSvg,swapHorizontal:async()=>(await import("./swapHorizontal-V4KOGLMY.js")).swapHorizontalSvg,swapHorizontalMedium:async()=>(await import("./swapHorizontalMedium-4HAXFYBU.js")).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await import("./swapHorizontalBold-4Q2KTHVS.js")).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await import("./swapHorizontalRoundedBold-67QHEJLB.js")).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await import("./swapVertical-AE2L64FA.js")).swapVerticalSvg,telegram:async()=>(await import("./telegram-ZWC5HV2X.js")).telegramSvg,threeDots:async()=>(await import("./three-dots-PVZDL2EL.js")).threeDotsSvg,twitch:async()=>(await import("./twitch-75XW2LKN.js")).twitchSvg,twitter:async()=>(await import("./x-TXJCF5DM.js")).xSvg,twitterIcon:async()=>(await import("./twitterIcon-ES75HEUD.js")).twitterIconSvg,verify:async()=>(await import("./verify-E3SWCC7K.js")).verifySvg,verifyFilled:async()=>(await import("./verify-filled-42RI3RYK.js")).verifyFilledSvg,wallet:async()=>(await import("./wallet-5O2T6Q6Y.js")).walletSvg,walletConnect:async()=>(await import("./walletconnect-ZKUEIHHP.js")).walletConnectSvg,walletConnectLightBrown:async()=>(await import("./walletconnect-ZKUEIHHP.js")).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await import("./walletconnect-ZKUEIHHP.js")).walletConnectBrownSvg,walletPlaceholder:async()=>(await import("./wallet-placeholder-Q2JCIVHQ.js")).walletPlaceholderSvg,warningCircle:async()=>(await import("./warning-circle-IOQN2XT5.js")).warningCircleSvg,x:async()=>(await import("./x-TXJCF5DM.js")).xSvg,info:async()=>(await import("./info-3SMARAJM.js")).infoSvg,exclamationTriangle:async()=>(await import("./exclamation-triangle-DLIO4XWQ.js")).exclamationTriangleSvg,reown:async()=>(await import("./reown-logo-MRINQJXH.js")).reownSvg};async function j(e){if(x.has(e))return x.get(e);let o=(P[e]??P.copy)();return x.set(e,o),o}var f=class extends v{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,w`${$(j(this.name),w`<div class="fallback"></div>`)}`}};f.styles=[u,z,R];S([a()],f.prototype,"size",void 0);S([a()],f.prototype,"name",void 0);S([a()],f.prototype,"color",void 0);S([a()],f.prototype,"aspectRatio",void 0);f=S([y("wui-icon")],f);
