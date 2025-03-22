import React from 'react'

const NextSteps = ({ advancedName, examType, rankDetails }) => {
    return (
        <div className="bg-gray-700 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-4">Next Steps</h3>

            {rankDetails.qualifiedForAdvanced ? (
                <div className="space-y-4">
                    <div className={`bg-${examType === "NEET" ? "green" : "blue"}-900 bg-opacity-50 p-4 rounded-lg`}>
                        <h4 className="font-bold mb-2">
                            {examType === "NEET" ? "Prepare for NEET Counselling" : "Prepare for JEE Advanced"}
                        </h4>
                        <p>
                            Your score qualifies you for {advancedName}.
                            {examType === "NEET"
                                ? " Focus on preparing documents for the counselling process."
                                : " Focus on advanced concepts and problem-solving skills."}
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
                        <h4 className="font-bold mb-2">
                            {examType === "NEET"
                                ? "Prepare for Interviews"
                                : "Practice Advanced Problems"}
                        </h4>
                        <p>
                            {examType === "NEET"
                                ? "Some medical colleges conduct interviews. Prepare for potential interviews by working on your communication skills."
                                : "JEE Advanced features more complex problems. Focus on previous years' papers to get familiar with the pattern."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className={`bg-${examType === "NEET" ? "green" : "blue"}-900 bg-opacity-50 p-4 rounded-lg`}>
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
                            {examType === "NEET"
                                ? "Explore allied health sciences, paramedical courses, or other biology-related fields."
                                : "Explore other engineering entrance exams or alternate career paths that align with your interests."}
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
    )
}

export default NextSteps