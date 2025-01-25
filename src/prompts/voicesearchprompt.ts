export const generateVoiceGreeting = (): string => {
  const greetings = [
    "Hi! I'll help you find the perfect gift. Tell me about what you're looking for!",
    "Welcome! Let me help you find the ideal gift. What are you looking for?"
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
};

export const generateVoicePrompt = (input: string): string => {
  return `Please analyze the following voice input and extract gift-related parameters. For each parameter, extract it if present or mark as "missing". Be thorough in analyzing the entire input for any mentioned parameters.

Voice Input: "${input}"

Required Parameters:
1. Occasion (e.g., birthday, anniversary, wedding)
2. Recipient (who is the gift for?)
3. Interests/Hobbies (can be multiple)
4. Budget (any mentioned amount)
5. Gift Preference (physical item or experience)

Additional Parameters (optional):
6. Additional Preferences (colors, themes, specific requirements)

IMPORTANT EXTRACTION RULES:
- Extract ANY mentioned parameter, even if mentioned casually
- For occasion: Look for event words like "birthday", "anniversary", etc.
- For recipient: Look for relationship terms or names
- For interests: Extract ANY mentioned hobbies or likes
- For budget: Look for numbers with currency symbols or words like "dollars", "rupees"
- For gift preference: Look for mentions of physical items or experiences

Format the response exactly as follows:
{
  "parameters": {
    "occasion": "extracted or missing",
    "recipient": "extracted or missing",
    "interests": ["extracted interests"] or "missing",
    "budget": "extracted amount or missing",
    "giftPreference": "physical/experience or missing",
    "additionalPreferences": "extracted or missing"
  },
  "missingInfo": ["list of required missing parameters only"],
  "nextQuestion": "specific question to ask for the most important missing parameter"
}`;
};

export const generateMissingParamPrompt = (param: string): string => {
  const prompts: Record<string, string[]> = {
    occasion: [
      "What's the special occasion we're shopping for?",
      "Which event is this gift for?",
      "Could you tell me what occasion we're celebrating?"
    ],
    recipient: [
      "Who will be receiving this gift?",
      "Who are we shopping for?",
      "Could you tell me who this gift is for?"
    ],
    interests: [
      "What are their interests or hobbies?",
      "What kind of things do they enjoy?",
      "Could you tell me about their interests?"
    ],
    budget: [
      "What's your budget for this gift?",
      "How much would you like to spend?",
      "What's your budget range?"
    ],
    giftPreference: [
      "Would you prefer a physical gift or an experience?",
      "Are you looking for a tangible item or an experience-based gift?",
      "Should this be a physical gift or an experience?"
    ]
  };

  const options = prompts[param] || ["Could you provide more details about that?"];
  return options[Math.floor(Math.random() * options.length)];
};