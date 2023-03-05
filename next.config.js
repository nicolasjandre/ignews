/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Define the Content Security Policy header
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self' https://checkout.stripe.com; frame-src 'self' https://checkout.stripe.com; script-src 'self' https://checkout.stripe.com; img-src 'self' https://*.stripe.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig
