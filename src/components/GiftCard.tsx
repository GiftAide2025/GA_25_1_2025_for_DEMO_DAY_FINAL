import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { useRegion } from '../context/RegionContext';
import { searchProductImage } from '../services/googleSearch';

interface GiftCardProps {
  suggestion: {
    name: string;
    description: string;
  };
  giftPreference: 'physical' | 'experience';
}

const GiftCard: React.FC<GiftCardProps> = ({ suggestion, giftPreference }) => {
  const { region, marketplace } = useRegion();
  const gradient = 'from-rose-300 to-purple-300';
  const [productImage, setProductImage] = useState<string>('');
  const [imageError, setImageError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductImage = async () => {
      try {
        setIsLoading(true);
        const result = await searchProductImage(suggestion.name);
        if (result.error) {
          setImageError(result.error);
        } else if (result.imageUrl) {
          setProductImage(result.imageUrl);
        }
      } catch (error) {
        setImageError('Failed to load product image');
        console.error('Error fetching product image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductImage();
  }, [suggestion.name]);

  const handleGetOnline = () => {
    if (giftPreference === 'physical') {
      window.open(`https://www.${marketplace}/s?k=${encodeURIComponent(suggestion.name)}`, '_blank');
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(suggestion.name)}`, '_blank');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-4px] h-full flex flex-col">
      <div className={`bg-gradient-to-r ${gradient} px-4 py-3`}>
        <h3 className="text-lg font-bold text-gray-600 text-center">
          {suggestion.name}
        </h3>
      </div>

      {/* Product Image Section with Improved Framing */}
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-rose-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : productImage ? (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img
              src={productImage}
              alt={suggestion.name}
              className="w-full h-full object-contain object-center"
              onError={() => setImageError('Failed to load image')}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm text-center p-4">
            {imageError || 'No product image available'}
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-sm text-gray-600 leading-relaxed flex-1">
          {suggestion.description}
        </p>

        <button 
          onClick={handleGetOnline}
          className={`mt-4 px-4 py-2 bg-gradient-to-r ${gradient} text-black text-sm rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]`}
        >
          <ExternalLink className="w-4 h-4" />
          Get it Online
        </button>
      </div>
    </div>
  );
};

export default GiftCard;