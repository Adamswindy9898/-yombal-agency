"use client";

import { useState } from "react";

interface Props {
  images: string[];
  alt: string;
  type: string;
}

export default function ImageGallery({ images, alt, type }: Props) {
  const [current, setCurrent] = useState(0);
  const validImages = images.filter((img) => !img.startsWith("/images/"));

  if (validImages.length === 0) {
    return (
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-3">
            {type === "appartement" && "🏢"}
            {type === "chambre" && "🛏️"}
            {type === "studio" && "🏠"}
            {type === "magasin" && "🏪"}
            {type === "terrain" && "🏗️"}
          </div>
          <span className="text-primary/50">Photos à venir</span>
        </div>
      </div>
    );
  }

  const prev = () => setCurrent((c) => (c === 0 ? validImages.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === validImages.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden h-80 bg-gray-100">
        <img
          src={validImages[current]}
          alt={`${alt} - photo ${current + 1}`}
          className="w-full h-full object-cover"
        />
        {validImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
              {current + 1} / {validImages.length}
            </div>
          </>
        )}
      </div>
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                i === current ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Miniature ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
