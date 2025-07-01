import{a as m}from"./chunk-HILJYRBB.js";import{U as v,W as b,Z as y}from"./chunk-UDTBWQKV.js";import{b as u,e as f,j as g}from"./chunk-5RP2GFJC.js";import{h,j as n,n as a}from"./chunk-KGCAX4NX.js";h();a();n();h();a();n();var w=u`
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
`;var p=function(o,e,i,s){var l=arguments.length,t=l<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,i):s,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,i,s);else for(var d=o.length-1;d>=0;d--)(c=o[d])&&(t=(l<3?c(t):l>3?c(e,i,t):c(e,i))||t);return l>3&&t&&Object.defineProperty(e,i,t),t},r=class extends g{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      `,f`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};r.styles=[v,b,w];p([m()],r.prototype,"src",void 0);p([m()],r.prototype,"alt",void 0);p([m()],r.prototype,"size",void 0);r=p([y("wui-image")],r);
