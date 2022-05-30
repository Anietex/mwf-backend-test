import { APIGatewayProxyEvent } from "aws-lambda";
const aws = require('aws-sdk');

import { createUser } from "../../handler";
afterEach(() => {
    jest.resetAllMocks();
})

jest.mock('aws-sdk', () => {
    const mDocumentClient = {
        get: jest.fn(),
        scan: jest.fn(),
        put: jest.fn(() => ({promise: jest.fn()}))
    };
    const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
    return { DynamoDB: mDynamoDB };
});

const mDynamoDb = new aws.DynamoDB.DocumentClient();

describe('Create user test', function () {
    const userData = {
        name: 'Aniefon',
        email: 'anietex@gmail.com',
        password: 'password',
    }


    it('Ensures input are validated', async () => {
        const mDynamoDb = new aws.DynamoDB.DocumentClient();
        mDynamoDb.scan.mockImplementationOnce(() => ({ promise: jest.fn(() => ({Count: 1}))}));
        const event: APIGatewayProxyEvent = {
            body: {}
        } as any
        const result = await createUser(event, null)
        expect(result.statusCode).toEqual(422);
    });


    it('Should  not creates a user with duplicate email', async () => {
        mDynamoDb.scan.mockImplementationOnce(() => ({ promise: jest.fn(() => ({Count: 1}))}));
        const event: APIGatewayProxyEvent = {
            body: userData
        } as any
        const result = await createUser(event, null)
        expect(mDynamoDb.scan).toHaveBeenCalled()
        expect(result.statusCode).toEqual(422);
    });


    it('Successfully creates a user', async () => {
         mDynamoDb.scan.mockImplementationOnce(() => ({ promise: jest.fn(() => ({Count: 0}))}));
        mDynamoDb.put.mockImplementationOnce(() => ({ promise: jest.fn(() => userData)}));

        const event: APIGatewayProxyEvent = {
            body: userData
        } as any
        const result = await createUser(event, null)
        expect(result.statusCode).toEqual(200);
        expect(mDynamoDb.put).toHaveBeenCalled()
        expect(userData).toEqual(expect.objectContaining(JSON.parse(result.body).data.user));
    });
});