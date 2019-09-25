import * as compareVersions from 'compare-versions';

export const isAllowedAppVersion = (requestAppVersion: string , minimumAppVersion: string): boolean => {
  if (!isVersionCorrectFormat(requestAppVersion) || !isVersionCorrectFormat(minimumAppVersion)) {
    return false;
  }

  return compareVersions.compare(requestAppVersion, minimumAppVersion, '>=');
};

const isVersionCorrectFormat = (appVersion: string): boolean =>
    new RegExp('^[0-9]+\.[0-9]+$').test(appVersion);
