import{R as b,S as x,W as h}from"./chunk-ORERQN7J.js";import{a,g as f}from"./chunk-G6MGL5IE.js";import{b as u,e as p,j as m}from"./chunk-WGWCH7J2.js";var v=u`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var c=function(i,o,e,l){var n=arguments.length,t=n<3?o:l===null?l=Object.getOwnPropertyDescriptor(o,e):l,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(i,o,e,l);else for(var d=i.length-1;d>=0;d--)(s=i[d])&&(t=(n<3?s(t):n>3?s(o,e,t):s(o,e))||t);return n>3&&t&&Object.defineProperty(o,e,t),t},r=class extends m{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return p`
      <button ?disabled=${this.disabled} tabindex=${f(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};r.styles=[b,x,v];c([a()],r.prototype,"tabIdx",void 0);c([a({type:Boolean})],r.prototype,"disabled",void 0);c([a()],r.prototype,"color",void 0);r=c([h("wui-link")],r);
