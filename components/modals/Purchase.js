"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, InputNumber, Modal, Divider, message } from "antd";
import {
  CalculatorMinimalisticBoldDuotone,
  DangerTriangleBoldDuotone,
  Wallet2BoldDuotone,
  RefreshCircleBoldDuotone,
} from "solar-icons";
import { getCurrentUser } from "@/app/api/main";
import { LoadingOutlined } from "@ant-design/icons";

const PurchaseModal = ({
  isOpen,
  onClose,
  confirmLoading,
  onPurchase,
  testPrice,
  remaining,
}) => {
  const [form] = Form.useForm();
  const [quantity, setQuantity] = useState(1);
  const [userData, setUserData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [fetchError, setFetchError] = useState(false);

  const fetchUserData = async () => {
    setIsRefreshing(true);
    setFetchError(false);
    try {
      const response = await getCurrentUser();
      if (response.success) {
        setUserData(response.data);
        setBalance(response.data.wallet || 0);
        return response.data;
      } else {
        setFetchError(true);
        message.error("Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа");
      }
      return null;
    } catch (error) {
      console.error("GET / Алдаа гарлаа.", error);
      setFetchError(true);
      message.error("Серверт холбогдоход алдаа гарлаа");
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };

  const refreshBalance = async () => {
    await fetchUserData();
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const calculateTotal = (qty) => {
    return qty * testPrice;
  };

  const handleQuantityChange = (value) => {
    setQuantity(value || 0);
  };

  const handleSubmit = async (values) => {
    // First refresh the balance to make sure we have the latest data
    await refreshBalance();

    // Check if user can afford purchase
    if (calculateTotal(values.count) > balance) {
      message.error("Үлдэгдэл хүрэлцэхгүй байна.");
      return;
    }

    // Call the parent onPurchase function with the form values
    onPurchase(values);
  };

  return (
    <Modal
      title="Тест худалдаж авах"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
      closeIcon={
        <div className="bg-gray-100 hover:bg-gray-200 p-1 rounded-full transition-colors">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      }
    >
      <div className="relative group w-full mt-4">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-main to-secondary rounded-full blur opacity-40 group-hover:opacity-40 transition duration-300"></div>
        <div className="relative w-full p-3 px-4 rounded-full flex items-center gap-3 justify-between bg-gradient-to-br from-main/70 to-secondary/70">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-main shadow-md">
              <Wallet2BoldDuotone width={24} />
            </div>
            <div>
              <p className="text-white">Үлдэгдэл</p>
              <p className="text-xl text-white font-extrabold">
                {balance?.toLocaleString()}₮
              </p>
            </div>
          </div>
          <button
            onClick={refreshBalance}
            disabled={isRefreshing}
            className="flex items-center justify-center rounded-full transition-colors"
            title="Үлдэгдэл шинэчлэх"
          >
            <RefreshCircleBoldDuotone
              width={24}
              height={24}
              className={`text-white -mt-0.5 ${
                isRefreshing ? "animate-spin opacity-50" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-4 bg-gray-50 p-2 rounded-xl px-4 justify-between flex items-center shadow shadow-slate-200">
        Үлдэгдэл эрх:<div className="font-bold text-main">{remaining}</div>
      </div>

      {fetchError && (
        <div className="mt-4 text-red-500 text-sm flex items-center gap-2 bg-red-50 p-2 rounded-lg">
          <DangerTriangleBoldDuotone width={18} />
          Үлдэгдэл мэдээлэл авахад алдаа гарлаа. Дахин оролдоно уу.
        </div>
      )}

      <div className="mt-4 bg-gray-50 px-4 py-3 pb-4 rounded-xl shadow shadow-slate-200">
        <div className="flex items-center gap-2">
          <CalculatorMinimalisticBoldDuotone size={16} className="text-main" />
          <div className="font-semibold text-gray-700 pt-0.5">Тооцоолол</div>
        </div>
        <Divider />

        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            className="fnp"
            name="count"
            label={
              <span className="font-medium text-gray-700">Авах эрхийн тоо</span>
            }
            rules={[
              { required: true, message: "Эрхийн тоог оруулна уу." },
              { type: "number", min: 1, message: "1-ээс их тоо оруулна уу." },
            ]}
          >
            <InputNumber
              min={1}
              value={1}
              className="w-full"
              onChange={handleQuantityChange}
            />
          </Form.Item>
          <Divider />
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Тестийн үнэ:</span>
              <span className="font-medium">{testPrice.toLocaleString()}₮</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Эрхийн тоо:</span>
              <span className="font-medium">x{quantity}</span>
            </div>
            <Divider className="my-2" />
            <div className="flex justify-between">
              <span className="font-bold">Нийт дүн:</span>
              <span className="font-bold text-main">
                {calculateTotal(quantity).toLocaleString()}₮
              </span>
            </div>
          </div>
        </Form>
      </div>

      {calculateTotal(quantity) > balance && (
        <div className="mt-4 text-red-500 text-sm flex items-center gap-2 px-1">
          <DangerTriangleBoldDuotone width={18} />
          Үлдэгдэл хүрэлцэхгүй байна.
        </div>
      )}

      <div className="flex justify-end gap-2 mt-6 pb-1">
        <div className="relative group cursor-pointer" onClick={onClose}>
          <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-200/50 to-gray-500/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gradient-to-br from-gray-400/30 to-gray-300/20 rounded-full flex items-center justify-center border border-gray-500/10">
            <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-gray-500 to-gray-600 bg-clip-text text-transparent py-1 px-6">
              Буцах
            </div>
          </div>
        </div>
        <div
          className={`relative group ${
            calculateTotal(quantity) > balance || isRefreshing || fetchError
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer"
          }`}
          onClick={
            calculateTotal(quantity) > balance ||
            isRefreshing ||
            fetchError ||
            confirmLoading
              ? undefined
              : () => form.submit()
          }
        >
          <div
            className={`absolute -inset-0.5 bg-gradient-to-br ${
              calculateTotal(quantity) > balance || isRefreshing || fetchError
                ? "from-gray-400/50 to-gray-500/70"
                : "from-main/50 to-main/70"
            } rounded-full blur opacity-30 ${
              calculateTotal(quantity) > balance || isRefreshing || fetchError
                ? ""
                : "group-hover:opacity-40"
            } transition duration-300`}
          ></div>

          <div
            className={`relative bg-gradient-to-br ${
              calculateTotal(quantity) > balance || isRefreshing || fetchError
                ? "from-gray-300/30 to-gray-400/20"
                : "from-main/30 to-secondary/20"
            } rounded-full flex items-center justify-center border ${
              calculateTotal(quantity) > balance || isRefreshing || fetchError
                ? "border-gray-300/10"
                : "border-main/10"
            }`}
          >
            <div
              className={`flex items-center gap-1.5 font-extrabold ${
                calculateTotal(quantity) > balance || isRefreshing || fetchError
                  ? "bg-gradient-to-br from-gray-400 to-gray-500 bg-clip-text text-transparent"
                  : "bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent"
              } py-1 px-8 justify-center`}
            >
              {confirmLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <LoadingOutlined
                      style={{
                        fontSize: 16,
                        color:
                          calculateTotal(quantity) > balance ||
                          isRefreshing ||
                          fetchError
                            ? "#888"
                            : "white",
                      }}
                      spin
                    />
                  </div>
                  Худалдаж авах
                </div>
              ) : (
                "Худалдаж авах"
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PurchaseModal;
