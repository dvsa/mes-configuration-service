import { Config } from './config.model';
import { config } from './config.mock';
import { getTestPermissionPeriods } from '../framework/test-permission-repository';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';

export const buildConfig = async (staffNumber: string): Promise<Config> => {
  let builtConfig: Config = config;

  builtConfig = await addTestPermissionPeriods(builtConfig, staffNumber);

  return builtConfig;
};

const addTestPermissionPeriods = async (builtConfig: Config, staffNumber: string): Promise<Config> => {
  try {
    const testPermissionPeriods = await getTestPermissionPeriods(staffNumber);
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
