"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Form, Input, Button, message, Spin, Divider } from "antd";
import {
  UserIdBoldDuotone,
  Card2BoldDuotone,
  PhoneCallingRoundedBoldDuotone,
  SuitcaseBoldDuotone,
  KeyBoldDuotone,
  LetterBoldDuotone,
  Buildings2BoldDuotone,
} from "solar-icons";
import {
  updateUserProfile,
  getCurrentUser,
  updatePassword,
} from "@/app/api/main";

const Account = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState("information");
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await getCurrentUser();
      if (response.success) {
        setUserData(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("GET / Алдаа гарлаа..", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа..");
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchUserData();
      } catch (error) {
        console.error("GET / Алдаа гарлаа..", error);
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа..");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!session) return null;

  const handleUpdateInfo = async (values) => {
    if (!session.user.id) {
      messageApi.error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
      return;
    }

    setUpdateLoading(true);
    try {
      let userData = {};

      if (session.user.role === 30) {
        userData = {
          organizationName: values.organizationName,
          organizationPhone: values.organizationPhone,
          firstname: values.firstname,
          lastname: values.lastname,
          position: values.position,
          phone: values.phone,
        };
      } else {
        userData = {
          firstname: values.firstname,
          lastname: values.lastname,
          phone: values.phone,
        };
      }

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
        fetchUserData();
      } else {
        messageApi.error(
          response.message || "Мэдээлэл шинэчлэхэд алдаа гарлаа."
        );
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      messageApi.error("Мэдээлэл шинэчлэхэд алдаа гарлаа.");
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
      const res = await updatePassword(
        values.currentPassword,
        values.confirmPassword
      );
      if (res.success) {
        messageApi.success("Нууц үг амжилттай шинэчлэгдлээ.");
        passwordForm.resetFields();
      } else {
        messageApi.error(res.message || "Нууц үг шинэчлэхэд алдаа гарлаа..");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const menuItems = [
    {
      name: "Мэдээлэл",
      key: "information",
      icon: <UserIdBoldDuotone width={20} height={20} className="text-main" />,
    },
    {
      name: "Нууц үг солих",
      key: "password",
      icon: <KeyBoldDuotone width={20} height={20} className="text-main" />,
    },
  ];
  const renderSkeletonContent = () => {
    if (activeTab === "information") {
      return (
        <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
          <h2 className="hidden md:flex text-base font-extrabold px-1 items-center gap-2 mb-6">
            <UserIdBoldDuotone width={20} height={20} />
            Хувийн мэдээлэл
          </h2>

          {session?.user?.role === 30 ? (
            <>
              <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 mb-6 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <div className="h-5 bg-gray-200 rounded-lg w-1/4"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <div className="h-5 bg-gray-200 rounded-lg w-1/4"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <div className="h-10 bg-gray-200 rounded-full w-32"></div>
              </div>
            </>
          ) : (
            <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 w-full md:w-1/2 animate-pulse">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                  <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                </div>

                <div className="flex justify-end mt-4">
                  <div className="h-10 bg-gray-200 rounded-full w-32"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
          <h2 className="hidden md:flex text-base font-extrabold px-1 items-center gap-2 mb-6">
            <KeyBoldDuotone width={20} height={20} />
            Нууц үг солих
          </h2>

          <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 w-full md:w-1/2 animate-pulse">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
              </div>

              <div className="flex justify-end mt-4">
                <div className="h-10 bg-gray-200 rounded-full w-32"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonContent();
    }

    switch (activeTab) {
      case "information":
        return (
          <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
            <h2 className="hidden md:flex text-base font-extrabold px-1 items-center gap-2 mb-6">
              <UserIdBoldDuotone width={20} height={20} />
              Хувийн мэдээлэл
            </h2>

            {session.user.role === 30 ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateInfo}
                initialValues={{
                  // Organization info
                  organizationName: userData?.organizationName,
                  organizationPhone: userData?.organizationPhone,
                  registerNumber: userData?.organizationRegisterNumber,
                  lastname: userData?.lastname,
                  firstname: userData?.firstname,
                  position: userData?.position,
                  phone: userData?.phone,
                  email: userData?.email,
                }}
              >
                <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 mb-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2 text-main">
                    <Buildings2BoldDuotone
                      width={16}
                      height={16}
                      className="text-main"
                    />
                    Байгууллага
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
                    <Form.Item
                      className="fnp"
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
                        prefix={
                          <UserIdBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="Байгууллагын нэр"
                      />
                    </Form.Item>

                    <Form.Item
                      name="registerNumber"
                      label="Регистрийн дугаар"
                      className="fnp"
                    >
                      <Input
                        disabled
                        prefix={
                          <Card2BoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="Регистрийн дугаар"
                      />
                    </Form.Item>

                    <Form.Item
                      className="fnp"
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
                    >
                      <Input
                        prefix={
                          <PhoneCallingRoundedBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="Утасны дугаар"
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6">
                  <h2 className="font-bold mb-4 flex items-center gap-2 text-main">
                    <UserIdBoldDuotone
                      width={16}
                      height={16}
                      className="text-main"
                    />
                    Ажилтан
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-2">
                    <Form.Item name="email" label="И-мейл хаяг" className="fnp">
                      <Input
                        disabled
                        prefix={
                          <LetterBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="И-мэйл хаяг"
                      />
                    </Form.Item>

                    <Form.Item
                      className="fnp"
                      name="lastname"
                      label="Овог"
                      rules={[{ required: true, message: "Овгоо оруулна уу." }]}
                    >
                      <Input
                        prefix={
                          <UserIdBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="Овог"
                      />
                    </Form.Item>

                    <Form.Item
                      className="fnp"
                      name="firstname"
                      label="Нэр"
                      rules={[{ required: true, message: "Нэрээ оруулна уу." }]}
                    >
                      <Input
                        prefix={
                          <UserIdBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="Нэр"
                      />
                    </Form.Item>

                    <Form.Item
                      className="fnp"
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
                        prefix={
                          <SuitcaseBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="Албан тушаал"
                      />
                    </Form.Item>

                    <Form.Item
                      className="fnp"
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
                            className="text-gray-400"
                          />
                        }
                        placeholder="Утасны дугаар"
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    htmlType="submit"
                    loading={updateLoading}
                    className="grd-btn"
                  >
                    Хадгалах
                  </Button>
                </div>
              </Form>
            ) : (
              <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 w-full md:w-1/2">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleUpdateInfo}
                  initialValues={{
                    lastname: userData?.lastname,
                    firstname: userData?.firstname,
                    phone: userData?.phone,
                  }}
                >
                  <Form.Item
                    name="lastname"
                    label="Овог"
                    rules={[{ required: true, message: "Овгоо оруулна уу." }]}
                  >
                    <Input
                      prefix={
                        <UserIdBoldDuotone
                          width={18}
                          height={18}
                          className="text-gray-400"
                        />
                      }
                      placeholder="Овог"
                    />
                  </Form.Item>

                  <Form.Item
                    name="firstname"
                    label="Нэр"
                    rules={[{ required: true, message: "Нэрээ оруулна уу." }]}
                  >
                    <Input
                      prefix={
                        <UserIdBoldDuotone
                          width={18}
                          height={18}
                          className="text-gray-400"
                        />
                      }
                      placeholder="Нэр"
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
                          className="text-gray-400"
                        />
                      }
                      placeholder="Утасны дугаар"
                    />
                  </Form.Item>
                  <div className="flex justify-end mt-4">
                    <Button
                      htmlType="submit"
                      loading={updateLoading}
                      className="grd-btn"
                    >
                      Хадгалах
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </div>
        );

      case "password":
        return (
          <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
            <h2 className="hidden md:flex text-base font-extrabold px-1 items-center gap-2 mb-6">
              <KeyBoldDuotone width={20} height={20} />
              Нууц үг солих
            </h2>

            <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 w-full md:w-1/2">
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordUpdate}
              >
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
                  <Input.Password
                    prefix={
                      <KeyBoldDuotone
                        width={18}
                        height={18}
                        className="text-gray-400"
                      />
                    }
                    placeholder="Одоогийн нууц үг"
                  />
                </Form.Item>

                <Form.Item
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
                  <Input.Password
                    prefix={
                      <KeyBoldDuotone
                        width={18}
                        height={18}
                        className="text-gray-400"
                      />
                    }
                    placeholder="Шинэ нууц үг"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Шинэ нууц үгээ давтах"
                  rules={[
                    {
                      required: true,
                      message: "Нууц үгээ давтан оруулна уу.",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Нууц үг тохирохгүй байна.")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={
                      <KeyBoldDuotone
                        width={18}
                        height={18}
                        className="text-gray-400"
                      />
                    }
                    placeholder="Шинэ нууц үгээ давтах"
                  />
                </Form.Item>

                <div className="flex justify-end mt-4">
                  <Button
                    htmlType="submit"
                    loading={updateLoading}
                    className="grd-btn"
                  >
                    Нууц үг солих
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <title>Hire.mn</title>
      {contextHolder}
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>
      <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pt-8 md:pt-12 pb-16 z-[3]">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/5 space-y-4">
            <div className="relative p-6 bg-white/40 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
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
                    {session?.user?.name}
                  </div>
                  <div className="text-gray-700 mt-1">
                    <span className="font-medium">{session?.user?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md rounded-3xl p-2 sm:px-4 sm:py-5 shadow shadow-slate-200 h-fit">
              <div className="flex md:flex-col gap-1">
                {menuItems.map((item) => (
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
                        {item.name}
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
    </>
  );
};

export default Account;
