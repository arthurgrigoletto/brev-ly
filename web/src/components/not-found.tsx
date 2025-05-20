import { Link } from '@tanstack/react-router';

export function NotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-2">
      <div className="flex w-full max-w-[580px] flex-col items-center justify-center gap-6 rounded-lg bg-white px-5 py-12 text-center md:px-16 md:py-12">
        <picture>
          <img src="/404.svg" alt="Link não encontrado" />
        </picture>
        <h3 className="font-bold text-gray-600 text-xl">Link não encontrado</h3>

        <div className="flex flex-col gap-1 text-gray-500 text-md">
          <p>
            O link que você está tentando acessar não existe, foi removido ou é
            uma URL inválida. Saiba mais em{' '}
            <Link
              to="/"
              className="text-blue-base underline transition-colors hover:text-blue-base/80"
            >
              brev.ly
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
