import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { saveSubscription, updateSubscription } from './_lib/manageSubscription';
import { stripe } from '../../services/stripe';
import { buffer } from 'micro/types/src/lib';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {

  const webhookSecret: string = `${process.env.STRIPE_WEBHOOK_SECRET}` as string;

  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'] as string;

    const relevantEvents = new Set([
      "checkout.session.completed",
      "customer.subscription.updated",
      "customer.subscription.deleted"
    ]);

    let event: Stripe.Event;

    try {
      const body = await buffer(req);
      event = stripe.webhooks.constructEvent(body.toString(), sig, webhookSecret);
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    console.log('✅ Success:', event.id);

    const { type } = event

    if (relevantEvents.has(type)) {
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
        return res.json({ error: 'Webhook handler failed.' })
      }
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;