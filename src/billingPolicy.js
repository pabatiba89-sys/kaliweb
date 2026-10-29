export const RMB_PER_USD = 7.2;

// Only Simplified Chinese uses the WeChat Mini Program checkout.
export const usesMiniProgramPayment = (locale) => locale === 'zh-CN';
export const convertRmbToUsdAmount = (amount) => Math.ceil(amount / RMB_PER_USD);
