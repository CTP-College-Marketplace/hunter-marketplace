import { NextResponse } from "next/server";
import { BlobServiceClient } from "@azure/storage-blob";
import { Buffer } from "node:buffer";

// Ensure this route runs on the Node.js runtime (required for Buffer, etc.)
export const runtime = "nodejs";

// POST /api/upload
// Accepts multipart/form-data with field name "file"
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file field" }, { status: 400 });
    }

    // Basic validation: type and size (<= 5MB)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
    }
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
    }

    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const containerName = process.env.AZURE_STORAGE_CONTAINER || "images";
    if (!connectionString) {
      return NextResponse.json({ error: "Missing AZURE_STORAGE_CONNECTION_STRING" }, { status: 500 });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    // Ensure container exists (idempotent)
    await containerClient.createIfNotExists({ access: "blob" });

    const ext = file.type.split("/")[1] || "bin";
    const blobName = `${crypto.randomUUID()}.${ext}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const bytes = Buffer.from(await file.arrayBuffer());
    await blockBlobClient.upload(bytes, bytes.length, {
      blobHTTPHeaders: { blobContentType: file.type },
    });

    return NextResponse.json({
      url: blockBlobClient.url,
      name: blobName,
      contentType: file.type,
      size: file.size,
    });
  } catch (err: unknown) {
    console.error("Upload error", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


