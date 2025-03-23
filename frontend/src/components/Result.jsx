import React from 'react';
import { useExam } from '../context/ExamContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import OverallSummaryResult from './OverallSummaryResult';
import SubjectWiseResult from './SubjectWiseResult';

const Result = () => {
    const { subjects, questions, userAnswers, examType } = useExam();
    const navigate = useNavigate();

    // Calculate comprehensive results for all subjects
    const calculateResults = () => {
        const subjectResults = {};
        let overallTotalScore = 0;
        let overallTotalQuestions = 0;
        let overallAttempted = 0;
        let overallCorrectMCQ = 0;
        let overallIncorrectMCQ = 0;
        let overallCorrectNumerical = 0;
        let overallIncorrectNumerical = 0;

        // Define scoring rules based on exam type
        const scoringRules = {
            JEE: {
                correctMCQMarks: 4,
                incorrectMCQMarks: -1,
                correctNumericalMarks: 4,
                incorrectNumericalMarks: 0 // JEE doesn't penalize for incorrect numerical answers
            },
            NEET: {
                correctMCQMarks: 4,
                incorrectMCQMarks: -1, // Fixed: Changed from 0 to -1 for NEET negative marking
                correctNumericalMarks: 4,
                incorrectNumericalMarks: 0 // NEET typically doesn't have numerical questions
            }
        };

        // Use the scoring rule based on the exam type
        const scoringRule = scoringRules[examType] || scoringRules.JEE;

        subjects.forEach(subject => {
            const subjectQuestions = questions.filter(q => q.subject === subject);

            let correctMCQ = 0;
            let incorrectMCQ = 0;
            let correctNumerical = 0;
            let incorrectNumerical = 0;
            let attemptedCount = 0;

            subjectQuestions.forEach((question, index) => {
                const userAnswer = userAnswers[`${subject}-${index}`];

                if (userAnswer !== undefined) {
                    attemptedCount++;

                    if (question.type === 'MCQ') {
                        if (parseInt(userAnswer) === question.correct_answer_index) {
                            correctMCQ++;
                        } else {
                            incorrectMCQ++;
                        }
                    } else if (question.type === 'Numerical') {
                        if (parseFloat(userAnswer) === parseFloat(question.correct_answer)) {
                            correctNumerical++;
                        } else {
                            incorrectNumerical++;
                        }
                    }
                }
            });

            // Calculate total score based on exam type scoring rules
            const totalScore =
                (correctMCQ * scoringRule.correctMCQMarks) +
                (incorrectMCQ * scoringRule.incorrectMCQMarks) +
                (correctNumerical * scoringRule.correctNumericalMarks) +
                (incorrectNumerical * scoringRule.incorrectNumericalMarks);

            // Calculate maximum possible score
            const maxPossibleScore = subjectQuestions.length * scoringRule.correctMCQMarks;

            subjectResults[subject] = {
                totalQuestions: subjectQuestions.length,
                attemptedCount,
                unattemptedCount: subjectQuestions.length - attemptedCount,
                correctMCQ,
                incorrectMCQ,
                correctNumerical,
                incorrectNumerical,
                totalScore,
                maxPossibleScore
            };

            // Add to overall totals
            overallTotalScore += totalScore;
            overallTotalQuestions += subjectQuestions.length;
            overallAttempted += attemptedCount;
            overallCorrectMCQ += correctMCQ;
            overallIncorrectMCQ += incorrectMCQ;
            overallCorrectNumerical += correctNumerical;
            overallIncorrectNumerical += incorrectNumerical;
        });

        return {
            subjectResults,
            overall: {
                totalQuestions: overallTotalQuestions,
                attemptedCount: overallAttempted,
                unattemptedCount: overallTotalQuestions - overallAttempted,
                correctMCQ: overallCorrectMCQ,
                incorrectMCQ: overallIncorrectMCQ,
                correctNumerical: overallCorrectNumerical,
                incorrectNumerical: overallIncorrectNumerical,
                totalScore: overallTotalScore,
                maxPossibleScore: overallTotalQuestions * scoringRule.correctMCQMarks,
                scoringRule // Include scoring rule for reference
            }
        };
    };

    const results = calculateResults();

    // Prepare data for pie chart
    const attemptedPieData = [
        { name: 'Attempted', value: results.overall.attemptedCount, color: '#3B82F6' },
        { name: 'Unattempted', value: results.overall.unattemptedCount, color: '#6B7280' }
    ];

    // Prepare data for result breakdown pie chart - now including incorrectNumerical
    const resultBreakdownData = [
        { name: 'Correct', value: results.overall.correctMCQ + results.overall.correctNumerical, color: '#10B981' },
        { name: 'Incorrect', value: results.overall.incorrectMCQ + results.overall.incorrectNumerical, color: '#EF4444' },
        { name: 'Unattempted', value: results.overall.unattemptedCount, color: '#6B7280' }
    ];

    // Prepare data for subject comparison bar chart
    const subjectComparisonData = subjects.map(subject => {
        const result = results.subjectResults[subject];
        return {
            subject,
            score: result.totalScore,
            maxScore: result.maxPossibleScore,
            percentage: Math.round((result.totalScore / result.maxPossibleScore) * 100)
        };
    });

    // Prepare data for radar chart - subject performance
    const radarData = subjects.map(subject => {
        const result = results.subjectResults[subject];
        // Calculate percentage score (accounting for negative scores)
        const percentage = Math.max(0, Math.round((result.totalScore / result.maxPossibleScore) * 100));
        return {
            subject,
            value: percentage
        };
    });

    // Custom tooltip for bar chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 p-3 rounded-md shadow-lg border border-gray-700">
                    <p className="font-bold">{label}</p>
                    <p className="text-blue-400">Score: {payload[0].value}</p>
                    <p className="text-green-400">Max Possible: {payload[1].value}</p>
                    <p className="font-bold text-yellow-400">
                        Percentage: {Math.round((payload[0].value / payload[1].value) * 100)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    // Get exam specific colors
    const examColors = {
        JEE: {
            primary: 'blue',
            secondary: 'blue-800',
            highlight: 'blue-900'
        },
        NEET: {
            primary: 'green',
            secondary: 'green-800',
            highlight: 'green-900'
        }
    };

    const colors = examColors[examType] || examColors.JEE;

    return (
        <div className='h-screen w-full bg-gradient-to-br from-[#0A0A0B] via-[#110D1A] to-[#090015] overflow-x-hidden relative'>
            {/* Background glow circle - with negative z-index to ensure it stays behind content */}
            <div className="w-[800px] h-[700px] absolute right-[12%] top-[-20%] rounded-full 
            bg-[#441d85] bg-opacity-70
            shadow-[0_0_800px_10px_rgba(122,47,249,0.8)] 
            backdrop-blur-md border-none outline-none blur-[300px] z-0" />

            {/* Content wrapper - with positive z-index to appear above the background glow */}
            <div className="min-h-screen  bg-opacity-70 text-white py-12 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="bg-gray-800/50 p-8 rounded-xl w-full max-w-7xl mx-auto mb-8 shadow-lg">
                        <h2 className="text-3xl font-bold mb-6 text-center">
                            {examType === 'NEET' ? 'NEET Mock Test Results' : 'JEE Mock Test Results'}
                        </h2>

                        {/* Check Rank Button */}
                        <div className="flex justify-center mb-6">
                            <button
                                onClick={() => navigate('/rank')}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-5 px-10 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
                            >
                                CHECK YOUR RANK
                            </button>
                        </div>

                        {/* Overall Summary */}
                        <OverallSummaryResult
                            colors={colors}
                            results={results}
                            attemptedPieData={attemptedPieData}
                            resultBreakdownData={resultBreakdownData}
                            radarData={radarData}
                            examType={examType}
                            subjectComparisonData={subjectComparisonData}
                            CustomTooltip={CustomTooltip}
                        />

                        {/* Subject-wise Results */}
                        <h3 className="text-xl font-semibold mb-4">Subject-wise Performance</h3>
                        <SubjectWiseResult subjects={subjects} results={results} colors={colors} />

                        <div className="flex gap-4 justify-center mt-8">
                            <button
                                onClick={() => navigate('/review')}
                                className="bg-gray-600/40 px-10 py-4 rounded-md hover:bg-gray-500 transition "
                            >
                                Review Answers
                            </button>
                            <button
                                onClick={() => navigate('/start-mock-test')}
                                className="border-2 border-blue-600 px-10 py-4 rounded-md  transition"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Result;  