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

export const getGeneratedRetryPrompt = (messages = [], failedIndex = messages.length - 1) => {
  const failedMessage = messages[failedIndex] || {};
  const failedRound = Number(failedMessage.roundNo);
  let fallback = '';
  for (let index = failedIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== 'user') continue;
    const prompt = typeof message.text === 'string' ? message.text.trim() : '';
    if (!prompt) continue;
    if (!fallback) fallback = prompt;
    if (failedRound && Number(message.roundNo) === failedRound) return prompt;
  }
  return fallback;
};
