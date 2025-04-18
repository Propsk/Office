// app/api/properties/[id]/approve/route.js
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const { status, notes } = await request.json();
    
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || !session.user.isAdmin) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update property status
    const property = await Property.findByIdAndUpdate(
      id,
      { status, approvalNotes: notes },
      { new: true }
    );
    
    if (!property) {
      return new Response(JSON.stringify({ message: 'Property not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(property), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error approving property:', error);
    return new Response(JSON.stringify({ message: 'Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}