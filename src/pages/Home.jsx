import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";
import Navbar from "../components/Navbar";

function Home({ darkMode, setDarkMode }) {
  const [todolist, setTodolist] = useLocalStorage(
    "todolist",
    []
  );

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Edit ke liye selected task
  const [editIndex, setEditIndex] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] =
    useState("Personal");
  const [editStatus, setEditStatus] =
    useState("pending");
  const [editPriority, setEditPriority] =
    useState("medium");

  // Confetti burst state - jab task complete mark ho
  const [confetti, setConfetti] = useState([]);

  const fireConfetti = () => {
    const colors = ["#ff6ec4", "#7873f5", "#22c55e", "#f97316", "#facc15"];
    const pieces = Array.from({ length: 18 }).map((_, i) => ({
      id: Date.now() + i,
      left: 45 + Math.random() * 10 + "%",
      color: colors[Math.floor(Math.random() * colors.length)],
      x: (Math.random() - 0.5) * 200 + "px",
      y: -(100 + Math.random() * 100) + "px",
    }));
    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 900);
  };

  // Delete Task
  const deleteTodo = (index) => {
    setTodolist(
      todolist.filter((_, i) => i !== index)
    );
  };

  // Edit button
  const editTodo = (index) => {
    const todo = todolist[index];

    setEditIndex(index);
    setEditTitle(todo.title);
    setEditCategory(todo.category || "Other");
    setEditStatus(todo.status);
    setEditPriority(todo.priority || "medium");
  };

  // Save Edited Task
  const saveEdit = () => {
    if (editTitle.trim() === "") return;

    const list = [...todolist];

    const now = new Date();

    list[editIndex] = {
      ...list[editIndex],

      title: editTitle,
      category: editCategory,
      priority: editPriority,
      status: editStatus,

      completedAt:
        editStatus === "complete"
          ? list[editIndex].completedAt ||
            now.toLocaleDateString() +
              " " +
              now.toLocaleTimeString()
          : "",
    };

    setTodolist(list);

    // Edit mode close
    setEditIndex(null);
    setEditTitle("");
    setEditCategory("Personal");
    setEditStatus("pending");
    setEditPriority("medium");
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditIndex(null);
  };

  // Complete / Pending
  const completeTodo = (index) => {
    const list = [...todolist];

    if (list[index].status === "pending") {
      const now = new Date();

      list[index].status = "complete";

      list[index].completedAt =
        now.toLocaleDateString() +
        " " +
        now.toLocaleTimeString();

      fireConfetti();
    } else {
      list[index].status = "pending";
      list[index].completedAt = "";
    }

    setTodolist(list);
  };

  // Search + Filter
  const filteredTodos = todolist.filter((todo) => {
    const statusMatch =
      filter === "all" ||
      todo.status === filter;

    const searchMatch = todo.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="w-full max-w-7xl mx-auto">

        {/* Navbar */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          search={search}
          setSearch={setSearch}
        />

        {/* Heading */}
        <h1
          className={`text-4xl font-bold text-center mb-8 ${
            darkMode
              ? "text-white"
              : "text-purple-700"
          }`}
        >
          TODO List
        </h1>

        {/* Confetti burst (task complete pe fire hota hai) */}
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti-piece"
            style={{
              left: c.left,
              backgroundColor: c.color,
              "--x": c.x,
              "--y": c.y,
            }}
          />
        ))}

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">

          <button
            onClick={() => setFilter("all")}
            className={`btn-anim px-5 py-2 max-sm:px-3 max-sm:py-1.5 rounded-lg font-semibold max-sm:text-sm transition ${
              filter === "all"
                ? "bg-black text-white"
                : darkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`btn-anim px-5 py-2 max-sm:px-3 max-sm:py-1.5 rounded-lg font-semibold max-sm:text-sm transition ${
              filter === "pending"
                ? "bg-orange-500 text-white"
                : darkMode
                ? "bg-orange-900 text-orange-200"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("complete")}
            className={`btn-anim px-5 py-2 max-sm:px-3 max-sm:py-1.5 rounded-lg font-semibold max-sm:text-sm transition ${
              filter === "complete"
                ? "bg-green-600 text-white"
                : darkMode
                ? "bg-green-900 text-green-200"
                : "bg-green-100 text-green-600"
            }`}
          >
            Complete
          </button>

        </div>

        {/* Empty State */}
        {filteredTodos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="empty-state-emoji">📝</span>
            <p
              className={`mt-4 text-lg font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Koi task nahi mila — naya add kar do!
            </p>
          </div>
        )}

        {/* Table */}
        {filteredTodos.length > 0 && (
        <div className="w-full max-w-full overflow-x-auto">
          <table
            className={`w-full min-w-[175] table-fixed border ${
              darkMode
                ? "border-gray-700"
                : "border-gray-300"
            }`}
          >
            <thead
              className={
                darkMode
                  ? "bg-gray-900"
                  : "bg-gray-100"
              }
            >
              <tr>
                <th className="border p-3 text-center w-[6%]">
                  No.
                </th>

                <th className="border p-3 text-center w-[23%]">
                  Task
                </th>

                <th className="border p-3 text-center w-[13%]">
                  Category
                </th>

                <th className="border p-3 text-center w-[23%]">
                  Created At
                </th>

                <th className="border p-3 text-center w-[12%]">
                  Status
                </th>

                <th className="border p-3 text-center w-[11%]">
                  Priority
                </th>

                <th className="border p-3 text-center w-[12%]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTodos.map((todo, index) => (
                <tr key={index}>

                  {/* No */}
                  <td className="border p-3 text-center">
                    {index + 1}
                  </td>

                  {/* Task */}
                  <td className="border p-3 text-center wrap-break-words">
                    {todo.title}
                  </td>

                  {/* Category */}
                  <td className="border p-3 text-center">

                    {todo.category === "Personal" && (
                      <span className="inline-block bg-purple-500 text-white px-3 py-1 max-sm:px-2 max-sm:py-0.5 rounded-lg text-sm max-sm:text-xs whitespace-nowrap">
                        Personal
                      </span>
                    )}

                    {todo.category === "Work" && (
                      <span className="inline-block bg-blue-500 text-white px-3 py-1 max-sm:px-2 max-sm:py-0.5 rounded-lg text-sm max-sm:text-xs whitespace-nowrap">
                        Work
                      </span>
                    )}

                    {todo.category === "Study" && (
                      <span className="inline-block bg-indigo-500 text-white px-3 py-1 max-sm:px-2 max-sm:py-0.5 rounded-lg text-sm max-sm:text-xs whitespace-nowrap">
                        Study
                      </span>
                    )}

                    {todo.category === "Shopping" && (
                      <span className="inline-block bg-pink-500 text-white px-3 py-1 max-sm:px-2 max-sm:py-0.5 rounded-lg text-sm max-sm:text-xs whitespace-nowrap">
                        Shopping
                      </span>
                    )}

                    {(!todo.category ||
                      todo.category === "Other") && (
                      <span className="inline-block bg-gray-500 text-white px-3 py-1 max-sm:px-2 max-sm:py-0.5 rounded-lg text-sm max-sm:text-xs whitespace-nowrap">
                        Other
                      </span>
                    )}

                  </td>

                  {/* Created At */}
                  <td className="border p-3 text-center text-sm wrap-break-words">

                    <p>
                      <b>Created:</b>
                      <br />
                      {todo.createdAt}
                    </p>

                    <p className="mt-3">
                      <b>
                        {todo.status === "pending"
                          ? "Pending:"
                          : "Complete:"}
                      </b>

                      <br />

                      {todo.status === "pending"
                        ? todo.createdAt
                        : todo.completedAt}
                    </p>

                  </td>

                  {/* Status */}
                  <td className="border p-3 text-center">
                    <button
                      onClick={() =>
                        completeTodo(index)
                      }
                      className={`btn-anim px-3 py-1 max-sm:px-2 max-sm:py-0.5 rounded-lg text-white text-sm max-sm:text-xs font-semibold max-w-full transition ${
                        todo.status === "pending"
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {todo.status === "pending"
                        ? "Pending"
                        : "Complete"}
                    </button>
                  </td>

                  {/* Priority */}
                  <td className="border p-3 text-center ">

                    {todo.priority === "high" && (
                      <span className="inline-block bg-red-500 text-white px-3 py-1 max-sm:px-2 max-sm:py-0.5 rounded-lg text-sm max-sm:text-xs max-w-full">
                        High
                      </span>
                    )}

                    {todo.priority === "medium" && (
                      <span className="inline-block bg-yellow-500 text-white px-3 py-1 max-sm:px-2 max-sm:py-0.5 rounded-lg text-sm max-sm:text-xs max-w-full">
                        Medium
                      </span>
                    )}

                    {todo.priority === "low" && (
                      <span className="inline-block bg-green-500 text-white px-3 py-1 max-sm:px-2 max-sm:py-0.5 rounded-lg text-sm max-sm:text-xs max-w-full">
                        Low
                      </span>
                    )}

                  </td>

                  {/* Actions */}
                  <td className="border p-3">
                    <div className="flex justify-center gap-3 max-sm:gap-2">

                      <button
                        onClick={() =>
                          editTodo(index)
                        }
                        className="btn-icon text-blue-500"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() =>
                          deleteTodo(index)
                        }
                        className="btn-icon text-red-500"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Edit Form */}
        {editIndex !== null && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">

            <div
              className={`w-full max-w-lg rounded-2xl p-7 shadow-xl ${
                darkMode
                  ? "bg-gray-900 text-white"
                  : "bg-white text-black"
              }`}
            >

              <h2 className="text-2xl font-bold text-center mb-6">
                Edit Task
              </h2>

              {/* Task */}
              <label className="block text-center font-semibold mb-2">
                Task
              </label>

              <input
                type="text"
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                className={`w-full border rounded-lg px-4 py-3 mb-5 text-center outline-none ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
              />

              {/* Category */}
              <label className="block text-center font-semibold mb-2">
                Category
              </label>

              <select
                value={editCategory}
                onChange={(e) =>
                  setEditCategory(e.target.value)
                }
                className={`w-full border rounded-lg px-4 py-3 mb-5 text-center ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
              >
                <option value="Personal">
                  Personal
                </option>

                <option value="Work">
                  Work
                </option>

                <option value="Study">
                  Study
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              {/* Status */}
              <label className="block text-center font-semibold mb-2">
                Status
              </label>

              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value)
                }
                className={`w-full border rounded-lg px-4 py-3 mb-5 text-center ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
              >
                <option value="pending">
                  Pending
                </option>

                <option value="complete">
                  Complete
                </option>
              </select>

              {/* Priority */}
              <label className="block text-center font-semibold mb-2">
                Priority
              </label>

              <select
                value={editPriority}
                onChange={(e) =>
                  setEditPriority(e.target.value)
                }
                className={`w-full border rounded-lg px-4 py-3 mb-3 text-center ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
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

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  onClick={cancelEdit}
                  className={`btn-anim w-1/2 py-3 rounded-lg font-semibold ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="btn-fancy w-1/2 py-4"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
export default Home;