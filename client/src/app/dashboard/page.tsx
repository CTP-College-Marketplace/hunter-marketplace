"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  getListingsForSeller,
  getPurchasesForBuyer,
  type ListingWithDate,
  type Purchase,
} from "@/lib/data";

type DashboardState = {
  listings: ListingWithDate[];
  purchases: Purchase[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardState | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Supabase error:", error.message);
        setLoading(false);
        return;
      }

      const session = data.session;

      if (!session || !session.user?.email) {
        router.replace("/login?callback=/dashboard");
        return;
      }

      const userEmail = session.user.email;
      setEmail(userEmail);

      const listings = getListingsForSeller(userEmail);
      const purchases = getPurchasesForBuyer(userEmail);

      setDashboard({ listings, purchases });
      setLoading(false);
    })();
  }, [router]);

  if (loading || !dashboard) {
    return (
      <div className="mx-auto max-w-2xl text-center text-gray-300">
        Loading your dashboard…
      </div>
    );
  }

  const { listings, purchases } = dashboard;

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Hero / intro card */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-hunter-purple/40 via-hunter-navy/70 to-black/70 p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-200/80">
          View your listings, keep track of your purchases, and create new posts
          for other Hunter students.
        </p>
        {email && (
          <p className="mt-3 text-xs sm:text-sm text-gray-300/70">
            Signed in as{" "}
            <span className="font-medium text-gray-100">{email}</span>
          </p>
        )}
      </section>

      {/* Main content: listings + purchases */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
        {/* Your Listings card */}
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-7 shadow-soft backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                Your Listings
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Manage items you&apos;re selling to other students.
              </p>
            </div>
            {listings.length > 0 && (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-200 border border-white/10">
                {listings.length} active
              </span>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-gray-300 space-y-3">
              <p>You don&apos;t have any listings yet.</p>
              <p className="text-xs text-gray-400">
                Start by creating a listing so other students can see what
                you&apos;re selling.
              </p>
              <Link
                href="/post"
                className="inline-flex items-center justify-center rounded-full bg-hunter-purple px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:opacity-90"
              >
                + Create your first listing
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listings/${listing.id}`}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-hunter-purple/60 hover:bg-white/10 transition-colors"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] uppercase tracking-wide text-gray-400">
                        {listing.category}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(listing.datePosted).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="font-medium text-sm sm:text-base line-clamp-2">
                      {listing.title}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      {listing.location && <span>{listing.location}</span>}
                      <span className="text-sm font-semibold text-hunter-purple">
                        ${listing.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Button now lives UNDER the listings section */}
              <div className="pt-1">
                <Link
                  href="/post"
                  className="inline-flex items-center justify-center rounded-full bg-hunter-purple px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:opacity-90"
                >
                  + Create new listing
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Your Purchases card */}
        <div className="rounded-3xl border border-white/10 bg-black/35 p-6 sm:p-7 shadow-soft backdrop-blur-sm space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                Your Purchases
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Keep track of items you&apos;ve bought and find new deals.
              </p>
            </div>
          </div>

          {purchases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-gray-300 space-y-3">
              <p>No purchases yet.</p>
              <p className="text-xs text-gray-400">
                When you buy items through the marketplace, they&apos;ll show up
                here for easy reference.
              </p>
              {/* Button that takes them back to Browse page */}
              <Link
                href="/browse"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-white/10"
              >
                Browse listings
              </Link>
            </div>
          ) : (
            <>
              <ul className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10">
                {purchases.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-4"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {p.listingTitle}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Bought on{" "}
                        {new Date(p.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        from {p.sellerName}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-hunter-purple">
                      ${p.price}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pt-1">
                <Link
                  href="/browse"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-white/10"
                >
                  Browse more items
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}