// app/page.js

"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import { Input, Select, Empty, Button } from "antd";
import Assessment from "@/components/Assessment";
import { DropdownIcon, XIcon } from "@/components/Icons";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import AssessmentSkeleton from "@/components/Skeleton";
import { useAssessments } from "./utils/providers";

const PriceRangeSlider = ({
  assessments,
  onPriceRangeChange,
  selectedRange,
}) => {
  const [localRange, setLocalRange] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef(null);

  const { minPrice, maxPrice, priceStep } = useMemo(() => {
    if (!assessments || assessments.length === 0) {
      return { minPrice: 0, maxPrice: 100000, priceStep: 1000 };
    }

    const prices = assessments
      .map((a) => a.data.price)
      .filter((price) => typeof price === "number" && price >= 0);

    const min = 0;
    const max = Math.max(...prices);

    const roundedMax = Math.ceil(max / 1000) * 1000;

    return {
      minPrice: min,
      maxPrice: roundedMax,
      priceStep: 1000,
    };
  }, [assessments]);

  // Initialize local range
  useEffect(() => {
    if (selectedRange && selectedRange.length === 2) {
      setLocalRange(selectedRange);
    } else {
      setLocalRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice, selectedRange]);

  // Handle slider interaction
  const handleMouseDown = (thumb) => (e) => {
    setIsDragging(thumb);
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !sliderRef.current) return;

      const slider = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (e.clientX - slider.left) / slider.width)
      );
      const value =
        Math.round((minPrice + percent * (maxPrice - minPrice)) / priceStep) *
        priceStep;

      setLocalRange((prev) => {
        const newRange = [...prev];
        if (isDragging === "min") {
          newRange[0] = Math.min(value, prev[1] - priceStep);
        } else {
          newRange[1] = Math.max(value, prev[0] + priceStep);
        }
        return newRange;
      });
    },
    [isDragging, minPrice, maxPrice, priceStep]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      onPriceRangeChange(localRange);
      setIsDragging(null);
    }
  }, [isDragging, localRange, onPriceRangeChange]);

  // Touch events for mobile
  const handleTouchStart = (thumb) => (e) => {
    setIsDragging(thumb);
    e.preventDefault();
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || !sliderRef.current) return;

      const touch = e.touches[0];
      const slider = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(1, (touch.clientX - slider.left) / slider.width)
      );
      const value =
        Math.round((minPrice + percent * (maxPrice - minPrice)) / priceStep) *
        priceStep;

      setLocalRange((prev) => {
        const newRange = [...prev];
        if (isDragging === "min") {
          newRange[0] = Math.min(value, prev[1] - priceStep);
        } else {
          newRange[1] = Math.max(value, prev[0] + priceStep);
        }
        return newRange;
      });
    },
    [isDragging, minPrice, maxPrice, priceStep]
  );

  const getPercentage = (value) =>
    ((value - minPrice) / (maxPrice - minPrice)) * 100;

  const formatPrice = (price) => {
    if (price === 0) return "Үнэгүй";
    return `${price.toLocaleString()}₮`;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="w-full md:w-64 px-3">
      {/* Single line display */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">
          {formatPrice(localRange[0])} - {formatPrice(localRange[1])}
        </span>
      </div>

      {/* Slider */}
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div
          ref={sliderRef}
          className="w-full h-2 bg-gray-200 rounded-full relative cursor-pointer"
        >
          {/* Active range */}
          <div
            className="absolute h-2 bg-gradient-to-r from-main to-secondary rounded-full"
            style={{
              left: `${getPercentage(localRange[0])}%`,
              width: `${
                getPercentage(localRange[1]) - getPercentage(localRange[0])
              }%`,
            }}
          />

          {/* Min thumb */}
          <div
            className="absolute w-4 h-4 bg-white border-2 border-main rounded-full cursor-pointer transform -translate-x-2 -translate-y-1 hover:scale-110 transition-transform shadow-md z-10"
            style={{ left: `${getPercentage(localRange[0])}%` }}
            onMouseDown={handleMouseDown("min")}
            onTouchStart={handleTouchStart("min")}
          />

          {/* Max thumb */}
          <div
            className="absolute w-4 h-4 bg-white border-2 border-main rounded-full cursor-pointer transform -translate-x-2 -translate-y-1 hover:scale-110 transition-transform shadow-md z-10"
            style={{ left: `${getPercentage(localRange[1])}%` }}
            onMouseDown={handleMouseDown("max")}
            onTouchStart={handleTouchStart("max")}
          />
        </div>
      </div>
    </div>
  );
};

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
  const [searchType, setSearchType] = useState("name");
  const [isInTestSection, setIsInTestSection] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 0]);

  const testsSectionRef = useRef(null);

  useEffect(() => {
    setFilteredAssessments([...assessments]);
  }, [assessments]);

  useEffect(() => {
    const handleScroll = () => {
      if (testsSectionRef.current) {
        const rect = testsSectionRef.current.getBoundingClientRect();
        const isVisible = rect.top <= 100 && rect.bottom >= 100;
        setIsInTestSection(isVisible);

        // Dispatch the event that Navbar is listening for
        window.dispatchEvent(
          new CustomEvent("testsVisibility", {
            detail: { isVisible },
          })
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      assessments &&
      assessments.length > 0 &&
      priceRange[0] === 0 &&
      priceRange[1] === 0
    ) {
      const prices = assessments
        .map((a) => a.data.price)
        .filter((price) => typeof price === "number" && price >= 0);

      if (prices.length > 0) {
        const minPrice = 0;
        const maxPrice = Math.ceil(Math.max(...prices) / 1000) * 1000;
        setPriceRange([minPrice, maxPrice]);
      } else {
        setPriceRange([0, 55000]);
      }
    }
  }, [assessments]);

  const scrollToTestsTop = () => {
    if (testsSectionRef.current) {
      const yOffset = -70;
      const element = testsSectionRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleSearchTypeChange = (value) => {
    setSearchType(value);
    // Reset all filters when changing search type
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedPrice(null);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedPrice(null);

    const prices = assessments
      .map((a) => a.data.price)
      .filter((price) => typeof price === "number" && price >= 0);

    if (prices.length > 0) {
      const minPrice = 0;
      const maxPrice = Math.ceil(Math.max(...prices) / 1000) * 1000;
      setPriceRange([minPrice, maxPrice]);
    } else {
      setPriceRange([0, 55000]);
    }

    setSearchType("name");
    setFilteredAssessments(assessments);
    // setCurrentPage(1);
  };

  const renderSkeletonCards = (count = 6) => {
    return Array(count)
      .fill(null)
      .map((_, index) => <AssessmentSkeleton key={`skeleton-${index}`} />);
  };

  const renderSearchInput = () => {
    switch (searchType) {
      case "name":
        return (
          <Input
            className="w-full md:w-64"
            prefix={
              <MagniferBoldDuotone color={"#f36421"} width={18} height={18} />
            }
            placeholder="Нэрээр хайх"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onPressEnter={(e) => setSearchTerm(e.target.value)}
          />
        );
      case "category":
        return (
          <Select
            placeholder="Төрлөө сонгох"
            suffixIcon={
              <DropdownIcon width={15} height={15} color={"#f36421"} />
            }
            options={categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            value={selectedCategory}
            onChange={setSelectedCategory}
            allowClear
            className="w-full md:w-64 no-zoom"
          />
        );
      case "price":
        return (
          <PriceRangeSlider
            assessments={assessments}
            onPriceRangeChange={(range) => {
              setPriceRange(range);
            }}
            selectedRange={priceRange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
                  : home.new.map((assessment) => (
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
                  : home.demand.map((assessment) => (
                      <Assessment
                        key={assessment?.data?.id}
                        assessment={assessment}
                      />
                    ))}
              </div>
            </div>
          </motion.div>
          <div ref={testsSectionRef} id="tests">
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
            <div className="bg-gray-50 relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pb-14">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="font-black text-xl inline-flex gap-1 text-main mt-6 sm:mt-10 mb-4"
              >
                <NotesBoldDuotone />
                Тестүүд
              </motion.div>

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
          </div>
          <AnimatePresence>
            {isInTestSection && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="fixed top-24 left-6 right-6 md:left-auto md:right-12 lg:right-16 xl:right-24 2xl:right-72 z-50"
              >
                {/* Desktop Layout */}
                <div className="hidden md:block bg-white/70 backdrop-blur-md shadow-xl shadow-slate-20 rounded-full p-3 pr-3 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Select
                      value={searchType}
                      onChange={handleSearchTypeChange}
                      suffixIcon={
                        <DropdownIcon
                          width={15}
                          height={15}
                          color={"#f36421"}
                        />
                      }
                      className="w-32 no-zoom flex-shrink-0"
                      options={[
                        { value: "name", label: "Нэрээр" },
                        { value: "category", label: "Төрлөөр" },
                        { value: "price", label: "Үнээр" },
                      ]}
                    />

                    {renderSearchInput()}

                    <Button
                      onClick={() => {
                        // Apply filters here
                        let result = [...assessments];

                        if (searchTerm) {
                          if (searchType === "name") {
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
                        }

                        if (
                          searchType === "category" &&
                          selectedCategory !== null &&
                          selectedCategory !== undefined
                        ) {
                          result = result.filter(
                            (assessment) =>
                              assessment.category.id === selectedCategory
                          );
                        }

                        if (
                          searchType === "price" &&
                          priceRange &&
                          priceRange.length === 2
                        ) {
                          result = result.filter((assessment) => {
                            const price = Number(assessment.data.price);
                            return (
                              price >= priceRange[0] && price <= priceRange[1]
                            );
                          });
                        }

                        setFilteredAssessments(result);
                        scrollToTestsTop();
                      }}
                      className="grd-btn"
                    >
                      <MagniferBoldDuotone width={16} height={16} />
                      <span>Хайх</span>
                    </Button>

                    <button
                      onClick={() => {
                        handleResetFilters();
                        setFilteredAssessments([...assessments]);
                        scrollToTestsTop();
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1 rounded-full transition-all duration-300 group relative flex-shrink-0"
                      title="Арилгах"
                    >
                      <XIcon width={22} height={22} />

                      {/* Desktop Tooltip */}
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                        Арилгах
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isInTestSection && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="md:hidden fixed top-[72px] w-full z-50"
              >
                <div className="md:hidden bg-white/70 backdrop-blur-md shadow-xl shadow-slate-200 p-3 px-6">
                  <div className="font-black text-xl inline-flex gap-1 text-main mt-2 mb-4">
                    <NotesBoldDuotone />
                    Тестүүд
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Select
                      value={searchType}
                      onChange={handleSearchTypeChange}
                      suffixIcon={
                        <DropdownIcon
                          width={15}
                          height={15}
                          color={"#f36421"}
                        />
                      }
                      className="min-w-30 max-w-30 no-zoom flex-shrink-0"
                      options={[
                        { value: "name", label: "Нэрээр" },
                        { value: "category", label: "Төрлөөр" },
                        { value: "price", label: "Үнээр" },
                      ]}
                    />

                    <div className="flex-1">{renderSearchInput()}</div>

                    <Button
                      onClick={() => {
                        // Apply filters here
                        let result = [...assessments];

                        if (searchTerm) {
                          if (searchType === "name") {
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
                        }

                        if (
                          searchType === "category" &&
                          selectedCategory !== null &&
                          selectedCategory !== undefined
                        ) {
                          result = result.filter(
                            (assessment) =>
                              assessment.category.id === selectedCategory
                          );
                        }

                        if (
                          searchType === "price" &&
                          priceRange &&
                          priceRange.length === 2
                        ) {
                          result = result.filter((assessment) => {
                            const price = Number(assessment.data.price);
                            return (
                              price >= priceRange[0] && price <= priceRange[1]
                            );
                          });
                        }

                        setFilteredAssessments(result);
                        scrollToTestsTop();
                      }}
                      className="grd-btn"
                    >
                      <MagniferBoldDuotone width={18} height={18} />
                    </Button>
                    <button
                      onClick={() => {
                        handleResetFilters();
                        setFilteredAssessments([...assessments]);
                        scrollToTestsTop();
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1.5 rounded-full transition-all duration-300 flex-shrink-0"
                      aria-label="Арилгах"
                    >
                      <XIcon width={22} height={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
