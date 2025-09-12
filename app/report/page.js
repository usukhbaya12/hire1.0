"use client";
import { useEffect, useState } from "react";
import { api } from "../utils/routes";
import { getReport } from "../api/exam";
import { message } from "antd";
import axios from "axios";
import Link from "next/link";

export default function ReportPage() {
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("IDLE");
  const [progress, setProgress] = useState(0);

  const [result, setResult] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  // Polling
  useEffect(() => {
    if (!jobId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${api}report/${jobId}/status`);
        const data = await res.json();

        console.log(data.payload);
        const { status, progress, result, visible } = data.payload;
        setStatus(status);
        setProgress(progress || 0);
        setResult(result);

        if (
          (status === "COMPLETED" && progress === 100) ||
          status === "FAILED"
        ) {
          clearInterval(interval); // зогсоох
          if (status === "COMPLETED") {
            await downloadReport(result.code); // дараа нь татах
          }
        }
      } catch (err) {
        console.error("Status fetch error:", err);
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [jobId]);
  const downloadReport = async (code) => {
    try {
      const res = await axios.get(`${api}exam/pdf/${code}`, {
        responseType: "blob",
      });
      // CALCULATING = tootsoolol gargaj bga
      // WRITING = tailan zurj bga
      // COMPLETED = duussan
      console.log(res.data);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${code}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("📂 Report татахад алдаа:", error);
      messageApi.error("Серверээс тайлан татахад алдаа гарлаа.");
    }
  };
  // Start new job
  const startProcess = async () => {
    console.log("asdf");
    setStatus("STARTING...");
    setProgress(0);
    setResult(null);
    const code = 75081480164352210;
    const res = await fetch(`${api}report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    setJobId(data.payload.jobId);
    setStatus("PENDING");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Report Status</h1>

      <button
        onClick={() => downloadReport(2980428516740108)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Process эхлүүлэх
      </button>
      <Link href={`/api/report/2980428516740108`} target="_blank">
        Test
      </Link>
      {jobId && (
        <div className="mt-4 space-y-2">
          <p>
            <strong>Job ID:</strong> {jobId}
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>

          {/* 🔹 Progress bar */}
          <div className="w-full bg-gray-200 rounded h-4">
            <div
              className="bg-green-500 h-4 rounded transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p>{progress}%</p>

          {result && (
            <pre className="bg-gray-100 p-2 rounded mt-2">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
