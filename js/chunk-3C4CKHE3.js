import{j as r,r as P,z as b}from"./chunk-RZQOM5QR.js";import{a as E,b as h}from"./chunk-IDZGCU4F.js";import{b as T,e as u,k as w}from"./chunk-ZS2R6O6N.js";import{S as R,ia as C}from"./chunk-OXOEMY67.js";import{i as l,k as p,o as c}from"./chunk-JY5TIRRF.js";l();c();p();l();c();p();var _=T`
  :host {
    width: 100%;
    display: block;
  }
`;var $=function(t,e,i,n){var a=arguments.length,o=a<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,n);else for(var m=t.length-1;m>=0;m--)(s=t[m])&&(o=(a<3?s(o):a>3?s(e,i,o):s(e,i))||o);return a>3&&o&&Object.defineProperty(e,i,o),o},f=class extends w{constructor(){super(),this.unsubscribe=[],this.text="",this.open=r.state.open,this.unsubscribe.push(R.subscribeKey("view",()=>{r.hide()}),C.subscribeKey("open",e=>{e||r.hide()}),r.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),r.hide()}render(){return u`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return u`<slot></slot> `}onMouseEnter(){let e=this.getBoundingClientRect();if(!this.open){let i=document.querySelector("w3m-modal"),n={width:e.width,height:e.height,left:e.left,top:e.top};if(i){let a=i.getBoundingClientRect();n.left=e.left-(window.innerWidth-a.width)/2,n.top=e.top-(window.innerHeight-a.height)/2}r.showTooltip({message:this.text,triggerRect:n,variant:"shade"})}}onMouseLeave(e){this.contains(e.relatedTarget)||r.hide()}};f.styles=[_];$([E()],f.prototype,"text",void 0);$([h()],f.prototype,"open",void 0);f=$([b("w3m-tooltip-trigger")],f);l();c();p();l();c();p();var j=P`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px ${({spacing:t})=>t[3]} 10px ${({spacing:t})=>t[3]};
    border-radius: ${({borderRadius:t})=>t[3]};
    color: ${({tokens:t})=>t.theme.backgroundPrimary};
    position: absolute;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--apkt-modal-width) - ${({spacing:t})=>t[5]});
    transition: opacity ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: opacity;
    opacity: 0;
    animation-duration: ${({durations:t})=>t.xl};
    animation-timing-function: ${({easings:t})=>t["ease-out-power-2"]};
    animation-name: fade-in;
    animation-fill-mode: forwards;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: ${({tokens:t})=>t.theme.textSecondary};
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
    border: 1px solid ${({tokens:t})=>t.theme.borderPrimary};
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;var g=function(t,e,i,n){var a=arguments.length,o=a<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,i):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,i,n);else for(var m=t.length-1;m>=0;m--)(s=t[m])&&(o=(a<3?s(o):a>3?s(e,i,o):s(e,i))||o);return a>3&&o&&Object.defineProperty(e,i,o),o},d=class extends w{constructor(){super(),this.unsubscribe=[],this.open=r.state.open,this.message=r.state.message,this.triggerRect=r.state.triggerRect,this.variant=r.state.variant,this.unsubscribe.push(r.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;let e=this.triggerRect.top,i=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${e}px;
    --w3m-tooltip-left: ${i}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${this.open?1:0};
    `,u`<wui-flex>
      <wui-icon data-placement="top" size="inherit" name="cursor"></wui-icon>
      <wui-text color="primary" variant="sm-regular">${this.message}</wui-text>
    </wui-flex>`}};d.styles=[j];g([h()],d.prototype,"open",void 0);g([h()],d.prototype,"message",void 0);g([h()],d.prototype,"triggerRect",void 0);g([h()],d.prototype,"variant",void 0);d=g([b("w3m-tooltip")],d);
