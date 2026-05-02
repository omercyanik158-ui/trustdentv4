"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { reportError } from "@/lib/observability";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const tCommon = useTranslations("common");
  useEffect(() => {
    reportError(error, "locale-error-boundary");
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{tCommon("error")}</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        {tCommon("errorDescription")}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-[#BC0A18] text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
      >
        {tCommon("retry")}
      </button>
    </div>
  );
}
