"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  CalendarBoldDuotone,
  Card2,
  Card2BoldDuotone,
  ChatRoundDotsLineDuotone,
  ClockCircleBoldDuotone,
  CourseUpBoldDuotone,
  HistoryBoldDuotone,
  KeyBoldDuotone,
  MoneyBagBoldDuotone,
  Paperclip2BoldDuotone,
  PhoneCallingRoundedBoldDuotone,
  RefreshCircleBoldDuotone,
  RoundDoubleAltArrowRightBoldDuotone,
  SuitcaseBoldDuotone,
  TagBoldDuotone,
  UserIdBoldDuotone,
  VerifiedCheckBoldDuotone,
  Wallet2BoldDuotone,
} from "solar-icons";
import Image from "next/image";
import { getUserTestHistory } from "../api/assessment";
import { message, Form, Spin, Input, Button, Empty, Table } from "antd";
import HistoryCard from "@/components/History";
import {
  updateUserProfile,
  getCurrentUser,
  resetPassword,
  getPaymentHistory,
} from "../api/main";
import ChargeModal from "@/components/modals/Charge";
import PaymentHistoryChart from "@/components/Payment";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("history");
  const [form] = Form.useForm();
  const [orgForm] = Form.useForm();
  const [empForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateLoading2, setUpdateLoading2] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await getCurrentUser();
      if (response.success) {
        setUserData(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("GET / Алдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
      return null;
    }
  };

  const refreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserData();
    } catch (error) {
      console.error("Үлдэгдэл шинэчлэхэд алдаа гарлаа:", error);
      messageApi.error("Үлдэгдэл шинэчлэхэд алдаа гарлаа.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getUserTestHistory(0);
        if (res.success) {
          setData(res.data);
        }

        const response = await getPaymentHistory(0, session?.user?.id, 1, 100);
        if (response.success) {
          setPaymentData(response.data);
        }

        await fetchUserData();
      } catch (error) {
        console.error("GET / Алдаа гарлаа.", error);
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  if (!session) return null;

  const menuItems = [
    {
      key: "history",
      icon: <VerifiedCheckBoldDuotone width={20} height={20} />,
      label: session.user.role === 20 ? "Өгсөн тестүүд" : "Миний тестүүд",
    },
    {
      key: "information",
      icon: <UserIdBoldDuotone width={20} height={20} />,
      label: "Мэдээлэл",
    },
    {
      key: "password",
      icon: <KeyBoldDuotone width={20} height={20} />,
      label: "Нууц үг солих",
    },
    {
      key: "wallet",
      icon: <Wallet2BoldDuotone width={20} height={20} />,
      label: "Төлбөрийн түүх",
    },
  ];

  const handleUpdateOrgInfo = async (values) => {
    if (!session.user.id) {
      messageApi.error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
      return;
    }

    setUpdateLoading(true);
    try {
      const userData = {
        organizationName: values.organizationName,
        organizationPhone: values.organizationPhone,
      };

      const response = await updateUserProfile(session.user.id, userData);

      if (response.success) {
        await update({
          ...session,
          user: {
            ...session.user,
            ...userData,
          },
        });

        messageApi.success("Мэдээлэл амжилттай шинэчлэгдлээ.");
      } else {
        messageApi.error(
          response.message || "Мэдээлэл шинэчлэхэд алдаа гарлаа"
        );
      }
    } catch (error) {
      console.error("Error updating organization info:", error);
      messageApi.error("Мэдээлэл шинэчлэхэд алдаа гарлаа");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpdateEmpInfo = async (values) => {
    if (!session.user.id) {
      messageApi.error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
      return;
    }

    setUpdateLoading2(true);
    try {
      const userData = {
        firstname: values.firstname,
        lastname: values.lastname,
        position: values.position,
        phone: values.phone,
      };

      const response = await updateUserProfile(session.user.id, userData);

      if (response.success) {
        await update({
          ...session,
          user: {
            ...session.user,
            ...userData,
          },
        });

        messageApi.success("Мэдээлэл амжилттай шинэчлэгдлээ.");
      } else {
        messageApi.error(
          response.message || "Мэдээлэл шинэчлэхэд алдаа гарлаа"
        );
      }
    } catch (error) {
      console.error("Error updating employee info:", error);
      messageApi.error("Мэдээлэл шинэчлэхэд алдаа гарлаа");
    } finally {
      setUpdateLoading2(false);
    }
  };

  const handleUpdateUserInfo = async (values) => {
    if (!session.user.id) {
      messageApi.error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
      return;
    }

    setUpdateLoading(true);
    try {
      const userData = {
        firstname: values.firstname,
        lastname: values.lastname,
        phone: values.phone,
      };

      const response = await updateUserProfile(session.user.id, userData);

      if (response.success) {
        await update({
          ...session,
          user: {
            ...session.user,
            ...userData,
          },
        });

        messageApi.success("Мэдээлэл амжилттай шинэчлэгдлээ.");
      } else {
        messageApi.error(
          response.message || "Мэдээлэл шинэчлэхэд алдаа гарлаа"
        );
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      messageApi.error("Мэдээлэл шинэчлэхэд алдаа гарлаа");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePasswordUpdate = async (values) => {
    if (!session.user.id) {
      messageApi.error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      messageApi.error("Шинэ нууц үг таарахгүй байна");
      return;
    }

    setUpdateLoading(true);
    try {
      const res = await resetPassword(
        session?.user?.email,
        values.confirmPassword
      );
      if (res.success) {
        messageApi.success("Нууц үг амжилттай шинэчлэгдлээ.");
      } else {
        messageApi.error(res.message || "Нууц үг шинэчлэхэд алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "information":
        return (
          <div className="bg-white/70 rounded-2xl p-6 shadow shadow-slate-200 backdrop-blur-md mt-4">
            {session.user.role === 30 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-6">
                <div className="space-y-4 lg:w-2/5">
                  <h2 className="text-base font-bold">Байгууллагын мэдээлэл</h2>
                  <Form
                    form={orgForm}
                    layout="vertical"
                    initialValues={{
                      organizationName: userData?.organizationName,
                      organizationPhone: userData?.organizationPhone,
                      registerNumber: userData?.organizationRegisterNumber,
                    }}
                    onFinish={handleUpdateOrgInfo}
                  >
                    <Form.Item
                      name="organizationName"
                      label="Байгууллагын нэр"
                      rules={[
                        {
                          required: true,
                          message: "Байгууллагын нэрээ оруулна уу.",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserIdBoldDuotone width={18} height={18} />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="registerNumber"
                      label="Регистрийн дугаар"
                      rules={[
                        {
                          required: true,
                          message: "Регистрийн дугаар оруулна уу",
                        },
                      ]}
                    >
                      <Input
                        disabled
                        prefix={<Card2BoldDuotone width={18} height={18} />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="organizationPhone"
                      label="Утасны дугаар"
                      rules={[
                        {
                          required: true,
                          message: "Зөв утасны дугаар оруулна уу.",
                        },
                        {
                          pattern: /^\d{8}$/,
                          message: "Зөв утасны дугаар оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
                    >
                      <Input
                        prefix={
                          <PhoneCallingRoundedBoldDuotone
                            width={18}
                            height={18}
                          />
                        }
                      />
                    </Form.Item>
                    <Form.Item className="mb-0">
                      <Button
                        htmlType="submit"
                        loading={updateLoading}
                        className="w-full"
                      >
                        Хадгалах
                      </Button>
                    </Form.Item>
                  </Form>
                </div>

                <div className="space-y-4 lg:w-2/5 pt-6 sm:pt-0">
                  <h2 className="text-base font-bold">Ажилтны мэдээлэл</h2>
                  <Form
                    form={empForm}
                    layout="vertical"
                    initialValues={{
                      lastname: userData?.lastname,
                      firstname: userData?.firstname,
                      position: userData?.position,
                      phone: userData?.phone,
                    }}
                    onFinish={handleUpdateEmpInfo}
                  >
                    <Form.Item
                      name="lastname"
                      label="Овог"
                      rules={[{ required: true, message: "Овгоо оруулна уу." }]}
                    >
                      <Input
                        prefix={<UserIdBoldDuotone width={18} height={18} />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="firstname"
                      label="Нэр"
                      rules={[{ required: true, message: "Нэрээ оруулна уу." }]}
                    >
                      <Input
                        prefix={<UserIdBoldDuotone width={18} height={18} />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="position"
                      label="Албан тушаал"
                      rules={[
                        {
                          required: true,
                          message: "Албан тушаалаа оруулна уу.",
                        },
                      ]}
                    >
                      <Input
                        prefix={<SuitcaseBoldDuotone width={18} height={18} />}
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      label="Утасны дугаар"
                      rules={[
                        {
                          required: true,
                          message: "Утасны дугаараа оруулна уу.",
                        },
                        {
                          pattern: /^\d{8}$/,
                          message: "Зөв утасны дугаар оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
                    >
                      <Input
                        prefix={
                          <PhoneCallingRoundedBoldDuotone
                            width={18}
                            height={18}
                          />
                        }
                      />
                    </Form.Item>
                    <Form.Item className="mb-0">
                      <Button
                        htmlType="submit"
                        loading={updateLoading2}
                        className="w-full"
                      >
                        Хадгалах
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            )}

            {session.user.role === 20 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-6">
                <div className="space-y-4 lg:w-2/5">
                  <h2 className="text-base font-bold mb-4">Хувийн мэдээлэл</h2>

                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                      lastname: userData?.lastname,
                      firstname: userData?.firstname,
                      email: userData?.email,
                      phone: userData?.phone,
                    }}
                    onFinish={handleUpdateUserInfo}
                  >
                    <Form.Item
                      name="lastname"
                      label="Овог"
                      rules={[{ required: true, message: "Овгоо оруулна уу." }]}
                    >
                      <Input
                        prefix={<UserIdBoldDuotone width={18} height={18} />}
                      />
                    </Form.Item>
                    <Form.Item
                      name="firstname"
                      label="Нэр"
                      rules={[{ required: true, message: "Нэрээ оруулна уу." }]}
                    >
                      <Input
                        prefix={<UserIdBoldDuotone width={18} height={18} />}
                      />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      label="Утасны дугаар"
                      rules={[
                        {
                          required: true,
                          message: "Утасны дугаараа оруулна уу.",
                        },
                        {
                          pattern: /^\d{8}$/,
                          message: "Зөв утасны дугаар оруулна уу.",
                        },
                      ]}
                    >
                      <Input
                        prefix={
                          <PhoneCallingRoundedBoldDuotone
                            width={18}
                            height={18}
                          />
                        }
                        className="rounded-xl"
                      />
                    </Form.Item>
                    <Form.Item className="mb-0">
                      <Button
                        htmlType="submit"
                        loading={updateLoading}
                        className="w-full"
                      >
                        Хадгалах
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            )}
          </div>
        );

      case "password":
        return (
          <div className="bg-white/70 rounded-2xl p-6 shadow shadow-slate-200 backdrop-blur-md mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-6">
              <div className="space-y-4 lg:w-2/5">
                <h2 className="text-base font-bold mb-4">Нууц үг солих</h2>
                <Form layout="vertical" onFinish={handlePasswordUpdate}>
                  <Form.Item
                    name="currentPassword"
                    label="Одоогийн нууц үг"
                    rules={[
                      {
                        required: true,
                        message: "Одоогийн нууц үгээ оруулна уу.",
                      },
                    ]}
                  >
                    <Input.Password className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    validateTrigger="onSubmit"
                    name="newPassword"
                    label="Шинэ нууц үг"
                    rules={[
                      {
                        required: true,
                        message: "Шинэ нууц үгээ оруулна уу.",
                      },
                      {
                        min: 6,
                        message: "Багадаа 6 тэмдэгт оруулна уу.",
                      },
                    ]}
                  >
                    <Input.Password className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    validateTrigger="onSubmit"
                    name="confirmPassword"
                    label="Шинэ нууц үгээ давтах"
                    rules={[
                      {
                        required: true,
                        message: "Нууц үгээ давтан оруулна уу.",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("newPassword") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Нууц үг тохирохгүй байна.")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password className="rounded-xl" />
                  </Form.Item>

                  <Form.Item className="mb-0">
                    <Button
                      htmlType="submit"
                      loading={updateLoading}
                      className="w-full"
                    >
                      Нууц үг солих
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        );

      case "wallet":
        return (
          <>
            <div className="space-y-6">
              {/* Statistics Cards for Organization Users */}
              {session.user.role === 30 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow shadow-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 font-medium">
                            Нийт зарцуулалт
                          </div>
                          <div className="text-xl font-bold text-red-500 mt-1">
                            {paymentData?.payments
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

                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow shadow-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 font-medium">
                            Нийт цэнэглэлт
                          </div>
                          <div className="text-xl font-bold text-green-500 mt-1">
                            {paymentData.payments
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

                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 shadow shadow-slate-200">
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
                          <CourseUpBoldDuotone className="w-6 h-6 text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {data && data.length > 0 && (
                    <PaymentHistoryChart paymentData={paymentData.payments} />
                  )}
                </>
              )}

              <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-2xl p-6 shadow-sm mt-4">
                <h2 className="text-base font-extrabold mb-4 px-1 flex items-center gap-2">
                  <HistoryBoldDuotone width={20} />
                  Гүйлгээний түүх
                </h2>
                <Table
                  className="test-history-table overflow-x-auto"
                  dataSource={paymentData.payments || []}
                  loading={loading}
                  rowKey={(record, index) => index}
                  pagination={{
                    pageSize: 10,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                  }}
                  locale={{
                    emptyText: (
                      <Empty
                        description="Төлбөрийн түүх олдсонгүй"
                        className="py-6"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    ),
                  }}
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
                              <img src="/qpay.png" width={40}></img>•
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
        return (
          <div>
            <h2 className="text-base font-bold mb-4 px-1.5"></h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <Spin />
              </div>
            ) : (
              <HistoryCard data={data} />
            )}
          </div>
        );
    }
  };

  return (
    <>
      <title>{session?.user?.name + " – Hire.mn"}</title>
      {contextHolder}
      <ChargeModal
        isOpen={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
      />
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>
      <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pt-8 md:pt-12 pb-8 z-[3]">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full relative p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-main/5"></div>
            <div className="absolute top-0 right-0 w-60 h-60">
              <Image
                src="/brain-home.png"
                width={128}
                height={128}
                alt="Brain decoration"
                className="w-full h-full object-contain opacity-10"
              />
            </div>

            <div className="relative flex items-center gap-4 sm:gap-5">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative min-w-20 min-h-20 w-20 h-20 sm:w-24 sm:h-24 sm:min-w-24 sm:min-h-24 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                  {session?.user?.profile ? (
                    <img
                      src={session?.user?.profile}
                      alt={session?.user?.name || "Profile"}
                      className="w-full h-full object-cover rounded-full"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent pt-1.5 flex items-center justify-center">
                      {session?.user?.name?.[0]}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="font-extrabold text-xl bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {session?.user?.role === 30
                    ? session.user.name
                    : session.user.firstname}
                </div>
                <div className="-mt-0.5 sm:mt-0 flex items-center gap-2 text-gray-700">
                  <span className="font-medium">{session?.user?.email}</span>
                </div>
              </div>
            </div>
          </div>
          {session?.user?.role === 30 && (
            <div className="w-full lg:w-2/3 relative p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
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
                        {userData?.wallet.toLocaleString()}₮
                        <button
                          onClick={refreshBalance}
                          disabled={isRefreshing}
                          className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                          title="Үлдэгдэл шинэчлэх"
                        >
                          <RefreshCircleBoldDuotone
                            width={18}
                            height={18}
                            className={`text-main -mt-0.5 ${
                              isRefreshing ? "animate-spin opacity-50" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
          )}
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-3 shadow shadow-slate-200 mt-4">
          <div className="flex flex-wrap gap-2">
            {menuItems.map((item, index) => (
              <div
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  activeTab === item.key
                    ? "bg-gradient-to-r from-main/70 to-main/90 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {activeTab === item.key && (
                  <span className="font-semibold sm:hidden">{item.label}</span>
                )}
                <span className="hidden sm:block">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div>{renderContent()}</div>
      </div>
    </>
  );
};

export default Profile;
