import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Treatments from "@/components/Treatments/Treatments";
import Clinics from "@/components/Clinics/Clinics";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import MapSection from "@/components/MapSection/MapSection";
import Testimonials from "@/components/Testimonials/Testimonials";
import Footer from "@/components/Footer/Footer";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return {
    title: "TrustDent | Türkiye'de Diş Sağlığı Turizmi",
    description: t("subtitle"),
  };
}

export default async function HomePage({ params }: Props) {
  await params;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Treatments />
        <HowItWorks />
        <Clinics />
        <MapSection />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
