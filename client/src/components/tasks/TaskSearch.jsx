function TaskSearch({ search, onSearchChange }) {
  return (
    <input
      type="text"
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search tasks..."
      className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default TaskSearch;