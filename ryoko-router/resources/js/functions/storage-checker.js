export default type => {
    let storage;
    const TEST_STORAGE_KEY = '__storage_test__';
    try {
        storage = window[type];
        storage.setItem(TEST_STORAGE_KEY, TEST_STORAGE_KEY);
        storage.removeItem(TEST_STORAGE_KEY);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
