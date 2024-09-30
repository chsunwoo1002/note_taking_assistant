/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/create-note",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["kmhsewynkjziilgfawvt.supabase.co"],
  },
};

module.exports = nextConfig;
