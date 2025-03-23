import React from 'react'

const ExamSelection = ({ handleDropdown, Hide, fetchJEEQuestions, fetchNEETQuestions }) => {
    return (
        <div className='flex justify-center h-full'>

            <div className='w-full flex flex-col gap-10'>
                <div className=' text-3xl font-semibold w-full flex justify-center '>
                    Ready to Test Your Skills?
                </div>
                <div className='w-full flex flex-col justify-between h-full'>
                    <button id="dropdownDefaultButton" className="text-white bg-[#6028b9]   font-medium rounded-lg text-xl px-5 py-4 text-center inline-flex justify-center items-center  border-2  border-gray-400  w-full drop-shadow-lg" onClick={handleDropdown} type="button">
                        Start Mock Test<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <div id="dropdown" className={`z-10 ${Hide} block mt-6  divide-y divide-gray-100 rounded-lg shadow-sm w-full h-full bg-white bg-opacity-[10px] border-[1px] border-gray-800`}>
                        <ul className=" text-xl text-gray-700 dark:text-gray-200 flex gap-10 flex-col h-full p-10" aria-labelledby="dropdownDefaultButton">
                            <li>
                                <button id="dropdownDefaultButton" className="appearance-none px-5 border rounded-lg backdrop-blur-2xl text-white h-[52px] w-full max-w-[500px] sm:max-w-full sm:w-full border-[#727DA1]/20 bg-[#727DA1]/10 placeholder:text-neutral-300 flex justify-center  items-center " onClick={fetchJEEQuestions} type="button">
                                    JEE
                                </button>
                            </li>
                            <li>
                                <button id="dropdownDefaultButton" className="appearance-none px-5 border rounded-lg backdrop-blur-2xl text-white h-[52px] w-full max-w-[500px] sm:max-w-full sm:w-full border-[#727DA1]/20 bg-[#727DA1]/10 placeholder:text-neutral-300 flex justify-center  items-center" onClick={fetchNEETQuestions} type="button">
                                    NEET
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default ExamSelection