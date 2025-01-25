import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Gift, Navigation, ExternalLink, Store, Star } from 'lucide-react';

interface NearbyStore {
  name: string;
  address: string;
  distance: string;
  rating?: number;
  mapUrl: string;
}

const CheckNearbyPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const gift = searchParams.get('gift');
  const [stores, setStores] = useState<NearbyStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchNearbyStores = async () => {
      if (!location || !gift) {
        setError('Location and product information are required');
        setLoading(false);
        return;
      }

      try {
        // Check if Google Maps is loaded
        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API not loaded');
        }

        // Initialize Google Places service
        const mapDiv = document.createElement('div');
        const map = new google.maps.Map(mapDiv);
        const placesService = new google.maps.places.PlacesService(map);
        const geocoder = new google.maps.Geocoder();
        
        // First, geocode the location to get coordinates
        const geocodeResult = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode({ address: location }, (results, status) => {
            if (status === 'OK' && results) {
              resolve(results);
            } else {
              reject(new Error('Failed to geocode location'));
            }
          });
        });

        const locationCoords = geocodeResult[0].geometry.location;

        // Search for relevant stores
        const searchTypes = ['shopping_mall', 'store', 'department_store', 'electronics_store', 'home_goods_store'];
        const nearbyStores: NearbyStore[] = [];

        for (const type of searchTypes) {
          const request = {
            location: locationCoords,
            radius: 5000, // 5km radius
            type: type,
            keyword: gift
          };

          try {
            const results = await new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
              placesService.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                  resolve(results);
                } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                  resolve([]);
                } else {
                  reject(new Error(`Places search failed with status: ${status}`));
                }
              });
            });

            // Process results
            for (const place of results) {
              if (place.geometry?.location && place.name && place.vicinity) {
                const distance = google.maps.geometry.spherical.computeDistanceBetween(
                  locationCoords,
                  place.geometry.location
                );

                const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(location)}&destination=${encodeURIComponent(place.vicinity)}${place.place_id ? `&destination_place_id=${place.place_id}` : ''}`;

                nearbyStores.push({
                  name: place.name,
                  address: place.vicinity,
                  distance: `${(distance / 1000).toFixed(1)} km`,
                  rating: place.rating,
                  mapUrl: mapUrl
                });
              }
            }
          } catch (searchError) {
            console.error(`Error searching for ${type}:`, searchError);
            // Continue with other types even if one fails
          }
        }

        // Sort by distance and remove duplicates
        const uniqueStores = Array.from(new Map(nearbyStores.map(store => [store.name, store])).values());
        const sortedStores = uniqueStores.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        
        setStores(sortedStores);
        setLoading(false);

        if (sortedStores.length === 0) {
          setError('No stores found nearby. Try expanding your search or changing the product description.');
        }
      } catch (error) {
        console.error('Error searching for stores:', error);
        setError(error instanceof Error ? error.message : 'Failed to search for nearby stores. Please try again.');
        setLoading(false);
      }
    };

    searchNearbyStores();
  }, [location, gift]);

  const handleBackToQuickFinder = () => {
    navigate('/quick-finder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-purple-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={handleBackToQuickFinder}
          className="group mb-8 inline-flex items-center text-gray-600 hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Quick Finder
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <Store className="w-12 h-12 text-purple-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Nearby Stores
            </h1>

            <div className="space-y-6 mb-8">
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-purple-500 mt-1" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Location</h2>
                    <p className="text-gray-600">{location || 'No location specified'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <Gift className="w-6 h-6 text-purple-500 mt-1" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Product</h2>
                    <p className="text-gray-600">{gift || 'No product specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching for nearby stores...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={handleBackToQuickFinder}
                  className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {stores.map((store, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{store.name}</h3>
                        <p className="text-gray-600 mb-2">{store.address}</p>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center text-purple-500">
                            <Navigation className="w-4 h-4 mr-1" />
                            {store.distance}
                          </span>
                          {store.rating && (
                            <span className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 mr-1" />
                              {store.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      <a
                        href={store.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Get Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckNearbyPage;