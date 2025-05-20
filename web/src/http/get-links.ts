import { env } from '@/env';
import { PER_PAGE } from '@/lib/constants';
import type { Pagination } from '@/types/pagination';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';

export type Link = {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
}

type GetLinksResponse = {
  links: Link[];
  total: number;
};

async function fetchLinks({
  limit,
  page,
  signal,
}: Pagination & { signal: AbortSignal }) {
  const response = await fetch(
    `${env.VITE_BACKEND_URL}/links?pageSize=${limit}&page=${page}`,
    {
      method: 'GET',
      signal,
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }

  const data: GetLinksResponse = await response.json();
  return data;
}

export function getLinksQueryOptions({ limit = 4, page = 1 }: Pagination) {
  return queryOptions({
    queryKey: ['links'],
    queryFn: async ({ signal }) => fetchLinks({ limit, page, signal }),
  });
}

export function useLinks() {
  const queryClient = useQueryClient();
  const [page] = useQueryState('page', { defaultValue: '1' });

  useEffect(() => {
    queryClient.prefetchQuery(
      getLinksQueryOptions({ limit: PER_PAGE, page: Number(page) })
    );
  }, [page, queryClient]);

  return useQuery({
    ...getLinksQueryOptions({ page: Number(page), limit: PER_PAGE }),
    placeholderData: (previousData) => previousData,
  });
}
