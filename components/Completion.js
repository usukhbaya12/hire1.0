"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button, Progress, message } from "antd";
import Link from "next/link";
import { getReport } from "@/app/api/exam";
import { ArchiveCheckBoldDuotone, DocumentAddBoldDuotone } from "solar-icons";
import { api } from "@/app/utils/routes";

const Completion = ({ code, showReport }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [progress, setProgress] = useState(0);
  const [svgStage, setSvgStage] = useState("doc");
  const [downloading, setDownloading] = useState(false);
  const [stage, setStage] = useState("processing");
  const [jobId, setJobId] = useState(null);

  const messageShownRef = useRef({
    submitted: false,
    report: false,
  });

  useEffect(() => {
    if (!messageShownRef.current.submitted) {
      messageApi.success("Таны хариулт амжилттай илгээгдлээ.", 10);
      messageShownRef.current.submitted = true;
    }
  }, []);

  useEffect(() => {
    if (!code) return;

    let interval;

    const fetchStatus = async (id) => {
      try {
        const endpoint = `${api}report/${id}/status`;
        const res = await fetch(endpoint);

        const data = await res.json();

        const { status, progress, jobId: newJobId } = data.payload;

        if (!jobId && newJobId) {
          setJobId(newJobId);
        }

        setProgress(progress || 0);

        if (status === "COMPLETED" && progress === 100) {
          clearInterval(interval);
          setStage("ready");
          setSvgStage("done");

          if (!messageShownRef.current.report) {
            messageApi.success("Таны тайлан бэлэн боллоо.");
            messageShownRef.current.report = true;
          }
        } else if (status === "FAILED") {
          clearInterval(interval);
          setStage("failed");
          messageApi.error("Тайлан боловсруулахад алдаа гарлаа.");
        }
      } catch (err) {
        console.error("❌ Status fetch error:", err);
        clearInterval(interval);
        setStage("failed");
      }
    };

    // 1️⃣ First fetch with code to get jobId
    const init = async () => {
      try {
        const endpoint = `${api}report/${code}/status`;
        const res = await fetch(endpoint);
        const data = await res.json();
        const { status, progress, jobId: newJobId } = data.payload;

        if (!newJobId) throw new Error("No jobId returned from server");

        setJobId(newJobId);
        setProgress(progress || 0);

        // Start interval polling with jobId
        interval = setInterval(() => {
          fetchStatus(newJobId);
        }, 1000);
      } catch (err) {
        console.error("❌ Initial status fetch error:", err);
        setStage("failed");
      }
    };

    init();

    return () => clearInterval(interval);
  }, [code]);

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const res = await getReport(code);
      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report_${code}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        messageApi.error("Тайлан татахад алдаа гарлаа.");
      }
    } catch (error) {
      console.error("📂 Report татахад алдаа:", error);
      messageApi.error("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setDownloading(false);
    }
  };

  const renderSVG = () => {
    const icon = {
      doc: <DocumentAddBoldDuotone width={85} height={85} />,
      done: <ArchiveCheckBoldDuotone width={85} height={85} />,
    }[svgStage];

    return (
      <div className="transition-all duration-700 animate-fadeIn relative w-[200px] h-[200px]">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="absolute"
        >
          <circle cx="100" cy="100" r="90" fill="#f0fdf4" />
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="#4BB543"
            strokeWidth="2"
            strokeDasharray="4,6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="60s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-[64px] animate-pulse-slow text-green-700">
          {icon}
        </div>
      </div>
    );
  };

  return (
    <>
      {contextHolder}
      <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
        <div className="w-full max-w-lg text-center space-y-8 px-6">
          <div className="mx-auto w-52 h-52 relative flex items-center justify-center">
            {renderSVG()}
          </div>

          <div className="space-y-6 animate-fadeIn min-h-[160px]">
            <h1 className="text-xl font-extrabold text-gray-900 text-center leading-5">
              {stage === "ready"
                ? "Таны тайлан бэлэн боллоо!"
                : stage === "failed"
                ? "Алдаа гарлаа."
                : "Тайлан боловсруулж байна..."}
            </h1>

            <p className="text-gray-700 leading-5 px-6 min-h-[40px]">
              {showReport ? (
                stage === "ready" ? (
                  <>
                    Та тайлангаа <span className="font-bold">Тайлан татах</span>{" "}
                    товч дээр дарж эсвэл{" "}
                    <span className="font-bold">Өгсөн тестүүд</span> цэсээс
                    харах боломжтой.
                  </>
                ) : stage === "failed" ? (
                  "Тайлан боловсруулахад алдаа гарлаа. Дахин оролдоно уу."
                ) : (
                  "Тайланг боловсруулж дууссаны дараа татаж авах боломжтой ба тайлангийн PDF хувилбар таны бүртгэлтэй и-мэйл хаяг руу илгээгдэнэ."
                )
              ) : (
                "Таны тестийн үр дүн, түүнийг багтаасан тайлан захиалагч байгууллага руу илгээгдсэн."
              )}
            </p>

            {stage === "processing" && (
              <div className="px-8 scale-95">
                <Progress percent={progress} strokeColor="#4BB543" />
              </div>
            )}

            <div className="flex flex-col gap-4 items-center pt-4">
              {stage === "ready" && showReport && (
                <Button
                  className="grd-btn-2 h-10 w-36"
                  onClick={downloadReport}
                  loading={downloading}
                >
                  Тайлан татах
                </Button>
              )}
              {stage === "ready" && showReport && (
                <Link href="/me">
                  <Button className="grd-btn-9 h-10 w-36">Өгсөн тестүүд</Button>
                </Link>
              )}
              <Link href="/">
                <Button className="grd-btn h-10 w-36">Нүүр хуудас</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Completion;
