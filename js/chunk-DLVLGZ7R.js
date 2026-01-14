import{a as y}from"./chunk-B2LU4KHT.js";import{v as b,z as x}from"./chunk-RZQOM5QR.js";import{a as s}from"./chunk-IDZGCU4F.js";import{b as h,e as c,k as v}from"./chunk-ZS2R6O6N.js";import{i,k as o,o as l}from"./chunk-JY5TIRRF.js";i();l();o();i();l();o();i();l();o();var I=h`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;var a=function(m,r,p,n){var u=arguments.length,t=u<3?r:n===null?n=Object.getOwnPropertyDescriptor(r,p):n,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(m,r,p,n);else for(var f=m.length-1;f>=0;f--)(d=m[f])&&(t=(u<3?d(t):u>3?d(r,p,t):d(r,p))||t);return u>3&&t&&Object.defineProperty(r,p,t),t},e=class extends v{constructor(){super(...arguments),this.disabled=!1}render(){return c`
      <wui-input-text
        type="email"
        placeholder="Email"
        icon="mail"
        size="lg"
        .disabled=${this.disabled}
        .value=${this.value}
        data-testid="wui-email-input"
        tabIdx=${y(this.tabIdx)}
      ></wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?c`<wui-text variant="sm-regular" color="error">${this.errorMessage}</wui-text>`:null}};e.styles=[b,I];a([s()],e.prototype,"errorMessage",void 0);a([s({type:Boolean})],e.prototype,"disabled",void 0);a([s()],e.prototype,"value",void 0);a([s()],e.prototype,"tabIdx",void 0);e=a([x("wui-email-input")],e);
