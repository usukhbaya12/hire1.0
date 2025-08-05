"use client";

import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import {
  Button,
  Form,
  Input,
  Segmented,
  message,
  Typography,
  Divider,
  Spin,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Card2BoldDuotone,
  KeyBoldDuotone,
  LetterBoldDuotone,
  ShieldKeyholeBoldDuotone,
  SquareAltArrowLeftBoldDuotone,
  LockKeyholeBoldDuotone,
} from "solar-icons";
import {
  sendPasswordResetCode,
  verifyPasswordResetCode,
  resetPassword as resetPasswordApi,
} from "@/app/api/main";
import Link from "next/link";

const { Title, Text } = Typography;

// This component uses useSearchParams, so it needs to be wrapped in Suspense
function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState("Шалгуулагч");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  // Password reset states
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState(0);
  const [resetEmail, setResetEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetForm] = Form.useForm();

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      form.setFieldsValue({ email });

      messageApi.success({
        content:
          "Амжилттай баталгаажлаа. Та бүртгүүлсэн нууц үгээ ашиглан нэвтэрнэ үү.",
        duration: 5,
      });
    }
  }, [searchParams, form, messageApi]);

  const handleSegmentChange = (value) => {
    setUserType(value);
    form.resetFields();
  };

  const googleSignIn = () => {
    signIn("google", { callbackUrl: "/me" });
  };

  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    const emailToUse = email.toLowerCase();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: emailToUse,
        password,
      });

      if (result?.error) {
        messageApi.error(result.error);
      } else {
        const intendedUrl = localStorage.getItem("intendedTestUrl");
        if (intendedUrl) {
          localStorage.removeItem("intendedTestUrl");
          router.push(intendedUrl);
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  // Password reset handlers
  const handleForgotPassword = () => {
    setResetStep(0);
    setIsResetMode(true);
    setVerificationCode("");
    resetForm.resetFields();
  };

  const handleBackToLogin = () => {
    setIsResetMode(false);
    setResetStep(0);
    setVerificationCode("");
    resetForm.resetFields();
  };

  const handleSendVerificationCode = async () => {
    try {
      await resetForm.validateFields(["email"]);
      const email = resetForm.getFieldValue("email");
      setResetLoading(true);

      const response = await sendPasswordResetCode(email.toLowerCase());

      if (response.success) {
        setResetEmail(email.toLowerCase());
        setResetStep(1);
        messageApi.success("Баталгаажуулах код илгээгдлээ.");
      } else {
        messageApi.error(response.message || "Код илгээхэд алдаа гарлаа");
      }
    } catch (error) {
      return;
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      messageApi.error("Баталгаажуулах кодоо оруулна уу.");
      return;
    }

    setResetLoading(true);
    try {
      const response = await verifyPasswordResetCode(
        verificationCode,
        resetEmail.toLowerCase()
      );

      if (response.success) {
        if (response.data) {
          setResetStep(2);
          messageApi.success("Код баталгаажлаа.");
        } else {
          messageApi.error("Баталгаажуулах код буруу байна.");
        }
      } else {
        messageApi.error(
          response.message || "Код баталгаажуулахад алдаа гарлаа."
        );
      }
    } catch (error) {
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetForm.validateFields(["newPassword", "confirmPassword"]);
      const newPassword = resetForm.getFieldValue("newPassword");
      const confirmPassword = resetForm.getFieldValue("confirmPassword");

      if (newPassword !== confirmPassword) {
        messageApi.error("Нууц үг тохирохгүй байна.");
        return;
      }

      setResetLoading(true);

      const response = await resetPasswordApi(
        resetEmail.toLowerCase(),
        newPassword
      );

      if (response.success) {
        messageApi.success("Нууц үг амжилттай шинэчлэгдлээ.");
        setIsResetMode(false);
        form.setFieldsValue({ email: resetEmail.toLowerCase() });
      } else {
        messageApi.error(
          response.message || "Нууц үг шинэчлэхэд алдаа гарлаа."
        );
      }
    } catch (error) {
      return;
    } finally {
      setResetLoading(false);
    }
  };

  const getResetProgressText = () => {
    switch (resetStep) {
      case 0:
        return "Нууц үг сэргээх";
      case 1:
        return "Нууц үг сэргээх";
      case 2:
        return "Нууц үг сэргээх";
      default:
        return "";
    }
  };

  const renderResetPasswordContent = () => {
    switch (resetStep) {
      case 0:
        return (
          <div className="relative md:min-w-[450px]">
            <div className="md:mt-5">
              <div className="flex items-center justify-between mb-6 px-6">
                <div
                  className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-primary transition-colors"
                  onClick={handleBackToLogin}
                >
                  <SquareAltArrowLeftBoldDuotone width={18} height={18} />
                  <span className="text-sm">Нэвтрэх</span>
                </div>
                <Text className="text-sm text-gray-500">
                  {getResetProgressText()}
                </Text>
              </div>

              <div className="text-center mb-6">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-main/20 mb-3">
                  <LetterBoldDuotone
                    width={24}
                    height={24}
                    className="text-main"
                  />
                </div>
                <div className="m-0 text-base font-bold">
                  И-мэйл хаягаа оруулна уу.
                </div>
                <Text className="text-gray-500 leading-4">
                  Таны и-мэйл хаяг руу баталгаажуулах код илгээх болно.
                </Text>
              </div>

              <Form
                form={resetForm}
                layout="vertical"
                className="max-w-sm mx-auto"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Зөв и-мэйл хаяг оруулна уу.",
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
                    placeholder="И-мэйл хаяг"
                    className="rounded-lg"
                  />
                </Form.Item>
                <Form.Item className="mb-0 pb-4">
                  <Button
                    className="grd-btn"
                    block
                    onClick={handleSendVerificationCode}
                    loading={resetLoading}
                  >
                    Код илгээх
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="relative md:min-w-[450px]">
            <div className="md:mt-5">
              <div className="flex items-center justify-between mb-6 px-6">
                <div
                  className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-primary transition-colors"
                  onClick={() => {
                    setResetStep(0);
                    setVerificationCode("");
                  }}
                >
                  <SquareAltArrowLeftBoldDuotone width={18} height={18} />
                  <span className="text-sm">Буцах</span>
                </div>
                <Text className="text-sm text-gray-500">
                  {getResetProgressText()}
                </Text>
              </div>

              <div className="text-center mb-6 px-6">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-main/20 mb-3">
                  <ShieldKeyholeBoldDuotone
                    width={24}
                    height={24}
                    className="text-main"
                  />
                </div>
                <div className="m-0 font-bold text-base">
                  Баталгаажуулах код
                </div>
                <div className="text-gray-500 mb-1 mt-2 leading-5">
                  <b>{resetEmail}</b> хаяг руу илгээсэн
                  <br />6 оронтой кодыг оруулна уу.
                </div>
                <Button
                  className="back-btn flex justify-center mx-auto mt-4"
                  onClick={() => handleSendVerificationCode()}
                  loading={resetLoading}
                >
                  Дахин код авах
                </Button>
              </div>

              <div className="max-w-sm mx-auto">
                <div className="flex justify-between gap-2 mb-6">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      id={`otp-${index}`}
                      key={index}
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg rounded-lg"
                      value={verificationCode[index] || ""}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length > 1) {
                          e.target.value = newValue[0];
                        }

                        const newCode = [...(verificationCode || "").split("")];
                        while (newCode.length < 6) newCode.push("");
                        newCode[index] = e.target.value;
                        setVerificationCode(newCode.join(""));

                        if (e.target.value && index < 5) {
                          document.getElementById(`otp-${index + 1}`).focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !verificationCode[index] &&
                          index > 0
                        ) {
                          document.getElementById(`otp-${index - 1}`).focus();
                        }
                      }}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <Button
                  block
                  onClick={handleVerifyCode}
                  loading={resetLoading}
                  className="mb-4 grd-btn"
                >
                  Баталгаажуулах
                </Button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="relative md:min-w-[450px]">
            <div className="md:mt-5">
              <div className="flex items-center justify-between mb-6 px-6">
                <div
                  className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-primary transition-colors"
                  onClick={() => {
                    setResetStep(1);
                    setVerificationCode("");
                  }}
                >
                  <SquareAltArrowLeftBoldDuotone width={18} height={18} />
                  <span className="text-sm">Буцах</span>
                </div>
                <Text className="text-sm text-gray-500">
                  {getResetProgressText()}
                </Text>
              </div>

              <div className="text-center mb-6">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-main/20 mb-3">
                  <LockKeyholeBoldDuotone
                    width={24}
                    height={24}
                    className="text-main"
                  />
                </div>
                <div className="m-0 text-base font-bold">
                  Шинэ нууц үг оруулах
                </div>
                <Text className="text-gray-500">
                  Та шинэ нууц үгээ оруулна уу.
                </Text>
              </div>

              <Form
                form={resetForm}
                layout="vertical"
                className="max-w-sm mx-auto"
              >
                <Form.Item
                  name="newPassword"
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
                  validateTrigger="onSubmit"
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
                  validateTrigger="onSubmit"
                >
                  <Input.Password
                    prefix={
                      <KeyBoldDuotone
                        width={18}
                        height={18}
                        className="text-gray-400"
                      />
                    }
                    placeholder="Нууц үг давтах"
                  />
                </Form.Item>
                <Form.Item className="mb-0">
                  <Button
                    className="mb-4 grd-btn"
                    block
                    onClick={handleResetPassword}
                    loading={resetLoading}
                  >
                    Нууц үг шинэчлэх
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      {contextHolder}
      <Link
        href="/"
        className="flex sm:hidden justify-center cursor-pointer pt-20"
      >
        <Image
          src="/hire-logo.png"
          alt="Hire logo"
          width={80}
          height={26}
          priority
          draggable={false}
        />
      </Link>
      <div className="font-extrabold text-xl sm:text-lg text-center sm:text-start sm:hidden pt-1 pb-5 bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent">
        {isResetMode ? "Нууц үг сэргээх" : "Нэвтрэх"}
      </div>
      <div className="items-center shadow shadow-slate-200 rounded-3xl px-8 pt-7 bg-white/90 pb-3 sm:p-12 sm:pb-[24px] backdrop-blur-md">
        {isResetMode ? (
          <div className="flex flex-col sm:-mt-8 sm:-mx-4">
            {renderResetPasswordContent()}
          </div>
        ) : (
          <div className="flex gap-8 sm:gap-16 flex-col sm:flex-row">
            <div className="flex-col flex gap-5">
              <Link
                href="/"
                className="flex sm:block justify-center cursor-pointer hidden"
              >
                <Image
                  src="/hire-logo.png"
                  alt="Hire logo"
                  width={80}
                  height={26}
                  priority
                  draggable={false}
                />
              </Link>
              <div className="font-bold text-lg text-center sm:text-start hidden sm:block">
                Нэвтрэх
              </div>
              <div className="font-semibold flex justify-center sm:justify-start">
                <Segmented
                  options={["Шалгуулагч", "Байгууллага"]}
                  onChange={handleSegmentChange}
                />
              </div>
              <div className="max-w-72 text-center sm:text-start hidden sm:block leading-5">
                Та өөрийн нэвтрэх мэдээллийг оруулан{" "}
                <span className="font-bold">Нэвтрэх</span> товчийг дарна уу.
              </div>
            </div>
            <div className="md:pt-7">
              <Form form={form} layout="vertical" onFinish={onFinish}>
                {userType === "Шалгуулагч" ? (
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Зөв и-мэйл хаяг оруулна уу.",
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
                      placeholder="И-мэйл хаяг"
                      className="sm:w-[280px] rounded-lg"
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    name="email"
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
                      className="sm:w-[280px] rounded-lg"
                    />
                  </Form.Item>
                )}

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Нууц үгээ оруулна уу.",
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
                    placeholder="Нууц үг"
                    className="sm:w-[280px] rounded-lg"
                  />
                </Form.Item>
                <div
                  className="text-right text-primary cursor-pointer hover:underline"
                  onClick={handleForgotPassword}
                >
                  Нууц үг сэргээх
                </div>
                {userType === "Шалгуулагч" && (
                  <>
                    <Divider className="my-6">
                      <span className="text-gray-500">Эсвэл</span>
                    </Divider>
                    <div
                      onClick={googleSignIn}
                      className="flex items-center gap-3 border border-gray-200 shadow shadow-slate-200 rounded-lg cursor-pointer sm:px-8 py-3 justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Image
                        src="/google.webp"
                        width={22}
                        height={22}
                        alt="Google Logo"
                      />
                      <span className="font-medium">
                        Google хаягаар нэвтрэх
                      </span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-end gap-6 pt-7 pb-4">
                  <Link
                    href="/auth/signup"
                    className="font-semibold cursor-pointer hover:text-primary transition-colors underline hover:underline"
                  >
                    Бүртгүүлэх
                  </Link>

                  <Button
                    htmlType="submit"
                    loading={loading}
                    className="grd-btn"
                  >
                    Нэвтрэх
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SigninFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Spin size="large" />
      <div className="mt-4 text-gray-600">Уншиж байна...</div>
    </div>
  );
}

export default function Signin() {
  return (
    <Suspense fallback={<SigninFallback />}>
      <SigninForm />
    </Suspense>
  );
}
