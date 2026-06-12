/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingIncludes: {
      "/admin/**": ["./node_modules/@img/sharp-libvips-linux-x64/**/*"],
      "/vendor/**": ["./node_modules/@img/sharp-libvips-linux-x64/**/*"],
    },
  },
};

export default nextConfig;
