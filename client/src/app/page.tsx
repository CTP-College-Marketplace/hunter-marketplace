import "../styles/globals.css";
import ListingCard from "@/components/ListingCard";
import { getLatestListings } from "@/lib/data";

export default function HomePage() {
	const listings = getLatestListings(4);
	
	return (
		<div className="space-y-6">

			{/* HERO */}
			<section className="rounded-2xl bg-gradient-to-br from-hunter-purple to-hunter-light p-6">
				<h1 className="text-2xl font-bold tracking-tight">Hunter Student Marketplace</h1>
				<p className="mt-1 text-sm text-neutral-700">
					Buy & sell textbooks, electronics, and more — verified students only.
				</p>
			</section>

			{/* GRID */}
			<section>
				<div className="mb-3 flex items-center justify-between">
					<h2 className="text-lg font-semibold">Latest Listings</h2>
					<a
						href="/browse"
						className="rounded-full bg-hunter-purple px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90"
					>
						View all
					</a>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{listings.map((item) => (
						<ListingCard key={item.id} item={item} />
					))}
				</div>
			</section>
		</div>
	);
}

