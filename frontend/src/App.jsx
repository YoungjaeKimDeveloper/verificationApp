import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import { Toaster } from "react-hot-toast";
// Pages
import HomePage from "../pages/Homepage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import EmailVerificationPage from "../pages/EmailVerificationPage";
// Auth
import { authStore } from "../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = authStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  console.log("IS USER VERIFIED?", user?.isVerified);
  if (!user?.isVerified) {
    return <Navigate to="/email-verification" />;
  }
  return children;
};

const getEmailVerificationElement = () => {
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isVerified) return <Navigate to="email-verification" />;
  return <Navigate to="/" replace />;
};

const App = () => {
  const { isCheckingAuth, checkAuth, user, isAuthenticated } = authStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }
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
      {/* Setting Routes */}
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="login" />}
        />
        <Route
          path="/Signup"
          element={!user ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route path="/login" element={!user ? <LoginPage /> : <HomePage />} />
        {/* <Route
          path="/email-verification"
          element={getEmailVerificationElement}
        /> */}
        <Route
          path="/email-verification"
          element={
            !user ? (
              <Navigate to="/" />
            ) : !user?.isVerified ? (
              <EmailVerificationPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
