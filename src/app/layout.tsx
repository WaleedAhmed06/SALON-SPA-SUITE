import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Maison | Salon & Spa ERP",
  description: "A connected salon and wellness management experience",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
