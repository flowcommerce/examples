const assert = require('assert');
const sinon = require('sinon');
const constants = require('../../lib/constants');
const cacheOps = require('../../lib/cacheOps');
const keyGen = require('../../lib/keyGen');

const sandbox = sinon.sandbox.create();

describe('cacheOps', function() {

    before(function() {
        sandbox.stub(keyGen, 'localizedItem').returns('LOCALIZED_ITEM_KEY');
        sandbox.stub(keyGen, 'organizationRates').returns('ORGANIZATION_RATES_KEY');
        sandbox.stub(keyGen, 'organizationCountries').returns('ORGANIZATION_COUNTRIES_KEY');
    });

    after(function() {
        sandbox.restore();
    });
    
    describe(constants.LOCAL_ITEM_UPSERTED, function() {

        it('should return the correct cache operation', function() {
            const event = {
                local_item: {
                    sampleKey: 'sampleValue'
                }
            }
            assert.deepEqual(cacheOps(constants.LOCAL_ITEM_UPSERTED, event), ['SET', 'LOCALIZED_ITEM_KEY', JSON.stringify(event.local_item)]);
        })
        
    });

    describe(constants.LOCAL_ITEM_DELETED, function() {

        it('should return the correct cache operation', function() {
            const event = {
                local_item: {
                    sampleKey: 'sampleValue'
                }
            }
            assert.deepEqual(cacheOps(constants.LOCAL_ITEM_DELETED, event), ['DEL', 'LOCALIZED_ITEM_KEY']);
        })
        
    });

    describe(constants.ORGANIZATION_RATES_PUBLISHED, function() {

        it('should return the correct cache operation', function() {
            const event = {
                data: {
                    sampleKey: 'sampleValue'
                }
            }
            assert.deepEqual(cacheOps(constants.ORGANIZATION_RATES_PUBLISHED, event), ['SET', 'ORGANIZATION_RATES_KEY', JSON.stringify(event.data)]);
        })
        
    });

describe(constants.ORGANIZATION_COUNTRIES_PUBLISHED, function() {

        it('should return the correct cache operation', function() {
            const event = {
                data: {
                    sampleKey: 'sampleValue'
                }
            }
            assert.deepEqual(cacheOps(constants.ORGANIZATION_COUNTRIES_PUBLISHED, event), ['SET', 'ORGANIZATION_COUNTRIES_KEY', JSON.stringify(event.data)]);
        })
        
    });
})