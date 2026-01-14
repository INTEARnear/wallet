import{c as a,e as d}from"./chunk-IDZGCU4F.js";import{j as c}from"./chunk-ZS2R6O6N.js";import{i as n,k as $,o as _}from"./chunk-JY5TIRRF.js";n();_();$();n();_();$();var{I:P}=c,x=e=>e===null||typeof e!="object"&&typeof e!="function";var h=e=>e.strings===void 0;var r=(e,t)=>{let i=e._$AN;if(i===void 0)return!1;for(let s of i)s._$AO?.(t,!1),r(s,t);return!0},l=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while(i?.size===0)},p=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),y(t)}};function C(e){this._$AN!==void 0?(l(this),this._$AM=e,p(this)):this._$AM=e}function T(e,t=!1,i=0){let s=this._$AH,A=this._$AN;if(A!==void 0&&A.size!==0)if(t)if(Array.isArray(s))for(let o=i;o<s.length;o++)r(s[o],!1),l(s[o]);else s!=null&&(r(s,!1),l(s));else r(this,e)}var y=e=>{e.type==a.CHILD&&(e._$AP??=T,e._$AQ??=C)},f=class extends d{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,s){super._$AT(t,i,s),p(this),this.isConnected=t._$AU}_$AO(t,i=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),i&&(r(this,t),l(this))}setValue(t){if(h(this._$Ct))this._$Ct._$AI(t,this);else{let i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}};export{x as a,f as b};
/*! Bundled license information:

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
