import { handler } from '../handler';
import * as createResponse from '../../../../common/application/utils/createResponse';
import { APIGatewayEvent } from 'aws-lambda';
import { config } from '../../domain/config';
import { Mock, Times, It } from 'typemoq';
import * as configBuilder from '../../domain/config-builder';
import { ExaminerRole } from '../../constants/ExaminerRole';

const lambdaTestUtils = require('aws-lambda-test-utils');

describe('get handler', () => {

  let dummyApigwEvent: APIGatewayEvent;
  let createResponseSpy: jasmine.Spy;
  const moqConfigBuilder = Mock.ofInstance(configBuilder.buildConfig);

  beforeEach(() => {
    moqConfigBuilder.reset();

    moqConfigBuilder.setup(x => x(It.isAny(), It.isAny())).returns(() => Promise.resolve(config));

    createResponseSpy = spyOn(createResponse, 'default');
    spyOn(configBuilder, 'buildConfig').and.callFake(moqConfigBuilder.object);
    dummyApigwEvent = {
      ...lambdaTestUtils.mockEventCreator.createAPIGatewayEvent({
        pathParameters: {
          scope: 'dev',
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

  describe('given the handler returns config', () => {
    it('should return a successful response with the config', async () => {
      createResponseSpy.and.returnValue({ statusCode: 200 });
      const resp: any = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(200);
      expect(createResponse.default)
        .toHaveBeenCalledWith(config);
      moqConfigBuilder.verify(x => x(It.isValue('123'), It.isValue(ExaminerRole.DE)), Times.once());
    });
  });

  describe('error handling', () => {
    it('should respond 401 when there is no staff number in the request context', async () => {
      createResponseSpy.and.returnValue({ statusCode: 401 });
      delete dummyApigwEvent.requestContext.authorizer;

      const resp = await handler(dummyApigwEvent);

      expect(resp.statusCode).toBe(401);
      expect(createResponse.default).toHaveBeenCalledWith('No staff number found in request context', 401);
    });
  });
});
