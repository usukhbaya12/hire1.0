"use client";

import React, { useState, useEffect } from "react";
import { Button, message, Spin } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getUserTestHistory } from "@/app/api/assessment";
import {
  BuildingsBoldDuotone,
  DownloadMinimalisticBoldDuotone,
  FileRemoveBoldDuotone,
  GlobalLineDuotone,
  NotesBoldDuotone,
  RoundArrowRightDownLineDuotone,
  RoundDoubleAltArrowRightBoldDuotone,
  UserPlusBoldDuotone,
} from "solar-icons";
import InviteTable from "@/components/Invite";
import EmployeeTable from "@/components/Applicants"; // Import your enhanced component
import PurchaseModal from "@/components/modals/Purchase";
import { purchaseTest } from "@/app/api/main";
import { useSession } from "next-auth/react";
import { LoadingOutlined } from "@ant-design/icons";

const MyTests = () => {
  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getUserTestHistory(params.id);
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error("GET / Алдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetchData = async () => {
    await fetchData();
  };

  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/shalguulagchid.xlsx";
    link.download = "shalguulagchid.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOrganizationPurchase = async (values) => {
    setConfirmLoading(true);
    try {
      const response = await purchaseTest(values.count, params.id);

      if (response.success) {
        messageApi.success("Худалдан авалт амжилттай.");
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error("Худалдан авалтад алдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Spin
        fullscreen
        tip="Уншиж байна..."
        spinning={loading}
        indicator={<LoadingOutlined style={{ color: "white" }} spin />}
      />
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        confirmLoading={confirmLoading}
        onPurchase={handleOrganizationPurchase}
        testPrice={data?.data?.[0].assessment.price || 0}
        remaining={data?.data?.reduce(
          (sum, item) => sum + (item.count - item.usedUserCount),
          0
        )}
      />
      {contextHolder}
      <div className="inset-0 fixed">
        <div className="absolute left-[-5%] w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full bg-orange-600/10 blur-[80px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] md:w-[500px] md:h-[500px] rounded-full bg-orange-600/10 blur-[100px]" />
      </div>
      <div className="relative 2xl:px-72 xl:px-24 lg:px-16 md:px-12 px-6 pt-8 md:pt-12 pb-16 z-[3]">
        <div className="w-full relative p-4 bg-white/70 backdrop-blur-md rounded-3xl sm:rounded-full shadow shadow-slate-200 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-main/5"></div>
          <div className="absolute top-0 right-0 w-60 h-60">
            <Image
              src="/brain-home.png"
              width={128}
              height={128}
              alt="Brain decoration"
              className="w-full h-full object-contain opacity-10"
            />
          </div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
            {/* Title and Icon Section */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative min-w-14 min-h-14 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                    <NotesBoldDuotone
                      className="text-main"
                      width={36}
                      height={36}
                    />
                  </div>
                </div>
              </div>
              <div className="font-extrabold text-xl bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                {data?.data?.[0].assessment.name}
              </div>
            </div>

            {/* Stats and Button Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pl-14 sm:pl-0 sm:px-4 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1">
                  <GlobalLineDuotone
                    width={18}
                    height={18}
                    className="text-main"
                  />
                  <div>
                    Авсан эрх:
                    <span className="font-extrabold text-base text-main pl-1">
                      {data?.data?.reduce((sum, item) => sum + item.count, 0)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <RoundArrowRightDownLineDuotone
                    width={18}
                    height={18}
                    className="text-main"
                  />
                  <div>
                    Үлдсэн эрх:
                    <span className="font-extrabold text-base text-main pl-1">
                      {data?.data?.reduce(
                        (sum, item) => sum + (item.count - item.usedUserCount),
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="relative group pl-5 sm:ml-3 pr-3.5 py-2 bg-gradient-to-br from-main to-secondary rounded-xl text-white font-bold shadow-lg shadow-main/20 hover:shadow-main/30 transition-all duration-300 hover:scale-105 active:scale-95 mt-2 sm:mt-0 w-full sm:w-auto flex justify-center"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-1">
                  <span>Худалдаж авах</span>
                  <RoundDoubleAltArrowRightBoldDuotone width={20} height={20} />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-sm mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 mb-4 sm:justify-between">
            <h2 className="text-base font-extrabold px-1 flex items-center gap-2">
              <UserPlusBoldDuotone width={20} height={20} />
              Шалгуулагч урих
            </h2>
            <div
              onClick={downloadTemplate}
              className="flex items-center justify-center gap-2 bg-main/90 font-semibold rounded-full text-white shadow shadow-slate-200 backdrop-blur-md px-3.5 py-1.5 cursor-pointer hover:bg-main transition-colors duration-300 w-full sm:w-auto"
            >
              <FileRemoveBoldDuotone width={18} height={18} /> Загвар татах
            </div>
          </div>
          <div className="px-1">
            <InviteTable testData={data.data} onSuccess={refetchData} />
          </div>
        </div>
        <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 shadow-sm mt-6">
          <div className="flex items-center mb-4 justify-between">
            <h2 className="text-base font-extrabold px-1 flex items-center gap-2">
              <BuildingsBoldDuotone width={20} height={20} />
              Нийт шалгуулагчид
            </h2>
          </div>
          <div className="px-1">
            <EmployeeTable testData={data.data} onRefresh={refetchData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTests;
