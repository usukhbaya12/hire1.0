import React, { useEffect, useState } from "react";
import { Input, Empty, Button, message, Divider, Table, Progress } from "antd";
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
  CalendarBoldDuotone,
  EyeBoldDuotone,
  ClipboardBoldDuotone,
  Buildings2BoldDuotone,
  EyeClosedLineDuotone,
  AlarmBoldDuotone,
  ClipboardTextBoldDuotone,
  PlayCircleBoldDuotone,
  StarFallMinimalistic2BoldDuotone,
  NotificationLinesRemoveBoldDuotone,
} from "solar-icons";
import Link from "next/link";
import { getUserTestHistory } from "@/app/api/assessment";
import HistoryCard from "@/components/History";
import ApplicantsTable from "@/components/All";
import { customLocale } from "@/app/utils/values";
import dayjs from "dayjs";
import Image from "next/image";

const TestsTabContent = ({ activeTab, session }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  });

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const testHistoryRes = await getUserTestHistory(0);
      if (testHistoryRes.success) {
        setData(testHistoryRes.data);
      }
    } catch (error) {
      console.error("GET / Алдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const refetchData = async () => {
    await fetchData();
  };

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
          useTable: session?.user?.role === 20,
        };
      case "orgtests":
        return {
          title: "Байгууллагаас уригдсан тестүүд",
          icon: <Buildings3BoldDuotone width={20} height={20} />,
          data: filteredData2,
          emptyMessage: "Байгууллагаас уригдсан тест олдсонгүй.",
          statsData: data?.invited,
          isInvited: true,
          useTable: session?.user?.role === 20,
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
        <div className="flex items-center gap-3 lg:gap-6 flex-wrap lg:flex-nowrap">
          <div className="flex items-center gap-2">
            <div className="text-main text-sm flex items-center font-bold gap-1">
              <NotesBoldDuotone width={16} />
              Тестүүд:
            </div>
            <div className="font-bold text-gray-800">{testCount}</div>
          </div>
          <Divider type="vertical" className="hidden lg:block h-10" />
          <div className="flex items-center gap-2">
            <div className="text-main text-sm flex items-center font-bold gap-1">
              <HistoryLineDuotone width={16} />
              Оролдлогын тоо:
            </div>
            <div className="font-bold text-gray-800">{totalAttempts}</div>
          </div>
          <Divider type="vertical" className="hidden lg:block h-10" />
          <div className="flex items-center gap-2">
            <div className="text-green-600 text-sm flex items-center font-bold gap-1">
              <CheckCircleBoldDuotone width={16} />
              Дууссан:
            </div>
            <div className="font-bold text-gray-800">{completed}</div>
          </div>
          <Divider type="vertical" className="hidden lg:block h-10" />
          <div className="flex items-center gap-2">
            <div className="text-yellow-600 text-sm flex items-center font-bold gap-1">
              <ClockCircleBoldDuotone width={16} />
              Өгөөгүй:
            </div>
            <div className="font-bold text-gray-800">{notStarted}</div>
          </div>
          <Divider type="vertical" className="hidden lg:block h-10" />
          <div className="flex items-center gap-2">
            <div className="text-blue-500 text-sm flex items-center font-bold gap-1">
              <MouseBoldDuotone width={16} />
              Эхэлсэн:
            </div>
            <div className="font-bold text-gray-800">{inProgress}</div>
          </div>
        </div>
      </div>
    );
  };

  const shareToFacebookWithMeta = (testId, examCode) => {
    const siteUrl = "https://hire.mn";
    const shareUrl = `${siteUrl}/share/${testId}/${examCode}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  const processTestsData = (testData) => {
    if (!testData || !Array.isArray(testData)) return [];

    return testData
      .filter((item) => item.status === 20)
      .map((item) => {
        const statusValue =
          item.exams[0]?.userStartDate == null &&
          item.exams[0]?.userEndDate == null
            ? "Өгөөгүй"
            : item.exams[0]?.userStartDate != null &&
              item.exams[0]?.userEndDate == null
            ? "Эхэлсэн"
            : "Дууссан";

        return {
          key: item.id,
          dateValue: item.createdAt ? dayjs(item.createdAt).valueOf() : 0,
          date: item.createdAt
            ? dayjs(item.createdAt).format("YYYY-MM-DD")
            : null,
          testNameValue: item.assessment.name,
          testName: (
            <Link
              href={`/test/${item.assessment.id}`}
              className="font-bold text-main hover:underline hover:text-secondary transition-colors"
            >
              {item.assessment.name}
            </Link>
          ),
          statusValue,
          status:
            statusValue === "Өгөөгүй" ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-amber-700">
                  Өгөөгүй
                </span>
              </div>
            ) : statusValue === "Эхэлсэн" ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-200 to-blue-100 border border-blue-300 shadow-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-blue-700">
                  Эхэлсэн
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-300 to-green-300 border border-green-500 shadow-sm">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span className="text-xs font-bold text-emerald-700">
                  Дууссан
                </span>
              </div>
            ),
          result:
            item.exams && item.exams.length > 0 ? (
              item.exams[0].visible ? (
                item.assessment.report === 10 && item.exams[0].result ? (
                  <div className="flex items-center gap-2">
                    <Progress
                      size="small"
                      percent={Math.round(
                        (item.exams[0].result.point /
                          item.exams[0].result.total) *
                          100
                      )}
                      strokeColor={{
                        "0%": "#FF8400",
                        "100%": "#FF5C00",
                      }}
                    />
                    <span>
                      ({item.exams[0].result.point}/{item.exams[0].result.total}
                      )
                    </span>
                  </div>
                ) : (
                  <div className="font-extrabold">
                    {item.exams[0]?.result
                      ? (item.exams[0].result.result
                          ? `${item.exams[0].result.result}`
                          : "") +
                        (item.exams[0].result.result &&
                        item.exams[0].result.value
                          ? " / "
                          : "") +
                        (item.exams[0].result.value
                          ? `${item.exams[0].result.value}`
                          : "")
                      : ""}
                  </div>
                )
              ) : (
                <div className="items-center gap-2 flex">
                  <EyeClosedLineDuotone width={18} className="text-main" />
                  Байгууллагад илгээсэн
                </div>
              )
            ) : (
              <div></div>
            ),
          report:
            statusValue === "Өгөөгүй" ? (
              <div className="flex justify-center">
                <Link href={`/test/details/${item.assessment.id}`}>
                  <Button className="grd-btn-4 border-none">
                    <StarFallMinimalistic2BoldDuotone width={18} />
                    Тест өгөх
                  </Button>
                </Link>
              </div>
            ) : statusValue === "Эхэлсэн" ? (
              <div className="flex justify-center">
                {item.exams && item.exams.length > 0 && (
                  <Link href={`/exam/${item.exams[0].code}`}>
                    <Button className="grd-btn-5 border-none">
                      <PlayCircleBoldDuotone width={18} />
                      Үргэлжлүүлэх
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <Link
                  href={`/api/report/${item.exams[0].code}`}
                  target="_blank"
                  passHref
                >
                  <Button className="grd-btn">
                    <ClipboardTextBoldDuotone width={18} />
                    Татах
                  </Button>
                </Link>
                <Button
                  onClick={() =>
                    shareToFacebookWithMeta(
                      item.assessment.id,
                      item.exams[0].code
                    )
                  }
                  className="grd-btn-3"
                  title="Фэйсбүүкт хуваалцах"
                >
                  <Image
                    src="/facebook.png"
                    alt="Facebook icon"
                    width={18}
                    height={18}
                    priority
                    className="min-h-[18px] min-w-[18px]"
                  />
                </Button>
              </div>
            ),
        };
      });
  };

  const processInvitedData = (invitedData) => {
    if (!invitedData || !Array.isArray(invitedData)) return [];

    return invitedData.map((item) => {
      const hasStarted = item.userStartDate;
      const hasEnded = item.userEndDate;
      const isExpired = !hasEnded && dayjs().isAfter(dayjs(item.endDate));

      const statusValue = hasEnded
        ? "Дууссан"
        : hasStarted
        ? "Эхэлсэн"
        : "Өгөөгүй";

      let statusDisplay;
      if (hasEnded) {
        statusDisplay = (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-300 to-green-300 border border-green-500 shadow-sm">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-xs font-bold text-emerald-700">Дууссан</span>
          </div>
        );
      } else if (hasStarted) {
        statusDisplay = (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-200 to-blue-100 border border-blue-300 shadow-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-blue-700">Эхэлсэн</span>
          </div>
        );
      } else {
        statusDisplay = (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-amber-700">Өгөөгүй</span>
          </div>
        );
      }

      return {
        key: item.id,
        dateValue: item.createdAt ? dayjs(item.createdAt).valueOf() : 0,
        date: item.createdAt ? dayjs(item.createdAt).format("YYYY-MM-DD") : "-",
        testNameValue: item.assessment.name,
        testName: (
          <Link
            href={`/test/${item.assessment.id}`}
            className="font-bold text-main hover:underline hover:text-secondary transition-colors"
          >
            {item.assessment.name}
          </Link>
        ),
        endDateValue: item.endDate ? dayjs(item.endDate).valueOf() : 0,
        endDate: item.endDate ? dayjs(item.endDate).format("YYYY-MM-DD") : "-",
        statusValue,
        status: statusDisplay,
        result: isExpired ? (
          <div className="flex items-center gap-1 text-red-500 font-bold mt-1">
            <AlarmBoldDuotone width={16} />
            Хугацаа дууссан
          </div>
        ) : item.visible ? (
          item.assessment.report === 10 && item.result ? (
            <div className="flex items-center gap-2">
              <Progress
                size="small"
                percent={Math.round(
                  (item.result.point / item.result.total) * 100
                )}
                format={(percent) => `${percent}%`}
                strokeColor={{
                  "0%": "#FF8400",
                  "100%": "#FF5C00",
                }}
              />
              <span>
                ({item.result.point}/{item.result.total})
              </span>
            </div>
          ) : (
            <div className="font-extrabold">
              {item.result
                ? item.result.result + " / " + item.result.value
                : ""}
            </div>
          )
        ) : item.userEndDate ? (
          <div className="flex items-center gap-1 text-main font-bold mt-1">
            <EyeClosedLineDuotone width={18} className="text-main" />
            Байгууллагад илгээсэн
          </div>
        ) : (
          <></>
        ),
        payment: (
          <div className="font-bold text-blue-700">
            {item.service?.user?.organizationName || "-"}
          </div>
        ),
        report: isExpired ? (
          <div className="flex justify-center">
            <button className="text-main flex text-center">
              <NotificationLinesRemoveBoldDuotone width={18} />
            </button>
          </div>
        ) : item.userStartDate && !item.userEndDate ? (
          <div className="flex justify-center">
            <Link href={`/exam/${item.code}`}>
              <Button className="grd-btn-5 border-none">
                <PlayCircleBoldDuotone width={18} />
                Үргэлжлүүлэх
              </Button>
            </Link>
          </div>
        ) : item.userEndDate == null ? (
          <div className="flex justify-center">
            <Link href={`/exam/${item.code}`}>
              <Button className="grd-btn-4 border-none">
                <StarFallMinimalistic2BoldDuotone width={18} />
                Тест өгөх
              </Button>
            </Link>
          </div>
        ) : item.visible ? (
          <div className="flex justify-center items-center gap-2">
            <Link href={`/api/report/${item.code}`} target="_blank" passHref>
              <Button className="grd-btn">
                <ClipboardTextBoldDuotone width={18} />
                Татах
              </Button>
            </Link>
            <Button
              onClick={() =>
                shareToFacebookWithMeta(item.assessment.id, item.code)
              }
              className="grd-btn-3"
              title="Фэйсбүүкт хуваалцах"
            >
              <Image
                src="/facebook.png"
                alt="Facebook icon"
                width={18}
                height={18}
                priority
                className="min-h-[18px] min-w-[18px]"
              />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button className="text-main flex text-center">
              <NotificationLinesRemoveBoldDuotone width={18} />
            </button>
          </div>
        ),
      };
    });
  };

  const tableData = config.isInvited
    ? processInvitedData(config.data)
    : processTestsData(config.data);

  // Get unique test names and statuses for filters
  const uniqueTestNames = [
    ...new Set(tableData.map((item) => item.testNameValue)),
  ].map((name) => ({
    text: name,
    value: name,
  }));

  const uniqueStatuses = [
    ...new Set(tableData.map((item) => item.statusValue)),
  ].map((status) => ({
    text: status,
    value: status,
  }));

  const columns = [
    {
      title: "Огноо",
      dataIndex: "date",
      key: "date",
      width: "150px",
      sorter: (a, b) => a.dateValue - b.dateValue,
      // defaultSortOrder: "descend",
    },
    {
      title: "Төлөв",
      dataIndex: "status",
      key: "status",
      width: "150px",
      filters: uniqueStatuses,
      onFilter: (value, record) => record.statusValue === value,
    },
    {
      title: "Тестийн нэр",
      dataIndex: "testName",
      key: "testName",
      filters: uniqueTestNames,
      onFilter: (value, record) => record.testNameValue === value,
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      width: "250px",
    },
    {
      title: "Тайлан",
      key: "action",
      dataIndex: "report",
      align: "center",
      width: "180px",
    },
  ];

  const columns2 = [
    {
      title: "Уригдсан огноо",
      dataIndex: "date",
      key: "date",
      width: "120px",
      sorter: (a, b) => a.dateValue - b.dateValue,
      // defaultSortOrder: "descend",
    },
    {
      title: "Дуусах огноо",
      dataIndex: "endDate",
      key: "endDate",
      width: "120px",
      sorter: (a, b) => a.endDateValue - b.endDateValue,
    },
    {
      title: "Төлөв",
      dataIndex: "status",
      key: "status",
      filters: uniqueStatuses,
      onFilter: (value, record) => record.statusValue === value,
    },
    {
      title: "Байгууллагын нэр",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Тестийн нэр",
      dataIndex: "testName",
      key: "testName",
      filters: uniqueTestNames,
      onFilter: (value, record) => record.testNameValue === value,
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      width: "250px",
    },
    {
      title: "Тайлан",
      key: "action",
      dataIndex: "report",
      align: "center",
      width: "180px",
    },
  ];

  const handleTableChange = (newPagination, filters, sorter, extra) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    setFilteredInfo(filters);
    setSortedInfo(sorter);
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
          {(activeTab !== "applicants" || config.useTable) && (
            <div>
              <Input
                prefix={
                  <MagniferBoldDuotone
                    color={"#f36421"}
                    width={18}
                    height={18}
                  />
                }
                placeholder="Тестийн нэрээр хайх"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination({ ...pagination, current: 1 });
                }}
              />
            </div>
          )}
        </div>

        {session.user.role === 20 &&
          config.statsData &&
          renderStats(config.statsData)}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index}>{renderSkeletonCard()}</div>
              ))}
          </div>
        ) : config.isApplicants ? (
          <ApplicantsTable
            data={config.data}
            loading={loading}
            onRefresh={refetchData}
          />
        ) : config.useTable ? (
          tableData && tableData.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block">
                <Table
                  locale={customLocale}
                  columns={config.isInvited ? columns2 : columns}
                  dataSource={tableData}
                  className="test-history-table overflow-x-auto"
                  pagination={{
                    ...pagination,
                    size: "small",
                    showTotal: (total, range) =>
                      `${range[0]}-ээс ${range[1]} / Нийт ${total}`,
                  }}
                  onChange={handleTableChange}
                />
              </div>
              {/* Mobile card view - keeping original mobile implementation */}
              <div className="block sm:hidden space-y-4">
                {config.isInvited
                  ? // Mobile view for invited tests
                    data?.invited?.map((item) => {
                      const hasStarted = item.userStartDate;
                      const hasEnded = item.userEndDate;
                      const isExpired =
                        !hasEnded && dayjs().isAfter(dayjs(item.endDate));

                      return (
                        <div
                          key={item.id}
                          className="rounded-3xl shadow shadow-slate-200 bg-white p-4 px-6 space-y-2"
                        >
                          <div className="flex pt-1 gap-2 justify-between">
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <CalendarBoldDuotone
                                width={18}
                                className="-mt-1"
                              />
                              {item.createdAt
                                ? dayjs(item.createdAt).format("YYYY-MM-DD")
                                : ""}
                            </div>

                            <div>
                              {hasEnded ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-300 to-green-300 border border-green-500 shadow-sm">
                                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                  <span className="text-xs font-bold text-emerald-700">
                                    Дууссан
                                  </span>
                                </div>
                              ) : hasStarted ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-200 to-blue-100 border border-blue-300 shadow-sm">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-semibold text-blue-700">
                                    Эхэлсэн
                                  </span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-bold text-amber-700">
                                    Өгөөгүй
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Link
                            href={`/test/${item.assessment.id}`}
                            className="text-lg font-bold text-main hover:underline hover:text-secondary transition-colors block leading-5 pt-1"
                          >
                            {item.assessment.name}
                          </Link>

                          <div>
                            <div>Үр дүн:</div>
                            {isExpired ? (
                              <div className="flex items-center gap-2 text-red-400 font-bold">
                                <AlarmBoldDuotone width={16} />
                                Хугацаа хэтэрсэн
                              </div>
                            ) : item.visible ? (
                              item.assessment.report === 10 && item.result ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      size="small"
                                      percent={Math.round(
                                        (item.result.point /
                                          item.result.total) *
                                          100
                                      )}
                                      format={(percent) => `${percent}%`}
                                      strokeColor={{
                                        "0%": "#FF8400",
                                        "100%": "#FF5C00",
                                      }}
                                    />
                                    <span>
                                      ({item.result.point}/{item.result.total})
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <div className="font-extrabold text-lg">
                                  {item.result?.result ? (
                                    (item.result?.result
                                      ? `${item.result?.result}`
                                      : "") +
                                    (item.result?.result && item.result?.value
                                      ? " / "
                                      : "") +
                                    (item.result?.value
                                      ? `${item.result?.value}`
                                      : "")
                                  ) : (
                                    <div className="font-bold text-blue-700 -my-[3px]">
                                      Тест дуусгаагүй
                                    </div>
                                  )}
                                </div>
                              )
                            ) : item.userEndDate ? (
                              <div className="flex items-center gap-2 text-main font-bold">
                                <EyeClosedLineDuotone width={14} />
                                Байгууллагад илгээсэн
                              </div>
                            ) : (
                              <div className="font-bold text-amber-600">
                                Тест өгөөгүй
                              </div>
                            )}
                          </div>
                          <Divider />
                          <div className="text-sm flex flex-col">
                            {item.service?.user?.organizationName && (
                              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm leading-4">
                                <Buildings2BoldDuotone
                                  width={18}
                                  className="min-w-[18px]"
                                />
                                {item.service.user.organizationName}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <strong>Дуусах огноо: </strong>{" "}
                              {dayjs(item.endDate).format("YYYY-MM-DD")}
                            </div>
                          </div>

                          {!isExpired && <Divider />}

                          {!isExpired && (
                            <div className="flex gap-2 justify-between">
                              {isExpired ? (
                                <button className="text-main flex text-center">
                                  <NotificationLinesRemoveBoldDuotone
                                    width={18}
                                  />
                                </button>
                              ) : item.userStartDate && !item.userEndDate ? (
                                <Link href={`/exam/${item.code}`}>
                                  <Button className="grd-btn-5 border-none">
                                    <PlayCircleBoldDuotone width={18} />
                                    Үргэлжлүүлэх
                                  </Button>
                                </Link>
                              ) : item.userEndDate == null ? (
                                <Link href={`/exam/${item.code}`}>
                                  <Button className="grd-btn-4 border-none">
                                    <StarFallMinimalistic2BoldDuotone
                                      width={18}
                                    />
                                    Тест өгөх
                                  </Button>
                                </Link>
                              ) : item.visible ? (
                                <>
                                  <Link
                                    href={`/api/report/${item.code}`}
                                    target="_blank"
                                    passHref
                                  >
                                    <Button className="grd-btn">
                                      <ClipboardTextBoldDuotone width={18} />
                                      Тайлан татах
                                    </Button>
                                  </Link>
                                  <Button
                                    className="grd-btn-3"
                                    onClick={() =>
                                      shareToFacebookWithMeta(item.code)
                                    }
                                    title="Фэйсбүүкт хуваалцах"
                                  >
                                    <Image
                                      src="/facebook.png"
                                      width={18}
                                      height={18}
                                      alt="facebook"
                                      className="min-h-[18px] min-w-[18px]"
                                    />
                                  </Button>
                                </>
                              ) : (
                                <button className="text-main flex text-center">
                                  <NotificationLinesRemoveBoldDuotone
                                    width={18}
                                  />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  : // Mobile view for regular tests
                    data?.data
                      ?.filter((item) => item.status === 20)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="rounded-3xl shadow shadow-slate-200 bg-white p-4 px-6 space-y-2"
                        >
                          <div className="flex pt-1 justify-between">
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                              <CalendarBoldDuotone
                                width={18}
                                className="-mt-1"
                              />
                              {item.createdAt
                                ? dayjs(item.createdAt).format("YYYY-MM-DD")
                                : ""}
                            </div>
                            <div>
                              {item.exams[0]?.userStartDate == null &&
                              item.exams[0]?.userEndDate == null ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-bold text-amber-700">
                                    Өгөөгүй
                                  </span>
                                </div>
                              ) : item.exams[0]?.userStartDate != null &&
                                item.exams[0]?.userEndDate == null ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-200 to-blue-100 border border-blue-300 shadow-sm">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                  <span className="text-xs font-semibold text-blue-700">
                                    Эхэлсэн
                                  </span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-300 to-green-300 border border-green-500 shadow-sm">
                                  <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                                  <span className="text-xs font-bold text-emerald-700">
                                    Дууссан
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <Link
                            href={`/test/${item.assessment.id}`}
                            className="text-lg font-bold text-main hover:underline hover:text-secondary transition-colors block leading-5 pt-1"
                          >
                            {item.assessment.name}
                          </Link>

                          <div>
                            <div>Үр дүн:</div>
                            {item.exams && item.exams.length > 0 ? (
                              item.exams[0].visible ? (
                                item.assessment.report === 10 &&
                                item.exams[0].result ? (
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      size="small"
                                      percent={Math.round(
                                        (item.exams[0].result.point /
                                          item.exams[0].result.total) *
                                          100
                                      )}
                                      strokeColor={{
                                        "0%": "#FF8400",
                                        "100%": "#FF5C00",
                                      }}
                                    />
                                    <span>
                                      ({item.exams[0].result.point}/
                                      {item.exams[0].result.total})
                                    </span>
                                  </div>
                                ) : (
                                  <div className="font-extrabold text-lg">
                                    {item.exams[0]?.result ? (
                                      (item.exams[0].result.result
                                        ? `${item.exams[0].result.result}`
                                        : "") +
                                      (item.exams[0].result.result &&
                                      item.exams[0].result.value
                                        ? " / "
                                        : "") +
                                      (item.exams[0].result.value
                                        ? `${item.exams[0].result.value}`
                                        : "")
                                    ) : (
                                      <div className="font-bold text-blue-700">
                                        Тест дуусгаагүй
                                      </div>
                                    )}
                                  </div>
                                )
                              ) : (
                                <div className="items-center gap-2 flex">
                                  <EyeClosedLineDuotone
                                    width={18}
                                    className="text-main"
                                  />
                                  Байгууллагад илгээсэн
                                </div>
                              )
                            ) : (
                              <div className="font-bold text-amber-600">
                                Тест өгөөгүй
                              </div>
                            )}
                          </div>

                          <Divider />

                          <div className="flex gap-2 justify-between">
                            {item.exams[0]?.userStartDate == null &&
                            item.exams[0]?.userEndDate == null ? (
                              <Link
                                href={`/test/details/${item.assessment?.id}`}
                              >
                                <Button className="grd-btn-4 border-none">
                                  <StarFallMinimalistic2BoldDuotone
                                    width={18}
                                  />
                                  Тест өгөх
                                </Button>
                              </Link>
                            ) : item.exams[0]?.userStartDate != null &&
                              item.exams[0]?.userEndDate == null ? (
                              <Link href={`/exam/${item.exams[0].code}`}>
                                <Button className="grd-btn-5 border-none">
                                  <PlayCircleBoldDuotone width={18} />
                                  Үргэлжлүүлэх
                                </Button>
                              </Link>
                            ) : (
                              <>
                                <Link
                                  href={`/api/report/${item.exams[0].code}`}
                                  target="_blank"
                                  passHref
                                >
                                  <Button className="grd-btn">
                                    <ClipboardTextBoldDuotone width={18} />
                                    Тайлан татах
                                  </Button>
                                </Link>
                              </>
                            )}
                            {item.exams[0]?.userStartDate != null &&
                              item.exams[0]?.userEndDate != null && (
                                <Button
                                  className="grd-btn-3"
                                  onClick={() =>
                                    shareToFacebookWithMeta(
                                      item.assessment.id,
                                      item.exams[0].code
                                    )
                                  }
                                  title="Фэйсбүүкт хуваалцах"
                                >
                                  <Image
                                    src="/facebook.png"
                                    width={18}
                                    height={18}
                                    alt="facebook"
                                    priority
                                    className="min-h-[18px] min-w-[18px]"
                                  />
                                </Button>
                              )}
                          </div>
                        </div>
                      ))}
              </div>
            </>
          ) : (
            <>
              <Empty description={config.emptyMessage} />
              {activeTab !== "applicants" && (
                <div className="flex py-6 justify-center">
                  <Link
                    href="/#tests"
                    className="relative group cursor-pointer"
                  >
                    <Button className="grd-btn h-10">Тестийн сан</Button>
                  </Link>
                </div>
              )}
            </>
          )
        ) : config.data && config.data.length > 0 ? (
          <HistoryCard data={config.data} isInvited={config.isInvited} />
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
