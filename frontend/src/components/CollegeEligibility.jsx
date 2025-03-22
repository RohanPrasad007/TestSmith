import React from 'react'

const CollegeEligibility = ({ examType, eligibleInstitutes }) => {
    return (
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
                            className={`bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-${examType === "NEET" ? "green" : "blue"}-500 transition-all duration-300`}
                        >
                            <h4 className="font-bold text-lg mb-2">{institute.name}</h4>
                            <p className="text-gray-400 mb-2">
                                Min. Marks: {institute.minMarks}
                            </p>
                            <p className="font-semibold mb-1">Potential Programs:</p>
                            <ul className={`text-${examType === "NEET" ? "green" : "blue"}-400`}>
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
    )
}

export default CollegeEligibility