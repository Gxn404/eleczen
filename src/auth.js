import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { authConfig } from "./auth.config";
import dbConnect from "./lib/db";
import User from "./models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || "change_this_secret_in_prod_12345", // Fallback for dev
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
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

          if (!user.password) {
            console.log("Login failed: User has no password (maybe OAuth user):", email);
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
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account.provider === "google" || account.provider === "github") {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: account.provider,
              isVerified: true, // OAuth users are verified by default
            });
          } else {
            // Update existing user if needed, or just allow login
            // If user exists but has no provider, we might want to link it?
            // For now, just allow.
          }
        } catch (error) {
          console.error("Error saving OAuth user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user._id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
});
