import { TestPermissionPeriod } from '@dvsa/mes-config-schema/remote-config';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient, DynamoDBClientConfig} from '@aws-sdk/client-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';

const getUsersTableName = (): string => {
  const envvarValue = process.env.USERS_DDB_TABLE_NAME;
  if (!envvarValue) {
    warn('No envvar found for users DDB table (USERS_DDB_TABLE_NAME), using default');
    return 'users';
  }
  return envvarValue;
};

const createDynamoClient = (): DynamoDBDocument => {
  const opts = { region: 'eu-west-1' } as DynamoDBClientConfig;

  if (process.env.USE_CREDENTIALS === 'true') {
    warn('Using AWS credentials');
    opts.credentials = fromIni();
  } else if (process.env.IS_OFFLINE === 'true') {
    warn('Using SLS offline');
    opts.endpoint = process.env.DDB_OFFLINE_ENDPOINT;
  }

  return DynamoDBDocument.from(new DynamoDBClient(opts));
};

const ddb = createDynamoClient();
const tableName = getUsersTableName();

export const getTestPermissionPeriods = async (staffNumber: string): Promise<TestPermissionPeriod[]> => {
  const response = await ddb.get({
    TableName: tableName,
    Key: { staffNumber },
  });

  if (!response.Item || !response?.Item.testPermissionPeriods) {
    return [];
  }

  return response.Item.testPermissionPeriods as TestPermissionPeriod[];
};
