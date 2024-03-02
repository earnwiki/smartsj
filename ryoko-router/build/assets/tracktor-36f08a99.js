import"./sentry-release-injection-file-7e036f35.js";function p(){import.meta.url,import("_").catch(()=>1);async function*e(){}}(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},n=new Error().stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="498767b1-9d6a-4d4b-7121-2fd68848b171",e._sentryDebugIdIdentifier="sentry-dbid-498767b1-9d6a-4d4b-7121-2fd68848b171")}catch(o){}})();const r={iframe:null,uuid:null,init:function(e,n){return new Promise(function(o,t){if(r.iframe&&r.uuid){o();return}if(!s(n)){t("Invalid UUID");return}d(e).then(function(i){r.iframe=i,r.uuid=n,o()}).catch(function(i){console.error(i),console.error("Failed to load Tracktor iframe. Using Fallback"),r.initFallback(n).catch(function(u){console.error(u),t(u)})})})},initFallback:function(e){return new Promise(function(n,o){d(h()).then(function(t){r.iframe=t,r.uuid=e,n()}).catch(function(t){console.error(t),o("Failed to load Tracktor fallback")})})},addInputListeners:function(){const e=document.querySelector('input[name="email"]');e&&e.addEventListener("change",function(){l(e.value)&&r.recordEmail(e.value).catch(t=>console.error(t))});const n=document.querySelector('input[name="_phone_number"]'),o=document.querySelector('input[name="phone_number"]');n&&o&&n.addEventListener("change",function(){f(o.value)&&r.recordPhone(o.value).catch(t=>console.error(t))})},recordVisit:function(e,n){let o={uuid:this.uuid,data:e,url:window.location.href};return n&&(o.segments=n),c(this.uuid,"recordVisit",o,this.iframe)},recordEmail:function(e){return c(this.uuid,"recordEmail",{uuid:this.uuid,email:e},this.iframe)},recordPhone:function(e){return c(this.uuid,"recordPhone",{uuid:this.uuid,phone:e},this.iframe)}};async function c(e,n,o,t){if(!t)throw"Cannot record data, need to call initTracktor(src) first";const i={type:n,detail:o};t.contentWindow.postMessage(i,"*")}function s(e){return a(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,e)}function l(e){return a(/^[^\s@]+@[^\s@]+\.[^\s@]+$/,e)}function f(e){return a(/^\+?\d{8,}$/,e)}function a(e,n){return e.test(n)}function d(e){return new Promise(function(n,o){let t=document.createElement("iframe");t.width="1",t.height="1",t.style.border="0",t.onload=()=>n(t),t.onerror=o,t.src=e,document.body.appendChild(t)})}function m(){const n=window.location.hostname.split("."),o=[".co.uk",".com.au",".co.jp",".co.in",".com.br",".com.mx"];let t=0;for(;t<n.length;){const i="."+n.slice(t).join(".");if(o.includes(i))return n.slice(t-1).join(".");t++}return n.slice(n.length-2).join(".")}function h(){return window.location.protocol+"//tracktor."+m()}window.tracktor=r;export{p as __vite_legacy_guard};
//# sourceMappingURL=tracktor-36f08a99.js.map
