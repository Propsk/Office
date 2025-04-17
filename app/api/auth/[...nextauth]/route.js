// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";

export const authOptions = {
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt:        "consent",
          access_type:   "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      await connectDB();
      const exists = await User.findOne({ email: profile.email });
      if (!exists) {
        await User.create({
          email:    profile.email,
          username: profile.name.slice(0, 20),
          image:    profile.picture,
        });
      }
      return true;
    },
    async session({ session }) {
      await connectDB();
      const user = await User.findOne({ email: session.user.email });
      session.user.id = user._id.toString();
      return session;
    },
  },
};

// Create a single NextAuth handler
const handler = NextAuth(authOptions);

// Export it for both GET and POST
export { handler as GET, handler as POST };
