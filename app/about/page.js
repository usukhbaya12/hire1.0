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
  PeopleNearbyBoldDuotone,
  HandHeartBoldDuotone,
  SuitcaseTagBoldDuotone,
  MapPointSchoolBoldDuotone,
  GlassesBoldDuotone,
} from "solar-icons";
import Footer from "@/components/Footer";

const AboutPage = () => {
  const sections = [
    {
      id: "founders",
      title: "Үүсгэн байгуулагч",
      icon: <Rocket2BoldDuotone className="text-main" />,
      color: "from-main to-secondary",
      color2: "from-main/10 to-secondary/10",
      border: "orange-200",
      text: "main",

      data: [
        {
          name: "Б.Нандин-Эрдэнэ",
          role: "Үүсгэн байгуулагч",
          description:
            "СЭЗИС болон Австралийн Үндэсний Их сургуульд Бизнесийн удирдлагын магистр, Маркетингийн удирдлагын магистрын зэрэг хамгаалсан. Маркетинг, хүний нөөцийн салбарт багш, зөвлөх, судлаачаар 2003 оноос хойш ажиллаж байна.",
          image: "/nandia.png",
        },
      ],
    },
    {
      id: "test",
      title: "Тест хөгжүүлэлтийн баг",
      icon: <Document1BoldDuotone className="text-blue-500" />,
      color: "from-blue-500 to-purple-500",
      color2: "from-blue-500/10 to-purple-500/10",
      border: "blue-200",
      text: "blue-500",

      data: [
        {
          name: "Б.Үүрцайх",
          role: "Ахлах тест хөгжүүлэгч",
          description:
            "АШУҮИС-д Хүний их эмч мэргэжил, АНУ-ын Вашингтоны Их сургуульд Олон улсын эрүүл мэнд судлал, Нийгмийн эрүүл мэнд судлал чиглэлээр магистрын зэрэг хамгаалсан. Нийгмийн эрүүл мэнд, биостатистик,  эрүүл мэндийн систем, эрүүл мэндийн их өгөгдөл, хиймэл оюун ухаан/машин сургалт зэрэг чиглэлд судлаачаар 2015 оноос хойш ажиллаж байна. ",
          image: "/uurtsaih.png",
        },
        {
          name: "А.Одгэрэл",
          role: "Тест хөгжүүлэгч",
          description:
            "СЭЗИС-д Бизнесийн удирдлагын магистр зэрэг хамгаалсан. Монголын мэргэшсэн нягтлан бодогч болон Аудитор зэрэгтэй. Санхүүгийн бүртгэл, санхүүгийн дунд шатны нягтлан бодох бүртгэл, тайлагнал, Зардал, өртгийн бүртгэл, Хөндлөнгийн болон дотоод аудитын чиглэлээр  багш, зөвлөх, судлаачаар 2002 оноос хойш ажиллаж байна.",
          image: "/hun.png",
        },
        {
          name: "Д.Гэрэлмаа",
          role: "Тест хөгжүүлэгч",
          description:
            "ЗХУ, Москва хотын Цахилгаан Холбооны Дээд сургуулийн  магистр, Удирдлагын Академи удирдахуйн ухааны доктор зэрэгтэй. Хүний нөөц, байгууллагын зан төлөв, байгууллагын хөгжил, компаний засаглалийн чиглэлээр багш, зөвлөх, судлаачаар 1992 оноос хойш ажиллаж байна.",
          image: "/gerelmaa.png",
        },
        {
          name: "О.Зэсэмдорж",
          role: "Тест хөгжүүлэгч",
          description:
            "АШУҮИС-д Анагаах Ухааны Магистр, Японы Жичи Анагаах Ухааны Их Сургуулийн анагаах ухааны доктор зэрэгтэй.",
          image: "/zesemdorj.png",
        },
        {
          name: "Ц.Булган",
          role: "Тест хөгжүүлэгч",
          description:
            "СЭЗИС болон АНУ-ын Вашингтоны Их сургуульд Бизнесийн удирдлагын магистр, Боловсролын Удирдлага ба Бодлого судлалын магистрын зэрэг хамгаалсан. Байгууллагын зан төлөв, байгууллагын хөгжил, сэтгэл хөдлөлийн менежмент ба манлайлал, бүтээлч байдал ба инновац зэрэг чиглэлүүдээр багш, зөвлөх, судлаачаар 2005 оноос хойш ажиллаж байна.",
          image: "/bulgaa.png",
        },
        {
          name: "Г.Нарантунгалаг",
          role: "Тест хөгжүүлэгч",
          description:
            "СЭЗИС-д Бизнесийн удирдлагын магистр, докторант. Байгууллагын зан төлөв, ажлын байран дахь зохисгүй зан төлөв, хүний нөөцийн стратеги, ажайл менежмент, манлайлал, төслийн удирдлгага чиглэлүүдээр багш, зөвлөх, судлаачаар 2005 оноос хойш ажиллаж байна.",
          image: "/naraa.png",
        },
        {
          name: "Б.Дэлгэрсайхан",
          role: "Тест хөгжүүлэгч",
          description:
            "СЭЗИС болон АНУ-ын Деврай Их сургуульд Нягтлан бодох бүртгэл, санхүүгийн удирдлагын магистр, докторант. Mонголын мэргэшсэн нягтлан бодогч зэрэгтэй. Нягтлан бодогчдын мэргэжлийн ёс зүй, эрсдлийн удирдлага, дотоод аудит, удирдлагын бүртгэл, тогтвортой хөгжлийн тайлагнал чиглэлүүдээр багш, зөвлөх, судлаачаар 2012 оноос хойш ажиллаж байна.",
          image: "/deegii.png",
        },
        {
          name: "Б.Батгэрэл",
          role: "Тест хөгжүүлэгч",
          description:
            "АШУҮИС-ийг хүний их эмчээр төгссөн. Сэтгэцийн эмч болон сэтгэл засалч мэргэжил эзэмшсэн. Одоогоор Япон улсын Кансай Анагаах Ухааны Их Сургуульд сэтгэц судлалын чиглэлээр докторын сургалтад суралцаж байна.",
          image: "/facebook.png",
        },
        {
          name: "С.Ишцэдэн",
          role: "Тест хөгжүүлэгч",
          description: "Тест хөгжүүлэгч",
          image: "/facebook.png",
        },
        {
          name: "Ш.Эрдэнэбуян",
          role: "Тест хөгжүүлэгч",
          description:
            "Удирдлагын Хөгжлийн Институт-д Удирдахуйн ухааны магистрын зэрэг хамгаалсан. Бүтээмж ба чанарын удирдлага, Үйлдвэрлэл үйл ажиллагааны менежмент чиглэлүүдээр дэд профессороор, багш, зөвлөх, судлаачаар 1995 оноос хойш ажиллаж байна.",
          image: "/facebook.png",
        },
        {
          name: "О.Алтанцаг",
          role: "Төслийн зохицуулагч",
          description:
            "СЭЗИС-д Бизнесийн удирдлагын бакалаврын хөтөлбөр төгссөн. 2019 оноос хойш судлаач, зохицуулагчаар ажиллаж байна.",
          image: "/agii.png",
        },
        {
          name: "Л.Золжаргал",
          role: "Тест хөгжүүлэгч",
          description:
            "АШУҮИС-ийг Хүний их эмч мэргэжлээр, Жонс Хопкинсийн Их Сургуулийг Нийгмийн эрүүл мэндийн магистр зэрэгтэйгээр тус тус дүүргэсэн. Одоогоор Вашингтоны Их сургуульд Эрүүл мэндийн мэдээлэл зүйн чиглэлээр докторын зэрэгт суралцаж байна. 2018 оноос хойш цахим эрүүл мэнд, эрүүл мэндийн мэдээлэл зүй, өгөгдлийн шинжлэх ухааны чиглэлээр Жонс Хопкинсийн Их Сургуулийн харъяа Тооцооллын анагаах ухааны институт (Johns Hopkins Institute for Computational Medicine), Вашингтоны Их Сургуулийн Олон улсын эрүүл мэндийн тэнхимийн харьяа Эрүүл мэндийн сургалт, боловсролын олон улсын төв (International Training and Education Center for Health) зэрэг байгууллагуудад судлаачаар ажиллаж байна.",
          image: "/facebook.png",
        },
      ],
    },
    {
      id: "system",
      title: "Систем хөгжүүлэлтийн баг",
      icon: <Laptop2BoldDuotone className="text-green-500" />,
      color: "from-green-500 to-teal-500",
      color2: "from-green-500/10 to-teal-500/10",
      border: "green-300",
      text: "green-500",
      data: [
        {
          name: "Н.Саранчимэг",
          role: "Системийн шинжээч",
          description:
            "СЭЗИС болон МУИС-д Мэдээллийн системийн бакалавр, магистрын зэрэг хамгаалсан. Системийн шинжилгээ, Бизнес процесс менежмент, чадамжид суурилсан боловсрол чиглэлээр багш, зөвлөх, судлаачаар 2011 оноос хойш ажиллаж байна.",
          image: "/saraa.png",
        },
        {
          name: "Г.Эрдэнэцэцэг",
          role: "Систем хөгжүүлэгч",
          description:
            "СЭЗИС-д Мэдээллийн системийн бакалавр, Бизнесийн удирдлагын магистрын зэрэг хамгаалсан. Програм хангамж хөгжүүлэлт, Системийн шинжилгээ, Өгөгдлийн сангийн чиглэлээр хөгжүүлэгч, багш, судлаачаар 2012 оноос хойш ажиллаж байна.",
          image: "/erka.png",
        },
        {
          name: "М.Доржнямбуу",
          role: "Back-end хөгжүүлэгч",
          description:
            "СЭЗИС-д Мэдээллийн системийн бакалаврын хөтөлбөр. Програм хангамжын back-end хөгжүүлэлт, Өгөгдлийн сангийн програмчлалын чиглэлээр ажиллаж байна.",
          image: "/dorjoo.png",
        },
        {
          name: "А.Өсөхбаяр",
          role: "Front-end хөгжүүлэгч",
          description:
            "СЭЗИС-д Мэдээллийн системийн бакалаврын хөтөлбөр төгссөн. Програм хангамжын front-end, UX, UI хөгжүүлэлт, өгөгдлийн шинжилгээ чиглэлээр ажиллаж байна.",
          image: "/usukhu.png",
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

      {/* <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div> */}

      <div className="relative">
        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6">
          <div className="pt-12 pb-6">
            <div className="relative pt-28 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-5xl md:text-6xl font-black bg-gradient-to-r from-main via-pink-500 to-secondary bg-clip-text text-transparent tracking-tight leading-[1.1]"
              >
                ЗӨВ ХҮН,
                <br />
                ЗӨВ ГАЗАРТ
              </motion.h2>

              <div className="absolute top-40 inset-0 -z-10 flex items-center justify-center">
                <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#f36421]/70 via-[#ff6f3c]/70 to-[#ffb347]/70 blur-3xl opacity-30 animate-pulse" />
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-6 font-bold text-lg leading-6 text-center text-gray-600"
            >
              Зан төлөв, чадамж, мэргэжил, ур чадварын тест, өөрийн үнэлгээ
            </motion.p>

            <div className="flex justify-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pt-6 text-center max-w-4xl"
              >
                Hire.mn нь хувь хүний зан төлөв, чадамж, мэргэжлийн мэдлэг,
                ажлын байрны төрөл бүрийн ур чадварыг шалгах зориулалттай тест,
                өөрийн үнэлгээний цогц платформ. Энэхүү платформыг хүний нөөцийн
                сургалт, судалгааны Аксиом Инк компаниас санаачлан их дээд
                сургуулийн багш нар болон бие даасан судлаач нартай хамтран 2024
                оноос хойш хөгжүүлж байна.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="pt-4 flex flex-col items-center gap-3"
            >
              <div className="text-center">
                {/* <h1 className="text-3xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent text-center">
                  Бидний тухай
                </h1> */}

                <div className="flex gap-8 my-4 bg-white/80 backdrop-blur-md shadow shadow-slate-200 rounded-3xl md:rounded-full px-10 py-8 h-full transition-all duration-300">
                  <div>
                    {/* <div className="font-bold text-center">
                      <p className="pb-2">Бидний тест, өөрийн үнэлгээг:</p>
                    </div> */}
                    <div className="flex gap-2 items-center grid grid-cols-2 gap-6 md:grid-cols-6">
                      <div className="flex flex-col justify-center items-center leading-[1.1]">
                        <div className="mb-3 w-14 h-14 bg-main/10 rounded-full flex items-center justify-center">
                          <PeopleNearbyBoldDuotone
                            className="text-main"
                            width={26}
                            height={26}
                          />
                        </div>
                        Ажлын байрны сонгон шалгаруулалт
                      </div>
                      <div className="flex flex-col justify-center items-center leading-[1.1]">
                        <div className="mb-3 w-14 h-14 bg-main/10 rounded-full flex items-center justify-center">
                          <HandHeartBoldDuotone
                            className="text-main"
                            width={26}
                            height={26}
                          />
                        </div>
                        Хувь хүний сэтгэл зүйн байдлаа таньж ойлгох
                      </div>
                      <div className="flex flex-col justify-center items-center leading-[1.1]">
                        <div className="mb-3 w-14 h-14 bg-main/10 rounded-full flex items-center justify-center">
                          <SuitcaseTagBoldDuotone
                            className="text-main"
                            width={26}
                            height={26}
                          />
                        </div>
                        Ажилтнуудын аттестатчилал
                      </div>
                      <div className="flex flex-col justify-center items-center leading-[1.1]">
                        <div className="mb-3 w-14 h-14 bg-main/10 rounded-full flex items-center justify-center">
                          <Buildings2BoldDuotone
                            className="text-main"
                            width={26}
                            height={26}
                          />
                        </div>
                        Ажлын байран дээрх зан төлөв
                      </div>

                      <div className="flex flex-col justify-center items-center leading-[1.1]">
                        <div className="mb-3 w-14 h-14 bg-main/10 rounded-full flex items-center justify-center">
                          <MapPointSchoolBoldDuotone
                            className="text-main"
                            width={26}
                            height={26}
                          />
                        </div>
                        Оюутан залуучууд өөрийгөө үнэлэх
                      </div>
                      <div className="flex flex-col justify-center items-center leading-[1.1]">
                        <div className="mb-3 w-14 h-14 bg-main/10 rounded-full flex items-center justify-center">
                          <GlassesBoldDuotone
                            className="text-main"
                            width={26}
                            height={26}
                          />
                        </div>
                        Ажлын байранд өөрийгөө бэлдэх
                      </div>
                    </div>
                  </div>
                </div>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
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

                        <div className="flex items-center justify-center py-2 pb-4">
                          <div
                            className={`flex items-center gap-2 bg-gradient-to-r ${section.color2} text-${section.text} px-3 py-1.5 rounded-3xl border border-${section.border}`}
                          >
                            <span className="text-sm truncate font-bold max-w-[220px]">
                              {person.role}
                            </span>
                          </div>
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
