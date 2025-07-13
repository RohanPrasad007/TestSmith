import React, { useState, useEffect } from "react";
import { useExam } from "../context/ExamContext";
import { useNavigate } from "react-router-dom";
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

const Rank = () => {
  const { questions, userAnswers, subjects, examType } = useExam();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rankDetails, setRankDetails] = useState({
    score: 0,
    totalApplicants:
      examType === "JEE" ? 1500000 : examType === "NEET" ? 1650000 : 50000,
    rank: 0,
    category: "",
    qualifiedForAdvanced: false,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  // Marks to Rank Mapping - JEE
  const jeeMarksToRankMapping = {
    300: 1,
    290: 15,
    280: 36,
    270: 428,
    260: 1189,
    250: 2720,
    240: 3803,
    230: 5320,
    220: 7354,
    210: 9968,
    200: 13163,
    190: 17290,
    180: 22533,
    170: 29145,
    160: 37440,
    150: 47979,
    140: 61651,
    130: 79298,
    120: 102421,
    110: 135695,
    100: 183105,
    90: 260722,
    80: 380928,
    70: 568308,
    60: 844157,
    50: 1118638,
    40: 1321716,
    30: 1400000,
    20: 1450000,
    10: 1490000,
    0: 1500000,
  };

  // Marks to Rank Mapping - NEET
  const neetMarksToRankMapping = {
    720: 1,
    700: 10,
    680: 50,
    660: 140,
    640: 350,
    620: 780,
    600: 1500,
    580: 2900,
    560: 5100,
    540: 9000,
    520: 14500,
    500: 23000,
    480: 35000,
    460: 50000,
    440: 72000,
    420: 99000,
    400: 135000,
    380: 176000,
    360: 230000,
    340: 290000,
    320: 360000,
    300: 440000,
    280: 530000,
    260: 630000,
    240: 740000,
    220: 860000,
    200: 980000,
    180: 1100000,
    160: 1220000,
    140: 1340000,
    120: 1420000,
    100: 1480000,
    80: 1530000,
    60: 1570000,
    40: 1600000,
    20: 1620000,
    0: 1650000,
  };

  // Marks to Rank Mapping - NIMCET
  const nimcetMarksToRankMapping = {
    1000: 1,
    950: 10,
    900: 50,
    850: 150,
    800: 300,
    750: 600,
    700: 1000,
    650: 2000,
    600: 3500,
    550: 6000,
    500: 9000,
    450: 13000,
    400: 18000,
    350: 24000,
    300: 31000,
    250: 39000,
    200: 47000,
    150: 50000,
    100: 52000,
    50: 54000,
    0: 55000,
  };

  // College Eligibility Based on Marks
  const getTopInstitutes = (score) => {
    // JEE Institutes (same as before)
    const jeeInstitutes = [
      // ... (existing JEE institutes array)
    ];

    // NEET Institutes (same as before)
    const neetInstitutes = [
      // ... (existing NEET institutes array)
    ];

    // NIMCET Institutes
    const nimcetInstitutes = [
      {
        name: "NIT Warangal",
        minMarks: 900,
        programs: ["MCA", "Computer Applications"],
      },
      {
        name: "NIT Trichy",
        minMarks: 850,
        programs: ["MCA", "Information Technology"],
      },
      {
        name: "NIT Surathkal",
        minMarks: 800,
        programs: ["MCA", "Data Science"],
      },
      {
        name: "NIT Calicut",
        minMarks: 750,
        programs: ["MCA", "Software Engineering"],
      },
      {
        name: "NIT Allahabad",
        minMarks: 700,
        programs: ["MCA", "Computer Applications"],
      },
      {
        name: "NIT Bhopal",
        minMarks: 650,
        programs: ["MCA", "Information Technology"],
      },
      {
        name: "NIT Durgapur",
        minMarks: 600,
        programs: ["MCA", "Data Science"],
      },
      {
        name: "NIT Jamshedpur",
        minMarks: 550,
        programs: ["MCA", "Software Engineering"],
      },
      {
        name: "NIT Kurukshetra",
        minMarks: 500,
        programs: ["MCA", "Computer Applications"],
      },
      {
        name: "NIT Raipur",
        minMarks: 450,
        programs: ["MCA", "Information Technology"],
      },
      {
        name: "NIT Silchar",
        minMarks: 400,
        programs: ["MCA", "Data Science"],
      },
      {
        name: "NIT Hamirpur",
        minMarks: 350,
        programs: ["MCA", "Software Engineering"],
      },
      {
        name: "NIT Patna",
        minMarks: 300,
        programs: ["MCA", "Computer Applications"],
      },
      {
        name: "NIT Meghalaya",
        minMarks: 250,
        programs: ["MCA", "Information Technology"],
      },
      {
        name: "NIT Nagaland",
        minMarks: 200,
        programs: ["MCA", "Data Science"],
      },
      {
        name: "NIT Manipur",
        minMarks: 150,
        programs: ["MCA", "Software Engineering"],
      },
      {
        name: "NIT Mizoram",
        minMarks: 100,
        programs: ["MCA", "Computer Applications"],
      },
      {
        name: "NIT Sikkim",
        minMarks: 50,
        programs: ["MCA", "Information Technology"],
      },
    ];

    // Return institutes based on exam type
    switch (examType) {
      case "NEET":
        return neetInstitutes.filter(
          (institute) => institute.minMarks <= score
        );
      case "NIMCET":
        return nimcetInstitutes.filter(
          (institute) => institute.minMarks <= score
        );
      default:
        return jeeInstitutes.filter((institute) => institute.minMarks <= score);
    }
  };

  // Calculate user's score with NIMCET specific scoring
  const calculateUserScore = () => {
    let totalScore = 0;
    let correctMCQ = 0;
    let incorrectMCQ = 0;
    let correctNumerical = 0;

    subjects.forEach((subject) => {
      const subjectQuestions = questions.filter((q) => q.subject === subject);

      // Get scoring rules for NIMCET subjects
      const getScoringRules = (subject) => {
        if (examType === "NIMCET") {
          const nimcetScoring = {
            Mathematics: { correct: 12, incorrect: -3 },
            "Analytical Ability & Logical Reasoning": {
              correct: 6,
              incorrect: -1.5,
            },
            "Computer Awareness": { correct: 6, incorrect: -1.5 },
            "General English": { correct: 4, incorrect: -1 },
          };
          return nimcetScoring[subject] || { correct: 4, incorrect: -1 };
        } else {
          return { correct: 4, incorrect: -1 };
        }
      };

      const scoringRule =
        examType === "NIMCET"
          ? getScoringRules(subject)
          : { correct: 4, incorrect: -1 };

      subjectQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[`${subject}-${index}`];

        if (userAnswer !== undefined) {
          if (question.type === "MCQ") {
            const userAnswerIndex = parseInt(userAnswer);
            if (userAnswerIndex === question.correct_answer_index) {
              totalScore += scoringRule.correct;
              correctMCQ++;
            } else {
              totalScore += scoringRule.incorrect;
              incorrectMCQ++;
            }
          } else if (question.type === "Numerical") {
            const userNumAnswer = parseFloat(userAnswer);
            const correctNumAnswer = parseFloat(question.correct_answer);

            if (Math.abs(userNumAnswer - correctNumAnswer) < 0.001) {
              totalScore += scoringRule.correct;
              correctNumerical++;
            }
          }
        }
      });
    });

    return totalScore;
  };

  // Calculate rank based on marks
  const calculateRank = (score) => {
    // Use the appropriate mapping based on exam type
    const marksToRankMapping =
      examType === "NEET"
        ? neetMarksToRankMapping
        : examType === "NIMCET"
        ? nimcetMarksToRankMapping
        : jeeMarksToRankMapping;

    // Find the closest marks in the mapping
    let closestMarks = Object.keys(marksToRankMapping).reduce((prev, curr) => {
      return Math.abs(curr - score) < Math.abs(prev - score) ? curr : prev;
    });

    // Get the rank based on the closest marks
    const rank = marksToRankMapping[closestMarks];

    // Determine category based on rank
    let category = "";
    let qualifiedForAdvanced = false;

    if (examType === "NIMCET") {
      // NIMCET specific categories
      if (rank <= 100) {
        category = "Outstanding - Top 0.2%";
        qualifiedForAdvanced = true;
      } else if (rank <= 500) {
        category = "Excellent - Top 1%";
        qualifiedForAdvanced = true;
      } else if (rank <= 2000) {
        category = "Very Good - Top 4%";
        qualifiedForAdvanced = true;
      } else if (rank <= 5000) {
        category = "Good - Top 10%";
        qualifiedForAdvanced = true;
      } else if (rank <= 10000) {
        category = "Above Average - Top 20%";
        qualifiedForAdvanced = true;
      } else if (rank <= 20000) {
        category = "Average";
        qualifiedForAdvanced = true;
      } else {
        category = "Below Average";
        qualifiedForAdvanced = false;
      }
    } else {
      // JEE/NEET categories (existing logic)
      if (rank <= 1000) {
        category = "Outstanding - Top 0.1%";
        qualifiedForAdvanced = true;
      } else if (rank <= 10000) {
        category = "Excellent - Top 1%";
        qualifiedForAdvanced = true;
      } else if (rank <= 50000) {
        category = "Very Good - Top 5%";
        qualifiedForAdvanced = true;
      } else if (rank <= 100000) {
        category = "Good - Top 10%";
        qualifiedForAdvanced = true;
      } else if (rank <= 200000) {
        category = "Above Average - Top 20%";
        qualifiedForAdvanced = true;
      } else if (rank <= 500000) {
        category = "Average";
        qualifiedForAdvanced = true;
      } else {
        category = "Below Average";
        qualifiedForAdvanced = false;
      }
    }

    return {
      rank,
      category,
      qualifiedForAdvanced,
    };
  };

  // Generate distribution data for the score distribution chart
  const generateDistributionData = (userScore) => {
    const marksToRankMapping =
      examType === "NEET"
        ? neetMarksToRankMapping
        : examType === "NIMCET"
        ? nimcetMarksToRankMapping
        : jeeMarksToRankMapping;

    const data = Object.keys(marksToRankMapping).map((marks) => ({
      score: parseInt(marks),
      rank: marksToRankMapping[marks],
      isUserScore: userScore >= marks - 5 && userScore <= marks + 5,
    }));

    return data;
  };

  useEffect(() => {
    setTimeout(() => {
      const userScore = calculateUserScore();
      const rankInfo = calculateRank(userScore);

      setRankDetails({
        score: userScore,
        totalApplicants:
          examType === "JEE" ? 1500000 : examType === "NEET" ? 1650000 : 55000, // NIMCET applicants
        rank: rankInfo.rank,
        category: rankInfo.category,
        qualifiedForAdvanced: rankInfo.qualifiedForAdvanced,
      });

      setLoading(false);

      if (rankInfo.rank <= (examType === "NIMCET" ? 500 : 10000)) {
        setShowConfetti(true);
      }
    }, 2000);
  }, []);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-md shadow-lg border border-gray-700">
          <p className="font-bold">Score: {label}</p>
          <p className="text-blue-400">Rank: {payload[0].payload.rank}</p>
          {payload[0].payload.isUserScore && (
            <p className="text-yellow-400 font-bold">Your Score Range!</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold">
          Calculating Your {examType} Rank...
        </h2>
        <p className="text-gray-400 mt-2">
          Analyzing data from{" "}
          {rankDetails.totalApplicants.toLocaleString("en-IN")} candidates
        </p>
      </div>
    );
  }

  // Get distribution data for the chart
  const distributionData = generateDistributionData(rankDetails.score);

  // Get eligible institutes based on marks
  const eligibleInstitutes = getTopInstitutes(rankDetails.score);

  // Get exam title
  const getExamTitle = () => {
    switch (examType) {
      case "NEET":
        return "NEET";
      case "NIMCET":
        return "NIMCET";
      default:
        return "JEE Main";
    }
  };

  // Get qualification message
  const getQualificationMessage = () => {
    if (examType === "NIMCET") {
      return rankDetails.qualifiedForAdvanced
        ? "Congratulations! You've qualified for NIMCET Counselling!"
        : "You'll need to improve to qualify for NIMCET Counselling next time.";
    } else {
      return rankDetails.qualifiedForAdvanced
        ? `Congratulations! You've qualified for ${
            examType === "NEET" ? "NEET Counselling" : "JEE Advanced"
          }!`
        : `You'll need to improve to qualify for ${
            examType === "NEET" ? "NEET Counselling" : "JEE Advanced"
          } next time.`;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0A0A0B] via-[#110D1A] to-[#090015] overflow-x-hidden relative">
      {/* Background glow */}
      <div
        className="w-full md:w-[60%] lg:w-[800px] h-[300px] md:h-[500px] lg:h-[700px] absolute right-0 md:right-[5%] lg:right-[12%] top-[-10%] md:top-[-15%] lg:top-[-20%] rounded-full 
        bg-[#441d85] bg-opacity-70
        shadow-[0_0_400px_10px_rgba(122,47,249,0.8)] md:shadow-[0_0_600px_10px_rgba(122,47,249,0.8)] lg:shadow-[0_0_800px_10px_rgba(122,47,249,0.8)]
        backdrop-blur-md border-none outline-none blur-[150px] md:blur-[200px] lg:blur-[300px] z-0"
      />

      <div className="min-h-screen bg-opacity-70 text-white py-6 md:py-8 lg:py-12 relative z-10 px-4 sm:px-6 max-w-7xl mx-auto">
        {showConfetti && (
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random()}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="w-full">
          <div className="bg-gray-800/40 p-4 sm:p-6 lg:p-8 rounded-xl w-full max-w-7xl mx-auto mb-4 md:mb-8 shadow-2xl">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 md:mb-8 text-center">
              {getExamTitle()} Rank Analysis
            </h2>

            {/* Hero Section with Main Results */}
            <div
              className={`bg-gradient-to-r ${
                rankDetails.rank <= (examType === "NIMCET" ? 500 : 10000)
                  ? "from-purple-900 to-blue-900"
                  : "from-blue-900 to-indigo-900"
              } p-4 sm:p-6 lg:p-8 rounded-xl mb-4 md:mb-8 text-center shadow-lg`}
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">
                Your All India Rank
              </h3>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-yellow-400 animate-pulse">
                {rankDetails.rank.toLocaleString("en-IN")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-8">
                <div className="bg-gray-800 bg-opacity-50 p-3 md:p-4 rounded-lg">
                  <p className="text-sm md:text-lg">Your Score</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400">
                    {rankDetails.score}
                  </p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-3 md:p-4 rounded-lg">
                  <p className="text-sm md:text-lg">Total Applicants</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">
                    {rankDetails.totalApplicants.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-3 md:p-4 rounded-lg sm:col-span-2 md:col-span-1">
                  <p className="text-sm md:text-lg">Category</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-400">
                    {rankDetails.category}
                  </p>
                </div>
              </div>

              <div
                className={`mt-4 md:mt-8 p-3 md:p-4 rounded-lg inline-block ${
                  rankDetails.qualifiedForAdvanced
                    ? "bg-green-900"
                    : "bg-red-900"
                }`}
              >
                <p
                  className={`text-sm sm:text-lg lg:text-xl font-bold ${
                    rankDetails.qualifiedForAdvanced
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {getQualificationMessage()}
                </p>
              </div>
            </div>

            {/* Score Distribution Chart */}
            <div className="bg-gray-700/50 p-3 sm:p-4 lg:p-6 rounded-lg mb-4 md:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-4">
                Score vs Rank Distribution
              </h3>
              <p className="text-gray-400 mb-2 md:mb-4 text-sm md:text-base">
                See how your score compares to other candidates
              </p>
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={distributionData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="score"
                      label={{
                        value: "Score",
                        position: "insideBottomRight",
                        offset: -10,
                        fontSize: 12,
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      label={{
                        value: "Rank",
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 12,
                      }}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="rank"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      data={[
                        { score: rankDetails.score, rank: 0 },
                        {
                          score: rankDetails.score,
                          rank: Math.max(
                            ...distributionData.map((d) => d.rank)
                          ),
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

            {/* College Eligibility */}
            <div className="bg-gray-700/50 p-3 sm:p-4 lg:p-6 rounded-lg mb-4 md:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-4">
                College Eligibility
              </h3>
              <p className="text-gray-400 mb-2 md:mb-4 text-sm md:text-base">
                Based on your marks, you may be eligible for the following
                colleges:
              </p>

              {eligibleInstitutes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {eligibleInstitutes.slice(0, 4).map((institute, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/50 p-3 md:p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300"
                    >
                      <h4 className="font-bold text-base md:text-lg mb-1 md:mb-2">
                        {institute.name}
                      </h4>
                      <p className="text-gray-400 mb-1 md:mb-2 text-sm md:text-base">
                        Min. Marks: {institute.minMarks}
                      </p>
                      <p className="font-semibold mb-1 text-sm md:text-base">
                        Potential Programs:
                      </p>
                      <ul className="text-blue-400 text-sm md:text-base">
                        {institute.programs.map((program, idx) => (
                          <li key={idx} className="ml-2 md:ml-4">
                            • {program}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-red-900 p-3 md:p-4 rounded-lg">
                  <p className="text-center text-sm md:text-lg">
                    Your current marks don't meet the minimum requirements for
                    our listed colleges. Consider improving your score or
                    exploring other educational pathways.
                  </p>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-gray-700/50 p-3 sm:p-4 lg:p-6 rounded-lg mb-4 md:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-4">
                Next Steps
              </h3>

              {rankDetails.qualifiedForAdvanced ? (
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-blue-900 bg-opacity-50 p-3 md:p-4 rounded-lg">
                    <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">
                      Prepare for{" "}
                      {examType === "NIMCET"
                        ? "NIMCET Counselling"
                        : examType === "NEET"
                        ? "NEET Counselling"
                        : "JEE Advanced"}
                    </h4>
                    <p className="text-sm md:text-base">
                      Your score qualifies you for{" "}
                      {examType === "NIMCET"
                        ? "NIMCET Counselling"
                        : examType === "NEET"
                        ? "NEET Counselling"
                        : "JEE Advanced"}
                      . Focus on advanced concepts and problem-solving skills.
                    </p>
                  </div>
                  <div className="bg-purple-900 bg-opacity-50 p-3 md:p-4 rounded-lg">
                    <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">
                      Research Your College Options
                    </h4>
                    <p className="text-sm md:text-base">
                      Start researching the colleges and programs you're
                      eligible for based on your marks.
                    </p>
                  </div>
                  <div className="bg-indigo-900 bg-opacity-50 p-3 md:p-4 rounded-lg">
                    <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">
                      Practice Advanced Problems
                    </h4>
                    <p className="text-sm md:text-base">
                      {examType === "NIMCET"
                        ? "NIMCET Counselling"
                        : examType === "NEET"
                        ? "NEET Counselling"
                        : "JEE Advanced"}
                      features more complex problems. Focus on previous years'
                      papers to get familiar with the pattern.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  <div className="bg-blue-900 bg-opacity-50 p-3 md:p-4 rounded-lg">
                    <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">
                      Analyze Your Performance
                    </h4>
                    <p className="text-sm md:text-base">
                      Identify your weak areas and create a targeted study plan
                      to improve them.
                    </p>
                  </div>
                  <div className="bg-purple-900 bg-opacity-50 p-3 md:p-4 rounded-lg">
                    <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">
                      Consider Alternative Pathways
                    </h4>
                    <p className="text-sm md:text-base">
                      Explore other entrance exams or alternate career paths
                      that align with your interests.
                    </p>
                  </div>
                  <div className="bg-indigo-900 bg-opacity-50 p-3 md:p-4 rounded-lg">
                    <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">
                      Improve Your Fundamentals
                    </h4>
                    <p className="text-sm md:text-base">
                      Work on strengthening your understanding of core concepts
                      to perform better next time.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-gray-400 text-xs sm:text-sm mb-4 md:mb-6 p-3 md:p-4 bg-gray-800 rounded-lg max-w-7xl mx-auto">
          <p>
            <strong>Disclaimer:</strong> This rank prediction is based on
            simulated data and previous year trends. The actual {examType} rank
            may vary based on this year's difficulty level, number of
            candidates, and other factors. This is meant to give you a general
            idea of your standing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/result")}
            className="border-2 border-blue-600 px-4 sm:px-6 lg:px-10 py-2 md:py-3 rounded-md transition font-bold text-sm md:text-base w-full sm:w-auto"
          >
            View Detailed Results
          </button>
          <button
            onClick={() => navigate("/start-mock-test")}
            className="border-2 border-purple-600 px-4 sm:px-6 lg:px-10 py-2 md:py-3 rounded-md transition font-bold text-sm md:text-base w-full sm:w-auto"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rank;
