export const environment = () => process.env.ENVIRONMENT || 'local';

export const getMinimumAppVersion = () => process.env.MINIMUM_APP_VERSION;

export const getLiveAppVersion = () => process.env.LIVE_APP_VERSION;
