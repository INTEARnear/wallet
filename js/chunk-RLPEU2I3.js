import{a as y}from"./chunk-B2LU4KHT.js";import{r as g,v as x,z as b}from"./chunk-RZQOM5QR.js";import{a as o}from"./chunk-IDZGCU4F.js";import{e as p,k as f}from"./chunk-ZS2R6O6N.js";import{i as h,k as c,o as u}from"./chunk-JY5TIRRF.js";h();u();c();h();u();c();var v=g`
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
    user-select: none;
    user-drag: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }

  :host([data-boxed='true']) {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({tokens:e})=>e.theme.foregroundPrimary};
    border-radius: ${({borderRadius:e})=>e[2]};
  }

  :host([data-boxed='true']) img {
    width: 20px;
    height: 20px;
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  :host([data-full='true']) img {
    width: 100%;
    height: 100%;
  }

  :host([data-boxed='true']) wui-icon {
    width: 20px;
    height: 20px;
  }

  :host([data-icon='error']) {
    background-color: ${({tokens:e})=>e.core.backgroundError};
  }

  :host([data-rounded='true']) {
    border-radius: ${({borderRadius:e})=>e[16]};
  }
`;var i=function(e,r,n,a){var l=arguments.length,s=l<3?r:a===null?a=Object.getOwnPropertyDescriptor(r,n):a,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,r,n,a);else for(var m=e.length-1;m>=0;m--)(d=e[m])&&(s=(l<3?d(s):l>3?d(r,n,s):d(r,n))||s);return l>3&&s&&Object.defineProperty(r,n,s),s},t=class extends f{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0,this.boxed=!1,this.rounded=!1,this.fullSize=!1}render(){let r={inherit:"inherit",xxs:"2",xs:"3",sm:"4",md:"4",mdl:"5",lg:"5",xl:"6",xxl:"7","3xl":"8","4xl":"9","5xl":"10"};return this.style.cssText=`
      --local-width: ${this.size?`var(--apkt-spacing-${r[this.size]});`:"100%"};
      --local-height: ${this.size?`var(--apkt-spacing-${r[this.size]});`:"100%"};
      `,this.dataset.boxed=this.boxed?"true":"false",this.dataset.rounded=this.rounded?"true":"false",this.dataset.full=this.fullSize?"true":"false",this.dataset.icon=this.iconColor||"inherit",this.icon?p`<wui-icon
        color=${this.iconColor||"inherit"}
        name=${this.icon}
        size="lg"
      ></wui-icon> `:this.logo?p`<wui-icon size="lg" color="inherit" name=${this.logo}></wui-icon> `:p`<img src=${y(this.src)} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};t.styles=[x,v];i([o()],t.prototype,"src",void 0);i([o()],t.prototype,"logo",void 0);i([o()],t.prototype,"icon",void 0);i([o()],t.prototype,"iconColor",void 0);i([o()],t.prototype,"alt",void 0);i([o()],t.prototype,"size",void 0);i([o({type:Boolean})],t.prototype,"boxed",void 0);i([o({type:Boolean})],t.prototype,"rounded",void 0);i([o({type:Boolean})],t.prototype,"fullSize",void 0);t=i([b("wui-image")],t);
