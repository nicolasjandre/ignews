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
            value:
              "connect-src 'self' https://api.stripe.com https://maps.googleapis.com https://checkout.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com https://connect-js.stripe.com; script-src 'self' https://js.stripe.com https://maps.googleapis.com https://checkout.stripe.com https://connect-js.stripe.com; img-src 'self' https://*.stripe.com;",
          },
        ],
      },
    ];
  },
};