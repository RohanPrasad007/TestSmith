import React, { useState, useEffect } from "react";
import { useExam } from "../context/ExamContext";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import PaginatedQuestionCircles from "./PaginatedQuestionCircles";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const QuestionPaper = () => {
  const {
    filteredQuestions,
    currentQuestion,
    selectedSubject,
    subjects,
    userAnswers,
    numericalAnswer,
    setNumericalAnswer,
    handleOptionSelect,
    handleNumericalSubmit,
    navigateToQuestion,
    isAnswered,
    handlePrevious,
    handleNext,
    submitTest,
    showScoreModal,
    setShowScoreModal,
    scoreDetails,
    examCompleted,
    questions,
    examType,
  } = useExam();

  // Function to render text with LaTeX
  const renderWithLatex = (text) => {
    if (!text) return "";

    // Split text into parts that are LaTeX (between \( \) or $$ $$) and normal text
    const parts = text.split(/(\\\(.*?\\\)|\$\$.*?\$\$)/);

    return parts.map((part, index) => {
      if (part.startsWith("\\(") && part.endsWith("\\)")) {
        // Inline LaTeX
        const latex = part.substring(2, part.length - 2);
        return <InlineMath key={index} math={latex} />;
      } else if (part.startsWith("$$") && part.endsWith("$$")) {
        // Block LaTeX
        const latex = part.substring(2, part.length - 2);
        return <BlockMath key={index} math={latex} />;
      } else {
        return part;
      }
    });
  };

  // Get the current question
  const subjectquestion = filteredQuestions[currentQuestion];

  const navigate = useNavigate();

  useEffect(() => {
    if (subjectquestion?.type === "Numerical") {
      const savedAnswer = userAnswers[`${selectedSubject}-${currentQuestion}`];
      if (savedAnswer !== undefined) {
        setNumericalAnswer(savedAnswer);
      } else {
        setNumericalAnswer("");
      }
    }
  }, [
    currentQuestion,
    selectedSubject,
    subjectquestion,
    userAnswers,
    setNumericalAnswer,
  ]);

  const handleSubmitTest = () => {
    try {
      submitTest();
      showToast.success("Test submitted successfully!");
      navigate("/result");
    } catch (error) {
      console.error("Error submitting test:", error);
      showToast.error("Failed to submit test. Please try again.");
    }
  };

  const onNumericalSubmit = (e) => {
    e.preventDefault();
    handleNumericalSubmit(e);
  };

  return (
    <div className="w-full px-4">
      <h1 className="items-center my-4 sm:my-6 md:my-8 mx-auto w-full max-w-[600px] bg-white/5 p-3 sm:p-4 rounded-full flex justify-center text-lg sm:text-xl">
        {examType} Mock Test
      </h1>

      <PaginatedQuestionCircles
        filteredQuestions={filteredQuestions}
        currentQuestion={currentQuestion}
        isAnswered={isAnswered}
        navigateToQuestion={navigateToQuestion}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        isReviewMode={false}
      />

      {filteredQuestions.length > 0 ? (
        <div className="bg-black/30 p-4 sm:p-6 rounded-xl shadow-lg w-full sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 sm:gap-0">
            <span className="bg-gray-700/30 px-3 py-2 rounded text-sm sm:text-base">
              Question {currentQuestion + 1} of {filteredQuestions.length}
            </span>
            <span className="bg-gray-700/30 px-3 py-2 rounded text-sm sm:text-base">
              Type: {subjectquestion?.type}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl my-4 sm:my-6 md:my-10">
            {renderWithLatex(subjectquestion?.question)}
          </h2>

          {subjectquestion?.type === "MCQ" && subjectquestion?.options && (
            <ul className="space-y-3 sm:space-y-4">
              {subjectquestion.options.map((option, index) => {
                const isSelected =
                  parseInt(
                    userAnswers[`${selectedSubject}-${currentQuestion}`]
                  ) === index;

                return (
                  <li
                    key={index}
                    onClick={() => !isSelected && handleOptionSelect(index)}
                    className={`p-3 sm:p-4 pl-4 rounded-xl cursor-pointer text-sm sm:text-base
                        ${
                          isSelected
                            ? "border-2 border-blue-600"
                            : "bg-gray-700/40 hover:bg-gray-600"
                        }`}
                  >
                    {renderWithLatex(option)}
                  </li>
                );
              })}
            </ul>
          )}

          {examType !== "NEET" && subjectquestion?.type === "Numerical" && (
            <form onSubmit={onNumericalSubmit} className="mt-4">
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                Enter numerical answer:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  className="bg-gray-700 p-2 sm:p-3 rounded-md flex-grow text-white"
                  placeholder="Your answer"
                  value={numericalAnswer}
                  onChange={(e) => setNumericalAnswer(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="border-2 border-blue-600 p-2 sm:p-3 rounded-md transition"
                  disabled={
                    userAnswers[`${selectedSubject}-${currentQuestion}`] ===
                      numericalAnswer && numericalAnswer !== ""
                  }
                >
                  {userAnswers[`${selectedSubject}-${currentQuestion}`] ===
                  undefined
                    ? "Submit"
                    : "Update"}
                </button>
              </div>
            </form>
          )}

          <div className="flex justify-between mt-6 items-center text-sm sm:text-base">
            <button
              onClick={handlePrevious}
              className="bg-gray-700/30 px-3 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-gray-600 disabled:opacity-50"
              disabled={
                currentQuestion === 0 && subjects.indexOf(selectedSubject) === 0
              }
            >
              Previous
            </button>

            <span className="text-center px-2">
              {
                Object.keys(userAnswers).filter((key) =>
                  key.startsWith(selectedSubject)
                ).length
              }{" "}
              of {filteredQuestions.length} answered
            </span>

            <button
              onClick={handleNext}
              className="bg-gray-700/30 px-3 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-gray-600 disabled:opacity-50"
              disabled={
                currentQuestion === filteredQuestions.length - 1 &&
                subjects.indexOf(selectedSubject) === subjects.length - 1
              }
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center">
          No questions available for {selectedSubject}.
        </p>
      )}

      {(() => {
        if (examType === "NEET") {
          const totalAnsweredQuestions = Object.keys(userAnswers).length;
          return (
            totalAnsweredQuestions > 0 && (
              <div className="w-full sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto mt-4 sm:mt-6">
                <button
                  onClick={handleSubmitTest}
                  className="border-2 border-green-600 px-4 py-2 sm:px-6 sm:py-3 rounded-md w-full hover:bg-green-700 font-bold text-sm sm:text-base"
                >
                  Submit Test
                </button>
              </div>
            )
          );
        } else {
          const hasAtLeastOneAnswer = Object.keys(userAnswers).length > 0;
          return (
            hasAtLeastOneAnswer && (
              <div className="w-full sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto mt-4 sm:mt-6">
                <button
                  onClick={handleSubmitTest}
                  className="bg-green-600 px-4 py-2 sm:px-6 sm:py-3 rounded-md w-full hover:bg-green-700 font-bold text-sm sm:text-base"
                >
                  Submit Test
                </button>
              </div>
            )
          );
        }
      })()}
    </div>
  );
};

export default QuestionPaper;
