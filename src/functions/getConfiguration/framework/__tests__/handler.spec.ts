import { handler } from '../handler';
import * as createResponse from '../../../../common/application/utils/createResponse';
import { APIGatewayEvent, APIGatewayProxyEvent } from 'aws-lambda';
import { config } from '../../domain/config.mock';

const lambdaTestUtils = require('aws-lambda-test-utils');

describe('get handler', () => {

  let dummyApigwEvent: APIGatewayEvent;
  let createResponseSpy: jasmine.Spy;

  beforeEach(() => {
    createResponseSpy = spyOn(createResponse, 'default');
    // createAPIGatewayEvent won't include the authorizer requestContext key
    dummyApigwEvent = {
      ...lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
        pathParameters: {
          scope: 'dev',
        },
      }),
      requestContext: {
        authorizer: {
          staffNumber: '123',
        },
      },
    };
  });

  describe('given the handler returns config', () => {
    it('should return a successful response with the config', async () => {
      createResponseSpy.and.returnValue({ statusCode: 200 });

      const resp: any = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(200);
      expect(createResponse.default)
        .toHaveBeenCalledWith(config);
    });
  });

  describe('requestContext handling', () => {
    it('should return 500 when the requestContext does not have any requestContext', async () => {
      createResponseSpy.and.returnValue({ statusCode: 500 });
      const { requestContext, ...eventWithoutRequestContext } = dummyApigwEvent;

      const resp = await handler(eventWithoutRequestContext as APIGatewayProxyEvent);

      expect(resp.statusCode).toBe(500);
      expect(createResponse.default).toHaveBeenCalledWith('No staffNumber found in request context', 500);
    });
  });
});
