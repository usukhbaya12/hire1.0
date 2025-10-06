"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Input } from "antd";
import { MagniferBoldDuotone, File } from "solar-icons";

const glossaryData = [
  {
    id: "1",
    term: "Admin",
    mongolian: "Админ ",
    definition:
      "Платформ дээр байрлах тест, үнэлгээний төрөл, төрөл доторх тест банк, үр дүнгийн тооцоолол, үнэлгээний тайлангийн загварыг нэмэх хасах, засах эрх бүхий Hire.mn-ний ажилтныг хэлнэ. Мөн байгууллага, шалгуулагч, зочдын хэрэглээний өгөгдлийг бодит цаг хугацаанд харах, хэрэглээ хандалтыг хязгаарлах, нэмэх эрх бүхий",
    category: "misc",
  },
  {
    id: "2",
    term: "Aptitude test",
    mongolian: "Чадамжийн тест",
    definition:
      "Когнитив чадамжийг үнэлэх зорилго бүхий тест. Үүнд математик логик, тоон мэдээлэл, хүснэгт график, бичгэн мэдээллийг уншиж ойлгох, учир шалтгааныг тайлах чадамжууд багтана.",
    category: "test",
  },
  {
    id: "3",
    term: "Behavioral anchor",
    mongolian: "Зан төлөвийн хүлээлт",
    definition:
      "Тухайлсан ажлын байранд шаардлагатай зан төлөвийн шинжийг объектив байдлаар тодорхойлсон тодорхойлолт.",
    category: "other",
  },
  {
    id: "4",
    term: "Client",
    mongolian: "Байгууллага",
    definition:
      "Өөрийн ажилтнууд, ажил горилогчийг шалгуулах зорилгоор хамтран ажиллаж буй харилцагч байгууллагууд. Платформоос санал болгож урьдчилан бэлдсэн тест болон өөрийн хэрэгцээнд нийцсэн тест бэлдэн шалгалтыг авах, үр дүн тайланг хүлээн авагч.",
    category: "misc",
  },
  {
    id: "5",
    term: "Competency model",
    mongolian: "Чадамжийн загвар",
    definition:
      "Ажлын байранд өндөр гүйцэтгэлтэй ажиллахад шаардлагатай чадамжуудын цогц.",
    category: "other",
  },
  {
    id: "6",
    term: "Hire.mn",
    mongolian: "Hire.mn",
    definition:
      "Hire.mn онлайн тест,  хөндлөнгийн үнэлгээний платформ. Төрөл бүрийн урьдчилан бэлдсэн тест, хөндлөнгийн үнэлгээний үйлчилгээг байгууллага, шалгуулагч нарт санал болгоно.",
    category: "misc",
  },
  {
    id: "7",
    term: "Job test",
    mongolian: "Ажлын байрны тест",
    definition:
      "Ажил горилогчийн мэдлэг, чадвар, чадамж, зан төлөв тухайн ажлын байранд нийцэж буй эсэхийг үнэлэх зорилго бүхий тест.",
    category: "test",
  },
  {
    id: "8",
    term: "Personality test",
    mongolian: "Хувь хүний зан төлөвийн тест",
    definition:
      "Хувь хүний зан төлөв, хандлага, сэдэл, үнэт зүйлийг илрүүлэх зорилго бүхий тест.",
    category: "test",
  },
  {
    id: "9",
    term: "Professional test",
    mongolian: "Мэргэжлийн тест",
    definition:
      "Тухайлсан мэргэжлийн мэдлэг, ур чадвар шалгах эсвэл баталгаажуулах зорилго бүхий тестийг хэлнэ.",
    category: "test",
  },
  {
    id: "10",
    term: "Psychometric test",
    mongolian: "Психометрик тест",
    definition:
      "Хүний зан төлөвийн хэв маяг, чадамж, танин мэдэхүйн чадварыг үнэлэх зорилго бүхий стандартчилагдсан тест.",
    category: "test",
  },
  {
    id: "11",
    term: "Self assessment",
    mongolian: "Өөрийн үнэлгээ",
    definition:
      "Өөрийн ур чадвар, гүйцэтгэл, чадамж, зан төлөвөө хувь хүн өөрөө үнэлэх төрөл бөгөөд ингэснээр өөрийн сул талыг илрүүлэх түүнийгээ хөгжүүлэх сэдэл авах зорилготой.",
    category: "test",
  },
  {
    id: "12",
    term: "Skill test",
    mongolian: "Ур чадварын тест",
    definition:
      "Өгөгдсөн сэдвийн хүрээнд шалгуулагчийн мэдлэг, ур чадварыг үнэлэх зорилго бүхий тест. Жишээ нь, код бичих ур чадвар, багаар ажиллах ур чадвар г.м.",
    category: "test",
  },
  {
    id: "13",
    term: "Test taker",
    mongolian: "Шалгуулагч",
    definition:
      "Байгууллагаас илгээсэн тест, үнэлгээнд  оролцогч  ажил горилогчид, ажилтнууд болон хувиараа бүртгүүлэн тест, үнэлгээнд оролцогчийг хэлнэ.",
    category: "misc",
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
    <div>
      <title>Нэр томьёоны тайлбар / Hire.mn</title>
      {/* <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div> */}

      <div className="relative">
        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pb-12">
          <div className="pt-20 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center">
                <MagniferBoldDuotone
                  className="text-main"
                  width={32}
                  height={32}
                />
              </div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-main via-pink-500 to-secondary bg-clip-text text-transparent tracking-tight leading-[1.1]">
                Нэр томьёоны тайлбар
              </h2>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
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
                <div className="space-y-1 max-h-[20vh] sm:max-h-[60vh] overflow-y-auto pr-2 glossary-terms">
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
                    {/* <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                      {activeTerm.category}
                    </span> */}
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
