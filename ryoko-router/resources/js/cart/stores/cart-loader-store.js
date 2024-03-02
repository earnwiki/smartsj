export default {
    /** @type {boolean} */
    loading: false,
    /** @returns {void} */
    startLoading() {
        this.loading = true;
    },
    /** @returns {void} */
    stopLoading() {
        this.loading = false;
    },
    /** @returns {boolean} */
    isLoading() {
        return this.loading;
    }
};
