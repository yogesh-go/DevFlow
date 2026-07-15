import clsx from "clsx";

const variants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  outline: "border border-slate-700 text-white hover:bg-slate-800",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-6 py-3 text-lg",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  ...props
}) {
  return (
    <button
      className={clsx(
        "rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        disabled && "opacity-50 cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;