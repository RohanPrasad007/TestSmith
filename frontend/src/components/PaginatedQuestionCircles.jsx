import { useState, useEffect } from 'react';


export default function PaginatedQuestionCircles({
    filteredQuestions = [],
    currentQuestion = 0,
    isAnswered = () => false,
    navigateToQuestion = () => { },
    handlePrevious,
    handleNext,
    isReviewMode = false,
    userAnswers = {},
    selectedSubject = '',
    isAnswerCorrect = () => false
}) {
    const [visibleStartIndex, setVisibleStartIndex] = useState(0);

    // Number of circles to show at once
    const visibleCount = 5;

    // Update visible range when current question changes
    useEffect(() => {
        // If current question is outside visible range, adjust the range
        if (currentQuestion < visibleStartIndex) {
            setVisibleStartIndex(currentQuestion);
        } else if (currentQuestion >= visibleStartIndex + visibleCount) {
            setVisibleStartIndex(currentQuestion - visibleCount + 1);
        }
    }, [currentQuestion]);

    const visibleEndIndex = Math.min(visibleStartIndex + visibleCount - 1, filteredQuestions.length - 1);

    // Calculate which questions to show
    const visibleQuestions = [];
    for (let i = visibleStartIndex; i <= visibleEndIndex; i++) {
        visibleQuestions.push(i);
    }

    // Determine the button color class based on the mode and question state
    const getButtonColorClass = (index) => {
        if (isReviewMode) {
            const userAnswer = userAnswers[`${selectedSubject}-${index}`];
            const isCorrect = userAnswer !== undefined && isAnswerCorrect(filteredQuestions[index], userAnswer);
            const isWrong = userAnswer !== undefined && !isCorrect;

            if (currentQuestion === index) return 'border-2 border-white';
            if (isCorrect) return 'border-2 border-green-600';
            if (isWrong) return 'border-2 border-red-600';
            if (isAnswered(index)) return 'bg-gray-600';
            return 'bg-gray-700';
        } else {
            // Original question paper mode
            if (currentQuestion === index) return 'border border-blue-600';
            if (isAnswered(index)) return 'border border-green-600';
            return 'bg-black/15';
        }
    };

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-4 sm:mb-6 w-full max-w-full sm:max-w-xl mx-auto px-2">
            {/* Previous button - smaller on mobile */}
            <button
                onClick={handlePrevious}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/15 flex items-center justify-center flex-shrink-0"
            >
                <img src='/arrow2.png' className='w-3 h-3 sm:w-4 sm:h-4' alt="Previous" />
            </button>

            {/* Question circles - adaptive sizing and wrapping */}
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 overflow-y-auto max-h-24 sm:max-h-none">
                {visibleQuestions.map((index) => (
                    <button
                        key={index}
                        onClick={() => navigateToQuestion(index)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-xs sm:text-sm md:text-base 
                rounded-full flex items-center justify-center ${getButtonColorClass(index)}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Next button - smaller on mobile */}
            <button
                onClick={handleNext}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/15 flex items-center justify-center flex-shrink-0"
            >
                <img src='/arrow.png' className='w-3 h-3 sm:w-4 sm:h-4' alt="Next" />
            </button>
        </div>
    );
}