import dynamoDBClient from "../models";
import UserService from "./UserService"

const userService = new UserService(dynamoDBClient());

export  {userService};