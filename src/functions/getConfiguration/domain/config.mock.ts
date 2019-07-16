import { Config } from './config.model';
import { environment } from '../framework/environment';
import { getBaseApiUrl } from '../framework/getBaseApiUrl';
import { Scope } from './scopes.constants';
import { getGAId } from './getGAId';

const generateAllowedTestCategories = (env: string): string[] => {
  return env === Scope.DEV ? ['B'] : [];
};

const generateApprovedDeviceIdentifiers = (env: string): string[] => {
  return env === Scope.DEV ? ['iPad7,4', 'x86_64'] : ['iPad7,4'];
};

const generateautoRefreshInterval = (env: string): number => {
  return env === Scope.DEV ? (20 * 1000) : (300 * 1000);
};

const env = environment();
const baseApiUrl = getBaseApiUrl();

export const config : Config = {
  googleAnalyticsId: getGAId(),
  approvedDeviceIdentifiers: generateApprovedDeviceIdentifiers(env),
  journal: {
    journalUrl: `${baseApiUrl}/journals/{staffNumber}/personal`,
    autoRefreshInterval: generateautoRefreshInterval(env),
    numberOfDaysToView: 7,
    allowTests: true,
    allowedTestCategories: generateAllowedTestCategories(env),
    enableTestReportPracticeMode: true,
    enableEndToEndPracticeMode: true,
    enableLogoutButton: ![Scope.PERF, Scope.PROD, Scope.UAT].includes(env as Scope),
  },
  tests: {
    testSubmissionUrl: `${baseApiUrl}/test-result`,
    autoSendInterval: 900000,
  },
  logs: {
    url: `${baseApiUrl}/logs`,
    autoSendInterval: 60000,
  },
};
