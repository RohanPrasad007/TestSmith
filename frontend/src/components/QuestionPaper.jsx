import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';

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
        allQuestionsAnswered,
        handlePrevious,
        handleNext,
        submitTest,
        showScoreModal,
        setShowScoreModal,
        scoreDetails,
        examCompleted,
        questions
    } = useExam();

    // Get the current question
    const subjectquestion = filteredQuestions[currentQuestion];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 w-[49%] mx-auto mt-10">JEE Mock Test</h1>

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

                    {/* Numerical type question */}
                    {subjectquestion?.type === 'Numerical' && (
                        <form onSubmit={handleNumericalSubmit} className="mt-4">
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
                                >
                                    Submit
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
                // Check if all questions from all subjects are answered
                const allSubjectsAnswered = subjects.every(subject => {
                    const subjectQuestions = questions.filter(q => q.subject === subject);
                    return subjectQuestions.every((_, index) =>
                        userAnswers[`${subject}-${index}`] !== undefined
                    );
                });

                return allSubjectsAnswered && (
                    <div className="w-[50%] mx-auto mt-6">
                        <button
                            onClick={submitTest}
                            className="bg-green-600 px-6 py-3 rounded-md w-full hover:bg-green-700 font-bold"
                        >
                            Submit Test
                        </button>
                    </div>
                );
            })()}

            {showScoreModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-xl w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-center">JEE Test Score Report</h2>

                        <div className="bg-gray-700 p-6 rounded-lg mb-4">
                            <h3 className="text-xl mb-4 font-semibold text-center">Subject: {selectedSubject}</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-600 p-4 rounded-lg">
                                    <p className="text-lg font-semibold">Total Score</p>
                                    <p className="text-3xl font-bold text-blue-400">{scoreDetails.totalScore}</p>
                                </div>
                                <div className="bg-gray-600 p-4 rounded-lg">
                                    <p className="text-lg font-semibold">Maximum Marks</p>
                                    <p className="text-3xl font-bold">{scoreDetails.totalQuestions * 4}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Questions Breakdown</h4>
                                    <ul className="space-y-1">
                                        <li className="flex justify-between">
                                            <span>Total Questions:</span>
                                            <span>{scoreDetails.totalQuestions}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Attempted:</span>
                                            <span>{scoreDetails.attemptedCount}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Unattempted:</span>
                                            <span>{scoreDetails.unattemptedCount}</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Marks Breakdown</h4>
                                    <ul className="space-y-1">
                                        <li className="flex justify-between">
                                            <span>Correct MCQs:</span>
                                            <span className="text-green-400">{scoreDetails.correctMCQ} (+{scoreDetails.correctMCQ * 4})</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Incorrect MCQs:</span>
                                            <span className="text-red-400">{scoreDetails.incorrectMCQ} (-{scoreDetails.incorrectMCQ})</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Correct Numerical:</span>
                                            <span className="text-green-400">{scoreDetails.correctNumerical} (+{scoreDetails.correctNumerical * 4})</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setShowScoreModal(false)}
                                className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-500 transition"
                            >
                                Review Answers
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionPaper;