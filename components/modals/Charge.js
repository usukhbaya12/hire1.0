import React, { useState } from "react";
import { Modal, message, Divider } from "antd";
import {
  CopyBoldDuotone,
  ShieldWarningBoldDuotone,
  Wallet2BoldDuotone,
  PhoneCallingRoundedBoldDuotone,
  CheckCircleBoldDuotone,
  LetterBoldDuotone,
  DocumentBoldDuotone,
  ClockCircleBoldDuotone,
  NotesBoldDuotone,
  AlarmBoldDuotone,
} from "solar-icons";

const ChargeModal = ({ isOpen, onClose }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [copiedAccount, setCopiedAccount] = useState(null);

  const bankInfo = {
    accountName: "АКСИОМ ИНК ХХК",
    banks: [
      {
        src: "https://qpay.mn/q/logo/khanbank.png",
        name: "ХААН БАНК",
        account: "MN070005005070465457",
      },
    ],
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    messageApi.open({
      type: "success",
      content: "Хуулсан.",
      duration: 2,
    });
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 5000);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={420}
        className="charge-modal"
        title={
          <div className="flex items-center gap-2">
            <Wallet2BoldDuotone className="text-main" />
            <span className="text-[15px]">Хэтэвч цэнэглэх</span>
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
      >
        <div className="mt-4 space-y-4">
          {/* Bank Accounts Section */}
          <div className="space-y-3">
            {bankInfo.banks.map((bank) => (
              <div
                key={bank.name}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="flex items-center p-2 border-b border-gray-100 bg-gray-50">
                  <div className="w-10 h-10 flex items-center justify-center mr-1">
                    <img
                      src={bank.src}
                      alt={bank.name}
                      className="w-8 h-8 object-contain rounded-lg"
                    />
                  </div>
                  <div className="font-bold text-gray-700">{bank.name}</div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="leading-4">
                    <div className="text-gray-500 font-medium">
                      Дансны дугаар
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-base font-extrabold text-gray-800 tracking-wider">
                        {bank.account}
                      </div>
                      <button
                        onClick={() => copyToClipboard(bank.account, bank.name)}
                        className={`text-xs font-bold flex items-center gap-1.5 py-1.5 px-3 rounded-full transition-all ${
                          copiedAccount === bank.name
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 hover:bg-main/10 text-gray-700 hover:text-main"
                        }`}
                        title="Дансны дугаар хуулах"
                      >
                        <CopyBoldDuotone width={16} height={16} />
                        Хуулах
                      </button>
                    </div>
                  </div>

                  <div className="leading-4">
                    <div className="text-gray-500 font-medium">
                      Хүлээн авагч
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-extrabold text-gray-800">
                        {bankInfo.accountName}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(bankInfo.accountName, "accountName")
                        }
                        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold transition-all ${
                          copiedAccount === "accountName"
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 hover:bg-main/10 text-gray-700 hover:text-main"
                        }`}
                        title="Хүлээн авагчийн нэр хуулах"
                      >
                        <CopyBoldDuotone width={16} height={16} />
                        Хуулах
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* <div className="bg-gray-50 border-b border-gray-100 px-4 py-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <DocumentBoldDuotone width={18} className="text-main" />
                Шилжүүлэг хийх заавар
              </h3>
            </div> */}
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-main/10 text-main font-bold text-sm">
                  <NotesBoldDuotone width={14} />
                </div>
                <div>
                  <p className="text-main font-bold">Гүйлгээний утга</p>
                  <p className="text-sm text-gray-600">
                    Бүртгэлтэй мэйл хаяг, байгууллагын регистрийн дугаар,
                    холбогдох утасны дугаар
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-main/10 text-main font-bold text-sm">
                  <ClockCircleBoldDuotone width={14} />
                </div>
                <div>
                  <p className="text-main font-bold">Шилжүүлэг хийсний дараа</p>
                  <p className="text-sm text-gray-600">
                    Шилжүүлэг хийснээс хойш 24 цагийн дотор таны хэтэвч
                    цэнэглэгдэнэ.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-1 px-2">
            <div className="flex items-center gap-2">
              <PhoneCallingRoundedBoldDuotone
                width={18}
                className="text-main"
              />
              <span className="text-sm text-gray-700">(+976) 8005-3904</span>
            </div>
            <div className="flex items-center gap-2">
              <LetterBoldDuotone width={18} className="text-main" />
              <span className="text-sm text-gray-700">info@axiominc.mn</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChargeModal;
