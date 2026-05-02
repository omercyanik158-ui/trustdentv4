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
  return (
    <html style={{ backgroundColor: "#F8F4F3" }}>
      <head>
        <style>{`*, *::before, *::after { box-sizing: border-box; } html, body { background-color: #F8F4F3 !important; margin: 0; padding: 0; }`}</style>
      </head>
      <body style={{ backgroundColor: "#F8F4F3", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}

