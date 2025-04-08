import BlogDetailPage from "@/components/Blog";
import { getBlogById } from "@/app/api/main";
import { api } from "@/app/utils/routes";

export async function generateMetadata({ params }) {
  try {
    const response = await getBlogById(params.id);
    const blog = response.success ? response.data : null;

    if (!blog) return { title: "Blog Post" };

    const imageUrl = blog.image ? `${api}file/${blog.image}` : null;

    return {
      title: blog.title,
      openGraph: {
        title: blog.title,
        description: blog.description || blog.title.substring(0, 100),
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: blog.title,
              },
            ]
          : [],
        locale: "mn_MN",
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "Blog Post",
    };
  }
}

export default function Page({ params }) {
  return <BlogDetailPage params={params} />;
}
