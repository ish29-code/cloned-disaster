import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              DisasterWatch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" currentPath={location.pathname}>
              Home
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" currentPath={location.pathname}>
                  Dashboard
                </NavLink>
                <NavLink to="/map" currentPath={location.pathname}>
                  Map
                </NavLink>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white
                  transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white
                  transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <MobileNavLink
              to="/"
              currentPath={location.pathname}
              onClick={() => setIsOpen(false)}
            >
              Home
            </MobileNavLink>
            {isAuthenticated && (
              <>
                <MobileNavLink
                  to="/dashboard"
                  currentPath={location.pathname}
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </MobileNavLink>
                <MobileNavLink
                  to="/map"
                  currentPath={location.pathname}
                  onClick={() => setIsOpen(false)}
                >
                  Map
                </MobileNavLink>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                Login
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



