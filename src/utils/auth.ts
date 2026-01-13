import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prismaDB";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
  },
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET || process.env.SECRET,
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Jhondoe" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text", placeholder: "Jhon Doe" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email or password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
          },
        });

        if (!user || !user?.password) {
          throw new Error("Invalid email or password");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }

      if (!token.role && token?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },

    session: async ({ session, token }) => {
      if (session?.user) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token?.id,
            role: (token as any)?.role,
          },
        };
      }
      return session;
    },
  },

  // debug: process.env.NODE_ENV === "developement",
};
