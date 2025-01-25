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
          content: 'You are a gift suggestion expert. You MUST ALWAYS provide 4 gift suggestions, no more and no less. Format each suggestion starting with "Gift X:" followed by Name and Description on separate lines with colons. Never suggest generic items like chargers or generic tech accessories unless specifically requested. IMPORTANT: Descriptions MUST be exactly 6-8 words long.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
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
    return 'Gift 1:\nName: Fallback Gift\nDescription: A thoughtful gift suggestion (Service temporarily unavailable)\n\nGift 2:\nName: Fallback Gift 2\nDescription: Another thoughtful gift suggestion (Service temporarily unavailable)\n\nGift 3:\nName: Fallback Gift 3\nDescription: A third thoughtful gift suggestion (Service temporarily unavailable)\n\nGift 4:\nName: Fallback Gift 4\nDescription: A fourth thoughtful gift suggestion (Service temporarily unavailable)';
  }
};

// Cache for quick gift suggestions
const quickSuggestionsCache = new Map<string, string>();

export const generateGiftSuggestions_quick = async (prompt: string) => {
  try {
    // Check if API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return `Gift 1:
Name: Sample Quick Gift
Description: Perfect gift for immediate gifting needs

Gift 2:
Name: Sample Quick Gift 2
Description: Ideal last-minute gift option available locally

Gift 3:
Name: Sample Quick Gift 3
Description: Quick and thoughtful gift choice nearby

Gift 4:
Name: Sample Quick Gift 4
Description: Ready-to-buy gift for immediate needs`;
    }

    // Check cache first for quick suggestions
    const cachedResponse = quickSuggestionsCache.get(prompt);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a quick gift suggestion expert. You MUST ALWAYS provide 4 gift suggestions that are readily available in local stores or for immediate purchase. Format each suggestion starting with "Gift X:" followed by Name and Description on separate lines with colons. CRITICAL: Each description MUST be exactly 6-8 words long, no more and no less. Focus on gifts that can be obtained quickly and locally.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      presence_penalty: 0.2,
      frequency_penalty: 0.4
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No quick suggestions received from OpenAI');
    }

    // Validate that the response contains exactly 4 gift suggestions
    const giftCount = (content.match(/Gift \d+:/g) || []).length;
    if (giftCount !== 4) {
      throw new Error('Response did not contain exactly 4 quick gift suggestions');
    }

    // Cache the successful response
    quickSuggestionsCache.set(prompt, content);

    return content;
  } catch (error) {
    console.error('Error generating quick gift suggestions:', error);
    return `Gift 1:
Name: Quick Fallback Gift
Description: Perfect local gift for immediate gifting needs

Gift 2:
Name: Quick Fallback Gift 2
Description: Readily available gift at nearby stores

Gift 3:
Name: Quick Fallback Gift 3
Description: Easy to find thoughtful gift option

Gift 4:
Name: Quick Fallback Gift 4
Description: Quick and meaningful gift choice nearby`;
  }
};