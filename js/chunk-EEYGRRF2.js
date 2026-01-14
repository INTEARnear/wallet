import{a as U}from"./chunk-GLIZJUBT.js";import{r as A,v as q,z as P}from"./chunk-RZQOM5QR.js";import{a as b}from"./chunk-IDZGCU4F.js";import{e as C,f as k,k as Q}from"./chunk-ZS2R6O6N.js";import{g as T,i as w,k as y,o as v}from"./chunk-JY5TIRRF.js";w();v();y();w();v();y();w();v();y();var B=T(U(),1);var X=.1,D=2.5,$=7;function R(t,n,f){return t===n?!1:(t-n<0?n-t:t-n)<=f+X}function j(t,n){let f=Array.prototype.slice.call(B.default.create(t,{errorCorrectionLevel:n}).modules.data,0),l=Math.sqrt(f.length);return f.reduce((h,d,p)=>(p%l===0?h.push([d]):h[h.length-1].push(d))&&h,[])}var G={generate({uri:t,size:n,logoSize:f,padding:l=8,dotColor:h="var(--apkt-colors-black)"}){let p=[],u=j(t,"Q"),s=(n-2*l)/u.length,W=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];W.forEach(({x:i,y:e})=>{let a=(u.length-$)*s*i+l,r=(u.length-$)*s*e+l,c=.45;for(let o=0;o<W.length;o+=1){let m=s*($-o*2);p.push(k`
            <rect
              fill=${o===2?"var(--apkt-colors-black)":"var(--apkt-colors-white)"}
              width=${o===0?m-10:m}
              rx= ${o===0?(m-10)*c:m*c}
              ry= ${o===0?(m-10)*c:m*c}
              stroke=${h}
              stroke-width=${o===0?10:0}
              height=${o===0?m-10:m}
              x= ${o===0?r+s*o+10/2:r+s*o}
              y= ${o===0?a+s*o+10/2:a+s*o}
            />
          `)}});let I=Math.floor((f+25)/s),M=u.length/2-I/2,O=u.length/2+I/2-1,N=[];u.forEach((i,e)=>{i.forEach((a,r)=>{if(u[e][r]&&!(e<$&&r<$||e>u.length-($+1)&&r<$||e<$&&r>u.length-($+1))&&!(e>M&&e<O&&r>M&&r<O)){let c=e*s+s/2+l,o=r*s+s/2+l;N.push([c,o])}})});let E={};return N.forEach(([i,e])=>{E[i]?E[i]?.push(e):E[i]=[e]}),Object.entries(E).map(([i,e])=>{let a=e.filter(r=>e.every(c=>!R(r,c,s)));return[Number(i),a]}).forEach(([i,e])=>{e.forEach(a=>{p.push(k`<circle cx=${i} cy=${a} fill=${h} r=${s/D} />`)})}),Object.entries(E).filter(([i,e])=>e.length>1).map(([i,e])=>{let a=e.filter(r=>e.some(c=>R(r,c,s)));return[Number(i),a]}).map(([i,e])=>{e.sort((r,c)=>r<c?-1:1);let a=[];for(let r of e){let c=a.find(o=>o.some(m=>R(r,m,s)));c?c.push(r):a.push([r])}return[i,a.map(r=>[r[0],r[r.length-1]])]}).forEach(([i,e])=>{e.forEach(([a,r])=>{p.push(k`
              <line
                x1=${i}
                x2=${i}
                y1=${a}
                y2=${r}
                stroke=${h}
                stroke-width=${s/(D/2)}
                stroke-linecap="round"
              />
            `)})}),p}};w();v();y();var L=A`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
    background-color: ${({colors:t})=>t.white};
    border: 1px solid ${({tokens:t})=>t.theme.borderPrimary};
  }

  :host {
    border-radius: ${({borderRadius:t})=>t[4]};
    display: flex;
    align-items: center;
    justify-content: center;
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
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
    box-shadow: inset 0 0 0 4px ${({tokens:t})=>t.theme.backgroundPrimary};
    border-radius: ${({borderRadius:t})=>t[6]};
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: ${({borderRadius:t})=>t[2]};
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: #3396ff !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }

  wui-icon > svg {
    width: inherit;
    height: inherit;
  }
`;var x=function(t,n,f,l){var h=arguments.length,d=h<3?n:l===null?l=Object.getOwnPropertyDescriptor(n,f):l,p;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")d=Reflect.decorate(t,n,f,l);else for(var u=t.length-1;u>=0;u--)(p=t[u])&&(d=(h<3?p(d):h>3?p(n,f,d):p(n,f))||d);return h>3&&d&&Object.defineProperty(n,f,d),d},g=class extends Q{constructor(){super(...arguments),this.uri="",this.size=500,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),C`<wui-flex
      alignItems="center"
      justifyContent="center"
      class="wui-qr-code"
      direction="column"
      gap="4"
      width="100%"
      style="height: 100%"
    >
      ${this.templateVisual()} ${this.templateSvg()}
    </wui-flex>`}templateSvg(){return k`
      <svg viewBox="0 0 ${this.size} ${this.size}" width="100%" height="100%">
        ${G.generate({uri:this.uri,size:this.size,logoSize:this.arenaClear?0:this.size/4})}
      </svg>
    `}templateVisual(){return this.imageSrc?C`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?C`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:C`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};g.styles=[q,L];x([b()],g.prototype,"uri",void 0);x([b({type:Number})],g.prototype,"size",void 0);x([b()],g.prototype,"theme",void 0);x([b()],g.prototype,"imageSrc",void 0);x([b()],g.prototype,"alt",void 0);x([b({type:Boolean})],g.prototype,"arenaClear",void 0);x([b({type:Boolean})],g.prototype,"farcaster",void 0);g=x([P("wui-qr-code")],g);
