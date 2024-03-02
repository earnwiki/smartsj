import DeliveryOption from './delivery-option';
import ProductSlugs from '../enums/product-slugs';
import CartDeliveryOption from '../objects/cart-delivery-option';

export default function (option) {
    const slug = ProductSlugs.GlsParcelDelivery;
    const config= {
        FR: {
            zoom: 5,
            centerLat: 47.0810,
            centerLng: 2.3988,
        }
    }

    return {
        ...new DeliveryOption(slug, option),
        init: () => {
            Alpine.store('cartDeliveryOptions').add(
                new CartDeliveryOption({
                    option: option,
                    showForCountries: ['FR'],
                    destroyedCallback: () => {
                        Alpine.store('cartParcelLocker').reset();
                        Alpine.store('cartDeliveryDetails').hideDeliveryDetails = false;
                        Alpine.store('cartDeliveryDetails').streetAddress = null;
                        Alpine.store('cartDeliveryDetails').zip = null;
                        this.$nextTick(() => {
                            window.paymentsAPI.getStateInput().prop('required', true);
                        })
                    },
                    initCallback: () => {
                        window.paymentsAPI.getStateInput().prop('required', false);
                        window.paymentsAPI.getStateInput().val('');
                        this.$nextTick(() => {
                            Alpine.store('cartDeliveryDetails').hideDeliveryDetails = true;
                        })
                    },
                })
            );
        },
        click: () => {
            Alpine.store('cartLoader').startLoading();
            const countryConfig = config[Alpine.store('cartDeliveryDetails').country];
            Alpine.store('cartParcelLocker').zoom = countryConfig.zoom;
            Alpine.store('cartParcelLocker').centerLat = countryConfig.centerLat;
            Alpine.store('cartParcelLocker').centerLng = countryConfig.centerLng;
            Alpine.store('cartParcelLocker').showSelectionMap = true;
            Alpine.store('cartParcelLocker').onSelectCallback = function () {
                const streetAddress = Alpine.store('cartParcelLocker').parcelLockerObject.address;
                Alpine.store('cartDeliveryOptions').select(slug);
                // Our validation requires a number. If non exists add 1 :-D
                Alpine.store('cartDeliveryDetails').streetAddress = /\d/.test(streetAddress) ? streetAddress : (streetAddress + ' 0000');
                Alpine.store('cartDeliveryDetails').zip = Alpine.store('cartParcelLocker').parcelLockerObject.postcode;
                Alpine.store('cartDeliveryDetails').city = Alpine.store('cartParcelLocker').parcelLockerObject.city;
            };
        }
    }
}
