import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// GET /api/properties?page=&pageSize=
export async function GET(request) {
  try {
    await connectDB();

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(request.nextUrl.searchParams.get("pageSize") || "6", 10);
    const skip = (page - 1) * pageSize;

    const [total, properties] = await Promise.all([
      Property.countDocuments({}),
      Property.find({}).skip(skip).limit(pageSize),
    ]);

    return new Response(JSON.stringify({ total, properties }), { status: 200 });
  } catch (error) {
    console.error("GET /api/properties error:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}

// POST /api/properties
export async function POST(request) {
  try {
    await connectDB();

    // 1) Ensure user is signed in
    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return new Response("User ID is required", { status: 401 });
    }
    const userId = sessionUser.userId;

    // 2) Parse incoming payload (either JSON or multipart/form-data)
    const contentType = request.headers.get("content-type") || "";
    let payload;

    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      payload = {
        type: formData.get("type"),
        name: formData.get("name"),
        description: formData.get("description"),
        location: {
          street: formData.get("location.street"),
          city: formData.get("location.city"),
          state: formData.get("location.state"),
          zipcode: formData.get("location.zipcode"),
        },
        beds: formData.get("beds"),
        baths: formData.get("baths"),
        square_feet: formData.get("square_feet"),
        amenities: formData.getAll("amenities"),
        rates: {
          weekly: formData.get("rates.weekly"),
          monthly: formData.get("rates.monthly"),
          nightly: formData.get("rates.nightly"),
        },
        seller_info: {
          name: formData.get("seller_info.name"),
          email: formData.get("seller_info.email"),
          phone: formData.get("seller_info.phone"),
        },
        // may be either array of URLs (JSON) or File objects (formData)
        images: formData.getAll("images").filter((f) => f.name),
      };
    } else {
      return new Response("Unsupported Content-Type", { status: 415 });
    }

    // 3) Handle images: either already-URLs or upload
    let images: string[] = [];
    if (Array.isArray(payload.images) && payload.images.length > 0) {
      // JSON branch: array of strings?
      if (typeof payload.images[0] === "string") {
        images = payload.images as string[];
      } else {
        // multipart branch: File objects
        images = await Promise.all(
          (payload.images as File[]).map(async (file) => {
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

    // 4) Build and save property document
    const propertyData = {
      type: payload.type,
      name: payload.name,
      description: payload.description,
      location: payload.location,
      beds: Number(payload.beds),
      baths: Number(payload.baths),
      square_feet: Number(payload.square_feet),
      amenities: payload.amenities,
      rates: {
        weekly: payload.rates.weekly ? Number(payload.rates.weekly) : undefined,
        monthly: payload.rates.monthly ? Number(payload.rates.monthly) : undefined,
        nightly: payload.rates.nightly ? Number(payload.rates.nightly) : undefined,
      },
      seller_info: payload.seller_info,
      owner: userId,
      images,
    };

    const newProperty = new Property(propertyData);
    await newProperty.save();

    // 5) Redirect to the new property page
    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`
    );
  } catch (error) {
    console.error("❌ Failed to add property:", error);
    return new Response("Failed to add property", { status: 500 });
  }
}
