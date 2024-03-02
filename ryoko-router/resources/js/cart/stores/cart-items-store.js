export default {
    /**
     * @type {object}
     */
    items: {},
    /**
     * @param {string} value
     * @param {string} name
     * @returns void
     */
    add(value, name) {
        this.items[name] = value;
    },
    /**
     * @param {string} value
     * @param {string} name
     * @returns void
     */
    update(value, name) {
        this.items[name] = value;
    },
    /**
     * @param {string} name
     * @returns void
     */
    remove(name) {
        delete this.items[name];
    },
    /**
     * @returns int
     */
    count() {
        return Object.values(this.items).length;
    }
};
