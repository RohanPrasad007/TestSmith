import React from 'react'

const HeroSectionRank = ({ advancedName, rankDetails, examType, heroColor, maxMarks }) => {
    return (
        <div
            className={`bg-gradient-to-r ${rankDetails.rank <= 10000
                ? examType === "NEET"
                    ? "from-green-900 to-emerald-900"
                    : "from-purple-900 to-blue-900"
                : heroColor
                } p-8 rounded-xl mb-8 text-center shadow-lg`}
        >
            <h3 className="text-4xl font-bold mb-3">Your All India Rank</h3>
            <div className="text-6xl font-bold mb-4 text-yellow-400 animate-pulse">
                {rankDetails.rank.toLocaleString("en-IN")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                    <p className="text-lg">Your Score</p>
                    <p className="text-3xl font-bold text-blue-400">
                        {rankDetails.score} / {maxMarks}
                    </p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                    <p className="text-lg">Total Applicants</p>
                    <p className="text-3xl font-bold text-green-400">
                        {rankDetails.totalApplicants.toLocaleString("en-IN")}
                    </p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                    <p className="text-lg">Percentile</p>
                    <p className="text-3xl font-bold text-purple-400">
                        {rankDetails.percentile}%
                    </p>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                    <p className="text-lg">Category</p>
                    <p className="text-3xl font-bold text-pink-400">
                        {rankDetails.category}
                    </p>
                </div>
            </div>

            {rankDetails.qualifiedForAdvanced ? (
                <div className="mt-8 bg-green-900 p-4 rounded-lg inline-block">
                    <p className="text-xl font-bold text-green-400">
                        Congratulations! You've qualified for {advancedName}!
                    </p>
                </div>
            ) : (
                <div className="mt-8 bg-red-900 p-4 rounded-lg inline-block">
                    <p className="text-xl font-bold text-red-400">
                        You'll need to improve to qualify for {advancedName} next time.
                    </p>
                </div>
            )}
        </div>
    )
}

export default HeroSectionRank