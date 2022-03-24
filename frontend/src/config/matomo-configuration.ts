const urlBase: string = process.env.REACT_APP_PIWIK_URL || 'https://matomo.org';
// 1 is default value for no siteId since matomo considers 0 as an empty id and does not accept null value
const siteId: number =
  parseInt(process.env.REACT_APP_PIWIK_SITE_ID as string) || 1;
const disabled: boolean = !urlBase || siteId === 1;

export const matomoConfiguration = {
  urlBase,
  siteId,
  trackerUrl: `${urlBase}/piwik.php`,
  srcUrl: `${urlBase}/piwik.js`,
  disabled,
  linkTracking: false,
};

export default matomoConfiguration;
