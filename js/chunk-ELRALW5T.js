import{a as l}from"./chunk-G6MGL5IE.js";import{U as g,V as h,Z as f}from"./chunk-AXPE5NAX.js";import{b as m,e as u,j as d}from"./chunk-WGWCH7J2.js";var x=m`
  :host {
    display: block;
  }

  :host > button {
    gap: var(--wui-spacing-xxs);
    padding: var(--wui-spacing-xs);
    padding-right: var(--wui-spacing-1xs);
    height: 40px;
    border-radius: var(--wui-border-radius-l);
    background: var(--wui-color-gray-glass-002);
    border-width: 0px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
  }

  :host > button wui-image {
    width: 24px;
    height: 24px;
    border-radius: var(--wui-border-radius-s);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }
`;var c=function(i,r,o,s){var n=arguments.length,t=n<3?r:s===null?s=Object.getOwnPropertyDescriptor(r,o):s,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(i,r,o,s);else for(var p=i.length-1;p>=0;p--)(a=i[p])&&(t=(n<3?a(t):n>3?a(r,o,t):a(r,o))||t);return n>3&&t&&Object.defineProperty(r,o,t),t},e=class extends d{constructor(){super(...arguments),this.text=""}render(){return u`
      <button>
        ${this.tokenTemplate()}
        <wui-text variant="paragraph-600" color="fg-100">${this.text}</wui-text>
      </button>
    `}tokenTemplate(){return this.imageSrc?u`<wui-image src=${this.imageSrc}></wui-image>`:u`
      <wui-icon-box
        size="sm"
        iconColor="fg-200"
        backgroundColor="fg-300"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};e.styles=[g,h,x];c([l()],e.prototype,"imageSrc",void 0);c([l()],e.prototype,"text",void 0);e=c([f("wui-token-button")],e);
