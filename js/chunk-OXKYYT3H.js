import{a as g,b as v}from"./chunk-G6MGL5IE.js";import{J as f,M as o,Z as b,s as d}from"./chunk-AXPE5NAX.js";import{b as a,e as c,j as m}from"./chunk-WGWCH7J2.js";var y=a`
  :host {
    width: 100%;
    display: block;
  }
`;var u=function(s,e,i,n){var l=arguments.length,t=l<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,h;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(s,e,i,n);else for(var p=s.length-1;p>=0;p--)(h=s[p])&&(t=(l<3?h(t):l>3?h(e,i,t):h(e,i))||t);return l>3&&t&&Object.defineProperty(e,i,t),t},r=class extends m{constructor(){super(),this.unsubscribe=[],this.text="",this.open=o.state.open,this.unsubscribe.push(d.subscribeKey("view",()=>{o.hide()}),f.subscribeKey("open",e=>{e||o.hide()}),o.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),o.hide()}render(){return c`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return c`<slot></slot> `}onMouseEnter(){let e=this.getBoundingClientRect();this.open||o.showTooltip({message:this.text,triggerRect:{width:e.width,height:e.height,left:e.left,top:e.top},variant:"shade"})}onMouseLeave(e){this.contains(e.relatedTarget)||o.hide()}};r.styles=[y];u([g()],r.prototype,"text",void 0);u([v()],r.prototype,"open",void 0);r=u([b("w3m-tooltip-trigger")],r);
