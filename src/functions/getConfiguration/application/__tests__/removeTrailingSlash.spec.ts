import { removeTrailingSlash } from '../removeTrailingSlash';

describe('removeTrailingSlash', () => {

  describe('given a string', () => {
    it('should return the same url without the trailing slash if it has one', () => {
      const incomingBaseApiUrl = 'https://dev.mes.dev-dvsacloud.uk/v1/';
      const expected = 'https://dev.mes.dev-dvsacloud.uk/v1';
      const result = removeTrailingSlash(incomingBaseApiUrl);
      expect(result).toEqual(expected);
    });
    it('should return the same url without the trailing slash if it does not have one', () => {
      const incomingBaseApiUrl = 'https://dev.mes.dev-dvsacloud.uk/v1';
      const expected = 'https://dev.mes.dev-dvsacloud.uk/v1';
      const result = removeTrailingSlash(incomingBaseApiUrl);
      expect(result).toEqual(expected);
    });
  });
});
