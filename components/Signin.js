"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Button, Form, Input, Segmented, message } from "antd";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Card2BoldDuotone,
  KeyBoldDuotone,
  LetterBoldDuotone,
} from "solar-icons";

const Signin = () => {
  const router = useRouter();
  const [userType, setUserType] = useState("Шалгуулагч");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const handleSegmentChange = (value) => {
    setUserType(value);
    form.resetFields();
  };

  const googleSignIn = () => {
    signIn("google", { callbackUrl: "/me" });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        ...values,
        redirect: false,
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
      messageApi.error("Сервэртэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {contextHolder}
      <div
        className="flex sm:hidden justify-center cursor-pointer pt-20"
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
        Нэвтрэх
      </div>
      <div className="items-center shadow rounded-3xl px-8 pt-7 bg-white pb-3 sm:p-12 sm:pb-[24px] bg-white/70 backdrop-blur-md">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="flex gap-8 sm:gap-16 flex-col sm:flex-row">
            <div className="flex-col flex gap-5">
              <div
                className="flex sm:block justify-center cursor-pointer hidden"
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
              {userType === "Шалгуулагч" ? (
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
                    prefix={<LetterBoldDuotone width={18} height={18} />}
                    placeholder="И-мейл хаяг"
                    className="sm:w-[280px]"
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
                    prefix={<Card2BoldDuotone width={18} height={18} />}
                    placeholder="Регистрийн дугаар"
                    className="sm:w-[280px]"
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
                <Input
                  prefix={<KeyBoldDuotone width={18} height={18} />}
                  type="password"
                  placeholder="Нууц үг"
                  className="sm:w-[280px]"
                />
              </Form.Item>
              <div className="text-right underline">Нууц үг сэргээх</div>
              {userType === "Шалгуулагч" && (
                <>
                  <div className="font-semibold text-center py-5">Эсвэл</div>
                  <div
                    onClick={googleSignIn}
                    className="flex items-center gap-2 border border-neutral shadow-sm rounded-2xl cursor-pointer sm:px-8 py-2 justify-center"
                  >
                    <Image
                      src="/google.webp"
                      width={25}
                      height={25}
                      alt="Google Logo"
                    />
                    Google хаягаар нэвтрэх
                  </div>
                </>
              )}

              <Form.Item>
                <div className="flex items-center justify-end gap-6 pt-7">
                  <div
                    className="font-semibold cursor-pointer"
                    onClick={() => router.push("/auth/signup")}
                  >
                    Бүртгүүлэх
                  </div>
                  <Button htmlType="submit" loading={loading}>
                    Нэвтрэх
                  </Button>
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Signin;
