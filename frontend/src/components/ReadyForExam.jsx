import React from 'react';

const ReadyForExam = ({ setReadyForExam, user }) => {
    return (
        <div className="flex justify-center w-full mt-[10%] h-[70%]">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[40%] text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">JEE Mock Test</h2>
                <p className="text-gray-600 mb-2"><strong>Name:</strong> {user?.displayName || "Student"}</p>
                <p className="text-gray-600 mb-4"><strong>Email:</strong> {user?.email || "N/A"}</p>

                <div className="bg-gray-100 p-4 rounded-md mb-4">
                    <p className="text-lg font-medium text-gray-700">Exam Details</p>
                    <p className="text-gray-600"><strong>Subjects:</strong> Physics, Chemistry, Mathematics</p>
                    <p className="text-gray-600"><strong>Duration:</strong> 3 hours</p>
                    <p className="text-gray-600"><strong>Question Type:</strong> MCQs</p>
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