import{R as z,T,U as f,W as $}from"./chunk-WYPOXQ7L.js";import{a,e as P,f as j}from"./chunk-HILJYRBB.js";import{b as x,e as y,j as b}from"./chunk-5RP2GFJC.js";import{h as r,j as n,n as l}from"./chunk-KGCAX4NX.js";r();l();n();r();l();n();r();l();n();var _=x`
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
    `,y`<slot class=${j(t)}></slot>`}};d.styles=[z,H];C([a()],d.prototype,"variant",void 0);C([a()],d.prototype,"color",void 0);C([a()],d.prototype,"align",void 0);C([a()],d.prototype,"lineClamp",void 0);d=C([$("wui-text")],d);r();l();n();r();l();n();var R=class{constructor(){this.cache=new Map}set(t,o){this.cache.set(t,o)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},B=new R;r();l();n();var L=x`
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
`;var k=function(e,t,o,c){var p=arguments.length,i=p<3?t:c===null?c=Object.getOwnPropertyDescriptor(t,o):c,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,o,c);else for(var g=e.length-1;g>=0;g--)(m=e[g])&&(i=(p<3?m(i):p>3?m(t,o,i):m(t,o))||i);return p>3&&i&&Object.defineProperty(t,o,i),i},O={add:async()=>(await import("./add-DT2IKI2P.js")).addSvg,allWallets:async()=>(await import("./all-wallets-M5Z4X75A.js")).allWalletsSvg,arrowBottomCircle:async()=>(await import("./arrow-bottom-circle-EXIHHTL5.js")).arrowBottomCircleSvg,appStore:async()=>(await import("./app-store-B3QHYNAV.js")).appStoreSvg,apple:async()=>(await import("./apple-ZU2ZVNRC.js")).appleSvg,arrowBottom:async()=>(await import("./arrow-bottom-CCXTZ6NF.js")).arrowBottomSvg,arrowLeft:async()=>(await import("./arrow-left-ULNHMQEA.js")).arrowLeftSvg,arrowRight:async()=>(await import("./arrow-right-MHSW2DVN.js")).arrowRightSvg,arrowTop:async()=>(await import("./arrow-top-I57ZOZRS.js")).arrowTopSvg,bank:async()=>(await import("./bank-V46MRT4O.js")).bankSvg,browser:async()=>(await import("./browser-KXGTVVQ2.js")).browserSvg,card:async()=>(await import("./card-OEV6JAWQ.js")).cardSvg,checkmark:async()=>(await import("./checkmark-ZRL4EQON.js")).checkmarkSvg,checkmarkBold:async()=>(await import("./checkmark-bold-OBI6OW3W.js")).checkmarkBoldSvg,chevronBottom:async()=>(await import("./chevron-bottom-TJBZDCMC.js")).chevronBottomSvg,chevronLeft:async()=>(await import("./chevron-left-PRMNTWHM.js")).chevronLeftSvg,chevronRight:async()=>(await import("./chevron-right-T4BRVZXQ.js")).chevronRightSvg,chevronTop:async()=>(await import("./chevron-top-TINMFA6M.js")).chevronTopSvg,chromeStore:async()=>(await import("./chrome-store-RYFHGAKG.js")).chromeStoreSvg,clock:async()=>(await import("./clock-IK4G5QER.js")).clockSvg,close:async()=>(await import("./close-NYW5UJ46.js")).closeSvg,compass:async()=>(await import("./compass-JFTZ6OY7.js")).compassSvg,coinPlaceholder:async()=>(await import("./coinPlaceholder-2WECU3WO.js")).coinPlaceholderSvg,copy:async()=>(await import("./copy-T273Q5P2.js")).copySvg,cursor:async()=>(await import("./cursor-3JU5O4HU.js")).cursorSvg,cursorTransparent:async()=>(await import("./cursor-transparent-PXU633EG.js")).cursorTransparentSvg,desktop:async()=>(await import("./desktop-W7GQV6XR.js")).desktopSvg,disconnect:async()=>(await import("./disconnect-KNPDMQ4I.js")).disconnectSvg,discord:async()=>(await import("./discord-CGKCF3BH.js")).discordSvg,etherscan:async()=>(await import("./etherscan-ZVRTKEI2.js")).etherscanSvg,extension:async()=>(await import("./extension-MUWLMT73.js")).extensionSvg,externalLink:async()=>(await import("./external-link-IXQMJRRE.js")).externalLinkSvg,facebook:async()=>(await import("./facebook-EYAS3QXN.js")).facebookSvg,farcaster:async()=>(await import("./farcaster-F5PTZTSV.js")).farcasterSvg,filters:async()=>(await import("./filters-U73E4HCV.js")).filtersSvg,github:async()=>(await import("./github-JDDXIIVX.js")).githubSvg,google:async()=>(await import("./google-7W7CZ7HR.js")).googleSvg,helpCircle:async()=>(await import("./help-circle-ZJFXGWPJ.js")).helpCircleSvg,image:async()=>(await import("./image-FWX4CH3I.js")).imageSvg,id:async()=>(await import("./id-VCCAJWYL.js")).idSvg,infoCircle:async()=>(await import("./info-circle-TJMKTII2.js")).infoCircleSvg,lightbulb:async()=>(await import("./lightbulb-RXB3CNRZ.js")).lightbulbSvg,mail:async()=>(await import("./mail-ZEW5NDWL.js")).mailSvg,mobile:async()=>(await import("./mobile-KMYHKI3A.js")).mobileSvg,more:async()=>(await import("./more-IRZZG5JL.js")).moreSvg,networkPlaceholder:async()=>(await import("./network-placeholder-Y5ZROKBU.js")).networkPlaceholderSvg,nftPlaceholder:async()=>(await import("./nftPlaceholder-UEWUY2TO.js")).nftPlaceholderSvg,off:async()=>(await import("./off-YDT72CM7.js")).offSvg,playStore:async()=>(await import("./play-store-4EIR2NSS.js")).playStoreSvg,plus:async()=>(await import("./plus-LONNQQM5.js")).plusSvg,qrCode:async()=>(await import("./qr-code-BC547GO7.js")).qrCodeIcon,recycleHorizontal:async()=>(await import("./recycle-horizontal-EE57YEPC.js")).recycleHorizontalSvg,refresh:async()=>(await import("./refresh-5YPJJXFB.js")).refreshSvg,search:async()=>(await import("./search-MYXUADVG.js")).searchSvg,send:async()=>(await import("./send-HRYKPMF7.js")).sendSvg,swapHorizontal:async()=>(await import("./swapHorizontal-QOIGBK4I.js")).swapHorizontalSvg,swapHorizontalMedium:async()=>(await import("./swapHorizontalMedium-K2NQPACA.js")).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await import("./swapHorizontalBold-PR7DHWAT.js")).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await import("./swapHorizontalRoundedBold-KXC3V6LY.js")).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await import("./swapVertical-RM52YNZW.js")).swapVerticalSvg,telegram:async()=>(await import("./telegram-EAUTL3RV.js")).telegramSvg,threeDots:async()=>(await import("./three-dots-T5SIQNJS.js")).threeDotsSvg,twitch:async()=>(await import("./twitch-O465QAR6.js")).twitchSvg,twitter:async()=>(await import("./x-ONAZ5AS7.js")).xSvg,twitterIcon:async()=>(await import("./twitterIcon-O5PXVY6H.js")).twitterIconSvg,verify:async()=>(await import("./verify-O5D63OHJ.js")).verifySvg,verifyFilled:async()=>(await import("./verify-filled-R2DI22MO.js")).verifyFilledSvg,wallet:async()=>(await import("./wallet-PL7N3CAU.js")).walletSvg,walletConnect:async()=>(await import("./walletconnect-G4Q2SPWQ.js")).walletConnectSvg,walletConnectLightBrown:async()=>(await import("./walletconnect-G4Q2SPWQ.js")).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await import("./walletconnect-G4Q2SPWQ.js")).walletConnectBrownSvg,walletPlaceholder:async()=>(await import("./wallet-placeholder-QEIRLSJB.js")).walletPlaceholderSvg,warningCircle:async()=>(await import("./warning-circle-4I4EFNG3.js")).warningCircleSvg,x:async()=>(await import("./x-ONAZ5AS7.js")).xSvg,info:async()=>(await import("./info-JNLJLX5Z.js")).infoSvg,exclamationTriangle:async()=>(await import("./exclamation-triangle-XOICFEWR.js")).exclamationTriangleSvg,reown:async()=>(await import("./reown-logo-MLCW4WFU.js")).reownSvg};async function W(e){if(B.has(e))return B.get(e);let o=(O[e]??O.copy)();return B.set(e,o),o}var S=class extends b{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,y`${P(W(this.name),y`<div class="fallback"></div>`)}`}};S.styles=[z,T,L];k([a()],S.prototype,"size",void 0);k([a()],S.prototype,"name",void 0);k([a()],S.prototype,"color",void 0);k([a()],S.prototype,"aspectRatio",void 0);S=k([$("wui-icon")],S);
