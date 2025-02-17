import React from "react";
import { Button } from "antd";
//import { getResults } from "@/app/api/exam";

const Completion = ({ examId, onClose }) => {
  const downloadReport = async () => {
    try {
      const res = await getResults(examId);

      if (res.success && res.data.calculate) {
        const doc = new jsPDF();
        // ... rest of your PDF generation code ...
        doc.save(`report_${examId}.pdf`);
      } else {
        message.error("Тайлан боловсруулахад алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      message.error("Тайлан татахад алдаа гарлаа");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex items-center justify-center">
      <div className="w-full max-w-lg text-center space-y-8 px-6">
        <div className="mx-auto w-64 h-64 relative">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id="successGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stop-color="#4BB543" stop-opacity="0.1" />
                <stop offset="100%" stop-color="#3C9B35" stop-opacity="0.3" />
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
                  stroke-width="0.5"
                  stroke-opacity="0.2"
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
              stroke-width="4"
            />

            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              stroke-width="12"
              stroke-linecap="round"
            />
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="#4BB543"
              stroke-width="12"
              stroke-dasharray="439.6"
              stroke-dashoffset="329.7"
              transform="rotate(-90 100 100)"
              filter="url(#successGlow)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="439.6"
                to="329.7"
                dur="1s"
                fill="freeze"
                easing="ease-out"
              />
            </circle>

            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#4BB543"
              stroke-width="1"
              stroke-dasharray="4,6"
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
              stroke-width="8"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              filter="url(#successGlow)"
              stroke-dasharray="100"
              stroke-dashoffset="100"
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
        </div>

        <div className="space-y-6 animate-fadeIn">
          <h1 className="text-xl font-extrabold leading-5">
            Таны хариулт амжилттай илгээгдлээ.
          </h1>

          <p className="text-gray-700 leading-4">
            Таны тестийн үр дүнг боловсруулсан тайланг харахын тулд
            <br />
            <span className="font-extrabold px-0.5">Тайлан татах</span> товч
            дээр дарна уу.
          </p>

          <div className="flex flex-col gap-4 items-center pt-4">
            <div
              className="relative group cursor-pointer mt-3"
              onClick={downloadReport}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/50 to-green-700/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-500/10 to-green-700/10 rounded-full flex items-center justify-center border border-blue-500/10">
                <div className="text-base font-extrabold bg-gradient-to-br from-green-700 to-blue-600 bg-clip-text text-transparent py-2.5 px-7">
                  Тайлан татах
                </div>
              </div>
            </div>
            <div
              className="relative group cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-secondary/50 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-main/10 to-secondary/10 rounded-full flex items-center justify-center border border-main/10">
                <div className="text-base font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-2.5 px-7">
                  Нүүр хуудас
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completion;
