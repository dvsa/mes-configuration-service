import { isAllowedAppVersion, isAppVersionEligibleForTeamJournal } from '../validateAppVersion';

describe('validateAppVersion', () => {

  describe('isAllowedAppVersion', () => {
    it('should return true if it is an allowed app version - minor version difference', () => {
      const result = isAllowedAppVersion('2.1', '2.0');
      expect(result).toEqual(true);
    });
    it('should return true if it is an allowed app version - major version difference', () => {
      const result = isAllowedAppVersion('2.1', '1.0');
      expect(result).toEqual(true);
    });
    it('should return true if it is an allowed app version - higher minor version then current', () => {
      const result = isAllowedAppVersion('2.1', '1.8');
      expect(result).toEqual(true);
    });
    it('should return false if the current app version is formatted incorrectly test 1', () => {
      const result = isAllowedAppVersion('abcdef', '1.0');
      expect(result).toEqual(false);
    });
    it('should return false if the current app version is formatted incorrectly test 2', () => {
      const result = isAllowedAppVersion('1111.1111.111', '1.0');
      expect(result).toEqual(false);
    });
    it('should return false if the current app version is formatted incorrectly test 3', () => {
      const result = isAllowedAppVersion('10', '1.0');
      expect(result).toEqual(false);
    });
    it('should return false if the minimum app version is formatted incorrectly test 1', () => {
      const result = isAllowedAppVersion('1.0', 'abcdef');
      expect(result).toEqual(false);
    });
    it('should return false if the minimum app version is formatted incorrectly test 2', () => {
      const result = isAllowedAppVersion('1.0', '1111.1111.111');
      expect(result).toEqual(false);
    });
    it('should return false if the minimum app version is formatted incorrectly test 3', () => {
      const result = isAllowedAppVersion('1.0', '10');
      expect(result).toEqual(false);
    });
    it('should return false if it is not an allowed app version - minor version difference', () => {
      const result = isAllowedAppVersion('2.0', '2.1');
      expect(result).toEqual(false);
    });
    it('should return false if it is not an allowed app version - major version difference', () => {
      const result = isAllowedAppVersion('1.0', '2.1');
      expect(result).toEqual(false);
    });
    it('should return false if it is not an allowed app version - higher minor version then current', () => {
      const result = isAllowedAppVersion('1.8', '2.1');
      expect(result).toEqual(false);
    });
  });

  describe('isAppVersionEligibleForTeamJournal', () => {
    it('should return true if 4 or above', () => {
      expect(isAppVersionEligibleForTeamJournal('4.10.1')).toEqual(true);
    });

    it('should return false if below version 4', () => {
      expect(isAppVersionEligibleForTeamJournal('3.10.1')).toEqual(false);
    });
  });
});
