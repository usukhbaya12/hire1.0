import React from "react";
import {
  Card,
  Divider,
  Radio,
  Checkbox,
  InputNumber,
  Input,
  Image,
  Slider,
} from "antd";
import { api } from "@/app/utils/routes";
import { BookmarkIcon } from "../Icons";

const QUESTION_TYPES = {
  SINGLE: 10,
  MULTIPLE: 20,
  TRUE_FALSE: 30,
  MATRIX: 40,
  CONSTANT_SUM: 50,
  TEXT: 60,
  SLIDER: 70,
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
  report,
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

  const renderMatrix = () => {
    const getSelectedColumnOrderNumber = (rowId) => {
      const currentAnswers = answers[question.question.id] || {};
      const selectedColId = currentAnswers[rowId];

      if (!selectedColId) return null;

      const rowData = question.answers.find((ans) => ans.id === rowId);
      const selectedColumn = rowData?.matrix.find(
        (col) => col.id === selectedColId
      );
      return selectedColumn?.orderNumber;
    };

    const isColumnUsed = (columnOrderNumber, currentRowId) => {
      if (report !== 20) return false;

      return question.answers.some((answer) => {
        if (answer.id === currentRowId) return false;

        const selectedOrderNumber = getSelectedColumnOrderNumber(answer.id);
        return selectedOrderNumber === columnOrderNumber;
      });
    };

    return (
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
                {answer.matrix.map((col) => {
                  const isCurrentSelection =
                    answers[question.question.id]?.[answer.id] === col.id;
                  const shouldDisable = isColumnUsed(
                    col.orderNumber,
                    answer.id
                  );

                  return (
                    <td
                      key={col.id}
                      className="p-3 text-center border-t border-gray-100"
                    >
                      <Radio
                        checked={isCurrentSelection}
                        disabled={!isCurrentSelection && shouldDisable}
                        onChange={() => {
                          const newAnswer = {
                            ...(answers[question.question.id] || {}),
                            [answer.id]: col.id,
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
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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

      case QUESTION_TYPES.SLIDER:
        const min = parseInt(question.question?.minValue) || 0;
        const max = parseInt(question.question?.maxValue) || 5;

        const internalMin = min - 1;

        const marks = {};

        if (question.question?.slider) {
          const labels = question.question.slider
            .split(",")
            .map((s) => s.trim());

          labels.forEach((label, idx) => {
            marks[min + idx] = label;
          });
        } else {
          for (let i = min; i <= max; i++) {
            marks[i] = i.toString();
          }
        }

        return (
          <div className="space-y-4 pl-3.5">
            {question.answers.map((answer, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 md:justify-between">
                  <div className="md:w-1/4 font-semibold w-full">
                    {answer.value}
                  </div>
                  <div className="md:flex md:pr-5">
                    <Slider
                      tooltip={{ formatter: null }}
                      min={internalMin}
                      max={max}
                      value={
                        answers[question.question.id]?.[answer.id] ??
                        internalMin
                      }
                      onChange={(value) => {
                        if (value >= min) {
                          const newAnswer = {
                            ...(answers[question.question.id] || {}),
                            [answer.id]: value,
                          };
                          handleAnswer(question.question.id, newAnswer);

                          const allAnswered = question.answers.every(
                            (ans) => (newAnswer[ans.id] ?? internalMin) >= min
                          );

                          setAnsweredQuestions((prev) => {
                            const newSet = new Set(prev);
                            if (allAnswered) {
                              newSet.add(question.question.id);
                            } else {
                              newSet.delete(question.question.id);
                            }
                            return newSet;
                          });
                        }
                      }}
                      marks={marks}
                      disabled={false}
                      className="w-[262px] md:w-80 lg:w-96 2xl:w-[500px] custom-slider"
                    />
                  </div>
                </div>
                <Divider />
              </React.Fragment>
            ))}
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
