import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Cache to store suggestions for each prompt
const suggestionsCache = new Map<string, string>();

export const generateGiftSuggestions = async (prompt: string) => {
  try {
    // Check if API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return 'Gift 1:\nName: Sample Gift\nDescription: This is a sample gift suggestion (API key not configured)\n\nGift 2:\nName: Sample Gift 2\nDescription: This is another sample gift suggestion (API key not configured)\n\nGift 3:\nName: Sample Gift 3\nDescription: This is a third sample gift suggestion (API key not configured)\n\nGift 4:\nName: Sample Gift 4\nDescription: This is a fourth sample gift suggestion (API key not configured)';
    }

    // Check cache first
    const cachedResponse = suggestionsCache.get(prompt);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a gift suggestion expert. You MUST ALWAYS provide 4 gift suggestions, no more and no less. Format each suggestion starting with "Gift X:" followed by Name, Price, Why, Where, and Description on separate lines with colons. Never suggest generic items like chargers or generic tech accessories unless specifically requested.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4, // Lower temperature for more consistent outputs
      max_tokens: 1000,
      presence_penalty: 0.2,
      frequency_penalty: 0.5
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No suggestions received from OpenAI');
    }

    // Validate that the response contains exactly 4 gift suggestions
    const giftCount = (content.match(/Gift \d+:/g) || []).length;
    if (giftCount !== 4) {
      throw new Error('Response did not contain exactly 4 gift suggestions');
    }

    // Cache the successful response
    suggestionsCache.set(prompt, content);

    return content;
  } catch (error) {
    console.error('Error generating gift suggestions:', error);
    // Return fallback suggestions in case of error
    return 'Gift 1:\nName: Fallback Gift\nDescription: A thoughtful gift suggestion (Service temporarily unavailable)\n\nGift 2:\nName: Fallback Gift 2\nDescription: Another thoughtful gift suggestion (Service temporarily unavailable)\n\nGift 3:\nName: Fallback Gift 3\nDescription: A third thoughtful gift suggestion (Service temporarily unavailable)\n\nGift 4:\nName: Fallback Gift 4\nDescription: A fourth thoughtful gift suggestion (Service temporarily unavailable)';
  }
};