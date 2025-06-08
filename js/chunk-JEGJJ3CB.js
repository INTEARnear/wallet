import{R as m,W as g}from"./chunk-ORERQN7J.js";import{a as l}from"./chunk-G6MGL5IE.js";import{b as d,e as p,j as f}from"./chunk-WGWCH7J2.js";var x=d`
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
`;var c=function(r,e,s,i){var a=arguments.length,t=a<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,s):i,h;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(r,e,s,i);else for(var n=r.length-1;n>=0;n--)(h=r[n])&&(t=(a<3?h(t):a>3?h(e,s,t):h(e,s))||t);return a>3&&t&&Object.defineProperty(e,s,t),t},o=class extends f{constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText=`--local-color: ${this.color==="inherit"?"inherit":`var(--wui-color-${this.color})`}`,this.dataset.size=this.size,p`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};o.styles=[m,x];c([l()],o.prototype,"color",void 0);c([l()],o.prototype,"size",void 0);o=c([g("wui-loading-spinner")],o);
