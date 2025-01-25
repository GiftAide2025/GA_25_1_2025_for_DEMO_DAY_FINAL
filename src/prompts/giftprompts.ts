export const generateGiftPrompt = (
  occasion: string,
  recipient: string,
  interests: string[],
  budget: string,
  giftPreference: 'physical' | 'experience',
  additionalPreferences?: string
): string => {
  const basePrompt = `As an AI gift advisor, I need you to provide 4 ${giftPreference} gift suggestions available on Amazon for this scenario. No more, no less than 4 suggestions.

Occasion: ${occasion}
Recipient: ${recipient}
Their Interests: ${interests.join(', ')}
Budget Range: $${budget}`;

  const customPreference = additionalPreferences 
    ? `\nSpecial Requirements: ${additionalPreferences} (Please prioritize these preferences in the suggestions)`
    : '';

  return `${basePrompt}${customPreference}

Please format each suggestion exactly as follows:

Gift 1:
Name: [gift name]
Description: [brief description in exactly 10 words]

Gift 2:
[same format]

Gift 3:
[same format]

Gift 4:
[same format]

Important Guidelines:
- Provide EXACTLY 4 suggestions
- Each suggestion must be unique and creative
- Focus on items available on Amazon
- Keep descriptions exactly 10 words
- Focus on personalized gifts that match their interests
- Prioritize any special requirements provided
- Avoid generic suggestions
- Stay within the budget range

Remember: I need EXACTLY 4 suggestions, formatted precisely as shown above.`;
};