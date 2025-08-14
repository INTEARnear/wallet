import{a as p}from"./chunk-HILJYRBB.js";import{U as f,Z as w}from"./chunk-UDTBWQKV.js";import{b as v,e as g,j as h}from"./chunk-5RP2GFJC.js";import{h as o,j as a,n as i}from"./chunk-KGCAX4NX.js";o();i();a();o();i();a();o();i();a();var z=v`
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
`;var m=function(n,r,e,c){var u=arguments.length,t=u<3?r:c===null?c=Object.getOwnPropertyDescriptor(r,e):c,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,r,e,c);else for(var d=n.length-1;d>=0;d--)(l=n[d])&&(t=(u<3?l(t):u>3?l(r,e,t):l(r,e))||t);return u>3&&t&&Object.defineProperty(r,e,t),t},s=class extends h{constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;let r=this.size==="md"?"mini-700":"micro-700";return g`
      <wui-text data-variant=${this.variant} variant=${r} color="inherit">
        <slot></slot>
      </wui-text>
    `}};s.styles=[f,z];m([p()],s.prototype,"variant",void 0);m([p()],s.prototype,"size",void 0);s=m([w("wui-tag")],s);
