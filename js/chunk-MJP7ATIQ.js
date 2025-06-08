import{a as f}from"./chunk-G6MGL5IE.js";import{U as m,Z as c}from"./chunk-AXPE5NAX.js";import{b as h,e as u,j as l}from"./chunk-WGWCH7J2.js";var p=h`
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
`;var v=function(a,e,o,r){var s=arguments.length,t=s<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,o):r,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(a,e,o,r);else for(var d=a.length-1;d>=0;d--)(i=a[d])&&(t=(s<3?i(t):s>3?i(e,o,t):i(e,o))||t);return s>3&&t&&Object.defineProperty(e,o,t),t},n=class extends l{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){let e=this.radius>50?50:this.radius,r=36-e,s=116+r,t=245+r,i=360+r*1.75;return u`
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
    `}};n.styles=[m,p];v([f({type:Number})],n.prototype,"radius",void 0);n=v([c("wui-loading-thumbnail")],n);
