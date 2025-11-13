import { Suspense } from "react";
import BlogDetailPage from "@/components/Blog";
import { getBlogById } from "@/app/api/main";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const response = await getBlogById(id);
    const blog = response.success ? response.data : null;

    if (!blog) {
      return {
        title: "Blog Post",
        metadataBase: new URL("https://www.hire.mn"),
        openGraph: {
          images: ["/misc.png"],
        },
      };
    }

    const imageUrl = blog.image
      ? `/api/file/${blog.image}` // Relative URL - metadataBase will make it absolute
      : "/misc.png";

    return {
      metadataBase: new URL("https://www.hire.mn"), // This is critical!
      title: blog.title,
      description: blog.description || blog.title,
      openGraph: {
        title: blog.title,
        description: blog.description || blog.title,
        url: `/news/${id}`, // Relative - will become https://www.hire.mn/news/[id]
        siteName: "Hire.mn",
        images: [
          {
            url: imageUrl, // Relative URL
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        type: "article",
        locale: "mn_MN",
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.description || blog.title,
        images: [imageUrl], // Relative URL
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      metadataBase: new URL("https://www.hire.mn"),
      openGraph: {
        images: ["/misc.png"],
      },
    };
  }
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Уншиж байна...</div>}>
      <BlogDetailPage params={params} />
    </Suspense>
  );
}
