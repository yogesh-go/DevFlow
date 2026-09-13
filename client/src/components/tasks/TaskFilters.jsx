function TaskFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2.5">
      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="px-3 py-1.5 text-xs rounded-md bg-white border border-[#E6E3DB] text-[#18181B] focus:outline-none focus:border-[#657858]"
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
        className="px-3 py-1.5 text-xs rounded-md bg-white border border-[#E6E3DB] text-[#18181B] focus:outline-none focus:border-[#657858]"
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