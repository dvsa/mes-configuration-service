import { RemoteConfig, TestPermissionPeriod } from '@dvsa/mes-config-schema/remote-config';
import { ExaminerRole } from '@dvsa/mes-microservice-common/domain/examiner-role';
import { warn } from '@dvsa/mes-microservice-common/application/utils/logger';
import { config } from './config';
import { getTestPermissionPeriods } from '../framework/aws/test-permission-repository';

export const buildConfig = async (
  staffNumber: string,
  examinerRole: ExaminerRole,
): Promise<RemoteConfig> => {
  let builtConfig: RemoteConfig = config;

  builtConfig = await addTestPermissionPeriods(builtConfig, staffNumber);
  builtConfig.role = examinerRole;

  return builtConfig;
};

const addTestPermissionPeriods = async (
  builtConfig: RemoteConfig,
  staffNumber: string,
): Promise<RemoteConfig> => {
  try {
    const testPermissionPeriods: TestPermissionPeriod[] = await getTestPermissionPeriods(staffNumber);

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
