import { formatPrice } from './format-price'
import { default as parseProductValue } from './product-value-parser'

export default function () {
    const $form = $('form.order-form');
    updateEstimatedTaxes();
    $form.on('change', updateEstimatedTaxes);
    function updateEstimatedTaxes()
    {
        const $estimatedTaxesEl = $('.upsell-estimated-taxes');
        if ($estimatedTaxesEl.length === 0) {
            return;
        }
        const $selectedProduct = $form.find('input[name^="product["]:checked, input[data-selected], button[name^="product["]');
        const parsedValueObject = parseProductValue($selectedProduct.val(), $estimatedTaxesEl.data('taxes'));
        $estimatedTaxesEl.find('span').text(
            formatPrice(
                parsedValueObject.priceWithTaxes - parsedValueObject.price,
                $estimatedTaxesEl.data('currency'),
                $estimatedTaxesEl.data('locale'),
            )
        )
    }
}
