import { handler } from '../handler';
import * as createResponse from '../../../../common/application/utils/createResponse';
import { APIGatewayEvent } from 'aws-lambda';
import { config } from '../../domain/config.mock';

const lambdaTestUtils = require('aws-lambda-test-utils');

describe('get handler', () => {

  let dummyApigwEvent: APIGatewayEvent;
  let createResponseSpy: jasmine.Spy;

  beforeEach(() => {
    createResponseSpy = spyOn(createResponse, 'default');
    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
      pathParameters: {
        scope: 'dev',
      },
    });
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
});
