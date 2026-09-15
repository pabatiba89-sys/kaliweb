export const parseFeatureFlag = (value) => (
  ['1', 'true', 'yes', 'on'].includes(String(value ?? '').trim().toLowerCase())
);

// Keep attribution data intact while the customer-facing affiliate UI is paused.
export const AFFILIATE_UI_ENABLED = parseFeatureFlag(import.meta.env?.VITE_AFFILIATE_UI_ENABLED);
