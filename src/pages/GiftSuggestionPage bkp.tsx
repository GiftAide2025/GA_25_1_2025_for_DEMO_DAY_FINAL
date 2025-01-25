import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, ArrowLeft, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { generateGiftPrompt } from '../prompts/giftprompts';
import { generateGiftSuggestions } from '../services/openai';

interface UserInput {
  occasion: string;
  recipient: string;
  interests: string[];
  budget: string;
  giftPreference: 'physical' | 'experience';
  additionalPreferences?: string;
}

interface GiftSuggestion {
  name: string;
  description: string;
}

const GiftCard: React.FC<{ suggestion: GiftSuggestion }> = ({ suggestion }) => {
  const gradient = 'from-rose-500 to-purple-600';
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:translate-y-[-4px]">
      <div className={`bg-gradient-to-r ${gradient} px-6 py-3`}>
        <h3 className="text-lg font-bold text-white">
          {suggestion.name || 'Gift Suggestion'}
        </h3>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-gray-600 leading-relaxed flex-1">
          {suggestion.description || 'No description available'}
        </p>

        <button 
          className={`mt-4 px-6 py-3 bg-gradient-to-r ${gradient} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]`}
          onClick={() => {
            window.open(`https://www.amazon.com/s?k=${encodeURIComponent(suggestion.name)}`, '_blank');
          }}
        >
          <ExternalLink className="w-5 h-5" />
          View and Buy Online
        </button>
      </div>
    </div>
  );
};

const GiftSuggestionPage = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [customPreference, setCustomPreference] = useState('');
  
  // Use ref to prevent multiple fetches
  const fetchedRef = useRef(false);

  const parseSuggestions = useCallback((text: string): GiftSuggestion[] => {
    try {
      // Split by "Gift X:" format
      const blocks = text.split(/Gift \d+:/).filter(block => block.trim());
      
      if (blocks.length !== 4) {
        throw new Error('Expected exactly 4 gift suggestions');
      }

      return blocks.map(block => {
        const lines = block.split('\n').filter(line => line.trim());
        const suggestion: Partial<GiftSuggestion> = {};

        for (const line of lines) {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();

          if (!key || !value) continue;

          const normalizedKey = key.trim().toLowerCase();
          
          if (normalizedKey.includes('name')) {
            suggestion.name = value;
          } else if (normalizedKey.includes('description')) {
            suggestion.description = value;
          }
        }

        // Validate that all required fields are present
        if (!suggestion.name || !suggestion.description) {
          throw new Error('Missing required fields in gift suggestion');
        }

        return suggestion as GiftSuggestion;
      });
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      throw new Error('Failed to parse exactly 4 valid gift suggestions');
    }
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      // Prevent multiple fetches
      if (fetchedRef.current) return;
      fetchedRef.current = true;

      try {
        const savedInput = localStorage.getItem('user_input');
        if (savedInput) {
          const parsedInput = JSON.parse(savedInput);
          setUserInput(parsedInput);

          const prompt = generateGiftPrompt(
            parsedInput.occasion,
            parsedInput.recipient,
            parsedInput.interests,
            parsedInput.budget,
            parsedInput.giftPreference,
            parsedInput.additionalPreferences
          );

          const response = await generateGiftSuggestions(prompt);
          const parsedSuggestions = parseSuggestions(response || '');
          setSuggestions(parsedSuggestions);
        }
      } catch (error) {
        setError('Failed to generate gift suggestions. Please try again.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();

    // Cleanup function
    return () => {
      fetchedRef.current = false;
    };
  }, [parseSuggestions]);

  const handleGetNewGifts = async () => {
    if (!userInput || !customPreference.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      // Create updated input with custom preference
      const updatedInput = {
        ...userInput,
        additionalPreferences: customPreference
      };

      // Store updated preferences
      localStorage.setItem('user_input', JSON.stringify(updatedInput));

      // Generate new prompt with custom preference prioritized
      const prompt = generateGiftPrompt(
        updatedInput.occasion,
        updatedInput.recipient,
        updatedInput.interests,
        updatedInput.budget,
        updatedInput.giftPreference,
        updatedInput.additionalPreferences // Pass custom preference to prompt
      );

      // Get new suggestions
      const response = await generateGiftSuggestions(prompt);
      const parsedSuggestions = parseSuggestions(response || '');
      setSuggestions(parsedSuggestions);

      // Clear custom preference after successful update
      setCustomPreference('');
    } catch (error) {
      setError('Failed to generate new gift suggestions. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userInput) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No gift preferences found. Please start over.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="group mb-8 inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <Gift className="w-12 h-12 text-rose-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            Your Perfect Gift Suggestions
          </h1>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-12">
            <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dt className="text-gray-600">Occasion</dt>
                <dd className="font-medium mt-1">{userInput.occasion.replace('custom-', '')}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Recipient</dt>
                <dd className="font-medium mt-1">{userInput.recipient.replace('custom-', '')}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Interests</dt>
                <dd className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {userInput.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm"
                      >
                        {interest.replace('custom-', '')}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="text-gray-600">Budget Range</dt>
                <dd className="font-medium mt-1">${userInput.budget}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Gift Type</dt>
                <dd className="font-medium mt-1 capitalize">{userInput.giftPreference}</dd>
              </div>
            </dl>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing preferences and generating personalized suggestions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.map((suggestion, index) => (
                  <GiftCard key={index} suggestion={suggestion} />
                ))}
              </div>

              {/* Custom Preference Section */}
              <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Want Something Different?</h2>
                </div>
                <div className="space-y-4">
                  <textarea
                    value={customPreference}
                    onChange={(e) => setCustomPreference(e.target.value)}
                    placeholder="Tell us more about what you're looking for... (e.g., specific colors, themes, or any other preferences)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                  />
                  <button
                    onClick={handleGetNewGifts}
                    disabled={!customPreference.trim() || loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Gift className="w-5 h-5" />
                    Get New Gift Suggestions
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No suggestions available. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GiftSuggestionPage;