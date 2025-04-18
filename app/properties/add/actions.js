"use server";

import { dbConnect } from "@/lib/dbConnect";
import Property from "@/models/Property";

export async function createProperty(_, formData) {
  await dbConnect();
  const data = Object.fromEntries(formData);
  const doc  = await Property.create(data);
  return { ok: true, id: doc._id };
}
