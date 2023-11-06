import * as repository from '../test-permission-repository';
import {mockClient} from 'aws-sdk-client-mock';
import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {GetCommand, GetCommandOutput} from '@aws-sdk/lib-dynamodb';
import {TestPermissionPeriod} from '@dvsa/mes-config-schema/remote-config';

describe('Dynamo repository', () => {
  const mockDynamo = mockClient(DynamoDBClient);
  const testPermissionPeriods = [
    {testCategory: 'B', from: '2023-01-01', to: '2024-01-01'},
    {testCategory: 'C', from: '2023-02-01', to: '2024-02-01'},
  ] as TestPermissionPeriod[];

  beforeEach(() => {
    process.env.IS_OFFLINE = 'false';
    process.env.USE_CREDENTIALS = 'false';
  });

  describe('getUserRecord', () => {
    ['true', 'false'].forEach((value) => {
      it(`should return item from DynamoDB when found & IS_OFFLINE is ${value}`, async () => {
        process.env.IS_OFFLINE = value;
        mockDynamo.on(GetCommand).resolves({$metadata: {}, Item: { testPermissionPeriods }} as GetCommandOutput);
        const record = await repository.getTestPermissionPeriods('1234567');
        expect(record).toEqual(testPermissionPeriods);
      });
    });

    ['true', 'false'].forEach((value) => {
      it(`should return item from DynamoDB when found & USE_CREDENTIALS is ${value}`, async () => {
        process.env.USE_CREDENTIALS = value;
        mockDynamo.on(GetCommand).resolves({$metadata: {}, Item: { testPermissionPeriods }} as GetCommandOutput);
        const record = await repository.getTestPermissionPeriods('1234567');
        expect(record).toEqual(testPermissionPeriods);
      });
    });

    it('should return null when not found in DynamoDB', async () => {
      mockDynamo.on(GetCommand).resolves({$metadata: {}, Item: undefined} as GetCommandOutput);
      const record = await repository.getTestPermissionPeriods('1234567');
      expect(record).toEqual([]);
    });
  });
});
