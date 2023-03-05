/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Define the Content Security Policy header for Stripe
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "connect-src, https://api.stripe.com, https://maps.googleapis.com frame-src, https://js.stripe.com, https://hooks.stripe.com script-src, https://js.stripe.com, https://maps.googleapis.com"
          },
        ],
      },
    ];
  },
};