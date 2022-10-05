export const environment = () => process.env.ENVIRONMENT || 'local';

export const getMinimumAppVersion = () => process.env.MINIMUM_APP_VERSION;

export const getDes4MinimumAppVersion = () => process.env.DES4_MINIMUM_APP_VERSION;

export const getLiveAppVersion = () => process.env.LIVE_APP_VERSION;

export const getDES4LiveCats = () => process.env.DES4_LIVE_CATS;

export const getDES3LiveCats = () => process.env.DES3_LIVE_CATS;

export const getDES4UatCats = () => process.env.DES4_UAT_CATS;

export const getDES4PilotCats = () => process.env.DES4_PILOT_CATS;
