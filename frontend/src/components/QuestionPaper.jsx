import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';

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
        <div>
            <h1 className="text-2xl font-bold mb-4 w-[49%] mx-auto mt-10">
                {examType === 'NEET' ? 'NEET Mock Test' : 'JEE Mock Test'}
            </h1>

            {/* Question navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 w-[80%] mx-auto max-w-[600px]">
                {filteredQuestions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => navigateToQuestion(index)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center
                            ${currentQuestion === index ? 'bg-blue-600' :
                                isAnswered(index) ? 'bg-green-600' : 'bg-gray-700'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {filteredQuestions.length > 0 ? (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[50%] mx-auto">
                    <div className="flex justify-between mb-4">
                        <span className="bg-gray-700 px-3 py-1 rounded">Question {currentQuestion + 1} of {filteredQuestions.length}</span>
                        <span className="bg-gray-700 px-3 py-1 rounded">Type: {subjectquestion?.type}</span>
                    </div>

                    <h2 className="text-2xl mb-3">{subjectquestion?.question}</h2>

                    {/* MCQ type question */}
                    {subjectquestion?.type === 'MCQ' && subjectquestion?.options && (
                        <ul className="space-y-2">
                            {subjectquestion.options.map((option, index) => {
                                const isSelected = parseInt(userAnswers[`${selectedSubject}-${currentQuestion}`]) === index;

                                return (
                                    <li
                                        key={index}
                                        onClick={() => !isSelected && handleOptionSelect(index)}
                                        className={`p-4 pl-4 rounded-md cursor-pointer 
                                            ${isSelected ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
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
                            <label className="block text-gray-300 mb-2">Enter numerical answer:</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="bg-gray-700 p-3 rounded-md flex-grow text-white"
                                    placeholder="Your answer"
                                    value={numericalAnswer}
                                    onChange={(e) => setNumericalAnswer(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 p-3 rounded-md hover:bg-blue-700 transition"
                                    disabled={userAnswers[`${selectedSubject}-${currentQuestion}`] === numericalAnswer && numericalAnswer !== ''}
                                >
                                    {userAnswers[`${selectedSubject}-${currentQuestion}`] === undefined ? 'Submit' : 'Update'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={handlePrevious}
                            className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50"
                            disabled={currentQuestion === 0 && subjects.indexOf(selectedSubject) === 0}
                        >
                            Previous
                        </button>

                        <span>
                            {Object.keys(userAnswers).filter(key => key.startsWith(selectedSubject)).length} of {filteredQuestions.length} answered
                        </span>

                        <button
                            onClick={handleNext}
                            className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50"
                            disabled={currentQuestion === filteredQuestions.length - 1 && subjects.indexOf(selectedSubject) === subjects.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center">No questions available for {selectedSubject}.</p>
            )}

            {/* Submit test button - only show when ALL questions from ALL subjects are answered */}
            {(() => {
                // For NEET, we'll show the submit button even if not all questions are answered
                // since NEET allows skipping questions without penalty
                if (examType === 'NEET') {
                    // For NEET, maybe require a minimum percentage of answered questions 
                    // or just allow submission at any time
                    const totalAnsweredQuestions = Object.keys(userAnswers).length;
                    const totalQuestions = questions.length;
                    // Allowing submission if at least 1 question is answered
                    return totalAnsweredQuestions > 0 && (
                        <div className="w-[50%] mx-auto mt-6">
                            <button
                                onClick={handleSubmitTest}
                                className="bg-green-600 px-6 py-3 rounded-md w-full hover:bg-green-700 font-bold"
                            >
                                Submit Test
                            </button>
                        </div>
                    );
                } else {
                    // For JEE, keep the original strict requirement
                    const allSubjectsAnswered = subjects.every(subject => {
                        const subjectQuestions = questions.filter(q => q.subject === subject);
                        return subjectQuestions.every((_, index) =>
                            userAnswers[`${subject}-${index}`] !== undefined
                        );
                    });

                    return allSubjectsAnswered && (
                        <div className="w-[50%] mx-auto mt-6">
                            <button
                                onClick={handleSubmitTest}
                                className="bg-green-600 px-6 py-3 rounded-md w-full hover:bg-green-700 font-bold"
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