import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/Animation3.json";
import ExamSelection from "./ExamSelection";
import ReadyForExam from "./ReadyForExam";
import { useExam } from "../context/ExamContext";
import { showToast } from "../utils/toast";
import NEET_QUESTIONS from "../data/neet_question_paper.json";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const StartMockTest = () => {
  const { user, logout } = useAuth();
  const {
    setQuestions,
    setExamType, // Get setExamType from context
    examType, // Get examType from context
  } = useExam();
  const [Hide, setHide] = useState("hidden");
  const [loading, setLoading] = useState(false);
  const [localQuestions, setLocalQuestions] = useState([]);
  const [readyForExam, setReadyForExam] = useState(false);
  const navigate = useNavigate();
  const { questions, userAnswers } = useExam();

  const handleLogout = async () => {
    try {
      await logout();
      showToast.success("Successfully logged out");
      navigate("/signin");
    } catch (error) {
      showToast.error("Error logging out. Please try again.");
      console.error("Logout error:", error);
    }
  };

  const handleDropdown = () => {
    setHide(Hide === "hidden" ? "block" : "hidden");
  };

  const fetchJEEQuestions = async () => {
    setLoading(true);
    setExamType("JEE"); // Use the context setter instead of local state
    try {
      // Make a GET request to the API endpoint
      const response = await fetch(`${API_URL}/generate-paper?exam_name=JEE`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Check if the data structure is as expected
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid data structure received from API");
      }

      // Filter out questions that have already been answered
      const availableQuestions = data.questions.filter((question) => {
        // Create a unique ID for each question
        const questionId = `${question.subject}-${question.question}`;

        // Check if this question has been answered in any subject
        const isAnswered = Object.keys(userAnswers).some((key) => {
          // The key format is "{subject}-{questionIndex}", so we need to look up the actual question
          const [answerSubject, answerIndex] = key.split("-");
          const subjectQuestions = questions.filter(
            (q) => q.subject === answerSubject
          );

          if (subjectQuestions[answerIndex]) {
            // Compare if this is the same question
            return subjectQuestions[answerIndex].question === question.question;
          }
          return false;
        });

        // Only include questions that haven't been answered
        return !isAnswered;
      });

      // Use all available questions instead of limiting to 10
      setLocalQuestions(availableQuestions);
    } catch (error) {
      showToast.error(
        "Failed to load JEE questions from server. Please try again."
      );
      console.error("Error fetching JEE questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNEETQuestions = async () => {
    setLoading(true);
    setExamType("NEET"); // Use the context setter instead of local state
    try {
      // Make a GET request to the API endpoint
      const response = await fetch(`${API_URL}/generate-paper?exam_name=NEET`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      console.log("data", data);

      // Check if the data structure is as expected
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid data structure received from API");
      }

      // Filter out questions that have already been answered
      const availableQuestions = data.questions.filter((question) => {
        // Create a unique ID for each question
        const questionId = `${question.subject}-${question.question}`;

        // Check if this question has been answered in any subject
        const isAnswered = Object.keys(userAnswers).some((key) => {
          // The key format is "{subject}-{questionIndex}", so we need to look up the actual question
          const [answerSubject, answerIndex] = key.split("-");
          const subjectQuestions = questions.filter(
            (q) => q.subject === answerSubject
          );

          if (subjectQuestions[answerIndex]) {
            // Compare if this is the same question
            return subjectQuestions[answerIndex].question === question.question;
          }
          return false;
        });

        // Only include questions that haven't been answered
        return !isAnswered;
      });

      console.log("availableQuestions", availableQuestions);
      setLocalQuestions(availableQuestions);

      showToast.success("NEET questions loaded successfully");
    } catch (error) {
      showToast.error(
        "Failed to load NEET questions from server. Please try again."
      );
      console.error("Error fetching NEET questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (readyForExam && localQuestions.length > 0) {
      setQuestions(localQuestions);
      navigate("/exam-hall");
      showToast.info(`${examType} exam started. Good luck!`);
    }
  }, [readyForExam, navigate, localQuestions, setQuestions, examType]);

  return (
    <div className="p-8 bg-zinc-950 min-h-screen max-h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome!</h1>
          {user?.email && <p className="text-gray-600">{user.email}</p>}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {!localQuestions.length && !loading && (
        <ExamSelection
          handleDropdown={handleDropdown}
          Hide={Hide}
          fetchJEEQuestions={fetchJEEQuestions}
          fetchNEETQuestions={fetchNEETQuestions}
        />
      )}

      <div className="flex justify-center items-center mt-8">
        {loading ? (
          <div className="w-[50%] h-[50%] flex justify-center items-center">
            <Lottie animationData={animationData} loop={true} />
          </div>
        ) : (
          localQuestions.length > 0 && (
            <ReadyForExam
              setReadyForExam={setReadyForExam}
              user={user}
              examType={examType}
            />
          )
        )}
      </div>
    </div>
  );
};

export default StartMockTest;
