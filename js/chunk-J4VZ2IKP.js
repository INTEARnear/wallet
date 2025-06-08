import{R as u,T as f,W as g}from"./chunk-ORERQN7J.js";import{a as h}from"./chunk-G6MGL5IE.js";import{b as m,e as p,j as d}from"./chunk-WGWCH7J2.js";var v=m`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;var n=function(o,e,i,s){var l=arguments.length,t=l<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,i):s,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,i,s);else for(var a=o.length-1;a>=0;a--)(c=o[a])&&(t=(l<3?c(t):l>3?c(e,i,t):c(e,i))||t);return l>3&&t&&Object.defineProperty(e,i,t),t},r=class extends d{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      `,p`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};r.styles=[u,f,v];n([h()],r.prototype,"src",void 0);n([h()],r.prototype,"alt",void 0);n([h()],r.prototype,"size",void 0);r=n([g("wui-image")],r);
