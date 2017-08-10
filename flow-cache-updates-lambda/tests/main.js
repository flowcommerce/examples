const assert = require('assert');
const sinon = require('sinon');
const redis = require('redis');
const mainFixtures = require('./mainFixtures');
const main = require('../main');

describe('the main handler', function() {
    it('should insert 2 records and delete 1', function() {
        const replies = ['OK', 'OK', 1];
        
        const exec = function(fn) {
            fn(null, replies);
        }

        const client = {
            batch: sinon.stub()
                .returns({
                    exec: exec
                }),
            quit: sinon.stub()
        }
        
        sinon.stub(redis, 'createClient')
            .returns(client);

        const callback = sinon.stub();

        main.handler(mainFixtures.event, null, callback);

        sinon.assert.calledWith(client.batch, mainFixtures.commands);
        sinon.assert.calledWith(callback, null, replies);
        sinon.assert.calledOnce(client.quit);
    });
});