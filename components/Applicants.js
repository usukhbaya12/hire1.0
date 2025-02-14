import React from "react";
import { Table, Button } from "antd";
import dayjs from "dayjs";
import { CloudDownloadLineDuotone } from "solar-icons";

const EmployeeTable = ({ testData }) => {
  console.log(testData);
  const allExams = testData?.flatMap((test) => test.exams) || [];

  const transformedData = allExams.map((exam) => {
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
      email: exam.email || "-",
      testDate: exam.userStartDate ? formatDate(exam.userStartDate) : "-",
      status: status,
      endDate: formatDate(exam.endDate),
      percentage: exam.userEndDate ? 93.3 : null,
      code: exam.code,
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Дуусгасан":
        return "bg-green-100 text-green-800";
      case "Эхэлсэн":
        return "bg-blue-100 text-blue-800";
      case "Мэйл илгээсэн":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      title: "Илгээсэн огноо",
      dataIndex: "date",
      width: 180,
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Дуусах огноо",
      dataIndex: "endDate",
      width: 180,
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Нэр",
      dataIndex: "name",
      width: 180,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "И-мейл хаяг",
      dataIndex: "email",
      width: 250,
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Тест өгсөн огноо",
      dataIndex: "testDate",
      width: 180,
      render: (text) => <span className="text-gray-600">{text}</span>,
    },

    {
      title: "Төлөв",
      dataIndex: "status",
      width: 200,
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(status)}`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Үр дүн",
      dataIndex: "percentage",
      width: 200,
      render: (percentage) => {
        if (percentage === null) return "-";
        return (
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm font-medium">{percentage}%</span>
          </div>
        );
      },
    },
    {
      title: "Тайлан",
      key: "action",
      width: 100,
      render: (_, record) =>
        record.status === "Дуусгасан" ? (
          <button className="text-main hover:text-secondary flex items-center gap-1 transition-colors duration-300">
            <CloudDownloadLineDuotone size={16} />
            Татах
          </button>
        ) : null,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={transformedData}
      pagination={{
        pageSize: 10,
        className: "pt-4",
      }}
      className="rounded-xl overflow-hidden"
      rowClassName="hover:bg-gray-50 transition-colors"
    />
  );
};

export default EmployeeTable;
