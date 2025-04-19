import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// GET /api/properties?page=&pageSize=
export async function GET(request) {
  await connectDB();

  const isAdminRequest = request.nextUrl.searchParams.get("admin") === "true";
  
  // Get the session user for admin verification
  let isAdmin = false;
  if (isAdminRequest) {
    const sessionUser = await getSessionUser();
    isAdmin = sessionUser?.user?.isAdmin || false;
    
    // If non-admin tries to access admin endpoint, return error
    if (!isAdmin) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
  }

  // Regular pagination parameters
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(request.nextUrl.searchParams.get("pageSize") || "6", 10);
  const skip = (page - 1) * pageSize;

  // Different queries for admin vs regular
  let query = {};
  let properties;
  let total;

  if (isAdmin) {
    // Admins can see all properties
    total = await Property.countDocuments();
    properties = await Property.find()
      .populate('owner', 'username email') // Include owner details
      .skip(skip)
      .limit(pageSize);
  } else {
    // Regular users only see approved properties
    query = { status: "approved" };
    total = await Property.countDocuments(query);
    properties = await Property.find(query)
      .skip(skip)
      .limit(pageSize);
  }

  return new Response(JSON.stringify({ properties, total }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

// POST /api/properties
export async function POST(request) {
  await connectDB();

  const sessionUser = await getSessionUser();
  if (!sessionUser?.user?.id) {
    return new Response("User ID is required", { status: 401 });
  }
  const userId = sessionUser.user.id;

  const contentType = request.headers.get("content-type") || "";
  let payload;
  if (contentType.includes("application/json")) {
    payload = await request.json();
  } else {
    const formData = await request.formData();
    payload = {};
    formData.forEach((value, key) => {
      if (key.includes(".")) {
        const [parent, child] = key.split(".");
        payload[parent] = payload[parent] || {};
        payload[parent][child] = value;
      } else if (key === "amenities") {
        payload.amenities = formData.getAll("amenities");
      } else if (key === "images") {
        payload.images = formData.getAll("images");
      } else {
        payload[key] = value;
      }
    });
  }

  let images = [];
  if (Array.isArray(payload.images) && payload.images.length > 0) {
    if (typeof payload.images[0] === "string") {
      images = payload.images;
    } else {
      images = await Promise.all(
        payload.images.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64 = buffer.toString("base64");
          const result = await cloudinary.uploader.upload(
            `data:image/png;base64,${base64}`,
            { folder: "propertypulse" }
          );
          return result.secure_url;
        })
      );
    }
  }

  try {
    const propertyData = {
      owner: userId,
      type: payload.type,
      name: payload.name,
      description: payload.description,
      location: {
        street: payload.location?.street,
        city: payload.location?.city,
        state: payload.location?.state,
        zipcode: payload.location?.zipcode,
      },
      desk_capacity: Number(payload.desk_capacity),
      rooms: Number(payload.rooms),
      square_feet: Number(payload.square_feet),
      amenities: payload.amenities || [],
      rates: {
        daily: payload.rates?.daily ? Number(payload.rates.daily) : undefined,
        weekly: payload.rates?.weekly ? Number(payload.rates.weekly) : undefined,
        monthly: payload.rates?.monthly ? Number(payload.rates.monthly) : undefined,
      },
      contact: {
        name: payload.contact?.name,
        email: payload.contact?.email,
        phone: payload.contact?.phone,
      },
      images,
    };

    const newProperty = new Property(propertyData);
    await newProperty.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );
  } catch (err) {
    console.error("POST /api/properties error:", err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 400,
    });
  }
}