"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function NotFound() {
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{tCommon("notFoundTitle")}</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        {tCommon("notFoundDescription")}
      </p>
      <Link
        href={`/${locale}`}
        className="px-6 py-3 bg-[#BC0A18] text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
      >
        {tNav("home")}
      </Link>
    </div>
  );
}
