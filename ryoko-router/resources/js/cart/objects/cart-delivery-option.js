import CartOption from './cart-option';

export default class CartDeliveryOption {
    constructor(data) {
        /** @type {CartOption} */
        this.data = new CartOption(data.option, true);
        /** @type {Array|null} */
        this.showForCountries = data.showForCountries || null;
        /** @type {function} */
        this.initCallback = data.initCallback || (() => {});
        /** @type {function} */
        this.destroyedCallback = data.destroyedCallback || (() => {});
        this.show = data.show || (() => {
            let show = true;

            if (this.showForCountries) {
                show = this.showForCountries.includes(Alpine.store('cartDeliveryDetails').country);
            }

            return show;
        });
    };
}
