import { getAllowedTestCategories } from '../config';
import { Scope } from '../scopes.constants';

describe('Config', () => {
  beforeEach(() => {
    process.env.DES3_LIVE_CATS = undefined;
    process.env.DES4_LIVE_CATS = undefined;
    process.env.DES4_UAT_CATS = undefined;
    process.env.ENVIRONMENT = undefined;
    process.env.LIVE_APP_VERSION = undefined;
    process.env.DES4_PILOT_CATS = undefined;
  });
  describe('getAllowedTestCategories', () => {
    it('should return the DES3 cat list when app version starts with 3', async () => {
      process.env.DES3_LIVE_CATS = 'B,C,D';
      process.env.DES4_LIVE_CATS = 'F';

      const result = getAllowedTestCategories('3.1.0.0');
      expect(result).toEqual(['B', 'C', 'D']);
    });
    it('should return the DES4 cat list when app version starts with 4 and not in dev', async () => {
      process.env.DES3_LIVE_CATS = 'B,C,D';
      process.env.DES4_LIVE_CATS = 'F';
      process.env.ENVIRONMENT = Scope.PROD;
      process.env.LIVE_APP_VERSION = '4.1.0.0';

      const result = getAllowedTestCategories('4.1.0.0');
      expect(result).toEqual(['F']);
    });
    it('should return a concatenated list of results when in dev for version 4', async () => {
      process.env.DES3_LIVE_CATS = 'B,C,D';
      process.env.DES4_LIVE_CATS = 'F';
      process.env.ENVIRONMENT = Scope.DEV;
      process.env.LIVE_APP_VERSION = '4.0.0.0';

      const result = getAllowedTestCategories('4.1.0.0');
      expect(result).toEqual(['B', 'C', 'D', 'F']);
    });
    it('should merge the live and uat lists when in UAT for version 4', async () => {
      process.env.DES3_LIVE_CATS = 'B,C,D';
      process.env.DES4_LIVE_CATS = 'F';
      process.env.DES4_UAT_CATS = 'G';
      process.env.ENVIRONMENT = Scope.UAT;

      const result = getAllowedTestCategories('4.1.0.0');
      expect(result).toEqual(['F', 'G']);
    });
    it('should merge the live and pilot lists when in PROD for version 4', async () => {
      process.env.DES3_LIVE_CATS = 'B,C,D';
      process.env.DES4_LIVE_CATS = 'F';
      process.env.DES4_UAT_CATS = 'G';
      process.env.DES4_PILOT_CATS = 'H';
      process.env.LIVE_APP_VERSION = '4.0.0.0';
      process.env.ENVIRONMENT = Scope.PROD;

      const result = getAllowedTestCategories('4.1.0.0');
      expect(result).toEqual(['F', 'H']);
    });
    it('should return only the live lists when app version is not higher than LIVE_APP_VERSION', async () => {
      process.env.DES3_LIVE_CATS = 'B,C,D';
      process.env.DES4_LIVE_CATS = 'F';
      process.env.DES4_UAT_CATS = 'G';
      process.env.DES4_PILOT_CATS = 'H';
      process.env.LIVE_APP_VERSION = '4.1.0.0';
      process.env.ENVIRONMENT = Scope.PROD as string;

      const result = getAllowedTestCategories('4.1.0.0');
      expect(result).toEqual(['F']);
    });
  });
});
