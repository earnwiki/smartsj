import"./sentry-release-injection-file-b28bd51b.js";function b(){import.meta.url,import("_").catch(()=>1);async function*a(){}}(function(){try{var a=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},n=new Error().stack;n&&(a._sentryDebugIds=a._sentryDebugIds||{},a._sentryDebugIds[n]="22aa85d4-e869-4522-fc15-a6fc6fa9f68d",a._sentryDebugIdIdentifier="sentry-dbid-22aa85d4-e869-4522-fc15-a6fc6fa9f68d")}catch(f){}})();/*!
 * Lazy Load - JavaScript plugin for lazy loading images
 *
 * Copyright (c) 2007-2019 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://appelsiini.net/projects/lazyload
 *
 * Version: 2.0.0-rc.2
 *
 */var u,h;(function(a,n){typeof exports=="object"?module.exports=n(a):typeof define=="function"&&define.amd?define([],n):a.LazyLoad=n(a)})(typeof global<"u"?global:((u=globalThis==null?void 0:globalThis.window)!=null?u:window)||((h=globalThis==null?void 0:globalThis.global)!=null?h:global),function(a){typeof define=="function"&&define.amd&&(a=window);const n={src:"data-src",srcset:"data-srcset",lazyLoadClass:"data-lazy-load-class",selector:".lazyload",root:null,rootMargin:"0px",threshold:0},f=function(){let s={},t=!1,r=0,e=arguments.length;Object.prototype.toString.call(arguments[0])==="[object Boolean]"&&(t=arguments[0],r++);let l=function(o){for(let i in o)Object.prototype.hasOwnProperty.call(o,i)&&(t&&Object.prototype.toString.call(o[i])==="[object Object]"?s[i]=f(!0,s[i],o[i]):s[i]=o[i])};for(;r<e;r++){let o=arguments[r];l(o)}return s};function c(s,t){this.settings=f(n,t||{}),this.images=s||document.querySelectorAll(this.settings.selector),this.observer=null,this.init()}if(c.prototype={init:function(){if(!a.IntersectionObserver){this.loadImages();return}let s=this,t={root:this.settings.root,rootMargin:this.settings.rootMargin,threshold:[this.settings.threshold]};this.observer=new IntersectionObserver(r=>{Array.prototype.forEach.call(r,e=>{if(e.isIntersecting){s.observer.unobserve(e.target);let l=e.target.getAttribute(s.settings.src),o=e.target.getAttribute(s.settings.srcset),i=e.target.getAttribute(s.settings.lazyLoadClass);if(e.target.tagName.toLowerCase()==="video")e.target.autoplay=!0,e.target.load();else if(e.target.tagName.toLowerCase()==="img")l&&(e.target.src=l),o&&(e.target.srcset=o);else if(l)e.target.style.backgroundImage="url('"+l+"')";else if(o){const d=this.getBackgroundImageFromSrcset(o);d&&(e.target.style.backgroundImage="url('"+d+"')")}else if(i){let d=i.replaceAll(`
`,"").split(" ").filter(g=>g);for(let g of d)e.target.classList.add(g)}}})},t),Array.prototype.forEach.call(this.images,function(r){s.observer.observe(r)})},loadAndDestroy:function(){this.settings&&(this.loadImages(),this.destroy())},loadImages:function(){if(!this.settings)return;let s=this;Array.prototype.forEach.call(this.images,t=>{let r=t.getAttribute(s.settings.src),e=t.getAttribute(s.settings.srcset);if(t.tagName.toLowerCase()==="video")t.autoplay=!0,t.load();else if(t.tagName.toLowerCase()==="img")r&&(t.src=r),e&&(t.srcset=e);else if(r)t.style.backgroundImage="url('"+r+"')";else if(e){const l=this.getBackgroundImageFromSrcset(e);l&&(t.style.backgroundImage="url('"+l+"')")}})},destroy:function(){this.settings&&(this.observer.disconnect(),this.settings=null)},getBackgroundImageFromSrcset:function(s){const t=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;let r,e=0;return Array.prototype.forEach.call(s.split(", "),l=>{const o=l.split(" "),i=parseFloat(o[1]);t>=i&&e<=i&&(r=o[0],e=i)}),r}},a.lazyload=function(s,t){return new c(s,t)},a.jQuery){const s=a.jQuery;s.fn.lazyload=function(t){return t=t||{},t.attribute=t.attribute||"data-src",new c(s.makeArray(this),t),this}}return c});new lazyload(document.querySelectorAll("[data-src], [data-srcset], [data-lazy-load-class], .lazyload"),{rootMargin:"45%"});export{b as __vite_legacy_guard};
//# sourceMappingURL=lazyload-91776d81.js.map
