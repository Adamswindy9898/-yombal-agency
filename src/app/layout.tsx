import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import RegisterSW from "./components/RegisterSW";
import SplashScreen from "@/components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1e40af",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://yombal-agency.vercel.app"),
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
  openGraph: {
    title: "YOMBAL - Agence Immobilière & Assurance | Thiès",
    description:
      "Location appartements, chambres, studios, terrains et assurance auto à Thiès. Contactez-nous sur WhatsApp.",
    url: "https://yombal-agency.vercel.app",
    siteName: "YOMBAL",
    locale: "fr_SN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YOMBAL - Agence Immobilière & Assurance à Thiès",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YOMBAL - Agence Immobilière & Assurance | Thiès",
    description:
      "Location appartements, chambres, studios, terrains et assurance auto à Thiès.",
    images: ["/og-image.png"],
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
        <SplashScreen />
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
