import React from 'react';

const ReadyForExam = ({ setReadyForExam, user, examType }) => {
    // Set exam-specific details based on examType
    const examDetails = {
        JEE: {
            title: "JEE Mock Test",
            subjects: "Physics, Chemistry, Mathematics",
            duration: "3 hours",
            questionTypes: "MCQs and Numerical"
        },
        NEET: {
            title: "NEET Mock Test",
            subjects: "Physics, Chemistry, Biology",
            duration: "3 hours",
            questionTypes: "MCQs"
        }
    };

    // Use the current examType or default to a generic message if examType is not set
    const currentExam = examDetails[examType] || {
        title: "Mock Test",
        subjects: "Multiple Subjects",
        duration: "3 hours",
        questionTypes: "Various"
    };

    return (
        <div className="flex justify-center w-full mt-[10%] h-[70%] ">
            <div className="bg-white/5 text-white p-6 rounded-xl shadow-lg  text-center w-full text-xl">
                <h2 className="text-5xl font-bold text-white mb-10">{currentExam.title}</h2>
                <p className="text-white mb-4 "><strong>Name:</strong> {user?.displayName || "Student"}</p>
                <p className="text-white mb-4"><strong>Email:</strong> {user?.email || "N/A"}</p>

                <div className="bg-black p-4 py-8 rounded-md mb-4">
                    <p className="text-3xl font-medium text-gray-500 mb-8">Exam Details</p>
                    <p className="text-white mb-4"><strong>Subjects:</strong> {currentExam.subjects}</p>
                    <p className="text-white mb-4"><strong>Duration:</strong> {currentExam.duration}</p>
                    <p className="text-white mb-4"><strong>Question Type:</strong> {currentExam.questionTypes}</p>
                </div>

                <button
                    className="bg-[#6028b9] text-white text-2xl px-6 py-5 rounded-lg w-full  transition mt-7"
                    onClick={() => setReadyForExam(true)}
                >
                    Start Exam
                </button>
            </div>
        </div>
    );
};

export default ReadyForExam;