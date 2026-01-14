import{c as D,h as L}from"./chunk-LTN6YROF.js";import{a as B}from"./chunk-GLIZJUBT.js";import{a as v}from"./chunk-IDZGCU4F.js";import{b as A,e as R,f as E,k as Q}from"./chunk-ZS2R6O6N.js";import{g as X,i as x,k as y,o as b}from"./chunk-JY5TIRRF.js";x();b();y();x();b();y();x();b();y();var q=X(B(),1);var F=.1,T=2.5,w=7;function z(l,r,h){return l===r?!1:(l-r<0?r-l:l-r)<=h+F}function P(l,r){let h=Array.prototype.slice.call(q.default.create(l,{errorCorrectionLevel:r}).modules.data,0),d=Math.sqrt(h.length);return h.reduce((p,u,f)=>(f%d===0?p.push([u]):p[p.length-1].push(u))&&p,[])}var U={generate({uri:l,size:r,logoSize:h,dotColor:d="#141414"}){let p="transparent",f=[],c=P(l,"Q"),s=r/c.length,O=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];O.forEach(({x:o,y:t})=>{let n=(c.length-w)*s*o,e=(c.length-w)*s*t,a=.45;for(let i=0;i<O.length;i+=1){let g=s*(w-i*2);f.push(E`
            <rect
              fill=${i===2?d:p}
              width=${i===0?g-5:g}
              rx= ${i===0?(g-5)*a:g*a}
              ry= ${i===0?(g-5)*a:g*a}
              stroke=${d}
              stroke-width=${i===0?5:0}
              height=${i===0?g-5:g}
              x= ${i===0?e+s*i+5/2:e+s*i}
              y= ${i===0?n+s*i+5/2:n+s*i}
            />
          `)}});let W=Math.floor((h+25)/s),I=c.length/2-W/2,M=c.length/2+W/2-1,N=[];c.forEach((o,t)=>{o.forEach((n,e)=>{if(c[t][e]&&!(t<w&&e<w||t>c.length-(w+1)&&e<w||t<w&&e>c.length-(w+1))&&!(t>I&&t<M&&e>I&&e<M)){let a=t*s+s/2,i=e*s+s/2;N.push([a,i])}})});let C={};return N.forEach(([o,t])=>{C[o]?C[o]?.push(t):C[o]=[t]}),Object.entries(C).map(([o,t])=>{let n=t.filter(e=>t.every(a=>!z(e,a,s)));return[Number(o),n]}).forEach(([o,t])=>{t.forEach(n=>{f.push(E`<circle cx=${o} cy=${n} fill=${d} r=${s/T} />`)})}),Object.entries(C).filter(([o,t])=>t.length>1).map(([o,t])=>{let n=t.filter(e=>t.some(a=>z(e,a,s)));return[Number(o),n]}).map(([o,t])=>{t.sort((e,a)=>e<a?-1:1);let n=[];for(let e of t){let a=n.find(i=>i.some(g=>z(e,g,s)));a?a.push(e):n.push([e])}return[o,n.map(e=>[e[0],e[e.length-1]])]}).forEach(([o,t])=>{t.forEach(([n,e])=>{f.push(E`
              <line
                x1=${o}
                x2=${o}
                y1=${n}
                y2=${e}
                stroke=${d}
                stroke-width=${s/(T/2)}
                stroke-linecap="round"
              />
            `)})}),f}};x();b();y();var G=A`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`;var $=function(l,r,h,d){var p=arguments.length,u=p<3?r:d===null?d=Object.getOwnPropertyDescriptor(r,h):d,f;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")u=Reflect.decorate(l,r,h,d);else for(var c=l.length-1;c>=0;c--)(f=l[c])&&(u=(p<3?f(u):p>3?f(r,h,u):f(r,h))||u);return p>3&&u&&Object.defineProperty(r,h,u),u},V="#3396ff",m=class extends Q{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`
     --local-size: ${this.size}px;
     --local-icon-color: ${this.color??V}
    `,R`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){let r=this.theme==="light"?this.size:this.size-32;return E`
      <svg height=${r} width=${r}>
        ${U.generate({uri:this.uri,size:r,logoSize:this.arenaClear?0:r/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?R`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?R`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:R`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};m.styles=[D,G];$([v()],m.prototype,"uri",void 0);$([v({type:Number})],m.prototype,"size",void 0);$([v()],m.prototype,"theme",void 0);$([v()],m.prototype,"imageSrc",void 0);$([v()],m.prototype,"alt",void 0);$([v()],m.prototype,"color",void 0);$([v({type:Boolean})],m.prototype,"arenaClear",void 0);$([v({type:Boolean})],m.prototype,"farcaster",void 0);m=$([L("wui-qr-code")],m);
