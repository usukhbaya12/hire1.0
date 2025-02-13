import React, { useState } from "react";
import { Modal, Radio, Input, Space, Card, Alert, Button } from "antd";
import {
  InfoCircleBoldDuotone,
  KeyBoldDuotone,
  Pen2BoldDuotone,
  QuestionCircleBoldDuotone,
  SettingsBoldDuotone,
} from "solar-icons";

const FlagModal = ({ open, onClose }) => {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");

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

  const handleSubmit = () => {
    // Handle submission logic here
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Асуудал мэдэгдэх"
      onCancel={onClose}
      footer={
        <div className="flex gap-4 justify-end">
          <Button
            className="back border rounded-xl text-[13px] font-medium"
            onClick={onClose}
          >
            Буцах
          </Button>
          <Button
            className="border-none rounded-xl font-semibold text-white bg-main"
            onClick={handleSubmit}
            disabled={!selected}
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
  );
};

export default FlagModal;
