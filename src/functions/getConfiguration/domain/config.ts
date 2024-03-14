import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import { environment } from './environment';
import { getBaseApiUrl, getSearchMCBaseApiUrl } from './getBaseApiUrl';
import { Scope } from './scopes.constants';
import { getGAId, getGAKey } from './getGAId';
import { ExaminerRole } from '@dvsa/mes-microservice-common/domain/examiner-role';

const productionLikeEnvs = [Scope.PERF, Scope.PROD, Scope.UAT];

const generateAllowedTestCategories = (env: string): string[] => {
  return productionLikeEnvs.includes(env as Scope) ? [] : ['B'];
};

const generateApprovedDeviceIdentifiers = (env: string): string[] => {
  return productionLikeEnvs.includes(env as Scope) ? ['iPad7,4', 'iPad11,4', 'iPad11,7', 'iPad12,2']
    : ['x86_64', 'iPad7,3', 'iPad7,4', 'iPad11,3', 'iPad11,4', 'iPad11,6', 'iPad11,7', 'iPad12,2'];
};

const generateAutoRefreshInterval = (env: string): number => {
  return productionLikeEnvs.includes(env as Scope) ? (300 * 1000) : (20 * 1000);
};

const env = environment();
const baseApiUrl = getBaseApiUrl();
const searchMcBaseApiUrl = getSearchMCBaseApiUrl();

export const config: RemoteConfig = {
  liveAppVersion: process.env.LIVE_APP_VERSION,
  googleAnalyticsId: getGAId(),
  googleAnalyticsKey: getGAKey(),
  role: ExaminerRole.DE,
  approvedDeviceIdentifiers: generateApprovedDeviceIdentifiers(env),
  employeeNameKey: 'name',
  journal: {
    journalUrl: `${baseApiUrl}/journals/{staffNumber}/personal`,
    searchBookingUrl: `${baseApiUrl}/journals/{staffNumber}/search`,
    delegatedExaminerSearchBookingUrl: `${baseApiUrl}/delegated-bookings/{applicationReference}`,
    teamJournalUrl: `${baseApiUrl}/journals/testcentre`,
    autoRefreshInterval: generateAutoRefreshInterval(env),
    numberOfDaysToView: 14,
    allowTests: true,
    allowedTestCategories: generateAllowedTestCategories(env),
    testPermissionPeriods: [],
    enableTestReportPracticeMode: true,
    enableEndToEndPracticeMode: true,
    enablePracticeModeAnalytics: process.env.ENABLE_PRACTICE_MODE_ANALYTICS === 'true',
    enableLogoutButton: true,
    daysToCacheJournalData: Number(process.env.DAYS_TO_CACHE_JOURNAL_DATA) || 14,
  },
  tests: {
    testSubmissionUrl: `${baseApiUrl}/test-results`,
    examinerRecordsUrl: `${baseApiUrl}/test-results/search-examiner-records`,
    autoSendInterval: 120000,
  },
  user: {
    findUserUrl: `${baseApiUrl}/users/{staffNumber}`,
  },
  driver: {
    photographUrl: `${baseApiUrl}/driver/photograph/{drivingLicenceNumber}`,
    signatureUrl: `${baseApiUrl}/driver/signature/{drivingLicenceNumber}`,
    standardUrl: `${baseApiUrl}/driver/standard`,
  },
  vehicle: {
    taxMotUrl: `${searchMcBaseApiUrl}`,
  },
  refData: {
    testCentreUrl: `${baseApiUrl}/refdata/testcentres`,
  },
  requestTimeout: 40000,
};
