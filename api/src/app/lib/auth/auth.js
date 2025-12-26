import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import dbConnect from "../db";
import User from "../models/User";

const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: nextUrl }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.nextUrl.pathname.startsWith("/login");

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // If logged in and on login page, redirect to dashboard
        if (isOnLogin) {
          // Use nextUrl.nextUrl.origin as the base to ensure we have a valid absolute URL
          return Response.redirect(new URL('/', nextUrl.nextUrl.origin));
        }
      }
      return true;
    },
  },
  providers: [], // Providers added below
  secret: process.env.AUTH_SECRET || "change_this_secret_in_prod_12345",
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
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
      console.log("SignIn Callback Triggered:", { email: user?.email, provider: account?.provider });
      if (account.provider === "google" || account.provider === "github") {
        try {
          await dbConnect();
          console.log("DB Connected in SignIn");
          const existingUser = await User.findOne({ email: user.email });
          console.log("Existing user found:", existingUser ? existingUser._id : "No");

          if (!existingUser) {
            console.log("Creating new user...");
            const newUser = await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: account.provider,
              isVerified: true, // OAuth users are verified
            });
            console.log("New user created:", newUser._id);
          } else {
            console.log("Updating existing user...");
            existingUser.name = user.name;
            existingUser.image = user.image;
            existingUser.provider = account.provider;
            const updated = await existingUser.save();
            console.log("User updated:", updated._id);
          }
        } catch (error) {
          console.error("Error saving/updating OAuth user:", error);
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
