"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ConfigProvider } from "antd";
import mnMN from "antd/lib/locale/mn_MN";
import {
  Wallet2BoldDuotone,
  VerifiedCheckBoldDuotone,
  GraphUpBoldDuotone,
  ChartBoldDuotone,
  Buildings3BoldDuotone,
} from "solar-icons";

import TestsTabContent from "@/components/Profile";
import WalletTabContent from "@/components/Wallet";
import HistoryTabContent from "@/components/My";
import ChargeModal from "@/components/modals/Charge";
import EBarimtModal from "@/components/modals/EBarimt";
import Footer from "@/components/Footer";
import { ebarimt } from "../api/main";

const Profile = () => {
  const { data: session } = useSession();
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [barimtModalOpen, setBarimtModalOpen] = useState(false);
  const [barimtData, setBarimtData] = useState([]);
  const [assessmentName, setAssessmentName] = useState(null);
  const [activeTab, setActiveTab] = useState("tests");

  if (!session) return null;

  const getBarimt = async (serviceId, assessmentName) => {
    try {
      const res = await ebarimt(serviceId);
      setBarimtData(res.data);
      setAssessmentName(assessmentName);
      setBarimtModalOpen(true);
    } catch (err) {
      console.error("GET / Aлдаа гарлаа.", err);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    }
  };

  const menuItems = [
    {
      name: session?.user?.role === 20 ? "Өгсөн тестүүд" : "Миний тестүүд",
      key: "tests",
      icon: (
        <VerifiedCheckBoldDuotone
          width={20}
          height={20}
          className="text-main"
        />
      ),
    },
    {
      name: "Уригдсан тестүүд",
      key: "orgtests",
      icon: (
        <Buildings3BoldDuotone width={17} height={17} className="text-main" />
      ),
      show: session?.user?.role === 20,
    },
    {
      name: "Нийт шалгуулагчид",
      key: "applicants",
      icon: <ChartBoldDuotone width={20} height={20} className="text-main" />,
      show: session?.user?.role === 30,
    },
    {
      name: "Хэтэвч",
      key: "wallet",
      icon: <Wallet2BoldDuotone width={20} height={20} className="text-main" />,
      show: session?.user?.role === 30,
    },
    {
      name: "Гүйлгээний түүх",
      key: "history",
      icon: <GraphUpBoldDuotone width={20} height={20} className="text-main" />,
      show: session?.user?.role === 20,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "tests":
      case "orgtests":
      case "applicants":
        return <TestsTabContent activeTab={activeTab} session={session} />;
      case "wallet":
        return (
          <WalletTabContent
            session={session}
            onRechargeOpen={() => setIsRechargeModalOpen(true)}
          />
        );
      case "history":
        return <HistoryTabContent session={session} onBarimtOpen={getBarimt} />;
      default:
        return null;
    }
  };

  return (
    <>
      <ConfigProvider locale={mnMN}>
        <title>Миний тестүүд / Hire.mn</title>
        <EBarimtModal
          open={barimtModalOpen}
          onClose={() => setBarimtModalOpen(false)}
          barimtData={barimtData}
          assessment={assessmentName}
        />
        <ChargeModal
          isOpen={isRechargeModalOpen}
          onClose={() => setIsRechargeModalOpen(false)}
        />
        <div className="inset-0 fixed">
          <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
        </div>
        <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pt-8 md:pt-12 pb-8 z-[3]">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full lg:w-1/5 space-y-4">
              <div className="relative p-6 bg-white/40 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
                <div className="absolute top-32 -right-14 w-60 h-60">
                  <Image
                    draggable={false}
                    src="/brain-home.png"
                    width={128}
                    height={128}
                    alt="Brain decoration"
                    className="w-full h-full object-contain opacity-5"
                  />
                </div>

                <div className="relative flex flex-col items-center text-center">
                  <div className="relative group mb-4">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative min-w-24 min-h-24 w-24 h-24 sm:w-28 sm:h-28 sm:min-w-28 sm:min-h-28 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                      {session?.user?.profile ? (
                        <img
                          src={session?.user?.profile}
                          alt={session?.user?.name || "Profile"}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent pt-1.5 flex items-center justify-center">
                          {session?.user?.name?.[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center mt-1">
                    <div className="font-extrabold text-xl leading-5 bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {session.user.name}
                    </div>
                    <div className="text-gray-700 mt-1">
                      <span className="font-medium">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-2 sm:px-4 sm:py-5 shadow shadow-slate-200 h-fit">
                <div className="flex lg:flex-col gap-1">
                  {menuItems
                    .filter((item) => item.show !== false)
                    .map((item) => (
                      <div
                        key={item.key}
                        className="cursor-pointer rounded-xl hover:bg-bg10 hover:rounded-full hover:text-main hover:font-semibold"
                        onClick={() => setActiveTab(item.key)}
                      >
                        {activeTab === item.key ? (
                          <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-gradient-to-br p-1.5 sm:p-2.5 px-4 from-main/20 to-secondary/20 rounded-full flex items-center border border-main/10">
                              <div className="font-extrabold text-main flex items-center gap-2">
                                {item.icon}
                                {item.name}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-1.5 sm:p-2.5 px-4 flex items-center gap-2">
                            {item.icon}
                            <div className="hidden sm:block">{item.name}</div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-4/5">{renderContent()}</div>
          </div>
        </div>
        <Footer />
      </ConfigProvider>
    </>
  );
};

export default Profile;
