
module.exports = {
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*' // Example Spring backend API proxy
      }
    ]
  }
}
