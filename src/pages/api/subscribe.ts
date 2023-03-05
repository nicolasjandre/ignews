import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";
import { query as q } from "faunadb";

interface User {
  ref: {
    id: string;
  }
  data: {
    stripe_customer_id: string;
  }
}

export default async function subscribe(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const session = await getSession({ req });
      console.log("first log" + session)

      const user = await fauna.query<User>(
        q.Get(
          q.Match(
            q.Index('user_by_email'),
            q.Casefold(session?.user?.email as string)
          )
        )
      )

      let customerId = user.data.stripe_customer_id

      if (!customerId) {
        const stripeCustomer = await stripe.customers.create({
          email: session?.user?.email as string,
        })

        await fauna.query(
          q.Update(
            q.Ref(q.Collection("users"), user.ref.id),
            {
              data: {
                stripe_customer_id: stripeCustomer.id,
              }
            }
          )
        )
        customerId = stripeCustomer.id
      }

      const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        billing_address_collection: "required",
        line_items: [
          {
            price: "price_1MOqCMFmhexNBgj4anCH8Mh1",
            quantity: 1
          }
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        success_url: "https://jandre-ignews.vercel.app/posts",
        cancel_url: "https://jandre-ignews.vercel.app/",
      })

      return res.status(200).json({ sessionId: stripeCheckoutSession.id })
    } catch (err) {
      console.log(err);
    }
  } else {
    res.setHeader("Allow", "POST")
    res.status(405).end({ message: "Method Not Allowed" })
  }
}