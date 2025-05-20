import type * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-12 w-full min-w-0 rounded-lg border border-gray-300 bg-transparent px-4 py-1 text-md shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-gray-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-blue-base',
        'aria-invalid:border-danger aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40',
        className
      )}
      {...props}
    />
  );
}

export { Input };
