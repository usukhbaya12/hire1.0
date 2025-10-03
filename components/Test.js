"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAssessmentById, getUserTestHistory } from "@/app/api/assessment";
import { Breadcrumb, Button, Divider, message, Progress, Table } from "antd";
import {
  AlarmBoldDuotone,
  BookBookmarkBoldDuotone,
  Buildings2BoldDuotone,
  CalendarBoldDuotone,
  CaseRoundMinimalisticBoldDuotone,
  ClipboardTextBoldDuotone,
  EyeBoldDuotone,
  EyeClosedLineDuotone,
  FolderCloudBoldDuotone,
  HistoryBoldDuotone,
  NotificationLinesRemoveBoldDuotone,
  PlayCircleBoldDuotone,
  QuestionCircleBoldDuotone,
  SquareArrowRightDownBoldDuotone,
  StarFall2BoldDuotone,
  StarFallMinimalistic2BoldDuotone,
  TicketSaleBoldDuotone,
  UserPlusBoldDuotone,
  Wallet2BoldDuotone,
} from "solar-icons";
import Image from "next/image";
import { api } from "@/app/utils/routes";
import PurchaseModal from "@/components/modals/Purchase";
import { ebarimt, purchaseTest, userService } from "@/app/api/main";
import QPay from "@/components/modals/QPay";
import { customLocale } from "@/app/utils/values";
import NotFoundPage from "@/app/not-found";
import Link from "next/link";
import EBarimtModal from "./modals/EBarimt";
import LoadingSpinner from "./Spin";
import { useAssessments } from "@/app/utils/providers";
import Assessment from "./Assessment";
import Footer from "./Footer";
import dayjs from "dayjs";

