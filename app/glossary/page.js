"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Input } from "antd";
import {
  MagniferBoldDuotone,
  BookBoldDuotone,
  BookOpenTextBoldDuotone,
  SquareArrowRightDownBoldDuotone,
  File,
  Book2BoldDuotone,
} from "solar-icons";

// Sample glossary data - replace with your actual terms
const glossaryData = [
  {
    id: "assessment",
    term: "Assessment",
    mongolian: "Үнэлгээ",
    definition:
      "Хувь хүний ур чадвар, зан төлөв, мэдлэгийг үнэлэх зорилготой сорил. Үнэлгээг ажил олгогчид нь ажилтан сонгох, ажилтны ур чадварыг тодорхойлох зорилгоор ашигладаг.",
    category: "HR",
  },
  {
    id: "hard-skills",
    term: "Hard Skills",
    mongolian: "Мэргэжлийн ур чадвар",
    definition:
      "Сургалт, хичээл, эсвэл дадлагаар олж авсан тодорхой, хэмжигдэхүйц чадварууд. Програмчлал, гадаад хэл, тооцоолол гэх мэт.",
    category: "HR",
  },
  {
    id: "soft-skills",
    term: "Soft Skills",
    mongolian: "Зөөлөн ур чадвар",
    definition:
      "Бусадтай харилцах, хамтран ажиллах, асуудал шийдвэрлэх зэрэг хувь хүний зан чанартай холбоотой ур чадварууд. Харилцааны ур чадвар, манлайлах чадвар, эмоциональ оюун ухаан гэх мэт.",
    category: "HR",
  },
  {
    id: "personality-test",
    term: "Personality Test",
    mongolian: "Зан чанарын тест",
    definition:
      "Хувь хүний зан төлөв, сэтгэл зүйн онцлогийг тодорхойлоход зориулсан сорил. Ихэвчлэн ажлын байранд тохирох эсэхийг тодорхойлоход ашигладаг.",
    category: "HR",
  },
  {
    id: "aptitude-test",
    term: "Aptitude Test",
    mongolian: "Чадварын тест",
    definition:
      "Хувь хүний тодорхой чиглэлээр суралцах, хөгжих чадварыг үнэлэх сорил. Тухайлбал, логик сэтгэлгээ, тоон мэдээлэл боловсруулах, орон зайн сэтгэлгээ гэх мэт.",
    category: "HR",
  },
  {
    id: "psychometric-test",
    term: "Psychometric Test",
    mongolian: "Сэтгэл зүйн хэмжилтийн тест",
    definition:
      "Хувь хүний оюуны чадавх, зан үйлийн онцлогийг шинжлэх ухааны аргаар хэмжих зорилготой сорил. Ажил олгогчид ажилтан сонгох үйл явцад өргөн ашигладаг.",
    category: "HR",
  },
  {
    id: "cognitive-ability",
    term: "Cognitive Ability",
    mongolian: "Танин мэдэхүйн чадвар",
    definition:
      "Мэдээлэл боловсруулах, ойлгох, асуудал шийдвэрлэх, зааврыг дагах зэрэг оюуны чадваруудыг хэлнэ. Ажлын гүйцэтгэлтэй шууд хамааралтай чухал үзүүлэлт юм.",
    category: "HR",
  },
  {
    id: "recruitment",
    term: "Recruitment",
    mongolian: "Ажилтан элсүүлэлт",
    definition:
      "Ажлын байранд тохирох ажилтныг олж тодорхойлох, үнэлэх, сонгох, ажилд авах үйл явц. Үүнд ажлын зар байршуулах, анкет шүүх, ярилцлага авах, үнэлгээ хийх зэрэг үе шатууд багтана.",
    category: "HR",
  },
  {
    id: "job-matching",
    term: "Job Matching",
    mongolian: "Ажлын байрны тохируулга",
    definition:
      "Ажлын байрны шаардлага болон ажил горилогчийн ур чадвар, туршлага, хүсэл сонирхлыг харьцуулан тохируулах үйл явц. Үүнийг automation хийхэд AI ашиглах нь түгээмэл болж байна.",
    category: "HR",
  },
  {
    id: "skills-gap",
    term: "Skills Gap",
    mongolian: "Ур чадварын зөрүү",
    definition:
      "Ажил олгогчийн шаардаж буй ур чадвар, мэдлэг болон ажилтны эзэмшиж буй ур чадвар, мэдлэгийн хоорондох зөрүү. Энэ зөрүүг арилгахын тулд сургалт, хөгжил хэрэгтэй.",
    category: "HR",
  },
];

