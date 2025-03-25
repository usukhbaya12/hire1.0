"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Input } from "antd";
import { MagniferBoldDuotone, File } from "solar-icons";

const glossaryData = [
  {
    id: "assessment",
    term: "Assessment",
    mongolian: "Үнэлгээ",
    definition: "Нэр томьёоны тайлбар, дэлгэрэнгүй.",
    category: "Ангилал",
  },
  {
    id: "personality-test",
    term: "Personality Test",
    mongolian: "Зан төлөвийн тест",
    definition: "Нэр томьёоны тайлбар, дэлгэрэнгүй.",
    category: "Ангилал",
  },
  {
    id: "psychometric-test",
    term: "Ур чадварын тест",
    mongolian: "Ур чадварын тест",
    definition: "Нэр томьёоны тайлбар, дэлгэрэнгүй.",
    category: "Ангилал",
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
        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pb-12">
          <div className="pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center font-black text-3xl bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent"
            >
              <h1 className="text-3xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent">
                Нэр томьёоны тайлбар
              </h1>
            </motion.div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-8">
            {/* Left sidebar for term list */}
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
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 px-2">
                  Нэр томьёоны жагсаалт
                </h3>
                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 glossary-terms">
                  {filteredTerms.length > 0 ? (
                    filteredTerms.map((term) => (
                      <div
                        key={term.id}
                        onClick={() => handleSelectTerm(term.id)}
                        className={`cursor-pointer py-3 px-5 rounded-xl transition-colors ${
                          activeTermId === term.id
                            ? "bg-main/10 text-main font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between leading-4">
                          <span>{term.term}</span>
                          {activeTermId === term.id && (
                            <div className="w-2 h-2 rounded-full bg-main"></div>
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
                    <File width={20} />
                    <span className="font-extrabold text-xl">
                      {activeTerm.mongolian}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 bg-gradient-to-r from-gray-50 to-transparent rounded-2xl">
                    <p className="text-gray-700 text-justify leading-5">
                      {activeTerm.definition}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
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
