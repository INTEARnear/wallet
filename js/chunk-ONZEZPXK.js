import{c as T}from"./chunk-6EMLP2SS.js";import{c as v,d as P,h as x}from"./chunk-LTN6YROF.js";import{U as y,s as m}from"./chunk-N2WXLAZF.js";import{a as O,b as j}from"./chunk-BDSQF46L.js";import{a as E}from"./chunk-B2LU4KHT.js";import{a as $,b as g}from"./chunk-IDZGCU4F.js";import{b,e as p,k as w}from"./chunk-ZS2R6O6N.js";import{i,k as l,o as c}from"./chunk-JY5TIRRF.js";i();c();l();i();c();l();i();c();l();i();c();l();var U=b`
  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    column-gap: var(--wui-spacing-1xs);
  }

  label > input[type='checkbox'] {
    height: 0;
    width: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
  }

  label > span {
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
    min-width: var(--wui-spacing-xl);
    min-height: var(--wui-spacing-xl);
    border-radius: var(--wui-border-radius-3xs);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-010);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color;
  }

  label > span:hover,
  label > input[type='checkbox']:focus-visible + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  label input[type='checkbox']:checked + span {
    background-color: var(--wui-color-blue-base-90);
  }

  label > span > wui-icon {
    opacity: 0;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: opacity;
  }

  label > input[type='checkbox']:checked + span wui-icon {
    opacity: 1;
  }
`;var B=function(s,e,r,o){var n=arguments.length,t=n<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(s,e,r,o);else for(var u=s.length-1;u>=0;u--)(a=s[u])&&(t=(n<3?a(t):n>3?a(e,r,t):a(e,r))||t);return n>3&&t&&Object.defineProperty(e,r,t),t},k=class extends w{constructor(){super(...arguments),this.inputElementRef=O(),this.checked=void 0}render(){return p`
      <label>
        <input
          ${j(this.inputElementRef)}
          ?checked=${E(this.checked)}
          type="checkbox"
          @change=${this.dispatchChangeEvent}
        />
        <span>
          <wui-icon name="checkmarkBold" color="inverse-100" size="xxs"></wui-icon>
        </span>
        <slot></slot>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("checkboxChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};k.styles=[v,U];B([$({type:Boolean})],k.prototype,"checked",void 0);k=B([x("wui-checkbox")],k);i();c();l();var L=b`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  wui-checkbox {
    padding: var(--wui-spacing-s);
  }
  a {
    text-decoration: none;
    color: var(--wui-color-fg-150);
    font-weight: 500;
  }
`;var W=function(s,e,r,o){var n=arguments.length,t=n<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(s,e,r,o);else for(var u=s.length-1;u>=0;u--)(a=s[u])&&(t=(n<3?a(t):n>3?a(e,r,t):a(e,r))||t);return n>3&&t&&Object.defineProperty(e,r,t),t},C=class extends w{constructor(){super(),this.unsubscribe=[],this.checked=y.state.isLegalCheckboxChecked,this.unsubscribe.push(y.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=m.state,o=m.state.features?.legalCheckbox;return!e&&!r||!o?null:p`
      <wui-checkbox
        ?checked=${this.checked}
        @checkboxChange=${this.onCheckboxChange.bind(this)}
        data-testid="wui-checkbox"
      >
        <wui-text color="fg-250" variant="small-400" align="left">
          I agree to our ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
        </wui-text>
      </wui-checkbox>
    `}andTemplate(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=m.state;return e&&r?"and":""}termsTemplate(){let{termsConditionsUrl:e}=m.state;return e?p`<a rel="noreferrer" target="_blank" href=${e}>terms of service</a>`:null}privacyTemplate(){let{privacyPolicyUrl:e}=m.state;return e?p`<a rel="noreferrer" target="_blank" href=${e}>privacy policy</a>`:null}onCheckboxChange(){y.setIsLegalCheckboxChecked(!this.checked)}};C.styles=[L];W([g()],C.prototype,"checked",void 0);C=W([x("w3m-legal-checkbox")],C);i();c();l();i();c();l();i();c();l();i();c();l();var F=b`
  .reown-logo {
    height: var(--wui-spacing-xxl);
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    opacity: 0.9;
  }
`;var z=function(s,e,r,o){var n=arguments.length,t=n<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(s,e,r,o);else for(var u=s.length-1;u>=0;u--)(a=s[u])&&(t=(n<3?a(t):n>3?a(e,r,t):a(e,r))||t);return n>3&&t&&Object.defineProperty(e,r,t),t},R=class extends w{render(){return p`
      <a
        data-testid="ux-branding-reown"
        href=${T}
        rel="noreferrer"
        target="_blank"
        style="text-decoration: none;"
      >
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="xs"
          .padding=${["0","0","l","0"]}
        >
          <wui-text variant="small-500" color="fg-100"> UX by </wui-text>
          <wui-icon name="reown" size="xxxl" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};R.styles=[v,P,F];R=z([x("wui-ux-by-reown")],R);i();c();l();var D=b`
  :host > wui-flex {
    background-color: var(--wui-color-gray-glass-005);
  }

  :host wui-ux-by-reown {
    padding-top: 0;
  }

  :host wui-ux-by-reown.branding-only {
    padding-top: var(--wui-spacing-m);
  }

  a {
    text-decoration: none;
    color: var(--wui-color-fg-175);
    font-weight: 500;
  }
`;var S=function(s,e,r,o){var n=arguments.length,t=n<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(s,e,r,o);else for(var u=s.length-1;u>=0;u--)(a=s[u])&&(t=(n<3?a(t):n>3?a(e,r,t):a(e,r))||t);return n>3&&t&&Object.defineProperty(e,r,t),t},_=class extends w{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=m.state.remoteFeatures,this.unsubscribe.push(m.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=m.state,o=m.state.features?.legalCheckbox;return!e&&!r||o?p`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `:p`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["m","s","s","s"]} justifyContent="center">
          <wui-text color="fg-250" variant="small-400" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}andTemplate(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=m.state;return e&&r?"and":""}termsTemplate(){let{termsConditionsUrl:e}=m.state;return e?p`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Terms of Service</a
    >`:null}privacyTemplate(){let{privacyPolicyUrl:e}=m.state;return e?p`<a href=${e} target="_blank" rel="noopener noreferrer"
      >Privacy Policy</a
    >`:null}reownBrandingTemplate(e=!1){return this.remoteFeatures?.reownBranding?e?p`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:p`<wui-ux-by-reown></wui-ux-by-reown>`:null}};_.styles=[D];S([g()],_.prototype,"remoteFeatures",void 0);_=S([x("w3m-legal-footer")],_);
