import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import Navbar from "../components/Navbar";

function AddTask({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const [todolist, setTodolist] = useLocalStorage("todolist",[]
  );

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === "") return;

    const now = new Date();

    const newTask = {
      title: title,
      status: status,
      priority: priority,

      createdAt:
        now.toLocaleDateString() +
        " " +
        now.toLocaleTimeString(),

      completedAt:
        status === "complete"
          ? now.toLocaleDateString() +
            " " +
            now.toLocaleTimeString()
          : "",
    };

    setTodolist([
      ...todolist,
      newTask,
    ]);

    setTitle("");
    setStatus("pending");
    setPriority("medium");

    navigate("/");
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="w-full max-w-7xl mx-auto">

        {/* Navbar */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Center Content */}
        <div className="flex justify-center items-center">

          <div className="w-full max-w-lg">

            {/* Heading */}
            <h1
              className={`text-3xl font-bold text-center mb-8 ${
                darkMode
                  ? "text-white"
                  : "text-purple-700"
              }`}
            >
              Add Task
            </h1>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className={`w-full border rounded-2xl p-8 shadow-md ${
                darkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-300"
              }`}
            >

              {/* Task */}
              <div className="mb-5">
                <label className="block text-center font-semibold mb-2">
                  Task
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="Enter task"
                  className={`w-full border rounded-lg px-4 py-3 text-center outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                      : "bg-white text-black border-gray-300"
                  }`}
                />
              </div>

              {/* Status */}
              <div className="mb-5">
                <label className="block text-center font-semibold mb-2">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                  className={`w-full border rounded-lg px-4 py-3 text-center outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-600"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="complete">
                    Complete
                  </option>
                </select>
              </div>

              {/* Priority */}
              <div className="mb-6">
                <label className="block text-center font-semibold mb-2">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  className={`w-full border rounded-lg px-4 py-3 text-center outline-none focus:ring-2 focus:ring-purple-500 ${
                    darkMode
                      ? "bg-gray-800 text-white border-gray-600"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  <option value="high">
                    High
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="low">
                    Low
                  </option>
                </select>
              </div>

              {/* Add Button */}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] text-white py-3 rounded-lg font-semibold transition"
              >
                Add Task
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTask;