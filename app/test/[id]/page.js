"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAssessmentById, getUserTestHistory } from "@/app/api/assessment";
import { Breadcrumb, Button, message, Progress, Spin, Table } from "antd";
import {
  AlarmBoldDuotone,
  BookBookmarkBoldDuotone,
  CaseRoundMinimalisticBoldDuotone,
  ClipboardTextBoldDuotone,
  CloudDownloadLineDuotone,
  CloudPlusLineDuotone,
  CursorLineDuotone,
  EyeBoldDuotone,
  EyeClosedLineDuotone,
  Flag2BoldDuotone,
  FolderCloudBoldDuotone,
  HistoryBoldDuotone,
  MouseBoldDuotone,
  QuestionCircleBoldDuotone,
  SquareArrowRightDownBoldDuotone,
  TicketSaleBoldDuotone,
  UserPlusBoldDuotone,
  Wallet2BoldDuotone,
} from "solar-icons";
import Image from "next/image";
import { api } from "@/app/utils/routes";
import PurchaseModal from "@/components/modals/Purchase";
import { purchaseTest, userService } from "@/app/api/main";
import QPay from "@/components/modals/QPay";
import { getReport } from "@/app/api/exam";
import { motion } from "framer-motion";
import { LoadingOutlined } from "@ant-design/icons";

export default function Test() {
  const params = useParams();
  const testId = params.id;
  const [loading, setLoading] = useState(false);
  const [assessmentData, setAssessmentData] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [testHistory, setTestHistory] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const historyTableRef = useRef(null);

  const fetchData = async () => {
    try {
      const assessmentResponse = await getAssessmentById(testId);
      if (assessmentResponse.success) {
        setAssessmentData(assessmentResponse.data);
      }

      const res = await getUserTestHistory(testId);
      if (res.success) {
        setTestHistory(res.data);
      }
    } catch (error) {
      console.error("GET / Aлдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    }
  };

  console.log(testHistory);

  const fetchHistory = async () => {
    try {
      const res = await getUserTestHistory(testId);
      if (res.success) {
        setTestHistory(res.data);
      }
    } catch (error) {
      console.error("GET / Aлдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchHistory();
  }, [params]);

  const stats = [
    {
      icon: <AlarmBoldDuotone width={36} height={36} />,
      label: "Хугацаа",
      value: assessmentData.data?.duration + " " + "минут",
    },
    {
      icon: <Flag2BoldDuotone width={36} height={36} />,
      label: "Түвшин",
      value: assessmentData.data?.level || "Хамаарахгүй",
    },
    {
      icon: <FolderCloudBoldDuotone width={36} height={36} />,
      label: "Тест банк",
      value: assessmentData.count,
    },
    {
      icon: <QuestionCircleBoldDuotone width={36} height={36} />,
      label: "Асуултын тоо",
      value: assessmentData.data?.questionCount,
    },
  ];

  const columns = [
    {
      title: "Огноо",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Төлөв",
      dataIndex: "status",
      key: "status",
    },

    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      sorter: (a, b) => a.result - b.result,
    },
    {
      title: "Төлбөрийн хэлбэр",
      dataIndex: "payment",
      key: "payment",
      align: "center",
    },
    {
      title: "Тайлан",
      key: "action",
      dataIndex: "report",
      align: "center",
    },
  ];

  const columns_corp = [
    {
      title: "Огноо",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Тестийн нэр",
      dataIndex: "testName",
      key: "testName",
      width: "50%",
    },
    {
      title: "Худалдаж авсан эрхийн тоо",
      dataIndex: "bought",
      key: "bought",
      align: "center",
    },
    {
      title: "Төлбөрийн хэлбэр",
      dataIndex: "payment",
      key: "payment",
      align: "center",
    },
  ];

  const handleTakeTest = async () => {
    if (!session) {
      localStorage.setItem("intendedTestUrl", `/test/${testId}`);
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.role === 30) {
      setIsModalOpen(true);
      return;
    }

    if (
      session?.user?.role === 20 &&
      testHistory?.data &&
      testHistory?.data.some(
        (item) => item.usedUserCount === 0 && item.status === 20
      )
    ) {
      router.push(`/test/details/${testId}`);
      return;
    }

    try {
      setLoading(true);

      if (assessmentData.data.price === 0) {
        const response = await userService(testId);

        if (response.success) {
          router.push(`/test/details/${testId}`);
          return;
        }
      }

      const res = await userService(testId);

      if (res.success) {
        setPaymentData(res.data);
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error("Худалдан авалтад алдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationPurchase = async (values) => {
    setConfirmLoading(true);
    try {
      const response = await purchaseTest(values.count, testId);

      if (response.success) {
        messageApi.success("Худалдан авалт амжилттай.");
        setIsModalOpen(false);
        fetchHistory();
        setTimeout(() => {
          if (historyTableRef.current) {
            historyTableRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error("Худалдан авалтад алдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setConfirmLoading(false);
    }
  };

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

  return (
    <>
      <Spin
        fullscreen
        tip="Уншиж байна..."
        spinning={loading}
        indicator={<LoadingOutlined style={{ color: "white" }} spin />}
      />
      <title>{assessmentData?.data?.name + " – Hire.mn"}</title>
      {contextHolder}
      {assessmentData.category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden"
        >
          {" "}
          <div className="inset-0 fixed">
            <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/5 blur-[80px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/5 blur-[100px]" />
          </div>
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 -right-10 sm:-right-8 lg:right-0 xl:right-[20px] 2xl:right-[150px] w-[600px] sm:w-[520px] md:w-[600px] lg:w-[600px] xl:w-[820px] 2xl:w-[880px] 3xl:w-[1000px] flex items-center justify-center">
              <div className="relative w-full pb-[50%]">
                <Image
                  src="/halfcircle.png"
                  alt="Half circle"
                  fill
                  className="object-contain opacity-50 sm:opacity-100 z-[1]"
                  priority
                />
                <div className="absolute top-1 inset-x-0 h-[200px] sm:h-[150px] md:h-[150px] xl:h-[200px] 2xl:h-[250px] flex items-start justify-center overflow-hidden">
                  <Image
                    src={`${api}file/${assessmentData.data.icons}`}
                    alt="Assessment Icon"
                    width={600}
                    height={200}
                    className="w-[250px] sm:w-[250px] md:w-[320px] lg:w-[320px] xl:w-[420px] 2xl:w-[480px] object-top object-cover hidden sm:block"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pt-5 pb-16 z-[3]">
            <div className="flex flex-col sm:flex-row gap-3 pt-12">
              <div className="text-main hidden sm:block -mt-0.5">
                <SquareArrowRightDownBoldDuotone />
              </div>
              <div className="w-full sm:w-2/3">
                <Breadcrumb
                  className="mb-3"
                  items={[
                    {
                      title: "Тестүүд",
                      href: "/tests",
                    },
                    {
                      title: assessmentData.category.name,
                    },
                  ]}
                />

                <h1 className="text-4xl font-black mb-4 w-3/4 w-3/4 xl:w-[80%] 2xl:w-[90%] bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent">
                  {assessmentData.data.name}
                </h1>
                <div className="text-gray-700 mb-8 flex items-center gap-2">
                  <div className="text-main">
                    <BookBookmarkBoldDuotone width={18} height={18} />
                  </div>
                  {assessmentData.data.author || "Тест зохиогч"}
                  <div>•</div>
                  <div className="text-black font-bold">
                    {assessmentData.data.price > 0 ? (
                      <span>{assessmentData.data.price.toLocaleString()}₮</span>
                    ) : (
                      "Үнэгүй"
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl sm:rounded-full px-4 sm:px-14 py-6 inline-flex flex-wrap gap-7 sm:gap-10 justify-around w-fit relative overflow-hidden">
              <div className="absolute top-28 -right-8 sm:top-6 sm:right-0 w-[300px] sm:w-[220px] h-[220px]">
                <Image
                  src="/brain-home.png"
                  alt="Brain icon"
                  fill
                  className="object-contain opacity-10 sm:opacity-20"
                  priority
                  draggable={false}
                />
              </div>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[100px] relative z-10"
                >
                  <div className="mb-2 text-main transition-transform hover:rotate-180 duration-700">
                    {stat.icon}
                  </div>
                  <div className="text-sm text-gray-700">{stat.label}</div>
                  <div className="font-bold">{stat.value}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center gap-3 mt-8 sm:hidden text-center">
              <div
                className="relative group cursor-pointer"
                onClick={handleTakeTest}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-main/20 to-main/10 rounded-full flex items-center justify-center border border-main/10">
                  <div className="font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-2 px-7">
                    {(session?.user?.role === 20 &&
                      testHistory?.data &&
                      testHistory?.data.some(
                        (item) => item.usedUserCount === 0 && item.status === 20
                      )) ||
                    (session?.user?.role === 20 &&
                      assessmentData.data.price === 0)
                      ? "Тест өгөх"
                      : "Худалдаж авах"}
                  </div>
                </div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-600/50 to-gray-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-gray-400/30 to-gray-200/20 rounded-full flex items-center justify-center border border-gray-900/10">
                  <div className="font-extrabold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-2 px-7">
                    Жишиг тайлан харах
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8`}
            >
              {[
                {
                  icon: <ClipboardTextBoldDuotone width={18} />,
                  title: "Товч тайлбар",
                  content: assessmentData.data.description,
                },
                {
                  icon: <EyeBoldDuotone width={18} />,
                  title: "Хэмжих зүйлс",
                  content: assessmentData.data.measure,
                },
                {
                  icon: <CaseRoundMinimalisticBoldDuotone width={18} />,
                  title: "Хэрэглээ",
                  content: assessmentData.data.usage,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl px-9 py-6 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute -right-12 -top-12 w-24 h-24 bg-main/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="absolute right-20 -bottom-12 w-32 h-32 bg-secondary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <h3 className="text-base font-extrabold mb-2 flex items-center gap-2 text-gray-700">
                      <p className="text-main">{item.icon}</p>
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-5 relative z-10 text-justify">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-12 hidden sm:flex">
              <div
                className="relative group cursor-pointer"
                onClick={handleTakeTest}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
                  <div className="font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-2 px-7">
                    {(session?.user?.role === 20 &&
                      testHistory?.data &&
                      testHistory?.data.some(
                        (item) => item.usedUserCount === 0 && item.status === 20
                      )) ||
                    (session?.user?.role === 20 &&
                      assessmentData.data.price === 0)
                      ? "Тест өгөх"
                      : "Худалдаж авах"}
                  </div>
                </div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-600/50 to-gray-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-gray-400/30 to-gray-200/20 rounded-full flex items-center justify-center border border-gray-900/10">
                  <div className="font-extrabold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-2 px-7">
                    Жишиг тайлан харах
                  </div>
                </div>
              </div>
            </div>
            {session?.user?.role === 20 &&
              testHistory?.data &&
              testHistory?.data.length > 0 && (
                <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 shadow-sm mt-12">
                  <h2 className="text-base font-extrabold mb-4 px-1 flex items-center gap-2">
                    <HistoryBoldDuotone width={20} />
                    Тест өгсөн түүх
                  </h2>
                  <Table
                    columns={columns}
                    dataSource={testHistory?.data
                      ?.filter((item) => item.status === 20)
                      .map((item) => ({
                        key: item.id,
                        date: new Date(item.createdAt).toLocaleDateString(),
                        status:
                          item.exams[0]?.userStartDate == null &&
                          item.exams[0]?.userEndDate == null ? (
                            <div className="relative group w-fit">
                              <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-600/50 to-orange-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                              <div className="relative bg-gradient-to-br from-yellow-400/30 to-yellow-300/20 rounded-full flex items-center justify-center border border-yellow-900/10">
                                <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-1 px-3.5">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full -mt-0.5"></div>
                                  Өгөөгүй
                                </div>
                              </div>
                            </div>
                          ) : item.exams[0]?.userStartDate != null &&
                            item.exams[0]?.userEndDate == null ? (
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
                              <div className="absolute -inset-0.5 bg-gradient-to-br from-lime-800/50 to-green-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                              <div className="relative bg-gradient-to-br from-lime-600/20 to-green-600/30 rounded-full flex items-center justify-center border border-yellow-900/10">
                                <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-black/60 to-black/70 bg-clip-text text-transparent py-1 px-3.5">
                                  <div className="w-2 h-2 bg-lime-600 rounded-full -mt-0.5"></div>
                                  Дуусгасан
                                </div>
                              </div>
                            </div>
                          ),
                        result:
                          item.exams && item.exams.length > 0 ? (
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
                                    format={(percent) => `${percent}%`}
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
                                <div>
                                  {item.exams[0].result
                                    ? item.exams[0].result.result +
                                      " • " +
                                      item.exams[0].result.value
                                    : ""}
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
                            <div></div>
                          ),
                        payment:
                          item.price > 0 ? (
                            <div className="flex items-center gap-2 justify-center">
                              <img src="/qpay.png" width={40}></img>•
                              <div>{item.price.toLocaleString()}₮</div>
                            </div>
                          ) : (
                            "Үнэгүй"
                          ),
                        report:
                          item.exams[0]?.userStartDate == null &&
                          item.exams[0]?.userEndDate == null ? (
                            <div
                              className="flex justify-center"
                              onClick={() =>
                                router.push(`/test/details/${testId}`)
                              }
                            >
                              <button className="text-main hover:text-secondary flex items-center gap-2 text-center font-semibold">
                                <CursorLineDuotone width={18} />
                                Тест өгөх
                              </button>
                            </div>
                          ) : item.exams[0]?.userStartDate != null &&
                            item.exams[0]?.userEndDate == null ? (
                            <div
                              className="flex justify-center"
                              onClick={() =>
                                item.exams &&
                                item.exams.length > 0 &&
                                router.push(`/exam/${item.exams[0].code}`)
                              }
                            >
                              <button className="text-main hover:text-secondary flex items-center gap-2 font-semibold">
                                <MouseBoldDuotone width={18} />
                                Үргэлжлүүлэх
                              </button>
                            </div>
                          ) : (
                            <div
                              className="flex justify-center"
                              onClick={() =>
                                item.exams &&
                                item.exams.length > 0 &&
                                downloadReport(item.exams[0].code)
                              }
                            >
                              <button className="text-main hover:text-secondary flex items-center gap-2 font-semibold">
                                <ClipboardTextBoldDuotone width={18} />
                                Татах
                              </button>
                            </div>
                          ),
                      }))}
                    className="test-history-table overflow-x-auto"
                    pagination={false}
                  />
                </div>
              )}
            {session?.user?.role === 20 &&
              testHistory?.invited &&
              testHistory?.invited.length > 0 && (
                <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 shadow-sm mt-12">
                  <h2 className="text-base font-extrabold mb-4 px-1 flex items-center gap-2">
                    <HistoryBoldDuotone width={20} />
                    Байгууллагаас уригдсан
                  </h2>
                  <Table
                    columns={columns}
                    dataSource={testHistory?.invited.map((item) => ({
                      key: item.id,
                      date: new Date(item.createdAt).toLocaleDateString(),
                      status:
                        item.userStartDate == null &&
                        item.userEndDate == null ? (
                          <div className="relative group w-fit">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-600/50 to-orange-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-gradient-to-br from-yellow-400/30 to-yellow-300/20 rounded-full flex items-center justify-center border border-yellow-900/10">
                              <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-1 px-3.5">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full -mt-0.5"></div>
                                Өгөөгүй
                              </div>
                            </div>
                          </div>
                        ) : item.userStartDate != null &&
                          item.userEndDate == null ? (
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
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-lime-800/50 to-green-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-gradient-to-br from-lime-600/20 to-green-600/30 rounded-full flex items-center justify-center border border-yellow-900/10">
                              <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-black/60 to-black/70 bg-clip-text text-transparent py-1 px-3.5">
                                <div className="w-2 h-2 bg-lime-600 rounded-full -mt-0.5"></div>
                                Дуусгасан
                              </div>
                            </div>
                          </div>
                        ),
                      result: item.visible ? (
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
                          <div>
                            {item.result
                              ? item.result.result + " • " + item.result.value
                              : ""}
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
                      ),
                      payment:
                        item.price > 0 ? (
                          <div className="flex items-center gap-2 justify-center">
                            <img src="/qpay.png" width={40}></img>•
                            <div>{item.price.toLocaleString()}₮</div>
                          </div>
                        ) : (
                          "Үнэгүй"
                        ),
                      report:
                        item.userStartDate == null &&
                        item.userEndDate == null ? (
                          <div
                            className="flex justify-center"
                            onClick={() =>
                              router.push(`/test/details/${testId}`)
                            }
                          >
                            <button className="text-main hover:text-secondary flex items-center gap-2 text-center font-semibold">
                              <CursorLineDuotone width={18} />
                              Тест өгөх
                            </button>
                          </div>
                        ) : item.userStartDate != null &&
                          item.userEndDate == null ? (
                          <div
                            className="flex justify-center"
                            onClick={() => router.push(`/exam/${item.code}`)}
                          >
                            <button className="text-main hover:text-secondary flex items-center gap-2 font-semibold">
                              <MouseBoldDuotone width={18} />
                              Үргэлжлүүлэх
                            </button>
                          </div>
                        ) : (
                          <div
                            className="flex justify-center"
                            onClick={() => downloadReport(item.code)}
                          >
                            <button className="text-main hover:text-secondary flex items-center gap-2 font-semibold">
                              <ClipboardTextBoldDuotone width={18} />
                              Татах
                            </button>
                          </div>
                        ),
                    }))}
                    className="test-history-table overflow-x-auto"
                    pagination={false}
                  />
                </div>
              )}
            <QPay
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              paymentData={paymentData}
              serviceId={paymentData?.data?.id}
              onSuccess={() => {
                router.push(`/test/details/${testId}`);
              }}
            />
            <PurchaseModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              confirmLoading={confirmLoading}
              onPurchase={handleOrganizationPurchase}
              testPrice={assessmentData.data?.price || 0}
              remaining={testHistory?.data.reduce(
                (sum, item) => sum + (item.count - item.usedUserCount),
                0
              )}
            />
            {session?.user?.role === 30 &&
              testHistory?.data &&
              testHistory?.data.length > 0 && (
                <div
                  ref={historyTableRef}
                  className="bg-white rounded-3xl p-6 shadow-sm mt-12"
                >
                  <div className="sm:justify-between flex flex-col sm:flex-row justify-start mb-4 sm:items-center gap-2">
                    <h2 className="text-base font-extrabold px-1 flex items-center gap-2">
                      <HistoryBoldDuotone width={20} />
                      Худалдан авалтын түүх
                    </h2>
                    <div className="flex items-center">
                      <div className="pl-1 pr-3 sm:px-3 flex items-center gap-1.5">
                        <span className="text-main">
                          <TicketSaleBoldDuotone width={18} />
                        </span>
                        <div>
                          <span className="font-extrabold text-main pr-0.5">
                            {testHistory?.data.reduce(
                              (sum, item) =>
                                sum + (item.count - item.usedUserCount),
                              0
                            )}
                          </span>{" "}
                          эрх үлдсэн
                        </div>
                      </div>
                      <Button
                        className="stroked-btn"
                        onClick={() => router.push(`/tests/${testId}`)}
                      >
                        <UserPlusBoldDuotone width={18} />
                        Шалгуулагч урих
                      </Button>
                    </div>
                  </div>
                  <Table
                    columns={columns_corp}
                    dataSource={testHistory?.data.map((item) => ({
                      key: item.id,
                      date: new Date(item.createdAt).toLocaleDateString(),
                      testName: item.assessment.name,
                      bought: item.count + " эрх",
                      payment: (
                        <div className="flex items-center gap-2 justify-center text-main font-semibold">
                          <div className="text-main">
                            <Wallet2BoldDuotone width={18} />
                          </div>
                          <div>{item.price.toLocaleString()}₮</div>
                        </div>
                      ),
                    }))}
                    className="test-history-table overflow-x-auto"
                    pagination={false}
                  />
                </div>
              )}
          </div>
        </motion.div>
      )}
    </>
  );
}
