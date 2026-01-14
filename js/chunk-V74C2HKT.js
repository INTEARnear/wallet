import{a as m}from"./chunk-B2LU4KHT.js";import{r as y,v as b,w as x,z as $}from"./chunk-RZQOM5QR.js";import{a as t}from"./chunk-IDZGCU4F.js";import{e as s,k as g}from"./chunk-ZS2R6O6N.js";import{i as a,k as l,o as d}from"./chunk-JY5TIRRF.js";a();d();l();a();d();l();a();d();l();var I=y`
  :host {
    width: 100%;
  }

  :host([data-type='primary']) > button {
    background-color: ${({tokens:o})=>o.theme.backgroundPrimary};
  }

  :host([data-type='secondary']) > button {
    background-color: ${({tokens:o})=>o.theme.foregroundPrimary};
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:o})=>o[3]};
    width: 100%;
    border-radius: ${({borderRadius:o})=>o[4]};
    transition:
      background-color ${({durations:o})=>o.lg}
        ${({easings:o})=>o["ease-out-power-2"]},
      scale ${({durations:o})=>o.lg} ${({easings:o})=>o["ease-out-power-2"]};
    will-change: background-color, scale;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-image {
    color: ${({tokens:o})=>o.theme.textPrimary};
  }

  @media (hover: hover) {
    :host([data-type='primary']) > button:hover:enabled {
      background-color: ${({tokens:o})=>o.theme.foregroundPrimary};
    }

    :host([data-type='secondary']) > button:hover:enabled {
      background-color: ${({tokens:o})=>o.theme.foregroundSecondary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var i=function(o,n,p,u){var c=arguments.length,r=c<3?n:u===null?u=Object.getOwnPropertyDescriptor(n,p):u,h;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,n,p,u);else for(var f=o.length-1;f>=0;f--)(h=o[f])&&(r=(c<3?h(r):c>3?h(n,p,r):h(n,p))||r);return c>3&&r&&Object.defineProperty(n,p,r),r},e=class extends g{constructor(){super(...arguments),this.type="primary",this.imageSrc="google",this.imageSize=void 0,this.loading=!1,this.boxColor="foregroundPrimary",this.disabled=!1,this.rightIcon=!0,this.boxed=!0,this.rounded=!1,this.fullSize=!1}render(){return this.dataset.rounded=this.rounded?"true":"false",this.dataset.type=this.type,s`
      <button
        ?disabled=${this.loading?!0:!!this.disabled}
        data-loading=${this.loading}
        tabindex=${m(this.tabIdx)}
      >
        <wui-flex gap="2" alignItems="center">
          ${this.templateLeftIcon()}
          <wui-flex gap="1">
            <slot></slot>
          </wui-flex>
        </wui-flex>
        ${this.templateRightIcon()}
      </button>
    `}templateLeftIcon(){return this.icon?s`<wui-image
        icon=${this.icon}
        iconColor=${m(this.iconColor)}
        ?boxed=${this.boxed}
        ?rounded=${this.rounded}
        boxColor=${this.boxColor}
      ></wui-image>`:s`<wui-image
      ?boxed=${this.boxed}
      ?rounded=${this.rounded}
      ?fullSize=${this.fullSize}
      size=${m(this.imageSize)}
      src=${this.imageSrc}
      boxColor=${this.boxColor}
    ></wui-image>`}templateRightIcon(){return this.rightIcon?this.loading?s`<wui-loading-spinner size="md" color="accent-primary"></wui-loading-spinner>`:s`<wui-icon name="chevronRight" size="lg" color="default"></wui-icon>`:null}};e.styles=[b,x,I];i([t()],e.prototype,"type",void 0);i([t()],e.prototype,"imageSrc",void 0);i([t()],e.prototype,"imageSize",void 0);i([t()],e.prototype,"icon",void 0);i([t()],e.prototype,"iconColor",void 0);i([t({type:Boolean})],e.prototype,"loading",void 0);i([t()],e.prototype,"tabIdx",void 0);i([t()],e.prototype,"boxColor",void 0);i([t({type:Boolean})],e.prototype,"disabled",void 0);i([t({type:Boolean})],e.prototype,"rightIcon",void 0);i([t({type:Boolean})],e.prototype,"boxed",void 0);i([t({type:Boolean})],e.prototype,"rounded",void 0);i([t({type:Boolean})],e.prototype,"fullSize",void 0);e=i([$("wui-list-item")],e);
