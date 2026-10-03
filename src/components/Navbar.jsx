import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  FaHome,
  FaPlus,
  FaMoon,
  FaSun,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Navbar({ darkMode, setDarkMode, search, setSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold transition ${
      location.pathname === path
        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
        : darkMode
        ? "text-gray-300 hover:bg-white/10"
        : "text-slate-700 hover:bg-white/70"
    }`;

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-40 border-b shadow-lg backdrop-blur-xl ${
        darkMode
          ? "bg-gray-900/70 border-white/10"
          : "bg-white/60 border-white/70"
      }`}
    >
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-3 sm:px-4 py-3">
      {/* Left */}
      <div className="flex items-center gap-2 shrink-0">
        {isAuthenticated ? (
          <>
            <Link
              to="/"
              className="hidden lg:flex items-center gap-2 mr-3 font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm shadow-md">
                ✓
              </span>
              TaskFlow
            </Link>
            <Link to="/" className={linkClass("/")}>
              <FaHome /> <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/add" className={linkClass("/add")}>
              <FaPlus /> <span className="hidden sm:inline">Add Task</span>
            </Link>
          </>
        ) : (
          <Link to="/" className="text-lg font-bold text-blue-500">
            Task Manager
          </Link>
        )}
      </div>

      {/* Search */}
      {isAuthenticated && location.pathname === "/" && (
        <div className="flex-1 max-w-md relative">
          <FaSearch
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-slate-400"
            }`}
          />
          <input
            type="text"
            placeholder="Search task..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 placeholder-gray-500 focus:border-blue-500"
                : "bg-blue-50/50 text-slate-900 border-blue-100 placeholder-slate-400 focus:border-blue-500"
            }`}
          />
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition ${
            darkMode
              ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
              : "bg-blue-50 text-slate-700 hover:bg-blue-100"
          }`}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold flex items-center justify-center shadow-md hover:scale-105 transition"
              title={user.username}
            >
              {user.username.charAt(0).toUpperCase()}
            </button>

            {menuOpen && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-2xl shadow-xl border overflow-hidden z-50 ${
                  darkMode
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-blue-100"
                }`}
              >
                <div
                  className={`px-4 py-3 border-b ${
                    darkMode ? "border-gray-800" : "border-blue-50"
                  }`}
                >
                  <p className="font-semibold text-sm truncate">
                    {user.username}
                  </p>
                  <p
                    className={`text-xs truncate ${
                      darkMode ? "text-gray-400" : "text-slate-500"
                    }`}
                  >
                    {user.email}
                  </p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
                    darkMode ? "hover:bg-gray-800" : "hover:bg-blue-50"
                  }`}
                >
                  <FaUserCircle /> Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 transition ${
                    darkMode ? "hover:bg-gray-800" : "hover:bg-red-50"
                  }`}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-slate-600 hover:bg-blue-50"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 shadow-md transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
    </nav>
    {/* spacer: fixed navbar ki height ke barabar jagah */}
    <div className="h-[72px]" />
    </>
  );
}

export default Navbar;