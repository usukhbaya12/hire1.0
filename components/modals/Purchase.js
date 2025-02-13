"use client";

import React, { useState } from "react";
import { Button, Form, InputNumber, Modal, Divider } from "antd";
import {
  CalculatorMinimalisticBoldDuotone,
  DangerTriangleBoldDuotone,
  Wallet2BoldDuotone,
} from "solar-icons";

const PurchaseModal = ({
  isOpen,
  onClose,
  confirmLoading,
  onPurchase,
  testPrice,
  balance,
  remaining,
}) => {
  const [form] = Form.useForm();
  const [quantity, setQuantity] = useState(1);

  const calculateTotal = (qty) => {
    return qty * testPrice;
  };

  const handleQuantityChange = (value) => {
    setQuantity(value || 0);
  };

  return (
    <Modal
      title="Тест худалдаж авах"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <div className="w-full mt-4 p-3 px-4 rounded-full flex items-center gap-3 justify-between bg-main">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-main">
            <Wallet2BoldDuotone width={24} />
          </div>
          <div>
            <p className="text-white">Үлдэгдэл</p>
            <p className="text-xl text-white font-extrabold">
              {balance?.toLocaleString()}₮
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-gray-50 p-2 rounded-xl px-4 justify-between flex items-center shadow shadow-slate-200">
        Үлдэгдэл эрх:<div className="font-bold text-main">{remaining}</div>
      </div>

      <div className="mt-4 bg-gray-50 px-4 py-3 pb-4 rounded-xl shadow shadow-slate-200">
        <div className="flex items-center gap-2">
          <CalculatorMinimalisticBoldDuotone size={16} className="text-main" />
          <div className="font-semibold text-gray-700 pt-0.5">Тооцоолол</div>
        </div>
        <Divider />

        <Form form={form} onFinish={onPurchase} initialValues={{ count: 1 }}>
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
          disabled={calculateTotal(quantity) > balance}
          className={`${
            calculateTotal(quantity) > balance
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
