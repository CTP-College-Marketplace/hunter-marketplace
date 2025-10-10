import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundSquares from "@/components/BackgroundSquares";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hunter Marketplace",
  description: "Buy & sell with Hunter students safely.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* black canvas; content is light; effects sit under it */}
      <body className="relative bg-black text-white antialiased overflow-x-hidden" suppressHydrationWarning>
        <div className="absolute  -z-10">
    <BackgroundSquares count={30} />
  </div>

        <Navbar />
        <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
          
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
