import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { ExpressionlessCircle, SadCircle, SmileCircle } from "solar-icons";
import { postFeedback } from "@/app/api/exam";
import { LoadingOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const FinishModal = ({ open, onClose, onSubmit, assessment }) => {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const faces = [
    {
      value: 30,
      emoji: <SadCircle width={32} height={32} />,
      label: "Сэтгэл ханамжгүй",
    },
    {
      value: 20,
      emoji: <ExpressionlessCircle width={32} height={32} />,
      label: "Дунд зэрэг",
    },
    {
      value: 10,
      emoji: <SmileCircle width={32} height={32} />,
      label: "Сэтгэл ханамжтай",
    },
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const feedbackData = {
        status: selected,
        type: 20,
        message: feedback,
        assessment: assessment,
      };

      const response = await postFeedback(feedbackData);

      if (response.success) {
        onSubmit();
      } else {
        messageApi.error(
          response.message || "Санал хүсэлт илгээхэд алдаа гарлаа"
        );
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Тесттэй холбоотой санал хүсэлт"
        width={450}
        footer={[
          <div
            className={`relative group w-full ${
              !selected || loading
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }`}
            onClick={!selected || loading ? undefined : handleSubmit}
          >
            <div
              className={`absolute -inset-0.5 bg-gradient-to-br ${
                !selected
                  ? "from-gray-400/50 to-gray-500/70"
                  : "from-main/50 to-main/70"
              } rounded-full blur opacity-30 ${
                !selected ? "" : "group-hover:opacity-40"
              } transition duration-300`}
            ></div>

            <div
              className={`relative bg-gradient-to-br ${
                !selected
                  ? "from-gray-300/30 to-gray-400/20"
                  : "from-main/30 to-secondary/20"
              } rounded-full flex items-center justify-center border ${
                !selected ? "border-gray-300/10" : "border-main/10"
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-extrabold ${
                  !selected
                    ? "bg-gradient-to-br from-gray-400 to-gray-500 bg-clip-text text-transparent"
                    : "bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent"
                } py-2 px-7 w-full justify-center`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <LoadingOutlined
                        style={{
                          fontSize: 16,
                          color: !selected ? "#888" : "white",
                        }}
                        spin
                      />
                    </div>
                    Илгээх
                  </div>
                ) : (
                  "Илгээх"
                )}
              </div>
            </div>
          </div>,
        ]}
      >
        <div className="flex flex-col items-center pt-4 pb-2">
          <div className="pb-4">Тестэд өгөх таны үнэлгээ:</div>

          <div className="flex justify-center gap-6 pb-4">
            {faces.map((face) => (
              <div
                key={face.value}
                onClick={() => setSelected(face.value)}
                className={`cursor-pointer transition-all duration-200 transform 
                  ${
                    selected === face.value
                      ? "scale-110 text-main"
                      : "hover:scale-105"
                  }
                  ${
                    selected === face.value
                      ? "opacity-100"
                      : "opacity-50 hover:opacity-75"
                  }`}
              >
                <div className="text-4xl mb-2">{face.emoji}</div>
              </div>
            ))}
          </div>

          <div className="w-full">
            <div className="px-1 font-semibold pb-1">Сэтгэгдэл</div>
            <TextArea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Дэлгэрэнгүй бичнэ үү..."
              rows={3}
              className="rounded"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FinishModal;
