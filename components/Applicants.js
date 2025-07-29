import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Progress,
  Button,
  message,
  Input,
  Space,
  Dropdown,
  Menu,
} from "antd";
import { getReport } from "@/app/api/exam";
import dayjs from "dayjs";
import {
  ClipboardBoldDuotone,
  EyeBoldDuotone,
  EyeClosedBold,
  MagniferBoldDuotone,
  DownloadMinimalisticBoldDuotone,
  RestartLineDuotone,
  FilterLineDuotone,
  ClockCircleBoldDuotone,
  AlarmBoldDuotone,
} from "solar-icons";
import * as XLSX from "xlsx";
import { customLocale } from "@/app/utils/values";
import RenewModal from "./modals/Renew";

const EmployeeTable = ({ testData, onRefresh }) => {
  const [transformedData, setTransformedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReportId, setLoadingReportId] = useState(null);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isExtendModalVisible, setIsExtendModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const messageApi = message;

  useEffect(() => {
    if (!testData || !Array.isArray(testData)) {
      console.error("Invalid testData:", testData);
      setTransformedData([]);
      return;
    }

    const assessmentMap = {};
    testData.forEach((test) => {
      if (test.assessment) {
        assessmentMap[test.assessment.id] = test.assessment;
      }

      if (test.assessments && Array.isArray(test.assessments)) {
        test.assessments.forEach((assessment) => {
          if (assessment && assessment.id) {
            assessmentMap[assessment.id] = assessment;
          }
        });
      }
    });

    const allExams = testData.flatMap((test) => {
      if (!test.exams || !Array.isArray(test.exams)) return [];

      return test.exams.map((exam) => {
        let assessmentData = null;

        if (exam.assessment) {
          assessmentData = exam.assessment;
        } else if (exam.assessmentId && assessmentMap[exam.assessmentId]) {
          assessmentData = assessmentMap[exam.assessmentId];
        } else if (exam.assessmentName) {
          const matchedAssessment = Object.values(assessmentMap).find(
            (a) => a.name === exam.assessmentName
          );
          if (matchedAssessment) {
            assessmentData = matchedAssessment;
          }
        }

        return {
          ...exam,
          assessment: assessmentData,
        };
      });
    });

    const transformed = allExams.map((exam) => {
      let status = "Хүлээгдэж буй";
      if (exam.userStartDate && !exam.userEndDate) {
        status = "Эхэлсэн";
      } else if (exam.userEndDate) {
        status = "Дуусгасан";
      } else if (exam.email && !exam.userStartDate) {
        status = "Мэйл илгээсэн";
      }

      const formatDate = (date) => {
        return date ? dayjs(date).format("YYYY/MM/DD HH:mm") : "-";
      };

      return {
        key: exam.id,
        date: formatDate(exam.startDate),
        name:
          exam.firstname && exam.lastname
            ? `${exam.lastname.charAt(0)}.${exam.firstname}`
            : "-",
        fullName:
          exam.firstname && exam.lastname
            ? `${exam.lastname} ${exam.firstname}`
            : "-",
        email: exam.email || "-",
        testDate: exam.userStartDate ? formatDate(exam.userStartDate) : "-",
        status: status,
        endDate: formatDate(exam.endDate),
        result: exam.result,
        assessment: exam.assessment,
        visible: exam.visible,
        userEndDate: formatDate(exam.userEndDate),
        code: exam.code,
        assessmentName:
          exam.assessmentName || (exam.assessment ? exam.assessment.name : "-"),
      };
    });

    setTransformedData(transformed);
  }, [testData]);

  const refreshData = () => {
    if (onRefresh && typeof onRefresh === "function") {
      onRefresh();
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "Дуусгасан":
        return (
          <div className="relative group w-fit">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-lime-800/50 to-green-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-lime-600/20 to-green-600/30 rounded-full flex items-center justify-center border border-yellow-900/10">
              <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-black/60 to-black/70 bg-clip-text text-transparent py-1 px-3.5">
                <div className="w-2 h-2 bg-lime-600 rounded-full -mt-0.5"></div>
                Дуусгасан
              </div>
            </div>
          </div>
        );
      case "Эхэлсэн":
        return (
          <div className="relative group w-fit">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-600/50 to-blue-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-blue-400/30 to-blue-300/20 rounded-full flex items-center justify-center border border-blue-900/10">
              <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-1 px-3.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full -mt-0.5"></div>
                Эхэлсэн
              </div>
            </div>
          </div>
        );
      case "Мэйл илгээсэн":
        return (
          <div className="relative group w-fit">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-600/50 to-orange-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-yellow-400/30 to-yellow-300/20 rounded-full flex items-center justify-center border border-yellow-900/10">
              <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-1 px-3.5">
                <div className="min-w-2 min-h-2 w-2 h-2 bg-yellow-500 rounded-full -mt-0.5"></div>
                Мэйл илгээсэн
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative group w-fit">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-600/50 to-gray-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-gray-400/30 to-gray-300/20 rounded-full flex items-center justify-center border border-gray-900/10">
              <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-1 px-3.5">
                <div className="min-w-2 min-h-2 w-2 h-2 bg-gray-500 rounded-full -mt-0.5"></div>
                Хүлээгдэж буй
              </div>
            </div>
          </div>
        );
    }
  };

  const downloadReport = async (code) => {
    try {
      setLoadingReportId(code);
      const res = await getReport(code);

      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report_${code}.pdf`);
        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        messageApi.error("Тайлан татахад алдаа гарлаа.");
      }
    } catch (error) {
      console.error("GET / Aлдаа гарлаа.", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setLoadingReportId(null);
    }
  };

  const handleDownloadTable = () => {
    const filteredData = transformedData.filter((item) => {
      const searchMatches = searchText
        ? item.email.toLowerCase().includes(searchText.toLowerCase()) ||
          item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.name.toLowerCase().includes(searchText.toLowerCase())
        : true;

      let statusMatches = true;
      if (filteredInfo.status && filteredInfo.status.length > 0) {
        statusMatches = filteredInfo.status.includes(item.status);
      }

      let visibleMatches = true;
      if (filteredInfo.visible && filteredInfo.visible.length > 0) {
        visibleMatches = filteredInfo.visible.includes(
          item.visible ? "Тийм" : "Үгүй"
        );
      }

      return searchMatches && statusMatches && visibleMatches;
    });

    const sortedData = [...filteredData].sort((a, b) => {
      if (sortedInfo.columnKey && sortedInfo.order) {
        const columnKey = sortedInfo.columnKey;
        const order = sortedInfo.order === "ascend" ? 1 : -1;

        if (a[columnKey] === b[columnKey]) return 0;
        if (a[columnKey] === "-") return order;
        if (b[columnKey] === "-") return -order;

        return a[columnKey] < b[columnKey] ? -order : order;
      }
      return 0;
    });

    const exportData = sortedData.map((item) => ({
      "Илгээсэн огноо": item.date,
      "Дуусах огноо": item.endDate,
      Шалгуулагч: item.name,
      "И-мэйл хаяг": item.email,
      "Тест өгсөн огноо": item.userEndDate,
      Төлөв: item.status,
      "Шалгуулагч үр дүнгээ харах эсэх": item.visible ? "Тийм" : "Үгүй",
      "Үр дүн":
        item.userEndDate !== "-"
          ? item.result && typeof item.result === "object"
            ? item.result.result
              ? `${item.result.result} / ${item.result.value}`
              : `${Math.round(
                  (item.result.point / item.result.total) * 100
                )}% (${item.result.point}/${item.result.total})`
            : "-"
          : "-",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Шалгуулагчид");

    const fileName = `шалгуулагчид_${dayjs().format("YYYYMMDD")}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleReset = () => {
    setSearchText("");
    setFilteredInfo({});
    setSortedInfo({});
  };

  const showExtendModal = (record) => {
    setSelectedExam(record);
    setIsExtendModalVisible(true);
  };

  const statusFilters = [
    { text: "Дуусгасан", value: "Дуусгасан" },
    { text: "Эхэлсэн", value: "Эхэлсэн" },
    { text: "Мэйл илгээсэн", value: "Мэйл илгээсэн" },
    { text: "Хүлээгдэж буй", value: "Хүлээгдэж буй" },
  ];

  const columns = [
    {
      title: "Илгээсэн огноо",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => {
        if (a.date === "-") return -1;
        if (b.date === "-") return 1;
        return dayjs(a.date, "YYYY/MM/DD HH:mm").diff(
          dayjs(b.date, "YYYY/MM/DD HH:mm")
        );
      },
      sortOrder: sortedInfo.columnKey === "date" && sortedInfo.order,
      render: (text) => <span className="text-gray-700">{text}</span>,
      width: 80,
    },
    {
      title: "Дуусах огноо",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) => {
        if (a.endDate === "-") return -1;
        if (b.endDate === "-") return 1;
        return dayjs(a.endDate, "YYYY/MM/DD HH:mm").diff(
          dayjs(b.endDate, "YYYY/MM/DD HH:mm")
        );
      },
      sortOrder: sortedInfo.columnKey === "endDate" && sortedInfo.order,
      render: (text, record) => {
        const isExpired =
          text !== "-" &&
          dayjs(text, "YYYY/MM/DD HH:mm").isBefore(dayjs(), "minute") &&
          record.userEndDate === "-";
        return (
          <div>
            <span className="text-gray-700">{text}</span>
            {isExpired && (
              <div
                className="flex items-center gap-1 text-red-500 text-xs font-bold mt-1"
                // onClick={() => showModal(record)}
              >
                <AlarmBoldDuotone width={16} />
                Дууссан
              </div>
            )}
          </div>
        );
      },
      width: 80,
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
            <div className="font-semibold">{record.name}</div>
            <div className="text-gray-700 text-sm">{record.email}</div>
          </div>
        </div>
      ),
      width: 80,
    },
    {
      title: "Тест өгсөн",
      dataIndex: "userEndDate",
      key: "userEndDate",
      sorter: (a, b) => {
        if (a.userEndDate === "-") return -1;
        if (b.userEndDate === "-") return 1;
        return dayjs(a.userEndDate, "YYYY/MM/DD HH:mm").diff(
          dayjs(b.userEndDate, "YYYY/MM/DD HH:mm")
        );
      },
      sortOrder: sortedInfo.columnKey === "userEndDate" && sortedInfo.order,
      render: (text) => <span className="text-gray-700">{text}</span>,
      width: 80,
    },
    {
      title: "Төлөв",
      dataIndex: "status",
      key: "status",
      filters: statusFilters,
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => {
        const statusOrder = {
          Дуусгасан: 3,
          Эхэлсэн: 2,
          "Мэйл илгээсэн": 1,
          "Хүлээгдэж буй": 0,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      },
      sortOrder: sortedInfo.columnKey === "status" && sortedInfo.order,
      render: (status) => renderStatus(status),
      width: 180,
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      sorter: (a, b) => {
        if (a.result && b.result) {
          const aValue = a.result.point
            ? (a.result.point / a.result.total) * 100
            : a.result.value
            ? parseInt(a.result.value)
            : 0;

          const bValue = b.result.point
            ? (b.result.point / b.result.total) * 100
            : b.result.value
            ? parseInt(b.result.value)
            : 0;

          return aValue - bValue;
        }
        if (a.result) return 1;
        if (b.result) return -1;
        return 0;
      },
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
        } else {
          return (
            <div>
              {result.result && result.value
                ? `${result.result} / ${result.value}`
                : result.value || result.result || "-"}
            </div>
          );
        }
      },
      width: 180,
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
      title: "Тайлан",
      key: "action",
      width: 100,
      render: (_, record) => {
        const isReportAvailable = record.status === "Дуусгасан";
        const isExpired =
          dayjs(record.endDate, "YYYY/MM/DD HH:mm").isBefore(
            dayjs(),
            "minute"
          ) && record.userEndDate === "-";

        return (
          <>
            {isReportAvailable && (
              <Button
                className="link-btn-2 border-none"
                loading={loadingReportId === record.code}
                onClick={() => downloadReport(record.code)}
              >
                {loadingReportId !== record.code && (
                  <ClipboardBoldDuotone width={18} />
                )}
                Татах
              </Button>
            )}

            {isExpired && (
              <Button
                className="link-btn-3 border-none"
                onClick={() => showExtendModal(record)}
              >
                {loadingReportId !== record.code && (
                  <AlarmBoldDuotone width={18} />
                )}
                Сунгах
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const getFilteredData = () => {
    if (!searchText) return transformedData;

    return transformedData.filter(
      (record) =>
        record.email.toLowerCase().includes(searchText.toLowerCase()) ||
        record.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        record.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  return (
    <div>
      <div className="flex mb-4 gap-2 items-center">
        <Input
          placeholder="Шалгуулагч хайх"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
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
        dataSource={getFilteredData()}
        pagination={{
          pageSize: 10,
          className: "pt-4",
          size: "small",
        }}
        onChange={handleChange}
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
