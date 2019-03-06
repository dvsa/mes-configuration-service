export interface Config {
  googleAnalyticsId: string;
  approvedDeviceIdentifiers: string[];
  journal: {
    journalUrl: string,
    autoRefreshInterval: number,
    numberOfDaysToView: number,
  };
  logs: {
    url: string;
    autoSendInterval: number,
  };
}
