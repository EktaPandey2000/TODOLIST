import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";
import Navbar from "../components/Navbar";

function Home({ darkMode, setDarkMode }) {
  const [todolist, setTodolist] = useLocalStorage("todolist", []);
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
    setTodolist(todolist.filter((_, i) => i !== index));
  };

  const getDueStatus = (todo) => {
    if (!todo.dueDate) {
      return "no-date";
    }

    if (todo.status === "complete") {
      return "completed";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      return "overdue";
    }

    if (dueDate.getTime() === today.getTime()) {
      return "today";
    }

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
      filter === "all" || todo.status === filter;

    const searchMatch = (todo.title || "")
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
      className={`min-h-screen px-3 sm:px-4 py-6 sm:py-10 overflow-x-hidden ${
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
          className={`text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 ${
            darkMode
              ? "text-white"
              : "text-purple-700"
          }`}
        >
          TODO List
        </h1>

        {/* FILTER */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">

          <button
            onClick={() => {
              setFilter("all");
              setPage(1);
            }}
            className={`px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : darkMode
                ? "bg-gray-800 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => {
              setFilter("pending");
              setPage(1);
            }}
            className={`px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base ${
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
            onClick={() => {
              setFilter("complete");
              setPage(1);
            }}
            className={`px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base ${
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

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block w-full overflow-x-auto">

          <table
            className={`w-full table-fixed border ${
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

                <th className="border p-3 text-center w-[5%]">
                  No.
                </th>

                <th className="border p-3 text-center w-[15%]">
                  Task
                </th>

                <th className="border p-3 text-center w-[12%]">
                  Category
                </th>

                <th className="border p-3 text-center w-[15%]">
                  Due Date
                </th>

                <th className="border p-3 text-center w-[17%]">
                  Created At
                </th>

                <th className="border p-3 text-center w-[11%]">
                  Status
                </th>

                <th className="border p-3 text-center w-[11%]">
                  Priority
                </th>

                <th className="border p-3 text-center w-[9%]">
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {currentTodos.map((todo, index) => {

                const actualIndex = todolist.indexOf(todo);

                return (
                  <tr key={actualIndex}>

                    {/* NO */}
                    <td className="border p-3 text-center align-top">
                      {start + index + 1}
                    </td>

                    {/* TASK */}
                    <td className="border p-3 text-center align-top wrap-break-words whitespace-normal">
                      {todo.title}
                    </td>

                    {/* CATEGORY */}
                    <td className="border p-3 text-center align-top wrap-break-words whitespace-normal">

                      {todo.category === "Personal" && (
                        <span className="inline-block max-w-full wrap-break-words whitespace-normal bg-purple-500 text-white px-3 py-1 rounded-lg text-sm">
                          Personal
                        </span>
                      )}

                      {todo.category === "Work" && (
                        <span className="inline-block max-w-full wrap-break-words whitespace-normal bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                          Work
                        </span>
                      )}

                      {todo.category === "Study" && (
                        <span className="inline-block max-w-full wrap-break-words whitespace-normal bg-pink-500 text-white px-3 py-1 rounded-lg text-sm">
                          Study
                        </span>
                      )}

                      {todo.category === "Shopping" && (
                        <span className="inline-block max-w-full wrap-break-words whitespace-normal bg-pink-500 text-white px-3 py-1 rounded-lg text-sm">
                          Shopping
                        </span>
                      )}

                      {(!todo.category ||
                        todo.category === "Other") && (
                        <span className="inline-block max-w-full wrap-break-words whitespace-normal bg-pink-500 text-white px-3 py-1 rounded-lg text-sm">
                          Other
                        </span>
                      )}

                    </td>

                    {/* DUE DATE */}
                    <td className="border p-3 text-center align-top wrap-break-words whitespace-normal">

                      {!todo.dueDate && (
                        <span className="text-gray-500">
                          No date
                        </span>
                      )}

                      {todo.dueDate && (
                        <>
                          <p className="font-medium wrap-break-words">
                            {todo.dueDate}
                          </p>

                          {getDueStatus(todo) === "overdue" && (
                            <div className="mt-2">
                              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                                Overdue
                              </span>

                              <p className="text-red-500 text-xs mt-1 font-semibold">
                                Task Not Completed
                              </p>
                            </div>
                          )}

                          {getDueStatus(todo) === "today" && (
                            <span className="inline-block mt-2 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                              Due Today
                            </span>
                          )}

                          {getDueStatus(todo) === "upcoming" && (
                            <span className="inline-block mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                              Upcoming
                            </span>
                          )}

                          {getDueStatus(todo) === "completed" && (
                            <span className="inline-block mt-2 bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                              Completed
                            </span>
                          )}
                        </>
                      )}

                    </td>

                    {/* CREATED AT */}
                    <td className="border p-3 text-center text-sm wrap-break-words whitespace-normal align-top">

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
                    <td className="border p-3 text-center align-top">

                      <button
                        onClick={() =>
                          completeTodo(actualIndex)
                        }
                        className={`px-3 py-1 rounded-lg text-white transition hover:scale-105 text-sm ${
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
                    <td className="border p-3 text-center align-top wrap-break-words">

                      {todo.priority === "high" && (
                        <span className="inline-block max-w-full wrap-break-words bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
                          High
                        </span>
                      )}

                      {todo.priority === "medium" && (
                        <span className="inline-block max-w-full wrap-break-words bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">
                          Medium
                        </span>
                      )}

                      {todo.priority === "low" && (
                        <span className="inline-block max-w-full wrap-break-words bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                          Low
                        </span>
                      )}

                    </td>

                    {/* ACTION */}
                    <td className="border p-3 align-top">

                      <div className="flex justify-center gap-4">

                        <button
                          onClick={() =>
                            editTodo(actualIndex)
                          }
                          className="text-blue-500 hover:scale-125 transition"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() =>
                            deleteTodo(actualIndex)
                          }
                          className="text-red-500 hover:scale-125 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-4">

          {currentTodos.map((todo, index) => {

            const actualIndex = todolist.indexOf(todo);

            return (
              <div
                key={actualIndex}
                className={`w-full rounded-2xl border p-4 shadow-md ${
                  darkMode
                    ? "bg-gray-900 border-gray-700"
                    : "bg-white border-gray-300"
                }`}
              >

                {/* CARD TOP */}
                <div className="flex justify-between items-start gap-3 mb-4">

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">
                      Task #{start + index + 1}
                    </p>

                    <h2 className="font-bold text-lg wrap-break-words whitespace-normal">
                      {todo.title}
                    </h2>
                  </div>

                  <div className="flex gap-3 shrink-0">

                    <button
                      onClick={() =>
                        editTodo(actualIndex)
                      }
                      className="text-blue-500 hover:scale-125 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() =>
                        deleteTodo(actualIndex)
                      }
                      className="text-red-500 hover:scale-125 transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

                {/* CATEGORY */}
                <div className="flex justify-between items-center gap-3 py-2 border-b border-gray-500/20">

                  <span className="font-semibold text-sm">
                    Category
                  </span>

                  <span
                    className={`inline-block max-w-[60%] wrap-break-words whitespace-normal px-3 py-1 rounded-lg text-xs text-white ${
                      todo.category === "Personal"
                        ? "bg-purple-500"
                        : todo.category === "Work"
                        ? "bg-blue-500"
                        : "bg-pink-500"
                    }`}
                  >
                    {todo.category || "Other"}
                  </span>

                </div>

                {/* DUE DATE */}
                <div className="py-3 border-b border-gray-500/20">

                  <div className="flex justify-between gap-3">

                    <span className="font-semibold text-sm">
                      Due Date
                    </span>

                    <span className="text-sm text-right wrap-break-words">
                      {todo.dueDate || "No date"}
                    </span>

                  </div>

                  {todo.dueDate && (
                    <div className="text-right mt-2">

                      {getDueStatus(todo) === "overdue" && (
                        <>
                          <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                            Overdue
                          </span>

                          <p className="text-red-500 text-xs mt-1 font-semibold">
                            Task Not Completed
                          </p>
                        </>
                      )}

                      {getDueStatus(todo) === "today" && (
                        <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                          Due Today
                        </span>
                      )}

                      {getDueStatus(todo) === "upcoming" && (
                        <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                          Upcoming
                        </span>
                      )}

                      {getDueStatus(todo) === "completed" && (
                        <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-semibold">
                          Completed
                        </span>
                      )}

                    </div>
                  )}

                </div>

                {/* CREATED */}
                <div className="py-3 border-b border-gray-500/20">

                  <p className="text-sm wrap-break-words">
                    <b>Created:</b>
                    <br />
                    {todo.createdAt}
                  </p>

                  <p className="text-sm mt-3 wrap-break-words">
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

                </div>

                {/* STATUS + PRIORITY */}
                <div className="flex flex-wrap justify-between items-center gap-3 pt-3">

                  <button
                    onClick={() =>
                      completeTodo(actualIndex)
                    }
                    className={`px-4 py-2 rounded-lg text-white text-sm transition hover:scale-105 ${
                      todo.status === "pending"
                        ? "bg-orange-500"
                        : "bg-green-500"
                    }`}
                  >
                    {todo.status === "pending"
                      ? "Pending"
                      : "Complete"}
                  </button>

                  {todo.priority === "high" && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs">
                      High
                    </span>
                  )}

                  {todo.priority === "medium" && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs">
                      Medium
                    </span>
                  )}

                  {todo.priority === "low" && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs">
                      Low
                    </span>
                  )}

                </div>

              </div>
            );
          })}

        </div>

        {/* NO TASK */}
        {filteredTodos.length === 0 && (
          <p className="text-center mt-6">
            No tasks found
          </p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">

            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200"
              } disabled:opacity-40`}
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setPage(i + 1)
                  }
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm ${
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

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200"
              } disabled:opacity-40`}
            >
              Next
            </button>

          </div>
        )}

        {/* ================= EDIT MODAL ================= */}
        {editIndex !== null && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-3 sm:px-4 py-4 z-50 overflow-y-auto">

            <div
              className={`w-full max-w-lg rounded-2xl p-5 sm:p-7 shadow-xl max-h-[95vh] overflow-y-auto ${
                darkMode
                  ? "bg-gray-900 text-white"
                  : "bg-white text-black"
              }`}
            >

              <h2 className="text-xl sm:text-2xl font-bold text-center mb-5 sm:mb-6">
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
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
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
                <option value="pending">Pending</option>
                <option value="complete">Complete</option>
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
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3">

                <button
                  onClick={cancelEdit}
                  className={`w-full sm:w-1/2 py-3 rounded-lg font-semibold ${
                    darkMode
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}
                >
                  Cancel
                </button>

                <button
                  onClick={saveEdit}
                  className="w-full sm:w-1/2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
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