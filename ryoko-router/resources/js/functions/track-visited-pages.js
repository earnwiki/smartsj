import {default as isStorageAvailable} from './storage-checker';

const VISITED_PAGES_LOCAL_STORAGE_KEY = 'visitedPages';

export function trackVisitedPages()
{
    if (isStorageAvailable('sessionStorage')) {
        const urls = getUrls();
        urls.push(window.location.href)
        sessionStorage.setItem(VISITED_PAGES_LOCAL_STORAGE_KEY, JSON.stringify(urls));
    }
}

export function redirectToMainPage()
{
    const url = getUrls().find(u => {
        return u.includes('/product') || u.endsWith('/');
    });

    if (window.location.href === url) {
        return;
    }
    window.location.href = url || window.location.origin;
}

export function isPageRefresh()
{
    if (isStorageAvailable('sessionStorage')) {
        const urls = getUrls();
        const count = urls.length;
        const url = window.location.href;

        return (urls[count - 1] || null) === url && (urls[count - 2] || null) === url;
    }

    return false;
}

function getUrls()
{
    return isStorageAvailable('sessionStorage') ?
        (JSON.parse(sessionStorage.getItem(VISITED_PAGES_LOCAL_STORAGE_KEY)) || []) :
        [];
}
