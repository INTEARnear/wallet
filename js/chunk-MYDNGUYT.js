import{c as _}from"./chunk-NJ72WSLJ.js";import{a as k,b as C}from"./chunk-QCS24RLY.js";import{a as v,b as d,g as R}from"./chunk-G6MGL5IE.js";import{O as f,U as h,V as y,Z as m,m as a}from"./chunk-AXPE5NAX.js";import{b as u,e as s,j as p}from"./chunk-WGWCH7J2.js";var $=u`
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
`;var E=function(n,e,r,o){var i=arguments.length,t=i<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,o);else for(var c=n.length-1;c>=0;c--)(l=n[c])&&(t=(i<3?l(t):i>3?l(e,r,t):l(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t},b=class extends p{constructor(){super(...arguments),this.inputElementRef=k(),this.checked=void 0}render(){return s`
      <label>
        <input
          ${C(this.inputElementRef)}
          ?checked=${R(this.checked)}
          type="checkbox"
          @change=${this.dispatchChangeEvent}
        />
        <span>
          <wui-icon name="checkmarkBold" color="inverse-100" size="xxs"></wui-icon>
        </span>
        <slot></slot>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("checkboxChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};b.styles=[h,$];E([v({type:Boolean})],b.prototype,"checked",void 0);b=E([m("wui-checkbox")],b);var O=u`
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
`;var j=function(n,e,r,o){var i=arguments.length,t=i<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,o);else for(var c=n.length-1;c>=0;c--)(l=n[c])&&(t=(i<3?l(t):i>3?l(e,r,t):l(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t},w=class extends p{constructor(){super(),this.unsubscribe=[],this.checked=f.state.isLegalCheckboxChecked,this.unsubscribe.push(f.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=a.state,o=a.state.features?.legalCheckbox;return!e&&!r||!o?null:s`
      <wui-checkbox
        ?checked=${this.checked}
        @checkboxChange=${this.onCheckboxChange.bind(this)}
        data-testid="wui-checkbox"
      >
        <wui-text color="fg-250" variant="small-400" align="left">
          I agree to our ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
        </wui-text>
      </wui-checkbox>
    `}andTemplate(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=a.state;return e&&r?"and":""}termsTemplate(){let{termsConditionsUrl:e}=a.state;return e?s`<a rel="noreferrer" target="_blank" href=${e}>terms of service</a>`:null}privacyTemplate(){let{privacyPolicyUrl:e}=a.state;return e?s`<a rel="noreferrer" target="_blank" href=${e}>privacy policy</a>`:null}onCheckboxChange(){f.setIsLegalCheckboxChecked(!this.checked)}};w.styles=[O];j([d()],w.prototype,"checked",void 0);w=j([m("w3m-legal-checkbox")],w);var P=u`
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
`;var B=function(n,e,r,o){var i=arguments.length,t=i<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,o);else for(var c=n.length-1;c>=0;c--)(l=n[c])&&(t=(i<3?l(t):i>3?l(e,r,t):l(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t},g=class extends p{render(){return s`
      <a
        data-testid="ux-branding-reown"
        href=${_}
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
    `}};g.styles=[h,y,P];g=B([m("wui-ux-by-reown")],g);var T=u`
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
`;var U=function(n,e,r,o){var i=arguments.length,t=i<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,r):o,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,r,o);else for(var c=n.length-1;c>=0;c--)(l=n[c])&&(t=(i<3?l(t):i>3?l(e,r,t):l(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t},x=class extends p{constructor(){super(),this.unsubscribe=[],this.remoteFeatures=a.state.remoteFeatures,this.unsubscribe.push(a.subscribeKey("remoteFeatures",e=>this.remoteFeatures=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=a.state,o=a.state.features?.legalCheckbox;return!e&&!r||o?s`
        <wui-flex flexDirection="column"> ${this.reownBrandingTemplate(!0)} </wui-flex>
      `:s`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["m","s","s","s"]} justifyContent="center">
          <wui-text color="fg-250" variant="small-400" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        ${this.reownBrandingTemplate()}
      </wui-flex>
    `}andTemplate(){let{termsConditionsUrl:e,privacyPolicyUrl:r}=a.state;return e&&r?"and":""}termsTemplate(){let{termsConditionsUrl:e}=a.state;return e?s`<a href=${e}>Terms of Service</a>`:null}privacyTemplate(){let{privacyPolicyUrl:e}=a.state;return e?s`<a href=${e}>Privacy Policy</a>`:null}reownBrandingTemplate(e=!1){return this.remoteFeatures?.reownBranding?e?s`<wui-ux-by-reown class="branding-only"></wui-ux-by-reown>`:s`<wui-ux-by-reown></wui-ux-by-reown>`:null}};x.styles=[T];U([d()],x.prototype,"remoteFeatures",void 0);x=U([m("w3m-legal-footer")],x);
