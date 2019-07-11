import { Config } from './config.model';
import { config } from './config.mock';
import { getTestPermissionPeriods } from '../framework/test-permission-repository';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';

export const buildConfig = async (): Promise<Config> => {
  let builtConfig: Config = config;

  builtConfig = await addTestPermissionPeriods(builtConfig);

  return builtConfig;
};

const addTestPermissionPeriods = async (builtConfig: Config): Promise<Config> => {
  try {
    const testPermissionPeriods = await getTestPermissionPeriods();
    return {
      ...builtConfig,
      journal: {
        ...builtConfig.journal,
        testPermissionPeriods,
      },
    };
  } catch (err) {
    warn('Failed to obtain test permission periods', err);
  }
  return builtConfig;
};
