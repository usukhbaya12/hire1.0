import React, { useState, useEffect, useRef } from "react";
import { Modal, message } from "antd";
import { checkPayment } from "@/app/api/main";
import { LoadingOutlined } from "@ant-design/icons";

const QPay = ({ isOpen, onClose, paymentData, serviceId, onSuccess }) => {
  const [checking, setChecking] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState(null);
  const [autoCheckActive, setAutoCheckActive] = useState(false);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const checkCountRef = useRef(0);

  useEffect(() => {
    if (isOpen && paymentData?.invoice?.invoice_id) {
      startAutoCheck();
    }
    return () => {
      stopAutoCheck();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen, paymentData]);

  const startAutoCheck = () => {
    setAutoCheckActive(true);
    checkCountRef.current = 0;

    intervalRef.current = setInterval(() => {
      checkCountRef.current += 1;
      handleCheckPayment(true);

      if (checkCountRef.current >= 10) {
        stopAutoCheck();
      }
    }, 5000);

    timerRef.current = setTimeout(() => {
      stopAutoCheck();
    }, 60000);
  };

  const stopAutoCheck = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setAutoCheckActive(false);
  };

  const handleCheckPayment = async (isAuto = false) => {
    if (!paymentData?.invoice?.invoice_id || (checking && !isAuto)) return;

    const invoiceId = paymentData.invoice.invoice_id;
    setChecking(true);
    if (!isAuto) {
      setError(null);
    }

    try {
      const res = await checkPayment(serviceId, invoiceId);

      if (!res) {
        setError("Төлбөр шалгахад алдаа гарлаа.");
        return;
      }

      if (res.success) {
        if (res.data === true) {
          messageApi.success("Төлбөр амжилттай төлөгдлөө.");
          stopAutoCheck();
          onSuccess();
          onClose();
        } else if (!isAuto) {
          setError("Төлбөр төлөгдөөгүй байна.");
        }
      } else if (!isAuto) {
        setError("Сервертэй холбогдоход алдаа гарлаа.");
      }
    } catch (error) {
      if (!isAuto) {
        setError("Төлбөр шалгахад алдаа гарлаа.");
      }
    } finally {
      setChecking(false);
    }
  };

  const getTimeLeft = () => {
    if (!autoCheckActive) return null;
    const checksLeft = 12 - checkCountRef.current;
    if (checksLeft <= 0) return null;
    return checksLeft * 5;
  };

  const timeLeft = getTimeLeft();

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title="QPay-р төлбөрөө төлөх"
      footer={null}
      width={400}
      centered
      closable={false}
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

        <div className="mb-5 text-gray-700 text-sm font-medium text-center">
          Санамж: Төлбөрөө төлсөн бол{" "}
          <span className="font-bold">Төлбөр шалгах</span> товч дээр дарна уу.
        </div>

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

        <div
          className="relative group cursor-pointer w-full"
          onClick={() => handleCheckPayment()}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
            <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-2 px-7 w-full justify-center">
              {checking ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <LoadingOutlined
                      style={{ fontSize: 16, color: "white" }}
                      spin
                    />
                  </div>
                  Шалгаж байна...
                </div>
              ) : (
                "Төлбөр шалгах"
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default QPay;
