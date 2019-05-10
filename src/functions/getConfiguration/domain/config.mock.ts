import { Config } from './config.model';
import { environment } from '../framework/environment';
import { getBaseApiUrl } from '../framework/getBaseApiUrl';
import { Scope } from './scopes.constants';
import { getGAId } from './getGAId';

const generateAllowedTestCategories = (env: string): string[] => {
  return env === Scope.DEV ? ['B'] : [];
};

const env = environment();
const baseApiUrl = getBaseApiUrl();

export const config : Config = {
  googleAnalyticsId: getGAId(),
  approvedDeviceIdentifiers: [
    'iPad7,4',
    'x86_64',
  ],
  journal: {
    journalUrl: `${baseApiUrl}/journals/{staffNumber}/personal`,
    autoRefreshInterval: 20000,
    numberOfDaysToView: 7,
    allowTests: true,
    allowedTestCategories: generateAllowedTestCategories(env),
  },
  logs: {
    url: `${baseApiUrl}/logs`,
    autoSendInterval: 60000,
  },
};
