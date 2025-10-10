"use client";

import { useMemo, useState } from "react";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";
import { getAllListings } from "@/lib/data";

const ALL_CATEGORIES = ["Textbooks", "Electronics", "Furniture", "Services"] as const;


export default function ListingsPage() {
  const listings = getAllListings();
  
  // toolbar state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<"" | "new" | "low" | "high">("new");

  // derived list (filter + sort)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = listings.filter((l) => {
      const matchesText =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.location ?? "").toLowerCase().includes(q);
      const matchesCat = !category || l.category === category;
      return matchesText && matchesCat;
    });

    out = out.sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      // "new" (default): newest first by datePosted
      const ad = Date.parse(a.datePosted!);
      const bd = Date.parse(b.datePosted!);
      return bd - ad;
    });

    return out;
  }, [listings, search, category, sort]);

  return (
    <div className="py-8">
      {/* header + CTA */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Browse Listings</h1>
          <p className="text-sm text-gray-400">Filter by search, category, and sort order.</p>
        </div>
        <Link
          href="/post"
          className="rounded-full bg-hunter-purple px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
        >
          Post a Listing
        </Link>
      </div>

      {/* toolbar */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items… (e.g., textbook, laptop)"
          className="rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy outline-none focus:ring-2 focus:ring-hunter-purple/50"
        >
          <option value="">All categories</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "" | "new" | "low" | "high")}
          className="rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy outline-none focus:ring-2 focus:ring-hunter-purple/50"
        >
          <option value="new">Newest</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </div>

      {/* empty state */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/80 p-6 text-center text-hunter-navy">
          No results. Try adjusting your filters.
        </div>
      )}

      {/* grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
