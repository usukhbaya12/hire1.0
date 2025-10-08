import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Progress, Button, message, Input } from "antd";
import dayjs from "dayjs";
import {
  EyeBoldDuotone,
  EyeClosedBold,
  MagniferBoldDuotone,
  DownloadMinimalisticBoldDuotone,
  RestartLineDuotone,
  FilterLineDuotone,
  AlarmBoldDuotone,
  ClipboardBoldDuotone,
} from "solar-icons";
import * as XLSX from "xlsx";
import { customLocale } from "@/app/utils/values";
import RenewModal from "./modals/Renew";
import Link from "next/link";

const EmployeeTable = ({ testData, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isExtendModalVisible, setIsExtendModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    size: "small",
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50", "100"],
    showTotal: (total, range) => `${range[0]}-ээс ${range[1]} / Нийт ${total}`,
  });

  const transformedData = useMemo(() => {
    if (!testData || !Array.isArray(testData)) {
      console.error("Invalid testData:", testData);
      return [];
    }

    const assessmentMap = {};
    testData.forEach((test) => {
      if (test.assessment) {
        assessmentMap[test.assessment.id] = test.assessment;
      }
      if (test.assessments?.length) {
        test.assessments.forEach((assessment) => {
          if (assessment?.id) {
            assessmentMap[assessment.id] = assessment;
          }
        });
      }
    });

    const allExams = testData.flatMap((test) =>
      (test.exams || []).map((exam) => {
        let assessmentData =
          exam.assessment ||
          (exam.assessmentId && assessmentMap[exam.assessmentId]) ||
          (exam.assessmentName &&
            Object.values(assessmentMap).find(
              (a) => a.name === exam.assessmentName
            )) ||
          null;

        return { ...exam, assessment: assessmentData };
      })
    );

    return allExams.map((exam) => {
      const hasStarted = exam.userStartDate;
      const hasEnded = exam.userEndDate;
      const hasSentEmail = exam.email && !hasStarted;
      const hasExpired = !exam.userEndDate && dayjs().isAfter(exam.endDate);

      let status = "Хүлээгдэж буй";
      if (hasExpired) status = "Хэтэрсэн";
      else if (hasEnded) status = "Дууссан";
      else if (hasStarted) status = "Эхэлсэн";
      else if (hasSentEmail) status = "Илгээсэн";

      const formatDate = (date) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-";
      const firstname = exam.firstname || "";
      const lastname = exam.lastname || "";

      return {
        key: exam.id,
        date: formatDate(exam.startDate),
        name:
          firstname && lastname ? `${lastname.charAt(0)}.${firstname}` : "-",
        fullName: firstname && lastname ? `${lastname} ${firstname}` : "-",
        email: exam.email || "-",
        phone: exam.phone || "-",
        testDate: formatDate(exam.userStartDate),
        status,
        endDate: formatDate(exam.endDate),
        result: exam.result,
        value: exam.value,
        total: exam.total,
        point: exam.point,
        assessment: exam.assessment,
        visible: exam.visible,
        userStartDate: formatDate(exam.userStartDate),
        userEndDate: formatDate(exam.userEndDate),
        code: exam.code,
        assessmentName: exam.assessmentName || exam.assessment?.name || "-",
      };
    });
  }, [testData]);

  const filteredData = useMemo(() => {
    let data = transformedData;

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      data = data.filter(
        (item) =>
          item.email.toLowerCase().includes(searchLower) ||
          item.fullName.toLowerCase().includes(searchLower) ||
          item.name.toLowerCase().includes(searchLower)
      );
    }

    if (filteredInfo.status?.length) {
      data = data.filter((item) => filteredInfo.status.includes(item.status));
    }

    if (filteredInfo.visible?.length) {
      data = data.filter((item) =>
        filteredInfo.visible.includes(item.visible ? "Тийм" : "Үгүй")
      );
    }

    return data;
  }, [transformedData, searchText, filteredInfo]);

  const sortedData = useMemo(() => {
    if (!sortedInfo.columnKey || !sortedInfo.order) return filteredData;

    return [...filteredData].sort((a, b) => {
      const key = sortedInfo.columnKey;
      const order = sortedInfo.order === "ascend" ? 1 : -1;

      if (a[key] === b[key]) return 0;
      if (a[key] === "-") return order;
      if (b[key] === "-") return -order;

      if (["date", "endDate", "userEndDate"].includes(key)) {
        if (a[key] === "-" || b[key] === "-") return 0;
        return dayjs(a[key]).diff(dayjs(b[key])) * order;
      }

      if (key === "result") {
        const aVal = a.result?.point
          ? (a.result.point / a.result.total) * 100
          : parseInt(a.result?.value || 0);
        const bVal = b.result?.point
          ? (b.result.point / b.result.total) * 100
          : parseInt(b.result?.value || 0);
        return (aVal - bVal) * order;
      }

      return (a[key] < b[key] ? -1 : 1) * order;
    });
  }, [filteredData, sortedInfo]);

  const refreshData = useCallback(() => {
    if (onRefresh && typeof onRefresh === "function") {
      onRefresh();
    }
  }, [onRefresh]);

  const renderStatus = useCallback((status) => {
    const statusConfig = {
      Дууссан: {
        gradient: "from-emerald-300 to-green-300",
        border: "border-green-500",
        dot: "bg-emerald-600",
        text: "text-emerald-700",
        pulse: false,
      },
      Эхэлсэн: {
        gradient: "from-blue-50 to-blue-100",
        border: "border-blue-200",
        dot: "bg-blue-500",
        text: "text-blue-700",
        pulse: true,
      },
      Илгээсэн: {
        gradient: "from-amber-50 to-amber-100",
        border: "border-amber-200",
        dot: "bg-amber-500",
        text: "text-amber-700",
        pulse: true,
      },
      Хэтэрсэн: {
        gradient: "from-red-200 to-red-300",
        border: "border-red-400",
        dot: "bg-red-600",
        text: "text-red-700",
        pulse: true,
      },
      "Хүлээгдэж буй": {
        gradient: "from-amber-50 to-amber-100",
        border: "border-amber-200",
        dot: "bg-amber-500",
        text: "text-amber-700",
        pulse: true,
      },
    };

    const config = statusConfig[status] || statusConfig["Хүлээгдэж буй"];

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} ${config.border} border shadow-sm`}
      >
        <div
          className={`w-2 h-2 ${config.dot} rounded-full ${
            config.pulse ? "animate-pulse" : ""
          }`}
        ></div>
        <span className={`text-xs font-bold ${config.text}`}>{status}</span>
      </div>
    );
  }, []);

  const statusMap = {
    Илгээсэн: "Мэйл илгээсэн",
    Хэтэрсэн: "Хугацаа хэтэрсэн",
    Дууссан: "Дууссан",
    Эхэлсэн: "Эхэлсэн",
    "Хүлээгдэж буй": "Хүлээгдэж буй",
  };

  const handleDownloadTable = useCallback(() => {
    const exportData = sortedData.map((item, index) => ({
      "№": index + 1,
      "Илгээсэн огноо": item.date,
      "Тест дуусах огноо": item.endDate,
      "Шалгуулагчийн нэр": item.fullName,
      "И-мэйл": item.email,
      "Утасны дугаар": item.phone,
      "Тестийн нэр": item.assessmentName,
      "Тестийн төрөл": item.assessment?.type
        ? item.assessment.type === 10
          ? "Зөв хариулттай"
          : "Өөрийн үнэлгээ"
        : "-",
      "Эхэлсэн огноо": item.userStartDate,
      "Дууссан огноо": item.userEndDate,
      Төлөв: statusMap[item.status],
      "Шалгуулагч үр дүнгээ харах эсэх": item.visible ? "Тийм" : "Үгүй",
      "Үр дүн":
        item.assessment?.type === 10 || item.assessment?.type === 11
          ? `${((item.result?.point / item.result?.total) * 100).toFixed(1)}%`
          : item.result?.result,
      Тайлбар: item.result?.value || "",
      ...(item.assessment?.type === 10 || item.assessment?.type === 11
        ? {
            "Авах оноо": item.result?.total || "-",
            "Авсан оноо": item.result?.point || "-",
          }
        : {}),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 30 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 30 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Шалгуулагчид");

    const fileName = `${
      testData[0]?.assessment?.name || "export"
    }_${dayjs().format("YYYYMMDD")}.xlsx`;
    XLSX.writeFile(wb, fileName);
  }, [sortedData, testData]);

  const handleTableChange = useCallback((paginationConfig, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
    setPagination((prev) => ({
      ...prev,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchText("");
    setFilteredInfo({});
    setSortedInfo({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchText(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const showExtendModal = useCallback((record) => {
    setSelectedExam(record);
    setIsExtendModalVisible(true);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: "Илгээсэн огноо",
        dataIndex: "date",
        key: "date",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "date" && sortedInfo.order,
        render: (text) => <span className="text-gray-700">{text}</span>,
        width: 80,
      },
      {
        title: "Дуусах огноо",
        dataIndex: "endDate",
        key: "endDate",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "endDate" && sortedInfo.order,
        render: (text, record) => {
          return (
            <div>
              <span className="text-gray-700">{text}</span>
            </div>
          );
        },
        width: 100,
      },
      {
        title: "Шалгуулагч",
        key: "user",
        dataIndex: "name",
        render: (text, record) => (
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative min-w-10 min-h-10 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                <div className="text-base font-bold uppercase bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                  {record?.name?.[0]}
                </div>
              </div>
            </div>
            <div className="leading-4">
              <div className="font-bold">{record.name}</div>
              <div className="text-gray-700 text-xs">{record.email}</div>
            </div>
          </div>
        ),
        width: 80,
      },
      {
        title: "Тест өгсөн",
        dataIndex: "userEndDate",
        key: "userEndDate",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "userEndDate" && sortedInfo.order,
        render: (text) => <span className="text-gray-700">{text}</span>,
        width: 100,
      },
      {
        title: "Төлөв",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Дууссан", value: "Дууссан" },
          { text: "Эхэлсэн", value: "Эхэлсэн" },
          { text: "Хугацаа хэтэрсэн", value: "Хэтэрсэн" },
          { text: "Мэйл илгээсэн", value: "Илгээсэн" },
          { text: "Хүлээгдэж буй", value: "Хүлээгдэж буй" },
        ],
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status === value,
        sorter: true,
        sortOrder: sortedInfo.columnKey === "status" && sortedInfo.order,
        render: renderStatus,
        width: 100,
      },
      {
        title: "Үр дүн",
        dataIndex: "result",
        key: "result",
        sorter: true,
        sortOrder: sortedInfo.columnKey === "result" && sortedInfo.order,
        render: (result, record) => {
          if (!result) return "-";

          const reportType = record.assessment?.report || 10;

          if (reportType === 10 || reportType === 11) {
            const percent = result.total
              ? Math.round((result.point / result.total) * 100)
              : 0;
            return (
              <div className="flex items-center gap-2">
                <Progress
                  size="small"
                  percent={percent}
                  format={(percent) => `${percent}%`}
                  strokeColor={{
                    "0%": "#FF8400",
                    "100%": "#FF5C00",
                  }}
                />
                <span>
                  ({result.point}/{result.total})
                </span>
              </div>
            );
          }

          return (
            <div className="font-extrabold">
              {result.result && result.value
                ? `${result.result} / ${result.value}`
                : result.value || result.result || "-"}
            </div>
          );
        },
        width: 180,
      },
      {
        title: "Шалгуулагч үр дүнгээ харах эсэх",
        dataIndex: "visible",
        key: "visible",
        filters: [
          { text: "Тийм", value: "Тийм" },
          { text: "Үгүй", value: "Үгүй" },
        ],
        filteredValue: filteredInfo.visible || null,
        onFilter: (value, record) =>
          (record.visible ? "Тийм" : "Үгүй") === value,
        render: (visible) =>
          visible ? (
            <div className="text-gray-700 flex items-center gap-1">
              <EyeBoldDuotone width={18} /> Тийм
            </div>
          ) : (
            <div className="text-gray-700 flex items-center gap-1">
              <EyeClosedBold width={18} /> Үгүй
            </div>
          ),
        width: 80,
      },
      {
        title: "Тайлан",
        key: "action",
        width: 100,
        render: (_, record) => {
          const isReportAvailable = record.status === "Дууссан";
          const isExpired =
            dayjs(record.endDate).isBefore(dayjs()) &&
            record.userEndDate === "-";

          return (
            <>
              {isReportAvailable && (
                <Link
                  href={`/api/report/${record.code}?display=inline`}
                  target="_blank"
                  passHref
                >
                  <Button className="link-btn-2 border-none">
                    <ClipboardBoldDuotone width={18} />
                    Тайлан
                  </Button>
                </Link>
              )}

              {isExpired && (
                <Button
                  className="link-btn-3 border-none"
                  onClick={() => showExtendModal(record)}
                >
                  <AlarmBoldDuotone width={18} />
                  Сунгах
                </Button>
              )}
            </>
          );
        },
      },
    ],
    [sortedInfo, filteredInfo, renderStatus, showExtendModal]
  );

  return (
    <div>
      <div className="flex mb-4 gap-2 items-center">
        <Input
          placeholder="Шалгуулагч хайх"
          value={searchText}
          onChange={handleSearchChange}
          prefix={
            <MagniferBoldDuotone color={"#f36421"} width={18} height={18} />
          }
          style={{ width: 270 }}
          allowClear
        />

        <Button onClick={handleReset} className="stroked-btn">
          <FilterLineDuotone width={18} height={18} />
        </Button>
        <div className="flex-1"></div>
        <Button onClick={refreshData} className="stroked-btn">
          <RestartLineDuotone width={18} height={18} />
        </Button>
        <Button
          onClick={handleDownloadTable}
          className="stroked-btn flex items-center gap-2"
        >
          <DownloadMinimalisticBoldDuotone width={18} height={18} />
          Excel татах
        </Button>
      </div>

      <Table
        locale={customLocale}
        loading={loading}
        columns={columns}
        dataSource={sortedData}
        pagination={{
          ...pagination,
          total: sortedData.length,
        }}
        onChange={handleTableChange}
        className="test-history-table overflow-x-auto"
        rowClassName="hover:bg-gray-50 transition-colors"
      />

      {selectedExam && (
        <RenewModal
          isVisible={isExtendModalVisible}
          onClose={() => setIsExtendModalVisible(false)}
          examData={selectedExam}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
