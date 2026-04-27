import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "TrustDent | Türkiye'de Diş Sağlığı Turizmi",
    template: "%s | TrustDent",
  },
  description:
    "TrustDent ile Türkiye'nin en iyi diş kliniklerini keşfedin. Onaylı doktorlar, uygun fiyatlar, kolayrandevu sistemi. İmplant, veneer, beyazlatma ve daha fazlası.",
  keywords: ["diş turizmi", "dental tourism turkey", "istanbul implant", "diş kliniği", "dental clinic turkey"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://trustdent.com",
    siteName: "TrustDent",
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
