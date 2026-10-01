import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Login({ darkMode }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login({ username, password });
    if (res.ok) navigate("/");
    else setError(res.error);
  };

  const inputClass = `w-full pl-11 pr-4 py-3 rounded-2xl border outline-none transition focus:ring-2 focus:ring-blue-500 ${
    darkMode
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-blue-50/40 border-blue-100 text-slate-900 placeholder-slate-400"
  }`;

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-10 ${
        darkMode ? "bg-gray-950 text-white" : "bg-[#eaf3fc] text-slate-900"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl shadow-xl p-7 sm:p-9 ${
          darkMode ? "bg-gray-900 border border-gray-800" : "bg-white"
        }`}
      >
        <div className="flex flex-col items-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl shadow-lg mb-3">
            <FaSignInAlt />
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Login to your Task Manager
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Username or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-2xl font-semibold shadow-lg transition hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-slate-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;