export default function Test() {
  const params = useParams();
  const testId = params.id;
  const [loading, setLoading] = useState(false);
  const [loadingTakeTest, setLoadingTakeTest] = useState(false);
  const [assessmentData, setAssessmentData] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [testHistory, setTestHistory] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barimtModalOpen, setBarimtModalOpen] = useState(false);
  const [barimtData, setBarimtData] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const historyTableRef = useRef(null);
  const [error, setError] = useState(null);
  const { assessments } = useAssessments();

  const recommend = useMemo(() => {
    if (!assessments) return [];
    return [...assessments].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [assessments]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const assessmentResponse = await getAssessmentById(testId);
      if (assessmentResponse.success && assessmentResponse.data) {
        if (assessmentResponse.data.data.status === 20) {
          router.push("/");
          return;
        }
        setAssessmentData(assessmentResponse.data);
      } else {
        throw new Error(response.message || "Тест олдсонгүй.");
      }

      const res = await getUserTestHistory(testId);
      if (res.success) {
        setTestHistory(res.data);
      }
    } catch (error) {
      setError("Тест олдсонгүй.");
      messageApi.error("Тест олдсонгүй.");
    } finally {
      setLoading(false);
    }
  };

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
      icon: <Wallet2BoldDuotone width={36} height={36} />,
      label: "Тестийн үнэ",
      value:
        assessmentData.data?.price > 0
          ? assessmentData.data?.price.toLocaleString() + "₮"
          : "Үнэгүй" || "Үнэгүй",
    },
    {
      icon: <AlarmBoldDuotone width={36} height={36} />,
      label: "Хугацаа",
      value:
        assessmentData.data?.duration > 0
          ? assessmentData.data?.duration + " " + "минут"
          : "Хугацаагүй",
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
    ...(testHistory?.data?.some((item) => item.price > 0)
      ? [
          {
            title: "Үйлдэл",
            key: "barimt",
            dataIndex: "barimt",
            align: "center",
          },
        ]
      : []),
  ];

  const columns2 = [
    {
      title: "Уригдсан огноо",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Дуусах огноо",
      dataIndex: "endDate",
      key: "endDate",
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
      title: "Байгууллагын нэр",
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

  const getBarimt = async (serviceId) => {
    try {
      const res = await ebarimt(serviceId);
      setBarimtData(res.data);
      setBarimtModalOpen(true);
    } catch (err) {
      console.error("GET / Aлдаа гарлаа.", err);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    }
  };

  const handleTakeTest = async () => {
    setLoadingTakeTest(true);

    if (!session) {
      localStorage.setItem("intendedTestUrl", `/test/${testId}`);
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.role === 30) {
      setIsModalOpen(true);
      setLoadingTakeTest(false);

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
      setLoadingTakeTest(false);
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

  const shareToFacebookWithMeta = (examCode) => {
    const siteUrl = "https://hire.mn";

    const shareUrl = `${siteUrl}/share/${testId}/${examCode}`;

    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;

    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* <Spin
        fullscreen
        tip="Уншиж байна..."
        spinning={loading}
        indicator={<LoadingOutlined style={{ color: "white" }} spin />}
      /> */}
      <title>{assessmentData?.data?.name}</title>
      {contextHolder}
      <EBarimtModal
        open={barimtModalOpen}
        onClose={() => setBarimtModalOpen(false)}
        barimtData={barimtData}
        assessment={assessmentData.data?.name}
      />
      {error && !loading && <NotFoundPage />}

      {assessmentData.category && (
        <div className="relative overflow-hidden">
          <div className="inset-0 fixed">
            <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/5 blur-[80px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/5 blur-[100px]" />
          </div>
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 -right-10 sm:-right-8 lg:right-0 xl:right-[20px] 2xl:right-[210px] w-[600px] sm:w-[520px] md:w-[600px] lg:w-[600px] xl:w-[820px] 2xl:w-[880px] 3xl:w-[1000px] flex items-center justify-center">
              <div className="relative w-full pb-[50%]">
                <Image
                  src="/halfcircle.png"
                  alt="Half circle"
                  fill
                  className="object-contain opacity-50 sm:opacity-100 z-[1]"
                  priority
                />
                <div className="absolute top-1 inset-x-0 h-[60%] flex items-start justify-center overflow-hidden">
                  <div className="relative overflow-hidden w-[250px] sm:w-[250px] md:w-[320px] lg:w-[320px] xl:w-[420px] 2xl:w-[480px] h-[calc(100%-30px)]">
                    <Image
                      src={
                        assessmentData.data.icons
                          ? `${api}file/${assessmentData.data.icons}`
                          : "/placeholder.png"
                      }
                      alt="Assessment Icon"
                      width={600}
                      height={600}
                      className="absolute top-[-30px] object-cover object-top w-full h-auto hidden sm:block"
                      priority
                    />
                  </div>
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
                    { title: <Link href="/#tests">Тестүүд</Link> },
                    { title: assessmentData.category.name },
                  ]}
                />
                <h1 className="text-4xl 2xl:text-5xl font-black mb-4 w-full lg:w-[65%] 2xl:w-[75%] bg-gradient-to-r from-main via-pink-500 to-secondary bg-clip-text text-transparent tracking-tight leading-[1.1]">
                  {assessmentData.data.name}
                </h1>
                <div className="text-gray-700 mb-8 flex items-center gap-2">
                  <div className="text-main">
                    <BookBookmarkBoldDuotone width={18} height={18} />
                  </div>
                  <div className="xl:w-[65%]">
                    {assessmentData.data.author || "Тест зохиогч"}
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
              <Button
                className="grd-btn h-10 w-full"
                onClick={handleTakeTest}
                loading={loadingTakeTest}
              >
                {(session?.user?.role === 20 &&
                  testHistory?.data &&
                  testHistory?.data.some(
                    (item) => item.usedUserCount === 0 && item.status === 20
                  )) ||
                (session?.user?.role === 20 && assessmentData.data.price === 0)
                  ? "Тест өгөх"
                  : "Худалдаж авах"}
              </Button>
              {assessmentData?.data?.exampleReport && (
                <Button
                  className="grd-btn-2 h-10 w-full"
                  onClick={() => {
                    window.open(
                      `${api}file/${assessmentData.data.exampleReport}`,
                      "_blank"
                    );
                  }}
                >
                  Жишиг тайлан харах
                </Button>
              )}
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
              <Button
                className="grd-btn h-10 w-[172px]"
                onClick={handleTakeTest}
                loading={loadingTakeTest}
              >
                {(session?.user?.role === 20 &&
                  testHistory?.data &&
                  testHistory?.data.some(
                    (item) => item.usedUserCount === 0 && item.status === 20
                  )) ||
                (session?.user?.role === 20 && assessmentData.data.price === 0)
                  ? "Тест өгөх"
                  : "Худалдаж авах"}
              </Button>
              {assessmentData?.data?.exampleReport && (
                <Button
                  className="grd-btn-2 h-10 w-[202px]"
                  onClick={() => {
                    window.open(
                      `${api}file/${assessmentData.data.exampleReport}`,
                      "_blank"
                    );
                  }}
                >
                  Жишиг тайлан харах
                </Button>
              )}
            </div>
            {session?.user?.role === 20 &&
              testHistory?.data &&
              testHistory?.data.length > 0 && (
                <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 shadow-sm mt-12">
                  <h2 className="text-base font-extrabold mb-4 px-1 flex items-center gap-2">
                    <HistoryBoldDuotone width={20} />
                    Тест өгсөн түүх
                  </h2>
                  <div className="hidden sm:block">
                    <Table
                      locale={customLocale}
                      columns={columns}
                      dataSource={testHistory?.data
                        ?.filter((item) => item.status === 20)
                        .map((item) => ({
                          key: item.id,
                          date: item.createdAt
                            ? dayjs(item.createdAt).format("YYYY-MM-DD")
                            : null,
                          status:
                            item.exams[0]?.userStartDate == null &&
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
                                QPay / <div>{item.price.toLocaleString()}₮</div>
                              </div>
                            ) : (
                              "Үнэгүй"
                            ),
                          barimt:
                            item.status == 20 && item.price > 0 ? (
                              <div className="flex justify-center gap-2">
                                <Button
                                  className="grd-btn-3"
                                  onClick={() => {
                                    getBarimt(item.id);
                                  }}
                                >
                                  <>
                                    <img
                                      src="/ebarimt.png"
                                      width={20}
                                      alt="E-Barimt"
                                    ></img>
                                  </>
                                </Button>

                                <Button
                                  onClick={() =>
                                    shareToFacebookWithMeta(item.exams[0].code)
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
                                  />
                                </Button>
                              </div>
                            ) : null,
                          report:
                            item.exams[0]?.userStartDate == null &&
                            item.exams[0]?.userEndDate == null ? (
                              <div className="flex justify-center">
                                <Link href={`/test/details/${testId}`}>
                                  <Button className="grd-btn-4 border-none">
                                    <StarFallMinimalistic2BoldDuotone
                                      width={18}
                                    />
                                    Тест өгөх
                                  </Button>
                                </Link>
                              </div>
                            ) : item.exams[0]?.userStartDate != null &&
                              item.exams[0]?.userEndDate == null ? (
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
                                {item.price === 0 && (
                                  <Button
                                    onClick={() =>
                                      shareToFacebookWithMeta(
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
                                    />
                                  </Button>
                                )}
                              </div>
                            ),
                        }))}
                      className="test-history-table overflow-x-auto"
                      pagination={false}
                    />
                  </div>
                  <div className="block sm:hidden space-y-4">
                    {testHistory?.data
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
                          <div>
                            Үр дүн:
                            {item.exams && item.exams.length > 0 ? (
                              item.exams[0].visible ? (
                                item.assessment.report === 10 &&
                                item.exams[0].result ? (
                                  <>
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
                                  </>
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
                                      <div className="font-bold text-blue-700 -my-[3px]">
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
                          {item.price > 0 && (
                            <>
                              <Divider />
                              <div className="text-sm flex justify-between">
                                <div className="flex items-center gap-2 justify-center">
                                  QPay /{" "}
                                  <div>{item.price.toLocaleString()}₮</div>
                                </div>
                                <div className="flex items-center gap-2 justify-center">
                                  <Button
                                    className="grd-btn-3"
                                    onClick={() => getBarimt(item.id)}
                                  >
                                    <>
                                      <img
                                        src="/ebarimt.png"
                                        width={20}
                                        alt="E-Barimt"
                                      ></img>
                                    </>
                                  </Button>
                                  <Button
                                    className="grd-btn-3"
                                    onClick={() =>
                                      shareToFacebookWithMeta(
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
                                    />
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                          <Divider />
                          <div className="flex gap-2 justify-between">
                            {item.exams[0]?.userStartDate == null &&
                            item.exams[0]?.userEndDate == null ? (
                              <Link
                                href={`/test/details/${assessmentData.data?.id}`}
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
                              item.exams[0]?.userEndDate != null &&
                              item.price === 0 && (
                                <Button
                                  className="grd-btn-3"
                                  onClick={() =>
                                    shareToFacebookWithMeta(item.exams[0].code)
                                  }
                                  title="Фэйсбүүкт хуваалцах"
                                >
                                  <Image
                                    src="/facebook.png"
                                    width={18}
                                    height={18}
                                    alt="facebook"
                                  />
                                </Button>
                              )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {testHistory?.invited && testHistory?.invited.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-base font-extrabold mb-4 px-1 flex items-center gap-2">
                        <Buildings2BoldDuotone width={20} />
                        Байгууллагаас уригдсан
                      </h2>
                      <div className="hidden sm:block">
                        <Table
                          locale={customLocale}
                          columns={columns2}
                          rowClassName={(record) =>
                            record.isExpired
                              ? "opacity-60 pointer-events-none"
                              : ""
                          }
                          dataSource={testHistory?.invited.map((item) => {
                            const date = new Date(item.endDate);
                            const isExpired =
                              date < new Date() && !item.userEndDate;

                            return {
                              key: item.id,
                              date: item.createdAt
                                ? dayjs(item.createdAt).format("YYYY-MM-DD")
                                : "",

                              endDate: isExpired ? (
                                <div>
                                  {date
                                    ? dayjs(date).format("YYYY-MM-DD HH:mm")
                                    : "-"}
                                </div>
                              ) : date ? (
                                dayjs(date).format("YYYY-MM-DD HH:mm")
                              ) : (
                                "-"
                              ),
                              isExpired,

                              status:
                                item.userStartDate == null &&
                                item.userEndDate == null ? (
                                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold text-amber-700">
                                      Өгөөгүй
                                    </span>
                                  </div>
                                ) : item.userStartDate != null &&
                                  item.userEndDate == null ? (
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
                                ) : (
                                  <div className="font-extrabold">
                                    {item.result
                                      ? item.result.result +
                                        " / " +
                                        item.result.value
                                      : ""}
                                  </div>
                                )
                              ) : item.userEndDate ? (
                                <div className="flex items-center gap-1 text-main font-bold mt-1">
                                  <EyeClosedLineDuotone
                                    width={18}
                                    className="text-main"
                                  />
                                  Байгууллагад илгээсэн
                                </div>
                              ) : (
                                <></>
                              ),

                              payment: item.service.user ? (
                                <div className="flex items-center gap-2 justify-center text-blue-700 font-bold">
                                  <Buildings2BoldDuotone width={18} />
                                  <div>
                                    {item.service.user.organizationName}
                                  </div>
                                </div>
                              ) : (
                                <></>
                              ),

                              report: isExpired ? (
                                <div className="flex justify-center">
                                  <button className="text-main flex text-center">
                                    <NotificationLinesRemoveBoldDuotone
                                      width={18}
                                    />
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
                                      <StarFallMinimalistic2BoldDuotone
                                        width={18}
                                      />
                                      Тест өгөх
                                    </Button>
                                  </Link>
                                </div>
                              ) : item.visible ? (
                                <div className="flex justify-center items-center gap-2">
                                  <Link
                                    href={`/api/report/${item.code}`}
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
                                      shareToFacebookWithMeta(item.code)
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
                                    />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <button className="text-main flex text-center">
                                    <NotificationLinesRemoveBoldDuotone
                                      width={18}
                                    />
                                  </button>
                                </div>
                              ),
                            };
                          })}
                          className="test-history-table overflow-x-auto"
                          pagination={false}
                        />
                      </div>
                      <div className="block sm:hidden space-y-4">
                        {testHistory?.invited.map((item) => {
                          const now = new Date();
                          const endDateObj = new Date(item.endDate);
                          const isExpired =
                            endDateObj < now && !item.userEndDate;
                          const disabledClass = isExpired
                            ? "opacity-60 pointer-events-none"
                            : "";

                          return (
                            <div
                              key={item.id}
                              className={`rounded-3xl shadow shadow-slate-200 bg-white p-4 px-6 space-y-2 ${disabledClass}`}
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
                                  {item.userStartDate == null &&
                                  item.userEndDate == null ? (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
                                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                      <span className="text-xs font-bold text-amber-700">
                                        Өгөөгүй
                                      </span>
                                    </div>
                                  ) : item.userStartDate != null &&
                                    item.userEndDate == null ? (
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
                              <div>
                                <div>Үр дүн:</div>

                                {isExpired ? (
                                  <div className="flex items-center gap-2 text-red-400 font-bold">
                                    <AlarmBoldDuotone width={16} />
                                    Хугацаа хэтэрсэн
                                  </div>
                                ) : item.visible ? (
                                  item.assessment.report === 10 &&
                                  item.result ? (
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
                                          ({item.result.point}/
                                          {item.result.total})
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="font-extrabold text-lg">
                                      {item.result?.result ? (
                                        (item.result?.result
                                          ? `${item.result?.result}`
                                          : "") +
                                        (item.result?.result &&
                                        item.result?.value
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
                                  {endDateObj
                                    ? dayjs(endDateObj).format(
                                        "YYYY-MM-DD HH:mm"
                                      )
                                    : "-"}
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
                                  ) : item.userStartDate &&
                                    !item.userEndDate ? (
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
                                          <ClipboardTextBoldDuotone
                                            width={18}
                                          />
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
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            {session?.user?.role === 20 && (
              <div className="pt-12 sm:pt-8">
                <div className="font-black text-xl inline-flex gap-1 text-main">
                  <StarFall2BoldDuotone />
                  Танд санал болгох
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {recommend.map((assessment) => (
                    <Assessment
                      key={assessment.data.id}
                      assessment={assessment}
                    />
                  ))}
                </div>
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
                      <Link href={`/tests/${testId}`}>
                        <Button className="stroked-btn">
                          <UserPlusBoldDuotone width={18} />
                          Шалгуулагч урих
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <Table
                    locale={customLocale}
                    columns={columns_corp}
                    dataSource={testHistory?.data.map((item) => ({
                      key: item.id,
                      date: item.createdAt
                        ? dayjs(item.createdAt).format("YYYY-MM-DD")
                        : "",
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
          <Footer />
        </div>
      )}
    </>
  );
}
