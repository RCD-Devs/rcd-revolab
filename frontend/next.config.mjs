/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Dominio publico de R2 (portadas de curso, avatares, video de leccion).
      { protocol: "https", hostname: "*.r2.dev" },
    ],
  },
};

export default nextConfig;
