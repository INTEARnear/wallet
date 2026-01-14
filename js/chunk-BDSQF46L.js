import{b as l}from"./chunk-N3PRX6SH.js";import{d as a}from"./chunk-IDZGCU4F.js";import{i as n}from"./chunk-ZS2R6O6N.js";import{i as e,k as h,o}from"./chunk-JY5TIRRF.js";e();o();h();var m=()=>new c,c=class{},r=new WeakMap,u=a(class extends l{render(t){return n}update(t,[s]){let i=s!==this.G;return i&&this.G!==void 0&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=s,this.ht=t.options?.host,this.rt(this.ct=t.element)),n}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){let s=this.ht??globalThis,i=r.get(s);i===void 0&&(i=new WeakMap,r.set(s,i)),i.get(this.G)!==void 0&&this.G.call(this.ht,void 0),i.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?r.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});e();o();h();export{m as a,u as b};
/*! Bundled license information:

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
