import { Link, useLocation } from "react-router-dom";
import { FaHome, FaPlus, FaMoon, FaSun, FaSearch } from "react-icons/fa";

function Navbar({
  darkMode,
  setDarkMode,
  search,
  setSearch,
}) {
  const location = useLocation();

  return (
    <nav
      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl mb-8 border shadow-sm ${
        darkMode
          ? "bg-gray-900 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Left Side */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            location.pathname === "/"
              ? "bg-purple-600 text-white"
              : darkMode
              ? "text-gray-300 hover:bg-gray-800"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaHome />
          Home
        </Link>

        <Link
          to="/add"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            location.pathname === "/add"
              ? "bg-purple-600 text-white"
              : darkMode
              ? "text-gray-300 hover:bg-gray-800"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaPlus />
          Add Task
        </Link>
      </div>

      {/* Search Bar */}
      {location.pathname === "/" && (
        <div className="flex-1 max-w-md relative">
          <FaSearch
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />

          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 placeholder-gray-400 focus:border-purple-500"
                : "bg-white text-black border-gray-300 placeholder-gray-500 focus:border-purple-500"
            }`}
          />
        </div>
      )}

      {/* Dark / Light Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition shrink-0 ${
          darkMode
            ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
        }`}
      >
        {darkMode ? <FaSun /> : <FaMoon />}

        <span className="hidden sm:block">
          {darkMode ? "Light" : "Dark"}
        </span>
      </button>
    </nav>
  );
}

export default Navbar;
