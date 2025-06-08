import{R as W,W as I}from"./chunk-ORERQN7J.js";import{a as L}from"./chunk-4WDX262A.js";import{a as v}from"./chunk-G6MGL5IE.js";import{b as k,e as b,f as x,j as O}from"./chunk-WGWCH7J2.js";import{f as D}from"./chunk-57YRCRKT.js";var N=D(L(),1);var T=.1,M=2.5,w=7;function E(l,r,h){return l===r?!1:(l-r<0?r-l:l-r)<=h+T}function q(l,r){let h=Array.prototype.slice.call(N.default.create(l,{errorCorrectionLevel:r}).modules.data,0),d=Math.sqrt(h.length);return h.reduce((p,u,f)=>(f%d===0?p.push([u]):p[p.length-1].push(u))&&p,[])}var A={generate({uri:l,size:r,logoSize:h,dotColor:d="#141414"}){let p="transparent",f=[],c=q(l,"Q"),s=r/c.length,C=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];C.forEach(({x:o,y:t})=>{let n=(c.length-w)*s*o,e=(c.length-w)*s*t,a=.45;for(let i=0;i<C.length;i+=1){let g=s*(w-i*2);f.push(x`
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
          `)}});let R=Math.floor((h+25)/s),z=c.length/2-R/2,S=c.length/2+R/2-1,_=[];c.forEach((o,t)=>{o.forEach((n,e)=>{if(c[t][e]&&!(t<w&&e<w||t>c.length-(w+1)&&e<w||t<w&&e>c.length-(w+1))&&!(t>z&&t<S&&e>z&&e<S)){let a=t*s+s/2,i=e*s+s/2;_.push([a,i])}})});let y={};return _.forEach(([o,t])=>{y[o]?y[o]?.push(t):y[o]=[t]}),Object.entries(y).map(([o,t])=>{let n=t.filter(e=>t.every(a=>!E(e,a,s)));return[Number(o),n]}).forEach(([o,t])=>{t.forEach(n=>{f.push(x`<circle cx=${o} cy=${n} fill=${d} r=${s/M} />`)})}),Object.entries(y).filter(([o,t])=>t.length>1).map(([o,t])=>{let n=t.filter(e=>t.some(a=>E(e,a,s)));return[Number(o),n]}).map(([o,t])=>{t.sort((e,a)=>e<a?-1:1);let n=[];for(let e of t){let a=n.find(i=>i.some(g=>E(e,g,s)));a?a.push(e):n.push([e])}return[o,n.map(e=>[e[0],e[e.length-1]])]}).forEach(([o,t])=>{t.forEach(([n,e])=>{f.push(x`
              <line
                x1=${o}
                x2=${o}
                y1=${n}
                y2=${e}
                stroke=${d}
                stroke-width=${s/(M/2)}
                stroke-linecap="round"
              />
            `)})}),f}};var Q=k`
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
`;var $=function(l,r,h,d){var p=arguments.length,u=p<3?r:d===null?d=Object.getOwnPropertyDescriptor(r,h):d,f;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")u=Reflect.decorate(l,r,h,d);else for(var c=l.length-1;c>=0;c--)(f=l[c])&&(u=(p<3?f(u):p>3?f(r,h,u):f(r,h))||u);return p>3&&u&&Object.defineProperty(r,h,u),u},U="#3396ff",m=class extends O{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`
     --local-size: ${this.size}px;
     --local-icon-color: ${this.color??U}
    `,b`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){let r=this.theme==="light"?this.size:this.size-32;return x`
      <svg height=${r} width=${r}>
        ${A.generate({uri:this.uri,size:r,logoSize:this.arenaClear?0:r/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?b`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?b`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:b`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};m.styles=[W,Q];$([v()],m.prototype,"uri",void 0);$([v({type:Number})],m.prototype,"size",void 0);$([v()],m.prototype,"theme",void 0);$([v()],m.prototype,"imageSrc",void 0);$([v()],m.prototype,"alt",void 0);$([v()],m.prototype,"color",void 0);$([v({type:Boolean})],m.prototype,"arenaClear",void 0);$([v({type:Boolean})],m.prototype,"farcaster",void 0);m=$([I("wui-qr-code")],m);
