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
  };
  logs: {
    url: string;
    autoSendInterval: number,
  };
}
