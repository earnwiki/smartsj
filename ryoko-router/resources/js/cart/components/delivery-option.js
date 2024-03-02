import CartDeliveryOption from '../objects/cart-delivery-option';

/**
 * @param {string} productSlug
 * @param {array} option
 * @param {array|null} countries
 */
export default function (productSlug, option, countries = null) {
    return {
        init: () => {
            Alpine.store('cartDeliveryOptions').add(
                new CartDeliveryOption({
                    option: option,
                    showForCountries: countries,
                })
            );
        },
        /** @return CartOption */
        option__deliveryOption: () => Alpine.store('cartDeliveryOptions').get__cartDeliveryOptions(productSlug).data,
        /** @returns boolean */
        show: () => Alpine.store('cartDeliveryOptions').get__cartDeliveryOptions(productSlug).show()
    };
}
