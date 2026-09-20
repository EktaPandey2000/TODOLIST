import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";
import Navbar from "../components/Navbar";

function Home({ darkMode, setDarkMode }) {
  const [todolist, setTodolist] = useLocalStorage("todolist",[]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("Personal");
  const [editStatus, setEditStatus] = useState("pending");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDueDate, setEditDueDate] = useState("");

  const deleteTodo = (index) => {
    setTodolist(
      todolist.filter((_, i) => i !== index)
    );
  };

  const getDueStatus = (todo) => {
    if (!todo.dueDate) {
      return "no-date";
    }

    // Agar task complete hai
    if (todo.status === "complete") {
      return "completed";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    // Due date nikal gayi aur task pending hai
    if (dueDate < today) {
      return "overdue";
    }

    // Due date aaj hai
    if (dueDate.getTime() === today.getTime()) {
      return "today";
    }

    // Due date future me hai
    return "upcoming";
  };

  // EDIT OPEN
  const editTodo = (index) => {
    const todo = todolist[index];

    setEditIndex(index);
    setEditTitle(todo.title);
    setEditCategory(todo.category || "Other");
    setEditStatus(todo.status || "pending");
    setEditPriority(todo.priority || "medium");
    setEditDueDate(todo.dueDate || "");
  };

  // SAVE EDIT
  const saveEdit = () => {
    if (editTitle.trim() === "") return;

    const list = [...todolist];

    const now = new Date();

    list[editIndex] = {
      ...list[editIndex],

      title: editTitle,
      category: editCategory,
      status: editStatus,
      priority: editPriority,
      dueDate: editDueDate,

      completedAt:
        editStatus === "complete"
          ? list[editIndex].completedAt ||
            now.toLocaleDateString() +
              " " +
              now.toLocaleTimeString()
          : "",
    };

    setTodolist(list);
    setEditIndex(null);
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditIndex(null);
  };

  // COMPLETE / PENDING
  const completeTodo = (index) => {
    const list = [...todolist];

    if (list[index].status === "pending") {
      const now = new Date();

      list[index].status = "complete";

      list[index].completedAt =
        now.toLocaleDateString() +
        " " +
        now.toLocaleTimeString();
    } else {
      list[index].status = "pending";
      list[index].completedAt = "";
    }

    setTodolist(list);
  };

  // SEARCH + FILTER
  const filteredTodos = todolist.filter((todo) => {
    const statusMatch =
      filter === "all" ||
      todo.status === filter;

    const searchMatch = todo.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  // PAGINATION
  const totalPages = Math.ceil(
    filteredTodos.length / itemsPerPage
  );

  const start = (page - 1) * itemsPerPage;

  const currentTodos = filteredTodos.slice(
    start,
    start + itemsPerPage
  );

  return (
    <div
      className={`min-h-screen px-4 py-10 ${
        darkMode
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto">

        {/* NAVBAR */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          search={search}
          setSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        {/* TITLE */}
        <h1
          className={`text-4xl font-bold text-center mb-8 ${
            darkMode
              ? "text-white"
              : "text-purple-700"
          }`}
        >
          TODO List
        </h1>

        {/* FILTER */}
        <div className="flex justify-center gap-3 mb-6">

          {/* ALL */}
          <button
            onClick={() => {
              setFilter("all");
              setPage(1);
            }}
            className={`px-5 py-2 rounded-lg ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : darkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          {/* PENDING */}
          <button
            onClick={() => {
              setFilter("pending");
              setPage(1);
            }}
            className={`px-5 py-2 rounded-lg ${
              filter === "pending"
                ? "bg-orange-500 text-white"
                : darkMode
                ? "bg-orange-900 text-orange-200"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            Pending
          </button>

          {/* COMPLETE */}
          <button
            onClick={() => {
              setFilter("complete");
              setPage(1);
            }}
            className={`px-5 py-2 rounded-lg ${
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

        {/* TABLE */}
        <div className="w-full overflow-x-auto">

          <table
            className={`w-full table-fixed border ${
              darkMode
                ? "border-gray-700"
                : "border-gray-300"
            }`}
          >

            {/* HEADER */}
            <thead
              className={
                darkMode
                  ? "bg-gray-900"
                  : "bg-gray-100"
              }
            >
              <tr>

                <th className="border p-3 text-center">
                  No.
                </th>

                <th className="border p-3 text-center">
                  Task
                </th>

                <th className="border p-3 text-center">
                  Category
                </th>

                <th className="border p-3 text-center">
                  Due Date
                </th>

                <th className="border p-3 text-center">
                  Created At
                </th>

                <th className="border p-3 text-center">
                  Status
                </th> 

                <th className="border p-3 text-center">
                  Priority
                </th>

                <th className="border p-3 text-center">
                  Action
                </th> 

              </tr>
            </thead>

            {/* BODY */}  
            <tbody>

              {currentTodos.map((todo, index) => (

                <tr key={index}>

                  {/* NO */}
                  <td className="border p-3 text-center">
                    {start + index + 1}
                  </td>

                  {/* TASK */}
                  <td className="border p-3 text-center wrap-break-words">
                    {todo.title}
                  </td>
                  {/* CATEGORY */}
                  <td className="border p-3 text-center">
                    {todo.category === "Personal" && (
                      <span className="category-badge inline-block bg-purple-500 text-white px-3 py-1 rounded-lg text-sm">
                        Personal
                      </span>
                    )}
                    {todo.category === "Work" && (
                      <span className="category-badge inline-block bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                        Work
                      </span>
                    )}

                    {todo.category === "Study" && (
                      <span className="category-badge inline-block bg-indigo-500 text-white px-3 py-1 rounded-lg text-sm">
                        Study
                      </span>
                    )}

                    {todo.category === "Shopping" && (
                      <span className="category-badge inline-block bg-pink-500 text-white px-3 py-1 rounded-lg text-sm">
                        Shopping
                      </span>
                    )}

                    {(!todo.category ||
                      todo.category === "Other") && (
                      <span className="category-badge inline-block bg-gray-500 text-white px-3 py-1 rounded-lg text-sm">
                        Other
                      </span>
                    )}

                  </td>

                  {/* DUE DATE */}
                  <td className="border p-3 text-center">

                    {/* NO DATE */}
                    {!todo.dueDate && (
                      <span className="text-gray-500">
                        No date
                      </span>
                    )}

                    {/* DATE EXISTS */}
                    {todo.dueDate && (
                      <>
                        {/* DATE */}
                        <p className="font-medium">
                          {todo.dueDate}
                        </p>

                        {/* OVERDUE */}
                        {getDueStatus(todo) ===
                          "overdue" && (
                          <div className="mt-2">

                            <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                              Overdue
                            </span>

                            <p className="text-red-500 text-xs mt-1 font-semibold">
                              Task Not Completed
                            </p>

                          </div>
                        )}

                        {/* DUE TODAY */}
                        {getDueStatus(todo) ===
                          "today" && (
                          <span className="inline-block mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                            Due Today
                          </span>
                        )}

                        {/* UPCOMING */}
                        {getDueStatus(todo) ===
                          "upcoming" && (
                          <span className="inline-block mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                            Upcoming
                          </span>
                        )}

                        {/* COMPLETED */}
                        {getDueStatus(todo) ===
                          "completed" && (
                          <span className="inline-block mt-2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                            Completed
                          </span>
                        )}

                      </>
                    )}

                  </td>

                  {/* CREATED AT */}
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

                  {/* STATUS */}
                  <td className="border p-3 text-center">

                    <button
                      onClick={() =>
                        completeTodo(
                          todolist.indexOf(todo)
                        )
                      }
                      className={`px-3 py-1 rounded-lg text-white transition hover:scale-105 ${
                        todo.status === "pending"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    >
                      {todo.status === "pending"
                        ? "Pending"
                        : "Complete"}
                    </button>

                  </td>

                  {/* PRIORITY */}
                  <td className="border p-3 text-center">

                    {todo.priority === "high" && (
                      <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
                        High
                      </span>
                    )}

                    {todo.priority === "medium" && (
                      <span className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">
                        Medium
                      </span>
                    )}

                    {todo.priority === "low" && (
                      <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                        Low
                      </span>
                    )}

                  </td>

                  {/* ACTION */}
                  <td className="border p-3">

                    <div className="flex justify-center gap-5">

                      {/* EDIT */}
                      <button
                        onClick={() =>
                          editTodo(
                            todolist.indexOf(todo)
                          )
                        }
                        className="text-blue-500 hover:scale-125 transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          deleteTodo(
                            todolist.indexOf(todo)
                          )
                        }
                        className="text-red-500 hover:scale-125 transition"
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

        {/* NO TASK */}
        {filteredTodos.length === 0 && (
          <p className="text-center mt-6">
            No tasks found
          </p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">

            {/* PREVIOUS */}
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200"
              } disabled:opacity-40`}
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}
            {Array.from(
              { length: totalPages },
              (_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setPage(i + 1)
                  }
                  className={`px-4 py-2 rounded-lg ${
                    page === i + 1
                      ? "bg-purple-600 text-white"
                      : darkMode
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}

            {/* NEXT */}
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200"
              } disabled:opacity-40`}
            >
              Next
            </button>

          </div>
        )}

        {/* EDIT MODAL */}
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

              {/* TASK */}
              <label className="block text-center font-semibold mb-2">
                Task
              </label>

              <input
                type="text"
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                className={`w-full border rounded-lg px-4 py-3 mb-5 text-center ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
              />

              {/* CATEGORY */}
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

              {/* DUE DATE */}
              <label className="block text-center font-semibold mb-2">
                Due Date
              </label>

              <input
                type="date"
                value={editDueDate}
                onChange={(e) =>
                  setEditDueDate(e.target.value)
                }
                className={`w-full border rounded-lg px-4 py-3 mb-5 text-center ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
              />

              {/* STATUS */}
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

              {/* PRIORITY */}
              <label className="block text-center font-semibold mb-2">
                Priority
              </label>

              <select
                value={editPriority}
                onChange={(e) =>
                  setEditPriority(e.target.value)
                }
                className={`w-full border rounded-lg px-4 py-3 mb-6 text-center ${
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

              {/* BUTTONS */}
              <div className="flex gap-3">

                {/* CANCEL */}
                <button
                  onClick={cancelEdit}
                  className={`w-1/2 py-3 rounded-lg font-semibold ${
                    darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}
                >
                  Cancel
                </button>

                {/* SAVE */}
                <button
                  onClick={saveEdit}
                  className="w-1/2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
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

