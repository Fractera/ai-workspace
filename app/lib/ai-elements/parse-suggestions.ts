export type ParsedSuggestion = {
  suggestion: string;
  label: string;
};

export type ParsedMessage = {
  text: string;
  suggestions: ParsedSuggestion[];
};

// Extracts <Suggestions>...</Suggestions> blocks from streamed text.
// Returns text without the block + parsed suggestion list.
export function parseSuggestions(raw: string): ParsedMessage {
  const suggestions: ParsedSuggestion[] = [];

  const text = raw.replace(
    /<Suggestions>([\s\S]*?)<\/Suggestions>/g,
    (_, inner) => {
      const itemRe = /<Suggestion\s+suggestion="([^"]+)"[^>]*>([\s\S]*?)<\/Suggestion>/g;
      let match;
      while ((match = itemRe.exec(inner)) !== null) {
        suggestions.push({ suggestion: match[1].trim(), label: match[2].trim() });
      }
      return '';
    }
  ).trim();

  return { text, suggestions };
}
