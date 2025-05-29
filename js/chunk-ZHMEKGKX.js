import{a as s,f as x}from"./chunk-KGK2MHEY.js";import{aa as d,ba as w,fa as g}from"./chunk-SGMZUJCA.js";import{b as f,e as c,j as m}from"./chunk-WGWCH7J2.js";var b=f`
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
`;var v=function(i,o,e,r){var l=arguments.length,t=l<3?o:r===null?r=Object.getOwnPropertyDescriptor(o,e):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(i,o,e,r);else for(var p=i.length-1;p>=0;p--)(n=i[p])&&(t=(l<3?n(t):l>3?n(o,e,t):n(o,e))||t);return l>3&&t&&Object.defineProperty(o,e,t),t},h=class extends m{constructor(){super(...arguments),this.logo="google"}render(){return c`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `}};h.styles=[d,b];v([s()],h.prototype,"logo",void 0);h=v([g("wui-logo")],h);var y=f`
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
`;var u=function(i,o,e,r){var l=arguments.length,t=l<3?o:r===null?r=Object.getOwnPropertyDescriptor(o,e):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(i,o,e,r);else for(var p=i.length-1;p>=0;p--)(n=i[p])&&(t=(l<3?n(t):l>3?n(o,e,t):n(o,e))||t);return l>3&&t&&Object.defineProperty(o,e,t),t},a=class extends m{constructor(){super(...arguments),this.logo="google",this.name="Continue with google",this.align="left",this.disabled=!1}render(){return c`
      <button ?disabled=${this.disabled} tabindex=${x(this.tabIdx)}>
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
    `}templatePlacement(){return this.align==="center"?c` <wui-logo class="invisible" logo=${this.logo}></wui-logo>`:null}};a.styles=[d,w,y];u([s()],a.prototype,"logo",void 0);u([s()],a.prototype,"name",void 0);u([s()],a.prototype,"align",void 0);u([s()],a.prototype,"tabIdx",void 0);u([s({type:Boolean})],a.prototype,"disabled",void 0);a=u([g("wui-list-social")],a);
