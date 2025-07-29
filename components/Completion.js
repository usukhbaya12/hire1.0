"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button, Progress } from "antd";
import { getReport } from "@/app/api/exam";
import { message } from "antd";
import Link from "next/link";
import {
  ArchiveCheckBoldDuotone,
  ArchiveDownMinimlisticBoldDuotone,
  CheckCircle,
  CheckCircleBoldDuotone,
  DocumentAddBoldDuotone,
  DocumentsBoldDuotone,
} from "solar-icons";

const Completion = ({ examId, onClose, questionData, showReport }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [progress, setProgress] = useState(0);
  const [svgStage, setSvgStage] = useState("doc");
  const [downloading, setDownloading] = useState(false);
  const [stage, setStage] = useState("processing");
  const messageShownRef = useRef({
    submitted: false,
    report: false,
  });
  useEffect(() => {
    if (!messageShownRef.current.submitted) {
      messageApi.success("Таны хариулт амжилттай илгээгдлээ.", 10);
      messageShownRef.current.submitted = true;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          setStage("ready");
          setSvgStage("done");
          if (!messageShownRef.current.report) {
            messageApi.success("Таны тайлан бэлэн боллоо.");
            messageShownRef.current.report = true;
          }
        }
        return next;
      });
    }, 300); // 30s

    return () => {
      clearInterval(interval);
    };
  }, []);

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const res = await getReport(examId);
      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `report_${examId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        messageApi.error("Тайлан татахад алдаа гарлаа.");
      }
    } catch (error) {
      console.error("GET / Aлдаа гарлаа.", error);
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
          <defs>
            <linearGradient
              id="sharedGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4BB543" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#3C9B35" stopOpacity="0.3" />
            </linearGradient>
            <pattern
              id="sharedPattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 10 L20 10"
                stroke="#4BB543"
                strokeWidth="0.5"
                strokeOpacity="0.2"
              />
            </pattern>
          </defs>

          <circle cx="100" cy="100" r="90" fill="url(#sharedGradient)" />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke="url(#sharedPattern)"
            strokeWidth="4"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="#4BB543"
            strokeWidth="1"
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

        <div
          className="absolute inset-0 flex items-center justify-center text-[64px] animate-pulse-slow text-green-700"
          style={{ animationDuration: "2s" }}
        >
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
                : "Тайлан боловсруулж байна..."}
            </h1>

            <p className="text-gray-700 leading-5 px-6 min-h-[40px]">
              {showReport ? (
                stage === "ready" ? (
                  <>
                    Та тестийнхээ үр дүнг багтаасан тайлангаа
                    <span className="font-bold"> Тайлан татах</span> товч дээр
                    дарж харна уу. Тайлангийн PDF хувилбар таны бүртгэлтэй
                    и-мейл хаяг руу илгээгдсэн.
                  </>
                ) : (
                  <>
                    Таны тестийн үр дүнг багтаасан тайланг боловсруулж дууссаны
                    дараа татаж авах боломжтой ба тайлангийн PDF хувилбар таны
                    бүртгэлтэй и-мейл хаяг руу илгээгдэнэ.
                  </>
                )
              ) : (
                "Таны тестийн үр дүн, түүнийг багтаасан тайлан захиалагч байгууллага руу илгээгдсэн."
              )}
            </p>

            {stage !== "ready" && (
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
