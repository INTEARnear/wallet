import{a as o,g as h}from"./chunk-G6MGL5IE.js";import{U as c,Z as v}from"./chunk-AXPE5NAX.js";import{b as d,e as u,j as f}from"./chunk-WGWCH7J2.js";var x=d`
  :host {
    position: relative;
    display: inline-block;
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var l=function(p,r,i,a){var s=arguments.length,t=s<3?r:a===null?a=Object.getOwnPropertyDescriptor(r,i):a,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(p,r,i,a);else for(var m=p.length-1;m>=0;m--)(n=p[m])&&(t=(s<3?n(t):s>3?n(r,i,t):n(r,i))||t);return s>3&&t&&Object.defineProperty(r,i,t),t},e=class extends f{constructor(){super(...arguments),this.disabled=!1}render(){return u`
      <wui-input-text
        type="email"
        placeholder="Email"
        icon="mail"
        size="mdl"
        .disabled=${this.disabled}
        .value=${this.value}
        data-testid="wui-email-input"
        tabIdx=${h(this.tabIdx)}
      ></wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?u`<wui-text variant="tiny-500" color="error-100">${this.errorMessage}</wui-text>`:null}};e.styles=[c,x];l([o()],e.prototype,"errorMessage",void 0);l([o({type:Boolean})],e.prototype,"disabled",void 0);l([o()],e.prototype,"value",void 0);l([o()],e.prototype,"tabIdx",void 0);e=l([v("wui-email-input")],e);
