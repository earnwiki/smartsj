import CartOption from '../objects/cart-option';
import CartItemNames from '../enums/cart-item-names';
import { Alpine } from '../../../../vendor/livewire/livewire/dist/livewire.esm';

export default {
    /**
     * @type {CartOption[]}
     */
    options: [],
    /**
     * @type boolean
     */
    hasUserInteractedWithOptions: false, // is user made interaction with option fields. At least once changed selection to another quantity.
    /**
     * @param {array} options
     * @param {boolean} updateCartItemsStore
     * @returns void
     */
    update(options, updateCartItemsStore = true) {
        this.options = [];
        options.map(option => this.options.push(new CartOption(option)));
        if (updateCartItemsStore) {
            this.updateCartItemsStoreBasedOnSelectedOption();
        }
    },
    /**
     * @param {array} options
     * @returns void
     */
    updateWithPersistedSelectedIndex(options) {
        const selectedIndex = this.getSelectedIndex();
        this.update(options, false);
        this.setSelectedWithIndex(selectedIndex);
    },
    /**
     * @param {number} index
     * @returns void
     */
    setSelectedWithIndex(index) {
        this.hasUserInteractedWithOptions = true;
        this.options.map((option, key) => {
            option.checked = parseInt(index) === key;

            return option;
        });
        this.updateCartItemsStoreBasedOnSelectedOption();
    },
    /**
     * @returns {CartOption | null}
     */
    getSelected__cartOptions() {
        return this.options.find(option => option.checked === true) || null;
    },
    /**
     * @returns {number | null}
     */
    getSelectedIndex() {
        const key = Object.keys(this.options).find(key => this.options[key].checked === true);

        return key ? parseInt(key) : null;
    },
    /**
     * @returns void
     */
    updateCartItemsStoreBasedOnSelectedOption() {
        const checkedOption = this.getSelected__cartOptions();
        if (checkedOption) {
            Alpine.store('cartItems').update(checkedOption.id, CartItemNames.Product);
        }
    },
    /**
     * @returns void
     */
    addToCartItems() {
        this.updateCartItemsStoreBasedOnSelectedOption()
    },
    /**
     * @returns void
     */
    removeFromCartItems() {
        Alpine.store('cartItems').remove(CartItemNames.Product);
    },

};
