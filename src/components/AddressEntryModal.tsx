import React, { useState, useCallback, useRef } from 'react';
import { MapPin, X, Search, ArrowLeft, MapIcon } from 'lucide-react';
import { GoogleMap, Marker } from '@react-google-maps/api';

interface AddressEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: string) => void;
  initialAddress?: string;
}

interface ManualAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City

const AddressEntryModal: React.FC<AddressEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAddress = ''
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [manualAddress, setManualAddress] = useState<ManualAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    geocoder.current = new google.maps.Geocoder();

    // Initialize autocomplete after map loads
    if (autocompleteInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(autocompleteInputRef.current, {
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry?.location && place.formatted_address) {
          const newCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setMapCenter(newCenter);
          setMarkerPosition(newCenter);
          setAddress(place.formatted_address);
          setError(null);
          mapRef.current?.panTo(newCenter);
        }
      });
    }
  }, []);

  const handleSearch = () => {
    if (!address.trim()) {
      setError('Please enter an address to search');
      return;
    }

    if (geocoder.current) {
      geocoder.current.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          const location = results[0].geometry.location;
          const newCenter = {
            lat: location.lat(),
            lng: location.lng()
          };
          setMapCenter(newCenter);
          setMarkerPosition(newCenter);
          mapRef.current?.panTo(newCenter);
          setAddress(results[0].formatted_address);
          setError(null);
        } else {
          setError('Address not found. Please try again.');
        }
      });
    }
  };

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const clickedPos = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    
    setMarkerPosition(clickedPos);
    
    if (geocoder.current) {
      geocoder.current.geocode({ location: clickedPos }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          setAddress(results[0].formatted_address);
          setError(null);
        }
      });
    }
  }, []);

  const handleManualAddressChange = (field: keyof ManualAddress, value: string) => {
    setManualAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (isManualEntry) {
      const fullAddress = `${manualAddress.street}, ${manualAddress.city}, ${manualAddress.state} ${manualAddress.zipCode}`;
      if (!manualAddress.street || !manualAddress.city || !manualAddress.state || !manualAddress.zipCode) {
        setError('Please fill in all address fields');
        return;
      }
      setIsSaving(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        onSave(fullAddress);
        onClose();
      } catch (error) {
        setError('Failed to save address. Please try again.');
      } finally {
        setIsSaving(false);
      }
    } else {
      if (!address.trim()) {
        setError('Please enter an address');
        return;
      }

      setIsSaving(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        onSave(address);
        onClose();
      } catch (error) {
        setError('Failed to save address. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={onClose}
          className="group mb-8 inline-flex items-center text-gray-600 hover:text-purple-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Quick Finder
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Enter Your Address</h2>
          <p className="text-gray-600 mt-2">Search, select on map, or enter manually</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsManualEntry(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                !isManualEntry
                  ? 'bg-gradient-to-r from-rose-300 to-purple-300 text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Search & Map
            </button>
            <button
              onClick={() => setIsManualEntry(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isManualEntry
                  ? 'bg-gradient-to-r from-rose-300 to-purple-300 text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Manual Entry
            </button>
          </div>

          {!isManualEntry ? (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Search Address
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      ref={autocompleteInputRef}
                      type="text"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setError(null);
                      }}
                      className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Start typing your address..."
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-gradient-to-r from-rose-300 to-purple-300 text-black rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>

              <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={mapCenter}
                  zoom={14}
                  onClick={onMapClick}
                  onLoad={onMapLoad}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                  }}
                >
                  {markerPosition && (
                    <Marker
                      position={markerPosition}
                      animation={google.maps.Animation.DROP}
                    />
                  )}
                </GoogleMap>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                <input
                  type="text"
                  value={manualAddress.street}
                  onChange={(e) => handleManualAddressChange('street', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={manualAddress.city}
                  onChange={(e) => handleManualAddressChange('city', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={manualAddress.state}
                  onChange={(e) => handleManualAddressChange('state', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="State"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  value={manualAddress.zipCode}
                  onChange={(e) => handleManualAddressChange('zipCode', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="ZIP Code"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || (!isManualEntry && !address.trim())}
            className="w-full px-6 py-3 bg-gradient-to-r from-rose-300 to-purple-300 text-black rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save Address'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressEntryModal;