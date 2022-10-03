import * as supertest from 'supertest';
import { startSlsOffline } from './helpers/integration-test-lifecycle';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

const request = supertest('http://localhost:3000');

describe('integration test', () => {
  beforeAll((done) => {
    startSlsOffline((err: any) => {
      if (err) {
        console.error(err);
        fail();
      }
      done();
    });
  });

  it('should respond 200 for an item that exists', (done) => {
    request
      .get('/configuration/dev')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        const response: RemoteConfig = res.body;
        expect(response.googleAnalyticsId).toBe('UA-129489007-3');
        expect(response.journal.journalUrl).toBe(
          'https://dev.mes.dev-dvsacloud.uk/v1/journals/{staffNumber}/personal',
        );
        done();
      });
  });
});
