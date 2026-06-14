"use client";

import { useEffect, useRef, useState } from "react";

export default function QRCodeCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("qrcode").then((QRCode) => {
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, "https://yombal-agency.vercel.app", {
          width: 200,
          margin: 2,
          color: { dark: "#1e3a5f", light: "#ffffff" },
        });
        setReady(true);
      }
    });
  }, []);

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head><title>QR Code - YOMBAL</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;">
          <h1 style="color:#1e3a5f;margin-bottom:10px;">YOMBAL</h1>
          <p style="color:#666;margin-bottom:20px;">Agence Immobilière & Assurance - Thiès</p>
          <img src="${dataUrl}" width="250" height="250" />
          <p style="margin-top:15px;color:#888;font-size:14px;">Scannez pour visiter notre site</p>
          <p style="color:#d4a843;font-weight:bold;">yombal-agency.vercel.app</p>
          <script>setTimeout(()=>window.print(),500)</script>
        </body>
      </html>
    `);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "QRCode_YOMBAL.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-4">QR Code du site</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <canvas ref={canvasRef} className="rounded-xl border border-border" />
        <div className="space-y-3">
          <p className="text-foreground/60 text-sm">
            Imprimez ce QR code sur vos cartes de visite ou affiches. Les clients scannent et arrivent directement sur le site.
          </p>
          {ready && (
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimer
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 border border-border text-foreground/70 font-medium rounded-lg hover:bg-muted transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
