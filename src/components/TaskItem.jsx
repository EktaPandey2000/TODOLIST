import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

function TaskItem({ index, task, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task);

  const startEdit = () => {
    setEditValue(task);
    setIsEditing(true);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();

    if (trimmed === "") {
      return;
    }

    onEdit(index, trimmed);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      saveEdit();
    } else if (event.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <li className="bg-white rounded-xl shadow-md px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-purple-600 font-bold">{index + 1}.</span>

        {isEditing ? (
          <input
            type="text"
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-purple-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-200"
          />
        ) : (
          <span className="text-gray-700 font-medium">{task}</span>
        )}
      </div>

      <div className="flex items-center gap-4 ml-3">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={saveEdit}
              className="text-green-500 text-xl hover:text-green-700 hover:scale-110 transition-all duration-300"
            >
              <FaCheck />
            </button>

            <button
              type="button"
              onClick={cancelEdit}
              className="text-gray-400 text-xl hover:text-gray-600 hover:scale-110 transition-all duration-300"
            >
              <FaTimes />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={startEdit}
              className="text-green-500 text-xl hover:text-green-700 hover:scale-110 hover:rotate-12 transition-all duration-300"
            >
              <FaEdit />
            </button>

            <button
              type="button"
              onClick={() => onDelete(index)}
              className="text-red-500 text-xl hover:text-red-700 hover:scale-110 hover:rotate-12 transition-all duration-300"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

export default TaskItem;
