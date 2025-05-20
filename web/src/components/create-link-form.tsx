import { useCreateLinkMutation } from '@/http/create-link';
import { slugify } from '@/lib/utils';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const linkSchema = z.object({
  originalUrl: z.string().min(1),
  shortedUrl: z.string().min(1),
});

export function CreateLinkForm() {
  const createLinkMutation = useCreateLinkMutation();
  const form = useForm({
    defaultValues: {
      originalUrl: '',
      shortedUrl: '',
    },
    validators: {
      onChange: linkSchema,
      onSubmit: linkSchema,
    },
    onSubmit: ({ value, formApi }) => {
      createLinkMutation.mutate({
        originalUrl: value.originalUrl,
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        shortUrl: slugify(value.shortedUrl)!,
      });

      formApi.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <form.Field
          name="originalUrl"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => {
            return (
              <>
                <Label htmlFor={field.name} className="uppercase">
                  link original
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="www.exemplo.com.br"
                />
              </>
            );
          }}
        />
        <form.Field
          name="shortedUrl"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => {
            return (
              <>
                <Label htmlFor={field.name} className="uppercase">
                  link encurtado
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="brev.ly/"
                />
              </>
            );
          }}
        />
      </div>
      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
          isDirty: !state.isDefaultValue,
        })}
        // biome-ignore lint/correctness/noChildrenProp: <explanation>
        children={({ canSubmit, isSubmitting, isDirty }) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!isDirty || !canSubmit || isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar link'}
          </Button>
        )}
      />
    </form>
  );
}
