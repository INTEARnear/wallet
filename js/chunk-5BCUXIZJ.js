import{c as g,e as v,h as j}from"./chunk-LTN6YROF.js";import{a as r}from"./chunk-IDZGCU4F.js";import{b as f,e as u,k as b}from"./chunk-ZS2R6O6N.js";import{i as n,k as p,o as m}from"./chunk-JY5TIRRF.js";n();m();p();n();m();p();var y=f`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-object-fit='cover']) img {
    object-fit: cover;
    object-position: center center;
  }

  :host([data-object-fit='contain']) img {
    object-fit: contain;
    object-position: center center;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }
`;var s=function(c,i,o,h){var a=arguments.length,t=a<3?i:h===null?h=Object.getOwnPropertyDescriptor(i,o):h,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(c,i,o,h);else for(var d=c.length-1;d>=0;d--)(l=c[d])&&(t=(a<3?l(t):a>3?l(i,o,t):l(i,o))||t);return a>3&&t&&Object.defineProperty(i,o,t),t},e=class extends b{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0,this.objectFit="cover"}render(){return this.objectFit&&(this.dataset.objectFit=this.objectFit),this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      `,u`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};e.styles=[g,v,y];s([r()],e.prototype,"src",void 0);s([r()],e.prototype,"alt",void 0);s([r()],e.prototype,"size",void 0);s([r()],e.prototype,"objectFit",void 0);e=s([j("wui-image")],e);
