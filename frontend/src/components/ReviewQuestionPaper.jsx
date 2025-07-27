import React, { useState, useEffect } from "react";
import { useExam } from "../context/ExamContext";
import { useNavigate } from "react-router-dom";
import PaginatedQuestionCircles from "./PaginatedQuestionCircles";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const ReviewQuestionPaper = () => {
  const {
    questions,
    subjects,
    userAnswers,
    selectedSubject,
    setSelectedSubject,
    currentQuestion,
    setCurrentQuestion,
  } = useExam();

  const navigate = useNavigate();

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

  // Get filtered questions for the current subject
  const filteredQuestions = questions.filter(
    (q) => q.subject === selectedSubject
  );

  // Get the current question
  const subjectQuestion = filteredQuestions[currentQuestion] || null;

  // Function to check if the answer is correct
  const isAnswerCorrect = (question, userAnswer) => {
    if (!question || userAnswer === undefined) return false;

    if (question.type === "MCQ") {
      return parseInt(userAnswer) === question.correct_answer_index;
    } else if (question.type === "Numerical") {
      return parseFloat(userAnswer) === parseFloat(question.correct_answer);
    }
    return false;
  };

  // Handlers for navigation
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      // Move to previous subject
      const currentSubjectIndex = subjects.indexOf(selectedSubject);
      if (currentSubjectIndex > 0) {
        const prevSubject = subjects[currentSubjectIndex - 1];
        setSelectedSubject(prevSubject);
        const prevSubjectQuestions = questions.filter(
          (q) => q.subject === prevSubject
        );
        setCurrentQuestion(prevSubjectQuestions.length - 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Move to next subject
      const currentSubjectIndex = subjects.indexOf(selectedSubject);
      if (currentSubjectIndex < subjects.length - 1) {
        setSelectedSubject(subjects[currentSubjectIndex + 1]);
        setCurrentQuestion(0);
      }
    }
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  const isAnswered = (index) => {
    return userAnswers[`${selectedSubject}-${index}`] !== undefined;
  };

  // Get subject statistics for the tabs
  const getSubjectStats = (subject) => {
    const subjectQuestions = questions.filter((q) => q.subject === subject);
    let correct = 0;
    let incorrect = 0;
    let total = subjectQuestions.length;
    let attempted = 0;

    subjectQuestions.forEach((question, index) => {
      const userAnswer = userAnswers[`${subject}-${index}`];
      if (userAnswer !== undefined) {
        attempted++;
        if (isAnswerCorrect(question, userAnswer)) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    return { correct, incorrect, total, attempted };
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0A0A0B] via-[#110D1A] to-[#090015] overflow-x-hidden relative">
      {/* Background gradient blur */}
      <div
        className="w-full md:w-[60%] lg:w-[800px] h-[300px] md:h-[500px] lg:h-[700px] absolute right-0 md:right-[5%] lg:right-[12%] top-[-10%] md:top-[-15%] lg:top-[-20%] rounded-full 
    bg-[#441d85] bg-opacity-70
    shadow-[0_0_400px_10px_rgba(122,47,249,0.8)] md:shadow-[0_0_600px_10px_rgba(122,47,249,0.8)] lg:shadow-[0_0_800px_10px_rgba(122,47,249,0.8)]
    backdrop-blur-md border-none outline-none blur-[150px] md:blur-[200px] lg:blur-[300px] z-0"
      />

      <div className="min-h-screen bg-opacity-70 text-white py-6 md:py-8 lg:py-12 relative z-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 md:mb-10 lg:mb-14 text-center">
            Review Your Answers
          </h1>

          {/* Subject Tabs */}
          <div className="w-full md:w-[90%] lg:w-[80%] mx-auto mb-4 md:mb-6">
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-700 w-full md:w-[80%] lg:w-[60%] mx-auto justify-between">
              {subjects.map((subject) => {
                const stats = getSubjectStats(subject);
                const isActive = subject === selectedSubject;

                return (
                  <button
                    key={subject}
                    onClick={() => {
                      setSelectedSubject(subject);
                      setCurrentQuestion(0);
                    }}
                    className={`px-2 md:px-3 lg:px-5 py-2 md:py-3 text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 border-b-2 
                                ${
                                  isActive
                                    ? "border-blue-500 text-blue-400"
                                    : "border-transparent hover:text-gray-300"
                                }`}
                  >
                    <span className="truncate max-w-[80px] md:max-w-full">
                      {subject}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="bg-green-600 px-1 md:px-2 py-0.5 rounded">
                        {stats.correct}
                      </span>
                      <span className="bg-red-600 px-1 md:px-2 py-0.5 rounded">
                        {stats.incorrect}
                      </span>
                      <span className="bg-gray-700 px-1 md:px-2 py-0.5 rounded">
                        {stats.total - stats.attempted}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question navigation */}
          <PaginatedQuestionCircles
            filteredQuestions={filteredQuestions}
            currentQuestion={currentQuestion}
            isAnswered={isAnswered}
            navigateToQuestion={navigateToQuestion}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            isReviewMode={true}
            userAnswers={userAnswers}
            selectedSubject={selectedSubject}
            isAnswerCorrect={isAnswerCorrect}
          />

          {subjectQuestion ? (
            <div className="bg-gray-800/50 p-3 md:p-4 lg:p-6 rounded-lg shadow-lg w-full md:w-[95%] lg:w-[90%] max-w-[900px] mx-auto">
              <div className="flex flex-col sm:flex-row justify-between mb-3 md:mb-4 gap-2 sm:gap-0">
                <span className="bg-gray-700/40 px-2 md:px-3 py-2 md:py-4 rounded text-sm md:text-base">
                  {selectedSubject} - Question {currentQuestion + 1} of{" "}
                  {filteredQuestions.length}
                </span>
                <span className="bg-gray-700/40 px-2 md:px-3 py-2 md:py-4 rounded text-sm md:text-base">
                  Type: {subjectQuestion.type}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl lg:text-3xl my-4 md:my-6">
                {renderWithLatex(subjectQuestion.question)}
              </h2>

              {/* MCQ type question */}
              {subjectQuestion.type === "MCQ" && subjectQuestion.options && (
                <ul className="space-y-2">
                  {subjectQuestion.options.map((option, index) => {
                    const userAnswer =
                      userAnswers[`${selectedSubject}-${currentQuestion}`];
                    const isSelected = parseInt(userAnswer) === index;
                    const isCorrectAnswer =
                      index === subjectQuestion.correct_answer_index;

                    let optionClass =
                      "p-3 md:p-4 pl-3 md:pl-4 rounded-md text-sm md:text-base";

                    if (isSelected && isCorrectAnswer) {
                      optionClass += " border-green-600"; // Correct answer
                    } else if (isSelected && !isCorrectAnswer) {
                      optionClass += " border-red-600"; // Wrong answer
                    } else if (isCorrectAnswer) {
                      optionClass += " border-green-600 bg-opacity-50"; // Show correct answer
                    } else {
                      optionClass += " border-gray-700"; // Neither selected nor correct
                    }

                    return (
                      <li key={index} className={`border-2 ${optionClass}`}>
                        {renderWithLatex(option)}
                        {isCorrectAnswer && (
                          <span className="ml-2 font-bold">
                            (Correct Answer)
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Numerical type question */}
              {subjectQuestion.type === "Numerical" && (
                <div className="mt-4">
                  <label className="block text-gray-300 mb-3 md:mb-4 text-base md:text-lg">
                    Your numerical answer:
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="number"
                      className={`p-2 md:p-3 rounded-md flex-grow text-white bg-gray-700/40 ${
                        isAnswerCorrect(
                          subjectQuestion,
                          userAnswers[`${selectedSubject}-${currentQuestion}`]
                        )
                          ? "border-2 border-green-600"
                          : userAnswers[
                              `${selectedSubject}-${currentQuestion}`
                            ] !== undefined
                          ? "border-2 border-red-600"
                          : "border-2 border-gray-700"
                      }`}
                      value={
                        userAnswers[`${selectedSubject}-${currentQuestion}`] ||
                        ""
                      }
                      readOnly
                    />
                  </div>
                  <div className="p-2 md:p-3 bg-green-500 bg-opacity-50 rounded-md text-sm md:text-base">
                    <strong>Correct Answer:</strong>{" "}
                    {subjectQuestion.correct_answer}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 md:mt-6 gap-3 sm:gap-0">
                <button
                  onClick={handlePrevious}
                  className="bg-gray-700/40 px-3 md:px-4 py-2 md:py-4 rounded-md hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
                  disabled={
                    currentQuestion === 0 &&
                    subjects.indexOf(selectedSubject) === 0
                  }
                >
                  Previous
                </button>

                <span className="text-sm md:text-base">
                  {
                    Object.keys(userAnswers).filter((key) =>
                      key.startsWith(selectedSubject)
                    ).length
                  }{" "}
                  of {filteredQuestions.length} answered
                </span>

                <button
                  onClick={handleNext}
                  className="bg-gray-700/40 px-3 md:px-4 py-2 md:py-4 rounded-md hover:bg-gray-600 disabled:opacity-50 w-full sm:w-auto"
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

          {/* Back to results button */}
          <div className="w-[100%] max-w-[900px] mx-auto mt-4 md:mt-6">
            <button
              onClick={() => navigate("/result")}
              className="bg-[#6028b9] px-4 md:px-6 py-2 md:py-3 rounded-md w-full font-bold border-2 border-gray-500 text-sm md:text-base"
            >
              Back to Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewQuestionPaper;
