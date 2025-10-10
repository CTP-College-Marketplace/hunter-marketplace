"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { setLoggedIn, isLoggedIn } from "@/lib/demoAuth";

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = params.get("callback") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your name.");
    if (!email.includes("@")) return setError("Enter a valid email.");
    if (pwd.length < 6) return setError("Password must be at least 6 characters.");
    if (pwd !== confirm) return setError("Passwords do not match.");

    setBusy(true);
    // demo: “create account” and log them in
    setLoggedIn(true);
    await new Promise((r) => setTimeout(r, 400));
    router.replace(callback);
  }

  if (typeof window !== "undefined" && isLoggedIn()) {
    router.replace(callback);
    return null;
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-display font-bold text-white">Create an account</h1>
      <p className="mb-6 text-sm text-gray-400">This is a demo sign-up. We’ll hook real auth later.</p>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-6">
        <div>
          <label className="block text-sm font-medium text-gray-200">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Email</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@hunter.cuny.edu"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Create a password"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Confirm password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
          />
        </div>

        {error && <p className="text-xs text-red-300">{error}</p>}

        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-300 hover:text-white transition">Back</Link>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-hunter-purple px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Creating…" : "Create account"}
          </button>
        </div>

        <div className="pt-2 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link
            href={`/login?callback=${encodeURIComponent(callback)}`}
            className="text-hunter-purple underline underline-offset-4"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
