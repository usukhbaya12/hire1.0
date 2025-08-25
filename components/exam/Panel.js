import React from "react";
import { Button, Divider } from "antd";
import { XIcon } from "@/components/Icons";
import { InfoCircleBoldDuotone } from "solar-icons";

const SidePanel = ({
  isOpen,
  setIsOpen,
  title,
  children,
  position = "left",
  icon,
}) => (
  <div
    className={`fixed hidden sm:block ${position}-0 top-1/2 -translate-y-1/2 z-20 
  ${
    isOpen
      ? `${position === "left" ? "xl:w-[320px] 2xl:w-[420px]" : "w-[290px]"}`
      : "w-[69px] cursor-pointer hover:w-[60px] transition-[width] duration-300"
  }`}
    onClick={() => !isOpen && setIsOpen(true)}
  >
    <div
      className={`shadow-xl shadow-slate-200 ${
        position === "left" ? "rounded-r-3xl" : "rounded-l-3xl"
      }
        ${
          isOpen
            ? "bg-white/95"
            : "bg-gradient-to-b from-main/90 to-secondary/90 backdrop-blur-md shadow-lg shadow-main/30 scale-100 opacity-90"
        }`}
      style={{
        minHeight: isOpen ? "200px" : "320px", // Taller when closed, 80% height when open
        maxHeight: isOpen ? "calc(80vh - 120px)" : "320px", // 80% of viewport height when open
      }}
    >
      {isOpen ? (
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 flex justify-between items-center p-4 xl:px-6 2xl:pt-6 2xl:px-8 pb-2">
            <h3 className="font-bold text-black">{title}</h3>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1 rounded-full transition-all duration-300 group relative flex-shrink-0"
            >
              <XIcon width={20} height={20} />
            </button>
          </div>
          <div className="px-4 xl:px-6 2xl:px-8 pt-1 2xl:pt-3 pb-2 xl:pb-3 2xl:pb-5">
            <Divider className="no-margin" />
          </div>

          <div className="flex-1 px-4 xl:px-6 2xl:px-8 pb-4 xl:pb-5 2xl:pb-6">
            <div
              className="overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50"
              style={{
                minHeight: 0,
                maxHeight: "calc(80vh - 250px)",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div
            className={`flex items-center gap-2 pt-2 text-white transform ${
              position === "left"
                ? "-rotate-90 translate-y-[160px] pl-4"
                : "rotate-90 translate-y-[160px] pr-4"
            } whitespace-nowrap`}
          >
            {icon}
            <span className="text-sm font-bold">{title}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default SidePanel;
