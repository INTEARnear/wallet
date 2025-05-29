import{aa as v,ca as q,da as f,fa as y}from"./chunk-SGMZUJCA.js";import{b as w,c as M,d as H,e as h,g as x,h as L,i as I,j as d}from"./chunk-WGWCH7J2.js";var tt={attribute:!0,type:String,converter:M,reflect:!1,hasChanged:H},et=(e=tt,t,i)=>{let{kind:r,metadata:a}=i,o=globalThis.litPropertyMetadata.get(a);if(o===void 0&&globalThis.litPropertyMetadata.set(a,o=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),r==="accessor"){let{name:n}=i;return{set(s){let m=t.get.call(this);t.set.call(this,s),this.requestUpdate(n,m,e)},init(s){return s!==void 0&&this.C(n,void 0,e,s),s}}}if(r==="setter"){let{name:n}=i;return function(s){let m=this[n];t.call(this,s),this.requestUpdate(n,m,e)}}throw Error("Unsupported decorator location: "+r)};function c(e){return(t,i)=>typeof i=="object"?et(e,t,i):((r,a,o)=>{let n=a.hasOwnProperty(o);return a.constructor.createProperty(o,r),n?Object.getOwnPropertyDescriptor(a,o):void 0})(e,t,i)}function lt(e){return c({...e,state:!0,attribute:!1})}var T={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},_=e=>(...t)=>({_$litDirective$:e,values:t}),S=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,r){this._$Ct=t,this._$AM=i,this._$Ci=r}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}};var N=_(class extends S{constructor(e){if(super(e),e.type!==T.ATTRIBUTE||e.name!=="class"||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(let r in t)t[r]&&!this.nt?.has(r)&&this.st.add(r);return this.render(t)}let i=e.element.classList;for(let r of this.st)r in t||(i.remove(r),this.st.delete(r));for(let r in t){let a=!!t[r];a===this.st.has(r)||this.nt?.has(r)||(a?(i.add(r),this.st.add(r)):(i.remove(r),this.st.delete(r)))}return x}});var U=w`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var p=function(e,t,i,r){var a=arguments.length,o=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o},l=class extends d{render(){return this.style.cssText=`
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
    `,h`<slot></slot>`}};l.styles=[v,U];p([c()],l.prototype,"flexDirection",void 0);p([c()],l.prototype,"flexWrap",void 0);p([c()],l.prototype,"flexBasis",void 0);p([c()],l.prototype,"flexGrow",void 0);p([c()],l.prototype,"flexShrink",void 0);p([c()],l.prototype,"alignItems",void 0);p([c()],l.prototype,"justifyContent",void 0);p([c()],l.prototype,"columnGap",void 0);p([c()],l.prototype,"rowGap",void 0);p([c()],l.prototype,"gap",void 0);p([c()],l.prototype,"padding",void 0);p([c()],l.prototype,"margin",void 0);l=p([y("wui-flex")],l);var G=w`
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
`;var b=function(e,t,i,r){var a=arguments.length,o=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o},u=class extends d{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){let t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `,h`<slot class=${N(t)}></slot>`}};u.styles=[v,G];b([c()],u.prototype,"variant",void 0);b([c()],u.prototype,"color",void 0);b([c()],u.prototype,"align",void 0);b([c()],u.prototype,"lineClamp",void 0);u=b([y("wui-text")],u);var fe=e=>e??L;var{I:de}=I,W=e=>e===null||typeof e!="object"&&typeof e!="function";var V=e=>e.strings===void 0;var C=(e,t)=>{let i=e._$AN;if(i===void 0)return!1;for(let r of i)r._$AO?.(t,!1),C(r,t);return!0},z=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while(i?.size===0)},F=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),ot(t)}};function it(e){this._$AN!==void 0?(z(this),this._$AM=e,F(this)):this._$AM=e}function rt(e,t=!1,i=0){let r=this._$AH,a=this._$AN;if(a!==void 0&&a.size!==0)if(t)if(Array.isArray(r))for(let o=i;o<r.length;o++)C(r[o],!1),z(r[o]);else r!=null&&(C(r,!1),z(r));else C(this,e)}var ot=e=>{e.type==T.CHILD&&(e._$AP??=rt,e._$AQ??=it)},R=class extends S{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,r){super._$AT(t,i,r),F(this),this.isConnected=t._$AU}_$AO(t,i=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),i&&(C(this,t),z(this))}setValue(t){if(V(this._$Ct))this._$Ct._$AI(t,this);else{let i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}};var B=class{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}},k=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(t=>this.Z=t)}resume(){this.Z?.(),this.Y=this.Z=void 0}};var Y=e=>!W(e)&&typeof e.then=="function",K=1073741823,O=class extends R{constructor(){super(...arguments),this._$Cwt=K,this._$Cbt=[],this._$CK=new B(this),this._$CX=new k}render(...t){return t.find(i=>!Y(i))??x}update(t,i){let r=this._$Cbt,a=r.length;this._$Cbt=i;let o=this._$CK,n=this._$CX;this.isConnected||this.disconnected();for(let s=0;s<i.length&&!(s>this._$Cwt);s++){let m=i[s];if(!Y(m))return this._$Cwt=s,m;s<a&&m===r[s]||(this._$Cwt=K,a=0,Promise.resolve(m).then(async J=>{for(;n.get();)await n.get();let $=o.deref();if($!==void 0){let j=$._$Cbt.indexOf(m);j>-1&&j<$._$Cwt&&($._$Cwt=j,$.setValue(J))}}))}return x}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}},X=_(O);var D=class{constructor(){this.cache=new Map}set(t,i){this.cache.set(t,i)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},E=new D;var Z=w`
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
`;var A=function(e,t,i,r){var a=arguments.length,o=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(o=(a<3?n(o):a>3?n(t,i,o):n(t,i))||o);return a>3&&o&&Object.defineProperty(t,i,o),o},Q={add:async()=>(await import("./add-TAV7EBAJ.js")).addSvg,allWallets:async()=>(await import("./all-wallets-BQ7BPORW.js")).allWalletsSvg,arrowBottomCircle:async()=>(await import("./arrow-bottom-circle-B6KXNJUB.js")).arrowBottomCircleSvg,appStore:async()=>(await import("./app-store-AB3OWBR2.js")).appStoreSvg,apple:async()=>(await import("./apple-MKNZTZXQ.js")).appleSvg,arrowBottom:async()=>(await import("./arrow-bottom-VD3X5I2R.js")).arrowBottomSvg,arrowLeft:async()=>(await import("./arrow-left-NUPHWTKE.js")).arrowLeftSvg,arrowRight:async()=>(await import("./arrow-right-DGO4Y5MJ.js")).arrowRightSvg,arrowTop:async()=>(await import("./arrow-top-LJLNSHMY.js")).arrowTopSvg,bank:async()=>(await import("./bank-RKYBFYX7.js")).bankSvg,browser:async()=>(await import("./browser-4KUW25JQ.js")).browserSvg,card:async()=>(await import("./card-CJ2O6GZC.js")).cardSvg,checkmark:async()=>(await import("./checkmark-K2T4P4V6.js")).checkmarkSvg,checkmarkBold:async()=>(await import("./checkmark-bold-TZUNBFW3.js")).checkmarkBoldSvg,chevronBottom:async()=>(await import("./chevron-bottom-L2ZG6UW7.js")).chevronBottomSvg,chevronLeft:async()=>(await import("./chevron-left-7VOMTZRG.js")).chevronLeftSvg,chevronRight:async()=>(await import("./chevron-right-KK4I5NCC.js")).chevronRightSvg,chevronTop:async()=>(await import("./chevron-top-R6TPWR4Q.js")).chevronTopSvg,chromeStore:async()=>(await import("./chrome-store-QF3Y2LKP.js")).chromeStoreSvg,clock:async()=>(await import("./clock-TH5NCIEX.js")).clockSvg,close:async()=>(await import("./close-KJYDSRV4.js")).closeSvg,compass:async()=>(await import("./compass-AQPWOO4C.js")).compassSvg,coinPlaceholder:async()=>(await import("./coinPlaceholder-ESSWSBB7.js")).coinPlaceholderSvg,copy:async()=>(await import("./copy-46OEV4DB.js")).copySvg,cursor:async()=>(await import("./cursor-N2NAJ6CL.js")).cursorSvg,cursorTransparent:async()=>(await import("./cursor-transparent-NFJHOCGY.js")).cursorTransparentSvg,desktop:async()=>(await import("./desktop-VTYXI7FA.js")).desktopSvg,disconnect:async()=>(await import("./disconnect-H2JTZFQR.js")).disconnectSvg,discord:async()=>(await import("./discord-2ZL3GSHE.js")).discordSvg,etherscan:async()=>(await import("./etherscan-WWJFPPN4.js")).etherscanSvg,extension:async()=>(await import("./extension-T3QXQXR5.js")).extensionSvg,externalLink:async()=>(await import("./external-link-UKGYS2UJ.js")).externalLinkSvg,facebook:async()=>(await import("./facebook-F36RF6P3.js")).facebookSvg,farcaster:async()=>(await import("./farcaster-HVVIZXTW.js")).farcasterSvg,filters:async()=>(await import("./filters-F5UXJS7B.js")).filtersSvg,github:async()=>(await import("./github-UG2YDNFI.js")).githubSvg,google:async()=>(await import("./google-HMCFU7LR.js")).googleSvg,helpCircle:async()=>(await import("./help-circle-ARS4QUFG.js")).helpCircleSvg,image:async()=>(await import("./image-AXUSAEF4.js")).imageSvg,id:async()=>(await import("./id-YXKTZ5RP.js")).idSvg,infoCircle:async()=>(await import("./info-circle-Y2OOVQCT.js")).infoCircleSvg,lightbulb:async()=>(await import("./lightbulb-4HFBQ67D.js")).lightbulbSvg,mail:async()=>(await import("./mail-S72KQIR4.js")).mailSvg,mobile:async()=>(await import("./mobile-TS7AGID2.js")).mobileSvg,more:async()=>(await import("./more-XVYOX76H.js")).moreSvg,networkPlaceholder:async()=>(await import("./network-placeholder-OYTV6ZFO.js")).networkPlaceholderSvg,nftPlaceholder:async()=>(await import("./nftPlaceholder-HEHQBX6D.js")).nftPlaceholderSvg,off:async()=>(await import("./off-67JT4OXQ.js")).offSvg,playStore:async()=>(await import("./play-store-DLBYMPLQ.js")).playStoreSvg,plus:async()=>(await import("./plus-5GXHYJN7.js")).plusSvg,qrCode:async()=>(await import("./qr-code-RLZ3OMH7.js")).qrCodeIcon,recycleHorizontal:async()=>(await import("./recycle-horizontal-A2VLICE3.js")).recycleHorizontalSvg,refresh:async()=>(await import("./refresh-EINGJD2K.js")).refreshSvg,search:async()=>(await import("./search-5URV2GYD.js")).searchSvg,send:async()=>(await import("./send-6OG67CHY.js")).sendSvg,swapHorizontal:async()=>(await import("./swapHorizontal-V4KOGLMY.js")).swapHorizontalSvg,swapHorizontalMedium:async()=>(await import("./swapHorizontalMedium-4HAXFYBU.js")).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await import("./swapHorizontalBold-4Q2KTHVS.js")).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await import("./swapHorizontalRoundedBold-67QHEJLB.js")).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await import("./swapVertical-AE2L64FA.js")).swapVerticalSvg,telegram:async()=>(await import("./telegram-ZWC5HV2X.js")).telegramSvg,threeDots:async()=>(await import("./three-dots-PVZDL2EL.js")).threeDotsSvg,twitch:async()=>(await import("./twitch-75XW2LKN.js")).twitchSvg,twitter:async()=>(await import("./x-TXJCF5DM.js")).xSvg,twitterIcon:async()=>(await import("./twitterIcon-ES75HEUD.js")).twitterIconSvg,verify:async()=>(await import("./verify-E3SWCC7K.js")).verifySvg,verifyFilled:async()=>(await import("./verify-filled-42RI3RYK.js")).verifyFilledSvg,wallet:async()=>(await import("./wallet-5O2T6Q6Y.js")).walletSvg,walletConnect:async()=>(await import("./walletconnect-ZKUEIHHP.js")).walletConnectSvg,walletConnectLightBrown:async()=>(await import("./walletconnect-ZKUEIHHP.js")).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await import("./walletconnect-ZKUEIHHP.js")).walletConnectBrownSvg,walletPlaceholder:async()=>(await import("./wallet-placeholder-Q2JCIVHQ.js")).walletPlaceholderSvg,warningCircle:async()=>(await import("./warning-circle-IOQN2XT5.js")).warningCircleSvg,x:async()=>(await import("./x-TXJCF5DM.js")).xSvg,info:async()=>(await import("./info-3SMARAJM.js")).infoSvg,exclamationTriangle:async()=>(await import("./exclamation-triangle-DLIO4XWQ.js")).exclamationTriangleSvg,reown:async()=>(await import("./reown-logo-MRINQJXH.js")).reownSvg};async function at(e){if(E.has(e))return E.get(e);let i=(Q[e]??Q.copy)();return E.set(e,i),i}var g=class extends d{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,h`${X(at(this.name),h`<div class="fallback"></div>`)}`}};g.styles=[v,q,Z];A([c()],g.prototype,"size",void 0);A([c()],g.prototype,"name",void 0);A([c()],g.prototype,"color",void 0);A([c()],g.prototype,"aspectRatio",void 0);g=A([y("wui-icon")],g);export{c as a,lt as b,_ as c,R as d,N as e,fe as f};
/*! Bundled license information:

@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
lit-html/directive.js:
lit-html/async-directive.js:
lit-html/directives/until.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
lit-html/directives/private-async-helpers.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
