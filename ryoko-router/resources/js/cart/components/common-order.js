/**
 * @param {Cart} cart
 */
export default function (cart) {
    if (cart.options) {
        try {
            Alpine.store('cartOptions').update(cart.options);
        } catch (e) {
            console.error(e, cart.options);
        }
    }

    if (cart.country) {
        try {
            Alpine.store('cartDeliveryDetails').country = cart.country;
        } catch (e) {
            console.error(e, cart.country);
        }
    }

    Alpine.store('cartDeliveryOptions').showExpressDeliveryForCodOnly = cart.showExpressDeliveryForCodOnly;
    Alpine.store('cartDeliveryOptions').showExpressDelivery = cart.showExpressDelivery;
    Alpine.store('cartDeliveryOptions').showDeliveryDaysInDeliveryOptions = cart.showDeliveryDaysInDeliveryOptions;

    return {
        hideCodSelection__commonOrder: false,
        hideContentForCod__commonOrder: cart.hideContentForCod,
        codGateways__commonOrder: cart.codGateways,
    };
}
