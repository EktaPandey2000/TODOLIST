function TaskForm({ onAddTask }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const toName = event.target.toName.value.trim();

    if (toName === "") {
      return;
    }

    onAddTask(toName);
    event.target.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-2xl shadow-lg flex gap-3"
    >
      <input
        type="text"
        name="toName"
        placeholder="Enter your task..."
        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
      />

      <button
        type="submit"
        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
      >
        Save
      </button>
    </form>
  );
}

export default TaskForm;
