const assert = require('assert');
const sinon = require('sinon');
const redis = require('redis');
const mainFixtures = require('./mainFixtures');
const main = require('../main');

describe('the main handler', function() {

    afterEach(function() {
        redis.createClient.restore();
    });

    it('should insert 2 records and delete 1', function() {
        const replies = ['OK', 'OK', 1];
        
        const exec = (fn) => {
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
        sinon.assert.calledOnce(callback);
        sinon.assert.calledOnce(client.quit);
    });

    it('should handle batch update errors', function() {

        const exec = (fn) => {
            fn(new Error());
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

        main.handler({ Records: [] }, null, callback);

        sinon.assert.calledOnce(callback);
        sinon.assert.calledWith(callback, sinon.match.instanceOf(Error));
        sinon.assert.calledOnce(client.quit);
    });

    it('handle an exception when provided an unkown cache key', function() {

        const exec = sinon.stub();

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
        
        main.handler(mainFixtures.unkownDiscriminatorEvent, null, callback);

        sinon.assert.notCalled(client.batch);
        sinon.assert.notCalled(exec);
        sinon.assert.calledWith(callback, sinon.match.instanceOf(Error));
        sinon.assert.calledOnce(callback);
        sinon.assert.calledOnce(client.quit);
    });

});