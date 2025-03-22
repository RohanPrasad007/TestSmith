import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SubjectWiseResult = ({ colors, subjects, results }) => {
    return (
        <div className="space-y-6">
            {subjects.map(subject => {
                const subjectResult = results.subjectResults[subject];
                const subjectPieData = [
                    { name: 'Correct', value: subjectResult.correctMCQ + subjectResult.correctNumerical, color: '#10B981' },
                    { name: 'Incorrect', value: subjectResult.incorrectMCQ + subjectResult.incorrectNumerical, color: '#EF4444' },
                    { name: 'Unattempted', value: subjectResult.unattemptedCount, color: '#6B7280' }
                ];

                return (
                    <div key={subject} className="bg-gray-700 p-5 rounded-lg">
                        <h4 className="text-lg mb-3 font-semibold">{subject}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="bg-gray-600 p-3 rounded-lg grid grid-cols-3 gap-2">
                                <div>
                                    <p className="font-semibold">Score</p>
                                    <p className={`text-xl font-bold text-${colors.primary}-400`}>{subjectResult.totalScore}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Attempted</p>
                                    <p className="text-xl font-bold">
                                        {subjectResult.attemptedCount}/{subjectResult.totalQuestions}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Accuracy</p>
                                    <p className="text-xl font-bold text-green-400">
                                        {subjectResult.attemptedCount ?
                                            Math.round(((subjectResult.correctMCQ + subjectResult.correctNumerical) /
                                                subjectResult.attemptedCount) * 100) : 0}%
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-600 p-3 rounded-lg">
                                <ResponsiveContainer width="100%" height={150}>
                                    <PieChart>
                                        <Pie
                                            data={subjectPieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={60}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {subjectPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-gray-600 p-3 rounded-lg text-sm">
                            <div className="grid grid-cols-3 font-semibold border-b border-gray-500 pb-1 mb-1">
                                <span>Correct</span>
                                <span>Incorrect</span>
                                <span>Unattempted</span>
                            </div>
                            <div className="grid grid-cols-3">
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