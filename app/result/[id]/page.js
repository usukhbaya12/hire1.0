"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Divider, Progress } from "antd";
import Image from "next/image";
import {
  DocumentBoldDuotone,
  UserIdBoldDuotone,
  ClipboardBoldDuotone,
  GraphUpBoldDuotone,
  DownloadBoldDuotone,
  CheckCircleBoldDuotone,
  QuestionCircleBoldDuotone,
  CalendarBoldDuotone,
  NotesBoldDuotone,
} from "solar-icons";
import Error from "@/components/Error";
import { getExamCalculation, getReport } from "@/app/api/exam";
import PdfViewer from "@/components/PdfViewer";
import Footer from "@/components/Footer";

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
          setData(resultResponse.data.value);

          try {
            const pdfResponse = await getReport(params.id);

            if (pdfResponse.success && pdfResponse.data) {
              const pdfBlob = new Blob([pdfResponse.data], {
                type: "application/pdf",
              });
              const pdfUrl = URL.createObjectURL(pdfBlob);
              setPdfData(pdfUrl);
            }
          } catch (pdfError) {
            console.error("Error fetching PDF:", pdfError);
          }
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

  const handleDownloadPdf = () => {
    if (pdfData) {
      const link = document.createElement("a");
      link.href = pdfData;
      link.download = `report_${params.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getScoreColorClass = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-main";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin
          fullscreen
          tip="Уншиж байна..."
          spinning={loading}
          indicator={<LoadingOutlined style={{ color: "white" }} spin />}
        />
      </div>
    );
  }

  if (error) {
    return <Error message={error} />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log(data);

  return (
    <div>
      <title>{data?.assessmentName || "Тестийн үр дүн"} | Hire.mn</title>

      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>

      <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pb-16">
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
                <ClipboardBoldDuotone
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
                    {data?.type === 11 ? (
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
                        {data?.value ? ` • ${data.value}` : ""}
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

        <PdfViewer pdfUrl={pdfData} />

        {!pdfData && data && (
          <div className="text-center mt-6">
            <a href="/" className="inline-block">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
                  <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-2 px-7">
                    Нүүр хуудас руу буцах
                  </div>
                </div>
              </div>
            </a>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
