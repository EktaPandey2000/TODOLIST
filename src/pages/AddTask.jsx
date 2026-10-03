import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClipboardList,
  FaPlus,
} from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function AddTask({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [todolist, setTodolist] = useLocalStorage(
    `todolist_${user.username}`,
    []
  );

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Work");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const dateInputRef = useRef(null);

  const categories = ["Work", "Personal", "Study", "Shopping", "Other"];

  const formatDate = (value) => {
    if (!value) return "Select date";
    const [y, m, d] = value.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;

    const now = new Date();
    const newTask = {
      title: title.trim(),
      category,
      status,
      priority,
      dueDate,
      createdAt:
        now.toLocaleDateString() + " " + now.toLocaleTimeString(),
      completedAt:
        status === "complete"
          ? now.toLocaleDateString() + " " + now.toLocaleTimeString()
          : "",
    };

    setTodolist([...todolist, newTask]);
    navigate("/");
  };

  const labelClass = "block text-xs font-medium mb-2 text-gray-400";

  const underInput = `w-full bg-transparent border-b pb-3 outline-none transition text-base font-semibold ${
    darkMode
      ? "border-gray-700 text-white placeholder-gray-500 focus:border-blue-400"
      : "border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-500"
  }`;

  const selectClass = `w-full bg-transparent outline-none text-sm font-semibold cursor-pointer ${
    darkMode ? "text-white" : "text-gray-800"
  }`;

  return (
    <div
      className={`min-h-screen px-3 sm:px-4 pt-2 pb-6 sm:pb-10 ${
        darkMode ? "bg-gray-950 text-white" : "bg-pink-100 text-black"
      }`}
      style={{
        backgroundImage: darkMode
          ? "linear-gradient(rgba(3,7,18,0.88), rgba(3,7,18,0.88)), url('/addtask-bg.png')"
          : "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-7xl mx-auto">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div className="flex justify-center mt-6 sm:mt-10">
          <div className="w-full max-w-md">
            <div
              className={`rounded-3xl shadow-xl p-6 sm:p-8 ${
                darkMode ? "bg-gray-900 border border-gray-800" : "bg-white"
              }`}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-8">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition ${
                    darkMode
                      ? "hover:bg-gray-800 text-gray-300"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                  title="Back"
                >
                  <FaArrowLeft />
                </button>

                <h1 className="text-lg sm:text-xl font-bold">
                  Create New Task
                </h1>

                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-xl ${
                    darkMode
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-blue-50 text-blue-500"
                  }`}
                >
                  <FaClipboardList />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* TASK NAME */}
                <div className="mb-6">
                  <label className={labelClass}>Task Name</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Team Meeting"
                    className={underInput}
                  />
                </div>

                {/* CATEGORY */}
                <div className="mb-6">
                  <label className={`${labelClass} mb-3`}>
                    Select Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                          category === cat
                            ? "bg-blue-500 text-white shadow-md"
                            : darkMode
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DATE */}
                <div
                  className={`flex items-center justify-between border-b pb-3 mb-6 ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div>
                    <p className={`${labelClass} mb-1`}>Date</p>
                    <p className="text-sm font-semibold">
                      {formatDate(dueDate)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openDatePicker}
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
                      darkMode
                        ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                        : "bg-blue-50 text-blue-500 hover:bg-blue-100"
                    }`}
                    title="Pick a date"
                  >
                    <FaCalendarAlt />
                  </button>

                  <input
                    ref={dateInputRef}
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="sr-only"
                    tabIndex={-1}
                  />
                </div>

                {/* STATUS + PRIORITY */}
                <div className="grid grid-cols-2 gap-5 mb-8">
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={selectClass}
                    >
                      <option value="pending">Pending</option>
                      <option value="complete">Complete</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className={selectClass}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-2xl font-semibold shadow-lg hover:scale-[1.02] active:scale-100 transition"
                >
                  <FaPlus className="text-sm" />
                  Create Task
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTask;