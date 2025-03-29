import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-white text-center p-6">
      
      <h1 className="text-5xl font-extrabold text-blue-800 drop-shadow-lg">
        Welcome to My App 🚀
      </h1>
      
      <p className="text-gray-700 mt-3 text-lg max-w-lg">
        Your one-stop solution for seamless and intelligent disaster management.
        Stay updated, stay safe. 🌍
      </p>

      <Link
        to="/dashboard"
        className="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md text-lg font-medium 
        hover:bg-yellow-600 transition duration-300"
      >
        Get Started
      </Link>
    </div>
  );
};

export default LandingPage;
