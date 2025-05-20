type RedirectProps = {
  redirectTo?: string | null;
};

export function Redirect({ redirectTo }: RedirectProps) {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-2">
      <div className="flex w-full max-w-[580px] flex-col items-center justify-center gap-6 rounded-lg bg-white px-16 py-12 text-center">
        <picture>
          <img src="/logo-icon.svg" alt="Link não encontrado" />
        </picture>
        <h3 className="animate-pulse font-bold text-gray-600 text-xl">
          Redirecionando...
        </h3>

        <div className="flex flex-col gap-1 text-gray-500 text-md">
          <p>O link será aberto automaticamente em alguns instantes.</p>
          {redirectTo && (
            <p>
              Não foi redirecionado?{' '}
              <a
                href={redirectTo}
                target="_self"
                className="text-blue-base underline transition-colors hover:text-blue-base/80"
                rel="noreferrer"
              >
                Acesse aqui
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
