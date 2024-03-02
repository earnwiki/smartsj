import $ from 'jquery';

$(window).bind('load', wrapText);

function wrapText()
{
    $('[data-wrap-text]:visible').each((index, element) => {
        element = $(element);
        const lineHeight = element.css('lineHeight').replace(/[^-\d\.]/g, '');
        const elementHeight = element.height();
        if (
            Math.floor(elementHeight) / Math.floor(lineHeight) === 1 ||
            Math.ceil(elementHeight) / Math.ceil(lineHeight) === 1
        ) {
            return;
        }
        const tempElement = createTemporaryCopyElement(element);
        $('html').append(tempElement);

        setTimeout(() => handleTextWrapping(tempElement, element));
    });
}

function replaceNthOccurrence(string, occurrence, replace, search)
{
    const regex = RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') , 'g');
    let i = 0;

    occurrence = (string.match(regex) || []).length - occurrence + 1;

    return string.replace(regex, match => ++i === occurrence ? replace : match);
}

function copyStyles(element, tempElement)
{
    const cssDisplay = element.css('display');

    tempElement.css({
        "font-size": element.css('font-size'),
        "font-family": element.css('font-family'),
        "font-weight": element.css('font-weight'),
        "text-transform": element.css('text-transform'),
        "opacity": 0,
        'width': Math.ceil(element.innerWidth()),
        'max-width': element.css('max-width'),
    });
    tempElement.attr('style', tempElement.attr('style') + '; display: ' + (cssDisplay === 'flex' ? 'block !important' : cssDisplay));

    return tempElement;
}

function createTemporaryCopyElement(element)
{
    const tempElement = $().add(element.clone()).empty();
    const contents = element.contents();

    copyStyles(element, tempElement);
    $.each(contents, (i, content) => {
        const words = $(content).text().trim().split(" ");

        $.each(words, (i2, word) => {
            let el = $('<span>' + word + '</span>');

            if (content.nodeType !== 3) {
                copyStyles($(content), el)
            }

            tempElement.append(el);

            if (contents.length !== i - 1 && words.length !== i2) {
                tempElement.append(' ');
            }
        });
    });
    tempElement.html(tempElement.html().slice(0, -1));

    return tempElement;
}

function getLineByLineArray(tempElement)
{
    let i = -1;
    let lastOffset;
    let lastHeight;
    let rows = [];

    tempElement.children().each((index, text) => {
        const topOffset = $(text).offset().top;
        const height = $(text).outerHeight();

        if (lastHeight && lastHeight !== height) {
            const offsetCenter = topOffset + (height / 2);
            const lastOffsetCenter = lastOffset + (lastHeight / 2);

            if (Math.abs(offsetCenter - lastOffsetCenter) > Math.abs(height - lastHeight) / 2) {
                rows.push([]);
                i++;
            }
        } else if (topOffset !== lastOffset) {
            rows.push([]);
            i++;
        }

        rows[i].push(text);
        lastOffset = topOffset;
        lastHeight = height;
    });

    return rows;
}

function findWrapPoint(rows)
{
    const penultRowIndex = rows.length - 2;
    let penultRowTotalWidth = 0;
    let lastRowTotalWidth = 0;
    let occurrences = 0;
    let breakBeforeText = null;
    let breakAfterIndex;
    rows[penultRowIndex].forEach(item => penultRowTotalWidth += item.offsetWidth)
    rows[rows.length - 1].forEach(item => lastRowTotalWidth += item.offsetWidth)
    for (let i = 0; i < rows[penultRowIndex].length; i++) {
        const item = rows[penultRowIndex][rows[penultRowIndex].length - i - 1];
        const width = item.offsetWidth;
        if (penultRowTotalWidth - lastRowTotalWidth < 0 || lastRowTotalWidth + width > penultRowTotalWidth - width) {
            break
        }
        penultRowTotalWidth -= width;
        lastRowTotalWidth += width;

        breakBeforeText = $(rows[penultRowIndex][rows[penultRowIndex].length - i - 1]).text();
        breakAfterIndex = i;
    }

    if (breakBeforeText) {
        for (let i = 0; i < rows[rows.length - 1].length; i++) {
            const matches = $(rows[rows.length - 1][i]).text().match(new RegExp(breakBeforeText, 'g'));
            occurrences = occurrences + (matches ? matches.length : 0);
        }
        for (let i = rows[penultRowIndex].length - breakAfterIndex - 1; i < rows[penultRowIndex].length; i++) {
            const matches = $(rows[penultRowIndex][i]).text().match(new RegExp(breakBeforeText, 'g'));
            occurrences = occurrences + (matches ? matches.length : 0);
        }
    }

    return {breakBeforeText, occurrences};
}

function handleTextWrapping(tempElement, element)
{
    const rows = getLineByLineArray(tempElement);
    if (rows.length < 2) {
        tempElement.remove();

        return;
    }

    const {breakBeforeText, occurrences} = findWrapPoint(rows);
    if (breakBeforeText) {
        element.html(
            replaceNthOccurrence(
                element.html(),
                occurrences,
                '<br>' + breakBeforeText,
                breakBeforeText
            )
        );
    }
    tempElement.remove();
}
