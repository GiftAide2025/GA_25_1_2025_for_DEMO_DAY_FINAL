import axios from 'axios';

const API_KEY = 'AIzaSyBFMQsIdE4E8m2dWDspX2TjiH70wnMh3pI';
const SEARCH_ENGINE_ID = '666db8f0dedde425f';

export interface GoogleSearchResult {
  title: string;
  imageUrl: string;
  error?: string;
}

export const searchProductImage = async (query: string): Promise<GoogleSearchResult> => {
  try {
    // Enhance search query for better product images
    const enhancedQuery = `${query} product photo`;

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(enhancedQuery)}&searchType=image&num=10&imgSize=huge`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch results');
    }

    const data = await response.json();
    console.log('API Response:', data); // Debug log

    if (data.items?.length > 0) {
      // Find the image with the highest resolution
      const highestResResult = data.items.reduce((highest: any, current: any) => {
        const currentWidth = parseInt(current.pagemap?.imageobject?.[0]?.width || '0');
        const currentHeight = parseInt(current.pagemap?.imageobject?.[0]?.height || '0');
        const highestWidth = parseInt(highest.pagemap?.imageobject?.[0]?.width || '0');
        const highestHeight = parseInt(highest.pagemap?.imageobject?.[0]?.height || '0');
        
        const currentRes = currentWidth * currentHeight;
        const highestRes = highestWidth * highestHeight;
        
        return currentRes > highestRes ? current : highest;
      }, data.items[0]);

      console.log('Selected Result:', highestResResult); // Debug log

      if (highestResResult.link) {
        return {
          title: highestResResult.title || query,
          imageUrl: highestResResult.link
        };
      }
    }

    console.log('Search returned no results:', query);
    return {
      title: query,
      imageUrl: '',
      error: 'No product images found'
    };

  } catch (error) {
    console.error('Google Search API Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('403')) {
        return {
          title: query,
          imageUrl: '',
          error: 'API access denied'
        };
      }

      if (error.message.includes('429')) {
        return {
          title: query,
          imageUrl: '',
          error: 'API quota exceeded'
        };
      }

      return {
        title: query,
        imageUrl: '',
        error: error.message
      };
    }

    return {
      title: query,
      imageUrl: '',
      error: 'Unknown error occurred'
    };
  }
};