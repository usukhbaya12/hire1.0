import { Suspense } from "react";
import BlogDetailPage from "@/components/BlogDetailPage";
import { getBlogById } from "@/app/api/main";
import { api } from "@/app/utils/routes";

export async function generateMetadata({ params }) {
  try {
    const response = await getBlogById(params.id);
    const blog = response.success ? response.data : null;

    if (!blog) return { title: "Blog Post" };

    const imageUrl = blog.image
      ? `${api}file/${blog.image}`
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
    <Suspense fallback={<div>Loading...</div>}>
      <BlogDetailPage params={params} />
    </Suspense>
  );
}
