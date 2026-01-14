import{c as U,d as W,h as E}from"./chunk-LTN6YROF.js";import{B as j,D as C,F as R,I as L,M as S,N as y,f as T,q as $,r as u}from"./chunk-N2WXLAZF.js";import{a as O}from"./chunk-B2LU4KHT.js";import{a as p}from"./chunk-IDZGCU4F.js";import{b as v,e as x,k as b}from"./chunk-ZS2R6O6N.js";import{i,k as n,o as l}from"./chunk-JY5TIRRF.js";i();l();n();function H(){try{return u.returnOpenHref(`${T.SECURE_SITE_SDK_ORIGIN}/loading`,"popupWindow","width=600,height=800,scrollbars=yes")}catch{throw new Error("Could not open social popup")}}async function I(){C.push("ConnectingFarcaster");let t=R.getAuthConnector();if(t&&!y.state.farcasterUrl)try{let{url:o}=await t.provider.getFarcasterUri();y.setFarcasterUrl(o,S.state.activeChain)}catch(o){C.goBack(),L.showError(o)}}async function A(t){C.push("ConnectingSocial");let o=R.getAuthConnector(),e=null;try{let a=setTimeout(()=>{throw new Error("Social login timed out. Please try again.")},45e3);if(o&&t){if(u.isTelegram()||(e=H()),e)y.setSocialWindow(e,S.state.activeChain);else if(!u.isTelegram())throw new Error("Could not create social popup");let{uri:s}=await o.provider.getSocialRedirectUri({provider:t});if(!s)throw e?.close(),new Error("Could not fetch the social redirect uri");if(e&&(e.location.href=s),u.isTelegram()){$.setTelegramSocialProvider(t);let r=u.formatTelegramSocialLoginUrl(s);u.openHref(r,"_top")}clearTimeout(a)}}catch(a){e?.close(),L.showError(a?.message)}}async function z(t){y.setSocialProvider(t,S.state.activeChain),j.sendEvent({type:"track",event:"SOCIAL_LOGIN_STARTED",properties:{provider:t}}),t==="farcaster"?await I():await A(t)}i();l();n();i();l();n();i();l();n();var D=v`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-005);
    overflow: hidden;
  }

  wui-icon {
    width: 100%;
    height: 100%;
  }
`;var F=function(t,o,e,a){var s=arguments.length,r=s<3?o:a===null?a=Object.getOwnPropertyDescriptor(o,e):a,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,o,e,a);else for(var m=t.length-1;m>=0;m--)(c=t[m])&&(r=(s<3?c(r):s>3?c(o,e,r):c(o,e))||r);return s>3&&r&&Object.defineProperty(o,e,r),r},_=class extends b{constructor(){super(...arguments),this.logo="google"}render(){return x`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `}};_.styles=[U,D];F([p()],_.prototype,"logo",void 0);_=F([E("wui-logo")],_);i();l();n();i();l();n();i();l();n();var P=v`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    justify-content: flex-start;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-text[data-align='left'] {
    display: flex;
    flex: 1;
  }

  wui-text[data-align='center'] {
    display: flex;
    flex: 1;
    justify-content: center;
  }

  .invisible {
    opacity: 0;
    pointer-events: none;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }
`;var w=function(t,o,e,a){var s=arguments.length,r=s<3?o:a===null?a=Object.getOwnPropertyDescriptor(o,e):a,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,o,e,a);else for(var m=t.length-1;m>=0;m--)(c=t[m])&&(r=(s<3?c(r):s>3?c(o,e,r):c(o,e))||r);return s>3&&r&&Object.defineProperty(o,e,r),r},f=class extends b{constructor(){super(...arguments),this.logo="google",this.name="Continue with google",this.align="left",this.disabled=!1}render(){return x`
      <button ?disabled=${this.disabled} tabindex=${O(this.tabIdx)}>
        <wui-logo logo=${this.logo}></wui-logo>
        <wui-text
          data-align=${this.align}
          variant="paragraph-500"
          color="inherit"
          align=${this.align}
          >${this.name}</wui-text
        >
        ${this.templatePlacement()}
      </button>
    `}templatePlacement(){return this.align==="center"?x` <wui-logo class="invisible" logo=${this.logo}></wui-logo>`:null}};f.styles=[U,W,P];w([p()],f.prototype,"logo",void 0);w([p()],f.prototype,"name",void 0);w([p()],f.prototype,"align",void 0);w([p()],f.prototype,"tabIdx",void 0);w([p({type:Boolean})],f.prototype,"disabled",void 0);f=w([E("wui-list-social")],f);export{z as a};
