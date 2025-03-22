import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import QuestionPaper from './QuestionPaper';
import { useExam } from '../context/ExamContext';

const ExamHall = () => {
    const location = useLocation();
    const {
        setQuestions,
        subjects,
        selectedSubject,
        setSelectedSubject,
        timeLeft,
        formatTime,
        examCompleted
    } = useExam();

    // Get questions from location state
    useEffect(() => {
        const questionData = location.state?.questions || [];
        if (questionData.length > 0) {
            setQuestions(questionData);
        } else {
            console.warn("No questions received!");
        }
    }, [location.state, setQuestions]);

    const { hours, minutes, seconds } = formatTime();

    return (
        <div className="p-8 min-h-screen bg-zinc-950 text-white">
            <div className="flex items-start justify-center w-full gap-1.5 count-down-main mt-14 mb-10">
                <div className="timer">
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm py-3 min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                        <h3 className="countdown-element hours font-manrope font-semibold text-2xl text-white text-center">
                            {hours}
                        </h3>
                        <p className="text-lg uppercase font-normal text-white mt-1 text-center w-full">Hour</p>
                    </div>
                </div>

                <div className="timer">
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm py-3 min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                        <h3 className="countdown-element minutes font-manrope font-semibold text-2xl text-white text-center">
                            {minutes}
                        </h3>
                        <p className="text-lg uppercase font-normal text-white mt-1 text-center w-full">Minutes</p>
                    </div>
                </div>

                <div className="timer">
                    <div className="rounded-xl bg-white/10 backdrop-blur-sm py-3 min-w-[96px] flex items-center justify-center flex-col gap-1 px-3">
                        <h3 className="countdown-element seconds font-manrope font-semibold text-2xl text-white text-center">
                            {seconds}
                        </h3>
                        <p className="text-lg uppercase font-normal text-white mt-1 text-center w-full">Seconds</p>
                    </div>
                </div>
            </div>

            {timeLeft === 0 && (
                <div className="bg-red-700 text-white p-4 mb-8 rounded-lg text-center">
                    Time is up! Your test has been automatically submitted.
                </div>
            )}

            <div className='flex justify-center'>
                <div className="flex space-x-4 text-xl ml-6">
                    {subjects.map((subject, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedSubject(subject)}
                            className={`p-4 ${selectedSubject === subject ? 'border-b-2 border-white' : 'text-gray-500'}`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            <QuestionPaper />
        </div>
    );
};

export default ExamHall;