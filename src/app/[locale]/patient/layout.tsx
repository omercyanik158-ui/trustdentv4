import { ReactNode } from "react";
import PatientSidebar from "@/components/Dashboard/PatientSidebar";
import DashboardHeader from "@/components/Dashboard/Header";

// Note: For demonstration we are using the generic dashboard components.
// We could pass a different navigation structure to Sidebar in a real app.

export default async function PatientLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      <PatientSidebar locale={locale} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <DashboardHeader role="patient" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
