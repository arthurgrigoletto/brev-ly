import { Copy } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function CopyButton({ content }: { content: string }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (isPopoverOpen) {
      setTimeout(() => setIsPopoverOpen(false), 1500);
    }
  }, [isPopoverOpen]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => navigator.clipboard.writeText(content)}
        >
          <Copy />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-fit border-none bg-blue-dark p-2 font-semibold text-sm text-white"
      >
        Copiado
      </PopoverContent>
    </Popover>
  );
}
