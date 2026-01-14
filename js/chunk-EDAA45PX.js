import{r as x,v as U,w as W,z as y}from"./chunk-RZQOM5QR.js";import{b as $}from"./chunk-IDZGCU4F.js";import{b as P,e as u,k as h}from"./chunk-ZS2R6O6N.js";import{C,H as p,O as _,S as R,X as O,ga as T}from"./chunk-OXOEMY67.js";import{i,k as l,o as s}from"./chunk-JY5TIRRF.js";i();s();l();i();s();l();var E=P``;var L=function(o,e,r,n){var a=arguments.length,t=a<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,r):n,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,r,n);else for(var m=o.length-1;m>=0;m--)(c=o[m])&&(t=(a<3?c(t):a>3?c(e,r,t):c(e,r))||t);return a>3&&t&&Object.defineProperty(e,r,t),t},g=class extends h{render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=p.state;return!e&&!r?null:u`
      <wui-flex
        .padding=${["4","3","3","3"]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="3"
      >
        <wui-text color="secondary" variant="md-regular" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `}howDoesItWorkTemplate(){return u` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-primary" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){_.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:O(T.state.activeChain)===C.ACCOUNT_TYPES.SMART_ACCOUNT}}),R.push("WhatIsABuy")}};g.styles=[E];g=L([y("w3m-onramp-providers-footer")],g);i();s();l();i();s();l();i();s();l();var B="https://reown.com";i();s();l();var j=x`
  .reown-logo {
    height: 24px;
  }

  a {
    text-decoration: none;
    cursor: pointer;
    color: ${({tokens:o})=>o.theme.textSecondary};
  }

  a:hover {
    opacity: 0.9;
  }
`;var S=function(o,e,r,n){var a=arguments.length,t=a<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,r):n,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,r,n);else for(var m=o.length-1;m>=0;m--)(c=o[m])&&(t=(a<3?c(t):a>3?c(e,r,t):c(e,r))||t);return a>3&&t&&Object.defineProperty(e,r,t),t},v=class extends h{render(){return u`
      <a
        data-testid="ux-branding-reown"
        href=${B}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="1"
          .padding=${["01","0","3","0"]}
        >
          <wui-text variant="sm-regular" color="inherit"> UX by </wui-text>
          <wui-icon name="reown" size="inherit" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};v.styles=[U,W,j];v=S([y("wui-ux-by-reown")],v);i();s();l();i();s();l();var F=x`
  :host wui-ux-by-reown {
    padding-top: 0;
  }

  :host wui-ux-by-reown.branding-only {
    padding-top: ${({spacing:o})=>o[3]};
  }

  a {
    text-decoration: none;
    color: ${({tokens:o})=>o.core.textAccentPrimary};
    font-weight: 500;
  }
`;var A=function(o,e,r,n){var a=arguments.length,t=a<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,r):n,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,r,n);else for(var m=o.length-1;m>=0;m--)(c=o[m])&&(t=(a<3?c(t):a>3?c(e,r,t):c(e,r))||t);return a>3&&t&&Object.defineProperty(e,r,t),t},b=class extends h{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=p.state.remoteFeatures,this.unsubscribe.push(p.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=p.state,n=p.state.features?.legalCheckbox;return!e&&!r||n?u`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `:u`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["4","3","3","3"]} justifyContent="center">
          <wui-text color="secondary" variant="md-regular" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}andTemplate(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=p.state;return e&&r?"and":""}termsTemplate(){let{termsConditionsUrl:e}=p.state;return e?u`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){let{privacyPolicyUrl:e}=p.state;return e?u`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(e=!1){return this.remoteFeatures?.reownBranding?e?u`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:u`<wui-ux-by-reown></wui-ux-by-reown>`:null}};b.styles=[F];A([$()],b.prototype,"remoteFeatures",void 0);b=A([y("w3m-legal-footer")],b);
