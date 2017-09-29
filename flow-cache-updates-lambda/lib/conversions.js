
// converts a localized item from dynamo to a local item
// that can be included in a localItemEvent
function dynamoToLocalItem(item) {
    const local = JSON.parse(item.localized_item.M.local.S);
    return {
        id: item.localized_item.M.id.S,
        experience: local.experience,
        item: {
            id: item.localized_item.M.id.S,
            number: item.localized_item.M.number.S
        },
        pricing: {
            price: local.prices.find(p => p.currency = local.experience.currency),
            attributes: local.price_attributes
        },
        status: local.status
    }
}

module.exports = {
    dynamoToLocalItem: dynamoToLocalItem 
}