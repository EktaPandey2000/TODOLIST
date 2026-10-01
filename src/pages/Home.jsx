import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import useLocalStorage from "../hooks/useLocalStorage";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Home({ darkMode, setDarkMode }) {
  const { user } = useAuth();

  const [todolist, setTodolist] = useLocalStorage(
    `todolist_${user.username}`,
    []
  );
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

  // date strip selection ("" = show all)
  const [selectedDate, setSelectedDate] = useState("");

  const toISO = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const now = new Date();

  // Date strip: -3 days to +10 days
  const weekDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + (i - 3));
    return {
      iso: toISO(d),
      day: String(d.getDate()).padStart(2, "0"),
      label: ["S", "M", "T", "W", "T", "F", "S"][d.getDay()],
      isToday: i === 3,
    };
  });

  const deleteTodo = (index) => {
    setTodolist(todolist.filter((_, i) => i !== index));
  };

  const getDueStatus = (todo) => {
    if (!todo.dueDate) return "no-date";
    if (todo.status === "complete") return "completed";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) return "overdue";
    if (dueDate.getTime() === today.getTime()) return "today";
    return "upcoming";
  };

  const editTodo = (index) => {
    const todo = todolist[index];
    setEditIndex(index);
    setEditTitle(todo.title);
    setEditCategory(todo.category || "Other");
    setEditStatus(todo.status || "pending");
    setEditPriority(todo.priority || "medium");
    setEditDueDate(todo.dueDate || "");
  };

  const saveEdit = () => {
    if (editTitle.trim() === "") return;
    const list = [...todolist];
    const n = new Date();

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
            n.toLocaleDateString() + " " + n.toLocaleTimeString()
          : "",
    };

    setTodolist(list);
    setEditIndex(null);
  };

  const cancelEdit = () => setEditIndex(null);

  const completeTodo = (index) => {
    const list = [...todolist];
    if (list[index].status === "pending") {
      const n = new Date();
      list[index].status = "complete";
      list[index].completedAt =
        n.toLocaleDateString() + " " + n.toLocaleTimeString();
    } else {
      list[index].status = "pending";
      list[index].completedAt = "";
    }
    setTodolist(list);
  };

  // SEARCH + FILTER + DATE
  const filteredTodos = todolist.filter((todo) => {
    let statusMatch = false;
    if (filter === "all") statusMatch = true;
    else if (filter === "dueDate")
      statusMatch = getDueStatus(todo) === "overdue";
    else statusMatch = todo.status === filter;

    const searchMatch = (todo.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const dateMatch = selectedDate ? todo.dueDate === selectedDate : true;

    return statusMatch && searchMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const currentTodos = filteredTodos.slice(start, start + itemsPerPage);

  // ---- styles
  const pageBg = darkMode
    ? "bg-gray-950 text-white"
    : "bg-blue-50 text-slate-900";
  const cardBg = darkMode
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-blue-100";
  const subText = darkMode ? "text-gray-400" : "text-slate-500";

  const filterBtn = (active, activeClass) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition ${
      active
        ? `${activeClass} text-white shadow-md`
        : darkMode
        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
        : "bg-white text-slate-600 border border-blue-100 hover:bg-blue-50"
    }`;

  const priorityPill = (p) => {
    if (p === "high") return "bg-red-100 text-red-600";
    if (p === "medium") return "bg-yellow-100 text-yellow-700";
    if (p === "low") return "bg-green-100 text-green-700";
    return "bg-slate-100 text-slate-600";
  };

  const categoryPill = (c) => {
    if (c === "Personal") return "bg-purple-100 text-purple-700";
    if (c === "Work") return "bg-blue-100 text-blue-700";
    if (c === "Study") return "bg-pink-100 text-pink-700";
    if (c === "Shopping") return "bg-pink-100 text-pink-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className={`min-h-screen px-3 sm:px-4 py-6 sm:py-10 ${pageBg}`}>
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

        {/* HEADER CARD */}
        <div
          className={`mt-6 rounded-3xl p-5 sm:p-7 border shadow-sm ${cardBg}`}
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className={`text-sm ${subText}`}>
                {now.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                My Task
              </h1>
            </div>
          </div>

          {/* DATE STRIP */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedDate("")}
              className={`shrink-0 h-16 px-4 rounded-2xl flex flex-col items-center justify-center font-semibold transition ${
                selectedDate === ""
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-blue-50 text-slate-700 hover:bg-blue-100"
              }`}
            >
              <span className="text-lg">All</span>
              <span
                className={`text-[10px] ${
                  selectedDate === "" ? "text-blue-100" : subText
                }`}
              >
                Tasks
              </span>
            </button>

            {weekDays.map((d) => {
              const active = selectedDate === d.iso;
              return (
                <button
                  key={d.iso}
                  onClick={() => setSelectedDate(active ? "" : d.iso)}
                  className={`shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center font-semibold transition border ${
                    active
                      ? "bg-blue-600 text-white shadow-lg scale-105 border-transparent"
                      : d.isToday
                      ? darkMode
                        ? "bg-gray-800 text-white border-blue-500"
                        : "bg-white text-slate-900 border-blue-500"
                      : darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border-transparent"
                      : "bg-blue-50 text-slate-700 hover:bg-blue-100 border-transparent"
                  }`}
                >
                  <span className="text-base">{d.day}</span>
                  <span
                    className={`text-xs ${
                      active
                        ? "text-blue-100"
                        : d.isToday
                        ? "text-blue-600 font-bold"
                        : subText
                    }`}
                  >
                    {d.isToday ? "Today" : d.label}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className={subText}>
                Showing tasks due on <b>{selectedDate}</b>
              </span>
              <button
                onClick={() => setSelectedDate("")}
                className="text-blue-600 font-semibold hover:underline"
              >
                ✕ Show all tasks
              </button>
            </div>
          )}
        </div>

        {/* FILTER ROW */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 my-6">
          <button
            onClick={() => {
              setFilter("all");
              setPage(1);
            }}
            className={filterBtn(filter === "all", "bg-blue-600")}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter("pending");
              setPage(1);
            }}
            className={filterBtn(filter === "pending", "bg-orange-500")}
          >
            Pending
          </button>
          <button
            onClick={() => {
              setFilter("complete");
              setPage(1);
            }}
            className={filterBtn(filter === "complete", "bg-green-600")}
          >
            Complete
          </button>
          <button
            onClick={() => {
              setFilter("dueDate");
              setPage(1);
            }}
            className={filterBtn(filter === "dueDate", "bg-red-600")}
          >
            Due Date
          </button>
        </div>

        {/* ============ DESKTOP TABLE ============ */}
        <div
          className={`hidden md:block rounded-3xl overflow-hidden border shadow-sm ${cardBg}`}
        >
          <table className="w-full table-fixed">
            <thead>
              <tr
                className={`text-left text-xs uppercase tracking-wide ${
                  darkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-blue-50 text-slate-500"
                }`}
              >
                <th className="p-4 w-[5%] font-semibold">No.</th>
                <th className="p-4 w-[16%] font-semibold">Task</th>
                <th className="p-4 w-[12%] font-semibold">Category</th>
                <th className="p-4 w-[15%] font-semibold">Due Date</th>
                <th className="p-4 w-[17%] font-semibold">Created At</th>
                <th className="p-4 w-[11%] font-semibold">Status</th>
                <th className="p-4 w-[11%] font-semibold">Priority</th>
                <th className="p-4 w-[9%] font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTodos.map((todo, index) => {
                const actualIndex = todolist.indexOf(todo);
                const due = getDueStatus(todo);
                return (
                  <tr
                    key={actualIndex}
                    className={`border-t transition ${
                      darkMode
                        ? "border-gray-800 hover:bg-gray-800/60"
                        : "border-blue-50 hover:bg-blue-50/60"
                    }`}
                  >
                    <td className="p-4 align-top text-sm font-semibold text-slate-400">
                      {start + index + 1}
                    </td>

                    <td className="p-4 align-top font-semibold wrap-break-words whitespace-normal">
                      {todo.title}
                    </td>

                    <td className="p-4 align-top">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryPill(
                          todo.category
                        )}`}
                      >
                        {todo.category || "Other"}
                      </span>
                    </td>

                    <td className="p-4 align-top text-sm">
                      {!todo.dueDate && (
                        <span className={subText}>No date</span>
                      )}
                      {todo.dueDate && (
                        <div className="space-y-1">
                          <p className="font-medium">{todo.dueDate}</p>
                          {due === "overdue" && (
                            <>
                              <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                OVERDUE
                              </span>
                              <p className="text-red-500 text-[11px] font-semibold">
                                Not completed
                              </p>
                            </>
                          )}
                          {due === "today" && (
                            <span className="inline-block bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              TODAY
                            </span>
                          )}
                          {due === "upcoming" && (
                            <span className="inline-block bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              UPCOMING
                            </span>
                          )}
                          {due === "completed" && (
                            <span className="inline-block bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              COMPLETED
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className={`p-4 align-top text-xs ${subText}`}>
                      <p>
                        <b className="text-slate-700 dark:text-gray-200">
                          Created
                        </b>
                        <br />
                        {todo.createdAt}
                      </p>
                      <p className="mt-2">
                        <b className="text-slate-700 dark:text-gray-200">
                          {todo.status === "pending" ? "Pending" : "Complete"}
                        </b>
                        <br />
                        {todo.status === "pending"
                          ? todo.createdAt
                          : todo.completedAt}
                      </p>
                    </td>

                    <td className="p-4 align-top">
                      <button
                        onClick={() => completeTodo(actualIndex)}
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white transition hover:scale-105 ${
                          todo.status === "pending"
                            ? "bg-orange-500"
                            : "bg-green-500"
                        }`}
                      >
                        {todo.status === "pending" ? "Pending" : "Complete"}
                      </button>
                    </td>

                    <td className="p-4 align-top">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${priorityPill(
                          todo.priority
                        )}`}
                      >
                        {todo.priority
                          ? todo.priority.charAt(0).toUpperCase() +
                            todo.priority.slice(1)
                          : "Medium"}
                      </span>
                    </td>

                    <td className="p-4 align-top">
                      <div className="flex justify-center gap-3">
                        {todo.status !== "complete" && (
                          <button
                            onClick={() => editTodo(actualIndex)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 bg-blue-100 hover:bg-blue-600 hover:text-white transition"
                            title="Edit"
                          >
                            <FaEdit size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteTodo(actualIndex)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-red-600 bg-red-100 hover:bg-red-600 hover:text-white transition"
                          title="Delete"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ============ MOBILE CARDS ============ */}
        <div className="md:hidden space-y-4">
          {currentTodos.map((todo, index) => {
            const actualIndex = todolist.indexOf(todo);
            const due = getDueStatus(todo);
            return (
              <div
                key={actualIndex}
                className={`rounded-3xl border p-4 shadow-sm ${cardBg}`}
              >
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="min-w-0">
                    <p className={`text-xs mb-1 ${subText}`}>
                      Task #{start + index + 1}
                    </p>
                    <h2 className="font-bold text-lg wrap-break-words whitespace-normal">
                      {todo.title}
                    </h2>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {todo.status !== "complete" && (
                      <button
                        onClick={() => editTodo(actualIndex)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-blue-600 bg-blue-100"
                      >
                        <FaEdit size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTodo(actualIndex)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-red-600 bg-red-100"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryPill(
                      todo.category
                    )}`}
                  >
                    {todo.category || "Other"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityPill(
                      todo.priority
                    )}`}
                  >
                    {todo.priority
                      ? todo.priority.charAt(0).toUpperCase() +
                        todo.priority.slice(1)
                      : "Medium"}
                  </span>
                </div>

                <div
                  className={`flex justify-between items-center text-sm py-2 border-t ${
                    darkMode ? "border-gray-800" : "border-blue-50"
                  }`}
                >
                  <span className={`font-semibold ${subText}`}>Due Date</span>
                  <span>{todo.dueDate || "No date"}</span>
                </div>

                {todo.dueDate && (
                  <div className="pb-2">
                    {due === "overdue" && (
                      <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        OVERDUE — Not completed
                      </span>
                    )}
                    {due === "today" && (
                      <span className="inline-block bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        DUE TODAY
                      </span>
                    )}
                    {due === "upcoming" && (
                      <span className="inline-block bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        UPCOMING
                      </span>
                    )}
                    {due === "completed" && (
                      <span className="inline-block bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        COMPLETED
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`text-xs pt-2 pb-3 border-t ${subText} ${
                    darkMode ? "border-gray-800" : "border-blue-50"
                  }`}
                >
                  <p>
                    <b>Created:</b> {todo.createdAt}
                  </p>
                  <p className="mt-1">
                    <b>
                      {todo.status === "pending" ? "Pending:" : "Complete:"}
                    </b>{" "}
                    {todo.status === "pending"
                      ? todo.createdAt
                      : todo.completedAt}
                  </p>
                </div>

                <button
                  onClick={() => completeTodo(actualIndex)}
                  className={`w-full py-2 rounded-2xl text-white text-sm font-semibold transition hover:scale-[1.02] ${
                    todo.status === "pending"
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                >
                  {todo.status === "pending"
                    ? "Mark as Complete"
                    : "Mark as Pending"}
                </button>
              </div>
            );
          })}
        </div>

        {/* NO TASK */}
        {filteredTodos.length === 0 && (
          <p className={`text-center mt-8 ${subText}`}>No tasks found</p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-white border border-blue-100 text-slate-600"
              } disabled:opacity-40`}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                  page === i + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white border border-blue-100 text-slate-600"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                darkMode
                  ? "bg-gray-800 text-white"
                  : "bg-white border border-blue-100 text-slate-600"
              } disabled:opacity-40`}
            >
              Next
            </button>
          </div>
        )}

        {/* ================= EDIT MODAL ================= */}
        {editIndex !== null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-3 sm:px-4 py-4 z-50 overflow-y-auto">
            <div
              className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[95vh] overflow-y-auto ${
                darkMode
                  ? "bg-gray-900 text-white"
                  : "bg-white text-slate-900"
              }`}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
                Edit Task
              </h2>

              <label className="block font-semibold mb-2 text-sm">Task</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={`w-full rounded-2xl px-4 py-3 mb-5 border outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-blue-50/40 border-blue-100"
                }`}
              />

              <label className="block font-semibold mb-2 text-sm">
                Category
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className={`w-full rounded-2xl px-4 py-3 mb-5 border outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-blue-50/40 border-blue-100"
                }`}
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>

              <label className="block font-semibold mb-2 text-sm">
                Due Date
              </label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className={`w-full rounded-2xl px-4 py-3 mb-5 border outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-blue-50/40 border-blue-100"
                }`}
              />

              <label className="block font-semibold mb-2 text-sm">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className={`w-full rounded-2xl px-4 py-3 mb-5 border outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-blue-50/40 border-blue-100"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="complete">Complete</option>
              </select>

              <label className="block font-semibold mb-2 text-sm">
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                className={`w-full rounded-2xl px-4 py-3 mb-6 border outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-blue-50/40 border-blue-100"
                }`}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={cancelEdit}
                  className={`w-full sm:w-1/2 py-3 rounded-2xl font-semibold ${
                    darkMode ? "bg-gray-800" : "bg-slate-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold shadow-lg transition"
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