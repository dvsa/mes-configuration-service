import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, customMetric, error, info } from '@dvsa/mes-microservice-common/application/utils/logger';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { Scope } from '../domain/scopes.constants';
import { Config } from '../domain/config.model';
import { buildConfig } from '../domain/config-builder';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  bootstrapLogging('configuration-service', event);

  if (!event.pathParameters) {
    error('No scope provided');
    return createResponse('No Scope Provided', 400);
  }

  const scope: Scope = event.pathParameters.scope as Scope;
  info('Returning configuration for ', scope);
  customMetric('ConfigurationReturned', 'Number of times the configuration has been returned to a user');

  const config: Config = await buildConfig();
  return createResponse(config);
}
