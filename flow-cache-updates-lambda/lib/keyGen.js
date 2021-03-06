/**
 * @module keyGen
 * Exports a map of functions used to generate the cache key
 * for each type of event 
 */

function localizedItem(item) {
    return `country-${item.experience.country}:${item.item.number}`;
}

function organizationRates() {
    return 'rates';
}

function organizationCountries() {
    return 'organization_countries';
}

module.exports = {
    localizedItem: localizedItem,
    organizationRates: organizationRates,
    organizationCountries: organizationCountries
}