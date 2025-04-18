"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Form, Input, Button, message, Radio, Spin } from "antd";
import {
  LetterBoldDuotone,
  PhoneCallingRoundedBoldDuotone,
  UserIdBoldDuotone,
  DocumentTextBoldDuotone,
  SendSquareBoldDuotone,
  BuildingsBoldDuotone,
  RocketBoldDuotone,
  NotesBoldDuotone,
  Wallet2BoldDuotone,
  CheckCircleBoldDuotone,
} from "solar-icons";
import Footer from "@/components/Footer";

const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [contactType, setContactType] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const contactOptions = [
    {
      value: "provide-test",
      label: "Тест нийлүүлэх",
      icon: <NotesBoldDuotone className="text-main" />,
    },
    {
      value: "collaboration",
      label: "Хамтран ажиллах",
      icon: <BuildingsBoldDuotone className="text-main" />,
    },
    {
      value: "feedback",
      label: "Тестийн талаарх санал хүсэлт",
      icon: <DocumentTextBoldDuotone className="text-main" />,
    },
    {
      value: "other",
      label: "Бусад",
      icon: <Wallet2BoldDuotone className="text-main" />,
    },
  ];

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      // Here you would typically call an API to submit the form
      console.log("Form submitted:", { ...values, type: contactType });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      messageApi.success("Таны хүсэлт амжилттай илгээгдлээ.");
      form.resetFields();
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      messageApi.error("Хүсэлт илгээхэд алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTypeSelect = (value) => {
    setContactType(value);
  };

  const handleNewMessage = () => {
    setSubmitted(false);
    setContactType(null);
  };

  return (
    <div>
      <title>Hire.mn</title>
      {contextHolder}

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
                <LetterBoldDuotone
                  className="text-main"
                  width={32}
                  height={32}
                />
              </div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent text-center">
                Бидэнтэй холбогдох
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
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                    <CheckCircleBoldDuotone width={40} height={40} />
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    Илгээгдлээ!
                  </h2>
                  <p className="text-gray-600 text-center max-w-md">
                    Таны хүсэлтийг хүлээн авлаа. Бид тантай удахгүй холбогдох
                    болно.
                  </p>
                  <div
                    className="relative group cursor-pointer mt-4"
                    onClick={handleNewMessage}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
                      <div className="text-base font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-2.5 px-10">
                        Шинэ хүсэлт үүсгэх
                      </div>
                    </div>
                  </div>
                </div>
              ) : contactType ? (
                <Form form={form} layout="vertical" onFinish={onFinish}>
                  <div className="mb-5 pb-3 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="flex items-center gap-2 mb-4 sm:mb-0">
                        {
                          contactOptions.find(
                            (opt) => opt.value === contactType
                          )?.icon
                        }
                        <h2 className="font-extrabold text-lg">
                          {
                            contactOptions.find(
                              (opt) => opt.value === contactType
                            )?.label
                          }
                        </h2>
                      </div>
                      <Button
                        onClick={() => setContactType(null)}
                        className="back"
                      >
                        Буцах
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Form.Item
                      name="name"
                      label="Нэр"
                      rules={[{ required: true, message: "Нэрээ оруулна уу." }]}
                    >
                      <Input
                        prefix={
                          <UserIdBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="Таны нэр"
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      validateTrigger="onFinish"
                      label="И-мейл хаяг"
                      rules={[
                        {
                          required: true,
                          message: "И-мейл хаягаа оруулна уу.",
                        },
                        {
                          type: "email",
                          message: "Зөв и-мейл хаяг оруулна уу.",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <LetterBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="И-мейл хаяг"
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Form.Item
                      name="phone"
                      label="Утасны дугаар"
                      rules={[
                        {
                          required: true,
                          message: "Утасны дугаараа оруулна уу.",
                        },
                        {
                          pattern: /^\d{8}$/,
                          message: "Зөв утасны дугаар оруулна уу.",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <PhoneCallingRoundedBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="Утасны дугаар"
                      />
                    </Form.Item>

                    <div className="hidden sm:block"></div>
                  </div>

                  <Form.Item
                    name="message"
                    label="Агуулга"
                    rules={[
                      { required: true, message: "Агуулгаа оруулна уу." },
                    ]}
                  >
                    <TextArea rows={5} placeholder="Агуулга бичнэ үү..." />
                  </Form.Item>

                  <div className="flex justify-end mt-6">
                    <Button
                      htmlType="submit"
                      loading={submitting}
                      className="login"
                      icon={<SendSquareBoldDuotone width={18} height={18} />}
                    >
                      Илгээх
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <h2 className="text-lg font-extrabold mb-6 text-center sm:text-left leading-5">
                    Бидэнтэй ямар зорилгоор холбогдож байна вэ?
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contactOptions.map((option) => (
                      <div
                        key={option.value}
                        className="bg-white/80 hover:bg-white rounded-3xl border border-gray-100 shadow-sm shadow-slate-200 p-5 cursor-pointer transition-all duration-200 transform hover:scale-[1.001] hover:shadow hover:shadow-slate-200"
                        onClick={() => handleTypeSelect(option.value)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-main/10 rounded-full flex items-center justify-center">
                            {option.icon}
                          </div>
                          <div className="font-extrabold leading-4">
                            {option.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ContactPage;
