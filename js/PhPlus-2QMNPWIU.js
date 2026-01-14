import{a as c,b as d,c as r,d as u,e as H,f as o}from"./chunk-NHI5MHIS.js";import{i as m,k as n,o as v}from"./chunk-JY5TIRRF.js";m();v();n();var V=Object.defineProperty,f=Object.getOwnPropertyDescriptor,s=(a,h,p,i)=>{for(var e=i>1?void 0:i?f(h,p):h,l=a.length-1,g;l>=0;l--)(g=a[l])&&(e=(i?g(h,p,e):g(e))||e);return i&&e&&V(h,p,e),e},t=class extends u{constructor(){super(...arguments),this.size="1em",this.weight="regular",this.color="currentColor",this.mirrored=!1}render(){var a;return d`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="${this.size}"
      height="${this.size}"
      fill="${this.color}"
      viewBox="0 0 256 256"
      transform=${this.mirrored?"scale(-1, 1)":null}
    >
      ${t.weightsMap.get((a=this.weight)!=null?a:"regular")}
    </svg>`}};t.weightsMap=new Map([["thin",r`<path d="M220,128a4,4,0,0,1-4,4H132v84a4,4,0,0,1-8,0V132H40a4,4,0,0,1,0-8h84V40a4,4,0,0,1,8,0v84h84A4,4,0,0,1,220,128Z"/>`],["light",r`<path d="M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z"/>`],["regular",r`<path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>`],["bold",r`<path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"/>`],["fill",r`<path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H136v48a8,8,0,0,1-16,0V136H72a8,8,0,0,1,0-16h48V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"/>`],["duotone",r`<path d="M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z" opacity="0.2"/><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"/>`]]);t.styles=c`
    :host {
      display: contents;
    }
  `;s([o({type:String,reflect:!0})],t.prototype,"size",2);s([o({type:String,reflect:!0})],t.prototype,"weight",2);s([o({type:String,reflect:!0})],t.prototype,"color",2);s([o({type:Boolean,reflect:!0})],t.prototype,"mirrored",2);t=s([H("ph-plus")],t);export{t as PhPlus};
