import{R as w,S as L,W as R}from"./chunk-WYPOXQ7L.js";import{a as u,g as y}from"./chunk-HILJYRBB.js";import{b as h,e as v,j as g}from"./chunk-5RP2GFJC.js";import{h as o,j as r,n as e}from"./chunk-KGCAX4NX.js";o();e();r();o();e();r();o();e();r();o();e();r();var _=h`
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
