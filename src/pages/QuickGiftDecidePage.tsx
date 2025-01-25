import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Heart, Gift, MessageSquare, 
  ArrowRight, Plus, Save, Calendar, User,
  Star, Baby, Briefcase, Users, Music, Palette, Gamepad,
  Book, Plane, Dumbbell, Camera, Coffee,
  Home, ShoppingBag, Sparkles, X
} from 'lucide-react';
import FindPerfectGiftModal from '../components/FindPerfectGiftModal';

interface Step {
  title: string;
  description: string;
}

const QuickGiftDecidePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'identify' | 'chat'>('identify');
  const [currentStep, setCurrentStep] = useState(0);
  const [occasion, setOccasion] = useState('');
  const [customOccasion, setCustomOccasion] = useState('');
  const [recipient, setRecipient] = useState('');
  const [customRecipient, setCustomRecipient] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [giftPreference, setGiftPreference] = useState<'physical' | 'experience'>('physical');
  const [budget, setBudget] = useState('');
  const [age, setAge] = useState(''); // Age state
  const [additionalPreferences, setAdditionalPreferences] = useState('');
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

  const handleBackToQuickFinder = () => {
    navigate('/quick-finder');
  };

  const handleCrossClick = () => {
    navigate('/dashboard');
    setIsGiftModalOpen(true);
  };

  const steps: Step[] = [
    {
      title: 'Occasion',
      description: 'What are we celebrating?'
    },
    {
      title: 'Recipient',
      description: 'Who is this gift for?'
    },
    {
      title: 'Interests',
      description: 'What do they like?'
    },
    {
      title: 'Details',
      description: 'Additional preferences'
    }
  ];

  const occasions = [
    { id: 'Birthday', icon: Gift, gradient: 'from-pink-500 to-rose-500' },
    { id: 'Anniversary', icon: Heart, gradient: 'from-red-500 to-pink-500' },
    { id: 'Wedding', icon: Heart, gradient: 'from-purple-500 to-indigo-500' },
    { id: 'Graduation', icon: Star, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'Holiday', icon: Gift, gradient: 'from-green-500 to-emerald-500' },
    { id: 'Thank You', icon: Sparkles, gradient: 'from-yellow-500 to-amber-500' },
    { id: 'Just Because', icon: Heart, gradient: 'from-rose-500 to-purple-500' }
  ];

  const recipients = [
    { id: 'Partner', icon: Heart, gradient: 'from-red-500 to-pink-500' },
    { id: 'Parent', icon: User, gradient: 'from-blue-500 to-indigo-500' },
    { id: 'Sibling', icon: Users, gradient: 'from-green-500 to-teal-500' },
    { id: 'Friend', icon: Star, gradient: 'from-purple-500 to-pink-500' },
    { id: 'Child', icon: Baby, gradient: 'from-yellow-500 to-orange-500' },
    { id: 'Colleague', icon: Briefcase, gradient: 'from-cyan-500 to-blue-500' },
    { id: 'Other Family', icon: Users, gradient: 'from-rose-500 to-purple-500' }
  ];

  const interestCategories = [
    { id: 'Technology', icon: Gift, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'Art', icon: Palette, gradient: 'from-purple-500 to-pink-500' },
    { id: 'Sports', icon: Dumbbell, gradient: 'from-green-500 to-emerald-500' },
    { id: 'Music', icon: Music, gradient: 'from-rose-500 to-red-500' },
    { id: 'Reading', icon: Book, gradient: 'from-yellow-500 to-amber-500' },
    { id: 'Cooking', icon: Coffee, gradient: 'from-orange-500 to-red-500' },
    { id: 'Travel', icon: Plane, gradient: 'from-cyan-500 to-blue-500' },
    { id: 'Fashion', icon: ShoppingBag, gradient: 'from-pink-500 to-rose-500' },
    { id: 'Gaming', icon: Gamepad, gradient: 'from-purple-500 to-indigo-500' },
    { id: 'Photography', icon: Camera, gradient: 'from-blue-500 to-violet-500' },
    { id: 'Home Decor', icon: Home, gradient: 'from-teal-500 to-green-500' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveCustomOccasion = () => {
    if (customOccasion.trim()) {
      setOccasion(customOccasion);
      setCustomOccasion('');
    }
  };

  const handleSaveCustomRecipient = () => {
    if (customRecipient.trim()) {
      setRecipient(customRecipient);
      setCustomRecipient('');
    }
  };

  const handleSaveCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest)) {
      setInterests([...interests, customInterest]);
      setCustomInterest('');
    }
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleFindGifts = () => {
    const userInput = {
      occasion: occasion || `custom-${customOccasion}`,
      recipient: recipient || `custom-${customRecipient}`,
      interests: interests,
      budget: budget,
      giftPreference,
      additionalPreferences,
      age // Include age in user input
    };
    localStorage.setItem('user_input', JSON.stringify(userInput));
    navigate('/quick-gift-suggestions');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBackToQuickFinder}
            className="group inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors"
          >
            <ArrowRight className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Quick Finder
          </button>
          <button
            onClick={handleCrossClick}
            className="p-2 text-gray-400 hover:text-rose-500 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Let's Find Your Perfect Gift</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We'll help you discover the ideal gift through a series of simple questions about the recipient and occasion.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('identify')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'identify'
                  ? 'bg-gradient-to-r from-rose-300 to-purple-300 text-black shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                Identify Your Gift
              </div>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-rose-300 to-purple-300 text-black shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                GiftChat
              </div>
            </button>
          </div>

          {activeTab === 'identify' ? (
            <div className="space-y-8">
              {/* Progress Steps */}
              <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
                <div className="relative flex justify-between">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`relative flex flex-col items-center ${
                        index <= currentStep ? 'text-purple-500' : 'text-gray-400'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= currentStep
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="mt-2 text-sm font-medium">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-gray-600">{steps[currentStep].description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {occasions.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setOccasion(item.id)}
                        className={`group p-4 rounded-xl border-2 transition-all duration-300 ${
                          occasion === item.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 transform group-hover:scale-110 transition-transform`}>
                          <item.icon className="w-full h-full text-white" />
                        </div>
                        <span className="text-sm font-medium">{item.id}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={customOccasion}
                      onChange={(e) => setCustomOccasion(e.target.value)}
                      placeholder="Or enter custom occasion..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSaveCustomOccasion}
                      className="px-4 py-2 bg-gradient-to-r from-rose-300 to-purple-300 text-black rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-gray-600">{steps[currentStep].description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recipients.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setRecipient(item.id)}
                        className={`group p-4 rounded-xl border-2 transition-all duration-300 ${
                          recipient === item.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 transform group-hover:scale-110 transition-transform`}>
                          <item.icon className="w-full h-full text-white" />
                        </div>
                        <span className="text-sm font-medium">{item.id}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={customRecipient}
                      onChange={(e) => setCustomRecipient(e.target.value)}
                      placeholder="Or enter custom recipient..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSaveCustomRecipient}
                      className="px-4 py-2 bg-gradient-to-r from-rose-300 to-purple-300 text-black rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-gray-600">{steps[currentStep].description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {interestCategories.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => toggleInterest(item.id)}
                        className={`group p-4 rounded-xl border-2 transition-all duration-300 ${
                          interests.includes(item.id)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${item.gradient} p-2.5 transform group-hover:scale-110 transition-transform`}>
                          <item.icon className="w-full h-full text-white" />
                        </div>
                        <span className="text-sm font-medium">{item.id}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      placeholder="Or enter custom interest..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSaveCustomInterest}
                      className="px-4 py-2 bg-gradient-to-r from-rose-300 to-purple-300 text-black rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-gray-600">{steps[currentStep].description}</p>
                  
                  <div className="space-y-6">
                    {/* Age Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient's Age (Optional)
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter age"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gift Preference
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setGiftPreference('physical')}
                          className={`group p-4 rounded-xl border-2 transition-all duration-300 ${
                            giftPreference === 'physical'
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-purple-500 to-rose-500 p-2.5 transform group-hover:scale-110 transition-transform">
                            <Gift className="w-full h-full text-white" />
                          </div>
                          <span className="text-sm font-medium">Physical Gift</span>
                        </button>
                        <button
                          onClick={() => setGiftPreference('experience')}
                          className={`group p-4 rounded-xl border-2 transition-all duration-300 ${
                            giftPreference === 'experience'
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-rose-500 to-purple-500 p-2.5 transform group-hover:scale-110 transition-transform">
                            <Sparkles className="w-full h-full text-white" />
                          </div>
                          <span className="text-sm font-medium">Experience</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Enter budget amount"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Preferences
                      </label>
                      <textarea
                        value={additionalPreferences}
                        onChange={(e) => setAdditionalPreferences(e.target.value)}
                        placeholder="Any other preferences or requirements..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handleBack}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    currentStep === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-purple-500'
                  }`}
                  disabled={currentStep === 0}
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Back
                  </div>
                </button>
                
                <button
                  onClick={currentStep === steps.length - 1 ? handleFindGifts : handleNext}
                  className="px-6 py-2 bg-gradient-to-r from-rose-300 to-purple-300 text-black rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? 'Find Gifts' : 'Next'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">GiftChat Coming Soon</h2>
              <p className="text-gray-600">
                Our AI-powered chat assistant will be here to help you find the perfect gift.
              </p>
            </div>
          )}
        </div>
      </div>

      <FindPerfectGiftModal 
        isOpen={isGiftModalOpen} 
        onClose={() => {
          setIsGiftModalOpen(false);
          navigate('/dashboard');
        }} 
      />
    </div>
  );
};

export default QuickGiftDecidePage;