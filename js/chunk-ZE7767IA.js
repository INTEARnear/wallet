import{a as _}from"./chunk-B2LU4KHT.js";import{r as g,v as b,w as j,z as w}from"./chunk-RZQOM5QR.js";import{a}from"./chunk-IDZGCU4F.js";import{e as d,k as h}from"./chunk-ZS2R6O6N.js";import{i,k as n,o as l}from"./chunk-JY5TIRRF.js";i();l();n();i();l();n();var R=g`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: ${({borderRadius:t})=>t[20]};
    overflow: hidden;
  }

  wui-icon {
    width: 100%;
    height: 100%;
  }
`;var L=function(t,o,r,s){var p=arguments.length,e=p<3?o:s===null?s=Object.getOwnPropertyDescriptor(o,r):s,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(t,o,r,s);else for(var u=t.length-1;u>=0;u--)(m=t[u])&&(e=(p<3?m(e):p>3?m(o,r,e):m(o,r))||e);return p>3&&e&&Object.defineProperty(o,r,e),e},$=class extends h{constructor(){super(...arguments),this.logo="google"}render(){return d`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `}};$.styles=[b,R];L([a()],$.prototype,"logo",void 0);$=L([w("wui-logo")],$);i();l();n();i();l();n();i();l();n();var O=g`
  :host {
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${({spacing:t})=>t[3]};
    width: 100%;
    background-color: transparent;
    border-radius: ${({borderRadius:t})=>t[4]};
  }

  wui-text {
    text-transform: capitalize;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    }
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;var f=function(t,o,r,s){var p=arguments.length,e=p<3?o:s===null?s=Object.getOwnPropertyDescriptor(o,r):s,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(t,o,r,s);else for(var u=t.length-1;u>=0;u--)(m=t[u])&&(e=(p<3?m(e):p>3?m(o,r,e):m(o,r))||e);return p>3&&e&&Object.defineProperty(o,r,e),e},c=class extends h{constructor(){super(...arguments),this.logo="google",this.name="Continue with google",this.disabled=!1}render(){return d`
      <button ?disabled=${this.disabled} tabindex=${_(this.tabIdx)}>
        <wui-flex gap="2" alignItems="center">
          <wui-image ?boxed=${!0} logo=${this.logo}></wui-image>
          <wui-text variant="lg-regular" color="primary">${this.name}</wui-text>
        </wui-flex>
        <wui-icon name="chevronRight" size="lg" color="default"></wui-icon>
      </button>
    `}};c.styles=[b,j,O];f([a()],c.prototype,"logo",void 0);f([a()],c.prototype,"name",void 0);f([a()],c.prototype,"tabIdx",void 0);f([a({type:Boolean})],c.prototype,"disabled",void 0);c=f([w("wui-list-social")],c);
