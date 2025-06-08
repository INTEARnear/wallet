import{R as b,S as f,T as h,W as v}from"./chunk-ORERQN7J.js";import{a as e}from"./chunk-G6MGL5IE.js";import{b as p,e as u,j as m}from"./chunk-WGWCH7J2.js";var w=p`
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
`;var n=function(s,o,t,l){var c=arguments.length,i=c<3?o:l===null?l=Object.getOwnPropertyDescriptor(o,t):l,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(s,o,t,l);else for(var a=s.length-1;a>=0;a--)(d=s[a])&&(i=(c<3?d(i):c>3?d(o,t,i):d(o,t))||i);return c>3&&i&&Object.defineProperty(o,t,i),i},r=class extends m{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){let o=this.size==="lg"?"--wui-border-radius-xs":"--wui-border-radius-xxs",t=this.size==="lg"?"--wui-spacing-1xs":"--wui-spacing-2xs";return this.style.cssText=`
    --local-border-radius: var(${o});
    --local-padding: var(${t});
`,u`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};r.styles=[b,f,h,w];n([e()],r.prototype,"size",void 0);n([e({type:Boolean})],r.prototype,"disabled",void 0);n([e()],r.prototype,"icon",void 0);n([e()],r.prototype,"iconColor",void 0);r=n([v("wui-icon-link")],r);
