import { ReactNode } from "react";
import AdminSidebar from "@/components/Dashboard/AdminSidebar";
import DashboardHeader from "@/components/Dashboard/Header";

// Note: In a real app, this would be a different Sidebar configured for Admins.
// For now, we will use the same Sidebar but you could pass a role prop to it.

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      <AdminSidebar locale={locale} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <DashboardHeader role="admin" />
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
