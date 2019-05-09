import { Config } from './config.model';
import { environment } from '../framework/environment';

const populateEnvironment = (val: string) => {
  return val.replace('{env}', environment());
};
const generateAllowedTestCategories = (env: string): string[] => {
  return env === 'dev' ? ['B'] : [];
};

export const config : Config = {
  googleAnalyticsId: 'UA-129489007-3',
  approvedDeviceIdentifiers: [
    'iPad7,4',
    'x86_64',
  ],
  journal: {
    journalUrl: populateEnvironment('https://{env}.mes.dev-dvsacloud.uk/v1/journals/{staffNumber}/personal'),
    autoRefreshInterval: 20000,
    numberOfDaysToView: 7,
    allowTests: true,
    allowedTestCategories: generateAllowedTestCategories(environment()),
  },
  logs: {
    url: populateEnvironment('https://{env}.mes.dev-dvsacloud.uk/v1/logs'),
    autoSendInterval: 60000,
  },
};
