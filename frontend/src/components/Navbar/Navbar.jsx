import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FaExclamationTriangle, FaHome, FaMap, FaSignInAlt, FaSignOutAlt, FaGlobeAmericas } from 'react-icons/fa';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle navbar transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-gradient-to-r from-blue-900/95 via-indigo-900/95 to-blue-900/95 shadow-lg" 
        : "bg-gradient-to-r from-blue-900/70 via-indigo-900/70 to-blue-900/70 backdrop-blur-md"
    } border-b border-blue-700/30`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <FaGlobeAmericas className="text-2xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
              <span className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                DisasterWatch
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center px-3 py-2 text-gray-200 rounded-md transition-all duration-300 ${
                    location.pathname === "/"
                      ? "bg-blue-700/40 text-white font-medium"
                      : "hover:bg-blue-800/30 hover:text-white"
                  }`}
                >
                  <FaHome className="mr-2" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/map"
                  className={`flex items-center px-3 py-2 text-gray-200 rounded-md transition-all duration-300 ${
                    location.pathname === "/map"
                      ? "bg-blue-700/40 text-white font-medium"
                      : "hover:bg-blue-800/30 hover:text-white"
                  }`}
                >
                  <FaMap className="mr-2" />
                  <span>Map</span>
                </Link>
              </>
            ) : null}
            <Link
              to="/emergency"
              className={`flex items-center px-4 py-2 text-white rounded-md transition-all duration-300 ${
                location.pathname === "/emergency"
                  ? "bg-red-600 shadow-md"
                  : "bg-red-500/90 hover:bg-red-600 shadow hover:shadow-md"
              }`}
            >
              <FaExclamationTriangle className="mr-2" />
              <span>Emergency</span>
            </Link>
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-gray-200 border border-blue-700/50 rounded-md transition-all duration-300 hover:bg-blue-800/30 hover:text-white"
              >
                <FaSignOutAlt className="mr-2" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className={`flex items-center px-4 py-2 text-white rounded-md transition-all duration-300 ${
                  location.pathname === "/login"
                    ? "bg-blue-600 shadow-md"
                    : "bg-blue-500/90 hover:bg-blue-600 shadow hover:shadow-md"
                }`}
              >
                <FaSignInAlt className="mr-2" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:bg-blue-800/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-blue-900/90 to-indigo-900/90 backdrop-blur-md border-t border-blue-700/30 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-md transition-all duration-300 ${
                    location.pathname === "/"
                      ? "bg-blue-700/40 text-white"
                      : "text-gray-200 hover:bg-blue-800/30 hover:text-white"
                  }`}
                >
                  <FaHome className="mr-3" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/map"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-3 text-base font-medium rounded-md transition-all duration-300 ${
                    location.pathname === "/map"
                      ? "bg-blue-700/40 text-white"
                      : "text-gray-200 hover:bg-blue-800/30 hover:text-white"
                  }`}
                >
                  <FaMap className="mr-3" />
                  <span>Map</span>
                </Link>
              </>
            ) : null}
            <Link
              to="/emergency"
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 text-base font-medium text-white rounded-md transition-all duration-300 ${
                location.pathname === "/emergency"
                  ? "bg-red-600 shadow-md"
                  : "bg-red-500/90 hover:bg-red-600"
              }`}
            >
              <FaExclamationTriangle className="mr-3" />
              <span>Emergency</span>
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center px-4 py-3 text-base font-medium text-gray-200 rounded-md border border-blue-700/50 hover:bg-blue-800/30 hover:text-white transition-all duration-300"
              >
                <FaSignOutAlt className="mr-3" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 text-base font-medium text-white rounded-md transition-all duration-300 ${
                  location.pathname === "/login"
                    ? "bg-blue-600 shadow-md"
                    : "bg-blue-500/90 hover:bg-blue-600"
                }`}
              >
                <FaSignInAlt className="mr-3" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop NavLink Component
const NavLink = ({ to, children, currentPath }) => (
  <Link
    to={to}
    className={`relative text-sm font-medium transition-all duration-300 ${
      currentPath === to
        ? "text-white"
        : "text-gray-300 hover:text-white"
    }`}
  >
    {children}
    <span
      className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transform origin-left transition-transform duration-300 ${
        currentPath === to ? "scale-x-100" : "scale-x-0"
      }`}
    />
  </Link>
);

// Mobile NavLink Component
const MobileNavLink = ({ to, children, currentPath, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
      currentPath === to
        ? "bg-white/10 text-white"
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    }`}
  >
    {children}
  </Link>
);

export default Navbar;



