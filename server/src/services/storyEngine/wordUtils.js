export function countWords(text) {
  if (!text) return 0;
  const t = String(text).trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

export function truncateToWords(text, maxWords) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return words.slice(0, maxWords).join(' ');
}

export function expandToWordCount(baseText, blocks, targetWords, rng) {
  let text = String(baseText || '').trim();
  const pick = () => blocks[Math.floor(rng() * blocks.length)];
  while (countWords(text) < targetWords) {
    const nextBlock = pick();
    text = text ? `${text} ${nextBlock}` : nextBlock;
  }
  return truncateToWords(text, targetWords);
}

