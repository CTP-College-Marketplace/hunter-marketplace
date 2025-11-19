"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callback = params.get("callback") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setMessage(null);

    if (!name.trim()) return setError("Please enter your full name.");
    if (!email.includes("@myhunter.cuny.edu")) return setError("Enter a valid email.");
    if (pwd.length < 6) return setError("Password must be at least 6 characters.");
    if (pwd !== confirmPwd) return setError("Passwords do not match.");

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({ email, password: pwd });
    setBusy(false);

    if (error) return setError(error.message);

    if (data.user && !data.session) setMessage("Check your email to confirm your account.");
    else router.replace(callback);
  }

  useEffect(() => {
    let unsub: (() => void) | undefined;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) return router.replace(callback);
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_e: AuthChangeEvent, s: Session | null) => { if (s) router.replace(callback); }
      );
      unsub = () => subscription.unsubscribe();
    })();
    return () => unsub?.();
  }, [router, callback]);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">Sign up</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
         <label className="block text-sm font-medium text-gray-200">Name</label>
         <input
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder="Your Full Name"
           className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
         />
       </div>
        <div>
          <label className="block text-sm">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            placeholder="your_name@myhunter.cuny.edu"
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
            />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <div className="flex gap-2">
            <input 
              type={showPwd ? "text" : "password"} 
              value={pwd} onChange={e=>setPwd(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
              />
            <button 
              type="button" 
              onClick={()=>setShowPwd(s=>!s)} 
              className="px-3 border rounded">{showPwd ? "Hide" : "Show"}</button>
          </div>
        </div>
        <div>
          <label className="block text-sm">Confirm Password</label>
          <input 
            type={showPwd ? "text" : "password"} 
            value={confirmPwd} 
            onChange={e=>setConfirmPwd(e.target.value)} 
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/80 px-3 py-2 text-sm text-hunter-navy placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-hunter-purple/50"
            />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <div className="flex items-center justify-between">
          <Link href="/login" className="text-sm">Back to login</Link>
          <button type="submit" disabled={busy} className="px-5 py-2 rounded bg-black text-white">
            {busy ? "Creating…" : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default function Page(){ return <Suspense fallback={<div>Loading…</div>}><SignupForm/></Suspense>; }

