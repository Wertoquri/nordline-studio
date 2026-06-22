export type AnalyticsEvent = 'cta_click' | 'project_open' | 'form_start' | 'lead_submit' | 'phone_click';
type Properties = Record<string, string | number | boolean>;
export interface AnalyticsAdapter { track(event: AnalyticsEvent, properties?: Properties): void }
const consoleAdapter: AnalyticsAdapter = { track(event, properties = {}) { if (import.meta.env.DEV || import.meta.env.VITE_ANALYTICS_MODE === 'console') console.info('[analytics]', event, properties); } };
export const analytics: AnalyticsAdapter = consoleAdapter;
