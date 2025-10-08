import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Table, Tag, Button, Input, message, DatePicker, Progress } from "antd";
import {
  MagniferBoldDuotone,
  EyeBoldDuotone,
  EyeClosedBold,
  ClipboardBoldDuotone,
  FilterBoldDuotone,
  CalendarBoldDuotone,
  DownloadBoldDuotone,
  AlarmBoldDuotone,
  RestartLineDuotone,
} from "solar-icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { customLocale } from "@/app/utils/values";
import Link from "next/link";
import RenewModal from "./modals/Renew";

const ApplicantsTable = ({ data, loading, onRefresh }) => {
  const [applicants, setApplicants] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [exporting, setExporting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [tableFilters, setTableFilters] = useState({});
  const [tableSorters, setTableSorters] = useState({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  });

  const [isExtendModalVisible, setIsExtendModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const testNames = useMemo(() => {
    if (!applicants.length) return [];
    const uniqueTests = [
      ...new Set(applicants.map((item) => item.assessmentName)),
    ];
    return uniqueTests.map((name) => ({ text: name, value: name }));
  }, [applicants]);

  const statusFilters = useMemo(
    () => [
      { text: "Мэйл илгээсэн", value: "sent" },
      { text: "Эхэлсэн", value: "started" },
      { text: "Дууссан", value: "completed" },
      { text: "Хугацаа хэтэрсэн", value: "renew" },
    ],
    []
  );

  useEffect(() => {
    if (!data?.length) {
      setApplicants([]);
      return;
    }

    const flattenedData = data.reduce((acc, item) => {
      if (!item.exams?.length) return acc;

      const examEntries = item.exams.map((exam) => ({
        examId: exam.id,
        testId: item.id,
        assessmentId: item.assessment.id,
        assessmentName: item.assessment.name,
        firstname: exam.firstname,
        lastname: exam.lastname,
        email: exam.email,
        phone: exam.phone,
        userStartDate: exam.userStartDate,
        userEndDate: exam.userEndDate,
        code: exam.code,
        result: exam.result,
        value: exam.value,
        point: exam.point,
        total: exam.total,
        testType: item.assessment.type,
        visible: exam.visible || false,
        startDate: exam.startDate,
        endDate: exam.endDate,
      }));

      return [...acc, ...examEntries];
    }, []);

    setApplicants(flattenedData);
  }, [data]);

  const filteredApplicants = useMemo(() => {
    let filtered = [...applicants];

    if (startDate && endDate) {
      const startTs = startDate.startOf("day").valueOf();
      const endTs = endDate.endOf("day").valueOf();

      filtered = filtered.filter((item) => {
        if (!item.userStartDate && !item.userEndDate) return true;

        const itemStartTs = item.userStartDate
          ? new Date(item.userStartDate).getTime()
          : 0;
        const itemEndTs = item.userEndDate
          ? new Date(item.userEndDate).getTime()
          : 0;

        return (
          (itemStartTs >= startTs && itemStartTs <= endTs) ||
          (itemEndTs >= startTs && itemEndTs <= endTs) ||
          (itemStartTs <= startTs && (itemEndTs >= endTs || !itemEndTs))
        );
      });
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((item) => {
        const firstname = (item.firstname || "").toLowerCase();
        const lastname = (item.lastname || "").toLowerCase();
        const email = (item.email || "").toLowerCase();
        const fullName = `${firstname} ${lastname}`;

        return (
          firstname.includes(searchLower) ||
          lastname.includes(searchLower) ||
          email.includes(searchLower) ||
          fullName.includes(searchLower)
        );
      });
    }

    if (tableFilters.assessmentName?.length) {
      filtered = filtered.filter((item) =>
        tableFilters.assessmentName.includes(item.assessmentName)
      );
    }

    if (tableFilters.status?.length) {
      filtered = filtered.filter((item) => {
        let itemStatus;

        if (!item.userEndDate && dayjs().isAfter(dayjs(item.endDate))) {
          itemStatus = "renew";
        } else if (!item.userStartDate && !item.userEndDate) {
          itemStatus = "sent";
        } else if (item.userStartDate && !item.userEndDate) {
          itemStatus = "started";
        } else {
          itemStatus = "completed";
        }

        return tableFilters.status.includes(itemStatus);
      });
    }

    if (tableSorters.field) {
      filtered = [...filtered].sort((a, b) => {
        if (tableSorters.field === "endDate") {
          if (!a.userEndDate && !b.userEndDate) return 0;
          if (!a.userEndDate) return tableSorters.order === "ascend" ? 1 : -1;
          if (!b.userEndDate) return tableSorters.order === "ascend" ? -1 : 1;
          const result = new Date(a.userEndDate) - new Date(b.userEndDate);
          return tableSorters.order === "ascend" ? result : -result;
        }
        return 0;
      });
    }

    return filtered;
  }, [applicants, searchText, startDate, endDate, tableFilters, tableSorters]);

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleStartDateChange = useCallback((date) => {
    setStartDate(date);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleEndDateChange = useCallback((date) => {
    setEndDate(date);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = useCallback((paginationInfo, filters, sorter) => {
    setTableFilters(filters);
    setTableSorters(sorter);
    setPagination(paginationInfo);
  }, []);

  const clearAll = useCallback(() => {
    setSearchText("");
    setStartDate(dayjs().subtract(1, "month"));
    setEndDate(dayjs());
    setTableFilters({});
    setTableSorters({});
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const exportToExcel = useCallback(() => {
    try {
      setExporting(true);

      const exportData = filteredApplicants.map((item, index) => ({
        "№": index + 1,
        "Илгээсэн огноо": formatDate(item.startDate),
        "Тест дуусах огноо": formatDate(item.endDate),
        "Шалгуулагчийн нэр": `${item.firstname} ${item.lastname}`,
        "И-мэйл": item.email,
        "Утасны дугаар": item.phone,
        "Тестийн нэр": item.assessmentName,
        "Тестийн төрөл": item.testType
          ? item.testType === 10
            ? "Зөв хариулттай"
            : "Өөрийн үнэлгээ"
          : "-",
        "Эхэлсэн огноо": item.userStartDate
          ? formatDate(item.userStartDate)
          : "-",
        "Дууссан огноо": item.userEndDate ? formatDate(item.userEndDate) : "-",
        Төлөв:
          !item.userEndDate && dayjs().isAfter(item.endDate)
            ? "Хугацаа хэтэрсэн"
            : !item.userStartDate && !item.userEndDate
            ? "Мэйл илгээсэн"
            : item.userStartDate && !item.userEndDate
            ? "Эхэлсэн"
            : "Дууссан",
        "Шалгуулагч үр дүнгээ харах эсэх": item.visible ? "Тийм" : "Үгүй",
        "Үр дүн":
          item.testType === 10 || item.testType === 11
            ? `${((item.result?.point / item.result?.total) * 100).toFixed(1)}%`
            : item.result?.result,
        Тайлбар: item.result?.value ? item.result?.value : "",
        ...(item.testType === 10 || item.testType === 11
          ? {
              "Авах оноо": item.result?.total || "-",
              "Авсан оноо": item.result?.point || "-",
            }
          : {}),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [
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

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Шалгуулагчид");

      const filename = `Шалгуулагчид_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(workbook, filename);

      messageApi.success("Excel файл амжилттай татагдлаа.");
    } catch (error) {
      console.error("Excel export error:", error);
      messageApi.error("Excel файл татахад алдаа гарлаа.");
    } finally {
      setExporting(false);
    }
  }, [filteredApplicants, messageApi]);

  const formatDate = useCallback((date) => {
    return date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-";
  }, []);

  const getStatusTag = useCallback((record) => {
    if (!record.userEndDate && dayjs().isAfter(dayjs(record.endDate))) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-200 to-red-300 border border-red-400 shadow-sm">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-red-700">Хэтэрсэн</span>
        </div>
      );
    } else if (!record.userStartDate && !record.userEndDate) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-amber-700">Илгээсэн</span>
        </div>
      );
    } else if (record.userStartDate && !record.userEndDate) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-200 to-blue-100 border border-blue-300 shadow-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-semibold text-blue-700">Эхэлсэн</span>
        </div>
      );
    } else if (record.userEndDate) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-300 to-green-300 border border-green-500 shadow-sm">
          <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
          <span className="text-xs font-bold text-emerald-700">Дууссан</span>
        </div>
      );
    }
    return <Tag color="default">-</Tag>;
  }, []);

  const getScore = useCallback((record) => {
    if (!record.userEndDate || !record.result) {
      return <span className="text-gray-400">-</span>;
    }

    if (record.testType === 20) {
      const result = record.result.result;
      const value = record.result.value;

      return (
        <div className="flex items-center font-extrabold">
          <div>{result || ""}</div>
          {value && (
            <>
              <span className="px-1">/</span>
              <div>{value}</div>
            </>
          )}
        </div>
      );
    } else {
      const percentage = Math.round(
        (record.result.point / record.result.total) * 100
      );
      return (
        <div className="flex items-center gap-2">
          <Progress
            className="min-w-4"
            size="small"
            percent={percentage}
            strokeColor={{
              "0%": "#FF8400",
              "100%": "#FF5C00",
            }}
          />
          <span>
            ({record.result.point}/{record.result.total})
          </span>
        </div>
      );
    }
  }, []);

  const showExtendModal = useCallback((record) => {
    setSelectedExam(record);
    setIsExtendModalVisible(true);
  }, []);

  const refreshData = useCallback(() => {
    if (onRefresh && typeof onRefresh === "function") {
      onRefresh();
    }
  }, [onRefresh]);

  const columns = useMemo(
    () => [
      {
        title: "№",
        key: "index",
        width: 60,
        render: (_, __, index) => {
          const { current = 1, pageSize = 10 } = pagination;
          return (current - 1) * pageSize + index + 1;
        },
      },
      {
        title: "Шалгуулагчийн нэр",
        key: "user",
        render: (record) => {
          const firstname = record.firstname || "-";
          const lastname = record.lastname || "";
          const email = record.email || "-";
          const initial = firstname ? firstname[0].toUpperCase() : "A";

          return (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative min-w-10 min-h-10 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                  <div className="text-base font-bold uppercase bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                    {initial}
                  </div>
                </div>
              </div>
              <div className="leading-4">
                <div className="font-bold">
                  {firstname} {lastname}
                </div>
                <div className="text-gray-700 text-xs">{email}</div>
              </div>
            </div>
          );
        },
      },
      {
        title: "Тестийн нэр",
        key: "assessmentName",
        dataIndex: "assessmentName",
        filters: testNames,
        filteredValue: tableFilters.assessmentName || null,
        render: (_, record) => (
          <Link
            href={`/tests/${record.assessmentId}`}
            className="font-bold text-main hover:underline hover:text-secondary transition-colors"
          >
            {record.assessmentName}
          </Link>
        ),
      },
      {
        title: "Дууссан огноо",
        key: "endDate",
        dataIndex: "endDate",
        sorter: true,
        sortOrder: tableSorters.field === "endDate" && tableSorters.order,
        render: (_, record) => (
          <div className="flex items-center gap-2">
            <span>{formatDate(record.userEndDate)}</span>
          </div>
        ),
      },
      {
        title: "Төлөв",
        key: "status",
        filters: statusFilters,
        filteredValue: tableFilters.status || null,
        render: (_, record) => getStatusTag(record),
        width: 100,
      },
      {
        title: "Үр дүн",
        key: "score",
        render: (_, record) => getScore(record),
        width: 200,
      },
      {
        title: "Шалгуулагч үр дүнгээ харах эсэх",
        dataIndex: "visible",
        key: "visible",
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
        width: 120,
      },
      {
        title: "Үйлдэл",
        key: "action",
        align: "right",
        render: (_, record) =>
          !record.userEndDate && dayjs().isAfter(record.endDate) ? (
            <Button
              className="link-btn-3 border-none"
              onClick={() => showExtendModal(record)}
            >
              <AlarmBoldDuotone width={18} />
              Сунгах
            </Button>
          ) : record.userEndDate && record.result ? (
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
          ) : null,
        align: "center",
      },
    ],
    [
      pagination,
      testNames,
      tableFilters,
      tableSorters,
      statusFilters,
      formatDate,
      getStatusTag,
      getScore,
      showExtendModal,
    ]
  );

  return (
    <>
      {contextHolder}
      <div className="mb-5 flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center flex-wrap">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full lg:w-auto flex-wrap">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Шалгуулагч хайх"
              value={searchText}
              onChange={handleSearch}
              prefix={
                <MagniferBoldDuotone color={"#f36421"} width={18} height={18} />
              }
              allowClear
              className="pr-8"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <CalendarBoldDuotone
                className="text-main"
                width={18}
                height={18}
              />
              <DatePicker
                placeholder="Эхлэх огноо"
                format="YYYY-MM-DD"
                value={startDate}
                onChange={handleStartDateChange}
                className="min-w-32"
              />
            </div>
            <span className="text-gray-400">-</span>
            <DatePicker
              placeholder="Дуусах огноо"
              format="YYYY-MM-DD"
              value={endDate}
              onChange={handleEndDateChange}
              className="min-w-32"
            />
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Button onClick={refreshData} className="stroked-btn">
            <RestartLineDuotone width={18} height={18} />
          </Button>

          <Button
            className="stroked-btn"
            onClick={exportToExcel}
            loading={exporting}
          >
            <DownloadBoldDuotone width={18} height={18} />
            Excel татах
          </Button>
        </div>
      </div>
      <Table
        className="applicants-table overflow-x-auto"
        dataSource={filteredApplicants}
        loading={loading}
        rowKey={(record) => record.examId}
        pagination={{
          ...pagination,
          total: filteredApplicants.length,
          size: "small",
          showTotal: (total, range) =>
            `${range[0]}-ээс ${range[1]} / Нийт ${total}`,
        }}
        onChange={handleTableChange}
        locale={customLocale}
        columns={columns}
      />
      {selectedExam && (
        <RenewModal
          isVisible={isExtendModalVisible}
          onClose={() => setIsExtendModalVisible(false)}
          examData={selectedExam}
          onSuccess={refreshData}
        />
      )}
    </>
  );
};

export default ApplicantsTable;
