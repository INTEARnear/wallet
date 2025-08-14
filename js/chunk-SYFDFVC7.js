import{R as v,S as w,T as g,W as y}from"./chunk-WYPOXQ7L.js";import{a as l}from"./chunk-HILJYRBB.js";import{b,e as f,j as h}from"./chunk-5RP2GFJC.js";import{h as e,j as n,n as s}from"./chunk-KGCAX4NX.js";e();s();n();e();s();n();e();s();n();var R=b`
  button {
    border-radius: var(--local-border-radius);
    color: var(--wui-color-fg-100);
    padding: var(--local-padding);
  }

  @media (max-width: 700px) {
    button {
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
`;var c=function(d,o,t,a){var p=arguments.length,i=p<3?o:a===null?a=Object.getOwnPropertyDescriptor(o,t):a,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(d,o,t,a);else for(var m=d.length-1;m>=0;m--)(u=d[m])&&(i=(p<3?u(i):p>3?u(o,t,i):u(o,t))||i);return p>3&&i&&Object.defineProperty(o,t,i),i},r=class extends h{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){let o=this.size==="lg"?"--wui-border-radius-xs":"--wui-border-radius-xxs",t=this.size==="lg"?"--wui-spacing-1xs":"--wui-spacing-2xs";return this.style.cssText=`
    --local-border-radius: var(${o});
    --local-padding: var(${t});
`,f`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};r.styles=[v,w,g,R];c([l()],r.prototype,"size",void 0);c([l({type:Boolean})],r.prototype,"disabled",void 0);c([l()],r.prototype,"icon",void 0);c([l()],r.prototype,"iconColor",void 0);r=c([y("wui-icon-link")],r);
