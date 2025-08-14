import{R as w,S as _,W as x}from"./chunk-WYPOXQ7L.js";import{a as u,g as $}from"./chunk-HILJYRBB.js";import{b as g,e as d,j as h}from"./chunk-5RP2GFJC.js";import{h as i,j as r,n as l}from"./chunk-KGCAX4NX.js";i();l();r();i();l();r();var L=g`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-005);
    overflow: hidden;
  }

  wui-icon {
    width: 100%;
    height: 100%;
  }
`;var O=function(n,o,e,s){var a=arguments.length,t=a<3?o:s===null?s=Object.getOwnPropertyDescriptor(o,e):s,p;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,o,e,s);else for(var f=n.length-1;f>=0;f--)(p=n[f])&&(t=(a<3?p(t):a>3?p(o,e,t):p(o,e))||t);return a>3&&t&&Object.defineProperty(o,e,t),t},j=class extends h{constructor(){super(...arguments),this.logo="google"}render(){return d`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `}};j.styles=[w,L];O([u()],j.prototype,"logo",void 0);j=O([x("wui-logo")],j);i();l();r();i();l();r();i();l();r();var P=g`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    justify-content: flex-start;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-text[data-align='left'] {
    display: flex;
    flex: 1;
  }

  wui-text[data-align='center'] {
    display: flex;
    flex: 1;
    justify-content: center;
  }

  .invisible {
    opacity: 0;
    pointer-events: none;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }
`;var m=function(n,o,e,s){var a=arguments.length,t=a<3?o:s===null?s=Object.getOwnPropertyDescriptor(o,e):s,p;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,o,e,s);else for(var f=n.length-1;f>=0;f--)(p=n[f])&&(t=(a<3?p(t):a>3?p(o,e,t):p(o,e))||t);return a>3&&t&&Object.defineProperty(o,e,t),t},c=class extends h{constructor(){super(...arguments),this.logo="google",this.name="Continue with google",this.align="left",this.disabled=!1}render(){return d`
      <button ?disabled=${this.disabled} tabindex=${$(this.tabIdx)}>
        <wui-logo logo=${this.logo}></wui-logo>
        <wui-text
          data-align=${this.align}
          variant="paragraph-500"
          color="inherit"
          align=${this.align}
          >${this.name}</wui-text
        >
        ${this.templatePlacement()}
      </button>
    `}templatePlacement(){return this.align==="center"?d` <wui-logo class="invisible" logo=${this.logo}></wui-logo>`:null}};c.styles=[w,_,P];m([u()],c.prototype,"logo",void 0);m([u()],c.prototype,"name",void 0);m([u()],c.prototype,"align",void 0);m([u()],c.prototype,"tabIdx",void 0);m([u({type:Boolean})],c.prototype,"disabled",void 0);c=m([x("wui-list-social")],c);
