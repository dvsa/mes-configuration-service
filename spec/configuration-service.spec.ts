import * as supertest from 'supertest';
import { startSlsOffline, stopSlsOffline } from './helpers/integration-test-lifecycle';
import { Config } from '../src/functions/getConfiguration/domain/config.model';

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
  afterAll(() => {
    stopSlsOffline();
  });

  it('should respond 200 for an item that exists', (done) => {
    request
      .get('/configuration/dev')
      .expect(200)
      .end((err, res) => {
        if (err) throw err;
        const response: Config = res.body;
        expect(response.googleAnalyticsId).toBe('UA-129489007-3');
        expect(response.journal.journalUrl).toBe(
          'https://local.mes.dev-dvsacloud.uk/v1/journals/{staffNumber}/personal',
        );
        done();
      });
  });
});
