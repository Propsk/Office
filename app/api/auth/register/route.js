// app/api/auth/register/route.js
import connectDB from "@/config/database";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password, username } = await request.json();
    
    // Validate input
    if (!email || !password || !username) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if email is already in use
    const userExists = await User.findOne({ email });
    if (userExists) {
      return new Response(
        JSON.stringify({ message: "Email already in use" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Create new user
    // Password will be hashed by the pre-save hook in the User model
    const newUser = new User({
      email,
      username,
      password,
      isAdmin: false
    });
    
    await newUser.save();
    
    return new Response(
      JSON.stringify({ message: "User registered successfully" }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ message: "Error registering user" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}