import { TestPermissionPeriod } from '@dvsa/mes-config-schema/remote-config';
import { DynamoDB } from 'aws-sdk';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';

export const getTestPermissionPeriods = async (staffNumber: string): Promise<TestPermissionPeriod[]> => {
  const ddb = new DynamoDB.DocumentClient();

  const getParams = {
    TableName: getUsersTableName(),
    Key: {
      staffNumber,
    },
  };
  const getResponse = await forceTimeOutOnPromise(2000, ddb.get(getParams).promise());

  const responseItem = getResponse.Item;
  if (!responseItem || !responseItem.testPermissionPeriods) {
    return [];
  }
  return responseItem.testPermissionPeriods;
};

const getUsersTableName = (): string => {
  const envvarValue = process.env.USERS_DDB_TABLE_NAME || 'mes-mattb-api-users';
  if (!envvarValue) {
    warn('No envvar found for users DDB table (USERS_DDB_TABLE_NAME), using default');
    return 'users';
  }
  return envvarValue;
};

/**
 * Function to force a timeout on the specified callback regardless of if the cb has resolved or not
 * @param {number} millis
 * @param callback
 * @return {Promise<any>}
 */
const forceTimeOutOnPromise = (milliseconds: number, callback: any): Promise<any> => {
  const timeout = new Promise((resolve, reject) =>
        setTimeout(() =>
                     reject(
                       `Timed out after ${milliseconds} ms.`,
                     ),
                   milliseconds));

  return Promise.race([
    callback,
    timeout,
  ]);
};
