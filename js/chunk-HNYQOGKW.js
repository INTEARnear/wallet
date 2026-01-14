import{c as w,h as f}from"./chunk-LTN6YROF.js";import{a as p}from"./chunk-IDZGCU4F.js";import{b as v,e as g,k as h}from"./chunk-ZS2R6O6N.js";import{i as a,k as o,o as i}from"./chunk-JY5TIRRF.js";a();i();o();a();i();o();a();i();o();var y=v`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }

  :host([data-size='xs']) {
    height: var(--wui-spacing-2l);
    padding: 0 var(--wui-spacing-3xs) !important;
  }

  :host([data-size='xs']) > wui-text {
    transform: translateY(2%);
  }
`;var m=function(n,t,e,c){var u=arguments.length,r=u<3?t:c===null?c=Object.getOwnPropertyDescriptor(t,e):c,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(n,t,e,c);else for(var d=n.length-1;d>=0;d--)(l=n[d])&&(r=(u<3?l(r):u>3?l(t,e,r):l(t,e))||r);return u>3&&r&&Object.defineProperty(t,e,r),r},s=class extends h{constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;let t=this.size==="md"||this.size==="xs"?"mini-700":"micro-700";return g`
      <wui-text data-variant=${this.variant} variant=${t} color="inherit">
        <slot></slot>
      </wui-text>
    `}};s.styles=[w,y];m([p()],s.prototype,"variant",void 0);m([p()],s.prototype,"size",void 0);s=m([f("wui-tag")],s);
