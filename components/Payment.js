"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PaymentHistoryChart = ({ paymentData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!paymentData || !paymentData.length) return;

    const processedData = processDataForChart(paymentData);
    setChartData(processedData);
  }, [paymentData]);

  const processDataForChart = (data) => {
    const monthlyData = {};

    data.forEach((payment) => {
      const date = new Date(payment.paymentDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          deposited: 0,
          spent: 0,
        };
      }

      if (payment.assessment) {
        monthlyData[monthKey].spent += Math.abs(payment.price);
      } else {
        monthlyData[monthKey].deposited += payment.price;
      }
    });

    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  };

  const formatMonthLabel = (monthKey) => {
    const [year, month] = monthKey.split("-");
    const monthNames = [
      "",
      "1-р сар",
      "2-р сар",
      "3-р сар",
      "4-р сар",
      "5-р сар",
      "6-р сар",
      "7-р сар",
      "8-р сар",
      "9-р сар",
      "10-р сар",
      "11-р сар",
      "12-р сар",
    ];
    return `${monthNames[parseInt(month)]} ${year}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
          <p className="font-medium text-gray-800">{formatMonthLabel(label)}</p>
          {payload.map((entry, index) => (
            <p
              key={`tooltip-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.dataKey === "deposited" ? "Цэнэглэсэн: " : "Зарцуулсан: "}
              <span className="font-medium">
                {entry.value.toLocaleString()}₮
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return;
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow shadow-slate-200">
      <h3 className="font-bold text-gray-700 mb-4">Гүйлгээний задаргаа</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) =>
                value >= 1000 ? `${value / 1000}K` : value
              }
            />
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend /> */}
            <Bar
              name="Цэнэглэсэн"
              dataKey="deposited"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
              barSize={20}
            />
            <Bar
              name="Зарцуулсан"
              dataKey="spent"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentHistoryChart;
