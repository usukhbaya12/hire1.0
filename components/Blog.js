"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import {
  CalendarBoldDuotone,
  Home1BoldDuotone,
  LinkMinimalistic2Bold,
  UserCircleBoldDuotone,
  UserLineDuotone,
} from "solar-icons";
import { Spin, message, Image, Breadcrumb, Divider } from "antd";
import { api } from "@/app/utils/routes";
import { getBlogById } from "@/app/api/main";
import DOMPurify from "dompurify";
import Link from "next/link";
import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import DynamicMetaTags from "./Meta";
import NotFoundPage from "@/app/not-found";
import LoadingSpinner from "./Spin";
import News from "@/app/news/page";
import dayjs from "dayjs";

const createMarkup = (htmlContent) => {
  if (typeof window !== "undefined") {
    return { __html: DOMPurify.sanitize(htmlContent) };
  }

  return { __html: "" };
};

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const categoryMap = { 1: "Блог", 2: "Зөвлөмжүүд" };

  const blogId = params?.id;

  useEffect(() => {
    if (!blogId) {
      setError("Blog ID is missing.");
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getBlogById(blogId);
        if (response.success && response.data) {
          setBlog(response.data);
        } else {
          throw new Error(response.message || "Блог олдсонгүй.");
        }
      } catch (err) {
        setError(err.message);
        messageApi.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, messageApi, router]);

  const imageUrl = blog?.image ? `${api}file/${blog.image}` : null;

  const metadata = blog
    ? {
        title: blog.title,
        description: "",
        image: imageUrl,
        url: typeof window !== "undefined" ? window.location.href : "",
        type: "article",
      }
    : null;

  const formattedDate = blog?.createdAt
    ? dayjs(blog.createdAt).format("YYYY-MM-DD")
    : null;

  const copyLinkToClipboard = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl);
      messageApi.success("Линк хуулсан.");
    }
  };

  const shareOnFacebook = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      window.open(facebookShareUrl, "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {blog && <DynamicMetaTags metadata={metadata} />}

      <title>{blog?.title}</title>
      {contextHolder}
      <div className="relative flex flex-col bg-gradient-to-b from-gray-100 to-white">
        <main className="flex-grow py-3 sm:py-12">
          {error && !loading && <NotFoundPage />}
          {!loading && !error && blog && (
            <>
              {imageUrl && (
                <div className="relative w-full h-[180px] md:h-[350px] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-repeat-x bg-top"
                    style={{
                      backgroundImage: imageUrl
                        ? `url(${imageUrl})`
                        : `url(/misc.png)`,
                      backgroundSize: "auto 100%",
                      backgroundColor: "#f3f4f6",
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-white/80" />
                </div>
              )}

              <article className="max-w-2xl mx-auto overflow-hidden pt-6 px-6 pb-2">
                <Breadcrumb
                  items={[
                    {
                      title: (
                        <Link href="/">
                          <HomeOutlined />
                        </Link>
                      ),
                    },
                    { title: <Link href="/news">Блог, зөвлөмжүүд</Link> },
                  ]}
                  className="mb-4 mt-0 md:mt-2"
                />
                <h1 className="text-3xl lg:text-4xl font-black mb-4 text-gray-900 leading-tight">
                  {blog.title}
                </h1>
                <Divider />
                <div className="flex items-center justify-between my-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-500 px-3 py-1.5 rounded-3xl border border-orange-200">
                      <UserLineDuotone width={16} height={16} />
                      <span className="font-semibold text-sm truncate max-w-[220px]">
                        {blog?.user?.firstname || "Hire.mn"}
                      </span>
                    </div>

                    <div className="w-fit flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 text-sm">
                      {formattedDate && <CalendarBoldDuotone width={16} />}
                      {formattedDate && (
                        <span className="font-semibold">{formattedDate}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={shareOnFacebook}
                      className="flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                      title="Фэйсбүүкт хуваалцах"
                    >
                      <img
                        src="/facebook.png"
                        alt="Facebook icon"
                        width={20}
                        height={20}
                        className="hover:opacity-70 transition-opacity"
                      />
                    </button>
                    <button
                      onClick={copyLinkToClipboard}
                      className="text-main hover:text-secondary transition-colors hover:scale-105 cursor-pointer"
                      title="Линк хуулах"
                    >
                      <LinkMinimalistic2Bold width={22} />
                    </button>
                  </div>
                </div>
                {imageUrl && (
                  <div className="pt-1">
                    <Image draggable={false} src={imageUrl} preview={true} />
                  </div>
                )}
                <Divider />
                <div
                  className="mt-6 mb-6 prose prose-lg max-w-none prose-img:rounded-lg prose-a:text-blue-600 hover:prose-a:text-blue-800 text-justify"
                  dangerouslySetInnerHTML={createMarkup(blog.content)}
                />
              </article>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
