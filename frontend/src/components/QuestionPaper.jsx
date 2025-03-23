import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';
import PaginatedQuestionCircles from './PaginatedQuestionCircles';

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
        examType // New prop to determine JEE or NEET
    } = useExam();

    // Get the current question
    const subjectquestion = filteredQuestions[currentQuestion];

    const navigate = useNavigate();

    // Effect to load saved numerical answer when navigating between questions
    useEffect(() => {
        if (subjectquestion?.type === 'Numerical') {
            const savedAnswer = userAnswers[`${selectedSubject}-${currentQuestion}`];
            if (savedAnswer !== undefined) {
                setNumericalAnswer(savedAnswer);
            } else {
                setNumericalAnswer(''); // Only reset when navigating to a new unanswered question
            }
        }
    }, [currentQuestion, selectedSubject, subjectquestion, userAnswers, setNumericalAnswer]);

    const handleSubmitTest = () => {
        try {
            submitTest();
            showToast.success("Test submitted successfully!");
            navigate('/result');
        } catch (error) {
            console.error("Error submitting test:", error);
            showToast.error("Failed to submit test. Please try again.");
        }
    };

    // Custom numerical submit handler to wrap the context handler
    const onNumericalSubmit = (e) => {
        e.preventDefault();
        handleNumericalSubmit(e);
        // Don't reset numericalAnswer here as it would cause the value to disappear
    };

    return (

        <div className="w-full px-4">
            <h1 className="items-center my-4 sm:my-6 md:my-8 mx-auto w-full max-w-[600px] bg-white/5 p-3 sm:p-4 rounded-full flex justify-center text-lg sm:text-xl">
                {examType === 'NEET' ? 'NEET Mock Test' : 'JEE Mock Test'}
            </h1>

            {/* Question navigation */}
            <PaginatedQuestionCircles
                filteredQuestions={filteredQuestions}
                currentQuestion={currentQuestion}
                isAnswered={isAnswered}
                navigateToQuestion={navigateToQuestion}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                isReviewMode={false} // Default is false
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
                        {subjectquestion?.question}
                    </h2>

                    {/* MCQ type question */}
                    {subjectquestion?.type === 'MCQ' && subjectquestion?.options && (
                        <ul className="space-y-3 sm:space-y-4">
                            {subjectquestion.options.map((option, index) => {
                                const isSelected = parseInt(userAnswers[`${selectedSubject}-${currentQuestion}`]) === index;

                                return (
                                    <li
                                        key={index}
                                        onClick={() => !isSelected && handleOptionSelect(index)}
                                        className={`p-3 sm:p-4 pl-4 rounded-xl cursor-pointer text-sm sm:text-base
                        ${isSelected ? 'border-2 border-blue-600' : 'bg-gray-700/40 hover:bg-gray-600'}`}
                                    >
                                        {option}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {/* Numerical type question - Only shown for JEE */}
                    {examType !== 'NEET' && subjectquestion?.type === 'Numerical' && (
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
                                    disabled={userAnswers[`${selectedSubject}-${currentQuestion}`] === numericalAnswer && numericalAnswer !== ''}
                                >
                                    {userAnswers[`${selectedSubject}-${currentQuestion}`] === undefined ? 'Submit' : 'Update'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-6 items-center text-sm sm:text-base">
                        <button
                            onClick={handlePrevious}
                            className="bg-gray-700/30 px-3 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-gray-600 disabled:opacity-50"
                            disabled={currentQuestion === 0 && subjects.indexOf(selectedSubject) === 0}
                        >
                            Previous
                        </button>

                        <span className="text-center px-2">
                            {Object.keys(userAnswers).filter(key => key.startsWith(selectedSubject)).length} of {filteredQuestions.length} answered
                        </span>

                        <button
                            onClick={handleNext}
                            className="bg-gray-700/30 px-3 py-2 sm:px-4 sm:py-3 rounded-md hover:bg-gray-600 disabled:opacity-50"
                            disabled={currentQuestion === filteredQuestions.length - 1 && subjects.indexOf(selectedSubject) === subjects.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center">No questions available for {selectedSubject}.</p>
            )}

            {/* Submit test button - only show when needed */}
            {(() => {
                // For NEET, we'll show the submit button even if not all questions are answered
                if (examType === 'NEET') {
                    const totalAnsweredQuestions = Object.keys(userAnswers).length;
                    // Allowing submission if at least 1 question is answered
                    return totalAnsweredQuestions > 0 && (
                        <div className="w-full sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto mt-4 sm:mt-6">
                            <button
                                onClick={handleSubmitTest}
                                className="border-2 border-green-600 px-4 py-2 sm:px-6 sm:py-3 rounded-md w-full hover:bg-green-700 font-bold text-sm sm:text-base"
                            >
                                Submit Test
                            </button>
                        </div>
                    );
                } else {
                    const hasAtLeastOneAnswer = Object.keys(userAnswers).length > 0;

                    return hasAtLeastOneAnswer && (
                        <div className="w-full sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto mt-4 sm:mt-6">
                            <button
                                onClick={handleSubmitTest}
                                className="bg-green-600 px-4 py-2 sm:px-6 sm:py-3 rounded-md w-full hover:bg-green-700 font-bold text-sm sm:text-base"
                            >
                                Submit Test
                            </button>
                        </div>
                    );
                }
            })()}
        </div>

    );
};

export default QuestionPaper;