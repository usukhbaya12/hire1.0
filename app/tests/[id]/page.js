"use client";

import React, { useState, useEffect } from "react";
import { message, Spin } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getUserTestHistory } from "@/app/api/assessment";
import {
  BuildingsBoldDuotone,
  DownloadMinimalisticBoldDuotone,
  FileRemoveBoldDuotone,
  GlobalLineDuotone,
  RoundArrowRightDownLineDuotone,
  RoundDoubleAltArrowRightBoldDuotone,
  UserPlusBoldDuotone,
} from "solar-icons";
import InviteTable from "@/components/Invite";
import EmployeeTable from "@/components/Applicants";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import PurchaseModal from "@/components/modals/Purchase";
import { purchaseTest } from "@/app/api/main";
import { useSession } from "next-auth/react";

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

  const handleDownloadTable = () => {
    const allExams = data?.flatMap((test) => test.exams) || [];

    const exportData = allExams.map((exam) => {
      let status = "Хүлээгдэж буй";
      if (exam.userStartDate && !exam.userEndDate) {
        status = "Эхэлсэн";
      } else if (exam.userEndDate) {
        status = "Дуусгасан";
      } else if (exam.email && !exam.userStartDate) {
        status = "Мэйл илгээсэн";
      }

      return {
        "Илгээсэн огноо": exam.startDate
          ? dayjs(exam.startDate).format("YYYY/MM/DD HH:mm")
          : "-",
        "Дуусах огноо": exam.endDate
          ? dayjs(exam.endDate).format("YYYY/MM/DD HH:mm")
          : "-",
        Нэр:
          exam.firstname && exam.lastname
            ? `${exam.lastname.charAt(0)}.${exam.firstname}`
            : "-",
        "И-мейл хаяг": exam.email || "-",
        "Тест өгсөн огноо": exam.userStartDate
          ? dayjs(exam.userStartDate).format("YYYY/MM/DD HH:mm")
          : "-",
        Төлөв: status,
        "Үр дүн": exam.userEndDate ? "93.3%" : "-",
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Шалгуулагчид");

    const fileName = `шалгуулагчид_${dayjs().format("YYYYMMDD")}.xlsx`;

    XLSX.writeFile(wb, fileName);
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
      <Spin tip="Уншиж байна..." fullscreen spinning={loading} />
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        confirmLoading={confirmLoading}
        onPurchase={handleOrganizationPurchase}
        testPrice={data[0]?.assessment.price || 0}
        balance={session?.user?.wallet}
        remaining={data?.reduce(
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
        <div className="w-full relative p-4 bg-white/70 backdrop-blur-md rounded-full shadow shadow-slate-200 overflow-hidden">
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

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative min-w-14 min-h-14 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent pt-1.5">
                    {data[0]?.assessment.icons}
                  </div>
                </div>
              </div>
              <div className="font-extrabold text-xl bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                {data[0]?.assessment.name}
              </div>
            </div>

            <div className="flex items-center gap-3 px-4">
              <div className="flex items-center gap-1">
                <GlobalLineDuotone
                  width={18}
                  height={18}
                  className="text-main"
                />
                <div>
                  Авсан эрх:
                  <span className="font-extrabold text-base text-main pl-1">
                    {data?.reduce((sum, item) => sum + item.count, 0)}
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
                    {data?.reduce(
                      (sum, item) => sum + (item.count - item.usedUserCount),
                      0
                    )}
                  </span>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="relative group pl-5 ml-3 pr-3.5 py-2 bg-gradient-to-br from-main to-secondary rounded-xl text-white font-bold shadow-lg shadow-main/20 hover:shadow-main/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-1">
                    <span>Худалдаж авах</span>
                    <RoundDoubleAltArrowRightBoldDuotone
                      width={20}
                      height={20}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 shadow-sm mt-6">
          <div className="flex items-center mb-4 justify-between">
            <h2 className="text-base font-extrabold px-1 flex items-center gap-2">
              <UserPlusBoldDuotone width={20} height={20} />
              Шалгуулагч урих
            </h2>
            <div
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-main/90 font-semibold rounded-full text-white shadow shadow-slate-200 backdrop-blur-md px-3.5 py-1.5 cursor-pointer hover:bg-main transition-colors duration-300"
            >
              <FileRemoveBoldDuotone width={18} height={18} /> Загвар татах
            </div>
          </div>
          <div className="px-1">
            <InviteTable testData={data} onSuccess={refetchData} />
          </div>
        </div>
        <div className="bg-white/70 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 shadow-sm mt-6">
          <div className="flex items-center mb-4 justify-between">
            <h2 className="text-base font-extrabold px-1 flex items-center gap-2">
              <BuildingsBoldDuotone width={20} height={20} />
              Нийт шалгуулагчид
            </h2>
            <div
              onClick={handleDownloadTable}
              className="flex items-center gap-2 bg-main/90 font-semibold
              rounded-full text-white shadow shadow-slate-200 backdrop-blur-md
              px-3.5 py-1.5 cursor-pointer hover:bg-main transition-colors
              duration-300"
            >
              <DownloadMinimalisticBoldDuotone width={18} height={18} /> Татах
            </div>
          </div>
          <div className="px-1">
            <EmployeeTable testData={data} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTests;
