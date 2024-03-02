export function formatPrice(num, currency = 'USD', locale = 'en-US')
{
    try {
        // represent numbers the same as in PHP (never rounding up). It is incorrect in both cases, but only 1 cent difference
        const split = num.toString().split('.');
        if (split.length === 2) {
            num = split[0] + '.' + split[1].substr(0, 2);
        }
        if (locale.toLowerCase() === 'es-mx') {
            locale = 'es';
        }
        return new Intl.NumberFormat(locale, {style: 'currency', currency}).format(num);
    } catch (e) {
        window.Sentry && window.Sentry.captureException('intl is missing');
        return num + currency;
    }
}

export function formatPercent(num, locale = 'en-US')
{
    try {
        return new Intl.NumberFormat(locale, {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(num);
    } catch (e) {
        window.Sentry && window.Sentry.captureException('intl is missing');
        return (num * 100) + '%';
    }
}

window.formatPrice = formatPrice;
