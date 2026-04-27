'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Bir şeyler yanlış gitti!</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Üzgünüz, bir hata oluştu. Lütfen sayfayı yenilemeyi deneyin.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-[#1e3b30] text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
