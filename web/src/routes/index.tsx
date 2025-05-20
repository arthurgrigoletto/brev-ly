import { CreateLinkForm } from '@/components/create-link-form';
import { LinkList } from '@/components/link-list';
import { Button } from '@/components/ui/button';
import { useExportLinksMutation } from '@/http/export-links';
import { useLinks } from '@/http/get-links';
import { downloadUrl } from '@/lib/utils';
import { DownloadSimple } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  const linksQuery = useLinks();
  const exportLinksMutation = useExportLinksMutation();

  async function handleExportLinks() {
    try {
      const { reportUrl } = await exportLinksMutation.mutateAsync();

      downloadUrl(reportUrl);
    } catch {
      console.error('Error exporting links');
    }
  }

  return (
    <div className="container mx-auto flex flex-col px-4 pt-6 pb-16 md:pt-20">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
        <picture className="flex justify-center md:justify-start">
          <img src="/logo.svg" alt="brev.ly" className="h-6 w-24" />
        </picture>
        <div className="flex w-full flex-col gap-3 md:flex-row">
          <div className="flex w-full flex-col gap-6 rounded-lg bg-white p-6 md:w-96 md:self-start md:p-8">
            <h3 className="font-bold text-gray-600 text-lg">Novo link</h3>
            <CreateLinkForm />
          </div>
          <div className="flex h-fit w-full flex-col gap-5 rounded-lg bg-white p-6 md:w-[580px] md:p-8">
            <div className="flex items-center justify-between border-b border-b-gray-200 pb-4">
              <h3 className="font-bold text-gray-600 text-lg">Meus links</h3>
              <Button
                variant="secondary"
                disabled={
                  linksQuery.isLoading || linksQuery.data?.links.length === 0
                }
                size="sm"
                onClick={handleExportLinks}
              >
                <DownloadSimple className="size-4" />
                Baixar CSV
              </Button>
            </div>
            <LinkList />
          </div>
        </div>
      </div>
    </div>
  );
}
