import{r as m,v as f,w as y,z as g}from"./chunk-RZQOM5QR.js";import{a as c}from"./chunk-IDZGCU4F.js";import{e as h,k as v}from"./chunk-ZS2R6O6N.js";import{i as r,k as a,o as n}from"./chunk-JY5TIRRF.js";r();n();a();r();n();a();r();n();a();var $=m`
  button {
    background-color: transparent;
    padding: ${({spacing:t})=>t[1]};
  }

  button:focus-visible {
    box-shadow: 0 0 0 4px ${({tokens:t})=>t.core.foregroundAccent020};
  }

  button[data-variant='accent']:hover:enabled,
  button[data-variant='accent']:focus-visible {
    background-color: ${({tokens:t})=>t.core.foregroundAccent010};
  }

  button[data-variant='primary']:hover:enabled,
  button[data-variant='primary']:focus-visible,
  button[data-variant='secondary']:hover:enabled,
  button[data-variant='secondary']:focus-visible {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
  }

  button[data-size='xs'] > wui-icon {
    width: 8px;
    height: 8px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='xs'],
  button[data-size='sm'] {
    border-radius: ${({borderRadius:t})=>t[1]};
  }

  button[data-size='md'],
  button[data-size='lg'] {
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  button[data-size='md'] > wui-icon {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] > wui-icon {
    width: 20px;
    height: 20px;
  }

  button:disabled {
    background-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  button:hover:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
  }

  button:focus-visible:not(:disabled) {
    background-color: var(--wui-color-accent-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
`;var s=function(t,o,d,u){var l=arguments.length,e=l<3?o:u===null?u=Object.getOwnPropertyDescriptor(o,d):u,b;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(t,o,d,u);else for(var p=t.length-1;p>=0;p--)(b=t[p])&&(e=(l<3?b(e):l>3?b(o,d,e):b(o,d))||e);return l>3&&e&&Object.defineProperty(o,d,e),e},i=class extends v{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="default",this.variant="accent"}render(){let o={accent:"accent-primary",primary:"inverse",secondary:"default"};return h`
      <button data-variant=${this.variant} ?disabled=${this.disabled} data-size=${this.size}>
        <wui-icon
          color=${o[this.variant]||this.iconColor}
          size=${this.size}
          name=${this.icon}
        ></wui-icon>
      </button>
    `}};i.styles=[f,y,$];s([c()],i.prototype,"size",void 0);s([c({type:Boolean})],i.prototype,"disabled",void 0);s([c()],i.prototype,"icon",void 0);s([c()],i.prototype,"iconColor",void 0);s([c()],i.prototype,"variant",void 0);i=s([g("wui-icon-link")],i);
