import React from "react";
import { Button, Dropdown } from "antd";
import {
  Flag2BoldDuotone,
  InfoCircleBoldDuotone,
  LibraryBoldDuotone,
} from "solar-icons";
import QuestionNavigation from "./Navigation";

const ExamFooter = ({
  onFlagClick,
  hasAdvice,
  advice,
  isDropdownOpen,
  setIsDropdownOpen,
  questions,
  answeredQuestions,
  flaggedQuestions,
  onQuestionClick,
  onSectionChange,
  hasMoreCategories,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-end gap-3">
        <div
          className="text-main cursor-pointer hover:text-secondary transition-colors"
          onClick={onFlagClick}
        >
          <Flag2BoldDuotone />
        </div>

        {hasAdvice && (
          <Dropdown
            className="sm:hidden"
            arrow
            trigger={["click"]}
            placement="topLeft"
            dropdownRender={() => (
              <div className="bg-white rounded-xl shadow-xl py-6 px-8 min-w-[315px] max-w-[315px]">
                <div className="font-bold pb-2 text-base">
                  Асуумжид хариулах заавар
                </div>
                <div
                  className="max-w-none text-justify"
                  dangerouslySetInnerHTML={{ __html: advice }}
                />
              </div>
            )}
          >
            <div className="text-main cursor-pointer">
              <InfoCircleBoldDuotone />
            </div>
          </Dropdown>
        )}

        <Dropdown
          className="sm:hidden"
          arrow
          trigger={["click"]}
          placement="topRight"
          open={isDropdownOpen}
          onOpenChange={setIsDropdownOpen}
          dropdownRender={() => (
            <div
              className="bg-white rounded-xl shadow-xl py-6 px-8 min-w-[290px]"
              onClick={() => setIsDropdownOpen(false)}
            >
              <div className="font-bold pb-2 text-base">Асуултууд</div>
              <QuestionNavigation
                questions={questions}
                answeredQuestions={answeredQuestions}
                flaggedQuestions={flaggedQuestions}
                onQuestionClick={onQuestionClick}
              />
            </div>
          )}
        >
          <div className="text-main cursor-pointer">
            <LibraryBoldDuotone />
          </div>
        </Dropdown>
        <div
          className="relative group cursor-pointer w-full"
          onClick={onSectionChange}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-br from-main/50 to-main/70 rounded-full blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gradient-to-br from-main/30 to-secondary/20 rounded-full flex items-center justify-center border border-main/10">
            <div className="flex items-center gap-1.5 font-extrabold bg-gradient-to-br from-main to-secondary bg-clip-text text-transparent py-1.5 px-7">
              {hasMoreCategories ? "Дараагийн хэсэг" : "Дуусгах"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamFooter;
