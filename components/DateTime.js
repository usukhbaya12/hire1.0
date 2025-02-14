import React from "react";
import { DatePicker } from "antd";
import { CalendarDateBold } from "solar-icons";
import dayjs from "dayjs";

const DateTimePicker = ({ dateRange, setDateRange }) => {
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const disabledTime = (current, type) => {
    if (current && current.isSame(dayjs(), "day")) {
      return {
        disabledHours: () =>
          Array.from({ length: dayjs().hour() }, (_, i) => i),
      };
    }
    return {};
  };

  const handleStartDateChange = (date) => {
    setDateRange([date, dateRange[1]]);

    if (date && dateRange[1] && date > dateRange[1]) {
      setDateRange([date, date.add(24, "hour")]);
    }
  };

  const handleEndDateChange = (date) => {
    setDateRange([dateRange[0], date]);

    if (date && dateRange[0] && dateRange[0] > date) {
      setDateRange([date.subtract(24, "hour"), date]);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          Эхлэх:
          <DatePicker
            needConfirm={false}
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            placeholder="Эхлэх огноо"
            value={dateRange[0]}
            onChange={handleStartDateChange}
            disabledDate={disabledDate}
            disabledTime={disabledTime}
            className="w-48 rounded-xl"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          Дуусах:
          <DatePicker
            needConfirm={false}
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            placeholder="Дуусах огноо"
            value={dateRange[1]}
            onChange={handleEndDateChange}
            disabledDate={(current) => {
              return dateRange[0] && current && current < dateRange[0];
            }}
            className="w-48 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
