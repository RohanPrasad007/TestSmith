import React from 'react'

const ExamSelection = ({ handleDropdown, Hide, fetchJEEQuestions, fetchNEETQuestions }) => {
    return (
        <div className='flex justify-center w-full mt-[10%] h-[70%]'>
            <div className='w-1/2'>
                <button id="dropdownDefaultButton" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-4 text-center inline-flex justify-center items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full " onClick={handleDropdown} type="button">
                    Start Mock Test <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>
                <div id="dropdown" className={`z-10 ${Hide} block mt-6 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-full dark:bg-gray-700 `}>
                    <ul className="py-2 text-xl text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                        <li>
                            <button onClick={fetchJEEQuestions} className="block px-4 py-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left">JEE</button>
                        </li>
                        <li>
                            <button onClick={fetchNEETQuestions} className="block px-4 py-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left">NEET</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ExamSelection