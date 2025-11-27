"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Condition = "new" | "like new" | "good" | "fair";

type FormState = {
  title: string;
  price: string;
  category: string;
  location: string;
  condition: Condition | "";
  description: string;
  contactMethod: string;
  imageUrl: string;
};

export default function PostPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    title: "",
    price: "",
    category: "",
    location: "",
    condition: "",
    description: "",
    contactMethod: "email",
    imageUrl: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 🔒 Only logged-in users can access /post
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Supabase auth error:", error.message);
        setCheckingAuth(false);
        setError("There was a problem checking your login status.");
        return;
      }

      const session = data.session;

      if (!session || !session.user?.email) {
        router.replace("/login?callback=/dashboard");
        return;
      }

      setUserEmail(session.user.email);
      setCheckingAuth(false);
    })();
  }, [router]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Upload image to /api/upload (Azure)
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed");
      }

      const data = await res.json();
      const url = data.url as string | undefined;

      if (!url) throw new Error("No URL returned from upload");

      setForm((prev) => ({ ...prev, imageUrl: url }));
      setSuccess("Image uploaded successfully.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Image upload failed.";
      console.error("Upload error:", err);
      setError(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.title.trim()) {
      setError("Please enter a title for your listing.");
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      setError("Please enter a valid price.");
      return;
    }
    if (!form.category) {
      setError("Please choose a category.");
      return;
    }
    if (!form.condition) {
      setError("Please select a condition.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        sellerEmail: userEmail,
        datePosted: new Date().toISOString(),
      };

      // TODO: replace with real DB / API call
      console.log("New listing payload (demo):", payload);

      setSuccess(
        "Your listing has been created (demo). Later this will save to the database."
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not create listing.";
      console.error("Submit error:", err);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="text-center text-gray-300">
        Checking your login status…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">
            Create a new listing
          </h1>
          <p className="text-sm text-gray-400">
            Share what you&apos;re selling with other Hunter students.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-500/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      >
        {/* Title & Price */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-hunter-purple/70"
              placeholder="e.g. Graphing Calculator TI-84"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Price ($)
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-hunter-purple/70"
              placeholder="40"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>
        </div>

        {/* Category, Condition, Location */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-hunter-purple/70"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
            >
              <option value="">Select a category</option>
              <option value="Textbooks">Textbooks</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Services">Services</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Condition
            </label>
            <select
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-hunter-purple/70"
              value={form.condition}
              onChange={(e) =>
                handleChange("condition", e.target.value as Condition)
              }
            >
              <option value="">Select condition</option>
              <option value="new">New</option>
              <option value="like new">Like new</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-hunter-purple/70"
              placeholder="e.g. Library, Dorms"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-hunter-purple/70"
            placeholder="Add details about the item, its condition, and anything a buyer should know."
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* Contact method */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">
              Preferred contact method
            </label>
            <select
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-hunter-purple/70"
              value={form.contactMethod}
              onChange={(e) =>
                handleChange("contactMethod", e.target.value)
              }
            >
              <option value="email">Email</option>
              <option value="message">In-app message (future)</option>
            </select>
          </div>
          {userEmail && (
            <div className="text-xs text-gray-400 self-end">
              Buyers will contact you at:{" "}
              <span className="font-medium text-gray-200">
                {userEmail}
              </span>
            </div>
          )}
        </div>

        {/* Image upload – with big + card */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">
            Listing image (optional)
          </label>

          {/* hidden native input */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* when no image yet */}
          {!form.imageUrl && (
            <label
              htmlFor="fileInput"
              className="
                flex flex-col items-center justify-center
                w-full h-40 rounded-2xl cursor-pointer
                border border-dashed border-white/20 
                bg-white/5 hover:bg-white/10
                transition
              "
            >
              <div className="text-4xl text-gray-300 mb-1">+</div>
              <div className="text-xs text-gray-400">
                Click to upload an image
              </div>
            </label>
          )}

          {/* when image selected */}
          {form.imageUrl && (
            <div className="space-y-2">
              <img
                src={form.imageUrl}
                alt="Listing preview"
                className="h-40 w-full object-cover rounded-2xl border border-white/10"
              />
              <label
                htmlFor="fileInput"
                className="inline-block text-xs text-hunter-purple cursor-pointer hover:underline"
              >
                Replace image
              </label>
            </div>
          )}

          {uploadingImage && (
            <p className="text-xs text-gray-400 mt-1">
              Uploading image…
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="rounded-full bg-hunter-purple px-5 py-2 text-sm font-semibold text-white shadow-soft hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create listing"}
          </button>
        </div>
      </form>
    </div>
  );
}