import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResultV2,
  Context,
} from 'aws-lambda';

export default function handler<T>(
  lambda: (
    event: APIGatewayProxyEvent,
    context: Context
  ) => Promise<APIGatewayProxyResultV2<T>>
): APIGatewayProxyHandler {
  return async function (event, context) {
    let body, statusCode;

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e) {
      console.error(e);
      body = { error: (e as { message: string }).message };
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  };
}
