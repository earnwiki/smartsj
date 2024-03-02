import { Alpine } from '../../../../vendor/livewire/livewire/dist/livewire.esm';
import CartItemNames from '../enums/cart-item-names';
import CartOption from '../objects/cart-option';
import ProductSlugs from '../enums/product-slugs';

export default {
    /** @type {CartDeliveryOption[]} */
    options: [],
    minStandardDeliveryDays: null,
    maxStandardDeliveryDays: null,
    minExpressDeliveryDays: null,
    maxExpressDeliveryDays: null,
    showExpressDelivery: false,
    showExpressDeliveryForCodOnly: false,
    showDeliveryDaysInDeliveryOptions: false,
    init() {
        Alpine.effect(() => {
            Alpine.store('cartDeliveryDetails').country;
            Alpine.store('cartPaymentOptions')?.selectedOption;
            this.selectFirstDisplayedOptionIfNoOptionIsSelected();
        });
    },
    /**
     * @param {CartDeliveryOption} option
     * @return {void}
     */
    add(option) {
        this.options.push(option);
        this.selectFirstDisplayedOptionIfNoOptionIsSelected();
    },
    /**
     * @param {string} productSlug
     * @param {string} data
     * @returns void
     */
    update(productSlug, data) {
        this.options = this.options.map(option => {
            if (option.data.productId === productSlug) {
                const checked = option.data.checked;
                option.data = new CartOption(data);
                option.data.checked = checked;

                return option;
            }

            return option;
        });
        this.updateCartItemsStoreBasedOnSelectedDeliveryOption();
    },
    /**
     * @param {string} productSlug
     * @returns void
     */
    select(productSlug) {
        this.options.map(option => {
            if (option.data.checked && option.data.productId !== productSlug) {
                option.destroyedCallback();
            }
            option.data.checked = option.data.productId === productSlug;
            if (option.data.checked) {
                option.initCallback();
            }

            return option;
        });

        this.updateCartItemsStoreBasedOnSelectedDeliveryOption();
    },
    /**
     * @param {string} productSlug
     * @returns {CartDeliveryOption | null}
     */
    get__cartDeliveryOptions(productSlug) {
        return this.options.find(option => option.data.productId === productSlug);
    },
    /**
     * @returns {CartDeliveryOption | null}
     */
    getSelected__cartDeliveryOptions() {
        return this.options.find(option => option.data.checked === true) || null;
    },
    /**
     * @return {CartDeliveryOption[]}
     */
    getDisplayedOptions__cartDeliveryOptions() {
        return this.options.filter(option => option.show());
    },
    /**
     * @returns void
     */
    updateCartItemsStoreBasedOnSelectedDeliveryOption() {
        const checkedOption = this.getSelected__cartDeliveryOptions();
        if (checkedOption) {
            if (checkedOption.data.isFree()) {
                this.removeFromCartItems();
            } else {
                Alpine.store('cartItems').update(checkedOption.data.id, CartItemNames.Delivery);
            }
        }
    },
    /**
     * @returns void
     */
    selectFirstDisplayedOptionIfNoOptionIsSelected() {
        if (!this.getSelected__cartDeliveryOptions()?.show()) {
            const option = this.options.find(
                option => option.show() &&
                    ![
                        ProductSlugs.InpostParcelDelivery,
                        ProductSlugs.DirlLogisticsParcelDelivery,
                        ProductSlugs.GlsParcelDelivery,
                        ProductSlugs.AustraliaPostParcelDelivery,
                    ].includes(option.data.productId)
            );
            if (option) {
                this.select(option.data.productId);
            }
        }
    },
    /**
     * @returns void
     */
    addToCartItems() {
        Alpine.store('cartItems').add(this.getSelected__cartDeliveryOptions().data.id, CartItemNames.Delivery);
    },
    /**
     * @returns void
     */
    removeFromCartItems() {
        Alpine.store('cartItems').remove(CartItemNames.Delivery);
    },

    // Events
    repositionLeft() {
        window.dispatchEvent(new CustomEvent('delivery-options-reposition-left'));
    },
    repositionRight() {
        window.dispatchEvent(new CustomEvent('delivery-options-reposition-right'));
    },
    hideDomElement() {
        window.dispatchEvent(new CustomEvent('delivery-options-hide'));
    },
    showDomElement() {
        window.dispatchEvent(new CustomEvent('delivery-options-show'));
    },
};
