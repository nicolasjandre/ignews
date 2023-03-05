import NextAuth, { Awaitable, NextAuthOptions, Session, User } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from "faunadb"
import { fauna } from "../../../services/fauna"

declare module "next-auth" {
  interface Session {
    activeSubscription?: object | null;
    session: {
      user: {
        name: string,
        email: string;
      };
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }: { session: Session; user: User }): Promise<Session & { activeSubscription: object | null }> {
      try {
        const email = session.user?.email as string;

        if (!email) {
          throw new Error('No email found in session');
        }

        // Get the user's reference
        const userRef = q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(email)
            )
          )
        );

        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                userRef
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch (e) {
        console.log(e)
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },


    async signIn({ user }) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index("user_by_email"),
                  q.Casefold(email as string)
                )
              )
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(
              q.Match(
                q.Index("user_by_email"),
                q.Casefold(email as string)
              )
            )
          )
        );
        return true;
      } catch {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);
