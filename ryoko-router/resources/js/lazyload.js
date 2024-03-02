import './functions/lazyload';

new lazyload(document.querySelectorAll('[data-src], [data-srcset], [data-lazy-load-class], .lazyload'), {
    rootMargin: "45%",
});
