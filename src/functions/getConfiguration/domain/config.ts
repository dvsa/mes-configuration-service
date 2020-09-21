import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import { environment } from '../framework/environment';
import { getBaseApiUrl } from '../framework/getBaseApiUrl';
import { Scope } from './scopes.constants';
import { getGAId } from './getGAId';
import { ExaminerRole } from '../constants/ExaminerRole';

const productionLikeEnvs = [Scope.PERF, Scope.PROD, Scope.UAT];

const generateAllowedTestCategories = (env: string): string[] => {
  return productionLikeEnvs.includes(env as Scope) ? [] : ['B'];
};

const generateApprovedDeviceIdentifiers = (env: string): string[] => {
  return productionLikeEnvs.includes(env as Scope) ? ['iPad7,4', 'iPad11,4']
   : ['iPad7,4', 'iPad11,4', 'x86_64', 'iPad7,3'];
};

const generateautoRefreshInterval = (env: string): number => {
  return productionLikeEnvs.includes(env as Scope) ? (300 * 1000) : (20 * 1000);
};

const env = environment();
const baseApiUrl = getBaseApiUrl();

export const config: RemoteConfig = {
  googleAnalyticsId: getGAId(),
  role: ExaminerRole.DE,
  approvedDeviceIdentifiers: generateApprovedDeviceIdentifiers(env),
  employeeNameKey: 'name',
  journal: {
    journalUrl: `${baseApiUrl}/journals/{staffNumber}/personal`,
    searchBookingUrl: `${baseApiUrl}/journals/{staffNumber}/search`,
    delegatedExaminerSearchBookingUrl: `${baseApiUrl}/delegated-bookings/{applicationReference}`,
    autoRefreshInterval: generateautoRefreshInterval(env),
    numberOfDaysToView: 14,
    allowTests: true,
    allowedTestCategories: generateAllowedTestCategories(env),
    testPermissionPeriods: [],
    enableTestReportPracticeMode: true,
    enableEndToEndPracticeMode: true,
    enableLogoutButton: !productionLikeEnvs.includes(env as Scope),
    daysToCacheJournalData: 14,
  },
  tests: {
    testSubmissionUrl: `${baseApiUrl}/test-results`,
    autoSendInterval: 300000,
  },
  user: {
    findUserUrl: `${baseApiUrl}/users/{staffNumber}`,
  },
  requestTimeout: 40000,
};
