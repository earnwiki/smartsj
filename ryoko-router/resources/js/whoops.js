export function initPopup(options) {
    let whoopsContainerEl = document.querySelector('.whoops-container');
    let whoopsEl = document.querySelector('.texts');
    if (whoopsContainerEl) {
        whoopsContainerEl.setAttribute('aria-hidden', true);
        whoopsContainerEl.style.display = "block";
        options.orders.forEach(function (el, i) {
            setTimeout(() => {
                whoopsEl.innerHTML = '<p>' + el.topText + '</p><p style="font-weight: bold !important;">' + el.bottomText + '</p>';
                setTimeout(() => {
                    whoopsContainerEl.setAttribute('aria-hidden', false);
                    setTimeout(() => {
                        whoopsContainerEl.setAttribute('aria-hidden', true);
                    }, 5000);
                }, 10000);
            }, i * 15000);
        });
    }
}

