import{R as u,T as C,U as m,W as y}from"./chunk-ORERQN7J.js";import{a,e as z,f as $}from"./chunk-G6MGL5IE.js";import{b as h,e as w,j as v}from"./chunk-WGWCH7J2.js";var k=h`
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
    `,w`<slot class=${$(t)}></slot>`}};g.styles=[u,B];d([a()],g.prototype,"variant",void 0);d([a()],g.prototype,"color",void 0);d([a()],g.prototype,"align",void 0);d([a()],g.prototype,"lineClamp",void 0);g=d([y("wui-text")],g);var b=class{constructor(){this.cache=new Map}set(t,o){this.cache.set(t,o)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},x=new b;var R=h`
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
`;var S=function(e,t,o,n){var l=arguments.length,i=l<3?t:n===null?n=Object.getOwnPropertyDescriptor(t,o):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,n);else for(var p=e.length-1;p>=0;p--)(s=e[p])&&(i=(l<3?s(i):l>3?s(t,o,i):s(t,o))||i);return l>3&&i&&Object.defineProperty(t,o,i),i},P={add:async()=>(await import("./add-UAZAA5MG.js")).addSvg,allWallets:async()=>(await import("./all-wallets-HV2QTLEC.js")).allWalletsSvg,arrowBottomCircle:async()=>(await import("./arrow-bottom-circle-H2FQ7U7C.js")).arrowBottomCircleSvg,appStore:async()=>(await import("./app-store-MX5A4524.js")).appStoreSvg,apple:async()=>(await import("./apple-44HF5UH6.js")).appleSvg,arrowBottom:async()=>(await import("./arrow-bottom-WAV6AXYQ.js")).arrowBottomSvg,arrowLeft:async()=>(await import("./arrow-left-ZSBWVVSS.js")).arrowLeftSvg,arrowRight:async()=>(await import("./arrow-right-OPD4VCOM.js")).arrowRightSvg,arrowTop:async()=>(await import("./arrow-top-KX2GOHZ7.js")).arrowTopSvg,bank:async()=>(await import("./bank-WOXXADAK.js")).bankSvg,browser:async()=>(await import("./browser-MA5CHR2N.js")).browserSvg,card:async()=>(await import("./card-FBVGARXM.js")).cardSvg,checkmark:async()=>(await import("./checkmark-UH52EXEX.js")).checkmarkSvg,checkmarkBold:async()=>(await import("./checkmark-bold-HCYCCIU5.js")).checkmarkBoldSvg,chevronBottom:async()=>(await import("./chevron-bottom-LOYGHIYA.js")).chevronBottomSvg,chevronLeft:async()=>(await import("./chevron-left-E2RG6P3U.js")).chevronLeftSvg,chevronRight:async()=>(await import("./chevron-right-XHSDHI3R.js")).chevronRightSvg,chevronTop:async()=>(await import("./chevron-top-ICLQHIFD.js")).chevronTopSvg,chromeStore:async()=>(await import("./chrome-store-347XZKGQ.js")).chromeStoreSvg,clock:async()=>(await import("./clock-EUSZ6DGI.js")).clockSvg,close:async()=>(await import("./close-CPE7PXZU.js")).closeSvg,compass:async()=>(await import("./compass-7TMZKIJZ.js")).compassSvg,coinPlaceholder:async()=>(await import("./coinPlaceholder-36AQTO3O.js")).coinPlaceholderSvg,copy:async()=>(await import("./copy-ZGWHQU6V.js")).copySvg,cursor:async()=>(await import("./cursor-EY4NE2TN.js")).cursorSvg,cursorTransparent:async()=>(await import("./cursor-transparent-QHLPAHQR.js")).cursorTransparentSvg,desktop:async()=>(await import("./desktop-64IZHV5Z.js")).desktopSvg,disconnect:async()=>(await import("./disconnect-SPKWJLLB.js")).disconnectSvg,discord:async()=>(await import("./discord-YWPBCLAX.js")).discordSvg,etherscan:async()=>(await import("./etherscan-ABBK7EG4.js")).etherscanSvg,extension:async()=>(await import("./extension-SG3XFWPU.js")).extensionSvg,externalLink:async()=>(await import("./external-link-PSK2L6HJ.js")).externalLinkSvg,facebook:async()=>(await import("./facebook-7LY642XQ.js")).facebookSvg,farcaster:async()=>(await import("./farcaster-RMZFVUQI.js")).farcasterSvg,filters:async()=>(await import("./filters-QZVOBPAE.js")).filtersSvg,github:async()=>(await import("./github-QJ7Q34EE.js")).githubSvg,google:async()=>(await import("./google-QEBXCIQI.js")).googleSvg,helpCircle:async()=>(await import("./help-circle-DU4WZK3X.js")).helpCircleSvg,image:async()=>(await import("./image-EYISXTVD.js")).imageSvg,id:async()=>(await import("./id-7Y3GHI7M.js")).idSvg,infoCircle:async()=>(await import("./info-circle-PQCIXUC6.js")).infoCircleSvg,lightbulb:async()=>(await import("./lightbulb-OGW4REAU.js")).lightbulbSvg,mail:async()=>(await import("./mail-4BDBWM53.js")).mailSvg,mobile:async()=>(await import("./mobile-CNPKB5E2.js")).mobileSvg,more:async()=>(await import("./more-EJAHSVRN.js")).moreSvg,networkPlaceholder:async()=>(await import("./network-placeholder-STHYALDM.js")).networkPlaceholderSvg,nftPlaceholder:async()=>(await import("./nftPlaceholder-UQJBAL4Q.js")).nftPlaceholderSvg,off:async()=>(await import("./off-J5BBQXPE.js")).offSvg,playStore:async()=>(await import("./play-store-GMI2JXR3.js")).playStoreSvg,plus:async()=>(await import("./plus-NTNGYE7K.js")).plusSvg,qrCode:async()=>(await import("./qr-code-APKQJIZB.js")).qrCodeIcon,recycleHorizontal:async()=>(await import("./recycle-horizontal-GDGDJ2B4.js")).recycleHorizontalSvg,refresh:async()=>(await import("./refresh-PIWDR6ED.js")).refreshSvg,search:async()=>(await import("./search-Y2JPZZ5Z.js")).searchSvg,send:async()=>(await import("./send-MOS327M2.js")).sendSvg,swapHorizontal:async()=>(await import("./swapHorizontal-Y6CYBARO.js")).swapHorizontalSvg,swapHorizontalMedium:async()=>(await import("./swapHorizontalMedium-GKYAFS5W.js")).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await import("./swapHorizontalBold-XGSDS5HG.js")).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await import("./swapHorizontalRoundedBold-5RSXLUUF.js")).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await import("./swapVertical-JYGZSSF3.js")).swapVerticalSvg,telegram:async()=>(await import("./telegram-UWO5DTAW.js")).telegramSvg,threeDots:async()=>(await import("./three-dots-MXBX3KIG.js")).threeDotsSvg,twitch:async()=>(await import("./twitch-Z2F4A2B2.js")).twitchSvg,twitter:async()=>(await import("./x-QB2EVDSX.js")).xSvg,twitterIcon:async()=>(await import("./twitterIcon-IIAQE5TQ.js")).twitterIconSvg,verify:async()=>(await import("./verify-LHOCC6FZ.js")).verifySvg,verifyFilled:async()=>(await import("./verify-filled-LF6HFDUZ.js")).verifyFilledSvg,wallet:async()=>(await import("./wallet-WMX3Z2TO.js")).walletSvg,walletConnect:async()=>(await import("./walletconnect-7YYCVP74.js")).walletConnectSvg,walletConnectLightBrown:async()=>(await import("./walletconnect-7YYCVP74.js")).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await import("./walletconnect-7YYCVP74.js")).walletConnectBrownSvg,walletPlaceholder:async()=>(await import("./wallet-placeholder-ICF7EAVX.js")).walletPlaceholderSvg,warningCircle:async()=>(await import("./warning-circle-ZPCRIB5E.js")).warningCircleSvg,x:async()=>(await import("./x-QB2EVDSX.js")).xSvg,info:async()=>(await import("./info-ZIDKWIJG.js")).infoSvg,exclamationTriangle:async()=>(await import("./exclamation-triangle-CTT7RH4J.js")).exclamationTriangleSvg,reown:async()=>(await import("./reown-logo-SG7DX5AG.js")).reownSvg};async function j(e){if(x.has(e))return x.get(e);let o=(P[e]??P.copy)();return x.set(e,o),o}var f=class extends v{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,w`${z(j(this.name),w`<div class="fallback"></div>`)}`}};f.styles=[u,C,R];S([a()],f.prototype,"size",void 0);S([a()],f.prototype,"name",void 0);S([a()],f.prototype,"color",void 0);S([a()],f.prototype,"aspectRatio",void 0);f=S([y("wui-icon")],f);
