import clsx from "clsx";

function Input({
  label,
  error,
  helperText,
  className = "",
  required = false,
  icon: Icon,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-xs font-medium text-[#575653]">
          {label}
          {required && <span className="text-[#933D3D]"> *</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3.5 h-4 w-4 text-[#8E8B82] pointer-events-none" />
        )}
        <input
          className={clsx(
            "w-full rounded-lg border border-[#E6E3DB] bg-white px-3.5 py-2.5 text-sm text-[#18181B]",
            "placeholder:text-[#8E8B82] outline-none transition-all duration-150",
            "focus:border-[#657858] focus:ring-2 focus:ring-[#657858]/15",
            error && "border-[#E8BFBF] focus:border-[#933D3D] focus:ring-[#933D3D]/15",
            Icon && "pl-10",
            className
          )}
          {...props}
        />
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-[#8E8B82]">{helperText}</p>
      )}

      {error && (
        <p className="mt-1 text-xs text-[#933D3D]">{error}</p>
      )}
    </div>
  );
}

export default Input;