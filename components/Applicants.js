import React, { useState, useEffect } from "react";
import { Table, Progress, Button, message } from "antd";
import dayjs from "dayjs";
import {
  ClipboardBoldDuotone,
  EyeBoldDuotone,
  EyeClosedBold,
  EyeClosedBoldDuotone,
} from "solar-icons";
import { getReport } from "@/app/api/exam";

const EmployeeTable = ({ testData }) => {
  const [transformedData, setTransformedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingReportId, setLoadingReportId] = useState(null);
  const messageApi = message;

  // Process and transform the data when testData changes
  useEffect(() => {
    if (!testData || !Array.isArray(testData)) {
      console.error("Invalid testData:", testData);
      setTransformedData([]);
      return;
    }

    // Create a map to quickly lookup assessment by id
    const assessmentMap = {};
    testData.forEach((test) => {
      if (test.assessment) {
        assessmentMap[test.assessment.id] = test.assessment;
      }

      // Also add from assessments array if it exists
      if (test.assessments && Array.isArray(test.assessments)) {
        test.assessments.forEach((assessment) => {
          if (assessment && assessment.id) {
            assessmentMap[assessment.id] = assessment;
          }
        });
      }
    });

    // Transform all exams with proper assessment data
    const allExams = testData.flatMap((test) => {
      if (!test.exams || !Array.isArray(test.exams)) return [];

      return test.exams.map((exam) => {
        // Try to find assessment data from multiple sources
        let assessmentData = null;

        // 1. From exam.assessment directly
        if (exam.assessment) {
          assessmentData = exam.assessment;
        }
        // 2. From test.assessment using assessmentId reference
        else if (exam.assessmentId && assessmentMap[exam.assessmentId]) {
          assessmentData = assessmentMap[exam.assessmentId];
        }
        // 3. Try to match by name
        else if (exam.assessmentName) {
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
        status = "Мейл илгээсэн";
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
      case "Мейл илгээсэн":
        return (
          <div className="relative group w-fit">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-600/50 to-orange-700/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-yellow-400/30 to-yellow-300/20 rounded-full flex items-center justify-center border border-yellow-900/10">
              <div className="flex items-center gap-1.5 font-bold bg-gradient-to-br from-gray-600 to-gray-700 bg-clip-text text-transparent py-1 px-3.5">
                <div className="min-w-2 min-h-2 w-2 h-2 bg-yellow-500 rounded-full -mt-0.5"></div>
                Мейл илгээсэн
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

  const columns = [
    {
      title: "Урилга илгээсэн",
      dataIndex: "date",
      width: 180,
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Хугацаа дуусах",
      dataIndex: "endDate",
      width: 180,
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Шалгуулагч",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative min-w-10 min-h-10 bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
              <div className="text-base font-bold uppercase bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent">
                {record?.name?.[2]}
              </div>
            </div>
          </div>
          <div className="leading-4">
            <div className="font-semibold">{record.name}</div>
            <div className="text-gray-700 text-sm">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Тест өгсөн",
      dataIndex: "userEndDate",
      width: 180,
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Төлөв",
      dataIndex: "status",
      width: 180,
      render: (status) => renderStatus(status),
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      width: 280,
      render: (result, record) => {
        if (!result) return "-";

        const reportType = record.assessment?.report || 10; // Default to 10 if not specified

        if (reportType === 10) {
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
                ? `${result.result} • ${result.value}`
                : result.value || result.result || "-"}
            </div>
          );
        }
      },
    },
    {
      title: "Шалгуулагч үр дүнгээ харсан эсэх",
      dataIndex: "visible",
      width: 220,
      render: (_, record) =>
        record.visible ? (
          <div className="text-gray-700 flex items-center gap-1">
            <EyeBoldDuotone width={18} /> Тийм
          </div>
        ) : (
          <div className="text-gray-700 flex items-center gap-1">
            <EyeClosedBold width={18} /> Үгүй
          </div>
        ),
    },
    {
      title: "Тайлан",
      key: "action",
      width: 100,
      render: (_, record) =>
        record.status === "Дуусгасан" ? (
          <Button
            className="link-btn-2"
            loading={loadingReportId === record.code}
            onClick={() => downloadReport(record.code)}
          >
            {loadingReportId !== record.code && (
              <ClipboardBoldDuotone width={18} />
            )}
            Татах
          </Button>
        ) : null,
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={transformedData}
      pagination={{
        pageSize: 10,
        className: "pt-4",
        size: "small",
      }}
      className="test-history-table overflow-x-auto"
      rowClassName="hover:bg-gray-50 transition-colors"
    />
  );
};

export default EmployeeTable;
