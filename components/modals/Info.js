import React, { useState } from "react";
import { Modal, Button, Checkbox, Alert } from "antd";
import { InfoCircleBoldDuotone } from "solar-icons";

const InfoModal = ({
  open,
  onOk,
  onCancel,
  advice = "",
  title = "Асуумжид хариулах заавар",
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  const handleOk = () => {
    if (!hasAgreed) return;
    onOk();
  };

  return (
    <Modal
      width="500px"
      title={
        <div className="flex items-center gap-2">
          <InfoCircleBoldDuotone className="text-main" />
          <span className="text-[15px]">{title}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={
        <div className="flex gap-4 justify-end">
          <Button
            className="back border rounded-xl text-[13px] font-medium"
            onClick={onCancel}
          >
            Буцах
          </Button>
          <Button
            className={`border-none rounded-xl font-semibold text-white ${
              hasAgreed ? "bg-main hover:bg-secondary" : "bg-gray-400"
            }`}
            onClick={handleOk}
            disabled={!hasAgreed}
          >
            Эхлүүлэх
          </Button>
        </div>
      }
    >
      {!hasAgreed && (
        <Alert
          message="Тестийг эхлүүлэхийн өмнө заавартай танилцана уу."
          type="warning"
          showIcon
          className="mt-4"
        />
      )}
      <div className="prose prose-sm max-w-none bg-gray-50 px-6 py-2 rounded-xl my-4">
        <div dangerouslySetInnerHTML={{ __html: advice }} />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Checkbox
          checked={hasAgreed}
          onChange={(e) => setHasAgreed(e.target.checked)}
        >
          <span className="font-medium">Ойлголоо</span>
        </Checkbox>
      </div>
    </Modal>
  );
};

export default InfoModal;
