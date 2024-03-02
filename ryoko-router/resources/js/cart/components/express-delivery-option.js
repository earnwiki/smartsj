import DeliveryOption from './delivery-option';
import ProductSlugs from '../enums/product-slugs';
import CartDeliveryOption from '../objects/cart-delivery-option';

export default function (option) {
    const slug = ProductSlugs.ExpressDelivery;
    let firstTimeDisplayed = true;

    return {
        ...new DeliveryOption(slug, option),
        init: () => {
            Alpine.store('cartDeliveryOptions').add(
                new CartDeliveryOption({
                    option: option,
                    showForCountries: null,
                    show: () => {
                        const showForCod = Alpine.store('cartDeliveryOptions').showExpressDeliveryForCodOnly &&
                            Alpine.store('cartPaymentOptions').selectedOption?.meta?.cod;
                        const show = Alpine.store('cartDeliveryOptions').showExpressDelivery || showForCod;

                        if (show & showForCod && firstTimeDisplayed) {
                            Alpine.store('cartDeliveryOptions').select(slug);
                            firstTimeDisplayed = false;
                        }

                        return show;
                    },
                })
            );
        }
    }
}
