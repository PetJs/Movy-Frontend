import axiosInstance from '@/api/axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Apple from "../assets/svg/apple.svg";
import Google from "../assets/svg/googlr.svg";
import Facebook from "../assets/svg/faceboook.svg";
import Logo from "../assets/svg/logo.svg";
import { PopUp } from '@/assets/component/popUp';

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showSuccessPopUp, setShowSuccessPopUp] = useState<boolean>(false);
  const [showErrorPopUp, setShowErrorPopUp] = useState<boolean>(false);
  const navigate = useNavigate();

  console.log(localStorage.getItem('userId'))

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (password.length < 8) {
      errors.password = 'Password must contain at least 8 characters';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    const loginData = {
      email,
      password,
    };

    try {
      const response = await axiosInstance.post('/login', loginData);

      if (response.status === 201) {
        setShowSuccessPopUp(true);
        setSuccess('Login successful');
        setError('');
        const userId = response.data.userId;
        localStorage.setItem('userId', userId);

        setTimeout(() => {
          setShowSuccessPopUp(false);
          navigate('/');
        }, 2000);
      } else {
        setShowErrorPopUp(true);
        setError('Unexpected response status.');
        localstorage.clear():
      }
    } catch (err) {
      setError('Login failed');
      localstorage.clear()
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#9C4AA099] via-[#3D1B3F99] via-[#1A0C1B99] to-[#00000099] text-black">
      <div className="flex">
        <img src={Logo} alt="Icon" className="mt-2 md:w-40 w-36" />
      </div>

      <div className="bg-[#FFFFFF33] h-auto mx-auto flex items-center justify-center rounded-lg shadow-lg md:mt-24 m-10 md:w-[60%]">
        <div className="w-full md:w-[95%] h-auto">
          <div className="w-full">
            <h1 className="text-2xl flex justify-center font-bold text-white mb-6 md:text-4xl text-3xl">Login</h1>

            <form onSubmit={handleLogin} className="text-white">
              <div className="grid gap-4 p-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-2 rounded-md w-full bg-[#B59DB6] border-none placeholder-white"
                  placeholder="Email "
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 rounded-md w-full bg-[#B59DB6] border-none placeholder-white"
                  placeholder="Min of 8 characters"
                />

                <div className="">
                  <button type="submit" className="flex bg-[#F7931D] justify-center mx-auto border-none w-[75%] p-1 rounded mb-2 font-semibold text-lg text-[#FFFFFF]">Login</button>
                </div>
              </div>
            </form>

            <div className="m-2">
              <div className="flex items-center m-2">
                <hr className="flex-grow border-gray-300" />
                <p className="px-2 text-[#FFFFFF] text-xl font-semibold">OR</p>
                <hr className="flex-grow border-gray-300" />
              </div>
              <p className="flex justify-center text-[#FFFFFF]">Continue With</p>
              <div className="flex justify-center gap-8">
                <img src={Apple} alt="Icon" className="h-10 w-10" />
                <img src={Google} alt="Icon" className="h-8 w-8" />
                <img src={Facebook} alt="Icon" className="h-8 w-8" />
              </div>

              <p className="mt-2">
                Don’t have an account? <Link to="/register"><span className="font-semibold text-[#F7931D] ml-2">Sign Up</span></Link>
              </p>
            </div>

            {showSuccessPopUp && <PopUp text={`${success} 🎊🎊`} />}
            {validationErrors && showErrorPopUp && <PopUp text={`${error} ❌❌`} />}

          </div>
        </div>
      </div>
    </div>
  );
}
