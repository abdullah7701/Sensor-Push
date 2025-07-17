import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    if (username === "chip" && password === "chip123") {
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#151c27] via-[#232946] to-[#232946] p-2 sm:p-8 relative">
      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-4 w-72 z-50 border border-pink-300 animate-slide-in">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold">Error:</span>
            <span className="text-gray-700 text-sm">Invalid credentials</span>
          </div>
        </div>
      )}

      {/* Phone model with login form inside */}
      <div className="animate-slide-up relative w-[320px] sm:w-[340px] h-[620px] sm:h-[680px] bg-[#181818] rounded-[54px] border-[8px] border-white/20 shadow-2xl flex flex-col items-center justify-start">
        {/* Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <div className="w-28 h-7 bg-black rounded-full shadow-lg flex items-center justify-center relative">
            {/* Camera (left) */}
            <div className="w-4 h-4 bg-[#222] rounded-full absolute left-4 top-1.5 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#4f8cff] rounded-full" />
            </div>
            {/* Sensor (right) */}
            <div className="w-2.5 h-2.5 bg-[#222] rounded-full absolute right-6 top-2"></div>
          </div>
        </div>
        {/* Time and Date */}
        <div className="mt-16 mb-7 text-center select-none">
          <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#8bc6ec] via-[#7f8fdc] to-[#6a82fb] drop-shadow-md" style={{ letterSpacing: "2px" }}>
            {formattedTime}
          </div>
          <div className="text-base text-white/70 mt-1 font-medium">{formattedDate}</div>
        </div>
        {/* Login Form (smaller, inside phone) */}
        <div className="w-full flex-1 flex flex-col items-center justify-center px-3">
          <div className="w-full max-w-[250px] bg-gradient-to-br from-white/20 via-[#f7eefa]/40 to-white/10 backdrop-blur-[8px] rounded-2xl shadow-xl px-5 py-6 border border-white/20 flex flex-col gap-4">
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 bg-white/20 text-black placeholder-white/70 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 font-sans text-lg"
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 bg-white/20 text-black placeholder-white/70 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 font-sans text-lg"
            />
            <button
              onClick={handleLogin}
              className="w-9 h-9 flex items-center justify-center bg-white/25 hover:bg-white/40 rounded-full text-[#2b2c3a] transition-all duration-300 ml-auto shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-2 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
}