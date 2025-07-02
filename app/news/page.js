"use client";

import React, { useState, useEffect, useCallback } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarBoldDuotone,
  ClipboardTextBoldDuotone,
  UserCircleBoldDuotone,
} from "solar-icons";
import { motion as m } from "framer-motion";

import { message, Button, Tag, Segmented } from "antd";
import { getBlogs } from "../api/main";
import { api } from "../utils/routes";

const BlogCard = ({ blog, featured = false }) => {
  const categoryMap = { 1: "Блог", 2: "Зөвлөмжүүд" };
  const imageUrl = blog?.image
    ? `${api}file/${blog.image}`
    : "/placeholder-blog.jpg";

  const formattedDate = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "-";

  if (featured) {
    return (
      <Link
        href={`/news/${blog.id}`}
        className="block group bg-white/70 backdrop-blur-md overflow-hidden transition-all duration-500 shadow hover:shadow-md hover:shadow-slate-200 shadow-slate-200 rounded-3xl cursor-pointer relative"
      >
        <div className="flex flex-col lg:flex-row">
          <div className="relative lg:w-1/2 aspect-video lg:aspect-auto h-64 lg:h-96 overflow-hidden rounded-t-3xl lg:rounded-tr-none">
            {blog.pinned && (
              <div className="absolute top-4 right-4 font-semibold bg-gradient-to-r from-main/90 to-main/70 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md z-10 shadow-sm">
                Онцлох
              </div>
            )}
            <Image
              draggable={false}
              src={imageUrl}
              alt={blog?.title || "Featured Blog"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transform transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
          <div className="p-6 lg:p-12 flex flex-col justify-between lg:w-1/2">
            <div className="space-y-3">
              <h2 className="text-xl lg:text-2xl font-extrabold group-hover:text-main transition-colors duration-300 leading-tight">
                {blog?.title || "Гарчиг"}
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-gray-800 font-semibold">
                  <UserCircleBoldDuotone width={22} className="text-blue-600" />
                  <span>{blog?.author?.name || "Hire.mn"}</span>
                </div>
                <div>•</div>
                <Tag
                  color="blue"
                  className="rounded-full font-semibold px-2.5 shadow"
                >
                  {categoryMap[blog?.category] || "Ангилалгүй"}
                </Tag>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CalendarBoldDuotone width={16} height={16} />
                <span>{formattedDate}</span>
                {blog?.minutes && (
                  <>
                    <span className="px-1">•</span>
                    <span>{blog.minutes} минут уншина</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/news/${blog.id}`}
      className="flex flex-col group bg-white/80 backdrop-blur-md overflow-hidden transition-all duration-500 shadow hover:shadow-md hover:shadow-slate-200 shadow-slate-200 rounded-3xl cursor-pointer h-full"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl bg-gray-100">
        <Image
          draggable={false}
          src={imageUrl}
          alt={blog?.title || "Blog photo"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transform transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="px-6 pb-6 pt-1 flex flex-col flex-grow">
        <h3 className="font-extrabold text-lg mt-3 mb-2 group-hover:text-main transition-colors duration-300 leading-snug">
          {blog?.title || "Гарчиг"}
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-800 font-semibold">
            <UserCircleBoldDuotone width={22} className="text-blue-600" />
            <span>{blog?.author?.name || "Hire.mn"}</span>
          </div>
          <div>•</div>
          <Tag
            color="blue"
            className="rounded-full font-semibold px-2.5 shadow self-start"
          >
            {categoryMap[blog?.category] || "Ангилалгүй"}
          </Tag>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-auto pt-3">
          <CalendarBoldDuotone width={16} height={16} />
          <span>{formattedDate}</span>
          {blog?.minutes && (
            <>
              <span className="px-1">•</span>
              <span>{blog.minutes} минут</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default function News() {
  const [blogs, setBlogs] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0,
  });
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const categoryOptions = [
    { label: "Бүгд", value: 0 },
    { label: "Блог", value: 1 },
    { label: "Зөвлөмжүүд", value: 2 },
  ];

  const fetchBlogData = useCallback(
    async (
      page = 1,
      category = activeCategory,
      limit = pagination.pageSize,
      loadMore = false
    ) => {
      if (!loadMore) {
        setLoading(true);

        setBlogs([]);
        setFeaturedBlog(null);
      } else {
        setLoadMoreLoading(true);
      }
      setError(null);

      try {
        const response = await getBlogs(category, limit, page);
        if (response.success && response.data?.data) {
          const fetchedBlogs = response.data.data;
          let pinned = null;
          let regular = [];

          if (page === 1 && category === 0) {
            pinned = fetchedBlogs.find((blog) => blog.pinned);
            regular = fetchedBlogs.filter((blog) => !blog.pinned);
            setFeaturedBlog(pinned);
          } else {
            regular = fetchedBlogs;

            if (page === 1) setFeaturedBlog(null);
          }

          setBlogs((prev) => (page === 1 ? regular : [...prev, ...regular]));

          setPagination((prev) => ({
            ...prev,
            current: page,
            total: response.data.total || 0,
          }));
        } else {
          throw new Error(
            response.message || "Блог мэдээллийг татахад алдаа гарлаа."
          );
        }
      } catch (err) {
        setError(err.message);
        messageApi.error(err.message);
        console.error("Fetch blogs error:", err);
        setBlogs([]);
        setFeaturedBlog(null);
      } finally {
        setLoading(false);
        setLoadMoreLoading(false);
      }
    },
    [activeCategory, pagination.pageSize, messageApi]
  );

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchBlogData(1, activeCategory, pagination.pageSize, false);
  }, [activeCategory]);

  const handleLoadMore = () => {
    const nextPage = pagination.current + 1;
    fetchBlogData(nextPage, activeCategory, pagination.pageSize, true);
  };

  const displayedCount = blogs.length + (featuredBlog ? 1 : 0);
  const hasMoreBlogs = !loading && displayedCount < pagination.total;

  return (
    <div>
      {contextHolder}
      <title>Hire.mn</title>
      <div className="inset-0 fixed -z-10">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/25 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/25 blur-[100px]" />
      </div>
      <div className="relative">
        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6">
          <div className="pt-20 pb-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center">
                <ClipboardTextBoldDuotone
                  className="text-main"
                  width={32}
                  height={32}
                />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent text-center">
                Блог, зөвлөмжүүд
              </h1>
            </m.div>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-end mt-6"
            >
              <Segmented
                options={categoryOptions}
                value={activeCategory}
                disabled={
                  loading && pagination.current === 1 && !loadMoreLoading
                }
                onChange={(value) => {
                  if (!loading) {
                    setActiveCategory(value);
                  }
                }}
                className="bg-white/70 backdrop-blur-md"
              />
            </m.div>
          </div>

          {error && !loading && (
            <div className="text-center py-20 text-red-600">
              Алдаа гарлаа: {error}{" "}
              <Button
                onClick={() =>
                  fetchBlogData(1, activeCategory, pagination.pageSize, false)
                }
              >
                Дахин оролдох
              </Button>
            </div>
          )}
          {!loading &&
            featuredBlog &&
            activeCategory === 0 &&
            pagination.current === 1 && (
              <m.div
                key="featured-blog"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6 md:mb-12"
              >
                <BlogCard blog={featuredBlog} featured />
              </m.div>
            )}

          {!loading && blogs.length === 0 && !featuredBlog && !error && (
            <m.div
              key="no-blogs-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center py-20 text-gray-500"
            >
              Мэдээлэл олдсонгүй.
            </m.div>
          )}
          {blogs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog, index) => (
                <m.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,

                    delay:
                      (index % pagination.pageSize) * 0.07 +
                      (pagination.current === 1 && featuredBlog ? 0.3 : 0.1),
                  }}
                >
                  <BlogCard blog={blog} />
                </m.div>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-8 pb-14 min-h-[80px]">
            {hasMoreBlogs && !error && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  onClick={handleLoadMore}
                  loading={loadMoreLoading}
                  disabled={loadMoreLoading}
                  size="large"
                  className="relative group !rounded-full !border !border-main/10 !bg-gradient-to-br !from-main/20 !to-main/10 hover:!border-main/30 transition-all duration-300"
                >
                  <span className="relative font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-1 px-5">
                    Цааш үзэх
                  </span>
                </Button>
              </m.div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
