// app/page-actions.js
'use server';

import { dbConnect } from '@/lib/dbConnect';
import Property from '@/models/Property';

export async function getAllProperties() {
  await dbConnect();
  return await Property.find().lean();
}
