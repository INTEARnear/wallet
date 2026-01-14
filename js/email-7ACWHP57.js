import"./chunk-QKQFBXVX.js";import{a as T}from"./chunk-ECJO7S2V.js";import{a as q}from"./chunk-W4MYE3I6.js";import"./chunk-HANOCJWG.js";import"./chunk-DW5UEWXF.js";import"./chunk-3IF2M6VT.js";import"./chunk-YYMQ6HDD.js";import"./chunk-FB5BNV7C.js";import"./chunk-LW4FQU5S.js";import"./chunk-BR7S6AGZ.js";import{c as D,d as K,f as U,h}from"./chunk-LTN6YROF.js";import{B as d,D as p,F as b,I as y,K as L,M as N,P as W,f as B,r as I,s as R}from"./chunk-N2WXLAZF.js";import"./chunk-X4QP7L3N.js";import{a as M,b as H}from"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-B2LU4KHT.js";import{a as O,b as g}from"./chunk-IDZGCU4F.js";import{b as C,e as m,k as E}from"./chunk-ZS2R6O6N.js";import"./chunk-6HADIPAO.js";import"./chunk-XQOHLC2A.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as s,k as c,o as u}from"./chunk-JY5TIRRF.js";s();u();c();s();u();c();s();u();c();s();u();c();s();u();c();s();u();c();s();u();c();var Y=C`
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
`;var F=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},S=class extends E{constructor(){super(...arguments),this.disabled=!1,this.value=""}render(){return m`<input
      type="number"
      maxlength="1"
      inputmode="numeric"
      autofocus
      ?disabled=${this.disabled}
      value=${this.value}
    /> `}};S.styles=[D,K,Y];F([O({type:Boolean})],S.prototype,"disabled",void 0);F([O({type:String})],S.prototype,"value",void 0);S=F([h("wui-input-numeric")],S);s();u();c();var G=C`
  :host {
    position: relative;
    display: block;
  }
