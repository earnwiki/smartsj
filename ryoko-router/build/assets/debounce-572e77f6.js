import{c as v,g as A}from"./sentry-release-injection-file-217247db.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},t=new Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="58627200-caec-4bd1-a477-e3b2d8a9f0d3",e._sentryDebugIdIdentifier="sentry-dbid-58627200-caec-4bd1-a477-e3b2d8a9f0d3")}catch(n){}})();function F(e){var t=typeof e;return e!=null&&(t=="object"||t=="function")}var G=F,M=typeof v=="object"&&v&&v.Object===Object&&v,B=M,U=B,H=typeof self=="object"&&self&&self.Object===Object&&self,X=U||H||Function("return this")(),L=X,q=L,z=function(){return q.Date.now()},J=z,K=/\s/;function Q(e){for(var t=e.length;t--&&K.test(e.charAt(t)););return t}var V=Q,Y=V,Z=/^\s+/;function ee(e){return e&&e.slice(0,Y(e)+1).replace(Z,"")}var te=ee,re=L,ne=re.Symbol,N=ne,I=N,D=Object.prototype,ie=D.hasOwnProperty,ae=D.toString,m=I?I.toStringTag:void 0;function oe(e){var t=ie.call(e,m),n=e[m];try{e[m]=void 0;var a=!0}catch(d){}var f=ae.call(e);return a&&(t?e[m]=n:delete e[m]),f}var fe=oe,ce=Object.prototype,se=ce.toString;function de(e){return se.call(e)}var ue=de,h=N,be=fe,le=ue,me="[object Null]",ge="[object Undefined]",x=h?h.toStringTag:void 0;function ve(e){return e==null?e===void 0?ge:me:x&&x in Object(e)?be(e):le(e)}var ye=ve;function Te(e){return e!=null&&typeof e=="object"}var je=Te,Se=ye,pe=je,$e="[object Symbol]";function Oe(e){return typeof e=="symbol"||pe(e)&&Se(e)==$e}var _e=Oe,Ie=te,E=G,he=_e,w=0/0,xe=/^[-+]0x[0-9a-f]+$/i,Ee=/^0b[01]+$/i,we=/^0o[0-7]+$/i,ke=parseInt;function Ge(e){if(typeof e=="number")return e;if(he(e))return w;if(E(e)){var t=typeof e.valueOf=="function"?e.valueOf():e;e=E(t)?t+"":t}if(typeof e!="string")return e===0?e:+e;e=Ie(e);var n=Ee.test(e);return n||we.test(e)?ke(e.slice(2),n?2:8):xe.test(e)?w:+e}var Le=Ge,Ne=G,S=J,k=Le,De="Expected a function",Re=Math.max,We=Math.min;function Ce(e,t,n){var a,f,d,s,i,c,u=0,p=!1,b=!1,y=!0;if(typeof e!="function")throw new TypeError(De);t=k(t)||0,Ne(n)&&(p=!!n.leading,b="maxWait"in n,d=b?Re(k(n.maxWait)||0,t):d,y="trailing"in n?!!n.trailing:y);function T(r){var o=a,l=f;return a=f=void 0,u=r,s=e.apply(l,o),s}function R(r){return u=r,i=setTimeout(g,t),p?T(r):s}function W(r){var o=r-c,l=r-u,_=t-o;return b?We(_,d-l):_}function $(r){var o=r-c,l=r-u;return c===void 0||o>=t||o<0||b&&l>=d}function g(){var r=S();if($(r))return O(r);i=setTimeout(g,W(r))}function O(r){return i=void 0,y&&a?T(r):(a=f=void 0,s)}function C(){i!==void 0&&clearTimeout(i),u=0,a=c=f=i=void 0}function P(){return i===void 0?s:O(S())}function j(){var r=S(),o=$(r);if(a=arguments,f=this,c=r,o){if(i===void 0)return R(c);if(b)return clearTimeout(i),i=setTimeout(g,t),T(c)}return i===void 0&&(i=setTimeout(g,t)),s}return j.cancel=C,j.flush=P,j}var Pe=Ce;const Fe=A(Pe);export{Pe as a,Fe as d,Le as t};
//# sourceMappingURL=debounce-572e77f6.js.map
