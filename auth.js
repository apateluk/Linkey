
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

import prisma from "@/lib/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [ Google],
      callbacks: {
        async signIn({ user, account, profile, email }) {
          if (account.provider === "google" ) {
            const valid_emails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.trim().split(" ") : null;
            if (!valid_emails) {
              return false;
            }  
            return (profile.email_verified && valid_emails.includes(profile.email));
          } 
          return false;
        },
      },
  })
