"use client";

import { useState } from "react";

interface Props {
  title: string;
  text: string;
  url: string;
}

export default function ShareButton({ title, text, url }: Props) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined" ? window.location.origin + url : url;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, text, url: fullUrl });
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + fullUrl)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 text-foreground/70 font-medium transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Partager
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 text-foreground/70 font-medium transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        {copied ? "Copié !" : "Copier lien"}
      </button>
    </div>
  );
}
