import { ReactNode } from "react";
import DoctorSidebar from "@/components/Dashboard/DoctorSidebar";
import DashboardHeader from "@/components/Dashboard/Header";

export default async function DoctorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      <DoctorSidebar locale={locale} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <DashboardHeader role="doctor" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
