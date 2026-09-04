import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Node-only deps like bcrypt or the db driver).
 * Used by middleware for route protection; extended in auth.ts with the provider.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true;
      }
      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
