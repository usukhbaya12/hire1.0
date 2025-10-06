/**
 * Get file URL using the proxy API route
 * This hides the backend URL and enables caching
 *
 * @param {string} fileId - The file ID from the backend
 * @param {Object} options - Optional configuration
 * @returns {string} The proxied file URL
 */
export function getFileUrl(fileId, options = {}) {
  if (!fileId) {
    return options.fallback || null;
  }

  if (options.absolute) {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://hire.mn");
    return `${baseUrl}/api/file/${fileId}`;
  }

  // For relative URLs (most common case)
  return `/api/file/${fileId}`;
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(fileId, fallback = "/placeholder-blog.jpg") {
  return getFileUrl(fileId, { fallback });
}

export function getAbsoluteImageUrl(
  fileId,
  fallback = "https://www.hire.mn/misc.png"
) {
  return getFileUrl(fileId, { absolute: true, fallback });
}

// ============================================
// USAGE EXAMPLES:
// ============================================

// Example 1: In components/Blog.js
import { getImageUrl } from "@/app/utils/fileUrl";

const imageUrl = getImageUrl(blog?.image);

// Example 2: In app/news/page.js
import { getImageUrl } from "@/app/utils/fileUrl";

const imageUrl = getImageUrl(blog.image, "/placeholder-blog.jpg");

// Example 3: In metadata (app/news/[id]/page.js)
import { getAbsoluteImageUrl } from "@/app/utils/fileUrl";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const response = await getBlogById(id);
  const blog = response.success ? response.data : null;

  if (!blog) return { title: "Blog Post" };

  return {
    title: blog.title,
    description: blog.description || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.description || blog.title,
      images: [
        {
          url: getAbsoluteImageUrl(blog.image, "https://www.hire.mn/misc.png"),
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
    },
  };
}

// Example 4: In API routes (app/api/test/[id]/route.js)
import { getAbsoluteImageUrl } from "@/app/utils/fileUrl";

async function drawBackground(ctx, icons) {
  const imageUrl = getAbsoluteImageUrl(icons, PLACEHOLDER_IMG_URL);
  try {
    const image = await loadImage(imageUrl);
    // ... rest of your code
  } catch (e) {
    console.error("Error loading image:", e);
  }
}
