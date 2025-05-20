import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const downloadUrl = async (url: string) => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();

    const link = document.createElement('a');

    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const segments = pathname
      .split('/')
      .filter((segment) => segment.length > 0);
    const filename = segments.length > 0 ? segments[segments.length - 1] : null;

    if (!filename) {
      throw new Error('URL does not contain a valid filename');
    }

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading the file', error);
  }
};

export const cleanString = (value?: string | null) => {
  if (!value) {
    return value;
  }

  const cleanValue = value
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z]+/g, ''); // Removes non-words

  if (cleanValue.length === 0) {
    return null;
  }

  return cleanValue;
};

export const slugify = (value?: string | null) => {
  const cleanValue = cleanString(value);
  if (!cleanValue) {
    return cleanValue;
  }

  const slugText = cleanValue
    .replace(/\s+/g, '-') // Removes whitespace
    .replace(/_/g, '-') // Replace underlines
    .replace(/--+/g, '-') // Replace doble hyphens
    .replace(/-$/g, ''); // Remove hyphen at the end

  return slugText;
};
