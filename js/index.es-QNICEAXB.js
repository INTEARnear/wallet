import{b as ra,c as rd,d as di,e as od,f as nd}from"./chunk-LQBGFF7Y.js";import"./chunk-F3BT2OCD.js";import{a as p1}from"./chunk-OIFNSKKM.js";import"./chunk-V7H3HPRQ.js";import"./chunk-EAWY7VYO.js";import"./chunk-URLXKBQX.js";import{f as h1}from"./chunk-57YRCRKT.js";var B0=h1(p1());var g1="wc",f1="ethereum_provider",w1=`${g1}@2:${f1}:`,m1="https://rpc.walletconnect.org/v1/",Cc=["eth_sendTransaction","personal_sign"],v1=["eth_accounts","eth_requestAccounts","eth_sendRawTransaction","eth_sign","eth_signTransaction","eth_signTypedData","eth_signTypedData_v3","eth_signTypedData_v4","eth_sendTransaction","personal_sign","wallet_switchEthereumChain","wallet_addEthereumChain","wallet_getPermissions","wallet_requestPermissions","wallet_registerOnboarding","wallet_watchAsset","wallet_scanQRCode","wallet_sendCalls","wallet_getCapabilities","wallet_getCallsStatus","wallet_showCallsStatus"],xc=["chainChanged","accountsChanged"],b1=["chainChanged","accountsChanged","message","disconnect","connect"],y1=Object.defineProperty,C1=Object.defineProperties,x1=Object.getOwnPropertyDescriptors,id=Object.getOwnPropertySymbols,E1=Object.prototype.hasOwnProperty,k1=Object.prototype.propertyIsEnumerable,Ec=(e,t,r)=>t in e?y1(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,zr=(e,t)=>{for(var r in t||(t={}))E1.call(t,r)&&Ec(e,r,t[r]);if(id)for(var r of id(t))k1.call(t,r)&&Ec(e,r,t[r]);return e},Wo=(e,t)=>C1(e,x1(t)),it=(e,t,r)=>Ec(e,typeof t!="symbol"?t+"":t,r);function ws(e){return Number(e[0].split(":")[1])}function ui(e){return`0x${e.toString(16)}`}function A1(e){let{chains:t,optionalChains:r,methods:o,optionalMethods:n,events:i,optionalEvents:s,rpcMap:a}=e;if(!di(t))throw new Error("Invalid chains");let c={chains:t,methods:o||Cc,events:i||xc,rpcMap:zr({},t.length?{[ws(t)]:a[ws(t)]}:{})},l=i?.filter(p=>!xc.includes(p)),d=o?.filter(p=>!Cc.includes(p));if(!r&&!s&&!n&&!(l!=null&&l.length)&&!(d!=null&&d.length))return{required:t.length?c:void 0};let u=l?.length&&d?.length||!r,h={chains:[...new Set(u?c.chains.concat(r||[]):r)],methods:[...new Set(c.methods.concat(n!=null&&n.length?n:v1))],events:[...new Set(c.events.concat(s!=null&&s.length?s:b1))],rpcMap:a};return{required:t.length?c:void 0,optional:r.length?h:void 0}}var kc=class e{constructor(){it(this,"events",new B0.EventEmitter),it(this,"namespace","eip155"),it(this,"accounts",[]),it(this,"signer"),it(this,"chainId",1),it(this,"modal"),it(this,"rpc"),it(this,"STORAGE_KEY",w1),it(this,"on",(t,r)=>(this.events.on(t,r),this)),it(this,"once",(t,r)=>(this.events.once(t,r),this)),it(this,"removeListener",(t,r)=>(this.events.removeListener(t,r),this)),it(this,"off",(t,r)=>(this.events.off(t,r),this)),it(this,"parseAccount",t=>this.isCompatibleChainId(t)?this.parseAccountId(t).address:t),this.signer={},this.rpc={}}static async init(t){let r=new e;return await r.initialize(t),r}async request(t,r){return await this.signer.request(t,this.formatChainId(this.chainId),r)}sendAsync(t,r,o){this.signer.sendAsync(t,r,this.formatChainId(this.chainId),o)}get connected(){return this.signer.client?this.signer.client.core.relayer.connected:!1}get connecting(){return this.signer.client?this.signer.client.core.relayer.connecting:!1}async enable(){return this.session||await this.connect(),await this.request({method:"eth_requestAccounts"})}async connect(t){var r;if(!this.signer.client)throw new Error("Provider not initialized. Call init() first");this.loadConnectOpts(t);let{required:o,optional:n}=A1(this.rpc);try{let i=await new Promise(async(a,c)=>{var l,d;this.rpc.showQrModal&&((l=this.modal)==null||l.open(),(d=this.modal)==null||d.subscribeState(h=>{!h.open&&!this.signer.session&&(this.signer.abortPairingAttempt(),c(new Error("Connection request reset. Please try again.")))}));let u=t!=null&&t.scopedProperties?{[this.namespace]:t.scopedProperties}:void 0;await this.signer.connect(Wo(zr({namespaces:zr({},o&&{[this.namespace]:o})},n&&{optionalNamespaces:{[this.namespace]:n}}),{pairingTopic:t?.pairingTopic,scopedProperties:u})).then(h=>{a(h)}).catch(h=>{var p;(p=this.modal)==null||p.showErrorMessage("Unable to connect"),c(new Error(h.message))})});if(!i)return;let s=ra(i.namespaces,[this.namespace]);this.setChainIds(this.rpc.chains.length?this.rpc.chains:s),this.setAccounts(s),this.events.emit("connect",{chainId:ui(this.chainId)})}catch(i){throw this.signer.logger.error(i),i}finally{(r=this.modal)==null||r.close()}}async authenticate(t,r){var o;if(!this.signer.client)throw new Error("Provider not initialized. Call init() first");this.loadConnectOpts({chains:t?.chains});try{let n=await new Promise(async(s,a)=>{var c,l;this.rpc.showQrModal&&((c=this.modal)==null||c.open(),(l=this.modal)==null||l.subscribeState(d=>{!d.open&&!this.signer.session&&(this.signer.abortPairingAttempt(),a(new Error("Connection request reset. Please try again.")))})),await this.signer.authenticate(Wo(zr({},t),{chains:this.rpc.chains}),r).then(d=>{s(d)}).catch(d=>{var u;(u=this.modal)==null||u.showErrorMessage("Unable to connect"),a(new Error(d.message))})}),i=n.session;if(i){let s=ra(i.namespaces,[this.namespace]);this.setChainIds(this.rpc.chains.length?this.rpc.chains:s),this.setAccounts(s),this.events.emit("connect",{chainId:ui(this.chainId)})}return n}catch(n){throw this.signer.logger.error(n),n}finally{(o=this.modal)==null||o.close()}}async disconnect(){this.session&&await this.signer.disconnect(),this.reset()}get isWalletConnect(){return!0}get session(){return this.signer.session}registerEventListeners(){this.signer.on("session_event",t=>{let{params:r}=t,{event:o}=r;o.name==="accountsChanged"?(this.accounts=this.parseAccounts(o.data),this.events.emit("accountsChanged",this.accounts)):o.name==="chainChanged"?this.setChainId(this.formatChainId(o.data)):this.events.emit(o.name,o.data),this.events.emit("session_event",t)}),this.signer.on("accountsChanged",t=>{this.accounts=this.parseAccounts(t),this.events.emit("accountsChanged",this.accounts)}),this.signer.on("chainChanged",t=>{let r=parseInt(t);this.chainId=r,this.events.emit("chainChanged",ui(this.chainId)),this.persist()}),this.signer.on("session_update",t=>{this.events.emit("session_update",t)}),this.signer.on("session_delete",t=>{this.reset(),this.events.emit("session_delete",t),this.events.emit("disconnect",Wo(zr({},rd("USER_DISCONNECTED")),{data:t.topic,name:"USER_DISCONNECTED"}))}),this.signer.on("display_uri",t=>{this.events.emit("display_uri",t)})}switchEthereumChain(t){this.request({method:"wallet_switchEthereumChain",params:[{chainId:t.toString(16)}]})}isCompatibleChainId(t){return typeof t=="string"?t.startsWith(`${this.namespace}:`):!1}formatChainId(t){return`${this.namespace}:${t}`}parseChainId(t){return Number(t.split(":")[1])}setChainIds(t){let r=t.filter(o=>this.isCompatibleChainId(o)).map(o=>this.parseChainId(o));r.length&&(this.chainId=r[0],this.events.emit("chainChanged",ui(this.chainId)),this.persist())}setChainId(t){if(this.isCompatibleChainId(t)){let r=this.parseChainId(t);this.chainId=r,this.switchEthereumChain(r)}}parseAccountId(t){let[r,o,n]=t.split(":");return{chainId:`${r}:${o}`,address:n}}setAccounts(t){this.accounts=t.filter(r=>this.parseChainId(this.parseAccountId(r).chainId)===this.chainId).map(r=>this.parseAccountId(r).address),this.events.emit("accountsChanged",this.accounts)}getRpcConfig(t){var r,o;let n=(r=t?.chains)!=null?r:[],i=(o=t?.optionalChains)!=null?o:[],s=n.concat(i);if(!s.length)throw new Error("No chains specified in either `chains` or `optionalChains`");let a=n.length?t?.methods||Cc:[],c=n.length?t?.events||xc:[],l=t?.optionalMethods||[],d=t?.optionalEvents||[],u=t?.rpcMap||this.buildRpcMap(s,t.projectId),h=t?.qrModalOptions||void 0;return{chains:n?.map(p=>this.formatChainId(p)),optionalChains:i.map(p=>this.formatChainId(p)),methods:a,events:c,optionalMethods:l,optionalEvents:d,rpcMap:u,showQrModal:!!(t!=null&&t.showQrModal),qrModalOptions:h,projectId:t.projectId,metadata:t.metadata}}buildRpcMap(t,r){let o={};return t.forEach(n=>{o[n]=this.getRpcUrl(n,r)}),o}async initialize(t){if(this.rpc=this.getRpcConfig(t),this.chainId=this.rpc.chains.length?ws(this.rpc.chains):ws(this.rpc.optionalChains),this.signer=await nd.init({projectId:this.rpc.projectId,metadata:this.rpc.metadata,disableProviderPing:t.disableProviderPing,relayUrl:t.relayUrl,storage:t.storage,storageOptions:t.storageOptions,customStoragePrefix:t.customStoragePrefix,telemetryEnabled:t.telemetryEnabled,logger:t.logger}),this.registerEventListeners(),await this.loadPersistedSession(),this.rpc.showQrModal){let r;try{let{createAppKit:o}=await Promise.resolve().then(function(){return uw}),{convertWCMToAppKitOptions:n}=await Promise.resolve().then(function(){return xw}),i=n(Wo(zr({},this.rpc.qrModalOptions),{chains:[...new Set([...this.rpc.chains,...this.rpc.optionalChains])],metadata:this.rpc.metadata,projectId:this.rpc.projectId}));if(!i.networks.length)throw new Error("No networks found for WalletConnect\xB7");r=o(Wo(zr({},i),{universalProvider:this.signer,manualWCControl:!0}))}catch{throw new Error("To use QR modal, please install @reown/appkit package")}if(r)try{this.modal=r}catch(o){throw this.signer.logger.error(o),new Error("Could not generate WalletConnectModal Instance")}}}loadConnectOpts(t){if(!t)return;let{chains:r,optionalChains:o,rpcMap:n}=t;r&&di(r)&&(this.rpc.chains=r.map(i=>this.formatChainId(i)),r.forEach(i=>{this.rpc.rpcMap[i]=n?.[i]||this.getRpcUrl(i)})),o&&di(o)&&(this.rpc.optionalChains=[],this.rpc.optionalChains=o?.map(i=>this.formatChainId(i)),o.forEach(i=>{this.rpc.rpcMap[i]=n?.[i]||this.getRpcUrl(i)}))}getRpcUrl(t,r){var o;return((o=this.rpc.rpcMap)==null?void 0:o[t])||`${m1}?chainId=eip155:${t}&projectId=${r||this.rpc.projectId}`}async loadPersistedSession(){if(this.session)try{let t=await this.signer.client.core.storage.getItem(`${this.STORAGE_KEY}/chainId`),r=this.session.namespaces[`${this.namespace}:${t}`]?this.session.namespaces[`${this.namespace}:${t}`]:this.session.namespaces[this.namespace];this.setChainIds(t?[this.formatChainId(t)]:r?.accounts),this.setAccounts(r?.accounts)}catch(t){this.signer.logger.error("Failed to load persisted session, clearing state..."),this.signer.logger.error(t),await this.disconnect().catch(r=>this.signer.logger.warn(r))}}reset(){this.chainId=1,this.accounts=[]}persist(){this.session&&this.signer.client.core.storage.setItem(`${this.STORAGE_KEY}/chainId`,this.chainId)}parseAccounts(t){return typeof t=="string"||t instanceof String?[this.parseAccount(t)]:t.map(r=>this.parseAccount(r))}},yv=kc,Fs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},M0={exports:{}};(function(e,t){(function(r,o){e.exports=o()})(Fs,function(){var r=1e3,o=6e4,n=36e5,i="millisecond",s="second",a="minute",c="hour",l="day",d="week",u="month",h="quarter",p="year",w="date",b="Invalid Date",v=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,m=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,x={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(N){var k=["th","st","nd","rd"],A=N%100;return"["+N+(k[(A-20)%10]||k[A]||k[0])+"]"}},C=function(N,k,A){var $=String(N);return!$||$.length>=k?N:""+Array(k+1-$.length).join(A)+N},E={s:C,z:function(N){var k=-N.utcOffset(),A=Math.abs(k),$=Math.floor(A/60),_=A%60;return(k<=0?"+":"-")+C($,2,"0")+":"+C(_,2,"0")},m:function N(k,A){if(k.date()<A.date())return-N(A,k);var $=12*(A.year()-k.year())+(A.month()-k.month()),_=k.clone().add($,u),K=A-_<0,X=k.clone().add($+(K?-1:1),u);return+(-($+(A-_)/(K?_-X:X-_))||0)},a:function(N){return N<0?Math.ceil(N)||0:Math.floor(N)},p:function(N){return{M:u,y:p,w:d,d:l,D:w,h:c,m:a,s,ms:i,Q:h}[N]||String(N||"").toLowerCase().replace(/s$/,"")},u:function(N){return N===void 0}},I="en",S={};S[I]=x;var j="$isDayjsObject",R=function(N){return N instanceof ne||!(!N||!N[j])},P=function N(k,A,$){var _;if(!k)return I;if(typeof k=="string"){var K=k.toLowerCase();S[K]&&(_=K),A&&(S[K]=A,_=K);var X=k.split("-");if(!_&&X.length>1)return N(X[0])}else{var se=k.name;S[se]=k,_=se}return!$&&_&&(I=_),_||!$&&I},L=function(N,k){if(R(N))return N.clone();var A=typeof k=="object"?k:{};return A.date=N,A.args=arguments,new ne(A)},B=E;B.l=P,B.i=R,B.w=function(N,k){return L(N,{locale:k.$L,utc:k.$u,x:k.$x,$offset:k.$offset})};var ne=function(){function N(A){this.$L=P(A.locale,null,!0),this.parse(A),this.$x=this.$x||A.x||{},this[j]=!0}var k=N.prototype;return k.parse=function(A){this.$d=function($){var _=$.date,K=$.utc;if(_===null)return new Date(NaN);if(B.u(_))return new Date;if(_ instanceof Date)return new Date(_);if(typeof _=="string"&&!/Z$/i.test(_)){var X=_.match(v);if(X){var se=X[2]-1||0,he=(X[7]||"0").substring(0,3);return K?new Date(Date.UTC(X[1],se,X[3]||1,X[4]||0,X[5]||0,X[6]||0,he)):new Date(X[1],se,X[3]||1,X[4]||0,X[5]||0,X[6]||0,he)}}return new Date(_)}(A),this.init()},k.init=function(){var A=this.$d;this.$y=A.getFullYear(),this.$M=A.getMonth(),this.$D=A.getDate(),this.$W=A.getDay(),this.$H=A.getHours(),this.$m=A.getMinutes(),this.$s=A.getSeconds(),this.$ms=A.getMilliseconds()},k.$utils=function(){return B},k.isValid=function(){return this.$d.toString()!==b},k.isSame=function(A,$){var _=L(A);return this.startOf($)<=_&&_<=this.endOf($)},k.isAfter=function(A,$){return L(A)<this.startOf($)},k.isBefore=function(A,$){return this.endOf($)<L(A)},k.$g=function(A,$,_){return B.u(A)?this[$]:this.set(_,A)},k.unix=function(){return Math.floor(this.valueOf()/1e3)},k.valueOf=function(){return this.$d.getTime()},k.startOf=function(A,$){var _=this,K=!!B.u($)||$,X=B.p(A),se=function(Ge,Le){var Ke=B.w(_.$u?Date.UTC(_.$y,Le,Ge):new Date(_.$y,Le,Ge),_);return K?Ke:Ke.endOf(l)},he=function(Ge,Le){return B.w(_.toDate()[Ge].apply(_.toDate("s"),(K?[0,0,0,0]:[23,59,59,999]).slice(Le)),_)},we=this.$W,me=this.$M,Se=this.$D,He="set"+(this.$u?"UTC":"");switch(X){case p:return K?se(1,0):se(31,11);case u:return K?se(1,me):se(0,me+1);case d:var Ct=this.$locale().weekStart||0,ot=(we<Ct?we+7:we)-Ct;return se(K?Se-ot:Se+(6-ot),me);case l:case w:return he(He+"Hours",0);case c:return he(He+"Minutes",1);case a:return he(He+"Seconds",2);case s:return he(He+"Milliseconds",3);default:return this.clone()}},k.endOf=function(A){return this.startOf(A,!1)},k.$set=function(A,$){var _,K=B.p(A),X="set"+(this.$u?"UTC":""),se=(_={},_[l]=X+"Date",_[w]=X+"Date",_[u]=X+"Month",_[p]=X+"FullYear",_[c]=X+"Hours",_[a]=X+"Minutes",_[s]=X+"Seconds",_[i]=X+"Milliseconds",_)[K],he=K===l?this.$D+($-this.$W):$;if(K===u||K===p){var we=this.clone().set(w,1);we.$d[se](he),we.init(),this.$d=we.set(w,Math.min(this.$D,we.daysInMonth())).$d}else se&&this.$d[se](he);return this.init(),this},k.set=function(A,$){return this.clone().$set(A,$)},k.get=function(A){return this[B.p(A)]()},k.add=function(A,$){var _,K=this;A=Number(A);var X=B.p($),se=function(me){var Se=L(K);return B.w(Se.date(Se.date()+Math.round(me*A)),K)};if(X===u)return this.set(u,this.$M+A);if(X===p)return this.set(p,this.$y+A);if(X===l)return se(1);if(X===d)return se(7);var he=(_={},_[a]=o,_[c]=n,_[s]=r,_)[X]||1,we=this.$d.getTime()+A*he;return B.w(we,this)},k.subtract=function(A,$){return this.add(-1*A,$)},k.format=function(A){var $=this,_=this.$locale();if(!this.isValid())return _.invalidDate||b;var K=A||"YYYY-MM-DDTHH:mm:ssZ",X=B.z(this),se=this.$H,he=this.$m,we=this.$M,me=_.weekdays,Se=_.months,He=_.meridiem,Ct=function(Le,Ke,nt,ut){return Le&&(Le[Ke]||Le($,K))||nt[Ke].slice(0,ut)},ot=function(Le){return B.s(se%12||12,Le,"0")},Ge=He||function(Le,Ke,nt){var ut=Le<12?"AM":"PM";return nt?ut.toLowerCase():ut};return K.replace(m,function(Le,Ke){return Ke||function(nt){switch(nt){case"YY":return String($.$y).slice(-2);case"YYYY":return B.s($.$y,4,"0");case"M":return we+1;case"MM":return B.s(we+1,2,"0");case"MMM":return Ct(_.monthsShort,we,Se,3);case"MMMM":return Ct(Se,we);case"D":return $.$D;case"DD":return B.s($.$D,2,"0");case"d":return String($.$W);case"dd":return Ct(_.weekdaysMin,$.$W,me,2);case"ddd":return Ct(_.weekdaysShort,$.$W,me,3);case"dddd":return me[$.$W];case"H":return String(se);case"HH":return B.s(se,2,"0");case"h":return ot(1);case"hh":return ot(2);case"a":return Ge(se,he,!0);case"A":return Ge(se,he,!1);case"m":return String(he);case"mm":return B.s(he,2,"0");case"s":return String($.$s);case"ss":return B.s($.$s,2,"0");case"SSS":return B.s($.$ms,3,"0");case"Z":return X}return null}(Le)||X.replace(":","")})},k.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},k.diff=function(A,$,_){var K,X=this,se=B.p($),he=L(A),we=(he.utcOffset()-this.utcOffset())*o,me=this-he,Se=function(){return B.m(X,he)};switch(se){case p:K=Se()/12;break;case u:K=Se();break;case h:K=Se()/3;break;case d:K=(me-we)/6048e5;break;case l:K=(me-we)/864e5;break;case c:K=me/n;break;case a:K=me/o;break;case s:K=me/r;break;default:K=me}return _?K:B.a(K)},k.daysInMonth=function(){return this.endOf(u).$D},k.$locale=function(){return S[this.$L]},k.locale=function(A,$){if(!A)return this.$L;var _=this.clone(),K=P(A,$,!0);return K&&(_.$L=K),_},k.clone=function(){return B.w(this.$d,this)},k.toDate=function(){return new Date(this.valueOf())},k.toJSON=function(){return this.isValid()?this.toISOString():null},k.toISOString=function(){return this.$d.toISOString()},k.toString=function(){return this.$d.toUTCString()},N}(),ge=ne.prototype;return L.prototype=ge,[["$ms",i],["$s",s],["$m",a],["$H",c],["$W",l],["$M",u],["$y",p],["$D",w]].forEach(function(N){ge[N[1]]=function(k){return this.$g(k,N[0],N[1])}}),L.extend=function(N,k){return N.$i||(N(k,ne,L),N.$i=!0),L},L.locale=P,L.isDayjs=R,L.unix=function(N){return L(1e3*N)},L.en=S[I],L.Ls=S,L.p={},L})})(M0);var Ac=M0.exports,U0={exports:{}};(function(e,t){(function(r,o){e.exports=o()})(Fs,function(){return{name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(r){var o=["th","st","nd","rd"],n=r%100;return"["+r+(o[(n-20)%10]||o[n]||o[0])+"]"}}})})(U0);var N1=U0.exports,z0={exports:{}};(function(e,t){(function(r,o){e.exports=o()})(Fs,function(){return function(r,o,n){r=r||{};var i=o.prototype,s={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function a(l,d,u,h){return i.fromToBase(l,d,u,h)}n.en.relativeTime=s,i.fromToBase=function(l,d,u,h,p){for(var w,b,v,m=u.$locale().relativeTime||s,x=r.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],C=x.length,E=0;E<C;E+=1){var I=x[E];I.d&&(w=h?n(l).diff(u,I.d,!0):u.diff(l,I.d,!0));var S=(r.rounding||Math.round)(Math.abs(w));if(v=w>0,S<=I.r||!I.r){S<=1&&E>0&&(I=x[E-1]);var j=m[I.l];p&&(S=p(""+S)),b=typeof j=="string"?j.replace("%d",S):j(S,d,I.l,v);break}}if(d)return b;var R=v?m.future:m.past;return typeof R=="function"?R(b):R.replace("%s",b)},i.to=function(l,d){return a(l,d,this,!0)},i.from=function(l,d){return a(l,d,this)};var c=function(l){return l.$u?n.utc():n()};i.toNow=function(l){return this.to(c(this),l)},i.fromNow=function(l){return this.from(c(this),l)}}})})(z0);var I1=z0.exports,D0={exports:{}};(function(e,t){(function(r,o){e.exports=o()})(Fs,function(){return function(r,o,n){n.updateLocale=function(i,s){var a=n.Ls[i];if(a)return(s?Object.keys(s):[]).forEach(function(c){a[c]=s[c]}),a}}})})(D0);var S1=D0.exports;Ac.extend(I1),Ac.extend(S1);var _1={...N1,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}};Ac.locale("en-web3-modal",_1);var j0={caipNetworkIdToNumber(e){return e?Number(e.split(":")[1]):void 0},parseEvmChainId(e){return typeof e=="string"?this.caipNetworkIdToNumber(e):e},getNetworksByNamespace(e,t){return e?.filter(r=>r.chainNamespace===t)||[]},getFirstNetworkByNamespace(e,t){return this.getNetworksByNamespace(e,t)[0]}},O1=20,T1=1,xr=1e6,sd=1e6,P1=-7,R1=21,$1=!1,xn="[big.js] ",Vr=xn+"Invalid ",hi=Vr+"decimal places",L1=Vr+"rounding mode",ad=xn+"Division by zero",ye={},Lt=void 0,B1=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function W0(){function e(t){var r=this;if(!(r instanceof e))return t===Lt?W0():new e(t);if(t instanceof e)r.s=t.s,r.e=t.e,r.c=t.c.slice();else{if(typeof t!="string"){if(e.strict===!0&&typeof t!="bigint")throw TypeError(Vr+"value");t=t===0&&1/t<0?"-0":String(t)}M1(r,t)}r.constructor=e}return e.prototype=ye,e.DP=O1,e.RM=T1,e.NE=P1,e.PE=R1,e.strict=$1,e.roundDown=0,e.roundHalfUp=1,e.roundHalfEven=2,e.roundUp=3,e}function M1(e,t){var r,o,n;if(!B1.test(t))throw Error(Vr+"number");for(e.s=t.charAt(0)=="-"?(t=t.slice(1),-1):1,(r=t.indexOf("."))>-1&&(t=t.replace(".","")),(o=t.search(/e/i))>0?(r<0&&(r=o),r+=+t.slice(o+1),t=t.substring(0,o)):r<0&&(r=t.length),n=t.length,o=0;o<n&&t.charAt(o)=="0";)++o;if(o==n)e.c=[e.e=0];else{for(;n>0&&t.charAt(--n)=="0";);for(e.e=r-o-1,e.c=[],r=0;o<=n;)e.c[r++]=+t.charAt(o++)}return e}function Er(e,t,r,o){var n=e.c;if(r===Lt&&(r=e.constructor.RM),r!==0&&r!==1&&r!==2&&r!==3)throw Error(L1);if(t<1)o=r===3&&(o||!!n[0])||t===0&&(r===1&&n[0]>=5||r===2&&(n[0]>5||n[0]===5&&(o||n[1]!==Lt))),n.length=1,o?(e.e=e.e-t+1,n[0]=1):n[0]=e.e=0;else if(t<n.length){if(o=r===1&&n[t]>=5||r===2&&(n[t]>5||n[t]===5&&(o||n[t+1]!==Lt||n[t-1]&1))||r===3&&(o||!!n[0]),n.length=t,o){for(;++n[--t]>9;)if(n[t]=0,t===0){++e.e,n.unshift(1);break}}for(t=n.length;!n[--t];)n.pop()}return e}function kr(e,t,r){var o=e.e,n=e.c.join(""),i=n.length;if(t)n=n.charAt(0)+(i>1?"."+n.slice(1):"")+(o<0?"e":"e+")+o;else if(o<0){for(;++o;)n="0"+n;n="0."+n}else if(o>0)if(++o>i)for(o-=i;o--;)n+="0";else o<i&&(n=n.slice(0,o)+"."+n.slice(o));else i>1&&(n=n.charAt(0)+"."+n.slice(1));return e.s<0&&r?"-"+n:n}ye.abs=function(){var e=new this.constructor(this);return e.s=1,e},ye.cmp=function(e){var t,r=this,o=r.c,n=(e=new r.constructor(e)).c,i=r.s,s=e.s,a=r.e,c=e.e;if(!o[0]||!n[0])return o[0]?i:n[0]?-s:0;if(i!=s)return i;if(t=i<0,a!=c)return a>c^t?1:-1;for(s=(a=o.length)<(c=n.length)?a:c,i=-1;++i<s;)if(o[i]!=n[i])return o[i]>n[i]^t?1:-1;return a==c?0:a>c^t?1:-1},ye.div=function(e){var t=this,r=t.constructor,o=t.c,n=(e=new r(e)).c,i=t.s==e.s?1:-1,s=r.DP;if(s!==~~s||s<0||s>xr)throw Error(hi);if(!n[0])throw Error(ad);if(!o[0])return e.s=i,e.c=[e.e=0],e;var a,c,l,d,u,h=n.slice(),p=a=n.length,w=o.length,b=o.slice(0,a),v=b.length,m=e,x=m.c=[],C=0,E=s+(m.e=t.e-e.e)+1;for(m.s=i,i=E<0?0:E,h.unshift(0);v++<a;)b.push(0);do{for(l=0;l<10;l++){if(a!=(v=b.length))d=a>v?1:-1;else for(u=-1,d=0;++u<a;)if(n[u]!=b[u]){d=n[u]>b[u]?1:-1;break}if(d<0){for(c=v==a?n:h;v;){if(b[--v]<c[v]){for(u=v;u&&!b[--u];)b[u]=9;--b[u],b[v]+=10}b[v]-=c[v]}for(;!b[0];)b.shift()}else break}x[C++]=d?l:++l,b[0]&&d?b[v]=o[p]||0:b=[o[p]]}while((p++<w||b[0]!==Lt)&&i--);return!x[0]&&C!=1&&(x.shift(),m.e--,E--),C>E&&Er(m,E,r.RM,b[0]!==Lt),m},ye.eq=function(e){return this.cmp(e)===0},ye.gt=function(e){return this.cmp(e)>0},ye.gte=function(e){return this.cmp(e)>-1},ye.lt=function(e){return this.cmp(e)<0},ye.lte=function(e){return this.cmp(e)<1},ye.minus=ye.sub=function(e){var t,r,o,n,i=this,s=i.constructor,a=i.s,c=(e=new s(e)).s;if(a!=c)return e.s=-c,i.plus(e);var l=i.c.slice(),d=i.e,u=e.c,h=e.e;if(!l[0]||!u[0])return u[0]?e.s=-c:l[0]?e=new s(i):e.s=1,e;if(a=d-h){for((n=a<0)?(a=-a,o=l):(h=d,o=u),o.reverse(),c=a;c--;)o.push(0);o.reverse()}else for(r=((n=l.length<u.length)?l:u).length,a=c=0;c<r;c++)if(l[c]!=u[c]){n=l[c]<u[c];break}if(n&&(o=l,l=u,u=o,e.s=-e.s),(c=(r=u.length)-(t=l.length))>0)for(;c--;)l[t++]=0;for(c=t;r>a;){if(l[--r]<u[r]){for(t=r;t&&!l[--t];)l[t]=9;--l[t],l[r]+=10}l[r]-=u[r]}for(;l[--c]===0;)l.pop();for(;l[0]===0;)l.shift(),--h;return l[0]||(e.s=1,l=[h=0]),e.c=l,e.e=h,e},ye.mod=function(e){var t,r=this,o=r.constructor,n=r.s,i=(e=new o(e)).s;if(!e.c[0])throw Error(ad);return r.s=e.s=1,t=e.cmp(r)==1,r.s=n,e.s=i,t?new o(r):(n=o.DP,i=o.RM,o.DP=o.RM=0,r=r.div(e),o.DP=n,o.RM=i,this.minus(r.times(e)))},ye.neg=function(){var e=new this.constructor(this);return e.s=-e.s,e},ye.plus=ye.add=function(e){var t,r,o,n=this,i=n.constructor;if(e=new i(e),n.s!=e.s)return e.s=-e.s,n.minus(e);var s=n.e,a=n.c,c=e.e,l=e.c;if(!a[0]||!l[0])return l[0]||(a[0]?e=new i(n):e.s=n.s),e;if(a=a.slice(),t=s-c){for(t>0?(c=s,o=l):(t=-t,o=a),o.reverse();t--;)o.push(0);o.reverse()}for(a.length-l.length<0&&(o=l,l=a,a=o),t=l.length,r=0;t;a[t]%=10)r=(a[--t]=a[t]+l[t]+r)/10|0;for(r&&(a.unshift(r),++c),t=a.length;a[--t]===0;)a.pop();return e.c=a,e.e=c,e},ye.pow=function(e){var t=this,r=new t.constructor("1"),o=r,n=e<0;if(e!==~~e||e<-sd||e>sd)throw Error(Vr+"exponent");for(n&&(e=-e);e&1&&(o=o.times(t)),e>>=1,!!e;)t=t.times(t);return n?r.div(o):o},ye.prec=function(e,t){if(e!==~~e||e<1||e>xr)throw Error(Vr+"precision");return Er(new this.constructor(this),e,t)},ye.round=function(e,t){if(e===Lt)e=0;else if(e!==~~e||e<-xr||e>xr)throw Error(hi);return Er(new this.constructor(this),e+this.e+1,t)},ye.sqrt=function(){var e,t,r,o=this,n=o.constructor,i=o.s,s=o.e,a=new n("0.5");if(!o.c[0])return new n(o);if(i<0)throw Error(xn+"No square root");i=Math.sqrt(+kr(o,!0,!0)),i===0||i===1/0?(t=o.c.join(""),t.length+s&1||(t+="0"),i=Math.sqrt(t),s=((s+1)/2|0)-(s<0||s&1),e=new n((i==1/0?"5e":(i=i.toExponential()).slice(0,i.indexOf("e")+1))+s)):e=new n(i+""),s=e.e+(n.DP+=4);do r=e,e=a.times(r.plus(o.div(r)));while(r.c.slice(0,s).join("")!==e.c.slice(0,s).join(""));return Er(e,(n.DP-=4)+e.e+1,n.RM)},ye.times=ye.mul=function(e){var t,r=this,o=r.constructor,n=r.c,i=(e=new o(e)).c,s=n.length,a=i.length,c=r.e,l=e.e;if(e.s=r.s==e.s?1:-1,!n[0]||!i[0])return e.c=[e.e=0],e;for(e.e=c+l,s<a&&(t=n,n=i,i=t,l=s,s=a,a=l),t=new Array(l=s+a);l--;)t[l]=0;for(c=a;c--;){for(a=0,l=s+c;l>c;)a=t[l]+i[c]*n[l-c-1]+a,t[l--]=a%10,a=a/10|0;t[l]=a}for(a?++e.e:t.shift(),c=t.length;!t[--c];)t.pop();return e.c=t,e},ye.toExponential=function(e,t){var r=this,o=r.c[0];if(e!==Lt){if(e!==~~e||e<0||e>xr)throw Error(hi);for(r=Er(new r.constructor(r),++e,t);r.c.length<e;)r.c.push(0)}return kr(r,!0,!!o)},ye.toFixed=function(e,t){var r=this,o=r.c[0];if(e!==Lt){if(e!==~~e||e<0||e>xr)throw Error(hi);for(r=Er(new r.constructor(r),e+r.e+1,t),e=e+r.e+1;r.c.length<e;)r.c.push(0)}return kr(r,!1,!!o)},ye[Symbol.for("nodejs.util.inspect.custom")]=ye.toJSON=ye.toString=function(){var e=this,t=e.constructor;return kr(e,e.e<=t.NE||e.e>=t.PE,!!e.c[0])},ye.toNumber=function(){var e=+kr(this,!0,!0);if(this.constructor.strict===!0&&!this.eq(e.toString()))throw Error(xn+"Imprecise conversion");return e},ye.toPrecision=function(e,t){var r=this,o=r.constructor,n=r.c[0];if(e!==Lt){if(e!==~~e||e<1||e>xr)throw Error(Vr+"precision");for(r=Er(new o(r),e,t);r.c.length<e;)r.c.push(0)}return kr(r,e<=r.e||r.e<=o.NE||r.e>=o.PE,!!n)},ye.valueOf=function(){var e=this,t=e.constructor;if(t.strict===!0)throw Error(xn+"valueOf disallowed");return kr(e,e.e<=t.NE||e.e>=t.PE,!0)};var Ho=W0(),pi={bigNumber(e){return e?new Ho(e):new Ho(0)},multiply(e,t){if(e===void 0||t===void 0)return new Ho(0);let r=new Ho(e),o=new Ho(t);return r.times(o)},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})},parseLocalStringToNumber(e){return e===void 0?0:parseFloat(e.replace(/,/gu,""))}},U1=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]}],z1=[{type:"function",name:"approve",stateMutability:"nonpayable",inputs:[{name:"spender",type:"address"},{name:"amount",type:"uint256"}],outputs:[{type:"bool"}]}],D1=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"sender",type:"address"},{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]}],G={WC_NAME_SUFFIX:".reown.id",WC_NAME_SUFFIX_LEGACY:".wcn.id",BLOCKCHAIN_API_RPC_URL:"https://rpc.walletconnect.org",PULSE_API_URL:"https://pulse.walletconnect.org",W3M_API_URL:"https://api.web3modal.org",CONNECTOR_ID:{WALLET_CONNECT:"walletConnect",INJECTED:"injected",WALLET_STANDARD:"announced",COINBASE:"coinbaseWallet",COINBASE_SDK:"coinbaseWalletSDK",SAFE:"safe",LEDGER:"ledger",OKX:"okx",EIP6963:"eip6963",AUTH:"ID_AUTH"},CONNECTOR_NAMES:{AUTH:"Auth"},AUTH_CONNECTOR_SUPPORTED_CHAINS:["eip155","solana"],LIMITS:{PENDING_TRANSACTIONS:99},CHAIN:{EVM:"eip155",SOLANA:"solana",POLKADOT:"polkadot",BITCOIN:"bip122"},CHAIN_NAME_MAP:{eip155:"EVM Networks",solana:"Solana",polkadot:"Polkadot",bip122:"Bitcoin"},ADAPTER_TYPES:{BITCOIN:"bitcoin",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5"},USDT_CONTRACT_ADDRESSES:["0xdac17f958d2ee523a2206206994597c13d831ec7","0xc2132d05d31c914a87c6611c10748aeb04b58e8f","0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7","0x919C1c267BC06a7039e03fcc2eF738525769109c","0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e","0x55d398326f99059fF775485246999027B3197955","0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"],HTTP_STATUS_CODES:{SERVICE_UNAVAILABLE:503,FORBIDDEN:403},UNSUPPORTED_NETWORK_NAME:"Unknown Network"},j1={getERC20Abi:e=>G.USDT_CONTRACT_ADDRESSES.includes(e)?D1:U1,getSwapAbi:()=>z1},nr={validateCaipAddress(e){if(e.split(":")?.length!==3)throw new Error("Invalid CAIP Address");return e},parseCaipAddress(e){let t=e.split(":");if(t.length!==3)throw new Error(`Invalid CAIP-10 address: ${e}`);let[r,o,n]=t;if(!r||!o||!n)throw new Error(`Invalid CAIP-10 address: ${e}`);return{chainNamespace:r,chainId:o,address:n}},parseCaipNetworkId(e){let t=e.split(":");if(t.length!==2)throw new Error(`Invalid CAIP-2 network id: ${e}`);let[r,o]=t;if(!r||!o)throw new Error(`Invalid CAIP-2 network id: ${e}`);return{chainNamespace:r,chainId:o}}},ae={WALLET_ID:"@appkit/wallet_id",WALLET_NAME:"@appkit/wallet_name",SOLANA_WALLET:"@appkit/solana_wallet",SOLANA_CAIP_CHAIN:"@appkit/solana_caip_chain",ACTIVE_CAIP_NETWORK_ID:"@appkit/active_caip_network_id",CONNECTED_SOCIAL:"@appkit/connected_social",CONNECTED_SOCIAL_USERNAME:"@appkit-wallet/SOCIAL_USERNAME",RECENT_WALLETS:"@appkit/recent_wallets",DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",ACTIVE_NAMESPACE:"@appkit/active_namespace",CONNECTED_NAMESPACES:"@appkit/connected_namespaces",CONNECTION_STATUS:"@appkit/connection_status",SIWX_AUTH_TOKEN:"@appkit/siwx-auth-token",SIWX_NONCE_TOKEN:"@appkit/siwx-nonce-token",TELEGRAM_SOCIAL_PROVIDER:"@appkit/social_provider",NATIVE_BALANCE_CACHE:"@appkit/native_balance_cache",PORTFOLIO_CACHE:"@appkit/portfolio_cache",ENS_CACHE:"@appkit/ens_cache",IDENTITY_CACHE:"@appkit/identity_cache",PREFERRED_ACCOUNT_TYPES:"@appkit/preferred_account_types"};function oa(e){if(!e)throw new Error("Namespace is required for CONNECTED_CONNECTOR_ID");return`@appkit/${e}:connected_connector_id`}var ie={setItem(e,t){wn()&&t!==void 0&&localStorage.setItem(e,t)},getItem(e){if(wn())return localStorage.getItem(e)||void 0},removeItem(e){wn()&&localStorage.removeItem(e)},clear(){wn()&&localStorage.clear()}};function wn(){return typeof window<"u"&&typeof localStorage<"u"}function gr(e,t){return t==="light"?{"--w3m-accent":e?.["--w3m-accent"]||"hsla(231, 100%, 70%, 1)","--w3m-background":"#fff"}:{"--w3m-accent":e?.["--w3m-accent"]||"hsla(230, 100%, 67%, 1)","--w3m-background":"#121313"}}var W1=Symbol(),cd=Object.getPrototypeOf,Nc=new WeakMap,H1=e=>e&&(Nc.has(e)?Nc.get(e):cd(e)===Object.prototype||cd(e)===Array.prototype),F1=e=>H1(e)&&e[W1]||null,ld=(e,t=!0)=>{Nc.set(e,t)},na=e=>typeof e=="object"&&e!==null,dr=new WeakMap,mn=new WeakSet,V1=(e=Object.is,t=(l,d)=>new Proxy(l,d),r=l=>na(l)&&!mn.has(l)&&(Array.isArray(l)||!(Symbol.iterator in l))&&!(l instanceof WeakMap)&&!(l instanceof WeakSet)&&!(l instanceof Error)&&!(l instanceof Number)&&!(l instanceof Date)&&!(l instanceof String)&&!(l instanceof RegExp)&&!(l instanceof ArrayBuffer),o=l=>{switch(l.status){case"fulfilled":return l.value;case"rejected":throw l.reason;default:throw l}},n=new WeakMap,i=(l,d,u=o)=>{let h=n.get(l);if(h?.[0]===d)return h[1];let p=Array.isArray(l)?[]:Object.create(Object.getPrototypeOf(l));return ld(p,!0),n.set(l,[d,p]),Reflect.ownKeys(l).forEach(w=>{if(Object.getOwnPropertyDescriptor(p,w))return;let b=Reflect.get(l,w),{enumerable:v}=Reflect.getOwnPropertyDescriptor(l,w),m={value:b,enumerable:v,configurable:!0};if(mn.has(b))ld(b,!1);else if(b instanceof Promise)delete m.value,m.get=()=>u(b);else if(dr.has(b)){let[x,C]=dr.get(b);m.value=i(x,C(),u)}Object.defineProperty(p,w,m)}),Object.preventExtensions(p)},s=new WeakMap,a=[1,1],c=l=>{if(!na(l))throw new Error("object required");let d=s.get(l);if(d)return d;let u=a[0],h=new Set,p=(R,P=++a[0])=>{u!==P&&(u=P,h.forEach(L=>L(R,P)))},w=a[1],b=(R=++a[1])=>(w!==R&&!h.size&&(w=R,m.forEach(([P])=>{let L=P[1](R);L>u&&(u=L)})),u),v=R=>(P,L)=>{let B=[...P];B[1]=[R,...B[1]],p(B,L)},m=new Map,x=(R,P)=>{if((import.meta.env?import.meta.env.MODE:void 0)!=="production"&&m.has(R))throw new Error("prop listener already exists");if(h.size){let L=P[3](v(R));m.set(R,[P,L])}else m.set(R,[P])},C=R=>{var P;let L=m.get(R);L&&(m.delete(R),(P=L[1])==null||P.call(L))},E=R=>(h.add(R),h.size===1&&m.forEach(([P,L],B)=>{if((import.meta.env?import.meta.env.MODE:void 0)!=="production"&&L)throw new Error("remove already exists");let ne=P[3](v(B));m.set(B,[P,ne])}),()=>{h.delete(R),h.size===0&&m.forEach(([P,L],B)=>{L&&(L(),m.set(B,[P]))})}),I=Array.isArray(l)?[]:Object.create(Object.getPrototypeOf(l)),S=t(I,{deleteProperty(R,P){let L=Reflect.get(R,P);C(P);let B=Reflect.deleteProperty(R,P);return B&&p(["delete",[P],L]),B},set(R,P,L,B){let ne=Reflect.has(R,P),ge=Reflect.get(R,P,B);if(ne&&(e(ge,L)||s.has(L)&&e(ge,s.get(L))))return!0;C(P),na(L)&&(L=F1(L)||L);let N=L;if(L instanceof Promise)L.then(k=>{L.status="fulfilled",L.value=k,p(["resolve",[P],k])}).catch(k=>{L.status="rejected",L.reason=k,p(["reject",[P],k])});else{!dr.has(L)&&r(L)&&(N=c(L));let k=!mn.has(N)&&dr.get(N);k&&x(P,k)}return Reflect.set(R,P,N,B),p(["set",[P],L,ge]),!0}});s.set(l,S);let j=[I,b,i,E];return dr.set(S,j),Reflect.ownKeys(l).forEach(R=>{let P=Object.getOwnPropertyDescriptor(l,R);"value"in P&&(S[R]=l[R],delete P.value,delete P.writable),Object.defineProperty(I,R,P)}),S})=>[c,dr,mn,e,t,r,o,n,i,s,a],[Z1]=V1();function xe(e={}){return Z1(e)}function je(e,t,r){let o=dr.get(e);(import.meta.env?import.meta.env.MODE:void 0)!=="production"&&!o&&console.warn("Please use proxy object");let n,i=[],s=o[3],a=!1,c=s(l=>{if(i.push(l),r){t(i.splice(0));return}n||(n=Promise.resolve().then(()=>{n=void 0,a&&t(i.splice(0))}))});return a=!0,()=>{a=!1,c()}}function Nn(e,t){let r=dr.get(e);(import.meta.env?import.meta.env.MODE:void 0)!=="production"&&!r&&console.warn("Please use proxy object");let[o,n,i]=r;return i(o,n(),t)}function Jr(e){return mn.add(e),e}function qe(e,t,r,o){let n=e[t];return je(e,()=>{let i=e[t];Object.is(n,i)||r(n=i)},o)}function q1(e){let t=xe({data:Array.from(e||[]),has(r){return this.data.some(o=>o[0]===r)},set(r,o){let n=this.data.find(i=>i[0]===r);return n?n[1]=o:this.data.push([r,o]),this},get(r){var o;return(o=this.data.find(n=>n[0]===r))==null?void 0:o[1]},delete(r){let o=this.data.findIndex(n=>n[0]===r);return o===-1?!1:(this.data.splice(o,1),!0)},clear(){this.data.splice(0)},get size(){return this.data.length},toJSON(){return new Map(this.data)},forEach(r){this.data.forEach(o=>{r(o[1],o[0],this)})},keys(){return this.data.map(r=>r[0]).values()},values(){return this.data.map(r=>r[1]).values()},entries(){return new Map(this.data).entries()},get[Symbol.toStringTag](){return"Map"},[Symbol.iterator](){return this.entries()}});return Object.defineProperties(t,{data:{enumerable:!1},size:{enumerable:!1},toJSON:{enumerable:!1}}),Object.seal(t),t}var ia=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org",G1=[{label:"Coinbase",name:"coinbase",feeRange:"1-2%",url:"",supportedChains:["eip155"]},{label:"Meld.io",name:"meld",feeRange:"1-2%",url:"https://meldcrypto.com",supportedChains:["eip155","solana"]}],Re={FOUR_MINUTES_MS:24e4,TEN_SEC_MS:1e4,FIVE_SEC_MS:5e3,THREE_SEC_MS:3e3,ONE_SEC_MS:1e3,SECURE_SITE:ia,SECURE_SITE_DASHBOARD:`${ia}/dashboard`,SECURE_SITE_FAVICON:`${ia}/images/favicon.png`,RESTRICTED_TIMEZONES:["ASIA/SHANGHAI","ASIA/URUMQI","ASIA/CHONGQING","ASIA/HARBIN","ASIA/KASHGAR","ASIA/MACAU","ASIA/HONG_KONG","ASIA/MACAO","ASIA/BEIJING","ASIA/HARBIN"],WC_COINBASE_PAY_SDK_CHAINS:["ethereum","arbitrum","polygon","berachain","avalanche-c-chain","optimism","celo","base"],WC_COINBASE_PAY_SDK_FALLBACK_CHAIN:"ethereum",WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP:{Ethereum:"ethereum","Arbitrum One":"arbitrum",Polygon:"polygon",Berachain:"berachain",Avalanche:"avalanche-c-chain","OP Mainnet":"optimism",Celo:"celo",Base:"base"},WC_COINBASE_ONRAMP_APP_ID:"bf18c88d-495a-463b-b249-0b9d3656cf5e",SWAP_SUGGESTED_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP"],SWAP_POPULAR_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP","METAL","DAI","CHAMP","WOLF","SALE","BAL","BUSD","MUST","BTCpx","ROUTE","HEX","WELT","amDAI","VSQ","VISION","AURUM","pSP","SNX","VC","LINK","CHP","amUSDT","SPHERE","FOX","GIDDY","GFC","OMEN","OX_OLD","DE","WNT"],BALANCE_SUPPORTED_CHAINS:["eip155","solana"],SWAP_SUPPORTED_NETWORKS:["eip155:1","eip155:42161","eip155:10","eip155:324","eip155:8453","eip155:56","eip155:137","eip155:100","eip155:43114","eip155:250","eip155:8217","eip155:1313161554"],NAMES_SUPPORTED_CHAIN_NAMESPACES:["eip155"],ONRAMP_SUPPORTED_CHAIN_NAMESPACES:["eip155","solana"],ACTIVITY_ENABLED_CHAIN_NAMESPACES:["eip155"],NATIVE_TOKEN_ADDRESS:{eip155:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",solana:"So11111111111111111111111111111111111111111",polkadot:"0x",bip122:"0x"},CONVERT_SLIPPAGE_TOLERANCE:1,CONNECT_LABELS:{MOBILE:"Open and continue in a new browser tab"},DEFAULT_FEATURES:{swaps:!0,onramp:!0,receive:!0,send:!0,email:!0,emailShowWallets:!0,socials:["google","x","discord","farcaster","github","apple","facebook"],connectorTypeOrder:["walletConnect","recent","injected","featured","custom","external","recommended"],history:!0,analytics:!0,allWallets:!0,legalCheckbox:!1,smartSessions:!1,collapseWallets:!1,walletFeaturesOrder:["onramp","swaps","receive","send"],connectMethodsOrder:void 0},DEFAULT_ACCOUNT_TYPES:{bip122:"payment",eip155:"smartAccount",polkadot:"eoa",solana:"eoa"},ADAPTER_TYPES:{UNIVERSAL:"universal",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5",BITCOIN:"bitcoin"}},q={cacheExpiry:{portfolio:3e4,nativeBalance:3e4,ens:3e5,identity:3e5},isCacheExpired(e,t){return Date.now()-e>t},getActiveNetworkProps(){let e=q.getActiveNamespace(),t=q.getActiveCaipNetworkId(),r=t?t.split(":")[1]:void 0,o=r?isNaN(Number(r))?r:Number(r):void 0;return{namespace:e,caipNetworkId:t,chainId:o}},setWalletConnectDeepLink({name:e,href:t}){try{ie.setItem(ae.DEEPLINK_CHOICE,JSON.stringify({href:t,name:e}))}catch{console.info("Unable to set WalletConnect deep link")}},getWalletConnectDeepLink(){try{let e=ie.getItem(ae.DEEPLINK_CHOICE);if(e)return JSON.parse(e)}catch{console.info("Unable to get WalletConnect deep link")}},deleteWalletConnectDeepLink(){try{ie.removeItem(ae.DEEPLINK_CHOICE)}catch{console.info("Unable to delete WalletConnect deep link")}},setActiveNamespace(e){try{ie.setItem(ae.ACTIVE_NAMESPACE,e)}catch{console.info("Unable to set active namespace")}},setActiveCaipNetworkId(e){try{ie.setItem(ae.ACTIVE_CAIP_NETWORK_ID,e),q.setActiveNamespace(e.split(":")[0])}catch{console.info("Unable to set active caip network id")}},getActiveCaipNetworkId(){try{return ie.getItem(ae.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to get active caip network id");return}},deleteActiveCaipNetworkId(){try{ie.removeItem(ae.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to delete active caip network id")}},deleteConnectedConnectorId(e){try{let t=oa(e);ie.removeItem(t)}catch{console.info("Unable to delete connected connector id")}},setAppKitRecent(e){try{let t=q.getRecentWallets();t.find(r=>r.id===e.id)||(t.unshift(e),t.length>2&&t.pop(),ie.setItem(ae.RECENT_WALLETS,JSON.stringify(t)))}catch{console.info("Unable to set AppKit recent")}},getRecentWallets(){try{let e=ie.getItem(ae.RECENT_WALLETS);return e?JSON.parse(e):[]}catch{console.info("Unable to get AppKit recent")}return[]},setConnectedConnectorId(e,t){try{let r=oa(e);ie.setItem(r,t)}catch{console.info("Unable to set Connected Connector Id")}},getActiveNamespace(){try{return ie.getItem(ae.ACTIVE_NAMESPACE)}catch{console.info("Unable to get active namespace")}},getConnectedConnectorId(e){if(e)try{let t=oa(e);return ie.getItem(t)}catch{console.info("Unable to get connected connector id in namespace ",e)}},setConnectedSocialProvider(e){try{ie.setItem(ae.CONNECTED_SOCIAL,e)}catch{console.info("Unable to set connected social provider")}},getConnectedSocialProvider(){try{return ie.getItem(ae.CONNECTED_SOCIAL)}catch{console.info("Unable to get connected social provider")}},deleteConnectedSocialProvider(){try{ie.removeItem(ae.CONNECTED_SOCIAL)}catch{console.info("Unable to delete connected social provider")}},getConnectedSocialUsername(){try{return ie.getItem(ae.CONNECTED_SOCIAL_USERNAME)}catch{console.info("Unable to get connected social username")}},getStoredActiveCaipNetworkId(){return ie.getItem(ae.ACTIVE_CAIP_NETWORK_ID)?.split(":")?.[1]},setConnectionStatus(e){try{ie.setItem(ae.CONNECTION_STATUS,e)}catch{console.info("Unable to set connection status")}},getConnectionStatus(){try{return ie.getItem(ae.CONNECTION_STATUS)}catch{return}},getConnectedNamespaces(){try{let e=ie.getItem(ae.CONNECTED_NAMESPACES);return e?.length?e.split(","):[]}catch{return[]}},setConnectedNamespaces(e){try{let t=Array.from(new Set(e));ie.setItem(ae.CONNECTED_NAMESPACES,t.join(","))}catch{console.info("Unable to set namespaces in storage")}},addConnectedNamespace(e){try{let t=q.getConnectedNamespaces();t.includes(e)||(t.push(e),q.setConnectedNamespaces(t))}catch{console.info("Unable to add connected namespace")}},removeConnectedNamespace(e){try{let t=q.getConnectedNamespaces(),r=t.indexOf(e);r>-1&&(t.splice(r,1),q.setConnectedNamespaces(t))}catch{console.info("Unable to remove connected namespace")}},getTelegramSocialProvider(){try{return ie.getItem(ae.TELEGRAM_SOCIAL_PROVIDER)}catch{return console.info("Unable to get telegram social provider"),null}},setTelegramSocialProvider(e){try{ie.setItem(ae.TELEGRAM_SOCIAL_PROVIDER,e)}catch{console.info("Unable to set telegram social provider")}},removeTelegramSocialProvider(){try{ie.removeItem(ae.TELEGRAM_SOCIAL_PROVIDER)}catch{console.info("Unable to remove telegram social provider")}},getBalanceCache(){let e={};try{let t=ie.getItem(ae.PORTFOLIO_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromBalanceCache(e){try{let t=q.getBalanceCache();ie.setItem(ae.PORTFOLIO_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getBalanceCacheForCaipAddress(e){try{let t=q.getBalanceCache()[e];if(t&&!this.isCacheExpired(t.timestamp,this.cacheExpiry.portfolio))return t.balance;q.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateBalanceCache(e){try{let t=q.getBalanceCache();t[e.caipAddress]=e,ie.setItem(ae.PORTFOLIO_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getNativeBalanceCache(){let e={};try{let t=ie.getItem(ae.NATIVE_BALANCE_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromNativeBalanceCache(e){try{let t=q.getBalanceCache();ie.setItem(ae.NATIVE_BALANCE_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getNativeBalanceCacheForCaipAddress(e){try{let t=q.getNativeBalanceCache()[e];if(t&&!this.isCacheExpired(t.timestamp,this.cacheExpiry.nativeBalance))return t;console.info("Discarding cache for address",e),q.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateNativeBalanceCache(e){try{let t=q.getNativeBalanceCache();t[e.caipAddress]=e,ie.setItem(ae.NATIVE_BALANCE_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getEnsCache(){let e={};try{let t=ie.getItem(ae.ENS_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get ens name cache")}return e},getEnsFromCacheForAddress(e){try{let t=q.getEnsCache()[e];if(t&&!this.isCacheExpired(t.timestamp,this.cacheExpiry.ens))return t.ens;q.removeEnsFromCache(e)}catch{console.info("Unable to get ens name from cache",e)}},updateEnsCache(e){try{let t=q.getEnsCache();t[e.address]=e,ie.setItem(ae.ENS_CACHE,JSON.stringify(t))}catch{console.info("Unable to update ens name cache",e)}},removeEnsFromCache(e){try{let t=q.getEnsCache();ie.setItem(ae.ENS_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove ens name from cache",e)}},getIdentityCache(){let e={};try{let t=ie.getItem(ae.IDENTITY_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get identity cache")}return e},getIdentityFromCacheForAddress(e){try{let t=q.getIdentityCache()[e];if(t&&!this.isCacheExpired(t.timestamp,this.cacheExpiry.identity))return t.identity;q.removeIdentityFromCache(e)}catch{console.info("Unable to get identity from cache",e)}},updateIdentityCache(e){try{let t=q.getIdentityCache();t[e.address]={identity:e.identity,timestamp:e.timestamp},ie.setItem(ae.IDENTITY_CACHE,JSON.stringify(t))}catch{console.info("Unable to update identity cache",e)}},removeIdentityFromCache(e){try{let t=q.getIdentityCache();ie.setItem(ae.IDENTITY_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove identity from cache",e)}},clearAddressCache(){try{ie.removeItem(ae.PORTFOLIO_CACHE),ie.removeItem(ae.NATIVE_BALANCE_CACHE),ie.removeItem(ae.ENS_CACHE),ie.removeItem(ae.IDENTITY_CACHE)}catch{console.info("Unable to clear address cache")}},setPreferredAccountTypes(e){try{ie.setItem(ae.PREFERRED_ACCOUNT_TYPES,JSON.stringify(e))}catch{console.info("Unable to set preferred account types",e)}},getPreferredAccountTypes(){try{let e=ie.getItem(ae.PREFERRED_ACCOUNT_TYPES);return JSON.parse(e)}catch{console.info("Unable to get preferred account types")}}},M={isMobile(){return this.isClient()?!!(window?.matchMedia("(pointer:coarse)")?.matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)):!1},checkCaipNetwork(e,t=""){return e?.caipNetworkId.toLocaleLowerCase().includes(t.toLowerCase())},isAndroid(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return M.isMobile()&&e.includes("android")},isIos(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return e.includes("iphone")||e.includes("ipad")},isSafari(){return this.isClient()?(window?.navigator.userAgent.toLowerCase()).includes("safari"):!1},isClient(){return typeof window<"u"},isPairingExpired(e){return e?e-Date.now()<=Re.TEN_SEC_MS:!0},isAllowedRetry(e,t=Re.ONE_SEC_MS){return Date.now()-e>=t},copyToClopboard(e){navigator.clipboard.writeText(e)},isIframe(){try{return window?.self!==window?.top}catch{return!1}},getPairingExpiry(){return Date.now()+Re.FOUR_MINUTES_MS},getNetworkId(e){return e?.split(":")[1]},getPlainAddress(e){return e?.split(":")[2]},async wait(e){return new Promise(t=>{setTimeout(t,e)})},debounce(e,t=500){let r;return(...o)=>{function n(){e(...o)}r&&clearTimeout(r),r=setTimeout(n,t)}},isHttpUrl(e){return e.startsWith("http://")||e.startsWith("https://")},formatNativeUrl(e,t){if(M.isHttpUrl(e))return this.formatUniversalUrl(e,t);let r=e;r.includes("://")||(r=e.replaceAll("/","").replaceAll(":",""),r=`${r}://`),r.endsWith("/")||(r=`${r}/`),this.isTelegram()&&this.isAndroid()&&(t=encodeURIComponent(t));let o=encodeURIComponent(t);return{redirect:`${r}wc?uri=${o}`,href:r}},formatUniversalUrl(e,t){if(!M.isHttpUrl(e))return this.formatNativeUrl(e,t);let r=e;r.endsWith("/")||(r=`${r}/`);let o=encodeURIComponent(t);return{redirect:`${r}wc?uri=${o}`,href:r}},getOpenTargetForPlatform(e){return e==="popupWindow"?e:this.isTelegram()?q.getTelegramSocialProvider()?"_top":"_blank":e},openHref(e,t,r){window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},returnOpenHref(e,t,r){return window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},isTelegram(){return typeof window<"u"&&(!!window.TelegramWebviewProxy||!!window.Telegram||!!window.TelegramWebviewProxyProto)},async preloadImage(e){let t=new Promise((r,o)=>{let n=new Image;n.onload=r,n.onerror=o,n.crossOrigin="anonymous",n.src=e});return Promise.race([t,M.wait(2e3)])},formatBalance(e,t){let r="0.000";if(typeof e=="string"){let o=Number(e);if(o){let n=Math.floor(o*1e3)/1e3;n&&(r=n.toString())}}return`${r}${t?` ${t}`:""}`},formatBalance2(e,t){let r;if(e==="0")r="0";else if(typeof e=="string"){let o=Number(e);o&&(r=o.toString().match(/^-?\d+(?:\.\d{0,3})?/u)?.[0])}return{value:r??"0",rest:r==="0"?"000":"",symbol:t}},getApiUrl(){return G.W3M_API_URL},getBlockchainApiUrl(){return G.BLOCKCHAIN_API_RPC_URL},getAnalyticsUrl(){return G.PULSE_API_URL},getUUID(){return crypto?.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu,e=>{let t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})},parseError(e){return typeof e=="string"?e:typeof e?.issues?.[0]?.message=="string"?e.issues[0].message:e instanceof Error?e.message:"Unknown error"},sortRequestedNetworks(e,t=[]){let r={};return t&&e&&(e.forEach((o,n)=>{r[o]=n}),t.sort((o,n)=>{let i=r[o.id],s=r[n.id];return i!==void 0&&s!==void 0?i-s:i!==void 0?-1:s!==void 0?1:0})),t},calculateBalance(e){let t=0;for(let r of e)t+=r.value??0;return t},formatTokenBalance(e){let t=e.toFixed(2),[r,o]=t.split(".");return{dollars:r,pennies:o}},isAddress(e,t="eip155"){switch(t){case"eip155":if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)){if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)||/^(?:0x)?[0-9A-F]{40}$/iu.test(e))return!0}else return!1;return!1;case"solana":return/[1-9A-HJ-NP-Za-km-z]{32,44}$/iu.test(e);default:return!1}},uniqueBy(e,t){let r=new Set;return e.filter(o=>{let n=o[t];return r.has(n)?!1:(r.add(n),!0)})},generateSdkVersion(e,t,r){let o=e.length===0?Re.ADAPTER_TYPES.UNIVERSAL:e.map(n=>n.adapterType).join(",");return`${t}-${o}-${r}`},createAccount(e,t,r,o,n){return{namespace:e,address:t,type:r,publicKey:o,path:n}},isCaipAddress(e){if(typeof e!="string")return!1;let t=e.split(":"),r=t[0];return t.filter(Boolean).length===3&&r in G.CHAIN_NAME_MAP},isMac(){let e=window?.navigator.userAgent.toLowerCase();return e.includes("macintosh")&&!e.includes("safari")},formatTelegramSocialLoginUrl(e){let t=`--${encodeURIComponent(window?.location.href)}`,r="state=";if(new URL(e).host==="auth.magic.link"){let o="provider_authorization_url=",n=e.substring(e.indexOf(o)+o.length),i=this.injectIntoUrl(decodeURIComponent(n),r,t);return e.replace(n,encodeURIComponent(i))}return this.injectIntoUrl(e,r,t)},injectIntoUrl(e,t,r){let o=e.indexOf(t);if(o===-1)throw new Error(`${t} parameter not found in the URL: ${e}`);let n=e.indexOf("&",o),i=t.length,s=n!==-1?n:e.length,a=e.substring(0,o+i),c=e.substring(o+i,s),l=e.substring(n),d=c+r;return a+d+l}};async function Fo(...e){let t=await fetch(...e);if(!t.ok)throw new Error(`HTTP status code: ${t.status}`,{cause:t});return t}var Ao=class{constructor({baseUrl:t,clientId:r}){this.baseUrl=t,this.clientId=r}async get({headers:t,signal:r,cache:o,...n}){let i=this.createUrl(n);return(await Fo(i,{method:"GET",headers:t,signal:r,cache:o})).json()}async getBlob({headers:t,signal:r,...o}){let n=this.createUrl(o);return(await Fo(n,{method:"GET",headers:t,signal:r})).blob()}async post({body:t,headers:r,signal:o,...n}){let i=this.createUrl(n);return(await Fo(i,{method:"POST",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async put({body:t,headers:r,signal:o,...n}){let i=this.createUrl(n);return(await Fo(i,{method:"PUT",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async delete({body:t,headers:r,signal:o,...n}){let i=this.createUrl(n);return(await Fo(i,{method:"DELETE",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}createUrl({path:t,params:r}){let o=new URL(t,this.baseUrl);return r&&Object.entries(r).forEach(([n,i])=>{i&&o.searchParams.append(n,i)}),this.clientId&&o.searchParams.append("clientId",this.clientId),o}},K1={handleSolanaDeeplinkRedirect(e){if(g.state.activeChain===G.CHAIN.SOLANA){let t=window.location.href,r=encodeURIComponent(t);if(e==="Phantom"&&!("phantom"in window)){let o=t.startsWith("https")?"https":"http",n=t.split("/")[2],i=encodeURIComponent(`${o}://${n}`);window.location.href=`https://phantom.app/ul/browse/${r}?ref=${i}`}e==="Coinbase Wallet"&&!("coinbaseSolana"in window)&&(window.location.href=`https://go.cb-w.com/dapp?cb_url=${r}`)}}},st=xe({walletImages:{},networkImages:{},chainImages:{},connectorImages:{},tokenImages:{},currencyImages:{}}),tt={state:st,subscribeNetworkImages(e){return je(st.networkImages,()=>e(st.networkImages))},subscribeKey(e,t){return qe(st,e,t)},subscribe(e){return je(st,()=>e(st))},setWalletImage(e,t){st.walletImages[e]=t},setNetworkImage(e,t){st.networkImages[e]=t},setChainImage(e,t){st.chainImages[e]=t},setConnectorImage(e,t){st.connectorImages={...st.connectorImages,[e]:t}},setTokenImage(e,t){st.tokenImages[e]=t},setCurrencyImage(e,t){st.currencyImages[e]=t}},Y1={eip155:"ba0ba0cd-17c6-4806-ad93-f9d174f17900",solana:"a1b58899-f671-4276-6a5e-56ca5bd59700",polkadot:"",bip122:"0b4838db-0161-4ffe-022d-532bf03dba00"},sa=xe({networkImagePromises:{}}),$e={async fetchWalletImage(e){if(e)return await W._fetchWalletImage(e),this.getWalletImageById(e)},async fetchNetworkImage(e){return e?this.getNetworkImageById(e)||(sa.networkImagePromises[e]||(sa.networkImagePromises[e]=W._fetchNetworkImage(e)),await sa.networkImagePromises[e],this.getNetworkImageById(e)):void 0},getWalletImageById(e){if(e)return tt.state.walletImages[e]},getWalletImage(e){if(e?.image_url)return e?.image_url;if(e?.image_id)return tt.state.walletImages[e.image_id]},getNetworkImage(e){if(e?.assets?.imageUrl)return e?.assets?.imageUrl;if(e?.assets?.imageId)return tt.state.networkImages[e.assets.imageId]},getNetworkImageById(e){if(e)return tt.state.networkImages[e]},getConnectorImage(e){if(e?.imageUrl)return e.imageUrl;if(e?.imageId)return tt.state.connectorImages[e.imageId]},getChainImage(e){return tt.state.networkImages[Y1[e]]}},J1={getFeatureValue(e,t){let r=t?.[e];return r===void 0?Re.DEFAULT_FEATURES[e]:r},filterSocialsByPlatform(e){if(!e||!e.length)return e;if(M.isTelegram()){if(M.isIos())return e.filter(t=>t!=="google");if(M.isMac())return e.filter(t=>t!=="x");if(M.isAndroid())return e.filter(t=>!["facebook","x"].includes(t))}return e}},te=xe({features:Re.DEFAULT_FEATURES,projectId:"",sdkType:"appkit",sdkVersion:"html-wagmi-undefined",defaultAccountTypes:{solana:"eoa",bip122:"payment",polkadot:"eoa",eip155:"smartAccount"},enableNetworkSwitch:!0}),O={state:te,subscribeKey(e,t){return qe(te,e,t)},setOptions(e){Object.assign(te,e)},setFeatures(e){if(!e)return;te.features||(te.features=Re.DEFAULT_FEATURES);let t={...te.features,...e};te.features=t,te.features.socials&&(te.features.socials=J1.filterSocialsByPlatform(te.features.socials))},setProjectId(e){te.projectId=e},setCustomRpcUrls(e){te.customRpcUrls=e},setAllWallets(e){te.allWallets=e},setIncludeWalletIds(e){te.includeWalletIds=e},setExcludeWalletIds(e){te.excludeWalletIds=e},setFeaturedWalletIds(e){te.featuredWalletIds=e},setTokens(e){te.tokens=e},setTermsConditionsUrl(e){te.termsConditionsUrl=e},setPrivacyPolicyUrl(e){te.privacyPolicyUrl=e},setCustomWallets(e){te.customWallets=e},setIsSiweEnabled(e){te.isSiweEnabled=e},setIsUniversalProvider(e){te.isUniversalProvider=e},setSdkVersion(e){te.sdkVersion=e},setMetadata(e){te.metadata=e},setDisableAppend(e){te.disableAppend=e},setEIP6963Enabled(e){te.enableEIP6963=e},setDebug(e){te.debug=e},setEnableWalletConnect(e){te.enableWalletConnect=e},setEnableWalletGuide(e){te.enableWalletGuide=e},setEnableAuthLogger(e){te.enableAuthLogger=e},setEnableWallets(e){te.enableWallets=e},setHasMultipleAddresses(e){te.hasMultipleAddresses=e},setSIWX(e){te.siwx=e},setConnectMethodsOrder(e){te.features={...te.features,connectMethodsOrder:e}},setWalletFeaturesOrder(e){te.features={...te.features,walletFeaturesOrder:e}},setSocialsOrder(e){te.features={...te.features,socials:e}},setCollapseWallets(e){te.features={...te.features,collapseWallets:e}},setEnableEmbedded(e){te.enableEmbedded=e},setAllowUnsupportedChain(e){te.allowUnsupportedChain=e},setManualWCControl(e){te.manualWCControl=e},setEnableNetworkSwitch(e){te.enableNetworkSwitch=e},setDefaultAccountTypes(e={}){Object.entries(e).forEach(([t,r])=>{r&&(te.defaultAccountTypes[t]=r)})},setUniversalProviderConfigOverride(e){te.universalProviderConfigOverride=e},getUniversalProviderConfigOverride(){return te.universalProviderConfigOverride},getSnapshot(){return Nn(te)}},ir=xe({message:"",variant:"info",open:!1}),wr={state:ir,subscribeKey(e,t){return qe(ir,e,t)},open(e,t){let{debug:r}=O.state,{shortMessage:o,longMessage:n}=e;r&&(ir.message=o,ir.variant=t,ir.open=!0),n&&console.error(typeof n=="function"?n():n)},close(){ir.open=!1,ir.message="",ir.variant="info"}},X1=M.getAnalyticsUrl(),Q1=new Ao({baseUrl:X1,clientId:null}),eh=["MODAL_CREATED"],zt=xe({timestamp:Date.now(),reportedErrors:{},data:{type:"track",event:"MODAL_CREATED"}}),ce={state:zt,subscribe(e){return je(zt,()=>e(zt))},getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=O.state;return{projectId:e,st:t,sv:r||"html-wagmi-4.2.2"}},async _sendAnalyticsEvent(e){try{let t=J.state.address;if(eh.includes(e.data.event)||typeof window>"u")return;await Q1.post({path:"/e",params:ce.getSdkProperties(),body:{eventId:M.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:e.timestamp,props:{...e.data,address:t}}}),zt.reportedErrors.FORBIDDEN=!1}catch(t){t instanceof Error&&t.cause instanceof Response&&t.cause.status===G.HTTP_STATUS_CODES.FORBIDDEN&&!zt.reportedErrors.FORBIDDEN&&(wr.open({shortMessage:"Invalid App Configuration",longMessage:`Origin ${wn()?window.origin:"uknown"} not found on Allowlist - update configuration on cloud.reown.com`},"error"),zt.reportedErrors.FORBIDDEN=!0)}},sendEvent(e){zt.timestamp=Date.now(),zt.data=e,O.state.features?.analytics&&ce._sendAnalyticsEvent(zt)}},th=["1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79","fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa","a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393"],rh=M.getApiUrl(),ht=new Ao({baseUrl:rh,clientId:null}),oh=40,dd=4,nh=20,ve=xe({promises:{},page:1,count:0,featured:[],allFeatured:[],recommended:[],allRecommended:[],wallets:[],search:[],isAnalyticsEnabled:!1,excludedWallets:[],isFetchingRecommendedWallets:!1}),W={state:ve,subscribeKey(e,t){return qe(ve,e,t)},_getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=O.state;return{projectId:e,st:t||"appkit",sv:r||"html-wagmi-4.2.2"}},_filterOutExtensions(e){return O.state.isUniversalProvider?e.filter(t=>!!(t.mobile_link||t.desktop_link||t.webapp_link)):e},async _fetchWalletImage(e){let t=`${ht.baseUrl}/getWalletImage/${e}`,r=await ht.getBlob({path:t,params:W._getSdkProperties()});tt.setWalletImage(e,URL.createObjectURL(r))},async _fetchNetworkImage(e){let t=`${ht.baseUrl}/public/getAssetImage/${e}`,r=await ht.getBlob({path:t,params:W._getSdkProperties()});tt.setNetworkImage(e,URL.createObjectURL(r))},async _fetchConnectorImage(e){let t=`${ht.baseUrl}/public/getAssetImage/${e}`,r=await ht.getBlob({path:t,params:W._getSdkProperties()});tt.setConnectorImage(e,URL.createObjectURL(r))},async _fetchCurrencyImage(e){let t=`${ht.baseUrl}/public/getCurrencyImage/${e}`,r=await ht.getBlob({path:t,params:W._getSdkProperties()});tt.setCurrencyImage(e,URL.createObjectURL(r))},async _fetchTokenImage(e){let t=`${ht.baseUrl}/public/getTokenImage/${e}`,r=await ht.getBlob({path:t,params:W._getSdkProperties()});tt.setTokenImage(e,URL.createObjectURL(r))},async fetchNetworkImages(){let e=g.getAllRequestedCaipNetworks()?.map(({assets:t})=>t?.imageId).filter(Boolean).filter(t=>!$e.getNetworkImageById(t));e&&await Promise.allSettled(e.map(t=>W._fetchNetworkImage(t)))},async fetchConnectorImages(){let{connectors:e}=H.state,t=e.map(({imageId:r})=>r).filter(Boolean);await Promise.allSettled(t.map(r=>W._fetchConnectorImage(r)))},async fetchCurrencyImages(e=[]){await Promise.allSettled(e.map(t=>W._fetchCurrencyImage(t)))},async fetchTokenImages(e=[]){await Promise.allSettled(e.map(t=>W._fetchTokenImage(t)))},async fetchWallets(e){let t=e.exclude??[];return W._getSdkProperties().sv.startsWith("html-core-")&&t.push(...th),await ht.get({path:"/getWallets",params:{...W._getSdkProperties(),...e,page:String(e.page),entries:String(e.entries),include:e.include?.join(","),exclude:e.exclude?.join(",")}})},async fetchFeaturedWallets(){let{featuredWalletIds:e}=O.state;if(e?.length){let t={...W._getSdkProperties(),page:1,entries:e?.length??dd,include:e},{data:r}=await W.fetchWallets(t);r.sort((n,i)=>e.indexOf(n.id)-e.indexOf(i.id));let o=r.map(n=>n.image_id).filter(Boolean);await Promise.allSettled(o.map(n=>W._fetchWalletImage(n))),ve.featured=r,ve.allFeatured=r}},async fetchRecommendedWallets(){try{ve.isFetchingRecommendedWallets=!0;let{includeWalletIds:e,excludeWalletIds:t,featuredWalletIds:r}=O.state,o=[...t??[],...r??[]].filter(Boolean),n=g.getRequestedCaipNetworkIds().join(","),i={page:1,entries:dd,include:e,exclude:o,chains:n},{data:s,count:a}=await W.fetchWallets(i),c=q.getRecentWallets(),l=s.map(u=>u.image_id).filter(Boolean),d=c.map(u=>u.image_id).filter(Boolean);await Promise.allSettled([...l,...d].map(u=>W._fetchWalletImage(u))),ve.recommended=s,ve.allRecommended=s,ve.count=a??0}catch{}finally{ve.isFetchingRecommendedWallets=!1}},async fetchWalletsByPage({page:e}){let{includeWalletIds:t,excludeWalletIds:r,featuredWalletIds:o}=O.state,n=g.getRequestedCaipNetworkIds().join(","),i=[...ve.recommended.map(({id:d})=>d),...r??[],...o??[]].filter(Boolean),s={page:e,entries:oh,include:t,exclude:i,chains:n},{data:a,count:c}=await W.fetchWallets(s),l=a.slice(0,nh).map(d=>d.image_id).filter(Boolean);await Promise.allSettled(l.map(d=>W._fetchWalletImage(d))),ve.wallets=M.uniqueBy([...ve.wallets,...W._filterOutExtensions(a)],"id"),ve.count=c>ve.count?c:ve.count,ve.page=e},async initializeExcludedWallets({ids:e}){let t=g.getRequestedCaipNetworkIds().join(","),r={page:1,entries:e.length,include:e,chains:t},{data:o}=await W.fetchWallets(r);o&&o.forEach(n=>{ve.excludedWallets.push({rdns:n.rdns,name:n.name})})},async searchWallet({search:e,badge:t}){let{includeWalletIds:r,excludeWalletIds:o}=O.state,n=g.getRequestedCaipNetworkIds().join(",");ve.search=[];let i={page:1,entries:100,search:e?.trim(),badge_type:t,include:r,exclude:o,chains:n},{data:s}=await W.fetchWallets(i);ce.sendEvent({type:"track",event:"SEARCH_WALLET",properties:{badge:t??"",search:e??""}});let a=s.map(c=>c.image_id).filter(Boolean);await Promise.allSettled([...a.map(c=>W._fetchWalletImage(c)),M.wait(300)]),ve.search=W._filterOutExtensions(s)},initPromise(e,t){return ve.promises[e]||(ve.promises[e]=t())},prefetch({fetchConnectorImages:e=!0,fetchFeaturedWallets:t=!0,fetchRecommendedWallets:r=!0,fetchNetworkImages:o=!0}={}){let n=[e&&W.initPromise("connectorImages",W.fetchConnectorImages),t&&W.initPromise("featuredWallets",W.fetchFeaturedWallets),r&&W.initPromise("recommendedWallets",W.fetchRecommendedWallets),o&&W.initPromise("networkImages",W.fetchNetworkImages)].filter(Boolean);return Promise.allSettled(n)},prefetchAnalyticsConfig(){O.state.features?.analytics&&W.fetchAnalyticsConfig()},async fetchAnalyticsConfig(){try{let{isAnalyticsEnabled:e}=await ht.get({path:"/getAnalyticsConfig",params:W._getSdkProperties()});O.setFeatures({analytics:e})}catch{O.setFeatures({analytics:!1})}},setFilterByNamespace(e){if(!e){ve.featured=ve.allFeatured,ve.recommended=ve.allRecommended;return}let t=g.getRequestedCaipNetworkIds().join(",");ve.featured=ve.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),ve.recommended=ve.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o)))}},fe=xe({view:"Connect",history:["Connect"],transactionStack:[]}),D={state:fe,subscribeKey(e,t){return qe(fe,e,t)},pushTransactionStack(e){fe.transactionStack.push(e)},popTransactionStack(e){let t=fe.transactionStack.pop();if(t)if(e)this.goBack(),t?.onCancel?.();else{if(t.goBack)this.goBack();else if(t.replace){let r=fe.history.indexOf("ConnectingSiwe");r>0?this.goBackToIndex(r-1):(de.close(),fe.history=[])}else t.view&&this.reset(t.view);t?.onSuccess?.()}},push(e,t){e!==fe.view&&(fe.view=e,fe.history.push(e),fe.data=t)},reset(e,t){fe.view=e,fe.history=[e],fe.data=t},replace(e,t){fe.history.at(-1)===e||(fe.view=e,fe.history[fe.history.length-1]=e,fe.data=t)},goBack(){let e=!g.state.activeCaipAddress&&this.state.view==="ConnectingFarcaster";if(fe.history.length>1&&!fe.history.includes("UnsupportedChain")){fe.history.pop();let[t]=fe.history.slice(-1);t&&(fe.view=t)}else de.close();fe.data?.wallet&&(fe.data.wallet=void 0),setTimeout(()=>{if(e){J.setFarcasterUrl(void 0,g.state.activeChain);let t=H.getAuthConnector();t?.provider?.reload();let r=Nn(O.state);t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType})}},100)},goBackToIndex(e){if(fe.history.length>1){fe.history=fe.history.slice(0,e+1);let[t]=fe.history.slice(-1);t&&(fe.view=t)}}},Dt=xe({themeMode:"dark",themeVariables:{},w3mThemeVariables:void 0}),Pe={state:Dt,subscribe(e){return je(Dt,()=>e(Dt))},setThemeMode(e){Dt.themeMode=e;try{let t=H.getAuthConnector();if(t){let r=Pe.getSnapshot().themeVariables;t.provider.syncTheme({themeMode:e,themeVariables:r,w3mThemeVariables:gr(r,e)})}}catch{console.info("Unable to sync theme to auth connector")}},setThemeVariables(e){Dt.themeVariables={...Dt.themeVariables,...e};try{let t=H.getAuthConnector();if(t){let r=Pe.getSnapshot().themeVariables;t.provider.syncTheme({themeVariables:r,w3mThemeVariables:gr(Dt.themeVariables,Dt.themeMode)})}}catch{console.info("Unable to sync theme to auth connector")}},getSnapshot(){return Nn(Dt)}},H0={eip155:void 0,solana:void 0,polkadot:void 0,bip122:void 0},be=xe({allConnectors:[],connectors:[],activeConnector:void 0,filterByNamespace:void 0,activeConnectorIds:{...H0}}),H={state:be,subscribe(e){return je(be,()=>{e(be)})},subscribeKey(e,t){return qe(be,e,t)},initialize(e){e.forEach(t=>{let r=q.getConnectedConnectorId(t);r&&this.setConnectorId(r,t)})},setActiveConnector(e){e&&(be.activeConnector=Jr(e))},setConnectors(e){e.filter(t=>!be.allConnectors.some(r=>r.id===t.id&&this.getConnectorName(r.name)===this.getConnectorName(t.name)&&r.chain===t.chain)).forEach(t=>{t.type!=="MULTI_CHAIN"&&be.allConnectors.push(Jr(t))}),be.connectors=this.mergeMultiChainConnectors(be.allConnectors)},removeAdapter(e){be.allConnectors=be.allConnectors.filter(t=>t.chain!==e),be.connectors=this.mergeMultiChainConnectors(be.allConnectors)},mergeMultiChainConnectors(e){let t=this.generateConnectorMapByName(e),r=[];return t.forEach(o=>{let n=o[0],i=n?.id===G.CONNECTOR_ID.AUTH;o.length>1&&n?r.push({name:n.name,imageUrl:n.imageUrl,imageId:n.imageId,connectors:[...o],type:i?"AUTH":"MULTI_CHAIN",chain:"eip155",id:n?.id||""}):n&&r.push(n)}),r},generateConnectorMapByName(e){let t=new Map;return e.forEach(r=>{let{name:o}=r,n=this.getConnectorName(o);if(!n)return;let i=t.get(n)||[];i.find(s=>s.chain===r.chain)||i.push(r),t.set(n,i)}),t},getConnectorName(e){return e&&({"Trust Wallet":"Trust"}[e]||e)},getUniqueConnectorsByName(e){let t=[];return e.forEach(r=>{t.find(o=>o.chain===r.chain)||t.push(r)}),t},addConnector(e){if(e.id===G.CONNECTOR_ID.AUTH){let t=e,r=Nn(O.state),o=Pe.getSnapshot().themeMode,n=Pe.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType}),t?.provider?.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:gr(n,o)}),this.setConnectors([e])}else this.setConnectors([e])},getAuthConnector(e){let t=e||g.state.activeChain,r=be.connectors.find(o=>o.id===G.CONNECTOR_ID.AUTH);if(r)return r?.connectors?.length?r.connectors.find(o=>o.chain===t):r},getAnnouncedConnectorRdns(){return be.connectors.filter(e=>e.type==="ANNOUNCED").map(e=>e.info?.rdns)},getConnectorById(e){return be.allConnectors.find(t=>t.id===e)},getConnector(e,t){return be.allConnectors.filter(r=>r.chain===g.state.activeChain).find(r=>r.explorerId===e||r.info?.rdns===t)},syncIfAuthConnector(e){if(e.id!=="ID_AUTH")return;let t=e,r=Nn(O.state),o=Pe.getSnapshot().themeMode,n=Pe.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,sdkType:r.sdkType,projectId:r.projectId}),t.provider.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:gr(n,o)})},getConnectorsByNamespace(e){let t=be.allConnectors.filter(r=>r.chain===e);return this.mergeMultiChainConnectors(t)},selectWalletConnector(e){let t=H.getConnector(e.id,e.rdns);g.state.activeChain===G.CHAIN.SOLANA&&K1.handleSolanaDeeplinkRedirect(t?.name||e.name||""),t?D.push("ConnectingExternal",{connector:t}):D.push("ConnectingWalletConnect",{wallet:e})},getConnectors(e){return e?this.getConnectorsByNamespace(e):this.mergeMultiChainConnectors(be.allConnectors)},setFilterByNamespace(e){be.filterByNamespace=e,be.connectors=this.getConnectors(e),W.setFilterByNamespace(e)},setConnectorId(e,t){e&&(be.activeConnectorIds={...be.activeConnectorIds,[t]:e},q.setConnectedConnectorId(t,e))},removeConnectorId(e){be.activeConnectorIds={...be.activeConnectorIds,[e]:void 0},q.deleteConnectedConnectorId(e)},getConnectorId(e){if(e)return be.activeConnectorIds[e]},isConnected(e){return e?!!be.activeConnectorIds[e]:Object.values(be.activeConnectorIds).some(t=>!!t)},resetConnectorIds(){be.activeConnectorIds={...H0}}};function gi(e,t){return H.getConnectorId(e)===t}function ih(e){let t=Array.from(g.state.chains.keys()),r=[];return e?(r.push([e,g.state.chains.get(e)]),gi(e,G.CONNECTOR_ID.WALLET_CONNECT)?t.forEach(o=>{o!==e&&gi(o,G.CONNECTOR_ID.WALLET_CONNECT)&&r.push([o,g.state.chains.get(o)])}):gi(e,G.CONNECTOR_ID.AUTH)&&t.forEach(o=>{o!==e&&gi(o,G.CONNECTOR_ID.AUTH)&&r.push([o,g.state.chains.get(o)])})):r=Array.from(g.state.chains.entries()),r}typeof process<"u"&&typeof process.env<"u"&&process.env.NEXT_PUBLIC_SECURE_SITE_SDK_URL,typeof process<"u"&&typeof process.env<"u"&&process.env.NEXT_PUBLIC_DEFAULT_LOG_LEVEL,typeof process<"u"&&typeof process.env<"u"&&process.env.NEXT_PUBLIC_SECURE_SITE_SDK_VERSION;var ur={SAFE_RPC_METHODS:["eth_accounts","eth_blockNumber","eth_call","eth_chainId","eth_estimateGas","eth_feeHistory","eth_gasPrice","eth_getAccount","eth_getBalance","eth_getBlockByHash","eth_getBlockByNumber","eth_getBlockReceipts","eth_getBlockTransactionCountByHash","eth_getBlockTransactionCountByNumber","eth_getCode","eth_getFilterChanges","eth_getFilterLogs","eth_getLogs","eth_getProof","eth_getStorageAt","eth_getTransactionByBlockHashAndIndex","eth_getTransactionByBlockNumberAndIndex","eth_getTransactionByHash","eth_getTransactionCount","eth_getTransactionReceipt","eth_getUncleCountByBlockHash","eth_getUncleCountByBlockNumber","eth_maxPriorityFeePerGas","eth_newBlockFilter","eth_newFilter","eth_newPendingTransactionFilter","eth_sendRawTransaction","eth_syncing","eth_uninstallFilter","wallet_getCapabilities","wallet_getCallsStatus","eth_getUserOperationReceipt","eth_estimateUserOperationGas","eth_getUserOperationByHash","eth_supportedEntryPoints","wallet_getAssets"],NOT_SAFE_RPC_METHODS:["personal_sign","eth_signTypedData_v4","eth_sendTransaction","solana_signMessage","solana_signTransaction","solana_signAllTransactions","solana_signAndSendTransaction","wallet_sendCalls","wallet_grantPermissions","wallet_revokePermissions","eth_sendUserOperation"],GET_CHAIN_ID:"eth_chainId",RPC_METHOD_NOT_ALLOWED_MESSAGE:"Requested RPC call is not allowed",RPC_METHOD_NOT_ALLOWED_UI_MESSAGE:"Action not allowed",ACCOUNT_TYPES:{EOA:"eoa",SMART_ACCOUNT:"smartAccount"}},Dr=Object.freeze({message:"",variant:"success",svg:void 0,open:!1,autoClose:!0}),_e=xe({...Dr}),Ce={state:_e,subscribeKey(e,t){return qe(_e,e,t)},showLoading(e,t={}){this._showMessage({message:e,variant:"loading",...t})},showSuccess(e){this._showMessage({message:e,variant:"success"})},showSvg(e,t){this._showMessage({message:e,svg:t})},showError(e){let t=M.parseError(e);this._showMessage({message:t,variant:"error"})},hide(){_e.message=Dr.message,_e.variant=Dr.variant,_e.svg=Dr.svg,_e.open=Dr.open,_e.autoClose=Dr.autoClose},_showMessage({message:e,svg:t,variant:r="success",autoClose:o=Dr.autoClose}){_e.open?(_e.open=!1,setTimeout(()=>{_e.message=e,_e.variant=r,_e.svg=t,_e.open=!0,_e.autoClose=o},150)):(_e.message=e,_e.variant=r,_e.svg=t,_e.open=!0,_e.autoClose=o)}},mr={getSIWX(){return O.state.siwx},async initializeIfEnabled(){let e=O.state.siwx,t=g.getActiveCaipAddress();if(!(e&&t))return;let[r,o,n]=t.split(":");if(g.checkIfSupportedNetwork(r))try{if((await e.getSessions(`${r}:${o}`,n)).length)return;await de.open({view:"SIWXSignMessage"})}catch(i){console.error("SIWXUtil:initializeIfEnabled",i),ce.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:this.getSIWXEventProperties()}),await Y._getClient()?.disconnect().catch(console.error),D.reset("Connect"),Ce.showError("A problem occurred while trying initialize authentication")}},async requestSignMessage(){let e=O.state.siwx,t=M.getPlainAddress(g.getActiveCaipAddress()),r=g.getActiveCaipNetwork(),o=Y._getClient();if(!e)throw new Error("SIWX is not enabled");if(!t)throw new Error("No ActiveCaipAddress found");if(!r)throw new Error("No ActiveCaipNetwork or client found");if(!o)throw new Error("No ConnectionController client found");try{let n=await e.createMessage({chainId:r.caipNetworkId,accountAddress:t}),i=n.toString();H.getConnectorId(r.chainNamespace)===G.CONNECTOR_ID.AUTH&&D.pushTransactionStack({view:null,goBack:!1,replace:!0});let s=await o.signMessage(i);await e.addSession({data:n,message:i,signature:s}),de.close(),ce.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:this.getSIWXEventProperties()})}catch(n){let i=this.getSIWXEventProperties();(!de.state.open||D.state.view==="ApproveTransaction")&&await de.open({view:"SIWXSignMessage"}),i.isSmartAccount?Ce.showError("This application might not support Smart Accounts"):Ce.showError("Signature declined"),ce.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:i}),console.error("SWIXUtil:requestSignMessage",n)}},async cancelSignMessage(){try{this.getSIWX()?.getRequired?.()?await Y.disconnect():de.close(),D.reset("Connect"),ce.sendEvent({event:"CLICK_CANCEL_SIWX",type:"track",properties:this.getSIWXEventProperties()})}catch(e){console.error("SIWXUtil:cancelSignMessage",e)}},async getSessions(){let e=O.state.siwx,t=M.getPlainAddress(g.getActiveCaipAddress()),r=g.getActiveCaipNetwork();return e&&t&&r?e.getSessions(r.caipNetworkId,t):[]},async isSIWXCloseDisabled(){let e=this.getSIWX();if(e){let t=D.state.view==="ApproveTransaction",r=D.state.view==="SIWXSignMessage";if(t||r)return e.getRequired?.()&&(await this.getSessions()).length===0}return!1},async universalProviderAuthenticate({universalProvider:e,chains:t,methods:r}){let o=mr.getSIWX(),n=new Set(t.map(a=>a.split(":")[0]));if(!o||n.size!==1||!n.has("eip155"))return!1;let i=await o.createMessage({chainId:g.getActiveCaipNetwork()?.caipNetworkId||"",accountAddress:""}),s=await e.authenticate({nonce:i.nonce,domain:i.domain,uri:i.uri,exp:i.expirationTime,iat:i.issuedAt,nbf:i.notBefore,requestId:i.requestId,version:i.version,resources:i.resources,statement:i.statement,chainId:i.chainId,methods:r,chains:[i.chainId,...t.filter(a=>a!==i.chainId)]});if(Ce.showLoading("Authenticating...",{autoClose:!1}),J.setConnectedWalletInfo({...s.session.peer.metadata,name:s.session.peer.metadata.name,icon:s.session.peer.metadata.icons?.[0],type:"WALLET_CONNECT"},Array.from(n)[0]),s?.auths?.length){let a=s.auths.map(c=>{let l=e.client.formatAuthMessage({request:c.p,iss:c.p.iss});return{data:{...c.p,accountAddress:c.p.iss.split(":").slice(-1).join(""),chainId:c.p.iss.split(":").slice(2,4).join(":"),uri:c.p.aud,version:c.p.version||i.version,expirationTime:c.p.exp,issuedAt:c.p.iat,notBefore:c.p.nbf},message:l,signature:c.s.s,cacao:c}});try{await o.setSessions(a),ce.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:mr.getSIWXEventProperties()})}catch(c){throw console.error("SIWX:universalProviderAuth - failed to set sessions",c),ce.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:mr.getSIWXEventProperties()}),await e.disconnect().catch(console.error),c}finally{Ce.hide()}}return!0},getSIWXEventProperties(){let e=g.state.activeChain;return{network:g.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:J.state.preferredAccountTypes?.[e]===ur.ACCOUNT_TYPES.SMART_ACCOUNT}},async clearSessions(){let e=this.getSIWX();e&&await e.setSessions([])}},Ee=xe({transactions:[],coinbaseTransactions:{},transactionsByYear:{},lastNetworkInView:void 0,loading:!1,empty:!1,next:void 0}),sh={state:Ee,subscribe(e){return je(Ee,()=>e(Ee))},setLastNetworkInView(e){Ee.lastNetworkInView=e},async fetchTransactions(e,t){if(!e)throw new Error("Transactions can't be fetched without an accountAddress");Ee.loading=!0;try{let r=await re.fetchTransactions({account:e,cursor:Ee.next,onramp:t,cache:t==="coinbase"?"no-cache":void 0,chainId:g.state.activeCaipNetwork?.caipNetworkId}),o=this.filterSpamTransactions(r.data),n=this.filterByConnectedChain(o),i=[...Ee.transactions,...n];Ee.loading=!1,t==="coinbase"?Ee.coinbaseTransactions=this.groupTransactionsByYearAndMonth(Ee.coinbaseTransactions,r.data):(Ee.transactions=i,Ee.transactionsByYear=this.groupTransactionsByYearAndMonth(Ee.transactionsByYear,n)),Ee.empty=i.length===0,Ee.next=r.next?r.next:void 0}catch{let r=g.state.activeChain;ce.sendEvent({type:"track",event:"ERROR_FETCH_TRANSACTIONS",properties:{address:e,projectId:O.state.projectId,cursor:Ee.next,isSmartAccount:J.state.preferredAccountTypes?.[r]===ur.ACCOUNT_TYPES.SMART_ACCOUNT}}),Ce.showError("Failed to fetch transactions"),Ee.loading=!1,Ee.empty=!0,Ee.next=void 0}},groupTransactionsByYearAndMonth(e={},t=[]){let r=e;return t.forEach(o=>{let n=new Date(o.metadata.minedAt).getFullYear(),i=new Date(o.metadata.minedAt).getMonth(),s=r[n]??{},a=(s[i]??[]).filter(c=>c.id!==o.id);r[n]={...s,[i]:[...a,o].sort((c,l)=>new Date(l.metadata.minedAt).getTime()-new Date(c.metadata.minedAt).getTime())}}),r},filterSpamTransactions(e){return e.filter(t=>!t.transfers.every(r=>r.nft_info?.flags.is_spam===!0))},filterByConnectedChain(e){let t=g.state.activeCaipNetwork?.caipNetworkId;return e.filter(r=>r.metadata.chain===t)},clearCursor(){Ee.next=void 0},resetTransactions(){Ee.transactions=[],Ee.transactionsByYear={},Ee.lastNetworkInView=void 0,Ee.loading=!1,Ee.empty=!1,Ee.next=void 0}},ke=xe({wcError:!1,buffering:!1,status:"disconnected"}),io,Y={state:ke,subscribeKey(e,t){return qe(ke,e,t)},_getClient(){return ke._client},setClient(e){ke._client=Jr(e)},async connectWalletConnect(){if(M.isTelegram()||M.isSafari()&&M.isIos()){if(io){await io,io=void 0;return}if(!M.isPairingExpired(ke?.wcPairingExpiry)){let e=ke.wcUri;ke.wcUri=e;return}io=this._getClient()?.connectWalletConnect?.().catch(()=>{}),this.state.status="connecting",await io,io=void 0,ke.wcPairingExpiry=void 0,this.state.status="connected"}else await this._getClient()?.connectWalletConnect?.()},async connectExternal(e,t,r=!0){await this._getClient()?.connectExternal?.(e),r&&g.setActiveNamespace(t)},async reconnectExternal(e){await this._getClient()?.reconnectExternal?.(e);let t=e.chain||g.state.activeChain;t&&H.setConnectorId(e.id,t)},async setPreferredAccountType(e,t){de.setLoading(!0,g.state.activeChain);let r=H.getAuthConnector();r&&(J.setPreferredAccountType(e,t),await r.provider.setPreferredAccount(e),q.setPreferredAccountTypes(J.state.preferredAccountTypes??{[t]:e}),await this.reconnectExternal(r),de.setLoading(!1,g.state.activeChain),ce.sendEvent({type:"track",event:"SET_PREFERRED_ACCOUNT_TYPE",properties:{accountType:e,network:g.state.activeCaipNetwork?.caipNetworkId||""}}))},async signMessage(e){return this._getClient()?.signMessage(e)},parseUnits(e,t){return this._getClient()?.parseUnits(e,t)},formatUnits(e,t){return this._getClient()?.formatUnits(e,t)},async sendTransaction(e){return this._getClient()?.sendTransaction(e)},async getCapabilities(e){return this._getClient()?.getCapabilities(e)},async grantPermissions(e){return this._getClient()?.grantPermissions(e)},async walletGetAssets(e){return this._getClient()?.walletGetAssets(e)??{}},async estimateGas(e){return this._getClient()?.estimateGas(e)},async writeContract(e){return this._getClient()?.writeContract(e)},async getEnsAddress(e){return this._getClient()?.getEnsAddress(e)},async getEnsAvatar(e){return this._getClient()?.getEnsAvatar(e)},checkInstalled(e){return this._getClient()?.checkInstalled?.(e)||!1},resetWcConnection(){ke.wcUri=void 0,ke.wcPairingExpiry=void 0,ke.wcLinking=void 0,ke.recentWallet=void 0,ke.status="disconnected",sh.resetTransactions(),q.deleteWalletConnectDeepLink()},resetUri(){ke.wcUri=void 0,ke.wcPairingExpiry=void 0},finalizeWcConnection(){let{wcLinking:e,recentWallet:t}=Y.state;e&&q.setWalletConnectDeepLink(e),t&&q.setAppKitRecent(t),ce.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:e?"mobile":"qrcode",name:D.state.data?.wallet?.name||"Unknown"}})},setWcBasic(e){ke.wcBasic=e},setUri(e){ke.wcUri=e,ke.wcPairingExpiry=M.getPairingExpiry()},setWcLinking(e){ke.wcLinking=e},setWcError(e){ke.wcError=e,ke.buffering=!1},setRecentWallet(e){ke.recentWallet=e},setBuffering(e){ke.buffering=e},setStatus(e){ke.status=e},async disconnect(e){try{de.setLoading(!0,e),await mr.clearSessions(),await g.disconnect(e),de.setLoading(!1,e),H.setFilterByNamespace(void 0)}catch{throw new Error("Failed to disconnect")}}},so=xe({loading:!1,open:!1,selectedNetworkId:void 0,activeChain:void 0,initialized:!1}),Qt={state:so,subscribe(e){return je(so,()=>e(so))},subscribeOpen(e){return qe(so,"open",e)},set(e){Object.assign(so,{...so,...e})}};function ni(e,{strict:t=!0}={}){return!e||typeof e!="string"?!1:t?/^0x[0-9a-fA-F]*$/.test(e):e.startsWith("0x")}function yr(e){return ni(e,{strict:!1})?Math.ceil((e.length-2)/2):e.length}var F0="2.27.0",aa={getDocsUrl:({docsBaseUrl:e,docsPath:t="",docsSlug:r})=>t?`${e??"https://viem.sh"}${t}${r?`#${r}`:""}`:void 0,version:`viem@${F0}`},ue=class e extends Error{constructor(t,r={}){let o=r.cause instanceof e?r.cause.details:r.cause?.message?r.cause.message:r.details,n=r.cause instanceof e&&r.cause.docsPath||r.docsPath,i=aa.getDocsUrl?.({...r,docsPath:n}),s=[t||"An error occurred.","",...r.metaMessages?[...r.metaMessages,""]:[],...i?[`Docs: ${i}`]:[],...o?[`Details: ${o}`]:[],...aa.version?[`Version: ${aa.version}`]:[]].join(`
`);super(s,r.cause?{cause:r.cause}:void 0),Object.defineProperty(this,"details",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"docsPath",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"metaMessages",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"shortMessage",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"version",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"BaseError"}),this.details=o,this.docsPath=n,this.metaMessages=r.metaMessages,this.name=r.name??this.name,this.shortMessage=t,this.version=F0}walk(t){return V0(this,t)}};function V0(e,t){return t?.(e)?e:e&&typeof e=="object"&&"cause"in e&&e.cause!==void 0?V0(e.cause,t):t?null:e}var ms=class extends ue{constructor({offset:t,position:r,size:o}){super(`Slice ${r==="start"?"starting":"ending"} at offset "${t}" is out-of-bounds (size: ${o}).`,{name:"SliceOffsetOutOfBoundsError"})}},vs=class extends ue{constructor({size:t,targetSize:r,type:o}){super(`${o.charAt(0).toUpperCase()}${o.slice(1).toLowerCase()} size (${t}) exceeds padding size (${r}).`,{name:"SizeExceedsPaddingSizeError"})}};function Uo(e,{dir:t,size:r=32}={}){return typeof e=="string"?ah(e,{dir:t,size:r}):ch(e,{dir:t,size:r})}function ah(e,{dir:t,size:r=32}={}){if(r===null)return e;let o=e.replace("0x","");if(o.length>r*2)throw new vs({size:Math.ceil(o.length/2),targetSize:r,type:"hex"});return`0x${o[t==="right"?"padEnd":"padStart"](r*2,"0")}`}function ch(e,{dir:t,size:r=32}={}){if(r===null)return e;if(e.length>r)throw new vs({size:e.length,targetSize:r,type:"bytes"});let o=new Uint8Array(r);for(let n=0;n<r;n++){let i=t==="right";o[i?n:r-n-1]=e[i?n:e.length-n-1]}return o}var Ic=class extends ue{constructor({max:t,min:r,signed:o,size:n,value:i}){super(`Number "${i}" is not in safe ${n?`${n*8}-bit ${o?"signed":"unsigned"} `:""}integer range ${t?`(${r} to ${t})`:`(above ${r})`}`,{name:"IntegerOutOfRangeError"})}},Sc=class extends ue{constructor({givenSize:t,maxSize:r}){super(`Size cannot exceed ${r} bytes. Given size: ${t} bytes.`,{name:"SizeOverflowError"})}};function No(e,{dir:t="left"}={}){let r=typeof e=="string"?e.replace("0x",""):e,o=0;for(let n=0;n<r.length-1&&r[t==="left"?n:r.length-n-1].toString()==="0";n++)o++;return r=t==="left"?r.slice(o):r.slice(0,r.length-o),typeof e=="string"?(r.length===1&&t==="right"&&(r=`${r}0`),`0x${r.length%2===1?`0${r}`:r}`):r}function zo(e,{size:t}){if(yr(e)>t)throw new Sc({givenSize:yr(e),maxSize:t})}function Jt(e,t={}){let{signed:r}=t;t.size&&zo(e,{size:t.size});let o=BigInt(e);if(!r)return o;let n=(e.length-2)/2,i=(1n<<BigInt(n)*8n-1n)-1n;return o<=i?o:o-BigInt(`0x${"f".padStart(n*2,"f")}`)-1n}function bs(e,t={}){return Number(Jt(e,t))}var lh=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function oe(e,t={}){return typeof e=="number"||typeof e=="bigint"?Ve(e,t):typeof e=="string"?Z0(e,t):typeof e=="boolean"?dh(e,t):or(e,t)}function dh(e,t={}){let r=`0x${Number(e)}`;return typeof t.size=="number"?(zo(r,{size:t.size}),Uo(r,{size:t.size})):r}function or(e,t={}){let r="";for(let n=0;n<e.length;n++)r+=lh[e[n]];let o=`0x${r}`;return typeof t.size=="number"?(zo(o,{size:t.size}),Uo(o,{dir:"right",size:t.size})):o}function Ve(e,t={}){let{signed:r,size:o}=t,n=BigInt(e),i;o?r?i=(1n<<BigInt(o)*8n-1n)-1n:i=2n**(BigInt(o)*8n)-1n:typeof e=="number"&&(i=BigInt(Number.MAX_SAFE_INTEGER));let s=typeof i=="bigint"&&r?-i-1n:0;if(i&&n>i||n<s){let c=typeof e=="bigint"?"n":"";throw new Ic({max:i?`${i}${c}`:void 0,min:`${s}${c}`,signed:r,size:o,value:`${e}${c}`})}let a=`0x${(r&&n<0?(1n<<BigInt(o*8))+BigInt(n):n).toString(16)}`;return o?Uo(a,{size:o}):a}var uh=new TextEncoder;function Z0(e,t={}){let r=uh.encode(e);return or(r,t)}var hh=new TextEncoder;function q0(e,t={}){return typeof e=="number"||typeof e=="bigint"?gh(e,t):typeof e=="boolean"?ph(e,t):ni(e)?Xr(e,t):G0(e,t)}function ph(e,t={}){let r=new Uint8Array(1);return r[0]=Number(e),typeof t.size=="number"?(zo(r,{size:t.size}),Uo(r,{size:t.size})):r}var jt={zero:48,nine:57,A:65,F:70,a:97,f:102};function ud(e){if(e>=jt.zero&&e<=jt.nine)return e-jt.zero;if(e>=jt.A&&e<=jt.F)return e-(jt.A-10);if(e>=jt.a&&e<=jt.f)return e-(jt.a-10)}function Xr(e,t={}){let r=e;t.size&&(zo(r,{size:t.size}),r=Uo(r,{dir:"right",size:t.size}));let o=r.slice(2);o.length%2&&(o=`0${o}`);let n=o.length/2,i=new Uint8Array(n);for(let s=0,a=0;s<n;s++){let c=ud(o.charCodeAt(a++)),l=ud(o.charCodeAt(a++));if(c===void 0||l===void 0)throw new ue(`Invalid byte sequence ("${o[a-2]}${o[a-1]}" in "${o}").`);i[s]=c*16+l}return i}function gh(e,t){let r=Ve(e,t);return Xr(r)}function G0(e,t={}){let r=hh.encode(e);return typeof t.size=="number"?(zo(r,{size:t.size}),Uo(r,{dir:"right",size:t.size})):r}function ys(e){if(!Number.isSafeInteger(e)||e<0)throw new Error("positive integer expected, got "+e)}function fh(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function ii(e,...t){if(!fh(e))throw new Error("Uint8Array expected");if(t.length>0&&!t.includes(e.length))throw new Error("Uint8Array expected of length "+t+", got length="+e.length)}function wh(e){if(typeof e!="function"||typeof e.create!="function")throw new Error("Hash should be wrapped by utils.wrapConstructor");ys(e.outputLen),ys(e.blockLen)}function Io(e,t=!0){if(e.destroyed)throw new Error("Hash instance has been destroyed");if(t&&e.finished)throw new Error("Hash#digest() has already been called")}function K0(e,t){ii(e);let r=t.outputLen;if(e.length<r)throw new Error("digestInto() expects output buffer of length at least "+r)}var fi=BigInt(2**32-1),hd=BigInt(32);function mh(e,t=!1){return t?{h:Number(e&fi),l:Number(e>>hd&fi)}:{h:Number(e>>hd&fi)|0,l:Number(e&fi)|0}}function vh(e,t=!1){let r=new Uint32Array(e.length),o=new Uint32Array(e.length);for(let n=0;n<e.length;n++){let{h:i,l:s}=mh(e[n],t);[r[n],o[n]]=[i,s]}return[r,o]}var bh=(e,t,r)=>e<<r|t>>>32-r,yh=(e,t,r)=>t<<r|e>>>32-r,Ch=(e,t,r)=>t<<r-32|e>>>64-r,xh=(e,t,r)=>e<<r-32|t>>>64-r,ao=typeof globalThis=="object"&&"crypto"in globalThis?globalThis.crypto:void 0;function Eh(e){return new Uint32Array(e.buffer,e.byteOffset,Math.floor(e.byteLength/4))}function ca(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function _t(e,t){return e<<32-t|e>>>t}var pd=new Uint8Array(new Uint32Array([287454020]).buffer)[0]===68;function kh(e){return e<<24&4278190080|e<<8&16711680|e>>>8&65280|e>>>24&255}function gd(e){for(let t=0;t<e.length;t++)e[t]=kh(e[t])}function Ah(e){if(typeof e!="string")throw new Error("utf8ToBytes expected string, got "+typeof e);return new Uint8Array(new TextEncoder().encode(e))}function Vs(e){return typeof e=="string"&&(e=Ah(e)),ii(e),e}function Nh(...e){let t=0;for(let o=0;o<e.length;o++){let n=e[o];ii(n),t+=n.length}let r=new Uint8Array(t);for(let o=0,n=0;o<e.length;o++){let i=e[o];r.set(i,n),n+=i.length}return r}var In=class{clone(){return this._cloneInto()}};function Y0(e){let t=o=>e().update(Vs(o)).digest(),r=e();return t.outputLen=r.outputLen,t.blockLen=r.blockLen,t.create=()=>e(),t}function Ih(e=32){if(ao&&typeof ao.getRandomValues=="function")return ao.getRandomValues(new Uint8Array(e));if(ao&&typeof ao.randomBytes=="function")return ao.randomBytes(e);throw new Error("crypto.getRandomValues must be defined")}var J0=[],X0=[],Q0=[],Sh=BigInt(0),Vo=BigInt(1),_h=BigInt(2),Oh=BigInt(7),Th=BigInt(256),Ph=BigInt(113);for(let e=0,t=Vo,r=1,o=0;e<24;e++){[r,o]=[o,(2*r+3*o)%5],J0.push(2*(5*o+r)),X0.push((e+1)*(e+2)/2%64);let n=Sh;for(let i=0;i<7;i++)t=(t<<Vo^(t>>Oh)*Ph)%Th,t&_h&&(n^=Vo<<(Vo<<BigInt(i))-Vo);Q0.push(n)}var[Rh,$h]=vh(Q0,!0),fd=(e,t,r)=>r>32?Ch(e,t,r):bh(e,t,r),wd=(e,t,r)=>r>32?xh(e,t,r):yh(e,t,r);function Lh(e,t=24){let r=new Uint32Array(10);for(let o=24-t;o<24;o++){for(let s=0;s<10;s++)r[s]=e[s]^e[s+10]^e[s+20]^e[s+30]^e[s+40];for(let s=0;s<10;s+=2){let a=(s+8)%10,c=(s+2)%10,l=r[c],d=r[c+1],u=fd(l,d,1)^r[a],h=wd(l,d,1)^r[a+1];for(let p=0;p<50;p+=10)e[s+p]^=u,e[s+p+1]^=h}let n=e[2],i=e[3];for(let s=0;s<24;s++){let a=X0[s],c=fd(n,i,a),l=wd(n,i,a),d=J0[s];n=e[d],i=e[d+1],e[d]=c,e[d+1]=l}for(let s=0;s<50;s+=10){for(let a=0;a<10;a++)r[a]=e[s+a];for(let a=0;a<10;a++)e[s+a]^=~r[(a+2)%10]&r[(a+4)%10]}e[0]^=Rh[o],e[1]^=$h[o]}r.fill(0)}var _c=class e extends In{constructor(t,r,o,n=!1,i=24){if(super(),this.blockLen=t,this.suffix=r,this.outputLen=o,this.enableXOF=n,this.rounds=i,this.pos=0,this.posOut=0,this.finished=!1,this.destroyed=!1,ys(o),0>=this.blockLen||this.blockLen>=200)throw new Error("Sha3 supports only keccak-f1600 function");this.state=new Uint8Array(200),this.state32=Eh(this.state)}keccak(){pd||gd(this.state32),Lh(this.state32,this.rounds),pd||gd(this.state32),this.posOut=0,this.pos=0}update(t){Io(this);let{blockLen:r,state:o}=this;t=Vs(t);let n=t.length;for(let i=0;i<n;){let s=Math.min(r-this.pos,n-i);for(let a=0;a<s;a++)o[this.pos++]^=t[i++];this.pos===r&&this.keccak()}return this}finish(){if(this.finished)return;this.finished=!0;let{state:t,suffix:r,pos:o,blockLen:n}=this;t[o]^=r,(r&128)!==0&&o===n-1&&this.keccak(),t[n-1]^=128,this.keccak()}writeInto(t){Io(this,!1),ii(t),this.finish();let r=this.state,{blockLen:o}=this;for(let n=0,i=t.length;n<i;){this.posOut>=o&&this.keccak();let s=Math.min(o-this.posOut,i-n);t.set(r.subarray(this.posOut,this.posOut+s),n),this.posOut+=s,n+=s}return t}xofInto(t){if(!this.enableXOF)throw new Error("XOF is not possible for this instance");return this.writeInto(t)}xof(t){return ys(t),this.xofInto(new Uint8Array(t))}digestInto(t){if(K0(t,this),this.finished)throw new Error("digest() was already called");return this.writeInto(t),this.destroy(),t}digest(){return this.digestInto(new Uint8Array(this.outputLen))}destroy(){this.destroyed=!0,this.state.fill(0)}_cloneInto(t){let{blockLen:r,suffix:o,outputLen:n,rounds:i,enableXOF:s}=this;return t||(t=new e(r,o,n,s,i)),t.state32.set(this.state32),t.pos=this.pos,t.posOut=this.posOut,t.finished=this.finished,t.rounds=i,t.suffix=o,t.outputLen=n,t.enableXOF=s,t.destroyed=this.destroyed,t}},Bh=(e,t,r)=>Y0(()=>new _c(t,e,r)),eu=Bh(1,136,256/8);function Mh(e,t){let r=t||"hex",o=eu(ni(e,{strict:!1})?q0(e):e);return r==="bytes"?o:oe(o)}var Ut=class extends ue{constructor({address:t}){super(`Address "${t}" is invalid.`,{metaMessages:["- Address must be a hex value of 20 bytes (40 hex characters).","- Address must match its checksum counterpart."],name:"InvalidAddressError"})}},So=class extends Map{constructor(t){super(),Object.defineProperty(this,"maxSize",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.maxSize=t}get(t){let r=super.get(t);return super.has(t)&&r!==void 0&&(this.delete(t),super.set(t,r)),r}set(t,r){if(super.set(t,r),this.maxSize&&this.size>this.maxSize){let o=this.keys().next().value;o&&this.delete(o)}return this}},la=new So(8192);function Uh(e,t){if(la.has(`${e}.${t}`))return la.get(`${e}.${t}`);let r=t?`${t}${e.toLowerCase()}`:e.substring(2).toLowerCase(),o=Mh(G0(r),"bytes"),n=(t?r.substring(`${t}0x`.length):r).split("");for(let s=0;s<40;s+=2)o[s>>1]>>4>=8&&n[s]&&(n[s]=n[s].toUpperCase()),(o[s>>1]&15)>=8&&n[s+1]&&(n[s+1]=n[s+1].toUpperCase());let i=`0x${n.join("")}`;return la.set(`${e}.${t}`,i),i}var zh=/^0x[a-fA-F0-9]{40}$/,da=new So(8192);function tr(e,t){let{strict:r=!0}=t??{},o=`${e}.${r}`;if(da.has(o))return da.get(o);let n=zh.test(e)?e.toLowerCase()===e?!0:r?Uh(e)===e:!0:!1;return da.set(o,n),n}function Do(e){return`0x${e.reduce((t,r)=>t+r.replace("0x",""),"")}`}function Dh(e,t,r,{strict:o}={}){return ni(e,{strict:!1})?Wh(e,t,r,{strict:o}):jh(e,t,r,{strict:o})}function tu(e,t){if(typeof t=="number"&&t>0&&t>yr(e)-1)throw new ms({offset:t,position:"start",size:yr(e)})}function ru(e,t,r){if(typeof t=="number"&&typeof r=="number"&&yr(e)!==r-t)throw new ms({offset:r,position:"end",size:yr(e)})}function jh(e,t,r,{strict:o}={}){tu(e,t);let n=e.slice(t,r);return o&&ru(n,t,r),n}function Wh(e,t,r,{strict:o}={}){tu(e,t);let n=`0x${e.replace("0x","").slice((t??0)*2,(r??e.length)*2)}`;return o&&ru(n,t,r),n}var Cs=class extends ue{constructor({offset:t}){super(`Offset \`${t}\` cannot be negative.`,{name:"NegativeOffsetError"})}},Oc=class extends ue{constructor({length:t,position:r}){super(`Position \`${r}\` is out of bounds (\`0 < position < ${t}\`).`,{name:"PositionOutOfBoundsError"})}},Tc=class extends ue{constructor({count:t,limit:r}){super(`Recursive read limit of \`${r}\` exceeded (recursive read count: \`${t}\`).`,{name:"RecursiveReadLimitExceededError"})}},Hh={bytes:new Uint8Array,dataView:new DataView(new ArrayBuffer(0)),position:0,positionReadCount:new Map,recursiveReadCount:0,recursiveReadLimit:Number.POSITIVE_INFINITY,assertReadLimit(){if(this.recursiveReadCount>=this.recursiveReadLimit)throw new Tc({count:this.recursiveReadCount+1,limit:this.recursiveReadLimit})},assertPosition(e){if(e<0||e>this.bytes.length-1)throw new Oc({length:this.bytes.length,position:e})},decrementPosition(e){if(e<0)throw new Cs({offset:e});let t=this.position-e;this.assertPosition(t),this.position=t},getReadCount(e){return this.positionReadCount.get(e||this.position)||0},incrementPosition(e){if(e<0)throw new Cs({offset:e});let t=this.position+e;this.assertPosition(t),this.position=t},inspectByte(e){let t=e??this.position;return this.assertPosition(t),this.bytes[t]},inspectBytes(e,t){let r=t??this.position;return this.assertPosition(r+e-1),this.bytes.subarray(r,r+e)},inspectUint8(e){let t=e??this.position;return this.assertPosition(t),this.bytes[t]},inspectUint16(e){let t=e??this.position;return this.assertPosition(t+1),this.dataView.getUint16(t)},inspectUint24(e){let t=e??this.position;return this.assertPosition(t+2),(this.dataView.getUint16(t)<<8)+this.dataView.getUint8(t+2)},inspectUint32(e){let t=e??this.position;return this.assertPosition(t+3),this.dataView.getUint32(t)},pushByte(e){this.assertPosition(this.position),this.bytes[this.position]=e,this.position++},pushBytes(e){this.assertPosition(this.position+e.length-1),this.bytes.set(e,this.position),this.position+=e.length},pushUint8(e){this.assertPosition(this.position),this.bytes[this.position]=e,this.position++},pushUint16(e){this.assertPosition(this.position+1),this.dataView.setUint16(this.position,e),this.position+=2},pushUint24(e){this.assertPosition(this.position+2),this.dataView.setUint16(this.position,e>>8),this.dataView.setUint8(this.position+2,e&255),this.position+=3},pushUint32(e){this.assertPosition(this.position+3),this.dataView.setUint32(this.position,e),this.position+=4},readByte(){this.assertReadLimit(),this._touch();let e=this.inspectByte();return this.position++,e},readBytes(e,t){this.assertReadLimit(),this._touch();let r=this.inspectBytes(e);return this.position+=t??e,r},readUint8(){this.assertReadLimit(),this._touch();let e=this.inspectUint8();return this.position+=1,e},readUint16(){this.assertReadLimit(),this._touch();let e=this.inspectUint16();return this.position+=2,e},readUint24(){this.assertReadLimit(),this._touch();let e=this.inspectUint24();return this.position+=3,e},readUint32(){this.assertReadLimit(),this._touch();let e=this.inspectUint32();return this.position+=4,e},get remaining(){return this.bytes.length-this.position},setPosition(e){let t=this.position;return this.assertPosition(e),this.position=e,()=>this.position=t},_touch(){if(this.recursiveReadLimit===Number.POSITIVE_INFINITY)return;let e=this.getReadCount();this.positionReadCount.set(this.position,e+1),e>0&&this.recursiveReadCount++}};function ou(e,{recursiveReadLimit:t=8192}={}){let r=Object.create(Hh);return r.bytes=e,r.dataView=new DataView(e.buffer,e.byteOffset,e.byteLength),r.positionReadCount=new Map,r.recursiveReadLimit=t,r}var Zr=(e,t,r)=>JSON.stringify(e,(o,n)=>{let i=typeof n=="bigint"?n.toString():n;return typeof t=="function"?t(o,i):i},r),Fh={ether:-9,wei:9};function nu(e,t){let r=e.toString(),o=r.startsWith("-");o&&(r=r.slice(1)),r=r.padStart(t,"0");let[n,i]=[r.slice(0,r.length-t),r.slice(r.length-t)];return i=i.replace(/(0+)$/,""),`${o?"-":""}${n||"0"}${i?`.${i}`:""}`}function Pc(e,t="wei"){return nu(e,Fh[t])}function Vh(e){let t=Object.entries(e).map(([o,n])=>n===void 0||n===!1?null:[o,n]).filter(Boolean),r=t.reduce((o,[n])=>Math.max(o,n.length),0);return t.map(([o,n])=>`  ${`${o}:`.padEnd(r+1)}  ${n}`).join(`
`)}var Rc=class extends ue{constructor({v:t}){super(`Invalid \`v\` value "${t}". Expected 27 or 28.`,{name:"InvalidLegacyVError"})}},$c=class extends ue{constructor({transaction:t}){super("Cannot infer a transaction type from provided transaction.",{metaMessages:["Provided Transaction:","{",Vh(t),"}","","To infer the type, either provide:","- a `type` to the Transaction, or","- an EIP-1559 Transaction with `maxFeePerGas`, or","- an EIP-2930 Transaction with `gasPrice` & `accessList`, or","- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or","- an EIP-7702 Transaction with `authorizationList`, or","- a Legacy Transaction with `gasPrice`"],name:"InvalidSerializableTransactionError"})}},Lc=class extends ue{constructor({storageKey:t}){super(`Size for storage key "${t}" is invalid. Expected 32 bytes. Got ${Math.floor((t.length-2)/2)} bytes.`,{name:"InvalidStorageKeySizeError"})}},$l=e=>e,qr=class extends ue{constructor({body:t,cause:r,details:o,headers:n,status:i,url:s}){super("HTTP request failed.",{cause:r,details:o,metaMessages:[i&&`Status: ${i}`,`URL: ${$l(s)}`,t&&`Request body: ${Zr(t)}`].filter(Boolean),name:"HttpRequestError"}),Object.defineProperty(this,"body",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"headers",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"status",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"url",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.body=t,this.headers=n,this.status=i,this.url=s}},xs=class extends ue{constructor({body:t,error:r,url:o}){super("RPC Request failed.",{cause:r,details:r.message,metaMessages:[`URL: ${$l(o)}`,`Request body: ${Zr(t)}`],name:"RpcRequestError"}),Object.defineProperty(this,"code",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"data",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.code=r.code,this.data=r.data}},Es=class extends ue{constructor({body:t,url:r}){super("The request took too long to respond.",{details:"The request timed out.",metaMessages:[`URL: ${$l(r)}`,`Request body: ${Zr(t)}`],name:"TimeoutError"})}},Zh=-1,We=class extends ue{constructor(t,{code:r,docsPath:o,metaMessages:n,name:i,shortMessage:s}){super(s,{cause:t,docsPath:o,metaMessages:n||t?.metaMessages,name:i||"RpcError"}),Object.defineProperty(this,"code",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.name=i||t.name,this.code=t instanceof xs?t.code:r??Zh}},Ze=class extends We{constructor(t,r){super(t,r),Object.defineProperty(this,"data",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.data=r.data}},Sn=class e extends We{constructor(t){super(t,{code:e.code,name:"ParseRpcError",shortMessage:"Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."})}};Object.defineProperty(Sn,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32700});var _n=class e extends We{constructor(t){super(t,{code:e.code,name:"InvalidRequestRpcError",shortMessage:"JSON is not a valid request object."})}};Object.defineProperty(_n,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32600});var On=class e extends We{constructor(t,{method:r}={}){super(t,{code:e.code,name:"MethodNotFoundRpcError",shortMessage:`The method${r?` "${r}"`:""} does not exist / is not available.`})}};Object.defineProperty(On,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32601});var Tn=class e extends We{constructor(t){super(t,{code:e.code,name:"InvalidParamsRpcError",shortMessage:["Invalid parameters were provided to the RPC method.","Double check you have provided the correct parameters."].join(`
`)})}};Object.defineProperty(Tn,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32602});var _o=class e extends We{constructor(t){super(t,{code:e.code,name:"InternalRpcError",shortMessage:"An internal error was received."})}};Object.defineProperty(_o,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32603});var Pn=class e extends We{constructor(t){super(t,{code:e.code,name:"InvalidInputRpcError",shortMessage:["Missing or invalid parameters.","Double check you have provided the correct parameters."].join(`
`)})}};Object.defineProperty(Pn,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32e3});var Rn=class e extends We{constructor(t){super(t,{code:e.code,name:"ResourceNotFoundRpcError",shortMessage:"Requested resource not found."}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"ResourceNotFoundRpcError"})}};Object.defineProperty(Rn,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32001});var $n=class e extends We{constructor(t){super(t,{code:e.code,name:"ResourceUnavailableRpcError",shortMessage:"Requested resource not available."})}};Object.defineProperty($n,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32002});var Oo=class e extends We{constructor(t){super(t,{code:e.code,name:"TransactionRejectedRpcError",shortMessage:"Transaction creation failed."})}};Object.defineProperty(Oo,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32003});var Hr=class e extends We{constructor(t,{method:r}={}){super(t,{code:e.code,name:"MethodNotSupportedRpcError",shortMessage:`Method${r?` "${r}"`:""} is not supported.`})}};Object.defineProperty(Hr,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32004});var To=class e extends We{constructor(t){super(t,{code:e.code,name:"LimitExceededRpcError",shortMessage:"Request exceeds defined limit."})}};Object.defineProperty(To,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32005});var Ln=class e extends We{constructor(t){super(t,{code:e.code,name:"JsonRpcVersionUnsupportedError",shortMessage:"Version of JSON-RPC protocol is not supported."})}};Object.defineProperty(Ln,"code",{enumerable:!0,configurable:!0,writable:!0,value:-32006});var Gr=class e extends Ze{constructor(t){super(t,{code:e.code,name:"UserRejectedRequestError",shortMessage:"User rejected the request."})}};Object.defineProperty(Gr,"code",{enumerable:!0,configurable:!0,writable:!0,value:4001});var Bn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"UnauthorizedProviderError",shortMessage:"The requested method and/or account has not been authorized by the user."})}};Object.defineProperty(Bn,"code",{enumerable:!0,configurable:!0,writable:!0,value:4100});var Mn=class e extends Ze{constructor(t,{method:r}={}){super(t,{code:e.code,name:"UnsupportedProviderMethodError",shortMessage:`The Provider does not support the requested method${r?` " ${r}"`:""}.`})}};Object.defineProperty(Mn,"code",{enumerable:!0,configurable:!0,writable:!0,value:4200});var Un=class e extends Ze{constructor(t){super(t,{code:e.code,name:"ProviderDisconnectedError",shortMessage:"The Provider is disconnected from all chains."})}};Object.defineProperty(Un,"code",{enumerable:!0,configurable:!0,writable:!0,value:4900});var zn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"ChainDisconnectedError",shortMessage:"The Provider is not connected to the requested chain."})}};Object.defineProperty(zn,"code",{enumerable:!0,configurable:!0,writable:!0,value:4901});var Dn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"SwitchChainError",shortMessage:"An error occurred when attempting to switch chain."})}};Object.defineProperty(Dn,"code",{enumerable:!0,configurable:!0,writable:!0,value:4902});var jn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"UnsupportedNonOptionalCapabilityError",shortMessage:"This Wallet does not support a capability that was not marked as optional."})}};Object.defineProperty(jn,"code",{enumerable:!0,configurable:!0,writable:!0,value:5700});var Wn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"UnsupportedChainIdError",shortMessage:"This Wallet does not support the requested chain ID."})}};Object.defineProperty(Wn,"code",{enumerable:!0,configurable:!0,writable:!0,value:5710});var Hn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"DuplicateIdError",shortMessage:"There is already a bundle submitted with this ID."})}};Object.defineProperty(Hn,"code",{enumerable:!0,configurable:!0,writable:!0,value:5720});var Fn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"UnknownBundleIdError",shortMessage:"This bundle id is unknown / has not been submitted"})}};Object.defineProperty(Fn,"code",{enumerable:!0,configurable:!0,writable:!0,value:5730});var Vn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"BundleTooLargeError",shortMessage:"The call bundle is too large for the Wallet to process."})}};Object.defineProperty(Vn,"code",{enumerable:!0,configurable:!0,writable:!0,value:5740});var Zn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"AtomicReadyWalletRejectedUpgradeError",shortMessage:"The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."})}};Object.defineProperty(Zn,"code",{enumerable:!0,configurable:!0,writable:!0,value:5750});var qn=class e extends Ze{constructor(t){super(t,{code:e.code,name:"AtomicityNotSupportedError",shortMessage:"The wallet does not support atomic execution but the request requires it."})}};Object.defineProperty(qn,"code",{enumerable:!0,configurable:!0,writable:!0,value:5760});var Bc=class extends We{constructor(t){super(t,{name:"UnknownRpcError",shortMessage:"An unknown RPC error occurred."})}};function no(e,t="hex"){let r=iu(e),o=ou(new Uint8Array(r.length));return r.encode(o),t==="hex"?or(o.bytes):o.bytes}function iu(e){return Array.isArray(e)?qh(e.map(t=>iu(t))):Gh(e)}function qh(e){let t=e.reduce((o,n)=>o+n.length,0),r=su(t);return{length:t<=55?1+t:1+r+t,encode(o){t<=55?o.pushByte(192+t):(o.pushByte(247+r),r===1?o.pushUint8(t):r===2?o.pushUint16(t):r===3?o.pushUint24(t):o.pushUint32(t));for(let{encode:n}of e)n(o)}}}function Gh(e){let t=typeof e=="string"?Xr(e):e,r=su(t.length);return{length:t.length===1&&t[0]<128?1:t.length<=55?1+t.length:1+r+t.length,encode(o){t.length===1&&t[0]<128?o.pushBytes(t):t.length<=55?(o.pushByte(128+t.length),o.pushBytes(t)):(o.pushByte(183+r),r===1?o.pushUint8(t.length):r===2?o.pushUint16(t.length):r===3?o.pushUint24(t.length):o.pushUint32(t.length),o.pushBytes(t))}}}function su(e){if(e<2**8)return 1;if(e<2**16)return 2;if(e<2**24)return 3;if(e<2**32)return 4;throw new ue("Length is too large.")}var Gn=class extends ue{constructor({cause:t,message:r}={}){let o=r?.replace("execution reverted: ","")?.replace("execution reverted","");super(`Execution reverted ${o?`with reason: ${o}`:"for an unknown reason"}.`,{cause:t,name:"ExecutionRevertedError"})}};Object.defineProperty(Gn,"code",{enumerable:!0,configurable:!0,writable:!0,value:3}),Object.defineProperty(Gn,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/execution reverted/});var Qr=class extends ue{constructor({cause:t,maxFeePerGas:r}={}){super(`The fee cap (\`maxFeePerGas\`${r?` = ${Pc(r)} gwei`:""}) cannot be higher than the maximum allowed value (2^256-1).`,{cause:t,name:"FeeCapTooHighError"})}};Object.defineProperty(Qr,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/});var Kn=class extends ue{constructor({cause:t,maxPriorityFeePerGas:r,maxFeePerGas:o}={}){super([`The provided tip (\`maxPriorityFeePerGas\`${r?` = ${Pc(r)} gwei`:""}) cannot be higher than the fee cap (\`maxFeePerGas\`${o?` = ${Pc(o)} gwei`:""}).`].join(`
`),{cause:t,name:"TipAboveFeeCapError"})}};Object.defineProperty(Kn,"nodeMessage",{enumerable:!0,configurable:!0,writable:!0,value:/max priority fee per gas higher than max fee per gas|tip higher than fee cap/});function Zs(e,t){return({exclude:r,format:o})=>({exclude:r,format:n=>{let i=t(n);if(r)for(let s of r)delete i[s];return{...i,...o(n)}},type:e})}var Kh={legacy:"0x0",eip2930:"0x1",eip1559:"0x2",eip4844:"0x3",eip7702:"0x4"};function Yh(e){let t={};return typeof e.authorizationList<"u"&&(t.authorizationList=Xh(e.authorizationList)),typeof e.accessList<"u"&&(t.accessList=e.accessList),typeof e.blobVersionedHashes<"u"&&(t.blobVersionedHashes=e.blobVersionedHashes),typeof e.blobs<"u"&&(typeof e.blobs[0]!="string"?t.blobs=e.blobs.map(r=>or(r)):t.blobs=e.blobs),typeof e.data<"u"&&(t.data=e.data),typeof e.from<"u"&&(t.from=e.from),typeof e.gas<"u"&&(t.gas=Ve(e.gas)),typeof e.gasPrice<"u"&&(t.gasPrice=Ve(e.gasPrice)),typeof e.maxFeePerBlobGas<"u"&&(t.maxFeePerBlobGas=Ve(e.maxFeePerBlobGas)),typeof e.maxFeePerGas<"u"&&(t.maxFeePerGas=Ve(e.maxFeePerGas)),typeof e.maxPriorityFeePerGas<"u"&&(t.maxPriorityFeePerGas=Ve(e.maxPriorityFeePerGas)),typeof e.nonce<"u"&&(t.nonce=Ve(e.nonce)),typeof e.to<"u"&&(t.to=e.to),typeof e.type<"u"&&(t.type=Kh[e.type]),typeof e.value<"u"&&(t.value=Ve(e.value)),t}var Jh=Zs("transactionRequest",Yh);function Xh(e){return e.map(t=>({address:t.address,r:t.r?Ve(BigInt(t.r)):t.r,s:t.s?Ve(BigInt(t.s)):t.s,chainId:Ve(t.chainId),nonce:Ve(t.nonce),...typeof t.yParity<"u"?{yParity:Ve(t.yParity)}:{},...typeof t.v<"u"&&typeof t.yParity>"u"?{v:Ve(t.v)}:{}}))}var qs=2n**256n-1n,au={"0x0":"legacy","0x1":"eip2930","0x2":"eip1559","0x3":"eip4844","0x4":"eip7702"};function Gs(e){let t={...e,blockHash:e.blockHash?e.blockHash:null,blockNumber:e.blockNumber?BigInt(e.blockNumber):null,chainId:e.chainId?bs(e.chainId):void 0,gas:e.gas?BigInt(e.gas):void 0,gasPrice:e.gasPrice?BigInt(e.gasPrice):void 0,maxFeePerBlobGas:e.maxFeePerBlobGas?BigInt(e.maxFeePerBlobGas):void 0,maxFeePerGas:e.maxFeePerGas?BigInt(e.maxFeePerGas):void 0,maxPriorityFeePerGas:e.maxPriorityFeePerGas?BigInt(e.maxPriorityFeePerGas):void 0,nonce:e.nonce?bs(e.nonce):void 0,to:e.to?e.to:null,transactionIndex:e.transactionIndex?Number(e.transactionIndex):null,type:e.type?au[e.type]:void 0,typeHex:e.type?e.type:void 0,value:e.value?BigInt(e.value):void 0,v:e.v?BigInt(e.v):void 0};return e.authorizationList&&(t.authorizationList=Qh(e.authorizationList)),t.yParity=(()=>{if(e.yParity)return Number(e.yParity);if(typeof t.v=="bigint"){if(t.v===0n||t.v===27n)return 0;if(t.v===1n||t.v===28n)return 1;if(t.v>=35n)return t.v%2n===0n?1:0}})(),t.type==="legacy"&&(delete t.accessList,delete t.maxFeePerBlobGas,delete t.maxFeePerGas,delete t.maxPriorityFeePerGas,delete t.yParity),t.type==="eip2930"&&(delete t.maxFeePerBlobGas,delete t.maxFeePerGas,delete t.maxPriorityFeePerGas),t.type==="eip1559"&&delete t.maxFeePerBlobGas,t}var cu=Zs("transaction",Gs);function Qh(e){return e.map(t=>({address:t.address,chainId:Number(t.chainId),nonce:Number(t.nonce),r:t.r,s:t.s,yParity:Number(t.yParity)}))}function ep(e){let t=(e.transactions??[]).map(r=>typeof r=="string"?r:Gs(r));return{...e,baseFeePerGas:e.baseFeePerGas?BigInt(e.baseFeePerGas):null,blobGasUsed:e.blobGasUsed?BigInt(e.blobGasUsed):void 0,difficulty:e.difficulty?BigInt(e.difficulty):void 0,excessBlobGas:e.excessBlobGas?BigInt(e.excessBlobGas):void 0,gasLimit:e.gasLimit?BigInt(e.gasLimit):void 0,gasUsed:e.gasUsed?BigInt(e.gasUsed):void 0,hash:e.hash?e.hash:null,logsBloom:e.logsBloom?e.logsBloom:null,nonce:e.nonce?e.nonce:null,number:e.number?BigInt(e.number):null,size:e.size?BigInt(e.size):void 0,timestamp:e.timestamp?BigInt(e.timestamp):void 0,transactions:t,totalDifficulty:e.totalDifficulty?BigInt(e.totalDifficulty):null}}var lu=Zs("block",ep);function du(e){let{kzg:t}=e,r=e.to??(typeof e.blobs[0]=="string"?"hex":"bytes"),o=typeof e.blobs[0]=="string"?e.blobs.map(i=>Xr(i)):e.blobs,n=[];for(let i of o)n.push(Uint8Array.from(t.blobToKzgCommitment(i)));return r==="bytes"?n:n.map(i=>or(i))}function uu(e){let{kzg:t}=e,r=e.to??(typeof e.blobs[0]=="string"?"hex":"bytes"),o=typeof e.blobs[0]=="string"?e.blobs.map(s=>Xr(s)):e.blobs,n=typeof e.commitments[0]=="string"?e.commitments.map(s=>Xr(s)):e.commitments,i=[];for(let s=0;s<o.length;s++){let a=o[s],c=n[s];i.push(Uint8Array.from(t.computeBlobKzgProof(a,c)))}return r==="bytes"?i:i.map(s=>or(s))}function tp(e,t,r,o){if(typeof e.setBigUint64=="function")return e.setBigUint64(t,r,o);let n=BigInt(32),i=BigInt(4294967295),s=Number(r>>n&i),a=Number(r&i),c=o?4:0,l=o?0:4;e.setUint32(t+c,s,o),e.setUint32(t+l,a,o)}function rp(e,t,r){return e&t^~e&r}function op(e,t,r){return e&t^e&r^t&r}var Mc=class extends In{constructor(t,r,o,n){super(),this.blockLen=t,this.outputLen=r,this.padOffset=o,this.isLE=n,this.finished=!1,this.length=0,this.pos=0,this.destroyed=!1,this.buffer=new Uint8Array(t),this.view=ca(this.buffer)}update(t){Io(this);let{view:r,buffer:o,blockLen:n}=this;t=Vs(t);let i=t.length;for(let s=0;s<i;){let a=Math.min(n-this.pos,i-s);if(a===n){let c=ca(t);for(;n<=i-s;s+=n)this.process(c,s);continue}o.set(t.subarray(s,s+a),this.pos),this.pos+=a,s+=a,this.pos===n&&(this.process(r,0),this.pos=0)}return this.length+=t.length,this.roundClean(),this}digestInto(t){Io(this),K0(t,this),this.finished=!0;let{buffer:r,view:o,blockLen:n,isLE:i}=this,{pos:s}=this;r[s++]=128,this.buffer.subarray(s).fill(0),this.padOffset>n-s&&(this.process(o,0),s=0);for(let u=s;u<n;u++)r[u]=0;tp(o,n-8,BigInt(this.length*8),i),this.process(o,0);let a=ca(t),c=this.outputLen;if(c%4)throw new Error("_sha2: outputLen should be aligned to 32bit");let l=c/4,d=this.get();if(l>d.length)throw new Error("_sha2: outputLen bigger than state");for(let u=0;u<l;u++)a.setUint32(4*u,d[u],i)}digest(){let{buffer:t,outputLen:r}=this;this.digestInto(t);let o=t.slice(0,r);return this.destroy(),o}_cloneInto(t){t||(t=new this.constructor),t.set(...this.get());let{blockLen:r,buffer:o,length:n,finished:i,destroyed:s,pos:a}=this;return t.length=n,t.pos=a,t.finished=i,t.destroyed=s,n%r&&t.buffer.set(o),t}},np=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),sr=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),ar=new Uint32Array(64),Uc=class extends Mc{constructor(){super(64,32,8,!1),this.A=sr[0]|0,this.B=sr[1]|0,this.C=sr[2]|0,this.D=sr[3]|0,this.E=sr[4]|0,this.F=sr[5]|0,this.G=sr[6]|0,this.H=sr[7]|0}get(){let{A:t,B:r,C:o,D:n,E:i,F:s,G:a,H:c}=this;return[t,r,o,n,i,s,a,c]}set(t,r,o,n,i,s,a,c){this.A=t|0,this.B=r|0,this.C=o|0,this.D=n|0,this.E=i|0,this.F=s|0,this.G=a|0,this.H=c|0}process(t,r){for(let u=0;u<16;u++,r+=4)ar[u]=t.getUint32(r,!1);for(let u=16;u<64;u++){let h=ar[u-15],p=ar[u-2],w=_t(h,7)^_t(h,18)^h>>>3,b=_t(p,17)^_t(p,19)^p>>>10;ar[u]=b+ar[u-7]+w+ar[u-16]|0}let{A:o,B:n,C:i,D:s,E:a,F:c,G:l,H:d}=this;for(let u=0;u<64;u++){let h=_t(a,6)^_t(a,11)^_t(a,25),p=d+h+rp(a,c,l)+np[u]+ar[u]|0,w=(_t(o,2)^_t(o,13)^_t(o,22))+op(o,n,i)|0;d=l,l=c,c=a,a=s+p|0,s=i,i=n,n=o,o=p+w|0}o=o+this.A|0,n=n+this.B|0,i=i+this.C|0,s=s+this.D|0,a=a+this.E|0,c=c+this.F|0,l=l+this.G|0,d=d+this.H|0,this.set(o,n,i,s,a,c,l,d)}roundClean(){ar.fill(0)}destroy(){this.set(0,0,0,0,0,0,0,0),this.buffer.fill(0)}},hu=Y0(()=>new Uc);function ip(e,t){let r=t||"hex",o=hu(ni(e,{strict:!1})?q0(e):e);return r==="bytes"?o:oe(o)}function sp(e){let{commitment:t,version:r=1}=e,o=e.to??(typeof t=="string"?"hex":"bytes"),n=ip(t,"bytes");return n.set([r],0),o==="bytes"?n:or(n)}function ap(e){let{commitments:t,version:r}=e,o=e.to??(typeof t[0]=="string"?"hex":"bytes"),n=[];for(let i of t)n.push(sp({commitment:i,to:o,version:r}));return n}var md=6,pu=32,Ll=4096,gu=pu*Ll,vd=gu*md-1-1*Ll*md,fu=1,zc=class extends ue{constructor({maxSize:t,size:r}){super("Blob size is too large.",{metaMessages:[`Max: ${t} bytes`,`Given: ${r} bytes`],name:"BlobSizeTooLargeError"})}},ks=class extends ue{constructor(){super("Blob data must not be empty.",{name:"EmptyBlobError"})}},Dc=class extends ue{constructor({hash:t,size:r}){super(`Versioned hash "${t}" size is invalid.`,{metaMessages:["Expected: 32",`Received: ${r}`],name:"InvalidVersionedHashSizeError"})}},jc=class extends ue{constructor({hash:t,version:r}){super(`Versioned hash "${t}" version is invalid.`,{metaMessages:[`Expected: ${fu}`,`Received: ${r}`],name:"InvalidVersionedHashVersionError"})}};function cp(e){let t=e.to??(typeof e.data=="string"?"hex":"bytes"),r=typeof e.data=="string"?Xr(e.data):e.data,o=yr(r);if(!o)throw new ks;if(o>vd)throw new zc({maxSize:vd,size:o});let n=[],i=!0,s=0;for(;i;){let a=ou(new Uint8Array(gu)),c=0;for(;c<Ll;){let l=r.slice(s,s+(pu-1));if(a.pushByte(0),a.pushBytes(l),l.length<31){a.pushByte(128),i=!1;break}c++,s+=31}n.push(a)}return t==="bytes"?n.map(a=>a.bytes):n.map(a=>or(a.bytes))}function lp(e){let{data:t,kzg:r,to:o}=e,n=e.blobs??cp({data:t,to:o}),i=e.commitments??du({blobs:n,kzg:r,to:o}),s=e.proofs??uu({blobs:n,commitments:i,kzg:r,to:o}),a=[];for(let c=0;c<n.length;c++)a.push({blob:n[c],commitment:i[c],proof:s[c]});return a}function dp(e){if(e.type)return e.type;if(typeof e.authorizationList<"u")return"eip7702";if(typeof e.blobs<"u"||typeof e.blobVersionedHashes<"u"||typeof e.maxFeePerBlobGas<"u"||typeof e.sidecars<"u")return"eip4844";if(typeof e.maxFeePerGas<"u"||typeof e.maxPriorityFeePerGas<"u")return"eip1559";if(typeof e.gasPrice<"u")return typeof e.accessList<"u"?"eip2930":"legacy";throw new $c({transaction:e})}function up(e,{args:t,eventName:r}={}){return{...e,blockHash:e.blockHash?e.blockHash:null,blockNumber:e.blockNumber?BigInt(e.blockNumber):null,logIndex:e.logIndex?Number(e.logIndex):null,transactionHash:e.transactionHash?e.transactionHash:null,transactionIndex:e.transactionIndex?Number(e.transactionIndex):null,...r?{args:t,eventName:r}:{}}}var eo=class extends ue{constructor({chainId:t}){super(typeof t=="number"?`Chain ID "${t}" is invalid.`:"Chain ID is invalid.",{name:"InvalidChainIdError"})}};function hp(){let e=()=>{},t=()=>{};return{promise:new Promise((r,o)=>{e=r,t=o}),resolve:e,reject:t}}var ua=new Map;function pp({fn:e,id:t,shouldSplitBatch:r,wait:o=0,sort:n}){let i=async()=>{let d=c();s();let u=d.map(({args:h})=>h);u.length!==0&&e(u).then(h=>{n&&Array.isArray(h)&&h.sort(n);for(let p=0;p<d.length;p++){let{resolve:w}=d[p];w?.([h[p],h])}}).catch(h=>{for(let p=0;p<d.length;p++){let{reject:w}=d[p];w?.(h)}})},s=()=>ua.delete(t),a=()=>c().map(({args:d})=>d),c=()=>ua.get(t)||[],l=d=>ua.set(t,[...c(),d]);return{flush:s,async schedule(d){let{promise:u,resolve:h,reject:p}=hp();return r?.([...a(),d])&&i(),c().length>0?(l({args:d,resolve:h,reject:p}),u):(l({args:d,resolve:h,reject:p}),setTimeout(i,o),u)}}}async function wu(e){return new Promise(t=>setTimeout(t,e))}new So(128);var Wc=256,wi=Wc,mi;function gp(e=11){if(!mi||wi+e>Wc*2){mi="",wi=0;for(let t=0;t<Wc;t++)mi+=(256+Math.random()*256|0).toString(16).substring(1)}return mi.substring(wi,wi+++e)}var vi=new So(8192);function fp(e,{enabled:t=!0,id:r}){if(!t||!r)return e();if(vi.get(r))return vi.get(r);let o=e().finally(()=>vi.delete(r));return vi.set(r,o),o}function wp(e,{delay:t=100,retryCount:r=2,shouldRetry:o=()=>!0}={}){return new Promise((n,i)=>{let s=async({count:a=0}={})=>{let c=async({error:l})=>{let d=typeof t=="function"?t({count:a,error:l}):t;d&&await wu(d),s({count:a+1})};try{let l=await e();n(l)}catch(l){if(a<r&&await o({count:a,error:l}))return c({error:l});i(l)}};s()})}function mp(e,t={}){return async(r,o={})=>{let{dedupe:n=!1,methods:i,retryDelay:s=150,retryCount:a=3,uid:c}={...t,...o},{method:l}=r;if(i?.exclude?.includes(l))throw new Hr(new Error("method not supported"),{method:l});if(i?.include&&!i.include.includes(l))throw new Hr(new Error("method not supported"),{method:l});let d=n?Z0(`${c}.${Zr(r)}`):void 0;return fp(()=>wp(async()=>{try{return await e(r)}catch(u){let h=u;switch(h.code){case Sn.code:throw new Sn(h);case _n.code:throw new _n(h);case On.code:throw new On(h,{method:r.method});case Tn.code:throw new Tn(h);case _o.code:throw new _o(h);case Pn.code:throw new Pn(h);case Rn.code:throw new Rn(h);case $n.code:throw new $n(h);case Oo.code:throw new Oo(h);case Hr.code:throw new Hr(h,{method:r.method});case To.code:throw new To(h);case Ln.code:throw new Ln(h);case Gr.code:throw new Gr(h);case Bn.code:throw new Bn(h);case Mn.code:throw new Mn(h);case Un.code:throw new Un(h);case zn.code:throw new zn(h);case Dn.code:throw new Dn(h);case jn.code:throw new jn(h);case Wn.code:throw new Wn(h);case Hn.code:throw new Hn(h);case Fn.code:throw new Fn(h);case Vn.code:throw new Vn(h);case Zn.code:throw new Zn(h);case qn.code:throw new qn(h);case 5e3:throw new Gr(h);default:throw u instanceof ue?u:new Bc(h)}}},{delay:({count:u,error:h})=>{if(h&&h instanceof qr){let p=h?.headers?.get("Retry-After");if(p?.match(/\d/))return Number.parseInt(p)*1e3}return~~(1<<u)*s},retryCount:a,shouldRetry:({error:u})=>vp(u)}),{enabled:n,id:d})}}function vp(e){return"code"in e&&typeof e.code=="number"?e.code===-1||e.code===To.code||e.code===_o.code:e instanceof qr&&e.status?e.status===403||e.status===408||e.status===413||e.status===429||e.status===500||e.status===502||e.status===503||e.status===504:!0}function mu({key:e,methods:t,name:r,request:o,retryCount:n=3,retryDelay:i=150,timeout:s,type:a},c){let l=gp();return{config:{key:e,methods:t,name:r,request:o,retryCount:n,retryDelay:i,timeout:s,type:a},request:mp(o,{methods:t,retryCount:n,retryDelay:i,uid:l}),value:c}}function bd(e,t={}){let{key:r="fallback",name:o="Fallback",rank:n=!1,shouldThrow:i=bp,retryCount:s,retryDelay:a}=t;return({chain:c,pollingInterval:l=4e3,timeout:d,...u})=>{let h=e,p=()=>{},w=mu({key:r,name:o,async request({method:b,params:v}){let m,x=async(C=0)=>{let E=h[C]({...u,chain:c,retryCount:0,timeout:d});try{let I=await E.request({method:b,params:v});return p({method:b,params:v,response:I,transport:E,status:"success"}),I}catch(I){if(p({error:I,method:b,params:v,transport:E,status:"error"}),i(I)||C===h.length-1||(m??=h.slice(C+1).some(S=>{let{include:j,exclude:R}=S({chain:c}).config.methods||{};return j?j.includes(b):R?!R.includes(b):!0}),!m))throw I;return x(C+1)}};return x()},retryCount:s,retryDelay:a,type:"fallback"},{onResponse:b=>p=b,transports:h.map(b=>b({chain:c,retryCount:0}))});if(n){let b=typeof n=="object"?n:{};yp({chain:c,interval:b.interval??l,onTransports:v=>h=v,ping:b.ping,sampleCount:b.sampleCount,timeout:b.timeout,transports:h,weights:b.weights})}return w}}function bp(e){return!!("code"in e&&typeof e.code=="number"&&(e.code===Oo.code||e.code===Gr.code||Gn.nodeMessage.test(e.message)||e.code===5e3))}function yp({chain:e,interval:t=4e3,onTransports:r,ping:o,sampleCount:n=10,timeout:i=1e3,transports:s,weights:a={}}){let{stability:c=.7,latency:l=.3}=a,d=[],u=async()=>{let h=await Promise.all(s.map(async b=>{let v=b({chain:e,retryCount:0,timeout:i}),m=Date.now(),x,C;try{await(o?o({transport:v}):v.request({method:"net_listening"})),C=1}catch{C=0}finally{x=Date.now()}return{latency:x-m,success:C}}));d.push(h),d.length>n&&d.shift();let p=Math.max(...d.map(b=>Math.max(...b.map(({latency:v})=>v)))),w=s.map((b,v)=>{let m=d.map(I=>I[v].latency),x=1-m.reduce((I,S)=>I+S,0)/m.length/p,C=d.map(I=>I[v].success),E=C.reduce((I,S)=>I+S,0)/C.length;return E===0?[0,v]:[l*x+c*E,v]}).sort((b,v)=>v[0]-b[0]);r(w.map(([,b])=>s[b])),await wu(t),u()};u()}var Hc=class extends ue{constructor(){super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.",{docsPath:"/docs/clients/intro",name:"UrlRequiredError"})}};function Cp(e,{errorInstance:t=new Error("timed out"),timeout:r,signal:o}){return new Promise((n,i)=>{(async()=>{let s;try{let a=new AbortController;r>0&&(s=setTimeout(()=>{o?a.abort():i(t)},r)),n(await e({signal:a?.signal||null}))}catch(a){a?.name==="AbortError"&&i(t),i(a)}finally{clearTimeout(s)}})()})}function xp(){return{current:0,take(){return this.current++},reset(){this.current=0}}}var yd=xp();function Ep(e,t={}){return{async request(r){let{body:o,onRequest:n=t.onRequest,onResponse:i=t.onResponse,timeout:s=t.timeout??1e4}=r,a={...t.fetchOptions??{},...r.fetchOptions??{}},{headers:c,method:l,signal:d}=a;try{let u=await Cp(async({signal:p})=>{let w={...a,body:Array.isArray(o)?Zr(o.map(m=>({jsonrpc:"2.0",id:m.id??yd.take(),...m}))):Zr({jsonrpc:"2.0",id:o.id??yd.take(),...o}),headers:{"Content-Type":"application/json",...c},method:l||"POST",signal:d||(s>0?p:null)},b=new Request(e,w),v=await n?.(b,w)??{...w,url:e};return await fetch(v.url??e,v)},{errorInstance:new Es({body:o,url:e}),timeout:s,signal:!0});i&&await i(u);let h;if(u.headers.get("Content-Type")?.startsWith("application/json"))h=await u.json();else{h=await u.text();try{h=JSON.parse(h||"{}")}catch(p){if(u.ok)throw p;h={error:h}}}if(!u.ok)throw new qr({body:o,details:Zr(h.error)||u.statusText,headers:u.headers,status:u.status,url:e});return h}catch(u){throw u instanceof qr||u instanceof Es?u:new qr({body:o,cause:u,url:e})}}}}function bi(e,t={}){let{batch:r,fetchOptions:o,key:n="http",methods:i,name:s="HTTP JSON-RPC",onFetchRequest:a,onFetchResponse:c,retryDelay:l,raw:d}=t;return({chain:u,retryCount:h,timeout:p})=>{let{batchSize:w=1e3,wait:b=0}=typeof r=="object"?r:{},v=t.retryCount??h,m=p??t.timeout??1e4,x=e||u?.rpcUrls.default.http[0];if(!x)throw new Hc;let C=Ep(x,{fetchOptions:o,onRequest:a,onResponse:c,timeout:m});return mu({key:n,methods:i,name:s,async request({method:E,params:I}){let S={method:E,params:I},{schedule:j}=pp({id:x,wait:b,shouldSplitBatch(B){return B.length>w},fn:B=>C.request({body:B}),sort:(B,ne)=>B.id-ne.id}),R=async B=>r?j(B):[await C.request({body:B})],[{error:P,result:L}]=await R(S);if(d)return{error:P,result:L};if(P)throw new xs({body:S,error:P,url:x});return L},retryCount:v,retryDelay:l,timeout:m,type:"http"},{fetchOptions:o,url:x})}}function St(e){return{formatters:void 0,fees:void 0,serializers:void 0,...e}}function kp(e){let{authorizationList:t}=e;if(t)for(let r of t){let{chainId:o}=r,n=r.address;if(!tr(n))throw new Ut({address:n});if(o<0)throw new eo({chainId:o})}Bl(e)}function Ap(e){let{blobVersionedHashes:t}=e;if(t){if(t.length===0)throw new ks;for(let r of t){let o=yr(r),n=bs(Dh(r,0,1));if(o!==32)throw new Dc({hash:r,size:o});if(n!==fu)throw new jc({hash:r,version:n})}}Bl(e)}function Bl(e){let{chainId:t,maxPriorityFeePerGas:r,maxFeePerGas:o,to:n}=e;if(t<=0)throw new eo({chainId:t});if(n&&!tr(n))throw new Ut({address:n});if(o&&o>qs)throw new Qr({maxFeePerGas:o});if(r&&o&&r>o)throw new Kn({maxFeePerGas:o,maxPriorityFeePerGas:r})}function Np(e){let{chainId:t,maxPriorityFeePerGas:r,gasPrice:o,maxFeePerGas:n,to:i}=e;if(t<=0)throw new eo({chainId:t});if(i&&!tr(i))throw new Ut({address:i});if(r||n)throw new ue("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.");if(o&&o>qs)throw new Qr({maxFeePerGas:o})}function Ip(e){let{chainId:t,maxPriorityFeePerGas:r,gasPrice:o,maxFeePerGas:n,to:i}=e;if(i&&!tr(i))throw new Ut({address:i});if(typeof t<"u"&&t<=0)throw new eo({chainId:t});if(r||n)throw new ue("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.");if(o&&o>qs)throw new Qr({maxFeePerGas:o})}function si(e){if(!e||e.length===0)return[];let t=[];for(let r=0;r<e.length;r++){let{address:o,storageKeys:n}=e[r];for(let i=0;i<n.length;i++)if(n[i].length-2!==64)throw new Lc({storageKey:n[i]});if(!tr(o,{strict:!1}))throw new Ut({address:o});t.push([o,n])}return t}function Sp(e,t){let r=dp(e);return r==="eip1559"?Tp(e,t):r==="eip2930"?Pp(e,t):r==="eip4844"?Op(e,t):r==="eip7702"?_p(e,t):Rp(e,t)}function _p(e,t){let{authorizationList:r,chainId:o,gas:n,nonce:i,to:s,value:a,maxFeePerGas:c,maxPriorityFeePerGas:l,accessList:d,data:u}=e;kp(e);let h=si(d),p=$p(r);return Do(["0x04",no([oe(o),i?oe(i):"0x",l?oe(l):"0x",c?oe(c):"0x",n?oe(n):"0x",s??"0x",a?oe(a):"0x",u??"0x",h,p,...jo(e,t)])])}function Op(e,t){let{chainId:r,gas:o,nonce:n,to:i,value:s,maxFeePerBlobGas:a,maxFeePerGas:c,maxPriorityFeePerGas:l,accessList:d,data:u}=e;Ap(e);let h=e.blobVersionedHashes,p=e.sidecars;if(e.blobs&&(typeof h>"u"||typeof p>"u")){let C=typeof e.blobs[0]=="string"?e.blobs:e.blobs.map(S=>or(S)),E=e.kzg,I=du({blobs:C,kzg:E});if(typeof h>"u"&&(h=ap({commitments:I})),typeof p>"u"){let S=uu({blobs:C,commitments:I,kzg:E});p=lp({blobs:C,commitments:I,proofs:S})}}let w=si(d),b=[oe(r),n?oe(n):"0x",l?oe(l):"0x",c?oe(c):"0x",o?oe(o):"0x",i??"0x",s?oe(s):"0x",u??"0x",w,a?oe(a):"0x",h??[],...jo(e,t)],v=[],m=[],x=[];if(p)for(let C=0;C<p.length;C++){let{blob:E,commitment:I,proof:S}=p[C];v.push(E),m.push(I),x.push(S)}return Do(["0x03",no(p?[b,v,m,x]:b)])}function Tp(e,t){let{chainId:r,gas:o,nonce:n,to:i,value:s,maxFeePerGas:a,maxPriorityFeePerGas:c,accessList:l,data:d}=e;Bl(e);let u=si(l),h=[oe(r),n?oe(n):"0x",c?oe(c):"0x",a?oe(a):"0x",o?oe(o):"0x",i??"0x",s?oe(s):"0x",d??"0x",u,...jo(e,t)];return Do(["0x02",no(h)])}function Pp(e,t){let{chainId:r,gas:o,data:n,nonce:i,to:s,value:a,accessList:c,gasPrice:l}=e;Np(e);let d=si(c),u=[oe(r),i?oe(i):"0x",l?oe(l):"0x",o?oe(o):"0x",s??"0x",a?oe(a):"0x",n??"0x",d,...jo(e,t)];return Do(["0x01",no(u)])}function Rp(e,t){let{chainId:r=0,gas:o,data:n,nonce:i,to:s,value:a,gasPrice:c}=e;Ip(e);let l=[i?oe(i):"0x",c?oe(c):"0x",o?oe(o):"0x",s??"0x",a?oe(a):"0x",n??"0x"];if(t){let d=(()=>{if(t.v>=35n)return(t.v-35n)/2n>0?t.v:27n+(t.v===35n?0n:1n);if(r>0)return BigInt(r*2)+BigInt(35n+t.v-27n);let p=27n+(t.v===27n?0n:1n);if(t.v!==p)throw new Rc({v:t.v});return p})(),u=No(t.r),h=No(t.s);l=[...l,oe(d),u==="0x00"?"0x":u,h==="0x00"?"0x":h]}else r>0&&(l=[...l,oe(r),"0x","0x"]);return no(l)}function jo(e,t){let r=t??e,{v:o,yParity:n}=r;if(typeof r.r>"u")return[];if(typeof r.s>"u")return[];if(typeof o>"u"&&typeof n>"u")return[];let i=No(r.r),s=No(r.s);return[typeof n=="number"?n?oe(1):"0x":o===0n?"0x":o===1n?oe(1):o===27n?"0x":oe(1),i==="0x00"?"0x":i,s==="0x00"?"0x":s]}function $p(e){if(!e||e.length===0)return[];let t=[];for(let r of e){let{chainId:o,nonce:n,...i}=r,s=r.address;t.push([o?oe(o):"0x",s,n?oe(n):"0x",...jo({},i)])}return t}var Lp={"0x0":"reverted","0x1":"success"};function Bp(e){let t={...e,blockNumber:e.blockNumber?BigInt(e.blockNumber):null,contractAddress:e.contractAddress?e.contractAddress:null,cumulativeGasUsed:e.cumulativeGasUsed?BigInt(e.cumulativeGasUsed):null,effectiveGasPrice:e.effectiveGasPrice?BigInt(e.effectiveGasPrice):null,gasUsed:e.gasUsed?BigInt(e.gasUsed):null,logs:e.logs?e.logs.map(r=>up(r)):null,to:e.to?e.to:null,transactionIndex:e.transactionIndex?bs(e.transactionIndex):null,status:e.status?Lp[e.status]:null,type:e.type?au[e.type]||e.type:null};return e.blobGasPrice&&(t.blobGasPrice=BigInt(e.blobGasPrice)),e.blobGasUsed&&(t.blobGasUsed=BigInt(e.blobGasUsed)),t}var Mp=Zs("transactionReceipt",Bp),Up=new Uint8Array([7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8]),vu=new Uint8Array(new Array(16).fill(0).map((e,t)=>t)),zp=vu.map(e=>(9*e+5)%16),Dp=[vu],jp=[zp];for(let e=0;e<4;e++)for(let t of[Dp,jp])t.push(t[e].map(r=>Up[r]));var Ks=BigInt(0),Ys=BigInt(1),Wp=BigInt(2);function to(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name==="Uint8Array"}function ai(e){if(!to(e))throw new Error("Uint8Array expected")}function Po(e,t){if(typeof t!="boolean")throw new Error(e+" boolean expected, got "+t)}var Hp=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function Ro(e){ai(e);let t="";for(let r=0;r<e.length;r++)t+=Hp[e[r]];return t}function xo(e){let t=e.toString(16);return t.length&1?"0"+t:t}function Ml(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);return e===""?Ks:BigInt("0x"+e)}var Wt={_0:48,_9:57,A:65,F:70,a:97,f:102};function Cd(e){if(e>=Wt._0&&e<=Wt._9)return e-Wt._0;if(e>=Wt.A&&e<=Wt.F)return e-(Wt.A-10);if(e>=Wt.a&&e<=Wt.f)return e-(Wt.a-10)}function $o(e){if(typeof e!="string")throw new Error("hex string expected, got "+typeof e);let t=e.length,r=t/2;if(t%2)throw new Error("hex string expected, got unpadded hex of length "+t);let o=new Uint8Array(r);for(let n=0,i=0;n<r;n++,i+=2){let s=Cd(e.charCodeAt(i)),a=Cd(e.charCodeAt(i+1));if(s===void 0||a===void 0){let c=e[i]+e[i+1];throw new Error('hex string expected, got non-hex character "'+c+'" at index '+i)}o[n]=s*16+a}return o}function Kr(e){return Ml(Ro(e))}function Ul(e){return ai(e),Ml(Ro(Uint8Array.from(e).reverse()))}function Lo(e,t){return $o(e.toString(16).padStart(t*2,"0"))}function zl(e,t){return Lo(e,t).reverse()}function Fp(e){return $o(xo(e))}function It(e,t,r){let o;if(typeof t=="string")try{o=$o(t)}catch(i){throw new Error(e+" must be hex string or Uint8Array, cause: "+i)}else if(to(t))o=Uint8Array.from(t);else throw new Error(e+" must be hex string or Uint8Array");let n=o.length;if(typeof r=="number"&&n!==r)throw new Error(e+" of length "+r+" expected, got "+n);return o}function Yn(...e){let t=0;for(let o=0;o<e.length;o++){let n=e[o];ai(n),t+=n.length}let r=new Uint8Array(t);for(let o=0,n=0;o<e.length;o++){let i=e[o];r.set(i,n),n+=i.length}return r}function Vp(e,t){if(e.length!==t.length)return!1;let r=0;for(let o=0;o<e.length;o++)r|=e[o]^t[o];return r===0}function Zp(e){if(typeof e!="string")throw new Error("string expected");return new Uint8Array(new TextEncoder().encode(e))}var ha=e=>typeof e=="bigint"&&Ks<=e;function Js(e,t,r){return ha(e)&&ha(t)&&ha(r)&&t<=e&&e<r}function Yr(e,t,r,o){if(!Js(t,r,o))throw new Error("expected valid "+e+": "+r+" <= n < "+o+", got "+t)}function bu(e){let t;for(t=0;e>Ks;e>>=Ys,t+=1);return t}function qp(e,t){return e>>BigInt(t)&Ys}function Gp(e,t,r){return e|(r?Ys:Ks)<<BigInt(t)}var Dl=e=>(Wp<<BigInt(e-1))-Ys,pa=e=>new Uint8Array(e),xd=e=>Uint8Array.from(e);function yu(e,t,r){if(typeof e!="number"||e<2)throw new Error("hashLen must be a number");if(typeof t!="number"||t<2)throw new Error("qByteLen must be a number");if(typeof r!="function")throw new Error("hmacFn must be a function");let o=pa(e),n=pa(e),i=0,s=()=>{o.fill(1),n.fill(0),i=0},a=(...d)=>r(n,o,...d),c=(d=pa())=>{n=a(xd([0]),d),o=a(),d.length!==0&&(n=a(xd([1]),d),o=a())},l=()=>{if(i++>=1e3)throw new Error("drbg: tried 1000 values");let d=0,u=[];for(;d<t;){o=a();let h=o.slice();u.push(h),d+=o.length}return Yn(...u)};return(d,u)=>{s(),c(d);let h;for(;!(h=u(l()));)c();return s(),h}}var Kp={bigint:e=>typeof e=="bigint",function:e=>typeof e=="function",boolean:e=>typeof e=="boolean",string:e=>typeof e=="string",stringOrUint8Array:e=>typeof e=="string"||to(e),isSafeInteger:e=>Number.isSafeInteger(e),array:e=>Array.isArray(e),field:(e,t)=>t.Fp.isValid(e),hash:e=>typeof e=="function"&&Number.isSafeInteger(e.outputLen)};function ci(e,t,r={}){let o=(n,i,s)=>{let a=Kp[i];if(typeof a!="function")throw new Error("invalid validator function");let c=e[n];if(!(s&&c===void 0)&&!a(c,e))throw new Error("param "+String(n)+" is invalid. Expected "+i+", got "+c)};for(let[n,i]of Object.entries(t))o(n,i,!1);for(let[n,i]of Object.entries(r))o(n,i,!0);return e}var Yp=()=>{throw new Error("not implemented")};function Fc(e){let t=new WeakMap;return(r,...o)=>{let n=t.get(r);if(n!==void 0)return n;let i=e(r,...o);return t.set(r,i),i}}var Jp=Object.freeze({__proto__:null,isBytes:to,abytes:ai,abool:Po,bytesToHex:Ro,numberToHexUnpadded:xo,hexToNumber:Ml,hexToBytes:$o,bytesToNumberBE:Kr,bytesToNumberLE:Ul,numberToBytesBE:Lo,numberToBytesLE:zl,numberToVarBytesBE:Fp,ensureBytes:It,concatBytes:Yn,equalBytes:Vp,utf8ToBytes:Zp,inRange:Js,aInRange:Yr,bitLen:bu,bitGet:qp,bitSet:Gp,bitMask:Dl,createHmacDrbg:yu,validateObject:ci,notImplemented:Yp,memoized:Fc}),Xp="0.1.1";function Qp(){return Xp}var rt=class e extends Error{constructor(t,r={}){let o=(()=>{if(r.cause instanceof e){if(r.cause.details)return r.cause.details;if(r.cause.shortMessage)return r.cause.shortMessage}return r.cause?.message?r.cause.message:r.details})(),n=r.cause instanceof e&&r.cause.docsPath||r.docsPath,i=`https://oxlib.sh${n??""}`,s=[t||"An error occurred.",...r.metaMessages?["",...r.metaMessages]:[],...o||n?["",o?`Details: ${o}`:void 0,n?`See: ${i}`:void 0]:[]].filter(a=>typeof a=="string").join(`
`);super(s,r.cause?{cause:r.cause}:void 0),Object.defineProperty(this,"details",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"docs",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"docsPath",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"shortMessage",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"cause",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"BaseError"}),Object.defineProperty(this,"version",{enumerable:!0,configurable:!0,writable:!0,value:`ox@${Qp()}`}),this.cause=r.cause,this.details=o,this.docs=i,this.docsPath=n,this.shortMessage=t}walk(t){return Cu(this,t)}};function Cu(e,t){return t?.(e)?e:e&&typeof e=="object"&&"cause"in e&&e.cause?Cu(e.cause,t):t?null:e}function eg(e,t){if(kd(e)>t)throw new Vc({givenSize:kd(e),maxSize:t})}var Ht={zero:48,nine:57,A:65,F:70,a:97,f:102};function Ed(e){if(e>=Ht.zero&&e<=Ht.nine)return e-Ht.zero;if(e>=Ht.A&&e<=Ht.F)return e-(Ht.A-10);if(e>=Ht.a&&e<=Ht.f)return e-(Ht.a-10)}function tg(e,t={}){let{dir:r,size:o=32}=t;if(o===0)return e;if(e.length>o)throw new Zc({size:e.length,targetSize:o,type:"Bytes"});let n=new Uint8Array(o);for(let i=0;i<o;i++){let s=r==="right";n[s?i:o-i-1]=e[s?i:e.length-i-1]}return n}function jl(e,t){if(qc(e)>t)throw new Kc({givenSize:qc(e),maxSize:t})}function xu(e,t={}){let{dir:r,size:o=32}=t;if(o===0)return e;let n=e.replace("0x","");if(n.length>o*2)throw new Yc({size:Math.ceil(n.length/2),targetSize:o,type:"Hex"});return`0x${n[r==="right"?"padEnd":"padStart"](o*2,"0")}`}var rg=new TextEncoder;function og(e){return e instanceof Uint8Array?e:typeof e=="string"?ig(e):ng(e)}function ng(e){return e instanceof Uint8Array?e:new Uint8Array(e)}function ig(e,t={}){let{size:r}=t,o=e;r&&(jl(e,r),o=Wl(e,r));let n=o.slice(2);n.length%2&&(n=`0${n}`);let i=n.length/2,s=new Uint8Array(i);for(let a=0,c=0;a<i;a++){let l=Ed(n.charCodeAt(c++)),d=Ed(n.charCodeAt(c++));if(l===void 0||d===void 0)throw new rt(`Invalid byte sequence ("${n[c-2]}${n[c-1]}" in "${n}").`);s[a]=l*16+d}return s}function sg(e,t={}){let{size:r}=t,o=rg.encode(e);return typeof r=="number"?(eg(o,r),ag(o,r)):o}function ag(e,t){return tg(e,{dir:"right",size:t})}function kd(e){return e.length}var Vc=class extends rt{constructor({givenSize:t,maxSize:r}){super(`Size cannot exceed \`${r}\` bytes. Given size: \`${t}\` bytes.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Bytes.SizeOverflowError"})}},Zc=class extends rt{constructor({size:t,targetSize:r,type:o}){super(`${o.charAt(0).toUpperCase()}${o.slice(1).toLowerCase()} size (\`${t}\`) exceeds padding size (\`${r}\`).`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Bytes.SizeExceedsPaddingSizeError"})}},cg=new TextEncoder,lg=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,"0"));function Eu(...e){return`0x${e.reduce((t,r)=>t+r.replace("0x",""),"")}`}function dg(e,t={}){let r=`0x${Number(e)}`;return typeof t.size=="number"?(jl(r,t.size),As(r,t.size)):r}function ku(e,t={}){let r="";for(let n=0;n<e.length;n++)r+=lg[e[n]];let o=`0x${r}`;return typeof t.size=="number"?(jl(o,t.size),Wl(o,t.size)):o}function ug(e,t={}){let{signed:r,size:o}=t,n=BigInt(e),i;o?r?i=(1n<<BigInt(o)*8n-1n)-1n:i=2n**(BigInt(o)*8n)-1n:typeof e=="number"&&(i=BigInt(Number.MAX_SAFE_INTEGER));let s=typeof i=="bigint"&&r?-i-1n:0;if(i&&n>i||n<s){let c=typeof e=="bigint"?"n":"";throw new Gc({max:i?`${i}${c}`:void 0,min:`${s}${c}`,signed:r,size:o,value:`${e}${c}`})}let a=`0x${(r&&n<0?(1n<<BigInt(o*8))+BigInt(n):n).toString(16)}`;return o?As(a,o):a}function hg(e,t={}){return ku(cg.encode(e),t)}function As(e,t){return xu(e,{dir:"left",size:t})}function Wl(e,t){return xu(e,{dir:"right",size:t})}function qc(e){return Math.ceil((e.length-2)/2)}var Gc=class extends rt{constructor({max:t,min:r,signed:o,size:n,value:i}){super(`Number \`${i}\` is not in safe${n?` ${n*8}-bit`:""}${o?" signed":" unsigned"} integer range ${t?`(\`${r}\` to \`${t}\`)`:`(above \`${r}\`)`}`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Hex.IntegerOutOfRangeError"})}},Kc=class extends rt{constructor({givenSize:t,maxSize:r}){super(`Size cannot exceed \`${r}\` bytes. Given size: \`${t}\` bytes.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Hex.SizeOverflowError"})}},Yc=class extends rt{constructor({size:t,targetSize:r,type:o}){super(`${o.charAt(0).toUpperCase()}${o.slice(1).toLowerCase()} size (\`${t}\`) exceeds padding size (\`${r}\`).`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Hex.SizeExceedsPaddingSizeError"})}};function pg(e,t={}){let{as:r=typeof e=="string"?"Hex":"Bytes"}=t,o=eu(og(e));return r==="Bytes"?o:ku(o)}var Jc=class extends Map{constructor(t){super(),Object.defineProperty(this,"maxSize",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.maxSize=t}get(t){let r=super.get(t);return super.has(t)&&r!==void 0&&(this.delete(t),super.set(t,r)),r}set(t,r){if(super.set(t,r),this.maxSize&&this.size>this.maxSize){let o=this.keys().next().value;o&&this.delete(o)}return this}},gg={checksum:new Jc(8192)},ga=gg.checksum,fg=/^0x[a-fA-F0-9]{40}$/;function Au(e,t={}){let{strict:r=!0}=t;if(!fg.test(e))throw new Ns({address:e,cause:new Xc});if(r){if(e.toLowerCase()===e)return;if(wg(e)!==e)throw new Ns({address:e,cause:new Qc})}}function wg(e){if(ga.has(e))return ga.get(e);Au(e,{strict:!1});let t=e.substring(2).toLowerCase(),r=pg(sg(t),{as:"Bytes"}),o=t.split("");for(let i=0;i<40;i+=2)r[i>>1]>>4>=8&&o[i]&&(o[i]=o[i].toUpperCase()),(r[i>>1]&15)>=8&&o[i+1]&&(o[i+1]=o[i+1].toUpperCase());let n=`0x${o.join("")}`;return ga.set(e,n),n}var Ns=class extends rt{constructor({address:t,cause:r}){super(`Address "${t}" is invalid.`,{cause:r}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Address.InvalidAddressError"})}},Xc=class extends rt{constructor(){super("Address is not a 20 byte (40 hexadecimal character) value."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Address.InvalidInputError"})}},Qc=class extends rt{constructor(){super("Address does not match its checksum counterpart."),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"Address.InvalidChecksumError"})}},mg=/^(.*)\[([0-9]*)\]$/,vg=/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/,bg=/^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;function el(e,t){if(e.length!==t.length)throw new rl({expectedLength:e.length,givenLength:t.length});let r=[];for(let o=0;o<e.length;o++){let n=e[o],i=t[o];r.push(el.encode(n,i))}return Eu(...r)}(function(e){function t(r,o,n=!1){if(r==="address"){let c=o;return Au(c),As(c.toLowerCase(),n?32:0)}if(r==="string")return hg(o);if(r==="bytes")return o;if(r==="bool")return As(dg(o),n?32:1);let i=r.match(bg);if(i){let[c,l,d="256"]=i,u=Number.parseInt(d)/8;return ug(o,{size:n?32:u,signed:l==="int"})}let s=r.match(vg);if(s){let[c,l]=s;if(Number.parseInt(l)!==(o.length-2)/2)throw new tl({expectedSize:Number.parseInt(l),value:o});return Wl(o,n?32:0)}let a=r.match(mg);if(a&&Array.isArray(o)){let[c,l]=a,d=[];for(let u=0;u<o.length;u++)d.push(t(l,o[u],!0));return d.length===0?"0x":Eu(...d)}throw new ol(r)}e.encode=t})(el||(el={}));var tl=class extends rt{constructor({expectedSize:t,value:r}){super(`Size of bytes "${r}" (bytes${qc(r)}) does not match expected size (bytes${t}).`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiParameters.BytesSizeMismatchError"})}},rl=class extends rt{constructor({expectedLength:t,givenLength:r}){super(["ABI encoding parameters/values length mismatch.",`Expected length (parameters): ${t}`,`Given length (values): ${r}`].join(`
`)),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiParameters.LengthMismatchError"})}},ol=class extends rt{constructor(t){super(`Type \`${t}\` is not a valid ABI Type.`),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"AbiParameters.InvalidTypeError"})}},Is=class extends In{constructor(t,r){super(),this.finished=!1,this.destroyed=!1,wh(t);let o=Vs(r);if(this.iHash=t.create(),typeof this.iHash.update!="function")throw new Error("Expected instance of class which extends utils.Hash");this.blockLen=this.iHash.blockLen,this.outputLen=this.iHash.outputLen;let n=this.blockLen,i=new Uint8Array(n);i.set(o.length>n?t.create().update(o).digest():o);for(let s=0;s<i.length;s++)i[s]^=54;this.iHash.update(i),this.oHash=t.create();for(let s=0;s<i.length;s++)i[s]^=106;this.oHash.update(i),i.fill(0)}update(t){return Io(this),this.iHash.update(t),this}digestInto(t){Io(this),ii(t,this.outputLen),this.finished=!0,this.iHash.digestInto(t),this.oHash.update(t),this.oHash.digestInto(t),this.destroy()}digest(){let t=new Uint8Array(this.oHash.outputLen);return this.digestInto(t),t}_cloneInto(t){t||(t=Object.create(Object.getPrototypeOf(this),{}));let{oHash:r,iHash:o,finished:n,destroyed:i,blockLen:s,outputLen:a}=this;return t=t,t.finished=n,t.destroyed=i,t.blockLen=s,t.outputLen=a,t.oHash=r._cloneInto(t.oHash),t.iHash=o._cloneInto(t.iHash),t}destroy(){this.destroyed=!0,this.oHash.destroy(),this.iHash.destroy()}},Nu=(e,t,r)=>new Is(e,t).update(r).digest();Nu.create=(e,t)=>new Is(e,t);var Ue=BigInt(0),Ne=BigInt(1),jr=BigInt(2),yg=BigInt(3),nl=BigInt(4),Ad=BigInt(5),Nd=BigInt(8);function et(e,t){let r=e%t;return r>=Ue?r:t+r}function Cg(e,t,r){if(t<Ue)throw new Error("invalid exponent, negatives unsupported");if(r<=Ue)throw new Error("invalid modulus");if(r===Ne)return Ue;let o=Ne;for(;t>Ue;)t&Ne&&(o=o*e%r),e=e*e%r,t>>=Ne;return o}function pt(e,t,r){let o=e;for(;t-- >Ue;)o*=o,o%=r;return o}function il(e,t){if(e===Ue)throw new Error("invert: expected non-zero number");if(t<=Ue)throw new Error("invert: expected positive modulus, got "+t);let r=et(e,t),o=t,n=Ue,i=Ne;for(;r!==Ue;){let s=o/r,a=o%r,c=n-i*s;o=r,r=a,n=i,i=c}if(o!==Ne)throw new Error("invert: does not exist");return et(n,t)}function xg(e){let t=(e-Ne)/jr,r,o,n;for(r=e-Ne,o=0;r%jr===Ue;r/=jr,o++);for(n=jr;n<e&&Cg(n,t,e)!==e-Ne;n++)if(n>1e3)throw new Error("Cannot find square root: likely non-prime P");if(o===1){let s=(e+Ne)/nl;return function(a,c){let l=a.pow(c,s);if(!a.eql(a.sqr(l),c))throw new Error("Cannot find square root");return l}}let i=(r+Ne)/jr;return function(s,a){if(s.pow(a,t)===s.neg(s.ONE))throw new Error("Cannot find square root");let c=o,l=s.pow(s.mul(s.ONE,n),r),d=s.pow(a,i),u=s.pow(a,r);for(;!s.eql(u,s.ONE);){if(s.eql(u,s.ZERO))return s.ZERO;let h=1;for(let w=s.sqr(u);h<c&&!s.eql(w,s.ONE);h++)w=s.sqr(w);let p=s.pow(l,Ne<<BigInt(c-h-1));l=s.sqr(p),d=s.mul(d,p),u=s.mul(u,l),c=h}return d}}function Eg(e){if(e%nl===yg){let t=(e+Ne)/nl;return function(r,o){let n=r.pow(o,t);if(!r.eql(r.sqr(n),o))throw new Error("Cannot find square root");return n}}if(e%Nd===Ad){let t=(e-Ad)/Nd;return function(r,o){let n=r.mul(o,jr),i=r.pow(n,t),s=r.mul(o,i),a=r.mul(r.mul(s,jr),i),c=r.mul(s,r.sub(a,r.ONE));if(!r.eql(r.sqr(c),o))throw new Error("Cannot find square root");return c}}return xg(e)}var kg=["create","isValid","is0","neg","inv","sqrt","sqr","eql","add","sub","mul","pow","div","addN","subN","mulN","sqrN"];function Ag(e){let t={ORDER:"bigint",MASK:"bigint",BYTES:"isSafeInteger",BITS:"isSafeInteger"},r=kg.reduce((o,n)=>(o[n]="function",o),t);return ci(e,r)}function Ng(e,t,r){if(r<Ue)throw new Error("invalid exponent, negatives unsupported");if(r===Ue)return e.ONE;if(r===Ne)return t;let o=e.ONE,n=t;for(;r>Ue;)r&Ne&&(o=e.mul(o,n)),n=e.sqr(n),r>>=Ne;return o}function Ig(e,t){let r=new Array(t.length),o=t.reduce((i,s,a)=>e.is0(s)?i:(r[a]=i,e.mul(i,s)),e.ONE),n=e.inv(o);return t.reduceRight((i,s,a)=>e.is0(s)?i:(r[a]=e.mul(i,r[a]),e.mul(i,s)),n),r}function Iu(e,t){let r=t!==void 0?t:e.toString(2).length,o=Math.ceil(r/8);return{nBitLength:r,nByteLength:o}}function Su(e,t,r=!1,o={}){if(e<=Ue)throw new Error("invalid field: expected ORDER > 0, got "+e);let{nBitLength:n,nByteLength:i}=Iu(e,t);if(i>2048)throw new Error("invalid field: expected ORDER of <= 2048 bytes");let s,a=Object.freeze({ORDER:e,isLE:r,BITS:n,BYTES:i,MASK:Dl(n),ZERO:Ue,ONE:Ne,create:c=>et(c,e),isValid:c=>{if(typeof c!="bigint")throw new Error("invalid field element: expected bigint, got "+typeof c);return Ue<=c&&c<e},is0:c=>c===Ue,isOdd:c=>(c&Ne)===Ne,neg:c=>et(-c,e),eql:(c,l)=>c===l,sqr:c=>et(c*c,e),add:(c,l)=>et(c+l,e),sub:(c,l)=>et(c-l,e),mul:(c,l)=>et(c*l,e),pow:(c,l)=>Ng(a,c,l),div:(c,l)=>et(c*il(l,e),e),sqrN:c=>c*c,addN:(c,l)=>c+l,subN:(c,l)=>c-l,mulN:(c,l)=>c*l,inv:c=>il(c,e),sqrt:o.sqrt||(c=>(s||(s=Eg(e)),s(a,c))),invertBatch:c=>Ig(a,c),cmov:(c,l,d)=>d?l:c,toBytes:c=>r?zl(c,i):Lo(c,i),fromBytes:c=>{if(c.length!==i)throw new Error("Field.fromBytes: expected "+i+" bytes, got "+c.length);return r?Ul(c):Kr(c)}});return Object.freeze(a)}function _u(e){if(typeof e!="bigint")throw new Error("field order must be bigint");let t=e.toString(2).length;return Math.ceil(t/8)}function Ou(e){let t=_u(e);return t+Math.ceil(t/2)}function Sg(e,t,r=!1){let o=e.length,n=_u(t),i=Ou(t);if(o<16||o<i||o>1024)throw new Error("expected "+i+"-1024 bytes of input, got "+o);let s=r?Ul(e):Kr(e),a=et(s,t-Ne)+Ne;return r?zl(a,n):Lo(a,n)}var Id=BigInt(0),yi=BigInt(1);function fa(e,t){let r=t.negate();return e?r:t}function Tu(e,t){if(!Number.isSafeInteger(e)||e<=0||e>t)throw new Error("invalid window size, expected [1.."+t+"], got W="+e)}function wa(e,t){Tu(e,t);let r=Math.ceil(t/e)+1,o=2**(e-1);return{windows:r,windowSize:o}}function _g(e,t){if(!Array.isArray(e))throw new Error("array expected");e.forEach((r,o)=>{if(!(r instanceof t))throw new Error("invalid point at index "+o)})}function Og(e,t){if(!Array.isArray(e))throw new Error("array of scalars expected");e.forEach((r,o)=>{if(!t.isValid(r))throw new Error("invalid scalar at index "+o)})}var ma=new WeakMap,Pu=new WeakMap;function va(e){return Pu.get(e)||1}function Tg(e,t){return{constTimeNegate:fa,hasPrecomputes(r){return va(r)!==1},unsafeLadder(r,o,n=e.ZERO){let i=r;for(;o>Id;)o&yi&&(n=n.add(i)),i=i.double(),o>>=yi;return n},precomputeWindow(r,o){let{windows:n,windowSize:i}=wa(o,t),s=[],a=r,c=a;for(let l=0;l<n;l++){c=a,s.push(c);for(let d=1;d<i;d++)c=c.add(a),s.push(c);a=c.double()}return s},wNAF(r,o,n){let{windows:i,windowSize:s}=wa(r,t),a=e.ZERO,c=e.BASE,l=BigInt(2**r-1),d=2**r,u=BigInt(r);for(let h=0;h<i;h++){let p=h*s,w=Number(n&l);n>>=u,w>s&&(w-=d,n+=yi);let b=p,v=p+Math.abs(w)-1,m=h%2!==0,x=w<0;w===0?c=c.add(fa(m,o[b])):a=a.add(fa(x,o[v]))}return{p:a,f:c}},wNAFUnsafe(r,o,n,i=e.ZERO){let{windows:s,windowSize:a}=wa(r,t),c=BigInt(2**r-1),l=2**r,d=BigInt(r);for(let u=0;u<s;u++){let h=u*a;if(n===Id)break;let p=Number(n&c);if(n>>=d,p>a&&(p-=l,n+=yi),p===0)continue;let w=o[h+Math.abs(p)-1];p<0&&(w=w.negate()),i=i.add(w)}return i},getPrecomputes(r,o,n){let i=ma.get(o);return i||(i=this.precomputeWindow(o,r),r!==1&&ma.set(o,n(i))),i},wNAFCached(r,o,n){let i=va(r);return this.wNAF(i,this.getPrecomputes(i,r,n),o)},wNAFCachedUnsafe(r,o,n,i){let s=va(r);return s===1?this.unsafeLadder(r,o,i):this.wNAFUnsafe(s,this.getPrecomputes(s,r,n),o,i)},setWindowSize(r,o){Tu(o,t),Pu.set(r,o),ma.delete(r)}}}function Pg(e,t,r,o){if(_g(r,e),Og(o,t),r.length!==o.length)throw new Error("arrays of points and scalars must have equal length");let n=e.ZERO,i=bu(BigInt(r.length)),s=i>12?i-3:i>4?i-2:i?2:1,a=(1<<s)-1,c=new Array(a+1).fill(n),l=Math.floor((t.BITS-1)/s)*s,d=n;for(let u=l;u>=0;u-=s){c.fill(n);for(let p=0;p<o.length;p++){let w=o[p],b=Number(w>>BigInt(u)&BigInt(a));c[b]=c[b].add(r[p])}let h=n;for(let p=c.length-1,w=n;p>0;p--)w=w.add(c[p]),h=h.add(w);if(d=d.add(h),u!==0)for(let p=0;p<s;p++)d=d.double()}return d}function Ru(e){return Ag(e.Fp),ci(e,{n:"bigint",h:"bigint",Gx:"field",Gy:"field"},{nBitLength:"isSafeInteger",nByteLength:"isSafeInteger"}),Object.freeze({...Iu(e.n,e.nBitLength),...e,p:e.Fp.ORDER})}function Sd(e){e.lowS!==void 0&&Po("lowS",e.lowS),e.prehash!==void 0&&Po("prehash",e.prehash)}function Rg(e){let t=Ru(e);ci(t,{a:"field",b:"field"},{allowedPrivateKeyLengths:"array",wrapPrivateKey:"boolean",isTorsionFree:"function",clearCofactor:"function",allowInfinityPoint:"boolean",fromBytes:"function",toBytes:"function"});let{endo:r,Fp:o,a:n}=t;if(r){if(!o.eql(n,o.ZERO))throw new Error("invalid endomorphism, can only be defined for Koblitz curves that have a=0");if(typeof r!="object"||typeof r.beta!="bigint"||typeof r.splitScalar!="function")throw new Error("invalid endomorphism, expected beta: bigint and splitScalar: function")}return Object.freeze({...t})}var{bytesToNumberBE:$g,hexToBytes:Lg}=Jp,sl=class extends Error{constructor(t=""){super(t)}},Yt={Err:sl,_tlv:{encode:(e,t)=>{let{Err:r}=Yt;if(e<0||e>256)throw new r("tlv.encode: wrong tag");if(t.length&1)throw new r("tlv.encode: unpadded data");let o=t.length/2,n=xo(o);if(n.length/2&128)throw new r("tlv.encode: long form length too big");let i=o>127?xo(n.length/2|128):"";return xo(e)+i+n+t},decode(e,t){let{Err:r}=Yt,o=0;if(e<0||e>256)throw new r("tlv.encode: wrong tag");if(t.length<2||t[o++]!==e)throw new r("tlv.decode: wrong tlv");let n=t[o++],i=!!(n&128),s=0;if(!i)s=n;else{let c=n&127;if(!c)throw new r("tlv.decode(long): indefinite length not supported");if(c>4)throw new r("tlv.decode(long): byte length is too big");let l=t.subarray(o,o+c);if(l.length!==c)throw new r("tlv.decode: length bytes not complete");if(l[0]===0)throw new r("tlv.decode(long): zero leftmost byte");for(let d of l)s=s<<8|d;if(o+=c,s<128)throw new r("tlv.decode(long): not minimal encoding")}let a=t.subarray(o,o+s);if(a.length!==s)throw new r("tlv.decode: wrong value length");return{v:a,l:t.subarray(o+s)}}},_int:{encode(e){let{Err:t}=Yt;if(e<Xt)throw new t("integer: negative integers are not allowed");let r=xo(e);if(Number.parseInt(r[0],16)&8&&(r="00"+r),r.length&1)throw new t("unexpected DER parsing assertion: unpadded hex");return r},decode(e){let{Err:t}=Yt;if(e[0]&128)throw new t("invalid signature integer: negative");if(e[0]===0&&!(e[1]&128))throw new t("invalid signature integer: unnecessary leading zero");return $g(e)}},toSig(e){let{Err:t,_int:r,_tlv:o}=Yt,n=typeof e=="string"?Lg(e):e;ai(n);let{v:i,l:s}=o.decode(48,n);if(s.length)throw new t("invalid signature: left bytes after parsing");let{v:a,l:c}=o.decode(2,i),{v:l,l:d}=o.decode(2,c);if(d.length)throw new t("invalid signature: left bytes after parsing");return{r:r.decode(a),s:r.decode(l)}},hexFromSig(e){let{_tlv:t,_int:r}=Yt,o=t.encode(2,r.encode(e.r)),n=t.encode(2,r.encode(e.s)),i=o+n;return t.encode(48,i)}},Xt=BigInt(0),Be=BigInt(1);BigInt(2);var _d=BigInt(3);BigInt(4);function Bg(e){let t=Rg(e),{Fp:r}=t,o=Su(t.n,t.nBitLength),n=t.toBytes||((b,v,m)=>{let x=v.toAffine();return Yn(Uint8Array.from([4]),r.toBytes(x.x),r.toBytes(x.y))}),i=t.fromBytes||(b=>{let v=b.subarray(1),m=r.fromBytes(v.subarray(0,r.BYTES)),x=r.fromBytes(v.subarray(r.BYTES,2*r.BYTES));return{x:m,y:x}});function s(b){let{a:v,b:m}=t,x=r.sqr(b),C=r.mul(x,b);return r.add(r.add(C,r.mul(b,v)),m)}if(!r.eql(r.sqr(t.Gy),s(t.Gx)))throw new Error("bad generator point: equation left != right");function a(b){return Js(b,Be,t.n)}function c(b){let{allowedPrivateKeyLengths:v,nByteLength:m,wrapPrivateKey:x,n:C}=t;if(v&&typeof b!="bigint"){if(to(b)&&(b=Ro(b)),typeof b!="string"||!v.includes(b.length))throw new Error("invalid private key");b=b.padStart(m*2,"0")}let E;try{E=typeof b=="bigint"?b:Kr(It("private key",b,m))}catch{throw new Error("invalid private key, expected hex or "+m+" bytes, got "+typeof b)}return x&&(E=et(E,C)),Yr("private key",E,Be,C),E}function l(b){if(!(b instanceof h))throw new Error("ProjectivePoint expected")}let d=Fc((b,v)=>{let{px:m,py:x,pz:C}=b;if(r.eql(C,r.ONE))return{x:m,y:x};let E=b.is0();v==null&&(v=E?r.ONE:r.inv(C));let I=r.mul(m,v),S=r.mul(x,v),j=r.mul(C,v);if(E)return{x:r.ZERO,y:r.ZERO};if(!r.eql(j,r.ONE))throw new Error("invZ was invalid");return{x:I,y:S}}),u=Fc(b=>{if(b.is0()){if(t.allowInfinityPoint&&!r.is0(b.py))return;throw new Error("bad point: ZERO")}let{x:v,y:m}=b.toAffine();if(!r.isValid(v)||!r.isValid(m))throw new Error("bad point: x or y not FE");let x=r.sqr(m),C=s(v);if(!r.eql(x,C))throw new Error("bad point: equation left != right");if(!b.isTorsionFree())throw new Error("bad point: not in prime-order subgroup");return!0});class h{constructor(v,m,x){if(this.px=v,this.py=m,this.pz=x,v==null||!r.isValid(v))throw new Error("x required");if(m==null||!r.isValid(m))throw new Error("y required");if(x==null||!r.isValid(x))throw new Error("z required");Object.freeze(this)}static fromAffine(v){let{x:m,y:x}=v||{};if(!v||!r.isValid(m)||!r.isValid(x))throw new Error("invalid affine point");if(v instanceof h)throw new Error("projective point not allowed");let C=E=>r.eql(E,r.ZERO);return C(m)&&C(x)?h.ZERO:new h(m,x,r.ONE)}get x(){return this.toAffine().x}get y(){return this.toAffine().y}static normalizeZ(v){let m=r.invertBatch(v.map(x=>x.pz));return v.map((x,C)=>x.toAffine(m[C])).map(h.fromAffine)}static fromHex(v){let m=h.fromAffine(i(It("pointHex",v)));return m.assertValidity(),m}static fromPrivateKey(v){return h.BASE.multiply(c(v))}static msm(v,m){return Pg(h,o,v,m)}_setWindowSize(v){w.setWindowSize(this,v)}assertValidity(){u(this)}hasEvenY(){let{y:v}=this.toAffine();if(r.isOdd)return!r.isOdd(v);throw new Error("Field doesn't support isOdd")}equals(v){l(v);let{px:m,py:x,pz:C}=this,{px:E,py:I,pz:S}=v,j=r.eql(r.mul(m,S),r.mul(E,C)),R=r.eql(r.mul(x,S),r.mul(I,C));return j&&R}negate(){return new h(this.px,r.neg(this.py),this.pz)}double(){let{a:v,b:m}=t,x=r.mul(m,_d),{px:C,py:E,pz:I}=this,S=r.ZERO,j=r.ZERO,R=r.ZERO,P=r.mul(C,C),L=r.mul(E,E),B=r.mul(I,I),ne=r.mul(C,E);return ne=r.add(ne,ne),R=r.mul(C,I),R=r.add(R,R),S=r.mul(v,R),j=r.mul(x,B),j=r.add(S,j),S=r.sub(L,j),j=r.add(L,j),j=r.mul(S,j),S=r.mul(ne,S),R=r.mul(x,R),B=r.mul(v,B),ne=r.sub(P,B),ne=r.mul(v,ne),ne=r.add(ne,R),R=r.add(P,P),P=r.add(R,P),P=r.add(P,B),P=r.mul(P,ne),j=r.add(j,P),B=r.mul(E,I),B=r.add(B,B),P=r.mul(B,ne),S=r.sub(S,P),R=r.mul(B,L),R=r.add(R,R),R=r.add(R,R),new h(S,j,R)}add(v){l(v);let{px:m,py:x,pz:C}=this,{px:E,py:I,pz:S}=v,j=r.ZERO,R=r.ZERO,P=r.ZERO,L=t.a,B=r.mul(t.b,_d),ne=r.mul(m,E),ge=r.mul(x,I),N=r.mul(C,S),k=r.add(m,x),A=r.add(E,I);k=r.mul(k,A),A=r.add(ne,ge),k=r.sub(k,A),A=r.add(m,C);let $=r.add(E,S);return A=r.mul(A,$),$=r.add(ne,N),A=r.sub(A,$),$=r.add(x,C),j=r.add(I,S),$=r.mul($,j),j=r.add(ge,N),$=r.sub($,j),P=r.mul(L,A),j=r.mul(B,N),P=r.add(j,P),j=r.sub(ge,P),P=r.add(ge,P),R=r.mul(j,P),ge=r.add(ne,ne),ge=r.add(ge,ne),N=r.mul(L,N),A=r.mul(B,A),ge=r.add(ge,N),N=r.sub(ne,N),N=r.mul(L,N),A=r.add(A,N),ne=r.mul(ge,A),R=r.add(R,ne),ne=r.mul($,A),j=r.mul(k,j),j=r.sub(j,ne),ne=r.mul(k,ge),P=r.mul($,P),P=r.add(P,ne),new h(j,R,P)}subtract(v){return this.add(v.negate())}is0(){return this.equals(h.ZERO)}wNAF(v){return w.wNAFCached(this,v,h.normalizeZ)}multiplyUnsafe(v){let{endo:m,n:x}=t;Yr("scalar",v,Xt,x);let C=h.ZERO;if(v===Xt)return C;if(this.is0()||v===Be)return this;if(!m||w.hasPrecomputes(this))return w.wNAFCachedUnsafe(this,v,h.normalizeZ);let{k1neg:E,k1:I,k2neg:S,k2:j}=m.splitScalar(v),R=C,P=C,L=this;for(;I>Xt||j>Xt;)I&Be&&(R=R.add(L)),j&Be&&(P=P.add(L)),L=L.double(),I>>=Be,j>>=Be;return E&&(R=R.negate()),S&&(P=P.negate()),P=new h(r.mul(P.px,m.beta),P.py,P.pz),R.add(P)}multiply(v){let{endo:m,n:x}=t;Yr("scalar",v,Be,x);let C,E;if(m){let{k1neg:I,k1:S,k2neg:j,k2:R}=m.splitScalar(v),{p:P,f:L}=this.wNAF(S),{p:B,f:ne}=this.wNAF(R);P=w.constTimeNegate(I,P),B=w.constTimeNegate(j,B),B=new h(r.mul(B.px,m.beta),B.py,B.pz),C=P.add(B),E=L.add(ne)}else{let{p:I,f:S}=this.wNAF(v);C=I,E=S}return h.normalizeZ([C,E])[0]}multiplyAndAddUnsafe(v,m,x){let C=h.BASE,E=(S,j)=>j===Xt||j===Be||!S.equals(C)?S.multiplyUnsafe(j):S.multiply(j),I=E(this,m).add(E(v,x));return I.is0()?void 0:I}toAffine(v){return d(this,v)}isTorsionFree(){let{h:v,isTorsionFree:m}=t;if(v===Be)return!0;if(m)return m(h,this);throw new Error("isTorsionFree() has not been declared for the elliptic curve")}clearCofactor(){let{h:v,clearCofactor:m}=t;return v===Be?this:m?m(h,this):this.multiplyUnsafe(t.h)}toRawBytes(v=!0){return Po("isCompressed",v),this.assertValidity(),n(h,this,v)}toHex(v=!0){return Po("isCompressed",v),Ro(this.toRawBytes(v))}}h.BASE=new h(t.Gx,t.Gy,r.ONE),h.ZERO=new h(r.ZERO,r.ONE,r.ZERO);let p=t.nBitLength,w=Tg(h,t.endo?Math.ceil(p/2):p);return{CURVE:t,ProjectivePoint:h,normPrivateKeyToScalar:c,weierstrassEquation:s,isWithinCurveOrder:a}}function Mg(e){let t=Ru(e);return ci(t,{hash:"hash",hmac:"function",randomBytes:"function"},{bits2int:"function",bits2int_modN:"function",lowS:"boolean"}),Object.freeze({lowS:!0,...t})}function Ug(e){let t=Mg(e),{Fp:r,n:o}=t,n=r.BYTES+1,i=2*r.BYTES+1;function s(N){return et(N,o)}function a(N){return il(N,o)}let{ProjectivePoint:c,normPrivateKeyToScalar:l,weierstrassEquation:d,isWithinCurveOrder:u}=Bg({...t,toBytes(N,k,A){let $=k.toAffine(),_=r.toBytes($.x),K=Yn;return Po("isCompressed",A),A?K(Uint8Array.from([k.hasEvenY()?2:3]),_):K(Uint8Array.from([4]),_,r.toBytes($.y))},fromBytes(N){let k=N.length,A=N[0],$=N.subarray(1);if(k===n&&(A===2||A===3)){let _=Kr($);if(!Js(_,Be,r.ORDER))throw new Error("Point is not on curve");let K=d(_),X;try{X=r.sqrt(K)}catch(he){let we=he instanceof Error?": "+he.message:"";throw new Error("Point is not on curve"+we)}let se=(X&Be)===Be;return(A&1)===1!==se&&(X=r.neg(X)),{x:_,y:X}}else if(k===i&&A===4){let _=r.fromBytes($.subarray(0,r.BYTES)),K=r.fromBytes($.subarray(r.BYTES,2*r.BYTES));return{x:_,y:K}}else{let _=n,K=i;throw new Error("invalid Point, expected length of "+_+", or uncompressed "+K+", got "+k)}}}),h=N=>Ro(Lo(N,t.nByteLength));function p(N){let k=o>>Be;return N>k}function w(N){return p(N)?s(-N):N}let b=(N,k,A)=>Kr(N.slice(k,A));class v{constructor(k,A,$){this.r=k,this.s=A,this.recovery=$,this.assertValidity()}static fromCompact(k){let A=t.nByteLength;return k=It("compactSignature",k,A*2),new v(b(k,0,A),b(k,A,2*A))}static fromDER(k){let{r:A,s:$}=Yt.toSig(It("DER",k));return new v(A,$)}assertValidity(){Yr("r",this.r,Be,o),Yr("s",this.s,Be,o)}addRecoveryBit(k){return new v(this.r,this.s,k)}recoverPublicKey(k){let{r:A,s:$,recovery:_}=this,K=S(It("msgHash",k));if(_==null||![0,1,2,3].includes(_))throw new Error("recovery id invalid");let X=_===2||_===3?A+t.n:A;if(X>=r.ORDER)throw new Error("recovery id 2 or 3 invalid");let se=(_&1)===0?"02":"03",he=c.fromHex(se+h(X)),we=a(X),me=s(-K*we),Se=s($*we),He=c.BASE.multiplyAndAddUnsafe(he,me,Se);if(!He)throw new Error("point at infinify");return He.assertValidity(),He}hasHighS(){return p(this.s)}normalizeS(){return this.hasHighS()?new v(this.r,s(-this.s),this.recovery):this}toDERRawBytes(){return $o(this.toDERHex())}toDERHex(){return Yt.hexFromSig({r:this.r,s:this.s})}toCompactRawBytes(){return $o(this.toCompactHex())}toCompactHex(){return h(this.r)+h(this.s)}}let m={isValidPrivateKey(N){try{return l(N),!0}catch{return!1}},normPrivateKeyToScalar:l,randomPrivateKey:()=>{let N=Ou(t.n);return Sg(t.randomBytes(N),t.n)},precompute(N=8,k=c.BASE){return k._setWindowSize(N),k.multiply(BigInt(3)),k}};function x(N,k=!0){return c.fromPrivateKey(N).toRawBytes(k)}function C(N){let k=to(N),A=typeof N=="string",$=(k||A)&&N.length;return k?$===n||$===i:A?$===2*n||$===2*i:N instanceof c}function E(N,k,A=!0){if(C(N))throw new Error("first arg must be private key");if(!C(k))throw new Error("second arg must be public key");return c.fromHex(k).multiply(l(N)).toRawBytes(A)}let I=t.bits2int||function(N){if(N.length>8192)throw new Error("input is too large");let k=Kr(N),A=N.length*8-t.nBitLength;return A>0?k>>BigInt(A):k},S=t.bits2int_modN||function(N){return s(I(N))},j=Dl(t.nBitLength);function R(N){return Yr("num < 2^"+t.nBitLength,N,Xt,j),Lo(N,t.nByteLength)}function P(N,k,A=L){if(["recovered","canonical"].some(ot=>ot in A))throw new Error("sign() legacy options not supported");let{hash:$,randomBytes:_}=t,{lowS:K,prehash:X,extraEntropy:se}=A;K==null&&(K=!0),N=It("msgHash",N),Sd(A),X&&(N=It("prehashed msgHash",$(N)));let he=S(N),we=l(k),me=[R(we),R(he)];if(se!=null&&se!==!1){let ot=se===!0?_(r.BYTES):se;me.push(It("extraEntropy",ot))}let Se=Yn(...me),He=he;function Ct(ot){let Ge=I(ot);if(!u(Ge))return;let Le=a(Ge),Ke=c.BASE.multiply(Ge).toAffine(),nt=s(Ke.x);if(nt===Xt)return;let ut=s(Le*s(He+nt*we));if(ut===Xt)return;let ed=(Ke.x===nt?0:2)|Number(Ke.y&Be),td=ut;return K&&p(ut)&&(td=w(ut),ed^=1),new v(nt,td,ed)}return{seed:Se,k2sig:Ct}}let L={lowS:t.lowS,prehash:!1},B={lowS:t.lowS,prehash:!1};function ne(N,k,A=L){let{seed:$,k2sig:_}=P(N,k,A),K=t;return yu(K.hash.outputLen,K.nByteLength,K.hmac)($,_)}c.BASE._setWindowSize(8);function ge(N,k,A,$=B){let _=N;k=It("msgHash",k),A=It("publicKey",A);let{lowS:K,prehash:X,format:se}=$;if(Sd($),"strict"in $)throw new Error("options.strict was renamed to lowS");if(se!==void 0&&se!=="compact"&&se!=="der")throw new Error("format must be compact or der");let he=typeof _=="string"||to(_),we=!he&&!se&&typeof _=="object"&&_!==null&&typeof _.r=="bigint"&&typeof _.s=="bigint";if(!he&&!we)throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");let me,Se;try{if(we&&(me=new v(_.r,_.s)),he){try{se!=="compact"&&(me=v.fromDER(_))}catch(ut){if(!(ut instanceof Yt.Err))throw ut}!me&&se!=="der"&&(me=v.fromCompact(_))}Se=c.fromHex(A)}catch{return!1}if(!me||K&&me.hasHighS())return!1;X&&(k=t.hash(k));let{r:He,s:Ct}=me,ot=S(k),Ge=a(Ct),Le=s(ot*Ge),Ke=s(He*Ge),nt=c.BASE.multiplyAndAddUnsafe(Se,Le,Ke)?.toAffine();return nt?s(nt.x)===He:!1}return{CURVE:t,getPublicKey:x,getSharedSecret:E,sign:ne,verify:ge,ProjectivePoint:c,Signature:v,utils:m}}function zg(e){return{hash:e,hmac:(t,...r)=>Nu(e,t,Nh(...r)),randomBytes:Ih}}function Dg(e,t){let r=o=>Ug({...e,...zg(o)});return{...r(t),create:r}}var $u=BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),Od=BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),jg=BigInt(1),al=BigInt(2),Td=(e,t)=>(e+t/al)/t;function Wg(e){let t=$u,r=BigInt(3),o=BigInt(6),n=BigInt(11),i=BigInt(22),s=BigInt(23),a=BigInt(44),c=BigInt(88),l=e*e*e%t,d=l*l*e%t,u=pt(d,r,t)*d%t,h=pt(u,r,t)*d%t,p=pt(h,al,t)*l%t,w=pt(p,n,t)*p%t,b=pt(w,i,t)*w%t,v=pt(b,a,t)*b%t,m=pt(v,c,t)*v%t,x=pt(m,a,t)*b%t,C=pt(x,r,t)*d%t,E=pt(C,s,t)*w%t,I=pt(E,o,t)*l%t,S=pt(I,al,t);if(!cl.eql(cl.sqr(S),e))throw new Error("Cannot find square root");return S}var cl=Su($u,void 0,void 0,{sqrt:Wg});Dg({a:BigInt(0),b:BigInt(7),Fp:cl,n:Od,Gx:BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),Gy:BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),h:BigInt(1),lowS:!0,endo:{beta:BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),splitScalar:e=>{let t=Od,r=BigInt("0x3086d221a7d46bcde86c90e49284eb15"),o=-jg*BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),n=BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),i=r,s=BigInt("0x100000000000000000000000000000000"),a=Td(i*e,t),c=Td(-o*e,t),l=et(e-a*r-c*n,t),d=et(-a*o-c*i,t),u=l>s,h=d>s;if(u&&(l=t-l),h&&(d=t-d),l>s||d>s)throw new Error("splitScalar: Endomorphism failed, k="+e);return{k1neg:u,k1:l,k2neg:h,k2:d}}}},hu),BigInt(0);var ba={createBalance(e,t){let r={name:e.metadata.name||"",symbol:e.metadata.symbol||"",decimals:e.metadata.decimals||0,value:e.metadata.value||0,price:e.metadata.price||0,iconUrl:e.metadata.iconUrl||""};return{name:r.name,symbol:r.symbol,chainId:t,address:e.address==="native"?void 0:this.convertAddressToCAIP10Address(e.address,t),value:r.value,price:r.price,quantity:{decimals:r.decimals.toString(),numeric:this.convertHexToBalance({hex:e.balance,decimals:r.decimals})},iconUrl:r.iconUrl}},convertHexToBalance({hex:e,decimals:t}){return nu(BigInt(e),t)},convertAddressToCAIP10Address(e,t){return`${t}:${e}`},createCAIP2ChainId(e,t){return`${t}:${parseInt(e,16)}`},getChainIdHexFromCAIP2ChainId(e){let t=e.split(":");if(t.length<2||!t[1])return"0x0";let r=t[1],o=parseInt(r,10);return isNaN(o)?"0x0":`0x${o.toString(16)}`},isWalletGetAssetsResponse(e){return typeof e!="object"||e===null?!1:Object.values(e).every(t=>Array.isArray(t)&&t.every(r=>this.isValidAsset(r)))},isValidAsset(e){return typeof e=="object"&&e!==null&&typeof e.address=="string"&&typeof e.balance=="string"&&(e.type==="ERC20"||e.type==="NATIVE")&&typeof e.metadata=="object"&&e.metadata!==null&&typeof e.metadata.name=="string"&&typeof e.metadata.symbol=="string"&&typeof e.metadata.decimals=="number"&&typeof e.metadata.price=="number"&&typeof e.metadata.iconUrl=="string"}},Pd={async getMyTokensWithBalance(e){let t=J.state.address,r=g.state.activeCaipNetwork;if(!t||!r)return[];if(r.chainNamespace==="eip155"){let n=await this.getEIP155Balances(t,r);if(n)return this.filterLowQualityTokens(n)}let o=await re.getBalance(t,r.caipNetworkId,e);return this.filterLowQualityTokens(o.balances)},async getEIP155Balances(e,t){try{let r=ba.getChainIdHexFromCAIP2ChainId(t.caipNetworkId);if(!(await Y.getCapabilities(e))?.[r]?.assetDiscovery?.supported)return null;let o=await Y.walletGetAssets({account:e,chainFilter:[r]});return ba.isWalletGetAssetsResponse(o)?(o[r]||[]).map(n=>ba.createBalance(n,t.caipNetworkId)):null}catch{return null}},filterLowQualityTokens(e){return e.filter(t=>t.quantity.decimals!=="0")},mapBalancesToSwapTokens(e){return e?.map(t=>({...t,address:t?.address?t.address:g.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}},le=xe({tokenBalances:[],loading:!1}),Rd={state:le,subscribe(e){return je(le,()=>e(le))},subscribeKey(e,t){return qe(le,e,t)},setToken(e){e&&(le.token=Jr(e))},setTokenAmount(e){le.sendTokenAmount=e},setReceiverAddress(e){le.receiverAddress=e},setReceiverProfileImageUrl(e){le.receiverProfileImageUrl=e},setReceiverProfileName(e){le.receiverProfileName=e},setGasPrice(e){le.gasPrice=e},setGasPriceInUsd(e){le.gasPriceInUSD=e},setNetworkBalanceInUsd(e){le.networkBalanceInUSD=e},setLoading(e){le.loading=e},sendToken(){switch(g.state.activeCaipNetwork?.chainNamespace){case"eip155":this.sendEvmToken();return;case"solana":this.sendSolanaToken();return;default:throw new Error("Unsupported chain")}},sendEvmToken(){let e=g.state.activeChain,t=J.state.preferredAccountTypes?.[e];this.state.token?.address&&this.state.sendTokenAmount&&this.state.receiverAddress?(ce.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===ur.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token.address,amount:this.state.sendTokenAmount,network:g.state.activeCaipNetwork?.caipNetworkId||""}}),this.sendERC20Token({receiverAddress:this.state.receiverAddress,tokenAddress:this.state.token.address,sendTokenAmount:this.state.sendTokenAmount,decimals:this.state.token.quantity.decimals})):this.state.receiverAddress&&this.state.sendTokenAmount&&this.state.gasPrice&&this.state.token?.quantity.decimals&&(ce.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===ur.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token?.symbol,amount:this.state.sendTokenAmount,network:g.state.activeCaipNetwork?.caipNetworkId||""}}),this.sendNativeToken({receiverAddress:this.state.receiverAddress,sendTokenAmount:this.state.sendTokenAmount,gasPrice:this.state.gasPrice,decimals:this.state.token.quantity.decimals}))},async fetchTokenBalance(e){le.loading=!0;let t=g.state.activeCaipNetwork?.caipNetworkId,r=g.state.activeCaipNetwork?.chainNamespace,o=g.state.activeCaipAddress,n=o?M.getPlainAddress(o):void 0;if(le.lastRetry&&!M.isAllowedRetry(le.lastRetry,30*Re.ONE_SEC_MS))return le.loading=!1,[];try{if(n&&t&&r){let i=await Pd.getMyTokensWithBalance();return le.tokenBalances=i,le.lastRetry=void 0,i}}catch(i){le.lastRetry=Date.now(),e?.(i),Ce.showError("Token Balance Unavailable")}finally{le.loading=!1}return[]},fetchNetworkBalance(){if(le.tokenBalances.length===0)return;let e=Pd.mapBalancesToSwapTokens(le.tokenBalances);if(!e)return;let t=e.find(r=>r.address===g.getActiveNetworkTokenAddress());t&&(le.networkBalanceInUSD=t?pi.multiply(t.quantity.numeric,t.price).toString():"0")},isInsufficientNetworkTokenForGas(e,t){let r=t||"0";return pi.bigNumber(e).eq(0)?!0:pi.bigNumber(pi.bigNumber(r)).gt(e)},hasInsufficientGasFunds(){let e=g.state.activeChain,t=!0;return J.state.preferredAccountTypes?.[e]===ur.ACCOUNT_TYPES.SMART_ACCOUNT?t=!1:le.networkBalanceInUSD&&(t=this.isInsufficientNetworkTokenForGas(le.networkBalanceInUSD,le.gasPriceInUSD)),t},async sendNativeToken(e){let t=g.state.activeChain;D.pushTransactionStack({view:"Account",goBack:!1});let r=e.receiverAddress,o=J.state.address,n=Y.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals)),i="0x";try{await Y.sendTransaction({chainNamespace:"eip155",to:r,address:o,data:i,value:n??BigInt(0),gasPrice:e.gasPrice}),Ce.showSuccess("Transaction started"),ce.sendEvent({type:"track",event:"SEND_SUCCESS",properties:{isSmartAccount:J.state.preferredAccountTypes?.[t]===ur.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token?.symbol||"",amount:e.sendTokenAmount,network:g.state.activeCaipNetwork?.caipNetworkId||""}}),this.resetSend()}catch(s){console.error("SendController:sendERC20Token - failed to send native token",s);let a=s instanceof Error?s.message:"Unknown error";ce.sendEvent({type:"track",event:"SEND_ERROR",properties:{message:a,isSmartAccount:J.state.preferredAccountTypes?.[t]===ur.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token?.symbol||"",amount:e.sendTokenAmount,network:g.state.activeCaipNetwork?.caipNetworkId||""}}),Ce.showError("Something went wrong")}},async sendERC20Token(e){D.pushTransactionStack({view:"Account",goBack:!1});let t=Y.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));try{if(J.state.address&&e.sendTokenAmount&&e.receiverAddress&&e.tokenAddress){let r=M.getPlainAddress(e.tokenAddress);await Y.writeContract({fromAddress:J.state.address,tokenAddress:r,args:[e.receiverAddress,t??BigInt(0)],method:"transfer",abi:j1.getERC20Abi(r),chainNamespace:"eip155"}),Ce.showSuccess("Transaction started"),this.resetSend()}}catch(r){console.error("SendController:sendERC20Token - failed to send erc20 token",r);let o=r instanceof Error?r.message:"Unknown error";ce.sendEvent({type:"track",event:"SEND_ERROR",properties:{message:o,isSmartAccount:J.state.preferredAccountTypes?.eip155===ur.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token?.symbol||"",amount:e.sendTokenAmount,network:g.state.activeCaipNetwork?.caipNetworkId||""}}),Ce.showError("Something went wrong")}},sendSolanaToken(){if(!this.state.sendTokenAmount||!this.state.receiverAddress){Ce.showError("Please enter a valid amount and receiver address");return}D.pushTransactionStack({view:"Account",goBack:!1}),Y.sendTransaction({chainNamespace:"solana",to:this.state.receiverAddress,value:this.state.sendTokenAmount}).then(()=>{this.resetSend(),J.fetchTokenBalance()}).catch(e=>{Ce.showError("Failed to send transaction. Please try again."),console.error("SendController:sendToken - failed to send solana transaction",e)})},resetSend(){le.token=void 0,le.sendTokenAmount=void 0,le.receiverAddress=void 0,le.receiverProfileImageUrl=void 0,le.receiverProfileName=void 0,le.loading=!1,le.tokenBalances=[]}},ya={currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[],user:void 0},Ci={caipNetwork:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]},z=xe({chains:q1(),activeCaipAddress:void 0,activeChain:void 0,activeCaipNetwork:void 0,noAdapters:!1,universalAdapter:{networkControllerClient:void 0,connectionControllerClient:void 0},isSwitchingNamespace:!1}),g={state:z,subscribe(e){return je(z,()=>{e(z)})},subscribeKey(e,t){return qe(z,e,t)},subscribeChainProp(e,t,r){let o;return je(z.chains,()=>{let n=r||z.activeChain;if(n){let i=z.chains.get(n)?.[e];o!==i&&(o=i,t(i))}})},initialize(e,t,r){let{chainId:o,namespace:n}=q.getActiveNetworkProps(),i=t?.find(c=>c.id.toString()===o?.toString()),s=e.find(c=>c?.namespace===n)||e?.[0],a=new Set([...t?.map(c=>c.chainNamespace)??[]]);(e?.length===0||!s)&&(z.noAdapters=!0),z.noAdapters||(z.activeChain=s?.namespace,z.activeCaipNetwork=i,this.setChainNetworkData(s?.namespace,{caipNetwork:i}),z.activeChain&&Qt.set({activeChain:s?.namespace})),a.forEach(c=>{let l=t?.filter(d=>d.chainNamespace===c);g.state.chains.set(c,{namespace:c,networkState:xe({...Ci,caipNetwork:l?.[0]}),accountState:xe(ya),caipNetworks:l??[],...r}),this.setRequestedCaipNetworks(l??[],c)})},removeAdapter(e){if(z.activeChain===e){let t=Array.from(z.chains.entries()).find(([r])=>r!==e);if(t){let r=t[1]?.caipNetworks?.[0];r&&this.setActiveCaipNetwork(r)}}z.chains.delete(e)},addAdapter(e,{networkControllerClient:t,connectionControllerClient:r},o){z.chains.set(e.namespace,{namespace:e.namespace,networkState:{...Ci,caipNetwork:o[0]},accountState:ya,caipNetworks:o,connectionControllerClient:r,networkControllerClient:t}),this.setRequestedCaipNetworks(o?.filter(n=>n.chainNamespace===e.namespace)??[],e.namespace)},addNetwork(e){let t=z.chains.get(e.chainNamespace);if(t){let r=[...t.caipNetworks||[]];t.caipNetworks?.find(o=>o.id===e.id)||r.push(e),z.chains.set(e.chainNamespace,{...t,caipNetworks:r}),this.setRequestedCaipNetworks(r,e.chainNamespace)}},removeNetwork(e,t){let r=z.chains.get(e);if(r){let o=z.activeCaipNetwork?.id===t,n=[...r.caipNetworks?.filter(i=>i.id!==t)||[]];o&&r?.caipNetworks?.[0]&&this.setActiveCaipNetwork(r.caipNetworks[0]),z.chains.set(e,{...r,caipNetworks:n}),this.setRequestedCaipNetworks(n||[],e)}},setAdapterNetworkState(e,t){let r=z.chains.get(e);r&&(r.networkState={...r.networkState||Ci,...t},z.chains.set(e,r))},setChainAccountData(e,t,r=!0){if(!e)throw new Error("Chain is required to update chain account data");let o=z.chains.get(e);if(o){let n={...o.accountState||ya,...t};z.chains.set(e,{...o,accountState:n}),(z.chains.size===1||z.activeChain===e)&&(t.caipAddress&&(z.activeCaipAddress=t.caipAddress),J.replaceState(n))}},setChainNetworkData(e,t){if(!e)return;let r=z.chains.get(e);if(r){let o={...r.networkState||Ci,...t};z.chains.set(e,{...r,networkState:o})}},setAccountProp(e,t,r,o=!0){this.setChainAccountData(r,{[e]:t},o),e==="status"&&t==="disconnected"&&r&&H.removeConnectorId(r)},setActiveNamespace(e){z.activeChain=e;let t=e?z.chains.get(e):void 0,r=t?.networkState?.caipNetwork;r?.id&&e&&(z.activeCaipAddress=t?.accountState?.caipAddress,z.activeCaipNetwork=r,this.setChainNetworkData(e,{caipNetwork:r}),q.setActiveCaipNetworkId(r?.caipNetworkId),Qt.set({activeChain:e,selectedNetworkId:r?.caipNetworkId}))},setActiveCaipNetwork(e){if(!e)return;z.activeChain!==e.chainNamespace&&this.setIsSwitchingNamespace(!0);let t=z.chains.get(e.chainNamespace);z.activeChain=e.chainNamespace,z.activeCaipNetwork=e,this.setChainNetworkData(e.chainNamespace,{caipNetwork:e}),t?.accountState?.address?z.activeCaipAddress=`${e.chainNamespace}:${e.id}:${t?.accountState?.address}`:z.activeCaipAddress=void 0,this.setAccountProp("caipAddress",z.activeCaipAddress,e.chainNamespace),t&&J.replaceState(t.accountState),Rd.resetSend(),Qt.set({activeChain:z.activeChain,selectedNetworkId:z.activeCaipNetwork?.caipNetworkId}),q.setActiveCaipNetworkId(e.caipNetworkId),!this.checkIfSupportedNetwork(e.chainNamespace)&&O.state.enableNetworkSwitch&&!O.state.allowUnsupportedChain&&!Y.state.wcBasic&&this.showUnsupportedChainUI()},addCaipNetwork(e){if(!e)return;let t=z.chains.get(e.chainNamespace);t&&t?.caipNetworks?.push(e)},async switchActiveNamespace(e){if(!e)return;let t=e!==g.state.activeChain,r=g.getNetworkData(e)?.caipNetwork,o=g.getCaipNetworkByNamespace(e,r?.id);t&&o&&await g.switchActiveNetwork(o)},async switchActiveNetwork(e){!g.state.chains.get(g.state.activeChain)?.caipNetworks?.some(r=>r.id===z.activeCaipNetwork?.id)&&D.goBack();let t=this.getNetworkControllerClient(e.chainNamespace);t&&(await t.switchCaipNetwork(e),ce.sendEvent({type:"track",event:"SWITCH_NETWORK",properties:{network:e.caipNetworkId}}))},getNetworkControllerClient(e){let t=e||z.activeChain,r=z.chains.get(t);if(!r)throw new Error("Chain adapter not found");if(!r.networkControllerClient)throw new Error("NetworkController client not set");return r.networkControllerClient},getConnectionControllerClient(e){let t=e||z.activeChain;if(!t)throw new Error("Chain is required to get connection controller client");let r=z.chains.get(t);if(!r?.connectionControllerClient)throw new Error("ConnectionController client not set");return r.connectionControllerClient},getAccountProp(e,t){let r=z.activeChain;if(t&&(r=t),!r)return;let o=z.chains.get(r)?.accountState;if(o)return o[e]},getNetworkProp(e,t){let r=z.chains.get(t)?.networkState;if(r)return r[e]},getRequestedCaipNetworks(e){let t=z.chains.get(e),{approvedCaipNetworkIds:r=[],requestedCaipNetworks:o=[]}=t?.networkState||{};return M.sortRequestedNetworks(r,o)},getAllRequestedCaipNetworks(){let e=[];return z.chains.forEach(t=>{let r=this.getRequestedCaipNetworks(t.namespace);e.push(...r)}),e},setRequestedCaipNetworks(e,t){this.setAdapterNetworkState(t,{requestedCaipNetworks:e})},getAllApprovedCaipNetworkIds(){let e=[];return z.chains.forEach(t=>{let r=this.getApprovedCaipNetworkIds(t.namespace);e.push(...r)}),e},getActiveCaipNetwork(){return z.activeCaipNetwork},getActiveCaipAddress(){return z.activeCaipAddress},getApprovedCaipNetworkIds(e){return z.chains.get(e)?.networkState?.approvedCaipNetworkIds||[]},async setApprovedCaipNetworksData(e){let t=await this.getNetworkControllerClient()?.getApprovedCaipNetworksData();this.setAdapterNetworkState(e,{approvedCaipNetworkIds:t?.approvedCaipNetworkIds,supportsAllNetworks:t?.supportsAllNetworks})},checkIfSupportedNetwork(e,t){let r=t||z.activeCaipNetwork,o=this.getRequestedCaipNetworks(e);return o.length?o?.some(n=>n.id===r?.id):!0},checkIfSupportedChainId(e){return z.activeChain?this.getRequestedCaipNetworks(z.activeChain)?.some(t=>t.id===e):!0},setSmartAccountEnabledNetworks(e,t){this.setAdapterNetworkState(t,{smartAccountEnabledNetworks:e})},checkIfSmartAccountEnabled(){let e=j0.caipNetworkIdToNumber(z.activeCaipNetwork?.caipNetworkId),t=z.activeChain;return!t||!e?!1:!!this.getNetworkProp("smartAccountEnabledNetworks",t)?.includes(Number(e))},getActiveNetworkTokenAddress(){let e=z.activeCaipNetwork?.chainNamespace||"eip155",t=z.activeCaipNetwork?.id||1,r=Re.NATIVE_TOKEN_ADDRESS[e];return`${e}:${t}:${r}`},showUnsupportedChainUI(){de.open({view:"UnsupportedChain"})},checkIfNamesSupported(){let e=z.activeCaipNetwork;return!!(e?.chainNamespace&&Re.NAMES_SUPPORTED_CHAIN_NAMESPACES.includes(e.chainNamespace))},resetNetwork(e){this.setAdapterNetworkState(e,{approvedCaipNetworkIds:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]})},resetAccount(e){let t=e;if(!t)throw new Error("Chain is required to set account prop");z.activeCaipAddress=void 0,this.setChainAccountData(t,{smartAccountDeployed:!1,currentTab:0,caipAddress:void 0,address:void 0,balance:void 0,balanceSymbol:void 0,profileName:void 0,profileImage:void 0,addressExplorerUrl:void 0,tokenBalance:[],connectedWalletInfo:void 0,preferredAccountTypes:void 0,socialProvider:void 0,socialWindow:void 0,farcasterUrl:void 0,allAccounts:[],user:void 0,status:"disconnected"}),H.removeConnectorId(t)},async disconnect(e){let t=ih(e);try{Rd.resetSend();let r=await Promise.allSettled(t.map(async([n,i])=>{try{let{caipAddress:s}=this.getAccountData(n)||{};s&&i.connectionControllerClient?.disconnect&&await i.connectionControllerClient.disconnect(n),this.resetAccount(n),this.resetNetwork(n)}catch(s){throw new Error(`Failed to disconnect chain ${n}: ${s.message}`)}}));Y.resetWcConnection();let o=r.filter(n=>n.status==="rejected");if(o.length>0)throw new Error(o.map(n=>n.reason.message).join(", "));q.deleteConnectedSocialProvider(),e?H.removeConnectorId(e):H.resetConnectorIds(),ce.sendEvent({type:"track",event:"DISCONNECT_SUCCESS",properties:{namespace:e||"all"}})}catch(r){console.error(r.message||"Failed to disconnect chains"),ce.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:r.message||"Failed to disconnect chains"}})}},setIsSwitchingNamespace(e){z.isSwitchingNamespace=e},getFirstCaipNetworkSupportsAuthConnector(){let e=[],t;if(z.chains.forEach(r=>{G.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(o=>o===r.namespace)&&r.namespace&&e.push(r.namespace)}),e.length>0){let r=e[0];return t=r?z.chains.get(r)?.caipNetworks?.[0]:void 0,t}},getAccountData(e){return e?g.state.chains.get(e)?.accountState:J.state},getNetworkData(e){let t=e||z.activeChain;if(t)return g.state.chains.get(t)?.networkState},getCaipNetworkByNamespace(e,t){if(!e)return;let r=g.state.chains.get(e);return r?.caipNetworks?.find(n=>n.id===t)||r?.networkState?.caipNetwork||r?.caipNetworks?.[0]},getRequestedCaipNetworkIds(){let e=H.state.filterByNamespace;return(e?[z.chains.get(e)]:Array.from(z.chains.values())).flatMap(t=>t?.caipNetworks||[]).map(t=>t.caipNetworkId)},getCaipNetworks(e){return e?g.getRequestedCaipNetworks(e):g.getAllRequestedCaipNetworks()}},Hg={purchaseCurrencies:[{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"Ether",symbol:"ETH",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]}],paymentCurrencies:[{id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},{id:"EUR",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]}]},Lu=M.getBlockchainApiUrl(),at=xe({clientId:null,api:new Ao({baseUrl:Lu,clientId:null}),supportedChains:{http:[],ws:[]}}),re={state:at,async get(e){let{st:t,sv:r}=re.getSdkProperties(),o=O.state.projectId,n={...e.params||{},st:t,sv:r,projectId:o};return at.api.get({...e,params:n})},getSdkProperties(){let{sdkType:e,sdkVersion:t}=O.state;return{st:e||"unknown",sv:t||"unknown"}},async isNetworkSupported(e){if(!e)return!1;try{at.supportedChains.http.length||await re.getSupportedNetworks()}catch{return!1}return at.supportedChains.http.includes(e)},async getSupportedNetworks(){let e=await re.get({path:"v1/supported-chains"});return at.supportedChains=e,e},async fetchIdentity({address:e,caipNetworkId:t}){if(!await re.isNetworkSupported(t))return{avatar:"",name:""};let r=q.getIdentityFromCacheForAddress(e);if(r)return r;let o=await re.get({path:`/v1/identity/${e}`,params:{sender:g.state.activeCaipAddress?M.getPlainAddress(g.state.activeCaipAddress):void 0}});return q.updateIdentityCache({address:e,identity:o,timestamp:Date.now()}),o},async fetchTransactions({account:e,cursor:t,onramp:r,signal:o,cache:n,chainId:i}){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?re.get({path:`/v1/account/${e}/history`,params:{cursor:t,onramp:r,chainId:i},signal:o,cache:n}):{data:[],next:void 0}},async fetchSwapQuote({amount:e,userAddress:t,from:r,to:o,gasPrice:n}){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?re.get({path:"/v1/convert/quotes",headers:{"Content-Type":"application/json"},params:{amount:e,userAddress:t,from:r,to:o,gasPrice:n}}):{quotes:[]}},async fetchSwapTokens({chainId:e}){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?re.get({path:"/v1/convert/tokens",params:{chainId:e}}):{tokens:[]}},async fetchTokenPrice({addresses:e}){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?at.api.post({path:"/v1/fungible/price",body:{currency:"usd",addresses:e,projectId:O.state.projectId},headers:{"Content-Type":"application/json"}}):{fungibles:[]}},async fetchSwapAllowance({tokenAddress:e,userAddress:t}){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?re.get({path:"/v1/convert/allowance",params:{tokenAddress:e,userAddress:t},headers:{"Content-Type":"application/json"}}):{allowance:"0"}},async fetchGasPrice({chainId:e}){let{st:t,sv:r}=re.getSdkProperties();if(!await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Gas Price");return re.get({path:"/v1/convert/gas-price",headers:{"Content-Type":"application/json"},params:{chainId:e,st:t,sv:r}})},async generateSwapCalldata({amount:e,from:t,to:r,userAddress:o,disableEstimate:n}){if(!await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return at.api.post({path:"/v1/convert/build-transaction",headers:{"Content-Type":"application/json"},body:{amount:e,eip155:{slippage:Re.CONVERT_SLIPPAGE_TOLERANCE},projectId:O.state.projectId,from:t,to:r,userAddress:o,disableEstimate:n}})},async generateApproveCalldata({from:e,to:t,userAddress:r}){let{st:o,sv:n}=re.getSdkProperties();if(!await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return re.get({path:"/v1/convert/build-approve",headers:{"Content-Type":"application/json"},params:{userAddress:r,from:e,to:t,st:o,sv:n}})},async getBalance(e,t,r){let{st:o,sv:n}=re.getSdkProperties();if(!await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId))return Ce.showError("Token Balance Unavailable"),{balances:[]};let i=`${t}:${e}`,s=q.getBalanceCacheForCaipAddress(i);if(s)return s;let a=await re.get({path:`/v1/account/${e}/balance`,params:{currency:"usd",chainId:t,forceUpdate:r,st:o,sv:n}});return q.updateBalanceCache({caipAddress:i,balance:a,timestamp:Date.now()}),a},async lookupEnsName(e){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?re.get({path:`/v1/profile/account/${e}`,params:{apiVersion:"2"}}):{addresses:{},attributes:[]}},async reverseLookupEnsName({address:e}){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?re.get({path:`/v1/profile/reverse/${e}`,params:{sender:J.state.address,apiVersion:"2"}}):[]},async getEnsNameSuggestions(e){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?re.get({path:`/v1/profile/suggestions/${e}`,params:{zone:"reown.id"}}):{suggestions:[]}},async registerEnsName({coinType:e,address:t,message:r,signature:o}){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?at.api.post({path:"/v1/profile/account",body:{coin_type:e,address:t,message:r,signature:o},headers:{"Content-Type":"application/json"}}):{success:!1}},async generateOnRampURL({destinationWallets:e,partnerUserId:t,defaultNetwork:r,purchaseAmount:o,paymentAmount:n}){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?(await at.api.post({path:"/v1/generators/onrampurl",params:{projectId:O.state.projectId},body:{destinationWallets:e,defaultNetwork:r,partnerUserId:t,defaultExperience:"buy",presetCryptoAmount:o,presetFiatAmount:n}})).url:""},async getOnrampOptions(){if(!await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId))return{paymentCurrencies:[],purchaseCurrencies:[]};try{return await re.get({path:"/v1/onramp/options"})}catch{return Hg}},async getOnrampQuote({purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}){try{return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?await at.api.post({path:"/v1/onramp/quote",params:{projectId:O.state.projectId},body:{purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}}):null}catch{return{coinbaseFee:{amount:r,currency:t.id},networkFee:{amount:r,currency:t.id},paymentSubtotal:{amount:r,currency:t.id},paymentTotal:{amount:r,currency:t.id},purchaseAmount:{amount:r,currency:t.id},quoteId:"mocked-quote-id"}}},async getSmartSessions(e){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?re.get({path:`/v1/sessions/${e}`}):[]},async revokeSmartSession(e,t,r){return await re.isNetworkSupported(g.state.activeCaipNetwork?.caipNetworkId)?at.api.post({path:`/v1/sessions/${e}/revoke`,params:{projectId:O.state.projectId},body:{pci:t,signature:r}}):{success:!1}},setClientId(e){at.clientId=e,at.api=new Ao({baseUrl:Lu,clientId:e})}},gt=xe({currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[]}),J={state:gt,replaceState(e){e&&Object.assign(gt,Jr(e))},subscribe(e){return g.subscribeChainProp("accountState",t=>{if(t)return e(t)})},subscribeKey(e,t,r){let o;return g.subscribeChainProp("accountState",n=>{if(n){let i=n[e];o!==i&&(o=i,t(i))}},r)},setStatus(e,t){g.setAccountProp("status",e,t)},getCaipAddress(e){return g.getAccountProp("caipAddress",e)},setCaipAddress(e,t){let r=e?M.getPlainAddress(e):void 0;t===g.state.activeChain&&(g.state.activeCaipAddress=e),g.setAccountProp("caipAddress",e,t),g.setAccountProp("address",r,t)},setBalance(e,t,r){g.setAccountProp("balance",e,r),g.setAccountProp("balanceSymbol",t,r)},setProfileName(e,t){g.setAccountProp("profileName",e,t)},setProfileImage(e,t){g.setAccountProp("profileImage",e,t)},setUser(e,t){g.setAccountProp("user",e,t)},setAddressExplorerUrl(e,t){g.setAccountProp("addressExplorerUrl",e,t)},setSmartAccountDeployed(e,t){g.setAccountProp("smartAccountDeployed",e,t)},setCurrentTab(e){g.setAccountProp("currentTab",e,g.state.activeChain)},setTokenBalance(e,t){e&&g.setAccountProp("tokenBalance",e,t)},setShouldUpdateToAddress(e,t){g.setAccountProp("shouldUpdateToAddress",e,t)},setAllAccounts(e,t){g.setAccountProp("allAccounts",e,t)},addAddressLabel(e,t,r){let o=g.getAccountProp("addressLabels",r)||new Map;o.set(e,t),g.setAccountProp("addressLabels",o,r)},removeAddressLabel(e,t){let r=g.getAccountProp("addressLabels",t)||new Map;r.delete(e),g.setAccountProp("addressLabels",r,t)},setConnectedWalletInfo(e,t){g.setAccountProp("connectedWalletInfo",e,t,!1)},setPreferredAccountType(e,t){g.setAccountProp("preferredAccountTypes",{...gt.preferredAccountTypes,[t]:e},t)},setPreferredAccountTypes(e){gt.preferredAccountTypes=e},setSocialProvider(e,t){e&&g.setAccountProp("socialProvider",e,t)},setSocialWindow(e,t){g.setAccountProp("socialWindow",e?Jr(e):void 0,t)},setFarcasterUrl(e,t){g.setAccountProp("farcasterUrl",e,t)},async fetchTokenBalance(e){gt.balanceLoading=!0;let t=g.state.activeCaipNetwork?.caipNetworkId,r=g.state.activeCaipNetwork?.chainNamespace,o=g.state.activeCaipAddress,n=o?M.getPlainAddress(o):void 0;if(gt.lastRetry&&!M.isAllowedRetry(gt.lastRetry,30*Re.ONE_SEC_MS))return gt.balanceLoading=!1,[];try{if(n&&t&&r){let i=(await re.getBalance(n,t)).balances.filter(s=>s.quantity.decimals!=="0");return this.setTokenBalance(i,r),gt.lastRetry=void 0,gt.balanceLoading=!1,i}}catch(i){gt.lastRetry=Date.now(),e?.(i),Ce.showError("Token Balance Unavailable")}finally{gt.balanceLoading=!1}return[]},resetAccount(e){g.resetAccount(e)}},Ye=xe({loading:!1,loadingNamespaceMap:new Map,open:!1,shake:!1,namespace:void 0}),de={state:Ye,subscribe(e){return je(Ye,()=>e(Ye))},subscribeKey(e,t){return qe(Ye,e,t)},async open(e){let t=J.state.status==="connected";Y.state.wcBasic?W.prefetch({fetchNetworkImages:!1,fetchConnectorImages:!1}):await W.prefetch({fetchConnectorImages:!t,fetchFeaturedWallets:!t,fetchRecommendedWallets:!t}),e?.namespace?(await g.switchActiveNamespace(e.namespace),de.setLoading(!0,e.namespace)):de.setLoading(!0),H.setFilterByNamespace(e?.namespace);let r=g.getAccountData(e?.namespace)?.caipAddress;g.state.noAdapters&&!r?M.isMobile()?D.reset("AllWallets"):D.reset("ConnectingWalletConnectBasic"):e?.view?D.reset(e.view,e.data):r?D.reset("Account"):D.reset("Connect"),Ye.open=!0,Qt.set({open:!0}),ce.sendEvent({type:"track",event:"MODAL_OPEN",properties:{connected:!!r}})},close(){let e=O.state.enableEmbedded,t=!!g.state.activeCaipAddress;Ye.open&&ce.sendEvent({type:"track",event:"MODAL_CLOSE",properties:{connected:t}}),Ye.open=!1,de.clearLoading(),e?t?D.replace("Account"):D.push("Connect"):Qt.set({open:!1}),Y.resetUri()},setLoading(e,t){t&&Ye.loadingNamespaceMap.set(t,e),Ye.loading=e,Qt.set({loading:e})},clearLoading(){Ye.loadingNamespaceMap.clear(),Ye.loading=!1},shake(){Ye.shake||(Ye.shake=!0,setTimeout(()=>{Ye.shake=!1},500))}},$d={id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},Fg={id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},Vg={providers:G1,selectedProvider:null,error:null,purchaseCurrency:$d,paymentCurrency:Fg,purchaseCurrencies:[$d],paymentCurrencies:[],quotesLoading:!1};xe(Vg);var Zg={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:Re.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0};xe(Zg);var xt=xe({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),wo={state:xt,subscribe(e){return je(xt,()=>e(xt))},subscribeKey(e,t){return qe(xt,e,t)},showTooltip({message:e,triggerRect:t,variant:r}){xt.open=!0,xt.message=e,xt.triggerRect=t,xt.variant=r},hide(){xt.open=!1,xt.message="",xt.triggerRect={width:0,height:0,top:0,left:0}}},Ld=2147483648,qg={convertEVMChainIdToCoinType(e){if(e>=Ld)throw new Error("Invalid chainId");return(Ld|e)>>>0}},ft=xe({suggestions:[],loading:!1}),Bu={state:ft,subscribe(e){return je(ft,()=>e(ft))},subscribeKey(e,t){return qe(ft,e,t)},async resolveName(e){try{return await re.lookupEnsName(e)}catch(t){let r=t;throw new Error(r?.reasons?.[0]?.description||"Error resolving name")}},async isNameRegistered(e){try{return await re.lookupEnsName(e),!0}catch{return!1}},async getSuggestions(e){try{ft.loading=!0,ft.suggestions=[];let t=await re.getEnsNameSuggestions(e);return ft.suggestions=t.suggestions.map(r=>({...r,name:r.name}))||[],ft.suggestions}catch(t){let r=this.parseEnsApiError(t,"Error fetching name suggestions");throw new Error(r)}finally{ft.loading=!1}},async getNamesForAddress(e){try{if(!g.state.activeCaipNetwork)return[];let t=q.getEnsFromCacheForAddress(e);if(t)return t;let r=await re.reverseLookupEnsName({address:e});return q.updateEnsCache({address:e,ens:r,timestamp:Date.now()}),r}catch(t){let r=this.parseEnsApiError(t,"Error fetching names for address");throw new Error(r)}},async registerName(e){let t=g.state.activeCaipNetwork;if(!t)throw new Error("Network not found");let r=J.state.address,o=H.getAuthConnector();if(!r||!o)throw new Error("Address or auth connector not found");ft.loading=!0;try{let n=JSON.stringify({name:e,attributes:{},timestamp:Math.floor(Date.now()/1e3)});D.pushTransactionStack({view:"RegisterAccountNameSuccess",goBack:!1,replace:!0,onCancel(){ft.loading=!1}});let i=await Y.signMessage(n),s=t.id;if(!s)throw new Error("Network not found");let a=qg.convertEVMChainIdToCoinType(Number(s));await re.registerEnsName({coinType:a,address:r,signature:i,message:n}),J.setProfileName(e,t.chainNamespace),D.replace("RegisterAccountNameSuccess")}catch(n){let i=this.parseEnsApiError(n,`Error registering name ${e}`);throw D.replace("RegisterAccountName"),new Error(i)}finally{ft.loading=!1}},validateName(e){return/^[a-zA-Z0-9-]{4,}$/u.test(e)},parseEnsApiError(e,t){return e?.reasons?.[0]?.description||t}};xe({isLegalCheckboxChecked:!1});var Te={METMASK_CONNECTOR_NAME:"MetaMask",TRUST_CONNECTOR_NAME:"Trust Wallet",SOLFLARE_CONNECTOR_NAME:"Solflare",PHANTOM_CONNECTOR_NAME:"Phantom",COIN98_CONNECTOR_NAME:"Coin98",MAGIC_EDEN_CONNECTOR_NAME:"Magic Eden",BACKPACK_CONNECTOR_NAME:"Backpack",BITGET_CONNECTOR_NAME:"Bitget Wallet",FRONTIER_CONNECTOR_NAME:"Frontier",XVERSE_CONNECTOR_NAME:"Xverse Wallet",LEATHER_CONNECTOR_NAME:"Leather",EIP155:"eip155",ADD_CHAIN_METHOD:"wallet_addEthereumChain",EIP6963_ANNOUNCE_EVENT:"eip6963:announceProvider",EIP6963_REQUEST_EVENT:"eip6963:requestProvider",CONNECTOR_RDNS_MAP:{coinbaseWallet:"com.coinbase.wallet",coinbaseWalletSDK:"com.coinbase.wallet"},CONNECTOR_TYPE_EXTERNAL:"EXTERNAL",CONNECTOR_TYPE_WALLET_CONNECT:"WALLET_CONNECT",CONNECTOR_TYPE_INJECTED:"INJECTED",CONNECTOR_TYPE_ANNOUNCED:"ANNOUNCED",CONNECTOR_TYPE_AUTH:"AUTH",CONNECTOR_TYPE_MULTI_CHAIN:"MULTI_CHAIN",CONNECTOR_TYPE_W3M_AUTH:"ID_AUTH"},Ss={ConnectorExplorerIds:{[G.CONNECTOR_ID.COINBASE]:"fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",[G.CONNECTOR_ID.COINBASE_SDK]:"fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",[G.CONNECTOR_ID.SAFE]:"225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f",[G.CONNECTOR_ID.LEDGER]:"19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",[G.CONNECTOR_ID.OKX]:"971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",[Te.METMASK_CONNECTOR_NAME]:"c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",[Te.TRUST_CONNECTOR_NAME]:"4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",[Te.SOLFLARE_CONNECTOR_NAME]:"1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79",[Te.PHANTOM_CONNECTOR_NAME]:"a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",[Te.COIN98_CONNECTOR_NAME]:"2a3c89040ac3b723a1972a33a125b1db11e258a6975d3a61252cd64e6ea5ea01",[Te.MAGIC_EDEN_CONNECTOR_NAME]:"8b830a2b724a9c3fbab63af6f55ed29c9dfa8a55e732dc88c80a196a2ba136c6",[Te.BACKPACK_CONNECTOR_NAME]:"2bd8c14e035c2d48f184aaa168559e86b0e3433228d3c4075900a221785019b0",[Te.BITGET_CONNECTOR_NAME]:"38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",[Te.FRONTIER_CONNECTOR_NAME]:"85db431492aa2e8672e93f4ea7acf10c88b97b867b0d373107af63dc4880f041",[Te.XVERSE_CONNECTOR_NAME]:"2a87d74ae02e10bdd1f51f7ce6c4e1cc53cd5f2c0b6b5ad0d7b3007d2b13de7b",[Te.LEATHER_CONNECTOR_NAME]:"483afe1df1df63daf313109971ff3ef8356ddf1cc4e45877d205eee0b7893a13"},NetworkImageIds:{1:"ba0ba0cd-17c6-4806-ad93-f9d174f17900",42161:"3bff954d-5cb0-47a0-9a23-d20192e74600",43114:"30c46e53-e989-45fb-4549-be3bd4eb3b00",56:"93564157-2e8e-4ce7-81df-b264dbee9b00",250:"06b26297-fe0c-4733-5d6b-ffa5498aac00",10:"ab9c186a-c52f-464b-2906-ca59d760a400",137:"41d04d42-da3b-4453-8506-668cc0727900",5e3:"e86fae9b-b770-4eea-e520-150e12c81100",295:"6a97d510-cac8-4e58-c7ce-e8681b044c00",11155111:"e909ea0a-f92a-4512-c8fc-748044ea6800",84532:"a18a7ecd-e307-4360-4746-283182228e00",1301:"4eeea7ef-0014-4649-5d1d-07271a80f600",130:"2257980a-3463-48c6-cbac-a42d2a956e00",10143:"0a728e83-bacb-46db-7844-948f05434900",100:"02b53f6a-e3d4-479e-1cb4-21178987d100",9001:"f926ff41-260d-4028-635e-91913fc28e00",324:"b310f07f-4ef7-49f3-7073-2a0a39685800",314:"5a73b3dd-af74-424e-cae0-0de859ee9400",4689:"34e68754-e536-40da-c153-6ef2e7188a00",1088:"3897a66d-40b9-4833-162f-a2c90531c900",1284:"161038da-44ae-4ec7-1208-0ea569454b00",1285:"f1d73bb6-5450-4e18-38f7-fb6484264a00",7777777:"845c60df-d429-4991-e687-91ae45791600",42220:"ab781bbc-ccc6-418d-d32d-789b15da1f00",8453:"7289c336-3981-4081-c5f4-efc26ac64a00",1313161554:"3ff73439-a619-4894-9262-4470c773a100",2020:"b8101fc0-9c19-4b6f-ec65-f6dfff106e00",2021:"b8101fc0-9c19-4b6f-ec65-f6dfff106e00",80094:"e329c2c9-59b0-4a02-83e4-212ff3779900",2741:"fc2427d1-5af9-4a9c-8da5-6f94627cd900","5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp":"a1b58899-f671-4276-6a5e-56ca5bd59700","4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z":"a1b58899-f671-4276-6a5e-56ca5bd59700",EtWTRABZaYq6iMfeYKouRu166VU2xqa1:"a1b58899-f671-4276-6a5e-56ca5bd59700","000000000019d6689c085ae165831e93":"0b4838db-0161-4ffe-022d-532bf03dba00","000000000933ea01ad0ee984209779ba":"39354064-d79b-420b-065d-f980c4b78200"},ConnectorImageIds:{[G.CONNECTOR_ID.COINBASE]:"0c2840c3-5b04-4c44-9661-fbd4b49e1800",[G.CONNECTOR_ID.COINBASE_SDK]:"0c2840c3-5b04-4c44-9661-fbd4b49e1800",[G.CONNECTOR_ID.SAFE]:"461db637-8616-43ce-035a-d89b8a1d5800",[G.CONNECTOR_ID.LEDGER]:"54a1aa77-d202-4f8d-0fb2-5d2bb6db0300",[G.CONNECTOR_ID.WALLET_CONNECT]:"ef1a1fcf-7fe8-4d69-bd6d-fda1345b4400",[G.CONNECTOR_ID.INJECTED]:"07ba87ed-43aa-4adf-4540-9e6a2b9cae00"},ConnectorNamesMap:{[G.CONNECTOR_ID.INJECTED]:"Browser Wallet",[G.CONNECTOR_ID.WALLET_CONNECT]:"WalletConnect",[G.CONNECTOR_ID.COINBASE]:"Coinbase",[G.CONNECTOR_ID.COINBASE_SDK]:"Coinbase",[G.CONNECTOR_ID.LEDGER]:"Ledger",[G.CONNECTOR_ID.SAFE]:"Safe"},ConnectorTypesMap:{[G.CONNECTOR_ID.INJECTED]:"INJECTED",[G.CONNECTOR_ID.WALLET_CONNECT]:"WALLET_CONNECT",[G.CONNECTOR_ID.EIP6963]:"ANNOUNCED",[G.CONNECTOR_ID.AUTH]:"AUTH"},WalletConnectRpcChainIds:[1,5,11155111,10,420,42161,421613,137,80001,42220,1313161554,1313161555,56,97,43114,43113,100,8453,84531,7777777,999,324,280]},Hl={getCaipTokens(e){if(!e)return;let t={};return Object.entries(e).forEach(([r,o])=>{t[`${Te.EIP155}:${r}`]=o}),t},isLowerCaseMatch(e,t){return e?.toLowerCase()===t?.toLowerCase()}},xi={UniversalProviderErrors:{UNAUTHORIZED_DOMAIN_NOT_ALLOWED:{message:"Unauthorized: origin not allowed",alertErrorKey:"INVALID_APP_CONFIGURATION"},JWT_VALIDATION_ERROR:{message:"JWT validation error: JWT Token is not yet valid",alertErrorKey:"JWT_TOKEN_NOT_VALID"},INVALID_KEY:{message:"Unauthorized: invalid key",alertErrorKey:"INVALID_PROJECT_ID"}},ALERT_ERRORS:{SWITCH_NETWORK_NOT_FOUND:{shortMessage:"Network Not Found",longMessage:"Network not found - please make sure it is included in 'networks' array in createAppKit function"},INVALID_APP_CONFIGURATION:{shortMessage:"Invalid App Configuration",longMessage:()=>`Origin ${Gg()?window.origin:"unknown"} not found on Allowlist - update configuration on cloud.reown.com`},SOCIALS_TIMEOUT:{shortMessage:"Invalid App Configuration",longMessage:()=>"There was an issue loading the embedded wallet. Please verify that your domain is allowed at cloud.reown.com"},JWT_TOKEN_NOT_VALID:{shortMessage:"Session Expired",longMessage:"Invalid session found on UniversalProvider - please check your time settings and connect again"},INVALID_PROJECT_ID:{shortMessage:"Invalid App Configuration",longMessage:"Invalid Project ID - update configuration"},PROJECT_ID_NOT_CONFIGURED:{shortMessage:"Project ID Not Configured",longMessage:"Project ID Not Configured - update configuration on cloud.reown.com"}}};function Gg(){return typeof window<"u"}function Kg(e){try{return JSON.stringify(e)}catch{return'"[Circular]"'}}var Yg=Jg;function Jg(e,t,r){var o=r&&r.stringify||Kg,n=1;if(typeof e=="object"&&e!==null){var i=t.length+n;if(i===1)return e;var s=new Array(i);s[0]=o(e);for(var a=1;a<i;a++)s[a]=o(t[a]);return s.join(" ")}if(typeof e!="string")return e;var c=t.length;if(c===0)return e;for(var l="",d=1-n,u=-1,h=e&&e.length||0,p=0;p<h;){if(e.charCodeAt(p)===37&&p+1<h){switch(u=u>-1?u:0,e.charCodeAt(p+1)){case 100:case 102:if(d>=c||t[d]==null)break;u<p&&(l+=e.slice(u,p)),l+=Number(t[d]),u=p+2,p++;break;case 105:if(d>=c||t[d]==null)break;u<p&&(l+=e.slice(u,p)),l+=Math.floor(Number(t[d])),u=p+2,p++;break;case 79:case 111:case 106:if(d>=c||t[d]===void 0)break;u<p&&(l+=e.slice(u,p));var w=typeof t[d];if(w==="string"){l+="'"+t[d]+"'",u=p+2,p++;break}if(w==="function"){l+=t[d].name||"<anonymous>",u=p+2,p++;break}l+=o(t[d]),u=p+2,p++;break;case 115:if(d>=c)break;u<p&&(l+=e.slice(u,p)),l+=String(t[d]),u=p+2,p++;break;case 37:u<p&&(l+=e.slice(u,p)),l+="%",u=p+2,p++,d--;break}++d}++p}return u===-1?e:(u<h&&(l+=e.slice(u)),l)}var Bd=Yg,Wr=Mt,Jn=cf().console||{},Xg={mapHttpRequest:Ei,mapHttpResponse:Ei,wrapRequestSerializer:Ca,wrapResponseSerializer:Ca,wrapErrorSerializer:Ca,req:Ei,res:Ei,err:of};function Qg(e,t){return Array.isArray(e)?e.filter(function(r){return r!=="!stdSerializers.err"}):e===!0?Object.keys(t):!1}function Mt(e){e=e||{},e.browser=e.browser||{};let t=e.browser.transmit;if(t&&typeof t.send!="function")throw Error("pino: transmit option must have a send function");let r=e.browser.write||Jn;e.browser.write&&(e.browser.asObject=!0);let o=e.serializers||{},n=Qg(e.browser.serialize,o),i=e.browser.serialize;Array.isArray(e.browser.serialize)&&e.browser.serialize.indexOf("!stdSerializers.err")>-1&&(i=!1);let s=["error","fatal","warn","info","debug","trace"];typeof r=="function"&&(r.error=r.fatal=r.warn=r.info=r.debug=r.trace=r),e.enabled===!1&&(e.level="silent");let a=e.level||"info",c=Object.create(r);c.log||(c.log=Xn),Object.defineProperty(c,"levelVal",{get:d}),Object.defineProperty(c,"level",{get:u,set:h});let l={transmit:t,serialize:n,asObject:e.browser.asObject,levels:s,timestamp:nf(e)};c.levels=Mt.levels,c.level=a,c.setMaxListeners=c.getMaxListeners=c.emit=c.addListener=c.on=c.prependListener=c.once=c.prependOnceListener=c.removeListener=c.removeAllListeners=c.listeners=c.listenerCount=c.eventNames=c.write=c.flush=Xn,c.serializers=o,c._serialize=n,c._stdErrSerialize=i,c.child=p,t&&(c._logEvent=ll());function d(){return this.level==="silent"?1/0:this.levels.values[this.level]}function u(){return this._level}function h(w){if(w!=="silent"&&!this.levels.values[w])throw Error("unknown level "+w);this._level=w,co(l,c,"error","log"),co(l,c,"fatal","error"),co(l,c,"warn","error"),co(l,c,"info","log"),co(l,c,"debug","log"),co(l,c,"trace","log")}function p(w,b){if(!w)throw new Error("missing bindings for child Pino");b=b||{},n&&w.serializers&&(b.serializers=w.serializers);let v=b.serializers;if(n&&v){var m=Object.assign({},o,v),x=e.browser.serialize===!0?Object.keys(m):n;delete w.serializers,Xs([w],x,m,this._stdErrSerialize)}function C(E){this._childLevel=(E._childLevel|0)+1,this.error=lo(E,w,"error"),this.fatal=lo(E,w,"fatal"),this.warn=lo(E,w,"warn"),this.info=lo(E,w,"info"),this.debug=lo(E,w,"debug"),this.trace=lo(E,w,"trace"),m&&(this.serializers=m,this._serialize=x),t&&(this._logEvent=ll([].concat(E._logEvent.bindings,w)))}return C.prototype=this,new C(this)}return c}Mt.levels={values:{fatal:60,error:50,warn:40,info:30,debug:20,trace:10},labels:{10:"trace",20:"debug",30:"info",40:"warn",50:"error",60:"fatal"}},Mt.stdSerializers=Xg,Mt.stdTimeFunctions=Object.assign({},{nullTime:Mu,epochTime:Uu,unixTime:sf,isoTime:af});function co(e,t,r,o){let n=Object.getPrototypeOf(t);t[r]=t.levelVal>t.levels.values[r]?Xn:n[r]?n[r]:Jn[r]||Jn[o]||Xn,ef(e,t,r)}function ef(e,t,r){!e.transmit&&t[r]===Xn||(t[r]=function(o){return function(){let n=e.timestamp(),i=new Array(arguments.length),s=Object.getPrototypeOf&&Object.getPrototypeOf(this)===Jn?Jn:this;for(var a=0;a<i.length;a++)i[a]=arguments[a];if(e.serialize&&!e.asObject&&Xs(i,this._serialize,this.serializers,this._stdErrSerialize),e.asObject?o.call(s,tf(this,r,i,n)):o.apply(s,i),e.transmit){let c=e.transmit.level||t.level,l=Mt.levels.values[c],d=Mt.levels.values[r];if(d<l)return;rf(this,{ts:n,methodLevel:r,methodValue:d,transmitLevel:c,transmitValue:Mt.levels.values[e.transmit.level||t.level],send:e.transmit.send,val:t.levelVal},i)}}}(t[r]))}function tf(e,t,r,o){e._serialize&&Xs(r,e._serialize,e.serializers,e._stdErrSerialize);let n=r.slice(),i=n[0],s={};o&&(s.time=o),s.level=Mt.levels.values[t];let a=(e._childLevel|0)+1;if(a<1&&(a=1),i!==null&&typeof i=="object"){for(;a--&&typeof n[0]=="object";)Object.assign(s,n.shift());i=n.length?Bd(n.shift(),n):void 0}else typeof i=="string"&&(i=Bd(n.shift(),n));return i!==void 0&&(s.msg=i),s}function Xs(e,t,r,o){for(let n in e)if(o&&e[n]instanceof Error)e[n]=Mt.stdSerializers.err(e[n]);else if(typeof e[n]=="object"&&!Array.isArray(e[n]))for(let i in e[n])t&&t.indexOf(i)>-1&&i in r&&(e[n][i]=r[i](e[n][i]))}function lo(e,t,r){return function(){let o=new Array(1+arguments.length);o[0]=t;for(var n=1;n<o.length;n++)o[n]=arguments[n-1];return e[r].apply(this,o)}}function rf(e,t,r){let o=t.send,n=t.ts,i=t.methodLevel,s=t.methodValue,a=t.val,c=e._logEvent.bindings;Xs(r,e._serialize||Object.keys(e.serializers),e.serializers,e._stdErrSerialize===void 0?!0:e._stdErrSerialize),e._logEvent.ts=n,e._logEvent.messages=r.filter(function(l){return c.indexOf(l)===-1}),e._logEvent.level.label=i,e._logEvent.level.value=s,o(i,e._logEvent,a),e._logEvent=ll(c)}function ll(e){return{ts:0,messages:[],bindings:e||[],level:{label:"",value:0}}}function of(e){let t={type:e.constructor.name,msg:e.message,stack:e.stack};for(let r in e)t[r]===void 0&&(t[r]=e[r]);return t}function nf(e){return typeof e.timestamp=="function"?e.timestamp:e.timestamp===!1?Mu:Uu}function Ei(){return{}}function Ca(e){return e}function Xn(){}function Mu(){return!1}function Uu(){return Date.now()}function sf(){return Math.round(Date.now()/1e3)}function af(){return new Date(Date.now()).toISOString()}function cf(){function e(t){return typeof t<"u"&&t}try{return typeof globalThis<"u"||Object.defineProperty(Object.prototype,"globalThis",{get:function(){return delete Object.prototype.globalThis,this.globalThis=this},configurable:!0}),globalThis}catch{return e(self)||e(window)||e(this)||{}}}var lf=e=>JSON.stringify(e,(t,r)=>typeof r=="bigint"?r.toString()+"n":r);function Md(e){return typeof e=="string"?e:lf(e)||""}var df={level:"info"},Fl=1e3*1024,dl=class{constructor(t){this.nodeValue=t,this.sizeInBytes=new TextEncoder().encode(this.nodeValue).length,this.next=null}get value(){return this.nodeValue}get size(){return this.sizeInBytes}},_s=class{constructor(t){this.head=null,this.tail=null,this.lengthInNodes=0,this.maxSizeInBytes=t,this.sizeInBytes=0}append(t){let r=new dl(t);if(r.size>this.maxSizeInBytes)throw new Error(`[LinkedList] Value too big to insert into list: ${t} with size ${r.size}`);for(;this.size+r.size>this.maxSizeInBytes;)this.shift();this.head?(this.tail&&(this.tail.next=r),this.tail=r):(this.head=r,this.tail=r),this.lengthInNodes++,this.sizeInBytes+=r.size}shift(){if(!this.head)return;let t=this.head;this.head=this.head.next,this.head||(this.tail=null),this.lengthInNodes--,this.sizeInBytes-=t.size}toArray(){let t=[],r=this.head;for(;r!==null;)t.push(r.value),r=r.next;return t}get length(){return this.lengthInNodes}get size(){return this.sizeInBytes}toOrderedArray(){return Array.from(this)}[Symbol.iterator](){let t=this.head;return{next:()=>{if(!t)return{done:!0,value:null};let r=t.value;return t=t.next,{done:!1,value:r}}}}},Os=class{constructor(t,r=Fl){this.level=t??"error",this.levelValue=Wr.levels.values[this.level],this.MAX_LOG_SIZE_IN_BYTES=r,this.logs=new _s(this.MAX_LOG_SIZE_IN_BYTES)}forwardToConsole(t,r){r===Wr.levels.values.error?console.error(t):r===Wr.levels.values.warn?console.warn(t):r===Wr.levels.values.debug?console.debug(t):r===Wr.levels.values.trace?console.trace(t):console.log(t)}appendToLogs(t){this.logs.append(Md({timestamp:new Date().toISOString(),log:t}));let r=typeof t=="string"?JSON.parse(t).level:t.level;r>=this.levelValue&&this.forwardToConsole(t,r)}getLogs(){return this.logs}clearLogs(){this.logs=new _s(this.MAX_LOG_SIZE_IN_BYTES)}getLogArray(){return Array.from(this.logs)}logsToBlob(t){let r=this.getLogArray();return r.push(Md({extraMetadata:t})),new Blob(r,{type:"application/json"})}},ul=class{constructor(t,r=Fl){this.baseChunkLogger=new Os(t,r)}write(t){this.baseChunkLogger.appendToLogs(t)}getLogs(){return this.baseChunkLogger.getLogs()}clearLogs(){this.baseChunkLogger.clearLogs()}getLogArray(){return this.baseChunkLogger.getLogArray()}logsToBlob(t){return this.baseChunkLogger.logsToBlob(t)}downloadLogsBlobInBrowser(t){let r=URL.createObjectURL(this.logsToBlob(t)),o=document.createElement("a");o.href=r,o.download=`walletconnect-logs-${new Date().toISOString()}.txt`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(r)}},hl=class{constructor(t,r=Fl){this.baseChunkLogger=new Os(t,r)}write(t){this.baseChunkLogger.appendToLogs(t)}getLogs(){return this.baseChunkLogger.getLogs()}clearLogs(){this.baseChunkLogger.clearLogs()}getLogArray(){return this.baseChunkLogger.getLogArray()}logsToBlob(t){return this.baseChunkLogger.logsToBlob(t)}},uf=Object.defineProperty,hf=Object.defineProperties,pf=Object.getOwnPropertyDescriptors,Ud=Object.getOwnPropertySymbols,gf=Object.prototype.hasOwnProperty,ff=Object.prototype.propertyIsEnumerable,zd=(e,t,r)=>t in e?uf(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Ts=(e,t)=>{for(var r in t||(t={}))gf.call(t,r)&&zd(e,r,t[r]);if(Ud)for(var r of Ud(t))ff.call(t,r)&&zd(e,r,t[r]);return e},Ps=(e,t)=>hf(e,pf(t));function wf(e){return Ps(Ts({},e),{level:e?.level||df.level})}function mf(e){var t,r;let o=new ul((t=e.opts)==null?void 0:t.level,e.maxSizeInBytes);return{logger:Wr(Ps(Ts({},e.opts),{level:"trace",browser:Ps(Ts({},(r=e.opts)==null?void 0:r.browser),{write:n=>o.write(n)})})),chunkLoggerController:o}}function vf(e){var t;let r=new hl((t=e.opts)==null?void 0:t.level,e.maxSizeInBytes);return{logger:Wr(Ps(Ts({},e.opts),{level:"trace"})),chunkLoggerController:r}}function bf(e){return typeof e.loggerOverride<"u"&&typeof e.loggerOverride!="string"?{logger:e.loggerOverride,chunkLoggerController:null}:typeof window<"u"?mf(e):vf(e)}var yf={createLogger(e,t="error"){let r=wf({level:t}),{logger:o}=bf({opts:r});return o.error=(...n)=>{for(let i of n)if(i instanceof Error){e(i,...n);return}e(void 0,...n)},o}},Cf="rpc.walletconnect.org";function Dd(e,t){let r=new URL("https://rpc.walletconnect.org/v1/");return r.searchParams.set("chainId",e),r.searchParams.set("projectId",t),r.toString()}var xa=["near:mainnet","solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp","eip155:1101","eip155:56","eip155:42161","eip155:7777777","eip155:59144","eip155:324","solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1","eip155:5000","solana:4sgjmw1sunhzsxgspuhpqldx6wiyjntz","eip155:80084","eip155:5003","eip155:100","eip155:8453","eip155:42220","eip155:1313161555","eip155:17000","eip155:1","eip155:300","eip155:1313161554","eip155:1329","eip155:84532","eip155:421614","eip155:11155111","eip155:8217","eip155:43114","solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z","eip155:999999999","eip155:11155420","eip155:80002","eip155:97","eip155:43113","eip155:137","eip155:10","eip155:1301","bip122:000000000019d6689c085ae165831e93","bip122:000000000933ea01ad0ee984209779ba"],mo={extendRpcUrlWithProjectId(e,t){let r=!1;try{r=new URL(e).host===Cf}catch{r=!1}if(r){let o=new URL(e);return o.searchParams.has("projectId")||o.searchParams.set("projectId",t),o.toString()}return e},isCaipNetwork(e){return"chainNamespace"in e&&"caipNetworkId"in e},getChainNamespace(e){return this.isCaipNetwork(e)?e.chainNamespace:G.CHAIN.EVM},getCaipNetworkId(e){return this.isCaipNetwork(e)?e.caipNetworkId:`${G.CHAIN.EVM}:${e.id}`},getDefaultRpcUrl(e,t,r){let o=e.rpcUrls?.default?.http?.[0];return xa.includes(t)?Dd(t,r):o||""},extendCaipNetwork(e,{customNetworkImageUrls:t,projectId:r,customRpcUrls:o}){let n=this.getChainNamespace(e),i=this.getCaipNetworkId(e),s=e.rpcUrls.default.http?.[0],a=this.getDefaultRpcUrl(e,i,r),c=e?.rpcUrls?.chainDefault?.http?.[0]||s,l=o?.[i]?.map(h=>h.url)||[],d=[...l,a],u=[...l];return c&&!u.includes(c)&&u.push(c),{...e,chainNamespace:n,caipNetworkId:i,assets:{imageId:Ss.NetworkImageIds[e.id],imageUrl:t?.[e.id]},rpcUrls:{...e.rpcUrls,default:{http:d},chainDefault:{http:u}}}},extendCaipNetworks(e,{customNetworkImageUrls:t,projectId:r,customRpcUrls:o}){return e.map(n=>mo.extendCaipNetwork(n,{customNetworkImageUrls:t,customRpcUrls:o,projectId:r}))},getViemTransport(e,t,r){let o=[];return r?.forEach(n=>{o.push(bi(n.url,n.config))}),xa.includes(e.caipNetworkId)&&o.push(bi(Dd(e.caipNetworkId,t),{fetchOptions:{headers:{"Content-Type":"text/plain"}}})),e?.rpcUrls?.default?.http?.forEach(n=>{o.push(bi(n))}),bd(o)},extendWagmiTransports(e,t,r){if(xa.includes(e.caipNetworkId)){let o=this.getDefaultRpcUrl(e,e.caipNetworkId,t);return bd([r,bi(o)])}return r},getUnsupportedNetwork(e){return{id:e.split(":")[1],caipNetworkId:e,name:G.UNSUPPORTED_NETWORK_NAME,chainNamespace:e.split(":")[0],nativeCurrency:{name:"",decimals:0,symbol:""},rpcUrls:{default:{http:[]}}}},getCaipNetworkFromStorage(e){let t=q.getActiveCaipNetworkId(),r=g.getAllRequestedCaipNetworks(),o=Array.from(g.state.chains?.keys()||[]),n=t?.split(":")[0],i=n?o.includes(n):!1,s=r?.find(a=>a.caipNetworkId===t);return i&&!s&&t?this.getUnsupportedNetwork(t):s||e||r?.[0]}},Rs={eip155:void 0,solana:void 0,polkadot:void 0,bip122:void 0},Je=xe({providers:{...Rs},providerIds:{...Rs}}),Ae={state:Je,subscribeKey(e,t){return qe(Je,e,t)},subscribe(e){return je(Je,()=>{e(Je)})},subscribeProviders(e){return je(Je.providers,()=>e(Je.providers))},setProvider(e,t){t&&(Je.providers[e]=Jr(t))},getProvider(e){return Je.providers[e]},setProviderId(e,t){t&&(Je.providerIds[e]=t)},getProviderId(e){if(e)return Je.providerIds[e]},reset(){Je.providers={...Rs},Je.providerIds={...Rs}},resetChain(e){Je.providers[e]=void 0,Je.providerIds[e]=void 0}},jd;(function(e){e.Google="google",e.Github="github",e.Apple="apple",e.Facebook="facebook",e.X="x",e.Discord="discord",e.Farcaster="farcaster"})(jd||(jd={}));var fr={ACCOUNT_TABS:[{label:"Tokens"},{label:"NFTs"},{label:"Activity"}],SECURE_SITE_ORIGIN:(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org",VIEW_DIRECTION:{Next:"next",Prev:"prev"},DEFAULT_CONNECT_METHOD_ORDER:["email","social","wallet"],ANIMATION_DURATIONS:{HeaderText:120,ModalHeight:150,ViewTransition:150}},ro={filterOutDuplicatesByRDNS(e){let t=O.state.enableEIP6963?H.state.connectors:[],r=q.getRecentWallets(),o=t.map(s=>s.info?.rdns).filter(Boolean),n=r.map(s=>s.rdns).filter(Boolean),i=o.concat(n);if(i.includes("io.metamask.mobile")&&M.isMobile()){let s=i.indexOf("io.metamask.mobile");i[s]="io.metamask"}return e.filter(s=>!i.includes(String(s?.rdns)))},filterOutDuplicatesByIds(e){let t=H.state.connectors.filter(s=>s.type==="ANNOUNCED"||s.type==="INJECTED"),r=q.getRecentWallets(),o=t.map(s=>s.explorerId),n=r.map(s=>s.id),i=o.concat(n);return e.filter(s=>!i.includes(s?.id))},filterOutDuplicateWallets(e){let t=this.filterOutDuplicatesByRDNS(e);return this.filterOutDuplicatesByIds(t)},markWalletsAsInstalled(e){let{connectors:t}=H.state,r=t.filter(o=>o.type==="ANNOUNCED").reduce((o,n)=>(n.info?.rdns&&(o[n.info.rdns]=!0),o),{});return e.map(o=>({...o,installed:!!o.rdns&&!!r[o.rdns??""]})).sort((o,n)=>Number(n.installed)-Number(o.installed))},getConnectOrderMethod(e,t){let r=e?.connectMethodsOrder||O.state.features?.connectMethodsOrder,o=t||H.state.connectors;if(r)return r;let{injected:n,announced:i}=er.getConnectorsByType(o,W.state.recommended,W.state.featured),s=n.filter(er.showConnector),a=i.filter(er.showConnector);return s.length||a.length?["wallet","email","social"]:fr.DEFAULT_CONNECT_METHOD_ORDER},isExcluded(e){let t=!!e.rdns&&W.state.excludedWallets.some(o=>o.rdns===e.rdns),r=!!e.name&&W.state.excludedWallets.some(o=>Hl.isLowerCaseMatch(o.name,e.name));return t||r}},er={getConnectorsByType(e,t,r){let{customWallets:o}=O.state,n=q.getRecentWallets(),i=ro.filterOutDuplicateWallets(t),s=ro.filterOutDuplicateWallets(r),a=e.filter(u=>u.type==="MULTI_CHAIN"),c=e.filter(u=>u.type==="ANNOUNCED"),l=e.filter(u=>u.type==="INJECTED"),d=e.filter(u=>u.type==="EXTERNAL");return{custom:o,recent:n,external:d,multiChain:a,announced:c,injected:l,recommended:i,featured:s}},showConnector(e){let t=e.info?.rdns,r=!!t&&W.state.excludedWallets.some(n=>!!n.rdns&&n.rdns===t),o=!!e.name&&W.state.excludedWallets.some(n=>Hl.isLowerCaseMatch(n.name,e.name));return!(e.type==="INJECTED"&&(!M.isMobile()&&e.name==="Browser Wallet"||!t&&!Y.checkInstalled()||r||o)||(e.type==="ANNOUNCED"||e.type==="EXTERNAL")&&(r||o))},getIsConnectedWithWC(){return Array.from(g.state.chains.values()).some(e=>H.getConnectorId(e.namespace)===G.CONNECTOR_ID.WALLET_CONNECT)},getConnectorTypeOrder({recommended:e,featured:t,custom:r,recent:o,announced:n,injected:i,multiChain:s,external:a,overriddenConnectors:c=O.state.features?.connectorTypeOrder??[]}){let l=er.getIsConnectedWithWC(),d=[{type:"walletConnect",isEnabled:O.state.enableWalletConnect&&!l},{type:"recent",isEnabled:o.length>0},{type:"injected",isEnabled:[...i,...n,...s].length>0},{type:"featured",isEnabled:t.length>0},{type:"custom",isEnabled:r&&r.length>0},{type:"external",isEnabled:a.length>0},{type:"recommended",isEnabled:e.length>0}].filter(w=>w.isEnabled),u=new Set(d.map(w=>w.type)),h=c.filter(w=>u.has(w)).map(w=>({type:w,isEnabled:!0})),p=d.filter(({type:w})=>!h.some(({type:b})=>b===w));return Array.from(new Set([...h,...p].map(({type:w})=>w)))}};var gs=globalThis,Vl=gs.ShadowRoot&&(gs.ShadyCSS===void 0||gs.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Zl=Symbol(),Wd=new WeakMap,$s=class{constructor(t,r,o){if(this._$cssResult$=!0,o!==Zl)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(Vl&&t===void 0){let o=r!==void 0&&r.length===1;o&&(t=Wd.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Wd.set(r,t))}return t}toString(){return this.cssText}},yt=e=>new $s(typeof e=="string"?e:e+"",void 0,Zl),ee=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((o,n,i)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[i+1],e[0]);return new $s(r,e,Zl)},xf=(e,t)=>{if(Vl)e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet);else for(let r of t){let o=document.createElement("style"),n=gs.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=r.cssText,e.appendChild(o)}},Hd=Vl?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let o of t.cssRules)r+=o.cssText;return yt(r)})(e):e;var{is:Ef,defineProperty:kf,getOwnPropertyDescriptor:Af,getOwnPropertyNames:Nf,getOwnPropertySymbols:If,getPrototypeOf:Sf}=Object,Qs=globalThis,Fd=Qs.trustedTypes,_f=Fd?Fd.emptyScript:"",Of=Qs.reactiveElementPolyfillSupport,En=(e,t)=>e,Ls={toAttribute(e,t){switch(t){case Boolean:e=e?_f:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},ql=(e,t)=>!Ef(e,t),Vd={attribute:!0,type:String,converter:Ls,reflect:!1,useDefault:!1,hasChanged:ql};Symbol.metadata??=Symbol("metadata"),Qs.litPropertyMetadata??=new WeakMap;var hr=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,r=Vd){if(r.state&&(r.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((r=Object.create(r)).wrapped=!0),this.elementProperties.set(t,r),!r.noAccessor){let o=Symbol(),n=this.getPropertyDescriptor(t,o,r);n!==void 0&&kf(this.prototype,t,n)}}static getPropertyDescriptor(t,r,o){let{get:n,set:i}=Af(this.prototype,t)??{get(){return this[r]},set(s){this[r]=s}};return{get:n,set(s){let a=n?.call(this);i?.call(this,s),this.requestUpdate(t,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Vd}static _$Ei(){if(this.hasOwnProperty(En("elementProperties")))return;let t=Sf(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(En("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(En("properties"))){let r=this.properties,o=[...Nf(r),...If(r)];for(let n of o)this.createProperty(n,r[n])}let t=this[Symbol.metadata];if(t!==null){let r=litPropertyMetadata.get(t);if(r!==void 0)for(let[o,n]of r)this.elementProperties.set(o,n)}this._$Eh=new Map;for(let[r,o]of this.elementProperties){let n=this._$Eu(r,o);n!==void 0&&this._$Eh.set(n,r)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let n of o)r.unshift(Hd(n))}else t!==void 0&&r.push(Hd(t));return r}static _$Eu(t,r){let o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,r=this.constructor.elementProperties;for(let o of r.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xf(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,r,o){this._$AK(t,o)}_$ET(t,r){let o=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,o);if(n!==void 0&&o.reflect===!0){let i=(o.converter?.toAttribute!==void 0?o.converter:Ls).toAttribute(r,o.type);this._$Em=t,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(t,r){let o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let i=o.getPropertyOptions(n),s=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Ls;this._$Em=n,this[n]=s.fromAttribute(r,i.type)??this._$Ej?.get(n)??null,this._$Em=null}}requestUpdate(t,r,o){if(t!==void 0){let n=this.constructor,i=this[t];if(o??=n.getPropertyOptions(t),!((o.hasChanged??ql)(i,r)||o.useDefault&&o.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,o))))return;this.C(t,r,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,r,{useDefault:o,reflect:n,wrapped:i},s){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??r??this[t]),i!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(r=void 0),this._$AL.set(t,r)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,i]of o){let{wrapped:s}=i,a=this[n];s!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,i,a)}}let t=!1,r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(r)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(r)}willUpdate(t){}_$AE(t){this._$EO?.forEach(r=>r.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(r=>this._$ET(r,this[r])),this._$EM()}updated(t){}firstUpdated(t){}};hr.elementStyles=[],hr.shadowRootOptions={mode:"open"},hr[En("elementProperties")]=new Map,hr[En("finalized")]=new Map,Of?.({ReactiveElement:hr}),(Qs.reactiveElementVersions??=[]).push("2.1.0");var Gl=globalThis,Bs=Gl.trustedTypes,Zd=Bs?Bs.createPolicy("lit-html",{createHTML:e=>e}):void 0,zu="$lit$",pr=`lit$${Math.random().toFixed(9).slice(2)}$`,Du="?"+pr,Tf=`<${Du}>`,oo=document,Qn=()=>oo.createComment(""),ei=e=>e===null||typeof e!="object"&&typeof e!="function",Kl=Array.isArray,Pf=e=>Kl(e)||typeof e?.[Symbol.iterator]=="function",Ea=`[ 	
\f\r]`,Zo=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qd=/-->/g,Gd=/>/g,Ar=RegExp(`>|${Ea}(?:([^\\s"'>=/]+)(${Ea}*=${Ea}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Kd=/'/g,Yd=/"/g,ju=/^(?:script|style|textarea|title)$/i,Wu=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),f=Wu(1),U=Wu(2),rr=Symbol.for("lit-noChange"),Ie=Symbol.for("lit-nothing"),Jd=new WeakMap,Fr=oo.createTreeWalker(oo,129);function Hu(e,t){if(!Kl(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Zd!==void 0?Zd.createHTML(t):t}var Rf=(e,t)=>{let r=e.length-1,o=[],n,i=t===2?"<svg>":t===3?"<math>":"",s=Zo;for(let a=0;a<r;a++){let c=e[a],l,d,u=-1,h=0;for(;h<c.length&&(s.lastIndex=h,d=s.exec(c),d!==null);)h=s.lastIndex,s===Zo?d[1]==="!--"?s=qd:d[1]!==void 0?s=Gd:d[2]!==void 0?(ju.test(d[2])&&(n=RegExp("</"+d[2],"g")),s=Ar):d[3]!==void 0&&(s=Ar):s===Ar?d[0]===">"?(s=n??Zo,u=-1):d[1]===void 0?u=-2:(u=s.lastIndex-d[2].length,l=d[1],s=d[3]===void 0?Ar:d[3]==='"'?Yd:Kd):s===Yd||s===Kd?s=Ar:s===qd||s===Gd?s=Zo:(s=Ar,n=void 0);let p=s===Ar&&e[a+1].startsWith("/>")?" ":"";i+=s===Zo?c+Tf:u>=0?(o.push(l),c.slice(0,u)+zu+c.slice(u)+pr+p):c+pr+(u===-2?a:p)}return[Hu(e,i+(e[r]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},ti=class e{constructor({strings:t,_$litType$:r},o){let n;this.parts=[];let i=0,s=0,a=t.length-1,c=this.parts,[l,d]=Rf(t,r);if(this.el=e.createElement(l,o),Fr.currentNode=this.el.content,r===2||r===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=Fr.nextNode())!==null&&c.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let u of n.getAttributeNames())if(u.endsWith(zu)){let h=d[s++],p=n.getAttribute(u).split(pr),w=/([.?@])?(.*)/.exec(h);c.push({type:1,index:i,name:w[2],strings:p,ctor:w[1]==="."?gl:w[1]==="?"?fl:w[1]==="@"?wl:Mo}),n.removeAttribute(u)}else u.startsWith(pr)&&(c.push({type:6,index:i}),n.removeAttribute(u));if(ju.test(n.tagName)){let u=n.textContent.split(pr),h=u.length-1;if(h>0){n.textContent=Bs?Bs.emptyScript:"";for(let p=0;p<h;p++)n.append(u[p],Qn()),Fr.nextNode(),c.push({type:2,index:++i});n.append(u[h],Qn())}}}else if(n.nodeType===8)if(n.data===Du)c.push({type:2,index:i});else{let u=-1;for(;(u=n.data.indexOf(pr,u+1))!==-1;)c.push({type:7,index:i}),u+=pr.length-1}i++}}static createElement(t,r){let o=oo.createElement("template");return o.innerHTML=t,o}};function Bo(e,t,r=e,o){if(t===rr)return t;let n=o!==void 0?r._$Co?.[o]:r._$Cl,i=ei(t)?void 0:t._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(e),n._$AT(e,r,o)),o!==void 0?(r._$Co??=[])[o]=n:r._$Cl=n),n!==void 0&&(t=Bo(e,n._$AS(e,t.values),n,o)),t}var pl=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:r},parts:o}=this._$AD,n=(t?.creationScope??oo).importNode(r,!0);Fr.currentNode=n;let i=Fr.nextNode(),s=0,a=0,c=o[0];for(;c!==void 0;){if(s===c.index){let l;c.type===2?l=new ri(i,i.nextSibling,this,t):c.type===1?l=new c.ctor(i,c.name,c.strings,this,t):c.type===6&&(l=new ml(i,this,t)),this._$AV.push(l),c=o[++a]}s!==c?.index&&(i=Fr.nextNode(),s++)}return Fr.currentNode=oo,n}p(t){let r=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,r),r+=o.strings.length-2):o._$AI(t[r])),r++}},ri=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,r,o,n){this.type=2,this._$AH=Ie,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=o,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Bo(this,t,r),ei(t)?t===Ie||t==null||t===""?(this._$AH!==Ie&&this._$AR(),this._$AH=Ie):t!==this._$AH&&t!==rr&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pf(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Ie&&ei(this._$AH)?this._$AA.nextSibling.data=t:this.T(oo.createTextNode(t)),this._$AH=t}$(t){let{values:r,_$litType$:o}=t,n=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=ti.createElement(Hu(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===n)this._$AH.p(r);else{let i=new pl(n,this),s=i.u(this.options);i.p(r),this.T(s),this._$AH=i}}_$AC(t){let r=Jd.get(t.strings);return r===void 0&&Jd.set(t.strings,r=new ti(t)),r}k(t){Kl(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,o,n=0;for(let i of t)n===r.length?r.push(o=new e(this.O(Qn()),this.O(Qn()),this,this.options)):o=r[n],o._$AI(i),n++;n<r.length&&(this._$AR(o&&o._$AB.nextSibling,n),r.length=n)}_$AR(t=this._$AA.nextSibling,r){for(this._$AP?.(!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},Mo=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,r,o,n,i){this.type=1,this._$AH=Ie,this._$AN=void 0,this.element=t,this.name=r,this._$AM=n,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=Ie}_$AI(t,r=this,o,n){let i=this.strings,s=!1;if(i===void 0)t=Bo(this,t,r,0),s=!ei(t)||t!==this._$AH&&t!==rr,s&&(this._$AH=t);else{let a=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=Bo(this,a[o+c],r,c),l===rr&&(l=this._$AH[c]),s||=!ei(l)||l!==this._$AH[c],l===Ie?t=Ie:t!==Ie&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}s&&!n&&this.j(t)}j(t){t===Ie?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},gl=class extends Mo{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Ie?void 0:t}},fl=class extends Mo{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Ie)}},wl=class extends Mo{constructor(t,r,o,n,i){super(t,r,o,n,i),this.type=5}_$AI(t,r=this){if((t=Bo(this,t,r,0)??Ie)===rr)return;let o=this._$AH,n=t===Ie&&o!==Ie||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,i=t!==Ie&&(o===Ie||n);n&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ml=class{constructor(t,r,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){Bo(this,t)}},$f=Gl.litHtmlPolyfillSupport;$f?.(ti,ri),(Gl.litHtmlVersions??=[]).push("3.3.0");var Lf=(e,t,r)=>{let o=r?.renderBefore??t,n=o._$litPart$;if(n===void 0){let i=r?.renderBefore??null;o._$litPart$=n=new ri(t.insertBefore(Qn(),i),i,void 0,r??{})}return n._$AI(e),n};var Yl=globalThis,F=class extends hr{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Lf(r,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return rr}};F._$litElement$=!0,F.finalized=!0,Yl.litElementHydrateSupport?.({LitElement:F});var Bf=Yl.litElementPolyfillSupport;Bf?.({LitElement:F}),(Yl.litElementVersions??=[]).push("4.2.0");var kn,vr,br;function Mf(e,t){kn=document.createElement("style"),vr=document.createElement("style"),br=document.createElement("style"),kn.textContent=Eo(e).core.cssText,vr.textContent=Eo(e).dark.cssText,br.textContent=Eo(e).light.cssText,document.head.appendChild(kn),document.head.appendChild(vr),document.head.appendChild(br),Fu(t)}function Fu(e){vr&&br&&(e==="light"?(vr.removeAttribute("media"),br.media="enabled"):(br.removeAttribute("media"),vr.media="enabled"))}function Uf(e){kn&&vr&&br&&(kn.textContent=Eo(e).core.cssText,vr.textContent=Eo(e).dark.cssText,br.textContent=Eo(e).light.cssText)}function Eo(e){return{core:ee`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      @keyframes w3m-shake {
        0% {
          transform: scale(1) rotate(0deg);
        }
        20% {
          transform: scale(1) rotate(-1deg);
        }
        40% {
          transform: scale(1) rotate(1.5deg);
        }
        60% {
          transform: scale(1) rotate(-1.5deg);
        }
        80% {
          transform: scale(1) rotate(1deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes w3m-iframe-fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes w3m-iframe-zoom-in {
        0% {
          transform: translateY(50px);
          opacity: 0;
        }
        100% {
          transform: translateY(0px);
          opacity: 1;
        }
      }
      @keyframes w3m-iframe-zoom-in-mobile {
        0% {
          transform: scale(0.95);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      :root {
        --w3m-modal-width: 360px;
        --w3m-color-mix-strength: ${yt(e?.["--w3m-color-mix-strength"]?`${e["--w3m-color-mix-strength"]}%`:"0%")};
        --w3m-font-family: ${yt(e?.["--w3m-font-family"]||"Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;")};
        --w3m-font-size-master: ${yt(e?.["--w3m-font-size-master"]||"10px")};
        --w3m-border-radius-master: ${yt(e?.["--w3m-border-radius-master"]||"4px")};
        --w3m-z-index: ${yt(e?.["--w3m-z-index"]||999)};

        --wui-font-family: var(--w3m-font-family);

        --wui-font-size-mini: calc(var(--w3m-font-size-master) * 0.8);
        --wui-font-size-micro: var(--w3m-font-size-master);
        --wui-font-size-tiny: calc(var(--w3m-font-size-master) * 1.2);
        --wui-font-size-small: calc(var(--w3m-font-size-master) * 1.4);
        --wui-font-size-paragraph: calc(var(--w3m-font-size-master) * 1.6);
        --wui-font-size-medium: calc(var(--w3m-font-size-master) * 1.8);
        --wui-font-size-large: calc(var(--w3m-font-size-master) * 2);
        --wui-font-size-title-6: calc(var(--w3m-font-size-master) * 2.2);
        --wui-font-size-medium-title: calc(var(--w3m-font-size-master) * 2.4);
        --wui-font-size-2xl: calc(var(--w3m-font-size-master) * 4);

        --wui-border-radius-5xs: var(--w3m-border-radius-master);
        --wui-border-radius-4xs: calc(var(--w3m-border-radius-master) * 1.5);
        --wui-border-radius-3xs: calc(var(--w3m-border-radius-master) * 2);
        --wui-border-radius-xxs: calc(var(--w3m-border-radius-master) * 3);
        --wui-border-radius-xs: calc(var(--w3m-border-radius-master) * 4);
        --wui-border-radius-s: calc(var(--w3m-border-radius-master) * 5);
        --wui-border-radius-m: calc(var(--w3m-border-radius-master) * 7);
        --wui-border-radius-l: calc(var(--w3m-border-radius-master) * 9);
        --wui-border-radius-3xl: calc(var(--w3m-border-radius-master) * 20);

        --wui-font-weight-light: 400;
        --wui-font-weight-regular: 500;
        --wui-font-weight-medium: 600;
        --wui-font-weight-bold: 700;

        --wui-letter-spacing-2xl: -1.6px;
        --wui-letter-spacing-medium-title: -0.96px;
        --wui-letter-spacing-title-6: -0.88px;
        --wui-letter-spacing-large: -0.8px;
        --wui-letter-spacing-medium: -0.72px;
        --wui-letter-spacing-paragraph: -0.64px;
        --wui-letter-spacing-small: -0.56px;
        --wui-letter-spacing-tiny: -0.48px;
        --wui-letter-spacing-micro: -0.2px;
        --wui-letter-spacing-mini: -0.16px;

        --wui-spacing-0: 0px;
        --wui-spacing-4xs: 2px;
        --wui-spacing-3xs: 4px;
        --wui-spacing-xxs: 6px;
        --wui-spacing-2xs: 7px;
        --wui-spacing-xs: 8px;
        --wui-spacing-1xs: 10px;
        --wui-spacing-s: 12px;
        --wui-spacing-m: 14px;
        --wui-spacing-l: 16px;
        --wui-spacing-2l: 18px;
        --wui-spacing-xl: 20px;
        --wui-spacing-xxl: 24px;
        --wui-spacing-2xl: 32px;
        --wui-spacing-3xl: 40px;
        --wui-spacing-4xl: 90px;
        --wui-spacing-5xl: 95px;

        --wui-icon-box-size-xxs: 14px;
        --wui-icon-box-size-xs: 20px;
        --wui-icon-box-size-sm: 24px;
        --wui-icon-box-size-md: 32px;
        --wui-icon-box-size-mdl: 36px;
        --wui-icon-box-size-lg: 40px;
        --wui-icon-box-size-2lg: 48px;
        --wui-icon-box-size-xl: 64px;

        --wui-icon-size-inherit: inherit;
        --wui-icon-size-xxs: 10px;
        --wui-icon-size-xs: 12px;
        --wui-icon-size-sm: 14px;
        --wui-icon-size-md: 16px;
        --wui-icon-size-mdl: 18px;
        --wui-icon-size-lg: 20px;
        --wui-icon-size-xl: 24px;
        --wui-icon-size-xxl: 28px;

        --wui-wallet-image-size-inherit: inherit;
        --wui-wallet-image-size-sm: 40px;
        --wui-wallet-image-size-md: 56px;
        --wui-wallet-image-size-lg: 80px;

        --wui-visual-size-size-inherit: inherit;
        --wui-visual-size-sm: 40px;
        --wui-visual-size-md: 55px;
        --wui-visual-size-lg: 80px;

        --wui-box-size-md: 100px;
        --wui-box-size-lg: 120px;

        --wui-ease-out-power-2: cubic-bezier(0, 0, 0.22, 1);
        --wui-ease-out-power-1: cubic-bezier(0, 0, 0.55, 1);

        --wui-ease-in-power-3: cubic-bezier(0.66, 0, 1, 1);
        --wui-ease-in-power-2: cubic-bezier(0.45, 0, 1, 1);
        --wui-ease-in-power-1: cubic-bezier(0.3, 0, 1, 1);

        --wui-ease-inout-power-1: cubic-bezier(0.45, 0, 0.55, 1);

        --wui-duration-lg: 200ms;
        --wui-duration-md: 125ms;
        --wui-duration-sm: 75ms;

        --wui-path-network-sm: path(
          'M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z'
        );

        --wui-path-network-md: path(
          'M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z'
        );

        --wui-path-network-lg: path(
          'M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z'
        );

        --wui-width-network-sm: 36px;
        --wui-width-network-md: 48px;
        --wui-width-network-lg: 86px;

        --wui-height-network-sm: 40px;
        --wui-height-network-md: 54px;
        --wui-height-network-lg: 96px;

        --wui-icon-size-network-xs: 12px;
        --wui-icon-size-network-sm: 16px;
        --wui-icon-size-network-md: 24px;
        --wui-icon-size-network-lg: 42px;

        --wui-color-inherit: inherit;

        --wui-color-inverse-100: #fff;
        --wui-color-inverse-000: #000;

        --wui-cover: rgba(20, 20, 20, 0.8);

        --wui-color-modal-bg: var(--wui-color-modal-bg-base);

        --wui-color-accent-100: var(--wui-color-accent-base-100);
        --wui-color-accent-090: var(--wui-color-accent-base-090);
        --wui-color-accent-080: var(--wui-color-accent-base-080);

        --wui-color-success-100: var(--wui-color-success-base-100);
        --wui-color-success-125: var(--wui-color-success-base-125);

        --wui-color-warning-100: var(--wui-color-warning-base-100);

        --wui-color-error-100: var(--wui-color-error-base-100);
        --wui-color-error-125: var(--wui-color-error-base-125);

        --wui-color-blue-100: var(--wui-color-blue-base-100);
        --wui-color-blue-90: var(--wui-color-blue-base-90);

        --wui-icon-box-bg-error-100: var(--wui-icon-box-bg-error-base-100);
        --wui-icon-box-bg-blue-100: var(--wui-icon-box-bg-blue-base-100);
        --wui-icon-box-bg-success-100: var(--wui-icon-box-bg-success-base-100);
        --wui-icon-box-bg-inverse-100: var(--wui-icon-box-bg-inverse-base-100);

        --wui-all-wallets-bg-100: var(--wui-all-wallets-bg-100);

        --wui-avatar-border: var(--wui-avatar-border-base);

        --wui-thumbnail-border: var(--wui-thumbnail-border-base);

        --wui-wallet-button-bg: var(--wui-wallet-button-bg-base);

        --wui-box-shadow-blue: var(--wui-color-accent-glass-020);
      }

      @supports (background: color-mix(in srgb, white 50%, black)) {
        :root {
          --wui-color-modal-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-modal-bg-base)
          );

          --wui-box-shadow-blue: color-mix(in srgb, var(--wui-color-accent-100) 20%, transparent);

          --wui-color-accent-100: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 100%,
            transparent
          );
          --wui-color-accent-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-glass-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-020: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 20%,
            transparent
          );
          --wui-color-accent-glass-015: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 15%,
            transparent
          );
          --wui-color-accent-glass-010: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 10%,
            transparent
          );
          --wui-color-accent-glass-005: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 5%,
            transparent
          );
          --wui-color-accent-002: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 2%,
            transparent
          );

          --wui-color-fg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-100)
          );
          --wui-color-fg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-125)
          );
          --wui-color-fg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-150)
          );
          --wui-color-fg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-175)
          );
          --wui-color-fg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-200)
          );
          --wui-color-fg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-225)
          );
          --wui-color-fg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-250)
          );
          --wui-color-fg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-275)
          );
          --wui-color-fg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-300)
          );
          --wui-color-fg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-325)
          );
          --wui-color-fg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-350)
          );

          --wui-color-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-100)
          );
          --wui-color-bg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-125)
          );
          --wui-color-bg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-150)
          );
          --wui-color-bg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-175)
          );
          --wui-color-bg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-200)
          );
          --wui-color-bg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-225)
          );
          --wui-color-bg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-250)
          );
          --wui-color-bg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-275)
          );
          --wui-color-bg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-300)
          );
          --wui-color-bg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-325)
          );
          --wui-color-bg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-350)
          );

          --wui-color-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-100)
          );
          --wui-color-success-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-125)
          );

          --wui-color-warning-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-warning-base-100)
          );

          --wui-color-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-100)
          );
          --wui-color-blue-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-100)
          );
          --wui-color-blue-90: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-90)
          );
          --wui-color-error-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-125)
          );

          --wui-icon-box-bg-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-error-base-100)
          );
          --wui-icon-box-bg-accent-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-blue-base-100)
          );
          --wui-icon-box-bg-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-success-base-100)
          );
          --wui-icon-box-bg-inverse-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-inverse-base-100)
          );

          --wui-all-wallets-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-all-wallets-bg-100)
          );

          --wui-avatar-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-avatar-border-base)
          );

          --wui-thumbnail-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-thumbnail-border-base)
          );

          --wui-wallet-button-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-wallet-button-bg-base)
          );
        }
      }
    `,light:ee`
      :root {
        --w3m-color-mix: ${yt(e?.["--w3m-color-mix"]||"#fff")};
        --w3m-accent: ${yt(gr(e,"dark")["--w3m-accent"])};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: ${yt(gr(e,"dark")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(230, 100%, 67%, 1);
        --wui-color-blueberry-090: hsla(231, 76%, 61%, 1);
        --wui-color-blueberry-080: hsla(230, 59%, 55%, 1);
        --wui-color-blueberry-050: hsla(231, 100%, 70%, 0.1);

        --wui-color-fg-100: #e4e7e7;
        --wui-color-fg-125: #d0d5d5;
        --wui-color-fg-150: #a8b1b1;
        --wui-color-fg-175: #a8b0b0;
        --wui-color-fg-200: #949e9e;
        --wui-color-fg-225: #868f8f;
        --wui-color-fg-250: #788080;
        --wui-color-fg-275: #788181;
        --wui-color-fg-300: #6e7777;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #363636;

        --wui-color-bg-100: #141414;
        --wui-color-bg-125: #191a1a;
        --wui-color-bg-150: #1e1f1f;
        --wui-color-bg-175: #222525;
        --wui-color-bg-200: #272a2a;
        --wui-color-bg-225: #2c3030;
        --wui-color-bg-250: #313535;
        --wui-color-bg-275: #363b3b;
        --wui-color-bg-300: #3b4040;
        --wui-color-bg-325: #252525;
        --wui-color-bg-350: #ffffff;

        --wui-color-success-base-100: #26d962;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f25a67;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 217, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 217, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 217, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 217, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 217, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 217, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 217, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 217, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 217, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 217, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(242, 90, 103, 0.01);
        --wui-color-error-glass-002: rgba(242, 90, 103, 0.02);
        --wui-color-error-glass-005: rgba(242, 90, 103, 0.05);
        --wui-color-error-glass-010: rgba(242, 90, 103, 0.1);
        --wui-color-error-glass-015: rgba(242, 90, 103, 0.15);
        --wui-color-error-glass-020: rgba(242, 90, 103, 0.2);
        --wui-color-error-glass-025: rgba(242, 90, 103, 0.25);
        --wui-color-error-glass-030: rgba(242, 90, 103, 0.3);
        --wui-color-error-glass-060: rgba(242, 90, 103, 0.6);
        --wui-color-error-glass-080: rgba(242, 90, 103, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-color-gray-glass-001: rgba(255, 255, 255, 0.01);
        --wui-color-gray-glass-002: rgba(255, 255, 255, 0.02);
        --wui-color-gray-glass-005: rgba(255, 255, 255, 0.05);
        --wui-color-gray-glass-010: rgba(255, 255, 255, 0.1);
        --wui-color-gray-glass-015: rgba(255, 255, 255, 0.15);
        --wui-color-gray-glass-020: rgba(255, 255, 255, 0.2);
        --wui-color-gray-glass-025: rgba(255, 255, 255, 0.25);
        --wui-color-gray-glass-030: rgba(255, 255, 255, 0.3);
        --wui-color-gray-glass-060: rgba(255, 255, 255, 0.6);
        --wui-color-gray-glass-080: rgba(255, 255, 255, 0.8);
        --wui-color-gray-glass-090: rgba(255, 255, 255, 0.9);

        --wui-color-dark-glass-100: rgba(42, 42, 42, 1);

        --wui-icon-box-bg-error-base-100: #3c2426;
        --wui-icon-box-bg-blue-base-100: #20303f;
        --wui-icon-box-bg-success-base-100: #1f3a28;
        --wui-icon-box-bg-inverse-base-100: #243240;

        --wui-all-wallets-bg-100: #222b35;

        --wui-avatar-border-base: #252525;

        --wui-thumbnail-border-base: #252525;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --w3m-card-embedded-shadow-color: rgb(17 17 18 / 25%);
      }
    `,dark:ee`
      :root {
        --w3m-color-mix: ${yt(e?.["--w3m-color-mix"]||"#000")};
        --w3m-accent: ${yt(gr(e,"light")["--w3m-accent"])};
        --w3m-default: #000;

        --wui-color-modal-bg-base: ${yt(gr(e,"light")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(231, 100%, 70%, 1);
        --wui-color-blueberry-090: hsla(231, 97%, 72%, 1);
        --wui-color-blueberry-080: hsla(231, 92%, 74%, 1);

        --wui-color-fg-100: #141414;
        --wui-color-fg-125: #2d3131;
        --wui-color-fg-150: #474d4d;
        --wui-color-fg-175: #636d6d;
        --wui-color-fg-200: #798686;
        --wui-color-fg-225: #828f8f;
        --wui-color-fg-250: #8b9797;
        --wui-color-fg-275: #95a0a0;
        --wui-color-fg-300: #9ea9a9;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #d0d0d0;

        --wui-color-bg-100: #ffffff;
        --wui-color-bg-125: #f5fafa;
        --wui-color-bg-150: #f3f8f8;
        --wui-color-bg-175: #eef4f4;
        --wui-color-bg-200: #eaf1f1;
        --wui-color-bg-225: #e5eded;
        --wui-color-bg-250: #e1e9e9;
        --wui-color-bg-275: #dce7e7;
        --wui-color-bg-300: #d8e3e3;
        --wui-color-bg-325: #f3f3f3;
        --wui-color-bg-350: #202020;

        --wui-color-success-base-100: #26b562;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f05142;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 181, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 181, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 181, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 181, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 181, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 181, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 181, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 181, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 181, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 181, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(240, 81, 66, 0.01);
        --wui-color-error-glass-002: rgba(240, 81, 66, 0.02);
        --wui-color-error-glass-005: rgba(240, 81, 66, 0.05);
        --wui-color-error-glass-010: rgba(240, 81, 66, 0.1);
        --wui-color-error-glass-015: rgba(240, 81, 66, 0.15);
        --wui-color-error-glass-020: rgba(240, 81, 66, 0.2);
        --wui-color-error-glass-025: rgba(240, 81, 66, 0.25);
        --wui-color-error-glass-030: rgba(240, 81, 66, 0.3);
        --wui-color-error-glass-060: rgba(240, 81, 66, 0.6);
        --wui-color-error-glass-080: rgba(240, 81, 66, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-icon-box-bg-error-base-100: #f4dfdd;
        --wui-icon-box-bg-blue-base-100: #d9ecfb;
        --wui-icon-box-bg-success-base-100: #daf0e4;
        --wui-icon-box-bg-inverse-base-100: #dcecfc;

        --wui-all-wallets-bg-100: #e8f1fa;

        --wui-avatar-border-base: #f3f4f4;

        --wui-thumbnail-border-base: #eaefef;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --wui-color-gray-glass-001: rgba(0, 0, 0, 0.01);
        --wui-color-gray-glass-002: rgba(0, 0, 0, 0.02);
        --wui-color-gray-glass-005: rgba(0, 0, 0, 0.05);
        --wui-color-gray-glass-010: rgba(0, 0, 0, 0.1);
        --wui-color-gray-glass-015: rgba(0, 0, 0, 0.15);
        --wui-color-gray-glass-020: rgba(0, 0, 0, 0.2);
        --wui-color-gray-glass-025: rgba(0, 0, 0, 0.25);
        --wui-color-gray-glass-030: rgba(0, 0, 0, 0.3);
        --wui-color-gray-glass-060: rgba(0, 0, 0, 0.6);
        --wui-color-gray-glass-080: rgba(0, 0, 0, 0.8);
        --wui-color-gray-glass-090: rgba(0, 0, 0, 0.9);

        --wui-color-dark-glass-100: rgba(233, 233, 233, 1);

        --w3m-card-embedded-shadow-color: rgb(224 225 233 / 25%);
      }
    `}}var pe=ee`
  *,
  *::after,
  *::before,
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-style: normal;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--wui-font-family);
    backface-visibility: hidden;
  }
`,ze=ee`
  button,
  a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      box-shadow var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border, box-shadow, border-radius;
    outline: none;
    border: none;
    column-gap: var(--wui-spacing-3xs);
    background-color: transparent;
    text-decoration: none;
  }

  wui-flex {
    transition: border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius;
  }

  button:disabled > wui-wallet-image,
  button:disabled > wui-all-wallets-image,
  button:disabled > wui-network-image,
  button:disabled > wui-image,
  button:disabled > wui-transaction-visual,
  button:disabled > wui-logo {
    filter: grayscale(1);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-gray-glass-005);
    }

    button:active:enabled {
      background-color: var(--wui-color-gray-glass-010);
    }
  }

  button:disabled > wui-icon-box {
    opacity: 0.5;
  }

  input {
    border: none;
    outline: none;
    appearance: none;
  }
`,li=ee`
  .wui-color-inherit {
    color: var(--wui-color-inherit);
  }

  .wui-color-accent-100 {
    color: var(--wui-color-accent-100);
  }

  .wui-color-error-100 {
    color: var(--wui-color-error-100);
  }

  .wui-color-blue-100 {
    color: var(--wui-color-blue-100);
  }

  .wui-color-blue-90 {
    color: var(--wui-color-blue-90);
  }

  .wui-color-error-125 {
    color: var(--wui-color-error-125);
  }

  .wui-color-success-100 {
    color: var(--wui-color-success-100);
  }

  .wui-color-success-125 {
    color: var(--wui-color-success-125);
  }

  .wui-color-inverse-100 {
    color: var(--wui-color-inverse-100);
  }

  .wui-color-inverse-000 {
    color: var(--wui-color-inverse-000);
  }

  .wui-color-fg-100 {
    color: var(--wui-color-fg-100);
  }

  .wui-color-fg-200 {
    color: var(--wui-color-fg-200);
  }

  .wui-color-fg-300 {
    color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    color: var(--wui-color-fg-350);
  }

  .wui-bg-color-inherit {
    background-color: var(--wui-color-inherit);
  }

  .wui-bg-color-blue-100 {
    background-color: var(--wui-color-accent-100);
  }

  .wui-bg-color-error-100 {
    background-color: var(--wui-color-error-100);
  }

  .wui-bg-color-error-125 {
    background-color: var(--wui-color-error-125);
  }

  .wui-bg-color-success-100 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-success-125 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-inverse-100 {
    background-color: var(--wui-color-inverse-100);
  }

  .wui-bg-color-inverse-000 {
    background-color: var(--wui-color-inverse-000);
  }

  .wui-bg-color-fg-100 {
    background-color: var(--wui-color-fg-100);
  }

  .wui-bg-color-fg-200 {
    background-color: var(--wui-color-fg-200);
  }

  .wui-bg-color-fg-300 {
    background-color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    background-color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    background-color: var(--wui-color-fg-350);
  }
`,Me={getSpacingStyles(e,t){if(Array.isArray(e))return e[t]?`var(--wui-spacing-${e[t]})`:void 0;if(typeof e=="string")return`var(--wui-spacing-${e})`},getFormattedDate(e){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(e)},getHostName(e){try{return new URL(e).hostname}catch{return""}},getTruncateString({string:e,charsStart:t,charsEnd:r,truncate:o}){return e.length<=t+r?e:o==="end"?`${e.substring(0,t)}...`:o==="start"?`...${e.substring(e.length-r)}`:`${e.substring(0,Math.floor(t))}...${e.substring(e.length-Math.floor(r))}`},generateAvatarColors(e){let t=e.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),r=this.hexToRgb(t),o=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),n=100-3*Number(o?.replace("px","")),i=`${n}% ${n}% at 65% 40%`,s=[];for(let a=0;a<5;a+=1){let c=this.tintColor(r,.15*a);s.push(`rgb(${c[0]}, ${c[1]}, ${c[2]})`)}return`
    --local-color-1: ${s[0]};
    --local-color-2: ${s[1]};
    --local-color-3: ${s[2]};
    --local-color-4: ${s[3]};
    --local-color-5: ${s[4]};
    --local-radial-circle: ${i}
   `},hexToRgb(e){let t=parseInt(e,16),r=t>>16&255,o=t>>8&255,n=t&255;return[r,o,n]},tintColor(e,t){let[r,o,n]=e,i=Math.round(r+(255-r)*t),s=Math.round(o+(255-o)*t),a=Math.round(n+(255-n)*t);return[i,s,a]},isNumber(e){return/^[0-9]+$/u.test(e)},getColorTheme(e){return e||(typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark")},splitBalance(e){let t=e.split(".");return t.length===2?[t[0],t[1]]:["0","00"]},roundNumber(e,t,r){return e.toString().length>=t?Number(e).toFixed(r):e},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})}};function zf(e,t){let{kind:r,elements:o}=t;return{kind:r,elements:o,finisher(n){customElements.get(e)||customElements.define(e,n)}}}function Df(e,t){return customElements.get(e)||customElements.define(e,t),t}function Z(e){return function(t){return typeof t=="function"?Df(e,t):zf(e,t)}}function jf(e){if(e.length>=255)throw new TypeError("Alphabet too long");let t=new Uint8Array(256);for(let l=0;l<t.length;l++)t[l]=255;for(let l=0;l<e.length;l++){let d=e.charAt(l),u=d.charCodeAt(0);if(t[u]!==255)throw new TypeError(d+" is ambiguous");t[u]=l}let r=e.length,o=e.charAt(0),n=Math.log(r)/Math.log(256),i=Math.log(256)/Math.log(r);function s(l){if(l instanceof Uint8Array||(ArrayBuffer.isView(l)?l=new Uint8Array(l.buffer,l.byteOffset,l.byteLength):Array.isArray(l)&&(l=Uint8Array.from(l))),!(l instanceof Uint8Array))throw new TypeError("Expected Uint8Array");if(l.length===0)return"";let d=0,u=0,h=0,p=l.length;for(;h!==p&&l[h]===0;)h++,d++;let w=(p-h)*i+1>>>0,b=new Uint8Array(w);for(;h!==p;){let x=l[h],C=0;for(let E=w-1;(x!==0||C<u)&&E!==-1;E--,C++)x+=256*b[E]>>>0,b[E]=x%r>>>0,x=x/r>>>0;if(x!==0)throw new Error("Non-zero carry");u=C,h++}let v=w-u;for(;v!==w&&b[v]===0;)v++;let m=o.repeat(d);for(;v<w;++v)m+=e.charAt(b[v]);return m}function a(l){if(typeof l!="string")throw new TypeError("Expected String");if(l.length===0)return new Uint8Array;let d=0,u=0,h=0;for(;l[d]===o;)u++,d++;let p=(l.length-d)*n+1>>>0,w=new Uint8Array(p);for(;d<l.length;){let x=l.charCodeAt(d);if(x>255)return;let C=t[x];if(C===255)return;let E=0;for(let I=p-1;(C!==0||E<h)&&I!==-1;I--,E++)C+=r*w[I]>>>0,w[I]=C%256>>>0,C=C/256>>>0;if(C!==0)throw new Error("Non-zero carry");h=E,d++}let b=p-h;for(;b!==p&&w[b]===0;)b++;let v=new Uint8Array(u+(p-b)),m=u;for(;b!==p;)v[m++]=w[b++];return v}function c(l){let d=a(l);if(d)return d;throw new Error("Non-base"+r+" character")}return{encode:s,decodeUnsafe:a,decode:c}}var Wf="123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",Hf=jf(Wf),ki={ERROR_CODE_UNRECOGNIZED_CHAIN_ID:4902,ERROR_CODE_DEFAULT:5e3,ERROR_INVALID_CHAIN_ID:32603},Vu={gasPriceOracle:{address:"0x420000000000000000000000000000000000000F"},l1Block:{address:"0x4200000000000000000000000000000000000015"},l2CrossDomainMessenger:{address:"0x4200000000000000000000000000000000000007"},l2Erc721Bridge:{address:"0x4200000000000000000000000000000000000014"},l2StandardBridge:{address:"0x4200000000000000000000000000000000000010"},l2ToL1MessagePasser:{address:"0x4200000000000000000000000000000000000016"}},Ff={block:lu({format(e){return{transactions:e.transactions?.map(t=>{if(typeof t=="string")return t;let r=Gs(t);return r.typeHex==="0x7e"&&(r.isSystemTx=t.isSystemTx,r.mint=t.mint?Jt(t.mint):void 0,r.sourceHash=t.sourceHash,r.type="deposit"),r}),stateRoot:e.stateRoot}}}),transaction:cu({format(e){let t={};return e.type==="0x7e"&&(t.isSystemTx=e.isSystemTx,t.mint=e.mint?Jt(e.mint):void 0,t.sourceHash=e.sourceHash,t.type="deposit"),t}}),transactionReceipt:Mp({format(e){return{l1GasPrice:e.l1GasPrice?Jt(e.l1GasPrice):null,l1GasUsed:e.l1GasUsed?Jt(e.l1GasUsed):null,l1Fee:e.l1Fee?Jt(e.l1Fee):null,l1FeeScalar:e.l1FeeScalar?Number(e.l1FeeScalar):null}}})};function Zu(e,t){return qf(e)?Zf(e):Sp(e,t)}var Vf={transaction:Zu};function Zf(e){Gf(e);let{sourceHash:t,data:r,from:o,gas:n,isSystemTx:i,mint:s,to:a,value:c}=e,l=[t,o,a??"0x",s?oe(s):"0x",c?oe(c):"0x",n?oe(n):"0x",i?"0x1":"0x",r??"0x"];return Do(["0x7e",no(l)])}function qf(e){return e.type==="deposit"||typeof e.sourceHash<"u"}function Gf(e){let{from:t,to:r}=e;if(t&&!tr(t))throw new Ut({address:t});if(r&&!tr(r))throw new Ut({address:r})}var T={contracts:Vu,formatters:Ff,serializers:Vf},ka=1;({...T,contracts:{...T.contracts,l2OutputOracle:ka+"",portal:ka+"",l1StandardBridge:ka+""}});var Aa=11155111;({...T,contracts:{...T.contracts,l2OutputOracle:Aa+"",portal:Aa+"",l1StandardBridge:Aa+""}});var Ai=1;({...T,contracts:{...T.contracts,disputeGameFactory:Ai+"",l2OutputOracle:Ai+"",portal:Ai+"",l1StandardBridge:Ai+""}});var Na=5;({...T,contracts:{...T.contracts,l2OutputOracle:Na+"",portal:Na+"",l1StandardBridge:Na+""}});var Ni=11155111;({...T,contracts:{...T.contracts,disputeGameFactory:Ni+"",l2OutputOracle:Ni+"",portal:Ni+"",l1StandardBridge:Ni+""}},St({id:53456,name:"BirdLayer",nativeCurrency:{decimals:18,name:"Ether",symbol:"ETH"},rpcUrls:{default:{http:["https://rpc.birdlayer.xyz","https://rpc1.birdlayer.xyz"],webSocket:["wss://rpc.birdlayer.xyz/ws"]}},blockExplorers:{default:{name:"BirdLayer Explorer",url:"https://scan.birdlayer.xyz"}}}));({...T,contracts:{...T.contracts}});var Ia=1;St({...T,id:60808,name:"BOB",nativeCurrency:{decimals:18,name:"ETH",symbol:"ETH"},rpcUrls:{default:{http:["https://rpc.gobob.xyz"],webSocket:["wss://rpc.gobob.xyz"]}},blockExplorers:{default:{name:"BOB Explorer",url:"https://explorer.gobob.xyz"}},contracts:{...T.contracts,multicall3:{address:"0xcA11bde05977b3631167028862bE2a173976CA11",blockCreated:23131},l2OutputOracle:{[Ia]:{address:"0xdDa53E23f8a32640b04D7256e651C1db98dB11C1",blockCreated:4462615}},portal:{[Ia]:{address:"0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E",blockCreated:4462615}}},sourceId:Ia});var Sa=11155111;St({...T,id:808813,name:"BOB Sepolia",nativeCurrency:{decimals:18,name:"ETH",symbol:"ETH"},rpcUrls:{default:{http:["https://bob-sepolia.rpc.gobob.xyz"],webSocket:["wss://bob-sepolia.rpc.gobob.xyz"]}},blockExplorers:{default:{name:"BOB Sepolia Explorer",url:"https://bob-sepolia.explorer.gobob.xyz"}},contracts:{...T.contracts,multicall3:{address:"0xcA11bde05977b3631167028862bE2a173976CA11",blockCreated:35677},l2OutputOracle:{[Sa]:{address:"0x14D0069452b4AE2b250B395b8adAb771E4267d2f",blockCreated:4462615}},portal:{[Sa]:{address:"0x867B1Aa872b9C8cB5E9F7755feDC45BB24Ad0ae4",blockCreated:4462615}}},testnet:!0,sourceId:Sa});var Kf={estimateFeesPerGas:async e=>{if(!e.request?.feeCurrency)return null;let[t,r]=await Promise.all([Yf(e.client,e.request.feeCurrency),Jf(e.client,e.request.feeCurrency)]);return{maxFeePerGas:e.multiply(t-r)+r,maxPriorityFeePerGas:r}}};async function Yf(e,t){let r=await e.request({method:"eth_gasPrice",params:[t]});return BigInt(r)}async function Jf(e,t){let r=await e.request({method:"eth_maxPriorityFeePerGas",params:[t]});return BigInt(r)}function qu(e){return e===0||e===0n||e===void 0||e===null||e==="0"||e===""||typeof e=="string"&&(No(e).toLowerCase()==="0x"||No(e).toLowerCase()==="0x00")}function vn(e){return!qu(e)}function Xf(e){return typeof e.maxFeePerGas<"u"&&typeof e.maxPriorityFeePerGas<"u"}function Gu(e){return e.type==="cip64"?!0:Xf(e)&&vn(e.feeCurrency)}var Qf={block:lu({format(e){return{transactions:e.transactions?.map(t=>typeof t=="string"?t:{...Gs(t),...t.gatewayFee?{gatewayFee:Jt(t.gatewayFee),gatewayFeeRecipient:t.gatewayFeeRecipient}:{},feeCurrency:t.feeCurrency}),...e.randomness?{randomness:e.randomness}:{}}}}),transaction:cu({format(e){if(e.type==="0x7e")return{isSystemTx:e.isSystemTx,mint:e.mint?Jt(e.mint):void 0,sourceHash:e.sourceHash,type:"deposit"};let t={feeCurrency:e.feeCurrency};return e.type==="0x7b"?t.type="cip64":(e.type==="0x7c"&&(t.type="cip42"),t.gatewayFee=e.gatewayFee?Jt(e.gatewayFee):null,t.gatewayFeeRecipient=e.gatewayFeeRecipient),t}}),transactionRequest:Jh({format(e){let t={};return e.feeCurrency&&(t.feeCurrency=e.feeCurrency),Gu(e)&&(t.type="0x7b"),t}})};function ew(e,t){return Gu(e)?rw(e,t):Zu(e,t)}var tw={transaction:ew};function rw(e,t){nw(e);let{chainId:r,gas:o,nonce:n,to:i,value:s,maxFeePerGas:a,maxPriorityFeePerGas:c,accessList:l,feeCurrency:d,data:u}=e,h=[oe(r),n?oe(n):"0x",c?oe(c):"0x",a?oe(a):"0x",o?oe(o):"0x",i??"0x",s?oe(s):"0x",u??"0x",si(l),d,...jo(e,t)];return Do(["0x7b",no(h)])}var ow=qs;function nw(e){let{chainId:t,maxPriorityFeePerGas:r,gasPrice:o,maxFeePerGas:n,to:i,feeCurrency:s}=e;if(t<=0)throw new eo({chainId:t});if(i&&!tr(i))throw new Ut({address:i});if(o)throw new ue("`gasPrice` is not a valid CIP-64 Transaction attribute.");if(vn(n)&&n>ow)throw new Qr({maxFeePerGas:n});if(vn(r)&&vn(n)&&r>n)throw new Kn({maxFeePerGas:n,maxPriorityFeePerGas:r});if(vn(s)&&!tr(s))throw new ue("`feeCurrency` MUST be a token address for CIP-64 transactions.");if(qu(s))throw new ue("`feeCurrency` must be provided for CIP-64 transactions.")}var Xd={contracts:Vu,formatters:Qf,serializers:tw,fees:Kf},Ii=17e3;({...Xd,contracts:{...Xd.contracts,portal:Ii+"",disputeGameFactory:Ii+"",l2OutputOracle:Ii+"",l1StandardBridge:Ii+""}},St({id:44,name:"Crab Network",nativeCurrency:{decimals:18,name:"Crab Network Native Token",symbol:"CRAB"},rpcUrls:{default:{http:["https://crab-rpc.darwinia.network"],webSocket:["wss://crab-rpc.darwinia.network"]}},blockExplorers:{default:{name:"Blockscout",url:"https://crab-scan.darwinia.network"}},contracts:{multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:3032593}}})),St({id:66665,name:"Creator",nativeCurrency:{decimals:18,name:"Ether",symbol:"ETH"},rpcUrls:{default:{http:["https://rpc.creatorchain.io"]}},blockExplorers:{default:{name:"Explorer",url:"https://explorer.creatorchain.io"}},contracts:{multicall3:{address:"0xcA11bde05977b3631167028862bE2a173976CA11"}},testnet:!0}),{...T,contracts:{...T.contracts}},{...T,contracts:{...T.contracts}},St({id:53457,name:"DODOchain Testnet",nativeCurrency:{decimals:18,name:"DODO",symbol:"DODO"},rpcUrls:{default:{http:["https://dodochain-testnet.alt.technology"],webSocket:["wss://dodochain-testnet.alt.technology/ws"]}},blockExplorers:{default:{name:"DODOchain Testnet (Sepolia) Explorer",url:"https://testnet-scan.dodochain.com"}},testnet:!0});var qo=1;({...T.contracts,addressManager:qo+"",l1CrossDomainMessenger:qo+"",l2OutputOracle:qo+"",portal:qo+"",l1StandardBridge:qo+""});var Go=11155111;({...T.contracts,addressManager:Go+"",l1CrossDomainMessenger:Go+"",l2OutputOracle:Go+"",portal:Go+"",l1StandardBridge:Go+""});var _a=1;({...T,contracts:{...T.contracts,l2OutputOracle:_a+"",portal:_a+"",l1StandardBridge:_a+""}});var Oa=17e3;({...T,contracts:{...T.contracts,l2OutputOracle:Oa+"",portal:Oa+"",l1StandardBridge:Oa+""}});({...T,contracts:{...T.contracts}});var iw=11155111;St({...T,id:3397901,network:"funkiSepolia",name:"Funki Sepolia Sandbox",nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{default:{http:["https://funki-testnet.alt.technology"]}},blockExplorers:{default:{name:"Funki Sepolia Sandbox Explorer",url:"https://sepolia-sandbox.funkichain.com/"}},testnet:!0,contracts:{...T.contracts,multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:1620204}},sourceId:iw});var Si=17e3;St({...T,name:"Garnet Testnet",testnet:!0,id:17069,sourceId:Si,nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{default:{http:["https://rpc.garnetchain.com"],webSocket:["wss://rpc.garnetchain.com"]}},blockExplorers:{default:{name:"Blockscout",url:"https://explorer.garnetchain.com"}},contracts:{...T.contracts,multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11"},portal:{[Si]:{address:"0x57ee40586fbE286AfC75E67cb69511A6D9aF5909",blockCreated:1274684}},l2OutputOracle:{[Si]:{address:"0xCb8E7AC561b8EF04F2a15865e9fbc0766FEF569B",blockCreated:1274684}},l1StandardBridge:{[Si]:{address:"0x09bcDd311FE398F80a78BE37E489f5D440DB95DE",blockCreated:1274684}}}});var Ta=1;({...T,contracts:{...T.contracts,disputeGameFactory:Ta+"",portal:Ta+"",l1StandardBridge:Ta+""}});var Pa=11155111;({...T,contracts:{...T.contracts,disputeGameFactory:Pa+"",portal:Pa+"",l1StandardBridge:Pa+""}},St({id:701,name:"Koi Network",nativeCurrency:{decimals:18,name:"Koi Network Native Token",symbol:"KRING"},rpcUrls:{default:{http:["https://koi-rpc.darwinia.network"],webSocket:["wss://koi-rpc.darwinia.network"]}},blockExplorers:{default:{name:"Blockscout",url:"https://koi-scan.darwinia.network"}},contracts:{multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11",blockCreated:180001}},testnet:!0}));var Ra=1;({...T,contracts:{...T.contracts,l2OutputOracle:Ra+"",portal:Ra+"",l1StandardBridge:Ra+""}});var $a=11155111;({...T,contracts:{...T.contracts,l2OutputOracle:$a+"",portal:$a+"",l1StandardBridge:$a+""}});var La=1;({...T,contracts:{...T.contracts,l2OutputOracle:La+"",portal:La+"",l1StandardBridge:La+""}});var Ba=1;({...T,contracts:{...T.contracts,l2OutputOracle:Ba+"",portal:Ba+"",l1StandardBridge:Ba+""}});var Ma=11155111;({...T,contracts:{...T.contracts,l2OutputOracle:Ma+"",portal:Ma+"",l1StandardBridge:Ma+""}});var Ua=56;({...T.contracts,l2OutputOracle:Ua+"",portal:Ua+"",l1StandardBridge:Ua+""});var za=97;({...T.contracts,l2OutputOracle:za+"",portal:za+"",l1StandardBridge:za+""});var _i=1;({...T,contracts:{...T.contracts,disputeGameFactory:_i+"",l2OutputOracle:_i+"",portal:_i+"",l1StandardBridge:_i+""}});var Da=5;({...T,contracts:{...T.contracts,l2OutputOracle:Da+"",portal:Da+"",l1StandardBridge:Da+""}});var Oi=11155111;({...T,contracts:{...T.contracts,disputeGameFactory:Oi+"",l2OutputOracle:Oi+"",portal:Oi+"",l1StandardBridge:Oi+""}});var Qd=11155111;St({...T,name:"Pyrope Testnet",testnet:!0,id:695569,sourceId:Qd,nativeCurrency:{name:"Ether",symbol:"ETH",decimals:18},rpcUrls:{default:{http:["https://rpc.pyropechain.com"],webSocket:["wss://rpc.pyropechain.com"]}},blockExplorers:{default:{name:"Blockscout",url:"https://pyrope.blockscout.com"}},contracts:{...T.contracts,l1StandardBridge:{[Qd]:{address:"0xC24932c31D9621aE9e792576152B7ef010cFC2F8"}}}});var Ti=1;St({...T,name:"Redstone",id:690,sourceId:Ti,nativeCurrency:{decimals:18,name:"Ether",symbol:"ETH"},rpcUrls:{default:{http:["https://rpc.redstonechain.com"],webSocket:["wss://rpc.redstonechain.com"]}},blockExplorers:{default:{name:"Blockscout",url:"https://explorer.redstone.xyz"}},contracts:{...T.contracts,multicall3:{address:"0xca11bde05977b3631167028862be2a173976ca11"},portal:{[Ti]:{address:"0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae",blockCreated:19578329}},l2OutputOracle:{[Ti]:{address:"0xa426A052f657AEEefc298b3B5c35a470e4739d69",blockCreated:19578337}},l1StandardBridge:{[Ti]:{address:"0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69",blockCreated:19578331}}}});var ja=1;({...T,contracts:{...T.contracts,l2OutputOracle:ja+"",portal:ja+"",l1StandardBridge:ja+""}});var Wa=11155111;({...T,contracts:{...T.contracts,l2OutputOracle:Wa+"",portal:Wa+"",l1StandardBridge:Wa+""}});var Ha=1;({...T,contracts:{...T.contracts,l2OutputOracle:Ha+"",portal:Ha+"",l1StandardBridge:Ha+""}});({...T,contracts:{...T.contracts}});var Pi=1;({...T,contracts:{...T.contracts,disputeGameFactory:Pi+"",l2OutputOracle:Pi+"",portal:Pi+"",l1StandardBridge:Pi+""}});var Ri=11155111;({...T,contracts:{...T.contracts,disputeGameFactory:Ri+"",l2OutputOracle:Ri+"",portal:Ri+"",l1StandardBridge:Ri+""}});var $i=1;({...T,contracts:{...T.contracts,disputeGameFactory:$i+"",l2OutputOracle:$i+"",portal:$i+"",l1StandardBridge:$i+""}});var Li=11155111;({...T,contracts:{...T.contracts,disputeGameFactory:Li+"",l2OutputOracle:Li+"",portal:Li+"",l1StandardBridge:Li+""}});var Bi=1;({...T,contracts:{...T.contracts,disputeGameFactory:Bi+"",l2OutputOracle:Bi+"",portal:Bi+"",l1StandardBridge:Bi+""}});var e0=11155111;({...T,contracts:{...T.contracts,portal:e0+"",l1StandardBridge:e0+""}},{...T,contracts:{...T.contracts}}),{...T,contracts:{...T.contracts}};var Fa=1;({...T,contracts:{...T.contracts,disputeGameFactory:Fa+"",portal:Fa+"",l1StandardBridge:Fa+""}});var Va=11155111;({...T,contracts:{...T.contracts,portal:Va+"",l1StandardBridge:Va+"",disputeGameFactory:Va+""}});var Mi=1;({...T,contracts:{...T.contracts,disputeGameFactory:Mi+"",l2OutputOracle:Mi+"",portal:Mi+"",l1StandardBridge:Mi+""}});var Ui=11155111;({...T,contracts:{...T.contracts,disputeGameFactory:Ui+"",l2OutputOracle:Ui+"",portal:Ui+"",l1StandardBridge:Ui+""}});var Za=1;({...T,contracts:{...T.contracts,l2OutputOracle:Za+"",portal:Za+"",l1StandardBridge:Za+""}});var qa=11155111;({...T,contracts:{...T.contracts,l2OutputOracle:qa+"",portal:qa+"",l1StandardBridge:qa+""}});var sw=5;({...T,contracts:{...T.contracts,portal:sw+""}});function ko(e){return{formatters:void 0,fees:void 0,serializers:void 0,...e}}var t0=ko({id:"5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",name:"Solana",network:"solana-mainnet",nativeCurrency:{name:"Solana",symbol:"SOL",decimals:9},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}},blockExplorers:{default:{name:"Solscan",url:"https://solscan.io"}},testnet:!1,chainNamespace:"solana",caipNetworkId:"solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",deprecatedCaipNetworkId:"solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ"}),r0=ko({id:"EtWTRABZaYq6iMfeYKouRu166VU2xqa1",name:"Solana Devnet",network:"solana-devnet",nativeCurrency:{name:"Solana",symbol:"SOL",decimals:9},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}},blockExplorers:{default:{name:"Solscan",url:"https://solscan.io"}},testnet:!0,chainNamespace:"solana",caipNetworkId:"solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1",deprecatedCaipNetworkId:"solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K"});ko({id:"4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z",name:"Solana Testnet",network:"solana-testnet",nativeCurrency:{name:"Solana",symbol:"SOL",decimals:9},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}},blockExplorers:{default:{name:"Solscan",url:"https://solscan.io"}},testnet:!0,chainNamespace:"solana",caipNetworkId:"solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z"}),ko({id:"000000000019d6689c085ae165831e93",caipNetworkId:"bip122:000000000019d6689c085ae165831e93",chainNamespace:"bip122",name:"Bitcoin",nativeCurrency:{name:"Bitcoin",symbol:"BTC",decimals:8},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}}}),ko({id:"000000000933ea01ad0ee984209779ba",caipNetworkId:"bip122:000000000933ea01ad0ee984209779ba",chainNamespace:"bip122",name:"Bitcoin Testnet",nativeCurrency:{name:"Bitcoin",symbol:"BTC",decimals:8},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}},testnet:!0});var aw={solana:["solana_signMessage","solana_signTransaction","solana_requestAccounts","solana_getAccounts","solana_signAllTransactions","solana_signAndSendTransaction"],eip155:["eth_accounts","eth_requestAccounts","eth_sendRawTransaction","eth_sign","eth_signTransaction","eth_signTypedData","eth_signTypedData_v3","eth_signTypedData_v4","eth_sendTransaction","personal_sign","wallet_switchEthereumChain","wallet_addEthereumChain","wallet_getPermissions","wallet_requestPermissions","wallet_registerOnboarding","wallet_watchAsset","wallet_scanQRCode","wallet_getCallsStatus","wallet_showCallsStatus","wallet_sendCalls","wallet_getCapabilities","wallet_grantPermissions","wallet_revokePermissions","wallet_getAssets"],bip122:["sendTransfer","signMessage","signPsbt","getAccountAddresses"]},Ku={getMethodsByChainNamespace(e){return aw[e]||[]},createDefaultNamespace(e){return{methods:this.getMethodsByChainNamespace(e),events:["accountsChanged","chainChanged"],chains:[],rpcMap:{}}},applyNamespaceOverrides(e,t){if(!t)return{...e};let r={...e},o=new Set;if(t.methods&&Object.keys(t.methods).forEach(n=>o.add(n)),t.chains&&Object.keys(t.chains).forEach(n=>o.add(n)),t.events&&Object.keys(t.events).forEach(n=>o.add(n)),t.rpcMap&&Object.keys(t.rpcMap).forEach(n=>{let[i]=n.split(":");i&&o.add(i)}),o.forEach(n=>{r[n]||(r[n]=this.createDefaultNamespace(n))}),t.methods&&Object.entries(t.methods).forEach(([n,i])=>{r[n]&&(r[n].methods=i)}),t.chains&&Object.entries(t.chains).forEach(([n,i])=>{r[n]&&(r[n].chains=i)}),t.events&&Object.entries(t.events).forEach(([n,i])=>{r[n]&&(r[n].events=i)}),t.rpcMap){let n=new Set;Object.entries(t.rpcMap).forEach(([i,s])=>{let[a,c]=i.split(":");!a||!c||!r[a]||(r[a].rpcMap||(r[a].rpcMap={}),n.has(a)||(r[a].rpcMap={},n.add(a)),r[a].rpcMap[c]=s)})}return r},createNamespaces(e,t){let r=e.reduce((o,n)=>{let{id:i,chainNamespace:s,rpcUrls:a}=n,c=a.default.http[0];o[s]||(o[s]=this.createDefaultNamespace(s));let l=`${s}:${i}`,d=o[s];switch(d.chains.push(l),l){case t0.caipNetworkId:d.chains.push(t0.deprecatedCaipNetworkId);break;case r0.caipNetworkId:d.chains.push(r0.deprecatedCaipNetworkId);break}return d?.rpcMap&&c&&(d.rpcMap[i]=c),o},{});return this.applyNamespaceOverrides(r,t)},resolveReownName:async e=>{let t=await Bu.resolveName(e);return(Object.values(t?.addresses)||[])[0]?.address||!1},getChainsFromNamespaces(e={}){return Object.values(e).flatMap(t=>{let r=t.chains||[],o=t.accounts.map(n=>{let[i,s]=n.split(":");return`${i}:${s}`});return Array.from(new Set([...r,...o]))})},isSessionEventData(e){return typeof e=="object"&&e!==null&&"id"in e&&"topic"in e&&"params"in e&&typeof e.params=="object"&&e.params!==null&&"chainId"in e.params&&"event"in e.params&&typeof e.params.event=="object"&&e.params.event!==null}},Ms=class{constructor({provider:t,namespace:r}){this.id=G.CONNECTOR_ID.WALLET_CONNECT,this.name=Ss.ConnectorNamesMap[G.CONNECTOR_ID.WALLET_CONNECT],this.type="WALLET_CONNECT",this.imageId=Ss.ConnectorImageIds[G.CONNECTOR_ID.WALLET_CONNECT],this.getCaipNetworks=g.getCaipNetworks.bind(g),this.caipNetworks=this.getCaipNetworks(),this.provider=t,this.chain=r}get chains(){return this.getCaipNetworks()}async connectWalletConnect(){if(!await this.authenticate()){let t=this.getCaipNetworks(),r=O.state.universalProviderConfigOverride,o=Ku.createNamespaces(t,r);await this.provider.connect({optionalNamespaces:o})}return{clientId:await this.provider.client.core.crypto.getClientId(),session:this.provider.session}}async disconnect(){await this.provider.disconnect()}async authenticate(){let t=this.chains.map(r=>r.caipNetworkId);return mr.universalProviderAuthenticate({universalProvider:this.provider,chains:t,methods:cw})}},cw=["eth_accounts","eth_requestAccounts","eth_sendRawTransaction","eth_sign","eth_signTransaction","eth_signTypedData","eth_signTypedData_v3","eth_signTypedData_v4","eth_sendTransaction","personal_sign","wallet_switchEthereumChain","wallet_addEthereumChain","wallet_getPermissions","wallet_requestPermissions","wallet_registerOnboarding","wallet_watchAsset","wallet_scanQRCode","wallet_getCallsStatus","wallet_sendCalls","wallet_getCapabilities","wallet_grantPermissions","wallet_revokePermissions","wallet_getAssets"],vl=class{constructor(t){this.availableConnectors=[],this.eventListeners=new Map,this.getCaipNetworks=r=>g.getCaipNetworks(r),t&&this.construct(t)}construct(t){this.projectId=t.projectId,this.namespace=t.namespace,this.adapterType=t.adapterType}get connectors(){return this.availableConnectors}get networks(){return this.getCaipNetworks(this.namespace)}setAuthProvider(t){this.addConnector({id:G.CONNECTOR_ID.AUTH,type:"AUTH",name:G.CONNECTOR_NAMES.AUTH,provider:t,imageId:Ss.ConnectorImageIds[G.CONNECTOR_ID.AUTH],chain:this.namespace,chains:[]})}addConnector(...t){let r=new Set;this.availableConnectors=[...t,...this.availableConnectors].filter(o=>r.has(o.id)?!1:(r.add(o.id),!0)),this.emit("connectors",this.availableConnectors)}setStatus(t,r){J.setStatus(t,r)}on(t,r){this.eventListeners.has(t)||this.eventListeners.set(t,new Set),this.eventListeners.get(t)?.add(r)}off(t,r){let o=this.eventListeners.get(t);o&&o.delete(r)}removeAllEventListeners(){this.eventListeners.forEach(t=>{t.clear()})}emit(t,r){let o=this.eventListeners.get(t);o&&o.forEach(n=>n(r))}async connectWalletConnect(t){return{clientId:(await this.getWalletConnectConnector().connectWalletConnect()).clientId}}async switchNetwork(t){let{caipNetwork:r,providerType:o}=t;if(!t.provider)return;let n="provider"in t.provider?t.provider.provider:t.provider;if(o==="WALLET_CONNECT"){n.setDefaultChain(r.caipNetworkId);return}if(n&&o==="AUTH"){let i=n,s=J.state.preferredAccountTypes?.[r.chainNamespace];await i.switchNetwork(r.caipNetworkId);let a=await i.getUser({chainId:r.caipNetworkId,preferredAccountType:s});this.emit("switchNetwork",a)}}getWalletConnectConnector(){let t=this.connectors.find(r=>r instanceof Ms);if(!t)throw new Error("WalletConnectConnector not found");return t}},bl=class extends vl{setUniversalProvider(t){this.addConnector(new Ms({provider:t,caipNetworks:this.getCaipNetworks(),namespace:this.namespace}))}async connect(t){return Promise.resolve({id:"WALLET_CONNECT",type:"WALLET_CONNECT",chainId:Number(t.chainId),provider:this.provider,address:""})}async disconnect(){try{await this.getWalletConnectConnector().disconnect()}catch(t){console.warn("UniversalAdapter:disconnect - error",t)}}async getAccounts({namespace:t}){let r=this.provider?.session?.namespaces?.[t]?.accounts?.map(o=>{let[,,n]=o.split(":");return n}).filter((o,n,i)=>i.indexOf(o)===n)||[];return Promise.resolve({accounts:r.map(o=>M.createAccount(t,o,t==="bip122"?"payment":"eoa"))})}async syncConnectors(){return Promise.resolve()}async getBalance(t){if(!(t.caipNetwork&&Re.BALANCE_SUPPORTED_CHAINS.includes(t.caipNetwork?.chainNamespace))||t.caipNetwork?.testnet)return{balance:"0.00",symbol:t.caipNetwork?.nativeCurrency.symbol||""};if(J.state.balanceLoading&&t.chainId===g.state.activeCaipNetwork?.id)return{balance:J.state.balance||"0.00",symbol:J.state.balanceSymbol||""};let r=(await J.fetchTokenBalance()).find(o=>o.chainId===`${t.caipNetwork?.chainNamespace}:${t.chainId}`&&o.symbol===t.caipNetwork?.nativeCurrency.symbol);return{balance:r?.quantity.numeric||"0.00",symbol:r?.symbol||t.caipNetwork?.nativeCurrency.symbol||""}}async signMessage(t){let{provider:r,message:o,address:n}=t;if(!r)throw new Error("UniversalAdapter:signMessage - provider is undefined");let i="";return g.state.activeCaipNetwork?.chainNamespace===G.CHAIN.SOLANA?i=(await r.request({method:"solana_signMessage",params:{message:Hf.encode(new TextEncoder().encode(o)),pubkey:n}},g.state.activeCaipNetwork?.caipNetworkId)).signature:i=await r.request({method:"personal_sign",params:[o,n]},g.state.activeCaipNetwork?.caipNetworkId),{signature:i}}async estimateGas(){return Promise.resolve({gas:BigInt(0)})}async getProfile(){return Promise.resolve({profileImage:"",profileName:""})}async sendTransaction(){return Promise.resolve({hash:""})}walletGetAssets(t){return Promise.resolve({})}async writeContract(){return Promise.resolve({hash:""})}async getEnsAddress(){return Promise.resolve({address:!1})}parseUnits(){return 0n}formatUnits(){return"0"}async getCapabilities(){return Promise.resolve({})}async grantPermissions(){return Promise.resolve({})}async revokePermissions(){return Promise.resolve("0x")}async syncConnection(){return Promise.resolve({id:"WALLET_CONNECT",type:"WALLET_CONNECT",chainId:1,provider:this.provider,address:""})}async switchNetwork(t){let{caipNetwork:r}=t,o=this.getWalletConnectConnector();if(r.chainNamespace===G.CHAIN.EVM)try{await o.provider?.request({method:"wallet_switchEthereumChain",params:[{chainId:oe(r.id)}]})}catch(n){if(n.code===ki.ERROR_CODE_UNRECOGNIZED_CHAIN_ID||n.code===ki.ERROR_INVALID_CHAIN_ID||n.code===ki.ERROR_CODE_DEFAULT||n?.data?.originalError?.code===ki.ERROR_CODE_UNRECOGNIZED_CHAIN_ID)try{await o.provider?.request({method:"wallet_addEthereumChain",params:[{chainId:oe(r.id),rpcUrls:[r?.rpcUrls.chainDefault?.http],chainName:r.name,nativeCurrency:r.nativeCurrency,blockExplorerUrls:[r.blockExplorers?.default.url]}]})}catch{throw new Error("Chain is not supported")}}o.provider.setDefaultChain(r.caipNetworkId)}getWalletConnectProvider(){return this.connectors.find(t=>t.type==="WALLET_CONNECT")?.provider}},yl=class{constructor(t){this.chainNamespaces=[],this.reportedAlertErrors={},this.getCaipNetwork=(r,o)=>{if(r){let n=g.getNetworkData(r)?.requestedCaipNetworks?.find(s=>s.id===o);return n||g.getNetworkData(r)?.caipNetwork||g.getRequestedCaipNetworks(r).filter(s=>s.chainNamespace===r)?.[0]}return g.state.activeCaipNetwork||this.defaultCaipNetwork},this.getCaipNetworkId=()=>{let r=this.getCaipNetwork();if(r)return r.id},this.getCaipNetworks=r=>g.getCaipNetworks(r),this.getActiveChainNamespace=()=>g.state.activeChain,this.setRequestedCaipNetworks=(r,o)=>{g.setRequestedCaipNetworks(r,o)},this.getApprovedCaipNetworkIds=()=>g.getAllApprovedCaipNetworkIds(),this.getCaipAddress=r=>g.state.activeChain===r||!r?g.state.activeCaipAddress:g.getAccountProp("caipAddress",r),this.setClientId=r=>{re.setClientId(r)},this.getProvider=r=>Ae.getProvider(r),this.getProviderType=r=>Ae.getProviderId(r),this.getPreferredAccountType=r=>J.state.preferredAccountTypes?.[r],this.setCaipAddress=(r,o)=>{J.setCaipAddress(r,o)},this.setBalance=(r,o,n)=>{J.setBalance(r,o,n)},this.setProfileName=(r,o)=>{J.setProfileName(r,o)},this.setProfileImage=(r,o)=>{J.setProfileImage(r,o)},this.setUser=(r,o)=>{J.setUser(r,o),O.state.enableEmbedded&&de.close()},this.resetAccount=r=>{J.resetAccount(r)},this.setCaipNetwork=r=>{g.setActiveCaipNetwork(r)},this.setCaipNetworkOfNamespace=(r,o)=>{g.setChainNetworkData(o,{caipNetwork:r})},this.setAllAccounts=(r,o)=>{J.setAllAccounts(r,o),O.setHasMultipleAddresses(r?.length>1)},this.setStatus=(r,o)=>{J.setStatus(r,o),H.isConnected()?q.setConnectionStatus("connected"):q.setConnectionStatus("disconnected")},this.getAddressByChainNamespace=r=>g.getAccountProp("address",r),this.setConnectors=r=>{let o=[...H.state.allConnectors,...r];H.setConnectors(o)},this.fetchIdentity=r=>re.fetchIdentity(r),this.getReownName=r=>Bu.getNamesForAddress(r),this.getConnectors=()=>H.getConnectors(),this.getConnectorImage=r=>$e.getConnectorImage(r),this.setConnectedWalletInfo=(r,o)=>{let n=Ae.getProviderId(o),i=r?{...r,type:n}:void 0;J.setConnectedWalletInfo(i,o)},this.getIsConnectedState=()=>!!g.state.activeCaipAddress,this.addAddressLabel=(r,o,n)=>{J.addAddressLabel(r,o,n)},this.removeAddressLabel=(r,o)=>{J.removeAddressLabel(r,o)},this.getAddress=r=>g.state.activeChain===r||!r?J.state.address:g.getAccountProp("address",r),this.setApprovedCaipNetworksData=r=>g.setApprovedCaipNetworksData(r),this.resetNetwork=r=>{g.resetNetwork(r)},this.addConnector=r=>{H.addConnector(r)},this.resetWcConnection=()=>{Y.resetWcConnection()},this.setAddressExplorerUrl=(r,o)=>{J.setAddressExplorerUrl(r,o)},this.setSmartAccountDeployed=(r,o)=>{J.setSmartAccountDeployed(r,o)},this.setSmartAccountEnabledNetworks=(r,o)=>{g.setSmartAccountEnabledNetworks(r,o)},this.setPreferredAccountType=(r,o)=>{J.setPreferredAccountType(r,o)},this.setEIP6963Enabled=r=>{O.setEIP6963Enabled(r)},this.handleUnsafeRPCRequest=()=>{if(this.isOpen()){if(this.isTransactionStackEmpty())return;this.redirect("ApproveTransaction")}else this.open({view:"ApproveTransaction"})},this.options=t,this.version=t.sdkVersion,this.caipNetworks=this.extendCaipNetworks(t),this.chainNamespaces=this.getChainNamespacesSet(t.adapters,this.caipNetworks),this.defaultCaipNetwork=this.extendDefaultCaipNetwork(t),this.chainAdapters=this.createAdapters(t.adapters),this.initialize(t)}getChainNamespacesSet(t,r){let o=t?.map(i=>i.namespace).filter(i=>!!i);if(o?.length)return[...new Set(o)];let n=r?.map(i=>i.chainNamespace);return[...new Set(n)]}async initialize(t){this.initControllers(t),await this.initChainAdapters(),await this.injectModalUi(),this.sendInitializeEvent(t),Qt.set({initialized:!0}),await this.syncExistingConnection()}sendInitializeEvent(t){let{...r}=t;delete r.adapters,delete r.universalProvider,ce.sendEvent({type:"track",event:"INITIALIZE",properties:{...r,networks:t.networks.map(o=>o.id),siweConfig:{options:t.siweConfig?.options||{}}}})}initControllers(t){this.initializeOptionsController(t),this.initializeChainController(t),this.initializeThemeController(t),this.initializeConnectionController(t),this.initializeConnectorController()}initializeThemeController(t){t.themeMode&&Pe.setThemeMode(t.themeMode),t.themeVariables&&Pe.setThemeVariables(t.themeVariables)}initializeChainController(t){if(!this.connectionControllerClient||!this.networkControllerClient)throw new Error("ConnectionControllerClient and NetworkControllerClient must be set");g.initialize(t.adapters??[],this.caipNetworks,{connectionControllerClient:this.connectionControllerClient,networkControllerClient:this.networkControllerClient});let r=this.getDefaultNetwork();r&&g.setActiveCaipNetwork(r)}initializeConnectionController(t){Y.setWcBasic(t.basic??!1)}initializeConnectorController(){H.initialize(this.chainNamespaces)}initializeOptionsController(t){O.setDebug(t.debug!==!1),O.setEnableWalletConnect(t.enableWalletConnect!==!1),O.setEnableWalletGuide(t.enableWalletGuide!==!1),O.setEnableWallets(t.enableWallets!==!1),O.setEIP6963Enabled(t.enableEIP6963!==!1),O.setEnableNetworkSwitch(t.enableNetworkSwitch!==!1),O.setEnableAuthLogger(t.enableAuthLogger!==!1),O.setCustomRpcUrls(t.customRpcUrls),O.setSdkVersion(t.sdkVersion),O.setProjectId(t.projectId),O.setEnableEmbedded(t.enableEmbedded),O.setAllWallets(t.allWallets),O.setIncludeWalletIds(t.includeWalletIds),O.setExcludeWalletIds(t.excludeWalletIds),O.setFeaturedWalletIds(t.featuredWalletIds),O.setTokens(t.tokens),O.setTermsConditionsUrl(t.termsConditionsUrl),O.setPrivacyPolicyUrl(t.privacyPolicyUrl),O.setCustomWallets(t.customWallets),O.setFeatures(t.features),O.setAllowUnsupportedChain(t.allowUnsupportedChain),O.setUniversalProviderConfigOverride(t.universalProviderConfigOverride),O.setDefaultAccountTypes(t.defaultAccountTypes);let r=q.getPreferredAccountTypes(),o={...O.state.defaultAccountTypes,...r};J.setPreferredAccountTypes(o);let n=this.getDefaultMetaData();if(!t.metadata&&n&&(t.metadata=n),O.setMetadata(t.metadata),O.setDisableAppend(t.disableAppend),O.setEnableEmbedded(t.enableEmbedded),O.setSIWX(t.siwx),!t.projectId){wr.open(xi.ALERT_ERRORS.PROJECT_ID_NOT_CONFIGURED,"error");return}if(t.adapters?.find(i=>i.namespace===G.CHAIN.EVM)&&t.siweConfig){if(t.siwx)throw new Error("Cannot set both `siweConfig` and `siwx` options");O.setSIWX(t.siweConfig.mapToSIWX())}}getDefaultMetaData(){return typeof window<"u"&&typeof document<"u"?{name:document.getElementsByTagName("title")?.[0]?.textContent||"",description:document.querySelector('meta[property="og:description"]')?.content||"",url:window.location.origin,icons:[document.querySelector('link[rel~="icon"]')?.href||""]}:null}setUnsupportedNetwork(t){let r=this.getActiveChainNamespace();if(r){let o=mo.getUnsupportedNetwork(`${r}:${t}`);g.setActiveCaipNetwork(o)}}getDefaultNetwork(){return mo.getCaipNetworkFromStorage(this.defaultCaipNetwork)}extendCaipNetwork(t,r){return mo.extendCaipNetwork(t,{customNetworkImageUrls:r.chainImages,projectId:r.projectId})}extendCaipNetworks(t){return mo.extendCaipNetworks(t.networks,{customNetworkImageUrls:t.chainImages,customRpcUrls:t.customRpcUrls,projectId:t.projectId})}extendDefaultCaipNetwork(t){let r=t.networks.find(o=>o.id===t.defaultNetwork?.id);return r?mo.extendCaipNetwork(r,{customNetworkImageUrls:t.chainImages,customRpcUrls:t.customRpcUrls,projectId:t.projectId}):void 0}createClients(){this.connectionControllerClient={connectWalletConnect:async()=>{let t=g.state.activeChain,r=this.getAdapter(t),o=this.getCaipNetwork(t)?.id;if(!r)throw new Error("Adapter not found");let n=await r.connectWalletConnect(o);this.close(),this.setClientId(n?.clientId||null),q.setConnectedNamespaces([...g.state.chains.keys()]),this.chainNamespaces.forEach(i=>{H.setConnectorId(Te.CONNECTOR_TYPE_WALLET_CONNECT,i)}),await this.syncWalletConnectAccount()},connectExternal:async({id:t,info:r,type:o,provider:n,chain:i,caipNetwork:s})=>{let a=g.state.activeChain,c=i||a,l=this.getAdapter(c);if(i&&i!==a&&!s){let p=this.getCaipNetworks().find(w=>w.chainNamespace===i);p&&this.setCaipNetwork(p)}if(!l)throw new Error("Adapter not found");let d=this.getCaipNetwork(c),u=await l.connect({id:t,info:r,type:o,provider:n,chainId:s?.id||d?.id,rpcUrl:s?.rpcUrls?.default?.http?.[0]||d?.rpcUrls?.default?.http?.[0]});if(!u)return;q.addConnectedNamespace(c),this.syncProvider({...u,chainNamespace:c});let{accounts:h}=await l.getAccounts({namespace:c,id:t});this.setAllAccounts(h,c),this.setStatus("connected",c)},reconnectExternal:async({id:t,info:r,type:o,provider:n})=>{let i=g.state.activeChain,s=this.getAdapter(i);s?.reconnect&&(await s?.reconnect({id:t,info:r,type:o,provider:n,chainId:this.getCaipNetwork()?.id}),q.addConnectedNamespace(i))},disconnect:async t=>{let r=t||g.state.activeChain,o=this.getAdapter(r),n=Ae.getProvider(r),i=Ae.getProviderId(r);await o?.disconnect({provider:n,providerType:i}),q.removeConnectedNamespace(r),Ae.resetChain(r),this.setUser(void 0,r),this.setStatus("disconnected",r)},checkInstalled:t=>t?t.some(r=>!!window.ethereum?.[String(r)]):!!window.ethereum,signMessage:async t=>(await this.getAdapter(g.state.activeChain)?.signMessage({message:t,address:J.state.address,provider:Ae.getProvider(g.state.activeChain)}))?.signature||"",sendTransaction:async t=>{if(t.chainNamespace===G.CHAIN.EVM){let r=this.getAdapter(g.state.activeChain),o=Ae.getProvider(g.state.activeChain);return(await r?.sendTransaction({...t,caipNetwork:this.getCaipNetwork(),provider:o}))?.hash||""}return""},estimateGas:async t=>{if(t.chainNamespace===G.CHAIN.EVM){let r=this.getAdapter(g.state.activeChain),o=Ae.getProvider(g.state.activeChain),n=this.getCaipNetwork();if(!n)throw new Error("CaipNetwork is undefined");return(await r?.estimateGas({...t,provider:o,caipNetwork:n}))?.gas||0n}return 0n},getEnsAvatar:async()=>(await this.getAdapter(g.state.activeChain)?.getProfile({address:J.state.address,chainId:Number(this.getCaipNetwork()?.id)}))?.profileImage||!1,getEnsAddress:async t=>{let r=this.getAdapter(g.state.activeChain),o=this.getCaipNetwork();return o&&(await r?.getEnsAddress({name:t,caipNetwork:o}))?.address||!1},writeContract:async t=>{let r=this.getAdapter(g.state.activeChain),o=this.getCaipNetwork(),n=this.getCaipAddress(),i=Ae.getProvider(g.state.activeChain);if(!o||!n)throw new Error("CaipNetwork or CaipAddress is undefined");return(await r?.writeContract({...t,caipNetwork:o,provider:i,caipAddress:n}))?.hash},parseUnits:(t,r)=>this.getAdapter(g.state.activeChain)?.parseUnits({value:t,decimals:r})??0n,formatUnits:(t,r)=>this.getAdapter(g.state.activeChain)?.formatUnits({value:t,decimals:r})??"0",getCapabilities:async t=>await this.getAdapter(g.state.activeChain)?.getCapabilities(t),grantPermissions:async t=>await this.getAdapter(g.state.activeChain)?.grantPermissions(t),revokePermissions:async t=>{let r=this.getAdapter(g.state.activeChain);return r?.revokePermissions?await r.revokePermissions(t):"0x"},walletGetAssets:async t=>await this.getAdapter(g.state.activeChain)?.walletGetAssets(t)??{}},this.networkControllerClient={switchCaipNetwork:async t=>await this.switchCaipNetwork(t),getApprovedCaipNetworksData:async()=>this.getApprovedCaipNetworksData()},Y.setClient(this.connectionControllerClient)}getApprovedCaipNetworksData(){if(Ae.getProviderId(g.state.activeChain)===Te.CONNECTOR_TYPE_WALLET_CONNECT){let t=this.universalProvider?.session?.namespaces;return{supportsAllNetworks:this.universalProvider?.session?.peer?.metadata.name==="MetaMask Wallet",approvedCaipNetworkIds:this.getChainsFromNamespaces(t)}}return{supportsAllNetworks:!0,approvedCaipNetworkIds:[]}}async switchCaipNetwork(t){if(!t)return;let r=t.chainNamespace;if(this.getAddressByChainNamespace(t.chainNamespace)){let o=Ae.getProvider(r),n=Ae.getProviderId(r);if(t.chainNamespace===g.state.activeChain)await this.getAdapter(r)?.switchNetwork({caipNetwork:t,provider:o,providerType:n});else if(this.setCaipNetwork(t),n===Te.CONNECTOR_TYPE_WALLET_CONNECT)this.syncWalletConnectAccount();else{let i=this.getAddressByChainNamespace(r);i&&this.syncAccount({address:i,chainId:t.id,chainNamespace:r})}}else this.setCaipNetwork(t)}getChainsFromNamespaces(t={}){return Object.values(t).flatMap(r=>{let o=r.chains||[],n=r.accounts.map(i=>{let{chainId:s,chainNamespace:a}=nr.parseCaipAddress(i);return`${a}:${s}`});return Array.from(new Set([...o,...n]))})}createAdapters(t){return this.createClients(),this.chainNamespaces.reduce((r,o)=>{let n=t?.find(i=>i.namespace===o);return n?(n.construct({namespace:o,projectId:this.options?.projectId,networks:this.getCaipNetworks()}),r[o]=n):r[o]=new bl({namespace:o,networks:this.getCaipNetworks()}),r},{})}async initChainAdapter(t){this.onConnectors(t),this.listenAdapter(t),this.chainAdapters?.[t].syncConnectors(this.options,this),await this.createUniversalProviderForAdapter(t)}async initChainAdapters(){await Promise.all(this.chainNamespaces.map(async t=>{await this.initChainAdapter(t)}))}onConnectors(t){this.getAdapter(t)?.on("connectors",this.setConnectors.bind(this))}listenAdapter(t){let r=this.getAdapter(t);if(!r)return;let o=q.getConnectionStatus();o==="connected"?this.setStatus("connecting",t):o==="disconnected"?(q.clearAddressCache(),this.setStatus(o,t)):this.setStatus(o,t),r.on("switchNetwork",({address:n,chainId:i})=>{let s=this.getCaipNetworks().find(l=>l.id===i||l.caipNetworkId===i),a=g.state.activeChain===t,c=g.getAccountProp("address",t);if(s){let l=a&&n?n:c;l&&this.syncAccount({address:l,chainId:s.id,chainNamespace:t})}else this.setUnsupportedNetwork(i)}),r.on("disconnect",this.disconnect.bind(this,t)),r.on("pendingTransactions",()=>{let n=J.state.address,i=g.state.activeCaipNetwork;!n||!i?.id||this.updateNativeBalance(n,i.id,i.chainNamespace)}),r.on("accountChanged",({address:n,chainId:i})=>{let s=g.state.activeChain===t;s&&i?this.syncAccount({address:n,chainId:i,chainNamespace:t}):s&&g.state.activeCaipNetwork?.id?this.syncAccount({address:n,chainId:g.state.activeCaipNetwork?.id,chainNamespace:t}):this.syncAccountInfo(n,i,t)})}async createUniversalProviderForAdapter(t){await this.getUniversalProvider(),this.universalProvider&&this.chainAdapters?.[t]?.setUniversalProvider?.(this.universalProvider)}async syncExistingConnection(){await Promise.allSettled(this.chainNamespaces.map(t=>this.syncNamespaceConnection(t)))}async syncNamespaceConnection(t){try{let r=H.getConnectorId(t);switch(this.setStatus("connecting",t),r){case G.CONNECTOR_ID.WALLET_CONNECT:await this.syncWalletConnectAccount();break;case G.CONNECTOR_ID.AUTH:break;default:await this.syncAdapterConnection(t)}}catch(r){console.warn("AppKit couldn't sync existing connection",r),this.setStatus("disconnected",t)}}async syncAdapterConnection(t){let r=this.getAdapter(t),o=H.getConnectorId(t),n=this.getCaipNetwork(t),i=H.getConnectors(t).find(s=>s.id===o);try{if(!r||!i)throw new Error(`Adapter or connector not found for namespace ${t}`);if(!n?.id)throw new Error("CaipNetwork not found");let s=await r?.syncConnection({namespace:t,id:i.id,chainId:n.id,rpcUrl:n?.rpcUrls?.default?.http?.[0]});if(s){let a=await r?.getAccounts({namespace:t,id:i.id});a&&a.accounts.length>0?this.setAllAccounts(a.accounts,t):this.setAllAccounts([M.createAccount(t,s.address,"eoa")],t),this.syncProvider({...s,chainNamespace:t}),await this.syncAccount({...s,chainNamespace:t}),this.setStatus("connected",t)}else this.setStatus("disconnected",t)}catch{this.setStatus("disconnected",t)}}async syncWalletConnectAccount(){let t=this.chainNamespaces.map(async r=>{let o=this.getAdapter(r),n=this.universalProvider?.session?.namespaces?.[r]?.accounts||[],i=g.state.activeCaipNetwork?.id,s=n.find(a=>{let{chainId:c}=nr.parseCaipAddress(a);return c===i?.toString()})||n[0];if(s){let a=nr.validateCaipAddress(s),{chainId:c,address:l}=nr.parseCaipAddress(a);if(Ae.setProviderId(r,Te.CONNECTOR_TYPE_WALLET_CONNECT),this.caipNetworks&&g.state.activeCaipNetwork&&o?.namespace!==G.CHAIN.EVM){let d=o?.getWalletConnectProvider({caipNetworks:this.getCaipNetworks(),provider:this.universalProvider,activeCaipNetwork:g.state.activeCaipNetwork});Ae.setProvider(r,d)}else Ae.setProvider(r,this.universalProvider);H.setConnectorId(G.CONNECTOR_ID.WALLET_CONNECT,r),q.addConnectedNamespace(r),this.syncWalletConnectAccounts(r),await this.syncAccount({address:l,chainId:c,chainNamespace:r})}else this.setStatus("disconnected",r);await g.setApprovedCaipNetworksData(r)});await Promise.all(t)}syncWalletConnectAccounts(t){let r=this.universalProvider?.session?.namespaces?.[t]?.accounts?.map(o=>{let{address:n}=nr.parseCaipAddress(o);return n}).filter((o,n,i)=>i.indexOf(o)===n);r&&this.setAllAccounts(r.map(o=>M.createAccount(t,o,t==="bip122"?"payment":"eoa")),t)}syncProvider({type:t,provider:r,id:o,chainNamespace:n}){Ae.setProviderId(n,t),Ae.setProvider(n,r),H.setConnectorId(o,n)}async syncAccount(t){let r=t.chainNamespace===g.state.activeChain,o=g.getCaipNetworkByNamespace(t.chainNamespace,t.chainId),{address:n,chainId:i,chainNamespace:s}=t,{chainId:a}=q.getActiveNetworkProps(),c=i||a,l=g.state.activeCaipNetwork?.name===G.UNSUPPORTED_NETWORK_NAME,d=g.getNetworkProp("supportsAllNetworks",s);if(this.setStatus("connected",s),!(l&&!d)&&c){let u=this.getCaipNetworks().find(w=>w.id.toString()===c.toString()),h=this.getCaipNetworks().find(w=>w.chainNamespace===s);if(!d&&!u&&!h){let w=this.getApprovedCaipNetworkIds()||[],b=w.find(m=>nr.parseCaipNetworkId(m)?.chainId===c.toString()),v=w.find(m=>nr.parseCaipNetworkId(m)?.chainNamespace===s);u=this.getCaipNetworks().find(m=>m.caipNetworkId===b),h=this.getCaipNetworks().find(m=>m.caipNetworkId===v||"deprecatedCaipNetworkId"in m&&m.deprecatedCaipNetworkId===v)}let p=u||h;p?.chainNamespace===g.state.activeChain?O.state.enableNetworkSwitch&&!O.state.allowUnsupportedChain&&g.state.activeCaipNetwork?.name===G.UNSUPPORTED_NETWORK_NAME?g.showUnsupportedChainUI():this.setCaipNetwork(p):r||o&&this.setCaipNetworkOfNamespace(o,s),this.syncConnectedWalletInfo(s),Hl.isLowerCaseMatch(n,J.state.address)||this.syncAccountInfo(n,p?.id,s),r?await this.syncBalance({address:n,chainId:p?.id,chainNamespace:s}):await this.syncBalance({address:n,chainId:o?.id,chainNamespace:s})}}async syncAccountInfo(t,r,o){let n=this.getCaipAddress(o),i=r||n?.split(":")[1];if(!i)return;let s=`${o}:${i}:${t}`;this.setCaipAddress(s,o),await this.syncIdentity({address:t,chainId:i,chainNamespace:o})}async syncReownName(t,r){try{let o=await this.getReownName(t);if(o[0]){let n=o[0];this.setProfileName(n.name,r)}else this.setProfileName(null,r)}catch{this.setProfileName(null,r)}}syncConnectedWalletInfo(t){let r=H.getConnectorId(t),o=Ae.getProviderId(t);if(o===Te.CONNECTOR_TYPE_ANNOUNCED||o===Te.CONNECTOR_TYPE_INJECTED){if(r){let n=this.getConnectors().find(i=>i.id===r);if(n){let{info:i,name:s,imageUrl:a}=n,c=a||this.getConnectorImage(n);this.setConnectedWalletInfo({name:s,icon:c,...i},t)}}}else if(o===Te.CONNECTOR_TYPE_WALLET_CONNECT){let n=Ae.getProvider(t);n?.session&&this.setConnectedWalletInfo({...n.session.peer.metadata,name:n.session.peer.metadata.name,icon:n.session.peer.metadata.icons?.[0]},t)}else if(r)if(r===G.CONNECTOR_ID.COINBASE){let n=this.getConnectors().find(i=>i.id===G.CONNECTOR_ID.COINBASE);this.setConnectedWalletInfo({name:"Coinbase Wallet",icon:this.getConnectorImage(n)},t)}else this.setConnectedWalletInfo({name:r},t)}async syncBalance(t){!j0.getNetworksByNamespace(this.getCaipNetworks(),t.chainNamespace).find(r=>r.id.toString()===t.chainId?.toString())||!t.chainId||await this.updateNativeBalance(t.address,t.chainId,t.chainNamespace)}async updateNativeBalance(t,r,o){let n=this.getAdapter(o),i=g.getCaipNetworkByNamespace(o,r);if(n){let s=await n.getBalance({address:t,chainId:r,caipNetwork:i,tokens:this.options.tokens});this.setBalance(s.balance,s.symbol,o)}}async initializeUniversalAdapter(){let t=yf.createLogger((o,...n)=>{o&&this.handleAlertError(o),console.error(...n)}),r={projectId:this.options?.projectId,metadata:{name:this.options?.metadata?this.options?.metadata.name:"",description:this.options?.metadata?this.options?.metadata.description:"",url:this.options?.metadata?this.options?.metadata.url:"",icons:this.options?.metadata?this.options?.metadata.icons:[""]},logger:t};O.setManualWCControl(!!this.options?.manualWCControl),this.universalProvider=this.options.universalProvider??await od.init(r),this.listenWalletConnect()}listenWalletConnect(){this.universalProvider&&(this.universalProvider.on("display_uri",t=>{Y.setUri(t)}),this.universalProvider.on("connect",Y.finalizeWcConnection),this.universalProvider.on("disconnect",()=>{this.chainNamespaces.forEach(t=>{this.resetAccount(t)}),Y.resetWcConnection()}),this.universalProvider.on("chainChanged",t=>{let r=this.getCaipNetworks().find(n=>n.id==t),o=this.getCaipNetwork();if(!r){this.setUnsupportedNetwork(t);return}o?.id!==r?.id&&this.setCaipNetwork(r)}),this.universalProvider.on("session_event",t=>{if(Ku.isSessionEventData(t)){let{name:r,data:o}=t.params.event;r==="accountsChanged"&&Array.isArray(o)&&M.isCaipAddress(o[0])&&this.syncAccount(nr.parseCaipAddress(o[0]))}}))}createUniversalProvider(){return!this.universalProviderInitPromise&&M.isClient()&&this.options?.projectId&&(this.universalProviderInitPromise=this.initializeUniversalAdapter()),this.universalProviderInitPromise}async getUniversalProvider(){if(!this.universalProvider)try{await this.createUniversalProvider()}catch(t){ce.sendEvent({type:"error",event:"INTERNAL_SDK_ERROR",properties:{errorType:"UniversalProviderInitError",errorMessage:t instanceof Error?t.message:"Unknown",uncaught:!1}}),console.error("AppKit:getUniversalProvider - Cannot create provider",t)}return this.universalProvider}handleAlertError(t){let r=Object.entries(xi.UniversalProviderErrors).find(([,{message:a}])=>t.message.includes(a)),[o,n]=r??[],{message:i,alertErrorKey:s}=n??{};if(o&&i&&!this.reportedAlertErrors[o]){let a=xi.ALERT_ERRORS[s];a&&(wr.open(a,"error"),this.reportedAlertErrors[o]=!0)}}getAdapter(t){if(t)return this.chainAdapters?.[t]}createAdapter(t){if(!t)return;let r=t.namespace;if(!r)return;this.createClients();let o=t;o.namespace=r,o.construct({namespace:r,projectId:this.options?.projectId,networks:this.getCaipNetworks()}),this.chainNamespaces.includes(r)||this.chainNamespaces.push(r),this.chainAdapters&&(this.chainAdapters[r]=o)}async open(t){if(await this.injectModalUi(),t?.uri&&Y.setUri(t.uri),t?.arguments)switch(t?.view){case"Swap":return de.open({...t,data:{swap:t.arguments}})}return de.open(t)}async close(){await this.injectModalUi(),de.close()}setLoading(t,r){de.setLoading(t,r)}async disconnect(t){await Y.disconnect(t)}getError(){return""}getChainId(){return g.state.activeCaipNetwork?.id}async switchNetwork(t){let r=this.getCaipNetworks().find(o=>o.id===t.id);if(!r){wr.open(xi.ALERT_ERRORS.SWITCH_NETWORK_NOT_FOUND,"error");return}await g.switchActiveNetwork(r)}getWalletProvider(){return g.state.activeChain?Ae.state.providers[g.state.activeChain]:null}getWalletProviderType(){return Ae.getProviderId(g.state.activeChain)}subscribeProviders(t){return Ae.subscribeProviders(t)}getThemeMode(){return Pe.state.themeMode}getThemeVariables(){return Pe.state.themeVariables}setThemeMode(t){Pe.setThemeMode(t),Fu(Pe.state.themeMode)}setTermsConditionsUrl(t){O.setTermsConditionsUrl(t)}setPrivacyPolicyUrl(t){O.setPrivacyPolicyUrl(t)}setThemeVariables(t){Pe.setThemeVariables(t),Uf(Pe.state.themeVariables)}subscribeTheme(t){return Pe.subscribe(t)}getWalletInfo(){return J.state.connectedWalletInfo}getAccount(t){let r=H.getAuthConnector(t),o=g.getAccountData(t),n=g.state.activeChain;if(o)return{allAccounts:o.allAccounts,caipAddress:o.caipAddress,address:M.getPlainAddress(o.caipAddress),isConnected:!!o.caipAddress,status:o.status,embeddedWalletInfo:r?{user:o.user?{...o.user,username:q.getConnectedSocialUsername()}:void 0,authProvider:o.socialProvider||"email",accountType:o.preferredAccountTypes?.[t||n],isSmartAccountDeployed:!!o.smartAccountDeployed}:void 0}}subscribeAccount(t,r){let o=()=>{let n=this.getAccount(r);n&&t(n)};r?g.subscribeChainProp("accountState",o,r):g.subscribe(o),H.subscribe(o)}subscribeNetwork(t){return g.subscribe(({activeCaipNetwork:r})=>{t({caipNetwork:r,chainId:r?.id,caipNetworkId:r?.caipNetworkId})})}subscribeWalletInfo(t){return J.subscribeKey("connectedWalletInfo",t)}subscribeShouldUpdateToAddress(t){J.subscribeKey("shouldUpdateToAddress",t)}subscribeCaipNetworkChange(t){g.subscribeKey("activeCaipNetwork",t)}getState(){return Qt.state}subscribeState(t){return Qt.subscribe(t)}showErrorMessage(t){Ce.showError(t)}showSuccessMessage(t){Ce.showSuccess(t)}getEvent(){return{...ce.state}}subscribeEvents(t){return ce.subscribe(t)}replace(t){D.replace(t)}redirect(t){D.push(t)}popTransactionStack(t){D.popTransactionStack(t)}isOpen(){return de.state.open}isTransactionStackEmpty(){return D.state.transactionStack.length===0}isTransactionShouldReplaceView(){return D.state.transactionStack[D.state.transactionStack.length-1]?.replace}static getInstance(){return this.instance}updateFeatures(t){O.setFeatures(t)}updateOptions(t){let r={...O.state||{},...t};O.setOptions(r)}setConnectMethodsOrder(t){O.setConnectMethodsOrder(t)}setWalletFeaturesOrder(t){O.setWalletFeaturesOrder(t)}setCollapseWallets(t){O.setCollapseWallets(t)}setSocialsOrder(t){O.setSocialsOrder(t)}getConnectMethodsOrder(){return ro.getConnectOrderMethod(O.state.features,H.getConnectors())}addNetwork(t,r){if(this.chainAdapters&&!this.chainAdapters[t])throw new Error(`Adapter for namespace ${t} doesn't exist`);let o=this.extendCaipNetwork(r,this.options);this.getCaipNetworks().find(n=>n.id===o.id)||g.addNetwork(o)}removeNetwork(t,r){if(this.chainAdapters&&!this.chainAdapters[t])throw new Error(`Adapter for namespace ${t} doesn't exist`);this.getCaipNetworks().find(o=>o.id===r)&&g.removeNetwork(t,r)}},o0=!1,Us=class extends yl{async open(t){H.isConnected()||await super.open(t)}async close(){await super.close(),this.options.manualWCControl&&Y.finalizeWcConnection()}async syncIdentity(t){return Promise.resolve()}async syncBalance(t){return Promise.resolve()}async injectModalUi(){if(!o0&&M.isClient()){if(await Promise.resolve().then(function(){return fm}),await Promise.resolve().then(function(){return Tm}),!document.querySelector("w3m-modal")){let t=document.createElement("w3m-modal");!O.state.disableAppend&&!O.state.enableEmbedded&&document.body.insertAdjacentElement("beforeend",t)}o0=!0}}},lw="1.7.3";function dw(e){return new Us({...e,basic:!0,sdkVersion:`html-core-${lw}`})}var uw=Object.freeze({__proto__:null,createAppKit:dw,AppKit:Us}),hw=Object.defineProperty,pw=Object.defineProperties,gw=Object.getOwnPropertyDescriptors,n0=Object.getOwnPropertySymbols,fw=Object.prototype.hasOwnProperty,ww=Object.prototype.propertyIsEnumerable,i0=(e,t,r)=>t in e?hw(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,mw=(e,t)=>{for(var r in t||(t={}))fw.call(t,r)&&i0(e,r,t[r]);if(n0)for(var r of n0(t))ww.call(t,r)&&i0(e,r,t[r]);return e},vw=(e,t)=>pw(e,gw(t));function bw(e){if(e)return{"--w3m-font-family":e["--wcm-font-family"],"--w3m-accent":e["--wcm-accent-color"],"--w3m-color-mix":e["--wcm-background-color"],"--w3m-z-index":e["--wcm-z-index"]?Number(e["--wcm-z-index"]):void 0,"--w3m-qr-color":e["--wcm-accent-color"],"--w3m-font-size-master":e["--wcm-text-medium-regular-size"],"--w3m-border-radius-master":e["--wcm-container-border-radius"],"--w3m-color-mix-strength":0}}var yw=e=>{let[t,r]=e.split(":");return ko({id:r,caipNetworkId:e,chainNamespace:t,name:"",nativeCurrency:{name:"",symbol:"",decimals:8},rpcUrls:{default:{http:["https://rpc.walletconnect.org/v1"]}}})};function Cw(e){var t,r,o,n,i,s,a;let c=(t=e.chains)==null?void 0:t.map(yw).filter(Boolean);if(c.length===0)throw new Error("At least one chain must be specified");let l=c.find(u=>{var h;return u.id===((h=e.defaultChain)==null?void 0:h.id)}),d={projectId:e.projectId,networks:c,themeMode:e.themeMode,themeVariables:bw(e.themeVariables),chainImages:e.chainImages,connectorImages:e.walletImages,defaultNetwork:l,metadata:vw(mw({},e.metadata),{name:((r=e.metadata)==null?void 0:r.name)||"WalletConnect",description:((o=e.metadata)==null?void 0:o.description)||"Connect to WalletConnect-compatible wallets",url:((n=e.metadata)==null?void 0:n.url)||"https://walletconnect.org",icons:((i=e.metadata)==null?void 0:i.icons)||["https://walletconnect.org/walletconnect-logo.png"]}),showWallets:!0,featuredWalletIds:e.explorerRecommendedWalletIds==="NONE"?[]:Array.isArray(e.explorerRecommendedWalletIds)?e.explorerRecommendedWalletIds:[],excludeWalletIds:e.explorerExcludedWalletIds==="ALL"?[]:Array.isArray(e.explorerExcludedWalletIds)?e.explorerExcludedWalletIds:[],enableEIP6963:!1,enableInjected:!1,enableCoinbase:!0,enableWalletConnect:!0,features:{email:!1,socials:!1}};if((s=e.mobileWallets)!=null&&s.length||(a=e.desktopWallets)!=null&&a.length){let u=[...(e.mobileWallets||[]).map(w=>({id:w.id,name:w.name,links:w.links})),...(e.desktopWallets||[]).map(w=>({id:w.id,name:w.name,links:{native:w.links.native,universal:w.links.universal}}))],h=[...d.featuredWalletIds||[],...d.excludeWalletIds||[]],p=u.filter(w=>!h.includes(w.id));p.length&&(d.customWallets=p)}return d}var xw=Object.freeze({__proto__:null,convertWCMToAppKitOptions:Cw});var Ew={attribute:!0,type:String,converter:Ls,reflect:!1,hasChanged:ql},kw=(e=Ew,t,r)=>{let{kind:o,metadata:n}=r,i=globalThis.litPropertyMetadata.get(n);if(i===void 0&&globalThis.litPropertyMetadata.set(n,i=new Map),o==="setter"&&((e=Object.create(e)).wrapped=!0),i.set(r.name,e),o==="accessor"){let{name:s}=r;return{set(a){let c=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,c,e)},init(a){return a!==void 0&&this.C(s,void 0,e,a),a}}}if(o==="setter"){let{name:s}=r;return function(a){let c=this[s];t.call(this,a),this.requestUpdate(s,c,e)}}throw Error("Unsupported decorator location: "+o)};function y(e){return(t,r)=>typeof r=="object"?kw(e,t,r):((o,n,i)=>{let s=n.hasOwnProperty(i);return n.constructor.createProperty(i,o),s?Object.getOwnPropertyDescriptor(n,i):void 0})(e,t,r)}function V(e){return y({...e,state:!0,attribute:!1})}var Aw=ee`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`,ct=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Fe=class extends F{render(){return this.style.cssText=`
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&Me.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&Me.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&Me.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&Me.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&Me.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&Me.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&Me.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&Me.getSpacingStyles(this.margin,3)};
    `,f`<slot></slot>`}};Fe.styles=[pe,Aw],ct([y()],Fe.prototype,"flexDirection",void 0),ct([y()],Fe.prototype,"flexWrap",void 0),ct([y()],Fe.prototype,"flexBasis",void 0),ct([y()],Fe.prototype,"flexGrow",void 0),ct([y()],Fe.prototype,"flexShrink",void 0),ct([y()],Fe.prototype,"alignItems",void 0),ct([y()],Fe.prototype,"justifyContent",void 0),ct([y()],Fe.prototype,"columnGap",void 0),ct([y()],Fe.prototype,"rowGap",void 0),ct([y()],Fe.prototype,"gap",void 0),ct([y()],Fe.prototype,"padding",void 0),ct([y()],Fe.prototype,"margin",void 0),Fe=ct([Z("wui-flex")],Fe);var Q=e=>e??Ie;var Nw=e=>e===null||typeof e!="object"&&typeof e!="function",Iw=e=>e.strings===void 0;var Yu={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Jl=e=>(...t)=>({_$litDirective$:e,values:t}),zs=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,r,o){this._$Ct=t,this._$AM=r,this._$Ci=o}_$AS(t,r){return this.update(t,r)}update(t,r){return this.render(...r)}};var An=(e,t)=>{let r=e._$AN;if(r===void 0)return!1;for(let o of r)o._$AO?.(t,!1),An(o,t);return!0},Ds=e=>{let t,r;do{if((t=e._$AM)===void 0)break;r=t._$AN,r.delete(e),e=t}while(r?.size===0)},Ju=e=>{for(let t;t=e._$AM;e=t){let r=t._$AN;if(r===void 0)t._$AN=r=new Set;else if(r.has(e))break;r.add(e),Ow(t)}};function Sw(e){this._$AN!==void 0?(Ds(this),this._$AM=e,Ju(this)):this._$AM=e}function _w(e,t=!1,r=0){let o=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(t)if(Array.isArray(o))for(let i=r;i<o.length;i++)An(o[i],!1),Ds(o[i]);else o!=null&&(An(o,!1),Ds(o));else An(this,e)}var Ow=e=>{e.type==Yu.CHILD&&(e._$AP??=_w,e._$AQ??=Sw)},js=class extends zs{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,r,o){super._$AT(t,r,o),Ju(this),this.isConnected=t._$AU}_$AO(t,r=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),r&&(An(this,t),Ds(this))}setValue(t){if(Iw(this._$Ct))this._$Ct._$AI(t,this);else{let r=[...this._$Ct._$AH];r[this._$Ci]=t,this._$Ct._$AI(r,this,0)}}disconnected(){}reconnected(){}};var Cl=class{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}},xl=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(t=>this.Z=t)}resume(){this.Z?.(),this.Y=this.Z=void 0}};var s0=e=>!Nw(e)&&typeof e.then=="function",a0=1073741823,El=class extends js{constructor(){super(...arguments),this._$Cwt=a0,this._$Cbt=[],this._$CK=new Cl(this),this._$CX=new xl}render(...t){return t.find(r=>!s0(r))??rr}update(t,r){let o=this._$Cbt,n=o.length;this._$Cbt=r;let i=this._$CK,s=this._$CX;this.isConnected||this.disconnected();for(let a=0;a<r.length&&!(a>this._$Cwt);a++){let c=r[a];if(!s0(c))return this._$Cwt=a,c;a<n&&c===o[a]||(this._$Cwt=a0,n=0,Promise.resolve(c).then(async l=>{for(;s.get();)await s.get();let d=i.deref();if(d!==void 0){let u=d._$Cbt.indexOf(c);u>-1&&u<d._$Cwt&&(d._$Cwt=u,d.setValue(l))}}))}return rr}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}},Tw=Jl(El),kl=class{constructor(){this.cache=new Map}set(t,r){this.cache.set(t,r)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},Ga=new kl,Pw=ee`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`,Ko=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},c0={add:async()=>(await Promise.resolve().then(function(){return Rm})).addSvg,allWallets:async()=>(await Promise.resolve().then(function(){return Lm})).allWalletsSvg,arrowBottomCircle:async()=>(await Promise.resolve().then(function(){return Mm})).arrowBottomCircleSvg,appStore:async()=>(await Promise.resolve().then(function(){return zm})).appStoreSvg,apple:async()=>(await Promise.resolve().then(function(){return jm})).appleSvg,arrowBottom:async()=>(await Promise.resolve().then(function(){return Hm})).arrowBottomSvg,arrowLeft:async()=>(await Promise.resolve().then(function(){return Vm})).arrowLeftSvg,arrowRight:async()=>(await Promise.resolve().then(function(){return qm})).arrowRightSvg,arrowTop:async()=>(await Promise.resolve().then(function(){return Km})).arrowTopSvg,bank:async()=>(await Promise.resolve().then(function(){return Jm})).bankSvg,browser:async()=>(await Promise.resolve().then(function(){return Qm})).browserSvg,card:async()=>(await Promise.resolve().then(function(){return t3})).cardSvg,checkmark:async()=>(await Promise.resolve().then(function(){return o3})).checkmarkSvg,checkmarkBold:async()=>(await Promise.resolve().then(function(){return i3})).checkmarkBoldSvg,chevronBottom:async()=>(await Promise.resolve().then(function(){return a3})).chevronBottomSvg,chevronLeft:async()=>(await Promise.resolve().then(function(){return l3})).chevronLeftSvg,chevronRight:async()=>(await Promise.resolve().then(function(){return u3})).chevronRightSvg,chevronTop:async()=>(await Promise.resolve().then(function(){return p3})).chevronTopSvg,chromeStore:async()=>(await Promise.resolve().then(function(){return f3})).chromeStoreSvg,clock:async()=>(await Promise.resolve().then(function(){return m3})).clockSvg,close:async()=>(await Promise.resolve().then(function(){return b3})).closeSvg,compass:async()=>(await Promise.resolve().then(function(){return C3})).compassSvg,coinPlaceholder:async()=>(await Promise.resolve().then(function(){return E3})).coinPlaceholderSvg,copy:async()=>(await Promise.resolve().then(function(){return A3})).copySvg,cursor:async()=>(await Promise.resolve().then(function(){return I3})).cursorSvg,cursorTransparent:async()=>(await Promise.resolve().then(function(){return _3})).cursorTransparentSvg,desktop:async()=>(await Promise.resolve().then(function(){return T3})).desktopSvg,disconnect:async()=>(await Promise.resolve().then(function(){return R3})).disconnectSvg,discord:async()=>(await Promise.resolve().then(function(){return L3})).discordSvg,etherscan:async()=>(await Promise.resolve().then(function(){return M3})).etherscanSvg,extension:async()=>(await Promise.resolve().then(function(){return z3})).extensionSvg,externalLink:async()=>(await Promise.resolve().then(function(){return j3})).externalLinkSvg,facebook:async()=>(await Promise.resolve().then(function(){return H3})).facebookSvg,farcaster:async()=>(await Promise.resolve().then(function(){return V3})).farcasterSvg,filters:async()=>(await Promise.resolve().then(function(){return q3})).filtersSvg,github:async()=>(await Promise.resolve().then(function(){return K3})).githubSvg,google:async()=>(await Promise.resolve().then(function(){return J3})).googleSvg,helpCircle:async()=>(await Promise.resolve().then(function(){return Q3})).helpCircleSvg,image:async()=>(await Promise.resolve().then(function(){return t5})).imageSvg,id:async()=>(await Promise.resolve().then(function(){return o5})).idSvg,infoCircle:async()=>(await Promise.resolve().then(function(){return i5})).infoCircleSvg,lightbulb:async()=>(await Promise.resolve().then(function(){return a5})).lightbulbSvg,mail:async()=>(await Promise.resolve().then(function(){return l5})).mailSvg,mobile:async()=>(await Promise.resolve().then(function(){return u5})).mobileSvg,more:async()=>(await Promise.resolve().then(function(){return p5})).moreSvg,networkPlaceholder:async()=>(await Promise.resolve().then(function(){return f5})).networkPlaceholderSvg,nftPlaceholder:async()=>(await Promise.resolve().then(function(){return m5})).nftPlaceholderSvg,off:async()=>(await Promise.resolve().then(function(){return b5})).offSvg,playStore:async()=>(await Promise.resolve().then(function(){return C5})).playStoreSvg,plus:async()=>(await Promise.resolve().then(function(){return E5})).plusSvg,qrCode:async()=>(await Promise.resolve().then(function(){return A5})).qrCodeIcon,recycleHorizontal:async()=>(await Promise.resolve().then(function(){return I5})).recycleHorizontalSvg,refresh:async()=>(await Promise.resolve().then(function(){return _5})).refreshSvg,search:async()=>(await Promise.resolve().then(function(){return T5})).searchSvg,send:async()=>(await Promise.resolve().then(function(){return R5})).sendSvg,swapHorizontal:async()=>(await Promise.resolve().then(function(){return L5})).swapHorizontalSvg,swapHorizontalMedium:async()=>(await Promise.resolve().then(function(){return M5})).swapHorizontalMediumSvg,swapHorizontalBold:async()=>(await Promise.resolve().then(function(){return z5})).swapHorizontalBoldSvg,swapHorizontalRoundedBold:async()=>(await Promise.resolve().then(function(){return j5})).swapHorizontalRoundedBoldSvg,swapVertical:async()=>(await Promise.resolve().then(function(){return H5})).swapVerticalSvg,telegram:async()=>(await Promise.resolve().then(function(){return V5})).telegramSvg,threeDots:async()=>(await Promise.resolve().then(function(){return q5})).threeDotsSvg,twitch:async()=>(await Promise.resolve().then(function(){return K5})).twitchSvg,twitter:async()=>(await Promise.resolve().then(function(){return L0})).xSvg,twitterIcon:async()=>(await Promise.resolve().then(function(){return X5})).twitterIconSvg,verify:async()=>(await Promise.resolve().then(function(){return ev})).verifySvg,verifyFilled:async()=>(await Promise.resolve().then(function(){return rv})).verifyFilledSvg,wallet:async()=>(await Promise.resolve().then(function(){return nv})).walletSvg,walletConnect:async()=>(await Promise.resolve().then(function(){return yc})).walletConnectSvg,walletConnectLightBrown:async()=>(await Promise.resolve().then(function(){return yc})).walletConnectLightBrownSvg,walletConnectBrown:async()=>(await Promise.resolve().then(function(){return yc})).walletConnectBrownSvg,walletPlaceholder:async()=>(await Promise.resolve().then(function(){return lv})).walletPlaceholderSvg,warningCircle:async()=>(await Promise.resolve().then(function(){return uv})).warningCircleSvg,x:async()=>(await Promise.resolve().then(function(){return L0})).xSvg,info:async()=>(await Promise.resolve().then(function(){return pv})).infoSvg,exclamationTriangle:async()=>(await Promise.resolve().then(function(){return fv})).exclamationTriangleSvg,reown:async()=>(await Promise.resolve().then(function(){return mv})).reownSvg};async function Rw(e){if(Ga.has(e))return Ga.get(e);let t=(c0[e]??c0.copy)();return Ga.set(e,t),t}var Nr=class extends F{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,f`${Tw(Rw(this.name),f`<div class="fallback"></div>`)}`}};Nr.styles=[pe,li,Pw],Ko([y()],Nr.prototype,"size",void 0),Ko([y()],Nr.prototype,"name",void 0),Ko([y()],Nr.prototype,"color",void 0),Ko([y()],Nr.prototype,"aspectRatio",void 0),Nr=Ko([Z("wui-icon")],Nr);var Xu=Jl(class extends zs{constructor(e){if(super(e),e.type!==Yu.ATTRIBUTE||e.name!=="class"||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(o=>o!=="")));for(let o in t)t[o]&&!this.nt?.has(o)&&this.st.add(o);return this.render(t)}let r=e.element.classList;for(let o of this.st)o in t||(r.remove(o),this.st.delete(o));for(let o in t){let n=!!t[o];n===this.st.has(o)||this.nt?.has(o)||(n?(r.add(o),this.st.add(o)):(r.remove(o),this.st.delete(o)))}return rr}}),$w=ee`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`,Yo=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Ir=class extends F{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){let e={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `,f`<slot class=${Xu(e)}></slot>`}};Ir.styles=[pe,$w],Yo([y()],Ir.prototype,"variant",void 0),Yo([y()],Ir.prototype,"color",void 0),Yo([y()],Ir.prototype,"align",void 0),Yo([y()],Ir.prototype,"lineClamp",void 0),Ir=Yo([Z("wui-text")],Ir);var Lw=ee`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`,Ft=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Et=class extends F{constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){let e=this.iconSize||this.size,t=this.size==="lg",r=this.size==="xl",o=t?"12%":"16%",n=t?"xxs":r?"s":"3xl",i=this.background==="gray",s=this.background==="opaque",a=this.backgroundColor==="accent-100"&&s||this.backgroundColor==="success-100"&&s||this.backgroundColor==="error-100"&&s||this.backgroundColor==="inverse-100"&&s,c=`var(--wui-color-${this.backgroundColor})`;return a?c=`var(--wui-icon-box-bg-${this.backgroundColor})`:i&&(c=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`
       --local-bg-value: ${c};
       --local-bg-mix: ${a||i?"100%":o};
       --local-border-radius: var(--wui-border-radius-${n});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${this.borderColor==="wui-color-bg-125"?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}
   `,f` <wui-icon color=${this.iconColor} size=${e} name=${this.icon}></wui-icon> `}};Et.styles=[pe,ze,Lw],Ft([y()],Et.prototype,"size",void 0),Ft([y()],Et.prototype,"backgroundColor",void 0),Ft([y()],Et.prototype,"iconColor",void 0),Ft([y()],Et.prototype,"iconSize",void 0),Ft([y()],Et.prototype,"background",void 0),Ft([y({type:Boolean})],Et.prototype,"border",void 0),Ft([y()],Et.prototype,"borderColor",void 0),Ft([y()],Et.prototype,"icon",void 0),Et=Ft([Z("wui-icon-box")],Et);var Bw=ee`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`,zi=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},uo=class extends F{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      `,f`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};uo.styles=[pe,li,Bw],zi([y()],uo.prototype,"src",void 0),zi([y()],uo.prototype,"alt",void 0),zi([y()],uo.prototype,"size",void 0),uo=zi([Z("wui-image")],uo);var Mw=ee`
  :host {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-size);
    height: var(--local-size);
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host([name='Extension'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  :host([data-wallet-icon='allWallets']) {
    background-color: var(--wui-all-wallets-bg-100);
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 18px;
    height: 18px;
  }

  wui-icon[data-parent-size='md'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='lg'] {
    width: 42px;
    height: 42px;
  }

  wui-icon[data-parent-size='full'] {
    width: 100%;
    height: 100%;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid var(--wui-color-bg-150, #1e1f1f);
    padding: 1px;
  }
`,Sr=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Vt=class extends F{constructor(){super(...arguments),this.size="md",this.name="",this.installed=!1,this.badgeSize="xs"}render(){let e="xxs";return this.size==="lg"?e="m":this.size==="md"?e="xs":e="xxs",this.style.cssText=`
       --local-border-radius: var(--wui-border-radius-${e});
       --local-size: var(--wui-wallet-image-size-${this.size});
   `,this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),f`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `}templateVisual(){return this.imageSrc?f`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?f`<wui-icon
        data-parent-size="md"
        size="md"
        color="inherit"
        name=${this.walletIcon}
      ></wui-icon>`:f`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};Vt.styles=[ze,pe,Mw],Sr([y()],Vt.prototype,"size",void 0),Sr([y()],Vt.prototype,"name",void 0),Sr([y()],Vt.prototype,"imageSrc",void 0),Sr([y()],Vt.prototype,"walletIcon",void 0),Sr([y({type:Boolean})],Vt.prototype,"installed",void 0),Sr([y()],Vt.prototype,"badgeSize",void 0),Vt=Sr([Z("wui-wallet-image")],Vt);var Uw=ee`
  :host {
    position: relative;
    border-radius: var(--wui-border-radius-xxs);
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--wui-spacing-4xs);
    padding: 3.75px !important;
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: var(--wui-border-radius-5xs);
  }

  :host > wui-flex {
    padding: 2px;
    position: fixed;
    overflow: hidden;
    left: 34px;
    bottom: 8px;
    background: var(--dark-background-150, #1e1f1f);
    border-radius: 50%;
    z-index: 2;
    display: flex;
  }
`,l0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Ka=4,Di=class extends F{constructor(){super(...arguments),this.walletImages=[]}render(){let e=this.walletImages.length<Ka;return f`${this.walletImages.slice(0,Ka).map(({src:t,walletName:r})=>f`
            <wui-wallet-image
              size="inherit"
              imageSrc=${t}
              name=${Q(r)}
            ></wui-wallet-image>
          `)}
      ${e?[...Array(Ka-this.walletImages.length)].map(()=>f` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`):null}
      <wui-flex>
        <wui-icon-box
          size="xxs"
          iconSize="xxs"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>`}};Di.styles=[pe,Uw],l0([y({type:Array})],Di.prototype,"walletImages",void 0),Di=l0([Z("wui-all-wallets-image")],Di);var zw=ee`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`,Ya=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Jo=class extends F{constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;let e=this.size==="md"?"mini-700":"micro-700";return f`
      <wui-text data-variant=${this.variant} variant=${e} color="inherit">
        <slot></slot>
      </wui-text>
    `}};Jo.styles=[pe,zw],Ya([y()],Jo.prototype,"variant",void 0),Ya([y()],Jo.prototype,"size",void 0),Jo=Ya([Z("wui-tag")],Jo);var Dw=ee`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }

  wui-icon {
    color: var(--wui-color-fg-200) !important;
  }
`,Xe=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},De=class extends F{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.tabIdx=void 0,this.installed=!1,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return f`
      <button ?disabled=${this.disabled} tabindex=${Q(this.tabIdx)}>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?f` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?f` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?f`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
        .installed=${this.installed}
      ></wui-wallet-image>`:!this.showAllWallets&&!this.imageSrc?f`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`:null}templateStatus(){return this.loading?f`<wui-loading-spinner
        size="lg"
        color=${this.loadingSpinnerColor}
      ></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?f`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:this.icon?f`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};De.styles=[pe,ze,Dw],Xe([y({type:Array})],De.prototype,"walletImages",void 0),Xe([y()],De.prototype,"imageSrc",void 0),Xe([y()],De.prototype,"name",void 0),Xe([y()],De.prototype,"tagLabel",void 0),Xe([y()],De.prototype,"tagVariant",void 0),Xe([y()],De.prototype,"icon",void 0),Xe([y()],De.prototype,"walletIcon",void 0),Xe([y()],De.prototype,"tabIdx",void 0),Xe([y({type:Boolean})],De.prototype,"installed",void 0),Xe([y({type:Boolean})],De.prototype,"disabled",void 0),Xe([y({type:Boolean})],De.prototype,"showAllWallets",void 0),Xe([y({type:Boolean})],De.prototype,"loading",void 0),Xe([y({type:String})],De.prototype,"loadingSpinnerColor",void 0),De=Xe([Z("wui-list-wallet")],De);var Xo=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},ho=class extends F{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=H.state.connectors,this.count=W.state.count,this.isFetchingRecommendedWallets=W.state.isFetchingRecommendedWallets,this.unsubscribe.push(H.subscribeKey("connectors",e=>this.connectors=e),W.subscribeKey("count",e=>this.count=e),W.subscribeKey("isFetchingRecommendedWallets",e=>this.isFetchingRecommendedWallets=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.connectors.find(s=>s.id==="walletConnect"),{allWallets:t}=O.state;if(!e||t==="HIDE"||t==="ONLY_MOBILE"&&!M.isMobile())return null;let r=W.state.featured.length,o=this.count+r,n=o<10?o:Math.floor(o/10)*10,i=n<o?`${n}+`:`${n}`;return f`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${i}
        tagVariant="shade"
        data-testid="all-wallets"
        tabIdx=${Q(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        loadingSpinnerColor=${this.isFetchingRecommendedWallets?"fg-300":"accent-100"}
      ></wui-list-wallet>
    `}onAllWallets(){ce.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),D.push("AllWallets")}};Xo([y()],ho.prototype,"tabIdx",void 0),Xo([V()],ho.prototype,"connectors",void 0),Xo([V()],ho.prototype,"count",void 0),Xo([V()],ho.prototype,"isFetchingRecommendedWallets",void 0),ho=Xo([Z("w3m-all-wallets-widget")],ho);var Ja=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},ji=class extends F{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=H.state.connectors,this.unsubscribe.push(H.subscribeKey("connectors",e=>this.connectors=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.connectors.filter(t=>t.type==="ANNOUNCED");return e?.length?f`
      <wui-flex flexDirection="column" gap="xs">
        ${e.filter(er.showConnector).map(t=>f`
              <wui-list-wallet
                imageSrc=${Q($e.getConnectorImage(t))}
                name=${t.name??"Unknown"}
                @click=${()=>this.onConnector(t)}
                tagVariant="success"
                tagLabel="installed"
                data-testid=${`wallet-selector-${t.id}`}
                .installed=${!0}
                tabIdx=${Q(this.tabIdx)}
              >
              </wui-list-wallet>
            `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(e){e.id==="walletConnect"?M.isMobile()?D.push("AllWallets"):D.push("ConnectingWalletConnect"):D.push("ConnectingExternal",{connector:e})}};Ja([y()],ji.prototype,"tabIdx",void 0),Ja([V()],ji.prototype,"connectors",void 0),ji=Ja([Z("w3m-connect-announced-widget")],ji);var Wi=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Qo=class extends F{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=H.state.connectors,this.loading=!1,this.unsubscribe.push(H.subscribeKey("connectors",e=>this.connectors=e)),M.isTelegram()&&M.isIos()&&(this.loading=!Y.state.wcUri,this.unsubscribe.push(Y.subscribeKey("wcUri",e=>this.loading=!e)))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{customWallets:e}=O.state;if(!e?.length)return this.style.cssText="display: none",null;let t=this.filterOutDuplicateWallets(e);return f`<wui-flex flexDirection="column" gap="xs">
      ${t.map(r=>f`
          <wui-list-wallet
            imageSrc=${Q($e.getWalletImage(r))}
            name=${r.name??"Unknown"}
            @click=${()=>this.onConnectWallet(r)}
            data-testid=${`wallet-selector-${r.id}`}
            tabIdx=${Q(this.tabIdx)}
            ?loading=${this.loading}
          >
          </wui-list-wallet>
        `)}
    </wui-flex>`}filterOutDuplicateWallets(e){let t=q.getRecentWallets(),r=this.connectors.map(i=>i.info?.rdns).filter(Boolean),o=t.map(i=>i.rdns).filter(Boolean),n=r.concat(o);if(n.includes("io.metamask.mobile")&&M.isMobile()){let i=n.indexOf("io.metamask.mobile");n[i]="io.metamask"}return e.filter(i=>!n.includes(String(i?.rdns)))}onConnectWallet(e){this.loading||D.push("ConnectingWalletConnect",{wallet:e})}};Wi([y()],Qo.prototype,"tabIdx",void 0),Wi([V()],Qo.prototype,"connectors",void 0),Wi([V()],Qo.prototype,"loading",void 0),Qo=Wi([Z("w3m-connect-custom-widget")],Qo);var Xa=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Hi=class extends F{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=H.state.connectors,this.unsubscribe.push(H.subscribeKey("connectors",e=>this.connectors=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.connectors.filter(t=>t.type==="EXTERNAL").filter(er.showConnector).filter(t=>t.id!==G.CONNECTOR_ID.COINBASE_SDK);return e?.length?f`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map(t=>f`
            <wui-list-wallet
              imageSrc=${Q($e.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              data-testid=${`wallet-selector-external-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${Q(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(e){D.push("ConnectingExternal",{connector:e})}};Xa([y()],Hi.prototype,"tabIdx",void 0),Xa([V()],Hi.prototype,"connectors",void 0),Hi=Xa([Z("w3m-connect-external-widget")],Hi);var Qa=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Fi=class extends F{constructor(){super(...arguments),this.tabIdx=void 0,this.wallets=[]}render(){return this.wallets.length?f`
      <wui-flex flexDirection="column" gap="xs">
        ${this.wallets.map(e=>f`
            <wui-list-wallet
              data-testid=${`wallet-selector-featured-${e.id}`}
              imageSrc=${Q($e.getWalletImage(e))}
              name=${e.name??"Unknown"}
              @click=${()=>this.onConnectWallet(e)}
              tabIdx=${Q(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(e){H.selectWalletConnector(e)}};Qa([y()],Fi.prototype,"tabIdx",void 0),Qa([y()],Fi.prototype,"wallets",void 0),Fi=Qa([Z("w3m-connect-featured-widget")],Fi);var ec=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Vi=class extends F{constructor(){super(...arguments),this.tabIdx=void 0,this.connectors=[]}render(){let e=this.connectors;return!e?.length||e.length===1&&e[0]?.name==="Browser Wallet"&&!M.isMobile()?(this.style.cssText="display: none",null):f`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map(t=>{let r=t.info?.rdns;return!M.isMobile()&&t.name==="Browser Wallet"?null:!r&&!Y.checkInstalled()?(this.style.cssText="display: none",null):er.showConnector(t)?f`
            <wui-list-wallet
              imageSrc=${Q($e.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${Q(this.tabIdx)}
            >
            </wui-list-wallet>
          `:null})}
      </wui-flex>
    `}onConnector(e){H.setActiveConnector(e),D.push("ConnectingExternal",{connector:e})}};ec([y()],Vi.prototype,"tabIdx",void 0),ec([y()],Vi.prototype,"connectors",void 0),Vi=ec([Z("w3m-connect-injected-widget")],Vi);var tc=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Zi=class extends F{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=H.state.connectors,this.unsubscribe.push(H.subscribeKey("connectors",e=>this.connectors=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.connectors.filter(t=>t.type==="MULTI_CHAIN"&&t.name!=="WalletConnect");return e?.length?f`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map(t=>f`
            <wui-list-wallet
              imageSrc=${Q($e.getConnectorImage(t))}
              .installed=${!0}
              name=${t.name??"Unknown"}
              tagVariant="shade"
              tagLabel="multichain"
              data-testid=${`wallet-selector-${t.id}`}
              @click=${()=>this.onConnector(t)}
              tabIdx=${Q(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(e){H.setActiveConnector(e),D.push("ConnectingMultiChain")}};tc([y()],Zi.prototype,"tabIdx",void 0),tc([V()],Zi.prototype,"connectors",void 0),Zi=tc([Z("w3m-connect-multi-chain-widget")],Zi);var qi=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},en=class extends F{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=H.state.connectors,this.loading=!1,this.unsubscribe.push(H.subscribeKey("connectors",e=>this.connectors=e)),M.isTelegram()&&M.isIos()&&(this.loading=!Y.state.wcUri,this.unsubscribe.push(Y.subscribeKey("wcUri",e=>this.loading=!e)))}render(){let e=q.getRecentWallets().filter(t=>!ro.isExcluded(t)).filter(t=>!this.hasWalletConnector(t)).filter(t=>this.isWalletCompatibleWithCurrentChain(t));return e.length?f`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map(t=>f`
            <wui-list-wallet
              imageSrc=${Q($e.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tagLabel="recent"
              tagVariant="shade"
              tabIdx=${Q(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(e){this.loading||H.selectWalletConnector(e)}hasWalletConnector(e){return this.connectors.some(t=>t.id===e.id||t.name===e.name)}isWalletCompatibleWithCurrentChain(e){let t=g.state.activeChain;return t&&e.chains?e.chains.some(r=>{let o=r.split(":")[0];return t===o}):!0}};qi([y()],en.prototype,"tabIdx",void 0),qi([V()],en.prototype,"connectors",void 0),qi([V()],en.prototype,"loading",void 0),en=qi([Z("w3m-connect-recent-widget")],en);var Gi=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},tn=class extends F{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.wallets=[],this.loading=!1,M.isTelegram()&&M.isIos()&&(this.loading=!Y.state.wcUri,this.unsubscribe.push(Y.subscribeKey("wcUri",e=>this.loading=!e)))}render(){let{connectors:e}=H.state,{customWallets:t,featuredWalletIds:r}=O.state,o=q.getRecentWallets(),n=e.find(l=>l.id==="walletConnect"),i=e.filter(l=>l.type==="INJECTED"||l.type==="ANNOUNCED"||l.type==="MULTI_CHAIN").filter(l=>l.name!=="Browser Wallet");if(!n)return null;if(r||t||!this.wallets.length)return this.style.cssText="display: none",null;let s=i.length+o.length,a=Math.max(0,2-s),c=ro.filterOutDuplicateWallets(this.wallets).slice(0,a);return c.length?f`
      <wui-flex flexDirection="column" gap="xs">
        ${c.map(l=>f`
            <wui-list-wallet
              imageSrc=${Q($e.getWalletImage(l))}
              name=${l?.name??"Unknown"}
              @click=${()=>this.onConnectWallet(l)}
              tabIdx=${Q(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(e){if(this.loading)return;let t=H.getConnector(e.id,e.rdns);t?D.push("ConnectingExternal",{connector:t}):D.push("ConnectingWalletConnect",{wallet:e})}};Gi([y()],tn.prototype,"tabIdx",void 0),Gi([y()],tn.prototype,"wallets",void 0),Gi([V()],tn.prototype,"loading",void 0),tn=Gi([Z("w3m-connect-recommended-widget")],tn);var Ki=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},rn=class extends F{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=H.state.connectors,this.connectorImages=tt.state.connectorImages,this.unsubscribe.push(H.subscribeKey("connectors",e=>this.connectors=e),tt.subscribeKey("connectorImages",e=>this.connectorImages=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(M.isMobile())return this.style.cssText="display: none",null;let e=this.connectors.find(r=>r.id==="walletConnect");if(!e)return this.style.cssText="display: none",null;let t=e.imageUrl||this.connectorImages[e?.imageId??""];return f`
      <wui-list-wallet
        imageSrc=${Q(t)}
        name=${e.name??"Unknown"}
        @click=${()=>this.onConnector(e)}
        tagLabel="qr code"
        tagVariant="main"
        tabIdx=${Q(this.tabIdx)}
        data-testid="wallet-selector-walletconnect"
      >
      </wui-list-wallet>
    `}onConnector(e){H.setActiveConnector(e),D.push("ConnectingWalletConnect")}};Ki([y()],rn.prototype,"tabIdx",void 0),Ki([V()],rn.prototype,"connectors",void 0),Ki([V()],rn.prototype,"connectorImages",void 0),rn=Ki([Z("w3m-connect-walletconnect-widget")],rn);var jw=ee`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`,on=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},_r=class extends F{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=H.state.connectors,this.recommended=W.state.recommended,this.featured=W.state.featured,this.unsubscribe.push(H.subscribeKey("connectors",e=>this.connectors=e),W.subscribeKey("recommended",e=>this.recommended=e),W.subscribeKey("featured",e=>this.featured=e))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return f`
      <wui-flex flexDirection="column" gap="xs"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){let{custom:e,recent:t,announced:r,injected:o,multiChain:n,recommended:i,featured:s,external:a}=er.getConnectorsByType(this.connectors,this.recommended,this.featured);return er.getConnectorTypeOrder({custom:e,recent:t,announced:r,injected:o,multiChain:n,recommended:i,featured:s,external:a}).map(c=>{switch(c){case"injected":return f`
            ${n.length?f`<w3m-connect-multi-chain-widget
                  tabIdx=${Q(this.tabIdx)}
                ></w3m-connect-multi-chain-widget>`:null}
            ${r.length?f`<w3m-connect-announced-widget
                  tabIdx=${Q(this.tabIdx)}
                ></w3m-connect-announced-widget>`:null}
            ${o.length?f`<w3m-connect-injected-widget
                  .connectors=${o}
                  tabIdx=${Q(this.tabIdx)}
                ></w3m-connect-injected-widget>`:null}
          `;case"walletConnect":return f`<w3m-connect-walletconnect-widget
            tabIdx=${Q(this.tabIdx)}
          ></w3m-connect-walletconnect-widget>`;case"recent":return f`<w3m-connect-recent-widget
            tabIdx=${Q(this.tabIdx)}
          ></w3m-connect-recent-widget>`;case"featured":return f`<w3m-connect-featured-widget
            .wallets=${s}
            tabIdx=${Q(this.tabIdx)}
          ></w3m-connect-featured-widget>`;case"custom":return f`<w3m-connect-custom-widget
            tabIdx=${Q(this.tabIdx)}
          ></w3m-connect-custom-widget>`;case"external":return f`<w3m-connect-external-widget
            tabIdx=${Q(this.tabIdx)}
          ></w3m-connect-external-widget>`;case"recommended":return f`<w3m-connect-recommended-widget
            .wallets=${i}
            tabIdx=${Q(this.tabIdx)}
          ></w3m-connect-recommended-widget>`;default:return console.warn(`Unknown connector type: ${c}`),null}})}};_r.styles=jw,on([y()],_r.prototype,"tabIdx",void 0),on([V()],_r.prototype,"connectors",void 0),on([V()],_r.prototype,"recommended",void 0),on([V()],_r.prototype,"featured",void 0),_r=on([Z("w3m-connector-list")],_r);var Ww=ee`
  :host {
    display: inline-flex;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    padding: var(--wui-spacing-3xs);
    position: relative;
    height: 36px;
    min-height: 36px;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: 28px;
    border-radius: var(--wui-border-radius-3xl);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > wui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button[data-active='true'] > wui-icon,
  button[data-active='true'] > wui-text {
    color: var(--wui-color-fg-100);
  }

  button[data-active='false'] > wui-icon,
  button[data-active='false'] > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[data-active='true']:disabled > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='false']:disabled > wui-text {
    color: var(--wui-color-fg-300);
  }

  button > wui-icon,
  button > wui-text {
    pointer-events: none;
    transition: color var(--wui-e ase-out-power-1) var(--wui-duration-md);
    will-change: color;
  }

  button {
    width: var(--local-tab-width);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  :host([data-type='flex']) > button {
    width: 34px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: transparent !important;
  }

  button:hover:enabled > wui-icon,
  button:active:enabled > wui-icon {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button:hover:enabled > wui-text,
  button:active:enabled > wui-text {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
  }
`,cr=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Ot=class extends F{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.localTabWidth="100px",this.activeTab=0,this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`
      --local-tab: ${this.activeTab};
      --local-tab-width: ${this.localTabWidth};
    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map((e,t)=>{let r=t===this.activeTab;return f`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(t)}
          data-active=${r}
          data-testid="tab-${e.label?.toLowerCase()}"
        >
          ${this.iconTemplate(e)}
          <wui-text variant="small-600" color="inherit"> ${e.label} </wui-text>
        </button>
      `})}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout(()=>{this.animateTabs(0,!0)},0))}iconTemplate(e){return e.icon?f`<wui-icon size="xs" color="inherit" name=${e.icon}></wui-icon>`:null}onTabClick(e){this.buttons&&this.animateTabs(e,!1),this.activeTab=e,this.onTabChange(e)}animateTabs(e,t){let r=this.buttons[this.activeTab],o=this.buttons[e],n=r?.querySelector("wui-text"),i=o?.querySelector("wui-text"),s=o?.getBoundingClientRect(),a=i?.getBoundingClientRect();r&&n&&!t&&e!==this.activeTab&&(n.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),r.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),o&&s&&a&&i&&(e!==this.activeTab||t)&&(this.localTabWidth=`${Math.round(s.width+a.width)+6}px`,o.animate([{width:`${s.width+a.width}px`}],{duration:t?0:500,fill:"forwards",easing:"ease"}),i.animate([{opacity:1}],{duration:t?0:125,delay:t?0:200,fill:"forwards",easing:"ease"}))}};Ot.styles=[pe,ze,Ww],cr([y({type:Array})],Ot.prototype,"tabs",void 0),cr([y()],Ot.prototype,"onTabChange",void 0),cr([y({type:Array})],Ot.prototype,"buttons",void 0),cr([y({type:Boolean})],Ot.prototype,"disabled",void 0),cr([y()],Ot.prototype,"localTabWidth",void 0),cr([V()],Ot.prototype,"activeTab",void 0),cr([V()],Ot.prototype,"isDense",void 0),Ot=cr([Z("wui-tabs")],Ot);var Yi=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},nn=class extends F{constructor(){super(),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0,this.buffering=!1,this.unsubscribe.push(Y.subscribeKey("buffering",e=>this.buffering=e))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.generateTabs();return f`
      <wui-flex justifyContent="center" .padding=${["0","0","l","0"]}>
        <wui-tabs
          ?disabled=${this.buffering}
          .tabs=${e}
          .onTabChange=${this.onTabChange.bind(this)}
        ></wui-tabs>
      </wui-flex>
    `}generateTabs(){let e=this.platforms.map(t=>t==="browser"?{label:"Browser",icon:"extension",platform:"browser"}:t==="mobile"?{label:"Mobile",icon:"mobile",platform:"mobile"}:t==="qrcode"?{label:"Mobile",icon:"mobile",platform:"qrcode"}:t==="web"?{label:"Webapp",icon:"browser",platform:"web"}:t==="desktop"?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=e.map(({platform:t})=>t),e}onTabChange(e){let t=this.platformTabs[e];t&&this.onSelectPlatfrom?.(t)}};Yi([y({type:Array})],nn.prototype,"platforms",void 0),Yi([y()],nn.prototype,"onSelectPlatfrom",void 0),Yi([V()],nn.prototype,"buffering",void 0),nn=Yi([Z("w3m-connecting-header")],nn);var Hw=ee`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`,rc=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},sn=class extends F{constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText=`--local-color: ${this.color==="inherit"?"inherit":`var(--wui-color-${this.color})`}`,this.dataset.size=this.size,f`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};sn.styles=[pe,Hw],rc([y()],sn.prototype,"color",void 0),rc([y()],sn.prototype,"size",void 0),sn=rc([Z("wui-loading-spinner")],sn);var Fw=ee`
  :host {
    width: var(--local-width);
    position: relative;
  }

  button {
    border: none;
    border-radius: var(--local-border-radius);
    width: var(--local-width);
    white-space: nowrap;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='md'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-l);
    height: 36px;
  }

  button[data-size='md'][data-icon-left='true'][data-icon-right='false'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-s);
  }

  button[data-size='md'][data-icon-right='true'][data-icon-left='false'] {
    padding: 8.2px var(--wui-spacing-s) 9px var(--wui-spacing-l);
  }

  button[data-size='lg'] {
    padding: var(--wui-spacing-m) var(--wui-spacing-2l);
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='inverse'] {
    background-color: var(--wui-color-inverse-100);
    color: var(--wui-color-inverse-000);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='accent-error'] {
    background: var(--wui-color-error-glass-015);
    color: var(--wui-color-error-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-error-glass-010);
  }

  button[data-variant='accent-success'] {
    background: var(--wui-color-success-glass-015);
    color: var(--wui-color-success-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-success-glass-010);
  }

  button[data-variant='neutral'] {
    background: transparent;
    color: var(--wui-color-fg-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-variant='main']:focus-visible:enabled {
    background-color: var(--wui-color-accent-090);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='inverse']:focus-visible:enabled {
    background-color: var(--wui-color-inverse-100);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent']:focus-visible:enabled {
    background-color: var(--wui-color-accent-glass-010);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent-error']:focus-visible:enabled {
    background: var(--wui-color-error-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-error-100),
      0 0 0 4px var(--wui-color-error-glass-020);
  }
  button[data-variant='accent-success']:focus-visible:enabled {
    background: var(--wui-color-success-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-success-100),
      0 0 0 4px var(--wui-color-success-glass-020);
  }
  button[data-variant='neutral']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='accent-error']:hover:enabled {
      background: var(--wui-color-error-glass-020);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-error']:active:enabled {
      background: var(--wui-color-error-glass-030);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-success']:hover:enabled {
      background: var(--wui-color-success-glass-020);
      color: var(--wui-color-success-100);
    }

    button[data-variant='accent-success']:active:enabled {
      background: var(--wui-color-success-glass-030);
      color: var(--wui-color-success-100);
    }

    button[data-variant='neutral']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='neutral']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }

    button[data-size='lg'][data-icon-left='true'][data-icon-right='false'] {
      padding-left: var(--wui-spacing-m);
    }

    button[data-size='lg'][data-icon-right='true'][data-icon-left='false'] {
      padding-right: var(--wui-spacing-m);
    }
  }

  /* -- Disabled state --------------------------------------------------- */
  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    color: var(--wui-color-gray-glass-020);
    cursor: not-allowed;
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  wui-loading-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: var(--local-opacity-000);
  }
`,Tt=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},d0={main:"inverse-100",inverse:"inverse-000",accent:"accent-100","accent-error":"error-100","accent-success":"success-100",neutral:"fg-100",disabled:"gray-glass-020"},Vw={lg:"paragraph-600",md:"small-600"},Zw={lg:"md",md:"md"},wt=class extends F{constructor(){super(...arguments),this.size="lg",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="main",this.hasIconLeft=!1,this.hasIconRight=!1,this.borderRadius="m"}render(){this.style.cssText=`
    --local-width: ${this.fullWidth?"100%":"auto"};
    --local-opacity-100: ${this.loading?0:1};
    --local-opacity-000: ${this.loading?1:0};
    --local-border-radius: var(--wui-border-radius-${this.borderRadius});
    `;let e=this.textVariant??Vw[this.size];return f`
      <button
        data-variant=${this.variant}
        data-icon-left=${this.hasIconLeft}
        data-icon-right=${this.hasIconRight}
        data-size=${this.size}
        ?disabled=${this.disabled}
      >
        ${this.loadingTemplate()}
        <slot name="iconLeft" @slotchange=${()=>this.handleSlotLeftChange()}></slot>
        <wui-text variant=${e} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight" @slotchange=${()=>this.handleSlotRightChange()}></slot>
      </button>
    `}handleSlotLeftChange(){this.hasIconLeft=!0}handleSlotRightChange(){this.hasIconRight=!0}loadingTemplate(){if(this.loading){let e=Zw[this.size],t=this.disabled?d0.disabled:d0[this.variant];return f`<wui-loading-spinner color=${t} size=${e}></wui-loading-spinner>`}return f``}};wt.styles=[pe,ze,Fw],Tt([y()],wt.prototype,"size",void 0),Tt([y({type:Boolean})],wt.prototype,"disabled",void 0),Tt([y({type:Boolean})],wt.prototype,"fullWidth",void 0),Tt([y({type:Boolean})],wt.prototype,"loading",void 0),Tt([y()],wt.prototype,"variant",void 0),Tt([y({type:Boolean})],wt.prototype,"hasIconLeft",void 0),Tt([y({type:Boolean})],wt.prototype,"hasIconRight",void 0),Tt([y()],wt.prototype,"borderRadius",void 0),Tt([y()],wt.prototype,"textVariant",void 0),wt=Tt([Z("wui-button")],wt);var qw=ee`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`,Ji=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},po=class extends F{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return f`
      <button ?disabled=${this.disabled} tabindex=${Q(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};po.styles=[pe,ze,qw],Ji([y()],po.prototype,"tabIdx",void 0),Ji([y({type:Boolean})],po.prototype,"disabled",void 0),Ji([y()],po.prototype,"color",void 0),po=Ji([Z("wui-link")],po);var Gw=ee`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`,u0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Xi=class extends F{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){let e=this.radius>50?50:this.radius,t=36-e,r=116+t,o=245+t,n=360+t*1.75;return f`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${e}
          stroke-dasharray="${r} ${o}"
          stroke-dashoffset=${n}
        />
      </svg>
    `}};Xi.styles=[pe,Gw],u0([y({type:Number})],Xi.prototype,"radius",void 0),Xi=u0([Z("wui-loading-thumbnail")],Xi);var Kw=ee`
  button {
    border: none;
    border-radius: var(--wui-border-radius-3xl);
  }

  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='gray'] {
    background-color: transparent;
    color: var(--wui-color-fg-200);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='shade'] {
    background-color: transparent;
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-size='sm'] {
    height: 32px;
    padding: 0 var(--wui-spacing-s);
  }

  button[data-size='md'] {
    height: 40px;
    padding: 0 var(--wui-spacing-l);
  }

  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] > wui-icon {
    width: 14px;
    height: 14px;
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  button.disabled > wui-icon,
  button.disabled > wui-image {
    filter: grayscale(1);
  }

  button[data-variant='main'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-accent-090);
  }

  button[data-variant='shade'] > wui-image,
  button[data-variant='gray'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:focus-visible {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='shade']:focus-visible,
    button[data-variant='gray']:focus-visible,
    button[data-variant='shade']:hover,
    button[data-variant='gray']:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    button[data-variant='gray']:active,
    button[data-variant='shade']:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  button.disabled {
    color: var(--wui-color-gray-glass-020);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    pointer-events: none;
  }
`,Or=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Zt=class extends F{constructor(){super(...arguments),this.variant="accent",this.imageSrc="",this.disabled=!1,this.icon="externalLink",this.size="md",this.text=""}render(){let e=this.size==="sm"?"small-600":"paragraph-600";return f`
      <button
        class=${this.disabled?"disabled":""}
        data-variant=${this.variant}
        data-size=${this.size}
      >
        ${this.imageSrc?f`<wui-image src=${this.imageSrc}></wui-image>`:null}
        <wui-text variant=${e} color="inherit"> ${this.text} </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </button>
    `}};Zt.styles=[pe,ze,Kw],Or([y()],Zt.prototype,"variant",void 0),Or([y()],Zt.prototype,"imageSrc",void 0),Or([y({type:Boolean})],Zt.prototype,"disabled",void 0),Or([y()],Zt.prototype,"icon",void 0),Or([y()],Zt.prototype,"size",void 0),Or([y()],Zt.prototype,"text",void 0),Zt=Or([Z("wui-chip-button")],Zt);var Yw=ee`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`,Qi=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},go=class extends F{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return f`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" color="fg-200">${this.label}</wui-text>
        <wui-chip-button size="sm" variant="shade" text=${this.buttonLabel} icon="chevronRight">
        </wui-chip-button>
      </wui-flex>
    `}};go.styles=[pe,ze,Yw],Qi([y({type:Boolean})],go.prototype,"disabled",void 0),Qi([y()],go.prototype,"label",void 0),Qi([y()],go.prototype,"buttonLabel",void 0),go=Qi([Z("wui-cta-button")],go);var Jw=ee`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`,h0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},es=class extends F{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:e,app_store:t,play_store:r,chrome_store:o,homepage:n}=this.wallet,i=M.isMobile(),s=M.isIos(),a=M.isAndroid(),c=[t,r,n,o].filter(Boolean).length>1,l=Me.getTruncateString({string:e,charsStart:12,charsEnd:0,truncate:"end"});return c&&!i?f`
        <wui-cta-button
          label=${`Don't have ${l}?`}
          buttonLabel="Get"
          @click=${()=>D.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!c&&n?f`
        <wui-cta-button
          label=${`Don't have ${l}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:t&&s?f`
        <wui-cta-button
          label=${`Don't have ${l}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:r&&a?f`
        <wui-cta-button
          label=${`Don't have ${l}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&M.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&M.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&M.openHref(this.wallet.homepage,"_blank")}};es.styles=[Jw],h0([y({type:Object})],es.prototype,"wallet",void 0),es=h0([Z("w3m-mobile-download-links")],es);var Xw=ee`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-2);
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }
`,kt=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Oe=class extends F{constructor(){super(),this.wallet=D.state.data?.wallet,this.connector=D.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=$e.getWalletImage(this.wallet)??$e.getConnectorImage(this.connector),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=Y.state.wcUri,this.error=Y.state.wcError,this.ready=!1,this.showRetry=!1,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.buffering=!1,this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(Y.subscribeKey("wcUri",t=>{this.uri=t,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),Y.subscribeKey("wcError",t=>this.error=t),Y.subscribeKey("buffering",t=>this.buffering=t)),(M.isTelegram()||M.isSafari())&&M.isIos()&&Y.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let t=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,r=`Continue in ${this.name}`;return this.buffering&&(r="Connecting..."),this.error&&(r="Connection declined"),f`
      <wui-flex
        data-error=${Q(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${Q(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${r}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?f`
              <wui-button
                variant="accent"
                size="md"
                ?disabled=${this.isRetrying||!this.error&&this.buffering||this.isLoading}
                @click=${this.onTryAgain.bind(this)}
                data-testid="w3m-connecting-widget-secondary-button"
              >
                <wui-icon color="inherit" slot="iconLeft" name=${this.secondaryBtnIcon}></wui-icon>
                ${this.secondaryBtnLabel}
              </wui-button>
            `:null}
      </wui-flex>

      ${this.isWalletConnect?f`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200" data-testid="wui-link-copy">
                <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,this.shadowRoot?.querySelector("wui-button")?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"}))}onTryAgain(){this.buffering||(Y.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.())}loaderTemplate(){let t=Pe.state.themeVariables["--w3m-border-radius-master"],r=t?parseInt(t.replace("px",""),10):4;return f`<wui-loading-thumbnail radius=${r*9}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(M.copyToClopboard(this.uri),Ce.showSuccess("Link copied"))}catch{Ce.showError("Failed to copy")}}};Oe.styles=Xw,kt([V()],Oe.prototype,"isRetrying",void 0),kt([V()],Oe.prototype,"uri",void 0),kt([V()],Oe.prototype,"error",void 0),kt([V()],Oe.prototype,"ready",void 0),kt([V()],Oe.prototype,"showRetry",void 0),kt([V()],Oe.prototype,"secondaryBtnLabel",void 0),kt([V()],Oe.prototype,"secondaryLabel",void 0),kt([V()],Oe.prototype,"buffering",void 0),kt([V()],Oe.prototype,"isLoading",void 0),kt([y({type:Boolean})],Oe.prototype,"isMobile",void 0),kt([y()],Oe.prototype,"onRetry",void 0);var Qw=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},p0=class extends Oe{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),ce.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}async onConnectProxy(){try{this.error=!1;let{connectors:e}=H.state,t=e.find(r=>r.type==="ANNOUNCED"&&r.info?.rdns===this.wallet?.rdns||r.type==="INJECTED"||r.name===this.wallet?.name);if(t)await Y.connectExternal(t,t.chain);else throw new Error("w3m-connecting-wc-browser: No connector found");de.close(),ce.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.wallet?.name||"Unknown"}})}catch(e){ce.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),this.error=!0}}};p0=Qw([Z("w3m-connecting-wc-browser")],p0);var e2=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},g0=class extends Oe{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),ce.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop"}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:e,name:t}=this.wallet,{redirect:r,href:o}=M.formatNativeUrl(e,this.uri);Y.setWcLinking({name:t,href:o}),Y.setRecentWallet(this.wallet),M.openHref(r,"_blank")}catch{this.error=!0}}};g0=e2([Z("w3m-connecting-wc-desktop")],g0);var t2=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},f0=class extends Oe{constructor(){if(super(),this.btnLabelTimeout=void 0,this.labelTimeout=void 0,this.onRender=()=>{!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())},this.onConnect=()=>{if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;let{mobile_link:e,name:t}=this.wallet,{redirect:r,href:o}=M.formatNativeUrl(e,this.uri);Y.setWcLinking({name:t,href:o}),Y.setRecentWallet(this.wallet);let n=M.isIframe()?"_top":"_self";M.openHref(r,n),clearTimeout(this.labelTimeout),this.secondaryLabel=Re.CONNECT_LABELS.MOBILE}catch(e){ce.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:e instanceof Error?e.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.initializeStateAndTimers(),document.addEventListener("visibilitychange",this.onBuffering.bind(this)),ce.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile"}})}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this.onBuffering.bind(this)),clearTimeout(this.btnLabelTimeout),clearTimeout(this.labelTimeout)}initializeStateAndTimers(){this.secondaryBtnLabel=void 0,this.secondaryLabel=Re.CONNECT_LABELS.MOBILE,this.btnLabelTimeout=setTimeout(()=>{this.secondaryBtnLabel="Try again",this.secondaryLabel=Re.CONNECT_LABELS.MOBILE},Re.FIVE_SEC_MS),this.labelTimeout=setTimeout(()=>{this.secondaryLabel="Hold tight... it's taking longer than expected"},Re.THREE_SEC_MS)}onBuffering(){let e=M.isIos();document?.visibilityState==="visible"&&!this.error&&e&&(Y.setBuffering(!0),setTimeout(()=>{Y.setBuffering(!1)},5e3))}onTryAgain(){this.buffering||(clearTimeout(this.btnLabelTimeout),clearTimeout(this.labelTimeout),this.initializeStateAndTimers(),Y.setWcError(!1),this.onConnect())}};f0=t2([Z("w3m-connecting-wc-mobile")],f0);var bn={},r2=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then},Qu={},dt={},oc,o2=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];dt.getSymbolSize=function(e){if(!e)throw new Error('"version" cannot be null or undefined');if(e<1||e>40)throw new Error('"version" should be in range from 1 to 40');return e*4+17},dt.getSymbolTotalCodewords=function(e){return o2[e]},dt.getBCHDigit=function(e){let t=0;for(;e!==0;)t++,e>>>=1;return t},dt.setToSJISFunction=function(e){if(typeof e!="function")throw new Error('"toSJISFunc" is not a valid function.');oc=e},dt.isKanjiModeEnabled=function(){return typeof oc<"u"},dt.toSJIS=function(e){return oc(e)};var ea={};(function(e){e.L={bit:1},e.M={bit:0},e.Q={bit:3},e.H={bit:2};function t(r){if(typeof r!="string")throw new Error("Param is not a string");switch(r.toLowerCase()){case"l":case"low":return e.L;case"m":case"medium":return e.M;case"q":case"quartile":return e.Q;case"h":case"high":return e.H;default:throw new Error("Unknown EC Level: "+r)}}e.isValid=function(r){return r&&typeof r.bit<"u"&&r.bit>=0&&r.bit<4},e.from=function(r,o){if(e.isValid(r))return r;try{return t(r)}catch{return o}}})(ea);function e1(){this.buffer=[],this.length=0}e1.prototype={get:function(e){let t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)===1},put:function(e,t){for(let r=0;r<t;r++)this.putBit((e>>>t-r-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(e){let t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}};var n2=e1;function yn(e){if(!e||e<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}yn.prototype.set=function(e,t,r,o){let n=e*this.size+t;this.data[n]=r,o&&(this.reservedBit[n]=!0)},yn.prototype.get=function(e,t){return this.data[e*this.size+t]},yn.prototype.xor=function(e,t,r){this.data[e*this.size+t]^=r},yn.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]};var i2=yn,t1={};(function(e){let t=dt.getSymbolSize;e.getRowColCoords=function(r){if(r===1)return[];let o=Math.floor(r/7)+2,n=t(r),i=n===145?26:Math.ceil((n-13)/(2*o-2))*2,s=[n-7];for(let a=1;a<o-1;a++)s[a]=s[a-1]-i;return s.push(6),s.reverse()},e.getPositions=function(r){let o=[],n=e.getRowColCoords(r),i=n.length;for(let s=0;s<i;s++)for(let a=0;a<i;a++)s===0&&a===0||s===0&&a===i-1||s===i-1&&a===0||o.push([n[s],n[a]]);return o}})(t1);var r1={},s2=dt.getSymbolSize,w0=7;r1.getPositions=function(e){let t=s2(e);return[[0,0],[t-w0,0],[0,t-w0]]};var o1={};(function(e){e.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};let t={N1:3,N2:3,N3:40,N4:10};e.isValid=function(o){return o!=null&&o!==""&&!isNaN(o)&&o>=0&&o<=7},e.from=function(o){return e.isValid(o)?parseInt(o,10):void 0},e.getPenaltyN1=function(o){let n=o.size,i=0,s=0,a=0,c=null,l=null;for(let d=0;d<n;d++){s=a=0,c=l=null;for(let u=0;u<n;u++){let h=o.get(d,u);h===c?s++:(s>=5&&(i+=t.N1+(s-5)),c=h,s=1),h=o.get(u,d),h===l?a++:(a>=5&&(i+=t.N1+(a-5)),l=h,a=1)}s>=5&&(i+=t.N1+(s-5)),a>=5&&(i+=t.N1+(a-5))}return i},e.getPenaltyN2=function(o){let n=o.size,i=0;for(let s=0;s<n-1;s++)for(let a=0;a<n-1;a++){let c=o.get(s,a)+o.get(s,a+1)+o.get(s+1,a)+o.get(s+1,a+1);(c===4||c===0)&&i++}return i*t.N2},e.getPenaltyN3=function(o){let n=o.size,i=0,s=0,a=0;for(let c=0;c<n;c++){s=a=0;for(let l=0;l<n;l++)s=s<<1&2047|o.get(c,l),l>=10&&(s===1488||s===93)&&i++,a=a<<1&2047|o.get(l,c),l>=10&&(a===1488||a===93)&&i++}return i*t.N3},e.getPenaltyN4=function(o){let n=0,i=o.data.length;for(let s=0;s<i;s++)n+=o.data[s];return Math.abs(Math.ceil(n*100/i/5)-10)*t.N4};function r(o,n,i){switch(o){case e.Patterns.PATTERN000:return(n+i)%2===0;case e.Patterns.PATTERN001:return n%2===0;case e.Patterns.PATTERN010:return i%3===0;case e.Patterns.PATTERN011:return(n+i)%3===0;case e.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(i/3))%2===0;case e.Patterns.PATTERN101:return n*i%2+n*i%3===0;case e.Patterns.PATTERN110:return(n*i%2+n*i%3)%2===0;case e.Patterns.PATTERN111:return(n*i%3+(n+i)%2)%2===0;default:throw new Error("bad maskPattern:"+o)}}e.applyMask=function(o,n){let i=n.size;for(let s=0;s<i;s++)for(let a=0;a<i;a++)n.isReserved(a,s)||n.xor(a,s,r(o,a,s))},e.getBestMask=function(o,n){let i=Object.keys(e.Patterns).length,s=0,a=1/0;for(let c=0;c<i;c++){n(c),e.applyMask(c,o);let l=e.getPenaltyN1(o)+e.getPenaltyN2(o)+e.getPenaltyN3(o)+e.getPenaltyN4(o);e.applyMask(c,o),l<a&&(a=l,s=c)}return s}})(o1);var Ws={},lr=ea,ts=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],rs=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];Ws.getBlocksCount=function(e,t){switch(t){case lr.L:return ts[(e-1)*4+0];case lr.M:return ts[(e-1)*4+1];case lr.Q:return ts[(e-1)*4+2];case lr.H:return ts[(e-1)*4+3];default:return}},Ws.getTotalCodewordsCount=function(e,t){switch(t){case lr.L:return rs[(e-1)*4+0];case lr.M:return rs[(e-1)*4+1];case lr.Q:return rs[(e-1)*4+2];case lr.H:return rs[(e-1)*4+3];default:return}};var n1={},os={},an=new Uint8Array(512),ns=new Uint8Array(256);(function(){let e=1;for(let t=0;t<255;t++)an[t]=e,ns[e]=t,e<<=1,e&256&&(e^=285);for(let t=255;t<512;t++)an[t]=an[t-255]})(),os.log=function(e){if(e<1)throw new Error("log("+e+")");return ns[e]},os.exp=function(e){return an[e]},os.mul=function(e,t){return e===0||t===0?0:an[ns[e]+ns[t]]},function(e){let t=os;e.mul=function(r,o){let n=new Uint8Array(r.length+o.length-1);for(let i=0;i<r.length;i++)for(let s=0;s<o.length;s++)n[i+s]^=t.mul(r[i],o[s]);return n},e.mod=function(r,o){let n=new Uint8Array(r);for(;n.length-o.length>=0;){let i=n[0];for(let a=0;a<o.length;a++)n[a]^=t.mul(o[a],i);let s=0;for(;s<n.length&&n[s]===0;)s++;n=n.slice(s)}return n},e.generateECPolynomial=function(r){let o=new Uint8Array([1]);for(let n=0;n<r;n++)o=e.mul(o,new Uint8Array([1,t.exp(n)]));return o}}(n1);var m0=n1;function Al(e){this.genPoly=void 0,this.degree=e,this.degree&&this.initialize(this.degree)}Al.prototype.initialize=function(e){this.degree=e,this.genPoly=m0.generateECPolynomial(this.degree)},Al.prototype.encode=function(e){if(!this.genPoly)throw new Error("Encoder not initialized");let t=new Uint8Array(e.length+this.degree);t.set(e);let r=m0.mod(t,this.genPoly),o=this.degree-r.length;if(o>0){let n=new Uint8Array(this.degree);return n.set(r,o),n}return r};var a2=Al,i1={},Cr={},Nl={};Nl.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40};var Bt={},s1="[0-9]+",c2="[A-Z $%*+\\-./:]+",oi="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";oi=oi.replace(/u/g,"\\u");var l2="(?:(?![A-Z0-9 $%*+\\-./:]|"+oi+`)(?:.|[\r
]))+`;Bt.KANJI=new RegExp(oi,"g"),Bt.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),Bt.BYTE=new RegExp(l2,"g"),Bt.NUMERIC=new RegExp(s1,"g"),Bt.ALPHANUMERIC=new RegExp(c2,"g");var d2=new RegExp("^"+oi+"$"),u2=new RegExp("^"+s1+"$"),h2=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");Bt.testKanji=function(e){return d2.test(e)},Bt.testNumeric=function(e){return u2.test(e)},Bt.testAlphanumeric=function(e){return h2.test(e)},function(e){let t=Nl,r=Bt;e.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},e.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},e.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},e.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},e.MIXED={bit:-1},e.getCharCountIndicator=function(n,i){if(!n.ccBits)throw new Error("Invalid mode: "+n);if(!t.isValid(i))throw new Error("Invalid version: "+i);return i>=1&&i<10?n.ccBits[0]:i<27?n.ccBits[1]:n.ccBits[2]},e.getBestModeForData=function(n){return r.testNumeric(n)?e.NUMERIC:r.testAlphanumeric(n)?e.ALPHANUMERIC:r.testKanji(n)?e.KANJI:e.BYTE},e.toString=function(n){if(n&&n.id)return n.id;throw new Error("Invalid mode")},e.isValid=function(n){return n&&n.bit&&n.ccBits};function o(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return e.NUMERIC;case"alphanumeric":return e.ALPHANUMERIC;case"kanji":return e.KANJI;case"byte":return e.BYTE;default:throw new Error("Unknown mode: "+n)}}e.from=function(n,i){if(e.isValid(n))return n;try{return o(n)}catch{return i}}}(Cr),function(e){let t=dt,r=Ws,o=ea,n=Cr,i=Nl,s=7973,a=t.getBCHDigit(s);function c(h,p,w){for(let b=1;b<=40;b++)if(p<=e.getCapacity(b,w,h))return b}function l(h,p){return n.getCharCountIndicator(h,p)+4}function d(h,p){let w=0;return h.forEach(function(b){let v=l(b.mode,p);w+=v+b.getBitsLength()}),w}function u(h,p){for(let w=1;w<=40;w++)if(d(h,w)<=e.getCapacity(w,p,n.MIXED))return w}e.from=function(h,p){return i.isValid(h)?parseInt(h,10):p},e.getCapacity=function(h,p,w){if(!i.isValid(h))throw new Error("Invalid QR Code version");typeof w>"u"&&(w=n.BYTE);let b=t.getSymbolTotalCodewords(h),v=r.getTotalCodewordsCount(h,p),m=(b-v)*8;if(w===n.MIXED)return m;let x=m-l(w,h);switch(w){case n.NUMERIC:return Math.floor(x/10*3);case n.ALPHANUMERIC:return Math.floor(x/11*2);case n.KANJI:return Math.floor(x/13);case n.BYTE:default:return Math.floor(x/8)}},e.getBestVersionForData=function(h,p){let w,b=o.from(p,o.M);if(Array.isArray(h)){if(h.length>1)return u(h,b);if(h.length===0)return 1;w=h[0]}else w=h;return c(w.mode,w.getLength(),b)},e.getEncodedBits=function(h){if(!i.isValid(h)||h<7)throw new Error("Invalid QR Code version");let p=h<<12;for(;t.getBCHDigit(p)-a>=0;)p^=s<<t.getBCHDigit(p)-a;return h<<12|p}}(i1);var a1={},Il=dt,c1=1335,p2=21522,v0=Il.getBCHDigit(c1);a1.getEncodedBits=function(e,t){let r=e.bit<<3|t,o=r<<10;for(;Il.getBCHDigit(o)-v0>=0;)o^=c1<<Il.getBCHDigit(o)-v0;return(r<<10|o)^p2};var l1={},g2=Cr;function vo(e){this.mode=g2.NUMERIC,this.data=e.toString()}vo.getBitsLength=function(e){return 10*Math.floor(e/3)+(e%3?e%3*3+1:0)},vo.prototype.getLength=function(){return this.data.length},vo.prototype.getBitsLength=function(){return vo.getBitsLength(this.data.length)},vo.prototype.write=function(e){let t,r,o;for(t=0;t+3<=this.data.length;t+=3)r=this.data.substr(t,3),o=parseInt(r,10),e.put(o,10);let n=this.data.length-t;n>0&&(r=this.data.substr(t),o=parseInt(r,10),e.put(o,n*3+1))};var f2=vo,w2=Cr,nc=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function bo(e){this.mode=w2.ALPHANUMERIC,this.data=e}bo.getBitsLength=function(e){return 11*Math.floor(e/2)+6*(e%2)},bo.prototype.getLength=function(){return this.data.length},bo.prototype.getBitsLength=function(){return bo.getBitsLength(this.data.length)},bo.prototype.write=function(e){let t;for(t=0;t+2<=this.data.length;t+=2){let r=nc.indexOf(this.data[t])*45;r+=nc.indexOf(this.data[t+1]),e.put(r,11)}this.data.length%2&&e.put(nc.indexOf(this.data[t]),6)};var m2=bo,v2=function(e){for(var t=[],r=e.length,o=0;o<r;o++){var n=e.charCodeAt(o);if(n>=55296&&n<=56319&&r>o+1){var i=e.charCodeAt(o+1);i>=56320&&i<=57343&&(n=(n-55296)*1024+i-56320+65536,o+=1)}if(n<128){t.push(n);continue}if(n<2048){t.push(n>>6|192),t.push(n&63|128);continue}if(n<55296||n>=57344&&n<65536){t.push(n>>12|224),t.push(n>>6&63|128),t.push(n&63|128);continue}if(n>=65536&&n<=1114111){t.push(n>>18|240),t.push(n>>12&63|128),t.push(n>>6&63|128),t.push(n&63|128);continue}t.push(239,191,189)}return new Uint8Array(t).buffer},b2=v2,y2=Cr;function yo(e){this.mode=y2.BYTE,typeof e=="string"&&(e=b2(e)),this.data=new Uint8Array(e)}yo.getBitsLength=function(e){return e*8},yo.prototype.getLength=function(){return this.data.length},yo.prototype.getBitsLength=function(){return yo.getBitsLength(this.data.length)},yo.prototype.write=function(e){for(let t=0,r=this.data.length;t<r;t++)e.put(this.data[t],8)};var C2=yo,x2=Cr,E2=dt;function Co(e){this.mode=x2.KANJI,this.data=e}Co.getBitsLength=function(e){return e*13},Co.prototype.getLength=function(){return this.data.length},Co.prototype.getBitsLength=function(){return Co.getBitsLength(this.data.length)},Co.prototype.write=function(e){let t;for(t=0;t<this.data.length;t++){let r=E2.toSJIS(this.data[t]);if(r>=33088&&r<=40956)r-=33088;else if(r>=57408&&r<=60351)r-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);r=(r>>>8&255)*192+(r&255),e.put(r,13)}};var k2=Co,b0={exports:{}};(function(e){var t={single_source_shortest_paths:function(r,o,n){var i={},s={};s[o]=0;var a=t.PriorityQueue.make();a.push(o,0);for(var c,l,d,u,h,p,w,b,v;!a.empty();){c=a.pop(),l=c.value,u=c.cost,h=r[l]||{};for(d in h)h.hasOwnProperty(d)&&(p=h[d],w=u+p,b=s[d],v=typeof s[d]>"u",(v||b>w)&&(s[d]=w,a.push(d,w),i[d]=l))}if(typeof n<"u"&&typeof s[n]>"u"){var m=["Could not find a path from ",o," to ",n,"."].join("");throw new Error(m)}return i},extract_shortest_path_from_predecessor_list:function(r,o){for(var n=[],i=o;i;)n.push(i),r[i],i=r[i];return n.reverse(),n},find_path:function(r,o,n){var i=t.single_source_shortest_paths(r,o,n);return t.extract_shortest_path_from_predecessor_list(i,n)},PriorityQueue:{make:function(r){var o=t.PriorityQueue,n={},i;r=r||{};for(i in o)o.hasOwnProperty(i)&&(n[i]=o[i]);return n.queue=[],n.sorter=r.sorter||o.default_sorter,n},default_sorter:function(r,o){return r.cost-o.cost},push:function(r,o){var n={value:r,cost:o};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};e.exports=t})(b0),function(e){let t=Cr,r=f2,o=m2,n=C2,i=k2,s=Bt,a=dt,c=b0.exports;function l(m){return unescape(encodeURIComponent(m)).length}function d(m,x,C){let E=[],I;for(;(I=m.exec(C))!==null;)E.push({data:I[0],index:I.index,mode:x,length:I[0].length});return E}function u(m){let x=d(s.NUMERIC,t.NUMERIC,m),C=d(s.ALPHANUMERIC,t.ALPHANUMERIC,m),E,I;return a.isKanjiModeEnabled()?(E=d(s.BYTE,t.BYTE,m),I=d(s.KANJI,t.KANJI,m)):(E=d(s.BYTE_KANJI,t.BYTE,m),I=[]),x.concat(C,E,I).sort(function(S,j){return S.index-j.index}).map(function(S){return{data:S.data,mode:S.mode,length:S.length}})}function h(m,x){switch(x){case t.NUMERIC:return r.getBitsLength(m);case t.ALPHANUMERIC:return o.getBitsLength(m);case t.KANJI:return i.getBitsLength(m);case t.BYTE:return n.getBitsLength(m)}}function p(m){return m.reduce(function(x,C){let E=x.length-1>=0?x[x.length-1]:null;return E&&E.mode===C.mode?(x[x.length-1].data+=C.data,x):(x.push(C),x)},[])}function w(m){let x=[];for(let C=0;C<m.length;C++){let E=m[C];switch(E.mode){case t.NUMERIC:x.push([E,{data:E.data,mode:t.ALPHANUMERIC,length:E.length},{data:E.data,mode:t.BYTE,length:E.length}]);break;case t.ALPHANUMERIC:x.push([E,{data:E.data,mode:t.BYTE,length:E.length}]);break;case t.KANJI:x.push([E,{data:E.data,mode:t.BYTE,length:l(E.data)}]);break;case t.BYTE:x.push([{data:E.data,mode:t.BYTE,length:l(E.data)}])}}return x}function b(m,x){let C={},E={start:{}},I=["start"];for(let S=0;S<m.length;S++){let j=m[S],R=[];for(let P=0;P<j.length;P++){let L=j[P],B=""+S+P;R.push(B),C[B]={node:L,lastCount:0},E[B]={};for(let ne=0;ne<I.length;ne++){let ge=I[ne];C[ge]&&C[ge].node.mode===L.mode?(E[ge][B]=h(C[ge].lastCount+L.length,L.mode)-h(C[ge].lastCount,L.mode),C[ge].lastCount+=L.length):(C[ge]&&(C[ge].lastCount=L.length),E[ge][B]=h(L.length,L.mode)+4+t.getCharCountIndicator(L.mode,x))}}I=R}for(let S=0;S<I.length;S++)E[I[S]].end=0;return{map:E,table:C}}function v(m,x){let C,E=t.getBestModeForData(m);if(C=t.from(x,E),C!==t.BYTE&&C.bit<E.bit)throw new Error('"'+m+'" cannot be encoded with mode '+t.toString(C)+`.
 Suggested mode is: `+t.toString(E));switch(C===t.KANJI&&!a.isKanjiModeEnabled()&&(C=t.BYTE),C){case t.NUMERIC:return new r(m);case t.ALPHANUMERIC:return new o(m);case t.KANJI:return new i(m);case t.BYTE:return new n(m)}}e.fromArray=function(m){return m.reduce(function(x,C){return typeof C=="string"?x.push(v(C,null)):C.data&&x.push(v(C.data,C.mode)),x},[])},e.fromString=function(m,x){let C=u(m,a.isKanjiModeEnabled()),E=w(C),I=b(E,x),S=c.find_path(I.map,"start","end"),j=[];for(let R=1;R<S.length-1;R++)j.push(I.table[S[R]].node);return e.fromArray(p(j))},e.rawSplit=function(m){return e.fromArray(u(m,a.isKanjiModeEnabled()))}}(l1);var ta=dt,ic=ea,A2=n2,N2=i2,I2=t1,S2=r1,Sl=o1,_l=Ws,_2=a2,Hs=i1,O2=a1,T2=Cr,sc=l1;function P2(e,t){let r=e.size,o=S2.getPositions(t);for(let n=0;n<o.length;n++){let i=o[n][0],s=o[n][1];for(let a=-1;a<=7;a++)if(!(i+a<=-1||r<=i+a))for(let c=-1;c<=7;c++)s+c<=-1||r<=s+c||(a>=0&&a<=6&&(c===0||c===6)||c>=0&&c<=6&&(a===0||a===6)||a>=2&&a<=4&&c>=2&&c<=4?e.set(i+a,s+c,!0,!0):e.set(i+a,s+c,!1,!0))}}function R2(e){let t=e.size;for(let r=8;r<t-8;r++){let o=r%2===0;e.set(r,6,o,!0),e.set(6,r,o,!0)}}function $2(e,t){let r=I2.getPositions(t);for(let o=0;o<r.length;o++){let n=r[o][0],i=r[o][1];for(let s=-2;s<=2;s++)for(let a=-2;a<=2;a++)s===-2||s===2||a===-2||a===2||s===0&&a===0?e.set(n+s,i+a,!0,!0):e.set(n+s,i+a,!1,!0)}}function L2(e,t){let r=e.size,o=Hs.getEncodedBits(t),n,i,s;for(let a=0;a<18;a++)n=Math.floor(a/3),i=a%3+r-8-3,s=(o>>a&1)===1,e.set(n,i,s,!0),e.set(i,n,s,!0)}function ac(e,t,r){let o=e.size,n=O2.getEncodedBits(t,r),i,s;for(i=0;i<15;i++)s=(n>>i&1)===1,i<6?e.set(i,8,s,!0):i<8?e.set(i+1,8,s,!0):e.set(o-15+i,8,s,!0),i<8?e.set(8,o-i-1,s,!0):i<9?e.set(8,15-i-1+1,s,!0):e.set(8,15-i-1,s,!0);e.set(o-8,8,1,!0)}function B2(e,t){let r=e.size,o=-1,n=r-1,i=7,s=0;for(let a=r-1;a>0;a-=2)for(a===6&&a--;;){for(let c=0;c<2;c++)if(!e.isReserved(n,a-c)){let l=!1;s<t.length&&(l=(t[s]>>>i&1)===1),e.set(n,a-c,l),i--,i===-1&&(s++,i=7)}if(n+=o,n<0||r<=n){n-=o,o=-o;break}}}function M2(e,t,r){let o=new A2;r.forEach(function(c){o.put(c.mode.bit,4),o.put(c.getLength(),T2.getCharCountIndicator(c.mode,e)),c.write(o)});let n=ta.getSymbolTotalCodewords(e),i=_l.getTotalCodewordsCount(e,t),s=(n-i)*8;for(o.getLengthInBits()+4<=s&&o.put(0,4);o.getLengthInBits()%8!==0;)o.putBit(0);let a=(s-o.getLengthInBits())/8;for(let c=0;c<a;c++)o.put(c%2?17:236,8);return U2(o,e,t)}function U2(e,t,r){let o=ta.getSymbolTotalCodewords(t),n=_l.getTotalCodewordsCount(t,r),i=o-n,s=_l.getBlocksCount(t,r),a=o%s,c=s-a,l=Math.floor(o/s),d=Math.floor(i/s),u=d+1,h=l-d,p=new _2(h),w=0,b=new Array(s),v=new Array(s),m=0,x=new Uint8Array(e.buffer);for(let j=0;j<s;j++){let R=j<c?d:u;b[j]=x.slice(w,w+R),v[j]=p.encode(b[j]),w+=R,m=Math.max(m,R)}let C=new Uint8Array(o),E=0,I,S;for(I=0;I<m;I++)for(S=0;S<s;S++)I<b[S].length&&(C[E++]=b[S][I]);for(I=0;I<h;I++)for(S=0;S<s;S++)C[E++]=v[S][I];return C}function z2(e,t,r,o){let n;if(Array.isArray(e))n=sc.fromArray(e);else if(typeof e=="string"){let l=t;if(!l){let d=sc.rawSplit(e);l=Hs.getBestVersionForData(d,r)}n=sc.fromString(e,l||40)}else throw new Error("Invalid data");let i=Hs.getBestVersionForData(n,r);if(!i)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=i;else if(t<i)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+i+`.
`);let s=M2(t,r,n),a=ta.getSymbolSize(t),c=new N2(a);return P2(c,t),R2(c),$2(c,t),ac(c,r,0),t>=7&&L2(c,t),B2(c,s),isNaN(o)&&(o=Sl.getBestMask(c,ac.bind(null,c,r))),Sl.applyMask(o,c),ac(c,r,o),{modules:c,version:t,errorCorrectionLevel:r,maskPattern:o,segments:n}}Qu.create=function(e,t){if(typeof e>"u"||e==="")throw new Error("No input text");let r=ic.M,o,n;return typeof t<"u"&&(r=ic.from(t.errorCorrectionLevel,ic.M),o=Hs.from(t.version),n=Sl.from(t.maskPattern),t.toSJISFunc&&ta.setToSJISFunction(t.toSJISFunc)),z2(e,o,r,n)};var d1={},Ol={};(function(e){function t(r){if(typeof r=="number"&&(r=r.toString()),typeof r!="string")throw new Error("Color should be defined as hex string");let o=r.slice().replace("#","").split("");if(o.length<3||o.length===5||o.length>8)throw new Error("Invalid hex color: "+r);(o.length===3||o.length===4)&&(o=Array.prototype.concat.apply([],o.map(function(i){return[i,i]}))),o.length===6&&o.push("F","F");let n=parseInt(o.join(""),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:"#"+o.slice(0,6).join("")}}e.getOptions=function(r){r||(r={}),r.color||(r.color={});let o=typeof r.margin>"u"||r.margin===null||r.margin<0?4:r.margin,n=r.width&&r.width>=21?r.width:void 0,i=r.scale||4;return{width:n,scale:n?4:i,margin:o,color:{dark:t(r.color.dark||"#000000ff"),light:t(r.color.light||"#ffffffff")},type:r.type,rendererOpts:r.rendererOpts||{}}},e.getScale=function(r,o){return o.width&&o.width>=r+o.margin*2?o.width/(r+o.margin*2):o.scale},e.getImageWidth=function(r,o){let n=e.getScale(r,o);return Math.floor((r+o.margin*2)*n)},e.qrToImageData=function(r,o,n){let i=o.modules.size,s=o.modules.data,a=e.getScale(i,n),c=Math.floor((i+n.margin*2)*a),l=n.margin*a,d=[n.color.light,n.color.dark];for(let u=0;u<c;u++)for(let h=0;h<c;h++){let p=(u*c+h)*4,w=n.color.light;if(u>=l&&h>=l&&u<c-l&&h<c-l){let b=Math.floor((u-l)/a),v=Math.floor((h-l)/a);w=d[s[b*i+v]?1:0]}r[p++]=w.r,r[p++]=w.g,r[p++]=w.b,r[p]=w.a}}})(Ol),function(e){let t=Ol;function r(n,i,s){n.clearRect(0,0,i.width,i.height),i.style||(i.style={}),i.height=s,i.width=s,i.style.height=s+"px",i.style.width=s+"px"}function o(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}e.render=function(n,i,s){let a=s,c=i;typeof a>"u"&&(!i||!i.getContext)&&(a=i,i=void 0),i||(c=o()),a=t.getOptions(a);let l=t.getImageWidth(n.modules.size,a),d=c.getContext("2d"),u=d.createImageData(l,l);return t.qrToImageData(u.data,n,a),r(d,c,l),d.putImageData(u,0,0),c},e.renderToDataURL=function(n,i,s){let a=s;typeof a>"u"&&(!i||!i.getContext)&&(a=i,i=void 0),a||(a={});let c=e.render(n,i,a),l=a.type||"image/png",d=a.rendererOpts||{};return c.toDataURL(l,d.quality)}}(d1);var u1={},D2=Ol;function y0(e,t){let r=e.a/255,o=t+'="'+e.hex+'"';return r<1?o+" "+t+'-opacity="'+r.toFixed(2).slice(1)+'"':o}function cc(e,t,r){let o=e+t;return typeof r<"u"&&(o+=" "+r),o}function j2(e,t,r){let o="",n=0,i=!1,s=0;for(let a=0;a<e.length;a++){let c=Math.floor(a%t),l=Math.floor(a/t);!c&&!i&&(i=!0),e[a]?(s++,a>0&&c>0&&e[a-1]||(o+=i?cc("M",c+r,.5+l+r):cc("m",n,0),n=0,i=!1),c+1<t&&e[a+1]||(o+=cc("h",s),s=0)):n++}return o}u1.render=function(e,t,r){let o=D2.getOptions(t),n=e.modules.size,i=e.modules.data,s=n+o.margin*2,a=o.color.light.a?"<path "+y0(o.color.light,"fill")+' d="M0 0h'+s+"v"+s+'H0z"/>':"",c="<path "+y0(o.color.dark,"stroke")+' d="'+j2(i,n,o.margin)+'"/>',l='viewBox="0 0 '+s+" "+s+'"',d='<svg xmlns="http://www.w3.org/2000/svg" '+(o.width?'width="'+o.width+'" height="'+o.width+'" ':"")+l+' shape-rendering="crispEdges">'+a+c+`</svg>
`;return typeof r=="function"&&r(null,d),d};var W2=r2,Tl=Qu,C0=d1,H2=u1;function lc(e,t,r,o,n){let i=[].slice.call(arguments,1),s=i.length,a=typeof i[s-1]=="function";if(!a&&!W2())throw new Error("Callback required as last argument");if(a){if(s<2)throw new Error("Too few arguments provided");s===2?(n=r,r=t,t=o=void 0):s===3&&(t.getContext&&typeof n>"u"?(n=o,o=void 0):(n=o,o=r,r=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(r=t,t=o=void 0):s===2&&!t.getContext&&(o=r,r=t,t=void 0),new Promise(function(c,l){try{let d=Tl.create(r,o);c(e(d,t,o))}catch(d){l(d)}})}try{let c=Tl.create(r,o);n(null,e(c,t,o))}catch(c){n(c)}}bn.create=Tl.create,bn.toCanvas=lc.bind(null,C0.render),bn.toDataURL=lc.bind(null,C0.renderToDataURL),bn.toString=lc.bind(null,function(e,t,r){return H2.render(e,r)});var F2=.1,x0=2.5,qt=7;function dc(e,t,r){return e===t?!1:(e-t<0?t-e:e-t)<=r+F2}function V2(e,t){let r=Array.prototype.slice.call(bn.create(e,{errorCorrectionLevel:t}).modules.data,0),o=Math.sqrt(r.length);return r.reduce((n,i,s)=>(s%o===0?n.push([i]):n[n.length-1].push(i))&&n,[])}var Z2={generate({uri:e,size:t,logoSize:r,dotColor:o="#141414"}){let n="transparent",i=[],s=V2(e,"Q"),a=t/s.length,c=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];c.forEach(({x:w,y:b})=>{let v=(s.length-qt)*a*w,m=(s.length-qt)*a*b,x=.45;for(let C=0;C<c.length;C+=1){let E=a*(qt-C*2);i.push(U`
            <rect
              fill=${C===2?o:n}
              width=${C===0?E-5:E}
              rx= ${C===0?(E-5)*x:E*x}
              ry= ${C===0?(E-5)*x:E*x}
              stroke=${o}
              stroke-width=${C===0?5:0}
              height=${C===0?E-5:E}
              x= ${C===0?m+a*C+5/2:m+a*C}
              y= ${C===0?v+a*C+5/2:v+a*C}
            />
          `)}});let l=Math.floor((r+25)/a),d=s.length/2-l/2,u=s.length/2+l/2-1,h=[];s.forEach((w,b)=>{w.forEach((v,m)=>{if(s[b][m]&&!(b<qt&&m<qt||b>s.length-(qt+1)&&m<qt||b<qt&&m>s.length-(qt+1))&&!(b>d&&b<u&&m>d&&m<u)){let x=b*a+a/2,C=m*a+a/2;h.push([x,C])}})});let p={};return h.forEach(([w,b])=>{p[w]?p[w]?.push(b):p[w]=[b]}),Object.entries(p).map(([w,b])=>{let v=b.filter(m=>b.every(x=>!dc(m,x,a)));return[Number(w),v]}).forEach(([w,b])=>{b.forEach(v=>{i.push(U`<circle cx=${w} cy=${v} fill=${o} r=${a/x0} />`)})}),Object.entries(p).filter(([w,b])=>b.length>1).map(([w,b])=>{let v=b.filter(m=>b.some(x=>dc(m,x,a)));return[Number(w),v]}).map(([w,b])=>{b.sort((m,x)=>m<x?-1:1);let v=[];for(let m of b){let x=v.find(C=>C.some(E=>dc(m,E,a)));x?x.push(m):v.push([m])}return[w,v.map(m=>[m[0],m[m.length-1]])]}).forEach(([w,b])=>{b.forEach(([v,m])=>{i.push(U`
              <line
                x1=${w}
                x2=${w}
                y1=${v}
                y2=${m}
                stroke=${o}
                stroke-width=${a/(x0/2)}
                stroke-linecap="round"
              />
            `)})}),i}},q2=ee`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
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
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`,Gt=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},G2="#3396ff",At=class extends F{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`
     --local-size: ${this.size}px;
     --local-icon-color: ${this.color??G2}
    `,f`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){let e=this.theme==="light"?this.size:this.size-32;return U`
      <svg height=${e} width=${e}>
        ${Z2.generate({uri:this.uri,size:e,logoSize:this.arenaClear?0:e/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?f`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?f`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:f`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};At.styles=[pe,q2],Gt([y()],At.prototype,"uri",void 0),Gt([y({type:Number})],At.prototype,"size",void 0),Gt([y()],At.prototype,"theme",void 0),Gt([y()],At.prototype,"imageSrc",void 0),Gt([y()],At.prototype,"alt",void 0),Gt([y()],At.prototype,"color",void 0),Gt([y({type:Boolean})],At.prototype,"arenaClear",void 0),Gt([y({type:Boolean})],At.prototype,"farcaster",void 0),At=Gt([Z("wui-qr-code")],At);var K2=ee`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  :host([variant='light']) {
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-150) 5%,
      var(--wui-color-bg-150) 48%,
      var(--wui-color-bg-200) 55%,
      var(--wui-color-bg-200) 60%,
      var(--wui-color-bg-200) calc(60% + 10px),
      var(--wui-color-bg-150) calc(60% + 12px),
      var(--wui-color-bg-150) 100%
    );
    background-size: 250%;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`,cn=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Tr=class extends F{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m",this.variant="default"}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
      border-radius: ${`clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px)`};
    `,f`<slot></slot>`}};Tr.styles=[K2],cn([y()],Tr.prototype,"width",void 0),cn([y()],Tr.prototype,"height",void 0),cn([y()],Tr.prototype,"borderRadius",void 0),cn([y()],Tr.prototype,"variant",void 0),Tr=cn([Z("wui-shimmer")],Tr);var Y2=ee`
  .reown-logo {
    height: var(--wui-spacing-xxl);
  }
`,J2=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},uc=class extends F{render(){return f`
      <wui-flex
        justifyContent="center"
        alignItems="center"
        gap="xs"
        .padding=${["0","0","l","0"]}
      >
        <wui-text variant="small-500" color="fg-100"> UX by </wui-text>
        <wui-icon name="reown" size="xxxl" class="reown-logo"></wui-icon>
      </wui-flex>
    `}};uc.styles=[pe,ze,Y2],uc=J2([Z("wui-ux-by-reown")],uc);var X2=ee`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }
`,Q2=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},hc=class extends Oe{constructor(){super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),ce.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode"}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(e=>e()),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),f`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","xl","xl","xl"]}
        gap="xl"
      >
        <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

        <wui-text variant="paragraph-500" color="fg-100">
          Scan this QR Code with your phone
        </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let e=this.getBoundingClientRect().width-40,t=this.wallet?this.wallet.name:void 0;return Y.setWcLinking(void 0),Y.setRecentWallet(this.wallet),f` <wui-qr-code
      size=${e}
      theme=${Pe.state.themeMode}
      uri=${this.uri}
      imageSrc=${Q($e.getWalletImage(this.wallet))}
      color=${Q(Pe.state.themeVariables["--w3m-qr-color"])}
      alt=${Q(t)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let e=!this.uri||!this.ready;return f`<wui-link
      .disabled=${e}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}};hc.styles=X2,hc=Q2([Z("w3m-connecting-wc-qrcode")],hc);var em=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},E0=class extends F{constructor(){if(super(),this.wallet=D.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");ce.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}render(){return f`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${Q($e.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};E0=em([Z("w3m-connecting-wc-unsupported")],E0);var k0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},pc=class extends Oe{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel="Open and continue in a new browser tab",this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(Y.subscribeKey("wcUri",()=>{this.updateLoadingState()})),ce.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web"}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:e,name:t}=this.wallet,{redirect:r,href:o}=M.formatUniversalUrl(e,this.uri);Y.setWcLinking({name:t,href:o}),Y.setRecentWallet(this.wallet),M.openHref(r,"_blank")}catch{this.error=!0}}};k0([V()],pc.prototype,"isLoading",void 0),pc=k0([Z("w3m-connecting-wc-web")],pc);var is=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},ln=class extends F{constructor(){super(),this.wallet=D.state.data?.wallet,this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!O.state.siwx,this.determinePlatforms(),this.initializeConnection()}render(){return f`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
      <wui-ux-by-reown></wui-ux-by-reown>
    `}async initializeConnection(e=!1){if(!(this.platform==="browser"||O.state.manualWCControl&&!e))try{let{wcPairingExpiry:t,status:r}=Y.state;(e||O.state.enableEmbedded||M.isPairingExpired(t)||r==="connecting")&&(await Y.connectWalletConnect(),this.isSiwxEnabled||de.close())}catch(t){ce.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),Y.setWcError(!0),Ce.showError(t.message??"Connection error"),Y.resetWcConnection(),D.goBack()}}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:e,desktop_link:t,webapp_link:r,injected:o,rdns:n}=this.wallet,i=o?.map(({injected_id:p})=>p).filter(Boolean),s=[...n?[n]:i??[]],a=O.state.isUniversalProvider?!1:s.length,c=e,l=r,d=Y.checkInstalled(s),u=a&&d,h=t&&!M.isMobile();u&&!g.state.noAdapters&&this.platforms.push("browser"),c&&this.platforms.push(M.isMobile()?"mobile":"qrcode"),l&&this.platforms.push("web"),h&&this.platforms.push("desktop"),!u&&a&&!g.state.noAdapters&&this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return f`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return f`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return f`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return f`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return f`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return f`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?f`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}async onSelectPlatform(e){let t=this.shadowRoot?.querySelector("div");t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=e,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}};is([V()],ln.prototype,"platform",void 0),is([V()],ln.prototype,"platforms",void 0),is([V()],ln.prototype,"isSiwxEnabled",void 0),ln=is([Z("w3m-connecting-wc-view")],ln);var A0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},fs=class extends F{constructor(){super(...arguments),this.isMobile=M.isMobile()}render(){if(this.isMobile){let{featured:e,recommended:t}=W.state,{customWallets:r}=O.state,o=q.getRecentWallets(),n=e.length||t.length||r?.length||o.length;return f`<wui-flex
        flexDirection="column"
        gap="xs"
        .margin=${["3xs","s","s","s"]}
      >
        ${n?f`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return f`<wui-flex flexDirection="column" .padding=${["0","0","l","0"]}>
      <w3m-connecting-wc-view></w3m-connecting-wc-view>
      <wui-flex flexDirection="column" .padding=${["0","m","0","m"]}>
        <w3m-all-wallets-widget></w3m-all-wallets-widget> </wui-flex
    ></wui-flex>`}};A0([V()],fs.prototype,"isMobile",void 0),fs=A0([Z("w3m-connecting-wc-basic-view")],fs);var Xl=()=>new Pl,Pl=class{},gc=new WeakMap,Ql=Jl(class extends js{render(e){return Ie}update(e,[t]){let r=t!==this.G;return r&&this.G!==void 0&&this.rt(void 0),(r||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),Ie}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){let t=this.ht??globalThis,r=gc.get(t);r===void 0&&(r=new WeakMap,gc.set(t,r)),r.get(this.G)!==void 0&&this.G.call(this.ht,void 0),r.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?gc.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),tm=ee`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 22px;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--wui-color-blue-100);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-002);
    border-radius: 999px;
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color;
  }

  span:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
    background-color: var(--wui-color-inverse-100);
    transition: transform var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    will-change: transform;
    border-radius: 50%;
  }

  input:checked + span {
    border-color: var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-blue-100);
  }

  input:not(:checked) + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }
`,N0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},ss=class extends F{constructor(){super(...arguments),this.inputElementRef=Xl(),this.checked=void 0}render(){return f`
      <label>
        <input
          ${Ql(this.inputElementRef)}
          type="checkbox"
          ?checked=${Q(this.checked)}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};ss.styles=[pe,ze,li,tm],N0([y({type:Boolean})],ss.prototype,"checked",void 0),ss=N0([Z("wui-switch")],ss);var rm=ee`
  :host {
    height: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--wui-spacing-1xs);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`,I0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},as=class extends F{constructor(){super(...arguments),this.checked=void 0}render(){return f`
      <button>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-switch ?checked=${Q(this.checked)}></wui-switch>
      </button>
    `}};as.styles=[pe,ze,rm],I0([y({type:Boolean})],as.prototype,"checked",void 0),as=I0([Z("wui-certified-switch")],as);var om=ee`
  button {
    background-color: var(--wui-color-fg-300);
    border-radius: var(--wui-border-radius-4xs);
    width: 16px;
    height: 16px;
  }

  button:disabled {
    background-color: var(--wui-color-bg-300);
  }

  wui-icon {
    color: var(--wui-color-bg-200) !important;
  }

  button:focus-visible {
    background-color: var(--wui-color-fg-250);
    border: 1px solid var(--wui-color-accent-100);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-fg-250);
    }

    button:active:enabled {
      background-color: var(--wui-color-fg-225);
    }
  }
`,S0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},cs=class extends F{constructor(){super(...arguments),this.icon="copy"}render(){return f`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};cs.styles=[pe,ze,om],S0([y()],cs.prototype,"icon",void 0),cs=S0([Z("wui-input-element")],cs);var nm=ee`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  input {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
    color: var(--wui-color-fg-100);
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      box-shadow var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color, box-shadow;
    caret-color: var(--wui-color-accent-100);
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  input:disabled::placeholder,
  input:disabled + wui-icon {
    color: var(--wui-color-fg-300);
  }

  input::placeholder {
    color: var(--wui-color-fg-275);
  }

  input:focus:enabled {
    background-color: var(--wui-color-gray-glass-005);
    -webkit-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  input:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px var(--wui-spacing-s);
  }

  wui-icon + .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px 36px;
  }

  wui-icon[data-input='sm'] {
    left: var(--wui-spacing-s);
  }

  .wui-size-md {
    padding: 15px var(--wui-spacing-m) var(--wui-spacing-l) var(--wui-spacing-m);
  }

  wui-icon + .wui-size-md,
  wui-loading-spinner + .wui-size-md {
    padding: 10.5px var(--wui-spacing-3xl) 10.5px var(--wui-spacing-3xl);
  }

  wui-icon[data-input='md'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-lg {
    padding: var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-l);
    letter-spacing: var(--wui-letter-spacing-medium-title);
    font-size: var(--wui-font-size-medium-title);
    font-weight: var(--wui-font-weight-light);
    line-height: 130%;
    color: var(--wui-color-fg-100);
    height: 64px;
  }

  .wui-padding-right-xs {
    padding-right: var(--wui-spacing-xs);
  }

  .wui-padding-right-s {
    padding-right: var(--wui-spacing-s);
  }

  .wui-padding-right-m {
    padding-right: var(--wui-spacing-m);
  }

  .wui-padding-right-l {
    padding-right: var(--wui-spacing-l);
  }

  .wui-padding-right-xl {
    padding-right: var(--wui-spacing-xl);
  }

  .wui-padding-right-2xl {
    padding-right: var(--wui-spacing-2xl);
  }

  .wui-padding-right-3xl {
    padding-right: var(--wui-spacing-3xl);
  }

  .wui-padding-right-4xl {
    padding-right: var(--wui-spacing-4xl);
  }

  .wui-padding-right-5xl {
    padding-right: var(--wui-spacing-5xl);
  }

  wui-icon + .wui-size-lg,
  wui-loading-spinner + .wui-size-lg {
    padding-left: 50px;
  }

  wui-icon[data-input='lg'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-m) 17.25px var(--wui-spacing-m);
  }
  wui-icon + .wui-size-mdl,
  wui-loading-spinner + .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-3xl) 17.25px 40px;
  }
  wui-icon[data-input='mdl'] {
    left: var(--wui-spacing-m);
  }

  input:placeholder-shown ~ ::slotted(wui-input-element),
  input:placeholder-shown ~ ::slotted(wui-icon) {
    opacity: 0;
    pointer-events: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  ::slotted(wui-input-element),
  ::slotted(wui-icon) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  ::slotted(wui-input-element) {
    right: var(--wui-spacing-m);
  }

  ::slotted(wui-icon) {
    right: 0px;
  }
`,Pt=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},mt=class extends F{constructor(){super(...arguments),this.inputElementRef=Xl(),this.size="md",this.disabled=!1,this.placeholder="",this.type="text",this.value=""}render(){let e=`wui-padding-right-${this.inputRightPadding}`,t={[`wui-size-${this.size}`]:!0,[e]:!!this.inputRightPadding};return f`${this.templateIcon()}
      <input
        data-testid="wui-input-text"
        ${Ql(this.inputElementRef)}
        class=${Xu(t)}
        type=${this.type}
        enterkeyhint=${Q(this.enterKeyHint)}
        ?disabled=${this.disabled}
        placeholder=${this.placeholder}
        @input=${this.dispatchInputChangeEvent.bind(this)}
        .value=${this.value||""}
        tabindex=${Q(this.tabIdx)}
      />
      <slot></slot>`}templateIcon(){return this.icon?f`<wui-icon
        data-input=${this.size}
        size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};mt.styles=[pe,ze,nm],Pt([y()],mt.prototype,"size",void 0),Pt([y()],mt.prototype,"icon",void 0),Pt([y({type:Boolean})],mt.prototype,"disabled",void 0),Pt([y()],mt.prototype,"placeholder",void 0),Pt([y()],mt.prototype,"type",void 0),Pt([y()],mt.prototype,"keyHint",void 0),Pt([y()],mt.prototype,"value",void 0),Pt([y()],mt.prototype,"inputRightPadding",void 0),Pt([y()],mt.prototype,"tabIdx",void 0),mt=Pt([Z("wui-input-text")],mt);var im=ee`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`,sm=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},fc=class extends F{constructor(){super(...arguments),this.inputComponentRef=Xl()}render(){return f`
      <wui-input-text
        ${Ql(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){let e=this.inputComponentRef.value?.inputElementRef.value;e&&(e.value="",e.focus(),e.dispatchEvent(new Event("input")))}};fc.styles=[pe,im],fc=sm([Z("wui-search-bar")],fc);var am=U`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`,cm=ee`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) 10px;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--wui-path-network);
    clip-path: var(--wui-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: var(--wui-color-gray-glass-010);
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`,_0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},ls=class extends F{constructor(){super(...arguments),this.type="wallet"}render(){return f`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return this.type==="network"?f` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${am}`:f`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};ls.styles=[pe,ze,cm],_0([y()],ls.prototype,"type",void 0),ls=_0([Z("wui-card-select-loader")],ls);var lm=ee`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`,vt=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Qe=class extends F{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&Me.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&Me.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&Me.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&Me.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&Me.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&Me.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&Me.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&Me.getSpacingStyles(this.margin,3)};
    `,f`<slot></slot>`}};Qe.styles=[pe,lm],vt([y()],Qe.prototype,"gridTemplateRows",void 0),vt([y()],Qe.prototype,"gridTemplateColumns",void 0),vt([y()],Qe.prototype,"justifyItems",void 0),vt([y()],Qe.prototype,"alignItems",void 0),vt([y()],Qe.prototype,"justifyContent",void 0),vt([y()],Qe.prototype,"alignContent",void 0),vt([y()],Qe.prototype,"columnGap",void 0),vt([y()],Qe.prototype,"rowGap",void 0),vt([y()],Qe.prototype,"gap",void 0),vt([y()],Qe.prototype,"padding",void 0),vt([y()],Qe.prototype,"margin",void 0),Qe=vt([Z("wui-grid")],Qe);var dm=ee`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-s) var(--wui-spacing-0);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: var(--wui-color-fg-100);
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  button:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  [data-selected='true'] {
    background-color: var(--wui-color-accent-glass-020);
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }
  }

  [data-selected='true']:active:enabled {
    background-color: var(--wui-color-accent-glass-010);
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`,dn=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Pr=class extends F{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.wallet=void 0,this.observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting?(this.visible=!0,this.fetchImageSrc()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let e=this.wallet?.badge_type==="certified";return f`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="3xs">
          <wui-text
            variant="tiny-500"
            color="inherit"
            class=${Q(e?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${e?f`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():f`
      <wui-wallet-image
        size="md"
        imageSrc=${Q(this.imageSrc)}
        name=${this.wallet?.name}
        .installed=${this.wallet?.installed}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return f`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}async fetchImageSrc(){this.wallet&&(this.imageSrc=$e.getWalletImage(this.wallet),!this.imageSrc&&(this.imageLoading=!0,this.imageSrc=await $e.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))}};Pr.styles=dm,dn([V()],Pr.prototype,"visible",void 0),dn([V()],Pr.prototype,"imageSrc",void 0),dn([V()],Pr.prototype,"imageLoading",void 0),dn([y()],Pr.prototype,"wallet",void 0),Pr=dn([Z("w3m-all-wallets-list-item")],Pr);var um=ee`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    justify-content: center;
    grid-column: 1 / span 4;
  }
`,un=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},O0="local-paginator",Rr=class extends F{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!W.state.wallets.length,this.wallets=W.state.wallets,this.recommended=W.state.recommended,this.featured=W.state.featured,this.unsubscribe.push(W.subscribeKey("wallets",e=>this.wallets=e),W.subscribeKey("recommended",e=>this.recommended=e),W.subscribeKey("featured",e=>this.featured=e))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.paginationObserver?.disconnect()}render(){return f`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","s","s","s"]}
        columnGap="xxs"
        rowGap="l"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}async initialFetch(){this.loading=!0;let e=this.shadowRoot?.querySelector("wui-grid");e&&(await W.fetchWalletsByPage({page:1}),await e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}shimmerTemplate(e,t){return[...Array(e)].map(()=>f`
        <wui-card-select-loader type="wallet" id=${Q(t)}></wui-card-select-loader>
      `)}walletsTemplate(){let e=M.uniqueBy([...this.featured,...this.recommended,...this.wallets],"id");return ro.markWalletsAsInstalled(e).map(t=>f`
        <w3m-all-wallets-list-item
          @click=${()=>this.onConnectWallet(t)}
          .wallet=${t}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:e,recommended:t,featured:r,count:o}=W.state,n=window.innerWidth<352?3:4,i=e.length+t.length,s=Math.ceil(i/n)*n-i+n;return s-=e.length?r.length%n:0,o===0&&r.length>0?null:o===0||[...r,...e,...t].length<o?this.shimmerTemplate(s,O0):null}createPaginationObserver(){let e=this.shadowRoot?.querySelector(`#${O0}`);e&&(this.paginationObserver=new IntersectionObserver(([t])=>{if(t?.isIntersecting&&!this.loading){let{page:r,count:o,wallets:n}=W.state;n.length<o&&W.fetchWalletsByPage({page:r+1})}}),this.paginationObserver.observe(e))}onConnectWallet(e){H.selectWalletConnector(e)}};Rr.styles=um,un([V()],Rr.prototype,"loading",void 0),un([V()],Rr.prototype,"wallets",void 0),un([V()],Rr.prototype,"recommended",void 0),un([V()],Rr.prototype,"featured",void 0),Rr=un([Z("w3m-all-wallets-list")],Rr);var hm=ee`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`,ds=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},fo=class extends F{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?f`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}async onSearch(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,await W.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)}walletsTemplate(){let{search:e}=W.state,t=ro.markWalletsAsInstalled(e);return e.length?f`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","s","s","s"]}
        rowGap="l"
        columnGap="xs"
        justifyContent="space-between"
      >
        ${t.map(r=>f`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(r)}
              .wallet=${r}
              data-testid="wallet-search-item-${r.id}"
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:f`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="s"
          flexDirection="column"
        >
          <wui-icon-box
            size="lg"
            iconColor="fg-200"
            backgroundColor="fg-300"
            icon="wallet"
            background="transparent"
          ></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="fg-200" variant="paragraph-500">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(e){H.selectWalletConnector(e)}};fo.styles=hm,ds([V()],fo.prototype,"loading",void 0),ds([y()],fo.prototype,"query",void 0),ds([y()],fo.prototype,"badge",void 0),fo=ds([Z("w3m-all-wallets-search")],fo);var wc=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Cn=class extends F{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=M.debounce(e=>{this.search=e})}render(){let e=this.search.length>=2;return f`
      <wui-flex .padding=${["0","s","s","s"]} gap="xs">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge}
          @click=${this.onClick.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${e||this.badge?f`<w3m-all-wallets-search
            query=${this.search}
            badge=${Q(this.badge)}
          ></w3m-all-wallets-search>`:f`<w3m-all-wallets-list badge=${Q(this.badge)}></w3m-all-wallets-list>`}
    `}onInputChange(e){this.onDebouncedSearch(e.detail)}onClick(){if(this.badge==="certified"){this.badge=void 0;return}this.badge="certified",Ce.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})}qrButtonTemplate(){return M.isMobile()?f`
        <wui-icon-box
          size="lg"
          iconSize="xl"
          iconColor="accent-100"
          backgroundColor="accent-100"
          icon="qrCode"
          background="transparent"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){D.push("ConnectingWalletConnect")}};wc([V()],Cn.prototype,"search",void 0),wc([V()],Cn.prototype,"badge",void 0),Cn=wc([Z("w3m-all-wallets-view")],Cn);var pm=ee`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`,Nt=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},lt=class extends F{constructor(){super(...arguments),this.tabIdx=void 0,this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return f`
      <button
        ?disabled=${this.loading?!0:!!this.disabled}
        data-loading=${this.loading}
        data-iconvariant=${Q(this.iconVariant)}
        tabindex=${Q(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if(this.variant==="image"&&this.imageSrc)return f`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if(this.iconVariant==="square"&&this.icon&&this.variant==="icon")return f`<wui-icon name=${this.icon}></wui-icon>`;if(this.variant==="icon"&&this.icon&&this.iconVariant){let e=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",t=this.iconVariant==="square-blue"?"mdl":"md",r=this.iconSize?this.iconSize:t;return f`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${r}
          background="transparent"
          iconColor=${e}
          backgroundColor=${e}
          size=${t}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?f`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`:f``}chevronTemplate(){return this.chevron?f`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};lt.styles=[pe,ze,pm],Nt([y()],lt.prototype,"icon",void 0),Nt([y()],lt.prototype,"iconSize",void 0),Nt([y()],lt.prototype,"tabIdx",void 0),Nt([y()],lt.prototype,"variant",void 0),Nt([y()],lt.prototype,"iconVariant",void 0),Nt([y({type:Boolean})],lt.prototype,"disabled",void 0),Nt([y()],lt.prototype,"imageSrc",void 0),Nt([y()],lt.prototype,"alt",void 0),Nt([y({type:Boolean})],lt.prototype,"chevron",void 0),Nt([y({type:Boolean})],lt.prototype,"loading",void 0),lt=Nt([Z("wui-list-item")],lt);var gm=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Rl=class extends F{constructor(){super(...arguments),this.wallet=D.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return f`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?f`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?f`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?f`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?f`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){this.wallet?.chrome_store&&M.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){this.wallet?.app_store&&M.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&M.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&M.openHref(this.wallet.homepage,"_blank")}};Rl=gm([Z("w3m-downloads-view")],Rl);var fm=Object.freeze({__proto__:null,get W3mConnectingWcBasicView(){return fs},get W3mAllWalletsView(){return Cn},get W3mDownloadsView(){return Rl}}),wm=ee`
  :host {
    display: block;
    border-radius: clamp(0px, var(--wui-border-radius-l), 44px);
    box-shadow: 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-modal-bg);
    overflow: hidden;
  }

  :host([data-embedded='true']) {
    box-shadow:
      0 0 0 1px var(--wui-color-gray-glass-005),
      0px 4px 12px 4px var(--w3m-card-embedded-shadow-color);
  }
`,mm=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},mc=class extends F{render(){return f`<slot></slot>`}};mc.styles=[pe,wm],mc=mm([Z("wui-card")],mc);var vm=ee`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-dark-glass-100);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-325);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
  }

  wui-flex {
    width: 100%;
  }

  wui-text {
    word-break: break-word;
    flex: 1;
  }

  .close {
    cursor: pointer;
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: var(--wui-border-radius-3xs);
    background-color: var(--local-icon-bg-value);
  }
`,hn=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},$r=class extends F{constructor(){super(...arguments),this.message="",this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="info"}render(){return this.style.cssText=`
      --local-icon-bg-value: var(--wui-color-${this.backgroundColor});
   `,f`
      <wui-flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <wui-flex columnGap="xs" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color=${this.iconColor} size="md" name=${this.icon}></wui-icon>
          </wui-flex>
          <wui-text variant="small-500" color="bg-350" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="bg-350"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `}onClose(){wr.close()}};$r.styles=[pe,vm],hn([y()],$r.prototype,"message",void 0),hn([y()],$r.prototype,"backgroundColor",void 0),hn([y()],$r.prototype,"iconColor",void 0),hn([y()],$r.prototype,"icon",void 0),$r=hn([Z("wui-alertbar")],$r);var bm=ee`
  :host {
    display: block;
    position: absolute;
    top: var(--wui-spacing-s);
    left: var(--wui-spacing-l);
    right: var(--wui-spacing-l);
    opacity: 0;
    pointer-events: none;
  }
`,T0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},ym={info:{backgroundColor:"fg-350",iconColor:"fg-325",icon:"info"},success:{backgroundColor:"success-glass-reown-020",iconColor:"success-125",icon:"checkmark"},warning:{backgroundColor:"warning-glass-reown-020",iconColor:"warning-100",icon:"warningCircle"},error:{backgroundColor:"error-glass-reown-020",iconColor:"error-125",icon:"exclamationTriangle"}},us=class extends F{constructor(){super(),this.unsubscribe=[],this.open=wr.state.open,this.onOpen(!0),this.unsubscribe.push(wr.subscribeKey("open",e=>{this.open=e,this.onOpen(!1)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t}=wr.state,r=ym[t];return f`
      <wui-alertbar
        message=${e}
        backgroundColor=${r?.backgroundColor}
        iconColor=${r?.iconColor}
        icon=${r?.icon}
      ></wui-alertbar>
    `}onOpen(e){this.open?(this.animate([{opacity:0,transform:"scale(0.85)"},{opacity:1,transform:"scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: auto"):e||(this.animate([{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"}),this.style.cssText="pointer-events: none")}};us.styles=bm,T0([V()],us.prototype,"open",void 0),us=T0([Z("w3m-alertbar")],us);var Cm=ee`
  button {
    border-radius: var(--local-border-radius);
    color: var(--wui-color-fg-100);
    padding: var(--local-padding);
  }

  @media (max-width: 700px) {
    button {
      padding: var(--wui-spacing-s);
    }
  }

  button > wui-icon {
    pointer-events: none;
  }

  button:disabled > wui-icon {
    color: var(--wui-color-bg-300) !important;
  }

  button:disabled {
    background-color: transparent;
  }
`,pn=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Lr=class extends F{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){let e=this.size==="lg"?"--wui-border-radius-xs":"--wui-border-radius-xxs",t=this.size==="lg"?"--wui-spacing-1xs":"--wui-spacing-2xs";return this.style.cssText=`
    --local-border-radius: var(${e});
    --local-padding: var(${t});
`,f`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};Lr.styles=[pe,ze,li,Cm],pn([y()],Lr.prototype,"size",void 0),pn([y({type:Boolean})],Lr.prototype,"disabled",void 0),pn([y()],Lr.prototype,"icon",void 0),pn([y()],Lr.prototype,"iconColor",void 0),Lr=pn([Z("wui-icon-link")],Lr);var xm=ee`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: var(--wui-spacing-xxs);
    gap: var(--wui-spacing-xxs);
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-md);
    border-radius: var(--wui-border-radius-xxs);
  }

  wui-image {
    border-radius: 100%;
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  wui-icon-box {
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  button:active {
    background-color: var(--wui-color-gray-glass-005);
  }
`,P0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},hs=class extends F{constructor(){super(...arguments),this.imageSrc=""}render(){return f`<button>
      ${this.imageTemplate()}
      <wui-icon size="xs" color="fg-200" name="chevronBottom"></wui-icon>
    </button>`}imageTemplate(){return this.imageSrc?f`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`:f`<wui-icon-box
      size="xxs"
      iconColor="fg-200"
      backgroundColor="fg-100"
      background="opaque"
      icon="networkPlaceholder"
    ></wui-icon-box>`}};hs.styles=[pe,ze,li,xm],P0([y()],hs.prototype,"imageSrc",void 0),hs=P0([Z("wui-select")],hs);var Em=ee`
  :host {
    height: 64px;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards var(--wui-ease-out-power-2),
      slide-down-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards var(--wui-ease-out-power-2),
      slide-up-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-icon-link[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`,Rt=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},km=["SmartSessionList"];function vc(){let e=D.state.data?.connector?.name,t=D.state.data?.wallet?.name,r=D.state.data?.network?.name,o=t??e,n=H.getConnectors();return{Connect:`Connect ${n.length===1&&n[0]?.id==="w3m-email"?"Email":""} Wallet`,Create:"Create Wallet",ChooseAccountName:void 0,Account:void 0,AccountSettings:void 0,AllWallets:"All Wallets",ApproveTransaction:"Approve Transaction",BuyInProgress:"Buy",ConnectingExternal:o??"Connect Wallet",ConnectingWalletConnect:o??"WalletConnect",ConnectingWalletConnectBasic:"WalletConnect",ConnectingSiwe:"Sign In",Convert:"Convert",ConvertSelectToken:"Select token",ConvertPreview:"Preview convert",Downloads:o?`Get ${o}`:"Downloads",EmailLogin:"Email Login",EmailVerifyOtp:"Confirm Email",EmailVerifyDevice:"Register Device",GetWallet:"Get a wallet",Networks:"Choose Network",OnRampProviders:"Choose Provider",OnRampActivity:"Activity",OnRampTokenSelect:"Select Token",OnRampFiatSelect:"Select Currency",Profile:void 0,SwitchNetwork:r??"Switch Network",SwitchAddress:"Switch Address",Transactions:"Activity",UnsupportedChain:"Switch Network",UpgradeEmailWallet:"Upgrade your Wallet",UpdateEmailWallet:"Edit Email",UpdateEmailPrimaryOtp:"Confirm Current Email",UpdateEmailSecondaryOtp:"Confirm New Email",WhatIsABuy:"What is Buy?",RegisterAccountName:"Choose name",RegisterAccountNameSuccess:"",WalletReceive:"Receive",WalletCompatibleNetworks:"Compatible Networks",Swap:"Swap",SwapSelectToken:"Select token",SwapPreview:"Preview swap",WalletSend:"Send",WalletSendPreview:"Review send",WalletSendSelectToken:"Select Token",WhatIsANetwork:"What is a network?",WhatIsAWallet:"What is a wallet?",ConnectWallets:"Connect wallet",ConnectSocials:"All socials",ConnectingSocial:J.state.socialProvider?J.state.socialProvider:"Connect Social",ConnectingMultiChain:"Select chain",ConnectingFarcaster:"Farcaster",SwitchActiveChain:"Switch chain",SmartSessionCreated:void 0,SmartSessionList:"Smart Sessions",SIWXSignMessage:"Sign In"}}var bt=class extends F{constructor(){super(),this.unsubscribe=[],this.heading=vc()[D.state.view],this.network=g.state.activeCaipNetwork,this.networkImage=$e.getNetworkImage(this.network),this.buffering=!1,this.showBack=!1,this.prevHistoryLength=1,this.view=D.state.view,this.viewDirection="",this.headerText=vc()[D.state.view],this.unsubscribe.push(tt.subscribeNetworkImages(()=>{this.networkImage=$e.getNetworkImage(this.network)}),D.subscribeKey("view",e=>{setTimeout(()=>{this.view=e,this.headerText=vc()[e]},fr.ANIMATION_DURATIONS.HeaderText),this.onViewChange(),this.onHistoryChange()}),Y.subscribeKey("buffering",e=>this.buffering=e),g.subscribeKey("activeCaipNetwork",e=>{this.network=e,this.networkImage=$e.getNetworkImage(this.network)}))}disconnectCallback(){this.unsubscribe.forEach(e=>e())}render(){return f`
      <wui-flex .padding=${this.getPadding()} justifyContent="space-between" alignItems="center">
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `}onWalletHelp(){ce.sendEvent({type:"track",event:"CLICK_WALLET_HELP"}),D.push("WhatIsAWallet")}async onClose(){D.state.view==="UnsupportedChain"||await mr.isSIWXCloseDisabled()?de.shake():de.close()}rightHeaderTemplate(){let e=O?.state?.features?.smartSessions;return D.state.view!=="Account"||!e?this.closeButtonTemplate():f`<wui-flex>
      <wui-icon-link
        icon="clock"
        @click=${()=>D.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-link>
      ${this.closeButtonTemplate()}
    </wui-flex> `}closeButtonTemplate(){return f`
      <wui-icon-link
        ?disabled=${this.buffering}
        icon="close"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-link>
    `}titleTemplate(){let e=km.includes(this.view);return f`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="xs"
      >
        <wui-text variant="paragraph-700" color="fg-100" data-testid="w3m-header-text"
          >${this.headerText}</wui-text
        >
        ${e?f`<wui-tag variant="main">Beta</wui-tag>`:null}
      </wui-flex>
    `}leftHeaderTemplate(){let{view:e}=D.state,t=e==="Connect",r=O.state.enableEmbedded,o=e==="ApproveTransaction",n=e==="ConnectingSiwe",i=e==="Account",s=O.state.enableNetworkSwitch,a=o||n||t&&r;return i&&s?f`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${Q(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${Q(this.networkImage)}
      ></wui-select>`:this.showBack&&!a?f`<wui-icon-link
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        ?disabled=${this.buffering}
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-link>`:f`<wui-icon-link
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-link>`}onNetworks(){this.isAllowedNetworkSwitch()&&(ce.sendEvent({type:"track",event:"CLICK_NETWORKS"}),D.push("Networks"))}isAllowedNetworkSwitch(){let e=g.getAllRequestedCaipNetworks(),t=e?e.length>1:!1,r=e?.find(({id:o})=>o===this.network?.id);return t||!r}getPadding(){return this.heading?["l","2l","l","2l"]:["0","2l","0","2l"]}onViewChange(){let{history:e}=D.state,t=fr.VIEW_DIRECTION.Next;e.length<this.prevHistoryLength&&(t=fr.VIEW_DIRECTION.Prev),this.prevHistoryLength=e.length,this.viewDirection=t}async onHistoryChange(){let{history:e}=D.state,t=this.shadowRoot?.querySelector("#dynamic");e.length>1&&!this.showBack&&t?(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!0,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"})):e.length<=1&&this.showBack&&t&&(await t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.showBack=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))}onGoBack(){D.goBack()}};bt.styles=Em,Rt([V()],bt.prototype,"heading",void 0),Rt([V()],bt.prototype,"network",void 0),Rt([V()],bt.prototype,"networkImage",void 0),Rt([V()],bt.prototype,"buffering",void 0),Rt([V()],bt.prototype,"showBack",void 0),Rt([V()],bt.prototype,"prevHistoryLength",void 0),Rt([V()],bt.prototype,"view",void 0),Rt([V()],bt.prototype,"viewDirection",void 0),Rt([V()],bt.prototype,"headerText",void 0),bt=Rt([Z("w3m-header")],bt);var Am=ee`
  :host {
    display: flex;
    column-gap: var(--wui-spacing-s);
    align-items: center;
    padding: var(--wui-spacing-xs) var(--wui-spacing-m) var(--wui-spacing-xs) var(--wui-spacing-xs);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-gray-glass-005);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-175);
    box-shadow:
      0px 14px 64px -4px rgba(0, 0, 0, 0.15),
      0px 8px 22px -6px rgba(0, 0, 0, 0.15);

    max-width: 300px;
  }

  :host wui-loading-spinner {
    margin-left: var(--wui-spacing-3xs);
  }
`,Br=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Kt=class extends F{constructor(){super(...arguments),this.backgroundColor="accent-100",this.iconColor="accent-100",this.icon="checkmark",this.message="",this.loading=!1,this.iconType="default"}render(){return f`
      ${this.templateIcon()}
      <wui-text variant="paragraph-500" color="fg-100" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `}templateIcon(){return this.loading?f`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`:this.iconType==="default"?f`<wui-icon size="xl" color=${this.iconColor} name=${this.icon}></wui-icon>`:f`<wui-icon-box
      size="sm"
      iconSize="xs"
      iconColor=${this.iconColor}
      backgroundColor=${this.backgroundColor}
      icon=${this.icon}
      background="opaque"
    ></wui-icon-box>`}};Kt.styles=[pe,Am],Br([y()],Kt.prototype,"backgroundColor",void 0),Br([y()],Kt.prototype,"iconColor",void 0),Br([y()],Kt.prototype,"icon",void 0),Br([y()],Kt.prototype,"message",void 0),Br([y()],Kt.prototype,"loading",void 0),Br([y()],Kt.prototype,"iconType",void 0),Kt=Br([Z("wui-snackbar")],Kt);var Nm=ee`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`,R0=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Im={loading:void 0,success:{backgroundColor:"success-100",iconColor:"success-100",icon:"checkmark"},error:{backgroundColor:"error-100",iconColor:"error-100",icon:"close"}},ps=class extends F{constructor(){super(),this.unsubscribe=[],this.timeout=void 0,this.open=Ce.state.open,this.unsubscribe.push(Ce.subscribeKey("open",e=>{this.open=e,this.onOpen()}))}disconnectedCallback(){clearTimeout(this.timeout),this.unsubscribe.forEach(e=>e())}render(){let{message:e,variant:t,svg:r}=Ce.state,o=Im[t],{icon:n,iconColor:i}=r??o??{};return f`
      <wui-snackbar
        message=${e}
        backgroundColor=${o?.backgroundColor}
        iconColor=${i}
        icon=${n}
        .loading=${t==="loading"}
      ></wui-snackbar>
    `}onOpen(){clearTimeout(this.timeout),this.open?(this.animate([{opacity:0,transform:"translateX(-50%) scale(0.85)"},{opacity:1,transform:"translateX(-50%) scale(1)"}],{duration:150,fill:"forwards",easing:"ease"}),this.timeout&&clearTimeout(this.timeout),Ce.state.autoClose&&(this.timeout=setTimeout(()=>Ce.hide(),2500))):this.animate([{opacity:1,transform:"translateX(-50%) scale(1)"},{opacity:0,transform:"translateX(-50%) scale(0.85)"}],{duration:150,fill:"forwards",easing:"ease"})}};ps.styles=Nm,R0([V()],ps.prototype,"open",void 0),ps=R0([Z("w3m-snackbar")],ps);var Sm=ee`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    color: var(--wui-color-bg-100);
    position: fixed;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--w3m-modal-width) - var(--wui-spacing-xl));
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: var(--wui-color-bg-150);
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`,gn=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},Mr=class extends F{constructor(){super(),this.unsubscribe=[],this.open=wo.state.open,this.message=wo.state.message,this.triggerRect=wo.state.triggerRect,this.variant=wo.state.variant,this.unsubscribe.push(wo.subscribe(e=>{this.open=e.open,this.message=e.message,this.triggerRect=e.triggerRect,this.variant=e.variant}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){this.dataset.variant=this.variant;let e=this.triggerRect.top,t=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${e}px;
    --w3m-tooltip-left: ${t}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${this.open?1:0};
    `,f`<wui-flex>
      <wui-icon data-placement="top" color="fg-100" size="inherit" name="cursor"></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>
    </wui-flex>`}};Mr.styles=[Sm],gn([V()],Mr.prototype,"open",void 0),gn([V()],Mr.prototype,"message",void 0),gn([V()],Mr.prototype,"triggerRect",void 0),gn([V()],Mr.prototype,"variant",void 0),Mr=gn([Z("w3m-tooltip"),Z("w3m-tooltip")],Mr);var _m=ee`
  :host {
    --prev-height: 0px;
    --new-height: 0px;
    display: block;
  }

  div.w3m-router-container {
    transform: translateY(0);
    opacity: 1;
  }

  div.w3m-router-container[view-direction='prev'] {
    animation:
      slide-left-out 150ms forwards ease,
      slide-left-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  div.w3m-router-container[view-direction='next'] {
    animation:
      slide-right-out 150ms forwards ease,
      slide-right-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(10px);
      opacity: 0;
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(-10px);
      opacity: 0;
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`,bc=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},fn=class extends F{constructor(){super(),this.resizeObserver=void 0,this.prevHeight="0px",this.prevHistoryLength=1,this.unsubscribe=[],this.view=D.state.view,this.viewDirection="",this.unsubscribe.push(D.subscribeKey("view",e=>this.onViewChange(e)))}firstUpdated(){this.resizeObserver=new ResizeObserver(([e])=>{let t=`${e?.contentRect.height}px`;this.prevHeight!=="0px"&&(this.style.setProperty("--prev-height",this.prevHeight),this.style.setProperty("--new-height",t),this.style.animation="w3m-view-height 150ms forwards ease",this.style.height="auto"),setTimeout(()=>{this.prevHeight=t,this.style.animation="unset"},fr.ANIMATION_DURATIONS.ModalHeight)}),this.resizeObserver?.observe(this.getWrapper())}disconnectedCallback(){this.resizeObserver?.unobserve(this.getWrapper()),this.unsubscribe.forEach(e=>e())}render(){return f`<div class="w3m-router-container" view-direction="${this.viewDirection}">
      ${this.viewTemplate()}
    </div>`}viewTemplate(){switch(this.view){case"AccountSettings":return f`<w3m-account-settings-view></w3m-account-settings-view>`;case"Account":return f`<w3m-account-view></w3m-account-view>`;case"AllWallets":return f`<w3m-all-wallets-view></w3m-all-wallets-view>`;case"ApproveTransaction":return f`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;case"BuyInProgress":return f`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;case"ChooseAccountName":return f`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;case"Connect":return f`<w3m-connect-view></w3m-connect-view>`;case"Create":return f`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;case"ConnectingWalletConnect":return f`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;case"ConnectingWalletConnectBasic":return f`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;case"ConnectingExternal":return f`<w3m-connecting-external-view></w3m-connecting-external-view>`;case"ConnectingSiwe":return f`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;case"ConnectWallets":return f`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;case"ConnectSocials":return f`<w3m-connect-socials-view></w3m-connect-socials-view>`;case"ConnectingSocial":return f`<w3m-connecting-social-view></w3m-connecting-social-view>`;case"Downloads":return f`<w3m-downloads-view></w3m-downloads-view>`;case"EmailLogin":return f`<w3m-email-login-view></w3m-email-login-view>`;case"EmailVerifyOtp":return f`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;case"EmailVerifyDevice":return f`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;case"GetWallet":return f`<w3m-get-wallet-view></w3m-get-wallet-view>`;case"Networks":return f`<w3m-networks-view></w3m-networks-view>`;case"SwitchNetwork":return f`<w3m-network-switch-view></w3m-network-switch-view>`;case"Profile":return f`<w3m-profile-view></w3m-profile-view>`;case"SwitchAddress":return f`<w3m-switch-address-view></w3m-switch-address-view>`;case"Transactions":return f`<w3m-transactions-view></w3m-transactions-view>`;case"OnRampProviders":return f`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;case"OnRampActivity":return f`<w3m-onramp-activity-view></w3m-onramp-activity-view>`;case"OnRampTokenSelect":return f`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;case"OnRampFiatSelect":return f`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;case"UpgradeEmailWallet":return f`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;case"UpdateEmailWallet":return f`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;case"UpdateEmailPrimaryOtp":return f`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;case"UpdateEmailSecondaryOtp":return f`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;case"UnsupportedChain":return f`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;case"Swap":return f`<w3m-swap-view></w3m-swap-view>`;case"SwapSelectToken":return f`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;case"SwapPreview":return f`<w3m-swap-preview-view></w3m-swap-preview-view>`;case"WalletSend":return f`<w3m-wallet-send-view></w3m-wallet-send-view>`;case"WalletSendSelectToken":return f`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;case"WalletSendPreview":return f`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;case"WhatIsABuy":return f`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;case"WalletReceive":return f`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;case"WalletCompatibleNetworks":return f`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;case"WhatIsAWallet":return f`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;case"ConnectingMultiChain":return f`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;case"WhatIsANetwork":return f`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;case"ConnectingFarcaster":return f`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;case"SwitchActiveChain":return f`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;case"RegisterAccountName":return f`<w3m-register-account-name-view></w3m-register-account-name-view>`;case"RegisterAccountNameSuccess":return f`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;case"SmartSessionCreated":return f`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;case"SmartSessionList":return f`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;case"SIWXSignMessage":return f`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;default:return f`<w3m-connect-view></w3m-connect-view>`}}onViewChange(e){wo.hide();let t=fr.VIEW_DIRECTION.Next,{history:r}=D.state;r.length<this.prevHistoryLength&&(t=fr.VIEW_DIRECTION.Prev),this.prevHistoryLength=r.length,this.viewDirection=t,setTimeout(()=>{this.view=e},fr.ANIMATION_DURATIONS.ViewTransition)}getWrapper(){return this.shadowRoot?.querySelector("div")}};fn.styles=_m,bc([V()],fn.prototype,"view",void 0),bc([V()],fn.prototype,"viewDirection",void 0),fn=bc([Z("w3m-router")],fn);var Om=ee`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  :host(.embedded) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation: zoom-in 0.2s var(--wui-ease-out-power-2);
    animation-fill-mode: backwards;
    outline: none;
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host(.embedded) wui-card {
    max-width: 400px;
  }

  wui-card[shake='true'] {
    animation:
      zoom-in 0.2s var(--wui-ease-out-power-2),
      w3m-shake 0.5s var(--wui-ease-out-power-2);
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: var(--local-border-bottom-mobile-radius);
      border-bottom-right-radius: var(--local-border-bottom-mobile-radius);
      border-bottom: none;
      animation: slide-in 0.2s var(--wui-ease-out-power-2);
    }

    wui-card[shake='true'] {
      animation:
        slide-in 0.2s var(--wui-ease-out-power-2),
        w3m-shake 0.5s var(--wui-ease-out-power-2);
    }
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes w3m-view-height {
    from {
      height: var(--prev-height);
    }
    to {
      height: var(--new-height);
    }
  }
`,Ur=function(e,t,r,o){var n=arguments.length,i=n<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,r):o,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")i=Reflect.decorate(e,t,r,o);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(i=(n<3?s(i):n>3?s(t,r,i):s(t,r))||i);return n>3&&i&&Object.defineProperty(t,r,i),i},$0="scroll-lock",$t=class extends F{constructor(){super(),this.unsubscribe=[],this.abortController=void 0,this.hasPrefetched=!1,this.enableEmbedded=O.state.enableEmbedded,this.open=de.state.open,this.caipAddress=g.state.activeCaipAddress,this.caipNetwork=g.state.activeCaipNetwork,this.shake=de.state.shake,this.filterByNamespace=H.state.filterByNamespace,this.initializeTheming(),W.prefetchAnalyticsConfig(),this.unsubscribe.push(de.subscribeKey("open",e=>e?this.onOpen():this.onClose()),de.subscribeKey("shake",e=>this.shake=e),g.subscribeKey("activeCaipNetwork",e=>this.onNewNetwork(e)),g.subscribeKey("activeCaipAddress",e=>this.onNewAddress(e)),O.subscribeKey("enableEmbedded",e=>this.enableEmbedded=e),H.subscribeKey("filterByNamespace",e=>{this.filterByNamespace!==e&&!g.getAccountData(e)?.caipAddress&&(W.fetchRecommendedWallets(),this.filterByNamespace=e)}))}firstUpdated(){if(this.caipAddress){if(this.enableEmbedded){de.close(),this.prefetch();return}this.onNewAddress(this.caipAddress)}this.open&&this.onOpen(),this.enableEmbedded&&this.prefetch()}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),this.onRemoveKeyboardListener()}render(){return this.style.cssText=`
      --local-border-bottom-mobile-radius: ${this.enableEmbedded?"clamp(0px, var(--wui-border-radius-l), 44px)":"0px"};
    `,this.enableEmbedded?f`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `:this.open?f`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `:null}contentTemplate(){return f` <wui-card
      shake="${this.shake}"
      data-embedded="${Q(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`}async onOverlayClick(e){e.target===e.currentTarget&&await this.handleClose()}async handleClose(){D.state.view==="UnsupportedChain"||await mr.isSIWXCloseDisabled()?de.shake():de.close()}initializeTheming(){let{themeVariables:e,themeMode:t}=Pe.state,r=Me.getColorTheme(t);Mf(e,r)}onClose(){this.open=!1,this.classList.remove("open"),this.onScrollUnlock(),Ce.hide(),this.onRemoveKeyboardListener()}onOpen(){this.open=!0,this.classList.add("open"),this.onScrollLock(),this.onAddKeyboardListener()}onScrollLock(){let e=document.createElement("style");e.dataset.w3m=$0,e.textContent=`
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `,document.head.appendChild(e)}onScrollUnlock(){let e=document.head.querySelector(`style[data-w3m="${$0}"]`);e&&e.remove()}onAddKeyboardListener(){this.abortController=new AbortController;let e=this.shadowRoot?.querySelector("wui-card");e?.focus(),window.addEventListener("keydown",t=>{if(t.key==="Escape")this.handleClose();else if(t.key==="Tab"){let{tagName:r}=t.target;r&&!r.includes("W3M-")&&!r.includes("WUI-")&&e?.focus()}},this.abortController)}onRemoveKeyboardListener(){this.abortController?.abort(),this.abortController=void 0}async onNewAddress(e){let t=g.state.isSwitchingNamespace,r=M.getPlainAddress(e);!r&&!t?de.close():t&&r&&D.goBack(),await mr.initializeIfEnabled(),this.caipAddress=e,g.setIsSwitchingNamespace(!1)}onNewNetwork(e){let t=this.caipNetwork,r=t?.caipNetworkId?.toString(),o=t?.chainNamespace,n=e?.caipNetworkId?.toString(),i=e?.chainNamespace,s=r!==n,a=s&&o===i,c=t?.name===G.UNSUPPORTED_NETWORK_NAME,l=D.state.view==="ConnectingExternal",d=!this.caipAddress,u=D.state.view==="UnsupportedChain",h=de.state.open,p=!1;h&&!l&&(d?s&&(p=!0):(u||a&&!c)&&(p=!0)),p&&D.state.view!=="SIWXSignMessage"&&D.goBack(),this.caipNetwork=e}prefetch(){this.hasPrefetched||(W.prefetch(),W.fetchWalletsByPage({page:1}),this.hasPrefetched=!0)}};$t.styles=Om,Ur([y({type:Boolean})],$t.prototype,"enableEmbedded",void 0),Ur([V()],$t.prototype,"open",void 0),Ur([V()],$t.prototype,"caipAddress",void 0),Ur([V()],$t.prototype,"caipNetwork",void 0),Ur([V()],$t.prototype,"shake",void 0),Ur([V()],$t.prototype,"filterByNamespace",void 0),$t=Ur([Z("w3m-modal")],$t);var Tm=Object.freeze({__proto__:null,get W3mModal(){return $t}}),Pm=U`<svg
  width="14"
  height="14"
  viewBox="0 0 14 14"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill="currentColor"
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M7.0023 0.875C7.48571 0.875 7.8776 1.26675 7.8776 1.75V6.125H12.2541C12.7375 6.125 13.1294 6.51675 13.1294 7C13.1294 7.48325 12.7375 7.875 12.2541 7.875H7.8776V12.25C7.8776 12.7332 7.48571 13.125 7.0023 13.125C6.51889 13.125 6.12701 12.7332 6.12701 12.25V7.875H1.75054C1.26713 7.875 0.875244 7.48325 0.875244 7C0.875244 6.51675 1.26713 6.125 1.75054 6.125H6.12701V1.75C6.12701 1.26675 6.51889 0.875 7.0023 0.875Z"
    fill="#667dff"
  /></svg
>`,Rm=Object.freeze({__proto__:null,addSvg:Pm}),$m=U`<svg fill="none" viewBox="0 0 24 24">
  <path
    style="fill: var(--wui-color-accent-100);"
    d="M10.2 6.6a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0ZM21 6.6a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0ZM10.2 17.4a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0ZM21 17.4a3.6 3.6 0 1 1-7.2 0 3.6 3.6 0 0 1 7.2 0Z"
  />
</svg>`,Lm=Object.freeze({__proto__:null,allWalletsSvg:$m}),Bm=U`<svg
  fill="none"
  viewBox="0 0 21 20"
>
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M10.5 2.42908C6.31875 2.42908 2.92859 5.81989 2.92859 10.0034C2.92859 14.1869 6.31875 17.5777 10.5 17.5777C14.6813 17.5777 18.0714 14.1869 18.0714 10.0034C18.0714 5.81989 14.6813 2.42908 10.5 2.42908ZM0.928589 10.0034C0.928589 4.71596 5.21355 0.429077 10.5 0.429077C15.7865 0.429077 20.0714 4.71596 20.0714 10.0034C20.0714 15.2908 15.7865 19.5777 10.5 19.5777C5.21355 19.5777 0.928589 15.2908 0.928589 10.0034ZM10.5 5.75003C11.0523 5.75003 11.5 6.19774 11.5 6.75003L11.5 10.8343L12.7929 9.54137C13.1834 9.15085 13.8166 9.15085 14.2071 9.54137C14.5976 9.9319 14.5976 10.5651 14.2071 10.9556L11.2071 13.9556C10.8166 14.3461 10.1834 14.3461 9.79291 13.9556L6.79291 10.9556C6.40239 10.5651 6.40239 9.9319 6.79291 9.54137C7.18343 9.15085 7.8166 9.15085 8.20712 9.54137L9.50002 10.8343L9.50002 6.75003C9.50002 6.19774 9.94773 5.75003 10.5 5.75003Z"
    clip-rule="evenodd"
  /></svg
>`,Mm=Object.freeze({__proto__:null,arrowBottomCircleSvg:Bm}),Um=U`
<svg width="36" height="36">
  <path
    d="M28.724 0H7.271A7.269 7.269 0 0 0 0 7.272v21.46A7.268 7.268 0 0 0 7.271 36H28.73A7.272 7.272 0 0 0 36 28.728V7.272A7.275 7.275 0 0 0 28.724 0Z"
    fill="url(#a)"
  />
  <path
    d="m17.845 8.271.729-1.26a1.64 1.64 0 1 1 2.843 1.638l-7.023 12.159h5.08c1.646 0 2.569 1.935 1.853 3.276H6.434a1.632 1.632 0 0 1-1.638-1.638c0-.909.73-1.638 1.638-1.638h4.176l5.345-9.265-1.67-2.898a1.642 1.642 0 0 1 2.844-1.638l.716 1.264Zm-6.317 17.5-1.575 2.732a1.64 1.64 0 1 1-2.844-1.638l1.17-2.025c1.323-.41 2.398-.095 3.249.931Zm13.56-4.954h4.262c.909 0 1.638.729 1.638 1.638 0 .909-.73 1.638-1.638 1.638h-2.367l1.597 2.772c.45.788.185 1.782-.602 2.241a1.642 1.642 0 0 1-2.241-.603c-2.69-4.666-4.711-8.159-6.052-10.485-1.372-2.367-.391-4.743.576-5.549 1.075 1.846 2.682 4.631 4.828 8.348Z"
    fill="#fff"
  />
  <defs>
    <linearGradient id="a" x1="18" y1="0" x2="18" y2="36" gradientUnits="userSpaceOnUse">
      <stop stop-color="#18BFFB" />
      <stop offset="1" stop-color="#2072F3" />
    </linearGradient>
  </defs>
</svg>`,zm=Object.freeze({__proto__:null,appStoreSvg:Um}),Dm=U`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#000" />
      <g clip-path="url(#c)">
        <path
          fill="#fff"
          d="M28.77 23.3c-.69 1.99-2.75 5.52-4.87 5.56-1.4.03-1.86-.84-3.46-.84-1.61 0-2.12.81-3.45.86-2.25.1-5.72-5.1-5.72-9.62 0-4.15 2.9-6.2 5.42-6.25 1.36-.02 2.64.92 3.47.92.83 0 2.38-1.13 4.02-.97.68.03 2.6.28 3.84 2.08-3.27 2.14-2.76 6.61.75 8.25ZM24.2 7.88c-2.47.1-4.49 2.69-4.2 4.84 2.28.17 4.47-2.39 4.2-4.84Z"
        />
      </g>
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
    <clipPath id="c"><path fill="#fff" d="M8 7.89h24v24H8z" /></clipPath>
  </defs>
</svg>`,jm=Object.freeze({__proto__:null,appleSvg:Dm}),Wm=U`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M7 1.99a1 1 0 0 1 1 1v7.58l2.46-2.46a1 1 0 0 1 1.41 1.42L7.7 13.69a1 1 0 0 1-1.41 0L2.12 9.53A1 1 0 0 1 3.54 8.1L6 10.57V3a1 1 0 0 1 1-1Z"
    clip-rule="evenodd"
  />
</svg>`,Hm=Object.freeze({__proto__:null,arrowBottomSvg:Wm}),Fm=U`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M13 7.99a1 1 0 0 1-1 1H4.4l2.46 2.46a1 1 0 1 1-1.41 1.41L1.29 8.7a1 1 0 0 1 0-1.41L5.46 3.1a1 1 0 0 1 1.41 1.42L4.41 6.99H12a1 1 0 0 1 1 1Z"
    clip-rule="evenodd"
  />
</svg>`,Vm=Object.freeze({__proto__:null,arrowLeftSvg:Fm}),Zm=U`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M1 7.99a1 1 0 0 1 1-1h7.58L7.12 4.53A1 1 0 1 1 8.54 3.1l4.16 4.17a1 1 0 0 1 0 1.41l-4.16 4.17a1 1 0 1 1-1.42-1.41l2.46-2.46H2a1 1 0 0 1-1-1Z"
    clip-rule="evenodd"
  />
</svg>`,qm=Object.freeze({__proto__:null,arrowRightSvg:Zm}),Gm=U`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M7 13.99a1 1 0 0 1-1-1V5.4L3.54 7.86a1 1 0 0 1-1.42-1.41L6.3 2.28a1 1 0 0 1 1.41 0l4.17 4.17a1 1 0 1 1-1.41 1.41L8 5.4v7.59a1 1 0 0 1-1 1Z"
    clip-rule="evenodd"
  />
</svg>`,Km=Object.freeze({__proto__:null,arrowTopSvg:Gm}),Ym=U`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="12"
  height="13"
  viewBox="0 0 12 13"
  fill="none"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M5.61391 1.57124C5.85142 1.42873 6.14813 1.42873 6.38564 1.57124L11.0793 4.38749C11.9179 4.89067 11.5612 6.17864 10.5832 6.17864H9.96398V10.0358H10.2854C10.6996 10.0358 11.0354 10.3716 11.0354 10.7858C11.0354 11.2 10.6996 11.5358 10.2854 11.5358H1.71416C1.29995 11.5358 0.964172 11.2 0.964172 10.7858C0.964172 10.3716 1.29995 10.0358 1.71416 10.0358H2.03558L2.03558 6.17864H1.41637C0.438389 6.17864 0.0816547 4.89066 0.920263 4.38749L5.61391 1.57124ZM3.53554 6.17864V10.0358H5.24979V6.17864H3.53554ZM6.74976 6.17864V10.0358H8.46401V6.17864H6.74976ZM8.64913 4.67864H3.35043L5.99978 3.089L8.64913 4.67864Z"
    fill="currentColor"
  /></svg
>`,Jm=Object.freeze({__proto__:null,bankSvg:Ym}),Xm=U`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M4 6.4a1 1 0 0 1-.46.89 6.98 6.98 0 0 0 .38 6.18A7 7 0 0 0 16.46 7.3a1 1 0 0 1-.47-.92 7 7 0 0 0-12 .03Zm-2.02-.5a9 9 0 1 1 16.03 8.2A9 9 0 0 1 1.98 5.9Z"
    clip-rule="evenodd"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M6.03 8.63c-1.46-.3-2.72-.75-3.6-1.35l-.02-.01-.14-.11a1 1 0 0 1 1.2-1.6l.1.08c.6.4 1.52.74 2.69 1 .16-.99.39-1.88.67-2.65.3-.79.68-1.5 1.15-2.02A2.58 2.58 0 0 1 9.99 1c.8 0 1.45.44 1.92.97.47.52.84 1.23 1.14 2.02.29.77.52 1.66.68 2.64a8 8 0 0 0 2.7-1l.26-.18h.48a1 1 0 0 1 .12 2c-.86.51-2.01.91-3.34 1.18a22.24 22.24 0 0 1-.03 3.19c1.45.29 2.7.73 3.58 1.31a1 1 0 0 1-1.1 1.68c-.6-.4-1.56-.76-2.75-1-.15.8-.36 1.55-.6 2.2-.3.79-.67 1.5-1.14 2.02-.47.53-1.12.97-1.92.97-.8 0-1.45-.44-1.91-.97a6.51 6.51 0 0 1-1.15-2.02c-.24-.65-.44-1.4-.6-2.2-1.18.24-2.13.6-2.73.99a1 1 0 1 1-1.1-1.67c.88-.58 2.12-1.03 3.57-1.31a22.03 22.03 0 0 1-.04-3.2Zm2.2-1.7c.15-.86.34-1.61.58-2.24.24-.65.51-1.12.76-1.4.25-.28.4-.29.42-.29.03 0 .17.01.42.3.25.27.52.74.77 1.4.23.62.43 1.37.57 2.22a19.96 19.96 0 0 1-3.52 0Zm-.18 4.6a20.1 20.1 0 0 1-.03-2.62 21.95 21.95 0 0 0 3.94 0 20.4 20.4 0 0 1-.03 2.63 21.97 21.97 0 0 0-3.88 0Zm.27 2c.13.66.3 1.26.49 1.78.24.65.51 1.12.76 1.4.25.28.4.29.42.29.03 0 .17-.01.42-.3.25-.27.52-.74.77-1.4.19-.5.36-1.1.49-1.78a20.03 20.03 0 0 0-3.35 0Z"
    clip-rule="evenodd"
  />
</svg>`,Qm=Object.freeze({__proto__:null,browserSvg:Xm}),e3=U`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="12"
  height="13"
  viewBox="0 0 12 13"
  fill="none"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M4.16072 2C4.17367 2 4.18665 2 4.19968 2L7.83857 2C8.36772 1.99998 8.82398 1.99996 9.19518 2.04018C9.5895 2.0829 9.97577 2.17811 10.3221 2.42971C10.5131 2.56849 10.6811 2.73647 10.8198 2.92749C11.0714 3.27379 11.1666 3.66007 11.2094 4.0544C11.2496 4.42561 11.2496 4.88188 11.2495 5.41105V7.58896C11.2496 8.11812 11.2496 8.57439 11.2094 8.94561C11.1666 9.33994 11.0714 9.72621 10.8198 10.0725C10.6811 10.2635 10.5131 10.4315 10.3221 10.5703C9.97577 10.8219 9.5895 10.9171 9.19518 10.9598C8.82398 11 8.36772 11 7.83856 11H4.16073C3.63157 11 3.17531 11 2.80411 10.9598C2.40979 10.9171 2.02352 10.8219 1.67722 10.5703C1.48621 10.4315 1.31824 10.2635 1.17946 10.0725C0.927858 9.72621 0.832652 9.33994 0.78993 8.94561C0.749713 8.5744 0.749733 8.11813 0.749757 7.58896L0.749758 5.45C0.749758 5.43697 0.749758 5.42399 0.749757 5.41104C0.749733 4.88188 0.749713 4.42561 0.78993 4.0544C0.832652 3.66007 0.927858 3.27379 1.17946 2.92749C1.31824 2.73647 1.48621 2.56849 1.67722 2.42971C2.02352 2.17811 2.40979 2.0829 2.80411 2.04018C3.17531 1.99996 3.63157 1.99998 4.16072 2ZM2.96567 3.53145C2.69897 3.56034 2.60687 3.60837 2.55888 3.64324C2.49521 3.6895 2.43922 3.74549 2.39296 3.80916C2.35809 3.85715 2.31007 3.94926 2.28117 4.21597C2.26629 4.35335 2.25844 4.51311 2.25431 4.70832H9.74498C9.74085 4.51311 9.733 4.35335 9.71812 4.21597C9.68922 3.94926 9.6412 3.85715 9.60633 3.80916C9.56007 3.74549 9.50408 3.6895 9.44041 3.64324C9.39242 3.60837 9.30031 3.56034 9.03362 3.53145C8.75288 3.50103 8.37876 3.5 7.79961 3.5H4.19968C3.62053 3.5 3.24641 3.50103 2.96567 3.53145ZM9.74956 6.20832H2.24973V7.55C2.24973 8.12917 2.25076 8.5033 2.28117 8.78404C2.31007 9.05074 2.35809 9.14285 2.39296 9.19084C2.43922 9.25451 2.49521 9.31051 2.55888 9.35677C2.60687 9.39163 2.69897 9.43966 2.96567 9.46856C3.24641 9.49897 3.62053 9.5 4.19968 9.5H7.79961C8.37876 9.5 8.75288 9.49897 9.03362 9.46856C9.30032 9.43966 9.39242 9.39163 9.44041 9.35677C9.50408 9.31051 9.56007 9.25451 9.60633 9.19084C9.6412 9.14285 9.68922 9.05075 9.71812 8.78404C9.74854 8.5033 9.74956 8.12917 9.74956 7.55V6.20832ZM6.74963 8C6.74963 7.58579 7.08541 7.25 7.49961 7.25H8.2496C8.6638 7.25 8.99958 7.58579 8.99958 8C8.99958 8.41422 8.6638 8.75 8.2496 8.75H7.49961C7.08541 8.75 6.74963 8.41422 6.74963 8Z"
    fill="currentColor"
  /></svg
>`,t3=Object.freeze({__proto__:null,cardSvg:e3}),r3=U`<svg
  width="28"
  height="28"
  viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M25.5297 4.92733C26.1221 5.4242 26.1996 6.30724 25.7027 6.89966L12.2836 22.8997C12.0316 23.2001 11.6652 23.3811 11.2735 23.3986C10.8817 23.4161 10.5006 23.2686 10.2228 22.9919L2.38218 15.1815C1.83439 14.6358 1.83268 13.7494 2.37835 13.2016C2.92403 12.6538 3.81046 12.6521 4.35825 13.1978L11.1183 19.9317L23.5573 5.10036C24.0542 4.50794 24.9372 4.43047 25.5297 4.92733Z"
    fill="currentColor"/>
</svg>
`,o3=Object.freeze({__proto__:null,checkmarkSvg:r3}),n3=U`<svg fill="none" viewBox="0 0 14 14">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M12.9576 2.23383C13.3807 2.58873 13.4361 3.21947 13.0812 3.64263L6.37159 11.6426C6.19161 11.8572 5.92989 11.9865 5.65009 11.999C5.3703 12.0115 5.09808 11.9062 4.89965 11.7085L0.979321 7.80331C0.588042 7.41354 0.586817 6.78038 0.976585 6.3891C1.36635 5.99782 1.99952 5.99659 2.3908 6.38636L5.53928 9.52268L11.5488 2.35742C11.9037 1.93426 12.5344 1.87893 12.9576 2.23383Z"
    clip-rule="evenodd"
  />
</svg>`,i3=Object.freeze({__proto__:null,checkmarkBoldSvg:n3}),s3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M1.46 4.96a1 1 0 0 1 1.41 0L8 10.09l5.13-5.13a1 1 0 1 1 1.41 1.41l-5.83 5.84a1 1 0 0 1-1.42 0L1.46 6.37a1 1 0 0 1 0-1.41Z"
    clip-rule="evenodd"
  />
</svg>`,a3=Object.freeze({__proto__:null,chevronBottomSvg:s3}),c3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M11.04 1.46a1 1 0 0 1 0 1.41L5.91 8l5.13 5.13a1 1 0 1 1-1.41 1.41L3.79 8.71a1 1 0 0 1 0-1.42l5.84-5.83a1 1 0 0 1 1.41 0Z"
    clip-rule="evenodd"
  />
</svg>`,l3=Object.freeze({__proto__:null,chevronLeftSvg:c3}),d3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M4.96 14.54a1 1 0 0 1 0-1.41L10.09 8 4.96 2.87a1 1 0 0 1 1.41-1.41l5.84 5.83a1 1 0 0 1 0 1.42l-5.84 5.83a1 1 0 0 1-1.41 0Z"
    clip-rule="evenodd"
  />
</svg>`,u3=Object.freeze({__proto__:null,chevronRightSvg:d3}),h3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M14.54 11.04a1 1 0 0 1-1.41 0L8 5.92l-5.13 5.12a1 1 0 1 1-1.41-1.41l5.83-5.84a1 1 0 0 1 1.42 0l5.83 5.84a1 1 0 0 1 0 1.41Z"
    clip-rule="evenodd"
  />
</svg>`,p3=Object.freeze({__proto__:null,chevronTopSvg:h3}),g3=U`<svg width="36" height="36" fill="none">
  <path
    fill="#fff"
    fill-opacity=".05"
    d="M0 14.94c0-5.55 0-8.326 1.182-10.4a9 9 0 0 1 3.359-3.358C6.614 0 9.389 0 14.94 0h6.12c5.55 0 8.326 0 10.4 1.182a9 9 0 0 1 3.358 3.359C36 6.614 36 9.389 36 14.94v6.12c0 5.55 0 8.326-1.182 10.4a9 9 0 0 1-3.359 3.358C29.386 36 26.611 36 21.06 36h-6.12c-5.55 0-8.326 0-10.4-1.182a9 9 0 0 1-3.358-3.359C0 29.386 0 26.611 0 21.06v-6.12Z"
  />
  <path
    stroke="#fff"
    stroke-opacity=".05"
    d="M14.94.5h6.12c2.785 0 4.84 0 6.46.146 1.612.144 2.743.43 3.691.97a8.5 8.5 0 0 1 3.172 3.173c.541.948.826 2.08.971 3.692.145 1.62.146 3.675.146 6.459v6.12c0 2.785 0 4.84-.146 6.46-.145 1.612-.43 2.743-.97 3.691a8.5 8.5 0 0 1-3.173 3.172c-.948.541-2.08.826-3.692.971-1.62.145-3.674.146-6.459.146h-6.12c-2.784 0-4.84 0-6.46-.146-1.612-.145-2.743-.43-3.691-.97a8.5 8.5 0 0 1-3.172-3.173c-.541-.948-.827-2.08-.971-3.692C.5 25.9.5 23.845.5 21.06v-6.12c0-2.784 0-4.84.146-6.46.144-1.612.43-2.743.97-3.691A8.5 8.5 0 0 1 4.79 1.617C5.737 1.076 6.869.79 8.48.646 10.1.5 12.156.5 14.94.5Z"
  />
  <path
    fill="url(#a)"
    d="M17.998 10.8h12.469a14.397 14.397 0 0 0-24.938.001l6.234 10.798.006-.001a7.19 7.19 0 0 1 6.23-10.799Z"
  />
  <path
    fill="url(#b)"
    d="m24.237 21.598-6.234 10.798A14.397 14.397 0 0 0 30.47 10.798H18.002l-.002.006a7.191 7.191 0 0 1 6.237 10.794Z"
  />
  <path
    fill="url(#c)"
    d="M11.765 21.601 5.531 10.803A14.396 14.396 0 0 0 18.001 32.4l6.235-10.798-.004-.004a7.19 7.19 0 0 1-12.466.004Z"
  />
  <path fill="#fff" d="M18 25.2a7.2 7.2 0 1 0 0-14.4 7.2 7.2 0 0 0 0 14.4Z" />
  <path fill="#1A73E8" d="M18 23.7a5.7 5.7 0 1 0 0-11.4 5.7 5.7 0 0 0 0 11.4Z" />
  <defs>
    <linearGradient
      id="a"
      x1="6.294"
      x2="41.1"
      y1="5.995"
      y2="5.995"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#D93025" />
      <stop offset="1" stop-color="#EA4335" />
    </linearGradient>
    <linearGradient
      id="b"
      x1="20.953"
      x2="37.194"
      y1="32.143"
      y2="2.701"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#FCC934" />
      <stop offset="1" stop-color="#FBBC04" />
    </linearGradient>
    <linearGradient
      id="c"
      x1="25.873"
      x2="9.632"
      y1="31.2"
      y2="1.759"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#1E8E3E" />
      <stop offset="1" stop-color="#34A853" />
    </linearGradient>
  </defs>
</svg>`,f3=Object.freeze({__proto__:null,chromeStoreSvg:g3}),w3=U`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path 
    fill-rule="evenodd" 
    clip-rule="evenodd" 
    d="M7.00235 2C4.24 2 2.00067 4.23858 2.00067 7C2.00067 9.76142 4.24 12 7.00235 12C9.7647 12 12.004 9.76142 12.004 7C12.004 4.23858 9.7647 2 7.00235 2ZM0 7C0 3.13401 3.13506 0 7.00235 0C10.8696 0 14.0047 3.13401 14.0047 7C14.0047 10.866 10.8696 14 7.00235 14C3.13506 14 0 10.866 0 7ZM7.00235 3C7.55482 3 8.00269 3.44771 8.00269 4V6.58579L9.85327 8.43575C10.2439 8.82627 10.2439 9.45944 9.85327 9.84996C9.46262 10.2405 8.82924 10.2405 8.43858 9.84996L6.29501 7.70711C6.10741 7.51957 6.00201 7.26522 6.00201 7V4C6.00201 3.44771 6.44988 3 7.00235 3Z" 
    fill="currentColor"
  />
</svg>`,m3=Object.freeze({__proto__:null,clockSvg:w3}),v3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M2.54 2.54a1 1 0 0 1 1.42 0L8 6.6l4.04-4.05a1 1 0 1 1 1.42 1.42L9.4 8l4.05 4.04a1 1 0 0 1-1.42 1.42L8 9.4l-4.04 4.05a1 1 0 0 1-1.42-1.42L6.6 8 2.54 3.96a1 1 0 0 1 0-1.42Z"
    clip-rule="evenodd"
  />
</svg>`,b3=Object.freeze({__proto__:null,closeSvg:v3}),y3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2ZM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm10.66-2.65a1 1 0 0 1 .23 1.06L9.83 9.24a1 1 0 0 1-.59.58l-2.83 1.06A1 1 0 0 1 5.13 9.6l1.06-2.82a1 1 0 0 1 .58-.59L9.6 5.12a1 1 0 0 1 1.06.23ZM7.9 7.89l-.13.35.35-.13.12-.35-.34.13Z"
    clip-rule="evenodd"
  />
</svg>`,C3=Object.freeze({__proto__:null,compassSvg:y3}),x3=U`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M10 3a7 7 0 0 0-6.85 8.44l8.29-8.3C10.97 3.06 10.49 3 10 3Zm3.49.93-9.56 9.56c.32.55.71 1.06 1.16 1.5L15 5.1a7.03 7.03 0 0 0-1.5-1.16Zm2.7 2.8-9.46 9.46a7 7 0 0 0 9.46-9.46ZM1.99 5.9A9 9 0 1 1 18 14.09 9 9 0 0 1 1.98 5.91Z"
    clip-rule="evenodd"
  />
</svg>`,E3=Object.freeze({__proto__:null,coinPlaceholderSvg:x3}),k3=U`<svg
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="none"
>
  <path
    fill="currentColor"
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M9.21498 1.28565H10.5944C11.1458 1.28562 11.6246 1.2856 12.0182 1.32093C12.4353 1.35836 12.853 1.44155 13.2486 1.66724C13.7005 1.92498 14.0749 2.29935 14.3326 2.75122C14.5583 3.14689 14.6415 3.56456 14.6789 3.9817C14.7143 4.37531 14.7142 4.85403 14.7142 5.40545V6.78489C14.7142 7.33631 14.7143 7.81503 14.6789 8.20865C14.6415 8.62578 14.5583 9.04345 14.3326 9.43912C14.0749 9.89099 13.7005 10.2654 13.2486 10.5231C12.853 10.7488 12.4353 10.832 12.0182 10.8694C11.7003 10.8979 11.3269 10.9034 10.9045 10.9045C10.9034 11.3269 10.8979 11.7003 10.8694 12.0182C10.832 12.4353 10.7488 12.853 10.5231 13.2486C10.2654 13.7005 9.89099 14.0749 9.43912 14.3326C9.04345 14.5583 8.62578 14.6415 8.20865 14.6789C7.81503 14.7143 7.33631 14.7142 6.78489 14.7142H5.40545C4.85403 14.7142 4.37531 14.7143 3.9817 14.6789C3.56456 14.6415 3.14689 14.5583 2.75122 14.3326C2.29935 14.0749 1.92498 13.7005 1.66724 13.2486C1.44155 12.853 1.35836 12.4353 1.32093 12.0182C1.2856 11.6246 1.28562 11.1458 1.28565 10.5944V9.21498C1.28562 8.66356 1.2856 8.18484 1.32093 7.79122C1.35836 7.37409 1.44155 6.95642 1.66724 6.56074C1.92498 6.10887 2.29935 5.73451 2.75122 5.47677C3.14689 5.25108 3.56456 5.16789 3.9817 5.13045C4.2996 5.10192 4.67301 5.09645 5.09541 5.09541C5.09645 4.67302 5.10192 4.2996 5.13045 3.9817C5.16789 3.56456 5.25108 3.14689 5.47676 2.75122C5.73451 2.29935 6.10887 1.92498 6.56074 1.66724C6.95642 1.44155 7.37409 1.35836 7.79122 1.32093C8.18484 1.2856 8.66356 1.28562 9.21498 1.28565ZM5.09541 7.09552C4.68397 7.09667 4.39263 7.10161 4.16046 7.12245C3.88053 7.14757 3.78516 7.18949 3.74214 7.21403C3.60139 7.29431 3.48478 7.41091 3.4045 7.55166C3.37997 7.59468 3.33804 7.69005 3.31292 7.96999C3.28659 8.26345 3.28565 8.65147 3.28565 9.25708V10.5523C3.28565 11.1579 3.28659 11.5459 3.31292 11.8394C3.33804 12.1193 3.37997 12.2147 3.4045 12.2577C3.48478 12.3985 3.60139 12.5151 3.74214 12.5954C3.78516 12.6199 3.88053 12.6618 4.16046 12.6869C4.45393 12.7133 4.84195 12.7142 5.44755 12.7142H6.74279C7.3484 12.7142 7.73641 12.7133 8.02988 12.6869C8.30981 12.6618 8.40518 12.6199 8.44821 12.5954C8.58895 12.5151 8.70556 12.3985 8.78584 12.2577C8.81038 12.2147 8.8523 12.1193 8.87742 11.8394C8.89825 11.6072 8.90319 11.3159 8.90435 10.9045C8.48219 10.9034 8.10898 10.8979 7.79122 10.8694C7.37409 10.832 6.95641 10.7488 6.56074 10.5231C6.10887 10.2654 5.73451 9.89099 5.47676 9.43912C5.25108 9.04345 5.16789 8.62578 5.13045 8.20865C5.10194 7.89089 5.09645 7.51767 5.09541 7.09552ZM7.96999 3.31292C7.69005 3.33804 7.59468 3.37997 7.55166 3.4045C7.41091 3.48478 7.29431 3.60139 7.21403 3.74214C7.18949 3.78516 7.14757 3.88053 7.12245 4.16046C7.09611 4.45393 7.09517 4.84195 7.09517 5.44755V6.74279C7.09517 7.3484 7.09611 7.73641 7.12245 8.02988C7.14757 8.30981 7.18949 8.40518 7.21403 8.4482C7.29431 8.58895 7.41091 8.70556 7.55166 8.78584C7.59468 8.81038 7.69005 8.8523 7.96999 8.87742C8.26345 8.90376 8.65147 8.9047 9.25708 8.9047H10.5523C11.1579 8.9047 11.5459 8.90376 11.8394 8.87742C12.1193 8.8523 12.2147 8.81038 12.2577 8.78584C12.3985 8.70556 12.5151 8.58895 12.5954 8.4482C12.6199 8.40518 12.6618 8.30981 12.6869 8.02988C12.7133 7.73641 12.7142 7.3484 12.7142 6.74279V5.44755C12.7142 4.84195 12.7133 4.45393 12.6869 4.16046C12.6618 3.88053 12.6199 3.78516 12.5954 3.74214C12.5151 3.60139 12.3985 3.48478 12.2577 3.4045C12.2147 3.37997 12.1193 3.33804 11.8394 3.31292C11.5459 3.28659 11.1579 3.28565 10.5523 3.28565H9.25708C8.65147 3.28565 8.26345 3.28659 7.96999 3.31292Z"
    fill="#788181"
  /></svg
>`,A3=Object.freeze({__proto__:null,copySvg:k3}),N3=U` <svg fill="none" viewBox="0 0 13 4">
  <path fill="currentColor" d="M.5 0h12L8.9 3.13a3.76 3.76 0 0 1-4.8 0L.5 0Z" />
</svg>`,I3=Object.freeze({__proto__:null,cursorSvg:N3}),S3=U`<svg fill="none" viewBox="0 0 14 6">
  <path style="fill: var(--wui-color-bg-150);" d="M0 1h14L9.21 5.12a3.31 3.31 0 0 1-4.49 0L0 1Z" />
  <path
    style="stroke: var(--wui-color-inverse-100);"
    stroke-opacity=".05"
    d="M1.33 1.5h11.32L8.88 4.75l-.01.01a2.81 2.81 0 0 1-3.8 0l-.02-.01L1.33 1.5Z"
  />
  <path
    style="fill: var(--wui-color-bg-150);"
    d="M1.25.71h11.5L9.21 3.88a3.31 3.31 0 0 1-4.49 0L1.25.71Z"
  />
</svg> `,_3=Object.freeze({__proto__:null,cursorTransparentSvg:S3}),O3=U`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M13.66 2H6.34c-1.07 0-1.96 0-2.68.08-.74.08-1.42.25-2.01.68a4 4 0 0 0-.89.89c-.43.6-.6 1.27-.68 2.01C0 6.38 0 7.26 0 8.34v.89c0 1.07 0 1.96.08 2.68.08.74.25 1.42.68 2.01a4 4 0 0 0 .89.89c.6.43 1.27.6 2.01.68a27 27 0 0 0 2.68.08h7.32a27 27 0 0 0 2.68-.08 4.03 4.03 0 0 0 2.01-.68 4 4 0 0 0 .89-.89c.43-.6.6-1.27.68-2.01.08-.72.08-1.6.08-2.68v-.89c0-1.07 0-1.96-.08-2.68a4.04 4.04 0 0 0-.68-2.01 4 4 0 0 0-.89-.89c-.6-.43-1.27-.6-2.01-.68C15.62 2 14.74 2 13.66 2ZM2.82 4.38c.2-.14.48-.25 1.06-.31C4.48 4 5.25 4 6.4 4h7.2c1.15 0 1.93 0 2.52.07.58.06.86.17 1.06.31a2 2 0 0 1 .44.44c.14.2.25.48.31 1.06.07.6.07 1.37.07 2.52v.77c0 1.15 0 1.93-.07 2.52-.06.58-.17.86-.31 1.06a2 2 0 0 1-.44.44c-.2.14-.48.25-1.06.32-.6.06-1.37.06-2.52.06H6.4c-1.15 0-1.93 0-2.52-.06-.58-.07-.86-.18-1.06-.32a2 2 0 0 1-.44-.44c-.14-.2-.25-.48-.31-1.06C2 11.1 2 10.32 2 9.17V8.4c0-1.15 0-1.93.07-2.52.06-.58.17-.86.31-1.06a2 2 0 0 1 .44-.44Z"
    clip-rule="evenodd"
  />
  <path fill="currentColor" d="M6.14 17.57a1 1 0 1 0 0 2h7.72a1 1 0 1 0 0-2H6.14Z" />
</svg>`,T3=Object.freeze({__proto__:null,desktopSvg:O3}),P3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M6.07 1h.57a1 1 0 0 1 0 2h-.52c-.98 0-1.64 0-2.14.06-.48.05-.7.14-.84.24-.13.1-.25.22-.34.35-.1.14-.2.35-.25.83-.05.5-.05 1.16-.05 2.15v2.74c0 .99 0 1.65.05 2.15.05.48.14.7.25.83.1.14.2.25.34.35.14.1.36.2.84.25.5.05 1.16.05 2.14.05h.52a1 1 0 0 1 0 2h-.57c-.92 0-1.69 0-2.3-.07a3.6 3.6 0 0 1-1.8-.61c-.3-.22-.57-.49-.8-.8a3.6 3.6 0 0 1-.6-1.79C.5 11.11.5 10.35.5 9.43V6.58c0-.92 0-1.7.06-2.31a3.6 3.6 0 0 1 .62-1.8c.22-.3.48-.57.79-.79a3.6 3.6 0 0 1 1.8-.61C4.37 1 5.14 1 6.06 1ZM9.5 3a1 1 0 0 1 1.42 0l4.28 4.3a1 1 0 0 1 0 1.4L10.93 13a1 1 0 0 1-1.42-1.42L12.1 9H6.8a1 1 0 1 1 0-2h5.3L9.51 4.42a1 1 0 0 1 0-1.41Z"
    clip-rule="evenodd"
  />
</svg>`,R3=Object.freeze({__proto__:null,disconnectSvg:P3}),$3=U`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#5865F2" />
      <path
        fill="#fff"
        fill-rule="evenodd"
        d="M25.71 28.15C30.25 28 32 25.02 32 25.02c0-6.61-2.96-11.98-2.96-11.98-2.96-2.22-5.77-2.15-5.77-2.15l-.29.32c3.5 1.07 5.12 2.61 5.12 2.61a16.75 16.75 0 0 0-10.34-1.93l-.35.04a15.43 15.43 0 0 0-5.88 1.9s1.71-1.63 5.4-2.7l-.2-.24s-2.81-.07-5.77 2.15c0 0-2.96 5.37-2.96 11.98 0 0 1.73 2.98 6.27 3.13l1.37-1.7c-2.6-.79-3.6-2.43-3.6-2.43l.58.35.09.06.08.04.02.01.08.05a17.25 17.25 0 0 0 4.52 1.58 14.4 14.4 0 0 0 8.3-.86c.72-.27 1.52-.66 2.37-1.21 0 0-1.03 1.68-3.72 2.44.61.78 1.35 1.67 1.35 1.67Zm-9.55-9.6c-1.17 0-2.1 1.03-2.1 2.28 0 1.25.95 2.28 2.1 2.28 1.17 0 2.1-1.03 2.1-2.28.01-1.25-.93-2.28-2.1-2.28Zm7.5 0c-1.17 0-2.1 1.03-2.1 2.28 0 1.25.95 2.28 2.1 2.28 1.17 0 2.1-1.03 2.1-2.28 0-1.25-.93-2.28-2.1-2.28Z"
        clip-rule="evenodd"
      />
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
  </defs>
</svg>`,L3=Object.freeze({__proto__:null,discordSvg:$3}),B3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    d="M4.25 7a.63.63 0 0 0-.63.63v3.97c0 .28-.2.51-.47.54l-.75.07a.93.93 0 0 1-.9-.47A7.51 7.51 0 0 1 5.54.92a7.5 7.5 0 0 1 9.54 4.62c.12.35.06.72-.16 1-.74.97-1.68 1.78-2.6 2.44V4.44a.64.64 0 0 0-.63-.64h-1.06c-.35 0-.63.3-.63.64v5.5c0 .23-.12.42-.32.5l-.52.23V6.05c0-.36-.3-.64-.64-.64H7.45c-.35 0-.64.3-.64.64v4.97c0 .25-.17.46-.4.52a5.8 5.8 0 0 0-.45.11v-4c0-.36-.3-.65-.64-.65H4.25ZM14.07 12.4A7.49 7.49 0 0 1 3.6 14.08c4.09-.58 9.14-2.5 11.87-6.6v.03a7.56 7.56 0 0 1-1.41 4.91Z"
  />
</svg>`,M3=Object.freeze({__proto__:null,etherscanSvg:B3}),U3=U`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M6.71 2.99a.57.57 0 0 0-.57.57 1 1 0 0 1-1 1c-.58 0-.96 0-1.24.03-.27.03-.37.07-.42.1a.97.97 0 0 0-.36.35c-.04.08-.09.21-.11.67a2.57 2.57 0 0 1 0 5.13c.02.45.07.6.11.66.09.15.21.28.36.36.07.04.21.1.67.12a2.57 2.57 0 0 1 5.12 0c.46-.03.6-.08.67-.12a.97.97 0 0 0 .36-.36c.03-.04.07-.14.1-.41.02-.29.03-.66.03-1.24a1 1 0 0 1 1-1 .57.57 0 0 0 0-1.15 1 1 0 0 1-1-1c0-.58 0-.95-.03-1.24a1.04 1.04 0 0 0-.1-.42.97.97 0 0 0-.36-.36 1.04 1.04 0 0 0-.42-.1c-.28-.02-.65-.02-1.24-.02a1 1 0 0 1-1-1 .57.57 0 0 0-.57-.57ZM5.15 13.98a1 1 0 0 0 .99-1v-.78a.57.57 0 0 1 1.14 0v.78a1 1 0 0 0 .99 1H8.36a66.26 66.26 0 0 0 .73 0 3.78 3.78 0 0 0 1.84-.38c.46-.26.85-.64 1.1-1.1.23-.4.32-.8.36-1.22.02-.2.03-.4.03-.63a2.57 2.57 0 0 0 0-4.75c0-.23-.01-.44-.03-.63a2.96 2.96 0 0 0-.35-1.22 2.97 2.97 0 0 0-1.1-1.1c-.4-.22-.8-.31-1.22-.35a8.7 8.7 0 0 0-.64-.04 2.57 2.57 0 0 0-4.74 0c-.23 0-.44.02-.63.04-.42.04-.83.13-1.22.35-.46.26-.84.64-1.1 1.1-.33.57-.37 1.2-.39 1.84a21.39 21.39 0 0 0 0 .72v.1a1 1 0 0 0 1 .99h.78a.57.57 0 0 1 0 1.15h-.77a1 1 0 0 0-1 .98v.1a63.87 63.87 0 0 0 0 .73c0 .64.05 1.27.38 1.83.26.47.64.85 1.1 1.11.56.32 1.2.37 1.84.38a20.93 20.93 0 0 0 .72 0h.1Z"
    clip-rule="evenodd"
  />
</svg>`,z3=Object.freeze({__proto__:null,extensionSvg:U3}),D3=U`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3.74 3.99a1 1 0 0 1 1-1H11a1 1 0 0 1 1 1v6.26a1 1 0 0 1-2 0V6.4l-6.3 6.3a1 1 0 0 1-1.4-1.42l6.29-6.3H4.74a1 1 0 0 1-1-1Z"
    clip-rule="evenodd"
  />
</svg>`,j3=Object.freeze({__proto__:null,externalLinkSvg:D3}),W3=U`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#1877F2" />
      <g clip-path="url(#c)">
        <path
          fill="#fff"
          d="M26 12.38h-2.89c-.92 0-1.61.38-1.61 1.34v1.66H26l-.36 4.5H21.5v12H17v-12h-3v-4.5h3V12.5c0-3.03 1.6-4.62 5.2-4.62H26v4.5Z"
        />
      </g>
    </g>
    <path
      fill="#1877F2"
      d="M40 20a20 20 0 1 0-23.13 19.76V25.78H11.8V20h5.07v-4.4c0-5.02 3-7.79 7.56-7.79 2.19 0 4.48.4 4.48.4v4.91h-2.53c-2.48 0-3.25 1.55-3.25 3.13V20h5.54l-.88 5.78h-4.66v13.98A20 20 0 0 0 40 20Z"
    />
    <path
      fill="#fff"
      d="m27.79 25.78.88-5.78h-5.55v-3.75c0-1.58.78-3.13 3.26-3.13h2.53V8.2s-2.3-.39-4.48-.39c-4.57 0-7.55 2.77-7.55 7.78V20H11.8v5.78h5.07v13.98a20.15 20.15 0 0 0 6.25 0V25.78h4.67Z"
    />
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
    <clipPath id="c"><path fill="#fff" d="M8 7.89h24v24H8z" /></clipPath>
  </defs>
</svg>`,H3=Object.freeze({__proto__:null,facebookSvg:W3}),F3=U`<svg style="border-radius: 9999px; overflow: hidden;"  fill="none" viewBox="0 0 1000 1000">
  <rect width="1000" height="1000" rx="9999" ry="9999" fill="#855DCD"/>
  <path fill="#855DCD" d="M0 0h1000v1000H0V0Z" />
  <path
    fill="#fff"
    d="M320 248h354v504h-51.96V521.13h-.5c-5.76-63.8-59.31-113.81-124.54-113.81s-118.78 50-124.53 113.81h-.5V752H320V248Z"
  />
  <path
    fill="#fff"
    d="m225 320 21.16 71.46h17.9v289.09a16.29 16.29 0 0 0-16.28 16.24v19.49h-3.25a16.3 16.3 0 0 0-16.28 16.24V752h182.26v-19.48a16.22 16.22 0 0 0-16.28-16.24h-3.25v-19.5a16.22 16.22 0 0 0-16.28-16.23h-19.52V320H225Zm400.3 360.55a16.3 16.3 0 0 0-15.04 10.02 16.2 16.2 0 0 0-1.24 6.22v19.49h-3.25a16.29 16.29 0 0 0-16.27 16.24V752h182.24v-19.48a16.23 16.23 0 0 0-16.27-16.24h-3.25v-19.5a16.2 16.2 0 0 0-10.04-15 16.3 16.3 0 0 0-6.23-1.23v-289.1h17.9L775 320H644.82v360.55H625.3Z"
  />
</svg>`,V3=Object.freeze({__proto__:null,farcasterSvg:F3}),Z3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M0 3a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1Zm2.63 5.25a1 1 0 0 1 1-1h8.75a1 1 0 1 1 0 2H3.63a1 1 0 0 1-1-1Zm2.62 5.25a1 1 0 0 1 1-1h3.5a1 1 0 0 1 0 2h-3.5a1 1 0 0 1-1-1Z"
    clip-rule="evenodd"
  />
</svg>`,q3=Object.freeze({__proto__:null,filtersSvg:Z3}),G3=U`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#1B1F23" />
      <g clip-path="url(#c)">
        <path
          fill="#fff"
          d="M8 19.89a12 12 0 1 1 15.8 11.38c-.6.12-.8-.26-.8-.57v-3.3c0-1.12-.4-1.85-.82-2.22 2.67-.3 5.48-1.31 5.48-5.92 0-1.31-.47-2.38-1.24-3.22.13-.3.54-1.52-.12-3.18 0 0-1-.32-3.3 1.23a11.54 11.54 0 0 0-6 0c-2.3-1.55-3.3-1.23-3.3-1.23a4.32 4.32 0 0 0-.12 3.18 4.64 4.64 0 0 0-1.24 3.22c0 4.6 2.8 5.63 5.47 5.93-.34.3-.65.83-.76 1.6-.69.31-2.42.84-3.5-1 0 0-.63-1.15-1.83-1.23 0 0-1.18-.02-.09.73 0 0 .8.37 1.34 1.76 0 0 .7 2.14 4.03 1.41v2.24c0 .31-.2.68-.8.57A12 12 0 0 1 8 19.9Z"
        />
      </g>
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
    <clipPath id="c"><path fill="#fff" d="M8 7.89h24v24H8z" /></clipPath>
  </defs>
</svg>`,K3=Object.freeze({__proto__:null,githubSvg:G3}),Y3=U`<svg fill="none" viewBox="0 0 40 40">
  <path
    fill="#4285F4"
    d="M32.74 20.3c0-.93-.08-1.81-.24-2.66H20.26v5.03h7a6 6 0 0 1-2.62 3.91v3.28h4.22c2.46-2.27 3.88-5.6 3.88-9.56Z"
  />
  <path
    fill="#34A853"
    d="M20.26 33a12.4 12.4 0 0 0 8.6-3.14l-4.22-3.28a7.74 7.74 0 0 1-4.38 1.26 7.76 7.76 0 0 1-7.28-5.36H8.65v3.36A12.99 12.99 0 0 0 20.26 33Z"
  />
  <path
    fill="#FBBC05"
    d="M12.98 22.47a7.79 7.79 0 0 1 0-4.94v-3.36H8.65a12.84 12.84 0 0 0 0 11.66l3.37-2.63.96-.73Z"
  />
  <path
    fill="#EA4335"
    d="M20.26 12.18a7.1 7.1 0 0 1 4.98 1.93l3.72-3.72A12.47 12.47 0 0 0 20.26 7c-5.08 0-9.47 2.92-11.6 7.17l4.32 3.36a7.76 7.76 0 0 1 7.28-5.35Z"
  />
</svg>`,J3=Object.freeze({__proto__:null,googleSvg:Y3}),X3=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    d="M8.51 5.66a.83.83 0 0 0-.57-.2.83.83 0 0 0-.52.28.8.8 0 0 0-.25.52 1 1 0 0 1-2 0c0-.75.34-1.43.81-1.91a2.75 2.75 0 0 1 4.78 1.92c0 1.24-.8 1.86-1.25 2.2l-.04.03c-.47.36-.5.43-.5.65a1 1 0 1 1-2 0c0-1.25.8-1.86 1.24-2.2l.04-.04c.47-.36.5-.43.5-.65 0-.3-.1-.49-.24-.6ZM9.12 11.87a1.13 1.13 0 1 1-2.25 0 1.13 1.13 0 0 1 2.25 0Z"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6a6 6 0 1 0 0 12A6 6 0 0 0 8 2Z"
    clip-rule="evenodd"
  />
</svg>`,Q3=Object.freeze({__proto__:null,helpCircleSvg:X3}),e5=U`<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M4.98926 3.73932C4.2989 3.73932 3.73926 4.29896 3.73926 4.98932C3.73926 5.67968 4.2989 6.23932 4.98926 6.23932C5.67962 6.23932 6.23926 5.67968 6.23926 4.98932C6.23926 4.29896 5.67962 3.73932 4.98926 3.73932Z" fill="currentColor"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.60497 0.500001H6.39504C5.41068 0.499977 4.59185 0.499958 3.93178 0.571471C3.24075 0.64634 2.60613 0.809093 2.04581 1.21619C1.72745 1.44749 1.44749 1.72745 1.21619 2.04581C0.809093 2.60613 0.64634 3.24075 0.571471 3.93178C0.499958 4.59185 0.499977 5.41065 0.500001 6.39501V7.57815C0.499998 8.37476 0.499995 9.05726 0.534869 9.62725C0.570123 10.2034 0.644114 10.7419 0.828442 11.2302C0.925651 11.4877 1.05235 11.7287 1.21619 11.9542C1.44749 12.2726 1.72745 12.5525 2.04581 12.7838C2.60613 13.1909 3.24075 13.3537 3.93178 13.4285C4.59185 13.5001 5.41066 13.5 6.39503 13.5H7.60496C8.58933 13.5 9.40815 13.5001 10.0682 13.4285C10.7593 13.3537 11.3939 13.1909 11.9542 12.7838C12.2726 12.5525 12.5525 12.2726 12.7838 11.9542C13.1909 11.3939 13.3537 10.7593 13.4285 10.0682C13.5 9.40816 13.5 8.58935 13.5 7.60497V6.39505C13.5 5.41068 13.5 4.59185 13.4285 3.93178C13.3537 3.24075 13.1909 2.60613 12.7838 2.04581C12.5525 1.72745 12.2726 1.44749 11.9542 1.21619C11.3939 0.809093 10.7593 0.64634 10.0682 0.571471C9.40816 0.499958 8.58933 0.499977 7.60497 0.500001ZM3.22138 2.83422C3.38394 2.71612 3.62634 2.61627 4.14721 2.55984C4.68679 2.50138 5.39655 2.5 6.45 2.5H7.55C8.60345 2.5 9.31322 2.50138 9.8528 2.55984C10.3737 2.61627 10.6161 2.71612 10.7786 2.83422C10.9272 2.94216 11.0578 3.07281 11.1658 3.22138C11.2839 3.38394 11.3837 3.62634 11.4402 4.14721C11.4986 4.68679 11.5 5.39655 11.5 6.45V6.49703C10.9674 6.11617 10.386 5.84936 9.74213 5.81948C8.40536 5.75745 7.3556 6.73051 6.40509 7.84229C6.33236 7.92737 6.27406 7.98735 6.22971 8.02911L6.1919 8.00514L6.17483 7.99427C6.09523 7.94353 5.98115 7.87083 5.85596 7.80302C5.56887 7.64752 5.18012 7.4921 4.68105 7.4921C4.66697 7.4921 4.6529 7.49239 4.63884 7.49299C3.79163 7.52878 3.09922 8.1106 2.62901 8.55472C2.58751 8.59392 2.54594 8.6339 2.50435 8.6745C2.50011 8.34653 2.5 7.97569 2.5 7.55V6.45C2.5 5.39655 2.50138 4.68679 2.55984 4.14721C2.61627 3.62634 2.71612 3.38394 2.83422 3.22138C2.94216 3.07281 3.07281 2.94216 3.22138 2.83422ZM10.3703 8.14825C10.6798 8.37526 11.043 8.71839 11.4832 9.20889C11.4744 9.44992 11.4608 9.662 11.4402 9.8528C11.3837 10.3737 11.2839 10.6161 11.1658 10.7786C11.0578 10.9272 10.9272 11.0578 10.7786 11.1658C10.6161 11.2839 10.3737 11.3837 9.8528 11.4402C9.31322 11.4986 8.60345 11.5 7.55 11.5H6.45C5.39655 11.5 4.68679 11.4986 4.14721 11.4402C3.62634 11.3837 3.38394 11.2839 3.22138 11.1658C3.15484 11.1174 3.0919 11.0645 3.03298 11.0075C3.10126 10.9356 3.16806 10.8649 3.23317 10.7959L3.29772 10.7276C3.55763 10.4525 3.78639 10.2126 4.00232 10.0087C4.22016 9.80294 4.39412 9.66364 4.53524 9.57742C4.63352 9.51738 4.69022 9.49897 4.71275 9.49345C4.76387 9.49804 4.81803 9.51537 4.90343 9.56162C4.96409 9.59447 5.02355 9.63225 5.11802 9.69238L5.12363 9.69595C5.20522 9.74789 5.32771 9.82587 5.46078 9.89278C5.76529 10.0459 6.21427 10.186 6.74977 10.0158C7.21485 9.86796 7.59367 9.52979 7.92525 9.14195C8.91377 7.98571 9.38267 7.80495 9.64941 7.81733C9.7858 7.82366 10.0101 7.884 10.3703 8.14825Z" fill="currentColor"/>
</svg>`,t5=Object.freeze({__proto__:null,imageSvg:e5}),r5=U`<svg
 xmlns="http://www.w3.org/2000/svg"
 width="28"
 height="28"
 viewBox="0 0 28 28"
 fill="none">
  <path
    fill="#949E9E"
    fill-rule="evenodd"
    d="M7.974 2.975h12.052c1.248 0 2.296 0 3.143.092.89.096 1.723.307 2.461.844a4.9 4.9 0 0 1 1.084 1.084c.537.738.748 1.57.844 2.461.092.847.092 1.895.092 3.143v6.802c0 1.248 0 2.296-.092 3.143-.096.89-.307 1.723-.844 2.461a4.9 4.9 0 0 1-1.084 1.084c-.738.537-1.57.748-2.461.844-.847.092-1.895.092-3.143.092H7.974c-1.247 0-2.296 0-3.143-.092-.89-.096-1.723-.307-2.461-.844a4.901 4.901 0 0 1-1.084-1.084c-.537-.738-.748-1.571-.844-2.461C.35 19.697.35 18.649.35 17.4v-6.802c0-1.248 0-2.296.092-3.143.096-.89.307-1.723.844-2.461A4.9 4.9 0 0 1 2.37 3.91c.738-.537 1.571-.748 2.461-.844.847-.092 1.895-.092 3.143-.092ZM5.133 5.85c-.652.071-.936.194-1.117.326a2.1 2.1 0 0 0-.465.465c-.132.181-.255.465-.325 1.117-.074.678-.076 1.573-.076 2.917v6.65c0 1.344.002 2.239.076 2.917.07.652.193.936.325 1.117a2.1 2.1 0 0 0 .465.465c.181.132.465.255 1.117.326.678.073 1.574.075 2.917.075h11.9c1.344 0 2.239-.002 2.917-.075.652-.071.936-.194 1.117-.326.179-.13.335-.286.465-.465.132-.181.255-.465.326-1.117.073-.678.075-1.573.075-2.917v-6.65c0-1.344-.002-2.239-.075-2.917-.071-.652-.194-.936-.326-1.117a2.1 2.1 0 0 0-.465-.465c-.181-.132-.465-.255-1.117-.326-.678-.073-1.573-.075-2.917-.075H8.05c-1.343 0-2.239.002-2.917.075Zm.467 7.275a3.15 3.15 0 1 1 6.3 0 3.15 3.15 0 0 1-6.3 0Zm8.75-1.75a1.4 1.4 0 0 1 1.4-1.4h3.5a1.4 1.4 0 0 1 0 2.8h-3.5a1.4 1.4 0 0 1-1.4-1.4Zm0 5.25a1.4 1.4 0 0 1 1.4-1.4H21a1.4 1.4 0 1 1 0 2.8h-5.25a1.4 1.4 0 0 1-1.4-1.4Z"
    clip-rule="evenodd"/>
</svg>`,o5=Object.freeze({__proto__:null,idSvg:r5}),n5=U`<svg fill="none" viewBox="0 0 14 15">
  <path
    fill="currentColor"
    d="M6 10.49a1 1 0 1 0 2 0v-2a1 1 0 0 0-2 0v2ZM7 4.49a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M7 14.99a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
    clip-rule="evenodd"
  />
</svg>`,i5=Object.freeze({__proto__:null,infoCircleSvg:n5}),s5=U`<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.00177 1.78569C3.8179 1.78569 2.85819 2.74508 2.85819 3.92855C2.85819 4.52287 3.09928 5.05956 3.49077 5.4485L3.5005 5.45817C3.64381 5.60054 3.76515 5.72108 3.85631 5.81845C3.93747 5.90512 4.05255 6.03218 4.12889 6.1805C4.16999 6.26034 4.19 6.30843 4.21768 6.39385C4.22145 6.40546 4.22499 6.41703 4.22833 6.42855H5.77521C5.77854 6.41703 5.78208 6.40547 5.78585 6.39385C5.81353 6.30843 5.83354 6.26034 5.87464 6.1805C5.95098 6.03218 6.06606 5.90512 6.14722 5.81845C6.23839 5.72108 6.35973 5.60053 6.50304 5.45816L6.51276 5.4485C6.90425 5.05956 7.14534 4.52287 7.14534 3.92855C7.14534 2.74508 6.18563 1.78569 5.00177 1.78569ZM5.71629 7.85712H4.28724C4.28724 8.21403 4.28876 8.40985 4.30703 8.54571C4.30727 8.54748 4.30751 8.54921 4.30774 8.55091C4.30944 8.55115 4.31118 8.55138 4.31295 8.55162C4.44884 8.56989 4.64474 8.5714 5.00177 8.5714C5.3588 8.5714 5.55469 8.56989 5.69059 8.55162C5.69236 8.55138 5.69409 8.55115 5.69579 8.55091C5.69603 8.54921 5.69627 8.54748 5.6965 8.54571C5.71477 8.40985 5.71629 8.21403 5.71629 7.85712ZM2.85819 7.14283C2.85819 6.9948 2.85796 6.91114 2.8548 6.85032C2.85461 6.84656 2.85441 6.84309 2.85421 6.83988C2.84393 6.8282 2.83047 6.81334 2.81301 6.79469C2.74172 6.71856 2.63908 6.61643 2.48342 6.46178C1.83307 5.81566 1.42914 4.91859 1.42914 3.92855C1.42914 1.9561 3.02866 0.357117 5.00177 0.357117C6.97487 0.357117 8.57439 1.9561 8.57439 3.92855C8.57439 4.91859 8.17047 5.81566 7.52012 6.46178C7.36445 6.61643 7.26182 6.71856 7.19053 6.79469C7.17306 6.81334 7.1596 6.8282 7.14932 6.83988C7.14912 6.84309 7.14892 6.84656 7.14873 6.85032C7.14557 6.91114 7.14534 6.9948 7.14534 7.14283V7.85712C7.14534 7.87009 7.14535 7.88304 7.14535 7.89598C7.14541 8.19889 7.14547 8.49326 7.11281 8.73606C7.076 9.00978 6.98631 9.32212 6.72678 9.58156C6.46726 9.841 6.15481 9.93065 5.881 9.96745C5.63813 10.0001 5.34365 10 5.04064 9.99998C5.0277 9.99998 5.01474 9.99998 5.00177 9.99998C4.98879 9.99998 4.97583 9.99998 4.96289 9.99998C4.65988 10 4.36541 10.0001 4.12253 9.96745C3.84872 9.93065 3.53628 9.841 3.27675 9.58156C3.01722 9.32212 2.92753 9.00978 2.89072 8.73606C2.85807 8.49326 2.85812 8.19889 2.85818 7.89598C2.85819 7.88304 2.85819 7.87008 2.85819 7.85712V7.14283ZM7.1243 6.86977C7.12366 6.87069 7.1233 6.87116 7.12327 6.87119C7.12323 6.87123 7.12356 6.87076 7.1243 6.86977ZM2.88027 6.8712C2.88025 6.87119 2.87988 6.8707 2.87921 6.86975C2.87995 6.87072 2.88028 6.8712 2.88027 6.8712Z" fill="#949E9E"/>
</svg>`,a5=Object.freeze({__proto__:null,lightbulbSvg:s5}),c5=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M4.83 1.34h6.34c.68 0 1.26 0 1.73.04.5.05.97.15 1.42.4.52.3.95.72 1.24 1.24.26.45.35.92.4 1.42.04.47.04 1.05.04 1.73v3.71c0 .69 0 1.26-.04 1.74-.05.5-.14.97-.4 1.41-.3.52-.72.95-1.24 1.25-.45.25-.92.35-1.42.4-.47.03-1.05.03-1.73.03H4.83c-.68 0-1.26 0-1.73-.04-.5-.04-.97-.14-1.42-.4-.52-.29-.95-.72-1.24-1.24a3.39 3.39 0 0 1-.4-1.41A20.9 20.9 0 0 1 0 9.88v-3.7c0-.7 0-1.27.04-1.74.05-.5.14-.97.4-1.42.3-.52.72-.95 1.24-1.24.45-.25.92-.35 1.42-.4.47-.04 1.05-.04 1.73-.04ZM3.28 3.38c-.36.03-.51.08-.6.14-.21.11-.39.29-.5.5a.8.8 0 0 0-.08.19l5.16 3.44c.45.3 1.03.3 1.48 0L13.9 4.2a.79.79 0 0 0-.08-.2c-.11-.2-.29-.38-.5-.5-.09-.05-.24-.1-.6-.13-.37-.04-.86-.04-1.6-.04H4.88c-.73 0-1.22 0-1.6.04ZM14 6.54 9.85 9.31a3.33 3.33 0 0 1-3.7 0L2 6.54v3.3c0 .74 0 1.22.03 1.6.04.36.1.5.15.6.11.2.29.38.5.5.09.05.24.1.6.14.37.03.86.03 1.6.03h6.25c.73 0 1.22 0 1.6-.03.35-.03.5-.09.6-.14.2-.12.38-.3.5-.5.05-.1.1-.24.14-.6.03-.38.03-.86.03-1.6v-3.3Z"
    clip-rule="evenodd"
  />
</svg>`,l5=Object.freeze({__proto__:null,mailSvg:c5}),d5=U`<svg fill="none" viewBox="0 0 20 20">
  <path fill="currentColor" d="M10.81 5.81a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3 4.75A4.75 4.75 0 0 1 7.75 0h4.5A4.75 4.75 0 0 1 17 4.75v10.5A4.75 4.75 0 0 1 12.25 20h-4.5A4.75 4.75 0 0 1 3 15.25V4.75ZM7.75 2A2.75 2.75 0 0 0 5 4.75v10.5A2.75 2.75 0 0 0 7.75 18h4.5A2.75 2.75 0 0 0 15 15.25V4.75A2.75 2.75 0 0 0 12.25 2h-4.5Z"
    clip-rule="evenodd"
  />
</svg>`,u5=Object.freeze({__proto__:null,mobileSvg:d5}),h5=U`<svg fill="none" viewBox="0 0 41 40">
  <path
    style="fill: var(--wui-color-fg-100);"
    fill-opacity=".05"
    d="M.6 20a20 20 0 1 1 40 0 20 20 0 0 1-40 0Z"
  />
  <path
    fill="#949E9E"
    d="M15.6 20.31a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM23.1 20.31a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM28.1 22.81a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
  />
</svg>`,p5=Object.freeze({__proto__:null,moreSvg:h5}),g5=U`<svg fill="none" viewBox="0 0 22 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M16.32 13.62a3.14 3.14 0 1 1-.99 1.72l-1.6-.93a3.83 3.83 0 0 1-3.71 1 3.66 3.66 0 0 1-1.74-1l-1.6.94a3.14 3.14 0 1 1-1-1.73l1.6-.94a3.7 3.7 0 0 1 0-2 3.81 3.81 0 0 1 1.8-2.33c.29-.17.6-.3.92-.38V6.1a3.14 3.14 0 1 1 2 0l-.01.02v1.85H12a3.82 3.82 0 0 1 2.33 1.8 3.7 3.7 0 0 1 .39 2.91l1.6.93ZM2.6 16.54a1.14 1.14 0 0 0 1.98-1.14 1.14 1.14 0 0 0-1.98 1.14ZM11 2.01a1.14 1.14 0 1 0 0 2.28 1.14 1.14 0 0 0 0-2.28Zm1.68 10.45c.08-.19.14-.38.16-.58v-.05l.02-.13v-.13a1.92 1.92 0 0 0-.24-.8l-.11-.15a1.89 1.89 0 0 0-.74-.6 1.86 1.86 0 0 0-.77-.17h-.19a1.97 1.97 0 0 0-.89.34 1.98 1.98 0 0 0-.61.74 1.99 1.99 0 0 0-.16.9v.05a1.87 1.87 0 0 0 .24.74l.1.15c.12.16.26.3.42.42l.16.1.13.07.04.02a1.84 1.84 0 0 0 .76.17h.17a2 2 0 0 0 .91-.35 1.78 1.78 0 0 0 .52-.58l.03-.05a.84.84 0 0 0 .05-.11Zm5.15 4.5a1.14 1.14 0 0 0 1.14-1.97 1.13 1.13 0 0 0-1.55.41c-.32.55-.13 1.25.41 1.56Z"
    clip-rule="evenodd"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M4.63 9.43a1.5 1.5 0 1 0 1.5-2.6 1.5 1.5 0 0 0-1.5 2.6Zm.32-1.55a.5.5 0 0 1 .68-.19.5.5 0 0 1 .18.68.5.5 0 0 1-.68.19.5.5 0 0 1-.18-.68ZM17.94 8.88a1.5 1.5 0 1 1-2.6-1.5 1.5 1.5 0 1 1 2.6 1.5ZM16.9 7.69a.5.5 0 0 0-.68.19.5.5 0 0 0 .18.68.5.5 0 0 0 .68-.19.5.5 0 0 0-.18-.68ZM9.75 17.75a1.5 1.5 0 1 1 2.6 1.5 1.5 1.5 0 1 1-2.6-1.5Zm1.05 1.18a.5.5 0 0 0 .68-.18.5.5 0 0 0-.18-.68.5.5 0 0 0-.68.18.5.5 0 0 0 .18.68Z"
    clip-rule="evenodd"
  />
</svg>`,f5=Object.freeze({__proto__:null,networkPlaceholderSvg:g5}),w5=U`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M9.13 1h1.71c1.46 0 2.63 0 3.56.1.97.1 1.8.33 2.53.85a5 5 0 0 1 1.1 1.11c.53.73.75 1.56.86 2.53.1.93.1 2.1.1 3.55v1.72c0 1.45 0 2.62-.1 3.55-.1.97-.33 1.8-.86 2.53a5 5 0 0 1-1.1 1.1c-.73.53-1.56.75-2.53.86-.93.1-2.1.1-3.55.1H9.13c-1.45 0-2.62 0-3.56-.1-.96-.1-1.8-.33-2.52-.85a5 5 0 0 1-1.1-1.11 5.05 5.05 0 0 1-.86-2.53c-.1-.93-.1-2.1-.1-3.55V9.14c0-1.45 0-2.62.1-3.55.1-.97.33-1.8.85-2.53a5 5 0 0 1 1.1-1.1 5.05 5.05 0 0 1 2.53-.86C6.51 1 7.67 1 9.13 1ZM5.79 3.09a3.1 3.1 0 0 0-1.57.48 3 3 0 0 0-.66.67c-.24.32-.4.77-.48 1.56-.1.82-.1 1.88-.1 3.4v1.6c0 1.15 0 2.04.05 2.76l.41-.42c.5-.5.93-.92 1.32-1.24.41-.33.86-.6 1.43-.7a3 3 0 0 1 .94 0c.35.06.66.2.95.37a17.11 17.11 0 0 0 .8.45c.1-.08.2-.2.41-.4l.04-.03a27 27 0 0 1 1.95-1.84 4.03 4.03 0 0 1 1.91-.94 4 4 0 0 1 1.25 0c.73.11 1.33.46 1.91.94l.64.55V9.2c0-1.52 0-2.58-.1-3.4a3.1 3.1 0 0 0-.48-1.56 3 3 0 0 0-.66-.67 3.1 3.1 0 0 0-1.56-.48C13.37 3 12.3 3 10.79 3h-1.6c-1.52 0-2.59 0-3.4.09Zm11.18 10-.04-.05a26.24 26.24 0 0 0-1.83-1.74c-.45-.36-.73-.48-.97-.52a2 2 0 0 0-.63 0c-.24.04-.51.16-.97.52-.46.38-1.01.93-1.83 1.74l-.02.02c-.17.18-.34.34-.49.47a2.04 2.04 0 0 1-1.08.5 1.97 1.97 0 0 1-1.25-.27l-.79-.46-.02-.02a.65.65 0 0 0-.24-.1 1 1 0 0 0-.31 0c-.08.02-.21.06-.49.28-.3.24-.65.59-1.2 1.14l-.56.56-.65.66a3 3 0 0 0 .62.6c.33.24.77.4 1.57.49.81.09 1.88.09 3.4.09h1.6c1.52 0 2.58 0 3.4-.09a3.1 3.1 0 0 0 1.56-.48 3 3 0 0 0 .66-.67c.24-.32.4-.77.49-1.56l.07-1.12Zm-8.02-1.03ZM4.99 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"
    clip-rule="evenodd"
  />
</svg>`,m5=Object.freeze({__proto__:null,nftPlaceholderSvg:w5}),v5=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M8 0a1 1 0 0 1 1 1v5.38a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1ZM5.26 2.6a1 1 0 0 1-.28 1.39 5.46 5.46 0 1 0 6.04 0 1 1 0 1 1 1.1-1.67 7.46 7.46 0 1 1-8.25 0 1 1 0 0 1 1.4.28Z"
    clip-rule="evenodd"
  />
</svg>`,b5=Object.freeze({__proto__:null,offSvg:v5}),y5=U` <svg
  width="36"
  height="36"
  fill="none"
>
  <path
    d="M0 8a8 8 0 0 1 8-8h20a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8Z"
    fill="#fff"
    fill-opacity=".05"
  />
  <path
    d="m18.262 17.513-8.944 9.49v.01a2.417 2.417 0 0 0 3.56 1.452l.026-.017 10.061-5.803-4.703-5.132Z"
    fill="#EA4335"
  />
  <path
    d="m27.307 15.9-.008-.008-4.342-2.52-4.896 4.36 4.913 4.912 4.325-2.494a2.42 2.42 0 0 0 .008-4.25Z"
    fill="#FBBC04"
  />
  <path
    d="M9.318 8.997c-.05.202-.084.403-.084.622V26.39c0 .218.025.42.084.621l9.246-9.247-9.246-8.768Z"
    fill="#4285F4"
  />
  <path
    d="m18.33 18 4.627-4.628-10.053-5.828a2.427 2.427 0 0 0-3.586 1.444L18.329 18Z"
    fill="#34A853"
  />
  <path
    d="M8 .5h20A7.5 7.5 0 0 1 35.5 8v20a7.5 7.5 0 0 1-7.5 7.5H8A7.5 7.5 0 0 1 .5 28V8A7.5 7.5 0 0 1 8 .5Z"
    stroke="#fff"
    stroke-opacity=".05"
  />
</svg>`,C5=Object.freeze({__proto__:null,playStoreSvg:y5}),x5=U`<svg
  width="13"
  height="12"
  viewBox="0 0 13 12"
  fill="none"
>
  <path
    fill="currentColor"
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M0.794373 5.99982C0.794373 5.52643 1.17812 5.14268 1.6515 5.14268H5.643V1.15109C5.643 0.677701 6.02675 0.293946 6.50012 0.293945C6.9735 0.293946 7.35725 0.677701 7.35725 1.15109V5.14268H11.3488C11.8221 5.14268 12.2059 5.52643 12.2059 5.99982C12.2059 6.47321 11.8221 6.85696 11.3488 6.85696H7.35725V10.8486C7.35725 11.3219 6.9735 11.7057 6.50012 11.7057C6.02675 11.7057 5.643 11.3219 5.643 10.8486V6.85696H1.6515C1.17812 6.85696 0.794373 6.47321 0.794373 5.99982Z"
  /></svg
>`,E5=Object.freeze({__proto__:null,plusSvg:x5}),k5=U`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    d="M3 6a3 3 0 0 1 3-3h1a1 1 0 1 0 0-2H6a5 5 0 0 0-5 5v1a1 1 0 0 0 2 0V6ZM13 1a1 1 0 1 0 0 2h1a3 3 0 0 1 3 3v1a1 1 0 1 0 2 0V6a5 5 0 0 0-5-5h-1ZM3 13a1 1 0 1 0-2 0v1a5 5 0 0 0 5 5h1a1 1 0 1 0 0-2H6a3 3 0 0 1-3-3v-1ZM19 13a1 1 0 1 0-2 0v1a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1.01a5 5 0 0 0 5-5v-1ZM5.3 6.36c-.04.2-.04.43-.04.89s0 .7.05.89c.14.52.54.92 1.06 1.06.19.05.42.05.89.05.46 0 .7 0 .88-.05A1.5 1.5 0 0 0 9.2 8.14c.06-.2.06-.43.06-.89s0-.7-.06-.89A1.5 1.5 0 0 0 8.14 5.3c-.19-.05-.42-.05-.88-.05-.47 0-.7 0-.9.05a1.5 1.5 0 0 0-1.05 1.06ZM10.8 6.36c-.04.2-.04.43-.04.89s0 .7.05.89c.14.52.54.92 1.06 1.06.19.05.42.05.89.05.46 0 .7 0 .88-.05a1.5 1.5 0 0 0 1.06-1.06c.06-.2.06-.43.06-.89s0-.7-.06-.89a1.5 1.5 0 0 0-1.06-1.06c-.19-.05-.42-.05-.88-.05-.47 0-.7 0-.9.05a1.5 1.5 0 0 0-1.05 1.06ZM5.26 12.75c0-.46 0-.7.05-.89a1.5 1.5 0 0 1 1.06-1.06c.19-.05.42-.05.89-.05.46 0 .7 0 .88.05.52.14.93.54 1.06 1.06.06.2.06.43.06.89s0 .7-.06.89a1.5 1.5 0 0 1-1.06 1.06c-.19.05-.42.05-.88.05-.47 0-.7 0-.9-.05a1.5 1.5 0 0 1-1.05-1.06c-.05-.2-.05-.43-.05-.89ZM10.8 11.86c-.04.2-.04.43-.04.89s0 .7.05.89c.14.52.54.92 1.06 1.06.19.05.42.05.89.05.46 0 .7 0 .88-.05a1.5 1.5 0 0 0 1.06-1.06c.06-.2.06-.43.06-.89s0-.7-.06-.89a1.5 1.5 0 0 0-1.06-1.06c-.19-.05-.42-.05-.88-.05-.47 0-.7 0-.9.05a1.5 1.5 0 0 0-1.05 1.06Z"
  />
</svg>`,A5=Object.freeze({__proto__:null,qrCodeIcon:k5}),N5=U`<svg
  fill="none"
  viewBox="0 0 21 20"
>
  <path
    fill="currentColor"
    d="M8.8071 0.292893C9.19763 0.683417 9.19763 1.31658 8.8071 1.70711L6.91421 3.6H11.8404C14.3368 3.6 16.5533 5.1975 17.3427 7.56588L17.4487 7.88377C17.6233 8.40772 17.3402 8.97404 16.8162 9.14868C16.2923 9.32333 15.726 9.04017 15.5513 8.51623L15.4453 8.19834C14.9281 6.64664 13.476 5.6 11.8404 5.6H6.91421L8.8071 7.49289C9.19763 7.88342 9.19763 8.51658 8.8071 8.90711C8.41658 9.29763 7.78341 9.29763 7.39289 8.90711L3.79289 5.30711C3.40236 4.91658 3.40236 4.28342 3.79289 3.89289L7.39289 0.292893C7.78341 -0.0976311 8.41658 -0.0976311 8.8071 0.292893ZM4.18377 10.8513C4.70771 10.6767 5.27403 10.9598 5.44868 11.4838L5.55464 11.8017C6.07188 13.3534 7.52401 14.4 9.15964 14.4L14.0858 14.4L12.1929 12.5071C11.8024 12.1166 11.8024 11.4834 12.1929 11.0929C12.5834 10.7024 13.2166 10.7024 13.6071 11.0929L17.2071 14.6929C17.5976 15.0834 17.5976 15.7166 17.2071 16.1071L13.6071 19.7071C13.2166 20.0976 12.5834 20.0976 12.1929 19.7071C11.8024 19.3166 11.8024 18.6834 12.1929 18.2929L14.0858 16.4L9.15964 16.4C6.66314 16.4 4.44674 14.8025 3.65728 12.4341L3.55131 12.1162C3.37667 11.5923 3.65983 11.026 4.18377 10.8513Z"
  /></svg
>`,I5=Object.freeze({__proto__:null,recycleHorizontalSvg:N5}),S5=U`<svg fill="none" viewBox="0 0 14 16">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3.94 1.04a1 1 0 0 1 .7 1.23l-.48 1.68a5.85 5.85 0 0 1 8.53 4.32 5.86 5.86 0 0 1-11.4 2.56 1 1 0 0 1 1.9-.57 3.86 3.86 0 1 0 1.83-4.5l1.87.53a1 1 0 0 1-.55 1.92l-4.1-1.15a1 1 0 0 1-.69-1.23l1.16-4.1a1 1 0 0 1 1.23-.7Z"
    clip-rule="evenodd"
  />
</svg>`,_5=Object.freeze({__proto__:null,refreshSvg:S5}),O5=U`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M9.36 4.21a5.14 5.14 0 1 0 0 10.29 5.14 5.14 0 0 0 0-10.29ZM1.64 9.36a7.71 7.71 0 1 1 14 4.47l2.52 2.5a1.29 1.29 0 1 1-1.82 1.83l-2.51-2.51A7.71 7.71 0 0 1 1.65 9.36Z"
    clip-rule="evenodd"
  />
</svg>`,T5=Object.freeze({__proto__:null,searchSvg:O5}),P5=U`<svg fill="none" viewBox="0 0 21 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M14.3808 4.34812C13.72 4.47798 12.8501 4.7587 11.5748 5.17296L9.00869 6.00646C6.90631 6.68935 5.40679 7.17779 4.38121 7.63178C3.87166 7.85734 3.5351 8.05091 3.32022 8.22035C3.11183 8.38466 3.07011 8.48486 3.05969 8.51817C2.98058 8.77103 2.98009 9.04195 3.05831 9.29509C3.06861 9.32844 3.10998 9.42878 3.31777 9.59384C3.53205 9.76404 3.86792 9.95881 4.37667 10.1862C5.29287 10.5957 6.58844 11.0341 8.35529 11.6164L10.8876 8.59854C11.2426 8.17547 11.8733 8.12028 12.2964 8.47528C12.7195 8.83029 12.7746 9.46104 12.4196 9.88412L9.88738 12.9019C10.7676 14.5408 11.4244 15.7406 11.9867 16.5718C12.299 17.0333 12.5491 17.3303 12.7539 17.5117C12.9526 17.6877 13.0586 17.711 13.0932 17.7154C13.3561 17.7484 13.6228 17.7009 13.8581 17.5791C13.8891 17.563 13.9805 17.5046 14.1061 17.2708C14.2357 17.0298 14.3679 16.6647 14.5015 16.1237C14.7705 15.0349 14.9912 13.4733 15.2986 11.2843L15.6738 8.61249C15.8603 7.28456 15.9857 6.37917 15.9989 5.7059C16.012 5.03702 15.9047 4.8056 15.8145 4.69183C15.7044 4.55297 15.5673 4.43792 15.4114 4.35365C15.2837 4.28459 15.0372 4.2191 14.3808 4.34812ZM7.99373 13.603C6.11919 12.9864 4.6304 12.4902 3.5606 12.0121C2.98683 11.7557 2.4778 11.4808 2.07383 11.1599C1.66337 10.8339 1.31312 10.4217 1.14744 9.88551C0.949667 9.24541 0.950886 8.56035 1.15094 7.92096C1.31852 7.38534 1.67024 6.97442 2.08185 6.64985C2.48697 6.33041 2.99697 6.05734 3.57166 5.80295C4.70309 5.3021 6.30179 4.78283 8.32903 4.12437L11.0196 3.25042C12.2166 2.86159 13.2017 2.54158 13.9951 2.38566C14.8065 2.22618 15.6202 2.19289 16.3627 2.59437C16.7568 2.80747 17.1035 3.09839 17.3818 3.4495C17.9062 4.111 18.0147 4.91815 17.9985 5.74496C17.9827 6.55332 17.8386 7.57903 17.6636 8.82534L17.2701 11.6268C16.9737 13.7376 16.7399 15.4022 16.4432 16.6034C16.2924 17.2135 16.1121 17.7632 15.8678 18.2176C15.6197 18.6794 15.2761 19.0971 14.7777 19.3551C14.1827 19.6632 13.5083 19.7833 12.8436 19.6997C12.2867 19.6297 11.82 19.3563 11.4277 19.0087C11.0415 18.6666 10.6824 18.213 10.3302 17.6925C9.67361 16.722 8.92648 15.342 7.99373 13.603Z"
    clip-rule="evenodd"
  />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
  ></svg></svg
>`,R5=Object.freeze({__proto__:null,sendSvg:P5}),$5=U`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M6.76.3a1 1 0 0 1 0 1.4L4.07 4.4h9a1 1 0 1 1 0 2h-9l2.69 2.68a1 1 0 1 1-1.42 1.42L.95 6.09a1 1 0 0 1 0-1.4l4.4-4.4a1 1 0 0 1 1.4 0Zm6.49 9.21a1 1 0 0 1 1.41 0l4.39 4.4a1 1 0 0 1 0 1.4l-4.39 4.4a1 1 0 0 1-1.41-1.42l2.68-2.68h-9a1 1 0 0 1 0-2h9l-2.68-2.68a1 1 0 0 1 0-1.42Z"
    clip-rule="evenodd"
  />
</svg>`,L5=Object.freeze({__proto__:null,swapHorizontalSvg:$5}),B5=U`<svg
  width="14"
  height="14"
  viewBox="0 0 14 14"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M13.7306 3.24213C14.0725 3.58384 14.0725 4.13786 13.7306 4.47957L10.7418 7.46737C10.4 7.80908 9.84581 7.80908 9.50399 7.46737C9.16216 7.12567 9.16216 6.57165 9.50399 6.22994L10.9986 4.73585H5.34082C4.85741 4.73585 4.46553 4.3441 4.46553 3.86085C4.46553 3.3776 4.85741 2.98585 5.34082 2.98585L10.9986 2.98585L9.50399 1.49177C9.16216 1.15006 9.16216 0.596037 9.50399 0.254328C9.84581 -0.0873803 10.4 -0.0873803 10.7418 0.254328L13.7306 3.24213ZM9.52515 10.1352C9.52515 10.6185 9.13327 11.0102 8.64986 11.0102L2.9921 11.0102L4.48669 12.5043C4.82852 12.846 4.82852 13.4001 4.48669 13.7418C4.14487 14.0835 3.59066 14.0835 3.24884 13.7418L0.26003 10.754C0.0958806 10.5899 0.0036621 10.3673 0.00366211 10.1352C0.00366212 9.90318 0.0958806 9.68062 0.26003 9.51652L3.24884 6.52872C3.59066 6.18701 4.14487 6.18701 4.48669 6.52872C4.82851 6.87043 4.82851 7.42445 4.48669 7.76616L2.9921 9.26024L8.64986 9.26024C9.13327 9.26024 9.52515 9.65199 9.52515 10.1352Z"
    fill="currentColor"
  />
</svg>

`,M5=Object.freeze({__proto__:null,swapHorizontalMediumSvg:B5}),U5=U`<svg width="10" height="10" viewBox="0 0 10 10">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3.77986 0.566631C4.0589 0.845577 4.0589 1.29784 3.77986 1.57678L3.08261 2.2738H6.34184C6.73647 2.2738 7.05637 2.5936 7.05637 2.98808C7.05637 3.38257 6.73647 3.70237 6.34184 3.70237H3.08261L3.77986 4.39938C4.0589 4.67833 4.0589 5.13059 3.77986 5.40954C3.50082 5.68848 3.04841 5.68848 2.76937 5.40954L0.852346 3.49316C0.573306 3.21421 0.573306 2.76195 0.852346 2.48301L2.76937 0.566631C3.04841 0.287685 3.50082 0.287685 3.77986 0.566631ZM6.22 4.59102C6.49904 4.31208 6.95145 4.31208 7.23049 4.59102L9.14751 6.5074C9.42655 6.78634 9.42655 7.23861 9.14751 7.51755L7.23049 9.43393C6.95145 9.71287 6.49904 9.71287 6.22 9.43393C5.94096 9.15498 5.94096 8.70272 6.22 8.42377L6.91725 7.72676L3.65802 7.72676C3.26339 7.72676 2.94349 7.40696 2.94349 7.01247C2.94349 6.61798 3.26339 6.29819 3.65802 6.29819L6.91725 6.29819L6.22 5.60117C5.94096 5.32223 5.94096 4.86997 6.22 4.59102Z"
    clip-rule="evenodd"
  />
</svg>`,z5=Object.freeze({__proto__:null,swapHorizontalBoldSvg:U5}),D5=U`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path 
    fill="currentColor"
    fill-rule="evenodd" 
    clip-rule="evenodd" 
    d="M8.3071 0.292893C8.69763 0.683417 8.69763 1.31658 8.3071 1.70711L6.41421 3.6H11.3404C13.8368 3.6 16.0533 5.1975 16.8427 7.56588L16.9487 7.88377C17.1233 8.40772 16.8402 8.97404 16.3162 9.14868C15.7923 9.32333 15.226 9.04017 15.0513 8.51623L14.9453 8.19834C14.4281 6.64664 12.976 5.6 11.3404 5.6H6.41421L8.3071 7.49289C8.69763 7.88342 8.69763 8.51658 8.3071 8.90711C7.91658 9.29763 7.28341 9.29763 6.89289 8.90711L3.29289 5.30711C2.90236 4.91658 2.90236 4.28342 3.29289 3.89289L6.89289 0.292893C7.28341 -0.0976311 7.91658 -0.0976311 8.3071 0.292893ZM3.68377 10.8513C4.20771 10.6767 4.77403 10.9598 4.94868 11.4838L5.05464 11.8017C5.57188 13.3534 7.024 14.4 8.65964 14.4L13.5858 14.4L11.6929 12.5071C11.3024 12.1166 11.3024 11.4834 11.6929 11.0929C12.0834 10.7024 12.7166 10.7024 13.1071 11.0929L16.7071 14.6929C17.0976 15.0834 17.0976 15.7166 16.7071 16.1071L13.1071 19.7071C12.7166 20.0976 12.0834 20.0976 11.6929 19.7071C11.3024 19.3166 11.3024 18.6834 11.6929 18.2929L13.5858 16.4L8.65964 16.4C6.16314 16.4 3.94674 14.8025 3.15728 12.4341L3.05131 12.1162C2.87667 11.5923 3.15983 11.026 3.68377 10.8513Z" 
  />
</svg>`,j5=Object.freeze({__proto__:null,swapHorizontalRoundedBoldSvg:D5}),W5=U`<svg fill="none" viewBox="0 0 14 14">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M3.48 2.18a1 1 0 0 1 1.41 0l2.68 2.68a1 1 0 1 1-1.41 1.42l-.98-.98v4.56a1 1 0 0 1-2 0V5.3l-.97.98A1 1 0 0 1 .79 4.86l2.69-2.68Zm6.34 2.93a1 1 0 0 1 1 1v4.56l.97-.98a1 1 0 1 1 1.42 1.42l-2.69 2.68a1 1 0 0 1-1.41 0l-2.68-2.68a1 1 0 0 1 1.41-1.42l.98.98V6.1a1 1 0 0 1 1-1Z"
    clip-rule="evenodd"
  />
</svg>`,H5=Object.freeze({__proto__:null,swapVerticalSvg:W5}),F5=U`<svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <g clip-path="url(#a)">
    <path fill="url(#b)" d="M0 0h32v32H0z"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.034 15.252c4.975-2.167 8.293-3.596 9.953-4.287 4.74-1.971 5.725-2.314 6.366-2.325.142-.002.457.033.662.198.172.14.22.33.243.463.022.132.05.435.028.671-.257 2.7-1.368 9.248-1.933 12.27-.24 1.28-.71 1.708-1.167 1.75-.99.091-1.743-.655-2.703-1.284-1.502-.985-2.351-1.598-3.81-2.558-1.684-1.11-.592-1.721.368-2.718.252-.261 4.619-4.233 4.703-4.594.01-.045.02-.213-.08-.301-.1-.09-.246-.059-.353-.035-.15.034-2.55 1.62-7.198 4.758-.682.468-1.298.696-1.851.684-.61-.013-1.782-.344-2.653-.628-1.069-.347-1.918-.53-1.845-1.12.039-.308.462-.623 1.27-.944Z" fill="#fff"/>
  </g>
  <path d="M.5 16C.5 7.44 7.44.5 16 .5 24.56.5 31.5 7.44 31.5 16c0 8.56-6.94 15.5-15.5 15.5C7.44 31.5.5 24.56.5 16Z" stroke="#141414" stroke-opacity=".05"/>
  <defs>
    <linearGradient id="b" x1="1600" y1="0" x2="1600" y2="3176.27" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2AABEE"/>
      <stop offset="1" stop-color="#229ED9"/>
    </linearGradient>
    <clipPath id="a">
      <path d="M0 16C0 7.163 7.163 0 16 0s16 7.163 16 16-7.163 16-16 16S0 24.837 0 16Z" fill="#fff"/>
    </clipPath>
  </defs>
</svg>`,V5=Object.freeze({__proto__:null,telegramSvg:F5}),Z5=U`<svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 3.71875C6.0335 3.71875 5.25 2.93525 5.25 1.96875C5.25 1.00225 6.0335 0.21875 7 0.21875C7.9665 0.21875 8.75 1.00225 8.75 1.96875C8.75 2.93525 7.9665 3.71875 7 3.71875Z" fill="#949E9E"/>
  <path d="M7 8.96875C6.0335 8.96875 5.25 8.18525 5.25 7.21875C5.25 6.25225 6.0335 5.46875 7 5.46875C7.9665 5.46875 8.75 6.25225 8.75 7.21875C8.75 8.18525 7.9665 8.96875 7 8.96875Z" fill="#949E9E"/>
  <path d="M5.25 12.4688C5.25 13.4352 6.0335 14.2187 7 14.2187C7.9665 14.2187 8.75 13.4352 8.75 12.4688C8.75 11.5023 7.9665 10.7188 7 10.7188C6.0335 10.7188 5.25 11.5023 5.25 12.4688Z" fill="#949E9E"/>
</svg>`,q5=Object.freeze({__proto__:null,threeDotsSvg:Z5}),G5=U`<svg fill="none" viewBox="0 0 40 40">
  <g clip-path="url(#a)">
    <g clip-path="url(#b)">
      <circle cx="20" cy="19.89" r="20" fill="#5A3E85" />
      <g clip-path="url(#c)">
        <path
          fill="#fff"
          d="M18.22 25.7 20 23.91h3.34l2.1-2.1v-6.68H15.4v8.78h2.82v1.77Zm3.87-8.16h1.25v3.66H22.1v-3.66Zm-3.34 0H20v3.66h-1.25v-3.66ZM20 7.9a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm6.69 14.56-3.66 3.66h-2.72l-1.77 1.78h-1.88V26.1H13.3v-9.82l.94-2.4H26.7v8.56Z"
        />
      </g>
    </g>
  </g>
  <defs>
    <clipPath id="a"><rect width="40" height="40" fill="#fff" rx="20" /></clipPath>
    <clipPath id="b"><path fill="#fff" d="M0 0h40v40H0z" /></clipPath>
    <clipPath id="c"><path fill="#fff" d="M8 7.89h24v24H8z" /></clipPath>
  </defs>
</svg>`,K5=Object.freeze({__proto__:null,twitchSvg:G5}),Y5=U`<svg fill="none" viewBox="0 0 41 40">
  <g clip-path="url(#a)">
    <path fill="#000" d="M.8 0h40v40H.8z" />
    <path
      fill="#fff"
      d="m22.63 18.46 7.14-8.3h-1.69l-6.2 7.2-4.96-7.2H11.2l7.5 10.9-7.5 8.71h1.7l6.55-7.61 5.23 7.61h5.72l-7.77-11.31Zm-9.13-7.03h2.6l11.98 17.13h-2.6L13.5 11.43Z"
    />
  </g>
  <defs>
    <clipPath id="a"><path fill="#fff" d="M.8 20a20 20 0 1 1 40 0 20 20 0 0 1-40 0Z" /></clipPath>
  </defs>
</svg>`,L0=Object.freeze({__proto__:null,xSvg:Y5}),J5=U`<svg fill="none" viewBox="0 0 16 16">
  <path
    fill="currentColor"
    d="m14.36 4.74.01.42c0 4.34-3.3 9.34-9.34 9.34A9.3 9.3 0 0 1 0 13.03a6.6 6.6 0 0 0 4.86-1.36 3.29 3.29 0 0 1-3.07-2.28c.5.1 1 .07 1.48-.06A3.28 3.28 0 0 1 .64 6.11v-.04c.46.26.97.4 1.49.41A3.29 3.29 0 0 1 1.11 2.1a9.32 9.32 0 0 0 6.77 3.43 3.28 3.28 0 0 1 5.6-3 6.59 6.59 0 0 0 2.08-.8 3.3 3.3 0 0 1-1.45 1.82A6.53 6.53 0 0 0 16 3.04c-.44.66-1 1.23-1.64 1.7Z"
  />
</svg>`,X5=Object.freeze({__proto__:null,twitterIconSvg:J5}),Q5=U`<svg fill="none" viewBox="0 0 28 28">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M18.1 4.76c-.42-.73-1.33-1.01-2.09-.66l-1.42.66c-.37.18-.8.18-1.18 0l-1.4-.65a1.63 1.63 0 0 0-2.1.66l-.84 1.45c-.2.34-.53.59-.92.67l-1.7.35c-.83.17-1.39.94-1.3 1.78l.19 1.56c.04.39-.08.78-.33 1.07l-1.12 1.3c-.52.6-.52 1.5 0 2.11L5 16.38c.25.3.37.68.33 1.06l-.18 1.57c-.1.83.46 1.6 1.28 1.78l1.7.35c.4.08.73.32.93.66l.84 1.43a1.63 1.63 0 0 0 2.09.66l1.41-.66c.37-.17.8-.17 1.18 0l1.43.67c.76.35 1.66.07 2.08-.65l.86-1.45c.2-.34.54-.58.92-.66l1.68-.35A1.63 1.63 0 0 0 22.84 19l-.18-1.57a1.4 1.4 0 0 1 .33-1.06l1.12-1.32c.52-.6.52-1.5 0-2.11l-1.12-1.3a1.4 1.4 0 0 1-.33-1.07l.18-1.57c.1-.83-.46-1.6-1.28-1.77l-1.68-.35a1.4 1.4 0 0 1-.92-.66l-.86-1.47Zm-3.27-3.2a4.43 4.43 0 0 1 5.69 1.78l.54.93 1.07.22a4.43 4.43 0 0 1 3.5 4.84l-.11.96.7.83a4.43 4.43 0 0 1 .02 5.76l-.72.85.1.96a4.43 4.43 0 0 1-3.5 4.84l-1.06.22-.54.92a4.43 4.43 0 0 1-5.68 1.77l-.84-.4-.82.39a4.43 4.43 0 0 1-5.7-1.79l-.51-.89-1.09-.22a4.43 4.43 0 0 1-3.5-4.84l.1-.96-.72-.85a4.43 4.43 0 0 1 .01-5.76l.71-.83-.1-.95a4.43 4.43 0 0 1 3.5-4.84l1.08-.23.53-.9a4.43 4.43 0 0 1 5.7-1.8l.81.38.83-.39ZM18.2 9.4c.65.42.84 1.28.42 1.93l-4.4 6.87a1.4 1.4 0 0 1-2.26.14L9.5 15.39a1.4 1.4 0 0 1 2.15-1.8l1.23 1.48 3.38-5.26a1.4 1.4 0 0 1 1.93-.42Z"
    clip-rule="evenodd"
  />
</svg>`,ev=Object.freeze({__proto__:null,verifySvg:Q5}),tv=U`<svg fill="none" viewBox="0 0 14 14">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="m4.1 12.43-.45-.78-.93-.2a1.65 1.65 0 0 1-1.31-1.8l.1-.86-.61-.71a1.65 1.65 0 0 1 0-2.16l.6-.7-.09-.85c-.1-.86.47-1.64 1.3-1.81l.94-.2.45-.78A1.65 1.65 0 0 1 6.23.9l.77.36.78-.36c.77-.36 1.69-.07 2.12.66l.47.8.91.2c.84.17 1.4.95 1.31 1.8l-.1.86.6.7c.54.62.54 1.54.01 2.16l-.6.71.09.86c.1.85-.47 1.63-1.3 1.8l-.92.2-.47.79a1.65 1.65 0 0 1-2.12.66L7 12.74l-.77.36c-.78.35-1.7.07-2.13-.67Zm5.74-6.9a1 1 0 1 0-1.68-1.07L6.32 7.3l-.55-.66a1 1 0 0 0-1.54 1.28l1.43 1.71a1 1 0 0 0 1.61-.1l2.57-4Z"
    clip-rule="evenodd"
  />
</svg>`,rv=Object.freeze({__proto__:null,verifyFilledSvg:tv}),ov=U`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M0 5.5c0-1.8 1.46-3.25 3.25-3.25H14.5c1.8 0 3.25 1.46 3.25 3.25v.28A3.25 3.25 0 0 1 20 8.88v2.24c0 1.45-.94 2.68-2.25 3.1v.28c0 1.8-1.46 3.25-3.25 3.25H3.25A3.25 3.25 0 0 1 0 14.5v-9Zm15.75 8.88h-2.38a4.38 4.38 0 0 1 0-8.76h2.38V5.5c0-.69-.56-1.25-1.25-1.25H3.25C2.56 4.25 2 4.81 2 5.5v9c0 .69.56 1.25 1.25 1.25H14.5c.69 0 1.25-.56 1.25-1.25v-.13Zm-2.38-6.76a2.37 2.37 0 1 0 0 4.75h3.38c.69 0 1.25-.55 1.25-1.24V8.87c0-.69-.56-1.24-1.25-1.24h-3.38Z"
    clip-rule="evenodd"
  />
</svg>`,nv=Object.freeze({__proto__:null,walletSvg:ov}),iv=U`<svg fill="none" viewBox="0 0 96 67">
  <path
    fill="currentColor"
    d="M25.32 18.8a32.56 32.56 0 0 1 45.36 0l1.5 1.47c.63.62.63 1.61 0 2.22l-5.15 5.05c-.31.3-.82.3-1.14 0l-2.07-2.03a22.71 22.71 0 0 0-31.64 0l-2.22 2.18c-.31.3-.82.3-1.14 0l-5.15-5.05a1.55 1.55 0 0 1 0-2.22l1.65-1.62Zm56.02 10.44 4.59 4.5c.63.6.63 1.6 0 2.21l-20.7 20.26c-.62.61-1.63.61-2.26 0L48.28 41.83a.4.4 0 0 0-.56 0L33.03 56.21c-.63.61-1.64.61-2.27 0L10.07 35.95a1.55 1.55 0 0 1 0-2.22l4.59-4.5a1.63 1.63 0 0 1 2.27 0L31.6 43.63a.4.4 0 0 0 .57 0l14.69-14.38a1.63 1.63 0 0 1 2.26 0l14.69 14.38a.4.4 0 0 0 .57 0l14.68-14.38a1.63 1.63 0 0 1 2.27 0Z"
  />
  <path
    stroke="#000"
    stroke-opacity=".1"
    d="M25.67 19.15a32.06 32.06 0 0 1 44.66 0l1.5 1.48c.43.42.43 1.09 0 1.5l-5.15 5.05a.31.31 0 0 1-.44 0l-2.07-2.03a23.21 23.21 0 0 0-32.34 0l-2.22 2.18a.31.31 0 0 1-.44 0l-5.15-5.05a1.05 1.05 0 0 1 0-1.5l1.65-1.63ZM81 29.6l4.6 4.5c.42.41.42 1.09 0 1.5l-20.7 20.26c-.43.43-1.14.43-1.57 0L48.63 41.47a.9.9 0 0 0-1.26 0L32.68 55.85c-.43.43-1.14.43-1.57 0L10.42 35.6a1.05 1.05 0 0 1 0-1.5l4.59-4.5a1.13 1.13 0 0 1 1.57 0l14.68 14.38a.9.9 0 0 0 1.27 0l-.35-.35.35.35L47.22 29.6a1.13 1.13 0 0 1 1.56 0l14.7 14.38a.9.9 0 0 0 1.26 0L79.42 29.6a1.13 1.13 0 0 1 1.57 0Z"
  />
</svg>`,sv=U`
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_22274_4692)">
<path d="M0 6.64C0 4.17295 0 2.93942 0.525474 2.01817C0.880399 1.39592 1.39592 0.880399 2.01817 0.525474C2.93942 0 4.17295 0 6.64 0H9.36C11.8271 0 13.0606 0 13.9818 0.525474C14.6041 0.880399 15.1196 1.39592 15.4745 2.01817C16 2.93942 16 4.17295 16 6.64V9.36C16 11.8271 16 13.0606 15.4745 13.9818C15.1196 14.6041 14.6041 15.1196 13.9818 15.4745C13.0606 16 11.8271 16 9.36 16H6.64C4.17295 16 2.93942 16 2.01817 15.4745C1.39592 15.1196 0.880399 14.6041 0.525474 13.9818C0 13.0606 0 11.8271 0 9.36V6.64Z" fill="#C7B994"/>
<path d="M4.49038 5.76609C6.42869 3.86833 9.5713 3.86833 11.5096 5.76609L11.7429 5.99449C11.8398 6.08938 11.8398 6.24323 11.7429 6.33811L10.9449 7.11942C10.8964 7.16686 10.8179 7.16686 10.7694 7.11942L10.4484 6.80512C9.09617 5.48119 6.90381 5.48119 5.5516 6.80512L5.20782 7.14171C5.15936 7.18915 5.08079 7.18915 5.03234 7.14171L4.23434 6.3604C4.13742 6.26552 4.13742 6.11167 4.23434 6.01678L4.49038 5.76609ZM13.1599 7.38192L13.8702 8.07729C13.9671 8.17217 13.9671 8.32602 13.8702 8.4209L10.6677 11.5564C10.5708 11.6513 10.4137 11.6513 10.3168 11.5564L8.04388 9.33105C8.01965 9.30733 7.98037 9.30733 7.95614 9.33105L5.6833 11.5564C5.58638 11.6513 5.42925 11.6513 5.33234 11.5564L2.12982 8.42087C2.0329 8.32598 2.0329 8.17213 2.12982 8.07724L2.84004 7.38188C2.93695 7.28699 3.09408 7.28699 3.191 7.38188L5.46392 9.60726C5.48815 9.63098 5.52743 9.63098 5.55166 9.60726L7.82447 7.38188C7.92138 7.28699 8.07851 7.28699 8.17543 7.38187L10.4484 9.60726C10.4726 9.63098 10.5119 9.63098 10.5361 9.60726L12.809 7.38192C12.9059 7.28703 13.063 7.28703 13.1599 7.38192Z" fill="#202020"/>
</g>
<defs>
<clipPath id="clip0_22274_4692">
<path d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z" fill="white"/>
</clipPath>
</defs>
</svg>
`,av=U`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11" cy="11" r="11" transform="matrix(-1 0 0 1 23 1)" fill="#202020"/>
<circle cx="11" cy="11" r="11.5" transform="matrix(-1 0 0 1 23 1)" stroke="#C7B994" stroke-opacity="0.7"/>
<path d="M15.4523 11.0686L16.7472 9.78167C13.8205 6.87297 10.1838 6.87297 7.25708 9.78167L8.55201 11.0686C10.7779 8.85645 13.2279 8.85645 15.4538 11.0686H15.4523Z" fill="#C7B994"/>
<path d="M15.0199 14.067L12 11.0656L8.98 14.067L5.96004 11.0656L4.66663 12.3511L8.98 16.6393L12 13.638L15.0199 16.6393L19.3333 12.3511L18.0399 11.0656L15.0199 14.067Z" fill="#C7B994"/>
</svg>
`,yc=Object.freeze({__proto__:null,walletConnectSvg:iv,walletConnectLightBrownSvg:sv,walletConnectBrownSvg:av}),cv=U`
  <svg fill="none" viewBox="0 0 48 44">
    <path
      style="fill: var(--wui-color-bg-300);"
      d="M4.56 8.64c-1.23 1.68-1.23 4.08-1.23 8.88v8.96c0 4.8 0 7.2 1.23 8.88.39.55.87 1.02 1.41 1.42C7.65 38 10.05 38 14.85 38h14.3c4.8 0 7.2 0 8.88-1.22a6.4 6.4 0 0 0 1.41-1.42c.83-1.14 1.1-2.6 1.19-4.92a6.4 6.4 0 0 0 5.16-4.65c.21-.81.21-1.8.21-3.79 0-1.98 0-2.98-.22-3.79a6.4 6.4 0 0 0-5.15-4.65c-.1-2.32-.36-3.78-1.19-4.92a6.4 6.4 0 0 0-1.41-1.42C36.35 6 33.95 6 29.15 6h-14.3c-4.8 0-7.2 0-8.88 1.22a6.4 6.4 0 0 0-1.41 1.42Z"
    />
    <path
      style="fill: var(--wui-color-fg-200);"
      fill-rule="evenodd"
      d="M2.27 11.33a6.4 6.4 0 0 1 6.4-6.4h26.66a6.4 6.4 0 0 1 6.4 6.4v1.7a6.4 6.4 0 0 1 5.34 6.3v5.34a6.4 6.4 0 0 1-5.34 6.3v1.7a6.4 6.4 0 0 1-6.4 6.4H8.67a6.4 6.4 0 0 1-6.4-6.4V11.33ZM39.6 31.07h-6.93a9.07 9.07 0 1 1 0-18.14h6.93v-1.6a4.27 4.27 0 0 0-4.27-4.26H8.67a4.27 4.27 0 0 0-4.27 4.26v21.34a4.27 4.27 0 0 0 4.27 4.26h26.66a4.27 4.27 0 0 0 4.27-4.26v-1.6Zm-6.93-16a6.93 6.93 0 0 0 0 13.86h8a4.27 4.27 0 0 0 4.26-4.26v-5.34a4.27 4.27 0 0 0-4.26-4.26h-8Z"
      clip-rule="evenodd"
    />
  </svg>
`,lv=Object.freeze({__proto__:null,walletPlaceholderSvg:cv}),dv=U`<svg fill="none" viewBox="0 0 20 20">
  <path
    fill="currentColor"
    d="M11 6.67a1 1 0 1 0-2 0v2.66a1 1 0 0 0 2 0V6.67ZM10 14.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
  />
  <path
    fill="currentColor"
    fill-rule="evenodd"
    d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-7 9a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z"
    clip-rule="evenodd"
  />
</svg>`,uv=Object.freeze({__proto__:null,warningCircleSvg:dv}),hv=U`<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.125 6.875C9.125 6.57833 9.21298 6.28832 9.3778 6.04165C9.54262 5.79497 9.77689 5.60271 10.051 5.48918C10.3251 5.37565 10.6267 5.34594 10.9176 5.40382C11.2086 5.4617 11.4759 5.60456 11.6857 5.81434C11.8954 6.02412 12.0383 6.29139 12.0962 6.58236C12.1541 6.87334 12.1244 7.17494 12.0108 7.44903C11.8973 7.72311 11.705 7.95738 11.4584 8.1222C11.2117 8.28703 10.9217 8.375 10.625 8.375C10.2272 8.375 9.84565 8.21696 9.56434 7.93566C9.28304 7.65436 9.125 7.27282 9.125 6.875ZM21.125 11C21.125 13.0025 20.5312 14.9601 19.4186 16.6251C18.3061 18.2902 16.7248 19.5879 14.8747 20.3543C13.0246 21.1206 10.9888 21.3211 9.02471 20.9305C7.06066 20.5398 5.25656 19.5755 3.84055 18.1595C2.42454 16.7435 1.46023 14.9393 1.06955 12.9753C0.678878 11.0112 0.879387 8.97543 1.64572 7.12533C2.41206 5.27523 3.70981 3.69392 5.37486 2.58137C7.0399 1.46882 8.99747 0.875 11 0.875C13.6844 0.877978 16.258 1.94567 18.1562 3.84383C20.0543 5.74199 21.122 8.3156 21.125 11ZM18.875 11C18.875 9.44247 18.4131 7.91992 17.5478 6.62488C16.6825 5.32985 15.4526 4.32049 14.0136 3.72445C12.5747 3.12841 10.9913 2.97246 9.46367 3.27632C7.93607 3.58017 6.53288 4.3302 5.43154 5.43153C4.3302 6.53287 3.58018 7.93606 3.27632 9.46366C2.97246 10.9913 3.12841 12.5747 3.72445 14.0136C4.32049 15.4526 5.32985 16.6825 6.62489 17.5478C7.91993 18.4131 9.44248 18.875 11 18.875C13.0879 18.8728 15.0896 18.0424 16.566 16.566C18.0424 15.0896 18.8728 13.0879 18.875 11ZM12.125 14.4387V11.375C12.125 10.8777 11.9275 10.4008 11.5758 10.0492C11.2242 9.69754 10.7473 9.5 10.25 9.5C9.98433 9.4996 9.72708 9.59325 9.52383 9.76435C9.32058 9.93544 9.18444 10.173 9.13952 10.4348C9.09461 10.6967 9.14381 10.966 9.27843 11.195C9.41304 11.4241 9.62438 11.5981 9.875 11.6863V14.75C9.875 15.2473 10.0725 15.7242 10.4242 16.0758C10.7758 16.4275 11.2527 16.625 11.75 16.625C12.0157 16.6254 12.2729 16.5318 12.4762 16.3607C12.6794 16.1896 12.8156 15.952 12.8605 15.6902C12.9054 15.4283 12.8562 15.159 12.7216 14.93C12.587 14.7009 12.3756 14.5269 12.125 14.4387Z" fill="currentColor"/>
</svg>`,pv=Object.freeze({__proto__:null,infoSvg:hv}),gv=U`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.0162 11.6312L9.55059 2.13937C9.39228 1.86862 9.16584 1.64405 8.8938 1.48798C8.62176 1.33192 8.3136 1.2498 7.99997 1.2498C7.68634 1.2498 7.37817 1.33192 7.10613 1.48798C6.83409 1.64405 6.60765 1.86862 6.44934 2.13937L0.983716 11.6312C0.830104 11.894 0.749146 12.1928 0.749146 12.4972C0.749146 12.8015 0.830104 13.1004 0.983716 13.3631C1.14027 13.6352 1.3664 13.8608 1.63889 14.0166C1.91139 14.1725 2.22044 14.253 2.53434 14.25H13.4656C13.7793 14.2528 14.0881 14.1721 14.3603 14.0163C14.6326 13.8604 14.8585 13.635 15.015 13.3631C15.1688 13.1005 15.2499 12.8017 15.2502 12.4973C15.2504 12.193 15.1696 11.8941 15.0162 11.6312ZM13.7162 12.6125C13.6908 12.6558 13.6541 12.6914 13.6101 12.7157C13.5661 12.7399 13.5164 12.7517 13.4662 12.75H2.53434C2.48415 12.7517 2.43442 12.7399 2.39042 12.7157C2.34641 12.6914 2.30976 12.6558 2.28434 12.6125C2.26278 12.5774 2.25137 12.5371 2.25137 12.4959C2.25137 12.4548 2.26278 12.4144 2.28434 12.3794L7.74997 2.88749C7.77703 2.84583 7.81408 2.8116 7.85774 2.7879C7.9014 2.7642 7.95029 2.75178 7.99997 2.75178C8.04964 2.75178 8.09854 2.7642 8.1422 2.7879C8.18586 2.8116 8.2229 2.84583 8.24997 2.88749L13.715 12.3794C13.7367 12.4143 13.7483 12.4546 13.7486 12.4958C13.7488 12.5369 13.7376 12.5773 13.7162 12.6125ZM7.24997 8.49999V6.49999C7.24997 6.30108 7.32898 6.11031 7.46964 5.96966C7.61029 5.82901 7.80105 5.74999 7.99997 5.74999C8.19888 5.74999 8.38964 5.82901 8.5303 5.96966C8.67095 6.11031 8.74997 6.30108 8.74997 6.49999V8.49999C8.74997 8.6989 8.67095 8.88967 8.5303 9.03032C8.38964 9.17097 8.19888 9.24999 7.99997 9.24999C7.80105 9.24999 7.61029 9.17097 7.46964 9.03032C7.32898 8.88967 7.24997 8.6989 7.24997 8.49999ZM8.99997 11C8.99997 11.1978 8.94132 11.3911 8.83144 11.5556C8.72155 11.72 8.56538 11.8482 8.38265 11.9239C8.19992 11.9996 7.99886 12.0194 7.80488 11.9808C7.6109 11.9422 7.43271 11.847 7.29286 11.7071C7.15301 11.5672 7.05777 11.3891 7.01918 11.1951C6.9806 11.0011 7.0004 10.8 7.07609 10.6173C7.15177 10.4346 7.27995 10.2784 7.4444 10.1685C7.60885 10.0586 7.80219 9.99999 7.99997 9.99999C8.26518 9.99999 8.51954 10.1053 8.70707 10.2929C8.89461 10.4804 8.99997 10.7348 8.99997 11Z" fill="currentColor"/>
</svg>
`,fv=Object.freeze({__proto__:null,exclamationTriangleSvg:gv}),wv=U`<svg width="60" height="16" viewBox="0 0 60 16" fill="none"">
  <path d="M9.3335 4.66667C9.3335 2.08934 11.4229 0 14.0002 0H20.6669C23.2442 0 25.3335 2.08934 25.3335 4.66667V11.3333C25.3335 13.9106 23.2442 16 20.6669 16H14.0002C11.4229 16 9.3335 13.9106 9.3335 11.3333V4.66667Z" fill="#363636"/>
  <path d="M15.6055 11.0003L17.9448 4.66699H18.6316L16.2923 11.0003H15.6055Z" fill="#F6F6F6"/>
  <path d="M0 4.33333C0 1.9401 1.9401 0 4.33333 0C6.72657 0 8.66669 1.9401 8.66669 4.33333V11.6667C8.66669 14.0599 6.72657 16 4.33333 16C1.9401 16 0 14.0599 0 11.6667V4.33333Z" fill="#363636"/>
  <path d="M3.9165 9.99934V9.16602H4.74983V9.99934H3.9165Z" fill="#F6F6F6"/>
  <path d="M26 8C26 3.58172 29.3517 0 33.4863 0H52.5137C56.6483 0 60 3.58172 60 8C60 12.4183 56.6483 16 52.5137 16H33.4863C29.3517 16 26 12.4183 26 8Z" fill="#363636"/>
  <path d="M49.3687 9.95834V6.26232H50.0213V6.81966C50.256 6.40899 50.7326 6.16699 51.2606 6.16699C52.0599 6.16699 52.6173 6.67299 52.6173 7.65566V9.95834H51.972V7.69234C51.972 7.04696 51.6053 6.70966 51.07 6.70966C50.4906 6.70966 50.0213 7.17168 50.0213 7.82433V9.95834H49.3687Z" fill="#F6F6F6"/>
  <path d="M45.2538 9.95773L44.5718 6.26172H45.1877L45.6717 9.31242L46.3098 7.30306H46.9184L47.5491 9.29041L48.0404 6.26172H48.6564L47.9744 9.95773H47.2411L46.6178 8.03641L45.9871 9.95773H45.2538Z" fill="#F6F6F6"/>
  <path d="M42.3709 10.0536C41.2489 10.0536 40.5889 9.21765 40.5889 8.1103C40.5889 7.01035 41.2489 6.16699 42.3709 6.16699C43.4929 6.16699 44.1529 7.01035 44.1529 8.1103C44.1529 9.21765 43.4929 10.0536 42.3709 10.0536ZM42.3709 9.51096C43.1775 9.51096 43.4856 8.82164 43.4856 8.10296C43.4856 7.39163 43.1775 6.70966 42.3709 6.70966C41.5642 6.70966 41.2562 7.39163 41.2562 8.10296C41.2562 8.82164 41.5642 9.51096 42.3709 9.51096Z" fill="#F6F6F6"/>
  <path d="M38.2805 10.0536C37.1952 10.0536 36.5132 9.22499 36.5132 8.1103C36.5132 7.00302 37.1952 6.16699 38.2805 6.16699C39.1972 6.16699 40.0038 6.68766 39.9159 8.27896H37.1805C37.2319 8.96103 37.5472 9.5183 38.2805 9.5183C38.7718 9.5183 39.0945 9.21765 39.2045 8.87299H39.8499C39.7472 9.48903 39.1679 10.0536 38.2805 10.0536ZM37.1952 7.78765H39.2852C39.2338 7.04696 38.8892 6.70232 38.2805 6.70232C37.6132 6.70232 37.2832 7.18635 37.1952 7.78765Z" fill="#F6F6F6"/>
  <path d="M33.3828 9.95773V6.26172H34.0501V6.88506C34.2848 6.47439 34.6882 6.26172 35.1061 6.26172H35.9935V6.88506H35.0548C34.4682 6.88506 34.0501 7.26638 34.0501 8.00706V9.95773H33.3828Z" fill="#F6F6F6"/>
</svg>`,mv=Object.freeze({__proto__:null,reownSvg:wv});export{yv as EthereumProvider,b1 as OPTIONAL_EVENTS,v1 as OPTIONAL_METHODS,xc as REQUIRED_EVENTS,Cc as REQUIRED_METHODS,kc as default};
/*! Bundled license information:

@walletconnect/ethereum-provider/dist/index.es.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
  (**
  * @license
  * Copyright 2019 Google LLC
  * SPDX-License-Identifier: BSD-3-Clause
  *)
  (**
  * @license
  * Copyright 2017 Google LLC
  * SPDX-License-Identifier: BSD-3-Clause
  *)

@walletconnect/ethereum-provider/dist/index.es.js:
  (**
  * @license
  * Copyright 2017 Google LLC
  * SPDX-License-Identifier: BSD-3-Clause
  *)
  (**
  * @license
  * Copyright 2018 Google LLC
  * SPDX-License-Identifier: BSD-3-Clause
  *)
  (**
  * @license
  * Copyright 2020 Google LLC
  * SPDX-License-Identifier: BSD-3-Clause
  *)
  (**
  * @license
  * Copyright 2021 Google LLC
  * SPDX-License-Identifier: BSD-3-Clause
  *)
*/
