"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { isLoggedIn, setLoggedIn } from "@/lib/demoAuth";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = params.get("callback") || "/";

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // very basic demo validation
    if (!email.includes("@")) return setError("Enter a valid email.");
    if (pwd.length < 6) return setError("Password must be at least 6 characters.");

    setBusy(true);
    setLoggedIn(true);                 // 🔐 demo: mark as authed
    await new Promise((r) => setTimeout(r, 350));
    router.replace(callback);          // go back to the page user wanted
  }

  // Check if already logged in on client side only
  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(callback);
    }
  }, [router, callback]);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-display font-bold text-white">Log in</h1>
      <p className="mb-6 text-sm text-gray-400">Use any email & password (demo).</p>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-6">
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
          <div className="mt-1 flex items-center gap-2">
            <input
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-red-300">{error}</p>}

        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
            Back
          </Link>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-hunter-purple px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>

        <div className="pt-2 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link
            href={`/signup?callback=${encodeURIComponent(callback)}`}
            className="text-hunter-purple underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}
