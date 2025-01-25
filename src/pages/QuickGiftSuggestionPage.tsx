import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, ArrowLeft, AlertCircle, ExternalLink } from 'lucide-react';
import { generateQuickGiftPrompt } from '../prompts/quickgiftprompts';
import { generateGiftSuggestions_quick } from '../services/openai';
import { useRegion } from '../context/RegionContext';

interface UserInput {
  occasion: string;
  recipient: string;
  interests: string[];
  budget: string;
  giftPreference: 'physical' | 'experience';
  additionalPreferences?: string;
  age?: string;
}

interface GiftSuggestion {
  name: string;
  price: string;
  reason: string;
  whereToBuy: string;
  description: string;
}

const GiftCard: React.FC<{ suggestion: GiftSuggestion; giftPreference: 'physical' | 'experience' }> = ({ suggestion, giftPreference }) => {
  const navigate = useNavigate();
  const { region, marketplace } = useRegion();
  const gradient = 'from-rose-300 to-purple-300';
  
  const handleButtonClick = () => {
    if (giftPreference === 'physical') {
      // Get saved location from localStorage
      const savedLocationData = localStorage.getItem('saved_location');
      if (savedLocationData) {
        const { address } = JSON.parse(savedLocationData);
        navigate(`/check-nearby?location=${encodeURIComponent(address)}&gift=${encodeURIComponent(suggestion.name)}`);
      } else {
        // If no saved location, open Amazon search in new tab
        const searchQuery = encodeURIComponent(suggestion.name);
        window.open(`https://www.${marketplace}/s?k=${searchQuery}`, '_blank');
      }
    } else {
      // For experience gifts, open in new tab
      window.open(`https://www.google.com/search?q=${encodeURIComponent(suggestion.name)}`, '_blank');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-4px] h-full flex flex-col">
      <div className={`bg-gradient-to-r ${gradient} px-4 py-3`}>
        <h3 className="text-lg font-bold text-gray-600 text-center">
          {suggestion.name || 'Gift Suggestion'}
        </h3>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-sm text-gray-600 leading-relaxed flex-1">
          {suggestion.description || suggestion.reason || 'No description available'}
        </p>

        <button 
          onClick={handleButtonClick}
          className={`mt-4 px-4 py-2 bg-gradient-to-r ${gradient} text-black text-sm rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]`}
        >
          <ExternalLink className="w-4 h-4" />
          {giftPreference === 'physical' ? 'Find Near By Store' : 'Buy Online'}
        </button>
      </div>
    </div>
  );
};

