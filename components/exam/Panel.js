import React from "react";
import { Button } from "antd";
import { XIcon } from "@/components/Icons";

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
      : "w-[48px] cursor-pointer hover:w-[52px] transition-[width] duration-300"
  }`}
    onClick={() => !isOpen && setIsOpen(true)}
  >
    <div
      className={`bg-white shadow-xl shadow-slate-200 h-auto ${
        position === "left" ? "rounded-r-3xl" : "rounded-l-3xl"
      }
        min-h-[250px]
        ${isOpen ? "scale-100 opacity-100 p-4" : "scale-100 opacity-90"}`}
    >
      {isOpen ? (
        <div className="relative">
          <div className="flex justify-between items-center mb-1 pl-4 pr-1 2xl:pr-3 2xl:pl-6 pt-1">
            <h3 className="font-bold text-base">{title}</h3>
            <Button
              type="text"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="x-btn mr-2"
            >
              <XIcon width={18} height={18} />
            </Button>
          </div>
          <div className="py-1 px-4 2xl:px-6">{children}</div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div
            className={`flex items-center gap-2 text-main transform ${
              position === "left"
                ? "-rotate-90 translate-y-[115px]"
                : "rotate-90 translate-y-[115px]"
            } whitespace-nowrap`}
          >
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default SidePanel;
