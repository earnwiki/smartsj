import { Livewire, Alpine } from '../../vendor/livewire/livewire/dist/livewire.esm';
import collapse from '@alpinejs/collapse';
import Splide from 'alpine-splide';
import SplideOrg from '@splidejs/splide';

import CartItemsStore from './cart/stores/cart-items-store';
import CartOptionsStore from './cart/stores/cart-options-store';
import CartDeliveryDetailsStore from './cart/stores/cart-delivery-details-store';
import CartDeliveryOptionsStore from './cart/stores/cart-delivery-options-store';
import CartParcelLockerStore from './cart/stores/cart-parcel-locker-store';
import CartLoaderStore from './cart/stores/cart-loader-store';
import CartButtonStore from './cart/stores/cart-button-store';
import CartPaymentOptionsStore from './cart/stores/cart-payment-options-store';

import CommonOrder from './cart/components/common-order';
import DeliveryOption from './cart/components/delivery-option';
import DeliveryOptions from './cart/components/delivery-options';
import DeliveryDetails from './cart/components/delivery-details';
import InpostDeliveryOption from './cart/components/inpost-delivery-option';
import DirlDeliveryOption from './cart/components/dirl-delivery-option';
import GlsDeliveryOption from './cart/components/gls-delivery-option';
import CoverlasticOptions from './cart/components/coverlastic-options';

import Cart from './cart/objects/cart';
import CartDeliveryOption from './cart/objects/cart-delivery-option';
import CartOption from './cart/objects/cart-option';
import StandardDeliveryOption from './cart/components/standard-delivery-option';
import ExpressDeliveryOption from './cart/components/express-delivery-option';

window.ecommerce = {};
window.ecommerce.Cart = Cart;
window.ecommerce.CartDeliveryOption = CartDeliveryOption;
window.ecommerce.CartOption = CartOption;

window.Alpine = Alpine;
window.Splide = Splide;
window.SplideOrg = SplideOrg;

Alpine.plugin(collapse);

Alpine.data('commonOrder', CommonOrder);
Alpine.data('deliveryDetails', DeliveryDetails);
Alpine.data('deliveryOption', DeliveryOption);
Alpine.data('deliveryOptions', DeliveryOptions);
Alpine.data('standardDeliveryOption', StandardDeliveryOption);
Alpine.data('expressDeliveryOption', ExpressDeliveryOption);
Alpine.data('inpostDeliveryOption', InpostDeliveryOption);
Alpine.data('dirlDeliveryOption', DirlDeliveryOption);
Alpine.data('glsDeliveryOption', GlsDeliveryOption);
Alpine.data('coverlasticOptions', CoverlasticOptions);

Alpine.store('cartItems', CartItemsStore);
Alpine.store('cartOptions', CartOptionsStore);
Alpine.store('cartDeliveryDetails', CartDeliveryDetailsStore);
Alpine.store('cartDeliveryOptions', CartDeliveryOptionsStore);
Alpine.store('cartParcelLocker', CartParcelLockerStore);
Alpine.store('cartLoader', CartLoaderStore);
Alpine.store('cartButton', CartButtonStore);
Alpine.store('cartPaymentOptions', CartPaymentOptionsStore);

Alpine.data('Splide', Splide);

Livewire.start();
