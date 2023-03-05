import { NextApiRequest, NextApiResponse } from "next"
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription, updateSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted"
]);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

export default async function webhooks(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];

    console.log(webhookSecret)

    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(buf, secret as string, webhookSecret)
    } catch (error: any) {
      return res.status(400).send(`Webhook error: ${error.message}`)
    }

    const { type } = event

    if (relevantEvents.has( type )) {
      try {
        switch (type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            await updateSubscription(
              subscription.id.toString(),
              subscription.customer.toString()
            )

            break;
          case "checkout.session.completed":
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
          
            await saveSubscription(
              checkoutSession?.subscription!.toString(),
              checkoutSession?.customer!.toString()
            )

            break;
          default:
            throw new Error(`Unknown event type: ${type}`)
        }
      } catch (error: any) {
        return res.json({ error: 'Webhook handler failed.'})
    }
  }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST")
    res.status(405).end({ message: "Method Not Allowed" })
  }
}