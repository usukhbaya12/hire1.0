"use server";

import { NextResponse } from "next/server";
import { api } from "@/app/utils/routes";

const fileCache = new Map();
const MEMORY_CACHE_SIZE = 50;
const MEMORY_CACHE_TTL = 1000 * 60 * 60;

export async function GET(request, { params }) {
  const fileId = (await params).id;

  if (!fileId) {
    return new NextResponse("File ID is required", { status: 400 });
  }

  try {
    const cached = fileCache.get(fileId);
    if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
      return new NextResponse(cached.buffer, {
        status: 200,
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Cache": "HIT",
        },
      });
    }

    const backendUrl = `${api}file/${fileId}`;

    const response = await fetch(backendUrl, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new NextResponse("File not found", { status: 404 });
      }
      throw new Error(`Backend returned ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const fileBuffer = await response.arrayBuffer();

    if (fileCache.size >= MEMORY_CACHE_SIZE) {
      const firstKey = fileCache.keys().next().value;
      fileCache.delete(firstKey);
    }
    fileCache.set(fileId, {
      buffer: fileBuffer,
      contentType,
      timestamp: Date.now(),
    });

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000",
        "Vercel-CDN-Cache-Control": "public, max-age=31536000",
        "Surrogate-Control": "public, max-age=31536000",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error(`Error fetching file ${fileId}:`, error);

    if (error.name === "TimeoutError") {
      return new NextResponse("Request timeout", { status: 504 });
    }

    return new NextResponse("Error fetching file", {
      status: 500,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }
}

export async function DELETE(request, { params }) {
  const fileId = (await params).id;

  if (fileId && fileCache.has(fileId)) {
    fileCache.delete(fileId);
    return NextResponse.json({ success: true, message: "Cache cleared" });
  }

  return NextResponse.json(
    { success: false, message: "Not found in cache" },
    { status: 404 }
  );
}
