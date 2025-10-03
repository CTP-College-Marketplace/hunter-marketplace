"use client";

import { useState } from "react";
import Image from "next/image";

export type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  location?: string;
  condition?: "new" | "like new" | "good" | "fair";
};

export default function ListingCard({ item }: { item: Listing }) {
  // track current src, fallback to /placeholder.png if image fails
  const [src, setSrc] = useState(item.imageUrl);

  return (
    <article
      className="
        group overflow-hidden rounded-2xl border border-white/10
        bg-white text-hunter-navy shadow-soft transition
        hover:shadow-card
        dark:bg-[#1c1a2f] dark:text-gray-100
      "
    >
      {/* image */}
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={src}
          alt={item.title}
          fill
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          className="object-cover transition group-hover:scale-[1.02]"
          priority={false}
          onError={() => setSrc("https://picsum.photos/seed/book/800/600")} // 👈 fallback
        />
        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
          {item.category}
        </span>
      </div>

      {/* body */}
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-1 text-sm text-hunter-light font-medium">{item.title}</h3>

        <div className="flex items-center justify-between">
          <p className="text-base text-white font-semibold">
            <span className="rounded-md bg-hunter-purple px-1.5 py-0.5 text-hunter-light">
              ${item.price}
            </span>
          </p>
          {item.location && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {item.location}
            </p>
          )}
        </div>

        {item.condition && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Condition: {item.condition}
          </p>
        )}
      </div>
    </article>
  );
}
