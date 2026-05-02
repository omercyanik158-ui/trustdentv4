import { getTranslations } from "next-intl/server";

export default async function LocaleLoading() {
  const tCommon = await getTranslations("common");
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
      <div className="animate-pulse text-sm text-gray-500">{tCommon("loading")}</div>
    </div>
  );
}
