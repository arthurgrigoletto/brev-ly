import { env } from '@/env';
import { PER_PAGE } from '@/lib/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nanoid } from 'nanoid';
import { useQueryState } from 'nuqs';
import { getLinksQueryOptions } from './get-links';
import { toast } from "sonner"
import { ApplicationError } from './application-error';


type CreateLinkRequest = {
  originalUrl: string;
  shortUrl: string;
};

type CreateLinkResponse = {
  linkId: string;
};

async function createLink({ originalUrl, shortUrl }: CreateLinkRequest) {
  const response = await fetch(`${env.VITE_BACKEND_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ originalUrl, shortUrl }),
  });

  if (!response.ok) {
    if(response.status === 409) {
      throw new ApplicationError('Link encurtado já existe', 409);
    }

    throw new ApplicationError();
  }

  const data: CreateLinkResponse = await response.json();
  return data;
}

export function useCreateLinkMutation() {
  const queryClient = useQueryClient();
  const [page] = useQueryState('page', { defaultValue: '1' });
  const getLinksQueryKey = getLinksQueryOptions({
    page: Number(page),
    limit: PER_PAGE,
  }).queryKey;

  return useMutation({
    mutationKey: ['link'],
    mutationFn: createLink,
    async onMutate(newLink) {
      await queryClient.cancelQueries({ queryKey: getLinksQueryKey });

      const previousLinks = queryClient.getQueryData(getLinksQueryKey);

      if (previousLinks) {
        queryClient.setQueryData(getLinksQueryKey, (old) => ({
          total: old?.total ?? 0,
          links: [
            ...(old?.links ?? []),
            {
              id: nanoid(),
              accessCount: 0,
              createdAt: new Date(),
              originalUrl: newLink.originalUrl,
              shortUrl: newLink.shortUrl,
            },
          ],
        }));
      }

      return { previousLinks };
    },
    onError(error, _variables, context) {
      queryClient.setQueryData(getLinksQueryKey, context?.previousLinks);
      toast.error(error.message)
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: getLinksQueryKey });
    },
  });
}
