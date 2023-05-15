import { TestPermissionPeriod } from '@dvsa/mes-config-schema/remote-config';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';

export const getTestPermissionPeriods = async (staffNumber: string): Promise<TestPermissionPeriod[]> => {
  const ddb = DynamoDBDocument.from(new DynamoDB({ region: 'eu-west-1' }));

  const getParams = {
    TableName: getUsersTableName(),
    Key: {
      staffNumber,
    },
  };

  const response = await ddb.get(getParams);
  const responseItem = response.Item;

  if (!responseItem || !responseItem.testPermissionPeriods) {
    return [];
  }
  return responseItem.testPermissionPeriods;
};

const getUsersTableName = (): string => {
  const envvarValue = process.env.USERS_DDB_TABLE_NAME;
  if (!envvarValue) {
    warn('No envvar found for users DDB table (USERS_DDB_TABLE_NAME), using default');
    return 'users';
  }
  return envvarValue;
};
