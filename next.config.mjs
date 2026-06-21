/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Serve modern formats from next/image — smaller payloads, no visual change. AVIF first,
  // WebP fallback, then the browser falls back to the original.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
