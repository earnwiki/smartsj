const breakpoints = {
    sm: 576,
    md: 768,
    lg: 1023,
    xl: 1300
}

export function normalizeHeight() {
    normalize($('[data-normalize-height]'), 'Height');
}

export function normalizeWidth() {
    normalize($('[data-normalize-width]'), 'Width');
}

function normalize(elements, type) {
    const chunkedElements = chunkByName(elements, 'normalize' + type);
    for (const [key, value] of Object.entries(chunkedElements)) {
        let maxValue = 0;
        let prioritizedValue;

        if (value.length < 2) {
            continue;
        }

        value.map(function (object) {
            const elValue = type === 'Height' ?
                object[0].clientHeight :
                object.width();

            maxValue = elValue > maxValue ?
                elValue :
                maxValue;

            if (object[0].dataset.normalizePriority) {
                prioritizedValue = elValue;
            }
        })

        if (prioritizedValue && prioritizedValue !== maxValue) {
            continue;
        }

        value.map(function (object) {
            if (maxValue > 0 && $(document).width() > (breakpoints[object.data('normalizeBp')] || 0)) {
                object.css('min-' + type.toLowerCase(), maxValue + 'px');
            }
        })
    }
}

export function chunkByName(elements, attribute) {
    const chunkedElements = [];

    elements.each((index, el) => {
        el = $(el);
        const value = el.data(attribute);

        if (value in chunkedElements) {
            chunkedElements[value].push(el);
        } else {
            chunkedElements[value] = [el];
        }
    })

    return chunkedElements;
}
