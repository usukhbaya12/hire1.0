import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Collapse, Divider, Progress, Timeline } from "antd";
import {
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
  PlayCircleBoldDuotone,
  StarFallMinimalistic2BoldDuotone,
} from "solar-icons";
import { DropdownIcon } from "./Icons";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/app/utils/routes";

const AssessmentCard = ({ assessment, isInvited = false }) => {
  const router = useRouter();
  const { data: session } = useSession();

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

  const handleButtonClick = (history) => {
    if (history.completed) {
      const reportUrl = `${api}file/report-${history.exams.code}.pdf`;
      window.open(reportUrl, "_blank");
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
          const isLoading = false;

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
                <div className="w-full bg-white rounded-3xl p-4 bg-white px-6 shadow shadow-slate-200 space-y-2">
                  <div className="flex pt-1 justify-between items-center">
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
                        <Button className="grd-div-6 cursor-default shadow-md shadow-slate-200">
                          <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                          Дуусгасан
                        </Button>
                      ) : examStartDate && !userEndDate ? (
                        <Button className="grd-div-5 cursor-default shadow-md shadow-slate-200 ">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                          Дуусгаагүй
                        </Button>
                      ) : (
                        <Button className="shadow-md shadow-slate-200 grd-div-4">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                          Өгөөгүй
                        </Button>
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
                  <div>
                    Үр дүн:
                    {isCompletedButNotVisible ? (
                      <div className="flex items-center gap-2 text-main font-bold">
                        <EyeClosedLineDuotone width={14} />
                        <span>Байгууллагад илгээсэн</span>
                      </div>
                    ) : history?.exams?.result ? (
                      [10, 11].includes(history.exams?.result?.type) ? (
                        <div className="flex items-center gap-2 justify-between">
                          <Progress
                            size="small"
                            percent={Math.round(
                              (history?.exams?.result?.point /
                                history?.exams?.result?.total) *
                                100
                            )}
                            strokeColor={{
                              "0%": "#FF8400",
                              "100%": "#FF5C00",
                            }}
                          />
                          <span className="min-w-11">
                            ({history?.exams?.result?.point}/
                            {history?.exams?.result?.total})
                          </span>
                        </div>
                      ) : (
                        <div className="font-extrabold text-lg">
                          {history?.exams?.result?.result}
                          {history?.exams?.result?.value
                            ? ` / ${history?.exams?.result?.value}`
                            : ""}
                        </div>
                      )
                    ) : isExpired ? (
                      <div className="flex items-center gap-2 text-red-400 font-bold">
                        <AlarmBoldDuotone width={16} />
                        <span>Хугацаа хэтэрсэн</span>
                      </div>
                    ) : history.exams?.userStartDate &&
                      !history.exams?.userEndDate ? (
                      <div className="font-bold text-blue-700 -my-[3px]">
                        Тест дуусгаагүй
                      </div>
                    ) : !history.exams?.userStartDate &&
                      !history.exams?.userEndDate ? (
                      <div className="font-bold text-amber-600 -my-[3px]">
                        Тест өгөөгүй
                      </div>
                    ) : null}
                  </div>
                  {!isExpired && <Divider className="no-margin2" />}
                  <div className="flex items-center justify-between">
                    {isExpired ? (
                      <></>
                    ) : isCompletedButNotVisible ? (
                      <button className="text-main flex text-center">
                        <NotificationLinesRemoveBoldDuotone width={18} />
                      </button>
                    ) : userEndDate ? (
                      <Link
                        href={`${api}file/report-${code}.pdf`}
                        target="_blank"
                        passHref
                      >
                        <Button
                          loading={isLoading}
                          className="grd-btn"
                          disabled={isExpired || isCompletedButNotVisible}
                        >
                          <ClipboardTextBoldDuotone width={18} height={18} />
                          Тайлан харах
                        </Button>
                      </Link>
                    ) : examStartDate && !userEndDate ? (
                      <Button
                        loading={isLoading}
                        className="grd-btn-5 border-none"
                        onClick={() => handleButtonClick(history)}
                        disabled={isExpired || isCompletedButNotVisible}
                      >
                        <PlayCircleBoldDuotone width={18} height={18} />
                        Үргэлжлүүлэх
                      </Button>
                    ) : (
                      <Button
                        loading={isLoading}
                        className="grd-btn-4 border-none"
                        onClick={() => handleButtonClick(history)}
                        disabled={isExpired || isCompletedButNotVisible}
                      >
                        <StarFallMinimalistic2BoldDuotone
                          width={18}
                          height={18}
                        />
                        Тест өгөх
                      </Button>
                    )}
                    {userEndDate && !isCompletedButNotVisible && (
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareToFacebookWithMeta(assessment.id, code);
                          }}
                          className="grd-btn-3"
                          title="Фэйсбүүкт хуваалцах"
                        >
                          <Image
                            src="/facebook.png"
                            alt="Facebook icon"
                            width={18}
                            height={18}
                            priority
                          />
                        </Button>
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
          type: item.assessment.type,
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
          result: item.result,
          code: item.code,
          userStartDate: item.userStartDate,
          userEndDate: item.userEndDate,
          visible: item.visible,
        },
        assessment: assessment.id,
        type: item.assessment.type,

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
