import { Config } from './config.model';

export const config : Config = {
  googleAnalyticsId: 'UA-129489007-3',
  journal: {
    journalUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/journals/{staffNumber}/personal',
    autoRefreshInterval: 20000,
    numberOfDaysToView: 7,
  },
};
