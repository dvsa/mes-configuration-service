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
  return productionLikeEnvs.includes(env as Scope)
    ? ['iPad7,4', 'iPad11,4', 'iPad11,7', 'iPad12,2', 'iPad13,18', 'iPad13,19']
    : ['x86_64', 'iPad7,3', 'iPad7,4', 'iPad11,3', 'iPad11,4', 'iPad11,6',
      'iPad11,7', 'iPad12,2', 'iPad13,18', 'iPad13,19'];
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
    multipleTestResultsUrl: `${baseApiUrl}/test-results/multiple-results`,
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
  mot: {
    motHistoryUrl: `${baseApiUrl}/mot-history/{vrn}`,
  },
  refData: {
    testCentreUrl: `${baseApiUrl}/refdata/testcentres`,
  },
  usefulLinks: [
    {
      // eslint-disable-next-line max-len
      url: 'https://dvsauk.sharepoint.com/:w:/s/Resumingdriverservices/ER7n13IeH09AqaZINxzrfnYBGNC2Sf5hiNeLp5-Gt-CKiw?e=eB6rMx',
      displayText: 'Accessibility statement',
    },
    {
      // eslint-disable-next-line max-len
      url: 'https://www.gov.uk/guidance/guidance-for-driving-examiners-carrying-out-driving-tests-dt1',
      displayText: 'DT1 guidance',
    },
    {
      // eslint-disable-next-line max-len
      url: 'https://dvsauk.sharepoint.com/sites/ChiefDrivingExaminerandTechnicalStandardsHub?e=1%3A1d13247f10634a75bd08a5975620a28d',
      displayText: 'Technical standards hub',
    },
    {
      // eslint-disable-next-line max-len
      url: 'https://www.citroen.co.uk/maintain/safety-recall-check.html',
      displayText: 'Citroen vehicle recall information',
    },
  ],
  requestTimeout: 40000,
};
