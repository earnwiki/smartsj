import DeliveryOption from './delivery-option';
import ProductSlugs from '../enums/product-slugs';
import CartDeliveryOption from '../objects/cart-delivery-option';

export default function (option) {
    const slug = ProductSlugs.StandardDelivery;

    return {
        ...new DeliveryOption(slug, option),
        init: () => {
            Alpine.store('cartDeliveryOptions').add(
                new CartDeliveryOption({
                    option: option,
                    showForCountries: null,
                })
            );
        }
    }
}
