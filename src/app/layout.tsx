import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YOMBAL - Agence Immobilière & Assurance | Thiès",
  description:
    "Agence YOMBAL à Thiès, Keur Issa. Immobilier : appartements, chambres, studios, magasins, terrains. Assurances auto, cyclomoteurs, taxis.",
  keywords:
    "immobilier thiès, location appartement thiès, assurance auto thiès, terrain à vendre thiès, YOMBAL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
