import{c as x,h as g}from"./chunk-LTN6YROF.js";import{a as h}from"./chunk-IDZGCU4F.js";import{b as f,e as m,k as d}from"./chunk-ZS2R6O6N.js";import{i as r,k as o,o as i}from"./chunk-JY5TIRRF.js";r();i();o();r();i();o();r();i();o();var y=f`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: var(--wui-color-gray-glass-005);
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 10px;
    background-color: var(--wui-color-modal-bg);
    transition: background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color;
  }
`;var j=function(n,e,l,a){var p=arguments.length,t=p<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,l):a,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,l,a);else for(var c=n.length-1;c>=0;c--)(s=n[c])&&(t=(p<3?s(t):p>3?s(e,l,t):s(e,l))||t);return p>3&&t&&Object.defineProperty(e,l,t),t},u=class extends d{constructor(){super(...arguments),this.text=""}render(){return m`${this.template()}`}template(){return this.text?m`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`:null}};u.styles=[x,y];j([h()],u.prototype,"text",void 0);u=j([g("wui-separator")],u);
