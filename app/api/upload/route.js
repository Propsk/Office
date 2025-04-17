import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 });
    }

    const { userId } = sessionUser;
    const formData = await request.formData();

    const amenities = formData.getAll('amenities');
    const images = formData.getAll('images').filter((image) => image.name !== '');

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
      beds: formData.get('beds'),
      baths: formData.get('baths'),
      square_feet: formData.get('square_feet'),
      amenities,
      rates: {
        weekly: formData.get('rates.weekly'),
        monthly: formData.get('rates.monthly'),
        nightly: formData.get('rates.nightly'),
      },
      seller_info: {
        name: formData.get('seller_info.name'),
        email: formData.get('seller_info.email'),
        phone: formData.get('seller_info.phone'),
      },
      owner: userId,
    };

    // Upload images to Cloudinary
    const imageUploadPromises = images.map(async (image) => {
      const buffer = await image.arrayBuffer();
      const imageData = Buffer.from(buffer);
      const base64 = imageData.toString('base64');

      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${base64}`,
        { folder: 'propertypulse' }
      );

      return result.secure_url;
    });

    const uploadedImages = await Promise.all(imageUploadPromises);
    propertyData.images = uploadedImages;

    const newProperty = new Property(propertyData);
    await newProperty.save();

    return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`);
  } catch (error) {
    console.error('Failed to add property:', error);
    return new Response('Failed to add property', { status: 500 });
  }
};
