import { NextResponse } from "next/server";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";

export async function POST(request) {
  try {
    // Check for authentication
    const session = await getSessionUser();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    // Limit file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a temp file path with a unique name
    const tempFilePath = path.join(os.tmpdir(), `upload_${uuidv4()}${path.extname(file.name) || '.jpg'}`);
    
    // Write to temp file
    await writeFile(tempFilePath, buffer);
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        tempFilePath,
        { folder: "property_images" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: error.message 
    }, { status: 500 });
  }
}
