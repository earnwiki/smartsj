export default function encodeProductValue(value)
{
    return JSON.stringify([
        value.id,
        value.price,
        value.quantity,
        value.name,
        value.options || {},
        value.currency,
        value.subscriptionPlan,
        value.taxes,
        value.oldPrice,
        value.relatedProducts
    ])
}
