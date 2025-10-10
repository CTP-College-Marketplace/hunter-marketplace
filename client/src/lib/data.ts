// Centralized data source for all listings
// This will eventually be replaced with Supabase database calls

export type Listing = {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl: string;
  location?: string;
  condition?: "new" | "like new" | "good" | "fair";
  description?: string;
  sellerName?: string;
  sellerEmail?: string;
  datePosted?: string;
  contactMethod?: string;
};

export type ListingWithDate = Listing & { 
  datePosted: string; 
};

// Single source of truth for all listings
export const ALL_LISTINGS: ListingWithDate[] = [
  {
    id: "1",
    title: "CSCI 135 Textbook (Good Condition)",
    price: 25,
    category: "Textbooks",
    imageUrl: "https://picsum.photos/seed/book/800/600",
    location: "Hunter West",
    condition: "good",
    description: "Introduction to Computer Science textbook. Barely used, no highlights or markings. Perfect for CSCI 135 course.",
    sellerName: "Alex Chen",
    sellerEmail: "alex.chen@hunter.cuny.edu",
    datePosted: "2025-09-20T10:00:00.000Z",
    contactMethod: "email",
  },
  {
    id: "2", 
    title: "Dell XPS 13 (2019)",
    price: 350,
    category: "Electronics",
    imageUrl: "https://picsum.photos/seed/laptop/800/600",
    location: "Upper East Side",
    condition: "like new",
    description: "Excellent condition Dell XPS 13 laptop. Great for programming and school work. Includes charger and original box.",
    sellerName: "Maria Rodriguez",
    sellerEmail: "maria.rodriguez@hunter.cuny.edu", 
    datePosted: "2025-09-27T18:30:00.000Z",
    contactMethod: "email",
  },
  {
    id: "3",
    title: "Dorm Mini-Fridge", 
    price: 70,
    category: "Furniture",
    imageUrl: "https://picsum.photos/seed/fridge/800/600",
    location: "Student Housing",
    condition: "fair",
    description: "Compact mini-fridge perfect for dorms. Works great, just some cosmetic wear. Great deal for students!",
    sellerName: "Jordan Kim",
    sellerEmail: "jordan.kim@hunter.cuny.edu",
    datePosted: "2025-09-22T13:45:00.000Z", 
    contactMethod: "email",
  },
  {
    id: "4",
    title: "Graphing Calculator TI-84",
    price: 40,
    category: "Electronics", 
    imageUrl: "https://picsum.photos/seed/calculator/800/600",
    location: "Library",
    description: "TI-84 Plus CE graphing calculator. Barely used, includes case and batteries. Required for many math courses.",
    sellerName: "Sam Wilson",
    sellerEmail: "sam.wilson@hunter.cuny.edu",
    datePosted: "2025-09-29T02:15:00.000Z",
    contactMethod: "email",
  },
  {
    id: "5",
    title: "IKEA Desk (like new)",
    price: 55,
    category: "Furniture",
    imageUrl: "https://picsum.photos/seed/desk/800/600", 
    location: "Dorms",
    condition: "like new",
    description: "Clean white IKEA desk perfect for studying. Easy to assemble, includes all hardware. Moving out sale!",
    sellerName: "Taylor Brown",
    sellerEmail: "taylor.brown@hunter.cuny.edu",
    datePosted: "2025-09-25T08:10:00.000Z",
    contactMethod: "email",
  },
  {
    id: "6",
    title: "Stats Tutoring (1hr)",
    price: 30,
    category: "Services",
    imageUrl: "https://picsum.photos/seed/study/800/600",
    location: "North Building", 
    description: "Statistics tutoring session. I'm a senior math major with experience helping students understand difficult concepts. Can meet in library or virtually.",
    sellerName: "Chris Lee",
    sellerEmail: "chris.lee@hunter.cuny.edu",
    datePosted: "2025-09-24T16:00:00.000Z",
    contactMethod: "email",
  },
];

// Helper functions
export function getListingById(id: string): ListingWithDate | undefined {
  return ALL_LISTINGS.find(listing => listing.id === id);
}

export function getLatestListings(count: number = 4): ListingWithDate[] {
  return ALL_LISTINGS
    .sort((a, b) => new Date(b.datePosted!).getTime() - new Date(a.datePosted!).getTime())
    .slice(0, count);
}

export function getAllListings(): ListingWithDate[] {
  return ALL_LISTINGS;
}
