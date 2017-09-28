const AWS = require('aws-sdk');
const idGenerator = require('./lib/idGenerator');

/**
 * Takes Flow localized items from a Dynamo stream, converts them to
 * a localizedItemUpdated event format and places them on another kinesis
 * Stream
 */
exports.handler = function (event, context, callback) {
    try {
        const awsAccessKey = process.env['CONF_AWS_ACCESS_KEY'];
        const awsSecretKey = process.env['CONF_AWS_SECRET_KEY'];
        const awsExternalId = process.env['CONF_AWS_EXTERNAL_ID'];
        const awsRoleARN = process.env['CONF_AWS_ROLE_ARN'];
        const externalStreamName = process.env['EXTERNAL_STREAM_NAME'];

        const credentials = new AWS.Credentials(awsAccessKey, awsSecretKey);

        const externalCredentials = new AWS.TemporaryCredentials({
            RoleArn: awsRoleARN,
            ExternalId: awsExternalId
        }, credentials);

        const kinesis = new AWS.Kinesis({
            credentials: externalCredentials
        });


        const localItemUpsertedEvents = event.Records
            .filter(record => {
                return (record.dynamodb.NewImage.organizationId.S === 'gilt')
            })
            .map(record => {
                console.log('processing item:\n', JSON.stringify(record));
                let item, discriminator;
                if(record.eventName === 'REMOVE') {
                    item = record.dynamodb.OldImage;
                    discriminator = 'local_item_deleted';
                } else {
                    item = record.dynamodb.NewImage;
                    discriminator = 'local_item_upserted';
                }
                const local = JSON.parse(item.localized_item.M.local.S)
                return {
                    event_id: idGenerator.randomId('evt'),
                    timestamp: new Date().toISOString(),
                    organization: item.organizationId.S,
                    local_item: {
                        id: item.id,
                        experience: local.experience,
                        item: {
                            id: item.id,
                            number: item.number.S
                        },
                        pricing: {
                            price: local.prices.find(p => p.currency = local.experience.currency),
                            attributes: {}
                        },
                        status: item.status
                    },
                    discriminator: discriminator,
                    metadata: {
                        dynamodb: true
                    }
                }
            });

        localItemUpsertedEvents.forEach(e => {
            console.log("local item event:\n", JSON.stringify(e));
        });

        callback(null, `processed ${localItemUpsertedEvents.length} events`);
    } catch (e) {
        callback(e);
    }
}