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
    totalApplicants: 1000000,
    rank: 0,
    category: "",
    qualifiedForAdvanced: false,
  });
  const [showConfetti, setShowConfetti] = useState(false);

  // Marks to Rank Mapping - JEE
  const jeeMarksToRankMapping = {
    300: 1, // Top rank for 300 marks
    290: 15, // Rank range starts at 15 for 290 marks
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
    40: 1321716, // Approximate extrapolation from data
    30: 1400000, // Estimated rank beyond given data
    20: 1450000, // Estimated rank
    10: 1490000, // Estimated rank
    0: 1500000, // Default lowest rank
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

  // College Eligibility Based on Marks
  const getTopInstitutes = (score) => {
    console.log("Calculating Eligible Institutes for Score:", score);

    // JEE Institutes
    const jeeInstitutes = [
      {
        name: "IIT Bombay",
        minMarks: 280,
        programs: ["Computer Science", "Electrical Engineering"],
      },
      {
        name: "IIT Delhi",
        minMarks: 270,
        programs: ["Computer Science", "Mechanical Engineering"],
      },
      {
        name: "IIT Madras",
        minMarks: 260,
        programs: ["Aerospace Engineering", "Data Science"],
      },
      {
        name: "IIT Kanpur",
        minMarks: 250,
        programs: ["Chemical Engineering", "Physics"],
      },
      {
        name: "IIT Kharagpur",
        minMarks: 240,
        programs: ["Electronics", "Civil Engineering"],
      },
      {
        name: "IIT Roorkee",
        minMarks: 230,
        programs: ["Metallurgical Engineering", "Architecture"],
      },
      {
        name: "IIT Guwahati",
        minMarks: 220,
        programs: ["Biotechnology", "Mathematics and Computing"],
      },
      {
        name: "NIT Trichy",
        minMarks: 210,
        programs: ["Computer Science", "Electronics and Communication"],
      },
      {
        name: "NIT Warangal",
        minMarks: 200,
        programs: ["Computer Science", "Mechanical Engineering"],
      },
      {
        name: "BITS Pilani",
        minMarks: 190,
        programs: ["Computer Science", "Electronics and Instrumentation"],
      },
      {
        name: "NIT Surathkal",
        minMarks: 180,
        programs: ["Information Technology", "Chemical Engineering"],
      },
      {
        name: "DTU Delhi",
        minMarks: 170,
        programs: ["Software Engineering", "Engineering Physics"],
      },
      {
        name: "VIT Vellore",
        minMarks: 160,
        programs: ["Computer Science", "Electronics"],
      },
      {
        name: "SRM Chennai",
        minMarks: 150,
        programs: ["Artificial Intelligence", "Biotechnology"],
      },
      {
        name: "Manipal Institute of Technology",
        minMarks: 140,
        programs: ["Computer Science", "Mechatronics"],
      },
      {
        name: "Amity University",
        minMarks: 130,
        programs: ["Computer Science", "Information Technology"],
      },
      {
        name: "KIIT Bhubaneswar",
        minMarks: 120,
        programs: ["Computer Science", "Electronics"],
      },
      {
        name: "Thapar Institute of Engineering and Technology",
        minMarks: 110,
        programs: ["Mechanical Engineering", "Civil Engineering"],
      },
      {
        name: "MIT Pune",
        minMarks: 100,
        programs: ["Computer Science", "Electronics and Telecommunication"],
      },
      {
        name: "Lovely Professional University",
        minMarks: 90,
        programs: ["Computer Science", "Mechanical Engineering"],
      },
      {
        name: "Chandigarh University",
        minMarks: 80,
        programs: ["Computer Science", "Electrical Engineering"],
      },
      {
        name: "SRM Institute of Science and Technology",
        minMarks: 70,
        programs: ["Computer Science", "Biotechnology"],
      },
      {
        name: "BMS College of Engineering",
        minMarks: 60,
        programs: ["Computer Science", "Electronics and Communication"],
      },
      {
        name: "PES University",
        minMarks: 50,
        programs: ["Computer Science", "Mechanical Engineering"],
      },
      {
        name: "RV College of Engineering",
        minMarks: 40,
        programs: [
          "Computer Science",
          "Electrical and Electronics Engineering",
        ],
      },
      {
        name: "MS Ramaiah Institute of Technology",
        minMarks: 30,
        programs: ["Computer Science", "Civil Engineering"],
      },
      {
        name: "Jain University",
        minMarks: 20,
        programs: ["Computer Science", "Information Science"],
      },
      {
        name: "Dayananda Sagar College of Engineering",
        minMarks: 10,
        programs: ["Computer Science", "Mechanical Engineering"],
      },
      {
        name: "NIT Meghalaya",
        minMarks: 5,
        programs: ["Computer Science", "Electronics and Communication"],
      },
    ];

    // NEET Institutes
    const neetInstitutes = [
      {
        name: "AIIMS Delhi",
        minMarks: 680,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "JIPMER Puducherry",
        minMarks: 650,
        programs: ["MBBS", "Nursing"],
      },
      {
        name: "Maulana Azad Medical College, Delhi",
        minMarks: 630,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "King George's Medical University, Lucknow",
        minMarks: 620,
        programs: ["MBBS", "Pharmacy"],
      },
      {
        name: "Christian Medical College, Vellore",
        minMarks: 610,
        programs: ["MBBS", "Allied Health Sciences"],
      },
      {
        name: "Armed Forces Medical College, Pune",
        minMarks: 600,
        programs: ["MBBS", "Medical Sciences"],
      },
      {
        name: "Grant Medical College, Mumbai",
        minMarks: 590,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "Lady Hardinge Medical College, Delhi",
        minMarks: 580,
        programs: ["MBBS", "Nursing"],
      },
      {
        name: "Seth GS Medical College, Mumbai",
        minMarks: 570,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "Institute of Medical Sciences, BHU",
        minMarks: 560,
        programs: ["MBBS", "Pharmacy"],
      },
      {
        name: "St. John's Medical College, Bangalore",
        minMarks: 550,
        programs: ["MBBS", "Nursing"],
      },
      {
        name: "Kasturba Medical College, Manipal",
        minMarks: 540,
        programs: ["MBBS", "Allied Health Sciences"],
      },
      {
        name: "Madras Medical College, Chennai",
        minMarks: 530,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "BJ Medical College, Ahmedabad",
        minMarks: 520,
        programs: ["MBBS", "Pharmacy"],
      },
      {
        name: "Government Medical College, Thiruvananthapuram",
        minMarks: 510,
        programs: ["MBBS", "Nursing"],
      },
      {
        name: "Osmania Medical College, Hyderabad",
        minMarks: 500,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "Government Medical College, Kozhikode",
        minMarks: 490,
        programs: ["MBBS", "Paramedical"],
      },
      {
        name: "Sri Ramachandra Medical College, Chennai",
        minMarks: 480,
        programs: ["MBBS", "Allied Health Sciences"],
      },
      {
        name: "Jawaharlal Nehru Medical College, Aligarh",
        minMarks: 470,
        programs: ["MBBS", "Pharmacy"],
      },
      {
        name: "Government Medical College, Patiala",
        minMarks: 460,
        programs: ["MBBS", "Nursing"],
      },
      {
        name: "Government Medical College, Amritsar",
        minMarks: 450,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "Government Medical College, Nagpur",
        minMarks: 440,
        programs: ["MBBS", "Pharmacy"],
      },
      {
        name: "Government Medical College, Surat",
        minMarks: 430,
        programs: ["MBBS", "Nursing"],
      },
      {
        name: "Government Medical College, Mysore",
        minMarks: 420,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "Government Medical College, Jammu",
        minMarks: 410,
        programs: ["MBBS", "Pharmacy"],
      },
      {
        name: "Government Medical College, Srinagar",
        minMarks: 400,
        programs: ["MBBS", "Nursing"],
      },
      {
        name: "Government Medical College, Agartala",
        minMarks: 390,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "Government Medical College, Imphal",
        minMarks: 380,
        programs: ["MBBS", "Pharmacy"],
      },
      {
        name: "Government Medical College, Shillong",
        minMarks: 370,
        programs: ["MBBS", "Nursing"],
      },
      {
        name: "Government Medical College, Aizawl",
        minMarks: 360,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "Government Medical College, Kohima",
        minMarks: 350,
        programs: ["MBBS", "Pharmacy"],
      },
      {
        name: "Government Medical College, Itanagar",
        minMarks: 340,
        programs: ["MBBS", "Nursing"],
      },
      {
        name: "Government Medical College, Gangtok",
        minMarks: 330,
        programs: ["MBBS", "BDS"],
      },
      {
        name: "Government Medical College, Port Blair",
        minMarks: 320,
        programs: ["MBBS", "Pharmacy"],
      },
    ];

    // Return institutes based on exam type
    return examType === "NEET"
      ? neetInstitutes.filter((institute) => institute.minMarks <= score)
      : jeeInstitutes.filter((institute) => institute.minMarks <= score);
  };

  // Calculate user's score
  const calculateUserScore = () => {
    let totalScore = 0;
    let correctMCQ = 0;
    let incorrectMCQ = 0;
    let correctNumerical = 0;

    subjects.forEach((subject) => {
      const subjectQuestions = questions.filter((q) => q.subject === subject);

      subjectQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[`${subject}-${index}`];

        if (userAnswer !== undefined) {
          if (question.type === "MCQ") {
            // Convert user answer to number for comparison with correct_answer_index
            const userAnswerIndex = parseInt(userAnswer);
            if (userAnswerIndex === question.correct_answer_index) {
              totalScore += 4;
              correctMCQ++;
            } else {
              totalScore -= 1; // Negative marking for MCQs
              incorrectMCQ++;
            }
          } else if (question.type === "Numerical") {
            // For Numerical, compare numerical values with a tolerance
            const userNumAnswer = parseFloat(userAnswer);
            const correctNumAnswer = parseFloat(question.correct_answer);

            // Using a small tolerance for floating-point comparison
            if (Math.abs(userNumAnswer - correctNumAnswer) < 0.001) {
              totalScore += 4;
              correctNumerical++;
            }
            // No negative marking for Numerical
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
      examType === "NEET" ? neetMarksToRankMapping : jeeMarksToRankMapping;

    // Find the closest marks in the mapping
    let closestMarks = Object.keys(marksToRankMapping).reduce((prev, curr) => {
      return Math.abs(curr - score) < Math.abs(prev - score) ? curr : prev;
    });

    // Get the rank based on the closest marks
    const rank = marksToRankMapping[closestMarks];

    // Determine category based on rank
    let category = "";
    let qualifiedForAdvanced = false;

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

    return {
      rank,
      category,
      qualifiedForAdvanced,
    };
  };

  // Generate distribution data for the score distribution chart
  const generateDistributionData = (userScore) => {
    const marksToRankMapping =
      examType === "NEET" ? neetMarksToRankMapping : jeeMarksToRankMapping;

    const data = Object.keys(marksToRankMapping).map((marks) => ({
      score: parseInt(marks),
      rank: marksToRankMapping[marks],
      isUserScore: userScore >= marks - 5 && userScore <= marks + 5, // Highlight user's score range
    }));

    return data;
  };

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      const userScore = calculateUserScore();
      const rankInfo = calculateRank(userScore);

      setRankDetails({
        score: userScore,
        totalApplicants: 1000000,
        rank: rankInfo.rank,
        category: rankInfo.category,
        qualifiedForAdvanced: rankInfo.qualifiedForAdvanced,
      });

      setLoading(false);

      // Show confetti for good results
      if (rankInfo.rank <= 10000) {
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
          Calculating Your {examType === "NEET" ? "NEET" : "JEE"} Rank...
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

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      {showConfetti && (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
          {/* Simple confetti effect using absolute positioning */}
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

      <div className="container mx-auto px-4">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-7xl mx-auto mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {examType === "NEET" ? "NEET" : "JEE Main"} Rank Analysis
          </h2>

          {/* Hero Section with Main Results */}
          <div
            className={`bg-gradient-to-r ${
              rankDetails.rank <= 10000
                ? "from-purple-900 to-blue-900"
                : "from-blue-900 to-indigo-900"
            } p-8 rounded-xl mb-8 text-center shadow-lg`}
          >
            <h3 className="text-4xl font-bold mb-3">Your All India Rank</h3>
            <div className="text-6xl font-bold mb-4 text-yellow-400 animate-pulse">
              {rankDetails.rank.toLocaleString("en-IN")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <p className="text-lg">Your Score</p>
                <p className="text-3xl font-bold text-blue-400">
                  {rankDetails.score}
                </p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <p className="text-lg">Total Applicants</p>
                <p className="text-3xl font-bold text-green-400">
                  {rankDetails.totalApplicants.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                <p className="text-lg">Category</p>
                <p className="text-3xl font-bold text-purple-400">
                  {rankDetails.category}
                </p>
              </div>
            </div>

            {rankDetails.qualifiedForAdvanced ? (
              <div className="mt-8 bg-green-900 p-4 rounded-lg inline-block">
                <p className="text-xl font-bold text-green-400">
                  Congratulations! You've qualified for{" "}
                  {examType === "NEET" ? "NEET Counselling" : "JEE Advanced"}!
                </p>
              </div>
            ) : (
              <div className="mt-8 bg-red-900 p-4 rounded-lg inline-block">
                <p className="text-xl font-bold text-red-400">
                  You'll need to improve to qualify for{" "}
                  {examType === "NEET" ? "NEET Counselling" : "JEE Advanced"}{" "}
                  next time.
                </p>
              </div>
            )}
          </div>

          {/* Score Distribution Chart */}
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
                    stroke="#8884d8"
                    fill="#8884d8"
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

          {/* College Eligibility */}
          <div className="bg-gray-700 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">College Eligibility</h3>
            <p className="text-gray-400 mb-4">
              Based on your marks, you may be eligible for the following
              colleges:
            </p>

            {eligibleInstitutes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eligibleInstitutes.slice(0, 4).map((institute, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300"
                  >
                    <h4 className="font-bold text-lg mb-2">{institute.name}</h4>
                    <p className="text-gray-400 mb-2">
                      Min. Marks: {institute.minMarks}
                    </p>
                    <p className="font-semibold mb-1">Potential Programs:</p>
                    <ul className="text-blue-400">
                      {institute.programs.map((program, idx) => (
                        <li key={idx} className="ml-4">
                          • {program}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-red-900 p-4 rounded-lg">
                <p className="text-center text-lg">
                  Your current marks don't meet the minimum requirements for our
                  listed colleges. Consider improving your score or exploring
                  other educational pathways.
                </p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-gray-700 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Next Steps</h3>

            {rankDetails.qualifiedForAdvanced ? (
              <div className="space-y-4">
                <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">
                    Prepare for{" "}
                    {examType === "NEET" ? "NEET Counselling" : "JEE Advanced"}
                  </h4>
                  <p>
                    Your score qualifies you for{" "}
                    {examType === "NEET" ? "NEET Counselling" : "JEE Advanced"}.
                    Focus on advanced concepts and problem-solving skills.
                  </p>
                </div>
                <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">
                    Research Your College Options
                  </h4>
                  <p>
                    Start researching the colleges and programs you're eligible
                    for based on your marks.
                  </p>
                </div>
                <div className="bg-indigo-900 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Practice Advanced Problems</h4>
                  <p>
                    {examType === "NEET" ? "NEET Counselling" : "JEE Advanced"}{" "}
                    features more complex problems. Focus on previous years'
                    papers to get familiar with the pattern.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Analyze Your Performance</h4>
                  <p>
                    Identify your weak areas and create a targeted study plan to
                    improve them.
                  </p>
                </div>
                <div className="bg-purple-900 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">
                    Consider Alternative Pathways
                  </h4>
                  <p>
                    Explore other entrance exams or alternate career paths that
                    align with your interests.
                  </p>
                </div>
                <div className="bg-indigo-900 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Improve Your Fundamentals</h4>
                  <p>
                    Work on strengthening your understanding of core concepts to
                    perform better next time.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Disclaimer */}
      <div className="text-gray-400 text-sm mb-6 p-4 bg-gray-800 rounded-lg">
        <p>
          <strong>Disclaimer:</strong> This rank prediction is based on
          simulated data and previous year trends. The actual{" "}
          {examType === "NEET" ? "NEET" : "JEE"} rank may vary based on this
          year's difficulty level, number of candidates, and other factors. This
          is meant to give you a general idea of your standing.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate("/result")}
          className="bg-blue-600 px-6 py-3 rounded-md hover:bg-blue-700 transition font-bold"
        >
          View Detailed Results
        </button>
        <button
          onClick={() => navigate("/start-mock-test")}
          className="bg-purple-600 px-6 py-3 rounded-md hover:bg-purple-700 transition font-bold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Rank;
