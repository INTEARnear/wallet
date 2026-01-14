import{a as d}from"./chunk-ZYZOIEZB.js";import{r as x,v as b,z as w}from"./chunk-RZQOM5QR.js";import{a as p}from"./chunk-IDZGCU4F.js";import{e as g,k as y}from"./chunk-ZS2R6O6N.js";import{H as m,S as $,j as v}from"./chunk-OXOEMY67.js";import{i as a,k as n,o as s}from"./chunk-JY5TIRRF.js";a();s();n();var _={getTabsByNamespace(t){return!!t&&t===v.CHAIN.EVM?m.state.remoteFeatures?.activity===!1?d.ACCOUNT_TABS.filter(r=>r.label!=="Activity"):d.ACCOUNT_TABS:[]},isValidReownName(t){return/^[a-zA-Z0-9]+$/gu.test(t)},isValidEmail(t){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/gu.test(t)},validateReownName(t){return t.replace(/\^/gu,"").toLowerCase().replace(/[^a-zA-Z0-9]/gu,"")},hasFooter(){let t=$.state.view;if(d.VIEWS_WITH_LEGAL_FOOTER.includes(t)){let{termsConditionsUrl:e,privacyPolicyUrl:r}=m.state,i=m.state.features?.legalCheckbox;return!(!e&&!r||i)}return d.VIEWS_WITH_DEFAULT_FOOTER.includes(t)}};a();s();n();a();s();n();var A=x`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({spacing:t})=>t[1]};
    text-transform: uppercase;
    white-space: nowrap;
  }

  :host([data-variant='accent']) {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
    color: ${({tokens:t})=>t.core.textAccentPrimary};
  }

  :host([data-variant='info']) {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  :host([data-variant='success']) {
    background-color: ${({tokens:t})=>t.core.backgroundSuccess};
    color: ${({tokens:t})=>t.core.textSuccess};
  }

  :host([data-variant='warning']) {
    background-color: ${({tokens:t})=>t.core.backgroundWarning};
    color: ${({tokens:t})=>t.core.textWarning};
  }

  :host([data-variant='error']) {
    background-color: ${({tokens:t})=>t.core.backgroundError};
    color: ${({tokens:t})=>t.core.textError};
  }

  :host([data-variant='certified']) {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  :host([data-size='md']) {
    height: 30px;
    padding: 0 ${({spacing:t})=>t[2]};
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  :host([data-size='sm']) {
    height: 20px;
    padding: 0 ${({spacing:t})=>t[1]};
    border-radius: ${({borderRadius:t})=>t[1]};
  }
`;var h=function(t,e,r,i){var l=arguments.length,o=l<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,r,i);else for(var f=t.length-1;f>=0;f--)(u=t[f])&&(o=(l<3?u(o):l>3?u(e,r,o):u(e,r))||o);return l>3&&o&&Object.defineProperty(e,r,o),o},c=class extends y{constructor(){super(...arguments),this.variant="accent",this.size="md",this.icon=void 0}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;let e=this.size==="md"?"md-medium":"sm-medium",r=this.size==="md"?"md":"sm";return g`
      ${this.icon?g`<wui-icon size=${r} name=${this.icon}></wui-icon>`:null}
      <wui-text
        display="inline"
        data-variant=${this.variant}
        variant=${e}
        color="inherit"
      >
        <slot></slot>
      </wui-text>
    `}};c.styles=[b,A];h([p()],c.prototype,"variant",void 0);h([p()],c.prototype,"size",void 0);h([p()],c.prototype,"icon",void 0);c=h([w("wui-tag")],c);export{_ as a};
