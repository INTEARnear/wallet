import{a as w}from"./chunk-HILJYRBB.js";import{U as p,Z as v}from"./chunk-UDTBWQKV.js";import{b as m,e as c,j as f}from"./chunk-5RP2GFJC.js";import{h as a,j as n,n as d}from"./chunk-KGCAX4NX.js";a();d();n();a();d();n();a();d();n();var y=m`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var L=function(h,e,o,r){var s=arguments.length,t=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,o):r,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(h,e,o,r);else for(var l=h.length-1;l>=0;l--)(i=h[l])&&(t=(s<3?i(t):s>3?i(e,o,t):i(e,o))||t);return s>3&&t&&Object.defineProperty(e,o,t),t},u=class extends f{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){let e=this.radius>50?50:this.radius,r=36-e,s=116+r,t=245+r,i=360+r*1.75;return c`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${e}
          stroke-dasharray="${s} ${t}"
          stroke-dashoffset=${i}
        />
      </svg>
    `}};u.styles=[p,y];L([w({type:Number})],u.prototype,"radius",void 0);u=L([v("wui-loading-thumbnail")],u);
