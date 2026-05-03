import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const Hero = dynamic(() => import("@/components/Hero/Hero"));
const Treatments = dynamic(() => import("@/components/Treatments/Treatments"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks/HowItWorks"));
const Clinics = dynamic(() => import("@/components/Clinics/Clinics"));
const MapSection = dynamic(() => import("@/components/MapSection/MapSection"));
const Testimonials = dynamic(() => import("@/components/Testimonials/Testimonials"));

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tHero = await getTranslations({ locale, namespace: "hero" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return {
    title: `TrustDent | ${tNav("home")}`,
    description: tHero("subtitle"),
  };
}

export default async function HomePage({ params }: Props) {
  await params;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Treatments scrollAnimated={false} />
        <HowItWorks />
        <Clinics />
        <MapSection />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
