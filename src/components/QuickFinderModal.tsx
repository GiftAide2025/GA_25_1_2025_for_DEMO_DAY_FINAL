import React, { useState } from 'react';
import { MapPin, Search, Store, X, Gift, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddressEntryModal from './AddressEntryModal';

interface QuickFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickFinderModal: React.FC<QuickFinderModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [giftName, setGiftName] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSavedLocation = () => {
    try {
      const savedLocationData = localStorage.getItem('saved_location');
      if (savedLocationData) {
        const { address, timestamp } = JSON.parse(savedLocationData);
        // Check if the saved location is less than 24 hours old
        const now = new Date().getTime();
        const savedTime = new Date(timestamp).getTime();
        const hoursDiff = (now - savedTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          setLocation(address);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking saved location:', error);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!location) {
      setError('Please enter your location first');
      return;
    }

    if (!giftName) {
      setError('Please enter what gift you are looking for');
      return;
    }

    navigate(`/check-nearby?location=${encodeURIComponent(location)}&gift=${encodeURIComponent(giftName)}`);
  };

  const handleNotSure = () => {
  //  if (!location && !checkSavedLocation()) {
   if (!location) {
      setError('Please enter your location first');
      return;
    }
    setError(null);
    //navigate('/quick-gift-decide');
    navigate('/quick-gift-decide?location=${encodeURIComponent(location)}');
  };

  const handleAddressSelect = (address: string) => {
    setLocation(address);
    setError(null);

    // Save location to local storage
    try {
      const locationData = {
        address: address,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('saved_location', JSON.stringify(locationData));
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Quick Gift Finder</h2>
            <p className="text-gray-600 mt-2">Find the perfect gift nearby</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700">Your Location</span>
                <div className="mt-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={location}
                    readOnly
                    onClick={() => setIsAddressModalOpen(true)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 cursor-pointer"
                    placeholder="Click to enter your location"
                  />
                </div>
              </label>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">What gift are you looking for?</span>
                  <div className="mt-1 relative">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={giftName}
                      onChange={(e) => {
                        setGiftName(e.target.value);
                        setError(null);
                      }}
                      className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                      placeholder="Enter gift name or description"
                    />
                  </div>
                </label>

                {error && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-rose-300 to-purple-300 text-black rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find Nearby Stores
                </button>

                <button
                  type="button"
                  onClick={handleNotSure}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-300 to-rose-300 text-black rounded-lg hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  <HelpCircle className="w-5 h-5" />
                  Not sure? Let us help you find the perfect gift
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AddressEntryModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleAddressSelect}
        initialAddress={location}
      />
    </>
  );
};

export default QuickFinderModal;