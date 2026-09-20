import { useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";

function TaskItem({ index, task, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task);
  const save = () => {
    const newValue = value.trim();
    if (!newValue) return;
    onEdit(index, newValue);
    setEditing(false);
  };

  return (
    <li className="bg-white rounded-xl shadow-md px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-purple-600 font-bold">
          {index + 1}.
        </span>
        {editing ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") setEditing(false);
            }}
            className="flex-1 border border-purple-300 rounded-lg px-3 py-1.5 outline-none"
          />
        ) : (
          <span className="text-gray-700 font-medium">
            {task}
          </span>
        )}
      </div>

      <div className="flex gap-4 ml-3">
        {editing ? (
          <>
            <button onClick={save} className="text-green-500 text-xl">
              <FaCheck />
            </button>

            <button
              onClick={() => setEditing(false)}
              className="text-gray-400 text-xl"
            >
              <FaTimes />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setValue(task);
                setEditing(true);
              }}
              className="text-green-500 text-xl"
            >
              <FaEdit />
            </button>

            <button
              onClick={() => onDelete(index)}
              className="text-red-500 text-xl"
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