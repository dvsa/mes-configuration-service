import { APIGatewayProxyEvent } from 'aws-lambda';
import { bootstrapLogging, customMetric, error, info } from '@dvsa/mes-microservice-common/application/utils/logger';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { Scope } from '../domain/scopes.constants';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import { buildConfig } from '../domain/config-builder';
import { getMinimumAppVersion } from '../domain/environment';
import * as errorMessages from '../constants/errors.constants';
import {
  formatAppVersion,
  isAllowedAppVersion, isEligibleFor,
} from '../application/validateAppVersion';
import { cloneDeep, omit } from 'lodash';
import { Metric } from '../../../common/application/metric/metric';
import {getStaffNumberFromRequestContext} from '@dvsa/mes-microservice-common/framework/security/authorisation';
import {getExaminerRoleFromRequestContext} from '../application/request-validator';

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

  const formattedAppVersion: string = formatAppVersion(event.queryStringParameters.app_version);

  if (!isAllowedAppVersion(formattedAppVersion, minimumAppVersion)) {
    error(errorMessages.APP_VERSION_BELOW_MINIMUM);
    return createResponse(errorMessages.APP_VERSION_BELOW_MINIMUM, 401);
  }

  const staffNumber = getStaffNumberFromRequestContext(event.requestContext);
  if (!staffNumber) {
    error(errorMessages.NO_STAFF_NUMBER);
    return createResponse(errorMessages.NO_STAFF_NUMBER, 401);
  }

  const examinerRole = getExaminerRoleFromRequestContext(event.requestContext);

  const scope: Scope = event.pathParameters.scope as Scope;
  info('Returning configuration for ', scope);

  const config: RemoteConfig = await buildConfig(staffNumber, examinerRole);
  const configClone = cloneDeep(config);

  customMetric(Metric.ConfigurationReturned, 'Number of times the configuration has been returned to a user');

  // delete when formattedAppVersion <= versionToInclude
  if (isEligibleFor(formattedAppVersion, '<=', '4.8.0.5')) {
    const conf = omit(configClone, 'liveAppVersion');
    return createResponse({
      ...conf,
    });
  }

  return createResponse(configClone);
}
