import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {formatJSONResponse} from '../../libs/api-gateway';
import {middyfy} from '../../libs/lambda';
import {userService} from '../../services';

import {v4 as Uuid4} from 'uuid';
import PasswordHash from "../../libs/password-hash";

export const getUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userEmail = event.queryStringParameters.email
    const users = await userService.getUsersCountByEmail(userEmail);
    return formatJSONResponse({
        status: "success",
        data: {
            users
        }
    })
})


export const createUser = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = event.body || {};
    let validationFailed = false;

    const validationErrors = {
        name: undefined,
        email: undefined,
        password: undefined,
    };

    if(!body.name){
        validationErrors.name = 'Name is required';
        validationFailed = true
    }

    if(!body.password){
        validationErrors.password = "Password is required";
        validationFailed = true
    }

    if(!body.email){
        validationErrors.email = "Email is required";
        validationFailed = true
    }else if( !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(body.email))){
        validationErrors.email = "A valid email is required";
        validationFailed = true
    }else {
        const emailExist = !!(await userService.getUsersCountByEmail(body.email));
        if(emailExist){
            validationErrors.email = "Email already exists";
            validationFailed = true
        }
    }

    if(validationFailed){
        return formatJSONResponse({
            status: 'error',
            message: 'Validation error occurred',
            errors: validationErrors
        }, 422)
    }


    const id = Uuid4()
    const userData = {
        id,
        name: body.name,
        email: body.email,
        password: PasswordHash.hash(body.password),
        created_at: new Date().toISOString()
    }

    const user = await userService.createUser(userData);
    return formatJSONResponse({
        status: 'success',
        message: 'User created successfully',
        data: {
            user: {
                name: user.name,
                email:user.email
            }
        }

    })
})