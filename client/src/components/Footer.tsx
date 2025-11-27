import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-hunter-navy text-gray-300 border-t border-hunter-purple/30">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-3">
          <div className="font-display text-xl font-bold text-white">
            <span className="rounded bg-hunter-purple px-2 py-1 text-white">Hunter</span>{" "}
            <span className="text-gray-100">Market</span>
          </div>
          <p className="text-sm text-gray-400">
            A student-to-student marketplace for Hunter College. Buy, sell, and trade safely.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/browse" className="hover:text-white transition">Browse</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Help</h4>
          <ul className="space-y-2 text-sm">
            {/* these could be Next pages later; keep as Link if they exist */}
            <li><Link href="/rules" className="hover:text-white transition">Safety &amp; Rules</Link></li>
            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Stay in touch */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Stay in touch</h4>
          <div className="flex gap-3">
            {/* External links stay as <a> */}
            <a
              aria-label="X"
              href="#"
              className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-200 group-hover:text-white">
                <path fill="currentColor" d="M18.9 2H21l-6.5 7.4L22 22h-6.9l-4.3-5.6L5.8 22H3.6l7-8L3 2h7l4 5.3L18.9 2Zm-2.4 18h1.9L7.6 4H5.7L16.5 20Z"/>
              </svg>
            </a>
            <a
              aria-label="Instagram"
              href="#"
              className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-2 00 group-hover:text-white">
                <path fill="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.25-3a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z"/>
              </svg>
            </a>
            <a
              aria-label="Email"
              href="mailto:team@huntermkt.edu"
              className="group inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-200 group-hover:text-white">
                <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/>
              </svg>
            </a>
          </div>
          <p className="mt-3 text-xs text-gray-400">team@huntermkt.edu</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Hunter Marketplace. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <span className="text-gray-600">•</span>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <span className="text-gray-600">•</span>
            <Link href="/rules" className="hover:text-white transition">Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
