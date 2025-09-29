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
} from "solar-icons";
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
  const [pdfData, setPdfData] = useState(null);

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
      </div>
      <Footer />
    </div>
  );
}
