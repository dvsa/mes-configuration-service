import { Config } from './config.model';
import { environment } from '../framework/environment';
import { getBaseApiUrl } from '../framework/getBaseApiUrl';
import { Scope } from './scopes.constants';
import { getGAId } from './getGAId';
import { ExaminerRole } from '../constants/ExaminerRole';

const generateAllowedTestCategories = (env: string): string[] => {
  return [Scope.PERF, Scope.PROD, Scope.UAT].includes(env as Scope) ? [] : ['B'];
};

const env = environment();
const baseApiUrl = getBaseApiUrl();

export const config: Config = {
  googleAnalyticsId: getGAId(),
  approvedDeviceIdentifiers: [
    'iPad7,4',
    'x86_64',
  ],
  role: ExaminerRole.DE,
  journal: {
    journalUrl: `${baseApiUrl}/journals/{staffNumber}/personal`,
    autoRefreshInterval: 20000,
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
