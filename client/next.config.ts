/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "*.blob.core.windows.net" }, // Azure Blob Storage
    ],
  },
  experimental: {
    optimizePackageImports: ["@azure/storage-blob"],
  },
};

export default nextConfig;
