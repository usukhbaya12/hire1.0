import { Suspense } from "react";
import BlogDetailPage from "@/components/Blog";
import { getBlogById } from "@/app/api/main";
import { api } from "@/app/utils/routes";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const response = await getBlogById(id);
    const blog = response.success ? response.data : null;

    if (!blog) return { title: "Blog Post" };

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
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        type: "article",
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
