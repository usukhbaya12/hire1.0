import React from "react";
import {
  Card,
  Divider,
  Radio,
  Checkbox,
  InputNumber,
  Input,
  Image,
} from "antd";
import {
  AlarmAddBoldDuotone,
  BookmarkBoldDuotone,
  BookmarkLineDuotone,
  BookmarkSquareBoldDuotone,
  BookmarkSquareMinimalisticBoldDuotone,
} from "solar-icons";
import { api } from "@/app/utils/routes";
import { BookmarkIcon } from "../Icons";

const QUESTION_TYPES = {
  SINGLE: 10,
  MULTIPLE: 20,
  TRUE_FALSE: 30,
  MATRIX: 40,
  CONSTANT_SUM: 50,
  TEXT: 60,
};

const QuestionCard = ({
  question,
  index,
  answers,
  handleAnswer,
  answeredQuestions,
  flaggedQuestions,
  handleFlag,
  setAnsweredQuestions,
}) => {
  const renderQuestionContent = () => {
    const extractParagraphs = (html) => {
      const div = document.createElement("div");
      div.innerHTML = html;
      const paragraphs = div.getElementsByTagName("p");
      const pContent = Array.from(paragraphs)
        .map((p) => p.innerHTML)
        .join("<br />");
      return pContent || html;
    };

    return (
      <div className="max-w-none font-semibold leading-5">
        <div
          dangerouslySetInnerHTML={{
            __html: extractParagraphs(question.question.name),
          }}
        />
      </div>
    );
  };

  const renderMatrix = () => (
    <div className="mt-4 overflow-x-auto pb-1">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="bg-gray-50/50 rounded-t-xl p-3 w-[200px] text-left text-gray-700 text-sm font-medium"></th>
            {question.answers[0].matrix.map((point, index) => (
              <th
                key={index}
                className="text-center bg-gray-50/50 last:rounded-t-xl p-3 text-gray-700 text-sm font-medium"
              >
                {point.value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {question.answers.map((answer, rowIndex) => (
            <tr key={rowIndex}>
              <td className="p-3 text-gray-700 font-medium border-t border-gray-100">
                {answer.value}
              </td>
              {answer.matrix.map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="p-3 text-center border-t border-gray-100"
                >
                  <Radio
                    checked={
                      answers[question.question.id]?.[answer.id]?.[0] === _.id
                    }
                    onChange={() => {
                      const newAnswer = {
                        ...(answers[question.question.id] || {}),
                        [answer.id]: _.id,
                      };
                      handleAnswer(question.question.id, newAnswer);
                      const isComplete = question.answers.every(
                        (ans) => newAnswer[ans.id] !== undefined
                      );

                      setAnsweredQuestions((prev) => {
                        const newSet = new Set(prev);
                        if (isComplete) {
                          newSet.add(question.question.id);
                        } else {
                          newSet.delete(question.question.id);
                        }
                        return newSet;
                      });
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderConstantSum = () => {
    const targetSum = parseInt(question.question.point) || 10;
    const maxValue = parseInt(question.question.maxValue);
    const minValue = parseInt(question.question.minValue);
    const currentAnswers = answers[question.question.id] || {};
    const currentSum = Object.values(currentAnswers).reduce(
      (sum, val) => sum + (val || 0),
      0
    );

    const getStatus = () => {
      if (currentSum === targetSum)
        return { color: "#22c55e", text: "Дууссан" };
      if (currentSum > targetSum) return { color: "#ef4444", text: "Хэтэрсэн" };
      return {
        color: "#f36421",
        text: "Үлдсэн оноо: " + (targetSum - currentSum),
      };
    };

    const { color, text } = getStatus();

    return (
      <div>
        <div className="bg-white rounded-xl py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">
              Нийлбэр:{" "}
              <span className="font-black text-lg pl-1" style={{ color }}>
                {currentSum}
              </span>
              /{targetSum}
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="text-sm font-medium" style={{ color }}>
                {text}
              </div>
            </div>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${Math.min((currentSum / targetSum) * 100, 100)}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
        <Divider />

        <div className="grid">
          {question.answers.map((answer, index) => (
            <div key={index}>
              <div className="flex items-center justify-between gap-8 py-2">
                <div className="py-1 rounded-xl">
                  {answer.file ? (
                    <img
                      draggable="false"
                      src={answer.file}
                      alt={`Option ${index + 1}`}
                      className="max-h-[100px] h-auto rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-700">{answer.value}</span>
                  )}
                </div>
                <InputNumber
                  className="min-w-16 max-w-16 w-16"
                  min={minValue}
                  max={maxValue}
                  value={currentAnswers[answer.id] || 0}
                  onChange={(value) => {
                    const newValue = value === null ? 0 : value;
                    const newAnswers = {
                      ...currentAnswers,
                      [answer.id]: newValue,
                    };
                    handleAnswer(question.question.id, newAnswers);

                    const newSum = Object.values(newAnswers).reduce(
                      (sum, val) => sum + (parseFloat(val) || 0),
                      0
                    );

                    const isValidSum = (sum, target, tolerance = 0.001) =>
                      Math.abs(sum - target) <= tolerance;

                    setAnsweredQuestions((prev) => {
                      const newSet = new Set(prev);
                      if (isValidSum(newSum, targetSum)) {
                        newSet.add(question.question.id);
                      } else {
                        newSet.delete(question.question.id);
                      }
                      return newSet;
                    });
                  }}
                  precision={0}
                />
              </div>
              {index !== question.answers.length - 1 && (
                <Divider className="constant-sum" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAnswers = () => {
    switch (question.question.type) {
      case QUESTION_TYPES.SINGLE:
        return (
          <Radio.Group
            className="w-full space-y-2 pl-3.5"
            value={answers[question.question.id]}
            onChange={(e) => handleAnswer(question.question.id, e.target.value)}
          >
            {question.answers.map((answer, index) => (
              <div key={index}>
                <Radio value={answer.id} className="w-full">
                  <div className="py-[6px] px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    {answer.file ? (
                      <img
                        draggable="false"
                        src={answer.file}
                        alt={`Option ${index + 1}`}
                        className="max-h-[100px] h-auto rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-700">{answer.value}</span>
                    )}
                  </div>
                </Radio>
              </div>
            ))}
          </Radio.Group>
        );

      case QUESTION_TYPES.MULTIPLE:
        return (
          <Checkbox.Group
            className="w-full space-y-2 flex flex-col pl-3.5"
            value={answers[question.question.id] || []}
            onChange={(values) => handleAnswer(question.question.id, values)}
          >
            {question.answers.map((answer, index) => (
              <div key={index}>
                <Checkbox value={answer.id} className="w-full">
                  <div className="py-[6px] px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    {answer.file ? (
                      <img
                        draggable="false"
                        src={answer.file}
                        alt={`Option ${index + 1}`}
                        className="max-h-[100px] h-auto rounded-lg"
                      />
                    ) : (
                      <span className="text-gray-700">{answer.value}</span>
                    )}
                  </div>
                </Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        );

      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <Radio.Group
            className="w-full space-y-2 pl-3.5"
            value={answers[question.question.id]}
            onChange={(e) => handleAnswer(question.question.id, e.target.value)}
          >
            <div>
              <Radio value={true} className="w-full">
                <div className="py-[6px] px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-gray-700">Үнэн</span>
                </div>
              </Radio>
              <Radio value={false} className="w-full">
                <div className="py-[6px] px-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <span className="text-gray-700">Худал</span>
                </div>
              </Radio>
            </div>
          </Radio.Group>
        );

      case QUESTION_TYPES.MATRIX:
        return renderMatrix();

      case QUESTION_TYPES.CONSTANT_SUM:
        return renderConstantSum();

      case QUESTION_TYPES.TEXT:
        return (
          <div className="mb-1">
            <Input.TextArea
              rows={3}
              placeholder="Хариултаа бичнэ үү."
              defaultValue={answers[question.id] || ""}
              onChange={(e) => {
                handleAnswer(question.question.id, e.target.value);
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      id={`question-${question.question.id}`}
      className="rounded-3xl duration-200 sm:px-1"
    >
      <div className="flex gap-5 items-center">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center relative">
            <span className="text-gray-700 font-medium">{index + 1}</span>
            <div className="absolute -top-1 -right-1">
              <div
                onClick={() => handleFlag(question.question.id)}
                className={`cursor-pointer transition-colors duration-200
                  ${
                    flaggedQuestions.has(question.question.id)
                      ? "text-main"
                      : "text-gray-400 hover:text-gray-500"
                  }`}
              >
                <BookmarkIcon width={20} height={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="prose max-w-none">{renderQuestionContent()}</div>
        </div>
      </div>

      {question.question.file && (
        <div className="pt-3 sm:pt-2 sm:pb-1 sm:max-w-[400px] flex sm:ml-[55px]">
          <Image
            src={`${api}file/${question.question.file}`}
            alt="Question"
            className="object-cover rounded-xl"
          />
        </div>
      )}

      <div className="pt-1">
        <Divider />
      </div>
      {renderAnswers()}
    </Card>
  );
};

export default QuestionCard;
