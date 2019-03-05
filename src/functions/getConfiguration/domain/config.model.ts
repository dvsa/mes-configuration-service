export interface Config {
  googleAnalyticsId: string;
  journal: {
    journalUrl: string,
    autoRefreshInterval: number,
    numberOfDaysToView: number,
  };
  logging: {
    url: string;
    autoSendInterval: number,
  };
}
