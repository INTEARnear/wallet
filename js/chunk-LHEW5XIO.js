import{c as w,d as T,f as b,h as y}from"./chunk-LTN6YROF.js";import{a as t}from"./chunk-IDZGCU4F.js";import{b as x,e as p,k as g}from"./chunk-ZS2R6O6N.js";import{i,k as a,o as l}from"./chunk-JY5TIRRF.js";i();l();a();i();l();a();i();l();a();var j=x`
  button {
    padding: 6.5px var(--wui-spacing-l) 6.5px var(--wui-spacing-xs);
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    background-color: var(--wui-color-gray-glass-002);
  }

  button[data-clickable='false'] {
    pointer-events: none;
    background-color: transparent;
  }

  wui-image,
  wui-icon {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
  }
`;var v=function(c,r,e,s){var n=arguments.length,o=n<3?r:s===null?s=Object.getOwnPropertyDescriptor(r,e):s,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,r,e,s);else for(var d=c.length-1;d>=0;d--)(m=c[d])&&(o=(n<3?m(o):n>3?m(r,e,o):m(r,e))||o);return n>3&&o&&Object.defineProperty(r,e,o),o},u=class extends g{constructor(){super(...arguments),this.tokenName="",this.tokenImageUrl="",this.tokenValue=0,this.tokenAmount="0.0",this.tokenCurrency="",this.clickable=!1}render(){return p`
      <button data-clickable=${String(this.clickable)}>
        <wui-flex gap="s" alignItems="center">
          ${this.visualTemplate()}
          <wui-flex flexDirection="column" justifyContent="spaceBetween">
            <wui-text variant="paragraph-500" color="fg-100">${this.tokenName}</wui-text>
            <wui-text variant="small-400" color="fg-200">
              ${b.formatNumberToLocalString(this.tokenAmount,4)} ${this.tokenCurrency}
            </wui-text>
          </wui-flex>
        </wui-flex>
        <wui-text variant="paragraph-500" color="fg-100">$${this.tokenValue.toFixed(2)}</wui-text>
      </button>
    `}visualTemplate(){return this.tokenName&&this.tokenImageUrl?p`<wui-image alt=${this.tokenName} src=${this.tokenImageUrl}></wui-image>`:p`<wui-icon name="coinPlaceholder" color="fg-100"></wui-icon>`}};u.styles=[w,T,j];v([t()],u.prototype,"tokenName",void 0);v([t()],u.prototype,"tokenImageUrl",void 0);v([t({type:Number})],u.prototype,"tokenValue",void 0);v([t()],u.prototype,"tokenAmount",void 0);v([t()],u.prototype,"tokenCurrency",void 0);v([t({type:Boolean})],u.prototype,"clickable",void 0);u=v([y("wui-list-token")],u);i();l();a();i();l();a();var U=x`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
    border-radius: var(--wui-border-radius-3xl);
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    overflow: hidden;
    position: relative;
  }

  :host([data-variant='generated']) {
    --mixed-local-color-1: var(--local-color-1);
    --mixed-local-color-2: var(--local-color-2);
    --mixed-local-color-3: var(--local-color-3);
    --mixed-local-color-4: var(--local-color-4);
    --mixed-local-color-5: var(--local-color-5);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host([data-variant='generated']) {
      --mixed-local-color-1: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-1)
      );
      --mixed-local-color-2: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-2)
      );
      --mixed-local-color-3: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-3)
      );
      --mixed-local-color-4: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-4)
      );
      --mixed-local-color-5: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-5)
      );
    }
  }

  :host([data-variant='generated']) {
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    background: radial-gradient(
      var(--local-radial-circle),
      #fff 0.52%,
      var(--mixed-local-color-5) 31.25%,
      var(--mixed-local-color-3) 51.56%,
      var(--mixed-local-color-2) 65.63%,
      var(--mixed-local-color-1) 82.29%,
      var(--mixed-local-color-4) 100%
    );
  }

  :host([data-variant='default']) {
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    background: radial-gradient(
      75.29% 75.29% at 64.96% 24.36%,
      #fff 0.52%,
      #f5ccfc 31.25%,
      #dba4f5 51.56%,
      #9a8ee8 65.63%,
      #6493da 82.29%,
      #6ebdea 100%
    );
  }
`;var f=function(c,r,e,s){var n=arguments.length,o=n<3?r:s===null?s=Object.getOwnPropertyDescriptor(r,e):s,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(c,r,e,s);else for(var d=c.length-1;d>=0;d--)(m=c[d])&&(o=(n<3?m(o):n>3?m(r,e,o):m(r,e))||o);return n>3&&o&&Object.defineProperty(r,e,o),o},h=class extends g{constructor(){super(...arguments),this.imageSrc=void 0,this.alt=void 0,this.address=void 0,this.size="xl"}render(){return this.style.cssText=`
    --local-width: var(--wui-icon-box-size-${this.size});
    --local-height: var(--wui-icon-box-size-${this.size});
    `,p`${this.visualTemplate()}`}visualTemplate(){if(this.imageSrc)return this.dataset.variant="image",p`<wui-image src=${this.imageSrc} alt=${this.alt??"avatar"}></wui-image>`;if(this.address){this.dataset.variant="generated";let r=b.generateAvatarColors(this.address);return this.style.cssText+=`
 ${r}`,null}return this.dataset.variant="default",null}};h.styles=[w,U];f([t()],h.prototype,"imageSrc",void 0);f([t()],h.prototype,"alt",void 0);f([t()],h.prototype,"address",void 0);f([t()],h.prototype,"size",void 0);h=f([y("wui-avatar")],h);
