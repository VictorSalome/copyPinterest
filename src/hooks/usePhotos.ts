'use client'

import { useState, useEffect, useCallback } from 'react';
import { getPhotos, UnsplashPhoto } from '@/lib/api';

export function usePhotos(query?: string) {
  const [data, setData] = useState<UnsplashPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getPhotos(page, query);
      
      setData(prev => [...prev, ...response.data]);
      setHasMore(response.totalPages ? page < response.totalPages : true);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, [query]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return {
    data,
    isLoading,
    error,
    hasMore,
    loadMore
  };
}