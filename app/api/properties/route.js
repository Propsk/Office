import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// GET /api/properties
export const GET = async (request) => {
  try {
    await connectDB();

    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(request.nextUrl.searchParams.get("pageSize") || "6", 10);
    const skip = (page - 1) * pageSize;

    const total = await Property.countDocuments({});
    const properties = await Property.find({}).skip(skip).limit(pageSize);

    return new Response(
      JSON.stringify({ total, properties }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Failed to fetch properties:", error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST /api/properties
export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return new Response("User ID is required", { status: 401 });
    }
    const userId = sessionUser.userId;

    const formData = await request.formData();
    // multi-value fields
    const amenities = formData.getAll("amenities");
    const images = formData.getAll("images").filter((f) => f.name);

    // build doc
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: Number(formData.get("beds")),
      baths: Number(formData.get("baths")),
      square_feet: Number(formData.get("square_feet")),
      amenities,
      rates: {
        weekly: Number(formData.get("rates.weekly")),
        monthly: Number(formData.get("rates.monthly")),
        nightly: Number(formData.get("rates.nightly")),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    // upload images
    const uploadPromises = images.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const b64 = buffer.toString("base64");
      const res = await cloudinary.uploader.upload(
        `data:image/png;base64,${b64}`,
        { folder: "propertypulse" }
      );
      return res.secure_url;
    });
    propertyData.images = await Promise.all(uploadPromises);

    // save
    const newProp = new Property(propertyData);
    await newProp.save();

    return Response.redirect(
      `${process.env.NEXTAUTH_URL}/properties/${newProp._id}`
    );
  } catch (error) {
    console.error("❌ Failed to add property:", error);
    return new Response("Failed to add property", { status: 500 });
  }
};
