import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from "../assets/Animation3.json";
import ExamSelection from './ExamSelection';
import ReadyForExam from './ReadyForExam';
import jeeQuestions from '../data/jee_mock_questions.json';
import { useExam } from '../context/ExamContext';

const StartMockTest = () => {
    const { user, logout } = useAuth();
    const { setQuestions } = useExam();
    const [Hide, setHide] = useState("hidden");
    const [loading, setLoading] = useState(false);
    const [localQuestions, setLocalQuestions] = useState([]);
    const [readyForExam, setReadyForExam] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/signin');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleDropdown = () => {
        setHide(Hide === "hidden" ? "block" : "hidden");
    };

    const fetchJEEQuestions = () => {
        setLoading(true);
        setTimeout(() => {
            const shuffledQuestions = jeeQuestions
                .sort(() => 0.5 - Math.random())
                .slice(0, 10);
            setLocalQuestions(shuffledQuestions);
            setLoading(false);
        }, 1500);
    };

    useEffect(() => {
        if (readyForExam && localQuestions.length > 0) {
            setQuestions(localQuestions);
            navigate('/exam-hall');
        }
    }, [readyForExam, navigate, localQuestions, setQuestions]);

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
                <ExamSelection handleDropdown={handleDropdown} Hide={Hide} fetchJEEQuestions={fetchJEEQuestions} />
            )}

            <div className="flex justify-center items-center mt-8">
                {loading ? (
                    <div className="w-[50%] h-[50%] flex justify-center items-center text-white">
                        {/* <Lottie animationData={animationData} loop={true} /> */}
                        loading....
                    </div>
                ) : (
                    localQuestions.length > 0 && (
                        <ReadyForExam setReadyForExam={setReadyForExam} user={user} />
                    )
                )}
            </div>
        </div>
    );
};

export default StartMockTest;