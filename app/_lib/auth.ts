import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user }) {
      try {
        const existingUser = await getGuest(user?.email ?? "");

        if (!existingUser) {
          await createGuest({
            email: user?.email ?? "",
            fullName: user?.name ?? "",
          });
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    async session({ session }) {
      const guest = await getGuest(session.user.email);
      (session.user as any).guestId = guest.id;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});
