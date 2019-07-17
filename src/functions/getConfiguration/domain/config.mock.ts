import { Config } from './config.model';
import { environment } from '../framework/environment';
import { getBaseApiUrl } from '../framework/getBaseApiUrl';
import { Scope } from './scopes.constants';
import { getGAId } from './getGAId';
import { ExaminerRole } from '../constants/ExaminerRole';

const generateAllowedTestCategories = (env: string): string[] => {
  return [Scope.PERF, Scope.PROD, Scope.UAT].includes(env as Scope) ? [] : ['B'];
};

const generateApprovedDeviceIdentifiers = (env: string): string[] => {
  return [Scope.PERF, Scope.PROD, Scope.UAT].includes(env as Scope) ? ['iPad7,4'] : ['iPad7,4', 'x86_64'];
};

const generateautoRefreshInterval = (env: string): number => {
  return [Scope.PERF, Scope.PROD, Scope.UAT].includes(env as Scope) ? (300 * 1000) : (20 * 1000);
};

const env = environment();
const baseApiUrl = getBaseApiUrl();

export const config: Config = {
  googleAnalyticsId: getGAId(),
  role: ExaminerRole.DE,
  approvedDeviceIdentifiers: generateApprovedDeviceIdentifiers(env),
  journal: {
    journalUrl: `${baseApiUrl}/journals/{staffNumber}/personal`,
    autoRefreshInterval: generateautoRefreshInterval(env),
    numberOfDaysToView: 14,
    allowTests: true,
    allowedTestCategories: generateAllowedTestCategories(env),
    testPermissionPeriods: [],
    enableTestReportPracticeMode: true,
    enableEndToEndPracticeMode: true,
    enableLogoutButton: ![Scope.PERF, Scope.PROD, Scope.UAT].includes(env as Scope),
  },
  tests: {
    testSubmissionUrl: `${baseApiUrl}/test-results`,
    autoSendInterval: 900000,
  },
  logs: {
    url: `${baseApiUrl}/logs`,
    autoSendInterval: 60000,
  },
};
