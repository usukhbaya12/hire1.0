import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import {
  Wallet2BoldDuotone,
  RefreshCircleBoldDuotone,
  RoundDoubleAltArrowRightBoldDuotone,
  MoneyBagBoldDuotone,
  HistoryBoldDuotone,
  GraphUpBoldDuotone,
  CalendarBoldDuotone,
  Card2,
} from "solar-icons";
import { getCurrentUser, getPaymentHistory } from "@/app/api/main";
import PaymentHistoryChart from "@/components/Payment";
import { customLocale } from "@/app/utils/values";

const WalletTabContent = ({ session, onRechargeOpen }) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [paymentRes, userDataRes] = await Promise.all([
          getPaymentHistory(0, session?.user?.id, 1, 10),
          getCurrentUser(),
        ]);

        if (paymentRes.success) {
          setPaymentData(paymentRes.data);
        }
        if (userDataRes.success) {
          setUserData(userDataRes.data);
        }
      } catch (error) {
        console.error("GET / Алдаа гарлаа.", error);
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id]);

  const refreshBalance = async () => {
    setIsRefreshing(true);
    try {
      const userDataRes = await getCurrentUser();
      if (userDataRes.success) {
        setUserData(userDataRes.data);
      }
    } catch (error) {
      console.error("Үлдэгдэл шинэчлэхэд алдаа гарлаа.:", error);
      messageApi.error("Үлдэгдэл шинэчлэхэд алдаа гарлаа.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="md:shadow md:shadow-slate-200 md:rounded-3xl md:p-6 md:bg-white/40 md:backdrop-blur-md">
        <h2 className="hidden md:flex text-base font-extrabold px-1 items-center gap-2">
          <Wallet2BoldDuotone width={20} height={20} />
          Хэтэвч
        </h2>

        {/* Wallet Balance Card */}
        <div className="w-full relative mt-0 sm:mt-6 p-6 bg-white/70 backdrop-blur-md rounded-3xl shadow shadow-slate-200 overflow-hidden">
          <div className="relative flex justify-between items-center gap-4 sm:gap-5">
            <div className="relative flex items-center gap-4 sm:gap-5">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative min-w-16 min-h-16 sm:min-w-24 sm:min-h-24 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                  <div className="text-main pt-1.5">
                    <Wallet2BoldDuotone width={40} height={40} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <div className="-mt-0.5 sm:mt-0 flex items-center gap-2 text-gray-700">
                    <span className="font-medium">Үлдэгдэл</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-extrabold text-xl bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {userData?.wallet?.toLocaleString()}₮
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={refreshBalance}
                disabled={isRefreshing}
                className="flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                title="Үлдэгдэл шинэчлэх"
              >
                <RefreshCircleBoldDuotone
                  width={32}
                  height={32}
                  className={`text-main -mt-0.5 ${
                    isRefreshing ? "animate-spin opacity-50" : ""
                  }`}
                />
              </button>
              <button
                onClick={onRechargeOpen}
                className="relative group pl-4 pr-3 py-2 bg-gradient-to-br from-main to-secondary rounded-xl text-white font-bold shadow-lg shadow-main/20 hover:shadow-main/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-1">
                  <span className="hidden xl:block">Цэнэглэх</span>
                  <RoundDoubleAltArrowRightBoldDuotone width={20} height={20} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow shadow-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-medium">
                  Нийт зарцуулалт
                </div>
                <div className="text-xl font-bold text-red-500 mt-1">
                  {paymentData?.payments.data
                    .reduce(
                      (sum, item) => sum + (item.assessment ? item.price : 0),
                      0
                    )
                    .toLocaleString()}
                  ₮
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <MoneyBagBoldDuotone className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow shadow-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-medium">
                  Нийт цэнэглэлт
                </div>
                <div className="text-xl font-bold text-green-500 mt-1">
                  {paymentData?.payments.data
                    ?.reduce(
                      (sum, item) => sum + (!item.assessment ? item.price : 0),
                      0
                    )
                    .toLocaleString()}
                  ₮
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <MoneyBagBoldDuotone className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow shadow-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-medium">
                  Гүйлгээний тоо
                </div>
                <div className="text-xl font-bold text-blue-500 mt-1">
                  {paymentData?.payments.data?.length || 0}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <HistoryBoldDuotone className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Chart */}
        {paymentData?.payments.data && paymentData.payments.data.length > 0 && (
          <PaymentHistoryChart paymentData={paymentData.payments.data} />
        )}

        {/* Payment History Table */}
        <div className="bg-white/40 shadow shadow-slate-200 backdrop-blur-md rounded-3xl p-6 shadow-sm mt-6">
          <h2 className="text-base font-extrabold mb-4 px-1 flex items-center gap-2">
            <GraphUpBoldDuotone width={20} />
            Гүйлгээний түүх
          </h2>
          <Table
            className="test-history-table overflow-x-auto"
            dataSource={paymentData?.payments.data || []}
            loading={loading}
            rowKey={(record, index) => index}
            pagination={{
              pageSize: 10,
              size: "small",
              hideOnSinglePage: true,
              showSizeChanger: false,
            }}
            locale={customLocale}
            rowClassName={(record) =>
              record.assessment ? "" : "bg-orange-50/30"
            }
            columns={[
              {
                title: "Огноо",
                dataIndex: "paymentDate",
                key: "date",
                render: (text) => (
                  <div className="flex items-center gap-2">
                    <CalendarBoldDuotone className="text-gray-400 w-4 h-4" />
                    <span className="text-sm text-gray-700">
                      {new Date(text).toLocaleDateString()}
                    </span>
                  </div>
                ),
              },
              {
                title: "Худалдан авалтын төрөл",
                dataIndex: ["assessment", "name"],
                key: "name",
                render: (assessment, record) => (
                  <div className="flex items-start gap-2">
                    {assessment ? (
                      <div className="flex">
                        <div className="font-bold text-main cursor-pointer hover:underline underline-offset-4">
                          {typeof assessment === "string"
                            ? assessment
                            : assessment?.name || ""}
                        </div>
                        {/* <div className="text-gray-700 font-medium">
                          <span className="px-2">•</span>
                          {Math.abs(record.price / record.assessment.price)} эрх
                        </div> */}
                      </div>
                    ) : (
                      <>
                        <Card2 className="text-orange-500 w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            Хэтэвч цэнэглэсэн
                          </div>
                          <div className="text-xs font-semibold text-gray-600 pt-1">
                            {record.message}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ),
              },
              {
                title: "Үнийн дүн",
                dataIndex: "price",
                key: "price",
                align: "right",
                render: (price, record) => (
                  <div
                    className={`inline-flex items-center justify-end gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      record.assessment
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    <MoneyBagBoldDuotone className="w-3.5 h-3.5" />
                    <span>
                      {record.assessment ? "" : "+"}
                      {price.toLocaleString()}₮
                    </span>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default WalletTabContent;
