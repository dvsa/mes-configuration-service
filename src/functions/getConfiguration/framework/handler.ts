import {APIGatewayProxyEvent} from 'aws-lambda';
import {
  bootstrapLogging,
  customMetric,
  debug,
  error,
  info,
} from '@dvsa/mes-microservice-common/application/utils/logger';
import {Scope} from '../domain/scopes.constants';
import {RemoteConfig} from '@dvsa/mes-config-schema/remote-config';
import {buildConfig} from '../domain/config-builder';
import {getMinimumAppVersion} from '../domain/environment';
import * as errorMessages from '../constants/errors.constants';
import {formatAppVersion, isAllowedAppVersion} from '../application/validateAppVersion';
import {cloneDeep} from 'lodash';
import {Metric} from '../../../common/application/metric/metric';
import {
  getRoleFromRequestContext,
  getStaffNumberFromRequestContext,
} from '@dvsa/mes-microservice-common/framework/security/authorisation';
import {ExaminerRole} from '@dvsa/mes-microservice-common/domain/examiner-role';
import {createResponse} from '@dvsa/mes-microservice-common/application/api/create-response';
import {HttpStatus} from '@dvsa/mes-microservice-common/application/api/http-status';
import {getPathParam} from '@dvsa/mes-microservice-common/framework/validation/event-validation';
import {buildRequestContext} from '../application/build_request-context';

export async function handler(event: APIGatewayProxyEvent) {
  bootstrapLogging('get-configuration', event);

  const minimumAppVersion = getMinimumAppVersion();
  debug('Minimum app version', minimumAppVersion);

  if (minimumAppVersion === undefined || minimumAppVersion.trim().length === 0) {
    error(errorMessages.MISSING_APP_VERSION_ENV_VARIBLE);
    return createResponse(errorMessages.MISSING_APP_VERSION_ENV_VARIBLE, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  const scope = getPathParam(event.pathParameters, 'scope') as Scope;
  if (!scope) {
    error(errorMessages.NO_SCOPE);
    return createResponse(errorMessages.NO_SCOPE, HttpStatus.BAD_REQUEST);
  }

  info('Returning configuration for', scope);

  if (!event.queryStringParameters || !event.queryStringParameters?.app_version) {
    error(errorMessages.NO_APP_VERSION);
    return createResponse(errorMessages.NO_APP_VERSION, HttpStatus.BAD_REQUEST);
  }

  const formattedAppVersion: string = formatAppVersion(event.queryStringParameters.app_version);
  debug('Formatted app version', formattedAppVersion);

  if (!isAllowedAppVersion(formattedAppVersion, minimumAppVersion)) {
    error(errorMessages.APP_VERSION_BELOW_MINIMUM);
    return createResponse(errorMessages.APP_VERSION_BELOW_MINIMUM, HttpStatus.UNAUTHORIZED);
  }

  const staffNumber = getStaffNumberFromRequestContext(buildRequestContext(event.requestContext));
  if (!staffNumber) {
    error(errorMessages.NO_STAFF_NUMBER);
    return createResponse(errorMessages.NO_STAFF_NUMBER, HttpStatus.UNAUTHORIZED);
  }

  const examinerRole = getRoleFromRequestContext(event.requestContext) || ExaminerRole.DE;

  debug('Examiner role', examinerRole);

  const config: RemoteConfig = await buildConfig(staffNumber as string, examinerRole);

  const configClone = cloneDeep(config);

  customMetric(Metric.ConfigurationReturned, 'Number of times the configuration has been returned to a user');

  return createResponse(configClone);
}
