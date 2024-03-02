function shouldApplyChanges(element) {
    if(element === undefined) {
        return false;
    }

    if (element.tagName === 'SELECT') {
        if (checkIfShouldApply(element.innerText)) {
            return true;
        }
    }

    return true;
}

function applyChanges(element, test) {
    element.dir = test ? "ltr" : 'rtl';
}

function checkIfShouldApply(inner, element) {
    const nonLatin = inner.match(/[\u0600-\u06FF]|[\u0590-\u05FF]/g);

    if (shouldApplyChanges(element)) {
        if (nonLatin === null) {
            return true;
        }
    }

    return false;
}

export function rtlCheck() {
    if (document.getElementsByTagName("html")[0].getAttribute("dir") !== "rtl") {
        return;
    }

    document.body.querySelectorAll('a, h1, h2, h3, h4, h5, p, span, select:not([dir]), li, strong, nobr, label').forEach(element => {
        const inner = element.textContent;

        applyChanges(element, checkIfShouldApply(inner, element));
    })

}