const QuickGiftSuggestionPage = () => {
  const navigate = useNavigate();
  const { region } = useRegion();
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [suggestions, setSuggestions] = useState<GiftSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPreference, setNewPreference] = useState('');

  const parseSuggestions = (text: string): GiftSuggestion[] => {
    try {
      const suggestions: GiftSuggestion[] = [];
      const suggestionBlocks = text.split(/(?=\d\.|Gift \d:)/).filter(block => block.trim());

      for (const block of suggestionBlocks) {
        const suggestion: Partial<GiftSuggestion> = {};
        const lines = block.split('\n').filter(line => line.trim());

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (line.match(/^1\.|\bGift name:|\bName:/) || line.includes('Gift name:') || line.includes('Name:')) {
            suggestion.name = line.split(/^1\.|Gift name:|Name:|:/)[1]?.trim();
          } else if (line.match(/^2\.|\bEstimated price:|\bPrice:/) || line.includes('Estimated price:') || line.includes('Price:')) {
            suggestion.price = line.split(/^2\.|Estimated price:|Price:|:/)[1]?.trim();
          } else if (line.match(/^3\.|\bWhy it's perfect:|\bWhy:/) || line.includes("Why it's perfect:") || line.includes('Why:')) {
            suggestion.reason = line.split(/^3\.|Why it's perfect:|Why:|:/)[1]?.trim();
          } else if (line.match(/^4\.|\bWhere to buy:|\bWhere:/) || line.includes('Where to buy:') || line.includes('Where:')) {
            suggestion.whereToBuy = line.split(/^4\.|Where to buy:|Where:|:/)[1]?.trim();
          } else if (line.match(/^5\.|\bDescription:/) || line.includes('Description:')) {
            suggestion.description = line.split(/^5\.|Description:|:/)[1]?.trim();
          }
        }

        if (suggestion.name && suggestion.name.length > 0) {
          suggestions.push(suggestion as GiftSuggestion);
        }
      }

      return suggestions;
    } catch (error) {
      console.error('Error parsing suggestions:', error);
      return [];
    }
  };

  const handleGetOtherGifts = async () => {
    if (!userInput || !newPreference.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Update user input with new preferences
      const updatedInput = {
        ...userInput,
        additionalPreferences: newPreference
      };

      // Store updated preferences
      localStorage.setItem('user_input', JSON.stringify(updatedInput));

      // Generate new prompt with prioritized preferences
      const prompt = generateQuickGiftPrompt(
        updatedInput.occasion,
        updatedInput.recipient,
        updatedInput.interests,
        updatedInput.budget,
        updatedInput.giftPreference,
        updatedInput.additionalPreferences,
        updatedInput.age,
        region // Pass region to prompt
      );

      const response = await generateGiftSuggestions_quick(prompt);
      const parsedSuggestions = parseSuggestions(response || '');
      
      if (parsedSuggestions.length === 0) {
        throw new Error('No valid suggestions could be parsed from the response');
      }
      
      setSuggestions(parsedSuggestions);
      setNewPreference('');
    } catch (error) {
      setError('Failed to generate new gift suggestions. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const savedInput = localStorage.getItem('user_input');
        if (savedInput) {
          const parsedInput = JSON.parse(savedInput);
          setUserInput(parsedInput);

          const prompt = generateQuickGiftPrompt(
            parsedInput.occasion,
            parsedInput.recipient,
            parsedInput.interests,
            parsedInput.budget,
            parsedInput.giftPreference,
            parsedInput.additionalPreferences,
            parsedInput.age,
            region // Pass region to prompt
          );

          const response = await generateGiftSuggestions_quick(prompt);
          const parsedSuggestions = parseSuggestions(response || '');
          
          if (parsedSuggestions.length === 0) {
            throw new Error('No valid suggestions could be parsed from the response');
          }
          
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
  }, [region]); // Re-fetch when region changes

  if (!userInput) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No gift preferences found. Please start over.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-rose-500 text-black rounded-lg hover:bg-rose-600 transition-colors"
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
          onClick={() => navigate('/quick-gift-decide')}
          className="group mb-8 inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Gift Finder
        </button>

        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <Gift className="w-12 h-12 text-rose-500" />
          </div>
          
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
            Quick Gift Suggestions
          </h1>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-12">
            <h2 className="text-xl font-semibold mb-4">Your Preferences</h2>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <dt className="text-gray-600">Occasion</dt>
                <dd className="font-medium mt-1">{userInput.occasion.replace('custom-', '')}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Recipient</dt>
                <dd className="font-medium mt-1">{userInput.recipient.replace('custom-', '')}</dd>
              </div>
              <div>
                <dt className="text-gray-600">Budget Range</dt>
                <dd className="font-medium mt-1">
                  {region === 'IN' ? '₹' : '$'}{userInput.budget}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600">Gift Type</dt>
                <dd className="font-medium mt-1 capitalize">{userInput.giftPreference}</dd>
              </div>
              {userInput.age && (
                <div>
                  <dt className="text-gray-600">Age</dt>
                  <dd className="font-medium mt-1">{userInput.age} years</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-600">Region</dt>
                <dd className="font-medium mt-1">{region === 'IN' ? 'India' : 'United States'}</dd>
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
            </dl>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Finding the perfect quick gifts for you...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-rose-500 text-black rounded-lg hover:bg-rose-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-6">
                {suggestions.map((suggestion, index) => (
                  <GiftCard 
                    key={index} 
                    suggestion={suggestion} 
                    giftPreference={userInput.giftPreference}
                  />
                ))}
              </div>

              <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Need Some Other Gift?</h2>
                <div className="space-y-4">
                  <textarea
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    placeholder="Tell us what kind of gift you're looking for... (e.g., specific colors, themes, or any other preferences)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent min-h-[100px] resize-none"
                  />
                  <button
                    onClick={handleGetOtherGifts}
                    disabled={!newPreference.trim() || loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-rose-300 to-purple-300 text-black rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-65 disabled:cursor-not-allowed"
                  >
                    <Gift className="w-5 h-5" />
                    Get Some Other Gift
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

export default QuickGiftSuggestionPage;