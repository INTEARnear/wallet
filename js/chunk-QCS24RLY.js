import{c as n,d as r}from"./chunk-G6MGL5IE.js";import{h as e}from"./chunk-WGWCH7J2.js";var d=()=>new o,o=class{},h=new WeakMap,v=n(class extends r{render(t){return e}update(t,[s]){let i=s!==this.G;return i&&this.G!==void 0&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=s,this.ht=t.options?.host,this.rt(this.ct=t.element)),e}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){let s=this.ht??globalThis,i=h.get(s);i===void 0&&(i=new WeakMap,h.set(s,i)),i.get(this.G)!==void 0&&this.G.call(this.ht,void 0),i.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?h.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});export{d as a,v as b};
/*! Bundled license information:

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
