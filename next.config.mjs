/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    siteDescription: "Admin dashboard site for managing Nimbus App",
    siteKeywords: "Travel, Recommendation, Education",
    siteUrl: "http://localhost:3000",
    siteTitle: "Nimbus"
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      }
    ]
  }
};

export default nextConfig;