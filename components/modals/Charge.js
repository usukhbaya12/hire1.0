import React, { useState } from "react";
import { Modal, message } from "antd";
import {
  CopyBoldDuotone,
  ShieldWarningBoldDuotone,
  Wallet2BoldDuotone,
  PhoneCallingRoundedBoldDuotone,
  CheckCircleBoldDuotone,
  LetterBoldDuotone,
} from "solar-icons";

const ChargeModal = ({ isOpen, onClose }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [copiedAccount, setCopiedAccount] = useState(null);

  const bankInfo = {
    accountName: "АКСИОМ ИНК ХХК",
    banks: [
      {
        src: "https://qpay.mn/q/logo/khanbank.png",
        name: "Хаан банк",
        account: "5009375211",
      },
    ],
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    messageApi.open({
      type: "success",
      content: "Хуулагдлаа.",
      duration: 2,
    });
    setCopiedAccount(type);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={400}
        className="charge-modal"
        title={
          <div className="flex items-center gap-2">
            <Wallet2BoldDuotone className="text-main" />
            <span className="text-[15px]">Хэтэвч цэнэглэх</span>
          </div>
        }
      >
        <div className="mt-4 space-y-6">
          {/* Bank Accounts Section */}
          <div className="space-y-4">
            {bankInfo.banks.map((bank, index) => (
              <div
                key={bank.name}
                className="flex items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl border border-gray-100 p-1 shadow-sm overflow-hidden mr-4">
                  <img
                    src={bank.src}
                    alt={bank.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="pt-1">
                    <div className="text-gray-700 font-medium">
                      Дансны дугаар
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold tracking-wide text-base">
                        {bank.account}
                      </div>
                      <button
                        onClick={() => copyToClipboard(bank.account, bank.name)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-main/10 rounded-full transition-colors"
                        title="Дансны дугаар хуулах"
                      >
                        {copiedAccount === bank.name ? (
                          <CheckCircleBoldDuotone
                            width={20}
                            className="text-green-600"
                          />
                        ) : (
                          <CopyBoldDuotone width={18} className="text-main" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-700 text-sm font-medium">
                      Хүлээн авагч
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold tracking-wide text-base">
                        {bankInfo.accountName}
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(bankInfo.accountName, "accountName")
                        }
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-main/10 rounded-full transition-colors"
                        title="Хүлээн авагчийн нэр хуулах"
                      >
                        {copiedAccount === "accountName" ? (
                          <CheckCircleBoldDuotone
                            width={20}
                            className="text-green-600"
                          />
                        ) : (
                          <CopyBoldDuotone width={18} className="text-main" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transaction Info */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <ShieldWarningBoldDuotone
                  size={20}
                  className="text-orange-500"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Гүйлгээний утга:
                </h3>
                <div className="text-sm text-gray-700">
                  Байгууллагын регистрийн дугаар, холбогдох утасны дугаар
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">Холбоо барих</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PhoneCallingRoundedBoldDuotone
                  size={16}
                  className="text-main"
                />
                <span className="text-sm text-gray-700">(+976) 8005-3904</span>
              </div>
              <div className="flex items-center gap-2">
                <LetterBoldDuotone size={16} className="text-main" />
                <span className="text-sm text-gray-700">support@hire.mn</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChargeModal;
