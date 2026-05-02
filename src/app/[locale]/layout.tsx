import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const OG_LOCALE: Record<string, string> = {
  tr: "tr_TR",
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  return {
    title: {
      default: `TrustDent | ${tNav("home")}`,
      template: "%s | TrustDent",
    },
    description: tFooter("description"),
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale] ?? "en_US",
      url: `https://trustdent.com/${locale}`,
      siteName: "TrustDent",
    },
    alternates: {
      canonical: `https://trustdent.com/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((entryLocale) => [entryLocale, `https://trustdent.com/${entryLocale}`])
      ),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} style={{ backgroundColor: "#F8F4F3" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body { background-color: #F8F4F3 !important; }
        `}} />
      </head>
      <body style={{ backgroundColor: "#F8F4F3" }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
