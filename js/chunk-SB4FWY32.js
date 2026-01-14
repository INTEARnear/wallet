import{c as w,d as v,e as x,h as g}from"./chunk-LTN6YROF.js";import{a}from"./chunk-IDZGCU4F.js";import{b as m,e as f,k as h}from"./chunk-ZS2R6O6N.js";import{i as r,k as s,o as n}from"./chunk-JY5TIRRF.js";r();n();s();r();n();s();r();n();s();var R=m`
  button {
    border-radius: var(--local-border-radius);
    color: var(--wui-color-fg-100);
    padding: var(--local-padding);
  }

  @media (max-width: 700px) {
    :host(:not([size='sm'])) button {
      padding: var(--wui-spacing-s);
    }
  }

  button > wui-icon {
    pointer-events: none;
  }

  button:disabled > wui-icon {
    color: var(--wui-color-bg-300) !important;
  }

  button:disabled {
    background-color: transparent;
  }
`;var l=function(d,o,i,c){var u=arguments.length,t=u<3?o:c===null?c=Object.getOwnPropertyDescriptor(o,i):c,p;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(d,o,i,c);else for(var b=d.length-1;b>=0;b--)(p=d[b])&&(t=(u<3?p(t):u>3?p(o,i,t):p(o,i))||t);return u>3&&t&&Object.defineProperty(o,i,t),t},e=class extends h{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){this.dataset.size=this.size;let o="",i="";switch(this.size){case"lg":o="--wui-border-radius-xs",i="--wui-spacing-1xs";break;case"sm":o="--wui-border-radius-3xs",i="--wui-spacing-xxs";break;default:o="--wui-border-radius-xxs",i="--wui-spacing-2xs";break}return this.style.cssText=`
    --local-border-radius: var(${o});
    --local-padding: var(${i});
    `,f`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};e.styles=[w,v,x,R];l([a()],e.prototype,"size",void 0);l([a({type:Boolean})],e.prototype,"disabled",void 0);l([a()],e.prototype,"icon",void 0);l([a()],e.prototype,"iconColor",void 0);e=l([g("wui-icon-link")],e);
