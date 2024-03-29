import { removeTrailingSlash } from '../application/removeTrailingSlash';

export const getBaseApiUrl = (): string => {
  const url = process.env.BASE_API_URL || 'https://dev.mes.dev-dvsacloud.uk/v1';
  return removeTrailingSlash(url);
};

export const getSearchMCBaseApiUrl = (): string => {
  const url = process.env.SEARCH_MC_BASE_API_URL as string;
  return removeTrailingSlash(url);
};
