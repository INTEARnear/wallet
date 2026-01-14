import{r as w,v as g,w as k,z as x}from"./chunk-RZQOM5QR.js";import{a as r}from"./chunk-IDZGCU4F.js";import{e as d,k as b}from"./chunk-ZS2R6O6N.js";import{l as h}from"./chunk-OXOEMY67.js";import{i as a,k as l,o as u}from"./chunk-JY5TIRRF.js";a();u();l();a();u();l();a();u();l();var N=w`
  :host {
    width: 100%;
  }

  button {
    padding: ${({spacing:e})=>e[3]};
    display: flex;
    gap: ${({spacing:e})=>e[3]};
    justify-content: space-between;
    width: 100%;
    border-radius: ${({borderRadius:e})=>e[4]};
    background-color: transparent;
  }

  @media (hover: hover) {
    button:hover:enabled {
      background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    }
  }

  button:focus-visible:enabled {
    background-color: ${({tokens:e})=>e.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:e})=>e.core.foregroundAccent040};
  }

  button[data-clickable='false'] {
    pointer-events: none;
    background-color: transparent;
  }

  wui-image,
  wui-icon {
    width: ${({spacing:e})=>e[10]};
    height: ${({spacing:e})=>e[10]};
  }

  wui-image {
    border-radius: ${({borderRadius:e})=>e[16]};
  }

  .token-name-container {
    flex: 1;
  }
`;var n=function(e,i,m,c){var s=arguments.length,o=s<3?i:c===null?c=Object.getOwnPropertyDescriptor(i,m):c,p;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(e,i,m,c);else for(var f=e.length-1;f>=0;f--)(p=e[f])&&(o=(s<3?p(o):s>3?p(i,m,o):p(i,m))||o);return s>3&&o&&Object.defineProperty(i,m,o),o},t=class extends b{constructor(){super(...arguments),this.tokenName="",this.tokenImageUrl="",this.tokenValue=0,this.tokenAmount="0.0",this.tokenCurrency="",this.clickable=!1}render(){return d`
      <button data-clickable=${String(this.clickable)}>
        <wui-flex gap="2" alignItems="center">
          ${this.visualTemplate()}
          <wui-flex
            flexDirection="column"
            justifyContent="space-between"
            gap="1"
            class="token-name-container"
          >
            <wui-text variant="md-regular" color="primary" lineClamp="1">
              ${this.tokenName}
            </wui-text>
            <wui-text variant="sm-regular-mono" color="secondary">
              ${h.formatNumberToLocalString(this.tokenAmount,4)} ${this.tokenCurrency}
            </wui-text>
          </wui-flex>
        </wui-flex>
        <wui-flex
          flexDirection="column"
          justifyContent="space-between"
          gap="1"
          alignItems="flex-end"
          width="auto"
        >
          <wui-text variant="md-regular-mono" color="primary"
            >$${this.tokenValue.toFixed(2)}</wui-text
          >
          <wui-text variant="sm-regular-mono" color="secondary">
            ${h.formatNumberToLocalString(this.tokenAmount,4)}
          </wui-text>
        </wui-flex>
      </button>
    `}visualTemplate(){return this.tokenName&&this.tokenImageUrl?d`<wui-image alt=${this.tokenName} src=${this.tokenImageUrl}></wui-image>`:d`<wui-icon name="coinPlaceholder" color="default"></wui-icon>`}};t.styles=[g,k,N];n([r()],t.prototype,"tokenName",void 0);n([r()],t.prototype,"tokenImageUrl",void 0);n([r({type:Number})],t.prototype,"tokenValue",void 0);n([r()],t.prototype,"tokenAmount",void 0);n([r()],t.prototype,"tokenCurrency",void 0);n([r({type:Boolean})],t.prototype,"clickable",void 0);t=n([x("wui-list-token")],t);
