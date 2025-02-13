import React from "react";

const QuestionNavigation = ({
  questions,
  answeredQuestions,
  flaggedQuestions,
  onQuestionClick,
}) => {
  const allQuestions = questions.map((question, index) => ({
    ...question.question,
    globalIndex: index + 1,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-x-3 gap-y-2 py-1 auto-rows-max max-h-[400px] overflow-y-auto">
        {allQuestions.map((question, index) => (
          <div className="relative group" key={index}>
            <button
              onClick={() => onQuestionClick(question.id)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300
                ${
                  answeredQuestions.has(question.id)
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-gray-50 hover:bg-gray-100"
                }
                transform hover:scale-105 active:scale-95`}
            >
              <span className="relative z-10">{question.globalIndex}</span>
              {answeredQuestions.has(question.id) && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500" />
              )}
            </button>
            {flaggedQuestions.has(question.id) && (
              <div className="absolute -top-0.5 right-0 w-2.5 h-2.5 bg-main rounded-full opacity-80 group-hover:scale-110 transition-transform duration-300" />
            )}
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="text-sm text-gray-500 mb-2">Тайлбар:</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="relative w-4 h-4 bg-gray-50 rounded">
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-main rounded-full" />
            </div>
            <span>Тэмдэглэсэн асуулт</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="relative w-4 h-4 bg-gray-50 rounded">
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <span>Хариулсан асуулт</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;
