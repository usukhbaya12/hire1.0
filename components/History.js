import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Collapse, Timeline } from "antd";
import {
  CursorLineDuotone,
  MouseBoldDuotone,
  NotesBoldDuotone,
  RoundArrowRightDownLineDuotone,
  UserPlusBoldDuotone,
  Wallet2BoldDuotone,
  Buildings2BoldDuotone,
  ClipboardTextBoldDuotone,
  AlarmBoldDuotone,
  RestartLineDuotone,
  GlobalLineDuotone,
  EyeClosedLineDuotone,
  NotificationLinesRemoveBoldDuotone,
} from "solar-icons";
import { getReport } from "@/app/api/exam";
import { DropdownIcon } from "./Icons";

const AssessmentCard = ({ assessment, isInvited = false }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [messageApi, setMessageApi] = useState(null);

  const histories = assessment.histories.sort(
    (a, b) => new Date(b.examStarted) - new Date(a.examStarted)
  );

  const totalTests = assessment.histories.reduce(
    (sum, history) => sum + (history.count || 1),
    0
  );
  const usedTests = assessment.histories.reduce(
    (sum, history) => sum + ((history.count || 1) - (history.left || 0)),
    0
  );
  const remainingTests = totalTests - usedTests;
  const totalPrice = assessment.histories.reduce(
    (sum, history) => sum + (history.price || 0),
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
        if (messageApi) {
          messageApi.error("Тайлан татахад алдаа гарлаа.");
        }
      }
    } catch (error) {
      console.error("GET / Aлдаа гарлаа.", error);
      if (messageApi) {
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (history) => {
    if (history.completed) {
      downloadReport(history.exams.code);
    } else if (!history.completed && history.examStarted) {
      router.push(`/exam/${history.exams.code}`);
    } else if (!history.completed && isInvited) {
      router.push(`/exam/${history.exams.code}`);
    } else {
      router.push(`/test/details/${history.assessment}`);
    }
  };

  const AssessmentTimeline = ({ histories }) => {
    return (
      <Timeline
        items={histories.map((history) => {
          const examStartDate = history.examStarted
            ? new Date(history.examStarted)
            : null;
          const userEndDate = history.completed
            ? new Date(history.completed)
            : null;
          const examEndDate = history.endDate
            ? new Date(history.endDate)
            : null;
          const currentTime = new Date();

          const isExpired =
            examEndDate && examEndDate < currentTime && !userEndDate;

          const isInvitedTest = isInvited;

          const isCompletedButNotVisible =
            userEndDate &&
            isInvitedTest &&
            history.exams &&
            !history.exams.visible;

          return {
            dot: (
              <div
                className={`h-2 w-2 rounded-full ${
                  userEndDate
                    ? "bg-green-600 border border-green-700"
                    : examStartDate && !userEndDate
                    ? "bg-blue-400 border border-blue-500"
                    : isExpired
                    ? "bg-red-500 border border-red-600"
                    : "bg-yellow-500 border border-yellow-600"
                }`}
              >
                <div
                  className={`h-2 w-2 border blur-sm opacity-70 ${
                    userEndDate
                      ? "bg-green-500"
                      : examStartDate && !userEndDate
                      ? "bg-blue-400"
                      : isExpired
                      ? "bg-red-400"
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
                      {examStartDate
                        ? examStartDate.toLocaleDateString()
                        : "Өгөөгүй"}
                    </span>
                    <div>•</div>
                    {isExpired ? (
                      <Button className="border-none link-btn-4" disabled>
                        <AlarmBoldDuotone width={18} />
                        <span>Дууссан</span>
                      </Button>
                    ) : isCompletedButNotVisible ? (
                      <Button className="link-btn-4 border-none" disabled>
                        <EyeClosedLineDuotone width={18} />
                        <span>Байгууллага</span>
                      </Button>
                    ) : (
                      <Button
                        loading={loading}
                        type="link"
                        className="link-btn-2 border-none"
                        onClick={() => handleButtonClick(history)}
                        disabled={isExpired || isCompletedButNotVisible}
                      >
                        {userEndDate ? (
                          <ClipboardTextBoldDuotone width={18} height={18} />
                        ) : examStartDate && !userEndDate ? (
                          <MouseBoldDuotone width={18} height={18} />
                        ) : (
                          <CursorLineDuotone width={18} height={18} />
                        )}
                        {userEndDate
                          ? "Тайлан"
                          : examStartDate && !userEndDate
                          ? "Үргэлжлүүлэх"
                          : "Тест өгөх"}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ),
          };
        })}
      />
    );
  };

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
                onClick={() =>
                  router.push(`/test/${assessment.originalId || assessment.id}`)
                }
              >
                {assessment.name}
              </h1>
              {isInvited && (
                <div className="mt-2 mb-1">
                  <div className="flex items-center gap-2">
                    <Buildings2BoldDuotone
                      width={18}
                      height={18}
                      className="text-blue-600"
                    />
                    <div className="pt-0.5 text-blue-600 font-semibold">
                      {assessment.organizationName || "Байгууллага"}
                    </div>
                  </div>
                </div>
              )}
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
                    <RestartLineDuotone
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

const HistoryCard = ({ data, isInvited = false }) => {
  if (!data || !Array.isArray(data)) return null;

  const { data: session } = useSession();
  const isOrganization = session?.user?.role === 30;

  // Function to process standard user test data
  const processUserData = (data) => {
    return data.reduce((acc, item) => {
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
          service: item.service,
        });
      }
      return acc;
    }, {});
  };

  // Function to process invited tests data
  const processInvitedData = (data) => {
    return data.reduce((acc, item) => {
      const assessment = item.assessment;
      // Create a unique key that includes both assessment ID and organization ID
      const orgId = item.service?.user?.id || "unknown";
      const uniqueKey = `${assessment.id}-${orgId}`;

      if (!acc[uniqueKey]) {
        acc[uniqueKey] = {
          ...assessment,
          id: uniqueKey, // Use the unique key as id to prevent overwriting
          originalId: assessment.id, // Keep the original ID for navigation
          organizationId: orgId,
          organizationName:
            item.service?.user?.organizationName || "Unknown Organization",
          histories: [],
        };
      }

      acc[uniqueKey].histories.push({
        createdAt: item.createdAt,
        completed: item.userEndDate,
        price: 0,
        count: 1,
        left: 0,
        examStarted: item.userStartDate,
        endDate: item.endDate,
        exams: {
          code: item.code,
          userStartDate: item.userStartDate,
          userEndDate: item.userEndDate,
          visible: item.visible,
        },
        assessment: assessment.id,
        service: item.service,
      });

      return acc;
    }, {});
  };

  const groupedData = isInvited
    ? processInvitedData(data)
    : processUserData(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.values(groupedData).map((assessment) => (
        <div key={assessment.id}>
          <AssessmentCard assessment={assessment} isInvited={isInvited} />
        </div>
      ))}
    </div>
  );
};

export default HistoryCard;
