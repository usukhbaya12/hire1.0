import React, { useState } from "react";
import { Modal, Radio, Input, Space, Card, Alert, Button, message } from "antd";
import {
  InfoCircleBoldDuotone,
  Pen2BoldDuotone,
  QuestionCircleBoldDuotone,
  SettingsBoldDuotone,
} from "solar-icons";
import { postFeedback } from "@/app/api/exam";
import { LoadingOutlined } from "@ant-design/icons";

const FlagModal = ({ open, onClose, assessment }) => {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const issues = [
    {
      id: "question",
      label: "Асуулттай холбоотой",
      icon: <QuestionCircleBoldDuotone width={22} />,
    },
    {
      id: "answer",
      label: "Хариулттай холбоотой",
      icon: <InfoCircleBoldDuotone width={22} />,
    },
    {
      id: "technical",
      label: "Техникийн асуудал",
      icon: <SettingsBoldDuotone width={22} />,
    },
    {
      id: "other",
      label: "Бусад",
      icon: <Pen2BoldDuotone width={20} />,
    },
  ];

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const flagData = {
        type: 10,
        message: feedback,
        assessment: assessment,
      };

      const response = await postFeedback(flagData);

      if (response.success) {
        messageApi.success("Амжилттай илгээгдлээ.");
        onClose();
      } else {
        messageApi.error(response.message || "Хүсэлт илгээхэд алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Error sending flag:", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        width={450}
        title="Асуудал мэдэгдэх"
        onCancel={onClose}
        footer={
          <div className="flex gap-4 justify-end">
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
                !feedback.trim() || loading
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }`}
              onClick={!feedback.trim() || loading ? undefined : handleSubmit}
              style={{ width: "auto" }}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-br ${
                  !feedback.trim()
                    ? "from-gray-400/50 to-gray-500/70"
                    : "from-main/50 to-main/70"
                } rounded-full blur opacity-30 ${
                  !feedback.trim() ? "" : "group-hover:opacity-40"
                } transition duration-300`}
              ></div>

              <div
                className={`relative bg-gradient-to-br ${
                  !feedback.trim()
                    ? "from-gray-300/30 to-gray-400/20"
                    : "from-main/30 to-secondary/20"
                } rounded-full flex items-center justify-center border ${
                  !feedback.trim() ? "border-gray-300/10" : "border-main/10"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 font-extrabold ${
                    !feedback.trim()
                      ? "bg-gradient-to-br from-gray-400 to-gray-500 bg-clip-text text-transparent"
                      : "bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent"
                  } py-1 px-8 justify-center`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <LoadingOutlined
                          style={{
                            fontSize: 16,
                            color: !feedback.trim() ? "#888" : "white",
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
            </div>
          </div>
        }
      >
        <div className="pt-4 pb-2">
          <Radio.Group
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full"
          >
            <Space direction="vertical" className="w-full" size={12}>
              {issues.map((issue) => (
                <Card
                  key={issue.id}
                  className={`w-full cursor-pointer transition-all hover:border-orange-500 rounded-2xl px-2 py-1 ${
                    selected === issue.id
                      ? "border-orange-500"
                      : "border-[#d9d9d9]"
                  }`}
                  bodyStyle={{ padding: "12px" }}
                  onClick={() => setSelected(issue.id)}
                >
                  <div className="flex items-start gap-3">
                    <Radio value={issue.id} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-main">{issue.icon}</span>
                        <span className="font-semibold">{issue.label}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          </Radio.Group>

          <div className="mt-4">
            <Input.TextArea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Асуудлын талаар дэлгэрэнгүй бичнэ үү..."
              rows={4}
            />
          </div>

          {selected && (
            <Alert
              message="Таны санал хүсэлтийг хүлээн авч, шалгах болно."
              type="info"
              showIcon
              className="mt-4 px-4"
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default FlagModal;
