export const authConfig = {
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
  providers: [], // Add providers with an empty array for now
  secret: process.env.AUTH_SECRET || "change_this_secret_in_prod_12345",
};
