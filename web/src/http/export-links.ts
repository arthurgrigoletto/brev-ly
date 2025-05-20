import { env } from '@/env';
import { useMutation } from '@tanstack/react-query';

type ExportLinksResponse = {
  reportUrl: string;
};

async function exportLinks() {
  const response = await fetch(`${env.VITE_BACKEND_URL}/links/exports`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed exporting links');
  }

  const data: ExportLinksResponse = await response.json();

  return data;
}

export function useExportLinksMutation() {
  return useMutation({
    mutationKey: ['link', 'export'],
    mutationFn: exportLinks,
  });
}
