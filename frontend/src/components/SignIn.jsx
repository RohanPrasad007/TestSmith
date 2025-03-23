import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { showToast } from '../utils/toast';

const SignIn = () => {
  const { signInWithGoogle, checkIfUserExists } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      const result = await signInWithGoogle();
      const userExists = await checkIfUserExists(result.user.uid);

      // Navigate regardless of whether user exists or not
      navigate('/start-mock-test');
    } catch (error) {
      setError('Failed to sign in with Google');
      showToast.error('Failed to sign in with Google');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen text-white flex justify-center items-center w-full bg-gradient-to-br from-[#0A0A0B] via-[#110D1A] to-[#090015] overflow-hidden relative p-4">
      {/* Background glow effect */}
      <div className="w-full md:w-[800px] h-[700px] absolute right-0 md:right-[12%] top-[-20%] rounded-full 
                bg-[#441d85] bg-opacity-70
                shadow-[0_0_800px_10px_rgba(122,47,249,0.8)] 
                backdrop-blur-md border-none outline-none blur-[300px]" />

      <div className="bg-black/10 backdrop-blur-md rounded-md w-screen h-screen absolute" />

      {/* Main container */}
      <div className="bg-white/5 backdrop-blur-sm rounded-md w-full max-w-xl lg:w-[80%] md:max-w-4xl h-auto p-6 md:p-10 flex flex-col md:flex-row gap-10 z-10 shadow-[0_0_1.4px_rgba(255,255,255,1)]">
        {/* Left side - Sign in content */}
        <div className='w-full md:w-[50%] flex flex-col gap-6 mb-8 md:mb-0'>
          <div>
            <p className="text-3xl md:text-5xl font-bold text-white">Sign In</p>
            <p className="mb-2.5 mt-2.5 font-normal text-zinc-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="appearance-none px-5 border rounded-lg backdrop-blur-2xl text-white h-[52px] w-full border-[#727DA1]/20 bg-[#727DA1]/10 placeholder:text-neutral-300 flex justify-center items-center"
            type="submit"
          >
            <span className="mr-2">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 48 48"
                enableBackground="new 0 0 48 48"
                className="h-5 w-5"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
    c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
    c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
    C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
    c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
    c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
            </span>
            <span>Sign in with Google</span>
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Right side - Image */}
        <div className="w-full md:w-[400px] h-64 md:h-auto bg-black flex justify-center items-center rounded-lg border-2 border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.8)] p-4 md:p-8 relative">
          <img src="/SignInIcon.png" className="w-full h-full object-contain" alt="Sign in" />

          {/* Image with Overlapping Text */}
          <div className="absolute left-[197px] top-[-51px] hidden md:block">
            <img src="/comment.png" className="w-full h-[200px]" />
          </div>
        </div>


      </div>
    </div>
  );
};

export default SignIn;