import React, { useState, useRef } from "react";
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
} from "antd";
import * as XLSX from "xlsx";
import { getCode, sendInvite } from "@/app/api/main";
import dayjs from "dayjs";
import {
  AddCircleBoldDuotone,
  CalendarBoldDuotone,
  LetterOpenedBoldDuotone,
  PenBoldDuotone,
  PeopleNearbyBoldDuotone,
  TrashBinMinimalistic2BoldDuotone,
  UploadBoldDuotone,
} from "solar-icons";
import DateTimePicker from "./DateTime";

const InviteTable = ({ testData, onSuccess }) => {
  const [dateRange, setDateRange] = useState([
    dayjs(),
    dayjs().add(24, "hour"),
  ]);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const lastId = useRef(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [show, setShow] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const remainingAccesses =
    testData?.reduce(
      (sum, item) => sum + (item.count - item.usedUserCount),
      0
    ) || 0;

  const generateKey = () => {
    lastId.current += 1;
    return `${lastId.current}`;
  };

  const edit = (record) => {
    form.setFieldsValue({
      email: record.email,
      firstname: record.firstname,
      lastname: record.lastname,
      phone: record.phone,
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    if (editingKey) {
      const record = data.find((item) => item.key === editingKey);
      if (
        !record.email &&
        !record.firstname &&
        !record.lastname &&
        !record.phone
      ) {
        setData(data.filter((item) => item.key !== editingKey));
      }
    }
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const formattedPhone = row.phone.replace(/-/g, "");
        newData.splice(index, 1, {
          ...item,
          ...row,
          phone: formattedPhone,
        });
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    setSelectedRowKeys(selectedRowKeys.filter((k) => k !== key));
  };

  const handleBulkDelete = () => {
    setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  const handleAdd = () => {
    if (data.length >= remainingAccesses) {
      messageApi.error(
        `Зөвхөн ${remainingAccesses} шалгуулагч нэмэх боломжтой.`
      );
      return;
    }
    const newKey = generateKey();
    setData([
      {
        key: newKey,
        email: "",
        firstname: "",
        lastname: "",
        phone: "",
      },
      ...data,
    ]);
    edit({ key: newKey });
  };

  const processExcelData = async (excelData) => {
    try {
      if (excelData.length + data.length > remainingAccesses) {
        throw new Error(
          `Зөвхөн ${remainingAccesses} шалгуулагч нэмэх боломжтой.`
        );
      }
      const newData = excelData.map((row) => {
        if (
          !row["И-мейл хаяг"] ||
          !row["Овог"] ||
          !row["Нэр"] ||
          !row["Утасны дугаар"]
        ) {
          throw new Error("Бүх мэдээллийг бөглөнө үү.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row["И-мейл хаяг"])) {
          throw new Error("И-мейл хаяг буруу байна.");
        }

        const phoneStr = row["Утасны дугаар"].toString();
        if (!/^\d{8}$/.test(phoneStr)) {
          throw new Error("Утасны дугаар 8 оронтой байх ёстой.");
        }

        return {
          key: generateKey(),
          email: row["И-мейл хаяг"],
          lastname: row["Овог"],
          firstname: row["Нэр"],
          phone: row["Утасны дугаар"].toString(),
        };
      });

      setData([...data, ...newData]);
      messageApi.success("Файл амжилттай нэмэгдлээ.");
    } catch (error) {
      messageApi.error(error.message || "Алдаа гарлаа.");
    } finally {
      setIsUploading(false);
      setIsModalVisible(false);
    }
  };

  const handleExcelUpload = (file) => {
    if (file.name !== "shalguulagchid.xlsx") {
      messageApi.error("Файлын нэр буруу байна.");
      return Upload.LIST_IGNORE;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const excelData = XLSX.utils.sheet_to_json(worksheet, {
          header: ["И-мейл хаяг", "Овог", "Нэр", "Утасны дугаар"],
          range: 1,
        });

        const validData = excelData.filter(
          (row) =>
            row["И-мейл хаяг"] &&
            row["Овог"] &&
            row["Нэр"] &&
            row["Утасны дугаар"]
        );

        processExcelData(validData);
      } catch (error) {
        setIsUploading(false);
        messageApi.error(error.message || "Excel файл уншихад алдаа гарлаа.");
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

  const handleSend = async () => {
    if (data.length === 0) {
      messageApi.error("Шалгуулагч нэмнэ үү.");
      return;
    }

    try {
      const dataToSend =
        selectedRowKeys.length > 0
          ? data.filter((item) => selectedRowKeys.includes(item.key))
          : data;

      if (dataToSend.length > remainingAccesses) {
        messageApi.error(
          `Зөвхөн ${remainingAccesses} шалгуулагч нэмэх боломжтой.`
        );
        return;
      }

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
                dataToSend.length - examCodes.length
              ),
              startDate,
              endDate,
            });

            if (examResponse.success && examResponse.data) {
              examCodes.push(...examResponse.data);
            }

            if (examCodes.length >= dataToSend.length) break;
          } catch (error) {
            console.error("Error getting exam codes:", error);
          }
        }
      }

      if (examCodes.length < dataToSend.length) {
        messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
        return;
      }

      const links = dataToSend.map((item, index) => ({
        email: item.email,
        lastname: item.lastname,
        firstname: item.firstname,
        phone: item.phone,
        code: examCodes[index],
        visible: show,
      }));

      const response = await sendInvite(links);

      if (response.success) {
        messageApi.success(`${links.length} шалгуулагч уригдлаа.`);

        if (selectedRowKeys.length > 0) {
          setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
          setSelectedRowKeys([]);
        } else {
          setData([]);
          setSelectedRowKeys([]);
        }

        await onSuccess();
      } else {
        messageApi.error(response.message || "Алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Send error:", error);
      messageApi.error("Урилга илгээхэд алдаа гарлаа.");
    }
  };

  const columns = [
    {
      title: "И-мейл хаяг",
      dataIndex: "email",
      width: "28%",
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Зөв и-мейл хаяг оруулна уу.",
              },
            ]}
            style={{ margin: 0 }}
          >
            <Input placeholder="И-мейл хаяг" />
          </Form.Item>
        ) : (
          record.email
        );
      },
    },
    {
      title: "Нэр",
      dataIndex: "firstname",
      width: "20%",
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="firstname"
            rules={[{ required: true, message: "Нэр оруулна уу." }]}
            style={{ margin: 0 }}
          >
            <Input placeholder="Нэр" />
          </Form.Item>
        ) : (
          record.firstname
        );
      },
    },
    {
      title: "Овог",
      dataIndex: "lastname",
      width: "20%",
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="lastname"
            rules={[{ required: true, message: "Овог оруулна уу." }]}
            style={{ margin: 0 }}
          >
            <Input placeholder="Овог" />
          </Form.Item>
        ) : (
          record.lastname
        );
      },
    },
    {
      title: "Утасны дугаар",
      dataIndex: "phone",
      width: "20%",
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="phone"
            rules={[{ required: true, message: "Утасны дугаар оруулна уу." }]}
            style={{ margin: 0 }}
          >
            <Input placeholder="9911-9911" />
          </Form.Item>
        ) : (
          record.phone &&
            `${record.phone.slice(0, 4)}` + "-" + `${record.phone.slice(4, 8)}`
        );
      },
    },
    {
      title: "Үйлдэл",
      dataIndex: "operation",
      width: "15%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span className="flex gap-3">
            <Button
              onClick={() => save(record.key)}
              type="link"
              className="link-btn"
            >
              Хадгалах
            </Button>
            <Button onClick={cancel} className="link-btn-2">
              Цуцлах
            </Button>
          </span>
        ) : (
          <span className="flex gap-2 py-[7px]">
            <button
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              className="text-slate-500 hover:text-blue-500 transition-colors duration-300"
            >
              <PenBoldDuotone width={18} height={18} />
            </button>
            <button
              disabled={editingKey !== ""}
              onClick={() => handleDelete(record.key)}
              className="text-red-400 hover:text-blue-500 transition-colors duration-300"
            >
              <TrashBinMinimalistic2BoldDuotone width={18} height={18} />
            </button>
          </span>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Form form={form}>
      {contextHolder}
      <div className="flex items- gap-4 md:flex-row flex-col">
        <Button
          onClick={handleAdd}
          className="stroked-btn add flex items-center gap-2 text-main hover:text-secondary border-main/50 rounded-xl font-medium transition-colors duration-400"
        >
          <AddCircleBoldDuotone width={18} height={18} />
          Шалгуулагч нэмэх
        </Button>
        <Button
          onClick={() => setIsModalVisible(true)}
          className="stroked-btn-2 flex items-center gap-2 rounded-xl font-medium transition-colors duration-400"
        >
          <PeopleNearbyBoldDuotone width={18} height={18} />
          Бөөнөөр нь нэмэх
        </Button>
        {selectedRowKeys.length > 0 && (
          <Button
            onClick={handleBulkDelete}
            className="stroked-btn-3 flex items-center gap-2 text-red-600 border-red-500/50 hover:text-red-500 rounded-xl remove font-medium transition-colors duration-400"
          >
            <TrashBinMinimalistic2BoldDuotone width={18} height={18} />
            Сонгосныг устгах ({selectedRowKeys.length})
          </Button>
        )}
        <div className="flex-1" />
      </div>

      {data.length > 0 && (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName="editable-row"
          className="test-history-table overflow-x-auto sm:mt-4"
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
            <Button
              disabled={data.length === 0}
              onClick={handleSend}
              className="no-inline"
            >
              <LetterOpenedBoldDuotone width={18} height={18} />
              Мейл илгээх
            </Button>
          </div>
        </>
      )}

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
          accept=".xlsx"
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
              <p className="ant-upload-drag-icon">
                <UploadBoldDuotone
                  size={32}
                  className="mx-auto text-gray-400"
                />
              </p>
              <p className="font-bold">Excel файлаа энд чирч оруулна уу</p>
              <p className="ant-upload-hint leading-5">
                Зөвхөн өгөгдсөн загварын дагуу бэлтгэсэн файл дэмжигдэнэ.
              </p>
            </>
          )}
        </Upload.Dragger>
      </Modal>
    </Form>
  );
};

export default InviteTable;
