import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || "change_this_secret_in_prod_12345",
}).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
