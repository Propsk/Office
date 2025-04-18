import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

export const POST = async (request) => {
  try {
    await connectDB();

    const { propertyId } = await request.json();

    const sessionUser = await getSessionUser();
    if (!sessionUser?.user?.id) {
      return new Response(JSON.stringify({ isBookmarked: false, message: 'Not authenticated' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const userId = sessionUser.user.id;

    const user = await User.findOne({ _id: userId });
    
    if (!user) {
      return new Response(JSON.stringify({ isBookmarked: false, message: 'User not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Ensure bookmarks array exists
    if (!user.bookmarks) {
      user.bookmarks = [];
      await user.save();
    }
    
    const isBookmarked = user.bookmarks.includes(propertyId);

    return new Response(JSON.stringify({ isBookmarked }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
};