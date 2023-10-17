import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from 'aws-lambda';
import {
  bootstrapLogging,
  customMetric,
  debug,
  error,
  info,
} from '@dvsa/mes-microservice-common/application/utils/logger';
import { cloneDeep } from 'lodash';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { Scope } from '../domain/scopes.constants';
import { buildConfig } from '../domain/config-builder';
import { ExaminerRole } from '../constants/ExaminerRole';
import { getMinimumAppVersion } from './environment';
import * as errorMessages from './errors.constants';
import {
  formatAppVersion,
  isAllowedAppVersion,
} from './validateAppVersion';
import { Metric } from '../../../common/application/metric/metric';
import {HttpStatus} from '../../../common/application/api/HttpStatus';

export async function handler(event: APIGatewayProxyEvent): Promise<Response> {
  bootstrapLogging('configuration-service', event);

  const minimumAppVersion = getMinimumAppVersion();
  if (minimumAppVersion === undefined || minimumAppVersion.trim().length === 0) {
    error(errorMessages.MISSING_APP_VERSION_ENV_VARIBLE);
    return createResponse(errorMessages.MISSING_APP_VERSION_ENV_VARIBLE, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!event.pathParameters || !event.pathParameters.scope) {
    error(errorMessages.NO_SCOPE);
    return createResponse(errorMessages.NO_SCOPE, HttpStatus.BAD_REQUEST);
  }

  if (!event.queryStringParameters || !event.queryStringParameters.app_version) {
    error(errorMessages.NO_APP_VERSION);
    return createResponse(errorMessages.NO_APP_VERSION, HttpStatus.BAD_REQUEST);
  }

  const formattedAppVersion: string = formatAppVersion(event.queryStringParameters.app_version);

  if (!isAllowedAppVersion(formattedAppVersion, minimumAppVersion)) {
    error(errorMessages.APP_VERSION_BELOW_MINIMUM);
    return createResponse(errorMessages.APP_VERSION_BELOW_MINIMUM, HttpStatus.UNAUTHORIZED);
  }

  const staffNumber = getStaffNumberFromRequestContext(event.requestContext);

  if (!staffNumber) {
    error(errorMessages.NO_STAFF_NUMBER);
    return createResponse(errorMessages.NO_STAFF_NUMBER, HttpStatus.UNAUTHORIZED);
  }

  const examinerRole = getExaminerRoleFromRequestContext(event.requestContext);

  const scope: Scope = event.pathParameters.scope as Scope;

  info('Returning configuration for ', scope);

  const config: RemoteConfig = await buildConfig(staffNumber, examinerRole);

  const configClone = cloneDeep(config);

  customMetric(Metric.ConfigurationReturned, 'Number of times the configuration has been returned to a user');

  debug('Config clone', configClone);

  return createResponse(configClone);
}

const getStaffNumberFromRequestContext = (requestContext: APIGatewayEventRequestContext): string | null => {
  if (requestContext.authorizer && typeof requestContext.authorizer.staffNumber === 'string') {
    return requestContext.authorizer.staffNumber;
  }
  return null;
};

const getExaminerRoleFromRequestContext = (requestContext: APIGatewayEventRequestContext): ExaminerRole => {
  if (requestContext.authorizer) {
    const { examinerRole } = requestContext.authorizer;

    switch (examinerRole) {
    case 'DLG': return ExaminerRole.DLG;
    case 'LDTM': return ExaminerRole.LDTM;
    default: return ExaminerRole.DE;
    }
  }
  // If role is missing we default to DE
  // We only use this for search settings not for authentication so there is no risk giving the user
  // the lowest role type.
  return ExaminerRole.DE;
};
