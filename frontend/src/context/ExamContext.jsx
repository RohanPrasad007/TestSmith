import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { showToast } from '../utils/toast';

// Create context
const ExamContext = createContext();

// Custom hook to use the exam context
export const useExam = () => {
    const context = useContext(ExamContext);
    if (!context) {
        throw new Error('useExam must be used within an ExamProvider');
    }
    return context;
};

// Provider component
export const ExamProvider = ({ children }) => {
    // Exam state
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 hours in seconds
    const [examCompleted, setExamCompleted] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [numericalAnswer, setNumericalAnswer] = useState('');
    const [showScoreModal, setShowScoreModal] = useState(false);
    const [examType, setExamType] = useState(""); // Add examType state
    const [scoreDetails, setScoreDetails] = useState({
        totalScore: 0,
        correctMCQ: 0,
        incorrectMCQ: 0,
        correctNumerical: 0,
        unattemptedCount: 0,
        attemptedCount: 0,
        totalQuestions: 0
    });

    const questionPaperRef = useRef(null);

    // Initialize questions and set up subject
    useEffect(() => {
        if (questions.length > 0) {
            // Extract unique subjects from questions
            const extractedSubjects = [...new Set(questions.map(q => q.subject))];
            setSubjects(extractedSubjects);

            // Default to the first subject
            if (extractedSubjects.length > 0 && !selectedSubject) {
                setSelectedSubject(extractedSubjects[0]);
            }
        }
    }, [questions, selectedSubject]);

    // Filter questions based on selected subject
    useEffect(() => {
        if (selectedSubject) {
            setFilteredQuestions(questions.filter(q => q.subject === selectedSubject));
            setCurrentQuestion(0); // Reset to first question of selected subject
        }
    }, [selectedSubject, questions]);

    // Timer logic
    useEffect(() => {
        if (questions.length > 0 && !examCompleted) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        // Auto-submit the test when time is up
                        setExamCompleted(true);
                        submitTest();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [questions, examCompleted]);

    // Format time
    const formatTime = () => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        return { hours, minutes, seconds };
    };

    // Handle MCQ option selection
    const handleOptionSelect = (optionIndex) => {
        // Store the selected answer
        const newUserAnswers = {
            ...userAnswers,
            [`${selectedSubject}-${currentQuestion}`]: optionIndex
        };

        setUserAnswers(newUserAnswers);

        // Check if this is the last question in the section
        if (currentQuestion === filteredQuestions.length - 1) {
            // Check if all questions in this subject are now answered
            let allAnswered = true;
            for (let i = 0; i < filteredQuestions.length; i++) {
                if (newUserAnswers[`${selectedSubject}-${i}`] === undefined) {
                    allAnswered = false;
                    break;
                }
            }

            if (allAnswered) {
                // All questions are answered, move to the next subject
                handleSubjectComplete(selectedSubject);
            }
        } else {
            // Move to next question in current subject
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 300);
        }
    };

    // Handle numerical answer submission
    const handleNumericalSubmit = (e) => {
        if (e) e.preventDefault();

        // Store the numerical answer
        const newUserAnswers = {
            ...userAnswers,
            [`${selectedSubject}-${currentQuestion}`]: numericalAnswer
        };

        setUserAnswers(newUserAnswers);

        // Check if this is the last question in the section
        if (currentQuestion === filteredQuestions.length - 1) {
            // Check if all questions in this subject are now answered
            let allAnswered = true;
            for (let i = 0; i < filteredQuestions.length; i++) {
                if (newUserAnswers[`${selectedSubject}-${i}`] === undefined) {
                    allAnswered = false;
                    break;
                }
            }

            if (allAnswered) {
                // All questions are answered, move to the next subject
                handleSubjectComplete(selectedSubject);
            }
        } else {
            // Move to next question
            setCurrentQuestion(currentQuestion + 1);
            setNumericalAnswer(''); // Reset input for next question
        }
    };

    // Handle subject completion
    const handleSubjectComplete = (completedSubject) => {
        const currentSubjectIndex = subjects.indexOf(completedSubject);

        // If there are more subjects, move to the next one
        if (currentSubjectIndex < subjects.length - 1) {
            const nextSubject = subjects[currentSubjectIndex + 1];
            setSelectedSubject(nextSubject);
        } else {
            // If it's the last subject, show a message
            showToast.success("Congratulations! You've completed all subjects. You can now review your answers or submit the test.");
        }
    };

    // Change subject
    const handleSubjectChange = (newSubject, position) => {
        setSelectedSubject(newSubject);

        // If specific position is requested (first or last question), set it after filtering
        if (position) {
            const newFilteredQuestions = questions.filter(q => q.subject === newSubject);
            if (position === 'last') {
                // Set to the last question index
                setTimeout(() => {
                    setCurrentQuestion(newFilteredQuestions.length - 1);
                }, 0);
            } else {
                // Set to the first question (index 0)
                setCurrentQuestion(0);
            }
        }
    };

    // Navigate to specific question
    const navigateToQuestion = (index) => {
        setCurrentQuestion(index);
    };

    // Check if question is answered
    const isAnswered = (index) => {
        return userAnswers[`${selectedSubject}-${index}`] !== undefined;
    };

    // Check if all questions are answered
    const allQuestionsAnswered = () => {
        for (let i = 0; i < filteredQuestions.length; i++) {
            if (!isAnswered(i)) {
                return false;
            }
        }
        return true;
    };

    // Previous question navigation
    const handlePrevious = () => {
        if (currentQuestion > 0) {
            // If not at the first question of current subject, just go to previous question
            setCurrentQuestion(currentQuestion - 1);
        } else {
            // At first question, check if there's a previous subject
            const currentSubjectIndex = subjects.indexOf(selectedSubject);
            if (currentSubjectIndex > 0) {
                // There is a previous subject
                const prevSubject = subjects[currentSubjectIndex - 1];
                handleSubjectChange(prevSubject, 'last'); // Special flag to go to last question
            }
        }
    };

    // Next question navigation
    const handleNext = () => {
        if (currentQuestion < filteredQuestions.length - 1) {
            // If not at the last question of current subject, just go to next question
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // At last question, check if there's a next subject
            const currentSubjectIndex = subjects.indexOf(selectedSubject);
            if (currentSubjectIndex < subjects.length - 1) {
                // There is a next subject
                const nextSubject = subjects[currentSubjectIndex + 1];
                handleSubjectChange(nextSubject, 'first'); // Navigate to first question of next subject
            }
        }
    };

    // Calculate score based on user answers
    const calculateScore = () => {
        let totalScore = 0;
        let correctMCQ = 0;
        let incorrectMCQ = 0;
        let correctNumerical = 0;
        let attemptedCount = 0;

        filteredQuestions.forEach((q, index) => {
            const userAnswer = userAnswers[`${selectedSubject}-${index}`];

            if (userAnswer !== undefined) {
                attemptedCount++;

                if (q.type === 'MCQ') {
                    // Convert user answer to number for comparison with correct_answer_index
                    const userAnswerIndex = parseInt(userAnswer);
                    if (userAnswerIndex === q.correct_answer_index) {
                        totalScore += 4;
                        correctMCQ++;
                    } else {
                        totalScore -= 1; // Negative marking for MCQs
                        incorrectMCQ++;
                    }
                } else if (q.type === 'Numerical') {
                    // For Numerical, we need to compare numerical values with a tolerance
                    const userNumAnswer = parseFloat(userAnswer);
                    const correctNumAnswer = parseFloat(q.correct_answer);

                    // Using a small tolerance for floating-point comparison
                    if (Math.abs(userNumAnswer - correctNumAnswer) < 0.001) {
                        totalScore += 4;
                        correctNumerical++;
                    }
                    // No negative marking for Numerical
                }
            }
        });

        const unattemptedCount = filteredQuestions.length - attemptedCount;

        const scoreInfo = {
            totalScore,
            correctMCQ,
            incorrectMCQ,
            correctNumerical,
            attemptedCount,
            unattemptedCount,
            totalQuestions: filteredQuestions.length
        };

        setScoreDetails(scoreInfo);
        return scoreInfo;
    };

    // Submit test
    const submitTest = () => {
        calculateScore();
        setExamCompleted(true);
        setShowScoreModal(true);
    };

    // Value to be provided by the context
    const value = {
        // State
        questions,
        filteredQuestions,
        currentQuestion,
        selectedSubject,
        userAnswers,
        timeLeft,
        examCompleted,
        subjects,
        numericalAnswer,
        showScoreModal,
        scoreDetails,
        examType, // Add examType to the context value

        // Setters
        setQuestions,
        setCurrentQuestion,
        setSelectedSubject,
        setNumericalAnswer,
        setShowScoreModal,
        setExamType, // Add setExamType to the context value

        // Functions
        formatTime,
        handleOptionSelect,
        handleNumericalSubmit,
        handleSubjectComplete,
        handleSubjectChange,
        navigateToQuestion,
        isAnswered,
        allQuestionsAnswered,
        handlePrevious,
        handleNext,
        calculateScore,
        submitTest
    };

    return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};