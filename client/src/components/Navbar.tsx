"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import SignOutButton from "@/components/SignOutButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // track wether user is authenticated and is currently logged in
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    let unsub: (() => void) | undefined;

    (async () => {
      // gets current session to determine if user is logged in
      const { data } = await supabase.auth.getSession();
      setAuthed(!!data.session);

      // subs to auth changes to update auth state on login/logout
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_e: AuthChangeEvent, s: Session | null) => setAuthed(!!s)
      );
      unsub = () => subscription.unsubscribe();
    })();

    return () => unsub?.();
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-hunter-purple/40 bg-hunter-navy text-white backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-6">
        {/* Left: logo */}
        <div className="flex items-center">
          <Link href="/" className="font-display text-xl font-bold">
            <span className="rounded bg-hunter-purple px-2 py-1 text-white">Hunter</span>{" "}
            <span className="text-gray-100">Market</span>
          </Link>
        </div>

        {/* Center: nav */}
        <nav className="hidden md:flex items-center justify-center gap-8">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "relative text-sm font-medium transition-colors",
                  active ? "text-white" : "text-gray-300 hover:text-white",
                  "after:pointer-events-none after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full",
                  "after:origin-center after:scale-x-0 after:bg-hunter-purple after:opacity-0",
                  "after:transition-transform after:duration-200 after:ease-out",
                  active
                    ? "after:scale-x-100 after:opacity-100"
                    : "hover:after:scale-x-100 hover:after:opacity-100 focus-visible:after:scale-x-100 focus-visible:after:opacity-100",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: actions */}
        <div className="flex items-center justify-end gap-3">
          {authed ? (
            <SignOutButton to="/login" />
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-hunter-purple px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              Log In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-white/10 transition"
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"
              viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-hunter-purple/30 bg-hunter-navy">
          <div className="mx-auto max-w-7xl px-6 py-3 flex flex-col gap-2">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "block py-2 text-sm font-medium transition-colors",
                    active ? "text-white" : "text-gray-300 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            })}
            
            {authed ? (
              <div className="mt-2">
                <SignOutButton
                  to="/login"
                  className="w-full rounded-full bg-hunter-purple px-4 py-2 text-sm font-semibold text-white shadow-soft"
                  label="Sign out"
                />
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-hunter-purple px-4 py-2 text-sm font-semibold text-white shadow-soft transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}