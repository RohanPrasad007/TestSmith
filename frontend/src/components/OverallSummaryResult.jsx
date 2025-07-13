import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const OverallSummaryResult = ({
  colors,
  results,
  attemptedPieData,
  resultBreakdownData,
  radarData,
  examType,
  subjectComparisonData,
  CustomTooltip,
}) => {
  const defaultScoringRule = {
    correctMCQMarks: 4,
    incorrectMCQMarks: -1,
    correctNumericalMarks: 4,
    incorrectNumericalMarks: 0,
  };
  const scoringRule = results.overall.scoringRule || defaultScoringRule;

  const colorClasses = {
    "blue-800": "border-blue-800",
    "red-500": "border-red-500",
    "green-600": "border-green-600",
  };
  return (
    <div className={`bg-${colors.highlight} p-6 rounded-lg mb-8`}>
      <h3 className="text-2xl mb-4 font-semibold text-center">
        Overall Performance
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div
          className={`border-2 p-4 rounded-lg text-center ${
            colorClasses[colors.secondary] || "border-gray-500"
          }`}
        >
          <p className="text-lg font-semibold">Total Score</p>
          <p className={`text-3xl font-bold text-${colors.primary}-400`}>
            {results.overall.totalScore}
          </p>
        </div>
        <div
          className={`border-2 p-4 rounded-lg text-center ${
            colorClasses[colors.secondary] || "border-gray-500"
          }`}
        >
          <p className="text-lg font-semibold">Maximum Marks</p>
          <p className="text-3xl font-bold">
            {results.overall.maxPossibleScore}
          </p>
        </div>
        <div
          className={`border-2 p-4 rounded-lg text-center ${
            colorClasses[colors.secondary] || "border-gray-500"
          }`}
        >
          <p className="text-lg font-semibold">Accuracy</p>
          <p className="text-3xl font-bold text-green-400">
            {results.overall.attemptedCount
              ? Math.round(
                  ((results.overall.correctMCQ +
                    results.overall.correctNumerical) /
                    results.overall.attemptedCount) *
                    100
                )
              : 0}
            %
          </p>
        </div>
        <div
          className={`border-2 p-4 rounded-lg text-center ${
            colorClasses[colors.secondary] || "border-gray-500"
          }`}
        >
          <p className="text-lg font-semibold">Percentile</p>
          <p className="text-3xl font-bold text-yellow-400">
            {Math.round(
              (results.overall.totalScore / results.overall.maxPossibleScore) *
                100
            )}
          </p>
        </div>
      </div>

      {/* Visual representation of the data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart: Attempted vs Unattempted */}
        <div
          className={`border-2 p-4 rounded-lg text-center ${
            colorClasses[colors.secondary] || "border-gray-500"
          }`}
        >
          <h4 className="text-lg font-semibold mb-2 text-center">
            Attempted vs Unattempted
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={attemptedPieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {attemptedPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Correct vs Incorrect vs Unattempted */}
        <div
          className={`border-2 p-4 rounded-lg text-center ${
            colorClasses[colors.secondary] || "border-gray-500"
          }`}
        >
          <h4 className="text-lg font-semibold mb-2 text-center">
            Result Breakdown
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={resultBreakdownData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {resultBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart: Subject Performance */}
      <div
        className={`border-2 p-4 rounded-lg text-center mb-6 ${
          colorClasses[colors.secondary] || "border-gray-500"
        }`}
      >
        <h4 className="text-lg font-semibold mb-2 text-center">
          Subject Performance Comparison
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Performance %"
              dataKey="value"
              stroke={examType === "NEET" ? "#10B981" : "#8884d8"}
              fill={examType === "NEET" ? "#10B981" : "#8884d8"}
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart: Subject Score Comparison */}
      <div
        className={`border-2 p-4 rounded-lg text-center ${
          colorClasses[colors.secondary] || "border-gray-500"
        }`}
      >
        <h4 className="text-lg font-semibold mb-2 text-center">
          Score by Subject
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={subjectComparisonData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="score"
              name="Your Score"
              fill={examType === "NEET" ? "#3498DB" : "#3B82F6"}
            />
            <Bar dataKey="maxScore" name="Maximum Score" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div>
          <h4 className="font-semibold mb-2">Questions Summary</h4>
          <ul
            className={`space-y-1 border-2  p-3 rounded-lg ${
              colorClasses[colors.secondary] || "border-gray-500"
            }`}
          >
            <li className="flex justify-between">
              <span>Total Questions:</span>
              <span>{results.overall.totalQuestions}</span>
            </li>
            <li className="flex justify-between">
              <span>Attempted:</span>
              <span>{results.overall.attemptedCount}</span>
            </li>
            <li className="flex justify-between">
              <span>Unattempted:</span>
              <span>{results.overall.unattemptedCount}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Marks Summary</h4>
          <ul
            className={`space-y-1 border-2  p-3 rounded-lg ${
              colorClasses[colors.secondary] || "border-gray-500"
            }`}
          >
            <li className="flex justify-between">
              <span>Correct Answers:</span>
              <span className="text-green-400">
                {results.overall.correctMCQ + results.overall.correctNumerical}
                (+
                {(results.overall.correctMCQ +
                  results.overall.correctNumerical) *
                  scoringRule.correctMCQMarks}
                )
              </span>
            </li>
            <li className="flex justify-between">
              <span>Incorrect Answers:</span>
              <span
                className={
                  scoringRule.incorrectMCQMarks < 0
                    ? "text-red-400"
                    : "text-yellow-400"
                }
              >
                {results.overall.incorrectMCQ +
                  results.overall.incorrectNumerical}
                {scoringRule.incorrectMCQMarks < 0
                  ? `(${
                      results.overall.incorrectMCQ *
                      scoringRule.incorrectMCQMarks
                    })`
                  : "(0)"}
              </span>
            </li>

            <li className="flex justify-between font-semibold">
              <span>Net Score:</span>
              <span>{results.overall.totalScore}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Exam Type Specific Information */}
      {examType === "NEET" && (
        <div className="mt-4 p-3 border-2 border-green-800 rounded-lg">
          <h4 className="font-semibold mb-2">NEET Exam Information</h4>
          <p>• Each correct answer: +4 marks</p>
          <p>• Each incorrect answer: -1 mark</p>{" "}
          {/* Updated to show negative marking */}
          <p>• Qualifying Percentile: 50% for General Category</p>
        </div>
      )}

      {examType === "JEE" && (
        <div className="mt-4 p-3 border-2 border-blue-800 rounded-lg">
          <h4 className="font-semibold mb-2">JEE Exam Information</h4>
          <p>• Each correct MCQ: +4 marks</p>
          <p>• Each incorrect MCQ: -1 mark</p>
          <p>• Each correct Numerical: +4 marks (no negative marking)</p>
        </div>
      )}
      {examType === "NIMCET" && (
        <div className="mt-4 p-3 border-2 border-blue-800 rounded-lg">
          <h4 className="font-semibold mb-2">NIMCET Exam Information</h4>
          <p>
            • <strong>Mathematics (50 questions):</strong> +12 for correct, -3
            for wrong (Total: 600 marks)
          </p>
          <p>
            •{" "}
            <strong>
              Analytical Ability & Logical Reasoning (40 questions):
            </strong>{" "}
            +6 for correct, -1.5 for wrong (Total: 240 marks)
          </p>
          <p>
            • <strong>Computer Awareness (20 questions):</strong> +6 for
            correct, -1.5 for wrong (Total: 120 marks)
          </p>
          <p>
            • <strong>General English (10 questions):</strong> +4 for correct,
            -1 for wrong (Total: 40 marks)
          </p>
          <p>
            • <strong>Total Marks:</strong> 1000
          </p>
        </div>
      )}
    </div>
  );
};

export default OverallSummaryResult;
