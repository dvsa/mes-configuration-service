import { APIGatewayProxyEvent, APIGatewayEventRequestContext } from 'aws-lambda';
import { bootstrapLogging, customMetric, error, info } from '@dvsa/mes-microservice-common/application/utils/logger';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { Scope } from '../domain/scopes.constants';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import { buildConfig } from '../domain/config-builder';
import { ExaminerRole } from '../constants/ExaminerRole';
import { getMinimumAppVersion } from './environment';
import * as errorMessages from './errors.constants';
import { isAllowedAppVersion } from './validateAppVersion';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  bootstrapLogging('configuration-service', event);

  const minimumAppVersion = getMinimumAppVersion();
  if (minimumAppVersion === undefined || minimumAppVersion.trim().length === 0) {
    error(errorMessages.MISSING_APP_VERSION_ENV_VARIBLE);
    return createResponse(errorMessages.MISSING_APP_VERSION_ENV_VARIBLE, 500);
  }

  if (!event.pathParameters || !event.pathParameters.scope) {
    error(errorMessages.NO_SCOPE);
    return createResponse(errorMessages.NO_SCOPE, 400);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.app_version) {
    error(errorMessages.NO_APP_VERSION);
    return createResponse(errorMessages.NO_APP_VERSION, 400);
  }

  if (!isAllowedAppVersion(event.queryStringParameters.app_version, minimumAppVersion)) {
    error(errorMessages.APP_VERSION_BELOW_MINIMUM);
    return createResponse(errorMessages.APP_VERSION_BELOW_MINIMUM, 401);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.app_version) {
    error('No app version provided');
    return createResponse('No app version provided', 400);
  }

  const staffNumber = getStaffNumberFromRequestContext(event.requestContext);
  if (!staffNumber) {
    error(errorMessages.NO_STAFF_NUMBER);
    return createResponse(errorMessages.NO_STAFF_NUMBER, 401);
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
