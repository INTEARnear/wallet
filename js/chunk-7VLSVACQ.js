import{a as w,b as C}from"./chunk-HILJYRBB.js";import{J as b,M as o,Z as y,s as m}from"./chunk-UDTBWQKV.js";import{b as g,e as f,j as v}from"./chunk-5RP2GFJC.js";import{h as p,j as c,n as u}from"./chunk-KGCAX4NX.js";p();u();c();p();u();c();var T=g`
  :host {
    width: 100%;
    display: block;
  }
`;var a=function(s,e,i,n){var l=arguments.length,t=l<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,h;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(s,e,i,n);else for(var d=s.length-1;d>=0;d--)(h=s[d])&&(t=(l<3?h(t):l>3?h(e,i,t):h(e,i))||t);return l>3&&t&&Object.defineProperty(e,i,t),t},r=class extends v{constructor(){super(),this.unsubscribe=[],this.text="",this.open=o.state.open,this.unsubscribe.push(m.subscribeKey("view",()=>{o.hide()}),b.subscribeKey("open",e=>{e||o.hide()}),o.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),o.hide()}render(){return f`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return f`<slot></slot> `}onMouseEnter(){let e=this.getBoundingClientRect();this.open||o.showTooltip({message:this.text,triggerRect:{width:e.width,height:e.height,left:e.left,top:e.top},variant:"shade"})}onMouseLeave(e){this.contains(e.relatedTarget)||o.hide()}};r.styles=[T];a([w()],r.prototype,"text",void 0);a([C()],r.prototype,"open",void 0);r=a([y("w3m-tooltip-trigger")],r);
