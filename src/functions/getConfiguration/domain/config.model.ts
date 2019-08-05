import { ExaminerRole } from '../constants/ExaminerRole';

export interface Config {
  googleAnalyticsId: string;
  approvedDeviceIdentifiers: string[];
  timeTravelDate?: string;
  role: ExaminerRole;
  journal: {
    journalUrl: string,
    rekeySearchUrl: string,
    autoRefreshInterval: number,
    numberOfDaysToView: number,
    allowTests: boolean,
    allowedTestCategories: string[],
    testPermissionPeriods: TestPermissionPeriod[];
    enableTestReportPracticeMode: boolean;
    enableEndToEndPracticeMode: boolean;
    enableLogoutButton: boolean;
  };
  tests: {
    testSubmissionUrl: string,
    autoSendInterval: number,
  };
  logs: {
    url: string;
    autoSendInterval: number,
  };
  requestTimeout: number;
}

export interface TestPermissionPeriod {
  category: string;
  from: string;
  to: string | null;
}
