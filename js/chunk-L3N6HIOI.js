import{r as x,v as b,w as f,z as w}from"./chunk-RZQOM5QR.js";import{a}from"./chunk-IDZGCU4F.js";import{e as r,k as g}from"./chunk-ZS2R6O6N.js";import{i as s,k as m,o as d}from"./chunk-JY5TIRRF.js";s();d();m();s();d();m();s();d();m();var v=x`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: ${({spacing:t})=>t[1]};
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
    border-radius: ${({borderRadius:t})=>t[32]};
  }

  wui-image {
    border-radius: ${({borderRadius:t})=>t[32]};
  }

  wui-text {
    padding-left: ${({spacing:t})=>t[1]};
    padding-right: ${({spacing:t})=>t[1]};
  }

  .left-icon-container {
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
  }

  .left-image-container {
    position: relative;
    justify-content: center;
    align-items: center;
  }

  .chain-image {
    position: absolute;
    border: 1px solid ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='lg'] {
    height: 32px;
  }

  button[data-size='md'] {
    height: 28px;
  }

  button[data-size='sm'] {
    height: 24px;
  }

  button[data-size='lg'] .token-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .token-image {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .token-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .left-icon-container {
    width: 24px;
    height: 24px;
  }

  button[data-size='md'] .left-icon-container {
    width: 20px;
    height: 20px;
  }

  button[data-size='sm'] .left-icon-container {
    width: 16px;
    height: 16px;
  }

  button[data-size='lg'] .chain-image {
    width: 12px;
    height: 12px;
    bottom: 2px;
    right: -4px;
  }

  button[data-size='md'] .chain-image {
    width: 10px;
    height: 10px;
    bottom: 2px;
    right: -4px;
  }

  button[data-size='sm'] .chain-image {
    width: 8px;
    height: 8px;
    bottom: 2px;
    right: -3px;
  }

  /* -- Focus states --------------------------------------------------- */
  button:focus-visible:enabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    box-shadow: 0 0 0 4px ${({tokens:t})=>t.core.foregroundAccent040};
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) {
    button:hover:enabled,
    button:active:enabled {
      background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    }
  }

  /* -- Disabled states --------------------------------------------------- */
  button:disabled {
    background-color: ${({tokens:t})=>t.theme.foregroundSecondary};
    opacity: 0.5;
  }
`;var n=function(t,e,l,c){var h=arguments.length,o=h<3?e:c===null?c=Object.getOwnPropertyDescriptor(e,l):c,p;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,l,c);else for(var u=t.length-1;u>=0;u--)(p=t[u])&&(o=(h<3?p(o):h>3?p(e,l,o):p(e,l))||o);return h>3&&o&&Object.defineProperty(e,l,o),o},S={lg:"lg-regular",md:"lg-regular",sm:"md-regular"},k={lg:"lg",md:"md",sm:"sm"},i=class extends g{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.text="",this.loading=!1}render(){return this.loading?r` <wui-flex alignItems="center" gap="01" padding="01">
        <wui-shimmer width="20px" height="20px"></wui-shimmer>
        <wui-shimmer width="32px" height="18px" borderRadius="4xs"></wui-shimmer>
      </wui-flex>`:r`
      <button ?disabled=${this.disabled} data-size=${this.size}>
        ${this.imageTemplate()} ${this.textTemplate()}
      </button>
    `}imageTemplate(){if(this.imageSrc&&this.chainImageSrc)return r`<wui-flex class="left-image-container">
        <wui-image src=${this.imageSrc} class="token-image"></wui-image>
        <wui-image src=${this.chainImageSrc} class="chain-image"></wui-image>
      </wui-flex>`;if(this.imageSrc)return r`<wui-image src=${this.imageSrc} class="token-image"></wui-image>`;let e=k[this.size];return r`<wui-flex class="left-icon-container">
      <wui-icon size=${e} name="networkPlaceholder"></wui-icon>
    </wui-flex>`}textTemplate(){let e=S[this.size];return r`<wui-text color="primary" variant=${e}
      >${this.text}</wui-text
    >`}};i.styles=[b,f,v];n([a()],i.prototype,"size",void 0);n([a()],i.prototype,"imageSrc",void 0);n([a()],i.prototype,"chainImageSrc",void 0);n([a({type:Boolean})],i.prototype,"disabled",void 0);n([a()],i.prototype,"text",void 0);n([a({type:Boolean})],i.prototype,"loading",void 0);i=n([w("wui-token-button")],i);
