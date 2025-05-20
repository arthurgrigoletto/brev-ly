import { env } from '@/env';
import { PER_PAGE } from '@/lib/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { getLinksQueryOptions } from './get-links';

type DeleteLinkRequest = {
  linkId: string;
};

async function deleteLink({ linkId }: DeleteLinkRequest) {
  await fetch(`${env.VITE_BACKEND_URL}/links/${linkId}`, {
    method: 'DELETE',
  });
}

export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();
  const [page, setPage] = useQueryState('page', { defaultValue: '1' });
  const getLinksQueryKey = getLinksQueryOptions({
    page: Number(page),
    limit: PER_PAGE,
  }).queryKey;

  return useMutation({
    mutationKey: ['link', 'delete'],
    mutationFn: deleteLink,
    async onMutate({ linkId }) {
      await queryClient.cancelQueries({ queryKey: getLinksQueryKey });

      const previousLinks = queryClient.getQueryData(getLinksQueryKey);

      if (previousLinks) {
        const newLinks = previousLinks.links.filter(
          (link) => link.id !== linkId
        );

        queryClient.setQueryData(getLinksQueryKey, () => ({
          total: newLinks.length,
          links: newLinks,
        }));

        if (Math.ceil(newLinks.length / PER_PAGE) <= 1) {
          setPage('1');
        }
      }

      return { previousLinks };
    },
    onError(_error, _variables, context) {
      queryClient.setQueryData(getLinksQueryKey, context?.previousLinks);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: getLinksQueryKey });
    },
  });
}
