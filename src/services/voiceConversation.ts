import { textToSpeech } from './openaiVoice';

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

// Improved prompts with more natural language
export const getNextPrompt = (state: ConversationState): string => {
  switch (state.stage) {
    case 'greeting':
      return "Hi! I'm your gift finding assistant. I'll help you find the perfect gift. What occasion are you shopping for?";
    case 'occasion':
      return "What's the special occasion? For example, is it a birthday, anniversary, or something else?";
    case 'recipient':
      return "Wonderful! And who will be receiving this gift? Tell me about them.";
    case 'interests':
      return "What are their interests or hobbies? What do they love doing?";
    case 'budget':
      return "What's your budget range for this gift? You can say something like '$50' or '$100'.";
    case 'confirmation':
      return "Great! I've got everything I need. Let me find some perfect gift suggestions for you.";
    default:
      return "How can I help you find the perfect gift today?";
  }
};

// Enhanced voice input processing with better pattern matching
export const processVoiceInput = async (text: string, state: ConversationState): Promise<{
  nextState: ConversationState;
  response: string;
  shouldNavigate: boolean;
}> => {
  const lowerText = text.toLowerCase();
  const nextState = { ...state };
  let response = '';
  let shouldNavigate = false;

  // Helper function to extract numbers from text
  const extractNumber = (text: string): string | null => {
    const matches = text.match(/\$?(\d+)/);
    return matches ? matches[1] : null;
  };

  // Helper function to detect occasion
  const detectOccasion = (text: string): string | null => {
    const occasions = [
      'birthday', 'anniversary', 'wedding', 'graduation',
      'christmas', 'holiday', 'valentine', 'mother\'s day',
      'father\'s day', 'baby shower', 'housewarming'
    ];
    
    for (const occasion of occasions) {
      if (text.toLowerCase().includes(occasion)) {
        return occasion;
      }
    }
    return null;
  };

  try {
    switch (state.stage) {
      case 'greeting':
        const detectedOccasion = detectOccasion(lowerText);
        if (detectedOccasion) {
          nextState.data.occasion = detectedOccasion;
          nextState.stage = 'recipient';
          response = "Great! And who will be receiving this gift?";
        } else {
          nextState.stage = 'occasion';
          response = "What's the special occasion we're shopping for?";
        }
        break;

      case 'occasion':
        const occasion = detectOccasion(lowerText);
        if (occasion) {
          nextState.data.occasion = occasion;
          nextState.stage = 'recipient';
          response = "Perfect! And who will be receiving this gift?";
        } else {
          response = "I didn't quite catch the occasion. Could you please specify if it's for a birthday, wedding, or another special event?";
        }
        break;

      case 'recipient':
        // Extract meaningful recipient information
        const recipientInfo = text.replace(/(?:it's|its|for|my|a)\s+/gi, '').trim();
        if (recipientInfo.length > 0) {
          nextState.data.recipient = recipientInfo;
          nextState.stage = 'interests';
          response = "What are some things they really enjoy or are passionate about?";
        } else {
          response = "Could you tell me who the gift is for?";
        }
        break;

      case 'interests':
        // Split interests by common separators and clean up
        const interests = text
          .split(/[,;&]|\band\b/i)
          .map(i => i.trim())
          .filter(i => i.length > 0);

        if (interests.length > 0) {
          nextState.data.interests = interests;
          nextState.stage = 'budget';
          response = "And what's your budget range for this gift?";
        } else {
          response = "Could you tell me about their interests or hobbies?";
        }
        break;

      case 'budget':
        const budget = extractNumber(text);
        if (budget) {
          nextState.data.budget = budget;
          nextState.stage = 'confirmation';
          response = "Perfect! I'll find some great gift suggestions based on what you've told me.";
          shouldNavigate = true;
        } else {
          response = "Could you specify a budget amount? For example, say '$50' or '$100'.";
        }
        break;

      default:
        response = "I'm here to help you find the perfect gift. What occasion are you shopping for?";
        nextState.stage = 'greeting';
    }
  } catch (error) {
    console.error('Error processing voice input:', error);
    response = "I'm having trouble understanding. Could you please try again?";
  }

  return { nextState, response, shouldNavigate };
};

// Improved voice response playback with error handling
export const playVoiceResponse = async (text: string): Promise<void> => {
  try {
    const audioBuffer = await textToSpeech(text);
    const blob = new Blob([audioBuffer], { type: 'audio/mp3' });
    const url = URL.createObjectURL(blob);
    
    return new Promise((resolve, reject) => {
      const audio = new Audio(url);
      
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      
      audio.onerror = (error) => {
        URL.revokeObjectURL(url);
        reject(error);
      };

      audio.play().catch(reject);
    });
  } catch (error) {
    console.error('Error playing voice response:', error);
    throw error;
  }
};