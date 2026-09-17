import TaskItem from "./TaskItem";

function TaskList({ todolist, onDelete, onEdit }) {
  if (todolist.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">No tasks added yet.</p>
    );
  }

  return (
    <ul className="mt-6 space-y-3">
      {todolist.map((task, index) => (
        <TaskItem
          key={index}
          index={index}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TaskList;
