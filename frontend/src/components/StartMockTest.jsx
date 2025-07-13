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
  const { setQuestions, setExamType, examType } = useExam();
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
    setExamType("JEE");
    try {
      const response = await fetch(`${API_URL}/generate-paper?exam_name=JEE`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid data structure received from API");
      }
      const availableQuestions = data.questions.filter((question) => {
        const questionId = `${question.subject}-${question.question}`;
        const isAnswered = Object.keys(userAnswers).some((key) => {
          const [answerSubject, answerIndex] = key.split("-");
          const subjectQuestions = questions.filter(
            (q) => q.subject === answerSubject
          );
          if (subjectQuestions[answerIndex]) {
            return subjectQuestions[answerIndex].question === question.question;
          }
          return false;
        });
        return !isAnswered;
      });
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
    setExamType("NEET");
    try {
      const response = await fetch(`${API_URL}/generate-paper?exam_name=NEET`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid data structure received from API");
      }
      const availableQuestions = data.questions.filter((question) => {
        const questionId = `${question.subject}-${question.question}`;
        const isAnswered = Object.keys(userAnswers).some((key) => {
          const [answerSubject, answerIndex] = key.split("-");
          const subjectQuestions = questions.filter(
            (q) => q.subject === answerSubject
          );
          if (subjectQuestions[answerIndex]) {
            return subjectQuestions[answerIndex].question === question.question;
          }
          return false;
        });
        return !isAnswered;
      });
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

  const fetchNIMCETQuestions = async () => {
    setLoading(true);
    setExamType("NIMCET");
    try {
      const response = await fetch(
        `${API_URL}/generate-paper?exam_name=NIMCET`
      );
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid data structure received from API");
      }
      const availableQuestions = data.questions.filter((question) => {
        const questionId = `${question.subject}-${question.question}`;
        const isAnswered = Object.keys(userAnswers).some((key) => {
          const [answerSubject, answerIndex] = key.split("-");
          const subjectQuestions = questions.filter(
            (q) => q.subject === answerSubject
          );
          if (subjectQuestions[answerIndex]) {
            return subjectQuestions[answerIndex].question === question.question;
          }
          return false;
        });
        return !isAnswered;
      });
      setLocalQuestions(availableQuestions);
      showToast.success("NIMCET questions loaded successfully");
    } catch (error) {
      showToast.error(
        "Failed to load NIMCET questions from server. Please try again."
      );
      console.error("Error fetching NIMCET questions:", error);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0A0A0B] via-[#110D1A] to-[#090015] overflow-hidden relative">
      {/* Soft Glowing Effect - Responsive positioning */}
      <div
        className="w-[70vw] h-[70vw] max-w-[800px] max-h-[700px] absolute right-[-10%] sm:right-[0%] md:right-[5%] lg:right-[12%] top-[-20%] rounded-full 
            bg-[#441d85] bg-opacity-70
            shadow-[0_0_800px_10px_rgba(122,47,249,0.8)] 
            backdrop-blur-md border-none outline-none blur-[300px]"
      />

      {/* Transparent Dark Overlay */}
      <div className="bg-black/20 backdrop-blur-2xl blur-[5px] rounded-md w-full h-full absolute z-0" />

      {/* Content Box - Responsive padding and width */}
      <div className="z-20 text-white w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-6 rounded-md relative">
        {!localQuestions.length && !loading && (
          <>
            {/* Header with profile - Responsive spacing and size */}
            <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 max-w-7xl mx-auto bg-white/5 p-2 px-3 sm:px-4 rounded-full">
              <div>
                <img
                  src={
                    user.providerData?.[0]?.photoURL || "/default-profile.png"
                  }
                  alt="User"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1 sm:px-4 sm:py-2 text-white text-base sm:text-lg"
              >
                Logout
              </button>
            </div>

            {/* Welcome section - Responsive text sizing and margins */}
            <div className="mx-2 sm:mx-5 md:mx-10">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl">Welcome</div>
                <div className="mt-2 sm:mt-3 md:mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r from-white via-purple-500 to-purple-900 text-transparent bg-clip-text">
                  {user.providerData?.[0]?.displayName}
                </div>
              </div>

              {/* Exam selection container - Responsive padding */}
              <div className="w-full bg-black/20 mx-auto h-auto mt-5 sm:mt-8 md:mt-10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10">
                <ExamSelection
                  handleDropdown={handleDropdown}
                  Hide={Hide}
                  fetchJEEQuestions={fetchJEEQuestions}
                  fetchNEETQuestions={fetchNEETQuestions}
                  fetchNIMCETQuestions={fetchNIMCETQuestions}
                />
              </div>
            </div>
          </>
        )}

        {/* Loading or Questions section */}
        <div className="flex justify-center items-center mt-4 sm:mt-6 md:mt-8 h-full w-full ">
          {loading ? (
            <div className="w-full h-screen flex justify-center items-center flex-col">
              <div className="flex flex-col text-center mt-[10px]">
                <p className="text-2xl font-semibold ">
                  Your practice test is currently building...
                </p>
                <p className="mt-2 sm:mt-3 md:mt-4 text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold bg-gradient-to-r from-white via-purple-500 to-purple-900 text-transparent bg-clip-text">
                  Till then, meet our friend Smith!
                </p>
              </div>
              <spline-viewer
                url="https://prod.spline.design/smx3Thfp6jQrYR-N/scene.splinecode"
                events-target="global"
              ></spline-viewer>
            </div>
          ) : (
            localQuestions.length > 0 && (
              <div className="w-full h-full">
                <ReadyForExam
                  setReadyForExam={setReadyForExam}
                  user={user}
                  examType={examType}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default StartMockTest;
