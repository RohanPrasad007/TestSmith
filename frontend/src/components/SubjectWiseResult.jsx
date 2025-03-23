import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SubjectWiseResult = ({ colors, subjects, results }) => {
    return (

        <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
            {subjects.map(subject => {
                const subjectResult = results.subjectResults[subject];
                const subjectPieData = [
                    { name: 'Correct', value: subjectResult.correctMCQ + subjectResult.correctNumerical, color: '#10B981' },
                    { name: 'Incorrect', value: subjectResult.incorrectMCQ + subjectResult.incorrectNumerical, color: '#EF4444' },
                    { name: 'Unattempted', value: subjectResult.unattemptedCount, color: '#6B7280' }
                ];

                return (
                    <div key={subject} className="bg-gray-700/40 p-3 sm:p-4 md:p-5 rounded-lg">
                        <h4 className="text-base sm:text-lg mb-2 sm:mb-3 font-semibold">{subject}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3">
                            {/* Score, Attempted, and Accuracy Card */}
                            <div className="bg-gray-600 p-2 sm:p-3 rounded-lg">
                                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm font-semibold">Score</p>
                                        <p className={`text-base sm:text-xl font-bold text-${colors.primary}-400`}>
                                            {subjectResult.totalScore}
                                        </p>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm font-semibold">Attempted</p>
                                        <p className="text-base sm:text-xl font-bold">
                                            {subjectResult.attemptedCount}/{subjectResult.totalQuestions}
                                        </p>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-xs sm:text-sm font-semibold">Accuracy</p>
                                        <p className="text-base sm:text-xl font-bold text-green-400">
                                            {subjectResult.attemptedCount ?
                                                Math.round(((subjectResult.correctMCQ + subjectResult.correctNumerical) /
                                                    subjectResult.attemptedCount) * 100) : 0}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pie Chart Card - Adjust height for mobile */}
                            <div className="bg-gray-600 p-2 sm:p-3 rounded-lg">
                                <ResponsiveContainer width="100%" height={200} className="mx-auto" style={{ maxWidth: '300px' }}>
                                    <PieChart>
                                        <Pie
                                            data={subjectPieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={40}
                                            innerRadius={0}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {subjectPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Summary Grid - Full Width */}
                        <div className="bg-gray-600 p-2 sm:p-3 rounded-lg text-xs sm:text-sm">
                            <div className="grid grid-cols-3 font-semibold border-b border-gray-500 pb-1 mb-1 text-center sm:text-left">
                                <span>Correct</span>
                                <span>Incorrect</span>
                                <span>Unattempted</span>
                            </div>
                            <div className="grid grid-cols-3 text-center sm:text-left">
                                <span className="text-green-400">
                                    {subjectResult.correctMCQ + subjectResult.correctNumerical}
                                </span>
                                <span className="text-red-400">
                                    {subjectResult.incorrectMCQ + subjectResult.incorrectNumerical}
                                </span>
                                <span>
                                    {subjectResult.unattemptedCount}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default SubjectWiseResult