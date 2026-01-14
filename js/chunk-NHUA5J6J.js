import{r as v,v as h,w as y,z as g}from"./chunk-RZQOM5QR.js";import{a as d}from"./chunk-IDZGCU4F.js";import{e as m,k as f}from"./chunk-ZS2R6O6N.js";import{i as n,k as a,o as i}from"./chunk-JY5TIRRF.js";n();i();a();n();i();a();n();i();a();var w=v`
  button {
    border: none;
    background: transparent;
    height: 20px;
    padding: ${({spacing:t})=>t[2]};
    column-gap: ${({spacing:t})=>t[1]};
    border-radius: ${({borderRadius:t})=>t[1]};
    padding: 0 ${({spacing:t})=>t[1]};
    border-radius: ${({spacing:t})=>t[1]};
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='accent'] {
    color: ${({tokens:t})=>t.core.textAccentPrimary};
  }

  button[data-variant='secondary'] {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[data-variant='accent']:focus-visible:enabled {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible:enabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  button[data-variant='accent']:hover:enabled {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:hover:enabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    box-shadow: 0px 0px 0px 4px rgba(9, 136, 240, 0.2);
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var s=function(t,r,c,u){var l=arguments.length,o=l<3?r:u===null?u=Object.getOwnPropertyDescriptor(r,c):u,b;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,r,c,u);else for(var p=t.length-1;p>=0;p--)(b=t[p])&&(o=(l<3?b(o):l>3?b(r,c,o):b(r,c))||o);return l>3&&o&&Object.defineProperty(r,c,o),o},A={sm:"sm-medium",md:"md-medium"},T={accent:"accent-primary",secondary:"secondary"},e=class extends f{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.variant="accent",this.icon=void 0}render(){return m`
      <button ?disabled=${this.disabled} data-variant=${this.variant}>
        <slot name="iconLeft"></slot>
        <wui-text
          color=${T[this.variant]}
          variant=${A[this.size]}
        >
          <slot></slot>
        </wui-text>
        ${this.iconTemplate()}
      </button>
    `}iconTemplate(){return this.icon?m`<wui-icon name=${this.icon} size="sm"></wui-icon>`:null}};e.styles=[h,y,w];s([d()],e.prototype,"size",void 0);s([d({type:Boolean})],e.prototype,"disabled",void 0);s([d()],e.prototype,"variant",void 0);s([d()],e.prototype,"icon",void 0);e=s([g("wui-link")],e);
