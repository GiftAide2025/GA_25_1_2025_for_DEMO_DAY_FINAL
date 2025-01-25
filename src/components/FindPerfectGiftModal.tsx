import React from 'react';
import { Brain, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FindPerfectGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FindPerfectGiftModal: React.FC<FindPerfectGiftModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAIGuidedExperience = () => {
    navigate('/ai-guide');
    onClose();
  };

  const handleQuickFinder = () => {
    navigate('/quick-finder');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Find the Perfect Gift</h2>
          <p className="text-gray-600 mt-2">Let's make someone's day special</p>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-8">
          <h3 className="text-lg text-gray-700">How would you like to discover the perfect gift?</h3>
          <p className="text-sm text-gray-500">Choose your gifting journey and let us guide you to the ideal present</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI-Guided Experience */}
          <button
            onClick={handleAIGuidedExperience}
            className="group relative bg-white p-6 rounded-xl border-2 border-rose-100 hover:border-rose-200 transition-all duration-300 text-left"
          >
            <div className="mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                <Brain className="w-6 h-6 text-rose-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Guided Experience</h3>
            <p className="text-gray-600 text-sm">
              Let our AI help you discover the perfect gift based on personality, interests, and occasion
            </p>
            <div className="mt-4 flex items-center text-rose-500 text-sm font-medium">
              Start Journey
              <Zap className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Quick Finder */}
          <button
            onClick={handleQuickFinder}
            className="group relative bg-white p-6 rounded-xl border-2 border-purple-100 hover:border-purple-200 transition-all duration-300 text-left"
          >
            <div className="mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Zap className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Finder</h3>
            <p className="text-gray-600 text-sm">
              Find nearby stores and get instant gift suggestions for last-minute shopping
            </p>
            <div className="mt-4 flex items-center text-purple-500 text-sm font-medium">
              Find Nearby
              <Zap className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindPerfectGiftModal;