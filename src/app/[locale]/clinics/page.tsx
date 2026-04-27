"use client";

import Clinics from "@/components/Clinics/Clinics";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function ClinicsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px", minHeight: "80vh" }}>
        <Clinics />
      </main>
      <Footer />
    </>
  );
}
