import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = 'force-dynamic';

// GET /api/properties/:id
export const GET = async (request, { params }) => {
  try {
    const { id } = params;
    if (!id) return new Response('ID is required', { status: 400 });

    await connectDB();
    const property = await Property.findById(id);

    if (!property) return new Response('Property Not Found', { status: 404 });
    return new Response(JSON.stringify(property), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};

// DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
  try {
    const { id } = params;
    if (!id) return new Response('ID is required', { status: 400 });

    const sessionUser = await getSessionUser();
    if (!sessionUser?.user?.id) {
      return new Response('User ID is required', { status: 401 });
    }
    const userId = sessionUser.user.id;

    await connectDB();
    const property = await Property.findById(id);

    if (!property) return new Response('Property Not Found', { status: 404 });

    if (property.owner.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    await property.deleteOne();

    return new Response('Property Deleted', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Something went wrong', { status: 500 });
  }
};

// PUT /api/properties/:id
export const PUT = async (request, { params }) => {
  try {
    const { id } = params;
    if (!id) return new Response('ID is required', { status: 400 });

    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser?.user?.id) {
      return new Response('User ID is required', { status: 401 });
    }
    const userId = sessionUser.user.id;

    const formData = await request.formData();
    const amenities = formData.getAll('amenities');

    const existingProperty = await Property.findById(id);
    if (!existingProperty) return new Response('Property does not exist', { status: 404 });

    if (existingProperty.owner.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      location: {
        street: formData.get('location.street'),
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode'),
      },
      desk_capacity: Number(formData.get('desk_capacity')),
      rooms: Number(formData.get('rooms')),
      square_feet: Number(formData.get('square_feet')),
      amenities,
      rates: {
        weekly: Number(formData.get('rates.weekly')),
        monthly: Number(formData.get('rates.monthly')),
        daily: Number(formData.get('rates.daily')),
      },
      contact: {
        name: formData.get('contact.name'),
        email: formData.get('contact.email'),
        phone: formData.get('contact.phone'),
      },
      owner: userId,
    };

    const updatedProperty = await Property.findByIdAndUpdate(id, propertyData, { new: true });

    return new Response(JSON.stringify(updatedProperty), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Failed to update property', { status: 500 });
  }
};