export interface VoicePersonality {
  tone: 'friendly' | 'professional' | 'casual';
  pace: 'slow' | 'medium' | 'fast';
  expressions: string[];
}

export const defaultPersonality: VoicePersonality = {
  tone: 'friendly',
  pace: 'medium',
  expressions: [
    "Hmm, let me think about that...",
    "That's a great choice!",
    "I love that idea!",
    "How wonderful!",
    "That's perfect!",
    "Ah, I see what you mean!"
  ]
};

export const enhanceResponse = (text: string, personality: VoicePersonality = defaultPersonality): string => {
  const addExpression = Math.random() > 0.7;
  if (addExpression) {
    const expression = personality.expressions[Math.floor(Math.random() * personality.expressions.length)];
    return `${expression} ${text}`;
  }
  return text;
};

export const addEmphasis = (text: string): string => {
  // Add SSML tags for emphasis and prosody
  return `
    <speak>
      <prosody rate="medium" pitch="+0%">
        ${text}
      </prosody>
    </speak>
  `;
};