import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import {
  ExpressionlessCircleLineDuotone,
  SadCircleLineDuotone,
  SmileCircleLineDuotone,
} from "solar-icons";

const { TextArea } = Input;

const FinishModal = ({ open, onClose, onSubmit }) => {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");

  const faces = [
    {
      value: 1,
      emoji: <SadCircleLineDuotone size={30} />,
      label: "Сэтгэл ханамжгүй",
    },
    {
      value: 2,
      emoji: <ExpressionlessCircleLineDuotone size={30} />,
      label: "Дунд зэрэг",
    },
    {
      value: 3,
      emoji: <SmileCircleLineDuotone size={30} />,
      label: "Сэтгэл ханамжтай",
    },
  ];

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <Modal
      open={open}
      //onCancel={onClose}
      title="Тесттэй холбоотой санал хүсэлт"
      footer={[
        <Button
          key="submit"
          disabled={!selected}
          onClick={handleSubmit}
          className="w-full border-none bg-main font-bold text-white px-3 py-2 rounded-xl cursor-pointer hover:bg-secondary transition-colors"
        >
          Илгээх
        </Button>,
      ]}
    >
      <div className="flex flex-col items-center pt-5 pb-2">
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
  );
};

export default FinishModal;
