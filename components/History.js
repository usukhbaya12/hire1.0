import React, { useState } from "react";
import { Collapse, Button, Timeline, message } from "antd";
import { DropdownIcon } from "./Icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ClipboardTextBoldDuotone,
  CursorLineDuotone,
  GlobalLineDuotone,
  HistoryLineDuotone,
  MouseBoldDuotone,
  NotesBoldDuotone,
  RoundArrowRightDownLineDuotone,
  UserPlusBoldDuotone,
  Wallet2BoldDuotone,
} from "solar-icons";
import { getReport } from "@/app/api/exam";

const AssessmentCard = ({ assessment }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const messageApi = message;

  const histories = assessment.histories.sort(
    (a, b) => new Date(b.examStarted) - new Date(a.examStarted)
  );

  const totalTests = assessment.histories.reduce(
    (sum, history) => sum + history.count,
    0
  );
  const usedTests = assessment.histories.reduce(
    (sum, history) => sum + (history.count - history.left),
    0
  );
  const remainingTests = totalTests - usedTests;
  const totalPrice = assessment.histories.reduce(
    (sum, history) => sum + history.price,
    0
  );

  const downloadReport = async (code) => {
    try {
      setLoading(true);
      const res = await getReport(code);

      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report_${code}.pdf`);
        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        messageApi.error("Тайлан татахад алдаа гарлаа.");
      }
    } catch (error) {
      console.error("GET / Aлдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (history) => {
    if (history.completed) {
      downloadReport(history.exams.code);
    } else if (!history.completed && history.examStarted) {
      router.push(`/exam//${history.exams.code}`);
    } else {
      router.push(`/test/details/${history.assessment}`);
    }
  };

  const AssessmentTimeline = ({ histories }) => (
    <Timeline
      items={histories.map((history) => ({
        dot: (
          <div
            className={`h-2 w-2 rounded-full ${
              history.completed
                ? "bg-green-600 border border-green-700"
                : history.examStarted && history.completed === null
                ? "bg-blue-400 border border-blue-500"
                : "bg-yellow-500 border border-yellow-600"
            }`}
          >
            <div
              className={`h-2 w-2 border blur-sm opacity-70 ${
                history.completed
                  ? "bg-green-500"
                  : history.examStarted && history.completed === null
                  ? "bg-blue-400"
                  : "bg-yellow-400"
              }`}
            ></div>
          </div>
        ),
        children: (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span>
                  {history.examStarted
                    ? new Date(history.examStarted).toLocaleDateString()
                    : "Өгөөгүй"}
                </span>
                <div>•</div>
                <Button
                  type="link"
                  className="link-btn-2"
                  onClick={() => handleButtonClick(history)}
                >
                  {history.completed ? (
                    <ClipboardTextBoldDuotone width={18} height={18} />
                  ) : history.examStarted && history.completed === null ? (
                    <MouseBoldDuotone width={18} height={18} />
                  ) : (
                    <CursorLineDuotone width={18} height={18} />
                  )}
                  {history.completed
                    ? "Тайлан"
                    : history.examStarted && history.completed === null
                    ? "Үргэлжлүүлэх"
                    : "Тест өгөх"}
                </Button>
              </div>
            </div>
          </>
        ),
      }))}
    />
  );

  return (
    <div className="w-full">
      <div className="w-full h-full relative overflow-hidden rounded-3xl shadow shadow-slate-200 bg-white/70 backdrop-blur-md px-6 pt-6">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-main/10 blur opacity-30"></div>
        <div className="absolute top-0 right-0">
          <NotesBoldDuotone
            width={150}
            height={150}
            className="opacity-10 text-main"
          />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1
                className="w-fit relative text-base font-extrabold leading-5 bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent cursor-pointer after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-main after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                onClick={() => router.push(`/test/${assessment.id}`)}
              >
                {assessment.name}
              </h1>
              {session?.user?.role === 30 ? (
                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <GlobalLineDuotone
                      width={18}
                      height={18}
                      className="text-main"
                    />
                    <div className="pt-0.5">
                      Aвсан эрх:
                      <span className="font-semibold pl-1">{totalTests}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pb-3 pt-0.5">
                    <RoundArrowRightDownLineDuotone
                      width={18}
                      height={18}
                      className="text-main"
                    />
                    <div className="pt-0.5">
                      Үлдсэн эрх:
                      <span className="font-semibold pl-1">
                        {remainingTests}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="text-main">
                        <Wallet2BoldDuotone width={22} />
                      </div>
                      <div className="text-main font-bold">
                        {totalPrice.toLocaleString()}₮
                      </div>
                    </div>
                  </div>
                  <Button
                    className="stroked-btn my-4"
                    onClick={() => router.push(`/tests/${assessment.id}`)}
                  >
                    <UserPlusBoldDuotone width={18} />
                    Дэлгэрэнгүй
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <HistoryLineDuotone
                      width={18}
                      height={18}
                      className="text-main"
                    />
                    <div className="pt-0.5">
                      Оролдлогын тоо:
                      <span className="font-semibold pl-1 text-main">
                        {histories.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {session?.user?.role === 20 && (
            <Collapse
              className="pt-2"
              expandIcon={({ isActive }) => (
                <DropdownIcon width={15} rotate={isActive ? 0 : -90} />
              )}
              ghost
              items={[
                {
                  key: "1",
                  label: <div className="mb-6">Дэлгэрэнгүй</div>,
                  children: <AssessmentTimeline histories={histories} />,
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const HistoryCard = ({ data }) => {
  if (!data || !Array.isArray(data)) return null;

  const { data: session } = useSession();
  const isOrganization = session?.user?.role === 30;

  const groupedData = data.reduce((acc, item) => {
    if (isOrganization || item.status === 20) {
      const assessment = item.assessment;
      if (!acc[assessment.id]) {
        acc[assessment.id] = {
          ...assessment,
          histories: [],
        };
      }
      acc[assessment.id].histories.push({
        createdAt: item.createdAt,
        completed: item.exams[0]?.userEndDate,
        price: item.price,
        count: item.count,
        left: item.count - item.usedUserCount,
        examStarted: item.exams[0]?.userStartDate,
        exams: item.exams[0],
        assessment: item.assessment.id,
      });
    }
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.values(groupedData).map((assessment) => (
        <div key={assessment.id}>
          <AssessmentCard assessment={assessment} />
        </div>
      ))}
    </div>
  );
};

export default HistoryCard;
