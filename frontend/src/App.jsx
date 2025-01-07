import React from "react";
import { Routes, Route } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";

// Pages
import HomePage from "../pages/Homepage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import EmailVerificationPage from "../pages/EmailVerificationPage";

const App = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-green-100 to-green-300 flex items-center justify-center">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />
      </Routes>
    </div>
  );
};

export default App;
