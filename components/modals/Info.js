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
      open={open}
      onCancel={onCancel}
      footer={
        <div className="flex gap-4 justify-end">
          <div className="relative group cursor-pointer" onClick={onCancel}>
            <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-200/50 to-gray-500/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-gray-400/30 to-gray-300/20 rounded-full flex items-center justify-center border border-gray-500/10">
              <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-gray-500 to-gray-600 bg-clip-text text-transparent py-1 px-6">
                Буцах
              </div>
            </div>
          </div>

          <div
            className={`relative group ${
              !hasAgreed ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
            onClick={!hasAgreed ? undefined : handleOk}
            style={{ width: "auto" }}
          >
            <div
              className={`absolute -inset-0.5 bg-gradient-to-br ${
                !hasAgreed
                  ? "from-gray-400/50 to-gray-500/70"
                  : "from-main/50 to-main/70"
              } rounded-full blur opacity-30 ${
                !hasAgreed ? "" : "group-hover:opacity-40"
              } transition duration-300`}
            ></div>

            <div
              className={`relative bg-gradient-to-br ${
                !hasAgreed
                  ? "from-gray-300/30 to-gray-400/20"
                  : "from-main/30 to-secondary/20"
              } rounded-full flex items-center justify-center border ${
                !hasAgreed ? "border-gray-300/10" : "border-main/10"
              }`}
            >
              <div
                className={`flex items-center gap-1.5 font-extrabold ${
                  !hasAgreed
                    ? "bg-gradient-to-br from-gray-400 to-gray-500 bg-clip-text text-transparent"
                    : "bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent"
                } py-1 px-8 justify-center`}
              >
                Эхлүүлэх
              </div>
            </div>
          </div>
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
      <div className="prose prose-sm max-w-none bg-gray-50 px-6 py-2 rounded-xl my-4 max-h-[40vh] overflow-y-auto">
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
