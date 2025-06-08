import{c as C,d as x,g as u,h as b,i as T}from"./chunk-WGWCH7J2.js";var O={attribute:!0,type:String,converter:C,reflect:!1,hasChanged:x},q=(t=O,e,s)=>{let{kind:r,metadata:i}=s,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),r==="setter"&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),r==="accessor"){let{name:a}=s;return{set(o){let c=e.get.call(this);e.set.call(this,o),this.requestUpdate(a,c,t)},init(o){return o!==void 0&&this.C(a,void 0,t,o),o}}}if(r==="setter"){let{name:a}=s;return function(o){let c=this[a];e.call(this,o),this.requestUpdate(a,c,t)}}throw Error("Unsupported decorator location: "+r)};function P(t){return(e,s)=>typeof s=="object"?q(t,e,s):((r,i,n)=>{let a=i.hasOwnProperty(n);return i.constructor.createProperty(n,r),a?Object.getOwnPropertyDescriptor(i,n):void 0})(t,e,s)}function L(t){return P({...t,state:!0,attribute:!1})}var m={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},h=t=>(...e)=>({_$litDirective$:t,values:e}),l=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,s,r){this._$Ct=e,this._$AM=s,this._$Ci=r}_$AS(e,s){return this.update(e,s)}update(e,s){return this.render(...s)}};var mt=h(class extends l{constructor(t){if(super(t),t.type!==m.ATTRIBUTE||t.name!=="class"||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(this.st===void 0){this.st=new Set,t.strings!==void 0&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(let r in e)e[r]&&!this.nt?.has(r)&&this.st.add(r);return this.render(e)}let s=t.element.classList;for(let r of this.st)r in e||(s.remove(r),this.st.delete(r));for(let r in e){let i=!!e[r];i===this.st.has(r)||this.nt?.has(r)||(i?(s.add(r),this.st.add(r)):(s.remove(r),this.st.delete(r)))}return u}});var gt=t=>t??b;var{I:Pt}=T,w=t=>t===null||typeof t!="object"&&typeof t!="function";var E=t=>t.strings===void 0;var p=(t,e)=>{let s=t._$AN;if(s===void 0)return!1;for(let r of s)r._$AO?.(e,!1),p(r,e);return!0},$=t=>{let e,s;do{if((e=t._$AM)===void 0)break;s=e._$AN,s.delete(t),t=e}while(s?.size===0)},M=t=>{for(let e;e=t._$AM;t=e){let s=e._$AN;if(s===void 0)e._$AN=s=new Set;else if(s.has(t))break;s.add(t),j(e)}};function N(t){this._$AN!==void 0?($(this),this._$AM=t,M(this)):this._$AM=t}function U(t,e=!1,s=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(e)if(Array.isArray(r))for(let n=s;n<r.length;n++)p(r[n],!1),$(r[n]);else r!=null&&(p(r,!1),$(r));else p(this,t)}var j=t=>{t.type==m.CHILD&&(t._$AP??=U,t._$AQ??=N)},_=class extends l{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,s,r){super._$AT(e,s,r),M(this),this.isConnected=e._$AU}_$AO(e,s=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),s&&(p(this,e),$(this))}setValue(e){if(E(this._$Ct))this._$Ct._$AI(e,this);else{let s=[...this._$Ct._$AH];s[this._$Ci]=e,this._$Ct._$AI(s,this,0)}}disconnected(){}reconnected(){}};var A=class{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}},v=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}};var R=t=>!w(t)&&typeof t.then=="function",S=1073741823,g=class extends _{constructor(){super(...arguments),this._$Cwt=S,this._$Cbt=[],this._$CK=new A(this),this._$CX=new v}render(...e){return e.find(s=>!R(s))??u}update(e,s){let r=this._$Cbt,i=r.length;this._$Cbt=s;let n=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let o=0;o<s.length&&!(o>this._$Cwt);o++){let c=s[o];if(!R(c))return this._$Cwt=o,c;o<i&&c===r[o]||(this._$Cwt=S,i=0,Promise.resolve(c).then(async D=>{for(;a.get();)await a.get();let d=n.deref();if(d!==void 0){let y=d._$Cbt.indexOf(c);y>-1&&y<d._$Cwt&&(d._$Cwt=y,d.setValue(D))}}))}return u}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}},Bt=h(g);export{P as a,L as b,h as c,_ as d,Bt as e,mt as f,gt as g};
/*! Bundled license information:

@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
lit-html/directive.js:
lit-html/async-directive.js:
lit-html/directives/until.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
lit-html/directives/private-async-helpers.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
