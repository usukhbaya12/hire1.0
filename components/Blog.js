"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  CalendarBoldDuotone,
  LinkMinimalistic2Bold,
  UserCircleBoldDuotone,
} from "solar-icons";
import { Spin, message, Button, Breadcrumb } from "antd";
import { api } from "@/app/utils/routes";
import { getBlogById } from "@/app/api/main";
import DOMPurify from "dompurify";
import Link from "next/link";
import { LoadingOutlined } from "@ant-design/icons";
import DynamicMetaTags from "./Meta";
import NotFoundPage from "@/app/not-found";
import LoadingSpinner from "./Spin";

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
    ? new Date(blog.createdAt).toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "-";

  const copyLinkToClipboard = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl);
      messageApi.success("Амжилттай хуулагдлаа.");
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

  console.log(blog);
  return (
    <div>
      {blog && <DynamicMetaTags metadata={metadata} />}

      <title>{blog?.title}</title>
      {contextHolder}
      <div className="relative flex flex-col">
        <main className="flex-grow py-3 sm:py-12">
          {error && !loading && <NotFoundPage />}
          {!loading && !error && blog && (
            <>
              {imageUrl && (
                <div className="relative w-full max-h-[180px] h-[180px] md:max-h-[350px] md:h-[350px]">
                  <Image
                    src={imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover shadow shadow-slate-200"
                    priority
                  />
                </div>
              )}
              <article className="max-w-2xl mx-auto overflow-hidden p-6">
                <Breadcrumb
                  items={[
                    { title: <Link href="/">Нүүр</Link> },
                    { title: <Link href="/news">Блог, зөвлөмжүүд</Link> },
                  ]}
                  className="mb-4 mt-0 md:mt-2"
                />
                <h1 className="text-3xl lg:text-4xl font-black mb-4 text-gray-900 leading-tight">
                  {blog.title}
                </h1>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                    <div className="flex items-center gap-1 text-gray-800 font-semibold">
                      <UserCircleBoldDuotone
                        width={22}
                        className="text-blue-600"
                      />
                      <span>{blog?.author?.name || "Hire.mn"}</span>
                    </div>
                    <span>•</span>

                    <div className="flex items-center gap-1">
                      <CalendarBoldDuotone width={18} height={18} />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={shareOnFacebook}
                      className="flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                      title="Share on Facebook"
                    >
                      <Image
                        src="/facebook.png"
                        alt="Facebook icon"
                        width={18}
                        height={18}
                        priority
                        className="hover:opacity-70 transition-opacity"
                      />
                    </button>
                    <button
                      onClick={copyLinkToClipboard}
                      className="text-main hover:text-secondary transition-colors cursor-pointer"
                      title="Copy link"
                    >
                      <LinkMinimalistic2Bold width={20} />
                    </button>
                  </div>
                </div>
                <div
                  className="prose prose-lg max-w-none prose-img:rounded-lg prose-a:text-blue-600 hover:prose-a:text-blue-800 text-justify"
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
