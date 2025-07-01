import{a as d}from"./chunk-HILJYRBB.js";import{U as x,V as w,Z as b}from"./chunk-UDTBWQKV.js";import{b as h,e as c,j as f}from"./chunk-5RP2GFJC.js";import{h as o,j as e,n as i}from"./chunk-KGCAX4NX.js";o();i();e();o();i();e();o();i();e();var S=h`
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
`;var g=function(a,r,s,u){var p=arguments.length,t=p<3?r:u===null?u=Object.getOwnPropertyDescriptor(r,s):u,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(a,r,s,u);else for(var m=a.length-1;m>=0;m--)(l=a[m])&&(t=(p<3?l(t):p>3?l(r,s,t):l(r,s))||t);return p>3&&t&&Object.defineProperty(r,s,t),t},n=class extends f{constructor(){super(...arguments),this.text=""}render(){return c`
      <button>
        ${this.tokenTemplate()}
        <wui-text variant="paragraph-600" color="fg-100">${this.text}</wui-text>
      </button>
    `}tokenTemplate(){return this.imageSrc?c`<wui-image src=${this.imageSrc}></wui-image>`:c`
      <wui-icon-box
        size="sm"
        iconColor="fg-200"
        backgroundColor="fg-300"
        icon="networkPlaceholder"
      ></wui-icon-box>
    `}};n.styles=[x,w,S];g([d()],n.prototype,"imageSrc",void 0);g([d()],n.prototype,"text",void 0);n=g([b("wui-token-button")],n);
