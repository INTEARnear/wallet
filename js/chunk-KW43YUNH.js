import{R as v,W as g}from"./chunk-ORERQN7J.js";import{a as u}from"./chunk-G6MGL5IE.js";import{b as d,e as p,j as m}from"./chunk-WGWCH7J2.js";var h=d`
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
`;var l=function(i,r,o,e){var s=arguments.length,t=s<3?r:e===null?e=Object.getOwnPropertyDescriptor(r,o):e,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(i,r,o,e);else for(var c=i.length-1;c>=0;c--)(n=i[c])&&(t=(s<3?n(t):s>3?n(r,o,t):n(r,o))||t);return s>3&&t&&Object.defineProperty(r,o,t),t},a=class extends m{constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;let r=this.size==="md"?"mini-700":"micro-700";return p`
      <wui-text data-variant=${this.variant} variant=${r} color="inherit">
        <slot></slot>
      </wui-text>
    `}};a.styles=[v,h];l([u()],a.prototype,"variant",void 0);l([u()],a.prototype,"size",void 0);a=l([g("wui-tag")],a);
