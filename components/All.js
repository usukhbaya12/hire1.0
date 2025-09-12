import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Tooltip,
  Tag,
  Button,
  Empty,
  Input,
  message,
  DatePicker,
  Space,
  Progress,
} from "antd";
import {
  MagniferBoldDuotone,
  CheckCircleBoldDuotone,
  ClockCircleBoldDuotone,
  MouseBoldDuotone,
  DocumentTextBoldDuotone,
  ChartSquareBoldDuotone,
  EyeBoldDuotone,
  EyeClosedBold,
  ClipboardBoldDuotone,
  ExportBoldDuotone,
  FilterBoldDuotone,
  CalendarBoldDuotone,
  DownloadBoldDuotone,
} from "solar-icons";
import { getReport } from "@/app/api/exam";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { customLocale } from "@/app/utils/values";
import Link from "next/link";

const ApplicantsTable = ({ data, loading }) => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [exporting, setExporting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(dayjs().subtract(1, "month"));
  const [endDate, setEndDate] = useState(dayjs());
  const [tableFilters, setTableFilters] = useState({});
  const [tableSorters, setTableSorters] = useState({});

  // Get unique test names for filter options
  const getTestNames = () => {
    if (!applicants.length) return [];

    const uniqueTests = [
      ...new Set(applicants.map((item) => item.assessmentName)),
    ];
    return uniqueTests.map((name) => ({
      text: name,
      value: name,
    }));
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      setApplicants([]);
      setFilteredApplicants([]);
      return;
    }

    const flattenedData = data.reduce((acc, item) => {
      if (!item.exams || item.exams.length === 0) {
        return acc;
      }

      const examEntries = item.exams.map((exam) => ({
        examId: exam.id,
        testId: item.id,
        assessmentId: item.assessment.id,
        assessmentName: item.assessment.name,
        firstname: exam.firstname,
        lastname: exam.lastname,
        email: exam.email,
        phone: exam.phone,
        startDate: exam.userStartDate,
        endDate: exam.userEndDate,
        code: exam.code,
        result: exam.result,
        testType: item.assessment.type,
        visible: exam.visible || false,
      }));

      return [...acc, ...examEntries];
    }, []);

    setApplicants(flattenedData);
    applyFilters(flattenedData, searchText, startDate, endDate);
  }, [data]);

  // Apply all filters (search, date, table filters)
  const applyFilters = (data, search, start, end) => {
    // First apply date filter if available
    let filtered = data;

    if (start && end) {
      const startTimestamp = start.startOf("day").valueOf();
      const endTimestamp = end.endOf("day").valueOf();

      filtered = data.filter((item) => {
        // If no dates are available, include it (show items with pending status)
        if (!item.startDate && !item.endDate) return true;

        const itemStartDate = item.startDate
          ? new Date(item.startDate).getTime()
          : 0;
        const itemEndDate = item.endDate ? new Date(item.endDate).getTime() : 0;

        // Check if start date or end date is within range
        return (
          (itemStartDate >= startTimestamp && itemStartDate <= endTimestamp) ||
          (itemEndDate >= startTimestamp && itemEndDate <= endTimestamp) ||
          (itemStartDate <= startTimestamp &&
            (itemEndDate >= endTimestamp || !itemEndDate))
        );
      });
    }

    // Then apply search filter if available
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((item) => {
        const firstnameLower = (item.firstname || "").toLowerCase();
        const lastnameLower = (item.lastname || "").toLowerCase();
        const emailLower = (item.email || "").toLowerCase();
        const fullName = `${firstnameLower} ${lastnameLower}`;

        return (
          firstnameLower.includes(searchLower) ||
          lastnameLower.includes(searchLower) ||
          emailLower.includes(searchLower) ||
          fullName.includes(searchLower)
        );
      });
    }

    setFilteredApplicants(filtered);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    applyFilters(applicants, value, startDate, endDate);
  };

  // Handle start date change
  const handleStartDateChange = (date) => {
    setStartDate(date);
    applyFilters(applicants, searchText, date, endDate);
  };

  // Handle end date change
  const handleEndDateChange = (date) => {
    setEndDate(date);
    applyFilters(applicants, searchText, startDate, date);
  };

  // Handle table change (for sorting and filtering)
  const handleTableChange = (pagination, filters, sorter) => {
    setTableFilters(filters);
    setTableSorters(sorter);
  };

  // Clear all filters, search, and date range
  const clearAll = () => {
    setSearchText("");
    setStartDate(dayjs().subtract(1, "month"));
    setEndDate(dayjs());
    setTableFilters({});
    setTableSorters({});

    // Force table to reset its filters
    setTimeout(() => {
      document.querySelectorAll(".ant-table-filter-trigger").forEach((el) => {
        if (el.classList.contains("active")) {
          el.click();
          setTimeout(() => {
            const resetButtons = document.querySelectorAll(
              ".ant-table-filter-dropdown-btns .ant-btn-link"
            );
            resetButtons.forEach((button) => button.click());
          }, 100);
        }
      });
    }, 0);

    // Apply default filters
    applyFilters(applicants, "", dayjs().subtract(1, "month"), dayjs());
  };

  const exportToExcel = () => {
    try {
      setExporting(true);

      // Prepare the data for export
      const exportData = filteredApplicants.map((item) => ({
        "Шалгуулагчийн нэр": `${item.firstname} ${item.lastname}`,
        "И-мэйл": item.email,
        Утас: item.phone,
        "Тестийн нэр": item.assessmentName,
        "Эхэлсэн огноо": item.startDate
          ? new Date(item.startDate).toLocaleString()
          : "-",
        "Дууссан огноо": item.endDate
          ? new Date(item.endDate).toLocaleString()
          : "-",
        Төлөв:
          !item.startDate && !item.endDate
            ? "Мэйл илгээсэн"
            : item.startDate && !item.endDate
            ? "Эхэлсэн"
            : "Дуусгасан",
        "Үр дүн": item.result
          ? item.testType === 20
            ? `${item.result.result || ""} - ${item.result.value || ""}`
            : `${Math.round(
                ((item.result.point || 0) / (item.result.total || 1)) * 100
              )}%`
          : "-",
        "Шалгуулагч үр дүнгээ харах эсэх": item.visible ? "Тийм" : "Үгүй",
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Column widths
      const colWidths = [
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 15 }, // Phone
        { wch: 25 }, // Test name
        { wch: 20 }, // Start date
        { wch: 20 }, // End date
        { wch: 15 }, // Status
        { wch: 20 }, // Result
        { wch: 12 }, // Visible
      ];

      worksheet["!cols"] = colWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Шалгуулагчид");

      // Generate Excel file
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
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusTag = (record) => {
    if (!record.startDate && !record.endDate) {
      return (
        <Button className="shadow-md shadow-slate-200 grd-div-4">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
          Мэйл илгээсэн
        </Button>
      );
    } else if (record.startDate && !record.endDate) {
      return (
        <Button className="grd-div-5 cursor-default shadow-md shadow-slate-200">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
          Эхэлсэн
        </Button>
      );
    } else if (record.endDate) {
      return (
        <Button className="grd-div-6 cursor-default shadow-md shadow-slate-200">
          <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
          Дуусгасан
        </Button>
      );
    }
    return <Tag color="default">-</Tag>;
  };

  const getScore = (record) => {
    if (!record.endDate || !record.result) {
      return <span className="text-gray-400">-</span>;
    }

    if (record.testType === 20) {
      const result = record.result.result;
      const value = record.result.value;

      return (
        <div className="flex items-center font-extrabold">
          <div className="">{result || ""}</div> <span className="px-1">/</span>
          <div>{value || ""}</div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <Progress
            className="min-w-4"
            size="small"
            percent={Math.round(
              (record.result.point / record.result.total) * 100
            )}
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
  };

  // Status filter options
  const statusFilters = [
    {
      text: "Мэйл илгээсэн",
      value: "sent",
    },
    {
      text: "Эхэлсэн",
      value: "started",
    },
    {
      text: "Дуусгасан",
      value: "completed",
    },
  ];

  const columns = [
    {
      title: "№",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
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
              <div className="font-semibold">
                {firstname} {lastname}
              </div>
              <div className="text-gray-700 text-sm">{email}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Тестийн нэр",
      key: "assessmentName",
      dataIndex: "assessmentName",
      filters: getTestNames(),
      onFilter: (value, record) => record.assessmentName === value,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-main">{record.assessmentName}</span>
        </div>
      ),
    },
    {
      title: "Эхэлсэн огноо",
      key: "startDate",
      dataIndex: "startDate",
      sorter: (a, b) => {
        if (!a.startDate && !b.startDate) return 0;
        if (!a.startDate) return -1;
        if (!b.startDate) return 1;
        return new Date(a.startDate) - new Date(b.startDate);
      },
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <span>{formatDate(record.startDate)}</span>
        </div>
      ),
    },
    {
      title: "Дууссан огноо",
      key: "endDate",
      dataIndex: "endDate",
      sorter: (a, b) => {
        if (!a.endDate && !b.endDate) return 0;
        if (!a.endDate) return -1;
        if (!b.endDate) return 1;
        return new Date(a.endDate) - new Date(b.endDate);
      },
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <span>{formatDate(record.endDate)}</span>
        </div>
      ),
    },
    {
      title: "Төлөв",
      key: "status",
      filters: statusFilters,
      onFilter: (value, record) => {
        if (value === "sent") return !record.startDate && !record.endDate;
        if (value === "started") return record.startDate && !record.endDate;
        if (value === "completed") return !!record.endDate;
        return true;
      },
      render: (_, record) => getStatusTag(record),
      width: 200,
    },
    {
      title: "Үр дүн",
      key: "score",
      render: (_, record) => getScore(record),
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
        record.endDate && record.result ? (
          <Link
            href={`/api/report/${record.code}`}
            target="_blank"
            passHref
          >
            <Button className="grd-btn h-10 w-36">Тайлан татах</Button>
          </Link>
        ) : null,
    },
  ];

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
                className="min-w-36"
              />
            </div>
            <span className="text-gray-400">-</span>
            <DatePicker
              placeholder="Дуусах огноо"
              format="YYYY-MM-DD"
              value={endDate}
              onChange={handleEndDateChange}
              className="min-w-36"
            />
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Button onClick={clearAll} className="stroked-btn">
            <FilterBoldDuotone width={18} height={18} />
            Цэвэрлэх
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
        // loc
        className="applicants-table overflow-x-auto"
        dataSource={filteredApplicants}
        loading={loading}
        rowKey={(record) => record.examId}
        pagination={{
          size: "small",
          pageSize: 10,
          hideOnSinglePage: true,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        locale={customLocale}
        columns={columns}
      />
    </>
  );
};

export default ApplicantsTable;
