import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';
import {
  environment,
  getDES3LiveCats,
  getDES4LiveCats,
  getDES4PilotCats,
  getDES4UatCats,
  getLiveAppVersion,
} from '../framework/environment';
import { getBaseApiUrl } from '../framework/getBaseApiUrl';
import { Scope } from './scopes.constants';
import { getGAId } from './getGAId';
import { ExaminerRole } from '../constants/ExaminerRole';
import * as compareVersions from 'compare-versions';
import { startsWith } from 'lodash';
import { info } from '@dvsa/mes-microservice-common/application/utils/logger';

const productionLikeEnvs = [Scope.PERF, Scope.PROD, Scope.UAT];

const generateAllowedTestCategories = (env: string): string[] => {
  return productionLikeEnvs.includes(env as Scope) ? [] : ['B'];
};

const generateApprovedDeviceIdentifiers = (env: string): string[] => {
  return productionLikeEnvs.includes(env as Scope) ? ['iPad7,4', 'iPad11,4', 'iPad11,7']
   : ['iPad7,4', 'iPad11,4', 'iPad11,7', 'x86_64', 'iPad7,3', 'iPad11,6'];
};

export const getAllowedTestCategories = (appVersion: string): string[] => {
  const isDES4: boolean = startsWith(appVersion, '4');
  info(`Getting categories for DES ${isDES4 ? '4' : '3'} for app version ${appVersion}`);

  if (isDES4) {
    const des4Cats = mapToCatArray(getDES4LiveCats());

    const isDev: boolean = [Scope.PROD, Scope.PERF, Scope.UAT].every(env => env !== environment());

    if (isDev) {
      return [
        ...mapToCatArray(getDES3LiveCats()),
        ...mapToCatArray(getDES4LiveCats()),
      ].filter((cat, pos, self) => self.indexOf(cat) === pos);
    }

    const isUAT: boolean = [Scope.UAT].some(env => env === environment());

    if (isUAT && getDES4UatCats()) {
      return [...des4Cats, ...mapToCatArray(getDES4UatCats())];
    }

    const isPilot: boolean = compareVersions.compare(appVersion, getLiveAppVersion() as string, '>');

    if (isPilot && getDES4PilotCats()) {
      return [...des4Cats, ...mapToCatArray(getDES4PilotCats())];
    }
    return des4Cats;
  }
  // DES3
  return mapToCatArray(getDES3LiveCats());
};

const mapToCatArray = (catString: string | undefined) =>
  (catString || '').split(',').filter(cat => cat !== '').map(cat => cat);

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
    teamJournalUrl: `${baseApiUrl}/journals/testcentre`,
    autoRefreshInterval: generateautoRefreshInterval(env),
    numberOfDaysToView: 14,
    allowTests: true,
    allowedTestCategories: generateAllowedTestCategories(env),
    testPermissionPeriods: [],
    enableTestReportPracticeMode: true,
    enableEndToEndPracticeMode: true,
    enableLogoutButton: true,
    daysToCacheJournalData: 14,
  },
  tests: {
    testSubmissionUrl: `${baseApiUrl}/test-results`,
    autoSendInterval: 120000,
  },
  user: {
    findUserUrl: `${baseApiUrl}/users/{staffNumber}`,
  },
  requestTimeout: 40000,
};
