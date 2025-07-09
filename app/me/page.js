"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { message, Table, Empty, Input, Divider, Button } from "antd";
import {
  Wallet2BoldDuotone,
  VerifiedCheckBoldDuotone,
  GraphUpBoldDuotone,
  MagniferBoldDuotone,
  CheckCircleBoldDuotone,
  ClockCircleBoldDuotone,
  HistoryLineDuotone,
  NotesBoldDuotone,
  MouseBoldDuotone,
  MoneyBagBoldDuotone,
  HistoryBoldDuotone,
  CalendarBoldDuotone,
  Card2,
  RoundDoubleAltArrowRightBoldDuotone,
  RefreshCircleBoldDuotone,
  ChartBoldDuotone,
  Buildings2BoldDuotone,
  Buildings3BoldDuotone,
  QrCodeBoldDuotone,
} from "solar-icons";

import { getUserTestHistory } from "../api/assessment";
import { ebarimt, getCurrentUser, getPaymentHistory } from "../api/main";
import HistoryCard from "@/components/History";
import ChargeModal from "@/components/modals/Charge";
import PaymentHistoryChart from "@/components/Payment";
import Footer from "@/components/Footer";
import ApplicantsTable from "@/components/All";
import { customLocale } from "../utils/values";
import Link from "next/link";
import EBarimtModal from "@/components/modals/EBarimt";

