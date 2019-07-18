import { Config } from './config.model';
import { config } from './config';
import { getTestPermissionPeriods } from '../framework/test-permission-repository';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import { ExaminerRole } from '../constants/ExaminerRole';

export const buildConfig = async (staffNumber: string, examinerRole: ExaminerRole): Promise<Config> => {
  let builtConfig: Config = config;

  builtConfig = await addTestPermissionPeriods(builtConfig, staffNumber);
  builtConfig.role = examinerRole;

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
