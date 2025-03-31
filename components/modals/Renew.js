import React, { useState } from "react";
import { Modal, DatePicker, message, Space, Divider } from "antd";
import { extendExamDate } from "@/app/api/main"; // Update this path if needed
import {
  AlarmBoldDuotone,
  CalendarBoldDuotone,
  ClockCircleBoldDuotone,
  RewindForwardBoldDuotone,
} from "solar-icons";
import dayjs from "dayjs";
import { LoadingOutlined } from "@ant-design/icons";

const RenewModal = ({ isVisible, onClose, examData, onSuccess }) => {
  console.log(examData);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const disabledDate = (current) => {
    return current && current < dayjs().add(1, "day").startOf("day");
  };

  const handleExtend = async () => {
    if (!selectedDate) {
      messageApi.error("Сунгах хугацаагаа сонгоно уу.");
      return;
    }

    try {
      setLoading(true);

      const formattedDate = selectedDate.format("YYYY-MM-DD HH:mm:ss");
      const response = await extendExamDate(examData.code, {
        endDate: formattedDate,
      });

      if (response.success) {
        messageApi.success("Хугацааг амжилттай сунгалаа.");
        onSuccess?.();
        onClose();
      } else {
        messageApi.error(response.message || "Хугацаа сунгахад алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Хугацаа сунгахад алдаа гарлаа:", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Тестийн хугацаа сунгах"
        open={isVisible}
        onCancel={onClose}
        footer={null}
        width={400}
      >
        <div>
          <Divider />
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-red-500">
              <div className="text-red-500 flex gap-1 items-center">
                <AlarmBoldDuotone width={18} /> Дууссан огноо:
              </div>
              <div className="font-semibold">{examData?.endDate || "-"}</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1 items-center">
                <RewindForwardBoldDuotone width={18} /> Шинээр сунгах:
              </div>
              <DatePicker
                needConfirm={false}
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                placeholder="Сунгах огноо"
                onChange={setSelectedDate}
                disabledDate={disabledDate}
                className="w-48 rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-6">
            <div
              className={`relative group ${
                loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
              onClick={loading ? undefined : onClose}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-200/50 to-gray-500/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-400/30 to-gray-300/20 rounded-full flex items-center justify-center border border-gray-500/10">
                <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-gray-500 to-gray-600 bg-clip-text text-transparent py-1 px-6">
                  Буцах
                </div>
              </div>
            </div>

            <div
              className={`relative group ${
                !selectedDate || loading
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }`}
              onClick={!selectedDate || loading ? undefined : handleExtend}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-br ${
                  !selectedDate
                    ? "from-gray-400/50 to-gray-500/70"
                    : "from-main/50 to-main/70"
                } rounded-full blur opacity-30 ${
                  !selectedDate ? "" : "group-hover:opacity-40"
                } transition duration-300`}
              ></div>

              <div
                className={`relative bg-gradient-to-br ${
                  !selectedDate
                    ? "from-gray-300/30 to-gray-400/20"
                    : "from-main/30 to-secondary/20"
                } rounded-full flex items-center justify-center border ${
                  !selectedDate ? "border-gray-300/10" : "border-main/10"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 font-extrabold ${
                    !selectedDate
                      ? "bg-gradient-to-br from-gray-400 to-gray-500 bg-clip-text text-transparent"
                      : "bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent"
                  } py-1 px-6`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <LoadingOutlined
                          style={{
                            fontSize: 16,
                            color: !selectedDate ? "#888" : "white",
                          }}
                          spin
                        />
                      </div>
                      Сунгах
                    </div>
                  ) : (
                    "Сунгах"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RenewModal;
