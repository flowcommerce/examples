const AWS = require('aws-sdk');
const idGenerator = require('./lib/idGenerator');
const conversions = require('./lib/conversions');

/**
 * Takes Flow localized items from a Dynamo stream, converts them to
 * a localizedItemUpdated event format and places them on another kinesis
 * Stream
 */
exports.handler = function (event, context, callback) {
    let localItemEvents;
    try {
        const orgFilter = process.env['ORG_FILTER'];
        localItemEvents = event.Records
            .filter(record => {
                if (record.dynamodb.OldImage) {
                    return (record.dynamodb.OldImage.organizationId.S === orgFilter);
                }
                if (record.dynamodb.NewImage) {
                    return (record.dynamodb.NewImage.organizationId.S === orgFilter);
                }
                return false;
            })
            .map(record => {
                //console.log('processing item:\n', JSON.stringify(record));
                let item, discriminator;
                if (record.eventName === 'REMOVE') {
                    item = record.dynamodb.OldImage;
                    discriminator = 'local_item_deleted';
                } else {
                    item = record.dynamodb.NewImage;
                    discriminator = 'local_item_upserted';
                }

                return {
                    event_id: idGenerator.randomId('evt'),
                    timestamp: new Date().toISOString(),
                    organization: item.organizationId.S,
                    local_item: conversions.dynamoToLocalItem(item),
                    discriminator: discriminator,
                    metadata: {
                        dynamodb: true
                    }
                }
            });
    } catch (e) {
        callback(e);
        return;
    }

    if (localItemEvents.length == 0) {
        const msg = 'No items to put on stream';
        console.log(msg);
        callback(null, msg);
        return;
    }

    const awsAccessKey = process.env['CONF_AWS_ACCESS_KEY'];
    const awsSecretKey = process.env['CONF_AWS_SECRET_KEY'];
    const awsExternalId = process.env['CONF_AWS_EXTERNAL_ID'];
    const awsRoleARN = process.env['CONF_AWS_ROLE_ARN'];
    const externalStreamName = process.env['CONF_AWS_INTEGRATION_STREAM_NAME'];

    const credentials = new AWS.Credentials(awsAccessKey, awsSecretKey);

    const externalCredentials = new AWS.TemporaryCredentials({
        RoleArn: awsRoleARN,
        ExternalId: awsExternalId
    }, credentials);

    const kinesis = new AWS.Kinesis({
        credentials: externalCredentials
    });

    console.log(`Putting ${localItemEvents.length} records to stream ${externalStreamName}`);

    const params = {
        Records: localItemEvents.map(record => {
            return {
                Data: new Buffer(JSON.stringify(record)),
                PartitionKey: record.event_id
            }
        }),
        StreamName: externalStreamName
    }
    return kinesis.putRecords(params)
        .promise()
        .then(data => {
            try {

                const cloudWatch = new AWS.CloudWatch({
                    credentials: credentials
                });

                const now = new Date();
                const metricParams = {
                    Namespace: `Flow/Lambda/${orgFilter}-localized-items`,
                    MetricData: [
                        {
                            MetricName: 'FailedRecords',
                            Value: data.FailedRecordCount,
                            Unit: 'Count'
                        },
                        {
                            MetricName: 'SuccessfulRecords',
                            Value: data.Records.length - data.FailedRecordCount,
                            Unit: 'Count'
                        }
                    ]

                };
                cloudWatch.putMetricData(metricParams, (err, data) => {
                    if (err) {
                        console.log('Error from cloudwatch', err);
                    }
                });
            } catch (e) {
                console.log('Error when trying to write metrics to cloudwatch', e);
            }

            if (data.FailedRecordCount > 0) {
                const msg = `putRecords to ${externalStreamName} was successful, but contained ${data.FailedRecordCount} failed records out of ${data.Records.length} total records`
                console.log(msg + ':\n${Records}');
                callback(null, msg);
            } else {
                const msg = `Successfully put ${data.Records.length} records to ${externalStreamName}`;
                console.log(msg);
                callback(null, msg);
            }
        })
        .catch(callback)

}