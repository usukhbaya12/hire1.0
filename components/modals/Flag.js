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
        footer={
          <div className="flex gap-4 justify-end">
            <Button
              className={`back-btn ${
                loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
              onClick={loading ? undefined : onClose}
            >
              Буцах
            </Button>

            <Button
              className={`grd-btn w-32 ${
                !feedback.trim() || loading
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }`}
              loading={loading}
              onClick={!feedback.trim() || loading ? undefined : handleSubmit}
              style={{ width: "auto" }}
            >
              Илгээх
            </Button>
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
