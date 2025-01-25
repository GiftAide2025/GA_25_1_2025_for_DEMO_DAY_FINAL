import React from 'react';
import { Globe } from 'lucide-react';
import { useRegion, Region } from '../context/RegionContext';

const RegionSelector: React.FC = () => {
  const { region, setRegion } = useRegion();

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-colors">
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium">{region === 'IN' ? 'India' : 'United States'}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 hidden group-hover:block">
        <button
          onClick={() => handleRegionChange('IN')}
          className={`w-full px-4 py-2 text-left hover:bg-rose-50 transition-colors ${
            region === 'IN' ? 'text-rose-500 bg-rose-50' : 'text-gray-700'
          }`}
        >
          India (₹)
        </button>
        <button
          onClick={() => handleRegionChange('US')}
          className={`w-full px-4 py-2 text-left hover:bg-rose-50 transition-colors ${
            region === 'US' ? 'text-rose-500 bg-rose-50' : 'text-gray-700'
          }`}
        >
          United States ($)
        </button>
      </div>
    </div>
  );
};

export default RegionSelector;