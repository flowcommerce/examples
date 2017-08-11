const redis = require('redis');
const cacheOps = require('./lib/cacheOps');

/**
 * Entrypoint for the lambda function
 */
exports.handler = function (event, context, callback) {

    const redisClient = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        retry_strategy: function ({ error, total_retry_time }) {
            if (error) {
                return options.error;
            }
            if (total_retry_time > 5000) {
                return new Error(`Unable to reach ${process.env.REDIS_HOST} after 5000ms`);
            }
            return 500;
        }
    });


    // retreive a redis command for each Kinesis record based on the
    // provided event discriminator
    const commands = event.Records.map((record) => {
        const data = new Buffer(record.kinesis.data, 'base64').toString('utf8');
        const obj = JSON.parse(data);
        return cacheOps(obj.discriminator, obj);
    });

    const batch = redisClient.batch(commands);

    // execute all of the commands in batch mode
    // logging the results to CloudWatch Logs
    batch.exec((err, replies) => {
        if (err) {
            console.log('Error when trying to cache items', err, replies);
            redisClient.quit();
            callback(err);
            return;
        }
        console.log(`successfully updated ${replies.length} items`, replies);
        redisClient.quit();
        callback(null, replies);
        return;
    })
};