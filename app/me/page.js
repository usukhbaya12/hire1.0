"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card2BoldDuotone,
  KeyBoldDuotone,
  PhoneCallingRoundedBoldDuotone,
  RoundDoubleAltArrowRightBoldDuotone,
  SuitcaseBoldDuotone,
  UserIdBoldDuotone,
  VerifiedCheckBoldDuotone,
  Wallet2BoldDuotone,
} from "solar-icons";
import Image from "next/image";
import { getUserTestHistory } from "../api/assessment";
import { message, Form, Spin, Input, Button } from "antd";
import HistoryCard from "@/components/History";

const Profile = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("history");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(
    session?.user?.wallet || 0
  );
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getUserTestHistory(0);
        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("GET / Алдаа гарлаа.", error);
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      label: "Хувийн мэдээлэл",
    },
    {
      key: "password",
      icon: <KeyBoldDuotone width={20} height={20} />,
      label: "Нууц үг солих",
    },
  ];

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
                    layout="vertical"
                    initialValues={{
                      organizationName: session.user.organizationName,
                      organizationPhone: session.user.organizationPhone,
                      registerNumber: session.user.organizationRegisterNumber,
                    }}
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
                  </Form>
                </div>

                <div className="space-y-4 lg:w-2/5">
                  <h2 className="text-base font-bold">Ажилтны мэдээлэл</h2>
                  <Form
                    layout="vertical"
                    initialValues={{
                      lastname: session.user.lastname,
                      firstname: session.user.firstname,
                      position: session.user.position,
                      phone: session.user.phone,
                    }}
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
                    <Button type="submit" className="w-full">
                      Хадгалах
                    </Button>
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
                      lastname: session.user.lastname,
                      firstname: session.user.firstname,
                      email: session.user.email,
                      phone: session.user.phone,
                    }}
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
                    <Button type="submit" className="w-full">
                      Хадгалах
                    </Button>
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
                <Form layout="vertical">
                  <Form.Item
                    name="currentPassword"
                    label="Одоогийн нууц үг"
                    rules={[{ required: true }]}
                  >
                    <Input.Password className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    label="Шинэ нууц үг"
                    rules={[
                      { required: true },
                      { min: 8, message: "Хамгийн багадаа 8 тэмдэгт" },
                    ]}
                  >
                    <Input.Password className="rounded-xl" />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Шинэ нууц үгээ давтах"
                    rules={[{ required: true }]}
                  >
                    <Input.Password className="rounded-xl" />
                  </Form.Item>

                  <Button type="submit" className="w-full">
                    Нууц үг солих
                  </Button>
                </Form>
              </div>
            </div>
          </div>
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
      {contextHolder}
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>
      <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pt-8 md:pt-12 pb-8 z-[3]">
        <div className="flex flex-col md:flex-row gap-5">
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
                <div className="relative min-w-16 min-h-16 sm:min-w-24 sm:min-h-24 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent pt-1.5">
                    {session?.user?.profile ? (
                      <img src={session?.user?.profile}></img>
                    ) : (
                      session?.user?.name?.[0]
                    )}
                  </div>
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
            <div className="w-full md:w-1/2 relative p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
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
                  <div>
                    <div className="-mt-0.5 sm:mt-0 flex items-center gap-2 text-gray-700">
                      <span className="font-medium">Үлдэгдэл</span>
                    </div>
                    <div className="font-extrabold text-xl bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {session?.user?.wallet.toLocaleString()}₮
                    </div>
                  </div>
                </div>
                <button className="relative group pl-5 pr-3.5 py-2 bg-gradient-to-br from-main to-secondary rounded-xl text-white font-bold shadow-lg shadow-main/20 hover:shadow-main/30 transition-all duration-300 hover:scale-105 active:scale-95">
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-1">
                    <span>Цэнэглэх</span>
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
