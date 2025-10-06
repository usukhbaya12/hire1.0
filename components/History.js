import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "antd";
import {
  NotesBoldDuotone,
  RoundArrowRightDownLineDuotone,
  UserPlusBoldDuotone,
  Wallet2BoldDuotone,
  Buildings2BoldDuotone,
  GlobalLineDuotone,
} from "solar-icons";
import Link from "next/link";

const AssessmentCard = ({ assessment, isInvited = false }) => {
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
                  <span className="pr-4 text-base leading-5 relative bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent cursor-pointer line-clamp-2 hover:underline hover:text-secondary">
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
                    <span className="font-semibold pl-1">{remainingTests}</span>
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
                    Шалгуулагч урих
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HistoryCard = ({ data, isInvited = false }) => {
  if (!data || !Array.isArray(data)) return null;

  const { data: session } = useSession();
  const isOrganization = session?.user?.role === 30;

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

  const processInvitedData = (data) => {
    return data.reduce((acc, item) => {
      const assessment = item.assessment;
      const orgId = item.service?.user?.id || "unknown";
      const uniqueKey = `${assessment.id}-${orgId}`;

      if (!acc[uniqueKey]) {
        acc[uniqueKey] = {
          ...assessment,
          id: uniqueKey,
          originalId: assessment.id,
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {Object.values(groupedData).map((assessment) => (
        <div key={assessment.id}>
          <AssessmentCard assessment={assessment} isInvited={isInvited} />
        </div>
      ))}
    </div>
  );
};

export default HistoryCard;
