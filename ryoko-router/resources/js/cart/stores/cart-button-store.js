export default {
    /** @type {string} */
    text: '',
    /** @type {string} */
    defaultText: '',
    /** @type {string} */
    codText: '',
    /** @returns void */
    setDefaultText() {
        this.text = this.defaultText;
    },
    /** @returns void */
    setCodText() {
        this.text = this.codText;
    },
};
