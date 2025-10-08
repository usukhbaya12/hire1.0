import { Suspense } from "react";
import BlogDetailPage from "@/components/Blog";
import { getBlogById } from "@/app/api/main";
import { api } from "@/app/utils/routes";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const response = await getBlogById(id);
    const blog = response.success ? response.data : null;

    if (!blog) {
      return {
        title: "Blog Post",
        openGraph: {
          images: ["https://www.hire.mn/misc.png"],
        },
      };
    }

    const imageUrl = blog.image
      ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://hire.mn"}/api/file/${
          blog.image
        }`
      : "https://www.hire.mn/misc.png";

    return {
      title: blog.title,
      description: blog.description || blog.title,
      openGraph: {
        title: blog.title,
        description: blog.description || blog.title,
        url: blogUrl,
        siteName: "Hire.mn",
        images: [
          {
            url: imageUrl,
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
        images: [imageUrl],
      },
    };
  } catch (error) {
    return { title: "Blog Post" };
  }
}

export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Уншиж байна...</div>}>
      <BlogDetailPage params={params} />
    </Suspense>
  );
}
