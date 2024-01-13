import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../partials/ThemeToggle';
import auth from '../../../backend/routes/firebase.config';  // Updated import statement
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';




const LandingPageForm = () => {
  const [userAuth, setUserAuth] = useState({
    mobile_no: "",
    user_pass: "",
  });
  const [loading, setLoading] = useState(false); // New state for loading indicator

  const [isSuccess, setIsSuccess] = useState(false); 
  const successTimeoutRef = useRef(null);
  const FailedTimeoutRef = useRef(null);
  const [Many_Request, setManyRequest] = useState(false);
  const [wrong_otp, setWrongOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [verification_code, setVerificationCode] = useState(""); // Added state for verification code
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const { mobile_no, user_pass } = userAuth;
  const [loginError, setLoginError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const otpInputRefs = useRef(Array.from({ length: 6 }, () => React.createRef()));

  useEffect(() => {
    // Focus on the first input when the component mounts
    if (otpInputRefs.current[0].current) {
      otpInputRefs.current[0].current.focus();
    }
  }, []);

  const handleOtpInputChange = (index, value) => {
    const newOtpDigits = [...otpDigits];
  
    // If the input value is empty and Backspace is pressed, move focus to the previous input
    if (value === '' && index > 0 && otpInputRefs.current[index - 1].current) {
      otpInputRefs.current[index - 1].current.focus();
    } else {
      // Move focus to the next input if the current input is not empty
      if (index < otpDigits.length - 1 && otpInputRefs.current[index + 1].current) {
        otpInputRefs.current[index + 1].current.focus();
      }
    }
  
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
  
    // Update the verification_code state
    const newVerificationCode = newOtpDigits.join('');
    setVerificationCode(newVerificationCode);
  };

  const handleKeyDown = (index, e) => {
    // Handle Backspace key to prevent browser navigation
    if (e.key === 'Backspace' && index > 0 && otpInputRefs.current[index - 1].current) {
      e.preventDefault();

      // Clear the value of the current input and move focus to the previous input
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = '';
      setOtpDigits(newOtpDigits);

      otpInputRefs.current[index - 1].current.focus();
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mobile_no') {
      const rawValue = value.replace('+63 ', '');
      const formattedValue = rawValue.replace(/\D/g, '');
      setUserAuth((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setUserAuth((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleVerificationSubmit = async () => {
    try {
      setLoading(true);
      console.log("Verification process started...");
      // Assuming confirmationResult is declared and set elsewhere in your component
      const codeConfirmation = await confirmationResult.confirm(verification_code);
      console.log("User signed in successfully:", codeConfirmation.user);
      navigate(`/home/${userAuth.user_id}`);
      console.log(verification_code);
      // Now you can update the state or perform any other actions as needed
    } catch (error) {
      console.error("Error verifying code:", error);
      if (error.code === "auth/invalid-verification-code") {
        // Resend verification code or take appropriate action
        console.log("Resending verification code...");
        console.log(verification_code);
        // Implement code resend logic here
      }
    }finally {
      setLoading(false);
      console.log("Verification process completed.");
      setWrongOtp(true);
    }
  };

  const onCaptchaVerify = () => {
    if (!window.recaptchaVerifier) {
      const recaptchaOptions = {
        size: 'invisible',
        callback: (response) => onSignup(response),
        expiredCallback: () => console.log('Recaptcha expired'),
      };
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', recaptchaOptions);
    }
    window.recaptchaVerifier.verify().catch((error) => {
      console.error('Error verifying reCAPTCHA:', error);
    });
  };

  const onSignup = async (recaptchaToken) => {
    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = `+63${userAuth.mobile_no}`;
  
    try {
      // Only proceed with SMS verification if reCAPTCHA verification is successful
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier, recaptchaToken);
      window.confirmationResult = confirmationResult;
      setIsSuccess(true);
      successTimeoutRef.current = setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    } catch (error) {
      console.error('Error signing in:', error);
      if (error.code === 'auth/too-many-requests') {
        console.log('Too many requests');
        setManyRequest(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8800/login/${userAuth.mobile_no}/${user_pass}`);
      if (response.data[0].mobile_no === userAuth.mobile_no && response.data[0].user_pass === userAuth.user_pass) {
        // Authentication successful, set authenticated state to true
        if (isSubmitting) {
          return;
        }
  
        try {
          setAuthenticated(true);
          // Extract user_id from the response data
          const { user_id } = response.data[0];
          // Update the user_id in the state
          setUserAuth((prev) => ({ ...prev, user_id }));
  
          // Check if mobile number and password match before triggering the OTP verification process
         if (!authenticated) {
            setIsSubmitting(true); // Set to true before calling onCaptchaVerify
            onCaptchaVerify(); // Call onCaptchaVerify directly
          }
        } catch (error) {
          // Handle errors specific to setting authenticated state and updating user_id
        }
      }
    } catch (error) {
      console.error(error);
      setLoginError("Authentication failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false); // Reset to false after handling submission
    }
  };
    
  return (
    <div className="relative lg:h-screen md:h-screen min-h-screen bg-[url('./src/images/manila-hd.png')] dark:bg-[url('./src/images/manila-v2.jpg')] bg-cover bg-no-repeat bg-top">
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Left Section */}
        <div className="md:w-1/2 flex items-center justify-center lg:mb-0 mb-5">
          <div className="text-center lg:pt-0 pt-20">
            <img
              src="./src/images/mnl.svg"
              alt="Centralized Manila Logo" className="lg:h-60 md:h-40 sm:h-28 h-28 mx-auto"
            />
            <span className="text-2xl text-white font-semibold tracking-wide">
              <span className="font-medium">Centralized </span>
              <span className="text-blue-500 text-shadow-[0_0px_4px_var(--tw-shadow-color)] shadow-blue-500/100">M</span>
              <span className="text-red-500 text-shadow-[0_0px_4px_var(--tw-shadow-color)] shadow-red-500/100">a</span>
              <span className="text-yellow-500 text-shadow-[0_0px_4px_var(--tw-shadow-color)] shadow-yellow-500/100">n</span>
              <span className="text-emerald-500 text-shadow-[0_0px_4px_var(--tw-shadow-color)] shadow-emerald-500/100">i</span>
              <span className="text-blue-500 text-shadow-[0_0px_4px_var(--tw-shadow-color)] shadow-blue-500/100">l</span>
              <span className="text-red-500 text-shadow-[0_0px_4px_var(--tw-shadow-color)] shadow-red-500/100">a</span>
            </span>
            
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex items-center justify-center lg:mx-auto mx-5">
          <div className="bg-white bg-opacity-95 lg:p-16 p-10 rounded-3xl shadow-lg">
            <h1 className='text-center mb-10 lg:text-lg text-md tracking-[.020em]'>
              <span className='font-medium text-slate-600'>"Maligayang pagdating, </span>
              <span className='font-bold text-blue-500'>Manileño!"</span>
            </h1>
            <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-1 md:gap-6">
            {!authenticated && (
            <div className="relative z-0 w-full lg:mb-0 mb-4 group">
              <input
                type="text"
                id="mobile_no"
                name="mobile_no"
                placeholder=' '
                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-400 appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 peer mobnum"
                value={`+63 ${userAuth.mobile_no}`}
                maxLength={14}
                onChange={handleChange}
              />
              <label htmlFor="mobile_no" className="peer-focus:font-medium appearance-none absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Mobile Number (+63)</label>
            </div>
            )}
            {!authenticated && (
            <div className="relative z-0 w-full mb-6 group">
             
              <input
                type="password"
                id="user_pass"
                name="user_pass"
                placeholder=' '
                className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-400 appearance-none text-black focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                value={userAuth.user_pass}
                onChange={handleChange}
              />
              <label htmlFor="user_pass" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            </div>
            )}
          </div>
          
          {!authenticated && (
          <div className="mt-4 flex justify-between font-semibold text-sm">
            <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
              <input
                className="mr-1.5 shrink-0 mt-0.5 border-2 border-gray-300 dark:border-gray-400 rounded bg-transparent text-emerald-600 pointer-events-none focus:ring-emerald-500"
                type="checkbox"
              />
              <span>Remember Me</span>
            </label>
            <a className="text-yellow-500 hover:text-blue-700 hover:text-yellow-600" href="#">Forgot Password?</a>
          </div>
                      )}
          <div className="text-center">
          {!authenticated && (
            <button
            className="text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-full text-sm px-10 py-2.5 text-center mb-2 mt-5 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          type="submit"
          disabled={isSubmitting}  // Disable the button if submitting
        >
          Login
        </button>
            )}
          {!authenticated && loginError && (
            <p className="text-red-600 p-2 text-xs rounded-full mt-5">{loginError}</p>
          )}
          </div>
          {!authenticated && (
          <div className="my-2 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold text-slate-500">Or</p>
          </div>
                    )}
          {!authenticated && (
          <div className="mt-4 text-sm text-slate-500 text-center">
            Don't have an account? <a className="text-emerald-500 font-bold hover:text-emerald-700" href="../register">Register Here!</a>
          </div>
          )}
          <div id="recaptcha-container"></div>

          {isSuccess && (
            <div className="text-emerald-700 md:text-sm text-xs bg-emerald-200 text-center rounded-full py-1.5 mb-5">
              Success! Your SMS has been sent.
            </div>
          )}

          {Many_Request && (
            <div className="text-red-700 md:text-sm text-xs bg-red-200 text-center rounded-full px-1.5 py-1.5 mb-5">
                Too Many Request please try again Later.
              </div>
            )}  
          
          {wrong_otp && (
            <div className="text-red-700 md:text-sm text-xs bg-red-200 text-center rounded-full px-1.5 py-1.5 mb-5">
                Wrong OTP Re-Type Again.
              </div>
            )} 

          {/* VERIFICATION PROCESS */}
          {authenticated && (
            <>
              <div className="grid grid-cols-1 items-center justify-items-center gap-4">

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                  <path className='fill-yellow-500' fillRule="evenodd" d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H12Z" clipRule="evenodd" />
                </svg>

                <div className="text-center text-sm font-medium text-slate-600">
                  Enter the OTP sent to your number
                </div>

                {/* OTP Input Boxes */}
                <div className="flex justify-center space-x-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-10 text-center border border-gray-300 rounded-lg dark:border-slate-400 dark:text-slate-700 bg-transparent"
                    ref={otpInputRefs.current[index]}
                  />
                ))}
              </div>

                {/* Verify Button */}
                <div className="text-center">
                  {loading ? (
                    <div className="spinner-border text-blue-500" role="status">
                      <span className="visually-hidden">Verifying...</span>
                    </div>
                  ) : (
                    <button
                      className="w-full text-blue-500 hover:text-white border border-blue-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-full text-sm px-10 py-2 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800 uppercase"
                      onClick={handleVerificationSubmit}
                    >
                      Verify
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

            </form>

            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="md:absolute relative bottom-0 w-full text-center text-sm text-gray-500 py-3 drop-shadow-xl">
          Copyright &copy; {new Date().getFullYear()} |
          <a href="/indexadmin" className='hover:text-white'>
            <span className="hover:font-medium hover:text-blue-500"> B</span>
            <span className="hover:font-medium hover:text-blue-500">S</span>
            <span className="hover:font-medium hover:text-yellow-500">I</span>
            <span className="hover:font-medium hover:text-purple-500">T</span>
            <span className="hover:font-medium hover:text-emerald-500"> 4</span>
            <span className="hover:font-medium hover:text-red-500">B</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default LandingPageForm;