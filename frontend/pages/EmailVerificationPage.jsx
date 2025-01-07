import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EmailVerificationPage = () => {
  // 6 digits
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  // Tracking the Inputs
  const inputRefs = useRef([]);
  //   After user inputs 6 digits
  const naviagte = useNavigate();

  //   Hard Coding
  const error = false;
  const isLoading = false;

  const handleChange = (index, value) => {
    // 기존에 있던 6 자리 코드 풀어주기
    const newCode = [...code];

    // 붙여넣기로 값을 넣었을경우
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        // 붙여넣기 한 코드 잘라서 넣어주기 없으면 "" (공백으로 넣어주기)
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      // Focus on the last non-empty input or first empty one
      //   마지막 조건 찾는 Index
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      // Move foucs to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  //   제출할때는 코드 합쳐서 내주기
  const handleSubmit = (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    alert(`Verificaiton code submiited:  ${verificationCode}`);
  };
  // Auto Submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>
        <form className="space-y-6 ">
          <div className="">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 flex flex-col items-center justify-center bg-green-200 p-4"
            >
              <div className="flex justify-between gap-x-2 ">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="6"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-500 font-semibold mt-2">{error}</p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading || code.some((digit) => !digit)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </motion.button>
            </form>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
