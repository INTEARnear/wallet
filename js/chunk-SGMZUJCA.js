import{P as pr}from"./chunk-NIKCAVDA.js";import{a as ve,b as Qe}from"./chunk-WGWCH7J2.js";import{c as It,f as Rt}from"./chunk-57YRCRKT.js";var mr=It((Wt,$t)=>{(function(e,t){typeof Wt=="object"&&typeof $t<"u"?$t.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis<"u"?globalThis:e||self).dayjs=t()})(Wt,function(){"use strict";var e=1e3,t=6e4,r=36e5,o="millisecond",n="second",a="minute",i="hour",s="day",d="week",u="month",p="quarter",m="year",A="date",H="Invalid Date",re=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,U=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,X={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(b){var h=["th","st","nd","rd"],f=b%100;return"["+b+(h[(f-20)%10]||h[f]||h[0])+"]"}},V=function(b,h,f){var S=String(b);return!S||S.length>=h?b:""+Array(h+1-S.length).join(f)+b},he={s:V,z:function(b){var h=-b.utcOffset(),f=Math.abs(h),S=Math.floor(f/60),g=f%60;return(h<=0?"+":"-")+V(S,2,"0")+":"+V(g,2,"0")},m:function b(h,f){if(h.date()<f.date())return-b(f,h);var S=12*(f.year()-h.year())+(f.month()-h.month()),g=h.clone().add(S,u),F=f-g<0,W=h.clone().add(S+(F?-1:1),u);return+(-(S+(f-g)/(F?g-W:W-g))||0)},a:function(b){return b<0?Math.ceil(b)||0:Math.floor(b)},p:function(b){return{M:u,y:m,w:d,d:s,D:A,h:i,m:a,s:n,ms:o,Q:p}[b]||String(b||"").toLowerCase().replace(/s$/,"")},u:function(b){return b===void 0}},ue="en",de={};de[ue]=X;var Oe="$isDayjsObject",He=function(b){return b instanceof $||!(!b||!b[Oe])},Le=function b(h,f,S){var g;if(!h)return ue;if(typeof h=="string"){var F=h.toLowerCase();de[F]&&(g=F),f&&(de[F]=f,g=F);var W=h.split("-");if(!g&&W.length>1)return b(W[0])}else{var ae=h.name;de[ae]=h,g=ae}return!S&&g&&(ue=g),g||!S&&ue},me=function(b,h){if(He(b))return b.clone();var f=typeof h=="object"?h:{};return f.date=b,f.args=arguments,new $(f)},E=he;E.l=Le,E.i=He,E.w=function(b,h){return me(b,{locale:h.$L,utc:h.$u,x:h.$x,$offset:h.$offset})};var $=function(){function b(f){this.$L=Le(f.locale,null,!0),this.parse(f),this.$x=this.$x||f.x||{},this[Oe]=!0}var h=b.prototype;return h.parse=function(f){this.$d=function(S){var g=S.date,F=S.utc;if(g===null)return new Date(NaN);if(E.u(g))return new Date;if(g instanceof Date)return new Date(g);if(typeof g=="string"&&!/Z$/i.test(g)){var W=g.match(re);if(W){var ae=W[2]-1||0,pe=(W[7]||"0").substring(0,3);return F?new Date(Date.UTC(W[1],ae,W[3]||1,W[4]||0,W[5]||0,W[6]||0,pe)):new Date(W[1],ae,W[3]||1,W[4]||0,W[5]||0,W[6]||0,pe)}}return new Date(g)}(f),this.init()},h.init=function(){var f=this.$d;this.$y=f.getFullYear(),this.$M=f.getMonth(),this.$D=f.getDate(),this.$W=f.getDay(),this.$H=f.getHours(),this.$m=f.getMinutes(),this.$s=f.getSeconds(),this.$ms=f.getMilliseconds()},h.$utils=function(){return E},h.isValid=function(){return this.$d.toString()!==H},h.isSame=function(f,S){var g=me(f);return this.startOf(S)<=g&&g<=this.endOf(S)},h.isAfter=function(f,S){return me(f)<this.startOf(S)},h.isBefore=function(f,S){return this.endOf(S)<me(f)},h.$g=function(f,S,g){return E.u(f)?this[S]:this.set(g,f)},h.unix=function(){return Math.floor(this.valueOf()/1e3)},h.valueOf=function(){return this.$d.getTime()},h.startOf=function(f,S){var g=this,F=!!E.u(S)||S,W=E.p(f),ae=function(Je,Ee){var Ke=E.w(g.$u?Date.UTC(g.$y,Ee,Je):new Date(g.$y,Ee,Je),g);return F?Ke:Ke.endOf(s)},pe=function(Je,Ee){return E.w(g.toDate()[Je].apply(g.toDate("s"),(F?[0,0,0,0]:[23,59,59,999]).slice(Ee)),g)},ge=this.$W,we=this.$M,_e=this.$D,ct="set"+(this.$u?"UTC":"");switch(W){case m:return F?ae(1,0):ae(31,11);case u:return F?ae(1,we):ae(0,we+1);case d:var Xe=this.$locale().weekStart||0,gt=(ge<Xe?ge+7:ge)-Xe;return ae(F?_e-gt:_e+(6-gt),we);case s:case A:return pe(ct+"Hours",0);case i:return pe(ct+"Minutes",1);case a:return pe(ct+"Seconds",2);case n:return pe(ct+"Milliseconds",3);default:return this.clone()}},h.endOf=function(f){return this.startOf(f,!1)},h.$set=function(f,S){var g,F=E.p(f),W="set"+(this.$u?"UTC":""),ae=(g={},g[s]=W+"Date",g[A]=W+"Date",g[u]=W+"Month",g[m]=W+"FullYear",g[i]=W+"Hours",g[a]=W+"Minutes",g[n]=W+"Seconds",g[o]=W+"Milliseconds",g)[F],pe=F===s?this.$D+(S-this.$W):S;if(F===u||F===m){var ge=this.clone().set(A,1);ge.$d[ae](pe),ge.init(),this.$d=ge.set(A,Math.min(this.$D,ge.daysInMonth())).$d}else ae&&this.$d[ae](pe);return this.init(),this},h.set=function(f,S){return this.clone().$set(f,S)},h.get=function(f){return this[E.p(f)]()},h.add=function(f,S){var g,F=this;f=Number(f);var W=E.p(S),ae=function(we){var _e=me(F);return E.w(_e.date(_e.date()+Math.round(we*f)),F)};if(W===u)return this.set(u,this.$M+f);if(W===m)return this.set(m,this.$y+f);if(W===s)return ae(1);if(W===d)return ae(7);var pe=(g={},g[a]=t,g[i]=r,g[n]=e,g)[W]||1,ge=this.$d.getTime()+f*pe;return E.w(ge,this)},h.subtract=function(f,S){return this.add(-1*f,S)},h.format=function(f){var S=this,g=this.$locale();if(!this.isValid())return g.invalidDate||H;var F=f||"YYYY-MM-DDTHH:mm:ssZ",W=E.z(this),ae=this.$H,pe=this.$m,ge=this.$M,we=g.weekdays,_e=g.months,ct=g.meridiem,Xe=function(Ee,Ke,wt,kt){return Ee&&(Ee[Ke]||Ee(S,F))||wt[Ke].slice(0,kt)},gt=function(Ee){return E.s(ae%12||12,Ee,"0")},Je=ct||function(Ee,Ke,wt){var kt=Ee<12?"AM":"PM";return wt?kt.toLowerCase():kt};return F.replace(U,function(Ee,Ke){return Ke||function(wt){switch(wt){case"YY":return String(S.$y).slice(-2);case"YYYY":return E.s(S.$y,4,"0");case"M":return ge+1;case"MM":return E.s(ge+1,2,"0");case"MMM":return Xe(g.monthsShort,ge,_e,3);case"MMMM":return Xe(_e,ge);case"D":return S.$D;case"DD":return E.s(S.$D,2,"0");case"d":return String(S.$W);case"dd":return Xe(g.weekdaysMin,S.$W,we,2);case"ddd":return Xe(g.weekdaysShort,S.$W,we,3);case"dddd":return we[S.$W];case"H":return String(ae);case"HH":return E.s(ae,2,"0");case"h":return gt(1);case"hh":return gt(2);case"a":return Je(ae,pe,!0);case"A":return Je(ae,pe,!1);case"m":return String(pe);case"mm":return E.s(pe,2,"0");case"s":return String(S.$s);case"ss":return E.s(S.$s,2,"0");case"SSS":return E.s(S.$ms,3,"0");case"Z":return W}return null}(Ee)||W.replace(":","")})},h.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},h.diff=function(f,S,g){var F,W=this,ae=E.p(S),pe=me(f),ge=(pe.utcOffset()-this.utcOffset())*t,we=this-pe,_e=function(){return E.m(W,pe)};switch(ae){case m:F=_e()/12;break;case u:F=_e();break;case p:F=_e()/3;break;case d:F=(we-ge)/6048e5;break;case s:F=(we-ge)/864e5;break;case i:F=we/r;break;case a:F=we/t;break;case n:F=we/e;break;default:F=we}return g?F:E.a(F)},h.daysInMonth=function(){return this.endOf(u).$D},h.$locale=function(){return de[this.$L]},h.locale=function(f,S){if(!f)return this.$L;var g=this.clone(),F=Le(f,S,!0);return F&&(g.$L=F),g},h.clone=function(){return E.w(this.$d,this)},h.toDate=function(){return new Date(this.valueOf())},h.toJSON=function(){return this.isValid()?this.toISOString():null},h.toISOString=function(){return this.$d.toISOString()},h.toString=function(){return this.$d.toUTCString()},b}(),B=$.prototype;return me.prototype=B,[["$ms",o],["$s",n],["$m",a],["$H",i],["$W",s],["$M",u],["$y",m],["$D",A]].forEach(function(b){B[b[1]]=function(h){return this.$g(h,b[0],b[1])}}),me.extend=function(b,h){return b.$i||(b(h,$,me),b.$i=!0),me},me.locale=Le,me.isDayjs=He,me.unix=function(b){return me(1e3*b)},me.en=de[ue],me.Ls=de,me.p={},me})});var fr=It((Ht,Kt)=>{(function(e,t){typeof Ht=="object"&&typeof Kt<"u"?Kt.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis<"u"?globalThis:e||self).dayjs_locale_en=t()})(Ht,function(){"use strict";return{name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],r=e%100;return"["+e+(t[(r-20)%10]||t[r]||t[0])+"]"}}})});var gr=It((Vt,jt)=>{(function(e,t){typeof Vt=="object"&&typeof jt<"u"?jt.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis<"u"?globalThis:e||self).dayjs_plugin_relativeTime=t()})(Vt,function(){"use strict";return function(e,t,r){e=e||{};var o=t.prototype,n={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function a(s,d,u,p){return o.fromToBase(s,d,u,p)}r.en.relativeTime=n,o.fromToBase=function(s,d,u,p,m){for(var A,H,re,U=u.$locale().relativeTime||n,X=e.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],V=X.length,he=0;he<V;he+=1){var ue=X[he];ue.d&&(A=p?r(s).diff(u,ue.d,!0):u.diff(s,ue.d,!0));var de=(e.rounding||Math.round)(Math.abs(A));if(re=A>0,de<=ue.r||!ue.r){de<=1&&he>0&&(ue=X[he-1]);var Oe=U[ue.l];m&&(de=m(""+de)),H=typeof Oe=="string"?Oe.replace("%d",de):Oe(de,d,ue.l,re);break}}if(d)return H;var He=re?U.future:U.past;return typeof He=="function"?He(H):He.replace("%s",H)},o.to=function(s,d){return a(s,d,this,!0)},o.from=function(s,d){return a(s,d,this)};var i=function(s){return s.$u?r.utc():r()};o.toNow=function(s){return this.to(i(this),s)},o.fromNow=function(s){return this.from(i(this),s)}}})});var wr=It((Gt,zt)=>{(function(e,t){typeof Gt=="object"&&typeof zt<"u"?zt.exports=t():typeof define=="function"&&define.amd?define(t):(e=typeof globalThis<"u"?globalThis:e||self).dayjs_plugin_updateLocale=t()})(Gt,function(){"use strict";return function(e,t,r){r.updateLocale=function(o,n){var a=r.Ls[o];if(a)return(n?Object.keys(n):[]).forEach(function(i){a[i]=n[i]}),a}}})});var Ze=Rt(mr(),1),hr=Rt(fr(),1),Cr=Rt(gr(),1),Er=Rt(wr(),1);Ze.default.extend(Cr.default);Ze.default.extend(Er.default);var $r={...hr.default,name:"en-web3-modal",relativeTime:{future:"in %s",past:"%s ago",s:"%d sec",m:"1 min",mm:"%d min",h:"1 hr",hh:"%d hrs",d:"1 d",dd:"%d d",M:"1 mo",MM:"%d mo",y:"1 yr",yy:"%d yr"}},Hr=["January","February","March","April","May","June","July","August","September","October","November","December"];Ze.default.locale("en-web3-modal",$r);var xt={getMonthNameByIndex(e){return Hr[e]},getYear(e=new Date().toISOString()){return(0,Ze.default)(e).year()},getRelativeDateFromNow(e){return(0,Ze.default)(e).locale("en-web3-modal").fromNow(!0)},formatDate(e,t="DD MMM"){return(0,Ze.default)(e).format(t)}};var J={WC_NAME_SUFFIX:".reown.id",WC_NAME_SUFFIX_LEGACY:".wcn.id",BLOCKCHAIN_API_RPC_URL:"https://rpc.walletconnect.org",PULSE_API_URL:"https://pulse.walletconnect.org",W3M_API_URL:"https://api.web3modal.org",CONNECTOR_ID:{WALLET_CONNECT:"walletConnect",INJECTED:"injected",WALLET_STANDARD:"announced",COINBASE:"coinbaseWallet",COINBASE_SDK:"coinbaseWalletSDK",SAFE:"safe",LEDGER:"ledger",OKX:"okx",EIP6963:"eip6963",AUTH:"ID_AUTH"},CONNECTOR_NAMES:{AUTH:"Auth"},AUTH_CONNECTOR_SUPPORTED_CHAINS:["eip155","solana"],LIMITS:{PENDING_TRANSACTIONS:99},CHAIN:{EVM:"eip155",SOLANA:"solana",POLKADOT:"polkadot",BITCOIN:"bip122"},CHAIN_NAME_MAP:{eip155:"EVM Networks",solana:"Solana",polkadot:"Polkadot",bip122:"Bitcoin",cosmos:"Cosmos"},ADAPTER_TYPES:{BITCOIN:"bitcoin",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5"},USDT_CONTRACT_ADDRESSES:["0xdac17f958d2ee523a2206206994597c13d831ec7","0xc2132d05d31c914a87c6611c10748aeb04b58e8f","0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7","0x919C1c267BC06a7039e03fcc2eF738525769109c","0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e","0x55d398326f99059fF775485246999027B3197955","0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"],HTTP_STATUS_CODES:{SERVICE_UNAVAILABLE:503,FORBIDDEN:403},UNSUPPORTED_NETWORK_NAME:"Unknown Network",SECURE_SITE_SDK_ORIGIN:(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org"};var Yt={caipNetworkIdToNumber(e){return e?Number(e.split(":")[1]):void 0},parseEvmChainId(e){return typeof e=="string"?this.caipNetworkIdToNumber(e):e},getNetworksByNamespace(e,t){return e?.filter(r=>r.chainNamespace===t)||[]},getFirstNetworkByNamespace(e,t){return this.getNetworksByNamespace(e,t)[0]},getNetworkNameByCaipNetworkId(e,t){if(!t)return;let r=e.find(n=>n.caipNetworkId===t);if(r)return r.name;let[o]=t.split(":");return J.CHAIN_NAME_MAP?.[o]||void 0}};var Kr=20,Vr=1,et=1e6,br=1e6,jr=-7,Gr=21,zr=!1,ht="[big.js] ",tt=ht+"Invalid ",Ut=tt+"decimal places",Yr=tt+"rounding mode",Ar=ht+"Division by zero",ee={},De=void 0,qr=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function Sr(){function e(t){var r=this;if(!(r instanceof e))return t===De?Sr():new e(t);if(t instanceof e)r.s=t.s,r.e=t.e,r.c=t.c.slice();else{if(typeof t!="string"){if(e.strict===!0&&typeof t!="bigint")throw TypeError(tt+"value");t=t===0&&1/t<0?"-0":String(t)}Xr(r,t)}r.constructor=e}return e.prototype=ee,e.DP=Kr,e.RM=Vr,e.NE=jr,e.PE=Gr,e.strict=zr,e.roundDown=0,e.roundHalfUp=1,e.roundHalfEven=2,e.roundUp=3,e}function Xr(e,t){var r,o,n;if(!qr.test(t))throw Error(tt+"number");for(e.s=t.charAt(0)=="-"?(t=t.slice(1),-1):1,(r=t.indexOf("."))>-1&&(t=t.replace(".","")),(o=t.search(/e/i))>0?(r<0&&(r=o),r+=+t.slice(o+1),t=t.substring(0,o)):r<0&&(r=t.length),n=t.length,o=0;o<n&&t.charAt(o)=="0";)++o;if(o==n)e.c=[e.e=0];else{for(;n>0&&t.charAt(--n)=="0";);for(e.e=r-o-1,e.c=[],r=0;o<=n;)e.c[r++]=+t.charAt(o++)}return e}function rt(e,t,r,o){var n=e.c;if(r===De&&(r=e.constructor.RM),r!==0&&r!==1&&r!==2&&r!==3)throw Error(Yr);if(t<1)o=r===3&&(o||!!n[0])||t===0&&(r===1&&n[0]>=5||r===2&&(n[0]>5||n[0]===5&&(o||n[1]!==De))),n.length=1,o?(e.e=e.e-t+1,n[0]=1):n[0]=e.e=0;else if(t<n.length){if(o=r===1&&n[t]>=5||r===2&&(n[t]>5||n[t]===5&&(o||n[t+1]!==De||n[t-1]&1))||r===3&&(o||!!n[0]),n.length=t,o){for(;++n[--t]>9;)if(n[t]=0,t===0){++e.e,n.unshift(1);break}}for(t=n.length;!n[--t];)n.pop()}return e}function ot(e,t,r){var o=e.e,n=e.c.join(""),a=n.length;if(t)n=n.charAt(0)+(a>1?"."+n.slice(1):"")+(o<0?"e":"e+")+o;else if(o<0){for(;++o;)n="0"+n;n="0."+n}else if(o>0)if(++o>a)for(o-=a;o--;)n+="0";else o<a&&(n=n.slice(0,o)+"."+n.slice(o));else a>1&&(n=n.charAt(0)+"."+n.slice(1));return e.s<0&&r?"-"+n:n}ee.abs=function(){var e=new this.constructor(this);return e.s=1,e};ee.cmp=function(e){var t,r=this,o=r.c,n=(e=new r.constructor(e)).c,a=r.s,i=e.s,s=r.e,d=e.e;if(!o[0]||!n[0])return o[0]?a:n[0]?-i:0;if(a!=i)return a;if(t=a<0,s!=d)return s>d^t?1:-1;for(i=(s=o.length)<(d=n.length)?s:d,a=-1;++a<i;)if(o[a]!=n[a])return o[a]>n[a]^t?1:-1;return s==d?0:s>d^t?1:-1};ee.div=function(e){var t=this,r=t.constructor,o=t.c,n=(e=new r(e)).c,a=t.s==e.s?1:-1,i=r.DP;if(i!==~~i||i<0||i>et)throw Error(Ut);if(!n[0])throw Error(Ar);if(!o[0])return e.s=a,e.c=[e.e=0],e;var s,d,u,p,m,A=n.slice(),H=s=n.length,re=o.length,U=o.slice(0,s),X=U.length,V=e,he=V.c=[],ue=0,de=i+(V.e=t.e-e.e)+1;for(V.s=a,a=de<0?0:de,A.unshift(0);X++<s;)U.push(0);do{for(u=0;u<10;u++){if(s!=(X=U.length))p=s>X?1:-1;else for(m=-1,p=0;++m<s;)if(n[m]!=U[m]){p=n[m]>U[m]?1:-1;break}if(p<0){for(d=X==s?n:A;X;){if(U[--X]<d[X]){for(m=X;m&&!U[--m];)U[m]=9;--U[m],U[X]+=10}U[X]-=d[X]}for(;!U[0];)U.shift()}else break}he[ue++]=p?u:++u,U[0]&&p?U[X]=o[H]||0:U=[o[H]]}while((H++<re||U[0]!==De)&&a--);return!he[0]&&ue!=1&&(he.shift(),V.e--,de--),ue>de&&rt(V,de,r.RM,U[0]!==De),V};ee.eq=function(e){return this.cmp(e)===0};ee.gt=function(e){return this.cmp(e)>0};ee.gte=function(e){return this.cmp(e)>-1};ee.lt=function(e){return this.cmp(e)<0};ee.lte=function(e){return this.cmp(e)<1};ee.minus=ee.sub=function(e){var t,r,o,n,a=this,i=a.constructor,s=a.s,d=(e=new i(e)).s;if(s!=d)return e.s=-d,a.plus(e);var u=a.c.slice(),p=a.e,m=e.c,A=e.e;if(!u[0]||!m[0])return m[0]?e.s=-d:u[0]?e=new i(a):e.s=1,e;if(s=p-A){for((n=s<0)?(s=-s,o=u):(A=p,o=m),o.reverse(),d=s;d--;)o.push(0);o.reverse()}else for(r=((n=u.length<m.length)?u:m).length,s=d=0;d<r;d++)if(u[d]!=m[d]){n=u[d]<m[d];break}if(n&&(o=u,u=m,m=o,e.s=-e.s),(d=(r=m.length)-(t=u.length))>0)for(;d--;)u[t++]=0;for(d=t;r>s;){if(u[--r]<m[r]){for(t=r;t&&!u[--t];)u[t]=9;--u[t],u[r]+=10}u[r]-=m[r]}for(;u[--d]===0;)u.pop();for(;u[0]===0;)u.shift(),--A;return u[0]||(e.s=1,u=[A=0]),e.c=u,e.e=A,e};ee.mod=function(e){var t,r=this,o=r.constructor,n=r.s,a=(e=new o(e)).s;if(!e.c[0])throw Error(Ar);return r.s=e.s=1,t=e.cmp(r)==1,r.s=n,e.s=a,t?new o(r):(n=o.DP,a=o.RM,o.DP=o.RM=0,r=r.div(e),o.DP=n,o.RM=a,this.minus(r.times(e)))};ee.neg=function(){var e=new this.constructor(this);return e.s=-e.s,e};ee.plus=ee.add=function(e){var t,r,o,n=this,a=n.constructor;if(e=new a(e),n.s!=e.s)return e.s=-e.s,n.minus(e);var i=n.e,s=n.c,d=e.e,u=e.c;if(!s[0]||!u[0])return u[0]||(s[0]?e=new a(n):e.s=n.s),e;if(s=s.slice(),t=i-d){for(t>0?(d=i,o=u):(t=-t,o=s),o.reverse();t--;)o.push(0);o.reverse()}for(s.length-u.length<0&&(o=u,u=s,s=o),t=u.length,r=0;t;s[t]%=10)r=(s[--t]=s[t]+u[t]+r)/10|0;for(r&&(s.unshift(r),++d),t=s.length;s[--t]===0;)s.pop();return e.c=s,e.e=d,e};ee.pow=function(e){var t=this,r=new t.constructor("1"),o=r,n=e<0;if(e!==~~e||e<-br||e>br)throw Error(tt+"exponent");for(n&&(e=-e);e&1&&(o=o.times(t)),e>>=1,!!e;)t=t.times(t);return n?r.div(o):o};ee.prec=function(e,t){if(e!==~~e||e<1||e>et)throw Error(tt+"precision");return rt(new this.constructor(this),e,t)};ee.round=function(e,t){if(e===De)e=0;else if(e!==~~e||e<-et||e>et)throw Error(Ut);return rt(new this.constructor(this),e+this.e+1,t)};ee.sqrt=function(){var e,t,r,o=this,n=o.constructor,a=o.s,i=o.e,s=new n("0.5");if(!o.c[0])return new n(o);if(a<0)throw Error(ht+"No square root");a=Math.sqrt(+ot(o,!0,!0)),a===0||a===1/0?(t=o.c.join(""),t.length+i&1||(t+="0"),a=Math.sqrt(t),i=((i+1)/2|0)-(i<0||i&1),e=new n((a==1/0?"5e":(a=a.toExponential()).slice(0,a.indexOf("e")+1))+i)):e=new n(a+""),i=e.e+(n.DP+=4);do r=e,e=s.times(r.plus(o.div(r)));while(r.c.slice(0,i).join("")!==e.c.slice(0,i).join(""));return rt(e,(n.DP-=4)+e.e+1,n.RM)};ee.times=ee.mul=function(e){var t,r=this,o=r.constructor,n=r.c,a=(e=new o(e)).c,i=n.length,s=a.length,d=r.e,u=e.e;if(e.s=r.s==e.s?1:-1,!n[0]||!a[0])return e.c=[e.e=0],e;for(e.e=d+u,i<s&&(t=n,n=a,a=t,u=i,i=s,s=u),t=new Array(u=i+s);u--;)t[u]=0;for(d=s;d--;){for(s=0,u=i+d;u>d;)s=t[u]+a[d]*n[u-d-1]+s,t[u--]=s%10,s=s/10|0;t[u]=s}for(s?++e.e:t.shift(),d=t.length;!t[--d];)t.pop();return e.c=t,e};ee.toExponential=function(e,t){var r=this,o=r.c[0];if(e!==De){if(e!==~~e||e<0||e>et)throw Error(Ut);for(r=rt(new r.constructor(r),++e,t);r.c.length<e;)r.c.push(0)}return ot(r,!0,!!o)};ee.toFixed=function(e,t){var r=this,o=r.c[0];if(e!==De){if(e!==~~e||e<0||e>et)throw Error(Ut);for(r=rt(new r.constructor(r),e+r.e+1,t),e=e+r.e+1;r.c.length<e;)r.c.push(0)}return ot(r,!1,!!o)};ee[Symbol.for("nodejs.util.inspect.custom")]=ee.toJSON=ee.toString=function(){var e=this,t=e.constructor;return ot(e,e.e<=t.NE||e.e>=t.PE,!!e.c[0])};ee.toNumber=function(){var e=+ot(this,!0,!0);if(this.constructor.strict===!0&&!this.eq(e.toString()))throw Error(ht+"Imprecise conversion");return e};ee.toPrecision=function(e,t){var r=this,o=r.constructor,n=r.c[0];if(e!==De){if(e!==~~e||e<1||e>et)throw Error(tt+"precision");for(r=rt(new o(r),e,t);r.c.length<e;)r.c.push(0)}return ot(r,e<=r.e||r.e<=o.NE||r.e>=o.PE,!!n)};ee.valueOf=function(){var e=this,t=e.constructor;if(t.strict===!0)throw Error(ht+"valueOf disallowed");return ot(e,e.e<=t.NE||e.e>=t.PE,!0)};var Jr=Sr(),lt=Jr;var Q={bigNumber(e){return e?new lt(e):new lt(0)},multiply(e,t){if(e===void 0||t===void 0)return new lt(0);let r=new lt(e),o=new lt(t);return r.times(o)},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})},parseLocalStringToNumber(e){return e===void 0?0:parseFloat(e.replace(/,/gu,""))}};var Qr={URLS:{FAQ:"https://walletconnect.com/faq"}};function ke(e,t){return t==="light"?{"--w3m-accent":e?.["--w3m-accent"]||"hsla(231, 100%, 70%, 1)","--w3m-background":"#fff"}:{"--w3m-accent":e?.["--w3m-accent"]||"hsla(230, 100%, 67%, 1)","--w3m-background":"#121313"}}var Zr={numericInputKeyDown(e,t,r){let o=["Backspace","Meta","Ctrl","a","A","c","C","x","X","v","V","ArrowLeft","ArrowRight","Tab"],n=e.metaKey||e.ctrlKey,a=e.key,i=a.toLocaleLowerCase(),s=i==="a",d=i==="c",u=i==="v",p=i==="x",m=a===",",A=a===".",H=a>="0"&&a<="9";!n&&(s||d||u||p)&&e.preventDefault(),t==="0"&&!m&&!A&&a==="0"&&e.preventDefault(),t==="0"&&H&&(r(a),e.preventDefault()),(m||A)&&(t||(r("0."),e.preventDefault()),(t?.includes(".")||t?.includes(","))&&e.preventDefault()),!H&&!o.includes(a)&&!A&&!m&&e.preventDefault()}};var Tr=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];var Nr=[{type:"function",name:"approve",stateMutability:"nonpayable",inputs:[{name:"spender",type:"address"},{name:"amount",type:"uint256"}],outputs:[{type:"bool"}]}];var yr=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"sender",type:"address"},{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];var qt={getERC20Abi:e=>J.USDT_CONTRACT_ADDRESSES.includes(e)?yr:Tr,getSwapAbi:()=>Nr};var eo={validateCaipAddress(e){if(e.split(":")?.length!==3)throw new Error("Invalid CAIP Address");return e},parseCaipAddress(e){let t=e.split(":");if(t.length!==3)throw new Error(`Invalid CAIP-10 address: ${e}`);let[r,o,n]=t;if(!r||!o||!n)throw new Error(`Invalid CAIP-10 address: ${e}`);return{chainNamespace:r,chainId:o,address:n}},parseCaipNetworkId(e){let t=e.split(":");if(t.length!==2)throw new Error(`Invalid CAIP-2 network id: ${e}`);let[r,o]=t;if(!r||!o)throw new Error(`Invalid CAIP-2 network id: ${e}`);return{chainNamespace:r,chainId:o}}};var D={WALLET_ID:"@appkit/wallet_id",WALLET_NAME:"@appkit/wallet_name",SOLANA_WALLET:"@appkit/solana_wallet",SOLANA_CAIP_CHAIN:"@appkit/solana_caip_chain",ACTIVE_CAIP_NETWORK_ID:"@appkit/active_caip_network_id",CONNECTED_SOCIAL:"@appkit/connected_social",CONNECTED_SOCIAL_USERNAME:"@appkit-wallet/SOCIAL_USERNAME",RECENT_WALLETS:"@appkit/recent_wallets",DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",ACTIVE_NAMESPACE:"@appkit/active_namespace",CONNECTED_NAMESPACES:"@appkit/connected_namespaces",CONNECTION_STATUS:"@appkit/connection_status",SIWX_AUTH_TOKEN:"@appkit/siwx-auth-token",SIWX_NONCE_TOKEN:"@appkit/siwx-nonce-token",TELEGRAM_SOCIAL_PROVIDER:"@appkit/social_provider",NATIVE_BALANCE_CACHE:"@appkit/native_balance_cache",PORTFOLIO_CACHE:"@appkit/portfolio_cache",ENS_CACHE:"@appkit/ens_cache",IDENTITY_CACHE:"@appkit/identity_cache",PREFERRED_ACCOUNT_TYPES:"@appkit/preferred_account_types",CONNECTIONS:"@appkit/connections"};function Ct(e){if(!e)throw new Error("Namespace is required for CONNECTED_CONNECTOR_ID");return`@appkit/${e}:connected_connector_id`}var P={setItem(e,t){nt()&&t!==void 0&&localStorage.setItem(e,t)},getItem(e){if(nt())return localStorage.getItem(e)||void 0},removeItem(e){nt()&&localStorage.removeItem(e)},clear(){nt()&&localStorage.clear()}};function nt(){return typeof window<"u"&&typeof localStorage<"u"}var Xt=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org",Jt=[{label:"Coinbase",name:"coinbase",feeRange:"1-2%",url:"",supportedChains:["eip155"]},{label:"Meld.io",name:"meld",feeRange:"1-2%",url:"https://meldcrypto.com",supportedChains:["eip155","solana"]}],_r="WXETMuFUQmqqybHuRkSgxv:25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU",le={FOUR_MINUTES_MS:24e4,TEN_SEC_MS:1e4,FIVE_SEC_MS:5e3,THREE_SEC_MS:3e3,ONE_SEC_MS:1e3,SECURE_SITE:Xt,SECURE_SITE_DASHBOARD:`${Xt}/dashboard`,SECURE_SITE_FAVICON:`${Xt}/images/favicon.png`,RESTRICTED_TIMEZONES:["ASIA/SHANGHAI","ASIA/URUMQI","ASIA/CHONGQING","ASIA/HARBIN","ASIA/KASHGAR","ASIA/MACAU","ASIA/HONG_KONG","ASIA/MACAO","ASIA/BEIJING","ASIA/HARBIN"],WC_COINBASE_PAY_SDK_CHAINS:["ethereum","arbitrum","polygon","berachain","avalanche-c-chain","optimism","celo","base"],WC_COINBASE_PAY_SDK_FALLBACK_CHAIN:"ethereum",WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP:{Ethereum:"ethereum","Arbitrum One":"arbitrum",Polygon:"polygon",Berachain:"berachain",Avalanche:"avalanche-c-chain","OP Mainnet":"optimism",Celo:"celo",Base:"base"},WC_COINBASE_ONRAMP_APP_ID:"bf18c88d-495a-463b-b249-0b9d3656cf5e",SWAP_SUGGESTED_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP"],SWAP_POPULAR_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP","METAL","DAI","CHAMP","WOLF","SALE","BAL","BUSD","MUST","BTCpx","ROUTE","HEX","WELT","amDAI","VSQ","VISION","AURUM","pSP","SNX","VC","LINK","CHP","amUSDT","SPHERE","FOX","GIDDY","GFC","OMEN","OX_OLD","DE","WNT"],BALANCE_SUPPORTED_CHAINS:["eip155","solana"],SWAP_SUPPORTED_NETWORKS:["eip155:1","eip155:42161","eip155:10","eip155:324","eip155:8453","eip155:56","eip155:137","eip155:100","eip155:43114","eip155:250","eip155:8217","eip155:1313161554"],NAMES_SUPPORTED_CHAIN_NAMESPACES:["eip155"],ONRAMP_SUPPORTED_CHAIN_NAMESPACES:["eip155","solana"],ACTIVITY_ENABLED_CHAIN_NAMESPACES:["eip155"],NATIVE_TOKEN_ADDRESS:{eip155:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",solana:"So11111111111111111111111111111111111111111",polkadot:"0x",bip122:"0x",cosmos:"0x"},CONVERT_SLIPPAGE_TOLERANCE:1,CONNECT_LABELS:{MOBILE:"Open and continue in the wallet app",WEB:"Open and continue in the wallet app"},SEND_SUPPORTED_NAMESPACES:["eip155","solana"],DEFAULT_REMOTE_FEATURES:{swaps:["1inch"],onramp:["coinbase","meld"],email:!0,socials:["google","x","discord","farcaster","github","apple","facebook"],activity:!0,reownBranding:!0},DEFAULT_REMOTE_FEATURES_DISABLED:{email:!1,socials:!1,swaps:!1,onramp:!1,activity:!1,reownBranding:!1},DEFAULT_FEATURES:{receive:!0,send:!0,emailShowWallets:!0,connectorTypeOrder:["walletConnect","recent","injected","featured","custom","external","recommended"],analytics:!0,allWallets:!0,legalCheckbox:!1,smartSessions:!1,collapseWallets:!1,walletFeaturesOrder:["onramp","swaps","receive","send"],connectMethodsOrder:void 0,pay:!1},DEFAULT_SOCIALS:["google","x","farcaster","discord","apple","github","facebook"],DEFAULT_ACCOUNT_TYPES:{bip122:"payment",eip155:"smartAccount",polkadot:"eoa",solana:"eoa"},ADAPTER_TYPES:{UNIVERSAL:"universal",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5",BITCOIN:"bitcoin"}};var N={cacheExpiry:{portfolio:3e4,nativeBalance:3e4,ens:3e5,identity:3e5},isCacheExpired(e,t){return Date.now()-e>t},getActiveNetworkProps(){let e=N.getActiveNamespace(),t=N.getActiveCaipNetworkId(),r=t?t.split(":")[1]:void 0,o=r?isNaN(Number(r))?r:Number(r):void 0;return{namespace:e,caipNetworkId:t,chainId:o}},setWalletConnectDeepLink({name:e,href:t}){try{P.setItem(D.DEEPLINK_CHOICE,JSON.stringify({href:t,name:e}))}catch{console.info("Unable to set WalletConnect deep link")}},getWalletConnectDeepLink(){try{let e=P.getItem(D.DEEPLINK_CHOICE);if(e)return JSON.parse(e)}catch{console.info("Unable to get WalletConnect deep link")}},deleteWalletConnectDeepLink(){try{P.removeItem(D.DEEPLINK_CHOICE)}catch{console.info("Unable to delete WalletConnect deep link")}},setActiveNamespace(e){try{P.setItem(D.ACTIVE_NAMESPACE,e)}catch{console.info("Unable to set active namespace")}},setActiveCaipNetworkId(e){try{P.setItem(D.ACTIVE_CAIP_NETWORK_ID,e),N.setActiveNamespace(e.split(":")[0])}catch{console.info("Unable to set active caip network id")}},getActiveCaipNetworkId(){try{return P.getItem(D.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to get active caip network id");return}},deleteActiveCaipNetworkId(){try{P.removeItem(D.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to delete active caip network id")}},deleteConnectedConnectorId(e){try{let t=Ct(e);P.removeItem(t)}catch{console.info("Unable to delete connected connector id")}},setAppKitRecent(e){try{let t=N.getRecentWallets();t.find(o=>o.id===e.id)||(t.unshift(e),t.length>2&&t.pop(),P.setItem(D.RECENT_WALLETS,JSON.stringify(t)))}catch{console.info("Unable to set AppKit recent")}},getRecentWallets(){try{let e=P.getItem(D.RECENT_WALLETS);return e?JSON.parse(e):[]}catch{console.info("Unable to get AppKit recent")}return[]},setConnectedConnectorId(e,t){try{let r=Ct(e);P.setItem(r,t)}catch{console.info("Unable to set Connected Connector Id")}},getActiveNamespace(){try{return P.getItem(D.ACTIVE_NAMESPACE)}catch{console.info("Unable to get active namespace")}},getConnectedConnectorId(e){if(e)try{let t=Ct(e);return P.getItem(t)}catch{console.info("Unable to get connected connector id in namespace ",e)}},setConnectedSocialProvider(e){try{P.setItem(D.CONNECTED_SOCIAL,e)}catch{console.info("Unable to set connected social provider")}},getConnectedSocialProvider(){try{return P.getItem(D.CONNECTED_SOCIAL)}catch{console.info("Unable to get connected social provider")}},deleteConnectedSocialProvider(){try{P.removeItem(D.CONNECTED_SOCIAL)}catch{console.info("Unable to delete connected social provider")}},getConnectedSocialUsername(){try{return P.getItem(D.CONNECTED_SOCIAL_USERNAME)}catch{console.info("Unable to get connected social username")}},getStoredActiveCaipNetworkId(){return P.getItem(D.ACTIVE_CAIP_NETWORK_ID)?.split(":")?.[1]},setConnectionStatus(e){try{P.setItem(D.CONNECTION_STATUS,e)}catch{console.info("Unable to set connection status")}},getConnectionStatus(){try{return P.getItem(D.CONNECTION_STATUS)}catch{return}},getConnectedNamespaces(){try{let e=P.getItem(D.CONNECTED_NAMESPACES);return e?.length?e.split(","):[]}catch{return[]}},setConnectedNamespaces(e){try{let t=Array.from(new Set(e));P.setItem(D.CONNECTED_NAMESPACES,t.join(","))}catch{console.info("Unable to set namespaces in storage")}},addConnectedNamespace(e){try{let t=N.getConnectedNamespaces();t.includes(e)||(t.push(e),N.setConnectedNamespaces(t))}catch{console.info("Unable to add connected namespace")}},removeConnectedNamespace(e){try{let t=N.getConnectedNamespaces(),r=t.indexOf(e);r>-1&&(t.splice(r,1),N.setConnectedNamespaces(t))}catch{console.info("Unable to remove connected namespace")}},getTelegramSocialProvider(){try{return P.getItem(D.TELEGRAM_SOCIAL_PROVIDER)}catch{return console.info("Unable to get telegram social provider"),null}},setTelegramSocialProvider(e){try{P.setItem(D.TELEGRAM_SOCIAL_PROVIDER,e)}catch{console.info("Unable to set telegram social provider")}},removeTelegramSocialProvider(){try{P.removeItem(D.TELEGRAM_SOCIAL_PROVIDER)}catch{console.info("Unable to remove telegram social provider")}},getBalanceCache(){let e={};try{let t=P.getItem(D.PORTFOLIO_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromBalanceCache(e){try{let t=N.getBalanceCache();P.setItem(D.PORTFOLIO_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getBalanceCacheForCaipAddress(e){try{let r=N.getBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.portfolio))return r.balance;N.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateBalanceCache(e){try{let t=N.getBalanceCache();t[e.caipAddress]=e,P.setItem(D.PORTFOLIO_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getNativeBalanceCache(){let e={};try{let t=P.getItem(D.NATIVE_BALANCE_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromNativeBalanceCache(e){try{let t=N.getBalanceCache();P.setItem(D.NATIVE_BALANCE_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getNativeBalanceCacheForCaipAddress(e){try{let r=N.getNativeBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.nativeBalance))return r;console.info("Discarding cache for address",e),N.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateNativeBalanceCache(e){try{let t=N.getNativeBalanceCache();t[e.caipAddress]=e,P.setItem(D.NATIVE_BALANCE_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getEnsCache(){let e={};try{let t=P.getItem(D.ENS_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get ens name cache")}return e},getEnsFromCacheForAddress(e){try{let r=N.getEnsCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.ens))return r.ens;N.removeEnsFromCache(e)}catch{console.info("Unable to get ens name from cache",e)}},updateEnsCache(e){try{let t=N.getEnsCache();t[e.address]=e,P.setItem(D.ENS_CACHE,JSON.stringify(t))}catch{console.info("Unable to update ens name cache",e)}},removeEnsFromCache(e){try{let t=N.getEnsCache();P.setItem(D.ENS_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove ens name from cache",e)}},getIdentityCache(){let e={};try{let t=P.getItem(D.IDENTITY_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get identity cache")}return e},getIdentityFromCacheForAddress(e){try{let r=N.getIdentityCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.identity))return r.identity;N.removeIdentityFromCache(e)}catch{console.info("Unable to get identity from cache",e)}},updateIdentityCache(e){try{let t=N.getIdentityCache();t[e.address]={identity:e.identity,timestamp:e.timestamp},P.setItem(D.IDENTITY_CACHE,JSON.stringify(t))}catch{console.info("Unable to update identity cache",e)}},removeIdentityFromCache(e){try{let t=N.getIdentityCache();P.setItem(D.IDENTITY_CACHE,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove identity from cache",e)}},clearAddressCache(){try{P.removeItem(D.PORTFOLIO_CACHE),P.removeItem(D.NATIVE_BALANCE_CACHE),P.removeItem(D.ENS_CACHE),P.removeItem(D.IDENTITY_CACHE)}catch{console.info("Unable to clear address cache")}},setPreferredAccountTypes(e){try{P.setItem(D.PREFERRED_ACCOUNT_TYPES,JSON.stringify(e))}catch{console.info("Unable to set preferred account types",e)}},getPreferredAccountTypes(){try{let e=P.getItem(D.PREFERRED_ACCOUNT_TYPES);return e?JSON.parse(e):{}}catch{console.info("Unable to get preferred account types")}return{}},setConnections(e,t){try{let r={...N.getConnections(),[t]:e};P.setItem(D.CONNECTIONS,JSON.stringify(r))}catch(r){console.error("Unable to sync connections to storage",r)}},getConnections(){try{let e=P.getItem(D.CONNECTIONS);return e?JSON.parse(e):{}}catch(e){return console.error("Unable to get connections from storage",e),{}}}};var I={isMobile(){return this.isClient()?!!(window?.matchMedia("(pointer:coarse)")?.matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)):!1},checkCaipNetwork(e,t=""){return e?.caipNetworkId.toLocaleLowerCase().includes(t.toLowerCase())},isAndroid(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return I.isMobile()&&e.includes("android")},isIos(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return e.includes("iphone")||e.includes("ipad")},isSafari(){return this.isClient()?(window?.navigator.userAgent.toLowerCase()).includes("safari"):!1},isClient(){return typeof window<"u"},isPairingExpired(e){return e?e-Date.now()<=le.TEN_SEC_MS:!0},isAllowedRetry(e,t=le.ONE_SEC_MS){return Date.now()-e>=t},copyToClopboard(e){navigator.clipboard.writeText(e)},isIframe(){try{return window?.self!==window?.top}catch{return!1}},getPairingExpiry(){return Date.now()+le.FOUR_MINUTES_MS},getNetworkId(e){return e?.split(":")[1]},getPlainAddress(e){return e?.split(":")[2]},async wait(e){return new Promise(t=>{setTimeout(t,e)})},debounce(e,t=500){let r;return(...o)=>{function n(){e(...o)}r&&clearTimeout(r),r=setTimeout(n,t)}},isHttpUrl(e){return e.startsWith("http://")||e.startsWith("https://")},formatNativeUrl(e,t,r=null){if(I.isHttpUrl(e))return this.formatUniversalUrl(e,t);let o=e,n=r;o.includes("://")||(o=e.replaceAll("/","").replaceAll(":",""),o=`${o}://`),o.endsWith("/")||(o=`${o}/`),n&&!n?.endsWith("/")&&(n=`${n}/`),this.isTelegram()&&this.isAndroid()&&(t=encodeURIComponent(t));let a=encodeURIComponent(t);return{redirect:`${o}wc?uri=${a}`,redirectUniversalLink:n?`${n}wc?uri=${a}`:void 0,href:o}},formatUniversalUrl(e,t){if(!I.isHttpUrl(e))return this.formatNativeUrl(e,t);let r=e;r.endsWith("/")||(r=`${r}/`);let o=encodeURIComponent(t);return{redirect:`${r}wc?uri=${o}`,href:r}},getOpenTargetForPlatform(e){return e==="popupWindow"?e:this.isTelegram()?N.getTelegramSocialProvider()?"_top":"_blank":e},openHref(e,t,r){window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},returnOpenHref(e,t,r){return window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},isTelegram(){return typeof window<"u"&&(!!window.TelegramWebviewProxy||!!window.Telegram||!!window.TelegramWebviewProxyProto)},isPWA(){if(typeof window>"u")return!1;let e=window.matchMedia?.("(display-mode: standalone)")?.matches,t=window?.navigator?.standalone;return!!(e||t)},async preloadImage(e){let t=new Promise((r,o)=>{let n=new Image;n.onload=r,n.onerror=o,n.crossOrigin="anonymous",n.src=e});return Promise.race([t,I.wait(2e3)])},formatBalance(e,t){let r="0.000";if(typeof e=="string"){let o=Number(e);if(o){let n=Math.floor(o*1e3)/1e3;n&&(r=n.toString())}}return`${r}${t?` ${t}`:""}`},formatBalance2(e,t){let r;if(e==="0")r="0";else if(typeof e=="string"){let o=Number(e);o&&(r=o.toString().match(/^-?\d+(?:\.\d{0,3})?/u)?.[0])}return{value:r??"0",rest:r==="0"?"000":"",symbol:t}},getApiUrl(){return J.W3M_API_URL},getBlockchainApiUrl(){return J.BLOCKCHAIN_API_RPC_URL},getAnalyticsUrl(){return J.PULSE_API_URL},getUUID(){return crypto?.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu,e=>{let t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})},parseError(e){return typeof e=="string"?e:typeof e?.issues?.[0]?.message=="string"?e.issues[0].message:e instanceof Error?e.message:"Unknown error"},sortRequestedNetworks(e,t=[]){let r={};return t&&e&&(e.forEach((o,n)=>{r[o]=n}),t.sort((o,n)=>{let a=r[o.id],i=r[n.id];return a!==void 0&&i!==void 0?a-i:a!==void 0?-1:i!==void 0?1:0})),t},calculateBalance(e){let t=0;for(let r of e)t+=r.value??0;return t},formatTokenBalance(e){let t=e.toFixed(2),[r,o]=t.split(".");return{dollars:r,pennies:o}},isAddress(e,t="eip155"){switch(t){case"eip155":if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)){if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)||/^(?:0x)?[0-9A-F]{40}$/iu.test(e))return!0}else return!1;return!1;case"solana":return/[1-9A-HJ-NP-Za-km-z]{32,44}$/iu.test(e);default:return!1}},uniqueBy(e,t){let r=new Set;return e.filter(o=>{let n=o[t];return r.has(n)?!1:(r.add(n),!0)})},generateSdkVersion(e,t,r){let n=e.length===0?le.ADAPTER_TYPES.UNIVERSAL:e.map(a=>a.adapterType).join(",");return`${t}-${n}-${r}`},createAccount(e,t,r,o,n){return{namespace:e,address:t,type:r,publicKey:o,path:n}},isCaipAddress(e){if(typeof e!="string")return!1;let t=e.split(":"),r=t[0];return t.filter(Boolean).length===3&&r in J.CHAIN_NAME_MAP},isMac(){let e=window?.navigator.userAgent.toLowerCase();return e.includes("macintosh")&&!e.includes("safari")},formatTelegramSocialLoginUrl(e){let t=`--${encodeURIComponent(window?.location.href)}`,r="state=";if(new URL(e).host==="auth.magic.link"){let n="provider_authorization_url=",a=e.substring(e.indexOf(n)+n.length),i=this.injectIntoUrl(decodeURIComponent(a),r,t);return e.replace(a,encodeURIComponent(i))}return this.injectIntoUrl(e,r,t)},injectIntoUrl(e,t,r){let o=e.indexOf(t);if(o===-1)throw new Error(`${t} parameter not found in the URL: ${e}`);let n=e.indexOf("&",o),a=t.length,i=n!==-1?n:e.length,s=e.substring(0,o+a),d=e.substring(o+a,i),u=e.substring(n),p=d+r;return s+p+u}};var to=Symbol(),er=Symbol(),Et="a",bt="w",ro=(e,t)=>new Proxy(e,t),Qt=Object.getPrototypeOf,Zt=new WeakMap,vr=e=>e&&(Zt.has(e)?Zt.get(e):Qt(e)===Object.prototype||Qt(e)===Array.prototype),Pt=e=>typeof e=="object"&&e!==null,oo=e=>{if(Array.isArray(e))return Array.from(e);let t=Object.getOwnPropertyDescriptors(e);return Object.values(t).forEach(r=>{r.configurable=!0}),Object.create(Qt(e),t)},tr=e=>e[er]||e,no=(e,t,r,o)=>{if(!vr(e))return e;let n=o&&o.get(e);if(!n){let d=tr(e);n=(u=>Object.values(Object.getOwnPropertyDescriptors(u)).some(p=>!p.configurable&&!p.writable))(d)?[d,oo(d)]:[d],o?.set(e,n)}let[a,i]=n,s=r&&r.get(a);return s&&s[1].f===!!i||(s=((d,u)=>{let p={f:u},m=!1,A=(re,U)=>{if(!m){let X=p[Et].get(d);if(X||(X={},p[Et].set(d,X)),re===bt)X[bt]=!0;else{let V=X[re];V||(V=new Set,X[re]=V),V.add(U)}}},H={get:(re,U)=>U===er?d:(A("k",U),no(Reflect.get(re,U),p[Et],p.c,p.t)),has:(re,U)=>U===to?(m=!0,p[Et].delete(d),!0):(A("h",U),Reflect.has(re,U)),getOwnPropertyDescriptor:(re,U)=>(A("o",U),Reflect.getOwnPropertyDescriptor(re,U)),ownKeys:re=>(A(bt),Reflect.ownKeys(re))};return u&&(H.set=H.deleteProperty=()=>!1),[H,p]})(a,!!i),s[1].p=ro(i||a,s[0]),r&&r.set(a,s)),s[1][Et]=t,s[1].c=r,s[1].t=o,s[1].p},ao=(e,t,r,o,n=Object.is)=>{if(n(e,t))return!1;if(!Pt(e)||!Pt(t))return!0;let a=r.get(tr(e));if(!a)return!0;if(o){let s=o.get(e);if(s&&s.n===t)return s.g;o.set(e,{n:t,g:!1})}let i=null;try{for(let s of a.h||[])if(i=Reflect.has(e,s)!==Reflect.has(t,s),i)return i;if(a[bt]===!0){if(i=((s,d)=>{let u=Reflect.ownKeys(s),p=Reflect.ownKeys(d);return u.length!==p.length||u.some((m,A)=>m!==p[A])})(e,t),i)return i}else for(let s of a.o||[])if(i=!!Reflect.getOwnPropertyDescriptor(e,s)!=!!Reflect.getOwnPropertyDescriptor(t,s),i)return i;for(let s of a.k||[])if(i=ao(e[s],t[s],r,o,n),i)return i;return i===null&&(i=!0),i}finally{o&&o.set(e,{n:t,g:i})}};var kr=e=>vr(e)&&e[er]||null,rr=(e,t=!0)=>{Zt.set(e,t)},Dn=(e,t,r)=>{let o=[],n=new WeakSet,a=(i,s)=>{if(n.has(i))return;Pt(i)&&n.add(i);let d=Pt(i)&&t.get(tr(i));if(d){var u,p;if((u=d.h)==null||u.forEach(A=>{let H=`:has(${String(A)})`;o.push(s?[...s,H]:[H])}),d[bt]===!0){let A=":ownKeys";o.push(s?[...s,A]:[A])}else{var m;(m=d.o)==null||m.forEach(A=>{let H=`:hasOwn(${String(A)})`;o.push(s?[...s,H]:[H])})}(p=d.k)==null||p.forEach(A=>{r&&!("value"in(Object.getOwnPropertyDescriptor(i,A)||{}))||a(i[A],s?[...s,A]:[A])})}else s&&o.push(s)};return a(e),o};var or=e=>typeof e=="object"&&e!==null,Ve=new WeakMap,At=new WeakSet,so=(e=Object.is,t=(u,p)=>new Proxy(u,p),r=u=>or(u)&&!At.has(u)&&(Array.isArray(u)||!(Symbol.iterator in u))&&!(u instanceof WeakMap)&&!(u instanceof WeakSet)&&!(u instanceof Error)&&!(u instanceof Number)&&!(u instanceof Date)&&!(u instanceof String)&&!(u instanceof RegExp)&&!(u instanceof ArrayBuffer),o=u=>{switch(u.status){case"fulfilled":return u.value;case"rejected":throw u.reason;default:throw u}},n=new WeakMap,a=(u,p,m=o)=>{let A=n.get(u);if(A?.[0]===p)return A[1];let H=Array.isArray(u)?[]:Object.create(Object.getPrototypeOf(u));return rr(H,!0),n.set(u,[p,H]),Reflect.ownKeys(u).forEach(re=>{if(Object.getOwnPropertyDescriptor(H,re))return;let U=Reflect.get(u,re),{enumerable:X}=Reflect.getOwnPropertyDescriptor(u,re),V={value:U,enumerable:X,configurable:!0};if(At.has(U))rr(U,!1);else if(U instanceof Promise)delete V.value,V.get=()=>m(U);else if(Ve.has(U)){let[he,ue]=Ve.get(U);V.value=a(he,ue(),m)}Object.defineProperty(H,re,V)}),Object.preventExtensions(H)},i=new WeakMap,s=[1,1],d=u=>{if(!or(u))throw new Error("object required");let p=i.get(u);if(p)return p;let m=s[0],A=new Set,H=(E,$=++s[0])=>{m!==$&&(m=$,A.forEach(B=>B(E,$)))},re=s[1],U=(E=++s[1])=>(re!==E&&!A.size&&(re=E,V.forEach(([$])=>{let B=$[1](E);B>m&&(m=B)})),m),X=E=>($,B)=>{let b=[...$];b[1]=[E,...b[1]],H(b,B)},V=new Map,he=(E,$)=>{if((import.meta.env?import.meta.env.MODE:void 0)!=="production"&&V.has(E))throw new Error("prop listener already exists");if(A.size){let B=$[3](X(E));V.set(E,[$,B])}else V.set(E,[$])},ue=E=>{var $;let B=V.get(E);B&&(V.delete(E),($=B[1])==null||$.call(B))},de=E=>(A.add(E),A.size===1&&V.forEach(([B,b],h)=>{if((import.meta.env?import.meta.env.MODE:void 0)!=="production"&&b)throw new Error("remove already exists");let f=B[3](X(h));V.set(h,[B,f])}),()=>{A.delete(E),A.size===0&&V.forEach(([B,b],h)=>{b&&(b(),V.set(h,[B]))})}),Oe=Array.isArray(u)?[]:Object.create(Object.getPrototypeOf(u)),Le=t(Oe,{deleteProperty(E,$){let B=Reflect.get(E,$);ue($);let b=Reflect.deleteProperty(E,$);return b&&H(["delete",[$],B]),b},set(E,$,B,b){let h=Reflect.has(E,$),f=Reflect.get(E,$,b);if(h&&(e(f,B)||i.has(B)&&e(f,i.get(B))))return!0;ue($),or(B)&&(B=kr(B)||B);let S=B;if(B instanceof Promise)B.then(g=>{B.status="fulfilled",B.value=g,H(["resolve",[$],g])}).catch(g=>{B.status="rejected",B.reason=g,H(["reject",[$],g])});else{!Ve.has(B)&&r(B)&&(S=d(B));let g=!At.has(S)&&Ve.get(S);g&&he($,g)}return Reflect.set(E,$,S,b),H(["set",[$],B,f]),!0}});i.set(u,Le);let me=[Oe,U,a,de];return Ve.set(Le,me),Reflect.ownKeys(u).forEach(E=>{let $=Object.getOwnPropertyDescriptor(u,E);"value"in $&&(Le[E]=u[E],delete $.value,delete $.writable),Object.defineProperty(Oe,E,$)}),Le})=>[d,Ve,At,e,t,r,o,n,a,i,s],[io]=so();function y(e={}){return io(e)}function z(e,t,r){let o=Ve.get(e);(import.meta.env?import.meta.env.MODE:void 0)!=="production"&&!o&&console.warn("Please use proxy object");let n,a=[],i=o[3],s=!1,u=i(p=>{if(a.push(p),r){t(a.splice(0));return}n||(n=Promise.resolve().then(()=>{n=void 0,s&&t(a.splice(0))}))});return s=!0,()=>{s=!1,u()}}function Me(e,t){let r=Ve.get(e);(import.meta.env?import.meta.env.MODE:void 0)!=="production"&&!r&&console.warn("Please use proxy object");let[o,n,a]=r;return a(o,n(),t)}function xe(e){return At.add(e),e}function K(e,t,r,o){let n=e[t];return z(e,()=>{let a=e[t];Object.is(n,a)||r(n=a)},o)}var $n=Symbol();function Ir(e){let t=y({data:Array.from(e||[]),has(r){return this.data.some(o=>o[0]===r)},set(r,o){let n=this.data.find(a=>a[0]===r);return n?n[1]=o:this.data.push([r,o]),this},get(r){var o;return(o=this.data.find(n=>n[0]===r))==null?void 0:o[1]},delete(r){let o=this.data.findIndex(n=>n[0]===r);return o===-1?!1:(this.data.splice(o,1),!0)},clear(){this.data.splice(0)},get size(){return this.data.length},toJSON(){return new Map(this.data)},forEach(r){this.data.forEach(o=>{r(o[1],o[0],this)})},keys(){return this.data.map(r=>r[0]).values()},values(){return this.data.map(r=>r[1]).values()},entries(){return new Map(this.data).entries()},get[Symbol.toStringTag](){return"Map"},[Symbol.iterator](){return this.entries()}});return Object.defineProperties(t,{data:{enumerable:!1},size:{enumerable:!1},toJSON:{enumerable:!1}}),Object.seal(t),t}var Rr={getFeatureValue(e,t){let r=t?.[e];return r===void 0?le.DEFAULT_FEATURES[e]:r},filterSocialsByPlatform(e){if(!e||!e.length)return e;if(I.isTelegram()){if(I.isIos())return e.filter(t=>t!=="google");if(I.isMac())return e.filter(t=>t!=="x");if(I.isAndroid())return e.filter(t=>!["facebook","x"].includes(t))}return e}};var _=y({features:le.DEFAULT_FEATURES,projectId:"",sdkType:"appkit",sdkVersion:"html-wagmi-undefined",defaultAccountTypes:le.DEFAULT_ACCOUNT_TYPES,enableNetworkSwitch:!0,experimental_preferUniversalLinks:!1,remoteFeatures:{}}),O={state:_,subscribeKey(e,t){return K(_,e,t)},setOptions(e){Object.assign(_,e)},setRemoteFeatures(e){if(!e)return;let t={..._.remoteFeatures,...e};_.remoteFeatures=t,_.remoteFeatures?.socials&&(_.remoteFeatures.socials=Rr.filterSocialsByPlatform(_.remoteFeatures.socials))},setFeatures(e){if(!e)return;_.features||(_.features=le.DEFAULT_FEATURES);let t={..._.features,...e};_.features=t},setProjectId(e){_.projectId=e},setCustomRpcUrls(e){_.customRpcUrls=e},setAllWallets(e){_.allWallets=e},setIncludeWalletIds(e){_.includeWalletIds=e},setExcludeWalletIds(e){_.excludeWalletIds=e},setFeaturedWalletIds(e){_.featuredWalletIds=e},setTokens(e){_.tokens=e},setTermsConditionsUrl(e){_.termsConditionsUrl=e},setPrivacyPolicyUrl(e){_.privacyPolicyUrl=e},setCustomWallets(e){_.customWallets=e},setIsSiweEnabled(e){_.isSiweEnabled=e},setIsUniversalProvider(e){_.isUniversalProvider=e},setSdkVersion(e){_.sdkVersion=e},setMetadata(e){_.metadata=e},setDisableAppend(e){_.disableAppend=e},setEIP6963Enabled(e){_.enableEIP6963=e},setDebug(e){_.debug=e},setEnableWalletConnect(e){_.enableWalletConnect=e},setEnableWalletGuide(e){_.enableWalletGuide=e},setEnableAuthLogger(e){_.enableAuthLogger=e},setEnableWallets(e){_.enableWallets=e},setPreferUniversalLinks(e){_.experimental_preferUniversalLinks=e},setHasMultipleAddresses(e){_.hasMultipleAddresses=e},setSIWX(e){_.siwx=e},setConnectMethodsOrder(e){_.features={..._.features,connectMethodsOrder:e}},setWalletFeaturesOrder(e){_.features={..._.features,walletFeaturesOrder:e}},setSocialsOrder(e){_.remoteFeatures={..._.remoteFeatures,socials:e}},setCollapseWallets(e){_.features={..._.features,collapseWallets:e}},setEnableEmbedded(e){_.enableEmbedded=e},setAllowUnsupportedChain(e){_.allowUnsupportedChain=e},setManualWCControl(e){_.manualWCControl=e},setEnableNetworkSwitch(e){_.enableNetworkSwitch=e},setDefaultAccountTypes(e={}){Object.entries(e).forEach(([t,r])=>{r&&(_.defaultAccountTypes[t]=r)})},setUniversalProviderConfigOverride(e){_.universalProviderConfigOverride=e},getUniversalProviderConfigOverride(){return _.universalProviderConfigOverride},getSnapshot(){return Me(_)}};async function St(...e){let t=await fetch(...e);if(!t.ok)throw new Error(`HTTP status code: ${t.status}`,{cause:t});return t}var Ue=class{constructor({baseUrl:t,clientId:r}){this.baseUrl=t,this.clientId=r}async get({headers:t,signal:r,cache:o,...n}){let a=this.createUrl(n);return(await St(a,{method:"GET",headers:t,signal:r,cache:o})).json()}async getBlob({headers:t,signal:r,...o}){let n=this.createUrl(o);return(await St(n,{method:"GET",headers:t,signal:r})).blob()}async post({body:t,headers:r,signal:o,...n}){let a=this.createUrl(n);return(await St(a,{method:"POST",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async put({body:t,headers:r,signal:o,...n}){let a=this.createUrl(n);return(await St(a,{method:"PUT",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}async delete({body:t,headers:r,signal:o,...n}){let a=this.createUrl(n);return(await St(a,{method:"DELETE",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()}createUrl({path:t,params:r}){let o=new URL(t,this.baseUrl);return r&&Object.entries(r).forEach(([n,a])=>{a&&o.searchParams.append(n,a)}),this.clientId&&o.searchParams.append("clientId",this.clientId),o}};var co=Object.freeze({enabled:!0,events:[]}),lo=new Ue({baseUrl:I.getAnalyticsUrl(),clientId:null}),uo=5,po=60*1e3,je=y({...co}),xr={state:je,subscribeKey(e,t){return K(je,e,t)},async sendError(e,t){if(!je.enabled)return;let r=Date.now();if(je.events.filter(a=>{let i=new Date(a.properties.timestamp||"").getTime();return r-i<po}).length>=uo)return;let n={type:"error",event:t,properties:{errorType:e.name,errorMessage:e.message,stackTrace:e.stack,timestamp:new Date().toISOString()}};je.events.push(n);try{if(typeof window>"u")return;let{projectId:a,sdkType:i,sdkVersion:s}=O.state;await lo.post({path:"/e",params:{projectId:a,st:i,sv:s||"html-wagmi-4.2.2"},body:{eventId:I.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:new Date().toISOString(),props:{type:"error",event:t,errorType:e.name,errorMessage:e.message,stackTrace:e.stack}}})}catch(a){console.error("Error sending telemetry event:",a)}},enable(){je.enabled=!0},disable(){je.enabled=!1},clearEvents(){je.events=[]}};var ut=class e extends Error{constructor(t,r,o){super(t),this.name="AppKitError",this.category=r,this.originalError=o,Error.captureStackTrace&&Error.captureStackTrace(this,e)}};function Ur(e,t){let r=e instanceof ut?e:new ut(e instanceof Error?e.message:String(e),t,e);throw xr.sendError(r,r.category),r}function Z(e,t="INTERNAL_SDK_ERROR"){let r={};return Object.keys(e).forEach(o=>{let n=e[o];if(typeof n=="function"){let a=n;n.constructor.name==="AsyncFunction"?a=async(...i)=>{try{return await n(...i)}catch(s){return Ur(s,t)}}:a=(...i)=>{try{return n(...i)}catch(s){return Ur(s,t)}},r[o]=a}else r[o]=n}),r}var Ne=y({walletImages:{},networkImages:{},chainImages:{},connectorImages:{},tokenImages:{},currencyImages:{}}),mo={state:Ne,subscribeNetworkImages(e){return z(Ne.networkImages,()=>e(Ne.networkImages))},subscribeKey(e,t){return K(Ne,e,t)},subscribe(e){return z(Ne,()=>e(Ne))},setWalletImage(e,t){Ne.walletImages[e]=t},setNetworkImage(e,t){Ne.networkImages[e]=t},setChainImage(e,t){Ne.chainImages[e]=t},setConnectorImage(e,t){Ne.connectorImages={...Ne.connectorImages,[e]:t}},setTokenImage(e,t){Ne.tokenImages[e]=t},setCurrencyImage(e,t){Ne.currencyImages[e]=t}},be=Z(mo);var Pr={handleMobileDeeplinkRedirect(e){let t=window.location.href,r=encodeURIComponent(t);if(e==="Phantom"&&!("phantom"in window)){let o=t.startsWith("https")?"https":"http",n=t.split("/")[2],a=encodeURIComponent(`${o}://${n}`);window.location.href=`https://phantom.app/ul/browse/${r}?ref=${a}`}c.state.activeChain===J.CHAIN.SOLANA&&e==="Coinbase Wallet"&&!("coinbaseSolana"in window)&&(window.location.href=`https://go.cb-w.com/dapp?cb_url=${r}`)}};var at=Object.freeze({message:"",variant:"success",svg:void 0,open:!1,autoClose:!0}),fe=y({...at}),fo={state:fe,subscribeKey(e,t){return K(fe,e,t)},showLoading(e,t={}){this._showMessage({message:e,variant:"loading",...t})},showSuccess(e){this._showMessage({message:e,variant:"success"})},showSvg(e,t){this._showMessage({message:e,svg:t})},showError(e){let t=I.parseError(e);this._showMessage({message:t,variant:"error"})},hide(){fe.message=at.message,fe.variant=at.variant,fe.svg=at.svg,fe.open=at.open,fe.autoClose=at.autoClose},_showMessage({message:e,svg:t,variant:r="success",autoClose:o=at.autoClose}){fe.open?(fe.open=!1,setTimeout(()=>{fe.message=e,fe.variant=r,fe.svg=t,fe.open=!0,fe.autoClose=o},150)):(fe.message=e,fe.variant=r,fe.svg=t,fe.open=!0,fe.autoClose=o)}},oe=fo;var go={purchaseCurrencies:[{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"Ether",symbol:"ETH",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]}],paymentCurrencies:[{id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},{id:"EUR",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]}]},Or=I.getBlockchainApiUrl(),Ae=y({clientId:null,api:new Ue({baseUrl:Or,clientId:null}),supportedChains:{http:[],ws:[]}}),C={state:Ae,async get(e){let{st:t,sv:r}=C.getSdkProperties(),o=O.state.projectId,n={...e.params||{},st:t,sv:r,projectId:o};return Ae.api.get({...e,params:n})},getSdkProperties(){let{sdkType:e,sdkVersion:t}=O.state;return{st:e||"unknown",sv:t||"unknown"}},async isNetworkSupported(e){if(!e)return!1;try{Ae.supportedChains.http.length||await C.getSupportedNetworks()}catch{return!1}return Ae.supportedChains.http.includes(e)},async getSupportedNetworks(){try{let e=await C.get({path:"v1/supported-chains"});return Ae.supportedChains=e,e}catch{return Ae.supportedChains}},async fetchIdentity({address:e,caipNetworkId:t}){if(!await C.isNetworkSupported(t))return{avatar:"",name:""};let o=N.getIdentityFromCacheForAddress(e);if(o)return o;let n=await C.get({path:`/v1/identity/${e}`,params:{sender:c.state.activeCaipAddress?I.getPlainAddress(c.state.activeCaipAddress):void 0}});return N.updateIdentityCache({address:e,identity:n,timestamp:Date.now()}),n},async fetchTransactions({account:e,cursor:t,onramp:r,signal:o,cache:n,chainId:a}){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?C.get({path:`/v1/account/${e}/history`,params:{cursor:t,onramp:r,chainId:a},signal:o,cache:n}):{data:[],next:void 0}},async fetchSwapQuote({amount:e,userAddress:t,from:r,to:o,gasPrice:n}){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?C.get({path:"/v1/convert/quotes",headers:{"Content-Type":"application/json"},params:{amount:e,userAddress:t,from:r,to:o,gasPrice:n}}):{quotes:[]}},async fetchSwapTokens({chainId:e}){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?C.get({path:"/v1/convert/tokens",params:{chainId:e}}):{tokens:[]}},async fetchTokenPrice({addresses:e}){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?Ae.api.post({path:"/v1/fungible/price",body:{currency:"usd",addresses:e,projectId:O.state.projectId},headers:{"Content-Type":"application/json"}}):{fungibles:[]}},async fetchSwapAllowance({tokenAddress:e,userAddress:t}){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?C.get({path:"/v1/convert/allowance",params:{tokenAddress:e,userAddress:t},headers:{"Content-Type":"application/json"}}):{allowance:"0"}},async fetchGasPrice({chainId:e}){let{st:t,sv:r}=C.getSdkProperties();if(!await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Gas Price");return C.get({path:"/v1/convert/gas-price",headers:{"Content-Type":"application/json"},params:{chainId:e,st:t,sv:r}})},async generateSwapCalldata({amount:e,from:t,to:r,userAddress:o,disableEstimate:n}){if(!await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return Ae.api.post({path:"/v1/convert/build-transaction",headers:{"Content-Type":"application/json"},body:{amount:e,eip155:{slippage:le.CONVERT_SLIPPAGE_TOLERANCE},projectId:O.state.projectId,from:t,to:r,userAddress:o,disableEstimate:n}})},async generateApproveCalldata({from:e,to:t,userAddress:r}){let{st:o,sv:n}=C.getSdkProperties();if(!await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId))throw new Error("Network not supported for Swaps");return C.get({path:"/v1/convert/build-approve",headers:{"Content-Type":"application/json"},params:{userAddress:r,from:e,to:t,st:o,sv:n}})},async getBalance(e,t,r){let{st:o,sv:n}=C.getSdkProperties();if(!await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId))return oe.showError("Token Balance Unavailable"),{balances:[]};let i=`${t}:${e}`,s=N.getBalanceCacheForCaipAddress(i);if(s)return s;let d=await C.get({path:`/v1/account/${e}/balance`,params:{currency:"usd",chainId:t,forceUpdate:r,st:o,sv:n}});return N.updateBalanceCache({caipAddress:i,balance:d,timestamp:Date.now()}),d},async lookupEnsName(e){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?C.get({path:`/v1/profile/account/${e}`,params:{apiVersion:"2"}}):{addresses:{},attributes:[]}},async reverseLookupEnsName({address:e}){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?C.get({path:`/v1/profile/reverse/${e}`,params:{sender:M.state.address,apiVersion:"2"}}):[]},async getEnsNameSuggestions(e){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?C.get({path:`/v1/profile/suggestions/${e}`,params:{zone:"reown.id"}}):{suggestions:[]}},async registerEnsName({coinType:e,address:t,message:r,signature:o}){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?Ae.api.post({path:"/v1/profile/account",body:{coin_type:e,address:t,message:r,signature:o},headers:{"Content-Type":"application/json"}}):{success:!1}},async generateOnRampURL({destinationWallets:e,partnerUserId:t,defaultNetwork:r,purchaseAmount:o,paymentAmount:n}){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?(await Ae.api.post({path:"/v1/generators/onrampurl",params:{projectId:O.state.projectId},body:{destinationWallets:e,defaultNetwork:r,partnerUserId:t,defaultExperience:"buy",presetCryptoAmount:o,presetFiatAmount:n}})).url:""},async getOnrampOptions(){if(!await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId))return{paymentCurrencies:[],purchaseCurrencies:[]};try{return await C.get({path:"/v1/onramp/options"})}catch{return go}},async getOnrampQuote({purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}){try{return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?await Ae.api.post({path:"/v1/onramp/quote",params:{projectId:O.state.projectId},body:{purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}}):null}catch{return{coinbaseFee:{amount:r,currency:t.id},networkFee:{amount:r,currency:t.id},paymentSubtotal:{amount:r,currency:t.id},paymentTotal:{amount:r,currency:t.id},purchaseAmount:{amount:r,currency:t.id},quoteId:"mocked-quote-id"}}},async getSmartSessions(e){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?C.get({path:`/v1/sessions/${e}`}):[]},async revokeSmartSession(e,t,r){return await C.isNetworkSupported(c.state.activeCaipNetwork?.caipNetworkId)?Ae.api.post({path:`/v1/sessions/${e}/revoke`,params:{projectId:O.state.projectId},body:{pci:t,signature:r}}):{success:!1}},setClientId(e){Ae.clientId=e,Ae.api=new Ue({baseUrl:Or,clientId:e})}};var Ie=y({currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[]}),wo={state:Ie,replaceState(e){e&&Object.assign(Ie,xe(e))},subscribe(e){return c.subscribeChainProp("accountState",t=>{if(t)return e(t)})},subscribeKey(e,t,r){let o;return c.subscribeChainProp("accountState",n=>{if(n){let a=n[e];o!==a&&(o=a,t(a))}},r)},setStatus(e,t){c.setAccountProp("status",e,t)},getCaipAddress(e){return c.getAccountProp("caipAddress",e)},setCaipAddress(e,t){let r=e?I.getPlainAddress(e):void 0;t===c.state.activeChain&&(c.state.activeCaipAddress=e),c.setAccountProp("caipAddress",e,t),c.setAccountProp("address",r,t)},setBalance(e,t,r){c.setAccountProp("balance",e,r),c.setAccountProp("balanceSymbol",t,r)},setProfileName(e,t){c.setAccountProp("profileName",e,t)},setProfileImage(e,t){c.setAccountProp("profileImage",e,t)},setUser(e,t){c.setAccountProp("user",e,t)},setAddressExplorerUrl(e,t){c.setAccountProp("addressExplorerUrl",e,t)},setSmartAccountDeployed(e,t){c.setAccountProp("smartAccountDeployed",e,t)},setCurrentTab(e){c.setAccountProp("currentTab",e,c.state.activeChain)},setTokenBalance(e,t){e&&c.setAccountProp("tokenBalance",e,t)},setShouldUpdateToAddress(e,t){c.setAccountProp("shouldUpdateToAddress",e,t)},setAllAccounts(e,t){c.setAccountProp("allAccounts",e,t)},addAddressLabel(e,t,r){let o=c.getAccountProp("addressLabels",r)||new Map;o.set(e,t),c.setAccountProp("addressLabels",o,r)},removeAddressLabel(e,t){let r=c.getAccountProp("addressLabels",t)||new Map;r.delete(e),c.setAccountProp("addressLabels",r,t)},setConnectedWalletInfo(e,t){c.setAccountProp("connectedWalletInfo",e,t,!1)},setPreferredAccountType(e,t){c.setAccountProp("preferredAccountTypes",{...Ie.preferredAccountTypes,[t]:e},t)},setPreferredAccountTypes(e){Ie.preferredAccountTypes=e},setSocialProvider(e,t){e&&c.setAccountProp("socialProvider",e,t)},setSocialWindow(e,t){c.setAccountProp("socialWindow",e?xe(e):void 0,t)},setFarcasterUrl(e,t){c.setAccountProp("farcasterUrl",e,t)},async fetchTokenBalance(e){Ie.balanceLoading=!0;let t=c.state.activeCaipNetwork?.caipNetworkId,r=c.state.activeCaipNetwork?.chainNamespace,o=c.state.activeCaipAddress,n=o?I.getPlainAddress(o):void 0;if(Ie.lastRetry&&!I.isAllowedRetry(Ie.lastRetry,30*le.ONE_SEC_MS))return Ie.balanceLoading=!1,[];try{if(n&&t&&r){let i=(await C.getBalance(n,t)).balances.filter(s=>s.quantity.decimals!=="0");return M.setTokenBalance(i,r),Ie.lastRetry=void 0,Ie.balanceLoading=!1,i}}catch(a){Ie.lastRetry=Date.now(),e?.(a),oe.showError("Token Balance Unavailable")}finally{Ie.balanceLoading=!1}return[]},resetAccount(e){c.resetAccount(e)}},M=Z(wo);var ho="https://secure.walletconnect.org/sdk",Da=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_SDK_URL:void 0)||ho,Ma=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_DEFAULT_LOG_LEVEL:void 0)||"error",La=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_SDK_VERSION:void 0)||"4",Ba={APP_EVENT_KEY:"@w3m-app/",FRAME_EVENT_KEY:"@w3m-frame/",RPC_METHOD_KEY:"RPC_",STORAGE_KEY:"@appkit-wallet/",SESSION_TOKEN_KEY:"SESSION_TOKEN_KEY",EMAIL_LOGIN_USED_KEY:"EMAIL_LOGIN_USED_KEY",LAST_USED_CHAIN_KEY:"LAST_USED_CHAIN_KEY",LAST_EMAIL_LOGIN_TIME:"LAST_EMAIL_LOGIN_TIME",EMAIL:"EMAIL",PREFERRED_ACCOUNT_TYPE:"PREFERRED_ACCOUNT_TYPE",SMART_ACCOUNT_ENABLED:"SMART_ACCOUNT_ENABLED",SMART_ACCOUNT_ENABLED_NETWORKS:"SMART_ACCOUNT_ENABLED_NETWORKS",SOCIAL_USERNAME:"SOCIAL_USERNAME",APP_SWITCH_NETWORK:"@w3m-app/SWITCH_NETWORK",APP_CONNECT_EMAIL:"@w3m-app/CONNECT_EMAIL",APP_CONNECT_DEVICE:"@w3m-app/CONNECT_DEVICE",APP_CONNECT_OTP:"@w3m-app/CONNECT_OTP",APP_CONNECT_SOCIAL:"@w3m-app/CONNECT_SOCIAL",APP_GET_SOCIAL_REDIRECT_URI:"@w3m-app/GET_SOCIAL_REDIRECT_URI",APP_GET_USER:"@w3m-app/GET_USER",APP_SIGN_OUT:"@w3m-app/SIGN_OUT",APP_IS_CONNECTED:"@w3m-app/IS_CONNECTED",APP_GET_CHAIN_ID:"@w3m-app/GET_CHAIN_ID",APP_RPC_REQUEST:"@w3m-app/RPC_REQUEST",APP_UPDATE_EMAIL:"@w3m-app/UPDATE_EMAIL",APP_UPDATE_EMAIL_PRIMARY_OTP:"@w3m-app/UPDATE_EMAIL_PRIMARY_OTP",APP_UPDATE_EMAIL_SECONDARY_OTP:"@w3m-app/UPDATE_EMAIL_SECONDARY_OTP",APP_AWAIT_UPDATE_EMAIL:"@w3m-app/AWAIT_UPDATE_EMAIL",APP_SYNC_THEME:"@w3m-app/SYNC_THEME",APP_SYNC_DAPP_DATA:"@w3m-app/SYNC_DAPP_DATA",APP_GET_SMART_ACCOUNT_ENABLED_NETWORKS:"@w3m-app/GET_SMART_ACCOUNT_ENABLED_NETWORKS",APP_INIT_SMART_ACCOUNT:"@w3m-app/INIT_SMART_ACCOUNT",APP_SET_PREFERRED_ACCOUNT:"@w3m-app/SET_PREFERRED_ACCOUNT",APP_CONNECT_FARCASTER:"@w3m-app/CONNECT_FARCASTER",APP_GET_FARCASTER_URI:"@w3m-app/GET_FARCASTER_URI",APP_RELOAD:"@w3m-app/RELOAD",FRAME_SWITCH_NETWORK_ERROR:"@w3m-frame/SWITCH_NETWORK_ERROR",FRAME_SWITCH_NETWORK_SUCCESS:"@w3m-frame/SWITCH_NETWORK_SUCCESS",FRAME_CONNECT_EMAIL_ERROR:"@w3m-frame/CONNECT_EMAIL_ERROR",FRAME_CONNECT_EMAIL_SUCCESS:"@w3m-frame/CONNECT_EMAIL_SUCCESS",FRAME_CONNECT_DEVICE_ERROR:"@w3m-frame/CONNECT_DEVICE_ERROR",FRAME_CONNECT_DEVICE_SUCCESS:"@w3m-frame/CONNECT_DEVICE_SUCCESS",FRAME_CONNECT_OTP_SUCCESS:"@w3m-frame/CONNECT_OTP_SUCCESS",FRAME_CONNECT_OTP_ERROR:"@w3m-frame/CONNECT_OTP_ERROR",FRAME_CONNECT_SOCIAL_SUCCESS:"@w3m-frame/CONNECT_SOCIAL_SUCCESS",FRAME_CONNECT_SOCIAL_ERROR:"@w3m-frame/CONNECT_SOCIAL_ERROR",FRAME_CONNECT_FARCASTER_SUCCESS:"@w3m-frame/CONNECT_FARCASTER_SUCCESS",FRAME_CONNECT_FARCASTER_ERROR:"@w3m-frame/CONNECT_FARCASTER_ERROR",FRAME_GET_FARCASTER_URI_SUCCESS:"@w3m-frame/GET_FARCASTER_URI_SUCCESS",FRAME_GET_FARCASTER_URI_ERROR:"@w3m-frame/GET_FARCASTER_URI_ERROR",FRAME_GET_SOCIAL_REDIRECT_URI_SUCCESS:"@w3m-frame/GET_SOCIAL_REDIRECT_URI_SUCCESS",FRAME_GET_SOCIAL_REDIRECT_URI_ERROR:"@w3m-frame/GET_SOCIAL_REDIRECT_URI_ERROR",FRAME_GET_USER_SUCCESS:"@w3m-frame/GET_USER_SUCCESS",FRAME_GET_USER_ERROR:"@w3m-frame/GET_USER_ERROR",FRAME_SIGN_OUT_SUCCESS:"@w3m-frame/SIGN_OUT_SUCCESS",FRAME_SIGN_OUT_ERROR:"@w3m-frame/SIGN_OUT_ERROR",FRAME_IS_CONNECTED_SUCCESS:"@w3m-frame/IS_CONNECTED_SUCCESS",FRAME_IS_CONNECTED_ERROR:"@w3m-frame/IS_CONNECTED_ERROR",FRAME_GET_CHAIN_ID_SUCCESS:"@w3m-frame/GET_CHAIN_ID_SUCCESS",FRAME_GET_CHAIN_ID_ERROR:"@w3m-frame/GET_CHAIN_ID_ERROR",FRAME_RPC_REQUEST_SUCCESS:"@w3m-frame/RPC_REQUEST_SUCCESS",FRAME_RPC_REQUEST_ERROR:"@w3m-frame/RPC_REQUEST_ERROR",FRAME_SESSION_UPDATE:"@w3m-frame/SESSION_UPDATE",FRAME_UPDATE_EMAIL_SUCCESS:"@w3m-frame/UPDATE_EMAIL_SUCCESS",FRAME_UPDATE_EMAIL_ERROR:"@w3m-frame/UPDATE_EMAIL_ERROR",FRAME_UPDATE_EMAIL_PRIMARY_OTP_SUCCESS:"@w3m-frame/UPDATE_EMAIL_PRIMARY_OTP_SUCCESS",FRAME_UPDATE_EMAIL_PRIMARY_OTP_ERROR:"@w3m-frame/UPDATE_EMAIL_PRIMARY_OTP_ERROR",FRAME_UPDATE_EMAIL_SECONDARY_OTP_SUCCESS:"@w3m-frame/UPDATE_EMAIL_SECONDARY_OTP_SUCCESS",FRAME_UPDATE_EMAIL_SECONDARY_OTP_ERROR:"@w3m-frame/UPDATE_EMAIL_SECONDARY_OTP_ERROR",FRAME_SYNC_THEME_SUCCESS:"@w3m-frame/SYNC_THEME_SUCCESS",FRAME_SYNC_THEME_ERROR:"@w3m-frame/SYNC_THEME_ERROR",FRAME_SYNC_DAPP_DATA_SUCCESS:"@w3m-frame/SYNC_DAPP_DATA_SUCCESS",FRAME_SYNC_DAPP_DATA_ERROR:"@w3m-frame/SYNC_DAPP_DATA_ERROR",FRAME_GET_SMART_ACCOUNT_ENABLED_NETWORKS_SUCCESS:"@w3m-frame/GET_SMART_ACCOUNT_ENABLED_NETWORKS_SUCCESS",FRAME_GET_SMART_ACCOUNT_ENABLED_NETWORKS_ERROR:"@w3m-frame/GET_SMART_ACCOUNT_ENABLED_NETWORKS_ERROR",FRAME_INIT_SMART_ACCOUNT_SUCCESS:"@w3m-frame/INIT_SMART_ACCOUNT_SUCCESS",FRAME_INIT_SMART_ACCOUNT_ERROR:"@w3m-frame/INIT_SMART_ACCOUNT_ERROR",FRAME_SET_PREFERRED_ACCOUNT_SUCCESS:"@w3m-frame/SET_PREFERRED_ACCOUNT_SUCCESS",FRAME_SET_PREFERRED_ACCOUNT_ERROR:"@w3m-frame/SET_PREFERRED_ACCOUNT_ERROR",FRAME_READY:"@w3m-frame/READY",FRAME_RELOAD_SUCCESS:"@w3m-frame/RELOAD_SUCCESS",FRAME_RELOAD_ERROR:"@w3m-frame/RELOAD_ERROR",RPC_RESPONSE_TYPE_ERROR:"RPC_RESPONSE_ERROR",RPC_RESPONSE_TYPE_TX:"RPC_RESPONSE_TRANSACTION_HASH",RPC_RESPONSE_TYPE_OBJECT:"RPC_RESPONSE_OBJECT"},ye={SAFE_RPC_METHODS:["eth_accounts","eth_blockNumber","eth_call","eth_chainId","eth_estimateGas","eth_feeHistory","eth_gasPrice","eth_getAccount","eth_getBalance","eth_getBlockByHash","eth_getBlockByNumber","eth_getBlockReceipts","eth_getBlockTransactionCountByHash","eth_getBlockTransactionCountByNumber","eth_getCode","eth_getFilterChanges","eth_getFilterLogs","eth_getLogs","eth_getProof","eth_getStorageAt","eth_getTransactionByBlockHashAndIndex","eth_getTransactionByBlockNumberAndIndex","eth_getTransactionByHash","eth_getTransactionCount","eth_getTransactionReceipt","eth_getUncleCountByBlockHash","eth_getUncleCountByBlockNumber","eth_maxPriorityFeePerGas","eth_newBlockFilter","eth_newFilter","eth_newPendingTransactionFilter","eth_sendRawTransaction","eth_syncing","eth_uninstallFilter","wallet_getCapabilities","wallet_getCallsStatus","eth_getUserOperationReceipt","eth_estimateUserOperationGas","eth_getUserOperationByHash","eth_supportedEntryPoints","wallet_getAssets"],NOT_SAFE_RPC_METHODS:["personal_sign","eth_signTypedData_v4","eth_sendTransaction","solana_signMessage","solana_signTransaction","solana_signAllTransactions","solana_signAndSendTransaction","wallet_sendCalls","wallet_grantPermissions","wallet_revokePermissions","eth_sendUserOperation"],GET_CHAIN_ID:"eth_chainId",RPC_METHOD_NOT_ALLOWED_MESSAGE:"Requested RPC call is not allowed",RPC_METHOD_NOT_ALLOWED_UI_MESSAGE:"Action not allowed",ACCOUNT_TYPES:{EOA:"eoa",SMART_ACCOUNT:"smartAccount"}};var Ge=y({message:"",variant:"info",open:!1}),Co={state:Ge,subscribeKey(e,t){return K(Ge,e,t)},open(e,t){let{debug:r}=O.state,{shortMessage:o,longMessage:n}=e;r&&(Ge.message=o,Ge.variant=t,Ge.open=!0),n&&console.error(typeof n=="function"?n():n)},close(){Ge.open=!1,Ge.message="",Ge.variant="info"}},Tt=Z(Co);var Eo=I.getAnalyticsUrl(),bo=new Ue({baseUrl:Eo,clientId:null}),Ao=["MODAL_CREATED"],Be=y({timestamp:Date.now(),reportedErrors:{},data:{type:"track",event:"MODAL_CREATED"}}),Y={state:Be,subscribe(e){return z(Be,()=>e(Be))},getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=O.state;return{projectId:e,st:t,sv:r||"html-wagmi-4.2.2"}},async _sendAnalyticsEvent(e){try{let t=M.state.address;if(Ao.includes(e.data.event)||typeof window>"u")return;await bo.post({path:"/e",params:Y.getSdkProperties(),body:{eventId:I.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:e.timestamp,props:{...e.data,address:t}}}),Be.reportedErrors.FORBIDDEN=!1}catch(t){t instanceof Error&&t.cause instanceof Response&&t.cause.status===J.HTTP_STATUS_CODES.FORBIDDEN&&!Be.reportedErrors.FORBIDDEN&&(Tt.open({shortMessage:"Invalid App Configuration",longMessage:`Origin ${nt()?window.origin:"uknown"} not found on Allowlist - update configuration on cloud.reown.com`},"error"),Be.reportedErrors.FORBIDDEN=!0)}},sendEvent(e){Be.timestamp=Date.now(),Be.data=e,O.state.features?.analytics&&Y._sendAnalyticsEvent(Be)}};var ze={getSIWX(){return O.state.siwx},async initializeIfEnabled(){let e=O.state.siwx,t=c.getActiveCaipAddress();if(!(e&&t))return;let[r,o,n]=t.split(":");if(c.checkIfSupportedNetwork(r))try{if((await e.getSessions(`${r}:${o}`,n)).length)return;await ie.open({view:"SIWXSignMessage"})}catch(a){console.error("SIWXUtil:initializeIfEnabled",a),Y.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:this.getSIWXEventProperties()}),await k._getClient()?.disconnect().catch(console.error),v.reset("Connect"),oe.showError("A problem occurred while trying initialize authentication")}},async requestSignMessage(){let e=O.state.siwx,t=I.getPlainAddress(c.getActiveCaipAddress()),r=c.getActiveCaipNetwork(),o=k._getClient();if(!e)throw new Error("SIWX is not enabled");if(!t)throw new Error("No ActiveCaipAddress found");if(!r)throw new Error("No ActiveCaipNetwork or client found");if(!o)throw new Error("No ConnectionController client found");try{let n=await e.createMessage({chainId:r.caipNetworkId,accountAddress:t}),a=n.toString();T.getConnectorId(r.chainNamespace)===J.CONNECTOR_ID.AUTH&&v.pushTransactionStack({});let s=await o.signMessage(a);await e.addSession({data:n,message:a,signature:s}),ie.close(),Y.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:this.getSIWXEventProperties()})}catch(n){let a=this.getSIWXEventProperties();(!ie.state.open||v.state.view==="ApproveTransaction")&&await ie.open({view:"SIWXSignMessage"}),a.isSmartAccount?oe.showError("This application might not support Smart Accounts"):oe.showError("Signature declined"),Y.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:a}),console.error("SWIXUtil:requestSignMessage",n)}},async cancelSignMessage(){try{this.getSIWX()?.getRequired?.()?await k.disconnect():ie.close(),v.reset("Connect"),Y.sendEvent({event:"CLICK_CANCEL_SIWX",type:"track",properties:this.getSIWXEventProperties()})}catch(e){console.error("SIWXUtil:cancelSignMessage",e)}},async getSessions(){let e=O.state.siwx,t=I.getPlainAddress(c.getActiveCaipAddress()),r=c.getActiveCaipNetwork();return e&&t&&r?e.getSessions(r.caipNetworkId,t):[]},async isSIWXCloseDisabled(){let e=this.getSIWX();if(e){let t=v.state.view==="ApproveTransaction",r=v.state.view==="SIWXSignMessage";if(t||r)return e.getRequired?.()&&(await this.getSessions()).length===0}return!1},async universalProviderAuthenticate({universalProvider:e,chains:t,methods:r}){let o=ze.getSIWX(),n=new Set(t.map(s=>s.split(":")[0]));if(!o||n.size!==1||!n.has("eip155"))return!1;let a=await o.createMessage({chainId:c.getActiveCaipNetwork()?.caipNetworkId||"",accountAddress:""}),i=await e.authenticate({nonce:a.nonce,domain:a.domain,uri:a.uri,exp:a.expirationTime,iat:a.issuedAt,nbf:a.notBefore,requestId:a.requestId,version:a.version,resources:a.resources,statement:a.statement,chainId:a.chainId,methods:r,chains:[a.chainId,...t.filter(s=>s!==a.chainId)]});if(oe.showLoading("Authenticating...",{autoClose:!1}),M.setConnectedWalletInfo({...i.session.peer.metadata,name:i.session.peer.metadata.name,icon:i.session.peer.metadata.icons?.[0],type:"WALLET_CONNECT"},Array.from(n)[0]),i?.auths?.length){let s=i.auths.map(d=>{let u=e.client.formatAuthMessage({request:d.p,iss:d.p.iss});return{data:{...d.p,accountAddress:d.p.iss.split(":").slice(-1).join(""),chainId:d.p.iss.split(":").slice(2,4).join(":"),uri:d.p.aud,version:d.p.version||a.version,expirationTime:d.p.exp,issuedAt:d.p.iat,notBefore:d.p.nbf},message:u,signature:d.s.s,cacao:d}});try{await o.setSessions(s),Y.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:ze.getSIWXEventProperties()})}catch(d){throw console.error("SIWX:universalProviderAuth - failed to set sessions",d),Y.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:ze.getSIWXEventProperties()}),await e.disconnect().catch(console.error),d}finally{oe.hide()}}return!0},getSIWXEventProperties(){let e=c.state.activeChain;return{network:c.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:M.state.preferredAccountTypes?.[e]===ye.ACCOUNT_TYPES.SMART_ACCOUNT}},async clearSessions(){let e=this.getSIWX();e&&await e.setSessions([])}};var se=y({transactions:[],coinbaseTransactions:{},transactionsByYear:{},lastNetworkInView:void 0,loading:!1,empty:!1,next:void 0}),So={state:se,subscribe(e){return z(se,()=>e(se))},setLastNetworkInView(e){se.lastNetworkInView=e},async fetchTransactions(e,t){if(!e)throw new Error("Transactions can't be fetched without an accountAddress");se.loading=!0;try{let r=await C.fetchTransactions({account:e,cursor:se.next,onramp:t,cache:t==="coinbase"?"no-cache":void 0,chainId:c.state.activeCaipNetwork?.caipNetworkId}),o=st.filterSpamTransactions(r.data),n=st.filterByConnectedChain(o),a=[...se.transactions,...n];se.loading=!1,t==="coinbase"?se.coinbaseTransactions=st.groupTransactionsByYearAndMonth(se.coinbaseTransactions,r.data):(se.transactions=a,se.transactionsByYear=st.groupTransactionsByYearAndMonth(se.transactionsByYear,n)),se.empty=a.length===0,se.next=r.next?r.next:void 0}catch{let o=c.state.activeChain;Y.sendEvent({type:"track",event:"ERROR_FETCH_TRANSACTIONS",properties:{address:e,projectId:O.state.projectId,cursor:se.next,isSmartAccount:M.state.preferredAccountTypes?.[o]===ye.ACCOUNT_TYPES.SMART_ACCOUNT}}),oe.showError("Failed to fetch transactions"),se.loading=!1,se.empty=!0,se.next=void 0}},groupTransactionsByYearAndMonth(e={},t=[]){let r=e;return t.forEach(o=>{let n=new Date(o.metadata.minedAt).getFullYear(),a=new Date(o.metadata.minedAt).getMonth(),i=r[n]??{},d=(i[a]??[]).filter(u=>u.id!==o.id);r[n]={...i,[a]:[...d,o].sort((u,p)=>new Date(p.metadata.minedAt).getTime()-new Date(u.metadata.minedAt).getTime())}}),r},filterSpamTransactions(e){return e.filter(t=>!t.transfers.every(o=>o.nft_info?.flags.is_spam===!0))},filterByConnectedChain(e){let t=c.state.activeCaipNetwork?.caipNetworkId;return e.filter(o=>o.metadata.chain===t)},clearCursor(){se.next=void 0},resetTransactions(){se.transactions=[],se.transactionsByYear={},se.lastNetworkInView=void 0,se.loading=!1,se.empty=!1,se.next=void 0}},st=Z(So,"API_ERROR");var ce=y({connections:new Map,wcError:!1,buffering:!1,status:"disconnected"}),it,To={state:ce,subscribeKey(e,t){return K(ce,e,t)},_getClient(){return ce._client},setClient(e){ce._client=xe(e)},async connectWalletConnect(){if(I.isTelegram()||I.isSafari()&&I.isIos()){if(it){await it,it=void 0;return}if(!I.isPairingExpired(ce?.wcPairingExpiry)){let e=ce.wcUri;ce.wcUri=e;return}it=k._getClient()?.connectWalletConnect?.().catch(()=>{}),k.state.status="connecting",await it,it=void 0,ce.wcPairingExpiry=void 0,k.state.status="connected"}else await k._getClient()?.connectWalletConnect?.()},async connectExternal(e,t,r=!0){await k._getClient()?.connectExternal?.(e),r&&c.setActiveNamespace(t)},async reconnectExternal(e){await k._getClient()?.reconnectExternal?.(e);let t=e.chain||c.state.activeChain;t&&T.setConnectorId(e.id,t)},async setPreferredAccountType(e,t){ie.setLoading(!0,c.state.activeChain);let r=T.getAuthConnector();r&&(M.setPreferredAccountType(e,t),await r.provider.setPreferredAccount(e),N.setPreferredAccountTypes(M.state.preferredAccountTypes??{[t]:e}),await k.reconnectExternal(r),ie.setLoading(!1,c.state.activeChain),Y.sendEvent({type:"track",event:"SET_PREFERRED_ACCOUNT_TYPE",properties:{accountType:e,network:c.state.activeCaipNetwork?.caipNetworkId||""}}))},async signMessage(e){return k._getClient()?.signMessage(e)},parseUnits(e,t){return k._getClient()?.parseUnits(e,t)},formatUnits(e,t){return k._getClient()?.formatUnits(e,t)},async sendTransaction(e){return k._getClient()?.sendTransaction(e)},async getCapabilities(e){return k._getClient()?.getCapabilities(e)},async grantPermissions(e){return k._getClient()?.grantPermissions(e)},async walletGetAssets(e){return k._getClient()?.walletGetAssets(e)??{}},async estimateGas(e){return k._getClient()?.estimateGas(e)},async writeContract(e){return k._getClient()?.writeContract(e)},async getEnsAddress(e){return k._getClient()?.getEnsAddress(e)},async getEnsAvatar(e){return k._getClient()?.getEnsAvatar(e)},checkInstalled(e){return k._getClient()?.checkInstalled?.(e)||!1},resetWcConnection(){ce.wcUri=void 0,ce.wcPairingExpiry=void 0,ce.wcLinking=void 0,ce.recentWallet=void 0,ce.status="disconnected",st.resetTransactions(),N.deleteWalletConnectDeepLink()},resetUri(){ce.wcUri=void 0,ce.wcPairingExpiry=void 0,it=void 0},finalizeWcConnection(){let{wcLinking:e,recentWallet:t}=k.state;e&&N.setWalletConnectDeepLink(e),t&&N.setAppKitRecent(t),Y.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:e?"mobile":"qrcode",name:v.state.data?.wallet?.name||"Unknown"}})},setWcBasic(e){ce.wcBasic=e},setUri(e){ce.wcUri=e,ce.wcPairingExpiry=I.getPairingExpiry()},setWcLinking(e){ce.wcLinking=e},setWcError(e){ce.wcError=e,ce.buffering=!1},setRecentWallet(e){ce.recentWallet=e},setBuffering(e){ce.buffering=e},setStatus(e){ce.status=e},async disconnect(e){try{ie.setLoading(!0,e),await ze.clearSessions(),await c.disconnect(e),ie.setLoading(!1,e),T.setFilterByNamespace(void 0)}catch(t){throw new ut("Failed to disconnect","INTERNAL_SDK_ERROR",t)}},setConnections(e,t){ce.connections.set(t,e)},switchAccount({connection:e,address:t,namespace:r}){if(T.state.activeConnectorIds[r]===e.connectorId){let a=c.state.activeCaipNetwork;if(a){let i=`${r}:${a.id}:${t}`;M.setCaipAddress(i,r)}else console.warn(`No current network found for namespace "${r}"`)}else{let a=T.getConnector(e.connectorId);a?k.connectExternal(a,r):console.warn(`No connector found for namespace "${r}"`)}}},k=Z(To);var dt=y({loading:!1,open:!1,selectedNetworkId:void 0,activeChain:void 0,initialized:!1}),Fe={state:dt,subscribe(e){return z(dt,()=>e(dt))},subscribeOpen(e){return K(dt,"open",e)},set(e){Object.assign(dt,{...dt,...e})}};var Se=y({loading:!1,loadingNamespaceMap:new Map,open:!1,shake:!1,namespace:void 0}),No={state:Se,subscribe(e){return z(Se,()=>e(Se))},subscribeKey(e,t){return K(Se,e,t)},async open(e){let t=M.state.status==="connected";k.state.wcBasic?x.prefetch({fetchNetworkImages:!1,fetchConnectorImages:!1}):await x.prefetch({fetchConnectorImages:!t,fetchFeaturedWallets:!t,fetchRecommendedWallets:!t}),e?.namespace?(await c.switchActiveNamespace(e.namespace),ie.setLoading(!0,e.namespace)):ie.setLoading(!0),T.setFilterByNamespace(e?.namespace);let r=c.getAccountData(e?.namespace)?.caipAddress,o=c.state.noAdapters;O.state.manualWCControl||o&&!r?I.isMobile()?v.reset("AllWallets"):v.reset("ConnectingWalletConnectBasic"):e?.view?v.reset(e.view,e.data):r?v.reset("Account"):v.reset("Connect"),Se.open=!0,Fe.set({open:!0}),Y.sendEvent({type:"track",event:"MODAL_OPEN",properties:{connected:!!r}})},close(){let e=O.state.enableEmbedded,t=!!c.state.activeCaipAddress;Se.open&&Y.sendEvent({type:"track",event:"MODAL_CLOSE",properties:{connected:t}}),Se.open=!1,ie.clearLoading(),e?t?v.replace("Account"):v.push("Connect"):Fe.set({open:!1}),k.resetUri()},setLoading(e,t){t&&Se.loadingNamespaceMap.set(t,e),Se.loading=e,Fe.set({loading:e})},clearLoading(){Se.loadingNamespaceMap.clear(),Se.loading=!1},shake(){Se.shake||(Se.shake=!0,setTimeout(()=>{Se.shake=!1},500))}},ie=Z(No);var ne=y({view:"Connect",history:["Connect"],transactionStack:[]}),yo={state:ne,subscribeKey(e,t){return K(ne,e,t)},pushTransactionStack(e){ne.transactionStack.push(e)},popTransactionStack(e){let t=ne.transactionStack.pop();if(!t)return;let{onSuccess:r,onError:o,onCancel:n}=t;switch(e){case"success":r?.();break;case"error":o?.(),v.goBack();break;case"cancel":n?.(),v.goBack();break;default:}},push(e,t){e!==ne.view&&(ne.view=e,ne.history.push(e),ne.data=t)},reset(e,t){ne.view=e,ne.history=[e],ne.data=t},replace(e,t){ne.history.at(-1)===e||(ne.view=e,ne.history[ne.history.length-1]=e,ne.data=t)},goBack(){let e=!c.state.activeCaipAddress&&v.state.view==="ConnectingFarcaster";if(ne.history.length>1){ne.history.pop();let[t]=ne.history.slice(-1);t&&(ne.view=t)}else ie.close();ne.data?.wallet&&(ne.data.wallet=void 0),setTimeout(()=>{if(e){M.setFarcasterUrl(void 0,c.state.activeChain);let t=T.getAuthConnector();t?.provider?.reload();let r=Me(O.state);t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType})}},100)},goBackToIndex(e){if(ne.history.length>1){ne.history=ne.history.slice(0,e+1);let[t]=ne.history.slice(-1);t&&(ne.view=t)}},goBackOrCloseModal(){v.state.history.length>1?v.goBack():ie.close()}},v=Z(yo);var We=y({themeMode:"dark",themeVariables:{},w3mThemeVariables:void 0}),nr={state:We,subscribe(e){return z(We,()=>e(We))},setThemeMode(e){We.themeMode=e;try{let t=T.getAuthConnector();if(t){let r=nr.getSnapshot().themeVariables;t.provider.syncTheme({themeMode:e,themeVariables:r,w3mThemeVariables:ke(r,e)})}}catch{console.info("Unable to sync theme to auth connector")}},setThemeVariables(e){We.themeVariables={...We.themeVariables,...e};try{let t=T.getAuthConnector();if(t){let r=nr.getSnapshot().themeVariables;t.provider.syncTheme({themeVariables:r,w3mThemeVariables:ke(We.themeVariables,We.themeMode)})}}catch{console.info("Unable to sync theme to auth connector")}},getSnapshot(){return Me(We)}},pt=Z(nr);var Dr={eip155:void 0,solana:void 0,polkadot:void 0,bip122:void 0,cosmos:void 0},q=y({allConnectors:[],connectors:[],activeConnector:void 0,filterByNamespace:void 0,activeConnectorIds:{...Dr},filterByNamespaceMap:{eip155:!0,solana:!0,polkadot:!0,bip122:!0,cosmos:!0}}),_o={state:q,subscribe(e){return z(q,()=>{e(q)})},subscribeKey(e,t){return K(q,e,t)},initialize(e){e.forEach(t=>{let r=N.getConnectedConnectorId(t);r&&T.setConnectorId(r,t)})},setActiveConnector(e){e&&(q.activeConnector=xe(e))},setConnectors(e){e.filter(n=>!q.allConnectors.some(a=>a.id===n.id&&T.getConnectorName(a.name)===T.getConnectorName(n.name)&&a.chain===n.chain)).forEach(n=>{n.type!=="MULTI_CHAIN"&&q.allConnectors.push(xe(n))});let r=T.getEnabledNamespaces(),o=T.getEnabledConnectors(r);q.connectors=T.mergeMultiChainConnectors(o)},filterByNamespaces(e){Object.keys(q.filterByNamespaceMap).forEach(t=>{q.filterByNamespaceMap[t]=!1}),e.forEach(t=>{q.filterByNamespaceMap[t]=!0}),T.updateConnectorsForEnabledNamespaces()},filterByNamespace(e,t){q.filterByNamespaceMap[e]=t,T.updateConnectorsForEnabledNamespaces()},updateConnectorsForEnabledNamespaces(){let e=T.getEnabledNamespaces(),t=T.getEnabledConnectors(e),r=T.areAllNamespacesEnabled();q.connectors=T.mergeMultiChainConnectors(t),r?x.clearFilterByNamespaces():x.filterByNamespaces(e)},getEnabledNamespaces(){return Object.entries(q.filterByNamespaceMap).filter(([e,t])=>t).map(([e])=>e)},getEnabledConnectors(e){return q.allConnectors.filter(t=>e.includes(t.chain))},areAllNamespacesEnabled(){return Object.values(q.filterByNamespaceMap).every(e=>e)},mergeMultiChainConnectors(e){let t=T.generateConnectorMapByName(e),r=[];return t.forEach(o=>{let n=o[0],a=n?.id===J.CONNECTOR_ID.AUTH;o.length>1&&n?r.push({name:n.name,imageUrl:n.imageUrl,imageId:n.imageId,connectors:[...o],type:a?"AUTH":"MULTI_CHAIN",chain:"eip155",id:n?.id||""}):n&&r.push(n)}),r},generateConnectorMapByName(e){let t=new Map;return e.forEach(r=>{let{name:o}=r,n=T.getConnectorName(o);if(!n)return;let a=t.get(n)||[];a.find(s=>s.chain===r.chain)||a.push(r),t.set(n,a)}),t},getConnectorName(e){return e&&({"Trust Wallet":"Trust"}[e]||e)},getUniqueConnectorsByName(e){let t=[];return e.forEach(r=>{t.find(o=>o.chain===r.chain)||t.push(r)}),t},addConnector(e){if(e.id===J.CONNECTOR_ID.AUTH){let t=e,r=Me(O.state),o=pt.getSnapshot().themeMode,n=pt.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType}),t?.provider?.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:ke(n,o)}),T.setConnectors([e])}else T.setConnectors([e])},getAuthConnector(e){let t=e||c.state.activeChain,r=q.connectors.find(o=>o.id===J.CONNECTOR_ID.AUTH);if(r)return r?.connectors?.length?r.connectors.find(n=>n.chain===t):r},getAnnouncedConnectorRdns(){return q.connectors.filter(e=>e.type==="ANNOUNCED").map(e=>e.info?.rdns)},getConnectorById(e){return q.allConnectors.find(t=>t.id===e)},getConnector(e,t){return q.allConnectors.filter(o=>o.chain===c.state.activeChain).find(o=>o.explorerId===e||o.info?.rdns===t)},syncIfAuthConnector(e){if(e.id!=="ID_AUTH")return;let t=e,r=Me(O.state),o=pt.getSnapshot().themeMode,n=pt.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,sdkType:r.sdkType,projectId:r.projectId}),t.provider.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:ke(n,o)})},getConnectorsByNamespace(e){let t=q.allConnectors.filter(r=>r.chain===e);return T.mergeMultiChainConnectors(t)},selectWalletConnector(e){let t=T.getConnector(e.id,e.rdns);Pr.handleMobileDeeplinkRedirect(t?.name||e.name||""),t?v.push("ConnectingExternal",{connector:t}):v.push("ConnectingWalletConnect",{wallet:e})},getConnectors(e){return e?T.getConnectorsByNamespace(e):T.mergeMultiChainConnectors(q.allConnectors)},setFilterByNamespace(e){q.filterByNamespace=e,q.connectors=T.getConnectors(e),x.setFilterByNamespace(e)},setConnectorId(e,t){e&&(q.activeConnectorIds={...q.activeConnectorIds,[t]:e},N.setConnectedConnectorId(t,e))},removeConnectorId(e){q.activeConnectorIds={...q.activeConnectorIds,[e]:void 0},N.deleteConnectedConnectorId(e)},getConnectorId(e){if(e)return q.activeConnectorIds[e]},isConnected(e){return e?!!q.activeConnectorIds[e]:Object.values(q.activeConnectorIds).some(t=>!!t)},resetConnectorIds(){q.activeConnectorIds={...Dr}}},T=Z(_o);function Nt(e,t){return T.getConnectorId(e)===t}function Mr(e){let t=Array.from(c.state.chains.keys()),r=[];return e?(r.push([e,c.state.chains.get(e)]),Nt(e,J.CONNECTOR_ID.WALLET_CONNECT)?t.forEach(o=>{o!==e&&Nt(o,J.CONNECTOR_ID.WALLET_CONNECT)&&r.push([o,c.state.chains.get(o)])}):Nt(e,J.CONNECTOR_ID.AUTH)&&t.forEach(o=>{o!==e&&Nt(o,J.CONNECTOR_ID.AUTH)&&r.push([o,c.state.chains.get(o)])})):r=Array.from(c.state.chains.entries()),r}var Ot={createBalance(e,t){let r={name:e.metadata.name||"",symbol:e.metadata.symbol||"",decimals:e.metadata.decimals||0,value:e.metadata.value||0,price:e.metadata.price||0,iconUrl:e.metadata.iconUrl||""};return{name:r.name,symbol:r.symbol,chainId:t,address:e.address==="native"?void 0:this.convertAddressToCAIP10Address(e.address,t),value:r.value,price:r.price,quantity:{decimals:r.decimals.toString(),numeric:this.convertHexToBalance({hex:e.balance,decimals:r.decimals})},iconUrl:r.iconUrl}},convertHexToBalance({hex:e,decimals:t}){return pr(BigInt(e),t)},convertAddressToCAIP10Address(e,t){return`${t}:${e}`},createCAIP2ChainId(e,t){return`${t}:${parseInt(e,16)}`},getChainIdHexFromCAIP2ChainId(e){let t=e.split(":");if(t.length<2||!t[1])return"0x0";let r=t[1],o=parseInt(r,10);return isNaN(o)?"0x0":`0x${o.toString(16)}`},isWalletGetAssetsResponse(e){return typeof e!="object"||e===null?!1:Object.values(e).every(t=>Array.isArray(t)&&t.every(r=>this.isValidAsset(r)))},isValidAsset(e){return typeof e=="object"&&e!==null&&typeof e.address=="string"&&typeof e.balance=="string"&&(e.type==="ERC20"||e.type==="NATIVE")&&typeof e.metadata=="object"&&e.metadata!==null&&typeof e.metadata.name=="string"&&typeof e.metadata.symbol=="string"&&typeof e.metadata.decimals=="number"&&typeof e.metadata.price=="number"&&typeof e.metadata.iconUrl=="string"}};var mt={async getMyTokensWithBalance(e){let t=M.state.address,r=c.state.activeCaipNetwork;if(!t||!r)return[];if(r.chainNamespace==="eip155"){let n=await this.getEIP155Balances(t,r);if(n)return this.filterLowQualityTokens(n)}let o=await C.getBalance(t,r.caipNetworkId,e);return this.filterLowQualityTokens(o.balances)},async getEIP155Balances(e,t){try{let r=Ot.getChainIdHexFromCAIP2ChainId(t.caipNetworkId);if(!(await k.getCapabilities(e))?.[r]?.assetDiscovery?.supported)return null;let n=await k.walletGetAssets({account:e,chainFilter:[r]});return Ot.isWalletGetAssetsResponse(n)?(n[r]||[]).map(i=>Ot.createBalance(i,t.caipNetworkId)):null}catch{return null}},filterLowQualityTokens(e){return e.filter(t=>t.quantity.decimals!=="0")},mapBalancesToSwapTokens(e){return e?.map(t=>({...t,address:t?.address?t.address:c.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}};var te=y({tokenBalances:[],loading:!1}),vo={state:te,subscribe(e){return z(te,()=>e(te))},subscribeKey(e,t){return K(te,e,t)},setToken(e){e&&(te.token=xe(e))},setTokenAmount(e){te.sendTokenAmount=e},setReceiverAddress(e){te.receiverAddress=e},setReceiverProfileImageUrl(e){te.receiverProfileImageUrl=e},setReceiverProfileName(e){te.receiverProfileName=e},setNetworkBalanceInUsd(e){te.networkBalanceInUSD=e},setLoading(e){te.loading=e},async sendToken(){try{switch(j.setLoading(!0),c.state.activeCaipNetwork?.chainNamespace){case"eip155":await j.sendEvmToken();return;case"solana":await j.sendSolanaToken();return;default:throw new Error("Unsupported chain")}}finally{j.setLoading(!1)}},async sendEvmToken(){let e=c.state.activeChain,t=M.state.preferredAccountTypes?.[e];if(!j.state.sendTokenAmount||!j.state.receiverAddress)throw new Error("An amount and receiver address are required");if(!j.state.token)throw new Error("A token is required");j.state.token?.address?(Y.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===ye.ACCOUNT_TYPES.SMART_ACCOUNT,token:j.state.token.address,amount:j.state.sendTokenAmount,network:c.state.activeCaipNetwork?.caipNetworkId||""}}),await j.sendERC20Token({receiverAddress:j.state.receiverAddress,tokenAddress:j.state.token.address,sendTokenAmount:j.state.sendTokenAmount,decimals:j.state.token.quantity.decimals})):(Y.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===ye.ACCOUNT_TYPES.SMART_ACCOUNT,token:j.state.token.symbol||"",amount:j.state.sendTokenAmount,network:c.state.activeCaipNetwork?.caipNetworkId||""}}),await j.sendNativeToken({receiverAddress:j.state.receiverAddress,sendTokenAmount:j.state.sendTokenAmount,decimals:j.state.token.quantity.decimals}))},async fetchTokenBalance(e){te.loading=!0;let t=c.state.activeCaipNetwork?.caipNetworkId,r=c.state.activeCaipNetwork?.chainNamespace,o=c.state.activeCaipAddress,n=o?I.getPlainAddress(o):void 0;if(te.lastRetry&&!I.isAllowedRetry(te.lastRetry,30*le.ONE_SEC_MS))return te.loading=!1,[];try{if(n&&t&&r){let a=await mt.getMyTokensWithBalance();return te.tokenBalances=a,te.lastRetry=void 0,a}}catch(a){te.lastRetry=Date.now(),e?.(a),oe.showError("Token Balance Unavailable")}finally{te.loading=!1}return[]},fetchNetworkBalance(){if(te.tokenBalances.length===0)return;let e=mt.mapBalancesToSwapTokens(te.tokenBalances);if(!e)return;let t=e.find(r=>r.address===c.getActiveNetworkTokenAddress());t&&(te.networkBalanceInUSD=t?Q.multiply(t.quantity.numeric,t.price).toString():"0")},async sendNativeToken(e){v.pushTransactionStack({});let t=e.receiverAddress,r=M.state.address,o=k.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));await k.sendTransaction({chainNamespace:"eip155",to:t,address:r,data:"0x",value:o??BigInt(0)}),Y.sendEvent({type:"track",event:"SEND_SUCCESS",properties:{isSmartAccount:M.state.preferredAccountTypes?.eip155===ye.ACCOUNT_TYPES.SMART_ACCOUNT,token:j.state.token?.symbol||"",amount:e.sendTokenAmount,network:c.state.activeCaipNetwork?.caipNetworkId||""}}),k._getClient()?.updateBalance("eip155"),j.resetSend()},async sendERC20Token(e){v.pushTransactionStack({onSuccess(){v.replace("Account")}});let t=k.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));if(M.state.address&&e.sendTokenAmount&&e.receiverAddress&&e.tokenAddress){let r=I.getPlainAddress(e.tokenAddress);await k.writeContract({fromAddress:M.state.address,tokenAddress:r,args:[e.receiverAddress,t??BigInt(0)],method:"transfer",abi:qt.getERC20Abi(r),chainNamespace:"eip155"}),j.resetSend()}},async sendSolanaToken(){if(!j.state.sendTokenAmount||!j.state.receiverAddress)throw new Error("An amount and receiver address are required");v.pushTransactionStack({onSuccess(){v.replace("Account")}}),await k.sendTransaction({chainNamespace:"solana",to:j.state.receiverAddress,value:j.state.sendTokenAmount}),k._getClient()?.updateBalance("solana"),j.resetSend()},resetSend(){te.token=void 0,te.sendTokenAmount=void 0,te.receiverAddress=void 0,te.receiverProfileImageUrl=void 0,te.receiverProfileName=void 0,te.loading=!1,te.tokenBalances=[]}},j=Z(vo);var ar={currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[],user:void 0},Dt={caipNetwork:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]},w=y({chains:Ir(),activeCaipAddress:void 0,activeChain:void 0,activeCaipNetwork:void 0,noAdapters:!1,universalAdapter:{networkControllerClient:void 0,connectionControllerClient:void 0},isSwitchingNamespace:!1}),ko={state:w,subscribe(e){return z(w,()=>{e(w)})},subscribeKey(e,t){return K(w,e,t)},subscribeChainProp(e,t,r){let o;return z(w.chains,()=>{let n=r||w.activeChain;if(n){let a=w.chains.get(n)?.[e];o!==a&&(o=a,t(a))}})},initialize(e,t,r){let{chainId:o,namespace:n}=N.getActiveNetworkProps(),a=t?.find(p=>p.id.toString()===o?.toString()),s=e.find(p=>p?.namespace===n)||e?.[0],d=e.map(p=>p.namespace).filter(p=>p!==void 0),u=O.state.enableEmbedded?new Set([...d]):new Set([...t?.map(p=>p.chainNamespace)??[]]);(e?.length===0||!s)&&(w.noAdapters=!0),w.noAdapters||(w.activeChain=s?.namespace,w.activeCaipNetwork=a,c.setChainNetworkData(s?.namespace,{caipNetwork:a}),w.activeChain&&Fe.set({activeChain:s?.namespace})),u.forEach(p=>{let m=t?.filter(A=>A.chainNamespace===p);c.state.chains.set(p,{namespace:p,networkState:y({...Dt,caipNetwork:m?.[0]}),accountState:y(ar),caipNetworks:m??[],...r}),c.setRequestedCaipNetworks(m??[],p)})},removeAdapter(e){if(w.activeChain===e){let t=Array.from(w.chains.entries()).find(([r])=>r!==e);if(t){let r=t[1]?.caipNetworks?.[0];r&&c.setActiveCaipNetwork(r)}}w.chains.delete(e)},addAdapter(e,{networkControllerClient:t,connectionControllerClient:r},o){w.chains.set(e.namespace,{namespace:e.namespace,networkState:{...Dt,caipNetwork:o[0]},accountState:ar,caipNetworks:o,connectionControllerClient:r,networkControllerClient:t}),c.setRequestedCaipNetworks(o?.filter(n=>n.chainNamespace===e.namespace)??[],e.namespace)},addNetwork(e){let t=w.chains.get(e.chainNamespace);if(t){let r=[...t.caipNetworks||[]];t.caipNetworks?.find(o=>o.id===e.id)||r.push(e),w.chains.set(e.chainNamespace,{...t,caipNetworks:r}),c.setRequestedCaipNetworks(r,e.chainNamespace),T.filterByNamespace(e.chainNamespace,!0)}},removeNetwork(e,t){let r=w.chains.get(e);if(r){let o=w.activeCaipNetwork?.id===t,n=[...r.caipNetworks?.filter(a=>a.id!==t)||[]];o&&r?.caipNetworks?.[0]&&c.setActiveCaipNetwork(r.caipNetworks[0]),w.chains.set(e,{...r,caipNetworks:n}),c.setRequestedCaipNetworks(n||[],e),n.length===0&&T.filterByNamespace(e,!1)}},setAdapterNetworkState(e,t){let r=w.chains.get(e);r&&(r.networkState={...r.networkState||Dt,...t},w.chains.set(e,r))},setChainAccountData(e,t,r=!0){if(!e)throw new Error("Chain is required to update chain account data");let o=w.chains.get(e);if(o){let n={...o.accountState||ar,...t};w.chains.set(e,{...o,accountState:n}),(w.chains.size===1||w.activeChain===e)&&(t.caipAddress&&(w.activeCaipAddress=t.caipAddress),M.replaceState(n))}},setChainNetworkData(e,t){if(!e)return;let r=w.chains.get(e);if(r){let o={...r.networkState||Dt,...t};w.chains.set(e,{...r,networkState:o})}},setAccountProp(e,t,r,o=!0){c.setChainAccountData(r,{[e]:t},o),e==="status"&&t==="disconnected"&&r&&T.removeConnectorId(r)},setActiveNamespace(e){w.activeChain=e;let t=e?w.chains.get(e):void 0,r=t?.networkState?.caipNetwork;r?.id&&e&&(w.activeCaipAddress=t?.accountState?.caipAddress,w.activeCaipNetwork=r,c.setChainNetworkData(e,{caipNetwork:r}),N.setActiveCaipNetworkId(r?.caipNetworkId),Fe.set({activeChain:e,selectedNetworkId:r?.caipNetworkId}))},setActiveCaipNetwork(e){if(!e)return;w.activeChain!==e.chainNamespace&&c.setIsSwitchingNamespace(!0);let t=w.chains.get(e.chainNamespace);w.activeChain=e.chainNamespace,w.activeCaipNetwork=e,c.setChainNetworkData(e.chainNamespace,{caipNetwork:e}),t?.accountState?.address?w.activeCaipAddress=`${e.chainNamespace}:${e.id}:${t?.accountState?.address}`:w.activeCaipAddress=void 0,c.setAccountProp("caipAddress",w.activeCaipAddress,e.chainNamespace),t&&M.replaceState(t.accountState),j.resetSend(),Fe.set({activeChain:w.activeChain,selectedNetworkId:w.activeCaipNetwork?.caipNetworkId}),N.setActiveCaipNetworkId(e.caipNetworkId),!c.checkIfSupportedNetwork(e.chainNamespace)&&O.state.enableNetworkSwitch&&!O.state.allowUnsupportedChain&&!k.state.wcBasic&&c.showUnsupportedChainUI()},addCaipNetwork(e){if(!e)return;let t=w.chains.get(e.chainNamespace);t&&t?.caipNetworks?.push(e)},async switchActiveNamespace(e){if(!e)return;let t=e!==c.state.activeChain,r=c.getNetworkData(e)?.caipNetwork,o=c.getCaipNetworkByNamespace(e,r?.id);t&&o&&await c.switchActiveNetwork(o)},async switchActiveNetwork(e){let r=!c.state.chains.get(c.state.activeChain)?.caipNetworks?.some(n=>n.id===w.activeCaipNetwork?.id),o=c.getNetworkControllerClient(e.chainNamespace);if(o){try{await o.switchCaipNetwork(e),r&&ie.close()}catch{v.goBack()}Y.sendEvent({type:"track",event:"SWITCH_NETWORK",properties:{network:e.caipNetworkId}})}},getNetworkControllerClient(e){let t=e||w.activeChain,r=w.chains.get(t);if(!r)throw new Error("Chain adapter not found");if(!r.networkControllerClient)throw new Error("NetworkController client not set");return r.networkControllerClient},getConnectionControllerClient(e){let t=e||w.activeChain;if(!t)throw new Error("Chain is required to get connection controller client");let r=w.chains.get(t);if(!r?.connectionControllerClient)throw new Error("ConnectionController client not set");return r.connectionControllerClient},getAccountProp(e,t){let r=w.activeChain;if(t&&(r=t),!r)return;let o=w.chains.get(r)?.accountState;if(o)return o[e]},getNetworkProp(e,t){let r=w.chains.get(t)?.networkState;if(r)return r[e]},getRequestedCaipNetworks(e){let t=w.chains.get(e),{approvedCaipNetworkIds:r=[],requestedCaipNetworks:o=[]}=t?.networkState||{};return I.sortRequestedNetworks(r,o)},getAllRequestedCaipNetworks(){let e=[];return w.chains.forEach(t=>{let r=c.getRequestedCaipNetworks(t.namespace);e.push(...r)}),e},setRequestedCaipNetworks(e,t){c.setAdapterNetworkState(t,{requestedCaipNetworks:e});let o=c.getAllRequestedCaipNetworks().map(a=>a.chainNamespace),n=Array.from(new Set(o));T.filterByNamespaces(n)},getAllApprovedCaipNetworkIds(){let e=[];return w.chains.forEach(t=>{let r=c.getApprovedCaipNetworkIds(t.namespace);e.push(...r)}),e},getActiveCaipNetwork(){return w.activeCaipNetwork},getActiveCaipAddress(){return w.activeCaipAddress},getApprovedCaipNetworkIds(e){return w.chains.get(e)?.networkState?.approvedCaipNetworkIds||[]},async setApprovedCaipNetworksData(e){let r=await c.getNetworkControllerClient()?.getApprovedCaipNetworksData();c.setAdapterNetworkState(e,{approvedCaipNetworkIds:r?.approvedCaipNetworkIds,supportsAllNetworks:r?.supportsAllNetworks})},checkIfSupportedNetwork(e,t){let r=t||w.activeCaipNetwork,o=c.getRequestedCaipNetworks(e);return o.length?o?.some(n=>n.id===r?.id):!0},checkIfSupportedChainId(e){return w.activeChain?c.getRequestedCaipNetworks(w.activeChain)?.some(r=>r.id===e):!0},setSmartAccountEnabledNetworks(e,t){c.setAdapterNetworkState(t,{smartAccountEnabledNetworks:e})},checkIfSmartAccountEnabled(){let e=Yt.caipNetworkIdToNumber(w.activeCaipNetwork?.caipNetworkId),t=w.activeChain;return!t||!e?!1:!!c.getNetworkProp("smartAccountEnabledNetworks",t)?.includes(Number(e))},getActiveNetworkTokenAddress(){let e=w.activeCaipNetwork?.chainNamespace||"eip155",t=w.activeCaipNetwork?.id||1,r=le.NATIVE_TOKEN_ADDRESS[e];return`${e}:${t}:${r}`},showUnsupportedChainUI(){ie.open({view:"UnsupportedChain"})},checkIfNamesSupported(){let e=w.activeCaipNetwork;return!!(e?.chainNamespace&&le.NAMES_SUPPORTED_CHAIN_NAMESPACES.includes(e.chainNamespace))},resetNetwork(e){c.setAdapterNetworkState(e,{approvedCaipNetworkIds:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]})},resetAccount(e){let t=e;if(!t)throw new Error("Chain is required to set account prop");w.activeCaipAddress=void 0,c.setChainAccountData(t,{smartAccountDeployed:!1,currentTab:0,caipAddress:void 0,address:void 0,balance:void 0,balanceSymbol:void 0,profileName:void 0,profileImage:void 0,addressExplorerUrl:void 0,tokenBalance:[],connectedWalletInfo:void 0,preferredAccountTypes:void 0,socialProvider:void 0,socialWindow:void 0,farcasterUrl:void 0,allAccounts:[],user:void 0,status:"disconnected"}),T.removeConnectorId(t)},async disconnect(e){let t=Mr(e);try{j.resetSend();let r=await Promise.allSettled(t.map(async([n,a])=>{try{let{caipAddress:i}=c.getAccountData(n)||{};i&&a.connectionControllerClient?.disconnect&&await a.connectionControllerClient.disconnect(n),c.resetAccount(n),c.resetNetwork(n)}catch(i){throw new Error(`Failed to disconnect chain ${n}: ${i.message}`)}}));k.resetWcConnection();let o=r.filter(n=>n.status==="rejected");if(o.length>0)throw new Error(o.map(n=>n.reason.message).join(", "));N.deleteConnectedSocialProvider(),e?T.removeConnectorId(e):T.resetConnectorIds(),Y.sendEvent({type:"track",event:"DISCONNECT_SUCCESS",properties:{namespace:e||"all"}})}catch(r){console.error(r.message||"Failed to disconnect chains"),Y.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:r.message||"Failed to disconnect chains"}})}},setIsSwitchingNamespace(e){w.isSwitchingNamespace=e},getFirstCaipNetworkSupportsAuthConnector(){let e=[],t;if(w.chains.forEach(r=>{J.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(o=>o===r.namespace)&&r.namespace&&e.push(r.namespace)}),e.length>0){let r=e[0];return t=r?w.chains.get(r)?.caipNetworks?.[0]:void 0,t}},getAccountData(e){return e?c.state.chains.get(e)?.accountState:M.state},getNetworkData(e){let t=e||w.activeChain;if(t)return c.state.chains.get(t)?.networkState},getCaipNetworkByNamespace(e,t){if(!e)return;let r=c.state.chains.get(e),o=r?.caipNetworks?.find(n=>n.id===t);return o||r?.networkState?.caipNetwork||r?.caipNetworks?.[0]},getRequestedCaipNetworkIds(){let e=T.state.filterByNamespace;return(e?[w.chains.get(e)]:Array.from(w.chains.values())).flatMap(r=>r?.caipNetworks||[]).map(r=>r.caipNetworkId)},getCaipNetworks(e){return e?c.getRequestedCaipNetworks(e):c.getAllRequestedCaipNetworks()}},c=Z(ko);var sr={PHANTOM:"a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",COINBASE:"fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa"},Io=I.getApiUrl(),Te=new Ue({baseUrl:Io,clientId:null}),Ro=40,Lr=4,xo=20,L=y({promises:{},page:1,count:0,featured:[],allFeatured:[],recommended:[],allRecommended:[],wallets:[],filteredWallets:[],search:[],isAnalyticsEnabled:!1,excludedWallets:[],isFetchingRecommendedWallets:!1}),x={state:L,subscribeKey(e,t){return K(L,e,t)},_getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=O.state;return{projectId:e,st:t||"appkit",sv:r||"html-wagmi-4.2.2"}},_filterOutExtensions(e){return O.state.isUniversalProvider?e.filter(t=>!!(t.mobile_link||t.desktop_link||t.webapp_link)):e},async _fetchWalletImage(e){let t=`${Te.baseUrl}/getWalletImage/${e}`,r=await Te.getBlob({path:t,params:x._getSdkProperties()});be.setWalletImage(e,URL.createObjectURL(r))},async _fetchNetworkImage(e){let t=`${Te.baseUrl}/public/getAssetImage/${e}`,r=await Te.getBlob({path:t,params:x._getSdkProperties()});be.setNetworkImage(e,URL.createObjectURL(r))},async _fetchConnectorImage(e){let t=`${Te.baseUrl}/public/getAssetImage/${e}`,r=await Te.getBlob({path:t,params:x._getSdkProperties()});be.setConnectorImage(e,URL.createObjectURL(r))},async _fetchCurrencyImage(e){let t=`${Te.baseUrl}/public/getCurrencyImage/${e}`,r=await Te.getBlob({path:t,params:x._getSdkProperties()});be.setCurrencyImage(e,URL.createObjectURL(r))},async _fetchTokenImage(e){let t=`${Te.baseUrl}/public/getTokenImage/${e}`,r=await Te.getBlob({path:t,params:x._getSdkProperties()});be.setTokenImage(e,URL.createObjectURL(r))},_filterWalletsByPlatform(e){return I.isMobile()?e?.filter(r=>r.mobile_link||r.id===sr.COINBASE||r.id===sr.PHANTOM&&c.state.activeChain==="solana"):e},async fetchProjectConfig(){return(await Te.get({path:"/appkit/v1/config",params:x._getSdkProperties()})).features},async fetchAllowedOrigins(){try{let{allowedOrigins:e}=await Te.get({path:"/projects/v1/origins",params:x._getSdkProperties()});return e}catch{return[]}},async fetchNetworkImages(){let t=c.getAllRequestedCaipNetworks()?.map(({assets:r})=>r?.imageId).filter(Boolean).filter(r=>!ir.getNetworkImageById(r));t&&await Promise.allSettled(t.map(r=>x._fetchNetworkImage(r)))},async fetchConnectorImages(){let{connectors:e}=T.state,t=e.map(({imageId:r})=>r).filter(Boolean);await Promise.allSettled(t.map(r=>x._fetchConnectorImage(r)))},async fetchCurrencyImages(e=[]){await Promise.allSettled(e.map(t=>x._fetchCurrencyImage(t)))},async fetchTokenImages(e=[]){await Promise.allSettled(e.map(t=>x._fetchTokenImage(t)))},async fetchWallets(e){let t=e.exclude??[];x._getSdkProperties().sv.startsWith("html-core-")&&t.push(...Object.values(sr));let o=await Te.get({path:"/getWallets",params:{...x._getSdkProperties(),...e,page:String(e.page),entries:String(e.entries),include:e.include?.join(","),exclude:t.join(",")}});return{data:x._filterWalletsByPlatform(o?.data)||[],count:o?.count}},async fetchFeaturedWallets(){let{featuredWalletIds:e}=O.state;if(e?.length){let t={...x._getSdkProperties(),page:1,entries:e?.length??Lr,include:e},{data:r}=await x.fetchWallets(t),o=[...r].sort((a,i)=>e.indexOf(a.id)-e.indexOf(i.id)),n=o.map(a=>a.image_id).filter(Boolean);await Promise.allSettled(n.map(a=>x._fetchWalletImage(a))),L.featured=o,L.allFeatured=o}},async fetchRecommendedWallets(){try{L.isFetchingRecommendedWallets=!0;let{includeWalletIds:e,excludeWalletIds:t,featuredWalletIds:r}=O.state,o=[...t??[],...r??[]].filter(Boolean),n=c.getRequestedCaipNetworkIds().join(","),a={page:1,entries:Lr,include:e,exclude:o,chains:n},{data:i,count:s}=await x.fetchWallets(a),d=N.getRecentWallets(),u=i.map(m=>m.image_id).filter(Boolean),p=d.map(m=>m.image_id).filter(Boolean);await Promise.allSettled([...u,...p].map(m=>x._fetchWalletImage(m))),L.recommended=i,L.allRecommended=i,L.count=s??0}catch{}finally{L.isFetchingRecommendedWallets=!1}},async fetchWalletsByPage({page:e}){let{includeWalletIds:t,excludeWalletIds:r,featuredWalletIds:o}=O.state,n=c.getRequestedCaipNetworkIds().join(","),a=[...L.recommended.map(({id:p})=>p),...r??[],...o??[]].filter(Boolean),i={page:e,entries:Ro,include:t,exclude:a,chains:n},{data:s,count:d}=await x.fetchWallets(i),u=s.slice(0,xo).map(p=>p.image_id).filter(Boolean);await Promise.allSettled(u.map(p=>x._fetchWalletImage(p))),L.wallets=I.uniqueBy([...L.wallets,...x._filterOutExtensions(s)],"id").filter(p=>p.chains?.some(m=>n.includes(m))),L.count=d>L.count?d:L.count,L.page=e},async initializeExcludedWallets({ids:e}){let t={page:1,entries:e.length,include:e},{data:r}=await x.fetchWallets(t);r&&r.forEach(o=>{L.excludedWallets.push({rdns:o.rdns,name:o.name})})},async searchWallet({search:e,badge:t}){let{includeWalletIds:r,excludeWalletIds:o}=O.state,n=c.getRequestedCaipNetworkIds().join(",");L.search=[];let a={page:1,entries:100,search:e?.trim(),badge_type:t,include:r,exclude:o,chains:n},{data:i}=await x.fetchWallets(a);Y.sendEvent({type:"track",event:"SEARCH_WALLET",properties:{badge:t??"",search:e??""}});let s=i.map(d=>d.image_id).filter(Boolean);await Promise.allSettled([...s.map(d=>x._fetchWalletImage(d)),I.wait(300)]),L.search=x._filterOutExtensions(i)},initPromise(e,t){let r=L.promises[e];return r||(L.promises[e]=t())},prefetch({fetchConnectorImages:e=!0,fetchFeaturedWallets:t=!0,fetchRecommendedWallets:r=!0,fetchNetworkImages:o=!0}={}){let n=[e&&x.initPromise("connectorImages",x.fetchConnectorImages),t&&x.initPromise("featuredWallets",x.fetchFeaturedWallets),r&&x.initPromise("recommendedWallets",x.fetchRecommendedWallets),o&&x.initPromise("networkImages",x.fetchNetworkImages)].filter(Boolean);return Promise.allSettled(n)},prefetchAnalyticsConfig(){O.state.features?.analytics&&x.fetchAnalyticsConfig()},async fetchAnalyticsConfig(){try{let{isAnalyticsEnabled:e}=await Te.get({path:"/getAnalyticsConfig",params:x._getSdkProperties()});O.setFeatures({analytics:e})}catch{O.setFeatures({analytics:!1})}},filterByNamespaces(e){if(!e?.length){L.featured=L.allFeatured,L.recommended=L.allRecommended;return}let t=c.getRequestedCaipNetworkIds().join(",");L.featured=L.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),L.recommended=L.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o))),L.filteredWallets=L.wallets.filter(r=>r.chains?.some(o=>t.includes(o)))},clearFilterByNamespaces(){L.filteredWallets=[]},setFilterByNamespace(e){if(!e){L.featured=L.allFeatured,L.recommended=L.allRecommended;return}let t=c.getRequestedCaipNetworkIds().join(",");L.featured=L.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),L.recommended=L.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o))),L.filteredWallets=L.wallets.filter(r=>r.chains?.some(o=>t.includes(o)))}};var Uo={eip155:"ba0ba0cd-17c6-4806-ad93-f9d174f17900",solana:"a1b58899-f671-4276-6a5e-56ca5bd59700",polkadot:"",bip122:"0b4838db-0161-4ffe-022d-532bf03dba00",cosmos:""},cr=y({networkImagePromises:{}}),ir={async fetchWalletImage(e){if(e)return await x._fetchWalletImage(e),this.getWalletImageById(e)},async fetchNetworkImage(e){if(!e)return;let t=this.getNetworkImageById(e);return t||(cr.networkImagePromises[e]||(cr.networkImagePromises[e]=x._fetchNetworkImage(e)),await cr.networkImagePromises[e],this.getNetworkImageById(e))},getWalletImageById(e){if(e)return be.state.walletImages[e]},getWalletImage(e){if(e?.image_url)return e?.image_url;if(e?.image_id)return be.state.walletImages[e.image_id]},getNetworkImage(e){if(e?.assets?.imageUrl)return e?.assets?.imageUrl;if(e?.assets?.imageId)return be.state.networkImages[e.assets.imageId]},getNetworkImageById(e){if(e)return be.state.networkImages[e]},getConnectorImage(e){if(e?.imageUrl)return e.imageUrl;if(e?.imageId)return be.state.connectorImages[e.imageId]},getChainImage(e){return be.state.networkImages[Uo[e]]}};var yt={id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},lr={id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},Po={providers:Jt,selectedProvider:null,error:null,purchaseCurrency:yt,paymentCurrency:lr,purchaseCurrencies:[yt],paymentCurrencies:[],quotesLoading:!1},G=y(Po),Oo={state:G,subscribe(e){return z(G,()=>e(G))},subscribeKey(e,t){return K(G,e,t)},setSelectedProvider(e){if(e&&e.name==="meld"){let t=c.state.activeChain===J.CHAIN.SOLANA?"SOL":"USDC",r=M.state.address??"",o=new URL(e.url);o.searchParams.append("publicKey",_r),o.searchParams.append("destinationCurrencyCode",t),o.searchParams.append("walletAddress",r),o.searchParams.append("externalCustomerId",O.state.projectId),G.selectedProvider={...e,url:o.toString()}}else G.selectedProvider=e},setOnrampProviders(e){if(Array.isArray(e)&&e.every(t=>typeof t=="string")){let t=e,r=Jt.filter(o=>t.includes(o.name));G.providers=r}else G.providers=[]},setPurchaseCurrency(e){G.purchaseCurrency=e},setPaymentCurrency(e){G.paymentCurrency=e},setPurchaseAmount(e){ur.state.purchaseAmount=e},setPaymentAmount(e){ur.state.paymentAmount=e},async getAvailableCurrencies(){let e=await C.getOnrampOptions();G.purchaseCurrencies=e.purchaseCurrencies,G.paymentCurrencies=e.paymentCurrencies,G.paymentCurrency=e.paymentCurrencies[0]||lr,G.purchaseCurrency=e.purchaseCurrencies[0]||yt,await x.fetchCurrencyImages(e.paymentCurrencies.map(t=>t.id)),await x.fetchTokenImages(e.purchaseCurrencies.map(t=>t.symbol))},async getQuote(){G.quotesLoading=!0;try{let e=await C.getOnrampQuote({purchaseCurrency:G.purchaseCurrency,paymentCurrency:G.paymentCurrency,amount:G.paymentAmount?.toString()||"0",network:G.purchaseCurrency?.symbol});return G.quotesLoading=!1,G.purchaseAmount=Number(e?.purchaseAmount.amount),e}catch(e){return G.error=e.message,G.quotesLoading=!1,null}finally{G.quotesLoading=!1}},resetState(){G.selectedProvider=null,G.error=null,G.purchaseCurrency=yt,G.paymentCurrency=lr,G.purchaseCurrencies=[yt],G.paymentCurrencies=[],G.paymentAmount=void 0,G.purchaseAmount=void 0,G.quotesLoading=!1}},ur=Z(Oo);var Mt={async getTokenList(){let e=c.state.activeCaipNetwork;return(await C.fetchSwapTokens({chainId:e?.caipNetworkId}))?.tokens?.map(o=>({...o,eip2612:!1,quantity:{decimals:"0",numeric:"0"},price:0,value:0}))||[]},async fetchGasPrice(){let e=c.state.activeCaipNetwork;if(!e)return null;try{switch(e.chainNamespace){case"solana":let t=(await k?.estimateGas({chainNamespace:"solana"}))?.toString();return{standard:t,fast:t,instant:t};case"eip155":default:return await C.fetchGasPrice({chainId:e.caipNetworkId})}}catch{return null}},async fetchSwapAllowance({tokenAddress:e,userAddress:t,sourceTokenAmount:r,sourceTokenDecimals:o}){let n=await C.fetchSwapAllowance({tokenAddress:e,userAddress:t});if(n?.allowance&&r&&o){let a=k.parseUnits(r,o)||0;return BigInt(n.allowance)>=a}return!1},async getMyTokensWithBalance(e){let t=M.state.address,r=c.state.activeCaipNetwork;if(!t||!r)return[];let n=(await C.getBalance(t,r.caipNetworkId,e)).balances.filter(a=>a.quantity.decimals!=="0");return M.setTokenBalance(n,c.state.activeChain),this.mapBalancesToSwapTokens(n)},mapBalancesToSwapTokens(e){return e?.map(t=>({...t,address:t?.address?t.address:c.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}};var $e={getGasPriceInEther(e,t){let r=t*e;return Number(r)/1e18},getGasPriceInUSD(e,t,r){let o=$e.getGasPriceInEther(t,r);return Q.bigNumber(e).times(o).toNumber()},getPriceImpact({sourceTokenAmount:e,sourceTokenPriceInUSD:t,toTokenPriceInUSD:r,toTokenAmount:o}){let n=Q.bigNumber(e).times(t),a=Q.bigNumber(o).times(r);return n.minus(a).div(n).times(100).toNumber()},getMaxSlippage(e,t){let r=Q.bigNumber(e).div(100);return Q.multiply(t,r).toNumber()},getProviderFee(e,t=.0085){return Q.bigNumber(e).times(t).toString()},isInsufficientNetworkTokenForGas(e,t){let r=t||"0";return Q.bigNumber(e).eq(0)?!0:Q.bigNumber(Q.bigNumber(r)).gt(e)},isInsufficientSourceTokenForSwap(e,t,r){let o=r?.find(a=>a.address===t)?.quantity?.numeric;return Q.bigNumber(o||"0").lt(e)},getToTokenAmount({sourceToken:e,toToken:t,sourceTokenPrice:r,toTokenPrice:o,sourceTokenAmount:n}){if(n==="0"||!e||!t)return"0";let a=e.decimals,i=r,s=t.decimals,d=o;if(d<=0)return"0";let u=Q.bigNumber(n).times(.0085),m=Q.bigNumber(n).minus(u).times(Q.bigNumber(10).pow(a)),A=Q.bigNumber(i).div(d),H=a-s;return m.times(A).div(Q.bigNumber(10).pow(H)).div(Q.bigNumber(10).pow(s)).toFixed(s).toString()}};var Br=15e4,Do=6;var Ce={initializing:!1,initialized:!1,loadingPrices:!1,loadingQuote:!1,loadingApprovalTransaction:!1,loadingBuildTransaction:!1,loadingTransaction:!1,fetchError:!1,approvalTransaction:void 0,swapTransaction:void 0,transactionError:void 0,sourceToken:void 0,sourceTokenAmount:"",sourceTokenPriceInUSD:0,toToken:void 0,toTokenAmount:"",toTokenPriceInUSD:0,networkPrice:"0",networkBalanceInUSD:"0",networkTokenSymbol:"",inputError:void 0,slippage:le.CONVERT_SLIPPAGE_TOLERANCE,tokens:void 0,popularTokens:void 0,suggestedTokens:void 0,foundTokens:void 0,myTokensWithBalance:void 0,tokensPriceMap:{},gasFee:"0",gasPriceInUSD:0,priceImpact:void 0,maxSlippage:void 0,providerFee:void 0},l=y(Ce),Lt={state:l,subscribe(e){return z(l,()=>e(l))},subscribeKey(e,t){return K(l,e,t)},getParams(){let e=c.state.activeCaipAddress,t=c.state.activeChain,r=I.getPlainAddress(e),o=c.getActiveNetworkTokenAddress(),n=T.getConnectorId(t);if(!r)throw new Error("No address found to swap the tokens from.");let a=!l.toToken?.address||!l.toToken?.decimals,i=!l.sourceToken?.address||!l.sourceToken?.decimals||!Q.bigNumber(l.sourceTokenAmount).gt(0),s=!l.sourceTokenAmount;return{networkAddress:o,fromAddress:r,fromCaipAddress:e,sourceTokenAddress:l.sourceToken?.address,toTokenAddress:l.toToken?.address,toTokenAmount:l.toTokenAmount,toTokenDecimals:l.toToken?.decimals,sourceTokenAmount:l.sourceTokenAmount,sourceTokenDecimals:l.sourceToken?.decimals,invalidToToken:a,invalidSourceToken:i,invalidSourceTokenAmount:s,availableToSwap:e&&!a&&!i&&!s,isAuthConnector:n===J.CONNECTOR_ID.AUTH}},setSourceToken(e){if(!e){l.sourceToken=e,l.sourceTokenAmount="",l.sourceTokenPriceInUSD=0;return}l.sourceToken=e,R.setTokenPrice(e.address,"sourceToken")},setSourceTokenAmount(e){l.sourceTokenAmount=e},setToToken(e){if(!e){l.toToken=e,l.toTokenAmount="",l.toTokenPriceInUSD=0;return}l.toToken=e,R.setTokenPrice(e.address,"toToken")},setToTokenAmount(e){l.toTokenAmount=e?Q.formatNumberToLocalString(e,Do):""},async setTokenPrice(e,t){let r=l.tokensPriceMap[e]||0;r||(l.loadingPrices=!0,r=await R.getAddressPrice(e)),t==="sourceToken"?l.sourceTokenPriceInUSD=r:t==="toToken"&&(l.toTokenPriceInUSD=r),l.loadingPrices&&(l.loadingPrices=!1),R.getParams().availableToSwap&&R.swapTokens()},switchTokens(){if(l.initializing||!l.initialized)return;let e=l.toToken?{...l.toToken}:void 0,t=l.sourceToken?{...l.sourceToken}:void 0,r=e&&l.toTokenAmount===""?"1":l.toTokenAmount;R.setSourceToken(e),R.setToToken(t),R.setSourceTokenAmount(r),R.setToTokenAmount(""),R.swapTokens()},resetState(){l.myTokensWithBalance=Ce.myTokensWithBalance,l.tokensPriceMap=Ce.tokensPriceMap,l.initialized=Ce.initialized,l.sourceToken=Ce.sourceToken,l.sourceTokenAmount=Ce.sourceTokenAmount,l.sourceTokenPriceInUSD=Ce.sourceTokenPriceInUSD,l.toToken=Ce.toToken,l.toTokenAmount=Ce.toTokenAmount,l.toTokenPriceInUSD=Ce.toTokenPriceInUSD,l.networkPrice=Ce.networkPrice,l.networkTokenSymbol=Ce.networkTokenSymbol,l.networkBalanceInUSD=Ce.networkBalanceInUSD,l.inputError=Ce.inputError,l.myTokensWithBalance=Ce.myTokensWithBalance},resetValues(){let{networkAddress:e}=R.getParams(),t=l.tokens?.find(r=>r.address===e);R.setSourceToken(t),R.setToToken(void 0)},getApprovalLoadingState(){return l.loadingApprovalTransaction},clearError(){l.transactionError=void 0},async initializeState(){if(!l.initializing){if(l.initializing=!0,!l.initialized)try{await R.fetchTokens(),l.initialized=!0}catch{l.initialized=!1,oe.showError("Failed to initialize swap"),v.goBack()}l.initializing=!1}},async fetchTokens(){let{networkAddress:e}=R.getParams();await R.getTokenList(),await R.getNetworkTokenPrice(),await R.getMyTokensWithBalance();let t=l.tokens?.find(r=>r.address===e);t&&(l.networkTokenSymbol=t.symbol,R.setSourceToken(t),R.setSourceTokenAmount("1"))},async getTokenList(){let e=await Mt.getTokenList();l.tokens=e,l.popularTokens=e.sort((t,r)=>t.symbol<r.symbol?-1:t.symbol>r.symbol?1:0),l.suggestedTokens=e.filter(t=>!!le.SWAP_SUGGESTED_TOKENS.includes(t.symbol),{})},async getAddressPrice(e){let t=l.tokensPriceMap[e];if(t)return t;let o=(await C.fetchTokenPrice({addresses:[e]}))?.fungibles||[],a=[...l.tokens||[],...l.myTokensWithBalance||[]]?.find(d=>d.address===e)?.symbol,i=o.find(d=>d.symbol.toLowerCase()===a?.toLowerCase())?.price||0,s=parseFloat(i.toString());return l.tokensPriceMap[e]=s,s},async getNetworkTokenPrice(){let{networkAddress:e}=R.getParams(),r=(await C.fetchTokenPrice({addresses:[e]}).catch(()=>(oe.showError("Failed to fetch network token price"),{fungibles:[]}))).fungibles?.[0],o=r?.price.toString()||"0";l.tokensPriceMap[e]=parseFloat(o),l.networkTokenSymbol=r?.symbol||"",l.networkPrice=o},async getMyTokensWithBalance(e){let t=await mt.getMyTokensWithBalance(e),r=mt.mapBalancesToSwapTokens(t);r&&(await R.getInitialGasPrice(),R.setBalances(r))},setBalances(e){let{networkAddress:t}=R.getParams(),r=c.state.activeCaipNetwork;if(!r)return;let o=e.find(n=>n.address===t);e.forEach(n=>{l.tokensPriceMap[n.address]=n.price||0}),l.myTokensWithBalance=e.filter(n=>n.address.startsWith(r.caipNetworkId)),l.networkBalanceInUSD=o?Q.multiply(o.quantity.numeric,o.price).toString():"0"},async getInitialGasPrice(){let e=await Mt.fetchGasPrice();if(!e)return{gasPrice:null,gasPriceInUSD:null};switch(c.state?.activeCaipNetwork?.chainNamespace){case"solana":return l.gasFee=e.standard??"0",l.gasPriceInUSD=Q.multiply(e.standard,l.networkPrice).div(1e9).toNumber(),{gasPrice:BigInt(l.gasFee),gasPriceInUSD:Number(l.gasPriceInUSD)};case"eip155":default:let t=e.standard??"0",r=BigInt(t),o=BigInt(Br),n=$e.getGasPriceInUSD(l.networkPrice,o,r);return l.gasFee=t,l.gasPriceInUSD=n,{gasPrice:r,gasPriceInUSD:n}}},async swapTokens(){let e=M.state.address,t=l.sourceToken,r=l.toToken,o=Q.bigNumber(l.sourceTokenAmount).gt(0);if(o||R.setToTokenAmount(""),!r||!t||l.loadingPrices||!o)return;l.loadingQuote=!0;let n=Q.bigNumber(l.sourceTokenAmount).times(10**t.decimals).round(0);try{let a=await C.fetchSwapQuote({userAddress:e,from:t.address,to:r.address,gasPrice:l.gasFee,amount:n.toString()});l.loadingQuote=!1;let i=a?.quotes?.[0]?.toAmount;if(!i){Tt.open({shortMessage:"Incorrect amount",longMessage:"Please enter a valid amount"},"error");return}let s=Q.bigNumber(i).div(10**r.decimals).toString();R.setToTokenAmount(s),R.hasInsufficientToken(l.sourceTokenAmount,t.address)?l.inputError="Insufficient balance":(l.inputError=void 0,R.setTransactionDetails())}catch{l.loadingQuote=!1,l.inputError="Insufficient balance"}},async getTransaction(){let{fromCaipAddress:e,availableToSwap:t}=R.getParams(),r=l.sourceToken,o=l.toToken;if(!(!e||!t||!r||!o||l.loadingQuote))try{l.loadingBuildTransaction=!0;let n=await Mt.fetchSwapAllowance({userAddress:e,tokenAddress:r.address,sourceTokenAmount:l.sourceTokenAmount,sourceTokenDecimals:r.decimals}),a;return n?a=await R.createSwapTransaction():a=await R.createAllowanceTransaction(),l.loadingBuildTransaction=!1,l.fetchError=!1,a}catch{v.goBack(),oe.showError("Failed to check allowance"),l.loadingBuildTransaction=!1,l.approvalTransaction=void 0,l.swapTransaction=void 0,l.fetchError=!0;return}},async createAllowanceTransaction(){let{fromCaipAddress:e,sourceTokenAddress:t,toTokenAddress:r}=R.getParams();if(!(!e||!r)){if(!t)throw new Error("createAllowanceTransaction - No source token address found.");try{let o=await C.generateApproveCalldata({from:t,to:r,userAddress:e}),n={data:o.tx.data,to:I.getPlainAddress(o.tx.from),gasPrice:BigInt(o.tx.eip155.gasPrice),value:BigInt(o.tx.value),toAmount:l.toTokenAmount};return l.swapTransaction=void 0,l.approvalTransaction={data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount},{data:n.data,to:n.to,gasPrice:n.gasPrice,value:n.value,toAmount:n.toAmount}}catch{v.goBack(),oe.showError("Failed to create approval transaction"),l.approvalTransaction=void 0,l.swapTransaction=void 0,l.fetchError=!0;return}}},async createSwapTransaction(){let{networkAddress:e,fromCaipAddress:t,sourceTokenAmount:r}=R.getParams(),o=l.sourceToken,n=l.toToken;if(!t||!r||!o||!n)return;let a=k.parseUnits(r,o.decimals)?.toString();try{let i=await C.generateSwapCalldata({userAddress:t,from:o.address,to:n.address,amount:a,disableEstimate:!0}),s=o.address===e,d=BigInt(i.tx.eip155.gas),u=BigInt(i.tx.eip155.gasPrice),p={data:i.tx.data,to:I.getPlainAddress(i.tx.to),gas:d,gasPrice:u,value:BigInt(s?a??"0":"0"),toAmount:l.toTokenAmount};return l.gasPriceInUSD=$e.getGasPriceInUSD(l.networkPrice,d,u),l.approvalTransaction=void 0,l.swapTransaction=p,p}catch{v.goBack(),oe.showError("Failed to create transaction"),l.approvalTransaction=void 0,l.swapTransaction=void 0,l.fetchError=!0;return}},async sendTransactionForApproval(e){let{fromAddress:t,isAuthConnector:r}=R.getParams();l.loadingApprovalTransaction=!0;let o="Approve limit increase in your wallet";r?v.pushTransactionStack({onSuccess(){oe.showLoading(o)}}):oe.showLoading(o);try{await k.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:"eip155"}),await R.swapTokens(),await R.getTransaction(),l.approvalTransaction=void 0,l.loadingApprovalTransaction=!1}catch(n){let a=n;l.transactionError=a?.shortMessage,l.loadingApprovalTransaction=!1,oe.showError(a?.shortMessage||"Transaction error"),Y.sendEvent({type:"track",event:"SWAP_APPROVAL_ERROR",properties:{message:a?.shortMessage||a?.message||"Unknown",network:c.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:R.state.sourceToken?.symbol||"",swapToToken:R.state.toToken?.symbol||"",swapFromAmount:R.state.sourceTokenAmount||"",swapToAmount:R.state.toTokenAmount||"",isSmartAccount:M.state.preferredAccountTypes?.eip155===ye.ACCOUNT_TYPES.SMART_ACCOUNT}})}},async sendTransactionForSwap(e){if(!e)return;let{fromAddress:t,toTokenAmount:r,isAuthConnector:o}=R.getParams();l.loadingTransaction=!0;let n=`Swapping ${l.sourceToken?.symbol} to ${Q.formatNumberToLocalString(r,3)} ${l.toToken?.symbol}`,a=`Swapped ${l.sourceToken?.symbol} to ${Q.formatNumberToLocalString(r,3)} ${l.toToken?.symbol}`;o?v.pushTransactionStack({onSuccess(){v.replace("Account"),oe.showLoading(n),Lt.resetState()}}):oe.showLoading("Confirm transaction in your wallet");try{let i=[l.sourceToken?.address,l.toToken?.address].join(","),s=await k.sendTransaction({address:t,to:e.to,data:e.data,value:e.value,chainNamespace:"eip155"});return l.loadingTransaction=!1,oe.showSuccess(a),Y.sendEvent({type:"track",event:"SWAP_SUCCESS",properties:{network:c.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:R.state.sourceToken?.symbol||"",swapToToken:R.state.toToken?.symbol||"",swapFromAmount:R.state.sourceTokenAmount||"",swapToAmount:R.state.toTokenAmount||"",isSmartAccount:M.state.preferredAccountTypes?.eip155===ye.ACCOUNT_TYPES.SMART_ACCOUNT}}),Lt.resetState(),o||v.replace("Account"),Lt.getMyTokensWithBalance(i),s}catch(i){let s=i;l.transactionError=s?.shortMessage,l.loadingTransaction=!1,oe.showError(s?.shortMessage||"Transaction error"),Y.sendEvent({type:"track",event:"SWAP_ERROR",properties:{message:s?.shortMessage||s?.message||"Unknown",network:c.state.activeCaipNetwork?.caipNetworkId||"",swapFromToken:R.state.sourceToken?.symbol||"",swapToToken:R.state.toToken?.symbol||"",swapFromAmount:R.state.sourceTokenAmount||"",swapToAmount:R.state.toTokenAmount||"",isSmartAccount:M.state.preferredAccountTypes?.eip155===ye.ACCOUNT_TYPES.SMART_ACCOUNT}});return}},hasInsufficientToken(e,t){return $e.isInsufficientSourceTokenForSwap(e,t,l.myTokensWithBalance)},setTransactionDetails(){let{toTokenAddress:e,toTokenDecimals:t}=R.getParams();!e||!t||(l.gasPriceInUSD=$e.getGasPriceInUSD(l.networkPrice,BigInt(l.gasFee),BigInt(Br)),l.priceImpact=$e.getPriceImpact({sourceTokenAmount:l.sourceTokenAmount,sourceTokenPriceInUSD:l.sourceTokenPriceInUSD,toTokenPriceInUSD:l.toTokenPriceInUSD,toTokenAmount:l.toTokenAmount}),l.maxSlippage=$e.getMaxSlippage(l.slippage,l.toTokenAmount),l.providerFee=$e.getProviderFee(l.sourceTokenAmount))}},R=Z(Lt);var Pe=y({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),Mo={state:Pe,subscribe(e){return z(Pe,()=>e(Pe))},subscribeKey(e,t){return K(Pe,e,t)},showTooltip({message:e,triggerRect:t,variant:r}){Pe.open=!0,Pe.message=e,Pe.triggerRect=t,Pe.variant=r},hide(){Pe.open=!1,Pe.message="",Pe.triggerRect={width:0,height:0,top:0,left:0}}},Lo=Z(Mo);var Fr={convertEVMChainIdToCoinType(e){if(e>=2147483648)throw new Error("Invalid chainId");return(2147483648|e)>>>0}};var Re=y({suggestions:[],loading:!1}),Bo={state:Re,subscribe(e){return z(Re,()=>e(Re))},subscribeKey(e,t){return K(Re,e,t)},async resolveName(e){try{return await C.lookupEnsName(e)}catch(t){let r=t;throw new Error(r?.reasons?.[0]?.description||"Error resolving name")}},async isNameRegistered(e){try{return await C.lookupEnsName(e),!0}catch{return!1}},async getSuggestions(e){try{Re.loading=!0,Re.suggestions=[];let t=await C.getEnsNameSuggestions(e);return Re.suggestions=t.suggestions.map(r=>({...r,name:r.name}))||[],Re.suggestions}catch(t){let r=Bt.parseEnsApiError(t,"Error fetching name suggestions");throw new Error(r)}finally{Re.loading=!1}},async getNamesForAddress(e){try{if(!c.state.activeCaipNetwork)return[];let r=N.getEnsFromCacheForAddress(e);if(r)return r;let o=await C.reverseLookupEnsName({address:e});return N.updateEnsCache({address:e,ens:o,timestamp:Date.now()}),o}catch(t){let r=Bt.parseEnsApiError(t,"Error fetching names for address");throw new Error(r)}},async registerName(e){let t=c.state.activeCaipNetwork;if(!t)throw new Error("Network not found");let r=M.state.address,o=T.getAuthConnector();if(!r||!o)throw new Error("Address or auth connector not found");Re.loading=!0;try{let n=JSON.stringify({name:e,attributes:{},timestamp:Math.floor(Date.now()/1e3)});v.pushTransactionStack({onCancel(){v.replace("RegisterAccountName")}});let a=await k.signMessage(n);Re.loading=!1;let i=t.id;if(!i)throw new Error("Network not found");let s=Fr.convertEVMChainIdToCoinType(Number(i));await C.registerEnsName({coinType:s,address:r,signature:a,message:n}),M.setProfileName(e,t.chainNamespace),v.replace("RegisterAccountNameSuccess")}catch(n){let a=Bt.parseEnsApiError(n,`Error registering name ${e}`);throw v.replace("RegisterAccountName"),new Error(a)}finally{Re.loading=!1}},validateName(e){return/^[a-zA-Z0-9-]{4,}$/u.test(e)},parseEnsApiError(e,t){return e?.reasons?.[0]?.description||t}},Bt=Z(Bo);var _t=y({isLegalCheckboxChecked:!1}),Fo={state:_t,subscribe(e){return z(_t,()=>e(_t))},subscribeKey(e,t){return K(_t,e,t)},setIsLegalCheckboxChecked(e){_t.isLegalCheckboxChecked=e}};var Wo={isUnsupportedChainView(){return v.state.view==="UnsupportedChain"||v.state.view==="SwitchNetwork"&&v.state.history.includes("UnsupportedChain")},async safeClose(){if(this.isUnsupportedChainView()){ie.shake();return}if(await ze.isSIWXCloseDisabled()){ie.shake();return}ie.close()}};var $o={interpolate(e,t,r){if(e.length!==2||t.length!==2)throw new Error("inputRange and outputRange must be an array of length 2");let o=e[0]||0,n=e[1]||0,a=t[0]||0,i=t[1]||0;return r<o?a:r>n?i:(i-a)/(n-o)*(r-o)+a}};var vt,Ye,qe;function Ho(e,t){vt=document.createElement("style"),Ye=document.createElement("style"),qe=document.createElement("style"),vt.textContent=ft(e).core.cssText,Ye.textContent=ft(e).dark.cssText,qe.textContent=ft(e).light.cssText,document.head.appendChild(vt),document.head.appendChild(Ye),document.head.appendChild(qe),Wr(t)}function Wr(e){Ye&&qe&&(e==="light"?(Ye.removeAttribute("media"),qe.media="enabled"):(qe.removeAttribute("media"),Ye.media="enabled"))}function Ko(e){vt&&Ye&&qe&&(vt.textContent=ft(e).core.cssText,Ye.textContent=ft(e).dark.cssText,qe.textContent=ft(e).light.cssText)}function ft(e){return{core:Qe`
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
        --w3m-color-mix-strength: ${ve(e?.["--w3m-color-mix-strength"]?`${e["--w3m-color-mix-strength"]}%`:"0%")};
        --w3m-font-family: ${ve(e?.["--w3m-font-family"]||"Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;")};
        --w3m-font-size-master: ${ve(e?.["--w3m-font-size-master"]||"10px")};
        --w3m-border-radius-master: ${ve(e?.["--w3m-border-radius-master"]||"4px")};
        --w3m-z-index: ${ve(e?.["--w3m-z-index"]||999)};

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
    `,light:Qe`
      :root {
        --w3m-color-mix: ${ve(e?.["--w3m-color-mix"]||"#fff")};
        --w3m-accent: ${ve(ke(e,"dark")["--w3m-accent"])};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: ${ve(ke(e,"dark")["--w3m-background"])};
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
    `,dark:Qe`
      :root {
        --w3m-color-mix: ${ve(e?.["--w3m-color-mix"]||"#000")};
        --w3m-accent: ${ve(ke(e,"light")["--w3m-accent"])};
        --w3m-default: #000;

        --wui-color-modal-bg-base: ${ve(ke(e,"light")["--w3m-background"])};
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
    `}}var _u=Qe`
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
`,vu=Qe`
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
`,ku=Qe`
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
`;var Ft={getSpacingStyles(e,t){if(Array.isArray(e))return e[t]?`var(--wui-spacing-${e[t]})`:void 0;if(typeof e=="string")return`var(--wui-spacing-${e})`},getFormattedDate(e){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(e)},getHostName(e){try{return new URL(e).hostname}catch{return""}},getTruncateString({string:e,charsStart:t,charsEnd:r,truncate:o}){return e.length<=t+r?e:o==="end"?`${e.substring(0,t)}...`:o==="start"?`...${e.substring(e.length-r)}`:`${e.substring(0,Math.floor(t))}...${e.substring(e.length-Math.floor(r))}`},generateAvatarColors(e){let r=e.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),o=this.hexToRgb(r),n=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),i=100-3*Number(n?.replace("px","")),s=`${i}% ${i}% at 65% 40%`,d=[];for(let u=0;u<5;u+=1){let p=this.tintColor(o,.15*u);d.push(`rgb(${p[0]}, ${p[1]}, ${p[2]})`)}return`
    --local-color-1: ${d[0]};
    --local-color-2: ${d[1]};
    --local-color-3: ${d[2]};
    --local-color-4: ${d[3]};
    --local-color-5: ${d[4]};
    --local-radial-circle: ${s}
   `},hexToRgb(e){let t=parseInt(e,16),r=t>>16&255,o=t>>8&255,n=t&255;return[r,o,n]},tintColor(e,t){let[r,o,n]=e,a=Math.round(r+(255-r)*t),i=Math.round(o+(255-o)*t),s=Math.round(n+(255-n)*t);return[a,i,s]},isNumber(e){return{number:/^[0-9]+$/u}.number.test(e)},getColorTheme(e){return e||(typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark")},splitBalance(e){let t=e.split(".");return t.length===2?[t[0],t[1]]:["0","00"]},roundNumber(e,t,r){return e.toString().length>=t?Number(e).toFixed(r):e},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})}};var Vo=3,jo=["receive","deposit","borrow","claim"],Go=["withdraw","repay","burn"],dr={getTransactionGroupTitle(e,t){let r=xt.getYear(),o=xt.getMonthNameByIndex(t);return e===r?o:`${o} ${e}`},getTransactionImages(e){let[t,r]=e,o=!!t&&e?.every(i=>!!i.nft_info),n=e?.length>1;return e?.length===2&&!o?[this.getTransactionImage(t),this.getTransactionImage(r)]:n?e.map(i=>this.getTransactionImage(i)):[this.getTransactionImage(t)]},getTransactionImage(e){return{type:dr.getTransactionTransferTokenType(e),url:dr.getTransactionImageURL(e)}},getTransactionImageURL(e){let t,r=!!e?.nft_info,o=!!e?.fungible_info;return e&&r?t=e?.nft_info?.content?.preview?.url:e&&o&&(t=e?.fungible_info?.icon?.url),t},getTransactionTransferTokenType(e){if(e?.fungible_info)return"FUNGIBLE";if(e?.nft_info)return"NFT"},getTransactionDescriptions(e){let t=e?.metadata?.operationType,r=e?.transfers,o=e?.transfers?.length>0,n=e?.transfers?.length>1,a=o&&r?.every(m=>!!m?.fungible_info),[i,s]=r,d=this.getTransferDescription(i),u=this.getTransferDescription(s);if(!o)return(t==="send"||t==="receive")&&a?(d=Ft.getTruncateString({string:e?.metadata.sentFrom,charsStart:4,charsEnd:6,truncate:"middle"}),u=Ft.getTruncateString({string:e?.metadata.sentTo,charsStart:4,charsEnd:6,truncate:"middle"}),[d,u]):[e.metadata.status];if(n)return r.map(m=>this.getTransferDescription(m));let p="";return jo.includes(t)?p="+":Go.includes(t)&&(p="-"),d=p.concat(d),[d]},getTransferDescription(e){let t="";return e&&(e?.nft_info?t=e?.nft_info?.name||"-":e?.fungible_info&&(t=this.getFungibleTransferDescription(e)||"-")),t},getFungibleTransferDescription(e){return e?[this.getQuantityFixedValue(e?.quantity.numeric),e?.fungible_info?.symbol].join(" ").trim():null},getQuantityFixedValue(e){return e?parseFloat(e).toFixed(Vo):null}};function zo(e,t){let{kind:r,elements:o}=t;return{kind:r,elements:o,finisher(n){customElements.get(e)||customElements.define(e,n)}}}function Yo(e,t){return customElements.get(e)||customElements.define(e,t),t}function qo(e){return function(r){return typeof r=="function"?Yo(e,r):zo(e,r)}}export{no as a,ao as b,Dn as c,y as d,z as e,Me as f,xe as g,K as h,xt as i,J as j,Yt as k,Q as l,Zr as m,qt as n,Qr as o,eo as p,ke as q,le as r,N as s,I as t,O as u,be as v,ir as w,Tt as x,Y as y,x as z,v as A,pt as B,T as C,Da as D,Ma as E,La as F,Ba as G,ye as H,oe as I,ze as J,st as K,k as L,Fe as M,j as N,c as O,C as P,M as Q,ie as R,ur as S,R as T,Lo as U,Bt as V,Fo as W,Wo as X,$o as Y,Ho as Z,Wr as _,Ko as $,_u as aa,vu as ba,ku as ca,Ft as da,dr as ea,qo as fa};
