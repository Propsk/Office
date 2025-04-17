import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// GET /api/properties?page=&pageSize=
export async function GET(request) {
  await connectDB();

  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(request.nextUrl.searchParams.get("pageSize") || "6", 10);
  const skip = (page - 1) * pageSize;

  const total = await Property.countDocuments();
  const properties = await Property.find().skip(skip).limit(pageSize);

  return new Response(JSON.stringify({ total, properties }), { status: 200 });
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