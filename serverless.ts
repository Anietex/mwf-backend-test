import type {AWS} from '@serverless/typescript';

import {getUser, createUser} from '@functions/user';


const serverlessConfiguration: AWS = {
    service: 'user-signup-api1',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
        iam: {
            role: {
                statements: [{
                    Effect: "Allow",
                    Action: [
                        "dynamodb:DescribeTable",
                        "dynamodb:Query",
                        "dynamodb:Scan",
                        "dynamodb:GetItem",
                        "dynamodb:PutItem",
                        "dynamodb:UpdateItem",
                        "dynamodb:DeleteItem",
                    ],
                    Resource: "arn:aws:dynamodb:us-east-1:735941735750:table/UsersTable",
                }],
            },
        }
    },
    // import the function via paths
    functions: {getUser, createUser},
    package: {individually: true},
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
        dynamodb: {
            start: {
                port: 8100,
                inMemory: true,
                migrate: true,
            },
            stages: "dev"
        }
    },
    resources: {
        Resources: {
            UsersTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: "UsersTable",
                    AttributeDefinitions: [
                        {
                            AttributeName: "id",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "email",
                            AttributeType: "S",
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: "id",
                            KeyType: "HASH"
                        },
                        {
                            AttributeName: "email",
                            KeyType: "RANGE"
                        }
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1
                    },

                }
            }
        }
    }
};

module.exports = serverlessConfiguration;
