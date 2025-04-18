// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/utils/authOptions";

// Create a single NextAuth handler using the centralized authOptions
const handler = NextAuth(authOptions);

// Export it for both GET and POST
export { handler as GET, handler as POST };