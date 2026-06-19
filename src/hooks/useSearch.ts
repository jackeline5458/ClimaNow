// ============================================================
// useSearch.ts — hook de busca de cidades com debounce
// ============================================================

'use client';

import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchCities } from '@/services/geocodingApi';
import type { GeocodingResult } from '@/types/weather.types';

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: GeocodingResult[];
  isSearching: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  clearSearch: () => void;
}

/**
 * Hook de busca de cidades com debounce e cache via React Query
 */
export function useSearch(): UseSearchReturn {
  const [query, setQueryRaw] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q);
    setIsOpen(q.length >= 2);

    // Debounce de 350ms
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(q);
    }, 350);
  }, []);

  const clearSearch = useCallback(() => {
    setQueryRaw('');
    setDebouncedQuery('');
    setIsOpen(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['search', debouncedQuery],
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60 * 60 * 1000, // 1 hora
    queryFn: () => searchCities(debouncedQuery),
  });

  return {
    query,
    setQuery,
    results,
    isSearching: isFetching,
    isOpen: isOpen && debouncedQuery.length >= 2,
    setIsOpen,
    clearSearch,
  };
}
