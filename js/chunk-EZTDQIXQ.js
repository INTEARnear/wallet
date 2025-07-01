import{H as w,K as o,W as C,r as y}from"./chunk-WYPOXQ7L.js";import{a as g,b as v}from"./chunk-HILJYRBB.js";import{b as m,e as f,j as b}from"./chunk-5RP2GFJC.js";import{h as p,j as c,n as u}from"./chunk-KGCAX4NX.js";p();u();c();p();u();c();var T=m`
  :host {
    width: 100%;
    display: block;
  }
`;var a=function(s,e,i,n){var l=arguments.length,t=l<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,h;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(s,e,i,n);else for(var d=s.length-1;d>=0;d--)(h=s[d])&&(t=(l<3?h(t):l>3?h(e,i,t):h(e,i))||t);return l>3&&t&&Object.defineProperty(e,i,t),t},r=class extends b{constructor(){super(),this.unsubscribe=[],this.text="",this.open=o.state.open,this.unsubscribe.push(y.subscribeKey("view",()=>{o.hide()}),w.subscribeKey("open",e=>{e||o.hide()}),o.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),o.hide()}render(){return f`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return f`<slot></slot> `}onMouseEnter(){let e=this.getBoundingClientRect();this.open||o.showTooltip({message:this.text,triggerRect:{width:e.width,height:e.height,left:e.left,top:e.top},variant:"shade"})}onMouseLeave(e){this.contains(e.relatedTarget)||o.hide()}};r.styles=[T];a([g()],r.prototype,"text",void 0);a([v()],r.prototype,"open",void 0);r=a([C("w3m-tooltip-trigger")],r);
