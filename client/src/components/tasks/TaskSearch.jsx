function TaskSearch({ search, onSearchChange }) {
  return (
    <input
      type="text"
      value={search}
      onChange={(event) => onSearchChange(event.target.value)}
      placeholder="Search tasks..."
      className="w-full px-3.5 py-2 text-xs rounded-lg bg-white border border-[#E6E3DB] text-[#18181B] placeholder-[#8E8B82] focus:outline-none focus:border-[#657858] focus:ring-2 focus:ring-[#657858]/15"
    />
  );
}

export default TaskSearch;