const Profile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("tests");
  const [messageApi, contextHolder] = message.useMessage();
  const [searchTerm, setSearchTerm] = useState("");
  const [barimtModalOpen, setBarimtModalOpen] = useState(false);
  const [barimtData, setBarimtData] = useState([]);
  const [assessmentName, setAssessmentName] = useState(null);

  const refreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await getCurrentUser();
    } catch (error) {
      console.error("Үлдэгдэл шинэчлэхэд алдаа гарлаа.:", error);
      messageApi.error("Үлдэгдэл шинэчлэхэд алдаа гарлаа.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [testHistoryRes, paymentRes, userDataRes] = await Promise.all([
          getUserTestHistory(0),
          getPaymentHistory(0, session?.user?.id, 1, 100),
          getCurrentUser(),
        ]);

        if (testHistoryRes.success) {
          setData(testHistoryRes.data);
        }

        if (paymentRes.success) {
          setPaymentData(paymentRes.data);
        }

        if (userDataRes.success) {
          setUserData(userDataRes.data);
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

  if (!session) return null;

  const getBarimt = async (serviceId, assessmentName) => {
    try {
      const res = await ebarimt(serviceId);
      setBarimtData(res.data);
      setAssessmentName(assessmentName);
      setBarimtModalOpen(true);
    } catch (err) {
      console.error("GET / Aлдаа гарлаа.", err);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    }
  };

  const menuItems = [
    {
      name: session?.user?.role === 20 ? "Өгсөн тестүүд" : "Миний тестүүд",
      key: "tests",
      icon: (
        <VerifiedCheckBoldDuotone
          width={20}
          height={20}
          className="text-main"
        />
      ),
    },
    {
      name: "Уригдсан тестүүд",
      key: "orgtests",
      icon: (
        <Buildings3BoldDuotone width={17} height={17} className="text-main" />
      ),
      show: session?.user?.role === 20,
    },
    {
      name: "Нийт шалгуулагчид",
      key: "applicants",
      icon: <ChartBoldDuotone width={20} height={20} className="text-main" />,
      show: session?.user?.role === 30,
    },
    {
      name: "Хэтэвч",
      key: "wallet",
      icon: <Wallet2BoldDuotone width={20} height={20} className="text-main" />,
      show: session?.user?.role === 30,
    },

    {
      name: "Гүйлгээний түүх",
      key: "history",
      icon: <GraphUpBoldDuotone width={20} height={20} className="text-main" />,
      show: session?.user?.role === 20,
    },
  ];

  const filteredData = data?.data
    ? data?.data.filter((item) =>
        item.assessment.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredData2 = data?.invited
    ? data?.invited.filter((item) =>
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
  const renderContent = () => {
    switch (activeTab) {
      case "tests":
        return (
          <>
            <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5">
                <h2 className="hidden md:flex text-base font-extrabold px-1  items-center gap-2">
                  <VerifiedCheckBoldDuotone width={20} height={20} />
                  {session?.user?.role === 20
                    ? "Өгсөн тестүүд"
                    : "Миний тестүүд"}
                </h2>
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
              </div>
              {session.user.role === 20 && data && (
                <div className="bg-white/40 backdrop-blur-md shadow shadow-slate-200 rounded-3xl px-6 py-4 sm:py-3 mb-6">
                  <div className="flex items-center gap-3 sm:gap-6 flex-wrap md:flex-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-main text-sm flex items-center font-bold gap-1">
                        <NotesBoldDuotone width={16} />
                        Тестүүд:
                      </div>
                      <div className="font-bold text-gray-800">
                        {
                          Object.keys(
                            data?.data.reduce((acc, item) => {
                              acc[item.assessment.id] = true;
                              return acc;
                            }, {})
                          ).length
                        }
                      </div>
                    </div>
                    <Divider type="vertical" className="hidden md:block h-10" />

                    <div className="flex items-center gap-2">
                      <div className="text-main text-sm flex items-center font-bold gap-1">
                        <HistoryLineDuotone width={16} />
                        Оролдлогын тоо:
                      </div>
                      <div className="font-bold text-gray-800">
                        {data?.data.filter((item) => item.status === 20).length}
                      </div>
                    </div>
                    <Divider type="vertical" className="hidden md:block h-10" />

                    <div className="flex items-center gap-2">
                      <div className="text-green-600 text-sm flex items-center font-bold gap-1">
                        <CheckCircleBoldDuotone width={16} />
                        Дууссан:
                      </div>
                      <div className="font-bold text-gray-800">
                        {
                          data?.data.filter(
                            (item) =>
                              item.status === 20 && item.exams[0]?.userEndDate
                          ).length
                        }
                      </div>
                    </div>
                    <Divider type="vertical" className="hidden md:block h-10" />

                    <div className="flex items-center gap-2">
                      <div className="text-yellow-600 text-sm flex items-center font-bold gap-1">
                        <ClockCircleBoldDuotone width={16} />
                        Өгөөгүй:
                      </div>
                      <div className="font-bold text-gray-800">
                        {
                          data?.data.filter(
                            (item) =>
                              item.status === 20 &&
                              !item.exams[0]?.userStartDate &&
                              !item.exams[0]?.userEndDate
                          ).length
                        }
                      </div>
                    </div>
                    <Divider type="vertical" className="hidden md:block h-10" />

                    <div className="flex items-center gap-2">
                      <div className="text-orange-500 text-sm flex items-center font-bold gap-1">
                        <MouseBoldDuotone width={16} />
                        Дуусгаагүй:
                      </div>
                      <div className="font-bold text-gray-800">
                        {
                          data?.data.filter(
                            (item) =>
                              item.status === 20 &&
                              item.exams[0]?.userStartDate &&
                              !item.exams[0]?.userEndDate
                          ).length
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index}>{renderSkeletonCard()}</div>
                    ))}
                </div>
              ) : data?.data && data?.data.length > 0 ? (
                filteredData.length > 0 ? (
                  <HistoryCard data={filteredData} />
                ) : (
                  <Empty description="Тест олдсонгүй." />
                )
              ) : (
                <>
                  <Empty description="Та тест өгөөгүй байна." />
                  <div className="flex py-6 justify-center">
                    <Link
                      href="/#tests"
                      className="relative group cursor-pointer"
                    >
                      <Button className="grd-btn h-10">Тестийн сан</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </>
        );
      case "orgtests":
        return (
          <>
            <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5">
                <h2 className="hidden md:flex text-base font-extrabold px-1  items-center gap-2">
                  <Buildings3BoldDuotone width={20} height={20} />
                  Байгууллагаас уригдсан тестүүд
                </h2>
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
              </div>
              {session.user.role === 20 && data && (
                <div className="bg-white/40 backdrop-blur-md shadow shadow-slate-200 rounded-3xl px-6 py-4 sm:py-3 mb-6">
                  <div className="flex items-center gap-3 sm:gap-6 flex-wrap md:flex-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-main text-sm flex items-center font-bold gap-1">
                        <NotesBoldDuotone width={16} />
                        Тестүүд:
                      </div>
                      <div className="font-bold text-gray-800">
                        {
                          Object.keys(
                            data.invited.reduce((acc, item) => {
                              acc[item.assessment.id] = true;
                              return acc;
                            }, {})
                          ).length
                        }
                      </div>
                    </div>
                    <Divider type="vertical" className="hidden md:block h-10" />

                    <div className="flex items-center gap-2">
                      <div className="text-main text-sm flex items-center font-bold gap-1">
                        <HistoryLineDuotone width={16} />
                        Оролдлогын тоо:
                      </div>
                      <div className="font-bold text-gray-800">
                        {data.invited.length}
                      </div>
                    </div>
                    <Divider type="vertical" className="hidden md:block h-10" />

                    <div className="flex items-center gap-2">
                      <div className="text-green-600 text-sm flex items-center font-bold gap-1">
                        <CheckCircleBoldDuotone width={16} />
                        Дууссан:
                      </div>
                      <div className="font-bold text-gray-800">
                        {
                          data.invited.filter(
                            (item) => item.userStartDate && item.userEndDate
                          ).length
                        }
                      </div>
                    </div>
                    <Divider type="vertical" className="hidden md:block h-10" />

                    <div className="flex items-center gap-2">
                      <div className="text-yellow-600 text-sm flex items-center font-bold gap-1">
                        <ClockCircleBoldDuotone width={16} />
                        Өгөөгүй:
                      </div>
                      <div className="font-bold text-gray-800">
                        {
                          data.invited.filter(
                            (item) => !item.userStartDate && !item.userEndDate
                          ).length
                        }
                      </div>
                    </div>
                    <Divider type="vertical" className="hidden md:block h-10" />

                    <div className="flex items-center gap-2">
                      <div className="text-orange-500 text-sm flex items-center font-bold gap-1">
                        <MouseBoldDuotone width={16} />
                        Дуусгаагүй:
                      </div>
                      <div className="font-bold text-gray-800">
                        {
                          data.invited.filter(
                            (item) => item.userStartDate && !item.userEndDate
                          ).length
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index}>{renderSkeletonCard()}</div>
                    ))}
                </div>
              ) : data?.invited && data?.invited.length > 0 ? (
                filteredData2.length > 0 ? (
                  <HistoryCard data={filteredData2} isInvited={true} />
                ) : (
                  <Empty description="Байгууллагаас уригдсан тест олдсонгүй." />
                )
              ) : (
                <>
                  <Empty description="Та тест өгөөгүй байна." />
                  <div className="flex py-6 justify-center">
                    <Link href="/#tests">
                      <Button className="grd-btn h-10">Тестийн сан</Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </>
        );

      case "applicants":
        return (
          <>
            <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5">
                <h2 className="hidden md:flex text-base font-extrabold px-1 items-center gap-2">
                  <ChartBoldDuotone width={20} height={20} />
                  Нийт шалгуулагчид
                </h2>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-main">Уншиж байна...</div>
                </div>
              ) : (
                <ApplicantsTable data={filteredData} loading={loading} />
              )}
            </div>
          </>
        );
      case "history":
        return (
          <>
            <div className="shadow shadow-slate-200 rounded-3xl p-6 bg-white/40 backdrop-blur-md space-y-6">
              <h2 className="flex text-base font-extrabold px-1 items-center gap-2">
                <GraphUpBoldDuotone width={20} height={20} />
                Гүйлгээний түүх
              </h2>
              <div className="hidden sm:block">
                <Table
                  className="test-history-table overflow-x-auto"
                  dataSource={paymentData?.payments.data || []}
                  rowKey={(record, index) => index}
                  pagination={{
                    pageSize: 10,
                    size: "small",
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                  }}
                  locale={customLocale}
                  rowClassName={(record) =>
                    record.assessment ? "" : "bg-orange-50/30"
                  }
                  columns={[
                    {
                      title: "Огноо",
                      dataIndex: "paymentDate",
                      key: "date",
                      render: (text) => (
                        <div className="flex items-center gap-2">
                          <CalendarBoldDuotone className="text-gray-400 w-4 h-4" />
                          <span className="text-sm text-gray-700">
                            {new Date(text).toLocaleDateString()}
                          </span>
                        </div>
                      ),
                    },
                    {
                      title:
                        session?.user?.role === 20
                          ? "Тестийн нэр"
                          : "Худалдан авалтын төрөл",
                      dataIndex: ["assessment", "name"],
                      key: "name",
                      render: (assessment, record) => (
                        <div className="flex items-start gap-2">
                          {assessment ? (
                            <div className="flex">
                              <div
                                className="font-bold text-main cursor-pointer hover:underline underline-offset-4"
                                onClick={() =>
                                  router.push(`/test/${record.assessment.id}`)
                                }
                              >
                                {typeof assessment === "string"
                                  ? assessment
                                  : assessment?.name || ""}
                              </div>
                              {session?.user?.role === 30 && (
                                <div className="text-gray-700 font-medium">
                                  <span className="px-2">•</span>
                                  {Math.abs(
                                    record.price / record.assessment.price
                                  )}{" "}
                                  эрх
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <Card2 className="text-orange-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  Хэтэвч цэнэглэсэн
                                </div>
                                <div className="text-xs font-semibold text-gray-600 pt-1">
                                  {record.message}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ),
                    },
                    {
                      title: "Төлбөрийн хэлбэр",
                      dataIndex: "price",
                      key: "price",
                      align: "right",
                      render: (price, record) => (
                        <div className="inline-flex items-center gap-2">
                          {session?.user?.role === 20 && (
                            <>
                              <img src="/qpay.png" width={40} alt="QPay"></img>•
                            </>
                          )}
                          <div
                            className={`inline-flex items-center justify-end gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${
                              record.assessment
                                ? "bg-red-50 text-red-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            <MoneyBagBoldDuotone className="w-3.5 h-3.5" />
                            <span>
                              {record.assessment ? "" : "+"}
                              {price.toLocaleString()}₮
                            </span>
                          </div>
                        </div>
                      ),
                    },
                    {
                      title: "Төлбөрийн баримт",
                      key: "price",
                      align: "center",
                      render: (_, record) => (
                        <div className="inline-flex items-center gap-2">
                          <div className="flex justify-center">
                            <Button
                              className="link-btn-2 border-none"
                              onClick={() => {
                                getBarimt(
                                  record.serviceId,
                                  record.assessment?.name
                                );
                              }}
                            >
                              <>
                                <img
                                  src="/ebarimt.png"
                                  width={20}
                                  alt="E-Barimt"
                                ></img>
                              </>
                              ebarimt
                            </Button>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
              {paymentData?.payments.data?.map((record, index) => {
                return (
                  <div
                    key={index}
                    className="rounded-3xl p-4 bg-white px-6 mb-4 shadow shadow-slate-200 block sm:hidden"
                  >
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <CalendarBoldDuotone width={18} className="-mt-1" />
                      {new Date(record.paymentDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-start gap-2 mb-3">
                      <div
                        className="pt-2 font-bold text-lg text-main cursor-pointer hover:underline underline-offset-4"
                        onClick={() =>
                          router.push(`/test/${record.assessment.id}`)
                        }
                      >
                        {record.assessment?.name}
                      </div>
                    </div>
                    <Divider />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img src="/qpay.png" alt="QPay" width={40} />
                        <span className="px-2">•</span>

                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700`}
                        >
                          <MoneyBagBoldDuotone className="w-4 h-4" />
                          <span>{record.price.toLocaleString()}₮</span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          className="link-btn-2 border-none"
                          onClick={() => {
                            getBarimt(
                              record.serviceId,
                              record.assessment?.name
                            );
                          }}
                        >
                          <img src="/ebarimt.png" width={20} alt="E-Barimt" />
                          ebarimt
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        );
      case "wallet":
        return (
          <>
            <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
              <h2 className="hidden md:flex text-base font-extrabold px-1 items-center gap-2">
                <Wallet2BoldDuotone width={20} height={20} />
                Хэтэвч
              </h2>
              <div className="w-full relative mt-0 sm:mt-6 p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
                <div className="relative flex justify-between items-center gap-4 sm:gap-5">
                  <div className="relative flex items-center gap-4 sm:gap-5">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                      <div className="relative min-w-16 min-h-16 sm:min-w-24 sm:min-h-24 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                        <div className="text-main pt-1.5">
                          <Wallet2BoldDuotone width={40} height={40} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="-mt-0.5 sm:mt-0 flex items-center gap-2 text-gray-700">
                          <span className="font-medium">Үлдэгдэл</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-extrabold text-xl bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {userData?.wallet?.toLocaleString()}₮
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={refreshBalance}
                      disabled={isRefreshing}
                      className="flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                      title="Үлдэгдэл шинэчлэх"
                    >
                      <RefreshCircleBoldDuotone
                        width={32}
                        height={32}
                        className={`text-main -mt-0.5 ${
                          isRefreshing ? "animate-spin opacity-50" : ""
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => setIsRechargeModalOpen(true)}
                      className="relative group pl-4 pr-3 py-2 bg-gradient-to-br from-main to-secondary rounded-xl text-white font-bold shadow-lg shadow-main/20 hover:shadow-main/30 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-1">
                        <span className="hidden xl:block">Цэнэглэх</span>
                        <RoundDoubleAltArrowRightBoldDuotone
                          width={20}
                          height={20}
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow shadow-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">
                        Нийт зарцуулалт
                      </div>
                      <div className="text-xl font-bold text-red-500 mt-1">
                        {paymentData?.payments.data
                          .reduce(
                            (sum, item) =>
                              sum + (item.assessment ? item.price : 0),
                            0
                          )
                          .toLocaleString()}
                        ₮
                      </div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <MoneyBagBoldDuotone className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow shadow-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">
                        Нийт цэнэглэлт
                      </div>
                      <div className="text-xl font-bold text-green-500 mt-1">
                        {paymentData?.payments.data
                          ?.reduce(
                            (sum, item) =>
                              sum + (!item.assessment ? item.price : 0),
                            0
                          )
                          .toLocaleString()}
                        ₮
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <MoneyBagBoldDuotone className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow shadow-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">
                        Гүйлгээний тоо
                      </div>
                      <div className="text-xl font-bold text-blue-500 mt-1">
                        {data?.length || 0}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <HistoryBoldDuotone className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {paymentData?.payments.data &&
                paymentData?.payments.data.length > 0 && (
                  <PaymentHistoryChart
                    paymentData={paymentData?.payments.data}
                  />
                )}

              <div className="bg-white/40 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 shadow-sm mt-6">
                <h2 className="text-base font-extrabold mb-4 px-1 flex items-center gap-2">
                  <GraphUpBoldDuotone width={20} />
                  Гүйлгээний түүх
                </h2>
                <Table
                  className="test-history-table overflow-x-auto"
                  dataSource={paymentData?.payments.data || []}
                  //   loading={loading}
                  rowKey={(record, index) => index}
                  pagination={{
                    pageSize: 10,
                    size: "small",
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                  }}
                  locale={customLocale}
                  rowClassName={(record) =>
                    record.assessment ? "" : "bg-orange-50/30"
                  }
                  columns={[
                    {
                      title: "Огноо",
                      dataIndex: "paymentDate",
                      key: "date",
                      render: (text) => (
                        <div className="flex items-center gap-2">
                          <CalendarBoldDuotone className="text-gray-400 w-4 h-4" />
                          <span className="text-sm text-gray-700">
                            {new Date(text).toLocaleDateString()}
                          </span>
                        </div>
                      ),
                    },
                    {
                      title:
                        session?.user?.role === 20
                          ? "Тестийн нэр"
                          : "Худалдан авалтын төрөл",
                      dataIndex: ["assessment", "name"],
                      key: "name",
                      render: (assessment, record) => (
                        <div className="flex items-start gap-2">
                          {assessment ? (
                            <div className="flex">
                              <div
                                className="font-bold text-main cursor-pointer hover:underline underline-offset-4"
                                onClick={() =>
                                  router.push(`/test/${record.assessment.id}`)
                                }
                              >
                                {typeof assessment === "string"
                                  ? assessment
                                  : assessment?.name || ""}
                              </div>
                              {session?.user?.role === 30 && (
                                <div className="text-gray-700 font-medium">
                                  <span className="px-2">•</span>
                                  {Math.abs(
                                    record.price / record.assessment.price
                                  )}{" "}
                                  эрх
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <Card2 className="text-orange-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  Хэтэвч цэнэглэсэн
                                </div>
                                <div className="text-xs font-semibold text-gray-600 pt-1">
                                  {record.message}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ),
                    },
                    {
                      title: "Үнийн дүн",
                      dataIndex: "price",
                      key: "price",
                      align: "right",
                      render: (price, record) => (
                        <div className="inline-flex items-center gap-2">
                          {session?.user?.role === 20 && (
                            <>
                              <img src="/qpay.png" width={40} alt="QPay"></img>•
                            </>
                          )}
                          <div
                            className={`inline-flex items-center justify-end gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${
                              record.assessment
                                ? "bg-red-50 text-red-700"
                                : "bg-green-50 text-green-700"
                            }`}
                          >
                            <MoneyBagBoldDuotone className="w-3.5 h-3.5" />
                            <span>
                              {record.assessment ? "" : "+"}
                              {price.toLocaleString()}₮
                            </span>
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <title>Hire.mn</title>
      {contextHolder}
      <EBarimtModal
        open={barimtModalOpen}
        onClose={() => setBarimtModalOpen(false)}
        barimtData={barimtData}
        assessment={assessmentName}
      />
      <ChargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
      />
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>
      <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pt-8 md:pt-12 pb-8 z-[3]">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/5 space-y-4">
            <div className="relative p-6 bg-white/40 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
              {/* <div className="absolute inset-0 bg-gradient-to-br from-white to-main/5"></div> */}
              <div className="absolute top-32 -right-14 w-60 h-60">
                <Image
                  draggable={false}
                  src="/brain-home.png"
                  width={128}
                  height={128}
                  alt="Brain decoration"
                  className="w-full h-full object-contain opacity-5"
                />
              </div>

              <div className="relative flex flex-col items-center text-center">
                <div className="relative group mb-4">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative min-w-24 min-h-24 w-24 h-24 sm:w-28 sm:h-28 sm:min-w-28 sm:min-h-28 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                    {session?.user?.profile ? (
                      <img
                        src={session?.user?.profile}
                        alt={session?.user?.name || "Profile"}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent pt-1.5 flex items-center justify-center">
                        {session?.user?.name?.[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center mt-1">
                  <div className="font-extrabold text-xl leading-5 bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {session.user.name}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-medium">{session?.user?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-2 sm:px-4 sm:py-5 shadow shadow-slate-200 h-fit">
              <div className="flex md:flex-col gap-1">
                {menuItems
                  .filter((item) => item.show !== false)
                  .map((item) => (
                    <div
                      key={item.key}
                      className="cursor-pointer rounded-xl hover:bg-bg10 hover:rounded-full hover:text-main hover:font-semibold"
                      onClick={() => setActiveTab(item.key)}
                    >
                      {activeTab === item.key ? (
                        <div className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                          <div className="relative bg-gradient-to-br p-1.5 sm:p-2.5 px-4 from-main/20 to-secondary/20 rounded-full flex items-center border border-main/10">
                            <div className="font-extrabold text-main flex items-center gap-2">
                              {item.icon}
                              {item.name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-1.5 sm:p-2.5 px-4 flex items-center gap-2">
                          {item.icon}
                          <div className="hidden sm:block">{item.name}</div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-4/5">{renderContent()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Profile;
