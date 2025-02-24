"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Image, Spin, message, Progress } from "antd";
import {
  getExamQuestions,
  getUserAnswer,
  postUserAnswers,
} from "@/app/api/exam";
import { InfoCircleBoldDuotone, LibraryBoldDuotone } from "solar-icons";
import Timer from "@/components/Timer";
import { useSession, signIn } from "next-auth/react";

import QuestionCard from "@/components/exam/Question";
import QuestionNavigation from "@/components/exam/Navigation";
import SidePanel from "@/components/exam/Panel";
import ExamFooter from "@/components/exam/Footer";
import Header from "@/components/Header";

import FlagModal from "@/components/modals/Flag";
import FinishModal from "@/components/modals/Finish";
import Error from "@/components/Error";
import Completion from "@/components/Completion";

export default function Exam() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [examStartTime, setExamStartTime] = useState(null);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFlagModalOpen, setIsFlagModalOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const requested = useRef(false);
  const [showReport, setShowReport] = useState(true);

  const getData = async () => {
    const userAnswers = await getUserAnswer(params.id);
    setAnsweredQuestions(new Set());
    if (userAnswers.data) {
      let answeredAnswers = {};
      Object.entries(userAnswers.data).forEach(([question, values]) => {
        setAnsweredQuestions((prev) => {
          const newSet = new Set(prev);
          newSet.add(+question);
          return newSet;
        });

        let answered,
          answeredObj = {};
        let obj = true;
        Object.entries(values).forEach(([answer, value]) => {
          answered = +answer;
          answeredObj[answer] =
            value?.[0]?.matrix == null ? +value?.[0]?.point : value[0].matrix;
          obj =
            value[0].type === 10 ||
            value[0].type === 60 ||
            value[0].type === 30;
        });
        answeredAnswers[question] = obj ? answered : answeredObj;
      });
      setAnswers(answeredAnswers);
    }
  };

  useEffect(() => {
    const authenticate = async () => {
      if (status === "unauthenticated") {
        try {
          const response = await getExamQuestions(params.id);

          if (response.success && response.data.token) {
            await signIn("exam-token", {
              token: response.data.token,
              redirect: false,
            });
          }
        } catch (error) {
          console.error("Auth error:", error);
        }
      }
    };

    authenticate();
  }, [status, params.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" || session) {
        try {
          requested.current = true;
          const response = await getExamQuestions(params.id);

          if (response.success) {
            setQuestionData(response.data);
            setExamStartTime(
              response.data.assessment.duration > 0 ? Date.now() : null
            );
          } else {
            setError(response.message || "Тест олдсонгүй");
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!requested.current) {
      fetchData();
      getData();
    }
  }, [requested, status, session]);

  useEffect(() => {
    const preventNavigation = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const preventKeys = (e) => {
      if (
        (e.key === "Backspace" && e.target === document.body) ||
        (e.key === "r" && e.ctrlKey) ||
        e.key === "F5"
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", preventNavigation);
    window.addEventListener("keydown", preventKeys);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, "", window.location.href);
    });

    return () => {
      window.removeEventListener("beforeunload", preventNavigation);
      window.removeEventListener("keydown", preventKeys);
      window.removeEventListener("popstate", () => {});
    };
  }, [questionData]);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setAnsweredQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.add(questionId);
      return newSet;
    });
  };

  const publish = async () => {
    try {
      const validAnswers = Object.entries(answers).filter(
        ([_, value]) => value !== undefined
      );

      const body = validAnswers.map(([question, value]) => {
        const payload = {
          flag: false,
          questionCategory: questionData.category.id,
          code: params.id,
          question,
          answers: [],
          correct: false,
        };

        if (value === null) {
          payload.answers.push({
            answer: null,
            point: null,
            matrix: null,
          });
          return payload;
        }

        if (typeof value === "number") {
          payload.answers.push({
            answer: value,
            point: null,
            matrix: null,
          });
        } else if (typeof value === "object") {
          Object.entries(value).forEach(([q, v]) => {
            payload.answers.push({
              answer: q,
              point: v > 10 ? null : v,
              matrix: v <= 10 ? null : v,
            });
          });
        } else if (typeof value === "string") {
          payload.answers.push({ value });
        }

        return payload;
      });

      if (body.length === 0) {
        console.warn("No valid answers to publish!");
        return;
      }

      const result = await postUserAnswers(
        body,
        new Date(),
        questionData.categories?.length === 0
      );

      return result;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  };

  const handleTimeUp = useCallback(async () => {
    setLoading(true);

    try {
      questionData.questions.forEach((question) => {
        const questionId = question.question.id;
        if (!answeredQuestions.has(questionId)) {
          answeredQuestions.add(questionId);
          answers[questionId] = null;
        }
      });

      setAnsweredQuestions(new Set(answeredQuestions));
      setAnswers({ ...answers });

      await publish();

      if (questionData?.categories?.length > 0) {
        const nextCategoryId = questionData.categories[0];
        const response = await getExamQuestions(params.id, nextCategoryId);

        if (response.success) {
          await getData();
          setQuestionData(response.data);
          setFlaggedQuestions(new Set());
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        setShowFeedbackModal(true);
      }
    } catch (error) {
      console.error("Error during time up handling:", error);
      messageApi.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  }, [
    questionData?.categories,
    params.id,
    messageApi,
    answers,
    answeredQuestions,
    publish,
    getData,
  ]);

  const handleSectionChange = async (timeUp = false) => {
    if (!timeUp) {
      const allAnswered = questionData.questions.every((question) =>
        answeredQuestions.has(question.question.id)
      );
      if (!allAnswered) {
        messageApi.warning("Бүх асуултад хариулна уу.");
        return;
      }
    }

    try {
      setLoading(true);
      const result = await publish();

      if (questionData?.categories?.length > 0) {
        const nextCategoryId = questionData.categories[0];
        const response = await getExamQuestions(
          params.id,
          nextCategoryId ? nextCategoryId : -1
        );

        if (response.success) {
          await getData();
          setQuestionData(response.data);
          setFlaggedQuestions(new Set());
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else {
        setShowFeedbackModal(true);
        setShowReport(result.data.visible);
      }
    } catch (error) {
      console.error("Error during section change:", error);
      messageApi.error("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const getProgress = () => {
    if (!questionData?.questions) return 0;
    const answeredCount = questionData.questions.filter((q) =>
      answeredQuestions.has(q.question.id)
    ).length;
    return (answeredCount / questionData.questions.length) * 100;
  };

  const handleQuestionClick = (questionId) => {
    const element = document.getElementById(`question-${questionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (error) return <Error message={error} />;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin fullscreen tip="Уншиж байна..." spinning={loading} />
      </div>
    );
  }
  if (!questionData) return null;

  const totalBlocks =
    questionData?.categories.length + questionData?.category.orderNumber;

  const renderContent = () => {
    const renderHeader = () => (
      <>
        <div className="fixed top-0 sm:top-4 w-full sm:w-fit 2xl:px-72 xl:px-24 lg:px-16 md:px-12 z-[100]">
          <Header assessment={questionData?.assessment.timeout} />
        </div>
        <div className="hidden sm:block fixed -top-48 w-[500px] h-[500px] 2xl:right-60 xl:right-24 lg:right-16 md:right-12">
          <Image
            src="/brain-home.png"
            alt="Brain icon"
            className="object-contain opacity-10 sm:opacity-20"
            draggable={false}
            preview={false}
          />
        </div>

        <div className="max-w-3xl mx-auto px-6 sm:px-0 pt-[92px] sm:pt-4">
          <div className="md:bg-white/70 md:py-[22px] relative rounded-full md:shadow md:shadow-slate-200 backdrop-blur-md md:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-black bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent">
                {questionData.assessment.name}
              </h1>
              {totalBlocks > 1 && (
                <div className="hidden sm:block">
                  <Progress
                    percent={
                      showCompletion || showFeedbackModal
                        ? 100
                        : Math.round(
                            (questionData.category.orderNumber / totalBlocks) *
                              100
                          )
                    }
                    steps={totalBlocks}
                    strokeColor="#f36421"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );

    if (showCompletion) {
      return (
        <>
          {renderHeader()}
          <div className="fixed inset-0 bg-gray-100 z-10 pt-[200px]">
            <Completion
              examId={params.id}
              onClose={() => {
                router.push("/");
              }}
              questionData={questionData}
              showReport={showReport}
            />
          </div>
        </>
      );
    }

    if (showFeedbackModal) {
      return (
        <>
          {renderHeader()}
          <div className="fixed inset-0 bg-gray-100 z-10 pt-[200px]">
            <FinishModal
              open={showFeedbackModal}
              onClose={() => setShowFeedbackModal(false)}
              onSubmit={() => {
                setShowFeedbackModal(false);
                setShowCompletion(true);
              }}
              assessment={questionData.assessment.id}
            />
          </div>
        </>
      );
    }

    return (
      <>
        {renderHeader()}

        <div className="fixed top-0 sm:top-4 right-0 2xl:px-72 xl:px-24 lg:px-16 md:px-12 z-[100]">
          {questionData.assessment.timeout && (
            <div className="flex items-center gap-2">
              {questionData.category.duration > 0 && (
                <Timer
                  key={questionData.category.id}
                  totalDuration={null}
                  duration={questionData.category.duration}
                  startTime={null}
                  onTimeUp={handleTimeUp}
                />
              )}
              {questionData.assessment.duration > 0 &&
                questionData.category.duration === 0 && (
                  <Timer
                    key={null}
                    duration={null}
                    totalDuration={questionData.assessment.duration}
                    startTime={examStartTime}
                    onTimeUp={handleTimeUp}
                  />
                )}
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto px-6 sm:px-0">
          <div className="sticky top-[72px] sm:top-0 z-10 pt-3 md:pt-4 rounded-b-2xl bg-gradient-to-r from-gray-100 from-100% md:from-60% to-transparent">
            <div className="bg-white backdrop-blur-md rounded-3xl shadow-lg shadow-slate-200">
              <div className="px-4 py-[15px] px-7 md:px-8">
                <div className="justify-between gap-3 flex items-center">
                  <div>
                    <h2 className="font-bold">{questionData.category.name}</h2>
                  </div>
                  <div className="font-medium text-sm text-gray-500">
                    <div className="w-[120px] text-end flex justify-end items-center gap-3">
                      {questionData.category.orderNumber}-р хэсэг /{" "}
                      {totalBlocks}-c
                    </div>
                    <Progress
                      percent={getProgress()}
                      size="small"
                      format={(percent) => `${Math.round(percent)}%`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-4 pb-24">
            {questionData.questions.map((question, index) => (
              <QuestionCard
                key={question.question.id}
                question={question}
                index={index}
                answers={answers}
                handleAnswer={handleAnswer}
                answeredQuestions={answeredQuestions}
                flaggedQuestions={flaggedQuestions}
                handleFlag={handleFlag}
                setAnsweredQuestions={setAnsweredQuestions}
                report={questionData.assessment.report}
              />
            ))}
          </div>

          <ExamFooter
            onFlagClick={() => setIsFlagModalOpen(true)}
            hasAdvice={!!questionData?.assessment.advice}
            advice={questionData?.assessment.advice}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            questions={questionData.questions}
            answeredQuestions={answeredQuestions}
            flaggedQuestions={flaggedQuestions}
            onQuestionClick={handleQuestionClick}
            onSectionChange={() => handleSectionChange()}
            hasMoreCategories={questionData.categories?.length > 0}
          />

          <FlagModal
            open={isFlagModalOpen}
            onClose={() => setIsFlagModalOpen(false)}
            assessment={questionData.assessment.id}
          />
        </div>

        {questionData?.assessment.advice && (
          <SidePanel
            isOpen={isAdviceOpen}
            setIsOpen={setIsAdviceOpen}
            title="Асуумжид хариулах заавар"
            position="left"
            icon={<InfoCircleBoldDuotone width={20} height={20} />}
          >
            <div
              className="prose prose-sm max-w-none text-justify"
              dangerouslySetInnerHTML={{
                __html: questionData?.assessment.advice,
              }}
            />
          </SidePanel>
        )}

        <SidePanel
          isOpen={isNavOpen}
          setIsOpen={setIsNavOpen}
          title="Асуултууд"
          position="right"
          icon={<LibraryBoldDuotone width={20} height={20} />}
        >
          <QuestionNavigation
            questions={questionData.questions}
            answeredQuestions={answeredQuestions}
            flaggedQuestions={flaggedQuestions}
            onQuestionClick={handleQuestionClick}
          />
        </SidePanel>
      </>
    );
  };

  return (
    <>
      {contextHolder}
      {renderContent()}
    </>
  );
}
