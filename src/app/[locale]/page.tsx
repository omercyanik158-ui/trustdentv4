import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import Treatments from "@/components/Treatments/Treatments";
import Footer from "@/components/Footer/Footer";

const HowItWorks = dynamic(() => import("@/components/HowItWorks/HowItWorks"));
const Clinics = dynamic(() => import("@/components/Clinics/Clinics"));
const MapSection = dynamic(() => import("@/components/MapSection/MapSection"));
const Testimonials = dynamic(() => import("@/components/Testimonials/Testimonials"));

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
