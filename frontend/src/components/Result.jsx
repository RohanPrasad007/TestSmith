import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { scoreDetails, selectedSubject } = location.state || {};

    // Function to handle the "Review Answers" button
    const handleReviewAnswers = () => {
        // Navigate back to the previous page
        navigate(-1);
    };

    return (
        <div>
            <div className="fixed inset-0 bg-zinc-950  flex items-center justify-center z-50 text-white">
                <div className="bg-gray-800 p-8 rounded-xl w-full max-w-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-center">JEE Test Score Report</h2>

                    <div className="bg-gray-700 p-6 rounded-lg mb-4">
                        <h3 className="text-xl mb-4 font-semibold text-center">Subject: {selectedSubject}</h3>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-gray-600 p-4 rounded-lg">
                                <p className="text-lg font-semibold">Total Score</p>
                                <p className="text-3xl font-bold text-blue-400">{scoreDetails?.totalScore}</p>
                            </div>
                            <div className="bg-gray-600 p-4 rounded-lg">
                                <p className="text-lg font-semibold">Maximum Marks</p>
                                <p className="text-3xl font-bold">{scoreDetails?.totalQuestions * 4}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Questions Breakdown</h4>
                                <ul className="space-y-1">
                                    <li className="flex justify-between">
                                        <span>Total Questions:</span>
                                        <span>{scoreDetails?.totalQuestions}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Attempted:</span>
                                        <span>{scoreDetails?.attemptedCount}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Unattempted:</span>
                                        <span>{scoreDetails?.unattemptedCount}</span>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Marks Breakdown</h4>
                                <ul className="space-y-1">
                                    <li className="flex justify-between">
                                        <span>Correct MCQs:</span>
                                        <span className="text-green-400">{scoreDetails?.correctMCQ} (+{scoreDetails?.correctMCQ * 4})</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Incorrect MCQs:</span>
                                        <span className="text-red-400">{scoreDetails?.incorrectMCQ} (-{scoreDetails?.incorrectMCQ})</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">

                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Result