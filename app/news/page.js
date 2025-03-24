"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import { CalendarBoldDuotone } from "solar-icons";
import { motion as m } from "framer-motion";

const BlogCard = ({ featured = false }) => {
  if (featured) {
    return (
      <div className="group bg-white/70 backdrop-blur-md overflow-hidden transition-all duration-500 shadow shadow-slate-200 rounded-full cursor-pointer relative">
        <div className="flex flex-col lg:flex-row">
          <div className="relative lg:w-1/2 h-64 lg:h-96 overflow-hidden rounded-l-full">
            <div className="absolute top-4 right-4 font-semibold bg-gradient-to-r from-main/80 to-main/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md z-10">
              Онцлох
            </div>
            <Image
              src="https://srv666826.hstgr.cloud/api/v1/file/1739445175590-image1_0%20(1).jpg"
              alt="Blog photo"
              fill
              className="object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="p-6 lg:p-12 flex flex-col justify-between lg:w-1/2">
            <div className="space-y-4">
              <div className="inline-flex px-3 py-1 bg-neutral/50 rounded-full text-sm">
                Ангилал
              </div>
              <h2 className="text-xl pl-1 lg:text-2xl font-extrabold group-hover:text-main transition-colors duration-300">
                Блогийн гарчиг
              </h2>
            </div>
            <div>
              <div className="pl-1 flex items-center gap-2 text-sm text-gray-700 mt-6">
                <div className="w-4 h-4 bg-gray-700 rounded-full mr-0.5"></div>
                <span>Б.Нандин-Эрдэнэ</span>
              </div>
              <div className="pl-1 flex items-center gap-2 text-sm text-gray-700 mt-2">
                <CalendarBoldDuotone width={18} height={18} />
                <span>2025.02.19</span>
                <span className="px-2">•</span>
                <span>1 минут уншина</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white/80 backdrop-blur-md overflow-hidden transition-all duration-500 shadow shadow-slate-200 rounded-3xl cursor-pointer h-full">
      <div className="flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden rounded-t-3xl">
          <Image
            src="https://srv666826.hstgr.cloud/api/v1/file/1739445175590-image1_0%20(1).jpg"
            alt="Blog photo"
            fill
            className="object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="inline-flex px-3 py-1 bg-neutral/50 rounded-full text-sm self-start">
            Ангилал
          </div>
          <h3 className="pl-1 font-extrabold text-base mt-4 group-hover:text-main transition-colors duration-300">
            Блогийн гарчиг
          </h3>
          <div className="pl-1 flex items-center gap-2 text-sm text-gray-700 mt-3">
            <div className="w-4 h-4 bg-gray-700 rounded-full mr-0.5"></div>
            <span>Б.Нандин-Эрдэнэ</span>
          </div>
          <div className="pl-1 flex items-center gap-1 text-sm text-gray-500 mt-3 pb-2">
            <CalendarBoldDuotone width={18} height={18} />
            <span>2025.02.19</span>
            <span className="px-1">•</span>
            <span>1 минут уншина</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function News() {
  return (
    <div className="min-h-screen">
      {/* Background gradients */}
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/25 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/25 blur-[100px]" />
      </div>

      <div className="relative">
        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6">
          <div className="pt-20">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center font-black text-3xl bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent"
            >
              Блог, зөвлөмжүүд
            </m.div>
          </div>

          {/* Featured article */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12"
          >
            <BlogCard featured />
          </m.div>

          {/* Orange section */}
          <div>
            <div className="py-14">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((index) => (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                  >
                    <BlogCard />
                  </m.div>
                ))}
              </div>
            </div>
          </div>

          {/* Load More Button */}
          <m.div
            className="flex justify-center pb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button className="bg-main hover:bg-secondary text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              Цааш үзэх
            </button>
          </m.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
