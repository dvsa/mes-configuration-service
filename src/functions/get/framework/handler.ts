import { APIGatewayProxyEvent } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { config } from '../domain/config.mock';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {

  if (!event.pathParameters) {
    return createResponse('No Scope Provided', 400);
  }

  const scope: Scope = event.pathParameters.scope as Scope;

  return createResponse(config);

}
