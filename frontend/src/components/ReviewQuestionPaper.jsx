import React, { useState, useEffect } from 'react';
import { useExam } from '../context/ExamContext';
import { useNavigate } from 'react-router-dom';

const ReviewQuestionPaper = () => {
    const {
        questions,
        subjects,
        userAnswers,
        selectedSubject,
        setSelectedSubject,
        currentQuestion,
        setCurrentQuestion
    } = useExam();

    const navigate = useNavigate();

    // Get filtered questions for the current subject
    const filteredQuestions = questions.filter(q => q.subject === selectedSubject);

    // Get the current question
    const subjectQuestion = filteredQuestions[currentQuestion] || null;

    // Function to check if the answer is correct
    const isAnswerCorrect = (question, userAnswer) => {
        if (!question || userAnswer === undefined) return false;

        if (question.type === 'MCQ') {
            return parseInt(userAnswer) === question.correct_answer_index;
        } else if (question.type === 'Numerical') {
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
                const prevSubjectQuestions = questions.filter(q => q.subject === prevSubject);
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
        const subjectQuestions = questions.filter(q => q.subject === subject);
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
        <div className="min-h-screen bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-14 text-center">Review Your Answers</h1>

                {/* Subject Tabs */}
                <div className="w-[80%] mx-auto mb-6 ">
                    <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-700 w-[60%] mx-auto justify-between">
                        {subjects.map(subject => {
                            const stats = getSubjectStats(subject);
                            const isActive = subject === selectedSubject;

                            return (
                                <button
                                    key={subject}
                                    onClick={() => {
                                        setSelectedSubject(subject);
                                        setCurrentQuestion(0);
                                    }}
                                    className={`px-5 py-3 whitespace-nowrap flex items-center gap-2 border-b-2 
                                        ${isActive ? 'border-blue-500 text-blue-400' : 'border-transparent hover:text-gray-300'}`}
                                >
                                    <span>{subject}</span>
                                    <div className="flex items-center gap-1 text-sm">
                                        <span className="bg-green-600 px-2 py-0.5 rounded">{stats.correct}</span>
                                        <span className="bg-red-600 px-2 py-0.5 rounded">{stats.incorrect}</span>
                                        <span className="bg-gray-700 px-2 py-0.5 rounded">{stats.total - stats.attempted}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Question navigation */}
                <div className="flex flex-wrap justify-center gap-2 mb-6 w-[80%] mx-auto max-w-[600px]">
                    {filteredQuestions.map((question, index) => {
                        const userAnswer = userAnswers[`${selectedSubject}-${index}`];
                        const isCorrect = userAnswer !== undefined && isAnswerCorrect(question, userAnswer);
                        const isWrong = userAnswer !== undefined && !isCorrect;

                        return (
                            <button
                                key={index}
                                onClick={() => navigateToQuestion(index)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center
                                    ${currentQuestion === index ? 'border-2 border-white' : ''}
                                    ${isCorrect ? 'bg-green-600' :
                                        isWrong ? 'bg-red-600' :
                                            isAnswered(index) ? 'bg-gray-600' : 'bg-gray-700'}`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                {subjectQuestion ? (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[80%] max-w-[800px] mx-auto">
                        <div className="flex justify-between mb-4">
                            <span className="bg-gray-700 px-3 py-1 rounded">{selectedSubject} - Question {currentQuestion + 1} of {filteredQuestions.length}</span>
                            <span className="bg-gray-700 px-3 py-1 rounded">Type: {subjectQuestion.type}</span>
                        </div>

                        <h2 className="text-xl md:text-2xl mb-3">{subjectQuestion.question}</h2>

                        {/* MCQ type question */}
                        {subjectQuestion.type === 'MCQ' && subjectQuestion.options && (
                            <ul className="space-y-2">
                                {subjectQuestion.options.map((option, index) => {
                                    const userAnswer = userAnswers[`${selectedSubject}-${currentQuestion}`];
                                    const isSelected = parseInt(userAnswer) === index;
                                    const isCorrectAnswer = index === subjectQuestion.correct_answer_index;

                                    let optionClass = "p-4 pl-4 rounded-md";

                                    if (isSelected && isCorrectAnswer) {
                                        optionClass += " bg-green-600"; // Correct answer
                                    } else if (isSelected && !isCorrectAnswer) {
                                        optionClass += " bg-red-600"; // Wrong answer
                                    } else if (isCorrectAnswer) {
                                        optionClass += " bg-green-600 bg-opacity-50"; // Show correct answer
                                    } else {
                                        optionClass += " bg-gray-700"; // Neither selected nor correct
                                    }

                                    return (
                                        <li key={index} className={optionClass}>
                                            {option}
                                            {isCorrectAnswer && (
                                                <span className="ml-2 font-bold">(Correct Answer)</span>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}

                        {/* Numerical type question */}
                        {subjectQuestion.type === 'Numerical' && (
                            <div className="mt-4">
                                <label className="block text-gray-300 mb-2">Your numerical answer:</label>
                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="number"
                                        className={`p-3 rounded-md flex-grow text-white ${isAnswerCorrect(subjectQuestion, userAnswers[`${selectedSubject}-${currentQuestion}`])
                                            ? 'bg-green-600'
                                            : userAnswers[`${selectedSubject}-${currentQuestion}`] !== undefined
                                                ? 'bg-red-600'
                                                : 'bg-gray-700'
                                            }`}
                                        value={userAnswers[`${selectedSubject}-${currentQuestion}`] || ""}
                                        readOnly
                                    />
                                </div>
                                <div className="p-3 bg-green-600 bg-opacity-50 rounded-md">
                                    <strong>Correct Answer:</strong> {subjectQuestion.correct_answer}
                                </div>
                            </div>
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

                {/* Back to results button */}
                <div className="w-[80%] max-w-[800px] mx-auto mt-6">
                    <button
                        onClick={() => navigate('/result')}
                        className="bg-blue-600 px-6 py-3 rounded-md w-full hover:bg-blue-700 font-bold"
                    >
                        Back to Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewQuestionPaper;