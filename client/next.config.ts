/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com" },   // keep if you still use it
      { protocol: "https", hostname: "images.unsplash.com" },   // specific unsplash photos
      { protocol: "https", hostname: "picsum.photos" },         // NEW: dev placeholders
    ],
  },
};

export default nextConfig; // or module.exports = nextConfig if not ESM
