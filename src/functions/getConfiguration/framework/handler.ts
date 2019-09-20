import { APIGatewayProxyEvent, APIGatewayEventRequestContext } from 'aws-lambda';
import { bootstrapLogging, customMetric, error, info } from '@dvsa/mes-microservice-common/application/utils/logger';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { Scope } from '../domain/scopes.constants';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import { buildConfig } from '../domain/config-builder';
import { ExaminerRole } from '../constants/ExaminerRole';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  bootstrapLogging('configuration-service', event);

  if (!event.pathParameters || !event.pathParameters.scope) {
    error('No scope provided');
    return createResponse('No Scope Provided', 400);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.app_version) {
    error('No app version provided');
    return createResponse('No app version provided', 400);
  }

  const staffNumber = getStaffNumberFromRequestContext(event.requestContext);
  if (!staffNumber) {
    const msg = 'No staff number found in request context';
    error(msg);
    return createResponse(msg, 401);
  }

  const examinerRole = getExaminerRoleFromRequestContext(event.requestContext);

  const scope: Scope = event.pathParameters.scope as Scope;
  info('Returning configuration for ', scope);
  customMetric('ConfigurationReturned', 'Number of times the configuration has been returned to a user');

  const config: RemoteConfig = await buildConfig(staffNumber, examinerRole);
  return createResponse(config);
}

const getStaffNumberFromRequestContext = (requestContext: APIGatewayEventRequestContext): string | null => {
  if (requestContext.authorizer && typeof requestContext.authorizer.staffNumber === 'string') {
    return requestContext.authorizer.staffNumber;
  }
  return null;
};

const getExaminerRoleFromRequestContext = (requestContext: APIGatewayEventRequestContext): ExaminerRole => {
  if (requestContext.authorizer) {
    return requestContext.authorizer.examinerRole === 'LDTM' ? ExaminerRole.LDTM : ExaminerRole.DE;
  }
  // If role is missing we default to DE
  // We only use this for search settings not for authentication so there is no risk giving the user
  // the lowest role type.
  return ExaminerRole.DE;
};
