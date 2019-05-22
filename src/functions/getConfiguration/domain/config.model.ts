export interface Config {
  googleAnalyticsId: string;
  approvedDeviceIdentifiers: string[];
  timeTravelDate?: string;
  journal: {
    journalUrl: string,
    autoRefreshInterval: number,
    numberOfDaysToView: number,
    allowTests: boolean,
    allowedTestCategories: string[],
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
}
