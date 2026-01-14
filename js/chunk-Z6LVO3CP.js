import{r as y,z as g}from"./chunk-RZQOM5QR.js";import{a as n}from"./chunk-IDZGCU4F.js";import{e as f,k as c}from"./chunk-ZS2R6O6N.js";import{i as a,k as u,o as l}from"./chunk-JY5TIRRF.js";a();l();u();a();l();u();var b=y`
  :host {
    display: block;
    background: linear-gradient(
      90deg,
      ${({tokens:e})=>e.theme.foregroundPrimary} 0%,
      ${({tokens:e})=>e.theme.foregroundSecondary} 50%,
      ${({tokens:e})=>e.theme.foregroundPrimary} 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
    border-radius: ${({borderRadius:e})=>e[1]};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  @keyframes shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;var s=function(e,o,i,d){var h=arguments.length,t=h<3?o:d===null?d=Object.getOwnPropertyDescriptor(o,i):d,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(e,o,i,d);else for(var p=e.length-1;p>=0;p--)(m=e[p])&&(t=(h<3?m(t):h>3?m(o,i,t):m(o,i))||t);return h>3&&t&&Object.defineProperty(o,i,t),t},r=class extends c{constructor(){super(...arguments),this.width="",this.height="",this.variant="default",this.rounded=!1}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
    `,this.dataset.rounded=this.rounded?"true":"false",f`<slot></slot>`}};r.styles=[b];s([n()],r.prototype,"width",void 0);s([n()],r.prototype,"height",void 0);s([n()],r.prototype,"variant",void 0);s([n({type:Boolean})],r.prototype,"rounded",void 0);r=s([g("wui-shimmer")],r);
