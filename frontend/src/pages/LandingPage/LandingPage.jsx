import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Navbar spacer */}
        <div className="h-20"></div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text 
                bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                DisasterWatch
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Your comprehensive platform for real-time disaster monitoring and management.
                Stay informed, stay prepared, and help communities in need.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full 
                  text-lg font-medium transform hover:scale-105 transition-all duration-300 
                  hover:shadow-lg hover:shadow-purple-500/25 w-full sm:w-auto
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                  focus:ring-offset-purple-900"
              >
                Get Started
              </Link>
              <Link
                to="/map"
                className="px-8 py-4 bg-white/10 text-white rounded-full text-lg font-medium
                  backdrop-blur-lg hover:bg-white/20 transform hover:scale-105 transition-all 
                  duration-300 w-full sm:w-auto focus:outline-none focus:ring-2 
                  focus:ring-white/50"
              >
                View Map
              </Link>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto px-4">
              <FeatureCard
                title="Real-time Monitoring"
                description="Get instant updates on disasters happening around the world with our advanced tracking system."
                icon="��"
              />
              <FeatureCard
                title="Interactive Maps"
                description="Visualize disaster-affected areas and relief operations with our interactive mapping tools."
                icon="🗺️"
              />
              <FeatureCard
                title="Community Support"
                description="Connect with communities and organizations to provide or receive assistance during critical times."
                icon="🤝"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10
    hover:bg-white/10 transform hover:scale-105 transition-all duration-300">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

export default LandingPage;
