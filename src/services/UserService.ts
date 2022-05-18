import {DocumentClient} from "aws-sdk/clients/dynamodb";

import User from "../models/User";


export default class UserService {

    private tableName: string = "UsersTable";

    constructor(private dbClient: DocumentClient) {
    }

    async createUser(user: User): Promise<User |null> {
        try {
            await this.dbClient.put({
                TableName: this.tableName,
                Item: user,
            }).promise()
            return user
        } catch (e) {
           throw new Error(e)
        }
    }

    async getUsersCountByEmail(email: string): Promise<any> {
        const params = {
            TableName: this.tableName,
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        }
        const users = await this.dbClient.scan(params).promise()
        return users.Count
    }
}