import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  message,
  Upload,
  Modal,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import * as XLSX from "xlsx";
import { getCode, sendInvite } from "@/app/api/main";
import dayjs from "dayjs";
import {
  AddCircleBoldDuotone,
  CalendarBoldDuotone,
  LetterOpenedBoldDuotone,
  TrashBinMinimalistic2BoldDuotone,
  UploadBoldDuotone,
  File,
  ShieldWarningBoldDuotone,
  CheckCircleBoldDuotone,
  ClockCircleBoldDuotone,
  UserBlockRoundedBoldDuotone,
  UserCheckBoldDuotone,
  LetterBoldDuotone,
} from "solar-icons";
import DateTimePicker from "./DateTime";
import { customLocale } from "@/app/utils/values";
import { LoadingOutlined } from "@ant-design/icons";

const SpreadsheetInviteTable = ({ testData, onSuccess }) => {
  const [dateRange, setDateRange] = useState([
    dayjs(),
    dayjs().add(24, "hour"),
  ]);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validatedData, setValidatedData] = useState([]);
  const lastId = useRef(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const remainingAccesses =
    testData?.reduce(
      (sum, item) => sum + (item.count - item.usedUserCount),
      0
    ) || 0;

  const generateKey = () => {
    lastId.current += 1;
    return `${lastId.current}`;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeCell) return;

      const [rowKey, colKey] = activeCell;
      const rowIndex = data.findIndex((row) => row.key === rowKey);
      if (rowIndex === -1) return;

      const columns = ["email", "firstname", "lastname", "phone"];
      const colIndex = columns.indexOf(colKey);
      if (colIndex === -1) return;

      if (e.key === "Tab") {
        e.preventDefault();

        let newColIndex = colIndex;
        let newRowIndex = rowIndex;

        if (!e.shiftKey) {
          newColIndex++;
          if (newColIndex >= columns.length) {
            newColIndex = 0;
            newRowIndex++;
          }
        } else {
          newColIndex--;
          if (newColIndex < 0) {
            newColIndex = columns.length - 1;
            newRowIndex--;
          }
        }

        if (newRowIndex >= 0 && newRowIndex < data.length) {
          const newRowKey = data[newRowIndex].key;
          const newColKey = columns[newColIndex];
          setActiveCell([newRowKey, newColKey]);
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();

        const newRowIndex = rowIndex + 1;
        if (newRowIndex < data.length) {
          const newRowKey = data[newRowIndex].key;
          setActiveCell([newRowKey, colKey]);
        } else if (
          newRowIndex === data.length &&
          data.length < remainingAccesses
        ) {
          handleAdd(1);
        }
      }

      if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        e.preventDefault();

        let newRowIndex = rowIndex;
        let newColIndex = colIndex;

        if (e.key === "ArrowUp") newRowIndex--;
        if (e.key === "ArrowDown") newRowIndex++;
        if (e.key === "ArrowLeft") newColIndex--;
        if (e.key === "ArrowRight") newColIndex++;

        if (
          newRowIndex >= 0 &&
          newRowIndex < data.length &&
          newColIndex >= 0 &&
          newColIndex < columns.length
        ) {
          const newRowKey = data[newRowIndex].key;
          const newColKey = columns[newColIndex];
          setActiveCell([newRowKey, newColKey]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCell, data, remainingAccesses]);

  useEffect(() => {
    const handlePaste = (e) => {
      if (!activeCell) return;

      const clipboardData = e.clipboardData.getData("text");
      if (!clipboardData) return;

      const rows = clipboardData.split(/\r?\n/).filter((row) => row.trim());

      if (rows.length > 1 || rows[0].includes("\t")) {
        e.preventDefault();

        const [activeRowKey, activeColKey] = activeCell;
        const activeRowIndex = data.findIndex(
          (row) => row.key === activeRowKey
        );
        if (activeRowIndex === -1) return;

        const columns = ["email", "firstname", "lastname", "phone"];
        const activeColIndex = columns.indexOf(activeColKey);
        if (activeColIndex === -1) return;

        const pasteData = rows.map((row) => row.split("\t"));

        const newData = [...data];

        const rowsNeeded = activeRowIndex + pasteData.length;
        while (newData.length < rowsNeeded) {
          if (newData.length >= remainingAccesses) {
            messageApi.warning(
              `Зөвхөн ${remainingAccesses} шалгуулагч нэмэх боломжтой.`
            );
            break;
          }
          newData.push({
            key: generateKey(),
            email: "",
            firstname: "",
            lastname: "",
            phone: "",
          });
        }

        for (let i = 0; i < pasteData.length; i++) {
          const targetRowIndex = activeRowIndex + i;
          if (targetRowIndex >= newData.length) break;

          const row = pasteData[i];
          for (let j = 0; j < row.length; j++) {
            const targetColIndex = activeColIndex + j;
            if (targetColIndex >= columns.length) break;

            const targetColKey = columns[targetColIndex];
            newData[targetRowIndex][targetColKey] = row[j];
          }
        }

        setData(newData);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [activeCell, data, remainingAccesses]);

  const handleCellChange = (rowKey, columnKey, value) => {
    const newData = [...data];
    const rowIndex = newData.findIndex((item) => item.key === rowKey);
    if (rowIndex !== -1) {
      newData[rowIndex][columnKey] = value;
      setData(newData);
    }
  };

  const handleAdd = (count = 5) => {
    // if (data.length + count > remainingAccesses) {
    //   messageApi.error(
    //     `Зөвхөн ${remainingAccesses} шалгуулагч нэмэх боломжтой.`
    //   );
    //   return;
    // }

    const newRows = Array(count)
      .fill(0)
      .map(() => ({
        key: generateKey(),
        email: "",
        firstname: "",
        lastname: "",
        phone: "",
      }));

    setData([...data, ...newRows]);

    if (newRows.length > 0) {
      setActiveCell([newRows[0].key, "email"]);
    }
  };

  const handleDelete = (key) => {
    if (activeCell && activeCell[0] === key) {
      setActiveCell(null);
    }
    setData(data.filter((item) => item.key !== key));
    setSelectedRowKeys(selectedRowKeys.filter((k) => k !== key));
  };

  const handleBulkDelete = () => {
    if (activeCell && selectedRowKeys.includes(activeCell[0])) {
      setActiveCell(null);
    }

    setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  const handleExcelUpload = (file) => {
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const excelData = XLSX.utils.sheet_to_json(worksheet);

        if (excelData.length + data.length > remainingAccesses) {
          throw new Error(
            `Зөвхөн ${remainingAccesses} шалгуулагч нэмэх боломжтой.`
          );
        }

        const mappedData = excelData.map((row) => {
          const result = { key: generateKey() };

          Object.keys(row).forEach((key) => {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes("email") || lowerKey.includes("мейл")) {
              result.email = row[key];
            } else if (
              (lowerKey.includes("first") || lowerKey.includes("нэр")) &&
              !lowerKey.includes("овог") &&
              !lowerKey.includes("last")
            ) {
              result.firstname = row[key];
            } else if (
              lowerKey.includes("last") ||
              lowerKey.includes("овог") ||
              lowerKey.includes("surname")
            ) {
              result.lastname = row[key];
            } else if (
              lowerKey.includes("phone") ||
              lowerKey.includes("утас") ||
              lowerKey.includes("дугаар")
            ) {
              result.phone = String(row[key]).replace(/\D/g, "");
            }
          });

          return result;
        });

        setData([...data, ...mappedData]);
        messageApi.success(`${mappedData.length} мөр амжилттай нэмэгдлээ.`);
      } catch (error) {
        messageApi.error(error.message || "Excel файл уншихад алдаа гарлаа.");
      } finally {
        setIsUploading(false);
        setIsModalVisible(false);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      messageApi.error("Файл уншихад алдаа гарлаа.");
      setIsModalVisible(false);
    };

    reader.readAsArrayBuffer(file);
    return false;
  };

  const exportToExcel = () => {
    if (data.length === 0) {
      messageApi.warning("Экспортлох өгөгдөл алга.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row) => ({
        "И-мейл хаяг": row.email,
        Овог: row.lastname,
        Нэр: row.firstname,
        "Утасны дугаар": row.phone,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Шалгуулагчид");

    XLSX.writeFile(workbook, "shalguulagchid.xlsx");
  };

  const validateData = () => {
    if (data.length === 0) {
      messageApi.error("Шалгуулагч нэмнэ үү.");
      return false;
    }

    const nonEmptyRows = data.filter(
      (row) => row.email || row.firstname || row.lastname || row.phone
    );

    if (nonEmptyRows.length === 0) {
      messageApi.error("Шалгуулагчийн мэдээлэл оруулна уу.");
      return false;
    }

    const partialRows = nonEmptyRows.filter(
      (row) => !row.email || !row.firstname || !row.lastname || !row.phone
    );

    if (partialRows.length > 0) {
      messageApi.error(
        `${partialRows.length} шалгуулагчийн мэдээллийг бүрэн бөглөнө үү.`
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = nonEmptyRows.filter(
      (row) => !emailRegex.test(row.email)
    );

    if (invalidEmails.length > 0) {
      messageApi.error(
        `${invalidEmails.length} шалгуулагчийн и-мейл хаяг буруу байна.`
      );
      return false;
    }

    const phoneRegex = /^\d{8}$/;
    const invalidPhones = nonEmptyRows.filter(
      (row) => !phoneRegex.test(row.phone)
    );

    if (invalidPhones.length > 0) {
      messageApi.error(
        `${invalidPhones.length} шалгуулагчийн утасны дугаар буруу байна.`
      );
      return false;
    }

    return nonEmptyRows;
  };

  const prepareForSend = () => {
    const validData = validateData();
    if (!validData) return;

    const dataToSend =
      selectedRowKeys.length > 0
        ? validData.filter((item) => selectedRowKeys.includes(item.key))
        : validData;

    if (dataToSend.length > remainingAccesses) {
      messageApi.error(
        `Зөвхөн ${remainingAccesses} шалгуулагч нэмэх боломжтой.`
      );
      return;
    }

    setValidatedData(dataToSend);
    setIsConfirmModalVisible(true);
  };

  const handleSend = async () => {
    if (!validatedData.length) return;

    try {
      setIsLoading(true);

      const examCodes = [];
      for (const test of testData) {
        const remainingForThisTest = test.count - test.usedUserCount;
        if (remainingForThisTest > 0) {
          const startDate = dateRange[0].toISOString();
          const endDate = dateRange[1].toISOString();
          try {
            const examResponse = await getCode({
              service: test.id,
              count: Math.min(
                remainingForThisTest,
                validatedData.length - examCodes.length
              ),
              startDate,
              endDate,
            });

            if (examResponse.success && examResponse.data) {
              examCodes.push(...examResponse.data);
            }

            if (examCodes.length >= validatedData.length) break;
          } catch (error) {
            console.error("Error getting exam codes:", error);
          }
        }
      }

      if (examCodes.length < validatedData.length) {
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
        setIsLoading(false);
        return;
      }

      const links = validatedData.map((item, index) => ({
        email: item.email.toLowerCase(),
        lastname: item.lastname,
        firstname: item.firstname,
        phone: item.phone,
        code: examCodes[index],
        visible: show,
      }));

      const response = await sendInvite(links);

      if (response.success) {
        messageApi.success(`${links.length} шалгуулагч уригдлаа.`);

        // Remove sent rows from the table
        if (selectedRowKeys.length > 0) {
          setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
          setSelectedRowKeys([]);
        } else {
          setData(
            data.filter(
              (row) => !validatedData.some((vRow) => vRow.key === row.key)
            )
          );
        }

        setIsConfirmModalVisible(false);
        await onSuccess();
      } else {
        messageApi.error(response.message || "Алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Send error:", error);
      messageApi.error("Урилга илгээхэд алдаа гарлаа.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditableCell = (text, record, dataIndex) => {
    const isActive =
      activeCell && activeCell[0] === record.key && activeCell[1] === dataIndex;

    return (
      <div
        className={`editable-cell ${isActive ? "active-cell" : ""}`}
        onClick={() => setActiveCell([record.key, dataIndex])}
      >
        {isActive ? (
          <Input
            ref={inputRef}
            value={text}
            onChange={(e) =>
              handleCellChange(record.key, dataIndex, e.target.value)
            }
            onBlur={() => {
              if (
                activeCell &&
                activeCell[0] === record.key &&
                activeCell[1] === dataIndex
              ) {
                setActiveCell(null);
              }
            }}
            autoFocus
          />
        ) : (
          <div className="cell-content">
            {text || (
              <span className="text-gray-400">
                {dataIndex === "email"
                  ? "И-мейл хаяг"
                  : dataIndex === "firstname"
                  ? "Нэр"
                  : dataIndex === "lastname"
                  ? "Овог"
                  : "Утасны дугаар"}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (inputRef.current && activeCell) {
      inputRef.current.focus();
    }
  }, [activeCell]);

  const columns = [
    {
      title: "И-мейл хаяг",
      dataIndex: "email",
      key: "email",
      width: "30%",
      render: (text, record) => renderEditableCell(text, record, "email"),
    },
    {
      title: "Нэр",
      dataIndex: "firstname",
      key: "firstname",
      width: "20%",
      render: (text, record) => renderEditableCell(text, record, "firstname"),
    },
    {
      title: "Овог",
      dataIndex: "lastname",
      key: "lastname",
      width: "20%",
      render: (text, record) => renderEditableCell(text, record, "lastname"),
    },
    {
      title: "Утасны дугаар",
      dataIndex: "phone",
      key: "phone",
      width: "20%",
      render: (text, record) => renderEditableCell(text, record, "phone"),
    },
    {
      title: "Үйлдэл",
      key: "action",
      width: "10%",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Устгах">
          <button
            className="text-red-400 hover:text-red-500 transition-colors duration-300 flex mx-auto"
            onClick={() => handleDelete(record.key)}
          >
            <TrashBinMinimalistic2BoldDuotone width={18} height={18} />
          </button>
        </Tooltip>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="spreadsheet-table">
      <style jsx global>{`
        .spreadsheet-table .editable-cell {
          padding: 4px;
          cursor: cell;
          min-height: 32px;
          border: 1px solid transparent;
        }

        .spreadsheet-table .editable-cell:hover {
          background-color: #f5f5f5;
        }

        .spreadsheet-table .active-cell {
          border: 1px solid #f36421;
          background-color: #fff;
        }

        .spreadsheet-table .cell-content {
          padding: 4px 8px;
          min-height: 32px;
          display: flex;
          align-items: center;
        }

        .spreadsheet-table .ant-table-tbody > tr > td {
          padding: 4px;
        }

        .spreadsheet-table .ant-input {
          border: none;
          box-shadow: none;
          padding: 4px 8px;
        }

        .spreadsheet-table .ant-input:focus {
          box-shadow: none;
        }
      `}</style>

      {contextHolder}

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <Button
          onClick={() => handleAdd(5)}
          className="stroked-btn add flex items-center gap-2 text-main hover:text-secondary border-main/50 rounded-xl font-medium transition-colors duration-400"
        >
          <AddCircleBoldDuotone width={18} height={18} />
          Мөр нэмэх
        </Button>

        <Button
          onClick={() => setIsModalVisible(true)}
          className="stroked-btn-2 flex items-center gap-2 rounded-xl font-medium transition-colors duration-400"
        >
          <File width={18} height={18} />
          Excel импортлох
        </Button>

        {selectedRowKeys.length > 0 && (
          <Button
            onClick={handleBulkDelete}
            className="stroked-btn-3 flex items-center gap-2 text-red-600 border-red-500/50 hover:text-red-500 rounded-xl remove font-medium transition-colors duration-400"
          >
            <TrashBinMinimalistic2BoldDuotone width={18} height={18} />
            Устгах ({selectedRowKeys.length})
          </Button>
        )}
      </div>
      {data.length > 0 && (
        <div className="bg-gray-50 p-2 px-4 rounded-xl mb-4 flex items-center text-sm text-gray-600">
          <ShieldWarningBoldDuotone
            className="text-main mr-2"
            width={18}
            height={18}
          />
          <div>
            <span className="font-medium">Заавар:</span>
          </div>
        </div>
      )}

      {data.length > 0 && (
        <Table
          locale={customLocale}
          rowSelection={rowSelection}
          dataSource={data}
          columns={columns}
          pagination={false}
          rowClassName="editable-row"
          className="test-history-table overflow-x-auto"
        />
      )}

      {data.length > 0 && (
        <>
          <div className="pt-6">
            <div className="flex items-center gap-2 font-bold">
              <CalendarBoldDuotone width={18} height={18} />
              Тест өгөх хугацаа
            </div>
          </div>
          <div className="mt-3">
            <DateTimePicker dateRange={dateRange} setDateRange={setDateRange} />
          </div>
          <div className="flex justify-between pt-2 items-center">
            <div className="pt-2 gap-2 flex items-center">
              <Switch
                size="small"
                checked={show}
                onChange={(checked) => setShow(checked)}
              />
              <div>Тестийн үр дүнг шалгуулагчдад харуулах эсэх</div>
            </div>
            <div
              className="relative group cursor-pointer"
              onClick={prepareForSend}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
                <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-1.5 px-7">
                  <LetterBoldDuotone
                    width={18}
                    height={18}
                    className="text-main"
                  />
                  Мейл илгээх
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Excel import modal */}
      <Modal
        title="Excel файл оруулах"
        open={isModalVisible}
        onCancel={() => {
          if (!isUploading) {
            setIsModalVisible(false);
          }
        }}
        footer={null}
        closable={!isUploading}
        maskClosable={!isUploading}
      >
        <Upload.Dragger
          accept=".xlsx,.xls,.csv"
          beforeUpload={handleExcelUpload}
          className="rounded-xl"
          disabled={isUploading}
          showUploadList={false}
        >
          {isUploading ? (
            <div className="py-4">
              <Spin size="large" />
              <p className="mt-4 font-bold">Файл боловсруулж байна...</p>
            </div>
          ) : (
            <>
              <p className="ant-upload-drag-icon pt-2">
                <UploadBoldDuotone size={40} className="mx-auto text-main" />
              </p>
              <p className="font-bold text-base">
                Excel файлаа энд чирч оруулна уу.
              </p>
              <p className="ant-upload-hint leading-5 pt-1 pb-1">
                Хүснэгтэн форматын файлуудыг дэмжинэ.
              </p>
            </>
          )}
        </Upload.Dragger>
      </Modal>

      <Modal
        title="Шалгуулагч урих"
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        footer={null}
        width={700}
      >
        <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm flex items-center gap-2 my-4">
          <UserCheckBoldDuotone
            className="text-main flex-shrink-0"
            width={20}
            height={20}
          />
          <span className="text-main">
            Шалгуулагч:{" "}
            <span className="font-black text-main">{validatedData.length}</span>{" "}
          </span>
          <span className="px-2"></span>
          <ClockCircleBoldDuotone
            className="text-blue-500 flex-shrink-0"
            width={20}
            height={20}
          />
          <div>
            <p>
              Тест өгөх хугацаа:{" "}
              <strong>
                {dateRange[0].format("YYYY/MM/DD HH:mm")} -{" "}
                {dateRange[1].format("YYYY/MM/DD HH:mm")}
              </strong>
            </p>
          </div>
        </div>

        <div className="max-h-[300px] overflow-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  №
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  И-мейл хаяг
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Нэр
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Овог
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Утасны дугаар
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {validatedData.map((row, index) => (
                <tr
                  key={row.key}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {row.email}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {row.firstname}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {row.lastname}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {row.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-4 mt-6 pb-1">
          {/* Буцах (Back) Button */}
          <div
            className={`relative group ${
              isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
            onClick={
              isLoading ? undefined : () => setIsConfirmModalVisible(false)
            }
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-gray-200/50 to-gray-500/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-gray-400/30 to-gray-300/20 rounded-full flex items-center justify-center border border-gray-500/10">
              <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-gray-500 to-gray-600 bg-clip-text text-transparent py-1 px-6">
                Буцах
              </div>
            </div>
          </div>

          {/* Илгээх (Submit) Button */}
          <div
            className={`relative group ${
              isLoading ? "cursor-wait" : "cursor-pointer"
            }`}
            onClick={isLoading ? undefined : handleSend}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
              <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-1 px-8">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <LoadingOutlined
                        style={{
                          fontSize: 16,
                          color: "white",
                        }}
                        spin
                      />
                    </div>
                    Илгээх
                  </div>
                ) : (
                  "Илгээх"
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SpreadsheetInviteTable;
