"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/demoAuth";


type NewListing = {
  title: string;
  price: number | "";
  category: string;
  imageUrl: string;
  location: string;
  condition: "new" | "like new" | "good" | "fair" | "";
  description: string;
};

const CATEGORIES = ["Textbooks", "Electronics", "Furniture", "Services"] as const;
const CONDITIONS = ["new", "like new", "good", "fair"] as const;

export default function PostPage() {
  const router = useRouter();

  // TODO: replace with real auth check later
  const [logged, setLogged] = useState(false);
  useEffect(() => {
    setLogged(isLoggedIn());
  }, []);


  const [form, setForm] = useState<NewListing>({
    title: "",
    price: "",
    category: "",
    imageUrl: "",
    location: "",
    condition: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // quick validation
  const errors = useMemo(() => {
    const e: Partial<Record<keyof NewListing, string>> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (form.price === "" || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (!form.category) e.category = "Pick a category";
    // Allow either a chosen file OR a direct image URL
    if (!file && !form.imageUrl.trim()) e.imageUrl = "Image is required";
    if (!form.location.trim()) e.location = "Where to meet or pick up?";
    if (!form.condition) e.condition = "Select condition";
    if (form.description.trim().length < 10) e.description = "Tell buyers a bit more (10+ chars)";
    return e;
  }, [form, file]);

  const hasErrors = Object.keys(errors).length > 0;

  const handleChange =
    <K extends keyof NewListing>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = key === "price" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value;
      setForm((f) => ({ ...f, [key]: value as NewListing[K] }));
    };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hasErrors) return;

    try {
      setSubmitting(true);

      // If a file was chosen, upload to Azure and get a public URL
      let imageUrl = form.imageUrl.trim();
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        imageUrl = data.url as string;
      }

      const payload = {
        ...form,
        imageUrl,
        price: Number(form.price),
        datePosted: new Date().toISOString(),
        id: crypto.randomUUID(),
      };
      console.log("Submitting listing:", payload);

      // fake network delay
      await new Promise((r) => setTimeout(r, 600));

      setSubmittedId(payload.id);
      // reset the form
      setForm({
        title: "",
        price: "",
        category: "",
        imageUrl: "",
        location: "",
        condition: "",
        description: "",
      });
      setFile(null);

      // navigate to Browse after a moment (optional)
      setTimeout(() => router.push("/browse"), 800);
    } finally {
      setSubmitting(false);
    }
  }

  if (!logged) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/10 p-6 text-white">
      <h1 className="text-xl font-display font-bold">Post a Listing</h1>
      <p className="mt-2 text-sm text-gray-300">
        You need to be signed in to post.{" "}
        <Link
          href="/login?callback=/post"
          className="text-hunter-purple underline underline-offset-4"
        >
          Log in
        </Link>{" "}
        to continue.
      </p>
    </div>
  );
}

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-display font-bold text-white">Post a Listing</h1>
      <p className="mb-6 text-sm text-gray-400">
        Fill in the details below. Listings are visible to Hunter students.
      </p>

      {submittedId && (
        <div className="mb-6 rounded-xl border border-hunter-purple/30 bg-hunter-purple/15 px-4 py-3 text-sm text-white">
          ✅ Listing submitted! Redirecting to Browse…
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-200">Title</label>
          <input
            value={form.title}
            onChange={handleChange("title")}
            placeholder="e.g., CSCI 135 Textbook (Good Condition)"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
          />
          {errors.title && <p className="mt-1 text-xs text-red-300">{errors.title}</p>}
        </div>

        {/* Row: Price + Category */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-200">Price ($)</label>
            <input
              type="number"
              min={0}
              step="1"
              value={form.price}
              onChange={handleChange("price")}
              placeholder="25"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
            />
            {errors.price && <p className="mt-1 text-xs text-red-300">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Category</label>
            <select
              value={form.category}
              onChange={handleChange("category")}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy outline-none focus:ring-2 focus:ring-hunter-purple/50"
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-300">{errors.category}</p>}
          </div>
        </div>

        {/* Row: Image Upload + Location */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-200">Listing Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
            />
            {!file && errors.imageUrl && <p className="mt-1 text-xs text-red-300">{errors.imageUrl}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Location</label>
            <input
              value={form.location}
              onChange={handleChange("location")}
              placeholder="e.g., Hunter West, Library, Dorms"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
            />
            {errors.location && <p className="mt-1 text-xs text-red-300">{errors.location}</p>}
          </div>
        </div>

        {/* Row: Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-200">Condition</label>
          <select
            value={form.condition}
            onChange={handleChange("condition")}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy outline-none focus:ring-2 focus:ring-hunter-purple/50"
          >
            <option value="">Select condition…</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.condition && <p className="mt-1 text-xs text-red-300">{errors.condition}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-200">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            rows={5}
            placeholder="Add details like condition, included accessories, when/where to meet, etc."
            className="mt-1 w-full resize-y rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
          />
          {errors.description && <p className="mt-1 text-xs text-red-300">{errors.description}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/listings"
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || hasErrors}
            className="rounded-full bg-hunter-purple px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Posting…" : "Post Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
