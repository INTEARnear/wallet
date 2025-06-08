import{U as h,Z as x}from"./chunk-AXPE5NAX.js";import{b as p,e as n,j as f}from"./chunk-WGWCH7J2.js";var a=p`
  :host > wui-flex:first-child {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
  }

  wui-flex {
    display: flex;
    flex: 1;
  }
`;var w=function(r,e,t,s){var m=arguments.length,i=m<3?e:s===null?s=Object.getOwnPropertyDescriptor(e,t):s,o;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(r,e,t,s);else for(var l=r.length-1;l>=0;l--)(o=r[l])&&(i=(m<3?o(i):m>3?o(e,t,i):o(e,t))||i);return m>3&&i&&Object.defineProperty(e,t,i),i},u=class extends f{render(){return n`
      <wui-flex alignItems="center">
        <wui-shimmer width="40px" height="40px"></wui-shimmer>
        <wui-flex flexDirection="column" gap="2xs">
          <wui-shimmer width="72px" height="16px" borderRadius="4xs"></wui-shimmer>
          <wui-shimmer width="148px" height="14px" borderRadius="4xs"></wui-shimmer>
        </wui-flex>
        <wui-shimmer width="24px" height="12px" borderRadius="5xs"></wui-shimmer>
      </wui-flex>
    `}};u.styles=[h,a];u=w([x("wui-transaction-list-item-loader")],u);
