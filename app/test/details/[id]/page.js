"use client";

import { Button, Spin } from "antd";
import { getAssessmentById, getUserTestHistory } from "@/app/api/assessment";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useId } from "react";
import { api } from "@/app/utils/routes";
import { useRouter } from "next/navigation";
import InfoModal from "@/components/modals/Info";
import { getCode } from "@/app/api/main";
import {
  AlarmBoldDuotone,
  Flag2BoldDuotone,
  FolderCloudBoldDuotone,
  QuestionCircleBoldDuotone,
  SquareAltArrowLeftBoldDuotone,
} from "solar-icons";

const Image = ({ icons, className }) => (
  <div className={`relative aspect-square ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f36421" />
          <stop offset="100%" stopColor="#ed1c45" />
        </linearGradient>
        <clipPath id="clip">
          <circle cx="100" cy="100" r="61" />
        </clipPath>
      </defs>
      <circle
        cx="100"
        cy="100"
        r="85"
        stroke="url(#grad)"
        strokeWidth="30"
        fill="white"
      />
      {icons && (
        <image
          href={`${api}file/${icons}`}
          x="30"
          y="30"
          width="140"
          height="140"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#clip)"
        />
      )}
    </svg>
  </div>
);

const Cards = ({ icon, title, value, index }) => {
  const positions = [
    { x: "left-0", y: "top-0" },
    { x: "right-0", y: "top-0" },
    { x: "left-0", y: "bottom-0" },
    { x: "right-0", y: "bottom-0" },
    { x: "left-20", y: "top-20" },
    { x: "right-20", y: "bottom-20" },
    { x: "left-10", y: "bottom-10" },
    { x: "right-10", y: "top-10" },
  ];
  const position = positions[index % positions.length];

  const sizes = ["w-24 h-24", "w-32 h-32", "w-40 h-40"];
  const size = sizes[index % sizes.length];

  return (
    <div className="group relative bg-white/70 rounded-full p-4 flex items-start gap-4 shadow shadow-slate-200 backdrop-blur-md transition-all duration-300 overflow-hidden">
      <div
        className={`absolute ${position.x} ${position.y} ${size} bg-secondary/5 rounded-full 
        group-hover:scale-150 transition-transform duration-500`}
      />

      <div className="bg-main/90 rounded-full">
        <div className="relative z-10 p-3 rounded-xl text-white">{icon}</div>
      </div>

      <div className="relative z-10">
        <div className="text-sm text-gray-700 pt-1.5">{title}</div>
        <div className="text-xl font-extrabold -mt-0.5">{value}</div>
      </div>
    </div>
  );
};

const Blocks = ({ number, title, duration, questions }) => (
  <div className="p-5 px-7 last:border-b-0 hover:bg-gray-50 transition-colors">
    <div className="flex items-center gap-6">
      <div className="w-8 h-8 flex items-center justify-center bg-main/10 rounded-full text-main font-bold">
        {number}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="flex gap-4 mt-1 text-sm text-gray-700">
          {duration > 0 && (
            <div className="flex items-center gap-2">
              <AlarmBoldDuotone className="w-4 h-4" />
              {duration} минут
            </div>
          )}
          <div className="flex items-center gap-2">
            <QuestionCircleBoldDuotone className="w-4 h-4" />
            {questions} асуулт
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function TestDesc() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id;
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [serviceId, setServiceId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const testHistoryResponse = await getUserTestHistory(testId);

        if (testHistoryResponse.success) {
          const hasUnusedTest = testHistoryResponse.data?.some(
            (item) => item.usedUserCount === 0 && item.status === 20
          );

          const unusedTestRows = testHistoryResponse.data?.filter(
            (item) => item.usedUserCount === 0 && item.status === 20
          );

          if (unusedTestRows?.length > 0) {
            setServiceId(unusedTestRows[0].id);
          }

          if (!hasUnusedTest) {
            router.push(`/test/${testId}`);
            return;
          }
        }

        const assessmentResponse = await getAssessmentById(testId);
        if (assessmentResponse.success) {
          setAssessmentData(assessmentResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin tip="Уншиж байна..." fullscreen spinning={loading} />
      </div>
    );
  }

  if (!assessmentData || !assessmentData.questionCategories) {
    return null;
  }

  const sections = assessmentData.questionCategories?.map((item) => ({
    title: item.name,
    duration: item.duration || 0,
    questions: item.questionCount,
  }));

  const stats = [
    {
      icon: <FolderCloudBoldDuotone width={32} height={32} />,
      title: "Хэсэг",
      value: assessmentData.questionCategories?.length,
    },
    {
      icon: <QuestionCircleBoldDuotone width={32} height={32} />,
      title: "Нийт асуултын тоо",
      value: assessmentData.data?.questionCount,
    },
    {
      icon: <AlarmBoldDuotone width={32} height={32} />,
      title: "Тест өгөх хугацаа",
      value: assessmentData.data?.duration + " минут",
    },
    {
      icon: <Flag2BoldDuotone width={32} height={32} />,
      title: "Хугацаатай эсэх",
      value: assessmentData.data?.timeout ? "Тийм" : "Үгүй",
    },
  ];

  const handleStartExam = async () => {
    try {
      setShowModal(false);

      const examResponse = await getCode({
        service: serviceId,
        count: 1,
      });

      if (examResponse.success) {
        const examId = examResponse.data;
        router.push(`/exam/${examId}`, undefined, { shallow: true });
      }
    } catch (error) {
      console.error("Error starting exam:", error);
      message.error("Алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  return (
    <>
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/5 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/5 blur-[100px]" />
      </div>
      <div className="2xl:px-60 xl:px-24 lg:px-16 md:px-12 px-6 pt-6">
        <div className="lg:flex gap-12">
          <div className="lg:w-1/3 mb-8 lg:mb-0">
            <div className="sticky top-[84px] sm:top-[104px]">
              <div className="flex items-center gap-1 mb-4">
                <button
                  className="p-2 hover:text-main rounded-lg transition-colors duration-300"
                  onClick={() => router.back()}
                >
                  <SquareAltArrowLeftBoldDuotone />
                </button>
                <h1 className="text-lg font-black">
                  Тестийг эхлүүлэхээс өмнө...
                </h1>
              </div>
              <div className="bg-white/70 backdrop-blur-md p-8 px-12 rounded-3xl shadow shadow-slate-200 mb-6">
                <Image
                  icons={assessmentData.data?.icons || []}
                  className="mx-auto mb-6 "
                />
                <h2 className="text-2xl font-black text-center mb-4 bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent leading-7">
                  {assessmentData.data?.name}
                </h2>
                <p className="text-gray-700 text-center leading-4">
                  Тестийг эхлүүлэхээс өмнө та дараах шаардлагатай мэдээлэлтэй
                  танилцаарай!
                </p>
              </div>

              <Button onClick={() => setShowModal(true)} className="w-full">
                Тест эхлүүлэх
              </Button>
            </div>
          </div>

          <InfoModal
            open={showModal}
            onOk={handleStartExam}
            onCancel={() => setShowModal(false)}
            text="Эхлэхээс өмнө дараах зүйлсийг анхаарна уу."
            list="<ul class='list-disc'><li class='py-1'>Хугацааны хязгаарлалттай тул дэлгэцийн дээд хэсэгт байрлах цагийг тогтмол шалгана уу.</li><li class='py-1'>Тест эхэлснээс хойш түр зогсоох болон хойшлуулах боломжгүйг анхаараарай.</li><li class='py-1'>Сүлжээний тасалдлаас болж гарсан тохиолдолд, ижил холбоосоор яаралтай дахин орно уу.</li></ul>"
          />

          <div className="lg:flex-1 sm:pt-[72px]">
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Cards key={index} {...stat} index={index} />
              ))}
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow shadow-slate-200 mb-10">
              <div className="p-5 px-7 border-b">
                <div className="flex items-center gap-3 py-1">
                  <div className="p-2 bg-main/10 rounded-xl text-main">
                    <Flag2BoldDuotone />
                  </div>
                  <h3 className="font-bold">Анхаарах зүйлс</h3>
                </div>
                <p className="mt-4 text-gray-700 pr-3 text-justify pl-1">
                  Хэсэг тус бүрийг тасалдуулахгүйгээр тестэд бүрэн хариулж
                  дуусгах хангалттай цаг гаргах хэрэгтэйг анхаараарай. Анхаарлаа
                  сайн төвлөрүүлэхийн тулд хэсгүүдийн хооронд түр хугацаанд
                  амарч болно.
                </p>
              </div>

              <div className="divide-y">
                {sections.map((section, index) => (
                  <Blocks key={index} number={index + 1} {...section} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
