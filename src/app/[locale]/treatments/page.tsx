"use client";

import Treatments from "@/components/Treatments/Treatments";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function TreatmentsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px", minHeight: "80vh" }}>
        <Treatments scrollAnimated={false} />
      </main>
      <Footer />
    </>
  );
}
