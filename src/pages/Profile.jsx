import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaTrash,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function Profile({ darkMode, setDarkMode }) {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDelete = () => {
    deleteAccount();
    navigate("/register");
  };

  const cardBg = darkMode
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-blue-100";

  return (
    <div
      className={`min-h-screen px-3 sm:px-4 py-6 sm:py-10 ${
        darkMode ? "bg-gray-950 text-white" : "bg-[#eaf3fc] text-slate-900"
      }`}
    >
      <div className="w-full max-w-3xl mx-auto">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className={`rounded-3xl border p-6 sm:p-8 shadow-sm ${cardBg}`}>
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 text-white text-3xl font-bold flex items-center justify-center shadow-lg mb-4">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-400" : "text-slate-500"
              }`}
            >
              {user.email}
            </p>
          </div>

          <div
            className={`mt-8 divide-y rounded-2xl border ${
              darkMode ? "divide-gray-800 border-gray-800" : "divide-blue-50 border-blue-100"
            }`}
          >
            <div className="flex items-center gap-4 px-5 py-4">
              <FaUserCircle className="text-blue-500" />
              <div className="text-sm">
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-slate-500"}`}>
                  Username
                </p>
                <p className="font-semibold">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-5 py-4">
              <FaEnvelope className="text-blue-500" />
              <div className="text-sm">
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-slate-500"}`}>
                  Email
                </p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-5 py-4">
              <FaCalendarAlt className="text-blue-500" />
              <div className="text-sm">
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-slate-500"}`}>
                  Member since
                </p>
                <p className="font-semibold">{user.createdAt}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold transition ${
                darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              <FaSignOutAlt /> Logout
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-2xl font-semibold shadow-lg transition"
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div
            className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl ${
              darkMode ? "bg-gray-900 text-white" : "bg-white text-slate-900"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center text-xl mb-3">
                <FaTrash />
              </div>
              <h2 className="text-lg font-bold">Delete Account?</h2>
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-slate-500"
                }`}
              >
                This will permanently delete your account and all tasks. This
                action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className={`flex-1 py-3 rounded-2xl font-semibold ${
                  darkMode ? "bg-gray-800" : "bg-slate-100"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold shadow-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
