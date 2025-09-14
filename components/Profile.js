import React, { useEffect, useState } from "react";
import { Input, Empty, Button, message, Divider } from "antd";
import {
  MagniferBoldDuotone,
  VerifiedCheckBoldDuotone,
  Buildings3BoldDuotone,
  ChartBoldDuotone,
  NotesBoldDuotone,
  HistoryLineDuotone,
  CheckCircleBoldDuotone,
  ClockCircleBoldDuotone,
  MouseBoldDuotone,
} from "solar-icons";
import Link from "next/link";
import { getUserTestHistory } from "@/app/api/assessment";
import HistoryCard from "@/components/History";
import ApplicantsTable from "@/components/All";

const TestsTabContent = ({ activeTab, session }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const testHistoryRes = await getUserTestHistory(0);
        if (testHistoryRes.success) {
          setData(testHistoryRes.data);
        }
      } catch (error) {
        console.error("GET / Алдаа гарлаа..", error);
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа..");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id]);

  const filteredData = data?.data
    ? data.data.filter((item) =>
        item.assessment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredData2 = data?.invited
    ? data.invited.filter((item) =>
        item.assessment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const renderSkeletonCard = () => (
    <div className="w-full h-full relative overflow-hidden rounded-3xl shadow shadow-slate-200 bg-white/70 backdrop-blur-md px-6 pt-6 pb-4 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 w-3/4">
          <div className="h-5 bg-gray-200 rounded-full w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded-full w-1/2 mt-2"></div>
        </div>
      </div>
      <div className="border-t pt-4 w-full">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded-full w-24"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );

  const getTabConfig = () => {
    switch (activeTab) {
      case "tests":
        return {
          title: session?.user?.role === 20 ? "Өгсөн тестүүд" : "Миний тестүүд",
          icon: <VerifiedCheckBoldDuotone width={20} height={20} />,
          data: filteredData,
          emptyMessage: "Та тест өгөөгүй байна.",
          statsData: data?.data,
        };
      case "orgtests":
        return {
          title: "Байгууллагаас уригдсан тестүүд",
          icon: <Buildings3BoldDuotone width={20} height={20} />,
          data: filteredData2,
          emptyMessage: "Байгууллагаас уригдсан тест олдсонгүй.",
          statsData: data?.invited,
          isInvited: true,
        };
      case "applicants":
        return {
          title: "Нийт шалгуулагчид",
          icon: <ChartBoldDuotone width={20} height={20} />,
          data: filteredData,
          emptyMessage: "Шалгуулагч олдсонгүй.",
          isApplicants: true,
        };
    }
  };

  const config = getTabConfig();

  const renderStats = (statsData) => {
    if (!statsData || activeTab === "applicants") return null;

    const isInvited = activeTab === "orgtests";
    const testCount = isInvited
      ? Object.keys(
          statsData.reduce((acc, item) => {
            acc[item.assessment.id] = true;
            return acc;
          }, {})
        ).length
      : Object.keys(
          statsData.reduce((acc, item) => {
            acc[item.assessment.id] = true;
            return acc;
          }, {})
        ).length;

    const totalAttempts = isInvited
      ? statsData.length
      : statsData.filter((item) => item.status === 20).length;
    const completed = isInvited
      ? statsData.filter((item) => item.userStartDate && item.userEndDate)
          .length
      : statsData.filter(
          (item) => item.status === 20 && item.exams[0]?.userEndDate
        ).length;
    const notStarted = isInvited
      ? statsData.filter((item) => !item.userStartDate && !item.userEndDate)
          .length
      : statsData.filter(
          (item) =>
            item.status === 20 &&
            !item.exams[0]?.userStartDate &&
            !item.exams[0]?.userEndDate
        ).length;
    const inProgress = isInvited
      ? statsData.filter((item) => item.userStartDate && !item.userEndDate)
          .length
      : statsData.filter(
          (item) =>
            item.status === 20 &&
            item.exams[0]?.userStartDate &&
            !item.exams[0]?.userEndDate
        ).length;

    return (
      <div className="bg-white/40 backdrop-blur-md shadow shadow-slate-200 rounded-3xl px-6 py-4 sm:py-3 mb-6">
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-2">
            <div className="text-main text-sm flex items-center font-bold gap-1">
              <NotesBoldDuotone width={16} />
              Тестүүд:
            </div>
            <div className="font-bold text-gray-800">{testCount}</div>
          </div>
          <Divider type="vertical" className="hidden md:block h-10" />
          <div className="flex items-center gap-2">
            <div className="text-main text-sm flex items-center font-bold gap-1">
              <HistoryLineDuotone width={16} />
              Оролдлогын тоо:
            </div>
            <div className="font-bold text-gray-800">{totalAttempts}</div>
          </div>
          <Divider type="vertical" className="hidden md:block h-10" />
          <div className="flex items-center gap-2">
            <div className="text-green-600 text-sm flex items-center font-bold gap-1">
              <CheckCircleBoldDuotone width={16} />
              Дууссан:
            </div>
            <div className="font-bold text-gray-800">{completed}</div>
          </div>
          <Divider type="vertical" className="hidden md:block h-10" />
          <div className="flex items-center gap-2">
            <div className="text-yellow-600 text-sm flex items-center font-bold gap-1">
              <ClockCircleBoldDuotone width={16} />
              Өгөөгүй:
            </div>
            <div className="font-bold text-gray-800">{notStarted}</div>
          </div>
          <Divider type="vertical" className="hidden md:block h-10" />
          <div className="flex items-center gap-2">
            <div className="text-orange-500 text-sm flex items-center font-bold gap-1">
              <MouseBoldDuotone width={16} />
              Дуусгаагүй:
            </div>
            <div className="font-bold text-gray-800">{inProgress}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {contextHolder}
      <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5">
          <h2 className="hidden md:flex text-base font-extrabold px-1 items-center gap-2">
            {config.icon}
            {config.title}
          </h2>
          {activeTab !== "applicants" && (
            <div>
              <Input
                prefix={
                  <MagniferBoldDuotone
                    color={"#f36421"}
                    width={18}
                    height={18}
                  />
                }
                placeholder="Нэрээр хайх"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {session.user.role === 20 &&
          config.statsData &&
          renderStats(config.statsData)}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index}>{renderSkeletonCard()}</div>
              ))}
          </div>
        ) : config.isApplicants ? (
          <ApplicantsTable data={config.data} loading={loading} />
        ) : config.data && config.data.length > 0 ? (
          config.data.length > 0 ? (
            <HistoryCard data={config.data} isInvited={config.isInvited} />
          ) : (
            <Empty description="Тест олдсонгүй." />
          )
        ) : (
          <>
            <Empty description={config.emptyMessage} />
            {activeTab !== "applicants" && (
              <div className="flex py-6 justify-center">
                <Link href="/#tests" className="relative group cursor-pointer">
                  <Button className="grd-btn h-10">Тестийн сан</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TestsTabContent;
