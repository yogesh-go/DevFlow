function TaskFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Status</option>
        <option value="todo">Todo</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={priority}
        onChange={(event) =>
          onPriorityChange(event.target.value)
        }
        className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}

export default TaskFilters;