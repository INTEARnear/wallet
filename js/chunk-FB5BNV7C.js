import{c as u,h as v}from"./chunk-LTN6YROF.js";import{a as p}from"./chunk-IDZGCU4F.js";import{b as m,e as g,k as x}from"./chunk-ZS2R6O6N.js";import{i as n,k as l,o as c}from"./chunk-JY5TIRRF.js";n();c();l();n();c();l();var y=m`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;var f=function(r,e,s,i){var a=arguments.length,t=a<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,s):i,h;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(r,e,s,i);else for(var d=r.length-1;d>=0;d--)(h=r[d])&&(t=(a<3?h(t):a>3?h(e,s,t):h(e,s))||t);return a>3&&t&&Object.defineProperty(e,s,t),t},o=class extends x{constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText=`--local-color: ${this.color==="inherit"?"inherit":`var(--wui-color-${this.color})`}`,this.dataset.size=this.size,g`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};o.styles=[u,y];f([p()],o.prototype,"color",void 0);f([p()],o.prototype,"size",void 0);o=f([v("wui-loading-spinner")],o);
