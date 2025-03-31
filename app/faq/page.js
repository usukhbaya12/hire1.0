"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Input, Collapse, Divider } from "antd";
import {
  MagniferBoldDuotone,
  SquareArrowRightDownBoldDuotone,
  QuestionCircleBoldDuotone,
  LampBoldDuotone,
  ChatDotsBoldDuotone,
  File,
} from "solar-icons";

const faqData = [
  {
    id: "general",
    icon: <ChatDotsBoldDuotone className="text-main" width={24} height={24} />,
    questions: [
      {
        id: "how-to-use",
        question: "Тестийн тайланг хэрхэн авах вэ?",
        answer:
          "Тест өгч дууссаны дараа тестийн тайлан таны бүртгүүлсэн и-мейл хаяг руу автоматаар илгээгдэх бөгөөд та мөн Өгсөн тестүүд цэснээс тестийн тайлантай дахин танилцах боломжтой",
      },
    ],
  },
];

const { Panel } = Collapse;

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqData);
  const [expandedSections, setExpandedSections] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredFaqs(faqData);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = faqData
      .map((category) => {
        const filteredQuestions = category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(lowerSearchTerm) ||
            q.answer.toLowerCase().includes(lowerSearchTerm)
        );

        return {
          ...category,
          questions: filteredQuestions,
        };
      })
      .filter((category) => category.questions.length > 0);

    setFilteredFaqs(filtered);

    setExpandedSections(filtered.map((category) => category.id));
  }, [searchTerm]);

  useEffect(() => {
    if (!activeCategory) {
      setFilteredFaqs(faqData);
      return;
    }

    const filtered = faqData.filter(
      (category) => category.id === activeCategory
    );
    setFilteredFaqs(filtered);
  }, [activeCategory]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
    setSearchTerm("");
  };

  return (
    <div>
      <title>Hire.mn</title>
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
              <h1 className="text-3xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent">
                Түгээмэл асуултууд
              </h1>
            </motion.div>
          </div>

          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-10"
            >
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((category, index) => (
                  <div key={category.id} className="mb-8">
                    <Collapse
                      expandIconPosition="end"
                      defaultActiveKey={expandedSections}
                      className="border-0 bg-transparent custom-collapse"
                      accordion
                    >
                      {category.questions.map((item, idx) => (
                        <Panel
                          key={item.id}
                          header={
                            <div className="flex items-start gap-3 py-2">
                              <QuestionCircleBoldDuotone
                                className="text-main mt-0.5 flex-shrink-0"
                                width={20}
                                height={20}
                              />
                              <div className="font-bold text-base">
                                {item.question}
                              </div>
                            </div>
                          }
                          className="bg-white/70 rounded-2xl mb-3 border border-gray-100 overflow-hidden"
                        >
                          <div className="pl-9 pb-2 text-gray-700">
                            {item.answer}
                          </div>
                        </Panel>
                      ))}
                    </Collapse>
                  </div>
                ))
              ) : (
                <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-8 text-center">
                  <div className="text-gray-500 text-lg">
                    Таны хайсан асуулт олдсонгүй.
                  </div>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 px-6 py-2 bg-main text-white rounded-full font-medium hover:bg-main/90 transition-colors"
                  >
                    Бүх асуултуудыг харах
                  </button>
                </div>
              )}
            </motion.div>

            <div className="bg-main/10 rounded-3xl p-8 mb-12">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-1/4 flex justify-center">
                  <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center">
                    <ChatDotsBoldDuotone
                      className="text-main"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
                {/* <div className="md:w-3/4">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    Асуултаа олж чадсангүй юу?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Хэрэв та хариултаа энд олж чадахгүй бол, бидэнтэй шууд
                    холбогдоно уу. Бид таны асуултад хариулахад таатай байх
                    болно.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/contact")}
                    className="px-6 py-2 bg-main text-white rounded-full font-medium hover:bg-main/90 transition-colors"
                  >
                    Холбоо барих
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <style jsx global>{`
        .custom-collapse .ant-collapse-content {
          background-color: transparent !important;
        }

        .custom-collapse .ant-collapse-header {
          background-color: transparent !important;
          border-radius: 1rem !important;
          padding: 12px 16px !important;
        }

        .custom-collapse .ant-collapse-item {
          border: none !important;
        }

        .custom-collapse .ant-collapse-header-text {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default FAQPage;
