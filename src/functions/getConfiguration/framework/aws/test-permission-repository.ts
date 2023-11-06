import { TestPermissionPeriod } from '@dvsa/mes-config-schema/remote-config';
import { DynamoDBClient, DynamoDBClientConfig} from '@aws-sdk/client-dynamodb';
import { fromEnv, fromIni } from '@aws-sdk/credential-providers';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';

const getUsersTableName = (): string => {
  const envvarValue = process.env.USERS_DDB_TABLE_NAME;
  if (!envvarValue) {
    warn('No envvar found for users DDB table (USERS_DDB_TABLE_NAME), using default');
    return 'users';
  }
  return envvarValue;
};

const createDynamoClient = () => {
  const opts = { region: 'eu-west-1' } as DynamoDBClientConfig;

  if (process.env.USE_CREDENTIALS === 'true') {
    warn('Using AWS credentials');
    opts.credentials = fromIni();
  } else if (process.env.IS_OFFLINE === 'true') {
    warn('Using SLS offline');
    opts.credentials = fromEnv();
    opts.endpoint = process.env.DDB_OFFLINE_ENDPOINT;
  }

  return new DynamoDBClient(opts);
};

export const getTestPermissionPeriods = async (staffNumber: string): Promise<TestPermissionPeriod[]> => {
  const ddb = createDynamoClient();
  const tableName = getUsersTableName();

  const response = await ddb.send(
    new GetCommand({
      TableName: tableName,
      Key: { staffNumber },
    }),
  );

  if (!response.Item || !response?.Item.testPermissionPeriods) {
    return [];
  }

  return response.Item.testPermissionPeriods as TestPermissionPeriod[];
};
