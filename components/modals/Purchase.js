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

        <Form form={form} onFinish={handleSubmit} initialValues={{ count: 1 }}>
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
        <Button onClick={onClose} className="back">
          Буцах
        </Button>
        <Button
          loading={confirmLoading}
          htmlType="submit"
          onClick={() => form.submit()}
          disabled={
            calculateTotal(quantity) > balance || isRefreshing || fetchError
          }
          className={`${
            calculateTotal(quantity) > balance || isRefreshing || fetchError
              ? "bg-gray-400 cursor-not-allowed"
              : ""
          }`}
        >
          Худалдаж авах
        </Button>
      </div>
    </Modal>
  );
};

export default PurchaseModal;
