import { removeTrailingSlash } from './removeTrailingSlash';

export const getBaseApiUrl = (): string => {
  const url = process.env.BASE_API_URL || 'https://dev.mes.dev-dvsacloud.uk/v1';
  return removeTrailingSlash(url);
};
