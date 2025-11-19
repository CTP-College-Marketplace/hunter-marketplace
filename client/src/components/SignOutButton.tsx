"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  to?: string;          
  className?: string;
  label?: string;
};

export default function SignOutButton({
  to = "/login",
  className = "rounded-full bg-hunter-purple px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-[0.98]",
  label = "Sign out",
}: Props) {
  const router = useRouter(); // used for redirection after sign out
  const [busy, setBusy] = useState(false); // tracks if sign out is in progress
  const [err, setErr] = useState<string | null>(null); // hold any err msg from Supabase 

  const onClick = async () => { // When clicked, 
    setBusy(true); // marks button as busy
    setErr(null);
    const { error } = await supabase.auth.signOut(); // Calls Supabase sign out and clears user session
    setBusy(false); // marks button as not busy
    if (error) setErr(error.message); // if error, set error msg
    router.replace(to);
  };

  return (
    <>
      <button onClick={onClick} disabled={busy} className={className}>
        {busy ? "Signing out…" : label} 
      </button>
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
    </>
  );
}
