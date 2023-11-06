import {HttpStatus} from '@dvsa/mes-microservice-common/application/api/http-status';
import {RemoteConfig} from '@dvsa/mes-config-schema/remote-config';

describe('Integration test: getConfiguration', () => {
  const baseUrl = 'http://localhost:3000/dev/configuration/dev';

  beforeAll(() => {
    process.env.IS_OFFLINE = 'true';
    process.env.USERS_DDB_TABLE_NAME='users';
  });

  it('should respond 400 when no app_version specified', async () => {
    try {
      const response = await fetch(`${baseUrl}`);
      expect(response.status).toEqual(HttpStatus.BAD_REQUEST);
    } catch (err) {
      throw err;
    }
  });

  it('should respond 200 with populated test permissions', async () => {
    try {
      // ACT
      const response = await fetch(`${baseUrl}?app_version=5.1.0.0`);
      const { googleAnalyticsId, journal } = await response.json() as RemoteConfig;
      // ASSERT
      expect(response.status).toEqual(HttpStatus.OK);
      expect(googleAnalyticsId).toEqual('UA-129489007-3');
      expect(journal.journalUrl).toEqual('https://dev.mes.dev-dvsacloud.uk/v1/journals/{staffNumber}/personal');
      expect(journal.testPermissionPeriods.length).toEqual(3);
    } catch (err) {
      throw err;
    }
  });
});
