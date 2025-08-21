"use client";

import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { Collapse, Divider } from "antd";
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
    id: "1",
    question: "Тест, өөрийн үнэлгээгээ хэрхэн сонгох вэ?",
    answer:
      "Төрөл бүрийн тест болон өөрийн үнэлгээнүүдээс сонгохдоо та өөрийн сонирхож буй тестийн дэлгэрэнгүй гэсэн товч дээр дарж тестийн товч тайлбар, хэмжих зүйлс, хэрэглээг нь уншиж сонгоорой. Мөн түүнчлэн тухайн тестийн үр дүнд хүлээн авах жишиг тайлантай урьдчилан танилцаж болно.",
  },
  {
    id: "2",
    question: "Бүх тестүүд төлбөртэй юу?",
    answer:
      "Үгүй. Тест бүрийн айкон зургийн зүүн доод хэсэгт тухайн тест, өөрийн үнэлгээний төлбөрийн дүн эсвэл төлбөргүй гэсэн тэмдэглэл байгаа. Мөн түүнчлэн та тестийн шүүлтүүр хэсэг рүү орж төлбөргүй гэсэн сонголтыг дарвал Hire.mn-с санал болгож төлбөргүй тестүүдийг харах боломжтой.",
  },
  {
    id: "3",
    question: "Төлбөрөө хэрхэн төлөх вэ?",
    answer:
      "Хэрвээ та хувиараа төлбөртэй тест өгөх бол QPay ашиглан өөрийн ашигладаг банкны апп-аар төлөх боломжтой. Төлбөр шилжсэний дараа тестийг эхлүүлэх цонх нээгдэнэ. Харин байгууллагаас таныг тестэнд оролцохоор урьсан бол таны бүртгэлтэй имэйл хаяг тестийн линк очих бөгөөд төлбөр нь байгууллагын хэрэглэгчийн хэтэвчнээс хасагдах болно.",
  },
  {
    id: "4",
    question: "Хэрхэн тест, өөрийн үнэлгээний асуумжид хариулах вэ?",
    answer:
      "Таны сонгосон тест, өөрийн үнэлгээний төрлөөс хамаарах заавар тестийг эхлүүлэх гэсэн товчыг дарсны дараа нэмэлт цонхоор харагдах болно. Та тус заавартай сайтар танилцсаны дараа ойлголоо гэсэн товчыг дарснаар тест эхлэх болно. Мөн түүнчлэн тестэнд хариулж байх явцдаа зааврыг зүүн хэсэгт байгаа асуумжид хариулах заавар гэсэн товчийг дарж харах боломжтой.",
  },
];

const FAQPage = () => {
  return (
    <div>
      <title>Hire.mn</title>
      {/* <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div> */}

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
              <h2 className="text-3xl font-black bg-gradient-to-r from-main via-pink-500 to-secondary bg-clip-text text-transparent tracking-tight leading-[1.1]">
                Түгээмэл асуултууд
              </h2>
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
                            <div className="text-gray-700 leading-5 px-9 pb-4">
                              <Divider className="no-margin" />
                              <p className="pt-5 text-justify">{item.answer}</p>
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
