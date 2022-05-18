import { handlerPath } from '@libs/handler-resolver';
import schema from "./schema";

export const getUser =  {
  handler: `${handlerPath(__dirname)}/handler.getUser`,
  events: [
    {
      http: {
        method: 'get',
        path: '/user/get',
        cors: true
      },
    },
  ],
};

export const createUser =  {
  handler: `${handlerPath(__dirname)}/handler.createUser`,
  events: [
    {
      http: {
        method: 'post',
        path: '/user/create',
        cors: true,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      }
    },
  ],
};