"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import {
  CalendarBoldDuotone,
  ClipboardTextBoldDuotone,
  TagBoldDuotone,
  ClockCircleBoldDuotone,
  PinBoldDuotone,
  ArrowRight,
  UserLineDuotone,
} from "solar-icons";
import { motion as m } from "framer-motion";
import { message, Button, Segmented } from "antd";
import { getBlogs } from "../api/main";
import { api } from "../utils/routes";
import dayjs from "dayjs";

const BlogSkeleton = () => (
  <div className="group relative backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/70 to-white/60 border border-white/30 shadow-lg shadow-black/10 rounded-[28px] overflow-hidden animate-pulse">
    <div className="flex flex-col gap-3">
      <div className="relative z-10 p-2.5 space-y-5">
        <div className="relative aspect-[1.5/1] overflow-hidden rounded-3xl bg-gray-200 w-full" />
      </div>
      <div className="space-y-3 pb-7 px-7">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="flex items-center gap-4 pt-2">
          <div className="h-8 bg-gray-200 rounded-full w-36" />
        </div>
        <div className="flex items-center gap-4 pt-2">
          <div className="h-8 bg-gray-200 rounded-full w-20" />
          <div className="h-8 bg-gray-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  </div>
);

const BlogCard = ({ blog, disablePinnedLayout = false }) => {
  const isPinned = blog.pinned;
  const categoryMap = { 1: "Блог", 2: "Зөвлөмжүүд" };
  const imageUrl = blog.image
    ? `${api}file/${blog.image}`
    : "/placeholder-blog.jpg";

  const formattedDate = blog.createdAt
    ? dayjs(blog.createdAt).format("YYYY-MM-DD")
    : null;

  const BlurImage = ({ src, alt }) => {
    const [isLoading, setLoading] = useState(true);
    return (
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        className={`object-cover w-full h-full duration-700 ease-in-out ${
          isLoading ? "scale-110 blur-lg" : "scale-100 blur-0"
        } transform transition-transform group-hover:scale-110`}
        onLoad={() => setLoading(false)}
      />
    );
  };

  const CardContent = () => (
    <div
      className={`relative flex flex-col flex-grow ${
        isPinned && !disablePinnedLayout
          ? "justify-between pb-6 px-6 pt-4 lg:p-8 lg:pt-16"
          : "space-y-2 pb-6 px-6 pt-4"
      }`}
    >
      <h3
        className={`font-extrabold transition-colors duration-500 group-hover:text-main leading-tight line-clamp-4 h-[3.75rem] ${
          isPinned && !disablePinnedLayout
            ? "text-xl lg:text-2xl font-black"
            : "text-lg"
        }`}
      >
        {blog.title}
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 text-orange-500 px-3 py-1.5 rounded-3xl border border-orange-200">
            <UserLineDuotone width={16} height={16} />
            <span className="font-semibold text-sm truncate max-w-[220px]">
              Hire.mn
            </span>
          </div>
        </div>
        <div
          className={`flex gap-2 ${
            isPinned && !disablePinnedLayout ? "flex-col" : "items-center"
          }`}
        >
          <div className="w-fit flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 text-sm">
            {formattedDate && <CalendarBoldDuotone width={16} />}
            {formattedDate && (
              <span className="font-semibold">{formattedDate}</span>
            )}
          </div>
          <div className="w-fit flex items-center gap-2 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 text-sm">
            {blog.minutes && <ClockCircleBoldDuotone width={16} />}
            {blog.minutes && (
              <span className="font-semibold">
                {blog.minutes} минут{" "}
                {isPinned && !disablePinnedLayout && "уншина"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CardImage = ({ className = "" }) => (
    <div className={`relative overflow-hidden ${className}`}>
      <BlurImage src={imageUrl} alt={blog.title} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
        <div className="flex items-center gap-1 font-bold text-white text-lg transform transition-transform group-hover:scale-105">
          <span>
            {isPinned && !disablePinnedLayout ? "Дэлгэрэнгүй унших" : "Унших"}
          </span>
          <ArrowRight width={16} />
        </div>
      </div>
      <div className="absolute left-3 bottom-3 text-white px-3 py-1 rounded-full font-semibold backdrop-blur-md bg-black/20 border border-white/20 flex items-center gap-1.5">
        <TagBoldDuotone width={14} />
        {categoryMap[blog?.category] || "Ангилалгүй"}
      </div>
      {isPinned && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 backdrop-blur-md bg-gradient-to-r from-main/80 to-main/70 text-white px-3 py-1 rounded-full font-semibold border border-white/20 shadow-md">
          <PinBoldDuotone width={16} /> Онцлох
        </div>
      )}
    </div>
  );

  const renderPinnedLayout = isPinned && !disablePinnedLayout;

  return (
    <Link
      href={`/news/${blog.id}`}
      className="group relative block h-full w-full"
    >
      <div className="relative flex h-full flex-col backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/70 to-white/60 border border-white/30 shadow-lg shadow-black/10 rounded-[28px] overflow-hidden transition-all duration-700 hover:shadow-xl hover:shadow-black/15 cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-secondary/5 to-main/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl -z-10" />

        {renderPinnedLayout && (
          <div className="hidden lg:flex lg:flex-row h-full">
            <div className="relative lg:w-1/2 p-2.5">
              <CardImage className="h-full aspect-[1.5/1] rounded-3xl" />
            </div>
            <div className="lg:w-1/2 flex">
              <CardContent />
            </div>
          </div>
        )}

        <div className={renderPinnedLayout ? "block lg:hidden" : "block"}>
          <div className="relative z-10 p-2.5">
            <CardImage className="aspect-[1.5/1] rounded-3xl" />
          </div>
          <CardContent />
        </div>
      </div>
    </Link>
  );
};

export default function News() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [blogPages, setBlogPages] = useState({ 0: 1, 1: 1, 2: 1 });
  const [blogData, setBlogData] = useState({ 0: [], 1: [], 2: [] });
  const [totalCounts, setTotalCounts] = useState({ 0: 0, 1: 0, 2: 0 });
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchBlogs = async (category, page = 1) => {
    setLoading(true);
    try {
      const res = await getBlogs(10, page, category);
      if (res.success) {
        let blogs = res.data || [];

        if (category === 0 && page === 1) {
          const pinned = blogs.find((b) => b.pinned);
          setFeaturedBlog(pinned || null);
          blogs = blogs.filter((b) => !b.pinned);
        }

        setBlogData((prev) => ({
          ...prev,
          [category]: page === 1 ? blogs : [...prev[category], ...blogs],
        }));
        setTotalCounts((prev) => ({
          ...prev,
          [category]: res.count || 0,
        }));
        setBlogPages((prev) => ({ ...prev, [category]: page }));
      } else {
        messageApi.error(res.message || "Мэдээлэл татаж чадсангүй.");
      }
    } catch (err) {
      console.error(err);
      messageApi.error("Мэдээлэл татаж чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(activeCategory, 1);
  }, [activeCategory]);

  const blogs = blogData[activeCategory] || [];
  const total = totalCounts[activeCategory] || 0;
  const currentPage = blogPages[activeCategory] || 1;

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = (currentPage || 1) + 1;
      const res = await getBlogs(10, nextPage, activeCategory);

      setBlogData((prev) => ({
        ...prev,
        [activeCategory]: [
          ...(prev[activeCategory] || []),
          ...(res?.data || []),
        ],
      }));
      setBlogPages((prev) => ({ ...prev, [activeCategory]: nextPage }));
    } catch (err) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      {contextHolder}
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
            <h2 className="text-3xl font-black bg-gradient-to-r from-main via-pink-500 to-secondary bg-clip-text text-transparent tracking-tight leading-[1.1]">
              Блог, зөвлөмжүүд
            </h2>
          </m.div>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-end mt-6"
          >
            <Segmented
              options={[
                { label: "Бүгд", value: 0 },
                { label: "Блог", value: 1 },
                { label: "Зөвлөмжүүд", value: 2 },
              ]}
              value={activeCategory}
              onChange={setActiveCategory}
              className="bg-white/70 backdrop-blur-md"
            />
          </m.div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && activeCategory === 0 && featuredBlog && (
          <m.div
            key="featured"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 md:mb-12"
          >
            <BlogCard blog={featuredBlog} />
          </m.div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Өгөгдөл олдсонгүй.
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <m.div
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                <BlogCard
                  blog={blog}
                  disablePinnedLayout={activeCategory !== 0}
                />
              </m.div>
            ))}
          </div>
        )}

        {!loading &&
          blogs.length > 0 &&
          blogs.length + (activeCategory === 0 && featuredBlog ? 1 : 0) <
            total && (
            <div className="flex justify-center mt-8">
              <Button
                className="grd-btn h-10 w-[172px]"
                onClick={handleLoadMore}
                loading={loadingMore}
              >
                Цааш үзэх
              </Button>
            </div>
          )}
      </div>
      <div className="pb-16"></div>
      <Footer />
    </div>
  );
}
