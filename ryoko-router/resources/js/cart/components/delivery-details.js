export default function () {
    return {
        /** @returns boolean */
        show__deliveryDetails: () => !Alpine.store('cartDeliveryDetails').hideDeliveryDetails
    };
}
