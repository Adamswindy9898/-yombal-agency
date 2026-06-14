import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import RegisterSW from "./components/RegisterSW";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1e40af",
};

export const metadata: Metadata = {
  title: "YOMBAL - Agence Immobilière & Assurance | Thiès",
  description:
    "Agence YOMBAL à Thiès, Keur Issa. Immobilier : appartements, chambres, studios, magasins, terrains. Assurances auto, cyclomoteurs, taxis.",
  keywords:
    "immobilier thiès, location appartement thiès, assurance auto thiès, terrain à vendre thiès, YOMBAL",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YOMBAL",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-512x512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
