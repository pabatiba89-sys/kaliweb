export const GENERATED_CONTENT_UNAVAILABLE_MESSAGE = '文案迷路了，请重新生成。';

export const isGeneratedMarkupFailure = (value) => {
  const text = typeof value === 'string' ? value : value == null ? '' : String(value);
  if (!text) return false;
  const markupTags = text.match(/<\/?(?:html|head|body|main|section|article|div|script|style|title|meta|link)\b[^>]*>/gi) || [];
  const visibleText = text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim();
  return /<!doctype\s+html|<\/?(?:html|body)\b/i.test(text)
    || (markupTags.length >= 2 && visibleText.length < 24);
};
