import { RemoteConfig, TestPermissionPeriod } from '@dvsa/mes-config-schema/remote-config';
import { config, getAllowedTestCategories } from './config';
import { getTestPermissionPeriods } from '../framework/test-permission-repository';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import { ExaminerRole } from '../constants/ExaminerRole';

export const buildConfig = async (
  staffNumber: string,
  examinerRole: ExaminerRole,
  appVersion: string,
): Promise<RemoteConfig> => {
  let builtConfig: RemoteConfig = config;

  builtConfig = await addTestPermissionPeriods(builtConfig, staffNumber, appVersion);
  builtConfig.role = examinerRole;

  return builtConfig;
};

const addTestPermissionPeriods = async (
  builtConfig: RemoteConfig,
  staffNumber: string,
  appVersion: string,
): Promise<RemoteConfig> => {
  try {
    const testPermissionPeriods: TestPermissionPeriod[] = await getTestPermissionPeriods(staffNumber);
    const allowedTestCategories: string[] = getAllowedTestCategories(appVersion);

    return {
      ...builtConfig,
      journal: {
        ...builtConfig.journal,
        allowedTestCategories,
        testPermissionPeriods,
      },
    };
  } catch (err) {
    warn('Failed to obtain test permission periods', err);
  }
  return builtConfig;
};
