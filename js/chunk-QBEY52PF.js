import{a as E,b as $}from"./chunk-BDSQF46L.js";import{q as v,r as y,v as b,w as g,x as w,z as x}from"./chunk-RZQOM5QR.js";import{a as r}from"./chunk-IDZGCU4F.js";import{e as f,k as c}from"./chunk-ZS2R6O6N.js";import{i as p,k as s,o as l}from"./chunk-JY5TIRRF.js";p();l();s();p();l();s();p();l();s();var I=y`
  :host {
    position: relative;
    display: inline-block;
  }

  :host([data-error='true']) > input {
    color: ${({tokens:t})=>t.core.textError};
  }

  :host([data-error='false']) > input {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  input {
    background: transparent;
    height: auto;
    box-sizing: border-box;
    color: ${({tokens:t})=>t.theme.textPrimary};
    font-feature-settings: 'case' on;
    font-size: ${({textSize:t})=>t.h4};
    caret-color: ${({tokens:t})=>t.core.backgroundAccentPrimary};
    line-height: ${({typography:t})=>t["h4-regular-mono"].lineHeight};
    letter-spacing: ${({typography:t})=>t["h4-regular-mono"].letterSpacing};
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
    font-family: ${({fontFamily:t})=>t.mono};
  }

  :host([data-width-variant='auto']) input {
    width: 100%;
  }

  :host([data-width-variant='fit']) input {
    width: 1ch;
  }

  .wui-input-amount-fit-mirror {
    position: absolute;
    visibility: hidden;
    white-space: pre;
    font-size: var(--local-font-size);
    line-height: 130%;
    letter-spacing: -1.28px;
    font-family: ${({fontFamily:t})=>t.mono};
  }

  .wui-input-amount-fit-width {
    display: inline-block;
    position: relative;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input::placeholder {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }
`;var o=function(t,e,n,u){var h=arguments.length,a=h<3?e:u===null?u=Object.getOwnPropertyDescriptor(e,n):u,m;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(t,e,n,u);else for(var d=t.length-1;d>=0;d--)(m=t[d])&&(a=(h<3?m(a):h>3?m(e,n,a):m(e,n))||a);return h>3&&a&&Object.defineProperty(e,n,a),a},i=class extends c{constructor(){super(...arguments),this.inputElementRef=E(),this.disabled=!1,this.value="",this.placeholder="0",this.widthVariant="auto",this.maxDecimals=void 0,this.maxIntegers=void 0,this.fontSize="h4",this.error=!1}firstUpdated(){this.resizeInput()}updated(){this.style.setProperty("--local-font-size",v.textSize[this.fontSize]),this.resizeInput()}render(){return this.dataset.widthVariant=this.widthVariant,this.dataset.error=String(this.error),this.inputElementRef?.value&&this.value&&(this.inputElementRef.value.value=this.value),this.widthVariant==="auto"?this.inputTemplate():f`
      <div class="wui-input-amount-fit-width">
        <span class="wui-input-amount-fit-mirror"></span>
        ${this.inputTemplate()}
      </div>
    `}inputTemplate(){return f`<input
      ${$(this.inputElementRef)}
      type="text"
      inputmode="decimal"
      pattern="[0-9,.]*"
      placeholder=${this.placeholder}
      ?disabled=${this.disabled}
      autofocus
      value=${this.value??""}
      @input=${this.dispatchInputChangeEvent.bind(this)}
    />`}dispatchInputChangeEvent(){this.inputElementRef.value&&(this.inputElementRef.value.value=w.maskInput({value:this.inputElementRef.value.value,decimals:this.maxDecimals,integers:this.maxIntegers}),this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value.value,bubbles:!0,composed:!0})),this.resizeInput())}resizeInput(){if(this.widthVariant==="fit"){let e=this.inputElementRef.value;if(e){let n=e.previousElementSibling;n&&(n.textContent=e.value||"0",e.style.width=`${n.offsetWidth}px`)}}}};i.styles=[b,g,I];o([r({type:Boolean})],i.prototype,"disabled",void 0);o([r({type:String})],i.prototype,"value",void 0);o([r({type:String})],i.prototype,"placeholder",void 0);o([r({type:String})],i.prototype,"widthVariant",void 0);o([r({type:Number})],i.prototype,"maxDecimals",void 0);o([r({type:Number})],i.prototype,"maxIntegers",void 0);o([r({type:String})],i.prototype,"fontSize",void 0);o([r({type:Boolean})],i.prototype,"error",void 0);i=o([x("wui-input-amount")],i);
