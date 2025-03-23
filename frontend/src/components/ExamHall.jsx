import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import QuestionPaper from './QuestionPaper';
import { useExam } from '../context/ExamContext';
import { showToast } from '../utils/toast';

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

    useEffect(() => {
        if (timeLeft === 300) {
            showToast.warning("5 minutes remaining for your exam!");
        } else if (timeLeft === 60) {
            showToast.warning("Only 1 minute remaining!");
        }
    }, [timeLeft]);

    // Handle exam timeout
    useEffect(() => {
        if (timeLeft === 0 && !examCompleted) {
            showToast.info("Time's up! Your exam has been submitted automatically.");
        }
    }, [timeLeft, examCompleted]);



    const { hours, minutes, seconds } = formatTime();

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-[#0A0A0B] via-[#110D1A] to-[#090015] overflow-x-hidden relative'>
            {/* Glowing background effect - responsive sizing */}
            <div className="w-[90vw] sm:w-[70vw] md:w-[60vw] lg:w-[800px] h-[60vh] sm:h-[70vh] lg:h-[700px] 
          absolute right-[-10%] sm:right-[-5%] md:right-[0%] lg:right-[12%] top-[-10%] sm:top-[-15%] lg:top-[-20%] rounded-full 
          bg-[#441d85] bg-opacity-70
          shadow-[0_0_800px_10px_rgba(122,47,249,0.8)] 
          backdrop-blur-md border-none outline-none blur-[200px] sm:blur-[250px] md:blur-[300px]" />

            {/* Main content container - responsive padding */}
            <div className="p-4 sm:p-6 md:p-8 min-h-screen text-white relative">
                {/* Timer section - responsive layout */}
                <div className="flex items-center justify-center w-full gap-1 sm:gap-1.5 count-down-main mt-8 sm:mt-10 md:mt-14 mb-6 sm:mb-8 md:mb-10 z-10">
                    {/* Hours timer */}
                    <div className="timer">
                        <div className="rounded-xl bg-black/15 backdrop-blur-sm py-2 sm:py-3 min-w-[70px] sm:min-w-[85px] md:min-w-[96px] 
                flex items-center justify-center flex-col gap-1 px-2 sm:px-3">
                            <h3 className="countdown-element hours font-manrope font-semibold text-xl sm:text-2xl text-white text-center">
                                {hours}
                            </h3>
                            <p className="text-base sm:text-lg uppercase font-normal text-white mt-0 sm:mt-1 text-center w-full">Hour</p>
                        </div>
                    </div>

                    {/* Minutes timer */}
                    <div className="timer">
                        <div className="rounded-xl bg-black/15 backdrop-blur-sm py-2 sm:py-3 min-w-[70px] sm:min-w-[85px] md:min-w-[96px] 
                flex items-center justify-center flex-col gap-1 px-2 sm:px-3">
                            <h3 className="countdown-element minutes font-manrope font-semibold text-xl sm:text-2xl text-white text-center">
                                {minutes}
                            </h3>
                            <p className="text-base sm:text-lg uppercase font-normal text-white mt-0 sm:mt-1 text-center w-full">Minutes</p>
                        </div>
                    </div>

                    {/* Seconds timer */}
                    <div className="timer">
                        <div className="rounded-xl bg-black/15 backdrop-blur-sm py-2 sm:py-3 min-w-[70px] sm:min-w-[85px] md:min-w-[96px] 
                flex items-center justify-center flex-col gap-1 px-2 sm:px-3">
                            <h3 className="countdown-element seconds font-manrope font-semibold text-xl sm:text-2xl text-white text-center">
                                {seconds}
                            </h3>
                            <p className="text-base sm:text-lg uppercase font-normal text-white mt-0 sm:mt-1 text-center w-full">Seconds</p>
                        </div>
                    </div>
                </div>

                {/* Time up notification */}
                {timeLeft === 0 && (
                    <div className="bg-red-700 text-white p-3 sm:p-4 mb-6 sm:mb-8 rounded-lg text-center text-sm sm:text-base">
                        Time is up! Your test has been automatically submitted.
                    </div>
                )}

                {/* Subject navigation - responsive scrolling for small screens */}
                <div className='flex justify-center'>
                    <div className="flex overflow-x-auto pb-2 space-x-2 sm:space-x-4 md:space-x-6 text-base sm:text-lg md:text-xl px-2 sm:px-4 md:ml-10 max-w-full">
                        {subjects.map((subject, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedSubject(subject)}
                                className={`p-2 sm:p-3 md:p-4 whitespace-nowrap ${selectedSubject === subject ? 'border-b-2 border-white' : 'text-gray-500'}`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question paper component */}
                <QuestionPaper />
            </div>
        </div>
    );
};

export default ExamHall;