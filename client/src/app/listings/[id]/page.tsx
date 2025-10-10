"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { isLoggedIn } from "@/lib/demoAuth";
import { getListingById } from "@/lib/data";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;
  
  const [showContact, setShowContact] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const listing = getListingById(listingId);
  const loggedIn = typeof window !== "undefined" ? isLoggedIn() : false;

  if (!listing) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Listing Not Found</h1>
        <p className="text-gray-400 mb-6">The listing you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link 
          href="/browse"
          className="inline-block rounded-full bg-hunter-purple px-6 py-2 text-white font-semibold hover:opacity-90 transition"
        >
          Browse All Listings
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back button */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to listings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              {isFavorited ? '❤️ Saved' : '🤍 Save'}
            </button>
            
            <button
              onClick={() => setShowContact(!showContact)}
              className="flex-1 py-3 px-4 rounded-xl font-semibold bg-hunter-purple text-white hover:opacity-90 transition"
            >
              Contact Seller
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-hunter-purple/20 px-3 py-1 text-sm text-hunter-purple font-medium">
                {listing.category}
              </span>
              {listing.condition && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                  {listing.condition}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">{listing.title}</h1>
            <p className="text-2xl font-bold text-hunter-purple">${listing.price}</p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
            <p className="text-gray-300 leading-relaxed">{listing.description}</p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white">{listing.location}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white">Posted {formatDate(listing.datePosted!)}</span>
            </div>
          </div>

          {/* Seller info */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Seller</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-hunter-purple flex items-center justify-center">
                <span className="text-white font-semibold">
                  {listing.sellerName?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{listing.sellerName || 'Unknown Seller'}</p>
                <p className="text-sm text-gray-400">Hunter Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-hunter-navy rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Contact {listing.sellerName}</h3>
              <button 
                onClick={() => setShowContact(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {loggedIn ? (
              <div className="space-y-4">
                <p className="text-gray-300">
                  You can contact {listing.sellerName} about &quot;{listing.title}&quot;
                </p>
                <div className="space-y-2">
                  <a 
                    href={`mailto:${listing.sellerEmail}?subject=Hunter Marketplace: ${listing.title}`}
                    className="block w-full py-3 px-4 bg-hunter-purple text-white rounded-xl text-center font-semibold hover:opacity-90 transition"
                  >
                    📧 Send Email
                  </a>
                  <p className="text-xs text-gray-400 text-center">
                    This will open your email app
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-300">
                  Please log in to contact sellers
                </p>
                <Link 
                  href={`/login?callback=${encodeURIComponent(`/listings/${listingId}`)}`}
                  className="block w-full py-3 px-4 bg-hunter-purple text-white rounded-xl text-center font-semibold hover:opacity-90 transition"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
