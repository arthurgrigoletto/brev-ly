import { useCreateLinkMutation } from '@/http/create-link';
import { slugify } from '@/lib/utils';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Warning } from '@phosphor-icons/react';

const linkSchema = z.object({
  originalUrl: z.string().url({ message: 'Informe uma URL válida' }),
  shortedUrl: z
    .string()
    .min(1, { message: 'Link encurtado é obrigatório'})
    .regex(/^[a-z0-9]+$/, { 
      message: 'Informe uma url minúscula e sem espaço/caracter especial' 
    }),
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
              <div className='flex flex-col gap-2'>
                <Label
                  htmlFor={field.name}
                  className="uppercase"
                  aria-invalid={field.state.meta.errors.length >= 1}
                >
                  link original
                </Label>
                <Input
                  aria-invalid={field.state.meta.errors.length >= 1}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="www.exemplo.com.br"
                />
                {!field.state.meta.isValid && (
                  <div className='inline-flex gap-2'>
                    <Warning className='size-4 text-danger'/>
                    <span role="alert" className='text-gray-500 text-sm'>
                      {field.state.meta.errors.at(0)?.message}
                    </span>
                  </div>
                )}
              </div>
            );
          }}
        />
        <form.Field
          name="shortedUrl"
          // biome-ignore lint/correctness/noChildrenProp: <explanation>
          children={(field) => {
            return (
              <div className='flex flex-col gap-2'>
                <Label
                  htmlFor={field.name}
                  className="uppercase"
                  aria-invalid={field.state.meta.errors.length >= 1}
                >
                  link encurtado
                </Label>
                <div className='relative'>
                  <Input
                    id={field.name}
                    className='peer ps-13'
                    aria-invalid={field.state.meta.errors.length >= 1}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <span
                    className="text-gray-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50"
                  >
                    brev.ly/
                  </span>
                </div>
                {!field.state.meta.isValid && (
                  <div className='inline-flex gap-2'>
                    <Warning className='size-4 text-danger'/>
                    <span role="alert" className='text-gray-500 text-sm'>
                      {field.state.meta.errors.at(0)?.message}
                    </span>
                  </div>
                )}
              </div>
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
        children={({ isSubmitting }) => (
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar link'}
          </Button>
        )}
      />
    </form>
  );
}
