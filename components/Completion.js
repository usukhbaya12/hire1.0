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
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#fff"
              strokeWidth="20"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f36421"
              strokeWidth="20"
              strokeDasharray="251.2"
              strokeDashoffset="188.4"
              transform="rotate(-90 50 50)"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="251.2"
                to="188.4"
                dur="1s"
                fill="freeze"
                easing="ease-out"
              />
            </circle>

            <path
              d="M35 50 L45 60 L65 40"
              stroke="#f36421"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="50"
              strokeDashoffset="50"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="50"
                to="0"
                dur="0.5s"
                fill="freeze"
                begin="0.8s"
              />
            </path>

            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
              <g key={index} transform={`rotate(${angle} 50 50)`}>
                <circle cx="50" cy="10" r="6" fill="#e0e0e0">
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.2s"
                    fill="freeze"
                    begin={`${index * 0.1}s`}
                  />
                </circle>
                <circle cx="50" cy="5" r="3" fill="#666">
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.2s"
                    fill="freeze"
                    begin={`${index * 0.1}s`}
                  />
                </circle>
              </g>
            ))}
          </svg>
        </div>

        <div className="space-y-6 animate-fadeIn">
          <h1 className="text-xl font-extrabold leading-5">
            Таны хариулт амжилттай илгээгдлээ.
          </h1>

          <p className="text-gray-700 leading-4">
            Таны тестийн үр дүнг боловсруулсан тайланг харахын тулд{" "}
            <span className="font-extrabold px-0.5">Тайлан татах</span> товч
            дээр дарна уу.
          </p>

          <div className="flex flex-col gap-4 items-center pt-4">
            <Button
              className="bg-main hover:bg-secondary text-white border-none rounded-xl transition-colors font-semibold h-12 px-8 w-48"
              onClick={downloadReport}
            >
              Тайлан татах
            </Button>

            <Button
              className="bg-gray-200 text-gray-800 border-none rounded-xl font-semibold transition-colors h-12 px-8 w-48"
              onClick={onClose}
            >
              Нүүр хуудас
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Completion;
