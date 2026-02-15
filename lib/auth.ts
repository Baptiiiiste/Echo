import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/actions/user/get-by-id";
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { env } from "@/env.mjs"
import Resend from "next-auth/providers/resend"

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      selectedProjectId: string | null;
      githubId: string | null;
      githubUsername: string | null;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.role) {
          session.user.role = token.role;
        }

        if (token.selectedProjectId !== undefined) {
          session.user.selectedProjectId = token.selectedProjectId;
        }

        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.githubId = (token.githubId as string) || null;
        session.user.githubUsername = (token.githubUsername as string) || null;
      }

      return session;
    },

    async jwt({ token, trigger, session, account, profile }) {
      if (!token.sub) return token;

      // On GitHub sign-in, save githubId and githubUsername
      if (account?.provider === "github" && profile) {
        const ghId = String((profile as any).id);
        const ghUsername = (profile as any).login || "";
        token.githubId = ghId;
        token.githubUsername = ghUsername;

        await prisma.user.update({
          where: { id: token.sub },
          data: {
            githubId: ghId,
            githubUsername: ghUsername,
          },
        });
      }

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      let selectedProjectId: string | null = token.selectedProjectId || null;
      if (trigger === "update" && session?.selectedProjectId !== undefined) {
        selectedProjectId = session.selectedProjectId;
      }

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;
      token.selectedProjectId = selectedProjectId;
      if (!token.githubId && dbUser.githubId) {
        token.githubId = dbUser.githubId;
        token.githubUsername = dbUser.githubUsername;
      }

      return token;
    },
  },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
    }),
  ],
});
