import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { checkPayment } from "@/app/api/main";

const QPay = ({ isOpen, onClose, paymentData, serviceId, onSuccess }) => {
  const [checking, setChecking] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState(null);

  const handleCheckPayment = async () => {
    if (!paymentData?.invoice?.invoice_id || checking) return;

    const invoiceId = paymentData.invoice.invoice_id;
    setChecking(true);
    setError(null);

    try {
      const res = await checkPayment(serviceId, invoiceId);

      if (!res) {
        setError("Төлбөр шалгахад алдаа гарлаа.");
        return;
      }

      if (!res.token) {
        messageApi.error("Таны session дууссан байна.");
        return;
      }

      if (res.success) {
        if (res.data === true) {
          messageApi.success("Төлбөр амжилттай төлөгдлөө.");
          onSuccess();
          onClose();
        } else {
          setError("Төлбөр төлөгдөөгүй байна.");
        }
      } else {
        setError("Сервертэй холбогдоход алдаа гарлаа.");
      }
    } catch (error) {
      setError("Төлбөр шалгахад алдаа гарлаа.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="qPay-р төлбөрөө төлөх"
      footer={null}
      width={400}
      centered
    >
      <div className="flex flex-col items-center pb-1">
        {contextHolder}
        {paymentData?.invoice?.qr_image && (
          <div className="mb-2">
            <img
              src={`data:image/png;base64,${paymentData.invoice.qr_image}`}
              alt="Payment QR Code"
              width={200}
              height={200}
            />
          </div>
        )}

        {error && (
          <div className="mb-5 text-red-500 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 w-full mb-6 lg:hidden">
          {paymentData?.invoice?.urls?.map((bank) => (
            <a
              key={bank.name}
              href={bank.link}
              className="flex flex-col items-center gap-1 hover:opacity-80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={bank.logo}
                alt={bank.name}
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-[11px] font-medium text-center leading-tight">
                {bank.description}
              </span>
            </a>
          ))}
        </div>

        <Button
          onClick={handleCheckPayment}
          loading={checking}
          className="w-full"
        >
          Төлбөр шалгах
        </Button>
      </div>
    </Modal>
  );
};

export default QPay;
