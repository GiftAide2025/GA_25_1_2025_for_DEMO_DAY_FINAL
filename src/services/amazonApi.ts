import axios, { AxiosError } from 'axios';

export interface ProductData {
  title: string;
  imageUrl: string;
  error?: string;
}

const api = axios.create({
  baseURL: 'https://real-time-amazon-data.p.rapidapi.com/search',
  headers: {
    'X-RapidAPI-Key': '3660004e22mshe557c00ce8603b0p18cfcfjsnc7a6f249dd0',
    'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
  }
});

export const searchProduct = async (query: string): Promise<ProductData> => {
  try {
    const response = await api.get('', {
      params: {
        query,
        country: 'US',
        category_id: 'aps'
      }
    });

    // Get only the first product
    const firstProduct = response.data?.data?.products?.[0];
    if (firstProduct) {
      return {
        title: firstProduct.product_title || firstProduct.title || query,
        imageUrl: firstProduct.product_photo || firstProduct.thumbnail || ''
      };
    }
    
    return {
      title: query,
      imageUrl: '',
      error: 'No matching products found in Amazon catalog'
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 429) {
        return {
          title: query,
          imageUrl: '',
          error: 'Amazon API rate limit exceeded. Please try again in a moment.'
        };
      }
      if (error.response?.status === 403) {
        return {
          title: query,
          imageUrl: '',
          error: 'Access to Amazon API denied. Please check API credentials.'
        };
      }
      if (error.response?.status === 404) {
        return {
          title: query,
          imageUrl: '',
          error: 'Product search endpoint not found. Please check API configuration.'
        };
      }
      return {
        title: query,
        imageUrl: '',
        error: `Amazon API Error: ${error.response?.data?.message || error.message}`
      };
    }
    return {
      title: query,
      imageUrl: '',
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    };
  }
};