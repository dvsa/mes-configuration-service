export const isAllowedAppVersion = (requestAppVersion: string , minimumAppVersion: string): boolean => {
  if (!isVersionCorrectFormat(requestAppVersion) || !isVersionCorrectFormat(minimumAppVersion)) {
    return false;
  }

  return (
    isHigerMajorVersion(getMajorVersionNumber(requestAppVersion), getMajorVersionNumber(minimumAppVersion)) ||
    (
        isSameMajorVersion(getMajorVersionNumber(requestAppVersion), getMajorVersionNumber(minimumAppVersion)) &&
        isHigherOrEqualMinorVersion(getMinorVersionNumber(requestAppVersion), getMinorVersionNumber(minimumAppVersion))
    )
  );
};

const isVersionCorrectFormat = (appVersion: string): boolean =>
    new RegExp('^[0-9]+\.[0-9]+$').test(appVersion);

const getMajorVersionNumber = (versionNumber: string): number =>
    Number.parseInt(versionNumber.split('.')[0], 10);

const getMinorVersionNumber = (versionNumber: string): number =>
    Number.parseInt(versionNumber.split('.')[1], 10);

const isHigerMajorVersion = (appMajorVersion: number , minimumMajorVersion: number): boolean =>
    appMajorVersion > minimumMajorVersion;

const isSameMajorVersion = (appMajorVersion: number , minimumMajorVersion: number): boolean =>
    appMajorVersion === minimumMajorVersion;

const isHigherOrEqualMinorVersion = (appMinorVersion: number , minimumMinorVersion: number): boolean =>
    appMinorVersion >= minimumMinorVersion;
