#!/bin/sh

LAMBDA_FILENAME="dist/flow-cache-updates-lambda.zip"
mkdir -p dist
if [ -f $LAMBDA_FILENAME ]
then
    rm $LAMBDA_FILENAME
fi
npm install
npm prune --production
zip -r $LAMBDA_FILENAME main.js dynamo_stream.js lib node_modules
