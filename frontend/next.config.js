/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/v1/api/:path*',
  //       destination: 'http://localhost:8000/v1/api/:path*', // Proxy to Backend
  //     }
  //   ]
  // }
}

module.exports = nextConfig