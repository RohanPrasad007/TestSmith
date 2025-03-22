import React from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

const ScoreDistributionChart = ({ distributionData, CustomTooltip, examType, rankDetails }) => {
    return (
        <div className="bg-gray-700 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">
                Score vs Rank Distribution
            </h3>
            <p className="text-gray-400 mb-4">
                See how your score compares to other candidates
            </p>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={distributionData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis
                            dataKey="score"
                            label={{
                                value: "Score",
                                position: "insideBottomRight",
                                offset: -10,
                            }}
                        />
                        <YAxis
                            label={{
                                value: "Rank",
                                angle: -90,
                                position: "insideLeft",
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="rank"
                            stroke={examType === "NEET" ? "#10B981" : "#8884d8"}
                            fill={examType === "NEET" ? "#10B981" : "#8884d8"}
                            fillOpacity={0.3}
                            activeDot={{ r: 8 }}
                        />
                        {/* Marker for user score */}
                        <Line
                            type="monotone"
                            data={[
                                { score: rankDetails.score, rank: 0 },
                                {
                                    score: rankDetails.score,
                                    rank: Math.max(...distributionData.map((d) => d.rank)),
                                },
                            ]}
                            dataKey="rank"
                            stroke="#ff0000"
                            strokeWidth={2}
                            dot={false}
                            activeDot={false}
                            label="Your Score"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default ScoreDistributionChart