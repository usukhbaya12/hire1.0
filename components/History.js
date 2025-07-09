import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Collapse, Divider, Timeline } from "antd";
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
  CalendarBoldDuotone,
} from "solar-icons";
import { getReport } from "@/app/api/exam";
import { DropdownIcon } from "./Icons";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/app/utils/routes";

const AssessmentCard = ({ assessment, isInvited = false }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loadingCodes, setLoadingCodes] = useState({});
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
      setLoadingCodes((prev) => ({ ...prev, [code]: true }));
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
      setLoadingCodes((prev) => ({ ...prev, [code]: false }));
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

  const shareToFacebookWithMeta = (testId, examCode) => {
    const siteUrl = "https://hire.mn";

    const shareUrl = `${siteUrl}/share/${testId}/${examCode}`;

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;

    window.open(facebookShareUrl, "_blank", "width=600,height=400");
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

          const code = history.exams?.code;
          const isLoading = code ? loadingCodes[code] : false;

          console.log("k", histories);

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
                <div className="w-full bg-white rounded-3xl p-4 bg-white px-6 shadow shadow-slate-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarBoldDuotone width={18} />
                      <span>
                        {(history.exams?.userEndDate &&
                          new Date(
                            history.exams.userEndDate
                          ).toLocaleDateString()) ||
                          (history.exams?.userStartDate &&
                            new Date(
                              history.exams.userStartDate
                            ).toLocaleDateString()) ||
                          new Date(history.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      {userEndDate ? (
                        <div className="relative group w-fit">
                          <div className="absolute -inset-0.5 bg-gradient-to-br from-lime-800/50 to-green-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                          <div className="relative bg-gradient-to-br from-lime-600/20 to-green-600/30 rounded-full flex items-center justify-center border border-yellow-900/10">
                            <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-black/60 to-black/70 bg-clip-text text-transparent py-1 px-3.5">
                              <div className="w-2 h-2 bg-lime-600 rounded-full -mt-0.5"></div>
                              Дуусгасан
                            </div>
                          </div>
                        </div>
                      ) : examStartDate && !userEndDate ? (
                        <div className="relative group w-fit">
                          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600/50 to-blue-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                          <div className="relative bg-gradient-to-br from-blue-400/30 to-blue-300/20 rounded-full flex items-center justify-center border border-blue-900/10">
                            <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-1 px-3.5">
                              <div className="w-2 h-2 bg-blue-500 rounded-full -mt-0.5"></div>
                              Дуусгаагүй
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group w-fit">
                          <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-600/50 to-orange-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                          <div className="relative bg-gradient-to-br from-yellow-400/30 to-yellow-300/20 rounded-full flex items-center justify-center border border-yellow-900/10">
                            <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-1 px-3.5">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full -mt-0.5"></div>
                              Өгөөгүй
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* <div className="flex items-center gap-2">
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
                      ></div>
                      <div className="font-bold">
                        {userEndDate
                          ? "Дуусгасан"
                          : examStartDate && !userEndDate
                          ? "Дуусгаагүй"
                          : isExpired
                          ? "Хугацаа дууссан"
                          : "Өгөөгүй"}
                      </div>
                    </div> */}
                  </div>
                  <div className="font-bold pt-2">
                    {history?.exams?.result?.result}
                    {history?.exams?.result?.value
                      ? ` / ${history?.exams?.result?.value}`
                      : ""}
                  </div>
                  <Divider className="no-margin2" />
                  <div className="flex items-center justify-between">
                    {isExpired ? (
                      <Button className="border-none link-btn-4" disabled>
                        <AlarmBoldDuotone width={18} />
                        <span>Хугацаа хэтэрсэн</span>
                      </Button>
                    ) : isCompletedButNotVisible ? (
                      <Button className="link-btn-4 border-none" disabled>
                        <EyeClosedLineDuotone width={18} />
                        <span>Байгууллага</span>
                      </Button>
                    ) : (
                      <Button
                        loading={isLoading}
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
                          ? "Тайлан татах"
                          : examStartDate && !userEndDate
                          ? "Үргэлжлүүлэх"
                          : "Тест өгөх"}
                      </Button>
                    )}
                    {userEndDate && !isCompletedButNotVisible && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareToFacebookWithMeta(assessment.id, code);
                          }}
                          className="flex items-center gap-2"
                          title="Share on Facebook"
                        >
                          <Image
                            src="/facebook.png"
                            alt="Facebook icon"
                            width={18}
                            height={18}
                            priority
                          />
                          <div className="font-bold text-blue-700">
                            Хуваалцах
                          </div>
                        </button>
                      </div>
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
              <Link href={`/test/${assessment.originalId || assessment.id}`}>
                <h1 className="w-fit text-base font-extrabold leading-5 sm:min-h-[2.5rem] flex items-start">
                  <span className="pr-4 text-base leading-5 relative bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent cursor-pointer line-clamp-2 after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2.5px] after:bg-gradient-to-r after:from-main after:to-secondary after:scale-x-0 hover:after:scale-x-100 after:transition-transform">
                    {assessment.name}
                  </span>
                </h1>
              </Link>
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
                  <Link href={`/tests/${assessment.id}`}>
                    <Button className="stroked-btn my-4">
                      <UserPlusBoldDuotone width={18} />
                      Дэлгэрэнгүй
                    </Button>
                  </Link>
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Object.values(groupedData).map((assessment) => (
        <div key={assessment.id}>
          <AssessmentCard assessment={assessment} isInvited={isInvited} />
        </div>
      ))}
    </div>
  );
};

export default HistoryCard;
