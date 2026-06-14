"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AdminProvider, useAdmin } from "@/lib/admin-context";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: "dashboard" },
  { href: "/admin/annonces", label: "Annonces", icon: "megaphone" },
  { href: "/admin/biens", label: "Biens", icon: "building" },
  { href: "/admin/locataires", label: "Locataires", icon: "users" },
  { href: "/admin/recouvrements", label: "Recouvrements", icon: "receipt" },
  { href: "/admin/assurances", label: "Assurances", icon: "shield" },
];

function NavIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "dashboard":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "building":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "users":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "megaphone":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    case "receipt":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      );
    case "shield":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    default:
      return null;
  }
}

function ErrorBanner() {
  const { error, refreshAll } = useAdmin();
  if (!error) return null;

  return (
    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div className="flex-1">
          <p className="text-red-800 font-semibold text-sm">Problème de connexion Firebase</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <div className="mt-3 space-y-2">
            <button
              onClick={refreshAll}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium text-sm rounded-lg transition-all"
            >
              Réessayer
            </button>
            <details className="text-xs text-red-600">
              <summary className="cursor-pointer hover:text-red-800">Comment corriger ?</summary>
              <ol className="mt-2 ml-4 list-decimal space-y-1">
                <li>Allez sur <strong>console.firebase.google.com</strong></li>
                <li>Sélectionnez le projet <strong>yombal-964c8</strong></li>
                <li>Allez dans <strong>Firestore Database → Rules</strong></li>
                <li>Remplacez les règles par :</li>
              </ol>
              <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
              </pre>
              <p className="mt-2">Puis cliquez <strong>Publish</strong> et rechargez cette page.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-primary-dark flex-col fixed h-full">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
              <span className="text-primary-dark font-bold text-lg">Y</span>
            </div>
            <div>
              <p className="text-white font-bold">YOMBAL</p>
              <p className="text-white/50 text-xs">Administration</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                pathname === item.href
                  ? "bg-gold/20 text-gold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <NavIcon icon={item.icon} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              sessionStorage.removeItem("yombal_admin");
              window.location.href = "/admin";
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Déconnexion</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all w-full mt-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="font-medium">Voir le site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary-dark p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 gradient-gold rounded-lg flex items-center justify-center">
            <span className="text-primary-dark font-bold">Y</span>
          </div>
          <span className="text-white font-bold">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <aside className="w-64 bg-primary-dark h-full p-4 pt-20" onClick={(e) => e.stopPropagation()}>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    pathname === item.href
                      ? "bg-gold/20 text-gold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <NavIcon icon={item.icon} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  sessionStorage.removeItem("yombal_admin");
                  window.location.href = "/admin";
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:text-red-400 w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <ErrorBanner />
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const session = sessionStorage.getItem("yombal_admin");
    if (session === "true") setIsLoggedIn(true);
    setChecking(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === "yombal2026") {
      sessionStorage.setItem("yombal_admin", "true");
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Mot de passe incorrect");
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-dark font-bold text-2xl">Y</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin YOMBAL</h1>
            <p className="text-foreground/60 mt-2">Connectez-vous pour gérer l&apos;agence</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                placeholder="Entrez le mot de passe"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 gradient-gold text-primary-dark font-bold rounded-xl hover:opacity-90 transition-all"
            >
              Se connecter
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-foreground/50 hover:text-gold">
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
