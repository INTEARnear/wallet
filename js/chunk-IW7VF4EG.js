import{K as r,W as u}from"./chunk-ORERQN7J.js";import{b as a}from"./chunk-G6MGL5IE.js";import{b as h,e as d,j as w}from"./chunk-WGWCH7J2.js";var f=h`
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
`;var s=function(l,t,i,p){var n=arguments.length,o=n<3?t:p===null?p=Object.getOwnPropertyDescriptor(t,i):p,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(l,t,i,p);else for(var m=l.length-1;m>=0;m--)(c=l[m])&&(o=(n<3?c(o):n>3?c(t,i,o):c(t,i))||o);return n>3&&o&&Object.defineProperty(t,i,o),o},e=class extends w{constructor(){super(),this.unsubscribe=[],this.open=r.state.open,this.message=r.state.message,this.triggerRect=r.state.triggerRect,this.variant=r.state.variant,this.unsubscribe.push(r.subscribe(t=>{this.open=t.open,this.message=t.message,this.triggerRect=t.triggerRect,this.variant=t.variant}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){this.dataset.variant=this.variant;let t=this.triggerRect.top,i=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${t}px;
    --w3m-tooltip-left: ${i}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${this.open?1:0};
    `,d`<wui-flex>
      <wui-icon data-placement="top" color="fg-100" size="inherit" name="cursor"></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>
    </wui-flex>`}};e.styles=[f];s([a()],e.prototype,"open",void 0);s([a()],e.prototype,"message",void 0);s([a()],e.prototype,"triggerRect",void 0);s([a()],e.prototype,"variant",void 0);e=s([u("w3m-tooltip"),u("w3m-tooltip")],e);
