import{h as w}from"./chunk-LTN6YROF.js";import{S as r}from"./chunk-N2WXLAZF.js";import{b as a}from"./chunk-IDZGCU4F.js";import{b as f,e as g,k as v}from"./chunk-ZS2R6O6N.js";import{i as m,k as u,o as h}from"./chunk-JY5TIRRF.js";m();h();u();m();h();u();var x=f`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    color: var(--wui-color-bg-100);
    position: fixed;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--w3m-modal-width) - var(--wui-spacing-xl));
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: var(--wui-color-bg-150);
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
`;var s=function(l,t,i,p){var n=arguments.length,o=n<3?t:p===null?p=Object.getOwnPropertyDescriptor(t,i):p,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(l,t,i,p);else for(var d=l.length-1;d>=0;d--)(c=l[d])&&(o=(n<3?c(o):n>3?c(t,i,o):c(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},e=class extends v{constructor(){super(),this.unsubscribe=[],this.open=r.state.open,this.message=r.state.message,this.triggerRect=r.state.triggerRect,this.variant=r.state.variant,this.unsubscribe.push(r.subscribe(t=>{this.open=t.open,this.message=t.message,this.triggerRect=t.triggerRect,this.variant=t.variant}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){this.dataset.variant=this.variant;let t=this.triggerRect.top,i=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${t}px;
    --w3m-tooltip-left: ${i}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${this.open?1:0};
    `,g`<wui-flex>
      <wui-icon data-placement="top" color="fg-100" size="inherit" name="cursor"></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>
    </wui-flex>`}};e.styles=[x];s([a()],e.prototype,"open",void 0);s([a()],e.prototype,"message",void 0);s([a()],e.prototype,"triggerRect",void 0);s([a()],e.prototype,"variant",void 0);e=s([w("w3m-tooltip"),w("w3m-tooltip")],e);
