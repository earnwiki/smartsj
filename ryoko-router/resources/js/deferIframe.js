export function deferIframe() {
    $('.embed-placeholder').click(function() {
        const iframeElem = document.getElementsByClassName('lazyload-iframe');
        const placeholders = document.getElementsByClassName('embed-placeholder');

        for (let i = 0; i < iframeElem.length; i++) {
            iframeElem[i].style.display = 'block';

            if (iframeElem[i].getAttribute('data-src')) {
                iframeElem[i].setAttribute('src', iframeElem[i].getAttribute('data-src'));
            }

            if (placeholders[i]) {
                placeholders[i].remove();
            }
        }
    })
}
