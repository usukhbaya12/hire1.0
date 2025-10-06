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
