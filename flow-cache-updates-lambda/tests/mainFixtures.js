const cacheOps = require('../lib/cacheOps');
const constants = require('../lib/constants');

const upsertpayload = '{"event_id":"evt-1","timestamp":"2017-08-03T21:15:02.320Z","organization":"gilt","local_item":{"id":"sci-eb15e0acedb64d82b1c0bd19120a1630","experience":{"id":"exp-70dc526c34604be9bc927e8354ac159f","key":"canada","name":"Canada","country":"CAN","currency":"CAD","language":"en"},"item":{"id":"sci-eb15e0acedb64d82b1c0bd19120a1630","number":"6498601"},"pricing":{"price":{"currency":"CAD","amount":64.95,"label":"CA$64.95","base":{"amount":49.68,"currency":"USD","label":"$49.68"}},"attributes":{}},"status":"included"},"discriminator":"local_item_upserted"}';
const upsertpayload2 = '{"event_id":"evt-2","timestamp":"2017-08-03T21:15:02.320Z","organization":"gilt","local_item":{"id":"sci-2","experience":{"id":"exp-70dc526c34604be9bc927e8354ac159f","key":"canada","name":"Canada","country":"CAN","currency":"CAD","language":"en"},"item":{"id":"sci-eb15e0acedb64d82b1c0bd19120a1630","number":"6498602"},"pricing":{"price":{"currency":"CAD","amount":64.95,"label":"CA$64.95","base":{"amount":49.68,"currency":"USD","label":"$49.68"}},"attributes":{}},"status":"included"},"discriminator":"local_item_upserted"}';
const deletepayload = '{"event_id":"evt-3","timestamp":"2017-08-03T21:15:02.320Z","organization":"gilt","local_item":{"id":"sci-eb15e0acedb64d82b1c0bd19120a1630","experience":{"id":"exp-70dc526c34604be9bc927e8354ac159f","key":"canada","name":"Canada","country":"CAN","currency":"CAD","language":"en"},"item":{"id":"sci-eb15e0acedb64d82b1c0bd19120a1630","number":"6498601"},"pricing":{"price":{"currency":"CAD","amount":64.95,"label":"CA$64.95","base":{"amount":49.68,"currency":"USD","label":"$49.68"}},"attributes":{}},"status":"included"},"discriminator":"local_item_deleted"}'; 
const upsertencoded = new Buffer(upsertpayload).toString('base64');
const upsertencoded2 = new Buffer(upsertpayload2).toString('base64');
const deleteencoded = new Buffer(deletepayload).toString('base64');

const event = {
    Records: [
        {
            "eventID": "shardId-000000000000:1",
            "eventVersion": "1.0",
            "kinesis": {
                "partitionKey": "partitionKey-3",
                "data": upsertencoded,
                "kinesisSchemaVersion": "1.0",
                "sequenceNumber": "49545115243490985018280067714973144582180062593244200961"
            },
            "invokeIdentityArn": "id",
            "eventName": "aws:kinesis:record",
            "eventSourceARN": "event",
            "eventSource": "aws:kinesis",
            "awsRegion": "us-east-1"
        },
        {
            "eventID": "shardId-000000000000:1",
            "eventVersion": "1.0",
            "kinesis": {
                "partitionKey": "partitionKey-3",
                "data": upsertencoded2,
                "kinesisSchemaVersion": "1.0",
                "sequenceNumber": "49545115243490985018280067714973144582180062593244200961"
            },
            "invokeIdentityArn": "id",
            "eventName": "aws:kinesis:record",
            "eventSourceARN": "event",
            "eventSource": "aws:kinesis",
            "awsRegion": "us-east-1"
        },
        {
            "eventID": "shardId-000000000000:2",
            "eventVersion": "1.0",
            "kinesis": {
                "partitionKey": "partitionKey-3",
                "data": deleteencoded,
                "kinesisSchemaVersion": "1.0",
                "sequenceNumber": "49545115243490985018280067714973144582180062593244200961"
            },
            "invokeIdentityArn": "id",
            "eventName": "aws:kinesis:record",
            "eventSourceARN": "event",
            "eventSource": "aws:kinesis",
            "awsRegion": "us-east-1"
        }
    ]
}

const commands = [
    cacheOps(constants.LOCAL_ITEM_UPSERTED, JSON.parse(upsertpayload)),
    cacheOps(constants.LOCAL_ITEM_UPSERTED, JSON.parse(upsertpayload2)),
    cacheOps(constants.LOCAL_ITEM_DELETED, JSON.parse(upsertpayload))
]

module.exports = {
    event: event,
    commands: commands
};