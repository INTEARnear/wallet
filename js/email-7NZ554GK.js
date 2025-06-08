import"./chunk-VHY4SSAM.js";import{a as I}from"./chunk-ANQ7QFBQ.js";import"./chunk-ZMTN5ZA6.js";import{a as U}from"./chunk-C76LFVKJ.js";import"./chunk-5WTFWRCP.js";import"./chunk-UBFO2KND.js";import"./chunk-R3HHGVZK.js";import{a as j,b as k}from"./chunk-QCS24RLY.js";import"./chunk-RKR3IYQX.js";import"./chunk-EU7G326H.js";import"./chunk-56O5FGVR.js";import"./chunk-MH4YIKVJ.js";import{a as E,b as m}from"./chunk-G6MGL5IE.js";import{A as g,D as W,G as A,J as N,U as O,V as F,X as T,Z as c,b as L,l as v,m as C,q as p,s,u as h}from"./chunk-AXPE5NAX.js";import"./chunk-YDPF4UGR.js";import"./chunk-LQBGFF7Y.js";import"./chunk-F3BT2OCD.js";import"./chunk-OIFNSKKM.js";import"./chunk-YY5EM6U5.js";import"./chunk-LHWHJQRC.js";import"./chunk-V7H3HPRQ.js";import"./chunk-EAWY7VYO.js";import"./chunk-JJVWQEYF.js";import"./chunk-JGRP444H.js";import"./chunk-URLXKBQX.js";import"./chunk-FFQJ55XB.js";import"./chunk-6K56CBXQ.js";import{b as w,e as u,j as d}from"./chunk-WGWCH7J2.js";import"./chunk-57YRCRKT.js";var z=w`
  :host {
    position: relative;
    display: inline-block;
  }

  input {
    width: 50px;
    height: 50px;
    background: var(--wui-color-gray-glass-010);
    border-radius: var(--wui-border-radius-xs);
    border: 1px solid var(--wui-color-gray-glass-005);
    font-family: var(--wui-font-family);
    font-size: var(--wui-font-size-large);
    font-weight: var(--wui-font-weight-regular);
    letter-spacing: var(--wui-letter-spacing-large);
    text-align: center;
    color: var(--wui-color-fg-100);
    caret-color: var(--wui-color-accent-100);
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      box-shadow var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color, box-shadow;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: textfield;
    padding: 0px;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-color-gray-glass-010);
    background: var(--wui-color-gray-glass-005);
  }

  input:focus:enabled {
    background-color: var(--wui-color-gray-glass-015);
    border: 1px solid var(--wui-color-accent-100);
    -webkit-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow: 0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  @media (hover: hover) and (pointer: fine) {
    input:hover:enabled {
      background-color: var(--wui-color-gray-glass-015);
    }
  }
`;var D=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},x=class extends d{constructor(){super(...arguments),this.disabled=!1,this.value=""}render(){return u`<input
      type="number"
      maxlength="1"
      inputmode="numeric"
      autofocus
      ?disabled=${this.disabled}
      value=${this.value}
    /> `}};x.styles=[O,F,z];D([E({type:Boolean})],x.prototype,"disabled",void 0);D([E({type:String})],x.prototype,"value",void 0);x=D([c("wui-input-numeric")],x);var M=w`
  :host {
    position: relative;
    display: block;
  }
`;var _=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},b=class extends d{constructor(){super(...arguments),this.length=6,this.otp="",this.values=Array.from({length:this.length}).map(()=>""),this.numerics=[],this.shouldInputBeEnabled=t=>this.values.slice(0,t).every(o=>o!==""),this.handleKeyDown=(t,e)=>{let o=t.target,r=this.getInputElement(o),i=["ArrowLeft","ArrowRight","Shift","Delete"];if(!r)return;i.includes(t.key)&&t.preventDefault();let n=r.selectionStart;switch(t.key){case"ArrowLeft":n&&r.setSelectionRange(n+1,n+1),this.focusInputField("prev",e);break;case"ArrowRight":this.focusInputField("next",e);break;case"Shift":this.focusInputField("next",e);break;case"Delete":r.value===""?this.focusInputField("prev",e):this.updateInput(r,e,"");break;case"Backspace":r.value===""?this.focusInputField("prev",e):this.updateInput(r,e,"");break;default:}},this.focusInputField=(t,e)=>{if(t==="next"){let o=e+1;if(!this.shouldInputBeEnabled(o))return;let r=this.numerics[o<this.length?o:e],i=r?this.getInputElement(r):void 0;i&&(i.disabled=!1,i.focus())}if(t==="prev"){let o=e-1,r=this.numerics[o>-1?o:e],i=r?this.getInputElement(r):void 0;i&&i.focus()}}}firstUpdated(){this.otp&&(this.values=this.otp.split(""));let t=this.shadowRoot?.querySelectorAll("wui-input-numeric");t&&(this.numerics=Array.from(t)),this.numerics[0]?.focus()}render(){return u`
      <wui-flex gap="xxs" data-testid="wui-otp-input">
        ${Array.from({length:this.length}).map((t,e)=>u`
            <wui-input-numeric
              @input=${o=>this.handleInput(o,e)}
              @click=${o=>this.selectInput(o)}
              @keydown=${o=>this.handleKeyDown(o,e)}
              .disabled=${!this.shouldInputBeEnabled(e)}
              .value=${this.values[e]||""}
            >
            </wui-input-numeric>
          `)}
      </wui-flex>
    `}updateInput(t,e,o){let r=this.numerics[e],i=t||(r?this.getInputElement(r):void 0);i&&(i.value=o,this.values=this.values.map((n,l)=>l===e?o:n))}selectInput(t){let e=t.target;e&&this.getInputElement(e)?.select()}handleInput(t,e){let o=t.target,r=this.getInputElement(o);if(r){let i=r.value;t.inputType==="insertFromPaste"?this.handlePaste(r,i,e):T.isNumber(i)&&t.data?(this.updateInput(r,e,t.data),this.focusInputField("next",e)):this.updateInput(r,e,"")}this.dispatchInputChangeEvent()}handlePaste(t,e,o){let r=e[0];if(r&&T.isNumber(r)){this.updateInput(t,o,r);let n=e.substring(1);if(o+1<this.length&&n.length){let l=this.numerics[o+1],P=l?this.getInputElement(l):void 0;P&&this.handlePaste(P,n,o+1)}else this.focusInputField("next",o)}else this.updateInput(t,o,"")}getInputElement(t){return t.shadowRoot?.querySelector("input")?t.shadowRoot.querySelector("input"):null}dispatchInputChangeEvent(){let t=this.values.join("");this.dispatchEvent(new CustomEvent("inputChange",{detail:t,bubbles:!0,composed:!0}))}};b.styles=[O,M];_([E({type:Number})],b.prototype,"length",void 0);_([E({type:String})],b.prototype,"otp",void 0);_([m()],b.prototype,"values",void 0);b=_([c("wui-otp")],b);var H=w`
  wui-loading-spinner {
    margin: 9px auto;
  }

  .email-display,
  .email-display wui-text {
    max-width: 100%;
  }
`;var R=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},X=6,f=class extends d{firstUpdated(){this.startOTPTimeout()}disconnectedCallback(){clearTimeout(this.OTPTimeout)}constructor(){super(),this.loading=!1,this.timeoutTimeLeft=I.getTimeToNextEmailLogin(),this.error="",this.otp="",this.email=s.state.data?.email,this.authConnector=h.getAuthConnector()}render(){if(!this.email)throw new Error("w3m-email-otp-widget: No email provided");let t=!!this.timeoutTimeLeft,e=this.getFooterLabels(t);return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["l","0","l","0"]}
        gap="l"
      >
        <wui-flex
          class="email-display"
          flexDirection="column"
          alignItems="center"
          .padding=${["0","xl","0","xl"]}
        >
          <wui-text variant="paragraph-400" color="fg-100" align="center">
            Enter the code we sent to
          </wui-text>
          <wui-text variant="paragraph-500" color="fg-100" lineClamp="1" align="center">
            ${this.email}
          </wui-text>
        </wui-flex>

        <wui-text variant="small-400" color="fg-200">The code expires in 20 minutes</wui-text>

        ${this.loading?u`<wui-loading-spinner size="xl" color="accent-100"></wui-loading-spinner>`:u` <wui-flex flexDirection="column" alignItems="center" gap="xs">
              <wui-otp
                dissabled
                length="6"
                @inputChange=${this.onOtpInputChange.bind(this)}
                .otp=${this.otp}
              ></wui-otp>
              ${this.error?u`
                    <wui-text variant="small-400" align="center" color="error-100">
                      ${this.error}. Try Again
                    </wui-text>
                  `:null}
            </wui-flex>`}

        <wui-flex alignItems="center" gap="xs">
          <wui-text variant="small-400" color="fg-200">${e.title}</wui-text>
          <wui-link @click=${this.onResendCode.bind(this)} .disabled=${t}>
            ${e.action}
          </wui-link>
        </wui-flex>
      </wui-flex>
    `}startOTPTimeout(){this.timeoutTimeLeft=I.getTimeToNextEmailLogin(),this.OTPTimeout=setInterval(()=>{this.timeoutTimeLeft>0?this.timeoutTimeLeft=I.getTimeToNextEmailLogin():clearInterval(this.OTPTimeout)},1e3)}async onOtpInputChange(t){try{this.loading||(this.otp=t.detail,this.authConnector&&this.otp.length===X&&(this.loading=!0,await this.onOtpSubmit?.(this.otp)))}catch(e){this.error=v.parseError(e),this.loading=!1}}async onResendCode(){try{if(this.onOtpResend){if(!this.loading&&!this.timeoutTimeLeft){if(this.error="",this.otp="",!h.getAuthConnector()||!this.email)throw new Error("w3m-email-otp-widget: Unable to resend email");this.loading=!0,await this.onOtpResend(this.email),this.startOTPTimeout(),g.showSuccess("Code email resent")}}else this.onStartOver&&this.onStartOver()}catch(t){g.showError(t)}finally{this.loading=!1}}getFooterLabels(t){return this.onStartOver?{title:"Something wrong?",action:`Try again ${t?`in ${this.timeoutTimeLeft}s`:""}`}:{title:"Didn't receive it?",action:`Resend ${t?`in ${this.timeoutTimeLeft}s`:"Code"}`}}};f.styles=H;R([m()],f.prototype,"loading",void 0);R([m()],f.prototype,"timeoutTimeLeft",void 0);R([m()],f.prototype,"error",void 0);f=R([c("w3m-email-otp-widget")],f);var Z=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},B=class extends f{constructor(){super(...arguments),this.onOtpSubmit=async t=>{try{if(this.authConnector){if(await this.authConnector.provider.connectOtp({otp:t}),p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),A.state.activeChain)await W.connectExternal(this.authConnector,A.state.activeChain);else throw new Error("Active chain is not set on ChainControll");p.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"email",name:this.authConnector.name||"Unknown"}}),C.state.siwx||N.close()}}catch(e){throw p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:v.parseError(e)}}),e}},this.onOtpResend=async t=>{this.authConnector&&(await this.authConnector.provider.connectEmail({email:t}),p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}))}}};B=Z([c("w3m-email-verify-otp-view")],B);var q=w`
  wui-icon-box {
    height: var(--wui-icon-box-size-xl);
    width: var(--wui-icon-box-size-xl);
  }
`;var K=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},S=class extends d{constructor(){super(),this.email=s.state.data?.email,this.authConnector=h.getAuthConnector(),this.loading=!1,this.listenForDeviceApproval()}render(){if(!this.email)throw new Error("w3m-email-verify-device-view: No email provided");if(!this.authConnector)throw new Error("w3m-email-verify-device-view: No auth connector provided");return u`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xxl","s","xxl","s"]}
        gap="l"
      >
        <wui-icon-box
          size="xl"
          iconcolor="accent-100"
          backgroundcolor="accent-100"
          icon="verify"
          background="opaque"
        ></wui-icon-box>

        <wui-flex flexDirection="column" alignItems="center" gap="s">
          <wui-flex flexDirection="column" alignItems="center">
            <wui-text variant="paragraph-400" color="fg-100">
              Approve the login link we sent to
            </wui-text>
            <wui-text variant="paragraph-400" color="fg-100"><b>${this.email}</b></wui-text>
          </wui-flex>

          <wui-text variant="small-400" color="fg-200" align="center">
            The code expires in 20 minutes
          </wui-text>

          <wui-flex alignItems="center" id="w3m-resend-section" gap="xs">
            <wui-text variant="small-400" color="fg-100" align="center">
              Didn't receive it?
            </wui-text>
            <wui-link @click=${this.onResendCode.bind(this)} .disabled=${this.loading}>
              Resend email
            </wui-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}async listenForDeviceApproval(){if(this.authConnector)try{await this.authConnector.provider.connectDevice(),p.sendEvent({type:"track",event:"DEVICE_REGISTERED_FOR_EMAIL"}),p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),s.replace("EmailVerifyOtp",{email:this.email})}catch{s.goBack()}}async onResendCode(){try{if(!this.loading){if(!this.authConnector||!this.email)throw new Error("w3m-email-login-widget: Unable to resend email");this.loading=!0,await this.authConnector.provider.connectEmail({email:this.email}),this.listenForDeviceApproval(),g.showSuccess("Code email resent")}}catch(t){g.showError(t)}finally{this.loading=!1}}};S.styles=q;K([m()],S.prototype,"loading",void 0);S=K([c("w3m-email-verify-device-view")],S);var Y=w`
  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }
`;var V=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},y=class extends d{constructor(){super(...arguments),this.formRef=j(),this.initialEmail=s.state.data?.email??"",this.redirectView=s.state.data?.redirectView,this.email="",this.loading=!1}firstUpdated(){this.formRef.value?.addEventListener("keydown",t=>{t.key==="Enter"&&this.onSubmitEmail(t)})}render(){return u`
      <wui-flex flexDirection="column" padding="m" gap="m">
        <form ${k(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
          <wui-email-input
            value=${this.initialEmail}
            .disabled=${this.loading}
            @inputChange=${this.onEmailInputChange.bind(this)}
          >
          </wui-email-input>
          <input type="submit" hidden />
        </form>
        ${this.buttonsTemplate()}
      </wui-flex>
    `}onEmailInputChange(t){this.email=t.detail}async onSubmitEmail(t){try{if(this.loading)return;this.loading=!0,t.preventDefault();let e=h.getAuthConnector();if(!e)throw new Error("w3m-update-email-wallet: Auth connector not found");let o=await e.provider.updateEmail({email:this.email});p.sendEvent({type:"track",event:"EMAIL_EDIT"}),o.action==="VERIFY_SECONDARY_OTP"?s.push("UpdateEmailSecondaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView}):s.push("UpdateEmailPrimaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView})}catch(e){g.showError(e),this.loading=!1}}buttonsTemplate(){let t=!this.loading&&this.email.length>3&&this.email!==this.initialEmail;return this.redirectView?u`
      <wui-flex gap="s">
        <wui-button size="md" variant="neutral" fullWidth @click=${s.goBack}>
          Cancel
        </wui-button>

        <wui-button
          size="md"
          variant="main"
          fullWidth
          @click=${this.onSubmitEmail.bind(this)}
          .disabled=${!t}
          .loading=${this.loading}
        >
          Save
        </wui-button>
      </wui-flex>
    `:u`
        <wui-button
          size="md"
          variant="main"
          fullWidth
          @click=${this.onSubmitEmail.bind(this)}
          .disabled=${!t}
          .loading=${this.loading}
        >
          Save
        </wui-button>
      `}};y.styles=Y;V([m()],y.prototype,"email",void 0);V([m()],y.prototype,"loading",void 0);y=V([c("w3m-update-email-wallet-view")],y);var tt=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},G=class extends f{constructor(){super(),this.email=s.state.data?.email,this.onOtpSubmit=async t=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailPrimaryOtp({otp:t}),p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),s.replace("UpdateEmailSecondaryOtp",s.state.data))}catch(e){throw p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:v.parseError(e)}}),e}},this.onStartOver=()=>{s.replace("UpdateEmailWallet",s.state.data)}}};G=tt([c("w3m-update-email-primary-otp-view")],G);var et=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},J=class extends f{constructor(){super(),this.email=s.state.data?.newEmail,this.redirectView=s.state.data?.redirectView,this.onOtpSubmit=async t=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailSecondaryOtp({otp:t}),p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),this.redirectView&&s.reset(this.redirectView))}catch(e){throw p.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:v.parseError(e)}}),e}},this.onStartOver=()=>{s.replace("UpdateEmailWallet",s.state.data)}}};J=et([c("w3m-update-email-secondary-otp-view")],J);var Q=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},$=class extends d{constructor(){super(),this.authConnector=h.getAuthConnector(),this.isEmailEnabled=C.state.remoteFeatures?.email,this.isAuthEnabled=this.checkIfAuthEnabled(h.state.connectors),this.connectors=h.state.connectors,h.subscribeKey("connectors",t=>{this.connectors=t,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)})}render(){if(!this.isEmailEnabled)throw new Error("w3m-email-login-view: Email is not enabled");if(!this.isAuthEnabled)throw new Error("w3m-email-login-view: No auth connector provided");return u`<wui-flex
      flexDirection="column"
      .padding=${["3xs","m","m","m"]}
      gap="l"
    >
      <w3m-email-login-widget></w3m-email-login-widget>
    </wui-flex> `}checkIfAuthEnabled(t){let e=t.filter(r=>r.type===U.CONNECTOR_TYPE_AUTH).map(r=>r.chain);return L.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(r=>e.includes(r))}};Q([m()],$.prototype,"connectors",void 0);$=Q([c("w3m-email-login-view")],$);export{$ as W3mEmailLoginView,S as W3mEmailVerifyDeviceView,B as W3mEmailVerifyOtpView,G as W3mUpdateEmailPrimaryOtpView,J as W3mUpdateEmailSecondaryOtpView,y as W3mUpdateEmailWalletView};
