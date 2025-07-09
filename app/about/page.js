"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  UserBlockBoldDuotone,
  TestTubeBoldDuotone,
  RocketBoldDuotone,
  HeartBoldDuotone,
  StarBoldDuotone,
  BuildingsBoldDuotone,
  UserIdBoldDuotone,
  Buildings2BoldDuotone,
  Rocket2BoldDuotone,
  Document1BoldDuotone,
  Laptop2BoldDuotone,
} from "solar-icons";
import Footer from "@/components/Footer";

const AboutPage = () => {
  const sections = [
    {
      id: "founders",
      title: "Үүсгэн байгуулагч",
      icon: <Rocket2BoldDuotone className="text-main" />,
      color: "from-main to-secondary",
      data: [
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description:
            "СЭЗИС болон Австралийн Үндэсний Их сургуульд Бизнесийн удирдлагын магистр, Маркетингийн удирдлагын магистрын зэрэг хамгаалсан. Маркетинг, хүний нөөцийн салбарт багш, зөвлөх, судлаачаар 2003 оноос хойш ажиллаж байгаа.",
          image: "/nandinerdene.png",
        },
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description:
            "СЭЗИС болон Австралийн Үндэсний Их сургуульд Бизнесийн удирдлагын магистр, Маркетингийн удирдлагын магистрын зэрэг хамгаалсан. Маркетинг, хүний нөөцийн салбарт багш, зөвлөх, судлаачаар 2003 оноос хойш ажиллаж байгаа.",
          image: "/image.png",
        },
      ],
    },
    {
      id: "test",
      title: "Тест хөгжүүлэлтийн баг",
      icon: <Document1BoldDuotone className="text-blue-500" />,
      color: "from-blue-500 to-purple-500",
      data: [
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description: "Тайлбар байх уу?",
          image: "/facebook.png",
        },
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description: "Тайлбар байх уу?",
          image: "/facebook.png",
        },
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description: "Тайлбар байх уу?",
          image: "/facebook.png",
        },
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description: "Тайлбар байх уу?",
          image: "/facebook.png",
        },
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description: "Тайлбар байх уу?",
          image: "/facebook.png",
        },
      ],
    },
    {
      id: "system",
      title: "Систем хөгжүүлэлтийн баг",
      icon: <Laptop2BoldDuotone className="text-green-500" />,
      color: "from-green-500 to-teal-500",
      data: [
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description: "Тайлбар байх уу?",
          image: "/facebook.png",
        },
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description: "Тайлбар байх уу?",
          image: "/facebook.png",
        },
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description: "Тайлбар байх уу?",
          image: "/facebook.png",
        },
      ],
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
          <div className="pt-20 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center">
                <Buildings2BoldDuotone
                  className="text-main"
                  width={32}
                  height={32}
                />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent text-center">
                  Бидний тухай
                </h1>
                <p className="text-gray-600 max-w-2xl py-4">
                  Энэ хэсэгт текст оруулах эсэх?
                </p>
              </div>
            </motion.div>
          </div>

          {sections.map((section) => (
            <motion.div
              key={section.id}
              variants={container}
              initial="hidden"
              animate="show"
              className="mb-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  {section.icon}
                  <h2
                    className={`font-black text-xl bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}
                  >
                    {section.title}
                  </h2>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.data.map((person, index) => (
                  <motion.div
                    key={`${section.id}-${index}`}
                    variants={item}
                    className="group"
                  >
                    <div className="bg-white/80 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-6 h-full transition-all duration-300 hover:shadow-md hover:shadow-slate-300 hover:bg-white/90">
                      <div className="text-center">
                        <motion.div
                          className="relative w-36 h-36 mx-auto mb-4"
                          //   whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Image
                            src={person.image}
                            alt={person.name}
                            fill
                            className="rounded-full object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
                          />
                        </motion.div>

                        <h3 className="text-lg font-extrabold text-gray-900">
                          {person.name}
                        </h3>

                        <div
                          className={`inline-block px-3 pt-0.5 rounded-full font-bold mb-2 bg-gradient-to-r ${section.color} bg-clip-text text-transparent bg-gray-100`}
                        >
                          {person.role}
                        </div>

                        <p className="text-gray-500 leading-relaxed">
                          {person.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-16"
          >
            <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent mb-2">
                  Бидний амжилт
                </h2>
                <p className="text-gray-600">Тоогоор илэрхийлсэн үр дүн</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    number: "500+",
                    label: "Амжилттай тавьсан ажилтан",
                    icon: <UserIdBoldDuotone />,
                  },
                  {
                    number: "100+",
                    label: "Хамтрагч компани",
                    icon: <BuildingsBoldDuotone />,
                  },
                  {
                    number: "50+",
                    label: "Мэргэжлийн чиглэл",
                    icon: <StarBoldDuotone />,
                  },
                  {
                    number: "98%",
                    label: "Харилцагчийн сэтгэл ханамж",
                    icon: <HeartBoldDuotone />,
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-main">
                        {React.cloneElement(stat.icon, {
                          width: 24,
                          height: 24,
                        })}
                      </div>
                    </div>
                    <div className="text-3xl font-black text-main mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div> */}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
