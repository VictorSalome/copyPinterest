import axios from 'axios';

const BASE_URL = 'https://api.unsplash.com';
const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`
  }
});

export interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  likes: number;
}

export async function getPhotos(page = 1, query?: string) {
  try {
    const endpoint = query ? '/search/photos' : '/photos';
    const url = new URL(endpoint, BASE_URL);
    
    url.searchParams.append('page', String(page));
    url.searchParams.append('per_page', '20');
    if (query) url.searchParams.append('query', query);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }

    const data = await response.json();
    return {
      data: query ? data.results : data,
      totalPages: query ? Math.ceil(data.total / 20) : null,
    };
  } catch {
    throw new Error('Failed to fetch photos');
  }
}