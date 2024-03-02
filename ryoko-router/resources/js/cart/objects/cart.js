export default class Cart {
    constructor(data) {
        this.codGateways = data.codGateways;
        this.hideContentForCod = data.hideContentForCod;
        this.options = data.options;
        this.country = data.country;
        this.showExpressDeliveryForCodOnly = data.showExpressDeliveryForCodOnly;
        this.showExpressDelivery = data.showExpressDelivery;
        this.showDeliveryDaysInDeliveryOptions = data.showDeliveryDaysInDeliveryOptions;
    }
}
