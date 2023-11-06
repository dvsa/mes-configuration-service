import {APIGatewayEventRequestContext} from 'aws-lambda';
import {warn} from '@dvsa/mes-microservice-common/application/utils/logger';

export const buildRequestContext = (
  requestContext: APIGatewayEventRequestContext,
): APIGatewayEventRequestContext => {
  if (requestContext.accountId?.includes('offlineContext')) {
    warn('Using stubbed request context');

    return {
      ...requestContext,
      authorizer: {
        ...requestContext.authorizer,
        staffNumber: process.env.STAFF_NUMBER,
      },
    };
  }
  return requestContext;
};