`;var P=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},_=class extends E{constructor(){super(...arguments),this.length=6,this.otp="",this.values=Array.from({length:this.length}).map(()=>""),this.numerics=[],this.shouldInputBeEnabled=t=>this.values.slice(0,t).every(o=>o!==""),this.handleKeyDown=(t,e)=>{let o=t.target,r=this.getInputElement(o),i=["ArrowLeft","ArrowRight","Shift","Delete"];if(!r)return;i.includes(t.key)&&t.preventDefault();let n=r.selectionStart;switch(t.key){case"ArrowLeft":n&&r.setSelectionRange(n+1,n+1),this.focusInputField("prev",e);break;case"ArrowRight":this.focusInputField("next",e);break;case"Shift":this.focusInputField("next",e);break;case"Delete":r.value===""?this.focusInputField("prev",e):this.updateInput(r,e,"");break;case"Backspace":r.value===""?this.focusInputField("prev",e):this.updateInput(r,e,"");break;default:}},this.focusInputField=(t,e)=>{if(t==="next"){let o=e+1;if(!this.shouldInputBeEnabled(o))return;let r=this.numerics[o<this.length?o:e],i=r?this.getInputElement(r):void 0;i&&(i.disabled=!1,i.focus())}if(t==="prev"){let o=e-1,r=this.numerics[o>-1?o:e],i=r?this.getInputElement(r):void 0;i&&i.focus()}}}firstUpdated(){this.otp&&(this.values=this.otp.split(""));let t=this.shadowRoot?.querySelectorAll("wui-input-numeric");t&&(this.numerics=Array.from(t)),this.numerics[0]?.focus()}render(){return m`
      <wui-flex gap="xxs" data-testid="wui-otp-input">
        ${Array.from({length:this.length}).map((t,e)=>m`
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
    `}updateInput(t,e,o){let r=this.numerics[e],i=t||(r?this.getInputElement(r):void 0);i&&(i.value=o,this.values=this.values.map((n,l)=>l===e?o:n))}selectInput(t){let e=t.target;e&&this.getInputElement(e)?.select()}handleInput(t,e){let o=t.target,r=this.getInputElement(o);if(r){let i=r.value;t.inputType==="insertFromPaste"?this.handlePaste(r,i,e):U.isNumber(i)&&t.data?(this.updateInput(r,e,t.data),this.focusInputField("next",e)):this.updateInput(r,e,"")}this.dispatchInputChangeEvent()}handlePaste(t,e,o){let r=e[0];if(r&&U.isNumber(r)){this.updateInput(t,o,r);let n=e.substring(1);if(o+1<this.length&&n.length){let l=this.numerics[o+1],z=l?this.getInputElement(l):void 0;z&&this.handlePaste(z,n,o+1)}else this.focusInputField("next",o)}else this.updateInput(t,o,"")}getInputElement(t){return t.shadowRoot?.querySelector("input")?t.shadowRoot.querySelector("input"):null}dispatchInputChangeEvent(){let t=this.values.join("");this.dispatchEvent(new CustomEvent("inputChange",{detail:t,bubbles:!0,composed:!0}))}};_.styles=[D,G];P([O({type:Number})],_.prototype,"length",void 0);P([O({type:String})],_.prototype,"otp",void 0);P([g()],_.prototype,"values",void 0);_=P([h("wui-otp")],_);s();u();c();var J=C`
  wui-loading-spinner {
    margin: 9px auto;
  }

  .email-display,
  .email-display wui-text {
    max-width: 100%;
  }
`;var V=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},rt=6,x=class extends E{firstUpdated(){this.startOTPTimeout()}disconnectedCallback(){clearTimeout(this.OTPTimeout)}constructor(){super(),this.loading=!1,this.timeoutTimeLeft=T.getTimeToNextEmailLogin(),this.error="",this.otp="",this.email=p.state.data?.email,this.authConnector=b.getAuthConnector()}render(){if(!this.email)throw new Error("w3m-email-otp-widget: No email provided");let t=!!this.timeoutTimeLeft,e=this.getFooterLabels(t);return m`
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

        ${this.loading?m`<wui-loading-spinner size="xl" color="accent-100"></wui-loading-spinner>`:m` <wui-flex flexDirection="column" alignItems="center" gap="xs">
              <wui-otp
                dissabled
                length="6"
                @inputChange=${this.onOtpInputChange.bind(this)}
                .otp=${this.otp}
              ></wui-otp>
              ${this.error?m`
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
    `}startOTPTimeout(){this.timeoutTimeLeft=T.getTimeToNextEmailLogin(),this.OTPTimeout=setInterval(()=>{this.timeoutTimeLeft>0?this.timeoutTimeLeft=T.getTimeToNextEmailLogin():clearInterval(this.OTPTimeout)},1e3)}async onOtpInputChange(t){try{this.loading||(this.otp=t.detail,this.authConnector&&this.otp.length===rt&&(this.loading=!0,await this.onOtpSubmit?.(this.otp)))}catch(e){this.error=I.parseError(e),this.loading=!1}}async onResendCode(){try{if(this.onOtpResend){if(!this.loading&&!this.timeoutTimeLeft){if(this.error="",this.otp="",!b.getAuthConnector()||!this.email)throw new Error("w3m-email-otp-widget: Unable to resend email");this.loading=!0,await this.onOtpResend(this.email),this.startOTPTimeout(),y.showSuccess("Code email resent")}}else this.onStartOver&&this.onStartOver()}catch(t){y.showError(t)}finally{this.loading=!1}}getFooterLabels(t){return this.onStartOver?{title:"Something wrong?",action:`Try again ${t?`in ${this.timeoutTimeLeft}s`:""}`}:{title:"Didn't receive it?",action:`Resend ${t?`in ${this.timeoutTimeLeft}s`:"Code"}`}}};x.styles=J;V([g()],x.prototype,"loading",void 0);V([g()],x.prototype,"timeoutTimeLeft",void 0);V([g()],x.prototype,"error",void 0);x=V([h("w3m-email-otp-widget")],x);var nt=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},Q=class extends x{constructor(){super(...arguments),this.onOtpSubmit=async t=>{try{if(this.authConnector){let e=N.state.activeChain,o=L.getConnections(e),r=R.state.remoteFeatures?.multiWallet,i=o.length>0;if(await this.authConnector.provider.connectOtp({otp:t}),d.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),e)await L.connectExternal(this.authConnector,e);else throw new Error("Active chain is not set on ChainControll");d.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"email",name:this.authConnector.name||"Unknown",caipNetworkId:N.getActiveCaipNetwork()?.caipNetworkId}}),R.state.siwx?W.close():i&&r?(p.replace("ProfileWallets"),y.showSuccess("New Wallet Added")):W.close()}}catch(e){throw d.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:I.parseError(e)}}),e}},this.onOtpResend=async t=>{this.authConnector&&(await this.authConnector.provider.connectEmail({email:t}),d.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}))}}};Q=nt([h("w3m-email-verify-otp-view")],Q);s();u();c();s();u();c();var X=C`
  wui-icon-box {
    height: var(--wui-icon-box-size-xl);
    width: var(--wui-icon-box-size-xl);
  }
`;var Z=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},$=class extends E{constructor(){super(),this.email=p.state.data?.email,this.authConnector=b.getAuthConnector(),this.loading=!1,this.listenForDeviceApproval()}render(){if(!this.email)throw new Error("w3m-email-verify-device-view: No email provided");if(!this.authConnector)throw new Error("w3m-email-verify-device-view: No auth connector provided");return m`
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
    `}async listenForDeviceApproval(){if(this.authConnector)try{await this.authConnector.provider.connectDevice(),d.sendEvent({type:"track",event:"DEVICE_REGISTERED_FOR_EMAIL"}),d.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),p.replace("EmailVerifyOtp",{email:this.email})}catch{p.goBack()}}async onResendCode(){try{if(!this.loading){if(!this.authConnector||!this.email)throw new Error("w3m-email-login-widget: Unable to resend email");this.loading=!0,await this.authConnector.provider.connectEmail({email:this.email}),this.listenForDeviceApproval(),y.showSuccess("Code email resent")}}catch(t){y.showError(t)}finally{this.loading=!1}}};$.styles=X;Z([g()],$.prototype,"loading",void 0);$=Z([h("w3m-email-verify-device-view")],$);s();u();c();s();u();c();var tt=C`
  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }
`;var j=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},A=class extends E{constructor(){super(...arguments),this.formRef=M(),this.initialEmail=p.state.data?.email??"",this.redirectView=p.state.data?.redirectView,this.email="",this.loading=!1}firstUpdated(){this.formRef.value?.addEventListener("keydown",t=>{t.key==="Enter"&&this.onSubmitEmail(t)})}render(){return m`
      <wui-flex flexDirection="column" padding="m" gap="m">
        <form ${H(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
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
    `}onEmailInputChange(t){this.email=t.detail}async onSubmitEmail(t){try{if(this.loading)return;this.loading=!0,t.preventDefault();let e=b.getAuthConnector();if(!e)throw new Error("w3m-update-email-wallet: Auth connector not found");let o=await e.provider.updateEmail({email:this.email});d.sendEvent({type:"track",event:"EMAIL_EDIT"}),o.action==="VERIFY_SECONDARY_OTP"?p.push("UpdateEmailSecondaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView}):p.push("UpdateEmailPrimaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView})}catch(e){y.showError(e),this.loading=!1}}buttonsTemplate(){let t=!this.loading&&this.email.length>3&&this.email!==this.initialEmail;return this.redirectView?m`
      <wui-flex gap="s">
        <wui-button size="md" variant="neutral" fullWidth @click=${p.goBack}>
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
    `:m`
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
      `}};A.styles=tt;j([g()],A.prototype,"email",void 0);j([g()],A.prototype,"loading",void 0);A=j([h("w3m-update-email-wallet-view")],A);s();u();c();var at=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},et=class extends x{constructor(){super(),this.email=p.state.data?.email,this.onOtpSubmit=async t=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailPrimaryOtp({otp:t}),d.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),p.replace("UpdateEmailSecondaryOtp",p.state.data))}catch(e){throw d.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:I.parseError(e)}}),e}},this.onStartOver=()=>{p.replace("UpdateEmailWallet",p.state.data)}}};et=at([h("w3m-update-email-primary-otp-view")],et);s();u();c();var lt=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},it=class extends x{constructor(){super(),this.email=p.state.data?.newEmail,this.redirectView=p.state.data?.redirectView,this.onOtpSubmit=async t=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailSecondaryOtp({otp:t}),d.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),this.redirectView&&p.reset(this.redirectView))}catch(e){throw d.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:I.parseError(e)}}),e}},this.onStartOver=()=>{p.replace("UpdateEmailWallet",p.state.data)}}};it=lt([h("w3m-update-email-secondary-otp-view")],it);s();u();c();var ot=function(a,t,e,o){var r=arguments.length,i=r<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,e):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(a,t,e,o);else for(var l=a.length-1;l>=0;l--)(n=a[l])&&(i=(r<3?n(i):r>3?n(t,e,i):n(t,e))||i);return r>3&&i&&Object.defineProperty(t,e,i),i},k=class extends E{constructor(){super(),this.authConnector=b.getAuthConnector(),this.isEmailEnabled=R.state.remoteFeatures?.email,this.isAuthEnabled=this.checkIfAuthEnabled(b.state.connectors),this.connectors=b.state.connectors,b.subscribeKey("connectors",t=>{this.connectors=t,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)})}render(){if(!this.isEmailEnabled)throw new Error("w3m-email-login-view: Email is not enabled");if(!this.isAuthEnabled)throw new Error("w3m-email-login-view: No auth connector provided");return m`<wui-flex
      flexDirection="column"
      .padding=${["3xs","m","m","m"]}
      gap="l"
    >
      <w3m-email-login-widget></w3m-email-login-widget>
    </wui-flex> `}checkIfAuthEnabled(t){let e=t.filter(r=>r.type===q.CONNECTOR_TYPE_AUTH).map(r=>r.chain);return B.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(r=>e.includes(r))}};ot([g()],k.prototype,"connectors",void 0);k=ot([h("w3m-email-login-view")],k);export{k as W3mEmailLoginView,$ as W3mEmailVerifyDeviceView,Q as W3mEmailVerifyOtpView,et as W3mUpdateEmailPrimaryOtpView,it as W3mUpdateEmailSecondaryOtpView,A as W3mUpdateEmailWalletView};
