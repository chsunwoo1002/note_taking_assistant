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
};

module.exports = nextConfig;
