import{r as g,v as b,z as x}from"./chunk-RZQOM5QR.js";import{a as d}from"./chunk-IDZGCU4F.js";import{e as m,k as h}from"./chunk-ZS2R6O6N.js";import{i as e,k as i,o as a}from"./chunk-JY5TIRRF.js";e();a();i();e();a();i();e();a();i();var $=g`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: ${({tokens:t})=>t.theme.borderPrimary};
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 8px;
    transition: background-color ${({durations:t})=>t.lg}
      ${({easings:t})=>t["ease-out-power-2"]};
    will-change: background-color;
  }

  :host([data-bg-color='primary']) > wui-text {
    background-color: ${({tokens:t})=>t.theme.backgroundPrimary};
  }

  :host([data-bg-color='secondary']) > wui-text {
    background-color: ${({tokens:t})=>t.theme.foregroundPrimary};
  }
`;var f=function(t,o,l,s){var p=arguments.length,r=p<3?o:s===null?s=Object.getOwnPropertyDescriptor(o,l):s,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,o,l,s);else for(var u=t.length-1;u>=0;u--)(c=t[u])&&(r=(p<3?c(r):p>3?c(o,l,r):c(o,l))||r);return p>3&&r&&Object.defineProperty(o,l,r),r},n=class extends h{constructor(){super(...arguments),this.text="",this.bgColor="primary"}render(){return this.dataset.bgColor=this.bgColor,m`${this.template()}`}template(){return this.text?m`<wui-text variant="md-regular" color="secondary">${this.text}</wui-text>`:null}};n.styles=[b,$];f([d()],n.prototype,"text",void 0);f([d()],n.prototype,"bgColor",void 0);n=f([x("wui-separator")],n);
