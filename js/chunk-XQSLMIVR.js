import{H as g,K as o,W as v,r as b}from"./chunk-ORERQN7J.js";import{a,b as m}from"./chunk-G6MGL5IE.js";import{b as d,e as c,j as f}from"./chunk-WGWCH7J2.js";var y=d`
  :host {
    width: 100%;
    display: block;
  }
`;var u=function(s,e,i,n){var l=arguments.length,t=l<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,h;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(s,e,i,n);else for(var p=s.length-1;p>=0;p--)(h=s[p])&&(t=(l<3?h(t):l>3?h(e,i,t):h(e,i))||t);return l>3&&t&&Object.defineProperty(e,i,t),t},r=class extends f{constructor(){super(),this.unsubscribe=[],this.text="",this.open=o.state.open,this.unsubscribe.push(b.subscribeKey("view",()=>{o.hide()}),g.subscribeKey("open",e=>{e||o.hide()}),o.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),o.hide()}render(){return c`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return c`<slot></slot> `}onMouseEnter(){let e=this.getBoundingClientRect();this.open||o.showTooltip({message:this.text,triggerRect:{width:e.width,height:e.height,left:e.left,top:e.top},variant:"shade"})}onMouseLeave(e){this.contains(e.relatedTarget)||o.hide()}};r.styles=[y];u([a()],r.prototype,"text",void 0);u([m()],r.prototype,"open",void 0);r=u([v("w3m-tooltip-trigger")],r);
