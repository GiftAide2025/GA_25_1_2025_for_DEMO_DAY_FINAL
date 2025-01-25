import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegion } from '../context/RegionContext';
import {
  Brain, Heart, Gift, X, ArrowRight, Cake, Crown, 
  Home, Baby, GraduationCap, Award, Plane, Sparkles, 
  Flame, Palette, CircleDot, Flower2, Moon, Sun, 
  DollarSign, Smile, Zap, Star, Music, Lamp, User, Users,
  Book, Activity, Gamepad, Shirt, Camera, Plus
} from 'lucide-react';

interface AIGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIGuideModal: React.FC<AIGuideModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { region, currencySymbol } = useRegion();
  const [giftingMode] = useState('planned');
  const [activeStep, setActiveStep] = useState(0);
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [giftPreference, setGiftPreference] = useState<'physical' | 'experience'>('physical');
  const [customOccasion, setCustomOccasion] = useState('');
  const [customPerson, setCustomPerson] = useState('');
  const [customInterest, setCustomInterest] = useState('');
  const [extraPreference, setExtraPreference] = useState('');

  if (!isOpen) return null;

  const occasions = [
    {
      id: 'birthday',
      title: 'Birthday',
      icon: Cake,
      gradient: 'from-pink-500 to-rose-500',
      description: 'Celebrate another year of joy'
    },
    {
      id: 'wedding',
      title: 'Wedding',
      icon: Star,
      gradient: 'from-blue-400 to-purple-500',
      description: 'Mark a beautiful union'
    },
    {
      id: 'Valentines',
      title: 'Valentines Day',
      icon: Lamp,
      gradient: 'from-amber-500 to-yellow-500',
      description: 'Festival of lights'
    },
    {
      id: 'BabyShower',
      title: 'Baby Shower',
      icon: Baby,
      gradient: 'from-red-500 to-pink-500',
      description: 'Celebrate your special day'
    },
   {
      id: 'anniversary',
      title: 'Anniversary',
      icon: Heart,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Celebrate your special day'
    },
      {
      id: 'MothersDay',
      title: 'Mother`s Day',
      icon: Heart,
      gradient: 'from-blue-500 to-ocean-500',
      description: 'Celebrate your special day'
    },
    {
      id: 'FathersDay',
      title: 'Fathers`s Day',
      icon: Crown,
      gradient: 'from-teal-500 to-green-500',
      description: 'Celebrate your special day'
    },
    {
      id: 'graduation',
      title: 'Graduation',
      icon: GraduationCap,
      gradient: 'from-blue-500 to-purple-500',
      description: 'Academic achievement'
    }
  ];

  const recipients = [
    {
      id: 'partner',
      title: 'Partner',
      icon: Heart,
      gradient: 'from-pink-500 to-rose-500',
      description: 'Significant other'
    },
    {
      id: 'parent',
      title: 'Parent',
      icon: Heart,
      gradient: 'from-rose-400 to-red-500',
      description: 'Mother or father'
    },
    {
      id: 'sibling',
      title: 'Sibling',
      icon: Heart,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Brother or sister'
    },
    {
      id: 'friend',
      title: 'Friend',
      icon: Smile,
      gradient: 'from-blue-400 to-indigo-500',
      description: 'Close friend'
    },
    {
      id: 'child',
      title: 'Child',
      icon: Baby,
      gradient: 'from-green-400 to-teal-500',
      description: 'Son or daughter'
    },
    {
      id: 'grandparent',
      title: 'Grandparent',
      icon: Heart,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Grandmother or grandfather'
    },
    {
      id: 'colleague',
      title: 'Colleague',
      icon: User,
      gradient: 'from-cyan-400 to-blue-500',
      description: 'Work relationship'
    },
    {
      id: 'other',
      title: 'Other',
      icon: Users,
      gradient: 'from-violet-400 to-purple-500',
      description: 'Other relationship'
    }
  ];

  const interests = [
    {
      id: 'tech',
      label: 'Technology',
      icon: Zap,
      description: 'Gadgets & innovation'
    },
    {
      id: 'art',
      label: 'Art & Design',
      icon: Palette,
      description: 'Creative pursuits'
    },
    {
      id: 'sports',
      label: 'Sports',
      icon: Award,
      description: 'Athletic activities'
    },
    {
      id: 'cooking',
      label: 'Cooking',
      icon: Flame,
      description: 'Culinary interests'
    },
    {
      id: 'music',
      label: 'Music',
      icon: Music,
      description: 'Musical interests'
    },
    {
      id: 'reading',
      label: 'Reading',
      icon: Book,
      description: 'Books & literature'
    },
    {
      id: 'travel',
      label: 'Travel',
      icon: Plane,
      description: 'Exploring places'
    },
    {
      id: 'fitness',
      label: 'Fitness',
      icon: Activity,
      description: 'Health & wellness'
    },
    {
      id: 'gaming',
      label: 'Gaming',
      icon: Gamepad,
      description: 'Video games'
    },
    {
      id: 'gardening',
      label: 'Gardening',
      icon: Flower2,
      description: 'Plants & nature'
    },
    {
      id: 'fashion',
      label: 'Fashion',
      icon: Shirt,
      description: 'Style & clothing'
    },
    {
      id: 'photography',
      label: 'Photography',
      icon: Camera,
      description: 'Taking pictures'
    }
  ];

  // Budget ranges based on region
  const getBudgetRanges = () => {
    if (region === 'IN') {
      return [
        { label: 'Basic', range: '1000-5000', display: '₹1,000-₹5,000', icon: DollarSign, gradient: 'from-green-400 to-emerald-500' },
        { label: 'Standard', range: '5000-10000', display: '₹5,000-₹10,000', icon: Gift, gradient: 'from-blue-400 to-indigo-500' },
        { label: 'Premium', range: '10000-20000', display: '₹10,000-₹20,000', icon: Star, gradient: 'from-purple-400 to-pink-500' },
        { label: 'Luxury', range: '20001', display: '₹20,001', icon: Crown, gradient: 'from-rose-400 to-red-500' }
      ];
    } else {
      return [
        { label: 'Basic', range: '1-100', display: '$1-$100', icon: DollarSign, gradient: 'from-green-400 to-emerald-500' },
        { label: 'Standard', range: '100-250', display: '$100-$250', icon: Gift, gradient: 'from-blue-400 to-indigo-500' },
        { label: 'Premium', range: '251-500', display: '$501-1000', icon: Star, gradient: 'from-purple-400 to-pink-500' },
        { label: 'Luxury', range: '1001', display: '$1001', icon: Crown, gradient: 'from-rose-400 to-red-500' }
      ];
    }
  };

  const handleSubmit = () => {
    const userInput = {
      occasion: selectedOccasion || `custom-${customOccasion}`,
      recipient: selectedPerson || `custom-${customPerson}`,
      interests: selectedInterests,
      budget,
      giftPreference,
      region,
      additionalPreferences: extraPreference.trim() || undefined
    };
    localStorage.setItem('user_input', JSON.stringify(userInput));
    navigate('/gift-suggestions');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {giftingMode === 'planned' && (
          <div className="space-y-8">
            {/* Progress Indicator */}
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
              <div className="relative flex justify-between">
                {['Occasion', 'Recipient', 'Interests', 'Budget'].map((step, index) => (
                  <div
                    key={step}
                    className={`relative flex flex-col items-center ${
                      index <= activeStep ? 'text-rose-500' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= activeStep
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="mt-2 text-sm font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="mt-8">
              {activeStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      What's the special occasion?
                    </h3>
                    <p className="text-gray-600">
                      Help us understand the celebration we're shopping for
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {occasions.map((occasion) => (
                      <button
                        key={occasion.id}
                        onClick={() => {
                          setSelectedOccasion(occasion.id);
                          setActiveStep(1);
                        }}
                        className={`group relative p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                          selectedOccasion === occasion.id 
                            ? 'ring-2 ring-rose-500 bg-rose-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${occasion.gradient} p-2.5 mx-auto mb-4 transform group-hover:scale-110 transition-transform`}>
                          <occasion.icon className="w-full h-full text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">
                          {occasion.title}
                        </h4>
                        <p className="text-sm text-gray-600 text-center">
                          {occasion.description}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <input
                      type="text"
                      value={customOccasion}
                      onChange={(e) => setCustomOccasion(e.target.value)}
                      placeholder="Or enter your own occasion..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        if (customOccasion) {
                          setSelectedOccasion(customOccasion);
                          setActiveStep(1);
                        }
                      }}
                      className="px-6 py-2 bg-gradient-to-b from-rose-300 to-purple-300 text-black rounded-lg font-medium hover:bg-gradient-to-b from-rose-300 to-purple-300 transition-colors flex items-center"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Who is this gift for?
                    </h3>
                    <p className="text-gray-600">
                      Help us understand who we're shopping for
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recipients.map((recipient) => (
                      <button
                        key={recipient.id}
                        onClick={() => {
                          setSelectedPerson(recipient.id);
                          setActiveStep(2);
                        }}
                        className={`group relative p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                          selectedPerson === recipient.id 
                            ? 'ring-2 ring-rose-500 bg-rose-50' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${recipient.gradient} p-2.5 mx-auto mb-4 transform group-hover:scale-110 transition-transform`}>
                          <recipient.icon className="w-full h-full text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">
                          {recipient.title}
                        </h4>
                        <p className="text-sm text-gray-600 text-center">
                          {recipient.description}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <input
                      type="text"
                      value={customPerson}
                      onChange={(e) => setCustomPerson(e.target.value)}
                      placeholder="Or specify another recipient..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        if (customPerson) {
                          setSelectedPerson(customPerson);
                          setActiveStep(2);
                        }
                      }}
                      className="px-6 py-2 bg-gradient-to-b from-rose-300 to-purple-300 text-black rounded-lg font-medium hover:bg-gradient-to-b from-rose-300 to-purple-300 transition-colors flex items-center"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      What are their interests?
                    </h3>
                    <p className="text-gray-600">
                      Select all interests that apply (multiple selection allowed)
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {interests.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => {
                          const newInterests = selectedInterests.includes(interest.id)
                            ? selectedInterests.filter(i => i !== interest.id)
                            : [...selectedInterests, interest.id];
                          setSelectedInterests(newInterests);
                        }}
                        className={`group relative p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                          selectedInterests.includes(interest.id)
                            ? 'ring-2 ring-rose-500 bg-rose-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-purple-500 p-2.5 mx-auto mb-4 transform group-hover:scale-110 transition-transform">
                          <interest.icon className="w-full h-full text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-800 text-center mb-2">
                          {interest.label}
                        </h4>
                        <p className="text-sm text-gray-600 text-center">
                          {interest.description}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <input
                      type="text"
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      placeholder="Add another interest..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        if (customInterest && !selectedInterests.includes(customInterest)) {
                          setSelectedInterests([...selectedInterests, customInterest]);
                          setCustomInterest('');
                        }
                      }}
                      className="px-6 py-2 bg-gradient-to-b from-rose-300 to-purple-300 text-black rounded-lg font-medium hover:bg-gradient-to-b from-rose-300 to-purple-300 transition-colors flex items-center"
                    >
                      Add
                      <Plus className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                  {selectedInterests.length > 0 && (
                    <button
                      onClick={() => setActiveStep(3)}
                      className="w-full px-6 py-2 bg-gradient-to-b from-rose-300 to-purple-300 text-black rounded-lg font-medium hover:bg-gradient-to-b from-rose-300 to-purple-300 transition-colors flex items-center justify-center"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      What's your budget range?
                    </h3>
                    <p className="text-gray-600">
                      Help us find gifts within your preferred price range
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {getBudgetRanges().map((option) => (
                        <button
                          key={option.range}
                          onClick={() => {
                            const [min] = option.range.split('-');
                            setBudget(min);
                          }}
                          className="group relative p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-10 rounded-xl group-hover:opacity-20 transition-opacity`} />
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} p-2.5 mx-auto mb-4`}>
                              <option.icon className="w-full h-full text-white" />
                            </div>
                            <div className="text-center">
                              <h4 className="font-semibold text-gray-800 mb-1">{option.label}</h4>
                              <p className="text-sm text-gray-600">{option.display}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Custom Budget</h4>
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">{currencySymbol}</span>
                            </div>
                            <input
                              type="number"
                              value={budget}
                              onChange={(e) => setBudget(e.target.value)}
                              placeholder="Enter amount"
                              className="block w-full pl-8 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-sm text-gray-500">{region === 'IN' ? 'INR' : 'USD'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Extra Preferences</h4>
                      <div className="space-y-4">
                        <textarea
                          value={extraPreference}
                          onChange={(e) => setExtraPreference(e.target.value)}
                          placeholder="Tell us more about what you're looking for... (e.g., specific colors, themes, materials, or any other preferences)"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent min-h-[100px] resize-none"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Gift Type Preference</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setGiftPreference('physical')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            giftPreference === 'physical'
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 hover:border-rose-200'
                          }`}
                        >
                          <Gift className={`w-6 h-6 mx-auto mb-2 ${
                            giftPreference === 'physical' ? 'text-rose-500' : 'text-gray-400'
                          }`} />
                          <span className="block text-sm font-medium text-center">Physical Gift</span>
                          <span className="block text-xs text-gray-500 text-center mt-1">
                            Tangible items to unwrap
                          </span>
                        </button>
                        <button
                          onClick={() => setGiftPreference('experience')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            giftPreference === 'experience'
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 hover:border-rose-200'
                          }`}
                        >
                          <Sparkles className={`w-6 h-6 mx-auto mb-2 ${
                            giftPreference === 'experience' ? 'text-rose-500' : 'text-gray-400'
                          }`} />
                          <span className="block text-sm font-medium text-center">Experience</span>
                          <span className="block text-xs text-gray-500 text-center mt-1">
                            Memorable activities & events
                          </span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={!budget}
                      className="w-full px-6 py-4 bg-gradient-to-b from-rose-300 to-purple-300 text-black rounded-xl font-semibold shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Gift className="w-5 h-5" />
                        Find Perfect Gifts
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            {activeStep > 0 && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-6 py-2 text-gray-600 hover:text-rose-500 font-medium flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back
                </button>
                {activeStep < 3 && selectedInterests.length > 0 && (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="px-6 py-2 bg-gradient-to-b from-rose-300 to-purple-300 text-black rounded-lg font-medium hover:bg-gradient-to-b from-rose-300 to-purple-300 transition-colors flex items-center"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIGuideModal;