import{a as _}from"./chunk-UKWUAY5J.js";import"./chunk-DLVLGZ7R.js";import"./chunk-YCKXBVJA.js";import{a as P}from"./chunk-6T7Q26JY.js";import"./chunk-NHUA5J6J.js";import"./chunk-RBOFKV5S.js";import{a as T,b as $}from"./chunk-BDSQF46L.js";import"./chunk-N3PRX6SH.js";import"./chunk-MNAGPPOX.js";import"./chunk-EJ5H5H5L.js";import"./chunk-IPTO6NMX.js";import"./chunk-BI3DTO7P.js";import"./chunk-B2LU4KHT.js";import{r as U,z as h}from"./chunk-RZQOM5QR.js";import"./chunk-HQPTEMSB.js";import{b as y}from"./chunk-IDZGCU4F.js";import{b as N,e as f,k as g}from"./chunk-ZS2R6O6N.js";import"./chunk-SQN7L5MN.js";import"./chunk-7GZ7JYLK.js";import"./chunk-6HADIPAO.js";import"./chunk-2T4BE52W.js";import"./chunk-XQOHLC2A.js";import{B as O,H as b,I as C,O as u,S as l,U as d,aa as R,ga as W,ia as A,j as D}from"./chunk-OXOEMY67.js";import"./chunk-HXA2I3EV.js";import"./chunk-JKAT2LPR.js";import"./chunk-WVZCG2XE.js";import"./chunk-SH2H32CZ.js";import"./chunk-BDUWLAUS.js";import"./chunk-OBMTZ2R2.js";import"./chunk-6ZQQ3XQO.js";import"./chunk-J26BEOSD.js";import"./chunk-MQMLE4BX.js";import"./chunk-UHIHVU5C.js";import"./chunk-EDRI7XUL.js";import{i as c,k as m,o as p}from"./chunk-JY5TIRRF.js";c();p();m();c();p();m();var B=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},F=class extends _{constructor(){super(...arguments),this.onOtpSubmit=async e=>{try{if(this.authConnector){let t=W.state.activeChain,o=R.getConnections(t),r=b.state.remoteFeatures?.multiWallet,i=o.length>0;if(await this.authConnector.provider.connectOtp({otp:e}),u.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),t)await R.connectExternal(this.authConnector,t);else throw new Error("Active chain is not set on ChainController");if(b.state.remoteFeatures?.emailCapture)return;if(b.state.siwx){A.close();return}if(i&&r){l.replace("ProfileWallets"),C.showSuccess("New Wallet Added");return}A.close()}}catch(t){throw u.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:O.parseError(t)}}),t}},this.onOtpResend=async e=>{this.authConnector&&(await this.authConnector.provider.connectEmail({email:e}),u.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}))}}};F=B([h("w3m-email-verify-otp-view")],F);c();p();m();c();p();m();var L=U`
  wui-icon-box {
    height: ${({spacing:n})=>n[16]};
    width: ${({spacing:n})=>n[16]};
  }
`;var j=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},I=class extends g{constructor(){super(),this.email=l.state.data?.email,this.authConnector=d.getAuthConnector(),this.loading=!1,this.listenForDeviceApproval()}render(){if(!this.email)throw new Error("w3m-email-verify-device-view: No email provided");if(!this.authConnector)throw new Error("w3m-email-verify-device-view: No auth connector provided");return f`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["6","3","6","3"]}
        gap="4"
      >
        <wui-icon-box size="xl" color="accent-primary" icon="sealCheck"></wui-icon-box>

        <wui-flex flexDirection="column" alignItems="center" gap="3">
          <wui-flex flexDirection="column" alignItems="center">
            <wui-text variant="md-regular" color="primary">
              Approve the login link we sent to
            </wui-text>
            <wui-text variant="md-regular" color="primary"><b>${this.email}</b></wui-text>
          </wui-flex>

          <wui-text variant="sm-regular" color="secondary" align="center">
            The code expires in 20 minutes
          </wui-text>

          <wui-flex alignItems="center" id="w3m-resend-section" gap="2">
            <wui-text variant="sm-regular" color="primary" align="center">
              Didn't receive it?
            </wui-text>
            <wui-link @click=${this.onResendCode.bind(this)} .disabled=${this.loading}>
              Resend email
            </wui-link>
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}async listenForDeviceApproval(){if(this.authConnector)try{await this.authConnector.provider.connectDevice(),u.sendEvent({type:"track",event:"DEVICE_REGISTERED_FOR_EMAIL"}),u.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_SENT"}),l.replace("EmailVerifyOtp",{email:this.email})}catch{l.goBack()}}async onResendCode(){try{if(!this.loading){if(!this.authConnector||!this.email)throw new Error("w3m-email-login-widget: Unable to resend email");this.loading=!0,await this.authConnector.provider.connectEmail({email:this.email}),this.listenForDeviceApproval(),C.showSuccess("Code email resent")}}catch(e){C.showError(e)}finally{this.loading=!1}}};I.styles=L;j([y()],I.prototype,"loading",void 0);I=j([h("w3m-email-verify-device-view")],I);c();p();m();c();p();m();var M=N`
  wui-email-input {
    width: 100%;
  }

  form {
    width: 100%;
    display: block;
    position: relative;
  }
`;var V=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},x=class extends g{constructor(){super(...arguments),this.formRef=T(),this.initialEmail=l.state.data?.email??"",this.redirectView=l.state.data?.redirectView,this.email="",this.loading=!1}firstUpdated(){this.formRef.value?.addEventListener("keydown",e=>{e.key==="Enter"&&this.onSubmitEmail(e)})}render(){return f`
      <wui-flex flexDirection="column" padding="4" gap="4">
        <form ${$(this.formRef)} @submit=${this.onSubmitEmail.bind(this)}>
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
    `}onEmailInputChange(e){this.email=e.detail}async onSubmitEmail(e){try{if(this.loading)return;this.loading=!0,e.preventDefault();let t=d.getAuthConnector();if(!t)throw new Error("w3m-update-email-wallet: Auth connector not found");let o=await t.provider.updateEmail({email:this.email});u.sendEvent({type:"track",event:"EMAIL_EDIT"}),o.action==="VERIFY_SECONDARY_OTP"?l.push("UpdateEmailSecondaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView}):l.push("UpdateEmailPrimaryOtp",{email:this.initialEmail,newEmail:this.email,redirectView:this.redirectView})}catch(t){C.showError(t),this.loading=!1}}buttonsTemplate(){let e=!this.loading&&this.email.length>3&&this.email!==this.initialEmail;return this.redirectView?f`
      <wui-flex gap="3">
        <wui-button size="md" variant="neutral" fullWidth @click=${l.goBack}>
          Cancel
        </wui-button>

        <wui-button
          size="md"
          variant="accent-primary"
          fullWidth
          @click=${this.onSubmitEmail.bind(this)}
          .disabled=${!e}
          .loading=${this.loading}
        >
          Save
        </wui-button>
      </wui-flex>
    `:f`
        <wui-button
          size="md"
          variant="accent-primary"
          fullWidth
          @click=${this.onSubmitEmail.bind(this)}
          .disabled=${!e}
          .loading=${this.loading}
        >
          Save
        </wui-button>
      `}};x.styles=M;V([y()],x.prototype,"email",void 0);V([y()],x.prototype,"loading",void 0);x=V([h("w3m-update-email-wallet-view")],x);c();p();m();var Y=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},H=class extends _{constructor(){super(),this.email=l.state.data?.email,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailPrimaryOtp({otp:e}),u.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),l.replace("UpdateEmailSecondaryOtp",l.state.data))}catch(t){throw u.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:O.parseError(t)}}),t}},this.onStartOver=()=>{l.replace("UpdateEmailWallet",l.state.data)}}};H=Y([h("w3m-update-email-primary-otp-view")],H);c();p();m();var K=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},k=class extends _{constructor(){super(),this.email=l.state.data?.newEmail,this.redirectView=l.state.data?.redirectView,this.onOtpSubmit=async e=>{try{this.authConnector&&(await this.authConnector.provider.updateEmailSecondaryOtp({otp:e}),u.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_PASS"}),this.redirectView&&l.reset(this.redirectView))}catch(t){throw u.sendEvent({type:"track",event:"EMAIL_VERIFICATION_CODE_FAIL",properties:{message:O.parseError(t)}}),t}},this.onStartOver=()=>{l.replace("UpdateEmailWallet",l.state.data)}}};k=K([h("w3m-update-email-secondary-otp-view")],k);c();p();m();var z=function(n,e,t,o){var r=arguments.length,i=r<3?e:o===null?o=Object.getOwnPropertyDescriptor(e,t):o,a;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(n,e,t,o);else for(var s=n.length-1;s>=0;s--)(a=n[s])&&(i=(r<3?a(i):r>3?a(e,t,i):a(e,t))||i);return r>3&&i&&Object.defineProperty(e,t,i),i},S=class extends g{constructor(){super(),this.authConnector=d.getAuthConnector(),this.isEmailEnabled=b.state.remoteFeatures?.email,this.isAuthEnabled=this.checkIfAuthEnabled(d.state.connectors),this.connectors=d.state.connectors,d.subscribeKey("connectors",e=>{this.connectors=e,this.isAuthEnabled=this.checkIfAuthEnabled(this.connectors)})}render(){if(!this.isEmailEnabled)throw new Error("w3m-email-login-view: Email is not enabled");if(!this.isAuthEnabled)throw new Error("w3m-email-login-view: No auth connector provided");return f`<wui-flex flexDirection="column" .padding=${["1","3","3","3"]} gap="4">
      <w3m-email-login-widget></w3m-email-login-widget>
    </wui-flex> `}checkIfAuthEnabled(e){let t=e.filter(r=>r.type===P.CONNECTOR_TYPE_AUTH).map(r=>r.chain);return D.AUTH_CONNECTOR_SUPPORTED_CHAINS.some(r=>t.includes(r))}};z([y()],S.prototype,"connectors",void 0);S=z([h("w3m-email-login-view")],S);export{S as W3mEmailLoginView,_ as W3mEmailOtpWidget,I as W3mEmailVerifyDeviceView,F as W3mEmailVerifyOtpView,H as W3mUpdateEmailPrimaryOtpView,k as W3mUpdateEmailSecondaryOtpView,x as W3mUpdateEmailWalletView};
