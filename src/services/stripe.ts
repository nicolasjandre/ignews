import Stripe from "stripe";

export const stripe = new Stripe(
  `${String(process.env.STRIPE_API_KEY)}`,
  {
    apiVersion: "2022-11-15",
    appInfo: {
      name: "igNews",
      version: "0.0.1",
    },
  }
)