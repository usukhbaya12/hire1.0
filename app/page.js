// app/page.js

"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Buildings2BoldDuotone,
  FiltersBoldDuotone,
  MagniferBoldDuotone,
  NotesBoldDuotone,
  SquareArrowRightDownBoldDuotone,
  StarFall2BoldDuotone,
  UserCheckRoundedBoldDuotone,
  VerifiedCheckBoldDuotone,
  Wallet2BoldDuotone,
} from "solar-icons";
import { Input, Select, Empty } from "antd";
import Assessment from "@/components/Assessment";
import { DropdownIcon } from "@/components/Icons";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import AssessmentSkeleton from "@/components/Skeleton";
import { useAssessments } from "./utils/providers";

const AnimatedCounter = ({ value, duration = 2, loading = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let intervalId;
    let step = 1;

    if (loading) {
      intervalId = setInterval(() => {
        setCount((prev) => prev + step);
        step = Math.max(0.1, step - 0.05);
      }, 700);
    } else if (value != null) {
      let startTime;
      const startValue = count;
      const endValue = value;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min(
          (currentTime - startTime) / (duration * 1000),
          1
        );
        setCount(Math.floor(startValue + (endValue - startValue) * progress));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [loading, value, duration]);

  return (
    <div className="text-4xl font-black text-main">{Math.floor(count)}+</div>
  );
};

const Marquee = () => {
  const logos = Array.from({ length: 12 }, (_, i) => {
    const files = ["/mnums.png", "/ufe.png", "/axiom.png"];
    return files[i % files.length];
  });

  return (
    <div className="bg-white/95 backdrop-blur-md border-y border-gray-200 py-6 overflow-hidden">
      <div className="relative space-y-4">
        <div className="flex animate-marquee">
          {logos.map((logo, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 mx-8 w-32 h-16 relative opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                draggable={false}
                src={logo}
                alt="Company logo"
                fill
                className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
          {logos.map((logo, index) => (
            <div
              key={`row1-duplicate-${index}`}
              className="flex-shrink-0 mx-8 w-32 h-16 relative opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                draggable={false}
                src={logo}
                alt="Company logo"
                fill
                className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* <div className="flex animate-marquee-reverse">
          {logos.map((logo, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 mx-8 w-32 h-16 relative opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                draggable={false}
                src={logo}
                alt="Company logo"
                fill
                className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
          {logos.map((logo, index) => (
            <div
              key={`row2-duplicate-${index}`}
              className="flex-shrink-0 mx-8 w-32 h-16 relative opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <Image
                src={logo}
                draggable={false}
                alt="Company logo"
                fill
                className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div> */}

        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default function Home() {
  const { assessments, categories, home, loading } = useAssessments();
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const testsSectionRef = useRef(null);

  useEffect(() => {
    let result = [...assessments];

    if (searchTerm) {
      result = result.filter(
        (assessment) =>
          assessment.data.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          assessment.data.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== null && selectedCategory !== undefined) {
      result = result.filter(
        (assessment) => assessment.category.id === selectedCategory
      );
    }

    if (selectedPrice !== null && selectedPrice !== undefined) {
      result = result.filter(
        (assessment) => Number(assessment.data.price) === Number(selectedPrice)
      );
    }

    setFilteredAssessments(result);
  }, [searchTerm, selectedCategory, selectedPrice, assessments]);

  const getPriceOptions = (assessmentsData) => {
    if (!Array.isArray(assessmentsData)) return [];
    const uniquePrices = [
      ...new Set(assessmentsData.map((a) => a.data.price)),
    ].sort((a, b) => a - b);
    return uniquePrices.map((price) => ({
      value: price,
      label: price === 0 ? "Үнэгүй" : `${price.toLocaleString()}₮`,
    }));
  };

  const scrollToTestsTop = () => {
    if (testsSectionRef.current) {
      const yOffset = -70;
      const element = testsSectionRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    scrollToTestsTop();
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    scrollToTestsTop();
  };

  const handlePriceChange = (value) => {
    setSelectedPrice(value);
    scrollToTestsTop();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedPrice(null);
    scrollToTestsTop();
  };

  const featuredTests = assessments.filter((test) => test.data.status === 30);
  const popularTests = [...assessments]
    .sort((a, b) => (b.data.count || 0) - (a.data.count || 0))
    .slice(0, 3);

  const renderSkeletonCards = (count = 6) => {
    return Array(count)
      .fill(null)
      .map((_, index) => <AssessmentSkeleton key={`skeleton-${index}`} />);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* <div className="inset-0 fixed">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600 blur-[80px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600 blur-[100px]"
          />
          <div className="absolute top-40 inset-0 -z-10 flex items-center justify-center">
                <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#f36421]/70 via-[#ff6f3c]/70 to-[#ffb347]/70 blur-3xl opacity-30 animate-pulse" />
              </div>
        </div> */}

        <div className="relative">
          <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex sm:justify-end relative z-[1]"
            >
              <div className="absolute -top-40 sm:-top-60 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]">
                <Image
                  src="/brain-home.png"
                  alt="Brain icon"
                  fill
                  className="object-contain opacity-30"
                  priority
                  draggable={false}
                />
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-2 pt-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-main pt-1 hidden sm:block"
              >
                <SquareArrowRightDownBoldDuotone />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-3xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-black sm:max-w-xl bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent"
              >
                Онлайн тест, хөндлөнгийн үнэлгээ
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 mt-8 sm:mt-12 w-full sm:w-[55%] shadow shadow-slate-200 rounded-3xl sm:rounded-full bg-white/60 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center p-4"
              >
                <div className="flex justify-center gap-1">
                  <div className="text-main">
                    <UserCheckRoundedBoldDuotone />
                  </div>
                  <AnimatedCounter value={home?.exams} loading={loading} />
                </div>
                <div className="font-semibold">Тест өгсөн тоо</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center p-4"
              >
                <div className="flex justify-center gap-1">
                  <div className="text-main">
                    <Buildings2BoldDuotone />
                  </div>
                  <AnimatedCounter value={home?.orgs} loading={loading} />
                </div>
                <div className="font-semibold">Хамтрагч байгууллагууд</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center p-4"
              >
                <div className="flex justify-center gap-1">
                  <div className="text-main">
                    <NotesBoldDuotone />
                  </div>
                  <AnimatedCounter value={home?.count} loading={loading} />
                </div>
                <div className="font-semibold">Тестийн сан</div>
              </motion.div>
            </motion.div>

            <motion.div
              className="sm:hidden mt-8 w-full rounded-3xl bg-white/90 backdrop-blur-md py-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-1 py-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center px-4 pt-4"
                >
                  <div className="flex justify-center gap-1">
                    <div className="text-main">
                      <UserCheckRoundedBoldDuotone />
                    </div>
                    <AnimatedCounter value={home?.exams} loading={loading} />
                  </div>
                  <div className="font-semibold">Тест өгсөн тоо</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center px-4 pt-4"
                >
                  <div className="flex justify-center gap-1">
                    <div className="text-main">
                      <NotesBoldDuotone />
                    </div>
                    <AnimatedCounter value={home?.count} loading={loading} />
                  </div>
                  <div className="font-semibold">Тестийн сан</div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center p-4"
              >
                <div className="flex justify-center gap-1">
                  <div className="text-main">
                    <Buildings2BoldDuotone />
                  </div>
                  <AnimatedCounter value={home?.orgs} loading={loading} />
                </div>
                <div className="font-semibold">Хамтрагч байгууллагууд</div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-12"
              id="starred"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="font-black text-xl inline-flex gap-1 text-main"
              >
                <StarFall2BoldDuotone />
                Шинээр нэмэгдсэн
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {loading
                  ? renderSkeletonCards(3)
                  : featuredTests.map((assessment) => (
                      <Assessment
                        key={assessment.data.id}
                        assessment={assessment}
                      />
                    ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative h-16 sm:h-20 mt-6 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <svg
              className="absolute w-full h-full"
              viewBox="0 0 1440 60"
              preserveAspectRatio="none"
            >
              <path
                d="M0 20C240 10 480 0 720 10C960 20 1200 40 1440 30V60H0V20Z"
                fill="#FF6B00"
                fillOpacity="0.2"
              />
            </svg>
            <svg
              className="absolute w-full h-full translate-y-4"
              viewBox="0 0 1440 60"
              preserveAspectRatio="none"
            >
              <path
                d="M0 30C360 20 720 40 1080 30C1260 25 1440 20 1440 20V60H0V30Z"
                fill="#FF6B00"
                fillOpacity="0.4"
              />
            </svg>
            <svg
              className="absolute w-full h-full translate-y-8"
              viewBox="0 0 1440 60"
              preserveAspectRatio="none"
            >
              <path
                d="M0 20C200 30 400 15 600 20C800 25 1000 35 1440 25V60H0V20Z"
                fill="#f97316"
              />
            </svg>
          </motion.div>

          <motion.div
            className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 bg-orange-500 -mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            id="popular"
          >
            <div className="pt-8 sm:pt-6 pb-14">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="font-black text-xl inline-flex gap-1 text-white sm:pt-0 pt-6"
              >
                <VerifiedCheckBoldDuotone />
                Эрэлттэй
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {loading
                  ? renderSkeletonCards(3)
                  : popularTests.map((assessment) => (
                      <Assessment
                        key={assessment.data.id}
                        assessment={assessment}
                      />
                    ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-black text-xl inline-flex gap-1 text-main relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pb-4 pt-8 bg-white/95 backdrop-blur-md w-full"
            >
              <Buildings2BoldDuotone />
              Тест хамтран хөгжүүлэгч байгууллагууд
            </motion.div>
            <Marquee />
          </motion.div>

          <div
            ref={testsSectionRef}
            id="tests"
            className="bg-gray-50 relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pb-14"
          >
            <div className="sticky top-[72px] z-40 bg-gray-50 pb-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="font-black text-xl inline-flex gap-1 text-main mt-6 sm:mt-10"
              >
                <NotesBoldDuotone />
                Тестүүд
              </motion.div>

              <motion.div
                className="flex flex-col md:flex-row gap-3 sm:gap-6 pt-4 md:w-3/4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <Input
                  className="w-full min-w-[200px]"
                  prefix={
                    <MagniferBoldDuotone
                      color={"#f36421"}
                      width={18}
                      height={18}
                    />
                  }
                  placeholder="Нэрээр хайх"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                <Select
                  placeholder="Төрлөөр хайх"
                  suffixIcon={
                    <DropdownIcon width={15} height={15} color={"#f36421"} />
                  }
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  allowClear
                  className="w-full no-zoom"
                />
                <Select
                  className="w-full"
                  suffixIcon={
                    <DropdownIcon width={15} height={15} color={"#f36421"} />
                  }
                  placeholder="Төлбөрөөр шүүх"
                  options={getPriceOptions(assessments)}
                  value={selectedPrice}
                  onChange={handlePriceChange}
                  allowClear
                />
                <div
                  className="relative group cursor-pointer"
                  onClick={handleResetFilters}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
                    <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-1.5 px-7">
                      <FiltersBoldDuotone
                        width={17}
                        height={17}
                        className="text-main"
                      />
                      Арилгах
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {renderSkeletonCards(9)}
              </div>
            ) : filteredAssessments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {filteredAssessments.map((assessment) => (
                  <Assessment
                    key={assessment.data.id}
                    assessment={assessment}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-gray-300 mb-4">
                  <Empty description="Тест олдсонгүй." />
                </div>
              </div>
            )}
          </div>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Footer />
          </motion.footer>
        </div>
      </motion.div>
    </>
  );
}
