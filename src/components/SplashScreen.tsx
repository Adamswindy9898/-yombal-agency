"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone;

    if (!isStandalone) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => setFadeOut(true), 1500);
    const remove = setTimeout(() => setShow(false), 2000);
    return () => {
      clearTimeout(timer);
      clearTimeout(remove);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#1e3a5f] transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center animate-pulse">
        <div className="w-24 h-24 rounded-2xl bg-[#d4a843] flex items-center justify-center mx-auto mb-6">
          <span className="text-[#1e3a5f] font-bold text-5xl">Y</span>
        </div>
        <h1 className="text-white text-3xl font-bold">YOMBAL</h1>
        <p className="text-white/60 mt-2">Immobilier & Assurance</p>
      </div>
    </div>
  );
}
