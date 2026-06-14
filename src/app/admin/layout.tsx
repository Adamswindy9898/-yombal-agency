import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - YOMBAL",
  description: "Panneau d'administration de l'agence YOMBAL",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
