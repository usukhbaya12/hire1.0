"use client";

import React, { useState, useEffect } from "react";
import { DownloadBoldDuotone } from "solar-icons";

const PdfViewer = ({ pdfUrl }) => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const checkSupport = () => {
      try {
        const isIOS =
          /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );

        if (isIOS || (isSafari && window.innerWidth < 768)) {
          setIsSupported(false);
        }
      } catch (error) {
        console.error("Error checking PDF support:", error);
        setIsSupported(true);
      }
    };

    checkSupport();
  }, []);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!pdfUrl) {
    return (
      <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-8 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-bold mb-2">PDF тайлан олдсонгүй.</h3>
        <p className="text-gray-600 mb-6">Тестийн тайлангийн файл олдсонгүй.</p>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-8 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h3 className="text-xl font-bold mb-2">PDF үзүүлэх боломжгүй.</h3>
        <p className="text-gray-600 mb-6">
          Таны төхөөрөмж PDF файлыг шууд харуулах боломжгүй байна. Та доорх товч
          дээр дарж PDF файлыг татаж авна уу.
        </p>
        <div onClick={handleDownload} className="inline-block">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
              <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-2 px-7">
                <DownloadBoldDuotone
                  width={18}
                  height={18}
                  className="text-main"
                />
                PDF Татах
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-md shadow shadow-slate-200 rounded-3xl p-4 overflow-hidden">
      <iframe
        src={pdfUrl}
        className="w-full h-[100vh] rounded-xl"
        title="PDF Viewer"
      />
    </div>
  );
};

export default PdfViewer;
