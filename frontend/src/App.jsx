import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </div>
  );
};

export default App;
