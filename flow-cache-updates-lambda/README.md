# Cache Updates Lambda
An AWS lambda function that receives a Kinesis event containing Flow cache updates.   Will set or delete each item in a Redis cache according to the events it receives.

## Building
(requires node 6.10 or greater)

```bash
> sh ./build.sh
```

This will create a zip file in `./dist` which can be deployed to Lambda.

## Configuration

The function expects two environment variables to be set: `REDIS_HOST` and `REDIS_PORT`.  You may have to modify the settings of your Lambda function to run in the same VPC as your Redis/Elasticache instance.  This requires additional permissions that will allow the function to dynamically join the VPC.  AWS provides a role named `AWSLambdaVPCAccessExecutionRole` for this.  A more detailed explanation can be found here: http://docs.aws.amazon.com/lambda/latest/dg/vpc.html.

Your function must also have the correct permissions to access the Kinesis stream.  These include at least: `ListStreams`, `DescribeStream`, `GetShardIterator`, and `GetRecords`.  An example policy might look like:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "StmtXXXXXXXXXXXXX",
            "Effect": "Allow",
            "Action": [
                "kinesis:DescribeStream",
                "kinesis:GetShardIterator",
                "kinesis:GetRecords",
                "kinesis:ListStreams"
            ],
            "Resource": [
                "arn:aws:kinesis:us-east-1:000000000000:stream/name-of-your-stream"
            ]
        }
    ]
}
```

Finally, create a trigger for this Lambda funciton using the Kinesis stream as a source.
