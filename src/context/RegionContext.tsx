import React, { createContext, useContext, useState, useEffect } from 'react';

export type Region = 'IN' | 'US';

interface RegionContextType {
  region: Region;
  setRegion: (region: Region) => void;
  currency: string;
  currencySymbol: string;
  marketplace: string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const regionDefaults: Record<Region, { currency: string; currencySymbol: string; marketplace: string }> = {
  IN: {
    currency: 'INR',
    currencySymbol: '₹',
    marketplace: 'amazon.in'
  },
  US: {
    currency: 'USD',
    currencySymbol: '$',
    marketplace: 'amazon.com'
  }
};

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegion] = useState<Region>('IN');
  const [currency, setCurrency] = useState(regionDefaults.IN.currency);
  const [currencySymbol, setCurrencySymbol] = useState(regionDefaults.IN.currencySymbol);
  const [marketplace, setMarketplace] = useState(regionDefaults.IN.marketplace);

  useEffect(() => {
    const savedRegion = localStorage.getItem('region') as Region;
    if (savedRegion) {
      setRegion(savedRegion);
    }
  }, []);

  useEffect(() => {
    const defaults = regionDefaults[region];
    setCurrency(defaults.currency);
    setCurrencySymbol(defaults.currencySymbol);
    setMarketplace(defaults.marketplace);
    localStorage.setItem('region', region);
  }, [region]);

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
        currency,
        currencySymbol,
        marketplace
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};