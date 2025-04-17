// utils/authOptions.js

import GoogleProvider from 'next-auth/providers/google'
import connectDB      from '@/config/database'
import User           from '@/models/User'

export const authOptions = {
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

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // 1) On initial sign-in, create the user in your DB if needed:
    async signIn({ profile }) {
      await connectDB()
      const exists = await User.findOne({ email: profile.email })
      if (!exists) {
        const username = profile.name.slice(0, 20)
        await User.create({
          email:    profile.email,
          username,
          image:    profile.picture,
        })
      }
      return true
    },

    // 2) After sign-in, persist the DB user._id onto the JWT
    async jwt({ token, user }) {
      if (user) {
        // user.id or user._id depending on what NextAuth hands you
        token.id = user.id ?? user._id.toString()
      }
      return token
    },

    // 3) Whenever a session is checked, copy token.id → session.user.id
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
}
