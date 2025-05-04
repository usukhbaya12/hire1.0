"use client";

import React, { useEffect, useState } from "react";
import { Button, Spin, message, Progress, Tooltip, Divider } from "antd";
import { getAssessmentById, getUserTestHistory } from "@/app/api/assessment";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/app/utils/routes";
import InfoModal from "@/components/modals/Info";
import { getCode } from "@/app/api/main";
import {
  AlarmBoldDuotone,
  QuestionCircleBoldDuotone,
  SquareAltArrowLeftBoldDuotone,
  InfoCircleBoldDuotone,
  RocketBoldDuotone,
  ShieldBoldDuotone,
  ClockCircleBoldDuotone,
  GraphUpLineDuotone,
  NotesBoldDuotone,
} from "solar-icons";
import { LoadingOutlined } from "@ant-design/icons";
import Error from "@/components/Error";
import LoadingSpinner from "@/components/Spin";

export default function TestDetails() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id;
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [startingExam, setStartingExam] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const testHistoryResponse = await getUserTestHistory(testId);

        if (testHistoryResponse.success) {
          const unusedTestRows = testHistoryResponse.data?.data?.filter(
            (item) => item.usedUserCount === 0 && item.status === 20
          );

          if (unusedTestRows?.length > 0) {
            setServiceId(unusedTestRows[0].id);
          } else {
            router.push(`/test/${testId}`);
            return;
          }
        }

        const assessmentResponse = await getAssessmentById(testId);
        if (assessmentResponse.success) {
          setAssessmentData(assessmentResponse.data);
        } else {
          messageApi.error("Тестийн мэдээлэл авахад алдаа гарлаа");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId, router, messageApi]);

  const handleStartExam = async () => {
    if (assessmentData?.data?.advice) {
      setShowModal(true);
      return;
    }

    await startExam();
  };

  const startExam = async () => {
    try {
      setShowModal(false);
      setStartingExam(true);

      const examResponse = await getCode({
        service: serviceId,
        count: 1,
      });

      if (examResponse.success) {
        const examId = examResponse.data;
        router.push(`/exam/${examId}`, undefined, { shallow: true });
      } else {
        messageApi.error("Тест эхлүүлэхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error starting exam:", error);
      messageApi.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setStartingExam(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!assessmentData || !assessmentData.questionCategories) {
    return <Error message="Тест өгөх эрхгүй байна." />;
  }

  const sections = assessmentData.questionCategories
    .map((item) => ({
      id: item.id,
      title: item.name,
      duration: item.duration || 0,
      questions: item.questionCount,
      orderNumber: item.orderNumber || 0,
    }))
    .sort((a, b) => a.orderNumber - b.orderNumber);

  const totalQuestions =
    assessmentData.data.questionCount ||
    sections.reduce((sum, section) => sum + section.questions, 0);

  const totalDuration =
    assessmentData.data.duration ||
    sections.reduce((sum, section) => sum + section.duration, 0);

  return (
    <>
      <title>{assessmentData?.data.name}</title>
      {contextHolder}
      <div className="relative">
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/5 blur-[80px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/5 blur-[100px]" />
        </div>

        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pt-8 md:pt-12 pb-6 z-[3]">
          <div className="flex items-center gap-3 mb-6 md:sticky md:top-28">
            <button
              className="hover:text-main transition-colors duration-300"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <SquareAltArrowLeftBoldDuotone width={24} height={24} />
            </button>
            <h1 className="text-lg font-black">Тестийг эхлүүлэхээс өмнө...</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-0 md:gap-8">
            <div className="lg:col-span-1">
              <div className="md:sticky md:top-40">
                <div className="bg-white rounded-3xl shadow shadow-slate-200 overflow-hidden">
                  <div className="p-6 relative overflow-hidden rounded-t-3xl">
                    <div className="absolute inset-0 opacity-10">
                      <svg
                        viewBox="0 0 80 80"
                        className="w-full h-full"
                        preserveAspectRatio="none"
                      >
                        <circle cx="40" cy="40" r="30" fill="white" />
                        <path d="M0,80 L80,0 L80,80 L0,80 Z" fill="white" />
                        <path
                          d="M0,0 L80,0 L80,40 L40,80 L0,80 Z"
                          fillOpacity="0.1"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="relative z-10 w-60 h-60 mx-auto mb-4 bg-main/70 backdrop-blur-sm rounded-full shadow-inner flex items-center justify-center">
                      {assessmentData?.data?.icons ? (
                        <img
                          src={`${api}file/${assessmentData.data.icons}`}
                          alt="Test icon"
                          className="w-52 h-52 object-contain rounded-full p-2"
                        />
                      ) : (
                        <NotesBoldDuotone className="w-36 h-36 text-white" />
                      )}
                    </div>
                    <h2 className="text-2xl font-black text-center bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent relative z-10 leading-tight">
                      {assessmentData.data?.name}
                    </h2>
                  </div>
                  <div className="px-10 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-gray-700">Нийт асуултын тоо:</div>
                      <div className="text-base font-black">
                        {totalQuestions}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-gray-700">Тест өгөх хугацаа:</div>
                      <div className="text-base font-black">
                        {totalDuration > 0
                          ? totalDuration + " минут"
                          : "Хугацаагүй"}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-gray-700">Хэсгийн тоо:</div>
                      <div className="text-base font-black">
                        {sections.length}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        className="grd-btn h-12 w-full"
                        onClick={handleStartExam}
                        loading={startingExam}
                      >
                        Тест эхлүүлэх
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white/40 background-blur-md rounded-3xl shadow-sm p-6 mb-6 mt-6 sm:mt-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                    <ShieldBoldDuotone width={20} height={20} />
                  </div>
                  <h3 className="font-bold text-gray-800">Анхаарах зүйлс</h3>
                </div>
                <Divider />
                <div className="space-y-2 text-gray-700 pl-4 pt-2 pb-1">
                  <p className="flex items-start gap-2">
                    <span className="text-main">•</span>
                    Хэсэг тус бүрийг тасалдуулахгүйгээр тестэд бүрэн хариулж
                    дуусгана уу.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-main">•</span>
                    Таны хариулт хэсэг тус бүрээр хадгалагдах тул дараагийн
                    хэсэг рүү шилжихгүйгээр тестээс гарвал хариулт нь автоматаар
                    хадгалагдахгүй.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-main">•</span>
                    Сүлжээний тасалдлаас болж гарсан тохиолдолд, ижил холбоосоор
                    яаралтай дахин орно уу.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-main">•</span>
                    {assessmentData.data?.timeout
                      ? "Хугацааны хязгаарлалттай тул дэлгэцийн дээд хэсэгт байрлах цагийг тогтмол шалгана уу."
                      : "Хугацааны хязгаарлалт байхгүй ч боломжит хурдан хугацаанд хариулна уу."}
                  </p>
                </div>
              </div>
              <div className="bg-white/40 background-blur-md rounded-3xl shadow shadow-slate-200 mb-6 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-main/10 rounded-full flex items-center justify-center text-main">
                    <GraphUpLineDuotone width={20} height={20} />
                  </div>
                  <h3 className="font-bold text-gray-800">Асуумжийн бүтэц</h3>
                </div>

                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div key={section.id} className="relative">
                      {index < sections.length - 1 && (
                        <div className="absolute left-[39px] top-16 w-0.5 h-[calc(100%_-_24px)] bg-gray-100 z-0"></div>
                      )}

                      <div className="bg-white rounded-3xl border border-gray-100 p-5 relative z-10">
                        <div className="flex items-center gap-6">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <div className="text-gray-700 font-black">
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex-grow">
                            <h4 className="font-black text-main mb-2">
                              {section.title}
                            </h4>

                            <div className="flex gap-4">
                              {section.duration > 0 && (
                                <div className="flex items-center gap-2">
                                  <AlarmBoldDuotone className="w-5 h-5 text-main" />
                                  <div className="flex gap-1 items-baseline">
                                    <span className="font-bold text-black">
                                      {section.duration}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                      минут
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <QuestionCircleBoldDuotone className="w-5 h-5 text-main" />
                                <div className="flex gap-1 items-baseline">
                                  <span className="font-bold text-black">
                                    {section.questions}
                                  </span>
                                  <span className="text-gray-500 text-sm">
                                    асуулт
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InfoModal
        open={showModal}
        onOk={startExam}
        onCancel={() => setShowModal(false)}
        advice={assessmentData?.data?.advice || ""}
      />
    </>
  );
}
