import React, { useState } from "react";
import { motion } from "framer-motion";
import { authStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../src/components/Input";
import { Lock } from "lucide-react";
import Button from "../src/components/Button";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {
    resetPassword,
    isResetPasswordLoading,
    resetPasswordMessage,
    resetPasswordError,
  } = authStore();
  // 접속된 URL = token
  const { token } = useParams();
  const navigate = useNavigate();

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    try {
      await resetPassword(token, password);
      console.log("Password has been changed successfully ✅");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(
        "FAILED TO CHANGE THE PASSWORD",
        error?.resposne?.data?.message
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Reset Password
        </h2>
        {resetPasswordError && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        {resetPasswordMessage && (
          <p className="text-green-500 text-sm mb-4">{resetPasswordMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {password !== confirmPassword ? (
            <p className="text-red-200">
              Please match the Password and Confirm Message
            </p>
          ) : (
            <p className="text-green-200">Matched</p>
          )}
          <Button
            text={isResetPasswordLoading ? "Resetting..." : "Set New Password"}
            disabledCondition={isResetPasswordLoading}
          />
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordPage;
