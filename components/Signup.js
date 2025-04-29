"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button, Form, Input, Segmented, message } from "antd";
import { useRouter } from "next/navigation";
import { signup, emailVerify } from "@/app/api/main";
import {
  Card2BoldDuotone,
  KeyBoldDuotone,
  LetterBoldDuotone,
  PhoneCallingRoundedBoldDuotone,
  SuitcaseBoldDuotone,
  UserIdBoldDuotone,
  CheckCircleBoldDuotone,
  LetterOpenedBoldDuotone,
  RefreshCircleBoldDuotone,
} from "solar-icons";
import { signIn } from "next-auth/react";

const Signup = () => {
  const router = useRouter();
  const [isOrganization, setIsOrganization] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [form] = Form.useForm();

  const onSegmentedChange = (value) =>
    setIsOrganization(value === "Байгууллага");

  const onFinish = async (values) => {
    setLoading(true);
    const { passwordverify, ...data } = values;

    if (data.email) {
      data.email = data.email.toLowerCase();
      setUserEmail(data.email);
    }

    try {
      const response = await signup(data);
      if (response.success) {
        setIsSignupComplete(true);
      } else {
        messageApi.error(response.data.message);
      }
    } catch (error) {
      console.error("Бүртгүүлэхэд алдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
      messageApi.error("И-мейл хаяг олдсонгүй");
      return;
    }

    setResendLoading(true);
    try {
      const response = await emailVerify(userEmail);
      if (response.success) {
        messageApi.success("Баталгаажуулах мейл дахин илгээгдлээ.");
      } else {
        messageApi.error(response.message || "Мейл илгээхэд алдаа гарлаа");
      }
    } catch (error) {
      console.error("Дахин илгээхэд алдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setResendLoading(false);
    }
  };

  if (isSignupComplete) {
    return (
      <div className="flex flex-col min-h-screen sm:items-center sm:justify-center">
        {contextHolder}
        <div className="flex sm:hidden justify-center pt-16">
          <Image
            src="/hire-logo.png"
            alt="Hire logo"
            width={80}
            height={26}
            priority
            draggable={false}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>
        <div className="w-full max-w-md mx-auto px-6">
          <div className="font-extrabold text-xl sm:text-2xl text-center pt-1 pb-5 sm:hidden bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent">
            Бүртгүүлэх
          </div>

          <div className="bg-white/70 backdrop-blur-md shadow-md shadow-slate-200 rounded-3xl px-8 py-12 sm:p-12">
            <div className="hidden sm:flex justify-center mb-8">
              <Image
                src="/hire-logo.png"
                alt="Hire logo"
                width={80}
                height={26}
                priority
                draggable={false}
                className="cursor-pointer"
                onClick={() => router.push("/")}
              />
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <CheckCircleBoldDuotone width={40} height={40} />
              </div>

              <div className="text-center space-y-3">
                <div className="text-lg font-bold">Бүртгэл амжилттай</div>
                <div className="text-gray-600 max-w-xs">
                  Таны <span className="font-semibold">{userEmail}</span> хаяг
                  руу баталгаажуулах холбоос илгээгдлээ.
                </div>
              </div>

              <div className="w-full space-y-4 pt-3">
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="w-full grd-btn"
                >
                  Нэвтрэх
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white/70 text-gray-500">
                      Эсвэл
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    onClick={handleResendEmail}
                    loading={resendLoading}
                    className="grd-btn"
                  >
                    Мейл ирээгүй юу? Дахин илгээх
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const googleSignIn = () => {
    signIn("google", { callbackUrl: "/me" });
  };

  return (
    <div className="flex flex-col">
      {contextHolder}
      <div
        className="flex sm:hidden justify-center cursor-pointer pt-16"
        onClick={() => router.push("/")}
      >
        <Image
          src="/hire-logo.png"
          alt="Hire logo"
          width={80}
          height={26}
          priority
          draggable={false}
        />
      </div>
      <div className="font-extrabold text-xl sm:text-lg text-center sm:text-start sm:hidden pt-1 pb-5 bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent">
        Бүртгүүлэх
      </div>
      <div className="items-center bg-white shadow-md rounded-3xl px-8 pt-7 pb-3 sm:p-12 sm:pb-[24px] bg-white/70 backdrop-blur-md">
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <div className="flex sm:gap-20 flex-col sm:flex-row">
            <div className="flex-col flex gap-5">
              <div
                className="hidden sm:block cursor-pointer"
                onClick={() => router.push("/")}
              >
                <Image
                  src="/hire-logo.png"
                  alt="Hire logo"
                  width={80}
                  height={26}
                  priority
                  draggable={false}
                />
              </div>
              <div className="font-bold text-lg text-center sm:text-start hidden sm:block">
                Бүртгүүлэх
              </div>
              <div className="font-semibold flex justify-center sm:justify-start">
                <Segmented
                  options={["Шалгуулагч", "Байгууллага"]}
                  onChange={onSegmentedChange}
                />
              </div>
              <div className="gap-2 hidden sm:flex">
                <div>Бүртгэлтэй юу?</div>
                <div
                  className="font-semibold underline cursor-pointer"
                  onClick={() => router.push("/auth/signin")}
                >
                  Нэвтрэх
                </div>
              </div>
              {!isOrganization ? (
                <div className="min-w-64 pb-6 sm:pb-0">
                  <div
                    onClick={googleSignIn}
                    className="flex items-center bg-white gap-3 border border-gray-200 shadow shadow-slate-200 rounded-lg cursor-pointer sm:px-8 py-3 justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Image
                      src="/google.webp"
                      width={22}
                      height={22}
                      alt="Google Logo"
                    />
                    <span className="font-medium">
                      Google хаягаар бүртгүүлэх
                    </span>
                  </div>
                </div>
              ) : (
                <div className="max-w-64 text-center sm:text-start hidden sm:block leading-5">
                  Та өөрийн мэдээллийг оруулан{" "}
                  <span className="font-bold">Бүртгүүлэх</span> товчийг дарна
                  уу.
                </div>
              )}
            </div>
            <div className="flex sm:gap-8 flex-col sm:flex-row">
              <div
                className={`pt-0 ${isOrganization ? "md:pt-14" : "md:pt-24"}`}
              >
                {!isOrganization ? (
                  <>
                    <Form.Item
                      name="lastname"
                      rules={[
                        {
                          required: true,
                          message: "Овгоо оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
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
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="firstname"
                      rules={[
                        {
                          required: true,
                          message: "Нэрээ оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
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
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Зөв и-мейл хаяг оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
                    >
                      <Input
                        prefix={
                          <LetterBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="И-мейл хаяг"
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <div className="font-semibold pb-4 text-center pt-6 sm:pt-0">
                      Байгууллагын мэдээлэл
                    </div>
                    <Form.Item
                      name="organizationName"
                      rules={[
                        {
                          required: true,
                          message: "Байгууллагын нэрээ оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
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
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="organizationRegisterNumber"
                      rules={[
                        {
                          required: true,
                          message: "Зөв регистрийн дугаар оруулна уу.",
                        },
                        {
                          pattern: /^\d{7}$/,
                          message: "Зөв регистрийн дугаар оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
                    >
                      <Input
                        prefix={
                          <Card2BoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="Регистрийн дугаар"
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="organizationPhone"
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
                            className="text-gray-400"
                          />
                        }
                        placeholder="Утасны дугаар"
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Нууц үгээ оруулна уу.",
                        },
                        {
                          min: 6,
                          message: "Багадаа 6 тэмдэгт оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
                    >
                      <Input
                        prefix={
                          <KeyBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        type="password"
                        placeholder="Нууц үг"
                        className="sm:w-[240px]"
                        autoComplete="new-password"
                      />
                    </Form.Item>
                    <Form.Item
                      name="passwordverify"
                      rules={[
                        {
                          required: true,
                          message: "Нууц үгээ оруулна уу.",
                        },
                        {
                          validator: (_, value) =>
                            value && value === form.getFieldValue("password")
                              ? Promise.resolve()
                              : Promise.reject("Нууц үг тохирохгүй байна."),
                        },
                      ]}
                      validateTrigger="onSubmit"
                    >
                      <Input
                        prefix={
                          <KeyBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        type="password"
                        placeholder="Нууц үгээ давтах"
                        className="sm:w-[240px]"
                        autoComplete="new-password"
                      />
                    </Form.Item>
                  </>
                )}
              </div>
              <div
                className={`pt-0 ${isOrganization ? "md:pt-14" : "md:pt-24"}`}
              >
                {!isOrganization ? (
                  <>
                    <Form.Item
                      name="phone"
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
                            className="text-gray-400"
                          />
                        }
                        placeholder="Утасны дугаар"
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Нууц үгээ оруулна уу.",
                        },
                        {
                          min: 6,
                          message: "Багадаа 6 тэмдэгт оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
                    >
                      <Input
                        prefix={
                          <KeyBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        type="password"
                        placeholder="Нууц үг"
                        className="sm:w-[240px]"
                        autoComplete="new-password"
                      />
                    </Form.Item>
                    <Form.Item
                      name="passwordverify"
                      rules={[
                        {
                          required: true,
                          message: "Нууц үгээ оруулна уу.",
                        },
                        {
                          validator: (_, value) =>
                            value && value === form.getFieldValue("password")
                              ? Promise.resolve()
                              : Promise.reject("Нууц үг тохирохгүй байна."),
                        },
                      ]}
                      validateTrigger="onSubmit"
                    >
                      <Input
                        prefix={
                          <KeyBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        type="password"
                        placeholder="Нууц үгээ давтах"
                        className="sm:w-[240px]"
                        autoComplete="new-password"
                      />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <div className="font-semibold pb-4 text-center">
                      Ажилтны мэдээлэл
                    </div>
                    <Form.Item
                      name="lastname"
                      rules={[
                        {
                          required: true,
                          message: "Овгоо оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
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
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="firstname"
                      rules={[
                        {
                          required: true,
                          message: "Нэрээ оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
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
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="position"
                      rules={[
                        {
                          required: true,
                          message: "Албан тушаалаа оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
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
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Зөв и-мейл хаяг оруулна уу.",
                        },
                      ]}
                      validateTrigger="onSubmit"
                    >
                      <Input
                        prefix={
                          <LetterBoldDuotone
                            width={18}
                            height={18}
                            className="text-gray-400"
                          />
                        }
                        placeholder="И-мейл хаяг"
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                    <Form.Item
                      name="phone"
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
                            className="text-gray-400"
                          />
                        }
                        placeholder="Утасны дугаар"
                        className="sm:w-[240px]"
                      />
                    </Form.Item>
                  </>
                )}
                <Form.Item className="flex justify-end">
                  <Button
                    htmlType="submit"
                    loading={loading}
                    className="grd-btn"
                  >
                    Бүртгүүлэх
                  </Button>
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </div>
      <div className="flex gap-2 justify-center sm:justify-start sm:hidden pt-5 pb-10">
        <div>Бүртгэлтэй юу?</div>
        <div
          className="font-semibold underline cursor-pointer"
          onClick={() => router.push("/auth/signin")}
        >
          Нэвтрэх
        </div>
      </div>
    </div>
  );
};
export default Signup;
