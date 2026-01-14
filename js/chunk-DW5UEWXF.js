import{c as w,d as L,h as R}from"./chunk-LTN6YROF.js";import{a as y}from"./chunk-B2LU4KHT.js";import{a as u}from"./chunk-IDZGCU4F.js";import{b as h,e as v,k as g}from"./chunk-ZS2R6O6N.js";import{i as o,k as r,o as e}from"./chunk-JY5TIRRF.js";o();e();r();o();e();r();o();e();r();o();e();r();var _=h`
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
`;var p=function(s,i,n,a){var c=arguments.length,t=c<3?i:a===null?a=Object.getOwnPropertyDescriptor(i,n):a,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(s,i,n,a);else for(var m=s.length-1;m>=0;m--)(d=s[m])&&(t=(c<3?d(t):c>3?d(i,n,t):d(i,n))||t);return c>3&&t&&Object.defineProperty(i,n,t),t},l=class extends g{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return v`
      <button ?disabled=${this.disabled} tabindex=${y(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};l.styles=[w,L,_];p([u()],l.prototype,"tabIdx",void 0);p([u({type:Boolean})],l.prototype,"disabled",void 0);p([u()],l.prototype,"color",void 0);l=p([R("wui-link")],l);
