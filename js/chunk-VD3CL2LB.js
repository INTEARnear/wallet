import{R as v,S as x,W as f}from"./chunk-WYPOXQ7L.js";import{a as t,g as m}from"./chunk-HILJYRBB.js";import{b as w,e as n,j as g}from"./chunk-5RP2GFJC.js";import{h as u,j as l,n as c}from"./chunk-KGCAX4NX.js";u();c();l();u();c();l();u();c();l();var z=w`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;var o=function(d,r,a,s){var p=arguments.length,e=p<3?r:s===null?s=Object.getOwnPropertyDescriptor(r,a):s,h;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(d,r,a,s);else for(var b=d.length-1;b>=0;b--)(h=d[b])&&(e=(p<3?h(e):p>3?h(r,a,e):h(r,a))||e);return p>3&&e&&Object.defineProperty(r,a,e),e},i=class extends g{constructor(){super(...arguments),this.tabIdx=void 0,this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return n`
      <button
        ?disabled=${this.loading?!0:!!this.disabled}
        data-loading=${this.loading}
        data-iconvariant=${m(this.iconVariant)}
        tabindex=${m(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if(this.variant==="image"&&this.imageSrc)return n`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if(this.iconVariant==="square"&&this.icon&&this.variant==="icon")return n`<wui-icon name=${this.icon}></wui-icon>`;if(this.variant==="icon"&&this.icon&&this.iconVariant){let r=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",a=this.iconVariant==="square-blue"?"mdl":"md",s=this.iconSize?this.iconSize:a;return n`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${s}
          background="transparent"
          iconColor=${r}
          backgroundColor=${r}
          size=${a}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?n`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`:n``}chevronTemplate(){return this.chevron?n`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};i.styles=[v,x,z];o([t()],i.prototype,"icon",void 0);o([t()],i.prototype,"iconSize",void 0);o([t()],i.prototype,"tabIdx",void 0);o([t()],i.prototype,"variant",void 0);o([t()],i.prototype,"iconVariant",void 0);o([t({type:Boolean})],i.prototype,"disabled",void 0);o([t()],i.prototype,"imageSrc",void 0);o([t()],i.prototype,"alt",void 0);o([t({type:Boolean})],i.prototype,"chevron",void 0);o([t({type:Boolean})],i.prototype,"loading",void 0);i=o([f("wui-list-item")],i);
