import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustDent",
  description: "Türkiye'nin lider diş sağlığı turizm platformu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
