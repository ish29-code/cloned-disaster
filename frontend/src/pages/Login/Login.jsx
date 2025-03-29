import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000/api/auth";

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
      }

      if (data) {
        if (isLogin) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          setIsLogin(true);
          setError("Registration successful! Please login.");
          setEmail("");
          setPassword("");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="h-20"></div>
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6">
        <div className="relative w-full max-w-md">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          
          <div className="relative bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/30">
            {/* Toggle Buttons */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 p-1 rounded-xl">
                <button
                  className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isLogin 
                      ? "bg-white text-purple-600 shadow-md" 
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  className={`px-6 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    !isLogin 
                      ? "bg-white text-purple-600 shadow-md" 
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Register
                </button>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {isLogin ? "Welcome Back!" : "Create Account"}
            </h2>

            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50 transition-all duration-300"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50 transition-all duration-300"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50 transition-all duration-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-white text-purple-600 rounded-lg font-medium shadow-lg
                  hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLogin ? "Login" : "Create Account"
                )}
              </button>
            </form>

            {error && (
              <div className={`mt-4 p-4 rounded-lg ${error.includes('successful') ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
