import{a as d}from"./chunk-G6MGL5IE.js";import{U as m,Z as f}from"./chunk-AXPE5NAX.js";import{b as u,e as s,j as c}from"./chunk-WGWCH7J2.js";var h=u`
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
`;var x=function(o,e,r,i){var l=arguments.length,t=l<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,r):i,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,r,i);else for(var p=o.length-1;p>=0;p--)(n=o[p])&&(t=(l<3?n(t):l>3?n(e,r,t):n(e,r))||t);return l>3&&t&&Object.defineProperty(e,r,t),t},a=class extends c{constructor(){super(...arguments),this.text=""}render(){return s`${this.template()}`}template(){return this.text?s`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`:null}};a.styles=[m,h];x([d()],a.prototype,"text",void 0);a=x([f("wui-separator")],a);
