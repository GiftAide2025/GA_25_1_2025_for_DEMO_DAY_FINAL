// Conversation flow management
export interface ConversationState {
  stage: 'greeting' | 'occasion' | 'recipient' | 'interests' | 'budget' | 'confirmation';
  data: {
    occasion?: string;
    recipient?: string;
    interests?: string[];
    budget?: string;
    giftPreference?: 'physical' | 'experience';
  };
}

export const getNextPrompt = (state: ConversationState): string => {
  const prompts = {
    greeting: [
      "Hi there! I'm your gift finding assistant. Would you like help finding the perfect gift?",
      "Hello! I'm here to help you find an amazing gift. Shall we get started?",
      "Welcome! I'd love to help you find a special gift. Ready to begin?"
    ],
    occasion: [
      "What's the special occasion we're shopping for?",
      "Tell me, what are we celebrating?",
      "Which special event are we finding a gift for?"
    ],
    recipient: [
      `Great! And who's the lucky person we're shopping for?`,
      "Wonderful! Who will be receiving this gift?",
      "Perfect! Who's the special someone we're buying for?"
    ],
    interests: [
      "What are some things they really enjoy or are passionate about?",
      "Tell me about their interests and hobbies!",
      "What kind of activities or things do they love?"
    ],
    budget: [
      "And what's your budget range for this gift?",
      "How much would you like to spend on this gift?",
      "What's your ideal budget for this special gift?"
    ],
    confirmation: [
      "Let me make sure I got everything right...",
      "Here's what I understand so far...",
      "Just to confirm what you're looking for..."
    ]
  };

  const randomIndex = Math.floor(Math.random() * 3);
  return prompts[state.stage][randomIndex];
};

export const generateConfirmation = (state: ConversationState): string => {
  return `I understand you're looking for a gift for ${state.data.occasion} for your ${state.data.recipient}. 
  They're interested in ${state.data.interests?.join(', ')}, and your budget is ${state.data.budget}. 
  Would you like to see some perfect gift suggestions based on this?`;
};

export const processUserResponse = (text: string, currentState: ConversationState): {
  nextState: ConversationState;
  understood: boolean;
  needsClarification: boolean;
} => {
  const lowerText = text.toLowerCase();
  const nextState = { ...currentState };
  let understood = true;
  let needsClarification = false;

  switch (currentState.stage) {
    case 'greeting':
      if (lowerText.includes('yes') || lowerText.includes('sure') || lowerText.includes('help')) {
        nextState.stage = 'occasion';
      } else {
        needsClarification = true;
      }
      break;

    case 'occasion':
      if (lowerText.includes('birthday') || lowerText.includes('wedding') || 
          lowerText.includes('anniversary') || lowerText.includes('graduation')) {
        nextState.data.occasion = text.match(/(birthday|wedding|anniversary|graduation)/i)?.[0] || '';
        nextState.stage = 'recipient';
      } else {
        needsClarification = true;
      }
      break;

    // Add other cases for different stages...
  }

  return { nextState, understood, needsClarification };
};