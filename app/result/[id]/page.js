"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Spin, Divider, Progress } from "antd";
import Image from "next/image";
import {
  UserIdBoldDuotone,
  ClipboardBoldDuotone,
  GraphUpBoldDuotone,
  CheckCircleBoldDuotone,
  QuestionCircleBoldDuotone,
  CalendarBoldDuotone,
  NotesBoldDuotone,
  Buildings2BoldDuotone,
  DownloadBoldDuotone,
  Chart2BoldDuotone,
  GraphNewUpBoldDuotone,
  LightbulbBoltBoldDuotone,
} from "solar-icons";
import { motion } from "framer-motion";
import Error from "@/components/Error";
import { getExamCalculation } from "@/app/api/exam";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/Spin";
import dayjs from "dayjs";

export default function Results() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resultResponse = await getExamCalculation(params.id);

        if (resultResponse.success) {
          setData(resultResponse.data);
        } else {
          setError(resultResponse.message || "Тестийн мэдээлэл олдсонгүй.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Сервертэй холбогдоход алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const getScoreColorClass = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-main";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Error message={error} />;
  }

  const formatDate = (dateString) => {
    return dateString ? dayjs(dateString).format("YYYY-MM-DD HH:mm") : "-";
  };
  const AnimatedBackground = () => {
    const lines = Array.from({ length: 20 });
    const colors = [
      "#f36421",
      "#ed1c45",
      "#3b82f6",
      "#8b5cf6",
      "#10b981",
      "#f59e0b",
    ];

    return (
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1000 900"
        >
          {lines.map((_, i) => {
            const y = Math.random() * 1000;

            const amp1 = 50 + Math.random() * 150;
            const amp2 = 50 + Math.random() * 150;
            const mid1 = 200 + Math.random() * 200;
            const mid2 = 500 + Math.random() * 300;

            const path = `M-100,${y} 
                      C${mid1},${y + (Math.random() > 0.5 ? amp1 : -amp1)} 
                       ${mid2},${y + (Math.random() > 0.5 ? amp2 : -amp2)} 
                       1100,${y + (Math.random() - 0.5) * 100}`;

            return (
              <path
                key={i}
                d={path}
                stroke={colors[i % colors.length]}
                strokeWidth={4 + Math.random() * 3}
                strokeOpacity="0.2"
                fill="transparent"
                className={`animate-wave-${i % 3}`}
                style={{
                  animationDuration: `${5 + Math.random() * 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            );
          })}
        </svg>

        <style jsx>{`
          @keyframes wave-0 {
            0%,
            100% {
              transform: translate(0, 0);
            }
            25% {
              transform: translate(80px, -30px);
            }
            50% {
              transform: translate(-40px, 50px);
            }
            75% {
              transform: translate(60px, 20px);
            }
          }
          @keyframes wave-1 {
            0%,
            100% {
              transform: translate(0, 0);
            }
            30% {
              transform: translate(-70px, 40px);
            }
            60% {
              transform: translate(90px, -20px);
            }
          }
          @keyframes wave-2 {
            0%,
            100% {
              transform: translate(0, 0);
            }
            20% {
              transform: translate(50px, 60px);
            }
            70% {
              transform: translate(-80px, -30px);
            }
          }
          .animate-wave-0 {
            animation: wave-0 ease-in-out infinite;
          }
          .animate-wave-1 {
            animation: wave-1 ease-in-out infinite;
          }
          .animate-wave-2 {
            animation: wave-2 ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  };

  return (
    <div>
      <title>{data?.assessmentName || "Тестийн үр дүн"} | Hire.mn</title>

      <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pb-12">
        <div className="pt-20 pb-6">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-main/10 rounded-full flex items-center justify-center">
              <NotesBoldDuotone className="text-main" width={32} height={32} />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent text-center">
              Тестийн үр дүн
            </h1>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-80 -right-0 w-[200px] h-[200px] md:w-[600px] md:h-[600px]">
              <Image
                src="/brain-home.png"
                alt="Brain icon"
                fill
                className="object-contain opacity-10"
                priority
                draggable={false}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/60 p-4 px-6 rounded-full shadow-sm transition-transform hover:translate-x-1 duration-300">
                <UserIdBoldDuotone
                  width={28}
                  height={28}
                  className="text-main"
                />
                <div className="leading-5">
                  <div className="text-gray-500 text-[13px]">Шалгуулагч</div>
                  <div className="font-extrabold">
                    {data?.lastname ? `${data?.lastname} ` : ""}
                    {data?.firstname || "-"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/60 p-4 px-6 rounded-full shadow-sm transition-transform hover:translate-x-1 duration-300">
                <NotesBoldDuotone
                  width={28}
                  height={24}
                  className="text-main"
                />
                <div className="leading-5">
                  <div className="text-gray-500 text-[13px]">Тестийн нэр</div>
                  <div className="font-extrabold">
                    {data?.assessmentName || "-"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/60 p-4 px-6 rounded-full shadow-sm transition-transform hover:translate-x-1 duration-300">
                <CalendarBoldDuotone
                  width={28}
                  height={24}
                  className="text-main"
                />
                <div className="leading-5">
                  <div className="text-gray-500 text-[13px]">
                    Тест өгсөн огноо
                  </div>
                  <div className="font-extrabold">
                    {formatDate(data?.createdAt)}
                  </div>
                </div>
              </div>
              {data?.isInvited && (
                <div className="flex items-center gap-3 bg-white/60 p-4 px-6 rounded-full shadow-sm transition-transform hover:translate-x-1 duration-300">
                  <Buildings2BoldDuotone
                    width={28}
                    height={24}
                    className="text-main"
                  />
                  <div className="leading-5">
                    <div className="text-gray-500 text-[13px]">
                      Урьсан байгууллага
                    </div>
                    <div className="font-extrabold">{data?.orgName}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/60 p-4 px-6 rounded-full shadow-sm transition-transform hover:translate-x-1 duration-300">
                <GraphUpBoldDuotone
                  width={28}
                  height={24}
                  className="text-main"
                />
                <div className="leading-5">
                  <div className="text-gray-500 text-[13px]">Үр дүн</div>
                  <div className="min-w-[120px]">
                    {data?.type === 10 || data?.type === 11 ? (
                      <div className="font-bold">
                        <Progress
                          size="small"
                          percent={Math.round((data.point / data.total) * 100)}
                          strokeColor={{
                            "0%": "#FF8400",
                            "100%": "#FF5C00",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="font-extrabold">
                        {data?.result}
                        {data?.value ? ` / ${data.value}` : ""}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/60 p-4 px-6 rounded-full shadow-sm transition-transform hover:translate-x-1 duration-300">
                <QuestionCircleBoldDuotone
                  width={28}
                  height={24}
                  className="text-main"
                />
                <div className="leading-5">
                  <div className="text-gray-500 text-[13px]">Асуултын тоо</div>
                  <div className="font-extrabold">{data?.total || "-"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/60 p-4 px-6 rounded-full shadow-sm transition-transform hover:translate-x-1 duration-300">
                <CheckCircleBoldDuotone
                  width={28}
                  height={24}
                  className="text-main"
                />
                <div className="leading-5">
                  <div className="text-gray-500 text-[13px]">Зөв хариулсан</div>
                  <div className="font-extrabold">{data?.point || "-"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">📱</div>
          <h3 className="text-xl font-bold mb-2">Үр дүн ©</h3>
          <p className="text-gray-600 mb-6">
            Таны төхөөрөмж PDF файлыг шууд харуулах боломжгүй байна. Та доорх
            товч дээр дарж PDF файлыг татаж авна уу.
          </p>
          <div className="inline-block">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
                <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-2 px-7">
                  <DownloadBoldDuotone
                    width={18}
                    height={18}
                    className="text-main"
                  />
                  Тайлан
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="pt-6">
          {data?.assessment === 45 ? (
            <>
              <h1 className="pb-6 text-xl font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent text-center">
                “{data?.assessmentName}” тестийн тухай
              </h1>
              <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden">
                <AnimatedBackground />
                <h2 className="text-base font-extrabold mb-4 px-1 flex items-center gap-2">
                  <GraphNewUpBoldDuotone width={20} />
                  Үнэлгээний түвшин
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="bg-green-100/50 backdrop-blur-md rounded-3xl p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row items-center gap-3 ">
                        <div className="bg-emerald-600 backdrop-blur-lg text-white rounded-full px-4 pt-5 pb-3 text-center leading-3 shrink-0 w-fit">
                          <p className="font-semibold opacity-90">Оноо</p>
                          <p className="text-base font-black">9-10</p>
                        </div>
                        <div className="text-emerald-800 font-bold text-base leading-4">
                          Таны санхүүгийн суурь ойлголт{" "}
                          <span className="font-extrabold text-base">
                            маш сайн
                          </span>{" "}
                          байна.
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed px-2 text-justify">
                        Та орлогын тайлан, баланс, мөнгөн гүйлгээний тайлангийн
                        бүтэц, зориулалт, гол харьцаа үзүүлэлтүүдийн утгыг бүрэн
                        ойлгож байна. Энэхүү мэдлэг нь менежментийн түвшинд
                        оновчтой шийдвэр гаргах, төсөв төлөвлөлтийг мэргэжлийн
                        түвшинд боловсруулах, удирдлагын багтай үр дүнтэй
                        харилцах зэрэгт тань бодитой давуу тал болж чадна.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-100/50 backdrop-blur-md rounded-3xl p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row items-center gap-3 ">
                        <div className="bg-blue-700 backdrop-blur-lg text-white rounded-full px-4 pt-5 pb-3 text-center leading-3 shrink-0 w-fit">
                          <p className="font-semibold opacity-90">Оноо</p>
                          <p className="text-base font-black">7-8</p>
                        </div>
                        <div className="text-blue-800 font-bold text-base leading-4">
                          Таны санхүүгийн суурь ойлголт{" "}
                          <span className="font-extrabold text-base">
                            хангалттай сайн
                          </span>{" "}
                          түвшинд байна.
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed px-2 text-justify">
                        Та санхүүгийн үндсэн ойлголтуудыг ерөнхийд нь ойлгож,
                        мэддэг болсон боловч зарим нарийн ойлголт болон
                        тайлангуудын уялдаа холбоог гүнзгийрүүлэн судлах
                        шаардлагатай байна. Цаашид практикт тулгуурласан
                        сургалт, санхүүгийн тайлан унших дадлага хийх нь
                        мэдлэгээ бататгаж, хэрэглээний түвшинд ашиглах чадварыг
                        нэмэгдүүлэхэд тань тус болно.
                      </p>
                    </div>
                  </div>
                  <div className="bg-yellow-100/50 backdrop-blur-md rounded-3xl p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row items-center gap-3 ">
                        <div className="bg-yellow-700 backdrop-blur-lg text-white rounded-full px-4 pt-5 pb-3 text-center leading-3 shrink-0 w-fit">
                          <p className="font-semibold opacity-90">Оноо</p>
                          <p className="text-base font-black">5-6</p>
                        </div>
                        <div className="text-yellow-800 font-bold text-base leading-4">
                          Таны санхүүгийн суурь ойлголт{" "}
                          <span className="font-extrabold text-base">
                            хангалттай
                          </span>{" "}
                          түвшинд байна.
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed px-2 text-justify">
                        Та зарим үндсэн ойлголтыг мэддэг ч, санхүүгийн тайланг
                        уншиж ойлгох, дүн шинжилгээ хийх чадвар харьцангуй сул
                        байна. Энэ нь шийдвэр гаргалт болон тайлангийн үр дүнг
                        үнэлэхэд тодорхойгүй байдал болон эрсдэл дагуулах
                        болзошгүй юм. Иймээс та санхүүгийн суурь мэдлэгийг
                        системтэйгээр олж авах, практик дасгалууд хийгээрэй.
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-100/50 backdrop-blur-md rounded-3xl p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-row items-center gap-3 ">
                        <div className="bg-red-700 backdrop-blur-lg text-white rounded-full px-4 pt-5 pb-3 text-center leading-3 shrink-0 w-fit">
                          <p className="font-semibold opacity-90">Оноо</p>
                          <p className="text-base font-black">≤ 4</p>
                        </div>
                        <div className="text-red-800 font-bold text-base leading-4">
                          Таны санхүүгийн суурь ойлголт одоогоор{" "}
                          <span className="font-extrabold text-base">сул</span>{" "}
                          түвшинд байна.
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed px-2 text-justify">
                        Суурь мэдлэгээ системтэйгээр бататгахгүй бол шийдвэр
                        гаргалт болон тайлангийн үр дүнг үнэлэх үед алдаа гаргах
                        эрсдэлтэй. Иймээс санхүүгийн анхан шатны сургалтад
                        хамрагдаж, орлогын тайлан, баланс, мөнгөн гүйлгээний
                        тайлангийн үндэс болон гол харьцаа үзүүлэлтүүдийг шат
                        дараатай эзэмших, тайлан унших практик дасгал ажлуудыг
                        тогтмол хийгээрэй. Санхүүгийн суурь мэдлэг нь таны
                        цаашдын амжилттай ажиллах үндэс болох юм.
                      </p>
                    </div>
                  </div>
                </div>
                <h2 className="mt-6 text-base font-extrabold mb-4 px-1 flex items-center gap-2">
                  <LightbulbBoltBoldDuotone width={20} />
                  Таны мэдлэгт
                </h2>
                <div className="space-y-6">
                  <div className="gap-3 bg-gray-100/50 backdrop-blur-md p-5 px-6 rounded-3xl shadow-sm">
                    <div className="leading-5">
                      <div className="font-extrabold pb-2 text-[15px]">
                        Менежерүүдэд санхүүгийн суурь ойлголт яагаад
                        шаардлагатай вэ?
                      </div>
                      <p className="text-gray-700 leading-relaxed text-justify">
                        Олон менежер, удирдах түвшний ажилтнууд өөрсдийн
                        мэргэжлийн салбарт маш чадварлаг байдаг ч санхүүгийн
                        талын суурь мэдлэг дутмаг байх тохиолдол элбэг.
                        Санхүүгийн суурь ойлголт нь бизнесийн &quot;хэл&quot;
                        гэсэн үг бөгөөд энэ мэдлэггүйгээр та байгууллагынхаа
                        бодит нөхцөл байдлыг бүрэн дүүрэн ойлгоход хүндрэлтэй
                        байж магадгүй. Өөрөөр хэлбэл, санхүүгийн суурь мэдлэг нь
                        удирдлагуудад бизнесийн шийдвэрээ баримттай, итгэлтэй
                        гаргахад тусалдаг чухал хэрэгсэл юм.
                      </p>
                    </div>
                  </div>
                  <div className="gap-3 bg-gray-100/50 backdrop-blur-md p-5 px-6 rounded-3xl shadow-sm">
                    <div className="leading-5">
                      <div className="font-extrabold pb-2 text-[15px]">
                        Санхүүгийн суурь ойлголт гэж юу вэ?
                      </div>
                      <p className="text-gray-700 leading-relaxed text-justify">
                        Санхүүгийн суурь ойлголт буюу санхүүгийн боловсрол гэдэг
                        нь мөнгө, орлого, зарлага, ашиг, өртөг, төсөвлөлт зэрэг
                        бизнес, эдийн засгийн үндсэн ойлголтуудыг мэдэх,
                        тэдгээрийг өдөр тутмын ажилдаа хэрэглэх чадварыг хэлнэ.
                        Өөрөөр хэлбэл, энэ нь санхүүгийн тайлан балансыг унших,
                        компанийн мөнгөн урсгал (cash flow) болон ашигт
                        ажиллагааг ойлгож, санхүүгийн мэдээлэлд үндэслэн зөв
                        шийдвэр гаргах чадвар юм. <br />
                        <br />
                        Санхүүгийн суурь мэдлэгтэй менежер хүн компанийнхаа
                        санхүүгийн &quot;том зургийг&quot; харж чаддаг.
                        Жишээлбэл, тухайн төсөл, хэлтсийн үйл ажиллагаа
                        компанийн нийт ашиг орлогод хэрхэн нөлөөлж байгааг
                        ойлгох, эсвэл гарч буй зардал, хөрөнгө оруулалт нь
                        ирээдүйд ямар үр өгөөж авчрахыг тооцоолох чадвартай
                        болно. Энэ нь цаашлаад компанийхаа стратеги, зорилготой
                        уялдсан оновчтой шийдвэрүүдийг гаргахад үндэс суурь болж
                        өгдөг.
                      </p>
                    </div>
                  </div>
                  <div className="gap-3 bg-gray-100/50 backdrop-blur-md p-5 px-6 rounded-3xl shadow-sm">
                    <div className="leading-5">
                      <div className="font-extrabold pb-2 text-[15px]">
                        Яагаад санхүүгийн мэдлэгтэй байх хэрэгтэй вэ?
                      </div>
                      <p className="text-gray-700 leading-relaxed text-justify">
                        Санхүүгийн суурь мэдлэггүй удирдах ажилтан нь бизнесээ
                        &quot;нүдээ аниад&quot; удирдаж байгаатай адил гэж хэлж
                        болно. Учир нь аливаа бизнесийн бүх үйл ажиллагаа
                        эцэстээ санхүүгийн үзүүлэлтээр хэмжигддэг. Ашиг,
                        борлуулалт, зардал, хөрөнгө оруулалт гэх мэт
                        ойлголтуудыг мэдэхгүйгээр менежер хүн өөрийн шийдвэрийн
                        санхүүгийн үр дагаврыг бүрэн дүгнэх боломжгүй.
                        <br />
                        <br />
                        Жишээ нь: Маркетингийн хэлтсийн захирал шинэ
                        сурталчилгааны кампанит ажил эхлүүлэхдээ зөвхөн бүтээлч
                        санаа, борлуулалтын өсөлтөө төсөөлөөд зогсохгүй, тухайн
                        кампанит ажлын зардал нь борлуулалтаас олох орлогоос
                        давах эсэхийг тооцох шаардлагатай. Санхүүгийн мэдлэгтэй
                        бол тэрээр энэ хөрөнгө оруулалтын өгөөж (ROI) хэр байхыг
                        урьдчилан тооцоолж, кампанит ажлын төсөв, үр дүнг
                        бодитоор үнэлэх боломжтой болно. Харин эсрэгээр, хэрэв
                        тэр санхүүгийн мэдлэггүй бол зөвхөн зарцуулж буй мөнгөн
                        дүн бус, эргээд ямар ашиг авчрахыг нь сайн ойлгохгүйгээр
                        шийдвэр гаргаж болзошгүй. Үүний үр дүнд кампанит ажил
                        амжилттай мэт харагдавч санхүүгийн хувьд алдагдалтай
                        болж магадгүй.
                        <br />
                        <br />
                        Өөр нэг жишээ авч үзье: Үйлдвэрийн үйл ажиллагаа
                        хариуцсан менежер шинэ тоног төхөөрөмж авах санал
                        гаргадаг. Хэрэв тэрээр санхүүгийн суурь ойлголттой бол
                        шинэ тоног төхөөрөмжийн өртөг, үйлдвэрлэлийн гарцыг
                        нэмэгдүүлснээр олох ашиг, зардал нөхөх хугацаа (payback
                        period) зэргийг тооцож, энэхүү хөрөнгө оруулалт компанид
                        үнэхээр үр ашигтай эсэхийг дүгнэж чадна. Санхүүгийн
                        мэдлэггүй менежер бол зөвхөн тоног төхөөрөмжийн
                        техникийн давуу талд татагдан, санхүүгийн үр дагаврыг нь
                        тооцолгүй худалдан авч мэдэх юм. Ийнхүү санхүүгийн
                        мэдлэг нь менежер бүрт өөрийн санал, шийдвэрээ тоон
                        мэдээлэл, үндэслэлтэйгээр хамгаалах боломжийг олгодог.
                      </p>
                    </div>
                  </div>
                  <div className="gap-3 bg-gray-100/50 backdrop-blur-md p-5 px-6 rounded-3xl shadow-sm">
                    <div className="leading-5">
                      <p className="text-gray-700 leading-relaxed text-justify">
                        Судалгаагаар санхүүгийн мэдлэгтэй ажилтнууд нь ажил
                        дээрээ илүү итгэлтэй байж, багаа үр дүнтэй удирдах
                        хандлагатай байдгийг дурдсан байдаг. Өөрөөр хэлбэл,
                        санхүүгийн &quot;үг хэллэг&quot;- ийг ойлгодог болсон
                        менежерүүд компанийн удирдлага болон санхүүгийн
                        хэлтэстэй үр дүнтэй харилцах чадвартай болж, мэдээлэл
                        солилцоо сайжирдаг. Энэ нь алдаа эндэгдлээс сэргийлж,
                        цаг хугацаа хэмнэхээс гадна, компанийн санхүүгийн
                        зорилтуудыг багтаа ойлгуулж, хамтдаа зорилгоо биелүүлэх
                        нөхцөлийг бүрдүүлдэг.
                        <br />
                        <br />
                        Энэхүү тайлан нь таны санхүүгийн суурь мэдлэгийн түвшинг
                        өөрийн үнэлгээгээр тодорхойлох боломжийг олгож, цаашид
                        хөгжүүлэх шаардлагатай чиглэлээ тодорхойлоход тусална.
                        Авсан оноондоо үндэслэн мэдлэг, чадварын түвшингээ
                        үнэлж, түүнд тохирсон сургалт, дадлага, хөгжлийн
                        алхмуудаас сонгон хэрэгжүүлээрэй.
                        <br />
                        <br />
                        Санхүүгийн суурь мэдлэг нь зөвхөн санхүүгийн
                        мэргэжилтнүүдийн эзэмших чадвар биш юм. Энэ нь аливаа
                        бизнесийн шийдвэрийг баримт, нотолгоонд тулгуурлан, үр
                        дүнтэй, эрсдэл багатай гаргахад зайлшгүй шаардлагатай
                        мэдлэг, ур чадварын нэг билээ. Тэр дундаа удирдах
                        түвшний ажилтнуудад “санхүүгийн хэл”-ээр ойлголцох
                        чадвар нь байгууллагын амжилт, тогтвортой хөгжлийн гол
                        түлхүүр болдог.
                        <br />
                        <br />
                        Таны санхүүгийн мэдлэгт тань амжилт, бүтээлийн дээдийг
                        хүсье.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
