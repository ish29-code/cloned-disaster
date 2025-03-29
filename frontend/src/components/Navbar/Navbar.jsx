import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-100 via-yellow-50 to-white text-blue-700 shadow-md p-4 flex items-center justify-between rounded-b-lg relative">
      {/* Left Side - Branding */}
      <div className="text-2xl font-extrabold text-yellow-600">My App</div>

      {/* Hamburger Icon (Mobile) */}
      <button
        className="md:hidden text-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex flex-1 justify-center space-x-8 text-lg">
        <NavLink to="/" currentPath={location.pathname}>Home</NavLink>
        {isAuthenticated && <NavLink to="/dashboard" currentPath={location.pathname}>Dashboard</NavLink>}
        {isAuthenticated && <NavLink to="/map" currentPath={location.pathname}>Map</NavLink>}
      </div>

      {/* Right Side - Login/Logout */}
      <div className="hidden md:block">
        {isAuthenticated ? (
          <button 
            onClick={onLogout} 
            className="bg-yellow-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-yellow-600 transition duration-300"
          >
            Logout
          </button>
        ) : (
          <Link 
            to="/login" 
            className="bg-blue-400 text-white px-5 py-2 rounded-full shadow-md hover:bg-blue-500 transition duration-300"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-5 flex flex-col space-y-4 md:hidden">
          <NavLink to="/" currentPath={location.pathname} onClick={() => setIsOpen(false)}>Home</NavLink>
          {isAuthenticated && <NavLink to="/dashboard" currentPath={location.pathname} onClick={() => setIsOpen(false)}>Dashboard</NavLink>}
          {isAuthenticated && <NavLink to="/map" currentPath={location.pathname} onClick={() => setIsOpen(false)}>Map</NavLink>}
          
          <div>
            {isAuthenticated ? (
              <button 
                onClick={() => { setIsOpen(false); onLogout(); }}
                className="w-full bg-yellow-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-yellow-600 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="w-full bg-blue-400 text-white px-5 py-2 rounded-full shadow-md hover:bg-blue-500 transition duration-300 block text-center"
                onClick={() => setIsOpen(false)}
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

// Custom NavLink Component
const NavLink = ({ to, children, currentPath, onClick }) => (
  <Link 
    to={to} 
    className={`hover:text-yellow-500 transition duration-300 block md:inline ${
      currentPath === to ? "text-black font-semibold" : "text-gray-800"
    }`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;



