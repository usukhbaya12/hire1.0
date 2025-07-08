"use client";

import React, { use, useState } from "react";
import { Button, Spin } from "antd";
import { getReport } from "@/app/api/exam";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";
import LoadingSpinner from "./Spin";
import Link from "next/link";
import ProgressSpinner from "./Progress";

const Completion = ({ examId, onClose, questionData, showReport }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [downloading, setDownloading] = useState(false);
  const [reportDownloaded, setReportDownloaded] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(true);

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

        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        setTimeout(() => setShowSuccessAnimation(true), 100);

        setReportDownloaded(true);
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

  return (
    <>
      {contextHolder}
      {downloading && <ProgressSpinner tip={"Тайлан боловсруулж байна..."} />}
      <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
        <div className="w-full max-w-lg text-center space-y-8 px-6">
          <div className="mx-auto w-52 h-52 relative">
            {showSuccessAnimation && (
              <svg
                key={Date.now()}
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="successGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4BB543" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#3C9B35" stopOpacity="0.3" />
                  </linearGradient>

                  <filter
                    id="successGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <pattern
                    id="successPattern"
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

                <circle cx="100" cy="100" r="90" fill="url(#successGradient)" />
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  fill="none"
                  stroke="url(#successPattern)"
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

                <path
                  d="M70 100 L90 120 L130 80"
                  stroke="#4BB543"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#successGlow)"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="100"
                    to="0"
                    dur="0.5s"
                    fill="freeze"
                    begin="0.8s"
                  />
                </path>

                <g opacity="0.3">
                  <circle cx="60" cy="60" r="4" fill="#4BB543">
                    <animate
                      attributeName="cy"
                      values="60;40;60"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="140" cy="60" r="4" fill="#4BB543">
                    <animate
                      attributeName="cy"
                      values="60;45;60"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="100" cy="140" r="4" fill="#4BB543">
                    <animate
                      attributeName="cy"
                      values="140;120;140"
                      dur="3.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>

                <g fill="#4BB543" opacity="0.3">
                  <path d="M0,50 L15,60 L0,70 L5,60 Z">
                    <animateMotion
                      path="M 0,0 C 100,-20 150,20 200,0"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <path d="M0,50 L15,60 L0,70 L5,60 Z">
                    <animateMotion
                      path="M 200,100 C 100,80 50,120 0,100"
                      dur="10s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              </svg>
            )}
          </div>

          <div className="space-y-6 animate-fadeIn">
            <h1 className="text-xl font-extrabold text-gray-900 mb-3 text-center leading-5">
              {reportDownloaded
                ? "Таны тайлан амжилттай татагдлаа."
                : "Таны хариулт амжилттай илгээгдлээ."}
            </h1>
            {showReport ? (
              <>
                {reportDownloaded ? (
                  <></>
                ) : (
                  <p className="text-gray-700 leading-5 px-4">
                    Та тестийнхээ үр дүнг багтаасан тайлангаа{" "}
                    <span className="font-extrabold px-0.5">Тайлан татах</span>{" "}
                    товч дээр дарж харна уу. Тайлангийн PDF хувилбар таны
                    бүртгэлтэй и-мейл хаяг руу 1-10 минутын дотор илгээгдэнэ.
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-700 leading-4 px-4">
                Таны тестийн үр дүн, түүнийг багтаасан тайлан захиалагч
                байгууллага руу илгээгдсэн.
              </p>
            )}

            <div className="flex flex-col gap-4 items-center pt-4">
              {showReport && !reportDownloaded && (
                <Button
                  className="grd-btn-2 h-10 w-36"
                  onClick={downloadReport}
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
