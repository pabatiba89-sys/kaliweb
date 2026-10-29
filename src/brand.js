const legacyNames = /Kali\s*[·・]\s*Yixiu|喀理\s*[·・]\s*[亿億]秀|Yixiu(?: Global| System)?|[亿億]秀(?:系统|系統)?|一秀(?:环球|環球)?|一修|奕秀|伊秀|[艺藝]秀|Исиу|Исю|Ісю|Їсіу|ييشيو|يي شيو|이쉬우|이시우|यिक्सिउ|イーシウ・グローバル|อี้ซิว โกลบอล/gi;
export function applyBrandName(value, locale) {
  const normalized = String(value).replace(legacyNames, 'Kali');
  return String(locale).startsWith('zh') ? normalized.replace(/Kali/g, '喀理') : normalized;
}
