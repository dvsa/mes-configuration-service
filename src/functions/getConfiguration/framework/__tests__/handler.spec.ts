import { handler } from '../handler';
import * as createResponse from '../../../../common/application/utils/createResponse';
import { APIGatewayEvent } from 'aws-lambda';
import { config } from '../../domain/config';
import { Mock, Times, It } from 'typemoq';
import * as configBuilder from '../../domain/config-builder';
import { ExaminerRole } from '../../constants/ExaminerRole';
import * as errorMessages from '../errors.constants';

const lambdaTestUtils = require('aws-lambda-test-utils');

describe('handler', () => {

  let dummyApigwEvent: APIGatewayEvent;
  const moqConfigBuilder = Mock.ofInstance(configBuilder.buildConfig);

  beforeEach(() => {
    process.env.MINIMUM_APP_VERSION = '2.0';

    moqConfigBuilder.reset();

    moqConfigBuilder.setup(x => x(It.isAny(), It.isAny())).returns(() => Promise.resolve(config));

    spyOn(createResponse, 'default').and.callThrough();
    spyOn(configBuilder, 'buildConfig').and.callFake(moqConfigBuilder.object);
    dummyApigwEvent = {
      ...lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
        pathParameters: {
          scope: 'dev',
        },
        queryStringParameters: {
          app_version : '2.0',
        },
      }),
      requestContext: {
        authorizer: {
          staffNumber: '123',
          role: ExaminerRole.DE,
        },
      },
    };
  });

  describe('handler', () => {

    it('should return 200 when the request was successful', async () => {
      const resp: any = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(200);
      expect(createResponse.default)
        .toHaveBeenCalledWith(config);
      moqConfigBuilder.verify(x => x(It.isValue('123'), It.isValue(ExaminerRole.DE)), Times.once());
    });

    it('should return 400 when there are no path parameters', async() => {
      delete dummyApigwEvent.pathParameters;

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(400);
      expect(createResponse.default).toHaveBeenCalledWith(errorMessages.NO_SCOPE, 400);
    });

    it('should return 400 when there is no scope path parameter', async() => {
      dummyApigwEvent.pathParameters ?
      delete dummyApigwEvent.pathParameters.scope :
      fail('dummyApigwEvent.pathParameters is null');

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(400);
      expect(createResponse.default).toHaveBeenCalledWith(errorMessages.NO_SCOPE, 400);
    });

    it('should return 400 when there are no query string values', async() => {
      delete dummyApigwEvent.queryStringParameters;

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(400);
      expect(createResponse.default).toHaveBeenCalledWith(errorMessages.NO_APP_VERSION, 400);
    });

    it('should return 400 response when app_version is missing from the query string', async() => {
      dummyApigwEvent.queryStringParameters ?
    delete dummyApigwEvent.queryStringParameters.app_version :
    fail('dummyApigwEvent.queryStringParameters is null');

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(400);
      expect(createResponse.default).toHaveBeenCalledWith(errorMessages.NO_APP_VERSION, 400);
    });

    it('should return 401 when there is no authoriser object', async () => {
      delete dummyApigwEvent.requestContext.authorizer;

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(401);
      expect(createResponse.default).toHaveBeenCalledWith(errorMessages.NO_STAFF_NUMBER, 401);
    });

    it('should return 401 when there is no staff number in the authoriser', async () => {
      dummyApigwEvent.requestContext.authorizer ?
      delete dummyApigwEvent.requestContext.authorizer.staffNumber :
      fail('authoriser is null');

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(401);
      expect(createResponse.default).toHaveBeenCalledWith(errorMessages.NO_STAFF_NUMBER, 401);
    });

    it('should return 500 when MINIMUM_APP_VERSION is undefined', async () => {
      delete process.env.MINIMUM_APP_VERSION;

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(500);
      expect(createResponse.default).toHaveBeenCalledWith(errorMessages.MISSING_APP_VERSION_ENV_VARIBLE, 500);
    });

    it('should return 500 when MINIMUM_APP_VERSION is an empty string', async () => {
      process.env.MINIMUM_APP_VERSION = '';

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(500);
      expect(createResponse.default).toHaveBeenCalledWith(errorMessages.MISSING_APP_VERSION_ENV_VARIBLE, 500);
    });
  });
});
