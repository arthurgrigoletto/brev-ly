import { env } from '@/env';
import { useDeleteLinkMutation } from '@/http/delete-link';
import { useLinks, type Link } from '@/http/get-links';
import { Link as LinkIcon, Trash } from '@phosphor-icons/react';
import { useQueryState } from 'nuqs';
import { CopyButton } from './copy-button';
import { Button } from './ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import {} from './ui/popover';
import { Skeleton } from './ui/skeleton';

export function LinkList() {
  const linksQuery = useLinks();
  const deleteLinkMutation = useDeleteLinkMutation();
  const [page, setPage] = useQueryState('page', { defaultValue: '1' });

  const pageQuantity = Math.ceil((linksQuery.data?.total ?? 0) / 4);

  function handleDeleteLink(link: Link) {
    if(confirm(`Voce realmente quer apagar o link ${link.shortUrl}?`)) {
      deleteLinkMutation.mutate({ linkId: link.id })
    }
  }

  if (linksQuery.isLoading) {
    return Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="flex w-full items-center justify-between gap-4 not-last:border-b border-b-gray-200 pb-4"
      >
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24 md:w-32" />
          <Skeleton className="h-4 w-32 md:w-48" />
        </div>
        <Skeleton className="h-6 w-14 md:h-10 md:w-32" />
      </div>
    ));
  }

  if (linksQuery.data?.links.length === 0) {
    return (
      <div className="flex h-full min-h-28 w-full flex-col items-center justify-center gap-4">
        <div className="flex h-full w-full flex-col items-center justify-center gap-3">
          <LinkIcon className="size-8 text-gray-400" />
          <span className="text-gray-500 text-xs uppercase">
            ainda não existem links cadastrados
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4">
      {linksQuery.data?.links.map((link) => (
        <div
          key={link.id}
          className="flex w-full items-center justify-between not-last:border-b border-b-gray-200 pb-4"
        >
          <div className="flex max-w-[117px] flex-col gap-1 md:max-w-none">
            <span className="truncate font-semibold text-blue-base text-md">
              {env.VITE_FRONTEND_URL}/{link.shortUrl}
            </span>
            <span className="truncate text-gray-500 text-sm">
              {link.originalUrl}
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-5">
            <span className="whitespace-nowrap text-gray-500 text-sm">
              {link.accessCount} acessos
            </span>
            <div className="flex items-center gap-1">
              <CopyButton
                content={`${env.VITE_FRONTEND_URL}/${link.shortUrl}`}
              />

              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleDeleteLink(link)}
              >
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      ))}
      {pageQuantity > 1 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (Number(page) > 1) {
                    setPage((Number(page) - 1).toString());
                  }
                }}
              />
            </PaginationItem>
            {new Array(pageQuantity).fill(null).map((_, i) => (
              <PaginationItem key={`pagination-item-${i + 1}`}>
                <PaginationLink
                  isActive={Number(page) === i + 1}
                  onClick={() => setPage((i + 1).toString())}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (Number(page) < pageQuantity) {
                    setPage((Number(page) + 1).toString());
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
