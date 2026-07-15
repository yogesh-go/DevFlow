function Input({
  label,
  error,
  className = "",
  required = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <input
        className={`
          w-full
          rounded-lg
          border
          border-slate-700
          bg-slate-900
          px-4
          py-3
          text-white
          placeholder:text-slate-500
          outline-none
          transition-all
          duration-200
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/30
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;