export default class CartOption {
    constructor(data, setCheckedToFalse = false) {
        this.id = data.id;
        this.productId = data.product_id;
        this.label = data.trans;
        this.checked = setCheckedToFalse ? false : data.checked;
        this.count = data.count;
        this.price = data.price;
        this.priceFormatted = data.price_formatted;
        this.unitOriginalPrice = data.unit_original_price;
        this.unitOriginalPriceFormatted = data.unit_original_price_formatted;
        this.totalPrice = data.total_price;
        this.totalPriceFormatted = data.total_price_formatted;
        this.originalPrice = data.original_price;
        this.originalPriceFormatted = data.original_price_formatted;
        this.subscriptionPrice = data.subscription_price;
        this.subscriptionPriceFormatted = data.subscription_price_formatted;
        this.currency = data.currency;
        this.convertedFromCurrency = data.converted_from_currency;
        this.discountApplied = data.discount_applied;
        this.discountPercentage = data.discount_percentage;
        this.attributes = data.attributes;
        this.labelPriceTemplate = data.label_price_template;
    }
    isFree() {
        return parseFloat(this.price) === 0;
    }
}
