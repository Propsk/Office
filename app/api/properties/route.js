import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// GET /api/properties?page=&pageSize=
export async function GET(request) {
  await connectDB();

  const page    = parseInt(request.nextUrl.searchParams.get("page")    || "1", 10);
  const pageSize= parseInt(request.nextUrl.searchParams.get("pageSize")|| "6", 10);
  const skip    = (page - 1) * pageSize;

  const total      = await Property.countDocuments();
  const properties = await Property.find().skip(skip).limit(pageSize);

  return new Response(
    JSON.stringify({ total, properties }),
    { status: 200 }
  );
}

// POST /api/properties
export async function POST(request) {
  await connectDB();

  // 1) Authentication
  const sessionUser = await getSessionUser();
  if (!sessionUser?.userId) {
    return new Response("User ID is required", { status: 401 });
  }
  const { userId } = sessionUser;

  // 2) Parse incoming payload (JSON or multipart/form-data)
  const contentType = request.headers.get("content-type") || "";
  let payload;
  if (contentType.includes("application/json")) {
    payload = await request.json();
  } else {
    const formData = await request.formData();
    payload = {};

    // flatten FormData into payload object
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

  // 3) Handle images: either already-URLs or upload File objects
  let images = [];
  if (Array.isArray(payload.images) && payload.images.length > 0) {
    if (typeof payload.images[0] === "string") {
      // JSON branch: array of URLs
      images = payload.images;
    } else {
      // multipart branch: array of File objects
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

  // 4) Build the new property document
  const propertyData = {
    owner:       userId,
    type:        payload.type,
    name:        payload.name,
    description: payload.description,
    location: {
      street:  payload.location?.street,
      city:    payload.location?.city,
      state:   payload.location?.state,
      zipcode: payload.location?.zipcode,
    },
    beds:       Number(payload.beds),
    baths:      Number(payload.baths),
    square_feet:Number(payload.square_feet),
    amenities:  payload.amenities || [],
    rates: {
      weekly:  payload.rates?.weekly  ? Number(payload.rates.weekly)  : undefined,
      monthly: payload.rates?.monthly ? Number(payload.rates.monthly) : undefined,
      nightly: payload.rates?.nightly ? Number(payload.rates.nightly) : undefined,
    },
    seller_info: {
      name:  payload.seller_info?.name,
      email: payload.seller_info?.email,
      phone: payload.seller_info?.phone,
    },
    images,
  };

  // 5) Save and redirect
  const newProperty = new Property(propertyData);
  await newProperty.save();

  return Response.redirect(
    `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
  );
}
