// utils/authOptions.js
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/config/database';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    // Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    // Credentials provider for admin login
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectDB();
          
          // Check if user exists
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            return null;
          }
          
          // Check password
          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isPasswordMatch) {
            return null;
          }
          
          return {
            id: user._id.toString(),
            name: user.username,
            email: user.email,
            isAdmin: user.isAdmin || false
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin || false;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },

    async signIn({ profile, account }) {
      if (account?.provider === 'google' && profile) {
        try {
          await connectDB();
          
          // Check if user exists
          const userExists = await User.findOne({ email: profile.email });
          
          // If not, create new user
          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name?.slice(0, 20) || profile.email.split('@')[0],
              image: profile.picture || profile.image,
            });
          }
          
          return true;
        } catch (error) {
          console.error('SignIn callback error:', error);
          return false;
        }
      }
      
      return true;
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
};