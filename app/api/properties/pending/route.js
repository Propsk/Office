// app/api/properties/pending/route.js
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function GET(request) {
  try {
    await connectDB();
    
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get all pending properties
    const properties = await Property.find({ status: 'pending' })
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });
    
    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching pending properties:', error);
    return new Response(JSON.stringify({ message: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}