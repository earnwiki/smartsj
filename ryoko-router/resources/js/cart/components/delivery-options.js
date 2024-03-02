import ProductSlugs from '../enums/product-slugs';

export default function () {
    return {
        hide: false,
        show: () => {
            const displayedOptions = Alpine.store('cartDeliveryOptions').getDisplayedOptions__cartDeliveryOptions();
            if (
                displayedOptions.length === 0 ||
                (
                    displayedOptions.length === 1 &&
                    displayedOptions[0].data.isFree() &&
                    displayedOptions[0].data.productId === ProductSlugs.StandardDelivery
                )
            ) {
                return false;
            }

            return true;
        },
        repositionLeft: () => {
            if (document.querySelector('[data-avoid-reposition-delivery-options]')) {
                return;
            }

            const targetElement = document.querySelector('#delivery-options-left-placeholder');

            if (targetElement) {
                targetElement.appendChild(this.$el);
            }
        },
        repositionRight: () => {
            if (document.querySelector('[data-avoid-reposition-delivery-options]')) {
                return;
            }

            const targetElement = document.querySelector('#delivery-options-right-placeholder');

            if (targetElement) {
                targetElement.appendChild(this.$el);
            }
        },
    };
}
