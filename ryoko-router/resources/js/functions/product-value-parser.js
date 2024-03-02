export default function parseProductValue(value, taxRate)
{
    const data = JSON.parse(value);
    const taxes = parseFloat((parseFloat(data[1]) * taxRate).toFixed(2));
    return {
        id: data[0],
        price: parseFloat(data[1]),
        priceWithTaxes: parseFloat((parseFloat(data[1]) + taxes).toFixed(2)),
        taxes: taxes,
        taxRate: taxRate,
        unitPrice: parseFloat(data[1]) / data[2],
        quantity: data[2],
        name: data[3],
        options: Array.isArray(data[4]) ? {} : data[4],
        currency: data[5] || null,
        subscriptionPlan: data[6],
        oldPrice: parseFloat(data[8]),
        relatedProducts: data[9],
        pricingItem: data[11], /** @deprecated !!!!DON'T USE IT IN FRONT END!!!! ASK HARIS */
        type: data[12]
    };
}
