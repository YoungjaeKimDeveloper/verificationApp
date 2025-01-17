import { useState } from "react";
import { motion } from "framer-motion";
import Input from "../src/components/Input";
import { UserRound, Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../src/components/PasswordStrengthMeter";
import { authStore } from "../store/authStore";

const SignupPage = () => {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { signup, isSignupLoading } = authStore();
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const success = await signup(signupInfo);
      setSignupInfo({
        name: "",
        email: "",
        password: "",
      });
      if (success) {
        navigate("/email-verification");
      }
    } catch (error) {
      console.error("FAILED TO SIGN UP", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>
        <form onSubmit={handleSignUp}>
          <Input
            icon={UserRound}
            type="text"
            placeholder="Full Name"
            value={signupInfo.name}
            onChange={(e) =>
              setSignupInfo((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email@gmail.com"
            value={signupInfo.email}
            onChange={(e) =>
              setSignupInfo((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="********"
            value={signupInfo.password}
            onChange={(e) =>
              setSignupInfo((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          {/* Password strength meter */}
          <PasswordStrengthMeter password={signupInfo.password} />
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200 items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSignupLoading}
          >
            {isSignupLoading ? (
              <Loader className="animate-spin m-auto" />
            ) : (
              <p>signup</p>
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center text-center items-center">
        <Link to="/login">
          <p className="text-sm text-gray-400">Already Have an account?</p>
        </Link>
      </div>
    </motion.div>
  );
};

export default SignupPage;
