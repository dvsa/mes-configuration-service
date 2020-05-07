import { removeTrailingSlash } from './removeTrailingSlash';

export const getRaiseIncidentApiBaseUrl = (): string => {
  const url = process.env.RAISE_INCIDENT_BASE_API_URL || 'https://fup9rq6e4l.execute-api.eu-west-1.amazonaws.com/test/raise-incident-api';
  return removeTrailingSlash(url);
};
