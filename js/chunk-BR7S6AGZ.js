import{c as $,e as E,f as v,h as C}from"./chunk-LTN6YROF.js";import{a as D,b as I}from"./chunk-N3PRX6SH.js";import{a as s,d as H,f as L}from"./chunk-IDZGCU4F.js";import{b as x,e as y,h as G,k as b}from"./chunk-ZS2R6O6N.js";import{i as e,k as r,o as n}from"./chunk-JY5TIRRF.js";e();n();r();e();n();r();e();n();r();var F=x`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var g=function(o,t,i,l){var p=arguments.length,a=p<3?t:l===null?l=Object.getOwnPropertyDescriptor(t,i):l,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(o,t,i,l);else for(var c=o.length-1;c>=0;c--)(m=o[c])&&(a=(p<3?m(a):p>3?m(t,i,a):m(t,i))||a);return p>3&&a&&Object.defineProperty(t,i,a),a},w=class extends b{render(){return this.style.cssText=`
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
      padding-top: ${this.padding&&v.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&v.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&v.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&v.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&v.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&v.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&v.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&v.getSpacingStyles(this.margin,3)};
    `,y`<slot></slot>`}};w.styles=[$,F];g([s()],w.prototype,"flexDirection",void 0);g([s()],w.prototype,"flexWrap",void 0);g([s()],w.prototype,"flexBasis",void 0);g([s()],w.prototype,"flexGrow",void 0);g([s()],w.prototype,"flexShrink",void 0);g([s()],w.prototype,"alignItems",void 0);g([s()],w.prototype,"justifyContent",void 0);g([s()],w.prototype,"columnGap",void 0);g([s()],w.prototype,"rowGap",void 0);g([s()],w.prototype,"gap",void 0);g([s()],w.prototype,"padding",void 0);g([s()],w.prototype,"margin",void 0);w=g([C("wui-flex")],w);e();n();r();e();n();r();e();n();r();var M=x`
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
  .wui-font-micro-600,
  .wui-font-micro-500 {
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
`;var k=function(o,t,i,l){var p=arguments.length,a=p<3?t:l===null?l=Object.getOwnPropertyDescriptor(t,i):l,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(o,t,i,l);else for(var c=o.length-1;c>=0;c--)(m=o[c])&&(a=(p<3?m(a):p>3?m(t,i,a):m(t,i))||a);return p>3&&a&&Object.defineProperty(t,i,a),a},d=class extends b{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){let t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `,y`<slot class=${L(t)}></slot>`}};d.styles=[$,M];k([s()],d.prototype,"variant",void 0);k([s()],d.prototype,"color",void 0);k([s()],d.prototype,"align",void 0);k([s()],d.prototype,"lineClamp",void 0);d=k([C("wui-text")],d);e();n();r();e();n();r();e();n();r();e();n();r();var R=class{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}},B=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(t=>this.Z=t)}resume(){this.Z?.(),this.Y=this.Z=void 0}};var K=o=>!D(o)&&typeof o.then=="function",X=1073741823,O=class extends I{constructor(){super(...arguments),this._$Cwt=X,this._$Cbt=[],this._$CK=new R(this),this._$CX=new B}render(...t){return t.find(i=>!K(i))??G}update(t,i){let l=this._$Cbt,p=l.length;this._$Cbt=i;let a=this._$CK,m=this._$CX;this.isConnected||this.disconnected();for(let c=0;c<i.length&&!(c>this._$Cwt);c++){let z=i[c];if(!K(z))return this._$Cwt=c,z;c<p&&z===l[c]||(this._$Cwt=X,p=0,Promise.resolve(z).then(async q=>{for(;m.get();)await m.get();let _=a.deref();if(_!==void 0){let T=_._$Cbt.indexOf(z);T>-1&&T<_._$Cwt&&(_._$Cwt=T,_.setValue(q))}}))}return G}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}},Y=H(O);e();n();r();var W=class{constructor(){this.cache=new Map}set(t,i){this.cache.set(t,i)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},j=new W;e();n();r();var Z=x`
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
`;var P=function(o,t,i,l){var p=arguments.length,a=p<3?t:l===null?l=Object.getOwnPropertyDescriptor(t,i):l,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(o,t,i,l);else for(var c=o.length-1;c>=0;c--)(m=o[c])&&(a=(p<3?m(a):p>3?m(t,i,a):m(t,i))||a);return p>3&&a&&Object.defineProperty(t,i,a),a},V={add:async()=>(await import("./add-YZAUWFD7.js")).addSvg,allWallets:async()=>(await import("./all-wallets-NHOY2GCL.js")).allWalletsSvg,arrowBottomCircle:async()=>(await import("./arrow-bottom-circle-3L3D2KPS.js")).arrowBottomCircleSvg,appStore:async()=>(await import("./app-store-3XVOC6M3.js")).appStoreSvg,apple:async()=>(await import("./apple-BM4PMYJL.js")).appleSvg,arrowBottom:async()=>(await import("./arrow-bottom-NUFRYGHQ.js")).arrowBottomSvg,arrowLeft:async()=>(await import("./arrow-left-XFJBBKJP.js")).arrowLeftSvg,arrowRight:async()=>(await import("./arrow-right-HB7V3KVX.js")).arrowRightSvg,arrowTop:async()=>(await import("./arrow-top-QQH3PUOB.js")).arrowTopSvg,bank:async()=>(await import("./bank-GGEXV3HH.js")).bankSvg,browser:async()=>(await import("./browser-7O67QWYZ.js")).browserSvg,bin:async()=>(await import("./bin-LNP3D6EB.js")).binSvg,bitcoin:async()=>(await import("./bitcoin-BKPML4FZ.js")).bitcoinSvg,card:async()=>(await import("./card-GTBUKS6P.js")).cardSvg,checkmark:async()=>(await import("./checkmark-NBWOR6WC.js")).checkmarkSvg,checkmarkBold:async()=>(await import("./checkmark-bold-PSM6UR5A.js")).checkmarkBoldSvg,chevronBottom:async()=>(await import("./chevron-bottom-2HZDUI2R.js")).chevronBottomSvg,chevronLeft:async()=>(await import("./chevron-left-GOOILLUE.js")).chevronLeftSvg,chevronRight:async()=>(await import("./chevron-right-HJ26DU63.js")).chevronRightSvg,chevronTop:async()=>(await import("./chevron-top-GXQHFMGJ.js")).chevronTopSvg,chromeStore:async()=>(await import("./chrome-store-AKK3PVAT.js")).chromeStoreSvg,clock:async()=>(await import("./clock-FWPVKLXB.js")).clockSvg,close:async()=>(await import("./close-JB5KNESW.js")).closeSvg,compass:async()=>(await import("./compass-WOITABWU.js")).compassSvg,coinPlaceholder:async()=>(await import("./coinPlaceholder-A3XA34HF.js")).coinPlaceholderSvg,copy:async()=>(await import("./copy-2KZPQCMA.js")).copySvg,cursor:async()=>(await import("./cursor-PJVYYQEP.js")).cursorSvg,cursorTransparent:async()=>(await import("./cursor-transparent-BKAM7CUE.js")).cursorTransparentSvg,circle:async()=>(await import("./circle-GDDGFDXB.js")).circleSvg,desktop:async()=>(await import("./desktop-C2OKLF6T.js")).desktopSvg,disconnect:async()=>(await import("./disconnect-I2NLEU5M.js")).disconnectSvg,discord:async()=>(await import("./discord-P5S74RQN.js")).discordSvg,ethereum:async()=>(await import("./ethereum-FRPBW2QJ.js")).ethereumSvg,etherscan:async()=>(await import("./etherscan-5DYGCQ57.js")).etherscanSvg,extension:async()=>(await import("./extension-USJPNRBA.js")).extensionSvg,externalLink:async()=>(await import("./external-link-B5T3M7HY.js")).externalLinkSvg,facebook:async()=>(await import("./facebook-WCM7SC5S.js")).facebookSvg,farcaster:async()=>(await import("./farcaster-43PUCJ7B.js")).farcasterSvg,filters:async()=>(await import("./filters-COY4ISG3.js")).filtersSvg,github:async()=>(await import("./github-7JZJ4GOC.js")).githubSvg,google:async()=>(await import("./google-KQPQLYXH.js")).googleSvg,helpCircle:async()=>(await import("./help-circle-5EXHCWGI.js")).helpCircleSvg,image:async()=>(await import("./image-WOBAYVGC.js")).imageSvg,id:async()=>(await import("./id-HGLS7L5Z.js")).idSvg,infoCircle:async()=>(await import("./info-circle-UPYOKIPZ.js")).infoCircleSvg,lightbulb:async()=>(await import("./lightbulb-2BEEGUTJ.js")).lightbulbSvg,mail:async()=>(await import("./mail-JSYBIQME.js")).mailSvg,mobile:async()=>(await import("./mobile-SZA4KXCP.js")).mobileSvg,more:async()=>(await import("./more-SL3Z4BJY.js")).moreSvg,networkPlaceholder:async()=>(await import("./network-placeholder-XD2QMBGS.js")).networkPlaceholderSvg,nftPlaceholder:async()=>(await import("./nftPlaceholder-IISHVY42.js")).nftPlaceholderSvg,off:async()=>(await import("./off-FAINPWEM.js")).offSvg,playStore:async()=>(await import("./play-store-MGMO6SBA.js")).playStoreSvg,plus:async()=>(await import("./plus-EO7T4JDC.js")).plusSvg,qrCode:async()=>(await import("./qr-code-75NQQNUR.js")).qrCodeIcon,recycleHorizontal:async()=>(await import("./recycle-horizontal-CGSEYIQW.js")).recycleHorizontalSvg,refresh:async()=>(await import("./refresh-RRL6MGNI.js")).refreshSvg,search:async()=>(await import("./search-EBJRIK76.js")).searchSvg,send:async()=>(await import("./send-JGMVIM4N.js")).sendSvg,swapHorizontal:async()=>(await import("./swapHorizontal-LQYJYU3H.js")).swapHorizontalSvg,swapHorizontalMedium:async()=>(await import("./swapHorizontalMedium-LTC7WRYU.js")).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await import("./swapHorizontalBold-6LAIEERU.js")).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await import("./swapHorizontalRoundedBold-JW6KGVV3.js")).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await import("./swapVertical-3XRPUT4K.js")).swapVerticalSvg,solana:async()=>(await import("./solana-Q3PG2TA6.js")).solanaSvg,telegram:async()=>(await import("./telegram-NWLVCCEG.js")).telegramSvg,threeDots:async()=>(await import("./three-dots-T32HGYHU.js")).threeDotsSvg,twitch:async()=>(await import("./twitch-Q6XWH6BS.js")).twitchSvg,twitter:async()=>(await import("./x-RKSCYG7I.js")).xSvg,twitterIcon:async()=>(await import("./twitterIcon-5456D7VW.js")).twitterIconSvg,verify:async()=>(await import("./verify-XSVHI7EL.js")).verifySvg,verifyFilled:async()=>(await import("./verify-filled-EBRCL6L6.js")).verifyFilledSvg,wallet:async()=>(await import("./wallet-UCIYLIT3.js")).walletSvg,walletConnect:async()=>(await import("./walletconnect-ZVVFUVF5.js")).walletConnectSvg,walletConnectLightBrown:async()=>(await import("./walletconnect-ZVVFUVF5.js")).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await import("./walletconnect-ZVVFUVF5.js")).walletConnectBrownSvg,walletPlaceholder:async()=>(await import("./wallet-placeholder-23SYY7CI.js")).walletPlaceholderSvg,warningCircle:async()=>(await import("./warning-circle-VBPBKPLQ.js")).warningCircleSvg,x:async()=>(await import("./x-RKSCYG7I.js")).xSvg,info:async()=>(await import("./info-L6QBU4QT.js")).infoSvg,exclamationTriangle:async()=>(await import("./exclamation-triangle-74PQMJR4.js")).exclamationTriangleSvg,reown:async()=>(await import("./reown-logo-7WA645K5.js")).reownSvg,"x-mark":async()=>(await import("./x-mark-WVEKCV2K.js")).xMarkSvg};async function A(o){if(j.has(o))return j.get(o);let i=(V[o]??V.copy)();return j.set(o,i),i}var S=class extends b{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,y`${Y(A(this.name),y`<div class="fallback"></div>`)}`}};S.styles=[$,E,Z];P([s()],S.prototype,"size",void 0);P([s()],S.prototype,"name",void 0);P([s()],S.prototype,"color",void 0);P([s()],S.prototype,"aspectRatio",void 0);S=P([C("wui-icon")],S);
/*! Bundled license information:

lit-html/directives/private-async-helpers.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/until.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