const GlossaryPage = () => {
  const [activeTermId, setActiveTermId] = useState(glossaryData[0]?.id);
  const [activeTerm, setActiveTerm] = useState(glossaryData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTerms, setFilteredTerms] = useState(glossaryData);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = [
      ...new Set(glossaryData.map((item) => item.category)),
    ];
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    // Filter terms based on search and category
    let filtered = glossaryData;

    if (searchTerm) {
      filtered = filtered.filter(
        (term) =>
          term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.mongolian.toLowerCase().includes(searchTerm.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory) {
      filtered = filtered.filter((term) => term.category === activeCategory);
    }

    setFilteredTerms(filtered);

    // Update active term if needed
    if (filtered.length > 0 && !filtered.find((t) => t.id === activeTermId)) {
      setActiveTermId(filtered[0].id);
      setActiveTerm(filtered[0]);
    }
  }, [searchTerm, activeCategory, activeTermId]);

  useEffect(() => {
    // Update active term when active term ID changes
    const term = glossaryData.find((t) => t.id === activeTermId);
    if (term) {
      setActiveTerm(term);
    }
  }, [activeTermId]);

  const handleSelectTerm = (termId) => {
    setActiveTermId(termId);
  };

  const handleCategoryFilter = (category) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  return (
    <div className="min-h-screen">
      {/* Background gradients */}
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>

      <div className="relative">
        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6">
          <div className="pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center font-black text-3xl bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent"
            >
              Нэр томьёоны тайлбар
            </motion.div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/3 lg:w-1/4"
            >
              <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-5 sticky top-24">
                <div className="mb-4">
                  <Input
                    prefix={
                      <MagniferBoldDuotone
                        color="#f36421"
                        width={18}
                        height={18}
                      />
                    }
                    placeholder="Хайх..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                {categories.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-700 mb-2">
                      Ангилал
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryFilter(category)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            activeCategory === category
                              ? "bg-main text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <BookBoldDuotone className="text-main" />
                  Нэр томьёонууд
                </h3>
                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 glossary-terms">
                  {filteredTerms.length > 0 ? (
                    filteredTerms.map((term) => (
                      <div
                        key={term.id}
                        onClick={() => handleSelectTerm(term.id)}
                        className={`cursor-pointer py-2 px-3 rounded-xl transition-colors ${
                          activeTermId === term.id
                            ? "bg-main/10 text-main font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{term.term}</span>
                          {activeTermId === term.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-main"></div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {term.mongolian}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      Нэр томьёо олдсонгүй
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main content area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:w-2/3 lg:w-3/4"
            >
              {activeTerm ? (
                <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-8">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-extrabold text-gray-800">
                      {activeTerm.term}
                    </h2>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                      {activeTerm.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-6 text-main">
                    <File />
                    <span className="font-bold text-xl">
                      {activeTerm.mongolian}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-2xl">
                    <Book2BoldDuotone className="text-main text-xl flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-justify leading-relaxed">
                      {activeTerm.definition}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-3">
                      Холбоотой нэр томьёонууд
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {glossaryData
                        .filter(
                          (term) =>
                            term.category === activeTerm.category &&
                            term.id !== activeTerm.id
                        )
                        .slice(0, 5)
                        .map((term) => (
                          <button
                            key={term.id}
                            onClick={() => handleSelectTerm(term.id)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
                          >
                            {term.term}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-8 flex items-center justify-center min-h-[300px]">
                  <p className="text-gray-500">Нэр томьёо сонгоно уу</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default GlossaryPage;
