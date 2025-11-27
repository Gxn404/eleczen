import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import dbConnect from "./lib/db";
import User from "./models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || "change_this_secret_in_prod_12345", // Fallback for dev
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          await dbConnect();
          const user = await User.findOne({ email }).select("+password");

          if (!user) {
            console.log("Login failed: User not found for email:", email);
            return null;
          }

          // In a real app, compare passwords
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }

          console.log("Login failed: Password mismatch for email:", email);
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
});
