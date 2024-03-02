import DeliveryOption from './delivery-option';
import ProductSlugs from '../enums/product-slugs';
import CartDeliveryOption from '../objects/cart-delivery-option';

export default function (countries, option) {
    const slug = ProductSlugs.DirlLogisticsParcelDelivery;

    return {
        ...new DeliveryOption(slug, option),
        init: () => {
            Alpine.store('cartDeliveryOptions').add(
                new CartDeliveryOption({
                    option: option,
                    showForCountries: countries,
                    destroyedCallback: () => {
                        Alpine.store('cartDeliveryDetails').streetAddress = null;
                        Alpine.store('cartDeliveryDetails').zip = null;
                        Alpine.store('cartDeliveryDetails').hideDeliveryDetails = false;
                        Alpine.store('cartParcelLocker').parcelLockerId = null;
                    },
                    initCallback: () => {
                        Alpine.store('cartDeliveryDetails').hideDeliveryDetails = true;
                    }
                })
            );
        }
    }
}
