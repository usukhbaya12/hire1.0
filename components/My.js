import React, { useEffect, useState } from "react";
import { Table, Button, Divider, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import {
  GraphUpBoldDuotone,
  CalendarBoldDuotone,
  MoneyBagBoldDuotone,
  QrCodeBoldDuotone,
} from "solar-icons";
import { getPaymentHistory } from "@/app/api/main";
import { customLocale } from "@/app/utils/values";
import { LoadingOutlined } from "@ant-design/icons";

const HistoryTabContent = ({ session, onBarimtOpen }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [messageApi, contextHolder] = message.useMessage();

  // Separate function to fetch data
  const fetchData = async (
    page = pagination.current,
    pageSize = pagination.pageSize
  ) => {
    try {
      setLoading(true);
      const paymentRes = await getPaymentHistory(
        0,
        session?.user?.id,
        page,
        pageSize
      );

      if (paymentRes.success) {
        setPaymentData(paymentRes.data);
        setTotalCount(paymentRes.data?.payments.count || 0);
        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: pageSize,
          total: paymentRes.data?.payments.count || 0,
        }));
      }
    } catch (error) {
      console.error("GET / Алдаа гарлаа..", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (session?.user?.id) {
      fetchData(1, 10); // Reset to first page with default page size
    }
  }, [session?.user?.id]);

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    fetchData(page, pageSize);
  };

  console.log("f", paymentData);
  console.log("gg", totalCount);

  return (
    <>
      {contextHolder}
      <div className="shadow shadow-slate-200 rounded-3xl p-6 bg-white/40 backdrop-blur-md space-y-6">
        <h2 className="flex text-base font-extrabold px-1 items-center gap-2">
          <GraphUpBoldDuotone width={20} height={20} />
          Гүйлгээний түүх
        </h2>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          <Table
            className="test-history-table overflow-x-auto"
            dataSource={paymentData?.payments.data || []}
            rowKey={(record, index) => index}
            loading={{
              spinning: loading,
              indicator: (
                <Spin
                  size="default"
                  indicator={
                    <LoadingOutlined
                      style={{ color: "#f26522", fontSize: 16 }}
                      spin
                    />
                  }
                />
              ),
            }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              size: "small",
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showTotal: (total, range) =>
                `${range[0]}-ээс ${range[1]} / Нийт ${total}`,
              onChange: handlePaginationChange,
              onShowSizeChange: handlePaginationChange,
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
                title: "Тестийн нэр",
                dataIndex: ["assessment", "name"],
                key: "name",
                render: (assessment, record) => (
                  <div className="flex items-start gap-2">
                    {assessment ? (
                      <div className="flex">
                        <div
                          className="font-bold text-main cursor-pointer hover:underline underline-offset-4"
                          onClick={() =>
                            router.push(`/test/${record.assessment.id}`)
                          }
                        >
                          {typeof assessment === "string"
                            ? assessment
                            : assessment?.name || ""}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          Хэтэвч цэнэглэсэн
                        </div>
                        <div className="text-xs font-semibold text-gray-600 pt-1">
                          {record.message}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                title: "Төлбөрийн хэлбэр",
                dataIndex: "price",
                key: "price",
                align: "right",
                render: (price, record) => (
                  <div className="inline-flex items-center gap-2">
                    <QrCodeBoldDuotone width={16} />
                    QPay
                    <div className="inline-flex items-center justify-end gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-50 text-red-700">
                      <MoneyBagBoldDuotone className="w-3.5 h-3.5" />
                      <span>{price.toLocaleString()}₮</span>
                    </div>
                  </div>
                ),
              },
              {
                title: "Төлбөрийн баримт",
                key: "receipt",
                align: "center",
                render: (_, record) => (
                  <div className="inline-flex items-center gap-2">
                    <div className="flex justify-center">
                      <Button
                        className="link-btn-2 border-none"
                        onClick={() => {
                          onBarimtOpen(
                            record.serviceId,
                            record.assessment?.name
                          );
                        }}
                      >
                        <img src="/ebarimt.png" width={20} alt="E-Barimt" />
                      </Button>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Mobile Cards */}
        <div className="block sm:hidden">
          {paymentData?.payments.data?.map((record, index) => (
            <div
              key={index}
              className="rounded-3xl p-4 bg-white px-6 mb-4 shadow shadow-slate-200"
            >
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <CalendarBoldDuotone width={18} className="-mt-1" />
                {new Date(record.paymentDate).toLocaleDateString()}
              </div>
              <div className="flex items-start gap-2 mb-3">
                <div
                  className="pt-2 font-bold text-lg text-main cursor-pointer hover:underline underline-offset-4"
                  onClick={() => router.push(`/test/${record.assessment.id}`)}
                >
                  {record.assessment?.name}
                </div>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src="/qpay.png" alt="QPay" width={40} />
                  <span className="px-2">•</span>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700">
                    <MoneyBagBoldDuotone className="w-4 h-4" />
                    <span>{record.price.toLocaleString()}₮</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    className="link-btn-2 border-none"
                    onClick={() => {
                      onBarimtOpen(record.serviceId, record.assessment?.name);
                    }}
                  >
                    <img src="/ebarimt.png" width={20} alt="E-Barimt" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HistoryTabContent;
