"use client";

import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Collapse } from "antd";
import {
  QuestionCircleBoldDuotone,
  ChatDotsBoldDuotone,
  AnswerBoldDuotone,
  CommandBoldDuotone,
} from "solar-icons";
import { DropdownIcon } from "@/components/Icons";

const { Panel } = Collapse;

const faqData = [
  {
    id: "how-to-use",
    question: "Тестийн тайланг хэрхэн авах вэ?",
    answer:
      "Тест өгч дууссаны дараа тестийн тайлан таны бүртгүүлсэн и-мэйл хаяг руу автоматаар илгээгдэх бөгөөд та мөн Өгсөн тестүүд цэснээс тестийн тайлантай дахин танилцах боломжтой.",
  },
  {
    id: "payment-options",
    question: "Асуулт 2?",
    answer:
      "Тест өгч дууссаны дараа тестийн тайлан таны бүртгүүлсэн и-мэйл хаяг руу автоматаар илгээгдэх бөгөөд та мөн Өгсөн тестүүд цэснээс тестийн тайлантай дахин танилцах боломжтой.",
  },
];

const FAQPage = () => {
  return (
    <div>
      <title>Hire.mn</title>
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>

      <div className="relative">
        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6">
          <div className="pt-20 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center">
                <ChatDotsBoldDuotone
                  className="text-main"
                  width={32}
                  height={32}
                />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent text-center">
                Түгээмэл асуултууд
              </h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-6 md:p-8">
              {faqData.map((item, index) => (
                <div
                  key={item.id}
                  className={`${index !== faqData.length - 1 ? "mb-4" : ""}`}
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <Collapse
                      expandIconPosition="end"
                      ghost
                      className="faq-collapse"
                      expandIcon={({ isActive }) => (
                        <DropdownIcon width={16} rotate={isActive ? 0 : -90} />
                      )}
                      items={[
                        {
                          key: item.id,
                          label: (
                            <div className="mt-2 mb-2 flex items-center gap-3 px-1">
                              <QuestionCircleBoldDuotone
                                width={20}
                                className="text-main"
                              />
                              <div className="font-bold leading-4">
                                {item.question}
                              </div>
                            </div>
                          ),
                          children: (
                            <div className="text-gray-700 leading-5 px-8 pb-4">
                              {item.answer}
                            </div>
                          ),
                        },
                      ]}
                    ></Collapse>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>

      <style jsx global>{`
        .faq-collapse .ant-collapse-header {
          padding: 16px !important;
          border-radius: 16px !important;
        }

        .faq-collapse .ant-collapse-content {
          background-color: transparent !important;
        }

        .faq-collapse .ant-collapse-content-box {
          padding: 0 16px 8px 16px !important;
        }

        .faq-collapse .ant-collapse-item {
          border: none !important;
        }

        .faq-collapse .ant-collapse-header-text {
          width: 100%;
        }

        .faq-collapse .ant-collapse-expand-icon {
          padding-top: 18px !important;
        }
      `}</style>
    </div>
  );
};

export default FAQPage;
