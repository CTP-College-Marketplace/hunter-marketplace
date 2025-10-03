import "../styles/globals.css";
import ListingCard, { Listing } from "@/components/ListingCard";

const listings: Listing[] = [
	{
		id: "1",
		title: "CSCI 135 Textbook (Good Condition)",
		price: 25,
		category: "Textbooks",
		imageUrl:
			"https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
		location: "Hunter West",
		condition: "good",
	},
	{
		id: "2",
		title: "Dell XPS 13 (2019)",
		price: 350,
		category: "Electronics",
		imageUrl:
			"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
		location: "Upper East Side",
		condition: "like new",
	},
	{
		id: "3",
		title: "Dorm Mini-Fridge",
		price: 70,
		category: "Furniture",
		imageUrl:
			"https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		location: "Student Housing",
		condition: "fair",
	},
	{
		id: "4",
		title: "Calculus Tutoring (1hr)",
		price: 30,
		category: "Services",
		imageUrl:
			"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		location: "Library",
	},
];

export default function HomePage() {
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
						href="/listings"
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

