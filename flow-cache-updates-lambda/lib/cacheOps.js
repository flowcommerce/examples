/**
 * @module cacheOps
 * exports a single function used to get a redis command for an object
 */

const keyGen = require('./keyGen');
const constants = require('./constants');

const cacheOps = {};

cacheOps[constants.LOCAL_ITEM_UPSERTED] = function (obj) {
    const key = keyGen.localizedItem(obj.local_item);
    return ['SET', key, JSON.stringify(obj.local_item)];
}

cacheOps[constants.LOCAL_ITEM_DELETED] = function (obj) {
    const key = keyGen.localizedItem(obj.local_item);
    return ['DEL', key];
}

cacheOps[constants.ORGANIZATION_RATES_PUBLISHED] = function(obj) {
    const key = keyGen.organizationRates();
    return ['SET', key, JSON.stringify(obj.data)];
}

cacheOps[constants.ORGANIZATION_COUNTRIES_PUBLISHED] = function(obj) {
    const key = keyGen.organizationCountries();
    return ['SET', key, JSON.stringify(obj.data)];
}

/**
 * Returns a redis command based on the discriminator and cache payload. 
 * 
 * @param {string} discriminator the type of event
 * @param {object} obj (optional) the object to be cached 
 */
function getOp(discriminator, obj) {
    return cacheOps[discriminator](obj);
}

module.exports = getOp;
