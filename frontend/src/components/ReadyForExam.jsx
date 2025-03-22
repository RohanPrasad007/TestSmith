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
        <div className="flex justify-center w-full mt-[10%] h-[70%]">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[40%] text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentExam.title}</h2>
                <p className="text-gray-600 mb-2"><strong>Name:</strong> {user?.displayName || "Student"}</p>
                <p className="text-gray-600 mb-4"><strong>Email:</strong> {user?.email || "N/A"}</p>

                <div className="bg-gray-100 p-4 rounded-md mb-4">
                    <p className="text-lg font-medium text-gray-700">Exam Details</p>
                    <p className="text-gray-600"><strong>Subjects:</strong> {currentExam.subjects}</p>
                    <p className="text-gray-600"><strong>Duration:</strong> {currentExam.duration}</p>
                    <p className="text-gray-600"><strong>Question Type:</strong> {currentExam.questionTypes}</p>
                </div>

                <button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setReadyForExam(true)}
                >
                    Start Exam
                </button>
            </div>
        </div>
    );
};

export default ReadyForExam;