import{h as v}from"./chunk-LTN6YROF.js";import{a as e}from"./chunk-IDZGCU4F.js";import{b as g,e as m,k as b}from"./chunk-ZS2R6O6N.js";import{i as n,k as d,o as h}from"./chunk-JY5TIRRF.js";n();h();d();n();h();d();var w=g`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  :host([variant='light']) {
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-150) 5%,
      var(--wui-color-bg-150) 48%,
      var(--wui-color-bg-200) 55%,
      var(--wui-color-bg-200) 60%,
      var(--wui-color-bg-200) calc(60% + 10px),
      var(--wui-color-bg-150) calc(60% + 12px),
      var(--wui-color-bg-150) 100%
    );
    background-size: 250%;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`;var a=function(s,i,t,l){var c=arguments.length,r=c<3?i:l===null?l=Object.getOwnPropertyDescriptor(i,t):l,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(s,i,t,l);else for(var p=s.length-1;p>=0;p--)(u=s[p])&&(r=(c<3?u(r):c>3?u(i,t,r):u(i,t))||r);return c>3&&r&&Object.defineProperty(i,t,r),r},o=class extends b{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m",this.variant="default"}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
      border-radius: ${`clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px)`};
    `,m`<slot></slot>`}};o.styles=[w];a([e()],o.prototype,"width",void 0);a([e()],o.prototype,"height",void 0);a([e()],o.prototype,"borderRadius",void 0);a([e()],o.prototype,"variant",void 0);o=a([v("wui-shimmer")],o);
