import{a,g as y}from"./chunk-HILJYRBB.js";import{U as x,Z as w}from"./chunk-UDTBWQKV.js";import{b as v,e as c,j as h}from"./chunk-5RP2GFJC.js";import{h as i,j as o,n as l}from"./chunk-KGCAX4NX.js";i();l();o();i();l();o();i();l();o();var I=v`
  :host {
    position: relative;
    display: inline-block;
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var s=function(n,r,p,m){var u=arguments.length,t=u<3?r:m===null?m=Object.getOwnPropertyDescriptor(r,p):m,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,r,p,m);else for(var f=n.length-1;f>=0;f--)(d=n[f])&&(t=(u<3?d(t):u>3?d(r,p,t):d(r,p))||t);return u>3&&t&&Object.defineProperty(r,p,t),t},e=class extends h{constructor(){super(...arguments),this.disabled=!1}render(){return c`
      <wui-input-text
        type="email"
        placeholder="Email"
        icon="mail"
        size="mdl"
        .disabled=${this.disabled}
        .value=${this.value}
        data-testid="wui-email-input"
        tabIdx=${y(this.tabIdx)}
      ></wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?c`<wui-text variant="tiny-500" color="error-100">${this.errorMessage}</wui-text>`:null}};e.styles=[x,I];s([a()],e.prototype,"errorMessage",void 0);s([a({type:Boolean})],e.prototype,"disabled",void 0);s([a()],e.prototype,"value",void 0);s([a()],e.prototype,"tabIdx",void 0);e=s([w("wui-email-input")],e);
